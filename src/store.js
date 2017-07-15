import Vue from 'vue'
import Vuex from 'vuex'
import db                       from '../public/dbhelper.js'

Vue.use(Vuex)



export default new Vuex.Store({


    state: {
        add_connection_visible: false
        ,
        show_full_doc: false
        ,
        add_query_visible: false
        ,
        add_driver_visible: false
        ,
        list_of_connections: []
        ,
        list_of_queries: []
        ,
        list_of_drivers: []
        ,
        list_of_output_fields: []
        ,
        list_of_output_records: []
        ,
        viewed_connection_id: null
        ,
        viewed_driver_id: null
        ,
        viewed_connection_driver: null
        ,
        viewed_query_id: null
        ,
        viewed_query_connection_driver: null
		,
        viewed_query_connection: null
		,
        central_server_client_connected: false
        ,
        central_server_client_internal_ip_address: ""
        ,
        central_server_client_internal_port: -1
        ,
        central_server_client_public_ip_address: ""
        ,
        central_server_client_public_port: -1
    },






  getters: {
    add_connection_visible: state => state.add_connection_visible
    ,
    add_query_visible: state => state.add_query_visible
    ,
    list_of_connections: state => state.list_of_connections
    ,
    list_of_queries: state => state.list_of_queries
    ,
    list_of_drivers: state => state.list_of_drivers
    ,
    list_of_output_fields: state => state.list_of_output_fields
    ,
    list_of_output_drivers: state => state.list_of_output_drivers
    ,
    viewed_connection_id: state => state.viewed_connection_id
    ,
    viewed_query_id: state => state.viewed_query_id
    ,
    viewed_connection_driver: state => state.viewed_connection_driver
    ,
    viewed_connection_driver: state => state.viewed_query_connection
    ,
    central_server_client_connected: state => state.central_server_client_connected
    ,
    central_server_client_internal_ip_address: state => state.central_server_client_internal_ip_address
    ,
    central_server_client_internal_port: state => state.central_server_client_internal_port
    ,
    central_server_client_public_ip_address: state => state.central_server_client_public_ip_address
    ,
    central_server_client_public_port: state => state.central_server_client_public_port

  },







  //-------------------------------------------------------------------
  //                           CHANGE THE STATE
  //
  // This contains the things that change the Vue.js VUEX applicaiton
  // state
  //
  //
  //
  //
  //-------------------------------------------------------------------
  mutations: {
      ADD_CONNECTION: function (state, connection) {
        state.list_of_connections.push(connection.cp);
      },
      ADD_QUERY: function (state, query) {
        state.list_of_queries.push(query.cp);
      },
      ADD_DRIVER: function (state, driver) {
        state.list_of_drivers.push(driver.cp);
      },
      CLEAR_CONNECTIONS: function (state) {
        state.list_of_connections = [];
      },
      CLEAR_QUERIES: function (state) {
        state.list_of_queries = [];
      },
      CLEAR_DRIVERS: function (state) {
        state.list_of_drivers = [];
      },
      SHOW_FULL_DOC: function (state) {
        state.show_full_doc = true;
      },
      HIDE_FULL_DOC: function (state) {
        state.show_full_doc = false;
      },
      HIDE_ADD_CONNECTION: function (state) {
        state.add_connection_visible = false
      },
      HIDE_ADD_QUERY: function (state) {
        state.add_query_visible = false
      },
      HIDE_ADD_DRIVER: function (state) {
        state.add_driver_visible = false
      },
    SET_VIEWED_CONNECTION: function (state, connection) {
      if (connection) {
        state.viewed_connection_id   = connection.id;
        state.viewed_connection_driver = connection.driver;
      } else {
        state.viewed_connection_id   = null;
        state.viewed_connection_driver = null;
      }
    },
    SET_VIEWED_QUERY: function (state, query) {
      if (query) {
        state.viewed_query_id                = query.id;
        state.viewed_query_connection_driver = query.driver;
        state.viewed_query_connection        = query.connection;
      } else {
        state.viewed_query_id                = null;
        state.viewed_query_connection_driver = null;
        state.viewed_query_connection        = null;
      }
    },
    SET_VIEWED_QUERY_ID: function (state, query) {
        state.viewed_query_id                = query;
    },
    SET_VIEWED_DRIVER: function (state, driver) {
      if (driver) {
        state.viewed_driver_id   = driver.id;
      } else {
        state.viewed_driver_id   = null;
      }
    },
    SET_OUTPUT_FIELDS: function (state, fields) {
        state.list_of_output_fields = fields;
    },
    SET_OUTPUT_RECORDS: function (state, records) {
        state.list_of_output_records = records;
    },
    SHOW_ADD_CONNECTION: function (state) {
      state.add_connection_visible = true
    },
    SHOW_ADD_QUERY: function (state) {
      state.add_query_visible = true
    }
  },









	//-------------------------------------------------------------------
	//                     PERFORM ACTIONS IN THE APPLICATION
	//
	// This contains the things that change the whole applicaiton
	//
	//
	// This can change both the Vue.js state and external things, like
	// HTTP requests, database code, etc
	//
	//-------------------------------------------------------------------
	actions: {

		//
		// add_connection
		//
		add_connection: function(a, connection){
		  a.commit('ADD_CONNECTION', connection)
		},



		//
		// add_query
		//
		add_query: function(a, query){
		  a.commit('ADD_QUERY', query)
		},



		//
		// add driver
		//
		add_driver: function(a, driver){
		  a.commit('ADD_DRIVER', driver)
		  //console.log(JSON.stringify(connection.cp));
		},



		//
		// add_new_connection
		//
		add_new_connection: function(a, connection){
			//console.log(JSON.stringify(connection));
			pouchdb_connections.post(
				{
					  name: 			connection.cn
					  ,
					  driver:			connection.cp.driver
					  ,
					  database:			connection.cp.database
					  ,
					  host:				connection.cp.host
					  ,
					  port:				connection.cp.port
					  ,
					  connectString:	connection.cp.connectString
					  ,
					  user:				connection.cp.user
					  ,
					  password:			connection.cp.password
					  ,
					  fileName:			connection.cp.fileName
					  ,
					  preview:			connection.cp.preview
				}
			);
		},

	
	
		//
		// add new query
		//
		add_new_query: function(a, query){
            //alert('new query: ' + JSON.stringify(query));;
			pouchdb_queries.post(
				{
                      name:         query.cp.name
                      ,
                      connection:   query.cp.connection
                      ,
                      driver:       query.cp.driver
                      ,
                      definition:   query.cp.definition
                      ,
                      status:       query.cp.status
				}
			);
                        
    },

	

		//
		// clear_connections
		//
		clear_connections: function(a){
		  a.commit('CLEAR_CONNECTIONS')
		}
		,



		//
		// clear_queries
		//
		clear_queries: function(a){
		  a.commit('CLEAR_QUERIES')
		}
		,




		//
		// clear_drivers
		//
		//
		//
		clear_drivers: function(a){
		  a.commit('CLEAR_DRIVERS')
		}
		,






		//
		// delete_connection
		//
		//
		//
		delete_connection: function(a, connection){
            console.log(JSON.stringify(connection));
            pouchdb_connections.get(connection.id,function(err,doc) {
                pouchdb_connections.remove(doc);
            });
            
		},


    //
    // delete query
    //
    //
    //
    delete_query: function(a, query){
            console.log(JSON.stringify(connection));
            pouchdb_queries.get(connection.id,function(err,doc) {
                pouchdb_queries.remove(doc);
            });
    },




		//
		// hide_add_connection
		//
		hide_add_connection: function(a){
            a.commit('HIDE_ADD_CONNECTION')
		},



        //
        // hide add query
        //
        hide_add_query: function(a){
            a.commit('HIDE_ADD_QUERY')
        },




        //
        // hide add query
        //
        hide_full_doc: function(a){
            a.commit('HIDE_FULL_DOC')
        },



        //
        // hide_add_driver
        //
        hide_add_driver: function(a){
            a.commit('HIDE_ADD_DRIVER')
        },



        //
        // set_output_fields
        //
        set_output_fields: function(a, fields){
            a.commit('SET_OUTPUT_FIELDS', fields)
        },

        
        
        //
        // set_output_records
        //
        set_output_records: function(a, records){
            a.commit('SET_OUTPUT_RECORDS', records)
        },


        //
        // set_viewed_connection
        //
        set_viewed_connection: function(a, b){
            a.commit('SET_VIEWED_CONNECTION', b)
        },


        //
        // set viewed query
        //
        set_viewed_query: function(a, b){
            a.commit('SET_VIEWED_QUERY', b)
        },




        //
        // set viewed query
        //
        set_viewed_query_id: function(a, b){
            a.commit('SET_VIEWED_QUERY_ID', b)
        },


        //
        // set_viewed_driver
        //
        set_viewed_driver: function(a, b){
            a.commit('SET_VIEWED_DRIVER', b)
        },




        //
        // show add query
        //
        show_add_query: function(a){
          a.commit('SHOW_ADD_QUERY')
        },


        //
        // show_add_connection
        //
        show_add_connection: function(a){
            a.commit('SHOW_ADD_CONNECTION')
        },


        //
        // hide add query
        //
        show_full_doc: function(a){
            a.commit('SHOW_FULL_DOC')
        },

  }
})
