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

    var docker5 = new Docker({
                host: host,
                port: port,
                version: 'v1.25'
                });

    if (args.create) {
        //await docker5.commit({
                          //      change: 'CMD ["node",  "src/electron.js",   "--runapp",   "demo_timer",   "--nogui",   "true",   "--deleteonexit",   "true",   "--locked",    "false"]'
                          //   }) --= e3b1bd7239df zubairq/yazz2
        //return [{ok: "created"}]
        var containers = await docker5.listContainers()
        var mmf=null
        var olds=null
        for (var ewr=0;ewr < containers.length;ewr ++) {
            if (containers[ewr].Image == "zubairq/yazz") {
                mmf = containers[ewr]
            }
            if (containers[ewr].Image == args.image_name) {
                olds = containers[ewr]
            }
        }
        if (olds) {
            await docker5.getContainer(olds.Id).stop()
        }

        var imageId = mmf.Id

        var container = docker5.getContainer(imageId);
        var details = await container.inspect()


        await container.commit({
            changes: 'CMD ["node",  "src/electron.js",   "--runapp",   "demo_timer",   "--nogui",   "true",   "--deleteonexit",   "true",   "--locked",    "false"]'
            ,
            repo: args.image_name
        })

        try {
            await docker5.run(     args.image_name,
                                   [],
                                   undefined,
                                   {
                                        "HostConfig": {
                                            "PortBindings": {
                                                "80/tcp": [
                                                    {
                                                        "HostPort": "81"   //Map container to a random unused port.
                                                    }
                                                ]
                                            }
                                        }
                                    })
        } catch ( err ) {
            console.log(  err  )
        }

        return details

    } else {

        var containers = await docker5.listContainers()
        return containers
    }

}
