function(args) {
/*
is_app(true)
component_type("VB")
hash_algorithm("SHA256")
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
            id:     "timer_interval",
            name:   "Interval in ms",
            default: 1000,
            type:   "String"
        }
        ,
        {
            id:      "counter",
            name:    "Counter",
            default:  0,
            type:    "Number"
        }
        ,
        {
            id:     "tick_event",
            name:   "Tick event",
            type:   "Event"
        }
        ,
        {
            id:         "reset",
            snippet:    `reset()`,
            name:       "Reset",
            type:       "Action"
        }
    ]
)//properties
logo_url("/driver_icons/timer.png")
*/

    Yazz.component(
    {

      props: ["meta", "args","design_mode","refresh"]

      ,

      template: `<div v-bind:style='"height:100%;width:100%; border: 0px;" +
                                    "background-color: "+    args["background_color"]  +  ";"'>

                        <img v-if="design_mode"
                             v-bind:style='"max-width:" + args.width + "px;max-height: " + args.height + "px;"'
                             src="/driver_icons/timer.png" />
                 </div>`
      ,
      data: function() {
         return {
             msg: "..."
         }
     }
     ,
    mounted: async function() {
        await registerComponent(this)
        var mm = this
        if (!mm.design_mode) {
            var interval = parseInt(mm.args.timer_interval)

            if (isValidObject(mm.args.timer_interval) && ( interval > 0)) {
                appSetInterval(function() {
                    mm.args.counter ++
                    if (isValidObject(mm.args.tick_event)) {
                         window.globalEventBus.emit('send', {
                                            type:               "subcomponent_event",
                                            control_name:        mm.args.name,
                                            sub_type:           "tick",
                                            code:                mm.args.tick_event
                                         })
                     }

                 },interval)
             }

        }
    }
      ,
      methods: {
          reset: async function() {
              this.args.counter = 0
          }

      }
    })
}
