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
var pgeval
var sqliteeval
var tdeval
var toeval;
var userData
var childProcessName


var inProcessFilesFn                    = false;
var isWin                               = /^win/.test(process.platform);
var numberOfSecondsIndexFilesInterval   = 5;
var inScan                              = false;
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
var stmtInsertIntoFolders;
var stmtInsertIntoConnections;
var stmtInsertIntoConnections2;

var stmtInsertIntoIntranetClientConnects;

var stmtInsertInsertIntoQueries;
var stmtUpdateRelatedDocumentCount;
var stmtUpdateRelationships;
var in_when_queries_changes             = false;
var in_when_connections_change          = false;
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
            inUseIndex ++
            inUse = true
            console.log(childProcessName + " is executing: " + msg.code_id)
            //console.log("     msg.callId:" + msg.call_id)
            //console.log("     msg.codeId:" + msg.code_id)
            //console.log("     msg.code:  " + (msg.code?msg.code.length:-1) )
            call_id:       msg.call_id
            if (msg.code) {
                eval(msg.code)
            }
            if (msg.code_id) {
                executeCode(msg.call_id,  msg.code_id, msg.args)
                currentCallId = msg.call_id
            }
            callbackIndex = msg.callback_index
        }






    } else if (msg.message_type == "return_response_to_function_caller") {
        console.log("*) result received to caller " );
        console.log("*)  callback_index:" + msg.callback_index );
        console.log("*)  result:        " + msg.result );
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
    stmtInsertRowFullTextSearch = dbsearch.prepare("INSERT INTO zfts_search_rows_hashed_2 (row_hash, data) VALUES (?, ?)");

    stmtInsertRowHashes         = dbsearch.prepare("INSERT INTO search_rows_hierarchy_2 (document_binary_hash, parent_hash, child_hash) VALUES (?,?,?)");

}












var functions = new Object()

var inUseIndex = 0

function announceFree() {
    //console.log("@announceFree "+ childProcessName + " in use: " + inUse)
    if ((inUseIndex == 0) && (inUse == true)) {
        inUse = false
        //zzz
        console.log("@announceFree "+ childProcessName )
        process.send({  message_type:       "processor_free" ,
                        child_process_name:  childProcessName
                    })
    }
}

var currentCallId = null
function executeCode(callId, codeId, args) {
    //console.log("@executeCode "+ childProcessName + " in use: " + inUse)

    dbsearch.serialize(
        function() {
            var stmt = dbsearch.all(
                "SELECT * FROM system_code where id  = ?; ",
                codeId,

                function(err, results)
                {
                    if (results.length > 0) {
                        console.log(    "    " + results[0].driver + ":" + results[0].on_condition + ":" +
                                        results[0].method )
                        console.log(    "    callId:" + callId )

                        var code = "(" + results[0].code + ")"
                        //console.log(code)
                        var fnfn = eval(code)

                        fnfn(args, function(result) {
                            if (result) {
                                console.log("*) Result: " + result);

                                process.send({  message_type:       "function_call_response" ,
                                                child_process_name:  childProcessName,
                                                driver_name:         results[0].driver,
                                                method_name:         results[0].method,
                                                callback_index:      callbackIndex,
                                                result:              result,
                                                called_call_id:      callId
                                                });
                                console.log("*) Result process call ID: " + callId);
                            }
                            inUseIndex --
                        })
                        //callbackFn(results[0].id);
                    } else {
                        //callbackFn(null)
                    }

                })
    }, sqlite3.OPEN_READONLY)
}
var callbackIndex = -1


var callbackIndex = 0;
var callbackList = new Object()

function callDriverMethod( driverName, methodName, args, callbackFn ) {

    inUseIndex ++
    console.log("*) called '" + driverName + ":" + methodName + "' with args: " + JSON.stringify(args,null,2))
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




function getProperty(record,propName) {
    var properties = record.properties
    var rt = properties.indexOf("||  " + propName + "=") + 5 + propName.length
    var st = properties.substring(rt)
    var xt = st.indexOf("  ||")
    var amiga = st.substring(0,xt)
    return amiga
}

function getFileExtension(fullFileNamePath) {
    var extension = fullFileNamePath.substr(fullFileNamePath.lastIndexOf('.') + 1).toLowerCase()
    return extension
}


function findDriverWithMethod(methodName, callbackFn) {
    dbsearch.serialize(
        function() {
            var stmt = dbsearch.all(
                "SELECT driver FROM system_code where on_condition like '%" + methodName + "%'; ",

                function(err, results)
                {
                    if (results.length > 0) {
                        callbackFn(results[0].driver)
                    } else {
                        callbackFn(null)
                    }

                })
    }, sqlite3.OPEN_READONLY)
}










function saveDocumentContent(  documentHash,  resultData  ) {

    //
    // get the data, either passed in as an array or a set
    //
    var rrows = [];
    if( Object.prototype.toString.call( resultData ) === '[object Array]' ) {
        rrows = resultData;
    } else {
        rrows = resultData.values;
    }
    if ((rrows == null) || (rrows.length == 0)) {
        returns}


    //
    // see if the document has already been saved. Only save it if not saved already
    //
    dbsearch.serialize(
        function() {
            var stmt = dbsearch.all(
                        "select  " +
                        "    document_binary_hash  "  +
                        "from  " +
                        "    search_rows_hierarchy_2  " +
                        "where  " +
                        "    document_binary_hash = '" + documentHash + "'"
                        ,
                        function(err, results) {
                                dbsearch.serialize(
                                    function() {
                                        dbsearch.run("begin exclusive transaction");
                                        for (var i = 0 ; i < rrows.length; i++) {

                                            var rowhash = crypto.createHash('sha1');
                                            var row = JSON.stringify(rrows[i]);
                                            rowhash.setEncoding('hex');
                                            rowhash.write(row);
                                            rowhash.end();
                                            var sha1sum = rowhash.read();
                                            stmtInsertRowFullTextSearch.run(sha1sum, row)
                                            stmtInsertRowHashes.run(documentHash, null, sha1sum)
                                        }
                                        dbsearch.run("commit");
                                })

                        });
    }, sqlite3.OPEN_READONLY)

}
