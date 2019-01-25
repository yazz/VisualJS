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
      props: ["args","refresh"]
      ,
      template: `<div v-bind:style='"height:100%;width:100%; border: 0px;" +
                                    "background-color: "+    args["background_color"]  +  ";position:relative;"'>

                                        <input  type="range"
                                                v-bind:style='"position:absolute;transform: rotate(90deg);width: " + (args.height - 20) + ";top: " + ((args.height / 2) - 0) + "px;left: -" + ((args.height / 2) - 20) + "px;"'
                                                min="1"
                                                max="100"
                                                value="50">

                 </div>`
      ,
      data: function() {
       return {
         msg: "..."
     }
      },
    })
}
