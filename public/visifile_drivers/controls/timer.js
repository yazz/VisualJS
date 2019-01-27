function(args) {
/*
is_app(true)
control_type("VB")
display_name("Timer control")
description("This will return the timer control")
base_component_id("timer_control")
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
        ,
        {
            id:     "tick_event",
            name:   "Tick event",
            type:   "Event"
        }
    ]
)//properties
logo_url("/driver_icons/timer.png")
*/

    Vue.component("timer_control",{
      props: ["args", "design_mode"]
      ,
      template: `<div v-bind:style='"height:100%;width:100%; border: 0px;" +
                                    "background-color: "+    args["background_color"]  +  ";"'>

                        <img v-if="design_mode"
                             v-bind:style='"max-width:" + args.width + "px;max-height: " + args.height + "px;"'
                             src="/driver_icons/timer.png"></img>
                 </div>`
      ,
      data: function() {
         return {
             msg: "..."
         }
     }
     ,
     mounted: function() {
        var mm = this
        if (!mm.design_mode) {
            if (isValidObject(mm.args.tick_event) && (mm.args.tick_event.length > 0)) {
                appSetInterval(function() {
                    mm.$emit('send', {
                                                    type:               "subcomponent_event",
                                                    control_name:        mm.args.name,
                                                    sub_type:           "tick",
                                                    code:                mm.args.tick_event
                                                })
                },1000)
            }
        }
      }
    })
}
