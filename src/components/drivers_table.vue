<template>

  <!--
                    the main container
        -->
  <div class='container-fluid'>
    <div class='row'>


      <!--
                    left hand side of the screen
         -->
      <div class='col-md-6'>





      <!--
                the "Add driver" button
         -->
       <button class="btn btn-primary"
                v-if="!add_driver_visible"
                @click="add_new_driver">Add new driver</button>



                <!--
                  show the list of drivers
         -->
      {{list_of_drivers.length}} drivers

      <div style="position:relative; overflow: auto;height:400px;">
        <table class="table  table-striped  table-bordered " style="position:absolute;width: 100%; height: 100%;">
          <thead >
            <tr>
              <th>ID</th>
              <th>Type</th>
              <th></th>
            </tr>
          </thead>
          <tbody v-for="a_driver  in  list_of_drivers">
            <tr scope="row" >
                <td v-on:click="set_viewed_driver(a_driver)">{{a_driver.id}}</td>
                <td v-on:click="set_viewed_driver(a_driver)">{{a_driver.type}}</td>
              <td><button v-on:click.prevent='delete_item(a_driver)'>X</button></td>
            </tr>
          </tbody>
        </table>
      </div>



      </div>



      <!--
            The right hand side
         -->
      <div class='col-md-6'>





      <!--
                 show the properties of the currently
                 selected driver
         -->
         <h2>Properties</h2>
         <view-driver driver_name='viewed_driver_id'>
             <div slot="elements">
                 <input type="text" name="item_name" value="">
                 <input type="text" name="item_value" value="">
               </div>
         </view-driver>









      <!--
                 show the fields to add a new driver
         -->


      </div>
    </div>
  </div>
</template>






<script>
import view_driver    from './view_driver.vue'


export default {
  name: 'drivers-table',

  computed: {
    list_of_drivers: function () {
      return this.$store.getters.list_of_drivers
    },

    add_driver_visible: function () {
      return this.$store.state.add_driver_visible
    },

    viewed_driver_id: function () {
      return this.$store.state.viewed_driver_id
    }
  },






  components: {
      'view-driver': view_driver
},






  data: function() {return {current: {}
                           }},


  methods: {

    add_new_driver: function() {
      this.$store.dispatch('show_add_driver')
      this.$store.dispatch('set_viewed_driver', null);
    },

    set_viewed_driver: function(selected_item) {
        //alert(selected_item.id)
        this.$store.dispatch('set_viewed_driver', selected_item);
        this.$store.dispatch('hide_add_driver');
  },

  delete_item: function(driver) {
      this.$store.dispatch('delete_driver', driver);
  }
  }
}

</script>
