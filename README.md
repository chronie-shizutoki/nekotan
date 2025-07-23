# 静時ねこたんの日記帳

可愛い猫のように優しい日記アプリ！

## 本地化リソース

本アプリケーションで使用している外部リソースは全て本地化されています：

### フォント

`public/vendor/fonts` ディレクトリに格納：

- HachiMaruPop-Regular.woff2 - はちまるポップ体
- MPLUSRounded1c-Light.woff2 - M PLUS Rounded 1c Light
- MPLUSRounded1c-Medium.woff2 - M PLUS Rounded 1c Medium
- YujiSyuku-Regular.woff2 - 遊筆修

### JavaScriptライブラリ

`public/vendor/js` ディレクトリに格納：

- fastclick.min.js - FastClick ライブラリ (v1.0.6)

## 特徴

- 💕 シンプルで使いやすいインターフェース
- 📝 カテゴリー分類機能
- 🏷️ タグ付け機能（最大10個）
- 🔍 検索機能
- 📤 CSV/JSON形式でのエクスポート/インポート
- 📊 自動バックアップ機能
- 📱 モバイル対応

## 必要条件

- Node.js >= 14.0.0
- PM2 (グローバルインストール推奨)

## インストール

```bash
# リポジトリをクローン
git clone [repository-url]
cd nekochan

# 依存パッケージをインストール
npm install

# PM2をグローバルにインストール
npm install -g pm2
```

## 環境設定

`.env`ファイルを作成し、以下の環境変数を設定：

```env
PORT=3000
NODE_ENV=production
MAX_FILE_SIZE=5242880
LOG_LEVEL=info
BACKUP_RETENTION_DAYS=30
CORS_ORIGIN=*
```

## 起動方法

開発環境:
```bash
npm run dev
```

本番環境:
```bash
npm run prod
```

その他のコマンド:
- `npm run stop`: アプリを停止
- `npm run restart`: アプリを再起動
- `npm run logs`: ログを表示

## ディレクトリ構造

```
nekochan/
├── public/           # 静的ファイル
│   ├── css/         # スタイルシート
│   ├── js/          # クライアントサイドJS
│   ├── uploads/     # アップロードファイル
│   └── vendor/      # サードパーティリソース
│       ├── fonts/   # フォントファイル
│       └── js/      # JavaScriptライブラリ
├── logs/            # ログファイル
├── backups/         # バックアップファイル
├── server.js        # サーバーエントリーポイント
├── ecosystem.config.js # PM2設定
└── package.json
```

## バックアップについて

- CSVファイルは自動的にバックアップされます
- バックアップは `backups/` ディレクトリに保存されます
- デフォルトで30日間保持されます（環境変数で変更可能）

## セキュリティ

- Helmet.jsによるセキュリティヘッダー設定
- CORS設定済み
- 入力データのバリデーション
- エラーハンドリング

## ログ

- アプリケーションログ: `logs/output.log`
- エラーログ: `logs/error.log`
- アクセスログ: `logs/access.log`

## ライセンス

AGPL-3.0 license

### サードパーティライセンス

フォントファイルは SIL Open Font License 1.1 でライセンスされています：

- Hachi Maru Pop: Copyright 2020 The Hachi Maru Pop Project Authors
- M PLUS Rounded 1c: Copyright 2016 The M+ FONTS Project Authors
- Yuji Syuku: Copyright 2021 The Yuji Project Authors

FastClick は MIT ライセンスで提供されています。
