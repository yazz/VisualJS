function(args) {
/*
is_app(true)
display_name("App Store")
description('App to list all the apps')
base_component_id("listApps")
*/

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
            search: async function() {
                 this.apps = await callApp({   driver_name: "systemFunctions",  method_name:"get_apps_list"}, { })


            }
        }
    })


    return {name: "listApps"}


}
