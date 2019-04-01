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
            id:         "text",
            name:       "Text",
            default:    "Some text",
            type:       "String"
        }
        ,
        {
            id:         "position",
            name:       "Position",
            type:       "String",
            default:    "-2 6 -5"
        }
        ,
        {
            id:         "rotation",
            name:       "Rotation",
            type:       "String",
            default:    "0 45 0"
        }
    ]
)//properties
logo_url("/driver_icons/threedee_text_control.png")
*/

    Vue.component("threedee_text_control",{
        props: [  "args"  ,  "design_mode"  ,  "refresh"  ,  "name"  ]

        ,

        template: `<a-entity          v-bind:refresh='refresh'>

                          <a-plane    v-if='args'
                                      v-bind:refresh='refresh'
                                      v-bind:position='args.position'
                                      v-bind:rotation='args.rotation'
                                      width="4"
                                      height="4"
                                      color="blue">

                              <a-entity v-bind:id='name'
                                        position="0 0 .01"
                                        v-bind:text='"width:4;value: " + args.text + ";color:white;"'>

                              </a-entity>

                          </a-plane>

                  </a-entity>`
            ,

            mounted: function() {
              //alert(this.name)
              debugger
              var dd = document.getElementById(this.name)
              dd.addEventListener('click', function() {
                debugger
                  alert("clicked")
                });
            }
        }

    )
}
