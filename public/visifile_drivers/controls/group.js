function(args) {
/*
is_app(true)
control_type("VB")
display_name("Group control")
description("This will return the label control")
base_component_id("group_control")
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
        ,
        {
            id:         "is_container",
            name:       "Is Container?",
            type:       "Boolean",
            default:    true,
            hidden:     true
        }
    ]
)//properties
logo_url("/driver_icons/group_control.png")
*/

    Vue.component("group_control",{
      props: ["args"]
      ,
      template: `<div v-bind:style='"height:100%;width:100%; border: 1px solid gray;color: black;" +
                                    "background-color: "+    args["background_color"]  +  ";"'>

                                                {{args.text}}
                    <slot v-bind:refresh='refresh'>
                    </slot>
                 </div>`
      ,
      data: function() {
       return {
         msg: "..."
     }
      },
    })
}
