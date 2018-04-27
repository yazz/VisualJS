{
    name: 'powershell'
    ,
    version: 1
    ,
    type: 'service'
    ,
    text: 'Powershell driver'

    ,
    initText: 'Powershell is ALIVE!!!!'
    ,
    events: {
        "This is just dummy code": {
            on: "never",
            do: function() {
                // we don't do anyhting!
            }, end: null
        }

    }

}
