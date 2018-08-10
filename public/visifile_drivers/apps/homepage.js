async function(args) {
/*
created_timestamp(-1)
base_component_id("homepage")
is_app(true)
display_name("Homepage app")
description('Homepage app')
load_once_from_file(true)
read_only(true)
logo_url("https://cdn0.tnwcdn.com/wp-content/blogs.dir/1/files/2017/05/Best-Homepages--796x563.jpg")
*/
    var introa = ['homepage_1','homepage_2','homepage_3','homepage_4','homepage_5','homepage_6',"todo","form_subscribe_to_appshare"]
    await load("app_editor_3")
    var mm = null

    Vue.component('homepage', {

      template: `<div>
                    <div    style="position: sticky; left:0px; top:0px; height:70px; width: 100vw ;z-index: 200000;background-color: white;padding:0;margin:0;">
                    <h3 style="border:solid 1px;border-color: lightgray; padding: 14px; margin: 0px;font-family: Helvetica;">Appshare</h3>
                    </div>

      <div  class="container-fluid" style='position: relative; padding:20;margin:0; width: 95%;'>



                    <div v-bind:refresh='refresh'
                         class="row"
                         style='background-color: white; color: black; padding-top: 20px;padding-bottom: 20px;'>



                        <div style='background-color: white;' class="card-columns">
                                <div    v-for="item in intro_apps" v-if='loaded_app[item]'
                                        class="card rounded"
                                        style="width: 100%; border-radius: 40px;background-color:white;border-width: 0px;margin:0px;padding:0px;margin-bottom: 40px;"
                                       >



                                       <div v-if="edit_app == item"
                                               style="position: fixed; left:0px; top:0px; height:100%; width: 100vw ;z-index: 200000;background-color: white;overflow-y:scroll; padding: 20px;">
                                               <div v-on:click='editApp($event,null)' class="btn-lg btn-danger" style='margin-bottom: 20px;'>Close</div>
                                               <component v-if='' :is='"app_editor_3"' v-bind:app_id='item'></component>
                                       </div>




                                    <div v-if='!isEditable(item)' style='border-radius: 25px;padding:20px; margin:0;border: 2px solid lightgray;'>
                                       <kbd >{{item}}</kbd>
                                       <component v-if='edit_app != item' :is='item'></component>
                                    </div>

                                    <div v-if='isEditable(item)' style='border-radius: 25px;padding:20px; margin:0;border: 2px solid lightgray;'>
                                        <span class="badge badge-warning" >Editable</span>

                                        <img    src='https://i.imgur.com/OvMZBs9.jpg'
                                                style='width: 100%;'
                                                ></img>
                                    </div>


                                <div v-on:click='showMenu(item)' class="float-left">
                                ...
                                    <div v-bind:id='item + "_menu"' v-bind:style='"background-color: white; border: solid 1px lightgray;position:absolute; bottom:0px;width:250px;z-index:100000;display: " + ((show_menu == item)?"":"none")  +  ";border-radius: 20px; padding: 20px;"'>
                                        <ul class="nav flex-column">
                                        <li class="nav-item" v-if='!isEditable(item)'>
                                          <a  v-on:click='editApp($event,item)'
                                              class="nav-link active" href="#">View source</a>
                                        </li>

                                          <li class="nav-item" v-if='isEditable(item)'>
                                            <a  v-on:click='editApp($event,item)'
                                                class="nav-link active" href="#">Edit</a>
                                          </li>

                                        <li class="nav-item" >
                                          <a  v-on:click='editApp($event,null)'
                                              class="nav-link active" href="#">Close</a>
                                        </li>


                                        </ul>
                                    </div>
                                </div>

                            </div>

                        </div>
                    </div>








                </div>
       </div>`
      ,


    data: function() {
        return {
                    apps: [],
                    intro_apps: introa,
                    loaded_app: new Object(),
                    show_menu: null,
                    refresh: 0,
                    edit_app: null
                }},

      mounted: async function() {
            mm = this
            for (var rt = 0; rt < 2; rt++) {
                await load(mm.intro_apps[rt])
                mm.loaded_app[mm.intro_apps[rt]] = true
            }

            mm.search()
      },
      methods: {
          isEditable(baseComponentId) {
               if ((baseComponentId != null) &&
                    (
                        (baseComponentId.startsWith("homepage_"))
                        ||
                        (baseComponentId == "form_subscribe_to_appshare")
                    )
                    ) {
                return false
               }
               return true
          },
          editApp: async function(event,item) {
              event.stopPropagation()
              this.show_menu = null;
              this.edit_app = item;
          },
          showMenu: async function(item) {
            this.show_menu= item;
          },
          search: async function() {
               this.apps = await callApp({   driver_name: "systemFunctions3",  method_name:"get_public_apps_list"}, { }) }

      }
    })
    setTimeout(async function() {
        for (var rt2 = 2; rt2 < mm.intro_apps.length; rt2 ++) {
            var appN = mm.intro_apps[rt2]
            await load(appN)
            mm.loaded_app[appN] = true
            mm.refresh++
        }
    },3000)
}
