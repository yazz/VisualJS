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
            id:         "backgroundColor",
            name:       "Background Color",
            default:    "lightgray",
            type:       "String"
        }
        ,
        {
            id:         "color",
            name:       "Color",
            default:    "black",
            type:       "String"
        }
        ,
        {
            id:         "position",
            name:       "Position",
            type:       "String",
            default:    "-2 2 -5"
        }
        ,
        {
            id:         "rotation",
            name:       "Rotation",
            type:       "String",
            default:    "0 45 0"
        }
        ,
        {
            id:         "boxWidth",
            name:       "Box Width",
            type:       "Number",
            default:    4
        }
        ,
        {
            id:         "boxHeight",
            name:       "Box Height",
            type:       "Number",
            default:    2
        }
        ,
        {
            id:     "click_event",
            name:   "Clicked event",
            type:   "Event",
            help:       `<div>Help text for
                            <b>click_event</b> event
                         </div>`
        }
        ,
        {
            id:         "moveRight",
            snippet:    `moveRight(1)`,
            name:       "Move Right",
            type:       "Action"
        }
    ]
)//properties
logo_url("/driver_icons/threedee_text_control.png")
*/

    Vue.component("threedee_text_control",{
        props: [  "meta", "args"  ,  "design_mode"  ,  "refresh"  ,  "name"  ]

        ,

        template: `<a-entity          v-bind:refresh='refresh'>

                          <a-plane    v-if='(design_mode == false)'
                                      v-bind:refresh='refresh'
                                      v-bind:position='args.position'
                                      v-bind:rotation='args.rotation'
                                      v-bind:width='args.boxWidth'
                                      v-bind:height='args.boxHeight'
                                      v-bind:id='name'

                                      v-bind:color='args.backgroundColor'>

                              <a-entity position=".2 0 .1"
                                        v-bind:text='"width:4;value: " + args.text + ";color:" + args.color + ";"'>

                              </a-entity>

                          </a-plane>

                  </a-entity>`
            ,

            mounted: function() {
                var mm = this
                registerComponent(this)
                var dd = document.getElementById(this.name)
                dd.addEventListener('click', function() {
                    mm.event_callback()
                });
            }
            ,
            methods: {
                event_callback: function() {
                    console.log("----- 3d text, event_callback: function() = " + this.name)
                    //eval("(function(){" + this.args.click_event + "})")()

                    this.$emit('send', {
                                                    type:               "subcomponent_event",
                                                    form_name:           this.meta.form,
                                                    control_name:        this.meta.name,
                                                    sub_type:           "click",
                                                    code:                this.args.click_event
                                                })
                }
                ,
                moveRight: async function(amount) {
                    this.args.position = "2 2 -5"

                }






            }
        }

    )
}
