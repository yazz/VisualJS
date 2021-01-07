nexe --build --clean
nexe src/electron.js --build --loglevel verbose -r public/ -r src/ -r package.json -r node_modules/  -r node_sqlite3_macos64.rename -o ./vjs
mv ./vjs ../nexe/vjs
chmod +x ../nexe/vjs
