var http = require("http");
var ip   = require("ip");

var hostaddress = ip.address();



// remove the first two elements as they contain the node and vf commands
//process.argv.pop()
//process.argv.pop()


process.argv.shift()
process.argv.shift()
var firstArg =  process.argv.shift()

var useHost = hostaddress
var usePort = 80
if (firstArg == '--host') {
    useHost = process.argv.shift()
    usePort = process.argv.shift()
    firstArg =  process.argv.shift()
}
console.log("Connecting to: " + useHost + ":" + usePort);

var options = {
  host: useHost,
  port: usePort,
  path: '/test',
  method: 'GET'
};

//console.log (process.argv)
if (!firstArg) {
    console.log('Welcome to VF')



} else if (firstArg == 'test') {

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
} else if (firstArg == 'ls') {
    options.path = '/ls'
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
} else if (firstArg == 'zubair') {
    options.path = '/zubair'
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
