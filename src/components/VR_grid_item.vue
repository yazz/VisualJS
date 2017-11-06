<template>
    <a-entity
            v-bind:position="a_query.x_pos + ' ' + a_query.y_pos + ' -.1'"
            v-bind:id='a_query.id + "_upper"'
            mixin="RobotoFont"            
            v-bind:text="'color: black; align: left; value: ' + a_query.display_name + ' ; width: 2; '"
            >
            
       <a-entity    position='-0.8 .3 0'
                    geometry="primitive: plane; width:.35;height: 0.35;"
                    v-bind:material='(a_query.driver != null?"src: driver_icons/" + a_query.driver + ".jpg;":false)'
                    v-bind:log='a_query?("queryId: "  + a_query.id + ";"):false' 
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
  
  
  
    props: ['a_query']
}

</script>
<style>
</style>
