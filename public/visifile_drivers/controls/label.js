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
    ]
)//properties
logo_url("data:image/png;base64,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")
*/

    Vue.component("label_control",{
      props: ["args"]
      ,
      template: `<div v-bind:style='"height:100%;width:100%; border: 0px;" +
                                    "background-color: "+    args["background_color"]  +  ";"'>

                                                {{args.text}}
                 </div>`
      ,
      data: function() {
       return {
         msg: "..."
     }
      },
    })
}
