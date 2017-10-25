'use strict';

var isWin = /^win/.test(process.platform);
var fs           = require('fs');
var path         = require('path');
var mkdirp       = require('mkdirp')
const uuidv1 = require('uuid/v1');
var crypto = require('crypto');

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

var sqlite3   = require2('sqlite3');
var dbsearch = new sqlite3.Database('gosharedatasearch.sqlite3');



function copyFileSync( source, target ) {

    var targetFile = target;

    //if target is a directory a new file with the same name will be created
    if ( fs.existsSync( target ) ) {
        if ( fs.lstatSync( target ).isDirectory() ) {
            targetFile = path.join( target, path.basename( source ) );
        }
    }

    fs.writeFileSync(targetFile, fs.readFileSync(source));
}



process.on('message', (msg) => {
  console.log('Message from parent:', msg);
  
  if (msg.message_type == 'saveConnectionAndQueryForFile') {
      saveConnectionAndQueryForFile(
                                msg.fileId, 
                                msg.fileType, 
                                msg.size, 
                                msg.fileName, 
                                msg.fileType2);
                                
                                
                                
                                
                                
                                
  } else if (msg.message_type == 'getRelatedDocuments') {
        console.log("got message getRelatedDocuments" );
                getRelatedDocuments(msg.id, function(results) {
                    
                    console.log("**getRelatedDocuments returned: " + results.length);
                });
  }


});







let counter = 0;

setInterval(() => {
    var countSqlite = 99;
    //dbsearch.run("PRAGMA journal_mode=WAL;")
    dbsearch.run("PRAGMA synchronous=OFF;")
    dbsearch.run("PRAGMA count_changes=OFF;")
    dbsearch.run("PRAGMA journal_mode=MEMORY;")
    dbsearch.run("PRAGMA temp_store=MEMORY;")

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
                                                counter:    counter++, sqlite: JSON.stringify(results[0],null,2)  });
                            }
                        }
                    })
            } catch(err) {
                                process.send({  message_type:       "return_test_fork",
                                                counter:    counter++, sqlite: "Err: " + err  });
                
            }
}, 1000);






















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



                                                
function saveConnectionAndQueryForFile(fileId, fileType, size, fileName, fileType2) {
    console.log("... in saveConnectionAndQueryForFile:::: " + fileId)
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
                             
console.log("child 1")                             
        dbsearch.serialize(function() {
console.log("child 2")                             
            var newid = uuidv1();
            stmtInsertIntoConnections.run(
                     newid,
                     fileId, 
                     fileType,
                     size,
                     sha1sum,
                     fileType2,
                     fileName, function(err) {
console.log("child 3")                             
     
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
console.log("child 4")                             
        
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
                                                        console.log('added file to sqlite');
                                                        });
                                            });
                                        };
                                    };
                                });
                              
                              
                            dbsearch.serialize(function() {
                                    console.log(":      saving query ..." + fileId);                        
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
                                                    console.log('   err : ' + err);
                                                 }
                                                console.log('   save result set fileid 1 : ' + fileId );
                                                var fileId2 = fileId;
                                                console.log('   save result set fileid 2 : ' + fileId2 );
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

                                                        console.log('    ...  entering getresult v2:  '  + fileId2);
                                                         
                                                    }
                                                );
                            });
                            console.log("... query saved: " + fileId);
                            
                         
                     });                     
        });
    } catch(err) {
        console.log("Error " + err + " with file: " + fileName);     
        return err; 
    } finally {
        
    }
}









function getRelatedDocuments(id, callback) {
        console.log("In getRelatedDocuments" );
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
        var stmt = dbsearch.all(
            sql,
            function(err, results) 
            {
                if (!err) 
                {
                    dbsearch.serialize(function() {
                            stmtUpdateRelatedDocumentCount.run(results.length, id);
                    })                                    
                     
        console.log("OK")
                    if (callback) {
                        callback(results);
                    }
                    process.send({  message_type:       "return_similar_documents",
                                    query_id:            id,
                                    results: JSON.stringify(results,null,2)  });
                }
            })
    } catch(err) {
        console.log(err)
                        process.send({  message_type:       "return_similar_documents",
                                        sqlite: "Err: " + err  });
        
    }
     
     
     
}
