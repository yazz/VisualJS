function(args) {
    /*
    is_app(true)
    component_type("VB")
    hash_algorithm("SHA256")
    display_name("Vertical scrollbar control")
    description("This will return the Vertical scrollbar control")
    base_component_id("vert_scroll_control")
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
                id:     "background_color",
                name:   "Background color",
                type:   "String"
            }
            ,
            {
                id:     "value",
                name:   "Value",
                default: 50,
                type:   "Number",
                types: {wholeNumber: true, lessThan100: true, canConvertToString: true}

            }
            ,
            {
                id:     "changed_event",
                name:   "Changed event",
                type:   "Event"
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
                default:    250,
                type:       "Number"
            }
            ]
    )//properties
    logo_url("/driver_icons/vert_scroll_bar.png")
    */

    Yazz.component({
        props:          [  "control_properties_and_events"  ,  "refresh"  ,  "runEvent"  ,  "design_mode"  ],
        template:       `
<div v-bind:style='"height:100%;width:100%; border: 0px;" + "background-color: "+    control_properties_and_events["background_color"]  +  ";"'>

    <input  type="range"
            v-on:change='runEventHandler()'
            v-on:input='runEventHandler()'
            v-model='value'
            min="1"
            max="100"
            step="1"
            v-bind:style='"position:absolute;transform: rotate(90deg);width: " + (control_properties_and_events.height - 20) + ";top: " + ((control_properties_and_events.height / 2) - 0) + "px;left: -" + ((control_properties_and_events.height / 2) - 20) + "px;"'
            >
</div>`,
        data:           function() {
            return {
                msg:               "...",
                value:              50
            }
        },
        watch:          {
            refresh: function(newValue, oldValue) {
                if (isValidObject(this.control_properties_and_events)) {
                    this.value = this.control_properties_and_events.value
                }
            }
        },
        mounted:        async function() {
            await registerComponent(this)
            if (isValidObject(this.control_properties_and_events)) {
                this.items = this.control_properties_and_events.items
                if (isValidObject(this.control_properties_and_events.value)) {
                    this.value = this.control_properties_and_events.value
                }
            }
        },
        methods:        {
            changedFn:        function() {
                if (isValidObject(this.control_properties_and_events)) {
                    this.control_properties_and_events.value = this.value
                }
            },
            runEventHandler:  async function() {
                this.changedFn();
                await this.runEvent({ display: "changed",   code: this.control_properties_and_events.changed_event })
            }
        }
    })
}
