async function(args) {
/*
created_timestamp(-1)
base_component_id("homepage_1")
is_app(true)
display_name("Homepage 1")
description('Homepage 1')
uses_javascript_librararies(["aframe"])
load_once_from_file(true)
read_only(true)
logo_url("https://moe.it.slotshaven.dk/wp/wp-content/uploads/2017/11/homepage.png")
*/

    Vue.component('homepage_1', {

      template:
`<div  class="container" style=''>

    <div class="row" style='background-color: white; color: black; padding-top: 20px;padding-bottom: 20px;'>
        <div class="col-md-12">
        <h2><b>Create and share webapps by coding a single JS file</b></h2>
            <a-scene style='width: 80%; height: 100px;' embedded vr-mode-ui="enabled: false">

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
          <ul style='background-color: white; color: black;'>
              <li >Create apps in minutes</li>
              <li >All apps backed by a SQLite database</li>
              <li >Share an app by sending a URL link</li>
              <li >Use templates to get started with information apps, forms, database apps, and 3D interactive apps</li>
              <li >Open source (<a href='https://github.com/zubairq/appshare'>https://github.com/zubairq/appshare</a>)</li>
              <li >Can be hosted locally on Mac/PC</li>
          </ul>



          <div style='height:20px; width: 10px;'></div>
         <a href="http://appshare.co/visifile/64/Appshare_Setup.exe" class="btn btn-secondary">
                 <img src='/windows.png' style='height: 30px;'></img>
                 Download Appshare for Windows
              </a>
              <div style='height:20px; width: 10px;'></div>
              <a href="http://appshare.co/visifile/64/Appshare_Setup.dmg" class="btn btn-primary">
                 <img src='/mac.png' style='height: 30px;'></img>
                 Download Appshare for Mac
              </a>
              <div style='height:20px; width: 10px;'></div>


              <div id="mc_embed_signup">
<form action="https://zubairquraishi.us7.list-manage.com/subscribe/post?u=46afb6bb668c1280c3e739c54&amp;id=72288e6dc0" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" class="validate" target="_blank" novalidate="">
    <div id="mc_embed_signup_scroll">
	<label for="mce-EMAIL">Subscribe to our mailing list</label>
	<input type="email" value="" name="EMAIL" class="email" id="mce-EMAIL" placeholder="email address" required="">
    <!-- real people should not fill this in and expect good things - do not remove this or risk form bot signups-->
    <div style="position: absolute; left: -5000px;" aria-hidden="true"><input type="text" name="b_46afb6bb668c1280c3e739c54_72288e6dc0" tabindex="-1" value=""></div>
    <div class="clear"><input type="submit" value="Subscribe" name="subscribe" id="mc-embedded-subscribe" class="button"></div>
    </div>
</form>
</div>


            </div>
</div>`



    })
}
