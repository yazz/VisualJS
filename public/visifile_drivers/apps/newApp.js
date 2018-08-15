function(args) {
/*
is_app(true)
display_name("New app")
base_component_id("new_app")
description("This is a new app")
load_once_from_file(true)
visibility("PUBLIC")
read_only(true)

*/

    Vue.component("new_app", {
      template: `<div>New app:</div>
       `
    })

}
