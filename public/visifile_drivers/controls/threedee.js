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
      props: ["args"]
      ,
      template: `<div id="app2" style='padding: 20px;'>
            <h1>{{msg}}</h1>
            <input type="text" v-model="msg"/>


          <a-scene style='width: 80%; height: 80%;' embedded>
              <a-box position="-1 0.5 -3" rotation="0 45 0" color="#4CC3D9"></a-box>
              <a-sphere position="0 1.25 -5" radius="1.25" color="#EF2D5E"></a-sphere>
              <a-cylinder position="1 0.75 -3" radius="0.5" height="1.5" color="#FFC65D"></a-cylinder>
              <a-plane position="0 0 -4" rotation="-90 0 0" width="4" height="4" color="#7BC8A4"></a-plane>
              <a-sky color="#ECECEC"></a-sky>
            </a-scene>
       </div>
      `,
      data: function() {
          return {
              msg: "Hello Yazz!"
          }
      }
    })
}
