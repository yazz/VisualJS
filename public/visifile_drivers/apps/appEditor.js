{
    doc_type: 'visifile',
    name: 'appEditor',version: 1,



    events: {
        "This will return the editor app": {
            on: "app",
            do: function(args, returnfn) {
                is_app()

                var mm = new Vue({
                  el: "#" + args.root_element
                  ,
                  template: `<div>
                    Okhay this AppShare app editor
                        <component  is="editor_component" v-if="editor_loaded" > PLACEHOLDER </component>
                        <br>
                        <br>
                        Code ID: {{code_id}}

                        <br>
                        <br>
                        <pre>
                        Code: {{code}}
                        </pre>
                  </div>
                   `
                   ,
                   data: {
                       editor_loaded: false,
                       code_id: "...",
                       code: "..."
                   }

                })


                mm.code_id = args.code_id


                callDriverMethod(
                    "editorComponent",  "component",  {}
                    ,
                    function(result) {
                        mm.editor_loaded = true })


                callDriverMethod(
                    "systemFunctions",  "sql",
                    {
                        sql: "select  code  from  system_code  where  id = '" + args.code_id +  "' "
                    }
                    ,
                    function(results) {
                        mm.code = results.value[0].code })



                returnfn()


            }, end: null
        }

    }

}
