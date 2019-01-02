function(args) {
/*
is_app(true)
control_type("VB")
display_name("3d control")
description("This will return the label control")
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
    ]
)//properties
logo_url("/driver_icons/3d_control.png")
*/

    Vue.component("threedee_control",{
      props: ["args","design_mode"]
      ,
      template: `<div id="app2" style='padding: 20px;'>
              <a-scene physics-world="" physics="debug: true" embedded>
                    <a-assets>
                      <a-mixin id="box" ref="box"
                                        geometry="primitive: box" material="color: #166678; side: double"
                                        physics-body="mass: 5; boundingBox: 2 2 2"></a-mixin>
                    </a-assets>

                    <a-entity id="sky"
                              geometry="primitive: sphere; radius: 100"
                              material="color: #74DEED; shader: flat"
                              scale="1 1 -1"></a-entity>

                    <a-entity id="ground"
                              geometry="primitive: box; depth: 50; height: 0.1; width: 50"
                              material="color: #2E3837"
                              physics-body="mass: 0; boundingBox: 50 0.1 50" position="0 0 -10"></a-entity>

                    <a-entity mixin="box" position="0 10 -10"></a-entity>

                    <a-entity id="left-box" mixin="box" position="-2.1 1 -10"></a-entity>

                    <a-entity mixin="box" physics-body="angularVelocity: 0 0 60"
                              position="2 1 -10"></a-entity>
                    <a-entity id="bullet-box" mixin="box" physics-body="mass: 1; velocity: 0 0 0"
                              position="2 3 50"></a-entity>

                    <a-entity id="player"
                              camera look-controls wasd-physics-controls
                              physics-body="mass: 0; boundingBox: 1 1.8 1"
                              position="0 5 0"></a-entity>
                  </a-scene>
         </div>
      `,
        mounted: function() {
            if (!this.design_mode) {
                setTimeout(function(){
                    var scene = document.querySelector('a-scene');
                    scene.addEventListener('click', function () {

                        // Apply impulse;
                        setTimeout(function () {
                            var box = document.getElementById('left-box');
                            var impulse = { x: 0, y: 10, z: 0 };
                            var point = { x: 0.5, y: 0, z: 0 };
                            box.components['physics-body'].applyImpulse(impulse, point);
                            }, 25);
                    });

                },4000)
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
