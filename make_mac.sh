npm install -g nexe@2.0.0-next.14
nexe --build --clean
nexe src/electron.js --use_strict --build --loglevel verbose -r public/ -r src/ -r package.json -r node_modules/  -r node_sqlite3_macos64.rename -o ./vjs
mv ./vjs ../nexe/vjs
chmod +x ../nexe/vjs
