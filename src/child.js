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


var sqlite3                     = require(path.join(nodeModulesPath,'node_modules/sqlite3'));
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
          " insert into   system_code  (id, parent_id, code_tag, code,on_condition, base_component_id, method, max_processes,component_scope,display_name, creation_timestamp,component_options, logo_url, visibility, interfaces,use_db, editors, read_write_status,properties, component_type, control_sub_type) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
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





      } else if (msg.message_type == "save_code") {

              saveCodeV2(  msg.base_component_id, msg.parent_hash  ,  msg.code  , msg.options);




    } else if (msg.message_type == "save_code_from_upload") {
        //console.log(`Entering  save_code_from_upload`)


        var asyy = async function() {
            var ret = await saveCodeV2(  msg.base_component_id, msg.parent_hash  ,  msg.code  , msg.options);
            var useDb = msg.base_component_id //saveHelper.getValueOfCodeString(msg.code ,"use_db")
            if (msg.sqlite_data) {
                    //console.log("msg.sqlite_data: " + msg.sqlite_data)
                    var b = Buffer.from(msg.sqlite_data, 'base64')
                    //console.log("use_db: " + useDb)
                    var sqliteAppDbPath = path.join( userData, 'app_dbs/' + msg.base_component_id + '.visi' )
                    fs.writeFileSync(sqliteAppDbPath, b);

            }

            process.send(
                {
                    message_type:           'ipc_child_returning_uploaded_app_as_file_in_child_response',
                    code_id:                 ret.code_id,
                    base_component_id:       ret.base_component_id,
                    client_file_upload_id:   msg.client_file_upload_id
                })
        }
        asyy()







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



    } else if (msg.message_type == 'setUpPredefinedComponents') {
        setUpComponentsLocally();








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
async function evalLocalSystemDriver(driverName, location, options) {
    outputDebug("*** Loading driver: *** : " + driverName)
    try {
        var evalDriver = fs.readFileSync(location);
    	await addOrUpdateDriver(driverName, evalDriver,options)
    } catch (error) {
        outputDebug(error)
    }

}












//------------------------------------------------------------------------------
//
//
//
//
//
//------------------------------------------------------------------------------
async function setUpComponentsLocally() {
    //await evalLocalSystemDriver('glb',                    path.join(__dirname, '../public/visifile_drivers/glb.js'),{username: "default", reponame: "", version: "latest"})
    //await evalLocalSystemDriver('csv',                    path.join(__dirname, '../public/visifile_drivers/csv.js'),{username: "default", reponame: "", version: "latest"})
    //await evalLocalSystemDriver('txt',                    path.join(__dirname, '../public/visifile_drivers/glb.js'),{username: "default", reponame: "", version: "latest"})
    //await evalLocalSystemDriver('excel',                  path.join(__dirname, '../public/visifile_drivers/excel.js'),{username: "default", reponame: "", version: "latest"})
    //await evalLocalSystemDriver('word',                   path.join(__dirname, '../public/visifile_drivers/word.js'),{username: "default", reponame: "", version: "latest"})
    //await evalLocalSystemDriver('pdf',                    path.join(__dirname, '../public/visifile_drivers/pdf.js'),{username: "default", reponame: "", version: "latest"})

    //await evalLocalSystemDriver('outlook2012',            path.join(__dirname, '../public/visifile_drivers/outlook2012.js'),{username: "default", reponame: "", version: "latest"})
    //await evalLocalSystemDriver('outlook2010')
    //await evalLocalSystemDriver('sqlite',                 path.join(__dirname, '../public/visifile_drivers/sqlite.js'),{username: "default", reponame: "", version: "latest"})
    //await evalLocalSystemDriver('mysql',                  path.join(__dirname, '../public/visifile_drivers/mysql.js'),{username: "default", reponame: "", version: "latest"})
    //await evalLocalSystemDriver('oracle',                 path.join(__dirname, '../public/visifile_drivers/oracle.js'),{username: "default", reponame: "", version: "latest"})
    //await evalLocalSystemDriver('testdriver',             path.join(__dirname, '../public/visifile_drivers/testdriver.js'),{username: "default", reponame: "", version: "latest"})

    //await evalLocalSystemDriver('fileuploader',           path.join(__dirname, '../public/visifile_drivers/file_uploader.js'),{username: "default", reponame: "", version: "latest"})



    //
    // services
    //
    if (isWin) {
        //await evalLocalSystemDriver('powershell',         path.join(__dirname, '../public/visifile_drivers/services/powershell.js'),{username: "default", reponame: "", version: "latest"})
    }
    await evalLocalSystemDriver('commandLine',              path.join(__dirname, '../public/visifile_drivers/services/commandLine.js'),{username: "default", reponame: "commandLine", version: "latest"})
    await evalLocalSystemDriver('commandLine2',             path.join(__dirname, '../public/visifile_drivers/services/commandLine2.js'),{username: "default", reponame: "commandLine2", version: "latest"})
    await evalLocalSystemDriver('copyApp',                  path.join(__dirname, '../public/visifile_drivers/services/copyApp.js'),{username: "default", reponame: "copyApp", version: "latest"})
    await evalLocalSystemDriver('test_job',                 path.join(__dirname, '../public/visifile_drivers/services/test_job.js'),{username: "default", reponame: "test_job", version: "latest"})
    await evalLocalSystemDriver('kafka_service',            path.join(__dirname, '../public/visifile_drivers/services/kafka_service.js'),{username: "default", reponame: "kafka_service", version: "latest"})

    await evalLocalSystemDriver('activemq_service',            path.join(__dirname, '../public/visifile_drivers/services/activemq_service.js'),{username: "default", reponame: "activemq_service", version: "latest"})


    await evalLocalSystemDriver('findComponentsImplementing',            path.join(__dirname, '../public/visifile_drivers/services/find_components_implementing.js'),{username: "default", reponame: "find_components_implementing", version: "latest"})



    //await evalLocalSystemDriver('webPreview',             path.join(__dirname, '../public/visifile_drivers/services/web_preview.js'),{username: "default", reponame: "", version: "latest"})

    //await evalLocalSystemDriver('spreahsheetPreview',     path.join(__dirname, '../public/visifile_drivers/services/spreadsheet_preview.js'),{username: "default", reponame: "", version: "latest"})
    //await evalLocalSystemDriver('csvPreview',             path.join(__dirname, '../public/visifile_drivers/services/csv_preview.js'),{username: "default", reponame: "", version: "latest"})
    //await evalLocalSystemDriver('docPreview',             path.join(__dirname, '../public/visifile_drivers/services/doc_preview.js'),{username: "default", reponame: "", version: "latest"})



    await evalLocalSystemDriver('serverDriveList',   path.join(__dirname, '../public/visifile_drivers/services/serverDriveList.js'),{username: "default", reponame: "serverDriveList", version: "latest"})
    await evalLocalSystemDriver('serverFolderHierarchyList',   path.join(__dirname, '../public/visifile_drivers/services/serverFolderHierarchyList.js'),{username: "default", reponame: "serverFolderHierarchyList", version: "latest"})
    await evalLocalSystemDriver('serverGetHomeDir',   path.join(__dirname, '../public/visifile_drivers/services/serverGetHomeDir.js'),{username: "default", reponame: "serverGetHomeDir", version: "latest"})
    await evalLocalSystemDriver('serverFileList',   path.join(__dirname, '../public/visifile_drivers/services/serverFileList.js'),{username: "default", reponame: "serverFileList", version: "latest"})
    await evalLocalSystemDriver('serverFolderContents',   path.join(__dirname, '../public/visifile_drivers/services/serverFolderContents.js'),{username: "default", reponame: "serverFolderContents", version: "latest"})
    await evalLocalSystemDriver('serverFolderContentsV2',   path.join(__dirname, '../public/visifile_drivers/services/serverFolderContentsV2.js'),{username: "default", reponame: "serverFolderContentsV2", version: "latest"})


    await evalLocalSystemDriver('serverDatabaseStuff',   path.join(__dirname, '../public/visifile_drivers/services/serverDatabaseStuff.js'),{username: "default", reponame: "serverDatabaseStuff", version: "latest"})
    await evalLocalSystemDriver('serverDockerStuff',   path.join(__dirname, '../public/visifile_drivers/services/serverDockerStuff.js'),{username: "default", reponame: "serverDockerStuff", version: "latest"})
    await evalLocalSystemDriver('serverTerminalStuff',   path.join(__dirname, '../public/visifile_drivers/services/serverTerminalStuff.js'),{username: "default", reponame: "serverTerminalStuff", version: "latest"})

    await evalLocalSystemDriver('postgres_server',   path.join(__dirname, '../public/visifile_drivers/services/postgres_server.js'),{username: "default", reponame: "postgres_server", version: "latest"})

    await evalLocalSystemDriver('sqlite_server',   path.join(__dirname, '../public/visifile_drivers/services/sqlite_server.js'),{username: "default", reponame: "sqlite_server", version: "latest"})

    await evalLocalSystemDriver('access_server',   path.join(__dirname, '../public/visifile_drivers/services/access_server.js'),{username: "default", reponame: "access_server", version: "latest"})
    await evalLocalSystemDriver('excel_server',   path.join(__dirname, '../public/visifile_drivers/services/excel_server.js'),{username: "default", reponame: "excel_server", version: "latest"})

    await evalLocalSystemDriver('rest_call_service',   path.join(__dirname, '../public/visifile_drivers/services/rest_call_service.js'),{username: "default", reponame: "rest_call_service", version: "latest"})
    await evalLocalSystemDriver('rest_call_service_v2',   path.join(__dirname, '../public/visifile_drivers/services/rest_call_service_v2.js'),{username: "default", reponame: "rest_call_service_v2", version: "latest"})
    await evalLocalSystemDriver('json_traverse_service',   path.join(__dirname, '../public/visifile_drivers/services/json_traverse_service.js'),{username: "default", reponame: "json_traverse_service", version: "latest"})
    await evalLocalSystemDriver('json_filter_service',   path.join(__dirname, '../public/visifile_drivers/services/json_filter_service.js'),{username: "default", reponame: "json_filter_service", version: "latest"})


    //
    // debug controls
    //
    //await evalLocalSystemDriver('bug_vue',   path.join(__dirname, '../public/visifile_drivers/controls/bug_vue.js'),{username: "default", reponame: "bug_vue", version: "latest"})

    //
    // controls
    //
    await evalLocalSystemDriver('chart_control',   path.join(__dirname, '../public/visifile_drivers/controls/chart.js'),{username: "default", reponame: "chart_control", version: "latest"})

    await evalLocalSystemDriver('image_control',   path.join(__dirname, '../public/visifile_drivers/controls/image.js'),{username: "default", reponame: "image_control", version: "latest"})

    await evalLocalSystemDriver('label_control',   path.join(__dirname, '../public/visifile_drivers/controls/label.js'),{username: "default", reponame: "label_control", version: "latest"})
    await evalLocalSystemDriver('input_control',   path.join(__dirname, '../public/visifile_drivers/controls/input.js'),{username: "default", reponame: "input_control", version: "latest"})

    await evalLocalSystemDriver('group_control',   path.join(__dirname, '../public/visifile_drivers/controls/group.js'),{username: "default", reponame: "group_control", version: "latest"})
    await evalLocalSystemDriver('button_control',   path.join(__dirname, '../public/visifile_drivers/controls/button.js'),{username: "default", reponame: "button_control", version: "latest"})

    await evalLocalSystemDriver('checkbox_control',   path.join(__dirname, '../public/visifile_drivers/controls/checkbox.js'),{username: "default", reponame: "checkbox_control", version: "latest"})
    await evalLocalSystemDriver('radio_button_control',   path.join(__dirname, '../public/visifile_drivers/controls/radiobutton.js'),{username: "default", reponame: "radio_button_control", version: "latest"})

    await evalLocalSystemDriver('dropdown_control',   path.join(__dirname, '../public/visifile_drivers/controls/dropdown.js'),{username: "default", reponame: "dropdown_control", version: "latest"})
    await evalLocalSystemDriver('list_control',   path.join(__dirname, '../public/visifile_drivers/controls/list.js'),{username: "default", reponame: "list_control", version: "latest"})

    await evalLocalSystemDriver('horiz_scroll_control',   path.join(__dirname, '../public/visifile_drivers/controls/horiz_scroll.js'),{username: "default", reponame: "horiz_scroll_control", version: "latest"})
    await evalLocalSystemDriver('vert_scroll_control',   path.join(__dirname, '../public/visifile_drivers/controls/vert_scroll.js'),{username: "default", reponame: "vert_scroll_control", version: "latest"})


    await evalLocalSystemDriver('timer_control',   path.join(__dirname, '../public/visifile_drivers/controls/timer.js'),{username: "default", reponame: "timer_control", version: "latest"})
    await evalLocalSystemDriver('drive_list_control',   path.join(__dirname, '../public/visifile_drivers/controls/drive_list.js'),{username: "default", reponame: "drive_list_control", version: "latest"})

    await evalLocalSystemDriver('folder_list_control',   path.join(__dirname, '../public/visifile_drivers/controls/folder_list.js'),{username: "default", reponame: "folder_list_control", version: "latest"})
    await evalLocalSystemDriver('file_list_control',   path.join(__dirname, '../public/visifile_drivers/controls/file_list.js'),{username: "default", reponame: "file_list_control", version: "latest"})

    await evalLocalSystemDriver('shapes_control',   path.join(__dirname, '../public/visifile_drivers/controls/shapes.js'),{username: "default", reponame: "shapes_control", version: "latest"})
    await evalLocalSystemDriver('line_control',   path.join(__dirname, '../public/visifile_drivers/controls/line.js'),{username: "default", reponame: "line_control", version: "latest"})

    await evalLocalSystemDriver('draw_control',   path.join(__dirname, '../public/visifile_drivers/controls/draw.js'),{username: "default", reponame: "draw_control", version: "latest"})
    await evalLocalSystemDriver('database_control',   path.join(__dirname, '../public/visifile_drivers/controls/database.js'),{username: "default", reponame: "database_control", version: "latest"})
    await evalLocalSystemDriver('mixer_control',   path.join(__dirname, '../public/visifile_drivers/controls/mixer.js'),{username: "default", reponame: "mixer_control", version: "latest"})


    await evalLocalSystemDriver('ms_access_control',   path.join(__dirname, '../public/visifile_drivers/controls/ms_access.js'),{username: "default", reponame: "ms_access_control", version: "latest"})
    await evalLocalSystemDriver('ms_excel_control',   path.join(__dirname, '../public/visifile_drivers/controls/ms_excel.js'),{username: "default", reponame: "ms_excel_control", version: "latest"})


    await evalLocalSystemDriver('data_window_control',   path.join(__dirname, '../public/visifile_drivers/controls/data_window.js'),{username: "default", reponame: "data_window_control", version: "latest"})

    await evalLocalSystemDriver('ace_editor',   path.join(__dirname, '../public/visifile_drivers/controls/ace_editor.js'),{username: "default", reponame: "ace_editor", version: "latest"})


    await evalLocalSystemDriver('container_3d',        path.join(__dirname, '../public/visifile_drivers/controls/container_3d.js'),{username: "default", reponame: "container_3d", version: "latest"})
    await evalLocalSystemDriver('item_3d',   path.join(__dirname, '../public/visifile_drivers/controls/item_3d.js'),{username: "default", reponame: "item_3d", version: "latest"})


    await evalLocalSystemDriver('terminal_control',   path.join(__dirname, '../public/visifile_drivers/controls/terminal_ui.js'),{username: "default", reponame: "terminal_control", version: "latest"})
    await evalLocalSystemDriver('osquery_control',   path.join(__dirname, '../public/visifile_drivers/controls/osquery_ui.js'),{username: "default", reponame: "osquery_control", version: "latest"})
    await evalLocalSystemDriver('rest_control',   path.join(__dirname, '../public/visifile_drivers/controls/rest_ui.js'),{username: "default", reponame: "rest_control", version: "latest"})
    await evalLocalSystemDriver('tree_to_table_control',   path.join(__dirname, '../public/visifile_drivers/controls/tree_to_table.js'),{username: "default", reponame: "tree_to_table_control", version: "latest"})
    await evalLocalSystemDriver('docker_control',   path.join(__dirname, '../public/visifile_drivers/controls/ducker.js'),{username: "default", reponame: "docker_control", version: "latest"})
    await evalLocalSystemDriver('table_control',   path.join(__dirname, '../public/visifile_drivers/controls/table.js'),{username: "default", reponame: "table_control", version: "latest"})



    await evalLocalSystemDriver('rh3scale_control',   path.join(__dirname, '../public/visifile_drivers/controls/rh3scale.js'),{username: "default", reponame: "rh3scale_control", version: "latest"})
    await evalLocalSystemDriver('kubernetes_control',   path.join(__dirname, '../public/visifile_drivers/controls/kubernetes.js'),{username: "default", reponame: "kubernetes_control", version: "latest"})
    await evalLocalSystemDriver('kafka_control',   path.join(__dirname, '../public/visifile_drivers/controls/kafka.js'),{username: "default", reponame: "kafka_control", version: "latest"})
    //await evalLocalSystemDriver('rhfuse_control',   path.join(__dirname, '../public/visifile_drivers/controls/rhfuse.js'),{username: "default", reponame: "", version: "latest"})
    //await evalLocalSystemDriver('rhamq_control',   path.join(__dirname, '../public/visifile_drivers/controls/rhamq.js'),{username: "default", reponame: "", version: "latest"})
    await evalLocalSystemDriver('rhdm_control',   path.join(__dirname, '../public/visifile_drivers/controls/rhdm.js'),{username: "default", reponame: "", version: "latest"})
    //await evalLocalSystemDriver('rhpam_control',   path.join(__dirname, '../public/visifile_drivers/controls/rhpam.js'),{username: "default", reponame: "", version: "latest"})
    //await evalLocalSystemDriver('rhdata_grid_control',   path.join(__dirname, '../public/visifile_drivers/controls/rhdata_grid.js'),{username: "default", reponame: "", version: "latest"})
    //await evalLocalSystemDriver('rhopenshift_control',   path.join(__dirname, '../public/visifile_drivers/controls/rhopenshift.js'),{username: "default", reponame: "", version: "latest"})




    //
    // forms
    //
    await evalLocalSystemDriver('form_subscribe_to_appshare',   path.join(__dirname, '../public/visifile_drivers/apps/formSubscribeToAppshare.js'),{username: "default", reponame: "form_subscribe_to_appshare", version: "latest"})



    //
    // functions
    //

    await evalLocalSystemDriver('systemFunctions',   path.join(__dirname, '../public/visifile_drivers/functions/system.js'),{username: "default", reponame: "systemFunctions", version: "latest"})
    await evalLocalSystemDriver('systemFunctions2',   path.join(__dirname, '../public/visifile_drivers/functions/system2.js'),{username: "default", reponame: "systemFunctions2", version: "latest"})
    await evalLocalSystemDriver('systemFunctions3',   path.join(__dirname, '../public/visifile_drivers/functions/system3.js'),{username: "default", reponame: "systemFunctions3", version: "latest"})
    await evalLocalSystemDriver('systemFunctionAppSql',   path.join(__dirname, '../public/visifile_drivers/functions/systemFunctionAppSql.js'),{username: "default", reponame: "systemFunctionAppSql", version: "latest"})
    await evalLocalSystemDriver('appEditorV2SaveCode',   path.join(__dirname, '../public/visifile_drivers/apps/appEditorV2SaveCode.js'),{username: "default", reponame: "appEditorV2SaveCode", version: "latest"})

    //
    // UI components
    //
    await evalLocalSystemDriver('comp',   path.join(__dirname, '../public/visifile_drivers/ui_components/comp.js'),{username: "default", reponame: "comp", version: "latest"})
    await evalLocalSystemDriver('editor_component',   path.join(__dirname, '../public/visifile_drivers/ui_components/editorComponent.js'),{username: "default", reponame: "editor_component", version: "latest"})
    await evalLocalSystemDriver('sqlite_editor_component',   path.join(__dirname, '../public/visifile_drivers/ui_components/sqliteEditorComponent.js'),{username: "default", reponame: "sqlite_editor_component", version: "latest"})
    await evalLocalSystemDriver('keycloak_editor_component',   path.join(__dirname, '../public/visifile_drivers/ui_components/keycloakEditorComponent.js'),{username: "default", reponame: "keycloak_editor_component", version: "latest"})
    await evalLocalSystemDriver('export_editor_component',   path.join(__dirname, '../public/visifile_drivers/ui_components/exportEditorComponent.js'),{username: "default", reponame: "export_editor_component", version: "latest"})
    await evalLocalSystemDriver('form_editor_component',   path.join(__dirname, '../public/visifile_drivers/ui_components/formEditorComponent.js'),{username: "default", reponame: "form_editor_component", version: "latest"})
    await evalLocalSystemDriver('simple_display_editor_component',   path.join(__dirname, '../public/visifile_drivers/ui_components/simpleDisplayEditorComponent.js'),{username: "default", reponame: "simple_display_editor_component", version: "latest"})
    await evalLocalSystemDriver('vb_editor_component',   path.join(__dirname, '../public/visifile_drivers/ui_components/vbEditorComponent.js'),{username: "default", reponame: "vb_editor_component", version: "latest"})

    outputDebug("Loaded all drivers")







    //
    // apps
    //
    await evalLocalSystemDriver('homepage',     path.join(__dirname, '../public/visifile_drivers/apps/homepage.js'),{save_html: true, username: "default", reponame: "homepage", version: "latest"})
    await evalLocalSystemDriver('appstore',     path.join(__dirname, '../public/visifile_drivers/apps/appstore.js'),{save_html: true, username: "default", reponame: "appstore", version: "latest"})
    await evalLocalSystemDriver('vb_blank',   path.join(__dirname, '../public/visifile_drivers/apps/vb_blank.js'),{username: "default", reponame: "vb_blank", version: "latest"})



    await evalLocalSystemDriver('app_editor_3',   path.join(__dirname, '../public/visifile_drivers/apps/appEditorV3.js'),{username: "default", reponame: "app_editor_3", version: "latest"})
    await evalLocalSystemDriver('appEmbed',   path.join(__dirname, '../public/visifile_drivers/apps/appEmbed.js'),{username: "default", reponame: "appEmbed", version: "latest"})
    await evalLocalSystemDriver('search',   path.join(__dirname, '../public/visifile_drivers/apps/search.js'),{username: "default", reponame: "search", version: "latest"})
    await evalLocalSystemDriver('test',   path.join(__dirname, '../public/visifile_drivers/apps/test.js'),{save_html: true, username: "default", reponame: "test", version: "latest"})
    await evalLocalSystemDriver('oculus_go',   path.join(__dirname, '../public/visifile_drivers/apps/oculus_go.js'),{save_html: true, username: "default", reponame: "oculus_go", version: "latest"})
    await evalLocalSystemDriver('game',   path.join(__dirname, '../public/visifile_drivers/apps/game.js'),{save_html: true, username: "default", reponame: "game", version: "latest"})
    await evalLocalSystemDriver('multi_vr',   path.join(__dirname, '../public/visifile_drivers/apps/multi_vr.vjs'),{save_html: true, username: "default", reponame: "multi_vr", version: "latest"})
    await evalLocalSystemDriver('hologram',   path.join(__dirname, '../public/visifile_drivers/apps/hologram.js'),{save_html: true, username: "default", reponame: "hologram", version: "latest"})
    //await evalLocalSystemDriver('kinetic',   path.join(__dirname, '../public/visifile_drivers/apps/kinetic.js'),{save_html: true, username: "default", reponame: "", version: "latest"})
    await evalLocalSystemDriver('intro_logo_3d',   path.join(__dirname, '../public/visifile_drivers/apps/intro_logo_3d.js'),{save_html: true, username: "default", reponame: "intro_logo_3d", version: "latest"})
    await evalLocalSystemDriver('list_apps',   path.join(__dirname, '../public/visifile_drivers/apps/listApps.js'),{username: "default", reponame: "list_apps", version: "latest"})
    await evalLocalSystemDriver('listPublicApps',   path.join(__dirname, '../public/visifile_drivers/apps/listPublicApps.js'),{username: "default", reponame: "listPublicApps", version: "latest"})
    await evalLocalSystemDriver('vue',   path.join(__dirname, '../public/visifile_drivers/apps/vue.js'),{username: "default", reponame: "vue", version: "latest"})
    await evalLocalSystemDriver('bootstrap',   path.join(__dirname, '../public/visifile_drivers/apps/bootstrap.js'),{username: "default", reponame: "bootstrap", version: "latest"})
    await evalLocalSystemDriver('database_reader',   path.join(__dirname, '../public/visifile_drivers/apps/databaseReader.js'),{username: "default", reponame: "database_reader", version: "latest"})
    await evalLocalSystemDriver('todo',   path.join(__dirname, '../public/visifile_drivers/apps/todo.js'),{save_html: true, username: "default", reponame: "todo", version: "latest"})
    await evalLocalSystemDriver('todo_app_reader',   path.join(__dirname, '../public/visifile_drivers/apps/todo_app_reader.js'),{username: "default", reponame: "todo_app_reader", version: "latest"})
    await evalLocalSystemDriver('newSql',   path.join(__dirname, '../public/visifile_drivers/apps/newSqlApp.js'),{username: "default", reponame: "newSql", version: "latest"})
    await evalLocalSystemDriver('yazzcraft',   path.join(__dirname, '../public/visifile_drivers/apps/yazzcraft.js'),{save_html: true, username: "default", reponame: "yazzcraft", version: "latest"})


//database drivers
await evalLocalSystemDriver('postgres_client_component', path.join(__dirname, '../public/visifile_drivers/controls/postgres.js'),{username: "default", reponame: "postgres_client_component", version: "latest"})
await evalLocalSystemDriver('sqlite_client_component', path.join(__dirname, '../public/visifile_drivers/controls/sqlite.js'),{username: "default", reponame: "sqlite_client_component", version: "latest"})
await evalLocalSystemDriver('mysql_client_component', path.join(__dirname, '../public/visifile_drivers/controls/mysql.js'),{username: "default", reponame: "mysql_client_component", version: "latest"})





    var extraFns = fs.readFileSync( path.join(__dirname, '../src/extraFns.js') ).toString()
    outputDebug("Extra functions code:" )

    await eval("(" + extraFns + "())")

    //
    // non GUI front end apps
    //
    await evalLocalSystemDriver('rh3scale_app',   path.join(__dirname, '../public/visifile_drivers/apps/rh3scale_app.js'),{save_html: true, username: "default", reponame: "rh3scale_app", version: "latest"})
    await evalLocalSystemDriver('quicksort',  path.join(__dirname, '../public/visifile_drivers/apps/quicksort.js'),{save_html: true, username: "default", reponame: "quicksort", version: "latest"})
    await evalLocalSystemDriver('bubblesort', path.join(__dirname, '../public/visifile_drivers/apps/bubblesort.js'),{save_html: true, username: "default", reponame: "bubblesort", version: "latest"})
    await evalLocalSystemDriver('new', path.join(__dirname, '../public/visifile_drivers/apps/blank_app.js'),{save_html: true, username: "default", reponame: "new", version: "latest"})
    await evalLocalSystemDriver('new_microservice', path.join(__dirname, '../public/visifile_drivers/apps/blank_microservice.js'),{save_html: true, username: "default", reponame: "new_microservice", version: "latest"})
    await evalLocalSystemDriver('demo_microservice', path.join(__dirname, '../public/visifile_drivers/apps/demo_microservice.js'),{save_html: true, username: "default", reponame: "demo_microservice", version: "latest"})
    await evalLocalSystemDriver('echo_microservice', path.join(__dirname, '../public/visifile_drivers/apps/echo_microservice.js'),{save_html: true, username: "default", reponame: "echo_microservice", version: "latest"})
    await evalLocalSystemDriver('call_function_microservice', path.join(__dirname, '../public/visifile_drivers/apps/call_function_microservice.js'),{save_html: true, username: "default", reponame: "call_function_microservice", version: "latest"})
    await evalLocalSystemDriver('echo_post_microservice', path.join(__dirname, '../public/visifile_drivers/apps/echo_post_microservice.js'),{save_html: true, username: "default", reponame: "echo_post_microservice", version: "latest"})
    outputDebug("Loaded all apps (may use already loaded drivers)")






    process.send({  message_type:       "drivers_loaded_by_child"                 });

}












//------------------------------------------------------------------------------
//
//
//
//
//
//------------------------------------------------------------------------------
async function addOrUpdateDriver(  name, codeString ,options ) {
    //console.log('addOrUpdateDriver: ' + name);

    var promise = new Promise(async function(returnfn) {

        dbsearch.serialize(
            function() {
                dbsearch.all(
                    " select  " +
                    "     base_component_id, code, id " +
                    " from " +
                    "     system_code " +
                    " where " +
                    "     base_component_id = ? and code_tag = 'LATEST';"
                    ,
                    name
                    ,
                    async function(err, rows) {
                        if (!err) {
                            try {
                                var parentId = null
                                if (rows.length > 0) {
                                    parentId = rows[0].id
                                }

                                await saveCodeV2(  name, parentId,    codeString  ,options);



                              } catch(err) {
                                  console.log(err);
                                  var stack = new Error().stack
                                  console.log( stack )
                              } finally {
                                returnfn({})
                              }

                  }
              }
          );
      }, sqlite3.OPEN_READONLY)
  })
  var ret = await promise
  return ret
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
                                          controlSubType
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
                                        var newLocalJSPath = path.join( userData, 'apps/yazz_' + baseComponentId + '.vjs' )
                                        var newLocalYazzPath = path.join( userData, 'apps/yazz_' + baseComponentId + '.vjs' )

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
