{
    doc_type: 'visifile'
    ,
    name: 'test'
    ,
    version: 1
    ,
    type: 'app'
    ,
    text: 'Test app'

    ,
    initText: 'Test is ALIVE!!!!'
    ,
    events: {
        "This will return the test app": {
            on: "app",
            do: function(args, returnfn) {
                returnfn(
                    new Moon({
                      el: "#current_app"
                      ,
                      template: "<div>Okhay this is a test app</div>"
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
