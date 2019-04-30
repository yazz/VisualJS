async function serverdockerStuff(args) {
/*
description("The VB6 style terminal control communicates with this")
base_component_id("server_terminal_stuff")
load_once_from_file(true)
only_run_on_server(true)
*/


    var message = ""
    var msg = function(m) {
        console.log(m)
        message += (m + "\n")
    }
    //
    // On Mac docker doesn't seem to expose itself via a port by default, so we did
    // this:
    // terminal run -d -v /var/run/terminal.sock:/var/run/terminal.sock -p 127.0.0.1:1234:1234 bobrik/socat TCP-LISTEN:1234,fork UNIX-CONNECT:/var/run/terminal.sock
    // export DOCKER_HOST=tcp://localhost:1234
    //
    // Based on this URL:
    // https://github.com/terminal/for-mac/issues/770
    //
    var host = 'host.terminal.internal'
    var port = 1234
    if (args.host && (args.host.length > 0)) {
        host = args.host
    }
    if (args.port && (args.port > 0)) {
        port = args.port
    }
    var docker = require('terminalode')
    console.log("//var terminal = require('terminalode')")

    var terminalEngine = new docker({
                host: host,
                port: port,
                version: 'v1.25'
                });

    if (args.create) {
        //await terminalEngine.commit({
                          //      change: 'CMD ["node",  "src/electron.js",   "--runapp",   "homapage",   "--nogui",   "true",   "--deleteonstartup",   "true",   "--locked",    "false"]'
                          //   }) --= e3b1bd7239df zubairq/yazz2

        try {
            var runningContainers               = await terminalEngine.listContainers()
            var yazzRunningContainerDetails     = null
            var oldRunningAppContainerDetails   = null
            var yazzRunningContainerId          = null
            var yazzRunningContainer               = null

            msg("Checking running containers")
            for (var ewr=0;ewr < runningContainers.length;ewr ++) {
                if (runningContainers[ewr].Image == "zubairq/yazz") {
                    yazzRunningContainerDetails = runningContainers[ewr]
                }
                if (runningContainers[ewr].Image == args.image_name) {
                    oldRunningAppContainerDetails = runningContainers[ewr]
                }
            }

            msg("Checking running app container...")
            if (oldRunningAppContainerDetails != null) {
                msg("    Found and stopping app container: " + oldRunningAppContainerDetails.Id + " for image " + args.image_name)
                await terminalEngine.getContainer(oldRunningAppContainerDetails.Id).stop()
            }
            msg("...Checked.")


            msg("Checking running yazz container...")
            if (yazzRunningContainerDetails != null) {
                yazzRunningContainerId = yazzRunningContainerDetails.Id
                msg("Yazz container found with ID: " + yazzRunningContainerId)
            } else {
                msg("Yazz container NOT found.")
                msg("Creating ...")
                var cc = await terminalEngine.run(     "zubairq/yazz")
                yazzRunningContainerId = cc.Id
                msg("Created with ID " + yazzRunningContainerId + " ...")
            }
            msg("...Checked.")


            yazzRunningContainer = terminalEngine.getContainer( yazzRunningContainerId );


var extraFns = ""
extraFns += "async function() {"
extraFns += "await evalLocalSystemDriver('" + args.app_id + "',   path.join(__dirname, '../src/extraComp.js'),{save_html: true})"
extraFns += "}"


            //zzz
            var tar = require('tar-stream')
            var pack = tar.pack() // pack is a streams2 stream

            // add a file called my-test.txt with the content "Hello World!"
            pack.entry({ name: 'extraFns.js' }, extraFns)

            var extraComp = await (new Promise(async function(returnfn) {

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
                            args.app_id
                            ,
                            async function(err, rows) {
                                if (rows.length > 0) {
                                    returnfn(rows[0].code.toString())
                                } else {
                                    returnfn("")
                                }
                          }
                  );
              }, sqlite3.OPEN_READONLY)
            }))

            pack.entry({ name: 'extraComp.js' }, extraComp)
            pack.finalize();


            await yazzRunningContainer.putArchive(pack, { path: "/src"} )


            await yazzRunningContainer.commit({
                changes: 'CMD ["node",  "src/electron.js",   "--runapp",   "' + args.app_id + '",   "--nogui",   "true",   "--deleteonstartup",   "true",   "--locked",    "false"]'
                ,
                repo: args.image_name
            })

            msg("args.terminal_local_port: " + args.terminal_local_port)
            msg("Running app: " + args.image_name)
             terminalEngine.run(     args.image_name,
                                   [],
                                   undefined,
                                   {
                                        "HostConfig": {
                                            "PortBindings": {
                                                "80/tcp": [
                                                    {
                                                        "HostPort": args.terminal_local_port   //Map container to a random unused port.
                                                    }
                                                ]
                                            }
                                        }
                                    })
            msg("Done app: " + args.image_name)
        } catch ( err ) {

            msg(err)
        }

        return {message: message}

    } else {

        var runningContainers = await terminalEngine.listContainers()
        return runningContainers
    }

}
