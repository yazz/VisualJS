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
var saveHelper      = require('./save_helpers')

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
hostaddress = ip.address();
port = 80
var f = 0
var started = false

var visifile
var socket          = null


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
var alreadyOpen                         = false;
var executionProcessCount                       = 6;














console.log('Starting services');

app.use(compression())



if (process.argv.length > 1) {

    program
      .version('0.0.1')
      .option('-t, --type [type]', 'Add the specified type of app (client/server) [type]', 'client')
      .option('-p, --port [port]', 'Which port should I listen on? (default 80) [port]', parseInt)
      .option('-h, --host [host]', 'Server address of the central host (default vappshare.co) [host]', 'appshare.co')
      .option('-l, --locked [locked]', 'Allow server to be locked/unlocked on start up (default true) [locked]', 'true')
      .option('-n, --nogui [nogui]', 'Allow server to be run in headless mode (default false) [nogui]', 'false')
      .option('-d, --debug [debug]', 'Allow to run in debug mode (default false) [debug]', 'false')
      .option('-s, --hostport [hostport]', 'Server port of the central host (default 80) [hostport]', parseInt)
      .option('-r, --runservices [runservices]', 'Run the services (default true) [runservices]', false)
      .option('-a, --runapp [runapp]', 'Run the app with ID as the homepage (default not set) [runapp]', null)
      .parse(process.argv);
} else {
    program.type = 'client'
    program.host = 'appshare.co'
    program.locked = 'true'
    program.nogui = 'false'
    program.debug = 'false'
    program.runservices = false
    program.runapp = null
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
var runapp = program.runapp;
if ( electronApp ) {
    runapp = "homepage"
}
if (!isNumber(port)) {
    port = 80;
};



console.log('VisiFile node local hostname: ' + ip.address() + ' ')

setupVisifileParams();

var PDFParser       = require("pdf2json");









function setUpChildListeners(processName, fileName, debugPort) {

    forkedProcesses[processName].on('close', function() {
        if (!shuttingDown) {
            console.log("Child process " + processName + " exited.. restarting... ")



            var stmtInsertProcessError = dbsearch.prepare(  ` insert into
                                                                  system_process_errors
                                                              (   id,
                                                                  timestamp,
                                                                  process,
                                                                  status,
                                                                  base_component_id,
                                                                  event,
                                                                  system_code_id,
                                                                  args,
                                                                  error_message )
                                                              values
                                                                  ( ?,  ?,  ?,  ?,  ?,  ?,  ?,  ?,  ? );`)
            dbsearch.serialize(function() {
                dbsearch.run("begin exclusive transaction");
                var newId = uuidv1()
                stmtInsertProcessError.run(
                      newId,
                      new Date().getTime(),
                      processName,
                      "KILLED",
                      null,
                      null,
                      null,
                      null,
                      null )

                dbsearch.run("commit");
                stmtInsertProcessError.finalize();

            })
            setupForkedProcess(processName, fileName, debugPort)
        }
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





        } else if (msg.message_type == "save_code") {

            forkedProcesses["forked"].send({
                                                message_type:       "save_code",
                                                base_component_id:   msg.base_component_id,
                                                parent_hash:         msg.parent_hash,
                                                code:                msg.code,
                                                options:             msg.options
                                           });








        } else if (msg.message_type == "createdTablesInChild") {
            forkedProcesses["forked"].send({         message_type: "setUpSql" });
            forkedProcesses["forked"].send({         message_type: "greeting" , hello: 'world' });
            if (!mainNodeProcessStarted) {
                mainNodeProcessStarted = true
                getPort()
            }




        } else if (msg.message_type == "ipc_child_returning_uploaded_app_as_file_in_child_response") {

            console.log("uploaded_app_as_file_in_child: " + JSON.stringify(msg))

                // ______
                // Server  --1 data item-->  Browser
                // ______
                //
                sendOverWebSockets({
                                      type:                 "uploaded_app_as_file_from_server",
                                      code_id:               msg.code_id,
                                      base_component_id:     msg.base_component_id,
                                      client_file_upload_id: msg.client_file_upload_id

                    });



        } else if (msg.message_type == "database_setup_in_child") {

            //console.log("Child set up DB complete: " + msg.child_process_name)

            if (msg.child_process_name == "forkedIndexer") {
                //forkedProcesses["forkedIndexer"].send({         message_type: "setUpSql" });
                if (typeOfSystem == 'client') {
                    if (runServices) {
                        //forkedProcesses["forkedIndexer"].send({ message_type: "childRunFindFolders" });
                        //forkedProcesses["forkedIndexer"].send({ message_type: "childRunIndexer" });
                    }
                }
            }






            if (msg.child_process_name == "forkedExeScheduler") {
                    forkedProcesses["forkedExeScheduler"].send({ message_type: "setUpSql" });
                }

            if (msg.child_process_name.startsWith("forkedExeProcess")) {

                forkedProcesses[msg.child_process_name].send({ message_type: "setUpSql" });


                forkedProcesses["forkedExeScheduler"].send({    message_type:    "startNode",
                                                                node_id:          msg.child_process_name,
                                                                child_process_id: forkedProcesses[msg.child_process_name].pid,
                                                                started:          new Date()
                                                  });
                                              }




        } else if (msg.message_type == "getResultReturned") {
            var newres = queuedResponses[ msg.seqNum ]
            newres.writeHead(200, {'Content-Type': 'text/plain'});
            newres.end(JSON.stringify(msg.result));
            newres = null;











        } else if (msg.message_type == "return_add_local_driver_results_msg") {
            //console.log("6 - return_get_search_results: " + msg.returned);
            var rett = eval("(" + msg.success + ")");
            var newCallbackFn = queuedResponses[ msg.seq_num ]

            if (msg.success) {
                newCallbackFn("base_component_id added")
            } else {
                newCallbackFn("base_component_id not added: " + msg.error_message)
            }


            newres = null;








        } else if (msg.message_type == "processor_free") {

            forkedProcesses["forkedExeScheduler"].send({
                                                    message_type:         "processor_free",
                                                    child_process_name:    msg.child_process_name
                                                  });





        } else if (msg.message_type == "execute_code_in_exe_child_process") {
                //console.log("6 - return_get_all_table: " );

                forkedProcesses[msg.child_process_name].send({
                                                        message_type:       "execute_code",
                                                        code:                msg.code,
                                                        callback_index:      msg.callback_index,
                                                        code_id:             msg.code_id,
                                                        args:                msg.args,
                                                        call_id:             msg.call_id,
                                                        on_condition:        msg.on_condition,
                                                        base_component_id:   msg.base_component_id
                                                      });







      } else if (msg.message_type == "function_call_request") {
              //console.log("6 - return_get_all_table: " );

              forkedProcesses["forkedExeScheduler"].send({
                                                      message_type:         "function_call_request",
                                                      child_process_name:    msg.child_process_name,
                                                      find_component:        msg.find_component,
                                                      args:                  msg.args,
                                                      callback_index:        msg.callback_index,
                                                      caller_call_id:        msg.caller_call_id
                                                    });






      } else if (msg.message_type == "function_call_response") {
          //console.log("*** function_call_response: " + JSON.stringify(msg,null,2))
          forkedProcesses["forkedExeScheduler"].send({
                                                  message_type:         "function_call_response",
                                                  child_process_name:    msg.child_process_name,
                                                  driver_name:           msg.driver_name,
                                                  method_name:           msg.method_name,
                                                  result:                msg.result,
                                                  callback_index:        msg.callback_index,
                                                  called_call_id:        msg.called_call_id
                                                });






      } else if (msg.message_type == "return_response_to_function_caller") {
          //console.log("*) Electron.js    got response for " + msg.child_process_name);
          //console.log("*) "+ msg.result)
          if (msg.child_process_name) {
              forkedProcesses[msg.child_process_name].send({
                                                      message_type:         "return_response_to_function_caller",
                                                      callback_index:        msg.callback_index,
                                                      result:                msg.result
                                                    });
          }




        } else if (msg.message_type == "return_get_all_table") {
                //console.log("6 - return_get_all_table: " );
                var newres = queuedResponses[ msg.seq_num ]

                newres.writeHead(200, {'Content-Type': 'text/plain'});
                newres.end(msg.result);

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





        //                               ______
        // Subprocess  --1 data item-->  Server
        //                               ______
        //
        } else if (msg.message_type == "subprocess_returns_data_item_to_server") {
            //console.log("6: return_query_item")
            //console.log("6.1: " + msg)
            //console.log("7: " + msg.returned)
            var new_ws = queuedResponses[ msg.seq_num ]

            if (msg.returned) {
                // ______
                // Server  --1 data item-->  Browser
                // ______
                //
                sendToBrowserViaWebSocket(
                new_ws,
                {
                    type:      "client_data_item_received_from_server",
                    data_item:  msg.returned
                });
            }



        } else if (msg.message_type == "ipc_child_returning_find_results") {

           // console.log(" .......3: " + msg.results);
            //console.log("6: return_query_items_ended")
            //console.log("6.1: " + msg)
            var new_ws = queuedResponses[ msg.seq_num ]


            sendToBrowserViaWebSocket(
                                         new_ws
                                         ,
                                         {
                                            type:   "ws_to_browser_find_results",
                                            results:  msg.results
                                         });
            //new_ws = null;









            } else if (msg.message_type == "ipc_child_returning_callDriverMethod_response") {

                //console.log(" .......3: " + JSON.stringify(msg,null,2));
                //console.log("6: return_query_items_ended")
                //console.log("6.1: " + msg)
                var new_ws = queuedResponses[ msg.seq_num_parent ]

                if (msg.result) {
                    if (msg.result.code) {
                        var tr = msg.result.code
                        msg.result.code = tr
                    }
                }
                sendToBrowserViaWebSocket(
                                             new_ws
                                             ,
                                             {
                                                type:            "ws_to_browser_callDriverMethod_results",
                                                value:            msg.result,
                                                seq_num:          msg.seq_num_browser
                                             });
                //new_ws = null;




        } else if (msg.message_type == "subprocess_alerts_data_done_to_server") {
            //console.log("6: return_query_items_ended")
            //console.log("6.1: " + msg)
            var new_ws = queuedResponses[ msg.seq_num ]

            sendToBrowserViaWebSocket(      new_ws,
                                        {   type: "server_alerts_data_done_to_browser"  });
            //new_ws = null;
        }


//
//







    });
}








function setupForkedProcess(  processName,  fileName,  debugPort  ) {
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


    if (processName == "forked") {

        //outputToBrowser("- sending user_data_path to child 'forked':  " + userData)
        forkedProcesses["forked"].send({         message_type: "init" ,
                                                 user_data_path: userData,
                                                 child_process_name: "forked"
                                              });

        forkedProcesses["forked"].send({         message_type: "createTables" });
        if (runServices) {
            setTimeout(function() {
                console.log('forkedProcesses["forked"].send({         message_type: "childRunFindFolders" });')
                forkedProcesses["forked"].send({         message_type: "childRunFindFolders" });
            },5000)
        }
    }




    if (processName == "forkedExeScheduler") {

        //outputToBrowser("- sending user_data_path to child 'forkedExeScheduler':  " + userData)
        forkedProcesses["forkedExeScheduler"].send({  message_type: "init" ,
                                                      user_data_path: userData,
                                                      child_process_name: "forkedExeScheduler"
                                              });
    }

    for (var i=0;i<executionProcessCount; i++ ) {
        var exeProcName = "forkedExeProcess" + i
        if (processName == exeProcName) {
            //outputToBrowser("- sending user_data_path to child '" + exeProcName + "':  " + userData)
            forkedProcesses[exeProcName].send({  message_type: "init" ,
                                                 user_data_path: userData,
                                                 child_process_name: exeProcName
                                              });

      }

    }



    console.log("Started subprocess '" + processName + "' ")


}






function setupMainChildProcess() {
    setupForkedProcess("forked",        "child.js", 40003)
}



function setupChildProcesses() {
    setupForkedProcess("forkedExeScheduler", "exeScheduler.js", 40004)
    for (var i=0;i<executionProcessCount; i++ ) {
        var exeProcName = "forkedExeProcess" + i
            setupForkedProcess(exeProcName, "exeProcess.js", 40100 + i)
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



if (electronApp) {

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
        mkdirp.sync(path.join(userData,  'apps'));
        mkdirp.sync(path.join(userData,  'app_dbs'));







        if (!nogui ) {
            visifile = new BrowserWindow({
                                        width: 800,
                                        height: 600,
                                        webPreferences: {
                                            nodeIntegration: false

                                        },
                                        icon:'public/VisiFileColor.png'
                                    })





            visifile.on('closed', function () {
                shutDown();
                visifile = null
            })

            visifile.loadURL(url.format({
                pathname: path.join(__dirname, 'loading.html'),
                protocol: 'file:',
                slashes: true
              }))

          electronApp.on('will-quit', () => {
              shutDown();
              });

          electronApp.on('before-quit', () => {
              shutDown();

          });



              electronApp.on('window-all-closed', electronApp.quit);
              electronApp.on('before-quit', () => {
                  shutDown();
              });

        }


    	  outputToBrowser('process.env.LOCALAPPDATA: ' + JSON.stringify(localappdata ,null,2))
          outputToBrowser("appPath: " + electronApp.getAppPath())
    	  outputToBrowser("userData: " + JSON.stringify(userData ,null,2))
          outputToBrowser("getPath(userData): " + electronApp.getPath('userData'))
          outputToBrowser("process.env keys: " + Object.keys(process.env))

          //outputToBrowser("dbPath: " + JSON.stringify(dbPath ,null,2))
          //outputToBrowser("LOCAL: " + path.join(__dirname, '/'))

          if (debug) {
              visifile.webContents.toggleDevTools();
          }

        dbsearch = new sqlite3.Database(dbPath);
        dbsearch.run("PRAGMA journal_mode=WAL;")





    	var nodeConsole = require('console');
    	var myConsole = new nodeConsole.Console(process.stdout, process.stderr);
    	myConsole.log('Hello World!');

        console.log("New electron app")

        //var index = require(path.resolve('src/index.js'))


        setupMainChildProcess();

    })
}


//
// otherwise we are running as NodeJS
//
else {

        	if (isWin) {
        		var localappdata  = process.env.LOCALAPPDATA
        		userData = path.join(localappdata, '/Visifile/')
        	} else {
        		userData =  path.join(process.env.HOME, '/Visifile/')
        	}
        	dbPath = path.join(userData, username + '.visi')

            upload          = multer( { dest: path.join(userData,  'uploads/')});


            rmdir("uploads");
            mkdirp.sync(path.join(userData,  'uploads'));
            mkdirp.sync(path.join(userData,  'files'));
            mkdirp.sync(path.join(userData,  'apps'));
            mkdirp.sync(path.join(userData,  'app_dbs'));


        	  outputToBrowser('process.env.LOCALAPPDATA: ' + JSON.stringify(localappdata ,null,2))
              outputToBrowser("Local home data path: " + process.env.HOME)
        	  outputToBrowser("userData: " + JSON.stringify(userData ,null,2))
              outputToBrowser("process.env keys: " + Object.keys(process.env))


            dbsearch = new sqlite3.Database(dbPath);
            dbsearch.run("PRAGMA journal_mode=WAL;")





        	var nodeConsole = require('console');
        	var myConsole = new nodeConsole.Console(process.stdout, process.stderr);
        	myConsole.log('Hello World!');



            console.log("New NodeJS app")

            //var index = require(path.resolve('src/index.js'))


            setupMainChildProcess();
}






var shuttingDown = false;
process.on('exit', function() {
    shutDown();
  });
process.on('quit', function() {
  shutDown();
});




function shutDown() {
    if (!shuttingDown) {
        shuttingDown = true;


        if (forkedProcesses["forked"]) {
            console.log("Killed Process forked")
            forkedProcesses["forked"].kill();
        }
        if (forkedProcesses["forkedExeScheduler"]) {
            console.log("Killed Exe Scheduler process")
            forkedProcesses["forkedExeScheduler"].kill();
        }

        for (var i = 0; i < executionProcessCount; i++ ) {
            var exeProcName = "forkedExeProcess" + i
            forkedProcesses[exeProcName].kill();
            console.log("Killed Process " + exeProcName)
        }
        if (visifile){
            visifile.removeAllListeners('close');
            //visifile.close();
            if (visifile.globalShortcut) {
                //visifile.globalShortcut.unregisterAll();

            }
        }


        if (dbsearch) {
            dbsearch.run("PRAGMA wal_checkpoint;")
        }
    }

}




function outputToBrowser(txt) {
    f++

    //var line = txt.toString().replace(/\'|\"|\n|\r"/g , "").toString()
    var line = txt.toString().replace(/\'/g , "").toString()
    var jsc = "document.write('<br>" + ": " + line + " ')"
    //console.log(line);
    if (visifile && (!alreadyOpen) ) {
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
            forkedProcesses["forked"].send({         message_type: "host_and_port" ,
                                                     child_process_name: "forked",
                                                     ip: hostaddress,
                                                     port: port
                                                  });
              startServices()

    })
}




















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






































function runOnPageExists(req, res, homepage) {
    if (fs.existsSync(homepage)) {
        if (typeOfSystem == 'client') {
            if (!canAccess(req,res)) {
                return;
            }
            res.end(fs.readFileSync(homepage));
        }
    } else {
        setTimeout(function() {
            runOnPageExists(req, res, homepage)
        },3000)
    }


}

function getRoot(req, res) {
	hostcount++;
	//console.log("Host: " + req.headers.host + ", " + hostcount);
	//console.log("Full URL: " + req.protocol + '://' + req.get('host') + req.originalUrl);

    var homepage = path.join(__dirname, '../public/go.html')
    var homepageUrl = 'http://appshare.co/app/homepage.html?time=' + new Date().getTime()
	if (req.headers.host) {
        if (req.query.goto) {
            console.log("*** FOUND goto")
            res.end(fs.readFileSync(homepage));
            return
        }
        if (req.query.embed) {
            console.log("*** FOUND embed")
            res.end(fs.readFileSync(homepage));
            return
        }
		if (req.headers.host.toLowerCase().endsWith('canlabs.com')) {
		res.writeHead(301,
			{Location: 'http://canlabs.com/canlabs'}
			);
			res.end();
			return;
		};
		if (req.headers.host.toLowerCase().endsWith('gosharedata.com')) {
		res.writeHead(301,
			{Location: homepageUrl }
			);
			res.end();
			return;
		};
		if (req.headers.host.toLowerCase().endsWith('visifile.com')) {
		res.writeHead(301,
			{Location: homepageUrl }
			);
			res.end();
			return;
		};
		if (req.headers.host.toLowerCase().endsWith('visifiles.com')) {
		res.writeHead(301,
			{Location: homepageUrl}
			);
			res.end();
			return;
		};
        if (req.headers.host.toLowerCase().endsWith('appshare.co')) {
		res.writeHead(301,
			{Location: homepageUrl }
			);
			res.end();
			return;
		};
	};

    if (runapp && (!req.query.goto) && (!req.query.embed)) {
        homepage = path.join( userData, 'apps/' + runapp + '.html' )
        runOnPageExists(req,res,homepage)
        return
    }


	if (typeOfSystem == 'server') {
		res.end(fs.readFileSync(path.join(__dirname, '../public/index_server.html')));
	}
}



function getEditApp(req, res) {
	hostcount++;

    // I dont know why sockets.io calls .map files here
    if (req.path.endsWith(".map")) {
        return
    }
    var parts = req.path.split('/');
    var lastSegment = parts.pop() || parts.pop();

    console.log("URL PATH: " + lastSegment);
	//console.log("Full URL: " + req.protocol + '://' + req.get('host') + req.originalUrl);



    //
    // send the edit page
    //
    var homepage = path.join(__dirname, '../public/go.html')
    var baseComponentId = lastSegment
    var newStaticFileContent = fs.readFileSync(homepage)
    newStaticFileContent = newStaticFileContent.toString().replace("var editAppShareApp = null", "var editAppShareApp = '" + baseComponentId + "'")



    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    res.end(newStaticFileContent);
}





function getFileExtension(base_component_id) {
    if (base_component_id == "excel") { return "xlsx"}
    if (base_component_id == "pdf") { return "pdf"}
    if (base_component_id == "word") { return "docx"}
    if (base_component_id == "csv") { return "csv"}
    if (base_component_id == "glb") { return "glb"}
    if (base_component_id == "txt") { return "txt"}
    if (base_component_id == "outlook2012") { return "txt"}
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





        } else if (receivedMessage.message_type == "loadUiComponent") {
            //console.log("***** } else if (msg.message_type == loadUiComponent) ")

            var componentIds = receivedMessage.find_components.base_component_ids

            dbsearch.serialize(
                function() {
                    var stmt = dbsearch.all(
                        "SELECT  *  FROM   system_code   WHERE   base_component_id in " +
                            "("  + componentIds.map(function(){ return "?" }).join(",") + " )" +
                            "   and   code_tag = 'LATEST' ",
                        componentIds
                        ,

                        function(err, results)
                        {
                            if (results.length > 0) {
                                var codeId = results[0].id
                                    dbsearch.all(
                                        "SELECT dependency_name FROM app_dependencies where code_id = ?; ",
                                        codeId,

                                        function(err, results2)
                                        {
                                            results[0].libs = results2
                                            sendToBrowserViaWebSocket(
                                                ws,
                                                {
                                                    type:                   "server_returns_loadUiComponent_to_browser",
                                                    seq_num:                 receivedMessage.seq_num,
                                                    record:                  JSON.stringify(results,null,2),
                                                    args:                    JSON.stringify(receivedMessage.args,null,2),
                                                    test:                   1
                                                });
                                        })
                            }

                        })
            }, sqlite3.OPEN_READONLY)





        //                                  ______
        // Browser  --Send me your data-->  Server
        //                                  ______
        //
        } else if (receivedMessage.message_type == "edit_static_app") {
            console.log("*** server got message from static app: edit_static_app")
            var sql_data = receivedMessage.sql_data
            var code_fn = receivedMessage.code_fn

            //zzz

            forkedProcesses["forked"].send({
                    message_type:           "save_code_from_upload",
                    base_component_id:      receivedMessage.base_component_id,
                    parent_hash:            null,
                    code:                   code_fn,
                    client_file_upload_id:  -1,
                    options:                {save_html: true, fast_forward_database_to_latest_revision: true},
                    sqlite_data:            sql_data
               });



            sendToBrowserViaWebSocket(  ws,
                                        {
                                            type:       "edit_static_app_url"
                                            ,

                                            url:        receivedMessage.host_editor_address +
                                                        "/edit/" +
                                                        receivedMessage.base_component_id
                                            ,

                                            size_of_db: "" + (sql_data?sql_data.length:0)
                                            ,
                                            code_fn: "" + (code_fn?code_fn.length:0)

                                        });



        //                                  ______
        // Browser  --Send me your data-->  Server
        //                                  ______
        //
        } else if (receivedMessage.message_type == "browser_asks_server_for_data") {

            var seqNum = queuedResponseSeqNum;
            queuedResponseSeqNum ++;
            queuedResponses[seqNum] = ws;

            // ______
            // Server  --Send me your data-->  Subprocess
            // ______
            //
            forkedProcesses["forked"].send({
                            message_type:   "server_asks_subprocess_for_data",
                            seq_num:         seqNum
                        });





    } else if (receivedMessage.message_type == "browser_asks_server_for_data") {

        var seqNum = queuedResponseSeqNum;
        queuedResponseSeqNum ++;
        queuedResponses[seqNum] = ws;

        // ______
        // Server  --Send me your data-->  Subprocess
        // ______
        //
        forkedProcesses["forked"].send({
                        message_type:   "server_asks_subprocess_for_data",
                        seq_num:         seqNum
                    });









} else if (receivedMessage.message_type == "browser_asks_server_for_apps") {

   // console.log("******************* browser_asks_server_for_apps *******************")
    findLatestVersionOfApps( function(results) {
       // console.log(JSON.stringify(results,null,2))

        sendToBrowserViaWebSocket(  ws,
                                    {
                                        type:     "vf_app_names",
                                        results:  results
                                    });
        })


















       } else if (receivedMessage.message_type == "callDriverMethod") {

            var seqNum = queuedResponseSeqNum;
            queuedResponseSeqNum ++;
            queuedResponses[seqNum] = ws;

            //console.log(" .......1 Electron callDriverMethod: " + JSON.stringify(receivedMessage,null,2));
            forkedProcesses["forked"].send({
                            message_type:          "callDriverMethod",
                            find_component:         receivedMessage.find_component,
                            args:                   receivedMessage.args,
                            seq_num_parent:         seqNum,
                            seq_num_browser:        receivedMessage.seqNum
                        });


    }







});};











function file_uploadFn(req, res, next) {
      //console.log('-------------------------------------------------------------------------------------');
      //console.log('-------------------------------------------------------------------------------------');
      //console.log('-------------------------------------------------------------------------------------');
      //console.log('-------------------------------------------------------------------------------------');
      //console.log('-------------------------------------------------------------------------------------');

      //console.log(JSON.stringify(req.files.length));
      //console.log("client_file_upload_id: " + JSON.stringify(req.body.client_file_upload_id,null,2))
      var client_file_upload_id = req.body.client_file_upload_id
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
          //console.log('Loading saved appshare app' );
          var ifile = req.files[i];
          //console.log("        " + JSON.stringify(ifile));
          var ext = ifile.originalname.split('.').pop();
          ext = ext.toLowerCase();
          //console.log('Ext: ' + ext);
          if ((ext == "html") || (ext == "html")) {
          var localp2;
          localp2 =  path.join(userData,  'uploads/' + ifile.filename);
              var localp = localp2 + '.' + ext;
              fs.renameSync(localp2, localp);
              var readIn = fs.readFileSync(localp)
              //console.log('');
              //console.log('Local saved path: ' + localp);
              var indexStart = readIn.indexOf("/*APP_START*/")
              var indexEnd = readIn.indexOf("/*APP_END*/")
              //console.log(`indexStart: ${indexStart}`)
              //console.log(`indexEnd: ${indexEnd}`)
              if ((indexStart > 0) && (indexEnd > 0)) {
                indexStart += 13 + 10
                indexEnd -= 2
                var tts = readIn.toString().substring(indexStart,indexEnd)
                var ytr = unescape(tts)
                //console.log(ytr)
                var bci = saveHelper.getValueOfCodeString(ytr, "base_component_id")

                var indexStart = readIn.indexOf("/*APP_START*/")
                var indexEnd = readIn.indexOf("/*APP_END*/")

                var indexOfSqliteData = readIn.indexOf("var sqlitedata = '")
                var indexOfSqliteDataEnd = readIn.indexOf("'//sqlitedata")

                var sqlitedatafromupload = null
                if ((indexOfSqliteData != -1) && (indexOfSqliteDataEnd != -1)) {
                    sqlitedatafromupload = readIn.toString().substring( indexOfSqliteData + 18,
                                                                        indexOfSqliteDataEnd)
                }
//zzz

                forkedProcesses["forked"].send({
                                                    message_type:           "save_code_from_upload",
                                                    base_component_id:      bci,
                                                    parent_hash:            null,
                                                    code:                   ytr,
                                                    client_file_upload_id:  client_file_upload_id,
                                                    options:                {save_html: true, fast_forward_database_to_latest_revision: true},
                                                    sqlite_data:            sqlitedatafromupload
                                               });
              }
          } else {
            console.log('Ignoring file ');

          }

    }

};


















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







//------------------------------------------------------------
// This starts all the system services
//------------------------------------------------------------
function startServices() {
    app.use(cors({ origin: '*' }));
    app.use(function (req, res, next) {

        // Website you wish to allow to connect
        res.header('Access-Control-Allow-Origin', '*');

        // Request methods you wish to allow
        res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

        // Request headers you wish to allow
        res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

        // Set to true if you need the website to include cookies in the requests sent
        // to the API (e.g. in case you use sessions)
        res.setHeader('Access-Control-Allow-Credentials', false);

        // Pass to next layer of middleware
        next();
    });

    //------------------------------------------------------------------------------
    // Show the default page for the different domains
    //------------------------------------------------------------------------------
    app.get('/', function (req, res) {
    	return getRoot(req, res);
    })



    //------------------------------------------------------------------------------
    // Allow an app to be edited
    //------------------------------------------------------------------------------
    app.get('/edit/*', function (req, res) {
    	return getEditApp(req, res);
    })


    app.use("/files",   express.static(path.join(userData, '/files/')));
    app.use("/app", express.static(path.join(userData, '/apps/')));
    //app.use("/app_dbs", express.static(path.join(userData, '/app_dbs/')));

    app.use("/public/aframe_fonts", express.static(path.join(__dirname, '../public/aframe_fonts')));
    app.use(            express.static(path.join(__dirname, '../public/')))
    app.use(bodyParser.json()); // support json encoded bodies
    app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies







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





    app.post('/file_upload', upload.array( 'file' ), function (req, res, next) {
        return file_uploadFn(req, res, next);
    });






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
        forkedProcesses["forked"].send({
                        message_type:               "get_all_tables",
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
    socket = require('socket.io')
    httpServer.listen(port, hostaddress, function () {
    	console.log(typeOfSystem + ' started on port ' + port + ' with local folder at ' + process.cwd() + ' and __dirname = ' + __dirname+ "\n");
        console.log("****HOST=" + hostaddress + "HOST****\n");
        console.log("****PORT=" + port+ "PORT****\n");
        console.log(""+ "\n");
        console.log("Started on:");
        console.log("http://" + hostaddress + ':' + port);

        io = socket.listen(httpServer, {
            log: false,
            agent: false,
            origins: '*:*',
            transports: ['websocket', 'htmlfile', 'xhr-polling', 'jsonp-polling', 'polling']
        });

        io.on('connection', function (sck) {
            var connt = JSON.stringify(sck.conn.transport,null,2);
            websocketFn(sck)
        });

    })




      //console.log('addr: '+ hostaddress + ":" + port);






    aliveCheckFn();




    if (typeOfSystem == 'client') {
        //setInterval(aliveCheckFn ,numberOfSecondsAliveCheck * 1000);
    }


    forkedProcesses["forked"].send({message_type:       'setUpPredefinedComponents'});


//yyy
setupChildProcesses();











	//--------------------------------------------------------
	// open the app in a web browser
	//--------------------------------------------------------


	if (typeOfSystem == 'client') {
        var localClientUrl = 'http://' + hostaddress  + ":" + port;
        var remoteServerUrl = 'http://' + centralHostAddress  + ":" + centralHostPort + "/visifile/list_intranet_servers.html?time=" + new Date().getTime();
        if(!nogui) {
            //open(localClientUrl);
            alreadyOpen = true
            visifile.loadURL(localClientUrl)
            if (visifile.webContents) {
                //visifile.webContents.executeJavaScript("document.addEventListener('dragover', event => event.preventDefault())");
                //visifile.webContents.executeJavaScript("document.addEventListener('drop', event => event.preventDefault())");
            }



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
            //open('http://' + hostaddress  + ":" + port + "/visifile/list_intranet_servers.html?time=" + new Date().getTime());
            if (!nogui) {
                visifile.loadURL('http://' + hostaddress  + ":" + port + "/visifile/list_intranet_servers.html?time=" + new Date().getTime())
            }


        }
	}


}






























function findLatestVersionOfApps( callbackFn) {
    dbsearch.serialize(
        function() {
            var stmt = dbsearch.all(
                "SELECT id,base_component_id,display_name, component_options FROM system_code where component_type = ? and code_tag = ?; ",
                "app",
                "LATEST",

                function(err, results)
                {
                    if (results.length > 0) {
                        callbackFn(results)
                    } else {
                        callbackFn(null)
                    }

                })
    }, sqlite3.OPEN_READONLY)
}



function findDriversWithMethodLike(methodName, callbackFn) {
    dbsearch.serialize(
        function() {
            var stmt = dbsearch.all(
                "SELECT base_component_id FROM system_code where on_condition like '%" + methodName + "%'; ",

                function(err, results)
                {
                    if (results.length > 0) {
                        callbackFn(results)
                    } else {
                        callbackFn(null)
                    }

                })
    }, sqlite3.OPEN_READONLY)
}
