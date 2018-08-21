async function(args) {
/*
created_timestamp(-1)
base_component_id("homepage_1")
is_app(true)
display_name("Homepage 1")
uses_javascript_librararies(["aframe"])
description('Homepage 1')
load_once_from_file(true)
read_only(true)
logo_url("https://moe.it.slotshaven.dk/wp/wp-content/uploads/2017/11/homepage.png")
*/

    Vue.component('homepage_1', {

      template:
`<div  class="container" style=''>

    <div class="row" style='background-color: white; color: black; padding-top: 20px;padding-bottom: 20px;'>
        <div class="col-md-12">
        <h2><b>Create and share apps on your intranet</b></h2>
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
              <li >Installs on Mac/PC</li>
              <li >Create apps in minutes</li>
              <li >All apps back by a powerful SQL database</li>
              <li >Share with colleagues by sending an internal link</li>
              <li >Many templates available to get started easily</li>
          </ul>



          <div style='height:20px; width: 10px;'></div>
         <a href="http://visifile.com/visifile/64/Appshare_Setup.exe" class="btn btn-secondary">
                 <img src='/windows.png' style='height: 30px;'></img>
                 Download Appshare for Windows
              </a>
              <div style='height:20px; width: 10px;'></div>
              <a href="http://visifile.com/visifile/64/Appshare_Setup.dmg" class="btn btn-primary">
                 <img src='/mac.png' style='height: 30px;'></img>
                 Download Appshare for Mac
              </a>
              <div style='height:20px; width: 10px;'></div>


              <template v-if='!subscribed'>
                      <div class="form-group">
                          <div class='text-center' style='font-weight:bold;padding-bottom: 10px;'>Subscribe to the Appshare newsletter</div>
                          <input id=add placeholder="email address" type="email" class='form-control' v-model="email_address" style='margin-bottom: 10px;'></input>
                          <button class="btn btn-info btn-block" v-on:click='insert_email(email_address)'>Subscribe</button>
                      </div>
              </template>
              <template v-if='subscribed' >
                  <div class='text-center' style='font-weight:bold;padding-bottom: 10px;'>
                      Thanks for subscribing to the Appshare newsletter {{email_address}}!
                  </div>
              </template>


            </div>
</div>`

,




methods: {
     insert_email: async function(email) {
          await sql( "insert into users (id, email, when_created) values (?,?,?)"
                      ,
                      [  uuidv4(),  email  ,  new Date().getTime() ])
          this.subscribed = true

      }
}
,
    data: function() {
        return {
                    apps: [],
                    email_address: "",
                    subscribed: false
                }}


    })
    /*
    sqlite(
    [
        "Create the initial users table to store the email addresses",
        [
            "CREATE TABLE users (id	TEXT, email	TEXT, when_created INTEGER);"
        ]

    ])//sqlite

    */
}
