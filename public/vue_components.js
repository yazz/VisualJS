/* **********************************************************************
INDEX
-----

one-row                  - used for testing only
postgres-view-connection - view the oracle connection
rows-table               - used for testing only
yazz-new-connection      - used to input a new connection

********************************************************************** */


Vue.component('one-row', {
  props: ['row'],
  template: '<li >{{ row.full_name }}</li>'
});





Vue.component('rows-table', {
  props: ["rows"],
  template: multi_line_string(function() {/*!
<div class='container'>
  <div class='row'>
    <div class='col-md-6'>{{rows.length}} connections
      <ul  v-for="a_row in rows">
        <one-row v-bind:row="a_row"></one-row>
      </ul>
    </div>
  </div>
</div>
*/})
});










