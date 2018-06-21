function(args) {
    /*
    is_app()
    display_name("Editor App")
    description("This will return the editor app")
    base_component_id("appEditorV2")
    */

    var argAppName = args.appName
    //alert(args.base_component_id)
    var argBaseComponentId = args.base_component_id
    //alert(argBaseComponentId)

    Vue.component("app_editor",
    {
      template: `<div>
            <div class="container">
                <div class="row">



                  <div class="col-xl-8">
                      <component  v-bind:is="editor_component" v-if="editor_loaded">
                                      <button slot-scope="editor_component"
                                              v-on:click='save(base_component_id, code_id, editor_component.text2)'
                                              type="button" class="btn btn-primary">

                                                  Update App
                                     </button>
                      </component>
                  </div>




                  <div class="col-xl-4">
                      <component  v-bind:is="app_component_name" v-if="app_loaded">
                        APP HERE
                      </component>

                      <div  v-if="!app_loaded && false">
                          No app selected. Select one:
                          <br>
                          <select @change="chooseApp">
                              <option v-for="item in apps" v-bind:value="item">{{item}}</option>
                          </select>

                      </div>
                  </div>



                </div>
              </div>


      </div>
       `
       ,
       data: function() {
           return {
               editor_loaded: false,
               editor_component: null,
               app_loaded: false,
               apps: [],
               app_component_name: null,
               baseComponentId: null,
               code_id: "...",
               version: 0
           }
       }
       ,
       methods: {
           chooseApp: function(event) {
                //alert(event.target.value)
                this.load_app(event.target.value)
           },




           save: function(base_component_id, code_id, text) {
               var mm = this
               //alert("Saving " + code_id)
               //alert("Saving " + text)
               //alert(base_component_id)
               callDriverMethod(
               {
                   driver_name:     "appEditorV2SaveCode",
                   method_name:     "saveCode"
               },
                   {
                        base_component_id:      base_component_id,
                        code_id:                code_id,
                        code:                   text
                   }
                   ,
                   function(results) {

                       //alert("Reloading 2: " + mm.app_name)
                       mm.load_app(mm.argBaseComponentId)
                   })
           },





           load_app: function ( baseComponentId ) {
               //alert("trying to load app: " + baseComponentId)
               var mm = this
               mm.app_loaded = false
               mm.base_component_id = baseComponentId
               mm.app_component_name = null
//zzz



               var sql =    "select  id, cast(code as text) as code from  system_code  where " +
                            "        component_type = 'app' and base_component_id = '" + baseComponentId + "'" +
                            "        and code_tag = 'LATEST' "

               //alert( sql )

               callDriverMethod(
                   {
                        driver_name:    "systemFunctions2",
                        method_name:    "sql"
                   }
                   ,
                   {
                       sql: sql
                   }
                   ,
                   function(results) {
                       if (results) {
                           //alert(JSON.stringify(results,null,2))
                           if (results.value.length > 0) {
                               var code = results.value[0].code
                               var codeId = results.value[0].id
                               //alert(code)
                               mm.code = code
                               mm.code_id = codeId
                               //alert(JSON.stringify(codeId,null,2))
                               callDriverMethod(
                                   {
                                        driver_name:    "editorComponent",
                                        method_name:    "component"
                                    }
                                    ,
                                      {text: code}
                                   ,
                                   function(result) {
                                   //alert(JSON.stringify(result,null,2))
                                       mm.editor_loaded = true
                                       mm.editor_component = result.name
                                         })
                           }


                           setTimeout(function() {
                               //alert("Reloading: " + baseComponentId)
                               callDriverMethod(
                               {
                                    code_id:    codeId,
                                }
                                    ,
                                   {
                                   }
                                   ,
                                   function(results) {
                                       mm.app_loaded = true
                                       mm.baseComponentId = baseComponentId
                                       mm.app_component_name = results.name
                                       //alert(results.name + " loaded")
                                   })
                           },200)
                       }
                   })





               }

       },

       mounted: function () {
           var mm = this
           //alert(argBaseComponentId)
           if (argBaseComponentId) {
                this.load_app(argBaseComponentId)
            } else {
                callDriverMethod( {
                                        driver_name:  "systemFunctions",
                                        method_name:  "get_apps_list"
                                  }
                                  ,{}
                            ,
                            function(result) {
                              //  console.log("3) returned result: " + JSON.stringify(result,null,2))
                                mm.apps = result.value
                            })
            }
       }
       })
       return {name: "app_editor"}

}
