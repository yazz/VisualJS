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
    events: {
        "This will return the test app": {
            on: "app",
            do: function(args, returnfn) {

                var  mm = new Vue({
                  el: "#" + args.root_element
                  ,
                  template: `<div>
                                <div v-on:click='loadc'>Okhay this is a test app: {{msg}} 2
                                </div>
                                Included component
                                <component v-bind:is="component_name" v-if="component_name" > ccc </component>
                                <br>
                                Dynamically loaded component
                                <component v-bind:is="component_name_2" v-if="component_name_2" > ccc 2 </component>
                            </div>
                   `
                  ,
                  data: {
                    msg: "some data",
                    component_name: null,
                    component_name_2: null
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
                        mm.component_name = 'button-counter'


                        callDriverMethod( "comp",
                                          "component"
                                          ,{}
                                    ,
                                    function(result) {
                                        //alert(JSON.stringify(result,null,2))
                                      //  console.log("3) returned result: " + JSON.stringify(result,null,2))
                                        mm.component_name_2 = result.name
                                    })
                    }
                }
                })



                returnfn(
                )


            }, end: null
        }

    }

}
