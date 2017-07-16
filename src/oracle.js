{
    name: 'oracle'
    ,
    type: 'db_driver'
    ,
    vue: {
            template: ''+
			'  <div>'+
			'       <table class="table table-striped table-bordered " style="width: 100%;">'+
			'          <tbody>'+
			'            <tr scope="row"><td>Type</td><td>oracle</td></tr>'+
			'            <tr scope="row"><td>ID</td><td>{{get_connection_property(connection_name,"id")}}</td></tr>'+
			'            <tr scope="row"><td>Status</td><td>{{get_connection_property(connection_name,"status")}}</td></tr>'+
			'            <tr scope="row"><td>Connect String</td><td>{{get_connection_property(connection_name,"connectString")}}</td></tr>'+
			'            <tr scope="row"><td>Username</td><td>{{get_connection_property(connection_name,"user")}}</td></tr>'+
			'            <tr scope="row"><td>Password</td><td>*****************</td></tr>'+
			'          <tbody>'+
			'        </table>'+
			'  </div>'


			,
  			name:   'oracle-view-connection'
			,
			props: ['connection_name']
			,


			data:  function() {
				return {
				  msg: 'Browse DBss'
				};
			  }
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
				  this.$store.dispatch('add_connection', {cn: this.connection_name, cp: {id: this.connection_name, driver: this.connection_driver}});
				  this.$store.dispatch('hide_add_connection');
				},
				Cancel: function() {
				  this.$store.dispatch('hide_add_connection');
				}
			  }
            }
	,
	    vue_add: {
            template: ''+
			'    <div>'+
			'        <div class="input-group">'+
			''+
			''+
			' '+
			'        <div class="form-group">'+
			'          <label for="ID" class=" col-form-label">Connection name</label>'+
			'          <input  type="text" class="form-control" v-model="connection_name"></input>'+
			'        </div>'+
			''+
			'        <div class="form-group">'+
			'            <label for="Status" class=" col-form-label">Status</label>'+
			'            <div class="form-text text-muted">'+
			'            Unknown'+
			'            </div>'+
			'        </div>'+
			''+
			'        <div class="form-group">'+
			'            <label for="Database" class="col-form-label">Connection String</label>'+
			'            <input  type="text" class="form-control" v-model="connectString"></input>'+
			'        </div>'+
			''+
			 '       <div class="form-group">'+
			'            <label for="Username" class="col-form-label">User name</label>'+
			'            <input  type="text" class="form-control" v-model="connection_username"></input>'+
			'        </div>'+
			''+
			'        <div class="form-group ">'+
			'            <label for="Password" class=" col-form-label">Password</label>'+
			'            <input  class="form-control" type=password v-model="connection_password"></input>'+
			'        </div>'+
			''+
			'        <div class="form-group row">'+
			'              <span class="input-group-btn">'+
			'                <button class="btn btn-secondary" type="button" v-on:click="OK">OK</button>'+
			'                <button class="btn btn-secondary" type="button" v-on:click="Cancel">Cancel</button>'+
			'              </span>'+
			'            </div>'+
			'        </div>'+
			''+
			'      </div>'+
			'    </div>'

			,
			name: 'oracle-add-connection'
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
						  name:             this.connection_name,
						  driver:         'oracle',
						  connectString:  this.connectString,
						  user:           this.connection_username,
						  password:       this.connection_password
					  }
				  })
				  this.$store.dispatch('hide_add_connection')
				},
				Cancel: function() {
				  this.$store.dispatch('hide_add_connection');
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
			name: 'oracle-add-query'
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
						  name:             this.query_name,
						  connection:     this.query_connection,
						  driver:        'oracle',
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
				  query_name:                "oracle query",
				  sql:                       "SELECT 1 FROM dual"
				};
			  }
	}
            
    ,
    vue_view_query: {
            template:   '<div>'+
						'     <table class="table table-striped table-bordered " style="width: 100%;">'+
						'        <tbody>'+
						'          <tr scope="row"><td>ID</td><td>{{get_query_property(query_name,"id")}}</td></tr>'+
						'          <tr scope="row"><td>Driver</td><td>oracle</td></tr>'+
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
    loadOnCondition: function() {
        var useOracle    = false;
        if (fs.existsSync(path.join(__dirname, '../oracle_driver.zip'))) {
            useOracle = true;
        }
        return useOracle;
    },


    loadDriver: function() {
        if (!fs.existsSync(process.cwd() + '\\oracle_driver\\instantclient32')) {
          fs.createReadStream(path.join(__dirname, '../oracle_driver.zip')).pipe(unzip.Extract({ path: process.cwd() + '\\.' }));
          timeout = 3000;
          console.log('Creating oracle_driver');
        } else {
          console.log('oracle_driver already exists');
        };
        process.env['PATH'] = process.cwd() + '\\oracle_driver\\instantclient32' + ';' + process.env['PATH'];
    },




    setup: function(connection, callbackfn) {
        var oracledb;
        var oraloc = process.cwd() + '\\oracle_driver\\node_modules\\oracledb';
        console.log('Start oracle from NodeJS module ' + oraloc);
        oracledb = require(oraloc);

        console.error('drivers[oracle][setup]');
        console.error('******************Loading Oracle Database');
        oracledb.getConnection(
            {
                user          : connection.user,
                password      : connection.password,
                connectString : connection.connectString
            },
            function(err, newconnection)
            {
                if (err) {
                  console.error('******************Loading Oracle Database ERROR');
                  console.error(err.message);
                  return;
                };
                connection.connection = newconnection;
                connection.status = 'connected';
                console.error('******************Loading Oracle Database CONNECTED');
                callbackfn();
            })
        },





    getResult: function(connection, sql, callfn) {
        console.error('drivers[oracle][get]');

        if (connection.connection) {
			var fields = [];
          connection.connection.execute(
            // The statement to execute
            sql,

            // The "bind value" 180 for the "bind variable" :id
            [],

            // Optional execute options argument, such as the query result format
            // or whether to get extra metadata
            // { outFormat: oracledb.OBJECT, extendedMetaData: true },

            // The callback function handles the SQL execution results
            function(err, result)
            {
              if (err) {
                console.error(err.message);
                //doRelease(connection.connection);
                return;
              }
			  if (!result["metaData"]) {
				  return;
			  }
			  var field;
		      for (var i = 0; i < result["metaData"].length; i++) { 
				  field = result["metaData"][i];
				  fields.push(field["name"]);
			  }
              console.log(fields); // [ { name: 'DEPARTMENT_ID' }, { name: 'DEPARTMENT_NAME' } ]
			  
			  var newarray = [];
			  var thing;
			  for(var y = 0; y < result.rows.length; y++){
				thing = {};
				for(var i = 0; i < fields.length; i++){
					thing[fields[i]] = result.rows[y][i];
				}
				newarray.push(thing);
			}
			  
              callfn(newarray);
              //doRelease(connection.connection);
          })}
          },





    get_v2: function(connection, parameters, callfn) {
		var sql = parameters.sql;
        if (
            (connection.status == 'disconnected')
            ||
            (connection.status == null)
        )
        {
        drivers['oracle']['setup'](connection,
                                   function() {
                                           drivers['oracle']['getResult'](connection, sql, callfn)});
      }
      else {

        drivers['oracle']['getResult'](connection, sql, callfn);
      }
    },



    // Note: connections should always be released when not needed
    doRelease: function(connection) {
      connection.close(
        function(err) {
          if (err) {
            console.error(err.message);
          }
        });
    }
}
