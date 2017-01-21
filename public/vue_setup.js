


function multi_line_string(f) {
  return f.toString().
      replace(/^[^\/]+\/\*!?/, '').
      replace(/\*\/[^\/]+$/, '');
}


var tennysonQuote = multi_line_string(function() {/*!
  Theirs not to m'ake reply,
  Theirs not t"o reason why,
  Theirs but to do and die
*/});

//alert (tennysonQuote);


function makevueapps() {

  return;

  main_output_window = new Vue({
    el: '#main_output_window',
    store: store,
    data: {
      rows: rows
    }
  });


  connections_window = new Vue({
    el: '#connections_window',
    store: store,
    computed: {
      count: function () {
        return this.$store.state.count
      }
    },
    methods: {
      increment: function () {
        this.$store.dispatch('increment')
      },
      decrement: function () {
        store.commit('decrement')
      }
    }
    //render: h => h(ct)
  });



  new Vue({
    el: '#select_source_parent2'
    ,
    store: store
    ,
    template: multi_line_string(function() {/*!
        <select id=select_source>
          <option v-for="option in options" v-bind:value="option.id">
              {{ option.id }}
          </option>
        </select>
*/})
    ,
    computed: {
      options: function () {
        return this.$store.state.list_of_connections;
      }
    }
  });
};













function init() {
  makevueapps();

  if (location.port == '8080') {
    gun = Gun( ['http://10.6.91.225/gun']);
  } else {
    gun = Gun( ['http://' + location.host + ':' + location.port + '/gun']);
  };

  gun.get('default').on(function(data,id){if (document.getElementById('mainid')){document.getElementById('mainid').innerHTML=data.value}});
  gun.get("data").path("pg").path("cvs").on().map(function(a,b){
    //console.log(a);
    delete a["_"];
    if (!tbrows[a.id]) {
      rows.push(a);
      tbrows[a.id] = a;
    }

  },true);




  gun.get("connections").on().map(function(a,b){
    delete a["_"];
    if (!connectionrows[a.id]) {
      data_connections_list.push(a);
      connectionrows[a.id] = a;
      //console.log(a);
      store.dispatch('add_connection', {cn: a.id, cp: a})
    }

  },true);



  initBlockly();




};





