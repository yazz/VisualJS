async function kinetic_app(args) {
/*
created_timestamp(1547306765340)
base_component_id("kinetic")
visibility("PUBLIC")
display_name("Kinetic app")
is_app(true)
description('Kinetic app')
uses_javascript_librararies(["advanced_bundle"])
logo_url("/man.jpg")
*/

    Vue.component('kinetic',{
      template: `<div id="app2" style='padding: 20px;'>
      <div class="btn btn-danger" value="Click" v-on:click="evt()" >Click</div>
          <img  id="man22" width="200px"
                src="/man.jpg">
           </img>


       </div>`,
      methods: {
          evt: async function()  {
                alert("Started")
                var aqq = document.getElementById('man22');
                var net = await posenet.load();
                var  pose2 = await net.estimateSinglePose(aqq,0.5,false,16)
                alert(JSON.stringify(pose2,null,2))
          }
      }

    })
}
