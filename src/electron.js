const electron = require('electron')


// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const path = require("path");
const url = require('url');
var fs = require('fs');


app.on('ready', function() {
    var visifile = new BrowserWindow({
                                width: 800,
                                height: 600,
                                webPreferences: {
                                    nodeIntegration: false

                                },
                                icon:'public/VisiFileColor.png'
                            })

    visifile.loadURL(url.format({
        pathname: path.join(__dirname, '../loading.html'),
        protocol: 'file:',
        slashes: true
      }))

    //visifile.webContents.toggleDevTools();

    setTimeout(function() {
            visifile.loadURL('http://192.168.0.103')
    }, 5000)


    console.log("New electron app")

    //var index = require(path.resolve('src/index.js'))


    var exec = require('child_process').exec;
    exec('sudo node src/index.js --nogui true',
        function callback(error, stdout, stderr){
            console.log("Loaded Server")
    });

})
