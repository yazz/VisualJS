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
    events: {
        "This will return the search app": {
            on: "app",
            do: function(args, returnfn) {
                var mm = new Vue({
                  el: "#" + args.root_element
                  ,
                  template: "<div v-on:click='search'>this is the Vue seach app {{msg}}</div>"
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
                                      //  console.log("3) returned result: " + JSON.stringify(result,null,2))
                                        mm.msg =result.value
                                    })

                    }
                }
                })


                returnfn({})


            }, end: null
        }

    }

}
