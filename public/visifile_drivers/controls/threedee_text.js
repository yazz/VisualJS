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
            id:     "text",
            name:   "Text",
            type:   "String"
        }
        ,
        {
            id:         "position",
            name:       "Position",
            type:       "String",
            default:    "-2.1 4 -10"
        }
    ]
)//properties
logo_url("/driver_icons/threedee_text_control.png")
*/

    Vue.component("threedee_text_control",{
        props: ["args","design_mode", "refresh"]
        ,
      template: `<a-entity v-bind:refresh='refresh'>
                    <a-entity v-if='args'
                              geometry="primitive: box"
                              material="color: #166678; side: double"
                              physics-body="mass: 5; boundingBox: 2 2 2; shape: auto;"
                              dynamic-body
                              v-bind:refresh='refresh'
                              v-bind:position='args.position'>
                  </a-entity>
              </a-entity>`
    })
}
