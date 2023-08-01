async function(args) {
    /*
base_component_id("control_preview_container_app")
updated_timestamp(1677214094918)
code_changes([])//code_changes
properties([
  {
    "id": "test",
    "name": "test",
    "type": "String"
  }
])//properties
formEditor({
  "next_id": 7,
  "max_form": 5,
  "active_form": "Form_1",
  "default_form": "Form_1",
  "app_selected": false,
  "id": "control_preview_container_app",
  "next_component_id": 114,
  "app_properties": [
    {
      "id": "test",
      "name": "test",
      "type": "String"
    }
  ],
  "forms": {
    "Form_1": {

      "form_load": `
        console.log("Called form_load")
        //alert(1)
        mm.zoo="bear"
        if ( mm.args ) {

            let newa = await mm.addControl({
                      "leftX":              100,
                      "topY":               100,
                      "name":               "aaa",
                      "base_component_id":  mm.args.control_type,
                      code_id:              mm.args.control_code_id
            })
                    //debugger

            newa.text = "who"

            await mm.addControl({
                      "leftX":              280,
                      "topY":               100,
                      text:                 "Debug",
                      "name":               "debug_ctrl",
                      "base_component_id":  "button_control",
                      click_event:          "debugger"
            })
        }`,


    "form_activate": `
        console.log("Called form_activate")
        //debugger
        //alert(mm.zoo)
        //alert(JSON.stringify(mm.model.forms.Form_1,null,2))
    `,


      "name": "Form_1",
      "width": 400,
      "height": 400,
      "add_block": "alert('Add block called')",
      "components": [
      ]
    }
  }
})//formEditor
component_type("SYSTEM")
runtime_pipeline(["APP"])
visibility("PRIVATE")
display_name("GUI App")
editors([
  "vb_editor_component"
])
created_timestamp(1551965300424)
is_app(true)
description('VB Blank App')
logo_url("/driver_icons/blocks.png")
*/


/* ** *** insert_code_here_start *** ** */
/* ** *** insert_code_here_end *** ** */


    /*
allowAccessToAppBaseComponentIds([""])
allowAccessToAppTypes(["database_reader"])
sqlite({})//sqlite
grant_full_db_access_to(["todo_app_reader"])
*/
}
