function(args) {
/*
is_app(true)
control_type("VB")
display_name("Drive list control")
description("This will return the drive list control")
base_component_id("drive_list_control")
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
logo_url("/driver_icons/drive_list.png")
*/

    Vue.component("drive_list_control",{
      props: ["args","design_mode"]
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
      }
      ,
      mounted: async function() {
        if (!this.design_mode) {
            callDriverMethod( {driver_name: "serverDriveList",
                              method_name: "serverDriveList"}
                             ,
                             {}
                       ,
                       async function(result) {
                           alert(JSON.stringify(result))

                       })
        }

    }
})
}
