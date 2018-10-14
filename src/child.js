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
var open            = require('opn');
var tdeval
var toeval;
var userData
var childProcessName

var isWin                               = /^win/.test(process.platform);
var inScan                              = false;
var stmt2                               = null;
var stmt3                               = null;
var finishedFindingFolders              = false;
var username                            = "Unknown user";
var dbsearch;
var xdiff;
var lhs;
var rhs;

var stmtInsertDependency;
var stmtInsertSubComponent;
var stmtUpdateDriver;
var stmtDeleteDependencies;

var stmtInsertAppDDLRevision;
var stmtUpdateLatestAppDDLRevision;

var stmtInsertIntoIntranetClientConnects;
var copyMigration;



username = os.userInfo().username.toLowerCase();
//console.log(username);

//dbsearch.run("PRAGMA synchronous=OFF;")
//dbsearch.run("PRAGMA count_changes=OFF;")
//dbsearch.run("PRAGMA journal_mode=MEMORY;")
//dbsearch.run("PRAGMA temp_store=MEMORY;")












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
    copyMigration = dbsearch.prepare(
    `                insert into  app_db_latest_ddl_revisions
                       (base_component_id,latest_revision)
                    select ?,  latest_revision from app_db_latest_ddl_revisions
                     where base_component_id=?

    `
    );

    stmtInsertIntoIntranetClientConnects = dbsearch.prepare(" insert  into  intranet_client_connects " +
                            "    ( id, internal_host, internal_port, public_ip, via, public_host, user_name, client_user_name, when_connected) " +
                            " values " +
                            "    (?,   ?,?,?,?,  ?,?,?,?);");


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



     stmtInsertAppDDLRevision = dbsearch.prepare(  " insert into app_db_latest_ddl_revisions " +
                                                  "      ( base_component_id,  latest_revision  ) " +
                                                  " values " +
                                                  "      ( ?,  ? );");

     stmtUpdateLatestAppDDLRevision = dbsearch.prepare(  " update  app_db_latest_ddl_revisions  " +
                                                          "     set  latest_revision = ? " +
                                                          " where " +
                                                          "     base_component_id =  ? ;");


}




function getContentType(fullFileNamePath) {
    var contentType = 'text/plain'
    var extension = fullFileNamePath.substr(fullFileNamePath.lastIndexOf('.') + 1).toLowerCase()
    if (extension == 'pdf') {contentType = 'application/pdf'}
    else if (extension == 'glb') {contentType = 'model/gltf-binary'}
    else if (extension == 'docx') {contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'}
    else if (extension == 'xls') {contentType = 'application/vnd.ms-excel'}
    else if (extension == 'xlsx') {contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}
    else if (extension == 'csv') {contentType = 'text/csv'}
    return contentType;
}




function createContent(     fullFileNamePath,
                            sha1ofFileContents) {


        //
        // create the content if it doesn't exist
        //
        dbsearch.serialize(
            function() {
                var stmt = dbsearch.all(
                    "select  *  from  contents  where  id = ? ", [  sha1ofFileContents  ],

                    function(err, results)
                    {
                        if (!err)
                        {
                            if (results.length == 0) {
                                try {
                                    var contentType = getContentType(fullFileNamePath)
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







function foundFile(     fullFileNamePath,
                        sha1ofFileContents,
                        fileContentsSize,
                        fileScreenName,
                        existingConnectionId,
                        driverName,
                        documentType) {

        var newFileId   = uuidv1();

        dbsearch.serialize(
            function() {
                dbsearch.run("begin exclusive transaction");
                stmtInsertIntoFiles.run(
                    newFileId,
                    sha1ofFileContents,
                    fileContentsSize,
                    path.dirname(fullFileNamePath),
                    path.basename(fullFileNamePath),
                    existingConnectionId)

                dbsearch.run("commit");
            })
}




function getSha256(fileName) {
    try {
        var contents = fs.readFileSync(fileName, "utf8");
        var hash = crypto.createHash('sha256');
        hash.setEncoding('hex');
        hash.write(contents);
        hash.end();
        var sha1sum = hash.read();
        createContent(fileName, sha1sum);
        return sha1sum;
    } catch (err) {
        console.log(err);
        var stack = new Error().stack
        console.log( stack )
        return null;
    }
}

function timestampInSeconds() {
    return Math.floor(Date.now() / 1000)
}


//-----------------------------------------------------------------------------------------//
//                                                                                         //
//                                   markFileForProcessing                                 //
//                                                                                         //
//                                                                                         //
//                                                                                         //
//                                                                                         //
//                                                                                         //
//                                                                                         //
//                                                                                         //
//                                                                                         //
//-----------------------------------------------------------------------------------------//
function markFileForProcessing(  fullFilePath ) {
    if (!fullFilePath) {
        return;
    };
    if (fullFilePath.indexOf("$") != -1) {
        return;
    };
    if (fullFilePath.indexOf("gsd_") != -1) {
        return;
    };
    try {
        dbsearch.serialize(function() {
            var stmt = dbsearch.all(
                "select id from files where   path = ?   and   orig_name = ?",
                [path.dirname(fullFilePath), path.basename(fullFilePath)],
                function(err, results)
                {
                    if (!err)
                    {
                        if (results.length == 0) {
                            try {
                                var newFileId   = uuidv1();
                                dbsearch.serialize(
                                    function() {
                                        dbsearch.run("begin exclusive transaction");
                                        stmtInsertIntoFiles2.run(
                                            newFileId,
                                            path.dirname(fullFilePath),
                                            path.basename(fullFilePath))
                                        dbsearch.run("commit");
                                      })

                            } catch (err) {
                                console.log("Error " + err + " with file: " + fullFilePath);
                                var stack = new Error().stack
                                console.log( stack )
                            }
                        };
                    };
                }
            )
        }, sqlite3.OPEN_READONLY)


        dbsearch.serialize(
            function() {
                dbsearch.run("begin exclusive transaction");
                var newFileId   = uuidv1();
                stmtAddFileForUpload.run(
                    newFileId,
                    '||  path='+fullFilePath+'  ||')
                dbsearch.run("commit");
              })


    } catch(err) {
        console.log("Error " + err + " with file: " + fullFilePath);
        var stack = new Error().stack
        console.log( stack )
        return err;
    } finally {

    }
}
































//-----------------------------------------------------------------------------------------//
//                                                                                         //
//                                       outputToConsole                                   //
//                                                                                         //
//                                                                                         //
//                                                                                         //
//                                                                                         //
//                                                                                         //
//                                                                                         //
//                                                                                         //
//-----------------------------------------------------------------------------------------//
function outputToConsole(text) {
    var c = console;
    c.log(text);
}











var callbackIndex = -1


var callbackIndex = 0;
var callbackList = new Object()

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





function getFileExtension(fullFileNamePath) {
    var extension = fullFileNamePath.substr(fullFileNamePath.lastIndexOf('.') + 1).toLowerCase()
    return extension
}




function getProperty(record,propName) {
    var properties = record.properties
    var rt = properties.indexOf("||  " + propName + "=") + 5 + propName.length
    var st = properties.substring(rt)
    var xt = st.indexOf("  ||")
    var amiga = st.substring(0,xt)
    return amiga
}

var hostaddress = null
var port = null


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

      if (msg.message_type == 'saveConnectionAndQueryForFile') {
          markFileForProcessing(msg.fileId);

      } else if (msg.message_type == 'parent_test') {
          //console.log('Message from parent:', msg);
          process.send({send_from_child: "***** Received message from parent"})


      } else if (msg.message_type == 'callDriverMethod') {

          callDriverMethod( msg.find_component, msg.args, function(result) {
              process.send(
                  {
                      message_type: 'ipc_child_returning_callDriverMethod_response',
                      seq_num_browser: msg.seq_num_browser,
                      seq_num_parent: msg.seq_num_parent,
                      result: result
                  })
          })





      } else if (msg.message_type == "save_code") {

              saveCodeV2(  msg.base_component_id, msg.parent_hash  ,  msg.code  , msg.options);




      } else if (msg.message_type == "save_code_from_upload") {


        var asyy = async function() {
            var ret = await saveCodeV2(  msg.base_component_id, msg.parent_hash  ,  msg.code  , msg.options);
            //console.log(`Uploaded code ID = ${ret.code_id}`)
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
        console.log("**** greeting");

    } else if (msg.message_type == 'host_and_port') {

        hostaddress         = msg.ip
        port                = msg.port



    } else if (msg.message_type == 'init') {

        userData            = msg.user_data_path
        childProcessName    = msg.child_process_name


        ////console.log("Child recieved user data path: " + userData)
        var dbPath = path.join(userData, username + '.visi')

        //console.log("DB path: " + dbPath)
        dbsearch = new sqlite3.Database(dbPath);
        dbsearch.run("PRAGMA journal_mode=WAL;")
        process.send({  message_type:       "database_setup_in_child" ,
                        child_process_name:  childProcessName
                        });


    } else if (msg.message_type == 'setUpSql') {


        setUpSql();

    } else if (msg.message_type == 'createTables') {
        console.log("**** createTables");
        db_helper.createTables(dbsearch,
            function() {
               //console.log("**** createTables returned");
                process.send({  message_type:       "createdTablesInChild"  });

            });



    } else if (msg.message_type == 'setUpDbDrivers') {
       //console.log("**** setUpDbDrivers");
        setUpDbDrivers();








    } else if (msg.message_type == "return_response_to_function_caller") {
       // console.log("*) result received to caller " );
       // console.log("*)  callback_index:" + msg.callback_index );
       // console.log("*)  result:        " + msg.result );
        callbackList[ msg.callback_index ](msg.result)













    } else if (msg.message_type == 'get_intranet_servers') {
        //console.log("3: " + msg.seq_num )
        getIntranetServers( msg.requestClientPublicIp,
                            msg.requestVia,
                            msg.numberOfSecondsAliveCheck,

                            function(result) {
                                //console.log("5: " + JSON.stringify(result))
                                var returnIntranetServersMsg = {
                                    message_type:           'returnIntranetServers',
                                    requestClientPublicIp:  msg.requestClientPublicIp,
                                    requestVia:             msg.requestVia,
                                    seq_num:                msg.seq_num,
                                    returned:               result.rows,
                                    error:                  result.error
                                };
                                //console.log("5.1: " + JSON.stringify(returnIntranetServersMsg))
                                //console.log("5.2: " + Object.keys(returnIntranetServersMsg))
                                process.send( returnIntranetServersMsg );
                                //console.log("5.3: ")
                    }  )



            } else if (msg.message_type == 'get_intranet_servers_json') {
                //console.log("3: " + msg.seq_num )
                getIntranetServers( msg.requestClientPublicIp,
                                    msg.requestVia,
                                    msg.numberOfSecondsAliveCheck,

                                    function(result) {
                                        //console.log("5: " + JSON.stringify(result))
                                        var returnIntranetServersMsg = {
                                            message_type:           'returnIntranetServers_json',
                                            requestClientPublicIp:  msg.requestClientPublicIp,
                                            requestVia:             msg.requestVia,
                                            seq_num:                msg.seq_num,
                                            returned:               result.rows,
                                            error:                  result.error
                                        };
                                        //console.log("5.1: " + JSON.stringify(returnIntranetServersMsg))
                                        //console.log("5.2: " + Object.keys(returnIntranetServersMsg))
                                        process.send( returnIntranetServersMsg );
                                        //console.log("5.3: ")
                            }  )





    } else if (msg.message_type == 'client_connect') {
        //console.log("3 client_connect: " + msg.seq_num )
        clientConnectFn( msg.queryData,
                         msg.requestClientInternalHostAddress,
                         msg.requestClientInternalPort,
                         msg.requestVia,
                         msg.requestClientPublicIp,
                         msg.clientUsername,
                         msg.requestClientPublicHostName,

                            function(result) {
                                //console.log("5: " + JSON.stringify(result))
                                var returnclientConnectMsg = {
                                    message_type:           'returnClientConnect',
                                    seq_num:                msg.seq_num,
                                    returned:               result.connected,
                                    error:                  result.error
                                };
                                //console.log("5.1: " + JSON.stringify(returnIntranetServersMsg))
                                //console.log("5.2: " + Object.keys(returnclientConnectMsg))
                                process.send( returnclientConnectMsg );
                                //console.log("5.3: ")
                    }  )




    } else if (msg.message_type == 'add_local_driver') {
        //console.log("3 - add_local_driver: " + msg.seq_num )
        var return_add_local_driver_results_msg = {
            message_type:           'return_add_local_driver_results_msg',
            seq_num:                msg.seq_num
        };

        try {
            evalLocalSystemDriver( msg.driver_name, path.join(__dirname, '../public/visifile_drivers/' + msg.driver_name + '.js') )
            return_add_local_driver_results_msg.success = true
            return_add_local_driver_results_msg.error = false

        } catch(err) {
            return_add_local_driver_results_msg.success = false
            return_add_local_driver_results_msg.error = true
            return_add_local_driver_results_msg.error_message = err

        }
        process.send( return_add_local_driver_results_msg );





        }

    });
}

























function evalLocalSystemDriver(driverName, location) {
	var evalDriver = fs.readFileSync(location);
	addOrUpdateDriver(driverName, evalDriver)
}



function setUpDbDrivers() {
    //evalLocalSystemDriver('glb',                    path.join(__dirname, '../public/visifile_drivers/glb.js'))
    //evalLocalSystemDriver('csv',                    path.join(__dirname, '../public/visifile_drivers/csv.js'))
    //evalLocalSystemDriver('txt',                    path.join(__dirname, '../public/visifile_drivers/glb.js'))
    //evalLocalSystemDriver('excel',                  path.join(__dirname, '../public/visifile_drivers/excel.js'))
    //evalLocalSystemDriver('word',                   path.join(__dirname, '../public/visifile_drivers/word.js'))
    //evalLocalSystemDriver('pdf',                    path.join(__dirname, '../public/visifile_drivers/pdf.js'))
    //evalLocalSystemDriver('postgres',               path.join(__dirname, '../public/visifile_drivers/postgres.js'))

    //evalLocalSystemDriver('outlook2012',            path.join(__dirname, '../public/visifile_drivers/outlook2012.js'))
    //evalLocalSystemDriver('outlook2010')
    //evalLocalSystemDriver('sqlite',                 path.join(__dirname, '../public/visifile_drivers/sqlite.js'))
    //evalLocalSystemDriver('mysql',                  path.join(__dirname, '../public/visifile_drivers/mysql.js'))
    //evalLocalSystemDriver('oracle',                 path.join(__dirname, '../public/visifile_drivers/oracle.js'))
    //evalLocalSystemDriver('testdriver',             path.join(__dirname, '../public/visifile_drivers/testdriver.js'))

    //evalLocalSystemDriver('fileuploader',           path.join(__dirname, '../public/visifile_drivers/file_uploader.js'))



    //
    // services
    //
    if (isWin) {
        evalLocalSystemDriver('powershell',         path.join(__dirname, '../public/visifile_drivers/services/powershell.js'))
    }
    evalLocalSystemDriver('commandLine',            path.join(__dirname, '../public/visifile_drivers/services/commandLine.js'))
    evalLocalSystemDriver('commandLine2',            path.join(__dirname, '../public/visifile_drivers/services/commandLine2.js'))
    evalLocalSystemDriver('copyApp',            path.join(__dirname, '../public/visifile_drivers/services/copyApp.js'))
    //evalLocalSystemDriver('webPreview',             path.join(__dirname, '../public/visifile_drivers/services/web_preview.js'))

    //evalLocalSystemDriver('spreahsheetPreview',     path.join(__dirname, '../public/visifile_drivers/services/spreadsheet_preview.js'))
    //evalLocalSystemDriver('csvPreview',             path.join(__dirname, '../public/visifile_drivers/services/csv_preview.js'))
    //evalLocalSystemDriver('docPreview',             path.join(__dirname, '../public/visifile_drivers/services/doc_preview.js'))
    //evalLocalSystemDriver('fileScannerService',     path.join(__dirname, '../public/visifile_drivers/services/file_scanner_service.js'))
    //evalLocalSystemDriver('folderScannerService',   path.join(__dirname, '../public/visifile_drivers/services/folder_scanner_service.js'))




    //
    // apps
    //
    evalLocalSystemDriver('homepage',     path.join(__dirname, '../public/visifile_drivers/apps/homepage.js'))
    evalLocalSystemDriver('homepage_1',   path.join(__dirname, '../public/visifile_drivers/apps/homepage_1.js'))
    evalLocalSystemDriver('homepage_2',   path.join(__dirname, '../public/visifile_drivers/apps/homepage_2.js'))
    evalLocalSystemDriver('homepage_3',   path.join(__dirname, '../public/visifile_drivers/apps/homepage_3.js'))
    evalLocalSystemDriver('homepage_4',   path.join(__dirname, '../public/visifile_drivers/apps/homepage_4.js'))
    evalLocalSystemDriver('vb',   path.join(__dirname, '../public/visifile_drivers/apps/vb.js'))
    //evalLocalSystemDriver('homepage_6',   path.join(__dirname, '../public/visifile_drivers/apps/homepage_6.js'))



    evalLocalSystemDriver('welcome',   path.join(__dirname, '../public/visifile_drivers/apps/welcome.js'))
    evalLocalSystemDriver('app_editor_3',   path.join(__dirname, '../public/visifile_drivers/apps/appEditorV3.js'))
    evalLocalSystemDriver('appEmbed',   path.join(__dirname, '../public/visifile_drivers/apps/appEmbed.js'))
    evalLocalSystemDriver('search',   path.join(__dirname, '../public/visifile_drivers/apps/search.js'))
    evalLocalSystemDriver('test',   path.join(__dirname, '../public/visifile_drivers/apps/test.js'))
    evalLocalSystemDriver('game',   path.join(__dirname, '../public/visifile_drivers/apps/game.js'))
    evalLocalSystemDriver('intro_logo_3d',   path.join(__dirname, '../public/visifile_drivers/apps/intro_logo_3d.js'))
    evalLocalSystemDriver('list_apps',   path.join(__dirname, '../public/visifile_drivers/apps/listApps.js'))
    evalLocalSystemDriver('listPublicApps',   path.join(__dirname, '../public/visifile_drivers/apps/listPublicApps.js'))
    evalLocalSystemDriver('vue',   path.join(__dirname, '../public/visifile_drivers/apps/vue.js'))
    evalLocalSystemDriver('bootstrap',   path.join(__dirname, '../public/visifile_drivers/apps/bootstrap.js'))
    evalLocalSystemDriver('database_reader',   path.join(__dirname, '../public/visifile_drivers/apps/databaseReader.js'))
    evalLocalSystemDriver('new_app',   path.join(__dirname, '../public/visifile_drivers/apps/newApp.js'))
    evalLocalSystemDriver('todo',   path.join(__dirname, '../public/visifile_drivers/apps/todo.js'))
    evalLocalSystemDriver('todo_app_reader',   path.join(__dirname, '../public/visifile_drivers/apps/todo_app_reader.js'))
    evalLocalSystemDriver('newSql',   path.join(__dirname, '../public/visifile_drivers/apps/newSqlApp.js'))
    evalLocalSystemDriver('newAppFromTemplate',   path.join(__dirname, '../public/visifile_drivers/apps/newAppFromTemplate.js'))

    //
    // controls
    //
    evalLocalSystemDriver('list_control',   path.join(__dirname, '../public/visifile_drivers/controls/list.js'))
    evalLocalSystemDriver('label_control',   path.join(__dirname, '../public/visifile_drivers/controls/label.js'))
    evalLocalSystemDriver('button_control',   path.join(__dirname, '../public/visifile_drivers/controls/button.js'))
    evalLocalSystemDriver('input_control',   path.join(__dirname, '../public/visifile_drivers/controls/input.js'))


    //
    // forms
    //
    evalLocalSystemDriver('form_subscribe_to_appshare',   path.join(__dirname, '../public/visifile_drivers/apps/formSubscribeToAppshare.js'))



    //
    // functions
    //
    evalLocalSystemDriver('systemFunctions',   path.join(__dirname, '../public/visifile_drivers/functions/system.js'))
    evalLocalSystemDriver('systemFunctions2',   path.join(__dirname, '../public/visifile_drivers/functions/system2.js'))
    evalLocalSystemDriver('systemFunctions3',   path.join(__dirname, '../public/visifile_drivers/functions/system3.js'))
    evalLocalSystemDriver('systemFunctionAppSql',   path.join(__dirname, '../public/visifile_drivers/functions/systemFunctionAppSql.js'))
    evalLocalSystemDriver('appEditorV2SaveCode',   path.join(__dirname, '../public/visifile_drivers/apps/appEditorV2SaveCode.js'))

    //
    // UI components
    //
    evalLocalSystemDriver('comp',   path.join(__dirname, '../public/visifile_drivers/ui_components/comp.js'))
    evalLocalSystemDriver('editor_component',   path.join(__dirname, '../public/visifile_drivers/ui_components/editorComponent.js'))
    evalLocalSystemDriver('form_editor_component',   path.join(__dirname, '../public/visifile_drivers/ui_components/formEditorComponent.js'))
    evalLocalSystemDriver('simple_display_editor_component',   path.join(__dirname, '../public/visifile_drivers/ui_components/simpleDisplayEditorComponent.js'))
    evalLocalSystemDriver('vb_editor_component',   path.join(__dirname, '../public/visifile_drivers/ui_components/vbEditorComponent.js'))
}








function addOrUpdateDriver(  name, codeString  ) {
    //console.log('addOrUpdateDriver: ' + name);


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
                function(err, rows) {
                    if (!err) {
                        try {
                            var parentId = null
                            if (rows.length > 0) {
                                parentId = rows[0].id
                            }

                            saveCodeV2(  name, parentId,    codeString  );



                          } catch(err) {
                              console.log(err);
                              var stack = new Error().stack
                              console.log( stack )
                          } finally {

                          }

              }
          }
      );
  }, sqlite3.OPEN_READONLY)
  }














function getIntranetServers(  requestClientPublicIp,  requestVia,  numberOfSecondsAliveCheck,  callbackFn) {
    var mysql = "select *  from  intranet_client_connects  where " +
                                "    (when_connected > " + ( new Date().getTime() - (numberOfSecondsAliveCheck * 1000)) + ") " +
                                " and " +
                                "    (( public_ip = '" + requestClientPublicIp + "') or " +
                                                    "((via = '" + requestVia + "') and (length(via) > 0)))";
        //console.log("check IP: " + mysql);
    dbsearch.serialize(
        function() {

        var stmt = dbsearch.all(
            mysql,
            function(err, rows) {
                if (!err) {
                    //console.log( "           " + JSON.stringify(rows));
                    callbackFn({rows: rows})
                } else {
                    callbackFn({error: err})
                }
        });
    }, sqlite3.OPEN_READONLY)
};




















function clientConnectFn(
                            queryData,
                            requestClientInternalHostAddress,
                            requestClientInternalPort,
                            requestVia,
                            requestClientPublicIp,
                            clientUsername,
                            requestClientPublicHostName,
                            callbackFn
        ) {
	try
	{
        console.log('clientConnectFn');

		//console.log('Client attempting to connect from:');
		//console.log('client internal host address:    ' + requestClientInternalHostAddress)
		//console.log('client internal port:            ' + requestClientInternalPort)
		//console.log('client public IP address:        ' + requestClientPublicIp)
		//console.log('client public IP host name:      ' + requestClientPublicHostName)
		//console.log('client VIA:                      ' + requestVia)

          dbsearch.serialize(function() {


              var newid = uuidv1();
              dbsearch.run("begin exclusive transaction");
              stmtInsertIntoIntranetClientConnects.run(   newid,
                          requestClientInternalHostAddress,
                          requestClientInternalPort,
                          requestClientPublicIp,
                          requestVia,
                          requestClientPublicHostName,
                          username,
                          clientUsername,
                          new Date().getTime())
              dbsearch.run("commit");

          });
          //console.log('***SAVED***');

        callbackFn({connected: true})
	}
	catch (err) {
        console.log(err);
        var stack = new Error().stack
        console.log( stack )
		//console.log('Warning: Central server not available:');
	}

}





















function getDriver(id, callbackFn) {
    try {
        dbsearch.serialize(
            function() {
        var stmt = dbsearch.all(
            "SELECT * FROM drivers WHERE name = ? ",
            id
            ,

            function(err, results)
            {
                if (err)
                {
                    console.log("getDriver error: " + err)
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




process.on('exit', function(err) {
    shutdownExeProcess(err);
  });
process.on('quit', function(err) {
  shutdownExeProcess(err);
});

function shutdownExeProcess(err) {
    console.log("** Scheduler process was killed: " )
    if (err) {
        console.log("    : " + err)
    }


    if (dbsearch) {
        dbsearch.run("PRAGMA wal_checkpoint;")
    }
}




var saveHelper = require('./save_helpers')

var esprima = require('esprima');


function updateRevisions(sqlite, baseComponentId) {
    dbsearch.serialize(
    function() {
        dbsearch.all(
            "SELECT  *  from  app_db_latest_ddl_revisions  where  base_component_id = ? ; ",
            baseComponentId,

            function(err, results)
            {
                //console.log("**************************************")
                //console.log("****       Creating App DB        ****")
                //console.log("baseComponentId: " + JSON.stringify(baseComponentId,null,2))
                //console.log("results: " + JSON.stringify(results,null,2))
                var latestRevision = null
                if (results.length > 0) {
                    latestRevision = results[0].latest_revision
                }
                //console.log("latestRevision: " + JSON.stringify(latestRevision,null,2))
                var dbPath = path.join(userData, 'app_dbs/' + baseComponentId + '.visi')
                //console.log("dbPath: " + JSON.stringify(dbPath,null,2))
                var appDb = new sqlite3.Database(dbPath);
                appDb.run("PRAGMA journal_mode=WAL;")

                appDb.serialize(
                    function() {
                      try {
                        appDb.run("begin exclusive transaction");
                        //console.log(JSON.stringify(sqlite,null,2))
                        var newLatestRev = null
                        var readIn = false
                        for (var i=0; i < sqlite.length; i+=2) {
                            var sqlStKey = sqlite[i]
                            //console.log("sqlStKey: = " + sqlStKey)
                            for (var j = 0  ;  j < sqlite[i + 1].length  ;  j++ ) {
                                if ((latestRevision == null) || readIn) {
                                    var sqlSt = sqlite[i + 1][j]
                                    //console.log("sqlSt: = " + sqlSt)
                                    appDb.run(sqlSt);
                                    newLatestRev = sqlStKey
                                }
                                if (latestRevision == sqlStKey) {
                                    //console.log("testing: " + latestRevision + " == " + sqlStKey)
                                    readIn = true
                                }
                            }
                        }
                        appDb.run("commit");
                        appDb.run("PRAGMA wal_checkpoint;")
                        //console.log("**************************************")


                        try {
                            dbsearch.serialize(function() {
                                dbsearch.run("begin exclusive transaction");
                                if (results.length == 0) {
                                    //console.log("insert newLatestRev: " + baseComponentId + " == " + newLatestRev)
                                    stmtInsertAppDDLRevision.run(baseComponentId, newLatestRev)
                                } else {
                                    if (newLatestRev) {
                                        //console.log("update newLatestRev: " + baseComponentId + " == " + newLatestRev)
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
    }, sqlite3.OPEN_READONLY)

}








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







async function saveCodeV2( baseComponentId, parentHash, code , options) {

    var promise = new Promise(returnFn => {
        //console.log(`function saveCodeV2( ${baseComponentId}, ${parentHash} ) {`)
        if (!baseComponentId) {
            baseComponentId = uuidv1()
        }
        code = saveHelper.deleteCodeString(code, "base_component_id")
        code = saveHelper.insertCodeString(code, "base_component_id", baseComponentId)

        //console.log("    baseComponentId := " + baseComponentId)


        var creationTimestamp = new Date().getTime()
        // if we don't want to reload this file then don't update the timestamp
        if (saveHelper.getValueOfCodeString(code,"load_once_from_file")) {
            creationTimestamp = -1
        }
        code = saveHelper.deleteCodeString(code, "created_timestamp")
        code = saveHelper.insertCodeString(code, "created_timestamp", creationTimestamp)




        var oncode = "\"app\""
        var eventName = null
        var componentType = null
        var componentOptions = null
        var maxProcesses = 1
        var rowhash = crypto.createHash('sha256');
        var row = code.toString();
        var visibility = null
        visibility = saveHelper.getValueOfCodeString(code,"visibility")

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
                            if (rows.length == 0) {
                                try {

                                if (saveHelper.getValueOfCodeString(code,"hide_header")) {
                                    componentOptions = "HIDE_HEADER"
                                }



                                var displayName = saveHelper.getValueOfCodeString(code,"display_name")

                                var logoUrl = saveHelper.getValueOfCodeString(code,"logo_url")
                                var useDb = saveHelper.getValueOfCodeString(code,"use_db")
                                var editors2 = saveHelper.getValueOfCodeString(code,"editors")

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





                                //
                                // 1) call this first
                                //
                                var prjs = esprima.parse( "(" + code.toString() + ")");
                                if (prjs.body) {
                                    if (prjs.body[0]) {
                                        if (prjs.body[0].expression) {
                                            if (prjs.body[0].expression.id) {
                                                //console.log(driverName + ": " + JSON.stringify(prjs.body[0].expression.id.name,null,2))
                                                oncode = "\"" + prjs.body[0].expression.id.name + "\""
                                                eventName = prjs.body[0].expression.id.name
                                                componentType = "method"
                                            }
                                        }
                                    }
                                }

                                //
                                // 2) and then call this , as apps can also be methods
                                //
                                if (saveHelper.getValueOfCodeString(code,"is_app")) {
                                    componentType = "app"
                                }


                                //console.log("Saving in Sqlite: " + parentHash)
                                //console.log("Saving in Sqlite: " + code)
                                var stmtInsertNewCode = dbsearch.prepare(
                                    " insert into   system_code  (id, parent_id, code_tag, code,on_condition, base_component_id, method, max_processes,component_type,display_name, creation_timestamp,component_options, logo_url, visibility, interfaces,use_db, editors, read_write_status,properties) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
                                var stmtDeprecateOldCode = dbsearch.prepare(
                                    " update system_code  set code_tag = NULL where base_component_id = ? and id != ?");

                                dbsearch.serialize(function() {
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
                                          visibility,
                                          interfaces,
                                          useDb,
                                          editors,
                                          readWriteStatus,
                                          properties
                                          )
                                    stmtDeprecateOldCode.run(
                                        baseComponentId,
                                        sha1sum
                                        )


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

                                              if ( jsLibs[tt] == "aframe" ) {
                                                scriptCode += fs.readFileSync( path.join(__dirname, '../public/js_libs/aframe.min.js') )
                                                scriptCode += `
                                                `
                                              }


                                          }
                                     }
                                     var sqliteCode = ""
                                     if (options) {

                                        //console.log(JSON.stringify(options,null,2))
                                        if (options.sub_components) {
                                            //console.log("Save options: " + options.sub_components.length)
                                            //console.log(JSON.stringify(options,null,2))
                                            for (var tew = 0; tew < options.sub_components.length ; tew ++) {
                                                //console.log("Saving " + options.sub_components[tew])
                                                stmtInsertSubComponent.run(
                                                    baseComponentId,
                                                    options.sub_components[tew])
                                            }
                                        }
                                     }

                                    dbsearch.run("commit", function() {


                                    });
                                    stmtInsertNewCode.finalize();
                                    stmtDeprecateOldCode.finalize();

                                    var origFilePath = path.join(__dirname, '../public/go.html')
                                    var newStaticFilePath = path.join( userData, 'apps/' + baseComponentId + '.html' )
                                    var newLocalStaticFilePath = path.join( userData, 'apps/appshare_' + baseComponentId + '.html' )

                                    var newStaticFileContent = fs.readFileSync( origFilePath )

                                    newStaticFileContent = newStaticFileContent.toString().replace("var isStaticHtmlPageApp = false", "var isStaticHtmlPageApp = true")

                                    var newcode = escape("(" + code.toString() + ")")


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
                                        function() {
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

                                            function(err, results)
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

                                                    newStaticFileContent = newStaticFileContent.toString().replace("//***ADD_SCRIPT", scriptCode)


                                                    //fs.writeFileSync( path.join(__dirname, '../public/sql2.js'),  sqliteCode )
                                                    fs.writeFileSync( newStaticFilePath,  newStaticFileContent )



                                                    //
                                                    // save the standalone app
                                                    //
                                                    sqliteCode = fs.readFileSync( path.join(__dirname, '../node_modules/sqlite/sql.js') )
                                                    var indexOfSqlite = newStaticFileContent.indexOf("//SQLITE")
                                                    newStaticFileContent = newStaticFileContent.substring(0,indexOfSqlite) +
                                                                                sqliteCode +
                                                                                    newStaticFileContent.substring(indexOfSqlite)
                                                    newStaticFileContent = saveHelper.replaceBetween(newStaticFileContent, "/*use_local_sqlite_start*/","/*use_local_sqlite_end*/","var useLocalDb = true")




                                                    var sqliteAppDbPath = path.join( userData, 'app_dbs/' + baseComponentId + '.visi' )

                                                    if (fs.existsSync(sqliteAppDbPath)) {
                                                        var sqliteAppDbContent = fs.readFileSync( sqliteAppDbPath , 'base64')
                                                        var indexOfSqliteData = newStaticFileContent.indexOf("var sqlitedata = ''")


                                                        newStaticFileContent = newStaticFileContent.substring(0,indexOfSqliteData + 17) +
                                                                                    "'" + sqliteAppDbContent + "'//sqlitedata" +
                                                                                        newStaticFileContent.substring(indexOfSqliteData + 19)

                                                    }

                                                    fs.writeFileSync( newLocalStaticFilePath,  newStaticFileContent )
                                                    })
                                       }
                                 , sqlite3.OPEN_READONLY)









                                    //
                                    // save the app db
                                    //
                                    var sqlite = saveHelper.getValueOfCodeString(code, "sqlite",")//sqlite")
                                    if (sqlite) {
                                        if (options && options.copy_db_from) {
                                        //zzz
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
                                        } else {
                                            //console.log('updateRevisions(sqlite, baseComponentId)')
                                            //console.log('    ' + JSON.stringify(options,null,2))
                                            updateRevisions(sqlite, baseComponentId)
                                        }

                                    }
                                    //
                                    // END OF save app db
                                    //




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
                        }


                    })
        }, sqlite3.OPEN_READONLY)
        })

    var ret = await promise;
    return ret
}
