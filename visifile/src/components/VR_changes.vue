<template>



                       <a-entity id='all_cards'>

	      <a-entity   v-for="(a_query,index)  in  list_of_cards()" :key="index">

              <a-entity
                  v-bind:position='" 0 " + (0 - (index * .4)) + " 0"'
                  rotation='30 0 0'
                   geometry="primitive: plane; width:1;height: 6;" material="color: gray; opacity: 0;">

                   <a-entity rotation='0 0 0'
                   position='0 0 0.1'>
                          <a-entity rotation='0 0 0'
                          geometry="primitive: box; width:1;height: 1.5;depth: .01"
                          v-bind:material='"color: " + (index%2?"white":"white") + "; opacity: 1;"'>

                              <a-entity
                                  mixin="RobotoFont"
                                  position='.1  0.7  0.1'
                                  rotation='0 0 0'
                                  v-bind:text="'color: black; align: left; value: Hello document content ' + index + '; width: 1; opacity:1;'"
                                  >
                              </a-entity>
                          </a-entity>
                  </a-entity>

              </a-entity>

              </a-entity>
              </a-entity>



</template>





<script>
import VR_grid_item             from './VR_grid_item.vue'

export default {
    name: 'VR-changes'
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


        list_of_cards: function () {
            var foo = new Array(20)
            return foo
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
                    if ((qq.type.indexOf("DOCUMENT") != -1) || (qq.type.indexOf("DOCX") != -1)|| (qq.type.indexOf("PDF") != -1)) {
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
