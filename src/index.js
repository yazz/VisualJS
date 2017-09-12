'use strict';


var numberOfSecondsAliveCheck = 60; 
var isPi = require('detect-rpi');
var username = "Unknown user";

var isWin = /^win/.test(process.platform);
var isRaspberryPi = isPi();

function require2(moduleName) {
	var pat;
	if (isWin) {
		pat = "require(process.cwd() + " + "'\\\\node_modules\\\\" + moduleName + "');";
	} else {
		pat = "require(path.join(__dirname, '../node_modules/" + moduleName + "'));";
	}
	
	console.log('PATH: ' + pat);
	console.log('    MODULE PATH: ' + process.cwd() + '/node_modules/' + moduleName);
    var reac = eval(pat);	
	return reac;
};


var fs           = require('fs');
var path         = require('path');
var mkdirp       = require('mkdirp')
const uuidv1 = require('uuid/v1');

if (!fs.existsSync(process.cwd() + "/node_modules") ) {
    copyFolderRecursiveSync(path.join(__dirname, "../node_modules")  , process.cwd() ); }

    if (!fs.existsSync(process.cwd() + "/node_macos64") ) {
	copyFolderRecursiveSync(path.join(__dirname, "../node_macos64")  , process.cwd() ); }

if (!fs.existsSync(process.cwd() + "/node_win32") ) {
    copyFolderRecursiveSync(path.join(__dirname, "../node_win32")  , process.cwd() ); }


if (!fs.existsSync(process.cwd() + "/node_pi") ) {
    copyFolderRecursiveSync(path.join(__dirname, "../node_pi")  , process.cwd() ); }



var expressNodeJsPackageFile = process.cwd() + "/node_modules/express-pouchdb/package.json";
if (fs.existsSync(expressNodeJsPackageFile) ) {
    fs.readFile(expressNodeJsPackageFile, 'utf8', function (err,data) {
      if (err) {
        return console.log(err);
      }
      var result = data.replace('"pouchdb-fauxton": "^0.0.6",', '');

      fs.writeFile(expressNodeJsPackageFile, result, 'utf8', function (err) {
         if (err) return console.log(err);
      });
    });
}

const mkdirSync = function (dirPath) {
  try {
    mkdirp.sync(dirPath)
  } catch (err) {
    //if (err.code !== 'EEXIST') throw err
  }
}
    if (isWin) {
        mkdirp.sync("public\\docs");
    } else {
        mkdirp.sync("public/docs");
    };
mkdirp.sync("uploads");


function copyNodeNativeAdapter( osName, moduleName, directoryToSaveTo , nativeFileName) {
    console.log('Copy started of : ' + osName + ', '+ moduleName + ','+ directoryToSaveTo + ','+ nativeFileName);
	if (!fs.existsSync(process.cwd() + "/node_modules/" + moduleName + "/" + directoryToSaveTo + "/" + nativeFileName) ) {
		console.log('* Creating native driver for: ' + moduleName);
		mkdirSync(process.cwd() + "/node_modules/" + moduleName +  "/" + directoryToSaveTo);
		copyFileSync(	 process.cwd() + "/node_" + osName + "/" + nativeFileName + "rename",
							process.cwd() + "/node_modules/" + moduleName + "/" + directoryToSaveTo + "/" + nativeFileName) ;
	}
	console.log('Copy done');
}

if (isWin) {
    console.log('******* WINDOWS *******');
	// copy WIndows 32 node native files
	copyNodeNativeAdapter( "win32", "sqlite3", 		"lib/binding/node-v48-win32-ia32" , "node_sqlite3.node")
	copyNodeNativeAdapter( "win32", "leveldown", 	"build/Release" , "leveldown.node")
	//to fix a bug on leveldown
    //copyNodeNativeAdapter( "win32", "pouchdb", 	"node_modules/leveldown/out/Release" , "leveldown.node")
    //copyNodeNativeAdapter( "win32", "leveldown",       "pouchdb/node_modules/build/Release" , "leveldown.node")
	if (!fs.existsSync(process.cwd() + "/build/leveldown.node") ) {
		mkdirSync(process.cwd() + "/build");
		copyFileSync(process.cwd() +  "/node_win32/leveldown.noderename", process.cwd() + "/build/leveldown.node") ;
	}
} else if (isRaspberryPi) {
    console.log('******* PI *******');
	// copy Raspberry PI ARM node native files
	copyNodeNativeAdapter( "pi", "sqlite3", 	"lib/binding/node-v48-linux-arm" , "node_sqlite3.node")
	copyNodeNativeAdapter( "pi", "leveldown", 	"build/Release" , "leveldown.node")
    
    // my Raspberry PI ARM at home may complain if I don't do this
	copyNodeNativeAdapter( "pi", "leveldown", 	"pouchdb/node_modules/build/Release" , "leveldown.node")
	//to fix a bug on leveldown
	if (!fs.existsSync(process.cwd() + "/build/leveldown.node") ) {
		mkdirSync(process.cwd() + "/build");
		copyFileSync( process.cwd() +  "/node_pi/leveldown.noderename", process.cwd() + "/build/leveldown.node") ;
	}
} else { //means Mac OS
    console.log('******* MAC *******');
	// copy Mac OS 64 node native files
	copyNodeNativeAdapter( "macos64", "sqlite3", 	"lib/binding/node-v48-darwin-x64" , "node_sqlite3.node")
	copyNodeNativeAdapter( "macos64", "leveldown", 	"build/Release" , "leveldown.node")
        copyNodeNativeAdapter( "macos64", "drivelist",  "build/Release" , "drivelist.node")

    // my 64 bit mac at home complains if I don't do this
    copyNodeNativeAdapter( "macos64", "pouchdb", 	"node_modules/leveldown/out/Release" , "leveldown.node")
    copyNodeNativeAdapter( "macos64", "leveldown",       "pouchdb/node_modules/build/Release" , "leveldown.node")
	//to fix a bug on leveldown
	if (!fs.existsSync(process.cwd() + "/build/leveldown.node") ) {
		mkdirSync(process.cwd() + "/build");
		copyFileSync(process.cwd() +  "/node_macos64/leveldown.noderename", process.cwd() + "/build/leveldown.node") ;
	}
}

					
var leveldown = require2('leveldown')

var dns          = require('dns');
var url          = require('url');
var net          = require('net');
var unzip        = require('unzip');
var postgresdb   = require('pg');
var ip           = require("ip");
var program      = require('commander');
var drivers      = new Object();
var connections  = new Object();
var queries      = new Object();
var express      = require('express')
var app          = express()
var timeout      = 0;
var init_drivers = false;
var port;
var hostaddress;
var typeOfSystem;
var centralHostAddress;
var centralHostPort;
var request      = require("request");
var toeval;
var open         = require('open');
var dbhelper     = require('../public/dbhelper');
var Excel = require('exceljs');
const drivelist = require('drivelist');


var sqlite3   = require2('sqlite3');
var dbsearch = new sqlite3.Database('gosharedatasearch.sqlite3');
        try {
            dbsearch.serialize(function() {
                  dbsearch.run("CREATE VIRTUAL TABLE search USING fts5(query_id, data);");
                });
            } catch(err) {
            } finally {
                
            }
        try {
            dbsearch.serialize(function() {
                  dbsearch.run("CREATE TABLE drivers (id TEXT, name TEXT, type TEXT, code TEXT);");
                });} catch(err) {} finally {}

        try {
            dbsearch.serialize(function() {
                  dbsearch.run("CREATE TABLE connections (id TEXT, name TEXT, driver TEXT, database TEXT, host TEXT, port TEXT ,connectString TEXT, user TEXT, password TEXT, fileName TEXT, size INTEGER, type TEXT, preview TEXT, hash TEXT);");
                });} catch(err) {} finally {}
                
        try {
            dbsearch.serialize(function() {
                  dbsearch.run("CREATE TABLE queries (id TEXT, name TEXT, connection INTEGER, driver TEXT, size INTEGER, hash TEXT, type TEXT, fileName TEXT, definition TEXT, preview TEXT, status TEXT);");
                });} catch(err) {} finally {}

                
        try {
            dbsearch.serialize(function() {
                  dbsearch.run("CREATE TABLE intranet_client_connects (id TEXT, internal_host TEXT, internal_port INTEGER, public_ip TEXT, via TEXT, public_host TEXT, user_name TEXT, client_user_name TEXT, when_connected INTEGER);");
                });} catch(err) {} finally {}
                
                
var stopScan = false;
var XLSX = require('xlsx');
var csv = require('fast-csv');

var mysql      = require('mysql');

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


  function isCsvFile(fname) {
	 if (!fname) {
		return false;
	 };
	 var ext = fname.split('.').pop();
	 ext = ext.toLowerCase();
	 if (ext == "csv") return true;
	 return false;
 }

var crypto = require('crypto');

function saveConnectionAndQueryForFile(fileId, fileType, size, fileName, fileType2) {
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
                                        
        dbsearch.serialize(function() {
            var stmt = dbsearch.prepare(" insert into connections " + 
                                        "    ( id, name, driver, size, hash, type, fileName ) " +
                                        " values " + 
                                        "    (?,  ?,?,?,  ?,?,?);");
                                        
            var newid = uuidv1();
            stmt.run(newid,
                     fileId, 
                     fileType,
                     size,
                     sha1sum,
                     fileType2,
                     fileName, function(err) {
                         
            
                            var saveTo;
                            if (isWin) {
                                saveTo = process.cwd() + "\\public\\docs\\" + "gsd_" + sha1sum.toString() + path.extname(fileName);
                            } else {
                                saveTo = process.cwd() + "/public/docs/" + "gsd_" + sha1sum.toString() + path.extname(fileName);
                            };
                            var copyfrom = fileName;
                            console.log('Copy from : ' + copyfrom + ' to : ' + saveTo);
                            copyFileSync(copyfrom, saveTo);
                              
                              
                            dbsearch.serialize(function() {
                                var stmt = dbsearch.prepare(" insert into queries " + 
                                                            "    ( id, name, connection, driver, size, hash, fileName, type, definition, preview ) " +
                                                            " values " + 
                                                            "    (?,  ?,?,?,  ?,?,?, ?,?,?);");
                                                            
                                var newqueryid = uuidv1();
                                stmt.run(newqueryid,
                                         fileId, 
                                         newid,
                                         fileType,
                                         size,
                                         sha1sum,
                                         fileName,
                                         fileType2,
                                         JSON.stringify({} , null, 2),
                                         JSON.stringify([{message: 'No preview available'}] , null, 2))
                            });
                            console.log(":      saved query = " + fileId);
                         
                     });
                     
            stmt.finalize();
            
        });
    } catch(err) {
        console.log("Error " + err + " with file: " + fileName);     
        return err; 
    } finally {
        
    }
}

 var walk = function(dir, done) {
   if (stopScan) {
     return;
   };
   //console.log('dir: ' + dir);
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    var pending = list.length;
    if (!pending) return done(null);
    list.forEach(function(file) {
      file = path.resolve(dir, file);
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          setTimeout(function() {
                              walk(file, function(err) {
                            if (!--pending) done(null);
                          });
          }, 10 * 1000);
        } else {
		  if (isExcelFile(file)) {
                console.log('file: ' + file);
  					var excelFile = file;
  						if (typeof excelFile !== "undefined") {
							var fileId = excelFile.replace(/[^\w\s]/gi,'');
  							console.log('   *file id: ' + fileId);
  							console.log('   *size: ' + stat.size);

                            saveConnectionAndQueryForFile(fileId, 'excel', stat.size, excelFile, '|SPREADSHEET|');
									  
						}
					}
		  if (isCsvFile(file)) {
                console.log('CSV file: ' + file);
  					var CSVFile = file;
  						if (typeof CSVFile !== "undefined") {
							var fileId = CSVFile.replace(/[^\w\s]/gi,'');
  							console.log('   *file id: ' + fileId);
  							console.log('   *size: ' + stat.size);

                            saveConnectionAndQueryForFile(fileId, 'csv', stat.size, CSVFile, '|CSV|');
						}
					}
          if (!--pending) done(null);
        }
      });
    });
  });
};



path.join(__dirname, '../public/jquery-1.9.1.min.js')
path.join(__dirname, '../public/jquery.zoomooz.js')
path.join(__dirname, '../public/polyfill.min.js')
path.join(__dirname, '../src/oracle.js')
path.join(__dirname, '../src/postgres.js')
path.join(__dirname, '../src/excel.js')
path.join(__dirname, '../public/gosharedata_setup.js')
path.join(__dirname, '../public/intranet.js')
path.join(__dirname, '../public/tether.min.js')
path.join(__dirname, '../public/bootstrap.min.js')
path.join(__dirname, '../public/bootstrap.min.css')
path.join(__dirname, '../public/es6-shim.js')
path.join(__dirname, '../public/vue_app.css')
path.join(__dirname, '../public/dist/build.js')
//path.join(__dirname, '../oracle_driver.zip')
path.join(__dirname, '../public/gosharedata_logo.PNG')
path.join(__dirname, '../public/favicon.ico')
path.join(__dirname, '../public/aframe.min.js')
path.join(__dirname, '../public/driver_icons/excel.jpg')
path.join(__dirname, '../public/driver_icons/csv.jpg')
path.join(__dirname, '../public/driver_icons/oracle.jpg')
path.join(__dirname, '../public/driver_icons/postgres.jpg')
path.join(__dirname, '../public/driver_icons/mysql.jpg')
path.join(__dirname, '../public/index_pc_mode.html')
path.join(__dirname, '../public/index_add_files.html')
path.join(__dirname, '../public/aframe-mouse-cursor-component.min.js')
path.join(__dirname, '../public/dropzone.js')
path.join(__dirname, '../public/dropzone.css')
path.join(__dirname, '../public/locked.png')
path.join(__dirname, '../public/unlocked.png')
//path.join(__dirname, '../public/gosharedata/index.html')





function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}



program
  .version('0.0.1')
  .option('-t, --type [type]', 'Add the specified type of app (client/server) [type]', 'client')
  .option('-p, --port [port]', 'Which port should I listen on? (default 80) [port]', parseInt)
  .option('-h, --host [host]', 'Server address of the central host (default gosharedata.com) [host]', 'gosharedata.com')
  .option('-l, --locked [locked]', 'Allow server to be locked/unlocked on start up (default true) [locked]', 'true')
  .option('-s, --hostport [hostport]', 'Server port of the central host (default 80) [hostport]', parseInt)
  .parse(process.argv);


  port = program.port;
  if (!isNumber(port)) {port = 80;};

  var portrange = 3000
  console.log('Local hostname: ' + ip.address() + ' ')
  getPort(mainProgram);

	function getPort (cb) {

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
  
  
  
  function mainProgram() {
	typeOfSystem = program.type;
	centralHostAddress = program.host;
	centralHostPort = program.hostport;
	if (!isNumber(centralHostPort)) {centralHostPort = 80;};


	if (!(typeOfSystem == 'client' || typeOfSystem == 'server')) {
		console.log('-------* Invalid system type: ' + typeOfSystem);
		process.exit();
	};
	console.log('-------* System type: ' + typeOfSystem);
	console.log('-------* Port: ' + port);
	console.log('-------* Central host: ' + centralHostAddress);
	console.log('-------* Central host port: ' + centralHostPort);


	var storageFileName = 'data.json';
		if (typeOfSystem == 'client') {
			storageFileName = 'data.json';
		} else if (typeOfSystem == 'server') {
			storageFileName = 'server.json';
		}
		console.dir ( ip.address() );

		console.log('addr: '+ ip.address());
		hostaddress = ip.address();








	//------------------------------------------------------------
	// wait three seconds for stuff to initialize
	//------------------------------------------------------------
	setTimeout(startServices, timeout);
	console.log('Creating timeout: ' + timeout);


	//------------------------------------------------------------
	// wait three seconds for stuff to initialize
	//------------------------------------------------------------
	function startServices() {

	var hostcount = 0;
	  //------------------------------------------------------------------------------
	  // Show the default page
	  //------------------------------------------------------------------------------
		app.get('/', function (req, res) {
			hostcount++;
		  console.log("Host: " + req.headers.host + ", " + hostcount);
		  console.log("URL: " + req.originalUrl);
		  if (req.headers.host) {
			  if (req.headers.host.toLowerCase() == 'canlabs.com') {
				res.writeHead(301,
					{Location: 'http://canlabs.com/canlabs'}
				  );
				  res.end();
				  return;
			  };
			  if (req.headers.host.toLowerCase() == 'gosharedata.com') {
				res.writeHead(301,
					{Location: 'http://gosharedata.com/gosharedata/index.html?time=' + new Date().getTime()}
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
	  })

      
    
    
    console.log('::::::::::: ' +process.cwd() + '/docs')
    app.use("/docs", express.static('public/docs'));
	app.use(express.static(path.join(__dirname, '../public/')))
	var bodyParser = require('body-parser');
	app.use(bodyParser.json()); // support json encoded bodies
	app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
var cors = require('cors')

app.use(cors())

    
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
        res.end("Sorry but access to " + username + "'s data is not allowed. Please ask " + username + " to unlocked their GoShareData account");
        return false;
	};
        

	//------------------------------------------------------------------------------
	// test_firewall
	//------------------------------------------------------------------------------
	app.get('/test_firewall', function (req, res) {
        var tracking_id =    url.parse(req.url, true).query.tracking_id;
        var server      =    url.parse(req.url, true).query.server;
        
        console.log(JSON.stringify(tracking_id,null,2));
        
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end(JSON.stringify({    got_through_firewall:   tracking_id  ,  
                                    server:                 server,
                                    username:               username,
                                    locked:                 locked
                                    }));
	});

    
	//------------------------------------------------------------------------------
	// get_intranet_servers
	//------------------------------------------------------------------------------
    var requestClientPublicIp;
	app.get('/get_intranet_servers', function (req, res) {
        requestClientPublicIp = req.ip;
        var requestVia                       = findViafromString(req.headers.via);
        
		res.writeHead(200, {'Content-Type': 'text/plain'});
        //zzz
        var mysql = "select *  from  intranet_client_connects  where " +
                    "    (when_connected > " + ( new Date().getTime() - (numberOfSecondsAliveCheck * 1000)) + ") " +
                    " and " + 
                    "    (( public_ip = '" + requestClientPublicIp + "') or " +
                              "((via = '" + requestVia + "') and (length(via) > 0)))";
        console.log("check IP: " + mysql);
        var stmt = dbsearch.all(mysql, function(err, rows) {
            if (!err) {
                console.log( "           " + JSON.stringify(rows));
                res.end(JSON.stringify({  allServers:       rows,
                                          intranetPublicIp: requestClientPublicIp}));
        }});
	});


	//------------------------------------------------------------------------------
	// Get the result of a SQL query
	//------------------------------------------------------------------------------
	app.get('/scanharddisk', function (req, res) {
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.end(JSON.stringify([]));
		stopScan = false;
		scanHardDisk();
	});

	app.get('/stopscanharddisk', function (req, res) {
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.end(JSON.stringify([]));
		stopScan = true;
	});


    
    
    
    
    
    
    
    
var multer = require('multer');
var upload = multer( { dest: 'uploads/' } );


    app.post('/file_upload', upload.single( 'file' ), function (req, res, next) {
        console.log('-------------------------------------------------------------------------------------');
        console.log('-------------------------------------------------------------------------------------');
        console.log('-------------------------------------------------------------------------------------');
        console.log('-------------------------------------------------------------------------------------');
        console.log('-------------------------------------------------------------------------------------');

        console.log(JSON.stringify(req.file));
        console.log(JSON.stringify(req.file.originalname));
        console.log(JSON.stringify(req.file.filename));
 

        console.log('......................................................................................');
        console.log('......................................................................................');
        console.log('......................................................................................');
        console.log('......................................................................................');
        console.log('......................................................................................');
        res.status( 200 ).send( req.file );

        var ext = req.file.originalname.split('.').pop();
        ext = ext.toLowerCase();
        console.log('Ext: ' + ext);

        var localp2;
        if (isWin) {
	    localp2 = process.cwd() + '\\uploads\\' + req.file.filename;
	} else{
	    localp2 = process.cwd() + '/uploads/' + req.file.filename;
	};
        var localp = localp2 + '.' + ext;
        fs.renameSync(localp2, localp);
        console.log('Local saved path: ' + localp);
        
        fs.stat(localp, function(err, stat) {
          if (isExcelFile(req.file.originalname)) {
                console.log('file: ' + req.file.originalname);
  					var excelFile = localp;
  						if (typeof excelFile !== "undefined") {
							var fileId = excelFile.replace(/[^\w\s]/gi,'');
  							console.log('   *file id: ' + fileId);
  							console.log('   *size: ' + stat.size);

                            saveConnectionAndQueryForFile(req.file.originalname, 'excel', stat.size, excelFile, '|SPREADSHEET|');
            }};
          if (isCsvFile(req.file.originalname)) {
                console.log('file: ' + req.file.originalname);
  					var excelFile = localp;
  						if (typeof excelFile !== "undefined") {
							var fileId = excelFile.replace(/[^\w\s]/gi,'');
  							console.log('   *file id: ' + fileId);
  							console.log('   *size: ' + stat.size);

                            saveConnectionAndQueryForFile(req.file.originalname, 'csv', stat.size, excelFile, '|CSV|');
            }};
        });
									  

    });
	app.post('/open_query_in_native_app', function (req, res) {

		console.log('in open_query_in_native_app');
		var queryData = req.body;
		console.log('queryData.source: ' + queryData.source);
		console.log('queries[queryData.source]: ' + queries[queryData.source]);
		console.log('connections[queries[queryData.source].connection]: ' + connections[queries[queryData.source].connection]);
		console.log('connections[queries[queryData.source].connection].fileName: ' + connections[queries[queryData.source].connection].fileName);
		var error = new Object();
		//console.log('query driver: ' + connections[queryData.source].driver);
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
	})


	//------------------------------------------------------------------------------
	// Get the result of a SQL query
	//------------------------------------------------------------------------------
	app.post('/getresult', function (req, res) {
		console.log('in getresult');
		var queryData = req.body;
		console.log('queryData.source: ' + queryData.source);
        
		//console.log('request received source: ' + Object.keys(req));
		var error = new Object();
		if (queryData) {
			if (connections[queryData.source]) {
				if (queryData.source) {
					if (connections[queryData.source].driver) {
						console.log('query driver: ' + connections[queryData.source].driver);
						try {
							drivers[connections[queryData.source].driver]['get_v2'](connections[queryData.source],{sql: queryData.sql},function(ordata) {
								res.writeHead(200, {'Content-Type': 'text/plain'});
                                
        //if (queryData.sql.indexOf("snippet(" == -1)) {
        //    dbsearch.serialize(function() {
        //          var stmt = dbsearch.prepare("INSERT OR REPLACE INTO search VALUES ((select QUERY_ID from search where QUERY_ID = ?), ?)");
        //          for (var i =0 ; i < ordata.length; i++) {
        //            stmt.run(queryData.source, JSON.stringify(ordata[i]));
        //          }
        //          stmt.finalize();
        //
        //        });
        //}
			//dbsearch.close();
			
			

                                res.end(JSON.stringify(ordata));
							});
						}
						catch(err) {
							res.writeHead(200, {'Content-Type': 'text/plain'});

							res.end(JSON.stringify({error: 'Error: ' + JSON.stringify(err)}));
						};
					} else {
						console.log('query driver not found: ' + connections[queryData.source]);
							res.writeHead(200, {'Content-Type': 'text/plain'});
							res.end(JSON.stringify({message: 'query driver not found'}));
					};
				};
			};
		};
	})

    
    
    //------------------------------------------------------------------------------
	// Get the result of a SQL query
	//------------------------------------------------------------------------------
	app.get('/get_search_results', function (req, res) {
        var searchTerm = req.query.search_text;
        
        res.writeHead(200, {'Content-Type': 'text/plain'});
		dbsearch.serialize(function() {
            var timeStart = new Date().getTime();
            var mysql = "select query_id, snippet(search,0,'*','*','...',1) from search where search match '"  + searchTerm + "*'";
            //console.log( "search for: " + searchTerm);
            //console.log( "    sql: " + mysql);
            
			var stmt = dbsearch.all(mysql, function(err, rows) {
                if (!err) {
                    console.log( "           " + JSON.stringify(rows));
                    var newres = [];
                    for  (var i=0; i < rows.length;i++) {
                        if (rows[i]["query_id"]) {
                            newres.push({b: rows[i]["query_id"]});
                        }
                    }
                    var timeEnd = new Date().getTime();
                    var timing = timeEnd - timeStart;
                    res.end( JSON.stringify({   search: searchTerm, 
                                                values: newres, 
                                                duration: timing}));
                    //console.log( "    took: " + timing + " millis");
                } else {
                    var timeEnd = new Date().getTime();
                    var timing = timeEnd - timeStart;
                    res.end( JSON.stringify({search:    searchTerm, 
                                             values:    [{b: "Error searching for: " + searchTerm }], 
                                             duration:  timing    }  ));
                    console.log( "    took: " + timing + " millis");
                }
            });

        });
    });

    
    
    
    
    
	app.post('/getqueryresult', function (req, res) {
		var queryData2 = req.body;
		console.log('in getqueryresult: ' + JSON.stringify(queryData2));
		console.log('           source: ' + JSON.stringify(queryData2.source));
		//console.log('request received source: ' + Object.keys(req));
		//console.log('request received SQL: ' + queryData.sql);
		var query = queries[queryData2.source];

		console.log('           query: ' + JSON.stringify(query));
		if (query) {
			var queryData 			= new Object();
			queryData.source 		= query.connection;
			queryData.definition 	= eval('(' + query.definition + ')' );

			console.log('   query.definition.sql: ' + JSON.stringify(query.definition.sql));
			console.log('           ***queryData: ' + JSON.stringify(queryData));


			var error = new Object();
			if (queryData) {
				if (connections[queryData.source]) {
					if (queryData.source) {
						if (connections[queryData.source].driver) {
							//console.log('query driver: ' + connections[queryData.source].driver);
							try {
								drivers[connections[queryData.source].driver]['get_v2'](connections[queryData.source],queryData.definition,function(ordata) {
                                
        //if (queryData.sql.indexOf("snippet(" == -1)) {
            var rrows = [];

            if( Object.prototype.toString.call( ordata ) === '[object Array]' ) {
                rrows = ordata;
            } else {
                rrows = ordata.values;
            }
            //console.log('           adding to search index: ' + JSON.stringify(rrows.length));
            
            dbsearch.serialize(function() {
                  var stmt = dbsearch.prepare("INSERT INTO search VALUES (?, ?)");
                      for (var i =0 ; i < rrows.length; i++) {
                        //console.log('                 : ' + JSON.stringify(rrows[i]));
                        stmt.run(queryData2.source, JSON.stringify(rrows[i]));
                      }
                      stmt.finalize();

                });
        //}

            res.writeHead(200, {'Content-Type': 'text/plain'});
									res.end(JSON.stringify(ordata));
								});
							}
							catch(err) {
								res.writeHead(200, {'Content-Type': 'text/plain'});

								res.end(JSON.stringify({error: 'Error: ' + JSON.stringify(err)}));
							};
						} else {
							console.log('query driver not found: ' + connections[queryData.source]);
								res.writeHead(200, {'Content-Type': 'text/plain'});
								res.end(JSON.stringify({error: 'query driver not found'}));
						};
					};
				};
			};
		} else {
			console.log('query not found: ' + queryData2.source);
			res.writeHead(200, {'Content-Type': 'text/plain'});
			res.end(JSON.stringify({error: 'query ' + queryData2.source + ' not found'}));

		};
	})

    var locked = (program.locked == 'true');

	app.get('/send_client_details', function (req, res) {
		//console.log('in send_client_details: ' + JSON.stringify(req,null,2));
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end(JSON.stringify({
                returned:           'some data ', 
                username:           username, 
                locked:             locked,
                localIp:            req.ip,
                isLocalMachine:     isLocalMachine(req) }));
	})


	app.get('/lock', function (req, res) {
        if ((req.query.locked == "TRUE") || (req.query.locked == "true")) {
            locked = true;
        } else {
            locked = false;
        }

            //console.log('in lock: ' + JSON.stringify(req,null,2));
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end(JSON.stringify({locked: locked}));
	})


	process.on('uncaughtException', function (err) {
	  console.log(err);
	})








	var requestClientInternalHostAddress = '';
	var requestClientInternalPort        = -1;
	var requestClientPublicIp            = '';
	var requestClientPublicHostName      = '';


	//------------------------------------------------------------------------------
	// This is called by the central server to get the details of the last
	// client that connected tp the central server
	//------------------------------------------------------------------------------
	app.get('/get_connect', function (req, res) {
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
	})

	//app.enable('trust proxy')

    var extractHostname = function (url) {
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

    var extractRootDomain = function(url) {
    var domain = extractHostname(url),
        splitArr = domain.split('.'),
        arrLen = splitArr.length;

    //extracting the root domain here
    if (arrLen > 2) {
        domain = splitArr[arrLen - 2] + '.' + splitArr[arrLen - 1];
    }
    return domain;
}

    var findViafromString = function(inp) {
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
    
	app.get('/get_all_table', 
        function (req, res) {
			var tableName = url.parse(req.url, true).query.tableName;
            var stmt = dbsearch.all("select * from " + tableName,
                function(err, rows) {
                    if (!err) {
                        res.writeHead(200, {'Content-Type': 'text/plain'});
                        res.end(JSON.stringify(
                            rows));
                        console.log("Sent: " + JSON.stringify(rows.length));
                    };
                })
    });
    
	app.post('/add_new_connection', 
        function (req, res) {
			var params = req.body;
            addNewConnection( params );
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end(JSON.stringify({done: "ok"}))});
    


	app.post('/add_new_query', 
        function (req, res) {
			var params = req.body;
            addNewQuery( params );
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end(JSON.stringify({done: "ok"}))});


    
    
	//------------------------------------------------------------------------------
	// run on the central server only
	//
	// This is where the client sends its details to the central server
	//------------------------------------------------------------------------------
	app.get('/client_connect', function (req, res) {
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

			console.log('Client attempting to connect from:');
			console.log('client internal host address:    ' + requestClientInternalHostAddress)
			console.log('client internal port:            ' + requestClientInternalPort)
			console.log('client public IP address:        ' + requestClientPublicIp)
			console.log('client public IP host name:      ' + requestClientPublicHostName)
			console.log('client VIA:                      ' + requestVia)
//zzz            
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
            console.log('***SAVED***');
			
			res.writeHead(200, {'Content-Type': 'text/plain'});
			res.end(JSON.stringify(
                {
                    connected: true, 
                }));
		}
		catch (err) {
			console.log('Warning: Central server not available:');
		}

	})







	//------------------------------------------------------------------------------
	// start the web server
	//------------------------------------------------------------------------------
	app.listen(port, hostaddress, function () {
		console.log(typeOfSystem + ' started on port ' + port );
	})








	  console.log('addr: '+ hostaddress + ":" + port);





    var aliveCheckFn =                 function() {
                    var urlToConnectTo = "http://" + centralHostAddress + ":" + centralHostPort + '/client_connect';
                    console.log('-------* urlToConnectTo: ' + urlToConnectTo);
                    console.log('trying to connect to central server...');
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
                          console.log('Error: ' + error);
                          if (response) {
                              if (response.statusCode == '403') {
                                    console.log('403 received, not allowed through firewall for ' + urlToConnectTo);
                                    //open("http://" + centralHostAddress + ":" + centralHostPort);
                              } else {
                                    //console.log('response: ' + JSON.stringify(response));
                                    //console.log(body);
                              }
                          }
                        });
                };
                aliveCheckFn();
		if (typeOfSystem == 'client') {
            setInterval(aliveCheckFn ,numberOfSecondsAliveCheck * 1000);



				
				
				
				

		}



                  
                  




when_pouchdb_connections_changes();
when_pouchdb_queries_changes();
				




		console.log("******************************ADDING DRIVERS*********************************")
		console.log("******************************ADDING DRIVERS*********************************")



		var pgeval = '(' + fs.readFileSync(path.join(__dirname, './csv.js')).toString() + ')';
		drivers['csv'] = eval( pgeval )
		addOrUpdateDriver('csv', pgeval, drivers['csv'])


		var pgeval = '(' + fs.readFileSync(path.join(__dirname, './excel.js')).toString() + ')';
		drivers['excel'] = eval( pgeval )
		addOrUpdateDriver('excel', pgeval, drivers['excel'])


		var pgeval = '(' + fs.readFileSync(path.join(__dirname, './postgres.js')).toString() + ')';
		drivers['postgres'] = eval( pgeval )
		addOrUpdateDriver('postgres', pgeval, drivers['postgres'])

        
        
		var sqliteeval = '(' + fs.readFileSync(path.join(__dirname, './sqlite.js')).toString() + ')';
		drivers['sqlite'] = eval( sqliteeval )
		addOrUpdateDriver('sqlite', sqliteeval, drivers['sqlite'])



		var pgeval = '(' + fs.readFileSync(path.join(__dirname, './mysql.js')).toString() + ')';
		drivers['mysql'] = eval( pgeval )
		addOrUpdateDriver('mysql', pgeval, drivers['mysql'])



		toeval =  '(' + fs.readFileSync(path.join(__dirname, './oracle.js')).toString() + ')';
		drivers['oracle']   = eval( toeval )
		addOrUpdateDriver('oracle',   toeval, drivers['oracle'])
		process.env['PATH'] = process.cwd() + '\\oracle_driver\\instantclient32' + ';' + process.env['PATH'];
		if (drivers['oracle'].loadOnCondition()) {
			drivers['oracle'].loadDriver()
		}



		var tdeval = '(' + fs.readFileSync(path.join(__dirname, './testdriver.js')).toString() + ')';
		drivers['testdriver'] = eval(tdeval)
		addOrUpdateDriver('testdriver', tdeval, drivers['testdriver'])






    






		
		

	function addOrUpdateDriver(name, code, theObject) {
		var driverType = theObject.type;
		console.log('addOrUpdateDriver: ' + name);
        
        var stmt = dbsearch.all("select name from drivers where name = '" + name + "';", 
            function(err, rows) {
                console.log('err             : ' + err);
                if (!err) {
                    console.log('             : ' + rows.length);
                    if (rows.length == 0) {
                        try 
                        {
                            dbsearch.serialize(function() {
                                var stmt = dbsearch.prepare(" insert into drivers " + 
                                                            "    (id,  name, type, code ) " +
                                                            " values " + 
                                                            "    (?, ?,?,?);");
                            stmt.run(uuidv1(),  name,  driverType,  code);
                            stmt.finalize();
                            });
                        } catch(err) {
                        } finally {
                            
                        }
                    
                    } else {
                        console.log('   *** Checking DRIVER ' + name);
                        var existingDriver = rows[0];
                        if (!(code === existingDriver.code)) {
                            try 
                            {
                                dbsearch.serialize(function() {
                                    var stmt = dbsearch.prepare(" update   drivers   set code = ? where id = ?");
                                    stmt.run( code , rows[0].id );
                                    stmt.finalize();
                                });
                            } catch(err) {
                            } finally {
                                
                            }
                        }
                    }
                }
            }
        );
    }
    



	//console.log("postgres.get = " + JSON.stringify(eval(pgeval) , null, 2))
	//console.log("postgres.get = " + eval(pgeval).get)
	//--------------------------------------------------------
	// open the app in a web browser
	//--------------------------------------------------------


	if (typeOfSystem == 'client') {
	  //open('http://' + hostaddress  + ":" + port);
      open('http://' + centralHostAddress  + ":" + centralHostPort + "/gosharedata/index.html?time=" +  + new Date().getTime());
	} else if (typeOfSystem == 'server') {
	  open('http://' + hostaddress  + ":" + port + "/gosharedata/index.html?time=" +  + new Date().getTime());
	}
	console.log('http://' + hostaddress  + ":" + port);

	}
	}














function scanHardDisk() {
	var useDrive = "C:\\";
	//var useDrive = "C:";

		drivelist.list(function(error, drives)  {
			  if (error) {
				throw error;
			  };

			  drives.forEach(function(drive) {
				console.log(drive);

        if (!stopScan) {
	    if (drive.mountpoints.length > 0){
var driveStart =
    console.log("Drive: " + drive.mountpoints[0].path);
			useDrive = drive.mountpoints[0].path;
			if (isWin) {
				useDrive = useDrive + '\\';
			}


  				walk(useDrive, function(error){
  					console.log('*Error: ' + error);

  				});
			};
        };
			  });
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
    console.log('çopy from: '+ source + ' to ' + target);
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
				console.log('copying:  ' + targetFolder);
            }
        } );
    }
}


var in_when_pouchdb_connections_changes=false;
function when_pouchdb_connections_changes() {
    if (!in_when_pouchdb_connections_changes) {
        in_when_pouchdb_connections_changes=true;
        console.log('------------------------------------');
        console.log('Called when_pouchdb_ CONNS _changes ');
        console.log('------------------------------------');
        console.log('------------------------------------');
//zzz        
        var stmt = dbsearch.all("select * from connections",
            function(err, results) {
                if (!err) {
                    for (var i = 0 ; i < results.length ; i ++) {
                        var conn = results[i]
                        //console.log('    --------Found conn:  ' + conn._id);
                        //console.log('                      :  ' + conn.name);
                        if (!connections[conn.id]) {
                          //console.log(a);
                          connections[conn.id] = conn;
                        }
                    }
                }
            }
        );
    };
    in_when_pouchdb_connections_changes=false;
}


function addNewConnection( params ) { 
    try 
    {
        console.log("------------------function addNewConnection( params ) { -------------------");
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
        });
    } catch(err) {
        console.log("                          err: " + err);
    } finally {
        
    }
}



function addNewQuery( params ) { 
    try 
    {
        console.log("------------------function addNewQuery( params ) { -------------------");
        dbsearch.serialize(function() {
            var stmt = dbsearch.prepare(" insert into query " + 
                                        "    ( id, name, connection, driver, definition, status ) " +
                                        " values " + 
                                        "    (?,    ?, ?, ?, ?, ?);");
                                        
            stmt.run(uuidv1(),
                     params.name, 
                     params.connection, 
                     params.driver, 
                     params.definition,
                     params.status
                     );
                     
            stmt.finalize();
        });
    } catch(err) {
        console.log("                          err: " + err);
    } finally {
        
    }
}







var in_when_pouchdb_queries_changes = false;
function when_pouchdb_queries_changes() {
    if (!in_when_pouchdb_queries_changes) {
        in_when_pouchdb_queries_changes = true;
        console.log('Called when_pouchdb_queries_changes ');
        //console.log('    connection keys:  ' + JSON.stringify(Object.keys(connections),null,2));
        var stmt = dbsearch.all("select * from queries",
            function(err, results) {
                if (!err) {
                console.log('    --------Found:  ' + results.length);
                
                
                // find previews
                for (var i = 0 ; i < results.length ; i ++) {
                    var query = results[i];
                    if (!queries[query.id]) {
                        queries[query.id] = query;
                        var oout = [{a: 'no EXCEL'}];
                        try {
                            //console.log('get preview for query id : ' + query._id);
                            //console.log('          driver : ' + query.driver);
                            var restrictRows = JSON.parse(query.definition);
                            restrictRows.maxRows = 10;
                            /*drivers[query.driver]['get_v2'](connections[query.connection],restrictRows,
                                function(ordata) {
                                    //console.log('getting preview for query : ' + query.name);
                                    query.preview = JSON.stringify(ordata, null, 2);
                                    pouchdb_queries.put(query);
                            });*/
                        } catch (err) {};
                    }
                };
            }});
        in_when_pouchdb_queries_changes = false;
    }
};


 
console.log("-------------------------------------------------------------------");
console.log("-------------------------------------------------------------------");
console.log("-------------------------------------------------------------------");
console.log("-------------------------------------------------------------------");
console.log("-------------------------------------------------------------------");

var os= require('os')
username = os.userInfo().username
console.log(username);
