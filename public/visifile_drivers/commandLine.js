{
    name: 'commandLine'
    ,
    version: 1
    ,
    type: 'service'
    ,
    text: 'CommandLine driver'

    ,
    initText: 'commandLine is ALIVE!!!!'
    ,
    events: {

        "This function is called as a service":
        {
            on: "call",
            do: function(args, callbackFn) {
                console.log("4)  Service called with args " + JSON.stringify(args,null,2))
                if(callbackFn){
                    console.log("4.5 callbackFn exists")
                    callbackFn([1, 2, 3 ,4])
                }
            }
        }
    }

}
