function(args) {
/*
is_app(true)
control_type("VB")
display_name("3d item")
description("This will return the 3d item control")
base_component_id("threedee_text_control")
load_once_from_file(true)
visibility("PRIVATE")
read_only(true)
properties(
    [
        {
            id:         "text",
            name:       "Text",
            default:    "Some text",
            type:       "String"
        }
        ,
        {
            id:         "position",
            name:       "Position",
            type:       "String",
            default:    "2 2 -5"
        }
    ]
)//properties
logo_url("/driver_icons/threedee_text_control.png")
*/

    Vue.component("threedee_text_control",{
        props: ["args","design_mode", "refresh"]
        ,
      template: `<a-entity v-bind:refresh='refresh'>
                      <a-plane    v-if='args'
                                  v-bind:refresh='refresh'
                                  v-bind:position='args.position'
                                  rotation="0 0 0" width="4" height="4" color="blue">

                          <a-entity position="3 0 .1"
                                    v-bind:text='"width:10;value: " + args.text + ";color:black;"'>

                          </a-entity>

                      </a-plane>

              </a-entity>`
    })
}
