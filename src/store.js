import Vue from 'vue'
import Vuex from 'vuex'
import db                       from '../public/dbhelper.js'

Vue.use(Vuex)



export default new Vuex.Store({


    state: {
        add_connection_visible: false
        ,
        add_driver_visible: false
        ,
        list_of_connections: []
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
    list_of_connections: state => state.list_of_connections
    ,
    list_of_drivers: state => state.list_of_drivers
    ,
    list_of_output_fields: state => state.list_of_output_fields
    ,
    list_of_output_drivers: state => state.list_of_output_drivers
    ,
    viewed_connection_id: state => state.viewed_connection_id
    ,
    viewed_connection_driver: state => state.viewed_connection_driver
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
      ADD_DRIVER: function (state, driver) {
        state.list_of_drivers.push(driver.cp);
      },
      CLEAR_CONNECTIONS: function (state) {
        state.list_of_connections = [];
      },
      CLEAR_DRIVERS: function (state) {
        state.list_of_drivers = [];
      },
      HIDE_ADD_CONNECTION: function (state) {
        state.add_connection_visible = false
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
    //
    //
    add_connection: function(a, connection){
      a.commit('ADD_CONNECTION', connection)
      //console.log(JSON.stringify(connection.cp));
      //gun.get('connections').path('user_data').put(connections['user_data']);

    },



        //
        // add_connection
        //
        //
        //
        add_driver: function(a, driver){
          a.commit('ADD_DRIVER', driver)
          //console.log(JSON.stringify(connection.cp));
          //gun.get('connections').path('user_data').put(connections['user_data']);

        },






    //
    // add_new_connection
    //
    //
    //
    add_new_connection: function(a, connection){
      //a.commit('ADD_NEW_CONNECTION', connection)
      //console.log(JSON.stringify(connection));
      //gun.get('connections').path(connection.cp.id).put(connection.cp);
      db.sql(`insert into
                  db_connections
                  (
                      id
                      ,
                      name
                      ,
                      driver
                      ,
                      database
                      ,
                      host
                      ,
                      port
                      ,
                      connectString
                      ,
                      user
                      ,
                      password
                  )
              values
                  (?,?,?,?,?,?,?,?,?)`
                  ,
                  [
                        autoIndexSerialId()
                        ,
                        connection.cn
                        ,
                        connection.cp.driver
                        ,
                        (connection.cp.database?connection.cp.database:null)
                        ,
                        (connection.cp.host?connection.cp.host:null)
                        ,
                        (connection.cp.port?connection.cp.port:null)
                        ,
                        (connection.cp.connectString?connection.cp.connectString:null)
                        ,
                        connection.cp.user
                        ,
                        connection.cp.password
                  ]
            )
    },


    //
    // clear_connections
    //
    //
    //
    clear_connections: function(a){
      a.commit('CLEAR_CONNECTIONS')
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
      //a.commit('ADD_NEW_CONNECTION', connection)
      //console.log(JSON.stringify(connection.cp));
      connection.deleted = true;
      //gun.get('connections').path(connection.id).put(connection,
      //function() {gun.get('default').path('connections_changed').val(function(v){
      //      gun.get('default').path('connections_changed').put({value: v.value + 1});
      //},true);});
      //alert(connection.id);
      //console.log('Delete connection: ' + connection.id)
      db.sql("update db_connections set deleted = 'T' where name = '" + connection.id + "'")
    },





    //
    // hide_add_connection
    //
    //
    //
    hide_add_connection: function(a){
      a.commit('HIDE_ADD_CONNECTION')
    },







        //
        // hide_add_driver
        //
        //
        //
        hide_add_driver: function(a){
          a.commit('HIDE_ADD_DRIVER')
        },




        set_output_fields: function(a, fields){
          a.commit('SET_OUTPUT_FIELDS', fields)
        },

        set_output_records: function(a, records){
          a.commit('SET_OUTPUT_RECORDS', records)
        },


    //
    // set_viewed_connection
    //
    //
    //
    set_viewed_connection: function(a, b){
      a.commit('SET_VIEWED_CONNECTION', b)
    },





        //
        // set_viewed_driver
        //
        //
        //
        set_viewed_driver: function(a, b){
          a.commit('SET_VIEWED_DRIVER', b)
        },





    //
    // show_add_connection
    //
    //
    //
    show_add_connection: function(a){
      a.commit('SHOW_ADD_CONNECTION')
    }


  }
})
