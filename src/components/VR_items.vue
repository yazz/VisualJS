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




                <a-entity   id='related_items'  
                            position="-200 0 0"
                            >
                    <a-entity   
                                position="-.5 2.4 0"
                                mixin="RobotoFont"
                                text="color: black; align: left; value: Fun stuff ; width: 4; ">
                    </a-entity>
                    <a-box   width=1 height=0.4 depth=1 color=blue position="-1 1.4 0"></a-box>
                    <a-box   width=1 height=0.4 depth=1 color=green position="0.1 .7 0"></a-box>

                    <a-box   width=10 height=4 depth=1 color=gray position="0.1 .7 -4"></a-box>
                    
                    
                </a-entity>

                
                
                
                
                <a-entity   id='query_info'  
                            position="-200 -200 2"
                            >
                    <a-entity   
                                position="0.6 1.1 0">
                        <a-entity   
                                    position="-1.55 2 0"
                                    mixin="RobotoFont"
                                    text="color: black; align: left; value: Query info ; width: 6; ">
                        </a-entity>

                                    
                        <a-entity   position="-.5 1.4 0" mixin="RobotoFont"
                                    v-bind:text='"wrapPixels: 2000; color: black; align: left; value: Name: " + get_query_property(get_viewed_query_id(),"name") +"  ; width: 8; "'></a-entity>
                        <a-entity   position="-.5 1 0" mixin="RobotoFont"
                                    v-bind:text='"wrapPixels: 2000; color: black; align: left; value: Size: " + get_query_property(get_viewed_query_id(),"size") +" bytes ; width: 8; "'></a-entity>
                        <a-entity   position="-.5 .6 0" mixin="RobotoFont"
                                    v-bind:text='"wrapPixels: 2000; color: black; align: left; value: Location: " + get_query_property(get_viewed_query_id(),"fileName") +"  ; width: 8; "'></a-entity>                                
                        <a-entity   position="-.5 .2 0" mixin="RobotoFont"
                                    v-bind:text='"wrapPixels: 2000; color: black; align: left; value: Hash: " + get_query_property(get_viewed_query_id(),"hash") +" ; width: 8; "'></a-entity>
                        <a-entity   position="-.5 -.2 0" mixin="RobotoFont"
                                    v-bind:text='"wrapPixels: 2000; color: black; align: left; value: doc: " + get_viewed_query_file() +" ; width: 8; "'></a-entity>
                        <a-entity   position="-.5 -.6 0" mixin="RobotoFont"
                                    v-bind:text='"wrapPixels: 2000; color: black; align: left; value: Type: " + get_query_property(get_viewed_query_id(),"type") +" ; width: 8; "'></a-entity>
                        
                        <a-entity  	material='color: gray;opacity: .5;'  
                                    geometry='primitive: box; width: 2.5; height: .5; depth: .1.8;'
                                    position="1 -.8 0"
                                    mixin="RobotoFont"
                                    text='color: black; align: center; value: Close; width: 4; '
                                    goto='name: scrollable_grid;  distance: 4; duration: 300;' 
                                    >
                                        <a-animation begin="mouseenter" attribute="rotation"
                                                    to="0 0 4" dur="100" direction="alternate"  repeat="3"></a-animation>
                                               
                        </a-entity >

                    </a-entity>
                </a-entity>

                
                
                
                
                

<a-entity id='scrollable_grid' v-bind:refresh_vr_items='get_refresh_view_counter'>

				<a-entity   v-for="(a_query,index)  in  list_of_queries2()"
                            v-bind:id='a_query.id + "_upper"'
                            v-bind:position="((a_query.visible?-0.8:100) + (get_x_position(a_query.screen_index)*0.5))+ ' ' + (1.5 - (get_y_position(a_query.screen_index)*0.6)) + ' -.1'"
                            v-bind:color="(a_query.screen_index % 2 == 0)?'blue':'green'"
                            mixin="RobotoFont"
                            v-bind:text="'color: black; align: left; value: ' + a_query.name.substr(a_query.name.length - 10) + ' ; width: 2; '">
                            
					   <a-entity    position='-0.8 .3 0'
                                    v-bind:id='a_query.id + "_mid"'
									geometry="primitive: plane; width:.35;height: 0.35;"
							        v-bind:griditem='"" +
								    "   query_name: " + a_query.name +
								    ";  query_id: " + a_query.id +
                                    ";  query_saved_as: " + (a_query.hash?(a_query.hash + (a_query.fileName?"." + a_query.fileName.split(".").pop():"")):"") +                                   
					    			";  query_display: " + "" + a_query.fileName + 
                                    ";  query_size: " + a_query.size + "; " '
								v-bind:material='(a_query.driver != null?"src: driver_icons/" + a_query.driver + ".jpg;":false)'
								v-bind:color="(a_query.screen_index % 2 == 0)?'blue':'green'"
								v-bind:log='a_query?("queryFile: " + a_query.hash + (a_query.fileName?"." +a_query.fileName.split(".").pop():"") + 
                                ";queryId: "  + a_query.id + ";"):false' 
                                >
								<a-animation    begin="mouseenter" 
                                                attribute="rotation"
                                                v-bind:id='a_query.id + "_anim"'
                                                to="0 0 5" 
                                                dur="90" 
                                                direction="alternate"  
                                                repeat="3"></a-animation>
						</a-entity>
                        
                </a-entity>
                
                
                
                
                
                
                
                <a-entity
                    id='query_menu'
                    geometry="primitive: plane; width:35;height: 35; " 
                    material="color: lightgray; opacity: .98;"
                    v-bind:close_item_menu2='"queryId: "  + get_viewed_query_id() + ";"' 
                    v-bind:position='((is_visible(get_viewed_query_id()) && is_query_selected())?-4.5:-100) + " 2.4 -.01"'
                >
                	   <a-entity    position='.3 -1.07 .2'
                                    v-bind:id='"selected_item"'
									geometry="primitive: plane; width:1.2;height: 1.2;"
                                    v-bind:material='get_viewed_query_id()?"src: driver_icons/" + get_driver_name(get_viewed_query_id()) + ".jpg;":false'
                                >
						</a-entity>
                
                
                
                
                
                    <a-entity   id="view_doc"
                                geometry="primitive: plane; width:.70;height: .70; " 
                                material="color: green;"
                                v-bind:position='0.75 * 0 + " 0 .2"'
                                mixin="RobotoFont"
                                v-bind:view='"queryId: "  + get_viewed_query_id() + ";"' 
                                v-bind:text='get_viewed_query_id()?"color: white; align: center; value: View; width: 3;":false'
                                >
									<a-animation begin="mouseenter" attribute="rotation"
												to="0 0 3" dur="80" direction="alternate"  repeat="3"></a-animation>
                    </a-entity>
                    <a-entity   id="open_doc"
                                geometry="primitive: plane; width:.70;height: .70;  " 
                                material="color: gray;"
                                v-bind:position='0.75 * 1 + " 0 .2"'
                                mixin="RobotoFont"
                                v-bind:open_file='get_viewed_query_file()?("" + get_viewed_query_file()):false '
                                v-bind:text='get_viewed_query_id()?"color: white; align: center; value: Open; width: 3;":false'
                                >
									<a-animation begin="mouseenter" attribute="rotation"
												to="0 0 3" dur="80" direction="alternate"  repeat="3"></a-animation>
                    </a-entity>









                    <a-entity   id="view_related_docs"
                                geometry="primitive: plane; width:.70;height: .70;  " 
                                material="color: brown;"
                                v-bind:position='0.75 * 2 + " 0 .2"'
                                mixin="RobotoFont"
                                v-bind:related_files='get_viewed_query_id()?("" + get_viewed_query_id()):false ' 
                                v-bind:text='"color: white; align: center; value: Related; width: 3;"'
                                >
									<a-animation begin="mouseenter" attribute="rotation"
												to="0 0 3" dur="80" direction="alternate"  repeat="3"></a-animation>
                    </a-entity>


                    <a-entity   id="view_doc_info"
                                geometry="primitive: plane; width:.70;height: .70;  " 
                                material="color: gray;"
                                v-bind:position='0.75 * 3 + " 0 .2"'
                                mixin="RobotoFont"
                                v-bind:show_query_info='"queryId: "  + get_viewed_query_id() + ";"' 
                                v-bind:text='"color: white; align: center; value: Info; width: 3;"'
                                >
									<a-animation begin="mouseenter" attribute="rotation"
												to="0 0 3" dur="80" direction="alternate"  repeat="3"></a-animation>
                    </a-entity>

                    
                    <a-entity   id="view_doc_fun"
                                geometry="primitive: plane; width:.70;height: .70;  " 
                                material="color: blue;"
                                v-bind:position='0.75 * 4 + " 0 .2"'
                                mixin="RobotoFont"
                                v-bind:show_related='"queryId: "  + get_viewed_query_id() + ";"' 
                                v-bind:text='"color: white; align: center; value: Fun; width: 3;"'
                                >
									<a-animation begin="mouseenter" attribute="rotation"
												to="0 0 3" dur="80" direction="alternate"  repeat="3"></a-animation>
                    </a-entity>

                    <a-entity   id="close_doc"
                                geometry="primitive: plane; width:.70;height: .70;  " 
                                material="color: black;"
                                v-bind:position='0.75 * 5 + " 0 .2"'
                                mixin="RobotoFont"
                                v-bind:close_item_menu='"queryId: "  + get_viewed_query_id() + ";"' 
                                v-bind:text='"color: white; align: center; value: Close; width: 3;"'
                                >
									<a-animation begin="mouseenter" attribute="rotation"
												to="0 0 3" dur="80" direction="alternate"  repeat="3"></a-animation>
                    </a-entity>





                    <a-entity position="3.6 -2.985 .2" id='doc_details'>

                        <a-entity   geometry="primitive: plane; height: 5; width: 8;" 
                                    material="color: white" 
                                    v-bind:position='(can_show_full_doc()?0:-100) + " 2.5 -1"' >



                        <a-entity v-for="(field_name,index)  in  list_of_fields"
                                  v-bind:position='(can_show_full_doc()?(index + 1.8):-100) + " -1.15 2.5"'
                                  geometry="primitive: plane; width: auto; height: auto"
                                  material="color: white"
                                  rotation='0 0 0'>

                                <a-entity v-bind:position='(is_spreadsheet(get_viewed_query_id())?-1.5:-100) + " 0 0.6"' 
                                          geometry="primitive: plane; width: 2; height: 0.2" 
                                          material="color: gray; opacity: 1;">
                                    <a-entity position="0.1 0 0" 
                                              geometry="primitive: plane; width: 2; height: 0.2" 
                                              mixin="AileronFont"
                                              material="color: gray; opacity: 1;"
                                              v-bind:text='"color: white; align: left; value: " + field_name + "; width: 2; "'>
                                    </a-entity>
                                </a-entity>

                                <a-entity v-for="(a_record,rindex)  in  list_of_records" 
                                          v-bind:position='(is_spreadsheet(get_viewed_query_id())?-1.5:-100) + " " + (-.2 - (rindex * 0.2)) + " 0.6"'
                                          geometry="primitive: plane; width: 2; height: 0.2" 
                                          material="color: white"
                                          rotation='0 0 0'>
                                    <a-entity v-bind:position='".1 0 0"'
                                              geometry="primitive: plane; width: 2; height: 0.2" 
                                              material="color: white"
                                              mixin="SourceCodeProFont"
                                              v-bind:text='"color: black; align: left; value: " + truncate(a_record[field_name]) + "; width: 2; opacity: 1;"'
                                              rotation='0 0 0'>

                                    </a-entity>

                                </a-entity>
                                
                                
                                
                                
                                <a-entity   id='show_all_vr_records'
                                            v-bind:position='(is_document(get_viewed_query_id())?0:-100) + " 0 0"'
                                >
                                    <a-entity v-for="(a_record,rindex)  in  list_of_records"  
                                              v-bind:position='".5 " + (-0.01 - (rindex * 0.2)) + " 0.6"'
                                              geometry="primitive: plane; width: 6; height: 0.2" 
                                              material="color: white; opacity: 1;"
                                              mixin="SourceCodeProFont"
                                              v-bind:text='"color: black; align: left; value: " + truncate2(a_record[field_name]) + "; width: 6; opacity: 1; wrapPixels: 2000; "'
                                              rotation='0 0 0'>

                                    </a-entity>
                                </a-entity>


                                
                                <a-entity   
                                            v-bind:position='(is_3d(get_viewed_query_id())?-1:-100) + " .3 0"' >
                                
                                    <a-entity 
                                        id='gltf_preview'
                                        v-bind:gltf-model='(get_viewed_query_file().indexOf(".glb") != -1)?"/docs2/gsd_" + get_viewed_query_file():false'
                                        scale=".2 .2 .2" 
                                        v-bind:position='((get_viewed_query_file().indexOf(".glb") != -1)?"0":"-100") + "  -1 0" '
                                        preview_gltf=''>
                                        <a-animation 
                                            begin="mouseenter" 
                                            attribute="rotation"
                                            to="0 360 20" dur="10000" direction="alternate"  repeat="3"></a-animation></a-entity>
                                    <a-entity 
                                        geometry="primitive: plane; width: 0; height: 0; "
                                        material='color: white;'                                        
                                        v-bind:text='"color: black; align: left; value: " + get_error_message() + "; width: 4; opacity: 1;"'
                                        position="0 0 0" >
                                    </a-entity>
                                </a-entity>


                            </a-entity>
                        </a-entity>
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
        list_of_queries2: function () {
            //console.log("*********** list_of_queries2: " + window.xcd++)
            return window.sqlGetAllQueriesAndUiCached
        },
        list_of_queries_length: function () {
            //console.log("*********** list_of_queries_length: " + window.xcd++)
            //window.sqlGetQueriesLengthCached=100
            return window.sqlGetQueriesLengthCached
        },
        
        get_viewed_query_id: function() {
            return this.$store.state.viewed_query_id;
        },
        
        is_query_selected: function() {
            if ( this.$store.state.viewed_query_id == null) { return false; };
            if ( this.$store.state.viewed_query_id.length == 0) { return false; };
            return true
        },
        
        get_viewed_query_file: function() {
            if (this.$store.state.viewed_query_file == null) {
                return "";
            }
            return this.$store.state.viewed_query_file;
        },
        
        can_show_full_doc: function() {
            return this.$store.state.show_full_doc;
        },
        
		get_x_position: function(index) {
            return index % window.queryGridWidthCached;
        },
        
        truncate: function(txt) {
            return (txt?txt.toString().substring(0,10):'');
        },
        
        truncate2: function(txt) {
            return (txt?txt.toString().substring(0,100):'');
        },
        
        get_y_position: function(index) {
            var rawQuotient = index / window.queryGridWidthCached;
            var remainder = rawQuotient % 1;
            var quotient = rawQuotient - remainder;
            return quotient ;
        },
        
    
        is_document: function (id) {
            if (id == null) {
                return false;
            }
            var qq = window.sqlGetQueryById(id);
            if (qq != null) {
                if (qq.type != null) {
                    if ((qq.type.indexOf("DOCUMENT") != -1) ||(qq.type.indexOf("DOC") != -1) || (qq.type.indexOf("DOCX") != -1)|| (qq.type.indexOf("PDF") != -1)) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            };
            return false;
        },
    
    
        is_spreadsheet: function (id) {
            if (id == null) {
                return false;
            }
            var qq = window.sqlGetQueryById(id);
            if (qq != null) {
                if (qq.type != null) {
                    if ((qq.type.indexOf("SPREADSHEET") != -1) || (qq.type.indexOf("CSV") != -1)) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            };
            return false;
        },
        is_3d: function (id) {
            if (id == null) {
                return false;
            }
            var qq = window.sqlGetQueryById(id);
            if (qq != null) {
                if (qq.type != null) {
                    if (qq.type.indexOf("GLB") != -1) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            };
            return false;
        },
        get_driver_name: function (id) {
            if (id == null) {
                return "";
            }
            var qq = window.sqlGetQueryById(id);
            if (qq != null) {
                return qq.driver; 
            };
            //console.log("rt.driver  not found: ")
            return "";
        },
        get_query_property: function (id, prop) {
            if (id == null) {
                return "";
            }
            var qq = window.sqlGetQueryById(id);
            if (qq != null) {
                return qq[prop]; 
            };
            //console.log("rt.fileName  not found: ")
            return "";
        },
    is_visible: function(id) {
        if (id == null) {
            return false;
        }
        if (id.length == 0) {
            return false;
        }
        var qm = window.sqlGetQueryUiById(id);
        if (!qm) {
            return false;
        }
        return qm.visible;
    },
    get_error_message() {
        return this.$store.state.error_message;
    }

  },
  components: {
	  'output-table': output_table
	}

}
</script>





<style>
</style>
