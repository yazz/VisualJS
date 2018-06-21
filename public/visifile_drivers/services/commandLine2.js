function pwd(args, callbackFn) {
    description("pwd returns working directory")
    base_component_id("systemFunctions2")

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
