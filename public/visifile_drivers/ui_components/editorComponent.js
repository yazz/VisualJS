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
    initText: 'Component is available!!!!'
    ,
    events: {
        "This will return the test app": {
            on: "component",
            do: function(args, returnfn) {
                Vue.component('editor_component', {
                  data: function () {
                    return {
                      count: 0
                    }
                  },
                  template: '<button v-on:click="count++">You clicked Z {{ count }} times.</button>'
                })



                returnfn({
                    name: "editor_component"
                }
                )


            }, end: null
        }

    }

}
