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
    events: {
        "This will return the test app": {
            on: "app",
            do: function(args) {
                is_app()
                Vue.component('listApps',{
                      template: `<div v-on:click='search'>
                                    this lists all the apps installed
                                    <ul>
                                            <li v-for="item in apps">{{item}}</li>
                                    </ul>
                                 </div>
                      `
                      ,
                      data: function() {
                          return {
                                      msg: "...",
                                      apps: []
                                  }
                      },
                    methods: {
                        search: function() {
                            var mm = this
                            callDriverMethod( "systemFunctions",
                                              "get_apps_list"
                                              ,{}
                                        ,
                                        function(result) {
                                          //  console.log("3) returned result: " + JSON.stringify(result,null,2))
                                            mm.apps = result.value
                                        })

                        }
                    }
                })


                return {name: "listApps"}


            }, end: null
        }

    }

}
