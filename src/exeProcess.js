var fs                              = require('fs');
var path                            = require('path');
var mkdirp                          = require('mkdirp')
var postgresdb                      = require('pg');
var mysql                           = require('mysql');
const uuidv1                        = require('uuid/v1');
var inUseIndex                      = 0
var currentCallId                   = null
var currentDriver                   = null
var currentCodeID                   = null
var currentArgs                     = null
let electronApp                     = false
let nodeModulesPath                 = process.cwd()
var os                              = require('os')
var perf                            = require('./perf')
var db_helper                       = require("./db_helper")
var https                           = require('https');
var http                            = require('http');
var request                         = require('request');
var xml2js                          = require('xml2js')
var traverse                        = require('traverse');
var Kafka                           = require('kafkajs').Kafka
var userData
var childProcessName
var ip                              = require('ip');
var yazzInstanceId                  = null
const initJaegerTracer              = require("jaeger-client").initTracer;
const {Tags, FORMAT_HTTP_HEADERS}   = require('opentracing')
let jaegerConfig                    = null
let tracer                          = null
const jaegerOptions                 = { };
let jaegercollector                 = null
var isWin                           = /^win/.test(process.platform);
var username                        = "Unknown user";
var dbsearch;
var envVars
var stmtInsertProcessError;
var inUse                           = false
var callbackIndex                   = 0
var currentCallbackIndex            = -1
var yz                              = require('./yazz_helper_module')
var callbackList                    = new Object()





console.log("e***: " + process.env.electron)
if (process.env.electron && (process.env.electron == "TRUE")) {
    electronApp = true
}

if (process.execPath) {
    let vjsPos = process.execPath.indexOf("vjs")
    if (vjsPos != -1) {
        let vjsLen = process.execPath.length - vjsPos
        nodeModulesPath = process.execPath.substring(0, process.execPath.length - vjsLen);
    }
}


let sqlNodePath = path.join(nodeModulesPath,'node_modules/sqlite3')
//console.log("sqlNodePath: " + sqlNodePath)
var sqlite3                     = null
if (electronApp){
    sqlite3                     = require("sqlite3");
} else {
    sqlite3                     = require(sqlNodePath);
}

//username = os.userInfo().username.toLowerCase();
username = "node"
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
        yz.userData = userData

        childProcessName    = msg.child_process_name
        yazzInstanceId      = msg.yazz_instance_id
        jaegercollector     = msg.jaeger_collector
        envVars             = msg.env_vars

        //console.log("  Child recieved user data path: " + userData)
        var dbPath = path.join(userData, username + '.visi')


        if (jaegercollector) {
            jaegerConfig = {
                serviceName: "AppShare",
                sampler: {
                    type: "const",
                    param: 1
                },
                reporter: {
                    collectorEndpoint: jaegercollector,
                    logSpans: true
                }
            }
            console.log("Trying to connect to Jaeger at " + jaegercollector)
        }



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
                executeCode(msg.call_id,  msg.code_id, msg.args,   msg.base_component_id)
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
                                                      yazz_instance_id,
                                                      status,
                                                      base_component_id,
                                                      system_code_id,
                                                      args,
                                                      error_message )
                                                  values
                                                      ( ?,  ?,  ?,  ?,  ?,  ?,   ?,  ? , ?);`)
}







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











/*
________________________________________
|                                      |
|         executeCode                  |
|                                      |
|______________________________________|
Function description
__________
| PARAMS |______________________________________________________________
|
|   callId              Some text
|   ------
|
|   codeId              Some text
|   ------
|
|   args                Some text
|   ----
|
|   base_component_id   Some text
|   -----------------
|________________________________________________________________________ */
function executeCode(  callId  ,  codeId  , args  ,  base_component_id  ) {
    dbsearch.serialize(
        function() {
            dbsearch.all(
                "SELECT base_component_id,code,properties FROM system_code where id  = ?; ",
                codeId,

                function(err, results)
                {
                    if (results.length > 0) {
                        currentDriver           = results[0].base_component_id
                        currentCodeID           = codeId
                        currentArgs             = args
                        var properties          = results[0].properties

                        var code = results[0].code.toString()
                        try {

//console.log(code)
                                var fnfn = eval("(" + code + ")")
                                if (code.indexOf("function*") != -1) {
                                    //zzz
                                    var generator = fnfn()
                                    let result = generator.next();
                                    while (!result.done) {
                                        console.log(result.value); // 1 3 5 7 9
                                        result = generator.next();
                                    }
                                    process.send({  message_type:       "function_call_response" ,
                                                    child_process_name:  childProcessName,
                                                    base_component_id:         currentDriver,
                                                    callback_index:      currentCallbackIndex,
                                                    result:              {value: result.value},
                                                    called_call_id:      callId
                                                    });
                                    //console.log("*) Result process call ID: " + callId);
                                    inUseIndex --

                                } else if (code.indexOf("async ") != -1) {
                                    //console.log(    "    async code:" + code)
                                    var runAsync = async function() {
                                        var result = await fnfn(args)
                                        //console.log("*) Result: in exeProcess" + JSON.stringify(result,null,2));

                                        process.send({  message_type:       "function_call_response" ,
                                                        child_process_name:  childProcessName,
                                                        base_component_id:         currentDriver,
                                                        callback_index:      currentCallbackIndex,
                                                        result:              {value: result},
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
                                                    base_component_id:         currentDriver,
                                                    callback_index:      currentCallbackIndex,
                                                    result:              {value: result},
                                                    called_call_id:      callId
                                                    });
                                    //console.log("*) Result process call ID: " + callId);
                                    inUseIndex --
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
                                          yazzInstanceId,
                                          "ERROR",
                                          currentDriver,
                                          currentCodeID,
                                          JSON.stringify(currentArgs,null,2),
                                          errM.toString() )

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







process.on('uncaughtException', function (err) {
  console.log("\n\n *****uncaughtException:");
  console.log("    Err: " + JSON.stringify(err,null,2));
  process.send({  message_type:       "function_call_response" ,
                  child_process_name:  childProcessName,
                  base_component_id:         currentDriver,
                  callback_index:      currentCallbackIndex,
                  result:              {error: err},
                  called_call_id:      currentCallId
                  });
  inUseIndex --
})







function callComponentNonAsync( driverName, args, callbackFn ) {

    inUseIndex ++
    var useCallbackIndex = callbackIndex ++
    process.send({  message_type:       "function_call_request" ,
                    child_process_name:  childProcessName,
                    base_component_id:         driverName,
                    args:                args,
                    callback_index:      useCallbackIndex,
                    caller_call_id:      currentCallId,
                    find_component: {
                        base_component_id:         driverName
                    }
                });
    callbackList[ useCallbackIndex ] = callbackFn
}



async function callComponent(options,args) {
    var promise = new Promise(async function(returnfn) {
        callComponentNonAsync(
            options.base_component_id,
            args
            ,
            function(results) {
                returnfn(results)
            })
    })
    var val = await promise

        return val

}








process.on('unhandledRejection', (reason) => {
	console.log('REJECTION:::::: ', reason)
    dbsearch.serialize(function() {

        dbsearch.run("begin exclusive transaction");
        var newId = uuidv1()
        stmtInsertProcessError.run(
              newId,
              new Date().getTime(),
              childProcessName,
              yazzInstanceId,
              "ERROR",
              currentDriver,
              currentCodeID,
              JSON.stringify(currentArgs,null,2),
              reason.toString() )

        dbsearch.run("commit");
    })
    throw reason
})



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







function trace(spanText,tag,params) {
    if (jaegercollector) {
        console.log("calling jaeger(" + spanText + ")...")
        try {
            tracer = initJaegerTracer(jaegerConfig, jaegerOptions);
            let span=tracer.startSpan(spanText)
            span.setTag(tag, params)
            span.finish()
            tracer.close()
            console.log("...called jaeger")
        } catch(err){
            console.log("Error calling jaeger: " + err)
        }
    }
}
