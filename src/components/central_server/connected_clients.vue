<template>
  <div id="app">
      <p class="display-5">list of clients connected</p>
      <div v-text='this.$store.state.central_server_client_connected'></div>
      
      <div v-text='this.$store.state.central_server_client_internal_ip_address'></div>
      <div v-text='this.$store.state.central_server_client_internal_port'></div>

      <div v-text='this.$store.state.central_server_client_public_ip_address'></div>
      <div v-text='this.$store.state.central_server_client_public_port'></div>
  </div>
</template>





<script>
export default {
    name: 'connected_clients'
    ,
    data () {
        return {
            msg: 'Data'
        }
    }
    ,
    computed: {
        list_of_connections: function () {
            return this.$store.getters.list_of_connections
        }
    }
}
</script>





<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
