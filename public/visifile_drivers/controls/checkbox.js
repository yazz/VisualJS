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
      props: ["args","design_mode","meta", "form",  "name", "refresh"]
      ,
      template: `<div class="">
                    <input v-bind:id='design_mode?"":args.name'
                        type="checkbox"
                        v-on:change='valChanged(event)'
                        v-bind:checked='(args.checked=="True")?"True":""'
                        >

                 </input>
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
          valChanged: function(e) {
              if(e.target.checked) {
                  this.args.checked="True"
              } else {
                  this.args.checked="False"
              }
              this.$emit('send', {
                                              type:               "subcomponent_event",
                                              form_name:           this.meta.form,
                                              control_name:        this.meta.name,
                                              sub_type:           "changed",
                                              code:                this.args.changed_event
                                          })

          }
      }
    })
}
