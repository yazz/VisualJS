function(args) {
    is_app()
    display_name("New app")

    is_driver("new app")
    description("This is a new app")

    Vue.component("NewApp", {
      template: `<div>New app:</div>
       `

    })

    return {name: "NewApp"}
}
