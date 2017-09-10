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
		setupPouchDB();
	}
}




function sendClientDetails() {
   $.ajax({
        url: '/send_client_details',
        data: {},
        success: function(data) {
            var ret = eval("(" + data + ")");
            store.dispatch('set_user_name', ret.username); 
            store.dispatch('set_is_local_machine', ret.isLocalMachine);
            store.dispatch('set_locked', ret.locked);          
          //alert(JSON.stringify(ret,null,2));
        },
        error: function(jqXHR, textStatus, errorThrown) {
          alert('error ' + textStatus + ' : ' +  errorThrown);
        }
      });
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
                      {{ option.name }}
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
                      {{ option.name }}
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

var allQueries = new Object();

function setupVRVuePane() {

    if (document.getElementById('vr_element')) {
        var vrParam = 'mouse';
        if (location.search) { 
            vrParam = location.search.split('type=')[1];
        }
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
					query_name: {type: 'string', default: ''},
                    query_saved_as: {type: 'string', default: ''},
                    query_display: {type: 'string', default: ''},
					query_size: {type: 'string', default: ''}
					},
		  init: function () {
			var self = this;
		   this.el.addEventListener('mouseenter', function (evt) {
               //alert(self.data.query_name);
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
				animation.setAttribute('dur', "200");
				//document.querySelector("#scrollable_grid").appendChild(animation);
				inMove = false;

				document.querySelector('#vr_file_name_2').setAttribute('text','font: roboto; color: black; align: left; value: ' + self.data.query_name + ' ;width: 6; ');
                
				
                document.querySelector('#vr_file_size_2').setAttribute('text','font: roboto; color: black; align: left; value: ' + self.data.query_size + ' bytes ;width: 6; ');
                
				
                document.querySelector('#vr_file_saved_as').setAttribute('text','font: roboto; color: black; align: left; value: ' + self.data.query_display + '  ;width: 6; ');



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


        
        
        
        
        
        
        
        var gotoFunction = function(options) {
                
            var goto_name = options.goto_name;
            if (store.getters.get_current_location == goto_name) {
                return;
            }
                
            var distance = options.distance;
            var duration = options.duration;
            var animEnd  = options.animEnd;
            
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
            if (animEnd) {
                animation.addEventListener('animationend', animEnd);
            };

            animation.setAttribute('dur', duration);
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

                animation2.setAttribute('dur', "500");
                animation2.setAttribute('repeat', "0");
                animation2.setAttribute('direction', "alternate");
                animation2.setAttribute('to', '' + (worldPos.x)  + ' ' + (worldPos.y ) + ' ' + ((worldPos.z + distance)));
                document.querySelector("#move_bar").appendChild(animation2);
            }
            store.dispatch('set_current_location', "goto_name");
        };

        AFRAME.registerComponent('set_zoom', {
    		  schema: {
				  people:   {type: 'string', default: 'false'},
				  distance: {type: 'number', default: 5},
				  duration: {type: 'string', default: "500"}
                 },
    		  init: function () {
                var self = this;

                this.el.addEventListener('click', function (evt) {
                    if (self.data.people) {
                        //alert('Zoom to people: ' + JSON.stringify(self.data.people,null,2));
                        store.dispatch('set_zoom_people', (self.data.people == 'true')?true:false);
                        
                    }
                });
              }
        });

        
        
        AFRAME.registerComponent('goto', {
    		  schema: {
				  name:     {type: 'string', default: 'vr_home'},
				  distance: {type: 'number', default: 5},
				  duration: {type: 'string', default: "500"}
                 },
    		  init: function () {
                var self = this;

                this.el.addEventListener('click', function (evt) {
                    var goto_name = self.data.name;
                    var distance = self.data.distance;
                    var duration = self.data.duration;
                    //alert(goto_name);
                    
                    gotoFunction({
                        goto_name:  goto_name,
                        distance:   distance,
                        duration:   duration
                    });

                    store.dispatch('hide_full_doc');
			});
    	}
    });






		AFRAME.registerComponent('log', {
		  schema: {x:  {type: 'number', default: 0},
					     y: {type: 'number', default: 0},
               queryId: {type: 'string'},
               queryFile: {type: 'string'},
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
                var queryFile = self.data.queryFile;
                

				get_query_result(self.data.queryId);
				store.dispatch('set_viewed_query_id', self.data.queryId);
                
				store.dispatch('set_viewed_query_file', self.data.queryFile);

                    gotoFunction({
                        goto_name:  "doc_details",
                        distance:   6,
                        duration:   "500"
                    });
				store.dispatch('show_full_doc');
			   inMove = false;

			});
		  }
		});

        
                
        AFRAME.registerComponent(
            'open_file', {
                schema: {
                    type: 'string'
                },
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
                    
                    var queryFile = "gsd_" + self.data;
                    this.el.addEventListener('click', function (evt) {
                        //alert(queryFile);
                        window.open("http://"+window.location.hostname + ":" + window.location.port +  '/docs/' + queryFile, '_blank');
                    });
                }
        });


        AFRAME.registerComponent(
            'goto_settings', {
                schema: {
                    type: 'string'
                },
                init: function () {
                    var self = this;
                    
                    this.el.addEventListener('click', function (evt) {
                        //alert(queryFile);
                        window.location.href = 'index_pc_mode.html';
                    });
                }
        });
        
        AFRAME.registerComponent(
            'add_data', {
                schema: {
                    type: 'string'
                },
                init: function () {
                    var self = this;
                    
                    this.el.addEventListener('click', function (evt) {
                        //alert(queryFile);
                        window.location.href = 'index_add_files.html';
                    });
                }
        });


        
        AFRAME.registerComponent(
            'jump_to', {
                schema: {
                    host: {type: 'string'},
                    port: {type: 'string'}
                },
                init: function () {
                    var self = this;
                    
                    this.el.addEventListener('click', function (evt) {
                        //alert(queryFile);
                        window.location.href = 'http://' + self.data.host + ':' + self.data.port;
                    });
                }
        });
        
        

        AFRAME.registerComponent(
            'lock_icon', {
                schema: {
                    type: 'string'
                },
                init: function () {
                    var self = document.getElementById("locked");
                    //alert('init')
                    
                    this.el.addEventListener('click', function (evt) {
                    //alert('clicked')

                      //store.dispatch('set_locked', false);
                      store.dispatch('set_locked', !store.getters.get_locked);
                         $.ajax({
                            url: '/lock',
                            dataType: 'json',
                            contentType: 'application/json',
                            data: {locked: store.getters.get_locked},
                            success: function(data) {
                                //var ret = eval("(" + data + ")");
                              //store.dispatch('set_user_name', ret.username);  
                              //alert(JSON.stringify(ret,null,2));
                            },
                            error: function(jqXHR, textStatus, errorThrown) {
                              alert('error ' + textStatus + ' : ' +  errorThrown);
                            }
                          });

                      //alert("unlocked: " + store.getters.get_locked);
                    });
                }
        });


        AFRAME.registerComponent(
            'goto_vr', {
                schema: {
                    type: 'string'
                },
                init: function () {
                    var self = this;
                    
                    this.el.addEventListener('click', function (evt) {
                        //alert(queryFile);
                        window.location.href = 'index.html?type=move';
                    });
                }
        });
        





        AFRAME.registerComponent(
            'exit_vr', {
                schema: {
                    type: 'string'
                },
                init: function () {
                    var self = this;
                    
                    this.el.addEventListener('click', function (evt) {
                        //alert(queryFile);
                        window.location.href = 'index.html?type=mouse';
                    });
                }
        });
        

		AFRAME.registerComponent('users_tab', {
            init: function () {
                var self = this;
                
                this.el.addEventListener('click', function (evt) {
                    //alert('')
					var pullout = document.getElementById("pullout_right");
                    
					var node = document.getElementById("anim_pullout_right");
					if (node) {
					  node.parentNode.removeChild(node);
					};
					var animation = document.createElement('a-animation');
					animation.setAttribute('id', "anim_pullout_right");
					animation.setAttribute('attribute', "position");
					animation.setAttribute('to', "6 1.7 -.5");
					animation.setAttribute('dur', "1000");
					animation.setAttribute('repeat', "0");
					animation.setAttribute('direction', "normal");
					pullout.appendChild(animation);
				});
            }
        });

		AFRAME.registerComponent('users_tab2', {
            init: function () {
                var self = this;
                
                this.el.addEventListener('click', function (evt) {
                    //alert('')
					var pullout = document.getElementById("pullout_right");
                    
					var node = document.getElementById("anim_pullout_right");
					if (node) {
					  node.parentNode.removeChild(node);
					};
					var animation = document.createElement('a-animation');
					animation.setAttribute('id', "anim_pullout_right");
					animation.setAttribute('attribute', "position");
					animation.setAttribute('to', "8.6 1.7 -.5");
					animation.setAttribute('dur', "1000");
					animation.setAttribute('repeat', "0");
					animation.setAttribute('direction', "normal");
					pullout.appendChild(animation);
				});
            }
        });
		
		
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
                

                gotoFunction({
                    goto_name:  "scrollable_grid",
                    distance:    4,
                    duration:   "500",
                    animEnd:     function() {store.dispatch('hide_full_doc');}
                });

                
            });
		}
    });
    
    
    function myKeyPress(e){
    var keynum;

    if(window.event) { // IE                    
      keynum = e.keyCode;
    } else if(e.which){ // Netscape/Firefox/Opera                   
      keynum = e.which;
    }

    return keynum;
  }

var showSearchResults = function() {

    gotoFunction({
        goto_name:  "scrollable_grid",
        distance:    4,
        duration:   "500",
        animEnd:     function() {store.dispatch('hide_full_doc');}
    });


    if (searchtext.length == 0) {
        store.dispatch('set_search_subtext', "");
        store.dispatch('clear_search_results');
    }
    
    if ((searchtext.length > 0) && (inSearch == false)) {
        inSearch = true;
                //alert("DO SEARCH  " )
        $.ajax({
            type: "GET",
            url: '/get_search_results',
            data: {
                search_text: searchtext
            },
            success: function(data) {
                console.log(searchtext + '=:' + data);
                
                var lor = eval('(' + data + ')');
                //alert("returned in  " + lor.duration)
                console.log('   length:' + lor.values.length);

                store.dispatch('clear_search_results');
                
                for (var i = 0; i < lor.values.length ; i++) {
                    store.dispatch('add_search_result', 
                                  {
                                    b:          lor.values[i].b});
                };
                if (lor.values.length == 0) {
                    store.dispatch('add_search_result', {b:   "No results for " + lor.search});
                    store.dispatch('set_search_subtext', '');
                    setvuexitemssearch(lor.values);
                
                } else {
                    store.dispatch('set_search_subtext', "For: '" + lor.search + "', found " +
                                lor.values.length + " values,  took " + (lor.duration / 1000) + ' seconds' );
                    setvuexitemssearch(lor.values);
                }
                inSearch = false;
            },
            error: function(jqXHR, textStatus, errorThrown) {
                store.dispatch('clear_search_results');
                store.dispatch('add_search_result',{b: "Search failed" });
                    store.dispatch('set_search_subtext', '');
                inSearch = false;
            }
        });
    } else if ((searchtext.length == 0) && (inSearch == false)) {
        recalcVuexQueries()
    };        
}

var LEFT_ARROW_KEY_CODE = 37;
var RIGHT_ARROW_KEY_CODE = 39;
var DELETE_KEY_CODE = 8;

var inSearch = false;
    window.addEventListener('keydown', function (evt) {
        var keynum = evt.keyCode ;
        
        if (keynum == LEFT_ARROW_KEY_CODE) {
            if (searchPos > 0) {
                searchPos --;
            }
        } else if (keynum == RIGHT_ARROW_KEY_CODE) {
            if (searchPos < (searchtext.length)) {
                searchPos ++;
                showText();
            }
        } else if (keynum == DELETE_KEY_CODE) {
            if (searchPos > 0) {
                searchtext =   searchtext.substring(0,searchPos - 1)  + searchtext.substring(searchPos );
                searchPos --;
                showText();
                showSearchResults();
            }                    
        }

    });

    var cursorShow = true;
    setInterval(showText,600);
    setInterval(showText2,600);
    
    
    function showText() {
        var showtext =   searchtext.substring(0,searchPos) + (cursorShow?'|':' ') + searchtext.substring(searchPos);
        
        store.dispatch('set_current_search', showtext );
    }
    function showText2() {
        cursorShow = !cursorShow;
    }
  
    window.addEventListener('keypress', function (evt) {
        
        var keynum = myKeyPress(evt);
        var cc = String.fromCharCode(keynum);
        searchtext = searchtext.substring(0,searchPos) + cc + searchtext.substring(searchPos);;
        searchPos ++;
        showText();
        showSearchResults();
    });

    }
}
var searchtext='';
var searchPos = 0;


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
// setupPouchDB
//
// Set up stuff related to data handling
//
//-----------------------------------------------------------------
function setupPouchDB() {

        db.setPouchDB(PouchDB);
        db.initPouchdb();
        var useMemory = true;
        pouchdb_connections                 = db.get_pouchdb_connections(useMemory);
        pouchdb_queries                     = db.get_pouchdb_queries(useMemory);
        pouchdb_intranet_client_connects    = db.get_pouchdb_intranet_client_connects();

        when_pouchdb_drivers_changes()
        when_pouchdb_connections_changes()
        when_pouchdb_queries_changes()

		db.pouchdbTable('pouchdb_connections', 		pouchdb_connections, 		when_pouchdb_connections_changes);
		db.pouchdbTable('pouchdb_queries', 		    pouchdb_queries, 		    when_pouchdb_queries_changes);
        
		db.pouchdbTable('pouchdb_intranet_client_connects', 		    pouchdb_intranet_client_connects, 		    null);
        
        

}





//-----------------------------------------------------------------
// read_connections
//
// Show the list of database connections
//
//-----------------------------------------------------------------
var connectionrows = new Object();


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
    sendClientDetails();
  } else if (window.system_type == 'server') {
    setupPouchDB();
  };


});








window.all = function(pouchCollection) {
	new PouchDB(pouchCollection).find(
		{ selector: 
			{_id: {$gte: null}}}).then(
				function(v){console.log(JSON.stringify(v.docs , null, 2))});
}
window.count = function(pouchCollection) {
	new PouchDB(pouchCollection).find(
		{ selector: 
			{_id: {$gte: null}}}).then(
				function(v){console.log(JSON.stringify(v.docs.length , null, 2))});
}
window.insert = function(pouchCollection, objectval) {
	new PouchDB(pouchCollection).post(objectval);
}
window.drop = function(pouchCollection) {
	var pdc = new PouchDB(pouchCollection);
	pdc.allDocs({
	  include_docs: true,
	  attachments: true
	}, function(err, response) {
	  if (err) { return console.log(err); }
	  // handle result
	  for (var i = 0 ; i < response.rows.length ; i ++) {
			var conn = response.rows[i].doc;
			//console.log(JSON.stringify(conn , null, 2));
			pdc.remove(conn);
	  };

	});
}






var in_when_pouchdb_connections_changes = false;
var callConnAgain = false;
function when_pouchdb_connections_changes() {
    if (!in_when_pouchdb_connections_changes) {
        in_when_pouchdb_connections_changes = true;
        pouchdb_connections.find({selector: {name: {$ne: null}}}, function (err, result) {
            var results = result.docs;
            //store.dispatch('clear_connections');
            for (var i = 0 ; i < results.length ; i ++) {
                var conn = results[i]
                //console.log('********* CALLED REALTIME DBCONN*************:' + JSON.stringify(conn , null, 2));
                var exists = (store.getters.connection_map[conn._id] == true);

                if (!exists) {
                    store.dispatch( 'add_connection' , {  cn:       conn.name,

                                                        cp: {       id:      conn._id
                                                                    ,
                                                                    name: conn.name
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
                                                                    size: conn.size
                                                                    ,
                                                                    password: conn.password
                                                                    ,
                                                                    connectString: conn.connectString
                                                                    ,
                                                                    fileName: conn.fileName
                                                                    ,
                                                                    hash: conn.hash
                                                                   }});
                };
            }
        });
        in_when_pouchdb_connections_changes = false;
        if (callConnAgain) {
            callConnAgain = false;
            when_pouchdb_connections_changes();
        }
    } else {
        callConnAgain = true;
    }
};



function when_pouchdb_drivers_changes() {
    store.dispatch('clear_drivers');
    $.ajax({
                type: "GET",
                url: '/get_all_drivers',
                data:   {
                        },
            success: function(results2) {
                var results = eval("(" + results2 + ")") ;
    
                //alert(JSON.stringify(results.length, null, 2) );
               //store.dispatch('clear_connections');
                for (var i = 0 ; i < results.length ; i ++) {
                    var driver  = results[i];
                    var evalede = eval(driver.code);
 
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
            }
        }
    });
};






var in_when_pouchdb_queries_changes = false;
var callQueriesAgain = false;
function recalcVuexQueries() {
    var results = Object.keys(allQueries);

        store.dispatch('clear_queries');
    //store.dispatch('clear_queries');
    console.log('********* CALLED recalcVuexQueries len:' + JSON.stringify(results.length , null, 2));
    for (var i = 0 ; i < results.length ; i ++) {
        var query = allQueries[results[i]];
        console.log('                      query *********:' + JSON.stringify(query , null, 2));
        var exists = (store.getters.query_map[query._id] == true);

        if (!exists) {
        
            store.dispatch( 'add_query' , {cn:       query.id,

                                    cp: {     id:      query.id
                                                ,
                                                name: query.name
                                                ,
                                                driver: query.driver
                                                ,
                                                size: query.size
                                                ,
                                                fileName: query.fileName
                                                ,
                                                hash: query.hash
                                                ,
                                                status: ''
                                                ,
                                                connection: query.connection
                                                ,
                                                definition: eval('(' + query.definition + ')')
                                               }});
        };
    };
};

var inupdatesearch = false;
function  setvuexitemssearch( results2 ) {
    if (!inupdatesearch) {
        inupdatesearch = true;
        
        if (results2 == null) {
            recalcVuexQueries();
            alert('all')
        }
            
        console.log('                          results2 *********:' + JSON.stringify(results2 , null, 2));
        var tt= new Object();
        for (var i = 0 ; i < results2.length ; i ++) {
            var qid = results2[i].b;
            if (!tt.hasOwnProperty(qid)) {
                tt[qid] = new Object();
                tt[qid].b = qid;
            }
        }
        console.log('                          tt *********:' + JSON.stringify(tt , null, 2));
        console.log('                          Object.keys(tt) *********:' + JSON.stringify(Object.keys(tt) , null, 2));

        var results = Object.keys(tt);

        console.log('                      results *********:' + JSON.stringify( results , null, 2));


        store.dispatch('clear_queries');
        for (var i = 0 ; i < results.length ; i ++) {
            //console.log('                          queries *********:' + JSON.stringify(allQueries , null, 2));
            var query = allQueries[results[i]];
            console.log('                          query *********:' + JSON.stringify(query , null, 2));
            var exists = false;//!(!store.getters.query_map[query.id]);

            if (!exists) {
                store.dispatch( 'add_query' , {cn:       query.id,

                                        cp: {     id:      query.id
                                                    ,
                                                    name: query.name
                                                    ,
                                                    driver: query.driver
                                                    ,
                                                    size: query.size
                                                    ,
                                                    fileName: query.fileName
                                                    ,
                                                    hash: query.hash
                                                    ,
                                                    status: ''
                                                    ,
                                                    connection: query.connection
                                                    ,
                                                    definition: eval('(' + query.definition + ')')
                                                   }});
            };
        };
        
            inupdatesearch = false;
    }
}

function when_pouchdb_queries_changes() {
    if (!in_when_pouchdb_queries_changes) {
        in_when_pouchdb_queries_changes = true;
        pouchdb_queries.find({selector: {name: {$ne: null}}},function (err, result) {
            var results = result.docs;

            //store.dispatch('clear_queries');
            console.log('********* CALLED REALTIME DBCONN len:' + JSON.stringify(results.length , null, 2));
            for (var i = 0 ; i < results.length ; i ++) {
                var query = results[i]
                //console.log('********* CALLED REALTIME DBCONN*************:' + JSON.stringify(conn , null, 2));
                var exists = !(!allQueries[query._id]);

                if (!exists) {
                
                    allQueries[query._id] =  {     id:      query._id
                                                        ,
                                                        name: query.name
                                                        ,
                                                        driver: query.driver
                                                        ,
                                                        size: query.size
                                                        ,
                                                        fileName: query.fileName
                                                        ,
                                                        hash: query.hash
                                                        ,
                                                        status: ''
                                                        ,
                                                        connection: query.connection
                                                        ,
                                                        definition: query.definition
                                                       };
                };
            };
            recalcVuexQueries();
        });
        in_when_pouchdb_queries_changes = false;
        if (callQueriesAgain) {
            callQueriesAgain = false;
            when_pouchdb_queries_changes();
        }
    } else {
        callQueriesAgain = true;
    }
};

var inCheckForServers = 0;

    var checkHostForServer = function(host, tt) {
        var  blocked  =  '';
        inCheckForServers ++;
        $.ajax({
            type: "GET",
            url: "http://" + host + '/test_firewall',
            data: {
                tracking_id: '7698698768768', //generate a random number here
                server:      host
            },
            success: function(data) {
                //console.log("host:  "       + JSON.stringify(host,null,2) );
                //alert(JSON.stringify(data,null,2));
                var intranetGoShareDataHost = eval( "(" + data + ")").server;
                var intranetGoShareDataHostUserName = eval( "(" + data + ")").username;
                var locked = eval( "(" + data + ")").locked;
                tt.locked = locked;
                tt.accessable = true;
                inCheckForServers --;
                store.dispatch('add_network', tt);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                //console.log("host:  "       + JSON.stringify(host,null,2) );
                //alert(JSON.stringify(data,null,2));
                var intranetGoShareDataHost = host;
                var quotedIntranetGoShareDataHost =  '"' + intranetGoShareDataHost + '"';
                blocked = '<div style="color: red; PADDING: 5PX;">(probably behind a firewall)</div>';
                var newHtml =  "<div>" +
                            "<div> " + intranetGoShareDataHost + "</div> </div>";
                var newid = intranetGoShareDataHost.replace(":",".").replaceAll(".","_");
                //console.log("newid: " + JSON.stringify(newid,null,2) + " = " + newHtml);
                
                inCheckForServers --;
                tt.locked = true;
                tt.accessable = false;
                store.dispatch('add_network', tt);
            }
        });
    }

    
    var checkServersFromClient = function() {
        if (inCheckForServers > 0) {
            return;
        }
        $.ajax({
            type: "GET",
            url: 'http://gosharedata.com/get_intranet_servers',
            success: function(data1) {
                var returned= eval( "(" + data1 + ")");
                store.dispatch('clear_network', tt);  
                for (var i = 0 ; i < returned.allServers.length; i++) {
                    //console.log('got server ' + i)
                    //console.log(JSON.stringify(returned.allServers[i],null,2))
                    var tt = new Object();
                    tt.username = returned.allServers[i].client_user_name;
                    tt.internal_host = returned.allServers[i].internal_host;
                    tt.internal_port = returned.allServers[i].internal_port;
                    tt.via           = returned.allServers[i].via;
                    //alert(tt.username)

                    var intranetGoShareDataHost = returned.allServers[i].internal_host + ":" + returned.allServers[i].internal_port;                    
                    checkHostForServer(intranetGoShareDataHost, tt);
                };
                
            },
            error: function(jqXHR, textStatus, errorThrown) {
                    console.log('error getting servers: ' + errorThrown)
            }
        });
        };
    
    setTimeout(checkServersFromClient,800);
    setInterval(checkServersFromClient,4000);