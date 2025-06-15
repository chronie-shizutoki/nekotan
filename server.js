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
    origin: function(origin, callback) {
        // 只允许特定域名访问
        const allowedOrigins = ['http://localhost:3000', 'https://your-trusted-domain.com'];
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('不允许的跨域请求'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Type', 'Content-Disposition']
}));

// 启用压缩
app.use(compression());

// 解析Cookie
app.use(cookieParser());

// CSRF保护配置
const csrfProtection = csrf({
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  }
});

// 请求解析
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.text({ type: 'text/csv' }));  // 添加对 text/csv 的支持

// 启用请求日志
const accessLogStream = fsSync.createWriteStream(path.join(LOG_DIR, 'access.log'), { flags: 'a' });
app.use(morgan('combined', { stream: accessLogStream }));

// 基本安全设置
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

// API路由配置必须在静态文件服务之前
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100, // 每个IP限制100请求
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: '请求过于频繁，请稍后再试' }
});
app.use('/api', apiLimiter);
app.use('/api', express.json());
app.use('/save-diary', apiLimiter);

// 静态文件服务配置
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

// CSRF令牌获取端点
app.get('/api/csrf-token', csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// 根路由处理
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '静時ねこちゃん.html'));
});

// 确保 CSV 文件存在
async function ensureCSVFile() {
    const csvPath = path.join(__dirname, 'diaries.csv');
    try {
        await fs.access(csvPath);
    } catch {
        await fs.writeFile(csvPath, 'id,date,content,category,tags\n', 'utf8');
    }
}

// 备份 CSV 文件
async function backupCSV() {
    try {
        const timestamp = new Date().toISOString().replace(/:/g, '-');
        const sourceFile = path.join(__dirname, 'diaries.csv');
        const backupFile = path.join(BACKUP_DIR, `diaries-${timestamp}.csv`);
        await fs.copyFile(sourceFile, backupFile);
        console.log(`已创建备份: ${backupFile}`);
    } catch (error) {
        console.error('备份失败:', error);
        throw error;
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
app.post('/save-diary', csrfProtection, async (req, res) => {
  res.cookie('XSRF-TOKEN', req.csrfToken());
    try {
        const csvData = req.body;
        if (!csvData || typeof csvData !== 'string') {
            console.error('无效的数据类型:', typeof csvData);
            return res.status(400).json({ error: '无效的数据格式' });
        }

        // 验证 CSV 格式
        if (!csvData.startsWith('id,date,content,category,tags\n')) {
            console.error('无效的 CSV 格式');
            return res.status(400).json({ error: '无效的 CSV 格式' });
        }
        
        const csvPath = path.join(__dirname, 'diaries.csv');
        await ensureDirectories();
        
        // 写入之前先进行备份
        if (fsSync.existsSync(csvPath)) {
            await backupCSV();
        }
        
        // 净化CSV内容防止注入攻击
        const sanitizedCsv = csvData.split('\n').map(line => {
          if (!line.trim()) return line;
          return line.split(',').map(cell => {
            // 转义以=、+、-、@开头的单元格
            if (/^[=+\-@]/.test(cell.trim())) {
              return `'${cell}`;
            }
            return cell;
          }).join(',');
        }).join('\n');
        await fs.writeFile(csvPath, sanitizedCsv, 'utf8');
        res.status(200).json({ message: '保存成功' });
    } catch (error) {
        console.error('保存失败:', error.stack);
        res.status(500).json({ 
            error: '保存失败',
            message: process.env.NODE_ENV === 'development' ? error.message : '服务器内部错误'
        });
    }
});

// API路由处理
app.post('/api/logs', csrfProtection, async (req, res) => {
  res.cookie('XSRF-TOKEN', req.csrfToken());
    try {
        const logs = req.body;
        if (!Array.isArray(logs)) {
            return res.status(400).json({ error: '无效的日志格式' });
        }
        // 验证每个日志条目的结构
        for (const log of logs) {
            if (typeof log !== 'object' || !log.timestamp || !log.level || !log.message) {
                return res.status(400).json({ error: '日志条目格式无效' });
            }
            // 验证timestamp格式
            if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(log.timestamp)) {
                return res.status(400).json({ error: '无效的时间戳格式' });
            }
            // 验证日志级别
            const allowedLevels = ['info', 'warn', 'error', 'debug'];
            if (!allowedLevels.includes(log.level)) {
                return res.status(400).json({ error: '无效的日志级别' });
            }
            // 限制message长度
            if (log.message.length > 1000) {
                return res.status(400).json({ error: '日志消息过长' });
            }
        }
        
        // 确保日志目录存在
        await fs.mkdir(LOG_DIR, { recursive: true });
        
        const logDate = new Date().toISOString().split('T')[0];
        const logFile = path.join(LOG_DIR, `${logDate}.log`);
        
        const logEntries = logs.map(log => 
            `[${log.timestamp}] ${log.level}: ${log.message}${log.error ? '\n' + JSON.stringify(log.error, null, 2) : ''}`
        ).join('\n') + '\n';
        
        await fs.appendFile(logFile, logEntries);
        res.status(200).json({ message: '日志已保存' });
    } catch (error) {
        console.error('保存日志失败:', error);
        res.status(500).json({ error: '保存日志失败', details: process.env.NODE_ENV === 'development' ? error.message : '服务器内部错误' });
    }
});

// 获取日记数据
app.get('/diaries.csv', async (req, res) => {
    try {
        const csvPath = path.join(__dirname, 'diaries.csv');
        
        // 如果文件不存在，创建一个空的日记文件
        if (!fsSync.existsSync(csvPath)) {
            await ensureCSVFile();
        }
        
        const data = await fs.readFile(csvPath, 'utf8');
        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', 'inline; filename="diaries.csv"');
        res.send(data);
    } catch (error) {
        console.error('读取日记失败:', error);
        res.status(500).json({ error: '读取日记失败', details: process.env.NODE_ENV === 'development' ? error.message : '服务器内部错误' });
    }
});

// 错误处理中间件
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('服务器出错了！');
});

// 404 处理
app.use((req, res, next) => {
    res.status(404).send('找不到请求的资源');
});

// 启动服务器
const PORT = process.env.PORT || 3000;

initialize().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});
