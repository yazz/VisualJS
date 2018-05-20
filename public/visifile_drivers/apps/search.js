{
    doc_type: 'visifile'
    ,
    name: 'search'
    ,
    version: 1
    ,
    type: 'app'
    ,
    text: 'Search app'

    ,
    initText: 'Search is ALIVE!!!!'
    ,
    events: {
        "This will return the search app": {
            on: "moon_app",
            do: function(args, returnfn) {
                returnfn({hello: "moon app"})


            }, end: null
        }

    }

}
