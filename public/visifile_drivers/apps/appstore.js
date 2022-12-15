async function(args) {
/*
created_timestamp(-1)
base_component_id("appstore")
is_app(true)
component_type("SYSTEM")
display_name("Homepage app")
description('Homepage app')

load_once_from_file(true)
read_only(true)
logo_url("data:image/jpeg;base64,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")
*/
    console.log(`calling await loadV2("app_editor_3")`)
    await loadV2("app_editor_3")
    console.log(`calling await loadV2("app_editor_3") loaded`)

    var mm = null




    Vue.component('appstore', {

      template:
`<div   v-bind:refresh='refresh'
        style="overflow-y:auto;overflow-x: auto;width:100%;height:100%;">


    <div    v-for="(item, index) in intro_apps"
            v-bind:refresh='refresh'
            v-if="(edit_app == item.data.id)"
            v-on:mouseenter="preview_app_loaded = false; preview_app_id = item.data.id;previewApp(item.data.id)"
            v-on:mouseleave="preview_app_loaded = false; preview_app_id = null;"
            style='display: inline-block; margin: 20px;position: relative;border:0px solid lightgray;vertical-align: text-top;'
            class='app_card'>


        <div    v-if="(edit_app == item.data.id)"
                v-bind:refresh='refresh'
                style="position: fixed; left:0px; top:0px; height:100%; width: 100vw ;z-index: 200000;background-color: black;overflow-y:none; padding: 0px;">

                <component  id="editor_component2"
                            v-if='isValidObject(item.data)'
                            :is='"app_editor_3"'
                            v-bind:app_id='item.data.id'
                            v-bind:card_index='index'>
                </component>
        </div>


    </div>


    <div    style='vertical-align:top;padding:10px; margin:0;padding-top: 15px;padding-bottom: 0px;padding-bottom:0px; background-color: black;font-weight: bold;padding-left: 27px;'
            v-if="(!edit_app)"
            v-bind:refresh='refresh'>

            <div    v-bind:refresh='refresh'
                    style="display: inline-block;border:0px; padding: 0px; margin: 0px;padding-left:15px;width:30px;height:30px;;position:relative;">

                    <div    style="display: inline-block;border:0px; padding: 0px; margin: 0px;background-color: black;position:absolute;width:8px;height:8px;left:0px;top:0px;background-color:darkgray;"></div>

                    <div    style="display: inline-block;border:0px; padding: 0px; margin: 0px;background-color: black;position:absolute;width:8px;height:8px;left:16px;top:0px;background-color:darkgray;"></div>

                    <div    style="display: inline-block;border:0px; padding: 0px; margin: 0px;background-color: black;position:absolute;width:8px;height:8px;left:8px;top:8px;background-color:darkgray;"></div>

                    <div    style="display: inline-block;border:0px; padding: 0px; margin: 0px;background-color: black;position:absolute;width:8px;height:8px;left:0px;top:16px;background-color:darkgray;"></div>

                    <div    v-bind:refresh='refresh'
                            style="border:0px; padding: 0px; margin: 0px;padding-left:15px;font-family: Helvetica;color: darkgray;font-weight: bold;letter-spacing: -2px;font-size: 28px;line-height: 1;display: inline-block;top:0px;position:absolute;left:20px;width:300px;">
                         YAZZ AppStore
                    </div>
            </div>


    </div>


    <div    class=""
            v-bind:refresh='refresh'
            style='position: relative; padding:0;margin:0; width: 100%; background-color: black;height:800px;'>


        <div v-bind:refresh='refresh'
             style='position: relative;background-color: black; color: black; padding-top: 0px;padding-bottom: 20px;overflow-y:hidden; overflow-x: auto;white-space: nowrap;height:400px;padding-right:200px;margin-left:30px;margin-right:30px;z-index:0;'>

            <div    v-for="(item, index) in intro_apps"
                    v-bind:refresh='refresh'
                    v-on:mouseenter="preview_app_loaded = false; preview_app_id = item.data.id;previewApp(item.data.id)"
                    v-on:mouseleave="preview_app_loaded = false; preview_app_id = null;"
                    style='display: inline-block; margin: 20px;position: relative;border:0px solid lightgray;vertical-align: text-top;'
                    class='app_card'>

                <div    v-bind:refresh='refresh'
                        v-bind:style='"-webkit-box-shadow: 10px 10px 300px -45px rgba(69,67,47,1);-moz-box-shadow: 10px 10px 300px -45px rgba(69,67,47,1);box-shadow: 10px 10px 300px -45px rgba(69,67,47,1);border-radius: 0px;border-width: 0px;margin:0px;padding:0px;width:100%;height:100%;" + (((preview_app_id == item.data.id) && preview_app_loaded)?"background-color:white;":"background-color:black;")'>

                        <div    v-if='(preview_app_id == item.data.id) && (!edit_app)'
                                v-bind:refresh='refresh'
                                style="position:relative;left:0px;top;0px;color:black;background-color:white;background:white;width:100%;height:100%;overflow: auto;">

                            <div    v-if='(preview_app_id == item.data.id) '
                                    v-bind:refresh='refresh'
                                    v-on:mouseover="$event.stopPropagation();$event.preventDefault();"
                                    v-on:click="$event.stopPropagation();$event.preventDefault();"
                                    v-on:mousedown="$event.stopPropagation();$event.preventDefault();"
                                    v-on:mouseup="$event.stopPropagation();$event.preventDefault();"
                                    style="opacity:.7;z-index:2147483647;position:absolute;left:0px;top;0px;color:black;background-color:lightblue;width:100%;height:100%;">

                                    <img    v-if='(preview_app_id == item.data.id) && preview_app_loaded'
                                            v-bind:src='app_logos[item.data.id]'
                                            style='position:relative;max-width: 75%; left:0px; top: 10px;max-height: 150px;margin-left: auto;margin-right: auto;display: block;z-index:0;'
                                            v-bind:alt='app_logos[item.data.id]'
                                            v-on:click='editApp($event,item.data.id)'
                                            >
                                    </img>

                                    <button style='position:absolute;top:250px;left:20px;opacity:0.9;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);border-radius: 5px;margin-bottom:10px;margin-left:40px;padding:10px;font-size:20px;z-index:2147483647;'
                                            class='btn btn-dark btn-sm'
                                            v-on:click='window.location.href=location.protocol + "//" + location.hostname + ":" + location.port + "/app/" + item.data.id + ".html"'>
                                            <img    src='/driver_icons/play.png'
                                                    style='position:relative;max-width: 40px; left:0px; top: 0px;max-height: 40px;margin-left: auto;margin-right: auto;display: inline-block;'
                                                    >
                                            </img>
                                        Play
                                    </button>


                                    <button style='position:absolute;top:250px;left:140px;opacity:0.9;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);border-radius: 5px;margin-bottom:10px;margin-left:40px;padding:10px;font-size:20px;z-index:2147483647;'
                                            class='btn btn-dark btn-sm'
                                            v-on:click='showProgressBar();editApp($event,item.data.id)'>
                                            <img    src='/driver_icons/edit.png'
                                                    style='position:relative;max-width: 40px; left:0px; top: 0px;max-height: 40px;margin-left: auto;margin-right: auto;display: inline-block;'
                                                    >
                                            </img>
                                        Edit
                                    </button>





                            </div>
                        </div>





                        <div v-if="preview_app_id != item.data.id"
                             style='border-radius: 0px;padding:0px; margin:0;'
                             v-on:click='editApp($event,item.data.id)'>
                            <img    v-if='(app_logos[item.data.id] && (app_logos[item.data.id] != ""))'
                                    v-bind:src='app_logos[item.data.id]'
                                    style='position:relative;max-width: 75%; left:0px; top: 10px;max-height: 150px;margin-left: auto;margin-right: auto;display: block;'
                                    v-bind:alt='app_logos[item.data.id]'
                                    v-on:click='editApp($event,item.data.id)'
                                    >
                            </img>

                            <a  v-on:click='editApp($event,item.data.id)'
                                class="nav-link active" href="#" style="position: absolute; bottom:0px;font-style:bold;width:90%;overflow-x: hidden;white-space: nowrap;font-size: 20px;color:white;">

                                {{item.data.id}}
                            </a>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div style='margin-top:1000px; text-align: center;'>
        Surprises :)

        <button style='margin-bottom:10px;' class='btn btn-primary btn-sm' v-on:click='copyAndEditApp($event,"vb")'>
            Kitchen Sink
        </button>

        <button style='margin-bottom:10px;' class='btn btn-primary btn-sm' v-on:click='copyAndEditApp($event,"kinetic")'>
            Kinetic app
        </button>

        <button style='margin-bottom:10px;' class='btn btn-primary btn-sm' v-on:click='copyAndEditApp($event,"game")'>
            Make 3d app
        </button>

        <button style='margin-bottom:10px;' class='btn btn-primary btn-sm' v-on:click='copyAndEditApp($event,"todo")'>
            To Do app
        </button>

        <button style='margin-bottom:10px;' class='btn btn-primary btn-sm' v-on:click='copyAndEditApp($event,"new")'>
            Hello World app
        </button>


        <button style='margin-bottom:10px;' class='btn btn-primary btn-sm' v-on:click='copyAndEditApp($event,"bubblesort")'>
            Bubble Sort
        </button>

    </div>
</div>`
      ,

    data: function() {
        return {
                    preview_app_id: null,
                    preview_app_loaded: false,
                    apps:           [],
                    app_type:       "bubblesort",
                    intro_apps:     [],
                    loaded_app:     new Object(),
                    refresh:        0,
                    edit_app:       null,
                    app_logos:    new Object()
                }},

    mounted: async function() {
        mm = this


       //
       // search
       //
       var sql2 =    `SELECT  id, base_component_id, logo_url, read_write_status
                         FROM
                     system_code
                         where
                             code_tag = 'LATEST'
                                 and
                             visibility = 'PUBLIC'
                     order by base_component_id asc; `

       var results2 = await callComponent(
           {
                driver_name:    "systemFunctions2",
                method_name:    "sql"
           }
           ,
           {
               sql: sql2
           })

        for (  var ee = 0 ; ee < results2.length ; ee++  ) {
            //alert(JSON.stringify(results2[ee],null,2))
            await mm.addApp(results2[ee].base_component_id)
            mm.app_logos[results2[ee].base_component_id] = results2[ee].logo_url

       }
       mm.refresh++







        this.$root.$on('message', async function(text) {
            if (text.type == "insert_app_at") {
                await mm.addLogoForApp(text.base_component_id)
                await mm.addApp(text.base_component_id)
                mm.edit_app = text.base_component_id
                mm.preview_app_id = null
                mm.preview_app_loaded = false
                mm.refresh++
            }

            if (text.type == "close_app") {
                mm.edit_app = null;
                mm.refresh++
            }

        })

//zzz
         globalEventBus.$on('new-appshare-app-uploaded',
            async function(data) {
                await mm.addLogoForApp(data)
                await mm.addApp(data)
                setTimeout(function() {
                      mm.editApp(null, data)
                },250)
         });

      },



      methods: {
          previewApp: function(appId) {
                var mm = this

                if (mm.preview_app_id) {

                    mm.preview_app_loaded = true
                    mm.refresh ++
                    mm.$forceUpdate();
                }
          }
          ,
          addLogoForApp: async function(appId) {
              mm = this


             //
             // search
             //
             var sql2 =    `SELECT  base_component_id, logo_url
                               FROM
                           system_code
                               where
                                   base_component_id = '${appId}'; `

             var results2 = await callComponent(
                 {
                      driver_name:    "systemFunctions2",
                      method_name:    "sql"
                 }
                 ,
                 {
                     sql: sql2
                 })

              if (results2.length > 0) {
                mm.app_logos[appId] = results2[0].logo_url
              };

             mm.refresh++

          },

            addApp: async function(baseComponentId) {
              if (baseComponentId) {
                  var app = {
                                type: "app",
                                data:
                                    {
                                        id: baseComponentId
                                    }
                              }

                  mm.loaded_app[baseComponentId] = true
                  component_loaded[baseComponentId] = false
                  dev_app_component_loaded[baseComponentId] = false
                  component_cache[baseComponentId] = null
                  //await loadV2(baseComponentId)
                  mm.intro_apps.push( app  )
                  mm.refresh++
              }
              return null
          },
          copyApp: async function(  baseComponentId ) {
              callDriverMethod( {driver_name: "copyApp",
                                 method_name: "copyAppshareApp"}
                                ,{base_component_id:    baseComponentId}
                          ,
                          async function(result) {
                              await mm.addApp(result.base_component_id)

                          })
          },
          copyAndEditApp: async function(event,  baseComponentId ) {
              var mm = this
              callDriverMethod( {driver_name: "copyApp",
                                 method_name: "copyAppshareApp"}
                                ,{base_component_id:    baseComponentId}
                          ,
                          async function(result) {
                              await mm.addLogoForApp(result.base_component_id)

                              await mm.addApp(result.base_component_id)
                              setTimeout(function() {
                                    mm.editApp(event, result.base_component_id)
                              },50)

                          })
          },


          editApp: async function(event,item) {
              if (event) {
                  event.stopPropagation()
              }
              //zzz
              if (!component_loaded[item]) {
                 await loadV2([item])
              }

              this.edit_app = item;
              mm.preview_app_id = null
              mm.preview_app_loaded = false
              mm.refresh ++
          }


      }
    })

}
