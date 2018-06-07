{
    doc_type: 'appshare',
    name: 'appEditorV2',version: 1,



    events: {
        "This will return the editor app": {
            on: "app",
            do: function(args, returnfn) {
                is_app()
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
                    </pre>
                  </div>
                   `
                   ,
                   data: function() {
                       return {
                           editor_loaded: false,
                           app_loaded: false,
                           code_id: "..."
                       }
                   }
                   ,
                   methods: {
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
                               "vue",  "app",
                               {
                               }
                               ,
                               function(results) {
                                alert("load")
                                    mm.app_loaded = true
                               })
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
