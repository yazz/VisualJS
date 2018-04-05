const electron = require('electron')


// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const path = require("path");
const url = require('url');
var fs = require('fs');
var ip = require('ip');

var port;
var hostaddress;

hostaddress = ip.address();
port = 80


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

    visifile.webContents.toggleDevTools();

    setTimeout(function() {
		var add = 'http://' + hostaddress + ":" + port
		console.log(add)
        visifile.loadURL(add)
    }, 5000)
	
	var nodeConsole = require('console');
	var myConsole = new nodeConsole.Console(process.stdout, process.stderr);
	myConsole.log('Hello World!');


    console.log("New electron app")

    //var index = require(path.resolve('src/index.js'))


    var exec = require('child_process').exec;
    var ls    = exec('sudo node src/index.js --nogui true')
	ls.stdout.on('data', function (data) {
	  console.log('stdout: ' + data.toString());
	});

})
