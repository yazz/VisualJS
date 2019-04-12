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
            default:    "-2.1 4 -10"
        }
        ,
        {
            id:         "mass",
            name:       "Mass",
            type:       "Number",
            default:    5
        }
        ,
        {
            id:         "color",
            name:       "Color",
            type:       "String",
            default:    "#166678"
        }


    ]
)//properties
logo_url("/driver_icons/threedee_item.png")
*/

    Vue.component("threedee_item_control",{
        props: [  "meta", "args"  ,  "design_mode"  ,  "refresh"  ,  "name" ]
        ,
      template: `<a-entity v-bind:refresh='refresh'>
                    <a-entity v-if='args'
                              geometry="primitive: box"
                              v-bind:material='"color: " + args.color + "; side: double"'
                              v-bind:physics-body='"mass: " + args.mass + "; boundingBox: 2 2 2; shape: auto;"'
                              dynamic-body
                              v-bind:refresh='refresh'
                              v-bind:position='args.position'>
                  </a-entity>
              </a-entity>`








        ,

        mounted: function() {
            var mm = this
            registerComponent(this)
        }

    })
}
