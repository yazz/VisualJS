function(args) {
/*
base_component_id("vue")
created_timestamp(1529868094181)
is_app(true)
display_name("VueJS test App")
description("This will return the Vue test app")
*/

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
           var promise = new Promise(result => {
               setTimeout(function() {
                   //alert(1)
                   result( "Promise fulfilled...")
               },2500)
           });
           var ret = await promise;
           ww.value = ret;


           var promise2 = new Promise(result => {
           setTimeout(function() {
               result( "Promise fulfilled.2..")
           },6500)
           })

           setTimeout(async function() {
               var ret2 = await promise2;
               alert(ret2);
           },1500)
           ;
       }


   })


   return {name: "VueApp"}
}
