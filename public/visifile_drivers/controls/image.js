function(args) {
/*
is_app(true)
component_type("VB")
display_name("Image control")
description("This will return the image control")
base_component_id("image_control")
load_once_from_file(true)
visibility("PRIVATE")
read_only(true)
properties(
    [
        {
            id:     "image_data",
            name:   "Image",
            type:   "Image"
        }
        ,
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
            type:   "Event"
        }

    ]
)//properties
logo_url("/driver_icons/image.png")
*/

    Yazz.component({
      props: ["args", "name","refresh"]
      ,
      template: `<img   v-bind:width='args.width + "px"'
                        v-bind:refresh='refresh'
                        alt='No image set'
                        v-bind:src='"" + args.image_data'>
                 </img>`
      ,
      data: function() {
       return {
         msg: "..."
         }
     },
     methods: {
        event_callback: function() {
        console.log("----- image_control, event_callback: function() = " + this.name)
            //eval("(function(){" + this.args.click_event + "})")()

            this.$emit('send', {
                                            type:               "subcomponent_event",
                                            control_name:        this.name,
                                            sub_type:           "click",
                                            code:                this.args.click_event
                                        })

        }
     }

    })
}
