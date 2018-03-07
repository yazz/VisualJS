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
var sqlite3                     = require2('sqlite3');
var os                          = require('os')
var perf                        = require('./perf')
var db_helper                   = require("./db_helper")
var pgeval
var sqliteeval
var tdeval
var toeval;


var inProcessFilesFn                    = false;
var isWin                               = /^win/.test(process.platform);
var numberOfSecondsIndexFilesInterval   = 5;
var inScan                              = false;
var drivers                             = new Object();
var connections                         = new Object();
var queries                             = new Object();
var stmt2                               = null;
var stmt3                               = null;
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
var stmtInsertInsertIntoQueries;
var stmtUpdateRelatedDocumentCount;
var stmtUpdateRelationships;
var in_when_queries_changes             = false;
var in_when_connections_change          = false;


username = os.userInfo().username.toLowerCase();
//console.log(username);
dbsearch = new sqlite3.Database(username + '.vis');
//dbsearch.run("PRAGMA journal_mode=WAL;")
//dbsearch.run("PRAGMA synchronous=OFF;")
//dbsearch.run("PRAGMA count_changes=OFF;")
//dbsearch.run("PRAGMA journal_mode=MEMORY;")
//dbsearch.run("PRAGMA temp_store=MEMORY;")


function require2(moduleName) {
	var pat;
	if (isWin) {
		pat = "require(process.cwd() + " + "'\\\\node_modules\\\\" + moduleName + "');";
	} else {
	    pat = "require(process.cwd() + " + "'/node_modules/" + moduleName + "');";
	}
    var reac = eval(pat);
	return reac;
};






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

        if (msg.message_type == 'init') {
            setUpSql();

        } else if (msg.message_type == 'call_powershell') {


            get_inbox_count(function(inbox){
                console.log("Inbox count: " + inbox);
                get_unread_message_count(function(unread){
                    console.log("Unread email count: " + unread);

                    get_all_inbox_message_ids(function(ids){
                        console.log("IDs: " + JSON.stringify(ids));
                        var fg = ids.length;
                        for (var i = 0; i < fg; i++) {
                            var sourceMessageId = ids[i];
                            //zzz
                            try {
                                dbsearch.serialize(function() {
                                    var stmt = dbsearch.all(
                                        "select id from messages where   source_id = ?",
                                        [sourceMessageId],
                                        function(err, results)
                                        {
                                            if (!err)
                                            {
                                                if (results.length == 0) {
                                                    try {
                                                        var newMessageId   = uuidv1();
                                                        stmtInsertIntoMessages.run(

                                                            newMessageId,
                                                            sourceMessageId,
                                                            "INBOX",
                                                            "OUTLOOK",
                                                            "ADDED",

                                                            function(err) {
                                                                //console.log('added message to sqlite');
                                                                });

                                                    } catch (err) {
                                                        console.log("Error " + err + " with file: " + sourceMessageId);
                                                    }
                                                };
                                            };
                                        }
                                    )
                                })
                            } catch(err) {
                                console.log("Error " + err + " with file: " + sourceMessageId);
                            } finally {

                            }
                        }

                    });
                });
            });



        }


    })
}




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
    stmtResetFolders = dbsearch.prepare( " update   folders   set status = NULL ");

    stmtResetFiles   = dbsearch.prepare( " update   files   set status = 'INDEXED' where status = 'REINDEXED' ");

    stmtUpdateFolder = dbsearch.prepare( " update folders " +
                                                         "    set " +
                                                         "        status = ? " +
                                                         " where " +
                                                         "     id = ?");
    stmtInsertIntoRelationships = dbsearch.prepare( " insert into relationships " +
                                                        "    ( id, source_query_hash, target_query_hash, similar_row_count ) " +
                                                        " values " +
                                                        "    (?,  ?,?,  ?);");

    stmtUpdateRelationships2 = dbsearch.prepare( " update relationships " +
                                                         "    set " +
                                                         "        new_source = ?, new_target = ?, " +
                                                         "        edited_source = ?, edited_target = ?, " +
                                                         "        deleted_source = ?, deleted_target = ?, " +
                                                         "        array_source = ?, array_target = ? " +
                                                         " where " +
                                                         "     source_query_hash = ?    and     target_query_hash = ? ");


     stmtInsertIntoContents = dbsearch.prepare(  " insert into contents " +
                                                 "      ( id, content, content_type ) " +
                                                 " values " +
                                                 "      ( ?,  ?, ? );");


    stmtFileChanged = dbsearch.prepare( " update files " +
                                            "   set  contents_hash = ?,  size = ? " +
                                            " where  " +
                                            "     id = ? ;");

    stmtInsertIntoFiles = dbsearch.prepare( " insert into files " +
                                            "     ( id,  contents_hash ,  size,  path,  orig_name,    fk_connection_id) " +
                                            " values " +
                                            "     ( ?,  ?,  ?,  ?,  ?,   ? );");

    stmtInsertIntoMessages = dbsearch.prepare(  " insert into messages " +
                                                "     ( id,  source_id , path, source, status) " +
                                                " values " +
                                                "     ( ?,  ?,  ?,  ? , ? );");


    stmtInsertIntoFiles2 = dbsearch.prepare( " insert into files " +
                                            "     ( id,  path,  orig_name ) " +
                                            " values " +
                                            "     ( ?,  ?,  ?);");


    stmtUpdateFileStatus        = dbsearch.prepare(     " update files " +
                                                        "     set status = ? " +
                                                        " where " +
                                                        "     id = ? ;");


    stmtUpdateFileSizeAndShaAndConnectionId    = dbsearch.prepare(     " update files " +
                                                        "     set contents_hash = ? , size = ? , fk_connection_id = ? " +
                                                        " where " +
                                                        "     id = ? ;");

    stmtUpdateFileProperties    = dbsearch.prepare( " update files " +
                                                    "    set contents_hash = ?,  size = ? " +
                                                    " where " +
                                                    "    id = ? ;");



    stmtInsertIntoFolders = dbsearch.prepare(   " insert into folders " +
                                                "    ( id, name, path, changed_count ) " +
                                                " values " +
                                                "    (?, ?, ?, 0);");




    stmtInsertIntoConnections = dbsearch.prepare(" insert into connections " +
                                "    ( id, name, driver, type, fileName ) " +
                                " values " +
                                "    (?,  ?,  ?,?,?);");



    stmtInsertInsertIntoQueries = dbsearch.prepare(" insert into queries " +
                                "    ( id, name, connection, driver, size, hash, fileName, type, definition, preview, similar_count , when_timestamp) " +
                                " values " +
                                "    (?,  ?,?,?,  ?,?,?, ?,?,?, 1,  ?);");

    stmtUpdateRelatedDocumentCount = dbsearch.prepare(" update queries " +
                                "    set  similar_count = ?  " +
                                " where  " +
                                "    id = ? ;");

    stmtUpdateRelationships = dbsearch.prepare(" update queries " +
                                "    set  related_status = ?  " +
                                " where  " +
                                "    hash = ? ;");
}

var standard = fs.readFileSync(path.join(__dirname, './common.ps1'));
standard = standard.toString().replace(/\r?\n|\r/g, ' ');
//console.log(standard)



var csvToJson = require('csvtojson')
var shell = require('node-powershell');
const parseXml = require('@rgrove/parse-xml');






function call_powershell( cb , commands ) {
    console.log("******************8 call_powershell" );

    try {
        var ps = new shell({
          executionPolicy: 'Bypass',
          debug: false,
          noProfile: true
        });
        ps.addCommand('$outlook = New-Object -ComObject "Outlook.Application";')
        ps.addCommand('$mapi = $outlook.GetNamespace("MAPI");')

        ps.addCommand('Add-Type -assembly "Microsoft.Office.Interop.Outlook"')
        ps.addCommand( standard);

        for ( var i = 0 ; i < commands.length ; i ++ ) {
            ps.addCommand( commands[i]);
            console.log("Added command" + commands[i])
        }
        ps.invoke()
        .then(output => {
            //console.log("******************ps poutput" + output );

            var s = parseXml(output);
            //console.log("******************ps poutput" + JSON.stringify(s,null,2) );
            cb(s);


        })
        .catch(err => {
          console.log("******************eee " + err);
          //ps.dispose();
        });
    } catch (err) {
        console.log("******************eee " + err);
    }
}





function get_unread_message_count(cb) {

    var commands =[
        "$inbox = $mapi.GetDefaultFolder([Microsoft.Office.Interop.Outlook.OlDefaultFolders]::olFolderInbox);",
        "echo $inbox.UnReadItemCount | convertTo-XML -As String;"];

    call_powershell(
        function(ret){
            cb( parseInt(ret.children[0].children[1].children[0].text) )
        }
        ,
        commands);

}


function get_inbox_count(cb) {

    var commands =[
        "$inbox = $mapi.GetDefaultFolder([Microsoft.Office.Interop.Outlook.OlDefaultFolders]::olFolderInbox);",
        "echo $inbox.items.count | convertTo-XML -As String;"];

    call_powershell(
        function(ret){
            cb( parseInt(ret.children[0].children[1].children[0].text) )
        }
        ,
        commands);

}

function get_message(i,cb) {

    var commands =[
        "$inbox = $mapi.GetDefaultFolder([Microsoft.Office.Interop.Outlook.OlDefaultFolders]::olFolderInbox)",
        "$mail = $inbox.Items | select Subject | Select-Nth " + (i + 1),
        "echo $mail | convertTo-XML -As String"
        ];

    call_powershell(
        function(ret){
            cb( ret.children[0].children[1].children[1].children[0].text )
        }
        ,
        commands);

}


function get_all_inbox_message_ids(cb) {

    var commands =[
        "$inbox = $mapi.GetDefaultFolder([Microsoft.Office.Interop.Outlook.OlDefaultFolders]::olFolderInbox)",
        "$mail = $inbox.Items | select EntryID ",
        "echo $mail | convertTo-XML -As String"
        ];

    call_powershell(
        function(ret){
            var lene = []
            var fg = ret.children[0].children.length;
            console.log("XML length: " + fg)
            for (var i = 0; i < fg; i++) {
                //console.log(i)
                var dj = ret.children[0].children[i]
                if (dj.type == 'element') {
                    lene.push(dj.children[1].children[0].text)
                }
            }
            cb( lene )
        }
        ,
        commands);

}
