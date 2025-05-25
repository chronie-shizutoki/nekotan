require('dotenv').config();
const express = require('express');
const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');
const helmet = require('helmet');
const compression = require('compression');
const cors = require('cors');
const morgan = require('morgan');

// 创建日志目录
const LOG_DIR = path.join(__dirname, 'logs');
const BACKUP_DIR = path.join(__dirname, 'backups');
const UPLOADS_DIR = path.join(__dirname, 'public', 'uploads');

// 确保必要的目录存在
async function ensureDirectories() {
    await Promise.all([
        fs.mkdir(LOG_DIR, { recursive: true }),
        fs.mkdir(BACKUP_DIR, { recursive: true }),
        fs.mkdir(UPLOADS_DIR, { recursive: true })
    ]);
}

const app = express();

// 启用 CORS
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type']
}));

// 启用压缩
app.use(compression());

// 启用请求日志
const accessLogStream = fsSync.createWriteStream(path.join(LOG_DIR, 'access.log'), { flags: 'a' });
app.use(morgan('combined', { stream: accessLogStream }));

// 请求解析
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 静态文件服务配置
app.use('/', express.static(path.join(__dirname, 'public'), {
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

// 根路由处理
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '静時ねこちゃん.html'));
});

// 基本安全设置
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            fontSrc: ["'self'"],
            imgSrc: ["'self'", 'data:', 'blob:'],
            connectSrc: ["'self'"]
        }
    }
}));

// 确保 CSV 文件存在
async function ensureCSVFile() {
    const csvPath = path.join(__dirname, 'diaries.csv');
    try {
        await fs.access(csvPath);
    } catch {
        await fs.writeFile(csvPath, 'id,date,content,category,tags\n', 'utf8');
    }
}

// 初始化
async function initialize() {
    try {
        await ensureDirectories();
        await ensureCSVFile();
        console.log('初始化完成');
    } catch (error) {
        console.error('初始化失败:', error);
        process.exit(1);
    }
}

// API路由处理
app.post('/save-diary', async (req, res) => {
    try {
        const csvData = req.body;
        await fs.writeFile('diaries.csv', csvData, 'utf8');
        await backupCSV();
        res.status(200).send('保存成功');
    } catch (error) {
        console.error('保存失败:', error);
        res.status(500).send('保存失败');
    }
});

// 启动服务器
const PORT = process.env.PORT || 3000;

initialize().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});
