{
    doc_type:                       'visifile',
    name:                           'game',version: 1,
    description:                    'game app',
    uses_javascript_librararies:    ["aframe"],


    events: {
        "This will return the game app": {
            on: "app",
            do: function(args, returnfn) {
                is_app()
                returnfn(
                    new Vue({
                      el: "#" + args.root_element
                      ,
                      template: `<div id="app2">
                          saSs
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
                      data: {
                        msg: "Hello Moon!"
                      }
                    })
                )


            }, end: null
        }

    }

}
