<template>
			  <a-entity position='5 -10 -20' id='vr_items'>

                        <a-entity position="0 4 -1.9" id='vr_file_name_2'
                                    scale="1 1 1"
									geometry="primitive: plane; width: 3.9; height: 1.9;" material="color: white;opacity: 1;"
                                    mixin="RobotoFont"
									v-bind:text='"color: black; align: left; value:  ; width: 4; "'>
						</a-entity>
						 <a-entity position="0 3.6 -1.9" id='vr_file_size_2'
                                    scale="1 1 1"
									geometry="primitive: plane; width: 3.9; height: 1.9;" material="color: white;opacity: 1;"
                                    mixin="RobotoFont"
									v-bind:text='"color: black; align: left; value:  ; width: 4; "'>
						</a-entity>
						 <a-entity position="0 3.2 -1.9" id='vr_file_saved_as'
                                    scale="1 1 1"
									geometry="primitive: plane; width: 3.9; height: 1.9;" material="color: white;opacity: 1;"
                                    mixin="RobotoFont"
									v-bind:text='"color: black; align: left; value: ; width: 4; "'>
						</a-entity>

                
                

				<a-entity position="-1.4 4.7 .6" id=vr_file_name
						  geometry="primitive: plane; width: auto; height: auto" material="color: white"
                          mixin="RobotoFont"
						  text='color: black; align: left; value: ; width: 4;  '
						  rotation='0 0 0'>
				</a-entity>

				<a-entity position="10 -10 -10" id='doc_details'>

					<a-entity v-if='can_show_full_doc()' geometry="primitive: plane; height: 5; width: 8;" material="color: white" position='0 2.5 -1' >

						<a-entity geometry="primitive: box; width:.5;height: 0.5;depth: 0.1;" material="color: red"
						v-if='get_vr_type_mouse'  position='-4 -2.5 1.1' closedoc=''>
								<a-entity 	position="1 0 0.07"
                                            mixin="AileronFont"
											text="color: white; align: left; value: Close; width: 2; height: 1; opacity: 1;">
								</a-entity>
						</a-entity>
						<a-entity  v-if='get_vr_type_mouse' geometry="primitive: box; width:.5;height: 0.5;depth: 0.1;" material="color: green"
						position='-4 -1 1.1'
									v-bind:open_file='get_viewed_query_file()?("" + get_viewed_query_file()):false ' >
							<a-entity 	position="1 0 0.07"
                                        mixin="AileronFont"
										text="color: white; align: left; value: Open; width: 2; height: 1; opacity: 1;">
							</a-entity>
						</a-entity>

						<a-entity  v-if='get_vr_type_mouse' geometry="primitive: box; width:.5;height: 0.5;depth: 0.1;" material="color: blue"
						position='-4 -.2 1.1'
									v-bind:related_files='get_viewed_query_id()?("" + get_viewed_query_id()):false ' 
                                    >
							<a-entity 	position=".9 0 0.07"
                                        mixin="AileronFont"
										text="color: white; align: left; value: Related; width: 2; height: 1; opacity: 1;">
							</a-entity>
						</a-entity>

                        
						<a-entity v-if='get_vr_type_move' geometry="primitive: box; width:.6;height: 0.6;depth: 0.6;" material="color: red"
						position='-6 -3.4 .7' closedoc='' rotation='0 40 0'>
						</a-entity>
						<a-entity v-if='get_vr_type_move' 	position="-5 -3.5 -1" rotation='0 40 0'
                                    mixin="AileronFont"
									text="color: red; align: middle; value: Close; width: 8; height: 2; opacity: 1;">
						</a-entity>


					<a-entity v-if='can_show_full_doc()' v-for="(field_name,index)  in  list_of_fields"
							  v-bind:position='(index + .5) + " -1 2.5"'
							  geometry="primitive: plane; width: auto; height: auto"
							  material="color: white"
							  rotation='0 0 0'>

                            <a-entity position='-1.5 0 0.6' v-if='!is_document(get_viewed_query_id())'
                                      mixin="AileronFont"
                                      v-bind:text='"color: black; align: left; value: " + field_name + "; width: 2; "'>
                            </a-entity>

							<a-entity v-for="(a_record,rindex)  in  list_of_records" v-if='!is_document(get_viewed_query_id())'
									  v-bind:position='"-1.5 " + (-.2 - (rindex * 0.2)) + " 0.6"'
									  geometry="primitive: plane; width: 2; height: 0.2" material="color: white"
                                      mixin="SourceCodeProFont"
									  v-bind:text='"color: black; align: left; value: " + truncate(a_record[field_name]) + "; width: 2; opacity: 1;"'
									  rotation='0 0 0'>

							</a-entity>
                            
                            
                            
                            
							<a-entity v-for="(a_record,rindex)  in  list_of_records" v-if='is_document(get_viewed_query_id())'
									  v-bind:position='"1 " + (-.2 - (rindex * 0.2)) + " 0.6"'
									  geometry="primitive: plane; width: 6; height: 0.2" material="color: white"
                                      mixin="SourceCodeProFont"
									  v-bind:text='"color: black; align: left; value: " + truncate2(a_record[field_name]) + "; width: 6; opacity: 1; wrapPixels: 2000; "'
									  rotation='0 0 0'>

							</a-entity>


					</a-entity>
						</a-entity>
					</a-entity>



<a-entity   id='related_items'  
            position="-200 0 0"
            >
    <a-entity   
                position="-.5 2.4 0"
                text="color: black; align: left; value: Related items ; width: 4; ">
    </a-entity>
    <a-box   witdth=1 height=0.4 depth=1 color=blue position="-1 1.4 0"></a-box>
    <a-box   witdth=1 height=0.4 depth=1 color=green position="0.1 .7 0"></a-box>
    
</a-entity>


<a-entity id='scrollable_grid' v-bind:refresh_vr_items='get_refresh_view_counter'>

				<a-entity  v-for="(a_driver,index)  in  list_of_queries"
                    v-bind:id='a_driver.id + "_upper"'
				   v-bind:position="((is_visible(a_driver.id)?-0.8:100) + (get_x_position(get_index(a_driver.id),list_of_queries.length)*0.5))+ ' ' + (1.5 - (get_y_position(get_index(a_driver.id),list_of_queries.length)*0.6)) + ' -.1'"
				   v-bind:color="(get_index(a_driver.id) % 2 == 0)?'blue':'green'"
				   v-bind:text="'color: black; align: left; value: ' + a_driver.name.substr(a_driver.name.length - 10) + ' ; width: 2; '">
					   <a-entity    position='-0.8 .3 0'
                                    v-bind:id='a_driver.id + "_mid"'
									geometry="primitive: plane; width:.35;height: 0.35;"
							        v-bind:griditem='"x: " + get_x_position(get_index(a_driver.id),list_of_queries.length) + "; y:" + get_y_position(get_index(a_driver.id),list_of_queries.length) + ";" +
								    "   query_name: " + a_driver.name +
								    ";  query_id: " + a_driver.id +
                                    ";  query_saved_as: " + (a_driver.hash?(a_driver.hash + (a_driver.fileName?"." + a_driver.fileName.split(".").pop():"")):"") +                                   
					    			";  query_display: " + "" + a_driver.fileName + 
                                    ";  query_size: " + a_driver.size + "; " '
								mixin='gsd'  
								v-bind:material2='"src: driver_icons/" + a_driver.driver + ".jpg;"'
								v-bind:material='"color: gray;"'
								v-bind:color="(get_index(a_driver.id) % 2 == 0)?'blue':'green'"
								v-bind:log='"x: " + get_x_position(index,list_of_queries.length) + "; y:" + get_y_position(index,list_of_queries.length) + ";queryFile: " + a_driver.hash + (a_driver.fileName?"." +a_driver.fileName.split(".").pop():"") + 
                                ";queryId: "  + a_driver.id + ";"' 
                                >
								<a-animation begin="mouseenter" attribute="rotation"
                                    v-bind:id='a_driver.id + "_anim"'
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
  get_refresh_view_counter: function () {
      return this.$store.state.refresh_view_counter;
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
	truncate2: function(txt) {
	    return (txt?txt.toString().substring(0,100):'');
	},
	get_y_position: function(index, total) {
		var cols = (Math.ceil(Math.sqrt(total)));
		var rawQuotient = index / cols;
		var remainder = rawQuotient % 1;
		var quotient = rawQuotient - remainder;
		//console.log('get_y_position( ' + index + ', ' + total + ') = ' + quotient);
		return quotient ;
	},
    is_document: function (id) {
        var qq = this.$store.getters.list_of_queries;
        for (var i =0 ; i < qq.length; i++) {
            var rt = qq[i];
            if (rt.id == id) {
                //console.log("rt.driver: " + rt.type)
                if (rt.type.indexOf("DOCUMENT") != -1) {
                    return true;
                } else {
                    return false;
                }
            }
        }
        //console.log("rt.fileName  not found: ")
        return false;
    },
    is_visible: function(id) {
        var qm = this.$store.state.query_map[id];
        if (!qm) {
            return false;
        }
        //return false;
        console.log(" this.$store.state.query_map[id].visible = " + this.$store.state.query_map[id].visible);
        return this.$store.state.query_map[id].visible;
    },
    get_index: function(id) {
        var qm = this.$store.state.query_map[id];
        if (!qm) {
            return -1;
        }
        //return false;
        return this.$store.state.query_map[id].index;
    }

  },
  components: {
	  'output-table': output_table
	}

}
</script>





<style>
</style>
