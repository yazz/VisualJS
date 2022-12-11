async function(args) {
/*
created_timestamp(-1)
base_component_id("app_editor_3")
is_app(true)
component_type("SYSTEM")
display_name("Editor App V3")
description("This will return the editor app V3")
logo_url("https://2.bp.blogspot.com/-6Hdixw3dFxk/WfSQOnB9lDI/AAAAAAAAFFc/84DRGgcwOpYBOgknkHQ-qmgxvFv1D-iHACLcBGAs/s1600/BracketsDarks.PNG")
load_once_from_file(true)
*/
    //
    // Hack city!!! Turn off the component cache so that we can enable hot reloading of components
    //
    isStaticHtmlPageApp = false
    //
    //
    //


    Vue.component("app_editor_3",
    {
      props: ['app_id'],
      template:
`<div style="height: 100%; width:100%;padding:0; margin:0; border: 5px solid lightgray;position:relative;">
    <div style='box-shadow: 2px 2px 10px lightgray;background-image: linear-gradient(to right,  #000099, lightblue); color: white;padding: 7px; padding-left: 15px;display: block;overflow: auto;'>
        <img
            src='/driver_icons/project.png'
            style='width: 20px; margin-right: 10px;'
            class='img-fluid'>
        </img>

        <h5  class='caption' style='display: inline-block;' v-on:click='if (!read_only) {edit_name=true;show_name=false;}' v-if='show_name'>
            {{app_component_name?"" + app_component_name.substring(0,30):""}}{{(app_component_name && ((app_component_name.length > 50))?"...":"")}} 
          
        </h5>

        <input    class='caption' 
                  v-bind:style='"display: inline-block;" + (editor_shell_locked?"pointer-events: none;opacity: 0.4;":"")' 
                  v-if='edit_name' 
                  v-model='app_component_name'></input>


          <button type=button class='btn btn-primary'
                  v-bind:style='"margin-left: 10px" + (editor_shell_locked?"pointer-events: none;opacity: 0.4;":"")'
                  v-if='(!read_only) && (!edit_name)'
                  v-on:click='edit_name = true;show_name=false;'>
            Rename
          </button>

        <button type=button class='btn btn-primary' 
                v-bind:style='"margin-left: 10px" + (editor_shell_locked?"pointer-events: none;opacity: 0.4;":"")'
                v-if='edit_name' 
                v-on:click='(async function(){await rename(app_component_name)})()'>
            Save new name
        </button>


        <span style='float: right; margin-right: 2%; margin-left: 20px;' >






            <div class='btn-group'
                 v-bind:style='"box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);margin-right: " + (extra_menu?"10px;":"160px;")'
                 role=group >

                <button type=button
                        v-bind:class='"btn btn-sm " + ((mode == "edit" && sub_mode == "app")?"btn-secondary":"btn-light")'
                        v-on:click='chooseApp()'  >Preview</button>

                <button type=button
                        v-bind:class='"btn btn-sm " + ((mode == "edit" && sub_mode == "code")?"btn-secondary":"btn-light")'
                        v-on:click='chooseCode()' >Code</button>

                <button type=button
                        v-bind:class='"btn btn-sm " + ((mode == "edit" && sub_mode == "both")?"btn-secondary":"btn-light")'
                        v-on:click='chooseBoth()' >Both</button>

                <button type=button
                        v-bind:refresh='refresh'
                        v-bind:class='"btn btn-sm " + (mode == "profiler"?"btn-secondary":"btn-light")'
                        v-on:click='if (mode != "profiler"){chooseProfiler()}' >Profiler</button>
            </div>



            <div v-if='extra_menu' class='btn-group' role=group style='box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);margin-right: 20px;'>
                <button  v-if='(editor_component != "editor_component") && (!read_only) && (mode != "profiler") && (!editor_overloaded)' type=button class=' btn btn-info btn-sm'   v-on:click='editAsText()' >Edit as text</button>

                <button  v-if='(mode != "profiler") && (!editor_overloaded)' type=button class=' btn btn-sm btn-warning'        v-on:click='setTimeout(function(){copyAppMethod(base_component_id, null)},100)' >Copy app</button>

                <button  v-if='(mode != "profiler") && (!editor_overloaded)' type=button class=' btn btn-sm btn-info'        v-on:click='setTimeout(function(){editKeycloak()},100)' >Keycloak</button>

                <button  v-if='(mode != "profiler") && (!editor_overloaded)' type=button class=' btn btn-sm btn-warning'        v-on:click='setTimeout(function(){editSqliteSchema()},100)' >Database</button>

                <button  v-if='(mode != "profiler") && (!editor_overloaded)' type=button class=' btn btn-sm btn-info'        v-on:click='setTimeout(function(){editExportOptions()},100)' >Export</button>

            </div>


            <div v-if='(!extra_menu) && (!editor_overloaded)' class='btn-group' role=group style='box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);margin-right: 20px;'>
                <button  type=button class=' btn btn-info btn-sm'   v-on:click='extra_menu=true' >More</button>
            </div>

            <div v-if='extra_menu && (!editor_overloaded)' class='btn-group' role=group style='box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);margin-right: 20px;'>
                <button  type=button class=' btn btn-info btn-sm'   v-on:click='extra_menu=false' >Less</button>
            </div>


            <div class='btn-group' style='box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);' role=group >
                <button  type=button class=' btn btn-danger btn-sm'   v-on:click='$event.stopPropagation();closeApp()' >Close</button>
            </div>

        </span>
    </div>






    <div    id="status bar"
            ref="status bar"
            style='position:absolute;bottom:-5px;width:100%;box-shadow: 2px 2px 10px lightgray; color: black;padding: 0px; padding-left: 15px;display: block;overflow: auto;background-color: lightgray;z-index:21474836;text-align: center;height: 30px; font-size:16px;vertical-align: middle;line-height: 30px; '>
        {{((info_text != null)?info_text:"")}}
    </div>
    

    <div v-if='mode == "edit"'>
        <div    id=editor_id
                v-bind:style="'height: 100%; width: ' + code_width + '; left: 0px; display: ' + (code_shown?'inline-block':'none') + ';'">

            <component  v-bind:is="editor_component"
                        v-if="editor_loaded"
                        ref="editor_component_ref">

                <div      slot-scope="editor_component" style='display: inline-block;width:100%;'>


                  <!-- ----------------------------------------------
                  
                       Saved JS button
                  
                  ---------------------------------------------- -->
                  <a   v-bind:style="'margin-left:20px;margin-right: 6px;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);visibility: ' + (code_shown?'':'hidden') + ';' "
                       href="#"
                       v-bind:href='location.protocol + "//" + location.hostname + ":" + location.port + "/app/yazz_" + editingAppId + ".yazz"'
                       download
                       v-if="show_download_save"
                       v-on:mouseenter='setInfo("Download app source code")'
                       v-on:mouseleave='setInfo(null)'
                       type="button" class="btn btn-light ">

                    <img
                        src='/driver_icons/download.png'
                        style='height:35px; margin-right: 10px;'
                        class='img-fluid'>
                    </img>
                    Download

                  </a>
                  
                  
                  <a   v-bind:style="'margin-left:20px;margin-right: 6px;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);visibility: ' + (code_shown?'':'hidden') + ';' "
                       href="#"
                       v-on:click='setTimeout(async function(){await showHistory(base_component_id, {})},100)'
                       v-if="show_download_save"
                       v-on:mouseenter='setInfo("Publish this app to the central server")'
                       v-on:mouseleave='setInfo(null)'
                       type="button" class="btn btn-light ">

                    <img
                        src='/driver_icons/history2.png'
                        style='height:35px; margin-right: 10px;'
                        class='img-fluid'>
                    </img>
                    History

                  </a>



                  <!-- ----------------------------------------------
                  
                      BOOKMARK CODE 
                      
                      This can be thought of as tagging a commit in
                      git, or adding a version number to the code
                      
                      The bookmark will be a timestamp by default
                  
                  ---------------------------------------------- -->
                  <a   v-bind:style="'margin-left:20px;margin-right: 6px;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);visibility: ' + (code_shown?'':'hidden') + ';' "
                       href="#"
                       v-on:click='setTimeout(async function(){appClearIntervals();await bookmarkCode()},100)'
                       v-if="show_download_save"
                       v-on:mouseenter='setInfo("Bookmark this code")'
                       v-on:mouseleave='setInfo(null)'
                       type="button" class="btn btn-light ">

                    <img
                        src='/driver_icons/bookmark.png'
                        style='height:35px; margin-right: 10px;'
                        class='img-fluid'>
                    </img>
                    Bookmark

                  </a>



                  <!-- ----------------------------------------------
                  
                      GO LIVE BUTTON
                  
                  ---------------------------------------------- -->
                  <a   v-bind:style="'margin-left:20px;margin-right: 6px;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);visibility: ' + (code_shown?'':'hidden') + ';' "
                       href="#"
                       v-on:click='setTimeout(async function(){appClearIntervals();await releaseCode()},100)'
                       v-if="show_download_save"
                       v-on:mouseenter='setInfo("Publish this app to the central server")'
                       v-on:mouseleave='setInfo(null)'
                       type="button" class="btn btn-light ">

                    <img
                        src='/driver_icons/publish.png'
                        style='height:35px; margin-right: 10px;'
                        class='img-fluid'>
                    </img>
                    Go live

                  </a>







                    <button   v-bind:style="'margin-left:20px;margin-right: 6px;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);visibility: ' + (code_shown?'':'hidden') + ';' "
                              v-on:click='setTimeout(function(){closeSqliteSchema()},100)'
                              v-if="editor_overloaded"
                              v-on:mouseenter='setInfo("Edit the SQlite schema for this app")'
                              v-on:mouseleave='setInfo(null)'
                              type="button" class="btn btn-light ">


                              <svg  version="1.1"
                                    id="Layer_1"
                                    xmlns="http://www.w3.org/2000/svg"
                                    xmlns:xlink="http://www.w3.org/1999/xlink"
                                    x="0px"
                                    width="35px"
                                    viewBox="0 0 210.107 210.107"
                                    height="35px"
                                    y="0px"
                                  	viewBox="0 0 492 492"
                                    style="enable-background:new 0 0 492 492;margin-right:10px;"
                                    xml:space="preserve">
                              	<g>
                              		<path d="M464.344,207.418l0.768,0.168H135.888l103.496-103.724c5.068-5.064,7.848-11.924,7.848-19.124
                              			c0-7.2-2.78-14.012-7.848-19.088L223.28,49.538c-5.064-5.064-11.812-7.864-19.008-7.864c-7.2,0-13.952,2.78-19.016,7.844
                              			L7.844,226.914C2.76,231.998-0.02,238.77,0,245.974c-0.02,7.244,2.76,14.02,7.844,19.096l177.412,177.412
                              			c5.064,5.06,11.812,7.844,19.016,7.844c7.196,0,13.944-2.788,19.008-7.844l16.104-16.112c5.068-5.056,7.848-11.808,7.848-19.008
                              			c0-7.196-2.78-13.592-7.848-18.652L134.72,284.406h329.992c14.828,0,27.288-12.78,27.288-27.6v-22.788
                              			C492,219.198,479.172,207.418,464.344,207.418z"/>
                              	</g>

                              </svg>Back to editor

                    </button>





                    <button   v-bind:disabled='read_only?"":false'
                              v-bind:style="'margin-left:200px;margin-right: 6px;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);visibility: ' + (code_shown?'':'hidden') + ';' + (read_only?'opacity:.3;':'')"
                              v-on:mouseenter='setInfo("Save the changes made in the UI and reload the app")'
                              v-on:mouseleave='setInfo(null)'
                              v-on:click='setTimeout(async function(){appClearIntervals();await save(base_component_id, code_id,null)},100)'
                              type="button" class="btn  btn-warning"
                              v-if="(((!hideImportButtons) || disableAutoSave) && (!read_only) && ((save_state == 'pending') || (!save_state)))"
                              >

                              <img
                                  src='/driver_icons/save.png'
                                  style='height:35px; margin-right: 10px;'
                                  class='img-fluid'>
                              </img>{{saveCodeToFile?"Save":"Pending changes.. update"}}

                    </button>

                  <span
                      v-if='read_only && hideImportButtons'
                  >
                      {{read_only?"Read only mode":""}}
                    </span>



                      <span
                          v-if="!read_only && (save_state == 'pending') && hideImportButtons && (!disableAutoSave)"
                      >
                          Unsaved changes...
                    </span>

                    <span
                        v-if="!read_only && (save_state == 'saved') && hideImportButtons"
                    >
                      All changes saved
                    </span>
                    <div    v-if="!read_only && (save_state == 'saved') && (!hideImportButtons)"
                            v-bind:disabled='read_only?"":false'
                            v-bind:style="'padding:10px;;display: inline-block;width: 200px;margin-left:200px;margin-right: 6px;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);visibility: ' + (code_shown?'':'hidden') + ';' + (read_only?'opacity:.3;':'')"
                    >
                    {{saveCodeToFile?"Save":"App preview up to date"}}
                    </div>

                    <div    v-if="!read_only && (save_state == 'saving')"
                            v-bind:disabled='read_only?"":false'
                            v-bind:style="'padding:10px;;display: inline-block;width: 200px;margin-left:200px;margin-right: 6px;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);visibility: ' + (code_shown?'':'hidden') + ';' + (read_only?'opacity:.3;':'')"
                    >
                    saving ...
                    </div>

                    <button   v-bind:style="'margin-left:200px;margin-right: 6px;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);visibility: ' + (code_shown?'':'hidden') + ';' "
                              v-on:mouseenter='setInfo("Save the changes made in the UI and reload the app")'
                              v-on:mouseleave='setInfo(null)'
                              v-on:click='setTimeout(function(){copyAppMethod(base_component_id, null)},100)'
                              type="button" class="btn  btn-primary"
                              v-if='read_only && (mode != "profiler") && (!editor_overloaded)'>

                              <img
                                  src='/driver_icons/remix.png'
                                  style='height:35px; margin-right: 10px;'
                                  class='img-fluid'>
                              </img>Remix

                    </button>



                    <div  style='display: inline-block;'>
                        <a   style='text-decoration:underline;cursor: pointer;flex:1;font-family:verdana,helvetica;font-size: 13px;margin-left:10px;'

                              v-on:click='let win = window.open(location.protocol + "//" + getNetworkHostName() + ":" + location.port + "/app/" + base_component_id + ".html", "_blank"); win.focus();'

                              v-if="code_shown && (!app_shown)">

                              {{location.protocol + "//" + getNetworkHostName() + ":" + location.port + "/app/" + base_component_id + ".html"}}
                        </a>


                        <div>
                        {{file_save_state}}
                        </div>
                    </div>


                </div>

            </component>
        </div>



        <div v-bind:style="'overflow:auto;margin-left:10px;margin-top:10px;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);background-color: rgb(242,242,242);height: 80vh; width: ' + app_width + '; right: 0px; display: ' + (app_shown?'inline-block':'none')+';vertical-align: top;border: 4px solid lightsteelblue;border-radius: 10px;'">









            <div    v-on:click='let win = window.open(location.protocol + "//" + getNetworkHostName() + ":" + location.port + "/" + rest_api_base_url + "", "_blank"); win.focus();'
                    v-if='app_loaded && (is_server_app)'
                    v-bind:style="'display:flex;text-decoration: underline;color:blue;padding: 5px; margin-top: 3px; position: relative; border: 0px;border-bottom: 4px solid lightsteelblue;'">

                Shareable link:<input   readonly
                                        style='flex:1;font-family:verdana,helvetica;font-size: 13px;margin-left:10px;'
                                        v-bind:value='location.protocol + "//" + getNetworkHostName() + ":" + location.port + "/" + rest_api_base_url + ""'>
                </input>
            </div>










            <div    v-if='app_loaded && (!is_server_app)'
                    v-bind:style="'display:flex;text-decoration: underline;color:blue;padding: 5px; margin-top: 3px; position: relative; border: 0px;border-bottom: 4px solid lightsteelblue;'">

  <!-- ----------------------------------------------
  
  Link to full screen app
  
  ---------------------------------------------- -->
                <div v-on:click='let win = window.open(location.protocol + "//" + getNetworkHostName() + ":" + location.port + "/app/" + base_component_id + ".html", "_blank"); win.focus();'>Full screen mode</div>





<!-- ----------------------------------------------

Refresh button

---------------------------------------------- -->
                <button   v-on:click='setTimeout(async function(){appClearIntervals();await save(base_component_id, code_id,null)},100)'
                          type="button"
                          v-bind:style="'padding: 0px; margin-top: 0px; margin-left:10px; position: relative; border: 0px;background-color: rgb(242, 242, 242);' + (read_only?'opacity:0.2;':'')"
                          class="btn">

                          <img
                              src='/driver_icons/reload.png'
                              style='height:25px; margin-right: 0px;'
                              class='img-fluid'>
                          </img>

                </button>




<!-- ----------------------------------------------

   App Preview Address Bar 

---------------------------------------------- -->
                <input   readonly
                                        style='flex:1;font-family:verdana,helvetica;font-size: 13px;margin-left:10px;'
                                        v-on:click='let win = window.open(location.protocol + "//" + getNetworkHostName() + ":" + location.port + "/app/" + base_component_id + ".html", "_blank"); win.focus();'
                                        v-bind:value='location.protocol + "//" + getNetworkHostName() + ":" + location.port + "/app/" + base_component_id + ".html"'>
                </input>










<!-- ----------------------------------------------

     Saved HTML button

---------------------------------------------- -->

              <a          v-on:click='if (!sqlite_data_saved_in_html) {sqlite_data_saved_in_html = true;setTimeout(async function(){appClearIntervals();await save(base_component_id, code_id,null,{allowAppToWorkOffline: true});setTimeout(function(){document.getElementById("saveHTMLButton").click();sqlite_data_saved_in_html = false;},700)},100);} '
                          v-bind:style="'padding: 0px; margin-top: 0px; margin-left:0px; position: relative; border: 0px;background-color: rgb(242, 242, 242);' + (sqlite_data_saved_in_html?'opacity:0.2;':'') "
                          v-on:mouseenter='setInfo("Download this app as a standalone HTML file")'
                          v-on:mouseleave='setInfo(null)'
                          v-bind:disabled='sqlite_data_saved_in_html?false:""'
                          type="button"
                          class="btn btn-light">

                <img  src="/driver_icons/html.png"
                      v-bind:disabled='sqlite_data_saved_in_html?false:""'
                      style="height: 25px;; margin: 0px;"
                      class='img-fluid'>
                </img>
              </a>

               <a          v-bind:href='location.protocol + "//" + location.hostname + ":" + location.port + "/app/yazz_" + editingAppId + ".html"'
                            download
                            id="saveHTMLButton"
                            type="button"
                            style="width: 1px; height: 1px;padding:0px;margin:0px"
                            class="btn btn-light">
                </a>



<!-- ----------------------------------------------

Embed button

---------------------------------------------- -->
              <a   v-bind:style="'padding: 0px; margin-top: 0px; margin-left:0px; position: relative; border: 0px;background-color: rgb(242, 242, 242);'"
                   v-if="show_download_save"
                   v-on:click='setTimeout(async function(){await embedApp(base_component_id, {})},100)'
                   v-on:mouseenter='setInfo("Download the JS .yazz file for this app")'
                   v-on:mouseleave='setInfo(null)'
                   type="button" class="btn btn-light ">
                


                <img
                    src='/driver_icons/embed.png'
                    style='height:25px; margin-right: 0px;'
                    class='img-fluid'>
                </img>
              </a>






<!-- ----------------------------------------------

End of app preview menu

---------------------------------------------- -->

            </div>


            <component  id="app_preview_component"
                        ref="app_preview_component"
                        v-if='app_loaded && is_ui_app && (!is_server_app)'
                        style='background-color: white;'
                        v-bind:is="base_component_id">
               
            </component>



            <div  v-if='app_loaded && (!is_ui_app) && (!is_server_app)'
                  style='padding: 10px;background-color: white; height: 100%;'>

                <pre>{{console_output}}</pre>

            </div>




            <div  v-if='app_loaded && (!is_ui_app) && (is_server_app)'
                  style='padding: 10px;background-color: white; height: 100%;'>

                  Server App
                  <div  v-if='app_loaded && (!is_ui_app) && (is_server_app) && (is_rest_app)'
                      style='padding: 10px;background-color: white; height: 100%;'>
                         Yazz Rest API Tester:<div></div>
                         <span style="height:40px;margin-bottom:10px;">{{location.protocol + "//" + getNetworkHostName() + ":" + location.port + "/" + rest_api_base_url + ""}}</span>

                         <span>
                             ?
                             <span><button type=button
                                     class='btn-sm'
                                     v-on:click='addparam()' >Add param</button></span>
                         </span>

                         <div style="margin-left: 100px;">
                             <div v-for='(param,index) in rest_params' >
                                 <input  style='margin-top:5px;'
                                         placeholder="Param Name"
                                         v-model="param.name">
                                 </input>
                                 <input  style=''
                                         placeholder="Param Value"
                                         v-model="param.value">
                                 </input>
                             </div>

                         </div>
                         <div style="margin-top:10px;height:auto; border: 3px solid black; padding: 8px;">{{location.protocol + "//" + getNetworkHostName() + ":" + location.port + "/" + rest_api_base_url + "/" + rest_api_url_2 + "?"  + getRestParams() }}
                         </div>
                         <button    style="margin-top:6px;"
                                    type=button class=' btn btn-info btn-lg'
                                    v-on:click='callRestApi()' >

                                        Call rest API

                                    </button>


                         <div style="margin-top:50px;height:auto; border: 3px solid black; padding: 8px;">
                             <h2>Rest call return value</h2>
                             <pre style="margin-top: 30px;">{{rest_api_return_value}}</pre>
                         </div>
                     </div>


            </div>


        </div>
    </div>



    <div v-if='mode == "profiler" && (execution_timeline.length == 0) ' style='width:100%;'>
        <div    style="position: sticky; left:0px; top:0px; width: 100vw ;z-index: 2;padding:0;margin:0;">
            <h4 style="border:0px; padding: 5px; margin: 0px;margin-top: 20vh; padding-left:15px;font-family: Helvetica;color: black; text-align: center;">
                No code to profile

            </h4>

            <h6 style="color: lightgray;border:0px;padding: 2px; margin: 0px;padding-left:15px;font-family: Helvetica; text-align: center;">
                Please do something in your app
            </h6>

            <div style='text-align: center;margin-top: 4vh;padding-bottom: 40vh;'>
                <button  type=button class=' btn btn-info btn-lg'        v-on:click='chooseBoth()' >Return to code</button>
            </div>

        </div>
    </div>

    <div v-if='mode == "profiler" && (execution_timeline.length > 0)' style='width:100%;'>

        <div class='container' style='max-width:100%;width:100%;padding:10; margin:0; border: 0; background-color:lightgray;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);'>

        </div>


        <div style='margin:0px'>
            <div    style='position: absolute;width:35%;display:inline-block;border:4px solid lightgray; box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);height: 75vh;overflow: hidden;padding:0px;margin-left:15px;border-radius: 5px;margin-top: 15px;'>
                <div    style='white-space: nowrap;overflow: hidden;text-overflow: ellipsis;font-family:verdana,helvetica;font-size: 13px;font-weight:bold;border-radius: 0px;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);background-image: linear-gradient(to right,  #000099, lightblue); color: white; padding:4px; margin:0;border-bottom: 0px;padding-left:10px;'>

                     Debugging: {{highlighted_block_name}}
                </div>

                <div id='timeline_editor' style='height: 100%;' >
                </div>
            </div>


            <div    style='position: absolute;left: 37%; width:30%;display:inline-block;border:5px solid lightgray; box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);height: 75vh;background-color: lightgray; position: relative;padding:0px;margin-left:15px;margin-top:0px;border-radius: 5px;'>

                <div    style='white-space: nowrap;overflow: hidden;text-overflow: ellipsis;font-family:verdana,helvetica;font-size: 13px;font-weight:bold;border-radius: 5px;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);padding:4px; margin:0;border-bottom: 3px solid lightgray;padding-left:10px;'>
                     Stepper

                     <span class='col-md-3'>
                         <input  style=''
                                 type="range" min="1" max="20"
                                 v-bind:onchange='timelineRefresh(false)'
                                 v-model="execution_horiz_scale">
                         </input>
                     </span>



                     <span class='btn-group col-md-3' role=group >
                         <button type=button class='btn btn-light' style='box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);margin: 1px;padding:2px;'  v-on:click='stepBack()'>&lt;--</button>
                         <button type=button class='btn btn-light' style='box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);margin: 1px;padding:2px;'  v-on:click='stepForward()'>--&gt;</button>
                     </span>
                </div>



                <div style='position:relative;background-color: white;'>






                    <div
                        v-if="( timeline_x_cursor >= 0 )"
                        v-bind:style='  "position: absolute;pointer-events: none;width: 1px;border: 1px solid gray; top: 0; height:100%;" +"left: " + (timeline_x_cursor + 5)  + "px;" '>
                    </div>

                    <div v-if='(timeline_x_cursor <= 200) && ( timeline_x_cursor >= 0 )'
                         v-bind:style='  "position: absolute;pointer-events: none;width: 100%;border: 0px solid gray; bottom: 0; " +"left: " + (timeline_x_cursor + 10)  + "px; font-family:verdana,helvetica;font-size: 13px;" '>
                            {{current_execution_step + 1}} / {{execution_timeline.length}}
                    </div>

                    <div v-if='(timeline_x_cursor > 200) && ( timeline_x_cursor >= 0 )'
                         v-bind:style='  "position: absolute;pointer-events: none;width: 100px;border: 0px solid gray; bottom: 0; " +"left: " + (timeline_x_cursor - 100)  + "px; font-family:verdana,helvetica;font-size: 13px; text-align:right;" '>
                            {{current_execution_step + 1}} / {{execution_timeline.length}}
                    </div>

                    <div
                        v-if="( timeline_x_cursor >= 0 )"
                        v-bind:style='  "position: absolute;pointer-events: none;height: 1px;border: 1px solid lightgray; left: 0; width:100%;" +"top: " + (timeline_y_cursor + 5)  + "px;" '>
                    </div>





                    <div    style='position:relative;overflow: scroll; border: 0px solid blue; padding:0; height:90%; width:100%;left:0;top:0'
                            id='timeline_el'
                            v-on:scroll='inTimelineScroll()'
                            @mousemove="mouseMoveTimeline($event)"
                            @click="mouseClickTimeline($event)"
                            @mouseenter="mouseEnterTimeline($event)">


                        <div    v-for='block_name in execution_block_list'
                                v-bind:style='  "color: black; " +
                                                "position: absolute; pointer-events: none;" +
                                                "top:" + (execution_code[block_name].start) + ";" +
                                                "left: 0px ;" +
                                                "height:100%; " +
                                                "width: 100%;pointer-events: none;" '>



                        </div>

                        <div    v-for='exePoint in execution_timeline'

                                v-bind:style='  "z-index: " + ((current_execution_step == exePoint.time)?"100":"0" ) + "; color: darkgray; " +
                                                "position: absolute; pointer-events: none;" +
                                                "top:" + ((exePoint.line + executionCode[exePoint.code_block_name].start) * execution_horiz_scale) + "px;" +
                                                "left:" +  (exePoint.time * execution_horiz_scale) + "px;" +
                                                "border: 1px solid " + ((current_execution_step >= exePoint.time)?"black":"darkgray" ) + ";" +
                                                "width:" + ((current_execution_step == exePoint.time)?"10":"7") + "px;" +
                                                "height: " + ((current_execution_step == exePoint.time)?"10":"7") + "px; " +
                                                "background-color: " + ((current_execution_step >= exePoint.time)?"black":"darkgray" ) + ";" +
                                                ""'>
                        </div>
                    </div>


                </div>

            </div>




            <div    style='width:30%;right:20px;position: absolute;display:inline-block;border:4px solid lightgray; box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);height: 75vh;background-color: white;overflow: hidden; background-color: white;padding:0;margin-left:20px;'
                    >
                <div    v-bind:class='(right_mode == "watches"?"right_project_pane_expanded":"right_project_pane_collapsed")''
                        v-bind:refresh='refresh'
                        v-bind:style='"padding:0px; border: 4px solid lightgray;white-space:nowrap"'>

                    <div v-bind:style='"border-radius: 3px;  padding: 4px;overflow-x:none;height: 40px;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);font-family:verdana,helvetica;font-size: 13px;font-weight:bold;padding-left:10px;" '
                         v-bind:class='(selected_pane == "watches"?"selected_pane_title":"unselected_pane_title") '
                         v-on:click='$event.stopPropagation();selected_pane = "watches";chooseRight("watches");'>
                        Watch vars
                    </div>
                    <div  v-bind:style='"font-family:verdana,helvetica;font-size: 13px;border-radius: 3px; padding:4px; border-right:2px solid gray;border-bottom:2px solid gray; margin-top:2px;;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);height:80%;background-color:lightgray;"  + (right_mode == "watches"?"":"display:none;")'>
                        <div    style="align-items: stretch;border-radius: 3px;overflow-y:scroll; padding:0px; border: 0px solid lightgray;border-left: 2px solid gray;border-top: 2px solid gray; background-color:white;height:100%;">
                            <div class='container' style="padding:0;margin:0">
                                <div v-if='execution_timeline[current_execution_step]'>

                                    <div style='margin:0;padding:0;border:2px solid lightgray; min-height:50px;'>

                                        <div v-for="varWatchName in execution_watch_list">

                                            <div style='border: 0px solid blue; padding: 4px; min-height:50px;'
                                                 v-if='globalWatchList[varWatchName][current_execution_step]'>

                                                <b>{{varWatchName}}:</b>

                                                <div v-html='getVarAsHtml(globalWatchList[varWatchName].viewer,varWatchName)'></div>

                                                <div>
                                                    <button type=button class='btn btn-danger' style='margin: 0px;padding:0px; '
                                                            v-on:click='deleteWatch(varWatchName)'>

                                                        Delete
                                                    </button>

                                                    <button type=button class='btn btn-primary' style='margin: 0px;padding:0px; '
                                                            v-on:click='keepWatch(varWatchName)'>

                                                        Keep
                                                    </button>

                                                    <div v-if='globalWatchList[varWatchName].type == "ListOfNumbers"'>

                                                        <select v-model="globalWatchList[varWatchName].viewer">
                                                            <option value="text">View as text</option>
                                                            <option value="graph">Graph</option>
                                                        </select>
                                                    </div>

                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>


                        </div>
                    </div>
                </div>



                <div    v-bind:class='(right_mode == "scope"?"right_properties_pane_collapsed":"right_properties_pane_collapsed")'
                        v-bind:style='"padding:0px; border: 4px solid lightgray;padding:0px;background-color: lightgray;"'>

                    <div    v-bind:style='"border-radius: 3px;padding: 4px;height: 40px;overflow-x:none;white-space:nowrap;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);overflow:hidden ;text-overflow: ellipsis;font-family:verdana,helvetica;font-size: 13px;font-weight:bold;padding-left:10px;"'
                            v-bind:class='(selected_pane == "scope"?"selected_pane_title_slower":"unselected_pane_title_slower") '
                            v-on:click='selected_pane = "scope";chooseRight("scope");'>
                        Current scope
                    </div>
                    <div style='margin:0;padding:0; min-height:350px; background-color: white;'>


                        <div v-for="varV in execution_var_list" style='padding: 2px;'>
                            <div v-bind:v-if='execution_timeline[current_execution_step].vars[varV]'>
                                <div>
                                    <b>{{varV}}</b>
                                </div>

                                <div v-bind:v-if='isValidObject(execution_timeline[current_execution_step].vars[varV])'>
                                    <div style='margin-left:20px; margin-bottom: 15px;'>
                                        <b>Before</b>:
                                        {{JSON.stringify(execution_timeline[current_execution_step].vars[varV].before,null,2)}}
                                    </div>
                                </div>

                                <div v-bind:v-if='execution_timeline[current_execution_step].vars[varV]'>
                                    <div style='padding-left:20px;'>
                                        <b>After</b>:
                                        {{JSON.stringify(execution_timeline[current_execution_step].vars[varV].after,null,2)}}

                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>






                <div  style="left:0px; z-index: 200; width:100%; height:100%;">

                </div>
            </div>
        </div>
    </div>
</div>
`
       ,
       data: function() {
           return {
               sqlite_data_saved_in_html: false,
               file_save_state:    (saveCodeToFile?saveCodeToFile:""),
               editor_shell_locked:  true,
               info_text:           "",
               inSave:             false,
               hideImportButtons: true,
               refresh:             0,
               editor_loaded:       false,
               console_output:      "",
               selected_app:        '',
               is_ui_app:           true,
               is_server_app:       false,
               is_rest_app:         false,
               rest_api_url_2:       "",
               rest_params:         [],
               rest_api_base_url:    "",
               rest_api_return_value: "",
               editor_overloaded:       false,
               show_download_save:       false,
               show_filename_save:       false,
               editor_component:    null,
               right_mode:          "scope",
               selected_pane:       "scope",
               execution_timeline:  null,
               execution_horiz_scale: 3,
               y_step: 30,
               timeline_editor: null,
               current_execution_step:  -1,
               current_execution_step_y_line:  -1,
               execution_code: null,
               execution_block_list: [],
               execution_var_list: [],
               execution_watch_list: [],
               highlighted_line:    -1,
               timeline_x_cursor: -1,
               timeline_y_cursor: 10,
               timeline_pause: false,
               highlighted_block:    "",
               highlighted_block_name:    "",
               highlighted_node:    null,
               app_loaded:          false,
               app_component_name:  null,
               base_component_id:   null,
               code_id:             null,
               version: 0,
               app_width:           "33%",
               code_width:          "63%",
               app_shown:           true,
               code_shown:          true,
               read_only:           false,
               visibility:          null,
               extra_menu:          false,
               mode:                "edit",
               sub_mode:            "both",
               show_name:           true,
               edit_name:           false,
               editor_text:         "",
               save_state:          "saved",
               display_name:        ""
           }
       }
       ,

       methods: {
           getRestParams: function() {
               let str = ""
               for (let i=0; i < this.rest_params.length; i++) {
                   str +=  this.rest_params[i].name + "=" +  this.rest_params[i].value + "&"
               }
               return str
           },
           addparam: function() {
             this.rest_params.push({name: "", value: ""})
           },
           callRestApi:  async function() {
               let mm                           = this
               let newrestUrl = location.protocol + "//" + getNetworkHostName() + ":" + location.port + "/" + mm.rest_api_base_url + "/" +
                                mm.rest_api_url_2 + "?"  + mm.getRestParams()
                mm.rest_api_return_value = ""

                callAjax(newrestUrl,
        				function(response) {
                            mm.rest_api_return_value = JSON.stringify(JSON.parse(response),null,2)
                        })
                    mm.rest_api_return_value = newrestUrl



           }
           ,






           closeSqliteSchema: async function() {
               let mm                           = this
               this.editor_overloaded           = false
               this.show_download_save = true
               this.show_filename_save = false

               override_app_editor              = null
               this.editor_text                 = await mm.$refs.editor_component_ref.getText()
               //debugger
               //await mm.load_new_app( mm.base_component_id )
               await mm.load_new_app_by_code_id( mm.code_id )
           }
           ,




              editExportOptions: async function() {
                  let mm = this

                  this.editor_overloaded = true
                  this.show_download_save = false
                  this.show_filename_save = false

                  override_app_editor = "export_editor_component"


                  await mm.load_new_app( this.base_component_id )


              }
              ,

           editSqliteSchema: async function() {
               let mm = this

               this.editor_overloaded = true
               this.show_download_save = false
               this.show_filename_save = false

               override_app_editor = "sqlite_editor_component"


               await mm.load_new_app( this.base_component_id )
           }
           ,

           showHistory: async function(thisComponentId, historyArgs) {
               let mm = this

               this.editor_overloaded = true
               this.show_download_save = false
               this.show_filename_save = false

               override_app_editor = "history_viewer_component"

                await mm.load_new_app( this.base_component_id )

            }
            ,

           editKeycloak: async function() {
               let mm = this

               this.editor_overloaded = true
               this.show_download_save = false
               this.show_filename_save = false

               override_app_editor = "keycloak_editor_component"


               await mm.load_new_app( this.base_component_id )
           }
           ,


           setInfo: function(text) {
               this.$root.$emit('message', {
                   type:   "set_info_text",
                   text:    text
               })
           },

           closeApp: async function(event,item) {
               this.$root.$emit('message', {
                   type:               "close_app"
               })
           },


           getVarAsHtml: function(viewer,varName) {
               let value = globalWatchList[varName][this.current_execution_step].value
               let returnVal = null
               if ((viewer == null) || (viewer.length=="")) {
                    if (globalWatchList[varName].type == "ListOfNumbers") {
                        viewer="graph"
                    }
               }
               if (viewer=="graph") {
                    returnVal = this.getVarAsBarChart(value)
               }
               if (returnVal == null) {
                    returnVal = "<div>" + JSON.stringify(value,null,2) + "</div>"
               }
               return returnVal

           },

            getVarAsBarChart: function(value) {
                if (!isValidObject(value)) {
                    return "<div></div>"
                }
                let html = "<div> "

                let gg=0
                while (typeof(value[gg])=='number'){
                    let vv = value[gg]
                    html += `<div style='width: ${vv}px;font: 10px sans-serif;background-color: steelblue;text-align: right;padding: 3px;margin: 1px;color: white;'>`
                    html += `${vv}</div>`
                    gg++
                }
                html += "</div> "
                return html

            },

           resetDebugger: function() {

               executionTimeline   = []
               executionTimelineMapTimeToLine   = {}
               this.execution_timeline = executionTimeline
               maxTimelineLogPoint = 0
               globalWatchList = {}

               this.current_execution_step = 0
               this.current_execution_step_y_line = -1
               this.updateTimeline()
           }
           ,
            stepForward: function() {
                if (this.current_execution_step < (executionTimeline.length - 1)) {
                    this.current_execution_step ++

                    let x = executionTimelineMapTimeToLine[ this.current_execution_step ]
                    if (x) {
                        this.current_execution_step_y_line = x.line
                    }
                    this.updateTimeline({allowScroll: true})
                }
            }
            ,
            stepBack: function() {
                if (this.current_execution_step > 0) {
                    this.current_execution_step --
                    let x = executionTimelineMapTimeToLine[  this.current_execution_step  ]
                    if (x) {
                        this.current_execution_step_y_line = x.line
                    }
                    this.updateTimeline({allowScroll: true})
                }
            }
            ,
            timelineRefresh: function(move) {
                let mm = this
                setTimeout(function(){
                    mm.updateTimeline({allowScroll: move})
                },200)
            }
            ,
            chooseRight: function(ff) {
                this.right_mode = ff
            },



            updateTimeline: function( args ) {
                let mm = this
                let x = executionTimelineMapTimeToLine[  this.current_execution_step  ]
                if (x) {
                    this.highlighted_line           = x.line
                    this.highlighted_block          = executionCode[x.code_block_name].code
                    this.highlighted_block_name     = x.code_block_name
                    this.highlighted_node           = x.node

                    if (this.timeline_editor && this.timeline_editor.getSession()) {
                        this.timeline_editor.getSession().setValue(executionCode[x.code_block_name].code);

                        this.timeline_editor.scrollToLine(x.line , true, true, function () {});
                        this.timeline_editor.gotoLine(x.line , 10, true);
                        this.timeline_editor.resize(true);
                        this.timeline_editor.on("focus", function() {
                            if (mm.mode == "profiler") {
                                mm.chooseBoth()
                            }
                         });

                        //this.timeline_editor.selection.moveCursorToPosition({row: x.line - 1, column: 0});
                        //this.timeline_editor.selection.selectLine();
                    }


                    let elementTimeline = document.getElementById("timeline_el"  )
                    if (elementTimeline) {
                        this.y_step = Math.floor(elementTimeline.offsetHeight / this.execution_horiz_scale ) - 10

                        elementTimeline.scrollTop = (executionCode[x.code_block_name].start + (Math.floor(x.line/this.y_step)*this.y_step)) * this.execution_horiz_scale

                        this.timeline_x_cursor = (this.execution_horiz_scale * this.current_execution_step) - elementTimeline.scrollLeft
                        this.timeline_y_cursor = (this.execution_horiz_scale *
                                                        (this.current_execution_step_y_line + this.execution_code[x.code_block_name].start)
                                                                ) - elementTimeline.scrollTop

                        if (isValidObject(args) && args.allowScroll) {
                            if (this.timeline_x_cursor > elementTimeline.offsetWidth) {
                                elementTimeline.scrollLeft += elementTimeline.offsetWidth
                                this.timeline_x_cursor = (this.execution_horiz_scale * this.current_execution_step) - elementTimeline.scrollLeft
                            }
                            if ( this.timeline_x_cursor < 0 ) {
                                //alert(this.timeline_x_cursor)
                                elementTimeline.scrollLeft = (elementTimeline.scrollLeft + 7) - elementTimeline.offsetWidth
                                this.timeline_x_cursor = (this.execution_horiz_scale * this.current_execution_step) - elementTimeline.scrollLeft
                            }
                        }
                    }

                }
                if (this.execution_timeline[this.current_execution_step]){
                    this.execution_var_list = Object.keys(this.execution_timeline[this.current_execution_step].vars)
                    this.execution_watch_list = Object.keys(globalWatchList)
                    this.execution_watch_list.sort()
                }

            }


            ,
            mouseEnterTimeline: function(ev) {
                this.timeline_pause = false
            }
            ,
            mouseClickTimeline: function(ev) {
                this.timeline_pause = !this.timeline_pause
            },

            inTimelineScroll: function() {
                let mm = this
                mm.timeline_pause = true;
                setTimeout(function() {
                    mm.timeline_pause = false;
                }, 66);
            }

           ,
            mouseMoveTimeline: function(ev) {
                if (!this.timeline_pause) {
                    let elementTimeline = document.getElementById("timeline_el"  )
                    let left = (elementTimeline.scrollLeft + ev.offsetX);
                    let top = elementTimeline.scrollTop + ev.offsetY;

                    if ((left > -1) && elementTimeline) {
                        //console.log( "("+ left + "," + top + ")" )

                        let x=executionTimelineMapTimeToLine[ Math.floor(left / this.execution_horiz_scale)]
                        if (x) {
                            this.current_execution_step = x.time
                            this.current_execution_step_y_line = x.line
                            this.updateTimeline()
                        }
                    }
                }
            }
            ,

            addWatch: async function(varN){

                globalWatchList[varN]={}
                await this.load_app( this.base_component_id )
                let allWatches = Object.keys(globalWatchList)
                for (let rt = 0 ; rt < allWatches.length; rt++) {
                    fillInMissingWatchTimelineValues(allWatches[rt],0)
                }
            },
            deleteWatch: async function(varN){
                delete globalWatchList[varN]
            },
            keepWatch: async function(varN){
                let allWatches = Object.keys(globalWatchList)
                for (let rt = 0 ; rt < allWatches.length; rt++) {
                    if (allWatches[rt] != varN) {
                        delete globalWatchList[allWatches[rt]]
                    }
                }
            },



            setupTimelineEditor: function() {
                let mm = this
                if (document.getElementById('timeline_editor') && (this.timeline_editor == null)) {
                    //
                    //set up the ace editor for the timeline view
                    //
                    ace.config.set('basePath', '/');
                    this.timeline_editor = ace.edit(           "timeline_editor", {
                                                            selectionStyle: "text",
                                                            mode:           "ace/mode/javascript"
                                                        })

                    //Bug fix: Need a delay when setting theme or view is corrupted
                    setTimeout(function(){
                       mm.timeline_editor.setTheme("ace/theme/sqlserver");
                    },100)


                    document.getElementById("timeline_editor").style["font-size"] = "16px"
                    document.getElementById("timeline_editor").style.width = "100%"
                    document.getElementById("timeline_editor").style.border = "0px solid #2C2828"

                    document.getElementById("timeline_editor").style.height = "75vh"
                    this.timeline_editor.getSession().setValue("");
                    this.timeline_editor.getSession().setUseWorker(false);
                    this.timeline_editor.setReadOnly(true)
                }


                this.current_execution_step = 0
                let x = executionTimelineMapTimeToLine[ this.current_execution_step ]
                if (x) {
                    this.current_execution_step_y_line = x.line
                }
                this.updateTimeline()

            },




            // ---------------------------------------------------------------
            //                         chooseApp
            //
            // This is called when the end user selects "app"
            // ---------------------------------------------------------------
            chooseApp: async function() {
                showProgressBar()
                let mm = this
                this.code_width = "0%"
                this.code_shown = false

                this.app_width = "95%"
                this.app_shown = true

                this.mode      = "edit"
                this.sub_mode  = "app"

                if (this.timeline_editor) {
                    this.timeline_editor.destroy()
                    this.timeline_editor = null
                }

                if (this.$refs.editor_component_ref) {
                    appClearIntervals()
                    this.editor_text = await this.$refs.editor_component_ref.getText()

                    //
                    // there may be a problem here - we have to make sure that we saved
                    // the correct code_id which is supposed to be the parent code id, so we
                    // have to make sure that we save it every time we save code
                    //
                    await this.save( this.base_component_id, this.code_id, this.editor_text )
                    setTimeout(async function() {
                            await mm.load_app( mm.base_component_id , true)
                            //showProgressBar()
                            hideProgressBar()
                        },
                    200)
                }
            },

            chooseCode: async function() {
                let mm = this
                this.code_width = "95%"
                this.code_shown = true

                this.app_width = "0%"
                this.app_shown = false

                this.mode      = "edit"
                this.sub_mode  = "code"

                await mm.load_app( this.base_component_id , false)

                if (this.timeline_editor) {
                    this.timeline_editor.destroy()
                    this.timeline_editor = null
                }
                setTimeout(function(){
                    console.log("appClearIntervals()")
                    appClearIntervals()
                },2500)
            },




            chooseBoth: async function() {
                showProgressBar()
                let mm = this
                this.mode      = "edit"
                this.sub_mode  = "both"

                this.code_width = "63%"
                this.code_shown = true

                this.app_width = "33%"
                this.app_shown = true

                appClearIntervals()
                await mm.load_app( this.base_component_id , true)

                if (this.timeline_editor) {
                    this.timeline_editor.destroy()
                    this.timeline_editor = null
                }
                hideProgressBar()
            },

            chooseProfiler: async function() {
                let mm = this
                this.code_width = "0%"
                this.code_shown = false

                this.app_width = "0%"
                this.app_shown = false

                if (this.$refs.editor_component_ref && (this.mode=="edit") && (this.sub_mode=="code")) {
                    appClearIntervals()
                    this.editor_text = await this.$refs.editor_component_ref.getText()

                    await this.save( this.base_component_id, this.code_id, this.editor_text )
                    await mm.load_app( this.base_component_id  , true)
                }
                this.mode = "profiler"

                setTimeout(function() {
                        mm.setupTimelineEditor()
                        let allWatches = Object.keys(globalWatchList)
                        for (let rt = 0 ; rt < allWatches.length; rt++) {
                            fillInMissingWatchTimelineValues(allWatches[rt],0)
                        }
                    },
                    200)
            },

            rename: async function(nn) {
                let mm = this
                this.edit_name = false
                this.show_name = true



                // commented out as we don't want to replace _ (underscores) with spaces
                //nn = nn.replace(/[\W_]+/g,"_");

                this.console_output = ""
                setTimeout(async function() {
                    //debugger
                    mm.editor_text = yz.deleteCodeString(mm.editor_text, "display_name")
                    mm.editor_text = yz.insertCodeString(mm.editor_text, "display_name", nn)

                    mm.app_component_name = yz.getValueOfCodeString(mm.editor_text,"display_name")
                    if (mm.$refs.editor_component_ref) {
                        if (mm.$refs.editor_component_ref.setText) {
                            mm.$refs.editor_component_ref.setText(mm.editor_text)
                            mm.save_state = "pending"
                        }
                    }
                    mm.$root.$emit('message', {
                        type:               "rename_app",
                        base_component_id:   mm.base_component_id,
                        display_name:        mm.app_component_name
                    })

                },500)
            },



            editAsText: async function() {
                let mm = this

                this.editor_text = await this.$refs.editor_component_ref.getText()

                let eds = yz.getValueOfCodeString(this.editor_text, "editors")
                if (eds) {
                    this.editor_text = yz.deleteCodeString(this.editor_text, "editors")
                    this.editor_text = yz.insertCodeString(this.editor_text, "editors_old",eds)
                }

                await mm.save(   this.base_component_id,   this.code_id,   this.editor_text   )

                await mm.load_new_app( this.base_component_id )
            },



            setVisibility: async function(value) {
                let mm = this

                if (this.$refs.editor_component_ref) {
                    this.editor_text = await this.$refs.editor_component_ref.getText()
                }

                let eds = yz.getValueOfCodeString(this.editor_text, "visibility")
                if (eds) {
                    this.editor_text = yz.deleteCodeString(this.editor_text, "visibility")
                    this.editor_text = yz.insertCodeString(this.editor_text, "visibility",value)
                }

                await mm.save(   this.base_component_id,   this.code_id,   this.editor_text   )

                //await mm.load_new_app( this.base_component_id )
            },



            embedApp: async function(x) {
                let mm = this

                this.editor_overloaded = true
                this.show_download_save = false
                this.show_filename_save = false

                override_app_editor = "embed_app_component"

                await mm.load_new_app( this.base_component_id )
            }
            ,
            checkSavedFile: function() {
                let mm = this
                if (saveCodeToFile) {
                    this.file_save_state = "Saved " + saveCodeToFile
                    setTimeout(function(){
                        mm.file_save_state = saveCodeToFile
                    },1000)
                } else {
                    this.file_save_state = ""
                }
            },

            copyAppMethod: async function( appId , newAppId) {
                let mm = this
                let result = await callFunction(
                                    {
                                        driver_name: "copyApp",
                                        method_name: "copyAppshareApp"  }
                                        ,{
                                              base_component_id:    appId,
                                              new_app_id:           newAppId   })
                if (isValidObject(result)) {
                    mm.$root.$emit('message', {
                                                    type:               "insert_app_at",
                                                    base_component_id:   result.base_component_id,
                                                    display_name:        result.new_display_name,
                                                    card_index:          1
                                                })

                }
                setTimeout(async function() {
                    mm.console_output = ""
                    await mm.load_new_app( result.base_component_id )
                },200)

            }
            ,







           // ---------------------------------------------------------------
           //                           save
           //
           // This is called to save the currently edited code
           // ---------------------------------------------------------------
           save: async function( base_component_id, code_id , textIn, extras) {
               let mm = this
               if (mm.inSave) {
                   return false
               }
               mm.inSave = true

               resetTimer("save")

               try {
                   if (textIn == null) {
                       showTimer("before getText")
                       this.editor_text = await this.$refs.editor_component_ref.getText()
                       showTimer("after getText")
                   } else {
                     this.editor_text = textIn
                   }
                   showTimer()
                   // if (mm.read_only) {
                   //     mm.inSave = false
                   //     return false
                   //}

                   if (mm.$refs.editor_component_ref.lockEditor) {
                       mm.$refs.editor_component_ref.lockEditor()
                   }
                   mm.editor_shell_locked = true

                   showProgressBar()

                   //showTimer("before save code")
                   let allowAppToWorkOffline = false
                   if (extras) {
                       allowAppToWorkOffline = extras.allowAppToWorkOffline
                   }

                   //debugger
                   callAjaxPost("/save_code",
                   {
                       base_component_id:      base_component_id,
                       code_id:                code_id,
                       code:                   this.editor_text,
                       options:                {
                                                   sub_components:         Object.keys(dev_app_component_loaded),
                                                   save_html:              true,
                                                   save_code_to_file:      saveCodeToFile,
                                                   allowAppToWorkOffline:  allowAppToWorkOffline
                                               }
                   }
                   ,
                   async function(response){
                       //debugger
                       showTimer("in save code response")
                       if (mm.$refs.editor_component_ref.savedStatus !== undefined) {
                           await mm.$refs.editor_component_ref.savedStatus({status: "ok"})
                       }

                       let responseJson = JSON.parse(response)
                       mm.code_id = responseJson.code_id
                       console.log("1) mm.code_id= " + mm.code_id)
                       if ((yz.getValueOfCodeString(mm.editor_text,"only_run_on_server") == true)
                            ||
                          (yz.getValueOfCodeString(mm.editor_text,"rest_api")))
                       {
                           mm.is_ui_app = false
                           mm.is_server_app = true
                           let restApi = yz.getValueOfCodeString(mm.editor_text,"rest_api")
                           if (restApi) {
                               mm.is_rest_app = true
                               mm.rest_api_base_url = restApi
                           } else {
                               mm.is_rest_app = false
                           }
                       } else {
                           mm.is_ui_app = false
                           mm.is_server_app = false
                       }
                       if (!mm.is_server_app) {
                           if (mm.app_shown) {
                               //await mm.load_appV2( mm.base_component_id , mm.editor_text, responseJson.code_id, mm.editors2)
                               //debugger
                               // if the app has been changed during the save then don't reload the app
                               //mm.load_appV2( mm.base_component_id , mm.editor_text, responseJson.code_id, mm.editors2)
                               if (!saveCodeToFile) {
                                   showTimer("before load_appV2")
                                   await mm.load_appV2( mm.base_component_id , mm.editor_text, responseJson.code_id, mm.editors2)
                                   showTimer("after load_appV2")
                               } else {
                                   hideProgressBar()
                               }
                           }
                       }
                       hideProgressBar()
                       if (mm.$refs.editor_component_ref.unlockEditor) {
                           mm.$refs.editor_component_ref.unlockEditor()
                       }
                       mm.editor_shell_locked = false

                       mm.save_state = "saved"
                       mm.checkSavedFile()
                       showTimer("done")
                       mm.inSave = false
                       mm.editor_shell_locked = false

                       mm.$root.$emit('message', {
                           type:               "update_app",
                           base_component_id:   base_component_id,
                           code_id:             mm.code_id
                       })

                       showTimer("return")
                       return true
                   })

               } catch (e) {
                   hideProgressBar()
                   this.save_state = "saved"
                   this.checkSavedFile()
                   mm.inSave = false
                   mm.editor_shell_locked = false
                   return true
               }

           }
           ,


           bookmarkCode: async function() {
               try {
                   debugger
                   let mm = this
                   showProgressBar()

                   let postAppUrl = "http" + (($CENTRALHOSTPORT == 443)?"s":"") + "://" + $CENTRALHOST + "/bookmark_commit"
                   callAjaxPost(postAppUrl,
                       {
                           code_id:                   mm.code_id
                           ,
                           user_id:                 "xyz"
                       }
                       ,
                       async function(response){
                           //showTimer("in 'post_app' response")
                           //alert(response)
                           //debugger

                           let responseJson = JSON.parse(response)

                           hideProgressBar()
                           this.save_state = "saved"

                       })

               } catch (e) {
                   hideProgressBar()
                   this.save_state = "saved"
                   //this.checkSavedFile()
               }
           }
           ,




           releaseCode: async function() {
               try {
                   debugger
                   let mm = this
                   showProgressBar()

                   let postAppUrl = "http" + (($CENTRALHOSTPORT == 443)?"s":"") + "://" + $CENTRALHOST + "/release_commit"
                   callAjaxPost(postAppUrl,
                       {
                           code_id:                   mm.code_id
                           ,
                           user_id:                 "xyz"
                       }
                       ,
                       async function(response){
                           //showTimer("in 'post_app' response")
                           //alert(response)
                           //debugger

                           let responseJson = JSON.parse(response)

                           hideProgressBar()
                           this.save_state = "saved"

                       })

               } catch (e) {
                   hideProgressBar()
                   this.save_state = "saved"
                   //this.checkSavedFile()
               }
           }
           ,













           load_new_app: async function ( baseComponentId ) {
               let mm = this
               if ((!baseComponentId) || (baseComponentId == "") || (!mm)) {
                    return
               }
               dev_app_component_loaded = new Object()
               this.editor_loaded = false
               await this.load_app(baseComponentId)
           }
           ,

           load_new_app_by_code_id: async function ( codeId ) {
               let mm = this
               if ((!codeId) || (codeId == "") || (!mm)) {
                   return
               }
               dev_app_component_loaded = new Object()
               this.editor_loaded = false
               await this.load_app_by_code_id(codeId)
           }
           ,


           // ---------------------------------------------------------------
           //                           load_app
           //
           // This loads the latest version of the code stream marked with
           // 'baseComponentId'
           // ---------------------------------------------------------------
           load_app: async function ( baseComponentId, runThisApp ) {
           //zzz
               let code
               let mm   = this
               let codeId
               let results

                try {

                    //
                    // make sure that we reference an app
                    //

                    if ((!baseComponentId) || (baseComponentId == "") || (!mm)) {
                        return
                    }



                   //
                   // set up vars
                   //
                   mm.selected_app          = ""
                   //mm.app_loaded            = false
                   mm.base_component_id     = baseComponentId
                   mm.app_component_name    = null

                   //executionCode       = new Object()
                   mm.app_loaded = true
                   mm.baseComponentId = baseComponentId

                   this.execution_timeline      = executionTimeline
                   this.execution_code          = executionCode
                   this.execution_block_list    = Object.keys(this.execution_code)



                   //
                   // read the code for the component that we are editing
                   //
                   let sql =    `select
                                    id, cast(code as text)  as  code, editors
                                 from
                                    system_code
                                 where
                                        base_component_id = '${baseComponentId}'
                                           and
                                        code_tag = 'LATEST' `

                   results = await callApp(
                       {
                            driver_name:    "systemFunctions2",
                            method_name:    "sql"
                       }
                       ,
                       {
                           sql: sql
                       })


                   if (results) {
                       if (results.length > 0) {

                            //
                            // find the editor
                            //
                            let editors2 = results[0].editors
                            let newEditor = null
                            if (isValidObject(editors2) && (override_app_editor == null)) {
                                let edd = eval("(" + editors2 + ")")
                                newEditor = edd[0]
                            }


                            //
                            // find the code
                            //
                            code = results[0].code
                            codeId = results[0].id
                            mm.code_id = codeId

                            if (code.toString().includes("Vue.")) {
                                this.is_ui_app = true
                                this.is_server_app = false
                            } else {
                                this.is_ui_app = false
                                this.is_server_app = false
                            }

                           this.app_component_name = yz.getValueOfCodeString(code.toString(),"display_name")

                           if ((yz.getValueOfCodeString(code.toString(),"only_run_on_server") == true)
                            ||
                                (yz.getValueOfCodeString(code.toString(),"rest_api"))
                            )
                             {
                                mm.is_ui_app = false
                                mm.is_server_app = true
                                let restApi = yz.getValueOfCodeString(code.toString(),"rest_api")
                                if (restApi) {
                                    mm.is_rest_app = true
                                    mm.rest_api_base_url = restApi
                                } else {
                                    mm.is_rest_app = false
                                }
                            } else {
                                mm.is_server_app = false
                            }


                            if (mm.editor_loaded && (mm.editor_text != code)) {
                                mm.editor_text = code
                                console.log("2) mm.code_id= " + mm.code_id)


                            }


                            //
                            // load the editor
                            //
                            if ( !mm.editor_loaded ) {
                                let editorName = "editor_component"
                                if (override_app_editor != null) {
                                    editorName = override_app_editor
                                }
                                if (newEditor) {
                                     editorName = newEditor
                                }

                                await loadV2( editorName, {text: code} )

                                mm.editor_loaded    = true
                                mm.editor_component = editorName

                           }


                           //
                           // set readonly
                           //
                           this.read_only = yz.getValueOfCodeString(code, "read_only")
                           this.visibility = yz.getValueOfCodeString(code, "visibility")


                       }

                       if ((isValidObject(runThisApp))   && (!runThisApp)) {
                        //do nothing if we set "runthisapp" to false
                       } else {
                            this.resetDebugger()
                            if (mm.is_server_app) {


                            } else {
                            }
                       }


                       setTimeout(async function() {

                           //code = yz.deleteCodeString(code, "display_name")
                           //code = yz.insertCodeString(code, "display_name", newDisplayName)

                           //mm.app_component_name = baseComponentId
                           mm.app_component_name = yz.getValueOfCodeString(code,"display_name")
                           if (mm.$refs.editor_component_ref) {
                                if (mm.$refs.editor_component_ref.setText) {
                                    mm.$refs.editor_component_ref.setText(code)
                                }
                           }
                       },500)
                   }

               } catch (e) {
                   hideProgressBar()
               }
               hideProgressBar()


           }


           ,

           // ---------------------------------------------------------------
           //                           load_app_by_code_id
           //
           // This loads the latest version of the code stream marked with
           // 'baseComponentId'
           // ---------------------------------------------------------------
           load_app_by_code_id: async function ( codeId, runThisApp ) {
               //zzz
               let code
               let mm   = this
               let results

               try {

                   //
                   // make sure that we reference an app
                   //

                   if ((!codeId) || (codeId == "") || (!mm)) {
                       return
                   }



                   //
                   // set up vars
                   //
                   mm.selected_app          = ""
                   //mm.app_loaded            = false
                   mm.app_component_name    = null

                   //executionCode       = new Object()
                   mm.app_loaded = true


                   this.execution_timeline      = executionTimeline
                   this.execution_code          = executionCode
                   this.execution_block_list    = Object.keys(this.execution_code)



                   //
                   // read the code for the component that we are editing
                   //
                   let sql =    `select
                                    id, cast(code as text)  as  code, editors, base_component_id
                                 from
                                    system_code
                                 where
                                        id = '${codeId}'`

                   results = await callApp(
                       {
                           driver_name:    "systemFunctions2",
                           method_name:    "sql"
                       }
                       ,
                       {
                           sql: sql
                       })


                   if (results) {
                       if (results.length > 0) {

                           //
                           // find the editor
                           //
                           let editors2 = results[0].editors
                           mm.baseComponentId = results[0].base_component_id

                           let newEditor = null
                           if (isValidObject(editors2) && (override_app_editor == null)) {
                               let edd = eval("(" + editors2 + ")")
                               newEditor = edd[0]
                           }


                           //
                           // find the code
                           //
                           code = results[0].code
                           codeId = results[0].id
                           mm.code_id = codeId

                           if (code.toString().includes("Vue.")) {
                               this.is_ui_app = true
                               this.is_server_app = false
                           } else {
                               this.is_ui_app = false
                               this.is_server_app = false
                           }

                           this.app_component_name = yz.getValueOfCodeString(code.toString(),"display_name")

                           if ((yz.getValueOfCodeString(code.toString(),"only_run_on_server") == true)
                               ||
                               (yz.getValueOfCodeString(code.toString(),"rest_api"))
                           )
                           {
                               mm.is_ui_app = false
                               mm.is_server_app = true
                               let restApi = yz.getValueOfCodeString(code.toString(),"rest_api")
                               if (restApi) {
                                   mm.is_rest_app = true
                                   mm.rest_api_base_url = restApi
                               } else {
                                   mm.is_rest_app = false
                               }
                           } else {
                               mm.is_server_app = false
                           }


                           if (mm.editor_loaded && (mm.editor_text != code)) {
                               mm.editor_text = code
                               console.log("2) mm.code_id= " + mm.code_id)


                           }


                           //
                           // load the editor
                           //
                           if ( !mm.editor_loaded ) {
                               let editorName = "editor_component"
                               if (override_app_editor != null) {
                                   editorName = override_app_editor
                               }
                               if (newEditor) {
                                   editorName = newEditor
                               }

                               await loadV2( editorName, {text: code} )

                               mm.editor_loaded    = true
                               mm.editor_component = editorName

                           }


                           //
                           // set readonly
                           //
                           this.read_only = yz.getValueOfCodeString(code, "read_only")
                           this.visibility = yz.getValueOfCodeString(code, "visibility")


                       }

                       if ((isValidObject(runThisApp))   && (!runThisApp)) {
                           //do nothing if we set "runthisapp" to false
                       } else {
                           this.resetDebugger()
                           if (mm.is_server_app) {


                           } else {
                           }
                       }


                       setTimeout(async function() {

                           //code = yz.deleteCodeString(code, "display_name")
                           //code = yz.insertCodeString(code, "display_name", newDisplayName)

                           //mm.app_component_name = baseComponentId
                           mm.app_component_name = yz.getValueOfCodeString(code,"display_name")
                           if (mm.$refs.editor_component_ref) {
                               if (mm.$refs.editor_component_ref.setText) {
                                   mm.$refs.editor_component_ref.setText(code)
                               }
                           }
                       },500)
                   }

               } catch (e) {
                   hideProgressBar()
               }
               hideProgressBar()


           }


           ,







           // ---------------------------------------------------------------
           //                           loadAppViaCommitId
           //
           // This loads the latest version of the code stream marked with
           // 'baseComponentId'
           // ---------------------------------------------------------------
           loadAppViaCommitId: async function ( commitId, runThisApp ) {
               let code
               let mm   = this
               let codeId
               let results

               try {

                   //
                   // make sure that we reference an app
                   //

                   if ((!commitId) || (commitId == "") || (!mm)) {
                       return
                   }



                   //
                   // set up vars
                   //
                   mm.selected_app          = ""
                   //mm.app_loaded            = false
                   mm.app_component_name    = null

                   //executionCode       = new Object()
                   mm.app_loaded = true

                   this.execution_timeline      = executionTimeline
                   this.execution_code          = executionCode
                   this.execution_block_list    = Object.keys(this.execution_code)



                   //
                   // read the code for the component that we are editing
                   //
                   let sql =    `select
                                    id, cast(code as text)  as  code, editors, base_component_id
                                 from
                                    system_code
                                 where
                                        id = '${commitId}'
                                `

                   results = await callApp(
                       {
                           driver_name:    "systemFunctions2",
                           method_name:    "sql"
                       }
                       ,
                       {
                           sql: sql
                       })


                   if (results) {
                   //debugger
                       if (results.length > 0) {


                           mm.baseComponentId = results[0].base_component_id

                           //
                           // find the editor
                           //
                           let editors2 = results[0].editors
                           let newEditor = null
                           if (isValidObject(editors2) && (override_app_editor == null)) {
                               let edd = eval("(" + editors2 + ")")
                               newEditor = edd[0]
                           }


                           //
                           // find the code
                           //
                           code = results[0].code
                           codeId = results[0].id
                           mm.code_id = codeId

                           if (code.toString().includes("Vue.")) {
                               this.is_ui_app = true
                               this.is_server_app = false
                           } else {
                               this.is_ui_app = false
                               this.is_server_app = false
                           }

                           this.app_component_name = yz.getValueOfCodeString(code.toString(),"display_name")

                           if ((yz.getValueOfCodeString(code.toString(),"only_run_on_server") == true)
                               ||
                               (yz.getValueOfCodeString(code.toString(),"rest_api"))
                           )
                           {
                               mm.is_ui_app = false
                               mm.is_server_app = true
                               let restApi = yz.getValueOfCodeString(code.toString(),"rest_api")
                               if (restApi) {
                                   mm.is_rest_app = true
                                   mm.rest_api_base_url = restApi
                               } else {
                                   mm.is_rest_app = false
                               }
                           } else {
                               mm.is_server_app = false
                           }


                           if (mm.editor_loaded && (mm.editor_text != code)) {
                               mm.editor_text = code
                               console.log("2) mm.code_id= " + mm.code_id)


                           }


                           //
                           // load the code
                           //

                           //zzz
                           debugger
                           //await mm.load_appV2( mm.base_component_id , mm.editor_text, commitId, mm.editors2)
                           mm.editor_text = code
                           mm.code_id = commitId
                           await loadV2( mm.editor_component, {text: code} )
                           await callApp( {code_id:    commitId }, {} )
                           mm.refresh++
                           //this.resetDebugger()



                           //
                           // set readonly
                           //
                           this.read_only = yz.getValueOfCodeString(code, "read_only")
                           this.visibility = yz.getValueOfCodeString(code, "visibility")


                       }

                       if ((isValidObject(runThisApp))   && (!runThisApp)) {
                           //do nothing if we set "runthisapp" to false
                       } else {
                           this.resetDebugger()
                           if (mm.is_server_app) {


                           } else {
                           }
                       }


                       setTimeout(async function() {

                           //code = yz.deleteCodeString(code, "display_name")
                           //code = yz.insertCodeString(code, "display_name", newDisplayName)

                           //mm.app_component_name = baseComponentId
                           mm.app_component_name = yz.getValueOfCodeString(code,"display_name")
                           if (mm.$refs.editor_component_ref) {
                               if (mm.$refs.editor_component_ref.setText) {
                                   mm.$refs.editor_component_ref.setText(code)
                               }
                               debugger
                           }
                       },500)
                   }

               } catch (e) {
                   console.log(e)
                   hideProgressBar()
               }
               hideProgressBar()


           }


           ,










            // ---------------------------------------------------------------
            //                           load_appV2
            //
            // This loads the latest version of the code stream marked with
            // 'baseComponentId'
            // ---------------------------------------------------------------
            load_appV2: async function ( baseComponentId, passin_code, passin_code_id , passin_editors2) {
                //zzz
                try {
                    //
                    // make sure that we reference an app
                    //
                    let mm = this
                    if ((!baseComponentId) || (baseComponentId == "") || (!mm)) {
                        return
                    }


                    //
                    // set up vars
                    //
                    mm.selected_app             = ""
                    //mm.app_loaded             = false
                    mm.base_component_id        = baseComponentId
                    mm.app_component_name       = null
                    //executionCode             = new Object()
                    mm.app_loaded               = true
                    mm.baseComponentId          = baseComponentId
                    mm.execution_timeline       = executionTimeline
                    mm.execution_code           = executionCode
                    mm.execution_block_list     = Object.keys(this.execution_code)
                    code                        = passin_code
                    codeId                      = passin_code_id
                    let editors2                = passin_editors2
                    let newEditor               = null



                    //
                    // find the editor
                    //
                    if (isValidObject(editors2) && (override_app_editor == null)) {
                        let edd = eval("(" + editors2 + ")")
                        newEditor = edd[0]
                    }


                    if (code.toString().includes("Vue.")) {
                        this.is_ui_app = true
                        this.is_server_app = false
                    } else {
                        this.is_ui_app = false
                        this.is_server_app = false
                    }
                    this.app_component_name = yz.getValueOfCodeString(code.toString(),"display_name")

                    if ((yz.getValueOfCodeString(code.toString(),"only_run_on_server") == true)
                    ||
                    (yz.getValueOfCodeString(code.toString(),"rest_api"))
                    )
                    {
                        mm.is_ui_app = false
                        mm.is_server_app = true
                        let restApi = yz.getValueOfCodeString(code.toString(),"rest_api")
                        if (restApi) {
                        mm.is_rest_app = true
                        mm.rest_api_base_url = restApi
                    } else {
                        mm.is_rest_app = false
                    }
                    } else {
                        mm.is_server_app = false
                    }


                    if (mm.editor_loaded && (mm.editor_text != code)) {
                        mm.editor_text = code
                        mm.code_id = codeId
                        console.log("3) mm.code_id= " + mm.code_id)
                    }


                    //
                    // load the editor
                    //
                    if ( !mm.editor_loaded ) {
                        let editorName = "editor_component"
                        if (override_app_editor != null) {
                            editorName = override_app_editor
                        }
                        if (newEditor) {
                            editorName = newEditor
                        }

                        await loadV2( editorName, {text: code} )

                        mm.editor_loaded    = true
                        mm.editor_component = editorName
                    }


                    //
                    // set readonly
                    //
                    this.read_only = yz.getValueOfCodeString(code, "read_only")
                    this.visibility = yz.getValueOfCodeString(code, "visibility")


                    this.resetDebugger()
                    if (mm.is_server_app) {


                    } else {
                        await callApp( {code_id:    codeId }, {} )
                    }



                    setTimeout(async function() {
                        //mm.app_component_name = baseComponentId
                        mm.app_component_name = yz.getValueOfCodeString(code,"display_name")
                        if (mm.$refs.editor_component_ref) {
                            if (mm.$refs.editor_component_ref.setText) {
                                mm.$refs.editor_component_ref.setText(code)
                            }
                        }
                    },500)


                    } catch (e) {
                        hideProgressBar()
                    }
                    hideProgressBar()


                }


            },








            mounted: async function () {
                let mm = this
                await useIdeTools()
                await useEstraverse()
                await useEsCodeGen()
                await useVisJs()
                await useVisCss()
                await useDiffJs()
                //await useD3()
                uiDebuggerOn = true
                if ($HIDEIMPORTBUTTONS == 'false') {
                    mm.hideImportButtons = false
                }
                override_app_editor = null

                this.show_download_save = true
                this.show_filename_save = false


                this.execution_timeline   = executionTimeline
                this.execution_code       = executionCode
                this.execution_block_list = Object.keys(this.execution_code)

                //
                // make sure we load the component for this app
                //
                if (mm.app_id) {
                    editingAppId = this.app_id
                    component_loaded[this.app_id]           = false
                    dev_app_component_loaded[this.app_id]   = false
                    component_cache[this.app_id]            = null

                    await this.load_app(this.app_id)

                }

                this.$root.$on('message', async function(message) {
                    if (message.type == "set_info_text") {
                        mm.info_text = message.text
                    } else if (message.type == "saving") {
                        mm.save_state = "saving"
                        mm.file_save_state = ""
                    } else if (message.type == "pending") {
                        mm.save_state = "pending"
                        mm.file_save_state = (saveCodeToFile?saveCodeToFile:"")
                    } else if (message.type == "saved") {
                        mm.save_state = "saved"
                        mm.checkSavedFile()
                    } else if (message.type == "force_save") {
                        //mm.save_state = "saved"
                        //mm.checkSavedFile()
                    } else if (message.type == "force_raw_load") {
                        //debugger
                        //mm.save_state = "pending"
                        //mm.checkSavedFile()
                        await mm.loadAppViaCommitId(   message.commitId , true )
                        mm.$root.$emit('message', {
                            type:               "update_app",
                            base_component_id:   mm.app_id,
                            code_id:             message.commitId
                        })
                    }


                })

                setInterval(async function() {

                    if ((!mm.read_only) && (mm.save_state == 'pending' || (!mm.save_state))) {
                        //debugger
                        if (!disableAutoSave) {
                            appClearIntervals();

                            await mm.save(mm.base_component_id, mm.code_id, null)
                        }
                    }
                },5000)
                mm.refresh ++


           }
       })
       return {name: "app_editor"}

}
