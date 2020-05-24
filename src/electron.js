#!/usr/bin/env node


// Module to control application life.
// Module to create native browser window.
var startNodeServer = false
const path = require("path");
const url = require('url');
var fork            = require('child_process');
var fs = require('fs');
var ip = require('ip');
var isWin         = /^win/.test(process.platform);
var isLinux       = /^linux/.test(process.platform);
var isMac       = /^darwin/.test(process.platform);
var mainNodeProcessStarted = false;
var restRoutes = new Object()
var envVars = new Object()
var systemReady = false;


var ls = require('ls-sync');
var rimraf = require("rimraf");

var pidusage        = require("pidusage");
var fs              = require('fs');
var mkdirp          = require('mkdirp')
var rmdir           = require('rmdir-sync');
var uuidv1          = require('uuid/v1');
var fork            = require('child_process');
var express         = require('express')
var http            = require('http')
var https           = require('https');
var app             = express()
var isTty           = false



var expressWs       = require('express-ws')(app);
outputDebug("__filename: " + __filename)
outputDebug("__dirname: " + __dirname)


outputDebug("Platform: " + process.platform)

if (isWin)  {
    outputDebug("Creating Windows driver")
  mkdirp.sync('node_modules\\sqlite3\\lib/binding\\node-v72-win32-x64');
  var srcNodeJsFile = path.join(__dirname,'..\\node_sqlite3_win64.rename')
  outputDebug("srcNodeJsFile: " + srcNodeJsFile)
  fs.copyFileSync(
      srcNodeJsFile,
      path.join(__dirname,'..\\node_modules\\sqlite3\\lib\\binding\\node-v72-win32-x64\\node_sqlite3.node'),
                      );




} else if (isLinux) {
    outputDebug("Creating Linux driver")
    mkdirp.sync('node_modules/sqlite3/lib/binding/node-v64-linux-x64');
  var srcNodeJsFile = path.join(__dirname,'../node_sqlite3_linux64.rename')
  outputDebug("srcNodeJsFile: " + srcNodeJsFile)
  fs.copyFileSync(
      srcNodeJsFile,
      path.join(__dirname,'../node_modules/sqlite3/lib/binding/node-v64-linux-x64/node_sqlite3.node'),
                      );





} else if (isMac) {
    outputDebug("Creating Mac driver")
    mkdirp.sync('node_modules/sqlite3/lib/binding/node-v64-darwin-x64');

    var srcNodeJsFile = path.join(__filename,'../../node_sqlite3_macos64.rename')
    outputDebug("srcNodeJsFile: " + srcNodeJsFile)
    fs.copyFileSync(
        srcNodeJsFile,
        path.join(__dirname,'../node_modules/sqlite3/lib/binding/node-v64-darwin-x64/node_sqlite3.node'),
                        );




} else {
    outputDebug("Error, unsupported platform: " + process.platform)
}





var request         = require("request");
var db_helper       = require("./db_helper")
var perf            = require('./perf')
var compression     = require('compression')
var dns             = require('dns');

var program         = require('commander');
var bodyParser      = require('body-parser');
var multer          = require('multer');
var cors            = require('cors')
var saveHelper      = require('./save_helpers')
var isDocker        = require('is-docker');

var sqlite3                     = require('sqlite3');


var os              = require('os')
var username                            = "Unknown user";

var Keycloak =      require('keycloak-connect');
var session =       require('express-session');
var memoryStore = new session.MemoryStore();

var kk = {
  "realm":              "yazz",
  "auth-server-url":    "http://127.0.0.1:8080/auth",
  "ssl-required":       "external",
  "resource":           "yazz",
  "public-client":       true,
  "confidential-port":   0
}

var sessObj     = session({
                      secret:               'some secret',
                      resave:                false,
                      saveUninitialized:     true,
                      store:                 memoryStore
                    })


var keycloak    = new Keycloak({
                        store: memoryStore
                    },kk);






var upload

var dbPath = null

var dbsearch = null
var userData = null

var port;
var hostaddress;
hostaddress = "0.0.0.0"//ip.address();
var hostaddressintranet;
hostaddressintranet = ip.address();
port = 80
var f = 0
var started = false

var visifile
var socket          = null


var io = null;
var forkedProcesses = new Object();
var timeout                             = 0;
var port;
var typeOfSystem;
var centralHostAddress;
var centralHostPort;

var stmt2                               = null;
var stmt3                               = null;
var setIn                               = null;
var stopScan                            = false;
var inScan                              = false;
var numberOfSecondsAliveCheck           = 60;
var serverwebsockets                    = [];
var portrange                           = 3000
var requestClientInternalHostAddress    = '';
var requestClientInternalPort           = -1;
var requestClientPublicIp               = '';
var requestClientPublicHostName         = '';
var locked;
var useHttps;
var serverProtocol                       = "http";
var privateKey;
var publicCertificate;
var caCertificate1;
var caCertificate2;
var caCertificate3;
var requestClientPublicIp;
var hostcount  							= 0;
var queuedResponses                     = new Object();
var queuedResponseSeqNum                = 1;
var executionProcessCount                       = 6;











app.use(compression())
app.use(sessObj);


app.use(keycloak.middleware({
          logout: '/c',
          admin: '/ad'
}));


var inmemcalc = false
var totalMem = 0
var returnedmemCount = 0
var allForked=[]
const apiMetrics = require('prometheus-api-metrics');
app.use(apiMetrics())
const Prometheus = require('prom-client');

const yazzMemoryUsageMetric = new Prometheus.Gauge({
  name: 'yazz_total_memory_bytes',
  help: 'Total Memory Usage'
});
const yazzProcessMainMemoryUsageMetric = new Prometheus.Gauge({
  name: 'yazz_node_process_main_memory_bytes',
  help: 'Memory Usage for Yazz NodeJS process "main"'
});




var stdin = process.openStdin();

var inputStdin = "";

stdin.on('data', function(chunk) {
  inputStdin += chunk;
});

stdin.on('end', function() {
    isTty = true
});




if (process.argv.length > 1) {

    program
      .version('0.0.1')
      .option('-t, --type [type]', 'Add the specified type of app (client/server) [type]', 'client')
      .option('-p, --port [port]', 'Which port should I listen on? (default 80) [port]', parseInt)
      .option('-h, --host [host]', 'Server address of the central host (default yazz.com) [host]', 'yazz.com')
      .option('-l, --locked [locked]', 'Allow server to be locked/unlocked on start up (default true) [locked]', 'true')
      .option('-d, --debug [debug]', 'Allow to run NodeJS in debug mode (default false) [debug]', 'false')
      .option('-z, --showdebug [showdebug]', 'Allow to show debug info (default false) [showdebug]', 'false')
      .option('-k, --showprogress [showprogress]', 'Allow to show progress when starting Pilot (default false) [showprogress]', 'false')
      .option('-j, --showstats [showstats]', 'Allow to show stats debug info (default false) [showstats]', 'false')
      .option('-i, --statsinterval [statsinterval]', 'Allow to show debug info every x seconds (default 10 seconds) [statsinterval]', 10)
      .option('-a, --virtualprocessors [virtualprocessors]', 'How many virtual processors to run (default 6 processors) [virtualprocessors]', 6)
      .option('-m, --maxprocessesretry [maxprocessesretry]', 'Number of processes to retry when all cores are busy (default 10 processes) [maxprocessesretry]', 10)
      .option('-n, --maxJobProcessDurationMs [maxJobProcessDurationMs]', 'Maximum time to wait for a job to complete (default 10000 ms) [maxJobProcessDurationMs]', 10000)
      .option('-s, --hostport [hostport]', 'Server port of the central host (default 80) [hostport]', parseInt)
      .option('-x, --deleteonexit [deleteonexit]', 'Delete database files on exit (default true) [deleteonexit]', 'true')
      .option('-y, --deleteonstartup [deleteonstartup]', 'Delete database files on startup (default false) [deleteonstartup]', 'false')
      .option('-a, --runapp [runapp]', 'Run the app with ID as the homepage (default not set) [runapp]', null)
      .option('-u, --loadjsurl [loadjsurl]', 'Load the following JS from a URL (default not set) [loadjsurl]', null)
      .option('-f, --loadjsfile [loadjsfile]', 'Load the following JS from a file (default not set) [loadjsfile]', null)
      .option('-z, --loadjscode [loadjscode]', 'Load the following JS from the command line (default not set) [loadjscode]', null)
      .option('-b, --runhtml [runhtml]', 'Run using a local HTML page as the homepage (default not set) [runhtml]', null)
      .option('-q, --https [https]', 'Run using a HTTPS (default is http) [https]', 'false')
      .option('-v, --private [private]', 'Private HTTPS key [private]', null)
      .option('-c, --public [public]', 'Public HTTPS certificate [public]', null)
      .option('-e, --cacert1 [cacert1]', 'Public HTTPS CA certificate 1 [cacert1]', null)
      .option('-f, --cacert2 [cacert2]', 'Public HTTPS CA certificate 2 [cacert2]', null)
      .option('-g, --cacert3 [cacert3]', 'Public HTTPS CA certificate 3 [cacert3]', null)
      .option('-u, --usehost [usehost]', 'Use host name [usehost]', null)
      .parse(process.argv);
} else {
    program.type = 'client'
    program.host = 'yazz.com'
    program.locked = 'true'
    program.debug = 'false'
    program.deleteonexit = 'true'
    program.deleteonstartup = 'false'
    program.runapp = null
    program.loadjsurl = null
    program.loadjsfile = null
    program.runhtml = null
    program.https = 'false'
    program.usehost = null
}
var semver = require('semver')





var showProgress = false
if (program.showprogress == 'true') {
    showProgress = true;
}


var showDebug = false
function outputDebug(text) {
    if (showDebug) {
         console.log(text);
    } else {
        if (showProgress) {
            process.stdout.write(".");
        }
    }
};
if (program.showdebug == 'true') {
    showDebug = true;

}
outputDebug("       showDebug: " + showDebug);




var showStats = false
if (program.showstats == 'true') {
    showStats = true;
}
outputDebug("       showStats: " + showStats );





var statsInterval = -1
if (program.statsinterval > 0) {
    statsInterval = program.statsinterval;
}
outputDebug("       statsInterval: " + statsInterval );



if (program.virtualprocessors > 0) {
    executionProcessCount = program.virtualprocessors;
}
outputDebug("       executionProcessCount: " + executionProcessCount );





var maxProcessesCountToRetry = 10
if (program.maxprocessesretry > 0) {
    maxProcessesCountToRetry = program.maxprocessesretry;
}
outputDebug("       maxProcessesCountToRetry: " + maxProcessesCountToRetry );


var maxJobProcessDurationMs = 10000
if (program.maxJobProcessDurationMs > 0) {
    maxJobProcessDurationMs = program.maxJobProcessDurationMs;
}
outputDebug("       maxJobProcessDurationMs: " + maxJobProcessDurationMs );




var listOfEnvs = process.env
var envNames = Object.keys(listOfEnvs)
for (var i=0 ;i< envNames.length; i++){
    let envName = envNames[i].replace(/[^a-zA-Z0-9]/g,'_');
    outputDebug("Env var  " + envName + ": " + listOfEnvs[envName])

    envVars[envName] = listOfEnvs[envName]
}
if (isValidObject(envVars.virtualprocessors)) {
    executionProcessCount = envVars.virtualprocessors
}




function isValidObject(variable){
    if ((typeof variable !== 'undefined') && (variable != null)) {
        return true
    }
    return false
}
outputDebug("process.env.OPENSHIFT_NODEJS_IP:= " + process.env.OPENSHIFT_NODEJS_IP)


if (process.env.OPENSHIFT_NODEJS_IP) {
    username = "node"
} else {
    username = "node"
    //if (isValidObject(os) && isValidObject(os.userInfo()) && isValidObject(os.userInfo().username)) {
    //    username = os.userInfo().username.toLowerCase();
    //}
}

var LOCAL_HOME = process.env.HOME

outputDebug('LOCAL_HOME:' + LOCAL_HOME);



//
// We set the HOME environment variable if we are running in OpenShift
//
outputDebug('DOCKER CHECK...');


if (isDocker()) {

    outputDebug('Running inside a Linux container');


} else {
    outputDebug('NOT running inside a Linux container');
}

if (!isValidObject(LOCAL_HOME) || (LOCAL_HOME == "/")) {
    LOCAL_HOME = "/home/node"
}



outputDebug('Starting services');

var debug = false;
outputDebug("NodeJS version: " + process.versions.node);


if (semver.gt(process.versions.node, '6.9.0')) {
    outputDebug("NodeJS version > 6.9 " );
}
if (program.debug == 'true') {
    debug = true;

    outputDebug("       debug: true" );

} else {
    outputDebug("       debug: false" );

};




var deleteOnExit = (program.deleteonexit == 'true');
outputDebug("deleteOnExit: " + deleteOnExit)



var deleteOnStartup = (program.deleteonstartup == 'true');
outputDebug("deleteOnStartup: " + deleteOnStartup)



locked = (program.locked == 'true');

useHttps = (program.https == 'true');
if (useHttps) {
    serverProtocol = "https"
}
privateKey = program.private;
publicCertificate = program.public;
caCertificate1 = program.cacert1;
caCertificate2 = program.cacert2;
caCertificate3 = program.cacert3;
var useHost = program.usehost;

if (useHost) {
    hostaddress = useHost
    outputDebug("USE Host: " + useHost)
}


port = program.port;
var runapp = program.runapp;
var runhtml = program.runhtml;
var loadjsurl = program.loadjsurl;
var loadjsfile = program.loadjsfile;
var loadjscode = program.loadjscode;


if (!isNumber(port)) {
    port = 80;
    if (useHttps) {
        port = 443;
    }
};


outputDebug('Yazz node local hostname: ' + ip.address() + ' ')



setupVisifileParams();






function setUpChildListeners(processName, fileName, debugPort) {

    forkedProcesses[processName].on('close', function() {
        if (!shuttingDown) {
            outputDebug("Child process " + processName + " exited.. restarting... ")



            var stmtInsertProcessError = dbsearch.prepare(  ` insert into
                                                                  system_process_errors
                                                              (   id,
                                                                  timestamp,
                                                                  process,
                                                                  status,
                                                                  base_component_id,
                                                                  event,
                                                                  system_code_id,
                                                                  args,
                                                                  error_message )
                                                              values
                                                                  ( ?,  ?,  ?,  ?,  ?,  ?,  ?,  ?,  ? );`)
            dbsearch.serialize(function() {
                dbsearch.run("begin exclusive transaction");
                var newId = uuidv1()
                stmtInsertProcessError.run(
                      newId,
                      new Date().getTime(),
                      processName,
                      "KILLED",
                      null,
                      null,
                      null,
                      null,
                      null )

                dbsearch.run("commit");
                stmtInsertProcessError.finalize();

            })
            setupForkedProcess(processName, fileName, debugPort)
        }
    });


    forkedProcesses[processName].on('message', (msg) => {
        //console.log("message from child: " + JSON.stringify(msg,null,2))
        //console.log("message type from child: " + JSON.stringify(msg.message_type,null,2))


        //------------------------------------------------------------------------------
        //
        //
        //
        //
        //
        //------------------------------------------------------------------------------
        if (msg.message_type == "save_code") {

            forkedProcesses["forked"].send({
                                                message_type:       "save_code",
                                                base_component_id:   msg.base_component_id,
                                                parent_hash:         msg.parent_hash,
                                                code:                msg.code,
                                                options:             msg.options
                                           });


        //------------------------------------------------------------------------------
        //
        //
        //
        //
        //
        //------------------------------------------------------------------------------
        } else if (msg.message_type == "add_rest_api") {

            outputDebug("add_rest_api called")


            var newFunction = async function (req, res) {

                var params  = req.query;
                var url     = req.originalUrl;
                var body    = req.body;

                var promise = new Promise(async function(returnFn) {
                    var seqNum = queuedResponseSeqNum;
                    queuedResponseSeqNum ++;
                    queuedResponses[ seqNum ] = function(value) {
                        returnFn(value)
                    }


                    outputDebug(" msg.base_component_id: " + msg.base_component_id);
                    outputDebug(" seqNum: " + seqNum);
                            forkedProcesses["forked"].send({
                                            message_type:          "callDriverMethod",
                                            find_component:         {
                                                                        method_name: msg.base_component_id,
                                                                        driver_name: msg.base_component_id
                                                                    }
                                                                    ,
                                            args:                   {
                                                                        params: params,
                                                                        body:   body,
                                                                        url:    url
                                                                    }
                                                                    ,
                                            seq_num_parent:         null,
                                            seq_num_browser:        null,
                                            seq_num_local:          seqNum,
                                        });


                })
                var ret = await promise

                if (ret.value) {
                    res.writeHead(200, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify(
                        ret.value
                    ));
                } else if (ret.error) {
                    res.writeHead(200, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify(
                        {error: ret.error}
                    ));
                } else {
                    res.writeHead(200, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify(
                        {error: "Unknown problem occurred"}
                    ));
                }
            }

            // end of function def for newFunction


            if (!isValidObject(restRoutes[msg.route])) {
                if (msg.rest_method == "POST") {
                    app.post(  '/' + msg.route + '/*'  , async function(req, res){
                        await ((restRoutes[msg.route])(req,res))
                    })
                    app.post(  '/' + msg.route  , async function(req, res){
                        await ((restRoutes[msg.route])(req,res))
                    })

                } else {
                    app.get(  '/' + msg.route + '/*'  , async function(req, res){
                        await ((restRoutes[msg.route])(req,res))
                    })
                    app.get(  '/' + msg.route  , async function(req, res){
                        await ((restRoutes[msg.route])(req,res))
                    })
                }
            }
            restRoutes[msg.route] = newFunction









        //------------------------------------------------------------------------------
        //
        //
        //
        //
        //
        //------------------------------------------------------------------------------
        } else if (msg.message_type == "createdTablesInChild") {
            forkedProcesses["forked"].send({         message_type: "setUpSql" });
            forkedProcesses["forked"].send({         message_type: "greeting" , hello: 'world' });

            outputDebug("mainNodeProcessStarted: " + mainNodeProcessStarted)

            if (!mainNodeProcessStarted) {
                mainNodeProcessStarted = true
                if (!isTty) {
                    getPort()
                } else {

                    startServices()
                    setupChildProcesses();

                }
            }




    //------------------------------------------------------------------------------
    //
    //
    //
    //
    //
    //------------------------------------------------------------------------------
    } else if (msg.message_type == "drivers_loaded_by_child") {

    	//--------------------------------------------------------
    	// open the app in a web browser
    	//--------------------------------------------------------
        checkForJSLoaded();


if (!isTty) {
console.log(`

 YYYYYYY       YYYYYYY
 Y:::::Y       Y:::::Y
 Y:::::Y       Y:::::Y
 Y::::::Y     Y::::::Y
 YYY:::::Y   Y:::::YYY  aaaaaaaaaaaaa   zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz
    Y:::::Y Y:::::Y     a::::::::::::a  z:::::::::::::::zz:::::::::::::::z
     Y:::::Y:::::Y      aaaaaaaaa:::::a z::::::::::::::z z::::::::::::::z
      Y:::::::::Y                a::::a zzzzzzzz::::::z  zzzzzzzz::::::z
       Y:::::::Y          aaaaaaa:::::a       z::::::z         z::::::z
        Y:::::Y         aa::::::::::::a      z::::::z         z::::::z
        Y:::::Y        a::::aaaa::::::a     z::::::z         z::::::z
        Y:::::Y       a::::a    a:::::a    z::::::z         z::::::z
        Y:::::Y       a::::a    a:::::a   z::::::zzzzzzzz  z::::::zzzzzzzz
     YYYY:::::YYYY    a:::::aaaa::::::a  z::::::::::::::z z::::::::::::::z
     Y:::::::::::Y     a::::::::::aa:::az:::::::::::::::zz:::::::::::::::z
     YYYYYYYYYYYYY      aaaaaaaaaa  aaaazzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz



 PPPPPPPPPPPPPPPPP     iiii  lllllll                           tttt
 P::::::::::::::::P   i::::i l:::::l                        ttt:::t
 P::::::PPPPPP:::::P   iiii  l:::::l                        t:::::t
 PP:::::P     P:::::P        l:::::l                        t:::::t
   P::::P     P:::::Piiiiiii  l::::l    ooooooooooo   ttttttt:::::ttttttt
   P::::P     P:::::Pi:::::i  l::::l  oo:::::::::::oo t:::::::::::::::::t
   P::::PPPPPP:::::P  i::::i  l::::l o:::::::::::::::ot:::::::::::::::::t
   P:::::::::::::PP   i::::i  l::::l o:::::ooooo:::::otttttt:::::::tttttt
   P::::PPPPPPPPP     i::::i  l::::l o::::o     o::::o      t:::::t
   P::::P             i::::i  l::::l o::::o     o::::o      t:::::t
   P::::P             i::::i  l::::l o::::o     o::::o      t:::::t
   P::::P             i::::i  l::::l o::::o     o::::o      t:::::t    tttttt
 PP::::::PP          i::::::il::::::lo:::::ooooo:::::o      t::::::tttt:::::t
 P::::::::P          i::::::il::::::lo:::::::::::::::o      tt::::::::::::::t
 P::::::::P          i::::::il::::::l oo:::::::::::oo         tt:::::::::::tt
 PPPPPPPPPP          iiiiiiiillllllll   ooooooooooo             ttttttttttt
`)


        console.log("\nRunning " + executionProcessCount + " virtual processors");
        console.log("\nYazz Pilot started on:");
        console.log("Network Host Address: " + hostaddressintranet)
        console.log("Local Machine Address: " + serverProtocol + "://" + hostaddress + ':' + port);
} else {
    //zzz

                        var parsedInput = null
                        try {
                            parsedInput = eval("(" + inputStdin + ")");
                        } catch(qwe) {
                            //console.log("Err: " + qwe);
                            try {
                                let pss = "('" + inputStdin + "')";
                                pss = pss.replace(/(\r\n|\n|\r)/gm, "");
                                parsedInput = eval(pss);
                            } catch(ex) {
                                //console.log(ex)
                            }
                        }
                        //console.log("client args:" + JSON.stringify( parsedInput,null,2))

                        //console.log("Parsed: " + JSON.stringify(parsedInput));

                        (async function() {
                        var promise = new Promise(async function(returnFn) {
                            var seqNum = queuedResponseSeqNum;
                            queuedResponseSeqNum ++;
                            queuedResponses[ seqNum ] = function(value) {
                                returnFn(value)
                            }

                            forkedProcesses["forked"].send({
                                            message_type:          "callDriverMethod",
                                            find_component:         {
                                                                        method_name: "serverTerminalStuff",
                                                                        driver_name: "serverTerminalStuff"
                                                                    }
                                                                    ,
                                            args:                   parsedInput
                                                                    ,
                                            seq_num_parent:         null,
                                            seq_num_browser:        null,
                                            seq_num_local:          seqNum,
                                        });


                        })
                        var ret = await promise

                        if (ret.value) {
                            process.stdout.write(ret.value);
                        }

                        process.exit();
                    })()
}

        systemReady = true











        //------------------------------------------------------------------------------
        //
        //
        //
        //
        //
        //------------------------------------------------------------------------------
        } else if (msg.message_type == "ipc_child_returning_uploaded_app_as_file_in_child_response") {

            outputDebug("uploaded_app_as_file_in_child: " + JSON.stringify(msg))

                // ______
                // Server  --1 data item-->  Browser
                // ______
                //
                sendOverWebSockets({
                                      type:                 "uploaded_app_as_file_from_server",
                                      code_id:               msg.code_id,
                                      base_component_id:     msg.base_component_id,
                                      client_file_upload_id: msg.client_file_upload_id

                    });







        //------------------------------------------------------------------------------
        //
        //
        //
        //
        //
        //------------------------------------------------------------------------------
        } else if (msg.message_type == "database_setup_in_child") {



            if (msg.child_process_name == "forkedExeScheduler") {
                    forkedProcesses["forkedExeScheduler"].send({ message_type: "setUpSql" });
                }

            if (msg.child_process_name.startsWith("forkedExeProcess")) {

                forkedProcesses[msg.child_process_name].send({ message_type: "setUpSql" });


                forkedProcesses["forkedExeScheduler"].send({    message_type:    "startNode",
                                                                node_id:          msg.child_process_name,
                                                                child_process_id: forkedProcesses[msg.child_process_name].pid,
                                                                started:          new Date()
                                                  });
                                              }





        //------------------------------------------------------------------------------
        //
        //
        //
        //
        //
        //------------------------------------------------------------------------------
        } else if (msg.message_type == "return_add_local_driver_results_msg") {
            //console.log("6 - return_get_search_results: " + msg.returned);
            var rett = eval("(" + msg.success + ")");
            var newCallbackFn = queuedResponses[ msg.seq_num_local ]

            if (msg.result ) {
                newCallbackFn(msg.result)
            } else {
                newCallbackFn({
                                    error: msg.error
                                })
            }


            newres = null;







        //------------------------------------------------------------------------------
        //
        //
        //
        //
        //
        //------------------------------------------------------------------------------
        } else if (msg.message_type == "processor_free") {

            forkedProcesses["forkedExeScheduler"].send({
                                                    message_type:         "processor_free",
                                                    child_process_name:    msg.child_process_name
                                                  });









        //------------------------------------------------------------------------------
        //
        //
        //
        //
        //
        //------------------------------------------------------------------------------
        } else if (msg.message_type == "execute_code_in_exe_child_process") {
                //console.log("6 - return_get_all_table: " );

                forkedProcesses[msg.child_process_name].send({
                                                        message_type:       "execute_code",
                                                        code:                msg.code,
                                                        callback_index:      msg.callback_index,
                                                        code_id:             msg.code_id,
                                                        args:                msg.args,
                                                        call_id:             msg.call_id,
                                                        on_condition:        msg.on_condition,
                                                        base_component_id:   msg.base_component_id
                                                      });





      //------------------------------------------------------------------------------
      //
      //
      //
      //
      //
      //------------------------------------------------------------------------------
      } else if (msg.message_type == "function_call_request") {
              //console.log("6 - return_get_all_table: " );

              forkedProcesses["forkedExeScheduler"].send({
                                                      message_type:         "function_call_request",
                                                      child_process_name:    msg.child_process_name,
                                                      find_component:        msg.find_component,
                                                      args:                  msg.args,
                                                      callback_index:        msg.callback_index,
                                                      caller_call_id:        msg.caller_call_id
                                                    });






      //------------------------------------------------------------------------------
      //
      //
      //
      //
      //
      //------------------------------------------------------------------------------
      } else if (msg.message_type == "function_call_response") {
          //console.log("*** function_call_response: " + JSON.stringify(msg,null,2))
          forkedProcesses["forkedExeScheduler"].send({
                                                  message_type:         "function_call_response",
                                                  child_process_name:    msg.child_process_name,
                                                  driver_name:           msg.driver_name,
                                                  method_name:           msg.method_name,
                                                  result:                msg.result,
                                                  callback_index:        msg.callback_index,
                                                  called_call_id:        msg.called_call_id
                                                });






    //------------------------------------------------------------------------------
    //
    //
    //
    //
    //
    //------------------------------------------------------------------------------
      } else if (msg.message_type == "return_response_to_function_caller") {
          //console.log("*) Electron.js    got response for " + msg.child_process_name);
          //console.log("*) "+ msg.result)
          if (msg.child_process_name) {
              forkedProcesses[msg.child_process_name].send({
                                                      message_type:         "return_response_to_function_caller",
                                                      callback_index:        msg.callback_index,
                                                      result:                msg.result
                                                    });
          }









        //------------------------------------------------------------------------------
        //
        //
        //
        //
        //
        //------------------------------------------------------------------------------
            } else if (msg.message_type == "ipc_child_returning_callDriverMethod_response") {

                //console.log(" .......3: " + JSON.stringify(msg,null,2));
                //console.log("6: return_query_items_ended")
                //console.log("6.1: " + msg)
                var new_ws = queuedResponses[ msg.seq_num_parent ]

                if (msg.result) {
                    if (msg.result.code) {
                        var tr = msg.result.code
                        msg.result.code = tr
                    }
                }
                sendToBrowserViaWebSocket(
                                             new_ws
                                             ,
                                             {
                                                type:            "ws_to_browser_callDriverMethod_results",
                                                value:            msg.result,
                                                seq_num:          msg.seq_num_browser
                                             });
                //new_ws = null;




        }



    });
}








//------------------------------------------------------------------------------
//
//
//
//
//
//------------------------------------------------------------------------------
function setupForkedProcess(  processName,  fileName,  debugPort  ) {
    var debugArgs =[];
    if (debug) {
        if (semver.gte(process.versions.node, '6.9.0')) {
            debugArgs = ['--inspect=' + debugPort];
        } else {
            debugArgs = ['--debug=' + debugPort];
        };
    };
    var forkedProcessPath

    if (isWin) {
        forkedProcessPath = path.join(__dirname, '..\\src\\' + fileName)
    } else {
        forkedProcessPath = path.join(__dirname, '../src/' + fileName)
    }
    forkedProcesses[  processName  ] = fork.fork(forkedProcessPath, [], {execArgv: debugArgs});




    setUpChildListeners(processName, fileName, debugPort);


    if (processName == "forked") {

        forkedProcesses["forked"].send({         message_type: "init" ,
                                                 user_data_path: userData,
                                                 child_process_name: "forked",
                                                 show_debug: showDebug,
                                                 show_progress: showProgress
                                              });

        forkedProcesses["forked"].send({         message_type: "createTables" });
    }




    if (processName == "forkedExeScheduler") {

        forkedProcesses["forkedExeScheduler"].send({  message_type: "init" ,
                                                      user_data_path: userData,
                                                      child_process_name: "forkedExeScheduler",
                                                      max_processes_count_to_retry: maxProcessesCountToRetry,
                                                      max_job_process_duration_ms: maxJobProcessDurationMs,
                                                      show_debug: showDebug,
                                                      show_progress: showProgress
                                              });
    }

    for (var i=0;i<executionProcessCount; i++ ) {
        var exeProcName = "forkedExeProcess" + i
        if (processName == exeProcName) {

            forkedProcesses[exeProcName].send({  message_type: "init" ,
                                                 user_data_path: userData,
                                                 child_process_name: exeProcName,
                                                 show_debug: showDebug,
                                                 show_progress: showProgress
                                              });

      }

    }



    outputDebug("Started subprocess '" + processName + "' ")

}









//------------------------------------------------------------------------------
//
//
//
//
//
//------------------------------------------------------------------------------
function setupMainChildProcess() {
    setupForkedProcess("forked",        "child.js", 40003)
}







//------------------------------------------------------------------------------
//
//
//
//
//
//------------------------------------------------------------------------------
function setupChildProcesses() {
    setupForkedProcess("forkedExeScheduler", "exeScheduler.js", 40004)
    for (var i=0;i<executionProcessCount; i++ ) {
        var exeProcName = "forkedExeProcess" + i
            setupForkedProcess(exeProcName, "exeProcess.js", 40100 + i)
    }
}











function sendOverWebSockets(data) {
    var ll = serverwebsockets.length;
    //console.log('send to sockets Count: ' + JSON.stringify(serverwebsockets.length));
    for (var i =0 ; i < ll; i++ ) {
        var sock = serverwebsockets[i];
        sock.emit(data.type,data);
        //console.log('                    sock ' + i + ': ' + JSON.stringify(sock.readyState));
    }
}










function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}


function setupVisifileParams() {
    typeOfSystem = program.type;
    centralHostAddress = program.host;
    centralHostPort = program.hostport;
    if (!isNumber(centralHostPort)) {centralHostPort = 80;};


    if (!(typeOfSystem == 'client' || typeOfSystem == 'server')) {
        outputDebug('-------* Invalid system type: ' + typeOfSystem);
        process.exit();
    };

    outputDebug('-------* System type: ' + typeOfSystem);
    outputDebug('-------* Port: ' + port);
    outputDebug('-------* Central host: ' + centralHostAddress);
    outputDebug('-------* Central host port: ' + centralHostPort);
    outputDebug( ip.address() );

	//console.log('addr: '+ ip.address());
	//hostaddress = ip.address();
}



    outputDebug("process.platform = " + process.platform)


          if (process.platform === "win32") {
            var rl = require("readline").createInterface({
              input: process.stdin,
              output: process.stdout
            });

            rl.on("SIGINT", function () {
                shutDown();
                process.exit();
            });
          }





        	if (isWin) {
                outputDebug("Running as Windows")
        		var localappdata  = process.env.LOCALAPPDATA
        		userData = path.join(localappdata, '/Yazz/')
        	} else {

                outputDebug("Running as Linux/Mac")

        		userData =  path.join(LOCAL_HOME, 'Yazz')
        	}
        	dbPath = path.join(userData, username + '.visi')


            if (deleteOnStartup) {
                outputDebug("deleting dir :" + userData)
                if (userData.length > 6) {
                        deleteYazzDataV2(userData)
                }
            }
            var uploadPath = path.join(userData,  'uploads/')

            outputDebug("LOCAL_HOME: " + LOCAL_HOME)
            outputDebug("userData: " + userData)
            outputDebug("uploadPath: " + uploadPath)

            upload          = multer( { dest: uploadPath});


            rmdir("uploads");
            mkdirp.sync(path.join(userData,  'uploads'));
            mkdirp.sync(path.join(userData,  'files'));
            mkdirp.sync(path.join(userData,  'apps'));
            mkdirp.sync(path.join(userData,  'app_dbs'));


            outputDebug('process.env.LOCALAPPDATA: ' + JSON.stringify(localappdata ,null,2))
            outputDebug("Local home data path: " + LOCAL_HOME)

            outputDebug("userData: " + JSON.stringify(userData ,null,2))
            outputDebug("process.env keys: " + Object.keys(process.env))




            dbsearch = new sqlite3.Database(dbPath);
            dbsearch.run("PRAGMA journal_mode=WAL;")





        	var nodeConsole = require('console');
        	var myConsole = new nodeConsole.Console(process.stdout, process.stderr);




            //var index = require(path.resolve('src/index.js'))


            setupMainChildProcess();







var shuttingDown = false;
process.on('exit', function() {
    shutDown();
  });
process.on('quit', function() {
  shutDown();
});
process.on("SIGINT", function () {
    shutDown();
    process.exit()
});




function shutDown() {
    outputDebug(" shutDown() called")
    if (!shuttingDown) {
        shuttingDown = true;

        if (dbsearch) {
            outputDebug("Database closing...")
            dbsearch.run("PRAGMA wal_checkpoint;")
            dbsearch.close(function(err){
                outputDebug("...database closed")
                visifile = null

            })
        }

        if (forkedProcesses["forked"]) {
            outputDebug("Killed Process forked")
            forkedProcesses["forked"].kill();
        }
        if (forkedProcesses["forkedExeScheduler"]) {
            outputDebug("Killed Exe Scheduler process")
            forkedProcesses["forkedExeScheduler"].kill();
        }

        for (var i = 0; i < executionProcessCount; i++ ) {
            var exeProcName = "forkedExeProcess" + i
            forkedProcesses[exeProcName].kill();
            outputDebug("Killed Process " + exeProcName)
        }
        if (visifile){
            visifile.removeAllListeners('close');
            //visifile.close();
            if (visifile.globalShortcut) {
                //visifile.globalShortcut.unregisterAll();

            }
        }

        outputDebug("deleteOnExit =" + deleteOnExit)
        if (deleteOnExit) {

            outputDebug("deleting dir :" + userData)
            if (userData.length > 6) {
                if (isWin) {
                    deleteYazzDataWindows(userData)
                } else {
                    deleteYazzData(userData)

                }
            }
        }
    }


}



function deleteYazzDataWindows(dddd) {
  outputDebug("deleteYazzDataWindows")
  if (dddd.length > 6) {
    var ff = 'timeout 8 && rd /s /q "' + dddd + '"'
    outputDebug(ff)
    fork.exec(ff
              ,
              function(err, stdout, stderr) {
                if (err) {
                    // node couldn't execute the command
                    return;
                    }
                })
    }
  }


function deleteYazzDataV2(dddd) {
    outputDebug("----------------------------------")
    outputDebug("Before delete :" + ls(dddd))
    outputDebug("----------------------------------")

    rimraf.sync(path.join(dddd,  'uploads/'));
    rimraf.sync(path.join(dddd,  'files/'));
    rimraf.sync(path.join(dddd,  'apps/'));
    rimraf.sync(path.join(dddd,  'app_dbs/'));
    rimraf.sync(path.join(dddd,  '*.visi'));
    rimraf.sync(path.join(dddd,  '*.visi*'));

    outputDebug("----------------------------------")
    outputDebug("After delete :" + ls(dddd))
    outputDebug("----------------------------------")
}

function deleteYazzData(dddd) {
    fork.exec('sleep 3 && cd "' + dddd + '" && rm -rf app_dbs apps uploads files *.visi*', function(err, stdout, stderr) {
        if (err) {
            // node couldn't execute the command
            return;
            }
        })
}















var httpServer = null;
function getPort () {
    outputDebug('** called getPort v2')




    if (useHttps) {
        var caCerts = readCerts()
        var certOptions = {
          key: fs.readFileSync(privateKey, 'utf8'),
          cert: fs.readFileSync(publicCertificate, 'utf8'),
          ca: caCerts
        }
        certOptions.requestCert = true
        certOptions.rejectUnauthorized = false

        httpServer = https.createServer(certOptions,app)

    } else {
        httpServer = http.createServer(app)

    }




    httpServer.listen(port, ip.address(), function (err) {

        outputDebug('trying port: ' + port + ' ')

        httpServer.once('close', function () {
        })
        httpServer.close()
        httpServer = null;
    })



    httpServer.on('error', function (err) {
        outputDebug('Couldnt connect on port ' + port + '...')

        if (port < portrange) {
            port = portrange
            };
            outputDebug('... trying port ' + port)

        portrange += 1
        getPort()
    })
    httpServer.on('listening', function (err) {

            outputDebug('Can connect on ' + ip.address() +  ':' + port + ' :) ')

            forkedProcesses["forked"].send({         message_type: "host_and_port" ,
                                                     child_process_name: "forked",
                                                     ip: hostaddress,
                                                     port: port
                                                  });
            startServices()
            setupChildProcesses();





    })
}











//------------------------------------------------------------------------------------------
//
//                                          checkForJSLoaded
//
// This checks to see if Yazz Pilot is started with custom code. This code is
// then loaded into Yazz Pilot either as a web app or it is run as a UI app
//
//
//
//------------------------------------------------------------------------------------------
function checkForJSLoaded() {
    if (isValidObject(envVars.loadjsurl)) {
        loadjsurl = envVars.loadjsurl
    }

    //
    // load JS code from file
    //
    if (isValidObject(envVars.loadjsfile)) {
        loadjsfile = envVars.loadjsfile
    }


    //console.log("process.argv.length : " + process.argv.length )
    //console.log("process.argv[2] : " + process.argv[2] )
  if ((process.argv[2]) && (process.argv[2].endsWith(".js") || process.argv[2].endsWith(".pilot") )) {
      loadjsfile = process.argv[2]
  } else if ((process.argv[2]) && (!process.argv[2].startsWith("--"))) {
        loadjscode = process.argv[2]
        outputDebug("load code: " + loadjscode )
  }






    if (isValidObject(envVars.loadjscode)) {
        loadjscode = envVars.loadjscode
    }
    //zzz
    if (isFrontEndOnlyCode(loadjscode)){
       inputStdin = loadjscode
       isTty = true
    }

    if (isValidObject(loadjsurl)) {

        var jsUrl = loadjsurl
        https.get(jsUrl, (resp) => {
          var data = '';

          // A chunk of data has been recieved.
          resp.on('data', (chunk) => {
            data += chunk;
          });

          // The whole response has been received. Print out the result.
          resp.on('end', () => {
            //console.log("code:" + data);
            var baseComponentIdForUrl = saveHelper.getValueOfCodeString(data, "base_component_id")
            outputDebug("baseComponentIdForUrl:" + baseComponentIdForUrl);
            if (!isValidObject(baseComponentIdForUrl)) {
                baseComponentIdForUrl = loadjsurl.replace(/[^A-Z0-9]/ig, "_");
            }
            var jsCode = data
            outputDebug("*********** Trying to load loadjsurl code *************")
            forkedProcesses["forked"].send({
                                                message_type:        "save_code",
                                                base_component_id:    baseComponentIdForUrl,
                                                parent_hash:          null,
                                                code:                 data,
                                                options:             {
                                                                        make_public: true,
                                                                        save_html:   true
                                                                     }
                                           });
            runapp = baseComponentIdForUrl
          });

        }).on("error", (err) => {
          outputDebug("Error: " + err.message);
        });

    } else if (isValidObject(loadjsfile)) {

        var jsFile = loadjsfile

        var data2 = fs.readFileSync(jsFile).toString()
        var baseComponentIdForFile = saveHelper.getValueOfCodeString(data2, "base_component_id")
        if (!isValidObject(baseComponentIdForFile)) {
            baseComponentIdForFile = loadjsfile.replace(/[^A-Z0-9]/ig, "_");
        }

        //console.log("code from file:" + data2);
        //console.log("*********** Trying to load loadjsfile code *************")
        forkedProcesses["forked"].send({
                                            message_type:        "save_code",
                                            base_component_id:    baseComponentIdForFile,
                                            parent_hash:          null,
                                            code:                 data2,
                                            options:             {
                                                                    make_public: true,
                                                                    save_html:   true
                                                                 }
                                           });
         runapp = baseComponentIdForFile


     } else if (isValidObject(loadjscode)) {
console.log("loadjscode ...")
         var data2 = loadjscode
         var baseComponentIdForCode = saveHelper.getValueOfCodeString(data2, "base_component_id")
         outputDebug("baseComponentIdForCode:" + baseComponentIdForCode);
         if (!isValidObject(baseComponentIdForCode)) {
             baseComponentIdForCode = "code_" + (("" + Math.random()).replace(/[^A-Z0-9]/ig, "_"));
             outputDebug("baseComponentIdForFile:" + baseComponentIdForCode);
         }

         //console.log("code:" + data2);
         outputDebug("*********** Trying to load loadjscode code *************")
         forkedProcesses["forked"].send({
                                             message_type:        "save_code",
                                             base_component_id:    baseComponentIdForCode,
                                             parent_hash:          null,
                                             code:                 data2,
                                             options:             {
                                                                     make_public: true,
                                                                     save_html:   true
                                                                  }
                                            });
          runapp = baseComponentIdForCode


     }



}


function isFrontEndOnlyCode(code) {
    if (!code){
        return false
    }
    if (code.indexOf("Vue.") != -1) { return true }
    if (code.indexOf("only_run_on_server(") != -1) { return false }
    if (code.indexOf("rest_api(") != -1) { return false }
    return true
}














function mkdirSync(dirPath) {
    try {
        mkdirp.sync(dirPath)
    } catch (err) {
        //if (err.code !== 'EEXIST') throw err
    }
}


function outputToConsole(text) {
    var c = console;
    c.log(text);
}




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
    //console.log('çopy from: '+ source + ' to ' + target);
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
				//console.log('copying:  ' + targetFolder);
            }
        } );
    }
}































// ============================================================
// This sends a message to a specific websocket
// ============================================================
function sendToBrowserViaWebSocket(aws, msg) {
    aws.emit(msg.type,msg);
}









function isLocalMachine(req) {
    if ((req.ip == '127.0.0.1') || (hostaddress == req.ip) || (hostaddress == "0.0.0.0")) {  // this is the correct line to use
    //if (req.ip == '127.0.0.1')  {      // this is used for debugging only so that we can deny access from the local machine
        return true;
    };
    return false;
}





//------------------------------------------------------------------------------
// test if allowed
//------------------------------------------------------------------------------
function canAccess(req,res) {
    if (!locked) {
        return true;
    };
    if (isLocalMachine(req) ) {
        return true;
    };
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end("Sorry but access to " + username + "'s data is not allowed. Please ask " + username + " to unlocked their Yazz account");
    return false;
};















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




function extractRootDomain(url) {
    var domain = extractHostname(url),
        splitArr = domain.split('.'),
        arrLen = splitArr.length;

    //extracting the root domain here
    if (arrLen > 2) {
        domain = splitArr[arrLen - 2] + '.' + splitArr[arrLen - 1];
    }
    return domain;
}





function findViafromString(inp) {
    if (inp == null) {
        return "";
    }

    var ll = inp.split(' ');
    for (var i=0; i< ll.length ; i++){
        if (ll[i] != null) {
            if (ll[i].indexOf(":") != -1) {
                return extractRootDomain(ll[i]);
            }
        }
    }
    return "";
}


































function runOnPageExists(req, res, homepage) {

    if (fs.existsSync(homepage)) {
        if (typeOfSystem == 'client') {
            if (!canAccess(req,res)) {
                return;
            }
            res.end(fs.readFileSync(homepage));
        }
    } else {
        setTimeout(function() {
            runOnPageExists(req, res, homepage)
        },3000)
    }


}

function getRoot(req, res, next) {
	hostcount++;
	//console.log("Host: " + req.headers.host + ", " + hostcount);
	//console.log("Full URL: " + req.protocol + '://' + req.get('host') + req.originalUrl);

    var homepage = path.join(__dirname, '../public/go.html')
    var homepageUrl = serverProtocol + '://yazz.com/visifile/index.html?time=' + new Date().getTime()
	if (req.headers.host) {
        if (req.query.goto) {
            outputDebug("*** FOUND goto")
            res.end(fs.readFileSync(homepage));
            return
        }
        if (req.query.embed) {
            outputDebug("*** FOUND embed")
            res.end(fs.readFileSync(homepage));
            return
        }
        if (req.headers.host.toLowerCase().endsWith('yazz.com')) {
		res.writeHead(301,
			{Location: homepageUrl }
			);
			res.end();
			return;
		};
        if (req.headers.host.toLowerCase().endsWith('dannea.com')) {
		res.writeHead(301,
			{Location: homepageUrl }
			);
			res.end();
			return;
		};
		if (req.headers.host.toLowerCase().endsWith('canlabs.com')) {
		res.writeHead(301,
			{Location: 'http://canlabs.com/canlabs/index.html'}
			);
			res.end();
			return;
		};
		if (req.headers.host.toLowerCase().endsWith('gosharedata.com')) {
		res.writeHead(301,
			{Location: homepageUrl }
			);
			res.end();
			return;
		};
		if (req.headers.host.toLowerCase().endsWith('visifile.com')) {
		res.writeHead(301,
			{Location: homepageUrl }
			);
			res.end();
			return;
		};
		if (req.headers.host.toLowerCase().endsWith('visifiles.com')) {
		res.writeHead(301,
			{Location: homepageUrl}
			);
			res.end();
			return;
		};
        if (req.headers.host.toLowerCase().endsWith('appshare.co')) {
		res.writeHead(301,
			{Location: homepageUrl }
			);
			res.end();
			return;
		};
	};

    if (isValidObject(envVars.YAZZ_RUN_APP)) {
        runapp = envVars.YAZZ_RUN_APP
    }

    if (runhtml && (!req.query.goto) && (!req.query.embed)) {
        homepage = runhtml
        runOnPageExists(req,res,homepage)
        return
    } else if (runapp && (!req.query.goto) && (!req.query.embed)) {
        homepage = path.join( userData, 'apps/' + runapp + '.html' )
        runOnPageExists(req,res,homepage)
        return





    } else if (loadjsurl && (!req.query.goto) && (!req.query.embed)) {
        homepage = path.join( userData, 'apps/' + runapp + '.html' )
        runOnPageExists(req,res,homepage)
        return


    } else if (loadjsfile && (!req.query.goto) && (!req.query.embed)) {
        homepage = path.join( userData, 'apps/' + runapp + '.html' )
        runOnPageExists(req,res,homepage)
        return

    } else if (loadjscode && (!req.query.goto) && (!req.query.embed)) {
        homepage = path.join( userData, 'apps/' + runapp + '.html' )
        runOnPageExists(req,res,homepage)
        return


    } else {
        homepage = path.join( userData, 'apps/homepage.html' )
        runOnPageExists(req,res,homepage)
        return
    }
    outputDebug("Serving: " + homepage)


}



function getEditApp(req, res) {
	hostcount++;

    // I dont know why sockets.io calls .map files here
    if (req.path.endsWith(".map")) {
        return
    }
    var parts = req.path.split('/');
    var lastSegment = parts.pop() || parts.pop();

    outputDebug("URL PATH: " + lastSegment);
	//console.log("Full URL: " + req.protocol + '://' + req.get('host') + req.originalUrl);



    //
    // send the edit page
    //
    var homepage = path.join(__dirname, '../public/go.html')
    var baseComponentId = lastSegment
    var newStaticFileContent = fs.readFileSync(homepage)
    newStaticFileContent = newStaticFileContent.toString().replace("var editAppShareApp = null", "var editAppShareApp = '" + baseComponentId + "'")



    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    res.end(newStaticFileContent);
}

















function websocketFn(ws) {
    serverwebsockets.push(ws);
    sendToBrowserViaWebSocket(ws, {type: "socket_connected"});
    sendOverWebSockets({
                          type:   "env_vars",
                          value:   envVars
                          });
    //console.log('Socket connected : ' + serverwebsockets.length);
    sendOverWebSockets({
                          type:   "network_ip_address_intranet",
                          value:   hostaddressintranet
                          });

    ws.on('message', function(msg) {
        var receivedMessage = eval("(" + msg + ")");
        //console.log(" 1- Server recieved message: " + JSON.stringify(receivedMessage));

        // if we get the message "server_get_all_queries" from the web browser
        if (receivedMessage.message_type == "server_get_all_queries") {

            var seqNum = queuedResponseSeqNum;
            queuedResponseSeqNum ++;
            queuedResponses[seqNum] = ws;

            //console.log(" 2 ");
            forkedProcesses["forked"].send({
                            message_type:   "get_all_queries",
                            seq_num:          seqNum
                        });





        } else if (receivedMessage.message_type == "loadUiComponent") {
            //console.log("***** } else if (msg.message_type == loadUiComponent) ")

            var componentIds = receivedMessage.find_components.base_component_ids

            dbsearch.serialize(
                function() {
                    var stmt = dbsearch.all(
                        "SELECT  *  FROM   system_code   WHERE   base_component_id in " +
                            "("  + componentIds.map(function(){ return "?" }).join(",") + " )" +
                            "   and   code_tag = 'LATEST' ",
                        componentIds
                        ,

                        function(err, results)
                        {
                            if (results) {
                                if (results.length > 0) {
                                    var codeId = results[0].id
                                        dbsearch.all(
                                            "SELECT dependency_name FROM app_dependencies where code_id = ?; ",
                                            codeId,

                                            function(err, results2)
                                            {
                                                results[0].libs = results2
                                                sendToBrowserViaWebSocket(
                                                    ws,
                                                    {
                                                        type:                   "server_returns_loadUiComponent_to_browser",
                                                        seq_num:                 receivedMessage.seq_num,
                                                        record:                  JSON.stringify(results,null,2),
                                                        args:                    JSON.stringify(receivedMessage.args,null,2),
                                                        test:                   1
                                                    });
                                            })
                                }

                            }

                        })
            }, sqlite3.OPEN_READONLY)





        //                                  ______
        // Browser  --Send me your data-->  Server
        //                                  ______
        //
        } else if (receivedMessage.message_type == "edit_static_app") {
            outputDebug("*** server got message from static app: edit_static_app")
            var sql_data = receivedMessage.sql_data
            var code_fn = receivedMessage.code_fn


            forkedProcesses["forked"].send({
                    message_type:           "save_code_from_upload",
                    base_component_id:      receivedMessage.base_component_id,
                    parent_hash:            null,
                    code:                   code_fn,
                    client_file_upload_id:  -1,
                    options:                {save_html: true, fast_forward_database_to_latest_revision: true},
                    sqlite_data:            sql_data
               });



            sendToBrowserViaWebSocket(  ws,
                                        {
                                            type:       "edit_static_app_url"
                                            ,

                                            url:        receivedMessage.host_editor_address +
                                                        "/edit/" +
                                                        receivedMessage.base_component_id
                                            ,

                                            size_of_db: "" + (sql_data?sql_data.length:0)
                                            ,
                                            code_fn: "" + (code_fn?code_fn.length:0)

                                        });



        //                                  ______
        // Browser  --Send me your data-->  Server
        //                                  ______
        //
        } else if (receivedMessage.message_type == "browser_asks_server_for_data") {

            var seqNum = queuedResponseSeqNum;
            queuedResponseSeqNum ++;
            queuedResponses[seqNum] = ws;

            // ______
            // Server  --Send me your data-->  Subprocess
            // ______
            //
            forkedProcesses["forked"].send({
                            message_type:   "server_asks_subprocess_for_data",
                            seq_num:         seqNum
                        });





    } else if (receivedMessage.message_type == "browser_asks_server_for_data") {

        var seqNum = queuedResponseSeqNum;
        queuedResponseSeqNum ++;
        queuedResponses[seqNum] = ws;

        // ______
        // Server  --Send me your data-->  Subprocess
        // ______
        //
        forkedProcesses["forked"].send({
                        message_type:   "server_asks_subprocess_for_data",
                        seq_num:         seqNum
                    });









} else if (receivedMessage.message_type == "browser_asks_server_for_apps") {

   // outputDebug("******************* browser_asks_server_for_apps *******************")
    findLatestVersionOfApps( function(results) {
       // outputDebug(JSON.stringify(results,null,2))

        sendToBrowserViaWebSocket(  ws,
                                    {
                                        type:     "vf_app_names",
                                        results:  results
                                    });
        })

















        // --------------------------------------------------------------------
        //
        //                         callDriverMethod
        //
        // "callDriverMethod" is used to call server side apps/code.
        //
        //
        //
        // --------------------------------------------------------------------
        } else if (receivedMessage.message_type == "callDriverMethod") {

            // Use an integer counter to identify whoever was
            // calling the server function (in this case a web browser with
            // a web socket). We need to do this as there may be several
            // web browsers connected to this one server
            var seqNum = queuedResponseSeqNum;
            queuedResponseSeqNum ++;
            queuedResponses[ seqNum ] = ws;


            //console.log(" .......1 Electron callDriverMethod: " + JSON.stringify(receivedMessage,null,2));
            forkedProcesses["forked"].send({
                            message_type:          "callDriverMethod",
                            find_component:         receivedMessage.find_component,
                            args:                   receivedMessage.args,
                            seq_num_parent:         seqNum,
                            seq_num_browser:        receivedMessage.seqNum
                        });


    }







});};







function file_uploadSingleFn(req, res) {
      //console.log('-----  file_uploadSingle  --------------');
      //console.log(req.file);
      //console.log("**FILE** " + JSON.stringify(Object.keys(req)));
      //console.log('-------------------------------------------------------------------------------------');
      //console.log('-------------------------------------------------------------------------------------');
      //console.log('-------------------------------------------------------------------------------------');

      //console.log(JSON.stringify(req.files.length));
      //console.log("client_file_upload_id: " + JSON.stringify(req.body.client_file_upload_id,null,2))
      var client_file_upload_id = req.body.client_file_upload_id
      //console.log("**client_file_upload_id** " + JSON.stringify(client_file_upload_id));
      //console.log(    "    next: " + JSON.stringify(next));

      res.status( 200 ).send( req.file );

      //console.log('Loading saved Creator app' );
      var ifile = req.file
      //console.log("        " + JSON.stringify(ifile));
      var ext = ifile.originalname.split('.').pop();
      ext = ext.toLowerCase();
      //console.log('Ext: ' + ext);
      if ((ext == "html") || (ext == "html")) {
      var localp2;
      localp2 =  path.join(userData,  'uploads/' + ifile.filename);
          var localp = localp2 + '.' + ext;
          fs.renameSync(localp2, localp);
          var readIn = fs.readFileSync(localp).toString()
          //console.log('');
          //console.log('Local saved path: ' + localp);
          var indexStart = readIn.indexOf("/*APP_START*/")
          var indexEnd = readIn.indexOf("/*APP_END*/")
          //console.log(`indexStart: ${indexStart}`)
          //console.log(`indexEnd: ${indexEnd}`)
          if ((indexStart > 0) && (indexEnd > 0)) {
            indexStart += 13 + 10
            indexEnd -= 2
            var tts = readIn.substring(indexStart,indexEnd)
            //console.log(tts)
            var ytr = unescape(tts)
            outputDebug("SENDING FROM UPLOAD___=+++****")
            var bci = saveHelper.getValueOfCodeString(ytr, "base_component_id")

            var indexStart = readIn.indexOf("/*APP_START*/")
            var indexEnd = readIn.indexOf("/*APP_END*/")

            var indexOfSqliteData = readIn.indexOf("var sqlitedata = '")
            var indexOfSqliteDataEnd = readIn.indexOf("'//sqlitedata")

            var sqlitedatafromupload = null
            if ((indexOfSqliteData != -1) && (indexOfSqliteDataEnd != -1)) {
                sqlitedatafromupload = readIn.substring( indexOfSqliteData + 18,
                                                                    indexOfSqliteDataEnd)
            }

            forkedProcesses["forked"].send({
                                                message_type:           "save_code_from_upload",
                                                base_component_id:      bci,
                                                parent_hash:            null,
                                                code:                   ytr,
                                                client_file_upload_id:  client_file_upload_id,
                                                options:                {save_html: true, fast_forward_database_to_latest_revision: true},
                                                sqlite_data:            sqlitedatafromupload
                                           });
          }
      } else if ((ext == "js") || (ext == "yazz") || (ext == "pilot"))  {
              var localp2;
              localp2 =  path.join(userData,  'uploads/' + ifile.filename);
              var localp = localp2 + '.' + ext;
              fs.renameSync(localp2, localp);
              var readIn = fs.readFileSync(localp).toString()
              var bci = saveHelper.getValueOfCodeString(readIn, "base_component_id")



                forkedProcesses["forked"].send({
                                                    message_type:           "save_code_from_upload",
                                                    base_component_id:      bci,
                                                    parent_hash:            null,
                                                    code:                   readIn,
                                                    client_file_upload_id:  client_file_upload_id,
                                                    options:                {save_html: true, fast_forward_database_to_latest_revision: false},
                                                    sqlite_data:            ""
                                               });

      } else {
        outputDebug('Ignoring file ');

      }


};





function file_uploadFn(req, res, next) {
      //console.log('-------------------------------------------------------------------------------------');
      //console.log('-------------------------------------------------------------------------------------');
      //console.log('-------------------------------------------------------------------------------------');
      //console.log('-------------------------------------------------------------------------------------');
      //console.log('-------------------------------------------------------------------------------------');

      //console.log(JSON.stringify(req.files.length));
      //console.log("client_file_upload_id: " + JSON.stringify(req.body.client_file_upload_id,null,2))
      var client_file_upload_id = req.body.client_file_upload_id
      //console.log("**FILES** " + JSON.stringify(req.files));
      //console.log(    "    next: " + JSON.stringify(next));


      //console.log('......................................................................................');
      //console.log('......................................................................................');
      //console.log('......................................................................................');
      //console.log('......................................................................................');
      //console.log('......................................................................................');
      res.status( 200 ).send( req.files );

      var ll = req.files.length;
      for (var i = 0; i < ll ; i ++) {
          //console.log('Loading saved Creator app' );
          var ifile = req.files[i];
          //console.log("        " + JSON.stringify(ifile));
          var ext = ifile.originalname.split('.').pop();
          ext = ext.toLowerCase();
          //console.log('Ext: ' + ext);
          if ((ext == "html") || (ext == "html")) {
          var localp2;
          localp2 =  path.join(userData,  'uploads/' + ifile.filename);
              var localp = localp2 + '.' + ext;
              fs.renameSync(localp2, localp);
              var readIn = fs.readFileSync(localp).toString()
              //console.log('');
              //console.log('Local saved path: ' + localp);
              var indexStart = readIn.indexOf("/*APP_START*/")
              var indexEnd = readIn.indexOf("/*APP_END*/")
              //console.log(`indexStart: ${indexStart}`)
              //console.log(`indexEnd: ${indexEnd}`)
              if ((indexStart > 0) && (indexEnd > 0)) {
                indexStart += 13 + 10
                indexEnd -= 2
                var tts = readIn.substring(indexStart,indexEnd)
                //console.log(tts)
                var ytr = unescape(tts)
                outputDebug("SENDINF FROM UPLAOD___=+++****")
                var bci = saveHelper.getValueOfCodeString(ytr, "base_component_id")

                var indexStart = readIn.indexOf("/*APP_START*/")
                var indexEnd = readIn.indexOf("/*APP_END*/")

                var indexOfSqliteData = readIn.indexOf("var sqlitedata = '")
                var indexOfSqliteDataEnd = readIn.indexOf("'//sqlitedata")

                var sqlitedatafromupload = null
                if ((indexOfSqliteData != -1) && (indexOfSqliteDataEnd != -1)) {
                    sqlitedatafromupload = readIn.substring( indexOfSqliteData + 18,
                                                                        indexOfSqliteDataEnd)
                }

                forkedProcesses["forked"].send({
                                                    message_type:           "save_code_from_upload",
                                                    base_component_id:      bci,
                                                    parent_hash:            null,
                                                    code:                   ytr,
                                                    client_file_upload_id:  client_file_upload_id,
                                                    options:                {save_html: true, fast_forward_database_to_latest_revision: true},
                                                    sqlite_data:            sqlitedatafromupload
                                               });
              }
          } else if ((ext == "js") || (ext == "yazz") || (ext == "pilot"))  {
                  var localp2;
                  localp2 =  path.join(userData,  'uploads/' + ifile.filename);
                  var localp = localp2 + '.' + ext;
                  fs.renameSync(localp2, localp);
                  var readIn = fs.readFileSync(localp).toString()
                  var bci = saveHelper.getValueOfCodeString(readIn, "base_component_id")



                    forkedProcesses["forked"].send({
                                                        message_type:           "save_code_from_upload",
                                                        base_component_id:      bci,
                                                        parent_hash:            null,
                                                        code:                   readIn,
                                                        client_file_upload_id:  client_file_upload_id,
                                                        options:                {save_html: true, fast_forward_database_to_latest_revision: false},
                                                        sqlite_data:            ""
                                                   });

          } else {
            outputDebug('Ignoring file ');

          }

    }

};










function code_uploadFn(req, res) {

        forkedProcesses["forked"].send({
                                            message_type:           "save_code_from_upload",
                                            parent_hash:            null,
                                            code:                   "function(args) {  /* rest_api('test3') */ return {ab: 163}}",
                                            options:                {save_html: true},
                                            sqlite_data:            ""
                                       });



};










function keycloakProtector(params) {
    return function(req,res,next) {
        next()
        return
        var appName2=null
        if (params.compIdFromReqFn) {
            appName2 = params.compIdFromReqFn(req)
        }
        dbsearch.serialize(
            function() {
                var stmt = dbsearch.all(
                    "SELECT code FROM system_code where base_component_id = ? and code_tag = ?; ",
                    appName2,
                    "LATEST",

                    function(err, results)
                    {
                        if (results.length == 0) {
                            outputDebug("Could not find component : " + appName2)
                        } else {
                            outputDebug("Found code for : " + appName2)
                            var fileC = results[0].code.toString()
                            //console.log("Code : " + fileC)

                            var sscode = saveHelper.getValueOfCodeString(fileC,"keycloak",")//keycloak")
                            //console.log("sscode:" + sscode)


                            if (sscode) {
                                //var ssval = eval( "(" + sscode + ")")
                                //console.log("keycloak: " + JSON.stringify(sscode,null,2))

                                keycloak.protect()(req, res, next)

                            } else {
                                next()
                            }

                        }

                    })
        }, sqlite3.OPEN_READONLY)
    }
}



//------------------------------------------------------------
// This starts all the system services
//------------------------------------------------------------
function startServices() {
    if (useHttps) {

        var app2             = express()

        var newhttp = http.createServer(app2);
        app2.use(compression())
        app2.get('/', function (req, res, next) {
            return getRoot(req, res, next);
        })


        app2.get('*', function(req, res) {
             if (req.headers.host.toLowerCase().endsWith('canlabs.com')) {
                outputDebug("path: " + req.path)

                var rty = req.path
                if (req.path == "/canlabs") {
                    rty = "/canlabs/index.html"
                }

                var fileNameRead = path.join(__dirname, '../public' + rty)
                res.end(fs.readFileSync(fileNameRead));


             } else if (  req.path.indexOf(".well-known") != -1  ) {
                var fileNameRead = path.join(__dirname, '../public' + req.path)
                res.end(fs.readFileSync(fileNameRead));


             } else {
                 outputDebug("Redirect HTTP to HTTPS")
                 res.redirect('https://' + req.headers.host + req.url);
             }
        })

        newhttp.listen(80);
    }


    app.use(compression())
    app.use(cors({ origin: '*' }));
    app.use(function (req, res, next) {

        // Website you wish to allow to connect
        res.header('Access-Control-Allow-Origin', '*');

        // Request methods you wish to allow
        res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

        // Request headers you wish to allow
        res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

        // Set to true if you need the website to include cookies in the requests sent
        // to the API (e.g. in case you use sessions)
        res.setHeader('Access-Control-Allow-Credentials', false);

        // Pass to next layer of middleware
        next();
    });


    //------------------------------------------------------------------------------
    // Show the default page for the different domains
    //------------------------------------------------------------------------------



    app.get('/', function (req, res, next) {
        return getRoot(req, res, next);
    })


    app.get('/live-check',(req,res)=> {
       outputDebug("Live check passed")
       res.send ("Live check passed");
    });
    app.get('/readiness-check',(req,res)=> {
        if (systemReady) {
            outputDebug("Readiness check passed")
            res.send ("Readiness check passed");
        } else {
            outputDebug("Readiness check failed")
            res.status(500).send('Readiness check did not pass');
        }
    });

    //------------------------------------------------------------------------------
    // Allow an app to be edited
    //------------------------------------------------------------------------------
    app.get('/edit/*', function (req, res) {
    	return getEditApp(req, res);
    })


    app.use("/files",   express.static(path.join(userData, '/files/')));


    function getAppNameFromHtml() {

    }

    function getBaseComponentIdFromRequest(req){
        var parts = req.path.split('/');
        var appHtmlFile = parts.pop() || parts.pop();

        var appName = appHtmlFile.split('.').slice(0, -1).join('.')
        return appName
    }
    //app.get('/app/*', keycloakProtector({compIdFromReqFn: getBaseComponentIdFromRequest}), function (req, res, next) {
    app.get('/app/*', function (req, res, next) {
        if (req.kauth) {
            outputDebug('Keycloak details from server:')
            outputDebug(req.kauth.grant)
        }
        var parts = req.path.split('/');
        var appHtmlFile = parts.pop() || parts.pop();

        //console.log("appHtemlFile: " + appHtmlFile);

        var appName = appHtmlFile.split('.').slice(0, -1).join('.')
        //console.log("appName: " + appName);

         //console.log("path: " + path);

         var appFilePath = path.join(userData, 'apps/' + appHtmlFile)
         var fileC2 = fs.readFileSync(appFilePath, 'utf8').toString()
         res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
         res.end(fileC2);


    })

    //app.use("/app_dbs", express.static(path.join(userData, '/app_dbs/')));

    app.use("/public/aframe_fonts", express.static(path.join(__dirname, '../public/aframe_fonts')));
    app.use(            express.static(path.join(__dirname, '../public/')))
    app.use(bodyParser.json()); // support json encoded bodies
    app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies








    app.post('/file_upload_single', upload.single( 'uploadfilefromhomepage' ), function (req, res, next) {
        return file_uploadSingleFn(req, res, next);
    });

    app.post('/file_upload', upload.array( 'file' ), function (req, res, next) {
        return file_uploadFn(req, res, next);
    });

    app.get('/code_upload', function (req, res, next) {
        code_uploadFn(req, res);

        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        res.end("Done");
    });





    app.get('/send_client_details', function (req, res) {
    	return send_client_detailsFn(req, res);
    })


    app.get('/lock', function (req, res) {
        return lockFn(req, res);
    })


    process.on('uncaughtException', function (err) {
      outputDebug(err);
    })



    //------------------------------------------------------------------------------
    // This is called by the central server to get the details of the last
    // client that connected tp the central server
    //------------------------------------------------------------------------------
    app.get('/get_connect', function (req, res) {
    	return get_connectFn(req, res);
    })

    //app.enable('trust proxy')


    app.get('/get_all_table', function (req, res) {
        var tableName = url.parse(req.url, true).query.tableName;
        var fields = url.parse(req.url, true).query.fields;

        //console.log("1 - get_all_table ,tableName: " + tableName)
        //console.log("    get_all_table ,fields: "    + fields)

        var seqNum = queuedResponseSeqNum;
        queuedResponseSeqNum ++;
        queuedResponses[seqNum] = res;
        //console.log("2 - get_search_results")
        forkedProcesses["forked"].send({
                        message_type:               "get_all_tables",
                        seq_num:                    seqNum,
                        table_name:                 tableName,
                        fields:                     fields
                        });    });

    app.post('/add_new_connection', function (req, res) {
    		return add_new_connectionFn(req, res)
    });



    app.post('/add_new_query',function (req, res) {
        return add_new_queryFn(req, res)
    });





    //------------------------------------------------------------------------------
    // run on the central server only
    //
    // This is where the client sends its details to the central server
    //------------------------------------------------------------------------------
    app.get('/client_connect', function (req, res) {

        //console.log("1 - client_connect: ")
        var queryData = url.parse(req.url, true).query;

		var requestClientInternalHostAddress = req.query.requestClientInternalHostAddress;
        //console.log("    requestClientInternalHostAddress: "  + requestClientInternalHostAddress)

		var requestClientInternalPort        = req.query.requestClientInternalPort;
        //console.log("    requestClientInternalPort: "  + requestClientInternalPort)

		var requestVia                       = findViafromString(req.headers.via);
        //console.log("    requestVia: "  + requestVia)

		var requestClientPublicIp            = req.ip;
        //console.log("    requestClientPublicIp: "  + requestClientPublicIp)

        var clientUsername                   = req.query.clientUsername;
        //console.log("    clientUsername: "  + clientUsername)

		//requestClientPublicHostName      = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
		var requestClientPublicHostName      = "req keys::" + Object.keys(req) + ", VIA::" + req.headers.via + ", raw::" + JSON.stringify(req.rawHeaders);
        //console.log("    requestClientPublicHostName: "  + requestClientPublicHostName)





        var seqNum = queuedResponseSeqNum;
        queuedResponseSeqNum ++;
        queuedResponses[seqNum] = res;
        //console.log("2")
        forkedProcesses["forked"].send({   message_type:                       "client_connect",
                        seq_num:                            seqNum,
                        requestClientInternalHostAddress:   requestClientInternalHostAddress,
                        requestClientInternalPort:          requestClientInternalPort,
                        requestVia:                         requestVia,
                        requestClientPublicIp:              requestClientPublicIp,
                        clientUsername:                     clientUsername,
                        requestClientPublicHostName:        requestClientPublicHostName
                        });

    })






    //------------------------------------------------------------------------------
    // start the web server
    //------------------------------------------------------------------------------

    if (useHttps) {
        var caCerts = readCerts()
        var certOptions = {
          key: fs.readFileSync(privateKey, 'utf8'),
          cert: fs.readFileSync(publicCertificate, 'utf8'),
          ca: caCerts
        }
        certOptions.requestCert = true
        certOptions.rejectUnauthorized = false

        httpServer = https.createServer(certOptions,app)

    } else {
        httpServer = http.createServer(app)

    }
    socket = require('socket.io')
    httpServer.listen(port, hostaddress, function () {

            outputDebug("****HOST=" + hostaddress + "HOST****\n");
            outputDebug("****PORT=" + port+ "PORT****\n");
            outputDebug(typeOfSystem + ' started on port ' + port + ' with local folder at ' + process.cwd() + ' and __dirname = ' + __dirname+ "\n");




        //
        // We dont listen on websockets here with socket.io as often they stop working!!!
        // Crazy, I know!!!! So we removed websockets from the list of transports below
        //
        io = socket.listen(httpServer, {
            log: false,
            agent: false,
            origins: '*:*',
            transports: ['htmlfile', 'xhr-polling', 'jsonp-polling', 'polling']
        });

        io.on('connection', function (sck) {
            var connt = JSON.stringify(sck.conn.transport,null,2);
            websocketFn(sck)
        });

    })



      //console.log('addr: '+ hostaddress + ":" + port);





    setTimeout(function(){
        forkedProcesses["forked"].send({message_type:       'setUpPredefinedComponents'});


    },1000)

}






























function findLatestVersionOfApps( callbackFn) {
    dbsearch.serialize(
        function() {
            var stmt = dbsearch.all(
                "SELECT id,base_component_id,display_name, component_options FROM system_code where component_scope = ? and code_tag = ?; ",
                "app",
                "LATEST",

                function(err, results)
                {
                    if (results.length > 0) {
                        callbackFn(results)
                    } else {
                        callbackFn(null)
                    }

                })
    }, sqlite3.OPEN_READONLY)
}



function findDriversWithMethodLike(methodName, callbackFn) {
    dbsearch.serialize(
        function() {
            var stmt = dbsearch.all(
                "SELECT base_component_id FROM system_code where on_condition like '%" + methodName + "%'; ",

                function(err, results)
                {
                    if (results.length > 0) {
                        callbackFn(results)
                    } else {
                        callbackFn(null)
                    }

                })
    }, sqlite3.OPEN_READONLY)
}



function bytesToMb(bytes) {
    return (bytes / 1024 ) / 1024
}

function getChildMem(childProcessName,stats) {
    var memoryused = 0
    if (stats) {
        memoryused = stats.memory ;
        totalMem += memoryused
    }
    if (showStats) {
        outputDebug(`${childProcessName}: ${Math.round(bytesToMb(memoryused) * 100) / 100} MB`);
    }
}

function usePid(childProcessName,childprocess) {
    pidusage(childprocess.pid, function (err, stats) {
        getChildMem(childProcessName,stats)
        returnedmemCount ++
        if (returnedmemCount == allForked.length) {
            if (showStats) {
                outputDebug("------------------------------------")
                outputDebug(" TOTAL MEM = " + bytesToMb(totalMem) + " MB")
                outputDebug("------------------------------------")
            }
            inmemcalc = false
            yazzMemoryUsageMetric.set(totalMem)

        }
    });

}
if (statsInterval > 0) {
    setInterval(function(){
        if (!inmemcalc) {
            inmemcalc = true
            totalMem = 0
            const used = process.memoryUsage().heapUsed ;
            totalMem += used
            yazzProcessMainMemoryUsageMetric.set(used)
            if (showStats) {
                outputDebug(`Main: ${Math.round( bytesToMb(used) * 100) / 100} MB`);
            }
            allForked = Object.keys(forkedProcesses)
            returnedmemCount = 0
            for (var ttt=0; ttt< allForked.length; ttt++) {
                var childProcessName = allForked[ttt]
                const childprocess = forkedProcesses[childProcessName]

                usePid(childProcessName,childprocess)
            }
        }
    },(statsInterval * 1000))
}


function readCerts() {
    outputDebug("Checking CA certs" )
    outputDebug("-----------------" )
    outputDebug("" )
    outputDebug("CA Cert 1 = " + caCertificate1)
    outputDebug("CA Cert 2 = " + caCertificate2)
    outputDebug("CA Cert 3 = " + caCertificate3)
    outputDebug("" )
    outputDebug("" )


    let caCertsRet = []
    if (caCertificate1) {
        outputDebug("CA Cert 1 = " + caCertificate1)
        var fff = fs.readFileSync(caCertificate1, 'utf8')
        outputDebug("  = " + fff)
        caCertsRet.push(fff)
    }
    if (caCertificate2) {
        outputDebug("CA Cert 2 = " + caCertificate2)
        var fff = fs.readFileSync(caCertificate2, 'utf8')
        outputDebug("  = " + fff)
        caCertsRet.push(fff)
    }
    if (caCertificate3) {
        outputDebug("CA Cert 3 = " + caCertificate3)
        var fff = fs.readFileSync(caCertificate3, 'utf8')
        outputDebug("  = " + fff)
        caCertsRet.push(fff)
    }
    return caCertsRet
}
