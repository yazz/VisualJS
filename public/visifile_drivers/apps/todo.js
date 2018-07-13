async function(args) {
/*
base_component_id("todo")
created_timestamp(1529939023323)
is_app(true)
display_name("Todo App")
description("This will create a demo todo app")
load_once_from_file(true)
logo_url("https://i.imgur.com/OvMZBs9.jpg")
*/
Vue.component("TodoApp", {
   template: `<div>
        Todo list is here
         <li v-for='item in items'>
             {{item}}
         </li>
   </div>
    `
    ,
    data: function() {
        return {
            items: ["Get the milk", "buy newwspaper"]
        }
    }

 })

 return {name: "TodoApp"}
}
