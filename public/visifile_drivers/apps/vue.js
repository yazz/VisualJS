{
    doc_type: 'visifile'
    ,
    name: 'vue'
    ,
    version: 1
    ,
    type: 'app'
    ,
    text: 'Vue test app'

    ,
    initText: 'Vue test is ALIVE!!!!'
    ,
    events: {
        "This will return the test app": {
            on: "app",
            do: function(args, returnfn) {
                returnfn(
                    new Vue({
                      el: "#" + args.root_element
                      ,
                      template: `Okhay this is a Vue test app: 2
                       `

                    })
                )


            }, end: null
        }

    }

}
