async function(args) {
/*
created_timestamp(-1)
base_component_id("homepage_5")
is_app(true)
display_name("Homepage 5")
uses_javascript_librararies(["aframe"])
description('Homepage 5')
load_once_from_file(true)
read_only(true)
logo_url("https://moe.it.slotshaven.dk/wp/wp-content/uploads/2017/11/homepage.png")
*/

    await load("form_subscribe_to_appshare")
    Vue.component('homepage_5', {

      template:
`<div  class="container" style='width:300px;height:100px;'>

Appshare is OpenSource and on Github:
<a href='https://github.com/zubairq/appshare'>https://github.com/zubairq/appshare</a>
</div>`
    })
}
