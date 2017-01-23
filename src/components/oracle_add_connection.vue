<template>
    <div>
        <div class="input-group">



        <div class="form-group">
          <label for="ID" class=" col-form-label">Connection name</label>
          <input  type="text" class="form-control" v-model='connection_name'></input>
        </div>

        <div class="form-group">
            <label for="Status" class=" col-form-label">Status</label>
            <div class="form-text text-muted">
            Unknown
            </div>
        </div>

        <div class="form-group">
            <label for="Database" class="col-form-label">Connection String</label>
            <input  type="text" class="form-control" v-model='connectString'></input>
        </div>

        <div class="form-group">
            <label for="Username" class="col-form-label">User name</label>
            <input  type="text" class="form-control" v-model='connection_username'></input>
        </div>

        <div class="form-group ">
            <label for="Password" class=" col-form-label">Password</label>
            <input  class="form-control" type=password v-model='connection_password'></input>
        </div>

        <div class="form-group row">
              <span class="input-group-btn">
                <button class="btn btn-secondary" type="button" v-on:click="OK">OK</button>
                <button class="btn btn-secondary" type="button" v-on:click="Cancel">Cancel</button>
              </span>
            </div>
        </div>

      </div>
    </div>
</template>





<script>
export default {
  name: 'oracle-add-connection',
  props: [],
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
      this.$store.dispatch('add_new_connection',
      {
          cn: this.connection_name,
          cp: {
              id:             this.connection_name,
              driver:         'oracle',
              connectString:  this.connectString,
              user:           this.connection_username,
              password:       this.connection_password
          }
      })
      this.$store.dispatch('hide_add_connection')
    },
    Cancel: function() {
      this.$store.dispatch('hide_add_connection')
    }
  },
  data: function() {
    return {
      connection_name:           null,
      connection_connect_string: null,
      connectString:             null,
      connection_status:         null,
      connection_username:       null,
      connection_password:       null
    };
  },
}

</script>
