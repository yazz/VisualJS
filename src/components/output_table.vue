<template>
  <div class='container-fluid'>
    <div class='row'>
      <div class='col-md-6'>
      {{list_of_records.length}} records

        <table class="table  table-striped  table-bordered " style="width: 100%;">
          <thead >
            <tr>
              <th  v-for="field_name  in  list_of_fields">{{field_name}}</th>
            </tr>
          </thead>
          <tbody v-for="a_record in list_of_records">
            <tr scope="row" >
              <td v-for="field_name  in  list_of_fields" v-on:click="set_viewed_connection(a_record)">{{a_record[field_name]}}</td>
            </tr>
          <tbody>
        </table>
      </div>
    </div>
  </div>
</template>






<script>
import yazz_new_connection       from './yazz_new_connection.vue'

export default {
  name: 'output-table',

  computed: {
    list_of_records: function () {
      return this.$store.state.list_of_output_records
    },
    list_of_fields: function () {
      return this.$store.state.list_of_output_fields
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
