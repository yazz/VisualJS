<template>
	<div style='position: absolute; height: 20%; width: 20%;'>

	
        <a-scene  	platform='all' id='vr_scene' renderer="clearColor: #222" 
					v-bind:vr-mode-ui='"enabled: " + (vr_type=="move")'>
			<a-assets>
				<a-mixin id="cube" geometry="primitive: box"></a-mixin>
				<a-mixin id="cube-hovered" material="color: magenta"></a-mixin>
				<a-mixin id="cube-selected" material="color: cyan"></a-mixin>
				<a-mixin id="red" material="color: red"></a-mixin>
				<a-mixin id="green" material="color: green"></a-mixin>
				<a-mixin id="blue" material="color: blue"></a-mixin>
				<a-mixin id="yellow" material="color: yellow"></a-mixin>
				<a-mixin id="sphere" geometry="primitive: sphere"></a-mixin>
				<a-mixin id="gsd" geometry="primitive: box; width: 0.3; height: 0.3; depth: 0.3;" position="-1.4 0 0" ></a-mixin>
			</a-assets>


            <a-entity v-if='vr_type=="mouse"' position="0 2 3" material="color: white" >
                <a-entity camera material="color: white" >
									<a-entity 	position="0 0 -3" 
										cursor="maxDistance: 1000; fuse: true">
									</a-entity>


					</a-entity>
                <a-entity  look-controls material="color: white;" id=mousevr>
									<a-entity 	position="0 0 -3" 
										geometry="primitive: ring; radiusOuter: 0.030; radiusInner: 0.006; color:white;"
										material="color: red; shader: flat"
										cursor="maxDistance: 1000; fuse: true"
										>
									</a-entity>


					</a-entity>
			</a-entity>

			
			
			
            <a-entity v-if='vr_type=="move"' position="0 0 0" material="color: white" >
                <a-entity camera look-controls material="color: white" id=movevr>
									<a-entity 	position="0 0 -20"   rotation='0 0 0'
										cursor="maxDistance: 1000; fuse: true">
									</a-entity>

                <a-entity   material="color: white;" >
									<a-entity 	position="0 0 -3"
										geometry="primitive: ring; radiusOuter: 0.030; radiusInner: 0.006; color:white;"
										material="color: red; shader: flat"
										cursor="maxDistance: 1000; fuse: true"
										>
									</a-entity>



					</a-entity>
					</a-entity>
			</a-entity>

				
			<a-entity v-if='vr_type=="move"' id=vr_objects rotation='-50 0 0' position='0 -4 0'>
			  <VR-items></VR-items>
			 </a-entity >


				
			<a-entity v-if='vr_type=="mouse"' id=vr_objects>
			  <VR-items></VR-items>
			 </a-entity >


		   <a-sky color="white"></a-sky>
		</a-scene>
	</div>
</template>





<script>
import output_table             from './output_table.vue'
import VR_items             from './VR_items.vue'


export default {
name: 'VR'
		,
			props: ['vr_type'],

  computed: {
    list_of_records: function () {
	if (this.$store.state.list_of_output_records) {
		return this.$store.state.list_of_output_records;
		} else {
		return [];
	};
    },
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
	    list_of_fields: function () {
      return this.$store.state.list_of_output_fields
    }
	


	},
	methods: {
		get_x_position: function(index, total) {
		var cols = (Math.ceil(Math.sqrt(total)));
		return index % cols;
	},
	get_y_position: function(index, total) {
		var cols = (Math.ceil(Math.sqrt(total)));
		var rawQuotient = index / cols;
		var remainder = rawQuotient % 1;
		var quotient = rawQuotient - remainder;
		//console.log('get_y_position( ' + index + ', ' + total + ') = ' + quotient);
		return quotient ;
	}
	},
  components: {
  'output-table': output_table,
  'VR-items': VR_items
  }


}
</script>





<style>
</style>
