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
var gun          = Gun({ file: 'data.json',
                          s3: {
                            key: '', // AWS Access Key
                            secret: '', // AWS Secret Token
                            bucket: '' // The bucket you want to save into
                          }
                        });
var parseSqlFn = require('node-sqlparser').parse;






path.join(__dirname, '../public/blockly/blockly_compressed.js')
path.join(__dirname, '../public/blockly/blocks_compressed.js')
path.join(__dirname, '../public/yazz_blockly_blocks.js')
path.join(__dirname, '../public/yazz_blockly_generator.js')
path.join(__dirname, '../public/yazz_blockly_output_code.js')
path.join(__dirname, '../public/blockly/msg/js/en.js')
path.join(__dirname, '../public/jquery-1.9.1.min.js')
path.join(__dirname, '../public/jquery.zoomooz.js')
path.join(__dirname, '../public/blockly_helper.js')
path.join(__dirname, '../public/blockly.png')
path.join(__dirname, '../public/polyfill.min.js')
path.join(__dirname, '../src/oracle.js')
path.join(__dirname, '../src/postgres.js')
path.join(__dirname, '../public/blockly_setup.js')
path.join(__dirname, '../public/tether.min.js')
path.join(__dirname, '../public/bootstrap.min.js')
path.join(__dirname, '../public/bootstrap.min.css')
path.join(__dirname, '../public/es6-shim.js')
path.join(__dirname, '../public/vue_app.css')
path.join(__dirname, '../public/dist/build.js')
path.join(__dirname, '../oracle_driver.zip')
path.join(__dirname, '../public/sql.js')
path.join(__dirname, '../public/gosharedata_logo.PNG')
path.join(__dirname, '../public/favicon.ico')





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
  dbhelper.realtimeSql("SELECT * FROM Customers where Age > 8");
//zzz
  dbhelper.realtimeSql("select * from db_connections where deleted != 'T'"
    ,function(results) {
        //console.log("select * from db_connections where deleted != 'T'")
        for (var i = 0 ; i < results.length ; i ++) {
            var conn = results[i]

            //console.log("    " + JSON.stringify(conn, null, 2))
            if (!connectionrows[conn.name]) {
              //data_connections_list.push(a);
              connectionrows[conn.name] = conn;
              //console.log(a);
              connections[conn.name] = conn;
            }
        }

    })


  //------------------------------------------------------------------------------
  // Show the default page
  //------------------------------------------------------------------------------
    app.get('/', function (req, res) {
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









//------------------------------------------------------------------------------
// Get the result of a SQL query
//------------------------------------------------------------------------------
  app.get('/getresult', function (req, res) {
    var queryData = url.parse(req.url, true).query;
    //console.log('request received source: ' + queryData.source);
    //console.log('request received SQL: ' + queryData.sql);
    if (connections[queryData.source]) {
        //console.log('query driver: ' + connections[queryData.source].driver);
        drivers[connections[queryData.source].driver]['get'](connections[queryData.source],queryData.sql,function(ordata) {
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end(JSON.stringify(ordata));
        });
    } else {
        console.log('query driver not found: ' + connections[queryData.source]);
    };
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
                    version:      30
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


    //TODO
    // add the host to a list here
})



//------------------------------------------------------------------------------
// start the web server
//------------------------------------------------------------------------------
app.listen(port, hostaddress, function () {
    console.log('GunDB listening on port ' + port + '!' + ' with /gun')
    console.log(typeOfSystem + ' started on port ' + port );
})












  //--------------------------------------------------------
  // open the app in a web browser
  //--------------------------------------------------------
  //open('http://' + hostaddress  + ":" + port);
  console.log('http://' + hostaddress  + ":" + port);


  //process.env['PATH'] = path.join(__dirname, '/instantclient') + ';' + process.env['PATH'];
  //var oracledb = require('oracledb');
  //console.log('Start oracle');

  //eval("oracledb= require('oracledb');");


  console.log('addr: '+ hostaddress + ":" + port);


  //console.log(toeval);
  //setTimeout(function(){eval(toeval)},1000);

  //  console.log('Done.');




  console.log("*********** CHECKING CONNECTIONS *****************8");
  var connectionrows        = new Object();
  /*gun.get("connections").map(function(a,b){
    delete a["_"];
    if (!connectionrows[a.id]) {
      //data_connections_list.push(a);
      connectionrows[a.id] = a;
      //console.log(a);
      connections[a.id] = a;
    }

},true);*/





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
                console.log(body);
            });
    }






    console.log("******************************ADDING DRIVERS*********************************")




    var pgeval = '(' + fs.readFileSync(path.join(__dirname, './postgres.js')).toString() + ')';
    drivers['postgres'] = eval( pgeval )
    addOrUpdateDriver('postgres', pgeval, drivers['postgres'])





    toeval =  '(' + fs.readFileSync(path.join(__dirname, './oracle.js')).toString() + ')';
    drivers['oracle']   = eval( toeval )
    addOrUpdateDriver('oracle',   toeval, drivers['oracle'])
    if (drivers['oracle'].loadOnCondition()) {
        drivers['oracle'].loadDriver()
    }



    var tdeval = '(' + fs.readFileSync(path.join(__dirname, './testdriver.js')).toString() + ')';
    drivers['TestDriver'] = eval(tdeval)
    addOrUpdateDriver('TestDriver', tdeval, drivers['TestDriver'])


////dbhelper.sql("insert into drivers (name,code,driver_type) values (?,?,?)",            ['a', 'b', 'c'])
//dbhelper.sql("update drivers set type = '...2' where name = 'TestDriver'")
dbhelper.sql("select * from drivers where name = 'TestDriver' ")
//dbhelper.sql("select * from drivers ")


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
                        console.log("******************************desired type = " + JSON.stringify(driverType , null, 2))
                        //console.log("******************************set driver type = " + JSON.stringify(driverType , null, 2))
                        //console.log("******************************for name = " + JSON.stringify(name , null, 2))
                        var sqlToRun = "update drivers set type = '" + driverType + "' where  name = '" + name + "'";


                        console.log("******************************SQL  = " + JSON.stringify(sqlToRun , null, 2))
                        dbhelper.sql(sqlToRun, function(ack) {
                            console.log("******************************SQL Done  = " + JSON.stringify(sqlToRun , null, 2))
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
}
