<template>
  <div class="input-group">


    <div class="form-group">
	   <label for="select_connection" class=" col-form-label">Connection name</label>
       <select id=select_connection v-model='query_connection' class="col-xs-10  custom-select">
            <option v-for='connection in this.$store.state.list_of_connections' v-bind:value="connection.id">{{connection.name}}</option>
       </select>
    </div>


    <transition v-for='connection in this.$store.state.list_of_connections' name="fast-fade">
			 <component v-bind:is="connection.driver + '-add-query'" v-if='query_connection == connection.id' v-bind:query_connection='connection.id'>
			 </component>
    </transition>
 

  </div>
</template>






<script>

export default {
  name: 'yazz-new-query',

  props: [],

  data: function() {
			return {query_name:   				'',
					query_connection_driver: 	null,
					query_connection: 			null
			}},

  components: {}
}

</script>
