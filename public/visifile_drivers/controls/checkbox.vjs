function(args) {
/*
is_app(true)
component_type("VB")
hash_algorithm("SHA256")
display_name("Checkbox control")
description("This will return the checkbox control")
base_component_id("checkbox_control")
load_once_from_file(true)
visibility("PRIVATE")
read_only(true)
properties(
    [
        {
            id:         "checked",
            name:       "Checked",
            type:       "Select",
            default:    "True",
            values:     [
                            {display: "True",   value: "True"},
                            {display: "False",  value: "False"}
                        ]
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
            type:   "Event",
            help:       `<div>Help text for
                            <b>changed_event</b> event
                         </div>`
        }
        ,
        {
            id:         "width",
            name:       "Width",
            default:    30,
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
logo_url("/driver_icons/checkbox_control.png")
*/

    Yazz.component({
      props: ["control_properties_and_events","design_mode","meta", "form",  "name", "refresh", "runEvent"]
      ,
      template: `<div class="">
                    <input v-bind:id='design_mode?"":control_properties_and_events.name'
                        type="checkbox"
                        v-on:change='valChanged(event)'
                        v-bind:checked='(control_properties_and_events.checked=="True")?"True":""'
                         />
                 </div>`
      ,
      data: function() {
          return {
          }
      }
      ,
      mounted: async function() {
        await registerComponent(this)
      }
      ,
      methods: {
          valChanged: async function(e) {
              if(e.target.checked) {
                  this.control_properties_and_events.checked="True"
              } else {
                  this.control_properties_and_events.checked="False"
              }
              await this.runEvent({ display: "changed",   code: this.control_properties_and_events.changed_event })

          }
      }
    })
}
