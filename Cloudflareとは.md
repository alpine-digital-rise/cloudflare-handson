# Cloudflareとは

## 概要
Cloudflareは、世界各地のエッジ拠点でトラフィックを最適化・保護・実行するプラットフォームです。主に次の3領域を提供します。
- パフォーマンス: CDN/最適化で配信を高速化
- セキュリティ: DDoS軽減、WAF、Bot対策でサイトを保護
- 開発基盤: Workers/R2/KV/D1/Queuesなどのエッジ実行・データサービス

参考
https://cn.teldevice.co.jp/blog/p35630/

<img src="https://cn.teldevice.co.jp/_cms/wp-content/uploads/2022/08/795316b92fc766b0181f6fef074f03fa.png" alt="ネットワークの概念図 (Wikimedia Commons)" width="640" />

## 料金体系（ざっくり）
- サイト/ゾーン向け: Free/Pro/Business/Enterpriseの各プラン
- サーバレス/データ系: Workers・R2・KV・D1などは無料枠＋従量課金の組み合わせ
- ポイント: 小さく開始しやすく、必要に応じてスケール可能（詳細は公式料金ページを参照）

## ドメイン/ゾーンの課金・制約（DNS委譲の違い）
- 課金単位: 1ゾーン（=1ドメイン）ごとにFree/Pro/Business/Enterpriseのいずれかを選択。
  - サブドメインをゾーンに設定できるのはEnterpriseのみ
- 料金目安（USD・概算）:
  - Free $0
  - Pro≈$20/月/ゾーン
  - Business≈$200/月/ゾーン
  - Enterprise=個別見積もり(結構高額)
- 追加機能: Argo/APO/Bot Management/画像最適化等は別途課金あり。最新価格は公式を確認。


## 主力プロダクト
- CDN: 静的/動的コンテンツ配信の高速化・キャッシュ
- DNS: 高速・冗長なマネージドDNS
- WAF/DDoS: アプリケーション/ネットワーク層の保護
- Zero Trust: Access/Gateway等でIDベースの社内外アプリ保護
- Workers: エッジで走るサーバレス実行環境
- R2: S3互換のオブジェクトストレージ
- KV/D1/Queues/Pages/Turnstile など、開発を支える各種サービス

## R2の説明（オブジェクトストレージ）
- S3互換API、バケット/オブジェクトでファイルを保存。外部転送コストを抑えた設計。
- Egress（インターネット/Cloudflare経由の外向き転送）は無料
- Egress無料な点がとても優秀で、それだけでR2を使う理由になる

### R2の料金のポイント
- Egress無料
- ストレージは使用量（GB-月）に応じた従量課金
- リクエストは種別ごとに課金（例: Class A=PUT/LISTなど、Class B=GETなど）
- Workers↔R2間のデータ転送も追加の帯域料金なし（操作回数は課金対象）
- 小規模利用向けの無料枠あり（開発・検証に便利）

## CDNの説明（配信最適化）
- 利用者に近いエッジにキャッシュし、待ち時間を短縮
- 効果
  - レイテンシ低減、オリジン負荷軽減、帯域最適化
- 運用要点
  - キャッシュTTL/キー、パスごとのキャッシュ有無、バイパス/パージの使い分け

## Workersの説明（エッジサーバレス）
- グローバルエッジでJavaScript/TypeScriptを超低遅延実行
- トリガー: HTTPリクエスト（fetch）、Cron、Queues など
- 連携: KV/R2/D1/Queues/Secrets と統合。`wrangler`で開発/デプロイ
- 簡単な例:
  ```ts
  export default {
    async fetch(req) {
      const { pathname } = new URL(req.url);
      if (pathname === "/") return new Response("Hello from Workers");
      return new Response("Not Found", { status: 404 });
    },
  };
  ```

このリポジトリでは、WorkersでR2に置いた`welcome.html`を扱う例などを紹介しています

### Workersの料金のポイント
- 無料枠あり（一定のリクエスト数/CPU時間）
- 有料プランはリクエスト数やCPU時間に応じて従量課金
- 帯域の専用課金は基本なし（処理はリクエスト/CPU時間、データ系は各サービスの操作課金）
- R2/KV/D1等を併用する場合、それぞれの操作課金・保存容量課金が加算
- 詳細はプランや最新仕様により変動するため、公式料金ページを参照
