function game_app(args) {
/*
is_app(true)
display_name("3d Game app")
base_component_id('game')
is_app(true)
description('Game app, this will return the game app')
load_once_from_file(true)
visibility("PUBLIC")
uses_javascript_librararies(["advanced_bundle"])
logo_url("https://yt3.ggpht.com/Ekz8dWfyjZl56kIa2teWnUgCl3JSqCk5ZLowTlxcsd31GUP0L0xNwvvM734RAAbwoXr65I5rDHKpFvmx2Vw=s900-mo-c-c0xffffffff-rj-k-no")
read_only(true)

*/

    Vue.component('game',{
      template: `<div id="app2" style='padding: 20px;'>
            <h1>{{msg}}</h1>
            <input type="text" v-model="msg"/>


            <a-scene physics-world="" physics="debug: true" style='width: 80%; height: 80%;' embedded>

                <a-box    id="interact_box_three"
                          position="-1 3.5 -3"
                          body="shape: box; mass: 2"
                          rotation="0 45 0"
                          color="#4CC3D9">
                </a-box>

                <a-sphere position="0 1.25 -5" radius="1.25" color="#EF2D5E"></a-sphere>
                <a-cylinder position="1 0.75 -3" radius="0.5" height="1.5" color="#FFC65D"></a-cylinder>

                <a-plane  static-body
                          position="0 0 -4"
                          rotation="-90 0 0" width="4" height="4" color="#7BC8A4">
                </a-plane>
                <a-sky color="#ECECEC"></a-sky>
              </a-scene>

       </div>
      `,
      data: function() {
          return {
              msg: "Hello Appshare!"
          }
      }
      ,
      mounted: function() {

          var scene = document.querySelector('a-scene');
          scene.addEventListener('click', function () {
              var box = document.getElementById('interact_box_three');
              var impulse = { x: 0, y: 10, z: 0 };
              var point = { x: 0.5, y: 0, z: 0 };
              box['body'].applyImpulse(impulse, point);
          });
      }

    })
}
