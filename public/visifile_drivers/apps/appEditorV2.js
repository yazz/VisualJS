{
    doc_type: 'appshare',
    name: 'appEditorV2',version: 1,



    events: {
        "This will return the editor app": {
            on: "app",
            do:  function(args, returnfn) {
                is_app()

                var argAppName = args.appName

                Vue.component("app_editor",
                {
                  template: `<div>
                    Okhay this AppShare app editor
                        Code ID: {{code_id}}
                        <br>
                        <br>

                        <component  is="editor_component" v-if="editor_loaded">
                                        <button slot-scope="editor_component"
                                                v-on:click='save(code_id, editor_component.text)'
                                                type="button" class="btn btn-primary">

                                                    Save
                                       </button>
                        </component>

                        <component  is="VueApp" v-if="app_loaded">
                        </component>
                        <div  v-if="!app_loaded">
                            No app selected. Select one:
                            <br>
                            <select @change="chooseApp">
                                <option v-for="item in apps" value="{{item}}">{{item}}</option>
                            </select>

                        </div>
                  </div>
                   `
                   ,
                   data: function() {
                       return {
                           editor_loaded: false,
                           app_loaded: false,
                           apps: [],
                           code_id: "..."
                       }
                   }
                   ,
                   methods: {
                       chooseApp: function() {
                        alert(1)
                       },
                       save: function(code_id, text) {
                           //alert("Saving " + code_id)
                           callDriverMethod(
                               "appEditor",  "saveCode",
                               {
                                   code: text,
                                   code_id: code_id
                               }
                               ,
                               function(results) {
                                   alert("Code saved")

                               })
                       }
                   },

                   mounted: function () {
                       var mm = this
                       mm.code_id = args.code_id
                       if (argAppName) {
                       callDriverMethod(
                           "systemFunctions",  "sql",
                           {
                               sql: "select  code  from  system_code  where  id = '" + args.code_id +  "' "
                           }
                           ,
                           function(results) {
                               if (results) {
                                   var code = results.value[0].code
                                   mm.code = code
                                   //alert(code)
                                   callDriverMethod(
                                       "editorComponent",  "component",  {text: code}
                                       ,
                                       function(result) {
                                           mm.editor_loaded = true })
                               }

                           })
                               callDriverMethod(
                                   argAppName,  "app",
                                   {
                                   }
                                   ,
                                   function(results) {
                                        mm.app_loaded = true
                                   })
                           } else {
                               callDriverMethod( "systemFunctions",
                                                 "get_apps_list"
                                                 ,{}
                                           ,
                                           function(result) {
                                             //  console.log("3) returned result: " + JSON.stringify(result,null,2))
                                               mm.apps = result.value
                                           })
                           }
                      }


                })


                returnfn({name: "app_editor"})


            }, end: null
        }

        ,


        "Save the editor code": {
            on: "saveCode"
            ,
            do: function(args,returnfn) {
                console.log("Saving in Sqlite: " + args.code_id)
                console.log("Saving in Sqlite: " + args.code)
                var stmtUpdateCode = dbsearch.prepare(" update   system_code   set code = ? where id = ?");
                    dbsearch.serialize(function() {
                    dbsearch.run("begin exclusive transaction");
                    stmtUpdateCode.run(
                          args.code,
                          args.code_id)

                    dbsearch.run("commit");
                    stmtUpdateCode.finalize();

                })
                returnfn({})
            }
            ,
            end: null

        }

    }

}
