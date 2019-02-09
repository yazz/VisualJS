function(args) {
/*
is_app(true)
control_type("VB")
display_name("Table control")
description("This will return the data window control")
base_component_id("data_window_control")
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
            id:         "is_container",
            name:       "Is Container?",
            type:       "Boolean",
            default:    true,
            hidden:     true
        }
        ,
        {
            id:         "hide_children",
            name:       "Hide Children?",
            type:       "Boolean",
            default:    false,
            hidden:     true
        }

    ]
)//properties
logo_url("/driver_icons/data_window.png")
*/

    Vue.component("data_window_control",{
      props: ["args","refresh","design_mode"]
      ,
      template:
`<div   v-bind:style='"width:100%;overflow-y:auto;height:100%"
        v-bind:refresh='refresh'>

        <div ref="exampletable"></div>

    <div v-bind:style='"height:100%;width:100%; border: 0px;color:black;"'
         v-if='design_mode == "detail_editor"'>


         <input v-model="new_value"></input>
         <input v-model="new_text"></input>
         <div class="btn btn-sm btn-info"
         v-on:click="items.push({value: new_value, text:new_text});new_value='';new_text='';"
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
                 <div    class='btn btn-danger'
                         v-bind:refresh='refresh'
                         v-if='child_item'
                         v-on:click='items.splice(index, 1);changedFn();'
                         v-bind:style='"box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 8px 0px, rgba(0, 0, 0, 0.19) 0px 6px 20px 0px;padding:0px; z-index: 21474836;opacity:1;"  +
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
            v-on:change='changedFn();runEventHandler()'
            size="5"
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

         var table = new Tabulator(this.$refs.exampletable, {
            	data: [],           //load row data from array
            	layout:"fitColumns",      //fit columns to width of $
            	responsiveLayout:"hide",  //hide columns that dont fit on the table
            	tooltips:true,            //show tool tips on cells
            	addRowPos:"top",          //when adding a new row, add it to the top of the table
            	history:true,             //allow undo and redo actions on the table
            	pagination:"local",       //paginate the data
            	paginationSize:7,         //allow 7 rows per page of data
            	movableColumns:true,      //allow column order to be changed
            	resizableRows:true,       //allow row order to be changed
            	initialSort:[             //set the initial sort order of the data
            		{column:"name", dir:"asc"},
            	],
            	columns:[                 //define the table columns
            		{title:"Name", field:"name", editor:"input"},
            		{title:"Task Progress", field:"progress", align:"left", formatter:"progress", editor:true},
            		{title:"Gender", field:"gender", width:95, editor:"select", editorParams:{"Male":"male", "Female":"female"}},
            		{title:"Rating", field:"rating", formatter:"star", align:"center", width:100, editor:true},
            		{title:"Color", field:"col", width:130, editor:"input"},
            		{title:"Date Of Birth", field:"dob", width:130, sorter:"date", align:"center"},
            		{title:"Driver", field:"car", width:90,  align:"center", formatter:"tickCross", sorter:"boolean", editor:true},
            	],
            });


      }
      ,
      methods: {
            changedFn: function() {
                if (isValidObject(this.args)) {
                    this.args.value = this.value
                    this.args.items = this.items
                }
            }
            ,

            runEventHandler: function() {
                this.$emit('send', {
                                                type:               "subcomponent_event",
                                                control_name:        this.args.name,
                                                sub_type:           "changed",
                                                code:                this.args.changed_event
                                            })
            }
      }

    })
}
