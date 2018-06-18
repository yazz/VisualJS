function(args) {
    is_app()
    component_name("vue")
    description("This will return the Vue test app")

    Vue.component("VueApp", {
      template: `<div>Vue test app:</div>
       `

    })

    return {name: "VueApp"}
}
