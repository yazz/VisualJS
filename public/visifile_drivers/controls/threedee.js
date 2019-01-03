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
logo_url("/driver_icons/threedee_control.png")
*/

    Vue.component("threedee_control",{
      props: ["args","design_mode"]
      ,
      template: `<div id="app2" style='padding: 20px;'>
          <a-scene physics="debug: true" style='width: 80%; height: 80%;' embedded>

            <template >
                          <a-box    position="-1.2 2.5 -3"
                                    body="shape: box; mass: 200"
                                    rotation="0 50 0"
                                    color="yellow">
                          </a-box>
                     </template>
            </a-scene>
         </div>
      `,
        mounted: function() {
            if (!this.design_mode) {
                var scene = document.querySelector('a-scene');
                if (isValidObject(scene)) {
                    scene.addEventListener('click', function () {

                        // Apply impulse;
                        setTimeout(function () {
                            var box = document.getElementById('left-box');
                            var impulse = { x: 0, y: 10, z: 0 };
                            var point = { x: 0.5, y: 0, z: 0 };
                            box.components['physics-body'].applyImpulse(impulse, point);
                            }, 25);
                    });
                }

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
