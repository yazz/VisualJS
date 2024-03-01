function(args) {
/*
is_app(true)
component_type("VB")
hash_algorithm("SHA256")
display_name("Horizontal scrollbar control")
description("This will return the horizontal scrollbar control")
base_component_id("horiz_scroll_control")
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
            id:     "changed_event",
            name:   "Changed event",
            type:   "Event"
        }
        ,
        {
            id:     "value",
            name:   "Value",
            default: 50,
            type:   "Number",
            types: {wholeNumber: true, lessThan100: true, canConvertToString: true}
        }
        ,
        {
            id:         "width",
            name:       "Width",
            default:    250,
            type:       "Number"
        }
        ,
        {
            id:         "height",
            name:       "Height",
            default:    30,
            type:       "Number"
        }
        ]
)//properties
logo_url("/driver_icons/horiz_scroll.png")
*/

    Yazz.component({
        props: ["args","refresh",  "runEvent"]
        ,



        template:

`<div v-bind:style='"height:100%;width:100%; border: 0px;" +
                    "background-color: "+    args["background_color"]  +  ";"'>

    <input  type="range"
            v-on:change='changedFn();runEventHandler()'
            v-on:input='changedFn();runEventHandler()'
            v-model='value'
            min="1"
            max="100"
            value="50"
            step="1"
            v-bind:style='"width:" + args.width' />

</div>`
        ,




        data: function() {
            return {
                msg:               "...",
                value:             null
            }
        }
        ,
        watch: {
          refresh: function(newValue, oldValue) {
              if (isValidObject(this.args)) {
                  this.value = this.args.value
              }
          }
        }
        ,
        mounted: async function() {
            await registerComponent(this)
            if (isValidObject(this.args)) {
                this.items = this.args.items
                if (isValidObject(this.args.value)) {
                   this.value = this.args.value
                }
            }
        }
        ,
        methods: {
              changedFn: async function() {
                  if (isValidObject(this.args)) {
                      this.args.value = this.value
                  }
              }
              ,

              runEventHandler: async function() {
                  await this.runEvent({ display: "changed",   code: this.args.changed_event })

              }
        }


    })
}
