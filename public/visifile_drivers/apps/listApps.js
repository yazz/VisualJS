{
    doc_type: 'visifile'
    ,
    name: 'listApps'
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
                var mm = new Moon({
                  el: "#" + args.root_element
                  ,
                  template: "<div m-on:click='search'>this lists all the apps installed {{msg}}</div>"
                  ,
                  data: {
                    msg: "..."
                },
                methods: {
                    search: function() {
                        callDriverMethod( "systemFunctions",
                                          "get_ap_list"
                                          ,{}
                                    ,
                                    function(result) {
                                      //  console.log("3) returned result: " + JSON.stringify(result,null,2))
                                        mm.set("msg", result.value)
                                    })

                    }
                },
                  store: store
                })


                returnfn({})


            }, end: null
        }

    }

}
