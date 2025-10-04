# Cloudflare Workers ハンズオン（R2 + ルーティング）

この例は、R2からWelcomeページを配信しつつ、`/sample-500`で500、その他で404を返すWorkersです。

## 前提
- Node.js 18+ / npm
- Cloudflare アカウント
- Wrangler インストールとログイン
  - `npm i -g wrangler` または `brew install cloudflare-wrangler`
  - `wrangler login`

## セットアップ（R2 作成とオブジェクト登録）
```sh
cd examples/worker
# R2バケット作成（初回のみ）
wrangler r2 bucket create handson-assets

# WelcomeページをR2にアップロード
wrangler r2 object put handson-assets/welcome.html \
  --file assets/welcome.html \
  --content-type "text/html; charset=utf-8"
```

## ローカル開発
```sh
wrangler dev
# 確認
curl -i http://127.0.0.1:8787/
curl -i http://127.0.0.1:8787/sample-500
curl -i http://127.0.0.1:8787/unknown
```

## デプロイ
```sh
wrangler publish
```

## Gemini CLI を使ったスクリプト生成（任意）
- お好みのGemini CLIをインストールし、APIキーを設定してください。
- 例: `export GEMINI_API_KEY=...` のうえ、`prompts/worker_prompt.txt`を入力として生成。
- 生成結果を`src/index.ts`に保存し、`wrangler dev`で動作確認します。

```sh
# 例（CLI名はご利用のツールに置換してください）
<your-gemini-cli> -m gemini-1.5-pro -p prompts/worker_prompt.txt > src/index.ts
```

## 補足
- 設定は`wrangler.toml`を参照。R2バインド名は`ASSETS`、オブジェクトキーは`WELCOME_OBJECT_KEY`（既定: `welcome.html`）。
- 既存のWelcomeを差し替える場合は、同じキーで再アップロードしてください。

