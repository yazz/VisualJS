async function kinetic_app(args) {
/*
created_timestamp(1547352694251)
base_component_id("kinetic")
visibility("PUBLIC")
display_name("Kinetic app")
is_app(true)
description('Kinetic app')
uses_javascript_librararies(["advanced_bundle"])
logo_url("/man.jpg")
*/

    Vue.component('kinetic',{
      template:
`<div id="app2" style='padding: 20px;'>
    <div class="btn btn-danger" value="Click" v-on:click="evt()" >
        Click
    </div>

    <div>

        <div
            style="display: inline-block;width:50%;vertical-align:top;">
                <img    id="man22"
                        width="200px"
                        src="/man.jpg">
                </img>
                <div></div>
                <video  autoplay="true"
                    width=200 height=200
                    style="width:200px;height:200px;background-color:gray;"
                    id="videoElement">

                </video>
        </div>




        <div
            style="display: inline-block;width:45%;vertical-align:top;">
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
    </div>

</div>`,
      mounted: async function() {
          var video = document.querySelector("#videoElement");

            if (navigator.mediaDevices.getUserMedia) {
                var stream = await navigator.mediaDevices.getUserMedia({video: {
                  height: 200,
                  width: 200,
                  facingMode: 'user'
                }})
                video.srcObject = stream;
            }

      }
      ,
      methods: {
          evt: async function()  {
                alert("Started")
                var aqq = document.getElementById('videoElement');
                var net = await posenet.load();
                var  pose2 = await net.estimateSinglePose(aqq,0.5,false,16)
                alert(JSON.stringify(pose2,null,2))
          }
      }

    })
}
