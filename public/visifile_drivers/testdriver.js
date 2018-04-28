{
    name: 'testdriver'
    ,
    version: 1
    ,
    type: 'basic'
    ,
    text: 'Hello driver'

    ,
    initText: 'testdriver is ALIVE!!!!'
    ,
    events: {
        "This function is called at application startup":
        {
            on: "init",
            do: function() {
                console.log("1) IN TESTDRIVER, calling commandLine service")
                callDriverMethod( "commandLine",
                                  "ls"
                                  ,{}
                            ,
                            function(result) {
                                console.log("5) returned result: " + JSON.stringify(result,null,2))
                            })
            },
            end: "init"
        }

    }

}
