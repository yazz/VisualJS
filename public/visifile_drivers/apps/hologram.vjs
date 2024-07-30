async function hologram_app(args) {
/*
visibility("PUBLIC")
base_component_id("hologram")
created_timestamp(-1)
display_name("3d hologram app")
is_app(true)
description('Game app, this will return the game app')
logo_url("/driver_icons/hologram.png")

*/

    Yazz.component({
      template: `<div id="app2" style='padding: 20px;'>

                <div>({{x}},{{y}}) . ({{width}},{{height}}) ,  {{view_x}}, {{view_y}}, {{videoWidth}}

                </div>

<a-scene
    cursor="rayOrigin: mouse"
    style='width: 50%; height: 50%;'
    embedded>

    <a-entity   position="0 0 -3"
                v-bind:rotation='view_y + " "  + view_x + "  0"'>

        <a-entity   id="laser"
                    laser-controls="hand: right"
                    raycaster="hand: right;model: true;"
                    line="opacity:1.0;">
        </a-entity>

        <a-box    id="interact_box_three"
                  position="-1 1 0"
                  rotation="0 0 0"
                  color="#4CC3D9">
        </a-box>

        <a-sphere   position="0 1.25 -2" radius="1.25" color="#EF2D5E">
        </a-sphere>


        <a-cylinder position="1 0.75 0" radius="0.5" height="1.5" color="gray">
                <a-entity position="2 2 1"  v-bind:text='"width:10;value: " + msg + ";color:gray;"'>
                </a-entity>
        </a-cylinder>

        <a-box    id="interact_box_three2"
                  position="1 2 0"
                  rotation="0 0 0"
                  color="#4CC3D9">
        </a-box>

        <a-plane  static-body
                  position="0 0 -1"
                  rotation="-90 0 0" width="20" height="20"
                  color="#7BC8A4">
        </a-plane>

        <a-sky color="#ECECEC"></a-sky>
    </a-entity>
</a-scene>


              <div style="position: relative;visibility: hidden;" class="margin">
                  <video
                      style="position: absolute;width:50%;height;50%;"
                      v-on:play="onPlay"
                      id="inputVideo"
                      autoplay
                      muted>
                 </video>

                  <canvas  id="overlay"
                            style="position: absolute;;width:50%;height;50%;"
                  />
            </div>



       </div>
      `,
      data: function() {
          return {
              msg: "Test Hologram!",
              car: 1,
              x: -1,
              y: -1,
              width: -1,
              height: -1
              ,
              view_x: 0,
              view_y: 0,
              videoWidth: 0
          }
      }
      ,

      mounted: async function() {
        console.log(faceapi.nets)
        await faceapi.nets.ssdMobilenetv1.loadFromUri('/weights')
        await faceapi.loadMtcnnModel('/weights')
        await faceapi.loadFaceRecognitionModel('/weights')
        await faceapi.nets.faceLandmark68Net.loadFromUri('/weights')
        await faceapi.nets.tinyFaceDetector.loadFromUri('/weights' );


            // Grab elements, create settings, etc.
            var video = document.getElementById('inputVideo');

            // Get access to the camera!
            if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                // Not adding `{ audio: true }` since we only want video now
                navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
                    //video.src = window.URL.createObjectURL(stream);
                    video.srcObject = stream;
                    //video.play();
                });
            }

      },
      methods:
      {
        onPlay: async function ()
        {
            let mm = this

            try {
                const mtcnnForwardParams = {
                     minFaceSize: 200
                }

                const detections = await faceapi.detectSingleFace(
                                        document.getElementById('inputVideo')
                                        ,
                                        new faceapi.TinyFaceDetectorOptions({scoreThreshold: .1,inputSize: 128})
                                        ,
                                        mtcnnForwardParams
                                        )

                //const mtcnnResults = await faceapi.mtcnn(document.getElementById('inputVideo'), mtcnnForwardParams)

                //faceapi.draw.drawDetections(document.getElementById('overlay'), detections);
                if (detections) {

                    mm.x = Math.floor(detections._box._x)
                    mm.y = Math.floor(detections._box._y)
                    mm.width = Math.floor(detections._box._width)
                    mm.height = Math.floor(detections._box._height)


                    mm.videoWidth = mm.getInnerWidth(document.getElementById("inputVideo"))

                    mm.view_x = -30 + ((1 / mm.videoWidth) * mm.x * 120)
                    //mm.view_y = -35 + ((1 / mm.height) * mm.y * 30)
                    //console.log(JSON.stringify(mm.view_y,null,2))

                }
                //console.log(mm.car++)


            } catch (err) {

            }

            setTimeout(() => mm.onPlay())
        }
        ,


        getInnerWidth: function(elem) {
            return elem.getBoundingClientRect().width
        }

      }


    })
}
