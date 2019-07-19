function(args) {
/*
is_app(true)
control_type("VB")
display_name("Data Window control")
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
            id:         "width",
            name:       "Width",
            default:    350,
            type:       "Number"
        }
        ,
        {
            id:         "height",
            name:       "Height",
            default:    300,
            type:       "Number"
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
        ,
        {
            id:         "setData",
            snippet:    `setData([{a: 1, b: "c"},{a: 2, b: "d"}])`,
            name:       "setData",
            type:       "Action"
        }
        ,
        {
            id:         "resetColumns",
            snippet:    `resetColumns()`,
            name:       "resetColumns",
            type:       "Action"
        }
        ,
        {
            id:     "addColumn",
            name:   "addColumn",
            type:   "Action"
        }
        ,
        {
            id:     "sql",
            name:   "SQL",
            type:   "String",
            default: "SELECT * FROM pg_catalog.pg_tables;"
        }
        ,
        {
            id:      "user",
            name:    "USER",
            type:    "String",
            default_expression: "(typeof $POSTGRES_USER !== 'undefined')?eval('$POSTGRES_USER'):'postgres'"
        }
        ,
        {
            id:     "password",
            name:   "Password",
            type:   "String",
            default_expression: "(typeof $POSTGRES_PASSWORD !== 'undefined')?eval('$POSTGRES_PASSWORD'):'password'",
        }
        ,
        {
            id:     "database",
            name:   "Database",
            type:   "String",
            default_expression: "(typeof $POSTGRES_DATABASE !== 'undefined')?eval('$POSTGRES_DATABASE'):'postgres'",
        }
        ,
        {
            id:     "port",
            name:   "Port",
            type:   "Number",
            default_expression: "(typeof $POSTGRES_PORT !== 'undefined')?eval('$POSTGRES_PORT'):5432",
        }
        ,
        {
            id:     "host",
            name:   "Host",
            type:   "String",
            default_expression: "(typeof $POSTGRES_HOST !== 'undefined')?$POSTGRES_HOST:'localhost'",
        }

        ,
        {
            id:     "result",
            name:   "result",
            type:   "Array",
            default:    []
        }
        ,
        {
            id:         "executeSql",
            pre_snippet: `await `,
            snippet:    `executeSql()`,
            name:       "executeSql",
            type:       "Action",
            help:       `<div>Help text for
                            <b>executeSql</b> function
                            <div>The SQL is store in the "sql" property</div>
                         </div>`
        }
        ]
)//properties
logo_url("/driver_icons/data_window.png")
*/

    Vue.component("data_window_control",{
      props: ["meta","name","args","refresh","design_mode"]
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
         value:              null
         ,
         selected_index:     null
         ,
         items:             []
         ,
         new_value:          ""
         ,
         new_text:           ""
         ,
         columnDefinitions: [ ]
         ,
         data:              [ ]
         ,
         table:              null
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


     mounted: async function() {
         registerComponent(this)

         if (isValidObject(this.args)) {
             this.items = this.args.items
             if (isValidObject(this.args.value)) {
                this.value = this.args.value
             }
         }


          this.table = new Tabulator(this.$refs.exampletable, {
                 width:                    this.args.width
                 ,
                 height:                    this.args.height
                 ,
                 data:                      this.data
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

         if (!this.design_mode) {

             var results = await this.executeSql()
             //alert(JSON.stringify(results,null,2))
             await this.setData(results.value)
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


            ,
            resetColumns: async function(data) {
                this.table.setColumns([])
            }
            ,
            addColumn: async function(colData) {
                this.table.addColumn(colData, true, "name");
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
            setData: async function(data) {
                this.data = data
                this.table.setData(data)

                var keysOfData = new Object()
                if ((this.columnDefinitions == null)  || (this.columnDefinitions.length == 0)) {
                    for (var rr = 0 ; rr < data.length; rr ++) {
                        var dfg = Object.keys(data[rr])
                        for (var qq = 0 ; qq < dfg.length; qq ++) {
                            keysOfData[dfg[qq]] = true
                        }
                    }
                }

                var dfg2 = Object.keys(keysOfData)
                for (var qq2 = 0 ; qq2 < dfg2.length; qq2 ++) {
                    this.addColumn({title:dfg2[qq2], field:dfg2[qq2]})
                }

            }
            ,





            executeSql: async function() {
                if (!this.design_mode) {
                    var result = await callFunction(
                                        {
                                            driver_name: "postgres_server",
                                            method_name: "postgres_sql"  }
                                            ,{
                                                sql:             this.args.sql,
                                                user:            this.args.user,
                                                password:        this.args.password,
                                                database:        this.args.database,
                                                host:            this.args.host,
                                                port:            this.args.port
                                             })


                   //alert("executeSql: " + JSON.stringify(result,null,2))
                   console.log(JSON.stringify(result,null,2))
                   if (result.value) {
                        this.args.result = result.value.result

                        return result.value
                   }


               }
                this.args.result = []
                this.changedFn()
                return {}
            }











        }

    })
}
