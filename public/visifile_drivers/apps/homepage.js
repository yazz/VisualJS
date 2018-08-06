async function(args) {
/*
created_timestamp(-1)
base_component_id("homepage")
is_app(true)
display_name("Homepage app")
description('Homepage app')
load_once_from_file(true)
logo_url("https://cdn0.tnwcdn.com/wp-content/blogs.dir/1/files/2017/05/Best-Homepages--796x563.jpg")
*/
    var introa = ['homepage_1','todo', 'test','vue','search']

    var mm = null

    Vue.component('homepage', {

      template: `<div  class="container-fluid" style='padding:0;margin:0'>



                    <div v-bind:refresh='refresh' class="row" style='background-color: white; color: black; padding-top: 20px;padding-bottom: 20px;'>

                        <div class="col-md-1">
                        </div>
                        <div class="col-md-10">


<div class="container">
  <div class="card-group row">
        <div class="card col-md-6">
          <div class="card-block">
            <h4 class="card-title">Card 1</h4>
            <p class="card-text">Text 1</p>
          </div>
        </div>
         <div class="card col-md-3">
          <div class="card-block">
            <h4 class="card-title">Card 2</h4>
            <p class="card-text">Text 2</p>
            <p class="card-text">More text 2</p>
            <p class="card-text">More text 2</p>
          </div>
        </div>
        <div class="card col-md-3">
          <div class="card-block">
            <h4 class="card-title">Card 3</h4>
            <p class="card-text">Text 3</p>
          </div>
        </div>
      </div>
  </div>


                                <div style='background-color: white;' class="card-columns">
                                 <div   v-if='loaded_app[item]'
                                        class="card" style="width: 100%;"
                                        v-for="item in intro_apps">
                                    <component :is='item'
                                        ></component>

                                   <div class="card-body">
                                     <h4 class="card-title">{{item.display_name}}</h4>
                                     <p class="card-text"></p>
                                     <div v-on:click='copyApp(item)' class="btn btn-primary">Copy</div>
                                   </div>
                                 </div>
                                 </div>

                        </div>
                        <div class="col-md-1"></div>
                    </div>

                    <div class="row" style='background-color: black; color: white; padding-top: 600px;padding-bottom: 20px;'>
                        <div class="col-md-5">

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
                    apps: [],
                    intro_apps: introa,
                    loaded_app: new Object(),
                    refresh: 0
                }},

      mounted: async function() {
            mm = this
            for (var rt = 0; rt < 2; rt++) {
                await load(mm.intro_apps[rt])
                mm.loaded_app[mm.intro_apps[rt]] = true
            }

            mm.search()
      },
      methods: {
          search: async function() {
               this.apps = await callApp({   driver_name: "systemFunctions3",  method_name:"get_public_apps_list"}, { }) }

      }
    })
    setTimeout(async function() {
        for (var rt2 = 2; rt2 < mm.intro_apps.length; rt2 ++) {
            var appN = mm.intro_apps[rt2]
            await load(appN)
            mm.loaded_app[appN] = true
            mm.refresh++
        }
    },3000)
}
