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


var inProcessFilesFn                    = false;
var isWin                               = /^win/.test(process.platform);
var numberOfSecondsIndexFilesInterval   = 5;
var inScan                              = false;
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










sendTestHeartBeat();

processMessagesFromMainProcess();

testDiffFn();

















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
    stmtInsertIntoIntranetClientConnects = dbsearch.prepare(" insert  into  intranet_client_connects " +
                            "    ( id, internal_host, internal_port, public_ip, via, public_host, user_name, client_user_name, when_connected) " +
                            " values " +
                            "    (?,   ?,?,?,?,  ?,?,?,?);");

    stmtInsertIntoConnections2 = dbsearch.prepare(" insert into connections " +
                                "    ( id, name, driver, database, host, port, connectString, user, password, fileName, preview ) " +
                                " values " +
                                "    (?,  ?,?,?,?,?,?,?,?,?,?);");

    stmtInsertIntoQueries = dbsearch.prepare(" insert into data_states " +
                                "    ( id, name, connection, driver, definition, status, type ) " +
                                " values " +
                                "    (?,    ?, ?, ?, ?, ?, ?);");

    stmtInsertDriver = dbsearch.prepare(" insert or replace into drivers " +
                                "    (id,  name, type, code ) " +
                                " values " +
                                "    (?, ?,?,?);");

    stmtUpdateDriver = dbsearch.prepare(" update   drivers   set code = ? where id = ?");

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



    stmtInsertInsertIntoQueries = dbsearch.prepare(" insert into data_states " +
                                "    ( id, name, connection, driver, size, hash, fileName, type, definition, preview, similar_count , when_timestamp) " +
                                " values " +
                                "    (?,  ?,?,?,  ?,?,?, ?,?,?, 1,  ?);");

    stmtUpdateRelatedDocumentCount = dbsearch.prepare(" update data_states " +
                                "    set  similar_count = ?  " +
                                " where  " +
                                "    id = ? ;");

    stmtUpdateRelationships = dbsearch.prepare(" update data_states " +
                                "    set  related_status = ?  " +
                                " where  " +
                                "    hash = ? ;");
    stmt2 = dbsearch.prepare("INSERT INTO zfts_search_rows_hashed (row_hash, data) VALUES (?, ?)");

    stmt3 = dbsearch.prepare("INSERT INTO search_rows_hierarchy (document_binary_hash, parent_hash, child_hash) VALUES (?,?,?)");

    setIn =  dbsearch.prepare("UPDATE data_states SET index_status = ? WHERE id = ?");
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




function getSha1(fileName) {
    try {
        var contents = fs.readFileSync(fileName, "utf8");
        var hash = crypto.createHash('sha1');
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
                                            path.basename(fullFilePath)),
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
//                                    getRelatedDocuments                                  //
//                                                                                         //
//                                                                                         //
//                                                                                         //
//                                                                                         //
//                                                                                         //
//                                                                                         //
//                                                                                         //
//-----------------------------------------------------------------------------------------//
function getRelatedDocuments(  id,  callback  ) {
        //console.log("In getRelatedDocuments" );
    var sql = "select  " +
                "    distinct(id), cc, name, driver, size from ( " +
                "            select document_binary_hash,  count(child_hash) as cc from  " +
                "            search_rows_hierarchy where child_hash in ( " +
                "            select  " +
                "                child_hash " +
                "            from  " +
                "                search_rows_hierarchy " +
                "            where  " +
                "                document_binary_hash = ( " +
                "                    select   " +
                "                        hash from data_states where id = '" + id+ "' " +
                "                 )) group by document_binary_hash ) as ttt,  " +
                "            data_states " +
                "where hash = document_binary_hash " +
                "group by id " +
                "order by cc desc "


    try
    {
        //console.log("**** : **********************")
        //console.log("**** : **********************")
        //console.log("**** : **********************")
         dbsearch.serialize(function() {
        var stmt = dbsearch.all(
            sql,
            function(err, results)
            {
                if (!err)
                {
                    dbsearch.serialize(function() {
                        dbsearch.run("begin exclusive transaction");
                        stmtUpdateRelatedDocumentCount.run(
                            results.length,
                            id)

                        dbsearch.run("commit");
                        })

                    for (var i = 0; i < results.length; i ++) {
                        //console.log("**** : " + JSON.stringify(results[i],null,2));
                        //var dxz = diffFn();
                    }



                    //console.log("OK")
                    if (callback) {
                        callback(results);
                    }
                    process.send({  message_type:       "return_similar_documents",
                                    query_id:            id,
                                    results: JSON.stringify(results,null,2)  });
                }
            })
        }, sqlite3.OPEN_READONLY)
    } catch(err) {
        console.log(err);
        var stack = new Error().stack
        console.log( stack )

        process.send({  message_type:       "return_similar_documents",
        sqlite: "Err: " + err  });

    }
}







//-----------------------------------------------------------------------------------------//
//                                                                                         //
//                                 getRelatedDocumentHashes                                //
//                                                                                         //
//                                                                                         //
//                                                                                         //
//                                                                                         //
//                                                                                         //
//                                                                                         //
//                                                                                         //
//-----------------------------------------------------------------------------------------//
function getRelatedDocumentHashes(  doc_hash,  callback  ) {
    if (inGetRelatedDocumentHashes) {
        return;
    }
    inGetRelatedDocumentHashes = true;
    //console.log("In getRelatedDocuments" );
    var sql =
                "select                                                                       " +
                "    distinct(hash), cc, driver, size from (                                  " +
                "        select document_binary_hash,  count(child_hash) as cc from           " +
                "            search_rows_hierarchy where child_hash in (                      " +
                "                select                                                       " +
                "                   child_hash                                                " +
                "                from                                                         " +
                "                        search_rows_hierarchy                                " +
                "                where                                                        " +
                "                       document_binary_hash = '" + doc_hash + "')            " +
                "                group by document_binary_hash ) as ttt,                      " +
                "                data_states                                                      " +
                "             where hash = document_binary_hash                               " +
                "               group by id                                                   " +
                "                order by cc desc                                             " ;


    try
    {
        dbsearch.serialize(
            function() {
        var stmt = dbsearch.all(
            sql,
            function(err, results)
            {
                if (!err)
                {
                    for (var i = 0 ; i < results.length; i++) {
                        if (results[i]) {
                            var target_hash = results[i].hash;
                            //console.log("    " + doc_hash + " : " + target_hash );

                            if (target_hash) {
                                var similar_count = results[i].size;
                                createRelationship(doc_hash, target_hash, similar_count);
                            }
                        }
                    }
                    dbsearch.serialize(
                        function() {
                            dbsearch.run("begin exclusive transaction");
                            stmtUpdateRelationships.run(
                                'INDEXED',
                                doc_hash)
                            dbsearch.run("commit");
                            })

                    //console.log("       OK")
                    if (callback) {
                        callback(results);
                    }
                    process.send({  message_type:       "return_similar_hashes",
                                    document_hash:       doc_hash,
                                    results: JSON.stringify(results,null,2)  });
                }
            })
        }, sqlite3.OPEN_READONLY)
    } catch(err) {
        console.log(err);
        var stack = new Error().stack
        console.log( stack )

                        process.send({  message_type:       "return_similar_hashes",
                                        sqlite: "Err: " + err  });

    }
    inGetRelatedDocumentHashes = false;
}

















//-----------------------------------------------------------------------------------------//
//                                                                                         //
//                                      findFoldersFn                                      //
//                                                                                         //
// This indexes the data_states for full text search                                           //
//                                                                                         //
//                                                                                         //
//                                                                                         //
//                                                                                         //
//                                                                                         //
//                                                                                         //
//-----------------------------------------------------------------------------------------//
function findFoldersFn() {
    //console.log("**  called findFoldersFn");

	var useDrive = "C:\\";
    if (!isWin) {
        useDrive = '/';
    }

    dbsearch.serialize(
        function() {
            dbsearch.run("begin exclusive transaction");
            stmtResetFolders.run()
            stmtResetFiles.run()
            dbsearch.run("commit",
                function(err) {
                    directSearchFolders(useDrive);
                    console.log('******************* Finished finding folders');
                    finishedFindingFolders = true;
                    });
                })



    //remoteWalk(useDrive);



    //    sendOverWebSockets({
    //                            type:   "server_scan_status",
    //                            value:  "Hard disk scan in progress"
    //                            });
}









//-----------------------------------------------------------------------------------------//
//                                                                                         //
//                                      indexFilesFn                                       //
//                                                                                         //
// This indexes the data_states for full text search                                           //
//                                                                                         //
//                                                                                         //
//                                                                                         //
//                                                                                         //
//                                                                                         //
//                                                                                         //
//-----------------------------------------------------------------------------------------//
function indexFilesFn() {
    console.log("indexFilesFn called...");
    //console.log("    inScan: " + inScan);
   if (inScan) {
     return;
   };

   if (isPcDoingStuff) {
       //return;
   };
   console.log("      Indexing");

   try {
       dbsearch.serialize(function() {
    var stmt = dbsearch.all(
        "SELECT * FROM data_states WHERE index_status IS NULL LIMIT 1 " ,
        function(err, results)
        {
            if (!err)
            {
                if( results.length != 0)
                {
                    console.log("          : " + JSON.stringify(results[0].driver,null,2));


                            getResult(  results[0].id,
                                        results[0].connection,
                                        results[0].driver,
                                        {},
                                        function(result)
                                        {

                                            if (!result.error) {
                                                //console.log("File added v2: " + JSON.stringify(results[0].fileName,null,2));
                                                /*sendOverWebSockets({
                                                                        type:   "server_scan_status",
                                                                        value:  "File indexed: " + results[0].fileName
                                                                        });*/
                                            }
                                        });
                } else {
                    //console.log("          else: ");
                }
            } else {
                console.log("          670 Error: " );
           }
        })
    }, sqlite3.OPEN_READONLY)
   } catch (err) {
       console.log(err);
       var stack = new Error().stack
       console.log( stack )

      }
}
















//-----------------------------------------------------------------------------------------//
//                                                                                         //
//                                         getResult                                       //
//                                                                                         //
//                                                                                         //
//                                                                                         //
//                                                                                         //
//                                                                                         //
//                                                                                         //
//                                                                                         //
//-----------------------------------------------------------------------------------------//
function getResult(  source,  connectionName,  driverName,  definition,  callback  ) {
    console.log("var getResult = function(" + source + ", " + connectionName + ", " + driverName );

    var error = new Object();
    getConnection(connectionName, function(connection) {
        if (connection) {
            console.log("     02");
            try {
                //console.log("22");
                dbsearch.serialize(function() {
                    dbsearch.run("begin exclusive transaction");
                    setIn.run(
                        "PROCESSING",
                        source)
                    dbsearch.run("commit",
                        function(err){

                            getDriver(driverName, function(driver) {
                                if (driver) {
                                    eval(driver.code)['get_v2'](
                                connection,
                                definition
                                ,
                                function(ordata) {
                                    //console.log("23");
                                    if (ordata.error) {
                                        dbsearch.serialize(
                                            function() {
                                            //console.log("24");
                                            //console.log("****************** err 4:" + ordata.error);
                                            //console.log("25");
                                            dbsearch.run("begin exclusive transaction");
                                            setIn.run(
                                                "ERROR: " + ordata.error,
                                                source)
                                            dbsearch.run("commit",
                                                function(err) {
                                                    callback.call(this,{error: true});
                                                });

                                    })
                            } else {
                                //console.log("26");
                                var rrows = [];
                                if( Object.prototype.toString.call( ordata ) === '[object Array]' ) {
                                    rrows = ordata;
                                } else {
                                    rrows = ordata.values;
                                }
                                //console.log("27");
                                //console.log( "   ordata: " + JSON.stringify(ordata));
                                var findHashSql = "select  hash from data_states where id = '" + source + "'";
                                //console.log("FindHashSql : " + findHashSql );
                                //console.log("1");
                                dbsearch.serialize(function() {
                                var stmt4 = dbsearch.all(
                                    findHashSql
                                    ,
                                    function(err, results2) {
                                        //console.log("2");
                                        if( err) {
                                            console.log("Error: " + JSON.stringify(error) + "'");
                                        }
                                        if( results2.length == 0) {
                                            console.log("No sresults for hash" + source + "'");
                                        }
                                        var binHash = results2[0].hash;
                                        dbsearch.serialize(
                                            function() {
                                                var stmt = dbsearch.all(
                                                            "select  " +
                                                            "    document_binary_hash  "  +
                                                            "from  " +
                                                            "    search_rows_hierarchy  " +
                                                            "where  " +
                                                            "    document_binary_hash = '" + binHash + "'"
                                                            ,
                                        function(err, results) {
                                            //console.log("3");
                                            if (!err) {
                                                //console.log("4");
                                                if( results.length == 0) {
                                                    //console.log("5");

                                                    callback.call(this,ordata);
                                                    //console.log("Inserting rows");

                                                    if (rrows && rrows.length) {
                                                        dbsearch.serialize(
                                                            function() {
                                                                dbsearch.run("begin exclusive transaction");
                                                                //console.log("Committing... " + rrows.length)
                                                                for (var i = 0 ; i < rrows.length; i++) {

                                                                    var rowhash = crypto.createHash('sha1');
                                                                    var row = JSON.stringify(rrows[i]);
                                                                    rowhash.setEncoding('hex');
                                                                    rowhash.write(row);
                                                                    rowhash.end();
                                                                    var sha1sum = rowhash.read();
                                                                    //console.log('                 : ' + JSON.stringify(rrows[i]));
                                                                    stmt2.run(sha1sum, row)
                                                                    stmt3.run(binHash, null, sha1sum)


                                                                }
                                                                //console.log("Committed: " + rrows.length)
                                                                //console.log('                 : ' + JSON.stringify(rrows.length));
                                                                //console.log('                 source: ' + JSON.stringify(source));
                                                                setIn.run("INDEXED",source)
                                                                dbsearch.run("commit");

                                                        })

                                                    } else {
                                                        //console.log("****************** err 2");
                                                        callback.call(this,{error: true});
                                                        dbsearch.serialize(
                                                            function() {
                                                                dbsearch.run("begin exclusive transaction");
                                                                setIn.run("INDEXED: Other error",source)
                                                                dbsearch.run("commit");
                                                            })
                                                    }
                                                } else {
                                                    //console.log("****************** err 5: no rows");
                                                    callback.call(this,ordata);
                                                    dbsearch.serialize(function() {
                                                        dbsearch.run("begin exclusive transaction");
                                                        setIn.run("INDEXED: ",source)
                                                        dbsearch.run("commit");
                                                    });
                                                }
                                            } else {
                                                //console.log("****************** err 3" + err);
                                                dbsearch.serialize(function() {
                                                    dbsearch.run("begin exclusive transaction");
                                                    setIn.run("ERROR: " + err, source)
                                                    dbsearch.run("commit");


                                                    callback.call(this,{error: true});
                                                })
                                            }
                                        });
                                    }, sqlite3.OPEN_READONLY)
                                })
                            }, sqlite3.OPEN_READONLY)

                        }})
                    }})
                    });

                }
                )

            }
            catch(err){
                console.log(err);
                var stack = new Error().stack
                console.log( stack )

                //console.log("03");
                //console.log("****************** err 1: " + err);
                callback.call(this,{error: true});
            }
        } else {
            //console.log("04");
            //console.log("****************** err 7 child for connection: " +connection );
            dbsearch.serialize(function() {
                //console.log("05");
                dbsearch.run("begin exclusive transaction");
                setIn.run("ERROR: no connection for " + source , source)
                dbsearch.run("commit",
                    function(err){
                        callback.call(this,{error: true});
                });

            });
        }
    })
    //console.log("****************** err 10 child for connection: " +connection );
}







//-----------------------------------------------------------------------------------------//
//                                                                                         //
//                                           diffFn                                        //
//                                                                                         //
//                                                                                         //
//                                                                                         //
//                                                                                         //
//                                                                                         //
//                                                                                         //
//                                                                                         //
//-----------------------------------------------------------------------------------------//
function diffFn( lhs2,  rhs2 ) {
    var differences = diff(lhs2, rhs2);
    if ((typeof differences !== 'undefined')) {
        return {
                new:     differences.filter(function (el) {return el.kind == 'N'}).length,
                deleted: differences.filter(function (el) {return el.kind == 'D'}).length,
                edited:  differences.filter(function (el) {return el.kind == 'E'}).length,
                array:   differences.filter(function (el) {return el.kind == 'A'}).length
        };
    }
    return {
                new:     -1,
                deleted: -1,
                edited:  -1,
                array:   -1
    }

};






function getFileName(str) {
    return str.split('\\').pop().split('/').pop();
}

function saveFullPath( fullPath ) {
    if (!fullPath) {
        return
    }

    try {
        markFileForProcessing( fullPath )
    } catch (err) {
        console.log(err);
        var stack = new Error().stack
        console.log( stack )
    }
}



//-------------------------------------------------------------------------------//
//                                                                               //
//                                  processFilesFn                               //
//                                                                               //
//        This is called at intervals to process the files                       //
//                                                                               //
//-------------------------------------------------------------------------------//
function processFilesFn() {
    //console.log("processFilesFn")

    //if (isPcDoingStuff) {
    //    return;
    //};

    if (inProcessFilesFn) {
        return;
    }

    inProcessFilesFn = true





    // ---------------------------------------------------------------------------
    //
    // if we are reindexing a file
    //
    // ---------------------------------------------------------------------------

    try {
        dbsearch.serialize(function() {
        var stmt = dbsearch.all(
            "SELECT  " +

            "    files.id                   as id, " +
            "    files.fk_connection_id     as fk_connection_id," +
            "    connections.driver         as driver," +
            "    files.size                 as fileSize," +
            "    files.path                 as path," +
            "    files.orig_name            as orig_name," +
            "    connections.type           as type " +

            "FROM " +
            "    files, connections WHERE files.status = 'INDEXED' " +
            "and files.fk_connection_id = connections.id and files.fk_connection_id not null LIMIT 1 "
            ,

            function(err, results)
            {
                //console.log("    .... " + err)
                //console.log("    .... " + results.length)
                if (!err)
                {
                    //
                    // if there is a query where nothing has been done then index it
                    //
                    if( results.length != 0)
                    {
                        var returnedRecord = results[0];
                        var existingConnectionId = returnedRecord.fk_connection_id
                        var driverName = returnedRecord.driver
                        var fileContentsSize = returnedRecord.fileSize
                        var sha1ofFileContents = returnedRecord.sha1ofFileContents
                        var fullFileNamePath = path.join(returnedRecord.path , returnedRecord.orig_name)
                        var documentType = returnedRecord.type
                        var fileScreenName = returnedRecord.orig_name


                        dbsearch.serialize(
                            function() {
                                dbsearch.run("begin exclusive transaction");
                                stmtUpdateFileStatus.run( "REINDEXED", returnedRecord.id)
                                dbsearch.run("commit",
                                    function(err) {
                                        try {

                                            if (fs.existsSync(fullFileNamePath)) {
                                                var stat = fs.statSync(fullFileNamePath)
                                                var onDiskFileContentsSize = stat.size
                                                if (onDiskFileContentsSize != fileContentsSize) {

                                                    //console.log("existingConnectionId: " + existingConnectionId)
                                                    //console.log("driver: " + driverName)
                                                    //console.log("fileContentsSize: " + fileContentsSize)
                                                    //console.log("sha1ofFileContents: " + sha1ofFileContents)
                                                    //console.log("fullFileNamePath: " + fullFileNamePath)
                                                    //console.log("documentType: " + documentType)

                                                    var newSha1ofFileContents = getSha1(fullFileNamePath)



                                        dbsearch.serialize(function() {
                                            //console.log("    2")
                                            //console.log("    3")
                                            if (err) {
                                                console.log('   err 1 : ' + err);
                                                dbsearch.run("begin exclusive transaction");
                                                stmtUpdateFileStatus.run( "ERROR", returnedRecord.id)
                                                dbsearch.run("commit");
                                                inProcessFilesFn = false
                                            } else {

                                                //console.log("    4")
                                                var newqueryid = uuidv1();
                                                dbsearch.run("begin exclusive transaction");
                                                stmtInsertInsertIntoQueries.run(

                                                    newqueryid,
                                                    fileScreenName,
                                                    existingConnectionId,
                                                    driverName,
                                                    onDiskFileContentsSize,
                                                    newSha1ofFileContents,
                                                    fullFileNamePath,
                                                    documentType,
                                                    JSON.stringify({} , null, 2),
                                                    JSON.stringify([{message: 'No preview available'}] , null, 2),
                                                    timestampInSeconds()
                                                )
                                                dbsearch.run("commit",

                                                    function(err2) {
                                                        if (err2) {
                                                            console.log('   1033 err2 : ' + err2);
                                                            dbsearch.serialize(
                                                                function() {
                                                                    dbsearch.run("begin exclusive transaction");
                                                                    stmtUpdateFileStatus.run( "ERROR", returnedRecord.id)
                                                                    dbsearch.run("commit");
                                                                })
                                                        } else {
                                                            dbsearch.serialize(
                                                                function() {
                                                                    dbsearch.run("begin exclusive transaction");
                                                                    stmtFileChanged.run(
                                                                        newSha1ofFileContents,
                                                                        onDiskFileContentsSize,
                                                                        returnedRecord.id)
                                                                        dbsearch.run("commit",
                                                                        function(err9) {
                                                                            if (err9) {
                                                                                inProcessFilesFn = false
                                                                                dbsearch.serialize(
                                                                                    function() {
                                                                                        dbsearch.run("begin exclusive transaction");
                                                                                        stmtUpdateFileStatus.run( "ERROR", returnedRecord.id)
                                                                                        dbsearch.run("commit");
                                                                                    })
                                                                            }
                                                                            else {
                                                                                process.send({
                                                                                                message_type:       "return_set_query",
                                                                                                id:                 newqueryid,
                                                                                                name:               fileScreenName,
                                                                                                connection:         existingConnectionId,
                                                                                                driver:             driverName,
                                                                                                size:               fileContentsSize,
                                                                                                hash:               sha1ofFileContents,
                                                                                                fileName:           fullFileNamePath,
                                                                                                type:               driverName,
                                                                                                definition:         JSON.stringify({} , null, 2),
                                                                                                preview:            JSON.stringify([{message: 'No preview available'}] , null, 2)});

                                                                            }
                                                                            inProcessFilesFn = false
                                                                        }
                                                                )
                                                            })
                                                        //console.log("    5")
                                                        }
                                                        inProcessFilesFn = false
                                                        }

                                                );
                                            }



                                        });
                                    }
                                    } else {
                                        dbsearch.serialize(
                                            function() {
                                                dbsearch.run("begin exclusive transaction");
                                                stmtUpdateFileStatus.run( "DELETED", returnedRecord.id)
                                                dbsearch.run("commit",
                                                    function(err) {
                                                    inProcessFilesFn = false
                                                    //console.log("          Error eee: " + eee);
                                            })
                                        })
                                    }
                                } catch (eee) {
                                    console.log(eee);
                                    var stack = new Error().stack
                                    console.log( stack )

                                    dbsearch.serialize(
                                        function() {
                                            dbsearch.run("begin exclusive transaction");
                                            stmtUpdateFileStatus.run( "ERROR", returnedRecord.id)
                                            dbsearch.run("commit",
                                                function(err) {
                                                    inProcessFilesFn = false
                                                    console.log("          Error eee: " + eee);
                                            })
                                        })
                                    }
                                })
                            })

                    } else {
                        inProcessFilesFn = false
                    }
                }
            })
        }, sqlite3.OPEN_READONLY)



    } catch (err) {
        console.log(err);
        var stack = new Error().stack
        console.log( stack )
        inProcessFilesFn = false
    }





    // ---------------------------------------------------------------------------
    //
    // if it is the first time that we are creating a file
    //
    // ---------------------------------------------------------------------------

    try {
        dbsearch.serialize(function() {
        var stmt = dbsearch.all(
            " SELECT  " +

            "     files.id                   as id, " +
            "     files.path                 as path," +
            "     files.orig_name            as orig_name" +

            " FROM " +
            "     files WHERE files.status IS NULL " +
            " LIMIT 1 "
            ,

            function(err, results)
            {
                //console.log("    .... " + err)
                //console.log("    .... " + results.length)
                //console.log("    11")

                if (!err)
                {
                    //
                    // if there is a file listed, where nothing has been done then index it
                    //
                    if( results.length != 0)
                    {
                        //console.log("    12")
                        var returnedRecord = results[0];

                        dbsearch.serialize(
                            function() {
                                dbsearch.run("begin exclusive transaction");
                                stmtUpdateFileStatus.run( "INDEXED", returnedRecord.id)
                                dbsearch.run("commit");
                            })

                        var fullFileNamePath = path.join(returnedRecord.path , returnedRecord.orig_name)

                        //console.log("fullFileNamePath: " + fullFileNamePath)


                        if (fs.existsSync(fullFileNamePath)) {
                        var stat = fs.statSync(fullFileNamePath)
                        if (stat && !stat.isDirectory()) {
                            //console.log("    13")
                            var fileName = getFileName(fullFileNamePath)
                            var driverName = null
                            var documentType = null
                            if (isExcelFile(fullFileNamePath)) {
                                documentType    = '|SPREADSHEET|'
                                driverName      = 'excel'
                            }
                            if (isGlbFile(fullFileNamePath)) {
                                documentType    = '|GLB|'
                                driverName      = 'glb'
                            }
                            if (isCsvFile(fullFileNamePath)) {
                                documentType    = '|CSV|'
                                driverName      = 'csv'
                            }
                            if (isTextFile(fullFileNamePath)) {
                                documentType    = '|DOCUMENT|'
                                driverName      = 'txt'
                            }
                            if (isWordFile(fullFileNamePath)) {
                                documentType    = '|DOCUMENT|'
                                driverName      = 'word'
                            }
                            if (isPdfFile(fullFileNamePath)) {
                                documentType    = '|DOCUMENT|'
                                driverName      = 'pdf'
                            }

                            //console.log("Document type: " + documentType)
                            if (documentType) {
                                var screenName = fileName.replace(/[^\w\s]/gi,'');
                                var newConnectionId = uuidv1();

                                dbsearch.serialize(
                                    function() {
                                        dbsearch.run("begin exclusive transaction");
                                        stmtInsertIntoConnections.run(
                                            newConnectionId,
                                            screenName,
                                            driverName,
                                            documentType,
                                            fullFileNamePath)

                                        dbsearch.run("commit",
                                            function(err) {
                                                //console.log("14")

                                                process.send({
                                                            message_type:       "return_set_connection",
                                                    id:         newConnectionId,
                                                    name:       screenName,
                                                    driver:     driverName,
                                                    type:       documentType,
                                                    fileName:   fullFileNamePath
                                        });

                                        var sha1ofFileContents = getSha1(fullFileNamePath)
                                        var stat = fs.statSync(fullFileNamePath)
                                        var fileContentsSize = stat.size



                                        var newqueryid = uuidv1();
                                        dbsearch.serialize(
                                            function() {
                                                dbsearch.run("begin exclusive transaction");
                                        stmtInsertInsertIntoQueries.run(

                                            newqueryid,
                                            screenName,
                                            newConnectionId,
                                            driverName,
                                            fileContentsSize,
                                            sha1ofFileContents,
                                            fullFileNamePath,
                                            documentType,
                                            JSON.stringify({} , null, 2),
                                            JSON.stringify([{message: 'No preview available'}] , null, 2),
                                            timestampInSeconds())

                                        dbsearch.run("commit",
                                            function(err2) {
                                                if (err2) {
                                                    console.log('   1225: err in stmtInsertInsertIntoQueries.run( : ' + err2);
                                                } else {
                                                    process.send({
                                                                    message_type:       "return_set_query",
                                                                    id:                 newqueryid,
                                                                    name:               screenName,
                                                                    connection:         newConnectionId,
                                                                    driver:             driverName,
                                                                    size:               fileContentsSize,
                                                                    hash:               sha1ofFileContents,
                                                                    fileName:           fullFileNamePath,
                                                                    type:               driverName,
                                                                    definition:         JSON.stringify({} , null, 2),
                                                                    preview:            JSON.stringify([{message: 'No preview available'}] , null, 2)});

                                                                    dbsearch.serialize(
                                                                        function() {
                                                                            dbsearch.run("begin exclusive transaction");
                                                    stmtUpdateFileSizeAndShaAndConnectionId.run(
                                                        sha1ofFileContents,
                                                        fileContentsSize,
                                                        newConnectionId,
                                                        returnedRecord.id)

                                                    dbsearch.run("commit",
                                                        function(err3) {
                                                            //console.log('   CRETAED : ' + returnedRecord.id);
                                                            if (err3) {
                                                                console.log('   err3 : ' + err3);
                                                                dbsearch.serialize(
                                                                    function() {
                                                                        dbsearch.run("begin exclusive transaction");
                                                                        stmtUpdateFileStatus.run( "ERROR", returnedRecord.id)
                                                                        dbsearch.run("commit");
                                                                    })
                                                            }
                                                            inProcessFilesFn = false
                                                    })
                                                })
                                                }
                                        })
                                    })
                                    }
                                );
                            })

                            } else {
                                dbsearch.serialize(
                                    function() {
                                        dbsearch.run("begin exclusive transaction");
                                stmtUpdateFileStatus.run( "ERROR", returnedRecord.id)
                                dbsearch.run("commit");
                                inProcessFilesFn = false
                            })
                            }
                        }
                        } else {
                            dbsearch.serialize(
                                function() {
                                    dbsearch.run("begin exclusive transaction");
                            stmtUpdateFileStatus.run( "DELETED", returnedRecord.id)
                            dbsearch.run("commit");
                            inProcessFilesFn = false
                        })
                        }

                } else {
                    inProcessFilesFn = false
                }

            }
        })
    }, sqlite3.OPEN_READONLY)

    } catch (err) {
        console.log(err);
        var stack = new Error().stack
        console.log( stack )
        inProcessFilesFn = false
    }
}

//-------------------------------------------------------------------------------//
//                                                                               //
//                              findFilesInFoldersFn                             //
//                                                                               //
//        This is called at intervals to find the files in a folder              //
//                                                                               //
//-------------------------------------------------------------------------------//
function findFilesInFoldersFn() {
    //if (isPcDoingStuff) {
    //    return;
    //};

    //if (finishedFindingFolders == false) {
    //    return;
    //}



    try {
        dbsearch.serialize(
            function() {

        var stmt = dbsearch.all(
            "SELECT * FROM folders WHERE status IS NULL LIMIT 1 "
            ,

            function(err, results)
            {
                if (!err)
                {
                    if( results.length != 0)
                    {
                        var folderRecord = results[0]
                        fs.readdir(folderRecord.path, function(err, list) {
                            if (err) {
                                console.log(err)
                            } else {
                                list.forEach(function(file) {
                                    var fullPath = path.join(folderRecord.path , file)
                                    if (fileFilter.test(file)) {
                                        saveFullPath(fullPath)
                                    }
                                })
                            }
                      })
                      dbsearch.serialize(
                          function() {
                              dbsearch.run("begin exclusive transaction");
                              stmtUpdateFolder.run("INDEXED", folderRecord.id)
                              dbsearch.run("commit");
                          })
                    };
                }
           })

       }, sqlite3.OPEN_READONLY)
    } catch (err) {
        console.log(err);
        var stack = new Error().stack
        console.log( stack )
    }
}




//-------------------------------------------------------------------------------//
//                                                                               //
//                            indexFileRelationshipsFn                           //
//                                                                               //
//        This is called at intervals to index the relationships of a file       //
//                                                                               //
//-------------------------------------------------------------------------------//
function indexFileRelationshipsFn() {
    if (isPcDoingStuff) {
        return;
    };

    if (inIndexFileRelationshipsFn) {
        return;
    }
    inIndexFileRelationshipsFn = true;



    try {
        dbsearch.serialize(
            function() {

        var stmt = dbsearch.all(
            "SELECT * FROM data_states WHERE related_status IS NULL LIMIT 1 "
            ,

            function(err, results)
            {
                if (!err)
                {
                    //
                    // if there is a query where nothing has been done then index it
                    //
                    if( results.length != 0)
                    {
                        //console.log("" );
                        //console.log("" );
                        //console.log("In indexFileRelationshipsFn  " );
                        //console.log("      SOURCE ITEM : " + JSON.stringify(results[0].name,null,2));
                        var queryToIndex = results[0];

                        getRelatedDocumentHashes(queryToIndex.hash, function(relatedResults) {
                            //console.log("      Related hashes: " + JSON.stringify(relatedResults.length,null,2));

                            if (relatedResults.length > 0) {
                                var returnValues1;
                                getResult(
                                    queryToIndex.id,
                                    queryToIndex.connection,
                                    queryToIndex.driver,
                                    {},
                                    function(queryResult)
                                    {

                                        if (!queryResult.error) {
                                            if (queryResult.values && (queryResult.values.constructor === Array)) {
                                                returnValues1 = queryResult.values;
                                            } else if (queryResult && (queryResult.constructor === Array)) {
                                                returnValues1 = queryResult;
                                            }
                                            if (returnValues1.constructor === Array) {
                                            //console.log("     SOURCE ITEM COUNT : " + " = " + returnValues1.length);


                                            //console.log("**getRelatedDocumentHashes returned: " + results.length);
                                            for (var i = 0; i < relatedResults.length; i ++) {
                                                //console.log("         **** : " + JSON.stringify(relatedResults[i],null,2));
                                                dbsearch.serialize(
                                                    function() {
                                                var stmt = dbsearch.all(
                                                    "SELECT * FROM data_states WHERE hash = '" + relatedResults[i].hash + "'" ,
                                                    function(err, results)
                                                    {
                                                        if (!err)
                                                        {
                                                            if( results.length != 0)
                                                            {
                                                                var relatedQuery = results[0];
                                                                //console.log("         RELATED ITEM : " + JSON.stringify(relatedQuery.name,null,2));
                                                                getResult(
                                                                    relatedQuery.id,
                                                                    relatedQuery.connection,
                                                                    relatedQuery.driver,
                                                                    {},
                                                                    function(queryResult2)
                                                                    {

                                                                        if (!queryResult2.error) {
                                                                            var returnValues;
                                                                            if (queryResult2.values && (queryResult2.values.constructor === Array)) {
                                                                                returnValues = queryResult2.values
                                                                            } else if (queryResult2 && (queryResult2.constructor === Array)) {
                                                                                returnValues = queryResult2
                                                                            }
                                                                            //console.log("     RELATED ITEM COUNT : " + " = " + returnValues.length);
                                                                            //JSON.stringify(
                                                                            var x1 = returnValues1
                                                                            var x2 = returnValues
                                                                            //console.log("          LHS : " + results[0].name + " = " + x1.length);
                                                                            //console.log("          RHS : " + relatedQuery.name + " = " + x2.length);
                                                                            if ((x1.constructor === Array) && (x2.constructor === Array)) {

                                                                                var xdiff = diffFn(returnValues1, returnValues);
                                                                                //console.log("          N: "  + JSON.stringify(xdiff.new,null,2))
                                                                                //console.log("          D: "  + JSON.stringify(xdiff.deleted,null,2))
                                                                                //console.log("          E: "  + JSON.stringify(xdiff.edited,null,2))
                                                                                //console.log("          A: "  + JSON.stringify(xdiff.array,null,2))
                                                                                var newId = uuidv1();
                                                                                dbsearch.serialize(
                                                                                    function() {
                                                                                        dbsearch.run("begin exclusive transaction");
                                                                                        stmtUpdateRelationships2.run(
                                                                                            xdiff.new,
                                                                                            xdiff.new,

                                                                                            xdiff.deleted,
                                                                                            xdiff.deleted,

                                                                                            xdiff.edited,
                                                                                            xdiff.edited,

                                                                                            xdiff.array,
                                                                                            xdiff.array,

                                                                                            queryToIndex.hash,
                                                                                            relatedQuery.hash)
                                                                                        dbsearch.run("commit");
                                                                                        })
                                                                            }
                                                                        } else {
                                                                            console.log("     error in related  : " + " = " + queryResult2.error);
                                                                        }
                                                                    });

                                                            }
                                                        }
                                                    });
                                                }, sqlite3.OPEN_READONLY)
                                            }
                                            }





                                        } else {
                                            console.log("     error : " + " = " + queryResult.error);
                                        }
                                    });
                        }
                    });
                } else {
                    //console.log("          else: ");
                }
            } else {
                console.log("          1480 Error: " );
           }
        })

        }, sqlite3.OPEN_READONLY)
    } catch (err) {
        console.log(err);
        var stack = new Error().stack
        console.log( stack )
    }
    inIndexFileRelationshipsFn = false;
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












//-----------------------------------------------------------------------------------------//
//                                                                                         //
//                                     sendTestHeartBeat                                   //
//                                                                                         //
//                                                                                         //
//                                                                                         //
//                                                                                         //
//                                                                                         //
//                                                                                         //
//                                                                                         //
//-----------------------------------------------------------------------------------------//
function sendTestHeartBeat() {
    let counter = 0;

    setInterval(() => {
        if (!isPcDoingStuff) {
            try
            {
                dbsearch.serialize(
                    function() {
                        var stmt = dbsearch.all(
                            "SELECT count(*) FROM data_states;",
                            function(err, results)
                            {
                                if (!err)
                                {
                                    if( results.length > 0)  {

                                        process.send({  message_type:       "return_test_fork",
                                                        counter:    counter ++, sqlite: JSON.stringify(results[0],null,2)  });
                                    }
                                }
                            })
                }, sqlite3.OPEN_READONLY)
            } catch(err) {
                console.log(err);
                var stack = new Error().stack
                console.log( stack )
                                process.send({  message_type:       "return_test_fork",
                                                counter:    counter ++, sqlite: "Err: " + err  });

            }
    }
    }, 1000);
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

      if (msg.message_type == 'saveConnectionAndQueryForFile') {
          markFileForProcessing(msg.fileId);

      } else if (msg.message_type == 'parent_test') {
          //console.log('Message from parent:', msg);
          process.send({send_from_child: "Received message from parent"})




      } else if (msg.message_type == 'getRelatedDocuments') {
            //console.log("got message getRelatedDocuments" );
                    getRelatedDocuments(msg.id, function(results) {

                        //console.log("**getRelatedDocuments returned: " + results.length);
                    });




      } else if (msg.message_type == 'childSetSharedGlobalVar') {




      } else if (msg.message_type == 'childRunIndexer') {
           console.log("Started indexer");
           setInterval(indexFilesFn ,numberOfSecondsIndexFilesInterval * 1000);
           setInterval(indexFileRelationshipsFn ,numberOfSecondsIndexFilesInterval * 1000);


      } else if (msg.message_type == 'childRunFindFolders') {
           console.log("**** childRunFindFolders");
           setTimeout(findFoldersFn ,1 * 1000);
           setInterval(findFilesInFoldersFn ,numberOfSecondsIndexFilesInterval * 1000);


    } else if (msg.message_type == 'childScanFiles') {
        console.log("**** childScanFiles");
        setInterval(processFilesFn ,numberOfSecondsIndexFilesInterval * 1000);


    } else if (msg.message_type == 'greeting') {
        console.log("**** greeting");


    } else if (msg.message_type == 'init') {
        setUpSql();

    } else if (msg.message_type == 'createTables') {
        console.log("**** createTables");
        db_helper.createTables(dbsearch,
            function() {
                console.log("**** createTables returned");
                process.send({  message_type:       "createdTablesInChild"  });

            });



    } else if (msg.message_type == 'setUpDbDrivers') {
        console.log("**** setUpDbDrivers");
        setUpDbDrivers();







    } else if (msg.message_type == 'addNewQuery') {
        //console.log("**** addNewQuery");
        addNewQuery(msg.params);


    } else if (msg.message_type == 'addNewConnection') {
        //console.log("**** addNewConnection");
        addNewConnection(msg.params);




    } else if (msg.message_type == 'getResult') {
        getResult(  msg.source,
                    msg.connection,
                    msg.driver,
                    msg.definition,
                    function(result) {
                        var sharemessage = {
                                    message_type:       'getResultReturned',
                                    seqNum:              msg.seqNum,
                                    result:              result
                                };
                        process.send(sharemessage);
                    }  )




    } else if (msg.message_type == 'downloadWebDocument') {
        downloadWebDocument(msg.query_id,
                            function(result) {
                                console.log("5")
                                var returnDownloadDocToParentMsg = {
                                    message_type:       'returnDownloadWebDocument',
                                    seq_num:             msg.seq_num,
                                    returned:            JSON.stringify(result,null,2)
                                };
                                process.send( returnDownloadDocToParentMsg );
                    }  )




    } else if (msg.message_type == 'downloadDocuments') {
        downloadDocuments(  msg.file_id,
                            function(result) {
                                console.log("5")
                                var returnDownloadDocumentsMsg = {
                                    message_type:       'returnDownloadDocuments',
                                    seq_num:             msg.seq_num,
                                    returned:            result,
                                    content:             result.content
                                };
                                process.send( returnDownloadDocumentsMsg );
                    }  )




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



//zzz
    } else if (msg.message_type == 'add_local_driver') {
        //console.log("3 - get_search_results: " + msg.seq_num )
        var return_add_local_driver_results_msg = {
            message_type:           'return_add_local_driver_results_msg',
            seq_num:                msg.seq_num
        };

        try {
            evalLocalSystemDriver( msg.driver_name )
            return_add_local_driver_results_msg.success = true
            return_add_local_driver_results_msg.error = false

        } catch(err) {
            return_add_local_driver_results_msg.success = false
            return_add_local_driver_results_msg.error = true
            return_add_local_driver_results_msg.error_message = err

        }
        process.send( return_add_local_driver_results_msg );









    } else if (msg.message_type == 'get_search_results') {
        //console.log("3 - get_search_results: " + msg.seq_num )
        get_search_resultsFn(   msg.searchTerm,
                                msg.timeStart,

                                function(result) {
                                    //console.log("5 - get_search_results: " + JSON.stringify(result))
                                    var return_get_search_resultsMsg = {
                                        message_type:           'return_get_search_results',
                                        seq_num:                msg.seq_num,
                                        returned:               JSON.stringify(result)
                                    };
                                    //console.log("5.1: " + JSON.stringify(return_get_search_resultsMsg))
                                    process.send( return_get_search_resultsMsg );
                                    //console.log("5.3: ")
                    }  )










    } else if (msg.message_type == 'get_search_results_json') {
        console.log("2 - /client/1/search: get_search_results_json")
        get_search_resultsFn(   msg.searchTerm,
                                msg.timeStart,

                                function(result) {
                                    //console.log("5 - get_search_results: " + JSON.stringify(result))
                                    var return_get_search_resultsMsg = {
                                        message_type:           'return_get_search_results_json',
                                        search_term:            msg.searchTerm,
                                        seq_num:                msg.seq_num,
                                        returned:               JSON.stringify(result)
                                    };
                                    //console.log("5.1: " + JSON.stringify(return_get_search_resultsMsg))
                                    process.send( return_get_search_resultsMsg );
                                    //console.log("5.3: ")
                    }  )




    } else if (msg.message_type == 'get_query_result') {
        //console.log("3 - get_query_result:     " + msg.seq_num )
        //console.log("           connection_id: " + msg.connection_id )
        //console.log("           query_id:      " + msg.query_id )
        //console.log("           definition:    " + msg.definition )

        getqueryresultFn(       msg.connection_id,
                                msg.query_id,
                                msg.definition,

                                function(result) {
                                    //console.log("5 - get_query_result: " + JSON.stringify(result.length))
                                    var return_get_query_result_msg = {
                                        message_type:        'return_get_query_results',
                                        seq_num:              msg.seq_num,
                                        result:               JSON.stringify(result)
                                    };
                                    //console.log("5.1: " + JSON.stringify(return_get_query_result_msg))
                                    process.send( return_get_query_result_msg );
                                    //console.log("5.3: ")
                    }  )






        } else if (msg.message_type == 'get_all_tables') {
            //console.log("3 - get_all_tables:     " + msg.seq_num )
            //console.log("           table_name:  " + msg.table_name )
            //console.log("           fields:      " + msg.fields )

            get_all_tableFn(   msg.table_name,
                               msg.fields,

                                    function(result) {
                                        //console.log("5 - get_all_tables: " + JSON.stringify(result.length))
                                        var return_get_all_table_result_msg = {
                                            message_type:        'return_get_all_table',
                                            seq_num:              msg.seq_num,
                                            result:               result
                                        };
                                        //console.log("5.1: " + JSON.stringify(return_get_all_table_result_msg))
                                        process.send( return_get_all_table_result_msg );
                                        //console.log("5.3: ")
                        }  )






    } else if (msg.message_type == 'get_all_queries') {
        //console.log("3 - get_all_queries: " + msg.seq_num )
        get_all_queries(
                            function(result) {
                                //console.log("5: " + JSON.stringify(result))
                                var returnQueryItemMsg = {
                                    message_type:           'return_query_item',
                                    seq_num:                msg.seq_num,
                                    returned:               result.query
                                }
                                process.send( returnQueryItemMsg );
                            },


                            function() {
                                var returnQueryItemsEndedMsg = {
                                    message_type:           'return_query_items_ended',
                                    seq_num:                msg.seq_num
                                };
                                process.send( returnQueryItemsEndedMsg );
                                //console.log("6: Query ended ")
                            }
                        )



        } else if (msg.message_type == 'when_queries_changes') {
            //when_queries_changes(null);


        } else if (msg.message_type == 'when_connections_changes') {
            //when_connections_change();
        }

    });
}



















//-----------------------------------------------------------------------------------------//
//                                                                                         //
//                                       testDiffFn                                        //
//                                                                                         //
//                                                                                         //
//                                                                                         //
//                                                                                         //
//                                                                                         //
//                                                                                         //
//                                                                                         //
//-----------------------------------------------------------------------------------------//
function testDiffFn() {
    //console.log("Deep: " + diff)
    lhs = [
    {line: 2, value: "The cat sat on the mat"}
    ,
    {line: 1, value: "The cat sat on the mat2"}
    ,
    {line: 3, value: "The cat sat on the mat2"}
        ]
    ;

    rhs = [

    {line: 1, value: "The cat sat on the mat2"}
    ,
    {line: 2, value: "The cat sat on the mat"}
    ,
    {line: 3, value: "The cat sat on the mat2"}
    ,
    {line: 4, value: "The cat sat on the mat2"}

    ];

    //console.log("")
    //console.log("")
    //console.log("")
    //console.log("----------------------------------------------------------------------------------------------")
    //console.log(JSON.stringify(differences,null,2))
    xdiff = diffFn(lhs, rhs);
    //console.log("N: "  + JSON.stringify(xdiff.new,null,2))
    //console.log("D: "  + JSON.stringify(xdiff.deleted,null,2))
    //console.log("E: "  + JSON.stringify(xdiff.edited,null,2))
    //console.log("A: "  + JSON.stringify(xdiff.array,null,2))
    //console.log("----------------------------------------------------------------------------------------------")
    //console.log("")
    //console.log("")
    //console.log("")
}





//-----------------------------------------------------------------------------------------//
//                                                                                         //
//                                    createRelationship                                   //
//                                                                                         //
//                                                                                         //
//                                                                                         //
//                                                                                         //
//                                                                                         //
//                                                                                         //
//                                                                                         //
//-----------------------------------------------------------------------------------------//
function createRelationship(  doc_hash,  target_hash,  similar_count ) {

    dbsearch.serialize(
        function() {
    dbsearch.all(
        "select  id  from  relationships  where  " +
        "    source_query_hash = '"  +  doc_hash  +  "' and target_query_hash = '"  +  target_hash + "'"
        ,

        function(err, existsResults)
        {
            if (!err)
            {
                //console.log("    " + doc_hash + " : " + target_hash + "... existsResults.length = " +  existsResults.length);
                if (existsResults.length == 0) {
                    var newId = uuidv1();
                    dbsearch.serialize(function() {
                        dbsearch.run("begin exclusive transaction");
                        stmtInsertIntoRelationships.run(newId,  doc_hash, target_hash,  similar_count)
                        dbsearch.run("commit")
                    })
                }
            }
        }
    )
    }, sqlite3.OPEN_READONLY)
}


var isPcDoingStuff = true;
//Set delay for second Measure
setInterval(function() {
    perf.isDoingStuff(function(retVal){
        isPcDoingStuff = retVal;
        //console.log("    isPcDoingStuff = " + isPcDoingStuff);
    });
}, 1000);











function isExcelFile(fname) {
    if (!fname) {
        return false;
    };
    var ext = fname.split('.').pop();
    ext = ext.toLowerCase();
    if (ext == "xls") return true;
    if (ext == "xlsx") return true;
    return false;
}


function isWordFile(fname) {
    if (!fname) {
        return false;
    };
    var ext = fname.split('.').pop();
    ext = ext.toLowerCase();
    if (ext == "docx") return true;
    return false;
}

function isPdfFile(fname) {
    if (!fname) {
        return false;
    };
    var ext = fname.split('.').pop();
    ext = ext.toLowerCase();
    if (ext == "pdf") return true;
    return false;
}



function isTextFile(fname) {
	if (!fname) {
	return false;
	};
	var ext = fname.split('.').pop();
	ext = ext.toLowerCase();
	if (ext == "txt") return true;
	return false;
}

function isCsvFile(fname) {
	if (!fname) {
	return false;
	};
	var ext = fname.split('.').pop();
	ext = ext.toLowerCase();
	if (ext == "csv") return true;
	return false;
}


function isGlbFile(fname) {
		if (!fname) {
				return false;
		};
		var ext = fname.split('.').pop();
		ext = ext.toLowerCase();
		if (ext == "glb")
				return true;
		return false;
}




//-----------------------------------------------------------------------------------------//
//                                                                                         //
//                                   remoteWalk                                            //
//                                                                                         //
// This walks the filesyste to find files to add to the search index                       //
//                                                                                         //
//                                                                                         //
//                                                                                         //
//                                                                                         //
//                                                                                         //
//                                                                                         //
//-----------------------------------------------------------------------------------------//
var i =0;
function remoteWalk( dir ) {

    if (
    (dir.toUpperCase().indexOf("WINDOWS") != -1 )
    ||
    (dir.toUpperCase().indexOf("PROGRAM") != -1 )
    ||
    (dir.toUpperCase().indexOf("RECYCLE") != -1 )
    ) {
        return;
    }
    console.log("remoteWalk: " + dir)

    var list = fs.readdirSync (dir)

    list.forEach(
        function(FileName) {
            //console.log("FileName: " + FileName)
                    var fileOrFolder = path.resolve(dir, FileName);
                    try {
                    var stat = fs.statSync(fileOrFolder)
                        if (stat && stat.isDirectory()) {
                            var parentDir = dir
                            if (parentDir === '/') {
                                parentDir = ''
                            }
                            //var folderName = parentDir +fileOrFolder
                            var folderName = fileOrFolder
                            console.log("Folder: " + folderName)

                            dbsearch.serialize(
                                function() {
                            var stmt = dbsearch.all(
                                "select id from folders where path = ?",
                                [folderName],
                                function(err, results)
                                {
                                    if (!err)
                                    {
                                        if (results.length == 0) {
                                            var newId = uuidv1();
                                            dbsearch.serialize(
                                                function() {
                                                    dbsearch.run("begin exclusive transaction");
                                                    stmtInsertIntoFolders.run(
                                                        newId,
                                                        fileOrFolder,
                                                        folderName)
                                                    dbsearch.run("commit",
                                                        function(err3) {
                                                            console.log("     fileOrFolder: " + fileOrFolder)
                                                            try {
                                                                remoteWalk(fileOrFolder);
                                                            } catch(err3) {
                                                                console.log(err3);
                                                                var stack = new Error().stack
                                                                console.log( stack )
                                                            }
                                                        });
                                                    })
                                            }
                                            else {
                                                    try {
                                                        remoteWalk(fileOrFolder);
                                                    } catch(err4) {
                                                        console.log(err4);
                                                        var stack = new Error().stack
                                                        console.log( stack )
                                                    }

                                            }
                                    }
                                });
                                }, sqlite3.OPEN_READONLY)


                    }
                } catch(err) {
                    console.log(err);
                    var stack = new Error().stack
                    console.log( stack )
                }

    });

};



function addFolderForIndexingIfNotExist(folderName) {
    dbsearch.serialize(
        function() {

    var stmt = dbsearch.all(
        "select id from folders where path = ?",
        [folderName],
        function(err, results)
        {
            if (!err)
            {
                if (results.length == 0) {
                    var newId = uuidv1();

                    dbsearch.serialize(
                        function() {
                            dbsearch.run("begin exclusive transaction");
                            stmtInsertIntoFolders.run(
                                newId,
                                folderName,
                                folderName)
                            dbsearch.run("commit")
                        })
                    }
            } else {
                console.log(err)
            }
        });
    }, sqlite3.OPEN_READONLY)
}
var fileFilter = /\xlsx$|csv$|docx$|pdf$|glb$/
function directSearchFolders(drive) {
    fromDir(drive,fileFilter,function(filename){
        var dirname = path.dirname(filename)


        if (
        (dirname.toUpperCase().indexOf("WINDOWS") != -1 )
        ||
        (dirname.toUpperCase().indexOf("PROGRAM") != -1 )
        ||
        (dirname.toUpperCase().indexOf("RECYCLE") != -1 )
        ||
        (dirname.toUpperCase().indexOf("LIBRARY") != -1 )
        ||
        (dirname.toUpperCase().indexOf("APPLICATIONS") != -1 )
        ) {
            // do nothing
        } else {
            //console.log('DIRNAME: ',dirname.toUpperCase());
            //console.log('-- found in folder: ',dirname);
            addFolderForIndexingIfNotExist(dirname)
        }
    });
}
function fromDir(startPath,filter,callback){

    //console.log('Starting from dir '+startPath+'/');

    if (!fs.existsSync(startPath)){
        console.log("no dir ",startPath);
        return;
    }

    var files=fs.readdirSync(startPath);
    for(var i=0;i<files.length;i++){
        var filename=path.join(startPath,files[i]);
        try {
            var stat = fs.lstatSync(filename);
            if (stat.isDirectory()){
                fromDir(filename,filter,callback); //recurse
            }
            else if (filter.test(filename)) callback(filename);
        } catch(err) {
            //console.log(filename + " COULD NOT BE READ: " + err + " ");
            //var stack = new Error().stack
            //console.log( stack )
        }
    };
};


//zzz
function evalLocalSystemDriver(driverName) {
	var evalDriver = '(' + fs.readFileSync(path.join(__dirname, '../public/visifile_drivers/' +
                                                                    driverName + '.json')).toString() + ')';
	addOrUpdateDriver(driverName, evalDriver)
}


//zzz
function setUpDbDrivers() {
    evalLocalSystemDriver('glb')
    evalLocalSystemDriver('csv')
    evalLocalSystemDriver('txt')
    evalLocalSystemDriver('excel')
    evalLocalSystemDriver('word')
    evalLocalSystemDriver('pdf')
    evalLocalSystemDriver('postgres')
    evalLocalSystemDriver('outlook2012')
    //evalLocalSystemDriver('outlook2010')
    evalLocalSystemDriver('sqlite')
    evalLocalSystemDriver('mysql')
    evalLocalSystemDriver('oracle')
    evalLocalSystemDriver('testdriver')
}








function addOrUpdateDriver(name, codeString) {
    //console.log('addOrUpdateDriver: ' + name);

    var code            = eval(codeString);
    var driverType      = code.type;


    dbsearch.serialize(
        function() {
            dbsearch.all(
                " select  " +
                "     name, code, id " +
                " from " +
                "     drivers " +
                " where " +
                "     name = ?;"
                ,
                name
                ,
                function(err, rows) {
                    if (!err) {
                        if (rows.length == 0) {
                            try
                            {
                                console.log('   *** Adding DRIVER ' + name);
                                dbsearch.serialize(
                                    function() {
                                        dbsearch.run("begin exclusive transaction");
                                        stmtInsertDriver.run(uuidv1(),  name,  driverType,  codeString)
                                        dbsearch.run("commit");
                                    })

                            } catch( err ) {

                                console.log(err);
                                var stack = new Error().stack
                                console.log( stack )

                            } finally {
                            }

                  } else {
                      var existingDriver = rows[0];
                      if (codeString != existingDriver.code) {
                          try
                          {
                              console.log('        Updating DRIVER ' + name);
                              dbsearch.serialize(
                                  function() {
                                      dbsearch.run("begin exclusive transaction");
                                      stmtUpdateDriver.run( codeString , existingDriver.id)
                                      dbsearch.run("commit");

                                  });
                          } catch(err) {
                              console.log(err);
                              var stack = new Error().stack
                              console.log( stack )
                          } finally {

                          }
                      }
                  }
              }
          }
      );
  }, sqlite3.OPEN_READONLY)
  }



  function addNewQuery( params ) {
      try
      {
          //console.log("------------------function addNewQuery( params ) { -------------------");
          dbsearch.serialize(function() {

              var newQueryId = uuidv1();
              dbsearch.run("begin exclusive transaction");
              stmtInsertIntoQueries.run(newQueryId,
                       params.name,
                       params.connection,
                       params.driver,
                       params.definition,
                       params.status,
                       params.type)
               dbsearch.run("commit");

              getResult(newQueryId, params.connection, params.driver, eval("(" + params.definition + ")"), function(result){});
          });
      } catch(err) {
          console.log(err);
          var stack = new Error().stack
          console.log( stack )
      } finally {
      }
  }
























function addNewConnection( params ) {
    try
    {
        //console.log("------------------function addNewConnection( params ) { -------------------");
        dbsearch.serialize(function() {

            dbsearch.run("begin exclusive transaction");
            stmtInsertIntoConnections2.run(uuidv1(),
                     params.name,
                     params.driver,
                     params.database,
                     params.host,
                     params.port,
                     params.connectString,
                     params.user,
                     params.password,
                     params.fileName,
                     params.preview)
             dbsearch.run("commit")

        });
    } catch(err) {
        console.log(err);
        var stack = new Error().stack
        console.log( stack )
        //console.log("                          err: " + err);
    } finally {
    }
}





















function downloadWebDocument(queryId, callbackFn) {
    //console.log("4")

    dbsearch.serialize(
        function() {

    var stmt = dbsearch.all(" select   " +
                            "     contents.content, data_states.driver   from  contents, data_states   " +
                            " where " +
                            "     data_states.id = ? " +
                            "  and contents.id = data_states.hash  limit 1",
                            [queryId],
                            function(err, rows) {
        if (!err) {
                if (rows.length > 0) {
                    var contentRow = rows[0];
                    if (contentRow.driver.toLowerCase().endsWith("word") ) {
                        var buffer = new Buffer(rows[0].content, 'binary');

                        mammoth.convertToHtml({buffer: buffer})
                        .then(function(result){
                            var html = result.value; // The generated HTML
                            var messages = result.messages; // Any messages, such as warnings during conversion

                            callbackFn({result: html})
                        })
                        .done();





                    } else if (contentRow.driver.toLowerCase().endsWith("outlook2012") ) {
                        try {
                            console.log('1')
                            html = "<pre>";
                            var contents = rows[0].content.toString()
                            html += contents;
                            html += "</pre>";
                            callbackFn({result: html})

                        }
                        catch(err) {
                            console.log(err);
                            var stack = new Error().stack
                            console.log( stack )
                            callbackFn({result: "<div>Big Error: " + err + "</div>"})
                        }



                    } else if (contentRow.driver.toLowerCase().endsWith("excel") ) {
                        try {
                            var buffer = new Buffer(rows[0].content, 'binary');
                            var workbook = XLSX.read(buffer, {type:"buffer"})
                            var sheetname = Object.keys(workbook['Sheets'])[0]
                            var html =  XLSX.utils.sheet_to_html(workbook['Sheets'][sheetname])
                            html = html.replace("<html><body>","").replace("</body></html>","");


                            callbackFn({result: html})
                        } catch(error) {
                            console.log(error);
                            var stack = new Error().stack
                            console.log( stack )
                            callbackFn({result: "<div>Error: " + error + "</div>"})
                        }




                    } else if (contentRow.driver.toLowerCase().endsWith("csv") ) {
                        try {
                            html = "<table>";
                            var contents = rows[0].content.toString()
                            var delim = ',';
                            var numCommas = ((contents.match(new RegExp(",", "g")) || []).length);
                            var numSemi = ((contents.match(new RegExp(";", "g")) || []).length);
                            var numColons = ((contents.match(new RegExp(":", "g")) || []).length);
                            var numPipes = ((contents.match(new RegExp("[|]", "g")) || []).length);

                            var maxDelim = numCommas;
                            if (numSemi > maxDelim) {
                                delim = ';';
                                maxDelim = numSemi;
                                };
                            if (numColons > maxDelim) {
                                delim = ':';
                                maxDelim = numColons;
                                };
                            if (numPipes > maxDelim) {
                                delim = '|';
                                maxDelim = numPipes;
                                };
                            csv
                             .fromString(contents, { headers: false, delimiter: delim })
                             .on("data", function(data){
                                html += "<tr>";
                                for (var yy= 0; yy < data.length; yy++) {
                                    html += "<td>" + data[yy] + "</td>";
                                }
                                html += "</tr>";

                            }).on("end", function(){
                                html += "</table>";
                                callbackFn({result: html})
                                })
                            .on('error', function(error) {
                                callbackFn({result: "<div>Error: " + error + "</div>" })
                            });

                        }
                        catch(err) {
                            console.log(err);
                            var stack = new Error().stack
                            console.log( stack )
                            callbackFn({result: "<div>Big Error: " + err + "</div>"})
                        }







                    } else if (
                            !isBinaryFile.sync(
                                        rows[0].content,
                                            rows[0].content.toString().length  )) {
                        try {
                            console.log('1')
                            html = "<pre>";
                            var contents = rows[0].content.toString()
                            html += contents;
                            html += "</pre>";
                            callbackFn({result: html})

                        }
                        catch(err) {
                            console.log(err);
                            var stack = new Error().stack
                            console.log( stack )
                            callbackFn({result: "<div>Big Error: " + err + "</div>"})
                        }






                    } else {
                        callbackFn({result: "<div>Unknown file type</div>"})
                    }
                };
        };
    });
}, sqlite3.OPEN_READONLY)
}













function downloadDocuments( fileId, callbackFn ) {
		if (fileId && (fileId.length > 0)) {
				//console.log("getting file: " + fileId);
            dbsearch.serialize(
                function() {


				var stmt = dbsearch.all(" select   data_states.driver as driver, contents.id as id,  content, content_type   from   contents, data_states   " +
                                        " where data_states.id = ? and  contents.id = data_states.hash  limit 1" ,
                                        [fileId], function(err, rows) {
						if (!err) {
								if (rows.length > 0) {
                                    var contentRecord = rows[0]
                                    //console.log("**12: " + contentRecord.content.length);
                                    callbackFn({result:     contentRecord,
                                                content:    JSON.stringify(contentRecord.content)})
								};
						} else {
                            callbackFn({error: err})
                        };
				});
            }, sqlite3.OPEN_READONLY)
		} else {
            callbackFn({error: "No file selected"})
		}
};









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

















function get_all_queries(callbackFn, callbackEndFn) {
    //console.log('4:');
    dbsearch.serialize(
        function() {
            var stmt = dbsearch.all("select * from data_states",
                function(err, results) {
                    //console.log('4.5: results length = ' + results.length);
                    for (var i=0; i < results.length;i ++) {
                        var query = results[i];
                        callbackFn({query: query})
                    }
                    callbackEndFn()
                });
            }, sqlite3.OPEN_READONLY)
};




















function get_search_resultsFn(  searchTerm,  timeStart , callbackFn  ) {
    //console.log("called get_search_results: " )

    //console.log("searchTerm.length: " + searchTerm.length)
    //console.log("searchTerm: " + searchTerm)
    if (searchTerm.length < 1) {
        var timeEnd = new Date().getTime();
        var timing = timeEnd - timeStart;
        callbackFn(  {  search:      searchTerm,
                        data_states:    [],
                        message:    "Search text must be at least 1 characters: " + searchTerm,
                        duration:    timing    }  );
    } else {

    dbsearch.serialize(function() {
        var mysql = "  select distinct(data_states.id), the1.document_binary_hash, the1.num_occ  , the1.child_hash , zfts_search_rows_hashed.data " +
                    ",         data_states.size, data_states.fileName, data_states.name, data_states.type,data_states.driver, data_states.when_timestamp " +
                    " from (  select   " +
                   "  distinct(document_binary_hash), count(document_binary_hash)  as num_occ  , child_hash  " +
                 "    from    " +
                 "    search_rows_hierarchy   " +
                 "    where    " +
                 "    child_hash in (select     " +
                  " distinct(row_hash)    " +
                    "  from     " +
"                          zfts_search_rows_hashed    " +
 "                    where    " +
  "                         zfts_search_rows_hashed match '"  + searchTerm + "*'  )   " +
   "                  group by   " +
    "                    document_binary_hash) as the1,   " +
     "                     data_states  , " +
      "                    zfts_search_rows_hashed  " +
       "              where    " +
        "             data_states.hash = the1.document_binary_hash   " +
" and " +
"zfts_search_rows_hashed.row_hash = the1.child_hash ";

        var firstWord = searchTerm.split()[0];
        if (firstWord.length < 1) {
            firstWord = "";
        }

        dbsearch.serialize(
            function() {
        var stmt = dbsearch.all(mysql, function(err, rows) {
            if (!err) {
                //console.log('rows: ' + JSON.stringify(rows.length));
                var newres = [];
                for  (var i=0; i < rows.length;i++) {
                    var rowId = rows[i]["id"];
                    var rowData =  rows[i]["data"];
                    if (rowData.length > 0) {
                        var rowDataToSend = ""
                        if (i < 5) {
                            var rowDataStartInit = rowData.toUpperCase().indexOf(firstWord.toUpperCase())
                            //console.log('rowDataStartInit: ' + rowDataStartInit );

                            //console.log('for: ' + firstWord + " = " + JSON.stringify(rowData));

                            var rowDataStart = rowDataStartInit - 30;
                            if (rowDataStart < 0) {
                                rowDataStart = 0
                            }
                            //console.log('rowDataEndInit: ' + rowDataEndInit );
                            var rowDataEnd = rowDataStartInit + firstWord.length + 30

                            rowDataToSend = rowData.substring(rowDataStart, rowDataStartInit) + firstWord.toUpperCase() +
                                rowData.substring(rowDataStartInit + firstWord.length, rowDataEnd);
                        }
                        //console.log('rowDataToSend: ' + rowDataToSend );
                        newres.push({
                                            id:             rowId,
                                            data:           rowDataToSend,
                                            file_name:      rows[i].fileName,
                                            name:           rows[i].name,
                                            size:           rows[i].size,
                                            type:           rows[i].type,
                                            driver:         rows[i].driver,
                                            when_timestamp: rows[i].when_timestamp
                                    });
                    }
                }
                var timeEnd = new Date().getTime();
                var timing = timeEnd - timeStart;
                callbackFn( {   search:  searchTerm,
                                            data_states: newres,
                                            duration: timing});
            } else {
                var timeEnd = new Date().getTime();
                var timing = timeEnd - timeStart;
                callbackFn( {search:      searchTerm,
                             data_states:    [],
                             duration:    timing,
                             error: "Error searching for: " + searchTerm }  );
            }
        });
    }, sqlite3.OPEN_READONLY)

    })
    };
};














function getqueryresultFn(  connectionId, queryId, definition, callbackFn) {
    //console.log(' 3 - getqueryresultFn definition.sql: ' + JSON.stringify(definition.sql));
    //console.log('                      definition:     ' + JSON.stringify(definition));
    //console.log('                      connectionId:   ' + JSON.stringify(connectionId));
    //console.log('                      queryId:        ' + JSON.stringify(queryId));


	var error = new Object();
    if (connectionId) {
        getConnection(  connectionId, function(connection) {
    	    if (connection) {
                if (connection.driver) {
                    getResult(  queryId,
                                connectionId,
                                connection.driver,
                                definition,
                                callbackFn  )


                    //console.log('trying to save document: ');

    dbsearch.serialize(function() {
                    var stmt = dbsearch.all("select   contents.content   from   data_states, contents   where   data_states.id = ? and data_states.driver = 'pdf'" +
                                            "    and contents.id = data_states.hash  limit 1",

                                            [queryId],
                                            function(err, rows) {
                    //console.log('err: ' + err);
                    if (rows) {
                        //console.log('rows: ' + rows);
                    }
                    //console.log('trying to save document: ' + queryData2.connectionId);
                    if (!err) {
                        //console.log('trying to save pdf 3: ');
                        if (rows.length > 0) {
                            var buffer = new Buffer(rows[0].content, 'binary');

                            fs.writeFile(process.cwd() + "/files/a.pdf", buffer,  "binary",
                                function(err) {
                                    //console.log('trying to save pdf 6: ');

                                });
                        }
                    }
                })
            }, sqlite3.OPEN_READONLY)
    			} else {
    				//console.log('query driver not found: ' + connectionId);
                    callbackFn(JSON.stringify({error: 'query driver not found'}));
    			};
    		};
        })
	};
}






function get_all_tableFn(  tableName, fields, callbackFn  ) {
    dbsearch.serialize(function() {
    //console.log("5 - get_all_tableFn, tableName: = " + tableName);
    var stmt = dbsearch.all("select " + fields + " from " + tableName,
        function(err, rows) {
            if (!err) {
                callbackFn(  JSON.stringify(rows)  );
                //console.log("Sent: " + JSON.stringify(rows.length) + " " + tableName);
            } else {
                //console.log("Error: " + err);
            };
        })
    }, sqlite3.OPEN_READONLY)
};




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




function getConnection(id, callbackFn) {
    try {
        dbsearch.serialize(
            function() {
        var stmt = dbsearch.all(
            "SELECT * FROM connections WHERE id = ? ",
            id
            ,

            function(err, results)
            {
                if (err)
                {
                    console.log("getConnection error: " + err)
                    callbackFn(null)
                    return
                }
                if (results.length == 0) {
                    console.log("getConnection returned no results: " + err)
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





function getQuery(id, callbackFn) {
    try {
        dbsearch.serialize(
            function() {
        var stmt = dbsearch.all(
            "SELECT * FROM data_states WHERE id = ? ",
            id
            ,

            function(err, results)
            {
                if (err)
                {
                    console.log("getQuery error: " + err)
                    callbackFn(null)
                    return
                }
                if (results.length == 0) {
                    console.log("getQuery returned no results: " + err)
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
