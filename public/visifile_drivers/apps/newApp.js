function(args) {
/*
is_app(true)
display_name("New app")
base_component_id("new app")
description("This is a new app")
load_once_from_file(true)
*/

    Vue.component("NewApp", {
      template: `<div>New app:</div>
       `

    })

    return {name: "NewApp"}
}
