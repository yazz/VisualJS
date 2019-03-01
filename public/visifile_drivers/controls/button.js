function(args) {
/*
is_app(true)
control_type("VB")
display_name("Button control")
description("This will return the button control")
base_component_id("button_control")
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
            id:     "click_event",
            name:   "Clicked event",
            type:   "Event",
            help:       `<div>Help text for
                            <b>click_event</b> event
                         </div>`
        }
    ]
)//properties
logo_url("/driver_icons/button_control.png")
*/

    Vue.component("button_control",{
      props: [ "meta", "form",  "name", "args" ]
      ,
      template: `<button    type=button class='btn btn-info btn-lg'
                            v-bind:style='"height:100%;width:100%; border: 0px;" + "background-color: "+    args["background_color"]  +  ";"'
                            v-on:click='event_callback()'
                            >

                                                {{args.text}}
                 </button>`
    ,
    mounted: function() {
        registerComponent(this)

    }
    ,
    data: function() {
        return {
            msg: "..."
        }
    }
    ,
    methods: {
        event_callback: function() {
            console.log("----- button_control, event_callback: function() = " + this.name)
            //eval("(function(){" + this.args.click_event + "})")()

            this.$emit('send', {
                                            type:               "subcomponent_event",
                                            form_name:           this.meta.form,
                                            control_name:        this.meta.name,
                                            sub_type:           "click",
                                            code:                this.args.click_event
                                        })

        }
     }

    })
}
