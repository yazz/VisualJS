#!/usr/bin/env node

const ipfsAPI = require('ipfs-api');
const OnlyIpfsHash = require('ipfs-only-hash')
let isIPFSConnected = false
const ipfs = ipfsAPI('ipfs.infura.io', '5001', {protocol: 'https'})
let testBuffer = new Buffer("Testcode zooey11");
console.log("Starting...")
    ipfs.files.add(testBuffer, function (err, file) {
        if (err) {
          console.log("....................................Err: " + err);
        } else {
            isIPFSConnected = true

        }
        //console.log("....................................file: " + JSON.stringify(file,null,2))
        let thehash = file[0].hash
        //const validCID = "QmRntL1Gam7vDMNSsHbcUrWjueMJdJsBgF1wn1bx5pYcfo"
        const validCID = thehash

        ipfs.files.get(validCID, function (err, files) {
            files.forEach((file) => {
                console.log("....................................file.path: " + file.path)
                //console.log(file.content.toString('utf8'))
                console.log("....................................file.path: " + file.path)
            })
        })
      })




console.log("Done")
      //process.exit()


var childProcessNameInScheduler
var processesInUse                      = new Object()
var tryAgain                            = true
var nextCallId                          = 0
var callList                            = new Object
var processesRetryingCount              = 0

let visifile = null
const path = require("path");
const url = require('url');
var fork            = require2('child_process');
var fs = require2('fs');
var ip = require2('ip');
var isWin         = /^win/.test(process.platform);
var isLinux       = /^linux/.test(process.platform);
var isMac       = /^darwin/.test(process.platform);
var mainNodeProcessStarted = false;
var restRoutes = new Object()
var envVars = new Object()
var systemReady = false;
var httpServer = null;
var username                            = "Unknown user";
var isDocker        = require2('is-docker');
var ls = require2('ls-sync');
var rimraf = require2("rimraf");
let forge = require2('node-forge');
var db_helper                   = require("./db_helper")

var pidusage        = require2("pidusage");
var fs              = require2('fs');
var mkdirp          = require2('mkdirp')
var rmdir           = require2('rmdir-sync');
var uuidv1          = require2('uuid/v1');
var fork            = require2('child_process');
var express         = require2('express')
var http            = require2('http')
var https           = require2('https');
var app             = express()
var startupType     = null
var startupDelay    = 0
var isCodeTtyCode   = false
var yazzInstanceId  = uuidv1()
let certOptions     = null
var crypto                      = require('crypto');

var callbackIndex = 0;
var callbackList = new Object()


var stmtInsertDependency;
var stmtInsertIpfsHash;
var stmtInsertSubComponent;
var stmtInsertComponentList;
var stmtInsertAppList;
var stmtUpdateDriver;
var stmtDeleteDependencies;

var stmtInsertAppDDLRevision;
var stmtUpdateLatestAppDDLRevision;
var stmtInsertIntoAppRegistry
var stmtUpdateAppRegistry

var stmtDeleteTypesForComponentProperty;
var stmtDeleteAcceptTypesForComponentProperty;
var stmtInsertTypesForComponentProperty;
var stmtInsertComponentProperty;
var stmtInsertAcceptTypesForComponentProperty;

var copyMigration;
var stmtInsertNewCode
var stmtDeprecateOldCode

var setProcessToRunning;
var setProcessToIdle;
var setProcessRunningDurationMs;
var insertIntoProcessTable              = null;
var updateProcessTable                  = null;

var expressWs       = require2('express-ws')(app);
outputDebug("__filename: " + __filename)
outputDebug("__dirname: " + __dirname)

let nodeModulesPath = process.cwd()
if (process.execPath) {
    let vjsPos = process.execPath.indexOf("vjs")
    if (vjsPos != -1) {
        let vjsLen = process.execPath.length - vjsPos
        nodeModulesPath = process.execPath.substring(0, process.execPath.length - vjsLen);
    }
}
//console.log("process.cwd(): " + process.cwd())
//console.log("nodeModulesPath: " + nodeModulesPath)
//console.log("process.execPath: " + process.execPath)
//console.log("")
//console.log("nodeModulesPath: " + nodeModulesPath)
//console.log("")


outputDebug("Platform: " + process.platform)



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





function outputToBrowser(txt) {
    //var line = txt.toString().replace(/\'|\"|\n|\r"/g , "").toString()
    let line = txt.toString().replace(/\'/g , "").toString()
    let jsc = "document.write('<br>" + "" + line + " ')"
    //console.log(line);
    if (visifile) {
        if (visifile.webContents) {
            visifile.webContents.executeJavaScript(jsc);
        }
    } else {
        console.log(txt)
    }

}




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

function require2(npath) {
    return require(path.join(".",npath))
}



var request         = require2("request");
var perf            = require('./perf')
var compression     = require2('compression')

var program         = require2('commander');
var bodyParser      = require2('body-parser');
var multer          = require2('multer');
var cors            = require2('cors')
var saveHelper      = require('./save_helpers')





let sqlNodePath = path.join(nodeModulesPath,'node_modules/sqlite3')
//console.log("sqlNodePath: " + sqlNodePath)
var sqlite3                     = null
sqlite3                     = require(sqlNodePath);


var os              = require2('os')


var Keycloak =      require2('keycloak-connect');
var session =       require2('express-session');
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
let appDbs = {}

var port;
var hostaddress;
if (isWin) {
  hostaddress = "127.0.0.1"//ip.address();
} else {
  hostaddress = "0.0.0.0"//ip.address();
}

var hostaddressintranet;
hostaddressintranet = ip.address();
port = 80


var socket          = null


var io = null;
var forkedProcesses = new Object();
var timeout                             = 0;



var serverwebsockets                    = [];
var portrange                           = 3000
var locked;
var useHttps;
var serverProtocol                       = "http";
var privateKey;
var publicCertificate;
var caCertificate1;
var caCertificate2;
var caCertificate3;
var hostcount  							= 0;
var queuedResponses                     = new Object();
var queuedResponseSeqNum                = 1;
var executionProcessCount                       = 6;











app.use(compression())
app.use(sessObj);
app.use(express.json({ limit: '200mb' }));


app.use(keycloak.middleware({
          logout: '/c',
          admin: '/ad'
}));


var inmemcalc = false
var totalMem = 0
var returnedmemCount = 0
var allForked=[]
const apiMetrics = require2('prometheus-api-metrics');
app.use(apiMetrics())
const Prometheus = require2('prom-client');

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
    outputDebug("inputStdin: " + inputStdin)
});




if (process.argv.length > 1) {

    program
      .version('2021.0.1')
      .option('-a, --runapp [runapp]', 'Run the app with ID as the homepage (default not set) [runapp]', null)
      .option('-b, --virtualprocessors [virtualprocessors]', 'How many virtual processors to run (default 8 processors) [virtualprocessors]', 8)
      .option('-c, --runhtml [runhtml]', 'Run using a local HTML page as the homepage (default not set) [runhtml]', null)
      .option('-de, --deleteonexit [deleteonexit]', 'Delete database files on exit (default true) [deleteonexit]', 'false')
      .option('-e, --debug [debug]', 'Allow to run NodeJS in debug mode (default false) [debug]', 'false')
      .option('-f, --cacert1 [cacert1]', 'Public HTTPS CA certificate 1 [cacert1]', null)
      .option('-ipfs_folder, --ipfs_folder [ipfs_folder]', 'Public folder to use as IPFS Cache [ipfs_folder]', null)
      .option('-g, --cacert2 [cacert2]', 'Public HTTPS CA certificate 2 [cacert2]', null)
      .option('-h, --loadjsfile [loadjsfile]', 'Load the following JS from a file (default not set) [loadjsfile]', null)
      .option('-i, --cacert3 [cacert3]', 'Public HTTPS CA certificate 3 [cacert3]', null)
      .option('-j, --host [host]', 'Server address of the host (default 66.175.218.175) [host]', '66.175.218.175')
      .option('-ch, --centralhost [centralhost]', 'Server address of the central host (default 66.175.218.175) [centralhost]', '66.175.218.175')
      .option('-k, --statsinterval [statsinterval]', 'Allow to show debug info every x seconds (default 10 seconds) [statsinterval]', 10)
      .option('-l, --showstats [showstats]', 'Allow to show stats debug info (default false) [showstats]', 'false')
      .option('-m, --showprogress [showprogress]', 'Show progress when starting Visual Javascript (default false) [showprogress]', 'false')
      .option('-mjms, --maxJobProcessDurationMs [maxJobProcessDurationMs]', 'Maximum time to wait for a job to complete (default 10000 ms) [maxJobProcessDurationMs]', 10000)
      .option('-n, --locked [locked]', 'Allow server to be locked/unlocked on start up (default true) [locked]', 'true')
      .option('-o, --maxprocessesretry [maxprocessesretry]', 'Number of processes to retry when all cores are busy (default 10 processes) [maxprocessesretry]', 10)
      .option('-ph, --public [public]', 'Public HTTPS certificate [public]', null)
      .option('-q, --port [port]', 'Which port should I listen on? (default 80) [port]', parseInt)
      .option('-r, --https [https]', 'Run using a HTTPS (default is http) [https]', 'false')
      .option('-s,  --hostport [hostport]', 'Server port of the host (default 443) [hostport]', 443)
      .option('-cp, --centralhostport [centralhostport]', 'Server port of the central host (default 443) [centralhostport]', 443)
      .option('-t, --usehost [usehost]', 'Use host name [usehost]', null)
      .option('-u, --loadjsurl [loadjsurl]', 'Load the following JS from a URL (default not set) [loadjsurl]', null)
      .option('-w, --deleteonstartup [deleteonstartup]', 'Delete database files on startup (default true) [deleteonstartup]', 'true')
      .option('-x, --private [private]', 'Private HTTPS key [private]', null)
      .option('-y, --showdebug [showdebug]', 'Allow to show debug info (default false) [showdebug]', 'false')
      .option('-z, --loadjscode [loadjscode]', 'Load the following JS from the command line (default not set) [loadjscode]', null)
      .option('-lh, --useselfsignedhttps [useselfsignedhttps]', 'Use self signed HTTPS for local development (default false) [useselfsignedhttps]', 'false')
      .option('-jc, --jaegercollector [jaegercollector]', 'jaeger collector endpoint (default not set) eg: http://localhost:14268/api/traces [jaegercollector]', null)
      .parse(process.argv);
} else {
    program.host = '66.175.218.175'
    program.hostport = '443'
    program.centralhost = '66.175.218.175'
    program.centralhostport = '443'
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
var semver = require2('semver')
const initJaegerTracer = require2("jaeger-client").initTracer;
const {Tags, FORMAT_HTTP_HEADERS} = require2('opentracing')





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

let ipfsFolder = "ipfs_cache"
if (program.ipfs_folder) {
    ipfsFolder = program.ipfs_folder
}
let fullIpfsFolderPath


var showStats = false
if (program.showstats == 'true') {
    showStats = true;
}
outputDebug("       showStats: " + showStats );

var useSelfSignedHttps = false
if (program.useselfsignedhttps == 'true') {
    useSelfSignedHttps = true;
}
outputDebug("       useSelfSignedHttps: " + useSelfSignedHttps );




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

envVars.IP_ADDRESS = ip.address()
envVars.HOST = program.host
envVars.HOSTPORT = program.hostport
envVars.CENTRALHOST = program.centralhost
envVars.CENTRALHOSTPORT = program.centralhostport

let jaegerConfig = null
var jaegercollector = program.jaegercollector;
if (isValidObject(envVars.jaegercollector)) {
    jaegercollector = envVars.jaegercollector
}


let tracer = null
const jaegerOptions = { };
if (jaegercollector) {
    jaegerConfig = {
        serviceName: "Visual_Javascript",
        sampler: {
            type: "const",
            param: 1
        },
        reporter: {
            collectorEndpoint: jaegercollector,
            logSpans: true
        }
    }
    console.log("Trying to connect to Jaeger at " + jaegercollector)
}






function isValidObject(variable){
    if ((typeof variable !== 'undefined') && (variable != null)) {
        return true
    }
    return false
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





if (useSelfSignedHttps) {
    forge.options.usePureJavaScript = true;

    var pki = forge.pki;
    var keys = pki.rsa.generateKeyPair(2048);
    var cert = pki.createCertificate();

    cert.publicKey = keys.publicKey;
    cert.serialNumber = '01';
    cert.validity.notBefore = new Date();
    cert.validity.notAfter = new Date();
    cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear()+1);

    var attrs = [
         {name:'commonName',value:'yazz.com_' + uuidv1() }
        ,{name:'countryName',value:'UK'}
        ,{shortName:'ST',value:'Surrey'}
        ,{name:'localityName',value:'Redhill'}
        ,{name:'organizationName',value:'AppShare'}
        ,{shortName:'OU',value:'Test'}
    ];
    cert.setSubject(attrs);
    cert.setIssuer(attrs);
    cert.sign(keys.privateKey);

    var pem_pkey = pki.publicKeyToPem(keys.publicKey);
    var pem_cert = pki.certificateToPem(cert);

    console.log(pem_pkey);
    console.log(pem_cert);


    //https.createServer( { key:pem_pkey, cert:pem_cert },(req,res)=>
    //https.createServer( { key: pki.privateKeyToPem(keys.privateKey), cert:pem_cert },(req,res)=>
    //{
    //  res.writeHead(200, {'Content-Type': 'text/plain'});
    //  res.end('Hello World\n');
    //}).listen(443);

    certOptions = {
                      key: pki.privateKeyToPem(keys.privateKey)
                      ,
                      cert:pem_cert
                  }
    useHttps = true
}

if (useHttps) {
    serverProtocol = "https"
}
outputDebug("useHttps: " + useHttps)
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
outputDebug("port: " + port)
var runapp = program.runapp
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









function setUpChildListeners(processName, fileName, debugPort) {

    forkedProcesses[processName].on('close', async function() {
        if (!shuttingDown) {
            outputDebug("Child process " + processName + " exited.. restarting... ")



            var stmtInsertProcessError = dbsearch.prepare(  ` insert into
                                                                  system_process_errors
                                                              (   id,
                                                                  timestamp,
                                                                  process,
                                                                  yazz_instance_id,
                                                                  status,
                                                                  base_component_id,
                                                                  event,
                                                                  system_code_id,
                                                                  args,
                                                                  error_message )
                                                              values
                                                                  ( ?,  ?,  ?,  ?,  ?,  ?,  ?,  ?,  ? , ? );`)
            dbsearch.serialize(function() {
                dbsearch.run("begin exclusive transaction");
                var newId = uuidv1()
                stmtInsertProcessError.run(
                      newId,
                      new Date().getTime(),
                      processName,
                      yazzInstanceId,
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


    forkedProcesses[processName].on('message', async function(msg) {
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

             let saveResult =await saveCodeV2(  msg.base_component_id,
                                                msg.parent_hash  ,
                                                msg.code,
                                                msg.options)
             //async function saveCodeV2( baseComponentId, parentHash, code , options) {












    //------------------------------------------------------------------------------
    //
    // This is the last thing that happens when AppShare is started
    //
    //
    //
    //------------------------------------------------------------------------------
    } else if (msg.message_type == "drivers_loaded_by_child") {
        await finalizeYazzLoading();





        //------------------------------------------------------------------------------
        //
        //
        //
        //
        //
        //------------------------------------------------------------------------------
        } else if (msg.message_type == "database_setup_in_child") {



            if (msg.child_process_name.startsWith("forkedExeProcess")) {
                setUpSql()
                forkedProcesses[msg.child_process_name].send({ message_type: "setUpSql" });


                startNode({    message_type:    "startNode",
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

            processor_free({
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

              function_call_request({
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
          function_call_response({
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
          //console.log("*) "+ msg.result)
          if (msg.child_process_name) {
              return_response_to_function_caller({
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
    var debugArgs = [];
    if (debug) {
        if (semver.gte(process.versions.node, '6.9.0')) {
            //debugArgs = ['--inspect=' + debugPort];
            debugArgs = [];
        } else {
            //debugArgs = ['--debug=' + debugPort];
            debugArgs = [];
        };
    };
    var forkedProcessPath

    if (isWin) {
        forkedProcessPath = path.join(__dirname, '..\\src\\' + fileName)
    } else {
        forkedProcessPath = path.join(__dirname, '../src/' + fileName)
    }
    console.log("forkedProcessPath: " + forkedProcessPath)
    forkedProcesses[  processName  ] = fork.fork(forkedProcessPath, [], {execArgv: debugArgs,
    env: {}});




    setUpChildListeners(processName, fileName, debugPort);




    for (var i=0;i<executionProcessCount; i++ ) {
        var exeProcName = "forkedExeProcess" + i
        if (processName == exeProcName) {

            forkedProcesses[exeProcName].send({  message_type: "init" ,
                                                 user_data_path: userData,
                                                 child_process_name: exeProcName,
                                                 show_debug: showDebug,
                                                 show_progress: showProgress,
                                                 yazz_instance_id: yazzInstanceId,
                                                 jaeger_collector: jaegercollector
                                              });

      }

    }



    outputDebug("Started subprocess '" + processName + "' ")

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


async function setupVisifileParams() {


    outputDebug('-------* Port: ' + port);
    outputDebug( ip.address() );

	//console.log('addr: '+ ip.address());
	//hostaddress = ip.address();
}




function shutDown() {
    outputDebug(" shutDown() called")
    if (!shuttingDown) {
        shuttingDown = true;

        if (dbsearch) {
            outputDebug("Database closing...")
            dbsearch.run("PRAGMA wal_checkpoint;")
            dbsearch.close(function(err){
                outputDebug("...database closed")

            })
        }
        let appDbNames = Object.keys(appDbs)
        for (let appDbIndex = 0; appDbIndex < appDbNames.length; appDbIndex ++) {
            let thisAppDb = appDbs[appDbNames[appDbIndex]]
            thisAppDb.run("PRAGMA wal_checkpoint;")
            thisAppDb.close(function(err){
                outputDebug("... " + appDbNames[appDbIndex] + " database closed")

            })
        }


        for (var i = 0; i < executionProcessCount; i++ ) {
            var exeProcName = "forkedExeProcess" + i
            forkedProcesses[exeProcName].kill();
            outputDebug("Killed Process " + exeProcName)
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

    if ( fs.existsSync( dddd ) ) {
        outputDebug("----------------------------------")
        outputDebug("Before delete :" + ls(dddd))
        outputDebug("----------------------------------")

        rimraf.sync(path.join(dddd,  'uploads/'));
        rimraf.sync(path.join(dddd,  'files/'));
        rimraf.sync(path.join(dddd,  'apps/'));
        rimraf.sync(path.join(dddd,  'app_dbs/'));
        rimraf.sync(path.join(dddd,  '*.visi'));
        rimraf.sync(path.join(dddd,  '*.visi*'));
    }

    outputDebug("----------------------------------")
    outputDebug("After delete" )
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
















function getPort () {
    outputDebug('** called getPort v2')




    if (useHttps) {
        if (!certOptions) {
            let caCerts = readCerts()
            certOptions = {
              key: fs.readFileSync(privateKey, 'utf8'),
              cert: fs.readFileSync(publicCertificate, 'utf8'),
              ca: caCerts
            }
        }
        certOptions.requestCert = true
        certOptions.rejectUnauthorized = false

        httpServer = https.createServer(certOptions,app)

    } else {
        httpServer = http.createServer(app)

    }


    httpServer.listen(port, hostaddress, function (err) {

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
    httpServer.on('listening', async function (err) {

            outputDebug('Can connect on ' + ip.address() +  ':' + port + ' :) ')

            await startServices()

    })
}











//------------------------------------------------------------------------------------------
//
//                                          checkForJSLoaded
//
// This checks to see if AppShare is started with custom code. This code is
// then loaded into AppShare either as a web app or it is run as a UI app
//
//
//
//------------------------------------------------------------------------------------------
async function checkForJSLoaded() {
    outputDebug("*********** In checkForJSLoaded() ************")

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
    try {
        if ((process.argv[2]) && (process.argv[2].startsWith("http://") || process.argv[2].startsWith("https://") )) {
            loadjsurl = process.argv[2]
            //console.log("inputStdin: " + inputStdin )
            if ((!inputStdin) || (inputStdin.length == 0)) {
                if ((process.argv[3]) && (!process.argv[3].startsWith("--"))) {
                    inputStdin = process.argv[3]
                }
            }

        } else if ((process.argv[2]) && (process.argv[2].endsWith(".js") || process.argv[2].endsWith(".pilot") || process.argv[2].endsWith(".jsa") || process.argv[2].endsWith(".vjs") || process.argv[2].endsWith(".yazz") )) {
            loadjsfile = process.argv[2]
            if ((!inputStdin) || (inputStdin.length == 0)) {
                if ((process.argv[3]) && (!process.argv[3].startsWith("--"))) {
                    inputStdin = process.argv[3]
                }
            }

        } else if ((process.argv[2]) && (!process.argv[2].startsWith("--"))) {
            loadjscode = process.argv[2]
            outputDebug("load code: " + loadjscode )
            //console.log("inputStdin: " + inputStdin )
            //console.log("load code: " + loadjscode )
            if ((!inputStdin) || (inputStdin.length == 0)) {
                if ((process.argv[3]) && (!process.argv[3].startsWith("--"))) {
                    inputStdin = process.argv[3]
                }
            }
        }
    } catch(err) {
        console.log("Error in checkForJSLoaded: " + err)
    }



    if (isValidObject(envVars.loadjscode)) {
        loadjscode = envVars.loadjscode
    }


    let promise = new Promise(async function(returnFn) {
        if (isValidObject(loadjsurl)) {
            outputDebug("*********** Using loadjsurl ************")
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
                 (async function() {await saveCodeV2(  baseComponentIdForUrl,
                                                    null  ,
                                                    data,
                                                    {
                                                        make_public: true,
                                                        save_html:   true
                                                    })} ) ()

                 //async function saveCodeV2( baseComponentId, parentHash, code , options) {

                runapp = baseComponentIdForUrl
                let frontEndCode = isFrontEndOnlyCode(data)
                //console.log("frontEndCode: " + frontEndCode)
                if (frontEndCode){
                    //inputStdin = loadjscode
                } else {
                    //console.log("runapp: " + runapp)
                    //console.log("inputStdin: " + inputStdin)
                    startupType = "RUN_SERVER_CODE"
                    startupDelay = 1000
                }
                returnFn()
              });

            }).on("error", (err) => {
              outputDebug("Error: " + err.message);
              returnFn()
            });

        } else if (isValidObject(loadjsfile)) {
            outputDebug("*********** Using loadjsfile ************")

            var jsFile = loadjsfile

            var data2 = fs.readFileSync(jsFile).toString()
            var baseComponentIdForFile = saveHelper.getValueOfCodeString(data2, "base_component_id")
            if (!isValidObject(baseComponentIdForFile)) {
                baseComponentIdForFile = loadjsfile.replace(/[^A-Z0-9]/ig, "_");
            }

            //console.log("code from file:" + data2);
            //console.log("*********** Trying to load loadjsfile code *************")
            (async function() {let saveResult =await saveCodeV2(  baseComponentIdForFile,
                                                                  null  ,
                                                                  data2,
                                                                  {
                                                                      make_public: true,
                                                                      save_html:   true
                                                                   })
                                                                                })()
             //async function saveCodeV2( baseComponentId, parentHash, code , options) {
             runapp = baseComponentIdForFile
             let frontEndCode = isFrontEndOnlyCode(data2)
             //console.log("frontEndCode: " + frontEndCode)
             if (frontEndCode){
                 //inputStdin = loadjscode
             } else {
                 //console.log("runapp: " + runapp)
                 //console.log("inputStdin: " + inputStdin)
                 startupType = "RUN_SERVER_CODE"
                 startupDelay = 1000
             }
             returnFn()

         } else if (isValidObject(loadjscode)) {
             outputDebug("*********** Using loadjscode ************")
             setUpSql()
             var data2 = loadjscode
             var baseComponentIdForCode = saveHelper.getValueOfCodeString(data2, "base_component_id")
             outputDebug("baseComponentIdForCode:" + baseComponentIdForCode);
             if (!isValidObject(baseComponentIdForCode)) {
                 baseComponentIdForCode = "code_" + (("" + Math.random()).replace(/[^A-Z0-9]/ig, "_"));
                 outputDebug("baseComponentIdForFile:" + baseComponentIdForCode);
             }

             //console.log("code:" + data2);
             outputDebug("*********** Trying to load loadjscode code *************")


              let saveResult =await saveCodeV2(  baseComponentIdForCode,
                                                 null  ,
                                                 data2,
                                                 {
                                                     make_public: true,
                                                     save_html:   true
                                                  })
              //async function saveCodeV2( baseComponentId, parentHash, code , options) {





              runapp = baseComponentIdForCode
              //console.log("baseComponentIdForCode: " + baseComponentIdForCode)
              //console.log("runapp: " + runapp)
              let frontEndCode = isFrontEndOnlyCode(loadjscode)
              //console.log("frontEndCode: " + frontEndCode)
              if (frontEndCode){
                  //inputStdin = loadjscode
              } else {
                  //console.log("runapp: " + runapp)
                  //console.log("inputStdin: " + inputStdin)
                  startupType = "RUN_SERVER_CODE"
                  startupDelay = 1000
              }
              returnFn()

         } else {
             returnFn()

         }
     })
     var ret = await promise


     return
}




//------------------------------------------------------------------------------------------
//
//                                          checkForJSLoaded
//
// This checks to see if AppShare is started with custom code. This code is
// then loaded into AppShare either as a web app or it is run as a UI app
//
//
//
//------------------------------------------------------------------------------------------
async function isTtyCode() {
    outputDebug("*********** In isTtyCode() ************")

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
    try {
        if ((process.argv[2]) && (process.argv[2].startsWith("http://") || process.argv[2].startsWith("https://") )) {
            loadjsurl = process.argv[2]

        } else if ((process.argv[2]) && (process.argv[2].endsWith(".js") || process.argv[2].endsWith(".pilot") || process.argv[2].endsWith(".jsa") || process.argv[2].endsWith(".vjs") || process.argv[2].endsWith(".yazz"))) {
            loadjsfile = process.argv[2]

        } else if ((process.argv[2]) && (!process.argv[2].startsWith("--"))) {
            loadjscode = process.argv[2]
            outputDebug("load code: " + loadjscode )
            //console.log("load code: " + loadjscode )
        }
    } catch(err) {
        console.log("Error in checkForJSLoaded: " + err)
    }



    if (isValidObject(envVars.loadjscode)) {
        loadjscode = envVars.loadjscode
    }


    let promise = new Promise(async function(returnFn) {
        if (isValidObject(loadjsurl)) {
            var jsUrl = loadjsurl
            https.get(jsUrl, (resp) => {
              var data = '';

              resp.on('data', (chunk) => {
                data += chunk;
              });

              resp.on('end', () => {
                  let ttyCode = isFrontEndOnlyCode(data)
                  returnFn(!ttyCode)
              });

            }).on("error", (err) => {
              outputDebug("Error: " + err.message);
              returnFn(false)
            });



        } else if (isValidObject(loadjsfile)) {
            var jsFile = loadjsfile

            var data2 = fs.readFileSync(jsFile).toString()
            let ttyCode = isFrontEndOnlyCode(data2)
            returnFn(!ttyCode)

         } else if (isValidObject(loadjscode)) {
             let ttyCode = isFrontEndOnlyCode(loadjscode)
             returnFn(!ttyCode)

         } else {
             returnFn(false)

         }
     })
     let ttyCodeRet = await promise


     return ttyCodeRet
}





function isFrontEndOnlyCode(code) {
    if (!code){
        return false
    }
    if (code.indexOf("Vue.") != -1) { return true }
    if (code.indexOf("only_run_on_server(") != -1) { return false }
    if (code.indexOf("only_run_on_frontend(") != -1) { return true }
    if (code.indexOf("rest_api(") != -1) { return false }
    return false
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
        try {
            files = fs.readdirSync( source );
            files.forEach( function ( file ) {
                var curSource = path.join( source, file );
                if ( fs.lstatSync( curSource ).isDirectory() ) {
                    try {
                        copyFolderRecursiveSync( curSource, targetFolder );
                    } catch(err) {
                        outputDebug(err)
                    }
                } else {
                    try {
                        copyFileSync( curSource, targetFolder );
        				//console.log('copying:  ' + targetFolder);
                    } catch(err) {
                        outputDebug(err)
                    }
                }
            } );

        } catch(err) {
            outputDebug(err)
        }
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
        if (!canAccess(req,res)) {
            return;
        }
        res.end(fs.readFileSync(homepage));
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
    //var homepageUrl = serverProtocol + '://yazz.com/visifile/index.html?time=' + new Date().getTime()
    //var homepageUrl = serverProtocol + '://www.yazz.com'
    var homepageUrl = 'https://www.yazz.com'
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
    sendOverWebSockets({
                        type:   "send_is_win",
                        value:   isWin
                        });

    ws.on('message', async function(msg) {
        var receivedMessage = eval("(" + msg + ")");
        //console.log(" 1- Server recieved message: " + JSON.stringify(receivedMessage));

        // if we get the message "server_get_all_queries" from the web browser
        if (receivedMessage.message_type == "server_get_all_queries") {

            var seqNum = queuedResponseSeqNum;
            queuedResponseSeqNum ++;
            queuedResponses[seqNum] = ws;






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








        } else if (receivedMessage.message_type == "loadUiComponentsV2") {
            //console.log("***** } else if (msg.message_type == loadUiComponent) ")

            let componentItems = receivedMessage.find_components.items
            let componentIds = []
            let componentHashs = []
            let componentHashToIds = []
            for (let indexItems = 0 ; indexItems < componentItems.length ; indexItems ++ ) {
                let componentItem = componentItems[indexItems]
                if (componentItem.ipfsHashId) {
                    componentHashs.push(componentItem.ipfsHashId)
                    componentHashToIds.push(componentItem.baseComponentId)
                } else {
                    componentIds.push(componentItem.baseComponentId)
                }
            }

            //
            // read the database components
            //
            dbsearch.serialize(
                function() {
                    let stmt = dbsearch.all(
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




                //
                // read the IPFS components
                //
                for (let indexItems = 0 ; indexItems < componentHashs.length ; indexItems ++ ) {
                    let componentHash = componentHashs[indexItems]

                    let ret = await loadComponentFromIpfs(componentHash)
                    let z = 1
                    let r =z

                }
                setTimeout( function() {
                    dbsearch.serialize(
                        function() {
                            let stmt = dbsearch.all(
                                "SELECT  *  FROM   system_code   WHERE   base_component_id in " +
                                "("  + componentHashToIds.map(function(){ return "?" }).join(",") + " )" +
                                "   and   code_tag = 'LATEST' ",
                                componentHashToIds
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
                },200)









        //                                  ______
        // Browser  --Send me your data-->  Server
        //                                  ______
        //
        } else if (receivedMessage.message_type == "edit_static_app") {
            outputDebug("*** server got message from static app: edit_static_app")
            var sql_data = receivedMessage.sql_data
            var code_fn = receivedMessage.code_fn


            save_code_from_upload({
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








    } else if (receivedMessage.message_type == "browser_asks_server_for_data") {

        var seqNum = queuedResponseSeqNum;
        queuedResponseSeqNum ++;
        queuedResponses[seqNum] = ws;










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


            if (receivedMessage.find_component && receivedMessage.find_component.driver_name == "systemFunctionAppSql") {

                let resultOfSql = await executeSqliteForApp(  receivedMessage.args  )
                sendToBrowserViaWebSocket(
                                             ws
                                             ,
                                             {
                                                type:            "ws_to_browser_callDriverMethod_results",
                                                value:            resultOfSql,
                                                seq_num:          receivedMessage.seqNum
                                             });



            } else {
                callDriverMethod({
                                message_type:          "callDriverMethod",
                                find_component:         receivedMessage.find_component,
                                args:                   receivedMessage.args,
                                seq_num_parent:         seqNum,
                                seq_num_browser:        receivedMessage.seqNum
                            });
            }

        }
    });
};







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

            save_code_from_upload({
                                                message_type:           "save_code_from_upload",
                                                base_component_id:      bci,
                                                parent_hash:            null,
                                                code:                   ytr,
                                                client_file_upload_id:  client_file_upload_id,
                                                options:                {save_html: true, fast_forward_database_to_latest_revision: true},
                                                sqlite_data:            sqlitedatafromupload
                                           });
          }
      } else if ((ext == "js") || (ext == "yazz") || (ext == "pilot") || (ext == "jsa") || (ext == "vjs") || (ext == "yazz") )  {
              var localp2;
              localp2 =  path.join(userData,  'uploads/' + ifile.filename);
              var localp = localp2 + '.' + ext;
              fs.renameSync(localp2, localp);
              var readIn = fs.readFileSync(localp).toString()
              var bci = saveHelper.getValueOfCodeString(readIn, "base_component_id")



              save_code_from_upload({
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

                save_code_from_upload({
                                                    message_type:           "save_code_from_upload",
                                                    base_component_id:      bci,
                                                    parent_hash:            null,
                                                    code:                   ytr,
                                                    client_file_upload_id:  client_file_upload_id,
                                                    options:                {save_html: true, fast_forward_database_to_latest_revision: true},
                                                    sqlite_data:            sqlitedatafromupload
                                               });
              }
          } else if ((ext == "js") || (ext == "yazz") || (ext == "pilot") || (ext == "jsa") || (ext == "vjs") || (ext == "yazz")  )  {
                  var localp2;
                  localp2 =  path.join(userData,  'uploads/' + ifile.filename);
                  var localp = localp2 + '.' + ext;
                  fs.renameSync(localp2, localp);
                  loadAppFromFile(localp,client_file_upload_id)
          } else {
            outputDebug('Ignoring file ');

          }

    }

};





function file_name_load(req, res, next) {
      //console.log("params: " + JSON.stringify(req.query,null,2))
      loadAppFromFile(  req.query.file_name_load,
                        req.query.client_file_upload_id)
};




function loadAppFromFile(localp,client_file_upload_id) {
    console.log("loadAppFromFile(" + localp + "," + client_file_upload_id + ")")
    var readIn = fs.readFileSync(localp).toString()
    var bci = saveHelper.getValueOfCodeString(readIn, "base_component_id")



    save_code_from_upload({
                                          message_type:           "save_code_from_upload",
                                          base_component_id:      bci,
                                          parent_hash:            null,
                                          code:                   readIn,
                                          client_file_upload_id:  client_file_upload_id,
                                          options:                {
                                              save_html: true,
                                              fast_forward_database_to_latest_revision: false,
                                              save_code_to_file: localp
                                          },                                          sqlite_data:            ""
                                     });

}










function code_uploadFn(req, res) {

    save_code_from_upload({
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
async function startServices() {

    if (!isCodeTtyCode) {
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
            console.log("calling main page")
            console.log("jaeger: " + jaegercollector)
            return getRoot(req, res, next);
        })

        app.get('/topapps', function (req, res) {
            console.log("get top apps")
            let topApps = []
            topApps.push(
                {
                    //zzz
                    data: {
                        id: 123567
                        ,
                        logo: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoHCBYWFRgWFRUWGRgYFRgaEhgYFRgaGBEcGBgZGhgYGBocIS4lHB4rIRkaJjgmKy8xNTU1GiQ7QDs0Py40NTEBDAwMEA8QHxISHjErISsxMTE0NDQ2NDQ1NDE0PzQ0MTQ0NDE/NDQ0NDQ0NDQ0NDQ0MTE0NDQ0NDE0NDQ0NDQxNP/AABEIAOEA4QMBIgACEQEDEQH/xAAcAAADAAIDAQAAAAAAAAAAAAAAAQcCBgMEBQj/xABKEAABAgMDBgoGBwYFBQEAAAABAAIDESEEEjEHMkFhcdEGExQiNFGBkZKhBVNyk7GyM1Jzg7Pi8ESCosHCwyRCYnThFiNj0vFD/8QAFwEBAQEBAAAAAAAAAAAAAAAAAAECA//EACARAQEAAwEBAAMBAQEAAAAAAAABAhExEiEDMkFCgSL/2gAMAwEAAhEDEQA/AK+516gQx12hQ5t2oQ1t6p8kCYy7Uoc29UIY+9QpOddoNtUGTnXhIYoabtDtQ5t2oQ1t6p2UQYtZdMzgm9t6o2JNfeMjghzrtBtqgyc+8JDFDTdodqHMuiYxQ1t6p2UQYtbdMzhvTe29UbEg68bpw3JuddoNtUDc6YkMdyGm7Q7UObITGO9DW3qnZRBiGyN44b03NvVCQdM3ThuTc67QeaBudMSGO5DDdoUObITGO9DReqfJBiGyN44b03C9UJB0zdOG5Nxu0HmgZdMSGO5DTdx0oIkL2nek0XqnR1IEGyN7Rj3pvF7DQkHTN3Rh3JuN3DT1oGTMXdOHck03cdKZbIXtOPek0XsdHUgQbI3tGPem8XsNCQdM3dGHcm83cNPWgXEnUhLjzqTQDW3TMpubeqENfeofJDn3aDzQNzr1AhjrtChzbtR5oa29U7KIMWsumZwTe29UbEmvvGRTc67QbaoG514SGKGm7Q7UOZKoxQ1t6p2UQYht0zOCb23qjYk194yOCHOu0G2qDJzpiQx3IabtDtQ5shMY70NbeqdlEGIbI3jhvTe29UbEg68bpw3JuddoNtUDc6YkMdyGOu0KHNkJjHehrb1TsogxDZG8cN6bheqEg6ZunDcm43aDzQNzpiQx3IYbtCgtkJjHehovVOjqQYhsjeOG9NwvVCQdM3dG5Nxu0GnrQMmYu6cO5DTdx0oLZC9px70m87HR1IEGyN7Rj3pvF7DQkHTN3Rhrom83cNPWgZMxd04dyTDdx0pkSF7Tjqqk3nY6OpBnxw1oRxI1oQYvdOgxQx12hQ5t2o80NbeqfJBi1paZnBNzb1Qhr71D5Ie67QbaoG5wcJDFDHXaFBbdqPNDW3qnZRBi1paZnBN7b1RsQ196h8kOddoNtUDc4OEhihpu0O1DmXRMYoa29U7KIE1pBmcEPbeqNiQdeN04bk3Ou0G2qBudMSGO5DHXaFDmyExjvQ0XqnZRBi0EG8cN6bheqEB0zdOG5DnXaDbVA3EEXRjuQw3aFBbITGO9DReqfJBi0EG8cN6bheqEg6ZunDzom43aDT1oGXTEhjuQ03cUESF7T5VSaL1To6kCAIN44b03i9ggOmbujDXRDzdw09aBkzF3Th3IYbuOlF2QvacdVUm87HR1IEGyN7Rj3rKIL2GhYh0zd0Ya6JvN3DT1oMeJP6KaXHnUmgGgtqcF1vSltZChvjRHBrGDnHyAA0kkgAdZXaa69Q+S0LK1EIgwWA80xXOcOstYQPmKsS3UdO15UHFxEOzC5OhfEN46yGiTdkztXC3KhFH7ND8btyn6U1rzHP1W/tynRQZ8mh+N25N+U+Kf2aH43blP5omnmHqqC7KhFIlyeH43bkNyoRR+zQ/G7cp9NE08w9Vv7cp0UGfJofjduTflPin9mh+N25T+aJp5huqC7KhFIlyeH43bkNyoRR+zQ/G7cp+lNPMPVb+Mp0UGfJofjduTflPin9mh+N25T+aJp5h6qguyoRSJcnh+N25DMp8Ufs8Pxu3KfTRNPMPVb+Mp0UGfJofjduTflPin9mh+N25T+aE8w9VQXZUIpEuTw/G7chuU+KP2eH43blPiUAp5h6qgDKfFnPk0Pxu3IflPin9mh+N25aAlNPMX1VBOVCLKXJ4fjduSZlPij9mh+N25aAlNPMT1VAGU+LOfJofjduWbcp7yRfszbum7EcD2TbJTyaaeYvqr/wChfTMK1QREgk15rmkSdDcJTa4aD5GYXoMN3HSpfklikRY7Z04tjpaJhxAPc4qoN52OjqWbNVuXcZ8c39BCXEDWhRSc4OoMVPcrQlCs4OPGP+UKhFt2o81PcrRnDs5/8jx/CFces5cTFVrg1ZWGywCWMJMJsyWNJNNJkpKrDwZ6JA+yb8FqsR3eRw/Vs8DdyORw/Vs8Ddy7CEadfkcP1bPA3clyOH6tngbuXZQg63I4fq2eBu5eBw4szG2N5axgN9lQxoOe3SAtoWucO+hv9qH87VIVoXBVgNrgggEF5mCJg8x2IKrHI4fq2eBu5Sngn0yB7Z+RyritTFwcjh+rZ4G7k+Rw/Vs8Ddy5kIrh5HD9WzwN3I5HD9WzwN3LmQg4eRw/Vs8DdymvD2G1tqk1oaOKZQAAYu0BVBTHKB0v7pnxckSvaydwGOgxC5jHHjqXmgy5jOtdbKNCaziLjWtnxk7rQJyuSnLau9k2+gifbf0MXFlKhcyC/qe9vjaCPkKf0/jRLPDL3sZOV57Wz6rxAn5qx2X0VBhsaxsNkmiVWNJOtxIqSo7ZHhr2OODXscdgcCVbylMUn4YejW2e0lrBJj2iIwaGzJDmjUCD2ELDgjEAtcIOAc15cxwcAQbzTKh1yXr5SXjjoTdIhEnYXmXwK8Hg0wm1QAPWsPYDM+QKv8T+qvaLHDuP/wC2zMd/kb1HUoo3AK42nMf7DvgVDm4DYpFyb9kl6RGPVCbPxhVJ/Oze1S3JL0iMOuE35wqk83cNPWpetThcU79FCXHnUmstBgLanBaBlcM4dnIwvv8AlCoDXXqHyU/ytiUOzj/W8/whXHrN4mCunA+ytdYbMS2pgsnU9W1QtXvgZ0GzfYs+CuSY9d99lhgEkSAEyS4yAGk1Wi+meFzQS2zMaQDLjHlxva2NmKaz3L1coXpLi4LYLTIxSb/sNlMdpIGwEKdQYbnuaxom5zg1o6y4yA7yrjP7WcstXUeq3hNaZzvtOq4yXkJ+a2T0BwqhvIZaGNY5xk17S4MJOAcCebtnLYuG0cAnNhEti3ogbMtuyY8yzWmc59ROOrRpK1qVN5Y9XDkTPq+bt61bKPZmtsEQtEjfhaT6xutd/gT6TMezgOM3wzccTi4AAtcewgT6wV1spnQIntwvxGrnyunyzaY8CWg26zg4F5n7t6uPImfV83b1EOA3T7N7bvw3q8K0x48X01aoFmZfiDGjWgm889Qr56FoNt4Wxnk3Gsht0AAvd2ufQ9gC4eFvpMx7S8z5jCWQxoAaZOPa6Zn1S6ljwb9BOtT3NDrrWAF7pTInmtA6zI9xWpJJuueWVt1HLZuFUdp59x40hzZdxZKXmt54P+koFqYS1pa9suMYXEls9IM+c3X8FpPCjg06y3XNffY43QSJOa6U7p65gEg6j2+Z6H9IOs8ZkVs+aeeB/nac5vd5gJZLPhMrjdVY+RM+r5u3qP5TYYbbpNEhxLPi9WZjgQCKgiYPWDgo5lR6d9xD+L1mddMuNhyUQGus8YuE5R+s+rZ1LY+FPoFsezPY1k3ABzBM1c2shXEiY7V4WSLo8b/cf24a35LfpJuPn/kbPq+bt6oPobhVZxBa2O199jQ0loLhEkJAitCdM5Ca7HCfgeYjnRbPIOcSYkMmQedLmnAE6QaHGY06dF9B2lpkbPGnqhucO9oIWvlcv/WNdb01GbaIz4rmSnIMbecbjRRox7TrJXu5PvQbXxzFLObCBkZuq94kBjoaXHtHWl6L4HWmK4X28UzS52d+6zGe2QVI9Gej2QIbYcMSa3rxcTiSdJKZWSajWONt3WFtsbBDfzf8jtJ+qda+eGYDYvo+3fRv9h3ylfODMBsWcWsm+5Jvp440mC2XiCqbTdzuzSpbkm+njHqgt+cKpAXsdHUl6s4z41v6CEuIGtCy0TnA0GPcp7laEoVnBx4x/wAoVCLbtR5qfZWjOHZz/wCR4/hCuPWbxMFe+BnQbN9iz4KCK98DOg2b7FnwVyTHrScoUa9a7uhkJg7y5x+YLp8DIQdbYM8AXu8LHEeclycOemxNjPw2p8BOms9l/wAhW/8ALn/r/qsKKemoVy0RmjARngahfMvJWtRnhJ0qP9q/4rOHW/ycbFk0jSiRmfWYx3gcR/WvXymdAie3C/EavAyb9JifYO+di2DKZ0CJ7cL8RqX9lx/VM+A3T7N7bvkerla4t1j3fVa53hBP8lDeA3T7N7bvkerT6c6NH+wifI5TLpjxFQevtVKycQpWd7tLox7msYB5z71NVUMnnRPvXf0reXHPDrn4dQg6xRDpaWOGrntB8iVKFXOGfQo2xvztUkUw4v5OrFwYjX7JAcfVtB/d5v8AJTDKj037iH8Xqj8CehQdj/xHqcZUem/cQ/i9ZnW7+sbNki6PG/3H9uGt/WgZIujxv9x/bhrf1L1ZwIQhRoIQhB17d9G/2HfKV84MwGxfR9u+jf7DvlK+cGYDYtYsZN+yS9IjHRxTZ+MKpP52b26FLckvSIw64TfnCqTjdw09aXq48Li3fooRx51JrLRMBFXYd60DK4Zw7ORhff8AKFQGuvUPkp/lbEodnH+t5/hCuPWbxMFe+BnQbN9iz4KCK98DOg2b7FnwVyTHrQeHPTYmxnyNT4CdNZ7L/kK5soEK7ayfrw2O7pt/pXV4FRLtthT03m97Hy85Lf8Alz/1/wBVxRnhJ0qP9q/4qzKK+nX3rTHI0xoktgeQPgs4db/Jx72TfpMT7B3zsWwZTOgRPbhfiNXi5NIU4sV/1YbW+N0/6F7WUzoET24X4jUy/Zcf1TPgN0+ze275Hq0+nOjR/sInyOUW4DdPs3tu+R6uFvg34b2fWY5viaR/NTLpjxDlUMnnRPvXf0qXhUvJxEnZnD6sZ3m1h3reXHPDr0eGfQo2xvztUkVY4bvlYouu4B2xGfympOphxfydVrgT0KDsf+I9TjKj037iH8XqmcE4NyxwB1ww7xkv/qUzyo9N+4h/F6zOt39Y2fJF0aN/uP7cNcmUiO9nJ7rnNnxs7ri2cuLlOS4skXR43+4/tw1tvpb0LBtF3jml1y9ck9zZXpTzSJ5oTesl1vHSQcti+tieN+9HLYnrYnjfvVO/6Lsfq3e9if8Asj/oux+rd72J/wCy16jn4yTHlsT1sTxv3rv+gbXENpgAxHkGMyYL3EEXhOYmlwns8KHaHw4DbrGANPOc686U3GbicJyl/pXp5P7FftJeRzYTS79582t8r57FbzaSX1pSLd9G/wBh3ylfODMBsX0fbvo3+w75SvnBmA2LOLpk37JP9PHGniWy8YVTYbud2aVLMk308Y9UFvzhVIC9jo6lL1Zxnxjf0EJcQOsoWWicQaDHuU9ytCUKzg48Y/5QqE5t2oU+ytGcOzn/AMjx/CFces3iYK98DOg2b7FnwUEV74GdBs32LPgrkmPXiZR/R5cxkdozCWxPZeRdJ1B1P31oVltDob2PbnMcHN6ptM66lbo0Jr2ua4AtcCHA4EGhBU39NcCIrHF0AcYwmjZgPZqM5Bw1iupXHKa1WcsbvcezH4ewuKJYx/GltGkCTXSxLp1aO86lOyZ1NTpPXrXoD0FaZy5PGn9m4DvIktj9AcCHlwdaQGtBnxYILn6nEUa3YZnUtfMUvrJ7fAH0cYdnvuEnRXXh13AJM76u/eWOUzoET24X4jVtTRKgw+C1TKZ0CJ7cL8Rq573XTWsdJpwG6fZvbd+G9XhQfgN0+ze278N6vCtMeI5wm9HmBaHslzS4vh9Ra8kiWwzb+6u3wS4QCyveHhxhvAvXaljmzk4A4ipB7OqS37hF6CZamBpN17ZmG+U7s8QRpaaU1Kd27gtaoZIMFzxodD54dsA5w7QFqWWarncbLuO/ww4TNtDWw4QcGNdec5wkXOAIaAOoTOOmXVXXvR9jdGiMhMxe4N9kf5nbAJnsXdsvBu1PMmwHjW8XANfOl5Lf+C/BptmBc4h0Vwk5wzWDS1k67TploTck+ExuV+tghQw1rWtEg0ANHUAJBR7Kj077iH8XqyqNZUenfcQ/i9Zx66ZcbNki6PG+3/tw1v60DJF0eN9v/bhrf1MumPAur6RtYhQ3xHYMaXbZCg7TTtXZWnZRbfdgsgg1iOm72WSPm4t7ikm6uV1Np3FiF7nOcZuc4ucesuMye8qm8AbFxdmDyOdFcX67o5rRsoT+8ppZbO6I9jG5z3Na3UXECfmrdZ4LWMaxok1rQ1o6g0SHwW8r805/jn3bG3fRv9h3ylfODMBsX0fbvo3+w75SvnBmA2LOLWTfskvSI3VxTZ+MKpPrm9uhS3JN0iMOuC35wqk43cNPWl6uPCuO196EceeoJrLRNBFXYd60DK4Zw7ORhff8oVADr1Cp/lbEodnH+t5/hCuPWcuJgrzwMcOQ2av/AOLPgoMrDwYH+EgfZN+C1kzjW53h1jvReHWO9eBJElnTW3v3h1jvReHWO9eBJEk0be/eHWO9aplLP+Aie3C/Eau5Ja7w7H+Df7cP52qyfS340rgN0+ze278N6u14dY71A+CXTIHtn5HKuyTKJjfj37w6x3ovDrHevAkiSml29+8Osd6Lw6x3rwJIkmjb37w6x3qN5UT/AI77iH8XqiyUwyg9L+6h/FyuM+plfjcckR/w0b/cf24a328Osd6mGTYf9iL9t/QxbhJLPqy/Hv3h1jvUk4Y+kBFtTyCC1n/bZX6k738Rd5LbvTdt4iBEi6WMN2elxoweIhRg66nSetXGaZyu/ijZPrGH2gvMpQmz/edNrfK+exU68Osd6nnAOwXLMHkc6K4vPs5rPIT/AHlsklMvtXH5HsW5w4t9RmO+Ur5xZgNiuVpHMf7DvgVDW4DYrjEyrfsk/wBPH6+JbLxhVJtM7s0qW5Jvp4x6oLfnCqQ52NJKXrWPGd9v6CFjxA6yhZaDiDQY9yn2Vph4mAToiuBO1lPlPcqCWXahef6a9EMtcF0OJMB2aRixwzXtnpHmCRpVnUs3Hz+uVtpeBIPeAMAHuAHZNbbHycWsOIY6E9uh14sJGtpBkdhK4nZPbaMRC95+Vb3HPVazyqJ6x/jdvRyt/rH+N29bOcnVuGiF7z8qG5O7ccBC95+VNw1Wscrf6x/jdvRyqJ6x/jdvWzNyeW00lC95+VDsnltGIhe8/Km4arWeVv8AWP8AG7esX2h7hJz3kdRe4juJW0uydW4VlC95+VDcndtOAhe8/Km4arUmPIMwSCMCDIjtXNyqJ6x/jdvWytye20mUoXvP+E3ZPLaMRC95+VNw1Ws8qiesf43b0cqiesf43b1s7snVuAnKF7z8qG5O7acBC95+VNw1Wscqiesf43b0cqiesf43b1soye20mUoXvP8AhN2Ty2jEQveflTcNVrPKonrH+N29cT3lxm4knrJJPeVthydW4CcoXvPyobk7tpwEL3n5U3DVaqyM9tGvc3ruuIn3LPlcT1j/ABu3rZRk8ts5She8/wCE3ZPLaMRC95+VNw1WrvtD3CTnvI6i9xHcSuKa245O7dKcoXvPyobk7tpwEL3n5U3DVau21PAkHvAGAD3SGyqfKonrH+N29bMMnttnKUL3n/CHZPLaMRC95+VNw1WsG1P+u/xu3rhW3HJ3bpTlC95+VZwMnNscZEwWidSXky7A2qbhqu7klaePju/yiEwE9U3GXynuVRdXN7ZUXi8F/QMOxwuKabznOnFeRIvdokP8rRoG3SSvaJu4VmsW7rpjNRjcdr700ceeoJqKGgjOw11Q4E5uGqiA+9TBBddpjpQNxBzcdVENIGdjrqgtu1xSu3q4aECaCDzsNdU3AnNw1UQH3qILrtMdKBuIIk3HVRDSBnY660QW3apBt6ppoQIAgzdh3puBObhqpVAde5v6oguu0FdKBkgiTce7ahpAzsddaILbvO/VUg29U00IE0EGZw/Uk3AnNw1UQHXub+qILrtBXSgbiCJDH9TqhhlnY66oLbvO/VUg29U00IAAzmcP1KiHCebhplRAdPm/qiC67QVQNxEpDO89dUNpndk6oLZc7y2pAXqmkkCAM5nN8tVE3Ceb2yogOnzeyexBN2grNAyRKQzvPXVDaZ3ZOqLsud2y2pSvY0kgQBnM5vlLRRN1c3tlRF6fN7J7EE3cKzQMkSkM7znpqk2md2Tqndlzu2W1KV7GkkGd9uruQseIHWhAOIObjqohpAzsddUiy7XFAberhoQDQRnYa6ocCc3DVRAfepgguu0x0oG4gjm46qIaQM7HXVBbdrikBerhoQJoIPOw11TcCc3DVSqA+9RBddpjpQNxBHNx1IaQM7HXWiRbd5yAL1cNCBNBBm7DWm4E5uGqlUB17m/qiC67THSgbiCJDHz1oaQM7HXVItu879VQBerhoQJoM5nDy1Jumc3DVRF69zf1RBddpjpQNxEpDO89dUNpnY6J1SLZc7y2oDb1cECAM5nN8tVE3Vze2VEXp83z2IJu0xmgZIlIZ3nrqhtM7snVK7LneW1AF6uEkCAM5nN8tVE3Vze2VEXp83snsQTdpjNAyRKQzvOemqTaZ3ZOqLsud2y2oztUkCAM5nN8paKJurm9sqIvT5vZPYgm7rmgV12vvQjjz1JoBoIzsNdUOBObhqogPvUwQXXaY6UDcQc3HVRDSBnY66pFl2uKLt6uGhAmgg87DXVDwTm4aqVTD71MEF12mOlA3EEc3HVRDSBnY660SLLtcUAXq4aECAM+dhrwQ8E5uGqlUw69zUF12mOlA3ES5uOrHWhshnY660SLbvO/VUAXq4aECaDPnYa8NSbgTm4aqIvXub+qILrtMdKBuIlTHz1obIZ2OidUFt3nfqqQF6uGhAgDOub5aqJurm4aZURenzfPYi9dpigbiJSGd566obTO7J1SLZc7y2//AFAF6uEkCAM5nN8tVE3Vze2VEXp83sns/wDiCbtMZoGSJSGd566obTO7J1Suy53bLajO1SQIAzmc3yloom6ub2yoi9Pm9k9iCbuuaBkiUhnec9NUm0zuydUXZc7tltRnapIM7zdXchY8RrQgxs+PYi0Y9iEIOSPh2ogYdqEIOKDinaMezehCDkjZvclAw7UIQYQc7vRaMezehCDkjZvclZ8O3chCDCFnd6LRj2JoQZxc3uSs+B2oQgwh53af5otGI2JoQZRM3sH8krPgdqEIMWZ3af5otGI2JoQZvzewLGz4HahCDFuf2n+adoxCEIM3ZvYFjZ9KEIOdCEIP/9k="
                    }
                })

            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(
                topApps
            ));

        });


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

        /* what happens if we register a false or bad IPFS address? All code sent here
         *  should be validated */
        app.post('/register_ipfs', async function (req, res) {

            let ipfsHash = req.body.ipfs_hash
            let ipfsContent = req.body.ipfs_content
            await registerIPFS(ipfsHash);
            res.status(200).send('IPFS content registered');
        })


        app.use("/files",   express.static(path.join(userData, '/files/')));
        app.use("/weights",   express.static(path.join(userData, '/weights/')));

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




        app.post("/save_code" , async function (req, res) {
          //console.log("save_code " )
          //console.log("          base_component_id :" + JSON.stringify(req.body.value.base_component_id ,null,2))
          //console.log("          code_id :" + JSON.stringify(req.body.value.code_id ,null,2))
          //console.log("          code :" + JSON.stringify(req.body.value.code ,null,2))
          //console.log("          options :" + JSON.stringify(req.body.value.options ,null,2))
            //console.log("    " + JSON.stringify(req,null,2) )
          let saveResult =await saveCodeV2(  req.body.value.base_component_id,
                                             req.body.value.code_id  ,
                                             req.body.value.code,
                                             req.body.value.options)

            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
            res.end(JSON.stringify(saveResult))
        });



        app.post("/load_component" , async function (req, res) {



            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
            res.end(JSON.stringify({return: "from load component"}))
        });

        app.post("/save_component" , async function (req, res) {

            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
            res.end(JSON.stringify({return: "from save component"}))
        });

        function parseCode(code) {
        //zzz
            let itemName = saveHelper.getValueOfCodeString(code,"display_name")
            let componentType = ""
            if (saveHelper.getValueOfCodeString(code,"component_type") == "SYSTEM") {
                componentType = "app"
            }
            return {
                name: itemName
                ,
                type: componentType
            }
        }

        async function updateItemLists(parsedCode) {
        //zzz
            if (parsedCode.type == "component") {
                await insertComponentListRecord(
                    uuidv1()
                    ,
                    parsedCode.name
                    ,
                    parsedCode.description
                    ,
                    parsedCode.iconImageData
                    ,
                    parsedCode.ipfsHash
                    ,
                    parsedCode.systemCodeId
                )
            } else if (parsedCode.type == "app") {
                await insertAppListRecord(
                    uuidv1()
                    ,
                    parsedCode.name
                    ,
                    parsedCode.description
                    ,
                    parsedCode.iconImageData
                    ,
                    parsedCode.ipfsHash
                    ,
                    parsedCode.systemCodeId
                )
            }
        }

        //zzz
        app.post("/post_app" , async function (req, res) {
            //
            // get stuff
            //
            let code = req.body.value.code;
            let ipfsHash = await saveItemToIpfs(code)
            let parsedCode = parseCode(code)
            await updateItemLists(parsedCode)
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
            res.end(JSON.stringify({
                ipfsHash:   ipfsHash,
            }))
        })

        app.post("/copy_component" , async function (req, res) {
            //
            // get stuff
            //
            let copy_base_component_id = req.body.value.base_component_id;
            let copy_image_data = req.body.value.image_data;


            //
            // copy the main EVM control
            //
            let srcText = fs.readFileSync(
                                    path.join(__dirname,
                                    '../public/visifile_drivers/' + req.body.value.relative_filename_to_copy)
                                    ,
                                    'utf8')

            //
            // give the new smart contract control a new name
            //
            let componentToCopyBaseComponentId = saveHelper.getValueOfCodeString(srcText,"base_component_id")
            srcText = srcText.replaceAll(componentToCopyBaseComponentId, copy_base_component_id)


            //
            // design_time_html
            //
            let design_time_html = req.body.value.design_time_html
            srcText = saveHelper.replaceBetween(srcText,"<!-- design_time_html_start -->", "<!-- design_time_html_end -->",design_time_html)


            //
            // DESIGN TIME MOUNTED CODE
            //
            let designTimeMountedCode = req.body.value.design_time_mounted_code
            srcText = saveHelper.replaceBetween(srcText,"/*NEW_DESIGN_TIME_MOUNTED_START*/", "/*NEW_DESIGN_TIME_MOUNTED_END*/",designTimeMountedCode)



            //
            // RUN TIME MOUNTED CODE
            //
            let runtimeMountedCode = req.body.value.runtime_mounted_code
            srcText = saveHelper.replaceBetween(srcText,"/*NEW_RUNTIME_MOUNTED_START*/", "/*NEW_RUNTIME_MOUNTED_END*/",runtimeMountedCode)



            //
            // VARS CODE
            //
            let varsCode = req.body.value.vars_code
            srcText = saveHelper.replaceBetween(srcText,"/*NEW_VARS_START*/", "/*NEW_VARS_END*/",varsCode)




            //
            // run_time_html
            //
            let run_time_html = req.body.value.run_time_html
            srcText = saveHelper.replaceBetween(srcText,"<!-- run_time_html_start -->", "<!-- run_time_html_end -->",run_time_html)






            //
            // give the new smart contract control a new icon logo
            //
            if (copy_image_data) {
                var logoValue = saveHelper.getValueOfCodeString(srcText,"logo_url")
                if (logoValue) {
                    srcText = saveHelper.deleteCodeString(srcText, "logo_url")
                }
                srcText = saveHelper.insertCodeString(srcText, "logo_url",copy_image_data)
            }





            //
            // give the new component a new logo
            //
            if (req.body.value.logo_url) {
                var logoValue = saveHelper.getValueOfCodeString(srcText,"logo_url")
                if (logoValue) {
                    srcText = saveHelper.deleteCodeString(srcText, "logo_url")
                }
                srcText = saveHelper.insertCodeString(srcText, "logo_url", "/driver_icons/blue_eth.png")
            }


            //
            // copy over some properties defaults from the existing component
            //
            let default_property_values = req.body.value.default_property_values;
            let propertiesToChange = Object.keys(default_property_values)
            for (let propertyToChangeIndex = 0; propertyToChangeIndex < propertiesToChange.length;propertyToChangeIndex++){
                let propertyNameToChange = propertiesToChange[propertyToChangeIndex]
                let propertyValue = default_property_values[propertyNameToChange]
                srcText = saveHelper.replacePropertyValue(srcText,propertyNameToChange,propertyValue)
            }


            //
            // create some new properties in the new component
            //
            let newProperties = req.body.value.new_properties;
            for ( let newPropertyIndex = 0 ; newPropertyIndex < newProperties.length ; newPropertyIndex++ ){
                let newProperty = newProperties[newPropertyIndex]
                srcText = saveHelper.addProperty(srcText,newProperty)
            }


            //
            // create new methods in the new component
            //
            let newMethods = req.body.value.new_methods;
            if (newMethods) {
                for ( let newMethodIndex = 0 ; newMethodIndex < newMethods.length ; newMethodIndex++ ){
                    let newMethod = newMethods[newMethodIndex]
                    srcText = saveHelper.addMethod(srcText,"\n\n\n"+newMethod.code+"\n,\n\n")
                }
            }




            //
            // create new methods in the new component
            //
            let newMethodsV2 = req.body.value.new_methods_v2;
            if (newMethodsV2) {
                for ( let newMethodIndex = 0 ; newMethodIndex < newMethodsV2.length ; newMethodIndex++ ){
                    let newMethod = newMethodsV2[newMethodIndex]
                    srcText = saveHelper.addMethod(srcText,"\n\n\n"+newMethod.code+"\n,\n\n")
                    let newMethodProperty = newMethod.properties
                    srcText = saveHelper.addProperty(srcText,newMethodProperty)
                }
            }



            //
            // Delete any IPFS from the component class. Unfortunately this can't be stored in IPFS itself
            //
            let properties = saveHelper.getValueOfCodeString(srcText,"properties", ")//prope" + "rties")
            srcText = saveHelper.deleteCodeString(  srcText, "properties", ")//prope" + "rties")
            for (let irte = 0 ; irte < properties.length ; irte++ ) {
                let brje = properties[irte]
                if (brje) {
                    if (brje.id == "ipfs_hash_id") {
                        brje.default = ""//ipfsHash
                    }
                }
            }
            srcText = saveHelper.insertCodeString(  srcText,
                "properties",
                properties,
                ")//prope" + "rties")




            fs.writeFileSync( "z.txt",  srcText.toString() )


            let ipfsHash = await saveItemToIpfs(srcText)



            //
            // Add an IPFS has ID to the component class. Unfortunately this can't be stored in IPFS itself
            //
            properties = saveHelper.getValueOfCodeString(srcText,"properties", ")//prope" + "rties")
            srcText = saveHelper.deleteCodeString(  srcText, "properties", ")//prope" + "rties")
            for (let irte = 0 ; irte < properties.length ; irte++ ) {
                let brje = properties[irte]
                if (brje.id == "ipfs_hash_id") {
                    brje.default = ipfsHash
                }
            }
            srcText = saveHelper.insertCodeString(  srcText,
                "properties",
                properties,
                ")//prope" + "rties")








            //
            // save the new smart contract component
            //
            await addOrUpdateDriver(copy_base_component_id, srcText ,  {username: "default", reponame: copy_base_component_id, version: "latest", ipfsHashId:ipfsHash})

            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
            res.end(JSON.stringify({
                ipfsHash:   ipfsHash,
                return:     srcText
                }))
        });






        app.post('/file_open_single', upload.single( 'openfilefromhomepage' ), function (req, res, next) {
            console.log("File open: " + JSON.stringify(req.file.originalname,null,2))
            return file_uploadSingleFn(req, res, next);
        });




        app.post('/file_upload_single', upload.single( 'uploadfilefromhomepage' ), function (req, res, next) {
            console.log("File upload: " + JSON.stringify(req.file.originalname,null,2))
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

        app.get('/file_name_load', function (req, res, next) {
            //console.log("Hit file_name_load")
            file_name_load(req, res);

            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
            res.end("Done");
        });




        app.get('/lock', function (req, res) {
            return lockFn(req, res);
        })
    }

    process.on('uncaughtException', function (err) {
      outputDebug(err);
    })







    //------------------------------------------------------------------------------
    // start the web server
    //------------------------------------------------------------------------------
    if (!isCodeTtyCode) {
        if (useHttps) {
            if (!certOptions) {
                let caCerts = readCerts()
                certOptions = {
                  key: fs.readFileSync(privateKey, 'utf8'),
                  cert: fs.readFileSync(publicCertificate, 'utf8'),
                  ca: caCerts
                }
            }
            certOptions.requestCert = true
            certOptions.rejectUnauthorized = false

            httpServer = https.createServer(certOptions,app)

        } else {
            httpServer = http.createServer(app)

        }
        socket = require2('socket.io')(http)
        httpServer.listen(port, hostaddress, function () {

                outputDebug("****HOST=" + hostaddress + "HOST****\n");
                outputDebug("****PORT=" + port+ "PORT****\n");
                outputDebug('Started on port ' + port + ' with local folder at ' + process.cwd() + ' and __dirname = ' + __dirname+ "\n");




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
    }





    childProcessNameInScheduler            = "forkedExeScheduler"






    for (var i=0;i<executionProcessCount; i++ ) {
        var exeProcName = "forkedExeProcess" + i
            setupForkedProcess(exeProcName, "exeProcess.js", 40100 + i)
    }

      //console.log('addr: '+ hostaddress + ":" + port);





    setTimeout(async function(){
        //--------------------------------------------------------
    	// Check if any JS is loaded
    	//--------------------------------------------------------
        await checkForJSLoaded();
        await findLocalIpfsContent();


        if (isCodeTtyCode) {
            await finalizeYazzLoading()
        } else {
            setUpSql()
            setUpPredefinedComponents({message_type:       'setUpPredefinedComponents'});
        }


    },1000)

}

async function findLocalIpfsContent() {
    fs.readdir(fullIpfsFolderPath, function (err, files) {
        if (err) {
            return console.error(err);
        }

        files.forEach(async function (file, index) {
            if (file.length > 10) {
                console.log("isDirectory ? " + file);

                await registerIPFS(file);

            }
        })
    })

}


async function finalizeYazzLoading() {
    setUpSql();
    if (!isCodeTtyCode) {
        console.log(`
          YYYYYYY       YYYYYYY
          Y:::::Y       Y:::::Y
          Y:::::Y       Y:::::Y
          Y::::::Y     Y::::::Y
          YYY:::::Y   Y:::::YYYaaaaaaaaaaaaa   zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz
             Y:::::Y Y:::::Y   a::::::::::::a  z:::::::::::::::zz:::::::::::::::z
              Y:::::Y:::::Y    aaaaaaaaa:::::a z::::::::::::::z z::::::::::::::z
               Y:::::::::Y              a::::a zzzzzzzz::::::z  zzzzzzzz::::::z
                Y:::::::Y        aaaaaaa:::::a       z::::::z         z::::::z
                 Y:::::Y       aa::::::::::::a      z::::::z         z::::::z
                 Y:::::Y      a::::aaaa::::::a     z::::::z         z::::::z
                 Y:::::Y     a::::a    a:::::a    z::::::z         z::::::z
                 Y:::::Y     a::::a    a:::::a   z::::::zzzzzzzz  z::::::zzzzzzzz
              YYYY:::::YYYY  a:::::aaaa::::::a  z::::::::::::::z z::::::::::::::z
              Y:::::::::::Y   a::::::::::aa:::az:::::::::::::::zz:::::::::::::::z
              YYYYYYYYYYYYY    aaaaaaaaaa  aaaazzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz



           222222222222222         000000000      222222222222222     222222222222222
          2:::::::::::::::22     00:::::::::00   2:::::::::::::::22  2:::::::::::::::22
          2::::::222222:::::2  00:::::::::::::00 2::::::222222:::::2 2::::::222222:::::2
          2222222     2:::::2 0:::::::000:::::::02222222     2:::::2 2222222     2:::::2
                      2:::::2 0::::::0   0::::::0            2:::::2             2:::::2
                      2:::::2 0:::::0     0:::::0            2:::::2             2:::::2
                   2222::::2  0:::::0     0:::::0         2222::::2           2222::::2
              22222::::::22   0:::::0 000 0:::::0    22222::::::22       22222::::::22
            22::::::::222     0:::::0 000 0:::::0  22::::::::222       22::::::::222
           2:::::22222        0:::::0     0:::::0 2:::::22222         2:::::22222
          2:::::2             0:::::0     0:::::02:::::2             2:::::2
          2:::::2             0::::::0   0::::::02:::::2             2:::::2
          2:::::2       2222220:::::::000:::::::02:::::2       2222222:::::2       222222
          2::::::2222222:::::2 00:::::::::::::00 2::::::2222222:::::22::::::2222222:::::2
          2::::::::::::::::::2   00:::::::::00   2::::::::::::::::::22::::::::::::::::::2
          22222222222222222222     000000000     2222222222222222222222222222222222222222

`)

console.log("\nAppShare Instance ID: " + yazzInstanceId );
console.log("\nRunning " + executionProcessCount + " virtual processors");
console.log("\nAppShare started on:");
console.log("Network Host Address: " + hostaddressintranet)
let localAddress = serverProtocol + "://" + hostaddress + ':' + port
console.log("Local Machine Address: " + localAddress);


} else {


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

                    if(startupType == "RUN_SERVER_CODE") {
                        setTimeout(function(){
                            callDriverMethod({
                                            message_type:          "callDriverMethod",
                                            find_component:         {
                                                                        base_component_id: runapp
                                                                    }
                                                                    ,
                                            args:                   parsedInput
                                                                    ,
                                            seq_num_parent:         null,
                                            seq_num_browser:        null,
                                            seq_num_local:          seqNum,
                                        });
                        },startupDelay)


                    } else {

                                }



                })
                var ret = await promise
                //console.log("ret: "  +  JSON.stringify(ret,null,2))

                if (ret.value) {
                    //console.log(JSON.stringify(ret.value,null,2));
                    process.stdout.write(JSON.stringify(ret.value,null,2));
                    process.stdout.write('\n');
                    //console.log("Who let the dogs out!");
                }

                //shutDown();
                process.exit();
            })()
    }

    systemReady = true
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






//------------------------------------------------------------------------------
//
//
//
//
//
//------------------------------------------------------------------------------
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







setupVisifileParams();
{
    outputDebug("process.platform = " + process.platform)


    if (process.platform === "win32") {
        var rl = require2("readline").createInterface({
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
    findSystemDataDirectoryAndStart()
    finishInit()
}














function findSystemDataDirectoryAndStart() {
    console.log("userData : " + userData)
    console.log("username : " + username)
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

    upload = multer( { dest: uploadPath});



    if (!fs.existsSync( path.join(userData,  'uploads') )) {
        mkdirp.sync(path.join(userData,  'uploads'));
    }
    if (!fs.existsSync( path.join(userData,  'files') )) {
        mkdirp.sync(path.join(userData,  'files'));
    }
    if (!fs.existsSync( path.join(userData,  'apps') )) {
        mkdirp.sync(path.join(userData,  'apps'));
    }
    if (!fs.existsSync( path.join(userData,  'app_dbs') )) {
        mkdirp.sync(path.join(userData,  'app_dbs'));
    }

    if (!fs.existsSync(  path.join(userData,  ipfsFolder) )) {
        mkdirp.sync(path.join(userData,  ipfsFolder));
    }
    fullIpfsFolderPath = path.join(userData,  ipfsFolder)

    outputDebug('process.env.LOCALAPPDATA: ' + JSON.stringify(localappdata ,null,2))
    outputDebug("Local home data path: " + LOCAL_HOME)
    outputDebug("userData: " + JSON.stringify(userData ,null,2))
    outputDebug("process.env keys: " + Object.keys(process.env))




    dbsearch = new sqlite3.Database(dbPath);
    dbsearch.run("PRAGMA journal_mode=WAL;")

}

async function executeSqliteForApp( args ) {
    if (!args.sql) {
        return []
    }
    var getSqlResults = new Promise(returnResult => {
        //console.log("dbPath: " + JSON.stringify(dbPath,null,2))
        //console.log("args: " + JSON.stringify(args,null,2))
        let appDb = null
        if (appDbs[args.base_component_id]) {
            appDb = appDbs[args.base_component_id]
            //console.log("Using cached db " + args.base_component_id)
        } else {
            let dbPath = path.join(userData, 'app_dbs/' + args.base_component_id + '.visi')
            appDb = new sqlite3.Database(dbPath);
            appDb.run("PRAGMA journal_mode=WAL;")
            appDbs[args.base_component_id] = appDb
        }

        if (args.sql.toLocaleLowerCase().trim().startsWith("select")) {
            //console.log("Read only query " + args.sql)
            appDb.serialize(
                function() {
                    appDb.all(
                        args.sql
                        ,
                        args.params
                        ,

                        function(err, results)
                        {
                            returnResult(results)
                        })
             }, sqlite3.OPEN_READONLY)
        } else {
            appDb.serialize(
                function() {
                    appDb.run("begin deferred transaction");
                    appDb.run(args.sql, args.params)
                    appDb.run("commit");
                    returnResult([])
             })
        }
    })


    var res = await getSqlResults
    return res
}







var shuttingDown = false;





function finishInit() {


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

    createTables()



    //------------------------------------------------------------------------------
    //
    //
    //
    //
    //
    //------------------------------------------------------------------------------

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



}



let globalStartTimer = new Date().getTime()
let globalEndTimer = new Date().getTime()
let globalTimerCounter = 0
function resetTimer(messageToStart) {
  console.log("Starting timer for: " + messageToStart)
  globalStartTimer = new Date().getTime()
  globalTimerCounter = 0
}

function showTimer(optionalMessage) {
  globalEndTimer = new Date().getTime()
  globalTimerCounter ++
  let theTimerText = optionalMessage
  if (!theTimerText) {
    theTimerText = "" + globalTimerCounter
  }
  console.log("    Elapsed time in milliseconds: " + theTimerText + " : "+ (globalEndTimer - globalStartTimer))
}



async function saveCodeV2( baseComponentId, parentHash, code , options) {

    if (code) {
        code = code.toString()
    }

    var promise = new Promise(returnFn => {
        //resetTimer(`*function saveCodeV2( ${baseComponentId}, ${parentHash} ) {`)
        if (!baseComponentId) {
            baseComponentId = uuidv1()
        }
        if (!code.toString().substring(0,20).includes("function")) {
            code =
`function() {${code}
}`
        }

        //
        //  Add a link to the parent code
        //
        var lastParentHash = saveHelper.getValueOfCodeString(code,"parent_hash")
        if (lastParentHash != parentHash) {
            if (lastParentHash) {
                code = saveHelper.deleteCodeString(code, "parent_hash")
            }
            if (parentHash) {
                code = saveHelper.insertCodeString(code, "parent_hash", parentHash)
            }
        }


        //showTimer(`2`)





        var oldBaseComp = saveHelper.getValueOfCodeString(code,"base_component_id")


        if (oldBaseComp != baseComponentId ) {
            code = saveHelper.deleteCodeString(code, "base_component_id")
            code = saveHelper.insertCodeString(code, "base_component_id", baseComponentId)
        }

        //showTimer("    baseComponentId := " + baseComponentId)


        var creationTimestamp = new Date().getTime()
        // if we don't want to reload this file then don't update the timestamp
        if (saveHelper.getValueOfCodeString(code,"load_once_from_file")) {
            creationTimestamp = -1
        }
        var tvvv = saveHelper.getValueOfCodeString(code, "created_timestamp")
        if (!tvvv) {
            code = saveHelper.deleteCodeString(code, "created_timestamp")
            code = saveHelper.insertCodeString(code, "created_timestamp", creationTimestamp)
        }

        //showTimer(`3`)


        var oncode = "\"app\""
        var eventName = null
        var componentType = null
        var componentOptions = null
        var maxProcesses = 1
        var rowhash = crypto.createHash('sha256');
        var row = code.toString();




        var visibility = null
        var newvisibility = null
        visibility = saveHelper.getValueOfCodeString(code,"visibility")
        newvisibility = visibility
        if (!isValidObject(visibility)) {
            if (isValidObject(options) && options.make_public) {
                newvisibility = "PUBLIC"
            } else {
                newvisibility = "PRIVATE"
            }
        }

        if (newvisibility != visibility) {
            code = saveHelper.deleteCodeString(code, "visibility")
            code = saveHelper.insertCodeString(code, "visibility", newvisibility)
        }

        //showTimer(`4`)


        var logoUrl = saveHelper.getValueOfCodeString(code,"logo_url")
        if (!isValidObject(logoUrl)) {
            logoUrl = "/driver_icons/js.png"
            code = saveHelper.insertCodeString(code, "logo_url", logoUrl)
        }




        var interfaces = ""
        var interfaces2 = saveHelper.getValueOfCodeString(code,"interfaces")
        if (interfaces2 && (interfaces2.length > 0)) {
            for (var rr=0; rr < interfaces2.length; rr ++) {
                interfaces += "|  " + interfaces2[ rr ]
            }
        }

        //showTimer(`5`)


        rowhash.setEncoding('hex');
        rowhash.write(row);
        rowhash.end();
        var sha1sum = rowhash.read();
        ////showTimer("Save sha1 for :" + baseComponentId + ": " + sha1sum)

        dbsearch.serialize(
            function() {
                dbsearch.all(
                    " select  " +
                    "     id " +
                    " from " +
                    "     system_code " +
                    " where " +
                    "     id = ?;"
                    ,
                    sha1sum
                    ,
                    function(err, rows) {
                        if (!err) {
                            ////showTimer("rows.length:   " + rows.length)
                            if (rows.length == 0) {
                                try {

                                if (saveHelper.getValueOfCodeString(code,"hide_header")) {
                                    componentOptions = "HIDE_HEADER"
                                }

                                //showTimer(`6`)


                                var displayName = saveHelper.getValueOfCodeString(code,"display_name")

                                var useDb = saveHelper.getValueOfCodeString(code,"use_db")
                                var editors2 = saveHelper.getValueOfCodeString(code,"editors")
                                var controlType = saveHelper.getValueOfCodeString(code,"component_type")
                                var controlSubType = saveHelper.getValueOfCodeString(code,"control_sub_type")

                                var editors = null
                                if (editors2) {
                                    editors = JSON.stringify(editors2,null,2)

                                }
                                var readWriteStatus = null
                                var readOnly = saveHelper.getValueOfCodeString(code,"read_only")
                                if (readOnly) {
                                    readWriteStatus = "READ"
                                }
                                var properties = saveHelper.getValueOfCodeString(code,"properties",")//properties")
                                if (properties) {
                                    properties = JSON.stringify(properties,null,2)
                                }
                                if (controlType == "VB") {
                                  //showTimer(`7`)

                                    ////showTimer("VB: " + baseComponentId)
                                    let properties2 = saveHelper.getValueOfCodeString(code,"properties",")//properties")
                                    stmtDeleteTypesForComponentProperty.run(baseComponentId)
                                    stmtDeleteAcceptTypesForComponentProperty.run(baseComponentId)
                                    if (properties2) {
                                      //showTimer(`8`)

                                        ////showTimer("     properties: " + properties2.length)
                                        for (let rttte = 0; rttte < properties2.length ; rttte++ ) {
                                            let prop = properties2[rttte]
                                            stmtInsertComponentProperty.run(baseComponentId, prop.id)
                                            if (prop.types) {
                                                let labelKeys = Object.keys(prop.types)
                                                for (let rttte2 = 0; rttte2 < labelKeys.length ; rttte2++ ) {
                                                    let prop2 = prop.types[labelKeys[rttte2]]
                                                    ////showTimer("    " + prop.id + " = " +  JSON.stringify(prop.labels))
                                                    stmtInsertTypesForComponentProperty.run(baseComponentId, prop.id, labelKeys[rttte2],prop2)

                                                }
                                            }
                                            //showTimer(`9`)
                                            if (prop.accept_types) {
                                                let labelKeys = Object.keys(prop.accept_types)
                                                for (let rttte2 = 0; rttte2 < labelKeys.length ; rttte2++ ) {
                                                    let prop2 = prop.accept_types[labelKeys[rttte2]]
                                                    ////showTimer("    " + prop.id + " = " +  JSON.stringify(prop.labels))
                                                    stmtInsertAcceptTypesForComponentProperty.run(
                                                            baseComponentId,
                                                            prop.id,
                                                            labelKeys[rttte2],
                                                            prop2)

                                                }
                                            }
                                        }
                                    }

                                }




                                //
                                // 1) call this first
                                //
                                ////showTimer("::::" + baseComponentId)


                                function getName(text) {
                                    var resttext = text.match(/([a-zA-Z_{1}][a-zA-Z0-9_]+)(?=\()/g)
                                    var res=null
                                    if (resttext) {
                                        if (resttext[0] != "function") {
                                            res = resttext[0]
                                        }
                                    }

                                    return res
                                }
                                var fnName = getName(code.toString())
                                if (fnName) {
                                    oncode = "\"" + fnName + "\""
                                    eventName = fnName
                                    componentType = "method"
                                }
                                ////showTimer("fnName: " + fnName)


                                //
                                // 2) and then call this , as apps can also be methods
                                //
                                if (saveHelper.getValueOfCodeString(code,"is_app")) {
                                    componentType = "app"
                                }

                                let ipfsHashId = null

                                ////showTimer("Saving in Sqlite: " + parentHash)
                                ////showTimer("Saving in Sqlite: " + code)
                                let save_code_to_file = null
                                if (options) {
                                    save_code_to_file = options.save_code_to_file
                                    ipfsHashId = options.ipfsHashId
                                }
                                //showTimer(`10`)
                                dbsearch.serialize(async function() {
                                    dbsearch.run("begin exclusive transaction");
                                    stmtInsertNewCode.run(
                                          sha1sum,
                                          parentHash,
                                          "LATEST",
                                          code,
                                          oncode,
                                          baseComponentId,
                                          eventName,
                                          maxProcesses,
                                          componentType,
                                          displayName,
                                          creationTimestamp,
                                          componentOptions,
                                          logoUrl,
                                          newvisibility,
                                          interfaces,
                                          useDb,
                                          editors,
                                          readWriteStatus,
                                          properties,
                                          controlType,
                                          controlSubType,
                                          save_code_to_file,
                                          ipfsHashId
                                          )
                                    stmtDeprecateOldCode.run(
                                        baseComponentId,
                                        sha1sum
                                        )


                                    var restApi = saveHelper.getValueOfCodeString(code, "rest_api")
                                    if (restApi) {
                                        var restMethod = saveHelper.getValueOfCodeString(code, "rest_method")
                                        add_rest_api({
                                                        message_type:       "add_rest_api",
                                                        route:               restApi,
                                                        base_component_id:   baseComponentId,
                                                        rest_method:         restMethod
                                                    });
                                    }


                                    stmtDeleteDependencies.run(sha1sum)

                                    var scriptCode = ""
                                    //showTimer(`11`)
                                    var jsLibs = saveHelper.getValueOfCodeString(code, "uses_javascript_librararies")
                                    if (jsLibs) {
                                          ////showTimer(JSON.stringify(jsLibs,null,2))
                                          for (var tt = 0; tt < jsLibs.length ; tt++) {
                                              scriptCode += `libLoaded[ "${jsLibs[tt]}" ] = true;
                                              `
                                              stmtInsertDependency.run(
                                                  uuidv1(),
                                                  sha1sum,
                                                  "js_browser_lib",
                                                  jsLibs[tt],
                                                  "latest")

                                              if ( jsLibs[tt] == "advanced_bundle" ) {
                                                //scriptCode += fs.readFileSync( path.join(__dirname, '../public/js_libs/advanced_js_bundle.js') )
                                                scriptCode += `
                                                `
                                              }


                                          }
                                     }
                                     var subComponents = saveHelper.getValueOfCodeString(code, "sub_components")
                                     if (subComponents) {
                                           for (var tt = 0; tt < subComponents.length ; tt++) {
                                               stmtInsertSubComponent.run(
                                                   baseComponentId,
                                                   subComponents[tt])
                                           }
                                      }
                                     var sqliteCode = ""
                                     if (isValidObject(options)) {

                                        ////showTimer(JSON.stringify(options,null,2))
                                        if (options.sub_components) {
                                            ////showTimer("Save options: " + options.sub_components.length)
                                            ////showTimer(JSON.stringify(options,null,2))
                                            for (var tew = 0; tew < options.sub_components.length ; tew ++) {
                                                ////showTimer("Saving " + options.sub_components[tew])
                                                if (isValidObject(baseComponentId)) {
                                                    stmtInsertSubComponent.run(
                                                        baseComponentId,
                                                        options.sub_components[tew])
                                                }
                                            }
                                        }
                                     }
                                     //showTimer(`12`)

                                    dbsearch.run("commit", async function() {

                                        });



                                    if (isValidObject(options) && options.save_code_to_file) {
                                        //showTimer("Saving to file: " + options.save_code_to_file)
    		                            fs.writeFileSync( options.save_code_to_file,  code.toString() )
                                    }




                                    if (isValidObject(options) && options.save_html) {
                                      //showTimer(`13`)
                                        //
                                        // create the static HTML file to link to on the web/intranet
                                        //
                                        var origFilePath = path.join(__dirname, '../public/go.html')
                                        var newStaticFilePath = path.join( userData, 'apps/' + baseComponentId + '.html' )
                                        var newLocalStaticFilePath = path.join( userData, 'apps/yazz_' + baseComponentId + '.html' )
                                        var newLocalJSPath = path.join( userData, 'apps/yazz_' + baseComponentId + '.yazz' )
                                        var newLocalYazzPath = path.join( userData, 'apps/yazz_' + baseComponentId + '.yazz' )

                                        var newStaticFileContent = fs.readFileSync( origFilePath )

                                        newStaticFileContent = newStaticFileContent.toString().replace("var isStaticHtmlPageApp = false", "var isStaticHtmlPageApp = true")

                                        var newcode = escape( code.toString() )


                                        newStaticFileContent = newStaticFileContent.toString().replace("***STATIC_NAME***",displayName)
                                        newStaticFileContent = newStaticFileContent.toString().replace("***STATIC_NAME***",displayName)
                                        newStaticFileContent = newStaticFileContent.toString().replace("***STATIC_BASE_COMPONENT_ID***",baseComponentId)
                                        newStaticFileContent = newStaticFileContent.toString().replace("***STATIC_BASE_COMPONENT_ID***",baseComponentId)
                                        newStaticFileContent = newStaticFileContent.toString().replace("***STATIC_CODE_ID***",sha1sum)
                                        newStaticFileContent = newStaticFileContent.toString().replace("***STATIC_CODE_ID***",sha1sum)




                                        var newCode =  `cachedCode["${sha1sum}"] = {
                                          "type": "ws_to_browser_callDriverMethod_results",
                                          "value": {
                                            "code": /*APP_START*/unescape(\`${newcode}\`)/*APP_END*/,
                                            "is_code_result": true,
                                            "use_db": ${useDb?"\"" + useDb + "\"":null},
                                            "component_type": \"SYSTEM\",
                                            "libs": [],
                                            "code_id": "${sha1sum}",
                                            "on_condition": "\\\"app\\\"",
                                            "base_component_id": "${baseComponentId}"
                                          },
                                          "seq_num": 0
                                        }

                                        finderToCachedCodeMapping["${baseComponentId}"] = "${sha1sum}"`


                                        //showTimer(`14`)

                                        newCode += `
                                            //newcodehere
                                        `
                                        dbsearch.serialize(
                                            async function() {
                                              //showTimer(`15.....1`)

                                                var stmt = dbsearch.all(
                                                    `select
                                                        system_code.id as sha1,
                                                        child_component_id,
                                                        code
                                                    from
                                                        component_usage,
                                                        system_code
                                                    where
                                                        component_usage.base_component_id = ?
                                                    and
                                                        system_code.base_component_id = component_usage.child_component_id
                                                    and
                                                        code_tag = 'LATEST'
                                                        `,

                                                         [  baseComponentId  ],

                                                async function(err, results)
                                                {
                                                  //showTimer(`15`)
                                                        for (var i = 0  ;   i < results.length;    i ++ ) {
                                                            var newcodeEs = escape("(" + results[i].code.toString() + ")")
                                                            var newCode2 =  `cachedCode["${results[i].sha1}"] = {
                                                              "type": "ws_to_browser_callDriverMethod_results",
                                                              "value": {
                                                                "code": unescape(\`${newcodeEs}\`),
                                                                "is_code_result": true,
                                                                "use_db": ${useDb?"\"" + useDb + "\"":null},
                                                                "libs": [],
                                                                "component_type": \"SYSTEM\",
                                                                "code_id": "${results[i].sha1}",
                                                                "on_condition": "\\\"app\\\"",
                                                                "base_component_id": "${results[i].child_component_id}"
                                                              },
                                                              "seq_num": 0
                                                            }

                                                            finderToCachedCodeMapping["${results[i].child_component_id}"] = "${results[i].sha1}"
                                                            `
                                                            newCode += newCode2
                                                        }
                                                        //showTimer(`15.1`)
                                                        newStaticFileContent = newStaticFileContent.toString().replace("//***ADD_STATIC_CODE", newCode)



                                                        newStaticFileContent = saveHelper.replaceBetween(newStaticFileContent, "/*static_hostname_start*/","/*static_hostname_end*/","'"+hostaddress+"'")
                                                        newStaticFileContent = saveHelper.replaceBetween(newStaticFileContent, "/*static_port_start*/","/*static_port_end*/",port)

                                                        //
                                                        // we use "slice" here as string replace doesn't work with large strings (over 1MB) and most of the aframe and js
                                                        // code we insert is LARGE!!
                                                        //
                                                        var pos = newStaticFileContent.indexOf("//***ADD_SCRIPT")
                                                        newStaticFileContent = newStaticFileContent.slice(0, pos)  + scriptCode + newStaticFileContent.slice( pos)
                                                        //showTimer(`15.2`)


                                                        //fs.writeFileSync( path.join(__dirname, '../public/sql2.js'),  sqliteCode )
                                                        fs.writeFileSync( newStaticFilePath,  newStaticFileContent )


                                                        //showTimer(`15.3`)

                                                        //
                                                        // save the standalone app
                                                        //
                                                        sqliteCode = fs.readFileSync( path.join(__dirname, '../public/sql.js') )
                                                        var indexOfSqlite = newStaticFileContent.indexOf("//SQLITE")
                                                        newStaticFileContent = newStaticFileContent.substring(0,indexOfSqlite) +
                                                                                    sqliteCode +
                                                                                        newStaticFileContent.substring(indexOfSqlite)
                                                        newStaticFileContent = saveHelper.replaceBetween(newStaticFileContent, "/*use_local_sqlite_start*/","/*use_local_sqlite_end*/","var localAppshareApp = true")



                                                        //showTimer(`15.4`)

                                                        var sqliteAppDbPath = path.join( userData, 'app_dbs/' + baseComponentId + '.visi' )

                                                        if (fs.existsSync(sqliteAppDbPath)) {
                                                          //showTimer(`15.5`)
                                                            var sqliteAppDbContent = fs.readFileSync( sqliteAppDbPath , 'base64')
                                                            var indexOfSqliteData = newStaticFileContent.indexOf("var sqlitedata = ''")


                                                            newStaticFileContent = newStaticFileContent.substring(0,indexOfSqliteData + 17) +
                                                                                        "'" + sqliteAppDbContent + "'//sqlitedata" +
                                                                                            newStaticFileContent.substring(indexOfSqliteData + 19)

                                                        }
                                                        //showTimer(`15.6`)

                                                        fs.writeFileSync( newLocalStaticFilePath,  newStaticFileContent )
                                                        fs.writeFileSync( newLocalJSPath,  code )
                                                        fs.writeFileSync( newLocalYazzPath,  code )
                                                        //showTimer(`15.7`)

                                                        })
                                                        //showTimer(`15.....2`)

                                           }
                                     , sqlite3.OPEN_READONLY)
                                     //showTimer(`15.8`)
                                 }
                                 //showTimer(`15.9`)






                                 //showTimer(`16`)



                                    //
                                    // save the app db
                                    //
                                    var sqlite = saveHelper.getValueOfCodeString(code, "sqlite",")//sqlite")
                                    if (sqlite) {
                                        if (isValidObject(options) && options.copy_db_from) {

                                            var newBaseid = baseComponentId
                                            //
                                            // copy the database
                                            //
                                            var sqliteAppDbPathOld = path.join( userData, 'app_dbs/' + options.copy_db_from + '.visi' )
                                            var sqliteAppDbPathNew = path.join( userData, 'app_dbs/' + newBaseid + '.visi' )
                                            ////showTimer("sqliteAppDbPathOld: " + sqliteAppDbPathOld)
                                            ////showTimer("sqliteAppDbPathNew: " + sqliteAppDbPathNew)
                                            copyFile(sqliteAppDbPathOld,sqliteAppDbPathNew, async function(){

                                            });
                                            dbsearch.serialize(function() {
                                                dbsearch.run("begin exclusive transaction");
                                                copyMigration.run(  newBaseid,  options.copy_db_from)
                                                dbsearch.run("commit");
                                                })

                                        } else if (isValidObject(options) && options.fast_forward_database_to_latest_revision) {
                                            fastForwardToLatestRevision(sqlite, baseComponentId)

                                        } else {
                                            ////showTimer('updateRevisions(sqlite, baseComponentId)')
                                            ////showTimer('    ' + JSON.stringify(options,null,2))
                                            updateRevisions(sqlite, baseComponentId)
                                        }

                                    }
                                    //
                                    // END OF save app db
                                    //


                                    //showTimer(`ret 8`)

                                    updateRegistry(options, sha1sum)
                                    returnFn( {
                                                    code_id:            sha1sum,
                                                    base_component_id:  baseComponentId
                                                    })

                                })
                                } catch(err) {
                                    console.log(err)
                                }

                            //
                            // otherwise we only update the static file if our IP address has changed
                            //
                            } else {
                                if (options && options.save_html) {
                                    var oldStaticFilePath = path.join( userData, 'apps/' + baseComponentId + '.html' )
    								if (fs.existsSync(oldStaticFilePath)) {
    									var oldStaticFileContent = fs.readFileSync( oldStaticFilePath )

    									var oldHostname = saveHelper.getValueOfCodeString(oldStaticFileContent, "/*static_hostname_start*/","/*static_hostname_end*/")
    									var oldPort = saveHelper.getValueOfCodeString(oldStaticFileContent, "/*static_port_start*/","/*static_port_end*/")

    									if ((oldHostname != hostaddress) || (oldPort != port)) {
    										var newStaticFileContent = oldStaticFileContent.toString()
    										newStaticFileContent = saveHelper.replaceBetween(newStaticFileContent, "/*static_hostname_start*/","/*static_hostname_end*/","'"+hostaddress+"'")
    										newStaticFileContent = saveHelper.replaceBetween(newStaticFileContent, "/*static_port_start*/","/*static_port_end*/",port)
    										fs.writeFileSync( oldStaticFilePath,  newStaticFileContent )
    									}
    								}
                                }

                                updateRegistry(options, sha1sum)
                                //showTimer(`ret 9`)
                                returnFn( {
                                                code_id:            sha1sum,
                                                base_component_id:  baseComponentId
                                                })
                            }
                        }


                    })
        }, sqlite3.OPEN_READONLY)
        })
      //showTimer(`ret prom`)

    var ret = await promise;
    return ret
}









//-----------------------------------------------------------------------------------------//
//                                                                                         //
//                                        setUpSql                                         //
//                                                                                         //
//   This sets up the SqlLite prepared statements                                          //
//                                                                                         //
//                                                                                         //
//                                                                                         //
//                                                                                         //
//                                                                                         //
//                                                                                         //
//-----------------------------------------------------------------------------------------//
function setUpSql() {
    console.log("setUpSql    ")
    copyMigration = dbsearch.prepare(
    `                insert into  app_db_latest_ddl_revisions
                       (base_component_id,latest_revision)
                    select ?,  latest_revision from app_db_latest_ddl_revisions
                     where base_component_id=?

    `
    );

    stmtInsertIntoAppRegistry = dbsearch.prepare(" insert or replace into app_registry " +
                                "    (id,  username, reponame, version, code_id ) " +
                                " values " +
                                "    (?, ?, ?, ?, ? );");


    stmtUpdateAppRegistry = dbsearch.prepare(" update app_registry " +
                                "    set code_id = ? " +
                                " where " +
                                "    username = ?  and  reponame = ? and version = ?;");



    stmtInsertDependency = dbsearch.prepare(" insert or replace into app_dependencies " +
                                "    (id,  code_id, dependency_type, dependency_name, dependency_version ) " +
                                " values " +
                                "    (?, ?, ?, ?, ? );");

    stmtInsertIpfsHash = dbsearch.prepare(" insert or replace into ipfs_hashes " +
        "    (ipfs_hash, content_type, ping_count, last_pinged ) " +
        " values " +
        "    ( ?, ?, ?, ? );");


    stmtInsertSubComponent = dbsearch.prepare(`insert or ignore
                                                    into
                                               component_usage
                                                    (base_component_id, child_component_id)
                                               values (?,?)`)

    stmtInsertComponentList = dbsearch.prepare(`insert or ignore
                                                    into
                                               component_list
                                                    (  id  ,  component_name  ,  component_description  ,  icon_image_id  ,  ipfs_hash  ,  system_code_id  )
                                               values (?,?,?,?,?,?)`)


    stmtInsertAppList = dbsearch.prepare(`insert or ignore
                                                    into
                                               app_list
                                                    (  id  ,  app_name  ,  app_description  ,  icon_image_id  ,  ipfs_hash  ,  system_code_id  )
                                               values (?,?,?,?,?,?)`)


    stmtDeleteDependencies = dbsearch.prepare(" delete from  app_dependencies   where   code_id = ?");



    stmtDeleteTypesForComponentProperty = dbsearch.prepare(" delete from  component_property_types   where   component_name = ?");
    stmtDeleteAcceptTypesForComponentProperty = dbsearch.prepare(" delete from  component_property_accept_types   where   component_name = ?");


    //select name from (select distinct(name) ,count(name) cn from test  where value in (1,2,3)  group by name) where cn = 3
    stmtInsertComponentProperty = dbsearch.prepare(`insert or ignore
                                                    into
                                               component_properties
                                                    (component_name, property_name )
                                               values ( ?,?)`)

    stmtInsertTypesForComponentProperty = dbsearch.prepare(`insert or ignore
                                                    into
                                               component_property_types
                                                    (component_name, property_name , type_name, type_value )
                                               values ( ?,?,?,?)`)

    stmtInsertAcceptTypesForComponentProperty = dbsearch.prepare(`insert or ignore
                                                    into
                                               component_property_accept_types
                                                    (component_name, property_name , accept_type_name , accept_type_value )
                                               values ( ?,?,?,?)`)


     stmtInsertAppDDLRevision = dbsearch.prepare(  " insert into app_db_latest_ddl_revisions " +
                                                  "      ( base_component_id,  latest_revision  ) " +
                                                  " values " +
                                                  "      ( ?,  ? );");

     stmtUpdateLatestAppDDLRevision = dbsearch.prepare(  " update  app_db_latest_ddl_revisions  " +
                                                          "     set  latest_revision = ? " +
                                                          " where " +
                                                          "     base_component_id =  ? ;");

      stmtInsertNewCode = dbsearch.prepare(
          " insert into   system_code  (id, parent_id, code_tag, code,on_condition, base_component_id, method, max_processes,component_scope,display_name, creation_timestamp,component_options, logo_url, visibility, interfaces,use_db, editors, read_write_status,properties, component_type, control_sub_type, edit_file_path, ipfs_hash_id) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
      stmtDeprecateOldCode = dbsearch.prepare(
          " update system_code  set code_tag = NULL where base_component_id = ? and id != ?");



          setProcessToRunning = dbsearch.prepare("UPDATE system_process_info SET status = 'RUNNING', last_driver = ?, last_event = ?, running_start_time_ms = ?, event_duration_ms = 0, system_code_id = ?, callback_index = ? WHERE process = ? AND yazz_instance_id = ?");

          setProcessToIdle = dbsearch.prepare("UPDATE system_process_info SET status = 'IDLE' WHERE process = ? AND yazz_instance_id = ?");
          setProcessRunningDurationMs  = dbsearch.prepare("UPDATE  system_process_info  SET event_duration_ms = ?  WHERE  process = ? AND yazz_instance_id = ?");

          insertIntoProcessTable = dbsearch.prepare(
              " insert into "+
              "     system_process_info (yazz_instance_id, process, process_id, running_since, status, job_priority) " +
              " values " +
              "     (?,?,?,?,?,?)")

          updateProcessTable = dbsearch.prepare(
              "UPDATE  system_process_info " +
              "      SET process_id = ?, running_since = ?, status = ?, job_priority = ? " +
              "WHERE " +
              "     yazz_instance_id = ? AND process = ? ")

    console.log("setUpSql done   ")

}





//------------------------------------------------------------------------------
//
//
//
//
//
//------------------------------------------------------------------------------
function updateRegistry(options, sha1sum) {

    if ((!isValidObject(options)) || (!options.username) || (!options.reponame)) {
        return
    }
    if (!options.version) {
        options.version = "latest"
    }
    if (!sha1sum) {
        return
    }
    try {

        dbsearch.serialize(
            function() {
                dbsearch.all(
                    "SELECT  *  from  app_registry  where  username = ?  and  reponame = ? and version = ?; "
                    ,
                    [options.username  ,  options.reponame  ,  options.version]
                    ,

                    function(err, results)
                    {

                        try {
                            dbsearch.serialize(function() {
                                dbsearch.run("begin exclusive transaction");
                                if (results.length == 0) {
                                    stmtInsertIntoAppRegistry.run(uuidv1(),  options.username  ,  options.reponame  ,  options.version,  sha1sum)
                                } else {
                                    stmtUpdateAppRegistry.run(sha1sum, options.username  ,  options.reponame  ,  options.version)
                                }
                                dbsearch.run("commit")
                            })
                        } catch(er) {
                            console.log(er)
                        }


                     })
                 },
                 sqlite3.OPEN_READONLY)


    } catch (ewr) {
        console.log(ewr)
    }
}





//------------------------------------------------------------------------------
//
//
//
//
//
//------------------------------------------------------------------------------
function copyFile(source, target, cb) {
  var cbCalled = false;

  var rd = fs.createReadStream(source);
  rd.on("error", function(err) {
    done(err);
  });
  var wr = fs.createWriteStream(target);
  wr.on("error", function(err) {
    done(err);
  });
  wr.on("close", function(ex) {
    done();
  });
  rd.pipe(wr);

  function done(err) {
    if (!cbCalled) {
      cb(err);
      cbCalled = true;
    }
  }
}








//------------------------------------------------------------------------------
//
//
//
//
//
//------------------------------------------------------------------------------
function updateRevisions(sqlite, baseComponentId) {
    //console.log("updateRevisions    ")
    try {

        dbsearch.serialize(
            function() {
                dbsearch.all(
                    "SELECT  *  from  app_db_latest_ddl_revisions  where  base_component_id = ? ; "
                    ,
                    baseComponentId
                    ,

                    function(err, results)
                    {
                        var latestRevision = null
                        if (results.length > 0) {
                            latestRevision = results[0].latest_revision
                        }
                        var dbPath = path.join(userData, 'app_dbs/' + baseComponentId + '.visi')
                        var appDb = new sqlite3.Database(dbPath);
                        //appDb.run("PRAGMA journal_mode=WAL;")

                        appDb.serialize(
                            function() {
                              try {
                                appDb.run("begin exclusive transaction");
                                var newLatestRev = null
                                var readIn = false
                                if (sqlite.migrations) {
                                  for (var i=0; i < sqlite.migrations.length; i++) {
                                      var sqlStKey = sqlite.migrations[i].name

                                      for (var j = 0  ;  j < sqlite.migrations[i].up.length  ;  j++ ) {
                                          if ((latestRevision == null) || readIn) {
                                              var sqlSt = sqlite.migrations[i].up[j]
                                              //console.log("sqlSt: = " + sqlSt)
                                              appDb.run(sqlSt);
                                              newLatestRev = sqlStKey
                                          }
                                          if (latestRevision == sqlStKey) {
                                              readIn = true
                                          }
                                      }
                                  }

                                }

                                appDb.run("commit");
                                //appDb.run("PRAGMA wal_checkpoint;")

                                try {
                                    dbsearch.serialize(function() {
                                        dbsearch.run("begin exclusive transaction");
                                        if (results.length == 0) {
                                            stmtInsertAppDDLRevision.run(baseComponentId, newLatestRev)
                                        } else {
                                            if (newLatestRev) {
                                                stmtUpdateLatestAppDDLRevision.run(newLatestRev,baseComponentId)
                                            }
                                        }
                                        dbsearch.run("commit")
                                    })
                                } catch(er) {
                                    console.log(er)
                                }

                          } catch(ewq) {
                                console.log(ewq)
                          }

                     })
                 })
        }
        ,
        sqlite3.OPEN_READONLY)
    } catch (ewr) {
        console.log(ewr)
    }
}







//------------------------------------------------------------------------------
//
//
//
//
//
//------------------------------------------------------------------------------
function fastForwardToLatestRevision(sqlite, baseComponentId) {
    //console.log("fastForwardToLatestRevision    ")
    try {

        dbsearch.serialize(
            function() {
                dbsearch.all(
                    "SELECT  *  from  app_db_latest_ddl_revisions  where  base_component_id = ? ; "
                    ,
                    baseComponentId
                    ,

                    function(err, results)
                    {
                        var latestRevision = null
                        if (results.length > 0) {
                            latestRevision = results[0].latest_revision
                        }
                        var newLatestRev = null
                        var readIn = false
                        for (var i=0; i < sqlite.migrations.length; i+=2) {
                            var sqlStKey = sqlite.migrations[i].name

                            for (var j = 0  ;  j < sqlite.migrations[i].up.length  ;  j++ ) {
                                if ((latestRevision == null) || readIn) {
                                    var sqlSt = sqlite.migrations[i].name
                                    newLatestRev = sqlStKey
                                }
                                if (latestRevision == sqlStKey) {
                                    readIn = true
                                }
                            }
                        }

                        dbsearch.serialize(function() {
                            dbsearch.run("begin exclusive transaction");
                            if (results.length == 0) {
                                stmtInsertAppDDLRevision.run(baseComponentId, newLatestRev)
                            } else {
                                if (newLatestRev) {
                                    stmtUpdateLatestAppDDLRevision.run(newLatestRev,baseComponentId)
                                }
                            }
                            dbsearch.run("commit")
                        })


                 })
        }
        ,
        sqlite3.OPEN_READONLY)
    } catch (ewr) {
        console.log(ewr)
    }
}





async function save_code_from_upload(msg) {
    //console.log(`Entering  save_code_from_upload`)


    var ret = await saveCodeV2(  msg.base_component_id, msg.parent_hash  ,  msg.code  , msg.options);
    var useDb = msg.base_component_id //saveHelper.getValueOfCodeString(msg.code ,"use_db")
    if (msg.sqlite_data) {
            //console.log("msg.sqlite_data: " + msg.sqlite_data)
            var b = Buffer.from(msg.sqlite_data, 'base64')
            //console.log("use_db: " + useDb)
            var sqliteAppDbPath = path.join( userData, 'app_dbs/' + msg.base_component_id + '.visi' )
            fs.writeFileSync(sqliteAppDbPath, b);

    }


    ipc_child_returning_uploaded_app_as_file_in_child_response(
            {
                message_type:           'ipc_child_returning_uploaded_app_as_file_in_child_response',
                code_id:                 ret.code_id,
                base_component_id:       ret.base_component_id,
                client_file_upload_id:   msg.client_file_upload_id
            })
    }




function ipc_child_returning_uploaded_app_as_file_in_child_response(msg) {

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
}








        //------------------------------------------------------------------------------
        //
        //
        //
        //
        //
        //------------------------------------------------------------------------------
        function add_rest_api(msg)  {

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
                            callDriverMethod({
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
                    if (jaegercollector) {
                        console.log("calling jaeger...")
                        try {
                            tracer = initJaegerTracer(jaegerConfig, jaegerOptions);
                            let span=tracer.startSpan(url)
                            span.setTag("call", "some-params")
                            span.finish()
                            tracer.close()
                            console.log("...called jaeger")
                        } catch(err){
                            console.log("Error calling jaeger: " + err)
                        }
                    }
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


}





//------------------------------------------------------------------------------
//
//
//
//
//
//------------------------------------------------------------------------------
async function evalLocalSystemDriver(driverName, location, options) {
    outputDebug("*** Loading driver: *** : " + driverName)
    try {
        var evalDriver = fs.readFileSync(location);
    	await addOrUpdateDriver(driverName, evalDriver,options)
    } catch (error) {
        outputDebug(error)
    }

}





async function saveItemToIpfs(srcCode) {
    outputDebug("*** saveItemToIpfs: *** : " )
    var promise = new Promise(async function(returnfn) {
        let justHash = null
        try {
            let testBuffer = new Buffer(srcCode);
            console.log("Starting...")

            justHash = await OnlyIpfsHash.of(srcCode)
            let fullIpfsFilePath = path.join(fullIpfsFolderPath,  justHash)
            fs.writeFileSync(fullIpfsFilePath, srcCode);
            await insertIpfsHashRecord(justHash,null,null,null)
            await sendIpfsHashToCentralServer(justHash, srcCode)


            if (isIPFSConnected) {
                ipfs.files.add(testBuffer, function (err, file) {
                    if (err) {
                        console.log("....................................Err: " + err);
                    }
                    console.log("....................................file: " + JSON.stringify(file, null, 2))
                    let thehash = file[0].hash
                    //const validCID = "QmdQASbsK8bF5DWUxUJ5tBpJbnUVtKWTsYiK4vzXg5AXPf"
                    const validCID = thehash

                    ipfs.files.get(validCID, function (err, files) {
                        files.forEach((file) => {
                            console.log("....................................file.path: " + file.path)
                            console.log(file.content.toString('utf8'))
                            console.log("....................................file.path: " + file.path)
                            returnfn(thehash)
                        })
                    })
                })
            } else {
                returnfn(justHash)
            }

        } catch (error) {
            outputDebug(error)
            returnfn(justHash)
        }
    })
    var ipfsHash = await promise
    return ipfsHash
}




async function sendIpfsHashToCentralServer(ipfs_hash , ipfsContent) {
    let centralHost = program.centralhost
    let centralPort = program.centralhostport
    let promise = new Promise(async function(returnfn) {
        try {
            const dataString = JSON.stringify(
                {
                    ipfs_hash: ipfs_hash,
                    ipfs_content: ipfsContent
                })

            let options = {
                host: centralHost,
                port: centralPort,
                path: '/register_ipfs',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': dataString.length
                }
            };
//https
            let theHttpsConn = http
            if (useHttps) {
                theHttpsConn = https
            }
            let req = theHttpsConn.request(options, function(res) {
                console.log('STATUS: ' + res.statusCode);
                console.log('HEADERS: ' + JSON.stringify(res.headers));
                res.setEncoding('utf8');
                res.on('data', function (chunk) {
                    console.log('BODY: ' + chunk);
                });
                res.on('end', function () {
                    console.log('end: ' );
                });
            });
            req.write(dataString)
            req.end()
            returnfn()
        } catch(er) {
            console.log(er)
            returnfn()
        }
    })
    await promise
    return
}



async function insertIpfsHashRecord(ipfs_hash, content_type, ping_count, last_pinged ) {
    let promise = new Promise(async function(returnfn) {
        try {
            dbsearch.serialize(function() {
                dbsearch.run("begin exclusive transaction");
                stmtInsertIpfsHash.run(  ipfs_hash,  content_type,  ping_count,  last_pinged  )
                dbsearch.run("commit")
                returnfn()
            })
        } catch(er) {
            console.log(er)
            returnfn()
        }
    })
    var ipfsHash = await promise
    return ipfsHash
}


async function insertAppListRecord( id  ,  app_name  ,  app_description  ,  icon_image_id  ,  ipfs_hash  ,  system_code_id ) {
    let promise = new Promise(async function(returnfn) {
        try {
            dbsearch.serialize(function() {
                dbsearch.run("begin exclusive transaction");
                stmtInsertAppList.run(   id  ,  app_name  ,  app_description  ,  icon_image_id  ,  ipfs_hash  ,  system_code_id )
                dbsearch.run("commit")
                returnfn()
            })
        } catch(er) {
            console.log(er)
            returnfn()
        }
    })
    let val = await promise
    return val
}



async function insertComponentListRecord( id  ,  component_name  ,  component_description  ,  icon_image_id  ,  ipfs_hash  ,  system_code_id ) {
    let promise = new Promise(async function(returnfn) {
        try {
            dbsearch.serialize(function() {
                dbsearch.run("begin exclusive transaction");
                stmtInsertComponentList.run(   id  ,  component_name  ,  component_description  ,  icon_image_id  ,  ipfs_hash  ,  system_code_id )
                dbsearch.run("commit")
                returnfn()
            })
        } catch(er) {
            console.log(er)
            returnfn()
        }
    })
    let val = await promise
    return val
}


async function registerIPFS(ipfs_hash) {
    await insertIpfsHashRecord(ipfs_hash,null,null,null)
}


async function loadComponentFromIpfs(ipfsHash) {
    outputDebug("*** loadComponentFromIpfs: *** : " )

    let promise = new Promise(async function(returnfn) {
        try
        {
            let fullIpfsFilePath = path.join(fullIpfsFolderPath,  ipfsHash)
            let srcCode = fs.readFileSync(fullIpfsFilePath);
            let baseComponentId = saveHelper.getValueOfCodeString(srcCode,"base_component_id")



                let properties = saveHelper.getValueOfCodeString(srcCode,"properties", ")//prope" + "rties")
                srcCode = saveHelper.deleteCodeString(  srcCode, "properties", ")//prope" + "rties")
                for (let irte = 0 ; irte < properties.length ; irte++ ) {
                    let brje = properties[irte]
                    if (brje.id == "ipfs_hash_id") {
                        brje.default = ipfsHash
                    }
                }

                srcCode = saveHelper.insertCodeString(  srcCode,
                    "properties",
                    properties,
                    ")//prope" + "rties")

                await addOrUpdateDriver(baseComponentId, srcCode ,  {username: "default", reponame: baseComponentId, version: "latest", ipfsHashId: ipfsHash})

                console.log("....................................Loading component from local IPFS cache: " + fullIpfsFilePath)
                returnfn("Done")

            } catch (error) {
                try
                {

                ipfs.files.get(ipfsHash, function (err, files) {
                    files.forEach(async function(file) {
                        console.log("....................................Loading component fro IPFS: " + file.path)
                        //console.log(file.content.toString('utf8'))
                        srcCode = file.content.toString('utf8')



                        let baseComponentId = saveHelper.getValueOfCodeString(srcCode,"base_component_id")



                        let properties = saveHelper.getValueOfCodeString(srcCode,"properties", ")//prope" + "rties")
                        srcCode = saveHelper.deleteCodeString(  srcCode, "properties", ")//prope" + "rties")
                        for (let irte = 0 ; irte < properties.length ; irte++ ) {
                            let brje = properties[irte]
                            if (brje.id == "ipfs_hash_id") {
                                brje.default = ipfsHash
                            }
                        }

                        srcCode = saveHelper.insertCodeString(  srcCode,
                            "properties",
                            properties,
                            ")//prope" + "rties")



                        let fullIpfsFilePath = path.join(fullIpfsFolderPath,  ipfsHash)
                        fs.writeFileSync(fullIpfsFilePath, srcCode);

                        await addOrUpdateDriver(baseComponentId, srcCode ,  {username: "default", reponame: baseComponentId, version: "latest", ipfsHashId: ipfsHash})

                        console.log("....................................Loading component fro IPFS: " + file.path)
                    })
                    returnfn("Done")
                })
            } catch (error) {
                outputDebug(error)
            }
        }



    })
    var ret = await promise
    return ret
}







//------------------------------------------------------------------------------
//
//
//
//
//
//------------------------------------------------------------------------------
async function addOrUpdateDriver(  name, codeString ,options ) {
    //console.log('addOrUpdateDriver: ' + name);

    var promise = new Promise(async function(returnfn) {

        dbsearch.serialize(
            function() {
                dbsearch.all(
                    " select  " +
                    "     base_component_id, code, id " +
                    " from " +
                    "     system_code " +
                    " where " +
                    "     base_component_id = ? and code_tag = 'LATEST';"
                    ,
                    name
                    ,
                    async function(err, rows) {
                        if (!err) {
                            try {
                                var parentId = null
                                if (rows.length > 0) {
                                    parentId = rows[0].id
                                }

                                await saveCodeV2(  name, parentId,    codeString  ,options);



                              } catch(err) {
                                  console.log(err);
                                  var stack = new Error().stack
                                  console.log( stack )
                              } finally {
                                returnfn({})
                              }

                  }
              }
          );
      }, sqlite3.OPEN_READONLY)
  })
  var ret = await promise
  return ret
}

















//------------------------------------------------------------------------------
//
//
//
//
//
//------------------------------------------------------------------------------
async function setUpComponentsLocally() {
    //await evalLocalSystemDriver('glb',                    path.join(__dirname, '../public/visifile_drivers/glb.js'),{username: "default", reponame: "", version: "latest"})
    //await evalLocalSystemDriver('csv',                    path.join(__dirname, '../public/visifile_drivers/csv.js'),{username: "default", reponame: "", version: "latest"})
    //await evalLocalSystemDriver('txt',                    path.join(__dirname, '../public/visifile_drivers/glb.js'),{username: "default", reponame: "", version: "latest"})
    //await evalLocalSystemDriver('excel',                  path.join(__dirname, '../public/visifile_drivers/excel.js'),{username: "default", reponame: "", version: "latest"})
    //await evalLocalSystemDriver('word',                   path.join(__dirname, '../public/visifile_drivers/word.js'),{username: "default", reponame: "", version: "latest"})
    //await evalLocalSystemDriver('pdf',                    path.join(__dirname, '../public/visifile_drivers/pdf.js'),{username: "default", reponame: "", version: "latest"})

    //await evalLocalSystemDriver('outlook2012',            path.join(__dirname, '../public/visifile_drivers/outlook2012.js'),{username: "default", reponame: "", version: "latest"})
    //await evalLocalSystemDriver('outlook2010')
    //await evalLocalSystemDriver('sqlite',                 path.join(__dirname, '../public/visifile_drivers/sqlite.js'),{username: "default", reponame: "", version: "latest"})
    //await evalLocalSystemDriver('mysql',                  path.join(__dirname, '../public/visifile_drivers/mysql.js'),{username: "default", reponame: "", version: "latest"})
    //await evalLocalSystemDriver('oracle',                 path.join(__dirname, '../public/visifile_drivers/oracle.js'),{username: "default", reponame: "", version: "latest"})
    //await evalLocalSystemDriver('testdriver',             path.join(__dirname, '../public/visifile_drivers/testdriver.js'),{username: "default", reponame: "", version: "latest"})

    //await evalLocalSystemDriver('fileuploader',           path.join(__dirname, '../public/visifile_drivers/file_uploader.js'),{username: "default", reponame: "", version: "latest"})



    //
    // services
    //
    if (isWin) {
        //await evalLocalSystemDriver('powershell',         path.join(__dirname, '../public/visifile_drivers/services/powershell.js'),{username: "default", reponame: "", version: "latest"})
    }
    await evalLocalSystemDriver('commandLine',              path.join(__dirname, '../public/visifile_drivers/services/commandLine.js'),{username: "default", reponame: "commandLine", version: "latest"})
    await evalLocalSystemDriver('commandLine2',             path.join(__dirname, '../public/visifile_drivers/services/commandLine2.js'),{username: "default", reponame: "commandLine2", version: "latest"})
    await evalLocalSystemDriver('copyApp',                  path.join(__dirname, '../public/visifile_drivers/services/copyApp.js'),{username: "default", reponame: "copyApp", version: "latest"})
    await evalLocalSystemDriver('test_job',                 path.join(__dirname, '../public/visifile_drivers/services/test_job.js'),{username: "default", reponame: "test_job", version: "latest"})
    await evalLocalSystemDriver('kafka_service',            path.join(__dirname, '../public/visifile_drivers/services/kafka_service.js'),{username: "default", reponame: "kafka_service", version: "latest"})

    await evalLocalSystemDriver('activemq_service',            path.join(__dirname, '../public/visifile_drivers/services/activemq_service.js'),{username: "default", reponame: "activemq_service", version: "latest"})


    await evalLocalSystemDriver('findComponentsImplementing',            path.join(__dirname, '../public/visifile_drivers/services/find_components_implementing.js'),{username: "default", reponame: "find_components_implementing", version: "latest"})



    //await evalLocalSystemDriver('webPreview',             path.join(__dirname, '../public/visifile_drivers/services/web_preview.js'),{username: "default", reponame: "", version: "latest"})

    //await evalLocalSystemDriver('spreahsheetPreview',     path.join(__dirname, '../public/visifile_drivers/services/spreadsheet_preview.js'),{username: "default", reponame: "", version: "latest"})
    //await evalLocalSystemDriver('csvPreview',             path.join(__dirname, '../public/visifile_drivers/services/csv_preview.js'),{username: "default", reponame: "", version: "latest"})
    //await evalLocalSystemDriver('docPreview',             path.join(__dirname, '../public/visifile_drivers/services/doc_preview.js'),{username: "default", reponame: "", version: "latest"})



    await evalLocalSystemDriver('serverDriveList',   path.join(__dirname, '../public/visifile_drivers/services/serverDriveList.js'),{username: "default", reponame: "serverDriveList", version: "latest"})
    await evalLocalSystemDriver('serverFolderHierarchyList',   path.join(__dirname, '../public/visifile_drivers/services/serverFolderHierarchyList.js'),{username: "default", reponame: "serverFolderHierarchyList", version: "latest"})
    await evalLocalSystemDriver('serverGetHomeDir',   path.join(__dirname, '../public/visifile_drivers/services/serverGetHomeDir.js'),{username: "default", reponame: "serverGetHomeDir", version: "latest"})
    await evalLocalSystemDriver('serverFileList',   path.join(__dirname, '../public/visifile_drivers/services/serverFileList.js'),{username: "default", reponame: "serverFileList", version: "latest"})
    await evalLocalSystemDriver('serverFolderContents',   path.join(__dirname, '../public/visifile_drivers/services/serverFolderContents.js'),{username: "default", reponame: "serverFolderContents", version: "latest"})
    await evalLocalSystemDriver('serverFolderContentsV2',   path.join(__dirname, '../public/visifile_drivers/services/serverFolderContentsV2.js'),{username: "default", reponame: "serverFolderContentsV2", version: "latest"})
    await evalLocalSystemDriver('compile_solidity',   path.join(__dirname, '../public/visifile_drivers/services/compile_solidity.js'),{username: "default", reponame: "compile_solidity", version: "latest"})



    await evalLocalSystemDriver('serverDatabaseStuff',   path.join(__dirname, '../public/visifile_drivers/services/serverDatabaseStuff.js'),{username: "default", reponame: "serverDatabaseStuff", version: "latest"})
    await evalLocalSystemDriver('serverDockerStuff',   path.join(__dirname, '../public/visifile_drivers/services/serverDockerStuff.js'),{username: "default", reponame: "serverDockerStuff", version: "latest"})
    await evalLocalSystemDriver('serverTerminalStuff',   path.join(__dirname, '../public/visifile_drivers/services/serverTerminalStuff.js'),{username: "default", reponame: "serverTerminalStuff", version: "latest"})

    await evalLocalSystemDriver('postgres_server',   path.join(__dirname, '../public/visifile_drivers/services/postgres_server.js'),{username: "default", reponame: "postgres_server", version: "latest"})

    await evalLocalSystemDriver('sqlite_server',   path.join(__dirname, '../public/visifile_drivers/services/sqlite_server.js'),{username: "default", reponame: "sqlite_server", version: "latest"})

    await evalLocalSystemDriver('access_server',   path.join(__dirname, '../public/visifile_drivers/services/access_server.js'),{username: "default", reponame: "access_server", version: "latest"})
    await evalLocalSystemDriver('excel_server',   path.join(__dirname, '../public/visifile_drivers/services/excel_server.js'),{username: "default", reponame: "excel_server", version: "latest"})

    await evalLocalSystemDriver('rest_call_service',   path.join(__dirname, '../public/visifile_drivers/services/rest_call_service.js'),{username: "default", reponame: "rest_call_service", version: "latest"})
    await evalLocalSystemDriver('rest_call_service_v2',   path.join(__dirname, '../public/visifile_drivers/services/rest_call_service_v2.js'),{username: "default", reponame: "rest_call_service_v2", version: "latest"})
    await evalLocalSystemDriver('json_traverse_service',   path.join(__dirname, '../public/visifile_drivers/services/json_traverse_service.js'),{username: "default", reponame: "json_traverse_service", version: "latest"})
    await evalLocalSystemDriver('json_filter_service',   path.join(__dirname, '../public/visifile_drivers/services/json_filter_service.js'),{username: "default", reponame: "json_filter_service", version: "latest"})


    //
    // debug controls
    //
    //await evalLocalSystemDriver('bug_vue',   path.join(__dirname, '../public/visifile_drivers/controls/bug_vue.js'),{username: "default", reponame: "bug_vue", version: "latest"})

    //
    // controls
    //
    await evalLocalSystemDriver('chart_control',   path.join(__dirname, '../public/visifile_drivers/controls/chart.js'),{username: "default", reponame: "chart_control", version: "latest"})

    await evalLocalSystemDriver('image_control',   path.join(__dirname, '../public/visifile_drivers/controls/image.js'),{username: "default", reponame: "image_control", version: "latest"})

    await evalLocalSystemDriver('label_control',   path.join(__dirname, '../public/visifile_drivers/controls/label.js'),{username: "default", reponame: "label_control", version: "latest"})
    await evalLocalSystemDriver('metamask_control',   path.join(__dirname, '../public/visifile_drivers/controls/metamask.js'),{username: "default", reponame: "metamask_control", version: "latest"})
    await evalLocalSystemDriver('evm_contract_control',   path.join(__dirname, '../public/visifile_drivers/controls/evm_contract.js'),{username: "default", reponame: "evm_contract_control", version: "latest"})
    await evalLocalSystemDriver('component_builder_control',   path.join(__dirname, '../public/visifile_drivers/controls/component_builder.js'),{username: "default", reponame: "component_builder_control", version: "latest"})
    await evalLocalSystemDriver('evm_demo_count_contract_control',   path.join(__dirname, '../public/visifile_drivers/controls/evm_demo_count_contract.js'),{username: "default", reponame: "evm_demo_count_contract_control", version: "latest"})

    //
    await evalLocalSystemDriver('input_control',   path.join(__dirname, '../public/visifile_drivers/controls/input.js'),{username: "default", reponame: "input_control", version: "latest"})

    await evalLocalSystemDriver('group_control',   path.join(__dirname, '../public/visifile_drivers/controls/group.js'),{username: "default", reponame: "group_control", version: "latest"})
    await evalLocalSystemDriver('button_control',   path.join(__dirname, '../public/visifile_drivers/controls/button.js'),{username: "default", reponame: "button_control", version: "latest"})

    await evalLocalSystemDriver('checkbox_control',   path.join(__dirname, '../public/visifile_drivers/controls/checkbox.js'),{username: "default", reponame: "checkbox_control", version: "latest"})
    await evalLocalSystemDriver('radio_button_control',   path.join(__dirname, '../public/visifile_drivers/controls/radiobutton.js'),{username: "default", reponame: "radio_button_control", version: "latest"})

    await evalLocalSystemDriver('dropdown_control',   path.join(__dirname, '../public/visifile_drivers/controls/dropdown.js'),{username: "default", reponame: "dropdown_control", version: "latest"})
    await evalLocalSystemDriver('list_control',   path.join(__dirname, '../public/visifile_drivers/controls/list.js'),{username: "default", reponame: "list_control", version: "latest"})

    await evalLocalSystemDriver('horiz_scroll_control',   path.join(__dirname, '../public/visifile_drivers/controls/horiz_scroll.js'),{username: "default", reponame: "horiz_scroll_control", version: "latest"})
    await evalLocalSystemDriver('vert_scroll_control',   path.join(__dirname, '../public/visifile_drivers/controls/vert_scroll.js'),{username: "default", reponame: "vert_scroll_control", version: "latest"})


    await evalLocalSystemDriver('timer_control',   path.join(__dirname, '../public/visifile_drivers/controls/timer.js'),{username: "default", reponame: "timer_control", version: "latest"})
    await evalLocalSystemDriver('drive_list_control',   path.join(__dirname, '../public/visifile_drivers/controls/drive_list.js'),{username: "default", reponame: "drive_list_control", version: "latest"})

    await evalLocalSystemDriver('folder_list_control',   path.join(__dirname, '../public/visifile_drivers/controls/folder_list.js'),{username: "default", reponame: "folder_list_control", version: "latest"})
    await evalLocalSystemDriver('file_list_control',   path.join(__dirname, '../public/visifile_drivers/controls/file_list.js'),{username: "default", reponame: "file_list_control", version: "latest"})

    await evalLocalSystemDriver('shapes_control',   path.join(__dirname, '../public/visifile_drivers/controls/shapes.js'),{username: "default", reponame: "shapes_control", version: "latest"})
    await evalLocalSystemDriver('line_control',   path.join(__dirname, '../public/visifile_drivers/controls/line.js'),{username: "default", reponame: "line_control", version: "latest"})

    await evalLocalSystemDriver('draw_control',   path.join(__dirname, '../public/visifile_drivers/controls/draw.js'),{username: "default", reponame: "draw_control", version: "latest"})
    await evalLocalSystemDriver('database_control',   path.join(__dirname, '../public/visifile_drivers/controls/database.js'),{username: "default", reponame: "database_control", version: "latest"})
    await evalLocalSystemDriver('mixer_control',   path.join(__dirname, '../public/visifile_drivers/controls/mixer.js'),{username: "default", reponame: "mixer_control", version: "latest"})


    await evalLocalSystemDriver('ms_access_control',   path.join(__dirname, '../public/visifile_drivers/controls/ms_access.js'),{username: "default", reponame: "ms_access_control", version: "latest"})
    await evalLocalSystemDriver('ms_excel_control',   path.join(__dirname, '../public/visifile_drivers/controls/ms_excel.js'),{username: "default", reponame: "ms_excel_control", version: "latest"})


    await evalLocalSystemDriver('data_window_control',   path.join(__dirname, '../public/visifile_drivers/controls/data_window.js'),{username: "default", reponame: "data_window_control", version: "latest"})

    await evalLocalSystemDriver('ace_editor',   path.join(__dirname, '../public/visifile_drivers/controls/ace_editor.js'),{username: "default", reponame: "ace_editor", version: "latest"})


    //await evalLocalSystemDriver('container_3d',        path.join(__dirname, '../public/visifile_drivers/controls/container_3d.js'),{username: "default", reponame: "container_3d", version: "latest"})
    //await evalLocalSystemDriver('item_3d',   path.join(__dirname, '../public/visifile_drivers/controls/item_3d.js'),{username: "default", reponame: "item_3d", version: "latest"})


    await evalLocalSystemDriver('terminal_control',   path.join(__dirname, '../public/visifile_drivers/controls/terminal_ui.js'),{username: "default", reponame: "terminal_control", version: "latest"})
    await evalLocalSystemDriver('osquery_control',   path.join(__dirname, '../public/visifile_drivers/controls/osquery_ui.js'),{username: "default", reponame: "osquery_control", version: "latest"})
    await evalLocalSystemDriver('rest_control',   path.join(__dirname, '../public/visifile_drivers/controls/rest_ui.js'),{username: "default", reponame: "rest_control", version: "latest"})
    await evalLocalSystemDriver('tree_to_table_control',   path.join(__dirname, '../public/visifile_drivers/controls/tree_to_table.js'),{username: "default", reponame: "tree_to_table_control", version: "latest"})
    await evalLocalSystemDriver('docker_control',   path.join(__dirname, '../public/visifile_drivers/controls/ducker.js'),{username: "default", reponame: "docker_control", version: "latest"})
    await evalLocalSystemDriver('table_control',   path.join(__dirname, '../public/visifile_drivers/controls/table.js'),{username: "default", reponame: "table_control", version: "latest"})



    await evalLocalSystemDriver('rh3scale_control',   path.join(__dirname, '../public/visifile_drivers/controls/rh3scale.js'),{username: "default", reponame: "rh3scale_control", version: "latest"})
    await evalLocalSystemDriver('kubernetes_control',   path.join(__dirname, '../public/visifile_drivers/controls/kubernetes.js'),{username: "default", reponame: "kubernetes_control", version: "latest"})
    await evalLocalSystemDriver('kafka_control',   path.join(__dirname, '../public/visifile_drivers/controls/kafka.js'),{username: "default", reponame: "kafka_control", version: "latest"})
    //await evalLocalSystemDriver('rhfuse_control',   path.join(__dirname, '../public/visifile_drivers/controls/rhfuse.js'),{username: "default", reponame: "", version: "latest"})
    //await evalLocalSystemDriver('rhamq_control',   path.join(__dirname, '../public/visifile_drivers/controls/rhamq.js'),{username: "default", reponame: "", version: "latest"})
    await evalLocalSystemDriver('rhdm_control',   path.join(__dirname, '../public/visifile_drivers/controls/rhdm.js'),{username: "default", reponame: "", version: "latest"})
    //await evalLocalSystemDriver('rhpam_control',   path.join(__dirname, '../public/visifile_drivers/controls/rhpam.js'),{username: "default", reponame: "", version: "latest"})
    //await evalLocalSystemDriver('rhdata_grid_control',   path.join(__dirname, '../public/visifile_drivers/controls/rhdata_grid.js'),{username: "default", reponame: "", version: "latest"})
    //await evalLocalSystemDriver('rhopenshift_control',   path.join(__dirname, '../public/visifile_drivers/controls/rhopenshift.js'),{username: "default", reponame: "", version: "latest"})




    //
    // forms
    //
    await evalLocalSystemDriver('form_subscribe_to_appshare',   path.join(__dirname, '../public/visifile_drivers/apps/formSubscribeToAppshare.js'),{username: "default", reponame: "form_subscribe_to_appshare", version: "latest"})



    //
    // functions
    //

    await evalLocalSystemDriver('systemFunctions',   path.join(__dirname, '../public/visifile_drivers/functions/system.js'),{username: "default", reponame: "systemFunctions", version: "latest"})
    await evalLocalSystemDriver('systemFunctions2',   path.join(__dirname, '../public/visifile_drivers/functions/system2.js'),{username: "default", reponame: "systemFunctions2", version: "latest"})
    await evalLocalSystemDriver('systemFunctions3',   path.join(__dirname, '../public/visifile_drivers/functions/system3.js'),{username: "default", reponame: "systemFunctions3", version: "latest"})
    await evalLocalSystemDriver('systemFunctionAppSql',   path.join(__dirname, '../public/visifile_drivers/functions/systemFunctionAppSql.js'),{username: "default", reponame: "systemFunctionAppSql", version: "latest"})
    await evalLocalSystemDriver('appEditorV2SaveCode',   path.join(__dirname, '../public/visifile_drivers/apps/appEditorV2SaveCode.js'),{username: "default", reponame: "appEditorV2SaveCode", version: "latest"})

    //
    // UI components
    //
    await evalLocalSystemDriver('comp',   path.join(__dirname, '../public/visifile_drivers/ui_components/comp.js'),{username: "default", reponame: "comp", version: "latest"})
    await evalLocalSystemDriver('editor_component',   path.join(__dirname, '../public/visifile_drivers/ui_components/editorComponent.js'),{username: "default", reponame: "editor_component", version: "latest"})
    await evalLocalSystemDriver('sqlite_editor_component',   path.join(__dirname, '../public/visifile_drivers/ui_components/sqliteEditorComponent.js'),{username: "default", reponame: "sqlite_editor_component", version: "latest"})
    await evalLocalSystemDriver('keycloak_editor_component',   path.join(__dirname, '../public/visifile_drivers/ui_components/keycloakEditorComponent.js'),{username: "default", reponame: "keycloak_editor_component", version: "latest"})
    await evalLocalSystemDriver('export_editor_component',   path.join(__dirname, '../public/visifile_drivers/ui_components/exportEditorComponent.js'),{username: "default", reponame: "export_editor_component", version: "latest"})
    await evalLocalSystemDriver('form_editor_component',   path.join(__dirname, '../public/visifile_drivers/ui_components/formEditorComponent.js'),{username: "default", reponame: "form_editor_component", version: "latest"})
    await evalLocalSystemDriver('simple_display_editor_component',   path.join(__dirname, '../public/visifile_drivers/ui_components/simpleDisplayEditorComponent.js'),{username: "default", reponame: "simple_display_editor_component", version: "latest"})
    await evalLocalSystemDriver('vb_editor_component',   path.join(__dirname, '../public/visifile_drivers/ui_components/vbEditorComponent.js'),{username: "default", reponame: "vb_editor_component", version: "latest"})

    outputDebug("Loaded all drivers")







    //
    // apps
    //
    await evalLocalSystemDriver('homepage',     path.join(__dirname, '../public/visifile_drivers/apps/homepage.js'),{save_html: true, username: "default", reponame: "homepage", version: "latest"})
    await evalLocalSystemDriver('appstore',     path.join(__dirname, '../public/visifile_drivers/apps/appstore.js'),{save_html: true, username: "default", reponame: "appstore", version: "latest"})
    await evalLocalSystemDriver('yazz_blank',   path.join(__dirname, '../public/visifile_drivers/apps/yazz_blank.js'),{username: "default", reponame: "yazz_blank", version: "latest"})



    await evalLocalSystemDriver('metamask',           path.join(__dirname, '../public/visifile_drivers/meta.yazz'),        {save_html: true, username: "default", reponame: "metamask",        version: "latest"})

    await evalLocalSystemDriver('app_editor_3',   path.join(__dirname, '../public/visifile_drivers/apps/appEditorV3.js'),{username: "default", reponame: "app_editor_3", version: "latest"})
    await evalLocalSystemDriver('appEmbed',   path.join(__dirname, '../public/visifile_drivers/apps/appEmbed.js'),{username: "default", reponame: "appEmbed", version: "latest"})
    await evalLocalSystemDriver('search',   path.join(__dirname, '../public/visifile_drivers/apps/search.js'),{username: "default", reponame: "search", version: "latest"})
    await evalLocalSystemDriver('test',   path.join(__dirname, '../public/visifile_drivers/apps/test.js'),{save_html: true, username: "default", reponame: "test", version: "latest"})
    //await evalLocalSystemDriver('oculus_go',   path.join(__dirname, '../public/visifile_drivers/apps/oculus_go.js'),{save_html: true, username: "default", reponame: "oculus_go", version: "latest"})
    //await evalLocalSystemDriver('nft_art',   path.join(__dirname, '../public/visifile_drivers/apps/nft_art.yazz'),{save_html: true, username: "default", reponame: "nft_art", version: "latest"})


    //await evalLocalSystemDriver('game',           path.join(__dirname, '../public/visifile_drivers/apps/game.js'),        {save_html: true, username: "default", reponame: "game",        version: "latest"})
    await evalLocalSystemDriver('oldhomepage',    path.join(__dirname, '../public/visifile_drivers/apps/oldhomepage.js'), {save_html: true, username: "default", reponame: "oldhomepage", version: "latest"})

    //await evalLocalSystemDriver('multi_vr',   path.join(__dirname, '../public/visifile_drivers/apps/multi_vr.vjs'),{save_html: true, username: "default", reponame: "multi_vr", version: "latest"})
    //await evalLocalSystemDriver('hologram',   path.join(__dirname, '../public/visifile_drivers/apps/hologram.js'),{save_html: true, username: "default", reponame: "hologram", version: "latest"})
    //await evalLocalSystemDriver('kinetic',   path.join(__dirname, '../public/visifile_drivers/apps/kinetic.js'),{save_html: true, username: "default", reponame: "", version: "latest"})
    await evalLocalSystemDriver('intro_logo_3d',   path.join(__dirname, '../public/visifile_drivers/apps/intro_logo_3d.js'),{save_html: true, username: "default", reponame: "intro_logo_3d", version: "latest"})
    await evalLocalSystemDriver('list_apps',   path.join(__dirname, '../public/visifile_drivers/apps/listApps.js'),{username: "default", reponame: "list_apps", version: "latest"})
    await evalLocalSystemDriver('listPublicApps',   path.join(__dirname, '../public/visifile_drivers/apps/listPublicApps.js'),{username: "default", reponame: "listPublicApps", version: "latest"})
    await evalLocalSystemDriver('vue',   path.join(__dirname, '../public/visifile_drivers/apps/vue.js'),{username: "default", reponame: "vue", version: "latest"})
    await evalLocalSystemDriver('bootstrap',   path.join(__dirname, '../public/visifile_drivers/apps/bootstrap.js'),{username: "default", reponame: "bootstrap", version: "latest"})
    await evalLocalSystemDriver('database_reader',   path.join(__dirname, '../public/visifile_drivers/apps/databaseReader.js'),{username: "default", reponame: "database_reader", version: "latest"})
    await evalLocalSystemDriver('todo',   path.join(__dirname, '../public/visifile_drivers/apps/todo.js'),{save_html: true, username: "default", reponame: "todo", version: "latest"})
    await evalLocalSystemDriver('todo_app_reader',   path.join(__dirname, '../public/visifile_drivers/apps/todo_app_reader.js'),{username: "default", reponame: "todo_app_reader", version: "latest"})
    await evalLocalSystemDriver('newSql',   path.join(__dirname, '../public/visifile_drivers/apps/newSqlApp.js'),{username: "default", reponame: "newSql", version: "latest"})
    //await evalLocalSystemDriver('yazzcraft',   path.join(__dirname, '../public/visifile_drivers/apps/yazzcraft.js'),{save_html: true, username: "default", reponame: "yazzcraft", version: "latest"})


//database drivers
await evalLocalSystemDriver('postgres_client_component', path.join(__dirname, '../public/visifile_drivers/controls/postgres.js'),{username: "default", reponame: "postgres_client_component", version: "latest"})
await evalLocalSystemDriver('sqlite_client_component', path.join(__dirname, '../public/visifile_drivers/controls/sqlite.js'),{username: "default", reponame: "sqlite_client_component", version: "latest"})
await evalLocalSystemDriver('yazz_sqlite_client_component', path.join(__dirname, '../public/visifile_drivers/controls/yazzSqlite.js'),{username: "default", reponame: "yazz_sqlite_client_component", version: "latest"})
await evalLocalSystemDriver('mysql_client_component', path.join(__dirname, '../public/visifile_drivers/controls/mysql.js'),{username: "default", reponame: "mysql_client_component", version: "latest"})





    var extraFns = fs.readFileSync( path.join(__dirname, '../src/extraFns.js') ).toString()
    outputDebug("Extra functions code:" )

    await eval("(" + extraFns + "())")

    //
    // non GUI front end apps
    //
    await evalLocalSystemDriver('rh3scale_app',   path.join(__dirname, '../public/visifile_drivers/apps/rh3scale_app.js'),{save_html: true, username: "default", reponame: "rh3scale_app", version: "latest"})
    await evalLocalSystemDriver('quicksort',  path.join(__dirname, '../public/visifile_drivers/apps/quicksort.js'),{save_html: true, username: "default", reponame: "quicksort", version: "latest"})
    await evalLocalSystemDriver('bubblesort', path.join(__dirname, '../public/visifile_drivers/apps/bubblesort.js'),{save_html: true, username: "default", reponame: "bubblesort", version: "latest"})
    await evalLocalSystemDriver('new', path.join(__dirname, '../public/visifile_drivers/apps/blank_app.js'),{save_html: true, username: "default", reponame: "new", version: "latest"})
    await evalLocalSystemDriver('new_microservice', path.join(__dirname, '../public/visifile_drivers/apps/blank_microservice.js'),{save_html: true, username: "default", reponame: "new_microservice", version: "latest"})
    await evalLocalSystemDriver('demo_microservice', path.join(__dirname, '../public/visifile_drivers/apps/demo_microservice.js'),{save_html: true, username: "default", reponame: "demo_microservice", version: "latest"})
    await evalLocalSystemDriver('echo_microservice', path.join(__dirname, '../public/visifile_drivers/apps/echo_microservice.js'),{save_html: true, username: "default", reponame: "echo_microservice", version: "latest"})
    await evalLocalSystemDriver('call_function_microservice', path.join(__dirname, '../public/visifile_drivers/apps/call_function_microservice.js'),{save_html: true, username: "default", reponame: "call_function_microservice", version: "latest"})
    await evalLocalSystemDriver('echo_post_microservice', path.join(__dirname, '../public/visifile_drivers/apps/echo_post_microservice.js'),{save_html: true, username: "default", reponame: "echo_post_microservice", version: "latest"})
    outputDebug("Loaded all apps (may use already loaded drivers)")






    await drivers_loaded_by_child()

}







function setUpPredefinedComponents() {
    setUpComponentsLocally();
}







    //------------------------------------------------------------------------------
    //
    // This is the last thing that happens when AppShare is started
    //
    //
    //
    //------------------------------------------------------------------------------
async function drivers_loaded_by_child() {
          await finalizeYazzLoading();
}





function createTables() {
  db_helper.createTables(dbsearch,
          createdTablesInChild)

}









//------------------------------------------------------------------------------
//
//
//
//
//
//------------------------------------------------------------------------------
async function createdTablesInChild() {

    outputDebug("mainNodeProcessStarted: " + mainNodeProcessStarted)

    if (!mainNodeProcessStarted) {
        mainNodeProcessStarted = true
        outputDebug("createdTablesInChild")




        isCodeTtyCode = await isTtyCode()
        //console.log("isCodeTtyCode:= " + isCodeTtyCode)



        if (isCodeTtyCode) {
            await startServices()
        } else {
            console.log("Loading Visual Javascript. Please wait a few minutes ... ")
            getPort()


        }
    }
}










function callDriverMethod(msg) {

    callDriverMethodPart2( msg.find_component, msg.args, function(result) {
        if (msg.seq_num_local) {
            return_add_local_driver_results_msg(
                {
                    message_type: 'return_add_local_driver_results_msg',
                    seq_num_local: msg.seq_num_local,
                    result: result
                })
        } else {
          //console.log("** ipc_child_returning_callDriverMethod_response **")
            ipc_child_returning_callDriverMethod_response(
                {
                    message_type: 'ipc_child_returning_callDriverMethod_response',
                    seq_num_browser: msg.seq_num_browser,
                    seq_num_parent: msg.seq_num_parent,
                    result: result
                })
        }
    })
  }





//------------------------------------------------------------------------------
//
//
//
//
//
//------------------------------------------------------------------------------
function return_add_local_driver_results_msg(msg) {
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
}




//------------------------------------------------------------------------------
//
//
//
//
//
//------------------------------------------------------------------------------
function ipc_child_returning_callDriverMethod_response(msg) {

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








  //------------------------------------------------------------------------------
  //
  //
  //
  //
  //
  //------------------------------------------------------------------------------
  function callDriverMethodPart2( findComponentArgs, args, callbackFn ) {

      //console.log("*) called '" + driverName + ":" + methodName + "' with args: " + JSON.stringify(args,null,2))
      var useCallbackIndex = callbackIndex ++
      callbackList[ useCallbackIndex ] = callbackFn
      //console.log("msg.callback_index sent for " + driverName + ":" + methodName + ": " + useCallbackIndex)
      function_call_requestPart2({  message_type:       "function_call_request" ,
                      find_component:      findComponentArgs,
                      args:                args,
                      callback_index:      useCallbackIndex,
                      caller_call_id:      -1
                      });
  }








//------------------------------------------------------------------------------
//
//
//
//
//
//------------------------------------------------------------------------------
function function_call_request(msg) {

    function_call_requestPart2({
                                            message_type:         "function_call_request",
                                            child_process_name:    msg.child_process_name,
                                            find_component:        msg.find_component,
                                            args:                  msg.args,
                                            callback_index:        msg.callback_index,
                                            caller_call_id:        msg.caller_call_id
                                          });
}






function return_response_to_function_caller(msg) {


       // console.log("*) result received to caller " );
       // console.log("*)  callback_index:" + msg.callback_index );
       // console.log("*)  result:        " + msg.result );
        callbackList[ msg.callback_index ](msg.result)
}



















//-----------------------------------------------------------------------------------------//
//                                                                                         //
//                          updateRunningTimeForprocess                                    //
//                                                                                         //
//                                                                                         //
//                                                                                         //
//-----------------------------------------------------------------------------------------//
function updateRunningTimeForprocess() {
        //console.log("Checking processes")

        dbsearch.serialize(
            function() {
                var stmt = dbsearch.all(
                  "SELECT * FROM system_process_info where  status = 'RUNNING'  AND  yazz_instance_id = ?; "
                  ,
                  [  yazzInstanceId  ]
                  ,

                    function(err, results)
                    {
                        if (results) {
                           var timeNow = new Date().getTime();
                           dbsearch.run("begin exclusive transaction");
                           for (var ii = 0 ; ii < results.length ; ii++ ) {
                               var thisProcess = results[ii]
                               var startTime = thisProcess.running_start_time_ms
                               var duration = timeNow - startTime
                               setProcessRunningDurationMs.run(duration, thisProcess.process, yazzInstanceId)
                           }
                           dbsearch.run("commit", function() {
                           });
                        }

                    })
        })
}


//setInterval(updateRunningTimeForprocess,1000)





function findLongRunningProcesses() {
        console.log("Checking processes")

        dbsearch.serialize(
            function() {
                var stmt = dbsearch.all(
                  "SELECT * FROM system_process_info where  status = 'RUNNING' and event_duration_ms > ?  and  yazz_instance_id = ?; "
                  ,
                  [  maxJobProcessDurationMs  ,  yazzInstanceId  ]
                  ,
                    function(err, results)
                    {
                        if (results) {
                           dbsearch.run("begin exclusive transaction");
                           for (var ii = 0 ; ii < results.length ; ii++ ) {
                               var thisProcess = results[ii]
                               console.log(thisProcess)
                               //killProcess(thisProcess.process, thisProcess.callback_index)
                           }
                           dbsearch.run("commit", function() {
                           });
                        }

                    })
        })
}

//setInterval(findLongRunningProcesses,1000)

function killProcess(processName, callbackIndex) {
    dbsearch.serialize(
        function() {
            dbsearch.run("begin exclusive transaction");
            setProcessToIdle.run(processName, yazzInstanceId)

            dbsearch.run("commit", function() {
                processesInUse[processName] = false
                return_response_to_function_caller({     message_type:       "return_response_to_function_caller" ,
                                   child_process_name:  processName,
                                   callback_index:      callbackIndex,
                                   result:              {error: {
                                                            text: "Request timeout",
                                                            code: 408
                                   }}
                               });
            });
        })
}



//-----------------------------------------------------------------------------------------//
//                                                                                         //
//                            scheduleJobWithCodeId                                        //
//                                                                                         //
//                                                                                         //
//                                                                                         //
//-----------------------------------------------------------------------------------------//
function scheduleJobWithCodeId(codeId, args,  parentCallId, callbackIndex) {

    var processToUse = null
    var processNames = Object.keys(processesInUse)

    for ( var processNameIndex = 0 ; processNameIndex < processNames.length; processNameIndex ++ ) {

        var actualProcessName   = processNames[ processNameIndex ]
        var isInUse             = processesInUse[ actualProcessName ]

        //console.log(" select * from system_process_info    ")
        //console.log("    " + JSON.stringify(results,null,2))

        if ( !isInUse ) {
            processToUse = actualProcessName
            processesInUse[actualProcessName] = true
            //outputDebug(" Sending job to process:    " + JSON.stringify(processToUse,null,2))
            sendJobToProcessName(codeId, args, actualProcessName, parentCallId, callbackIndex)
            return
        }
    }
    if (!processToUse) {
        console.log("Could not find a process to use for " + codeId)
        if (tryAgain) {


            var processName
            if (parentCallId == -1) {
                processName = "forked"
            } else {
                var parentCallDetails = callList[parentCallId]
                //console.log("*) parent call details: " + JSON.stringify(parentCallDetails,null,2))
                //console.log("*) Response: " + JSON.stringify(msg.result,null,2))
                processName = parentCallDetails.process_name
            }

            //console.log("msg.callback_index returned: " + msg.callback_index)
            if (processesRetryingCount < maxProcessesCountToRetry) {
                console.log("Retry in 2 seconds ..." )
                processesRetryingCount ++
                console.log("processesRetryingCount: " + processesRetryingCount)
                setTimeout(function() {
                    processesRetryingCount --
                    console.log("processesRetryingCount: " + processesRetryingCount)
                    scheduleJobWithCodeId(codeId, args,  parentCallId, callbackIndex)
                },2000)
            } else {
                return_response_to_function_caller({     message_type:       "return_response_to_function_caller" ,
                                   child_process_name:  processName,
                                   callback_index:      callbackIndex,
                                   result:              {error: {
                                                            text: "Yazz Server too busy",
                                                            code: 503
                                   }}
                               });
            }


        }
    }
}






//-----------------------------------------------------------------------------------------//
//                                                                                         //
//                                   sendToProcess                                         //
//                                                                                         //
//                                                                                         //
//                                                                                         //
//-----------------------------------------------------------------------------------------//
function sendToProcess(  id  ,  parentCallId  ,  callbackIndex, processName  ,  base_component_id ,  on_condition  ,  args) {

    var newCallId = nextCallId ++

    callList[  newCallId  ] = {     process_name:       processName,
                                    parent_call_id:     parentCallId        }
    dbsearch.serialize(
        function() {
            dbsearch.run("begin exclusive transaction");
            let runningStartTime = new Date().getTime();
            setProcessToRunning.run( base_component_id, on_condition, runningStartTime, id, callbackIndex, processName, yazzInstanceId )


            dbsearch.run("commit", function() {
                execute_code_in_exe_child_process({  message_type:       "execute_code_in_exe_child_process" ,
                                child_process_name:  processName,
                                code_id:             id,
                                args:                args,
                                call_id:             newCallId,
                                callback_index:      callbackIndex,
                                on_condition:        on_condition,
                                base_component_id:   base_component_id
                                });
            });
        })
}






//------------------------------------------------------------------------------
//
//
//
//
//
//------------------------------------------------------------------------------
function execute_code_in_exe_child_process (msg) {

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
}





//-----------------------------------------------------------------------------------------//
//                                                                                         //
//                                   sendJobToProcessName                                  //
//                                                                                         //
//                                                                                         //
//                                                                                         //
//-----------------------------------------------------------------------------------------//
function sendJobToProcessName(id, args, processName, parentCallId, callbackIndex) {

    dbsearch.serialize(
        function() {
            var stmt = dbsearch.all(
                "SELECT base_component_id, on_condition FROM system_code where id = ? LIMIT 1",
                id,

                function(err, results)
                {
                    if (results) {
                        if (results.length > 0) {


                            sendToProcess(  id,
                                            parentCallId,
                                            callbackIndex,
                                            processName,
                                            results[0].base_component_id,
                                            results[0].on_condition,
                                            args)



                        }
                    }
                })
    }, sqlite3.OPEN_READONLY)

}













//-----------------------------------------------------------------------------------------
//
//                                  startNode
//
// This is called when a node has been started. Noter that this does not start the
// NodeJS process, it just updates the Sqlite database to say that the process is
// ready to accept requests
//
//-----------------------------------------------------------------------------------------
function startNode (msg) {


     //console.log(" --- Started Node --- ")
     //console.log("     Node ID: " + msg.node_id)
     //console.log("     Process ID: " + msg.child_process_id)
     //console.log("     Started: " + msg.started)
     dbsearch.serialize(
         function() {
             var stmt = dbsearch.all(
               "SELECT * FROM system_process_info where  yazz_instance_id = ?  AND  process = ?; "
               ,
               [  yazzInstanceId  ,  msg.node_id  ]
               ,

                 function(err, results)
                 {
                     if (results.length == 0)  {
                         dbsearch.serialize(
                             function() {
                                 dbsearch.run("begin exclusive transaction");
                                 insertIntoProcessTable.run(
                                     yazzInstanceId,
                                     msg.node_id,
                                     msg.child_process_id,
                                     msg.started,
                                     "IDLE",
                                     null
                                     )
                                 dbsearch.run("commit", function() {
                                        processesInUse[msg.node_id] = false
                                 });
                         })

                     } else {
                         dbsearch.serialize(
                             function() {
                                 dbsearch.run("begin exclusive transaction");
                                 updateProcessTable.run(
                                     msg.child_process_id,
                                     msg.started,
                                     "IDLE",
                                     null,
                                     yazzInstanceId,
                                     msg.node_id
                                 )
                                 dbsearch.run("commit", function() {
                                        processesInUse[msg.node_id] = false
                                 });
                         })
                     }
                 })
             })

}










//-----------------------------------------------------------------------------------------
//
//                                   function_call_request
//
// This is called to call code.
//
//-----------------------------------------------------------------------------------------
function function_call_requestPart2 (msg) {

    if (msg.find_component.driver_name && msg.find_component.method_name) {
        dbsearch.serialize(
            function() {
                var stmt = dbsearch.all(
                  "SELECT * FROM system_code where base_component_id = ? " +
                    " and code_tag = 'LATEST'; ",

                   msg.find_component.driver_name,

                    function(err, results)
                    {
                        if (results && (results.length > 0)) {
                           scheduleJobWithCodeId(  results[0].id,
                                                   msg.args,
                                                   msg.caller_call_id,
                                                   msg.callback_index)
                            //callbackFn(results[0].id);
                        } else {
                            //callbackFn(null)
                        }

                    })
        }, sqlite3.OPEN_READONLY)



    } else if (msg.find_component.code_id) {
       scheduleJobWithCodeId(  msg.find_component.code_id,
                               msg.args,
                               msg.caller_call_id,
                               msg.callback_index)



    } else if (msg.find_component.base_component_id) {
        //console.log("In msg.find_component.base_component_id")
        dbsearch.serialize(
            function() {
                var stmt = dbsearch.all(
                  "SELECT id FROM system_code where base_component_id = ? and code_tag = 'LATEST'; ",

                   msg.find_component.base_component_id,

                    function(err, results)
                    {
                        if (results && (results.length > 0)) {
                            //console.log("    msg.find_component.base_component_id: " + msg.find_component.base_component_id  + " = " + results[0].id)
                           scheduleJobWithCodeId(  results[0].id,
                                                   msg.args,
                                                   msg.caller_call_id,
                                                   msg.callback_index)
                            //callbackFn(results[0].id);
                        } else {
                            console.log("    msg.find_component.base_component_id: Could not find " +   msg.find_component.base_component_id)
                        }

                    })
        }, sqlite3.OPEN_READONLY)
    }
}






//-----------------------------------------------------------------------------------------
//
//                                   processor_free
//
// This is called whenever one of the code processors is free. They should only be allowed
// to process one thing at a time
//
//-----------------------------------------------------------------------------------------
function processor_free (msg) {


    dbsearch.serialize(
        function() {
            dbsearch.run("begin exclusive transaction");
            setProcessToIdle.run(msg.child_process_name, yazzInstanceId)

            dbsearch.run("commit", function() {
                processesInUse[msg.child_process_name] = false
            });
        })
}










//-----------------------------------------------------------------------------------------
//
//                                   function_call_response
//
// This is called to return the response of a call
//
//-----------------------------------------------------------------------------------------
function function_call_response (msg) {

   //console.log("*) Response received at Scheduler ")
   //console.log("*) result generated by call ID: " + msg.called_call_id)
   var callDetails = callList[msg.called_call_id]
   //console.log("*) call details: " + JSON.stringify(msg,null,2))

   if (callDetails == null) {
      console.log("In Scheduler:function_call_response   callList    is not set for : " + JSON.stringify(msg,null,2))
      return
   }
   var parentCallId = callDetails.parent_call_id
   //console.log("*) parent call ID: " + JSON.stringify(parentCallId,null,2))

   var processName
   if (parentCallId == -1) {
       processName = "forked"
   } else {
       var parentCallDetails = callList[parentCallId]
       //console.log("*) parent call details: " + JSON.stringify(parentCallDetails,null,2))
       //console.log("*) Response: " + JSON.stringify(msg.result,null,2))
       processName = parentCallDetails.process_name
   }

   //console.log("msg.callback_index returned: " + msg.callback_index)
   return_response_to_function_caller({     message_type:       "return_response_to_function_caller" ,
                                            child_process_name:  processName,
                                            callback_index:      msg.callback_index,
                                            result:              msg.result
                                        });
                      }
