#!/usr/bin/env node

const ipfsAPI = require('ipfs-api');
const OnlyIpfsHash = require('ipfs-only-hash')
const useragent = require('express-useragent');
let cookieParser = require('cookie-parser')
let Web3 = require('web3')
let web3 = new Web3()
let isIPFSConnected = false
const ipfs = ipfsAPI('ipfs.infura.io', '5001', {protocol: 'https'})
let testBuffer = new Buffer("");
console.log("Starting...")
console.log("Testing IPFS...")
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
let showProgress                        = false
let showDebug                           = false
let childProcessNameInScheduler
let processesInUse                      = new Object()
let tryAgain                            = true
let nextCallId                          = 0
let callList                            = new Object
let processesRetryingCount              = 0
let localappdata
let visifile                            = null
const path                              = require("path");
const url                               = require('url');
let fork                                = require2('child_process');
let fs                                  = require2('fs');
let ip                                  = require2('ip');
let isWin                               = /^win/.test(process.platform);
let isLinux                             = /^linux/.test(process.platform);
let isMac                               = /^darwin/.test(process.platform);
let mainNodeProcessStarted              = false;
let restRoutes                          = new Object()
let envVars                             = new Object()
let systemReady                         = false;
let httpServer                          = null;
let merkleJsonLib                       = require("merkle-json")
let merkleJson                          = new merkleJsonLib.MerkleJson();
let username                            = "Unknown user";
let isDocker                            = require2('is-docker');
let ls                                  = require2('ls-sync');
let rimraf                              = require2("rimraf");
let forge                               = require2('node-forge');
let db_helper                           = require("./db_helper")

let pidusage                            = require2("pidusage");
let mkdirp                              = require2('mkdirp')
let rmdir                               = require2('rmdir-sync');
let uuidv1                              = require2('uuid/v1');
let express                             = require2('express')
let http                                = require2('http')
let https                               = require2('https');
let app                                 = express()
let startupType                         = null
let startupDelay                        = 0
let isCodeTtyCode                       = false
let yazzInstanceId                      = uuidv1()
let certOptions                         = null
let crypto                              = require('crypto');
let callbackIndex                       = 0;
let callbackList                        = new Object()
let stmtInsertIpfsHash;
let stmtInsertSession;
let stmtInsertSessionWithNewUserId;
let stmtInsertMetaMaskLogin;
let stmtSetMetaMaskLoginSuccedded;
let stmtInsertUser;
let stmtInsertReleasedComponentListItem;
let stmtUpdateReleasedComponentList;
let stmtInsertIconImageData;
let setProcessToRunning;
let setProcessToIdle;
let setProcessRunningDurationMs;
let insertIntoProcessTable              = null;
let updateProcessTable                  = null;
let expressWs                           = require2('express-ws')(app);
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
let LOCAL_HOME                          = process.env.HOME
outputDebug('LOCAL_HOME:' + LOCAL_HOME);
function outputToBrowser(txt) {
    //let line = txt.toString().replace(/\'|\"|\n|\r"/g , "").toString()
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
let request                             = require2("request");
let perf                                = require('./perf')
let compression                         = require2('compression')
let program                             = require2('commander');
let bodyParser                          = require2('body-parser');
let multer                              = require2('multer');
let cors                                = require2('cors')
let yz                                  = require('./yazz_helper_module')
let sqlNodePath                         = path.join(nodeModulesPath,'node_modules/sqlite3')
//console.log("sqlNodePath: " + sqlNodePath)
let sqlite3                             = null
sqlite3                                 = require(sqlNodePath);
let os                                  = require2('os')
let Keycloak                            = require2('keycloak-connect');
let session                             = require2('express-session');
let memoryStore                         = new session.MemoryStore();
let kk                                  = {
  "realm":              "yazz",
  "auth-server-url":    "http://127.0.0.1:8080/auth",
  "ssl-required":       "external",
  "resource":           "yazz",
  "public-client":       true,
  "confidential-port":   0
}
let sessObj                             = session({
                      secret:               'some secret',
                      resave:                false,
                      saveUninitialized:     true,
                      store:                 memoryStore
                    })
let keycloak                            = new Keycloak({
                        store: memoryStore
                    },kk);
let upload
let dbPath                              = null
let dbsearch                            = null
let userData                            = null
let appDbs                              = {}
let port;
function setPort(addrv) {
    port = addrv
    yz.port = addrv
}
let hostaddress;
function setHostAddress(addrv) {
    hostaddress = addrv
    yz.hostaddress = addrv
}
if (isWin) {
    setHostAddress("127.0.0.1")//ip.address();
} else {
    setHostAddress("0.0.0.0")//ip.address();
}
let hostaddressintranet;
hostaddressintranet = ip.address();
setPort(80)
let socket                              = null
let io                                  = null;
let forkedProcesses                     = new Object();
let timeout                             = 0;
let serverwebsockets                    = [];
let portrange                           = 3000
let locked;
let useHttps;
let hideimportbuttons;
let serverProtocol                      = "http";
let privateKey;
let publicCertificate;
let caCertificate1;
let caCertificate2;
let caCertificate3;
let hostcount  							= 0;
let queuedResponses                     = new Object();
let queuedResponseSeqNum                = 1;
let executionProcessCount               = 6;
app.use(compression())
app.use(sessObj);
app.use(express.json({ limit: '200mb' }));
app.use(cookieParser());
app.use(keycloak.middleware({
          logout: '/c',
          admin: '/ad'
}));
let inmemcalc                           = false
let totalMem                            = 0
let returnedmemCount                    = 0
let allForked                           = []
const apiMetrics                        = require2('prometheus-api-metrics');
app.use(apiMetrics())
const Prometheus                        = require2('prom-client');
const yazzMemoryUsageMetric             = new Prometheus.Gauge({
  name: 'yazz_total_memory_bytes',
  help: 'Total Memory Usage'
});
const yazzProcessMainMemoryUsageMetric  = new Prometheus.Gauge({
  name: 'yazz_node_process_main_memory_bytes',
  help: 'Memory Usage for Yazz NodeJS process "main"'
});
let stdin                               = process.openStdin();
let inputStdin                          = "";
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
      .option('-hib, --hideimportbuttons [hideimportbuttons]', 'Allow to hide the buttons to load files (default true) [hideimportbuttons]', 'true')
      .option('-e, --debug [debug]', 'Allow to run NodeJS in debug mode (default false) [debug]', 'false')
      .option('-f, --cacert1 [cacert1]', 'Public HTTPS CA certificate 1 [cacert1]', null)
      .option('-ipfs_folder, --ipfs_folder [ipfs_folder]', 'Public folder to use as IPFS Cache [ipfs_folder]', null)
      .option('-g, --cacert2 [cacert2]', 'Public HTTPS CA certificate 2 [cacert2]', null)
      .option('-h, --loadjsfile [loadjsfile]', 'Load the following JS from a file (default not set) [loadjsfile]', null)
      .option('-i, --cacert3 [cacert3]', 'Public HTTPS CA certificate 3 [cacert3]', null)
      .option('-j, --host [host]', 'Server address of the host (default ) [host]', '')
      .option('-ch, --centralhost [centralhost]', 'Server address of the central host (default  empty) [centralhost]', '')
      .option('-och, --ocentralhost [ocentralhost]', 'Dummy - do not use - Server address of the central host (default  empty) [ocentralhost]', '')
      .option('-k, --statsinterval [statsinterval]', 'Allow to show debug info every x seconds (default 10 seconds) [statsinterval]', 10)
      .option('-l, --showstats [showstats]', 'Allow to show stats debug info (default false) [showstats]', 'false')
      .option('-m, --showprogress [showprogress]', 'Show progress when starting Yazz (default false) [showprogress]', 'false')
      .option('-mjms, --maxJobProcessDurationMs [maxJobProcessDurationMs]', 'Maximum time to wait for a job to complete (default 10000 ms) [maxJobProcessDurationMs]', 10000)
      .option('-n, --locked [locked]', 'Allow server to be locked/unlocked on start up (default true) [locked]', 'true')
      .option('-o, --maxprocessesretry [maxprocessesretry]', 'Number of processes to retry when all cores are busy (default 10 processes) [maxprocessesretry]', 10)
      .option('-ph, --public [public]', 'Public HTTPS certificate [public]', null)
      .option('-q, --port [port]', 'Which port should I listen on? (default 80) [port]', parseInt)
      .option('-r, --https [https]', 'Run using a HTTPS (default is none) [https]', 'none')
      .option('-s,  --hostport [hostport]', 'Server port of the host (default -1) [hostport]', -1)
      .option('-cp, --centralhostport [centralhostport]', 'Server port of the central host (default -1) [centralhostport]', -1)
      .option('-cs, --centralhosthttps [centralhosthttps]', 'Central host uses HTTPS? (default none) [centralhosthttps]', 'none')
      .option('-ocp, --ocentralhostport [ocentralhostport]', 'Dummy - do not use - Server port of the central host (default -1) [ocentralhostport]', -1)
      .option('-ocs, --ocentralhosthttps [ocentralhosthttps]', 'Dummy - do not use - Central host uses HTTPS? (default none) [ocentralhosthttps]', 'none')
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
    program.host = ''
    program.hostport = -1
    program.centralhost = -1
    program.centralhostport = ''
    program.locked = 'true'
    program.debug = 'false'
    program.deleteonexit = 'true'
    program.deleteonstartup = 'false'
    program.runapp = null
    program.loadjsurl = null
    program.loadjsfile = null
    program.runhtml = null
    program.https = 'none'
    program.centralhosthttps = 'none'
    program.usehost = null
    program.hideimportbuttons = true
}
let semver                              = require2('semver')
const initJaegerTracer                  = require2("jaeger-client").initTracer;
const {Tags, FORMAT_HTTP_HEADERS}       = require2('opentracing')
if (program.showprogress == 'true') {
    showProgress = true;
}
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
let ipfsFolder                          = "ipfs_cache"
if (program.ipfs_folder) {
    ipfsFolder = program.ipfs_folder
}
let fullIpfsFolderPath
let showStats                           = false
if (program.showstats == 'true') {
    showStats = true;
}
outputDebug("       showStats: " + showStats );
let useSelfSignedHttps                  = false
if (program.useselfsignedhttps == 'true') {
    useSelfSignedHttps = true;
}
outputDebug("       useSelfSignedHttps: " + useSelfSignedHttps );
let statsInterval                       = -1
if (program.statsinterval > 0) {
    statsInterval = program.statsinterval;
}
outputDebug("       statsInterval: " + statsInterval );
if (program.virtualprocessors > 0) {
    executionProcessCount = program.virtualprocessors;
}
outputDebug("       executionProcessCount: " + executionProcessCount );
let maxProcessesCountToRetry            = 10
if (program.maxprocessesretry > 0) {
    maxProcessesCountToRetry = program.maxprocessesretry;
}
outputDebug("       maxProcessesCountToRetry: " + maxProcessesCountToRetry );
let maxJobProcessDurationMs             = 10000
if (program.maxJobProcessDurationMs > 0) {
    maxJobProcessDurationMs = program.maxJobProcessDurationMs;
}
outputDebug("       maxJobProcessDurationMs: " + maxJobProcessDurationMs );
let listOfEnvs                          = process.env
let envNames                            = Object.keys(listOfEnvs)
for (let i=0 ;i< envNames.length; i++){
    let envName = envNames[i].replace(/[^a-zA-Z0-9]/g,'_');
    outputDebug("Env let  " + envName + ": " + listOfEnvs[envName])

    envVars[envName] = listOfEnvs[envName]
}
if (isValidObject(envVars.virtualprocessors)) {
    executionProcessCount = envVars.virtualprocessors
}
// --------------------------------
// sort out the host IP settings
// --------------------------------
envVars.IP_ADDRESS                      = ip.address()
if (program.host == "") {
    program.host = ip.address()
}
envVars.HOST = program.host
console.log("$HOST = " + envVars.HOST)
if (program.hostport == -1) {
    program.hostport = 80
}
envVars.HOSTPORT = program.hostport
console.log("$HOSTPORT = " + envVars.HOSTPORT)
if (program.https == "none") {
    program.https = "false"
}
useHttps = (program.https == 'true');
envVars.USEHTTPS = useHttps
console.log("$USEHTTPS = " + envVars.USEHTTPS)
// --------------------------------------
// sort out the central host IP settings
// --------------------------------------
if (program.centralhost == "") {
    program.centralhost = ip.address()
}
envVars.CENTRALHOST = program.centralhost
console.log("$CENTRALHOST = " + envVars.CENTRALHOST)
if (program.centralhostport == -1) {
    program.centralhostport = 80
}
envVars.CENTRALHOSTPORT = program.centralhostport
console.log("$CENTRALHOSTPORT = " + envVars.CENTRALHOSTPORT)
let centralHostHttps = true
if (program.centralhosthttps == 'none') {
    program.centralhosthttps = 'false'
}
if (program.centralhosthttps == 'false') {
    centralHostHttps = false;
}
outputDebug("       centralHostHttps: " + centralHostHttps );
envVars.CENTRALHOSTHTTPS = centralHostHttps
console.log("$CENTRALHOSTHTTPS = " + envVars.CENTRALHOSTHTTPS)
let jaegerConfig = null
let jaegercollector = program.jaegercollector;
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
let debug = false;
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
let deleteOnExit = (program.deleteonexit == 'true');
outputDebug("deleteOnExit: " + deleteOnExit)
let deleteOnStartup = (program.deleteonstartup == 'true');
outputDebug("deleteOnStartup: " + deleteOnStartup)
locked = (program.locked == 'true');
hideimportbuttons = (program.hideimportbuttons == 'true');
envVars.HIDEIMPORTBUTTONS = hideimportbuttons
if (useSelfSignedHttps) {
    forge.options.usePureJavaScript = true;

    let pki = forge.pki;
    let keys = pki.rsa.generateKeyPair(2048);
    let cert = pki.createCertificate();

    cert.publicKey = keys.publicKey;
    cert.serialNumber = '01';
    cert.validity.notBefore = new Date();
    cert.validity.notAfter = new Date();
    cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear()+1);

    let attrs = [
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

    let pem_pkey = pki.publicKeyToPem(keys.publicKey);
    let pem_cert = pki.certificateToPem(cert);

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
    envVars.USEHTTPS = useHttps
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
let useHost = program.usehost;
if (useHost) {
    setHostAddress(useHost)
    outputDebug("USE Host: " + useHost)
}
setPort(program.port);
outputDebug("port: " + port)
let runapp = program.runapp
let runhtml = program.runhtml;
let loadjsurl = program.loadjsurl;
let loadjsfile = program.loadjsfile;
let loadjscode = program.loadjscode;
if (!isNumber(port)) {
    setPort(80);
    if (useHttps) {
        setPort(443);
    }
};
outputDebug('Yazz node local hostname: ' + ip.address() + ' ')
function setUpChildListeners(processName, fileName, debugPort) {

    forkedProcesses[processName].on('close', async function() {
        if (!shuttingDown) {
            outputDebug("Child process " + processName + " exited.. restarting... ")



            let stmtInsertProcessError = dbsearch.prepare(  ` insert into
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
                let newId = uuidv1()
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
    // This is the last thing that happens when AppShare is started
    //
    //
    //
    //------------------------------------------------------------------------------
    if (msg.message_type == "drivers_loaded_by_child") {
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
            let rett = eval("(" + msg.success + ")");
            let newCallbackFn = queuedResponses[ msg.seq_num_local ]

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
                                                  base_component_id:           msg.base_component_id,
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
                let new_ws = queuedResponses[ msg.seq_num_parent ]

                if (msg.result) {
                    if (msg.result.code) {
                        let tr = msg.result.code
                        msg.result.code = tr
                    }
                }
                sendToBrowserViaWebSocket(
                                             new_ws
                                             ,
                                             {
                                                type:            "ws_to_browser_call_component_results",
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
    let debugArgs = [];
    if (debug) {
        if (semver.gte(process.versions.node, '6.9.0')) {
            //debugArgs = ['--inspect=' + debugPort];
            debugArgs = [];
        } else {
            //debugArgs = ['--debug=' + debugPort];
            debugArgs = [];
        };
    };
    let forkedProcessPath

    if (isWin) {
        forkedProcessPath = path.join(__dirname, '..\\src\\' + fileName)
    } else {
        forkedProcessPath = path.join(__dirname, '../src/' + fileName)
    }
    console.log("forkedProcessPath: " + forkedProcessPath)
    forkedProcesses[  processName  ] = fork.fork(forkedProcessPath, [], {execArgv: debugArgs,
    env: {}});




    setUpChildListeners(processName, fileName, debugPort);




    for (let i=0;i<executionProcessCount; i++ ) {
        let exeProcName = "forkedExeProcess" + i
        if (processName == exeProcName) {

            forkedProcesses[exeProcName].send({  message_type: "init" ,
                                                 user_data_path: userData,
                                                 child_process_name: exeProcName,
                                                 show_debug: showDebug,
                                                 show_progress: showProgress,
                                                 yazz_instance_id: yazzInstanceId,
                                                 jaeger_collector: jaegercollector,
                                                 env_vars: envVars
                                              });

      }

    }



    outputDebug("Started subprocess '" + processName + "' ")

}
function sendOverWebSockets(data) {
    let ll = serverwebsockets.length;
    //console.log('send to sockets Count: ' + JSON.stringify(serverwebsockets.length));
    for (let i =0 ; i < ll; i++ ) {
        try {
            let sock = serverwebsockets[i];
            if (sock) {
                sock.emit(data.type,data);
                //console.log('                    sock ' + i + ': ' + JSON.stringify(sock.readyState));
            }

        } catch (webSocketError) {
            console.log(webSocketError)
            serverwebsockets[i] = null
        }
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


        for (let i = 0; i < executionProcessCount; i++ ) {
            let exeProcName = "forkedExeProcess" + i
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
    let ff = 'timeout 8 && rd /s /q "' + dddd + '"'
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
            setPort(portrange)
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
            let jsUrl = loadjsurl
            https.get(jsUrl, (resp) => {
              let data = '';

              // A chunk of data has been recieved.
              resp.on('data', (chunk) => {
                data += chunk;
              });

              // The whole response has been received. Print out the result.
              resp.on('end', () => {
                //console.log("code:" + data);
                let baseComponentIdForUrl = yz.getValueOfCodeString(data, "base_component_id")
                outputDebug("baseComponentIdForUrl:" + baseComponentIdForUrl);
                if (!isValidObject(baseComponentIdForUrl)) {
                    baseComponentIdForUrl = loadjsurl.replace(/[^A-Z0-9]/ig, "_");
                }
                let jsCode = data
                outputDebug("*********** Trying to load loadjsurl code *************")
                 (async function() {await yz.saveCodeV3(
                                                     dbsearch,
                                                    data,
                                                    {
                                                        make_public: true,
                                                        save_html:   true
                                                    })} ) ()

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

            let jsFile = loadjsfile

            let data2 = fs.readFileSync(jsFile).toString()
            let baseComponentIdForFile = yz.getValueOfCodeString(data2, "base_component_id")
            if (!isValidObject(baseComponentIdForFile)) {
                baseComponentIdForFile = loadjsfile.replace(/[^A-Z0-9]/ig, "_");
            }

            //console.log("code from file:" + data2);
            //console.log("*********** Trying to load loadjsfile code *************")
            (async function() {let saveResult =await yz.saveCodeV3(
                                                                dbsearch,
                                                                  data2,
                                                                  {
                                                                      make_public: true,
                                                                      save_html:   true
                                                                   })
                                                                                })()
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
             let data2 = loadjscode
             let baseComponentIdForCode = yz.getValueOfCodeString(data2, "base_component_id")
             outputDebug("baseComponentIdForCode:" + baseComponentIdForCode);
             if (!isValidObject(baseComponentIdForCode)) {
                 baseComponentIdForCode = "code_" + (("" + Math.random()).replace(/[^A-Z0-9]/ig, "_"));
                 outputDebug("baseComponentIdForFile:" + baseComponentIdForCode);
             }

             //console.log("code:" + data2);
             outputDebug("*********** Trying to load loadjscode code *************")


              let saveResult =await yz.saveCodeV3(
                                                  dbsearch,
                                                 data2,
                                                 {
                                                     make_public: true,
                                                     save_html:   true
                                                  })


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
     let ret = await promise


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
            let jsUrl = loadjsurl
            https.get(jsUrl, (resp) => {
              let data = '';

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
            let jsFile = loadjsfile

            let data2 = fs.readFileSync(jsFile).toString()
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
    let c = console;
    c.log(text);
}
function copyFileSync( source, target ) {

    let targetFile = target;

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
    let files = [];

    //check if folder needs to be created or integrated
    let targetFolder = path.join( target, path.basename( source ) );
    if ( !fs.existsSync( targetFolder ) ) {
        fs.mkdirSync( targetFolder );
    }

    //copy
    if ( fs.lstatSync( source ).isDirectory() ) {
        try {
            files = fs.readdirSync( source );
            files.forEach( function ( file ) {
                let curSource = path.join( source, file );
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
    let hostname;
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
    let domain = extractHostname(url),
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

    let ll = inp.split(' ');
    for (let i=0; i< ll.length ; i++){
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
function isRequestFromMobile(req) {
    let uasource = req.headers['user-agent']
    let uaval = useragent.parse(uasource);

    // a Boolean that tells you if the request
    // is from a mobile device
    let isMobile = uaval.isMobile
    if (!isMobile) {
    }
    //console.log("uaval: "  + JSON.stringify(uaval,null,2))
    return isMobile
}
function getRoot(req, res, next) {
	hostcount++;

    //console.log("Host: " + req.headers.host + ", " + hostcount);
	//console.log("Full URL: " + req.protocol + '://' + req.get('host') + req.originalUrl);
	let isMobile = isRequestFromMobile(req)

    let homepage = path.join(__dirname, '../public/go.html')
    //let homepageUrl = serverProtocol + '://yazz.com/visifile/index.html?time=' + new Date().getTime()
    //let homepageUrl = serverProtocol + '://www.yazz.com'
    let homepageUrl = 'https://yazz.com/app/homepage.html'
    if (isMobile) {
        homepageUrl = 'https://yazz.com/app/mobilehomepage.html'
    }
    //console.log("req.headers.host: " + req.headers.host)
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
        if (req.headers.host.toLowerCase().endsWith('www.yazz.com')) {
		res.writeHead(301,
			{Location: homepageUrl }
			);
			res.end();
			return;
		};
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

        if (isMobile) {
            homepage = path.join( userData, 'apps/mobilehomepage.html' )
        } else {
            homepage = path.join( userData, 'apps/homepage.html' )
        }
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
    let parts = req.path.split('/');
    let lastSegment = parts.pop() || parts.pop();

    outputDebug("URL PATH: " + lastSegment);
	//console.log("Full URL: " + req.protocol + '://' + req.get('host') + req.originalUrl);



    //
    // send the edit page
    //
    let homepage = path.join(__dirname, '../public/go.html')
    let baseComponentId = lastSegment
    let newStaticFileContent = fs.readFileSync(homepage)
    newStaticFileContent = newStaticFileContent.toString().replace("let editAppShareApp = null", "let editAppShareApp = '" + baseComponentId + "'")



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
        let receivedMessage = eval("(" + msg + ")");

        let userId = await getUserIdFromYazzCookie(receivedMessage.cookie)

        //console.log(" 1- Server recieved message: " + JSON.stringify(receivedMessage));

        // if we get the message "server_get_all_queries" from the web browser
        if (receivedMessage.message_type == "server_get_all_queries") {

            let seqNum = queuedResponseSeqNum;
            queuedResponseSeqNum ++;
            queuedResponses[seqNum] = ws;










        //                                  ______
        // Browser  --Send me your data-->  Server
        //                                  ______
        //
        } else if (receivedMessage.message_type == "edit_static_app") {
            outputDebug("*** server got message from static app: edit_static_app")
            let sql_data = receivedMessage.sql_data
            let code_fn = receivedMessage.code_fn


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

            let seqNum = queuedResponseSeqNum;
            queuedResponseSeqNum ++;
            queuedResponses[seqNum] = ws;








    } else if (receivedMessage.message_type == "browser_asks_server_for_data") {

        let seqNum = queuedResponseSeqNum;
        queuedResponseSeqNum ++;
        queuedResponses[seqNum] = ws;























        // --------------------------------------------------------------------
        //
        //                         browser_calls_component_via_web_socket
        //
        // "browser_calls_component_via_web_socket" is used to call server side apps/code.
        //
        //
        //
        // --------------------------------------------------------------------
        } else if (receivedMessage.message_type == "browser_calls_component_via_web_socket") {

            // Use an integer counter to identify whoever was
            // calling the server function (in this case a web browser with
            // a web socket). We need to do this as there may be several
            // web browsers connected to this one server
            let seqNum = queuedResponseSeqNum;
            queuedResponseSeqNum ++;
            queuedResponses[ seqNum ] = ws;


            if (receivedMessage.find_component && receivedMessage.find_component.base_component_id == "systemFunctionAppSql") {

                let resultOfSql = await executeSqliteForApp(  receivedMessage.args  )
                sendToBrowserViaWebSocket(
                                             ws
                                             ,
                                             {
                                                type:            "ws_to_browser_call_component_results",
                                                value:            resultOfSql,
                                                seq_num:          receivedMessage.seqNum
                                             });



            } else {
                receivedMessage.args.user_id = userId
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
      let client_file_upload_id = req.body.client_file_upload_id
      //console.log("**client_file_upload_id** " + JSON.stringify(client_file_upload_id));
      //console.log(    "    next: " + JSON.stringify(next));

      res.status( 200 ).send( req.file );

      //console.log('Loading saved Creator app' );
      let ifile = req.file
      //console.log("        " + JSON.stringify(ifile));
      let ext = ifile.originalname.split('.').pop();
      ext = ext.toLowerCase();
      //console.log('Ext: ' + ext);
      if ((ext == "html") || (ext == "html")) {
      let localp2;
      localp2 =  path.join(userData,  'uploads/' + ifile.filename);
          let localp = localp2 + '.' + ext;
          fs.renameSync(localp2, localp);
          let readIn = fs.readFileSync(localp).toString()
          //console.log('');
          //console.log('Local saved path: ' + localp);
          let indexStart = readIn.indexOf("/*APP_START*/")
          let indexEnd = readIn.indexOf("/*APP_END*/")
          //console.log(`indexStart: ${indexStart}`)
          //console.log(`indexEnd: ${indexEnd}`)
          if ((indexStart > 0) && (indexEnd > 0)) {
            indexStart += 13 + 10
            indexEnd -= 2
            let tts = readIn.substring(indexStart,indexEnd)
            //console.log(tts)
            let ytr = unescape(tts)
            outputDebug("SENDING FROM UPLOAD___=+++****")
            let bci = yz.getValueOfCodeString(ytr, "base_component_id")

            let indexStart = readIn.indexOf("/*APP_START*/")
            let indexEnd = readIn.indexOf("/*APP_END*/")

            let indexOfSqliteData = readIn.indexOf("let sqlitedata = '")
            let indexOfSqliteDataEnd = readIn.indexOf("'//sqlitedata")

            let sqlitedatafromupload = null
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
              let localp2;
              localp2 =  path.join(userData,  'uploads/' + ifile.filename);
              let localp = localp2 + '.' + ext;
              fs.renameSync(localp2, localp);
              let readIn = fs.readFileSync(localp).toString()
              let bci = yz.getValueOfCodeString(readIn, "base_component_id")



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
      let client_file_upload_id = req.body.client_file_upload_id
      //console.log("**FILES** " + JSON.stringify(req.files));
      //console.log(    "    next: " + JSON.stringify(next));


      //console.log('......................................................................................');
      //console.log('......................................................................................');
      //console.log('......................................................................................');
      //console.log('......................................................................................');
      //console.log('......................................................................................');
      res.status( 200 ).send( req.files );

      let ll = req.files.length;
      for (let i = 0; i < ll ; i ++) {
          //console.log('Loading saved Creator app' );
          let ifile = req.files[i];
          //console.log("        " + JSON.stringify(ifile));
          let ext = ifile.originalname.split('.').pop();
          ext = ext.toLowerCase();
          //console.log('Ext: ' + ext);
          if ((ext == "html") || (ext == "html")) {
          let localp2;
          localp2 =  path.join(userData,  'uploads/' + ifile.filename);
              let localp = localp2 + '.' + ext;
              fs.renameSync(localp2, localp);
              let readIn = fs.readFileSync(localp).toString()
              //console.log('');
              //console.log('Local saved path: ' + localp);
              let indexStart = readIn.indexOf("/*APP_START*/")
              let indexEnd = readIn.indexOf("/*APP_END*/")
              //console.log(`indexStart: ${indexStart}`)
              //console.log(`indexEnd: ${indexEnd}`)
              if ((indexStart > 0) && (indexEnd > 0)) {
                indexStart += 13 + 10
                indexEnd -= 2
                let tts = readIn.substring(indexStart,indexEnd)
                //console.log(tts)
                let ytr = unescape(tts)
                outputDebug("SENDINF FROM UPLAOD___=+++****")
                let bci = yz.getValueOfCodeString(ytr, "base_component_id")

                let indexStart = readIn.indexOf("/*APP_START*/")
                let indexEnd = readIn.indexOf("/*APP_END*/")

                let indexOfSqliteData = readIn.indexOf("let sqlitedata = '")
                let indexOfSqliteDataEnd = readIn.indexOf("'//sqlitedata")

                let sqlitedatafromupload = null
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
                  let localp2;
                  localp2 =  path.join(userData,  'uploads/' + ifile.filename);
                  let localp = localp2 + '.' + ext;
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
    let readIn = fs.readFileSync(localp).toString()
    let bci = yz.getValueOfCodeString(readIn, "base_component_id")



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
        let appName2=null
        if (params.compIdFromReqFn) {
            appName2 = params.compIdFromReqFn(req)
        }
        dbsearch.serialize(
            function() {
                let stmt = dbsearch.all(
                    "SELECT  code  FROM  yz_cache_released_components  WHERE  base_component_id = ? ; ",
                    appName2,

                    function(err, results)
                    {
                        if (results.length == 0) {
                            outputDebug("Could not find component : " + appName2)
                        } else {
                            outputDebug("Found code for : " + appName2)
                            let fileC = results[0].code.toString()
                            //console.log("Code : " + fileC)

                            let sscode = yz.getValueOfCodeString(fileC,"keycloak",")//keycloak")
                            //console.log("sscode:" + sscode)


                            if (sscode) {
                                //let ssval = eval( "(" + sscode + ")")
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

async function createNewTip(savedCode, codeId, userId) {
    /*
    Create a new code tip for the current code. This code tip
    moves the TIP tag forward for the code. But the code can have
    multiple tips, so this wouldn't make sense. The tip only makes
    sense for the current user editing the code
     */
    let parentCodeTag
    let baseComponentId
    let parentHash

    baseComponentId = yz.getValueOfCodeString(savedCode,"base_component_id")
    parentHash      = yz.getValueOfCodeString(savedCode,"parent_hash")

    parentCodeTag = await yz.getQuickSqlOneRow(
        dbsearch,
        "select id from  code_tags  where fk_system_code_id = ? and code_tag = 'TIP' and fk_user_id = ? ",
        [parentHash, userId])

    if (parentCodeTag) {
        await yz.executeQuickSql(
            dbsearch,
            "delete from code_tags  where fk_system_code_id = ? and code_tag = 'TIP'  ",
            [parentHash])
    }

    await yz.executeQuickSql(
        dbsearch
        ,
        `insert into 
                    code_tags 
                    (id,  base_component_id, code_tag, fk_system_code_id, fk_user_id ) 
                 values  
                     (?,?,?,?,?)
                     `,
        [uuidv1(), baseComponentId, "TIP", codeId, userId])
}

async function startServices() {
//------------------------------------------------------------
// This starts all the system services
//------------------------------------------------------------
    if (!isCodeTtyCode) {
        if (useHttps) {

            let app2             = express()

            let newhttp = http.createServer(app2);
            app2.use(compression())
            app2.get('/', function (req, res, next) {
                return getRoot(req, res, next);
            })


            app2.get('*', function(req, res) {
                 if (req.headers.host.toLowerCase().endsWith('canlabs.com')) {
                    outputDebug("path: " + req.path)

                    let rty = req.path
                    if (req.path == "/canlabs") {
                        rty = "/canlabs/index.html"
                    }

                    let fileNameRead = path.join(__dirname, '../public' + rty)
                    res.end(fs.readFileSync(fileNameRead));


                 } else if (  req.path.indexOf(".well-known") != -1  ) {
                    let fileNameRead = path.join(__dirname, '../public' + req.path)
                    res.end(fs.readFileSync(fileNameRead));


                 } else {
                     //outputDebug("Redirect HTTP to HTTPS")
                     res.redirect('https://' + req.headers.host + req.url);
                 }
            })

            newhttp.listen(80);
        }


        app.use(compression())
        app.use(cors({ origin: '*' }));
        app.use(async function (req, res, next) {

            let oneof = false;
            if(req.headers.origin) {
                res.header('Access-Control-Allow-Origin', req.headers.origin);
                oneof = true;
            }
            if(req.headers['access-control-request-method']) {
                res.header('Access-Control-Allow-Methods', req.headers['access-control-request-method']);
                oneof = true;
            }
            if(req.headers['access-control-request-headers']) {
                res.header('Access-Control-Allow-Headers', req.headers['access-control-request-headers']);
                oneof = true;
            }
            if(oneof) {
                res.header('Access-Control-Max-Age', 60 * 60 * 24 * 365);
            }


            // Set to true if you need the website to include cookies in the requests sent
            // to the API (e.g. in case you use sessions)
            res.setHeader('Access-Control-Allow-Credentials', true);


            let userAgentString = req.headers['user-agent']
            let hostCookieSentTo = req.host
            let cookie = req.cookies.yazz;


            let from_device_type = userAgentString
            if (typeof userAgentString  !== 'undefined') {
                if (typeof cookie === undefined) {
                    // no: set a new cookie
                    let randomNumber =  uuidv1()
                    res.cookie('yazz',randomNumber, { maxAge: 900000, httpOnly: false });
                    await createCookieInDb(randomNumber, hostCookieSentTo, from_device_type)
                    //console.log('cookie created successfully');
                } else {
                    // yes, cookie was already present
                    //console.log('cookie exists', cookie);

                    //
                    // check if cookie exists in the DB. If not then set a new cookie
                    //
                    let cookieRecord = await getCookieRecord(cookie)
                    if (cookieRecord == null) {
                        let randomNumber =  uuidv1()
                        res.cookie('yazz',randomNumber, { maxAge: 900000, httpOnly: false });
                        await createCookieInDb(randomNumber, hostCookieSentTo, from_device_type)
                        //console.log('No cookie found in Yazz DB, cookie created successfully');
                    }

                }
            }



            // Pass to next layer of middleware
            next();
        });

        app.get('/', function (req, res, next) {
            //------------------------------------------------------------------------------
            // Show the default page for the different domains
            //------------------------------------------------------------------------------
            //console.log("calling main page")
            //console.log("jaeger: " + jaegercollector)
            //console.log("app.get('/'): ")
            //console.log("    req.cookies: " + JSON.stringify(req.cookies,null,2))
            return getRoot(req, res, next);
        })
        app.get('/copy_component_get', async function (req, res, next) {
            let userid              = await getUserId(req)
            let baseComponentId     = req.query.base_component_id
            let codeId              = req.query.code_id
            let newBaseComponentId  = req.query.new_base_component_id

            let args =
                {
                    base_component_id: baseComponentId
                    ,
                    code_id: codeId
                    ,
                    new_base_component_id: newBaseComponentId
                }

            let response = await copyAppshareApp(args)
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(
                response
            ));

        })
        app.get('/update_code_tags', async function (req, res, next) {
            let userid          = await getUserId(req)

            await yz.updateCodeTags(
                dbsearch,
                {
                    baseComponentId:    req.query.baseComponentId,
                    userId:             userid,
                    sha1sum:            req.query.sha1sum
                })
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(
                {status: "Done"}
            ));

        })
        app.get('/get_code_commit', async function (req, res, next) {
            //console.log("calling main page")
            //console.log("jaeger: " + jaegercollector)
            let commitId = req.query.commit_id;


            let codeRecord = await yz.getQuickSqlOneRow(dbsearch,  "select  code  from   system_code  where   id = ? ", [  commitId  ])
            let codeString = codeRecord.code

            console.log("app.get('/'): ")
            console.log("    req.cookies: " + JSON.stringify(req.cookies,null,2))
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(
                {code: codeString}
            ));

        })
        app.post('/call_component', async function (req, res) {
            console.log("app.post('/call_component'): ")
            console.log("    req.cookies: " + JSON.stringify(req.cookies, null, 2))

            let topApps = []
            //let baseComponentId = req.body.value.base_component_id
            //let baseComponentIdVersion = req.body.value.base_component_id_version
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(
                topApps
            ));
        })
        app.post('/submit_comment', async function (req, res) {
            console.log("app.post('/submit_comment'): ")
            console.log("    req.cookies: " + JSON.stringify(req.cookies,null,2))

            let topApps = []
            let baseComponentId = req.body.value.base_component_id
            let baseComponentIdVersion = req.body.value.base_component_id_version
            let newComment = req.body.value.comment
            let newRating = req.body.value.rating
            let newDateAndTime = new Date().getTime()


            await insertCommentIntoDb(
                {
                    baseComponentId:        baseComponentId,
                    baseComponentIdVersion: baseComponentIdVersion,
                    newComment:             newComment,
                    newRating:              newRating,
                    dateAndTime:            newDateAndTime
                }
            )
            let commentsAndRatings = await getCommentsForComponent(baseComponentId)

            topApps =
            {
                status: "ok"
                ,

                comments_and_ratings: commentsAndRatings
            }

            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(
                topApps
            ));

            setTimeout(async function() {
                let ipfsHash = await saveJsonItemToIpfs(
                    {
                        type: "COMPONENT_COMMENT",
                        format: "JSON'",
                        type_: "component_type('COMPONENT_COMMENT')",
                        format_: "format('JSON')",
                        date_and_time: newDateAndTime,
                        base_component_id: baseComponentId,
                        base_component_id_version: baseComponentIdVersion,
                        comment: newComment,
                        rating: newRating
                    }

                )
                let afdsfds=ipfsHash
            },500)

        });
        app.post('/save_debug_text', async function (req, res) {
            /*
            ________________________________________
            |                                      |
            |       POST /save_debug_text          |
            |                                      |
            |______________________________________|
            Function description
            __________
            | PARAMS |______________________________________________________________
            |
            |     componentSearchDetails    Some text
            |     ----------------------    can go here
            |                               and on the
            |                               following lines
            |
            |     second param              Some text
            |     ------------              can go here
            |                               and on the
            |                               following lines
            |________________________________________________________________________ */
            let textInput       = req.body.textInput
            let fileLocation    = req.body.fileLocation
            fs.writeFileSync(fileLocation, textInput);

//zzz
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({status: "OK"}))
        })
        app.post('/get_pipeline_code', async function (req, res) {
            /*
            ________________________________________
            |                                      |
            |       POST /save_debug_text          |
            |                                      |
            |______________________________________|
            Function description
            __________
            | PARAMS |______________________________________________________________
            |
            |     componentSearchDetails    Some text
            |     ----------------------    can go here
            |                               and on the
            |                               following lines
            |
            |     second param              Some text
            |     ------------              can go here
            |                               and on the
            |                               following lines
            |________________________________________________________________________ */
            let pipelineFileName        = req.body.pipelineFileName
            let fileOut                 = await yz.getPipelineCode({pipelineFileName: pipelineFileName })
//zzz
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({value: fileOut}))
        })
        app.post('/load_ui_components_v3', async function (req, res) {
            /*
                                POST    '/load_ui_components_v3'

                                Loads a bunch of components
             */
            let inputComponentsToLoad       = req.body.find_components.items
            let outputComponents            = []


            //----------------------------------------------------------------------------
            // Go through all the components
            //----------------------------------------------------------------------------
            for (let componentItem    of    inputComponentsToLoad ) {
                let resultsRow = null




                //----------------------------------------------------------------------------
                // if IPFS Hash given
                //----------------------------------------------------------------------------
            if (componentItem.codeId) {
                componentItem.ipfsHashId = componentItem.codeId

                resultsRow = await yz.getQuickSqlOneRow(
                    dbsearch
                    ,
                    `
                            SELECT  
                                system_code.*  
                            FROM
                                system_code  
                            WHERE  
                                id  = ?
                            `
                    ,
                    componentItem.codeId)

                //let ret = await loadComponentFromIpfs(  componentItem.ipfsHashId  )





                //----------------------------------------------------------------------------
                // if baseComponentId given
                //----------------------------------------------------------------------------
                } else if (componentItem.baseComponentId) {
                    resultsRow = await yz.getQuickSqlOneRow(
                        dbsearch
                        ,
                        `
                        SELECT  
                            system_code.*  
                        FROM   
                            system_code, 
                            yz_cache_released_components   
                        WHERE  
                            yz_cache_released_components.base_component_id = ?
                                and   
                            yz_cache_released_components.ipfs_hash = system_code.id 
                        `
                        ,
                        componentItem.baseComponentId)

                    if (!resultsRow) {
                        resultsRow = await yz.getQuickSqlOneRow(
                            dbsearch
                            ,
                            `
                            SELECT  
                                system_code.*  
                            FROM
                                system_code  
                            WHERE  
                                base_component_id  = ?
                            order by 
                                creation_timestamp limit 1  
                            `
                            ,
                            componentItem.baseComponentId)
                    }
                }













                //----------------------------------------------------------------------------
                // Add the libs
                //----------------------------------------------------------------------------
                if (resultsRow) {
                    let codeId = resultsRow.id
                    let results2 = await yz.getQuickSql(
                        dbsearch
                        ,
                        "SELECT dependency_name FROM app_dependencies where code_id = ?; "
                        ,
                        codeId)
                    resultsRow.libs = results2
                    outputComponents.push(resultsRow)
                }
            }


            //----------------------------------------------------------------------------
            // return the result to the API caller
            //----------------------------------------------------------------------------
            let decorateResult = [{record: JSON.stringify(outputComponents, null, 2)}]
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(decorateResult))
        })
        app.post('/post_test', async function (req, res) {
            console.log("app.post('/post_test'): ")
            console.log("    req.cookies: " + JSON.stringify(req.cookies,null,2))

            res.writeHead(200, {'Content-Type': 'application/json'});

            res.end(JSON.stringify(
                []
            ));

        });
        app.post('/get_comments_for_component', async function (req, res) {
            let baseComponentId = req.body.value.base_component_id
            let commentsAndRatings = await getCommentsForComponent(baseComponentId)

            topApps =
                {
                    status: "ok"
                    ,

                    comments_and_ratings: commentsAndRatings
                }

            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(
                topApps
            ));

        });
        app.get('/login_with_metamask', async function (req, res) {
            console.log("app.post('/login_with_metamask'): ")
            console.log("    req.cookies: " + JSON.stringify(req.cookies,null,2))
            let metamaskAccId = req.query.metamask_account_id;


            let sessionId = await getSessionId(req,res)

            let promise = new Promise(async function(returnfn) {
                dbsearch.serialize(function() {
                    dbsearch.run("begin exclusive transaction");

                    let newRandomSeed = uuidv1()
                    let timestampNow = new Date().getTime()

                    stmtInsertMetaMaskLogin.run(uuidv1(), metamaskAccId ,newRandomSeed, timestampNow)
                    dbsearch.run("commit")
                    returnfn({
                        seed: newRandomSeed
                    })
                })

            })
            let ret = await promise

            res.writeHead(200, {'Content-Type': 'application/json'});

            res.end(JSON.stringify(
                ret
            ));

        });
        app.get('/check_metamask_seed', async function (req, res) {
            try {

            console.log("app.get('/check_metamask_seed'): ")
            console.log("    req.cookies: " + JSON.stringify(req.cookies,null,2))
            let metamaskAccId = req.query.metamask_account_id;
            let signedTx = req.query.signedTx;
            let randomLoginSeed = req.query.random_seed;
            let sessionId = await getSessionId(req)

            let promise = new Promise(async function(returnfn) {

                dbsearch.serialize(
                    function() {
                        dbsearch.all(
                            " select " +
                            "     *  " +
                            " from    " +
                            "     metamask_logins " +
                            " where     " +
                            "     random_seed = ? " +
                            " order by " +
                            "     created_timestamp DESC "
                            ,
                            [randomLoginSeed]
                            ,
                            async function(err, rows) {
                                if (rows.length == 0 ) {
                                    returnfn({error: "No record found for account"})
                                } else {
                                    let firstRow = rows[0]
                                    let signMessage = req.query.sign_message;
                                    let sessionId = await getSessionId(req)
                                    let ret={}
                                    const recoveredSigner = web3.eth.accounts.recover(signMessage, signedTx);

                                    if (recoveredSigner == metamaskAccId) {
                                        ret.status = "Ok"

                                        let login_hashed_id = merkleJson.hash({
                                            metamask_account_id: metamaskAccId
                                        })

                                        let promise1 = new Promise(async function(returnfn2) {
                                            dbsearch.serialize(function() {
                                                dbsearch.run("begin exclusive transaction");
                                                stmtInsertUser.run(login_hashed_id, "METAMASK")
                                                stmtSetMetaMaskLoginSuccedded.run(sessionId, randomLoginSeed)
                                                stmtInsertSessionWithNewUserId.run(login_hashed_id,sessionId)
                                                dbsearch.run("commit")
                                                returnfn2()
                                            })

                                        })
                                        await promise1
                                    } else {
                                        ret.error = "Invalid signature"
                                    }
                                    returnfn(ret)

                                }

                            }
                        );
                    }, sqlite3.OPEN_READONLY)
            })
            let ret = await promise
            res.writeHead(200, {'Content-Type': 'application/json'});

            res.end(JSON.stringify(
                ret
            ));
            } catch(err2)
            {
                let x=1
            }

        });
        app.get('/bulk_calculate_branch_strength_for_component', async function (req, res) {
            console.log("app.post('/bulk_calculate_branch_strength_for_component'): ")
            let baseComponentId = req.query.baseComponentId;

            //
            // first find all the tips
            //
            let allTips = await yz.getQuickSql(
                dbsearch,

                `select  
                    fk_system_code_id  
                from  
                    code_tags  
                where  
                    base_component_id = ? 
                        and 
                    code_tag = 'TIP'  `,

                [baseComponentId]
                )

            for (tip of allTips) {

                let numCommitsRow = await yz.getQuickSqlOneRow(
                    dbsearch,
                    `with RECURSIVE
                    parents_of(id2, parent_id2) as (
                        select id, parent_id from system_code where id = ?
                            union all
                        select id, parent_id from system_code,parents_of  where id = parent_id2
                            limit 10
                    )
                select count(*) as num_commits from parents_of`
                    ,
                    [tip.fk_system_code_id])
                let numCommits = numCommitsRow.num_commits



                await yz.executeQuickSql(
                    dbsearch,

                    `update 
                    system_code  
               set  
                    score = ?  
                where  
                    id = ? `,

                    [numCommits, tip.fk_system_code_id]
                )
                await yz.executeQuickSql(
                    dbsearch,

                    `update 
                    code_tags  
               set  
                    main_score = ?  
                where  
                    base_component_id = ? 
                        and 
                    fk_system_code_id = ?  
                        and 
                    code_tag = 'TIP'  `,

                    [numCommits, baseComponentId, tip.fk_system_code_id ]
                )
            }






            let updatedTips = await yz.getQuickSql(
                dbsearch,

                `select  
                    fk_system_code_id  , main_score
                from  
                    code_tags  
                where  
                    base_component_id = ? 
                        and 
                    code_tag = 'TIP'  `,

                [baseComponentId]
            )


            res.writeHead(200, {'Content-Type': 'application/json'});

            res.end(JSON.stringify(
                {
                    baseComponentId: baseComponentId
                    ,
                    tips: updatedTips
                }
            ));
        });
        app.get('/get_version_history_v2', async function (req, res) {

            console.log("app.post('/get_version_history_v2'): ")
            console.log("    req.cookies: " + JSON.stringify(req.cookies,null,2))
            let topApps = []
            let baseComponentIdToFind = req.query.id;
            let sessionId = await getSessionId(req)
            let lastCommitId = req.query.commit_id
            let currentReturnRows = []

            let selectedCommitRow = await getRowForCommit(lastCommitId)
            currentReturnRows.push(selectedCommitRow)
            let returnRows = await getPreviousCommitsFor(
                {
                    commitId: selectedCommitRow.id
                    ,
                    parentCommitId: selectedCommitRow.parent_commit_id
                    ,
                    returnRows: currentReturnRows
                })


            res.writeHead(200, {'Content-Type': 'application/json'});

            res.end(JSON.stringify(
                returnRows
            ));

        });
        app.get('/get_version_future', async function (req, res) {

            console.log("app.post('/get_version_future'): ")
            console.log("    req.cookies: " + JSON.stringify(req.cookies,null,2))
            let commitId = req.query.commit_id
            let currentReturnRows = []

            let firstRow = await getRowForCommit(commitId)
            currentReturnRows.push(firstRow)
            let returnRows = await getFutureCommitsFor(
                {
                    commitId: commitId
                    ,
                    returnRows: currentReturnRows
                })

            res.writeHead(200, {'Content-Type': 'application/json'});

            res.end(JSON.stringify(
                returnRows
            ));

        });
        app.post('/editable_apps', async function (req, res) {

            //console.log("app.post('/editable_apps'): ")
            //console.log("    req.cookies: " + JSON.stringify(req.cookies,null,2))
            let editableApps = []
            let userId = await getUserId(req)

            let promise = new Promise(async function(returnfn) {

                dbsearch.serialize(
                    function() {
                        dbsearch.all( `SELECT
                                            system_code.id,
                                            system_code.base_component_id,
                                            system_code.read_write_status,
                                            system_code.display_name
                                       FROM
                                            code_tags, system_code
                                        WHERE
                                            code_tags.fk_user_id = ?
                                                AND
                                            code_tags.fk_system_code_id = system_code.id
                                                AND
                                            code_tags.code_tag = "EDIT"`
                            ,
                            [userId]
                            ,
                            async function(err, rows) {
                                let returnRows = []
                                if (!err) {
                                    try {
                                        if (rows.length > 0) {
                                            for (let rowIndex =0; rowIndex < rows.length; rowIndex++) {
                                                let thisRow = rows[rowIndex]
                                                returnRows.push(
                                                    {
                                                        base_component_id: thisRow.base_component_id
                                                        ,
                                                        logo: ""
                                                        ,
                                                        ipfs_hash: thisRow.id
                                                        ,
                                                        display_name: thisRow.display_name
                                                    })
                                            }
                                        }




                                    } catch(err) {
                                        console.log(err);
                                        let stack = new Error().stack
                                        console.log( stack )
                                    } finally {
                                        returnfn(returnRows)
                                    }

                                } else {
                                    console.log(err);
                                }
                            }
                        );
                    }, sqlite3.OPEN_READONLY)
            })
            let ret = await promise

            editableApps = ret

            res.writeHead(200, {'Content-Type': 'application/json'});

            res.end(JSON.stringify(
                editableApps
            ));

        });
        app.post('/topapps', async function (req, res) {
            //console.log("app.post('/topapps'): ")
            //console.log("    req.cookies: " + JSON.stringify(req.cookies,null,2))
            let topApps = []
            let sessionId = await getSessionId(req)

            let promise = new Promise(async function(returnfn) {

                dbsearch.serialize(
                    function() {
                        dbsearch.all(
                            " select  " +
                            "     distinct(yz_cache_released_components.id), component_name, app_icon_data, ipfs_hash, yz_cache_released_components.base_component_id " +
                            " from " +
                            "     yz_cache_released_components " +
                            " inner JOIN " +
                            "     icon_images ON yz_cache_released_components.icon_image_id = icon_images.id " +
                            " and " +
                            "    ( component_type = 'app' or base_component_id = 'button_control' or base_component_id = 'checkbox_control'  or base_component_id = 'input_control'   or base_component_id = 'label_control')"
                            ,
                            []
                            ,
                            async function(err, rows) {
                                let returnRows = []
                                if (!err) {
                                    try {
                                        if (rows.length > 0) {
                                            for (let rowIndex =0; rowIndex < rows.length; rowIndex++) {
                                                let thisRow = rows[rowIndex]
                                                returnRows.push(
                                                    {

                                                        data: {
                                                            id:                 thisRow.base_component_id
                                                            ,
                                                            base_component_id:  thisRow.base_component_id
                                                            ,
                                                            logo:               thisRow.app_icon_data
                                                            ,
                                                            ipfs_hash:          thisRow.ipfs_hash
                                                            ,
                                                            display_name:       thisRow.app_name
                                                        }
                                                        ,
                                                        id:                 thisRow.base_component_id
                                                        ,
                                                        base_component_id:  thisRow.base_component_id
                                                        ,
                                                        logo:               thisRow.app_icon_data
                                                        ,
                                                        ipfs_hash:          thisRow.ipfs_hash
                                                        ,
                                                        display_name:       thisRow.app_name

                                                    })
                                            }
                                        }




                                    } catch(err) {
                                        console.log(err);
                                        let stack = new Error().stack
                                        console.log( stack )
                                    } finally {
                                        returnfn(returnRows)
                                    }

                                } else {
                                    console.log(err);
                                }
                            }
                        );
                    }, sqlite3.OPEN_READONLY)
            })
            let ret = await promise

            topApps = ret

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
        app.get('/edit/*', function (req, res) {
            //------------------------------------------------------------------------------
            // Allow an app to be edited
            //------------------------------------------------------------------------------
        	return getEditApp(req, res);
        })
        app.post('/add_or_update_app', async function (req, res) {
console.log("/add_or_update_app")
            let baseComponentIdLocal = req.body.base_component_id
console.log("/add_or_update_app:baseComponentIdLocal := " + baseComponentIdLocal)
            let srcCode = req.body.src_code
console.log("/add_or_update_app:srcCode := " + srcCode.length)
            let ipfsHash = req.body.ipfs_hash
console.log("/add_or_update_app:ipfsHash := " + ipfsHash)

            await addOrUpdateDriver(srcCode ,
                                    {
                                     save_html: true,
                                     username: "default",
                                     reponame: baseComponentIdLocal,
                                     version: "latest",
                                     ipfsHashId: ipfsHash})
console.log("/add_or_update_app:addOrUpdateDriver completed")
            res.status(200).send('Code registered');
        })
        /* what happens if we register a false or bad IPFS address? All code sent here
         *  should be validated */
        app.post('/register_ipfs_content_for_client', async function (req, res) {

            let ipfsHash = req.body.ipfs_hash
            let ipfsContent = req.body.ipfs_content
            let parsedCode = await parseCode(ipfsContent)
            await registerIPFS(ipfsHash);
            res.status(200).send('IPFS content registered');
        })
        app.use("/files",   express.static(path.join(userData, '/files/')));
        app.use("/weights",   express.static(path.join(userData, '/weights/')));


        function getAppNameFromHtml() {

        }

        function getBaseComponentIdFromRequest(req){
            let parts = req.path.split('/');
            let appHtmlFile = parts.pop() || parts.pop();

            let appName = appHtmlFile.split('.').slice(0, -1).join('.')
            return appName
        }


        //app.get('/app/*', keycloakProtector({compIdFromReqFn: getBaseComponentIdFromRequest}), function (req, res, next) {
        app.get('/app/*', function (req, res, next) {
            console.log("app.get('/app'): ")
            console.log("    req.cookies: " + JSON.stringify(req.cookies,null,2))

            if (req.kauth) {
                outputDebug('Keycloak details from server:')
                outputDebug(req.kauth.grant)
            }
            let parts = req.path.split('/');
            let appHtmlFile = parts.pop() || parts.pop();

            //console.log("appHtemlFile: " + appHtmlFile);

            let appName = appHtmlFile.split('.').slice(0, -1).join('.')
            //console.log("appName: " + appName);

             //console.log("path: " + path);

             let appFilePath = path.join(userData, 'apps/' + appHtmlFile)
             let fileC2 = fs.readFileSync(appFilePath, 'utf8').toString()
             res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
             res.end(fileC2);


        })
        //app.use("/app_dbs", express.static(path.join(userData, '/app_dbs/')));
        app.use("/public/aframe_fonts", express.static(path.join(__dirname, '../public/aframe_fonts')));
        app.use(            express.static(path.join(__dirname, '../public/')))
        app.use(bodyParser.json()); // support json encoded bodies
        app.use(bodyParser.urlencoded({ extended: true , limit: '50mb'})); // support encoded bodies
        //app.use(useragent.express())


        app.post("/save_code_v3" , async function (req, res) {
            let userid
            let optionsForSave
            let saveResult
            let savedCode

            userid          = await getUserId(req)
            optionsForSave  = req.body.value.options

            if (optionsForSave) {
                optionsForSave.userId = userid
            }

            saveResult = await yz.saveCodeV3(
                dbsearch,
                req.body.value.code,
                optionsForSave)

            savedCode       = req.body.value.code
            await createNewTip(savedCode, saveResult.code_id, userid);


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
        app.post("/get_commit_hash_id" , async function (req, res) {
            //
            // get stuff
            //
            let code = req.body.text;

            let ipfsHash = await OnlyIpfsHash.of(code)
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
            res.end(JSON.stringify({
                ipfsHash: ipfsHash,
            }))
        })
        app.post("/bookmark_commit" , async function (req, res) {
            //
            // get stuff
            //
            let ipfsHash = req.body.value.code_id;
            let version = req.body.value.version;
            let userId = req.body.value.user_id;


            let code = await yz.getCodeForCommit(dbsearch, ipfsHash)
            await yz.tagVersion(dbsearch, ipfsHash, code)


            //let parsedCode = await parseCode(code)
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
            res.end(JSON.stringify({
                ipfsHash:   ipfsHash,
            }))
        })
        app.post("/release_commit" , async function (req, res) {
            //
            // get stuff
            //
            let ipfsHash = req.body.value.code_id;
            let version = req.body.value.version;
            let userId = req.body.value.user_id;


            let code = await yz.getCodeForCommit(dbsearch, ipfsHash)
            await yz.tagVersion(dbsearch, ipfsHash, code)
            await releaseCode(ipfsHash, code)


            //let parsedCode = await parseCode(code)
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
            let componentToCopyBaseComponentId = yz.getValueOfCodeString(srcText,"base_component_id")
            srcText = srcText.replaceAll(componentToCopyBaseComponentId, copy_base_component_id)


            //
            // design_time_html
            //
            let design_time_html = req.body.value.design_time_html
            if ( design_time_html ) {
                srcText = yz.replaceBetween(srcText,"<!-- design_time_html_start -->", "<!-- design_time_html_end -->",design_time_html)
            }


            //
            // DESIGN TIME MOUNTED CODE
            //
            let designTimeMountedCode = req.body.value.design_time_mounted_code
            if (designTimeMountedCode) {
                srcText = yz.replaceBetween(srcText,"/*NEW_DESIGN_TIME_MOUNTED_START*/", "/*NEW_DESIGN_TIME_MOUNTED_END*/",designTimeMountedCode)
            }



            //
            // RUN TIME MOUNTED CODE
            //
            let runtimeMountedCode = req.body.value.runtime_mounted_code
            if (runtimeMountedCode) {
                srcText = yz.replaceBetween(srcText,"/*NEW_RUNTIME_MOUNTED_START*/", "/*NEW_RUNTIME_MOUNTED_END*/",runtimeMountedCode)
            }



            //
            // VARS CODE
            //
            let varsCode = req.body.value.vars_code
            if (varsCode) {
                srcText = yz.replaceBetween(srcText,"/*NEW_VARS_START*/", "/*NEW_VARS_END*/",varsCode)
            }




            //
            // run_time_html
            //
            let run_time_html = req.body.value.run_time_html
            if (run_time_html) {
                srcText = yz.replaceBetween(srcText,"<!-- run_time_html_start -->", "<!-- run_time_html_end -->",run_time_html)
            }






            //
            // give the new smart contract control a new icon logo
            //
            if (copy_image_data) {
                let logoValue = yz.getValueOfCodeString(srcText,"logo_url")
                if (logoValue) {
                    srcText = yz.deleteCodeString(srcText, "logo_url")
                }
                srcText = yz.insertCodeString(srcText, "logo_url",copy_image_data)
            }





            //
            // give the new component a new logo
            //
            if (req.body.value.logo_url) {
                let logoValue = yz.getValueOfCodeString(srcText,"logo_url")
                if (logoValue) {
                    srcText = yz.deleteCodeString(srcText, "logo_url")
                }
                srcText = yz.insertCodeString(srcText, "logo_url", "/driver_icons/blue_eth.png")
            }


            //
            // copy over some properties defaults from the existing component
            //
            let default_property_values = req.body.value.default_property_values;
            let propertiesToChange = Object.keys(default_property_values)
            for (let propertyToChangeIndex = 0; propertyToChangeIndex < propertiesToChange.length;propertyToChangeIndex++){
                let propertyNameToChange = propertiesToChange[propertyToChangeIndex]
                let propertyValue = default_property_values[propertyNameToChange]
                srcText = yz.replacePropertyValue(srcText,propertyNameToChange,propertyValue)
            }


            //
            // create some new properties in the new component
            //
            let newProperties = req.body.value.new_properties;
            for ( let newPropertyIndex = 0 ; newPropertyIndex < newProperties.length ; newPropertyIndex++ ){
                let newProperty = newProperties[newPropertyIndex]
                srcText = yz.addProperty(srcText,newProperty)
            }


            //
            // create new methods in the new component
            //
            let newMethods = req.body.value.new_methods;
            if (newMethods) {
                for ( let newMethodIndex = 0 ; newMethodIndex < newMethods.length ; newMethodIndex++ ){
                    let newMethod = newMethods[newMethodIndex]
                    srcText = yz.addMethod(srcText,"\n\n\n"+newMethod.code+"\n,\n\n")
                }
            }




            //
            // create new methods in the new component
            //
            let newMethodsV2 = req.body.value.new_methods_v2;
            if (newMethodsV2) {
                for ( let newMethodIndex = 0 ; newMethodIndex < newMethodsV2.length ; newMethodIndex++ ){
                    let newMethod = newMethodsV2[newMethodIndex]
                    srcText = yz.addMethod(srcText,"\n\n\n"+newMethod.code+"\n,\n\n")
                    let newMethodProperty = newMethod.properties
                    srcText = yz.addProperty(srcText,newMethodProperty)
                }
            }



            //
            // Delete any IPFS from the component class. Unfortunately this can't be stored in IPFS itself
            //
            let properties = yz.getValueOfCodeString(srcText,"properties", ")//prope" + "rties")
            srcText = yz.deleteCodeString(  srcText, "properties", ")//prope" + "rties")
            for (let irte = 0 ; irte < properties.length ; irte++ ) {
                let brje = properties[irte]
                if (brje) {
                    if (brje.id == "ipfs_hash_id") {
                        brje.default = ""//ipfsHash
                    }
                }
            }
            srcText = yz.insertCodeString(  srcText,
                "properties",
                properties,
                ")//prope" + "rties")




            //fs.writeFileSync( "z.txt",  srcText.toString() )










            //
            // save the new smart contract component
            //
            let codeRet = await addOrUpdateDriver(srcText ,  {username: "default", reponame: copy_base_component_id, version: "latest"})
            let codeId = codeRet.codeId




            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
            res.end(JSON.stringify({
                ipfsHash:   codeId,
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
                let connt = JSON.stringify(sck.conn.transport,null,2);
                websocketFn(sck)
            });

        })
    }





    childProcessNameInScheduler            = "forkedExeScheduler"






    for (let i=0;i<executionProcessCount; i++ ) {
        let exeProcName = "forkedExeProcess" + i
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
    fs.readdir(fullIpfsFolderPath, async function (err, files) {
        if (err) {
            return console.error(err);
        }

        for (let fileindex=0;fileindex<files.length;fileindex++){
            let ipfsHashFileName = files[fileindex]
            if (ipfsHashFileName.length > 10) {
                try
                {
                    //console.log("ipfsHashFileName: " + ipfsHashFileName);

                    let fullFileName = path.join(fullIpfsFolderPath, ipfsHashFileName)
                    let ipfsContent = fs.readFileSync(fullFileName, 'utf8')

                    let itemType = yz.getValueOfCodeString(ipfsContent,"component_type")
                    if (itemType == "COMPONENT_COMMENT") {
                        let formatType = yz.getValueOfCodeString(ipfsContent,"format")
                        if (formatType == "JSON") {
                            let jsonComment = JSON.parse(ipfsContent)
                            await insertCommentIntoDb(
                                {
                                    baseComponentId:        jsonComment.base_component_id,
                                    baseComponentIdVersion: jsonComment.base_component_id_version,
                                    newComment:             jsonComment.comment,
                                    newRating:              jsonComment.rating,
                                    dateAndTime:            jsonComment.date_and_time
                                }
                            )
                        }
                    } else if (itemType == "APP") {
                        let parsedCode = await parseCode(ipfsContent)
                        parsedCode.ipfsHash = ipfsHashFileName
                        await registerIPFS(ipfsHashFileName);
                    }
                    //console.log("ipfsHashFileName : " + ipfsHashFileName + " read");
                }
                catch(exp)
                {
                    console.log("ipfsHashFileName : " + ipfsHashFileName + " ERROR!" + exp);
                }

            }
        }
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
let localAddress =  hostaddress + ':' + port
console.log("Local Machine Address: " + localAddress);
console.log("Network Host Address. Click to open: " + serverProtocol + "://" + hostaddressintranet + ':' + port)


} else {


                let parsedInput = null
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
                let promise = new Promise(async function(returnFn) {
                    let seqNum = queuedResponseSeqNum;
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
                let ret = await promise
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
function bytesToMb(bytes) {
    return (bytes / 1024 ) / 1024
}
function getChildMem(childProcessName,stats) {
    let memoryused = 0
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
        let fff = fs.readFileSync(caCertificate1, 'utf8')
        outputDebug("  = " + fff)
        caCertsRet.push(fff)
    }
    if (caCertificate2) {
        outputDebug("CA Cert 2 = " + caCertificate2)
        let fff = fs.readFileSync(caCertificate2, 'utf8')
        outputDebug("  = " + fff)
        caCertsRet.push(fff)
    }
    if (caCertificate3) {
        outputDebug("CA Cert 3 = " + caCertificate3)
        let fff = fs.readFileSync(caCertificate3, 'utf8')
        outputDebug("  = " + fff)
        caCertsRet.push(fff)
    }
    return caCertsRet
}
setupVisifileParams();
{
    outputDebug("process.platform = " + process.platform)


    if (process.platform === "win32") {
        let rl = require2("readline").createInterface({
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
        localappdata  = process.env.LOCALAPPDATA
    	userData = path.join(localappdata, '/Yazz/')
    } else {

        outputDebug("Running as Linux/Mac")
    	userData =  path.join(LOCAL_HOME, 'Yazz')
    }
    yz.userData = userData
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
    let uploadPath = path.join(userData,  'uploads/')

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
    let getSqlResults = new Promise(returnResult => {
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
                    appDb.run("PRAGMA wal_checkpoint;")
                    returnResult([])
             })
        }
    })


    let res = await getSqlResults
    return res
}
let shuttingDown = false;
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
                    for (let ttt=0; ttt< allForked.length; ttt++) {
                        let childProcessName = allForked[ttt]
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
    //console.log("setUpSql    ")



    stmtInsertComment = dbsearch.prepare(" insert or replace into comments_and_ratings " +
        "    (id, base_component_id, version , comment, rating, date_and_time) " +
        " values " +
        "    (?,?,?,?,?,?);");


    stmtInsertCookie = dbsearch.prepare(" insert or replace into cookies " +
        "    (id,  created_timestamp, cookie_name, cookie_value, fk_session_id, host_cookie_sent_to, from_device_type ) " +
        " values " +
        "    (?, ?, ?, ?, ? , ? , ?);");

    stmtInsertUser = dbsearch.prepare(" insert or replace into users " +
        "    (id, user_type) " +
        " values " +
        "    (?, ?);");

    stmtInsertMetaMaskLogin =  dbsearch.prepare(" insert or replace into metamask_logins " +
        "    (id , account_id , random_seed , created_timestamp ) " +
        " values " +
        "    (?, ?, ?, ?);");


    stmtSetMetaMaskLoginSuccedded =  dbsearch.prepare(" update metamask_logins " +
        "   set  confirmed_login  = 'TRUE' , fk_session_id = ? " +
        " where " +
        "    random_seed =?;");
    //

    stmtInsertSession = dbsearch.prepare(" insert or replace into sessions " +
        "    (id,  created_timestamp, last_accessed , access_count ,  fk_user_id ) " +
        " values " +
        "    (?, ?, ?, ?, ?);");

    stmtInsertSessionWithNewUserId = dbsearch.prepare(" update sessions " +
        "    set fk_user_id = ? where id = ? ");

    stmtInsertIpfsHash = dbsearch.prepare(" insert or replace into ipfs_hashes " +
        "    (ipfs_hash, content_type, ping_count, last_pinged ) " +
        " values " +
        "    ( ?, ?, ?, ? );");


    stmtInsertReleasedComponentListItem = dbsearch.prepare(`insert or ignore
                                                    into
                                               yz_cache_released_components
                                                    (   id  ,  base_component_id  ,  component_name  ,  component_type, 
                                                        component_description  ,  icon_image_id  ,  
                                                        ipfs_hash , version,read_write_status, code )
                                               values (?,?,?,?,?,?,?,?,?,?)`)


    stmtUpdateReleasedComponentList = dbsearch.prepare(`update yz_cache_released_components 
                                            set 
                                                ipfs_hash = ?  
                                            where
                                               base_component_id  = ?
                                               `)


    stmtInsertIconImageData = dbsearch.prepare(`insert or ignore
                                                    into
                                               icon_images
                                                    (  id  ,  app_icon_data  )
                                               values (?,?)`)












          setProcessToRunning = dbsearch.prepare("UPDATE system_process_info SET status = 'RUNNING', component_type = ?,  running_start_time_ms = ?, event_duration_ms = 0, system_code_id = ?, callback_index = ? WHERE process = ? AND yazz_instance_id = ?");

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

    //console.log("setUpSql done   ")
}
/*
________________________________________
|                                      |
|       save_code_from_upload          |
|                                      |
|______________________________________|
Function description
__________
| PARAMS |______________________________________________________________
|
|     msg    Some text
|     ---
|________________________________________________________________________ */
async function save_code_from_upload(msg) {
    let ret = await yz.saveCodeV3(  dbsearch  ,  msg.code  , msg.options);
    if (msg.sqlite_data) {
            let b = Buffer.from(msg.sqlite_data, 'base64')
            let sqliteAppDbPath = path.join( userData, 'app_dbs/' + msg.base_component_id + '.visi' )
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
/*
_____________________________________________________________________________
|                                                                           |
|       ipc_child_returning_uploaded_app_as_file_in_child_response          |
|                                                                           |
|___________________________________________________________________________|
Function description
__________
| PARAMS |______________________________________________________________
|
|     msg    Some text
|     ---
|________________________________________________________________________ */
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
async function evalLocalSystemDriver(location, options) {
    outputDebug("*** Loading driver from: *** : " + location)
    let ret
    try {
        let evalDriver = fs.readFileSync(location);
    	ret = await addOrUpdateDriver(evalDriver,options)
    } catch (error) {
        outputDebug(error)
    }
    return ret
}
async function saveJsonItemToIpfs(jsonItem) {
    let jsonString = JSON.stringify(jsonItem,null,2)
    await  saveItemToIpfs(jsonString)
}
async function saveItemToIpfs(srcCode) {
    outputDebug("*** saveItemToIpfs: *** : " )
    let promise = new Promise(async function(returnfn) {
        let justHash = null
        try {
            //console.log("Starting...")

            justHash = await OnlyIpfsHash.of(srcCode)
            let fullIpfsFilePath = path.join(fullIpfsFolderPath,  justHash)
            fs.writeFileSync(fullIpfsFilePath, srcCode);
            await insertIpfsHashRecord(justHash,null,null,null)
            await sendIpfsHashToCentralServer(justHash, srcCode)


            if (isIPFSConnected) {
                let testBuffer = new Buffer(srcCode);
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
    let ipfsHash = await promise
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
                path: '/register_ipfs_content_for_client',
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
                //console.log('STATUS: ' + res.statusCode);
                //console.log('HEADERS: ' + JSON.stringify(res.headers));
                res.setEncoding('utf8');
                res.on('data', function (chunk) {
                    //console.log('BODY: ' + chunk);
                });
                res.on('end', function () {
                    //console.log('end: ' );
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
    let ipfsHash = await promise
    return ipfsHash
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
            let baseComponentId = yz.getValueOfCodeString(srcCode,"base_component_id")



               /* let properties = yz.getValueOfCodeString(srcCode,"properties", ")//prope" + "rties")
                srcCode = yz.deleteCodeString(  srcCode, "properties", ")//prope" + "rties")
                for (let irte = 0 ; irte < properties.length ; irte++ ) {
                    let brje = properties[irte]
                    if (brje.id == "ipfs_hash_id") {
                        brje.default = ipfsHash
                    }
                }

                srcCode = yz.insertCodeString(  srcCode,
                    "properties",
                    properties,
                    ")//prope" + "rties")*/

                await addOrUpdateDriver(srcCode ,  {username: "default", reponame: baseComponentId, version: "latest", ipfsHashId: ipfsHash, allowChanges: false})

                console.log("....................................Loading component from local IPFS cache: " + fullIpfsFilePath)
                returnfn("Done")

            } catch (error) {
                try
                {

                ipfs.files.get(ipfsHash, function (err, files) {
                    files.forEach(async function(file) {
                        console.log("....................................Loading component from IPFS: " + file.path)
                        //console.log(file.content.toString('utf8'))
                        srcCode = file.content.toString('utf8')



                        let baseComponentId = yz.getValueOfCodeString(srcCode,"base_component_id")



                        let properties = yz.getValueOfCodeString(srcCode,"properties", ")//prope" + "rties")
                        srcCode = yz.deleteCodeString(  srcCode, "properties", ")//prope" + "rties")
                        for (let irte = 0 ; irte < properties.length ; irte++ ) {
                            let brje = properties[irte]
                            if (brje.id == "ipfs_hash_id") {
                                brje.default = ipfsHash
                            }
                        }

                        srcCode = yz.insertCodeString(  srcCode,
                            "properties",
                            properties,
                            ")//prope" + "rties")



                        let fullIpfsFilePath = path.join(fullIpfsFolderPath,  ipfsHash)
                        fs.writeFileSync(fullIpfsFilePath, srcCode);

                        await addOrUpdateDriver(srcCode ,  {username: "default", reponame: baseComponentId, version: "latest", ipfsHashId: ipfsHash, allowChanges: false})

                        console.log("....................................Loading component fro IPFS: " + file.path)
                    })
                    returnfn("Done")
                })
            } catch (error) {
                outputDebug(error)
            }
        }



    })
    let ret = await promise
    return ret
}
//------------------------------------------------------------------------------
//
//
//
//
//
//------------------------------------------------------------------------------
async function addOrUpdateDriver(  codeString ,options ) {

    try {

        let saveRet = await yz.saveCodeV3(dbsearch,    codeString  ,options);
        let codeId = null
        if (saveRet) {
            codeId = saveRet.code_id
        }
        return {codeId: codeId}



      } catch(err) {
          console.log(err);
          let stack = new Error().stack
          console.log( stack )
          return {error: err}

      }
}
function localComponentPath(localPath) {
 return path.join(__dirname, '../public/visifile_drivers' + localPath)
}
async function evalHtmlComponentFromPath(srcPath){
    let ret = await evalLocalSystemDriver(     localComponentPath(srcPath),{save_html: true, username: "default", version: "latest"})
    return ret
}
async function evalComponentFromPath(srcPath){
    let ret = await evalLocalSystemDriver( localComponentPath(srcPath),{username: "default", version: "latest"})
    return ret
}
async function releaseComponentFromPath(srcPath){
    try {
        let ret = await evalLocalSystemDriver( localComponentPath(srcPath),{username: "default", version: "latest"})
        await releaseCode(ret.codeId)

        return ret
    } catch (err) {
        console.log(err)
    }
}
//------------------------------------------------------------------------------
//
//
//
//
//
//------------------------------------------------------------------------------
async function setUpComponentsLocally() {
    //await evalComponentFromPath('/glb.js')
    //await evalComponentFromPath('/csv.js')
    //await evalComponentFromPath('/glb.js')
    //await evalComponentFromPath('/excel.js')
    //await evalComponentFromPath( '/word.js')
    //await evalComponentFromPath('/pdf.js')
    //await evalComponentFromPath('/outlook2012.js')
    //await evalComponentFromPath( '/sqlite.js')
    //await evalComponentFromPath('/mysql.js')
    //await evalComponentFromPath( '/oracle.js')
    //await evalComponentFromPath( '/testdriver.js')
    //await evalComponentFromPath( '/file_uploader.js')



    //
    // services
    //
    if (isWin) {
        //await evalComponentFromPath( '/services/powershell.js')
    }
    await releaseComponentFromPath( '/services/commandLine.js')
    await releaseComponentFromPath( '/services/commandLine2.js')
    //await releaseComponentFromPath('/services/test_job.js')
    //await releaseComponentFromPath('/services/kafka_service.js')
    //await releaseComponentFromPath('/services/activemq_service.js')

    //await releaseComponentFromPath( '/services/web_preview.js')
    //await releaseComponentFromPath( '/services/spreadsheet_preview.js')
    //await releaseComponentFromPath( '/services/csv_preview.js')
    //await releaseComponentFromPath( '/services/doc_preview.js')

    await releaseComponentFromPath( '/services/serverDriveList.js')
    await releaseComponentFromPath( '/services/serverFolderHierarchyList.js')
    await releaseComponentFromPath( '/services/serverGetHomeDir.js')
    await releaseComponentFromPath( '/services/serverFileList.js')
    await releaseComponentFromPath( '/services/serverFolderContents.js')
    await releaseComponentFromPath( '/services/serverFolderContentsV2.js')
    await releaseComponentFromPath( '/services/compile_solidity.js')
    await releaseComponentFromPath( '/services/serverDatabaseStuff.js')
    await releaseComponentFromPath( '/services/serverDockerStuff.js')
    await releaseComponentFromPath( '/services/serverTerminalStuff.js')


    await releaseComponentFromPath( '/services/postgres_server.js')
    await releaseComponentFromPath( '/services/sqlite_server.js')
    await releaseComponentFromPath( '/services/access_server.js')
    await releaseComponentFromPath( '/services/excel_server.js')

    await releaseComponentFromPath( '/services/rest_call_service.js')
    await releaseComponentFromPath( '/services/rest_call_service_v2.js')
    await releaseComponentFromPath( '/services/json_traverse_service.js')
    await releaseComponentFromPath( '/services/json_filter_service.js')


    //
    // debug controls
    //
    //await releaseComponentFromPath( '/controls/bug_vue.js')

    //
    // controls
    //
    await releaseComponentFromPath( '/controls/chart.js')
    await releaseComponentFromPath( '/controls/image.js')
    await releaseComponentFromPath( '/controls/label.js')
    await releaseComponentFromPath( '/controls/metamask.js')
    await releaseComponentFromPath( '/controls/evm_contract.js')
    await releaseComponentFromPath( '/controls/component_builder.js')
    await releaseComponentFromPath( '/controls/evm_demo_count_contract.js')

    //
    await releaseComponentFromPath( '/controls/input.js')

    await releaseComponentFromPath( '/controls/group.js')
    await releaseComponentFromPath( '/controls/button.js')

    await releaseComponentFromPath( '/controls/checkbox.js')
    await releaseComponentFromPath( '/controls/radiobutton.js')
    await releaseComponentFromPath( '/controls/dropdown.js')
    await releaseComponentFromPath( '/controls/list.js')
    await releaseComponentFromPath( '/controls/horiz_scroll.js')
    await releaseComponentFromPath( '/controls/vert_scroll.js')
    await releaseComponentFromPath( '/controls/timer.js')
    await releaseComponentFromPath( '/controls/drive_list.js')
    await releaseComponentFromPath( '/controls/folder_list.js')
    await releaseComponentFromPath( '/controls/file_list.js')
    await releaseComponentFromPath( '/controls/shapes.js')
    await releaseComponentFromPath( '/controls/line.js')
    await releaseComponentFromPath( '/controls/draw.js')
    await releaseComponentFromPath( '/controls/database.js')
    await releaseComponentFromPath( '/controls/mixer.js')
    await releaseComponentFromPath( '/controls/ms_access.js')
    await releaseComponentFromPath( '/controls/ms_excel.js')
    await releaseComponentFromPath( '/controls/data_window.js')
    await releaseComponentFromPath( '/controls/ace_editor.js')

    //await releaseComponentFromPath('/controls/container_3d.js')
    //await releaseComponentFromPath( '/controls/item_3d.js')

    await releaseComponentFromPath( '/controls/terminal_ui.js')
    await releaseComponentFromPath( '/controls/osquery_ui.js')
    await releaseComponentFromPath( '/controls/rest_ui.js')
    await releaseComponentFromPath( '/controls/tree_to_table.js')
    await releaseComponentFromPath( '/controls/ducker.js')
    await releaseComponentFromPath( '/controls/table.js')
    await releaseComponentFromPath( '/controls/rh3scale.js')
    await releaseComponentFromPath( '/controls/kubernetes.js')
    await releaseComponentFromPath( '/controls/kafka.js')
    //await releaseComponentFromPath( '/controls/rhfuse.js')
    //await releaseComponentFromPath( '/controls/rhamq.js')
    await releaseComponentFromPath( '/controls/rhdm.js')
    //await releaseComponentFromPath( '/controls/rhpam.js')
    //await releaseComponentFromPath( '/controls/rhdata_grid.js')
    //await releaseComponentFromPath( '/controls/rhopenshift.js')




    //
    // functions
    //

    //await releaseComponentFromPath( '/functions/system.js')
    await releaseComponentFromPath( '/functions/system2.js')
    //await releaseComponentFromPath( '/functions/system3.js')
    await releaseComponentFromPath( '/functions/systemFunctionAppSql.js')

    //
    // UI components
    //
    await releaseComponentFromPath( '/ui_components/comp.js')
    await releaseComponentFromPath( '/ui_components/sqliteEditorComponent.js')
    await releaseComponentFromPath( '/ui_components/keycloakEditorComponent.js')
    await releaseComponentFromPath( '/ui_components/historyViewerComponent.js')
    await releaseComponentFromPath( '/ui_components/controlEditor.js')
    await releaseComponentFromPath( '/ui_components/exportEditorComponent.js')
    await releaseComponentFromPath( '/ui_components/embedAppComponent.js')
    //await releaseComponentFromPath( '/ui_components/simpleDisplayEditorComponent.js')

    //
    // code editors
    //
    await releaseComponentFromPath( '/ui_components/codePlugInVbEditor.js')
    await releaseComponentFromPath( '/ui_components/codePlugInTextEditor.js')

    outputDebug("Loaded main drivers")



    //
    // apps
    //
    await releaseComponentFromPath( '/apps/appEditorV3.js')

    await evalHtmlComponentFromPath( '/apps/homepage.js')
    await evalHtmlComponentFromPath( '/apps/mobilehomepage.js')
    await releaseComponentFromPath( '/apps/yazz_blank.js')

    //await releaseComponentFromPath( '/apps/search.js')
    //await releaseComponentFromPath( '/apps/test.js')
    //await releaseComponentFromPath( '/apps/oculus_go.js')
    //await releaseComponentFromPath( '/apps/nft_art.yazz')
    //await releaseComponentFromPath( '/apps/game.js')
    //await releaseComponentFromPath('/apps/oldhomepage.js')
    //await releaseComponentFromPath( '/apps/multi_vr.vjs')
    //await releaseComponentFromPath( '/apps/hologram.js')
    //await releaseComponentFromPath( '/apps/kinetic.js')
    //await releaseComponentFromPath( '/apps/intro_logo_3d.js')
    //await releaseComponentFromPath( '/apps/listApps.js')
    //await releaseComponentFromPath( '/apps/listPublicApps.js')
    await releaseComponentFromPath( '/apps/vue.js')
    await releaseComponentFromPath( '/apps/bootstrap.js')
    await releaseComponentFromPath( '/apps/databaseReader.js')
    await releaseComponentFromPath( '/apps/todo_app_reader.js')
    await releaseComponentFromPath( '/apps/newSqlApp.js')
    //await releaseComponentFromPath( '/apps/yazzcraft.js')


    let todoRet = await evalHtmlComponentFromPath( '/apps/todo.js')
    let demoTimerRet = await evalHtmlComponentFromPath( '/apps/demo_timer.js')
    await releaseCode(todoRet.codeId)
    await releaseCode(demoTimerRet.codeId)



    //database drivers
    await releaseComponentFromPath( '/controls/postgres.js')
    await releaseComponentFromPath( '/controls/sqlite.js')
    await releaseComponentFromPath( '/controls/yazzSqlite.js')
    await releaseComponentFromPath( '/controls/mysql.js')


    let extraFns = fs.readFileSync( path.join(__dirname, '../src/extraFns.js') ).toString()
    outputDebug("Extra functions code:" )

    await eval("(" + extraFns + "())")

    //
    // non GUI front end apps
    //
    await releaseComponentFromPath( '/apps/rh3scale_app.js')
    await releaseComponentFromPath('/apps/quicksort.js')
    //await releaseComponentFromPath( '/apps/bubblesort.js')
    await releaseComponentFromPath( '/apps/blank_app.js')
    //await evalHtmlComponentFromPath( '/apps/blank_microservice.js')
    //await releaseComponentFromPath( '/apps/demo_microservice.js')
    ////await releaseComponentFromPath( '/apps/echo_microservice.js')
    //await releaseComponentFromPath( '/apps/call_function_microservice.js')
    //await releaseComponentFromPath( '/apps/echo_post_microservice.js')
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
            console.log("Loading Yazz. Please wait a few minutes ... ")
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
            ipcChildReturningCallComponentResponse(
                {
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
function callDriverMethodPart2( findComponentArgs, args, callbackFn ) {

    //console.log("*) called '" + driverName + ":" + methodName + "' with args: " + JSON.stringify(args,null,2))
    let useCallbackIndex = callbackIndex ++
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
function return_add_local_driver_results_msg(msg) {
    //console.log("6 - return_get_search_results: " + msg.returned);
    let rett = eval("(" + msg.success + ")");
    let newCallbackFn = queuedResponses[ msg.seq_num_local ]

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
function ipcChildReturningCallComponentResponse(msg) {

    let new_ws = queuedResponses[ msg.seq_num_parent ]

    sendToBrowserViaWebSocket(
                                 new_ws
                                 ,
                                 {
                                    type:            "ws_to_browser_call_component_results",
                                    value:            msg.result,
                                    seq_num:          msg.seq_num_browser
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
                let stmt = dbsearch.all(
                  "SELECT * FROM system_process_info where  status = 'RUNNING'  AND  yazz_instance_id = ?; "
                  ,
                  [  yazzInstanceId  ]
                  ,

                    function(err, results)
                    {
                        if (results) {
                           let timeNow = new Date().getTime();
                           dbsearch.run("begin exclusive transaction");
                           for (let ii = 0 ; ii < results.length ; ii++ ) {
                               let thisProcess = results[ii]
                               let startTime = thisProcess.running_start_time_ms
                               let duration = timeNow - startTime
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
                let stmt = dbsearch.all(
                  "SELECT * FROM system_process_info where  status = 'RUNNING' and event_duration_ms > ?  and  yazz_instance_id = ?; "
                  ,
                  [  maxJobProcessDurationMs  ,  yazzInstanceId  ]
                  ,
                    function(err, results)
                    {
                        if (results) {
                           dbsearch.run("begin exclusive transaction");
                           for (let ii = 0 ; ii < results.length ; ii++ ) {
                               let thisProcess = results[ii]
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

    let processToUse = null
    let processNames = Object.keys(processesInUse)

    for ( let processNameIndex = 0 ; processNameIndex < processNames.length; processNameIndex ++ ) {

        let actualProcessName   = processNames[ processNameIndex ]
        let isInUse             = processesInUse[ actualProcessName ]

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


            let processName
            if (parentCallId == -1) {
                processName = "forked"
            } else {
                let parentCallDetails = callList[parentCallId]
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
function sendToProcess(  id  ,  parentCallId  ,  callbackIndex, processName  ,  base_component_id  ,  args) {

    let newCallId = nextCallId ++

    callList[  newCallId  ] = {     process_name:       processName,
                                    parent_call_id:     parentCallId        }
    dbsearch.serialize(
        function() {
            dbsearch.run("begin exclusive transaction");
            let runningStartTime = new Date().getTime();
            setProcessToRunning.run( base_component_id, runningStartTime, id, callbackIndex, processName, yazzInstanceId )


            dbsearch.run("commit", function() {
                execute_code_in_exe_child_process({  message_type:       "execute_code_in_exe_child_process" ,
                                child_process_name:  processName,
                                code_id:             id,
                                args:                args,
                                call_id:             newCallId,
                                callback_index:      callbackIndex,
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
            let stmt = dbsearch.all(
                "SELECT base_component_id FROM system_code where id = ? LIMIT 1",
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
             let stmt = dbsearch.all(
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

    if (msg.find_component.code_id) {
       scheduleJobWithCodeId(  msg.find_component.code_id,
                               msg.args,
                               msg.caller_call_id,
                               msg.callback_index)



    } else if (msg.find_component.base_component_id) {
        //console.log("In msg.find_component.base_component_id")
        dbsearch.serialize(
            function() {
                let stmt = dbsearch.all(
                  "SELECT  ipfs_hash as id  FROM  yz_cache_released_components  where  base_component_id = ?; ",

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
function function_call_response (msg) {
//-----------------------------------------------------------------------------------------
//
//                                   function_call_response
//
// This is called to return the response of a call
//
//-----------------------------------------------------------------------------------------

   //console.log("*) Response received at Scheduler ")
   //console.log("*) result generated by call ID: " + msg.called_call_id)
   let callDetails = callList[msg.called_call_id]
   //console.log("*) call details: " + JSON.stringify(msg,null,2))

   if (callDetails == null) {
      console.log("In Scheduler:function_call_response   callList    is not set for : " + JSON.stringify(msg,null,2))
      return
   }
   let parentCallId = callDetails.parent_call_id
   //console.log("*) parent call ID: " + JSON.stringify(parentCallId,null,2))

   let processName
   if (parentCallId == -1) {
       processName = "forked"
   } else {
       let parentCallDetails = callList[parentCallId]
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
async function parseCode(code) {

    let baseComponentIdOfItem = yz.getValueOfCodeString(code,"base_component_id")

    let itemName = yz.getValueOfCodeString(code,"display_name")

    let iconUrl = yz.getValueOfCodeString(code,"logo_url")

    let ipfsHashId = await OnlyIpfsHash.of(code)

    let readWriteStatus = ""
    let rws = yz.getValueOfCodeString(code,"read_only")
    if (rws) {
        if (rws == true) {
            readWriteStatus = "read"
        }
    }

    let componentType = ""
    if (yz.getValueOfCodeString(code,"component_type") == "SYSTEM") {
        componentType = "system"
    } else if (yz.getValueOfCodeString(code,"component_type") == "APP") {
        componentType = "app"
    } else if (yz.getValueOfCodeString(code,"component_type") == "VB") {
        componentType = "component"
    }
    return {
        ipfsHashId: ipfsHashId
        ,
        name: itemName
        ,
        type: componentType
        ,
        logo: iconUrl
        ,
        baseComponentId: baseComponentIdOfItem
        ,
        readWriteStatus: readWriteStatus
    }
}
async function getCommentsForComponent(baseComponentId) {
    let promise = new Promise(async function (returnfn) {

        dbsearch.serialize(
            function () {
                dbsearch.all(
                    " select  " +
                    "     comment, rating , date_and_time " +
                    " from " +
                    "     comments_and_ratings " +
                    " where " +
                    "     base_component_id = ? " +
                    " order by " +
                    "     date_and_time DESC "
                    ,
                    [baseComponentId]
                    ,
                    async function (err, rows) {
                        let returnRows = []
                        if (!err) {
                            try {
                                if (rows.length > 0) {
                                    for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
                                        let thisRow = rows[rowIndex]
                                        if (thisRow.date_and_time) {
                                            returnRows.push(
                                                {
                                                    comment: thisRow.comment
                                                    ,
                                                    rating: thisRow.rating
                                                    ,
                                                    date_and_time: thisRow.date_and_time
                                                })
                                        }
                                    }
                                }


                            } catch (err) {
                                console.log(err);
                                let stack = new Error().stack
                                console.log(stack)
                            } finally {
                                returnfn(returnRows)
                            }

                        }
                    }
                );
            }, sqlite3.OPEN_READONLY)
    })
    let ret = await promise
    return ret
}
async function insertCommentIntoDb(args) {
    let promise = new Promise(async function(returnfn) {

        let promise2 = new Promise(async function(returnfn2) {
            try {
                dbsearch.serialize(function() {
                    dbsearch.run("begin exclusive transaction");
                    stmtInsertComment.run(
                        uuidv1() ,
                        args.baseComponentId ,
                        args.baseComponentIdVersion,
                        args.newComment,
                        args.newRating,
                        args.dateAndTime
                        )
                    dbsearch.run("commit")
                    returnfn2()
                })
            } catch(er) {
                console.log(er)
                returnfn2()
            }
        })
        await promise2


    })
}
async function getUserIdFromYazzCookie(yazzCookie) {
    let sessionId = await getSessionIdFromYazzCookie(yazzCookie)

    let promise = new Promise(async function(returnfn) {
        dbsearch.serialize(
            function() {
                let stmt = dbsearch.all(
                    `select 
                            fk_user_id
                      FROM 
                            sessions
                      where 
                            id  = ? `
                    ,
                    [sessionId]
                    ,

                    function(err, results)
                    {
                        if (results.length > 0) {
                            returnfn(results[0].fk_user_id)
                        }
                        returnfn(null)

                    })
            }, sqlite3.OPEN_READONLY)
    })

    let userId = await promise
    return userId

}
async function getUserId(req) {
    let sessionId = await getSessionId(req)

    let promise = new Promise(async function(returnfn) {
        dbsearch.serialize(
            function() {
                let stmt = dbsearch.all(
                    `select 
                            fk_user_id
                      FROM 
                            sessions
                      where 
                            id  = ? `
                    ,
                    [sessionId]
                    ,

                    function(err, results)
                    {
                        if (results.length > 0) {
                            returnfn(results[0].fk_user_id)
                        }
                        returnfn(null)

                    })
            }, sqlite3.OPEN_READONLY)
    })

    let userId = await promise
    return userId
}
async function getSessionId(req) {
    let promise = new Promise(async function(returnfn) {
        dbsearch.serialize(
            function() {
                let stmt = dbsearch.all(
                    `select 
                            sessions.id 
                      FROM 
                            sessions,cookies
                      where 
                            sessions.id = cookies.fk_session_id
                            and
                            cookie_value = ? `
                            ,
                            [req.cookies.yazz]
                            ,

                    function(err, results)
                    {
                        if (results.length > 0) {
                            returnfn(results[0].id)
                        }
                        returnfn(null)

                    })
            }, sqlite3.OPEN_READONLY)
    })

    let sessionId = await promise
    return sessionId
}
async function getSessionIdFromYazzCookie(yazzCookie) {
    let promise = new Promise(async function(returnfn) {
        dbsearch.serialize(
            function() {
                let stmt = dbsearch.all(
                    `select 
                            sessions.id 
                      FROM 
                            sessions,cookies
                      where 
                            sessions.id = cookies.fk_session_id
                            and
                            cookie_value = ? `
                    ,
                    [yazzCookie]
                    ,

                    function(err, results)
                    {
                        if (results.length > 0) {
                            returnfn(results[0].id)
                        }
                        returnfn(null)

                    })
            }, sqlite3.OPEN_READONLY)
    })

    let sessionId = await promise
    return sessionId
}
async function getCookieRecord(cookieValue) {
    let promise = new Promise(async function(returnfn) {
        dbsearch.serialize(
            function() {
                let stmt = dbsearch.all(
                    `select 
                            id,  created_timestamp, cookie_name, cookie_value, fk_session_id 
                      FROM 
                            cookies
                      where 
                            cookie_value = ? `
                            ,
                    [cookieValue]
                    ,
                    function(err, results)
                    {
                        if (results.length > 0) {
                            returnfn(results[0])
                        } else {
                            returnfn(null)
                        }

                    })
            }, sqlite3.OPEN_READONLY)
    })
    let cookeResult = await promise
    return cookeResult
}
async function createCookieInDb(cookie, hostCookieSentTo, from_device_type) {
    let promise = new Promise(async function(returnfn) {
        try {
            dbsearch.serialize(function() {
                dbsearch.run("begin exclusive transaction");

                let newSessionid = uuidv1()
                let timestampNow = new Date().getTime()
                let anonymousUserId = uuidv1()
                stmtInsertUser.run(anonymousUserId, "ANONYMOUS")
                stmtInsertSession.run(newSessionid,timestampNow,timestampNow, 1, anonymousUserId)

                stmtInsertCookie.run(uuidv1(),timestampNow,"yazz",cookie,newSessionid, hostCookieSentTo, from_device_type)
                dbsearch.run("commit")
                returnfn()
            })
        } catch(er) {
            console.log(er)
            returnfn()
        }
    })
    let ipfsHash = await promise
    return ipfsHash
    return ""
}
async function getRowForCommit(commitId) {
    let commitStructure = null
    let excludeCommitId = null
    let thisCommit = await yz.getQuickSqlOneRow(dbsearch,  "select  *  from   system_code  where   id = ? ", [  commitId  ])
    let getFutureCommitsSql = "select  id  from   system_code  where  parent_id = ? "
    let parentCommits = await yz.getQuickSql(dbsearch,  getFutureCommitsSql, [  commitId  ])

    let getCodeTagsSql= "  select  code_tag, main_score  from  code_tags  where fk_system_code_id = ?  "
    let codeTags = await yz.getQuickSql(dbsearch,  getCodeTagsSql, [  commitId  ])

    if (thisCommit) {
        let changesList = []
        try {
            changesList = JSON.parse(thisCommit.code_changes)
            commitStructure =
                {
                    id: thisCommit.id,
                    ipfs_hash_id: thisCommit.id,
                    creation_timestamp: thisCommit.creation_timestamp,
                    num_changes: thisCommit.num_changes,
                    changes: changesList,
                    base_component_id: thisCommit.base_component_id,
                    parent_commit_id: thisCommit.parent_id,
                    user_id: thisCommit.fk_user_id,
                    descendants: parentCommits,
                    code_tags: codeTags
                }
        } catch (err) {
        }
    }

    return commitStructure
}
async function getPreviousCommitsFor(args) {
    let commitId = args.commitId
    let parentCommitId = args.parentCommitId

    let numPrevious = 100000000
    let returnRows = []

    if (args.numPrevious) {
        numPrevious = args.numPrevious
    }

    if (args.returnRows) {
        returnRows = args.returnRows
    }

    let parentCommitRow = await getRowForCommit( parentCommitId  )


    if (parentCommitRow) {
        returnRows.push(parentCommitRow)
        if (parentCommitRow.parent_commit_id) {
            returnRows = await getPreviousCommitsFor(
                {
                    commitId: parentCommitRow.id
                    ,
                    parentCommitId: parentCommitRow.parent_commit_id
                    ,
                    returnRows: returnRows
                })
        }

        return returnRows
    }
    return []
}
async function getFutureCommitsFor(args) {
    let commitId = args.commitId

    let numPrevious = 100000000
    let returnRows = []

    if (args.numPrevious) {
        numPrevious = args.numPrevious
    }

    if (args.returnRows) {
        returnRows = args.returnRows
    }

    let childCommits = await yz.getQuickSql(dbsearch,"select  *  from   system_code  where   parent_id = ? ", [  commitId  ])

    if (childCommits.length == 0 ) {
        return returnRows
    } else if (childCommits.length == 1 ) {
        let childCommitRow = await getRowForCommit( childCommits[0].id  )
        returnRows.push(childCommitRow)
        returnRows = await getFutureCommitsFor(
            {
                commitId: childCommitRow.id
                ,
                returnRows: returnRows
            })
        return returnRows

    } else if (childCommits.length == 2 ) {
        return returnRows
    }

    return []
}
async function releaseCode(commitId) {
    let codeRecord = await yz.getQuickSqlOneRow(dbsearch,  "select  code  from   system_code  where   id = ? ", [  commitId  ])
    let codeString = codeRecord.code
    let parsedCode = await parseCode(codeString)
    let icon_image_id = "image id"
    let dataString = null
    let id = uuidv1()
    let base_component_id = parsedCode.baseComponentId
    let app_name = parsedCode.name
    let app_description = parsedCode.description
    let logo = parsedCode.logo
    let ipfs_hash = parsedCode.ipfsHashId
    let readWriteStatus = parsedCode.readWriteStatus
    let component_type = parsedCode.type
    let promise = new Promise(async function(returnfn) {

        if (logo) {
            if (logo.startsWith("data:")) {
                let rowhash = crypto.createHash('sha256');
                rowhash.setEncoding('hex');
                rowhash.write(logo);
                rowhash.end();
                icon_image_id = rowhash.read();
                dataString = logo
            } else if (logo.startsWith("http")) {
            } else {

                let fullPath = path.join(__dirname, "../public" + logo)
                let logoFileIn = fs.readFileSync(fullPath);
                dataString = new Buffer(logoFileIn).toString('base64');
                let imageExtension = logo.substring(logo.lastIndexOf(".") + 1)
                let rowhash = crypto.createHash('sha256');
                dataString = "data:image/" + imageExtension + ";base64," + dataString
                rowhash.setEncoding('hex');
                rowhash.write(dataString);
                rowhash.end();
                icon_image_id = rowhash.read();
            }
        }

        let componentListRecord = await yz.getQuickSqlOneRow(dbsearch, "select * from yz_cache_released_components where base_component_id = ?", [base_component_id])
        if (!componentListRecord) {
            dbsearch.serialize(function () {
                dbsearch.run("begin exclusive transaction");
                dbsearch.run("commit", function () {
                    dbsearch.serialize(function () {
                        dbsearch.run("begin exclusive transaction");
                        stmtInsertReleasedComponentListItem.run(
                            id, base_component_id, app_name, component_type,
                            app_description, icon_image_id, ipfs_hash, '',
                            readWriteStatus, codeString)
                        stmtInsertIconImageData.run(icon_image_id, dataString)
                        dbsearch.run("commit")
                        returnfn()
                    })
                })

            })
        } else {
            dbsearch.serialize(function () {
                dbsearch.run("begin exclusive transaction");
                dbsearch.run("commit", function () {
                    dbsearch.serialize(function () {
                        dbsearch.run("begin exclusive transaction");
                        stmtUpdateReleasedComponentList.run(ipfs_hash, base_component_id)
                        stmtInsertIconImageData.run(icon_image_id, dataString)
                        dbsearch.run("commit")
                        returnfn()
                    })
                })

            })
        }
    })
    let ret2 = await promise
    return ret2

}
async function copyAppshareApp(args) {
    /*
    base_component_id("copyApp")
    description("copyAppshareApp function")
    load_once_from_file(true)
    only_run_on_server(true)
    */
    console.log("Called async function copyAppshareApp(args) {")
    let userId = args.user_id

    async function saveCopyOfAppWithDependencies(argsBaseComponentId, newBaseid, parentHashId, code, returnfn, newDisplayName) {

        let listOfSubComponentsRes = await yz.getSubComponents(code)
        var listOfSubComponents = []
        for (var yuy = 0; yuy < listOfSubComponentsRes.length ; yuy++ ) {

            listOfSubComponents.push( listOfSubComponentsRes[yuy].child_base_component_id )

        }
        console.log("    async function saveCopyOfAppWithDependencies( " + argsBaseComponentId)
        console.log("              newBaseid:           " + newBaseid)
        console.log("              parentHashId:        " + parentHashId)
        console.log("              argsBaseComponentId: " + argsBaseComponentId)
        console.log("              userId:              " + userId)
        //console.log("              code:                " + code)

        let dbToCopyFrom = argsBaseComponentId
        let altDbUsed = yz.getValueOfCodeString(code,"use_db")
        if (altDbUsed) {
            dbToCopyFrom = altDbUsed
        }

        let saveret = await yz.saveCodeV3(
            dbsearch,
            code,
            {
                sub_components:         listOfSubComponents,
                copy_db_from:           dbToCopyFrom,
                save_html:              true,
                //let userid = await getUserId(req)
                //let optionsForSave = req.body.value.options
                userId: userId
            })
        let codeIdRet = null
        if (saveret) {
            codeIdRet =  saveret.code_id
        }
        console.log("                    after save()")
        console.log("                                    saveret.code_id:      " + saveret.code_id)
        console.log("                                    newDisplayName:       " + newDisplayName)
        console.log("                                    newBaseid:            " + newBaseid)
        console.log("                                    codeIdRet:            " + codeIdRet)

        returnfn({
            new_display_name:   newDisplayName,
            base_component_id:  newBaseid,
            code_id:            codeIdRet
        })

    }





    var promise = new Promise(async function(returnfn) {

        var argsBaseComponentId = args.base_component_id
        var argsNewAppId        = args.new_base_component_id
        var argsCodeId          = args.code_id==""?null:args.code_id

        console.log("    argsBaseComponentId: " + argsBaseComponentId)
        console.log("    argsCodeId: "          + argsCodeId)
        console.log("    argsNewAppId:        " + argsNewAppId)
        console.log("    userId:              " + userId)

        let results = []
        if (argsCodeId) {

            results = await yz.getQuickSql(
                dbsearch
                ,
                "SELECT    id, code, display_name as display_name    FROM    system_code   where    " +
                " id = ? ;  "
                ,
                [argsCodeId])
        } else if (argsBaseComponentId) {

            results = await yz.getQuickSql(
                dbsearch
                ,
                "SELECT    ipfs_hash as id, code, component_name as display_name    FROM    yz_cache_released_components   where    " +
                " base_component_id = ? ;  "
                ,
                [argsBaseComponentId])
            if (results.length == 0 ) {
                results = await yz.getQuickSql(
                    dbsearch
                    ,
                    "SELECT    id, code, display_name    FROM    system_code   where    " +
                    " base_component_id = ? order by   creation_timestamp desc   limit 1 ;  "
                    ,
                    [argsBaseComponentId])
            }

        }


        if (results.length > 0) {
            var code = results[0].code
            if (code) {
                code = code.toString()
            }
            var newBaseid =  ""
            if (argsNewAppId) {
                newBaseid = argsNewAppId
            } else {
                newBaseid = "COMP_" + uuidv1().replace(/\-/g, '');
            }
            console.log("    newBaseid:           " + newBaseid)




            var oldDisplayName = results[0].display_name
            var parentHashId = results[0].id
            var newDisplayName = "Copy of " + oldDisplayName
            console.log("    parentHashId:        " + parentHashId)
            code = yz.deleteCodeString(code, "load_once_from_file")
            code = yz.deleteCodeString(code, "read_only")
            code = yz.deleteCodeString(code, "visibility")

            var componentType = yz.getValueOfCodeString(code, "component_type")
            if (componentType) {
            }
            if (componentType == "SYSTEM") {
                code = yz.deleteCodeString(code, "component_type")
                code = yz.insertCodeString(code, "component_type", "APP")
            }


            var formEditor = yz.getValueOfCodeString(code, "formEditor", ")//formEditor")
            if (formEditor) {
                formEditor.id = newBaseid
                code = yz.deleteCodeString(code, "formEditor", ")//formEditor")
                code = yz.insertCodeString(code, "formEditor", formEditor, ")//formEditor")

                code = yz.deleteCodeString(code, "display_name")
                code = yz.insertCodeString(code, "display_name", newDisplayName)
            }
            code = yz.insertCodeString(code, "visibility", "PRIVATE")


            let previousBaseComponentId = yz.getValueOfCodeString(code, "base_component_id")
            code = yz.deleteCodeString(code, "base_component_id")
            code = yz.insertCodeString(code, "base_component_id", newBaseid)



            //
            // this code goes after the "base_component_id" code, otherwise the
            // "parent_base_component_id" get deleted in a rare bug
            //
            console.log("    previousBaseComponentId:  "          + previousBaseComponentId)
            console.log("    parent_base_component_id: "          + newBaseid)
            if (yz.getValueOfCodeString(code, "base_component_id_derived_from")) {
                code = yz.deleteCodeString(code, "base_component_id_derived_from")
            }
            if (previousBaseComponentId != newBaseid) {
                code = yz.insertCodeString(code, "base_component_id_derived_from", previousBaseComponentId)
                console.log(" INSERTED *     parent_base_component_id: "          + previousBaseComponentId)
            }




            //hack city - Vue and component strings are separated as otherwise they mark the
            // code as UI code
            var vueIndex = code.indexOf("Vue" + ".component")
            if (vueIndex != -1) {
                var vueIndexEnd = code.substring(vueIndex).indexOf(",")
                if (vueIndexEnd) {
                    code = code.substring(0, vueIndex + 14) + "'" + newBaseid + "'" + code.substring(vueIndex + vueIndexEnd)
                }
            }

            console.log("    newDisplayName:      " + newDisplayName)

            await saveCopyOfAppWithDependencies(argsBaseComponentId, newBaseid, parentHashId, code, returnfn, newDisplayName)
        }

    })
    var ret = await promise


    return ret
}
