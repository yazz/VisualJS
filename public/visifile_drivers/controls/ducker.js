function(args) {
/*
is_app(true)
control_type("VB")
display_name("Docker control")
description("This will return the docker control")
base_component_id("docker_control")
load_once_from_file(true)
visibility("PRIVATE")
read_only(true)
properties(
    [
        {
            id:         "text",
            name:       "Dev Text",
            default:    "Docker connecter",
            type:       "String"
        }
        ,
        {
            id:         "width",
            name:       "Width",
            default:    200,
            type:       "Number"
        }
        ,
        {
            id:         "height",
            name:       "Height",
            default:    50,
            type:       "Number"
        }
        ,
        {
            id:     "background_color",
            name:   "Background color",
            type:   "String"
        }
        ,
        {
            id:     "container_list",
            name:   "Container list",
            type:   "List"
        }
    ]
)//properties
logo_url("/driver_icons/ducker.png")
*/

    Vue.component("docker_control",{
      props: ["args","design_mode"]
      ,
      template: `<div v-bind:style='"height:100%;width:100%; border: 0px;" +
                                    "background-color: "+    args["background_color"]  +  ";"'>

                                    <div v-if="design_mode">
                                        {{args.text}}
                                     </div>

                 </div>`
      ,
      data: function() {
       return {
         msg: "..."
     }
      },

      mounted: async function() {
        if (!this.design_mode) {
            var result = await callFunction(
                                {
                                    driver_name: "serverDockerStuff",
                                    method_name: "serverDockerStuff"  }
                                    ,{ })

           if (result.value) {
                this.args.container_list = result.value.containerList

           }


           }
       }


    })
}
