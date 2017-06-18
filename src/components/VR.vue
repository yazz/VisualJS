<template>
	<div style='position: absolute; height: 20%; width: 20%;'>
        <a-scene  platform='all' id='vr_scene'>
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

            <a-entity position="0 2.2 4"
			          geometry="primitive: plane; width: auto; height: auto" material="color: white"
                      text="color: black; align: left; value: Go Share Data VR; width: 2; "
				      rotation='0 0 0'>
            </a-entity>

            <a-entity position="0 1.8 2.5">
                <a-entity camera look-controls >
									<a-entity 	position="0 0 -3"
										geometry="primitive: ring; radiusOuter: 0.020; radiusInner: 0.0001;"
										material="color: red; shader: flat"
										cursor="maxDistance: 1000; fuse: true">
									</a-entity>


					</a-entity>
			</a-entity>

<a-entity position="2 1 -5">
		<a-entity mixin="cube red">
			<a-animation 	 attribute="position" from="0 0 0"
											to="0 0 -20" direction="alternate"  repeat="indefinite"></a-animation>
	</a-entity>
</a-entity>



			<a-entity position="-5 1 1">
			    <a-entity mixin="cube red">
					<a-animation 	begin="mouseenter" attribute="position" from="0 0 0"
					                to="0 0 -10" direction="alternate"  repeat="indefinite"></a-animation>
				</a-entity>
			</a-entity>



			<a-entity v-for="(a_driver,index)  in  list_of_connections"
			   v-bind:position="(index*1.5) + ' 2 -1'"  width=1 height=1
			   v-bind:color="(index % 2 == 0)?'blue':'green'"
			   v-bind:text="'color: black; align: left; value: ' + a_driver.id + ' ; width: 2; '">
				   <a-entity  mixin='gsd'  v-bind:color="(index % 2 == 0)?'blue':'green'">
						 <a-animation begin="mouseenter" attribute="geometry.depth" from="0"
										to=".5'" dur="1500" direction="alternate"  repeat="1"></a-animation>
					</a-entity>
		   </a-entity>




			<a-entity  	v-for="(a_driver,index)  in  list_of_drivers"
						v-bind:position="(index*1.5) + ' 1 -1'"
						width=1
						height=1
						v-bind:color="(index % 2 == 0)?'blue':'green'"
						v-bind:text="'color: black; align: left; value: ' + a_driver.id + ' ; width: 2; '">

				    <a-entity mixin='gsd'  v-bind:color="(index % 2 == 0)?'blue':'green'">
					<a-animation 	begin="mouseenter" attribute="position" from="-1.5 0 0"
					                to="-1.5 0 -1" direction="alternate"  repeat="1"></a-animation>
					</a-entity>
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
