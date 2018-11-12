'use strict';

var fs                          = require('fs');
var path                        = require('path');
var mkdirp                      = require('mkdirp')
var XLSX                        = require('xlsx');
var csv                         = require('fast-csv');
var mammoth                     = require("mammoth");
var postgresdb                  = require('pg');
var mysql                       = require('mysql');
const uuidv1                    = require('uuid/v1');
var crypto                      = require('crypto');
var diff                        = require('deep-diff').diff
var sqlite3                     = require('sqlite3');
var os                          = require('os')
var perf                        = require('./perf')
var db_helper                   = require("./db_helper")
var isBinaryFile                = require("isbinaryfile");
var userData
var childProcessName


var isWin                               = /^win/.test(process.platform);
var stmtInsertRowFullTextSearch                               = null;
var stmtInsertRowHashes                               = null;
var setIn                               = null;
var inGetRelatedDocumentHashes          = false;
var inIndexFileRelationshipsFn          = false;
var finishedFindingFolders              = false;
var username                            = "Unknown user";
var dbsearch;
var xdiff;
var lhs;
var rhs;
var stmtInsertIntoRelationships;
var stmtUpdateRelationships2;

var stmtUpdateFolder;
var stmtResetFolders;
var stmtInsertDriver;
var stmtUpdateDriver;
var stmtInsertIntoQueries;

var stmtResetFiles;
var stmtFileChanged;
var stmtInsertIntoMessages;
var stmtInsertIntoFiles;
var stmtInsertIntoFiles2;
var stmtUpdateFileStatus;
var stmtUpdateFileSizeAndShaAndConnectionId;
var stmtUpdateFileProperties;

var stmtInsertIntoContents;
var stmtInsertProcessError;
var stmtUpdateTags;
var stmtUpdateProperties;
var stmtInsertIntoFolders;
var stmtInsertIntoConnections;
var stmtInsertIntoConnections2;

var stmtInsertIntoIntranetClientConnects;

var stmtInsertInsertIntoQueries;
var stmtUpdateRelatedDocumentCount;
var stmtUpdateRelationships;
var inUse = false

username = os.userInfo().username.toLowerCase();
//console.log(username);

//dbsearch.run("PRAGMA synchronous=OFF;")
//dbsearch.run("PRAGMA count_changes=OFF;")
//dbsearch.run("PRAGMA journal_mode=MEMORY;")
//dbsearch.run("PRAGMA temp_store=MEMORY;")







processMessagesFromMainProcess();



function processMessagesFromMainProcess() {
    process.on('message', (msg) => {





    if  (msg.message_type == 'init') {
        //console.log('-- Init v3');
        userData            = msg.user_data_path
        childProcessName    = msg.child_process_name

        //console.log("  Child recieved user data path: " + userData)
        var dbPath = path.join(userData, username + '.visi')

        //console.log("  DB path: " + dbPath)
        dbsearch = new sqlite3.Database(dbPath);
        dbsearch.run("PRAGMA journal_mode=WAL;")
        process.send({  message_type:       "database_setup_in_child" ,
                        child_process_name:  childProcessName
                        });



        setInterval(announceFree, 1000)



    } else if (msg.message_type == 'setUpSql') {
        setUpSql();







    //-----------------------------------------------------------------------------------------//
    //                                                                                         //
    //                                        execute_code                                     //
    //                                                                                         //
    //   Called from the main process to excute code                                           //
    //                                                                                         //
    //                                                                                         //
    //                                                                                         //
    //                                                                                         //
    //                                                                                         //
    //                                                                                         //
    //-----------------------------------------------------------------------------------------//
    } else if  (msg.message_type == 'execute_code') {
        if (inUse) {
            console.log("*) ERROR: " + childProcessName + " is already running method ")
        } else {
            currentCallbackIndex = msg.callback_index
            //console.log(childProcessName + " currentCallbackIndex: " + msg.callback_index)
            inUseIndex ++
            inUse = true
            //console.log(childProcessName + " is executing: " + msg.code_id)
            //console.log("     msg.callId:" + msg.call_id)
            //console.log("     msg.codeId:" + msg.code_id)
            //console.log("     msg.code:  " + (msg.code?msg.code.length:-1) )
            call_id:       msg.call_id

            if (msg.code_id) {
                currentCallId = msg.call_id
                executeCode(msg.call_id,  msg.code_id, msg.args,  msg.on_condition,  msg.base_component_id)
            }
        }






    } else if (msg.message_type == "return_response_to_function_caller") {
      //  console.log("*) result received to caller " );
      //  console.log("*)  callback_index:" + msg.callback_index );
        //console.log("*)  result:        " + msg.result );
        callbackList[ msg.callback_index ](msg.result)
        inUseIndex --

    }





});}






//-----------------------------------------------------------------------------------------//
//                                                                                         //
//                                        setUpSql                                         //
//                                                                                         //
//   This sets up the SqlLite prepared statements                                          //
//                                                                                         //
//                                                                                         //
//                                                                                         //
//                                                                                         //
//                                                                                         //
//                                                                                         //
//-----------------------------------------------------------------------------------------//
function setUpSql() {

    stmtInsertProcessError = dbsearch.prepare(  ` insert into
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
}






var functions = new Object()

var inUseIndex = 0

function announceFree() {
    //console.log("@announceFree "+ childProcessName + " in use: " + inUse)
    if ((inUseIndex == 0) && (inUse == true)) {
        inUse = false

        //console.log("@announceFree "+ childProcessName )
        process.send({  message_type:       "processor_free" ,
                        child_process_name:  childProcessName
                    })
    }
}

var currentCallId = null
var currentDriver = null
var currentEvent = null
var currentCodeID = null
var currentArgs = null

function executeCode(callId, codeId, args, on_condition,  base_component_id) {
    //console.log("@executeCode "+ childProcessName + " in use: " + inUse)

    dbsearch.serialize(
        function() {
            var stmt = dbsearch.all(
                "SELECT base_component_id,component_options,use_db,on_condition,code,properties FROM system_code where id  = ?; ",
                codeId,

                function(err, results)
                {
                    if (results.length > 0) {
                        //console.log(    "    " + results[0].base_component_id + ":" + results[0].on_condition + ":" +
                        //                results[0].method )
                        //console.log(    "    callId:" + callId )

                        currentDriver           = results[0].base_component_id
                        var componentOptions    = results[0].component_options
                        var useDb               = results[0].use_db
                        currentEvent            = results[0].on_condition
                        currentCodeID           = codeId
                        currentArgs             = args
                        var properties          = results[0].properties

                        var code = results[0].code.toString()
                        try {
                            if (isFrontEndOnlyCode( code )) {
                                    dbsearch.all(
                                        "SELECT dependency_name FROM app_dependencies where code_id = ?; ",
                                        codeId,

                                        function(err, results2)
                                        {
                                            process.send({  message_type:         "function_call_response" ,
                                                            result:              { code:                code,
                                                                                   is_code_result:      true,
                                                                                   use_db:              useDb,
                                                                                   component_options:   componentOptions,
                                                                                   libs:                results2,
                                                                                   code_id:             codeId,
                                                                                   on_condition:        on_condition,
                                                                                   base_component_id:   base_component_id,
                                                                                   properties:          properties
                                                                                      },
                                                            child_process_name:    childProcessName,
                                                            driver_name:           currentDriver,
                                                            method_name:           currentEvent,
                                                            callback_index:        currentCallbackIndex,
                                                            called_call_id:        callId
                                                            });
                                            //console.log("*) Result process call ID: " + callId);
                                            inUseIndex --

                                        })



                            } else { // front and backend code

                                var fnfn = eval("(" + code + ")")
                                if (code.indexOf("async ") != -1) {
                                    //console.log(    "    async code:" + code)
                                    var runAsync = async function() {
                                        var result = await fnfn(args)
                                        //console.log("*) Result: in exeProcess" + JSON.stringify(result,null,2));

                                        process.send({  message_type:       "function_call_response" ,
                                                        child_process_name:  childProcessName,
                                                        driver_name:         currentDriver,
                                                        method_name:         currentEvent,
                                                        callback_index:      currentCallbackIndex,
                                                        result:              result,
                                                        called_call_id:      callId
                                                        });
                                        //console.log("*) Result process call ID: " + callId);
                                        inUseIndex --
                                    }
                                    runAsync()

                                } else {
                                    //console.log(    "    code:" + code )
                                    var result = fnfn(args)
                                    //console.log("*) Result: in exeProcess" + JSON.stringify(result,null,2));

                                    process.send({  message_type:       "function_call_response" ,
                                                    child_process_name:  childProcessName,
                                                    driver_name:         currentDriver,
                                                    method_name:         currentEvent,
                                                    callback_index:      currentCallbackIndex,
                                                    result:              result,
                                                    called_call_id:      callId
                                                    });
                                    //console.log("*) Result process call ID: " + callId);
                                    inUseIndex --
                                }

                            }


                            } catch (errM) {
                                inUseIndex --
                                console.log("** ERROR : " + errM)

                                dbsearch.serialize(function() {

                                    dbsearch.run("begin exclusive transaction");
                                    var newId = uuidv1()
                                    stmtInsertProcessError.run(
                                          newId,
                                          new Date().getTime(),
                                          childProcessName,
                                          "ERROR",
                                          currentDriver,
                                          currentEvent,
                                          currentCodeID,
                                          JSON.stringify(currentArgs,null,2),
                                          errM.toString() )
                                          //zzz
                                    dbsearch.run("commit");
                                })
                            }


                        //callbackFn(results[0].id);
                        } else {
                            //callbackFn(null)
                        }

                })
    }, sqlite3.OPEN_READONLY)
}

function isFrontEndOnlyCode(code) {
    if (code.indexOf("Vue.") != -1) { return true }
    if (code.indexOf("only_run_on_server") != -1) { return false }
    return false
}
//pure_function


var callbackIndex = 0
var currentCallbackIndex = -1



var callbackList = new Object()

function callDriverMethod( driverName, methodName, args, callbackFn ) {

    inUseIndex ++
    //console.log("*) called '" + driverName + ":" + methodName + "' with args: " + JSON.stringify(args,null,2))
    var useCallbackIndex = callbackIndex ++
    process.send({  message_type:       "function_call_request" ,
                    child_process_name:  childProcessName,
                    driver_name:         driverName,
                    method_name:         methodName,
                    args:                args,
                    callback_index:      useCallbackIndex,
                    caller_call_id:      currentCallId
                    });
    callbackList[ useCallbackIndex ] = callbackFn
}



function findDriverWithMethod(methodName, callbackFn) {
    dbsearch.serialize(
        function() {
            var stmt = dbsearch.all(
                "SELECT base_component_id FROM system_code where on_condition like '%" + methodName + "%'; ",

                function(err, results)
                {
                    if (results.length > 0) {
                        callbackFn(results[0].base_component_id)
                    } else {
                        callbackFn(null)
                    }

                })
    }, sqlite3.OPEN_READONLY)
}






function saveCodeV2(baseComponentId, parentHash, code,options) {
    process.send({  message_type:       "save_code" ,
                    base_component_id:   baseComponentId,
                    parent_hash:         parentHash,
                    code:                code,
                    options:             options
                    });
}

process.on('exit', function(err) {
    shutdownExeProcess(err);
  });
process.on('quit', function(err) {
  shutdownExeProcess(err);
});

function shutdownExeProcess(err) {
    console.log("** This process was killed: " + childProcessName)
    if (err) {
        console.log("    : " + err)
    }


    if (dbsearch) {
        dbsearch.run("PRAGMA wal_checkpoint;")
    }
}



var saveHelper = require('./save_helpers')
