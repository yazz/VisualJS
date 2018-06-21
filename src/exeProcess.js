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
var stmtInsertProcessError;
var stmtSetDataStatus;
var stmtSetDataHash;
var stmtSetName;
var stmtSetAddedTimestamp;
var stmtSetEstimatedModifiedTimestamp;
var stmtUpdateTags;
var stmtUpdateProperties;
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
            currentCallbackIndex = msg.callback_index
            console.log(childProcessName + " currentCallbackIndex: " + msg.callback_index)
            inUseIndex ++
            inUse = true
            console.log(childProcessName + " is executing: " + msg.code_id)
            //console.log("     msg.callId:" + msg.call_id)
            //console.log("     msg.codeId:" + msg.code_id)
            //console.log("     msg.code:  " + (msg.code?msg.code.length:-1) )
            call_id:       msg.call_id

            if (msg.code_id) {
                currentCallId = msg.call_id
                executeCode(msg.call_id,  msg.code_id, msg.args)
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
    stmtInsertRowFullTextSearch = dbsearch.prepare("INSERT INTO zfts_search_rows_hashed_2 (row_hash, data) VALUES (?, ?)");

    stmtInsertRowHashes         = dbsearch.prepare("INSERT INTO search_rows_hierarchy_2 (document_binary_hash, parent_hash, child_hash) VALUES (?,?,?)");

    stmtInsertIntoContents = dbsearch.prepare(  " insert into contents_2 " +
                                                "      ( id, content, content_type ) " +
                                                " values " +
                                                "      ( ?,  ?, ? );");

    stmtSetDataStatus = dbsearch.prepare(   " update all_data " +
                                            "      set status = ?" +
                                            " where " +
                                            "      id = ? ;");

    stmtSetDataHash = dbsearch.prepare(     " update all_data " +
                                            "      set hash = ?" +
                                            " where " +
                                            "      id = ? ;");

    stmtSetName = dbsearch.prepare(     " update all_data " +
                                        "      set name = ?" +
                                        " where " +
                                        "      id = ? ;");

    stmtSetAddedTimestamp = dbsearch.prepare(   " update all_data " +
                                                "      set timestamp_added = ?" +
                                                " where " +
                                                "      id = ? ;");

    stmtSetEstimatedModifiedTimestamp = dbsearch.prepare(   " update all_data " +
                                                            "      set estimated_modified_timestamp = ?" +
                                                            " where " +
                                                            "      id = ? ;");



    stmtUpdateTags = dbsearch.prepare(      " update all_data " +
                                            "      set tags = ?" +
                                            " where " +
                                            "      id = ? ;");

    stmtUpdateProperties = dbsearch.prepare(    " update all_data " +
                                                "      set properties = ?" +
                                                " where " +
                                                "      id = ? ;");


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

        console.log("@announceFree "+ childProcessName )
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
                        //console.log(    "    " + results[0].base_component_id + ":" + results[0].on_condition + ":" +
                        //                results[0].method )
                        //console.log(    "    callId:" + callId )

                        currentDriver = results[0].base_component_id
                        currentEvent = results[0].on_condition
                        currentCodeID = codeId
                        currentArgs = args
                        //console.log(code)
                        var code = results[0].code.toString()
                        try {
                            if (isFrontEndOnlyCode( code )) {

                                process.send({  message_type:         "function_call_response" ,
                                                result:              { code:            code,
                                                                       is_code_result:  true   },
                                                child_process_name:    childProcessName,
                                                driver_name:           currentDriver,
                                                method_name:           currentEvent,
                                                callback_index:        currentCallbackIndex,
                                                called_call_id:        callId
                                                });
                                //console.log("*) Result process call ID: " + callId);
                                inUseIndex --


                            } else { // front and backend code

                                var fnfn = eval("(" + code + ")")
                                if (code.indexOf("async ") != -1) {
                                    console.log(    "    async code:" + code)
                                    var runAsync = async function() {
                                        var result = await fnfn(args)
                                        console.log("*) Result: in exeProcess" + JSON.stringify(result,null,2));

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
                                    console.log(    "    code:" + code )
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
    if (code.indexOf("only_run_in_user_interface") != -1) { return true }
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




function getProperty(record,propName) {
    var properties = record.properties
    var rt = properties.indexOf("||  " + propName + "=") + 5 + propName.length
    var st = properties.substring(rt)
    var xt = st.indexOf("  ||")
    var amiga = st.substring(0,xt)
    return amiga
}

function getFileName(fullFileNamePath) {
    var fileName = path.basename( fullFileNamePath )
    return fileName
}

function getFileExtension(fullFileNamePath) {
    var extension = fullFileNamePath.substr(fullFileNamePath.lastIndexOf('.') + 1).toLowerCase()
    return extension
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
        return}


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
                            if (results) {
                                if (results.length == 0) {
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
                                }
                            }

                        });
    })

}




function createContent(     fullFileNamePath,
                            sha1ofFileContents,
                            contentType) {


        //
        // create the content if it doesn't exist
        //
        dbsearch.serialize(
            function() {
                var stmt = dbsearch.all(
                    "select  *  from  contents_2  where  id = ? ", [  sha1ofFileContents  ],

                    function(err, results)
                    {
                        if (!err)
                        {
                            if (results.length == 0) {
                                try {
                                    var fileContent = fs.readFileSync(fullFileNamePath)

                                    dbsearch.serialize(function() {

                                        dbsearch.run("begin exclusive transaction");
                                        stmtInsertIntoContents.run(

                                            sha1ofFileContents,
                                            fileContent,
                                            contentType)
                                        dbsearch.run("commit");
                                    })

                                   } catch (err) {
                                       console.log(err);
                                       var stack = new Error().stack
                                       console.log( stack )
                                   }
                           }
                       }
                   })
               }, sqlite3.OPEN_READONLY)
}





function createHashedDocumentContent(fileName, contentType) {
    try {
        var contents = fs.readFileSync(fileName, "utf8");
        var hash = crypto.createHash('sha1');
        hash.setEncoding('hex');
        hash.write(contents);
        hash.end();
        var sha1sum = hash.read();
        createContent(fileName, sha1sum, contentType);
        return sha1sum;
    } catch (err) {
        console.log(err);
        var stack = new Error().stack
        console.log( stack )
        return null;
    }
}

function getFirstRecord(records) {
    return records[0];
}





function setHash(record, value) {
    dbsearch.serialize(function() {

        dbsearch.run("begin exclusive transaction");
        stmtSetDataHash.run(
            value,
            record.id)

        dbsearch.run("commit");
    })
}



function setStatus(record, value) {
    dbsearch.serialize(function() {

        dbsearch.run("begin exclusive transaction");
        stmtSetDataStatus.run(
            value,
            record.id)

        dbsearch.run("commit");
    })
}

function setAddedTimestamp(record, value) {
    dbsearch.serialize(function() {

        dbsearch.run("begin exclusive transaction");
        stmtSetAddedTimestamp.run(
            value,
            record.id)

        dbsearch.run("commit");
    })
}

function setEstimatedModifiedTimestamp(record, value) {
    dbsearch.serialize(function() {

        dbsearch.run("begin exclusive transaction");
        stmtSetEstimatedModifiedTimestamp.run(
            value,
            record.id)

        dbsearch.run("commit");
    })
}





function setName(record, value) {
    dbsearch.serialize(function() {

        dbsearch.run("begin exclusive transaction");
        stmtSetName.run(
            value,
            record.id)

        dbsearch.run("commit");
    })
}



function addTag(record, tag) {
    if (record.tags == null) {
        record.tags = "||  " + tag + "  ||"


    } else  if (record.tags.indexOf("||  " + tag + "  ||") != -1) {
        return

    } else if (record.tags == "") {
        record.tags = "||  " + tag + "  ||"

    } else {
        record.tags += "  " + tag + "  ||"
    }


    dbsearch.serialize(function() {

        dbsearch.run("begin exclusive transaction");
        stmtUpdateTags.run(
            record.tags,
            record.id)

        dbsearch.run("commit");
    })
}








function setProperty(record, propName, propValue) {
    var valToInsert = ""
    if (propValue != null) {
        valToInsert = propValue
    }
    if (record.properties == null) {
        record.properties = "||  " + propName + "=" + valToInsert + "  ||"


    } else if (record.properties.indexOf("||  " + propName + "=") != -1) {
        var startPropValIndex = record.properties.indexOf("||  " + propName + "=") + 5
        var valOnwards = record.properties.substring(startPropValIndex)
        var start = record.properties.substring(0,startPropValIndex)
        var endPropValIndex = valOnwards.indexOf("  ||")

        var end = valOnwards.substring(endPropValIndex)
        record.properties = start + valToInsert + end


    } else if (record.properties == "") {
        record.properties = "||  " + propName + "=" + valToInsert + "  ||"


    } else  {
        record.properties += "  " + propName + "=" + valToInsert + "  ||"
    }


    dbsearch.serialize(function() {

        dbsearch.run("begin exclusive transaction");
        stmtUpdateProperties.run(
            record.properties,
            record.id)

        dbsearch.run("commit");
    })
}


function description(d) {

}

function base_component_id(d) {

}
function display_name(d) {

}
function created_timestamp(d) {

}
function saveCodeV2(baseComponentId, parentHash, code) {
    process.send({  message_type:       "save_code" ,
                    base_component_id:   baseComponentId,
                    parent_hash:         parentHash,
                    code:                code
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






function insertCodeString(code,st, vall ) {
    var findd = st + "("
    var startIndexOfComment = code.toString().indexOf("/*")
    var startIndexOfFn = code.toString().indexOf("{")

    if (startIndexOfFn != -1) {
        if (startIndexOfComment == -1) {
            code = code.toString().substring(0,startIndexOfFn + 1) + "\n    /*\n    */\n" +
                code.toString().substring(startIndexOfFn + 1)
            startIndexOfComment = code.toString().indexOf("/*")
        }
        code = code.toString().substring(0,startIndexOfComment + 3) +
                        "" + st + "(" + JSON.stringify(vall,null,2) + ")\n" +
                        code.toString().substring(startIndexOfComment + 3)

    }

    return code

}






function deleteCodeString(code,st ) {
    var findd = st + "("
    var codeStart = code.toString().indexOf(findd)
    if (codeStart != -1) {
        var codeEnd = codeStart + code.toString().substring(codeStart).indexOf(")")

        code = code.toString().substring(0,codeStart) +
                        code.toString().substring(codeEnd + 1)

        return code
    }
    return code
}



function getValueOfCodeString(code, st) {
    var toFind = st + "("
    if (code.toString().indexOf(toFind) != -1) {
        var codeStart = code.toString().indexOf(toFind) + toFind.length
        var codeEnd = codeStart + code.toString().substring(codeStart).indexOf(")")

        code = code.toString().substring(codeStart, codeEnd)
        var val = eval(code.toString())
        return val

        }
        return null
}
