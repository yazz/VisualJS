'use strict';

var pouchdb_system_settings;
var pouchdb_connections;
var pouchdb_drivers;
var pouchdb_queries;
var pouchdb_intranet_client_connects;
var numberOfSecondsAliveCheck = 60; 

var isWin = /^win/.test(process.platform);

function require2(moduleName) {
	var pat;
	if (isWin) {
		pat = "require(process.cwd() + " + "'\\\\node_modules\\\\" + moduleName + "');";
	} else {
		pat = "require(process.cwd() + " + "'/node_modules/" + moduleName + "');";
	}
	
	console.log('PATH: ' + pat);
    var reac = eval(pat);	
	return reac;
};


var fs           = require('fs');
var path         = require('path');
var mkdirp       = require('mkdirp')

if (!fs.existsSync(process.cwd() + "/node_modules") ) {
    copyFolderRecursiveSync(path.join(__dirname, "../node_modules")  , process.cwd() );
}


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

function copyNodeNativeAdapter( osName, moduleName, directoryToSaveTo , nativeFileName) {
	if (!fs.existsSync(process.cwd() + "/node_modules/" + moduleName + "/" + directoryToSaveTo + "/" + nativeFileName) ) {
		console.log('* Creating native driver for: ' + moduleName);
		mkdirSync(process.cwd() + "/node_modules/" + moduleName +  "/" + directoryToSaveTo);
		copyFileSync(	path.join(__dirname, "../node_" + osName + "/" + nativeFileName + "rename"),
							process.cwd() + "/node_modules/" + moduleName + "/" + directoryToSaveTo + "/" + nativeFileName) ;
	}
}

if (isWin) {
	// copy WIndows 32 node native files
	copyNodeNativeAdapter( "win32", "sqlite3", 		"lib/binding/node-v48-win32-ia32" , "node_sqlite3.node")
	copyNodeNativeAdapter( "win32", "leveldown", 	"build/Release" , "leveldown.node")
	//to fix a bug on leveldown
	if (!fs.existsSync(process.cwd() + "/build/leveldown.node") ) {
		mkdirSync(process.cwd() + "/build");
		copyFileSync(	path.join(__dirname, "../node_win32/leveldown.noderename"), process.cwd() + "/build/leveldown.node") ;
	}
} else { //means Mac OS
	// copy Mac OS 64 node native files
	copyNodeNativeAdapter( "macos64", "sqlite3", 	"lib/binding/node-v48-darwin-x64" , "node_sqlite3.node")
	copyNodeNativeAdapter( "macos64", "leveldown", 	"build/Release" , "leveldown.node")
    
    // my 64 bit mac at home complains if I don't do this
	copyNodeNativeAdapter( "macos64", "leveldown", 	"pouchdb/node_modules/build/Release" , "leveldown.node")
	//to fix a bug on leveldown
	if (!fs.existsSync(process.cwd() + "/build/leveldown.node") ) {
		mkdirSync(process.cwd() + "/build");
		copyFileSync(	path.join(__dirname, "../node_macos64/leveldown.noderename"), process.cwd() + "/build/leveldown.node") ;
	}
}

					
var leveldown = require2('leveldown')

var PouchDB = require('pouchdb')
PouchDB.plugin(require('pouchdb-find'));
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
          walk(file, function(err) {
            if (!--pending) done(null);
          });
        } else {
		  if (isExcelFile(file)) {
                console.log('file: ' + file);
  					var excelFile = file;
  						if (typeof excelFile !== "undefined") {
							var fileId = excelFile.replace(/[^\w\s]/gi,'');
  							console.log('   *file id: ' + fileId);

							pouchdb_connections.post(
									{
  										  name: 		fileId,
  										  driver: 		'excel',
  										  fileName: 	excelFile
									}, function (err, response) {
                                          if (err) { 
                                                return err; 
                                          }
                                          pouchdb_queries.post(
                                          {
                                              name: fileId,
                                              connection: response.id,
                                              driver: 'excel',
                                              type: '|SPREADSHEET|',
                                              definition:JSON.stringify({} , null, 2),
                                              preview: JSON.stringify([{message: 'No preview available'}] , null, 2)
                                              
                                          });
                                    });
									  
						}
					}
		  if (isCsvFile(file)) {
                console.log('CSV file: ' + file);
  					var CSVFile = file;
  						if (typeof CSVFile !== "undefined") {
							var fileId = CSVFile.replace(/[^\w\s]/gi,'');
  							console.log('   *file id: ' + fileId);

							pouchdb_connections.post(
									{
  										  name: 		fileId,
  										  driver: 		'csv',
  										  fileName: 	CSVFile
									}, function (err, response) {
                                          if (err) { 
                                                return err; 
                                          }
                                          pouchdb_queries.post(
                                          {
                                              name: fileId,
                                              connection: response.id,
                                              driver: 'csv',
                                              type: '|CSV|',
                                              definition:JSON.stringify({} , null, 2),
                                              preview: JSON.stringify([{message: 'No preview available'}] , null, 2)
                                              
                                          });
                                    });
									  
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
path.join(__dirname, '../public/index_vr_mode.html')
path.join(__dirname, '../public/aframe-mouse-cursor-component.min.js')
path.join(__dirname, '../public/pouchdb.min.js')
path.join(__dirname, '../public/pouchdb.find.min.js')
path.join(__dirname, '../public/pouchdb.memory.min.js')





function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}



program
  .version('0.0.1')
  .option('-t, --type [type]', 'Add the specified type of app (client/server) [type]', 'client')
  .option('-p, --port [port]', 'Which port should I listen on? (default 80) [port]', parseInt)
  .option('-h, --host [host]', 'Server address of the central host (default gosharedata.com) [host]', 'gosharedata.com')
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
			  res.end(fs.readFileSync(path.join(__dirname, '../public/index.html')));
		  }
		  if (typeOfSystem == 'server') {
			  res.end(fs.readFileSync(path.join(__dirname, '../public/index_server.html')));
		  }
	  })

      
    
    
    
	app.use(express.static(path.join(__dirname, '../public/')))
	var bodyParser = require('body-parser');
	app.use(bodyParser.json()); // support json encoded bodies
	app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
var cors = require('cors')

app.use(cors())

    
        

	//------------------------------------------------------------------------------
	// test_firewall
	//------------------------------------------------------------------------------
	app.get('/test_firewall', function (req, res) {
        var tracking_id = url.parse(req.url, true).query.tracking_id;
        console.log(JSON.stringify(tracking_id,null,2));
        
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end(JSON.stringify({got_through_firewall: tracking_id}));
	});

    
	//------------------------------------------------------------------------------
	// get_intranet_servers
	//------------------------------------------------------------------------------
    var requestClientPublicIp;
	app.get('/get_intranet_servers', function (req, res) {
        requestClientPublicIp = req.ip;
        
		res.writeHead(200, {'Content-Type': 'text/plain'});
        pouchdb_intranet_client_connects.find({
          selector: {
              $and: [
                        {when_connected: {$gt: new Date().getTime() - (numberOfSecondsAliveCheck * 1000)}}
                        ,
                        {public_ip: {$eq: requestClientPublicIp}}
          ]}
              ,
              sort: [{when_connected: 'desc'}]
        }).then(function (result) {
            console.log(JSON.stringify(result,null,2));
            if (result.docs.length == 0 ) {
                res.end(JSON.stringify({html: "<div>No local servers on your intranet, sorry</div>"}));
            } else {
                var intranetGoShareDataHost = 'http://' + result.docs[0].internal_host + ':' + result.docs[0].internal_port;
                
                var i=0;
                var extrahtml = '';
                for (var i = 0; i < result.docs.length; i++) {
                    var server = result.docs[i];
                        extrahtml += "<div>*" + server.internal_host + ":" + 
                                        server.internal_port + "</div><br>";
                }
                var quotedIntranetGoShareDataHost = '"' + intranetGoShareDataHost + '"';
                var html = "<div><div>Your Public IP is " + requestClientPublicIp + "</div>Your local server is here at   " 
                            + " <a href='#' style='text-decoration: underline; color: blue;' onclick='call_on_click(" + quotedIntranetGoShareDataHost + ");'> " + intranetGoShareDataHost + "</a>" + extrahtml + "</div>";
                
                res.end(JSON.stringify({  html:         html, 
                                          localServer:  intranetGoShareDataHost}));
            }
        });
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
		console.log('queryData.source: ' + JSON.stringify(queryData.source,null,2));
        
		//console.log('request received source: ' + Object.keys(req));
		//console.log('request received SQL: ' + queryData.sql);
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
						console.log('query driver not found: ' + connections[queryData.source]);
							res.writeHead(200, {'Content-Type': 'text/plain'});
							res.end(JSON.stringify({message: 'query driver not found'}));
					};
				};
			};
		};
	})

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

    
    
    
    
	//------------------------------------------------------------------------------
	// run on the central server only
	//
	// This is where the client sends its details to the central server
	//------------------------------------------------------------------------------
	app.get('/client_connect', function (req, res) {
		try
		{
			var queryData = url.parse(req.url, true).query;

			requestClientInternalHostAddress = req.query.requestClientInternalHostAddress;
			requestClientInternalPort        = req.query.requestClientInternalPort;
			requestClientPublicIp            = req.ip;
			//requestClientPublicHostName      = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
			requestClientPublicHostName      = "req keys::" + Object.keys(req) + ", VIA::" + req.headers.via + ", raw::" + JSON.stringify(req.rawHeaders);

			console.log('Client attempting to connect from:');
			console.log('client internal host address:    ' + requestClientInternalHostAddress)
			console.log('client internal port:            ' + requestClientInternalPort)
			console.log('client public IP address:        ' + requestClientPublicIp)
			console.log('client public IP host name:      ' + requestClientPublicHostName)
            
            //zzz
            pouchdb_intranet_client_connects.post(
            {
                internal_host:      requestClientInternalHostAddress,  
                internal_port:      requestClientInternalPort, 
                public_ip:          requestClientPublicIp, 
                public_host:        requestClientPublicHostName,
                when_connected:     new Date().getTime()
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
		console.log('PouchDB Listening on port ' + port + '!' + ' with /db')
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
                          followRedirect: true,
                          maxRedirects: 10,
                          qs: {
                              requestClientInternalHostAddress: hostaddress
                              ,
                              requestClientInternalPort:        port
                          }
                        },
                        function(error, response, body) {
                          console.log('Error: ' + error);
                          if (response.statusCode == '403') {
                                console.log('403 received, not allowed through firewall ');
                          } else {
                                console.log('response: ' + JSON.stringify(response));
                                console.log(body);
                          }
                        });
                };
                aliveCheckFn();
		if (typeOfSystem == 'client') {
            setInterval(aliveCheckFn ,numberOfSecondsAliveCheck * 1000);



				
				
				
				
						var db = new sqlite3.Database(':memory:');

		db.serialize(function() {
			  db.run("CREATE TABLE lorem (info TEXT)");

			  var stmt = db.prepare("INSERT INTO lorem VALUES (?)");
			  for (var i = 0; i < 10; i++) {
				  stmt.run("Ipsum " + i);
			  }
			  stmt.finalize();

			  db.each("SELECT rowid AS id, info FROM lorem", function(err, row) {
				  console.log(row.id + ": " + row.info);
			  });
			});

			db.close();
			
			
		}



				console.log("******************************ADDING POUCH*********************************")
				console.log("******************************ADDING POUCH*********************************")

console.log('POUCH...');

var dbb = require2('sqldown');
var myttt = require('express-pouchdb')(PouchDB, { 	db: dbb, 
													d:  (process.cwd() + "pouch") ,
													mode: 'fullCouchDB'})
app.use('/db', myttt);





dbhelper.setPouchDB(PouchDB);
dbhelper.initPouchdb();
pouchdb_system_settings             = dbhelper.get_pouchdb_system_settings();;
pouchdb_connections                 = dbhelper.get_pouchdb_connections();;
pouchdb_drivers                     = dbhelper.get_pouchdb_drivers();;
pouchdb_queries                     = dbhelper.get_pouchdb_queries();;
pouchdb_intranet_client_connects    = dbhelper.get_pouchdb_intranet_client_connects();;


dbhelper.pouchdbTableOnServer('pouchdb_system_settings',    pouchdb_system_settings,null);
dbhelper.pouchdbTableOnServer('pouchdb_connections',        pouchdb_connections,    function(){when_pouchdb_connections_changes(pouchdb_connections)});
dbhelper.pouchdbTableOnServer('pouchdb_drivers',            pouchdb_drivers,        null);
dbhelper.pouchdbTableOnServer('pouchdb_queries',            pouchdb_queries,        function(){when_pouchdb_queries_changes(pouchdb_queries)});
				




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


		////dbhelper.sql("insert into drivers (name,code,driver_type) values (?,?,?)",            ['a', 'b', 'c'])
		//dbhelper.sql("update drivers set type = '...2' where name = 'TestDriver'")
		//dbhelper.sql("select * from drivers where name = 'TestDriver' ")
		//dbhelper.sql("select * from drivers ")











		
		
		

	function addOrUpdateDriver(name, code, theObject) {
		console.log("******************************addOrUpdateDriver ")
		console.log("       name = " + name)
		//console.log("       code = " + JSON.stringify(code , null, 2))
		var driverType = theObject.type;
		//console.log("******************************driver type= " + driverType)
		//console.log("******************************driver= " + JSON.stringify(theObject , null, 2))
		
		pouchdb_drivers.find({selector: {name: {$eq: name}}}, 
			function(err, result){
				console.log('POUCH scanning driver: ' + JSON.stringify(name , null, 2));
				if (result.docs.length == 0) {
					pouchdb_drivers.post({
												name: name,
												type: driverType,
												code: code
												});
				} else {
					console.log('   *** Checking DRIVER ' + name);
					var existingDriver = result.docs[0];
					if (!(code === existingDriver.code)) {
						console.log('      *** UPDATED CODE FOR DRIVER ' + name);
						existingDriver.code = code;
						pouchdb_drivers.put(existingDriver);
					}
				}
			});
		}



	//console.log("postgres.get = " + JSON.stringify(eval(pgeval) , null, 2))
	//console.log("postgres.get = " + eval(pgeval).get)
	//--------------------------------------------------------
	// open the app in a web browser
	//--------------------------------------------------------


	if (typeOfSystem == 'client') {
	  open('http://' + hostaddress  + ":" + port);
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
function when_pouchdb_connections_changes(pouchdb_connections) {
    if (!in_when_pouchdb_connections_changes) {
        in_when_pouchdb_connections_changes=true;
        console.log('------------------------------------');
        console.log('Called when_pouchdb_ CONNS _changes ');
        console.log('------------------------------------');
        console.log('------------------------------------');
        
        pouchdb_connections.find({selector: {name: {'$exists': true}}}, function (err, result) {
            var results = result.docs;
            for (var i = 0 ; i < results.length ; i ++) {
                var conn = results[i]
                //console.log('    --------Found conn:  ' + conn._id);
                //console.log('                      :  ' + conn.name);
                if (!connections[conn._id]) {
                  //console.log(a);
                  connections[conn._id] = conn;
                }
            }
        });
        in_when_pouchdb_connections_changes=false;
    }
}




var in_when_pouchdb_queries_changes = false;
function when_pouchdb_queries_changes(pouchdb_queries) {
    if (!in_when_pouchdb_queries_changes) {
        in_when_pouchdb_queries_changes = true;
        console.log('Called when_pouchdb_queries_changes ');
        //console.log('    connection keys:  ' + JSON.stringify(Object.keys(connections),null,2));
        pouchdb_queries.find({selector: {name: {'$exists': true}}}, function (err, result) {
            if (err) {
                console.log('    --------Error:  ' + err);
                return;
            }
            var results = result.docs;
            console.log('    --------Found:  ' + results.length);
            
            
            // find previews
            for (var i = 0 ; i < results.length ; i ++) {
                var query = results[i];
                if (!queries[query._id]) {
                    queries[query._id] = query;
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
        });
        in_when_pouchdb_queries_changes = false;
    }
};


