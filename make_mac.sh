nexe src/electron.js -r public/ -r src/ -r package.json -r node_sqlite3_macos64.rename  -o app
mv ./app ../nexe/app
chmod +x ../nexe/app
