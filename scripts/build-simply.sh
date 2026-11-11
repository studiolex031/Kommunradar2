#!/usr/bin/env bash
# Bygger paketet som laddas upp till login.kommunradar.online på Simply.
# Resultat: release/login.kommunradar.online/ och release/login.kommunradar.online.zip
set -euo pipefail
cd "$(dirname "$0")/.."

OUT=release/login.kommunradar.online
npm run build

rm -rf "$OUT" release/login.kommunradar.online.zip
mkdir -p "$OUT"
cp -R dist/. "$OUT/"
cp simply/.htaccess "$OUT/.htaccess"
cp -R simply/api "$OUT/api"
cp server/counties.json "$OUT/api/_lib/counties.json"

# Lokala hemligheter och testdata följer aldrig med i paketet.
rm -f "$OUT/api/_lib/config.php"
find "$OUT/api/_data" -type f ! -name .htaccess -delete

if command -v zip >/dev/null 2>&1; then
  (cd release && zip -qr login.kommunradar.online.zip login.kommunradar.online)
  echo "Klart: release/login.kommunradar.online.zip"
else
  echo "Klart: $OUT (zip saknas – packa mappen själv)"
fi
