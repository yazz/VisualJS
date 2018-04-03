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
var numberOfSecondsIndexMessagesInterval = 8;

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
var stmtSetMessageToError;
var stmtSetMessageToBodyError;
var stmtSetMessageToBodyRead;
var stmtUpdateMessageDetails;
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
dbsearch = new sqlite3.Database(username + '.visi');
dbsearch.run("PRAGMA journal_mode=WAL;")
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

function timestampInSeconds() {
    return Math.floor(Date.now() / 1000)
}




function insertNewMessage(  sourceMessageId, folder, messageClient  ) {
    try {
        dbsearch.serialize(
            function() {
            var stmt = dbsearch.all(
                "select id from messages where   source_id = ?",
                [sourceMessageId],
                function(err, results)
                {
                    if (!err)
                    {
                        if (results.length == 0) {
                            try {
                                dbsearch.serialize(function() {
                                    dbsearch.run("begin exclusive transaction");
                                    var newMessageId   = uuidv1();
                                    stmtInsertIntoMessages.run(

                                        newMessageId,
                                        sourceMessageId,
                                        folder,
                                        messageClient,
                                        "ADDED")

                                    dbsearch.run("commit");

                                })
                            } catch (err) {
                                //console.log("Error " + err + " with message ID: " + sourceMessageId);
                            }
                        };
                    };
                }
            )
        }, sqlite3.OPEN_READONLY)
    } catch(err) {
        //console.log("Error " + err + " with message ID: " + sourceMessageId);
    } finally {

    }
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

        if (msg.message_type == 'init') {
            setUpSql();



        } else if (msg.message_type == 'call_powershell') {

            setInterval(indexMessagesFn ,numberOfSecondsIndexMessagesInterval * 1000);
            setInterval(indexMessagesBodyFn ,numberOfSecondsIndexMessagesInterval * 1000);

            get_inbox_count(function(inbox){
                console.log("Inbox count: " + inbox);
                get_unread_message_count(function(unread){
                    console.log("Unread email count: " + unread);

                    get_all_inbox_message_ids(function(ids){
                        var fg = ids.length;
                        for (var i = 0; i < fg; i++) {
                            var sourceMessageId = ids[i];
                            //console.log("ID " + i + ": " + sourceMessageId);
                            insertNewMessage(  sourceMessageId, "INBOX","OUTLOOK"  )

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

    stmtSetMessageToError = dbsearch.prepare(   " update messages " +
                                                "     set status = 'ERROR' " +
                                                " where " +
                                                "     source_id = ?;");

    stmtSetMessageToBodyError = dbsearch.prepare(   " update messages " +
    "     set status = 'BODY_ERROR' " +
    " where " +
    "     source_id = ?;");

    stmtSetMessageToBodyRead = dbsearch.prepare(   " update messages " +
    "     set status = 'BODY_READ' " +
    " where " +
    "     source_id = ?;");





    stmtUpdateMessageDetails = dbsearch.prepare(    " update messages " +
                                                    "     set  " +
                                                    "         subject = ?, " +
                                                    "         received_by_name = ?, " +
                                                    "         received_time = ?, " +
                                                    "         recipients = ?, " +
                                                    "         sender_name = ?, " +
                                                    "         sent = ?, " +
                                                    "         sent_on = ?, " +
                                                    "         sent_on_behalf_of_name = ?, " +
                                                    "         to_email = ?, " +
                                                    "         body_format = ?, " +
                                                    "         send_using_account = ?, " +
                                                    "         task_subject = ?, " +
                                                    "         sender = ?, " +
                                                    "         cc = ?, " +
                                                    "         bcc = ?, " +
                                                    "         unread = ?, " +
                                                    "         sensitivity = ?, " +
                                                    "         outlook_version = ?, " +
                                                    "         outlook_internal_version = ?, " +
//zzz
                                                    "         status  = 'UPDATED' " +
                                                    " where " +
                                                    "     source_id = ?;");



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
    //console.log("******************8 call_powershell" );

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
            //console.log("Added command" + commands[i])
        }
        ps.invoke()
        .then(output => {
            var output2 = output.replace(/\r?\n|\r/g,"")

            //console.log("******************ps poutput" + output2 );

            //console.log("******************ps poutput" + JSON.stringify(s,null,2) );
            cb(output2);


        })
        .catch(err => {
            //console.log("******************Error parsing XML " + err);
            for ( var i = 0 ; i < commands.length ; i ++ ) {
                console.log("       " + commands[i])
            }
            cb(null);
        });
    } catch (err) {
        console.log("******************eee " + err);
        cb(null);
    }
}





function get_unread_message_count(cb) {

    var commands =[
        "$inbox = $mapi.GetDefaultFolder([Microsoft.Office.Interop.Outlook.OlDefaultFolders]::olFolderInbox);",
        "echo $inbox.UnReadItemCount | convertTo-XML -As String;"];

    call_powershell(
        function(ret){

            var s = parseXml(ret);

            cb( parseInt(s.children[0].children[1].children[0].text) )
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
            var s = parseXml(ret);
            cb( parseInt(s.children[0].children[1].children[0].text) )
        }
        ,
        commands);

}

function get_message_by_entry_id(i,cb) {
    //console.log("get_message_by_entry_id:  '" + i + "'")
    var itemStr = "$mail = $inbox.Items  | Where-Object {$_.EntryId -eq '" + i.toString() + "'} | select EntryID,Subject,ReceivedByName,ReceivedTime,Recipients,SenderName,Sent,SentOn,SentOnBehalfOfName,To,BodyFormat,SendUsingAccount,TaskSubject,Sender,CC,BCC,UnRead,Size,Sensitivity,Outlookversion,OutlookInternalVersion "
    //console.log("            itemStr:  '" + itemStr + "'")

    var commands =[
        "$inbox = $mapi.GetDefaultFolder([Microsoft.Office.Interop.Outlook.OlDefaultFolders]::olFolderInbox)",
        itemStr,
        "echo $mail | convertTo-XML -As String"
        ];

    call_powershell(
        function(ret){
            //console.log("                    :  " + ret)
                if (ret ) {
                    var s = parseXml(ret);
                    if (s.children[0].children[1]) {
                    var base = s.children[0].children[1].children
                    cb(
                        {
                            entry_id:                   base[1].children[0].text,
                            entry_subject:              base[3].children[0].text,
                            received_by_name:           base[5].children[0].text,
                            received_by_time:           base[7].children[0].text,
                            recipients:                 base[9].children[0].text,
                            sender_name:                base[11].children[0].text,
                            sent:                       base[13].children[0].text,
                            sent_on:                    base[15].children[0].text,
                            sent_on_behalf_of_name:     base[17].children[0].text,
                            to:                         base[19].children[0].text,
                            body_format:                base[21].children[0].text,
                            send_using_account:         base[23].children[0].text,
                            task_subject:               base[25].children[0].text,
                            sender:                     base[27].children[0].text,
                            cc:                         "",//base[29].children[0].text,
                            bcc:                        "",//base[31].children[0].text,
                            unread:                     base[33].children[0].text,
                            sensitivity:                base[35].children[0].text,
                            outlook_version:            base[37].children[0].text,
                            outlook_internal_version:   ""//base[39].children[0].text
                        }
                        //zzz
                    )
                } else {
                    cb(null)
                }
            } else {
                cb(null)
            }
        }
        ,
        commands);

}


function get_message_body_by_entry_id(i,cb) {
    //console.log("get_message_body_by_entry_id:  '" + i + "'")


    var commands =[
        "$inbox = $mapi.GetDefaultFolder([Microsoft.Office.Interop.Outlook.OlDefaultFolders]::olFolderInbox)",
        "$mail = $inbox.Items | Where-Object {$_.EntryId -eq '" + i.toString() + "'} | select EntryId, Body   | select Body",
        "echo $mail | Format-Table -Wrap -HideTableHeaders"
        ];

    call_powershell(
        function(ret) {
            //console.log("                    :  " + ret)
                if (ret ) {
                    cb(
                        {
                            body:                   ret
                        }
                        //zzz
                    );
                } else {
                    cb(null);
                };
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
            var s = parseXml(ret);
            var lene = []
            var fg = s.children[0].children.length;
            //console.log("XML length: " + fg)
            for (var i = 0; i < fg; i++) {
                //console.log("read message ID: " + i)
                var dj = s.children[0].children[i]
                if (dj.type == 'element') {
                    var fgh = dj.children[1].children[0].text;
                    //console.log("     read message ID: " + fgh)
                    lene.push(fgh)
                }
            }
            cb( lene )
        }
        ,
        commands);

}








//-----------------------------------------------------------------------------------------//
//                                                                                         //
//                                      indexMessagesFn                                    //
//                                                                                         //
// This indexes the messages for full text search                                          //
//                                                                                         //
//                                                                                         //
//                                                                                         //
//                                                                                         //
//                                                                                         //
//                                                                                         //
//-----------------------------------------------------------------------------------------//
var inIndexMessagesFn                = false;
var numberTimesIndexMessagesFnCalled = 0;

function indexMessagesFn() {

    //
    //  only allow this to be called once at a time
    //
    if (inIndexMessagesFn) {
        return;
    }
    inIndexMessagesFn = true;
    //console.log("  indexMessagesFn: " + (numberTimesIndexMessagesFnCalled++));


    //
    // Process any messages which have been added to the system. We know these as
    // the status is set to ADDED
    //
    try {
        dbsearch.serialize(
            function() {
                var stmt = dbsearch.all(
                        "SELECT * FROM messages WHERE status = 'ADDED' LIMIT 1 "
            ,
            function(err, results)
            {
                if (!err)
                {
                    if( results.length != 0)
                    {
                        var msg = results[0]
                        //console.log("Message ID: " + msg.source_id)
                        get_message_by_entry_id( msg.source_id , function(messageViaPowershell) {
                            //console.log("    eee: " + JSON.stringify(messageViaPowershell,null,2))
                            if (messageViaPowershell) {

                                dbsearch.serialize(function() {
                                    dbsearch.run("begin exclusive transaction");
                                    stmtUpdateMessageDetails.run(
                                        messageViaPowershell.entry_subject,
                                        messageViaPowershell.received_by_name,
                                        messageViaPowershell.received_by_time,
                                        messageViaPowershell.recipients,
                                        messageViaPowershell.sender_name,
                                        messageViaPowershell.sent,
                                        messageViaPowershell.sent_on,
                                        messageViaPowershell.sent_on_behalf_of_name,
                                        messageViaPowershell.to,
                                        messageViaPowershell.body_bormat,
                                        messageViaPowershell.send_using_account,
                                        messageViaPowershell.task_subject,
                                        messageViaPowershell.sender,
                                        messageViaPowershell.cc,
                                        messageViaPowershell.bcc,
                                        messageViaPowershell.unread,
                                        messageViaPowershell.sensitivity,
                                        messageViaPowershell.outlook_version,
                                        messageViaPowershell.outlook_internal_version,
                                        ///zzz
                                        msg.source_id)
                                    dbsearch.run("commit",
                                        function(err) {
                                            //console.log('Updated message: ' + messageViaPowershell.entry_subject);
                                            inIndexMessagesFn = false;
                                        })
                                    })
                                } else {
                                    dbsearch.serialize(function() {
                                        dbsearch.run("begin exclusive transaction");
                                        stmtSetMessageToError.run(msg.source_id)
                                        dbsearch.run("commit",
                                            function(err) {
                                                //console.log('set message to error');
                                                inIndexMessagesFn = false;
                                        })
                                    })
                                }
                    })
                } else {
                    //console.log("          else: 1 ");
                    inIndexMessagesFn = false;
                }
            } else {
                //console.log("          670 Error: " );
                inIndexMessagesFn = false;
           }
       })
   }, sqlite3.OPEN_READONLY)

    } catch (err) {
        //console.log("          674 Error: " + err);
        inIndexMessagesFn = false;
    }
}



function getSha1(contents) {
    try {
        var hash = crypto.createHash('sha1');
        hash.setEncoding('hex');
        hash.write(contents);
        hash.end();
        var sha1sum = hash.read();
        createContent(contents, sha1sum);
        return sha1sum;
    } catch (err) {
        return null;
    }
}




function createContent( contents,  sha1ofFileContents ) {
    //
    // create the content if it doesn't exist
    //
    dbsearch.serialize(
        function() {

            var stmt = dbsearch.all(
        "select  *  from  contents  where   id = ? ",

        [sha1ofFileContents],

        function(err, results)
        {
            if (!err)
            {
            if (results.length == 0) {
            try {
                var contentType = "EMAIL"
                dbsearch.serialize(function() {
                    dbsearch.run("begin exclusive transaction");

                    stmtInsertIntoContents.run(

                        sha1ofFileContents,
                        contents,
                        contentType)
                    dbsearch.run("commit");

                })
            } catch (err) {
            //console.log(err);
            }
            }
            }
        })
    },sqlite3.OPEN_READONLY)
}




var inIndexMessagesBodyFn                = false;
var numberTimesIndexMessagesBodyFnCalled = 0;

function indexMessagesBodyFn() {

    //
    //  only allow this to be called once at a time
    //
    if (inIndexMessagesBodyFn) {
        return;
    }
    inIndexMessagesBodyFn = true;
    //console.log("  indexMessagesBodyFn: " + (numberTimesIndexMessagesBodyFnCalled++));


    //
    // Process any messages which have been added to the system. We know these as
    // the status is set to ADDED
    //
    try {
        dbsearch.serialize(
            function() {
                var stmt = dbsearch.all(
                    "SELECT * FROM messages WHERE status = 'UPDATED' LIMIT 1 "
                    ,
                    function(err, results)
                    {
                        if (!err)
                        {
                            if( results.length != 0)
                            {
                                var msg = results[0]
                                try {
                                //console.log("Indexing Email Message ID: " + msg.source_id)
                                get_message_body_by_entry_id( msg.source_id , function(messageViaPowershell) {
                                    //console.log("    eee: " + JSON.stringify(messageViaPowershell,null,2))
                                    if (messageViaPowershell) {
                                      var emailBody = messageViaPowershell.body.replace(/[\n\r|�]/g, '\n');

                                        //console.log("message body: " + messageViaPowershell.body);
                                        var newSha1ofFileContents = getSha1(emailBody)

                                        dbsearch.serialize(function() {
                                            dbsearch.run("begin exclusive transaction");
                                            stmtSetMessageToBodyRead.run(msg.source_id,
                                                function(err) {
                                                    //console.log('set message to body read');
                                                    var newConnectionId = uuidv1();
                                                    stmtInsertIntoConnections.run(
                                                        newConnectionId,
                                                        msg.subject,
                                                        "outlook2012",
                                                        "|EMAIL|DOCUMENT|",
                                                        msg.source_id )


                                                    //console.log('set message to body read 2');
                                                    var newqueryid = uuidv1();
                                                    stmtInsertInsertIntoQueries.run(

                                                        newqueryid,
                                                        msg.subject,
                                                        newConnectionId,
                                                        "outlook2012",
                                                        1,//onDiskFileContentsSize,
                                                        newSha1ofFileContents,
                                                        msg.source_id,//fullFileNamePath,
                                                        "|DOCUMENT|",//documentType,
                                                        JSON.stringify({} , null, 2),
                                                        JSON.stringify([{message: 'No preview available'}] , null, 2),
                                                        timestampInSeconds()
                                                    )

                                                    //console.log('set message to body read 3');
                                                    dbsearch.run("commit",
                                                                function(err2) {
                                                                    //console.log('set message to body read 4');

                                                                        inIndexMessagesBodyFn = false;

                                                                        process.send({
                                                                            message_type:       "return_set_query",
                                                                            id:                 newqueryid,
                                                                            name:               msg.subject,
                                                                            connection:         newConnectionId,
                                                                            driver:             "outlook2012",
                                                                            size:               0,
                                                                            hash:               newSha1ofFileContents,
                                                                            fileName:           "email.txt",
                                                                            type:               "outlook2012",
                                                                            definition:         JSON.stringify({} , null, 2),
                                                                            preview:            JSON.stringify([{message: 'No preview available'}] , null, 2)});

                                                        })

                                                })

                                            })
                                            ///zzz
                                    } else {
                                        dbsearch.serialize(function() {
                                            dbsearch.run("begin exclusive transaction");

                                            stmtSetMessageToBodyError.run(msg.source_id)
                                            dbsearch.run("commit",
                                                function(err) {
                                                        //console.log('set message to error');
                                                        inIndexMessagesBodyFn = false;
                                            })

                                        })
                                    }
                            })
                            } catch (err) {
                                dbsearch.serialize(function() {
                                    dbsearch.run("begin exclusive transaction");

                                    stmtSetMessageToBodyError.run(msg.source_id)
                                    dbsearch.run("commit",
                                        function(err) {
                                                //console.log('set message to error');
                                                inIndexMessagesBodyFn = false;
                                    })

                                })
                            }
                        } else {
                            //console.log("          else: 2");
                            inIndexMessagesBodyFn = false;
                        }
                    } else {
                        //console.log("          670 Error: " );
                        inIndexMessagesBodyFn = false;
                   }
               })
           }, sqlite3.OPEN_READONLY)
    } catch (err) {
        //console.log("          674 Error: " + err);
        inIndexMessagesBodyFn = false;
}
}
