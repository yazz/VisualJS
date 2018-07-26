async function(args) {
/*
base_component_id("db_reader")
created_timestamp(-1)
is_app(true)
display_name("DB Reader")
description("This will read another application's database")
load_once_from_file(true)
logo_url("https://tapoueh.org/img/old/sql-logo.png")
*/
Vue.component("db_reader", {
    template: `<div>
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
}
