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
- 料金目安（USD・概算）: Free=$0、Pro≈$20/月/ゾーン、Business≈$200/月/ゾーン、Enterprise=個別見積もり。
- 追加機能: Argo/APO/Bot Management/画像最適化等は別途課金あり。最新価格は公式を確認。

### フルDNS（ネームサーバーをCloudflareへ委譲）
- 可用性: 全プランで利用可能。
- 特徴: 権威DNSをCloudflareに移管して管理（高速・冗長）。CDN/WAF/SSL/TLS/ページルール/Zero Trust/Workersルート等がフルに利用可能。
- Apexの扱い: CNAMEフラッテンによりApex（@）もプロキシ/配信可能。
- 注意: NS変更権限が必要。既存DNSの設定はCloudflare側へ移設する。

### パーシャルDNS（CNAME Setup、部分委譲）
- 可用性: 主にEnterpriseで提供される運用形態（Business/Proは原則対象外）。最新の可用性は要確認。
- 特徴: 既存の権威DNSは維持しつつ、特定サブドメインのみをCloudflareのターゲットへCNAMEし、プロキシ/セキュリティを付与。
- 制約: ゾーンApex（@）はCNAME不可のため原則プロキシ不可。CloudflareのDNS機能（DNSSEC/ゾーンレベルの高度機能など）は利用不可。利用できる製品や設定が限定される。
- 代替: Apexも含めたい場合はフルDNS委譲、またはCloudflare for SaaSの採用、外部DNSのALIAS/ANAME機能の活用を検討。

### Workersとドメインの関係
- フルDNS: 任意のホスト名にWorkersのルート/カスタムドメインを割当可能。
- パーシャルDNS: 標準では制約が多く、Enterprise/Cloudflare for SaaS等が必要になるケースが多い。簡易利用は `*.workers.dev` を利用。

### 運用判断の目安
- NSを変更できる環境ならフルDNSが基本（機能/可視性/柔軟性が最大）。
- NS変更不可（レジストラ/社内ポリシー等）ならパーシャルDNSを検討。ただしプラン要件と機能制限を事前確認。
- プランはゾーン単位で選択し、重要度やトラフィックに応じてFree/Pro/Businessを使い分ける。

## 主力プロダクト
- CDN: 静的/動的コンテンツ配信の高速化・キャッシュ
- DNS: 高速・冗長なマネージドDNS
- WAF/DDoS: アプリケーション/ネットワーク層の保護
- Zero Trust: Access/Gateway等でIDベースの社内外アプリ保護
- Workers: エッジで走るサーバレス実行環境
- R2: S3互換のオブジェクトストレージ
- KV/D1/Queues/Pages/Turnstile など、開発を支える各種サービス

## R2の説明（オブジェクトストレージ）
- 特徴: S3互換API、バケット/オブジェクトでファイルを保存。外部転送コストを抑えた設計。
- 使い所: 画像/HTML/ログ/バックアップ等の保存、Workersからの読み書き
- 開発フロー例: `wrangler r2 object put <bucket>/<key> --file <path>` でアップロードし、Workersから`env.ASSETS.get(key)`で取得

### R2の料金のポイント
- Egress（インターネット/Cloudflare経由の外向き転送）は無料
- ストレージは使用量（GB-月）に応じた従量課金
- リクエストは種別ごとに課金（例: Class A=PUT/LISTなど、Class B=GETなど）
- Workers↔R2間のデータ転送も追加の帯域料金なし（操作回数は課金対象）
- 小規模利用向けの無料枠あり（開発・検証に便利）


## CDNの説明（配信最適化）
- しくみ: 利用者に近いエッジにキャッシュし、待ち時間を短縮
- 効果: レイテンシ低減、オリジン負荷軽減、帯域最適化
- 運用要点: キャッシュTTL/キー、パスごとのキャッシュ有無、バイパス/パージの使い分け

### キャッシュの考え方（ブラウザ vs エッジ）
- ブラウザキャッシュ: 利用者端末のローカルに保存。`Cache-Control`, `ETag`, `Last-Modified` で挙動を制御。
- エッジキャッシュ（Cloudflare）: PoPに保存。`Cache-Control` や Cloudflare のキャッシュルールでTTL/キー/バイパスを制御。
- 代表的な可視化: レスポンスヘッダー `CF-Cache-Status`（`HIT/MISS/BYPASS/EXPIRED` など）。

参考
https://it-trend.jp/cdn/14003

<img src="https://cdn.it-trend.jp/product_page_info_details/31582/current/main?1718346450" alt="CDNの概念図" width="640" />

## Workersの説明（エッジサーバレス）
- 特徴: グローバルエッジでJavaScript/TypeScriptを超低遅延実行
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

このリポジトリでは、WorkersでR2に置いた`welcome.html`を返す例や、500/404のサンプルレスポンスを通じて、開発からデプロイまでを体験します。

### Workersの料金のポイント
- 無料枠あり（一定のリクエスト数/CPU時間）
- 有料プランはリクエスト数やCPU時間に応じて従量課金
- 帯域の専用課金は基本なし（処理はリクエスト/CPU時間、データ系は各サービスの操作課金）
- R2/KV/D1等を併用する場合、それぞれの操作課金・保存容量課金が加算
- 詳細はプランや最新仕様により変動するため、公式料金ページを参照
