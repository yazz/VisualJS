<template>

    <a-scene  	platform='all'
                id='vr_scene'
                renderer="clearColor: #222"
                v-bind:cursor='(vr_type=="mouse"?"rayOrigin: mouse":false)'
                artoolkit='sourceType: webcam;'
                >

                <a-marker preset='hiro'>
                      <a-box position='0 2.5 -1' material='color: blue;opacity: 1;'></a-box>
                      <a-entity
                          id='changes_grid' v-bind:refresh_vr_items='get_refresh_view_counter'
                          rotation='0  0  0'
                          position='0 0 -0'
                                >
                                <a-entity rotation='0 0 0'
                                position='.15 1 0 '>
                                        <VR-changes >

                                        </VR-changes>
                                    </a-entity>

                      </a-entity>
              </a-marker>

		</a-scene>

</template>





<script>
import output_table         from './output_table.vue'
import VR_items             from './VR_items.vue'
import VR_Home              from './VR_Home.vue'
import VR_changes             from './VR_changes.vue'


export default {
    name: 'AR'
	,



	props: ['vr_type']
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


    computed: {
        getSearchResults: function() {
            return this.$store.state.search_results.local.results;
        }
        ,

		getIsLocalMachine: function() {
	       return this.$store.state.is_local_machine
	     },

		locked: function () {
		 return this.$store.state.locked;
	    },


        getSearchSubtext: function() {
            return this.$store.state.search_subtext;
        }
        ,




        getCurrentSearch: function() {
            return this.$store.state.current_search
        }
        ,




        getUserName: function() {
            return this.$store.state.user_name
        }
        ,







        can_see_search_results: function () {
            return this.$store.state.show_related
            //return true
        }
        ,




        get_vr_type: function () {
            return this.vr_type
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
		get_scanning_status: function() {
            return this.$store.state.scanning_status;
        }
        ,


        in_show_quickview: function (id) {
            return  this.$store.state.show_quickview;
        }
        ,

		get_show_related: function() {
            return this.$store.state.show_related;
        },




        get_hash: function (id) {
            if (id == null) {
                return "";
            }
            var qq = window.sqlGetQueryById(id);
            if (qq != null) {
                return qq.hash;
            };
            return "";
        },


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





        get_file_name: function (id) {
            if (id == null) {
                return "";
            }
            var qq = window.sqlGetQueryById(id);
            if (qq != null) {
                return qq.fileName;
            };
            return "";
        },
	},



    components: {
        'output-table': output_table,
        'VR-Home': VR_Home,
        'VR-items': VR_items
        ,
        'VR-changes': VR_changes
            }


}
</script>





<style>
</style>
