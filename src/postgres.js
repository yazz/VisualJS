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
    vue_add: {
            template:   '    <div>' +
'        <div class="input-group">' +
'' +
 '' +
'' +
 '       <div class="form-group">' +
  '        <label for="ID" class=" col-form-label">Connection name</label>' +
   '       <input  type="text" class="form-control" v-model="connection_name"></input>' +
    '    </div>' +
'' +
 '       <div class="form-group">' +
  '          <label for="Status" class=" col-form-label">Status</label>' +
   '         <div class="form-text text-muted">' +
    '        Unknown' +
     '       </div>' +
      '  </div>' +
'' +
 '       <div class="form-group">' +
  '          <label for="Database" class="col-form-label">Database name</label>' +
   '         <input  type="text" class="form-control" v-model="database"></input>' +
    '    </div>' +
'' +
 '       <div class="form-group">' +
  '          <label for="Host" class="col-form-label">Host</label>' +
   '         <input  type="text" class="form-control" v-model="host"></input>' +
    '    </div>' +
'' +
 '       <div class="form-group">' +
  '          <label for="Port" class=" col-form-label">Port</label>' +
   '         <input  type="text" class="form-control" v-model="port"></input>' +
    '    </div>' +
'' +
 '       <div class="form-group">' +
  '          <label for="Username" class="col-form-label">User name</label>' +
   '         <input  type="text" class="form-control" v-model="connection_username"></input>' +
    '    </div>' +
'' +
 '       <div class="form-group ">' +
  '          <label for="Password" class=" col-form-label">Password</label>' +
   '         <input  class="form-control" type=password v-model="connection_password"></input>' +
    '    </div>' +
'' +
 '       <div class="form-group row">' +
  '            <span class="input-group-btn">' +
   '             <button class="btn btn-secondary" type="button" v-on:click="OK">OK</button>' +
    '            <button class="btn btn-secondary" type="button" v-on:click="Cancel">Cancel</button>' +
     '         </span>' +
      '      </div>' +
       ' </div>' +
'' +
 '     </div>' +
  '  </div>'


			,
			name: 'postgres-add-connection'
			,
			  props: []
			  ,
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
						  name:      this.connection_name,
						  driver:    'postgres',
						  database:  this.database,
						  host:      this.host,
						  port:      this.port,
						  user:      this.connection_username,
						  password:  this.connection_password
					  }
				  });
				  this.$store.dispatch('hide_add_connection');
				}
				,
				Cancel: function() {
				  this.$store.dispatch('hide_add_connection');
				}
			  }
			  ,
			  data: function() {
				return {
				  connection_name:           "postgres",
				  connection_connect_string: null,
				  database:                  "postgres",
				  host:                      "127.0.0.1",
				  port:                      "5432",
				  connection_status:         null,
				  connection_username:       "postgres",
				  connection_password:       "manager"
				};
			  }
	}
    ,
    vue_add_query: {
            template:   '' +
						'<div>' +
						'    <div class="input-group">' +
						'        <div class="form-group">' +
						'            <label for="ID" class=" col-form-label">Query name</label>' +
						'            <input  type="text" class="form-control" v-model="query_name"></input>' +
						'        </div>' +
						'        <div class="form-group">' +
						'            <label for="SQL" class="col-form-label">SQL</label>' +
						'            <input  type="text" class="form-control" v-model="sql" ></input>' +
						'        </div>' +
						'        <div class="form-group row">' +
						'            <span class="input-group-btn">' +
						'                <button class="btn btn-secondary" type="button" v-on:click="OK">OK</button>' +
						'                <button class="btn btn-secondary" type="button" v-on:click="Cancel">Cancel</button>' +
						'            </span>' +
						'        </div>' +
						'    </div>' +
						'</div>' 


			,
			name: 'postgres-add-query'
			,
			props: ['query_connection']
			,
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
					//alert(JSON.stringify({sql: this.sql} , null, 2));
				  this.$store.dispatch('add_new_query',
				  {
					  cn: this.query_name,
					  cp: {
						  name:           this.query_name,
						  connection:     this.query_connection,
						  driver:        'postgres',
						  type:          '|DATABASE|',
						  definition:    JSON.stringify({sql: this.sql} , null, 2),
					  }
				  });
				  this.$store.dispatch('hide_add_query');
				}
				,
				Cancel: function() {
				  this.$store.dispatch('hide_add_query');
				}
			  }
			  ,
			  data: function() {
				return {
				  query_name:                "postgres query",
				  sql:                       "SELECT * FROM ojobs_users limit 2"
				};
			  }
	}
            
    ,
    vue_view_query: {
            template:   '<div>'+
						'     <table class="table table-striped table-bordered " style="width: 100%;">'+
						'        <tbody>'+
						'          <tr scope="row"><td>ID</td><td>{{get_query_property(query_name,"id")}}</td></tr>'+
						'          <tr scope="row"><td>Driver</td><td>postgres</td></tr>'+
						'          <tr scope="row"><td>SQL</td><td>{{get_query_property(query_name,"definition").sql}}</td></tr>'+
						'        <tbody>'+
						'      </table>'+
						'</div>'
			,
			props: ['query_name']
			,
			methods: {
				get_query_property: function (cn, prop_name) {
				  var cc;
				  for (cc in this.$store.state.list_of_queries) {
					if (this.$store.state.list_of_queries[cc].id == cn) {
					  return this.$store.state.list_of_queries[cc][prop_name];
					};
				  };
				  return 'Unknown ' + cn + ":" + prop_name;
				},
				OK: function() {
				  this.$store.dispatch('hide_view_query')
				},
				Cancel: function() {
				  this.$store.dispatch('hide_view_query')
				}
			  }
			}
    ,
    type: 'db_driver'
    ,
    setup: function(connection, callfn) {
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
            if (err) {
                callfn({error: '' + err});
                throw err;
            }
          });
          connection.status = 'connected';
      },


    get_v2: function( connection , parameters , callfn )
        {
            
			var sql = parameters.sql;
            console.log('******************************** in postgres get');
            if (
                (connection.status == 'disconnected')
                ||
                (connection.status == null)
              )
             {
                 try {
                    drivers['postgres']['setup'](connection, callfn);
                 } catch (error) {
                     console.log('postgres connection error: ' + error.toString());
                     return;
                 };
            }

          console.error('drivers[postgres][get]');
          // execute a query on our database
          connection.connection.query(sql, [], function (err, result) {
            if (err) {
				callfn({error: '' + err});
			} else {
				// just print the result to the console
				console.log(result.rows); // outputs: { name: 'brianc' }
				callfn(result.rows);
			};


            // disconnect the client
            //connection.connection.end(function (err) {
            });
          }
}
