{
    doc_type: 'visifile'
    ,
    name: 'comp'
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
                Vue.component('z-counter', {
                  data: function () {
                    return {
                      count: 0
                    }
                  },
                  template: '<button v-on:click="count++">You clicked Z {{ count }} times.</button>'
                })



                returnfn({
                    name: "z-counter"
                }
                )


            }, end: null
        }

    }

}
