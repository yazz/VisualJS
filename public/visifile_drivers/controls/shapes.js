function(args) {
/*
is_app(true)
component_type("VB")
hash_algorithm("SHA256")
display_name("Shapes control")
description("This will return the shapes control")
base_component_id("shapes_control")
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
            default:    "blue",
            type:   "String"
        }
        ,
        {
            id:         "shape",
            name:       "Shape",
            type:       "Select",
            default:    "square",
            values:     [
                            {display: "Square",   value: "square"},
                            {display: "Circle",  value: "circle"}
                        ]
        }
    ]
)//properties
logo_url("/driver_icons/shapes.png")
*/

    Yazz.component({
      props: ["control_properties_and_events"]
      ,
      template: `<div v-bind:style='"height:100%;width:100%; border: 0px;" +
                                    "background-color: "+    control_properties_and_events["background_color"]  + ";" +
                                    ((control_properties_and_events.shape == "circle")?"border-radius: 50%;":"border-radius: 0%;") +
                                    ";"'>


                 </div>`
      ,
      data: function() {
       return {
         msg: "..."
     }
      },
    })
}
