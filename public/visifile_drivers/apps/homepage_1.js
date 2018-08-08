async function(args) {
/*
created_timestamp(-1)
base_component_id("homepage_1")
is_app(true)
display_name("Homepage 1")
uses_javascript_librararies(["aframe"])
description('Homepage 1')
load_once_from_file(true)
logo_url("https://moe.it.slotshaven.dk/wp/wp-content/uploads/2017/11/homepage.png")
*/

    await load("form_subscribe_to_appshare")
    Vue.component('homepage_1', {

      template:
`<div  class="container" style=''>

    <div class="row" style='background-color: white; color: black; padding-top: 20px;padding-bottom: 20px;'>
        <div class="col-md-12">
            <a-scene style='width: 80%; height: 20%;' embedded vr-mode-ui="enabled: false">

            <a-assets>
                <a-mixin id="RobotoFont" text="font: /public/aframe_fonts/Roboto-msdf.json"></a-mixin>
                <a-mixin id="SourceCodeProFont" text="font: /public/aframe_fonts/SourceCodePro.fnt"></a-mixin>
                <a-mixin id="AileronFont" text="font: /public/aframe_fonts/Aileron-Semibold.fnt"></a-mixin>
            </a-assets>

            <a-entity camera look-controls>
                <a-entity geometry="primitive: plane; height: 0.2; width: 0.2" position="1 0 -1"
                      material="opacity: 0">
                    <a-box position="2 10 -10" rotation="0 0 0" color="#4CC3D9"  >
                        <a-entity
                            mixin="RobotoFont"
                            position="3.5 0 .6"
                            text='color: black; align: left; value: AppShare ; width: 15; opacity:1;'>
                            </a-entity>
                        <a-animation attribute="position"
                              to="1 0 -1.5" dur="2000" direction="normal" ></a-animation>
                    </a-box>
                </a-entity>
            </a-entity>
            <a-sky color="white"></a-sky>
        </a-scene>
    </div>
</div>`
    })
}
