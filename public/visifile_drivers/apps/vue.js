async function(args) {
/*
base_component_id("vue")
created_timestamp(1529939023323)
is_app(true)
display_name("VueJS test App")
description("This will return the Vue test app")
load_once_from_file(true)
*/
var promise = new Promise(result => {
    setTimeout(function() {
        //alert(1)
        result( "Promise fulfilled...")

           var ww = Vue.component("VueApp", {
             template: `<div>Vue test app:
               <div>{{value}}</div>
             </div>
              `
              ,data: function() {
               return {
                           value: "waiting for promise..."
               }},
               mounted: async function() {
                   var ww =this


                   ww.value = "DONE";
               }


       })
   },2500)
});
   var ret = await promise;


   return {name: "VueApp"}
}
