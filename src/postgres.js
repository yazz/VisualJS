{
    name: 'postgres'
    ,
    vue: {
            template:   '<div>'+
						'     <table class="table table-striped table-bordered " style="width: 100%;">'+
						'        <tbody>'+
						'          <tr scope="row"><td>Type</td><td>postgres</td></tr>'+
						'          <tr scope="row"><td>ID</td><td>{{get_connection_property(connection_name,"id")}}</td></tr>'+
						'          <tr scope="row"><td>Status</td><td>{{get_connection_property(connection_name,"status")}}</td></tr>'+
						'          <tr scope="row"><td>Database</td><td>{{get_connection_property(connection_name,"database")}}</td></tr>'+
						'          <tr scope="row"><td>Host</td><td>{{get_connection_property(connection_name,"host")}}</td></tr>'+
						'          <tr scope="row"><td>Port</td><td>{{get_connection_property(connection_name,"port")}}</td></tr>'+
						'          <tr scope="row"><td>Username</td><td>{{get_connection_property(connection_name,"user")}}</td></tr>'+
						'          <tr scope="row"><td>Password</td><td>*****************</td></tr>'+
						'        <tbody>'+
						'      </table>'+
						'</div>'
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
    type: 'db_driver'
    ,
    setup: function(connection) {
          var config = {
            id:                connection.id,
            user:              connection.user,
            database:          connection.database,
            password:          connection.password,
            host:              connection.host,
            port:              connection.port,
            max:               connection.max,
            idleTimeoutMillis: connection.idleTimeoutMillis
          };

          connection.connection = new postgresdb.Client(config);
          connection.connection.connect(function (err) {
            if (err) throw err;
          });
          connection.status = 'connected';
      },



    get: function( connection , sql , callfn )
        {
            console.log('********************************');
            if (
                (connection.status == 'disconnected')
                ||
                (connection.status == null)
              )
             {
                drivers['postgres']['setup'](connection);
            }

          console.error('drivers[postgres][get]');
          // execute a query on our database
          connection.connection.query(sql, [], function (err, result) {
            if (err) throw err;

            // just print the result to the console
            console.log(result.rows); // outputs: { name: 'brianc' }
            callfn(result.rows);

            // disconnect the client
            //connection.connection.end(function (err) {
              if (err) throw err;
            });
          }
}
