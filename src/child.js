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


username = os.userInfo().username.toLowerCase();
//console.log(username);
dbsearch = new sqlite3.Database(username + '.vis');
//dbsearch.run("PRAGMA journal_mode=WAL;")
dbsearch.run("PRAGMA synchronous=OFF;")
dbsearch.run("PRAGMA count_changes=OFF;")
dbsearch.run("PRAGMA journal_mode=MEMORY;")
dbsearch.run("PRAGMA temp_store=MEMORY;")


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








setUpSql()

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
    stmtResetFolders = dbsearch.prepare( " update   folders   set status = NULL ");

    stmtResetFiles   = dbsearch.prepare( " update   files   set status = NULL ");

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


    stmtInsertIntoFiles = dbsearch.prepare( " insert into files " +
                                            "     ( id,  contents_hash ,  size,  path,  orig_name,    fk_connection_id) " +
                                            " values " +
                                            "     ( ?,  ?,  ?,  ?,  ?,   ? );");

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


function getContentType(fullFileNamePath) {
    var contentType = 'text/plain'
    var extension = fullFileNamePath.substr(fullFileNamePath.lastIndexOf('.') + 1).toLowerCase()
    if (extension == 'pdf') {contentType = 'application/pdf'}
    else if (extension == 'glb') {contentType = 'model/gltf-binary'}
    else if (extension == 'doc') {contentType = 'application/msword'}
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
        var stmt = dbsearch.all(
            "select * from contents where   id = ? ",

            [sha1ofFileContents],

            function(err, results)
            {
                if (!err)
                {
                    if (results.length == 0) {
                        try {
                            var contentType = getContentType(fullFileNamePath)
                            dbsearch.serialize(function() {

                                stmtInsertIntoContents.run(

                                    sha1ofFileContents,
                                    fs.readFileSync(fullFileNamePath),
                                    contentType,

                                    function(err) {
                                        //console.log('added file to sqlite');
                                        });
                           })
                       } catch (err) {
                           console.log(err);
                       }
                   }
               }
       })
}







function foundFile(     fullFileNamePath,
                        sha1ofFileContents,
                        fileContentsSize,
                        fileScreenName,
                        existingConnectionId,
                        driverName,
                        documentType) {

        var newFileId   = uuidv1();

        stmtInsertIntoFiles.run(

            newFileId,
            sha1ofFileContents,
            fileContentsSize,
            path.dirname(fullFileNamePath),
            path.basename(fullFileNamePath),
            existingConnectionId,

            function(err) {
                //console.log('added file to sqlite');
                });


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
        return null;
    }
}

function timestampInSeconds() {
    return Math.floor(Date.now() / 1000)
}


//-----------------------------------------------------------------------------------------//
//                                                                                         //
//                               saveConnectionAndQueryForFile2                            //
//                                                                                         //
//                                                                                         //
//                                                                                         //
//                                                                                         //
//                                                                                         //
//                                                                                         //
//                                                                                         //
//                                                                                         //
//-----------------------------------------------------------------------------------------//
function saveConnectionAndQueryForFile2(  fullFilePath ) {
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
                                stmtInsertIntoFiles2.run(

                                    newFileId,
                                    path.dirname(fullFilePath),
                                    path.basename(fullFilePath),

                                    function(err) {
                                        //console.log('added file to sqlite');
                                        });

                            } catch (err) {
                                console.log("Error " + err + " with file: " + fullFilePath);
                            }
                        };
                    };
                }
            )
        })
    } catch(err) {
        console.log("Error " + err + " with file: " + fullFilePath);
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
                "                        hash from queries where id = '" + id+ "' " +
                "                 )) group by document_binary_hash ) as ttt,  " +
                "            queries " +
                "where hash = document_binary_hash " +
                "group by id " +
                "order by cc desc "


    try
    {
        //console.log("**** : **********************")
        //console.log("**** : **********************")
        //console.log("**** : **********************")
        var stmt = dbsearch.all(
            sql,
            function(err, results)
            {
                if (!err)
                {
                    dbsearch.serialize(function() {
                            stmtUpdateRelatedDocumentCount.run(results.length, id);
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
    } catch(err) {
        //console.log(err)
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
                "                queries                                                      " +
                "             where hash = document_binary_hash                               " +
                "               group by id                                                   " +
                "                order by cc desc                                             " ;


    try
    {
        var stmt = dbsearch.all(
            sql,
            function(err, results)
            {
                if (!err)
                {
                    dbsearch.serialize(function() {
                        dbsearch.run("begin transaction");
                        for (var i =0 ; i < results.length; i++) {
                            if (results[i]) {
                                var target_hash = results[i].hash;
                                console.log("    " + doc_hash + " : " + target_hash );

                                if (target_hash) {
                                    var similar_count = results[i].size;
                                    createRelationship(doc_hash, target_hash, similar_count);
                                }
                            }


                        }
                        stmtUpdateRelationships.run('INDEXED', doc_hash);
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
    } catch(err) {
        //console.log(err)
                        process.send({  message_type:       "return_similar_hashes",
                                        sqlite: "Err: " + err  });

    }
    inGetRelatedDocumentHashes = false;
}

















//-----------------------------------------------------------------------------------------//
//                                                                                         //
//                                      findFoldersFn                                      //
//                                                                                         //
// This indexes the queries for full text search                                           //
//                                                                                         //
//                                                                                         //
//                                                                                         //
//                                                                                         //
//                                                                                         //
//                                                                                         //
//-----------------------------------------------------------------------------------------//
function findFoldersFn() {
    console.log("**  called findFoldersFn");

	var useDrive = "C:\\";
    if (!isWin) {
        useDrive = '/';
    }

    stmtResetFolders.run();

    stmtResetFiles.run();

    //remoteWalk(useDrive);
    directSearchFolders(useDrive);

    console.log('******************* Finished finding folders');
    finishedFindingFolders = true;

    //    sendOverWebSockets({
    //                            type:   "server_scan_status",
    //                            value:  "Hard disk scan in progress"
    //                            });
}









//-----------------------------------------------------------------------------------------//
//                                                                                         //
//                                      indexFilesFn                                       //
//                                                                                         //
// This indexes the queries for full text search                                           //
//                                                                                         //
//                                                                                         //
//                                                                                         //
//                                                                                         //
//                                                                                         //
//                                                                                         //
//-----------------------------------------------------------------------------------------//
function indexFilesFn() {
    //console.log("Index files");
    //console.log("    inScan: " + inScan);
   if (inScan) {
     return;
   };

   if (isPcDoingStuff) {
       return;
   };

   try {
    var stmt = dbsearch.all(
        "SELECT * FROM queries WHERE index_status IS NULL LIMIT 1 " ,
        function(err, results)
        {
            if (!err)
            {
                if( results.length != 0)
                {
                    //console.log("          : " + JSON.stringify(results[0],null,2));


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
                //console.log("          Error: " );
           }
        })
   }catch (err) {
                //console.log("          Error: " + err);
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
function getResult(  source,  connection,  driver,  definition,  callback  ) {
    //console.log("var getResult = function(" + source + ", " + connection + ", " + driver + ", " + JSON.stringify(definition));
    if (stmt2 == null) {
        stmt2 = dbsearch.prepare("INSERT INTO zfts_search_rows_hashed (row_hash, data) VALUES (?, ?)");
    }
    if (stmt3 == null) {
        stmt3 = dbsearch.prepare("INSERT INTO search_rows_hierarchy (document_binary_hash, parent_hash, child_hash) VALUES (?,?,?)");
    }
    if (setIn == null) {
        setIn =  dbsearch.prepare("UPDATE queries SET index_status = ? WHERE id = ?");
    }
    //console.log("01");


    var error = new Object();
    if (connections[connection]) {
        //console.log("02");
        try {
            //console.log("22");
            dbsearch.serialize(function() {
                dbsearch.run("begin transaction");
                setIn.run("PROCESSING" ,source);
                dbsearch.run("commit");
                //console.log('**** drivers[driver] = ' + driver)
                //console.log('**** drivers.len = ' + drivers[driver].get_v2)
                drivers[driver]['get_v2'](connections[connection],definition,function(ordata) {
                    //console.log("23");
                    if (ordata.error) {
                        //console.log("24");
                        //console.log("****************** err 4:" + ordata.error);
                        dbsearch.serialize(function() {
                            //console.log("25");
                            dbsearch.run("begin transaction");
                            setIn.run("ERROR: " + ordata.error,source);
                            dbsearch.run("commit");
                            callback.call(this,{error: true});
                        });

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
                        var findHashSql = "select  hash from queries where id = '" + source + "'";
                        //console.log("FindHashSql : " + findHashSql );
                        //console.log("1");
                        var stmt4 = dbsearch.all(findHashSql,
                            function(err, results2) {
                                //console.log("2");
                                if( err) {
                                    //console.log("Error: " + JSON.stringify(error) + "'");
                                }
                                if( results2.length == 0) {
                                    //console.log("No sresults for hash" + source + "'");
                                }
                                var binHash = results2[0].hash;
                                var stmt = dbsearch.all("select  " +
                                                    "    document_binary_hash  "  +
                                                    "from  " +
                                                    "    search_rows_hierarchy  " +
                                                    "where  " +
                                                    "    document_binary_hash = '" + binHash + "'",
                                function(err, results) {
                                    //console.log("3");
                                    if (!err) {
                                        //console.log("4");
                                        if( results.length == 0) {
                                            //console.log("5");
                                            dbsearch.serialize(function() {

                                                callback.call(this,ordata);
                                                //console.log("Inserting rows");

                                                if (rrows && rrows.length) {

                                                    dbsearch.run("begin transaction");
                                                    //console.log("Committing... " + rrows.length)
                                                    for (var i =0 ; i < rrows.length; i++) {
                                                        var rowhash = crypto.createHash('sha1');
                                                        var row = JSON.stringify(rrows[i]);
                                                        rowhash.setEncoding('hex');
                                                        rowhash.write(row);
                                                        rowhash.end();
                                                        var sha1sum = rowhash.read();
                                                        //console.log('                 : ' + JSON.stringify(rrows[i]));
                                                        stmt2.run(sha1sum, row);
                                                        stmt3.run(binHash, null, sha1sum);
                                                    }
                                                    //console.log("Committed: " + rrows.length)
                                                    //stmt2.finalize();
                                                    //stmt3.finalize();
                                                    //console.log('                 : ' + JSON.stringify(rrows.length));

                                                    //console.log('                 source: ' + JSON.stringify(source));
                                                    setIn.run("INDEXED",source);
                                                    dbsearch.run("commit");

                                                } else {
                                                    //console.log("****************** err 2");
                                                    callback.call(this,{error: true});
                                                    dbsearch.run("begin transaction");
                                                    setIn.run("INDEXED: Other error",source);
                                                    dbsearch.run("commit");
                                                }
                                            });
                                        } else {
                                            //console.log("****************** err 5: no rows");
                                            callback.call(this,ordata);
                                            dbsearch.serialize(function() {
                                                dbsearch.run("begin transaction");
                                                setIn.run("INDEXED: ",source);
                                                dbsearch.run("commit");
                                            });
                                        }
                                    } else {
                                        //console.log("****************** err 3" + err);
                                        dbsearch.serialize(function() {
                                            dbsearch.run("begin transaction");
                                            setIn.run("ERROR: " + err, source);
                                            dbsearch.run("commit");
                                            callback.call(this,{error: true});
                                        });
                                    }
                                });
                        })

                }})
            }
            )

        }
        catch(err){
            //console.log("03");
            //console.log("****************** err 1: " + err);
            callback.call(this,{error: true});
        }
    } else {
        //console.log("04");
        //console.log("****************** err 7 child for connection: " +connection );
        dbsearch.serialize(function() {
            //console.log("05");
            dbsearch.run("begin transaction");
            setIn.run("ERROR: no connection for " + source , source);
            dbsearch.run("commit");
            callback.call(this,{error: true});
        });
    }
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
        saveConnectionAndQueryForFile2( fullPath )
    } catch (err) {
          console.log("          err: " + err);
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
    console.log("processFilesFn")

    //if (isPcDoingStuff) {
    //    return;
    //};

    if (inProcessFilesFn) {
        return;
    }

    inProcessFilesFn = true
//zzz
    try {
        var stmt = dbsearch.all(
            "SELECT  " +

            "    files.id                   as id, " +
            "    files.fk_connection_id     as fk_connection_id," +
            "    connections.driver         as driver," +
            "    files.size                 as fileSize," +
            "    files.contents_hash        as sha1ofFileContents," +
            "    files.path                 as path," +
            "    files.orig_name            as orig_name," +
            "    connections.type           as type " +

            "FROM " +
            "    files, connections WHERE files.status = 'CREATED2' " +
            "and files.fk_connection_id = connections.id and files.fk_connection_id not null LIMIT 1 "
            ,

            function(err, results)
            {
                console.log("    .... " + err)
                console.log("    .... " + results.length)
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

                        console.log("existingConnectionId: " + existingConnectionId)
                        console.log("driver: " + driverName)
                        console.log("fileContentsSize: " + fileContentsSize)
                        console.log("sha1ofFileContents: " + sha1ofFileContents)
                        console.log("fullFileNamePath: " + fullFileNamePath)
                        console.log("documentType: " + documentType)



                        dbsearch.serialize(function() {
                            console.log("    2")
                            stmtUpdateFileStatus.run( "INDEXED", returnedRecord.id,
                            function(err) {
                                console.log("    3")
                                if (err) {
                                    console.log('   err 1 : ' + err);
                                    stmtUpdateFileStatus.run( "ERROR", returnedRecord.id, function(err) {})
                                } else {

                                    console.log("    4")
                                    var newqueryid = uuidv1();
                                    stmtInsertInsertIntoQueries.run(

                                        newqueryid,
                                        fileScreenName,
                                        existingConnectionId,
                                        driverName,
                                        fileContentsSize,
                                        sha1ofFileContents,
                                        fullFileNamePath,
                                        documentType,
                                        JSON.stringify({} , null, 2),
                                        JSON.stringify([{message: 'No preview available'}] , null, 2),
                                        timestampInSeconds(),

                                        function(err2) {
                                            console.log("    5")
                                            if (err2) {
                                                console.log('   err2 : ' + err2);
                                            }
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

                                            inProcessFilesFn = false
                                            }

                                    );
                                }
                            })


                            });

                    } else {
                        inProcessFilesFn = false
                    }
                }
            })

    } catch (err) {
        console.log("          Error: " + err);
        inProcessFilesFn = false
    }

    try {
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
                console.log("    .... " + err)
                console.log("    .... " + results.length)
                console.log("    11")

                if (!err)
                {
                    //
                    // if there is a query where nothing has been done then index it
                    //
                    if( results.length != 0)
                    {
                        console.log("    12")
                        var returnedRecord = results[0];

                        var fullFileNamePath = path.join(returnedRecord.path , returnedRecord.orig_name)

                        console.log("fullFileNamePath: " + fullFileNamePath)


                        var stat = fs.statSync(fullFileNamePath)
                        if (stat && !stat.isDirectory()) {
                            console.log("    13")
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
    //zzz
                            console.log("Document type: " + documentType)
                            if (documentType) {
                                var screenName = fileName.replace(/[^\w\s]/gi,'');
                                var newConnectionId = uuidv1();
                                stmtInsertIntoConnections.run(
                                    newConnectionId,
                                    screenName,
                                    driverName,
                                    documentType,
                                    fullFileNamePath,

                                    function(err) {

                                        console.log("14")

                                        //connections[newid] = {id: newid, name: screenName, driver: driverName, size: size, hash: sha1sum, type: documentType, fullFilePath: fullFilePath };
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
                                            timestampInSeconds(),

                                            function(err2) {
                                                if (err2) {
                                                    console.log('   err2 : ' + err2);
                                                }
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

                                                stmtUpdateFileSizeAndShaAndConnectionId.run(
                                                    sha1ofFileContents,
                                                    fileContentsSize,
                                                    newConnectionId,
                                                    returnedRecord.id,
                                                    function(err3) {
                                                        console.log('   CRETAED : ' + returnedRecord.id);
                                                        if (err3) {
                                                            console.log('   err3 : ' + err3);
                                                        }
                                                        stmtUpdateFileStatus.run( "CREATED", returnedRecord.id,function(err4){
                                                            console.log('   CRETAED2 : ' + returnedRecord.id);
                                                            if (err4) {
                                                                console.log('   err3 : ' + err3);
                                                                stmtUpdateFileStatus.run( "ERROR", returnedRecord.id,function(err4){})
                                                            }
                                                            stmtUpdateFileStatus.run( "INDEXED", returnedRecord.id,function(err4){})
                                                            inProcessFilesFn = false
                                                        })
                                            })
                                        })
                                    }
                                );
                        } else {
                            stmtUpdateFileStatus.run( "ERROR", returnedRecord.id,function(err4){})
                        }
                    }

                } else {
                    inProcessFilesFn = false
                }

            }
        })

    } catch (err) {
        console.log("          Error: " + err);
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
                      stmtUpdateFolder.run("INDEXED", folderRecord.id)
                    };
                }
           })
    } catch (err) {
        console.log("          Error: " + err);
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
        var stmt = dbsearch.all(
            "SELECT * FROM queries WHERE related_status IS NULL LIMIT 1 "
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
                        console.log("" );
                        console.log("" );
                        console.log("In indexFileRelationshipsFn  " );
                        console.log("      SOURCE ITEM : " + JSON.stringify(results[0].name,null,2));
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
                                            console.log("     SOURCE ITEM COUNT : " + " = " + returnValues1.length);


                                            //console.log("**getRelatedDocumentHashes returned: " + results.length);
                                            for (var i = 0; i < relatedResults.length; i ++) {
                                                //console.log("         **** : " + JSON.stringify(relatedResults[i],null,2));
                                                var stmt = dbsearch.all(
                                                    "SELECT * FROM queries WHERE hash = '" + relatedResults[i].hash + "'" ,
                                                    function(err, results)
                                                    {
                                                        if (!err)
                                                        {
                                                            if( results.length != 0)
                                                            {
                                                                var relatedQuery = results[0];
                                                                console.log("         RELATED ITEM : " + JSON.stringify(relatedQuery.name,null,2));
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
                                                                            console.log("     RELATED ITEM COUNT : " + " = " + returnValues.length);
                                                                            //JSON.stringify(
                                                                            var x1 = returnValues1
                                                                            var x2 = returnValues
                                                                            console.log("          LHS : " + results[0].name + " = " + x1.length);
                                                                            console.log("          RHS : " + relatedQuery.name + " = " + x2.length);
                                                                            if ((x1.constructor === Array) && (x2.constructor === Array)) {

                                                                                var xdiff = diffFn(returnValues1, returnValues);
                                                                                console.log("          N: "  + JSON.stringify(xdiff.new,null,2))
                                                                                console.log("          D: "  + JSON.stringify(xdiff.deleted,null,2))
                                                                                console.log("          E: "  + JSON.stringify(xdiff.edited,null,2))
                                                                                console.log("          A: "  + JSON.stringify(xdiff.array,null,2))
                                                                                var newId = uuidv1();
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
                                                                                    relatedQuery.hash
                                                                                    );
                                                                            }
                                                                        } else {
                                                                            console.log("     error in related  : " + " = " + queryResult2.error);
                                                                        }
                                                                    });

                                                            }
                                                        }
                                                    });
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
                console.log("          Error: " );
           }
        })
    }catch (err) {
        console.log("          Error: " + err);
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
                var stmt = dbsearch.all(
                    "SELECT count(*) FROM queries;",
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
            } catch(err) {
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
          saveConnectionAndQueryForFile2(msg.fileId);






      } else if (msg.message_type == 'getRelatedDocuments') {
            //console.log("got message getRelatedDocuments" );
                    getRelatedDocuments(msg.id, function(results) {

                        //console.log("**getRelatedDocuments returned: " + results.length);
                    });




      } else if (msg.message_type == 'childSetSharedGlobalVar') {
            //console.log("  ... received, " + msg.nameOfVar + "[" + msg.index + "] = " + Object.keys(eval( "(" + msg.value + ")" )));
            //console.log("  ... received, " + msg.nameOfVar + "[" + msg.index + "] = " +eval( "(" + msg.value + ")" ).get_v2  );
            var ccc =  msg.nameOfVar + "['" + msg.index + "'] = (" + msg.value + ")";

            if (msg.nameOfVar == 'connections') {
                //console.log(ccc);
            }
            eval(ccc );


      } else if (msg.message_type == 'childRunIndexer') {
           //console.log("Set Index files timer");
           setInterval(indexFilesFn ,numberOfSecondsIndexFilesInterval * 1000);
           setInterval(indexFileRelationshipsFn ,numberOfSecondsIndexFilesInterval * 1000);


      } else if (msg.message_type == 'childRunFindFolders') {
           console.log("**** childRunFindFolders");
           setInterval(processFilesFn ,numberOfSecondsIndexFilesInterval * 1000);
           setTimeout(findFoldersFn ,1 * 1000);
           setInterval(findFilesInFoldersFn ,numberOfSecondsIndexFilesInterval * 1000);
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
    dbsearch.all(
        "select  id  from  relationships  where  " +
        "    source_query_hash = '"  +  doc_hash  +  "' and target_query_hash = '"  +  target_hash + "'"
        ,

        function(err, existsResults)
        {
            if (!err)
            {
                console.log("    " + doc_hash + " : " + target_hash + "... existsResults.length = " +  existsResults.length);
                if (existsResults.length == 0) {
                    var newId = uuidv1();
                    stmtInsertIntoRelationships.run(newId,  doc_hash, target_hash,  similar_count);
                }
            }
        }
    )
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
    if (ext == "doc") return true;
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
    (dir.indexOf("Windows") != -1 )
    ||
    (dir.indexOf("Program") != -1 )
    ||
    (dir.indexOf("Recycle") != -1 )
    ) {
        return;
    }

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
                            var stmt = dbsearch.all(
                                "select id from folders where path = ?",
                                [folderName],
                                function(err, results)
                                {
                                    if (!err)
                                    {
                                        if (results.length == 0) {
                                            var newId = uuidv1();
                                            stmtInsertIntoFolders.run(
                                                newId,
                                                fileOrFolder,
                                                folderName
                                                ,
                                                function(err3) {
                                                    console.log("     fileOrFolder: " + fileOrFolder)
                                                    try {
                                                        remoteWalk(fileOrFolder);
                                                    } catch(err3) {
                                                        console.log(err3)
                                                    }
                                                });
                                            }
                                            else {
                                                    try {
                                                        remoteWalk(fileOrFolder);
                                                    } catch(err4) {
                                                        console.log(err4)
                                                    }

                                            }
                                    }
                                });

                    }
                } catch(err) {
                    console.log(err)
                }

    });

};



function addFolderForIndexingIfNotExist(folderName) {
    var stmt = dbsearch.all(
        "select id from folders where path = ?",
        [folderName],
        function(err, results)
        {
            if (!err)
            {
                if (results.length == 0) {
                    var newId = uuidv1();
                    stmtInsertIntoFolders.run(
                        newId,
                        folderName,
                        folderName);
                    }
            } else {
                console.log(err)
            }
        });
}
var fileFilter = /\xlsx$|csv$|docx$|pdf$|glb$/
function directSearchFolders(drive) {
    fromDir(drive,fileFilter,function(filename){
        var dirname = path.dirname(filename)


        if (
        (dirname.indexOf("Windows") != -1 )
        ||
        (dirname.indexOf("Program") != -1 )
        ||
        (dirname.indexOf("Recycle") != -1 )
        ||
        (dirname.indexOf("Library") != -1 )
        ||
        (dirname.indexOf("Applications") != -1 )
        ) {
            // do nothing
        } else {
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
            //console.log(err)
        }
    };
};
