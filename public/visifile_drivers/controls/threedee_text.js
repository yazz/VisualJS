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
        ,
        {
            id:     "click_event",
            name:   "Clicked event",
            type:   "Event",
            help:       `<div>Help text for
                            <b>click_event</b> event
                         </div>`
        }
    ]
)//properties
logo_url("/driver_icons/threedee_text_control.png")
*/

    Vue.component("threedee_text_control",{
        props: [  "meta", "args"  ,  "design_mode"  ,  "refresh"  ,  "name"  ]

        ,

        template: `<a-entity          v-bind:refresh='refresh'>

                          <a-plane    v-if='args'
                                      v-bind:refresh='refresh'
                                      v-bind:position='args.position'
                                      v-bind:rotation='args.rotation'
                                      width="4"
                                      height="4"
                                      v-bind:id='name'

                                      color="blue">

                              <a-entity position="0 0 .1"
                                        v-bind:text='"width:4;value: " + args.text + ";color:white;"'>

                              </a-entity>

                          </a-plane>

                  </a-entity>`
            ,

            mounted: function() {
            var mm = this
              registerComponent(this)
              //alert(this.name)
              debugger
              var dd = document.getElementById(this.name)
              dd.addEventListener('click', function() {
                debugger
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
                }
            }

    )
}
