async function(args) {
/* The homepage app shows all the apps and components that are being edited
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

    /* Vue component for desktop homepage
      ----------------------------------------------
      ----------------------------------------------
      ----------------------------------------------
      ----------------------------------------------
      ----------------------------------------------
      ----------------------------------------------

        This contains everything needed to show the appstore and editable apps. Note that there should
        be a sister page to this called "mobile_homepage" which is almost identical, except that it
        only has the code for playing apps, not editing them


        Main data structures:
        --------------------


        editable_app_list - This is a list of the apps that are currently being edited
        -----------------
        [
            {
                type:               "app" <--- this is in error I think!
                base_component_id:  "todo"
                displayName:        "Todo App"
                code_id:            "Qmc9F1EaUDEau1nc3HV4Q7oJEHTqYRKz5x8HPZfThMEbWf"
                logo_url:           "/driver_icons/todo.png"
                component_type:     "app" / "component"
            }
        ]

        appstore_apps - This is a list of the apps and components in the appstore that are available, but they may not
        -------------   have been downloaded to thew browser for running or editing yet
        [
            {
                id:                   "demo_timer"
                base_component_id:    "demo_timer"
                logo:                 "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAS..."
                ipfs_hash:            "QmNkg8wo4X6L8LHtS1Pjbcpj8pgeNvZS2orHPBD23QuhjU"
                display_name:         "Timer demo"
            }
        ]

        To be documented:
        ----------------
        editingBaseComponentId:                 null
        editingCodeId:                          null
        lastEditedBaseComponentId:              null
        lastEditedCodeId:                       null
        lastHighlightedEditableCodeId:          null
        currentlyHighlightedEditableCodeId:     null
        currentlyHighlightedAppstoreBCI:        null
        app_store_component_logos_by_BCI:       new Object()
        hideImportButtons:                      true
        refresh:                                0
        showFilePicker:                         false
        open_file_path:                         "/"
        open_file_list:                         []
        open_file_name:                         ""
        disableHighlightEditableApp:            false
        listenerD:                              null
        debugMode:                              false
        homepageDebugViewName:                  null



    ------------------------------------------------------------------------------ */
    Yazz.component(
        {
            template:
                `<div   v-bind:refresh='refresh' style="overflow-y:auto;overflow-x: auto;width:100vw;height:100%;position: fixed; left:0px">
                
                    <!  ----------------------------------------    Show the debug mode    ---------------------------------------- -->
                    <!-- 
                     
                     
                     
                     
                     
                     
                     
                     -->
                    <!  ----------------------------------------------------------------------------------------------------------- -->
                    <div v-if="debugMode" style="background-color: whitesmoke; padding: 20px;">
                        <button style="margin: 20px;"
                                class='btn btn-lg btn-danger'
                                v-on:click='homepageDebugViewName = "homepage_vars"'>
                                  Show homepage vars
                        </button>




                      <!  --------------------------------------  Homepage vars  ------------------------------------>
                      <!--                                                                                               -->

                        <div v-if='homepageDebugViewName=="homepage_vars"' style="">
                      <pre>
    <div style="font-size:60px;font-weight: bold;">Homepage Vars</div>
lastEditedBaseComponentId:              {{ lastEditedBaseComponentId }}
lastEditedCodeId:                       {{ lastEditedCodeId }}
editingBaseComponentId:                 {{ editingBaseComponentId }}
editingCodeId:                          {{ editingCodeId }}
currentlyHighlightedEditableCodeId:     {{ currentlyHighlightedEditableCodeId }}
lastHighlightedEditableCodeId           {{ lastHighlightedEditableCodeId }}

editable_app_list:
{{ editable_app_list }}

                        
currentlyHighlightedAppstoreBCI:        {{ currentlyHighlightedAppstoreBCI }}
appstore_apps:                         
{{ appstore_apps }}
                        
                        
app_store_component_logos_by_BCI:       {{ app_store_component_logos_by_BCI }}
homepageDebugViewName:                  {{ homepageDebugViewName }}
hideImportButtons:                      {{ hideImportButtons }}
refresh:                                {{ refresh }}
showFilePicker:                         {{ showFilePicker }}
open_file_path:                         {{ open_file_path }}
open_file_list:                         {{ open_file_list }}
open_file_name:                         {{ open_file_name }}
disableHighlightEditableApp:            {{ disableHighlightEditableApp }}

                      </pre>
                    </div>





  
  
  
                        </div>
                      
                      <!  --------------------------------------  Show the currently edited app in the code editor   ------------------------------------>
                    <!--                                                                                               -->
                     
                     
                     
                     
                     
                     
                     
                    <!  ----------------------------------------------------------------------------------------------------------- -->
                    <div    v-for="(item, index) in editable_app_list"
                            v-bind:refresh='refresh'
                            v-if="(editingBaseComponentId == item.base_component_id)"
                            v-on:mouseenter="currentlyHighlightedEditableCodeId = item.code_id;"
                            v-on:mouseleave="currentlyHighlightedEditableCodeId = null;"
                            style='display: inline-block; margin: 20px;position: relative;border:0px solid lightgray;vertical-align: text-top;'
                            class='app_card'>
                      
                            <!  -----------------------------------
                            |                                      |
                            |    Show the list of editable apps    |
                            |                                      |
                            --------------------------------------
                            
                            Iterate through the apps in "editable_app_list"
                            
                            --------
                            | Params |
                            ------------------------------------------------------------------
                            |
                            |     editable_app_list: [
                            |     ----------------      base_component_id:  The "baseComponentId" or Type of the
                            |                           ------------------  app
                            |
                            |                           code_id:            The commit ID of the app. Sometimes the app
                            |                           --------            is not the latest version of the app, which
                            |                                               is why this is needed
                            |                         ]
                            |
                            ------------------------------------------------------------------------------ -->
                
                        <div    v-if="(editingBaseComponentId == item.base_component_id)"
                                v-bind:refresh='refresh'
                                style="position: fixed; left:0px; top:0px; height:100%; width: 100vw ;z-index: 200000;background-color: white;overflow-y:none; padding: 0px;">
                
                                <component  id="editor_component2"
                                            v-if='isValidObject(item)'
                                            :is='GLOBALS.baseComponentIdReturnsCommitId["app_editor_3"]'
                                            v-bind:arg_edit_base_component_id='item.base_component_id'
                                            v-bind:arg_edit_code_id='item.code_id'>
                                </component>
                        </div>
                    </div>
                    
                    <!-- -------------------------------------  Show the Yazz logo and top tabs   ------------------------------------------------ -->
                    <!-- 
                     
                     
                     
                     
                     
                     
                     
                     -->
                    <!  ----------------------------------------------------------------------------------------------------------- -->
                    <div    style='vertical-align:top;padding:10px; margin:0;padding-top: 15px;padding-bottom: 0px;padding-bottom:0px; background-color: black;font-weight: bold;padding-left: 27px;'
                            v-if="(!editingBaseComponentId)"
                            v-bind:refresh='refresh'>
                
                            <div    v-bind:refresh='refresh'
                                    style="display: inline-block;border:0px; padding: 0px; margin: 0px;padding-left:15px;width:36px;height:36px;;position:relative;">
                
                                    <div    style="display: inline-block;border:0px; padding: 0px; margin: 0px;background-color: black;position:absolute;width:10px;height:10px;left:0px;top:0px;background-color:red;"></div>
                
                                    <div    style="display: inline-block;border:0px; padding: 0px; margin: 0px;background-color: black;position:absolute;width:10px;height:10px;left:20px;top:0px;background-color:red;"></div>
                
                                    <div    style="display: inline-block;border:0px; padding: 0px; margin: 0px;background-color: black;position:absolute;width:10px;height:10px;left:10px;top:10px;background-color:red;"></div>
                
                                    <div    style="display: inline-block;border:0px; padding: 0px; margin: 0px;background-color: black;position:absolute;width:10px;height:10px;left:0px;top:20px;background-color:red;"></div>
                
                            </div>
                
                
                              <div    v-bind:refresh='refresh'
                                      style="border:0px; padding: 0px; margin: 0px;padding-left:15px;font-family: Helvetica;color: darkgray;font-weight: bold;letter-spacing: 0px;font-size: 9px;line-height: 1;display: inline-block;top:-10px;position:relative;left:-20px;">
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
                
                
                          <span>
                              <a      href="https://yazzapps.com"
                                      target=new
                                      v-bind:refresh='refresh'
                                      style='text-align: left;display: inline-block;color:white;position:relative;left:30px;height:40px;padding:5px;top: -10px;'>
                                Company
                        
                              </a>
                          </span>
                
                      
                        <span>
                          <a      href="https://discord.gg/7cauwRN9QB"
                                  target=new
                                  v-bind:refresh='refresh'
                                  style='text-align: left;display: inline-block;color:white;position:relative;left:30px;height:40px;padding:5px;top: -10px;'>
                            Discord
                        
                          </a>
                        </span>
                
                
                      <span>
                              <iframe src="https://ghbtns.com/github-btn.html?user=yazz&repo=yazz&type=star&count=true"
                                      frameborder="0" scrolling="0" width="150" height="25" title="GitHub"
                                      style="margin-left:40px"></iframe>
                            
                      </span>
                    </div>
                
                    <!-- ------------------------------------   Show the top buttons, New App, etc    -->
                    <!-- 
                     
                     
                     
                     
                     
                     
                     
                     -->
                    <!  ----------------------------------------------------------------------------------------------------------- -->
                    <div    style='vertical-align:top;padding:10px; margin:0;padding-top: 15px;padding-bottom: 0px;padding-bottom:0px; background-color: black;font-weight: bold;padding-left: 27px;'
                            v-if="(!editingBaseComponentId)"
                            v-bind:refresh='refresh'>
                            
                        <h1 style='width:100%;vertical-align:top;display:inline-block;font-size:100px; text-align: center;margin: 0px;padding-left:70px;'>
                
                
                
                
                          <button style='opacity:0.7;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);border-radius: 40px;margin-top:30;
                          margin-bottom:10px;margin-left:80px;padding:25px;font-size:60px;font-weight: bold;left:30%;'
                                  class='btn btn-lg'
                                  v-if="hideImportButtons"
                                  v-on:click='$event.stopPropagation();copyAndEditApp({base_component_id: "yazz_blank"})'>
                            <img    src='/driver_icons/blocks.png'
                                    style='position:relative;max-width: 100px; left:0px; top: 0px;max-height: 90px;margin-left: auto;margin-right: auto;display: inline-block;'
                            >
                            </img>
                            New App
                          </button>
                
                
                
                
                
                            <button style='opacity:0.7;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);border-radius: 40px;margin-bottom:10px;margin-left:40px;padding:25px;font-size:45px;font-weight: bold;'
                                    class='btn btn-lg'
                                    v-if="!hideImportButtons"
                                    v-on:click='$event.stopPropagation();copyAndEditApp({base_component_id: "yazz_blank"})'>
                                    <img    src='/driver_icons/blocks.png'
                                            style='position:relative;max-width: 70px; left:0px; top: 0px;max-height: 70px;margin-left: auto;margin-right: auto;display: inline-block;'
                                            >
                                    </img>
                                New App
                            </button>
                
                
                
                
                
                            <form       id="uploadfilefromhomepageform"
                                        method="POST"
                                        style="display:none;"
                                        enctype="multipart/form-data"
                                        action="/http_post_file_upload_single"  >
                
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
                                        action="/http_post_file_open_single"  >
                
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
                                   v-if="!hideImportButtons"
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
                                   v-on:click="openFile();"
                                   v-if="!hideImportButtons"
                                   >
                
                                    <img    src='/driver_icons/fileopen.png'
                                            style='position:relative;max-width: 70px; left:0px; top: 0px;max-height: 70px;margin-left: auto;margin-right: auto;display: inline-block;'
                                            >
                                    </img>
                
                                Open file
                            </button>
                          
                        </h1>
                    </div>

                    <!-- -----------------------------------    Show the "Editable" apps ------------------------------------------------ -->
                    <!-- 
                     
                     
                     
                     
                     
                     
                     
                     -->
                    <!  ----------------------------------------------------------------------------------------------------------- -->
                    <div    class="" v-bind:refresh='refresh' style='position: relative; padding:0;margin:0; width: 100%; background-color: black;height:auto;'>
                            <span style="font-size: 60px; color: white;">Editable Apps</span>

                            <!-- ---------------------------  Loop through the "Editable apps" and show clickable icons ------------------------------------------------ -->
                            <div v-bind:refresh='refresh'
                                 class='force_scrollbars'
                                 id="downloaded_apps"
                                 style='offsetleft:200;position: relative;background-color: black; color: black; padding-top: 0px;padding-bottom: 20px;overflow-y:hidden; overflow-x: auto;white-space: nowrap;height:400px;padding-right:200px;margin-left:0px;margin-right:0px;z-index:0;'>
                    
                                <div    v-for="(item, index) in editable_app_list"
                                        v-bind:refresh='refresh'
                                        v-bind:id='"appid_" + item.code_id'
                                        v-on:mouseenter="if (!disableHighlightEditableApp) {currentlyHighlightedEditableCodeId = item.code_id;}"
                                        v-bind:style='"display: inline-block; margin: 20px;position: relative;border:0px solid lightgray;vertical-align: text-top;  " + ((currentlyHighlightedEditableCodeId == item.code_id)?"top:0px;width:  330px;height: 330px;":"top:100px;width:  200px;height: 200px;")'>
                    
                                        <div    v-bind:refresh='refresh'
                                                v-bind:style='"-webkit-box-shadow: 10px 10px 300px -45px rgba(69,67,47,1);-moz-box-shadow: 10px 10px 300px -45px rgba(69,67,47,1);box-shadow: 10px 10px 300px -45px rgba(69,67,47,1);border-radius: 0px;border-width: 0px;margin:0px;padding:0px;width:100%;height:100%;" + (((currentlyHighlightedAppstoreBCI == item.base_component_id) )?"background-color:white;":"background-color:black;")'>
                        
                                                <div    v-if='(currentlyHighlightedEditableCodeId == item.code_id) && (!editingCodeId)' 
                                                        v-bind:refresh='refresh' 
                                                        style="position:relative;left:0px;top;0px;color:black;background-color:white;background:white;width:100%;height:100%;overflow: auto;">
                                                  
                                                        <div    v-if='(currentlyHighlightedEditableCodeId == item.code_id) '
                                                                v-bind:refresh='refresh'
                                                                v-on:mouseover="$event.stopPropagation();$event.preventDefault();"
                                                                v-on:click="$event.stopPropagation();$event.preventDefault();"
                                                                v-on:mousedown="$event.stopPropagation();$event.preventDefault();"
                                                                v-on:mouseup="$event.stopPropagation();$event.preventDefault();"
                                                                style="opacity:.7;z-index:2147483647;position:absolute;left:0px;top;0px;color:black;background-color:lightblue;width:100%;height:100%;">
                            
                                                                <div style="padding: 10px;">
                                                                    {{item.displayName}} {{(item.visibility?" - "+item.visibility:"")}} 
                                                                </div>
                                                                <div  v-if="item.code_id" 
                                                                      style="padding: 10px;">
                                                                    
                                                                      {{item.code_id.substring(0,5)}}...
                                                                </div>
                            
                                                                <img    v-if='(currentlyHighlightedEditableCodeId == item.code_id) '
                                                                        v-bind:src='item.logo_url'
                                                                        style='position:relative;max-width: 75%; left:0px; top: 10px;max-height: 150px;margin-left: auto;margin-right: auto;display: block;z-index:0;'
                                                                        v-bind:alt='item.base_component_id'
                                                                        v-on:click='$event.stopPropagation();editApp(item.base_component_id, item.code_id)'>
                                                                </img>
                            
                                                                <button style='position:absolute;top:250px;left:20px;opacity:0.9;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);border-radius: 5px;margin-bottom:10px;margin-left:40px;padding:10px;font-size:20px;z-index:2147483647;'
                                                                        class='btn btn-sm'
                                                                        v-if="item.component_type=='app'"
                                                                        v-on:click='runAppInNewBrowserTab(item.base_component_id);'>
                                                                  
                                                                        <img    src='/driver_icons/play.png'
                                                                                style='position:relative;max-width: 40px; left:0px; top: 0px;max-height: 40px;margin-left: auto;margin-right: auto;display: inline-block;'>
                                                                        </img>
                                                                    Play
                                                                </button>
                                                          
                                                                <button style='position:absolute;top:250px;left:140px;opacity:0.9;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);border-radius: 5px;margin-bottom:10px;margin-left:40px;padding:10px;font-size:20px;z-index:2147483647;'
                                                                        class='btn btn-sm'
                                                                        v-on:click='showProgressBar();$event.stopPropagation();editApp(item.base_component_id,item.code_id)'>
                                                                  
                                                                        <img    src='/driver_icons/edit.png'
                                                                                style='position:relative;max-width: 40px; left:0px; top: 0px;max-height: 40px;margin-left: auto;margin-right: auto;display: inline-block;'>
                                                                        </img>
                                                                    Edit
                                                                </button>                                                           
                                                        </div>
                                                </div>
                        
                                          
                                                <div  v-if="currentlyHighlightedEditableCodeId != item.code_id"
                                                      style='border-radius: 0px;padding:0px; margin:0;'
                                                      v-on:click='$event.stopPropagation();editApp(item.base_component_id,item.code_id)'>
                                                  
                                                      <img  v-if='item.logo_url'
                                                            v-bind:src='item.logo_url'
                                                            style='position:relative;max-width: 75%; left:0px; top: 10px;max-height: 150px;margin-left: auto;margin-right: auto;display: block;'
                                                            v-bind:alt='item.displayName'
                                                            v-on:click='$event.stopPropagation();editApp(item.base_component_id,item.code_id)'>
                                                      </img>
                        
                                                    <a  v-on:click='$event.stopPropagation();editApp(item.base_component_id,item.code_id)'
                                                        class="nav-link active" href="#" style="position: absolute; bottom:0px;font-style:bold;width:90%;overflow-x: hidden;white-space: nowrap;font-size: 20px;color:white;">
                        
                                                        {{item.displayName}}
                                                    </a>
                        
                                                </div>
                                            </div>
                                        </div>
                                </div>
                            </div>
                
                    <!-- -------------------------------------  Show the apps available in the appstore ------------------------------------------------ -->
                    <!-- 
                     
                     
                     
                     
                     
                     
                     
                     -->
                    <!  ----------------------------------------------------------------------------------------------------------- -->
                    <div    class=""
                            v-bind:refresh='refresh'
                            style='position: relative; padding:0;margin:0; width: 100%; background-color: black;height:auto;'>
                        <span style="font-size: 60px; color: white;">All Apps</span>
                        <div  v-bind:refresh='refresh'
                              class='force_scrollbars'
                              style='position: relative;background-color: black; color: black; padding-top: 0px;padding-bottom: 20px;overflow-y:hidden; overflow-x: auto;white-space: nowrap;height:400px;padding-right:200px;margin-left:0px;margin-right:0px;z-index:0;margin-bottom:80px;'>
                            <div    v-for="(item, index) in appstore_apps"
                                    v-bind:refresh='refresh'
                                    v-on:mouseenter=" currentlyHighlightedAppstoreBCI = item.base_component_id;"
                                    v-on:mouseleave=" currentlyHighlightedAppstoreBCI = null;"
                                    style='display: inline-block; margin: 20px;position: relative;border:0px solid lightgray;vertical-align: text-top;'
                                    class='app_card'>
                                <div    v-bind:refresh='refresh'
                                      v-bind:style='"-webkit-box-shadow: 10px 10px 300px -45px rgba(69,67,47,1);-moz-box-shadow: 10px 10px 300px -45px rgba(69,67,47,1);box-shadow: 10px 10px 300px -45px rgba(69,67,47,1);border-radius: 0px;border-width: 0px;margin:0px;padding:0px;width:100%;height:100%;" + (((currentlyHighlightedAppstoreBCI == item.id) )?"background-color:white;":"background-color:black;")'>
                    
                                <div    v-if='(currentlyHighlightedAppstoreBCI == item.base_component_id) && (!editingBaseComponentId)'
                                        v-bind:refresh='refresh'
                                        style="position:relative;left:0px;top;0px;color:black;background-color:white;background:white;width:100%;height:100%;overflow: auto;">
                    
                    
                    
                                  <div    v-if='(currentlyHighlightedAppstoreBCI == item.base_component_id) '
                                          v-bind:refresh='refresh'
                                          v-on:mouseover="$event.stopPropagation();$event.preventDefault();"
                                          v-on:click="$event.stopPropagation();$event.preventDefault();"
                                          v-on:mousedown="$event.stopPropagation();$event.preventDefault();"
                                          v-on:mouseup="$event.stopPropagation();$event.preventDefault();"
                                          style="opacity:.7;z-index:2147483647;position:absolute;left:0px;top;0px;color:black;background-color:lightblue;width:100%;height:100%;">
                    
                                    <div style="padding: 10px;">
                                      {{item.display_name}}
                                    </div>
                    
                                    <img    v-if='(currentlyHighlightedAppstoreBCI == item.base_component_id) '
                                            v-bind:src='app_store_component_logos_by_BCI[item.base_component_id]'
                                            style='position:relative;max-width: 75%; left:0px; top: 10px;max-height: 150px;margin-left: auto;margin-right: auto;display: block;z-index:0;'
                                            v-bind:alt='app_store_component_logos_by_BCI[item.base_component_id]'
                                            v-on:click='$event.stopPropagation();editApp(item.base_component_id)'>
                                    </img>
                    
                    
                                    <button style='position:absolute;top:250px;left:0px;opacity:0.9;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);border-radius: 5px;margin-bottom:10px;margin-left:40px;padding:10px;font-size:20px;z-index:2147483647;'
                                            class='btn btn-sm'
                                            v-if="item.component_type == 'app' "
                                            v-on:click='showProgressBar();$event.stopPropagation();(async function() {await downloadAndRunApp(item.ipfs_hash)})()'>
                                      <img    src='/driver_icons/play.png'
                                              style='position:relative;max-width: 60px; left:0px; top: 0px;max-height: 40px;margin-left: auto;margin-right: auto;display: inline-block;'
                                      >
                                      </img>
                                      Play
                                    </button>
                                    
                                    
                                    <button style='position:absolute;top:250px;left:160px;opacity:0.9;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);border-radius: 5px;margin-bottom:10px;margin-left:40px;padding:10px;font-size:20px;z-index:2147483647;'
                                            class='btn  btn-sm'
                                            v-on:click='showProgressBar();$event.stopPropagation();addToEditableAppsAndEdit(item.ipfs_hash)'>
                                      <img    src='/driver_icons/edit.png'
                                              style='position:relative;max-width: 60px; left:0px; top: 0px;max-height: 40px;margin-left: auto;margin-right: auto;display: inline-block;'
                                      >
                                      </img>
                                      Edit
                                    </button>
                    
                    
                    
                    
                    
                                  </div>
                                </div>
                    
                    
                    
                    
                    
                                <div v-if="currentlyHighlightedAppstoreBCI != item.id"
                                     style='border-radius: 0px;padding:0px; margin:0;'
                                     v-on:click='$event.stopPropagation();editApp(item.id)'>
                                  <img    v-if='(app_store_component_logos_by_BCI[item.id] && (app_store_component_logos_by_BCI[item.id] != ""))'
                                          v-bind:src='app_store_component_logos_by_BCI[item.id]'
                                          style='position:relative;max-width: 75%; left:0px; top: 10px;max-height: 150px;margin-left: auto;margin-right: auto;display: block;'
                                          v-bind:alt='app_store_component_logos_by_BCI[item.id]'
                                          v-on:click='$event.stopPropagation();editApp(item.id)'
                                  >
                                  </img>
                    
                                  <a  v-on:click='$event.stopPropagation();editApp(item.id)'
                                      class="nav-link active" href="#" style="position: absolute; bottom:0px;font-style:bold;width:90%;overflow-x: hidden;white-space: nowrap;font-size: 20px;color:white;">
                    
                                    {{item.display_name}}
                                  </a>
                    
                                </div>
                              </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`,
            data:       function() {
                // data for the Vue object - see top of file for more info
                return {
                            // editable apps
                            editingBaseComponentId:                 null,
                            editingCodeId:                          null,
                            lastEditedBaseComponentId:              null,
                            lastEditedCodeId:                       null,
                            editable_app_list:                      [],
                            lastHighlightedEditableCodeId:          null,
                            currentlyHighlightedEditableCodeId:     null,

                            // apps  not downloaded but in the appstore
                            currentlyHighlightedAppstoreBCI:        null,
                            appstore_apps:                          [],
                            app_store_component_logos_by_BCI:       new Object(),

                            // file load from disk options
                            hideImportButtons:                      true,
                            refresh:                                0,
                            showFilePicker:                         false,
                            open_file_path:                         "/",
                            open_file_list:                         [],
                            open_file_name:                         "",
                            disableHighlightEditableApp:            false,

                            // debug helpers
                            listenerD:                              null,
                            debugMode:                              false,
                            homepageDebugViewName:                  null
                        }
            },
            mounted:    async function() {
                /* mounted - when the homepage Vue component is first loaded
                ________________________________________
                |                                      |
                |             mounted                  |
                |                                      |
                |______________________________________|

                __________
                | PARAMS |______________________________________________________________
                |
                |     NONE
                |     ----
                |________________________________________________________________________ */
                let mm = this



                /*
                ____________________________________________________________
                |    mounted
                |_________________________
                                         |  Set the "d" key to allow debug view
                                         | to be shown if we are not in the
                                         | editor
                                         |__________________________________ */
                mm.listenerD = function(event) {
                    if (!yz.editor.inEditor) {
                        if (event.keyCode == 100) {
                            mm.debugMode = !mm.debugMode
                        }
                    }
                };
                document.addEventListener("keypress", mm.listenerD)






                /*
                ____________________________________________________________
                |    mounted
                |_________________________
                                         | Hide the more complex buttons by
                                         | default
                                         |__________________________________ */

                await onPageInitialized( async function() {
                    if (typeof($HIDEIMPORTBUTTONS) !== 'undefined') {
                        if ($HIDEIMPORTBUTTONS == 'true') {
                            mm.hideImportButtons = true
                        } else {
                            mm.hideImportButtons = false
                        }
                    } else {
                        mm.hideImportButtons = false
                    }
                    await mm.reloadEditedAppsFromServer();


                    /*
                    ____________________________________________________________
                    |    mounted
                    |_________________________
                                             | Add some events which update the
                                             | apps on the homepage
                                             |__________________________________ */
                    mm.$root.$on('message', async function(text) {
                        if (text.type == "insert_editable_component_on_homepage") {
                            await mm.addEditableComponentToHomepage(
                                text.base_component_id,
                                text.display_name,
                                {
                                    codeId:         text.ipfs_hash,
                                    logoUrl:        text.logo_url,
                                    componentType: "app"
                                })

                            mm.lastEditedBaseComponentId        = mm.editingBaseComponentId
                            mm.editingBaseComponentId           = text.base_component_id
                            mm.lastEditedCodeId                 = mm.editingCodeId
                            mm.editingCodeId                    = text.code_id
                            mm.currentlyHighlightedAppstoreBCI  = null
                            mm.refresh++
                        }


                        /*
                        ____________________________________________________________
                        |    mounted
                        |_________________________
                                                 | Rename an app on the
                                                 | homepage
                                                 |__________________________________ */
                        if (text.type == "update_editable_components_on_homepage") {
                            await mm.reloadEditedAppsFromServer()
                            mm.refresh++
                        }



                        /*
                        ____________________________________________________________
                        |    mounted
                        |_________________________
                                                 | Called when we close the currently
                                                 | edited app
                                                 |__________________________________ */
                        if (text.type == "close_app") {
                            mm.lastEditedBaseComponentId    = mm.editingBaseComponentId
                            mm.editingBaseComponentId       = null;
                            mm.lastEditedCodeId             = mm.editingCodeId
                            mm.editingCodeId                = null
                            mm.open_file_name               = ""
                            mm.open_file_path               = "/"
                            saveCodeToFile                  = null
                            globalEventBus.$emit('show_settings', {});
                            mm.refresh++
                        }





                        /*
                        ____________________________________________________________
                        |    mounted
                        |_________________________
                                                 | When we try to fork a component
                                                 | while already editing an app
                                                 |__________________________________ */
                        if (text.type == "fork_component") {
                            mm.lastEditedBaseComponentId        = mm.editingBaseComponentId
                            mm.editingBaseComponentId           = null;
                            mm.lastEditedCodeId                 = mm.editingCodeId
                            mm.editingCodeId                    = null
                            mm.open_file_name                   = ""
                            mm.open_file_path                   = "/"
                            saveCodeToFile                      = null
                            globalEventBus.$emit('show_settings', {});

                            setTimeout(async function() {
                                let bci = text.base_component_id
                                let cid = text.code_id
                                if (!isValidObject(cid)) {
                                    cid = GLOBALS.baseComponentIdReturnsCommitId[bci]
                                }
                                let fid = text.form_id
                                let cni = text.control_name
                                yz.editor.originalFormIdOfEditedUiControl           = fid
                                yz.editor.originalNameOfEditedUiControl             = cni
                                yz.editor.originalBaseComponentIdOfEditedUiControl  = bci
                                yz.editor.originalCodeIdOfEditedUiControl           = cid
                                await mm.copyAndEditApp(
                                    {base_component_id: bci  ,  code_id: cid})
                            },200)
                        }

                        /*
                        ____________________________________________________________
                        |    mounted
                        |_________________________
                                                 | When we try to edit a component
                                                 | while already editing an app
                                                 |__________________________________ */
                        if (text.type == "return_from_fork_component") {
                            mm.lastEditedBaseComponentId = mm.editingBaseComponentId
                            mm.editingBaseComponentId   = null;
                            mm.lastEditedCodeId         = mm.editingCodeId
                            mm.editingCodeId            = null
                            mm.open_file_name           = ""
                            mm.open_file_path           = "/"
                            saveCodeToFile              = null
                            globalEventBus.$emit('show_settings', {});

                            setTimeout(function() {
                                let bci = text.base_component_id
                                let cid = text.code_id
                                let fid = text.form_id
                                let cni = text.control_name
                                //yz.editor.originalFormIdOfEditedUiControl           = fid
                                //yz.editor.originalNameOfEditedUiControl             = cni
                                yz.editor.originalBaseComponentIdOfEditedUiControl  = bci
                                yz.editor.originalCodeIdOfEditedUiControl           = cid
                                setTimeout(async function() {
                                    await mm.editApp(bci,  text.code_id)
                                },50)
                            },200)
                        }








                        /*
                        ____________________________________________________________
                        |    mounted
                        |_________________________
                                                 | When we try to fork a component
                                                 | while already editing an app
                                                 |__________________________________ */
                        if (text.type == "edit_component") {
                            mm.lastEditedBaseComponentId    = mm.editingBaseComponentId
                            mm.editingBaseComponentId       = null;
                            mm.lastEditedCodeId             = mm.editingCodeId
                            mm.editingCodeId                = null
                            mm.open_file_name               = ""
                            mm.open_file_path               = "/"
                            saveCodeToFile                  = null
                            globalEventBus.$emit('show_settings', {});

                            setTimeout(async function() {
                                let bci = text.base_component_id
                                let cid = text.code_id
                                if ((!isValidObject(cid)) || (cid == "")) {
                                    cid = GLOBALS.baseComponentIdReturnsCommitId[bci]
                                }
                                let fid = text.form_id
                                let cni = text.control_name
                                yz.editor.originalFormIdOfEditedUiControl           = fid
                                yz.editor.originalNameOfEditedUiControl             = cni
                                yz.editor.originalBaseComponentIdOfEditedUiControl  = bci
                                yz.editor.originalCodeIdOfEditedUiControl           = cid
                                await mm.addToEditableAppsAndEdit(cid)
                            },200)
                        }

                        /*
                        ____________________________________________________________
                        |    mounted
                        |_________________________
                                                 | When we try to edit a component
                                                 | while already editing an app
                                                 |__________________________________ */
                        if (text.type == "return_from_edit_component") {
                            mm.lastEditedBaseComponentId = mm.editingBaseComponentId
                            mm.editingBaseComponentId   = null;
                            mm.lastEditedCodeId         = mm.editingCodeId
                            mm.editingCodeId            = null
                            mm.open_file_name           = ""
                            mm.open_file_path           = "/"
                            saveCodeToFile              = null
                            globalEventBus.$emit('show_settings', {});

                            setTimeout(function() {
                                let bci = text.base_component_id
                                let cid = text.code_id
                                let fid = text.form_id
                                let cni = text.control_name
                                //yz.editor.originalFormIdOfEditedUiControl           = fid
                                //yz.editor.originalNameOfEditedUiControl             = cni
                                yz.editor.originalBaseComponentIdOfEditedUiControl  = bci
                                yz.editor.originalCodeIdOfEditedUiControl           = cid
                                setTimeout(async function() {
                                    await mm.editApp(bci,  text.code_id)
                                },50)
                            },200)
                        }



                    })

                    /*
                    ____________________________________________________________
                    |    mounted
                    |_________________________
                                             | When we try to drag drop an app
                                             | into the Yazz editor
                                             |__________________________________ */
                    globalEventBus.$on('new-appshare-app-uploaded',
                        async function({baseComponentId, codeId, logoUrl, displayName}) {

                            await mm.addEditableComponentToHomepage(
                                baseComponentId,
                                displayName,
                                {
                                    codeId:         codeId,
                                    logoUrl:        logoUrl,
                                    componentType: "app"
                                })

                            setTimeout(async function() {
                                await mm.editApp(baseComponentId, codeId)
                            },250)
                        });


                    /*
                    ____________________________________________________________
                    |    mounted
                    |_________________________
                                             | Load apps from the app store
                                             |__________________________________ */
                    await mm.loadAppStoreApps()




                    /*
                    ____________________________________________________________
                    |    mounted
                    |_________________________
                                             | Highlight an app when this page
                                             | is loaded by looking for "id" in
                                             | the URL
                                             |__________________________________ */
                    let highlightAppOnStartup = getUrlParam("id")
                    if (highlightAppOnStartup) {
                        mm.highlightEditableComponent(highlightAppOnStartup)

                    }
                })
              },
            methods:    {
                // local filesystem stuff
                openFile:                           async function  ( ) {
                    /* Show the file open dialog box
                    ________________________________________
                    |                                      |
                    |                   openFile           |
                    |                                      |
                    |______________________________________|
                    Show the file open dialog box. This is mostly used for Electron or desktop
                    applications
                    __________
                    | PARAMS |______________________________________________________________
                    |
                    |     NONE
                    |________________________________________________________________________ */
                    //alert(1)
                    //document.getElementById("openfilefromhomepage").click();
                    this.showFilePicker = true
                    let result = await callComponent(
                        {
                            base_component_id: "serverGetHomeDir" }
                        ,{ })
                    if (result) {
                        this.open_file_path = result.value
                    }
                    let result2 = await callComponent(
                        {
                            base_component_id: "serverFolderContents"  }
                        ,{
                            path: this.open_file_path
                        })
                    if (result2) {
                        this.open_file_list = result2
                    }
                },
                openFileChange:                     function        ( ) {
                    /* openFileChange
                    ________________________________________
                    |                                      |
                    |      openFileChange                  |
                    |                                      |
                    |______________________________________|
                    Related to accessing components stored in files
                    __________
                    | PARAMS |______________________________________________________________
                    |
                    |     NONE
                    |________________________________________________________________________ */
                    let xmlhttp= window.XMLHttpRequest ?
                        new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");

                    let form = document.getElementById('openfilefromhomepageform');
                    let formData = new FormData(form);

                    xmlhttp.open("POST","/http_post_file_open_single",true);
                    xmlhttp.send(formData);
                },
                selectOpenFileOrFolder:             async function  ( fileOrFolder ) {
                    /* selectOpenFileOrFolder
                    ________________________________________
                    |                                      |
                    |          selectOpenFileOrFolder      |
                    |                                      |
                    |______________________________________|
                    Navigate when opening a file. This is mostly used for Electron or desktop
                    applications
                    __________
                    | PARAMS |______________________________________________________________
                    |
                    |     NONE
                    |________________________________________________________________________ */
                    //
                    // if this is a folder
                    //
                    if (fileOrFolder.type == "folder") {
                        if (isWin) {
                            this.open_file_path += "\\" + fileOrFolder.name
                        } else {
                            this.open_file_path += "/" + fileOrFolder.name
                        }
                        let result2 = await callComponent(
                            {
                                base_component_id: "serverFolderContents"}
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
                        this.open_file_name = this.open_file_path + "/" + fileOrFolder.name


                        //alert(this.open_file_name)
                        saveCodeToFile = this.open_file_name

                        file_upload_uuid = uuidv4()
                        let openfileurl = "/http_get_file_name_load?http_get_file_name_load=" + encodeURI(saveCodeToFile) + "&client_file_upload_id=" + encodeURI(file_upload_uuid)
                        //console.log("openfileurl:= " + openfileurl)
                        callAjax( openfileurl,
                            function(res) {
                                console.log(res)
                            })

                    }

                    //
                },
                chosenFolderUp:                     async function  ( ) {
                    /* Navigate when opening a file
                    ________________________________________
                    |                                      |
                    |          chosenFolderUp              |
                    |                                      |
                    |______________________________________|
                    Navigate when opening a file. This is mostly used for Electron or desktop
                    applications
                    __________
                    | PARAMS |______________________________________________________________
                    |
                    |     NONE
                    |________________________________________________________________________ */
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


                    let result2 = await callComponent(
                        {
                            base_component_id: "serverFolderContents"}
                        ,{
                            path: this.open_file_path
                        })
                    if (result2) {
                        this.open_file_list = result2
                    }


                },
                importApp:                          function        ( ) {
                    /* Import a file. This is mostly used for Electron or desktop
                    applications
                    ________________________________________
                    |                                      |
                    |               importApp              |
                    |                                      |
                    |______________________________________|
                    Import a file. This is mostly used for Electron or desktop
                    applications
                    __________
                    | PARAMS |______________________________________________________________
                    |
                    |     NONE
                    |________________________________________________________________________ */
                    saveCodeToFile = null
                    document.getElementById("uploadfilefromhomepage").click();
                },
                submitFormAjax:                     function        ( ) {
                    /* submitFormAjax
                    ________________________________________
                    |                                      |
                    |      submitFormAjax                  |
                    |                                      |
                    |______________________________________|
                    Used when uploading a file
                    __________
                    | PARAMS |______________________________________________________________
                    |
                    |     NONE
                    |________________________________________________________________________ */
                    let xmlhttp= window.XMLHttpRequest ?
                        new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");

                    let form = document.getElementById('uploadfilefromhomepageform');
                    let formData = new FormData(form);

                    xmlhttp.open("POST","/http_post_file_upload_single",true);
                    xmlhttp.send(formData);
                },

                // load apps from app store
                loadAppStoreApps:                   async function  ( ) {
                    //----------------------------------------------------------------------------------
                    //
                    //                    /-------------------------------------/
                    //                   /         loadAppStoreApps            /
                    //                  /-------------------------------------/
                    //
                    //----------------------------------------------------------------------------
                    // Load the apps from the app store
                    //--------------------------------------------------------------------
                    let mm = this

                    let openfileurl = "http" + (($HOSTPORT == 443)?"s":"") + "://" + $HOST + "/http_post_load_topapps"
                    fetch(openfileurl,
                        {
                            method: 'post',
                            credentials: "include"
                        })
                        .then((response) => response.json())
                        .then(function(responseJson)
                        {
                            for (let rt=0;rt<responseJson.length; rt++) {

                                for (let thisApp of mm.appstore_apps) {
                                    if (thisApp.base_component_id ==  responseJson[rt].id) {
                                        continue
                                    }
                                }
                                mm.appstore_apps.push(responseJson[rt])
                                mm.app_store_component_logos_by_BCI[responseJson[rt].id] = responseJson[rt].logo
                            }

                        }).catch(err => {
                        //error block
                    })
                },
                highlightEditableComponent:         function        ( baseComponentId, codeid ) {
                    /*  highlightEditableComponent shows an editable componnent as larger on the home screen, like when selected
                    __________
                    | PARAMS |______________________________________________________________
                    |
                    |     baseComponentId   The base component ID of the highlighted app
                    |     ---------------
                    |
                    |________________________________________________________________________ */
                    let mm = this
                    setTimeout(function() {
                        mm.lastHighlightedEditableCodeId        = mm.currentlyHighlightedEditableCodeId
                        mm.currentlyHighlightedEditableCodeId   = codeId
                        let a = document.getElementById("downloaded_apps")
                        if (!a) {
                            return
                        }
                        let itemLeft = document.getElementById("appid_" + codeId)
                        if (!itemLeft) {
                            return
                        }
                        a.scrollLeft = itemLeft.offsetLeft
                        mm.disableHighlightEditableApp = true
                        setTimeout(function() {
                            mm.disableHighlightEditableApp = false
                        },4000)
                    },150)
                },
                addLogoForApp:                      async function  ( baseComponentId) {
                    /* Given the base component ID of a component, insert the logo image into the
                    local cache stored in "app_store_component_logos_by_BCI"
                    ________________________________________
                    |                                      |
                    |           addLogoForApp              |
                    |                                      |
                    |______________________________________|
                    Given the base component ID of a component, insert the logo image into the
                    local cache stored in "app_store_component_logos_by_BCI"
                    __________
                    | PARAMS |______________________________________________________________
                    |
                    |     baseComponentId
                    |     ---------------
                    |________________________________________________________________________ */
                    let mm = this

                    let results2 = await sqliteQuery(
                        `select  
                            base_component_id,  
                            logo_url   
                        from  
                            level_2_released_components  
                        where 
                            component_type = 'app'
                                and 
                            base_component_id = '${baseComponentId}'`)

                    if (results2.length > 0) {
                        mm.app_store_component_logos_by_BCI[baseComponentId] = results2[0].logo_url
                    } else {
                        mm.app_store_component_logos_by_BCI[baseComponentId] = "/driver_icons/blocks.png"
                    }

                    mm.refresh++
                    return mm.app_store_component_logos_by_BCI[baseComponentId]
                },

                // amend the edited apps
                addEditableComponentToHomepage:     async function  ( baseComponentId, displayName, other) {
                    //----------------------------------------------------------------------------------
                    //
                    //                    /-------------------------------------/
                    //                   /   addEditableComponentToHomepage    /
                    //                  /-------------------------------------/
                    //
                    //----------------------------------------------------------------------------
                    // Given the base component ID of an app, a new display name, and
                    // some other data, add a new editable app to the homepage
                    //
                    //     baseComponentId
                    //     ---------------
                    //
                    //     displayName
                    //     -----------
                    //
                    //     other
                    //     -----
                    //           logo_url
                    //           codeId
                    //--------------------------------------------------------------------

                    let mm = this
                    // add the app to the list of BCI apps
                    if (baseComponentId) {
                        for (let thisApp of mm.editable_app_list) {
                            if (thisApp.code_id == other.codeId) {
                                //debugger
                                thisApp.delete = false
                                return
                            }
                        }
                        let app = {
                            type:                       "app",
                            base_component_id:          baseComponentId,
                            displayName:                displayName
                        }
                        if (other) {
                            if (other.visibility) {
                                app.visibility = other.visibility
                            }
                            if (other.codeId) {
                                app.code_id = other.codeId
                            }
                            if (other.logoUrl) {
                                app.logo_url = other.logoUrl
                            }
                            if (other.componentType) {
                                app.component_type = other.componentType
                            }
                        }

                        mm.editable_app_list.push( app  )
                    }

                    return null
                },
                addToEditableAppsAndEdit:           async function  ( ipfsHash ) {
                    //----------------------------------------------------------------------------------
                    //
                    //                    /-------------------------------------/
                    //                   /         addToEditableAppsAndEdit    /
                    //                  /-------------------------------------/
                    //
                    //----------------------------------------------------------------------------
                    // Given the commit ID of an app in the app store, download it and edit it
                    //
                    //     ipfsHash
                    //     --------
                    //
                    // --------------------------------------------------------------------

                    let mm                = this
                    this.open_file_name   = ""
                    this.open_file_path   = "/"
                    saveCodeToFile        = null

                    let result = (await sqliteQuery(
                        `select  
                            base_component_id  
                        from  
                            level_2_system_code  
                        where 
                            id = '${ipfsHash}'`))[0]


                    await getFromYazzReturnJson("/http_get_point_edit_marker_at_commit",
                        {
                            sha1sum:            ipfsHash,
                            baseComponentId:    result.base_component_id
                        })

                    await mm.reloadEditedAppsFromServer()

                    setTimeout(async function() {
                        hideProgressBar()
                        mm.highlightEditableComponent(result.base_component_id)
                        await mm.editApp(result.base_component_id , ipfsHash)
                    },50)
                },
                copyAndEditApp:                     async function  ( compInfo ) {
                    /* copyAndEditApp
                    ________________________________________
                    |                                      |
                    |        copyAndEditApp                |
                    |                                      |
                    |______________________________________|
                    Given some app info, take an existing app and make a new copy of it, and edit
                    that copy
                    __________
                    | PARAMS |______________________________________________________________
                    |
                    |     compInfo    A map containing optional items:
                    |     --------    {
                    |                       base_component_id
                    |                       code_id
                    |                 }
                    |________________________________________________________________________ */
                    let mm                = this
                    let baseComponentId   = compInfo.base_component_id
                    let codeId            = compInfo.code_id

                    globalEventBus.$emit('hide_settings', {});

                    this.open_file_name   = ""
                    this.open_file_path   = "/"
                    saveCodeToFile        = null

                    let result = await getFromYazzReturnJson("/http_get_copy_component",
                        {
                            base_component_id:  baseComponentId,
                            code_id:            codeId?codeId:""
                        })

                    let componentType = "app"
                    if (result.component_type == "COMPONENT") {
                        componentType = "component"
                    }

                    await mm.addEditableComponentToHomepage(
                        result.base_component_id,
                        result.new_display_name,
                        {
                            codeId:         result.code_id,
                            logoUrl:        result.logo_url,
                            componentType:  result.component_type
                        })

                    setTimeout(async function() {
                        await mm.editApp(result.base_component_id, result.code_id)
                    },50)
                },
                runAppInNewBrowserTab:              async function  ( baseComponentId, code_id ) {
                    /* Given the base component ID of an app, open that app in a separate
                    browser tab as an app
                    ________________________________________
                    |                                      |
                    |      runAppInNewBrowserTab           |
                    |                                      |
                    |______________________________________|
                    Given the base component ID of an app, open that app in a separate
                    browser tab as an app
                    __________
                    | PARAMS |______________________________________________________________
                    |
                    |     baseComponentId
                    |     ---------------
                    |________________________________________________________________________ */
                    let mm = this
                    window.open(
                        location.protocol +
                        "//" + location.hostname + ":" +
                        location.port + "/app/" + baseComponentId + ".html"
                        ,
                        baseComponentId)
                    mm.refresh++
                },
                downloadAndRunApp:                  async function  ( ipfsHash ) {
                    //----------------------------------------------------------------------------------
                    //
                    //                    /-------------------------------------/
                    //                   /         downloadAndRunApp           /
                    //                  /-------------------------------------/
                    //
                    //----------------------------------------------------------------------------
                    // Given the commit ID of an app in the app store, download it and run it
                    //--------------------------------------------------------------------
                    let mm                = this
                    this.open_file_name   = ""
                    this.open_file_path   = "/"
                    saveCodeToFile        = null

                    let result = (await sqliteQuery(
                        `select  
                            id,
                            base_component_id,  
                            display_name   
                        from  
                            level_2_system_code  
                        where 
                            id = '${ipfsHash}'`))[0]

                    let logoUrl = await mm.addLogoForApp(result.base_component_id)

                    await mm.addEditableComponentToHomepage(
                        result.base_component_id,
                        result.display_name,
                        {
                            codeId:         result.id,
                            logoUrl:        logoUrl,
                            componentType:  "app"
                        }
                    )
                    setTimeout(async function() {
                        hideProgressBar()
                        await mm.highlightEditableComponent(result.base_component_id)
                        await mm.runAppInNewBrowserTab(result.base_component_id)

                    },50)
                },
                editApp:                            async function  ( baseComponentId, codeId) {
                    //----------------------------------------------------------------------------------
                    //
                    //                    /-------------------------------------/
                    //                   /              editApp                /
                    //                  /-------------------------------------/
                    //
                    //----------------------------------------------------------------------------
                    // Allows an app to be edited given either the base component ID or
                    // the commit ID
                    //
                    //     baseComponentId
                    //     ---------------  The "base_component_id" of the app to load
                    //
                    //     codeId
                    //     ------           The "commit ID" of the app to load
                    //
                    //--------------------------------------------------------------------
                    let mm = this

                    globalEventBus.$emit('hide_settings', {});

                    await GLOBALS.makeSureUiComponentLoadedV6([{baseComponentId: "app_editor_3"}])

                    if (codeId) {
                        await GLOBALS.makeSureUiComponentLoadedV6([{codeId: codeId}])
                    } else if (baseComponentId) {
                        if (!GLOBALS.isComponentTypeCached(baseComponentId)) {
                            await GLOBALS.makeSureUiComponentLoadedV6([{baseComponentId: baseComponentId}])
                        }
                    }

                    mm.lastEditedBaseComponentId        = mm.editingBaseComponentId
                    mm.editingBaseComponentId           = baseComponentId;
                    mm.lastEditedCodeId                 = mm.editingCodeId
                    mm.editingCodeId                    = codeId
                    mm.currentlyHighlightedAppstoreBCI  = null
                    mm.refresh ++
                },
                reloadEditedAppsFromServer:         async function  ( ) {
                    //----------------------------------------------------------------------------------
                    //
                    //                    /-------------------------------------/
                    //                   /     reloadEditedAppsFromServer      /
                    //                  /-------------------------------------/
                    //
                    //----------------------------------------------------------------------------
                    // This updates the list of apps that can be edited on the homepage.
                    // It does this by getting the apps from the server
                    //--------------------------------------------------------------------
                    let mm = this
                    let openfileurl =   "http" + (($HOSTPORT == 443) ? "s" : "") + "://" + $HOST +
                                        "/http_post_load_editable_apps"

                    fetch(openfileurl,
                        {
                            method:         'post',
                            credentials:    "include"
                        })
                        .then((response) => response.json())
                        .then(async function (responseJson) {
                            // first mark all editable components as deletable
                            for (let editableItem of mm.editable_app_list) {
                                editableItem.delete = true
                            }

                            // add all the items to the homepage
                            for (let rt = 0; rt < responseJson.length; rt++) {
                                await mm.addEditableComponentToHomepage(
                                    responseJson[rt].base_component_id,
                                    responseJson[rt].display_name,
                                    {
                                        codeId:         responseJson[rt].ipfs_hash,
                                        logoUrl:        responseJson[rt].logo_url,
                                        componentType:  responseJson[rt].component_type
                                    })
                            }

                            // delete any items that should not be there
                            for (let editableItem of mm.editable_app_list) {
                                mm.editable_app_list = mm.editable_app_list.filter(
                                    editableItem => !editableItem.delete)
                            }

                        }).catch(err => {
                        //error block
                    })
                    mm.refresh++
                }

}
        }
    )
}
