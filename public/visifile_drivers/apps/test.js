{
    doc_type: 'visifile'
    ,
    name: 'test'
    ,
    version: 1
    ,
    type: 'app'
    ,
    text: 'Test app'

    ,
    initText: 'Test is ALIVE!!!!'
    ,
    events: {
        "This will return the test app": {
            on: "app",
            do: function(args, returnfn) {

                new Vue({
                  el: "#" + args.root_element
                  ,
                  template: `<div>
                                <div v-on:click='loadc'>Okhay this is a test app: {{msg}} 2
                                </div>
                                <component v-bind:is="component_name" v-if="component_name" > ccc </component>
                            </div>
                   `
                  ,
                  data: {
                    msg: "some data",
                    component_name: null
                },
                methods: {
                    loadc: function() {
                        Vue.component('button-counter', {
                          data: function () {
                            return {
                              count: 0
                            }
                          },
                          template: '<button v-on:click="count++">You clicked me {{ count }} times.</button>'
                        })
                        this.component_name = 'button-counter'
                    }
                }
                })



                returnfn(
                )


            }, end: null
        }

    }

}
