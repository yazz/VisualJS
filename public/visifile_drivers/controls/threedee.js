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
      props: ["args","design_mode", "refresh"]
      ,
      template: `<div id="app2" style='padding: 20px;' v-bind:refresh='refresh'>
          <a-scene physics-world="" physics="debug: true" style='width: 80%; height: 80%;' embedded v-bind:refresh='refresh'>

                <component  is='threedee_item_control'
                            v-bind:design_mode='design_mode'
                            v-bind:refresh='refresh'>
                </component>
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
                            box['physics-body'].applyImpulse(impulse, point);
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
