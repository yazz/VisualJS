async function(args) {
/*
created_timestamp(-1)
base_component_id("welcome")
is_app(true)
display_name("Welcome app")
uses_javascript_librararies(["aframe"])
description('Welcome app')
load_once_from_file(true)
logo_url("https://femaleentrepreneurassociation.com/wp-content/uploads/2018/03/weclome-1.png")
*/

    await load("form_subscribe_to_appshare")
    Vue.component('welcome', {

      template: `<div  class="container-fluid" style='padding:0;margin:0'>

                    <div class="row" style='background-color: black; color: white; padding-top: 20px;padding-bottom: 20px;'>
                        <div class="col-md-5">
                        <a-scene style='width: 80%; height: 20%;' embedded vr-mode-ui="enabled: false">

                            <a-assets>
                                <a-mixin id="RobotoFont" text="font: /public/aframe_fonts/Roboto-msdf.json"></a-mixin>
                                <a-mixin id="SourceCodeProFont" text="font: /public/aframe_fonts/SourceCodePro.fnt"></a-mixin>
                                <a-mixin id="AileronFont" text="font: /public/aframe_fonts/Aileron-Semibold.fnt"></a-mixin>
                            </a-assets>

                              <a-entity camera look-controls>
                                  <a-entity geometry="primitive: plane; height: 0.2; width: 0.2" position="1 0 -1"
                                          material="opacity: 0"
                                          >
                                                  <a-box position="2 10 -10" rotation="0 0 0" color="#4CC3D9"  >
                                                <a-entity
                                                     mixin="RobotoFont"
                                                     position="3.5 0 .6"
                                                     text='color: white; align: left; value: AppShare ; width: 15; opacity:1;'>
                                                     </a-entity>
                                                 <a-animation attribute="position"
                                                                          to="0 0 -1.5" dur="2000" direction="normal" ></a-animation>
                                            </a-box>
                                             </a-entity>
                                             </a-entity>
                                            <a-sky color="black"></a-sky>
                          </a-scene>
                        </div>
                        <div class="col-md-1">
                        </div>
                        <div class="col-md-5 text-right">
                            Contact@AppShare.co   +45 2859 5405
                        </div>
                        <div class="col-md-1"></div>
                    </div>



                    <div class="row" style='background-color: black; color: white; padding-top: 20px;padding-bottom: 20px;'>

                        <div class="col-md-1"></div>
                        <div class="col-md-5">
                            <h2><b>Create amazing interactive forms for your website</b></h2>
                              <ul style='background-color: black; color: white;'>
                                  <li style='background-color: black; color: white;'>Build forms in under 5 minutes in Javascript</li>
                                  <li style='background-color: black; color: white;'>Embed forms easily into your website</li>
                                  <li style='background-color: black; color: white;'>Many templates available to get started easily</li>
                                  <li style='background-color: black; color: white;'>Use online or host it in your Enterprise</li>
                              </ul>
                        </div>
                        <div class="col-md-5" style='background-color: white'>
                            <img src='/homepage_shot.jpg'></img>

                            <div class="row" style='background-color: black; height:20px;'></div>
                            <div class="row" style='background-color: black; padding: 5px; color: white;'>
                                <div class="col-md-12" style='background-color: black'>

                                    <form_subscribe_to_appshare/>
                                </div>
                            </div>

                            <div class="row" style='background-color: black; height:20px;'></div>





                        </div>
                        </div>



                    <div class="row" style='background-color: white; color: black; padding-top: 20px;padding-bottom: 20px;'>

                        <div class="col-md-1">
                        </div>
                        <div class="col-md-10">
                            <div class='display-3 text-center'>Choose a template and create a form now</div>


                                <div style='background-color: white;' class="card-columns">
                                 <div class="card" style="width: 20rem;" v-for="item in apps">
                                 <img    v-if='item.logo_url'
                                         v-bind:src='item.logo_url'
                                         style='width: 100%;'
                                         v-on:click='copyApp(item.base_component_id)'
                                         ></img>
                                   <div class="card-body">
                                     <h4 class="card-title">{{item.display_name}}</h4>
                                     <p class="card-text"></p>
                                     <div v-on:click='copyApp(item.base_component_id)' class="btn btn-primary">Copy</div>
                                   </div>
                                 </div>
                                 </div>

                        </div>
                        <div class="col-md-1"></div>
                    </div>




                    <div class="row" style='background-color: white; color: white; padding-top: 20px;padding-bottom: 20px;'>
                        <div class="col-md-2"></div>
                        <div class="col-md-3 text-left">
                            <a href="http://visifile.com/visifile/64/Appshare_Setup.exe" class="btn btn-secondary">
                               <img src='/windows.png' style='height: 30px;'></img>
                               Download Appshare for Windows
                            </a>
                        </div>
                        <div class="col-md-2"></div>

                        <div class="col-md-3 text-right">
                            <a href="http://visifile.com/visifile/64/Appshare_Setup.dmg" class="btn btn-primary">
                               <img src='/mac.png' style='height: 30px;'></img>
                               Download Appshare for Mac
                            </a>
                        </div>
                        <div class="col-md-2"></div>
                    </div>






                    <div class="row" style='background-color: lightgray; color: black; padding-top: 20px;padding-bottom: 20px;'>
                        <div class="col-md-1">
                        </div>
                        <div class="col-md-10 text-center display-3">
                            This website was designed with Appshare
                        </div>
                        <div class="col-md-1"></div>


                    </div>




                    <div class="row" style='background-color: black; color: white; padding-top: 20px;padding-bottom: 20px;'>
                        <div class="col-md-1">
                        </div>
                        <div class="col-md-4 text-center">
                            On Github:
                            <a href='https://github.com/zubairq/appshare'>https://github.com/zubairq/appshare</a>
                        </div>
                        <div class="col-md-4 text-center">

                            Website:
                            <a href='http://AppShare.co'>AppShare.co</a>
                        </div>
                        <div class="col-md-1"></div>


                    </div>



                </div>
       `
      ,


    data: function() {
        return {
                    apps: []
                }},

      mounted: function() {
          this.search()
      },
      methods: {
          search: async function() {
               this.apps = await callApp({   driver_name: "systemFunctions3",  method_name:"get_public_apps_list"}, { }) }

      }
    })
}
