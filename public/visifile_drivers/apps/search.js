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
                var mm = new Moon({
                  el: "#" + args.root_element
                  ,
                  template: "<div m-on:click='search2'>this is the moon seach app {{msg}}</div>"
                  ,
                  data: {
                    msg: "..."
                },
                methods: {
                    search: function() {
                        callDriverMethod( "commandLine",
                                          "ls"
                                          ,{}
                                    ,
                                    function(result) {
                                        console.log("3) returned result: " + JSON.stringify(result,null,2))
                                    })
                    },
                    search2: function() {
                        setTimeout(function() {
                            mm.set("msg", "zoo")
                            alert("done")
                        }
                        ,1000)
                    }
                },
                  store: store
                })


                returnfn({})


            }, end: null
        }

    }

}
