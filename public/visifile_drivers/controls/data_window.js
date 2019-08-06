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
            id:     "limit",
            name:   "Limit",
            type:   "Number",
            default_expression: "(typeof $RETURNED_ROWS_LIMIT !== 'undefined')?eval('$RETURNED_ROWS_LIMIT'):100",
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
            id:         "design_mode_table",
            name:       "Design Table",
            type:       "String",
            default:    "",
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
            id:     "source_type",
            name:   "Data Source Type",
            type:   "String",
            default: "postgres"
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
            id:     "dataWindowColumns",
            name:   "dataWindowColumns",
            type:   "Array",
            default:    []
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
`<div   v-bind:style='"width:100%;overflow-y:auto;height:100%;color:black;"
        v-bind:refresh='refresh'>


    <div v-bind:style='"height:100%;width:100%; border: 0px;color:black;padding: 10px;"'
         v-if='design_mode == "detail_editor"'>

        <div v-bind:style='"height:100%;width:100%; overflow: none;"'>

            <ul class="nav nav-pills" v-bind:style='"height:20%;width:100%; overflow: none;"'>
                <li class="nav-item" style="width:20%;">
                    <a  v-bind:class='"nav-link " + ((designDetailTab == "connection")?"active":"")'
                        v-on:click="designDetailTab = 'connection';"
                        href="#">
                        Data source connection
                    </a>
                </li>

                <li class="nav-item" style="width:20%;">
                    <a    v-bind:class='"nav-link " + ((designDetailTab == "schema")?"active":"")'
                          v-on:click="designDetailTab = 'schema';"
                          href="#">Schema and tables</a>
                </li>

                <li class="nav-item" style="width:20%;">
                    <a    v-bind:class='"nav-link " + ((designDetailTab == "columns")?"active":"")'
                          v-on:click="designDetailTab = 'columns';"
                          href="#">Columns</a>
                </li>

                <li class="nav-item" style="width:20%;">
                    <a    v-bind:class='"nav-link " + ((designDetailTab == "where")?"active":"")'
                          v-on:click="designDetailTab = 'where';"
                          href="#">Where</a>
                </li>
            </ul>

            <div v-if='designDetailTab == "connection"'  >
                Connection

                <select  @change='alert($event)'>
                      <option   v-for='propVal in ["postgres","csv"]'
                                v-bind:value="propVal"
                                v-bind:selected='(propVal == "postgres")'>

                            {{propVal}}

                      </option>
                </select>


            </div>




            <div v-if='designDetailTab == "schema"'  >
               Database tables for schema &#34;{{args.database}}&#34;
               <div style="height:70%;width:100%; overflow-y: scroll;">

                   <div   v-for='table in tables'
                          v-on:click="args.sql = 'select * from ' + table; args.design_mode_table = table;getColumns()"
                          v-bind:style='"padding: 5px; " + ((args.design_mode_table == table)?"background-color:gray;color:white;":"background-color:white;color:gray;") '>

                         {{table}}

                   </div>
               </div>
            </div>



            <div v-if='designDetailTab == "columns"'  >
                Columns for table &#34;{{args.design_mode_table}}&#34;
                <div>


                    <div style="height:70%;width:30%; overflow-y: scroll;display:inline-block;vertical-align:top;">


                        <div   v-for='column in columns'
                               v-on:click="selected_column = column;"
                               v-bind:style='"padding: 5px; " + ((selected_column == column)?"background-color:gray;color:white;":"background-color:white;color:gray;") '>

                              {{column}}

                        </div>
                    </div>

                    <div style="height:70%;width:15%; overflow-y: none;display:inline-block;vertical-align:top;">
                        <div    class="btn"
                                type=button
                                v-on:click="args.dataWindowColumns.push({id: selected_column});setSql()">

                              Add >>

                        </div>
                        <div    class="btn"
                                type=button
                                style="margin-top:20px;"
                                v-on:click="args.dataWindowColumns.splice(selected_data_window_column_index,1);setSql()">

                              << Delete

                        </div>
                    </div>






                    <div style="height:60%;width:30%; overflow-y: none;display:inline-block;vertical-align:top;">
                        <div style="height:100%;width:100%; overflow-y: scroll;vertical-align:top;">


                            <div    v-for='(dwcolumn,index) in args.dataWindowColumns'
                                    v-on:click="selected_data_window_column = dwcolumn;selected_data_window_column_index = index"
                                    v-bind:style='"padding: 5px; " + ((selected_data_window_column == dwcolumn)?"background-color:gray;color:white;":"background-color:white;color:gray;") '>

                                  {{dwcolumn.id}}

                            </div>
                        </div>

                        <div style="height:10%;width:50%; overflow-y: none;display:inline-block;vertical-align:top;">
                            <div    class="btn-group">
                                <div    class="btn"
                                        type=button
                                        v-on:click="array_move(args.dataWindowColumns,selected_data_window_column_index,selected_data_window_column_index-1);selected_data_window_column_index --;">

                                      Up

                                </div>
                                <div    class="btn"
                                        type=button
                                        style="margin-top:20px;"
                                        v-on:click="array_move(args.dataWindowColumns,selected_data_window_column_index,selected_data_window_column_index + 1);selected_data_window_column_index ++;">

                                      Down

                                      </div>
                                  </div>
                        </div>
                    </div>



                </div>
            </div>





            <div v-if='designDetailTab == "where"'  >
                where tab
            </div>

        </div>

    </div>











    <div v-else>


        <div v-bind:style='"height:100%;width:100%; border: 0px;" +
                           "background-color: "+    args["background_color"]  +  ";"'
             v-if='design_mode == false'>

             <div    ref="exampletable"></div>


        </div>




         <div v-bind:style='"height:100%;width:100%; border: 0px;" +
                            "background-color:white;color:black;"'
              v-else>


                     <b>SQL:</b>
                        {{args.sql}}
         </div>

     </div>





</div>`
      ,


      data: function() {
       return {
         selected_index:      null
         ,
         columnDefinitions:  [ ]
         ,
         data:               [ ]
         ,
         tables:             [ ]
         ,
         columns:            [ ]
         ,
         selected_column:    ""
         ,
         selected_data_window_column:    ""
         ,
         selected_data_window_column_index:    -1
         ,
         designDetailTab:     "connection"
       }
     }
     ,


     watch: {
       // This would be called anytime the value of the input changes
       refresh: function(newValue, oldValue) {
           //console.log("refresh: " + this.args.text)
           if (isValidObject(this.args)) {
               this.getTables()
               //alert(JSON.stringify(this.tables,null,2))
           }
       }
     }
     ,


     mounted: async function() {
         registerComponent(this)

         if (isValidObject(this.args)) {
         }

         if (this.design_mode == false) {
             this.table = new Tabulator(this.$refs.exampletable, {
                    width:                    this.args.width
                    ,
                    height:                    this.args.height
                    ,
                    tables:                    []
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
                    tableNames:              []
                    ,

                	initialSort:                [
                                            	]
                    ,

                	columns:                    this.columnDefinitions
                });

         }
         if (this.design_mode) {
             await this.getTables()

         }

         if (!this.design_mode) {

             var results = await this.executeSql()
             //alert(JSON.stringify(results,null,2))
             await this.setData(results.value)
         }

      }
      ,


      methods: {
            setSql: function() {
                var colSql = "*"
                if (this.args.dataWindowColumns.length > 0) {
                    colSql = ""
                    for (var coli=0; coli < this.args.dataWindowColumns.length; coli ++) {
                        colSql += this.args.dataWindowColumns[coli].id
                        if (coli< (this.args.dataWindowColumns.length - 1)) {
                            colSql += ","
                        }
                    }
                }
                this.args.sql = "select " + colSql + " from " + this.args.design_mode_table


            }
            ,
            changedFn: function() {
                if (isValidObject(this.args)) {
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

                if (this.args.dataWindowColumns.length == 0) {
                    var dfg2 = Object.keys(keysOfData)
                    for (var qq2 = 0 ; qq2 < dfg2.length; qq2 ++) {
                        this.addColumn({title:dfg2[qq2], field:dfg2[qq2]})
                    }

                } else {
                    for (var coli = this.args.dataWindowColumns.length - 1; coli >= 0; coli --) {
                        this.addColumn({title:this.args.dataWindowColumns[coli].id, field:this.args.dataWindowColumns[coli].id})
                    }
                }

            }
            ,



            array_move: function (arr, old_index, new_index) {
                if (new_index >= arr.length) {
                    var k = new_index - arr.length + 1;
                    while (k--) {
                        arr.push(undefined);
                    }
                }
                arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
                return arr; // for testing
            }
            ,



            getTables: async function() {
                console.log("In getTables")

                if (this.design_mode) {
                    var result = await callFunction(
                                        {
                                            driver_name: "postgres_server",
                                            method_name: "postgres_sql"  }
                                            ,{
                                                user:            this.args.user,
                                                password:        this.args.password,
                                                database:        this.args.database,
                                                host:            this.args.host,
                                                port:            this.args.port,
                                                get_tables:      true
                                             })


                   //alert("executeSql: " + JSON.stringify(result,null,2))
                   console.log(JSON.stringify(result,null,2))
                   if (result.value) {
                       this.tables = []
                       //alert(JSON.stringify(result.value.value,null,2))
                       for (var i=0;i<result.value.value.length;i++) {
                           this.tables.push(result.value.value[i].name)

                       }
                   }


                }
            }
            ,











            getColumns: async function() {
                console.log("In getColumns")

                if (this.design_mode) {
                    var result = await callFunction(
                                        {
                                            driver_name: "postgres_server",
                                            method_name: "postgres_sql"  }
                                            ,{
                                                user:            this.args.user,
                                                password:        this.args.password,
                                                database:        this.args.database,
                                                host:            this.args.host,
                                                port:            this.args.port,
                                                get_columns:      true,
                                                table:           this.args.design_mode_table
                                             })


                   //alert("executeSql: " + JSON.stringify(result,null,2))
                   console.log(JSON.stringify(result,null,2))
                   if (result.value) {
                       this.columns = []
                       //alert(JSON.stringify(result.value.value,null,2))
                       for (var i=0;i<result.value.value.length;i++) {
                           this.columns.push(result.value.value[i].name)

                       }
                   }


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
                                                port:            this.args.port,
                                                limit:           this.args.limit
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
