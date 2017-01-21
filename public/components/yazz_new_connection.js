




// ------------------------------------------------------------------------------------------------
//                                      yazz-new-connection
//
// This allows you to create a new database connection
//
// ------------------------------------------------------------------------------------------------
Vue.component('yazz-new-connection', {
  props: [],

  data: function() {return {connection_name:   '',
                            connection_driver: null
                           }},

  template: multi_line_string(function() {/*!
<div class="input-group">

  <div class="form-group row">
    <label for="example-text-input" class="col-xs-2 col-form-label">Name</label>
    <div class="col-xs-10">
      <input type="text" class="form-control" placeholder="Name"  v-model="connection_name" />
    </div>
  </div>

  <div class="form-group row">
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

  <div class="form-group row">
        <span class="input-group-btn">
          <button class="btn btn-secondary" type="button" v-on:click="OK">OK</button>
          <button class="btn btn-secondary" type="button" v-on:click="Cancel">Cancel</button>
        </span>
      </div>
  </div>

</div>
*/}),


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
});






