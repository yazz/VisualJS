function(args) {
/*
is_app(true)
component_type("VB")
hash_algorithm("SHA256")
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
      props: ["properties_and_actions", "name","refresh",  "runEvent"]
      ,
      template: `<img   v-bind:width='properties_and_actions.width + "px"'
                        v-bind:refresh='refresh'
                        alt='No image set'
                        v-bind:src='"" + properties_and_actions.image_data' />
                 `
      ,
      data: function() {
       return {
         msg: "..."
         }
     },
     methods: {
        event_callback: async function() {
        console.log("----- image_control, event_callback: function() = " + this.name)
            //eval("(function(){" + this.properties_and_actions.click_event + "})")()
            await this.runEvent({ display: "click",   code: this.properties_and_actions.click_event })
        }
     }

    })
}
