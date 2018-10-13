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
                            <select v-if='false' class="custom-select" v-model="selected_app" v-bind:onchange='load_new_app(selected_app)'>
                              <option value='' selected>Select an application to edit</option>
                              <option v-for='app in apps'
                                      v-bind:value="app.base_component_id"
                                      >{{app.display_name}}</option>
                            </select>
                            <button  type=button class='btn btn-primary'      v-on:click='chooseApp()'  >App</button>
                            <button  type=button class=' btn btn-secondary'   v-on:click='chooseCode()' >Code</button>
                            <button  type=button class=' btn btn-info'        v-on:click='chooseBoth()' >Both</button>
                            <button  type=button class=' btn btn-secondary'   v-on:click='copyAppMethod(base_component_id,null)' >Copy app</button>
                            <button  type=button class=' btn btn-info'        v-on:click='embedApp(base_component_id)' >Embed app</button>
                            <button  v-if='(editor_component != "editor_component") && (!read_only)' type=button class=' btn btn-secondary'   v-on:click='editAsText()' >Edit as text</button>

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
                                    {{show_new_tab_tooltip?"Open page in new browser tab (shareable :)":""}}
                                    {{show_open_app_tooltip?"Download as HTML app (emailable :)":""}}
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

                <div>
      </div>
       `
       ,
       data: function() {
           return {
               editor_loaded:       false,
               selected_app:        '',
               editor_component:    null,
               app_loaded:          false,
               apps:               [],
               app_component_name:  null,
               base_component_id:   null,
               code_id:            "...",
               version: 0,
               app_width:           "33%",
               code_width:          "63%",
               app_shown:           true,
               code_shown:          true,
               read_only:           false,
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
                //alert(1)
            },

            chooseCode: function() {
                var mm = this
                this.code_width = "95%"
                this.code_shown = true

                this.app_width = "0%"
                this.app_shown = false

                this.mode      = "edit"

                mm.load_app( this.base_component_id )
            },




            chooseBoth: function() {
                var mm = this
                this.code_width = "63%"
                this.code_shown = true

                this.app_width = "33%"
                this.app_shown = true

                this.mode      = "edit"
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
                //alert(text.indexOf("editors_old"))

                var eds = saveHelper.getValueOfCodeString(text, "editors")
                if (eds) {
                    text = saveHelper.deleteCodeString(text, "editors")
                    text = saveHelper.insertCodeString(text, "editors_old",eds)
                }

                await mm.save(   this.base_component_id,   this.code_id,   text   )

                await mm.load_new_app( this.base_component_id )
                //alert(text.indexOf("editors_old"))
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
           //alert(code_id)
               console.log("1) AppEditor: save")
               var text =  textIn
               if (text == null) {
                    text = await this.$refs.editorComponentRef.getText()
               }
               console.log("5) AppEditor: getText done")

               var mm = this
               if (mm.read_only) {
                    return
               }
               //alert("Saving " + code_id)
               //alert("Saving " + text)
               //alert(base_component_id)
               var results = await callApp(
               {
                   driver_name:     "appEditorV2SaveCode",
                   method_name:     "saveCode"
               },
                   {
                        base_component_id:      base_component_id,
                        code_id:                code_id,
                        code:                   text,
                        options:                {
                                                    sub_components: Object.keys(dev_app_component_loaded)
                                                }
                   })
               //alert("Saved " + text)


               //alert("Reloading 2: " + JSON.stringify(results,null,2))
               //alert("Reloading 2: " + JSON.stringify(mm.base_component_id,null,2))
               mm.load_app( mm.base_component_id )
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
               console.log(`load_app:`)
               var mm = this
               if ((!baseComponentId) || (baseComponentId == "") || (!mm)) {
                    return
               }
                mm.selected_app = ""

               //
               // set up vars
               //
               mm.app_loaded            = false
               mm.base_component_id     = baseComponentId
               mm.app_component_name    = null


               //
               // read the code for the component that we are editing
               //
               var sql =    "select  id, cast(code as text)  as  code, editors  from  system_code  where " +
                            "        base_component_id = '" + baseComponentId + "'" +
                            "        and code_tag = 'LATEST' "

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
                   //alert(JSON.stringify(results,null,2))
                   if (results.length > 0) {
                       var editors2 = results[0].editors
                       var newEditor = null
                       if (editors2) {
                            var edd = eval("(" + editors2 + ")")
                            newEditor = edd[0]
                       }
                       var code = results[0].code
                       var codeId = results[0].id
                       //alert(code)
                       if (mm.editor_loaded && (mm.code != code)) {
                            //alert("changed: " + code)
                            //this.$refs.editorComponentRef.setText(code)
                            mm.code = code
                            mm.code_id = codeId
                       }
                       //alert(JSON.stringify(1,null,2))

                       if (!mm.editor_loaded) {
                            var editorName = "editor_component"
                            if (newEditor) {
                                 editorName = newEditor
                            }

                            await loadV2(editorName,{text: code})
                            mm.editor_loaded = true
                            mm.editor_component = editorName
                       }

                       this.read_only = saveHelper.getValueOfCodeString(code, "read_only")



                   }

                   var results = await callApp( {code_id:    codeId },{})
                   mm.app_loaded = true
                   mm.baseComponentId = baseComponentId
//zzz
                   setTimeout(async function() {
                       mm.app_component_name = baseComponentId
                       //alert(results.name + " loaded")
                       mm.$refs.editorComponentRef.setText(code)

                   },500)
               }






               }

       },

       mounted: async function () {
        console.log(`appEditor: mounted: this.app_id = ${this.app_id}`)
           var mm = this
           //alert(this.app_id)
            if (this.app_id) {
                //alert(this.app_id)
                //this.base_component_id = app_id

                component_loaded[this.app_id]           = false
                dev_app_component_loaded[this.app_id]   = false
                component_cache[this.app_id]            = null

                await this.load_app(this.app_id)
                //alert(Object.keys(component_cache[this.app_id]))
            } else {
                var result = await callApp( {
                                        driver_name:  "systemFunctions",
                                        method_name:  "get_apps_list"  } ,{})

                mm.apps = result
            }
       }
       })
       return {name: "app_editor"}

}
