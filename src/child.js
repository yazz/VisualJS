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
var stmtInsertTypesForComponentProperty;
var stmtInsertComponentProperty;
var stmtInsertAcceptTypesForComponentProperty;


var copyMigration;
var stmtInsertNewCode
var stmtDeprecateOldCode
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
    //console.log("setUpSql    ")
    copyMigration = dbsearch.prepare(
    `                insert into  app_db_latest_ddl_revisions
                       (base_component_id,latest_revision)
                    select ?,  latest_revision from app_db_latest_ddl_revisions
                     where base_component_id=?

    `
    );

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


    //select name from (select distinct(name) ,count(name) cn from test  where value in (1,2,3)  group by name) where cn = 3
    stmtInsertComponentProperty = dbsearch.prepare(`insert or ignore
                                                    into
                                               component_properties
                                                    (component_name, property_name )
                                               values ( ?,?)`)

    stmtInsertTypesForComponentProperty = dbsearch.prepare(`insert or ignore
                                                    into
                                               component_property_types
                                                    (component_name, property_name , type_name, type_value )
                                               values ( ?,?,?,?)`)

    stmtInsertAcceptTypesForComponentProperty = dbsearch.prepare(`insert or ignore
                                                    into
                                               component_property_accept_types
                                                    (component_name, property_name , accept_type_name , accept_type_value )
                                               values ( ?,?,?,?)`)


     stmtInsertAppDDLRevision = dbsearch.prepare(  " insert into app_db_latest_ddl_revisions " +
                                                  "      ( base_component_id,  latest_revision  ) " +
                                                  " values " +
                                                  "      ( ?,  ? );");

     stmtUpdateLatestAppDDLRevision = dbsearch.prepare(  " update  app_db_latest_ddl_revisions  " +
                                                          "     set  latest_revision = ? " +
                                                          " where " +
                                                          "     base_component_id =  ? ;");

      stmtInsertNewCode = dbsearch.prepare(
          " insert into   system_code  (id, parent_id, code_tag, code,on_condition, base_component_id, method, max_processes,component_scope,display_name, creation_timestamp,component_options, logo_url, visibility, interfaces,use_db, editors, read_write_status,properties, component_type, control_sub_type, edit_file_path) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
      stmtDeprecateOldCode = dbsearch.prepare(
          " update system_code  set code_tag = NULL where base_component_id = ? and id != ?");

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
function updateRegistry(options, sha1sum) {

    if (!options.username || !options.reponame) {
        return
    }
    if (!options.version) {
        options.version = "latest"
    }
    if (!sha1sum) {
        return
    }
    try {

        dbsearch.serialize(
            function() {
                dbsearch.all(
                    "SELECT  *  from  app_registry  where  username = ?  and  reponame = ? and version = ?; "
                    ,
                    [options.username  ,  options.reponame  ,  options.version]
                    ,

                    function(err, results)
                    {

                        try {
                            dbsearch.serialize(function() {
                                dbsearch.run("begin exclusive transaction");
                                if (results.length == 0) {
                                    stmtInsertIntoAppRegistry.run(uuidv1(),  options.username  ,  options.reponame  ,  options.version,  sha1sum)
                                } else {
                                    stmtUpdateAppRegistry.run(sha1sum, options.username  ,  options.reponame  ,  options.version)
                                }
                                dbsearch.run("commit")
                            })
                        } catch(er) {
                            console.log(er)
                        }


                     })
                 },
                 sqlite3.OPEN_READONLY)


    } catch (ewr) {
        console.log(ewr)
    }
}





//------------------------------------------------------------------------------
//
//
//
//
//
//------------------------------------------------------------------------------
function updateRevisions(sqlite, baseComponentId) {
    //console.log("updateRevisions    ")
    try {

        dbsearch.serialize(
            function() {
                dbsearch.all(
                    "SELECT  *  from  app_db_latest_ddl_revisions  where  base_component_id = ? ; "
                    ,
                    baseComponentId
                    ,

                    function(err, results)
                    {
                        var latestRevision = null
                        if (results.length > 0) {
                            latestRevision = results[0].latest_revision
                        }
                        var dbPath = path.join(userData, 'app_dbs/' + baseComponentId + '.visi')
                        var appDb = new sqlite3.Database(dbPath);
                        //appDb.run("PRAGMA journal_mode=WAL;")

                        appDb.serialize(
                            function() {
                              try {
                                appDb.run("begin exclusive transaction");
                                var newLatestRev = null
                                var readIn = false
                                if (sqlite.migrations) {
                                  for (var i=0; i < sqlite.migrations.length; i++) {
                                      var sqlStKey = sqlite.migrations[i].name

                                      for (var j = 0  ;  j < sqlite.migrations[i].up.length  ;  j++ ) {
                                          if ((latestRevision == null) || readIn) {
                                              var sqlSt = sqlite.migrations[i].up[j]
                                              //console.log("sqlSt: = " + sqlSt)
                                              appDb.run(sqlSt);
                                              newLatestRev = sqlStKey
                                          }
                                          if (latestRevision == sqlStKey) {
                                              readIn = true
                                          }
                                      }
                                  }

                                }

                                appDb.run("commit");
                                //appDb.run("PRAGMA wal_checkpoint;")

                                try {
                                    dbsearch.serialize(function() {
                                        dbsearch.run("begin exclusive transaction");
                                        if (results.length == 0) {
                                            stmtInsertAppDDLRevision.run(baseComponentId, newLatestRev)
                                        } else {
                                            if (newLatestRev) {
                                                stmtUpdateLatestAppDDLRevision.run(newLatestRev,baseComponentId)
                                            }
                                        }
                                        dbsearch.run("commit")
                                    })
                                } catch(er) {
                                    console.log(er)
                                }

                          } catch(ewq) {
                                console.log(ewq)
                          }

                     })
                 })
        }
        ,
        sqlite3.OPEN_READONLY)
    } catch (ewr) {
        console.log(ewr)
    }
}







//------------------------------------------------------------------------------
//
//
//
//
//
//------------------------------------------------------------------------------
function fastForwardToLatestRevision(sqlite, baseComponentId) {
    //console.log("fastForwardToLatestRevision    ")
    try {

        dbsearch.serialize(
            function() {
                dbsearch.all(
                    "SELECT  *  from  app_db_latest_ddl_revisions  where  base_component_id = ? ; "
                    ,
                    baseComponentId
                    ,

                    function(err, results)
                    {
                        var latestRevision = null
                        if (results.length > 0) {
                            latestRevision = results[0].latest_revision
                        }
                        var newLatestRev = null
                        var readIn = false
                        for (var i=0; i < sqlite.migrations.length; i+=2) {
                            var sqlStKey = sqlite.migrations[i].name

                            for (var j = 0  ;  j < sqlite.migrations[i].up.length  ;  j++ ) {
                                if ((latestRevision == null) || readIn) {
                                    var sqlSt = sqlite.migrations[i].name
                                    newLatestRev = sqlStKey
                                }
                                if (latestRevision == sqlStKey) {
                                    readIn = true
                                }
                            }
                        }

                        dbsearch.serialize(function() {
                            dbsearch.run("begin exclusive transaction");
                            if (results.length == 0) {
                                stmtInsertAppDDLRevision.run(baseComponentId, newLatestRev)
                            } else {
                                if (newLatestRev) {
                                    stmtUpdateLatestAppDDLRevision.run(newLatestRev,baseComponentId)
                                }
                            }
                            dbsearch.run("commit")
                        })


                 })
        }
        ,
        sqlite3.OPEN_READONLY)
    } catch (ewr) {
        console.log(ewr)
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











//------------------------------------------------------------------------------
//
//
//
//
//
//------------------------------------------------------------------------------
async function saveCodeV2( baseComponentId, parentHash, code , options) {
    if (code) {
        code = code.toString()
    }

    var promise = new Promise(returnFn => {
        //console.log(`function saveCodeV2( ${baseComponentId}, ${parentHash} ) {`)
        if (!baseComponentId) {
            baseComponentId = uuidv1()
        }
        if (!code.toString().substring(0,20).includes("function")) {
            code =
`function() {${code}
}`
        }

        //
        //  Add a link to the parent code
        //
        var lastParentHash = saveHelper.getValueOfCodeString(code,"parent_hash")
        if (lastParentHash != parentHash) {
            if (lastParentHash) {
                code = saveHelper.deleteCodeString(code, "parent_hash")
            }
            if (parentHash) {
                code = saveHelper.insertCodeString(code, "parent_hash", parentHash)
            }
        }







        var oldBaseComp = saveHelper.getValueOfCodeString(code,"base_component_id")


        if (oldBaseComp != baseComponentId ) {
            code = saveHelper.deleteCodeString(code, "base_component_id")
            code = saveHelper.insertCodeString(code, "base_component_id", baseComponentId)
        }

        //console.log("    baseComponentId := " + baseComponentId)


        var creationTimestamp = new Date().getTime()
        // if we don't want to reload this file then don't update the timestamp
        if (saveHelper.getValueOfCodeString(code,"load_once_from_file")) {
            creationTimestamp = -1
        }
        var tvvv = saveHelper.getValueOfCodeString(code, "created_timestamp")
        if (!tvvv) {
            code = saveHelper.deleteCodeString(code, "created_timestamp")
            code = saveHelper.insertCodeString(code, "created_timestamp", creationTimestamp)
        }



        var oncode = "\"app\""
        var eventName = null
        var componentType = null
        var componentOptions = null
        var maxProcesses = 1
        var rowhash = crypto.createHash('sha256');
        var row = code.toString();




        var visibility = null
        var newvisibility = null
        visibility = saveHelper.getValueOfCodeString(code,"visibility")
        newvisibility = visibility
        if (!isValidObject(visibility)) {
            if (isValidObject(options) && options.make_public) {
                newvisibility = "PUBLIC"
            } else {
                newvisibility = "PRIVATE"
            }
        }

        if (newvisibility != visibility) {
            code = saveHelper.deleteCodeString(code, "visibility")
            code = saveHelper.insertCodeString(code, "visibility", newvisibility)
        }



        var logoUrl = saveHelper.getValueOfCodeString(code,"logo_url")
        if (!isValidObject(logoUrl)) {
            logoUrl = "/driver_icons/js.png"
            code = saveHelper.insertCodeString(code, "logo_url", logoUrl)
        }




        var interfaces = ""
        var interfaces2 = saveHelper.getValueOfCodeString(code,"interfaces")
        if (interfaces2 && (interfaces2.length > 0)) {
            for (var rr=0; rr < interfaces2.length; rr ++) {
                interfaces += "|  " + interfaces2[ rr ]
            }
        }



        rowhash.setEncoding('hex');
        rowhash.write(row);
        rowhash.end();
        var sha1sum = rowhash.read();
        //console.log("Save sha1 for :" + baseComponentId + ": " + sha1sum)

        dbsearch.serialize(
            function() {
                dbsearch.all(
                    " select  " +
                    "     id " +
                    " from " +
                    "     system_code " +
                    " where " +
                    "     id = ?;"
                    ,
                    sha1sum
                    ,
                    function(err, rows) {
                        if (!err) {
                            //console.log("rows.length:   " + rows.length)
                            if (rows.length == 0) {
                                try {

                                if (saveHelper.getValueOfCodeString(code,"hide_header")) {
                                    componentOptions = "HIDE_HEADER"
                                }



                                var displayName = saveHelper.getValueOfCodeString(code,"display_name")

                                var useDb = saveHelper.getValueOfCodeString(code,"use_db")
                                var editors2 = saveHelper.getValueOfCodeString(code,"editors")
                                var controlType = saveHelper.getValueOfCodeString(code,"component_type")
                                var controlSubType = saveHelper.getValueOfCodeString(code,"control_sub_type")

                                var editors = null
                                if (editors2) {
                                    editors = JSON.stringify(editors2,null,2)

                                }
                                var readWriteStatus = null
                                var readOnly = saveHelper.getValueOfCodeString(code,"read_only")
                                if (readOnly) {
                                    readWriteStatus = "READ"
                                }
                                var properties = saveHelper.getValueOfCodeString(code,"properties",")//properties")
                                if (properties) {
                                    properties = JSON.stringify(properties,null,2)
                                }
                                if (controlType == "VB") {
                                    //console.log("VB: " + baseComponentId)
                                    let properties2 = saveHelper.getValueOfCodeString(code,"properties",")//properties")
                                    stmtDeleteTypesForComponentProperty.run(baseComponentId)
                                    stmtDeleteAcceptTypesForComponentProperty.run(baseComponentId)
                                    if (properties2) {
                                        //console.log("     properties: " + properties2.length)
                                        for (let rttte = 0; rttte < properties2.length ; rttte++ ) {
                                            let prop = properties2[rttte]
                                            stmtInsertComponentProperty.run(baseComponentId, prop.id)
                                            if (prop.types) {
                                                let labelKeys = Object.keys(prop.types)
                                                for (let rttte2 = 0; rttte2 < labelKeys.length ; rttte2++ ) {
                                                    let prop2 = prop.types[labelKeys[rttte2]]
                                                    //console.log("    " + prop.id + " = " +  JSON.stringify(prop.labels))
                                                    stmtInsertTypesForComponentProperty.run(baseComponentId, prop.id, labelKeys[rttte2],prop2)
                                                //zzz
                                                }
                                            }
                                            if (prop.accept_types) {
                                                let labelKeys = Object.keys(prop.accept_types)
                                                for (let rttte2 = 0; rttte2 < labelKeys.length ; rttte2++ ) {
                                                    let prop2 = prop.accept_types[labelKeys[rttte2]]
                                                    //console.log("    " + prop.id + " = " +  JSON.stringify(prop.labels))
                                                    stmtInsertAcceptTypesForComponentProperty.run(
                                                            baseComponentId,
                                                            prop.id,
                                                            labelKeys[rttte2],
                                                            prop2)
                                                //zzz
                                                }
                                            }
                                        }
                                    }

                                }




                                //
                                // 1) call this first
                                //
                                //console.log("::::" + baseComponentId)


                                function getName(text) {
                                    var resttext = text.match(/([a-zA-Z_{1}][a-zA-Z0-9_]+)(?=\()/g)
                                    var res=null
                                    if (resttext) {
                                        if (resttext[0] != "function") {
                                            res = resttext[0]
                                        }
                                    }

                                    return res
                                }
                                var fnName = getName(code.toString())
                                if (fnName) {
                                    oncode = "\"" + fnName + "\""
                                    eventName = fnName
                                    componentType = "method"
                                }
                                //console.log("fnName: " + fnName)


                                //
                                // 2) and then call this , as apps can also be methods
                                //
                                if (saveHelper.getValueOfCodeString(code,"is_app")) {
                                    componentType = "app"
                                }


                                //console.log("Saving in Sqlite: " + parentHash)
                                //console.log("Saving in Sqlite: " + code)
                                let save_code_to_file = null
                                if (options) {
                                    save_code_to_file = options.save_code_to_file
                                }
                                dbsearch.serialize(async function() {
                                    dbsearch.run("begin exclusive transaction");
                                    stmtInsertNewCode.run(
                                          sha1sum,
                                          parentHash,
                                          "LATEST",
                                          code,
                                          oncode,
                                          baseComponentId,
                                          eventName,
                                          maxProcesses,
                                          componentType,
                                          displayName,
                                          creationTimestamp,
                                          componentOptions,
                                          logoUrl,
                                          newvisibility,
                                          interfaces,
                                          useDb,
                                          editors,
                                          readWriteStatus,
                                          properties,
                                          controlType,
                                          controlSubType,
                                          save_code_to_file
                                          )
                                    stmtDeprecateOldCode.run(
                                        baseComponentId,
                                        sha1sum
                                        )


                                    var restApi = saveHelper.getValueOfCodeString(code, "rest_api")
                                    if (restApi) {
                                        var restMethod = saveHelper.getValueOfCodeString(code, "rest_method")
                                        process.send({
                                                        message_type:       "add_rest_api",
                                                        route:               restApi,
                                                        base_component_id:   baseComponentId,
                                                        rest_method:         restMethod
                                                    });
                                    }


                                    stmtDeleteDependencies.run(sha1sum)

                                    var scriptCode = ""
                                    var jsLibs = saveHelper.getValueOfCodeString(code, "uses_javascript_librararies")
                                    if (jsLibs) {
                                          //console.log(JSON.stringify(jsLibs,null,2))
                                          for (var tt = 0; tt < jsLibs.length ; tt++) {
                                              scriptCode += `libLoaded[ "${jsLibs[tt]}" ] = true;
                                              `
                                              stmtInsertDependency.run(
                                                  uuidv1(),
                                                  sha1sum,
                                                  "js_browser_lib",
                                                  jsLibs[tt],
                                                  "latest")

                                              if ( jsLibs[tt] == "advanced_bundle" ) {
                                                scriptCode += fs.readFileSync( path.join(__dirname, '../public/js_libs/advanced_js_bundle.js') )
                                                scriptCode += `
                                                `
                                              }


                                          }
                                     }
                                     var subComponents = saveHelper.getValueOfCodeString(code, "sub_components")
                                     if (subComponents) {
                                           for (var tt = 0; tt < subComponents.length ; tt++) {
                                               stmtInsertSubComponent.run(
                                                   baseComponentId,
                                                   subComponents[tt])
                                           }
                                      }
                                     var sqliteCode = ""
                                     if (isValidObject(options)) {

                                        //console.log(JSON.stringify(options,null,2))
                                        if (options.sub_components) {
                                            //console.log("Save options: " + options.sub_components.length)
                                            //console.log(JSON.stringify(options,null,2))
                                            for (var tew = 0; tew < options.sub_components.length ; tew ++) {
                                                //console.log("Saving " + options.sub_components[tew])
                                                if (isValidObject(baseComponentId)) {
                                                    stmtInsertSubComponent.run(
                                                        baseComponentId,
                                                        options.sub_components[tew])
                                                }
                                            }
                                        }
                                     }

                                    dbsearch.run("commit", async function() {

                                        });



                                    if (isValidObject(options) && options.save_code_to_file) {
                                        console.log("Saving to file: " + options.save_code_to_file)
    		                            fs.writeFileSync( options.save_code_to_file,  code.toString() )
                                    }




                                    if (isValidObject(options) && options.save_html) {
                                        //
                                        // create the static HTML file to link to on the web/intranet
                                        //
                                        var origFilePath = path.join(__dirname, '../public/go.html')
                                        var newStaticFilePath = path.join( userData, 'apps/' + baseComponentId + '.html' )
                                        var newLocalStaticFilePath = path.join( userData, 'apps/yazz_' + baseComponentId + '.html' )
                                        var newLocalJSPath = path.join( userData, 'apps/yazz_' + baseComponentId + '.yazz' )
                                        var newLocalYazzPath = path.join( userData, 'apps/yazz_' + baseComponentId + '.yazz' )

                                        var newStaticFileContent = fs.readFileSync( origFilePath )

                                        newStaticFileContent = newStaticFileContent.toString().replace("var isStaticHtmlPageApp = false", "var isStaticHtmlPageApp = true")

                                        var newcode = escape( code.toString() )


                                        newStaticFileContent = newStaticFileContent.toString().replace("***STATIC_NAME***",displayName)
                                        newStaticFileContent = newStaticFileContent.toString().replace("***STATIC_NAME***",displayName)
                                        newStaticFileContent = newStaticFileContent.toString().replace("***STATIC_BASE_COMPONENT_ID***",baseComponentId)
                                        newStaticFileContent = newStaticFileContent.toString().replace("***STATIC_BASE_COMPONENT_ID***",baseComponentId)
                                        newStaticFileContent = newStaticFileContent.toString().replace("***STATIC_CODE_ID***",sha1sum)
                                        newStaticFileContent = newStaticFileContent.toString().replace("***STATIC_CODE_ID***",sha1sum)




                                        var newCode =  `cachedCode["${sha1sum}"] = {
                                          "type": "ws_to_browser_callDriverMethod_results",
                                          "value": {
                                            "code": /*APP_START*/unescape(\`${newcode}\`)/*APP_END*/,
                                            "is_code_result": true,
                                            "use_db": ${useDb?"\"" + useDb + "\"":null},
                                            "component_type": \"SYSTEM\",
                                            "libs": [],
                                            "code_id": "${sha1sum}",
                                            "on_condition": "\\\"app\\\"",
                                            "base_component_id": "${baseComponentId}"
                                          },
                                          "seq_num": 0
                                        }

                                        finderToCachedCodeMapping["${baseComponentId}"] = "${sha1sum}"`



                                        newCode += `
                                            //newcodehere
                                        `
                                        dbsearch.serialize(
                                            async function() {
                                                var stmt = dbsearch.all(
                                                    `select
                                                        system_code.id as sha1,
                                                        child_component_id,
                                                        code
                                                    from
                                                        component_usage,
                                                        system_code
                                                    where
                                                        component_usage.base_component_id = ?
                                                    and
                                                        system_code.base_component_id = component_usage.child_component_id
                                                    and
                                                        code_tag = 'LATEST'
                                                        `,

                                                         [  baseComponentId  ],

                                                async function(err, results)
                                                {
                                                        for (var i = 0  ;   i < results.length;    i ++ ) {
                                                            var newcodeEs = escape("(" + results[i].code.toString() + ")")
                                                            var newCode2 =  `cachedCode["${results[i].sha1}"] = {
                                                              "type": "ws_to_browser_callDriverMethod_results",
                                                              "value": {
                                                                "code": unescape(\`${newcodeEs}\`),
                                                                "is_code_result": true,
                                                                "use_db": ${useDb?"\"" + useDb + "\"":null},
                                                                "libs": [],
                                                                "component_type": \"SYSTEM\",
                                                                "code_id": "${results[i].sha1}",
                                                                "on_condition": "\\\"app\\\"",
                                                                "base_component_id": "${results[i].child_component_id}"
                                                              },
                                                              "seq_num": 0
                                                            }

                                                            finderToCachedCodeMapping["${results[i].child_component_id}"] = "${results[i].sha1}"
                                                            `
                                                            newCode += newCode2
                                                        }
                                                        newStaticFileContent = newStaticFileContent.toString().replace("//***ADD_STATIC_CODE", newCode)



                                                        newStaticFileContent = saveHelper.replaceBetween(newStaticFileContent, "/*static_hostname_start*/","/*static_hostname_end*/","'"+hostaddress+"'")
                                                        newStaticFileContent = saveHelper.replaceBetween(newStaticFileContent, "/*static_port_start*/","/*static_port_end*/",port)

                                                        //
                                                        // we use "slice" here as string replace doesn't work with large strings (over 1MB) and most of the aframe and js
                                                        // code we insert is LARGE!!
                                                        //
                                                        var pos = newStaticFileContent.indexOf("//***ADD_SCRIPT")
                                                        newStaticFileContent = newStaticFileContent.slice(0, pos)  + scriptCode + newStaticFileContent.slice( pos)


                                                        //fs.writeFileSync( path.join(__dirname, '../public/sql2.js'),  sqliteCode )
                                                        fs.writeFileSync( newStaticFilePath,  newStaticFileContent )



                                                        //
                                                        // save the standalone app
                                                        //
                                                        sqliteCode = fs.readFileSync( path.join(__dirname, '../public/sql.js') )
                                                        var indexOfSqlite = newStaticFileContent.indexOf("//SQLITE")
                                                        newStaticFileContent = newStaticFileContent.substring(0,indexOfSqlite) +
                                                                                    sqliteCode +
                                                                                        newStaticFileContent.substring(indexOfSqlite)
                                                        newStaticFileContent = saveHelper.replaceBetween(newStaticFileContent, "/*use_local_sqlite_start*/","/*use_local_sqlite_end*/","var localAppshareApp = true")




                                                        var sqliteAppDbPath = path.join( userData, 'app_dbs/' + baseComponentId + '.visi' )

                                                        if (fs.existsSync(sqliteAppDbPath)) {
                                                            var sqliteAppDbContent = fs.readFileSync( sqliteAppDbPath , 'base64')
                                                            var indexOfSqliteData = newStaticFileContent.indexOf("var sqlitedata = ''")


                                                            newStaticFileContent = newStaticFileContent.substring(0,indexOfSqliteData + 17) +
                                                                                        "'" + sqliteAppDbContent + "'//sqlitedata" +
                                                                                            newStaticFileContent.substring(indexOfSqliteData + 19)

                                                        }

                                                        fs.writeFileSync( newLocalStaticFilePath,  newStaticFileContent )
                                                        fs.writeFileSync( newLocalJSPath,  code )
                                                        fs.writeFileSync( newLocalYazzPath,  code )

                                                        })
                                           }
                                     , sqlite3.OPEN_READONLY)
                                 }









                                    //
                                    // save the app db
                                    //
                                    var sqlite = saveHelper.getValueOfCodeString(code, "sqlite",")//sqlite")
                                    if (sqlite) {
                                        if (isValidObject(options) && options.copy_db_from) {

                                            var newBaseid = baseComponentId
                                            //
                                            // copy the database
                                            //
                                            var sqliteAppDbPathOld = path.join( userData, 'app_dbs/' + options.copy_db_from + '.visi' )
                                            var sqliteAppDbPathNew = path.join( userData, 'app_dbs/' + newBaseid + '.visi' )
                                            //console.log("sqliteAppDbPathOld: " + sqliteAppDbPathOld)
                                            //console.log("sqliteAppDbPathNew: " + sqliteAppDbPathNew)
                                            copyFile(sqliteAppDbPathOld,sqliteAppDbPathNew, async function(){

                                            });
                                            dbsearch.serialize(function() {
                                                dbsearch.run("begin exclusive transaction");
                                                copyMigration.run(  newBaseid,  options.copy_db_from)
                                                dbsearch.run("commit");
                                                })

                                        } else if (isValidObject(options) && options.fast_forward_database_to_latest_revision) {
                                            fastForwardToLatestRevision(sqlite, baseComponentId)

                                        } else {
                                            //console.log('updateRevisions(sqlite, baseComponentId)')
                                            //console.log('    ' + JSON.stringify(options,null,2))
                                            updateRevisions(sqlite, baseComponentId)
                                        }

                                    }
                                    //
                                    // END OF save app db
                                    //



                                    updateRegistry(options, sha1sum)
                                    returnFn( {
                                                    code:               code.toString(),
                                                    code_id:            sha1sum,
                                                    base_component_id:  baseComponentId
                                                    })

                                })
                                } catch(err) {
                                    console.log(err)
                                }

                            //
                            // otherwise we only update the static file if our IP address has changed
                            //
                            } else {
                                if (options && options.save_html) {
                                    var oldStaticFilePath = path.join( userData, 'apps/' + baseComponentId + '.html' )
    								if (fs.existsSync(oldStaticFilePath)) {
    									var oldStaticFileContent = fs.readFileSync( oldStaticFilePath )

    									var oldHostname = saveHelper.getValueOfCodeString(oldStaticFileContent, "/*static_hostname_start*/","/*static_hostname_end*/")
    									var oldPort = saveHelper.getValueOfCodeString(oldStaticFileContent, "/*static_port_start*/","/*static_port_end*/")

    									if ((oldHostname != hostaddress) || (oldPort != port)) {
    										var newStaticFileContent = oldStaticFileContent.toString()
    										newStaticFileContent = saveHelper.replaceBetween(newStaticFileContent, "/*static_hostname_start*/","/*static_hostname_end*/","'"+hostaddress+"'")
    										newStaticFileContent = saveHelper.replaceBetween(newStaticFileContent, "/*static_port_start*/","/*static_port_end*/",port)
    										fs.writeFileSync( oldStaticFilePath,  newStaticFileContent )
    									}
    								}
                                }

                                updateRegistry(options, sha1sum)
                                returnFn( {
                                                code:               code.toString(),
                                                code_id:            sha1sum,
                                                base_component_id:  baseComponentId
                                                })
                            }
                        }


                    })
        }, sqlite3.OPEN_READONLY)
        })

    var ret = await promise;
    return ret
}
