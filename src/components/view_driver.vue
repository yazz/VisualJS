

<script>
import Vue                      from 'vue'


export default {
  name: 'view-driver'
  ,
  props: ['driver_name']
  ,
  data: function() {
    return {
                template:
                `<div>
                  {{currently_selected_driver_name}} =  {{currently_selected_driver_code}} {{sometext}}
                </div>`
                ,
                templateRender: null
                ,
                sometext: '...'
          }
  }
  ,
  render: function (h) {
      if (!this.templateRender) {
            return h('div', 'loading...');
          } else { // If there is a template, I'll show it
            return this.templateRender();
          }
  }
  ,
  //render: function (f) {window.vue.compile("<div>d</div>").render}
  watch: {
  	// Every time the template prop changes, I recompile it to update the DOM
  	template:{
        immediate: true
        , // makes the watcher fire on first render, too.
        handler() {
            var res = Vue.compile(this.template);

            this.templateRender = res.render;

            // staticRenderFns belong into $options,
            // appearantly
            this.$options.staticRenderFns = []

            // clean the cache of static elements
            // this is a cache with the results from the staticRenderFns
            this._staticTrees = []

            // Fill it with the new staticRenderFns
            for (var i in res.staticRenderFns) {
              //staticRenderFns.push(res.staticRenderFns[i]);
              this.$options.staticRenderFns.push(res.staticRenderFns[i])
        }
      }
    }
  }
  ,
  computed: {
      currently_selected_driver_name: function() {
          return this.$store.state.viewed_driver_id
      }
      ,
      //currently_selected_driver_code: function() {return this.driver_name}
      currently_selected_driver_code: function() {
          var driverNames = '';
          console.log('    currently_selected_driver_code clicked: ')
          for (var i = 0; i <  this.$store.state.list_of_drivers.length; i ++) {
              var driver = this.$store.state.list_of_drivers[i]
              console.log('   driver.id[' + i +']: ' + JSON.stringify(driver , null, 2))
              driverNames = driverNames + driver.id + ' : '
              if (this.$store.state.viewed_driver_id == driver.id) {
                  var evalede = eval(driver.code)
                  if (evalede.vue) {
                     //this.template =  evalede.vue
                     return evalede
                  }
                  else {
                      this.sometext = '<div>Hello ducks</div>'
                      return driver.code
                  }
              }
          }
          //return driver.code
          return "No driver code found for " + this.$store.state.viewed_driver_id + " from [" + driverNames + "] :COUNT: " + this.$store.state.list_of_drivers.length
      }


  }

}
</script>
