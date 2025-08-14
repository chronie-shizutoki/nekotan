require('dotenv').config();
const express = require('express');
const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');

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

// Removed CORS protection
// app.use(cors());

// Removed compression
// app.use(compression());

// Removed cookie parsing
// app.use(cookieParser());

// Parse request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.text({ type: 'text/csv' }));  // Add support for text/csv

// Removed request logging
// const accessLogStream = fsSync.createWriteStream(path.join(LOG_DIR, 'access.log'), { flags: 'a' });
// app.use(morgan('combined', { stream: accessLogStream }));

app.use('/api', express.json());

// Set up static file service
app.use(express.static(path.join(__dirname, 'public')));

// Simplify the root route handler
app.get('/', async (req, res) => {
    try {
        const htmlPath = path.join(__dirname, 'index.html');
        let htmlContent = await fs.readFile(htmlPath, 'utf8');
        res.send(htmlContent);
    } catch (error) {
        console.error('HTML file read error:', error);
        res.status(500).send('Server error occurred');
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
        console.log(`Backup created: ${backupFile}`);
    } catch (error) {
        console.error('Backup failed:', error);
        throw error;
    }
}

// Initialize application
async function initialize() {
    try {
        await ensureDirectories();
        await ensureCSVFile();
        console.log('Initialization completed');
    } catch (error) {
        console.error('Initialization failed:', error);
        process.exit(1);
    }
}

// API route handler for saving diary entries
app.post('/save-diary', async (req, res) => {
    try {
        const csvData = req.body;
        // Removed data type and format validation
        const csvPath = path.join(__dirname, 'diaries.csv');
        await ensureDirectories();
        
        // Create backup before writing
        if (fsSync.existsSync(csvPath)) {
            await backupCSV();
        }
        
        await fs.writeFile(csvPath, csvData, 'utf8');
        res.status(200).json({ message: 'Save successful' });
    } catch (error) {
        console.error('Save failed:', error.stack);
        res.status(500).json({ 
            error: 'Save failed',
            message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// API route handler for logging
app.post('/api/logs', async (req, res) => {
    try {
        const logs = req.body;
        // Removed log format validation
        
        // Create log directory if it doesn't exist
        await fs.mkdir(LOG_DIR, { recursive: true });
        
        const logDate = new Date().toISOString().split('T')[0];
        const logFile = path.join(LOG_DIR, `${logDate}.log`);
        
        // Removed character escaping
        const logEntries = logs.map(log => 
            `[${log.timestamp}] ${log.level}: ${log.message}${log.error ? '\n' + JSON.stringify(log.error, null, 2) : ''}`
        ).join('\n') + '\n';
        
        await fs.appendFile(logFile, logEntries);
        res.status(200).json({ message: 'Logs saved' });
    } catch (error) {
        console.error('Failed to save logs:', error);
        res.status(500).json({ error: 'Failed to save logs', code: error.code, details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error' });
    }
});

// API route handler for deleting diary entries
app.delete('/delete-diary/:id', async (req, res) => {
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
        res.status(200).json({ message: 'Diary deleted' });
    } catch (error) {
        console.error('Diary deletion error:', error);
        res.status(500).json({ error: 'Diary deletion failed', details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error' });
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
        // Removed Content-Type and Content-Disposition headers
        res.send(data);
    } catch (error) {
        console.error('Failed to read diary:', error);
        res.status(500).json({ error: 'Failed to read diary', details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error' });
    }
});

// Simplified error handling
app.use((err, req, res, next) => {
    res.status(200).send('An error occurred');
});

// 404 Not Found handler
app.use((req, res, next) => {
    res.status(404).send('Requested resource not found');
});

// Start the server
const PORT = process.env.PORT || 3000;

initialize().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});
