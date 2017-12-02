<template>
  <div class="input-group">


    <div class="form-group">
       <select id=select_source v-model='connection_driver' class="col-xs-10  custom-select">
            <option v-for='driver in this.$store.state.list_of_drivers' 
                    :key="driver.id"
                    v-bind:value="driver.id">{{driver.id}}</option>
       </select>
    </div>


    <transition v-for='driver in this.$store.state.list_of_drivers' 
                :key="driver.id"
                name="fast-fade">
			 <component v-bind:is="driver.id + '-add-connection'" v-if='connection_driver == driver.id'>
			 </component>
    </transition>
 

  </div>
</template>






<script>

export default {
  name: 'yazz-new-connection',

  props: [],

  data: function() {return {connection_name:   '',
                            connection_driver: null
                           }},

  components: {},

  computed: {
    options: function () {
      return this.$store.state.list_of_connections;
    }
  },


  methods: {
    OK: function() {
      this.$store.dispatch('add_connection', {cn: this.connection_name, cp: {id: this.connection_name, driver: this.connection_driver}})
      this.$store.dispatch('hide_add_connection')
    },
    Cancel: function() {
      this.$store.dispatch('hide_add_connection')
    }
  }
}

</script>
