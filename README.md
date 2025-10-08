# Cloudflareハンズオン（レジュメ）

目的: Cloudflare CLI（wrangler）のセットアップ、Workersの作成とR2連携、Gemini CLIでのスクリプト生成、デプロイまでを一通り体験します。

## 前提
- Node.js 18+ / npm、ターミナル環境をご用意ください。
- Cloudflare アカウントをご用意ください（クレジットカード登録が必要な場合があります）。
- 本リポジトリはハンズオンの土台です。コードはGemini CLIで`./handson`に生成する想定です。

## 1. Wrangler のセットアップ
```sh
npm i -g wrangler     # または: brew install cloudflare-wrangler
wrangler login        # ブラウザで認証します
wrangler whoami       # ログイン状態を確認します
```

## 2. R2 のサブスクリプションを有効化
ブラウザで Cloudflare R2 のページを開き、サブスクリプションを有効化します。課金が発生する可能性がありますのでご留意ください。

## 3. Workers とドキュメントの生成（Gemini CLI）
このリポジトリのルートで Gemini CLI を起動し、Workers とドキュメントを生成します。

```sh
cd path-to-this-repository
gemini
```

プロンプト例（要点のみ抜粋）:
```
以下の要件を満たす Cloudflare Workers（TypeScript, modules）のコードを生成してください。
(./exampleフォルダはサンプルですので、まったく参照しないで作成してください)

- すべてのHTTPリクエストをfetchで受け付ける
- "/" は R2（バインド名 ASSETS）から `WELCOME_OBJECT_KEY` で指定した welcome.html を返す
- "/sample-500" は 500 を返す、その他は 404
- 生成先は ./handson フォルダ

日本語で回答してください。
.gitignoreは編集、上書きしないでください。
```
対話でコマンド実行やファイル生成の確認が求められます。内容を確認しながら許可してください（不適切な提案は中断して再指示します）。

## 4. プロジェクト確認
別ターミナルを開き、生成物を確認します。
```sh
cd handson
cat wrangler.toml
```

特に`wrangler.toml`はデプロイするWorkersの名称等が記載されており、確認をする必要があります。

## 5. R2 バケットの作成

```sh
wrangler r2 bucket create handson-assets
```

## 6. Welcome ドキュメントの設置（ローカル）

以下のコマンドはローカルR2を操作します。
```sh
wrangler r2 object put handson-assets/welcome.html \
  --file assets/welcome.html \
  --content-type "text/html; charset=utf-8"
```

## 7. ローカルで動作確認
```sh
wrangler dev
# 別ターミナルで確認します
curl -i http://127.0.0.1:8787/
curl -i http://127.0.0.1:8787/sample-500
curl -i http://127.0.0.1:8787/unknown
```
挙動: `/` は R2 から Welcome を配信し、`/sample-500` は 500、その他は 404 を返します。`/favicon.ico` は 204 を返します。

## 8. Welcome ドキュメントの設置（リモート）

以下のコマンドはリモートR2を操作します（デプロイ前に実施してください）。
```sh
wrangler r2 object put handson-assets/welcome.html \
  --file assets/welcome.html \
  --content-type "text/html; charset=utf-8" \
  --remote
```

## 9. デプロイ
```sh
wrangler deploy
```
出力された URL（workers.dev）へアクセスして動作を確認します。

---

## example/workersの動作方法

ローカル動作確認

```sh
cd example/worker
wrangler r2 object put handson-assets/welcome.html \
  --file assets/welcome.html \
  --content-type "text/html; charset=utf-8"
wrangler dev
```

デプロイ

```sh
cd example/worker
wrangler r2 object put handson-assets/welcome.html \
  --file assets/welcome.html \
  --content-type "text/html; charset=utf-8" \
  --remote
wrangler deploy
```

---

## （ドメインが必要）ドメインの操作
ドメインをお持ちで、Cloudflareに権威ドメインを移行している場合、ドメインからの配信を実施できます。

[ドメイン利用](README-use-domain.md)

