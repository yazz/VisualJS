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
                        <img    v-if='item.logo_url'
                                v-bind:src='item.logo_url'
                                style='width: 100%;'
                                v-on:click='document.location="/?goto=" + item.display_name;return false;'
                                ></img>
                          <div class="card-body">
                            <h4 class="card-title">{{item.display_name}}</h4>
                            <p class="card-text"></p>
                            <a v-bind:href='"/?goto=" + item.display_name' class="btn btn-primary">Run</a>
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
