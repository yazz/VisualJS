{
    name: 'glb'
    ,
    vue: {
            template:   
'<div>'+
'     <table class="table table-striped table-bordered " style="width: 100%;">'+
'        <tbody>'+
'          <tr scope="row"><td>Type</td><td>GLB</td></tr>'+
'          <tr scope="row"><td>ID</td><td>{{get_connection_property(connection_name,"id")}}</td></tr>'+
'          <tr scope="row"><td>File</td><td>{{get_connection_property(connection_name,"fileName")}}</td></tr>'+
'          <tr scope="row"><td>Size</td><td>{{get_connection_property(connection_name,"size")}}</td></tr>'+
'          <tr scope="row"><td>Hash</td><td>{{get_connection_property(connection_name,"hash")}}</td></tr>'+
'<FileBrowser></FileBrowser>'+
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
            template:   '' +
'    <div>' +
'        <div class="input-group">' +
'            <div class="form-group">' +
'                <label for="Name" class=" col-form-label">Connection name</label>' +
'                <input  type="text" class="form-control" v-model="connection_name"></input>' +
'            </div>' +
'' +
'            <div class="form-group">' +
'                <label for="FileItem" class="col-form-label">File name</label>' +
'                <input id="FileItem"  type="text"  class="form-control"  v-model="file"></input>' +
'            </div>' +
'' +
'            <div class="form-group row">' +
'                <span class="input-group-btn">' +
'                    <button class="btn btn-secondary" type="button" v-on:click="OK">OK</button>' +
'                    <button class="btn btn-secondary" type="button" v-on:click="Cancel">Cancel</button>' +
'                </span>' +
'            </div>' +
'        </div>' +
'' +
'    </div>' +
'</div>'


			,
			name: 'glb-add-connection'
			,
			  props: []
			  ,
			  methods: {
				  onFileChange: function(e) {
					  var files = e.target.files || e.dataTransfer.files;
					  if (!files.length)
						return;
					 this.fileName = document.getElementById('FileItem').value;
					},
				get_connection_property: function (cn, prop_name) {
				  for (cc in this.$store.state.list_of_connections) {
					if (this.$store.state.list_of_connections[cc].id == cn) {
						alert(this.$store.state.list_of_connections[cc][prop_name]);
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
						  driver:    'glb',
						  fileName:  this.file
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
				  connection_name:           "GLTF .Glb binary 3d file",
				  file:                       null
				};
			  }
	}
            
    ,
    vue_add_query: {
            template:   
'' +
'<div>' +
'    <div class="input-group">' +
'        <div class="form-group">' +
'            <label for="Name" class=" col-form-label">Query name</label>' +
'            <input  type="text" class="form-control" v-model="query_name"></input>' +
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
			name: 'glb-add-query'
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
				  this.$store.dispatch('add_new_query',
				  {
					  cn: this.query_name,
					  cp: {
						  name:           this.query_name,
						  connection:     this.query_connection,
						  driver:        'glb',
						  type:          '|GLB|',
						  definition:    JSON.stringify({} , null, 2),
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
				  query_name:                ".Glb query",
				};
			  }
	}
            
    ,
    vue_view_query: {
            template:   '<div>'+
						'     <table class="table table-striped table-bordered " style="width: 100%;">'+
						'        <tbody>'+
						'          <tr scope="row"><td>ID</td><td>{{get_query_property(query_name,"id")}}</td></tr>'+
						'          <tr scope="row"><td>Name</td><td>{{get_query_property(query_name,"name")}}</td></tr>'+
						'          <tr scope="row"><td>Driver</td><td>glb</td></tr>'+
                        '          <tr scope="row"><td>Size</td><td>{{get_query_property(query_name,"size")}}</td></tr>'+
                        '          <tr scope="row"><td>Hash</td><td>{{get_query_property(query_name,"hash")}}</td></tr>'+
						'          <tr scope="row"><td>Preview</td><td>{{get_query_property(query_name,"preview")}}</td></tr>'+
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
    type: 'glb_driver'
    ,
    setup: function(connection) {
          connection.connection = new Object();
          connection.status = 'connected';
      },



    get_v2: function( connection , parameters , callfn ) {
        console.log('********************************');
        console.log('********************************');
        console.log('****     LOADING GLB   *********');
        console.log('****     LOADING GLB   *********' + connection.fileName);
        console.log('********************************');
        console.log('********************************');
        if (
            (connection.status == 'disconnected')
            ||
            (connection.status == null))
        {
            drivers['glb']['setup'](connection);
        }
			
            
        try {
            callfn([{value: "GLTF 3d model: " + connection.fileName}]);
        }
        catch(err) {
            //console.log('GLB error: ' + err);
            callfn({error: 'GLB error: ' + err});
        }
    

    }
}
