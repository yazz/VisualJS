function game_app(args) {
/*
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


              <a-scene  physics="debug: false;driver: ammo;debugDrawMode: 0;"
                        cursor="rayOrigin: mouse"
                        style='width: 80%; height: 80%;'
                        embedded>
                  <a-entity   id="laser"
                              laser-controls="hand: right"
                              raycaster="hand: right;model: true;"
                              line="opacity:1.0;">
                  </a-entity>
                  <a-box    id="interact_box_three"
                            position="-1 2 -2"
                            ammo-body="type: dynamic;gravity: -.000000000000001;mass: 2;"
                            ammo-shape="type: box"
                            rotation="0 45 0"
                            color="#4CC3D9">
                  </a-box>

                  <a-sphere body="shape: box; mass: 2"
                            ammo-body="type: dynamic;gravity: -.000000000000001;mass: 2;"
                            ammo-shape="type: box"

                            position="0 5.25 -5" radius="1.25" color="#EF2D5E">
                  </a-sphere>


                  <a-cylinder position="1 0.75 -3" radius="0.5" height="1.5" color="gray">
                      <a-entity position="2 2 1"  v-bind:text='"width:10;value: " + msg + ";color:gray;"'>
                      </a-entity>
                  </a-cylinder>

                  <a-plane
                            ammo-body="type: static"
                            ammo-shape="type: box"
                            position="0 0 -4"
                            rotation="-90 0 0" width="4" height="4"
                            color="#7BC8A4">
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
            var mm = this
            var scene = document.querySelector('a-scene');

            var box = document.getElementById('interact_box_three');
            box.addEventListener('click', function () {
                mm.msg = "clicked box"
                const impulse = new Ammo.btVector3(0, 15, 0);
                const pos = new Ammo.btVector3(0, 0, 0);
                box.body.applyImpulse(impulse, pos);
                Ammo.destroy(impulse);
                Ammo.destroy(pos);
            });

            var sphere = document.querySelector('a-sphere');
            sphere.addEventListener('click', function () {
                mm.msg = "clicked sphere"
                const impulse = new Ammo.btVector3(0, 5, 0);
                const pos = new Ammo.btVector3(0, 0, 0);
                sphere.body.applyImpulse(impulse, pos);
                Ammo.destroy(impulse);
                Ammo.destroy(pos);
            });



            var laser = document.querySelector('#laser');
            laser.addEventListener('trackpaddown', function (ee) {
                  mm.msg = "trackpaddown"
            });
            laser.addEventListener('trackpadup', function (ee) {
                  mm.msg = "trackpadup"
            });
            laser.addEventListener('trackpadtouchstart', function (ee) {
                  mm.msg = "trackpadtouchstart"
            });
            laser.addEventListener('trackpadtouchend', function (ee) {
                  mm.msg = "trackpadtouchend"
            });
            laser.addEventListener('triggerchanged', function (ee) {
                  mm.msg = "triggerchanged"
            });
            laser.addEventListener('triggerdown', function (ee) {
                  mm.msg = "triggerdown"
            });
            laser.addEventListener('triggerup', function (ee) {
                  mm.msg = "triggerup"
            });
        }

      })
  }
