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

var useHost = null;
var usePort = 80
if (firstArg == '--host') {
    useHost = process.argv.shift()
    firstArg =  process.argv.shift()
}
//console.log("Connecting to: " + useHost + ":" + usePort);


//console.log (process.argv)
if (!firstArg) {
    console.log(`
VisiFile commands:

> vf
This command. Enter this to see this menu. If you are a developer
then you may have enter "vf" as "node src/vf.js"


> vf test
See if VisiFile is installed on your local computer on port 80


> vf ls
See which computers have VisiFile installed on them. Example
output may be:
User: root, 192.168.0.101:80
: in which case you can:
1) enter "vf start" at the command prompt to find the main server
2) enter 192.168.0.101:80 into a web Browser to view VisiFile
3) enter 192.168.0.101:80/main into a Rest API client such as Postman
4) enter "vf --host 192.168.0.101:80 drivers" to connect direct to a server


> vf drivers
Show the available drivers


> vf --host 192.168.0.101:80 drivers
Show the drivers on the machine located at 192.168.0.101:80


> vf home
Show the main details of the running VisiFile
`)


} else if (firstArg == 'ls') {

    getListOfHosts(function(serversReturned) {
        if (serversReturned.length == 0) {
            console.log("No VisiFile Servers started on your Intranet")
        } else {
            for (var x = 0; x < serversReturned.length ; x++) {
                console.log("User: "+serversReturned[x].username + ", " + serversReturned[x].internal_host + ":"+serversReturned[x].internal_port)
            }
        }
    })



} else if (firstArg == 'start') {
    findMainServer(function(ret) {
        if (ret.status == 'error') {
            console.log("No main VisiFile Server as none running on your Intranet")
        } else {
            console.log(ret.name.username + " - " + ret.name.internal_host + ":" + ret.name.internal_port)
        }
    })


} else {
    process.argv.unshift(firstArg)
    //options.query.a = process.argv

    var args = process.argv

    //console.log("Args JSON: " + JSON.stringify(args,null,2))

    var args2 = encodeURI(JSON.stringify(args))
    //console.log("Args seralized: " + args2)

//zzz
    if (useHost) {
        callVf(extractHostname(serverAddress), getPort(useHost))


    } else {
        findMainServer(function(ret) {
            if (ret.status == 'error') {
                console.log("No main VisiFile Servers found on your Intranet. Use --host option to manually specify a host")
            } else {
                console.log(ret.name.username + " - " + ret.name.internal_host + ":" + ret.name.internal_port)
                callVf(ret.name.internal_host, ret.name.internal_port)
            }
        })
    }


}



function callVf(serverAddress, serverPort) {
    var options = {
      host: serverAddress,
      port: serverPort,
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
    //console.log("Trying lookup server: " + servers[index])

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


function extractHostname(url) {
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


function getPort(url) {
    url = url.match(/^(([a-z]+:)?(\/\/)?[^\/]+).*$/)[1] || url;
    var parts = url.split(':'),
        port = parseInt(parts[parts.length - 1], 10);
    if(parts[0] === 'http' && (isNaN(port) || parts.length < 3)) {
        return 80;
    }
    if(parts[0] === 'https' && (isNaN(port) || parts.length < 3)) {
        return 443;
    }
    if(parts.length === 1 || isNaN(port)) return 80;
    return port;
}


function findMainServer(callbackFn) {

    getListOfHosts(function(serversReturned) {
        if (serversReturned.length == 0) {
            callbackFn({status: "error"})
        } else {
            var mainServer = serversReturned[0]

            for (var x = 1; x < serversReturned.length ; x++) {
                if (serversReturned[x].internal_host == hostaddress) {
                     mainServer = serversReturned[x]
                }
            }
            callbackFn({status: "OK", name: mainServer})

        }
    })
}


function getListOfHosts(callbackFn) {
    var serversToTry = [
                           "visifile.com"  ,
                           ip.address() + ":" +  80,
                           ip.address() + ":" +  3000,
                           "127.0.0.1:80"
                       ]

    lsFn(serversToTry, 0, function(serversReturned) {
        callbackFn(serversReturned)
    })
}
