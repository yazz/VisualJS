<template>
    <a-entity
            v-bind:position="a_query.x_pos + ' ' + a_query.y_pos + ' -.1'"
            v-bind:id='a_query.id + "_upper"'
            mixin="RobotoFont"
            v-bind:text="'color: black; align: left; value: ' + a_query.display_name + ' ; width: 2; opacity:1;'"
            >

       <a-entity    position='-0.8 .3 0'
                    geometry="primitive: plane; width:.35;height: 0.35;"
                    v-bind:material='(a_query.driver != null?"src: driver_icons/" + a_query.driver + ".jpg;":false)'
                    v-bind:log='a_query?("queryId: "  + a_query.id + ";"):false'
                >
        </a-entity>

        <a-entity
                v-bind:position='"-0.8 "+ ((a_query.id == get_highlighted_query_id())?0.3:100) + " -.002"'
                geometry="primitive: plane; width:.4;height: 0.4;"
                material="color: black;"
                v-bind:id='a_query.id + "_lower"'
                >
        </a-entity>
        <a-entity
                v-bind:position='"-0.8 "+ ((a_query.id == get_highlighted_query_id())?0.3:100) + " -.002"'
                geometry="primitive: plane; width:.38;height: 0.38;"
                material="color: white;"
                v-bind:id='a_query.id + "_lower2"'
                >
        </a-entity>
        <a-entity
                v-bind:position='"-0.8  0.29  " + (-.002 - (0.05 * getVersionCount(a_query.similar_count)))'
                v-bind:geometry='"primitive: box; width:.38; height: 0.38; depth: " + (-.1 * getVersionCount(a_query.similar_count)) + ";"''
                material="color: gray; opacity:.9;"
                v-bind:id='a_query.id + "_versions"'
                >
        </a-entity>

    </a-entity>
</template>



<script>
export default {
    name: 'VR-grid-item'
    ,


    init: function () {
        // Set up the tick throttling.
        this.tick = AFRAME.utils.throttleTick(this.tick, 300, this);
    }
    ,



    /**
    * Tick function that will be wrapped to be throttled.
    */
    tick: function (t, dt) {}
    ,



    props: ['a_query'],

    methods: {
        get_highlighted_query_id: function() {
            //console.loglog("*********** get_highlighted_query_id: ")
            return this.$store.state.highlighted_query_id;
        },


        getVersionCount: function(cc) {
            if (!cc) {
                return 1;
            }
            return cc;
        }


    }
}

</script>
<style>
</style>
