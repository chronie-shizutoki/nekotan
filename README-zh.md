# 静时喵喵的日记本🐾

像猫咪一样温柔的日记应用，可以可爱地记录每天的回忆喵～♡
拥有闪闪发光的界面，轻轻保管你的小心情哦～✨

## 国际化喵～🌍

为了和全世界的猫咪做朋友，正在努力进行多语言适配喵！

- 日语喵: [日本語](README.md)
- 英语喵: [English](README-en.md)
- 韩语喵: [한국어](README-ko.md)
- 中文(繁体)喵: [繁體中文](README-tw.md)

## 资源的家🏠

使用的素材都在家里管理喵：

### 字体宝宝
在 `public/vendor/fonts` 里喵～
- KleeOne-Regular.woff2 - 软绵绵字体

### JavaScript 库
在 `public/vendor/js` 里午睡中🐾
- fastclick.min.js - 快速点击库 (v1.0.6)

## 喵喵自夸功能✨

- 💕 轻轻一碰就有喵喵爱心弹出来！操作超直观
- 📝 分类整理让心情变得清清爽爽喵♪
- 🏷️ 最多可贴10个标签！回忆瞬间就能找到🔖
- 🔍 一个关键词就能像魔法一样搜索～✨
- 📤 可以用 CSV/JSON 搬家回忆喵📦
- 📊 自动备份让你安心睡大觉😴💤
- 📱 手机上也能用肉球轻松操作～🐾

## 需要的东西🍼

- Node.js >= 14.0.0 (需要喵喵版本以上哦)
- PM2 (请全局安装喵)

## 开始方法🐾

先把喵喵接回家的准备工作做好喵！

```bash
# 把喵喵带回家喵～
git clone https://github.com/quiettimejsg/nekotan.git
cd nekochan

# 准备点心喵
npm install

# 呼叫守护者喵
npm install -g pm2
```

## 房间布置✨

用 `.env` 文件按喜好设置喵～：

```env
PORT=3000                 # 家门号🚪
NODE_ENV=production       # 出门模式设置🎀
MAX_FILE_SIZE=5242880     # 照片大小(5MB)📸
LOG_LEVEL=info            # 聊天量设置💬
BACKUP_RETENTION_DAYS=30  # 回忆保存期限📆
CORS_ORIGIN=*             # 大家做好朋友设置🌈
```

## 启动命令🐾

玩耍模式启动：
```bash
npm run dev  # 兴奋的开发模式💫
```

正式模式工作：
```bash
npm run prod  # 认真喵模式👑
```

其他照顾命令：
- `npm run stop`：晚安喵～🌙
- `npm run restart`：元气满满重启！🔁
- `npm run logs`：看看今天的故事📖

## 使用方法💖

1.  登录后点点喵喵画面✨
2.  戳戳圆鼓鼓的「新建日记」按钮！
3.  喵喵地输入标题和心情📝
4.  用分类和标签时尚整理🎀
5.  「保存」到软绵绵的爱心收藏💕

## 家的结构🐾

```
nekochan/
├── .github/                            # GitHub 的信箱✉️
│   └── workflows/                      # 自动工作机器⚙️
│       └── code-stats.yml              # 代码身高测量📏
├── public/                             # 给大家看的房间✨
│   ├── css/                            # 时尚衣橱👗
│   │   ├── animations/                 # 动作食谱书💫
│   │   │   ├── input-animations.css    # 文字输入舞蹈💃
│   │   │   ├── keyframe.css            # 闪闪动作的秘密✨
│   │   │   ├── sakura.css              # 樱花的飘落方式🌸
│   │   ├── base/                       # 肌肤护理套装💅
│   │   │   ├── performance.css         # 快速移动技巧🐇
│   │   │   ├── variables.css           # 调色板🎨
│   │   ├── components/                 # 零件玩具箱🧸
│   │   │   ├── alerts.css              # 通知卡片🔔
│   │   │   ├── buttons.css             # Q弹按钮🎮
│   │   │   ├── clock.css               # 滴答时钟⏰
│   │   │   ├── diary.css               # 日记本设计📖
│   │   │   ├── history.css             # 回忆相册📚
│   │   │   ├── layout.css              # 房间布局🏠
│   │   │   ├── search.css              # 寻宝套装🔍
│   │   │   └── tags.css                # 喵喵标签收藏🏷️
│   │   ├── themes/                     # 衣服切换器👘
│   │   │   └── dark.css                # 月亮模式🌙
│   │   ├── main.css                    # 主衣服✨
│   │   └── style.css                   # 通用时尚套装🎀
│   ├── js/                             # 会动的玩具箱🎪
│   │   ├── managers/                   # 照顾专员👩‍🍼
│   │   │   ├── EventHandler.js         # 事件接待员🎪
│   │   │   ├── TagManager.js           # 标签整理员🏷️
│   │   │   └── UIManager.js            # 外观设计师🎨
│   │   ├── app.js                      # 心脏扑通扑通❤️
│   │   ├── DiaryManager.js             # 日记守护员📝
│   │   ├── InputAnimator.js            # 魔法动作师✨
│   │   ├── Logger.js                   # 回忆记录员📜
│   │   ├── sakura.js                   # 樱花吹雪机🌸
│   │   └── TimeUpdater.js              # 时间通知员⏰
│   ├── uploads/                        # 照片相册📸
│   └── vendor/                         # 朋友的家🏠
│       ├── fonts/                      # 文字游乐场✏️
│       │   ├── font.css                # 文字的衣服👕
│       │   ├── KleeOne-Regular.ttf     # 软绵绵文字🐾
│       │   └── OFL.txt                 # 约定卡片📜
│       ├── js/                         # 便利工具箱🧰
│       │   └── fastclick.min.js        # 快速点击按钮⚡
│       └── picture/                    # 装饰画箱🖼️
│           └── sakura.svg              # 樱花明信片🌸
├── .vscode/                            # 画画工具箱🎨
│   └── launch.json                     # 魔法咒语书🪄
├── .cloc-exclude                       # 秘密备忘录🙈
├── .env.example                        # 房间设置样板🏠
├── .gitignore                          # 不看清单🙈
├── diaries.csv                         # 回忆宝石箱💎
├── LICENSE                             # 约定卡片📜
├── 静時ねこたん.html                     # 玄关大门🚪
├── backup-20250524-194510.tar.gz       # 回忆备份💾
├── nekochan-1.0.0.tgz                  # 搬家套装📦
├── package-lock.json                   # 点心清单🔒
├── logs/                               # 每天的日记本📖
├── backups/                            # 回忆的宝物库💖
├── server.js                           # 心脏部分扑通扑通❤️
├── ecosystem.config.js                 # 照顾手册📖
└── package.json                        # 照顾员手册📔
```

## 回忆的守护💾

- 每天都会自动备份喵～
- 在 `backups/` 文件夹里保管30天
- 可以用环境变量修改期限喵📅

## 安全措施🔐

- 头盔保护头部 (Helmet.js)🧢
- 和大家友好通信设置 (CORS)🤝
- 可疑输入统统拒之门外！🚫

## 关于许可证📜

使用 AGPL-3.0 许可证喵～
字体宝宝使用 SIL Open Font License 1.1 看家

### 最后喵～💕
永远用圆溜溜的大眼睛，
守护着你珍贵的回忆喵🐾
愿你记录下更多美好的每一天～✨