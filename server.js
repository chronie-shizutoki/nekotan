const express = require('express');
const fs = require('fs').promises;
const path = require('path');

// 创建日志目录
const LOG_DIR = path.join(__dirname, 'logs');
const BACKUP_DIR = path.join(__dirname, 'backups');

async function ensureDirectories() {
    await fs.mkdir(LOG_DIR, { recursive: true });
    await fs.mkdir(BACKUP_DIR, { recursive: true });
}

// 日志文件处理
async function writeLog(logs) {
    const date = new Date().toISOString().split('T')[0];
    const logFile = path.join(LOG_DIR, `${date}.log`);
    
    const logEntries = logs.map(log => 
        `[${log.timestamp}] ${log.level}: ${log.message}${log.error ? '\n' + JSON.stringify(log.error, null, 2) : ''}`
    ).join('\n') + '\n';

    await fs.appendFile(logFile, logEntries, 'utf8');
}

// CSV 文件备份
async function backupCSV() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(BACKUP_DIR, `diaries-${timestamp}.csv`);
    try {
        await fs.copyFile('diaries.csv', backupPath);
        console.log(`Backup created: ${backupPath}`);
    } catch (error) {
        console.error('Backup failed:', error);
    }
}

const app = express();

// 确保所有请求都能正确处理中文路径
app.use((req, res, next) => {
    req.url = decodeURIComponent(req.url);
    next();
});

// 设置静态文件服务
app.use(express.static(__dirname));
app.use(express.text({ type: 'text/csv' }));
app.use(express.json());

// 根路由处理
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '静時ねこちゃん.html'));
});

// 确保 CSV 文件存在
async function ensureCSVFile() {
    try {
        await fs.access('diaries.csv');
    } catch {
        await fs.writeFile('diaries.csv', 'id,date,content,category\n');
        console.log('Created new diaries.csv file');
    }
}

// API 路由
app.post('/api/logs', async (req, res) => {
    try {
        await writeLog(req.body);
        res.json({ success: true });
    } catch (error) {
        console.error('Error writing logs:', error);
        res.status(500).json({ success: false, error: 'Failed to write logs' });
    }
});

// CSV 文件保存处理
app.post('/save-diary', async (req, res) => {
    try {
        await ensureCSVFile();
        await fs.writeFile('diaries.csv', req.body);
        await backupCSV(); // 创建备份
        res.json({ success: true });
    } catch (error) {
        console.error('Error saving diary:', error);
        res.status(500).json({ 
            success: false, 
            error: '日記の保存中にエラーが発生しました。' 
        });
    }
});

// CSV 文件读取处理
app.get('/diaries.csv', async (req, res) => {
    try {
        await ensureCSVFile();
        const data = await fs.readFile('diaries.csv', 'utf-8');
        res.type('text/csv').send(data);
    } catch (error) {
        console.error('Error reading diary:', error);
        res.status(500).json({ 
            success: false, 
            error: '日記の読み込み中にエラーが発生しました。' 
        });
    }
});

// 错误处理中间件
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error: 'サーバーエラーが発生しました。'
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
    await ensureDirectories();
    await ensureCSVFile();
    console.log(`Server is running on port ${PORT}`);
});