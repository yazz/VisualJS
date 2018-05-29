{
    name: 'commandLine'
    ,
    version: 1
    ,
    type: 'service'
    ,
    text: 'CommandLine driver'

    ,
    events: {

        "ls function returns current files":
        {
            on: "ls",
            do: function(args, callbackFn) {
               // console.log("2)  Service called with args:  " + JSON.stringify(args,null,2))
                if(callbackFn){
                    console.log("4.5 callbackFn exists")
                    if (args) {
                      //  console.log("*) Args = " + args.text)
                    }
                    var exec = require('child_process').exec;
                    exec('ls', function(error, stdout, stderr) {
                         callbackFn(stdout)
                    });

                }
            },
            end: null

        },


        "pwd returns working directory":
        {
            on: "pwd",
            do: function(args, callbackFn) {
                console.log("2)  Service called with args:  " + JSON.stringify(args,null,2))
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
            },
            end: null

        },


        "This is just dummy code": {
            on: "never",
            do: function() {
                // we don't do anyhting!
                // but we can still be edited :)
                console.log("***** This is just dummy code ****")
            }, end: null
        }
    }

}
