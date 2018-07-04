function intro_logo_3d(args) {
/*
is_app(true)
display_name("Intro Logo 3D")
base_component_id('intro logo 3D')
description('Intro logo app, this will return a spinning logo')
uses_javascript_librararies(["aframe"])
load_once_from_file(true)
*/

    Vue.component('intro_logo_3d',{
      template: `<div id="app2">
          saSs
            <h1>{{msg}}</h1>
            <input type="text" v-model="msg"/>


          <a-scene style='width: 80%; height: 80%;' embedded>
              <a-box position="-1 0.5 -3" rotation="0 45 0" color="#4CC3D9"></a-box>
              <a-sky color="#ECECEC"></a-sky>
            </a-scene>
       </div>
      `,
      data: function() {
          return {
              msg: "Appshare!"
          }
      }
    })
    return {name: 'intro_logo_3d'}
}
