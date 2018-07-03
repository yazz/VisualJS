async function(args) {
/*
is_app(true)
display_name("Editor App")
description("This will return the editor app")
base_component_id("appEditorV2")
hide_header(true)
load_once_from_file(true)
*/

    var argBaseComponentId = args.base_component_id

    Vue.component("app_editor",
    {
      template: `<div>
                    <div>
                        <h2  class='caption' style='display: inline-block;'>Editing {{app_component_name}} </h2>
                        <div class='btn-group' style='float: right;' role=group >
                            <button  type=button class='btn btn-primary'      v-on:click='chooseApp()'  >App</button>
                            <button  type=button class=' btn btn-secondary'   v-on:click='chooseCode()' >Code</button>
                            <button  type=button class=' btn btn-info'        v-on:click='chooseBoth()' >Both</button>
                        </div>
                    </div>



                  <div id=editor_id v-bind:style="'height: 100%; width: ' + code_width + '; left: 0px; display: ' + (code_shown?'inline-block':'none') + ';'">
                      <component  v-bind:is="editor_component" v-if="editor_loaded" ref="editorComponentRef">
                                      <button v-bind:style="'visibility: ' + ((app_shown && code_shown)?'':'hidden')"
                                              slot-scope="editor_component"
                                              v-on:click='save(base_component_id, code_id, editor_component.text2)'
                                              type="button" class="btn btn-primary">

                                                  Update App
                                     </button>
                      </component>
                  </div>





                  <div v-bind:style="'height: 100%; width: '+app_width+'; right: 0px;display: ' + (app_shown?'inline-block':'none')+';vertical-align: top;'">
                      <component  v-bind:is="app_component_name" v-if="app_loaded">
                        APP HERE
                      </component>

                      <div  v-if="!app_loaded">


                      </div>
                </div>



      </div>
       `
       ,
       data: function() {
           return {
               editor_loaded:       false,
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
               code_shown:          true
           }
       }
       ,
       methods: {
            // ---------------------------------------------------------------
            //                         chooseApp
            //
            // This is called when the end user selects an app from the menu
            // ---------------------------------------------------------------
            chooseApp: function() {
                this.code_width = "0%"
                this.code_shown = false

                this.app_width = "95%"
                this.app_shown = true

                //zzz
                var text = this.$refs.editorComponentRef.getText()

                //
                // there may be a problem here - we have to make sure that we saved
                // the correct code_id which is supposed to be the parent code id, so we
                // have to make sure that we save it every time we save code
                //
                this.save( this.base_component_id, this.code_id, text )
                //alert(1)
            },

            chooseCode: function() {
                this.code_width = "95%"
                this.code_shown = true

                this.app_width = "0%"
                this.app_shown = false

                mm.load_app( this.base_component_id )
            },




            chooseBoth: function() {
                this.code_width = "63%"
                this.code_shown = true

                this.app_width = "33%"
                this.app_shown = true
            },




           // ---------------------------------------------------------------
           //                           save
           //
           // This is called to save the currently edited code
           // ---------------------------------------------------------------
           save: async function( base_component_id, code_id, text ) {
               var mm = this
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
                        code:                   text
                   })
               //alert("Saved " + text)


               //alert("Reloading 2: " + JSON.stringify(results,null,2))
               //alert("Reloading 2: " + JSON.stringify(mm.base_component_id,null,2))
               mm.load_app( mm.base_component_id )
           },





           // ---------------------------------------------------------------
           //                           load_app
           //
           // This loads the latest version of the code stream marked with
           // 'baseComponentId'
           // ---------------------------------------------------------------
           load_app: async function ( baseComponentId ) {
               //alert("trying to load app: " + baseComponentId)
               var mm = this
               mm.app_loaded = false
               mm.base_component_id = baseComponentId
               mm.app_component_name = null



               var sql =    "select  id, cast(code as text) as code from  system_code  where " +
                            "        component_type = 'app' and base_component_id = '" + baseComponentId + "'" +
                            "        and code_tag = 'LATEST' "

               //alert( sql )

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
                       var code = results[0].code
                       var codeId = results[0].id
                       //alert(code)
                       mm.code = code
                       mm.code_id = codeId
                       //alert(JSON.stringify(1,null,2))

                       if (!mm.editor_loaded) {
                           var result = await callApp(
                               {
                                    driver_name:    "editorComponent",
                                    method_name:    "component"
                                }
                                ,
                                  {text: code})
                            mm.editor_loaded = true
                            mm.editor_component = result.name
                       }


                   }


                   setTimeout(async function() {
                       var results = await callApp( {code_id:    codeId },{})
                       mm.app_loaded = true
                       mm.baseComponentId = baseComponentId
                       mm.app_component_name = results.name
                       //alert(results.name + " loaded")
                   },200)
               }






               }

       },

       mounted: async function () {
           var mm = this
           //alert(argBaseComponentId)
           if (argBaseComponentId) {
                this.load_app(argBaseComponentId)
            } else {
                var result = await callApp( {
                                        driver_name:  "systemFunctions",
                                        method_name:  "get_apps_list"  } ,{})

                mm.apps = result.value
            }
       }
       })
       return {name: "app_editor"}

}
