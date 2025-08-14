require('dotenv').config();
const express = require('express');
const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');
const compression = require('compression');
const cors = require('cors');
const morgan = require('morgan');
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

// Disable CORS protection
app.use(cors());

// Enable compression
app.use(compression());

// Parse cookies
app.use(cookieParser());

// CSRF protection has been disabled
// const csrfProtection = csrf({
//   cookie: {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === 'production',
//     sameSite: 'strict'
//   }
// });

// Parse request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.text({ type: 'text/csv' }));  // Add support for text/csv

// Enable request logging
const accessLogStream = fsSync.createWriteStream(path.join(LOG_DIR, 'access.log'), { flags: 'a' });
app.use(morgan('combined', { stream: accessLogStream }));

// Security headers removed as per instruction
// app.use(helmet(...));
// Note: Strict security settings should be restored in production environments.
// Request rate limiting has been disabled
// const apiLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // 100 requests per IP address per 15 minutes
//   standardHeaders: true,
//   legacyHeaders: false,
//   message: { error: 'リクエストが多すぎます。しばらく待ってからやり直してください。' }
// });
// app.use('/api', apiLimiter);
app.use('/api', express.json());
// app.use('/save-diary', apiLimiter);

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

// CSRF token endpoint has been disabled
// app.get('/api/csrf-token', csrfProtection, (req, res) => {
//   res.json({ csrfToken: req.csrfToken() });
// });

// Simplify the root route handler (without CSRF)
app.get('/', async (req, res) => {
    try {
        const htmlPath = path.join(__dirname, 'index.html');
        let htmlContent = await fs.readFile(htmlPath, 'utf8');
        res.send(htmlContent);
    } catch (error) {
        console.error('HTMLファイルの読み込みエラー:', error);
        res.status(500).send('サーバーエラーが発生しました');
    }
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
app.post('/save-diary', async (req, res) => {
  // CSRF protection has been disabled
  // console.log('CSRF Token Validation:', req.csrfToken());
  // console.log('Incoming X-CSRF-Token header:', req.headers['x-csrf-token']);
  // res.setHeader('X-CSRF-Token', req.csrfToken());
  
  // res.cookie('XSRF-TOKEN', req.csrfToken());
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
        
        await fs.writeFile(csvPath, csvData, 'utf8');
        // Note: All security sanitization has been disabled
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
app.post('/api/logs', async (req, res) => {
  // CSRF protection has been disabled
  // res.cookie('XSRF-TOKEN', req.csrfToken());
    try {
        const logs = req.body;
        if (!Array.isArray(logs)) {
            return res.status(400).json({ error: 'ログ形式が無効です' });
        }
        // All log validation has been disabled
        
        // Create log directory if it doesn't exist
        await fs.mkdir(LOG_DIR, { recursive: true });
        
        const logDate = new Date().toISOString().split('T')[0];
        const logFile = path.join(LOG_DIR, `${logDate}.log`);
        
        const logEntries = logs.map(log => 
            `[${log.timestamp.replace(/`/g, '\\`')}] ${log.level.replace(/`/g, '\\`')}: ${log.message.replace(/`/g, '\\`')}${log.error ? '\n' + (() => { try { return JSON.stringify(log.error, null, 2).replace(/`/g, '\\`'); } catch (e) { return 'Error serializing error: ' + e.message.replace(/`/g, '\\`'); } })() : ''}`
        ).join('\n') + '\n';
        
        await fs.appendFile(logFile, logEntries);
        res.status(200).json({ message: 'ログを保存しました' });
    } catch (error) {
        console.error('保存ログに失敗しました:', error);
        res.status(500).json({ error: '保存ログに失敗しました', code: error.code, details: process.env.NODE_ENV === 'development' ? error.message : 'サーバー内部エラー' });
    }
});

// API route handler for deleting diary entries
app.delete('/delete-diary/:id', async (req, res) => {
  // CSRF protection has been disabled
  // res.cookie('XSRF-TOKEN', req.csrfToken());
  try {
    const diaryId = req.params.id;

    const csvPath = path.join(__dirname, 'diaries.csv');
    await backupCSV();
    const data = await fs.readFile(csvPath, 'utf8');
    const lines = data.split('\n');
    const header = lines[0];
    const entries = lines.slice(1).filter(line => line.trim() !== '');

    const updatedEntries = entries.filter(line => !line.startsWith(`${diaryId},`));
    const updatedData = [header, ...updatedEntries].join('\n');

    await fs.writeFile(csvPath, updatedData, 'utf8');
    res.status(200).json({ message: '日記を削除しました' });
  } catch (error) {
    console.error('日記削除エラー:', error);
    res.status(500).json({ error: '日記削除に失敗しました', details: process.env.NODE_ENV === 'development' ? error.message : 'サーバー内部エラー' });
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

// Simplified error handling (all protection disabled)
app.use((err, req, res, next) => {
    res.status(200).send('エラーが発生しました');
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
