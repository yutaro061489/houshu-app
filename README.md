# 報酬かんたん計算（バレエ教室の講師報酬）

- 公開先：**https://ballet-kyuyo.pages.dev** （Cloudflare Pages、プロジェクト名 `ballet-kyuyo`）
- パソコン・スマホにアプリとして入れられる（PWA）。オフラインでも動く。
- 見た目は「バレエ衣装管理」（ballet-costume.pages.dev）とおそろい。ウサギは衣装管理のマスコットが ¥ の金貨を持った絵。

## できること
- 支払額を入れると、源泉税と振込額を自動計算
  - 報酬の源泉徴収：100万円以下は 10.21%、超えた部分は 20.42%、1円未満切り捨て（`index.html` の `withholding()`）
- 給料表のExcelファイル（名前の列＋「1月」「2月」…の列）をそのまま取り込み（.xlsx を選ぶ／ドラッグ／シートを貼り付け）
- 支払明細書・月の一覧・年間まとめをPDFに（印刷画面から「PDFに保存」）
- バックアップ（JSON）、ほかの端末へリンクで送る、CSV書き出し

## データについて
- 名前や金額は **使っている端末のブラウザの中だけ** に保存（localStorage）。サーバーには送らない。
- このリポジトリ（公開）には名前・金額を置かない。`.gitignore` で json / csv / pdf / xlsx を除外している。
- リンクで送るデータはURLの `#` より後ろに入れる（サーバーに届かない）。

## ファイル
| ファイル | 中身 |
|---|---|
| `index.html` | アプリ本体（画面・計算・Excel読み込み・PDF） |
| `sw.js` | オフライン用。新しい版が出たら自動で切り替える |
| `manifest.webmanifest` / `icons/` | アプリとして入れるための設定とアイコン（`icons/icon.svg` が元絵。`bunny-512.png` を縮小して 192・180〈iPhone用〉・32 を作る） |
| `deploy.ps1` | Cloudflare Pages への公開 |

## 直して公開するとき
1. `index.html` の `APP_VERSION` と、`sw.js` の `CACHE` の番号を1つ上げる
2. コミットして GitHub に push
3. `.\deploy.ps1` を実行（ログインが切れていたら、ブラウザで Cloudflare の「Allow」を押す）
4. https://ballet-kyuyo.pages.dev を開き、画面いちばん下のバージョンが上がっていることを確認

手元で試すとき：`python -m http.server 8765 --directory .` で http://localhost:8765 を開く。
