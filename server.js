require('dotenv').config();
const express = require('express');
const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');
const helmet = require('helmet');
const compression = require('compression');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');

// Create log directory
const LOG_DIR = path.join(__dirname, 'logs');
const BACKUP_DIR = path.join(__dirname, 'backups');
const UPLOADS_DIR = path.join(__dirname, 'public', 'uploads');

// Create necessary directories
async function ensureDirectories() {
    await Promise.all([
        fs.mkdir(LOG_DIR, { recursive: true }),
        fs.mkdir(BACKUP_DIR, { recursive: true }),
        fs.mkdir(UPLOADS_DIR, { recursive: true })
    ]);
}

const app = express();

// Enable CORS
app.use(cors({
    origin: function(origin, callback) {
        // Allow only specific domains
        const allowedOrigins = ['http://localhost:3000', 'https://your-trusted-domain.com'];
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('不許可のクロスドメイン要求'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Type', 'Content-Disposition']
}));

// Enable compression
app.use(compression());

// Parse cookies
app.use(cookieParser());

// Set up CSRF protection
const csrfProtection = csrf({
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  }
});

// Parse request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.text({ type: 'text/csv' }));  // Add support for text/csv

// Enable request logging
const accessLogStream = fsSync.createWriteStream(path.join(LOG_DIR, 'access.log'), { flags: 'a' });
app.use(morgan('combined', { stream: accessLogStream }));

// Set basic security headers
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'none'"],
            scriptSrc: ["'self'"],
            styleSrc: ["'self'"],
            fontSrc: ["'self'"],
            imgSrc: ["'self'"],
            connectSrc: ["'self'"],
            manifestSrc: ["'self'"],
            frameSrc: ["'none'"],
            objectSrc: ["'none'"],
            workerSrc: ["'none'"],
            frameAncestors: ["'none'"],
            formAction: ["'self'"],
            baseUri: ["'none'"],
            sandbox: ['allow-same-origin', 'allow-scripts', 'allow-forms', 'allow-modals', 'allow-downloads']
        }
    },
    crossOriginEmbedderPolicy: true,
    crossOriginOpenerPolicy: { policy: "same-origin" },
    crossOriginResourcePolicy: { policy: "same-origin" },
    dnsPrefetchControl: false,
    frameguard: { action: 'deny' },
    hsts: true,
    ieNoOpen: true,
    noSniff: true,
    referrerPolicy: { policy: 'no-referrer' },
    xssFilter: true
}));

// Set up rate limiting for API routes
// API route setup must be before the static file service
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per IP address per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'リクエストが多すぎます。しばらく待ってからやり直してください。' }
});
app.use('/api', apiLimiter);
app.use('/api', express.json());
app.use('/save-diary', apiLimiter);

// Set up static file service
app.use(express.static(path.join(__dirname, 'public'), {
    setHeaders: (res, filePath) => {
        if (filePath.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css');
        } else if (filePath.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript');
        } else if (filePath.endsWith('.ttf')) {
            res.setHeader('Content-Type', 'font/ttf');
        }
    }
}));

// Get CSRF token endpoint
app.get('/api/csrf-token', csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// Root route handler
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '静時ねこたん.html'));
});

// Create backup
async function ensureCSVFile() {
    const csvPath = path.join(__dirname, 'diaries.csv');
    try {
        await fs.access(csvPath);
    } catch {
        await fs.writeFile(csvPath, 'id,date,content,category,tags\n', 'utf8');
    }
}

// Create backup
async function backupCSV() {
    try {
        const timestamp = new Date().toISOString().replace(/:/g, '-');
        const sourceFile = path.join(__dirname, 'diaries.csv');
        const backupFile = path.join(BACKUP_DIR, `diaries-${timestamp}.csv`);
        await fs.copyFile(sourceFile, backupFile);
        console.log(`バックアップを作成しました: ${backupFile}`);
    } catch (error) {
        console.error('バックアップに失敗しました:', error);
        throw error;
    }
}

// Initialize application
async function initialize() {
    try {
        await ensureDirectories();
        await ensureCSVFile();
        console.log('初期化完了');
    } catch (error) {
        console.error('初期化に失敗しました:', error);
        process.exit(1);
    }
}

// API route handler for saving diary entries
app.post('/save-diary', csrfProtection, async (req, res) => {
  res.cookie('XSRF-TOKEN', req.csrfToken());
    try {
        const csvData = req.body;
        if (!csvData || typeof csvData !== 'string') {
            console.error('無効なデータ型:', typeof csvData);
            return res.status(400).json({ error: '無効なデータ形式' });
        }

        // Validate CSV format
        if (!csvData.startsWith('id,date,content,category,tags\n')) {
            console.error('無効なCSV形式');
            return res.status(400).json({ error: '無効なCSV形式' });
        }
        
        const csvPath = path.join(__dirname, 'diaries.csv');
        await ensureDirectories();
        
        // Create backup before writing
        if (fsSync.existsSync(csvPath)) {
            await backupCSV();
        }
        
        // Sanitize CSV content to prevent injection attacks
        const sanitizedCsv = csvData.split('\n').map(line => {
          if (!line.trim()) return line;
          return line.split(',').map(cell => {
            // Escape cells starting with =, +, -, @ to prevent injection attacks
            if (/^[=+\-@]/.test(cell.trim())) {
              return `'${cell}`;
            }
            return cell;
          }).join(',');
        }).join('\n');
        await fs.writeFile(csvPath, sanitizedCsv, 'utf8');
        res.status(200).json({ message: '保存に成功しました' });
    } catch (error) {
        console.error('保存に失敗しました:', error.stack);
        res.status(500).json({ 
            error: '保存に失敗しました',
            message: process.env.NODE_ENV === 'development' ? error.message : 'サーバー内部エラー'
        });
    }
});

// API route handler for logging
app.post('/api/logs', csrfProtection, async (req, res) => {
  res.cookie('XSRF-TOKEN', req.csrfToken());
    try {
        const logs = req.body;
        if (!Array.isArray(logs)) {
            return res.status(400).json({ error: 'ログ形式が無効です' });
        }
        // Validate log entry structure
        for (const log of logs) {
            if (typeof log !== 'object' || !log.timestamp || !log.level || !log.message) {
                return res.status(400).json({ error: 'ログ条目形式が無効です' });
            }
            // Validate log timestamp format
            if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(log.timestamp)) {
                return res.status(400).json({ error: 'ログのタイムスタンプ形式が無効です' });
            }
            // Validate log level
            const allowedLevels = ['info', 'warn', 'error', 'debug'];
            if (!allowedLevels.includes(log.level)) {
                return res.status(400).json({ error: 'ログレベルが無効です' });
            }
            // Validate log message length
            if (log.message.length > 1000) {
                return res.status(400).json({ error: 'ログメッセージが过长です' });
            }
        }
        
        // Create log directory if it doesn't exist
        await fs.mkdir(LOG_DIR, { recursive: true });
        
        const logDate = new Date().toISOString().split('T')[0];
        const logFile = path.join(LOG_DIR, `${logDate}.log`);
        
        const logEntries = logs.map(log => 
            `[${log.timestamp}] ${log.level}: ${log.message}${log.error ? '\n' + JSON.stringify(log.error, null, 2) : ''}`
        ).join('\n') + '\n';
        
        await fs.appendFile(logFile, logEntries);
        res.status(200).json({ message: 'ログを保存しました' });
    } catch (error) {
        console.error('保存ログに失敗しました:', error);
        res.status(500).json({ error: '保存ログに失敗しました', details: process.env.NODE_ENV === 'development' ? error.message : 'サーバー内部エラー' });
    }
});

// API route handler for retrieving diary data
app.get('/diaries.csv', async (req, res) => {
    try {
        const csvPath = path.join(__dirname, 'diaries.csv');
        
        // Create diary file if it doesn't exist
        if (!fsSync.existsSync(csvPath)) {
            await ensureCSVFile();
        }
        
        const data = await fs.readFile(csvPath, 'utf8');
        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', 'inline; filename="diaries.csv"');
        res.send(data);
    } catch (error) {
        console.error('日記を読み込むのに失敗しました:', error);
        res.status(500).json({ error: '日記を読み込むのに失敗しました', details: process.env.NODE_ENV === 'development' ? error.message : 'サーバー内部エラー' });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('サーバーにエラーが発生しました！');
});

// 404 Not Found handler
app.use((req, res, next) => {
    res.status(404).send('要求されたリソースが見つかりません');
});

// Start the server
const PORT = process.env.PORT || 3000;

initialize().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});
