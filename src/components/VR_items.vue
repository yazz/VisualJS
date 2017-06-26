<template>
			  <a-entity position='0 0 0' >
				
                <a-box  id=m1 v-if='vr_type=="mouse"' material="color: white" position="-13 0 0" depth=0 reset-view height=10 width=20> </a-box>
                <a-box  id=m2 v-if='vr_type=="mouse"' material="color: white" position="13 0 0" depth=0 reset-view height=10 width=20> </a-box>
                <a-box  id=m3 v-if='vr_type=="mouse"' material="color: white" position="-3 -8 0" height=15 depth=0 reset-view width=30> </a-box>
                <a-box  id=m4 v-if='vr_type=="mouse"' material="color: white" position="-3 12 0" height=14 depth=0 reset-view width=30> </a-box>
			
                <a-box2  id=m5 v-if='vr_type=="move"' material="color: white" position="-13 0 0" depth=0 reset-view height=10 width=20> </a-box2>
                <a-box2  id=m6 v-if='vr_type=="move"' material="color: white" position="13 0 0" depth=0 reset-view height=10 width=20> </a-box2>
                <a-box2  id=m7 v-if='vr_type=="move"' material="color: white" position="-3 -8 0" depth=0 height=15 reset-view width=30> </a-box2>
                <a-box2  id=m8 v-if='vr_type=="move"' material="color: white" position="-3 12 0" depth=0 height=14 reset-view width=30> </a-box2>
			
				<a-entity position="0 6 0"
						  geometry="primitive: plane; width: auto; height: auto" material="color: white"
						  v-bind:text='"font: roboto; color: black; align: left; value: Go Share Data VR "  + vr_type + "; width: 2; "'
						  rotation='0 0 0'>
				</a-entity>
			
				<a-entity position="-1.5 4.7 0" id=vr_file_name
						  geometry="primitive: plane; width: auto; height: auto" material="color: white"
						  text='font: roboto; color: black; align: left; value: ; width: 4; '
						  rotation='0 0 0'>
				</a-entity>

				<a-entity v-for="(field_name,index)  in  list_of_fields"
						  v-bind:position='(index + 1) + " 4.3 0"'
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



<a-box  material="color: white" position="-2 -7.5 0" height=19 depth=0  width=26> </a-box>
<a-box  material="color: white" position="-2 9.4 0" height=10 depth=0 width=25> </a-box>
<a-box  material="color: white" position="11.7 3 0" depth=0  height=3 width=25> </a-box>
<a-box  material="color: white" position="-8.2 2.5 0" depth=0  height=4 width=11> </a-box>

<a-entity id=scrollable_grid>
				
				<a-entity v-for="(a_driver,index)  in  list_of_queries"
				   v-bind:position="(-1 + (get_x_position(index,list_of_queries.length)*0.5))+ ' ' + (3.5 - (get_y_position(index,list_of_queries.length)*0.6)) + ' -.1'"  
				   v-bind:color="(index % 2 == 0)?'blue':'green'"
				   v-bind:text="'color: black; align: left; value: ' + a_driver.id.substr(a_driver.id.length - 10) + ' ; width: 2; '">
					   <a-entity  position="-0.8 .3 0" geometry='width: .3; height: .3; depth: 0.1;'
							      v-bind:griditem='"x: " + get_x_position(index,list_of_queries.length) + "; y:" + get_y_position(index,list_of_queries.length) + ";" +
								  "query_name: " +a_driver.id'
					   mixin='gsd'  v-bind:color="(index % 2 == 0)?'blue':'green'" v-bind:log='"" + a_driver.id'>
							 <a-animation begin="mouseenter" attribute="rotation" 
											to="0 0 -90" dur="1000" direction="alternate"  repeat="1"></a-animation>
						</a-entity>
			   </a-entity>
</a-entity >

			   
			   
			   
			   
			   
			   <a-sphere src='https://upload.wikimedia.org/wikibooks/en/thumb/0/06/Web2.0.jpg/400px-Web2.0.jpg' radius=4 
						position='-100 0 0'></a-sphere>
			   <a-sphere src='https://upload.wikimedia.org/wikibooks/en/thumb/0/06/Web2.0.jpg/400px-Web2.0.jpg' radius=4
						position='100 0 0'></a-sphere>
			   <a-sphere src='https://upload.wikimedia.org/wikibooks/en/thumb/0/06/Web2.0.jpg/400px-Web2.0.jpg' radius=4
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
