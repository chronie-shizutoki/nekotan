# 静時ねこたんの日記帳🐾

にゃんこみたいに優しい日記アプリで、毎日の思い出をかわいく記録できるにゃ～♡  
キラキラなインターフェースで、あなたのお気持ちをそっと保管するよ～✨

## 国際化だにゃ～🌍

世界中の猫ちゃんと仲良くするために、多言語対応をがんばってるにゃ！  

- 英語だにゃ: [README-en.md](README-en.md)  
- 韓国語ニャン: [README-ko.md](README-ko.md)  
- 中国語(簡体字)にゃん: [README-zh.md](README-zh.md)  
- 中国語(繁体字)にゃ～: [README-tw.md](README-tw.md)  

## リソースのおうち🏠

使ってる素材は全部お家で管理してるにゃ：  

### フォントちゃん  
`public/vendor/fonts` においるにゃ～  
- KleeOne-Regular.woff2 - ふにゃふにゃ文字  

### JavaScriptライブラリ  
`public/vendor/js` でお昼寝中🐾  
- fastclick.min.js - 早押しボタンライブラリ (v1.0.6)  

## にゃんとこ自慢機能✨  

- 💕 触るだけでにゃんこハートがぷるん！直感的操作  
- 📝 カテゴリー分けでお気持ちスッキリ整理にゃん♪  
- 🏷️ タグ付け10個まで！思い出をパッと探せる🔖  
- 🔍 キーワードひとつで魔法みたいに検索～✨  
- 📤 CSV/JSONで思い出のお引っ越し可能にゃ📦  
- 📊 自動バックアップでぐっすり安心睡眠😴💤  
- 📱 モバイルでも肉球でらくらく操作～🐾  

## 必要なもの🍼  

- Node.js >= 14.0.0 (にゃんこバージョン以上だにゃ)  
- PM2 (おうち全体にインストールしてね)  

## はじめかた🐾  

まずはお家に迎える準備をしようにゃ！  

```bash
# お家に連れてくるにゃ～
git clone https://github.com/quiettimejsg/nekotan.git  
cd nekochan  

# おやつを準備するにゃん
npm install  

# お世話係を呼ぶにゃ
npm install -g pm2
```

## お部屋の飾りつけ✨  

`.env`ファイルでお好み設定にゃ～：  

```env
PORT=3000                 # おうちのドア番号🚪  
NODE_ENV=production       # おでかけモード設定🎀  
MAX_FILE_SIZE=5242880     # お写真の大きさ(5MB)📸  
LOG_LEVEL=info            # おしゃべり量設定💬  
BACKUP_RETENTION_DAYS=30  # 思い出の保存期間📆  
CORS_ORIGIN=*             # お友達みんな仲良し設定🌈  
```

## 起動コマンド🐾  

お遊びモードで起動：  
```bash
npm run dev  # わくわく開発モード💫  
```  

本番モードでお仕事：  
```bash
npm run prod  # まじめにゃんモード👑  
```  

その他のお世話：  
- `npm run stop`：おやすみなさいにゃ～🌙  
- `npm run restart`：元気に再起動！🔁  
- `npm run logs`：今日のおはなしを見る📖  

## 使いかた💖  

1. ログインしてにゃんこ画面をぽんぽん✨  
2. ぷくぷく「新規日記」ボタンをタッチ！  
3. タイトルとお気持ちをにゃんと入力📝  
4. カテゴリーとタグでおしゃれ整理🎀  
5. 「保存」でふわふわハートに保管💕  

## お家の中身🐾  

```
nekochan/
├── .github/                            # GitHubのお手紙箱✉️
│   └── workflows/                      # 自動お仕事マシン⚙️
│       └── code-stats.yml              # コードのお背丈測定📏
├── public/                             # みんなに見せるお部屋✨
│   ├── css/                            # おしゃれ洋服ダンス👗
│   │   ├── animations/                 # 動き方レシピ帳💫
│   │   │   ├── input-animations.css    # 文字入力ダンス💃
│   │   │   ├── keyframe.css            # キラキラ動きの秘密✨
│   │   │   ├── sakura.css              # 桜の舞い方🌸
│   │   ├── base/                       # お肌の手入れセット💅
│   │   │   ├── performance.css         # 速く動くコツ🐇
│   │   │   ├── variables.css           # 色のパレット🎨
│   │   ├── components/                 # パーツのおもちゃ箱🧸
│   │   │   ├── alerts.css              # お知らせカード🔔
│   │   │   ├── buttons.css             # ぷにぷにボタン🎮
│   │   │   ├── clock.css               # チクタク時計⏰
│   │   │   ├── diary.css               # 日記帳デザイン📖
│   │   │   ├── history.css             # 思い出アルバム📚
│   │   │   ├── layout.css              # お部屋の間取り🏠
│   │   │   ├── search.css              # 宝探しセット🔍
│   │   │   └── tags.css                # ネコタグコレクション🏷️
│   │   ├── themes/                     # お洋服チェンジャー👘
│   │   │   └── dark.css                # お月様モード🌙
│   │   ├── main.css                    # メインお洋服✨
│   │   └── style.css                   # 共通おしゃれセット🎀
│   ├── js/                             # 動くおもちゃ箱🎪
│   │   ├── managers/                   # お世話係さん👩‍🍼
│   │   │   ├── EventHandler.js         # イベント受け付け係🎪
│   │   │   ├── TagManager.js           # タグ整理係🏷️
│   │   │   └── UIManager.js            # 見た目デザイナー🎨
│   │   ├── app.js                      # 心臓ドキドキ❤️
│   │   ├── DiaryManager.js             # 日記お守り係📝
│   │   ├── InputAnimator.js            # 魔法の動き係✨
│   │   ├── Logger.js                   # 思い出記録係📜
│   │   ├── sakura.js                   # 桜吹雪マシン🌸
│   │   └── TimeUpdater.js              # 時間お知らせ係⏰
│   ├── uploads/                        # お写真アルバム📸
│   └── vendor/                         # お友達の家🏠
│       ├── fonts/                      # 文字の遊び場✏️
│       │   ├── font.css                # 文字の服👕
│       │   ├── KleeOne-Regular.ttf     # ふにゃふにゃ文字🐾
│       │   └── OFL.txt                 # お約束カード📜
│       ├── js/                         # 便利道具箱🧰
│       │   └── fastclick.min.js        # 早押しボタン⚡
│       └── picture/                    # 飾り絵の箱🖼️
│           └── sakura.svg              # 桜の絵はがき🌸
├── .vscode/                            # お絵描き道具箱🎨
│   └── launch.json                     # 魔法の呪文書🪄
├── .cloc-exclude                       # 秘密のメモ🙈
├── .env.example                        # お部屋設定見本🏠
├── .gitignore                          # 見せないリスト🙈
├── diaries.csv                         # 思い出宝石箱💎
├── LICENSE                             # お約束カード📜
├── 静時ねこたん.html                      # 玄関ドア🚪
├── backup-20250524-194510.tar.gz       # 思い出バックアップ💾
├── nekochan-1.0.0.tgz                  # お引越しセット📦
├── package-lock.json                   # おやつリスト🔒
├── logs/                               # 毎日の日記帳📖
├── backups/                            # 思い出の宝物庫💖
├── server.js                           # 心臓部ドキドキ❤️
├── ecosystem.config.js                 # お世話マニュアル📖
└── package.json                        # お世話係手帳📔
```

## 思い出のお守り💾  

- 毎日自動でバックアップされるにゃ～  
- `backups/` フォルダで30日間お預かり  
- 環境変数で期間変更可能にゃん📅  

## 安全対策🔐  

- ヘルメットで頭ガード(Helmet.js)🧢  
- みんなと仲良く通信設定(CORS)🤝  
- 怪しい入力はシャットアウト！🚫  

## ライセンスについて📜  

AGPL-3.0 ライセンスだにゃ～  
フォントちゃんは SIL Open Font License 1.1 でお留守番  

### 最後ににゃ～💕  
いつもあなたの大切な思い出を、  
つぶらな瞳で見守ってるにゃん🐾  
素敵な毎日がたくさん記録できますように～✨  
