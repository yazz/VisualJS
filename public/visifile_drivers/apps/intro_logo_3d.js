function intro_logo_3d(args) {
/*
created_timestamp(-1)
base_component_id("into_logo_3d")
is_app(true)
display_name("Intro Logo 3D")
description('Intro logo app, this will return a spinning logo')
uses_javascript_librararies(["aframe"])
load_once_from_file(true)
*/

    Vue.component('intro_logo_3d',{
      template: `<div id="app2">
          <a-scene style='width: 80%; height: 20%;' embedded vr-mode-ui="enabled: false">
              <a-box position="0 1.6 -15" rotation="0 0 0" color="#4CC3D9">
                  <a-entity
                       position="2 0 .6"
                       text='color: black; align: left; value: AppShare ; width: 9; opacity:1;'>
                       </a-entity>
                       <a-animation attribute="position"
												to="0 1.6 -1.5" dur="1000" direction="normal" ></a-animation>
              </a-box>
              <a-sky color="#ECECEC"></a-sky>
            </a-scene>
       </div>
      `
    })
    return {name: 'intro_logo_3d'}
}
