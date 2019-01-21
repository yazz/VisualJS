function(args) {
/*
is_app(true)
control_type("VB")
display_name("Radio button control")
description("This will return the radio button control")
base_component_id("radio_button_control")
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
                            {display: "True",   value: ""},
                            {display: "False",  value: "false"}
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
logo_url("/driver_icons/radio.png")
*/

    Vue.component("radio_button_control",{
      props: ["args","design_mode"]
      ,
      template: `<input v-bind:id='design_mode?"":args.name'
                        type="radio"
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
