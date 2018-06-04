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
                                <div id=mytextarea v-model="text">{{text}}</div>
                                 <slot  :text="text"></slot>
                             </div>`
                 ,
                 mounted: function() {
                     var editor = ace.edit(           "mytextarea", {
                                                             mode:           "ace/mode/javascript",
                                                             selectionStyle: "text"
                                                         })
                     document.getElementById("mytextarea").style.width="100%"

                     document.getElementById("mytextarea").style.height="50%"
                 }


                })
                //alert(JSON.stringify(args,null,2)),

                returnfn({
                    name: "editor_component"
                }
                )


            }, end: null
        }

    }

}
