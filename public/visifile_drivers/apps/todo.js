async function(args) {
/*
base_component_id("todo")
created_timestamp(-1)
is_app(true)
display_name("Todo App")
visibility("PUBLIC")
description("This will create a demo todo app")
load_once_from_file(true)
logo_url("https://i.imgur.com/OvMZBs9.jpg")
read_only(true)
*/
Vue.component("todo", {
    template: `<div style='width:200px;height:200px;padding:20px;'>
         Todo List<br>
          <li v-for='item in items'>
              <button v-on:click='delete_item(item.id)'>x</button> {{item.name}}
          </li>
          <input id=add v-model="new_item"></input>
          <button v-on:click='add_item(new_item)'>Add</button>
    </div>
     `
    ,
    data: function() {
        return {
            items: [],
            new_item: ""
        }
    }
,
    mounted: async function() {
        this.items = await sql("select id,name from items")
        //alert(JSON.stringify(this.items,null,2))
    },
    methods: {
        add_item: async function(x) {
             await sql("insert into items (id,name) values (" + new Date().getTime() + " ,'" + x + "')")
             this.items = await sql("select id,name from items")
             this.new_item = ""
        }
        ,
        delete_item: async function(x) {
             await sql("delete from items where id = ?",[x] )
             this.items = await sql("select id,name from items")
        }

    }
 })

 /*
 allowAccessToAppBaseComponentIds([""])
 allowAccessToAppTypes(["database_reader"])
 sqlite(
 [
     "Create the initial item table",
     ["CREATE TABLE items (id	TEXT, name	TEXT);",
      "alter TABLE items add column time INTEGER;"]
      ,
      "Add a column for the user name",
     ["alter TABLE items add column user TEXT;"]

 ])//sqlite
grant_full_db_access_to(["todo_app_reader"])
*/
}
