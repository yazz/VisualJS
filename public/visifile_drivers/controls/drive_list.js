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

                                    <select
                                        v-model='value'>

                                        <option v-for='opt in drives'
                                                v-bind:value='opt.drive'>
                                            {{opt.drive}}
                                        </option>
                                        
                                    </select>

                 </div>`
      ,
      data: function() {
         return {
            value: null,
             msg: "...",
             drives: []
         }
      }
      ,
      mounted: async function() {
        if (!this.design_mode) {
            var result = await callFunction(
                                {
                                    driver_name: "serverDriveList",
                                    method_name: "serverDriveList"  }
                                    ,{ })

           if (result.value) {
                //alert(JSON.stringify(result.value[0].drive))
                this.drives = result.value

           }
           //alert(JSON.stringify(result.value))

        }

    }
})
}
