function(args) {
/*
is_app(true)
component_type("VB")
hash_algorithm("SHA256")
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
      props: [ "meta", "form",  "name", "properties_and_actions", "refresh",  "runEvent"]
      ,
      template: `<div>
                    <label v-if='properties_and_actions.label'>{{properties_and_actions.label}}</label>

                    <input  v-if='(!properties_and_actions.multiline) || (properties_and_actions.multiline == "False") '
                            class="form-control2"
                            v-on:click='click_event_callback()'
                            v-on:focus='focus_event_callback()'
                            v-on:keypress='keypress_event_callback(event.key)'
                            v-bind:style=   '"width:100%; " +
                                             "background-color: "+  properties_and_actions.background_color  +  ";"'

                            v-model='properties_and_actions.value' />


                    <textarea
                            v-bind:rows='(!properties_and_actions.rows)?"4":properties_and_actions.rows'
                            v-bind:cols='(!properties_and_actions.cols)?"50":properties_and_actions.cols'
                            v-if='(properties_and_actions.multiline == "True")'
                            class="form-control2"
                            v-on:click='click_event_callback()'
                            v-on:focus='focus_event_callback()'
                            v-on:keypress='keypress_event_callback(event.key)'
                            v-bind:style=   '"width:100%; " +
                                             "background-color: "+  properties_and_actions.background_color  +  ";"'

                            v-model='properties_and_actions.valueMultiline'>  </textarea>
                 </div>`
      ,
      mounted: async function() {
        await registerComponent(this)
      }
      ,



      methods: {

            click_event_callback: async function() {
                //console.log("----- button_control, click_event_callback: function() = " + this.name)
                //eval("(function(){" + this.properties_and_actions.click_event + "})")()
                await this.runEvent({ display: "click",   code: this.properties_and_actions.click_event })
            }
            ,
            keypress_event_callback: async function(mykeypressed) {
                //console.log("----- button_control, keypress_event_callback: function() = " + this.name)
                //eval("(function(){" + this.properties_and_actions.click_event + "})")()
                //this.properties_and_actions.last_keypressed = JSON.parse(JSON.stringify(mykeypressed))
                console.log("mykeypressed: "+ mykeypressed)

                this.properties_and_actions.last_keypressed = mykeypressed
                await this.runEvent({ display: "keypress",   code: this.properties_and_actions.keypress_event  })
            }
            ,
            focus_event_callback: async function() {
                console.log("----- button_control, focus_event_callback: function() = " + this.name)
                await this.runEvent({ display: "focus",   code: this.properties_and_actions.focus_event })
            }
       }
    })
}
