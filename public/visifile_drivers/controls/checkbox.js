function(args) {
/*
is_app(true)
control_type("VB")
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
    ]
)//properties
logo_url("/driver_icons/checkbox_control.png")
*/

    Vue.component("checkbox_control",{
      props: ["args","design_mode","meta", "form",  "name", "refresh"]
      ,
      template: `<input v-bind:id='design_mode?"":args.name'
                        type="checkbox"
                        v-on:change='valChanged(event)'
                        v-bind:checked='(args.checked=="True")?"True":""'
                        >

                 </input>`
      ,
      data: function() {
          return {
          }
      }
      ,
      mounted: function() {
        registerComponent(this)
      }
      ,
      methods: {
          valChanged: function(e) {
              if(e.target.checked) {
                  this.args.checked="True"
              } else {
                  this.args.checked="False"
              }
          }
      }
    })
}
