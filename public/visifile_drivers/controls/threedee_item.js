function(args) {
/*
is_app(true)
control_type("VB")
display_name("3d item")
description("This will return the 3d item control")
base_component_id("threedee_item_control")
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
            default:    "-1.2 2.5 -3"
        }
    ]
)//properties
logo_url("/driver_icons/threedee_item.png")
*/

    Vue.component("threedee_item_control",{
        props: ["args","design_mode", "refresh"]
        ,
      template: `<a-box         v-if='!design_mode'
                                v-bind:position='args.position'
                                body="shape: box; mass: 200"
                                rotation="0 50 0"
                                color="yellow">
                      </a-box>`
    })
}
