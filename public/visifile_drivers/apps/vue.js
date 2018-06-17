function(args) {
    is_app()
    is_driver("vue")
    description("This will return the test app")

    Vue.component("VueApp", {
      template: `<div>Okhay this is a Vue test app: 2gfggddf</div>
       `

    })

    return {name: "VueApp"}
}
