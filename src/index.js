'use strict';

var url         = require('url');
var path        = require('path');
var http        = require('http');
var fs          = require('fs');
var unzip       = require('unzip');
var postgresdb  = require('pg');
var useOracle   = false;
var program     = require('commander');
var drivers     = new Object();
var connections = new Object();
var express     = require('express')
var app         = express()
var timeout     = 0;

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
path.join(__dirname, '../public/vue.min.js')
path.join(__dirname, '../public/vue.js')
path.join(__dirname, '../public/vuex.min.js')
path.join(__dirname, '../public/vuex.js')
path.join(__dirname, '../src/oracle.js')
path.join(__dirname, '../src/postgres.js')
path.join(__dirname, '../public/vue_components.js')
path.join(__dirname, '../public/vue_store.js')
path.join(__dirname, '../public/vue_setup.js')
path.join(__dirname, '../public/blockly_setup.js')
path.join(__dirname, '../public/tether.min.js')
path.join(__dirname, '../public/bootstrap.min.js')
path.join(__dirname, '../public/bootstrap.min.css')
path.join(__dirname, '../public/es6-shim.js')
path.join(__dirname, '../public/vue_app.css')
path.join(__dirname, '../public/components/connections_table.js')
path.join(__dirname, '../public/components/yazz_new_connection.js')
path.join(__dirname, '../public/components/oracle_view_connection.js')
path.join(__dirname, '../public/components/postgres_view_connection.js')
path.join(__dirname, '../public/components/oracle_add_connection.js')
path.join(__dirname, '../public/components/postgres_add_connection.js')
path.join(__dirname, '../public/dist/build.js')
path.join(__dirname, '../oracle_driver.zip')

function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

var type;
program
  .version('0.0.1')
  .option('-t, --type [type]', 'Add the specified type of app [type]', 'client')
  .option('-p, --port [port]', 'Which port should I listen on? [port]', parseInt)
  .option('-h, --host [host]', 'Server address of the central host [host]', 'yazz.com')
  .option('-s, --hostport [hostport]', 'Server port of the central host [hostport]', parseInt)
  .parse(process.argv);

  var port = program.port;
  if (!isNumber(port)) {port = 80;};
  var typeOfSystem = program.type;


  if (!(typeOfSystem == 'client' || typeOfSystem == 'server')) {
      console.log('-------* Invalid system type: ' + typeOfSystem);
      process.exit();
  };
  console.log('-------* System type: ' + typeOfSystem);
  console.log('-------* Port: ' + port);


var ip = require("ip");
console.dir ( ip.address() );

console.log('addr: '+ ip.address());
var hostaddress = ip.address();

var ip = process.env.OPENSHIFT_NODEJS_IP || '' + hostaddress;















//------------------------------------------------------------
// copy the oracle files if they exist
//------------------------------------------------------------
if (fs.existsSync(path.join(__dirname, '../oracle_driver.zip'))) {
    useOracle = true;
}
if (useOracle) {
    if (!fs.existsSync(process.cwd() + '\\oracle_driver\\instantclient32')) {
      fs.createReadStream(path.join(__dirname, '../oracle_driver.zip')).pipe(unzip.Extract({ path: process.cwd() + '\\.' }));
      timeout = 3000;
      console.log('Creating oracle_driver');
    } else {
      console.log('oracle_driver already exists');
    };
}
var toeval = fs.readFileSync(path.join(__dirname, './oracle.js')).toString();
if (useOracle) {
    process.env['PATH'] = process.cwd() + '\\oracle_driver\\instantclient32' + ';' + process.env['PATH'];
}



//------------------------------------------------------------
// postgres
//------------------------------------------------------------
var pgeval = fs.readFileSync(path.join(__dirname, './postgres.js')).toString();




//------------------------------------------------------------
// wait three seconds for stuff to initialize
//------------------------------------------------------------
setTimeout(startYazz, timeout);
console.log('Creating timeout: ' + timeout);


//------------------------------------------------------------
// wait three seconds for stuff to initialize
//------------------------------------------------------------
function startYazz() {
  //
  // start the server
  //
  var Gun = require('gun');
  var gun = Gun({
    file: 'data.json',
    s3: {
      key: '', // AWS Access Key
      secret: '', // AWS Secret Token
      bucket: '' // The bucket you want to save into
    }
  });

  var  init_drivers = false;
  gun.wsp(app);

  console.log(typeOfSystem + ' started on port ' + port + ' with /gun');





  app.get('/', function (req, res) {
      if (!init_drivers) {
        init_drivers = true;
        if (useOracle) {
             eval(toeval);
        }
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

  app.get('/getresult', function (req, res) {
    var queryData = url.parse(req.url, true).query;
    //console.log('request received: ' + queryData.sql);
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




  app.listen(port, hostaddress, function () {
    console.log('Example app listening on port ' + port + '!')
  })












  //
  // open the app in a web browser
  //
  //console.log('Ran postgres too');



  var open = require('open');

  open('http://' + hostaddress  + ":" + port);


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
  gun.get("connections").on().map(function(a,b){
    delete a["_"];
    if (!connectionrows[a.id]) {
      //data_connections_list.push(a);
      connectionrows[a.id] = a;
      //console.log(a);
      connections[a.id] = a;
    }

  },true);

}
