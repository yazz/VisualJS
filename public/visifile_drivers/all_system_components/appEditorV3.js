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



    /*
________________________________________
|                                      |
|             app_editor_3             |
|                                      |
|            Vue component             |
|______________________________________|
This is the main UI Component for the Yazz Editor. It contains:
- Text, UI, and projectional editors
- Debugger
- App/Component Preview



________
| DATA |______________________________________________________________
|
|---------------------
|        SETUP       |
|---------------------
|     mounted                       Setup everything
|
|---------------------
|    DEBUGGING DATA  |
|---------------------
|     sqlite_data_saved_in_html     Save the Sqlite data in the app HTML file?
|     execution_timeline            Array of execution points for the program
|     execution_horiz_scale         horiz scale
|     y_step                        how many y steps
|     timeline_editor               ID for the timeline editor
|     current_execution_step        current step in the program run
|     current_execution_step_y_line y step
|     execution_code                current code  being executed
|     execution_block_list          list of blocks
|     execution_var_list            list of vars
|     execution_watch_list          list of watch vars
|     highlighted_line              current line number highlighted
|     timeline_x_cursor             pos of x cursor
|     timeline_y_cursor             pos of y cursor
|     timeline_pause                Pause the timeline if certain mouse events happening
|     highlighted_block             which block highlighted
|     highlighted_block_name        which block highlighted
|     debugger_right_mode           What should we show on the right hand side of the debugger such as "watches"
|     debugger_selected_pane        Which pane has been selected, such as "watches"
|
|---------------------
|    SAVING DATA     |
|---------------------
|     file_save_state               Text which shows information on saving the current app such as "Saved ..."
|     inSave                        True/false which can tell us if we are in the "save" method, to prevent reentry
|     save_state                    Pending, saved, saving, etc
|     show_download_save            Should we show the download/save buttons
|     show_filename_save            Should we show the the file save button (for desktop editor)
|
|---------------------
|      UI DATA       |
|---------------------
|     hideImportButtons             When running in web mode don't show all homepage buttons such as "Open as file"
|     refresh                       Used to force the update the UI when a change is made
|     app_width                     app preview width
|     code_width                    code editor width
|     app_shown                     show the app preview?
|     code_shown                    show the code editor?
|
|---------------------
|    EDITOR DATA     |
|---------------------
|     editor_shell_locked           True/false to lock the editing UI when saving code, to prevent new edits
|     info_text                     Informational text shown at the bottom of the text editor
|     editor_loaded                 Set to true once the whole editor has loaded
|     editor_overloaded             If we switch from the main editor then set to true (such as Sqlite editor)
|     editor_component              The name of the VueJS component editor such as "vb_editor_component"
|     app_loaded                    Set to true once an app has been loaded
|     preview_type                  Is the preview pane showing an "app" or a "control"
|     component_display_name        The name of the edited component (shown in top left)
|     base_component_id             The base component ID of the component being edited
|     code_id                       The commit ID of the component being edited
|     read_only                     Is the app read only
|     extra_menu                    Show the extra menu in the top right of the editor?
|     mode                          Are we in "edit" or "profiler" mode?
|     sub_mode                      In the editor are we in "code", "app", or "both" mode
|     show_name                     Show the display name of the component?
|     edit_name                     Are we editing the display name?
|     editor_text                   The code of the current component being edited
|     display_name                  The display name of the current component being edited
|     override_app_editor           Sometimes we override the app editor to show something like the Sqlite DB schema editor

|________________________________________________________________________

___________
| METHODS |______________________________________________________________
|
|-------------------------
|    DEBUGGING METHODS
|-------------------------
|     getVarAsHtml                      : function(viewer,varName) {
|     getVarAsBarChart                  : function(value) {
|     resetDebugger                     : function() {
|     stepForward                       : function() {
|     stepBack                          : function() {
|     timelineRefresh                   : function(move) {
|     updateTimeline                    : function( args ) {
|     mouseEnterTimeline                : function(ev) {
|     mouseClickTimeline                : function(ev) {
|     inTimelineScroll                  : function() {
|     mouseMoveTimeline                 : function(ev) {
|     addWatch                          : async function(varN){
|     deleteWatch                       : async function(varN){
|     keepWatch                         : async function(varN){
|     setupTimelineEditor               : function() {
|
|
|-------------------------
|    UI METHODS
|-------------------------
|     setInfo                           : function(text) {
|     chooseRightDebugPane              : function(ff) {
|     chooseApp                         : async function() {
|     chooseCode                        : async function() {
|     chooseBoth                        : async function() {
|     chooseProfiler                    : async function() {
|
|-------------------------
|    EDITOR METHODS
|-------------------------
|     closeSubEditor                    : async function() {
|     switchEditor                      : async function(editor_component_id) {
|     closeEditor                       : async function(event,item) {
|     rename                            : async function(nn) {
|     editAsText                        : async function() {
|
|-------------------------
|    SAVE METHODS
|-------------------------
|     checkSavedFile                    : function() {
|     copyApp                           : async function( appId , newAppId, codeId) {
|     bookmarkCode                      : async function() {
|     loadComponentIntoEditor    : async function ( options ) {
|     save                              function( base_component_id, code_id , textIn, extras) {
|
|________________________________________________________________________ */
    // Hack city!!! Turn off the component cache so that we can enable hot reloading of components
    GLOBALS.isStaticHtmlPageApp = false
    Yazz.component(
    {
        props:          ['arg_edit_base_component_id', 'arg_edit_code_id'],
        template:       `
<div style="height: 100%; width:100%;padding:0; margin:0; border: 5px solid lightgray;position:relative;">
    <div style='box-shadow: 2px 2px 10px lightgray;background-image: linear-gradient(to right,  #000099, lightblue); color: white;padding: 7px; padding-left: 15px;display: block;overflow: auto;'>
        <img
            src='/driver_icons/project.png'
            style='width: 20px; margin-right: 10px;'
            class='img-fluid'>
        </img>

        <h5  class='caption' style='display: inline-block;' v-on:click='if (!read_only) {edit_name=true;show_name=false;}' v-if='show_name'>
            {{component_display_name?"" + component_display_name.substring(0,30):""}}{{(component_display_name && ((component_display_name.length > 50))?"...":"")}} 
          
        </h5>

        <input    class='caption' 
                  v-bind:style='"display: inline-block;" + (editor_shell_locked?"pointer-events: none;opacity: 0.4;":"")' 
                  v-if='edit_name'
                  v-on:focusout='(async function(){await rename(component_display_name)})()'
                  v-model='component_display_name'></input>




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

                <button  v-if='(mode != "profiler") && (!editor_overloaded)' type=button class=' btn btn-sm '        v-on:click='yazz_debug_mode = !yazz_debug_mode' >D</button>
              
                <button  v-if='(editor_component != "textEditorPlugInComponent") && (!read_only) && (mode != "profiler") && (!editor_overloaded)' type=button class=' btn btn-info btn-sm'   v-on:click='editAsText()' >Edit as text</button>

                <button  v-if='(mode != "profiler") && (!editor_overloaded)' type=button class=' btn btn-sm btn-warning'        v-on:click='setTimeout(function(){copyApp(base_component_id, null,code_id)},100)' >Copy app</button>

                <button  v-if='(mode != "profiler") && (!editor_overloaded)' type=button class=' btn btn-sm btn-info'        v-on:click='setTimeout(function(){switchEditor("keycloak_editor_component")},100)' >Keycloak</button>

                <button  v-if='(mode != "profiler") && (!editor_overloaded)' type=button class=' btn btn-sm btn-warning'        v-on:click='setTimeout(function(){switchEditor("sqlite_editor_component")},100)' >Database</button>

                <button  v-if='(mode != "profiler") && (!editor_overloaded)' type=button class=' btn btn-sm btn-info'        v-on:click='setTimeout(function(){switchEditor("export_editor_component")},100)' >Export</button>

            </div>


            <div v-if='(!extra_menu) && (!editor_overloaded)' class='btn-group' role=group style='box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);margin-right: 20px;'>
                <button  type=button class=' btn btn-info btn-sm'   v-on:click='extra_menu=true' >More</button>
            </div>

            <div v-if='extra_menu && (!editor_overloaded)' class='btn-group' role=group style='box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);margin-right: 20px;'>
                <button  type=button class=' btn btn-info btn-sm'   v-on:click='extra_menu=false' >Less</button>
            </div>


            <div class='btn-group' style='box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);' role=group >
                <button  type=button class=' btn btn-danger btn-sm'   v-on:click='$event.stopPropagation();yz.editor.saveControlChanges=true;closeEditor()' >
                  <span v-if="!yz.editor.lastEditingAppCodeId">Close</span>
                  <span v-if="yz.editor.lastEditingAppCodeId">Update app</span>
                </button>
            </div>
            <div class='btn-group' style='box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);' role=group >
                <button  type=button class=' btn btn-danger btn-sm'   v-on:click='$event.stopPropagation();yz.editor.saveControlChanges=false;closeEditor()'
                         v-if="yz.editor.lastEditingAppCodeId">
                  <span v-if="yz.editor.lastEditingAppCodeId">Cancel</span>
                </button>
            </div>

        </span>
    </div>



    <div v-if='yazz_debug_mode'
          style="position:fixed; left:2vw;top:2vh;width:96vw;height:95%;background-color: white;z-index:100000000; border: black solid 2px;"
    >
        Debug editor
      <button  type=button class=' btn btn-danger btn-sm'
               style="float: right;box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 8px 0px, rgba(0, 0, 0, 0.19) 0px 6px 20px 0px;margin-bottom: 2px;"
               v-on:click='yazz_debug_mode=false' >x</button>

    </div>


    <div    id="status bar"
            ref="status bar"
            style='position:absolute;bottom:-5px;width:100%;box-shadow: 2px 2px 10px lightgray; color: black;padding: 0px; padding-left: 15px;display: block;overflow: auto;background-color: lightgray;z-index:21474836;text-align: center;height: 30px; font-size:16px;vertical-align: middle;line-height: 30px; '>
        {{((info_text != null)?info_text:"")}}
    </div>
    

    <div v-if='mode == "edit"'>
        <div    id=editor_id
                v-bind:style="'height: 100%; width: ' + code_width + '; left: 0px; display: ' + (code_shown?'inline-block':'none') + ';'">
            <component  v-bind:is='GLOBALS.baseComponentIdReturnsCommitId[editor_component]'
                        v-if="editor_loaded"
                        ref="editor_component_ref">

                <div      slot-scope="editor_component" style='display: inline-block;width:100%;'>


                  <!-- ----------------------------------------------

                             Icon editor
                        
                        ---------------------------------------------- -->
                  <a   v-bind:style="'margin-left:0px;margin-right: 6px;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);visibility: ' + (code_shown?'':'hidden') + ';' "
                       href="#"
                       v-on:click='setTimeout(async function(){await switchEditor("icon_editor_component")},100)'
                       v-if="show_download_save"
                       v-on:mouseenter='setInfo("Publish this app to the central server")'
                       v-on:mouseleave='setInfo(null)'
                       type="button" class="btn btn-light ">

                    <img
                        src='/driver_icons/icon.png'
                        style='height:35px; margin-right: 10px;'
                        class='img-fluid'>
                    </img>
                    Icon

                  </a>
                  
                  
                  <!-- ----------------------------------------------
                  
                       Download
                  
                  ---------------------------------------------- -->
                  <a   v-bind:style="'margin-left:0px;margin-right: 6px;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);visibility: ' + (code_shown?'':'hidden') + ';' "
                       href="#"
                       v-bind:href='location.protocol + "//" + location.hostname + ":" + location.port + "/app/yazz_" + yz.editor.editingAppBaseComponentId + ".yazz"'
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
                  
                  
                  <a   v-bind:style="'margin-left:0px;margin-right: 6px;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);visibility: ' + (code_shown?'':'hidden') + ';' "
                       href="#"
                       v-on:click='setTimeout(async function(){await switchEditor("history_viewer_component")},100)'
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
                  <a   v-bind:style="'margin-left:0px;margin-right: 6px;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);visibility: ' + (code_shown?'':'hidden') + ';' "
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
                  <a   v-bind:style="'margin-left:0px;margin-right: 6px;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);visibility: ' + (code_shown?'':'hidden') + ';' "
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
                              v-on:click='setTimeout(function(){closeSubEditor()},100)'
                              v-if="editor_overloaded"
                              v-on:mouseenter='setInfo("Back to editor")'
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
                              v-bind:style="'margin-left:50px;margin-right: 6px;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);visibility: ' + (code_shown?'':'hidden') + ';' + (read_only?'opacity:.3;':'')"
                              v-on:mouseenter='setInfo("Save the changes made in the UI and reload the app")'
                              v-on:mouseleave='setInfo(null)'
                              v-on:click='setTimeout(async function(){appClearIntervals();await save(base_component_id, code_id,null)},100)'
                              type="button" class="btn  btn-warning"
                              v-if="(((!hideImportButtons) || yz.mainVars.disableAutoSave) && (!read_only) && ((save_state == 'pending') || (!save_state)))"
                              >

                              <img
                                  src='/driver_icons/save.png'
                                  style='height:35px; margin-right: 10px;'
                                  class='img-fluid'>
                              </img>{{saveCodeToFile?"Save":"Save"}}

                    </button>


                    <button   v-bind:style="'margin-left:0px;margin-right: 6px;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);visibility: ' + (code_shown?'':'hidden') + ';' "
                              v-on:mouseenter='setInfo("Save the changes made in the UI and reload the app")'
                              v-on:mouseleave='setInfo(null)'
                              v-on:click='setTimeout(function(){copyApp(base_component_id, null,code_id)},100)'
                              type="button" class="btn  btn-primary"
                              v-if='(mode != "profiler") && (!editor_overloaded) && ((preview_type == "app") || ((preview_type == "control")) && (yz.editor.lastEditingAppCodeId == null))'>

                              <img
                                  src='/driver_icons/remix.png'
                                  style='height:35px; margin-right: 10px;'
                                  class='img-fluid'>
                              </img>Remix

                    </button>


                  
                  
                  <span
                      v-if='read_only && hideImportButtons'
                  >
                      {{read_only?"Read only":""}}
                    </span>
                  
                  <span
                      v-if="!read_only && (save_state == 'pending') && hideImportButtons && (!yz.mainVars.disableAutoSave)"
                  >
                          Unsaved...
                    </span>

                  <span
                      v-if="!read_only && (save_state == 'saved') && hideImportButtons"
                  >
                      Saved
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














            <div    v-if='app_loaded'
                    v-bind:style="'display:flex;color:blue;padding: 5px; margin-top: 3px; position: relative; border: 0px;border-bottom: 4px solid lightsteelblue;'">

    

              
                <!-- ----------------------------------------------
                Refresh button 
                ---------------------------------------------- -->
                <button   
                    v-on:click='setTimeout(async function(){appClearIntervals();await loadComponentIntoEditor({codeId: code_id, runThisApp: true})},100)'
                    type="button"
                    v-bind:style="'padding: 0px; margin-top: 0px; margin-left:10px; position: relative; border: 0px;background-color: rgb(242, 242, 242);' + (read_only?'opacity:0.2;':'')"
                    class="btn"
                    >
                    <img
                        src='/driver_icons/reload.png'
                        style='height:25px; margin-right: 0px;'
                        class='img-fluid'
                        >
                    </img>
                </button>
    

                <!-- ----------------------------------------------
                App Preview Address Bar 
                ---------------------------------------------- -->
                <input
                    readonly
                    v-if='preview_type=="app"'
                    style='text-decoration: underline;flex:1;font-family:verdana,helvetica;font-size: 13px;margin-left:10px;'
                    v-on:click='let win = window.open(location.protocol + "//" + getNetworkHostName() + ":" + location.port + "/app/" + base_component_id + ".html", "_blank"); win.focus();'
                    v-bind:value='location.protocol + "//" + getNetworkHostName() + ":" + location.port + "/app/" + base_component_id + ".html"'>
                </input>

                <span
                    v-if='preview_type!="app"'
                    style='flex:1;font-family:verdana,helvetica;font-size: 13px;margin-left:10px;margin-top:2px;'>
                        {{ "Previewing '" + base_component_id + "'" }}
                </span>





              <!-- ----------------------------------------------
              "Save As HTML" button
              ---------------------------------------------- -->
                <a        
                    v-on:click='if ((preview_type=="app") && (!sqlite_data_saved_in_html)) {sqlite_data_saved_in_html = true;setTimeout(async function(){appClearIntervals();await save(base_component_id, code_id,null,{allowAppToWorkOffline: true});setTimeout(function(){document.getElementById("saveHTMLButton").click();sqlite_data_saved_in_html = false;},700)},100);} '
                    v-bind:style="'padding: 0px; margin-top: 0px; margin-left:0px; position: relative; border: 0px;background-color: rgb(242, 242, 242);' + (sqlite_data_saved_in_html?'opacity:0.2;':'') "
                    v-if="(preview_type=='app')"
                    v-on:mouseenter='setInfo("Download this app as a standalone HTML file")'
                    v-on:mouseleave='setInfo(null)'
                    v-bind:disabled='sqlite_data_saved_in_html?false:""'
                    type="button"
                    class="btn btn-light"
                    >
                    <img  
                        src="/driver_icons/html.png"
                        v-bind:disabled='sqlite_data_saved_in_html?false:""'
                        style="height: 25px;; margin: 0px;"
                        class='img-fluid'
                        >
                    </img>
                </a>
                
                <a          
                    v-bind:href='location.protocol + "//" + location.hostname + ":" + location.port + "/app/yazz_" + yz.editor.editingAppBaseComponentId + ".html"'
                    v-if="(preview_type=='app')"
                    download
                    id="saveHTMLButton"
                    type="button"
                    style="width: 1px; height: 1px;padding:0px;margin:0px"
                    class="btn btn-light"
                    >
                </a>



<!-- ----------------------------------------------

Embed button

---------------------------------------------- -->
              <a   v-bind:style="'padding: 0px; margin-top: 0px; margin-left:0px; position: relative; border: 0px;background-color: rgb(242, 242, 242);'"
                   v-if="show_download_save && (preview_type=='app')"
                   v-on:click='setTimeout(async function(){await switchEditor("embed_app_component", {})},100)'
                   v-on:mouseenter='setInfo("Download the JS .yazz file for this app")'
                   v-on:mouseleave='setInfo(null)'
                   type="button" class="btn btn-light ">
                


                <img
                    src='/driver_icons/embed.png'
                    style='height:25px; margin-right: 0px;'
                    class='img-fluid'>
                </img>
              </a>
              
            </div>
<!-- ----------------------------------------------

End of app preview menu

---------------------------------------------- -->






            <!-- ----------------------------------------------
            
            Preview a component
            
            ---------------------------------------------- -->
            <div  v-if='app_loaded  &&  (preview_type=="control")'>
                  <component  id="control_preview_component"
                              ref="control_preview_component"
                              v-if='app_loaded  &&  (preview_type=="control")'
                              style='background-color: white;'
                              v-bind:is='GLOBALS.baseComponentIdReturnsCommitId["totally_blank_app"]'
                              v-bind:args="{control_type: base_component_id  ,  control_code_id: code_id}"
                              >
                  </component>
            </div>






            <!-- ----------------------------------------------
            
            Preview an app 
            
            ---------------------------------------------- -->
            <div  v-if='app_loaded  &&  (preview_type=="app")'>
                <component  id="app_preview_component"
                            ref="app_preview_component"
                            v-if='app_loaded  &&  (preview_type=="app")'
                            style='background-color: white;'
                            v-bind:is="code_id"
                >
                </component>
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
                <div    v-bind:class='(debugger_right_mode == "watches"?"right_project_pane_expanded":"right_project_pane_collapsed")''
                        v-bind:refresh='refresh'
                        v-bind:style='"padding:0px; border: 4px solid lightgray;white-space:nowrap"'>

                    <div v-bind:style='"border-radius: 3px;  padding: 4px;overflow-x:none;height: 40px;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);font-family:verdana,helvetica;font-size: 13px;font-weight:bold;padding-left:10px;" '
                         v-bind:class='(debugger_selected_pane == "watches"?"selected_pane_title":"unselected_pane_title") '
                         v-on:click='$event.stopPropagation();debugger_selected_pane = "watches";chooseRightDebugPane("watches");'>
                        Watch vars
                    </div>
                    <div  v-bind:style='"font-family:verdana,helvetica;font-size: 13px;border-radius: 3px; padding:4px; border-right:2px solid gray;border-bottom:2px solid gray; margin-top:2px;;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);height:80%;background-color:lightgray;"  + (debugger_right_mode == "watches"?"":"display:none;")'>
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



                <div    v-bind:class='(debugger_right_mode == "scope"?"right_properties_pane_collapsed":"right_properties_pane_collapsed")'
                        v-bind:style='"padding:0px; border: 4px solid lightgray;padding:0px;background-color: lightgray;"'>

                    <div    v-bind:style='"border-radius: 3px;padding: 4px;height: 40px;overflow-x:none;white-space:nowrap;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);overflow:hidden ;text-overflow: ellipsis;font-family:verdana,helvetica;font-size: 13px;font-weight:bold;padding-left:10px;"'
                            v-bind:class='(debugger_selected_pane == "scope"?"selected_pane_title_slower":"unselected_pane_title_slower") '
                            v-on:click='debugger_selected_pane = "scope";chooseRightDebugPane("scope");'>
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
`,
        data:           function() {
           return {
               sqlite_data_saved_in_html:       false,
               file_save_state:                 (saveCodeToFile?saveCodeToFile:""),
               editor_shell_locked:             true,
               info_text:                       "",
               inSave:                          false,
               hideImportButtons:               true,
               refresh:                         0,
               editor_loaded:                   false,
               editor_overloaded:               false,
               show_download_save:              false,
               show_filename_save:              false,
               editor_component:                null,
               debugger_right_mode:             "scope",
               debugger_selected_pane:          "scope",
               execution_timeline:              null,
               execution_horiz_scale:           3,
               y_step:                          30,
               timeline_editor:                 null,
               current_execution_step:          -1,
               current_execution_step_y_line:   -1,
               execution_code:                  null,
               execution_block_list:            [],
               execution_var_list:              [],
               execution_watch_list:            [],
               highlighted_line:                -1,
               timeline_x_cursor:               -1,
               timeline_y_cursor:               10,
               timeline_pause:                  false,
               highlighted_block:               "",
               highlighted_block_name:          "",
               app_loaded:                      false,
               preview_type:                    "app",
               component_display_name:          null,
               base_component_id:               null,
               code_id:                         null,
               app_width:                       "33%",
               code_width:                      "63%",
               app_shown:                       true,
               code_shown:                      true,
               read_only:                       false,
               extra_menu:                      false,
               mode:                            "edit",
               sub_mode:                        "both",
               show_name:                       true,
               edit_name:                       false,
               editor_text:                     "",
               yazz_debug_mode:                 false,
               autosaveTimer:                   null,
               deleteAutosaveTimer:             false,
               save_state:                      "saved"
           }
       },
        methods:        {
            // editor actions
            closeSubEditor:                 async function  (  ) {
               // ---------------------------------------------------------------
               //                         closeSubEditor
               //
               // Whenever we go to a subeditor, like the history editor for
               // example, we still need to go back to the main editor. Calling this
               // function will do that
               // ---------------------------------------------------------------
               let mm                                               = this
               this.editor_overloaded                               = false
               this.show_download_save                              = true
               this.show_filename_save                              = false
               this.preview_type                                    = "app"
               this.override_app_editor                             = null
               this.editor_text                                     = await mm.$refs.editor_component_ref.getText()

               await mm.loadComponentIntoEditor({
                    codeId:     mm.code_id,
                    newApp:     true}
                    )
           },
            switchEditor:                   async function  (  editor_component_id  ) {
               // ---------------------------------------------------------------
               //                         switchEditor
               //
               // Whenever we go away from the main editor to a subeditor such as
               // the database schema view then we use this function. eg:
               //
               //     switchEditor("sqlite_editor_component")
               //
               // ---------------------------------------------------------------
               let mm = this

               this.editor_overloaded = true
               this.show_download_save = false
               this.show_filename_save = false

               this.override_app_editor = editor_component_id

               await mm.loadComponentIntoEditor(
                    {
                        newApp:             true,
                        baseComponentId:    this.base_component_id,
                        codeId:             this.code_id
                    })

           },
            setInfo:                        function        (  text  ) {
               // ---------------------------------------------------------------
               //                         setInfo
               //
               // Sets the info message bar at the bottom of the editor pane
               // ---------------------------------------------------------------
               this.$root.$emit('message', {
                   type:   "set_info_text",
                   text:    text
               })
           },
            closeEditor:                    async function  (  event,item  ) {
               // ---------------------------------------------------------------
               //                         closeEditor
               //
               // Close the code editor (which usually takes us back to the homepage
               // with all the apps)
               // ---------------------------------------------------------------
               let mm = this
               if (yz.editor.subEditorAction == "FORK_CONTROL") {
                   yz.editor.finalBaseComponentIdOfEditedUiControl = mm.base_component_id
                   yz.editor.finalCodeIdOfEditedUiControl = mm.code_id
                   this.$root.$emit("message", {
                       type: "return_from_fork_component",
                       base_component_id: yz.editor.lastEditingAppBaseComponentId,
                       code_id: yz.editor.lastEditingAppCodeId
                   })

               } else if (yz.editor.subEditorAction == "EDIT_CONTROL") {
                       yz.editor.finalBaseComponentIdOfEditedUiControl   = mm.base_component_id
                       yz.editor.finalCodeIdOfEditedUiControl            = mm.code_id
                       this.$root.$emit("message", {    type:               "return_from_edit_component",
                           base_component_id:   yz.editor.lastEditingAppBaseComponentId,
                           code_id:             yz.editor.lastEditingAppCodeId
                       })

               } else if (yz.editor.lastEditingAppBaseComponentId) {
                   this.$root.$emit("message", { type:  "edit_component", base_component_id:   yz.editor.lastEditingAppBaseComponentId, form_id: active_form, control_name: model.forms[active_form].components[active_component_index].name})

               } else {
                   this.$root.$emit('message', {
                       type:        "close_app"
                   })
               }
               yz.editor.lastEditingAppBaseComponentId    = null;
               yz.editor.lastEditingAppCodeId             = null;
               yz.editor.inEditor                         = false
           },
            chooseApp:                      async function  (  ) {
                // ---------------------------------------------------------------
                //                         chooseApp
                //
                // This is called when the end user selects "app" so that we only
                // see the app preview in the app editor
                // ---------------------------------------------------------------
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

                    //await this.save( this.base_component_id, this.code_id, this.editor_text )
                    await mm.loadComponentIntoEditor({codeId:  this.code_id,  runThisApp: true})
                    hideProgressBar()
                }
            },
            chooseCode:                     async function  (  ) {
                // ---------------------------------------------------------------
                //                         chooseCode
                //
                // This is called when the end user selects "code" so that we only
                // see the code editor in the app editor, and no app preview pane
                // ---------------------------------------------------------------
                let mm = this
                this.code_width = "95%"
                this.code_shown = true

                this.app_width = "0%"
                this.app_shown = false

                this.mode      = "edit"
                this.sub_mode  = "code"

                await mm.loadComponentIntoEditor({codeId:  this.code_id , runThisApp: false})

                if (this.timeline_editor) {
                    this.timeline_editor.destroy()
                    this.timeline_editor = null
                }
                setTimeout(function(){
                    console.log("appClearIntervals()")
                    appClearIntervals()
                },2500)
            },
            chooseBoth:                     async function  (  ) {
                // ---------------------------------------------------------------
                //                         chooseBoth
                //
                // This is called when the end user selects "Both" so that we can
                // see both the code editor and the app preview pane
                // ---------------------------------------------------------------
                showProgressBar()
                let mm = this
                this.mode      = "edit"
                this.sub_mode  = "both"

                this.code_width = "63%"
                this.code_shown = true

                this.app_width = "33%"
                this.app_shown = true

                appClearIntervals()
                await mm.loadComponentIntoEditor({codeId:  this.code_id, runThisApp: true})

                if (this.timeline_editor) {
                    this.timeline_editor.destroy()
                    this.timeline_editor = null
                }
                hideProgressBar()
            },
            chooseProfiler:                 async function  (  ) {
                // ---------------------------------------------------------------
                //                         chooseProfiler
                //
                // This is called when the end user selects "Profiler" that they
                // can see the app debug view
                // ---------------------------------------------------------------
                let mm = this
                this.code_width = "0%"
                this.code_shown = false

                this.app_width = "0%"
                this.app_shown = false

                if (this.$refs.editor_component_ref && (this.mode=="edit") && (this.sub_mode=="code")) {
                    appClearIntervals()
                    this.editor_text = await this.$refs.editor_component_ref.getText()

                    await this.save( this.base_component_id, this.code_id, this.editor_text )
                    await mm.loadComponentIntoEditor({codeId:  this.code_id, runThisApp: true})
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
            rename:                         async function  (  nn  ) {
                // ---------------------------------------------------------------
                //                         rename
                //
                // This is called to change the display name of the current app
                // ---------------------------------------------------------------
                let mm = this
                this.edit_name = false
                this.show_name = true

                // commented out as we don't want to replace _ (underscores) with spaces
                //nn = nn.replace(/[\W_]+/g,"_");

                this.editor_text = await this.$refs.editor_component_ref.getText()

                this.editor_text = yz.helpers.deleteCodeString(this.editor_text, "display_name")
                this.editor_text = yz.helpers.insertCodeString(this.editor_text, "display_name",nn)

                await mm.save(   this.base_component_id,   this.code_id,   this.editor_text   )

                await mm.loadComponentIntoEditor({newApp: true, codeId:  this.code_id } )

//zzz
                mm.$root.$emit('message', {
                    type:               "update_editable_components_on_homepage",
                    base_component_id:   mm.base_component_id,
                    display_name:        mm.component_display_name
                })
            },
            editAsText:                     async function  (  ) {
                /*
                 _______________________________________
                 |       editAsText                     |
                 |______________________________________|
                 This is called to edit the current app with the text editor
                 __________
                 | Params |
                 |        |______________________________________________________________
                 |
                 |     NONE
                 |________________________________________________________________________ */
                let mm = this

                this.editor_text = await this.$refs.editor_component_ref.getText()

                let eds = yz.helpers.getValueOfCodeString(this.editor_text, "editors")
                if (eds) {
                    this.editor_text = yz.helpers.deleteCodeString(this.editor_text, "editors")
                    this.editor_text = yz.helpers.insertCodeString(this.editor_text, "editors_old",eds)
                }

                await mm.save(   this.base_component_id,   this.code_id,   this.editor_text   )

                await mm.loadComponentIntoEditor({newApp: true, codeId:  this.code_id } )
            },
            checkSavedFile:                 function        (  ) {
                // ---------------------------------------------------------------
                //                          checkSavedFile
                //
                // This is called to check the save status of the code
                // ---------------------------------------------------------------
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
            copyApp:                        async function  (  appId , newAppId, codeId  ) {
                // ---------------------------------------------------------------
                //
                //
                // This is called to copy an app. At the moment this copies the
                // base_component_id, which means that the app's latest version
                // is copied. This may not be what we want though as we really want
                // to copy the commit ID's code
                //
                // ---------------------------------------------------------------

                /*
                ________________________________________
                |                                      |
                |             copyApp                  |
                |                                      |
                |______________________________________|
                Function description
                __________
                | PARAMS |______________________________________________________________
                |
                |     appId          Base component ID of the app/component to copy
                |     -----
                |
                |     newAppId       New Base Component ID to give the new app/component
                |     --------
                |
                |________________________________________________________________________ */

                let mm       = this
                let copyArgs = {}

                if (appId) {
                    copyArgs.base_component_id = appId
                }
                if (newAppId) {
                    copyArgs.new_base_component_id = newAppId
                }
                if (codeId) {
                    copyArgs.code_id = codeId
                }

                let result = await getFromYazzReturnJson("/http_get_copy_component",copyArgs)
                if (isValidObject(result)) {
                    mm.$root.$emit('message', {
                        type:               "insert_editable_component_on_homepage",
                        base_component_id:   result.base_component_id,
                        display_name:        result.new_display_name,
                        code_id:             result.code_id,
                        logo_url:            result.logo_url
                    })

                }
                setTimeout(async function() {
                    await mm.loadComponentIntoEditor( {newApp: true,  codeId:  result.code_id , runThisApp: true})
                    setTimeout(async function() {
                        mm.refresh++
                        //hack - the preview doesn't load without this
                        mm.setInfo("...")
                    },1500)
                },200)
            },
            bookmarkCode:                   async function  (  ) {
                // ---------------------------------------------------------------
                //                          bookmarkCode
                //
                // Bookmark code is the same as tagging code with a version. This
                // tags the current commit.
                //
                // Right now it doesn't do anything
                // but it should add a record to tag the code with the current
                // date
                //
                // ---------------------------------------------------------------
                try {
                    let mm = this
                    showProgressBar()

                    let postAppUrl = "http" + (($CENTRALHOSTPORT == 443)?"s":"") + "://" + $CENTRALHOST + "/http_post_bookmark_commit"
                    callAjaxPost(postAppUrl,
                        {
                            code_id:                  mm.code_id
                            ,
                            user_id:                 "xyz"
                        }
                        ,
                        async function(response){
                            let responseJson = JSON.parse(response)

                            hideProgressBar()
                            this.save_state = "saved"

                        })

                } catch (e) {
                    hideProgressBar()
                    this.save_state = "saved"
                    //this.checkSavedFile()
                }
            },
            releaseCode:                    async function  (  ) {
                // ---------------------------------------------------------------
                //                          releaseCode
                //
                // This tries to release the current commit as the release version
                // of the app
                //
                // ---------------------------------------------------------------
                try {
                    let mm = this
                    showProgressBar()

                    let postAppUrl = "http" + (($CENTRALHOSTPORT == 443)?"s":"") + "://" + $CENTRALHOST + "/http_post_release_commit"
                    callAjaxPost(postAppUrl,
                        {
                            code_id:                  mm.code_id
                            ,
                            user_id:                 "xyz"
                        }
                        ,
                        async function(response){
                            let responseJson = JSON.parse(response)

                            hideProgressBar()
                            this.save_state = "saved"
                        })

                } catch (e) {
                    hideProgressBar()
                    this.save_state = "saved"
                    //this.checkSavedFile()
                }
            },
            loadComponentIntoEditor:        async function  (  options  ) {
                /*
                ----------------------------------------
                |                                      |
                |       loadComponentIntoEditor        |
                |                                      |
                ----------------------------------------
                This loads a new version of the currently edited app.
               ----------
               | Params |
               |        --------------------------------------------------------------
               |
               |     options: {
               |     -------    baseComponentId - if set then load the latest
               |                ---------------   edited version of the app which has
               |                                  a type of "baseComponentId"
               |
               |                codeId - if set then load the code which has an
               |                ------   ID/IPFSHashId of "codeId"
               |
               |                code - if set then load the source code from "code"
               |                ----   as the app
               |
               |                runThisApp - if true then after loading the code
               |                ----------   then refresh the preview pane
               |
               |                newApp - if set to true then ...
               |                ------
               |     }
               |
               ------------------------------------------------------------------------------ */


                //
                // init stuff
                //
                let mm              = this
                let baseComponentId = options.baseComponentId
                let code            = null
                let results
                let codeId          = null
                let runThisApp      = false
                let newEditor       = null

                mm.preview_type     = ""

                if (options.codeId) {
                    codeId = options.codeId
                    if (codeId == "") {
                        return
                    }
                }

                if (options.runThisApp) {
                    runThisApp = options.runThisApp
                }

                if (options.newApp == true) {
                    yz.componentsAPI.resetLoadedControlsMapInCurrentlyEditedApp()
                    mm.editor_loaded                               = false
                }

                if (options.code) {
                    code = options.code
                }

                if ((!codeId) && (!baseComponentId) && (!code)) {
                    return
                }

                mm.component_display_name   = null
                mm.app_loaded               = true
                mm.execution_timeline       = executionTimeline
                mm.execution_code           = executionCode
                mm.execution_block_list     = Object.keys(this.execution_code)


                try {
                    // ******** load app from commit ID  **************
                    if (codeId) {
                        results = await sqliteQuery(
                            `select
                                id, 
                                cast(code as text)  as  code, 
                                editors, 
                                base_component_id
                            from
                                system_code
                            where
                                id = '${codeId}'`)

                        if (results) {
                            if (results.length > 0) {

                                // ****** find the editor *******
                                let editors2 = results[0].editors
                                mm.base_component_id = results[0].base_component_id

                                if (isValidObject(editors2) && (mm.override_app_editor == null)) {
                                    let edd = eval("(" + editors2 + ")")
                                    newEditor = edd[0]
                                }

                                // ******* find the code ********
                                code        = results[0].code
                                codeId      = results[0].id
                                mm.code_id  = codeId
                                GLOBALS.cacheThisComponentCode({codeId: codeId,    code: code})
                                GLOBALS.pointBaseComponentIdAtCode(
                                    {
                                        baseComponentId:    mm.base_component_id,
                                        codeId:             codeId
                                    })

                                this.component_display_name = yz.helpers.getValueOfCodeString(code.toString(),"display_name")
                                await GLOBALS.makeSureUiComponentLoadedV6( {codeId: mm.code_id }, {} )
                            }
                        }






                    //
                    // load app from source code
                    //
                    } else if (code) {
                        let bci = yz.helpers.getValueOfCodeString(code.toString(),"base_component_id")

                        GLOBALS.cacheThisComponentCode({codeId: codeId,    code: code})
                        GLOBALS.pointBaseComponentIdAtCode(
                            {
                                baseComponentId:    bci,
                                codeId:             codeId
                            })
                        await GLOBALS.makeSureUiComponentLoadedV6( {codeId: mm.code_id }, {} )






                    //
                    // load app based on App Type (base_component_id")
                    //
                    } else {
                        mm.base_component_id     = baseComponentId
                        // ******  read the code for the component that we are editing ********
                        results = await sqliteQuery(
                            `select
                                    system_code.id, cast(system_code.code as text)  as  code, system_code.editors
                                 from
                                    system_code, yz_cache_released_components
                                 where
                                        yz_cache_released_components.base_component_id = '${baseComponentId}'
                                           and
                                        system_code.id = yz_cache_released_components.ipfs_hash `)
                        if (!results || results.length == 0) {
                            results = await sqliteQuery(
                                `select
                                    id, cast(code as text)  as  code, editors
                                 from
                                    system_code
                                 where
                                        base_component_id = '${baseComponentId}'
                                           `)
                        }

                        if (results) {
                            if (results.length > 0) {

                                // ****** find the editor *******
                                let editors2 = results[0].editors
                                if (isValidObject(editors2) && (mm.override_app_editor == null)) {
                                    let edd = eval("(" + editors2 + ")")
                                    newEditor = edd[0]
                                }

                                // ******* find the code ************
                                code                        = results[0].code
                                codeId                      = results[0].id
                                mm.code_id                  = codeId
                                this.component_display_name = yz.helpers.getValueOfCodeString(code.toString(),"display_name")
                                GLOBALS.cacheThisComponentCode({codeId: codeId,    code: code})
                                GLOBALS.pointBaseComponentIdAtCode(
                                    {
                                        baseComponentId:    baseComponentId,
                                        codeId:             codeId
                                    })
                            }
                        }
                    }





                    //
                    // if the code has changed then update the editor text
                    //
                    if (mm.editor_loaded && (mm.editor_text != code)) {
                        mm.editor_text = code
                    }




                    //
                    // load the editor
                    //
                    if ( !mm.editor_loaded ) {
                        let editorName = "textEditorPlugInComponent"
                        if (mm.override_app_editor != null) {
                            editorName = mm.override_app_editor
                        }
                        if (newEditor) {
                            editorName = newEditor
                        }

                        await GLOBALS.makeSureUiComponentLoadedV6( editorName, {text: code} )
                        mm.refresh++

                        mm.editor_loaded    = true
                        mm.editor_component = editorName
                    }





                    //
                    // should we run this app?
                    //
                    if ((isValidObject(runThisApp))   && (!runThisApp)) {
                        //do nothing if we set "runthisapp" to false
                    } else {
                        this.resetDebugger()
                        setTimeout(async function() {
                            mm.refresh++
                        },200)
                    }

                    mm.resetDebugger()
                    mm.refresh++



                } catch (e) {
                } finally {
                    hideProgressBar()

                }

                //
                // Set the Preview type for this component. Remember that apps and
                // controls are previewed differently since controls need to have a
                // container around them, since they can not live independantly without
                // an app
                //
                if (code && (yz.helpers.getValueOfCodeString(code,"component_type") == "VB")) {
                    mm.preview_type = "control"
                } else {
                    mm.preview_type = "app"
                }

                //
                // set other vars based on the code
                //
                mm.component_display_name = yz.helpers.getValueOfCodeString(code,"display_name")
                // ****** set readonly *******
                this.read_only = yz.helpers.getValueOfCodeString(code, "read_only")


                //
                // if the app is read only then lock the editor
                //
                if (mm.read_only) {
                    mm.editor_shell_locked = true
                } else {
                    mm.editor_shell_locked = false
                }




                //
                // load the code into the editor
                //
                setTimeout(async function() {
                    if (mm.$refs.editor_component_ref) {
                        if (mm.$refs.editor_component_ref.setText) {
                            mm.$refs.editor_component_ref.setText(code)
                        }
                    }
                },500)

            },
            save:                           async function  (  base_component_id  ,  code_id  ,  textIn  ,  extras  ) {
                // ---------------------------------------------------------------
                //                           save
                //
                // This is called to save the currently edited code
                // ---------------------------------------------------------------
                let mm = this
                if (mm.inSave) {
                    return false
                }
                mm.inSave = true

                try {
                    if (textIn == null) {
                        this.editor_text = await this.$refs.editor_component_ref.getText()
                    } else {
                        this.editor_text = textIn
                    }


                    mm.editor_shell_locked = true

                    let allowAppToWorkOffline = false
                    if (extras) {
                        allowAppToWorkOffline = extras.allowAppToWorkOffline
                    }

                    if (!allowAppToWorkOffline) {
                        this.editor_text = GLOBALS.enhanceCodeBeforeSaving(this.editor_text, {parentHash: code_id, baseComponentId: base_component_id})
                    }
                    let baseCompIdFromSrcCode = yz.helpers.getValueOfCodeString(this.editor_text,"base_component_id")
                    await yz.savingCode.saveCodeViaWebWorker(
                        this.editor_text
                        ,
                        {
                            sub_components:         yz.componentsAPI.getAllLoadedControlBCIsInCurrentlyEditedApp(),
                            save_html:              true,
                            save_code_to_file:      saveCodeToFile,
                            allowAppToWorkOffline:  allowAppToWorkOffline,
                            allowChanges:           false
                        })

                    if (mm.$refs.editor_component_ref) {
                        if (mm.$refs.editor_component_ref.savedStatus !== undefined) {
                            await mm.$refs.editor_component_ref.savedStatus({status: "ok"})
                        }
                    }

                    mm.code_id  = await getIpfsHash(mm.editor_text)
                    GLOBALS.cacheThisComponentCode({codeId: mm.code_id,    code: mm.editor_text})
                    GLOBALS.pointBaseComponentIdAtCode(
                        {
                            baseComponentId:    baseCompIdFromSrcCode,
                            codeId:             mm.code_id
                        })

                    if (mm.app_shown) {
                        // if the app has been changed during the save then don't reload the app
                        if (!saveCodeToFile) {
                            await mm.loadComponentIntoEditor({code: mm.editor_text, runThisApp: true})

                        } else {
                        }
                    }
                    hideProgressBar()
                    mm.editor_shell_locked = false

                    mm.save_state = "saved"
                    mm.checkSavedFile()
                    //showTimer("done")
                    mm.inSave = false
                    mm.editor_shell_locked = false

                    mm.$root.$emit('message', {
                        type:               "update_editable_components_on_homepage",
                        base_component_id:   baseCompIdFromSrcCode,
                        code_id:             mm.code_id
                    })

                    //showTimer("return")
                    return true

                } catch (e) {
                    hideProgressBar()
                    this.save_state = "saved"
                    this.checkSavedFile()
                    mm.inSave = false
                    mm.editor_shell_locked = false
                    return true
                }
            },

            // debugger
            getVarAsHtml:                   function        (  viewer  ,  varName  ) {
               // ---------------------------------------------------------------
               //                         getVarAsHtml
               //
               // This views program variables in the debugger
               // ---------------------------------------------------------------
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
            getVarAsBarChart:               function        (  value  ) {
                // ---------------------------------------------------------------
                //                         getVarAsBarChart
                //
                // This views program variables in the debugger
                // ---------------------------------------------------------------
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
            resetDebugger:                  function        (  ) {
                // ---------------------------------------------------------------
                //                         resetDebugger
                //
                // This resets the debugger. We only remember the debugger state
                // since the last run
                // ---------------------------------------------------------------

               executionTimeline   = []
               executionTimelineMapTimeToLine   = {}
               this.execution_timeline = executionTimeline
               maxTimelineLogPoint = 0
               globalWatchList = {}

               this.current_execution_step = 0
               this.current_execution_step_y_line = -1
               this.updateTimeline()
           },
            stepForward:                    function        (  ) {
                // ---------------------------------------------------------------
                //                         stepForward
                //
                // TUsed to move forward one instruction in the debugger
                // ---------------------------------------------------------------
               if (this.current_execution_step < (executionTimeline.length - 1)) {
                   this.current_execution_step ++
                   let x = executionTimelineMapTimeToLine[ this.current_execution_step ]
                   if (x) {
                       this.current_execution_step_y_line = x.line
                   }
                   this.updateTimeline({allowScroll: true})
               }
           },
            stepBack:                       function        (  ) {
                // ---------------------------------------------------------------
                //                         stepBack
                //
                // TUsed to move backwards one instruction in the debugger
                // ---------------------------------------------------------------
               if (this.current_execution_step > 0) {
                   this.current_execution_step --
                   let x = executionTimelineMapTimeToLine[  this.current_execution_step  ]
                   if (x) {
                       this.current_execution_step_y_line = x.line
                   }
                   this.updateTimeline({allowScroll: true})
               }
           },
            timelineRefresh:                function        (  move  ) {
                // ---------------------------------------------------------------
                //                         timelineRefresh
                //
                // Used to update the debug timeline
                // ---------------------------------------------------------------
                let mm = this
                setTimeout(function(){
                    mm.updateTimeline({allowScroll: move})
                },200)
            },
            chooseRightDebugPane:           function        (  ff  ) {
                // ---------------------------------------------------------------
                //                         chooseRightDebugPane
                //
                // Used to update the debug timeline
                // ---------------------------------------------------------------
                this.debugger_right_mode = ff
            },
            updateTimeline:                 function        (  args  ) {
                // ---------------------------------------------------------------
                //                         updateTimeline
                //
                // Update the debug timeline
                // ---------------------------------------------------------------
                let mm = this
                let x = executionTimelineMapTimeToLine[  this.current_execution_step  ]
                if (x) {
                    this.highlighted_line           = x.line
                    this.highlighted_block          = executionCode[x.code_block_name].code
                    this.highlighted_block_name     = x.code_block_name

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

            },
            mouseEnterTimeline:             function        (  ev  ) {
                // ---------------------------------------------------------------
                //                         mouseEnterTimeline
                //
                // Process mouse events entering the timeline
                // ---------------------------------------------------------------
                this.timeline_pause = false
            },
            mouseClickTimeline:             function        (  ev  ) {
                // ---------------------------------------------------------------
                //                         mouseClickTimeline
                //
                // Process mouse events clicking the timeline
                // ---------------------------------------------------------------
                this.timeline_pause = !this.timeline_pause
            },
            inTimelineScroll:               function        (  ) {
                // ---------------------------------------------------------------
                //                         inTimelineScroll
                //
                // Scrolling the timeline
                // ---------------------------------------------------------------
                let mm = this
                mm.timeline_pause = true;
                setTimeout(function() {
                    mm.timeline_pause = false;
                }, 66);
            },
            mouseMoveTimeline:              function        (  ev  ) {
                // ---------------------------------------------------------------
                //                         mouseMoveTimeline
                //
                // Mouse move on the timeline
                // ---------------------------------------------------------------
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
            },
            addWatch:                       async function  (  varN  ){
                // ---------------------------------------------------------------
                //                         addWatch
                //
                // Add a debug watch var
                // ---------------------------------------------------------------
                globalWatchList[varN]={}
                await this.loadComponentIntoEditor({codeId:  this.code_id })
                let allWatches = Object.keys(globalWatchList)
                for (let rt = 0 ; rt < allWatches.length; rt++) {
                    fillInMissingWatchTimelineValues(allWatches[rt],0)
                }
            },
            deleteWatch:                    async function  (  varN  ){
                // ---------------------------------------------------------------
                //                         deleteWatch
                //
                // Delete a debug watch var
                // ---------------------------------------------------------------
                delete globalWatchList[varN]
            },
            keepWatch:                      async function  (  varN  ){
                // ---------------------------------------------------------------
                //                         keepWatch
                //
                // Keep a debug watch var
                // ---------------------------------------------------------------
                let allWatches = Object.keys(globalWatchList)
                for (let rt = 0 ; rt < allWatches.length; rt++) {
                    if (allWatches[rt] != varN) {
                        delete globalWatchList[allWatches[rt]]
                    }
                }
            },
            setupTimelineEditor:            function        (  ) {
                // ---------------------------------------------------------------
                //                         setupTimelineEditor
                //
                // Initialise the debugger sync for the code editor. This shows us
                // the line that is being debugged in the timeline
                // ---------------------------------------------------------------
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

            }
        },
        mounted:        async function () {
            let mm = this
            await useIdeTools()
            await useEstraverse()
            await useEsCodeGen()
            await useVisJs()
            await useVisCss()
            await useDiffJs()
            uiDebuggerOn = true
            if ($HIDEIMPORTBUTTONS == 'false') {
                mm.hideImportButtons = false
            }
            mm.override_app_editor  = null
            mm.show_download_save   = true
            mm.show_filename_save   = false
            mm.execution_timeline   = executionTimeline
            mm.execution_code       = executionCode
            mm.execution_block_list = Object.keys(this.execution_code)





            //
            // make sure we load the component that is being edited by this app
            //
            // ******* if we have the code ID *********
            if (mm.arg_edit_code_id) {
                yz.editor.editingAppBaseComponentId                   = mm.arg_edit_base_component_id
                yz.editor.editingAppCodeId                            = mm.arg_edit_code_id
                yz.editor.inEditor                                    = true
                await mm.loadComponentIntoEditor({codeId: yz.editor.editingAppCodeId})
            // ******* if we only have the BCI *********
            } else if (mm.arg_edit_base_component_id) {
                yz.editor.editingAppBaseComponentId                     = mm.arg_edit_base_component_id
                await mm.loadComponentIntoEditor({baseComponentId: this.arg_edit_base_component_id})
            }





            //
            // some helper callbacks so outsiders can changed the state of the editor
            //
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
                } else if (message.type == "switch_editor") {
                    mm.switchEditor(message.editorName)
                    if (message.previewType) {
                        mm.preview_type = message.previewType
                    }
                } else if (message.type == "force_raw_load") {
                    await mm.loadComponentIntoEditor(
                        {
                            codeId:     message.commitId ,
                            runThisApp: true
                        })

                    mm.$root.$emit('message', {
                        type:               "update_editable_components_on_homepage",
                        base_component_id:   mm.arg_edit_base_component_id,
                        code_id:             message.commitId
                    })
                    setTimeout(function(){
                        mm.refresh ++
                    },500)
                }
            })



            //
            // Load miscalaneous components
            //
            await GLOBALS.makeSureUiComponentLoadedV6(["yazz_blank"])
            await GLOBALS.makeSureUiComponentLoadedV6(["totally_blank_app"])






            //
            // set up the AUTOSAVE timer every second
            //
            console.log("Set up Ausosave for mm.code_id: " + mm.code_id)


            console.log("Create Ausosave for mm.code_id: " + mm.code_id)
            console.log("         mm.save_state : " + mm.save_state )
            mm.autosaveTimer = setInterval(async function() {
                // ******** if a change has been made **************
                if ((!mm.read_only) && (mm.save_state == 'pending' || (!mm.save_state))) {
                    // ******** if AUTOSAVE is on then save the code ************
                    if (!yz.mainVars.disableAutoSave) {
                        console.log("     saved: " + mm.code_id)
                        appClearIntervals();
                        await mm.save(mm.base_component_id, mm.code_id, null)
                    }
                }
                if (mm.deleteAutosaveTimer) {
                    if (mm.autosaveTimer) {
                        clearInterval(mm.autosaveTimer)
                        mm.autosaveTimer = null
                    }
                }
            }, 1000)





            //
            // Refresh the editor
            //
            mm.refresh ++
        },
        beforeDestroy() {
            this.deleteAutosaveTimer = true
        }

    })
}






