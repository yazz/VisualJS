async function(args) {
/*
created_timestamp(-1)
base_component_id("homepage")
is_app(true)
display_name("Homepage app")
description('Homepage app')
uses_javascript_librararies(["aframe"])

load_once_from_file(true)
read_only(true)
logo_url("https://cdn0.tnwcdn.com/wp-content/blogs.dir/1/files/2017/05/Best-Homepages--796x563.jpg")
*/
    var introa = []//['homepage_1','homepage_2','homepage_3','homepage_4',
                   // 'homepage_5','homepage_6',"todo","form_subscribe_to_appshare","test"]
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
                                        class="grid-item col-lg-4">
                                        <div
                                        style="border-radius: 30px;background-color:white;border-width: 0px;margin:0px;padding:10px;"
                                       >

                                       <div v-if="item.type == 'add'" >
                                        <div    style='border-radius: 5px;padding:20px; margin:0;border: 2px solid pink;'
                                                >
                                           <h4>
                                            Create a new app
                                           </h4>
                                           <button style='margin-bottom:10px;'  class='btn btn-primary' v-on:click='copyAndEditApp($event,"todo")'>Add database app</button>
                                           <button style='margin-bottom:10px;' class='btn btn-primary' v-on:click='copyAndEditApp($event,"new_app")'>Simple text app</button>
                                           <button style='margin-bottom:10px;'  class='btn btn-primary' v-on:click='copyAndEditApp($event,"game")'>Add 3d AFrame app</button>
                                           </div>
                                           </div>

                                   <div v-if="item.type == 'app'" >
                                       <div v-if="(edit_app == item.data.id)"
                                               style="position: fixed; left:0px; top:0px; height:100%; width: 100vw ;z-index: 200000;background-color: white;overflow-y:scroll; padding: 20px;">
                                               <div v-on:click='editApp($event,null);addApp(item.data.id,index)' class="btn-lg btn-danger" style='margin-bottom: 20px;'>Close</div>
                                               <component v-if='' :is='"app_editor_3"' v-bind:app_id='item.data.id' v-bind:card_index='index'></component>
                                       </div>




                                    <div v-if='isInlineApp(item.data.id)' style='border-radius: 5px;padding:20px; margin:0;border: 1px solid lightgray;'>
                                       <kbd v-on:click='editApp($event,item.data.id)'>{{item.data.id?"" + item.data.id.substring(0,20):""}}{{(item.data.id && ((item.data.id.length > 20))?"...":"")}}</kbd>
                                       <component v-if='edit_app != item.data.id' :is='item.data.id'></component>
                                    </div>

                                    <div v-if='!isInlineApp(item.data.id)' style='border-radius: 25px;padding:20px; margin:0;border: 2px solid lightgray;'>
                                        <kbd v-on:click='editApp($event,item.data.id)'>{{item.data.id?"" + item.data.id.substring(0,20):""}}{{(item.data.id && ((item.data.id.length > 20))?"...":"")}}</kbd>
                                        <span v-if='isEditable(item.data.id)' class="badge badge-warning" >Editable</span>
                                        <span v-if='!isEditable(item.data.id)' class="badge badge-info" >Read only</span>

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

           var sql =    "select  *  from  system_code  where " +
                        "        component_type = 'app' and base_component_id like 'homepage_%'" +
                        "        and code_tag = 'LATEST' order by base_component_id asc"

           var results = await callApp(
               {
                    driver_name:    "systemFunctions2",
                    method_name:    "sql"
               }
               ,
               {
                   sql: sql
               })
               for (var rt=0; rt < results.length; rt++) {
                   var appId = results[rt].base_component_id
                   mm.addAppFast(appId,-1, results[rt])
               }


                   //zzz
               mm.search()




            this.$root.$on('message', (text) => {
                console.log(JSON.stringify(text,null,2));
                mm.intro_apps.splice(text.card_index, 0, {});
                mm.addApp(text.base_component_id, text.card_index)
                mm.edit_app = text.base_component_id
                mm.refresh++
            })
      },
      methods: {
          addAdder: async function() {
                  mm.intro_apps.push( {
                                        type: "add",
                                      } )
                mm.refresh++
              },
              addAppFast: async function(baseComponentId, cardIndex,vv) {
                  if (baseComponentId) {

                      var x = eval("(" + vv.code + ")")
                      x.call()
                      setTimeout(function() {
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
                          if (vv) {
                              mm.app_records[vv.base_component_id] = vv
                              mm.refresh++
                          }
                          setTimeout(function() {
                              mm.msnry.reloadItems();
                              mm.msnry.layout();
                          },50)
                      },100)

                  }
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
                                ,{base_component_id:    baseComponentId}
                          ,
                          function(result) {
                              mm.intro_apps.splice(1, 0, {});
                              mm.addApp(result.value.base_component_id, 1)

                          })
          },
          copyAndEditApp: async function(event,  baseComponentId ) {
              callDriverMethod( {driver_name: "copyApp",
                                 method_name: "copyAppshareApp"}
                                ,{base_component_id:    baseComponentId}
                          ,
                          function(result) {
                              mm.intro_apps.splice(1, 0, {});
                              mm.addApp(result.value.base_component_id, 1)
                              setTimeout(function() {
                                    mm.editApp(event, result.value.base_component_id)
                              },50)

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
          isInlineApp: function(baseComponentId) {
                if (baseComponentId && (baseComponentId.length > 0)) {
                    if ((!this.isEditable(baseComponentId)) && (baseComponentId.startsWith("homepage"))) {
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
              var sql =    "SELECT  *  " +
                           " FROM system_code where component_type = 'app' and code_tag = 'LATEST' and " +
                           " visibility = 'PUBLIC' order by base_component_id asc; "

              var results = await callApp(
                  {
                       driver_name:    "systemFunctions2",
                       method_name:    "sql"
                  }
                  ,
                  {
                      sql: sql
                  })
              for (var rt=0; rt < results.length; rt++) {
                  var appId = results[rt].base_component_id
                  if (!mm.loaded_app[  appId  ]) {
                        mm.addAppFast(appId,-1, results[rt])
                  }
              }
              }





      }
    })

}
