

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
                  {{driver_name3}} =  {{driver_name2}}
                </div>`
                ,
                templateRender: null
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
    	immediate: true, // makes the watcher fire on first render, too.
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
      driver_name3: function() {
          return this.$store.state.viewed_driver_id
      }
      ,
      //driver_name2: function() {return this.driver_name}
      driver_name2: function() {
          for (var driver of this.$store.state.list_of_drivers) {
              if (this.$store.state.viewed_driver_id === driver.id) {
                  var evalede = eval(driver.code)
                  if (evalede.vue) {
                     return "Something"
                  }
              }
              return driver.code
          }
      }


  }

}
</script>
