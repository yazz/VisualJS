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
      props: ["control_properties_and_events","design_mode"]
      ,
      template: `<div class="radio">
                    <input v-bind:id='design_mode?"":control_properties_and_events.name'
                        type="radio"
                        style="width:100%;"
                        v-model="control_properties_and_events.checked"
                        v-bind:value='control_properties_and_events.text' />{{control_properties_and_events.text}}<br>

        
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
