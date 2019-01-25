function(args) {
/*
is_app(true)
control_type("VB")
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
            default:    [{value: 1, text:"aa"}, {value: 2,text:"bb"}],
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
    ]
)//properties
logo_url("/driver_icons/dropdown.png")
*/

    Vue.component("dropdown_control",{
      props: ["args","refresh","design_mode"]
      ,
      template:
`<div   v-bind:style='"width:100%;overflow-y:auto;height:100%"
        v-bind:refresh='refresh'>

    <div v-bind:style='"height:100%;width:100%; border: 0px;color:black;"'
         v-if='design_mode == "detail_editor"'>


         <input v-model="new_value"></input>
         <input v-model="new_text"></input>
         <div class="btn btn-sm btn-info"
         v-on:click="items.push({value: new_value, text:new_text})"
         >
            Add
        </div>

         <div    v-bind:style='"border:1px solid gray; padding: 10px;display:flex;" + ((selected_index==index)?"background-color: lightgray;":"")'
                 v-bind:refresh='refresh'
                 v-for='(child_item,index)  in  items'>

             <div    v-if='child_item'
                     v-bind:refresh='refresh'>

                 <div    v-bind:style='"display:inline-block;"'
                         v-if='isValidObject(child_item)'
                         v-bind:refresh='refresh'>

                         {{child_item.value}}:{{child_item.text}}

                         </div>

                 <div    class='btn btn-info'
                         v-bind:refresh='refresh'
                         v-on:click='var x = items[index];items.splice(index, 1);items.splice(index - 1, 0, x);changedFn();'
                         v-if='child_item'
                         v-bind:style='"box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 8px 0px, rgba(0, 0, 0, 0.19) 0px 6px 20px 0px;padding:0px; z-index: 2147483647;opacity:1;"  +
                         "width: 60px; height: 20px; line-height:20px;text-align: center;vertical-align: middle;margin-left: 20px;"'>
                         UP

                 </div>
                 <div    class='btn btn-info'
                         v-bind:refresh='refresh'
                         v-on:click='var x = items[index];items.splice(index, 1);items.splice(index + 1, 0, x);changedFn();'
                         v-if='child_item'
                         v-bind:style='"box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 8px 0px, rgba(0, 0, 0, 0.19) 0px 6px 20px 0px;padding:0px; z-index: 2147483647;opacity:1;"  +
                         "width: 60px; height: 20px; line-height:20px;text-align: center;vertical-align: middle;margin-left: 20px;"'>
                         DOWN

                 </div>
                 <div    class='btn btn-danger'
                         v-bind:refresh='refresh'
                         v-if='child_item'
                         v-on:click='items.splice(index, 1);changedFn();'
                         v-bind:style='"box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 8px 0px, rgba(0, 0, 0, 0.19) 0px 6px 20px 0px;padding:0px; z-index: 2147483647;opacity:1;"  +
                         "width: 20px; height: 20px; line-height:20px;text-align: center;vertical-align: middle;margin-left: 20px;"'>
                         X

                 </div>
             </div>
         </div>

     </div>

    <div v-bind:style='"height:100%;width:100%; border: 0px;" +
                       "background-color: "+    args["background_color"]  +  ";"'
         v-else>

        <select
            v-on:change='changedFn'
            v-model='value'>

            <option v-for='opt in args.items'
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
           //console.log("refresh: " + this.args.text)
           if (isValidObject(this.args)) {
               this.value = this.args.value
               this.items = this.args.items
           }
       }
     }
     ,
     mounted: function() {
         if (isValidObject(this.args)) {
             this.items = this.args.items
             if (isValidObject(this.args.value)) {
                this.value = this.args.value
             }
         }


      }
      ,
      methods: {
            changedFn: function() {
                if (isValidObject(this.args)) {
                    this.args.value = this.value
                    this.args.items = this.items
                }
            }
      }

    })
}
