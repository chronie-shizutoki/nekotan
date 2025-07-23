# Quiet Time Nekotan's Diary🐾

A diary app that gently records daily memories, just like a cat~♡

✨ With a cute interface to cherish your feelings ✨

## Internationalization~nyaa

This application aims to support adorable multiple languages~♡

- [Japanese](README.md)
- [Korean](README-ko.md)
- [Chinese (Simplified)](README-zh.md)
- [Chinese (Traditional)](README-tw.md)

## Localized Resources

All external resources used in this application are localized:

### Fonts

Stored in the `public/vendor/fonts` directory:

- KleeOne-Regular.woff2 - Klee One font

### JavaScript Libraries

Stored in the `public/vendor/js` directory:

- fastclick.min.js - FastClick library (v1.0.6)

## Nekotan Features✨

- 💕 A cat-like interface that makes your heart dance with its super usability~💖
- 📝 Cute category classification to neatly organize your feelings~♪📂
- 🏷️ Tagging function (up to 10 tags!) to easily find memories~🔖
- 🔍 Search function that finds entries with just a keyword, like magic~✨
- 📤 Export/import function to carry memories in CSV/JSON~📦
- 📊 Daily automatic backup for peace of mind, even while sleeping~😴💤
- 📱 Cute touch operation on mobile devices too~📱💕

## Requirements🍼

- Node.js >= 14.0.0 (at least the cat's version~)
- PM2 (install globally~)

## Nekotan Installation🐾

First, welcome the repository to your home and prepare the necessary items~🛠️

## How to Contribute🤝

We're looking for help to make Quiet Time Nekotan even cuter and more convenient~🙏

1. Fork the repository and copy it to your home~🍴
2. Create a new branch with a cute name like "feature/cute-feature"~🌱
3. Commit your changes with a cute message and push~📤
4. Create a Pull Request, describing your changes in detail~✉️

Let's make Quiet Time Nekotan grow cuter together~!💕 I'll respond super quickly to your pull requests~✧*｡٩(ˊᗜˋ*)و✧*｡ Thank you for your contribution~♡
```bash
# Clone the repository nyan~ 
git clone https://github.com/quiettimejsg/nekotan.git
cd nekochan

# Install dependencies nyan~
npm install

# Install PM2 globally nyan~
npm install -g pm2
```

## Cute Environment Settings✨

Create a `.env` file to cutely customize your room settings~🔧:

```env
# Port number setting (don't change~)🔒
PORT=3000
# Environment setting (production/development)🌳
NODE_ENV=production
# Maximum file size (5MB)📦
MAX_FILE_SIZE=5242880
# Log level (information amount adjustment)📝
LOG_LEVEL=info
# Backup retention period (30 days)⏳
BACKUP_RETENTION_DAYS=30
# CORS setting (allow access from anyone)🌐
CORS_ORIGIN=*
```

## Startup Method

Start the app lively in development environment~💻✨:
```bash
npm run dev
```

Run stably in production environment~🚀:
```bash
npm run prod
```

Other commands:
- `npm run stop`: Stop the app nyan~🛑
- `npm run restart`: Restart the app lively~🔄
- `npm run logs`: Check the logs to see how things are going~🔍

## How to Use Cutely~♡

1. Start the app and log in as if you're admiring a cat~🔑✨
2. Cutely click the pink "New Diary" button~✏️💖
3. Cutely enter the diary title and your feelings~📝💭
4. Select categories and tags to organize stylishly~🏷️🎀
5. Gently press the "Save" button to securely store your precious memories~💾💕

## Nekotan Directory Structure🐾

```
nekochan/
├── .github/                            # GitHub related settings📁
│   └── workflows/                      # Automation workflows⚙️
│       └── code-stats.yml              # Code statistics workflow📊
├── public/                             # Folder with static files🐱
│   ├── css/                            # Style sheets
│   │   ├── animations/                 # CSS files for animations
│   │   │   ├── input-animations.css    # CSS for input animations
│   │   │   ├── keyframe.css            # CSS for keyframe animations
│   │   │   ├── sakura.css              # CSS for cherry blossoms
│   │   ├── base/                       # Base CSS files
│   │   │   ├── performance.css         # CSS for performance
│   │   │   ├── variables.css           # CSS variables
│   │   ├── components/                 # CSS files for components🧩
│   │   │   ├── alerts.css              # Styles for alerts🔔
│   │   │   ├── buttons.css             # Styles for buttons🎮
│   │   │   ├── clock.css               # Styles for clock⏰
│   │   │   ├── diary.css               # Styles for diary display/input📖
│   │   │   ├── history.css             # Styles for diary history📜
│   │   │   ├── layout.css              # Styles for application layout🏠
│   │   │   ├── search.css              # Styles for diary search🔍
│   │   │   └── tags.css                # Styles for tags🏷️
│   │   ├── themes/                     # CSS files for themes🎨
│   │   │   └── dark.css                # CSS for dark theme🌙
│   │   ├── main.css                    # Main style sheet✨
│   │   └── style.css                   # Common style sheet🎀
│   ├── js/                             # Client-side JS
│   │   ├── managers/                   # Manager files
│   │   │   ├── EventHandler.js         # Event handler file
│   │   │   ├── TagManager.js           # Tag management file
│   │   │   └── UIManager.js            # UI management file
│   │   ├── app.js                      # Main application file🌟
│   │   ├── DiaryManager.js             # File providing diary management functions📝
│   │   ├── InputAnimator.js            # File handling input animations✨
│   │   ├── Logger.js                   # File providing logging functions📜
│   │   ├── sakura.js                   # File implementing cherry blossom features🌸
│   │   └── TimeUpdater.js              # File providing time update functions⏰
│   ├── uploads/                        # Place where uploaded images sleep📸
│   └── vendor/                         # Third-party resources
│       ├── fonts/                      # Font files
│       │   ├── font.css                # Style sheet for fonts
│       │   ├── KleeOne-Regular.ttf     # Klee One regular font file
│       │   └── OFL.txt                 # SIL Open Font License file
│       ├── js/                         # JavaScript libraries
│       │   └── fastclick.min.js        # FastClick 1.6 library
│       └── picture/                    # Home for image files🐾
│           └── sakura.svg              # SVG file for cherry blossoms🌸
├── .vscode/                            # VSCode settings folder💻
│   └── launch.json                     # Debug configuration file🚀
├── .cloc-exclude                       # cloc statistics exclusion settings🔍
├── .env.example                        # Example environment variables file🌰
├── .gitignore                          # Git ignore settings🙈
├── diaries.csv                         # Diary data file📝
├── LICENSE                             # License file📜
├── 静時ねこたん.html                     # Main page🎀
├── backup-20250524-194510.tar.gz       # Backup file💾
├── nekochan-1.0.0.tgz                  # Application package file📦
├── package-lock.json                   # Package lock file🔒
├── logs/                               # Log files recording app's daily life📖
├── backups/                            # Backup files protecting important data💖
├── server.js                           # Server core file❤️
├── ecosystem.config.js                 # PM2 magic configuration file🪄
└── package.json                        # Package information and caretaker file📦
```

## About Backups

- CSV files are automatically backed up every day~💾
- Backup files are carefully stored in the `backups/` folder~📁
- By default, they're cherished for 30 days, but you can change this with environment variables~📅

## Security

- Security header settings protected by Helmet.js🎩
- CORS settings for friendly communication🤝
- Checking input data to block suspicious things~🔍
- Gentle error handling system that explains issues clearly💬

## Logs📖

The app's daily life and care records are here~:
- Application logs: `logs/output.log` → App's daily record✨
- Error logs: `logs/error.log` → Helpful notes for troubleshooting📝
- Access logs: `logs/access.log` → Customer ledger of when visitors came👀

## Nekotan License📜

AGPL-3.0 license~📜

### Third-party Licenses

Font files are licensed under SIL Open Font License 1.1:

- Klee One: Copyright 2020 Fontworks Inc.

FastClick is MIT licensed~♡

Thank you for using Nekotan~♡ Please enjoy wonderful days with Quiet Time Nekotan's Diary~🐾💕

✨ I'm always here to gently store your precious memories~ Feel free to use me anytime~🐾💕

Thank you for reading until the end~! Let's have wonderful days together with Quiet Time Nekotan~✨