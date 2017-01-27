
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
      <postgres-add-connection v-if='connection_driver == "postgres"'>
      </postgres-add-connection>
    </transition>

 

  </div>
</template>






<script>
import oracle_add_connection    from './oracle_add_connection.vue'
import postgres_add_connection  from './postgres_add_connection.vue'

export default {
  name: 'yazz-new-connection',

  props: [],

  data: function() {return {connection_name:   '',
                            connection_driver: null
                           }},

  components: {'oracle-add-connection': oracle_add_connection,
  'postgres-add-connection': postgres_add_connection,},

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
