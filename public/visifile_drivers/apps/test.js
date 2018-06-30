function(args) {
/*
is_app(true)
display_name("Test app")
description('Test app')
base_component_id("test")
load_once_from_file(true)
*/

    Vue.component('test_app', {
      data: function () {
        return {
            msg:                "some data",
            component_name:      null,
            component_name_2:    null
        }
      },
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
            var mm = this
            //mm.component_name = 'button-counter'
            //Vue.set(mm, "component_name", 'button-counter')


            callDriverMethod( {driver_name: "comp",
                               method_name: "component"}
                              ,{}
                        ,
                        function(result) {
                            //alert(JSON.stringify(result,null,2))
                          //  console.log("3) returned result: " + JSON.stringify(result,null,2))
                            //this.component_name_2 = result.name
                            mm.component_name_2 = result.name
                            //Vue.set(mm, "component_name_2", result.name)
                        })
                    }
        }
    })

    return {name: "test_app"}
}
