<template>
  <div class="input-group">


    <div class="form-group">
       <select id=select_source v-model='connection_driver' class="col-xs-10  custom-select">
            <option value="postgres">Postgres</option>
            <option value="oracle">Oracle</option>
       </select>
    </div>


    <transition name="fast-fade">
      <oracle-add-connection v-if='connection_driver == "oracle"'>
      </oracle-add-connection>
    </transition>

    <transition name="fast-fade">
			 <component is="postgres-add-connection" v-if='connection_driver == "postgres"'>
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
