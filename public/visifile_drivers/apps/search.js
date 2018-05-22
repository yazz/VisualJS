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
            on: "app",
            do: function(args, returnfn) {
                returnfn(
                    new Moon({
                      el: "#current_app"
                      ,
                      template: "<div>this is the moon seach app</div>"
                      ,
                      data: {
                        msg: ""
                    },
                    methods: {
                    },
                      store: store
                    })
                )


            }, end: null
        }

    }

}
