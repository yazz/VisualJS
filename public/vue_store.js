/*var store =  new Vuex.Store({


  state: {
    add_connection_visible: false
    ,
    list_of_connections: []
    ,
    viewed_connection_id: null
    ,
    viewed_connection_driver: null
  },




  mutations: {
    ADD_CONNECTION: function (state, connection) {
      state.list_of_connections.push(connection.cp);
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




*/
