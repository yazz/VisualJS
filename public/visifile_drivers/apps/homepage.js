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
    var introa = ['homepage_1','homepage_2','homepage_3','homepage_4',
                    'homepage_5','homepage_6',"todo","form_subscribe_to_appshare","test"]
    await load("app_editor_3")
    var mm = null

    Vue.component('homepage', {

      template: `<div>
                    <div    style="position: sticky; left:0px; top:0px; height:70px; width: 100vw ;z-index: 200000;background-color: white;padding:0;margin:0;">
                    <h3 style="border:solid 1px;border-color: lightgray; padding: 14px; margin: 0px;font-family: Helvetica;">Appshare</h3>
                    </div>

      <div  class="container-fluid" style='position: relative; padding:20;margin:0; width: 95%;'>



                    <div v-bind:refresh='refresh'
                         ref='maingrid'
                         class="grid"
                         style='background-color: white; color: black; padding-top: 20px;padding-bottom: 20px;'>





                                <div    v-for="(item, index) in intro_apps"
                                        class="grid-item col-sm-4">
                                        <div
                                        style="border-radius: 30px;background-color:white;border-width: 0px;margin:0px;padding:10px;"
                                       >

                                       <div v-if="item.type == 'add'" >
                                        <div    style='border-radius: 5px;padding:20px; margin:0;border: 2px solid pink;'
                                                >
                                           <h4>
                                            Add a new app
                                           </h4>
                                           <button style='margin-bottom:10px;' class='btn btn-primary' v-on:click='copyApp("new_app")'>Add basic app</button>
                                           <button style='margin-bottom:10px;'  class='btn btn-primary' v-on:click='copyApp("todo")'>Add database todo app</button>
                                           <button style='margin-bottom:10px;'  class='btn btn-primary' v-on:click='copyApp("game")'>Add 3d AFrame app</button>
                                           </div>
                                           </div>

                                   <div v-if="item.type == 'app'" >
                                       <div v-if="(edit_app == item.data.id)"
                                               style="position: fixed; left:0px; top:0px; height:100%; width: 100vw ;z-index: 200000;background-color: white;overflow-y:scroll; padding: 20px;">
                                               <div v-on:click='editApp($event,null);addApp(item.data.id,index)' class="btn-lg btn-danger" style='margin-bottom: 20px;'>Close</div>
                                               <component v-if='' :is='"app_editor_3"' v-bind:app_id='item.data.id' v-bind:card_index='index'></component>
                                       </div>




                                    <div v-if='!isEditable(item.data.id)' style='border-radius: 5px;padding:20px; margin:0;border: 1px solid lightgray;'>
                                       <kbd >{{item.data.id}}</kbd>
                                       <component v-if='edit_app != item.data.id' :is='item.data.id'></component>
                                    </div>

                                    <div v-if='isEditable(item.data.id)' style='border-radius: 25px;padding:20px; margin:0;border: 2px solid lightgray;'>
                                        <kbd >{{item.data.id}}</kbd>
                                        <span class="badge badge-warning" >Editable</span>

                                        <img    v-if='(app_records[item.data.id].logo_url && (app_records[item.data.id].logo_url != ""))'
                                                v-bind:src='app_records[item.data.id].logo_url'
                                                style='width: 100%;'
                                                v-bind:alt='app_records[item.data.id].logo_url'
                                                v-on:click='editApp($event,item.data.id)'
                                                ></img>
                                    </div>


                                <div v-on:click='showMenu(item.data.id)' class="float-left">
                                ...
                                    <div v-bind:id='item.data.id + "_menu"' v-bind:style='"background-color: white; border: solid 1px lightgray;position:absolute; bottom:0px;width:250px;z-index:100000;display: " + ((show_menu == item.data.id)?"":"none")  +  ";border-radius: 20px; padding: 20px;"'>
                                        <ul class="nav flex-column">
                                        <li class="nav-item" v-if='!isEditable(item.data.id)'>
                                          <a  v-on:click='editApp($event,item.data.id)'
                                              class="nav-link active" href="#">View source</a>
                                        </li>

                                          <li class="nav-item" v-if='isEditable(item.data.id)'>
                                            <a  v-on:click='editApp($event,item.data.id)'
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








                </div>
       </div>`
      ,


    data: function() {
        return {
                    apps: [],
                    intro_apps: [],
                    loaded_app: new Object(),
                    show_menu: null,
                    refresh: 0,
                    edit_app: null,
                    app_records: new Object(),
                    msnry: null
                }},

      mounted: async function() {
            mm = this

            this.msnry = new Masonry( mm.$refs.maingrid, {
              itemSelector: '.grid-item'
            });
            Vue.nextTick(() => {
                  this.msnry.reloadItems();
                  this.msnry.layout();
              });

           mm.addAdder()

           setTimeout(async function() {
               for (var rt=0; rt < introa.length; rt++) {
                   var appId = introa[rt]
                   mm.addApp(appId,-1)
               }
           },3000)


            mm.search()

            this.$root.$on('message', (text) => {
                console.log(JSON.stringify(text,null,2));
                mm.intro_apps.splice(text.card_index, 0, {});
                mm.addApp(text.base_component_id, text.card_index)

            })
      },
      methods: {
          addAdder: async function() {
                  mm.intro_apps.push( {
                                        type: "add",
                                      } )
                mm.refresh++
              },
          addApp: async function(baseComponentId, cardIndex) {
              if (baseComponentId) {
                  var app = {
                                        type: "app",
                                        data:
                                            {
                                                id: baseComponentId
                                            }
                                      }
                  if (cardIndex != -1) {
                    mm.intro_apps[cardIndex] =  app

                  } else {
                    mm.intro_apps.push( app  )
                  }
                  mm.loaded_app[baseComponentId] = true
                  var vv = await load(baseComponentId)
                  if (vv) {
                      mm.app_records[vv.base_component_id] = vv
                      mm.refresh++
                  }
                  setTimeout(function() {
                      mm.msnry.reloadItems();
                      mm.msnry.layout();
                  },50)
              }
          },
          copyApp: async function(  baseComponentId ) {
              callDriverMethod( {driver_name: "copyApp",
                                 method_name: "copyAppshareApp"}
                                ,{
                                    base_component_id:    baseComponentId
                                 }
                          ,
                          function(result) {
                              //alert(JSON.stringify(result.value,null,2))
                              //var copLoc = "http://" +  useHostname + ":" + usePort + "/?goto=" + result.value.new_display_name .replaceAll(" ","%20")
                              //window.location.href = copLoc
                              mm.intro_apps.splice(1, 0, {});
                              mm.addApp(result.value.base_component_id, 1)

                          })
          },
          isEditable: function(baseComponentId) {
                if (this.app_records[baseComponentId]) {
                    if ((this.app_records[baseComponentId].read_write_status == null ) ||
                         (this.app_records[baseComponentId].read_write_status.indexOf("READ") == -1 ))   {
                         return true
                }

                }

               return false
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
          ,

      }
    })

}
