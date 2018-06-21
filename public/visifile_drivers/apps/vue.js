function(args) {
    is_app()
    display_name("VueJS test App")

    base_component_id("vue")
    description("This will return the Vue test app")

    Vue.component("VueApp", {
      template: `<div>Vue test app:</div>
       `

    })

    return {name: "VueApp"}
}
