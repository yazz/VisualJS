async function(args) {
/*
created_timestamp(-1)
base_component_id("homepage")
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




    Vue.component('homepage', {

      template:
`<div   v-bind:refresh='refresh'
        style="overflow-y:auto;overflow-x: auto;width:100%;height:100%;">


    <!-- ------------------------------------------------ 
    
    Show the app editor if open
    
    ------------------------------------------------ -->
    <div    v-for="(item, index) in intro_apps"
            v-bind:refresh='refresh'
            v-if="(edit_app == item.data.id)"
            v-on:mouseenter="preview_app_loaded = false; preview_app_id = item.data.id;previewApp(item.data.id)"
            v-on:mouseleave="preview_app_loaded = false; preview_app_id = null;"
            style='display: inline-block; margin: 20px;position: relative;border:0px solid lightgray;vertical-align: text-top;'
            class='app_card'>

        <div    v-if="(edit_app == item.data.id)"
                v-bind:refresh='refresh'
                style="position: fixed; left:0px; top:0px; height:100%; width: 100vw ;z-index: 200000;background-color: white;overflow-y:none; padding: 0px;">

                <component  id="editor_component2"
                            v-if='isValidObject(item.data)'
                            :is='"app_editor_3"'
                            v-bind:app_id='item.data.id'
                            v-bind:card_index='index'>
                </component>
        </div>
    </div>





    <!-- ------------------------------------------------ 
    
    Show the Yazz logo and top tabs
    
    ------------------------------------------------ -->
    <div    style='vertical-align:top;padding:10px; margin:0;padding-top: 15px;padding-bottom: 0px;padding-bottom:0px; background-color: black;font-weight: bold;padding-left: 27px;'
            v-if="(!edit_app)"
            v-bind:refresh='refresh'>

            <div    v-bind:refresh='refresh'
                    style="display: inline-block;border:0px; padding: 0px; margin: 0px;padding-left:15px;width:36px;height:36px;;position:relative;">

                    <div    style="display: inline-block;border:0px; padding: 0px; margin: 0px;background-color: black;position:absolute;width:10px;height:10px;left:0px;top:0px;background-color:red;"></div>

                    <div    style="display: inline-block;border:0px; padding: 0px; margin: 0px;background-color: black;position:absolute;width:10px;height:10px;left:20px;top:0px;background-color:red;"></div>

                    <div    style="display: inline-block;border:0px; padding: 0px; margin: 0px;background-color: black;position:absolute;width:10px;height:10px;left:10px;top:10px;background-color:red;"></div>

                    <div    style="display: inline-block;border:0px; padding: 0px; margin: 0px;background-color: black;position:absolute;width:10px;height:10px;left:0px;top:20px;background-color:red;"></div>


                    <div    v-bind:refresh='refresh'
                            style="border:0px; padding: 0px; margin: 0px;padding-left:15px;font-family: Helvetica;color: darkgray;font-weight: bold;letter-spacing: 0px;font-size: 9px;line-height: 1;display: inline-block;top:0px;position:absolute;left:20px;">
                         <div    v-bind:refresh='refresh'
                                 style="border:0px; padding: 0px; margin: 0px;padding-left:15px;font-family: Helvetica;color: darkgray;font-weight: bold;letter-spacing: 0px;font-size: 16px;line-height: 1;display: inline-block;top:0px;left:-20px;">
                                 <a      href="https://yazz.com"
                                         target=new
                                         v-bind:refresh='refresh'
                                         style='font-size:2rem;color:white;'>
                                         Yazz

                                 </a>
                         </div>
                    </div>
            </div>
            <a href="#"  v-bind:style='"text-align: center;display: inline-block;color:white;position:relative;left:100px;height:40px;padding:5px;width:40%;"
                                + ((main_tab=="apps")?"background-color: black;black;color:lightgray;":"background-color: darkgray;black;color:black;")'
                 v-on:click='main_tab="apps"'
                                >
              Downloaded apps
            </a>
          <a href="#" v-bind:style='"text-align: center;display: inline-block;color:white;position:relative;right:0px;width:40%;height:40px;padding:5px;"
               + ((main_tab=="store")?"background-color: black;color:lightgray;":"background-color: darkgray;color:black;")'
               v-on:click='main_tab="store"'
               >
              App Store
          </a>
    </div>




    <!-- ------------------------------------------------ 

    Show the top buttons, New App, etc
    
    ------------------------------------------------ -->
    <div    style='vertical-align:top;padding:10px; margin:0;padding-top: 15px;padding-bottom: 0px;padding-bottom:0px; background-color: black;font-weight: bold;padding-left: 27px;'
            v-if="(!edit_app) && (main_tab=='apps')"
            v-bind:refresh='refresh'>
            
        <h1 style='vertical-align:top;display:inline-block;font-size:100px; text-align: center;margin: 0px;padding-left:70px;'>

            <button style='opacity:0.7;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);border-radius: 40px;margin-bottom:10px;margin-left:40px;padding:25px;font-size:45px;font-weight: bold;'
                    class='btn btn-lg'
                    v-on:click='copyAndEditApp($event,"yazz_blank")'>
                    <img    src='/driver_icons/blocks.png'
                            style='position:relative;max-width: 70px; left:0px; top: 0px;max-height: 70px;margin-left: auto;margin-right: auto;display: inline-block;'
                            >
                    </img>
                New dApp
            </button>





            <form       id="uploadfilefromhomepageform"
                        method="POST"
                        style="display:none;"
                        enctype="multipart/form-data"
                        action="/file_upload_single"  >

                <input  type="file"
                        id="uploadfilefromhomepage"
                        name="uploadfilefromhomepage"
                        multiple
                        style="display:none;"
                        v-on:change="submitFormAjax();"
                        />
            </form>


            <form       id="openfilefromhomepageform"
                        method="POST"
                        style="display:none;"
                        enctype="multipart/form-data"
                        action="/file_open_single"  >

                <input  type="file"
                        id="openfilefromhomepage"
                        name="openfilefromhomepage"
                        multiple
                        style="display:none;"
                        v-on:change="openFileChange();"
                        />
            </form>

            <div    v-if="showFilePicker"
                    style="position: fixed;left:10vw;top:5vh;width:80vw;height:80vh; z-index: 200000;opacity:1;background-color: white;font-size: 20px;">

                    <div    style="font-size: 40px;"
                            >
                            Choose a .yazz file
                    </div>

                <div style="width:80vw;height:5vh; background-color: black;color:white;font-size: 30px;" class="text-left">
                    <button     class="btn btn"
                                style='margin:2px;margin-right:50px;background-color: darkgray;'
                                v-on:click="chosenFolderUp();"
                           >

                        Up
                    </button>

                    {{open_file_path}}
                </div>

                <div    style="width:80vw;height:50vh; background-color: white; overflow:scroll;"
                        class="text-left">

                    <div    v-for="(file_or_folder_item, index) in open_file_list"
                            v-bind:refresh='refresh'
                            v-bind:style='"background-color: " + (file_or_folder_item.type == "folder"?"darkgray":"lightgray") + "; margin:0px;height:auto;"'
                            v-on:click='selectOpenFileOrFolder(file_or_folder_item)'
                            class="text-left"
                            >
                                {{file_or_folder_item.name}}
                    </div>
                </div>



                <div>



                    <button

                            class="btn btn-danger btn-lg"
                           style='opacity:0.7;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);border-radius: 40px;margin-bottom:10px;margin-left:40px;padding:25px;font-size:45px;font-weight: bold; background-color:lightgray;color:black;display:inline;'
                           v-on:click="showFilePicker=false"
                           >

                            <img    src='/driver_icons/cancel.svg'
                                    style='position:relative;max-width: 70px; bottom:0px; left: 0px;max-height: 70px;margin-left: auto;margin-right: auto;display: inline-block;'
                                    >
                            </img>

                        Cancel
                    </button>
                </div>


            </div>


            <button
                   class="btn btn-danger btn-lg"
                   style='opacity:0.7;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);border-radius: 40px;margin-bottom:10px;margin-left:40px;padding:25px;font-size:45px;font-weight: bold; background-color:lightgray;color:black;'
                   v-on:click="importApp();"
                   >

                    <img    src='/driver_icons/import.svg'
                            style='position:relative;max-width: 70px; left:0px; top: 0px;max-height: 70px;margin-left: auto;margin-right: auto;display: inline-block;'
                            >
                    </img>

                Import
            </button>


            <button
                   class="btn btn-danger btn-lg"
                   style='opacity:0.7;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);border-radius: 40px;margin-bottom:10px;margin-left:40px;padding:25px;font-size:45px;font-weight: bold; background-color:lightgray;color:black;'
                   v-on:click="if (electron) {openFileElectron();} else {openFile();}"
                   >

                    <img    src='/driver_icons/fileopen.png'
                            style='position:relative;max-width: 70px; left:0px; top: 0px;max-height: 70px;margin-left: auto;margin-right: auto;display: inline-block;'
                            >
                    </img>

                Open file
            </button>
          
        </h1>
    </div>








    <!-- ------------------------------------------------ 

    Show the "Downloaded" apps
    
    ------------------------------------------------ -->
    <div    class=""
            v-bind:refresh='refresh'
            style='position: relative; padding:0;margin:0; width: 100%; background-color: black;height:800px;'
            v-if="(main_tab=='apps')"
            >


        <div v-bind:refresh='refresh'
             class='force_scrollbars'
             style='position: relative;background-color: black; color: black; padding-top: 0px;padding-bottom: 20px;overflow-y:hidden; overflow-x: auto;white-space: nowrap;height:400px;padding-right:200px;margin-left:0px;margin-right:0px;z-index:0;'>

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

                                    <div style="padding: 10px;">
                                        {{item.data.id}}
                                    </div>

                                    <img    v-if='(preview_app_id == item.data.id) && preview_app_loaded'
                                            v-bind:src='app_logos[item.data.id]'
                                            style='position:relative;max-width: 75%; left:0px; top: 10px;max-height: 150px;margin-left: auto;margin-right: auto;display: block;z-index:0;'
                                            v-bind:alt='app_logos[item.data.id]'
                                            v-on:click='editApp($event,item.data.id)'
                                            >
                                    </img>

                                    <button style='position:absolute;top:250px;left:20px;opacity:0.9;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);border-radius: 5px;margin-bottom:10px;margin-left:40px;padding:10px;font-size:20px;z-index:2147483647;'
                                            class='btn btn-dark btn-sm'
                                            v-on:click='openAppid(item.data.id);'>
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












    <!-- ------------------------------------------------ 

    Show the apps available in the appstore
    
    ------------------------------------------------ -->
    <div    class=""
            v-bind:refresh='refresh'
            style='position: relative; padding:0;margin:0; width: 100%; background-color: black;height:800px;'
            v-if="(main_tab=='store')"
    >


      <div v-bind:refresh='refresh'
           class='force_scrollbars'
           style='position: relative;background-color: black; color: black; padding-top: 0px;padding-bottom: 20px;overflow-y:hidden; overflow-x: auto;white-space: nowrap;height:400px;padding-right:200px;margin-left:0px;margin-right:0px;z-index:0;'>

        <div    v-for="(item, index) in appstore_apps"
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

                <div style="padding: 10px;">
                  {{item.data.id}}
                </div>

                <img    v-if='(preview_app_id == item.data.id) && preview_app_loaded'
                        v-bind:src='app_logos[item.data.id]'
                        style='position:relative;max-width: 75%; left:0px; top: 10px;max-height: 150px;margin-left: auto;margin-right: auto;display: block;z-index:0;'
                        v-bind:alt='app_logos[item.data.id]'
                        v-on:click='editApp($event,item.data.id)'
                >
                </img>

                <button style='position:absolute;top:250px;left:20px;opacity:0.9;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);border-radius: 5px;margin-bottom:10px;margin-left:40px;padding:10px;font-size:20px;z-index:2147483647;'
                        class='btn btn-dark btn-sm'
                        v-on:click='openAppid(item.data.id);'>
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


</div>`
      ,

    data: function() {
        return {
                    main_tab:       "apps",
                    preview_app_id: null,
                    preview_app_loaded: false,
                    apps:           [],
                    app_type:       "bubblesort",
                    intro_apps:     [],
                    appstore_apps:     [],
                    loaded_app:     new Object(),
                    refresh:        0,
                    edit_app:       null,
                    app_logos:    new Object(),
                    showFilePicker: false,
                    open_file_path: "/",
                    open_file_path_dirs: ["/"],
                    open_file_list: [],
                    open_file_name: "",
                    electron: false
                }},

    mounted: async function() {
        mm = this
        if ((typeof($RUNNING_IN_ELECTRON) !== 'undefined')  && $RUNNING_IN_ELECTRON) {
            this.electron = true
        }


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

       var results2 = await callApp(
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
                mm.open_file_name = ""
                mm.open_file_path = "/"
                saveCodeToFile = null

                mm.refresh++
            }

        })


         globalEventBus.$on('new-appshare-app-uploaded',
            async function(data) {
                await mm.addLogoForApp(data)
                await mm.addApp(data)
                setTimeout(function() {
                      mm.editApp(null, data)
                },250)
         });


         await mm.loadAppStoreApps()

      },



      methods: {
          loadAppStoreApps: async function() {
          //debugger
              this.appstore_apps.push(
                  {
                  //zzz
                      data: {
                          id: 1
                      }
                  })
              this.app_logos[1] = "data:image/jpeg;base64,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"

          }
            ,

          openFile: async function() {
              //alert(1)
             //document.getElementById("openfilefromhomepage").click();
             this.showFilePicker = true
             var result = await callFunction(
                                 {
                                     driver_name: "serverGetHomeDir",
                                     method_name: "serverGetHomeDir"  }
                                     ,{ })
            if (result) {
                this.open_file_path = result.value
            }
            var result2 = await callFunction(
                                {
                                    driver_name: "serverFolderContents",
                                    method_name: "serverFolderContents"  }
                                    ,{
                                            path: this.open_file_path
                                    })
           if (result2) {
               this.open_file_list = result2
           }

            //
         },
         openFileElectron() {

                //let openfileurl = "/file_name_load?file_name_load=" + encodeURI(saveCodeToFile) + "&client_file_upload_id=" + encodeURI(file_upload_uuid)
                let openfileurl = "/electron_file_open"

                //console.log("openfileurl:= " + openfileurl)
                callAjax( openfileurl,
                    function(res) {
                        console.log(res)
                    })
         }
         ,
         selectOpenFileOrFolder: async function(fileorFolder) {
            //
            // if this is a folder
            //
            if (fileorFolder.type == "folder") {
                if (isWin) {
                    this.open_file_path += "\\" + fileorFolder.name
                } else {
                    this.open_file_path += "/" + fileorFolder.name
                }
               var result2 = await callFunction(
                                   {
                                       driver_name: "serverFolderContents",
                                       method_name: "serverFolderContents"  }
                                       ,{
                                               path: this.open_file_path
                                       })
              if (result2) {
                  this.open_file_list = result2
              }


          //
          // otherwise if this is a file
          //
          } else {
              this.showFilePicker=false
              this.open_file_name = this.open_file_path + "/" + fileorFolder.name


              //alert(this.open_file_name)
              saveCodeToFile = this.open_file_name

              file_upload_uuid = uuidv4()
              let openfileurl = "/file_name_load?file_name_load=" + encodeURI(saveCodeToFile) + "&client_file_upload_id=" + encodeURI(file_upload_uuid)
              //console.log("openfileurl:= " + openfileurl)
              callAjax( openfileurl,
                  function(res) {
                      console.log(res)
                  })

          }

           //
        },
        chosenFolderUp:  async function() {
            //alert(1)
           //document.getElementById("openfilefromhomepage").click();
           let lastFolderIndex = null
           //debugger

           if (isWin) {
               lastFolderIndex = this.open_file_path.lastIndexOf("\\")
               if (lastFolderIndex == (this.open_file_path.length - 1)) {
                   this.open_file_path = this.open_file_path.substring(0,this.open_file_path.length - 1)
                   lastFolderIndex = this.open_file_path.lastIndexOf("\\")
               }

               //
               // if we have gone all the way up to c: then we may not find a
               // final backslash (\) symbol
               //
               if (lastFolderIndex == -1) {
                   this.open_file_path = this.open_file_path.substring(0,2) + "\\"


               } else {
                   this.open_file_path = this.open_file_path.substring(0,lastFolderIndex) + "\\"
               }
           } else {
               lastFolderIndex = this.open_file_path.lastIndexOf("/")
               this.open_file_path = this.open_file_path.substring(0,lastFolderIndex)
           }


              var result2 = await callFunction(
                                  {
                                      driver_name: "serverFolderContents",
                                      method_name: "serverFolderContents"  }
                                      ,{
                                              path: this.open_file_path
                                      })
             if (result2) {
                 this.open_file_list = result2
             }


       },



         importApp: function() {
             //alert(1)
            saveCodeToFile = null
            document.getElementById("uploadfilefromhomepage").click();
           //
        },
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
                                   code_tag = 'LATEST'
                                       and
                                   base_component_id = '${appId}'; `

             var results2 = await callApp(
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

          openAppid: async function(appId) {
              mm = this


             //
             // search
             //
             var sql2 =    `SELECT  base_component_id, logo_url, code
                               FROM
                           system_code
                               where
                                   code_tag = 'LATEST'
                                       and
                                   base_component_id = '${appId}'; `

             var results2 = await callApp(
                 {
                      driver_name:    "systemFunctions2",
                      method_name:    "sql"
                 }
                 ,
                 {
                     sql: sql2
                 })

              if (results2.length > 0) {
                var code  = results2[0].code
                //alert(code)
                var rest_api_base_url = saveHelper.getValueOfCodeString(code, "rest_api")
                if (rest_api_base_url) {
                    window.open(location.protocol + "//" + location.hostname + ":" + location.port + "/" + rest_api_base_url, appId)
                } else {
                    window.open(location.protocol + "//" + location.hostname + ":" + location.port + "/app/" + appId + ".html", appId)
                }
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

              this.open_file_name = ""
              this.open_file_path = "/"
              saveCodeToFile = null



              var result = await callApp(
                                {
                                    driver_name: "copyApp",
                                    method_name: "copyAppshareApp"
                                }
                                ,
                                {
                                    base_component_id:    baseComponentId
                                })

              await mm.addLogoForApp(result.base_component_id)

              await mm.addApp(result.base_component_id)
              setTimeout(function() {
                    mm.editApp(event, result.base_component_id)
              },50)


          },


          editApp: async function(event,item) {
              if (event) {
                  event.stopPropagation()
              }

              if (!component_loaded[item]) {
                 await loadV2([item])
              }

              this.edit_app = item;
              mm.preview_app_id = null
              mm.preview_app_loaded = false
              mm.refresh ++
          }
          ,
          submitFormAjax: function() {
            let xmlhttp= window.XMLHttpRequest ?
                new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");



            var form = document.getElementById('uploadfilefromhomepageform');
            var formData = new FormData(form);

            xmlhttp.open("POST","/file_upload_single",true);
            xmlhttp.send(formData);
        }
        ,
        openFileChange: function() {
          let xmlhttp= window.XMLHttpRequest ?
              new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");



          var form = document.getElementById('openfilefromhomepageform');
          var formData = new FormData(form);

          xmlhttp.open("POST","/file_open_single",true);
          xmlhttp.send(formData);
      }

      }
    })

}
