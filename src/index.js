'use strict';

var url          = require('url');
var path         = require('path');
var http         = require('http');
var fs           = require('fs');
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
var Gun          = require('gun');
var parseSqlFn = require('node-sqlparser').parse;
var witheve = require("witheve");
var Excel = require('exceljs');
const drivelist = require('drivelist');
var isWin = /^win/.test(process.platform);


if (!fs.existsSync(process.cwd() + "/node_modules_win32") ) {
	
				
    copyFolderRecursiveSync(path.join(__dirname, "../node_modules_win32")  , process.cwd());
    fs.renameSync(
				process.cwd() + "/node_modules_win32/sqlite3/lib/binding/node-v48-win32-ia32/node_sqlite3.noderename",
				
	    		process.cwd() + "/node_modules_win32/sqlite3/lib/binding/node-v48-win32-ia32/node_sqlite3.node") ;
}
var sqlite3   = eval('require(process.cwd() + "/node_modules_win32/sqlite3");');

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

  							dbhelper.sql(`insert into
  									  db_connections
  									  (
  										  id
  										  ,
  										  name
  										  ,
  										  driver
  										  ,
  										  fileName
  									  )
  								  values
  									  (? , ? , ? , ?)`
  								  ,
  								  [
  										fileId
  										,
  										fileId
  										,
  										'excel'
  										,
  										excelFile
  								  ]
  							);

  							dbhelper.sql(`insert into
  									  queries
  									  (
										  id,
										  name,
										  connection,
										  driver,
										  type,
										  definition,
										  preview
  									  )
  								  values
  									  (?, ? , ? , ? , ?, ?, ?)`
  								  ,
  								  [
									  fileId,
									  fileId,
									  fileId,
									  'excel',
									  '|SPREADSHEET|',
									  JSON.stringify({} , null, 2),
                    JSON.stringify([{message: 'No preview available'}] , null, 2)
  								  ]
  							);
						}
					}
		  if (isCsvFile(file)) {
        console.log('CSV file: ' + file);
  					var CSVFile = file;
  						if (typeof CSVFile !== "undefined") {
							var fileId = CSVFile.replace(/[^\w\s]/gi,'');
  							console.log('   *file id: ' + fileId);

  							dbhelper.sql(`insert into
  									  db_connections
  									  (
  										  id
  										  ,
  										  name
  										  ,
  										  driver
  										  ,
  										  fileName

  									  )
  								  values
  									  (? , ? , ? , ?)`
  								  ,
  								  [
  										fileId
  										,
  										fileId
  										,
  										'csv'
  										,
  										CSVFile
  								  ]
  							);

  							dbhelper.sql(`insert into
  									  queries
  									  (
										  id,
										  name,
										  connection,
										  driver,
										  type,
										  definition,
										  preview
  									  )
  								  values
  									  (? , ? , ? , ?, ?, ?, ?)`
  								  ,
  								  [
									  fileId,
									  fileId,
									  fileId,
									  'csv',
									  '|CSV|',
									  JSON.stringify({} , null, 2),
                    JSON.stringify([{message: 'No preview available'}] , null, 2)
  								  ]
  							);
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
path.join(__dirname, '../public/tether.min.js')
path.join(__dirname, '../public/bootstrap.min.js')
path.join(__dirname, '../public/bootstrap.min.css')
path.join(__dirname, '../public/es6-shim.js')
path.join(__dirname, '../public/vue_app.css')
path.join(__dirname, '../public/dist/build.js')
//path.join(__dirname, '../oracle_driver.zip')
path.join(__dirname, '../public/sql.js')
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





function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}



program
  .version('0.0.1')
  .option('-t, --type [type]', 'Add the specified type of app [type]', 'client')
  .option('-p, --port [port]', 'Which port should I listen on? [port]', parseInt)
  .option('-h, --host [host]', 'Server address of the central host [host]', 'gosharedata.com')
  .option('-s, --hostport [hostport]', 'Server port of the central host [hostport]', parseInt)
  .parse(process.argv);

  port = program.port;
  if (!isNumber(port)) {port = 80;};
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
  var gun          = Gun({ file: storageFileName,
                            s3: {
                              key: '', // AWS Access Key
                              secret: '', // AWS Secret Token
                              bucket: '' // The bucket you want to save into
                            }
                          });



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
  //
  // start the server
  //
  gun.wsp(app);


  dbhelper.setGunDB(gun)
  dbhelper.setGunDBClass(Gun)
  dbhelper.setSqlParseFn(parseSqlFn)
  //dbhelper.sql('select * from servertable where a.s = 1', null)
  //dbhelper.sql("SELECT age, name FROM Customers");
  //dbhelper.realtimeSql("SELECT * FROM Customers where Age > 8");

  dbhelper.realtimeSql("select * from db_connections where deleted != 'T'"
    ,function(results) {
        //console.log("select * from db_connections where deleted != 'T'")
        for (var i = 0 ; i < results.length ; i ++) {
            var conn = results[i]

			//console.log("***************select * from db_connections where deleted != 'T'")
            //console.log("    " + JSON.stringify(conn, null, 2))
            if (!connections[conn.name]) {
              //console.log(a);
              connections[conn.name] = conn;
            }
        }

    })


  dbhelper.realtimeSql("select * from queries where deleted != 'T'"
    ,function(results) {
        for (var i = 0 ; i < results.length ; i ++) {
            var query = results[i];
			//console.log("***************select * from db_connections where deleted != 'T'")
            //console.log("    " + JSON.stringify(conn, null, 2))
            if (!queries[query.name]) {
              //console.log(a);
              queries[query.name] = query;
			  //if (query.preview == []) {
							var oout = [{a: 'no EXCEL'}];
							try {
								console.log('*************************************************************************');
								console.log('     query.id : ' + query.id);
								console.log('     query.connection : ' + query.connection);
								console.log('     query.driver : ' + query.driver);
								console.log('     query.definition : ' + query.definition);
								var restrictRows = JSON.parse(query.definition);
								restrictRows.maxRows = 10;
									drivers[query.driver]['get_v2'](connections[query.connection],restrictRows,
									function(ordata) {
										//console.log('********* ' + JSON.stringify(ordata));
											dbhelper.sql("update queries set  preview = ? where id = '" + query.id +  "'"
												  ,
												  [
													  JSON.stringify(ordata, null, 2),
													  query.id
												  ]
											);
									});
							} catch (err) {

						}

				//}
			}
        }

    })



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
				{Location: 'http://gosharedata.com/gosharedata'}
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
		dbhelper.sql("insert into client_connect (internal_host, internal_port, public_ip, public_host) values (?,?,?,?)",
			  [requestClientInternalHostAddress,requestClientInternalPort,requestClientPublicIp,requestClientPublicHostName])

		dbhelper.sql("select * from client_connect", function(aa){console.log("**********" + JSON.stringify(aa.length))});
		dbhelper.sql("select * from client_connect", function(aaa){  var aa;for (aa in aaa) {console.log(aaa[aa].internal_host + ", " + aaa[aa].internal_port + ", " + aaa[aa].public_ip )}});

		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.end(JSON.stringify({connected: true}));
	}
	catch (err) {
		console.log('Warning: Central server not available:');
	}

})







//------------------------------------------------------------------------------
// start the web server
//------------------------------------------------------------------------------
app.listen(port, hostaddress, function () {
    console.log('GunDB listening on port ' + port + '!' + ' with /gun')
    console.log(typeOfSystem + ' started on port ' + port );
})








  console.log('addr: '+ hostaddress + ":" + port);






    if (typeOfSystem == 'client') {
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











    //console.log("************************************************ ")
    //console.log("******************************Doing Eve stuff ")
    //console.log("************************************************ ")
    let eve = new witheve.Program("program name");

    let inputs = [];
    //console.log(JSON.stringify(Object.keys(eve) , null, 2))
    var vv = 0
    /*setInterval(function() {
        console.log("--Tick ")
        let newinputs = [];
        witheve.appendAsEAVs(newinputs, {tag: "student", name: "Zubair " + vv});
        eve.inputEAVs(newinputs);
        vv ++
    }, 1000)


    eve.watch("Export information about students", function(arg) {
        console.log("--Eve Export information ")
      // search for records tagged student
      let student = arg.find("student");
      let eav = arg.lookup(student);
      return [
          // Add these attributes and values to the student, creating a diff to which we can react
          student.add(eav.attribute, eav.value)
      ];

    }).asDiffs(function(diff)  {
          console.log("--Eve in adDiffs ")
          for(let [e, a, v] of diff.adds) {
            console.log("--Eve add " + JSON.stringify(e , null, 2) + ", " + JSON.stringify(a , null, 2) + JSON.stringify(v , null, 2))
          }
          for(let [e, a, v] of diff.removes) {
              console.log("--Eve remove " + JSON.stringify(e , null, 2) + ", " + JSON.stringify(a , null, 2) + JSON.stringify(v , null, 2))
          }
        });;
        witheve.appendAsEAVs(inputs, {tag: "student", name: "Archibald"});
        witheve.appendAsEAVs(inputs, {tag: "student", name: "Zubair"});
        eve.inputEAVs(inputs);*/

    //console.log("************************************************ ")
    //console.log("******************************finished Eve stuff ")
    //console.log("************************************************ ")


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




function addOrUpdateDriver(name, code, theObject) {
    console.log("******************************addOrUpdateDriver ")
    console.log("       name = " + name)
    //console.log("       code = " + JSON.stringify(code , null, 2))
    var driverType = theObject.type;
    //console.log("******************************driver type= " + driverType)
    //console.log("******************************driver= " + JSON.stringify(theObject , null, 2))
    dbhelper.sql("select * from drivers where name = '" +  name +  "' ",
        function(records) {
            console.log("******************************records = " + records.length  )
            if(records.length > 0) {
                for (var record of records) {
                    dbhelper.sql("update drivers set code = ?  where name = '" + name + "'",  [code])
                    if (typeof driverType === 'string' || driverType instanceof String) {
                        console.log("******************************UPDATE DRIVER "+name)
                        //console.log("******************************record type = " + JSON.stringify(record.type , null, 2))
                        //console.log("******************************desired type = " + JSON.stringify(driverType , null, 2))
                        //console.log("******************************set driver type = " + JSON.stringify(driverType , null, 2))
                        //console.log("******************************for name = " + JSON.stringify(name , null, 2))
                        var sqlToRun = "update drivers set type = '" + driverType + "' where  name = '" + name + "'";


                        //console.log("******************************SQL  = " + JSON.stringify(sqlToRun , null, 2))
                        dbhelper.sql(sqlToRun, function(ack) {
                            //console.log("******************************SQL Done  = " + JSON.stringify(sqlToRun , null, 2))
                        })
                        //dbhelper.sql("update drivers set type = '...' where name = 'TestDriver'")
                    }
                }
            } else {
                console.log("******************************INSERT DRIVER "+name)
                dbhelper.sql("insert into drivers (name,code,type) values (?,?,?)",            [name, code, driverType])

            }
        })
}



//console.log("postgres.get = " + JSON.stringify(eval(pgeval) , null, 2))
//console.log("postgres.get = " + eval(pgeval).get)
//--------------------------------------------------------
// open the app in a web browser
//--------------------------------------------------------


if (typeOfSystem == 'client') {
  open('http://' + hostaddress  + ":" + port);
} else if (typeOfSystem == 'server') {
  open('http://' + hostaddress  + ":" + port + "/index_server.html");
}
console.log('http://' + hostaddress  + ":" + port);

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
				console.log('copying :' + targetFolder);
            }
        } );
    }
}