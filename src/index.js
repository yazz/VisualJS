'use strict';

//
// setup
//

var path = require('path');
var http = require('http');
var fs = require('fs');

//path.join(__dirname, 'asset');
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



var ip = require("ip");
console.dir ( ip.address() );

console.log('addr: '+ ip.address());
var hostaddress = ip.address();

var ip = process.env.OPENSHIFT_NODEJS_IP || '' + hostaddress;





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

var gunserver = http.createServer(function(req, res){
  if(gun.wsp.server(req, res)){
    return; // filters gun requests!
  }
  console.log('HTTP: ' + req.url);
  fs.createReadStream(path.join(__dirname, '../public/' + req.url)).on('error',function(){ // static files!
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(fs.readFileSync(path.join(__dirname, '../public/index.html'))); // or default to index
  }).pipe(res); // stream
});
gun.wsp(gunserver);
gunserver.listen(80, ip);

console.log('Server started on port 80 with /gun');






//process.env['PATH'] = path.join(__dirname, '/instantclient') + ';' + process.env['PATH'];
//var oracledb = require('oracledb');


console.log('Start oracle');










gun.get("test").path("set").set({id: 1});
gun.get("test").path("set").set({id: 2});
gun.get("test").path("set").set({id: 3});
gun.get("test").path("set").set({id: 4});
gun.get("test").path("set").set({id: 5});
gun.get("test").path("set").set({id: 6});

gun.get("test").path("set").map(function(a,b){
  console.log("-----------------------------" + a.id);
});





//
// open the app in a web browser
//
console.log('Ran postgres too');



//var open = require('open');

//open('http://' + hostaddress);
console.log('addr: '+ hostaddress);
