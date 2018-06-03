{
    doc_type: 'visifile'
    ,
    name: 'editorComponent'
    ,
    version: 1
    ,
    type: 'component'
    ,
    text: 'Component'


    ,
    events: {
        "This will return the test app": {
            on: "component",
            do: function(args, returnfn) {
                var mm = Vue.component('editor_component', {
                  data: function () {
                    return {
                        text: args.text
                    }
                  },
                  template: `<div >
                                <textarea style="width: 100%; height: 50%;" v-model="text"> {{text}}
                                </textarea>
                                 <slot  :text="text"></slot>
                             </div>`
                })
                //alert(JSON.stringify(args,null,2))


                returnfn({
                    name: "editor_component"
                }
                )


            }, end: null
        }

    }

}
