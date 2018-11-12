function pwd(args, callbackFn) {
/*
description("pwd returns working directory")
base_component_id("commandLine2")
load_once_from_file(true)
only_run_on_server(true)
*/

    //console.log("2)  Service called with args:  " + JSON.stringify(args,null,2))
    if(callbackFn){
        console.log("4.5 callbackFn exists")
        if (args) {
            console.log("*) Args = " + args.text)
        }
        var exec = require('child_process').exec;
        exec('pwd', function(error, stdout, stderr) {
             callbackFn(stdout)
        });

    }
}
