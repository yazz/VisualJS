var http        = require("http");
var ip          = require("ip");
var request     = require("request");
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
//console.log("Connecting to: " + useHost + ":" + usePort);


//console.log (process.argv)
if (!firstArg) {
    console.log(`
        Welcome to VisiFile

        Command available are:

        - test.
        - ls.
        `)


} else if (firstArg == 'ls') {
    var serversToTry = [
                           "visifile.com"  ,
                           ip.address() + ":" +  80,
                           ip.address() + ":" +  3000,
                           "127.0.0.1:80"
                       ]

    lsFn(serversToTry, 0, function(serversReturned) {
        console.log(JSON.stringify(serversReturned,null,2))
    })

} else {
    process.argv.unshift(firstArg)
    //options.query.a = process.argv

    var args = process.argv

    //console.log("Args JSON: " + JSON.stringify(args,null,2))

    var args2 = encodeURI(JSON.stringify(args))
    //console.log("Args seralized: " + args2)

    var options = {
      host: useHost,
      port: usePort,
      path: '/vf?a=' + args2,
      method: 'GET'
    };


    var req = http.request(options, function(res) {
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
          var result = JSON.parse(chunk)
        console.log(result.OK);
      });
    });

    req.on('error', function(e) {
      console.log('problem with request: ' + e.message);
    });


    req.end();
}




function serialize(obj) {
  var str = [];
  for (var p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    }
  return str.join("&");
}








function lsFn(servers, index, callbackFn) {
    console.log("Trying lookup server: " + servers[index])

    var remoteServerUrl =   'http://' + servers[index]  +
                            "/get_intranet_servers?time=" + new Date().getTime();

    request({
        uri: remoteServerUrl,
        method: "GET",
        timeout: 10000,
        agent: false,
        followRedirect: true,
        maxRedirects: 10
  },
  function(error, response, body) {
      var servers2 = servers
      if (error) {
          console.log("Error opening central server: " + error);
          var nextIndex = index + 1
          if (nextIndex < servers2.length) {
              lsFn(servers2, index + 1, callbackFn)
          }
    } else {
        var servers2 = []
        var returned= eval( "(" + body + ")");
        for (var i = 0 ; i < returned.allServers.length; i++) {
            //console.log('got server ' + i)
            //console.log(JSON.stringify(returned.allServers[i],null,2))
            var tt = new Object();
            tt.username = returned.allServers[i].client_user_name;
            tt.internal_host = returned.allServers[i].internal_host;
            tt.internal_port = returned.allServers[i].internal_port;
            tt.via           = returned.allServers[i].via;
            servers2.push(tt)
        };
        callbackFn(servers2)

    }
  });


}
