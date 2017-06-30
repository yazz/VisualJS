<template>
			  <a-entity position='0 0 0' >
				
			
				<a-entity position="0 6 0"  position2="-1.5 4 0"
						  geometry="primitive: plane; width: auto; height: auto" material="color: white"
						  v-bind:text='"font: roboto; color: black; align: left; value: Go Share Data VR :" + "" + "; width: 2; "'
						  rotation='0 0 0'>
				</a-entity>
			
				<a-entity position="-1.5 4.9 0" id=vr_file_name
						  geometry="primitive: plane; width: auto; height: auto" material="color: white"
						  text='font: roboto; color: black; align: left; value: ; width: 4; '
						  rotation='0 0 0'>
				</a-entity>

				<a-entity v-if='!can_show_full_doc()' v-for="(field_name,index)  in  list_of_fields"
						  v-bind:position='(index + 1) + " 4.3 .1"'
						  geometry="primitive: plane; width: auto; height: auto" 
						  material="color: white"
						  v-bind:text='"font: aileronsemibold;color: black; align: left; value: " + field_name + "; width: 2; opacity: 1;"'
						  rotation='0 0 0'>
						  

						<a-entity v-for="(a_record,rindex)  in  list_of_records"
								  v-bind:position='"0 " + (-.2 - (rindex * 0.2)) + " 0"'
								  geometry="primitive: plane; width: 2; height: 0.2" material="color: white"
								  v-bind:text='"font: sourcecodepro;color: black; align: left; value: " + truncate(a_record[field_name]) + "; width: 2; opacity: 1;"'
								  rotation='0 0 0'>
							  
						</a-entity>
						  
				</a-entity>

				
				

				<a-entity v-if='can_show_full_doc()' geometry="primitive: plane; height: 5; width: 8;" material="color: white" position='0 2.5 0' >
				
					<a-entity geometry="primitive: circle; radius: .25" material="color: red" position='-2.5 1.3 1' closedoc=''>
						<a-entity 	position=".9 0 0"
									text="font: aileronsemibold; color: white; align: left; value: Close; width: 2; height: 1; opacity: 1;">
						</a-entity>
					</a-entity>

					<a-entity  geometry="primitive: circle; radius: .25" material="color: green" position='0 1.3 1' 
								v-bind:openquerynativeapp='"" + get_viewed_query_id() ' >
						<a-entity 	position=".9 0 0"
									text="font: aileronsemibold; color: white; align: left; value: Open; width: 2; height: 1; opacity: 1;">
						</a-entity>
					</a-entity>
					
					<a-entity v-for="(field_name,index)  in  list_of_fields"
							  v-bind:position='(index - 2) + " 1 0"'
							  geometry="primitive: plane; width: auto; height: auto" 
							  material="color: white"
							  v-bind:text='"font: aileronsemibold;color: black; align: left; value: " + field_name + "; width: 2; "'
							  rotation='0 0 0'>
							  

							<a-entity v-for="(a_record,rindex)  in  list_of_records"
									  v-bind:position='"0 " + (-.2 - (rindex * 0.2)) + " 0"'
									  geometry="primitive: plane; width: auto; height: auto" material="color: white"
									  v-bind:text='"font: sourcecodepro;color: black; align: left; value: " + truncate(a_record[field_name]) + "; width: 2; "'
									  rotation='0 0 0'>
								  
							</a-entity>
							  
					</a-entity>
				</a-entity>



<a-box  v-if='!can_show_full_doc()'  material="color: white" position="-2 -7.5 0" height=19 depth=0  width=26> </a-box>
<a-box  v-if='!can_show_full_doc()'  material="color: white" position="-2 9.4 0" height=10 depth=0 width=25> </a-box>
<a-box  v-if='!can_show_full_doc()'  material="color: white" position="11.7 3 0" depth=0  height=3 width=25> </a-box>
<a-box  v-if='!can_show_full_doc()'  material="color: white" position="-8.2 2.5 0" depth=0  height=4 width=11> </a-box>

<a-entity id=scrollable_grid>
				
				<a-entity v-if='!can_show_full_doc()' v-for="(a_driver,index)  in  list_of_queries"
				   v-bind:position="(-0.9 + (get_x_position(index,list_of_queries.length)*0.5))+ ' ' + (3 - (get_y_position(index,list_of_queries.length)*0.6)) + ' -.1'"  
				   v-bind:color="(index % 2 == 0)?'blue':'green'"
				   
				   v-bind:text="'color: black; align: left; value: ' + a_driver.id.substr(a_driver.id.length - 10) + ' ; width: 2; '">
					   <a-entity  position="-0.8 .3 0" geometry='width: .3; height: .3; depth: 0.1;'
							      v-bind:griditem='"x: " + get_x_position(index,list_of_queries.length) + "; y:" + get_y_position(index,list_of_queries.length) + ";" +
								  "query_name: " +a_driver.id'
								  v-bind:preview='"id: " + a_driver.id + ";"'
					   mixin='gsd'  v-bind:color="(index % 2 == 0)?'blue':'green'" v-bind:log='"" + a_driver.id' >
							 <a-animation begin="mouseenter" attribute="rotation" 
											to="0 0 -90" dur="1000" direction="alternate"  repeat="1"></a-animation>
						</a-entity>
			   </a-entity>
</a-entity >

			   
			   
			   
			   
			   
			   <a-sphere radius=4 
						position='-100 0 0'></a-sphere>
			   <a-sphere radius=4
						position='100 0 0'></a-sphere>
			   <a-sphere  radius=4
						position='0 100 0'></a-sphere>
			   <a-sphere color=blue radius=4 position='0 -100 0'></a-sphere>
			   <a-sphere color=red radius=4 position='0 0 100'></a-sphere>
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
		return this.$store.state.list_of_output_records;
		} else {
		return [];
	};
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
  'output-table': output_table}


}
</script>





<style>
</style>
