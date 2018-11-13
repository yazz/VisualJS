async function(args) {
/*
created_timestamp(-1)
base_component_id("homepage")
is_app(true)
control_type("SYSTEM")
display_name("Homepage app")
description('Homepage app')
uses_javascript_librararies(["aframe"])

load_once_from_file(true)
read_only(true)
logo_url("data:image/jpeg;base64,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")
*/
    var introa = []//['homepage_1','homepage_2','homepage_3','homepage_4',
                   // 'vb','homepage_6',"todo","form_subscribe_to_appshare","test"]
                   //alert(3)
   console.log(`calling await loadV2("app_editor_3")`)
    await loadV2("app_editor_3")
    console.log(`calling await loadV2("app_editor_3") loaded`)
    var mm = null
//alert(2)
    Vue.component('homepage', {

      template: `<div>
                    <div    style="position: sticky; left:0px; top:0px; height:70px; width: 100vw ;z-index: -2000;background-color: white;padding:0;margin:0;">
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
                                           <select v-model="app_type">
                                              <option selected value="quicksort">Quicksort</option>
                                              <option          value="vb">Drag and Drop Builder</option>
                                              <option          value="todo">Database app</option>
                                              <option          value="game">3d AFrame app</option>
                                              <option          value="new_app">Text only</option>
                                            </select>
                                           <button style='margin-bottom:10px;' class='btn btn-primary' v-on:click='copyAndEditApp($event,app_type)'>Go</button>
                                           </div>
                                           </div>

                                   <div v-if="item.type == 'app'" >
                                       <div v-if="(edit_app == item.data.id)"
                                               style="position: fixed; left:0px; top:0px; height:100%; width: 100vw ;z-index: 200000;background-color: white;overflow-y:scroll; padding: 20px;">
                                               <div v-on:click='editApp($event,null);addApp(item.data.id,index)' class="btn-lg btn-danger" style='margin-bottom: 20px;'>Close</div>
                                               <component v-if='' :is='"app_editor_3"' v-bind:app_id='item.data.id' v-bind:card_index='index'></component>
                                       </div>




                                   <div style='border-radius: 25px;padding:20px; margin:0;border: 2px solid lightgray;'>
                                    <div v-if='isInlineApp(item.data.id)' >
                                       <kbd v-on:click='editApp($event,item.data.id)'>{{item.data.id?"" + item.data.id.substring(0,20):""}}{{(item.data.id && ((item.data.id.length > 20))?"...":"")}}</kbd>
                                       <component v-if='edit_app != item.data.id' :is='item.data.id'></component>
                                    </div>

                                    <div v-if='!isInlineApp(item.data.id)' >
                                        <kbd v-on:click='editApp($event,item.data.id)'>{{item.data.id?"" + item.data.id.substring(0,20):""}}{{(item.data.id && ((item.data.id.length > 20))?"...":"")}}</kbd>
                                        <span v-if='isEditable(item.data.id)' class="badge badge-warning" >Editable</span>
                                        <span v-if='!isEditable(item.data.id)' class="badge badge-info" >Read only</span>

                                        <img    v-if='(app_records[item.data.id] && app_records[item.data.id].logo_url && (app_records[item.data.id].logo_url != ""))'
                                                v-bind:src='app_records[item.data.id].logo_url'
                                                style='width: 100%;'
                                                v-bind:alt='app_records[item.data.id].logo_url'
                                                v-on:click='editApp($event,item.data.id)'
                                                ></img>
                                    </div>


                                    <ul class="nav flex-column">
                                    <li class="nav-item" v-if='!isEditable(item.data.id)'>
                                      <a  v-on:click='editApp($event,item.data.id)'
                                          class="nav-link active" href="#">View source</a>
                                    </li>

                                      <li class="nav-item" v-if='isEditable(item.data.id)'>
                                        <a  v-on:click='editApp($event,item.data.id)'
                                            class="nav-link active" href="#">Edit</a>
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
                    app_type: "quicksort",
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
            //alert(1)

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
                   component_loaded[appId] = true
               }


               await mm.search()




            this.$root.$on('message', (text) => {
                if (text.type == "insert_app_at") {
                    console.log(JSON.stringify(text,null,2));
                    mm.intro_apps.splice(text.card_index, 0, {});
                    mm.addApp(text.base_component_id, text.card_index)
                    mm.edit_app = text.base_component_id
                    mm.refresh++
                }
            })

             globalEventBus.$on('new-appshare-app-uploaded',
                async function(data) {
                    //zzz
                    //alert(JSON.stringify(data,null,2))
                    mm.intro_apps.splice(1, 0, {});
                    mm.addApp(data, 1)
                    setTimeout(function() {
                          mm.editApp(null, data)
                    },50)
             });
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

                      if (vv.code) {
                          var x = eval("(" + vv.code + ")")
                          x.call()
                      }
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
                  component_loaded[baseComponentId] = false
                  dev_app_component_loaded[baseComponentId] = false
                  component_cache[baseComponentId] = null
                  var vv = await loadV2(baseComponentId)
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
              if (event) {
                  event.stopPropagation()
              }
              this.show_menu = null;
              this.edit_app = item;
          },
          showMenu: async function(item) {
            this.show_menu= item;
          },








          search: async function() {
              var sql =    `SELECT  id, base_component_id, logo_url, read_write_status
                                FROM
                            system_code
                                where
                                    component_type = 'app'
                                        and
                                    code_tag = 'LATEST'
                                        and
                                    visibility = 'PUBLIC'
                            order by base_component_id asc; `

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
