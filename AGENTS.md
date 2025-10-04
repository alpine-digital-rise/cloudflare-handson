# Repository Guidelines

## Project Structure & Module Organization
- ルートにドキュメント（`README.md`, `Cloudflareとは.md`）。記事追加は`docs/`、画像は`assets/`配下を推奨。
- 実装例やハンズオン用コードは`examples/<name>/`に配置し、必要に応じて`wrangler.toml`を含めます。
- 大きな変更は小さなPRに分割し、各ディレクトリに`README.md`で使い方を補足してください。

## Build, Test, and Development Commands
- ドキュメントのみの場合はビルド不要。Markdownは任意で`markdownlint`/`prettier`を使用可。
- Cloudflare Workers を使う場合（`wrangler.toml`があるとき）:
  - `wrangler dev` ローカル開発（ログ/プレビュー）。
  - `wrangler publish` 本番デプロイ（権限と環境変数要設定）。
  - `wrangler secret put <NAME>` シークレット登録。

## Coding Style & Naming Conventions
- Markdown: 見出しは`#`階層、箇条書き・コードブロックを適切に使用。インデントは2スペース。
- 日本語は丁寧体、Cloudflare用語は公式表記に合わせる。
- ファイル名: 英数字のkebab-case（例: `getting-started.md`）。画像は`assets/topic-name.png`。
- コード例（JS/TS）はPrettier標準設定・ESLintが存在する場合はそれに従う。

## Testing Guidelines
- ドキュメント変更: 記載コマンドを実際に実行して手順検証。差分が出る場合は注意書きを追記。
- Workersコード: `wrangler dev`で動作確認。テスト導入済みなら`npm test`を実行。
- テスト命名: `*.test.ts`/`*.spec.ts`（存在する場合）。

## Commit & Pull Request Guidelines
- コミットは小さく要点を明確に。日本語/英語いずれも可。
- 推奨: Conventional Commits（例: `docs: add wrangler publish section`、`feat: add kv example`）。
- PRには目的・変更点・確認手順・関連Issue・スクリーンショット/ログを含める。Secretsを含めない。

## Security & Configuration Tips
- APIキーやトークンはコミットしない。`.env`を使用し、`env.example`を更新。
- `wrangler.toml`に秘密情報を直書きしない。`wrangler secret put`を利用。
- `.gitignore`に`.env`, `.wrangler`, `node_modules/`などを追加（必要時）。

