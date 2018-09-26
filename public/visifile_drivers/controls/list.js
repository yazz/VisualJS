function(args) {
/*
is_app(true)
is_control(true)
display_name("List control")
description("This will return the List control")
base_component_id("list_control")
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

    Vue.component("list_control",{
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
