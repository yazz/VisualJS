import Vue from 'vue'
import Vuex from 'vuex'
import db                       from '../public/dbhelper.js'

Vue.use(Vuex)



export default new Vuex.Store({


  state: {
    add_connection_visible: false
    ,
    list_of_connections: []
    ,
    viewed_connection_id: null
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




  mutations: {
      ADD_CONNECTION: function (state, connection) {
        state.list_of_connections.push(connection.cp);
      },
      CLEAR_CONNECTIONS: function (state) {
        state.list_of_connections = [];
      },
    HIDE_ADD_CONNECTION: function (state) {
      state.add_connection_visible = false
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
    SHOW_ADD_CONNECTION: function (state) {
      state.add_connection_visible = true
    }
  },




  actions: {

    add_connection: function(a, connection){
      a.commit('ADD_CONNECTION', connection)
      //console.log(JSON.stringify(connection.cp));
      //gun.get('connections').path('user_data').put(connections['user_data']);

    },
    add_new_connection: function(a, connection){
      //a.commit('ADD_NEW_CONNECTION', connection)
      console.log(JSON.stringify(connection));
      //gun.get('connections').path(connection.cp.id).put(connection.cp);
      db.sql(`insert into
                  connections2
                  (
                      id
                      ,
                      name
                  )
              values
                  (?,?)`
                  ,
                  [
                        autoIndexSerialId()
                        ,
                        connection.cn
                  ]
            )
    },
    clear_connections: function(a){
      a.commit('CLEAR_CONNECTIONS')
    }
    ,
    delete_connection: function(a, connection){
      //a.commit('ADD_NEW_CONNECTION', connection)
      //console.log(JSON.stringify(connection.cp));
      connection.deleted = true;
      //gun.get('connections').path(connection.id).put(connection,
      //function() {gun.get('default').path('connections_changed').val(function(v){
      //      gun.get('default').path('connections_changed').put({value: v.value + 1});
      //},true);});
      //alert(connection.id);

    },
    hide_add_connection: function(a){
      a.commit('HIDE_ADD_CONNECTION')
    },



    set_viewed_connection: function(a, b){
      a.commit('SET_VIEWED_CONNECTION', b)
    },



    show_add_connection: function(a){
      a.commit('SHOW_ADD_CONNECTION')
    }


  }
})
