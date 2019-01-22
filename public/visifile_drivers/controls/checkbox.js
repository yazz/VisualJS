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
            id:     "text",
            name:   "Text",
            type:   "String"
        }
        ,
        {
            id:         "checked",
            name:       "Checked",
            type:       "Select",
            default:    "false",
            values:     [
                            {display: "True",   value: "True"},
                            {display: "False",  value: ""}
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
      props: ["args","design_mode"]
      ,
      template: `<input v-bind:id='design_mode?"":args.name'
                        type="checkbox"
                        v-model="args.checked"
                        v-bind:value='args.text'>{{args.text}}<br>

                 </input>`
      ,
      data: function() {
       return {
         msg: "...",
         checked: true
     }
      },
    })
}
