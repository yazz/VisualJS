function(args) {
/*
is_app(true)
component_type("VB")
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
        props: ["meta","name","args","refresh","design_mode"]
        ,
        template: `<div v-bind:style='"white-space:normal;height:100%;width:100%; " +
                                        "color: "              +     args["color"]  + ";" +
                                        "border-color: "       +     args["border_color"]  + ";" +
                                        "border: "             +    (design_mode?0:args["border_width_px"])  + "px;" +
                                        "background-color: "   +     args["background_color"]  + ";" +
                                        "font-size: "   +     ((args["font_size"]?args["font_size"]:16)  + (args["font_size_units"]?args["font_size_units"]:"px")+";") +
                                        "padding: "            +     args["padding_px"]  + ";" +
                                        "border-style: solid;" +
                                        "overflow: auto;"'>

                    <pre v-if="args.use_pre == 'True'">{{text}}</pre>
                    
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
              //console.log("refresh: " + this.args.text)
              if (isValidObject(this.args)) {
                  this.text = this.args.text
                  this.background_color = this.args.background_color
              }          // you can do anything here with the new value or old/previous value
          }
        },
        mounted: function() {
            registerComponent(this)

            if (isValidObject(this.args.text)) {
                this.text = this.args.text
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
                if (isValidObject(this.args)) {
                    this.args.text = this.text
                }
            }
        }
    })
}
