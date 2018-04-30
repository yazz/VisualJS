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
                                console.log("3) returned result: " + JSON.stringify(result,null,2))
                            })
            },
            end: null
        },

        "This function is when the name ZOO is found":
        {
            on: {
                selector: {
                    name: {$eq: 'ZOO'}
                }
            },
            do: function() {
                console.log("1) IN TESTDRIVER, calling commandLine service")
            },
            end: null
        },

    }

}
