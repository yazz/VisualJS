function(args) {
/*
is_app(true)
control_type("VB")
display_name("Table control")
description("This will return the Table control")
base_component_id("table_control")
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
    ]
)//properties
logo_url("/driver_icons/table.png")
*/

    Vue.component("table_control",{
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
         value:             null
         ,
         selected_index:    null
         ,
         items:             []
         ,
         new_value:         ""
         ,
         new_text:          ""
         ,
         columnDefinitions: [
                                         {title:"A", field:"a"},
                                         {title:"B", field:"b"}
                                                         ]
         ,
         data:              [ ]
         ,
         table:   null
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

         this.table = new Tabulator(this.$refs.exampletable, {
            	data:                       this.data
                ,
            	layout:                    "fitColumns"
                ,
            	responsiveLayout:          "hide"
                ,
            	tooltips:                   true
                ,
            	addRowPos:                 "top"
                ,
            	history:                    true
                ,
            	pagination:                "local"
                ,
            	paginationSize:             7
                ,
            	movableColumns:             true
                ,
            	resizableRows:              true
                ,

            	initialSort:                [
                                        	]
                ,

            	columns:                    this.columnDefinitions
            });

            this.setData([
                                            {a: 1, b: 2},
                                            {a: 12, b: 27}
                                        ])
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
            ,
            setData(data) {
                this.data = data
                this.table.setData(data)
            }
      }

    })
}
