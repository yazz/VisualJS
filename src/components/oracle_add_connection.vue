<template>
<div>
  <div class="input-group">

    <div class="form-group row">
      <label for="Typefdh" class="col-xs-4 col-form-label">Type</label>
      <div class="col-xs-8">
        Oracle
      </div>
    </div>

    <div class="form-group row">
      <label for="ID" class="col-xs-4 col-form-label">ID</label>
      <div class="col-xs-8">
        <input  type="text" class="form-control" v-model='connection_name'></input>
      </div>
    </div>

    <div class="form-group row">
      <label for="Status" class="col-xs-4 col-form-label">Status</label>
      <div class="col-xs-8">
        ...
      </div>
    </div>

    <div class="form-group row">
      <label for="Connect String" class="col-xs-4 col-form-label">Connect String</label>
      <div class="col-xs-8" >
        <input  type="text" class="form-control" v-model='connection_connect_string'></input>
      </div>
    </div>

    <div class="form-group row">
      <label for="Username" class="col-xs-4 col-form-label">User name</label>
      <div class="col-xs-8" >
        <input  type="text" class="form-control" v-model='connection_username'></input>
      </div>
    </div>

    <div class="form-group row">
      <label for="Password" class="col-xs-4 col-form-label">Password</label>
      <div class="col-xs-8">
        <input  class="form-control" type=password v-model='connection_password'></input>
      </div>
    </div>

  </div>
</div>
</template>




<script>
export default {
  name: 'oracle-add-connection',
  data: function() {
    return {
      connection_name: null,
      connection_connect_string: null,
      connection_status: null,
      connection_username: null,
      connection_password: null
    };
  },
  computed: {

  },
  methods: {
    get_connection_property: function (cn, prop_name) {
      for (cc in this.$store.state.list_of_connections) {
        if (this.$store.state.list_of_connections[cc].id == cn) {
          return this.$store.state.list_of_connections[cc][prop_name];
        };
      };
      return 'Unknown ' + cn + ":" + prop_name;
    },
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


