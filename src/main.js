import Vue from 'vue'




import App                      from './components/App.vue'
import oracle_view_connection   from './components/oracle_view_connection.vue'
import postgres_view_connection from './components/postgres_view_connection.vue'
import oracle_add_connection    from './components/oracle_add_connection.vue'
import postgres_add_connection  from './components/postgres_add_connection.vue'
import yazz_new_connection      from './components/yazz_new_connection.vue'
import connections_table        from './components/connections_table.vue'


import store from './store.js'

const gun_ip_address = '172.27.0.118'



function newInit() {

    new Vue({
      el: '#welcome'
      ,
      template: `<app></app>`
      ,
      store: store
      ,
      components: {app: App,
                  'oracle-add-connection': oracle_add_connection,
                  'connections-table': connections_table}
    });

}










function newInit2() {

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
      components: {'oracle-add-connection': oracle_add_connection,
                  'connections-table': connections_table}
    });
}








function newInit3() {
  if (location.port == '8080') {
    gun = Gun( ['http://' + gun_ip_address + '/gun']);
  } else { // we are on port 80
    gun = Gun( ['http://' + location.host + '/gun']);
  };

  gun.get('networktest').on(function(data,id){if (document.getElementById('mainid')){document.getElementById('mainid').innerHTML=data.value}});

  /*gun.get("data").path("pg").path("cvs").on().map(function(a,b){
    //console.log(a);
    delete a["_"];
    if (!tbrows[a.id]) {
        if (!(a.deleted == true)) {
            rows.push(a);
            tbrows[a.id] = a;
        }
    }

  },true);
*/

  gun.get("connections").on().map(read_connections,true);



  console.log("Start");
  console.log("2");
  gun.get('default').not(function(pp) {
      console.log("2.5");
      gun.path('connections_changed').put({value: 1}).key('default');
      console.log('Doesnt exist: ' + pp);
  });
  console.log("3");
  gun.get('default').path('connections_changed.value').on(function(x) {
      connectionrows = new Object();
      data_connections_list = [];
      console.log('*****new val = ' + x);
      store.dispatch('clear_connections');
      gun.get("connections").map(read_connections,true);
  },true);
 // gun.get("connections").map(read_connections,true);
};

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



function newInit4() {


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





newInit();
newInit2();


newInit3();
newInit4();
