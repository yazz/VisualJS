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
if (mm.args && mm.args.control_type) {

    let compArgs = {
        base_component_id:  mm.args.control_type,
        type:               "add_component",
        text:               "",
        offsetX:            100,
        offsetY:            100
    }

    if (mm.args.control_code_id) {
        compArgs.code_id = mm.args.control_code_id
    }
debugger
    await mm.addComponentV2(
        200,
        200,
        compArgs,
        null,
        null,
        [])
}
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
