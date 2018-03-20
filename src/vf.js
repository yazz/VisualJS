var http = require("http");
var ip   = require("ip");

var hostaddress = ip.address();

var options = {
  host: hostaddress,
  port: 80,
  path: '/test',
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
