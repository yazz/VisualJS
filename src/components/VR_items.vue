<template>
			  <a-entity position='0.5   -.4   2' id='vr_items'>

              <a-entity   v-bind:position='(can_see_search_results?-100:0) + "  0   0"'>
                        <a-entity position="5.13   .2   -1.9" id='vr_file_name_2'
                                    scale="1 1 1"
									geometry="primitive: plane; " material="color: white;opacity: 1;"
                                    mixin="RobotoFont"
									v-bind:text='"color: black; align: left; value:  ; width: 4; "'>
						</a-entity>
						 <a-entity position="5.13 -.2 -1.9" id='vr_file_size_2'
                                    scale="1 1 1"
									geometry="primitive: plane; " material="color: white;opacity: 1;"
                                    mixin="RobotoFont"
									v-bind:text='"color: black; align: left; value:  ; width: 4; "'>
						</a-entity>
						 <a-entity  position="5.13 -.8 -1.9" id='vr_file_saved_as'
                                    scale="1 1 1"
									geometry="primitive: plane; " material="color: white;opacity: 1;"
                                    mixin="RobotoFont"
									v-bind:text='"color: black; align: left; value: ; width: 4; "'>
                                    </a-entity>
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






                <a-entity   id='history_info'
                            position="-500 -200 2"
                            >
                    <a-entity
                                position="0.6 1.1 0">
                        <a-entity
                                    position="-1.55 2 0"
                                    mixin="RobotoFont"
                                    text="color: black; align: left; value: Query history ; width: 6; ">
                        </a-entity>


                    <a-box   width=.4 height=0.4 depth=.4 color=blue position="-.5 1.4 0">
                                        <a-animation begin="mouseenter" attribute="rotation"
                                                    to="0 0 4" dur="100" direction="alternate"  repeat="3"></a-animation>
                    </a-box>

                    <a-box   width=.4 height=0.4 depth=.4 color=green position="-1.1 .7 0">
                                        <a-animation begin="mouseenter" attribute="rotation"
                                                    to="0 0 4" dur="100" direction="alternate"  repeat="3"></a-animation>
                    </a-box>


                    <a-box   width=.4 height=0.4 depth=.4 color=green position="0.1 .7 0">
                                        <a-animation begin="mouseenter" attribute="rotation"
                                                    to="0 0 4" dur="100" direction="alternate"  repeat="3"></a-animation>
                    </a-box>


                        <a-entity  	material='color: gray;opacity: .5;'
                                    geometry='primitive: box; width: 2.5; height: .5; depth: .1.8;'
                                    position="3 -2.8 0"
                                    mixin="RobotoFont"
                                    text='color: black; align: center; value: Close; width: 4; '
                                    goto='name: vr_home;  distance: 5; duration: 300;'
                                    >
                                        <a-animation begin="mouseenter" attribute="rotation"
                                                    to="0 0 4" dur="100" direction="alternate"  repeat="3"></a-animation>

                        </a-entity >
                    </a-entity>
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
                                    goto='name: vr_home;  distance: 5; duration: 300;'
                                    >
                                        <a-animation begin="mouseenter" attribute="rotation"
                                                    to="0 0 4" dur="100" direction="alternate"  repeat="3"></a-animation>

                        </a-entity >

                    </a-entity>
                </a-entity>







<a-entity
    id='scrollable_grid' v-bind:refresh_vr_items='get_refresh_view_counter'
    rotation='-15 0 0'
          >

				<a-entity   v-for="(a_query,index)  in  list_of_queries2()" :key="a_query.id">
                    <VR-grid-item v-bind:a_query='a_query'>

                    </VR-grid-item>
                </a-entity>


</a-entity>




                <a-entity
                    id='query_menu2'
                    material="color: lightgray; opacity: .8;"
                    v-bind:position='((( !in_show_quickview() && is_visible(get_viewed_query_id()) && is_query_selected())?-3.88:-100) + 4.64) + " 1.4 .1"'
                >
                	   <a-entity
                                    position='2.74 -.55 .02'
                                    v-bind:id='"selected_item"'
									geometry="primitive: plane; width:1;height: 1;"
                                    v-bind:material='get_viewed_query_id()?"src: driver_icons/" + get_driver_name(get_viewed_query_id()) + ".jpg;":false'
                                >
						</a-entity>






                    <a-entity   id="open_web"
                                geometry="primitive: plane; width:.40;height: .40;  "
                                material="color: darkblue;"
                                position='1.10 .2 .02'
                                mixin="RobotoFont"
                                open_web=''
                                text='color: white; align: center; value: Quickview; width: 1.8;'
                                ><a-animation begin="mouseenter" attribute="rotation"
												to="0 0 3" dur="80" direction="alternate"  repeat="3"></a-animation></a-entity>



                    <a-entity   id="open_doc"
                                geometry="primitive: plane; width:.40;height: .40;  "
                                material="color: gray;"
                                position='1.55 .2 .02'
                                mixin="RobotoFont"
                                open_file=''
                                text='color: white; align: center; value: Open; width: 1.8;'
                                ><a-animation begin="mouseenter" attribute="rotation"
												to="0 0 3" dur="80" direction="alternate"  repeat="3"></a-animation></a-entity>


                    <a-entity   id="view_related_docs"
                                geometry="primitive: plane; width:.40;height: .40;  "
                                material="color: brown;"
                                position='2.00 .2 .02'
                                mixin="RobotoFont"
                                related_files=''
                                text='color: white; align: center; value: Related; width: 1.8;'
                                ><a-animation begin="mouseenter" attribute="rotation"
												to="0 0 3" dur="80" direction="alternate"  repeat="3"></a-animation></a-entity>



                    <a-entity   id="view_doc_info"
                                geometry="primitive: plane; width:.40;height: .40;  "
                                material="color: gray;"
                                position='2.45 .2 .02'
                                mixin="RobotoFont"
                                v-bind:show_query_info='"queryId: "  + get_viewed_query_id() + ";"'
                                v-bind:text='"color: white; align: center; value: Info; width: 1.8;"'
                                ><a-animation begin="mouseenter" attribute="rotation"
												to="0 0 3" dur="80" direction="alternate"  repeat="3"></a-animation></a-entity>




                    <a-entity   id="close_doc2"
                                geometry="primitive: plane; width:.40;height: .40;  "
                                material="color: black;"
                                position='2.90 .2 .02'
                                mixin="RobotoFont"
                                v-bind:close_item_menu='"queryId: "  + get_viewed_query_id() + ";"'
                                v-bind:text='"color: white; align: center; value: Close; width: 1.8;"'
                                ><a-animation begin="mouseenter" attribute="rotation"
												to="0 0 3" dur="80" direction="alternate"  repeat="3"></a-animation></a-entity>

                </a-entity>












                    <a-entity position="2.3 0" id='doc_details'>

                        <a-entity   geometry="primitive: plane; height: 5; width: 18;"
                                    material="color: white"
                                    v-bind:position='(in_show_quickview() && can_show_full_doc() && is_database(get_viewed_query_id())?-7:-100) + " 2.3  -1"' >

                        <a-entity
                            geometry="primitive: plane; width: 40; height: 10; "
                            material='color: white;  opacity: .9'
                            close_quickview=''
                            v-bind:text='"color: black; align: left; value: " + get_error_message() + "; width: 4;;"'
                            position="0 0 0" ></a-entity>


                        <a-entity v-for="(field_name,index)  in  list_of_fields"
                                  :key="field_name"
                                  v-bind:position='(can_show_full_doc()?(index + 6.0):-100) + " -1.15 2.5"'
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

                                <a-entity v-for="(a_record,rindex)  in  list_of_records()"
                                          :key="a_record.id"
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




                                <a-entity   id='show_all_vr_records'  v-bind:position='(is_document(get_viewed_query_id())?0:-100) + " 0 0"'>
                                    <a-entity v-for="(a_record,rindex)  in  list_of_records()"
                                              :key="a_record.id"
                                              v-bind:position='".5 " + (-0.01 - (rindex * 0.2)) + " 0.6"'
                                              geometry="primitive: plane; width: 6; height: 0.2"
                                              material="color: white; opacity: 1;"
                                              mixin="SourceCodeProFont"
                                              v-bind:text='"color: black; align: left; value: " + truncate2(a_record[field_name]) + "; width: 6; opacity: 1; wrapPixels: 2000; "'
                                              rotation='0 0 0'>

                                    </a-entity>
                                </a-entity>




                            </a-entity>
                        </a-entity>
                    </a-entity>





















                    <a-entity
                                v-bind:position='((in_show_quickview() && is_3d(get_viewed_query_id()))?0:-100) + " 2.3 0"' >

                        <a-entity
                            geometry="primitive: plane; width: 10; height: 10; "
                            material='color: white;  opacity: .9'
                            close_quickview=''
                            v-bind:text='"color: black; align: left; value: " + get_error_message() + "; width: 4;;"'
                            position="0 0 0" ></a-entity>


                        <a-entity
                            id='gltf_preview2'
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



























                <a-entity
                    id='query_menu'
                    geometry="primitive: plane; width:35;height: 35; "
                    material="color: lightgray; opacity: .98;"
                    v-bind:position='((is_visible(get_viewed_query_id()) && is_query_selected())?-100:-100) + " 2.4 -.01"'
                >
                	   <a-entity    position='.3 -1.07 .2'
                                    v-bind:id='"selected_item"'
									geometry="primitive: plane; width:1.2;height: 1.2;"
                                    v-bind:material='get_viewed_query_id()?"src: driver_icons/" + get_driver_name(get_viewed_query_id()) + ".jpg;":false'
                                >
						</a-entity>

                    <a-entity   id="view_doc_related_graph"
                                geometry="primitive: plane; width:.70;height: .70;  "
                                material="color: green;"
                                v-bind:position='0.75 * 4 + " 0 .2"'
                                mixin="RobotoFont"
                                v-bind:show_history_info='"queryId: "  + get_viewed_query_id() + ";"'
                                v-bind:text='"color: white; align: center; value: History; width: 3;"'
                                >
									<a-animation begin="mouseenter" attribute="rotation"
												to="0 0 3" dur="80" direction="alternate"  repeat="3"></a-animation>
                    </a-entity>



                    <a-entity   id="view_doc_fun"
                                geometry="primitive: plane; width:.70;height: .70;  "
                                material="color: blue;"
                                v-bind:position='0.75 * 6 + " 0 .2"'
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
                                v-bind:position='0.75 * 7 + " 0 .2"'
                                mixin="RobotoFont"
                                v-bind:close_item_menu='"queryId: "  + get_viewed_query_id() + ";"'
                                v-bind:text='"color: white; align: center; value: Close; width: 3;"'
                                >
									<a-animation begin="mouseenter" attribute="rotation"
												to="0 0 3" dur="80" direction="alternate"  repeat="3"></a-animation>
                    </a-entity>








</a-entity >







			</a-entity>
</template>





<script>
import VR_grid_item             from './VR_grid_item.vue'

export default {
    name: 'VR-items'
    ,


    init: function () {
        // Set up the tick throttling.
        this.tick = AFRAME.utils.throttleTick(this.tick, 100, this);
    }
    ,



    /**
    * Tick function that will be wrapped to be throttled.
    */
    tick: function (t, dt) {}
    ,



    props: ['vr_type']
    ,


    computed: {
        get_refresh_view_counter: function () {
            return this.$store.state.refresh_view_counter;
        }
        ,







                can_see_search_results: function () {
                    return this.$store.state.show_related
                    //return true
                }
                ,



        get_vr_type: function () {
          return this.vr_type;
        }
        ,




        get_vr_type_mouse: function () {
            return this.vr_type == 'mouse';
        }
        ,





        get_vr_type_move: function () {
            return this.vr_type == 'move';
        }
        ,




        list_of_drivers: function () {
            return this.$store.getters.list_of_drivers
        }
        ,





        add_driver_visible: function () {
            return this.$store.state.add_driver_visible
        }
        ,





        viewed_driver_id: function () {
            return this.$store.state.viewed_driver_id
        }
        ,




	    list_of_fields: function () {
            return this.$store.state.list_of_output_fields
        }
	},



	methods: {

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
        }
        ,



        list_of_queries2: function () {
            //console.loglog("*********** list_of_queries2: ")
            return window.sqlGetAllQueriesAndUiCached
        }
        ,





        get_viewed_query_id: function() {
            //console.loglog("*********** get_viewed_query_id: ")
            return this.$store.state.viewed_query_id;
        }
        ,





        is_query_selected: function() {
            //console.loglog("*********** is_query_selected: ")
            if ( this.$store.state.viewed_query_id == null) { return false; };
            return true
        }
        ,





        get_viewed_query_file: function() {
            //console.loglog("*********** get_viewed_query_file: ")
            if (this.$store.state.viewed_query_file == null) {
                return "";
            }
            return this.$store.state.viewed_query_file;
        }
        ,





        can_show_full_doc: function() {
            //console.loglog("*********** can_show_full_doc: ")
            return this.$store.state.show_full_doc;
        }
        ,









        truncate: function(txt) {
            //console.loglog("*********** truncate: ")
            return (txt?txt.toString().substring(0,10):'');
        }
        ,




        truncate2: function(txt) {
            //console.loglog("*********** truncate2: ")
            return (txt?txt.toString().substring(0,100):'');
        }
        ,




        is_document: function (id) {
            //console.loglog("*********** is_document: ")
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
        }
        ,




        is_spreadsheet: function (id) {
            //console.loglog("*********** is_spreadsheet: ")
            if (id == null) {
                return false;
            }
            var qq = window.sqlGetQueryById(id);
            if (qq != null) {
                if (qq.type != null) {
                    if ((qq.type.indexOf("SPREADSHEET") != -1) || (qq.type.indexOf("CSV") != -1)  || (qq.type.indexOf("DATABASE") != -1)) {
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



        is_database: function (id) {
            //console.loglog("*********** is_spreadsheet: ")
            if (id == null) {
                return false;
            }
            var qq = window.sqlGetQueryById(id);
            if (qq != null) {
                if (qq.type != null) {
                    if (qq.type.indexOf("DATABASE") != -1) {
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



        in_show_quickview: function (id) {
            return  this.$store.state.show_quickview;
        }
        ,



        is_3d: function (id) {
            //console.loglog("*********** is_3d: ")
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
        }
        ,






        get_driver_name: function (id) {
            //console.loglog("*********** get_driver_name: ")
            if (id == null) {
                return "";
            }
            var qq = window.sqlGetQueryById(id);
            if (qq != null) {
                return qq.driver;
            };
            ////console.loglog("rt.driver  not found: ")
            return "";
        }
        ,





        get_query_property: function (id, prop) {
            //console.loglog("*********** get_query_property: ")
            if (id == null) {
                return "";
            }
            var qq = window.sqlGetQueryById(id);
            if (qq != null) {
                return qq[prop];
            };
            ////console.loglog("rt.fileName  not found: ")
            return "";
        }
        ,


        get_full_query_ui_property: function (id, prop) {
            //console.loglog("*********** get_query_ui_property: ")
            if (id == null) {
                return "";
            }
            var qq = window.sqlGetFullQueryUiById(id);
            //alert(Object.keys(qq))
            if (qq != null) {
                return qq[prop];
            };
            return "";
        }
        ,




        is_visible: function(id) {
            //console.loglog("*********** is_visible: ")
            if (id == null) {
                return false;
            }
            var qm = window.sqlGetQueryUiById(id);
            if (!qm) {
                return false;
            }
            return qm.visible;
        }
        ,




        get_error_message() {
            //console.loglog("*********** get_error_message: ")
            return this.$store.state.error_message;
        }
    }
    ,





    components: {
        'VR-grid-item': VR_grid_item
	}
}

</script>
<style>
</style>
