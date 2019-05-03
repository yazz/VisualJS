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
        ,
        {
            id:     "click_event",
            name:   "Clicked event",
            type:   "Event",
            help:       `<div>Help text for
                            <b>click_event</b> event
                         </div>`
        }
        ,
        {
            id:     "focus_event",
            name:   "Focus event",
            type:   "Event",
            help:       `<div>Help text for
                            <b>focus_event</b> event
                         </div>`
        }
    ]
)//properties
logo_url("/driver_icons/input_box.png")
*/

    Vue.component("input_control",{
      props: [ "meta", "form",  "name", "args","refresh"]
      ,
      template: `<div>
                    <label v-if='label'>{{label}}</label>

                    <input  class="form-control2"
                            v-on:change='changedFn'
                            v-on:click='click_event_callback()'
                            v-on:focus='focus_event_callback()'
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
        registerComponent(this)

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
            ,
            click_event_callback: function() {
                //console.log("----- button_control, click_event_callback: function() = " + this.name)
                //eval("(function(){" + this.args.click_event + "})")()

                this.$emit('send', {
                                                type:               "subcomponent_event",
                                                form_name:           this.meta.form,
                                                control_name:        this.meta.name,
                                                sub_type:           "click",
                                                code:                this.args.click_event
                                            })

            }
            ,
            focus_event_callback: function() {
                //console.log("----- button_control, focus_event_callback: function() = " + this.name)

                this.$emit('send', {
                                                type:               "subcomponent_event",
                                                form_name:           this.meta.form,
                                                control_name:        this.meta.name,
                                                sub_type:           "focus",
                                                code:                this.args.focus_event
                                            })

            }
       }
    })
}
