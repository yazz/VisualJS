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
            id:         "position",
            name:       "Position",
            type:       "String",
            default:    "-2.1 4 -10"
        }
        ,
        {
            id:         "boundingBox",
            name:       "Bounding Box",
            type:       "String",
            default:    "2 2 2"
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
            id:         "boxDepth",
            name:       "Box Depth",
            type:       "Number",
            default:    2
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
            id:         "boxWidth",
            name:       "Box Width",
            type:       "Number",
            default:    2
        }
        ,
        {
            id:         "color",
            name:       "Color",
            type:       "String",
            default:    "#166678"
        }
        ,
        {
            id:         "rotation",
            name:       "Rotation",
            type:       "String",
            default:    "0 0 0"
        }
        ,
        {
            id:         "usePhysics",
            name:       "Physics?",
            type:       "Select",
            default:    false,
            values:     [
                            {display: "False",   value: false},
                            {display: "True",  value: true}
                        ]
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
logo_url("/driver_icons/threedee_item.png")
*/

    Vue.component("threedee_item_control",{
        props: [  "meta", "args"  ,  "design_mode"  ,  "refresh"  ,  "name" ]
        ,
      template: `<a-entity v-bind:refresh='refresh'>
                    <a-entity v-bind:id='name'
                              v-bind:ref='name'
                              v-bind:rotation='args.rotation'
                              v-bind:geometry='"primitive: box; depth: " + args.boxDepth + "; height: " + args.boxHeight + "; width: " + args.boxWidth + ";"'
                              v-bind:material='"color: " + args.color + "; side: double; "'
                              v-bind:physics-body='"mass: " + args.mass + "; boundingBox: " + args.boundingBox + "; shape: box;"'
                              v-bind:dynamic-body='args.usePhysics?true:false'
                              v-bind:refresh='refresh'
                              v-bind:position='args.position'>


                  </a-entity>
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
    })
}
