# 靜時喵喵的日記本🐾

像貓咪一樣溫柔的日記應用，可以可愛地記錄每天的點點滴滴喵嗚～♡  
擁有閃閃發光的介面，輕輕保管你的小心情唷～✨

## 國際化喵～🌍

為了和全世界的貓咪做好朋友，正在努力進行多語言支援喵！

- 日語喵: [日本語](README.md)
- 英語喵: [English](README-en.md)  
- 韓語喵: [한국어](README-ko.md)  
- 中文(簡體)喵: [简体中文](README-zh.md)  

## 資源的家🏠

使用的素材都在家裡統一管理喵：

### 字體寶寶  
在 `public/vendor/fonts` 裡面喵～  
- KleeOne-Regular.woff2 - 軟綿綿字體  

### JavaScript 函式庫  
在 `public/vendor/js` 裡面睡午覺中🐾  
- fastclick.min.js - 快速點擊函式庫 (v1.0.6)  

## 喵喵自誇功能✨  

- 💕 輕輕一碰就有喵喵愛心彈出來！操作超直覺  
- 📝 分類整理讓心情變得清清爽爽喵♪  
- 🏷️ 最多可貼10個標籤！回憶瞬間就能找到🔖  
- 🔍 一個關鍵字就能像魔法一樣搜尋～✨  
- 📤 可以用 CSV/JSON 搬家回憶喵📦  
- 📊 自動備份讓你安心睡大頭覺😴💤  
- 📱 手機上也能用肉球輕鬆操作～🐾  

## 需要的東西🍼  

- Node.js >= 14.0.0 (需要喵喵版本以上唷)  
- PM2 (請全域安裝喵)  

## 開始方法🐾  

先把喵喵接回家的準備工作做好喵！  

```bash
# 把喵喵帶回家喵～
git clone https://github.com/quiettimejsg/nekotan.git  
cd nekochan  

# 準備點心喵
npm install  

# 呼叫守護者喵
npm install -g pm2
```

## 房間佈置✨  

用 `.env` 檔案按喜好設定喵～：  

```env
PORT=3000                 # 家門號碼🚪  
NODE_ENV=production       # 出門模式設定🎀  
MAX_FILE_SIZE=5242880     # 照片大小(5MB)📸  
LOG_LEVEL=info            # 聊天量設定💬  
BACKUP_RETENTION_DAYS=30  # 回憶保存期限📆  
CORS_ORIGIN=*             # 大家做好朋友設定🌈  
```

## 啟動指令🐾  

玩耍模式啟動：  
```bash
npm run dev  # 興奮的開發模式💫  
```  

正式模式工作：  
```bash
npm run prod  # 認真喵模式👑  
```  

其他照顧指令：  
- `npm run stop`：晚安喵～🌙  
- `npm run restart`：元氣滿滿重新啟動！🔁  
- `npm run logs`：看看今天的故事📖  

## 使用方法💖  

1.  登入後點點喵喵畫面✨  
2.  戳戳圓鼓鼓的「新增日記」按鈕！  
3.  喵喵地輸入標題和心情📝  
4.  用分類和標籤時尚整理🎀  
5.  「儲存」到軟綿綿的愛心收藏💕  

## 家的結構🐾  

```
nekochan/
├── .github/                            # GitHub 的信箱✉️
│   └── workflows/                      # 自動工作機器⚙️
│       └── code-stats.yml              # 程式碼身高測量📏
├── public/                             # 給大家看的房間✨
│   ├── css/                            # 時尚衣櫥👗
│   │   ├── animations/                 # 動作食譜書💫
│   │   │   ├── input-animations.css    # 文字輸入舞蹈💃
│   │   │   ├── keyframe.css            # 閃閃動作的秘密✨
│   │   │   ├── sakura.css              # 櫻花的飄落方式🌸
│   │   ├── base/                       # 肌膚保養組💅
│   │   │   ├── performance.css         # 快速移動技巧🐇
│   │   │   ├── variables.css           # 調色盤🎨
│   │   ├── components/                 # 零件玩具箱🧸
│   │   │   ├── alerts.css              # 通知卡片🔔
│   │   │   ├── buttons.css             # Q彈按鈕🎮
│   │   │   ├── clock.css               # 滴答時鐘⏰
│   │   │   ├── diary.css               # 日記本設計📖
│   │   │   ├── history.css             # 回憶相簿📚
│   │   │   ├── layout.css              # 房間格局🏠
│   │   │   ├── search.css              # 尋寶套組🔍
│   │   │   └── tags.css                # 喵喵標籤收藏🏷️
│   │   ├── themes/                     # 衣服切換器👘
│   │   │   └── dark.css                # 月亮模式🌙
│   │   ├── main.css                    # 主衣服✨
│   │   └── style.css                   # 通用時尚套組🎀
│   ├── js/                             # 會動的玩具箱🎪
│   │   ├── managers/                   # 照顧專員👩‍🍼
│   │   │   ├── EventHandler.js         # 事件接待員🎪
│   │   │   ├── TagManager.js           # 標籤整理員🏷️
│   │   │   └── UIManager.js            # 外觀設計師🎨
│   │   ├── app.js                      # 心臟撲通撲通❤️
│   │   ├── DiaryManager.js             # 日記守護員📝
│   │   ├── InputAnimator.js            # 魔法動作師✨
│   │   ├── Logger.js                   # 回憶記錄員📜
│   │   ├── sakura.js                   # 櫻花吹雪機🌸
│   │   └── TimeUpdater.js              # 時間通知員⏰
│   ├── uploads/                        # 照片相簿📸
│   └── vendor/                         # 朋友的家🏠
│       ├── fonts/                      # 文字遊樂場✏️
│       │   ├── font.css                # 文字的衣服👕
│       │   ├── KleeOne-Regular.ttf     # 軟綿綿文字🐾
│       │   └── OFL.txt                 # 約定卡片📜
│       ├── js/                         # 便利工具箱🧰
│       │   └── fastclick.min.js        # 快速點擊按鈕⚡
│       └── picture/                    # 裝飾畫箱🖼️
│           └── sakura.svg              # 櫻花明信片🌸
├── .vscode/                            # 畫畫工具箱🎨
│   └── launch.json                     # 魔法咒語書🪄
├── .cloc-exclude                       # 秘密備忘錄🙈
├── .env.example                        # 房間設定樣板🏠
├── .gitignore                          # 不看清單🙈
├── diaries.csv                         # 回憶寶石箱💎
├── LICENSE                             # 約定卡片📜
├── 静時ねこたん.html                     # 玄關大門🚪
├── backup-20250524-194510.tar.gz       # 回憶備份💾
├── nekochan-1.0.0.tgz                  # 搬家套組📦
├── package-lock.json                   # 點心清單🔒
├── logs/                               # 每天的日記本📖
├── backups/                            # 回憶的寶物庫💖
├── server.js                           # 心臟部分撲通撲通❤️
├── ecosystem.config.js                 # 照顧手冊📖
└── package.json                        # 照顧員手冊📔
```

## 回憶的守護💾  

- 每天都會自動備份喵～  
- 在 `backups/` 資料夾裡保管30天  
- 可以用環境變數修改期限喵📅  

## 安全措施🔐  

- 安全帽保護頭部 (Helmet.js)🧢  
- 和大家友善通訊設定 (CORS)🤝  
- 可疑輸入通通擋在門外！🚫  

## 關於授權📜  

使用 AGPL-3.0 授權喵～  
字體寶寶使用 SIL Open Font License 1.1 看家  

### 最後喵～💕  
永遠用圓滾滾的大眼睛，  
守護著你珍貴的回憶喵🐾  
願你記錄下更多美好的每一天～✨  