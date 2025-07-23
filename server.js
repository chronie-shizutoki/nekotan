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

// ログディレクトリを作成
const LOG_DIR = path.join(__dirname, 'logs');
const BACKUP_DIR = path.join(__dirname, 'backups');
const UPLOADS_DIR = path.join(__dirname, 'public', 'uploads');

// 必要なディレクトリを確認
async function ensureDirectories() {
    await Promise.all([
        fs.mkdir(LOG_DIR, { recursive: true }),
        fs.mkdir(BACKUP_DIR, { recursive: true }),
        fs.mkdir(UPLOADS_DIR, { recursive: true })
    ]);
}

const app = express();

// CORS を有効化
app.use(cors({
    origin: function(origin, callback) {
        // 特定のドメインのみを許可
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

// 有効化
app.use(compression());

// Cookie を解析
app.use(cookieParser());

// CSRF 保護の設定
const csrfProtection = csrf({
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  }
});

// リクエスト解析
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.text({ type: 'text/csv' }));  // text/csv のサポートを追加

// リクエストログを有効化
const accessLogStream = fsSync.createWriteStream(path.join(LOG_DIR, 'access.log'), { flags: 'a' });
app.use(morgan('combined', { stream: accessLogStream }));

// 基本的なセキュリティ設定
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

// APIルート設定は静的ファイルサービスより前に行う必要があります
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分
  max: 100, // 各IPアドレスに対する15分間のリクエスト上限は100件
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'リクエストが多すぎます。しばらく待ってからやり直してください。' }
});
app.use('/api', apiLimiter);
app.use('/api', express.json());
app.use('/save-diary', apiLimiter);

// 静的ファイルサービスを設定
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

// CSRFトークン取得エンドポイント
app.get('/api/csrf-token', csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// 根ルート処理
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '静時ねこたん.html'));
});

// バックアップを作成する
async function ensureCSVFile() {
    const csvPath = path.join(__dirname, 'diaries.csv');
    try {
        await fs.access(csvPath);
    } catch {
        await fs.writeFile(csvPath, 'id,date,content,category,tags\n', 'utf8');
    }
}

// バックアップを作成する
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

// 初期化
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

// APIルート処理
app.post('/save-diary', csrfProtection, async (req, res) => {
  res.cookie('XSRF-TOKEN', req.csrfToken());
    try {
        const csvData = req.body;
        if (!csvData || typeof csvData !== 'string') {
            console.error('無効なデータ型:', typeof csvData);
            return res.status(400).json({ error: '無効なデータ形式' });
        }

        // CSV形式を検証する
        if (!csvData.startsWith('id,date,content,category,tags\n')) {
            console.error('無効なCSV形式');
            return res.status(400).json({ error: '無効なCSV形式' });
        }
        
        const csvPath = path.join(__dirname, 'diaries.csv');
        await ensureDirectories();
        
        // 書き込み前にバックアップを作成する
        if (fsSync.existsSync(csvPath)) {
            await backupCSV();
        }
        
        // CSV内容を浄化して注入攻撃を防ぐ
        const sanitizedCsv = csvData.split('\n').map(line => {
          if (!line.trim()) return line;
          return line.split(',').map(cell => {
            // =、+、-、@で始まるセルをエスケープする
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

// APIルート処理
app.post('/api/logs', csrfProtection, async (req, res) => {
  res.cookie('XSRF-TOKEN', req.csrfToken());
    try {
        const logs = req.body;
        if (!Array.isArray(logs)) {
            return res.status(400).json({ error: 'ログ形式が無効です' });
        }
        // 各ログエントリの構造を検証する
        for (const log of logs) {
            if (typeof log !== 'object' || !log.timestamp || !log.level || !log.message) {
                return res.status(400).json({ error: 'ログ条目形式が無効です' });
            }
            // ログのタイムスタンプ形式を検証する
            if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(log.timestamp)) {
                return res.status(400).json({ error: 'ログのタイムスタンプ形式が無効です' });
            }
            // ログレベルを検証する
            const allowedLevels = ['info', 'warn', 'error', 'debug'];
            if (!allowedLevels.includes(log.level)) {
                return res.status(400).json({ error: 'ログレベルが無効です' });
            }
            // ログメッセージの長さを制限する
            if (log.message.length > 1000) {
                return res.status(400).json({ error: 'ログメッセージが过长です' });
            }
        }
        
        // ログディレクトリが存在しない場合は、空のログディレクトリを作成する
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

// 日記データを取得する
app.get('/diaries.csv', async (req, res) => {
    try {
        const csvPath = path.join(__dirname, 'diaries.csv');
        
        // 日記ファイルが存在しない場合は、空の日記ファイルを作成する
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

// エラー処理ミドルウェア
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('サーバーにエラーが発生しました！');
});

// 404 処理
app.use((req, res, next) => {
    res.status(404).send('要求されたリソースが見つかりません');
});

// サーバーを起動する
const PORT = process.env.PORT || 3000;

initialize().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});
