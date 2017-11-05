{
    name: 'sqlite'
    ,
    vue: {
            template:   '<div>'+
						'     <table class="table table-striped table-bordered " style="width: 100%;">'+
						'        <tbody>'+
						'          <tr scope="row"><td>Type</td><td>sqlite</td></tr>'+
						'          <tr scope="row"><td>ID</td><td>{{get_connection_property(connection_name,"id")}}</td></tr>'+
						'          <tr scope="row"><td>Status</td><td>{{get_connection_property(connection_name,"status")}}</td></tr>'+
						'          <tr scope="row"><td>Database file name</td><td>{{get_connection_property(connection_name,"database")}}</td></tr>'+
						'        </tbody>'+
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
			name: 'sqlite-add-connection'
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
						  driver:    'sqlite',
						  database:  this.database
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
				  connection_name:           "sqlite",
				  connection_connect_string: null,
				  database:                  "gosharedatasearch.sqlite3"
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
			name: 'sqlite-add-query'
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
						  name:           this.query_name,
						  connection:     this.query_connection,
						  database:       this.database,
						  driver:        'sqlite',
						  type:          '|DATABASE|',
						  definition:    JSON.stringify({sql: this.sql} , null, 2),
					  }
				  );
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
				  query_name:                "sqlite query",
				  database:                  "gosharedatasearch.sqlite3",
				  sql:                       "select distinct(id) from queries"
				};
			  }
	}
            
    ,
    vue_view_query: {
            template:   '<div>'+
						'     <table class="table table-striped table-bordered " style="width: 100%;">'+
						'        <tbody>'+
						'          <tr scope="row"><td>ID</td><td>{{get_query_property(query_name,"id")}}</td></tr>'+
						'          <tr scope="row"><td>Driver</td><td>sqlite</td></tr>'+
						'          <tr scope="row"><td>SQL</td><td>{{get_query_property(query_name,"definition")}}</td></tr>'+
						'        </tbody>'+
						'      </table>'+
						'</div>'
			,
			props: ['query_name']
			,
			methods: {
				get_query_property: function (cn, prop_name) {
                    var query = window.sqlGetQueryById(cn);
                    
                    if (query != null) {
                        return query[prop_name];
                    }
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
            database:          connection.database
          };
          //connection.connection = new sqlite3.Database(config.database);

          connection.status = 'connected';
      },


    get_v2: function( connection , parameters , callfn )
        {
           
			var sql = parameters.sql;
            console.log('******************************** in sqlite get');
            if (
                (connection.status == 'disconnected')
                ||
                (connection.status == null)
              )
             {
                 try {
                    drivers['sqlite']['setup'](connection, callfn);
                 } catch (error) {
                     console.log('sqlite connection error: ' + error.toString());
                     return;
                 };
            }

            console.log('drivers[sqlite][get]');
            // execute a query on our database
            connection.connection = new sqlite3.Database(connection.database);
            console.log('    Loaded DB');

            connection.connection.serialize(function() {
                connection.connection.all(sql, function(err, rows) {
                    if (err) {
                        callfn({error: '' + err});
                    } else {
                        // just print the result to the console
                        //console.log(rows); // outputs: { name: 'brianc' }
                        callfn(rows);
                    };
                });
            });
            connection.connection.close();

		}




}
