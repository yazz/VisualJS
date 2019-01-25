function(args) {
/*
is_app(true)
control_type("VB")
display_name("Input control")
description("This will return the input control")
base_component_id("input_control")
visibility("PRIVATE")
read_only(true)
load_once_from_file(true)
properties(
    [
        {
            id:     "label",
            name:   "Label",
            type:   "String"
        }
        ,
        {
            id:     "placeholder",
            name:   "Placeholder",
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
            id:     "text",
            name:   "Text",
            type:   "String"
        }
    ]
)//properties
logo_url("/driver_icons/input_box.png")
*/

    Vue.component("input_control",{
      props: ["args","refresh"]
      ,
      template: `<div>
                    <label v-if='label'>{{label}}</label>

                    <input  class="form-control2"
                            v-on:change='changedFn'
                            v-bind:style=   '"width:100%; " +
                                             "background-color: "+  background_color  +  ";"'

                            v-model='text'>  </input>

                 </div>`
      ,
      watch: {
        // This would be called anytime the value of the input changes
        refresh(newValue, oldValue) {
            //console.log("refresh: " + this.args.text)
            if (isValidObject(this.args)) {
                this.label = this.args.label
                this.text = this.args.text
                this.background_color = this.args.background_color
            }          // you can do anything here with the new value or old/previous value
        }
      },
      mounted: function() {
        if (isValidObject(this.args)) {
            this.label = this.args.label
            this.text = this.args.text
            this.background_color = this.args.background_color
        }
      }
      ,
      data: function() {
            return {
                text: "",
                label: "",
                background_color: ""
            }
      },
      methods: {
            changedFn: function() {
                if (isValidObject(this.args)) {
                    this.args.label = this.label
                    this.args.text = this.text
                    this.args.background_color = this.background_color
                }
            }
      }
    })
}
