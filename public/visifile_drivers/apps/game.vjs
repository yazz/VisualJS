function game_app(args) {
/*
display_name("3d Game app")
base_component_id('game')
is_app(true)
description('Game app, this will return the game app')
load_once_from_file(true)
visibility("PUBLIC")
logo_url("/driver_icons/game.png")
read_only(true)

*/

    Yazz.component({
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






                  <a-box    id="tl"
                            position="-1 2.5 -3"
                            ammo-body="type: dynamic;gravity: -.000000000000001;mass: 2;"
                            ammo-shape="type: box"
                            rotation="0 0 0"
                            color="red">
                  </a-box>
                  <a-box    id="tm"
                            position="0 2.5 -3"
                            ammo-body="type: dynamic;gravity: -.000000000000001;mass: 2;"
                            ammo-shape="type: box"
                            rotation="0 0 0"
                            color="white">
                  </a-box>
                   <a-box    id="tr"
                        position="1 2.5 -3"
                        ammo-body="type: dynamic;gravity: -.000000000000001;mass: 2;"
                        ammo-shape="type: box"
                        rotation="0 0 0"
                        color="red">
                  </a-box>




                  <a-box    id="ml"
                            position="-1 1.5 -3"
                            ammo-body="type: dynamic;gravity: -.000000000000001;mass: 2;"
                            ammo-shape="type: box"
                            rotation="0 0 0"
                            color="white">
                  </a-box>
                  <a-box    id="mm"
                            position="0 1.5 -3"
                            ammo-body="type: dynamic;gravity: -.000000000000001;mass: 2;"
                            ammo-shape="type: box"
                            rotation="0 0 0"
                            color="red">
                  </a-box>
                   <a-box    id="mr"
                        position="1 1.5 -3"
                        ammo-body="type: dynamic;gravity: -.000000000000001;mass: 2;"
                        ammo-shape="type: box"
                        rotation="0 0 0"
                        color="white">
                  </a-box>







                  <a-box    id="bl"
                            position="-1 0.5 -3"
                            ammo-body="type: dynamic;gravity: -.000000000000001;mass: 2;"
                            ammo-shape="type: box"
                            rotation="0 0 0"
                            color="red">
                  </a-box>
                  <a-box    id="bm"
                            position="0 0.5 -3"
                            ammo-body="type: dynamic;gravity: -.000000000000001;mass: 2;"
                            ammo-shape="type: box"
                            rotation="0 0 0"
                            color="white">
                  </a-box>
                   <a-box    id="br"
                        position="1 0.5 -3"
                        ammo-body="type: dynamic;gravity: -.000000000000001;mass: 2;"
                        ammo-shape="type: box"
                        rotation="0 0 0"
                        color="white">
                  </a-box>





                  <a-plane
                            ammo-body="type: static"
                            ammo-shape="type: box"
                            position="0 0 -4"
                            rotation="-90 0 0"
                            width="40"
                            height="40"
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
            let mm = this
            mm.addPush('tl');
            mm.addPush('tl');
            mm.addPush('tm');
            mm.addPush('tr');
            mm.addPush('ml');
            mm.addPush('mm');
            mm.addPush('mr');
            mm.addPush('bl');
            mm.addPush('bm');
            mm.addPush('br');

        }
        ,

        methods: {
        addPush: function(el3d) {
            let mm = this
            let box = document.getElementById(el3d);
            box.addEventListener('click', mm.clicked(el3d));

        }
        ,


        clicked: function (el3d) {
            let mm = this
            return function() {
                let box = document.getElementById(el3d);
                mm.msg = "clicked " + el3d
                const impulse = new Ammo.btVector3(0, 10, 0);
                const pos = new Ammo.btVector3(0, 0, 0);
                box.body.applyImpulse(impulse, pos);
                Ammo.destroy(impulse);
                Ammo.destroy(pos);
            }
        }

        }



      })
}
