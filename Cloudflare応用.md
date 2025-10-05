### フルDNS管理パターン（ネームサーバーをCloudflareへ委譲）
- 全プランで利用可能。
- 特徴: 権威DNSをCloudflareに移管して管理（高速・冗長）。CDN/WAF/SSL/TLS/ページルール/Zero Trust/Workersルート等がフルに利用可能。
- Apexの扱い: CNAMEフラッテンによりApex（@）もプロキシ/配信可能。
- 注意: NS変更権限が必要。既存DNSの設定はCloudflare側へ移設する。

### パーシャルDNSパターン（CNAME Setup、部分委譲）
- Business以上で利用可能
- 特徴: 既存の権威DNSは維持しつつ、特定サブドメインのみをCloudflareのターゲットへCNAMEし、プロキシ/セキュリティを付与。
- 例
  - AWSにApexドメインを残しつつ、サブドメインをCloudflareにCNAMEして運用する
    - AWS Route53(DNSサービス)に`example.com`
    - `sub.example.com`のCNAMEに`sub.example.com.cdn.cloudflare.net`をセットアップする
      - これによって`sub.example.com`をCloudflareの管理にできる（R2から配信等が可能）

### Cloudflareとドメインの関係
- DNSを完全にCloudflareに移管できるならCloudflareで管理ができるが、それができないと、工夫が必要
- パーシャルDNSの利用はBusiness以上なので、ちょっと高額だが、サブドメインのみCloudflareに移管できるので比較的やりやすい
- プランはゾーン単位で選択し、重要度やトラフィックに応じてFree/Pro/Businessを使い分ける。

### キャッシュの考え方（ブラウザ vs エッジ）
- ブラウザキャッシュ: 利用者端末のローカルに保存。`Cache-Control`, `ETag`, `Last-Modified` で挙動を制御。
- エッジキャッシュ（Cloudflare）: PoPに保存。`Cache-Control` や Cloudflare のキャッシュルールでTTL/キー/バイパスを制御。
- 代表的な可視化: レスポンスヘッダー `CF-Cache-Status`（`HIT/MISS/BYPASS/EXPIRED` など）。

参考
https://it-trend.jp/cdn/14003

<img src="https://cdn.it-trend.jp/product_page_info_details/31582/current/main?1718346450" alt="CDNの概念図" width="640" />

