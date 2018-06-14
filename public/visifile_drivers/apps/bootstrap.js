function(args) {
    is_app()
    description('Bootstrap')
    Vue.component("BootstrapApp", {
        template: 

`
<div class="container">
    <div class="row">
      <div class="col-sm-6 bg-success">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.<br>
        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
      </div>
      <div class="col-sm-6 bg-warning">
        Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto.
      </div>
    </div>
  </div>
`

    })
    return {name: "BootstrapApp"}
}
