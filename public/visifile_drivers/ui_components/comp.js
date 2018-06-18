function component(args) {
    description('Component')
    component_name("comp")

    Vue.component('z-counter', {
      data: function () {
        return {
          count: 0
        }
      },
      template: '<button v-on:click="count++">You clicked Z {{ count }} times.</button>'
    })


    return {
        name: "z-counter"
    }
}
