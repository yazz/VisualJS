#!/usr/bin/env node

//backtick = `
//--centralhost 192.168. --centralhostport 80 --centralhosthttps false


let sqlite3
if (process.versions.bun) {
    sqlite3 =  require("bun:sqlite");
} else {
    sqlite3 =  require("sqlite3");
}

const useragent = require('express-useragent');
let cookieParser = require('cookie-parser')
let Web3 = require('web3')
let web3 = new Web3()
let isIPFSConnected = false
let yz = require('./yazz_helper_module.js')

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
let fork = require('node:child_process');
let fs                                  = require2('fs');
let ip                                  = require2('ip');
let isWin                               = /^win/.test(process.platform);
let mainNodeProcessStarted              = false;
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
let pidusage                            = require2("pidusage");
let mkdirp                              = require2('mkdirp')
let uuidv1                              = require2('uuid/v1');
let express                             = require2('express')
let http                                = require2('http')
let https                               = require2('https');
let app                                 = express()
let startupType                         = null
let startupDelay                        = 0
let yazzInstanceId                      = uuidv1()
yz.yazzInstanceId                       = yazzInstanceId
let certOptions                         = null
let callbackIndex                       = 0;
let callbackList                        = new Object()
let stmtInsertSession;
let stmtInsertSessionWithNewUserId;
let stmtInsertMetaMaskLogin;
let stmtSetMetaMaskLoginSuccedded;
let stmtInsertUser;
let stmtInsertCookie
let setProcessToRunning;
let setProcessToIdle;
let setProcessRunningDurationMs;
let insertIntoProcessTable              = null;
let updateProcessTable                  = null;
let fileURLToPath =require('node:url').fileURLToPath;
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
let compression                         = require2('compression')
let program                             = require2('commander');
let bodyParser                          = require2('body-parser');
let multer                              = require2('multer');
let cors                                = require2('cors')

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
//const apiMetrics                        = require2('prometheus-api-metrics');
//app.use(apiMetrics())
//const Prometheus                        = require2('prom-client');
//const yazzMemoryUsageMetric             = new Prometheus.Gauge({
//  name: 'yazz_total_memory_bytes',
//  help: 'Total Memory Usage'
//});
//const yazzProcessMainMemoryUsageMetric  = new Prometheus.Gauge({
//  name: 'yazz_node_process_main_memory_bytes',
//  help: 'Memory Usage for Yazz NodeJS process "main"'
//});





// ------------------------------------------------------------
// This checks whether we can successfully connect to
// IPFS by sending a test string and seeing if
// it writes successfully
// ------------------------------------------------------------

const ipfsAPI = require('ipfs-api');

//const ipfs = ipfsAPI('ipfs.infura.io', '5001', {protocol: 'https'})
const ipfs = ipfsAPI('127.0.0.1', '5001', {protocol: 'http'})
//const ipfs = ipfsAPI('ipfs.io', '5001', {protocol: 'https'});



/*                HTTPHeaders: {
                    "Access-Control-Allow-Origin":      [
                                                            "http://127.0.0.1:5002",
                                                            "http://192.168.5.66:5002",
                                                            "http://localhost:3000",
                                                            "http://127.0.0.1:5001",
                                                            "https://webui.ipfs.io"
                                                        ]
                    ,
                    "Access-Control-Allow-Methods":     ["PUT", "POST"]
*/

    //
    //helia
    //


console.log("Starting...")
console.log("Testing IPFS...")

let testBuffer = new Buffer("Test IPFS Connection String");
yz.isIPFSConnected = isIPFSConnected

ipfs.files.add(testBuffer, function (err, file) {

    // we couldn't connect to IPFS

    if (err) {
        console.log(" ERROR!! ***** IPFS did not connect *******: " + err)
        isIPFSConnected = false
        yz.isIPFSConnected = isIPFSConnected



    // we made a successful conection to IPFS

    } else {
        console.log(" Success, IPFS connected :)  *******")
        isIPFSConnected = true
        yz.isIPFSConnected = isIPFSConnected


        console.log("....................................Err: " + err);
        //console.log("....................................file: " + JSON.stringify(file,null,2))
        let thehash = file[0].hash
        //const validCID = "QmRntL1Gam7vDMNSsHbcUrWjueMJdJsBgF1wn1bx5pYcfo"
        const validCID = thehash

        ipfs.files.get(validCID, function (err, files) {
            files.forEach((file) => {
                //console.log("....................................file.path: " + file.path)
                //console.log(file.content.toString('utf8'))
                //console.log("....................................file.path: " + file.path)
            })
        })
    }
})



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
      .option('-a,          --runapp                    [runapp]',                  'Run the app with ID as the homepage (default not set)                              [runapp]',                  null)
      .option('-b,          --virtualprocessors         [virtualprocessors]',       'How many virtual processors to run (default 8 processors)                          [virtualprocessors]',       8)
      .option('-c,          --runhtml                   [runhtml]',                 'Run using a local HTML page as the homepage (default not set)                      [runhtml]',                 null)
      .option('-de,         --deleteonexit              [deleteonexit]',            'Delete database files on exit (default true)                                       [deleteonexit]',            'true')
      .option('-hib,        --hideimportbuttons         [hideimportbuttons]',       'Allow to hide the buttons to load files (default true)                             [hideimportbuttons]',       'true')
      .option('-e,          --debug                     [debug]',                   'Allow to run NodeJS in debug mode (default false)                                  [debug]',                   'false')
      .option('-dui,        --debugui                   [debugui]',                 'Allows the UI Alasql DB to be replicated to server side Sqlite DB (default false)  [debugui]',                 'false')
      .option('-f,          --cacert1                   [cacert1]',                 'Public HTTPS CA certificate 1                                                      [cacert1]',                 null)
      .option('-ipfs_folder,--ipfs_folder               [ipfs_folder]',             'Public folder to use as IPFS Cache                                                 [ipfs_folder]',             null)
      .option('-g,          --cacert2                   [cacert2]',                 'Public HTTPS CA certificate 2                                                      [cacert2]',                 null)
      .option('-h,          --loadjsfile                [loadjsfile]',              'Load the following JS from a file (default not set)                                [loadjsfile]',              null)
      .option('-i,          --cacert3                   [cacert3]',                 'Public HTTPS CA certificate 3                                                      [cacert3]',                 null)
      .option('-j,          --host                      [host]',                    'Server address of the host (default )                                              [host]',                    '')
      .option('-ch,         --centralhost               [centralhost]',             'Server address of the central host (default  empty)                                [centralhost]',             '')
      .option('-och,        --ocentralhost              [ocentralhost]',            'Dummy - do not use - Server address of the central host (default  empty)           [ocentralhost]',            '')
      .option('-k,          --statsinterval             [statsinterval]',           'Allow to show debug info every x seconds (default 10 seconds)                      [statsinterval]',           10)
      .option('-l,          --showstats                 [showstats]',               'Allow to show stats debug info (default false)                                     [showstats]',               'false')
      .option('-m,          --showprogress              [showprogress]',            'Show progress when starting Yazz (default false)                                   [showprogress]',            'false')
      .option('-mjms,       --maxJobProcessDurationMs   [maxJobProcessDurationMs]', 'Maximum time to wait for a job to complete (default 10000 ms)                      [maxJobProcessDurationMs]', 10000)
      .option('-n,          --locked                    [locked]',                  'Allow server to be locked/unlocked on start up (default true)                      [locked]',                  'true')
      .option('-o,          --maxprocessesretry         [maxprocessesretry]',       'Number of processes to retry when all cores are busy (default 10 processes)        [maxprocessesretry]',       10)
      .option('-ph,         --public                    [public]',                  'Public HTTPS certificate                                                           [public]',                  null)
      .option('-q,          --port                      [port]',                    'Which port should I listen on? (default 80)                                        [port]',                    parseInt)
      .option('-r,          --https                     [https]',                   'Run using a HTTPS (default is none)                                                [https]',                   'none')
      .option('-s,          --hostport                  [hostport]',                'Server port of the host (default -1)                                               [hostport]',                -1)
      .option('-sm,         --synctomaster              [synctomaster]',            'Allow server to be synced to the master server (default true)                      [synctomaster]',            'true')
      .option('-cp,         --centralhostport           [centralhostport]',         'Server port of the central host (default -1)                                       [centralhostport]',         -1)
      .option('-cs,         --centralhosthttps          [centralhosthttps]',        'Central host uses HTTPS? (default none)                                            [centralhosthttps]',        'true')
      .option('-ocp,        --ocentralhostport          [ocentralhostport]',        'Dummy - do not use - Server port of the central host (default -1)                  [ocentralhostport]',        -1)
      .option('-ocs,        --ocentralhosthttps         [ocentralhosthttps]',       'Dummy - do not use - Central host uses HTTPS? (default none)                       [ocentralhosthttps]',       'none')
      .option('-t,          --usehost                   [usehost]',                 'Use host name                                                                      [usehost]',                 null)
      .option('-u,          --loadjsurl                 [loadjsurl]',               'Load the following JS from a URL (default not set)                                 [loadjsurl]',               null)
      .option('-w,          --deleteonstartup           [deleteonstartup]',         'Delete database files on startup (default true)                                    [deleteonstartup]',         'false')
      .option('-x,          --private                   [private]',                 'Private HTTPS key                                                                  [private]',                 null)
      .option('-y,          --showdebug                 [showdebug]',               'Allow to show debug info (default false)                                           [showdebug]',               'false')
      .option('-z,          --loadjscode                [loadjscode]',              'Load the following JS from the command line (default not set)                      [loadjscode]',              null)
      .option('-lh,         --useselfsignedhttps        [useselfsignedhttps]',      'Use self signed HTTPS for local development (default false)                        [useselfsignedhttps]',      'false')
      .option('-jc,         --jaegercollector           [jaegercollector]',         'jaeger collector endpoint (default not set) eg: http://localhost:14268/api/traces  [jaegercollector]',         null)
      .parse(process.argv);
} else {
    program.host                = ''
    program.hostport            = -1
    program.centralhost         = "yazz.com"
    yz.centralhost              = program.centralhost
    program.centralhostport     = ''
    yz.centralhostport          = program.centralhostport
    program.locked              = 'true'
    program.synctomaster        = 'true'
    program.debug               = 'false'
    program.debugui             = 'false'
    program.deleteonexit        = 'true'
    program.deleteonstartup     = 'false'
    program.runapp              = null
    program.loadjsurl           = null
    program.loadjsfile          = null
    program.runhtml             = null
    program.https               = 'none'
    program.centralhosthttps    = 'true'
    program.usehost             = null
    program.hideimportbuttons   = true
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
yz.useHttps = useHttps
envVars.USEHTTPS = useHttps
console.log("$USEHTTPS = " + envVars.USEHTTPS)
// --------------------------------------
// sort out the central host IP settings
// --------------------------------------
let centralHost = "yazz.com"
let centralHostPort = 80
if (program.centralhost == "") {
    centralHost     = "yazz.com"
    yz.centralhost  = "yazz.com"
} else {
    centralHost     = program.centralhost
    yz.centralhost  = program.centralhost
}
envVars.CENTRALHOST = program.centralhost
console.log("$CENTRALHOST = " + envVars.CENTRALHOST)
if (program.centralhostport != -1) {
    centralHostPort     = program.centralhostport
    yz.centralhostport  = program.centralhostport
} else {
    centralHostPort     = 443
    yz.centralhostport  = 443
}

envVars.CENTRALHOSTPORT = program.centralhostport
console.log("$CENTRALHOSTPORT = " + envVars.CENTRALHOSTPORT)
let centralHostHttps = true
yz.centralhosthttps = true
if ((program.centralhosthttps == 'none') || (program.centralhosthttps == 'false')) {
    centralhosthttps = false
    yz.centralhosthttps = false
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
let debugUi = false;
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
if (program.debugui == 'true') {
    debugUi = true;
    console.log("       debug ui: true" );
} else {
    console.log("       debug ui: false" );
};
envVars.DEBUGUI = debugUi
let deleteOnExit = (program.deleteonexit == 'true');
outputDebug("deleteOnExit: " + deleteOnExit)
let deleteOnStartup = (program.deleteonstartup == 'true');
outputDebug("deleteOnStartup: " + deleteOnStartup)
locked = (program.locked == 'true');
let syncToMaster = (program.synctomaster == 'true')
yz.syncToMaster = syncToMaster
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
    yz.useHttps = useHttps
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
let shuttingDown = false;
let globalStartTimer = new Date().getTime()
let globalEndTimer = new Date().getTime()
let globalTimerCounter = 0


// set up the processes
function        setUpChildListeners                     (  processName  , fileName  , debugPort  ) {

    forkedProcesses[processName].on('close', async function() {
        if (!shuttingDown) {
            outputDebug("Child process " + processName + " exited.. restarting... ")



            let stmtInsertProcessError = dbsearch.prepare(  ` insert into
                                                                  level_8_system_process_errors
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
                                                  base_component_id:     msg.base_component_id,
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
function        setupForkedProcess                      (  processName  ,  fileName  ,  debugPort  ) {
//------------------------------------------------------------------------------
//
//
//
//
//
//------------------------------------------------------------------------------
    //console.log("electon.js trying to setup forked process: " + processName)
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
    //console.log("forkedProcessPath: " + forkedProcessPath)
    forkedProcesses[  processName  ] = fork.fork(
                                            forkedProcessPath,
                                            [],
                                            {
                                                execArgv:   debugArgs,
                                                env:        {}
                                            });


    // hack city!!!
    // we have to use a timeout here as when we switch to using NodeJs imports
    // in ESM6 then child processes did not work properly at first
    setTimeout(async function() {

        setUpChildListeners(processName, fileName, debugPort);




        for (let i=0;i<executionProcessCount; i++ ) {
            let exeProcName = "forkedExeProcess" + i
            if (processName == exeProcName) {
                //console.log("electron.js calling 'init' on: " + exeProcName)

                forkedProcesses[exeProcName].send({  message_type:          "init" ,
                                                     user_data_path:        userData,
                                                     child_process_name:    exeProcName,
                                                     show_debug:            showDebug,
                                                     show_progress:         showProgress,
                                                     yazz_instance_id:      yazzInstanceId,
                                                     jaeger_collector:      jaegercollector,
                                                     env_vars:              envVars
                                                  });

          }
        }

        outputDebug("Started subprocess '" + processName + "' ")
    },200)

}

// networking helper to send data to the browser via websockets
function        sendOverWebSockets                      (  data  ) {
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
function        sendToBrowserViaWebSocket               (  aws  ,  msg  ) {
// ============================================================
// This sends a message to a specific websocket
// ============================================================
    aws.emit(msg.type,msg);
}

// JS helper fns
function        isNumber                                (  n  ) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}
function        isLocalMachine                          (  req  ) {
    if ((req.ip == '127.0.0.1') || (hostaddress == req.ip) || (hostaddress == "0.0.0.0")) {  // this is the correct line to use
        //if (req.ip == '127.0.0.1')  {      // this is used for debugging only so that we can deny access from the local machine
        return true;
    };
    return false;
}
function        canAccess                               (  req  ,  res  ) {
//------------------------------------------------------------------------------
// test if allowed
//------------------------------------------------------------------------------
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
function        runOnPageExists                         (  req  ,  res  ,  homepage  ) {

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
function        isRequestFromMobile                     (  req  ) {
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
function        bytesToMb                               (  bytes  ) {
    return (bytes / 1024 ) / 1024
}
function        getChildMem                             (  childProcessName  ,  stats  ) {
    let memoryused = 0
    if (stats) {
        memoryused = stats.memory ;
        totalMem += memoryused
    }
    if (showStats) {
        outputDebug(`${childProcessName}: ${Math.round(bytesToMb(memoryused) * 100) / 100} MB`);
    }
}
function        usePid                                  (  childProcessName  ,  childprocess  ) {
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
            //yazzMemoryUsageMetric.set(totalMem)

        }
    });

}
function        resetTimer                              (  messageToStart  ) {
    console.log("Starting timer for: " + messageToStart)
    globalStartTimer = new Date().getTime()
    globalTimerCounter = 0
}
function        showTimer                               (  optionalMessage  ) {
    globalEndTimer = new Date().getTime()
    globalTimerCounter ++
    let theTimerText = optionalMessage
    if (!theTimerText) {
        theTimerText = "" + globalTimerCounter
    }
    console.log("    Elapsed time in milliseconds: " + theTimerText + " : "+ (globalEndTimer - globalStartTimer))
}

// startup and shutdown
function        shutDown                                (  ) {
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
function        deleteYazzDataWindows                   (  dddd  ) {
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
function        deleteYazzDataV2                        (  dddd  ) {

    if ( fs.existsSync( dddd ) ) {
        outputDebug("----------------------------------")
        //outputDebug("Before delete :" + ls(dddd))
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
function        deleteYazzData                          (  dddd  ) {
    fork.exec('sleep 3 && cd "' + dddd + '" && rm -rf app_dbs apps uploads files *.visi*', function(err, stdout, stderr) {
        if (err) {
            // node couldn't execute the command
            return;
            }
        })
}
function        getPort                                 (  ) {
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
async function  checkForJSLoaded                        (  ) {
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
                let baseComponentIdForUrl = yz.helpers.getValueOfCodeString(data, "base_component_id")
                outputDebug("baseComponentIdForUrl:" + baseComponentIdForUrl);
                if (!isValidObject(baseComponentIdForUrl)) {
                    baseComponentIdForUrl = loadjsurl.replace(/[^A-Z0-9]/ig, "_");
                }
                let jsCode = data
                outputDebug("*********** Trying to load loadjsurl code *************")
                 (async function() {await yz.saveCodeV3(dbsearch,
                                                        data,
                                                        {
                                                            make_public: true,
                                                            save_html:   true
                                                        })} ) ()

                runapp = baseComponentIdForUrl
                startupType = "RUN_SERVER_CODE"
                startupDelay = 1000
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
            let baseComponentIdForFile = yz.helpers.getValueOfCodeString(data2, "base_component_id")
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
             //console.log("frontEndCode: " + frontEndCode)
             //console.log("runapp: " + runapp)
             //console.log("inputStdin: " + inputStdin)
             startupType = "RUN_SERVER_CODE"
             startupDelay = 1000
             returnFn()

         } else if (isValidObject(loadjscode)) {
             outputDebug("*********** Using loadjscode ************")
             setUpSql()
             let data2 = loadjscode
             let baseComponentIdForCode = yz.helpers.getValueOfCodeString(data2, "base_component_id")
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
              //console.log("runapp: " + runapp)
              //console.log("inputStdin: " + inputStdin)
              startupType = "RUN_SERVER_CODE"
              startupDelay = 1000
              returnFn()

         } else {
             returnFn()

         }
     })
     let ret = await promise


     return
}
async function  finalizeYazzLoading                     (  ) {
    setUpSql();
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

    systemReady = true
}
async function  setUpComponentsLocally                  (  ) {
//------------------------------------------------------------------------------
//
//
//
//
//
//------------------------------------------------------------------------------
    //await evalComponentFromPath('/glb.vjs')
    //await evalComponentFromPath('/csv.vjs')
    //await evalComponentFromPath('/glb.vjs')
    //await evalComponentFromPath('/excel.vjs')
    //await evalComponentFromPath( '/word.vjs')
    //await evalComponentFromPath('/pdf.vjs')
    //await evalComponentFromPath('/outlook2012.vjs')
    //await evalComponentFromPath( '/sqlite.vjs')
    //await evalComponentFromPath('/mysql.vjs')
    //await evalComponentFromPath( '/oracle.vjs')
    //await evalComponentFromPath( '/testdriver.vjs')
    //await evalComponentFromPath( '/file_uploader.vjs')



    //
    // services
    //
    if (isWin) {
        //await evalComponentFromPath( '/services/powershell.vjs')
    }
    await releaseComponentFromPath( '/services/commandLine.vjs')
    await releaseComponentFromPath( '/services/commandLine2.vjs')
    //await releaseComponentFromPath('/services/test_job.vjs')
    //await releaseComponentFromPath('/services/kafka_service.vjs')
    //await releaseComponentFromPath('/services/activemq_service.vjs')

    //await releaseComponentFromPath( '/services/web_preview.vjs')
    //await releaseComponentFromPath( '/services/spreadsheet_preview.vjs')
    //await releaseComponentFromPath( '/services/csv_preview.vjs')
    //await releaseComponentFromPath( '/services/doc_preview.vjs')

    await releaseComponentFromPath( '/services/serverDriveList.vjs')
    await releaseComponentFromPath( '/services/serverFolderHierarchyList.vjs')
    await releaseComponentFromPath( '/services/serverGetHomeDir.vjs')
    await releaseComponentFromPath( '/services/serverFileList.vjs')
    await releaseComponentFromPath( '/services/serverFolderContents.vjs')
    await releaseComponentFromPath( '/services/serverFolderContentsV2.vjs')
    await releaseComponentFromPath( '/services/compile_solidity.vjs')
    await releaseComponentFromPath( '/services/serverDatabaseStuff.vjs')
    //await releaseComponentFromPath( '/services/serverDockerStuff.vjs')
    await releaseComponentFromPath( '/services/serverTerminalStuff.vjs')


    await releaseComponentFromPath( '/services/postgres_server.vjs')
    await releaseComponentFromPath( '/services/access_server.vjs')
    await releaseComponentFromPath( '/services/excel_server.vjs')

    await releaseComponentFromPath( '/services/rest_call_service.vjs')
    await releaseComponentFromPath( '/services/rest_call_service_v2.vjs')
    await releaseComponentFromPath( '/services/json_traverse_service.vjs')
    await releaseComponentFromPath( '/services/json_filter_service.vjs')


    //
    // debug controls
    //
    //await releaseComponentFromPath( '/controls/bug_vue.vjs')

    //
    // controls
    //
    await releaseComponentFromPath( '/controls/chart.vjs')
    await releaseComponentFromPath( '/controls/image.vjs')
    await releaseComponentFromPath( '/controls/label.vjs')

    await releaseComponentFromPath( '/controls/yazzSqlite.vjs')
    await releaseComponentFromPath( '/controls/database.vjs')

    //
    await releaseComponentFromPath( '/controls/input.vjs')

    await releaseComponentFromPath( '/controls/group.vjs')
    await releaseComponentFromPath( '/controls/button.vjs')

    await releaseComponentFromPath( '/controls/map.vjs')

    await releaseComponentFromPath( '/controls/checkbox.vjs')
    await releaseComponentFromPath( '/controls/radiobutton.vjs')
    await releaseComponentFromPath( '/controls/dropdown.vjs')
    await releaseComponentFromPath( '/controls/list.vjs')
    await releaseComponentFromPath( '/controls/horiz_scroll.vjs')
    await releaseComponentFromPath( '/controls/vert_scroll.vjs')
    await releaseComponentFromPath( '/controls/timer.vjs')
    await releaseComponentFromPath( '/controls/drive_list.vjs')
    await releaseComponentFromPath( '/controls/folder_list.vjs')
    await releaseComponentFromPath( '/controls/file_list.vjs')
    await releaseComponentFromPath( '/controls/shapes.vjs')
    await releaseComponentFromPath( '/controls/line.vjs')
    await releaseComponentFromPath( '/controls/draw.vjs')
    await releaseComponentFromPath( '/controls/mixer.vjs')
    await releaseComponentFromPath( '/controls/ms_access.vjs')
    await releaseComponentFromPath( '/controls/ms_excel.vjs')
    await releaseComponentFromPath( '/controls/data_window.vjs')
    await releaseComponentFromPath( '/controls/ace_editor.vjs')

    //await releaseComponentFromPath('/controls/container_3d.vjs')
    //await releaseComponentFromPath( '/controls/item_3d.vjs')

    await releaseComponentFromPath( '/controls/terminal_ui.vjs')
    await releaseComponentFromPath( '/controls/osquery_ui.vjs')
    await releaseComponentFromPath( '/controls/rest_ui.vjs')
    await releaseComponentFromPath( '/controls/tree_to_table.vjs')
    await releaseComponentFromPath( '/controls/ducker.vjs')
    await releaseComponentFromPath( '/controls/table.vjs')
    await releaseComponentFromPath( '/controls/rh3scale.vjs')
    await releaseComponentFromPath( '/controls/kubernetes.vjs')
    await releaseComponentFromPath( '/controls/kafka.vjs')
    //await releaseComponentFromPath( '/controls/rhfuse.vjs')
    //await releaseComponentFromPath( '/controls/rhamq.vjs')
    await releaseComponentFromPath( '/controls/rhdm.vjs')
    //await releaseComponentFromPath( '/controls/rhpam.vjs')
    //await releaseComponentFromPath( '/controls/rhdata_grid.vjs')
    //await releaseComponentFromPath( '/controls/rhopenshift.vjs')


    await releaseComponentFromPath( '/controls/metamask.vjs')
    await releaseComponentFromPath( '/controls/evm_contract.vjs')
    await releaseComponentFromPath( '/controls/component_builder.vjs')
    await releaseComponentFromPath( '/controls/evm_demo_count_contract.vjs')



    //
    // functions
    //

    //await releaseComponentFromPath( '/all_system_components/system.vjs')
    await releaseComponentFromPath( '/all_system_components/system2.vjs')
    //await releaseComponentFromPath( '/all_system_components/system3.vjs')

    //
    // UI components
    //
    await releaseComponentFromPath( '/all_system_components//comp.vjs')
    await releaseComponentFromPath( '/all_system_components//sqliteEditorComponent.vjs')
    await releaseComponentFromPath( '/all_system_components//appSqliteEditorComponent.vjs')
    await releaseComponentFromPath( '/all_system_components//keycloakEditorComponent.vjs')
    await releaseComponentFromPath( '/all_system_components//deliverComponentScreen.vjs')
    await releaseComponentFromPath( '/all_system_components//environmentsEditor.vjs')
    await releaseComponentFromPath( '/all_system_components//iconEditorComponent.vjs')
    await releaseComponentFromPath( '/all_system_components//controlEditor.vjs')
    await releaseComponentFromPath( '/all_system_components//exportEditorComponent.vjs')
    await releaseComponentFromPath( '/all_system_components//embedAppComponent.vjs')
    //await releaseComponentFromPath( '/all_system_components//simpleDisplayEditorComponent.vjs')

    //
    // code editors
    //
    await releaseComponentFromPath( '/all_system_components//codePlugInVbEditor.vjs')
    await releaseComponentFromPath( '/all_system_components//codePlugInTextEditor.vjs')

    outputDebug("Loaded main drivers")



    //
    // apps
    //
    await releaseComponentFromPath( '/all_system_components/appEditorV3.vjs')

    await evalHtmlComponentFromPath( '/apps/appstore.vjs')
    await releaseComponentFromPath( '/all_system_components/yazz_blank.vjs')
    await releaseComponentFromPath( '/all_system_components/control_preview_container_app.vjs')

    //await releaseComponentFromPath( '/apps/search.vjs')
    //await releaseComponentFromPath( '/apps/test.vjs')
    //await releaseComponentFromPath( '/apps/oculus_go.vjs')
    //await releaseComponentFromPath( '/apps/nft_art.vjs')
    //await releaseComponentFromPath( '/apps/game.vjs')
    //await releaseComponentFromPath('/apps/oldappstore.vjs')
    //await releaseComponentFromPath( '/apps/multi_vr.vjs')
    //await releaseComponentFromPath( '/apps/hologram.vjs')
    //await releaseComponentFromPath( '/apps/kinetic.vjs')
    //await releaseComponentFromPath( '/apps/intro_logo_3d.vjs')
    //await releaseComponentFromPath( '/apps/listApps.vjs')
    //await releaseComponentFromPath( '/apps/listPublicApps.vjs')
    await releaseComponentFromPath( '/apps/vue.vjs')
    await releaseComponentFromPath( '/apps/bootstrap.vjs')
    await releaseComponentFromPath( '/apps/databaseReader.vjs')
    await releaseComponentFromPath( '/apps/todo_app_reader.vjs')
    await releaseComponentFromPath( '/apps/newSqlApp.vjs')
    //await releaseComponentFromPath( '/apps/yazzcraft.vjs')


    let todoRet = await evalHtmlComponentFromPath( '/apps/todo.vjs')
    let demoTimerRet = await evalHtmlComponentFromPath( '/apps/demo_timer.vjs')

    let releaseId = await yz.releaseCode( dbsearch, todoRet.codeId , {localOnly: true})
    await yz.createContentFromLevel2Record({db: dbsearch, type: "RELEASE", id: releaseId.value.id, scope: "LOCAL"})

    releaseId = await yz.releaseCode( dbsearch,  demoTimerRet.codeId , {localOnly: true})
    await yz.createContentFromLevel2Record({db: dbsearch, type: "RELEASE", id: releaseId.value.id, scope: "LOCAL"})



    //database drivers
    await releaseComponentFromPath( '/controls/postgres.vjs')
    await releaseComponentFromPath( '/controls/sqlite.vjs')
    await releaseComponentFromPath( '/controls/mysql.vjs')


    let extraFns = fs.readFileSync( path.join(__dirname, '../src/extraFns.js') ).toString()
    outputDebug("Extra functions code:" )

    await eval("(" + extraFns + "())")

    //
    // non GUI front end apps
    //
    //await releaseComponentFromPath( '/apps/rh3scale_app.vjs')
    await releaseComponentFromPath('/apps/quicksort.vjs')
    //await releaseComponentFromPath( '/apps/bubblesort.vjs')
    await releaseComponentFromPath( '/all_system_components/blank_app.vjs')
    //await evalHtmlComponentFromPath( '/apps/blank_microservice.vjs')
    //await releaseComponentFromPath( '/apps/demo_microservice.vjs')
    ////await releaseComponentFromPath( '/apps/echo_microservice.vjs')
    //await releaseComponentFromPath( '/apps/call_function_microservice.vjs')
    //await releaseComponentFromPath( '/apps/echo_post_microservice.vjs')
    outputDebug("Loaded all apps (may use already loaded drivers)")


    await drivers_loaded_by_child()
}
function        setUpPredefinedComponents               (  ) {
    setUpComponentsLocally();
}
async function  drivers_loaded_by_child                 (  ) {
//------------------------------------------------------------------------------
    //
    // This is the last thing that happens when AppShare is started
    //
    //
    //
    //------------------------------------------------------------------------------
    await finalizeYazzLoading();
}
async function  createTablesInMain                      (  ) {
    await yz.createTables(dbsearch,
        createdTablesInChild)

}
async function  createdTablesInChild                    (  ) {
//------------------------------------------------------------------------------
//
//
//
//
//
//------------------------------------------------------------------------------

    outputDebug("mainNodeProcessStarted: " + mainNodeProcessStarted)

    if (!mainNodeProcessStarted) {
        mainNodeProcessStarted = true
        outputDebug("createdTablesInChild")

        console.log("Loading Yazz. Please wait a few minutes ... ")
        getPort()
    }
}
async function  finishInit                              (  ) {


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

    await createTablesInMain()



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
                //yazzProcessMainMemoryUsageMetric.set(used)
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
function        setUpSql                                (  ) {
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
    //console.log("setUpSql    ")



    stmtInsertCookie = dbsearch.prepare(" insert or replace into level_4_cookies " +
        "    (id,  created_timestamp, cookie_name, cookie_value, fk_session_id, host_cookie_sent_to, from_device_type ) " +
        " values " +
        "    (?, ?, ?, ?, ? , ? , ?);");

    stmtInsertUser = dbsearch.prepare(" insert or replace into level_4_users " +
        "    (id, user_type) " +
        " values " +
        "    (?, ?);");

    stmtInsertMetaMaskLogin =  dbsearch.prepare(" insert or replace into level_4_metamask_logins " +
        "    (id , account_id , random_seed , created_timestamp ) " +
        " values " +
        "    (?, ?, ?, ?);");


    stmtSetMetaMaskLoginSuccedded =  dbsearch.prepare(" update level_4_metamask_logins " +
        "   set  confirmed_login  = 'TRUE' , fk_session_id = ? " +
        " where " +
        "    random_seed =?;");
    //

    stmtInsertSession = dbsearch.prepare(" insert or replace into level_4_sessions " +
        "    (id,  created_timestamp, last_accessed , access_count ,  fk_user_id ) " +
        " values " +
        "    (?, ?, ?, ?, ?);");

    stmtInsertSessionWithNewUserId = dbsearch.prepare(" update level_4_sessions " +
        "    set fk_user_id = ? where id = ? ");



    setProcessToRunning = dbsearch.prepare("UPDATE level_8_system_process_info SET status = 'RUNNING', component_type = ?,  running_start_time_ms = ?, event_duration_ms = 0, system_code_id = ?, callback_index = ? WHERE process = ? AND yazz_instance_id = ?");

    setProcessToIdle = dbsearch.prepare("UPDATE level_8_system_process_info SET status = 'IDLE' WHERE process = ? AND yazz_instance_id = ?");
    setProcessRunningDurationMs  = dbsearch.prepare("UPDATE  level_8_system_process_info  SET event_duration_ms = ?  WHERE  process = ? AND yazz_instance_id = ?");

    insertIntoProcessTable = dbsearch.prepare(
        " insert into "+
        "     level_8_system_process_info (yazz_instance_id, process, process_id, running_since, status, job_priority) " +
        " values " +
        "     (?,?,?,?,?,?)")

    updateProcessTable = dbsearch.prepare(
        "UPDATE  level_8_system_process_info " +
        "      SET process_id = ?, running_since = ?, status = ?, job_priority = ? " +
        "WHERE " +
        "     yazz_instance_id = ? AND process = ? ")

    //console.log("setUpSql done   ")
}
function        findSystemDataDirectoryAndStart         (  ) {
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
    yz.fullIpfsFolderPath   = fullIpfsFolderPath

    outputDebug('process.env.LOCALAPPDATA: ' + JSON.stringify(localappdata ,null,2))
    outputDebug("Local home data path: " + LOCAL_HOME)
    outputDebug("userData: " + JSON.stringify(userData ,null,2))
    outputDebug("process.env keys: " + Object.keys(process.env))




    dbsearch = new sqlite3.Database(dbPath);
    dbsearch.run("PRAGMA journal_mode=WAL;")

}



// HTTP helper functions
function        getRoot                                 (  req  ,  res  ,  next  ) {
	hostcount++;

    //console.log("Host: " + req.headers.host + ", " + hostcount);
	//console.log("Full URL: " + req.protocol + '://' + req.get('host') + req.originalUrl);
	let isMobile = isRequestFromMobile(req)

    let homepage = path.join(__dirname, '../public/go.html')
    //let homepageUrl = serverProtocol + '://yazz.com/visifile/index.html?time=' + new Date().getTime()
    //let homepageUrl = serverProtocol + '://www.yazz.com'
    let homepageUrl = 'https://yazz.com/app/appstore.html'
    if (isMobile) {
        //homepageUrl = 'https://yazz.com/app/mobilehomepage.html'
        homepageUrl = 'https://yazz.com/app/appstore.html'
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
            //homepage = path.join( userData, 'apps/mobilehomepage.html' )
            //homepage = path.join( userData, 'apps/homepage.html' )
            homepage = path.join(__dirname, '../public/go.html')
        } else {
            //homepage = path.join( userData, 'apps/homepage.html' )
            homepage = path.join(__dirname, '../public/go.html')
        }
        runOnPageExists(req,res,homepage)
        return
    }
    outputDebug("Serving: " + homepage)


}
function        keycloakProtector                       (  params  ) {
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
                    "SELECT  code  FROM  level_2_released_components  WHERE  base_component_id = ? ; ",
                    appName2,

                    function(err, results)
                    {
                        if (results.length == 0) {
                            outputDebug("Could not find component : " + appName2)
                        } else {
                            outputDebug("Found code for : " + appName2)
                            let fileC = results[0].code.toString()
                            //console.log("Code : " + fileC)

                            let sscode = yz.helpers.getValueOfCodeString(fileC,"keycloak",")//keycloak")
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
async function  getUserIdFromYazzCookie                 (  yazzCookie  ) {
    let sessionId = await getSessionIdFromYazzCookie(yazzCookie)

    let promise = new Promise(async function(returnfn) {
        dbsearch.serialize(
            function() {
                let stmt = dbsearch.all(
                    `select 
                            fk_user_id
                      FROM 
                            level_4_sessions
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
async function  getUserId                               (  req  ) {
    let sessionId = await getSessionId(req)

    let promise = new Promise(async function(returnfn) {
        dbsearch.serialize(
            function() {
                let stmt = dbsearch.all(
                    `select 
                            fk_user_id
                      FROM 
                            level_4_sessions
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
async function  getSessionId                            (  req  ) {
    let promise = new Promise(async function(returnfn) {
        dbsearch.serialize(
            function() {
                let stmt = dbsearch.all(
                    `select 
                            level_4_sessions.id 
                      FROM 
                            level_4_sessions,level_4_cookies
                      where 
                            level_4_sessions.id = level_4_cookies.fk_session_id
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
async function  getSessionIdFromYazzCookie              (  yazzCookie  ) {
    let promise = new Promise(async function(returnfn) {
        dbsearch.serialize(
            function() {
                let stmt = dbsearch.all(
                    `select 
                            level_4_sessions.id 
                      FROM 
                            level_4_sessions,level_4_cookies
                      where 
                            level_4_sessions.id = level_4_cookies.fk_session_id
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
async function  getCookieRecord                         (  cookieValue  ) {
    let promise = new Promise(async function(returnfn) {
        dbsearch.serialize(
            function() {
                let stmt = dbsearch.all(
                    `select 
                            id,  created_timestamp, cookie_name, cookie_value, fk_session_id 
                      FROM 
                            level_4_cookies
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
async function  createCookieInDb                        (  cookie  ,  hostCookieSentTo  ,  from_device_type  ) {
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
    let contentHash = await promise
    return contentHash
    return ""
}
function        readCerts                               (  ) {
//------------------------------------------------------------------------------
//
//
//
//
//
//------------------------------------------------------------------------------
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

// upload app helper fns
async function  file_uploadSingleFn                     (  req  ,  res  ) {
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
            let bci = yz.helpers.getValueOfCodeString(ytr, "base_component_id")

            let componentsStart = readIn.indexOf("/*COMPONENTS_START*/")
            let componentsEnd = readIn.indexOf("/*COMPONENTS_END*/")
            let componentsData = null
            if ((componentsStart != -1) && (componentsEnd != -1)) {
                componentsData = readIn.substring( componentsStart + 20,
                    componentsEnd)
            }



            let indexStart = readIn.indexOf("/*APP_START*/")
            let indexEnd = readIn.indexOf("/*APP_END*/")

            let indexOfSqliteData = readIn.indexOf("let sqlitedata = '")
            let indexOfSqliteDataEnd = readIn.indexOf("'//sqlitedata")

            let sqlitedatafromupload = null
            if ((indexOfSqliteData != -1) && (indexOfSqliteDataEnd != -1)) {
                sqlitedatafromupload = readIn.substring( indexOfSqliteData + 18,
                    indexOfSqliteDataEnd)
            }

            await save_code_from_upload({
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
        let bci = yz.helpers.getValueOfCodeString(readIn, "base_component_id")



        await save_code_from_upload({
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
async function  file_uploadFn                           (  req  ,  res  ,  next  ) {
    let userId              = await getUserId(req)
    let client_file_upload_id = req.body.client_file_upload_id
    res.status( 200 ).send( req.files );

    let ll = req.files.length;
    for (let i = 0; i < ll ; i ++) {
        let ifile = req.files[i];
        let ext = ifile.originalname.split('.').pop();
        ext = ext.toLowerCase();

        // if we are loading a HTML file then
        // make sure that we read all the
        // SQLite database data too

        if ((ext == "html") || (ext == "html")) {
            let localHtmlFilePath;
            localHtmlFilePath =  path.join(userData,  'uploads/' + ifile.filename);
            let localp = localHtmlFilePath + '.' + ext;
            fs.renameSync(localHtmlFilePath, localp);
            let readIn = fs.readFileSync(localp).toString()
            let indexStart = readIn.indexOf("/*APP_START*/")
            let indexEnd = readIn.indexOf("/*APP_END*/")
            if ((indexStart > 0) && (indexEnd > 0)) {
                indexStart += 13 + 10
                indexEnd -= 2
                let tts = readIn.substring(indexStart,indexEnd)
                let ytr = unescape(tts)
                outputDebug("SENDING FROM UPLOAD___=+++****")
                let bci = yz.helpers.getValueOfCodeString(ytr, "base_component_id")

                // read in the
                // static
                // UI controls (needed when loading HTML file into editor)

                let componentsStart = readIn.indexOf("/*COMPONENTS_START*/")
                let componentsEnd = readIn.indexOf("/*COMPONENTS_END*/")
                let componentsData = null
                if ((componentsStart != -1) && (componentsEnd != -1)) {
                    componentsData = readIn.substring( componentsStart + 20,
                        componentsEnd)
                    let asyncCodeToExecute = "((async function() { " + componentsData + "})())"
                     asyncCodeToExecute = "(async () => {" + componentsData + "})()"
                    eval(asyncCodeToExecute)
                }

                indexStart = readIn.indexOf("/*APP_START*/")
                indexEnd = readIn.indexOf("/*APP_END*/")

                let indexOfSqliteData = readIn.indexOf("let sqlitedata = '")
                let indexOfSqliteDataEnd = readIn.indexOf("'//sqlitedata")

                let sqlitedatafromupload = null
                if ((indexOfSqliteData != -1) && (indexOfSqliteDataEnd != -1)) {
                    sqlitedatafromupload = readIn.substring( indexOfSqliteData + 18,
                        indexOfSqliteDataEnd)
                }

                await save_code_from_upload({
                    message_type:           "save_code_from_upload",
                    base_component_id:      bci,
                    parent_hash:            null,
                    code:                   ytr,
                    client_file_upload_id:  client_file_upload_id,
                    options:                {save_html: true, fast_forward_database_to_latest_revision: true, userId: userId},
                    sqlite_data:            sqlitedatafromupload
                });
            }



        // if we are loading a source file then
        // do a normal app load

        } else if ((ext == "js") || (ext == "yazz") || (ext == "pilot") || (ext == "jsa") || (ext == "vjs") || (ext == "yazz")  )  {
            let localSourceFilePath;
            localSourceFilePath =  path.join(userData,  'uploads/' + ifile.filename);
            let fullLocalSourceFilePath = localSourceFilePath + '.' + ext;
            fs.renameSync(localSourceFilePath, fullLocalSourceFilePath);
            await loadAppFromFile(
                {
                    localFilePath:          fullLocalSourceFilePath,
                    client_file_upload_id:  client_file_upload_id,
                    user_id:                userId
                })
        } else {
            outputDebug('Ignoring file ');

        }

    }

};
async function  file_name_load                          (  req  ,  res  ,  next  ) {
    //console.log("params: " + JSON.stringify(req.query,null,2))
    await loadAppFromFile(
    {
        localFilePath:          req.query.file_name_load,
        client_file_upload_id:  req.query.client_file_upload_id
    })
};
async function  loadAppFromFile                         (  {  localFilePath  ,  client_file_upload_id  ,  user_id  }  ) {
    let readIn  = fs.readFileSync(  localFilePath  ).toString()
    let bci     = yz.helpers.getValueOfCodeString(readIn, "base_component_id")

    await save_code_from_upload({
        message_type:           "save_code_from_upload",
        base_component_id:      bci,
        parent_hash:            null,
        code:                   readIn,
        client_file_upload_id:  client_file_upload_id,
        options:                {
            save_html:                                  true,
            fast_forward_database_to_latest_revision:   false,
            save_code_to_file:                          localFilePath,
            userId:                                     user_id
        },
        sqlite_data:            ""
    });

}
async function  save_code_from_upload                   (  msg  ) {

    //       save_code_from_upload

    let ret = await yz.saveCodeV3(  dbsearch  ,  msg.code  , msg.options);
    if (msg.sqlite_data) {
        let b = Buffer.from(msg.sqlite_data, 'base64')
        let sqliteAppDbPath = path.join( userData, 'app_dbs/' + msg.base_component_id + '.visi' )
        fs.writeFileSync(sqliteAppDbPath, b);
    }

    let  logoUrl        = yz.helpers.getValueOfCodeString(msg.code ,"logo_url")
    let  displayName    = yz.helpers.getValueOfCodeString(msg.code ,"display_name")
    outputDebug("uploaded_app_as_file_in_child: " + JSON.stringify(msg))
    sendOverWebSockets({
        type:                   "uploaded_app_as_file_from_server",
        code_id:                ret.code_id,
        base_component_id:      ret.base_component_id,
        display_name:           displayName,
        client_file_upload_id:  msg.client_file_upload_id,
        logo_url:               logoUrl,
        user_id:                msg.options?msg.options.user_id:null
    });
}

// Yazz OS helper methods
function        function_call_requestPart2              (  msg  ) {
//-----------------------------------------------------------------------------------------
//
//                                   function_call_request
//
// This is called to call code.
//
//-----------------------------------------------------------------------------------------

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
                    "SELECT  content_hash as id  FROM  level_2_released_components  where  base_component_id = ?; ",

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
function        processor_free                          (  msg  ) {
    //-----------------------------------------------------------------------------------------
    //
    //                                   processor_free
    //
    // This is called whenever one of the code processors is free. They should only be allowed
    // to process one thing at a time
    //
    //-----------------------------------------------------------------------------------------
    dbsearch.serialize(
        function() {
            dbsearch.run("begin exclusive transaction");
            setProcessToIdle.run(msg.child_process_name, yazzInstanceId)

            dbsearch.run("commit", function() {
                processesInUse[msg.child_process_name] = false
            });
        })
}
function        function_call_response                  (  msg  ) {
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

function        callDriverMethod                        (  msg  ) {

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
function        callDriverMethodPart2                   (  findComponentArgs  ,  args  ,  callbackFn  ) {
//------------------------------------------------------------------------------
//
//
//
//
//
//------------------------------------------------------------------------------

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
function        return_add_local_driver_results_msg     (  msg  ) {
//------------------------------------------------------------------------------
//
//
//
//
//
//------------------------------------------------------------------------------
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
function        ipcChildReturningCallComponentResponse  (  msg  ) {
//------------------------------------------------------------------------------
//
//
//
//
//
//------------------------------------------------------------------------------

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
function        function_call_request                   (  msg  ) {
//------------------------------------------------------------------------------
//
//
//
//
//
//------------------------------------------------------------------------------

    function_call_requestPart2({
        message_type:         "function_call_request",
        child_process_name:    msg.child_process_name,
        find_component:        msg.find_component,
        args:                  msg.args,
        callback_index:        msg.callback_index,
        caller_call_id:        msg.caller_call_id
    });
}
function        return_response_to_function_caller      (  msg  ) {


    // console.log("*) result received to caller " );
    // console.log("*)  callback_index:" + msg.callback_index );
    // console.log("*)  result:        " + msg.result );
    callbackList[ msg.callback_index ](msg.result)
}
function        updateRunningTimeForprocess             (  ) {
//-----------------------------------------------------------------------------------------//
//                                                                                         //
//                          updateRunningTimeForprocess                                    //
//                                                                                         //
//                                                                                         //
//                                                                                         //
//-----------------------------------------------------------------------------------------//
    //console.log("Checking processes")

    dbsearch.serialize(
        function() {
            let stmt = dbsearch.all(
                "SELECT * FROM level_8_system_process_info where  status = 'RUNNING'  AND  yazz_instance_id = ?; "
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
function        findLongRunningProcesses                (  ) {
    console.log("Checking processes")

    dbsearch.serialize(
        function() {
            let stmt = dbsearch.all(
                "SELECT * FROM level_8_system_process_info where  status = 'RUNNING' and event_duration_ms > ?  and  yazz_instance_id = ?; "
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
function        killProcess                             (  processName  ,  callbackIndex  ) {
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
function        scheduleJobWithCodeId                   (  codeId  ,  args  ,  parentCallId  ,  callbackIndex  ) {
//-----------------------------------------------------------------------------------------//
//                                                                                         //
//                            scheduleJobWithCodeId                                        //
//                                                                                         //
//                                                                                         //
//                                                                                         //
//-----------------------------------------------------------------------------------------//

    let processToUse = null
    let processNames = Object.keys(processesInUse)

    for ( let processNameIndex = 0 ; processNameIndex < processNames.length; processNameIndex ++ ) {

        let actualProcessName   = processNames[ processNameIndex ]
        let isInUse             = processesInUse[ actualProcessName ]

        //console.log(" select * from level_8_system_process_info    ")
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
function        sendToProcess                           (  id  ,  parentCallId  ,  callbackIndex, processName  ,  base_component_id  ,  args  ) {
//-----------------------------------------------------------------------------------------//
//                                                                                         //
//                                   sendToProcess                                         //
//                                                                                         //
//                                                                                         //
//                                                                                         //
//-----------------------------------------------------------------------------------------//

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
function        execute_code_in_exe_child_process       (  msg  ) {
//------------------------------------------------------------------------------
//
//
//
//
//
//------------------------------------------------------------------------------

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
function        sendJobToProcessName                    (  id  ,  args  ,  processName  ,  parentCallId  ,  callbackIndex  ) {
//-----------------------------------------------------------------------------------------//
//                                                                                         //
//                                   sendJobToProcessName                                  //
//                                                                                         //
//                                                                                         //
//                                                                                         //
//-----------------------------------------------------------------------------------------//

    dbsearch.serialize(
        function() {
            let stmt = dbsearch.all(
                "SELECT base_component_id FROM level_2_system_code where id = ? LIMIT 1",
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
function        startNode                               (  msg  ) {
//-----------------------------------------------------------------------------------------
//
//                                  startNode
//
// This is called when a node has been started. Noter that this does not start the
// NodeJS process, it just updates the Sqlite database to say that the process is
// ready to accept requests
//
//-----------------------------------------------------------------------------------------


    //console.log(" --- Started Node --- ")
    //console.log("     Node ID: " + msg.node_id)
    //console.log("     Process ID: " + msg.child_process_id)
    //console.log("     Started: " + msg.started)
    dbsearch.serialize(
        function() {
            let stmt = dbsearch.all(
                "SELECT * FROM level_8_system_process_info where  yazz_instance_id = ?  AND  process = ?; "
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
async function  executeSqliteForApp                     (  args  ) {
    //----------------------------------------------------------------------------------/
    //
    //                    /-------------------------------------/
    //                   /     executeSqliteForApp             /
    //                  /-------------------------------------/
    //
    //----------------------------------------------------------------------------/
    // This executes a SQL statement for an app at app runtime. It will
    // generally find the correct app database first and then run the
    // SQL. If the database doesn't already exist then create it
    //
    //________
    // PARAMS \______________________________________________________________/
    //
    //    args:
    //    {
    //        sql                     The SQL to execute
    //        ---
    //
    //        base_component_id       The base component ID of the
    //        -----------------       app
    //
    //        params                  Parameters to use for the SQL
    //        ------                  statement
    //    }
    //-------------------------------------------------------/

    if (!args.sql) {
        return []
    }
    let appDb = null
    let getAppDbPromise = new Promise(returnResult => {
        let appDbFound = null
        //console.log("dbPath: " + JSON.stringify(dbPath,null,2))
        //console.log("args: " + JSON.stringify(args,null,2))
        //console.log("SQL: " + JSON.stringify(args.sql,null,2))
        if (appDbs[args.base_component_id]) {
            appDbFound = appDbs[args.base_component_id]
            //console.log("Using cached db " + args.base_component_id)
            returnResult(appDbFound)
        } else {
            let dbPath = path.join(userData, 'app_dbs/' + args.base_component_id + '.visi')
            appDbFound = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
                if (err) {
                    console.error(err.message);
                } else {
                    console.log('1) Connected to the myDatabase.db database.');

                    // Set PRAGMA journal_mode to WAL
                    appDbFound.run("PRAGMA journal_mode=WAL;", function (err) {
                        if (err) {
                            console.error(err.message);
                        } else {
                            console.log("2) Journal mode set to WAL.");
                            appDbs[args.base_component_id] = appDbFound
                            returnResult(appDbFound)
                        }
                    });
                }
            });
        }
    })
    appDb = await getAppDbPromise
    let getSqlResults = new Promise(returnResult => {

        if (args.sql.toLocaleLowerCase().trim().startsWith("select")) {
            //console.log("Read only query " + args.sql)
            appDb.serialize(
                function() {
                    appDb.all(
                        args.sql,
                        args.params,
                        async function(err, results)
                        {
                            returnResult(results)
                        })
                }, sqlite3.OPEN_READONLY)
        } else {
            appDb.serialize(
                function() {
                    appDb.run("begin deferred transaction");
                    appDb.all(args.sql, args.params,
                        async function(err, results)
                        {
                            returnResult(results)
                        })
                    appDb.run("commit");
                    appDb.run("PRAGMA wal_checkpoint;")
                })
        }
    })


    let res = await getSqlResults
    return res
}
async function  evalLocalSystemDriver                   (  location , options  ) {
    //------------------------------------------------------------------------------
    //
    //
    //
    //
    //
    //------------------------------------------------------------------------------
    outputDebug("*** Loading driver from: *** : " + location)
    let ret
    try {
        let evalDriver = fs.readFileSync(location);

        ret = await yz.addOrUpdateDriver(dbsearch,evalDriver,options)
    } catch (error) {
        console.log("Location: " + location)
        outputDebug(error)
    }
    return ret
}
function        localComponentPath                      (  localPath  ) {
 return path.join(__dirname, '../public/visifile_drivers' + localPath)
}
async function  evalHtmlComponentFromPath               (  srcPath  ){
    let ret = await evalLocalSystemDriver(     localComponentPath(srcPath),{save_html: true, username: "default", version: "latest", distributeToPeer: false})
    return ret
}
async function  evalComponentFromPath                   (  srcPath  ){
    let ret = await evalLocalSystemDriver( localComponentPath(srcPath),{username: "default", version: "latest", distributeToPeer: false})
    return ret
}

// component release helpers
async function  releaseComponentFromPath                (  srcPath  ){
    try {
        let ret = await evalLocalSystemDriver( localComponentPath(srcPath),{username: "default", version: "latest", distributeToPeer: false})
        let releaseId =await yz.releaseCode( dbsearch, ret.codeId, {localOnly: true})

        return ret
    } catch (err) {
        console.log(err)
    }
}
async function  getCommentsForComponent                 (  baseComponentId  ) {
    let promise = new Promise(async function (returnfn) {

        dbsearch.serialize(
            function () {
                dbsearch.all(
                    " select  " +
                    "     comment, rating , date_and_time " +
                    " from " +
                    "     level_2_comments_and_ratings " +
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


// code commit helpers
async function  getRowForCommit                         (  commitId  ) {
    /*
    ________________________________________
    |                                      |
    |         getRowForCommit              |
    |                                      |
    |______________________________________|
    This is mostly used for the history function in the UI
    __________
    | PARAMS |______________________________________________________________
    |
    |     commitId
    |     --------
    |________________________________________________________________________ */

    let commitStructure         = null
    let thisCommit              = await yz.getQuickSqlOneRow(dbsearch,  "select  *  from   level_2_system_code  where   id = ? ", [  commitId  ])
    let getFutureCommitsSql     = "select  id  from   level_2_system_code  where  parent_id = ? "
    let parentCommits           = await yz.getQuickSql(dbsearch,  getFutureCommitsSql, [  commitId  ])
    let getCodeTagsSql          = "select  code_tag, main_score  from  level_4_code_tags_table  where fk_system_code_id = ?  "
    let codeTags                = await yz.getQuickSql(dbsearch,  getCodeTagsSql, [  commitId  ])

    if (thisCommit) {
        let changesList = []
        try {
            changesList = JSON.parse(thisCommit.code_changes)
            commitStructure =
                {
                    id:                 thisCommit.id,
                    ipfs_hash_id:       thisCommit.id,
                    creation_timestamp: thisCommit.creation_timestamp,
                    num_changes:        thisCommit.num_changes,
                    changes:            changesList,
                    base_component_id:  thisCommit.base_component_id,
                    parent_commit_id:   thisCommit.parent_id,
                    user_id:            thisCommit.fk_user_id,
                    descendants:        parentCommits,
                    code_tag_list:      codeTags,
                    stamped_as:         thisCommit.stamped_as
                }
        } catch (err) {
        }
    }
    return commitStructure
}
async function  getSaveChain                            (  commitId  ) {
    //----------------------------------------------------------------------------------/
    //
    //                    /-------------------------------------/
    //                   /             getSaveChain            /
    //                  /-------------------------------------/
    //
    //----------------------------------------------------------------------------/
    // This gets the previous saves when given the last save in a chain
    //
    //________
    // PARAMS \______________________________________________________________/
    //
    //    commitId    Last save Code ID
    //    --------
    //-----------------------------------------------------------/
    let returnRows      = []

    returnRows = await getPreviousSavesToLastCommit(
        {
            commitId:       commitId,
            returnRows:     returnRows
        })

    return {
                segmentLength:    returnRows.length,
                startOfSegment:	returnRows[returnRows.length - 1].id,
                lastCodeId:	    returnRows[0].id
            }
}
async function  getPreviousSavesToLastCommit            (  args  ) {
    //----------------------------------------------------------------------------------/
    //
    //                    /-------------------------------------/
    //                   /     getPreviousSavesToLastCommit    /
    //                  /-------------------------------------/
    //
    //----------------------------------------------------------------------------/
    // This is used to get the chain of discarded saves since the last commit
    //
    //________
    // PARAMS \______________________________________________________________/
    //
    //     args
    //     ---- {
    //              commitId
    //              returnRows
    //          }
    //---------------------------------------------------------------/

    let commitId        = args.commitId
    let returnRows      = []

    if (args.returnRows) {
        returnRows = args.returnRows
    }

    let commitRow       = await getRowForCommit( commitId  )
    let stampedAs       = commitRow.stamped_as
    let parentCommitId  = commitRow.parent_commit_id
    returnRows.push(commitRow)

    if ( (stampedAs != "SAVE") || (parentCommitId == null) ) {
        return returnRows
    }

    let parentCommitRow = await getRowForCommit( parentCommitId  )
    if (parentCommitRow) {
        returnRows = await getPreviousSavesToLastCommit(
            {
                commitId:   parentCommitRow.id,
                returnRows: returnRows
            })
    }
    return returnRows
}
async function  getPreviousCommitsFor                   (  args  ) {
    /*
    ________________________________________
    |                                      |
    |     getPreviousCommitsFor            |
    |                                      |
    |______________________________________|
    This is mostly used for the history function in the UI
    __________
    | PARAMS |______________________________________________________________
    |
    |     args
    |     ---- {
    |              commitId
    |              parentCommitId
    |              numPrevious
    |              returnRows
    |          }
    |________________________________________________________________________ */

    let commitId        = args.commitId
    let parentCommitId  = args.parentCommitId
    let numPrevious     = 100000000
    let returnRows      = []

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
    }
    return returnRows
}
async function  getFutureCommitsFor                     (  args  ) {
    /*
    ________________________________________
    |                                      |
    |         getFutureCommitsFor          |
    |                                      |
    |______________________________________|
    This is mostly used for the history function in the UI
    __________
    | PARAMS |______________________________________________________________
    |
    |     args
    |     ---- {
    |              commitId
    |              returnRows
    |              numPrevious
    |          }
    |________________________________________________________________________ */

    let commitId = args.commitId

    let numPrevious = 100000000
    let returnRows = []

    if (args.numPrevious) {
        numPrevious = args.numPrevious
    }

    if (args.returnRows) {
        returnRows = args.returnRows
    }

    let childCommits = await yz.getQuickSql(dbsearch,"select  *  from   level_2_system_code  where   parent_id = ? ", [  commitId  ])

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
async function  copyAppshareApp                         (  args  ) {
    /*
    ________________________________________
    |                                      |
    |            copyAppshareApp           |
    |                                      |
    |______________________________________|
    copies an app
    __________
    | PARAMS |______________________________________________________________
    |
    |     args
    |     ----
    |________________________________________________________________________ */
    //console.log("Called async function copyAppshareApp(args) {")
    let userId = args.user_id

    async function saveCopyOfAppWithDependencies(argsBaseComponentId, newBaseid, parentHashId, code, returnfn, newDisplayName) {

        let dbToCopyFrom            = argsBaseComponentId
        let altDbUsed               = yz.helpers.getValueOfCodeString(code,"use_db")
        let logoUrl                 = yz.helpers.getValueOfCodeString(code,"logo_url")
        let componentType           = yz.helpers.getValueOfCodeString(code,"component_type")
        let codeIdRet               = null
        let saveret

        //console.log("    async function saveCopyOfAppWithDependencies( " + argsBaseComponentId)
        //console.log("              newBaseid:           " + newBaseid)
        //console.log("              parentHashId:        " + parentHashId)
        //console.log("              argsBaseComponentId: " + argsBaseComponentId)
        //console.log("              userId:              " + userId)

        if (altDbUsed) {
            dbToCopyFrom = altDbUsed
        }

        saveret = await yz.saveCodeV3(
            dbsearch,
            code,
            {
                copy_db_from:           dbToCopyFrom,
                save_html:              true,
                userId:                 userId
            })

        if (saveret) {
            codeIdRet =  saveret.code_id
        }
        //console.log("                    after save()")
        //console.log("                                    saveret.code_id:      " + saveret.code_id)
        //console.log("                                    newDisplayName:       " + newDisplayName)
        //console.log("                                    newBaseid:            " + newBaseid)
        //console.log("                                    codeIdRet:            " + codeIdRet)

        returnfn({
            new_display_name:   newDisplayName,
            base_component_id:  newBaseid,
            code_id:            codeIdRet,
            logo_url:           logoUrl,
            component_type:     componentType
        })

    }





    var promise = new Promise(async function(returnfn) {

        var argsBaseComponentId = args.base_component_id
        var argsNewAppId        = args.new_base_component_id
        var argsCodeId          = args.code_id==""?null:args.code_id
        let timeNow             = new Date().getTime()

        //console.log("    argsBaseComponentId: " + argsBaseComponentId)
        //console.log("    argsCodeId: "          + argsCodeId)
        //console.log("    argsNewAppId:        " + argsNewAppId)
        //console.log("    userId:              " + userId)

        let results = []
        if (argsCodeId) {

            results = await yz.getQuickSql(
                dbsearch
                ,
                "SELECT    id, code, display_name as display_name    FROM    level_2_system_code   where    " +
                " id = ? ;  "
                ,
                [argsCodeId])
        } else if (argsBaseComponentId) {

            results = await yz.getQuickSql(
                dbsearch
                ,
                "SELECT    content_hash as id, code, component_name as display_name    FROM    level_2_released_components   where    " +
                " base_component_id = ? ;  "
                ,
                [argsBaseComponentId])
            if (results.length == 0 ) {
                results = await yz.getQuickSql(
                    dbsearch
                    ,
                    "SELECT    id, code, display_name    FROM    level_2_system_code   where    " +
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
            //console.log("    newBaseid:           " + newBaseid)




            var oldDisplayName = results[0].display_name
            var parentHashId = results[0].id
            var newDisplayName = "Copy of " + oldDisplayName
            //console.log("    parentHashId:        " + parentHashId)
            code = yz.helpers.deleteCodeString(code, "load_once_from_file")
            code = yz.helpers.deleteCodeString(code, "read_only")
            code = yz.helpers.deleteCodeString(code, "visibility")

            var componentType = yz.helpers.getValueOfCodeString(code, "component_type")
            if (componentType) {
            }
            if (componentType == "SYSTEM") {
                code = yz.helpers.deleteCodeString(code, "component_type")
                code = yz.helpers.insertCodeString(code, "component_type", "APP")
            }


            var formEditor = yz.helpers.getValueOfCodeString(code, "formEditor", ")//formEditor")
            if (formEditor) {
                formEditor.id = newBaseid
                code = yz.helpers.deleteCodeString(code, "formEditor", ")//formEditor")
                code = yz.helpers.insertCodeString(code, "formEditor", formEditor, ")//formEditor")
            }

            code = yz.helpers.deleteCodeString(code, "display_name")
            code = yz.helpers.insertCodeString(code, "display_name", newDisplayName)

            code = yz.helpers.insertCodeString(code, "visibility", "PRIVATE")


            let previousBaseComponentId = yz.helpers.getValueOfCodeString(code, "base_component_id")
            code = yz.helpers.deleteCodeString(code, "base_component_id")
            code = yz.helpers.insertCodeString(code, "base_component_id", newBaseid)



            //
            // this code goes after the "base_component_id" code, otherwise the
            // "parent_base_component_id" get deleted in a rare bug
            //
            //console.log("    previousBaseComponentId:  "          + previousBaseComponentId)
            //console.log("    parent_base_component_id: "          + newBaseid)
            if (yz.helpers.getValueOfCodeString(code, "base_component_id_derived_from")) {
                code = yz.helpers.deleteCodeString(code, "base_component_id_derived_from")
            }
            if (previousBaseComponentId != newBaseid) {
                code = yz.helpers.insertCodeString(code, "base_component_id_derived_from", previousBaseComponentId)
                //console.log(" INSERTED *     parent_base_component_id: "          + previousBaseComponentId)
            }


            code = yz.helpers.deleteCodeString(code, "created_timestamp")
            code = yz.helpers.insertCodeString(code, "created_timestamp", timeNow)

            code = yz.helpers.deleteCodeString(code, "updated_timestamp")
            code = yz.helpers.insertCodeString(code, "updated_timestamp", timeNow)


            //DELETE START
            // I think this can be deleted as it can never be used!!!! since we use Yazz.component!
            //hack city - Vue and component strings are separated as otherwise they mark the
            // code as UI code
            var vueIndex = code.indexOf("Vue" + ".component")
            if (vueIndex != -1) {
                var vueIndexEnd = code.substring(vueIndex).indexOf(",")
                if (vueIndexEnd) {
                    code = code.substring(0, vueIndex + 14) + "'" + newBaseid + "'" + code.substring(vueIndex + vueIndexEnd)
                }
            }
            //DELETE END

            //console.log("    newDisplayName:      " + newDisplayName)

            await saveCopyOfAppWithDependencies(argsBaseComponentId, newBaseid, parentHashId, code, returnfn, newDisplayName)
        }

    })
    var ret = await promise


    return ret
}

// REST APIs and websocket helpers
function        websocketFn                             (  ws  ) {
    serverwebsockets.push(ws);
    sendToBrowserViaWebSocket(ws, {type: "ws_socket_connected"});
    /*sendOverWebSockets({
        type:                               "server_init_data",
        env_vars:                           envVars,
        network_ip_address_intranet:        hostaddressintranet,
        send_is_win:                        isWin
    });*/
    sendToBrowserViaWebSocket(ws, {
        type:                               "server_init_data",
        env_vars:                           envVars,
        network_ip_address_intranet:        hostaddressintranet,
        send_is_win:                        isWin
    });
    sendToBrowserViaWebSocket


    ws.on('message', async function(msg) {
        let receivedMessage = eval("(" + msg + ")");

        let userId = await getUserIdFromYazzCookie(receivedMessage.cookie)

        //console.log(" 1- Server recieved message: " + JSON.stringify(receivedMessage));


        // --------------------------------------------------------------------
        //
        //                         ws_browser_calls_component_via_web_socket
        //
        // "ws_browser_calls_component_via_web_socket" is used to call server side apps/code.
        //
        //
        //
        // --------------------------------------------------------------------
        if (receivedMessage.message_type == "ws_browser_calls_component_via_web_socket") {

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
async function  startServices                           (  ) {
    //------------------------------------------------------------
    // This starts all the system services
    //------------------------------------------------------------
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

    // serve the main HTML pages
    app.get(    '/',                                                        function (req, res, next) {
        //------------------------------------------------------------------------------
        // Show the default page for the different domains
        //------------------------------------------------------------------------------
        //console.log("calling main page")
        //console.log("jaeger: " + jaegercollector)
        //console.log("app.get('/'): ")
        //console.log("    req.cookies: " + JSON.stringify(req.cookies,null,2))
        return getRoot(req, res, next);
    })

    function getAddField(field) {
        let fieldType = "INTEGER"
        if (field.type == "STRING") {
            fieldType = "TEXT"
        }
        return field.name + " " + fieldType
    }

    //------------------------- HOMEPAGE STUFF -------------------------
    app.post(   '/http_post_load_editable_apps',                            async function (req, res) {
        let editableApps    = []
        let userId          = await getUserId(req)
        let promise         = new Promise(async function(returnfn) {

            dbsearch.serialize(
                function() {
                    dbsearch.all( `SELECT
                                        level_2_system_code.id,
                                        level_2_system_code.base_component_id,
                                        level_2_system_code.component_type,
                                        level_2_system_code.read_write_status,
                                        level_2_system_code.display_name,
                                        level_2_system_code.logo_url
                                   FROM
                                        level_4_code_tags_table, level_2_system_code
                                    WHERE
                                        level_4_code_tags_table.fk_user_id = ?
                                            AND
                                        level_4_code_tags_table.fk_system_code_id = level_2_system_code.id
                                            AND
                                        level_4_code_tags_table.code_tag = "EDIT"`
                        ,
                        [userId]
                        ,
                        async function(err, rows) {
                            let returnRows = []
                            let appstoreRecord = await yz.getQuickSqlOneRow(dbsearch,
                                `SELECT 
                                    id
                                FROM
                                    level_2_system_code
                                WHERE
                                    base_component_id = ?         
                                    `,
                                ["appstore"])
                            returnRows.push(
                                {
                                    "base_component_id":    "appstore",
                                    "displayName":          "appstore",
                                    "code_id":              appstoreRecord.id,
                                    "logo_url":             "/driver_icons/appstore.png",
                                    "component_type":       "app"
                                })
                            if (!err) {
                                try {
                                    if (rows.length > 0) {
                                        for (let rowIndex =0; rowIndex < rows.length; rowIndex++) {
                                            let thisRow = rows[rowIndex]
                                            let componentType = "app"
                                            if (thisRow.component_type == "VB") {
                                                componentType = "component"
                                            }
                                            returnRows.push(
                                                {
                                                    base_component_id:  thisRow.base_component_id,
                                                    logo:               "",
                                                    content_hash:       thisRow.id,
                                                    display_name:       thisRow.display_name,
                                                    logo_url:           thisRow.logo_url,
                                                    component_type:     componentType
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
    app.post(   '/http_post_load_top_apps',                                  async function (req, res) {
        let topApps = []

        let promise = new Promise(async function(returnfn) {

            dbsearch.serialize(
                function() {
                    dbsearch.all(
                        `select  
                             distinct(level_2_released_components.id), 
                             component_name, 
                             content_hash, 
                             level_2_released_components.base_component_id,
                             component_type, 
                             logo_url
                        from 
                             level_2_released_components 
                        where 
                            (   
                                component_type = 'app' or 
                                base_component_id = 'button_control' or 
                                base_component_id = 'checkbox_control'  or 
                                base_component_id = 'input_control'   or 
                                base_component_id = 'label_control' 
                            )
                        `,
                        [],

                        async function(err, rows) {
                            let returnRows = []
                            if (!err) {
                                try {
                                    if (rows.length > 0) {
                                        for (let rowIndex =0; rowIndex < rows.length; rowIndex++) {
                                            let thisRow = rows[rowIndex]
                                            returnRows.push(
                                                {
                                                    id:                 thisRow.base_component_id,
                                                    base_component_id:  thisRow.base_component_id,
                                                    logo:               thisRow.logo_url,
                                                    content_hash:          thisRow.content_hash,
                                                    display_name:       thisRow.component_name,
                                                    component_type:     thisRow.component_type
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
    app.get(    '/http_get_hashes_for_released_components',                 async function (req, res, next) {
        let maxMasterMillis     = req.query.max_master_millis

        let listOfHashes = await yz.getReleasedHashesAfterTimestamp( dbsearch  ,  maxMasterMillis )
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(
            {value: listOfHashes}
        ));
    })
    app.post(   '/http_post_submit_comment',                                async function (req, res) {
        console.log("app.post('/http_post_submit_comment'): ")
        console.log("    req.cookies: " + JSON.stringify(req.cookies,null,2))

        let topApps                 = []
        let baseComponentId         = req.body.value.base_component_id
        let codeId                  = req.body.value.code_id
        let baseComponentIdVersion  = req.body.value.base_component_id_version
        let newComment              = req.body.value.comment
        let newRating               = req.body.value.rating
        let newDateAndTime          = new Date().getTime()

        await yz.insertCommentIntoDb(
            dbsearch
            ,
            {
                codeId:                 codeId,
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
                level_2_comments_and_ratings: commentsAndRatings
            }

        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(
            topApps
        ));
    });
    app.post(   '/http_post_query_sqlite',                                  async function (req, res) {
        console.log("app.post('/http_post_query_sqlite'): ")
        console.log("    req.cookies: " + JSON.stringify(req.cookies,null,2))

        let args         = req.body.value.args

        let sqliteResult = await yz.querySqlite(   args  )

        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(
            sqliteResult
        ));
    });
    app.post(   '/http_post_load_comments_for_component',                   async function (req, res) {
        let baseComponentId = req.body.value.base_component_id
        let commentsAndRatings = await getCommentsForComponent(baseComponentId)

        topApps =
            {
                status: "ok"
                ,

                level_2_comments_and_ratings: commentsAndRatings
            }

        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(
            topApps
        ));

    });
    app.get(    '/http_get_peer_alive_check',                               async function (req, res) {
        console.log("app.post('/http_get_peer_alive_check'): ")
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(
            {alive: true}
        ));

    });
    app.get(    '/http_get_login_with_metamask',                            async function (req, res) {
        console.log("app.post('/http_get_login_with_metamask'): ")
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
    app.get(    '/http_get_check_metamask_seed',                            async function (req, res) {
        try {

            console.log("app.get('/http_get_check_metamask_seed'): ")
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
                            "     level_4_metamask_logins " +
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

    //------------------------- DEBUG HELPERS -------------------------
    app.post(   '/http_post_save_debug_text',                               async function (req, res) {
        /*
        ________________________________________
        |                                      |
        |    POST /http_post_save_debug_text   |
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

        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({status: "OK"}))
    })
    app.post(   '/http_post_test',                                          async function (req, res) {
        console.log("app.post('/http_post_test'): ")
        console.log("    req.cookies: " + JSON.stringify(req.cookies,null,2))

        res.writeHead(200, {'Content-Type': 'application/json'});

        res.end(JSON.stringify(
            []
        ));

    });
    app.get(    '/http_get_live_check',                                     (req,res)=> {

        outputDebug("Live check passed")
        res.send ("Live check passed");
    });
    app.get(    '/http_get_readiness_check',                                (req,res)=> {
        if (systemReady) {
            outputDebug("Readiness check passed")
            res.send ("Readiness check passed");
        } else {
            outputDebug("Readiness check failed")
            res.status(500).send('Readiness check did not pass');
        }
    });
    app.post(   '/http_post_browser_sql_write_operation',                   async function (req, res) {
        let userId          = await getUserId(req)
        let updateSql       = req.body.browser_write_sql
        let updateParams    = req.body.sql_params

        await yz.executeQuickSql(
            dbsearch,
            updateSql,
            updateParams
        )

        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(
            {}
        ));

    })
    app.post(   '/http_post_create_browser_table',                          async function (req, res) {
        let userId          = await getUserId(req)

        let tn = req.body.table_name;
        let f = req.body.fields;

        let createTableSql =             "CREATE TABLE IF NOT EXISTS " + tn +
            " ("
        for (let fieldNameIndex =0; fieldNameIndex < f.length - 1;  fieldNameIndex++) {
            let field = f[fieldNameIndex]
            createTableSql += getAddField(field)
            createTableSql += ","
        }
        createTableSql += getAddField(f[f.length - 1])
        createTableSql += ")"

        await yz.executeQuickSql(
            dbsearch,
            createTableSql
        )

        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(
            {userId: userId, tableName2: tn, fields2: f}
        ));

    });

    //------------------------- EDIT/SAVE HELPERS -------------------------
    app.get(    '/http_get_point_edit_marker_at_commit',                    async function (req, res, next) {
        let userid          = await getUserId(req)

        await yz.pointEditMarkerAtCommit(
            dbsearch,
            {
                baseComponentId:    req.query.baseComponentId,
                userId:             userid,
                codeId:             req.query.sha1sum
            })
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(
            {status: "Done"}
        ));

    })
    app.get(    '/http_get_load_code_commit',                               async function (req, res, next) {
        //console.log("calling main page")
        //console.log("jaeger: " + jaegercollector)
        let commitId = req.query.commit_id;


        let codeRecord = await yz.getQuickSqlOneRow(dbsearch,  "select  code  from   level_2_system_code  where   id = ? ", [  commitId  ])
        let codeString = codeRecord.code

        console.log("app.get('/'): ")
        console.log("    req.cookies: " + JSON.stringify(req.cookies,null,2))
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(
            {code: codeString}
        ));

    })
    app.post(   '/http_post_load_pipeline_code',                            async function (req, res) {
        /*
        ________________________________________
        |                                      |
        |       POST /http_post_save_debug_text          |
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

        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({value: fileOut}))
    })
    app.post(   '/http_post_save_debug_text_as_file',                       async function (req, res) {
        let debugFileName        = req.body.debugFileName
        let debugFileText        = req.body.debugFileText

        fs.writeFileSync( debugFileName,  debugFileText.toString() )

        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({value: "File written"}))
    })
    app.get(    '/http_get_bulk_calculate_branch_strength_for_component',   async function (req, res) {
        console.log("app.post('/http_get_bulk_calculate_branch_strength_for_component'): ")
        let baseComponentId = req.query.baseComponentId;

        //
        // first find all the tips
        //
        let allTips = await yz.getQuickSql(
            dbsearch,

            `select  
                fk_system_code_id  
            from  
                level_4_code_tags_table  
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
                    select id, parent_id from level_2_system_code where id = ?
                        union all
                    select id, parent_id from level_2_system_code,parents_of  where id = parent_id2
                        limit 10
                )
            select count(*) as num_commits from parents_of`
                ,
                [tip.fk_system_code_id])
            let numCommits = numCommitsRow.num_commits



            await yz.executeQuickSql(
                dbsearch,

                `update 
                    level_2_system_code  
                set  
                    score = ?  
                where  
                    id = ? `,

                    [numCommits, tip.fk_system_code_id]
            )
            await yz.executeQuickSql(
                dbsearch,

                `update 
                    level_4_code_tags_table  
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
                level_4_code_tags_table  
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
    app.get(    '/http_get_load_version_history_v2',                        async function (req, res) {
        /*
        _______________________________________________
        |                                             |
        |    POST /http_get_load_version_history_v2   |
        |                                             |
        |_____________________________________________|
        Function description
        __________
        | PARAMS |______________________________________________________________
        |
        |     id            The base component ID of the component
        |     --
        |
        |     commit_id     The commit ID of the component
        |     ---------
        |
        |________________________________________________________________________ */

        let lastCommitId            = req.query.commit_id
        let currentReturnRows       = []
        let selectedCommitRow       = await getRowForCommit(lastCommitId)

        currentReturnRows.push(selectedCommitRow)
        let returnRows = await getPreviousCommitsFor(
            {
                commitId:       selectedCommitRow.id
                ,
                parentCommitId: selectedCommitRow.parent_commit_id
                ,
                returnRows:     currentReturnRows
            })


        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(   returnRows   ));
    });
    app.get(    '/http_get_load_version_future',                            async function (req, res) {

        console.log("app.get('/http_get_load_version_future'): ")
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
    app.post(   "/http_post_commit_code" ,                                  async function (req, res) {
        let contentHash = req.body.value.code_id;
        let code        = await yz.getCodeForCommit(dbsearch, contentHash)
        let previousSaves = await getSaveChain(contentHash)

        //
        // Remove old COMMIT or RELEASE sections
        //
        let commit = yz.helpers.getValueOfCodeString(code,"commit")
        if (commit) {
            code = yz.helpers.deleteCodeString(code, "commit")
        }
        let release = yz.helpers.getValueOfCodeString(code,"release")
        if (release) {
            code = yz.helpers.deleteCodeString(code, "release")
        }

        //
        // Insert COMMIT section
        //
        code     = yz.helpers.insertCodeString(code,"commit",
                            {
                                title: 		        req.body.value.header,
                                description: 	    req.body.value.description,
                                num_saves:    	    previousSaves.segmentLength - 1,
                                start_of_segment:	previousSaves.startOfSegment,
                                last_commit:	    previousSaves.lastCodeId
                            })

        //
        // set the parent hash
        //
        let parentHash = yz.helpers.getValueOfCodeString(code,"parent_hash")
        if (parentHash) {
            code = yz.helpers.deleteCodeString(code, "parent_hash")
        }
        if (previousSaves.segmentLength > 0) {
            code = yz.helpers.insertCodeString(code, "parent_hash", previousSaves.startOfSegment)
        }



        let saveResult  = await yz.saveCodeV3(
            dbsearch,
            code,
            {
                make_public: true,
                save_html:   true
            })
        let newCommitId = saveResult.code_id
        await yz.tagVersion(dbsearch, newCommitId, newCommitId)

        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        res.end(JSON.stringify({
            contentHash:           contentHash,
            newCommitId:        newCommitId
        }))
    })
    app.post(   "/http_post_promote_to_environment" ,                                  async function (req, res) {
        let contentHash = req.body.value.code_id;
        let code        = await yz.getCodeForCommit(dbsearch, contentHash)

        //
        // Remove old COMMIT or RELEASE sections
        //
        let commit = yz.helpers.getValueOfCodeString(code,"commit")
        let release = yz.helpers.getValueOfCodeString(code,"release")
        let envs = yz.helpers.getValueOfCodeString(code,"environments")

        if ((!commit) && (!release)) {
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
            res.end(JSON.stringify({
                error: "Code must be committed before release"
            }))
            return
        }
        if (!envs) {
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
            res.end(JSON.stringify({
                error: "Code has no environments set"
            }))
            return
        }
        if (envs) {
            if (envs.list_of_environments) {
                if (envs.list_of_environments.length == 0) {
                    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
                    res.end(JSON.stringify({
                        error: "Code has empty list of environments"
                    }))
                    return
                }
            }
        }

        if (commit) {
            code = yz.helpers.deleteCodeString(code, "commit")
        }
        if (release) {
            code = yz.helpers.deleteCodeString(code, "release")
        }

        let nextEnvId = null

        //
        // Figure out what the next environment will be
        //
        if (commit) {
            nextEnvId = envs.list_of_environments[0].id
        } else if (release) {
            for (let pp = 0 ; pp <  envs.list_of_environments.length; pp ++) {
                if (release.env_id == envs.list_of_environments[pp].id) {
                    currentEnvPos = pp
                }
            }
            if (currentEnvPos != -1) {
                if ((currentEnvPos + 1) < envs.list_of_environments.length) {
                    nextEnvId  = envs.list_of_environments[currentEnvPos + 1].id
                }
            }
        }


        //
        // Insert RELEASE section
        //
        code     = yz.helpers.insertCodeString(code,
            "release",
            {
                title: 		        req.body.value.header,
                description: 	    req.body.value.description,
                env_id:             nextEnvId
            })
        code    = yz.helpers.deleteCodeString(code, "read_only")
        code    = yz.helpers.insertCodeString(code, "read_only", true)

        //
        // set the parent hash
        //
        let parentHash = yz.helpers.getValueOfCodeString(code,"parent_hash")
        if (parentHash) {
            code = yz.helpers.deleteCodeString(code, "parent_hash")
        }



        let saveResult  = await yz.saveCodeV3(
            dbsearch,
            code,
            {
                make_public: true,
                save_html:   true
            })
        let newCommitId = saveResult.code_id
        await yz.tagVersion(dbsearch, newCommitId, newCommitId)

        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        res.end(JSON.stringify({
            contentHash:           contentHash,
            newCommitId:        newCommitId
        }))
    })
    app.post(   "/http_post_release_commit" ,                               async function (req, res) {
        //
        // get stuff
        //
        let contentHash = req.body.value.code_id;
        let version = req.body.value.version;
        let userId = req.body.value.user_id;


        let code = await yz.getCodeForCommit(dbsearch, contentHash)
        await yz.tagVersion(dbsearch, contentHash, code)
        let releaseId = await yz.releaseCode( dbsearch, contentHash, {save_to_network: true})
        await yz.createContentFromLevel2Record({db: dbsearch, type: "RELEASE", id: releaseId.value.id, scope: "GLOBAL"})


        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        res.end(JSON.stringify({
            contentHash:   contentHash,
        }))
    })
    app.post(   '/http_post_add_or_update_app',                             async function (req, res) {
        console.log("/http_post_add_or_update_app")
        let baseComponentIdLocal = req.body.base_component_id
        console.log("/http_post_add_or_update_app:baseComponentIdLocal := " + baseComponentIdLocal)
        let srcCode = req.body.src_code
        console.log("/http_post_add_or_update_app:srcCode := " + srcCode.length)
        let contentHash = req.body.content_hash
        console.log("/http_post_add_or_update_app:contentHash := " + contentHash)

        await yz.addOrUpdateDriver(
            dbsearch
            ,
            srcCode
            ,
            {
                save_html: true,
                username: "default",
                reponame: baseComponentIdLocal,
                version: "latest",
                ipfsHashId: contentHash})
        console.log("/http_post_add_or_update_app:addOrUpdateDriver completed")
        res.status(200).send('Code registered');
    })
    app.post(   '/http_post_copy_distributed_content_sent_from_client',     async function (req, res) {
        //---------------------------------------------------------------------------
        //
        // This is called on the master (from a slave) and tries to make a copy of some
        // network content
        //
        // Notes:
        // - what happens if we register a false or bad IPFS address? All code sent
        //   here should be validated
        //
        //---------------------------------------------------------------------------

        let contentHash        = req.body.content_hash
        let ipfsContent     = req.body.yazz_content
        res.status(200).send('IPFS content registered');
        let contentDesc = yz.getContentDescription(ipfsContent)
        console.log("Received content from peer: " + contentDesc)
        await yz.setDistributedContent( dbsearch  ,  ipfsContent  )
    })
    app.post(   "/http_post_save_code_v3" ,                                 async function (req, res) {
        let userid
        let optionsForSave
        let saveResult
        let savedCode       = req.body.value.code

        userid          = await getUserId(req)
        optionsForSave  = req.body.value.options

        if (optionsForSave) {
            optionsForSave.userId = userid
        }

        saveResult = await yz.saveCodeV3(
            dbsearch,
            savedCode,
            optionsForSave)

        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        res.end(JSON.stringify(saveResult))
    });
    app.get(    '/http_get_ipfs_content',                                   async function (req, res, next) {
        // this is called from the salver server to this master server
        let contentHash     = req.query.content_hash

        let nextContent = await yz.getDistributedContent(  {  thisDb: dbsearch  ,  contentHash:  contentHash }  )

        let content = null
        let error = null
        if (nextContent && nextContent.value) {
            content = nextContent.value
            console.log("               content length: " + content.length)
        } else {
            error = "Record not found"
            console.log("               error: Content not found" )
        }
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(
            {content_hash: contentHash, content: content, error: error}
        ));
    });
    app.get(    '/http_get_copy_component',                                 async function (req, res, next) {
        let userId              = await getUserId(req)
        let baseComponentId     = req.query.base_component_id
        let codeId              = req.query.code_id
        let newBaseComponentId  = req.query.new_base_component_id

        let args =
            {
                base_component_id:      baseComponentId,
                code_id:                codeId,
                new_base_component_id:  newBaseComponentId,
                user_id:                userId,
            }

        let response = await copyAppshareApp(args)
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(
            response
        ));
    })
    app.post(   "/http_post_generate_component" ,                           async function (req, res) {
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
        let componentToCopyBaseComponentId = yz.helpers.getValueOfCodeString(srcText,"base_component_id")
        srcText = srcText.replaceAll(componentToCopyBaseComponentId, copy_base_component_id)


        //
        // design_time_html
        //
        let design_time_html = req.body.value.design_time_html
        if ( design_time_html ) {
            srcText = yz.helpers.replaceBetween(srcText,"<!-- design_time_html_start -->", "<!-- design_time_html_end -->",design_time_html)
        }


        //
        // DESIGN TIME MOUNTED CODE
        //
        let designTimeMountedCode = req.body.value.design_time_mounted_code
        if (designTimeMountedCode) {
            srcText = yz.helpers.replaceBetween(srcText,"/*NEW_DESIGN_TIME_MOUNTED_START*/", "/*NEW_DESIGN_TIME_MOUNTED_END*/",designTimeMountedCode)
        }



        //
        // RUN TIME MOUNTED CODE
        //
        let runtimeMountedCode = req.body.value.runtime_mounted_code
        if (runtimeMountedCode) {
            srcText = yz.helpers.replaceBetween(srcText,"/*NEW_RUNTIME_MOUNTED_START*/", "/*NEW_RUNTIME_MOUNTED_END*/",runtimeMountedCode)
        }



        //
        // VARS CODE
        //
        let varsCode = req.body.value.vars_code
        if (varsCode) {
            srcText = yz.helpers.replaceBetween(srcText,"/*NEW_VARS_START*/", "/*NEW_VARS_END*/",varsCode)
        }




        //
        // run_time_html
        //
        let run_time_html = req.body.value.run_time_html
        if (run_time_html) {
            srcText = yz.helpers.replaceBetween(srcText,"<!-- run_time_html_start -->", "<!-- run_time_html_end -->",run_time_html)
        }






        //
        // give the new smart contract control a new icon logo
        //
        if (copy_image_data) {
            let logoValue = yz.helpers.getValueOfCodeString(srcText,"logo_url")
            if (logoValue) {
                srcText = yz.helpers.deleteCodeString(srcText, "logo_url")
            }
            srcText = yz.helpers.insertCodeString(srcText, "logo_url",copy_image_data)
        }





        //
        // give the new component a new logo
        //
        if (req.body.value.logo_url) {
            let logoValue = yz.helpers.getValueOfCodeString(srcText,"logo_url")
            if (logoValue) {
                srcText = yz.helpers.deleteCodeString(srcText, "logo_url")
            }
            srcText = yz.helpers.insertCodeString(srcText, "logo_url", "/driver_icons/blue_eth.png")
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
        let properties = yz.helpers.getValueOfCodeString(srcText,"properties", ")//prope" + "rties")
        srcText = yz.helpers.deleteCodeString(  srcText, "properties", ")//prope" + "rties")
        for (let irte = 0 ; irte < properties.length ; irte++ ) {
            let brje = properties[irte]
            if (brje) {
                if (brje.id == "ipfs_hash_id") {
                    brje.default = ""//contentHash
                }
            }
        }
        srcText = yz.helpers.insertCodeString(  srcText,
            "properties",
            properties,
            ")//prope" + "rties")




        //fs.writeFileSync( "z.txt",  srcText.toString() )










        //
        // save the new smart contract component
        //
        let codeRet = await yz.addOrUpdateDriver(dbsearch,srcText ,  {username: "default", reponame: copy_base_component_id, version: "latest"})
        let codeId = codeRet.codeId




        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        res.end(JSON.stringify({
            contentHash:   codeId,
            return:     srcText
        }))
    });


    //------------------------- LOAD COMPONENT HELPERS -------------------------
    app.post(   '/http_post_load_ui_components_v3',                         async function (req, res) {
        //console.log("CAlled /http_post_load_ui_components_v3")
        // Loads a bunch of components
        let inputComponentsToLoad       = req.body.find_components.items
        let outputComponents            = []

        for (let componentItem    of    inputComponentsToLoad ) {
            let resultsRow = null



            //----------------------------------------------------------------------------
            // if IPFS Hash given
            //----------------------------------------------------------------------------
            if (componentItem.codeId) {
                componentItem.ipfsHashId = componentItem.codeId
                if (componentItem.codeId == "QmW7Cam6Yu4PjVcG7Mxq1swSZjgkaDjuu7tHbBHQavrbwK") {
                    debugger
                }

                resultsRow = await yz.getQuickSqlOneRow(
                    dbsearch
                    ,
                    `SELECT  
                        level_2_system_code.*  
                    FROM
                        level_2_system_code  
                    WHERE  
                        id  = ?`
                    ,
                    componentItem.codeId)

                //----------------------------------------------------------------------------
                // if the component has not been loaded then try to load it from the cache
                //----------------------------------------------------------------------------
                if (!resultsRow) {
                    let gc = await yz.getDistributedContent( { thisDb: dbsearch, contentHash: componentItem.codeId })
                    await yz.createLevel2RecordFromContent( {thisDb: thisDb, contentHash: ipfsHashFileName})

                    resultsRow = await yz.getQuickSqlOneRow(
                        dbsearch
                        ,
                        `SELECT  
                        level_2_system_code.*  
                    FROM
                        level_2_system_code  
                    WHERE  
                        id  = ?`
                        ,
                        componentItem.codeId)
                }


                //----------------------------------------------------------------------------
                // otherwise, if ONLY baseComponentId given then get the published component.
                // If there is no published component then just get the latest one
                //----------------------------------------------------------------------------
            } else if (componentItem.baseComponentId) {
                resultsRow = await yz.getQuickSqlOneRow(
                    dbsearch
                    ,
                    `SELECT  
                        level_2_system_code.*  
                    FROM   
                        level_2_system_code, 
                        level_2_released_components   
                    WHERE  
                        level_2_released_components.base_component_id = ?
                            and   
                        level_2_released_components.content_hash = level_2_system_code.id 
                    `
                    ,
                    componentItem.baseComponentId)

                if (!resultsRow) {
                    resultsRow = await yz.getQuickSqlOneRow(
                        dbsearch
                        ,
                        `SELECT  
                            level_2_system_code.*  
                        FROM
                            level_2_system_code  
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
            // if the component is stored in Yazz's database then load it
            //----------------------------------------------------------------------------
            if (resultsRow) {
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
    app.post(   '/http_post_call_component',                                async function (req, res) {
        //currently neverused. Still needs to be implemented
        console.log("app.post('/http_post_call_component'): ")
        console.log("    req.cookies: " + JSON.stringify(req.cookies, null, 2))

        let topApps = []
        //let baseComponentId = req.body.value.base_component_id
        //let baseComponentIdVersion = req.body.value.base_component_id_version
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(
            topApps
        ));
    })
    app.post(   "/http_post_extract_commit_hash_id_from_code" ,             async function (req, res) {
        //
        // get stuff
        //
        let code = req.body.text;

        let contentHash = await yz.getDistributedKey(code)
        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        res.end(JSON.stringify({
            contentHash: contentHash,
        }))
    })


    //------------------------- FILE UPLOAD HELPERS -------------------------
    app.post(   '/http_post_file_open_single',                              upload.single( 'openfilefromhomepage' ), async function (req, res, next) {
        console.log("File open: " + JSON.stringify(req.file.originalname,null,2))
        return (await file_uploadSingleFn(req, res, next));
    });
    app.post(   '/http_post_file_upload_single',                            upload.single( 'uploadfilefromhomepage' ), async function (req, res, next) {
        console.log("File upload: " + JSON.stringify(req.file.originalname,null,2))
        return (await file_uploadSingleFn(req, res, next));
    });
    app.post(   '/http_post_file_upload',                                   upload.array( 'file' ), async function (req, res, next) {
        return (await file_uploadFn(req, res, next));
    });
    app.get(    '/http_get_file_name_load',                                 function (req, res, next) {
        //console.log("Hit http_get_file_name_load")
        file_name_load(req, res);

        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        res.end("Done");
    });



    app.use("/files",   express.static(path.join(userData, '/files/')));
    app.use("/weights",   express.static(path.join(userData, '/weights/')));

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




    process.on('uncaughtException', function (err) {
        outputDebug(err);
    })







    //------------------------------------------------------------------------------
    // start the web server
    //------------------------------------------------------------------------------
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

        setUpSql()
        setUpPredefinedComponents({message_type:       'setUpPredefinedComponents'});

    },1000)

}

// Startup yazz code
(async function()
{
    outputDebug('-------* Port: ' + port);
    outputDebug( ip.address() );

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
    yz.userData             = userData

    findSystemDataDirectoryAndStart()
    await finishInit()
})()

async function  universalSaveStaticUIControl            (  {  sha1sum  ,  unescapedCode  ,  baseComponentId  ,  loadMethod  }  ) {
    await yz.saveCodeV3(
        dbsearch,
        unescapedCode,
        {
            make_public: false,
            save_html:   false
        })
}


//setInterval(updateRunningTimeForprocess,1000)
//setInterval(findLongRunningProcesses,1000)

yz.peerAvailable = false
if (syncToMaster) {
    setInterval(async function() {
        await yz.checkIfPeerAvailable( )
    },5000)

    setInterval(async function() {
        await yz.synchonizeContentAmongPeers( dbsearch )
    },5000)
}

setInterval(async function() {
    await yz.processContentItems( dbsearch )
},5000)


