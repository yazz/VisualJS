var fs                          = require('fs');
var path                        = require('path');
var mkdirp                      = require('mkdirp')
var postgresdb                  = require('pg');
var mysql                       = require('mysql');
const uuidv1                    = require('uuid/v1');
var crypto                      = require('crypto');


let nodeModulesPath = process.cwd()
if (process.execPath) {
    let vjsPos = process.execPath.indexOf("vjs")
    if (vjsPos != -1) {
        let vjsLen = process.execPath.length - vjsPos
        nodeModulesPath = process.execPath.substring(0, process.execPath.length - vjsLen);
    }
}


let sqlNodePath = path.join(nodeModulesPath,'node_modules/sqlite3')
//console.log("sqlNodePath: " + sqlNodePath)
var sqlite3                     = require(sqlNodePath);
var os                          = require('os')
var perf                        = require('./perf')
var db_helper                   = require("./db_helper")
var saveHelper                  = require('./save_helpers')
var esprima                     = require('esprima');
var yazzInstanceId = null

var pgeval
var sqliteeval
var tdeval
var toeval;
var userData
var childProcessName
var showDebug = false
var showProgress = false
function outputDebug(text) {
    if (showDebug) {
         console.log(text);
    } else {
        if (showProgress) {
            process.stdout.write(".");
        }
    }
};

var isWin                               = /^win/.test(process.platform);
var inScan                              = false;
var stmt2                               = null;
var stmt3                               = null;
var finishedFindingFolders              = false;
var username                            = "Unknown user";
var dbsearch;
var lhs;
var rhs;

var stmtInsertDependency;
var stmtInsertSubComponent;
var stmtUpdateDriver;
var stmtDeleteDependencies;

var stmtInsertAppDDLRevision;
var stmtUpdateLatestAppDDLRevision;
var stmtInsertIntoAppRegistry
var stmtUpdateAppRegistry

var stmtDeleteTypesForComponentProperty;
var stmtDeleteAcceptTypesForComponentProperty;




var hostaddress = null
var port = null


//username = os.userInfo().username.toLowerCase();
username = "node"
//console.log(username);

//dbsearch.run("PRAGMA synchronous=OFF;")
//dbsearch.run("PRAGMA count_changes=OFF;")
//dbsearch.run("PRAGMA journal_mode=MEMORY;")
//dbsearch.run("PRAGMA temp_store=MEMORY;")
var callbackIndex = 0;
var callbackList = new Object()











processMessagesFromMainProcess();



















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


    stmtInsertIntoAppRegistry = dbsearch.prepare(" insert or replace into app_registry " +
                                "    (id,  username, reponame, version, code_id ) " +
                                " values " +
                                "    (?, ?, ?, ?, ? );");


    stmtUpdateAppRegistry = dbsearch.prepare(" update app_registry " +
                                "    set code_id = ? " +
                                " where " +
                                "    username = ?  and  reponame = ? and version = ?;");



    stmtInsertDependency = dbsearch.prepare(" insert or replace into app_dependencies " +
                                "    (id,  code_id, dependency_type, dependency_name, dependency_version ) " +
                                " values " +
                                "    (?, ?, ?, ?, ? );");

    stmtInsertSubComponent = dbsearch.prepare(`insert or ignore
                                                    into
                                               component_usage
                                                    (base_component_id, child_component_id)
                                               values (?,?)`)



    stmtDeleteDependencies = dbsearch.prepare(" delete from  app_dependencies   where   code_id = ?");


    //zzz
    stmtDeleteTypesForComponentProperty = dbsearch.prepare(" delete from  component_property_types   where   component_name = ?");
    stmtDeleteAcceptTypesForComponentProperty = dbsearch.prepare(" delete from  component_property_accept_types   where   component_name = ?");





     stmtInsertAppDDLRevision = dbsearch.prepare(  " insert into app_db_latest_ddl_revisions " +
                                                  "      ( base_component_id,  latest_revision  ) " +
                                                  " values " +
                                                  "      ( ?,  ? );");

     stmtUpdateLatestAppDDLRevision = dbsearch.prepare(  " update  app_db_latest_ddl_revisions  " +
                                                          "     set  latest_revision = ? " +
                                                          " where " +
                                                          "     base_component_id =  ? ;");


}
















//------------------------------------------------------------------------------
//
//
//
//
//
//------------------------------------------------------------------------------
function callDriverMethod( findComponentArgs, args, callbackFn ) {

    //console.log("*) called '" + driverName + ":" + methodName + "' with args: " + JSON.stringify(args,null,2))
    var useCallbackIndex = callbackIndex ++
    callbackList[ useCallbackIndex ] = callbackFn
    //console.log("msg.callback_index sent for " + driverName + ":" + methodName + ": " + useCallbackIndex)
    process.send({  message_type:       "function_call_request" ,
                    child_process_name:  "forked",
                    find_component:      findComponentArgs,
                    args:                args,
                    callback_index:      useCallbackIndex,
                    caller_call_id:      -1
                    });
}






//------------------------------------------------------------------------------
//
//
//
//
//
//------------------------------------------------------------------------------
function findDriversWithMethod(methodName, callbackFn) {
    dbsearch.serialize(
        function() {
            var stmt = dbsearch.all(
                "SELECT base_component_id FROM system_code where on_condition = '\"" + methodName + "\"'; ",

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













//-----------------------------------------------------------------------------------------//
//                                                                                         //
//                               processMessagesFromMainProcess                            //
//                                                                                         //
//                                                                                         //
//                                                                                         //
//                                                                                         //
//                                                                                         //
//                                                                                         //
//                                                                                         //
//                                                                                         //
//-----------------------------------------------------------------------------------------//
function processMessagesFromMainProcess() {
    process.on('message', (msg) => {
      //console.log('Message from parent:', msg);


      if (msg.message_type == 'parent_test') {
          //console.log('Message from parent:', msg);
          process.send({send_from_child: "***** Received message from parent"})


      } else if (msg.message_type == 'callDriverMethod') {

          callDriverMethod( msg.find_component, msg.args, function(result) {
              if (msg.seq_num_local) {
                  process.send(
                      {
                          message_type: 'return_add_local_driver_results_msg',
                          seq_num_local: msg.seq_num_local,
                          result: result
                      })
              } else {
                  process.send(
                      {
                          message_type: 'ipc_child_returning_callDriverMethod_response',
                          seq_num_browser: msg.seq_num_browser,
                          seq_num_parent: msg.seq_num_parent,
                          result: result
                      })
              }
          })








      } else if (msg.message_type == 'childSetSharedGlobalVar') {



    } else if (msg.message_type == 'greeting') {

        outputDebug("**** greeting");


    } else if (msg.message_type == 'host_and_port') {

        hostaddress         = msg.ip
        port                = msg.port



    } else if (msg.message_type == 'init') {

        userData            = msg.user_data_path
        childProcessName    = msg.child_process_name
        showDebug           = msg.show_debug
        showProgress        = msg.show_progress
        yazzInstanceId      = msg.yazz_instance_id
        outputDebug("yazzInstanceId in child: " + yazzInstanceId);


        ////console.log("Child recieved user data path: " + userData)
        var dbPath = path.join(userData, username + '.visi')

        //console.log("DB path: " + dbPath)
        dbsearch = new sqlite3.Database(dbPath);
        dbsearch.run("PRAGMA journal_mode=WAL;",function() {
            setTimeout(function(){
                setUpSql();
                process.send({  message_type:       "database_setup_in_child" ,
                                child_process_name:  childProcessName
                                });
            },1000)
        })




    } else if (msg.message_type == 'setUpSql') {


        //setUpSql();

    } else if (msg.message_type == 'createTables') {

        outputDebug("**** createTables");

        db_helper.createTables(dbsearch,
            function() {
                outputDebug("");
                outputDebug("***********************************");
                outputDebug("**** createTables returned");
                outputDebug("***********************************");
                outputDebug("");

                process.send({  message_type:       "createdTablesInChild"  });

            });







    } else if (msg.message_type == "return_response_to_function_caller") {
       // console.log("*) result received to caller " );
       // console.log("*)  callback_index:" + msg.callback_index );
       // console.log("*)  result:        " + msg.result );
        callbackList[ msg.callback_index ](msg.result)

    }



    });
}








































































//------------------------------------------------------------------------------
//
//
//
//
//
//------------------------------------------------------------------------------
process.on('exit', function(err) {
    shutdownExeProcess(err);
  });
process.on('quit', function(err) {
  shutdownExeProcess(err);
});










//------------------------------------------------------------------------------
//
//
//
//
//
//------------------------------------------------------------------------------
function shutdownExeProcess(err) {
    console.log("** child.js process was killed " )
    if (err) {
        console.log("    : " + err)
    }


    if (dbsearch) {
        dbsearch.run("PRAGMA wal_checkpoint;")
    }
}







//------------------------------------------------------------------------------
//
//
//
//
//
//------------------------------------------------------------------------------
function copyFile(source, target, cb) {
  var cbCalled = false;

  var rd = fs.createReadStream(source);
  rd.on("error", function(err) {
    done(err);
  });
  var wr = fs.createWriteStream(target);
  wr.on("error", function(err) {
    done(err);
  });
  wr.on("close", function(ex) {
    done();
  });
  rd.pipe(wr);

  function done(err) {
    if (!cbCalled) {
      cb(err);
      cbCalled = true;
    }
  }
}












//------------------------------------------------------------------------------
//
//
//
//
//
//------------------------------------------------------------------------------
function isValidObject(variable){
    if ((typeof variable !== 'undefined') && (variable != null)) {
        return true
    }
    return false
}
