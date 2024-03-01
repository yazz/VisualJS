function(args) {
/*
is_app(true)
component_type("VB")
hash_algorithm("SHA256")
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
logo_url("/driver_icons/radio.png")
*/

    Yazz.component({
      props: ["args","design_mode"]
      ,
      template: `<div class="radio">
                    <input v-bind:id='design_mode?"":args.name'
                        type="radio"
                        style="width:100%;"
                        v-model="args.checked"
                        v-bind:value='args.text' />{{args.text}}<br>

        
                 </div>`
      ,
      data: function() {
       return {
         msg: "...",
         checked: true
     }
      },
    })
}
