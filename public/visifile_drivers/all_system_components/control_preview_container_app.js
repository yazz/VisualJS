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

      "on_form_load": `
            console.log("Called on_form_load..."  + me.name)
            console.log("... Called on_form_load finished: " + me.name)
    `,


    "on_form_show": `
        console.log("Called on_form_show..."  + me.name)
        if ( mm.args ) {
            let newa = await mm.addControl({
                          "leftX":              100,
                          "topY":               100,
                          "name":               "aaa",
                          "base_component_id":  mm.args.control_type,
                          code_id:              mm.args.control_code_id
            })

            let propertyDefnsOfComponent =   GLOBALS.getControlPropertyDefns({baseComponentId: mm.args.control_type})

            alert(JSON.stringify(propertyDefnsOfComponent,null,2))
            newa.text = "who"
            let lastY = newa.height + 50 + newa.topY
            let controlIndex = 1
            for (let propertyDefn  of  propertyDefnsOfComponent) {
                mm.addControl({
                    base_component_id: "label_control",
                    name: "aaa" + controlIndex,
                    leftX:50,
                    text: "text"
                    topY: lastY
                })
                mm.addControl({
                    base_component_id: "input_control",
                    name: "bbb" + controlIndex,
                    leftX: 150,
                    value: newa.text,
                    topY: lastY
                })
                mm.addControl({
                    base_component_id: "button_control",
                    name: "ccc" + controlIndex,
                    leftX:300,
                    value: newa.text,
                    topY: lastY,
                    click_event: "aaa.text = aaa3.value"
                })
                controlIndex++
                lastY += 100
            }


        }

        console.log("... Called on_form_show finished: " + me.name)
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
