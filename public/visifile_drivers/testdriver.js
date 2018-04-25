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
                console.log("Hello there")
                callService("powershell", {
                    command: "ls"
                }, function(result) {
                    console.log("returned result")
                })
            }
        }

    }

}
