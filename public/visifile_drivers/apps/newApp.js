function(args) {
    /*
    is_app()
    display_name("New app")
    base_component_id("new app")
    description("This is a new app")
    */

    Vue.component("NewApp", {
      template: `<div>New app:</div>
       `

    })

    return {name: "NewApp"}
}
