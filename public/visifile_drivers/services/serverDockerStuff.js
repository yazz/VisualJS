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
var Docker = require('dockerode')
console.log("//var docker = require('dockerode')")
    var promise = new Promise(async function(returnfn) {

    var docker5 = new Docker({
                host: '127.0.0.1',
                port: process.env.DOCKER_PORT || 1234,
                version: 'v1.25'
                });

    docker5.listContainers(function (err, containers) {
    console.log(JSON.stringify(err,null,2))
    console.log(JSON.stringify(containers,null,2))
    returnfn(containers)
            });








    })
    var ret = await promise


    return ret
}
