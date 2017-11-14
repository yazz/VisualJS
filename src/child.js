'use strict';

var isWin = /^win/.test(process.platform);
var fs           = require('fs');
var path         = require('path');
var mkdirp       = require('mkdirp')
const uuidv1 = require('uuid/v1');
var crypto = require('crypto');
var numberOfSecondsIndexFilesInterval = 5; 
var inScan = false;
var drivers      = new Object();
var connections  = new Object();
var queries      = new Object();
var XLSX = require('xlsx');
var csv = require('fast-csv');
var mammoth = require("mammoth");
var postgresdb   = require('pg');
var mysql      = require('mysql');


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



function outputToConsole(text) {
    var c = console;
    c.log(text);
}


var diff = require('deep-diff').diff
//console.log("Deep: " + diff)


var lhs = [
{line: 2, value: "The cat sat on the mat"}
,
{line: 1, value: "The cat sat on the mat2"}
,
{line: 3, value: "The cat sat on the mat2"}
    ]
;
 
var rhs = [

{line: 1, value: "The cat sat on the mat2"}
,
{line: 2, value: "The cat sat on the mat"}
,
{line: 3, value: "The cat sat on the mat2"}
,
{line: 4, value: "The cat sat on the mat2"}

];
 
var diffFn = function(lhs2, rhs2) {
    var differences = diff(lhs2, rhs2);
    return {
            new:     differences.filter(function (el) {return el.kind == 'N'}).length,
            deleted: differences.filter(function (el) {return el.kind == 'D'}).length,
            edited:  differences.filter(function (el) {return el.kind == 'E'}).length,
            array:   differences.filter(function (el) {return el.kind == 'A'}).length
    };

};
//console.log("")
//console.log("")
//console.log("")
//console.log("----------------------------------------------------------------------------------------------")
//console.log(JSON.stringify(differences,null,2))
var xdiff = diffFn(lhs, rhs);
//console.log("N: "  + JSON.stringify(xdiff.new,null,2))
//console.log("D: "  + JSON.stringify(xdiff.deleted,null,2))
//console.log("E: "  + JSON.stringify(xdiff.edited,null,2))
//console.log("A: "  + JSON.stringify(xdiff.array,null,2))
//console.log("----------------------------------------------------------------------------------------------")
//console.log("")
//console.log("")
//console.log("")




var sqlite3   = require2('sqlite3');
var os= require('os')
var username = "Unknown user";
username = os.userInfo().username.toLowerCase();
//console.log(username);


var dbsearch = new sqlite3.Database(username + '.vis');
dbsearch.run("PRAGMA synchronous=OFF;")
dbsearch.run("PRAGMA count_changes=OFF;")
dbsearch.run("PRAGMA journal_mode=MEMORY;")
dbsearch.run("PRAGMA temp_store=MEMORY;")









process.on('message', (msg) => {
  //console.log('Message from parent:', msg);
  
  if (msg.message_type == 'saveConnectionAndQueryForFile') {
      saveConnectionAndQueryForFile(
                                msg.fileId, 
                                msg.fileType, 
                                msg.size, 
                                msg.fileName, 
                                msg.fileType2);
                                
                                
                                
                                
                                
                                
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
  }



  
});


                        
                        
                        


let counter = 0;

setInterval(() => {
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
}, 1000);

























var stmtInsertIntoRelationships = dbsearch.prepare( " insert into relationships " + 
                                                    "    ( id, source_query_hash, target_query_hash, similar_row_count ) " +
                                                    " values " + 
                                                    "    (?,  ?,?,  ?);");



var stmtInsertIntoFiles = dbsearch.prepare(" insert into files " + 
                            "    ( id, name, contents ) " +
                            " values " + 
                            "    (?,  ?,?);");

var stmtInsertIntoConnections = dbsearch.prepare(" insert into connections " + 
                            "    ( id, name, driver, size, hash, type, fileName ) " +
                            " values " + 
                            "    (?,  ?,?,?,  ?,?,?);");
var stmtInsertInsertIntoQueries = dbsearch.prepare(" insert into queries " + 
                            "    ( id, name, connection, driver, size, hash, fileName, type, definition, preview, similar_count ) " +
                            " values " + 
                            "    (?,  ?,?,?,  ?,?,?, ?,?,?, 1);");

var stmtUpdateRelatedDocumentCount = dbsearch.prepare(" update queries " + 
                            "    set  similar_count = ?  " +
                            " where  " + 
                            "    id = ? ;");

var stmtUpdateRelationships = dbsearch.prepare(" update queries " + 
                            "    set  related_status = ?  " +
                            " where  " + 
                            "    hash = ? ;");


                                                
function saveConnectionAndQueryForFile(fileId, fileType, size, fileName, fileType2) {
    //console.log("... in saveConnectionAndQueryForFile:::: " + fileId)
    if (!fileName) {
        return;
    };
    if (fileName.indexOf("$") != -1) {
        return;
    };
    if (fileName.indexOf("gsd_") != -1) {
        return;
    };
    try {
        var contents = fs.readFileSync(fileName, "utf8");
        var hash = crypto.createHash('sha1');
        hash.setEncoding('hex');
        hash.write(contents);
        hash.end();
        var sha1sum = hash.read();
                             
//console.log("child 1")                             
        dbsearch.serialize(function() {
//console.log("child 2")                             
            var newid = uuidv1();
            stmtInsertIntoConnections.run(
                     newid,
                     fileId, 
                     fileType,
                     size,
                     sha1sum,
                     fileType2,
                     fileName, function(err) {
//console.log("child 3")                             
     
                            //connections[newid] = {id: newid, name: fileId, driver: fileType, size: size, hash: sha1sum, type: fileType2, fileName: fileName };
                            process.send({ 
                                            message_type:       "return_set_connection",
                                            id:         newid, 
                                            name:       fileId, 
                                            driver:     fileType, 
                                            size:       size, 
                                            hash:       sha1sum, 
                                            type:       fileType2, 
                                            fileName:   fileName
                            });
//console.log("child 4")                             
        
                            var copyfrom = fileName;
                            var saveName = "gsd_" + sha1sum.toString() + path.extname(fileName);
                            var stmt = dbsearch.all(
                                "select id from files where name = '" + saveName + "'",
                                function(err, results) 
                                {
                                    if (!err) 
                                    {
                                        if (results.length == 0) {
                                            dbsearch.serialize(function() {
                                                var newId = uuidv1();
                                                stmtInsertIntoFiles.run(
                                                    newId, 
                                                    saveName, 
                                                    fs.readFileSync(copyfrom),
                                                    
                                                    function(err) {
                                                        //console.log('added file to sqlite');
                                                        });
                                            });
                                        };
                                    };
                                });
                              
                              
                            dbsearch.serialize(function() {
                                    //console.log(":      saving query ..." + fileId);                        
                                    var newqueryid = uuidv1();
                                    stmtInsertInsertIntoQueries.run(newqueryid,
                                             fileId, 
                                             newid,
                                             fileType,
                                             size,
                                             sha1sum,
                                             fileName,
                                             fileType2,
                                             JSON.stringify({} , null, 2),
                                             JSON.stringify([{message: 'No preview available'}] , null, 2),
                                             function(err) {
                                                 if (err) {
                                                    //console.log('   err : ' + err);
                                                 }
                                                //console.log('   save result set fileid 1 : ' + fileId );
                                                var fileId2 = fileId;
                                                //console.log('   save result set fileid 2 : ' + fileId2 );
                                                var newqueryid2 = newqueryid;
                                                var fileType2 = fileType;
                                                var newid2 = newid;
                                                
                                                
                                                process.send({ 
                                                                message_type:       "return_set_query",
                                                                id:                 newqueryid,
                                                                name:               fileId,
                                                                connection:         newid,
                                                                driver:             fileType, 
                                                                size:               size, 
                                                                hash:               sha1sum, 
                                                                fileName:           fileName, 
                                                                type:               fileType2,
                                                                definition:         JSON.stringify({} , null, 2), 
                                                                preview:            JSON.stringify([{message: 'No preview available'}] , null, 2)});

                                                        //console.log('    ...  entering getresult v2:  '  + fileId2);
                                                         
                                                    }
                                                );
                            });
                            //console.log("... query saved: " + fileId);
                            
                         
                     });                     
        });
    } catch(err) {
        //console.log("Error " + err + " with file: " + fileName);     
        return err; 
    } finally {
        
    }
}









function getRelatedDocuments(id, callback) {
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





function getRelatedDocumentHashes(  doc_hash,  callback  ) {
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
                        stmtUpdateRelationships.run('INDEXED', doc_hash);
                        for (var i =0 ; i < results.length; i++) {
                            var newId = uuidv1();
                            stmtInsertIntoRelationships.run(newId,  doc_hash, results[i].hash,  results[i].size);
                            
                        }
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
     
     
     
}












        var indexFileRelationshipsFn = function() {
           
           try {
            var stmt = dbsearch.all(
                "SELECT * FROM queries WHERE related_status IS NULL LIMIT 1 " ,
                function(err, results) 
                {
                    if (!err) 
                    {
                        if( results.length != 0) 
                        {
                            console.log("" );
                            console.log("" );
                            console.log("In indexFileRelationshipsFn  " );
                            console.log("      query to index: " + JSON.stringify(results[0].name,null,2));
                            var queryToIndex = results[0];

                            getRelatedDocumentHashes(queryToIndex.hash, function(relatedResults) {
                                console.log("      Related hashes: " + JSON.stringify(relatedResults.length,null,2));
                                  
                                if (relatedResults.length > 0) {
                                    getResult(  
                                        relatedResults[0].id, 
                                        relatedResults[0].connection, 
                                        relatedResults[0].driver, 
                                        {}, 
                                        function(queryResult)
                                        {
                                            
                                            if (!queryResult.error) {
                                                console.log("     source result length : " + " = " + queryResult.length);
                                            }
                                        });
                                    
                                    
                                    
                                    
                                    //console.log("**getRelatedDocumentHashes returned: " + results.length);
                                    //zzz
                                    for (var i = 0; i < relatedResults.length; i ++) {
                                        //console.log("**** : " + JSON.stringify(results[i],null,2));
                                        //var dxz = diffFn();
                                    }
                                
                                
                                
                                
                                
                                            /*getResult(  results[0].id, 
                                                results[0].connection, 
                                                results[0].driver, 
                                                {}, 
                                                function(result)
                                                {
                                                    
                                                    if (!result.error) {
                                                        //console.log("File added v2: " + JSON.stringify(results[0].fileName,null,2));
                                                    }
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
        
        
        
        
        
        











        
        
        var indexFilesFn = function() {
            //console.log("Index files");
            //console.log("    inScan: " + inScan);
           if (inScan) {
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
        
        
        
        
        
        
        
        
        
        
        
        
var stmt2 = null;
var stmt3 = null;
var setIn = null;

        
        
        
var getResult = function(source, connection, driver, definition, callback) {
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