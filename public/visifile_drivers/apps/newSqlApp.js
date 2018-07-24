async function(args) {
/*
base_component_id("newSql")
created_timestamp(1529939023323)
is_app(true)
display_name("New SQL App")
description("This will create a new SQL app")
load_once_from_file(true)
logo_url("https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/SQLite370.svg/330px-SQLite370.svg.png")
*/
Vue.component("newSql", {
   template: `<div>
        SqlApp
         <li v-for='item in items'>
             {{item}}
         </li>
   </div>
    `
    ,
    data: function() {
        return {
            items: ["SQL", "The simpsons!"]
        }
    }

 })

}
