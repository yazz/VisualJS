<template>
	<div style='position: absolute; height: 20%; width: 20%;'>


        <a-scene  	platform='all' id='vr_scene' renderer="clearColor: #222"
					v-bind:vr-mode-ui='"enabled: " + (vr_type=="move")'
                    keyboard-shortcuts="enterVR: false">
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



			<a-entity v-if='vr_type=="mouse"' id='camera_id'  position="0 0 0"  camera  mouse-cursor >
				<a-entity 
					material='color: gray;opacity: 0.5;' 
					geometry='primitive: plane; width: 10; height: 1; ' 
					position='0 -1.6 -2' >
                    
                    <a-entity position="1.4 3.15 0"
						  geometry="primitive: plane; width: auto; height: auto" material="color: white"
						  v-bind:text='"font: roboto; color: black; align: left; value: " + getUserName + "; width: 4; "'
						  rotation='0 0 0'>
                    </a-entity>

                    
                    
                    
					<a-entity   position="-6 2 -4"
								geometry="primitive: plane; width: 5.9; height: 8.9;" 
								material="color: white; opacity: .9;"
								rotation='0 0 0' >
                        <a-entity   position="0 4 0" v-bind:text='"font: roboto; color: black; align: center; value: GoShareData ; width: 6; "'></a-entity>
                        
                        <a-entity   position="1 2.83 0" v-bind:text='"font: roboto; color: black; align: left; value: Search ; width: 5; "'></a-entity>
                        <a-entity   geometry="primitive: plane; width: 3; height: .5;"  
                                    position="0 2.4 0" 
                                    material="color: blue; opacity: 0.9;">
                            <a-entity   position="1.6 0 0" 
                                        v-bind:text='"font: roboto; color: black;align: left; value: " + zzz + " ; width: 6; "'>
                            </a-entity>
                                    
                                    
                        </a-entity>
                    </a-entity>

                    <a-entity  	material='color: gray;opacity: .95;'  
								geometry='primitive: box; width: 2.5; height: .2; depth: .1.8;'
                                rotation='0 0 0'
								position='0.01 .9 1'
								goto='name: vr_home; duration: 300;' > 
									<a-animation begin="mouseenter" attribute="position"
												from="0.01 .9 1" to="0.01 .9 .98" dur="400" direction="alternate"  repeat="1"></a-animation>
                                 <a-entity position="0 0.2 0.3" rotation="0 0 0" 
                                            text='font: roboto; color: black; align: center; value: Go back ; width: 2; '>
                                </a-entity>
					</a-entity >
                    
                    <a-entity  	id=locked
                                material='color: white;opacity: 0;'  
								geometry='primitive: plane; height: .3 ; width: .256'
								position='3.63 3 -.5' 
								v-bind:material='"src: " + (locked?"":"un") + "locked.jpg;"'
                                lock_icon=''
								> 
									<a-animation begin="mouseenter" attribute="rotation"
												to="0 0 4" dur="100" direction="alternate"  repeat="3"></a-animation>
													</a-entity>
					</a-entity >

                    
                    

				</a-entity>
			</a-entity>



    		<a-entity v-if='vr_type=="move"' position="0 0 0" material="color: white" >
				<a-entity camera='near: 0.005;' look-controls material="color: white" id='movevr'>
						<a-entity material='color: white;' >
								<a-entity 	position="0 0 -3"
														geometry="primitive: ring; radiusOuter: 0.030; radiusInner: 0.006; color:white;"
														material="color: black; shader: flat"
														cursor="maxDistance: 1000; fuse: true;">
								</a-entity>
						</a-entity>
				</a-entity>
	    	</a-entity>


			<a-entity v-if='vr_type=="move"' position='0 -3.6 -5' >
				<a-entity
					id='move_bar' 
					material='color: gray;opacity: .5;' 
					geometry='primitive: plane; width: 20; height: 2; ' 
					position='0 -.8 -1' >

                    <a-entity  	material='color: gray;opacity: .95;'  
								geometry='primitive: box; width: 10; height: 1; depth: .7'
                                rotation='0 0 0'
								position='0.01 1 1.5'
								goto='name: vr_home; duration: 300;' > 
									<a-animation begin="mouseenter" attribute="position"
												from="0.01 1 1.5" to="0.01 1 1.4" dur="400" direction="alternate"  repeat="1"></a-animation>
                                 <a-entity position="0 0.3 0.6" rotation="-45
                                 0 0 0" 
                                            text='font: roboto; color: black; align: center; value: Go back ; width: 10; '>
                                </a-entity>
					</a-entity >




                        </a-entity>
	    	</a-entity>


			<VR-Home v-bind:vr_type='get_vr_type'></VR-Home>


		   <a-sky color="white"></a-sky>
		</a-scene>
	</div>
</template>





<script>
import output_table         from './output_table.vue'
import VR_items             from './VR_items.vue'
import VR_Home             from './VR_Home.vue'


export default {
name: 'VR'
		,
			props: ['vr_type'],

  computed: {
  zzz: function() {
    return this.$store.state.current_search
  },
 getUserName: function() {
    return this.$store.state.user_name
  },
    list_of_records: function () {
	if (this.$store.state.list_of_output_records) {
		return this.$store.state.list_of_output_records;
		} else {
		return [];
	};
    },
    locked: function () {
	 return this.$store.state.locked;
    },
    list_of_connections: function () {
      return this.$store.getters.list_of_connections
    },
    get_vr_type: function () {
      return this.vr_type
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
	},
  components: {
  'output-table': output_table,
	'VR-Home': VR_Home,
	'VR-items': VR_items
  }


}
</script>





<style>
</style>
