const electron = require('electron')


// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const path = require("path");


app.on('ready', function() {
    var visifile = new BrowserWindow({
                                width: 800,
                                height: 600,
                                webPreferences: {
                                    nodeIntegration: false

                                }
                            })

    //xx.webContents.toggleDevTools();

    visifile.loadURL('http://192.168.0.103')

    console.log("New electron app")

    //var index = require(path.resolve('src/index.js'))


    var exec = require('child_process').exec;
    exec('sudo node src/index.js --nogui true',
        function callback(error, stdout, stderr){
            console.log("pwd")
    });

})
