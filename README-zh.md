# 静时猫猫的日记帐🐾

像猫咪一样温柔、可爱地记录每天回忆的日记应用喵～♡

✨ 可爱的界面，用心保管您的心情 ✨

## 国际化

本应用致力于实现超可爱的多语言支持喵～♡

- [日语](README.md)
- [英语](README-en.md)
- [韩语](README-ko.md)
- [繁体中文](README-tw.md)

## 本地化资源

本应用使用的所有外部资源均已本地化：

### 字体

存储在`public/vendor/fonts`目录中：

- KleeOne-Regular.woff2 - Klee One 字体

### JavaScript库

存储在`public/vendor/js`目录中：

- fastclick.min.js - FastClick 库 (v1.0.6)

## 特色✨

- 💕 猫咪风格界面，触摸即心动的超易用性～💖
- 📝 可爱的分类功能，让心情整洁有序♪📂
- 🏷️ 标签功能（最多10个喵！）让回忆轻松找到🔖
- 🔍 关键词快速搜索功能，像魔法一样喵～✨
- 📤 CSV/JSON格式导入导出功能，随身携带回忆♪📦
- 📊 每日自动备份功能，安心睡眠喵～😴💤
- 📱 移动设备也能指尖可爱操作哦～📱💕

## 运行所需环境🍼

- Node.js >= 14.0.0 (版本以上喵～)
- PM2 (请全局安装～)

## 猫咪安装方法🐾

首先将仓库带回家，准备必要的物品喵～🛠️

## 协作方式🤝

招募帮助让猫猫变得更可爱、更便利喵～🙏

1. 将仓库猫咪式分叉，复制到自己家喵～🍴
2. 创建新分支，像"feature/可爱功能"这样可爱地命名喵～🌱
3. 提交更改，消息也要可爱地写然后推送喵～📤
4. 创建Pull Request，详细说明更改内容并发送喵～✉️

让我们一起让静时猫变得更可爱吧喵～！💕 发送Pull Request的话，会超快回复哦～✧*｡٩(ˊᗜˋ*)و✧*｡ 感谢您的合作喵～♡
```bash
# 克隆仓库～
git clone https://github.com/quiettimejsg/nekotan.git
cd nekochan

# 安装依赖包～
npm install

# 全局安装PM2喵～
npm install -g pm2
```

## 可爱环境设置✨

创建`.env`文件，可爱地自定义房间设置喵～🔧:

```env
# 端口号设置（请勿更改喵～）🔒
PORT=3000
# 环境设置（生产/开发）🌳
NODE_ENV=production
# 最大文件大小（5MB）📦
MAX_FILE_SIZE=5242880
# 日志级别（信息量调整）📝
LOG_LEVEL=info
# 备份保留期（30天）⏳
BACKUP_RETENTION_DAYS=30
# CORS设置（允许所有访问）🌐
CORS_ORIGIN=*
```

## 启动方法

开发环境中让应用精神地启动喵～💻✨:
```bash
npm run dev
```

生产环境中让应用稳定运行喵～🚀:
```bash
npm run prod
```

其他命令:
- `npm run stop`: 猫咪式停止应用喵～🛑
- `npm run restart`: 精神地重启应用喵～🔄
- `npm run logs`: 查看日志检查状况喵～🔍

## 可爱使用方法～♡

1. 启动应用，猫咪式登录喵～🔑✨
2. 点击粉色的"新日记"按钮喵～✏️💖
3. 可爱地输入日记标题和心情喵～📝💭
4. 选择分类和标签，时尚地整理喵～🏷️🎀
5. 点击"保存"按钮，好好保管珍贵回忆喵～💾💕

## 猫咪目录结构🐾

```
nekochan/
├── .github/                            # GitHub相关设置文件📁
│   └── workflows/                      # 自动化工作流设置⚙️
│       └── code-stats.yml              # 代码统计工作流📊
├── public/                             # 静态文件猫咪之家🐱
│   ├── css/                            # 样式表
│   │   ├── animations/                 # 动画CSS文件
│   │   │   ├── input-animations.css    # 输入动画CSS文件
│   │   │   ├── keyframe.css            # 关键帧动画CSS文件
│   │   │   ├── sakura.css              # 樱花CSS文件
│   │   ├── base/                       # 基础CSS文件
│   │   │   ├── performance.css         # 性能CSS文件
│   │   │   ├── variables.css           # 变量CSS文件
│   │   ├── components/                 # 组件CSS文件🧩
│   │   │   ├── alerts.css              # 警报显示样式表🔔
│   │   │   ├── buttons.css             # 按钮样式表🎮
│   │   │   ├── clock.css               # 时钟显示样式表⏰
│   │   │   ├── diary.css               # 日记显示·输入样式表📖
│   │   │   ├── history.css             # 日记历史显示样式表📜
│   │   │   ├── layout.css              # 应用布局样式表🏠
│   │   │   ├── search.css              # 日记搜索样式表🔍
│   │   │   └── tags.css                # 标签显示样式表🏷️
│   │   ├── themes/                     # 主题CSS文件🎨
│   │   │   └── dark.css                # 深色主题CSS文件🌙
│   │   ├── main.css                    # 主样式表✨
│   │   └── style.css                   # 通用样式表🎀
│   ├── js/                             # 客户端JS
│   │   ├── managers/                   # 管理器文件
│   │   │   ├── EventHandler.js         # 事件处理器文件
│   │   │   ├── TagManager.js           # 标签管理文件
│   │   │   └── UIManager.js            # UI管理文件
│   │   ├── app.js                      # 应用主文件🌟
│   │   ├── DiaryManager.js             # 日记管理功能文件📝
│   │   ├── InputAnimator.js            # 输入动画处理文件✨
│   │   ├── Logger.js                   # 日志记录功能文件📜
│   │   ├── sakura.js                   # 樱花相关功能文件🌸
│   │   └── TimeUpdater.js              # 时间更新功能文件⏰
│   ├── uploads/                        # 上传图片存放处📸
│   └── vendor/                         # 第三方资源
│       ├── fonts/                      # 字体文件
│       │   ├── font.css                # 字体样式表
│       │   ├── KleeOne-Regular.ttf     # Klee One 常规字体文件
│       │   └── OFL.txt                 # SIL Open Font License许可证文件
│       ├── js/                         # JavaScript库
│       │   └── fastclick.min.js        # FastClick1.6 库
│       └── picture/                    # 图片文件之家🐾
│           └── sakura.svg              # 樱花SVG文件🌸
├── .vscode/                            # VSCode设置文件夹💻
│   └── launch.json                     # 调试设置文件🚀
├── .cloc-exclude                       # cloc统计排除设置文件🔍
├── .env.example                        # 环境变量示例文件🌰
├── .gitignore                          # Git忽略设置文件🙈
├── diaries.csv                         # 日记数据文件📝
├── LICENSE                             # 许可证文件📜
├── 静时ねこたん.html                     # 主页面🎀
├── backup-20250524-194510.tar.gz       # 备份文件💾
├── nekochan-1.0.0.tgz                  # 应用程序包文件📦
├── package-lock.json                   # 包锁定文件🔒
├── logs/                               # 应用日志文件📖
├── backups/                            # 备份文件💖
├── server.js                           # 服务器核心文件❤️
├── ecosystem.config.js                 # PM2配置文件🪄
└── package.json                        # 包信息文件📦
```

## 备份说明

- CSV文件每天自动备份喵～💾
- 备份文件安全保存在`backups/`文件夹中喵～📁
- 默认保留30天，但可通过环境变量更改喵～📅

## 安全

- 使用Helmet.js设置安全头保护喵～🎩
- CORS设置确保友好通信喵～🤝
- 检查输入数据，拒绝可疑内容喵～🔍
- 错误发生时友好提示的处理系统喵～💬

## 日志们📖

应用的日常和管理记录在这里喵～:
- 应用日志: `logs/output.log` → 应用的每日记录✨
- 错误日志: `logs/error.log` → 故障时的帮助笔记📝
- 访问日志: `logs/access.log` → 访客记录👀

## 猫咪许可证📜

AGPL-3.0许可证喵～📜

### 第三方许可证

字体文件采用SIL Open Font License 1.1许可证：

- Klee One: Copyright 2020 Fontworks Inc.

FastClick采用MIT许可证喵～♡

感谢使用喵～♡ 请与静时猫猫的日记帐一起度过美好的每一天～🐾💕

✨ 一直用心保管您珍贵的回忆喵～ 请随时放心使用喵～🐾💕

感谢阅读到最后喵～！让我们一起度过美好的每一天～✨