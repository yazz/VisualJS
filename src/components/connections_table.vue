<template>

  <!--
                    the main container
        -->
  <div class='container-fluid'>
    <div class='row'>


      <!--
                    left hand side of the screen
         -->
      <div class='col-md-6'>




      <!--
                  show the list of connections
         -->
      {{list_of_connections.length}} connections

        <table class="table  table-striped  table-bordered " style="width: 100%;">
          <thead >
            <tr>
              <th>ID</th>
              <th>Driver</th>
              <th></th>
            </tr>
          </thead>
          <tbody v-for="a_connection in list_of_connections">
            <tr scope="row" >
              <td v-on:click="set_viewed_connection(a_connection)">{{a_connection.id}}</td>
              <td v-on:click="set_viewed_connection(a_connection)">{{a_connection.driver}}</td>
              <td><button v-on:click.prevent='delete_item(a_connection)'>X</button></td>
            </tr>
          <tbody>
        </table>



      <!--
                the "Add connection" button
         -->
       <button class="btn btn-primary"
                v-if="!add_connection_visible"
                @click="add_new_connection">Add new connection</button>

      </div>



      <!--
            The right hand side
         -->
      <div class='col-md-6'>





      <!--
                 show the properties of the currently
                 selected connection
         -->
         <h2>Properties</h2>



      <!--
                 oracle
         -->
        <div v-if="viewed_connection_driver == 'oracle'">
             <oracle-view-connection  :connection_name=viewed_connection_id>      </oracle-view-connection>
        </div>





      <!--
                 postgres
         -->
        <div v-if="viewed_connection_driver == 'postgres'">
		     <component is="postgres_view_connection" connection_name=postgres></component>
        </div>







      <!--
                 show the fields to add a new connection
         -->
        <yazz-new-connection v-if="add_connection_visible"></yazz-new-connection>


      </div>
    </div>
  </div>
</template>






<script>
import oracle_add_connection    from './oracle_add_connection.vue'
import postgres_add_connection  from './postgres_add_connection.vue'
import oracle_view_connection    from './oracle_view_connection.vue'
import yazz_new_connection       from './yazz_new_connection.vue'

export default {
  name: 'connections-table',

  computed: {
    list_of_connections: function () {
      return this.$store.getters.list_of_connections
    },

    add_connection_visible: function () {
      return this.$store.state.add_connection_visible
    },

    viewed_connection_driver: function () {
      return this.$store.state.viewed_connection_driver
    },

    viewed_connection_id: function () {
      return this.$store.state.viewed_connection_id
    }
},






  components: {
  'oracle-add-connection': oracle_add_connection,
  'postgres-add-connection': postgres_add_connection,
  'oracle-view-connection': oracle_view_connection,
  'yazz-new-connection': yazz_new_connection},






  data: function() {return {current: {}
                           }},


  methods: {
    add_new_connection: function() {
      this.$store.dispatch('show_add_connection')
      this.$store.dispatch('set_viewed_connection', null);
    },
    set_viewed_connection: function(selected_item) {
      this.$store.dispatch('set_viewed_connection', selected_item);
      this.$store.dispatch('hide_add_connection');
  },
  delete_item: function(conn) {
      this.$store.dispatch('delete_connection', conn);
  }
  }
}

</script>
