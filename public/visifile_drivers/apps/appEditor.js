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
                        Code ID: {{code_id}}
                        <br>
                        <br>

                        <component  is="editor_component" v-if="editor_loaded"
                                    >
                                    <template slot-scope="bestSlotScope" >
                                        <button v-on:click='alert(bestSlotScope.text)'>Save</button>
                                    </template>
                        </component>
                        </pre>
                  </div>
                   `
                   ,
                   data: {
                       editor_loaded: false,
                       code_id: "...",
                       text3: "nn"
                   },


                })


                mm.code_id = args.code_id




                callDriverMethod(
                    "systemFunctions",  "sql",
                    {
                        sql: "select  code  from  system_code  where  id = '" + args.code_id +  "' "
                    }
                    ,
                    function(results) {
                        var code = results.value[0].code
                        mm.code = code
                        //alert(code)
                        callDriverMethod(
                            "editorComponent",  "component",  {text: code}
                            ,
                            function(result) {
                                mm.editor_loaded = true })

                    })



                returnfn()


            }, end: null
        }

    }

}
