function(args) {
/*
is_app(true)
component_type("VB")
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
            id:     "value",
            name:   "Value",
            type:   "String",
            types: {text: true}
        }
        ,

        {
            id:     "valueMultiline",
            name:   "Multiline Value",
            type:   "String",
            textarea: true
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
        ,
        {
            id:     "keypress_event",
            name:   "Key pressed event",
            type:   "Event",
            help:       `<div>Help text for
                            <b>key_pressed</b> event
                         </div>`
        }
        ,
        {
            id:     "last_keypressed",
            name:   "Last key pressed",
            type:   "String"
        }
        ,        {
            id:         "width",
            name:       "Width",
            default:    130,
            type:       "Number"
        }
        ,
        {
            id:         "height",
            name:       "Height",
            default:    40,
            type:       "Number"
        }
        ,
        {
            id:         "rows",
            name:       "Rows",
            default:    4,
            type:       "Number"
        }
        ,
        {
            id:         "cols",
            name:       "Columns",
            default:    50,
            type:       "Number"
        }
        ,
        {
            id:         "multiline",
            name:       "Multiline",
            type:       "Select",
            default:     "False",
            values:     [
                            {display: "False",   value: "False"},
                            {display: "True",  value: "True"}
                        ]
        }

    ]
)//properties
logo_url("/driver_icons/input_box.png")
*/

    Yazz.component({
      props: [ "meta", "form",  "name", "args", "refresh"]
      ,
      template: `<div>
                    <label v-if='args.label'>{{args.label}}</label>

                    <input  v-if='(!args.multiline) || (args.multiline == "False") '
                            class="form-control2"
                            v-on:click='click_event_callback()'
                            v-on:focus='focus_event_callback()'
                            v-on:keypress='keypress_event_callback(event.key)'
                            v-bind:style=   '"width:100%; " +
                                             "background-color: "+  args.background_color  +  ";"'

                            v-model='args.value'>  </input>


                    <textarea
                            v-bind:rows='(!args.rows)?"4":args.rows'
                            v-bind:cols='(!args.cols)?"50":args.cols'
                            v-if='(args.multiline == "True")'
                            class="form-control2"
                            v-on:click='click_event_callback()'
                            v-on:focus='focus_event_callback()'
                            v-on:keypress='keypress_event_callback(event.key)'
                            v-bind:style=   '"width:100%; " +
                                             "background-color: "+  args.background_color  +  ";"'

                            v-model='args.valueMultiline'>  </textarea>
                 </div>`
      ,
      mounted: async function() {
        await registerComponent(this)
      }
      ,



      methods: {

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
            keypress_event_callback: function(mykeypressed) {
                //console.log("----- button_control, click_event_callback: function() = " + this.name)
                //eval("(function(){" + this.args.click_event + "})")()
                //this.args.last_keypressed = JSON.parse(JSON.stringify(mykeypressed))
                console.log("mykeypressed: "+ mykeypressed)

                this.args.last_keypressed = mykeypressed
                this.$emit('send', {
                                                type:               "subcomponent_event",
                                                form_name:           this.meta.form,
                                                control_name:        this.meta.name,
                                                sub_type:           "keypress",
                                                code:                this.args.keypress_event
                                            })

            }
            ,
            focus_event_callback: function() {
                console.log("----- button_control, focus_event_callback: function() = " + this.name)

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
