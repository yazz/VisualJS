import Vue from 'vue'




import App                      from './components/App.vue'
import oracle_view_connection   from './components/oracle_view_connection.vue'
import postgres_view_connection from './components/postgres_view_connection.vue'
import oracle_add_connection    from './components/oracle_add_connection.vue'
import postgres_add_connection  from './components/postgres_add_connection.vue'
import yazz_new_connection      from './components/yazz_new_connection.vue'
import connections_table        from './components/connections_table.vue'


import store from './store.js'

const gun_ip_address = '172.18.0.102'



function initWelcomeVuePane() {
    if (document.getElementById('welcome')) {
        console.log(' Welcome pane exists');
        new Vue({
          el: '#welcome'
          ,
          template: `<app></app>`
          ,
          store: store
          ,
          components: {app: App}
        });

        setupGunDB();
    }
    if (document.getElementById('welcome')) {
        console.log(' Welcome pane still exists');
    } else {
        console.log(' Welcome pane does not exist anymore');
        }
}










function setupSqlVuePane() {

    if (document.getElementById('select_source_parent')) {
        new Vue({
          el: '#select_source_parent'
          ,
          store: store
          ,
          template: `
                <select id=select_source>
                  <option v-for="option in options" v-bind:value="option.id">
                      {{ option.id }}
                  </option>
                </select>
        `
          ,
          computed: {
            options: function () {
              return this.$store.state.list_of_connections;
            }
          }
          ,
          components: {'connections-table': connections_table}
        });
    }
}








function setupGunDB() {
        if (location.port == '8080') {
            gun = Gun( ['http://' + gun_ip_address + '/gun']);
        } else { // we are on port 80
            gun = Gun( ['http://' + location.host + '/gun']);
        };

        gun.get('networktest').on(function(data,id) {
            if (document.getElementById('mainid')) {
                document.getElementById('mainid').innerHTML=data.value
            }});

        gun.get("connections").on().map(read_connections,true);

        gun.get('default').not(function(pp) {
            gun.path('connections_changed').put({value: 1}).key('default');
            console.log('Doesnt exist: ' + pp);
        });

        gun.get('default').path('connections_changed.value').on(function(x) {
            connectionrows = new Object();
            data_connections_list = [];
            console.log('*****new val = ' + x);
            store.dispatch('clear_connections');
            gun.get("connections").map(read_connections,true);
        },true);
}

export function inccc(){
    gun.get('default').path('connections_changed').val(function(v){
          gun.get('default').path('connections_changed').put({value: v.value + 1});
    },true);
}

function read_connections(a,b){
    delete a["_"];
    if (!connectionrows[a.id]) {
        if (!a.deleted) {
            data_connections_list.push(a);
            connectionrows[a.id] = a;
            console.log("deleted: " + a.deleted);
            store.dispatch('add_connection', {cn: a.id, cp: a})
        }
    }
}



function initConnectionsListVuePane() {

    if (document.getElementById('connections_window')) {

          new Vue({
                el: '#connections_window'
                ,
                computed: {
                  count: function () {
                    return this.$store.state.count
                  }
                }
                ,
                methods: {
                }
                ,
                store: store
                ,
                components: {'oracle-add-connection': oracle_add_connection,
                             'connections-table': connections_table}
                });
                }
}




$( document ).ready(function() {
  console.log( "ready now!" );
  initWelcomeVuePane();
  setupSqlVuePane();
  initConnectionsListVuePane();
});
