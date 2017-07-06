import Vue                      from 'vue'
import Welcome                  from './components/Welcome.vue'
import FileBrowser              from './components/FileBrowser.vue'
import VR                       from './components/VR.vue'
import ConnectedClients         from './components/central_server/connected_clients.vue'
import yazz_new_connection      from './components/yazz_new_connection.vue'
import connections_table        from './components/connections_table.vue'
import queries_table            from './components/queries_table.vue'
import output_table             from './components/output_table.vue'
import drivers_table            from './components/drivers_table.vue'
import store                    from './store.js'
import db                       from '../public/dbhelper.js'

Vue.component('FileBrowser',FileBrowser);


const gun_ip_address = '10.6.88.27'

window.vue = Vue;

function initWelcomeVuePane() {
    if (document.getElementById('welcome')) {
        //console.log(' Welcome pane exists');
        new Vue({
          el: '#welcome'
          ,
          template: `<welcome-component></welcome-component>`
          ,
          components: {'welcome-component': Welcome}
        });

    }
    if (document.getElementById('welcome')) {
        //console.log(' Welcome pane still exists');
    } else {
        //console.log(' Welcome pane does not exist anymore. Vue.js destroyed it with new Vue(...)');
    }
	if (window.system_type == 'client') {
		setupGunDB();
	}
}










function setupSqlVuePane() {

    if (document.getElementById('select_source_parent')) {
        new Vue({
          el: '#select_source_parent'
          ,
          store: store
          ,
          template: `
                <select id=select_source>
                  <option v-for="option in options" v-bind:value="option.id">
                      {{ option.id }}
                  </option>
                </select>
        `
          ,
          computed: {
            options: function () {
              return this.$store.state.list_of_connections;
            }
          }
          ,
          components: {
							'connections-table': connections_table,
							'queries-table': queries_table
							}
        });
    }


    if (document.getElementById('select_query_source')) {
        new Vue({
          el: '#select_query_source'
          ,
          store: store
          ,
          template: `
                <select id=select_query>
                  <option v-for="option in options" v-bind:value="option.id">
                      {{ option.id }}
                  </option>
                </select>
        `
          ,
          computed: {
            options: function () {
              return this.$store.state.list_of_queries;
            }
          }
        });
    }

}




var moveToX = 0;
var moveToY = 0;

var useX = 0;
var useY = 0;

var inMove = false;

function setupVRVuePane() {

    if (document.getElementById('vr_element')) {
		 var vrParam = location.search.split('type=')[1];
		 //alert(vrParam);

        new Vue({
          el: '#vr_element'
          ,
          store: store
          ,
          template: `
                <VR :vr_type=vrType>
                </VR>
        `
          ,
          computed: {
            options: function () {
              return this.$store.state.list_of_connections;
            },
			vrType: function() {
				return vrParam;
			}
          }
          ,
          components: {'VR': VR}
        });

		AFRAME.registerComponent('preview', {
		    schema: {	id: {type: 'string', default: ''}}
			,
		    init: function () {
			    var self = this;
		        this.el.addEventListener('mouseenter', function (evt) {
				   if (inMove) {
					   return;
				   };
			        var lll = store.state.list_of_queries.length;
				    for (var i = 0 ; i < lll ; i ++) {
						var query = store.state.list_of_queries[i];
					    if (query.id == self.data.id) {
						    if (query.preview) {
							    setOutputData(query.preview);
								//alert(JSON.stringify(query.preview , null, 2));
							};
							return;
						};
					}
			   });
		    }
		});

		AFRAME.registerComponent('griditem', {
		  schema: {	x:  {type: 'number', default: 0},
					y: {type: 'number', default: 0},
					query_name: {type: 'string', default: ''}
					},
		  init: function () {
			var self = this;
		   this.el.addEventListener('mouseenter', function (evt) {
			   if (inMove) {
				   return;
			   };
			   inMove = true;
				var posX = 0;
				var posY = 0;

				//alert('x: ' + self.data.x + ', useX: ' + useX);
				//alert('y: ' + self.data.y + ', useY: ' + useY);
				if (self.data.x < 1) {
					useX = 0;
				} else if (self.data.x > useX) {
					useX = useX + 1;
				} else if (self.data.x < useX) {
					useX = useX - 1;
				};
				posX = -(useX * 0.5);

				if (self.data.y < 1) {
					useY = 0;
				} else if (self.data.y > useY) {
					useY = useY + 1;
				} else if (self.data.y < useY) {
					useY = useY - 1;
				};
				posY = (useY * 0.6);

				var newpos = posX + ' ' + posY + ' 0';


				var node = document.getElementById("animscroll");
				if (node) {
				  node.parentNode.removeChild(node);
				};


				//alert(newpos);
				//document.querySelector("#scrollable_grid").setAttribute('position', {x: self.data.x, y: self.data.y, z: 0 });
				var animation = document.createElement('a-animation');
				animation.setAttribute('id', "animscroll");
				animation.setAttribute('attribute', "position");
				animation.setAttribute('to', newpos);
				animation.setAttribute('dur', "2000");
				//document.querySelector("#scrollable_grid").appendChild(animation);
				inMove = false;

				document.querySelector('#vr_file_name').setAttribute('text','font: roboto; color: black; align: left; value: ' + self.data.query_name + ' ; width: 4; ');



			});
		  }
		});



		AFRAME.registerComponent('openquerynativeapp', {
			schema: {type: 'string'},
			init: function () {
				var self = this;
				var stringToLog = this.data;
				this.el.addEventListener('click', function (evt) {
					//alert('open: ' + stringToLog);
					//alert(stringToLog);
					open_query_in_native_app(stringToLog);
					//alert(stringToLog + ' was clicked at: ', evt.detail.intersection.point);
					//alert(stringToLog + ' was clicked with: ' + document.getElementById("sqlinput"));
				});
        this.el.addEventListener('mouseenter', function (evt) {
					var node = document.getElementById("animopenclick");
					if (node) {
					  node.parentNode.removeChild(node);
					};
					var animation = document.createElement('a-animation');
					animation.setAttribute('id', "animopenclick");
					animation.setAttribute('attribute', "rotation");
					animation.setAttribute('to', "00 0 90");
					animation.setAttribute('dur', "500");
					animation.setAttribute('repeat', "0");
					animation.setAttribute('direction', "alternate");
					self.el.appendChild(animation);
				});
        this.el.addEventListener('mouseleave', function (evt) {
					var node = document.getElementById("animopenclick");
					if (node) {
					  node.parentNode.removeChild(node);
					};
					var animation = document.createElement('a-animation');
					animation.setAttribute('id', "animopenclick");
					animation.setAttribute('attribute', "rotation");
					animation.setAttribute('to', "00 0 0");
					animation.setAttribute('dur', "500");
					animation.setAttribute('repeat', "0");
					animation.setAttribute('direction', "alternate");
					self.el.appendChild(animation);
				});
			}
		});




    		AFRAME.registerComponent('goto', {
    		  schema: {
				  name:     {type: 'string', default: 'vr_home'},
				  distance: {type: 'number', default: 5}
                 },
    		  init: function () {
            var self = this;

    		   this.el.addEventListener('click', function (evt) {
             var goto_name = self.data.name;
             var distance = self.data.distance;
             //alert(goto_name);

              var worldPos = new THREE.Vector3();
              var goto_item = document.querySelector("#" + goto_name);
              worldPos.setFromMatrixPosition(goto_item.object3D.matrixWorld);
            var node = document.getElementById("itemzoom");
            if (node) {
              node.parentNode.removeChild(node);
            };
            var animation = document.createElement('a-animation');
            animation.setAttribute('id', "itemzoom");
            animation.setAttribute('attribute', "position");

            animation.setAttribute('dur', "5000");
            animation.setAttribute('repeat', "0");
            animation.setAttribute('direction', "alternate");
    //        self.el.appendChild(animation);
            if (document.querySelector("#camera_id")){
                animation.setAttribute('to', '' + (worldPos.x)  + ' ' + (worldPos.y) + ' ' + ((worldPos.z + distance)));
                document.querySelector("#camera_id").appendChild(animation);
            }
            if (document.querySelector("#movevr")){
                animation.setAttribute('to', '' + (worldPos.x)  + ' ' + (worldPos.y ) + ' ' + ((worldPos.z + distance)));
                document.querySelector("#movevr").appendChild(animation);
            }

if (document.querySelector("#move_bar")) {
            var animation2 = document.createElement('a-animation');
            animation2.setAttribute('id', "itemzoom");
            animation2.setAttribute('attribute', "position");

            animation2.setAttribute('dur', "5000");
            animation2.setAttribute('repeat', "0");
            animation2.setAttribute('direction', "alternate");
                animation2.setAttribute('to', '' + (worldPos.x)  + ' ' + (worldPos.y ) + ' ' + ((worldPos.z + distance)));
	document.querySelector("#move_bar").appendChild(animation2);
}
				store.dispatch('hide_full_doc');


			});
    		  }
    		});






		AFRAME.registerComponent('log', {
		  schema: {x:  {type: 'number', default: 0},
					     y: {type: 'number', default: 0},
               queryId: {type: 'string'}
             },
		  init: function () {
        var self = this;

			var stringToLog = this.data;
		   this.el.addEventListener('click', function (evt) {
			   if (inMove) {
				   return;
			   };
			   inMove = true;
         var x = self.data.x;
         var y = self.data.y;
		 
		 var doc_details = document.querySelector("#doc_details");

          var worldPos = new THREE.Vector3();
          worldPos.setFromMatrixPosition(doc_details.object3D.matrixWorld);
          //alert(worldPos.x);
         //alert('x: ' +self.data.x);
         //alert('y: ' +self.data.y);
         //alert('*: ' +self.data.queryId);
			    //alert(stringToLog);

				get_query_result(self.data.queryId);
				store.dispatch('set_viewed_query_id', self.data.queryId);

				//alert(stringToLog + ' was clicked at: ', evt.detail.intersection.point);
				//alert(stringToLog + ' was clicked with: ' + document.getElementById("sqlinput"));

        var node = document.getElementById("itemzoom");
        if (node) {
          node.parentNode.removeChild(node);
        };
        var animation = document.createElement('a-animation');
        animation.setAttribute('id', "itemzoom");
        animation.setAttribute('attribute', "position");
        //animation.setAttribute('to', '' + (-2.2 + (x * 0.5)) + ' ' + (3 - (y * 0.6)) +  '-.1');
        //animation.setAttribute('to', '0.6 0 -2.5');


        animation.setAttribute('dur', "5000");
        animation.setAttribute('repeat', "0");
        animation.setAttribute('direction', "alternate");
		animation.addEventListener('animationend', function () {
				store.dispatch('show_full_doc');
			   inMove = false;
		});
//        self.el.appendChild(animation);
        if (document.querySelector("#camera_id")){
            animation.setAttribute('to', '' + (worldPos.x)  + ' ' + ((worldPos.y)) + ' ' + ((worldPos.z + 6)));
            document.querySelector("#camera_id").appendChild(animation);
        }
        if (document.querySelector("#movevr")){
            animation.setAttribute('to', '' + (worldPos.x)  + ' ' + (worldPos.y ) + ' ' + ((worldPos.z + 4)));
            document.querySelector("#movevr").appendChild(animation);
        }
if (document.querySelector("#move_bar")) {
	var animation2 = document.createElement('a-animation');
	animation2.setAttribute('id', "itemzoom");
	animation2.setAttribute('attribute', "position");

	animation2.setAttribute('dur', "5000");
	animation2.setAttribute('repeat', "0");
	animation2.setAttribute('direction', "alternate");
		animation2.setAttribute('to', '' + (worldPos.x)  + ' ' + (worldPos.y ) + ' ' + ((worldPos.z + 4)));
	document.querySelector("#move_bar").appendChild(animation2);
}

			});
		  }
		});

				AFRAME.registerComponent('go_back', {
		  init: function () {
			   var self = this;
         this.el.addEventListener('click', function (evt) {
window.history.go(-1);
		 });
				}});

		
		
		AFRAME.registerComponent('closedoc', {
		  init: function () {
			   var self = this;

         this.el.addEventListener('mouseenter', function (evt) {
					var node = document.getElementById("animscrollclose");
					if (node) {
					  node.parentNode.removeChild(node);
					};
					var animation = document.createElement('a-animation');
					animation.setAttribute('id', "animscrollclose");
					animation.setAttribute('attribute', "rotation");
					animation.setAttribute('to', "0 0 90");
					animation.setAttribute('dur', "500");
					animation.setAttribute('repeat', "0");
					animation.setAttribute('direction', "alternate");
					self.el.appendChild(animation);
				});
        this.el.addEventListener('mouseleave', function (evt) {
         var node = document.getElementById("animscrollclose");
         if (node) {
           node.parentNode.removeChild(node);
         };
         var animation = document.createElement('a-animation');
         animation.setAttribute('id', "animscrollclose");
         animation.setAttribute('attribute', "rotation");
         animation.setAttribute('to', "0 0 0");
         animation.setAttribute('dur', "500");
         animation.setAttribute('repeat', "0");
         animation.setAttribute('direction', "alternate");
         self.el.appendChild(animation);
       });
			   this.el.addEventListener('click', function (evt) {
					store.dispatch('hide_full_doc');
				//
				var scrollable_grid = document.querySelector("#scrollable_grid");

          var worldPos = new THREE.Vector3();
          worldPos.setFromMatrixPosition(scrollable_grid.object3D.matrixWorld);
        var node = document.getElementById("itemback");
        if (node) {
          node.parentNode.removeChild(node);
        };
        var animation = document.createElement('a-animation');
        animation.setAttribute('id', "itemback");
        animation.setAttribute('attribute', "position");
        animation.setAttribute('dur', "5000");
        animation.setAttribute('repeat', "0");
        animation.setAttribute('direction', "alternate");
        if (document.querySelector("#camera_id")){
            animation.setAttribute('to', '' + (worldPos.x)  + ' ' + ((worldPos.y)) + ' ' + ((worldPos.z + 4)));
            document.querySelector("#camera_id").appendChild(animation);
        }
		        if (document.querySelector("#movevr")){
            animation.setAttribute('to', '' + (worldPos.x)  + ' ' + (worldPos.y ) + ' ' + ((worldPos.z + 4)));
            document.querySelector("#movevr").appendChild(animation);
        }
		
		});
				
				
				

		
		  }
		});

    }
}




function setupSqlResultPane() {

    if (document.getElementById('vue_db_result')) {
        new Vue({
          el: '#vue_db_result'
          ,
          store: store
          ,
          template: `
                <div>
				    <output-table></output-table>
                </div>
        `
          ,
          computed: {
            options: function () {
              return this.$store.state.list_of_connections;
            }
          }
          ,
          components: {'output-table': output_table}
        });
    }

    if (document.getElementById('vue_db_query_result')) {
        new Vue({
          el: '#vue_db_query_result'
          ,
          store: store
          ,
          template: `
                <div>
				    <output-table></output-table>
                </div>
        `
          ,
          components: {'output-table': output_table}
        });
    }
}









//-----------------------------------------------------------------
// setupGunDB
//
// Set up stuff related to data handling
//
//-----------------------------------------------------------------
function setupGunDB() {
			//alert('gun' );

        if (location.port == '8080') {
            gun = Gun( ['http://' + gun_ip_address + '/gun']);
        } else { // we are on port 80
            gun = Gun( ['http://' + location.host + '/gun']);
        };




        gun.get('network_data2').on(function(data,id) {
            if (document.getElementById('mainid2')) {
                document.getElementById('mainid2').innerHTML = JSON.stringify(data.value , null, 2)
            }},false);



        //localStorage.clear();

        db.setGunDB(gun)
        db.setGunDBClass(Gun)
        db.setSqlParseFn(parseSql)
        db.start()
        //db.sql("INSERT INTO Customers (CustomerName, ContactName, Address, City, PostalCode, Country)\n VALUES ('Cardinal','Tom B. Erichsen','Skagen 21','Stavanger','4006','Norway')")
        //db.sql("SELECT age, name FROM Customers");
        //db.realtimeSql("SELECT * FROM Customers where Age > 5"
        //  ,function(results) {console.log('********* CALLED REALTIME *************:' + results);}
        //);



        realtimeSql("SELECT * FROM queries where deleted != 'T'"
          ,function(results) {
              //alert('SELECT * FROM db_connections')
                              //console.log('********* CALLED REALTIME DBCONN*************:' + JSON.stringify(results[0] , null, 2));
                              store.dispatch('clear_queries');
                              //console.log('********* CALLED REALTIME DBCONN len:' + JSON.stringify(results.length , null, 2));
                              for (var i = 0 ; i < results.length ; i ++) {
                                  var query = results[i]
                                  //console.log('********* CALLED REALTIME DBCONN*************:' + JSON.stringify(conn , null, 2));
                                  store.dispatch( 'add_query' , {cn:       query.name,

                                                                      cp: {     id:      query.name
                                                                                ,
                                                                                driver: query.driver
                                                                                ,
                                                                                status: ''
                                                                                ,
                                                                                connection: query.connection
																				,
																				definition: eval('(' + query.definition + ')')
																				,
																				preview: eval('(' + query.preview + ')')
                                                                               }});
                              };
           }
        );


        realtimeSql("SELECT * FROM db_connections where deleted != 'T'"
          ,function(results) {
              //alert('SELECT * FROM db_connections')
                              //console.log('********* CALLED REALTIME DBCONN*************:' + JSON.stringify(results[0] , null, 2));
                              store.dispatch('clear_connections');
                              //console.log('********* CALLED REALTIME DBCONN len:' + JSON.stringify(results.length , null, 2));
                              for (var i = 0 ; i < results.length ; i ++) {
                                  var conn = results[i]
                                  //console.log('********* CALLED REALTIME DBCONN*************:' + JSON.stringify(conn , null, 2));
                                  store.dispatch( 'add_connection' , {cn:       conn.name,

                                                                      cp: {     id:      conn.name
                                                                                ,
                                                                                driver: conn.driver
                                                                                ,
                                                                                status: ''
                                                                                ,
                                                                                database: conn.database
                                                                                ,
                                                                                host: conn.host
                                                                                ,
                                                                                port: conn.port
                                                                                ,
                                                                                user: conn.user
                                                                                ,
                                                                                password: conn.password
                                                                                ,
                                                                                connectString: conn.connectString
                                                                                ,
                                                                                fileName: conn.fileName
                                                                                ,
                                                                                preview: conn.preview
                                                                               }});
                              };
           }
        );




        // ------------------------------------------------------------------
        //  Update the drivers in the UI
        // ------------------------------------------------------------------
        realtimeSql(
            "SELECT * FROM drivers where deleted != 'T'"
            ,
            function(results) {
                store.dispatch('clear_drivers');
                for (var i = 0 ; i < results.length ; i ++) {
                    var driver  = results[i];
                    //console.log('********* CALLED REALTIME DBCONN*************:' + JSON.stringify(driver.name , null, 2));
                    var evalede = eval(driver.code);

                    //console.log('********* CALLED REALTIME DBCONN*************:' + JSON.stringify(conn , null, 2));

                    store.dispatch(
                        'add_driver'
                        ,
                         {
                             cn: driver.name
                             ,
                             cp: {
									 id:      driver.name,
									 type:    driver.driver_type,
									 code:    driver.code
                                  }
                          });



					 if (evalede.vue)
					 {
						 Vue.component( driver.name + '-view-connection' , evalede.vue );
					 };

					 if (evalede.vue_add) {
						Vue.component(driver.name + '-add-connection', evalede.vue_add);
					 };

					 if (evalede.vue_add_query) {
						Vue.component(driver.name + '-add-query', evalede.vue_add_query);
					 };

					 if (evalede.vue_view_query) {
						Vue.component(driver.name + '-view-query', evalede.vue_view_query);
					 };



                  };
            }
        );










        sql("select * from globals where id = 'network_test'",
          function(res) {
              if (res.length == 0) {
                  sql("insert into globals (id, value) values ('network_test','')")
              }
          })

          realtimeSql("SELECT * FROM globals where id = 'network_test'"
            ,function(results) {
                if (results[0]) {
                    //document.getElementById('maininput').value = results[0].value
					if (document.getElementById('mainid')) {
						document.getElementById('mainid').innerHTML = results[0].value
					}
                }
            })

}

export function inccc(){
    gun.get('default').path('connections_changed').val(function(v){
          gun.get('default').path('connections_changed').put({value: v.value + 1});
    },true);
}





//-----------------------------------------------------------------
// read_connections
//
// Show the list of database connections
//
//-----------------------------------------------------------------
var connectionrows = new Object();
function read_connections(a,b){
    delete a["_"];
    if (!connectionrows[a.id]) {
        if (!a.deleted) {
            data_connections_list.push(a);
            connectionrows[a.id] = a;
            //console.log("deleted: " + a.deleted);
            store.dispatch('add_connection', {cn: a.id, cp: a})
        }
    }
}

//store.dispatch('set_output_records', data);
window.setOutputData = function(data) {
	if (data) {
		//alert(JSON.stringify(data));
		if( Object.prototype.toString.call( data ) === '[object Array]' ) {
			if (data.length > 0) {
				var fields = Object.keys(data[0]);
				store.dispatch('set_output_fields', fields);
				//alert(fields);
				store.dispatch('set_output_records', data);
			}
			else
			{
				store.dispatch('set_output_fields', []);
				store.dispatch('set_output_records', []);
			}
		}
		else
		{
			if (data.error)
			{
				store.dispatch('set_output_fields', ['Error in getting data']);
				store.dispatch('set_output_records', [{'Error in getting data': data.error}]);
			}
			else if (data.values.length > 0) {
				var fields = [];
				if (data.fields) {
					fields = data.fields;
				}
				else
				{
					fields = Object.keys(data.values[0]);
				}
				store.dispatch('set_output_fields', fields);
				if( Object.prototype.toString.call( data.values ) === '[object Array]' ) {
					var output = [];
					for(var i = 0; i < data.values.length; i++){
						var row = new Object();
						for(var j = 0; j < fields.length; j++){
							row[fields[j]] = data.values[i][j];
						}
						output.push(row);
					}
					store.dispatch('set_output_records', output);
				} else {
					store.dispatch('set_output_records', data.values);
				};
			}
			else
			{
				store.dispatch('set_output_fields', []);
				store.dispatch('set_output_records', []);
			}
		}
	}
};

//-----------------------------------------------------------------
// initConnectionsListVuePane
//
// Show the list of database connections
//
//-----------------------------------------------------------------
function initConnectionsListVuePane() {

    if (document.getElementById('connections_window')) {

          new Vue({
                el: '#connections_window'
                ,
                computed: {
                  count: function () {
                    return this.$store.state.count
                  }
                }
                ,
                methods: {
                }
                ,
                store: store
                ,
                components: {
                             'connections-table':      connections_table}
                });
                }
}



//-----------------------------------------------------------------
// initQueriesListVuePane
//
// Show the list of queries
//
//-----------------------------------------------------------------
function initQueriesListVuePane() {

    if (document.getElementById('queries_window')) {

          new Vue({
                el: '#queries_window'
                ,
                computed: {
                  count: function () {
                    return this.$store.state.count
                  }
                }
                ,
                methods: {
                }
                ,
                store: store
                ,
                components: {
                             'queries-table':      queries_table}
                });
                }
}







//-----------------------------------------------------------------
// initConnectionsListVuePane
//
// Show the list of database connections
//
//-----------------------------------------------------------------
function initDriversListVuePane() {

    if (document.getElementById('drivers_window')) {

          new Vue({
                el: '#drivers_window'
                ,
                computed: {
                  count: function () {
                    return this.$store.state.count
                  }
                }
                ,
                methods: {
                }
                ,
                store: store
                ,
                components: {
                             'drivers-table':          drivers_table}
                });
                }
}



//-----------------------------------------------------------------
// initClientsConnectedVuePane
//
// not sure what this does
//
//-----------------------------------------------------------------
function initClientsConnectedVuePane() {

    if (document.getElementById('clients_connected')) {

        new Vue({
          el: '#clients_connected'
          ,
          template: `<app></app>`
          ,
          store: store
          ,
          components: {app: ConnectedClients}
        });
    }
}









//-----------------------------------------------------------------
// This is called when the web page has loaded
//
//
//
//-----------------------------------------------------------------
$( document ).ready(function() {

  //console.log( "****ready now!" + window.system_type);
  if (window.system_type == 'client') {
    initWelcomeVuePane();
    setupSqlVuePane();
	setupVRVuePane();
    initConnectionsListVuePane();
    initQueriesListVuePane();
    initDriversListVuePane();
    initClientsConnectedVuePane();
    setupSqlResultPane();
  } else if (window.system_type == 'server') {
    setupGunDB();
  };

  /*sql('insert into clienttable2 (id, next) values (3,"fdg")',
      function(record) {
          console.log('record:' + record)
      })

  sql('select * from clienttable2',
      function(record) {
          console.log('record:' + JSON.stringify(record) )
      })*/

});






//-----------------------------------------------------------------
// This is code to give a SQL interface in the browser
//
//
//
//-----------------------------------------------------------------
window.sql = function(sql, p2, p3, p4) {
    return db.sql(sql, p2, p3, p4);
}
window.sql1 = function(sql, p2, p3, p4) {
    return db.sql1(sql, p2, p3, p4);
}
window.autoIndexSerialId = function() {
    return db.autoIndexSerialId();
}


window.realtimeSql = function(sql, callBackFn, schema) {
    return db.realtimeSql(sql, callBackFn, schema);
}
