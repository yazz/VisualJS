var http = require("http");
var ip   = require("ip");

var hostaddress = ip.address();

var options = {
  host: hostaddress,
  port: 80,
  path: '/test',
  method: 'GET'
};



//console.log (process.argv)
if (process.argv.length == 2) {
    console.log('Welcome to VF')
} else if (process.argv[2] == 'test') {

    var req = http.request(options, function(res) {
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
        console.log(chunk);
      });
    });

    req.on('error', function(e) {
      console.log('problem with request: ' + e.message);
    });


    req.end();
} else if (process.argv[2] == 'ls') {
    options = {
      host: hostaddress,
      port: 80,
      path: '/ls',
      method: 'GET'
    };
    var req = http.request(options, function(res) {
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
        console.log(chunk);
      });
    });

    req.on('error', function(e) {
      console.log('problem with request: ' + e.message);
    });


    req.end();
}
