# Cloudflare Pages（https://ballet-kyuyo.pages.dev）へ公開する
# 使い方：このフォルダで  .\deploy.ps1
# 初回やログインが切れているときは、ブラウザで Cloudflare の「Allow（許可）」を押す。
$ErrorActionPreference = 'Stop'
$root = $PSScriptRoot
$tmp = Join-Path ([IO.Path]::GetTempPath()) 'ballet-kyuyo-deploy'
if (Test-Path $tmp) { Remove-Item $tmp -Recurse -Force }
New-Item -ItemType Directory $tmp | Out-Null

# 公開するのは git で管理しているアプリ本体だけ。
# 名前や金額の入ったファイル（.gitignore で除外）や、説明書・このスクリプトは出さない。
$skip = @('.gitignore', 'README.md', 'deploy.ps1')
foreach ($f in (git -C $root ls-files)) {
  if ($skip -contains $f) { continue }
  $dst = Join-Path $tmp $f
  New-Item -ItemType Directory -Force (Split-Path $dst) | Out-Null
  Copy-Item (Join-Path $root $f) $dst
}
Write-Host "公開するファイル：" (Get-ChildItem $tmp -Recurse -File).Count "件"
npx --yes wrangler@4 pages deploy $tmp --project-name ballet-kyuyo --branch main --commit-dirty=true
