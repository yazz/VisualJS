function(args) {
/*
is_app(true)
control_type("VB")
display_name("Draw control")
description("This will return the draw control")
base_component_id("draw_control")
load_once_from_file(true)
visibility("PRIVATE")
read_only(true)
properties(
    [
        {
            id:     "image_data",
            name:   "Image",
            type:   "Image"
        }
        ,
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
            id:         "has_details_ui",
            name:       "Has details UI?",
            type:       "Boolean",
            default:    true,
            hidden:     true
        }
     ]
)//properties
logo_url("/driver_icons/draw.png")
*/

    Vue.component("draw_control",{
      props: ["args","refresh", "design_mode"]
      ,
      template: `<div   v-bind:style='"height:100%;width:100%; border: 0px;" +
                                      "background-color: "+    args["background_color"]  +  ";"'
                        v-bind:refresh='refresh'>

                                    <canvas v-if='design_mode == "detail_editor"'
                                            v-bind:id='args.name + "_canvas_" + (design_mode?"_design_mode":"")'
                                            v-bind:refresh='refresh'
                                            style="height:100%:width:100%;">
                                    </canvas>

                                    <img      v-else=""
                                              v-bind:width='args.width + "px"'
                                              v-bind:refresh='refresh'
                                              alt='No image set'
                                              v-bind:src='"" + args.image_data'>

                                              {{design_mode}}
                                    </img>
                 </div>`
      ,
      data: function() {
       return {
         msg: "..."
     }
      },
    })
}
