{
    name: 'testdriver'
    ,
    type: 'basic'
    ,
    text: 'Hello driver'
    
    ,
    vue: {
            template:   '<div><br>Just a test driver driver. nothing to view</div>'
			,
			props: ['connection_name']
			,
			methods: {
				get_connection_property: function (cn, prop_name) {
				  var cc;
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
    ,
    vue_add: {
            template:   '<div><br>Just a test driver. Nothing to add</div>' 
			,
			name: 'testdriver-add-connection'
			,
			  props: []
	}

}
