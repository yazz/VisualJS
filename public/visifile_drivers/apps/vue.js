function(args) {
/*
base_component_id("vue")
created_timestamp(1529866767800)
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
        }


    })


    return {name: "VueApp"}
}
