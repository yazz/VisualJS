async function serverDockerStuff(args) {
/*
description("The VB6 style docker control communicates with this")
base_component_id("server_docker_stuff")
load_once_from_file(true)
only_run_on_server(true)
*/

    //
    // On Mac Docker doesn't seem to expose itself via a port by default, so we did
    // this:
    // docker run -d -v /var/run/docker.sock:/var/run/docker.sock -p 127.0.0.1:1234:1234 bobrik/socat TCP-LISTEN:1234,fork UNIX-CONNECT:/var/run/docker.sock
    // export DOCKER_HOST=tcp://localhost:1234
    //
    // Based on this URL:
    // https://github.com/docker/for-mac/issues/770
    //
    var host = 'host.docker.internal'
    var port = 1234
    if (args.host && (args.host.length > 0)) {
        host = args.host
    }
    if (args.port && (args.port > 0)) {
        port = args.port
    }
    var Docker = require('dockerode')
    console.log("//var docker = require('dockerode')")

    var dockerEngine = new Docker({
                host: host,
                port: port,
                version: 'v1.25'
                });

    if (args.create) {
        var message = ""
        //await dockerEngine.commit({
                          //      change: 'CMD ["node",  "src/electron.js",   "--runapp",   "demo_timer",   "--nogui",   "true",   "--deleteonexit",   "true",   "--locked",    "false"]'
                          //   }) --= e3b1bd7239df zubairq/yazz2

        try {
            var runningContainers               = await dockerEngine.listContainers()
            var yazzRunningContainerDetails     = null
            var oldRunningAppContainerDetails   = null
            var yazzRunningContainerId          = null
            var yazzRunningContainer               = null

            message += "Checking running containers\n"
            for (var ewr=0;ewr < runningContainers.length;ewr ++) {
                if (runningContainers[ewr].Image == "zubairq/yazz") {
                    yazzRunningContainerDetails = runningContainers[ewr]
                }
                if (runningContainers[ewr].Image == args.image_name) {
                    oldRunningAppContainerDetails = runningContainers[ewr]
                }
            }

            message += "Checking running app container...\n"
            if (oldRunningAppContainerDetails != null) {
                message += "    Found and stopping app container: " + oldRunningAppContainerDetails.Id + " for image " + args.image_name + "\n"
                await dockerEngine.getContainer(oldRunningAppContainerDetails.Id).stop()
            }
            message += "...Checked.\n"


            message += "Checking running yazz container...\n"
            if (yazzRunningContainerDetails != null) {
                yazzRunningContainerId = yazzRunningContainerDetails.Id
                message += "Yazz container found with ID: " + yazzRunningContainerId + "\n"
            } else {
                message += "Yazz container NOT found.\n"
                message += "Creating ...\n"
                var cc = await dockerEngine.run(     "zubairq/yazz")
                yazzRunningContainerId = cc.Id
                message += "Created with ID " + yazzRunningContainerId + " ...\n"
            }
            message += "...Checked.\n"


            yazzRunningContainer = dockerEngine.getContainer( yazzRunningContainerId );


            await yazzRunningContainer.commit({
                changes: 'CMD ["node",  "src/electron.js",   "--runapp",   "demo_timer",   "--nogui",   "true",   "--deleteonexit",   "true",   "--locked",    "false"]'
                ,
                repo: args.image_name
            })

            console.log("args.docker_local_port: " + args.docker_local_port)
            await dockerEngine.run(     args.image_name,
                                   [],
                                   undefined,
                                   {
                                        "HostConfig": {
                                            "PortBindings": {
                                                "80/tcp": [
                                                    {
                                                        "HostPort": args.docker_local_port   //Map container to a random unused port.
                                                    }
                                                ]
                                            }
                                        }
                                    })
        } catch ( err ) {
            console.log(  err  )
            message += err
        }

        return {message: message}

    } else {

        var runningContainers = await dockerEngine.listContainers()
        return runningContainers
    }

}
