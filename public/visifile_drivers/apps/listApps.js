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
                  template: `<div m-on:click='search'>
                                this lists all the apps installed
                                <ul>
                                        <li m-for="item in apps">{{item}}</li>
                                </ul>
                             </div>
                  `
                  ,
                  data: {
                    msg: "...",
                    apps: []
                },
                methods: {
                    search: function() {
                        callDriverMethod( "systemFunctions",
                                          "get_apps_list"
                                          ,{}
                                    ,
                                    function(result) {
                                      //  console.log("3) returned result: " + JSON.stringify(result,null,2))
                                        mm.set("apps", result.value)
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
