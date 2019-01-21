function(args) {
/*
is_app(true)
control_type("VB")
display_name("Verical scrollbar control")
description("This will return the erical scrollbar control")
base_component_id("vert_scroll_control")
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
logo_url("/driver_icons/vert_scroll_bar.png")
*/

    Vue.component("vert_scroll_control",{
      props: ["args"]
      ,
      template: `<div v-bind:style='"height:100%;width:100%; border: 0px;" +
                                    "background-color: "+    args["background_color"]  +  ";"'>

                                                {{args.text}}
                 </div>`
      ,
      data: function() {
       return {
         msg: "..."
     }
      },
    })
}
