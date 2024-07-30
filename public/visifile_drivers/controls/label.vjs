function(args) {
/*
is_app(true)
component_type("VB")
hash_algorithm("SHA256")
display_name("Label control")
editors([
  "textEditorPlugInComponent"
])
description("This will return the label control")
base_component_id("label_control")
load_once_from_file(true)
visibility("PRIVATE")
read_only(true)
properties(
    [
        {
            id:     "text",
            name:   "Text",
            type:   "String",
            default: "Edit this text",
            types: {text: true},
            accept_types: {canConvertToString: true, text: true},
            textarea: true,
            help:       `<div>Help text for
                            <b>text</b> property
                         </div>`
        }
        ,
        {
            id:     "background_color",
            name:   "Background color",
            types: {text: true},
            type:   "String"
        }
        ,
        {
            id:     "color",
            name:   "Color",
            default: "black",
            type:   "String"
        }
        ,        {
            id:     "border_color",
            name:   "Border color",
            type:   "String",
            default: "black"
        }
        ,
        {
            id:     "border_width_px",
            name:   "Border width px",
            type:   "Number",
            default: 0
        }
        ,
        {
            id:     "padding_px",
            name:   "Padding px",
            type:   "Number",
            default: 4
        }
        ,
        {
            id:         "use_pre",
            name:       "Use <pre>",
            type:       "Select",
            default:     "False",
            values:     [
                            {display: "False",   value: "False"},
                            {display: "True",  value: "True"}
                        ]
        }
        ,
        {
            id:         "setText",
            snippet:    `setText("")`,
            name:       "setText",
            type:       "Action",
            help:       `<div>Help text for
                            <b>setText</b> function
                         </div>`
        }
        ,
        {
            id:         "setTextAsync",
            pre_snippet: `await `,
            snippet:    `setTextAsync("")`,
            name:       "setTextAsync",
            type:       "Action",
            help:       `<div>Help text for
                            <b>setTextAsync</b> function
                         </div>`
        }
        ,
        {
            id:         "width",
            name:       "Width",
            default:    150,
            type:       "Number"
        }
        ,
        {
            id:         "height",
            name:       "Height",
            default:    100,
            type:       "Number"
        }
        ,
        {
            id:         "font_size_units",
            name:       "Font size units",
            type:       "Select",
            default:     "px",
            values:     [
                            {display: "Pixels",   value: "px"}
                        ]
        }
        ,
        {
            id:         "font_size",
            name:       "Font Size",
            default:    16,
            type:       "Number"
        }
    ]
)//properties
logo_url("/driver_icons/text_control.png")
*/

    Yazz.component({
        props: ["meta","name","control_properties_and_events","refresh","design_mode"]
        ,
        template: `<div v-bind:style='"white-space:normal;height:100%;width:100%; " +
                                        "color: "              +     control_properties_and_events["color"]  + ";" +
                                        "border-color: "       +     control_properties_and_events["border_color"]  + ";" +
                                        "border: "             +    (design_mode?0:control_properties_and_events["border_width_px"])  + "px;" +
                                        "background-color: "   +     control_properties_and_events["background_color"]  + ";" +
                                        "font-size: "   +     ((control_properties_and_events["font_size"]?control_properties_and_events["font_size"]:16)  + (control_properties_and_events["font_size_units"]?control_properties_and_events["font_size_units"]:"px")+";") +
                                        "padding: "            +     control_properties_and_events["padding_px"]  + ";" +
                                        "border-style: solid;" +
                                        "overflow: auto;"'>

                    <pre v-if="control_properties_and_events.use_pre == 'True'">{{text}}</pre>
                    
                    <div v-else>
                    {{text}}
                    </div>
        
                </div>`
        ,
        data: function() {
            return {
                text: ""
            }
        }
        ,
        watch: {
          // This would be called anytime the value of the input changes
          refresh(newValue, oldValue) {
              //console.log("refresh: " + this.control_properties_and_events.text)
              if (isValidObject(this.control_properties_and_events)) {
                  this.text = this.control_properties_and_events.text
                  this.background_color = this.control_properties_and_events.background_color
              }          // you can do anything here with the new value or old/previous value
          }
        },
        mounted: async function() {
            await registerComponent(this)

            if (isValidObject(this.control_properties_and_events.text)) {
                this.text = this.control_properties_and_events.text
            }
        }
        ,
        methods: {
            setText: function(newtext) {
                this.text = newtext
                this.changedFn()
            }
            ,
            setTextAsync: async function(newtext) {
                this.text = newtext
                this.changedFn()
            }
            ,
            changedFn: function() {
                if (isValidObject(this.control_properties_and_events)) {
                    this.control_properties_and_events.text = this.text
                }
            }
        }
    })
}
