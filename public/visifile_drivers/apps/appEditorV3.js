async function(args) {
/*
created_timestamp(-1)
base_component_id("app_editor_3")
is_app(true)
control_type("SYSTEM")
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


    await loadV2("appEmbed")

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
            {{app_component_name?"" + app_component_name.substring(0,30):""}}{{(app_component_name && ((app_component_name.length > 50))?"...":"")}} - Yazz (
            <span v-bind:style='"color: " + ((visibility == "PUBLIC")?"lightgreen":"pink") + ";"'>{{((visibility == "PUBLIC")?"Public":"Private")}}</span>

            <span v-bind:style='"color: " + (read_only?"pink":"") + ";"'>{{(read_only?" - Read only":"")}}</span>
            )

        </h5>

        <input  class='caption' style='display: inline-block;' v-if='edit_name' v-model='new_name'></input>

        <button type=button class='btn btn-primary' style='margin-left: 10px' v-if='edit_name' v-on:click='(async function(){await rename(new_name)})()'>
            Save new name
        </button>

        <span style='float: right; margin-right: 2%;' >




            <div class='btn-group'
                 v-bind:style='"box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);margin-right: " + (extra_menu?"50px;":"200px;")'
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
                        v-bind:class='"btn btn-sm " + (mode == "profiler"?"btn-secondary":"btn-light")'
                        v-on:click='chooseProfiler()' >Profiler</button>
            </div>



            <div v-if='extra_menu' class='btn-group' role=group style='box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);margin-right: 20px;'>
                <button  v-if='(mode != "profiler")' type=button class=' btn btn-info btn-sm'   v-on:click='copyAppMethod(base_component_id,null)' >Copy</button>
                <button  v-if='(mode != "profiler")' type=button class=' btn btn-info btn-sm'        v-on:click='embedApp(base_component_id)' >Embed</button>

                <button  v-if='(mode != "profiler")' type=button class=' btn btn-sm btn-warning'        v-on:click='if (!read_only) {edit_name=true;show_name=false;}' >Rename</button>


                <button  v-if='(editor_component != "editor_component") && (!read_only) && (mode != "profiler")' type=button class=' btn btn-info btn-sm'   v-on:click='editAsText()' >Edit as text</button>
                <button vbind:style='"box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);height: 25px;"'
                        v-if='(!read_only) && (visibility == "PUBLIC") && (mode != "profiler")' type=button class='btn btn-danger btn-sm'   v-on:click='setVisibility("PRIVATE")' >
                        Set to private
                </button>

                <button vbind:style='"box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);height: 25px;"'
                        v-if='(!read_only) && (visibility == "PRIVATE") && (mode != "profiler")' type=button class='btn btn-info btn-sm'   v-on:click='setVisibility("PUBLIC")' >
                    Set to public
                </button>
            </div>

            <div v-if='!extra_menu' class='btn-group' role=group style='box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);margin-right: 20px;'>
                <button  type=button class=' btn btn-info btn-sm'   v-on:click='extra_menu=true' >More</button>
            </div>

            <div v-if='extra_menu' class='btn-group' role=group style='box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);margin-right: 20px;'>
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


    <div v-if='mode == "embed"'>
        <appEmbed v-bind:base_component_id_arg='base_component_id'></appEmbed>
    </div>

    <div v-if='mode == "edit"'>
        <div    id=editor_id
                v-bind:style="'height: 100%; width: ' + code_width + '; left: 0px; display: ' + (code_shown?'inline-block':'none') + ';'">

            <component  v-bind:is="editor_component"
                        v-if="editor_loaded"
                        ref="editor_component_ref">

                <div      slot-scope="editor_component" style='display: inline-block;width:100%;'>


                    <button     v-bind:style="'margin-left:20px;margin-right: 6px;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);visibility: ' + (code_shown?'':'hidden') + ';' "
                                v-on:click='setTimeout(function(){editExportOptions()},100)'
                                v-if="!editor_overloaded"
                                v-bind:style="'float: left;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19); '"
                                v-on:mouseenter='setInfo("Export as a Docker Image or a runnable HTML file")'
                                v-on:mouseleave='setInfo(null)'
                                type="button"
                                class="btn btn-light">


                                <svg    xmlns="http://www.w3.org/2000/svg"
                                        xmlns:xlink="http://www.w3.org/1999/xlink"
                                        version="1.1" id="Capa_1"
                                        viewBox="0 0 29.978 29.978"
                                        style="enable-background:new 0 0 29.978 29.978;"
                                        xml:space="preserve"
                                        x="0px"
                                        y="0px"
                                        height="35px"
                                        width="35px">
                                	<path d="M25.462,19.105v6.848H4.515v-6.848H0.489v8.861c0,1.111,0.9,2.012,2.016,2.012h24.967c1.115,0,2.016-0.9,2.016-2.012   v-8.861H25.462z" fill="#006DF0"/>
                                	<path d="M14.62,18.426l-5.764-6.965c0,0-0.877-0.828,0.074-0.828s3.248,0,3.248,0s0-0.557,0-1.416c0-2.449,0-6.906,0-8.723   c0,0-0.129-0.494,0.615-0.494c0.75,0,4.035,0,4.572,0c0.536,0,0.524,0.416,0.524,0.416c0,1.762,0,6.373,0,8.742   c0,0.768,0,1.266,0,1.266s1.842,0,2.998,0c1.154,0,0.285,0.867,0.285,0.867s-4.904,6.51-5.588,7.193   C15.092,18.979,14.62,18.426,14.62,18.426z" fill="#006DF0"/>
                                </svg>
                                 Export app
                    </button>

                    <button   v-bind:style="'margin-left:20px;margin-right: 6px;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);visibility: ' + (code_shown?'':'hidden') + ';' "
                              v-on:click='setTimeout(function(){editSqliteSchema()},100)'
                              v-if="!editor_overloaded"
                              v-on:mouseenter='setInfo("Edit the SQlite schema for this app")'
                              v-on:mouseleave='setInfo(null)'
                              type="button" class="btn btn-light ">

                             <svg   xmlns="http://www.w3.org/2000/svg"
                                    style="enable-background:new 0 0 210.107 210.107;margin-right:10px;"
                                    width="35px"
                                    height="35px"
                                    viewBox="0 0 24 24">
                                <g>
                                    <path d="M22 18.055v2.458c0 1.925-4.655 3.487-10 3.487-5.344 0-10-1.562-10-3.487v-2.458c2.418 1.738 7.005 2.256 10 2.256 3.006 0 7.588-.523 10-2.256zm-10-3.409c-3.006 0-7.588-.523-10-2.256v2.434c0 1.926 4.656 3.487 10 3.487 5.345 0 10-1.562 10-3.487v-2.434c-2.418 1.738-7.005 2.256-10 2.256zm0-14.646c-5.344 0-10 1.562-10 3.488s4.656 3.487 10 3.487c5.345 0 10-1.562 10-3.487 0-1.926-4.655-3.488-10-3.488zm0 8.975c-3.006 0-7.588-.523-10-2.256v2.44c0 1.926 4.656 3.487 10 3.487 5.345 0 10-1.562 10-3.487v-2.44c-2.418 1.738-7.005 2.256-10 2.256z"/>
                              </svg>SQLite Schema

                    </button>
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

                    <button   v-bind:style="'margin-left:20px;margin-right: 6px;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);visibility: ' + (code_shown?'':'hidden') + ';' "
                              v-on:click='setTimeout(function(){copyAppMethod(base_component_id, null)},100)'
                              v-if="!editor_overloaded"
                              v-on:mouseenter='setInfo("Make an editable copy of this app")'
                              v-on:mouseleave='setInfo(null)'
                              type="button" class="btn btn-light">

                              <svg  version="1.1"
                                    xmlns="http://www.w3.org/2000/svg"
                                    xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                                    width="35px"
                              	    viewBox="0 0 210.107 210.107"
                                    height="35px"
                                    style="enable-background:new 0 0 210.107 210.107;margin-right:10px;"
                                    xml:space="preserve">
                              <g>
                              	<path style="fill:#1D1D1B;" d="M168.506,0H80.235C67.413,0,56.981,10.432,56.981,23.254v2.854h-15.38
                              		c-12.822,0-23.254,10.432-23.254,23.254v137.492c0,12.822,10.432,23.254,23.254,23.254h88.271
                              		c12.822,0,23.253-10.432,23.253-23.254V184h15.38c12.822,0,23.254-10.432,23.254-23.254V23.254C191.76,10.432,181.328,0,168.506,0z
                              		 M138.126,186.854c0,4.551-3.703,8.254-8.253,8.254H41.601c-4.551,0-8.254-3.703-8.254-8.254V49.361
                              		c0-4.551,3.703-8.254,8.254-8.254h88.271c4.551,0,8.253,3.703,8.253,8.254V186.854z M176.76,160.746
                              		c0,4.551-3.703,8.254-8.254,8.254h-15.38V49.361c0-12.822-10.432-23.254-23.253-23.254H71.981v-2.854
                              		c0-4.551,3.703-8.254,8.254-8.254h88.271c4.551,0,8.254,3.703,8.254,8.254V160.746z"/>
                              </svg>Copy app

                    </button>

                    <button   v-bind:disabled='read_only?"":false'
                              v-bind:style="'margin-left:20px;margin-right: 6px;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);visibility: ' + (code_shown?'':'hidden') + ';' + (read_only?'opacity:.3;':'')"
                              v-on:mouseenter='setInfo("Save the changes made in the UI and reload the app")'
                              v-on:mouseleave='setInfo(null)'
                              v-on:click='setTimeout(async function(){appClearIntervals();await save(base_component_id, code_id,null)},100)'
                              type="button" class="btn btn-light">

                              <svg  version="1.1"
                                    xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                                    x="0px"
                                    y="0px"
                                    width="35px"
                                    height="35px"
                              	    viewBox="0 0 24.758 24.758"
                                    style="enable-background:new 0 0 24.758 24.758;margin-right:10px;"
                                    xml:space="preserve">
                              <g>
                              		<path id="_x3C_Group_x3E__6_" d="M12.527,0.003c0.013,0,0.015,0,0.019,0c0.007,0,0.007,0,0.009,0c0,0,0,0,0.004,0l0,0
                              			c0.002,0,0.008,0,0.01,0c0.004,0,0.004,0,0.004,0s0,0,0.003,0c0.026-0.006,0.035-0.002,0.054-0.002
                              			c3.205,0,6.32,1.271,8.621,3.503l2.536-2.569c0.122-0.123,0.31-0.16,0.461-0.094c0.159,0.065,0.264,0.219,0.264,0.392v8.351
                              			c0,0.234-0.19,0.424-0.422,0.424h-8.246c-0.005,0-0.013,0-0.019,0c-0.236,0-0.424-0.189-0.424-0.424
                              			c0-0.159,0.085-0.296,0.212-0.367l2.499-2.533c-1.482-1.432-3.418-2.213-5.539-2.213c-4.332,0.022-7.858,3.572-7.858,7.97
                              			c0.034,4.328,3.58,7.849,7.979,7.849l-0.009,4.468h-0.06C5.844,24.756,0.29,19.24,0.247,12.378
                              			C0.247,5.609,5.75,0.062,12.527,0.003z"/>
                              	</g>
                              </svg>Save changes

                    </button>


                </div>

            </component>
        </div>



        <div v-bind:style="'margin-left:10px;margin-top:10px;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);background-color: rgb(242,242,242);height: 100%; width: ' + app_width + '; right: 0px; display: ' + (app_shown?'inline-block':'none')+';vertical-align: top;border: 4px solid lightsteelblue;border-radius: 10px;'">



            <div    v-on:click='var win = window.open(location.protocol + "//" + location.hostname + ":" + location.port + "/app/" + base_component_id + ".html", "_blank"); win.focus();'
                    v-bind:style="'display:flex;text-decoration: underline;color:blue;padding: 5px; margin-top: 3px; position: relative; border: 0px;border-bottom: 4px solid lightsteelblue;'">

                Shareable link:<input   readonly
                                        style='flex:1;font-family:verdana;font-size: 13px;margin-left:10px;'
                                        v-bind:value='location.protocol + "//" + location.hostname + ":" + location.port + "/app/" + base_component_id + ".html"'>
                </input>

            </div>


            <component  id="app_preview_component"
                        ref="app_preview_component"
                        v-if='app_loaded && is_ui_app'
                        style='background-color: white;'
                        v-bind:is="app_component_name">
               APP HERE
            </component>



            <div  v-if='app_loaded && (!is_ui_app)'
                  style='padding: 10px;background-color: white; height: 100%;'>

                <pre>{{console_output}}</pre>

                <div class='btn-group' style='float: right; margin-right: 2%;' role=group >
                    <button  type=button class=' btn btn-success btn-lg'
                             v-on:click='chooseProfiler()' >Visualize this!</button>
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
                <div    style='white-space: nowrap;overflow: hidden;text-overflow: ellipsis;font-family:verdana;font-size: 13px;font-weight:bold;border-radius: 0px;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);background-image: linear-gradient(to right,  #000099, lightblue); color: white; padding:4px; margin:0;border-bottom: 0px;padding-left:10px;'>

                     Debugging: {{highlighted_block_name}}
                </div>

                <div id='timeline_editor' style='height: 100%;' >
                </div>
            </div>


            <div    style='position: absolute;left: 37%; width:30%;display:inline-block;border:5px solid lightgray; box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);height: 75vh;background-color: lightgray; position: relative;padding:0px;margin-left:15px;margin-top:0px;border-radius: 5px;'>

                <div    style='white-space: nowrap;overflow: hidden;text-overflow: ellipsis;font-family:verdana;font-size: 13px;font-weight:bold;border-radius: 5px;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);padding:4px; margin:0;border-bottom: 3px solid lightgray;padding-left:10px;'>
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
                         v-bind:style='  "position: absolute;pointer-events: none;width: 100%;border: 0px solid gray; bottom: 0; " +"left: " + (timeline_x_cursor + 10)  + "px; font-family:verdana;font-size: 13px;" '>
                            {{current_execution_step + 1}} / {{execution_timeline.length}}
                    </div>

                    <div v-if='(timeline_x_cursor > 200) && ( timeline_x_cursor >= 0 )'
                         v-bind:style='  "position: absolute;pointer-events: none;width: 100px;border: 0px solid gray; bottom: 0; " +"left: " + (timeline_x_cursor - 100)  + "px; font-family:verdana;font-size: 13px; text-align:right;" '>
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

                    <div v-bind:style='"border-radius: 3px;  padding: 4px;overflow-x:none;height: 40px;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);font-family:verdana;font-size: 13px;font-weight:bold;padding-left:10px;" '
                         v-bind:class='(selected_pane == "watches"?"selected_pane_title":"unselected_pane_title") '
                         v-on:click='$event.stopPropagation();selected_pane = "watches";chooseRight("watches");'>
                        Watch vars
                    </div>
                    <div  v-bind:style='"font-family:verdana;font-size: 13px;border-radius: 3px; padding:4px; border-right:2px solid gray;border-bottom:2px solid gray; margin-top:2px;;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);height:80%;background-color:lightgray;"  + (right_mode == "watches"?"":"display:none;")'>
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

                    <div    v-bind:style='"border-radius: 3px;padding: 4px;height: 40px;overflow-x:none;white-space:nowrap;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);overflow:hidden ;text-overflow: ellipsis;font-family:verdana;font-size: 13px;font-weight:bold;padding-left:10px;"'
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

               info_text:           "",
               editor_loaded:       false,
               console_output:      "",
               selected_app:        '',
               is_ui_app:           true,
               editor_overloaded:       false,
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
               code_id:            "...",
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
               new_name:            "",
               editor_text: ""
           }
       }
       ,

       methods: {
           closeSqliteSchema: async function() {
               var mm                           = this
               this.editor_overloaded           = false
               override_app_editor              = null
               this.editor_text                 = await this.$refs.editor_component_ref.getText()

               await mm.load_new_app( this.base_component_id )
           }
           ,




              editExportOptions: async function() {
                  var mm = this

                  this.editor_overloaded = true
                  override_app_editor = "export_editor_component"


                  await mm.load_new_app( this.base_component_id )
              }
              ,

           editSqliteSchema: async function() {
               var mm = this

               this.editor_overloaded = true
               override_app_editor = "sqlite_editor_component"


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
               var value = globalWatchList[varName][this.current_execution_step].value
               var returnVal = null
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
                var html = "<div> "

                var gg=0
                while (typeof(value[gg])=='number'){
                    var vv = value[gg]
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

                    var x = executionTimelineMapTimeToLine[ this.current_execution_step ]
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
                    var x = executionTimelineMapTimeToLine[  this.current_execution_step  ]
                    if (x) {
                        this.current_execution_step_y_line = x.line
                    }
                    this.updateTimeline({allowScroll: true})
                }
            }
            ,
            timelineRefresh: function(move) {
                var mm = this
                setTimeout(function(){
                    mm.updateTimeline({allowScroll: move})
                },200)
            }
            ,
            chooseRight: function(ff) {
                this.right_mode = ff
            },



            updateTimeline: function( args ) {
                var mm = this
                var x = executionTimelineMapTimeToLine[  this.current_execution_step  ]
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


                    var elementTimeline = document.getElementById("timeline_el"  )
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
                var mm = this
                mm.timeline_pause = true;
                setTimeout(function() {
                    mm.timeline_pause = false;
                }, 66);
            }

           ,
            mouseMoveTimeline: function(ev) {
                if (!this.timeline_pause) {
                    var elementTimeline = document.getElementById("timeline_el"  )
                    var left = (elementTimeline.scrollLeft + ev.offsetX);
                    var top = elementTimeline.scrollTop + ev.offsetY;

                    if ((left > -1) && elementTimeline) {
                        //console.log( "("+ left + "," + top + ")" )

                        var x=executionTimelineMapTimeToLine[ Math.floor(left / this.execution_horiz_scale)]
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
                var allWatches = Object.keys(globalWatchList)
                for (var rt = 0 ; rt < allWatches.length; rt++) {
                    fillInMissingWatchTimelineValues(allWatches[rt],0)
                }
            },
            deleteWatch: async function(varN){
                delete globalWatchList[varN]
            },
            keepWatch: async function(varN){
                var allWatches = Object.keys(globalWatchList)
                for (var rt = 0 ; rt < allWatches.length; rt++) {
                    if (allWatches[rt] != varN) {
                        delete globalWatchList[allWatches[rt]]
                    }
                }
            },



            setupTimelineEditor: function() {
                var mm = this
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
                var x = executionTimelineMapTimeToLine[ this.current_execution_step ]
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
                var mm = this
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
                            showProgressBar()
                        },
                    200)
                }
            },

            chooseCode: async function() {
                var mm = this
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
            },




            chooseBoth: async function() {
                showProgressBar()
                var mm = this
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
                var mm = this
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
                        var allWatches = Object.keys(globalWatchList)
                        for (var rt = 0 ; rt < allWatches.length; rt++) {
                            fillInMissingWatchTimelineValues(allWatches[rt],0)
                        }
                    },
                    200)
            },

            rename: async function(nn) {
                this.edit_name = false
                this.show_name = true

                nn = nn.replace(/[\W_]+/g,"_");
                await this.copyAppMethod( this.base_component_id , nn)
                this.new_name = ""
                this.console_output = ""
            },



            editAsText: async function() {
                var mm = this

                this.editor_text = await this.$refs.editor_component_ref.getText()

                var eds = saveHelper.getValueOfCodeString(this.editor_text, "editors")
                if (eds) {
                    this.editor_text = saveHelper.deleteCodeString(this.editor_text, "editors")
                    this.editor_text = saveHelper.insertCodeString(this.editor_text, "editors_old",eds)
                }

                await mm.save(   this.base_component_id,   this.code_id,   this.editor_text   )

                await mm.load_new_app( this.base_component_id )
            },



            setVisibility: async function(value) {
                var mm = this

                if (this.$refs.editor_component_ref) {
                    this.editor_text = await this.$refs.editor_component_ref.getText()
                }

                var eds = saveHelper.getValueOfCodeString(this.editor_text, "visibility")
                if (eds) {
                    this.editor_text = saveHelper.deleteCodeString(this.editor_text, "visibility")
                    this.editor_text = saveHelper.insertCodeString(this.editor_text, "visibility",value)
                }

                await mm.save(   this.base_component_id,   this.code_id,   this.editor_text   )

                await mm.load_new_app( this.base_component_id )
            },



            embedApp: function(x) {
                var mm = this
                this.mode = "embed"
            }
            ,

            copyAppMethod: async function( appId , newAppId) {
                var mm = this
                var result = await callFunction(
                                    {
                                        driver_name: "copyApp",
                                        method_name: "copyAppshareApp"  }
                                        ,{
                                              base_component_id:    appId,
                                              new_app_id:           newAppId   })
                if (isValidObject(result)) {
                    mm.$root.$emit('message', {
                                                    type:               "insert_app_at",
                                                    base_component_id:   result.value.base_component_id,
                                                    card_index:          1
                                                })

                }
                setTimeout(async function() {
                    mm.console_output = ""
                    await mm.load_new_app( result.value.base_component_id )
                },200)

            }
            ,







           // ---------------------------------------------------------------
           //                           save
           //
           // This is called to save the currently edited code
           // ---------------------------------------------------------------
           save: async function( base_component_id, code_id , textIn) {

            try {
                if (textIn == null) {
                     this.editor_text = await this.$refs.editor_component_ref.getText()
                } else {
                     this.editor_text = textIn
                }

                var mm = this
                if (mm.read_only) {
                     return
                }
                showProgressBar()

                var results = await callFunction(
                {
                    driver_name:     "appEditorV2SaveCode",
                    method_name:     "saveCode"
                },
                    {
                         base_component_id:      base_component_id,
                         code_id:                code_id,
                         code:                   this.editor_text,
                         options:                {
                                                     sub_components: Object.keys(dev_app_component_loaded),
                                                     save_html:              true
                                                 }
                    })

                await mm.load_app( mm.base_component_id )
                hideProgressBar()
            } catch (e) {
                hideProgressBar()
            }

           },




           load_new_app: async function ( baseComponentId ) {
               var mm = this
               if ((!baseComponentId) || (baseComponentId == "") || (!mm)) {
                    return
               }
               dev_app_component_loaded = new Object()
               this.editor_loaded = false
               await this.load_app(baseComponentId)
           }
           ,



           // ---------------------------------------------------------------
           //                           load_app
           //
           // This loads the latest version of the code stream marked with
           // 'baseComponentId'
           // ---------------------------------------------------------------
           load_app: async function ( baseComponentId, runThisApp ) {
                try {

                    //
                    // make sure that we reference an app
                    //
                    var mm = this
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
                   var sql =    `select
                                    id, cast(code as text)  as  code, editors
                                 from
                                    system_code
                                 where
                                        base_component_id = '${baseComponentId}'
                                           and
                                        code_tag = 'LATEST' `

                   var results = await callApp(
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
                            var editors2 = results[0].editors
                            var newEditor = null
                            if (isValidObject(editors2) && (override_app_editor == null)) {
                                var edd = eval("(" + editors2 + ")")
                                newEditor = edd[0]
                            }


                            //
                            // find the code
                            //
                            var code = results[0].code
                            var codeId = results[0].id

                            if (code.toString().includes("Vue.")) {
                                this.is_ui_app = true
                            } else {
                                this.is_ui_app = false
                            }



                            if (mm.editor_loaded && (mm.editor_text != code)) {
                                mm.editor_text = code
                                mm.code_id = codeId
                            }


                            //
                            // load the editor
                            //
                            if ( !mm.editor_loaded ) {
                                var editorName = "editor_component"
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
                           this.read_only = saveHelper.getValueOfCodeString(code, "read_only")
                           this.visibility = saveHelper.getValueOfCodeString(code, "visibility")


                       }

                       if ((isValidObject(runThisApp))   && (!runThisApp)) {
                        //do nothing if we set "runthisapp" to false
                       } else {
                            this.resetDebugger()
                            var prevConsole = console.log
                            if (!mm.is_ui_app) {
                                mm.console_output = ""
                                console.log = function() {
                                    if (isValidObject(mm.console_output)) {
                                        for (var a=0; a < arguments.length ; a++) {
                                            mm.console_output += arguments[a] + " "
                                        }
                                        mm.console_output +=
`
`
                                    }
                                }

                            }
                            var results = await callApp( {code_id:    codeId }, {} )
                            console.log = prevConsole
                       }


                       setTimeout(async function() {
                           mm.app_component_name = baseComponentId
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
       },








            mounted: async function () {
                var mm = this

                override_app_editor = null

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
                    }
                })



           }
       })
       return {name: "app_editor"}

}
