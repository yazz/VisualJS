function(args) {
/*
is_app(true)
control_type("VB")
display_name("Horizontal scrollbar control")
description("This will return the horizontal scrollbar control")
base_component_id("horiz_scroll_control")
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
logo_url("/driver_icons/horiz_scroll.png")
*/

    Vue.component("horiz_scroll_control",{
      props: ["args","refresh"]
      ,
      template: `<div v-bind:style='"height:100%;width:100%; border: 0px;" +
                                    "background-color: "+    args["background_color"]  +  ";"'>

                                                <input  type="range" min="1" max="100" value="50"
                                                        v-bind:style='"width:" + args.width'>
                 </div>`
      ,
      data: function() {
       return {
         msg: "..."
     }
      },
    })
}
