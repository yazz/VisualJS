nexe src/electron.js -r public\ -r src\ -r package.json -r node_sqlite3_win64.rename  -r node_sqlite3_macos64.rename  -o pilot.exe --build
mv .\pilot ..\nexe\pilot
chmod +x ..\nexe\pilot
