<template>
			  <a-entity position='0 0 -5' id='vr_home' >

					<a-entity 	v-if='vr_type=="move"' id=vr_objects
								position='0 0 0'>
					  <VR-items v-bind:vr_type='get_vr_type'></VR-items>
					 </a-entity >



					<a-entity 	v-if='vr_type=="mouse"'
								id='vr_objects'
								position='0 0 0'>
						<VR-items v-bind:vr_type='get_vr_type'></VR-items>
					 </a-entity >


                    



					 <a-entity position="1 -1.6 2">

						 <a-entity position="0 2.8 0"
									geometry="primitive: plane; width: 1.8; height: 1.8;" material="color: green"
                                    mixin="RobotoFont"
									v-bind:text='"color: white; align: center; value: View data ; width: 6; "'
									rotation='0 0 0' goto='name: scrollable_grid; distance: 4; duration: 500;'>
									<a-animation begin="mouseenter" attribute="rotation"
												to="0 0 1" dur="100" direction="alternate"  repeat="3"></a-animation>
													</a-entity>
                                                    
                                                    
                                                    
                                                    
                                                    
                                                    
                                                    
						 <a-entity position="2 2.8 0"
									geometry="primitive: plane; width: 1.8; height: 1.8;" material="color: lightgray"
                                    mixin="RobotoFont"
									v-bind:text='"color: white; align: center; value: ; width: 6; "'
									rotation='0 0 0' >
									<a-animation begin="mouseenter" attribute="rotation"
												to="0 0 1" dur="100" direction="alternate"  repeat="3"></a-animation>
                                        <a-entity  	id=locked
                                                    material='color: blue;opacity: 1;'  
                                                    geometry='primitive: plane; height: .3 ; width: .256'
                                                    position='0 .2 0.1' 
                                                    v-bind:material='"src: " + (locked?"":"un") + "locked.png; alphaTest: 0.5;"'
                                                    lock_icon=''
                                                    v-if='getIsLocalMachine'
                                                    > 
                                                        <a-animation begin="mouseenter" attribute="rotation"
                                                                    to="0 0 4" dur="100" direction="alternate"  repeat="3"></a-animation>
                                        </a-entity>
                                        <a-entity   position="-.4 -.2 .4" rotation="0 0 0" 
                                                    mixin="RobotoFont"
                                                    v-bind:text='"color: black; align: center; value: " + (locked?"ONLY YOU can see your data":"Others can see your SHARED data") + " ; width: 2; "'>
                                        </a-entity>
						</a-entity>
                                                    
						 <a-entity v-bind:position='"13 -1.7 -11"' id="people"  
									geometry="primitive: plane; width: 8.4; height: 8.4;" 
                                    v-bind:material='"color: gray; opacity: 1;"'
                                    mixin="RobotoFont"
									v-bind:text='"color: white; align: center; value: People ; width: 24; "'
                                    goto='name: people_num; distance: 8; duration: 1500;'
                                    set_zoom='people: true;'
									rotation='0 0 0' >
									<a-animation begin="mouseenter" attribute="rotation"
												to="0 0 1" dur="100" direction="alternate"  repeat="3"></a-animation>
									<a-animation begin="click" attribute="rotation"
												to="0 0 20" dur="2000" direction="alternate"  repeat="1"></a-animation>
						</a-entity>
                                                    
						 <a-entity v-bind:position='"27 -1.7 -30"' id="people_num">
                            <a-entity 
                                        v-if='getIsPeopleZoomed'
									geometry="primitive: plane; width: 8.4; height: 8.4;"
                                    v-bind:material='"color: white; opacity: 1  ;"'
									rotation='0 0 0' >
                                    <a-entity   position="-2 2 .4" rotation="0 0 0" 
                                                mixin="RobotoFont"
                                                v-bind:text='"color: black; align: center; value: People; width: 10; "'>
                                    </a-entity>
                                <a-entity  v-for="(item,index)  in  getNetwork"
                                v-bind:position='"0 " + (index - 1) + "  .5"'
                                geometry="primitive: plane; width: .1; height: .1"
                                material="color: white"
                                mixin="RobotoFont"
                                v-bind:text='"color: black; align: center; value: " + item.username + " - " + item.internal_host  + " : " + item.internal_port + "@" + item.via + "; width: 5; "'
                                v-bind:jump_to='"host: " + item.internal_host + ";port: " + item.internal_port + ";"'
                                rotation='0 0 0'>
                                    <a-entity geometry="primitive: plane; width: 2; height: .7" position='4 0 0' 
                                    v-bind:material='"color: " + (item.locked?"red":"green")'
                                    mixin="RobotoFont"
                                    v-bind:text='"color: black; align: center; value: " + (item.locked?"Locked":"") + "; width: 8; "'
                                    >
                                        <a-animation begin="mouseenter" attribute="rotation"
                                                    to="0 0 10" dur="100" direction="alternate"  repeat="3"></a-animation>
                                    </a-entity>
                                    
                                    <a-entity   geometry="primitive: plane; width: 2; height: .7" position='7 0 0' 
                                                v-bind:material='"color: " + (item.accessable?"green":"blue")'
                                                mixin="RobotoFont"
                                                v-bind:text='"color: black; align: center; value: " + (item.accessable?"All ok":"Can not access , firewall in place?") + "; width: 8; "'
                                                >
                                        <a-animation begin="mouseenter" attribute="rotation"
                                                    to="0 0 10" dur="100" direction="alternate"  repeat="3"></a-animation>
                                    </a-entity>
                            </a-entity>

                            </a-entity>
						</a-entity>
                                                    
                                                    
                                                    
                                                    
                                                    
                                                    

						<a-entity  v-if='vr_type=="mouse"' position="0 .9 0"
								 geometry="primitive: plane; width: 1.8; height: 1.8;" material="color: yellow"
                                 mixin="RobotoFont"
								 v-bind:text='"color: black; align: center; value: Settings ; width: 6; "'
								 rotation='0 0 0' goto_settings=''>
								<a-animation begin="mouseenter" attribute="rotation"
												to="0 0 1" dur="100" direction="alternate"  repeat="3"></a-animation>
						</a-entity>

						<a-entity  v-if='vr_type=="move"' position="0 .9 0"
								 geometry="primitive: plane; width: 1.8; height: 1.8;" material="color: yellow"
                                 mixin="RobotoFont"
								 v-bind:text='"color: black; align: center; value:  ; width: 6; "'
								 rotation='0 0 0'>
								<a-animation begin="mouseenter" attribute="rotation"
												to="0 0 1" dur="100" direction="alternate"  repeat="3"></a-animation>
						</a-entity>


                        
                        
                        <a-entity v-if='vr_type=="mouse"' position="-2 2.8 0"
									geometry="primitive: plane; width: 1.8; height: 1.8;" material="color: red"
                                    mixin="RobotoFont"
									v-bind:text='"color: white; align: center; value: To add data \ndrag and drop \nfiles here ; width: 6; "'
									rotation='0 0 0' id='red_home' add_data=''
                                    goto='name: related_items; distance: 4; duration: 500;'
                                    >
									<a-animation begin="mouseenter" attribute="rotation"
														to="0 0 1" dur="100" direction="alternate"  repeat="3"></a-animation>
						</a-entity>

                        
                        
                        <a-entity v-if='vr_type=="move"' position="-2 2.8 0"
									geometry="primitive: plane; width: 1.8; height: 1.8;" material="color: red"
                                    mixin="RobotoFont"
									v-bind:text='"color: white; align: center; value:  ; width: 6; "'
									rotation='0 0 0' id='red_home' >
									<a-animation begin="mouseenter" attribute="rotation"
														to="0 0 1" dur="100" direction="alternate"  repeat="3"></a-animation>
						</a-entity>

                        
                        
                        
                        
                        
                        
						<a-entity v-if='vr_type=="mouse"' position="-2 .9 0"
								 geometry="primitive: plane; width: 1.8; height: 1.8;" material="color: blue"
                                 mixin="RobotoFont"
								 v-bind:text='"color: white; align: center; value: VR  ; width: 6; "'
								 rotation='0 0 0' goto_vr=''>
								 <a-animation begin="mouseenter" attribute="rotation"
													 to="0 0 1" dur="100" direction="alternate"  repeat="3"></a-animation>
						</a-entity>
                        
                        
                        
						<a-entity v-if='vr_type=="move"' position="-2 .9 0"
								 geometry="primitive: plane; width: 1.8; height: 1.8;" material="color: blue"
                                 mixin="RobotoFont"
								 v-bind:text='"color: white; align: center; value: Exit VR  ; width: 6; "'
								 rotation='0 0 0' exit_vr=''>
								 <a-animation begin="mouseenter" attribute="rotation"
													 to="0 0 1" dur="100" direction="alternate"  repeat="3"></a-animation>
						</a-entity>
					</a-entity>

			</a-entity>


</template>





<script>
import output_table             from './output_table.vue'
import VR_items             from './VR_items.vue'

export default {
name: 'VR-Home'
		,
			props: ['vr_type'],

  computed: {
getIsPeopleZoomed: function() {
//console.log('return this.$store.state.zoom_people := ' + this.$store.state.zoom_people)
    return this.$store.state.zoom_people
  },
getNetwork: function() {
//console.log('return this.$store.state.zoom_people := ' + this.$store.state.zoom_people)
    return this.$store.state.network;
  },
getIsPeopleZoomed2: function() {
//console.log('return this.$store.state.zoom_people := ' + this.$store.state.zoom_people)
    return this.$store.state.zoom_people?false:true;
  },
 getIsLocalMachine: function() {
    return this.$store.state.is_local_machine
  },
    locked: function () {
	 return this.$store.state.locked;
    },
    list_of_records: function () {
	if (this.$store.state.list_of_output_records) {
		var newl=new Object();
		for (var i=0; i<10;i++){
			if (this.$store.state.list_of_output_records[i]){
			     newl[i]=this.$store.state.list_of_output_records[i];
				 };
		}
		return newl;
		} else {
		return [];
	};
    },
    get_vr_type: function () {
      return this.vr_type;
    },
    get_vr_type_mouse: function () {
      return this.vr_type == 'mouse';
    },
    get_vr_type_move: function () {
      return this.vr_type == 'move';
    },
    list_of_queries: function () {
      return window.sqlGetAllQueries()
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
	get_viewed_query_id: function() {
	    return this.$store.state.viewed_query_id;
	},
    can_show_full_doc: function() {
		return this.$store.state.show_full_doc;
	},
		get_x_position: function(index, total) {
		var cols = (Math.ceil(Math.sqrt(total)));
		return index % cols;
	},
	truncate: function(txt) {
	    return (txt?txt.toString().substring(0,10):'');
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
