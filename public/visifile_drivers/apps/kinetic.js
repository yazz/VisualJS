async function kinetic_app(args) {
/*
created_timestamp(1547355211458)
base_component_id("kinetic")
visibility("PUBLIC")
display_name("Copy of Copy of Copy of Kinetic app")
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

            <a-entity position="0 1.25 -5" radius="1.25" color="#EF2D5E">
               <a-sphere v-bind:position='" " + nose_x + " " + nose_y + " -5"'
                         radius=".1" color="#EF2D5E"></a-sphere>

               <a-sphere v-bind:position='" " + left_eye_x + " " + left_eye_y + " -5"'
                         radius=".1" color="blue"></a-sphere>
               <a-sphere v-bind:position='" " + right_eye_x + " " + right_eye_y + " -5"'
                         radius=".1" color="blue"></a-sphere>

               <a-sphere v-bind:position='" " + left_ear_x + " " + left_ear_y + " -5"'
                         radius=".1" color="blue"></a-sphere>
               <a-sphere v-bind:position='" " + right_ear_x + " " + right_ear_y + " -5"'
                         radius=".1" color="blue"></a-sphere>
            </a-entity>




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
                //alert("Started")
                var aqq = document.getElementById('man22');
                var net = await posenet.load();
                var  pose2 = await net.estimateSinglePose(aqq,0.5,false,16)
                alert(JSON.stringify(pose2,null,2))
                var keypoints = pose2.keypoints
                for (var rrr = 0; rrr < keypoints.length; rrr++  ) {
                    var point = keypoints[rrr]
                    if (point.part=="nose") {
                        this.nose_x = (point.position.x / 20) - 5
                        this.nose_y = 3 + (point.position.y / 100)
                    }
                    if (point.part=="leftEye") {
                        this.left_eye_x = (point.position.x / 20) - 5
                        this.left_eye_y = (point.position.y / 60) + 2
                    }
                    if (point.part=="rightEye") {
                        this.right_eye_x = (point.position.x / 20) - 5
                        this.right_eye_y = (point.position.y / 60) + 2
                    }
                    if (point.part=="leftEar") {
                        this.left_ear_x = (point.position.x / 20) - 5
                        this.left_ear_y = (point.position.y / 60) + 2
                    }
                    if (point.part=="rightEar") {
                        this.right_ear_x = (point.position.x / 20) - 5
                        this.right_ear_y = (point.position.y / 60) + 2
                    }
                }

            }
      },
      data: function() {
          return {
              nose_x: 0,
              nose_y: 0,
              left_eye_x: 0,
              left_eye_y: 0,
              right_eye_x: 0,
              right_eye_y: 0,
              left_ear_x: 0,
              left_ear_y: 0,
              right_ear_x: 0,
              right_ear_y: 0
          }
      }

    })
}
