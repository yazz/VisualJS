

// ------------------------------------------------------------------------------------------------
//                                      connections-table
//
// This shows all the database connections and lets the user add or edit them
//
// ------------------------------------------------------------------------------------------------
Vue.component('connections-table', {


  template: multi_line_string(function() {/*!
    <!-- --------------------------------------------------
                  the main container
      ----------------------------------------------------- -->
<div class='container-fluid'>
  <div class='row'>


    <!-- --------------------------------------------------
                  left hand side of the screen
      ----------------------------------------------------- -->
    <div class='col-md-6'>




    <!-- --------------------------------------------------
                show the list of connections
      ----------------------------------------------------- -->
    {{list_of_connections.length}} connections
      <table class="table  table-striped  table-bordered " style="width: 100%;">
        <thead >
          <tr>
            <th>ID</th>
            <th>Driver</th>
          </tr>
        </thead>
        <tbody v-for="a_connection in list_of_connections">
          <tr scope="row" v-on:click="set_viewed_connection(a_connection)">
            <td>{{a_connection.id}}</td>
            <td>{{a_connection.driver}}</td>
          </tr>
        <tbody>
      </table>



    <!-- --------------------------------------------------
              the "Add connection" button
      ----------------------------------------------------- -->
     <button class="btn btn-primary"
              v-if="!add_connection_visible"
              @click="add_new_connection">Add new connection</button>

    </div>



    <!-- --------------------------------------------------
          The right hand side
      ----------------------------------------------------- -->
    <div class='col-md-6'>





    <!-- --------------------------------------------------
               show the properties of the currently
               selected connection
      ----------------------------------------------------- -->
       <h2>Properties</h2>



    <!-- --------------------------------------------------
               oracle
      ----------------------------------------------------- -->
      <div v-if="$store.state.viewed_connection_driver == 'oracle'">
           <oracle-view-connection  :connection_name=$store.state.viewed_connection_id>      </oracle-view-connection>
      </div>





    <!-- --------------------------------------------------
               postgres
      ----------------------------------------------------- -->
      <div v-if="$store.state.viewed_connection_driver == 'postgres'">
           <postgres-view-connection  :connection_name=$store.state.viewed_connection_id>      </postgres-view-connection>
      </div>







    <!-- --------------------------------------------------
               show the fields to add a new connection
      ----------------------------------------------------- -->
      <yazz-new-connection v-if="add_connection_visible"></yazz-new-connection>


    </div>
  </div>
</div>
*/}),


  computed: {
    list_of_connections: function () {
      return this.$store.state.list_of_connections
    },

    add_connection_visible: function () {
      return this.$store.state.add_connection_visible
    }
  },


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
    }
  }

});



