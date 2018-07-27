async function(args) {
/*
base_component_id("todo_app_reader")
created_timestamp(-1)
is_app(true)
display_name("Todo app Reader")
description("This will read another application's database")
load_once_from_file(true)
logo_url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAARwAAACZCAMAAADKIHUNAAAARVBMVEX//////2a74OMAAACAgIBNTU3k5OSbm5vb29vX19fU1NTR0dHLy8vGxsa/v7+2traurq6kpKSSkpKJiYl5eXlycnJtbW05gub8AAAD00lEQVR4nO2c6YKiMBCE3Y3s7Ny37/+o6wExsFBpJPZYpOoHQYld5TckHDpuNqGUNliMPuFXIWVDE/oIDvARHOBTDs526xPa0UdwgI/gAB/BAT6x1ljRMP70eF9jaCafc62RHhMGozKGpvIRHOAzgLNvQtocnw3htO3QnBbxybbj7NAcPrFW1+VUInSVQtw23sRhbAvN5TOEM3xFfw6bqjk/NIVPu3YSLjbRY05oMp8z6HGO52JobzSH5vJJah1aPEaX/kXZfIZw4OzeK9j1uCw0hU9XJ5ZLmzmad1rP4SM4wEdwgM8FL5suZg/N4SM4wEdwgI+plqXT4tDdSe21feKhPO9jet8WOsvhJMtr+iTnMjmf+uDM8KkVTlZGOPbdcFlopzmHE06yvL5PVjY4wfYnrRSOrSQZnDITchi0txB6kU/JQ7kfHM6TQJOqvXywFhMcUExwQDHBAcUEBxRbHZxiyoXm9Nnm1DTZLkfB0BYjozx9sp0EB6hmOFk1janbYlH6UIb28qEM7eVDGdrLhzK0lw9laC8fytBePpShvXwoQ3v5UIb28qEM7eVDGbqIj+HORtNY7n8s97HJ0yf8LqNsaEqfMtVymUl9KEMLzi34lKiWz0zqQxnazWd5NUtmUh/K0IJzCz5Lq9kyk/pQhnbzWVbNmpnUhzK04NyCz5Jq9sykPovvfFhDr8znFu/Q3ZAPZWgvH8rQXj6Uob18KEN7+VCG9vKhDO3lQxnay4cytJcPZWgvH8rQXj6Uob18KEN7+VCG9vKhDO3l06xOggNUEI6XKEN7SXCABAdIcIAEB0hwgAQHSHCABAdIcIAEB0hwgAQHSHCAmnnfjKlBybeG/lz6DaJ16kBkXLXzmSYjPphMy+enQ/6QLGxqpWNjUykdwQHKTMaRTZ1wdqYJeYfgdCdEGCAh3rDbGQ7lOwQndMs1wvn+2oZJQPsN26/vquF8fty9j/8Dwt3Hpw3OcaX96Yl2kIVu9dByw3l7fXl+eny4/3vQ/cPj0/PL69u7AU5KoNuBQnyUPmRTCTib9q0nk3IfTLqFSYXg9HGEuNckx7E64fQm5P+a2EVw2iZoWMUag8FzOjQlB65upLGp2JyzRgkOkOAACQ6Q4AAJDlA5OCv8mKsgnLhIHnOrMJwEieCkleLydN0Z4iqtrgBncOFJTOdKwyq5aSo4m8GwSi48BWejYYUrdYv+/RztOcdKof9RQzjf2mGVLh+ABAdIcIAEB0hwgAQHSHCABAdIcJCCCU6dbPZ0DHBqZXO8KIJwqO86FNDhmnEcTu1kWhX4UeLr6B9w97kab80HRAAAAABJRU5ErkJggg==")
use_db("todo")
*/
Vue.component("todo_app_reader", {
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
