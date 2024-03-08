function(args) {
/*
is_app(true)
component_type("VB")
hash_algorithm("SHA256")
display_name("Dropdown control")
description("This will return the dropdown control")
base_component_id("dropdown_control")
load_once_from_file(true)
visibility("PRIVATE")
read_only(true)
properties(
    [
        {
            id:     "text",
            name:   "Text",
            type:   "String"
        }
        ,
        {
            id:     "background_color",
            name:   "Background color",
            type:   "String"
        }
        ,
        {
            id:         "items",
            name:       "Items",
            type:       "Array",
            default:    [],
            editor:     "detail_editor"
        }
        ,

        {
            id:         "has_details_ui",
            name:       "Has details UI?",
            type:       "Boolean",
            default:    true,
            hidden:     true
        }
        ,
        {
            id:     "changed_event",
            name:   "Changed event",
            type:   "Event"
        }
        ,
        {
            id:     "default_selection",
            name:   "Default Selection",
            type:   "String",
            default: ""
        }
    ]
)//properties
logo_url("/driver_icons/dropdown.png")
*/

    Yazz.component({
      props: ["control_properties_and_events","refresh","design_mode",  "runEvent"]
      ,
      template:
`<div   v-bind:style='"width:100%;overflow-y:auto;height:100%"
        v-bind:refresh='refresh'>

    <div v-bind:style='"height:100%;width:100%; border: 0px;color:black;"'
         v-if='design_mode == "detail_editor"'>

         <div class="form-group">
             <label for="usr">Display:</label>
             <input v-model="new_text" type="text" class="form-control" id="usr">
         </div>
         <div class="form-group">
             <label for="usr">Value:</label>
             <input v-model="new_value" type="text" class="form-control" id="usr">
         </div>
         <div    class="btn btn-sm btn-info"
                 v-on:click="items.push({value: new_value, text:new_text});new_value='';new_text='';"
                 style="margin-bottom: 30px;"
         >
                 Add
         </div>


        <table class="table">
          <thead class="thead-dark">
            <tr>
              <th scope="col">Display</th>
              <th scope="col">Value</th>
              <th scope="col"></th>
              <th scope="col">Delete</th>
            </tr>
          </thead>



          <tbody  v-bind:refresh='refresh'
                  v-for='(child_item,index)  in  items'>

             <tr v-if='child_item && isValidObject(child_item)'
                     v-bind:refresh='refresh'>

               <th scope="row">{{child_item.text}}</th>

               <td>{{child_item.value}}</td>

               <td>
                   <div    class='btn btn-info'
                           v-bind:refresh='refresh'
                           v-on:click='var x = items[index];items.splice(index, 1);items.splice(index - 1, 0, x);changedFn();'
                           v-if='child_item'
                           v-bind:style='"box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 8px 0px, rgba(0, 0, 0, 0.19) 0px 6px 20px 0px;padding:0px; z-index: 21474836;opacity:1;"  +
                           "width: 60px; height: 20px; line-height:20px;text-align: center;vertical-align: middle;margin-left: 20px;"'>
                           UP

                   </div>
                   <div    class='btn btn-info'
                           v-bind:refresh='refresh'
                           v-on:click='var x = items[index];items.splice(index, 1);items.splice(index + 1, 0, x);changedFn();'
                           v-if='child_item'
                           v-bind:style='"box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 8px 0px, rgba(0, 0, 0, 0.19) 0px 6px 20px 0px;padding:0px; z-index: 21474836;opacity:1;"  +
                           "width: 60px; height: 20px; line-height:20px;text-align: center;vertical-align: middle;margin-left: 20px;"'>
                           DOWN

                   </div>
               </td>

               <td>
                   <div    class='btn btn-danger'
                           v-bind:refresh='refresh'
                           v-if='child_item'
                           v-on:click='items.splice(index, 1);changedFn();'
                           v-bind:style='"box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 8px 0px, rgba(0, 0, 0, 0.19) 0px 6px 20px 0px;padding:0px; z-index: 21474836;opacity:1;"  +
                           "width: 20px; height: 20px; line-height:20px;text-align: center;vertical-align: middle;margin-left: 20px;"'>
                           X
                   </div>
               </td>

             </tr>



       </tbody>
     </table>

     </div>

    <div v-bind:style='"height:100%;width:100%; border: 0px;" +
                       "background-color: "+    control_properties_and_events["background_color"]  +  ";"'
         v-else>

         {{control_properties_and_events.text?control_properties_and_events.text:""}}

        <select
            v-on:change='changedFn();runEventHandler()'>

            <option v-for='opt in control_properties_and_events.items'
                    v-bind:selected='control_properties_and_events.default_selection == opt.value'
                    v-bind:value='opt.value'>
                {{opt.text}}
            </option>
        </select>
    </div>




</div>`
      ,
      data: function() {
       return {
         value:             null,
         selected_index:    null,
         items:             [],
         new_value:         "",
         new_text:          ""
       }
     }
     ,
     watch: {
       // This would be called anytime the value of the input changes
       refresh: function(newValue, oldValue) {
           //console.log("refresh: " + this.control_properties_and_events.text)
           if (isValidObject(this.control_properties_and_events)) {
               this.value = this.control_properties_and_events.value
               this.items = this.control_properties_and_events.items
           }
       }
     }
     ,
     mounted: function() {
         if (isValidObject(this.control_properties_and_events)) {
             this.items = this.control_properties_and_events.items
             if (isValidObject(this.control_properties_and_events.value)) {
                this.value = this.control_properties_and_events.value
             }
         }
      }
      ,
      methods: {
            changedFn: function() {
                if (isValidObject(this.control_properties_and_events)) {
                    this.control_properties_and_events.value = this.value
                    this.control_properties_and_events.items = this.items
                }
            }
            ,

            runEventHandler: async function() {
                await this.runEvent({ display: "changed",   code: this.control_properties_and_events.changed_event })

            }
      }

    })
}
