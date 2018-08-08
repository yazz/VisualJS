async function(args) {
/*
created_timestamp(-1)
base_component_id("homepage_4")
is_app(true)
display_name("Homepage 4")
uses_javascript_librararies(["aframe"])
description('Homepage 4')
load_once_from_file(true)
logo_url("https://moe.it.slotshaven.dk/wp/wp-content/uploads/2017/11/homepage.png")
*/

    await load("form_subscribe_to_appshare")
    Vue.component('homepage_4', {

      template:
`<div  class="container" style=''>
    In appshare everything is an app, even this website and all it's content
</div>`
    })
}
