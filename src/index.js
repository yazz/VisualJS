'use strict';

var isPi = require('detect-rpi');
var isWin = /^win/.test(process.platform);
var isRaspberryPi = isPi();

function require2(moduleName) {
	var pat;
	if (isWin) {
		pat = "require(process.cwd() + " + "'\\\\node_modules\\\\" + moduleName + "');";
	} else {
	    pat = "require(process.cwd() + " + "'/node_modules/" + moduleName + "');";
	}

	//console.log('PATH: ' + pat);
	//console.log('    MODULE PATH: ' + process.cwd() + '/node_modules/' + moduleName);
    var reac = eval(pat);
	return reac;
};

var fs              = require('fs');
var path            = require('path');
var mkdirp          = require('mkdirp')
const uuidv1        = require('uuid/v1');
var fork            = require('child_process');
var drivers         = new Object();
var connections     = new Object();
var queries         = new Object();
var express         = require('express')
var app             = express()
var expressWs       = require('express-ws')(app);
var request         = require("request");
var open            = require('open');
var dbhelper        = require('../public/dbhelper');
var Excel           = require('exceljs');
var compression     = require('compression')
var crypto          = require('crypto');
var async           = require('async');
var dns             = require('dns');
var url             = require('url');
var net             = require('net');
var unzip           = require('unzip');
var postgresdb      = require('pg');
var ip              = require("ip");
var program         = require('commander');
var os              = require('os')
var bodyParser      = require('body-parser');
var multer          = require('multer');
var upload          = multer( { dest: 'uploads/' } );
var diff            = require('deep-diff').diff
var XLSX            = require('xlsx');
var csv             = require('fast-csv');
var mysql           = require('mysql');
var cors            = require('cors')
var mammoth         = require("mammoth");
var isBinaryFile    = require("isbinaryfile");

path.join(__dirname, '../public/jquery-1.9.1.min.js')
path.join(__dirname, '../public/jquery.zoomooz.js')
path.join(__dirname, '../public/alasql.min.js')
path.join(__dirname, '../public/polyfill.min.js')
path.join(__dirname, '../src/oracle.js')
path.join(__dirname, '../src/postgres.js')
path.join(__dirname, '../src/excel.js')
path.join(__dirname, '../src/child.js')
path.join(__dirname, '../public/gosharedata_setup.js')
path.join(__dirname, '../public/intranet.js')
path.join(__dirname, '../public/tether.min.js')
path.join(__dirname, '../public/bootstrap.min.js')
path.join(__dirname, '../public/bootstrap.min.css')
path.join(__dirname, '../public/aframe.min.js')
path.join(__dirname, '../public/es6-shim.js')
path.join(__dirname, '../public/vue_app.css')
path.join(__dirname, '../public/dist/build.js')
//path.join(__dirname, '../oracle_driver.zip')
path.join(__dirname, '../public/visifile_logo.PNG')
path.join(__dirname, '../public/VisiFileColor.png')
path.join(__dirname, '../public/VisiFileColorHoriz.png')
path.join(__dirname, '../public/favicon.ico')
path.join(__dirname, '../public/driver_icons/excel.jpg')
path.join(__dirname, '../public/driver_icons/csv.jpg')
path.join(__dirname, '../public/driver_icons/txt.jpg')
path.join(__dirname, '../public/driver_icons/oracle.jpg')
path.join(__dirname, '../public/driver_icons/postgres.jpg')
path.join(__dirname, '../public/driver_icons/mysql.jpg')
path.join(__dirname, '../public/driver_icons/sqlite.jpg')
path.join(__dirname, '../public/driver_icons/word.jpg')
path.join(__dirname, '../public/driver_icons/pdf.jpg')
path.join(__dirname, '../public/driver_icons/glb.jpg')
path.join(__dirname, '../public/index_pc_mode.html')
path.join(__dirname, '../public/dropzone.js')
path.join(__dirname, '../public/dropzone.css')
path.join(__dirname, '../public/locked.png')
path.join(__dirname, '../public/unlocked.png')
path.join(__dirname, '../public/visifile/list_intranet_servers.html')
path.join(__dirname, '../public/list_intranet_servers.html')
path.join(__dirname, '../public/\aframe_fonts/Roboto-msdf.json')
path.join(__dirname, '../public/\aframe_fonts/Roboto-msdf.png')
path.join(__dirname, '../public/\aframe_fonts/Aileron-Semibold.fnt')
path.join(__dirname, '../public/\aframe_fonts/Aileron-Semibold.png')
path.join(__dirname, '../public/\aframe_fonts/SourceCodePro.fnt')
path.join(__dirname, '../public/\aframe_fonts/SourceCodePro.png')


if (!fs.existsSync(process.cwd() + "/node-viewerjs") ) {
    copyFolderRecursiveSync(path.join(__dirname, "../node-viewerjs")  , process.cwd() ); }

if (!fs.existsSync(process.cwd() + "/node_modules") ) {
    copyFolderRecursiveSync(path.join(__dirname, "../node_modules")  , process.cwd() ); }

if (!fs.existsSync(process.cwd() + "/node_modules/nan") ) {
    copyFolderRecursiveSync(path.join(__dirname, "../node_modules/nan")  , process.cwd() + "/node_modules" ); }

if (!fs.existsSync(process.cwd() + "/node_modules/sqlite3") ) {
    copyFolderRecursiveSync(path.join(__dirname, "../node_modules/sqlite3")  , process.cwd() + "/node_modules" ); }

if (!fs.existsSync(process.cwd() + "/node_modules/pdf2json") ) {
    copyFolderRecursiveSync(path.join(__dirname, "../node_modules/pdf2json")  , process.cwd() + "/node_modules" ); }

if (!fs.existsSync(process.cwd() + "/node_macos64") ) {
    copyFolderRecursiveSync(path.join(__dirname, "../node_macos64")  , process.cwd() ); }

if (!fs.existsSync(process.cwd() + "/node_win32") ) {
    copyFolderRecursiveSync(path.join(__dirname, "../node_win32")  , process.cwd() ); }


if (!fs.existsSync(process.cwd() + "/node_pi") ) {
    copyFolderRecursiveSync(path.join(__dirname, "../node_pi")  , process.cwd() ); }




if (isWin) {
    //console.log('******* WINDOWS *******');
	// copy WIndows 32 node native files
	copyNodeNativeAdapter( "win32", "sqlite3", 		"lib/binding/node-v57-win32-ia32" , "node_sqlite3.node")



} else if (isRaspberryPi) {
    //console.log('******* PI *******');
	// copy Raspberry PI ARM node native files
	copyNodeNativeAdapter( "pi", "sqlite3", 	"lib/binding/node-v48-linux-arm" , "node_sqlite3.node")



} else { //means Mac OS
    //console.log('******* MAC *******');
	// copy Mac OS 64 node native files
	copyNodeNativeAdapter( "macos64", "sqlite3", 	"lib/binding/node-v57-darwin-x64" , "node_sqlite3.node")
}



var timeout                             = 0;
var init_drivers                        = false;
var port;
var hostaddress;
var typeOfSystem;
var centralHostAddress;
var centralHostPort;
var toeval;
var stmt2                               = null;
var stmt3                               = null;
var setIn                               = null;
var stopScan                            = false;
var inScan                              = false;
var numberOfSecondsAliveCheck           = 60;
var username                            = "Unknown user";
var serverwebsockets                    = [];
var portrange                           = 3000
var dbsearch;
var requestClientInternalHostAddress    = '';
var requestClientInternalPort           = -1;
var requestClientPublicIp               = '';
var requestClientPublicHostName         = '';
var locked;
var requestClientPublicIp;
var in_when_queries_changes             = false;
var hostcount  												  = 0;
var pgeval
var sqliteeval
var tdeval
var in_when_connections_changes					= false;
var forked;
var forkedIndexer;




app.use(compression())
mkdirp.sync("uploads");
mkdirp.sync("files");



program
  .version('0.0.1')
  .option('-t, --type [type]', 'Add the specified type of app (client/server) [type]', 'client')
  .option('-p, --port [port]', 'Which port should I listen on? (default 80) [port]', parseInt)
  .option('-h, --host [host]', 'Server address of the central host (default visifile.com) [host]', 'visifile.com')
  .option('-l, --locked [locked]', 'Allow server to be locked/unlocked on start up (default true) [locked]', 'true')
  .option('-s, --hostport [hostport]', 'Server port of the central host (default 80) [hostport]', parseInt)
  .parse(process.argv);


locked = (program.locked == 'true');
port = program.port;
if (!isNumber(port)) {
    port = 80;
};

outputToConsole('VisiFile node local hostname: ' + ip.address() + ' ')

setupVisifileParams();

//console.log(" ");
//console.log("-----------------------------------------------------------------------");
//console.log("                         Starting VisiFile ");
//console.log("-----------------------------------------------------------------------");

//console.log(" ");
//console.log(" ");
//console.log(" ");
//console.log("-----------------------------------------------------------------------");
//console.log("                 This takes about 2 minutes the first time");
//console.log("-----------------------------------------------------------------------");
//console.log(" ");


var PDFParser       = require2("pdf2json");
var sqlite3         = require2('sqlite3');

username = os.userInfo().username.toLowerCase();
dbsearch = new sqlite3.Database(username + '.vis');
//dbsearch.run("PRAGMA journal_mode=WAL;")
dbsearch.run("PRAGMA synchronous=OFF;")
dbsearch.run("PRAGMA count_changes=OFF;")
dbsearch.run("PRAGMA journal_mode=MEMORY;")
dbsearch.run("PRAGMA temp_store=MEMORY;")

//console.log("... ");

async.map([
        "CREATE TABLE IF NOT EXISTS search_rows_hierarchy (document_binary_hash TEXT, parent_hash TEXT, child_hash TEXT);",
        "CREATE INDEX IF NOT EXISTS search_rows_hierarchy_document_binary_hash_idx ON search_rows_hierarchy (document_binary_hash);",
        "CREATE INDEX IF NOT EXISTS search_rows_hierarchy_parent_hash_idx ON search_rows_hierarchy (parent_hash);",
        "CREATE INDEX IF NOT EXISTS search_rows_hierarchy_child_hash_idx ON search_rows_hierarchy (child_hash);",

        "CREATE TABLE IF NOT EXISTS drivers (id TEXT, name TEXT, type TEXT, code TEXT);",

        "CREATE TABLE IF NOT EXISTS files (id TEXT, name TEXT, contents BLOB);",

        "CREATE TABLE IF NOT EXISTS connections (id TEXT, name TEXT, driver TEXT, database TEXT, host TEXT, port TEXT ,connectString TEXT, user TEXT, password TEXT, fileName TEXT, size INTEGER, type TEXT, preview TEXT, hash TEXT, status TEXT);",

        "CREATE TABLE IF NOT EXISTS relationships (id TEXT, source_query_hash TEXT, target_query_hash TEXT, " +
            "similar_row_count INTEGER, new_source INTEGER, new_target INTEGER, edited_source INTEGER, edited_target INTEGER, deleted_source INTEGER, deleted_target INTEGER, array_source INTEGER, array_target INTEGER);",

        "CREATE TABLE IF NOT EXISTS queries (id TEXT, name TEXT, connection INTEGER, driver TEXT, size INTEGER, hash TEXT, type TEXT, fileName TEXT, definition TEXT, preview TEXT, status TEXT, index_status TEXT, similar_count INTEGER, related_status TEXT);",

        "CREATE TABLE IF NOT EXISTS intranet_client_connects (id TEXT, internal_host TEXT, internal_port INTEGER, public_ip TEXT, via TEXT, public_host TEXT, user_name TEXT, client_user_name TEXT, when_connected INTEGER);"

            ],

    function(a,b){
        try {
            dbsearch.serialize(function()
            {
                dbsearch.run(a);
            });
            return b(null,a);
        } catch(err) {
            //console.log(err);
            return b(null,a);
        }
    },

    function(err, results){
        //console.log("async test ");
        //console.log("    err= " + JSON.stringify(err,null,2));
        //console.log("    res= " + JSON.stringify(results,null,2));

        try
        {
            var stmt = dbsearch.all(
                "SELECT name FROM sqlite_master WHERE type='table' AND name='zfts_search_rows_hashed';",
                function(err, results)
                {
                    if (!err)
                    {
                        if( results.length == 0)
                        {
                            dbsearch.serialize(function()
                            {
                                dbsearch.run("CREATE VIRTUAL TABLE zfts_search_rows_hashed USING fts5(row_hash, data);");
                            });
                        }
                        getPort(mainProgram);

                    }
                });
        } catch(err) {
            //console.log(err);
        } finally {
        }});











function setupVisifileParams() {
    typeOfSystem = program.type;
    centralHostAddress = program.host;
    centralHostPort = program.hostport;
    if (!isNumber(centralHostPort)) {centralHostPort = 80;};


    if (!(typeOfSystem == 'client' || typeOfSystem == 'server')) {
        outputToConsole('-------* Invalid system type: ' + typeOfSystem);
        process.exit();
    };
    console.log('-------* System type: ' + typeOfSystem);
    console.log('-------* Port: ' + port);
    console.log('-------* Central host: ' + centralHostAddress);
    console.log('-------* Central host port: ' + centralHostPort);


	console.dir ( ip.address() );

	//console.log('addr: '+ ip.address());
	hostaddress = ip.address();

	}










function mainProgram() {

    startServices()
    console.log('Start Services' );

    //scanHardDisk();
    console.log('Start Hard Disk Scan' );
}
























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




function setSharedGlobalVar(nameOfVar, index, value) {
    //console.log(setSharedGlobalVar);
    //console.log("sent " + nameOfVar + "[" + index + "] = "   + "...");
    //console.log("sent " + nameOfVar + "[" + index + "] = " + eval(value).get_v2  + "...");
    var tosend = nameOfVar + "['" + index + "'] = " + value ;
    //console.log(tosend);
    eval(tosend);
    try {
        var sharemessage = {
                            message_type:       'childSetSharedGlobalVar',
                            nameOfVar:          nameOfVar,
                            index:              index,
                            //value:              JSON.stringify(value,null,2)
                            value:              value
                        };
        forked.send(sharemessage);
        forkedIndexer.send(sharemessage);
        /*sendOverWebSockets({
                                type:               "setSharedGlobalVar",
                                nameOfVar:          nameOfVar,
                                index:              index,
                                value:              value
                                });*/
    } catch(err) {
        //console.log("Error with " + err );
        return err;
    } finally {

    }
}




function mkdirSync(dirPath) {
    try {
        mkdirp.sync(dirPath)
    } catch (err) {
        //if (err.code !== 'EEXIST') throw err
    }
}


function outputToConsole(text) {
    var c = console;
    c.log(text);
}


function copyNodeNativeAdapter( osName, moduleName, directoryToSaveTo , nativeFileName) {
    //console.log('Copy started of : ' + osName + ', '+ moduleName + ','+ directoryToSaveTo + ','+ nativeFileName);
	if (!fs.existsSync(process.cwd() + "/node_modules/" + moduleName + "/" + directoryToSaveTo + "/" + nativeFileName) ) {
		//console.log('* Creating native driver for: ' + moduleName);
		mkdirSync(process.cwd() + "/node_modules/" + moduleName +  "/" + directoryToSaveTo);
		copyFileSync(	process.cwd() + "/node_" + osName + "/" + nativeFileName + "rename",
                        process.cwd() + "/node_modules/" + moduleName + "/" + directoryToSaveTo + "/" + nativeFileName) ;
	}
	//console.log('Copy done');
}




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


function saveConnectionAndQueryForFile(fileId, fileType, size, fileName, fileType2) {
    //console.log("... in saveConnectionAndQueryForFile:::: " + fileId)
    sendOverWebSockets({
                            type:   "server_scan_status",
                            value:  "Found file " + fileName
                            });
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
        forked.send({
                        message_type:       'saveConnectionAndQueryForFile',
                        fileId:             fileId,
                        fileType:           fileType,
                        size:               size,
                        fileName:           fileName,
                        fileType2:          fileType2
                        });

    } catch(err) {
        //console.log("Error " + err + " with file: " + fileName);
        return err;
    } finally {

    }
}





function walk(dir, done) {
   if (stopScan) {
       inScan = false;
         return;
   };
   ////console.log('dir: ' + dir);
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    var pending = list.length;
    if (!pending) return done(null);
    list.forEach(function(file) {
      file = path.resolve(dir, file);
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
            sendOverWebSockets({
                                    type:   "server_scan_status",
                                    value:  "Scanning directory " + file
                                    });
           setTimeout(function() {
                              walk(file, function(err) {
                            if (!--pending) done(null);
                          });
          }, 10 * 1000);
        } else {
		  if (isExcelFile(file)) {
                //console.log('file: ' + file);
  					var excelFile = file;
  						if (typeof excelFile !== "undefined") {
							var fileId = excelFile.replace(/[^\w\s]/gi,'');
  							//console.log('Saving from walk   *file id: ' + fileId);
  							//console.log('   *size: ' + stat.size);

                            saveConnectionAndQueryForFile(fileId, 'excel', stat.size, excelFile, '|SPREADSHEET|');

						}
					}
		  if (isGlbFile(file)) {
                //console.log('GLB file: ' + file);
  					var GLBFile = file;
  						if (typeof GLBFile !== "undefined") {
							var fileId = GLBFile.replace(/[^\w\s]/gi,'');
  							//console.log('Saving from walk   *file id: ' + fileId);
  							//console.log('   *size: ' + stat.size);

                            saveConnectionAndQueryForFile(fileId, 'glb', stat.size, GLBFile, '|GLB|');
						}
					}
		  if (isCsvFile(file)) {
                //console.log('CSV file: ' + file);
  					var CSVFile = file;
  						if (typeof CSVFile !== "undefined") {
							var fileId = CSVFile.replace(/[^\w\s]/gi,'');
  							//console.log('Saving from walk   *file id: ' + fileId);
  							//console.log('   *size: ' + stat.size);

                            saveConnectionAndQueryForFile(fileId, 'csv', stat.size, CSVFile, '|CSV|');
						}
					}
		  if (isWordFile(file)) {
                //console.log('WORD file: ' + file);
  					var WordFile = file;
  						if (typeof WordFile !== "undefined") {
							var fileId = WordFile.replace(/[^\w\s]/gi,'');
  							//console.log('Saving from walk   *file id: ' + fileId);
  							//console.log('   *size: ' + stat.size);

                            saveConnectionAndQueryForFile(fileId, 'word', stat.size, WordFile, '|DOCUMENT|');
						}
					}
		  if (isPdfFile(file)) {
                //console.log('PDF file: ' + file);
  					var PdfFile = file;
  						if (typeof PdfFile !== "undefined") {
							var fileId = PdfFile.replace(/[^\w\s]/gi,'');
  							//console.log('Saving from walk   *file id: ' + fileId);
  							//console.log('   *size: ' + stat.size);

                            saveConnectionAndQueryForFile(fileId, 'pdf', stat.size, PdfFile, '|DOCUMENT|');
						}
					}          if (!--pending) done(null);
        }
      });
    });
  });
};









function addOrUpdateDriver(name, code2, theObject) {
      var code = eval(code2);
	var driverType = theObject.type;
	//console.log('addOrUpdateDriver: ' + name);

      var stmt = dbsearch.all("select name from drivers where name = '" + name + "';",
          function(err, rows) {
              if (!err) {
                  //console.log('             : ' + rows.length);
                  if (rows.length == 0) {
                      try
                      {
                          dbsearch.serialize(function() {
                              var stmt = dbsearch.prepare(" insert or replace into drivers " +
                                                          "    (id,  name, type, code ) " +
                                                          " values " +
                                                          "    (?, ?,?,?);");
                          stmt.run(uuidv1(),  name,  driverType,  code2);
                          stmt.finalize();
                          });
                      } catch(err) {
                          //console.log('err             : ' + err);
                      } finally {

                      }

                  } else {
                      //console.log('   *** Checking DRIVER ' + name);
                      var existingDriver = rows[0];
                      if (!(code2 == existingDriver.code)) {
                          try
                          {
                              dbsearch.serialize(function() {
                                  var stmt = dbsearch.prepare(" update   drivers   set code = ? where id = ?");
                                  stmt.run( code2 , rows[0].id );
                                  stmt.finalize();
                              });
                          } catch(err) {
                              //console.log('err             : ' + err);
                          } finally {

                          }
                      }
                  }
              }
          }
      );
  }





function scanHardDisk() {
    stopScan = false;
    inScan = true;
	var useDrive = "C:\\";
    if (!isWin) {
        useDrive = '/';
    }

    if (!stopScan) {
        walk(useDrive, function(error){
            //console.log('*Error: ' + error);
        });
        inScan = false;
	  };
      sendOverWebSockets({
                              type:   "server_scan_status",
                              value:  "Hard disk scan in progress"
                              });
};



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

function copyFolderRecursiveSync( source, target ) {
    //console.log('çopy from: '+ source + ' to ' + target);
    var files = [];

    //check if folder needs to be created or integrated
    var targetFolder = path.join( target, path.basename( source ) );
    if ( !fs.existsSync( targetFolder ) ) {
        fs.mkdirSync( targetFolder );
    }

    //copy
    if ( fs.lstatSync( source ).isDirectory() ) {
        files = fs.readdirSync( source );
        files.forEach( function ( file ) {
            var curSource = path.join( source, file );
            if ( fs.lstatSync( curSource ).isDirectory() ) {
                copyFolderRecursiveSync( curSource, targetFolder );
            } else {
                copyFileSync( curSource, targetFolder );
				//console.log('copying:  ' + targetFolder);
            }
        } );
    }
}











function getResult(  source, connection, driver, definition, callback  ) {
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
            //console.log("****************** err 1" + err);
            callback.call(this,{error: true});
        }
    } else {
        //console.log("04");
        //console.log("****************** err 7" );
        dbsearch.serialize(function() {
            //console.log("05");
            dbsearch.run("begin transaction");
            setIn.run("ERROR: no connection for " + source , source);
            dbsearch.run("commit");
            callback.call(this,{error: true});
        });
    }
    //console.log("****************** err 10" );
}
















function sendOverWebSockets(data) {
    var ll = serverwebsockets.length;
    //console.log('send to sockets Count: ' + JSON.stringify(serverwebsockets.length));
    for (var i =0 ; i < ll; i++ ) {
        var sock = serverwebsockets[i];
        if (sock.readyState == 1) {
            sock.send(JSON.stringify(data));
        }
        //console.log('                    sock ' + i + ': ' + JSON.stringify(sock.readyState));
    }
}





function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}






// ============================================================
// This sends a message to a specific websocket
// ============================================================
function sendToBrowserViaWebSocket(aws, msg) {
    aws.send(JSON.stringify(msg,null,2));
}









function isLocalMachine(req) {
    if ((req.ip == '127.0.0.1') || (hostaddress == req.ip)) {  // this is the correct line to use
    //if (req.ip == '127.0.0.1')  {      // this is used for debugging only so that we can deny access from the local machine
        return true;
    };
    return false;
}





//------------------------------------------------------------------------------
// test if allowed
//------------------------------------------------------------------------------
function canAccess(req,res) {
    if (!locked) {
        return true;
    };
    if (isLocalMachine(req) ) {
        return true;
    };
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end("Sorry but access to " + username + "'s data is not allowed. Please ask " + username + " to unlocked their VisiFile account");
    return false;
};







function getPort (cb) {
    console.log('function getPort()')
    var server = net.createServer()

    server.listen(port, ip.address(), function (err) {
        console.log('trying port: ' + port + ' ')
        server.once('close', function () {
        })
        server.close()
    })
    server.on('error', function (err) {
        console.log('Couldnt connect on port ' + port + '...')
        if (port < portrange) {
            port = portrange
            };
        console.log('... trying port ' + port)
        portrange += 1
        getPort(cb)
    })
    server.on('listening', function (err) {
            console.log('Can connect on port ' + port + ' :) ')
            cb()
    })
}












function extractHostname(url) {
    var hostname;
    //find & remove protocol (http, ftp, etc.) and get hostname

    if (url.indexOf("://") > -1) {
        hostname = url.split('/')[2];
    }
    else {
        hostname = url.split('/')[0];
    }

    //find & remove port number
    hostname = hostname.split(':')[0];
    //find & remove "?"
    hostname = hostname.split('?')[0];

    return hostname;
}




function extractRootDomain(url) {
    var domain = extractHostname(url),
        splitArr = domain.split('.'),
        arrLen = splitArr.length;

    //extracting the root domain here
    if (arrLen > 2) {
        domain = splitArr[arrLen - 2] + '.' + splitArr[arrLen - 1];
    }
    return domain;
}





function findViafromString(inp) {
    if (inp == null) {
        return "";
    }

    var ll = inp.split(' ');
    for (var i=0; i< ll.length ; i++){
        if (ll[i] != null) {
            if (ll[i].indexOf(":") != -1) {
                return extractRootDomain(ll[i]);
            }
        }
    }
    return "";
}








function aliveCheckFn() {
		var urlToConnectTo = "http://" + centralHostAddress + ":" + centralHostPort + '/client_connect';
		//console.log('-------* urlToConnectTo: ' + urlToConnectTo);
		//console.log('trying to connect to central server...');
		request({
					uri: urlToConnectTo,
					method: "GET",
					timeout: 10000,
					agent: false,
					followRedirect: true,
					maxRedirects: 10,
					qs: {
							requestClientInternalHostAddress: hostaddress
							,
							requestClientInternalPort:        port
							,
							clientUsername:        username
					}
				},
				function(error, response, body) {
					//console.log('Error: ' + error);
					if (response) {
							if (response.statusCode == '403') {
										//console.log('403 received, not allowed through firewall for ' + urlToConnectTo);
										//open("http://" + centralHostAddress + ":" + centralHostPort);
							} else {
										////console.log('response: ' + JSON.stringify(response));
										////console.log(body);
							}
					}
				});
};












function when_queries_changes(callback) {
    if (!in_when_queries_changes) {
        in_when_queries_changes = true;
        //console.log('Called when_queries_changes ');
        ////console.log('    connection keys:  ' + JSON.stringify(Object.keys(connections),null,2));
        var stmt = dbsearch.all("select * from queries",
            function(err, results) {
                if (!err) {
                //console.log('    --------Found:  ' + results.length);


                // find previews
                for (var i = 0 ; i < results.length ; i ++) {
                    var query = results[i];
                    if (!queries[query.id]) {
                        setSharedGlobalVar("queries", query.id, JSON.stringify(query,null,2));
                        var oout = [{a: 'no EXCEL'}];
                        try {
                            ////console.log('get preview for query id : ' + query._id);
                            ////console.log('          driver : ' + query.driver);
                            var restrictRows = JSON.parse(query.definition);
                            restrictRows.maxRows = 10;
                            /*drivers[query.driver]['get_v2'](connections[query.connection],restrictRows,
                                function(ordata) {
                                    ////console.log('getting preview for query : ' + query.name);
                                    query.preview = JSON.stringify(ordata, null, 2);
                                    queries.put(query);
                            });*/
                                callback.call(this);
                            if (callback) {
                            }
                        } catch (err) {};
                    }
                };
            }
            in_when_queries_changes = false;

            });
    }
};











function addNewQuery( params ) {
    try
    {
        //console.log("------------------function addNewQuery( params ) { -------------------");
        dbsearch.serialize(function() {
            var stmt = dbsearch.prepare(" insert into queries " +
                                        "    ( id, name, connection, driver, definition, status, type ) " +
                                        " values " +
                                        "    (?,    ?, ?, ?, ?, ?, ?);");

            var newQueryId = uuidv1();
            stmt.run(newQueryId,
                     params.name,
                     params.connection,
                     params.driver,
                     params.definition,
                     params.status,
                     params.type
                     );

            stmt.finalize();
            when_queries_changes(null);
            getResult(newQueryId, params.connection, params.driver, eval("(" + params.definition + ")"), function(result){});
        });
    } catch(err) {
        //console.log("                          err: " + err);
    } finally {
    }
}













function when_connections_changes() {
    if (!in_when_connections_changes) {
        in_when_connections_changes=true;
        //console.log('------------------------------------');
        //console.log('Called when_ CONNS _changes ');
        //console.log('------------------------------------');
        //console.log('------------------------------------');

        var stmt = dbsearch.all("select * from connections",
            function(err, results) {
                if (!err) {
                    for (var i = 0 ; i < results.length ; i ++) {
                        var conn = results[i]
                        ////console.log('    --------Found conn:  ' + conn._id);
                        ////console.log('                      :  ' + conn.name);
                        if (!connections[conn.id]) {
                          ////console.log(a);
                          setSharedGlobalVar("connections", conn.id, JSON.stringify(conn,null,2));
                        }
                    }
                }
            in_when_connections_changes=false;
            }
        );
    };
}


function addNewConnection( params ) {
    try
    {
        //console.log("------------------function addNewConnection( params ) { -------------------");
        dbsearch.serialize(function() {
            var stmt = dbsearch.prepare(" insert into connections " +
                                        "    ( id, name, driver, database, host, port, connectString, user, password, fileName, size, preview ) " +
                                        " values " +
                                        "    (?,  ?,?,?,?,?,?,?,?,?,?,?);");

            stmt.run(uuidv1(),
                     params.name,
                     params.driver,
                     params.database,
                     params.host,
                     params.port,
                     params.connectString,
                     params.user,
                     params.password,
                     params.fileName,
                     params.size,
                     params.preview);

            stmt.finalize();
            when_connections_changes();
        });
    } catch(err) {
        //console.log("                          err: " + err);
    } finally {
    }
}











function getRoot(req, res) {
	hostcount++;
	console.log("Host: " + req.headers.host + ", " + hostcount);
	//console.log("URL: " + req.originalUrl);
	if (req.headers.host) {
		if (req.headers.host.toLowerCase().endsWith('canlabs.com')) {
		res.writeHead(301,
			{Location: 'http://canlabs.com/canlabs'}
			);
			res.end();
			return;
		};
		if (req.headers.host.toLowerCase().endsWith('thebank.digital')) {
		res.writeHead(301,
			{Location: 'http://thebank.digital/thebankdigital'}
			);
			res.end();
			return;
		};
		if (req.headers.host.toLowerCase().endsWith('coinsafe.dk')) {
		res.writeHead(301,
			{Location: 'http://thebank.digital/thebankdigital'}
			);
			res.end();
			return;
		};
		if (req.headers.host.toLowerCase().endsWith('gosharedata.com')) {
		res.writeHead(301,
			{Location: 'http://visifile.com/visifile/index.html?time=' + new Date().getTime()}
			);
			res.end();
			return;
		};
		if (req.headers.host.toLowerCase().endsWith('visifile.com')) {
		res.writeHead(301,
			{Location: 'http://visifile.com/visifile/index.html?time=' + new Date().getTime()}
			);
			res.end();
			return;
		};
		if (req.headers.host.toLowerCase().endsWith('visifiles.com')) {
		res.writeHead(301,
			{Location: 'http://visifile.com/visifile/index.html?time=' + new Date().getTime()}
			);
			res.end();
			return;
		};
	};

	if (!init_drivers) {
	init_drivers = true;
	eval(toeval);
	if (drivers['oracle']['loadOnCondition']()) {
		drivers['oracle']['loadDriver']();
	};
	eval(pgeval);

	};

	if (typeOfSystem == 'client') {
					if (!canAccess(req,res)) {return;}
		res.end(fs.readFileSync(path.join(__dirname, '../public/index.html')));
	}
	if (typeOfSystem == 'server') {
		res.end(fs.readFileSync(path.join(__dirname, '../public/index_server.html')));
	}
}




function downloadWebDocument(req, res) {
    //mammoth.convertToHtml({path: "Security in Office 365 Whitepaper.docx"})
    var stmt = dbsearch.all("select contents from files where name = '" + req.query.id + "'", function(err, rows) {
        if (!err) {
                if (rows.length > 0) {
                    if (req.query.id.toLowerCase().endsWith(".docx") ) {
                        var buffer = new Buffer(rows[0].contents, 'binary');

                        mammoth.convertToHtml({buffer: buffer})
                        .then(function(result){
                            var html = result.value; // The generated HTML
                            var messages = result.messages; // Any messages, such as warnings during conversion

                            res.writeHead(200, {'Content-Type': 'text/plain'});
                            res.end(JSON.stringify({  result: html}));
                        })
                        .done();
                    } else if ( req.query.id.toLowerCase().endsWith(".xlsx") ||
                                req.query.id.toLowerCase().endsWith(".xls")) {
                        try {
                            var buffer = new Buffer(rows[0].contents, 'binary');
                            var workbook = XLSX.read(buffer, {type:"buffer"})
                            var sheetname = Object.keys(workbook['Sheets'])[0]
                            var html =  XLSX.utils.sheet_to_html(workbook['Sheets'][sheetname])
                            html = html.replace("<html><body>","").replace("</body></html>","");


                            res.writeHead(200, {'Content-Type': 'text/plain'});
                            res.end(JSON.stringify({  result: html}));
                        } catch(error) {
                            res.writeHead(200, {'Content-Type': 'text/plain'});
                            res.end(JSON.stringify({  result: "<div>Error: " + error + "</div>"}));
                        }
                    } else if (req.query.id.toLowerCase().endsWith(".csv")) {
                        try {
                            console.log('1')
                            html = "<table>";
                            console.log('2')
                            console.log('3')
                                var contents = rows[0].contents.toString()
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
                                    res.writeHead(200, {'Content-Type': 'text/plain'});
                                    res.end(JSON.stringify({  result: html}));
                                    })
                                .on('error', function(error) {
                                    res.writeHead(200, {'Content-Type': 'text/plain'});
                                    res.end(JSON.stringify({  result: "<div>Error: " + error + "</div>"}));
                                });

                        }
                        catch(err) {
                            res.writeHead(200, {'Content-Type': 'text/plain'});
                            res.end(JSON.stringify({  result: "<div>Big Error: " + err + "</div>"}));
                        }







												//} else if (req.query.id.toLowerCase().endsWith(".txt")) {
												} else if (
													    !isBinaryFile.sync(
																    rows[0].contents,
																		rows[0].contents.toString().length  )) {
                        try {
                            console.log('1')
                            html = "<pre>";
                            var contents = rows[0].contents.toString()
                            html += contents;
                            html += "</pre>";
                            res.writeHead(200, {'Content-Type': 'text/plain'});
                            res.end(JSON.stringify({  result: html}));

                        }
                        catch(err) {
                            res.writeHead(200, {'Content-Type': 'text/plain'});
                            res.end(JSON.stringify({  result: "<div>Big Error: " + err + "</div>"}));
                        }






                    } else {
                            res.writeHead(200, {'Content-Type': 'text/plain'});
                            res.end(JSON.stringify({  result: "<div>Unknown file type</div>"}));
                    }
                };
        };
    });

}





function downloadDocuments(req, res) {
		var fname = req.url.substr(req.url.lastIndexOf('/') + 1)

		if (fname && (fname.length > 0)) {
				var extension = fname.substr(fname.lastIndexOf('.') + 1).toLowerCase()
				//console.log("getting file: " + fname);
				//console.log("   extension: " + extension);
				var contentType = 'text/plain';
				if (extension == 'pdf') {contentType = 'application/pdf'}
				else if (extension == 'glb') {contentType = 'model/gltf-binary'}
				else if (extension == 'doc') {contentType = 'application/msword'}
				else if (extension == 'docx') {contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'}
				else if (extension == 'xls') {contentType = 'application/vnd.ms-excel'}
				else if (extension == 'xlsx') {contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}
				else if (extension == 'csv') {contentType = 'text/csv'}



				var stmt = dbsearch.all("select contents from files where name = '" + fname + "'", function(err, rows) {
						if (!err) {
								if (rows.length > 0) {
										 res.writeHead(200, {
												'Content-Type': contentType,
												'Content-disposition': 'attachment;filename=' + fname ,
												'Content-Length': rows[0].contents.length
										});


										res.end(new Buffer(rows[0].contents, 'binary'));
								};
						};
				});
		} else {
				res.writeHead(200, {'Content-Type': 'text/plain'});
				res.end(JSON.stringify({  error: "No file selected"}));
		}
};











function testFirewall(req, res) {
			var tracking_id =    url.parse(req.url, true).query.tracking_id;
			var server      =    url.parse(req.url, true).query.server;

			//console.log(JSON.stringify(tracking_id,null,2));

			res.writeHead(200, {'Content-Type': 'text/plain'});
			res.end(JSON.stringify({    got_through_firewall:   tracking_id  ,
																	server:                 server,
																	username:               username,
																	locked:                 locked
																	}));
};







function getIntranetServers(req, res) {
    requestClientPublicIp = req.ip;
    var requestVia                       = findViafromString(req.headers.via);

    res.writeHead(200, {'Content-Type': 'text/plain'});

		var mysql = "select *  from  intranet_client_connects  where " +
									"    (when_connected > " + ( new Date().getTime() - (numberOfSecondsAliveCheck * 1000)) + ") " +
									" and " +
									"    (( public_ip = '" + requestClientPublicIp + "') or " +
														"((via = '" + requestVia + "') and (length(via) > 0)))";
			//console.log("check IP: " + mysql);
			var stmt = dbsearch.all(mysql, function(err, rows) {
					if (!err) {
							//console.log( "           " + JSON.stringify(rows));
							res.end(JSON.stringify({  allServers:       rows,
																				intranetPublicIp: requestClientPublicIp}));
			}});
};











function clientConnectFn(req, res) {
	try
	{
		var queryData = url.parse(req.url, true).query;

		var requestClientInternalHostAddress = req.query.requestClientInternalHostAddress;
		var requestClientInternalPort        = req.query.requestClientInternalPort;
		var requestVia                       = findViafromString(req.headers.via);
		var requestClientPublicIp            = req.ip;
          var clientUsername                   = req.query.clientUsername;
		//requestClientPublicHostName      = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
		var requestClientPublicHostName      = "req keys::" + Object.keys(req) + ", VIA::" + req.headers.via + ", raw::" + JSON.stringify(req.rawHeaders);

		//console.log('Client attempting to connect from:');
		//console.log('client internal host address:    ' + requestClientInternalHostAddress)
		//console.log('client internal port:            ' + requestClientInternalPort)
		//console.log('client public IP address:        ' + requestClientPublicIp)
		//console.log('client public IP host name:      ' + requestClientPublicHostName)
		//console.log('client VIA:                      ' + requestVia)

          dbsearch.serialize(function() {
              var stmt = dbsearch.prepare(" insert  into  intranet_client_connects " +
                                      "    ( id, internal_host, internal_port, public_ip, via, public_host, user_name, client_user_name, when_connected) " +
                                      " values " +
                                      "    (?,   ?,?,?,?,  ?,?,?,?);");

              var newid = uuidv1();
              stmt.run(   newid,
                          requestClientInternalHostAddress,
                          requestClientInternalPort,
                          requestClientPublicIp,
                          requestVia,
                          requestClientPublicHostName,
                          username,
                          clientUsername,
                          new Date().getTime()
                  );
          });
          //console.log('***SAVED***');

		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.end(JSON.stringify(
              {
                  connected: true,
              }));
	}
	catch (err) {
		//console.log('Warning: Central server not available:');
	}

}







function websocketFn(ws, req) {
    serverwebsockets.push(ws);
    //console.log('Socket connected : ' + serverwebsockets.length);
    ws.on('message', function(msg) {
        var receivedMessage = eval("(" + msg + ")");
        //console.log("Server recieved message: " + JSON.stringify(receivedMessage));

        if (receivedMessage.message_type == "server_get_all_queries") {
            //return
            //console.log("     Server recieved message server_get_all_queries");
            sendToBrowserViaWebSocket(ws, {   message_type: "client_get_all_queries"  });

            var stmt = dbsearch.all("select * from queries",
                function(err, results) {
                    for (var i=0; i < results.length;i ++) {
                        var query = results[i];
                        sendToBrowserViaWebSocket(
                            ws,
                            {
                                type: "update_query_item",
                                query: query
                            });
                    }
                    sendToBrowserViaWebSocket(ws, {   type: "client_get_all_queries_done"  });
                });


        }
    });
};








//------------------------------------------------------------------------------
// scan the hard disk for documents for indexing
//------------------------------------------------------------------------------
function scanharddiskFn(req, res) {
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.end(JSON.stringify([]));
		scanHardDisk();
};





function stopscanharddiskFn(req, res) {
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.end(JSON.stringify([]));
		stopScan = true;
	      sendOverWebSockets({
	                              type:   "server_scan_status",
	                              value:  "Hard disk scan stopped"
	                              });
};









function file_uploadFn(req, res, next) {
      //console.log('-------------------------------------------------------------------------------------');
      //console.log('-------------------------------------------------------------------------------------');
      //console.log('-------------------------------------------------------------------------------------');
      //console.log('-------------------------------------------------------------------------------------');
      //console.log('-------------------------------------------------------------------------------------');

      //console.log(JSON.stringify(req.files.length));
      //console.log("**FILES** " + JSON.stringify(req.files));
      //console.log(    "    next: " + JSON.stringify(next));


      //console.log('......................................................................................');
      //console.log('......................................................................................');
      //console.log('......................................................................................');
      //console.log('......................................................................................');
      //console.log('......................................................................................');
      res.status( 200 ).send( req.files );


      var ll = req.files.length;
      for (var i = 0; i < ll ; i ++) {
          var ifile = req.files[i];
          //console.log("        " + JSON.stringify(ifile));
          var ext = ifile.originalname.split('.').pop();
          ext = ext.toLowerCase();
          //console.log('Ext: ' + ext);

          var localp2;
          if (isWin) {
          		localp2 = process.cwd() + '\\uploads\\' + ifile.filename;
      		} else {
          		localp2 = process.cwd() + '/uploads/' + ifile.filename;
      		};
          var localp = localp2 + '.' + ext;
          fs.renameSync(localp2, localp);
          //console.log('Local saved path: ' + localp);

          fs.stat(localp, function(err, stat) {
						console.log('ifile: ' + ifile.originalname);

            if (isExcelFile(ifile.originalname)) {
                  //console.log('ifile: ' + ifile.originalname);
                  var excelFile = localp;
                      if (typeof excelFile !== "undefined") {
                          var fileId = excelFile.replace(/[^\w\s]/gi,'');
                          //console.log('Saving from upload   *file id: ' + ifile.originalname);
                          //console.log('   *size: ' + stat.size);

                          saveConnectionAndQueryForFile(ifile.originalname, 'excel', stat.size, excelFile, '|SPREADSHEET|');
              }
          } else if (isGlbFile(ifile.originalname)) {
                  //console.log('ifile: ' + ifile.originalname);
                      var glbFile = localp;
                      if (typeof glbFile !== "undefined") {
                          var fileId = glbFile.replace(/[^\w\s]/gi,'');
                          //console.log('Saving from upload   *file id: ' + ifile.originalname);
                          //console.log('   *size: ' + stat.size);

                          saveConnectionAndQueryForFile(ifile.originalname, 'glb', stat.size, glbFile, '|GLB|');
              };
          } else if (isCsvFile(ifile.originalname)) {
                  //console.log('ifile: ' + ifile.originalname);
                      var csvFile = localp;
                      if (typeof csvFile !== "undefined") {
                          var fileId = csvFile.replace(/[^\w\s]/gi,'');
                          //console.log('Saving from upload   *file id: ' + ifile.originalname);
                          //console.log('   *size: ' + stat.size);

                          saveConnectionAndQueryForFile(ifile.originalname, 'csv', stat.size, csvFile, '|CSV|');
              };
          } else if (isWordFile(ifile.originalname)) {
                  //console.log('ifile: ' + ifile.originalname);
                      var wordFile = localp;
                      if (typeof wordFile !== "undefined") {
                          var fileId = wordFile.replace(/[^\w\s]/gi,'');
                          //console.log('Saving from upload   *file id: ' + ifile.originalname);
                          //console.log('   *size: ' + stat.size);

                          saveConnectionAndQueryForFile(ifile.originalname, 'word', stat.size, wordFile, '|DOCUMENT|');
              }
          } else if (isPdfFile(ifile.originalname)) {
                  //console.log('ifile: ' + ifile.originalname);
                      var pdfFile = localp;
                      if (typeof pdfFile !== "undefined") {
                          var fileId = pdfFile.replace(/[^\w\s]/gi,'');
                          //console.log('Saving from upload   *file id: ' + ifile.originalname);
                          //console.log('   *size: ' + stat.size);

                          saveConnectionAndQueryForFile(ifile.originalname, 'pdf', stat.size, pdfFile, '|DOCUMENT|');
              }
          } else if (!isBinaryFile.sync(localp)) {
                var txtFile = localp;
                if (typeof txtFile !== "undefined") {
                    var fileId = txtFile.replace(/[^\w\s]/gi,'');
                    //console.log('Saving from upload   *file id: ' + ifile.originalname);
                    //console.log('   *size: ' + stat.size);

                    saveConnectionAndQueryForFile(ifile.originalname, 'txt', stat.size, txtFile, '|TXT|');
                }
            };
        });
    }

};











function open_query_in_native_appFn(req, res) {

	//console.log('in open_query_in_native_app');
	var queryData = req.body;
	//console.log('queryData.source: ' + queryData.source);
	//console.log('queries[queryData.source]: ' + queries[queryData.source]);
	//console.log('connections[queries[queryData.source].connection]: ' + connections[queries[queryData.source].connection]);
	//console.log('connections[queries[queryData.source].connection].fileName: ' + connections[queries[queryData.source].connection].fileName);
	var error = new Object();
	////console.log('query driver: ' + connections[queryData.source].driver);
	try {
		//drivers[connections[queryData.source].driver]['get_v2'](connections[queryData.source],{sql: queryData.sql},function(ordata) {
		   open(connections[queries[queryData.source].connection].fileName);

		   res.writeHead(200, {'Content-Type': 'text/plain'});
			res.end(JSON.stringify(ordata));
	}

	catch(err) {
		res.writeHead(200, {'Content-Type': 'text/plain'});

		res.end(JSON.stringify({error: 'Error: ' + JSON.stringify(err)}));
	};
}








//------------------------------------------------------------------------------
// Get the result of a SQL query
//------------------------------------------------------------------------------
function getresultFn(req, res) {
		//console.log('in getresult');
		var queryData = req.body;
		//console.log('queryData.source: ' + queryData.source);

		////console.log('request received source: ' + Object.keys(req));
		var error = new Object();
		if (queryData) {
			if (connections[queryData.source]) {
				if (queryData.source) {
					if (connections[queryData.source].driver) {
						//console.log('query driver: ' + connections[queryData.source].driver);
						try {
							drivers[connections[queryData.source].driver]['get_v2'](connections[queryData.source],{sql: queryData.sql},function(ordata) {
								res.writeHead(200, {'Content-Type': 'text/plain'});

																res.end(JSON.stringify(ordata));
							});
						}
						catch(err) {
							res.writeHead(200, {'Content-Type': 'text/plain'});

							res.end(JSON.stringify({error: 'Error: ' + JSON.stringify(err)}));
						};
					} else {
						//console.log('query driver not found: ' + connections[queryData.source]);
							res.writeHead(200, {'Content-Type': 'text/plain'});
							res.end(JSON.stringify({message: 'query driver not found'}));
					};
				};
			};
		};
}






//------------------------------------------------------------------------------
// Get the result of a search
//------------------------------------------------------------------------------
function get_related_documentsFn(req, res) {
    //console.log("called get_related_documents: " )
    var id = req.query.id;
    forked.send({
                            message_type:   "getRelatedDocuments",
                            id:  id
                            });
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end( JSON.stringify({}))
}











function get_search_resultsFn(req, res) {
    //console.log("called get_search_results: " )
    var searchTerm = req.query.search_text;
    var timeStart = new Date().getTime();

    //console.log("searchTerm.length: " + searchTerm.length)
    //console.log("searchTerm: " + searchTerm)
    if (searchTerm.length < 1) {
        var timeEnd = new Date().getTime();
        var timing = timeEnd - timeStart;
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end( JSON.stringify({search:      searchTerm,
                                 queries:    [],
                                 message:    "Search text must be at least 1 characters: " + searchTerm,
                                 duration:    timing    }  ));
    } else {

    dbsearch.serialize(function() {
        var mysql = "  select distinct(queries.id), the1.document_binary_hash, the1.num_occ  , the1.child_hash , zfts_search_rows_hashed.data " +
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
     "                     queries  , " +
      "                    zfts_search_rows_hashed  " +
       "              where    " +
        "             queries.hash = the1.document_binary_hash   " +
" and " +
"zfts_search_rows_hashed.row_hash = the1.child_hash ";

        var firstWord = searchTerm.split()[0];
        if (firstWord.length < 1) {
            firstWord = "";
        }
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
                                            id:     rowId,
                                            data:   rowDataToSend
                                    });
                    }
                }
                var timeEnd = new Date().getTime();
                var timing = timeEnd - timeStart;
                res.writeHead(200, {'Content-Type': 'text/plain'});
                res.end( JSON.stringify({   search:  searchTerm,
                                            queries: newres,
                                            duration: timing}));
            } else {
                var timeEnd = new Date().getTime();
                var timing = timeEnd - timeStart;
                res.writeHead(200, {'Content-Type': 'text/plain'});
                res.end( JSON.stringify({search:      searchTerm,
                                         queries:    [],
                                         duration:    timing,
                                         error: "Error searching for: " + searchTerm }  ));
            }
        });

    })
    };
};











function getqueryresultFn(req, res) {
	var queryData2 = req.body;
	//console.log('in getqueryresult: ' + JSON.stringify(queryData2));
	//console.log('           source: ' + JSON.stringify(queryData2.source));
	////console.log('request received source: ' + Object.keys(req));
	////console.log('request received SQL: ' + queryData.sql);
	var query = queries[queryData2.source];

	//console.log('           query: ' + JSON.stringify(query));
	if (query) {
		var queryData 			= new Object();
		queryData.source 		= query.connection;
		queryData.definition 	= eval('(' + query.definition + ')' );

		//console.log('   query.definition.sql: ' + JSON.stringify(query.definition.sql));
		//console.log('           ***queryData: ' + JSON.stringify(queryData));


		var error = new Object();
		if (queryData) {
			if (connections[queryData.source]) {
				if (queryData.source) {
					if (connections[queryData.source].driver) {
						////console.log('query driver: ' + connections[queryData.source].driver);
                        var newres = res;
                        getResult(  queryData2.source,
                                    queryData.source,
                                    connections[queryData.source].driver,
                                    queryData.definition,
                                    function(result){
                                        //console.log("     In getresult callback:")
                                        //console.log("                          :" + JSON.stringify(result))
                                        newres.writeHead(200, {'Content-Type': 'text/plain'});
                                        newres.end(JSON.stringify(result));
                                    }
                                 );


                        console.log('trying to save pdf: ');
                        var stmt = dbsearch.all("select contents from files,queries where files.name = ('gsd_' || queries.hash || '.pdf' ) and queries.id = '" + queryData2.source + "'", function(err, rows) {
                            console.log('trying to save pdf 2: ' + queryData2.source);
                                if (!err) {
                                    console.log('trying to save pdf 3: ');
                                    if (rows.length > 0) {
                                        console.log('trying to save pdf 4: ');
                                        console.log('trying to save pdf 5: ');
                                        var buffer = new Buffer(rows[0].contents, 'binary');

                                        fs.writeFile(process.cwd() + "/files/a.pdf", buffer,  "binary",
                                            function(err) {
                                                console.log('trying to save pdf 6: ');

                                            });
                                    }
                                }
                        })
					} else {
						//console.log('query driver not found: ' + connections[queryData.source]);
							res.writeHead(200, {'Content-Type': 'text/plain'});
							res.end(JSON.stringify({error: 'query driver not found'}));
					};
				};
			};
		};
	} else {
		//console.log('query not found: ' + queryData2.source);
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.end(JSON.stringify({error: 'query ' + queryData2.source + ' not found'}));

	};
}














function send_client_detailsFn(req, res) {
    ////console.log('in send_client_details: ' + JSON.stringify(req,null,2));
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end(JSON.stringify({
            returned:           'some data ',
            server:             hostaddress,
            port:               port,
            username:           username,
            locked:             locked,
            localIp:            req.ip,
            isLocalMachine:     isLocalMachine(req) }));
}


function lockFn(req, res) {
    if ((req.query.locked == "TRUE") || (req.query.locked == "true")) {
        locked = true;
    } else {
        locked = false;
    }

        ////console.log('in lock: ' + JSON.stringify(req,null,2));
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end(JSON.stringify({locked: locked}));
}




//------------------------------------------------------------------------------
// This is called by the central server to get the details of the last
// client that connected tp the central server
//------------------------------------------------------------------------------
function get_connectFn(req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end(
            JSON.stringify(
                {
                    requestClientInternalHostAddress: requestClientInternalHostAddress
                    ,
                    requestClientInternalPort:        requestClientInternalPort
                    ,
                    requestClientPublicIp:            requestClientPublicIp
                    ,
                    requestClientPublicHostName:      requestClientPublicHostName
                    ,
                    version:      31
                }
          ));
}




function get_all_tableFn(req, res) {
    var tableName = url.parse(req.url, true).query.tableName;
    var fields = url.parse(req.url, true).query.fields;
    var stmt = dbsearch.all("select " + fields + " from " + tableName,
        function(err, rows) {
            if (!err) {
                res.writeHead(200, {'Content-Type': 'text/plain'});
                res.end(JSON.stringify(
                    rows));
                //console.log("Sent: " + JSON.stringify(rows.length));
            };
        })
};



function add_new_connectionFn(req, res) {
    var params = req.body;
    addNewConnection( params );
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end(JSON.stringify({done: "ok"}))};



function add_new_queryFn(req, res) {
    var params = req.body;
    addNewQuery( params );
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end(JSON.stringify({done: "ok"}))};



function setUpDbDrivers() {
	pgeval = '(' + fs.readFileSync(path.join(__dirname, './glb.js')).toString() + ')';
    setSharedGlobalVar("drivers", 'glb', pgeval );
	addOrUpdateDriver('glb', pgeval, drivers['glb'])

	pgeval = '(' + fs.readFileSync(path.join(__dirname, './csv.js')).toString() + ')';
    setSharedGlobalVar("drivers", 'csv', pgeval );
	addOrUpdateDriver('csv', pgeval, drivers['csv'])

	pgeval = '(' + fs.readFileSync(path.join(__dirname, './txt.js')).toString() + ')';
    setSharedGlobalVar("drivers", 'txt', pgeval );
	addOrUpdateDriver('txt', pgeval, drivers['txt'])


	pgeval = '(' + fs.readFileSync(path.join(__dirname, './excel.js')).toString() + ')';
    setSharedGlobalVar("drivers", 'excel', pgeval );
	addOrUpdateDriver('excel', pgeval, drivers['excel'])

	pgeval = '(' + fs.readFileSync(path.join(__dirname, './word.js')).toString() + ')';
    setSharedGlobalVar("drivers", 'word', pgeval );
	addOrUpdateDriver('word', pgeval, drivers['word'])

	pgeval = '(' + fs.readFileSync(path.join(__dirname, './pdf.js')).toString() + ')';
    setSharedGlobalVar("drivers", 'pdf', pgeval );
	addOrUpdateDriver('pdf', pgeval, drivers['pdf'])


	pgeval = '(' + fs.readFileSync(path.join(__dirname, './postgres.js')).toString() + ')';
    setSharedGlobalVar("drivers", 'postgres', pgeval );
	addOrUpdateDriver('postgres', pgeval, drivers['postgres'])



	sqliteeval = '(' + fs.readFileSync(path.join(__dirname, './sqlite.js')).toString() + ')';
    setSharedGlobalVar("drivers", 'sqlite', sqliteeval );
	addOrUpdateDriver('sqlite', sqliteeval, drivers['sqlite'])


	pgeval = '(' + fs.readFileSync(path.join(__dirname, './mysql.js')).toString() + ')';
    setSharedGlobalVar("drivers", 'mysql', pgeval );
	addOrUpdateDriver('mysql', pgeval, drivers['mysql'])



	toeval =  '(' + fs.readFileSync(path.join(__dirname, './oracle.js')).toString() + ')';
    setSharedGlobalVar("drivers", 'oracle', toeval );
	addOrUpdateDriver('oracle',   toeval, drivers['oracle'])
	process.env['PATH'] = process.cwd() + '\\oracle_driver\\instantclient32' + ';' + process.env['PATH'];
	if (drivers['oracle'].loadOnCondition()) {
		drivers['oracle'].loadDriver()
	}



	tdeval = '(' + fs.readFileSync(path.join(__dirname, './testdriver.js')).toString() + ')';
    setSharedGlobalVar("drivers", 'testdriver', tdeval );
	addOrUpdateDriver('testdriver', tdeval, drivers['testdriver'])
}







function setupChildProcesses() {




    //console.log("-------------------------------------------------------------------");
    //console.log("-------------------------------------------------------------------");
    //console.log("-------------------------------------------------------------------");
    //console.log("-------------------------------------------------------------------");
    //console.log("-------------------------------------------------------------------");









    if (isWin) {
        forked = fork.fork(path.join(__dirname, '../src/child.js'));
        forkedIndexer = fork.fork(path.join(__dirname, '../src/child.js'));
    } else {
            forked = fork.fork(path.join(__dirname, '../src/child.js'));
            forkedIndexer = fork.fork(path.join(__dirname, '../src/child.js'));
    };

    forked.on('message', (msg) => {
        //console.log("message from child: " + JSON.stringify(msg,null,2))
        if (msg.message_type == "return_test_fork") {
            //console.log('Message from child', msg);
            sendOverWebSockets({
                                    type:   "test_fork",
                                    value:  "Counter: " + msg.counter + ", count queries from sqlite: " + msg.sqlite
                                    });


        } else if (msg.message_type == "return_set_connection") {
            setSharedGlobalVar( "connections",
                                msg.id,
                                JSON.stringify({    id:         msg.id,
                                                    name:       msg.name,
                                                    driver:     msg.driver,
                                                    size:       msg.size,
                                                    hash:       msg.hash,
                                                    type:       msg.type,
                                                    fileName:   msg.fileName },null,2));


        } else if (msg.message_type == "return_set_query") {
            setSharedGlobalVar( "queries",
                                msg.id,
                                JSON.stringify(
                                  {  id:            msg.id,
                                     name:          msg.name,
                                     connection:    msg.connection,
                                     driver:        msg.driver,
                                     size:          msg.size,
                                     hash:          msg.hash,
                                     fileName:      msg.fileName,
                                     type:          msg.type,
                                     definition:    msg.definition,
                                     preview:       msg.preview
                                  }));
            sendOverWebSockets({
                                    type: "uploaded",
                                    id:    msg.id,
                                    query:
                                    {
                                    }});

            sendOverWebSockets({
                                    type: "update_query_item",
                                    query: queries[msg.id]
            });


            sendOverWebSockets({   type: "client_get_all_queries_done"  });


        // this needs to be fixed so that it only sends the similar documents
        // to the client that requested them
        } else if (msg.message_type == "return_similar_documents") {
            sendOverWebSockets({
                                    type: "similar_documents",
                                    results: msg.results

            });

            queries[msg.query_id].similar_count = eval("(" + msg.results + ")").length
            sendOverWebSockets({
                                    type: "update_query_item",
                                    query: queries[msg.query_id]

            });
        }












    });

    forked.send({ message_type: "greeting", hello: 'world' });
}


//------------------------------------------------------------
// This starts all the system services
//------------------------------------------------------------
function startServices() {
    app.use(cors())

    //------------------------------------------------------------------------------
    // Show the default page for the different domains
    //------------------------------------------------------------------------------
    app.get('/', function (req, res) {
        console.log("app.get('/'");
    	return getRoot(req, res);
    })

    app.use("/files", express.static(process.cwd() + '/files/'));

    app.use("/public/aframe_fonts", express.static(path.join(__dirname, '../public/aframe_fonts')));
    app.use('/viewer', express.static(process.cwd() + '/node-viewerjs/release'));
    app.use(express.static(path.join(__dirname, '../public/')))
    app.use(bodyParser.json()); // support json encoded bodies
    app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies





    //------------------------------------------------------------------------------
    // Download documents to the browser
    //------------------------------------------------------------------------------
    app.get('/docs2/*', function (req, res) {
    	 	return downloadDocuments(req,res);
    });


    //------------------------------------------------------------------------------
    // Download web documents to the browser
    //------------------------------------------------------------------------------
    app.get('/get_web_document', function (req, res) {
    	 	return downloadWebDocument(req,res);
    });


    //------------------------------------------------------------------------------
    // test_firewall
    //------------------------------------------------------------------------------
    app.get('/test_firewall', function (req, res) {
        return testFirewall(req,res);
    });


    //------------------------------------------------------------------------------
    // get_intranet_servers
    //------------------------------------------------------------------------------
    app.get('/get_intranet_servers', function (req, res) {
        return getIntranetServers(req, res);
    });



    app.ws('/websocket', function(ws, req) {
        //console.log("app.get('/websocket'");
        return websocketFn(ws, req)
    });


    //------------------------------------------------------------------------------
    // Scan the hard disk for documents to Index
    //------------------------------------------------------------------------------
    app.get('/scanharddisk', function (req, res) {
    		return scanharddiskFn(req, res)
    });




    app.get('/stopscanharddisk', function (req, res) {
    		return stopscanharddiskFn(req, res)
    });


    app.post('/file_upload', upload.array( 'file' ), function (req, res, next) {
        return file_uploadFn(req, res, next);
    });




    app.post('/open_query_in_native_app', function (req, res) {
    		return open_query_in_native_appFn(req, res);
    })


    //------------------------------------------------------------------------------
    // Get the result of a SQL query
    //------------------------------------------------------------------------------
    app.post('/getresult', function (req, res) {
    	  return getresultFn(req, res);
    })


    //------------------------------------------------------------------------------
    // Get the related documents
    //------------------------------------------------------------------------------
    app.get('/get_related_documents', function (req, res) {
        return get_related_documentsFn(req, res);
    })


    //------------------------------------------------------------------------------
    // Get the result of a search
    //------------------------------------------------------------------------------
    app.get('/get_search_results', function (req, res) {
        return get_search_resultsFn(req, res);
    });


    app.post('/getqueryresult', function (req, res) {
    	return getqueryresultFn(req, res);
    })


    app.get('/send_client_details', function (req, res) {
    	return send_client_detailsFn(req, res);
    })


    app.get('/lock', function (req, res) {
        return lockFn(req, res);
    })


    process.on('uncaughtException', function (err) {
      console.log(err);
    })



    //------------------------------------------------------------------------------
    // This is called by the central server to get the details of the last
    // client that connected tp the central server
    //------------------------------------------------------------------------------
    app.get('/get_connect', function (req, res) {
    	return get_connectFn(req, res);
    })

    //app.enable('trust proxy')


    app.get('/get_all_table', function (req, res) {
    		return get_all_tableFn(req, res);
    });

    app.post('/add_new_connection', function (req, res) {
    		return add_new_connectionFn(req, res)
    });



    app.post('/add_new_query',function (req, res) {
        return add_new_queryFn(req, res)
    });




    //------------------------------------------------------------------------------
    // run on the central server only
    //
    // This is where the client sends its details to the central server
    //------------------------------------------------------------------------------
    app.get('/client_connect', function (req, res) {
    	  return clientConnectFn(req,res);

    })




    //------------------------------------------------------------------------------
    // start the web server
    //------------------------------------------------------------------------------
    app.listen(port, hostaddress, function () {
    	//console.log(typeOfSystem + ' started on port ' + port );
    })




      //console.log('addr: '+ hostaddress + ":" + port);






    aliveCheckFn();


    setupChildProcesses();

    if (typeOfSystem == 'client') {
        setInterval(aliveCheckFn ,numberOfSecondsAliveCheck * 1000);

        forkedIndexer.send({ message_type: "childRunIndexer" });


    }




    when_connections_changes();
    when_queries_changes(null);




	//console.log("******************************ADDING DRIVERS*********************************")
	//console.log("******************************ADDING DRIVERS*********************************")


    setUpDbDrivers();















	////console.log("postgres.get = " + JSON.stringify(eval(pgeval) , null, 2))
	////console.log("postgres.get = " + eval(pgeval).get)
	//--------------------------------------------------------
	// open the app in a web browser
	//--------------------------------------------------------


	if (typeOfSystem == 'client') {
        var localClientUrl = 'http://' + hostaddress  + ":" + port;
        var remoteServerUrl = 'http://' + centralHostAddress  + ":" + centralHostPort + "/visifile/list_intranet_servers.html?time=" + new Date().getTime();


        request({
                  uri: remoteServerUrl,
                  method: "GET",
                  timeout: 10000,
                  agent: false,
                  followRedirect: true,
                  maxRedirects: 10
            },
            function(error, response, body) {
              if (error) {
                  //console.log("Error opening central server: " + error);
                  open(localClientUrl);
              } else {
                open(remoteServerUrl);
              }
            });
	} else if (typeOfSystem == 'server') {
	  open('http://' + hostaddress  + ":" + port + "/visifile/list_intranet_servers.html?time=" +  + new Date().getTime());
	}


}


function cpuAverage() {

  //Initialise sum of idle and time of cores and fetch CPU info
  var totalIdle = 0, totalTick = 0;
  var cpus = os.cpus();

  //Loop through CPU cores
  for(var i = 0, len = cpus.length; i < len; i++) {

    //Select CPU core
    var cpu = cpus[i];

    //Total up the time in the cores tick
    for(var type in cpu.times) {
      totalTick += cpu.times[type];
   }     

    //Total up the idle time of the core
    totalIdle += cpu.times.idle;
  }

  //Return the average Idle and Tick times
  return {idle: totalIdle / cpus.length,  total: totalTick / cpus.length};
}

//Grab first CPU Measure
var startMeasure = cpuAverage();

//Set delay for second Measure
setInterval(function() { 

  //Grab second Measure
  var endMeasure = cpuAverage(); 

  //Calculate the difference in idle and total time between the measures
  var idleDifference = endMeasure.idle - startMeasure.idle;
  var totalDifference = endMeasure.total - startMeasure.total;

  //Calculate the average percentage CPU usage
  var percentageCPU = 100 - ~~(100 * idleDifference / totalDifference);

  //Output result to console
  console.log(percentageCPU + "% CPU Usage.");

}, 1000);
