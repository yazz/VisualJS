{
    name: 'csv'
    ,
    vue: {
            template:   
'<div>'+
'     <table class="table table-striped table-bordered " style="width: 100%;">'+
'        <tbody>'+
'          <tr scope="row"><td>Type</td><td>CSV</td></tr>'+
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
			name: 'csv-add-connection'
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
						  driver:    'csv',
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
				  connection_name:           "CSV connection",
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
			name: 'csv-add-query'
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
						  driver:        'csv',
						  type:          '|CSV|',
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
				  query_name:                "csv query",
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
						'          <tr scope="row"><td>Driver</td><td>csv</td></tr>'+
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
    type: 'csv_driver'
    ,
    setup: function(connection) {
          var config = {
            id:                connection.id,
            file:              connection.file
          };

          connection.connection = new Object();
          connection.status = 'connected';
      },



    get_v2: function( connection , parameters , callfn ) {
        console.log('********************************');
        console.log('********************************');
        console.log('****     LOADING CSV   *********');
        console.log('****     LOADING CSV   *********' + connection.fileName);
        console.log('********************************');
        console.log('********************************');
        if (
            (connection.status == 'disconnected')
            ||
            (connection.status == null))
        {
            drivers['csv']['setup'](connection);
        }
			
            
        var rows=[];

        var firstRow = false;
        var ret = new Object();

        var content = fs.readFileSync(connection.fileName, "utf8");
          //console.log('var content = fs.readFileSync(connection.fileName);');
         //console.log(content);
        var delim = ',';
        var numCommas = ((content.match(new RegExp(",", "g")) || []).length);
	    //console.log('numCommas = ' + numCommas);
        var numSemi = ((content.match(new RegExp(";", "g")) || []).length);
        //console.log('numSemi = ' + numSemi);
        var numColons = ((content.match(new RegExp(":", "g")) || []).length);
        //console.log('numColons = ' + numColons);
        var numPipes = ((content.match(new RegExp("[|]", "g")) || []).length);
        //console.log('numPipes = ' + numPipes);
            
        var maxDelim = numCommas;
        if (numSemi > maxDelim) {
            delim = ';';
            maxDelim = numSemi;
            };
        if (numColons > maxDelim) {
            delim = ':';
            maxDelim = numColons;
            };
        if (numPipes > maxDelim) {
            delim = '|';
            maxDelim = numPipes;
            };
          //console.log('delim = ' + delim);
                        
                        
        try {
			csv
			 .fromString(content, { headers: false, delimiter: delim })
			 .on("data", function(data){
				 //console.log(data);
				
			if (!firstRow) {
				firstRow = true;
				ret["fields"] = data;
			}

			rows.push(data);

            /*
             var workbook = XLSX.readFile(connection.fileName);
                        rows = XLSX.utils.sheet_to_json( workbook.Sheets[workbook.SheetNames[0]],{ header: 1 });
                        console.log('XL: ' + JSON.stringify(rows));


                        var maxLength = 0;
                        for (var i =0; i < rows.length; i++) {
                            if (rows[i].length > maxLength ) {
                                maxLength = rows[i].length;
                            };
                        };
                        
                        var fields = [];
                        for(var i = 0; i < maxLength; i++){
                            fields.push('' + i);
                        };
            */
                        
			//console.log("ret  = " + JSON.stringify(ret));

            //console.error('drivers[csv][get]');
            // execute a query on our database
			
			}).on("end", function(){
                 //console.log("done");

                        ret["values"] = rows;
                        callfn(ret);
               
                })
            .on('error', function(error) {
                callfn({error: 'Invalid CSV file: ' + error});
            });
        }
        catch(err) {
            //console.log('CSV error: ' + err);
            callfn({error: 'CSV error: ' + err});
        }
    

    }
}
