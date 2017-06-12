<template>
  <div id="app2">
<a-scene>



      <!-- Alignments. -->
        <a-entity position=".1 1.85 0.9" geometry="primitive: plane; width: auto; height: auto" material="color: #333"
                  text="color: yellow; align: left; value: Go Share Data VR; width: 2; "
				  rotation='0 75 0'>
        </a-entity>

      <a-entity position="0 1.8 2">
        <a-entity camera look-controls wasd-controls></a-entity>
      </a-entity>
    </a-scene>
        </div>  
  </div>
</template>





<script>
export default {

}
</script>





<style>
#app2 {
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
