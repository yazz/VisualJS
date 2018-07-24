async function(args) {
/*
created_timestamp(-1)
base_component_id("homepage")
is_app(true)
display_name("Homepage app")
description('Homepage app')
load_once_from_file(true)
logo_url("data:image/jpeg;base64,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")
*/

    await callApp({driver_name:    "formSubscribeToAppshare",method_name:    "component"},{})

    Vue.component('homepage_app', {

      template: `<div  class="container-fluid" style='padding:0;margin:0'>

                    <div class="row" style='background-color: black; color: white; padding-top: 20px;padding-bottom: 20px;'>
                        <div class="col-md-1"></div>
                        <div class="col-md-5">
                            <h4><b>AppShare</b></h4>
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
                              </ul>
                                <button class='btn btn-info btn-lg'
                                v-on:click='document.location="/?goto=Create%20New%20App%20From%20Template&time=" + new Date().getTime();return false;'>
                                Create a form now</button>
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
                            <h1>Or change an existing form in our collection</h1>


                                <div style='background-color: white;' class="card-columns">
                                 <div class="card" style="width: 20rem;" v-for="item in apps">
                                 <img    v-if='item.logo_url'
                                         v-bind:src='item.logo_url'
                                         style='width: 100%;'
                                         v-on:click='document.location="/?goto=" + item.display_name + "&time=" + new Date().getTime();return false;'
                                         ></img>
                                   <div class="card-body">
                                     <h4 class="card-title">{{item.display_name}}</h4>
                                     <p class="card-text"></p>
                                     <a v-bind:href='"/?goto=" + item.display_name + "&time=" + new Date().getTime()' class="btn btn-primary">Run</a>
                                   </div>
                                 </div>
                                 </div>

                        </div>
                        <div class="col-md-1"></div>
                    </div>




                    <div class="row" style='background-color: black; color: white; padding-top: 20px;padding-bottom: 20px;'>
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




                    <div class="row" style='background-color: lightgray; color: white; padding-top: 20px;padding-bottom: 20px;'>
                        <div class="col-md-1">
                        </div>
                        <div class="col-md-10 text-center">
                            It's also open source on Github:
                            <a href='https://github.com/zubairq/appshare'>https://github.com/zubairq/appshare</a>
                                    <br><br><br>

                            See our website at:<br>
                            <a href='http://AppShare.co'>AppShare.co</a>
                                    <br><br><br>
                        </div>
                        <div class="col-md-1"></div>
                        </div>

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

    return {name: "homepage_app"}
}
