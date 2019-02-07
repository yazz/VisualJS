async function serverDockerStuff(args) {
/*
description("The VB6 style docker control communicates with this")
base_component_id("server_docker_stuff")
load_once_from_file(true)
only_run_on_server(true)
*/


    var promise = new Promise(async function(returnfn) {


                        returnfn("docker stuff")




    })
    var ret = await promise


    return ret
}
