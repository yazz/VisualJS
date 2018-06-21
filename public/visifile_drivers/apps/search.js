function(args) {
    /*
    is_app(true)
    display_name("Search app")
    description("This will return the search app")
    base_component_id("search")
    */

    Vue.component("search_app",{
      template: "<div v-on:click='search'>this is the Vue seach app {{msg}}</div>"
      ,
      data: function() {
       return {
         msg: "..."
     }
      },
    methods: {
        search: function() {
            var mm = this
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


    return {name: "search_app"}


}
