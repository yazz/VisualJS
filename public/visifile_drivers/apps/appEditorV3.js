async function(args) {
/*
created_timestamp(-1)
base_component_id("app_editor_3")
is_app(true)
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
      props: ['app_id', 'card_index'],
      template: `<div>
                    <div>
                        <h2  class='caption' style='display: inline-block;' v-on:click='if (!read_only) {edit_name=true;show_name=false;}' v-if='show_name'>{{app_component_name?"" + app_component_name.substring(0,30):""}}{{(app_component_name && ((app_component_name.length > 30))?"...":"")}} </h2>
                        <input  class='caption' style='display: inline-block;' v-if='edit_name' v-model='new_name'></input>
                        <button type=button class='btn btn-primary' style='margin-left: 10px' v-if='edit_name' v-on:click='(async function(){await rename(new_name)})()'>Save new name</button>

                        <div class='btn-group' style='float: right; margin-right: 2%;' role=group >
                            <button  type=button class='btn btn-primary'      v-on:click='chooseApp()'  >App</button>
                            <button  type=button class=' btn btn-secondary'   v-on:click='chooseCode()' >Code</button>
                            <button  type=button class=' btn btn-info'        v-on:click='chooseBoth()' >Both</button>
                            <button  type=button class=' btn btn-primary'        v-on:click='chooseProfiler()' >Profiler</button>
                            <button  type=button class=' btn btn-secondary'   v-on:click='copyAppMethod(base_component_id,null)' >Copy app</button>
                            <button  type=button class=' btn btn-info'        v-on:click='embedApp(base_component_id)' >Embed app</button>
                            <button  v-if='(editor_component != "editor_component") && (!read_only)' type=button class=' btn btn-secondary'   v-on:click='editAsText()' >Edit as text</button>
                            <button  v-if='(editor_component != "editor_component") && (!read_only) && (visibility == "PUBLIC")' type=button class=' btn btn-success'   v-on:click='setVisibility("PRIVATE")' >Public: Switch to private</button>
                            <button  v-if='(editor_component != "editor_component") && (!read_only) && (visibility == "PRIVATE")' type=button class=' btn btn-danger'   v-on:click='setVisibility("PUBLIC")' >Private: Switch to public</button>

                        </div>
                    </div>

                  <div v-if='mode == "embed"'>
                        <appEmbed v-bind:base_component_id_arg='base_component_id'></appEmbed>
                  </div>

                  <div v-if='mode == "edit"'>
                      <div id=editor_id v-bind:style="'height: 100%; width: ' + code_width + '; left: 0px; display: ' + (code_shown?'inline-block':'none') + ';'">

                          <component  v-bind:is="editor_component" v-if="editor_loaded" ref="editorComponentRef">
                                          <button v-if='!read_only'
                                                  v-bind:style="'visibility: ' + ((app_shown && code_shown)?'':'hidden')"
                                                  slot-scope="editor_component"
                                                  v-on:click='setTimeout(async function(){await save(base_component_id, code_id,null)},100)'
                                                  type="button" class="btn btn-primary btn-sm">

                                                      Save changes
                                         </button>
                          </component>
                      </div>





                      <div v-bind:style="'height: 100%; width: ' + app_width + '; right: 0px; display: ' + (app_shown?'inline-block':'none')+';vertical-align: top;border: 1px solid lightgray;border-radius: 10px;'">
                          <span
                                v-bind:style='"  padding: 10px;bottom: 0px;right:0px;background-color: darkgray;color: white;width: auto;" +
                                "border-radius: 5px;opacity: 1;position:relative;visibility: " +
                                ((show_new_tab_tooltip || show_open_app_tooltip)?"visible":"hidden") + ";font-family: Helvetica;"'>
                                    {{show_new_tab_tooltip?"Open app in new browser tab (shareable :)":""}}
                                    {{show_open_app_tooltip?"Download app as .HTML file (emailable :)":""}}
                            </span>
                          <div v-bind:style="'background-color: rgb(242,242,242);padding: 5px;; border: 2px solid lightgray;'">
                                &larr; &rarr; <span class=reload>&#x21bb;</span>
                                <a
                                    v-bind:href='"http://" + location.hostname + ":" + location.port + "/app/" + base_component_id + ".html"'
                                    target="_blank" rel="noopener noreferrer"
                                    v-on:mouseover="show_new_tab_tooltip = true"
                                    v-on:mouseleave="show_new_tab_tooltip = false"
                                    class=reload>&#x274F;
                                    </a>
                                    <input  readonly size="40" style='font-size: 13px;'
                                        v-bind:value='"http://" + location.hostname + ":" + location.port + "/app/" + base_component_id + ".html"'></input>



                                <a
                                    v-bind:href='"http://" + location.hostname + ":" + location.port + "/app/appshare_" + base_component_id + ".html"'
                                    download
                                    v-on:mouseover="show_open_app_tooltip = true"
                                    v-on:mouseleave="show_open_app_tooltip = false"
                                    class=reload>&#x2668;
                                    </a>
                          </div>
                          <component  v-bind:is="app_component_name" v-if="app_loaded">
                            APP HERE
                          </component>

                    </div>


    </div>




    <div v-if='mode == "profiler"'>
        <div class='caption'  style='color: black;'>
            Profiler
        </div>

        <div class='container'>

            <div class='row'>
                <div class='col-md-6' style='overflow: auto;'>
                    <b>{{highlighted_block_name}}</b>
                    <div   v-if='highlighted_block != null'
                           v-for='(exeLine,index) in highlighted_blocks'>

                           <pre v-if='index < 10' v-bind:style='"padding:0;margin:0;border:0;" + (index == (highlighted_line - 1)?"background-color: lightgray;":"") '>{{exeLine}}</pre>
                    </div>


                </div>


                <div class='col-md-5'  style='overflow: auto; height: 50vh;'>
                    <div style='color: black; position: relative;'>

                        <div    v-for='exePoint in execution_timeline'
                                @mouseover="mouseOverTimeline(exePoint)"

                                v-bind:style='  "color: darkgray; " +
                                                "position: absolute;" +
                                                "top:" + ((exePoint.line + executionCode[exePoint.code].start) * 10) + ";" +
                                                "left:" + (exePoint.time * 5) + " ;" +
                                                "border: 1px solid darkgray;" +
                                                "width:10px;" +
                                                "height: 10px; " +
                                                "background-color: darkgray;" +
                                                ""'>
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
               selected_app:        '',
               editor_component:    null,
               execution_timeline:  null,
               execution_code: null,
               highlighted_line:    -1,
               highlighted_block:    "",
               highlighted_block_name:    "",
               highlighted_blocks:   [],
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
               show_name:           true,
               edit_name:           false,
               new_name:            "",
               show_new_tab_tooltip:false,
               show_open_app_tooltip:false
           }
       }
       ,

       methods: {
            mouseOverTimeline: function(x) {
                //alert(JSON.stringify(x,null,2))
                this.highlighted_line = x.line
                this.highlighted_block = executionCode[x.code].code
                this.highlighted_block_name = x.code
                this.highlighted_blocks = this.highlighted_block.split(/\r?\n/)
                //alert(JSON.stringify(this.highlighted_blocks,null,2))
            }
            ,




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


                var text = await this.$refs.editorComponentRef.getText()

                //
                // there may be a problem here - we have to make sure that we saved
                // the correct code_id which is supposed to be the parent code id, so we
                // have to make sure that we save it every time we save code
                //
                await this.save( this.base_component_id, this.code_id, text )
            },

            chooseCode: async function() {
                var mm = this
                this.code_width = "95%"
                this.code_shown = true

                this.app_width = "0%"
                this.app_shown = false

                this.mode      = "edit"

                await mm.load_app( this.base_component_id )
            },




            chooseBoth: async function() {
                var mm = this
                this.code_width = "63%"
                this.code_shown = true

                this.app_width = "33%"
                this.app_shown = true

                this.mode      = "edit"
                await mm.load_app( this.base_component_id )
            },

            chooseProfiler: async function() {
                var mm = this
                this.code_width = "0%"
                this.code_shown = false

                this.app_width = "0%"
                this.app_shown = false
                this.mode = "profiler"
            },

            rename: async function(nn) {
                this.edit_name = false
                this.show_name = true

                nn = nn.replace(/[\W_]+/g,"_");
                await this.copyAppMethod( this.base_component_id , nn)
                this.new_name = ""
            },



            editAsText: async function() {
                var mm = this

                var text = await this.$refs.editorComponentRef.getText()

                var eds = saveHelper.getValueOfCodeString(text, "editors")
                if (eds) {
                    text = saveHelper.deleteCodeString(text, "editors")
                    text = saveHelper.insertCodeString(text, "editors_old",eds)
                }

                await mm.save(   this.base_component_id,   this.code_id,   text   )

                await mm.load_new_app( this.base_component_id )
            },



            setVisibility: async function(value) {
                var mm = this

                var text = await this.$refs.editorComponentRef.getText()

                var eds = saveHelper.getValueOfCodeString(text, "visibility")
                if (eds) {
                    text = saveHelper.deleteCodeString(text, "visibility")
                    text = saveHelper.insertCodeString(text, "visibility",value)
                }

                await mm.save(   this.base_component_id,   this.code_id,   text   )

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
                await mm.load_new_app( result.value.base_component_id )
                mm.$root.$emit('message', {
                                                type:               "insert_app_at",
                                                base_component_id:   result.value.base_component_id,
                                                card_index:          mm.card_index
                                            })

            }
            ,







           // ---------------------------------------------------------------
           //                           save
           //
           // This is called to save the currently edited code
           // ---------------------------------------------------------------
           save: async function( base_component_id, code_id , textIn) {

               var text =  textIn
               if (text == null) {
                    text = await this.$refs.editorComponentRef.getText()
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
                        code:                   text,
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
           }
           ,



           // ---------------------------------------------------------------
           //                           load_app
           //
           // This loads the latest version of the code stream marked with
           // 'baseComponentId'
           // ---------------------------------------------------------------
           load_app: async function ( baseComponentId ) {

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
                        if (mm.editor_loaded && (mm.code != code)) {
                            mm.code = code
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

                   var results = await callApp( {code_id:    codeId },{})
                   mm.app_loaded = true
                   mm.baseComponentId = baseComponentId

                   //executionTimeline = []
                   this.execution_timeline = executionTimeline
                   this.execution_code     = executionCode


                   setTimeout(async function() {
                       mm.app_component_name = baseComponentId
                       mm.$refs.editorComponentRef.setText(code)
                   },500)
               }
           }
       },








            mounted: async function () {
                var mm = this

                this.execution_timeline = executionTimeline
                this.execution_code     = executionCode

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
