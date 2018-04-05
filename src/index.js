#!/usr/bin/env node

'use strict';

var isPiModule = require('detect-rpi');

var isWin         = /^win/.test(process.platform);
var isRaspberryPi = isPiModule();


function require2(moduleName) {
	var pat;
	if (isWin) {
		pat = "require(process.cwd() + " + "'\\\\node_modules\\\\" + moduleName + "');";
	} else {
	    pat = "require(process.cwd() + " + "'/node_modules/" + moduleName + "');";
	}

	//console.log('PATH: ' + pat);
	//console.log('    MODULE PATH: ' + process.cwd() + '/node_modules/' + moduleName);
    var reac = eval(pat);
	return reac;
};

var socket          = require('socket.io');
var fs              = require('fs');
var path            = require('path');
var mkdirp          = require('mkdirp')
var rmdir           = require('rmdir-sync');
var uuidv1          = require('uuid/v1');
var fork            = require('child_process');
var express         = require('express')
var http            = require('http')
var app             = express()
var expressWs       = require('express-ws')(app);
var request         = require("request");
var open            = require('opn');
var db_helper       = require("./db_helper")
var perf            = require('./perf')
var Excel           = require('exceljs');
var compression     = require('compression')
var crypto          = require('crypto');
var dns             = require('dns');
var url             = require('url');
var unzip           = require('unzip');
var postgresdb      = require('pg');
var ip              = require("ip");
var program         = require('commander');
var os              = require('os')
var bodyParser      = require('body-parser');
var multer          = require('multer');
var upload          = multer( { dest: 'uploads/' } );
var diff            = require('deep-diff').diff
var XLSX            = require('xlsx');
var csv             = require('fast-csv');
var mysql           = require('mysql');
var cors            = require('cors')
var mammoth         = require("mammoth");
var isBinaryFile    = require("isbinaryfile");
var csvToJson       = require('csvtojson')

path.join(__dirname, '../public/jquery-1.9.1.min.js')
path.join(__dirname, '../public/jquery.zoomooz.js')
path.join(__dirname, '../public/alasql.min.js')
path.join(__dirname, '../public/hammer.min.js')
path.join(__dirname, '../public/polyfill.min.js')
path.join(__dirname, '../src/oracle.js')
path.join(__dirname, '../src/sqlite.js')
path.join(__dirname, '../src/mysql.js')
path.join(__dirname, '../src/testdriver.js')
path.join(__dirname, '../src/postgres.js')
path.join(__dirname, '../src/outlook2012.js')
path.join(__dirname, '../src/word.js')
path.join(__dirname, '../src/pdf.js')
path.join(__dirname, '../src/excel.js')
path.join(__dirname, '../src/csv.js')
path.join(__dirname, '../src/txt.js')
path.join(__dirname, '../src/glb.js')
path.join(__dirname, '../src/child.js')
path.join(__dirname, '../src/powershell.js')
path.join(__dirname, '../src/glb.js')
path.join(__dirname, '../src/common.ps1')
path.join(__dirname, '../public/gosharedata_setup.js')
path.join(__dirname, '../public/intranet.js')
path.join(__dirname, '../public/tether.min.js')
path.join(__dirname, '../public/bootstrap.min.js')
path.join(__dirname, '../public/bootstrap.min.css')
path.join(__dirname, '../public/aframe.min.js')
path.join(__dirname, '../public/es6-shim.js')
path.join(__dirname, '../public/vue_app.css')
path.join(__dirname, '../public/dist/build.js')
//path.join(__dirname, '../oracle_driver.zip')
path.join(__dirname, '../public/visifile_logo.PNG')
path.join(__dirname, '../public/VisiFileColor.png')
path.join(__dirname, '../public/VisiFileColorHoriz.png')
path.join(__dirname, '../public/favicon.ico')
path.join(__dirname, '../public/driver_icons/excel.jpg')
path.join(__dirname, '../public/driver_icons/outlook2012.jpg')
path.join(__dirname, '../public/driver_icons/csv.jpg')
path.join(__dirname, '../public/driver_icons/txt.jpg')
path.join(__dirname, '../public/driver_icons/oracle.jpg')
path.join(__dirname, '../public/driver_icons/postgres.jpg')
path.join(__dirname, '../public/driver_icons/mysql.jpg')
path.join(__dirname, '../public/driver_icons/sqlite.jpg')
path.join(__dirname, '../public/driver_icons/word.jpg')
path.join(__dirname, '../public/driver_icons/pdf.jpg')
path.join(__dirname, '../public/driver_icons/glb.jpg')
path.join(__dirname, '../public/index_pc_mode.html')
path.join(__dirname, '../public/dropzone.js')
path.join(__dirname, '../public/dropzone.css')
path.join(__dirname, '../public/locked.png')
path.join(__dirname, '../public/unlocked.png')
path.join(__dirname, '../public/visifile/list_intranet_servers.html')
path.join(__dirname, '../public/list_intranet_servers.html')
path.join(__dirname, '../public/\aframe_fonts/Roboto-msdf.json')
path.join(__dirname, '../public/\aframe_fonts/Roboto-msdf.png')
path.join(__dirname, '../public/\aframe_fonts/Aileron-Semibold.fnt')
path.join(__dirname, '../public/\aframe_fonts/Aileron-Semibold.png')
path.join(__dirname, '../public/\aframe_fonts/SourceCodePro.fnt')
path.join(__dirname, '../public/\aframe_fonts/SourceCodePro.png')
path.join(__dirname, '../public/index.html')



if (!fs.existsSync(process.cwd() + "/public") ) {
    copyFolderRecursiveSync(path.join(__dirname, "../public")  , process.cwd() ); }

if (!fs.existsSync(process.cwd() + "/node-viewerjs") ) {
    copyFolderRecursiveSync(path.join(__dirname, "../node-viewerjs")  , process.cwd() ); }

if (!fs.existsSync(process.cwd() + "/node_modules") ) {
    copyFolderRecursiveSync(path.join(__dirname, "../node_modules")  , process.cwd() ); }

if (!fs.existsSync(process.cwd() + "/node_modules/nan") ) {
    copyFolderRecursiveSync(path.join(__dirname, "../node_modules/nan")  , process.cwd() + "/node_modules" ); }

if (!fs.existsSync(process.cwd() + "/node_modules/sqlite3") ) {
    copyFolderRecursiveSync(path.join(__dirname, "../node_modules/sqlite3")  , process.cwd() + "/node_modules" ); }

if (!fs.existsSync(process.cwd() + "/node_modules/pdf2json") ) {
    copyFolderRecursiveSync(path.join(__dirname, "../node_modules/pdf2json")  , process.cwd() + "/node_modules" ); }

if (!fs.existsSync(process.cwd() + "/node_macos64") ) {
    copyFolderRecursiveSync(path.join(__dirname, "../node_macos64")  , process.cwd() ); }

if (!fs.existsSync(process.cwd() + "/node_win32") ) {
    copyFolderRecursiveSync(path.join(__dirname, "../node_win32")  , process.cwd() ); }

if (!fs.existsSync(process.cwd() + "/node_win64") ) {
    copyFolderRecursiveSync(path.join(__dirname, "../node_win64")  , process.cwd() ); }


if (!fs.existsSync(process.cwd() + "/node_pi") ) {
    copyFolderRecursiveSync(path.join(__dirname, "../node_pi")  , process.cwd() ); }




if (isWin) {
    //console.log('******* WINDOWS *******');
	// copy WIndows 32 node native files
	copyNodeNativeAdapter( "win32", "sqlite3", 		"lib/binding/node-v57-win32-ia32" , "node_sqlite3.node")
	copyNodeNativeAdapter( "win64", "sqlite3", 		"lib/binding/node-v57-win32-x64" , "node_sqlite3.node")


} else if (isRaspberryPi) {
    //console.log('******* PI *******');
	// copy Raspberry PI ARM node native files
	copyNodeNativeAdapter( "pi", "sqlite3", 	"lib/binding/node-v48-linux-arm" , "node_sqlite3.node")



} else { //means Mac OS
    //console.log('******* MAC *******');
	// copy Mac OS 64 node native files
	copyNodeNativeAdapter( "macos64", "sqlite3", 	"lib/binding/node-v57-darwin-x64" , "node_sqlite3.node")
}


var io = null;
var forkedProcesses = new Object();
var timeout                             = 0;
var port;
var hostaddress;
var typeOfSystem;
var centralHostAddress;
var centralHostPort;

var stmt2                               = null;
var stmt3                               = null;
var setIn                               = null;
var stopScan                            = false;
var inScan                              = false;
var numberOfSecondsAliveCheck           = 60;
var username                            = "Unknown user";
var serverwebsockets                    = [];
var portrange                           = 3000
var requestClientInternalHostAddress    = '';
var requestClientInternalPort           = -1;
var requestClientPublicIp               = '';
var requestClientPublicHostName         = '';
var locked;
var requestClientPublicIp;
var hostcount  							= 0;
var queuedResponses                     = new Object();
var queuedResponseSeqNum                = 0;

var sqlite3                     = require2('sqlite3');


app.use(compression())
rmdir("uploads");
mkdirp.sync("uploads");
mkdirp.sync("files");



program
  .version('0.0.1')
  .option('-t, --type [type]', 'Add the specified type of app (client/server) [type]', 'client')
  .option('-p, --port [port]', 'Which port should I listen on? (default 80) [port]', parseInt)
  .option('-h, --host [host]', 'Server address of the central host (default visifile.com) [host]', 'visifile.com')
  .option('-l, --locked [locked]', 'Allow server to be locked/unlocked on start up (default true) [locked]', 'true')
  .option('-n, --nogui [nogui]', 'Allow server to be run in headless mode (default false) [nogui]', 'false')
  .option('-d, --debug [debug]', 'Allow to run in debug mode (default false) [debug]', 'false')
  .option('-s, --hostport [hostport]', 'Server port of the central host (default 80) [hostport]', parseInt)
  .option('-r, --runservices [runservices]', 'Run the services (default true) [runservices]', true)
  .parse(process.argv);

var semver = require('semver')

var debug = false;
console.log("NodeJS version: " + process.versions.node);
if (semver.gt(process.versions.node, '6.9.0')) {
    console.log("NodeJS version > 6.9 " );
}
if (program.debug == 'true') {
    debug = true;
    console.log("       debug: true" );
} else {
    console.log("       debug: false" );
};

var runServices = (program.runservices == true);

locked = (program.locked == 'true');
var nogui = (program.nogui == 'true');
port = program.port;
if (!isNumber(port)) {
    port = 80;
};

outputToConsole('VisiFile node local hostname: ' + ip.address() + ' ')

setupVisifileParams();

//console.log(" ");
//console.log("-----------------------------------------------------------------------");
//console.log("                         Starting VisiFile ");
//console.log("-----------------------------------------------------------------------");

//console.log(" ");
//console.log(" ");
//console.log(" ");
//console.log("-----------------------------------------------------------------------");
//console.log("                 This takes about 2 minutes the first time");
//console.log("-----------------------------------------------------------------------");
//console.log(" ");


var PDFParser       = require2("pdf2json");
var sqlite3         = require2('sqlite3');

username = os.userInfo().username.toLowerCase();
var dbsearch = new sqlite3.Database(username + '.visi');
dbsearch.run("PRAGMA journal_mode=WAL;")
//dbsearch.run("PRAGMA synchronous=OFF;")
//dbsearch.run("PRAGMA count_changes=OFF;")
//dbsearch.run("PRAGMA journal_mode=MEMORY;")
//dbsearch.run("PRAGMA temp_store=MEMORY;")

//console.log("... ");

setupChildProcesses2();









function setupVisifileParams() {
    typeOfSystem = program.type;
    centralHostAddress = program.host;
    centralHostPort = program.hostport;
    if (!isNumber(centralHostPort)) {centralHostPort = 80;};


    if (!(typeOfSystem == 'client' || typeOfSystem == 'server')) {
        outputToConsole('-------* Invalid system type: ' + typeOfSystem);
        process.exit();
    };
    console.log('-------* System type: ' + typeOfSystem);
    console.log('-------* Port: ' + port);
    console.log('-------* Central host: ' + centralHostAddress);
    console.log('-------* Central host port: ' + centralHostPort);


	console.dir ( ip.address() );

	//console.log('addr: '+ ip.address());
	hostaddress = ip.address();

	}










function mainProgram() {

    startServices()
    console.log('Start Services' );

    scanHardDisk();
    console.log('Start Hard Disk Scan' );
}
























//console.log("Deep: " + diff)


var lhs = [
{line: 2, value: "The cat sat on the mat"}
,
{line: 1, value: "The cat sat on the mat2"}
,
{line: 3, value: "The cat sat on the mat2"}
    ]
;

var rhs = [

{line: 1, value: "The cat sat on the mat2"}
,
{line: 2, value: "The cat sat on the mat"}
,
{line: 3, value: "The cat sat on the mat2"}
,
{line: 4, value: "The cat sat on the mat2"}

];

var diffFn = function(lhs2, rhs2) {
    var differences = diff(lhs2, rhs2);
    return {
            new:     differences.filter(function (el) {return el.kind == 'N'}).length,
            deleted: differences.filter(function (el) {return el.kind == 'D'}).length,
            edited:  differences.filter(function (el) {return el.kind == 'E'}).length,
            array:   differences.filter(function (el) {return el.kind == 'A'}).length
    };

};
//console.log("")
//console.log("")
//console.log("")
//console.log("----------------------------------------------------------------------------------------------")
//console.log(JSON.stringify(differences,null,2))
var xdiff = diffFn(lhs, rhs);
//console.log("N: "  + JSON.stringify(xdiff.new,null,2))
//console.log("D: "  + JSON.stringify(xdiff.deleted,null,2))
//console.log("E: "  + JSON.stringify(xdiff.edited,null,2))
//console.log("A: "  + JSON.stringify(xdiff.array,null,2))
//console.log("----------------------------------------------------------------------------------------------")
//console.log("")
//console.log("")
//console.log("")








function mkdirSync(dirPath) {
    try {
        mkdirp.sync(dirPath)
    } catch (err) {
        //if (err.code !== 'EEXIST') throw err
    }
}


function outputToConsole(text) {
    var c = console;
    c.log(text);
}


function copyNodeNativeAdapter( osName, moduleName, directoryToSaveTo , nativeFileName) {
    //console.log('Copy started of : ' + osName + ', '+ moduleName + ','+ directoryToSaveTo + ','+ nativeFileName);
	if (!fs.existsSync(process.cwd() + "/node_modules/" + moduleName + "/" + directoryToSaveTo + "/" + nativeFileName) ) {
		//console.log('* Creating native driver for: ' + moduleName);
		mkdirSync(process.cwd() + "/node_modules/" + moduleName +  "/" + directoryToSaveTo);
		copyFileSync(	process.cwd() + "/node_" + osName + "/" + nativeFileName + "rename",
                        process.cwd() + "/node_modules/" + moduleName + "/" + directoryToSaveTo + "/" + nativeFileName) ;
	}
	//console.log('Copy done');
}




function isExcelFile(fname) {
    if (!fname) {
        return false;
    };
    var ext = fname.split('.').pop();
    ext = ext.toLowerCase();
    if (ext == "xls") return true;
    if (ext == "xlsx") return true;
    return false;
}


function isWordFile(fname) {
    if (!fname) {
        return false;
    };
    var ext = fname.split('.').pop();
    ext = ext.toLowerCase();
    if (ext == "docx") return true;
    return false;
}

function isPdfFile(fname) {
    if (!fname) {
        return false;
    };
    var ext = fname.split('.').pop();
    ext = ext.toLowerCase();
    if (ext == "pdf") return true;
    return false;
}




function isCsvFile(fname) {
	if (!fname) {
	return false;
	};
	var ext = fname.split('.').pop();
	ext = ext.toLowerCase();
	if (ext == "csv") return true;
	return false;
}


function isGlbFile(fname) {
		if (!fname) {
				return false;
		};
		var ext = fname.split('.').pop();
		ext = ext.toLowerCase();
		if (ext == "glb")
				return true;
		return false;
}


function saveConnectionAndQueryForFile(fileName) {
    //console.log("... in saveConnectionAndQueryForFile:::: " + fileId)
    sendOverWebSockets({
                            type:   "server_scan_status",
                            value:  "Found file " + fileName
                            });
    if (!fileName) {
        return;
    };
    if (fileName.indexOf("$") != -1) {
        return;
    };
    if (fileName.indexOf("gsd_") != -1) {
        return;
    };
    try {
        forkedProcesses["forked"].send({
                        message_type:       'saveConnectionAndQueryForFile',
                        fileId:             fileName
                        });

    } catch(err) {
        //console.log("Error " + err + " with file: " + fileName);
        return err;
    } finally {

    }
}









function scanHardDiskFromChild() {
    if (typeOfSystem == 'client') {
        if (runServices) {
            forkedProcesses["forkedIndexer"].send({ message_type: "childRunFindFolders" });
            forkedProcesses["forkedFileScanner"].send({ message_type: "childScanFiles" });
        }
    }
}


function scanHardDisk() {
    scanHardDiskFromChild();
    sendOverWebSockets({
                          type:   "server_scan_status",
                          value:  "Hard disk scan in progress"
                          });
};



function copyFileSync( source, target ) {

    var targetFile = target;

    //if target is a directory a new file with the same name will be created
    if ( fs.existsSync( target ) ) {
        if ( fs.lstatSync( target ).isDirectory() ) {
            targetFile = path.join( target, path.basename( source ) );
        }
    }

    fs.writeFileSync(targetFile, fs.readFileSync(source));
}

function copyFolderRecursiveSync( source, target ) {
    //console.log('çopy from: '+ source + ' to ' + target);
    var files = [];

    //check if folder needs to be created or integrated
    var targetFolder = path.join( target, path.basename( source ) );
    if ( !fs.existsSync( targetFolder ) ) {
        fs.mkdirSync( targetFolder );
    }

    //copy
    if ( fs.lstatSync( source ).isDirectory() ) {
        files = fs.readdirSync( source );
        files.forEach( function ( file ) {
            var curSource = path.join( source, file );
            if ( fs.lstatSync( curSource ).isDirectory() ) {
                copyFolderRecursiveSync( curSource, targetFolder );
            } else {
                copyFileSync( curSource, targetFolder );
				//console.log('copying:  ' + targetFolder);
            }
        } );
    }
}


























function sendOverWebSockets(data) {
    var ll = serverwebsockets.length;
    //console.log('send to sockets Count: ' + JSON.stringify(serverwebsockets.length));
    for (var i =0 ; i < ll; i++ ) {
        var sock = serverwebsockets[i];
        sock.emit(data.type,data);
        //console.log('                    sock ' + i + ': ' + JSON.stringify(sock.readyState));
    }
}





function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}






// ============================================================
// This sends a message to a specific websocket
// ============================================================
function sendToBrowserViaWebSocket(aws, msg) {
    aws.emit(msg.type,msg);
}









function isLocalMachine(req) {
    if ((req.ip == '127.0.0.1') || (hostaddress == req.ip)) {  // this is the correct line to use
    //if (req.ip == '127.0.0.1')  {      // this is used for debugging only so that we can deny access from the local machine
        return true;
    };
    return false;
}





//------------------------------------------------------------------------------
// test if allowed
//------------------------------------------------------------------------------
function canAccess(req,res) {
    if (!locked) {
        return true;
    };
    if (isLocalMachine(req) ) {
        return true;
    };
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end("Sorry but access to " + username + "'s data is not allowed. Please ask " + username + " to unlocked their VisiFile account");
    return false;
};






var httpServer = null;
function getPort () {
    console.log('function getPort()')
    httpServer = http.createServer(app)


    httpServer.listen(port, ip.address(), function (err) {
        console.log('trying port: ' + port + ' ')

        httpServer.once('close', function () {
        })
        httpServer.close()
        httpServer = null;
    })



    httpServer.on('error', function (err) {
        console.log('Couldnt connect on port ' + port + '...')
        if (port < portrange) {
            port = portrange
            };
        console.log('... trying port ' + port)
        portrange += 1
        getPort()
    })
    httpServer.on('listening', function (err) {
            console.log('Can connect on port ' + port + ' :) ')
            mainProgram()
    })
}












function extractHostname(url) {
    var hostname;
    //find & remove protocol (http, ftp, etc.) and get hostname

    if (url.indexOf("://") > -1) {
        hostname = url.split('/')[2];
    }
    else {
        hostname = url.split('/')[0];
    }

    //find & remove port number
    hostname = hostname.split(':')[0];
    //find & remove "?"
    hostname = hostname.split('?')[0];

    return hostname;
}




function extractRootDomain(url) {
    var domain = extractHostname(url),
        splitArr = domain.split('.'),
        arrLen = splitArr.length;

    //extracting the root domain here
    if (arrLen > 2) {
        domain = splitArr[arrLen - 2] + '.' + splitArr[arrLen - 1];
    }
    return domain;
}





function findViafromString(inp) {
    if (inp == null) {
        return "";
    }

    var ll = inp.split(' ');
    for (var i=0; i< ll.length ; i++){
        if (ll[i] != null) {
            if (ll[i].indexOf(":") != -1) {
                return extractRootDomain(ll[i]);
            }
        }
    }
    return "";
}








function aliveCheckFn() {
		var urlToConnectTo = "http://" + centralHostAddress + ":" + centralHostPort + '/client_connect';
		//console.log('-------* urlToConnectTo: ' + urlToConnectTo);
		//console.log('trying to connect to central server...');
		request({
					uri: urlToConnectTo,
					method: "GET",
					timeout: 10000,
					agent: false,
					followRedirect: true,
					maxRedirects: 10,
					qs: {
							requestClientInternalHostAddress: hostaddress
							,
							requestClientInternalPort:        port
							,
							clientUsername:        username
					}
				},
				function(error, response, body) {
					//console.log('Error: ' + error);
					if (response) {
							if (response.statusCode == '403') {
										//console.log('403 received, not allowed through firewall for ' + urlToConnectTo);
										//open("http://" + centralHostAddress + ":" + centralHostPort);
							} else {
										////console.log('response: ' + JSON.stringify(response));
										////console.log(body);
							}
					}
				});
};







































function getRoot(req, res) {
	hostcount++;
	console.log("Host: " + req.headers.host + ", " + hostcount);
	//console.log("URL: " + req.originalUrl);
	if (req.headers.host) {
		if (req.headers.host.toLowerCase().endsWith('canlabs.com')) {
		res.writeHead(301,
			{Location: 'http://canlabs.com/canlabs'}
			);
			res.end();
			return;
		};
		if (req.headers.host.toLowerCase().endsWith('gosharedata.com')) {
		res.writeHead(301,
			{Location: 'http://visifile.com/visifile/index.html?time=' + new Date().getTime()}
			);
			res.end();
			return;
		};
		if (req.headers.host.toLowerCase().endsWith('visifile.com')) {
		res.writeHead(301,
			{Location: 'http://visifile.com/visifile/index.html?time=' + new Date().getTime()}
			);
			res.end();
			return;
		};
		if (req.headers.host.toLowerCase().endsWith('visifiles.com')) {
		res.writeHead(301,
			{Location: 'http://visifile.com/visifile/index.html?time=' + new Date().getTime()}
			);
			res.end();
			return;
		};
	};

	if (typeOfSystem == 'client') {
        if (!canAccess(req,res)) {
            return;
        }
        res.end(fs.readFileSync(path.join(__dirname, '../public/go.html')));
	}
	if (typeOfSystem == 'server') {
		res.end(fs.readFileSync(path.join(__dirname, '../public/index_server.html')));
	}
}








function getFileExtension(driver) {
    if (driver == "excel") { return "xlsx"}
    if (driver == "pdf") { return "pdf"}
    if (driver == "word") { return "docx"}
    if (driver == "csv") { return "csv"}
    if (driver == "glb") { return "glb"}
    if (driver == "txt") { return "txt"}
    if (driver == "outlook2012") { return "txt"}
    return ""
}



function testFirewall(req, res) {
			var tracking_id =    url.parse(req.url, true).query.tracking_id;
			var server      =    url.parse(req.url, true).query.server;

			//console.log(JSON.stringify(tracking_id,null,2));

			res.writeHead(200, {'Content-Type': 'text/plain'});
			res.end(JSON.stringify({    got_through_firewall:   tracking_id  ,
																	server:                 server,
																	username:               username,
																	locked:                 locked
																	}));
};













function websocketFn(ws) {
    serverwebsockets.push(ws);
    sendToBrowserViaWebSocket(ws, {type: "socket_connected"});

    //console.log('Socket connected : ' + serverwebsockets.length);

    ws.on('message', function(msg) {
        var receivedMessage = eval("(" + msg + ")");
        //console.log(" 1- Server recieved message: " + JSON.stringify(receivedMessage));

        // if we get the message "server_get_all_queries" from the web browser
        if (receivedMessage.message_type == "server_get_all_queries") {

            var seqNum = queuedResponseSeqNum;
            queuedResponseSeqNum ++;
            queuedResponses[seqNum] = ws;

            //console.log(" 2 ");
            forkedProcesses["forked"].send({
                            message_type:   "get_all_queries",
                            seq_num:          seqNum
                        });
       } else if (receivedMessage.message_type == "vf") {
           parseVfCliCommand(receivedMessage.args, function(result) {
               sendToBrowserViaWebSocket(      ws,
                                           {
                                               type:   "vf_reply",
                                               result:  result
                                           });
           })

       }

});};







//------------------------------------------------------------------------------
// scan the hard disk for documents for indexing
//------------------------------------------------------------------------------
function scanharddiskFn(req, res) {
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.end(JSON.stringify([]));
		scanHardDisk();
};





function stopscanharddiskFn(req, res) {
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.end(JSON.stringify([]));
        if (typeOfSystem == 'client') {
            stopScan = true;
            sendOverWebSockets({
	                              type:   "server_scan_status",
	                              value:  "Hard disk scan stopped"
	                              });
        }
};









function file_uploadFn(req, res, next) {
      //console.log('-------------------------------------------------------------------------------------');
      //console.log('-------------------------------------------------------------------------------------');
      //console.log('-------------------------------------------------------------------------------------');
      //console.log('-------------------------------------------------------------------------------------');
      //console.log('-------------------------------------------------------------------------------------');

      //console.log(JSON.stringify(req.files.length));
      //console.log("**FILES** " + JSON.stringify(req.files));
      //console.log(    "    next: " + JSON.stringify(next));


      //console.log('......................................................................................');
      //console.log('......................................................................................');
      //console.log('......................................................................................');
      //console.log('......................................................................................');
      //console.log('......................................................................................');
      res.status( 200 ).send( req.files );


      var ll = req.files.length;
      for (var i = 0; i < ll ; i ++) {
          var ifile = req.files[i];
          //console.log("        " + JSON.stringify(ifile));
          var ext = ifile.originalname.split('.').pop();
          ext = ext.toLowerCase();
          //console.log('Ext: ' + ext);

          var localp2;
          if (isWin) {
          		localp2 = process.cwd() + '\\uploads\\' + ifile.filename;
      		} else {
          		localp2 = process.cwd() + '/uploads/' + ifile.filename;
      		};
          var localp = localp2 + '.' + ext;
          fs.renameSync(localp2, localp);
          //console.log('Local saved path: ' + localp);

          fs.stat(localp, function(err, stat) {
                console.log('ifile: ' + ifile.originalname);

                saveConnectionAndQueryForFile(localp);
          });
    }

};











function open_query_in_native_appFn(req, res) {

	//console.log('in open_query_in_native_app');
	var queryData = req.body;
	//console.log('queryData.source: ' + queryData.source);
	var error = new Object();
	try {
            if(!nogui) {
                getQuery(   queryData.source,  function(query) {
                    getConnection(query.connection, function(connection) {
                        open(connection.fileName);
                    })
                })

            }
		   res.writeHead(200, {'Content-Type': 'text/plain'});
			res.end(JSON.stringify(ordata));
	}

	catch(err) {
		res.writeHead(200, {'Content-Type': 'text/plain'});

		res.end(JSON.stringify({error: 'Error: ' + JSON.stringify(err)}));
	};
}



function getQuery(id, callbackFn) {
    try {
        dbsearch.serialize(
            function() {
        var stmt = dbsearch.all(
            "SELECT * FROM queries WHERE id = ? ",
            id
            ,

            function(err, results)
            {
                if (err)
                {
                    console.log("getQuery error: " + err)
                    callbackFn(null)
                    return
                }
                if (results.length == 0) {
                    console.log("getQuery returned no results: " + err)
                    callbackFn(null)
                    return
                }
                callbackFn(results[0])
            })
        }, sqlite3.OPEN_READONLY)
    } catch(err) {
        callbackFn(null)
    }
}






function getConnection(id, callbackFn) {
    try {
        dbsearch.serialize(
            function() {
        var stmt = dbsearch.all(
            "SELECT * FROM connections WHERE id = ? ",
            id
            ,

            function(err, results)
            {
                if (err)
                {
                    console.log("getConnection error: " + err)
                    callbackFn(null)
                    return
                }
                if (results.length == 0) {
                    console.log("getConnection returned no results: " + err)
                    callbackFn(null)
                    return
                }
                callbackFn(results[0])
            })
        }, sqlite3.OPEN_READONLY)
    } catch(err) {
        callbackFn(null)
    }
}






function getDriver(driverName, callbackFn) {
    try {
        dbsearch.serialize(
            function() {
        var stmt = dbsearch.all(
            "SELECT * FROM drivers WHERE name = ? ",
            driverName
            ,

            function(err, results)
            {
                if (err)
                {
                    console.log("getDriver error: " + err)
                    callbackFn(null)
                    return
                }
                if (results.length == 0) {
                    console.log("getDriver returned no results: " + err)
                    callbackFn(null)
                    return
                }
                callbackFn(results[0])
            })
        }, sqlite3.OPEN_READONLY)
    } catch(err) {
        callbackFn(null)
    }
}


//------------------------------------------------------------------------------
// Get the result of a query
//------------------------------------------------------------------------------
function getresultFn(req, res) {
		var queryData = req.body;
		console.log('queryData.source: ' + queryData.source);

		////console.log('request received source: ' + Object.keys(req));
		var error = new Object();
        getConnection( queryData.source, function(connection) {
		if (queryData) {
			if (connection) {
				if (queryData.source) {
					if (connection.driver) {
						//console.log('query driver: ' + connection.driver);
						try {
                            getDriver(connection.driver, function(driver) {
                                if (driver) {
                                    console.log(eval(driver.code)['get_v2'])
                                    console.log(    "conn: " + connection)
                                    eval(driver.code)['get_v2'](
                                                            connection,
                                                            {sql: queryData.sql},
                                                            function(ordata) {
                                    								res.writeHead(200, {'Content-Type': 'text/plain'});

                                    								res.end(JSON.stringify(ordata));
                                    							});
                                } else {
                                    console.log("No driver found for: " + connection.driver)
                                }
                            })

						}
						catch(err) {
							res.writeHead(200, {'Content-Type': 'text/plain'});

							res.end(JSON.stringify({error: 'Error: ' + JSON.stringify(err)}));
						};
					} else {
						//console.log('query driver not found: ' + connection);
							res.writeHead(200, {'Content-Type': 'text/plain'});
							res.end(JSON.stringify({message: 'query driver not found'}));
					};
				};
			};
		};
    })
}






//------------------------------------------------------------------------------
// Get the result of a search
//------------------------------------------------------------------------------
function get_related_documentsFn(req, res) {
    //console.log("called get_related_documents: " )
    var id = req.query.id;
    forkedProcesses["forked"].send({
                            message_type:   "getRelatedDocuments",
                            id:  id
                            });
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end( JSON.stringify({}))
}



































function send_client_detailsFn(req, res) {
    ////console.log('in send_client_details: ' + JSON.stringify(req,null,2));
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end(JSON.stringify({
            returned:           'some data ',
            server:             hostaddress,
            port:               port,
            username:           username,
            locked:             locked,
            localIp:            req.ip,
            isLocalMachine:     isLocalMachine(req) }));
}


function lockFn(req, res) {
    if ((req.query.locked == "TRUE") || (req.query.locked == "true")) {
        locked = true;
    } else {
        locked = false;
    }

        ////console.log('in lock: ' + JSON.stringify(req,null,2));
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end(JSON.stringify({locked: locked}));
}




//------------------------------------------------------------------------------
// This is called by the central server to get the details of the last
// client that connected tp the central server
//------------------------------------------------------------------------------
function get_connectFn(req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end(
            JSON.stringify(
                {
                    requestClientInternalHostAddress: requestClientInternalHostAddress
                    ,
                    requestClientInternalPort:        requestClientInternalPort
                    ,
                    requestClientPublicIp:            requestClientPublicIp
                    ,
                    requestClientPublicHostName:      requestClientPublicHostName
                    ,
                    version:      31
                }
          ));
}





function add_new_connectionFn(req, res) {
    var params = req.body;
    forkedProcesses["forked"].send({ message_type: "addNewConnection" , params: params});
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end(JSON.stringify({done: "ok"}))};



function add_new_queryFn(req, res) {
    var params = req.body;
    forkedProcesses["forked"].send({ message_type: "addNewQuery" , params: params});
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end(JSON.stringify({done: "ok"}))};


var mainNodeProcessStarted = false;



function setUpChildListeners(processName, fileName, debugPort) {

    forkedProcesses[processName].on('close', function() {
        console.log("Child process " + processName + " exited.. restarting... ")
        setupForkedProcess(processName, fileName, debugPort)
    });


    forkedProcesses[processName].on('message', (msg) => {
        //console.log("message from child: " + JSON.stringify(msg,null,2))
        //console.log("message type from child: " + JSON.stringify(msg.message_type,null,2))
        if (msg.message_type == "return_test_fork") {
            //console.log('Message from child', msg);
            sendOverWebSockets({
                                    type:   "test_fork",
                                    value:  "Counter: " + msg.counter + ", count queries from sqlite: " + msg.sqlite
                                    });


        } else if (msg.message_type == "return_set_connection") {



        } else if (msg.message_type == "return_set_query") {

            //console.log(".. Main process received a 'return_set_query' message")
            var query = JSON.stringify(
                          {  id:            msg.id,
                             name:          msg.name,
                             connection:    msg.connection,
                             driver:        msg.driver,
                             size:          msg.size,
                             hash:          msg.hash,
                             fileName:      msg.fileName,
                             type:          msg.type,
                             definition:    msg.definition,
                             preview:       msg.preview
                         })

            sendOverWebSockets({
                                    type: "uploaded",
                                    id:    msg.id,
                                    query:
                                    {
                                    }});

            sendOverWebSockets({
                                    type: "update_query_item",
                                    query: query
            });


            sendOverWebSockets({   type: "client_get_all_queries_done"  });


        // this needs to be fixed so that it only sends the similar documents
        // to the client that requested them
        } else if (msg.message_type == "return_similar_documents") {




        } else if (msg.message_type == "createdTablesInChild") {
            forkedProcesses["forked"].send({ message_type: "init" });
            if (!mainNodeProcessStarted) {
                mainNodeProcessStarted = true
                getPort()
            }


        } else if (msg.message_type == "parentSetSharedGlobalVar") {





        } else if (msg.message_type == "getResultReturned") {
            var newres = queuedResponses[ msg.seqNum ]
            newres.writeHead(200, {'Content-Type': 'text/plain'});
            newres.end(JSON.stringify(msg.result));
            newres = null;




        } else if (msg.message_type == "returnDownloadWebDocument") {
            var rett = eval("(" + msg.returned + ")");
            var newres = queuedResponses[ msg.seq_num ]

            newres.writeHead(200, {'Content-Type': 'text/plain'});
            newres.end(JSON.stringify({  result: rett.result}));

            newres = null;





        } else if (msg.message_type == "return_get_search_results") {
            //console.log("6 - return_get_search_results: " + msg.returned);
            var rett = eval("(" + msg.returned + ")");
            var newres = queuedResponses[ msg.seq_num ]

            newres.writeHead(200, {'Content-Type': 'text/plain'});
            newres.end(msg.returned);

            newres = null;


            //zzz
    } else if (msg.message_type == "return_get_search_results_json") {
        console.log("3 - /client/1/search: return_get_search_results_json")

            //console.log("6 - return_get_query_results: " + JSON.stringify(msg,null,2));
            var rett = eval("(" + msg.returned + ")");
            var newres = queuedResponses[ msg.seq_num ]

            var result = {
                            message:          "Search results for: '" + msg.search_term + "'",
                            results_count:    -1,
                            links:           {"self": { "href": "/client/1/search" }},
                            results:         []
                        }

            var realCount = 0
            for (var i = 0; i < rett.queries.length; i++) {
                var resitem = rett.queries[i];
                if (resitem && (resitem.data.length > 0)) {
                    result.results.push({
                        query_id:      resitem.id,
                        computer_name: username + "@" + hostaddress + ":" + port,
                        val:           resitem.data
                    })
                    realCount ++
                }
            }
            result.results_count = realCount
//msg.result


            newres.writeHead(200, {'Content-Type': 'application/json'});
            newres.end(JSON.stringify(result));

            newres = null;





        } else if (msg.message_type == "return_get_query_results") {
                //console.log("6 - return_get_query_results: " + msg.result);
                var rett = eval("(" + msg.result + ")");
                var newres = queuedResponses[ msg.seq_num ]

                newres.writeHead(200, {'Content-Type': 'text/plain'});
                newres.end(msg.result);

                newres = null;






        } else if (msg.message_type == "return_get_all_table") {
                //console.log("6 - return_get_all_table: " );
                var newres = queuedResponses[ msg.seq_num ]

                newres.writeHead(200, {'Content-Type': 'text/plain'});
                newres.end(msg.result);

                newres = null;



        } else if (msg.message_type == "returnDownloadDocuments") {
            var newres = queuedResponses[ msg.seq_num ]

            if (msg.returned.error) {
                newres.end(JSON.stringify({  error: msg.returned.error}));

            } else if (msg.returned.result) {
                var contentRecord = msg.returned.result
                var content = Buffer.from(JSON.parse(msg.content).data);

                //console.log("9: " + contentRecord.content_type);
                //console.log("10: " + contentRecord.id);
                //console.log("11: " + contentRecord.driver);
                //console.log("12: " + content.length);
                //console.log("13: " + content);
                //console.log("14: " + Object.keys(contentRecord));
                newres.writeHead(

                                200,

                                {
                                    'Content-Type': contentRecord.content_type,
                                    'Content-disposition': 'attachment;filename=' + contentRecord.id  + "." + getFileExtension(contentRecord.driver),
                                    'Content-Length': content.length
                                });


                newres.end(new Buffer(  content, 'binary'  ));
            } else {
                newres.end(JSON.stringify({  error: "No results"}));
            }

            newres = null;


        } else if (msg.message_type == "returnIntranetServers") {
            var newres = queuedResponses[ msg.seq_num ]

            newres.writeHead(200, {'Content-Type': 'text/plain'});


            if (msg.returned) {
                newres.end( JSON.stringify( {  allServers:         msg.returned,
                                               intranetPublicIp:   msg.requestClientPublicIp}) );
            } else {
                //console.log( "8: " + msg.error );
                newres.end(JSON.stringify( {  allServers:        [],
                                              intranetPublicIp:  msg.requestClientPublicIp}) );
            }
            newres = null;




        } else if (msg.message_type == "returnIntranetServers_json") {
            var newres = queuedResponses[ msg.seq_num ]

            newres.writeHead(200, {'Content-Type': 'application/json'});

            var result = {
                            list:               [],
                            links:              {"self": { "href": "/start" }},
                        }


            if (msg.returned) {
                result.links.servers    = {}
                result.intranetPublicIp = msg.requestClientPublicIp
                result.error            = false
                result.count            = msg.returned.length

                if (msg.returned.length > 0) {

                    result.main_user    = msg.returned[0].client_user_name
                    result.main         = msg.returned[0].internal_host + ":" + msg.returned[0].internal_port
                    result.main_url     = "http://" +  msg.returned[0].internal_host + ":" +
                                            msg.returned[0].internal_port + "/home"
                }


                for (var i =0 ; i< msg.returned.length; i ++) {

                    var addr = msg.returned[i].internal_host + ":" + msg.returned[i].internal_port
                    result.list.push( addr )
                    result.links.servers[addr] =
                        {"href":        "http://" +  addr + "/home" ,
                         "user":         msg.returned[i].client_user_name}
                    }

                    newres.end(JSON.stringify(result));
            } else {
                newres.end(JSON.stringify( {  allServers:        [],
                                              error:              true}) );
            }
            newres = null;






        } else if (msg.message_type == "returnClientConnect") {
            //console.log("6: returnClientConnect")
            //console.log("6.1: " + msg)
            //console.log("7: " + msg.returned)
            var newres = queuedResponses[ msg.seq_num ]



            if (msg.returned) {
                newres.writeHead(200, {'Content-Type': 'text/plain'});
                newres.end( JSON.stringify( JSON.stringify({  connected:         msg.returned })) );
            }
            newres = null;





        } else if (msg.message_type == "return_query_item") {
            //console.log("6: return_query_item")
            //console.log("6.1: " + msg)
            //console.log("7: " + msg.returned)
            var new_ws = queuedResponses[ msg.seq_num ]

            if (msg.returned) {
                sendToBrowserViaWebSocket(
                new_ws,
                {
                    type: "update_query_item",
                    query: msg.returned
                });
            }







        } else if (msg.message_type == "return_query_items_ended") {
            //console.log("6: return_query_items_ended")
            //console.log("6.1: " + msg)
            var new_ws = queuedResponses[ msg.seq_num ]

            sendToBrowserViaWebSocket(      new_ws,
                                        {   type: "client_get_all_queries_done"  });
            //new_ws = null;
        }


//
//







    });
}






function setupChildProcesses2() {
    //console.log("-------------------------------------------------------------------");
    //console.log("-------------------------------------------------------------------");
    //console.log("-------------------------------------------------------------------");
    //console.log("-------------------------------------------------------------------");
    //console.log("-------------------------------------------------------------------");

    setupForkedProcess("forked", "child.js", 40003)
}






function setupForkedProcess(processName,fileName,debugPort) {
    var debugArgs =[];
    if (debug) {
        if (semver.gte(process.versions.node, '6.9.0')) {
            debugArgs = ['--inspect=' + debugPort];
        } else {
            debugArgs = ['--debug=' + debugPort];
        };
    };
    if (isWin) {
        forkedProcesses[  processName  ] = fork.fork(path.join(__dirname, '../src/' + fileName), [], {execArgv: debugArgs});
    } else {
        forkedProcesses[  processName  ] = fork.fork(path.join(__dirname, '../src/' + fileName), [], {execArgv: debugArgs});
    }
    setUpChildListeners(processName, fileName, debugPort);


    if (processName == "forked") {
        forkedProcesses["forked"].send({ message_type: "createTables" });
        forkedProcesses["forked"].send({ message_type: "greeting", hello: 'world' });
    }

    if (processName == "forkedIndexer") {
        forkedProcesses["forkedIndexer"].send({ message_type: "init" });
		forkedProcesses["forkedIndexer"].send({ message_type: "childRunIndexer" });
    }



    if (processName == "forkedFileScanner") {
        if (runServices) {
            forkedProcesses["forkedFileScanner"].send({ message_type: "init" });
        }
    }

    if (processName == "forkedPowershell") {
        forkedProcesses["forkedPowershell"].send({ message_type: "init" });
        if (runServices) {
            forkedProcesses["forkedPowershell"].send({ message_type: "call_powershell" });
        }
    }



    console.log("Started subprocess '" + processName + "' ")


}






function setupChildProcesses() {
    //console.log("-------------------------------------------------------------------");
    //console.log("-------------------------------------------------------------------");
    //console.log("-------------------------------------------------------------------");
    //console.log("-------------------------------------------------------------------");
    //console.log("-------------------------------------------------------------------");

    setupForkedProcess("forkedIndexer","child.js", 40000)
    setupForkedProcess("forkedFileScanner","child.js", 40001)

    if (isWin) {
        setupForkedProcess("forkedPowershell","powershell.js", 40002)
    }
}


//------------------------------------------------------------
// This starts all the system services
//------------------------------------------------------------
function startServices() {
    app.use(cors())

    //------------------------------------------------------------------------------
    // Show the default page for the different domains
    //------------------------------------------------------------------------------
    app.get('/', function (req, res) {
        //console.log("app.get('/'");
    	return getRoot(req, res);
    })

    app.use("/files", express.static(process.cwd() + '/files/'));

    app.use("/public/aframe_fonts", express.static(path.join(__dirname, '../public/aframe_fonts')));
    app.use('/viewer', express.static(process.cwd() + '/node-viewerjs/release'));
    app.use(express.static(path.join(process.cwd(), '/public/')))
    app.use(bodyParser.json()); // support json encoded bodies
    app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies





    //------------------------------------------------------------------------------
    // Download documents to the browser
    //------------------------------------------------------------------------------
    app.get('/docs2/*', function (req, res) {
        var fileId = req.url.substr(req.url.lastIndexOf('/') + 1)

        var seqNum = queuedResponseSeqNum;
        queuedResponseSeqNum ++;
        queuedResponses[seqNum] = res;
        forkedProcesses["forked"].send({   message_type:   "downloadDocuments",
                        seq_num:         seqNum,
                        file_id:         fileId });
    });


    //------------------------------------------------------------------------------
    // Download web documents to the browser
    //------------------------------------------------------------------------------
    app.get('/get_web_document', function (req, res) {
        var seqNum = queuedResponseSeqNum;
        queuedResponseSeqNum ++;
        queuedResponses[seqNum] = res;
        forkedProcesses["forked"].send({   message_type:   "downloadWebDocument",
                        seq_num:         seqNum,
                        query_id:        req.query.id });
    });




    //------------------------------------------------------------------------------
    // test get JSON
    //------------------------------------------------------------------------------
    app.get('/vf', function (req, res) {
        var args2 = decodeURI(url.parse(req.url, true).query.a);
        var args  = JSON.parse(args2);

        parseVfCliCommand(args, function(result) {
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({    OK: result      }));
        })


    });



    //------------------------------------------------------------------------------
    // Main home page for the entire REST interface
    //------------------------------------------------------------------------------
    app.get('/home', function (req, res) {
        var result = {
                        list:  [],
                        links: {
                            "self": { "href": "/home" },
                            "admin/1": { "href": "/admin/1/home" },
                            "client/1": { "href": "/client/1/home" },
                        }
                    }

        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(result));
    })




    //------------------------------------------------------------------------------
    // ls
    //------------------------------------------------------------------------------
    app.get('/admin/1/home', function (req, res) {
        var result = {
                        list:  [],
                        links: {
                            "self": { "href": "/admin/1/home" },
                            "up": { "href": "/home" },
                            "ls": { "href": "/admin/1/ls" },
                            "drivers": { "href": "/admin/1/drivers" }
                        }
                    }

        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(result));
    })

    //------------------------------------------------------------------------------
    // ls
    //------------------------------------------------------------------------------
    app.get('/client/1/home', function (req, res) {
        var result = {
                        list:  [],
                        links: {
                            "self": { "href": "/client/1/home" },
                            "up": { "href": "/home" },
                            "search": { "href": "/client/1/search" }
                        }
                    }

        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(result));
    })

    //------------------------------------------------------------------------------
    // ls
    //------------------------------------------------------------------------------
    app.get('/admin/1/ls', function (req, res) {
        var result = {
                        list:  [],
                        links: {"self": { "href": "/ls" }}
                    }
        var serverNames = lsFn(function(servers) {
            result.links.servers = {}
            for (var i =0 ; i< servers.length; i ++) {
                var addr = servers[i].internal_host + ":" + servers[i].internal_port
                result.list.push( addr )
                result.links.servers[addr] =
                    {"href": "http://" +  addr + "/admin/1/ls" }
            }

            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(result));        })



    });


    //------------------------------------------------------------------------------
    // get_intranet_servers
    //------------------------------------------------------------------------------
    app.get('/start', function (req, res) {
        //console.log("1 - get_intranet_servers: " + req.ip)
        //console.log("1.1 - get_intranet_servers: " + Object.keys(req.headers))

        var seqNum = queuedResponseSeqNum;
        queuedResponseSeqNum ++;
        queuedResponses[seqNum] = res;
        //console.log("2")
        forkedProcesses["forked"].send(
                    {   message_type: "get_intranet_servers_json",
                        seq_num:                    seqNum,
                        requestClientPublicIp:      req.ip ,
                        numberOfSecondsAliveCheck:  numberOfSecondsAliveCheck,
                        requestVia:                 findViafromString(req.headers.via)
                        });


    });

        //------------------------------------------------------------------------------
    // ls
    //------------------------------------------------------------------------------
    app.get('/admin/1/drivers', function (req, res) {
        var result = {
                        list:  [],
                        links: {"self": { "href": "/admin/1/drivers" }}
                    }
        driversFn(function(driverNames) {
            result.links.drivers = {}
            for (var i =0 ; i< driverNames.length; i ++) {
                result.list.push( driverNames[i] )
                result.links.drivers[driverNames[i]] =
                    {"href": "/drivers/" +  driverNames[i]}
            }
        })


        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(result));
    });



//zzz
    //------------------------------------------------------------------------------
    // search
    //------------------------------------------------------------------------------
    app.get('/client/1/search/*', function (req, res) {
        console.log("1 - /client/1/search")
        var searchTerm = req.url.substr(req.url.lastIndexOf('/') + 1)
        //console.log("1 - get_search_results ,req.query.search_text: " + req.query.search_text)
        //console.log("    get_search_results ,req.query.search_text: " + new Date().getTime())

        //var args2 = decodeURI(url.parse(req.url, true).query.a);
        //var args  = JSON.parse(args2);

        var seqNum = queuedResponseSeqNum;
        queuedResponseSeqNum ++;
        queuedResponses[seqNum] = res;
        //console.log("2 - get_search_results")
        forkedProcesses["forked"].send({   message_type: "get_search_results_json",
                        seq_num:                    seqNum,
                        searchTerm:                 searchTerm,
                        timeStart:                  new Date().getTime()
                        });





    });



    //------------------------------------------------------------------------------
    // test_firewall
    //------------------------------------------------------------------------------
    app.get('/test_firewall', function (req, res) {
        return testFirewall(req,res);
    });



    //------------------------------------------------------------------------------
    // get_intranet_servers
    //------------------------------------------------------------------------------
    app.get('/get_intranet_servers', function (req, res) {
        //console.log("1 - get_intranet_servers: " + req.ip)
        //console.log("1.1 - get_intranet_servers: " + Object.keys(req.headers))

        var seqNum = queuedResponseSeqNum;
        queuedResponseSeqNum ++;
        queuedResponses[seqNum] = res;
        //console.log("2")
        forkedProcesses["forked"].send({   message_type:               "get_intranet_servers",
                        seq_num:                    seqNum,
                        requestClientPublicIp:      req.ip ,
                        numberOfSecondsAliveCheck:  numberOfSecondsAliveCheck,
                        requestVia:                 findViafromString(req.headers.via)
                        });


    });




    //------------------------------------------------------------------------------
    // Scan the hard disk for documents to Index
    //------------------------------------------------------------------------------
    app.get('/scanharddisk', function (req, res) {
    		return scanharddiskFn(req, res)
    });




    app.get('/stopscanharddisk', function (req, res) {
    		return stopscanharddiskFn(req, res)
    });


    app.post('/file_upload', upload.array( 'file' ), function (req, res, next) {
        return file_uploadFn(req, res, next);
    });




    app.post('/open_query_in_native_app', function (req, res) {
    		return open_query_in_native_appFn(req, res);
    })


    //------------------------------------------------------------------------------
    // Get the result of a SQL query
    //------------------------------------------------------------------------------
    app.post('/getresult', function (req, res) {
    	  return getresultFn(req, res);
    })


    //------------------------------------------------------------------------------
    // Get the related documents
    //------------------------------------------------------------------------------
    app.get('/get_related_documents', function (req, res) {
        return get_related_documentsFn(req, res);
    })


    //------------------------------------------------------------------------------
    // Get the result of a search
    //------------------------------------------------------------------------------
    app.get('/get_search_results', function (req, res) {
        //console.log("1 - get_search_results ,req.query.search_text: " + req.query.search_text)
        //console.log("    get_search_results ,req.query.search_text: " + new Date().getTime())

        var seqNum = queuedResponseSeqNum;
        queuedResponseSeqNum ++;
        queuedResponses[seqNum] = res;
        //console.log("2 - get_search_results")
        forkedProcesses["forked"].send({   message_type:               "get_search_results",
                        seq_num:                    seqNum,
                        searchTerm:                 req.query.search_text,
                        timeStart:                  new Date().getTime()
                        });

    });



    app.post('/getqueryresult', function (req, res) {
        //console.log("1 - getqueryresult ,req.query.search_text: " )

        var queryData2 = req.body;
    	//console.log('in getqueryresult: ' + JSON.stringify(queryData2));
    	//console.log('           source: ' + JSON.stringify(queryData2.source));
    	////console.log('request received source: ' + Object.keys(req));
    	////console.log('request received SQL: ' + queryData.sql);


    	//console.log('           query: ' + JSON.stringify(query));
        getQuery(queryData2.source,function(query){
        	if (query) {
        		var queryData 			= new Object();
        		queryData.source 		= query.connection;
        		queryData.definition 	= eval('(' + query.definition + ')' );
                console.log("                                 source =  " + queryData.source )
                console.log("                                 definition =  " + queryData.definition )

                var seqNum = queuedResponseSeqNum;
                queuedResponseSeqNum ++;
                queuedResponses[seqNum] = res;

                console.log("2 - getqueryresult")
                forkedProcesses["forked"].send({   message_type:               "get_query_result",
                                seq_num:                    seqNum,
                                connection_id:              queryData.source,
                                query_id:                   queryData2.source,
                                definition:                 queryData.definition
                                });
        } else {
    		console.log('query not found: ' + queryData2.source);
    	};
    })
})


    app.get('/send_client_details', function (req, res) {
    	return send_client_detailsFn(req, res);
    })


    app.get('/lock', function (req, res) {
        return lockFn(req, res);
    })


    process.on('uncaughtException', function (err) {
      console.log(err);
    })



    //------------------------------------------------------------------------------
    // This is called by the central server to get the details of the last
    // client that connected tp the central server
    //------------------------------------------------------------------------------
    app.get('/get_connect', function (req, res) {
    	return get_connectFn(req, res);
    })

    //app.enable('trust proxy')


    app.get('/get_all_table', function (req, res) {
        var tableName = url.parse(req.url, true).query.tableName;
        var fields = url.parse(req.url, true).query.fields;

        //console.log("1 - get_all_table ,tableName: " + tableName)
        //console.log("    get_all_table ,fields: "    + fields)

        var seqNum = queuedResponseSeqNum;
        queuedResponseSeqNum ++;
        queuedResponses[seqNum] = res;
        //console.log("2 - get_search_results")
        forkedProcesses["forked"].send({   message_type:               "get_all_tables",
                        seq_num:                    seqNum,
                        table_name:                 tableName,
                        fields:                     fields
                        });    });

    app.post('/add_new_connection', function (req, res) {
    		return add_new_connectionFn(req, res)
    });



    app.post('/add_new_query',function (req, res) {
        return add_new_queryFn(req, res)
    });





    //------------------------------------------------------------------------------
    // run on the central server only
    //
    // This is where the client sends its details to the central server
    //------------------------------------------------------------------------------
    app.get('/client_connect', function (req, res) {

        //console.log("1 - client_connect: ")
        var queryData = url.parse(req.url, true).query;

		var requestClientInternalHostAddress = req.query.requestClientInternalHostAddress;
        //console.log("    requestClientInternalHostAddress: "  + requestClientInternalHostAddress)

		var requestClientInternalPort        = req.query.requestClientInternalPort;
        //console.log("    requestClientInternalPort: "  + requestClientInternalPort)

		var requestVia                       = findViafromString(req.headers.via);
        //console.log("    requestVia: "  + requestVia)

		var requestClientPublicIp            = req.ip;
        //console.log("    requestClientPublicIp: "  + requestClientPublicIp)

        var clientUsername                   = req.query.clientUsername;
        //console.log("    clientUsername: "  + clientUsername)

		//requestClientPublicHostName      = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
		var requestClientPublicHostName      = "req keys::" + Object.keys(req) + ", VIA::" + req.headers.via + ", raw::" + JSON.stringify(req.rawHeaders);
        //console.log("    requestClientPublicHostName: "  + requestClientPublicHostName)





        var seqNum = queuedResponseSeqNum;
        queuedResponseSeqNum ++;
        queuedResponses[seqNum] = res;
        //console.log("2")
        forkedProcesses["forked"].send({   message_type:                       "client_connect",
                        seq_num:                            seqNum,
                        requestClientInternalHostAddress:   requestClientInternalHostAddress,
                        requestClientInternalPort:          requestClientInternalPort,
                        requestVia:                         requestVia,
                        requestClientPublicIp:              requestClientPublicIp,
                        clientUsername:                     clientUsername,
                        requestClientPublicHostName:        requestClientPublicHostName
                        });

    })






    //------------------------------------------------------------------------------
    // start the web server
    //------------------------------------------------------------------------------
    httpServer = http.createServer(app)
    httpServer.listen(port, hostaddress, function () {
    	console.log(typeOfSystem + ' started on port ' + port + ' with local folder at ' + process.cwd() + ' and __dirname = ' + __dirname);
        console.log("");
        console.log("Started on:");
        console.log("http://" + hostaddress + ':' + port);

        io = socket.listen(httpServer);

        io.on('connection', function (sck) {
            var connt = JSON.stringify(sck.conn.transport,null,2);
            websocketFn(sck)
        });

    })




      //console.log('addr: '+ hostaddress + ":" + port);






    aliveCheckFn();


    setupChildProcesses();

    if (typeOfSystem == 'client') {
        setInterval(aliveCheckFn ,numberOfSecondsAliveCheck * 1000);
    }




    forkedProcesses["forked"].send({ message_type: "when_connections_changes" });
    forkedProcesses["forked"].send({ message_type: "when_queries_changes" });





    forkedProcesses["forked"].send({message_type:       'setUpDbDrivers'});














	//--------------------------------------------------------
	// open the app in a web browser
	//--------------------------------------------------------

var alreadyOpen = false;
	if (typeOfSystem == 'client') {
        var localClientUrl = 'http://' + hostaddress  + ":" + port;
        var remoteServerUrl = 'http://' + centralHostAddress  + ":" + centralHostPort + "/visifile/list_intranet_servers.html?time=" + new Date().getTime();
        if(!nogui) {
            open(localClientUrl);
        }

        request({
                  uri: remoteServerUrl,
                  method: "GET",
                  timeout: 10000,
                  agent: false,
                  followRedirect: true,
                  maxRedirects: 10
            },
            function(error, response, body) {
              if (error) {
                  //console.log("Error opening central server: " + error);
                  if (!alreadyOpen) {
                      alreadyOpen = true;
                  }
              } else {
                if (!alreadyOpen) {
                    alreadyOpen = true;
                    //open(remoteServerUrl);
                }
              }
            });
	} else if (typeOfSystem == 'server') {
        if (!alreadyOpen) {
            alreadyOpen = true;
            open('http://' + hostaddress  + ":" + port + "/visifile/list_intranet_servers.html?time=" + new Date().getTime());
        }
	}


}









var isPcDoingStuff = false;
//Set delay for second Measure
setInterval(function() {
    perf.isDoingStuff(function(retVal){
        if ((retVal == false) &&  (isPcDoingStuff)){
            sendOverWebSockets({
                                    type:   "server_scan_status",
                                    value:  "VisiFile Server busy - scanning paused "
                                    });
        }

        isPcDoingStuff = retVal;
        //console.log("    isPcDoingStuff = " + isPcDoingStuff);
    });
}, 1000);













const shell = require('node-powershell');

function lsFn(callbackFn) {
    var remoteServerUrl = 'http://' + centralHostAddress  + ":" +
        centralHostPort + "/get_intranet_servers?time=" + new Date().getTime();

    request({
        uri: remoteServerUrl,
        method: "GET",
        timeout: 10000,
        agent: false,
        followRedirect: true,
        maxRedirects: 10
  },
  function(error, response, body) {
    if (error) {
        console.log("Error opening central server: " + error);
    } else {
        console.log("back: " );
        var servers = []
        var returned= eval( "(" + body + ")");
        for (var i = 0 ; i < returned.allServers.length; i++) {
            //console.log('got server ' + i)
            //console.log(JSON.stringify(returned.allServers[i],null,2))
            var tt = new Object();
            tt.username = returned.allServers[i].client_user_name;
            tt.internal_host = returned.allServers[i].internal_host;
            tt.internal_port = returned.allServers[i].internal_port;
            tt.via           = returned.allServers[i].via;
            servers.push(tt)
        };
        callbackFn(servers)

    }
  });
}



function driversFn(callbackFn) {
    dbsearch.serialize(
        function() {
            var result = []
            var stmt = dbsearch.all(
                "SELECT * FROM drivers",

                function(err, results)
                {
                    for (var i =0 ; i< results.length; i ++) {
                        result.push(results[i].name)
                    }
                    callbackFn( result);
                })
    }, sqlite3.OPEN_READONLY)
}





function parseVfCliCommand(args, callbackFn) {
    var result = ""
    var countArgs = args.length
    var addedVf = false;

    if (args[0] == 'vf') {
        args.shift()
        addedVf = true
    }
    var verb = args[0]
    var noun = args[1]
    if ((countArgs == 1) && (verb == 'home')) {

        result += "Details of this server:\n\n"
        result += "Address:        " + hostaddress + ":" + port + "\n"
        result += "User:           " + username + "\n"
        result += "NodeJS version: " + process.versions.node + "\n"
        result += "Debug mode:     " + debug + "\n"
        result += "OS Type:        " + os.type() + "\n"
        result += "OS Version:     " + os.release() + "\n"
        result += "OS Platform:    " + os.platform() + "\n"

        callbackFn(result)


    } else if ((countArgs == 1) && (verb == 'drivers')) {
        driversFn(function(driverNames) {
            for (var i =0 ; i< driverNames.length; i ++) {
                result += driverNames[i] + "\n"
            }
            callbackFn(result)
        })


    } else if (verb == 'add') {
        if (noun == 'driver') {
            request({
                uri: "http://" + hostaddress + ":" + port + "/visifile_drivers/outlook2010.json",
                method: "GET",
                timeout: 10000,
                agent: false,
                followRedirect: true,
                maxRedirects: 10
            },
            function(error, response, body) {
                if (error) {
                    result += "Driver error " + error + "\n"
                } else {
                    result += "Driver added" + JSON.stringify(response,null,2) + "\n"
                }
                callbackFn(result)
                return
           })
        }






    } else if ((countArgs == 1) && (verb == 'test')) {
        result += "Test successful. Connected to " + hostaddress + ":" + port
        callbackFn(result)
        return


    } else {
        if (addedVf && (countArgs == 0)) {
            result += "You must enter a command. eg: vf drivers'"
        }
        else {
            result += "Unknown command: '" + verb + "'"
        }
        callbackFn(result)
        return
        }
}
