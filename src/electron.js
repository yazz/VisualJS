const electron = require('electron')


// Module to control application life.
const electronApp = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow
var startNodeServer = false
const path = require("path");
const url = require('url');
var fork            = require('child_process');
var fs = require('fs');
var ip = require('ip');
var isWin         = /^win/.test(process.platform);
var isPiModule = require('detect-rpi');
var mainNodeProcessStarted = false;



var isRaspberryPi = isPiModule();
console.log('...');

var socket          = require('socket.io');
var fs              = require('fs');
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
//var Excel           = require('exceljs');
var compression     = require('compression')
var crypto          = require('crypto');
var dns             = require('dns');
//var unzip           = require('unzip');
var postgresdb      = require('pg');

var program         = require('commander');
var bodyParser      = require('body-parser');
var multer          = require('multer');
var diff            = require('deep-diff').diff
var XLSX            = require('xlsx');
var csv             = require('fast-csv');
var mysql           = require('mysql');
var cors            = require('cors')
var mammoth         = require("mammoth");
var isBinaryFile    = require("isbinaryfile");
var csvToJson       = require('csvtojson')


var sqlite3                     = require('sqlite3');


var os              = require('os')
var username                            = "Unknown user";
username = os.userInfo().username.toLowerCase();
var upload

var dbPath = null

var dbsearch = null
var userData = null

var port;
var hostaddress;
  var ls = null
hostaddress = ip.address();
port = 80
var f = 0
var started = false

var visifile



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


console.log('Starting services');

app.use(compression())



if (process.argv.length > 1) {

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
} else {
    program.type = 'client'
    program.host = 'visifile.com'
    program.locked = 'true'
    program.nogui = 'false'
    program.debug = 'false'
    program.runservices = true
}
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



console.log('VisiFile node local hostname: ' + ip.address() + ' ')

setupVisifileParams();

var PDFParser       = require("pdf2json");





setupChildProcesses2();













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
                                    value:  "Counter: " + msg.counter + ", count data_states from sqlite: " + msg.sqlite
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
            //forkedProcesses["forked"].send({ message_type: "init" , user_data_path: userData});
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



        } else if (msg.message_type == "return_add_local_driver_results_msg") {
            //console.log("6 - return_get_search_results: " + msg.returned);
            var rett = eval("(" + msg.success + ")");
            var newCallbackFn = queuedResponses[ msg.seq_num ]

            if (msg.success) {
                newCallbackFn("Driver added")
            } else {
                newCallbackFn("Driver not added: " + msg.error_message)
            }


            newres = null;




        } else if (msg.message_type == "return_get_search_results") {
            //console.log("6 - return_get_search_results: " + msg.returned);
            var rett = eval("(" + msg.returned + ")");
            var newres = queuedResponses[ msg.seq_num ]

            newres.writeHead(200, {'Content-Type': 'text/plain'});
            newres.end(msg.returned);

            newres = null;



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
            for (var i = 0; i < rett.data_states.length; i++) {
                var resitem = rett.data_states[i];
                if (resitem && (resitem.data.length > 0)) {
                    result.results.push({
                        query_id:      resitem.id,
                        computer_name: username + "@" + hostaddress + ":" + port,
                        file_name:          resitem.file_name,
						name:               resitem.name,
                        type:               resitem.type,
                        size:               resitem.size,
                        driver:             resitem.driver,
                        when_timestamp:     resitem.when_timestamp
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









function setupForkedProcess(processName,fileName,debugPort) {
    var debugArgs =[];
    if (debug) {
        if (semver.gte(process.versions.node, '6.9.0')) {
            debugArgs = ['--inspect=' + debugPort];
        } else {
            debugArgs = ['--debug=' + debugPort];
        };
    };
    var forkedProcessPath

    if (isWin) {
        forkedProcessPath = path.join(__dirname, '..\\src\\' + fileName)
    } else {
        forkedProcessPath = path.join(__dirname, '../src/' + fileName)
    }
    forkedProcesses[  processName  ] = fork.fork(forkedProcessPath, [], {execArgv: debugArgs});

    setUpChildListeners(processName, fileName, debugPort);

//zzz
    if (processName == "forked") {

        forkedProcesses["forked"].send({         message_type: "init" , user_data_path: userData });
        forkedProcesses["forked"].send({         message_type: "createTables" });
        forkedProcesses["forked"].send({         message_type: "setUpSql" });
        forkedProcesses["forked"].send({         message_type: "greeting" , hello: 'world' });
    }

    if (processName == "forkedIndexer") {
        //forkedProcesses["forkedIndexer"].send({ message_type: "init" , user_data_path: userData});
		//forkedProcesses["forkedIndexer"].send({ message_type: "childRunIndexer" });
    }



    if (processName == "forkedFileScanner") {
        if (runServices) {
            //forkedProcesses["forkedFileScanner"].send({ message_type: "init" , user_data_path: userData});
        }
    }

    if (processName == "forkedPowershell") {
        forkedProcesses["forkedPowershell"].send({ message_type: "init" , user_data_path: userData});
        if (runServices) {
            //forkedProcesses["forkedPowershell"].send({ message_type: "call_powershell" });
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





function setupChildProcesses2() {
    //console.log("-------------------------------------------------------------------");
    //console.log("-------------------------------------------------------------------");
    //console.log("-------------------------------------------------------------------");
    //console.log("-------------------------------------------------------------------");
    //console.log("-------------------------------------------------------------------");

    setupForkedProcess("forked", "child.js", 40003)
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


function setupVisifileParams() {
    typeOfSystem = program.type;
    centralHostAddress = program.host;
    centralHostPort = program.hostport;
    if (!isNumber(centralHostPort)) {centralHostPort = 80;};


    if (!(typeOfSystem == 'client' || typeOfSystem == 'server')) {
        console.log('-------* Invalid system type: ' + typeOfSystem);
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



electronApp.on('ready', function() {

	if (isWin) {
		var localappdata  = process.env.LOCALAPPDATA
		userData = path.join(localappdata, '/Visifile/')
	} else {
		userData = electronApp.getPath('userData')
	}
	dbPath = path.join(userData, username + '.visi')

    upload          = multer( { dest: path.join(userData,  'uploads/')});


    rmdir("uploads");
    mkdirp.sync(path.join(userData,  'uploads'));
    mkdirp.sync(path.join(userData,  'files'));








    visifile = new BrowserWindow({
                                width: 800,
                                height: 600,
                                webPreferences: {
                                    nodeIntegration: false

                                },
                                icon:'public/VisiFileColor.png'
                            })
    visifile.on('closed', function () {

      visifile = null
    })

    visifile.loadURL(url.format({
        pathname: path.join(__dirname, 'loading.html'),
        protocol: 'file:',
        slashes: true
      }))

	  outputToBrowser('process.env.LOCALAPPDATA: ' + JSON.stringify(localappdata ,null,2))
      outputToBrowser("appPath: " + electronApp.getAppPath())
	  outputToBrowser("userData: " + JSON.stringify(userData ,null,2))
      outputToBrowser("getPath(userData): " + electronApp.getPath('userData'))
      outputToBrowser("process.env keys: " + Object.keys(process.env))

      outputToBrowser("dbPath: " + JSON.stringify(dbPath ,null,2))
      outputToBrowser("LOCAL: " + path.join(__dirname, '/'))
    //visifile.webContents.toggleDevTools();

    dbsearch = new sqlite3.Database(dbPath);
    dbsearch.run("PRAGMA journal_mode=WAL;")

    dbsearch.serialize(
        function() {
            dbsearch.all(
                "SELECT count(name) as cnt FROM sqlite_master ;  "
                ,

                function(err, results)
                {
                    for (var i = 0; i < results.length; i++) {
                        outputToBrowser("Sqlite: " + results[i].cnt)
                    }


                })
    }, sqlite3.OPEN_READONLY)




	var nodeConsole = require('console');
	var myConsole = new nodeConsole.Console(process.stdout, process.stderr);
	myConsole.log('Hello World!');



    console.log("New electron app")

    //var index = require(path.resolve('src/index.js'))



    if (startNodeServer) {
        var exec = require('child_process').exec;

    	if (isWin) {
    		ls    = exec('cd ' + path.join(__dirname, '..') + ' & pwd & ls & cd visifile & .\\node .\\src\\index.js --nogui true')
    	} else {
    			ls = exec('cd ' + path.join(__dirname, '..') + ' && pwd && ls && cd visifile && ./node src/index.js --nogui true')
    	}

        var readhost = ''
        var readport = ''
    	ls.stdout.on('data', function (data) {
            var ds = data.toString()
            if (!started) {
                outputToBrowser(ds)
            }

            if (ds.indexOf("****HOST") != -1) {
                readhost = ds.substring(ds.indexOf("****HOST") + 9, ds.indexOf("HOST****")).replace(/\'|\"|\n|\r"/g , "")
                //console.log("readhost=" + readhost)
            }


            if (ds.indexOf("****PORT") != -1) {
                   readport = ds.substring(ds.indexOf("****PORT") + 9, ds.indexOf("PORT****")).replace(/\'|\"|\n|\r"/g , "")
                   //console.log("readport=" + readport)
            		var addrt = 'http://' + readhost + ':' + readport;
                    outputToBrowser("****Started address:= " + addrt)
                    setTimeout(function(){
                        if (startNodeServer) {
                            visifile.loadURL(addrt)
                        }

                    },1000)



                    started = true
                }

    	});
    }


})
process.on('exit', function() {
	if (ls) {
		console.log("Killed Process VisiFile")
		ls.kill();
	}
  });



function outputToBrowser(txt) {
    f++

    //var line = txt.toString().replace(/\'|\"|\n|\r"/g , "").toString()
    var line = txt.toString().replace(/\'/g , "").toString()
    var jsc = "document.write('<br>" + ": " + line + " ')"
    //console.log(line);
    if (visifile) {
        if (visifile.webContents) {
            visifile.webContents.executeJavaScript(jsc);
        }
    } else {
        console.log(txt)
    }

}












var httpServer = null;
function getPort () {
    outputToBrowser('** called getPort v2')
    httpServer = http.createServer(app)


    httpServer.listen(port, ip.address(), function (err) {
        outputToBrowser('trying port: ' + port + ' ')

        httpServer.once('close', function () {
        })
        httpServer.close()
        httpServer = null;
    })



    httpServer.on('error', function (err) {
        outputToBrowser('Couldnt connect on port ' + port + '...')
        if (port < portrange) {
            port = portrange
            };
        outputToBrowser('... trying port ' + port)
        portrange += 1
        getPort()
    })
    httpServer.on('listening', function (err) {
            outputToBrowser('Can connect on ' + ip.address() +  ':' + port + ' :) ')
            //mainProgram()
    })
}
