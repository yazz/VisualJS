function(args) {
/*
is_app(true)
control_type("VB")
display_name("3d control")
description("This will return the 3d container control")
base_component_id("threedee_control")
load_once_from_file(true)
visibility("PRIVATE")
read_only(true)
properties(
    [
        {
            id:     "text",
            name:   "Text",
            type:   "String"
        }
        ,
        {
            id:     "background_color",
            name:   "Background color",
            type:   "String"
        }
        ,
        {
            id:         "is_container",
            name:       "Is Container?",
            type:       "Boolean",
            default:    true,
            hidden:     true
        }
    ]
)//properties
logo_url("/driver_icons/threedee_control.png")
*/

    Vue.component("threedee_control",{
      props: ["args","design_mode", "refresh", "children"]
      ,
      template: `<div style='padding: 20px;' v-bind:refresh='refresh'>

          <a-scene  v-bind:id='(design_mode?"design_scene":"scene")'
                    v-bind:ref='(design_mode?"design_scene":"scene")'
                    physics-world=""
                    physics="debug: false"
                    style='width: 80%; height: 80%;'
                    embedded
                    allowvr="yes"
                    v-bind:refresh='refresh'>

              <a-entity geometry="primitive: sphere; radius: 100"
                        material="color: #74DEED; shader: flat"
                        v-bind:refresh='refresh'
                        scale="1 1 -1">
              </a-entity>

              <a-entity geometry="primitive: box; depth: 50; height: 0.1; width: 50"
                        material="color: #2E3837"
                        v-bind:refresh='refresh'
                        static-body
                        physics-body="mass: 0; boundingBox: 50 0.1 50" position="0 0 -10"></a-entity>

              <a-entity camera look-controls wasd-physics-controls
                        v-bind:refresh='refresh'
                        physics-body="mass: 0; boundingBox: 1 1.8 1"
                        position="0 5 0">
              </a-entity>

                <slot v-bind:refresh='refresh'>
                </slot>

            </a-scene>
         </div>
      `,
        mounted: function() {
            if (!this.design_mode) {
                //var scene = document.querySelector('a-scene');
                //if (isValidObject(scene)) {
                    //scene.addEventListener('click', function () {

                        // Apply impulse;
                        //setTimeout(function () {
                            //var box = document.getElementById('left-box');
                            //var impulse = { x: 0, y: 10, z: 0 };
                            //var point = { x: 0.5, y: 0, z: 0 };
                            //box['physics-body'].applyImpulse(impulse, point);
                        //}, 25);
                    //});
                //}

            }
        }
      ,
      data: function() {
          return {
              msg: "Hello Yazz!"
          }
      }
    })
}
