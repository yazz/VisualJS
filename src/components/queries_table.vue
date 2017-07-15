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
                  show the list of queries
         -->
      {{list_of_queries.length}} queries

        <table class="table  table-striped  table-bordered " style="width: 100%;">
          <thead >
            <tr>
              <th>ID</th>
              <th>Connection</th>
              <th>Driver</th>
              <th></th>
            </tr>
          </thead>
          <tbody v-for="a_query in list_of_queries">
            <tr scope="row" >
              <td v-on:click="set_viewed_query(a_query)">{{a_query.name.substring(0,10)}}</td>
              <td v-on:click="set_viewed_query(a_query)">{{a_query.connection.substring(0,10)}}</td>
              <td v-on:click="set_viewed_query(a_query)">{{a_query.driver}}</td>
              <td><button v-on:click.prevent='delete_item(a_query)'>X</button></td>
            </tr>
          </tbody>
        </table>



      <!--
                the "Add query" button
         -->
       <button class="btn btn-primary"
                v-if="!add_query_visible"
                @click="add_new_query">Add new query</button>

      </div>



      <!--
            The right hand side
         -->
      <div class='col-md-6'>





      <!--
                 show the properties of the currently
                 selected query
         -->
         <h2>Query properties </h2>



        <div v-for='query in this.$store.state.list_of_queries' >
		     <component v-if="viewed_query_id == query.id" v-bind:is="query.driver + '-view-query'" :query_name=viewed_query_id></component>
        </div>







      <!--
                 show the fields to add a new connection
         -->
        <yazz-new-query v-if="add_query_visible"></yazz-new-query>


      </div>
    </div>
  </div>
</template>






<script>
import yazz_new_query       from './yazz_new_query.vue'

export default {
  name: 'queries-table',

  computed: {
    list_of_queries: function () {
      return this.$store.getters.list_of_queries
    },

    add_query_visible: function () {
      return this.$store.state.add_query_visible
    },

    viewed_query_connection: function () {
      return this.$store.state.viewed_query_connection
    },

    viewed_query_id: function () {
      return this.$store.state.viewed_query_id
    }
},






  components: {
  'yazz-new-query': yazz_new_query},






  data: function() {return {current: {}
                           }},


  methods: {
    add_new_query: function() {
      this.$store.dispatch('show_add_query')
      this.$store.dispatch('set_viewed_query', null);
    },
    set_viewed_query: function(selected_item) {
      this.$store.dispatch('set_viewed_query', selected_item);
      this.$store.dispatch('hide_add_query');
  },
  delete_item: function(conn) {
      this.$store.dispatch('delete_query', conn);
  }
  }
}

</script>
