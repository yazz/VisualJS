<template>
			  <a-entity position='5 -25 0' id='vr_items'>

			  
			  
			  
			  

				<a-entity position="0 6 0"
						  geometry="primitive: plane; width: auto; height: auto" material="color: white"
						  v-bind:text='"font: roboto; color: black; align: left; value: Go Share Data VR :" + "" + "; width: 2; "'
						  rotation='0 0 0'>
				</a-entity>

                
                        <a-entity position="-5.2 4 -1.9" id='vr_file_name_2'
                                    scale="0.6 0.6 1"
									geometry="primitive: plane; width: 3.9; height: 1.9;" material="color: white;opacity: 1;"
									v-bind:text='"font: roboto; color: black; align: center; value: _ ; width: 6; "'>
						</a-entity>
						 <a-entity position="-5.2 4.2 -1.9" id='vr_file_size_2'
                                    scale="0.6 0.6 1"
									geometry="primitive: plane; width: 3.9; height: 1.9;" material="color: white;opacity: 1;"
									v-bind:text='"font: roboto; color: black; align: center; value: ? ; width: 6; "'>
						</a-entity>
						 <a-entity position="-5.2 4.4 -1.9" id='vr_file_saved_as'
                                    scale="0.6 0.6 1"
									geometry="primitive: plane; width: 3.9; height: 1.9;" material="color: white;opacity: 1;"
									v-bind:text='"font: roboto; color: black; align: center; value: ? ; width: 6; "'>
						</a-entity>

                
                

				<a-entity position="-1.4 4.7 .6" id=vr_file_name
						  geometry="primitive: plane; width: auto; height: auto" material="color: white"
						  text='font: roboto; color: black; align: left; value: ; width: 4;  '
						  rotation='0 0 0'>
				</a-entity>

				<a-entity position="0 -4 -10" id='doc_details'>

					<a-entity v-if='can_show_full_doc()' geometry="primitive: plane; height: 5; width: 8;" material="color: white" position='0 2.5 -1' >

						<a-entity geometry="primitive: box; width:.5;height: 0.5;depth: 0.1;" material="color: red"
						v-if='get_vr_type_mouse'  position='-4 -2.5 1.1' closedoc=''>
								<a-entity 	position="1 0 0.07"
											text="font: aileronsemibold; color: white; align: left; value: Close; width: 2; height: 1; opacity: 1;">
								</a-entity>
						</a-entity>
						<a-entity  v-if='get_vr_type_mouse' geometry="primitive: box; width:.5;height: 0.5;depth: 0.1;" material="color: green"
						position='-4 -1 1.1'
									v-bind:open_file='"" + get_viewed_query_file() ' >
							<a-entity 	position="1 0 0.07"
										text="font: aileronsemibold; color: white; align: left; value: Open; width: 2; height: 1; opacity: 1;">
							</a-entity>
						</a-entity>


						<a-entity v-if='get_vr_type_move' geometry="primitive: box; width:.6;height: 0.6;depth: 0.6;" material="color: red"
						position='-6 -3.4 .7' closedoc='' rotation='0 40 0'>
						</a-entity>
						<a-entity v-if='get_vr_type_move' 	position="-5 -3.5 -1" rotation='0 40 0'
									text="font: aileronsemibold; color: red; align: middle; value: Close; width: 8; height: 2; opacity: 1;">
						</a-entity>


					<a-entity v-if='can_show_full_doc()' v-for="(field_name,index)  in  list_of_fields"
							  v-bind:position='(index + .5) + " -1 2.5"'
							  geometry="primitive: plane; width: auto; height: auto"
							  material="color: white"
							  rotation='0 0 0'>

                            <a-entity position='-1.5 0 0.6'
                                      v-bind:text='"font: aileronsemibold;color: black; align: left; value: " + field_name + "; width: 2; "'>
                            </a-entity>

							<a-entity v-for="(a_record,rindex)  in  list_of_records"
									  v-bind:position='"-1.5 " + (-.2 - (rindex * 0.2)) + " 0.6"'
									  geometry="primitive: plane; width: 2; height: 0.2" material="color: white"
									  v-bind:text='"font: sourcecodepro;color: black; align: left; value: " + truncate(a_record[field_name]) + "; width: 2; opacity: 1;"'
									  rotation='0 0 0'>

							</a-entity>

					</a-entity>
						</a-entity>
					</a-entity>


						<a-entity v-if='!can_show_full_doc()' v-for="(field_name,index)  in  list_of_fields"
								  v-bind:position='(index + 3) + " 1 0"'
								  geometry="primitive: plane; width: auto; height: auto"
								  material="color: white"
								  
								  rotation='0 0 0'>

								<a-entity position='0 0 0'
                                          v-bind:text='"font: aileronsemibold;color: black; align: left; value: " + field_name + "; width: 2; "'>
								</a-entity>

								<a-entity v-for="(a_record,rindex)  in  list_of_records"
										  v-bind:position='"0 " + (-.2 - (rindex * 0.2)) + " 0"'
										  geometry="primitive: plane; width: auto; height: auto" material="color: white"
										  v-bind:text='"font: sourcecodepro;color: black; align: left; value: " + truncate(a_record[field_name]) + "; width: 2; "'
										  rotation='0 0 0'>

								</a-entity>

							</a-entity>


<a-entity id=scrollable_grid>

				<a-entity  v-for="(a_driver,index)  in  list_of_queries"
				   v-bind:position="(-2.2 + (get_x_position(index,list_of_queries.length)*0.5))+ ' ' + (2 - (get_y_position(index,list_of_queries.length)*0.6)) + ' -.1'"
				   v-bind:color="(index % 2 == 0)?'blue':'green'"
				   v-bind:text="'color: black; align: left; value: ' + a_driver.name.substr(a_driver.name.length - 10) + ' ; width: 2; '">
					   <a-entity    position="-0.8 .3 -.3" 
									geometry="primitive: plane; width:.35;height: 0.35;"
							        v-bind:griditem='"x: " + get_x_position(index,list_of_queries.length) + "; y:" + get_y_position(index,list_of_queries.length) + ";" +
								    "   query_name: " + a_driver.name +
                                    ";  query_saved_as: " + (a_driver.hash?(a_driver.hash + (a_driver.fileName?"." + a_driver.fileName.split(".").pop():"")):"") +                                   
					    			";  query_display: " + "" + a_driver.fileName + 
                                    ";  query_size: " + a_driver.size + "; " '
								  v-bind:preview='"id: " + a_driver.id + ";"'
								mixin='gsd'  
								v-bind:material2='"src: driver_icons/" + a_driver.driver + ".jpg;"'
								v-bind:material='"color: gray;"'
								v-bind:color="(index % 2 == 0)?'blue':'green'"
								v-bind:log='"x: " + get_x_position(index,list_of_queries.length) + "; y:" + get_y_position(index,list_of_queries.length) + ";queryFile: " + a_driver.hash + (a_driver.fileName?"." +a_driver.fileName.split(".").pop():"") + 
                                ";queryId: "  + a_driver.id + ";"' >
								<a-animation begin="mouseenter" attribute="rotation"
												to="0 0 5" dur="90" direction="alternate"  repeat="3"></a-animation>
						</a-entity>
			   </a-entity>
</a-entity >







			</a-entity>
</template>





<script>
import output_table             from './output_table.vue'


export default {
name: 'VR-items'
		,
			props: ['vr_type'],

  computed: {
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
      return this.$store.getters.list_of_queries
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
	get_viewed_query_file: function() {
	    return this.$store.state.viewed_query_file;
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
	  'output-table': output_table
	}

}
</script>





<style>
</style>
