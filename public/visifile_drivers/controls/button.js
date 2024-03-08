function() {
/*
component_type("VB")
hash_algorithm("SHA256")
display_name("Button control")
description("This will return the button control")
base_component_id("button_control")
load_once_from_file(true)
visibility("PRIVATE")
read_only(true)
properties(
    [
        {
            id:         "text",
            name:       "Text",
            default:    "Click me",
            type:       "String",
            help:       `<div>This is the text that is displayed in the button</div>`
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
            id:         "width",
            name:       "Width",
            default:    110,
            type:       "Number"
        }
        ,
        {
            id:         "height",
            name:       "Height",
            default:    50,
            type:       "Number"
        }
        ,
        {
            id:         "padding",
            name:       "Padding",
            type:       "Number"
        }
        ,
        {
            id:         "background_color",
            name:       "Background color",
            type:       "String"
        }
        ,
        {
            id:         "color",
            name:       "Color",
            type:       "String"
        }
        ,
        {
            id:         "button_size",
            name:       "Button size",
            type:       "Select",
            default:    "large",
            values:     [
                            {display: "Large",   value: "large"},
                            {display: "Normal",  value: "normal"},
                            {display: "Small",  value: "small"}
                        ]
        }
        ,
        {
            id:         "click_event",
            name:       "Clicked event",
            type:       "Event",
            help:       `<div>Help text for
                            <b>click_event</b> event
                        </div>`
        }
    ]
)//properties
logo_url("/driver_icons/button_control.png")
*/

    Yazz.component(
    {
        props:      [  "sql"  ,  "meta"  ,  "name"  ,  "refresh"  ,  "design_mode"   ,  "control_properties_and_events"  ,  "runEvent"  ],
        template:   `<button  type=button
                      v-bind:class='"btn btn-info " + (((control_properties_and_events.button_size=="large") || (!control_properties_and_events.button_size))?"btn-lg ":"")  + (control_properties_and_events.button_size=="small"?"btn-sm ":"") '
                      v-bind:style='"height:100%;width:100%; border: 0px;" + "background-color: "+    control_properties_and_events["background_color"]  +  ";"+ "color: "+    (control_properties_and_events["color"]?control_properties_and_events["color"]:"black")  +  ";" + (control_properties_and_events.padding?"padding: " + control_properties_and_events.padding + ";": "")'
                      v-on:click='buttonClicked()'
                    >
                    
                        {{control_properties_and_events.text}}
                    
                    </button>`,
        mounted:    async function( ) {
            await registerComponent(this)
        },
        data:       function( ) {
                                    return {
                                        text: ""
                                    }
                                },
        methods:    {
                        buttonClicked:      async function  ( ) {
                            let mm = this
                            //debugger
                            await mm.runEvent({display: "click_event",code: mm.control_properties_and_events.click_event})
                        },
                        setText:            async function  ( newtext ) {
                                            this.text = newtext
                                            this.changedFn()
                                        },
                        changedFn:          function        ( ) {
                                            if (isValidObject(this.control_properties_and_events)) {
                                                this.control_properties_and_events.text = this.text
                                            }
                                        }
                    }
    })
}
