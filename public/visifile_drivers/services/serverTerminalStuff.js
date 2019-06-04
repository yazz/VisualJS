async function serverTerminalStuff(args) {
/*
description("The VB6 style terminal control communicates with this")
base_component_id("server_terminal_stuff")
load_once_from_file(true)
only_run_on_server(true)
*/
    var exec = require('child_process').exec;

    var execPromise = new Promise(
                        done => {
                                    exec(   args.cmd_string
                                            ,
                                            function(error, stdout, stderr)
                                            {
                                                done(stdout)
                                            })
                                })

    var val = await execPromise

    return val
}
