<template>
			  <a-entity position='0 0 -5' id='vr_home' >

					<a-entity 	v-if='vr_type=="move"' id=vr_objects
								position='7 -6 0'>
					  <VR-items v-bind:vr_type='get_vr_type'></VR-items>
					 </a-entity >



					<a-entity 	v-if='vr_type=="mouse"'
								id='vr_objects'
								position='7 -6 0'>
						<VR-items v-bind:vr_type='get_vr_type'></VR-items>
					 </a-entity >





					 <a-entity position="1.4 -2.1 2">

						 <a-entity position="0 3 0"
									geometry="primitive: plane; width: 1.9; height: 1.9;" material="color: green"
									v-bind:text='"font: roboto; color: white; align: center; value: My data ; width: 6; "'
									rotation='0 0 0' goto='name: scrollable_grid; distance: 7;'>
									<a-animation begin="mouseenter" attribute="rotation"
												to="0 0 1" dur="100" direction="alternate"  repeat="3"></a-animation>
													</a-entity>

						<a-entity position="0 1 0"
								 geometry="primitive: plane; width: 1.9; height: 1.9;" material="color: yellow"
								 v-bind:text='"font: roboto; color: black; align: center; value:  ; width: 2; "'
								 rotation='0 0 0' >
								<a-animation begin="mouseenter" attribute="rotation"
												to="0 0 1" dur="100" direction="alternate"  repeat="3"></a-animation>
						</a-entity>

						 <a-entity position="-2 3 0"
									geometry="primitive: plane; width: 1.9; height: 1.9;" material="color: red"
									v-bind:text='"font: roboto; color: white; align: center; value:  ; width: 2; "'
									rotation='0 0 0' id='red_home'>
									<a-animation begin="mouseenter" attribute="rotation"
														to="0 0 1" dur="100" direction="alternate"  repeat="3"></a-animation>
						</a-entity>

						<a-entity position="-2 1 0"
								 geometry="primitive: plane; width: 1.9; height: 1.9;" material="color: blue"
								 v-bind:text='"font: roboto; color: white; align: center; value:  ; width: 2; "'
								 rotation='0 0 0'>
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
