{
    doc_type: 'visifile',
    name: 'appEditor',version: 1,



    events: {
        "This will return the editor app": {
            on: "app",
            do: function(args, returnfn) {


                var mm = new Vue({
                  el: "#" + args.root_element
                  ,
                  template: `<div>
                    Okhay this DataBox app editor
                        <component  is="editor_component" v-if="editor_loaded" > PLACEHOLDER </component>
                  </div>
                   `
                   ,
                   data: {
                       editor_loaded: false
                   }

                })

                callDriverMethod( "editorComponent",
                                  "component"
                                  ,{}
                            ,
                            function(result) {
                                //alert(JSON.stringify(result,null,2))
                              //  console.log("3) returned result: " + JSON.stringify(result,null,2))
                              //alert(result.name)
                                mm.editor_loaded = true
                            })


                //alert("root: " + args.root_element +".")
                returnfn(
                )


            }, end: null
        }

    }

}
