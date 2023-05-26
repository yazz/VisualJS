function yazzcraft_app(args) {
/*
base_component_id("yazzcraft")
display_name("3d Micecraft style Game app")
is_app(true)
description('Game app, this will return the game app')
load_once_from_file(true)
visibility("PUBLIC")
uses_javascript_libraries(["advanced_bundle"])
logo_url("/driver_icons/yazzcraft.png")
read_only(true)

*/


    Yazz.component({
      template: `<div id="app2" style='padding: 20px;'>

            <h1>yazzcraft</h1>

            {{msg}}

            <a-scene
                        cursor="rayOrigin: mouse"
                        style='width: 80%; height: 80%;'
                        embedded>

                <a-box    v-bind:id='item.x + "_" + item.y + "_" + item.z '
                          v-for="item in objects"
                          v-bind:position='"" + item.x + " " + item.y + " " + (item.z - 10) + ""'
                          rotation='0 0 0'
                          v-bind:highlighted='"x: " + item.x + "; " '
                          v-bind:color='(item.color?item.color:"#4CC3D9")'>
                </a-box>


                <a-sky color="#ECECEC"></a-sky>

              </a-scene>

       </div>
      `,
      data: function() {
          return {
              msg: ""
              ,
              objects: [
                    {x: 0,y: 0, z:0}
                    ,
                    {x: 1,y: 0, z:0}
                    ,
                    {x: 2,y: 1, z:0, color: "blue"}
                    ,
                    {x: 2,y: 0, z:1}
                    ,
                    {x: 2,y: 0, z:2}

                  ]
          }
      }
      ,
      mounted: function() {
            var m = this

          var scene = document.querySelector('a-scene');




          window.addEventListener("keydown", function(e){
                if(e.keyCode === 80) { // e.g. v key
                  m.msg="go forward"
                }
            });





            AFRAME.registerComponent('highlighted', {
              schema: {
                    axaa: {type: 'number'}
              },

              init: function () {
               var xx = this.data
                this.el.addEventListener(
                                    'click',
                                    function () {
                                        alert(xx.x)
                                    });
              }
            });




            for (var x=0;x<10;x++){
                for (var z=0;z<10;z++){
                    this.objects.push({x: x,y:-1,z: z, color: "lightgreen"})
                }

            }


      }

    })
}
