async function(args) {
/*
created_timestamp(-1)
base_component_id("welcome")
is_app(true)
display_name("Welcome app")
uses_javascript_librararies(["aframe"])
description('Welcome app')
load_once_from_file(true)
logo_url("data:image/jpeg;base64,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")
*/

    await load("form_subscribe_to_appshare")
    Vue.component('welcome', {

      template:
      `<div  class="container-fluid" style='padding:0;margin:0'>

        <div class="row" style='background-color: black; color: white; padding: 20px;'>
            <div class="col-md-12">
                <h2><b>Create amazing interactive forms for your website</b></h2>
            </div>
            <div class="col-md-12">
                <ul style='background-color: black; color: white;'>
                    <li style='background-color: black; color: white;'>Build forms in under 5 minutes in Javascript</li>
                    <li style='background-color: black; color: white;'>Embed forms easily into your website</li>
                    <li style='background-color: black; color: white;'>Many templates available to get started easily</li>
                    <li style='background-color: black; color: white;'>Use online or host it in your Enterprise</li>
                </ul>
            </div>

            <div class="col-md-12">
                <a-scene style='width: 100%; height: 20%;' embedded vr-mode-ui="enabled: false">

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


            <div class="col-md-12" style='background-color: black'>
                <form_subscribe_to_appshare/>
            </div>

        </div>



        <div class="row" style='background-color: white; color: black; padding: 20px;'>

            <div class="col-md-12">
                <div class='display-3 text-center'>Choose a template and create a form now</div>
            </div>

        <div class="col-md-12">
            <div style='background-color: white;' class="card-columns">
                <div class="card" style="width: 10rem;" v-for="item in apps">
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




                        <div class="col-md-6 text-left">
                            <a href="http://visifile.com/visifile/64/Appshare_Setup.exe" class="btn btn-secondary">
                               <img src='/windows.png' style='height: 30px;'></img>
                               Download Appshare for Windows
                            </a>
                        </div>

                        <div class="col-md-6 text-right">
                            <a href="http://visifile.com/visifile/64/Appshare_Setup.dmg" class="btn btn-primary">
                               <img src='/mac.png' style='height: 30px;'></img>
                               Download Appshare for Mac
                            </a>
                        </div>
                    </div>






                    <div class="row" style='background-color: lightgray; color: black; padding-top: 20px;padding-bottom: 20px;'>
                        <div class="col-md-12 text-center display-3">
                            This website was designed with Appshare
                        </div>


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
