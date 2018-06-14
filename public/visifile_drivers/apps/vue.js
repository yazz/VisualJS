function(args) {
    is_app()
    description("This will return the test app")
    Vue.component("VueApp", {
      template: `<div>Okhay this is a Vue test app: 2</div>
       `

    })
    
    return {name: "VueApp"}
}
