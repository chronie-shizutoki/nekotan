# 靜時貓貓的日記帳🐾

像貓咪一樣溫柔、可愛地記錄每天回憶的日記應用喵～♡

✨ 可愛的介面，用心保管您的心情 ✨

## 國際化

本應用致力於實現超可愛的多語言支援喵～♡

- [日文](README.md)
- [英語](README-en.md)
- [韓語](README-ko.md)
- [簡體中文](README-zh.md)

## 本地化資源

本應用使用的所有外部資源均已本地化：

### 字體

存儲在`public/vendor/fonts`目錄中：

- KleeOne-Regular.woff2 - Klee One 字體

### JavaScript庫

存儲在`public/vendor/js`目錄中：

- fastclick.min.js - FastClick 庫 (v1.0.6)

## 特色✨

- 💕 貓咪風格介面，觸摸即心動的超易用性～💖
- 📝 可愛的分類功能，讓心情整潔有序♪📂
- 🏷️ 標籤功能（最多10個喵！）讓回憶輕鬆找到🔖
- 🔍 關鍵詞快速搜索功能，像魔法一樣喵～✨
- 📤 CSV/JSON格式導入導出功能，隨身攜帶回憶♪📦
- 📊 每日自動備份功能，安心睡眠喵～😴💤
- 📱 移動設備也能指尖可愛操作哦～📱💕

## 運行所需環境🍼

- Node.js >= 14.0.0 (版本以上喵～)
- PM2 (請全域安裝～)

## 貓咪安裝方法🐾

首先將倉庫帶回家，準備必要的物品喵～🛠️

## 協作方式🤝

招募幫助讓貓貓變得更可愛、更便利喵～🙏

1. 將倉庫貓咪式分叉，複製到自己家喵～🍴
2. 創建新分支，像"feature/可愛功能"這樣可愛地命名喵～🌱
3. 提交更改，消息也要可愛地寫然後推送喵～📤
4. 創建Pull Request，詳細說明更改內容並發送喵～✉️

讓我們一起讓靜時貓變得更可愛吧喵～！💕 發送Pull Request的話，會超快回復哦～✧*｡٩(ˊᗜˋ*)و✧*｡ 感謝您的合作喵～♡
```bash
# 克隆倉庫～
git clone https://github.com/quiettimejsg/nekotan.git
cd nekochan

# 安裝依賴包～
npm install

# 全域安裝PM2喵～
npm install -g pm2
```

## 可愛環境設定✨

創建`.env`文件，可愛地自定義房間設置喵～🔧:

```env
# 端口號設置（請勿更改喵～）🔒
PORT=3000
# 環境設置（生產/開發）🌳
NODE_ENV=production
# 最大文件大小（5MB）📦
MAX_FILE_SIZE=5242880
# 日誌級別（信息量調整）📝
LOG_LEVEL=info
# 備份保留期（30天）⏳
BACKUP_RETENTION_DAYS=30
# CORS設置（允許所有訪問）🌐
CORS_ORIGIN=*
```

## 啟動方法

開發環境中讓應用精神地啟動喵～💻✨:
```bash
npm run dev
```

生產環境中讓應用穩定運行喵～🚀:
```bash
npm run prod
```

其他命令:
- `npm run stop`: 貓咪式停止應用喵～🛑
- `npm run restart`: 精神地重啟應用喵～🔄
- `npm run logs`: 查看日誌檢查狀況喵～🔍

## 可愛使用方法～♡

1. 啟動應用，貓咪式登錄喵～🔑✨
2. 點擊粉紅色的"新日記"按鈕喵～✏️💖
3. 可愛地輸入日記標題和心情喵～📝💭
4. 選擇分類和標籤，時尚地整理喵～🏷️🎀
5. 點擊"保存"按鈕，好好保管珍貴回憶喵～💾💕

## 貓咪目錄結構🐾

```
nekochan/
├── .github/                            # GitHub相關設置文件📁
│   └── workflows/                      # 自動化工作流設置⚙️
│       └── code-stats.yml              # 代碼統計工作流📊
├── public/                             # 靜態文件貓咪之家🐱
│   ├── css/                            # 樣式表
│   │   ├── animations/                 # 動畫CSS文件
│   │   │   ├── input-animations.css    # 輸入動畫CSS文件
│   │   │   ├── keyframe.css            # 關鍵幀動畫CSS文件
│   │   │   ├── sakura.css              # 櫻花CSS文件
│   │   ├── base/                       # 基礎CSS文件
│   │   │   ├── performance.css         # 性能CSS文件
│   │   │   ├── variables.css           # 變量CSS文件
│   │   ├── components/                 # 組件CSS文件🧩
│   │   │   ├── alerts.css              # 警報顯示樣式表🔔
│   │   │   ├── buttons.css             # 按鈕樣式表🎮
│   │   │   ├── clock.css               # 時鐘顯示樣式表⏰
│   │   │   ├── diary.css               # 日記顯示·輸入樣式表📖
│   │   │   ├── history.css             # 日記歷史顯示樣式表📜
│   │   │   ├── layout.css              # 應用佈局樣式表🏠
│   │   │   ├── search.css              # 日記搜索樣式表🔍
│   │   │   └── tags.css                # 標籤顯示樣式表🏷️
│   │   ├── themes/                     # 主題CSS文件🎨
│   │   │   └── dark.css                # 深色主題CSS文件🌙
│   │   ├── main.css                    # 主樣式表✨
│   │   └── style.css                   # 通用樣式表🎀
│   ├── js/                             # 客戶端JS
│   │   ├── managers/                   # 管理器文件
│   │   │   ├── EventHandler.js         # 事件處理器文件
│   │   │   ├── TagManager.js           # 標籤管理文件
│   │   │   └── UIManager.js            # UI管理文件
│   │   ├── app.js                      # 應用主文件🌟
│   │   ├── DiaryManager.js             # 日記管理功能文件📝
│   │   ├── InputAnimator.js            # 輸入動畫處理文件✨
│   │   ├── Logger.js                   # 日誌記錄功能文件📜
│   │   ├── sakura.js                   # 櫻花相關功能文件🌸
│   │   └── TimeUpdater.js              # 時間更新功能文件⏰
│   ├── uploads/                        # 上傳圖片存放處📸
│   └── vendor/                         # 第三方資源
│       ├── fonts/                      # 字體文件
│       │   ├── font.css                # 字體樣式表
│       │   ├── KleeOne-Regular.ttf     # Klee One 常規字體文件
│       │   └── OFL.txt                 # SIL Open Font License許可證文件
│       ├── js/                         # JavaScript庫
│       │   └── fastclick.min.js        # FastClick1.6 庫
│       └── picture/                    # 圖片文件之家🐾
│           └── sakura.svg              # 櫻花SVG文件🌸
├── .vscode/                            # VSCode設置文件夾💻
│   └── launch.json                     # 調試設置文件🚀
├── .cloc-exclude                       # cloc統計排除設置文件🔍
├── .env.example                        # 環境變量示例文件🌰
├── .gitignore                          # Git忽略設置文件🙈
├── diaries.csv                         # 日記數據文件📝
├── LICENSE                             # 許可證文件📜
├── 靜時ねこたん.html                     # 主頁面🎀
├── backup-20250524-194510.tar.gz       # 備份文件💾
├── nekochan-1.0.0.tgz                  # 應用程序包文件📦
├── package-lock.json                   # 包鎖定文件🔒
├── logs/                               # 應用日誌文件📖
├── backups/                            # 備份文件💖
├── server.js                           # 服務器核心文件❤️
├── ecosystem.config.js                 # PM2配置文件🪄
└── package.json                        # 包信息文件📦
```

## 備份說明

- CSV文件每天自動備份喵～💾
- 備份文件安全保存在`backups/`文件夾中喵～📁
- 默認保留30天，但可通過環境變量更改喵～📅

## 安全

- 使用Helmet.js設置安全頭保護喵～🎩
- CORS設置確保友好通信喵～🤝
- 檢查輸入數據，拒絕可疑內容喵～🔍
- 錯誤發生時友好提示的處理系統喵～💬

## 日誌們📖

應用的日常和管理記錄在這裡喵～:
- 應用日誌: `logs/output.log` → 應用的每日記錄✨
- 錯誤日誌: `logs/error.log` → 故障時的幫助筆記📝
- 訪問日誌: `logs/access.log` → 訪客記錄👀

## 貓咪許可證📜

AGPL-3.0許可證喵～📜

### 第三方許可證

字體文件採用SIL Open Font License 1.1許可證：

- Klee One: Copyright 2020 Fontworks Inc.

FastClick採用MIT許可證喵～♡

感謝使用喵～♡ 請與靜時貓貓的日記帳一起度過美好的每一天～🐾💕

✨ 一直用心保管您珍貴的回憶喵～ 請隨時放心使用喵～🐾💕

感謝閱讀到最後喵～！讓我們一起度過美好的每一天～✨