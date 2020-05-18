nexe src/electron.js -r public\ -r src\ -r package.json -r node_sqlite3_win64.rename  -r node_sqlite3_macos64.rename  -o pilot.exe 
mv .\pilot.exe ..\nexe\pilot.exe
chmod +x ..\nexe\pilot.exe
