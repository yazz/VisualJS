{
    doc_type: 'visifile'
    ,
    name: 'comp'
    ,
    version: 1
    ,
    type: 'component'
    ,
    text: 'Component'

    ,
    initText: 'Component is available!!!!'
    ,
    events: {
        "This will return the test app": {
            on: "component",
            do: function(args, returnfn) {
                returnfn(
                    new Moon({
                      el: "#" + args.root_element
                      ,
                      template: `<div>Okhay this is a test component: {{msg}} 2</div>
                       `
                      ,
                      data: {
                        msg: "some data"
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
