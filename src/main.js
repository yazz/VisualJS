import Vue                      from 'vue'
import Welcome                  from './components/Welcome.vue'
import ConnectedClients         from './components/central_server/connected_clients.vue'
import oracle_view_connection   from './components/oracle_view_connection.vue'
import postgres_view_connection from './components/postgres_view_connection.vue'
import oracle_add_connection    from './components/oracle_add_connection.vue'
import postgres_add_connection  from './components/postgres_add_connection.vue'
import yazz_new_connection      from './components/yazz_new_connection.vue'
import connections_table        from './components/connections_table.vue'
import drivers_table            from './components/drivers_table.vue'
import store                    from './store.js'
import db                       from '../public/dbhelper.js'


const gun_ip_address = '172.18.0.107'



function initWelcomeVuePane() {
    if (document.getElementById('welcome')) {
        console.log(' Welcome pane exists');
        new Vue({
          el: '#welcome'
          ,
          template: `<welcome-component></welcome-component>`
          ,
          components: {'welcome-component': Welcome}
        });

        setupGunDB();
    }
    if (document.getElementById('welcome')) {
        //console.log(' Welcome pane still exists');
    } else {
        //console.log(' Welcome pane does not exist anymore. Vue.js destroyed it with new Vue(...)');
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









//-----------------------------------------------------------------
// setupGunDB
//
// Set up stuff related to data handling
//
//-----------------------------------------------------------------
function setupGunDB() {
        if (location.port == '8080') {
            gun = Gun( ['http://' + gun_ip_address + '/gun']);
        } else { // we are on port 80
            gun = Gun( ['http://' + location.host + '/gun']);
        };




        /*gun.get('networktest').on(function(data,id) {
            if (document.getElementById('mainid')) {
                document.getElementById('mainid').innerHTML = data.value
            }});


        gun.get("connections").map(read_connections,true);

        gun.get('default').not(function(pp) {
            gun.path('connections_changed').put({value: 1}).key('default');
            console.log('Doesnt exist: ' + pp);
        });

        gun.get('default').path('connections_changed.value').on(function(x) {
            connectionrows = new Object();
            data_connections_list = [];
            //console.log('*****new val = ' + x);
            store.dispatch('clear_connections');
            gun.get("connections").map(read_connections,true);
        },true);*/

        //localStorage.clear();

        db.setGunDB(gun)
        db.setGunDBClass(Gun)
        db.setSqlParseFn(parseSql)
        db.start()
        //db.sql("INSERT INTO Customers (CustomerName, ContactName, Address, City, PostalCode, Country)\n VALUES ('Cardinal','Tom B. Erichsen','Skagen 21','Stavanger','4006','Norway')")
        //db.sql("SELECT age, name FROM Customers");
        //db.realtimeSql("SELECT * FROM Customers where Age > 5"
        //  ,function(results) {console.log('********* CALLED REALTIME *************:' + results);}
        //);




        realtimeSql("SELECT * FROM db_connections where deleted != 'T'"
          ,function(results) {
              //alert('SELECT * FROM db_connections')
                              //console.log('********* CALLED REALTIME DBCONN*************:' + JSON.stringify(results[0] , null, 2));
                              store.dispatch('clear_connections');
                              for (var i = 0 ; i < results.length ; i ++) {
                                  var conn = results[i]
                                  console.log('********* CALLED REALTIME DBCONN*************:' + JSON.stringify(conn , null, 2));
                                  store.dispatch( 'add_connection' , {cn:       conn.name,

                                                                      cp: {     id:      conn.name
                                                                                ,
                                                                                driver: conn.driver
                                                                                ,
                                                                                status: ''
                                                                                ,
                                                                                database: conn.database
                                                                                ,
                                                                                host: conn.host
                                                                                ,
                                                                                port: conn.port
                                                                                ,
                                                                                user: conn.user
                                                                                ,
                                                                                password: conn.password
                                                                                ,
                                                                                connectString: conn.connectString
                                                                               }});
                              };
           }
        );





                realtimeSql("SELECT * FROM drivers where deleted != 'T'"
                  ,function(results) {
                      //alert('SELECT * FROM db_connections')
                                      //console.log('********* CALLED REALTIME DBCONN*************:' + JSON.stringify(results[0] , null, 2));
                                      store.dispatch('clear_drivers');
                                      for (var i = 0 ; i < results.length ; i ++) {
                                          var conn = results[i]
                                          console.log('********* CALLED REALTIME DBCONN*************:' + JSON.stringify(conn , null, 2));
                                          store.dispatch( 'add_driver' , {cn:       conn.name,

                                                                              cp: {     id:      conn.name
                                                                                       }});
                                      };
                   }
                );










        sql("select * from globals where id = 'network_test'",
          function(res) {
              if (res.length == 0) {
                  sql("insert into globals (id, value) values ('network_test','')")
              }
          })

          realtimeSql("SELECT * FROM globals where id = 'network_test'"
            ,function(results) {
                if (results[0]) {
                    document.getElementById('maininput').value = results[0].value

                    document.getElementById('mainid').innerHTML = results[0].value
                }
            })

}

export function inccc(){
    gun.get('default').path('connections_changed').val(function(v){
          gun.get('default').path('connections_changed').put({value: v.value + 1});
    },true);
}





//-----------------------------------------------------------------
// read_connections
//
// Show the list of database connections
//
//-----------------------------------------------------------------
function read_connections(a,b){
    delete a["_"];
    if (!connectionrows[a.id]) {
        if (!a.deleted) {
            data_connections_list.push(a);
            connectionrows[a.id] = a;
            //console.log("deleted: " + a.deleted);
            store.dispatch('add_connection', {cn: a.id, cp: a})
        }
    }
}






//-----------------------------------------------------------------
// initConnectionsListVuePane
//
// Show the list of database connections
//
//-----------------------------------------------------------------
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
                components: {'oracle-add-connection':  oracle_add_connection,
                             'connections-table':      connections_table}
                });
                }
}









//-----------------------------------------------------------------
// initConnectionsListVuePane
//
// Show the list of database connections
//
//-----------------------------------------------------------------
function initDriversListVuePane() {

    if (document.getElementById('drivers_window')) {

          new Vue({
                el: '#drivers_window'
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
                components: {'oracle-add-connection':  oracle_add_connection,
                             'drivers-table':          drivers_table}
                });
                }
}



//-----------------------------------------------------------------
// initClientsConnectedVuePane
//
// not sure what this does
//
//-----------------------------------------------------------------
function initClientsConnectedVuePane() {

    if (document.getElementById('clients_connected')) {

        new Vue({
          el: '#clients_connected'
          ,
          template: `<app></app>`
          ,
          store: store
          ,
          components: {app: ConnectedClients}
        });
    }
}









//-----------------------------------------------------------------
// This is called when the web page has loaded
//
//
//
//-----------------------------------------------------------------
$( document ).ready(function() {
  console.log( "ready now!" );
  initWelcomeVuePane();
  setupSqlVuePane();
  initConnectionsListVuePane();
  initDriversListVuePane();
  initClientsConnectedVuePane();

  /*sql('insert into clienttable2 (id, next) values (3,"fdg")',
      function(record) {
          console.log('record:' + record)
      })

  sql('select * from clienttable2',
      function(record) {
          console.log('record:' + JSON.stringify(record) )
      })*/
});






//-----------------------------------------------------------------
// This is code to give a SQL interface in the browser
//
//
//
//-----------------------------------------------------------------
window.sql = function(sql, p2, p3, p4) {
    return db.sql(sql, p2, p3, p4);
}
window.sql1 = function(sql, p2, p3, p4) {
    return db.sql1(sql, p2, p3, p4);
}
window.autoIndexSerialId = function() {
    return db.autoIndexSerialId();
}


window.realtimeSql = function(sql, callBackFn, schema) {
    return db.realtimeSql(sql, callBackFn, schema);
}
