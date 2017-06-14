<template>
	<div style='position: absolute; height: 100%; width: 100%;'>
        <a-scene>
            <a-entity position=".1 2.5 0.9" 
			          geometry="primitive: plane; width: auto; height: auto" material="color: white"
                      text="color: black; align: left; value: Go Share Data VR; width: 2; "
				      rotation='0 0 0'>
            </a-entity>

            <a-entity position="0 1.8 2.5">
                <a-entity camera look-controls 
		              wasd-control></a-entity>
            </a-entity>
			
			<a-entity v-for="(a_driver,index)  in  list_of_drivers" 
			       v-bind:position="index + ' 1 1'"  width=1 height=1 
				   v-bind:color="(index % 2 == 0)?'blue':'green'"
				   v-bind:text="'color: black; align: left; value: ' + a_driver.id + ' ; width: 2; '">
				   <a-box position='-0.2 0.0' width=0.1 height=0.1 v-bind:color="(index % 2 == 0)?'blue':'green'"></a-box>
				   </a-entity>

			<a-entity v-for="(a_driver,index)  in  list_of_connections" 
			   v-bind:position="index + ' 2 1'"  width=1 height=1 
			   v-bind:color="(index % 2 == 0)?'blue':'green'"
			   v-bind:text="'color: black; align: left; value: ' + a_driver.id + ' ; width: 2; '">
				   <a-box position='-0.2 0.0' width=0.1 height=0.1 v-bind:color="(index % 2 == 0)?'blue':'green'"></a-box>
		   </a-entity>
		   <a-sky color="white"></a-sky>
		</a-scene>
	</div>
</template>





<script>
export default {
  computed: {
    list_of_connections: function () {
      return this.$store.getters.list_of_connections
    },
    list_of_drivers: function () {
      return this.$store.getters.list_of_drivers
    },

    add_driver_visible: function () {
      return this.$store.state.add_driver_visible
    },

    viewed_driver_id: function () {
      return this.$store.state.viewed_driver_id
    },
	getRandomColor: function() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++ ) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
}
}
</script>





<style>
</style>
