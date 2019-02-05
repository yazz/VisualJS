function(args) {
/*
is_app(true)
control_type("VB")
display_name("File list control")
description("This will return the file list control")
base_component_id("file_list_control")
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
            id:     "load",
            name:   "load",
            type:   "Action"
        }
    ]
)//properties
logo_url("/driver_icons/file_list.png")
*/

    Vue.component("file_list_control",{
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
      methods: [
        load: function() {
            
        }
      ]
    })
}
