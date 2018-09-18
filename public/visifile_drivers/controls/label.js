function(args) {
/*
is_app(true)
is_control(true)
display_name("Label control")
description("This will return the label control")
base_component_id("label_control")
load_once_from_file(true)
visibility("PUBLIC")
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
