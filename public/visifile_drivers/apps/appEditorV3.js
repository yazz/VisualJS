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
`<div style="width:100%;padding:0; margin:0; border: 0;">
    <div style='background-image: linear-gradient(to right, blue, white); color: white;padding: 7px; padding-left: 15px;'>
        <h5  class='caption' style='display: inline-block;' v-on:click='if (!read_only) {edit_name=true;show_name=false;}' v-if='show_name'>
            {{app_component_name?"" + app_component_name.substring(0,30):""}}{{(app_component_name && ((app_component_name.length > 50))?"...":"")}} - AppShare (Design Mode)
        </h5>

        <input  class='caption' style='display: inline-block;' v-if='edit_name' v-model='new_name'></input>

        <button type=button class='btn btn-primary' style='margin-left: 10px' v-if='edit_name' v-on:click='(async function(){await rename(new_name)})()'>
            Save new name
        </button>

        <div class='btn-group' style='float: right; margin-right: 2%;' role=group >
            <button  type=button class='btn btn-primary btn-sm'      v-on:click='chooseApp()'  >App</button>
            <button  type=button class=' btn btn-secondary btn-sm'   v-on:click='chooseCode()' >Code</button>
            <button  type=button class=' btn btn-info btn-sm'        v-on:click='chooseBoth()' >Both</button>
            <button  v-if='(mode != "profiler")' type=button class=' btn btn-primary btn-sm'        v-on:click='chooseProfiler()' >Profiler</button>
            <button  v-if='(mode != "profiler")' type=button class=' btn btn-secondary btn-sm'   v-on:click='copyAppMethod(base_component_id,null)' >Copy app</button>
            <button  v-if='(mode != "profiler")' type=button class=' btn btn-info btn-sm'        v-on:click='embedApp(base_component_id)' >Embed app</button>
            <button  v-if='(editor_component != "editor_component") && (!read_only) && (mode != "profiler")' type=button class=' btn btn-secondary btn-sm'   v-on:click='editAsText()' >Edit as text</button>
            <button  v-if='(!read_only) && (visibility == "PUBLIC") && (mode != "profiler")' type=button class=' btn btn-success btn-sm'   v-on:click='setVisibility("PRIVATE")' >Public: Switch to private</button>
            <button  v-if='(!read_only) && (visibility == "PRIVATE") && (mode != "profiler")' type=button class=' btn btn-secondary btn-sm'   v-on:click='setVisibility("PUBLIC")' >Private: Switch to public</button>
            <button  type=button class=' btn btn-danger btn-sm'   v-on:click='closeApp()' >Close</button>
        </div>
    </div>


    <div v-if='mode == "embed"'>
        <appEmbed v-bind:base_component_id_arg='base_component_id'></appEmbed>
    </div>

    <div v-if='mode == "edit"'>
        <div id=editor_id v-bind:style="'height: 100%; width: ' + code_width + '; left: 0px; display: ' + (code_shown?'inline-block':'none') + ';'">

        <component  v-bind:is="editor_component" v-if="editor_loaded" ref="editor_component_ref">

            <button   v-if='!read_only'
                      v-bind:style="'visibility: ' + ((app_shown && code_shown)?'':'hidden')"
                      slot-scope="editor_component"
                      v-on:click='setTimeout(async function(){await save(base_component_id, code_id,null)},100)'
                      type="button" class="btn btn-lg">

                  <svg x="0px" y="0px" width="25px" height="25px" viewBox="0 0 384 384" style="color: black;" xml:space="preserve">
                      <path d="M32,0l320,192L32,384V0z"/>
                  </svg>

            </button>

        </component>
    </div>



    <div v-bind:style="'height: 100%; width: ' + app_width + '; right: 0px; display: ' + (app_shown?'inline-block':'none')+';vertical-align: top;border: 1px solid lightgray;border-radius: 10px;'">

        <span   v-bind:style='"  padding: 10px;bottom: 0px;right:0px;background-color: darkgray;color: white;width: auto;" +
                "border-radius: 5px;opacity: 1;position:relative;visibility: " +
                ((show_new_tab_tooltip || show_open_app_tooltip)?"visible":"hidden") + ";font-family: Helvetica;"'>
                    {{show_new_tab_tooltip?"Open app in new browser tab (shareable :)":""}}
                    {{show_open_app_tooltip?"Download app as .HTML file (emailable :)":""}}
        </span>


        <div    v-if='is_ui_app'
                v-bind:style="'background-color: rgb(242,242,242);padding: 5px;; border: 2px solid lightgray;'">
                &larr; &rarr; <span class=reload>&#x21bb;</span>

            <a      v-bind:href='"http://" + location.hostname + ":" + location.port + "/app/" + base_component_id + ".html"'
                    target="_blank" rel="noopener noreferrer"
                    v-on:mouseover="show_new_tab_tooltip = true"
                    v-on:mouseleave="show_new_tab_tooltip = false"
                    class=reload>&#x274F;
            </a>

            <input  readonly size="40" style='font-size: 13px;'
                    v-bind:value='"http://" + location.hostname + ":" + location.port + "/app/" + base_component_id + ".html"'>
            </input>


            <a  v-bind:href='"http://" + location.hostname + ":" + location.port + "/app/appshare_" + base_component_id + ".html"'
                download
                v-on:mouseover="show_open_app_tooltip = true"
                v-on:mouseleave="show_open_app_tooltip = false"
                class=reload>&#x2668;
            </a>
        </div>


                          <component  v-if='app_loaded && is_ui_app'
                                      v-bind:is="app_component_name">
                            APP HERE
                          </component>



                          <div  v-if='app_loaded && (!is_ui_app)' style='padding: 10px;'>
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

            <div style='text-align: center;margin-top: 4vh;'>
                <button  type=button class=' btn btn-info btn-lg'        v-on:click='chooseBoth()' >Return to code</button>
            </div>

        </div>
    </div>

    <div v-if='mode == "profiler" && (execution_timeline.length > 0)' style='width:100%;'>

        <div class='container' style='max-width:100%;width:100%;padding:0; margin:0; border: 0;'>

            <div class='row' style=';padding: 0px;padding: 5px; padding-left: 15px;background-color: blue;color: white;'>


                <div class='col-md-12' style='overflow: auto;  '>
                    <b style='color: white; background-color: red;padding: 2px;color:black;'>Debugging in READ ONLY MODE:</b>
                    <b style='color: white; background-color: black;padding: 2px;color:white;'>{{highlighted_block_name}}</b>

                    <span class='col-md-3'>
                        <input type="range" min="1" max="20" v-bind:onchange='timelineRefresh()' v-model="execution_horiz_scale"></input>
                    </span>



                    <span class='btn-group col-md-3' role=group >
                        <button type=button class='btn btn-primary' style='margin: 1px;padding:2px;'  v-on:click='stepBack()'>&lt;--</button>
                        <button type=button class='btn btn-info' style='margin: 1px;padding:2px;'  v-on:click='stepForward()'>--&gt;</button>
                    </span>

                </div>
            </div>


            <div class='row'>
                <div class='col-md-5' style='height: 50vh;overflow: auto;padding:0px;margin:0px;'>
                    <div id='timeline_editor' style='height: 100%;' >
                    </div>
                </div>


                <div    class='col-md-3'
                        style='height: 50vh;background-color: white; position: relative;padding:0px;margin:0px;'>

                    <div
                        v-bind:style='  "position: absolute;pointer-events: none;width: 1px;border: 1px solid gray; top: 0; height:100%;" +"left: " + (timeline_x_cursor + 5)  + "px;" '>
                    </div>
                    <div v-if='timeline_x_cursor <= 200'
                        v-bind:style='  "position: absolute;pointer-events: none;width: 100%;border: 0px solid gray; bottom: 0; " +"left: " + (timeline_x_cursor + 10)  + "px; font-size: 12px;" '>
                            {{current_execution_step + 1}} / {{execution_timeline.length}}
                    </div>
                    <div v-if='timeline_x_cursor > 200'
                        v-bind:style='  "position: absolute;pointer-events: none;width: 100px;border: 0px solid gray; bottom: 0; " +"left: " + (timeline_x_cursor - 100)  + "px; font-size: 12px; text-align:right;" '>
                            {{current_execution_step + 1}} / {{execution_timeline.length}}
                    </div>

                    <div
                        v-bind:style='  "position: absolute;pointer-events: none;height: 1px;border: 1px solid lightgray; left: 0; width:100%;" +"top: " + (timeline_y_cursor + 5)  + "px;" '>
                    </div>





                    <div    style='position:relative;overflow: scroll; border: 1px solid blue; padding:0; height:100%; width:100%;left:0;top:0'
                            id='timeline_el'
                            v-on:scroll='inTimelineScroll()'
                            @mousemove="mouseMoveTimeline($event)"
                            @click="mouseClickTimeline($event)"
                            @mouseenter="mouseEnterTimeline($event)"
                    >


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




                <div    class='col-md-4'
                        style='height: 50vh;background-color: white;overflow: scroll; background-color: white;border: 1px solid black;padding:0;margin:0;'
                        >


                    <div  style="left:0px; z-index: 200; width:100%; height:100%;">

                        <div class='container' style="padding:0;margin:0">
                            <div v-if='execution_timeline[current_execution_step]'>

                                <div style='margin:0;padding:0;border:2px solid blue; min-height:50px;'>
                                    <div style='background-color: blue; color: white; padding: 2px'>Watch vars</div>
                                    <div v-for="varWatchName in execution_watch_list">
                                        <div style='border: 1px solid blue; padding: 4px; min-height:50px;'
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


                                <div style='height:20px;'> </div>

                                <div style='margin:0;padding:0;border:2px solid blue; min-height:50px;'>
                                    <div style='background-color: blue; color: white; padding: 2px'> Current scope</div>


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
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
`
       ,
       data: function() {
           return {
               editor_loaded:       false,
               console_output:      "",
               selected_app:        '',
               is_ui_app:           true,
               editor_component:    null,
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
               mode:                "edit",
               sub_mode:            "both",
               show_name:           true,
               edit_name:           false,
               new_name:            "",
               show_new_tab_tooltip:false,
               editor_text: "",
               show_open_app_tooltip:false
           }
       }
       ,

       methods: {

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
            timelineRefresh: function() {
                var mm = this
                setTimeout(function(){
                    mm.updateTimeline()
                },200)
            }
            ,



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
                       mm.timeline_editor.setTheme("ace/theme/vibrant");
                    },100)


                    document.getElementById("timeline_editor").style.width = "100%"
                    document.getElementById("timeline_editor").style.border = "1px solid #2C2828"

                    document.getElementById("timeline_editor").style.height = "50vh"
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
                    this.editor_text = await this.$refs.editor_component_ref.getText()

                    //
                    // there may be a problem here - we have to make sure that we saved
                    // the correct code_id which is supposed to be the parent code id, so we
                    // have to make sure that we save it every time we save code
                    //
                    await this.save( this.base_component_id, this.code_id, this.editor_text )
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
                var mm = this
                this.mode      = "edit"
                this.sub_mode  = "both"

                this.code_width = "63%"
                this.code_shown = true

                this.app_width = "33%"
                this.app_shown = true

                await mm.load_app( this.base_component_id )

                if (this.timeline_editor) {
                    this.timeline_editor.destroy()
                    this.timeline_editor = null
                }
            },

            chooseProfiler: async function() {
                var mm = this
                this.code_width = "0%"
                this.code_shown = false

                this.app_width = "0%"
                this.app_shown = false

                if (this.$refs.editor_component_ref && (this.mode=="edit") && (this.sub_mode=="code")) {
                    this.editor_text = await this.$refs.editor_component_ref.getText()
                    await this.save( this.base_component_id, this.code_id, this.editor_text )
                    await mm.load_app( this.base_component_id )
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
                mm.$root.$emit('message', {
                                                type:               "insert_app_at",
                                                base_component_id:   result.value.base_component_id,
                                                card_index:          1
                                            })
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

               if (textIn == null) {
                    this.editor_text = await this.$refs.editor_component_ref.getText()
               } else {
                    this.editor_text = textIn
               }


               var mm = this
               if (mm.read_only) {
                    return
               }

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
           },




           load_new_app: async function ( baseComponentId ) {
               var mm = this
               if ((!baseComponentId) || (baseComponentId == "") || (!mm)) {
                    return
               }
               dev_app_component_loaded = new Object()
               this.editor_loaded = false
               await this.load_app(baseComponentId)
               mm.$root.$emit('message', {
                                               type:               "insert_app_at",
                                               base_component_id:   result.value.base_component_id,
                                               card_index:          1
                                           })
           }
           ,



           // ---------------------------------------------------------------
           //                           load_app
           //
           // This loads the latest version of the code stream marked with
           // 'baseComponentId'
           // ---------------------------------------------------------------
           load_app: async function ( baseComponentId, runThisApp ) {

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
                        if (editors2) {
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



                        if (mm.editor_loaded && (mm.editor_text != code)) {
                            mm.editor_text = code
                            mm.code_id = codeId
                        }

                        //
                        // load the editor
                        //
                        if ( !mm.editor_loaded ) {
                            var editorName = "editor_component"
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
                        var results = await callApp( {code_id:    codeId }, {} )
                   }


                   setTimeout(async function() {
                       mm.app_component_name = baseComponentId
                       if (mm.$refs.editor_component_ref) {
                            mm.$refs.editor_component_ref.setText(code)
                       }
                   },500)
               }
           }
       },








            mounted: async function () {
                var mm = this

                this.execution_timeline = executionTimeline
                this.execution_code     = executionCode
                this.execution_block_list = Object.keys(this.execution_code)

                //
                // make sure we load the component for this app
                //
                if (mm.app_id) {
                    component_loaded[this.app_id]           = false
                    dev_app_component_loaded[this.app_id]   = false
                    component_cache[this.app_id]            = null

                    await this.load_app(this.app_id)

                }


           }
       })
       return {name: "app_editor"}

}
