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
                the "Add connection" button
         -->
       <button class="btn btn-primary"
                v-if="!add_connection_visible"
                @click="add_new_connection">Add new connection</button>


                
                
      <!--
                  show the list of connections
         -->
      {{list_of_connections.length}} connections

      <div style="position:relative; overflow: auto;height:400px;">
        <table class="table  table-striped  table-bordered " style="position:absolute;width: 100%; height: 100%;">
          <thead >
            <tr>
              <th>Name</th>
              <th>Driver</th>
              <th></th>
            </tr>
          </thead>
          <tbody v-for="a_connection in list_of_connections">
            <tr scope="row" >
              <td v-on:click="set_viewed_connection(a_connection)">{{a_connection.name.substr(a_connection.name.length - 25)}}</td>
              <td v-on:click="set_viewed_connection(a_connection)">{{a_connection.driver}}</td>
              <td><button v-on:click.prevent='delete_item(a_connection)'>X</button></td>
            </tr>
          </tbody>
        </table>
    </div>


      </div>



      <!--
            The right hand side
         -->
      <div class='col-md-6'>





      <!--
                 show the properties of the currently
                 selected connection
         -->
         <h2>Properties </h2>



        <div v-for='driver in this.$store.state.list_of_drivers' >
		     <component v-if="viewed_connection_driver == driver.id" v-bind:is="driver.id + '-view-connection'" :connection_name=viewed_connection_id></component>
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
