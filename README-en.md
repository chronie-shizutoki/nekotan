

# Quiet Time Nekotan's Diary 🐾

A diary app gentle as a kitten, where you can adorably record daily memories meow~♡  
With a sparkling interface that tenderly stores your feelings~✨

## Going Global Meow~🌍

Striving for multilingual support to befriend cats worldwide!  

- English meow: [README-en.md](README-en.md)  
- Korean nyan: [README-ko.md](README-ko.md)  
- Simplified Chinese nyang: [README-zh.md](README-zh.md)  
- Traditional Chinese nya~: [README-tw.md](README-tw.md)  

## Resource Homebase 🏠

All assets are managed in-house meow:  

### Font-chan  
Living in `public/vendor/fonts` nya~  
- KleeOne-Regular.woff2 - Fluffy handwriting  

### JavaScript Libraries  
Napping in `public/vendor/js` 🐾  
- fastclick.min.js - Quick-tap library (v1.0.6)  

## Paw-some Features ✨  

- 💕 Purr-fect touch-responsive kitty hearts! Intuitive controls  
- 📝 Category organization for tidy feelings management meow♪  
- 🏷️ Tagging up to 10 memories! Instantly find recollections🔖  
- 🔍 Keyword magic search~✨  
- 📤 CSV/JSON memory migration support nya📦  
- 📊 Auto-backups for purr-fect peace of sleep😴💤  
- 📱 Pawsitively easy mobile operation~🐾  

## Requirements 🍼  

- Node.js >= 14.0.0 (Must be kitty-approved version)  
- PM2 (Install globally please)  

## Getting Started 🐾  

First, prepare your home for a new kitty!  

```bash
# Bring me home nya~
git clone https://github.com/quiettimejsg/nekotan.git  
cd nekochan  

# Prepare treats meow
npm install  

# Summon the Guardian
npm install -g pm2
```

## Home Customization ✨  

Configure preferences in `.env` file nya~:  

```env
PORT=3000                 # House door number🚪  
NODE_ENV=production       # Going-out mode🎀  
MAX_FILE_SIZE=5242880     # Photo size limit (5MB)📸  
LOG_LEVEL=info            # Chatty level💬  
BACKUP_RETENTION_DAYS=30  # Memory preservation period📆  
CORS_ORIGIN=*             # Everybody-friends setting🌈  
```

## Startup Commands 🐾  

Play mode activation:  
```bash
npm run dev  # Excited development mode💫  
```  

Professional mode:  
```bash
npm run prod  # Serious business mode👑  
```  

Other care commands:  
- `npm run stop`: Goodnight meow~🌙  
- `npm run restart`: Energetic reboot!🔁  
- `npm run logs`: Read today's story📖  

## How to Use 💖  

1.  Login and poke the kitty screen✨  
2.  Tap the bouncy "New Diary" button!  
3.  Enter title and feelings meow-style📝  
4.  Stylish organization with categories & tags🎀  
5.  "Save" to fluffy heart storage💕  

## Home Structure 🐾  

```
nekochan/
├── .github/                            # GitHub mailbox✉️
│   └── workflows/                      # Auto-work machine⚙️
│       └── code-stats.yml              # Code height measurement📏
├── public/                             # Showroom for everyone✨
│   ├── css/                            # Fashion wardrobe👗
│   │   ├── animations/                 # Movement cookbook💫
│   │   │   ├── input-animations.css    # Text-entry dance💃
│   │   │   ├── keyframe.css            # Sparkle secrets✨
│   │   │   ├── sakura.css              # Cherry blossom choreography🌸
│   │   ├── base/                       # Skincare set💅
│   │   │   ├── performance.css         # Speed tricks🐇
│   │   │   ├── variables.css           # Color palette🎨
│   │   ├── components/                 # Parts toybox🧸
│   │   │   ├── alerts.css              # Notification cards🔔
│   │   │   ├── buttons.css             # Squishy buttons🎮
│   │   │   ├── clock.css               # Ticking clock⏰
│   │   │   ├── diary.css               # Diary design📖
│   │   │   ├── history.css             # Memory album📚
│   │   │   ├── layout.css              # Room layout🏠
│   │   │   ├── search.css              # Treasure hunt kit🔍
│   │   │   └── tags.css                # Kitty tag collection🏷️
│   │   ├── themes/                     # Outfit changer👘
│   │   │   └── dark.css                # Moonlight mode🌙
│   │   ├── main.css                    # Main outfit✨
│   │   └── style.css                   # Universal style set🎀
│   ├── js/                             # Moving toybox🎪
│   │   ├── managers/                   # Caretakers👩‍🍼
│   │   │   ├── EventHandler.js         # Event coordinator🎪
│   │   │   ├── TagManager.js           # Tag organizer🏷️
│   │   │   └── UIManager.js            # Appearance designer🎨
│   │   ├── app.js                      # Heartbeat❤️
│   │   ├── DiaryManager.js             # Diary keeper📝
│   │   ├── InputAnimator.js            # Magic motion expert✨
│   │   ├── Logger.js                   # Memory recorder📜
│   │   ├── sakura.js                   # Cherry blossom machine🌸
│   │   └── TimeUpdater.js              # Time announcer⏰
│   ├── uploads/                        # Photo album📸
│   └── vendor/                         # Friends' houses🏠
│       ├── fonts/                      # Letter playground✏️
│       │   ├── font.css                # Font clothing👕
│       │   ├── KleeOne-Regular.ttf     # Fluffy letters🐾
│       │   └── OFL.txt                 # Promise card📜
│       ├── js/                         # Utility toolbox🧰
│       │   └── fastclick.min.js        # Quick-tap button⚡
│       └── picture/                    # Decoration artbox🖼️
│           └── sakura.svg              # Cherry blossom card🌸
├── .vscode/                            # Art supplies🎨
│   └── launch.json                     # Magic spellbook🪄
├── .cloc-exclude                       # Secret memo🙈
├── .env.example                        # Room setup example🏠
├── .gitignore                          # Hide-from-view list🙈
├── diaries.csv                         # Memory jewel box💎
├── LICENSE                             # Promise card📜
├── QuietTimeNekotan.html               # Front door🚪
├── backup-20250524-194510.tar.gz       # Memory backup💾
├── nekochan-1.0.0.tgz                  # Moving kit📦
├── package-lock.json                   # Treat list🔒
├── logs/                               # Daily diary📖
├── backups/                            # Treasure vault of memories💖
├── server.js                           # Heart core❤️
├── ecosystem.config.js                 # Caretaker manual📖
└── package.json                        # Caretaker handbook📔
```

## Memory Guardianship 💾  

- Automatic daily backups meow~  
- Preserved for 30 days in `backups/` folder  
- Customizable duration via environment variables📅  

## Safety Measures 🔐  

- Helmet protection (Helmet.js)🧢  
- Friendly communication setup (CORS)🤝  
- Suspicious inputs blocked!🚫  

## Licensing 📜  

AGPL-3.0 license nya~  
Font-chan guarded by SIL Open Font License 1.1  

### Final Meow~ 💕  
Always watching over your precious memories  
With big round eyes meow 🐾  
May you record many wonderful days~✨  