nexe src/electron.js --build -r public/ -r src/ -r package.json -r node_sqlite3_macos64.rename  -o vjs
mv ./app ../nexe/app
chmod +x ../nexe/app
