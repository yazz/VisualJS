function(args) {
/*
is_app(true)
control_type("VB")
display_name("3d item")
description("This will return the label control")
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
            id:     "background_color",
            name:   "Background color",
            type:   "String"
        }
    ]
)//properties
logo_url("/driver_icons/threedee_item.png")
*/

    Vue.component("threedee_item_control",{
      props: ["args","design_mode"]
      ,
      template: `<template >
                      <a-box    id="interact_box_three"
                                position="-1 3.5 -3"
                                body="shape: box; mass: 200"
                                rotation="0 45 0"
                                color="#4CC3D9">
                      </a-box>
                 </template>
      `
    })
}
