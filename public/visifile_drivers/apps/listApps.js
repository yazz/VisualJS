function(args) {
/*
created_timestamp(-1)
base_component_id("listApps")
is_app(true)
display_name("App Store")
description('App to list all the apps')
load_once_from_file(true)
*/

    Vue.component('listApps',{


          template: `<div >
                       <div class="card-columns">
                        <div class="card" style="width: 20rem;" v-for="item in apps">
                          <div class="card-body">
                            <h4 class="card-title">{{item}}</h4>
                            <p class="card-text"></p>
                            <a v-bind:href='"http://139.162.228.5/?goto=" + item' class="btn btn-primary">Run</a>
                          </div>
                        </div>
                        </div>
                     </div>`,



          data: function() {
              return {
                          apps: []
                      }},

          mounted: function() {
              this.search()
          },



        methods: {
            search: async function() {
                 this.apps = await callApp({   driver_name: "systemFunctions",  method_name:"get_apps_list"}, { }) }
        }
    })


    return {name: "listApps"}
}
