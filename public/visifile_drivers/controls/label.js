function(args) {
/*
is_app(true)
control_type("VB")
display_name("Label control")
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
            id:     "setText",
            name:   "setText",
            type:   "Action"
        }
    ]
)//properties
logo_url("/driver_icons/text_control.png")
*/

    Vue.component("label_control",{
        props: ["args", "name","refresh"]
        ,
        template: `<div v-bind:style='"height:100%;width:100%; border: 0px;" +
                                    "background-color: "+    args["background_color"]  +  ";"'>

                                                {{text}}
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
            if (isValidObject(this.args.text)) {
                this.text = this.args.text
            }

            if (isValidObject(this.args.name)) {
                globalControl[this.args.name] =  this
            }
        }
        ,
        methods: {
            setText: function(av) {
                this.text = "fdsdfsfd"
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
