<template>
  <div id="app">
      <h1 class="display-2">Clients</h1>
      <p class="display-4">get connected and share</p>
  </div>
</template>





<script>
export default {
  name: 'connected_clients',
  data () {
    return {
      msg: 'Data'
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
