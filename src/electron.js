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
const notifier = require('node-notifier');



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
var babel           = require("babel-core")
//require("babel-plugin-transform-es2015-template-literals")

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
      .parse(process.argv);
} else {
    program.type = 'client'
    program.host = 'appshare.co'
    program.locked = 'true'
    program.nogui = 'false'
    program.debug = 'false'
    program.runservices = false
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








var babel = require("babel-core")

console.log("****************************")
var fgt = fs.readFileSync("/Users/faroukzquraishi/visifile_installer/public/visifile_drivers/ui_components/comp.js")
//console.log("fgt: " + fgt)

var tr = babel.transform("(" + fgt + ")", {plugins: [path.join(__dirname, "../node_modules/babel-plugin-transform-es2015-template-literals")]})
console.log("****************************")
console.log(tr.code);
console.log("****************************")





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
                                                                  driver,
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


        } else if (msg.message_type == "return_set_connection") {


//zzz
        } else if (msg.message_type == "save_code") {

            forkedProcesses["forked"].send({
                                                message_type:       "save_code",
                                                parent_hash:         msg.parent_hash,
                                                code:                msg.code
                                           });






        } else if (msg.message_type == "return_set_query") {

            //console.log(".. Main process received a 'return_set_query' message: " + msg.name)
            var queryRaw = {  id:            msg.id,
                             name:          msg.name,
                             connection:    msg.connection,
                             driver:        msg.driver,
                             size:          msg.size,
                             hash:          msg.hash,
                             fileName:      msg.fileName,
                             type:          msg.type,
                             definition:    msg.definition,
                             preview:       msg.preview
                         }

             var query = JSON.stringify(queryRaw)

            sendOverWebSockets({
                                    type: "uploaded",
                                    id:    msg.id,
                                    query:
                                    {
                                    }});

            sendOverWebSockets({
                                    type: "update_query_item",
                                    query: queryRaw
            });


            sendOverWebSockets({   type: "client_get_all_queries_done"  });


        // this needs to be fixed so that it only sends the similar documents
        // to the client that requested them
        } else if (msg.message_type == "return_similar_documents") {









        } else if (msg.message_type == "createdTablesInChild") {
            forkedProcesses["forked"].send({         message_type: "setUpSql" });
            forkedProcesses["forked"].send({         message_type: "greeting" , hello: 'world' });
            if (!mainNodeProcessStarted) {
                mainNodeProcessStarted = true
                getPort()
            }








        } else if (msg.message_type == "database_setup_in_child") {

            //console.log("Child set up DB complete: " + msg.child_process_name)

            if (msg.child_process_name == "forkedIndexer") {
                forkedProcesses["forkedIndexer"].send({         message_type: "setUpSql" });
                if (typeOfSystem == 'client') {
                    if (runServices) {
                        //forkedProcesses["forkedIndexer"].send({ message_type: "childRunFindFolders" });
                        forkedProcesses["forkedIndexer"].send({ message_type: "childRunIndexer" });
                    }
                }
            }

            if (msg.child_process_name == "forkedFileScanner") {
                if (typeOfSystem == 'client') {
                    if (runServices) {
                        forkedProcesses["forkedFileScanner"].send({ message_type: "setUpSql" });
                        forkedProcesses["forkedFileScanner"].send({ message_type: "childScanFiles" });
                    }
                }
            }

            if (msg.child_process_name == "forkedPowershell") {
                if (runServices) {
                    forkedProcesses["forkedPowershell"].send({ message_type: "setUpSql" });
                    //forkedProcesses["forkedPowershell"].send({ message_type: "call_powershell" });
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





        // __________
        // Subprocess   -- Return document preview -->   Server
        // __________
        //
        } else if (msg.message_type == "subprocess_returns_document_preview_to_server") {
            //console.log("**5) subprocess_returns_document_preview_to_server: " + msg.data_id)
            //var rett = eval("(" + msg.returned + ")");

            var new_ws = queuedResponses[ msg.seq_num ]

            // ______
            // Server   -- Document Preview -->   Browser
            // ______
            //
            sendToBrowserViaWebSocket(
                new_ws,
                {
                    type:      "server_returns_document_preview_to_browser",
                    data_id:    msg.data_id,
                    result:     msg.result,
                    data_name:    msg.data_name
                    //result:    JSON.stringify({  result: rett.result})
                });

            //new_ws = null;






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
       // console.log("3 - /client/1/search: return_get_search_results_json")

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





        } else if (msg.message_type == "processor_free") {

            forkedProcesses["forkedExeScheduler"].send({
                                                    message_type:         "processor_free",
                                                    child_process_name:    msg.child_process_name
                                                  });





        } else if (msg.message_type == "execute_code_in_exe_child_process") {
                //console.log("6 - return_get_all_table: " );

                forkedProcesses[msg.child_process_name].send({
                                                        message_type:   "execute_code",
                                                        code:           msg.code,
                                                        callback_index: msg.callback_index,
                                                        code_id:        msg.code_id,
                                                        args:           msg.args,
                                                        call_id:        msg.call_id
                                                      });







      } else if (msg.message_type == "function_call_request") {
              //console.log("6 - return_get_all_table: " );

              forkedProcesses["forkedExeScheduler"].send({
                                                      message_type:         "function_call_request",
                                                      child_process_name:    msg.child_process_name,
                                                      driver_name:           msg.driver_name,
                                                      method_name:           msg.method_name,
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

                console.log(" .......3: " + JSON.stringify(msg,null,2));
                //console.log("6: return_query_items_ended")
                //console.log("6.1: " + msg)
                var new_ws = queuedResponses[ msg.seq_num_parent ]

                if (msg.result) {
                    if (msg.result.code) {
                        var tr = babel.transform("(" + msg.result.code + ")", {plugins: [path.join(__dirname, "../node_modules/babel-plugin-transform-es2015-template-literals")]})
                        msg.result.code = tr.code
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

        outputToBrowser("- sending user_data_path to child 'forked':  " + userData)
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

        outputToBrowser("- sending user_data_path to child 'forkedExeScheduler':  " + userData)
        forkedProcesses["forkedExeScheduler"].send({  message_type: "init" ,
                                                      user_data_path: userData,
                                                      child_process_name: "forkedExeScheduler"
                                              });
    }

    for (var i=0;i<executionProcessCount; i++ ) {
        var exeProcName = "forkedExeProcess" + i
        if (processName == exeProcName) {
            outputToBrowser("- sending user_data_path to child '" + exeProcName + "':  " + userData)
            forkedProcesses[exeProcName].send({  message_type: "init" ,
                                                 user_data_path: userData,
                                                 child_process_name: exeProcName
                                              });

      }

    }





    if (processName == "forkedIndexer") {
        forkedProcesses["forkedIndexer"].send({ message_type: "init" ,
                                                user_data_path: userData,
                                                child_process_name: "forkedIndexer"
                                            });}





    if (processName == "forkedFileScanner") {
        if (runServices) {
                forkedProcesses["forkedFileScanner"].send({ message_type: "init" ,
                                                            user_data_path: userData,
                                                            child_process_name: "forkedFileScanner"
                                                            });
        }
    }

    if (processName == "forkedPowershell") {
        outputToBrowser("- sending user_data_path to child 'powershell':  " + userData)
        forkedProcesses["forkedPowershell"].send({  message_type: "init" ,
                                                    user_data_path: userData,
                                                    child_process_name: "forkedPowershell"
                                                });
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

    setupForkedProcess("forkedExeScheduler", "exeScheduler.js", 40004)
    for (var i=0;i<executionProcessCount; i++ ) {
        var exeProcName = "forkedExeProcess" + i
            setupForkedProcess(exeProcName, "exeProcess.js", 40100 + i)

    }
}





function setupChildProcesses2() {
    //console.log("-------------------------------------------------------------------");
    //console.log("-------------------------------------------------------------------");
    //console.log("-------------------------------------------------------------------");
    //console.log("-------------------------------------------------------------------");
    //console.log("-------------------------------------------------------------------");

    setupForkedProcess("forked",        "child.js", 40003)

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
    const isSecondInstance = electronApp.makeSingleInstance((commandLine, workingDirectory) => {
      // Someone tried to run a second instance, we should focus our window.
      if (visifile) {
        if (visifile.isMinimized()) visifile.restore()
        visifile.focus()
        notifier.notify(
          {
            title: 'VisiFile file/URL added on Windows',
            message: JSON.stringify(commandLine.slice(1),null,2),
            icon: path.join(__dirname, '../public/VisiFileColor.png'), // Absolute path (doesn't work on balloons)
            sound: true, // Only Notification Center or Windows Toasters
            wait: true // Wait with callback, until user action is taken against notification
          },
          function(err, response) {
            // Response is response from notification
          }
        );
      }
    })

    if (isSecondInstance) {
        /*notifier.notify(
          {
            title: 'VisiFile warning',
            message: 'VisiFile started twice',
            icon: path.join(__dirname, '../public/VisiFileColor.png'), // Absolute path (doesn't work on balloons)
            sound: true, // Only Notification Center or Windows Toasters
            wait: true // Wait with callback, until user action is taken against notification
          },
          function(err, response) {
            // Response is response from notification
          }
      );*/
        electronApp.quit()
    }


    electronApp.on('will-finish-launching', function() {
        electronApp.on('open-file', function(ev2, path2) {
            var  tt = ''
            var isurl = false
            var title = ""
            var message = ""
            var urlLink = "Unknown"
            if (path2.indexOf('.webloc') != -1 ) {
                isurl = true
                tt = fs.readFileSync( path2)
                fs.writeFileSync(path.join(userData, '/linkPath.txt'), path2);
                fs.writeFileSync(path.join(userData, '/linkFull.txt'), tt);
                if (tt.indexOf("DTD PLIST") != -1) {
                    //urlLink = tt.toString().substring(tt.indexOf("<string>") )
                    urlLink = tt.toString().substring(tt.indexOf("<string>") + 8, tt.indexOf("</string>"))
                    fs.writeFileSync(path.join(userData, '/link.txt'), urlLink);
                    //urlLink = "" + tt.indexOf("<string>") + "," + tt.indexOf("</string>")
                    //urlLink = "google chrome link: "
                    title = 'URL added '
                    message = 'URL added: ' + urlLink
                    notifier.notify(
                      {
                        title: title,
                        message: message,
                        icon: path.join(__dirname, '../public/VisiFileColor.png'), // Absolute path (doesn't work on balloons)
                        sound: true, // Only Notification Center or Windows Toasters
                        wait: true // Wait with callback, until user action is taken against notification
                      },
                      function(err, response) {
                        // Response is response from notification
                      }
                    );
                } else if (tt.indexOf("bplist") != -1) {
                    var bplist = require('bplist-parser');

                    bplist.parseFile(path2, function(err, obj) {
                      if (err) throw err;

                      //urlLink = JSON.stringify(obj)
                      urlLink = obj[0].URL
                      fs.writeFileSync(path.join(userData, '/link.txt'), urlLink);
                      title = 'URL added '
                      message = 'URL added: ' + urlLink
                      notifier.notify(
                        {
                          title: title,
                          message: message,
                          icon: path.join(__dirname, '../public/VisiFileColor.png'), // Absolute path (doesn't work on balloons)
                          sound: true, // Only Notification Center or Windows Toasters
                          wait: true // Wait with callback, until user action is taken against notification
                        },
                        function(err, response) {
                          // Response is response from notification
                        }
                      );
                    });


                }



            } else {
                tt = path2
                title = 'File added '
                message = 'File added: ' +  path2
                saveConnectionAndQueryForFile(path2);
                notifier.notify(
                  {
                    title: title,
                    message: message,
                    icon: path.join(__dirname, '../public/VisiFileColor.png'), // Absolute path (doesn't work on balloons)
                    sound: true, // Only Notification Center or Windows Toasters
                    wait: true // Wait with callback, until user action is taken against notification
                  },
                  function(err, response) {
                    // Response is response from notification
                  }
                );
            }





        })

    })
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

          outputToBrowser("dbPath: " + JSON.stringify(dbPath ,null,2))
          outputToBrowser("LOCAL: " + path.join(__dirname, '/'))

          if (debug) {
              visifile.webContents.toggleDevTools();
          }

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


        setupChildProcesses2();




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







        	  outputToBrowser('process.env.LOCALAPPDATA: ' + JSON.stringify(localappdata ,null,2))
              outputToBrowser("Local home data path: " + process.env.HOME)
        	  outputToBrowser("userData: " + JSON.stringify(userData ,null,2))
              outputToBrowser("process.env keys: " + Object.keys(process.env))

              outputToBrowser("dbPath: " + JSON.stringify(dbPath ,null,2))
              outputToBrowser("LOCAL: " + path.join(__dirname, '/'))
            //visifile.webContents.toggleDevTools();

            dbsearch = new sqlite3.Database(dbPath);
            dbsearch.run("PRAGMA journal_mode=WAL;")





        	var nodeConsole = require('console');
        	var myConsole = new nodeConsole.Console(process.stdout, process.stderr);
        	myConsole.log('Hello World!');



            console.log("New NodeJS app")

            //var index = require(path.resolve('src/index.js'))


            setupChildProcesses2();




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
        if (forkedProcesses["forkedIndexer"]) {
            console.log("Killed Process forkedIndexer")
            forkedProcesses["forkedIndexer"].kill();
        }
        if (forkedProcesses["forkedPowershell"]) {
            console.log("Killed Process forkedPowershell")
            forkedProcesses["forkedPowershell"].kill();
        }
        if (forkedProcesses["forkedFileScanner"]) {
            console.log("Killed Process forkedFileScanner")
            forkedProcesses["forkedFileScanner"].kill();
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
            mainProgram()
    })
}



function mainProgram() {

    startServices()
    outputToBrowser('Start Services' );

    scanHardDisk();
    outputToBrowser('Start Hard Disk Scan' );
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
//var xdiff = diffFn(lhs, rhs);
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
            //forkedProcesses["forkedIndexer"].send({ message_type: "childRunFindFolders" });
            //forkedProcesses["forkedFileScanner"].send({ message_type: "childScanFiles" });
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
			{Location: 'http://appshare.co/visifile/index.html?time=' + new Date().getTime()}
			);
			res.end();
			return;
		};
		if (req.headers.host.toLowerCase().endsWith('visifile.com')) {
		res.writeHead(301,
			{Location: 'http://appshare.co/visifile/index.html?time=' + new Date().getTime()}
			);
			res.end();
			return;
		};
		if (req.headers.host.toLowerCase().endsWith('visifiles.com')) {
		res.writeHead(301,
			{Location: 'http://appshare.co/visifile/index.html?time=' + new Date().getTime()}
			);
			res.end();
			return;
		};
        if (req.headers.host.toLowerCase().endsWith('appshare.co')) {
		res.writeHead(301,
			{Location: 'http://appshare.co/visifile/index.html?time=' + new Date().getTime()}
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














/*
console.log("****************************")
var fgt = fs.readFileSync(path.join(__dirname, "../public/visifile_drivers/apps/test.js"))
//console.log("fgt: " + fgt)

//var tr = babel.transform("(" + fgt + ")", {plugins: ["/Users/faroukzquraishi/visifile_installer/node_modules/babel-plugin-transform-es2015-template-literals"]})
//var tr = babel.transform("(" + fgt + ")", {plugins: ["/Users/faroukzquraishi/visifile_installer/node_modules/babel-plugin-transform-es2015-template-literals"]})
var tr = babel.transform("(" + fgt + ")", {plugins: [path.join(__dirname, "../node_modules/babel-plugin-transform-es2015-template-literals")]})
console.log("****************************")
console.log(tr.code);
console.log("****************************")
*/



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




        } else if (receivedMessage.message_type == "browser_asks_server_for_app_code") {

           // console.log("******************* browser_asks_server_for_app_code *******************: " + receivedMessage.app_name)
            getAppCode(receivedMessage.app_name, function(id,code, libs) {
               // console.log(code)
               var tr = babel.transform("(" + code + ")", {plugins: [path.join(__dirname, "../node_modules/babel-plugin-transform-es2015-template-literals")]})
                sendToBrowserViaWebSocket(  ws,
                                            {
                                                type:           "server_returns_app_code_to_browser",
                                                code:           tr.code,
                                                app_name:       receivedMessage.app_name,
                                                card_id:        receivedMessage.card_id,
                                                code_id:        id,
                                                root_element:   receivedMessage.root_element,
                                                uses_js_libs:   libs
                                            });
                })






        //                                         ______
        // Browser  --Send me document preview-->  Server
        //                                         ______
        //
        } else if (receivedMessage.message_type == "browser_asks_server_for_document_preview") {
            //console.log("**2) browser_asks_server_for_document_preview: " + receivedMessage.data_id)

            var seqNum = queuedResponseSeqNum;
            queuedResponseSeqNum ++;
            queuedResponses[seqNum] = ws;

            // ______
            // Server  --Send me document preview-->  Subprocess
            // ______
            //
            forkedProcesses["forked"].send({
                            message_type:   "server_asks_subprocess_for_document_preview",
                            seq_num:         seqNum,
                            data_id:         receivedMessage.data_id,
                            data_name:         receivedMessage.data_name
                        });





       } else if (receivedMessage.message_type == "vf") {
           parseVfCliCommand(receivedMessage.args, function(result) {
               sendToBrowserViaWebSocket(      ws,
                                           {
                                               type:   "vf_reply",
                                               result:  result
                                           });
           })

       } else if (receivedMessage.message_type == "drivers") {

           driversFullFn(function(drivers) {
               sendToBrowserViaWebSocket(
                                            ws
                                            ,
                                            {
                                               type:   "ws_to_browser_drivers",
                                               result:  drivers
                                            });
           })



       } else if (receivedMessage.message_type == "find") {

           var seqNum = queuedResponseSeqNum;
           queuedResponseSeqNum ++;
           queuedResponses[seqNum] = ws;

          // console.log(" .......1 ");
           forkedProcesses["forked"].send({
                           message_type:   "ipc_from_main_find",
                           search_term:     receivedMessage.term,
                           seq_num:         seqNum
                       });


       } else if (receivedMessage.message_type == "callDriverMethod") {

            var seqNum = queuedResponseSeqNum;
            queuedResponseSeqNum ++;
            queuedResponses[seqNum] = ws;

            //console.log(" .......1 Electron callDriverMethod: " + JSON.stringify(receivedMessage,null,2));
            forkedProcesses["forked"].send({
                            message_type:          "callDriverMethod",
                            driver:                 receivedMessage.driverName,
                            method:                 receivedMessage.methodName,
                            args:                   receivedMessage.args,
                            seq_num_parent:         seqNum,
                            seq_num_browser:        receivedMessage.seqNum
                        });




} else if (receivedMessage.message_type == "browser_asks_server_to_open_document_natively") {
        // ______
        // Server   -- Open document natively -->  Subprocess
        // ______
        //
        forkedProcesses["forked"].send({
            message_type:   "server_asks_subprocess_to_open_document_natively",
            data_id:         receivedMessage.data_id
        });
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
          localp2 =  path.join(userData,  'uploads/' + ifile.filename);
          var localp = localp2 + '.' + ext;
          fs.renameSync(localp2, localp);
          //console.log('Local saved path: ' + localp);

          fs.stat(localp, function(err, stat) {
                //console.log('ifile: ' + ifile.originalname);

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
            "SELECT * FROM data_states WHERE id = ? ",
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
                                   // console.log(eval(driver.code)['get_v2'])
                                   // console.log(    "conn: " + connection)
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

    app.use("/files",   express.static(path.join(userData, '/files/')));

    app.use("/public/aframe_fonts", express.static(path.join(__dirname, '../public/aframe_fonts')));
    app.use('/viewer',  express.static(path.join(__dirname, '../node_viewerjs/release')));
    app.use(            express.static(path.join(__dirname, '../public/')))
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




    //------------------------------------------------------------------------------
    // search
    //------------------------------------------------------------------------------
    app.get('/client/1/search/*', function (req, res) {
       // console.log("1 - /client/1/search")
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
                //console.log("                                 source =  " + queryData.source )
                //console.log("                                 definition =  " + queryData.definition )

                var seqNum = queuedResponseSeqNum;
                queuedResponseSeqNum ++;
                queuedResponses[seqNum] = res;

                //console.log("2 - getqueryresult")
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
    httpServer.listen(port, hostaddress, function () {
    	console.log(typeOfSystem + ' started on port ' + port + ' with local folder at ' + process.cwd() + ' and __dirname = ' + __dirname+ "\n");
        console.log("****HOST=" + hostaddress + "HOST****\n");
        console.log("****PORT=" + port+ "PORT****\n");
        console.log(""+ "\n");
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




              notifier.notify(
                {
                  title: 'VisiFile Started',
                  message: 'Hello from VisiFile!',
                  icon: path.join(__dirname, '../public/VisiFileColor.png'), // Absolute path (doesn't work on balloons)
                  sound: true, // Only Notification Center or Windows Toasters
                  wait: true // Wait with callback, until user action is taken against notification
                },
                function(err, response) {
                  // Response is response from notification
                }
              );




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

function driversFullFn(callbackFn) {
    dbsearch.serialize(
        function() {
            var result = {}
            var stmt = dbsearch.all(
                "SELECT * FROM drivers",

                function(err, results)
                {
                    for (var i =0 ; i< results.length; i ++) {
                        result[results[i].name] = results[i]
                    }
                    callbackFn( result);
                })
    }, sqlite3.OPEN_READONLY)
}





function parseVfCliCommand(args, callbackFn) {
    var result = ""
    var addedVf = false;

    //result += (args)+ "\n"+ "\n"

    if (args[0] == 'vf') {
        args.shift()
        addedVf = true

    }
    var countArgs = args.length
    var verb = args[0]
    var noun = args[1]
    var object1 = args[2]

    if ((countArgs == 1) && (verb == 'help')) {

        result += "Help:\n\n"
        result += "home:        \n"
        result += "drivers:        \n"
        result += "add driver:        \n"
        result += "add localdriver:        \n"
        result += "test:        \n"

        callbackFn(result)


    } else if ((countArgs == 1) && (verb == 'home')) {

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



        if (noun == 'localdriver') {
            var driverName = object1

            var seqNum = queuedResponseSeqNum;
            queuedResponseSeqNum ++;
            queuedResponses[seqNum] = callbackFn;
            //console.log("2 - get_search_results")
            forkedProcesses["forked"].send({
                            message_type:               "add_local_driver",
                            seq_num:                    seqNum,
                            driver_name:                driverName
                            });    }








    } else if ((countArgs == 1) && (verb == 'test')) {
        result += "Test successful. Connected to " + hostaddress + ":" + port
        callbackFn(result)
        return


    } else {
        if (addedVf && (countArgs == 0)) {
            result += "You must enter a command. eg: 'vf help'"
        }
        else {
            result += "Unknown command: '" + verb + "'"
        }
        callbackFn(result)
        return
        }
}





function findLatestVersionOfApps( callbackFn) {
    dbsearch.serialize(
        function() {
            var stmt = dbsearch.all(
                "SELECT driver FROM system_code where component_type = ? and code_tag = ?; ",
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
                "SELECT driver FROM system_code where on_condition like '%" + methodName + "%'; ",

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


function getAppCodePart2(appName, callbackFn, id, code) {
    dbsearch.all(
        "SELECT dependency_name FROM app_dependencies where driver = ?; ",
        appName,

        function(err, results2)
        {
            callbackFn(id, code, results2)

        })
}


function getAppCode(appName, callbackFn) {
    dbsearch.serialize(
        function() {
            dbsearch.all(
                "SELECT id,code FROM system_code where component_type = 'app' and driver = ? and code_tag = 'LATEST'; ",
                appName,

                function(err, results)
                {
                    if (results.length > 0) {
                        getAppCodePart2(appName, callbackFn, results[0].id, results[0].code.toString())
                    } else {
                        callbackFn(null,null,null)
                    }

                })
    }, sqlite3.OPEN_READONLY)
}
