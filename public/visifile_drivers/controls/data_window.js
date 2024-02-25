function(args) {
/*
is_app(true)
component_type("VB")
hash_algorithm("SHA256")
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
            password: true,
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
            hidden: true,
            default:    []
        }
        ,

        {
            id:      "data",
            name:    "data",
            type:    "Array",
            hidden:  true,
            default:  [],
            types: {table_data: true}
        }
        ,


        {
            id:     "dataWindowColumnsMax",
            name:   "dataWindowColumnsMax",
            type:   "Number",
            hidden: true,
            default:    0
        }
        ,
        {
            id:     "selected_data_window_column_index",
            name:   "selected_data_window_column_index",
            type:   "Number",
            hidden: true,
            default:    -1
        }
        ,
        {
            id:     "selected_data_window_column",
            name:   "selected_data_window_column",
            type:   "String",
            hidden: true,
            default:    ""
        }
        ,
        {
            id:     "layout",
            name:   "Layout",
            type:   "",
            hidden: false,
            type:       "Select",
            default:    "fitColumns",
            values:     [
                            {display: "Fit Columns",    value: "fitColumns"},
                            {display: "Fit Data",       value: "fitData"},
                            {display: "Fit Data Fill",  value: "fitDataFill"}
                        ]
        }

        ,
        {
            id:     "allow_col_resize",
            name:   "allow_col_resize",
            type:   "Boolean",
            hidden: true,
            default:    false
        }
        ,
        {
            id:     "allow_col_move",
            name:   "allow_col_move",
            type:   "Boolean",
            hidden: true,
            default:    false
        }
        ,
        {
            id:     "allow_row_resize",
            name:   "allow_row_resize",
            type:   "Boolean",
            hidden: true,
            default:    false
        }





        ,
        {
            id:     "columns",
            name:   "columns",
            type:   "Array",
            hidden: true,
            default:    []
        }



        ,
        {
            id:     "where_clause",
            name:   "where_clause",
            type:   "String",
            hidden: true,
            default:    ""
        }

        ,
        {
            id:     "selected_column",
            name:   "selected_column",
            type:   "String",
            hidden: true,
            default:    ""
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

    Yazz.component({
        props:      ["meta","name","args","refresh","design_mode"],
        template:   `<div   v-bind:style='"width:100%;overflow-y:auto;height:100%;color:black;"
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

                <li class="nav-item" style="width:20%;">
                    <a    v-bind:class='"nav-link " + ((designDetailTab == "options")?"active":"")'
                          v-on:click="designDetailTab = 'options';"
                          href="#">Options</a>
                </li>
            </ul>

            <div v-if='designDetailTab == "connection"'  >
                Connection

                <select  @change='alert($event)'>
                      <option   v-for='propVal in ["postgres","mysql"]'
                                v-bind:value="propVal"
                                v-bind:selected='(propVal == "postgres")'>

                            {{propVal}}

                      </option>
                </select>


            </div>




            <div v-if='designDetailTab == "schema"'  >
               Database tables for schema &#34;{{args.database}}&#34;
               <div style="height:70%;width:100%; overflow-y: scroll;border: 1px solid lightgray;">

                   <div   v-for='table in tables'
                          v-on:click="args.sql = 'select * from ' + table; args.design_mode_table = table;getColumns();args.dataWindowColumns=[];"
                          v-bind:style='"padding: 5px; " + ((args.design_mode_table == table)?"background-color:gray;color:white;":"background-color:white;color:gray;") '>

                         {{table}}

                   </div>
               </div>
            </div>



            <div v-if='designDetailTab == "columns"' >
                Columns for table &#34;{{args.design_mode_table}}&#34;
                <div>


                    <div style="height:70%;width:30%; overflow-y: scroll;display:inline-block;vertical-align:top; border: 2px solid gray;">


                        <div   v-for='column in args.columns'
                               v-on:click="args.selected_column = column;"
                               v-bind:style='"padding: 5px; " + ((args.selected_column == column)?"background-color:gray;color:white;":"background-color:white;color:gray;") '>

                              {{column}}

                        </div>
                    </div>

                    <div style="height:70%;width:15%; overflow-y: none;display:inline-block;vertical-align:top;">
                        <button    class="btn btn-primary"
                                :disabled="(args.selected_column && args.selected_column.length > 0)?false:true"
                                v-on:click="var newId = args.dataWindowColumnsMax++;args.dataWindowColumns.push({id:    newId, value: args.selected_column, name: args.selected_column});setSql();args.selected_data_window_column_index = newId;args.selected_data_window_column = args.dataWindowColumns[args.dataWindowColumns.length - 1];">

                              Add >>

                        </button>
                        <button    class="btn btn-primary"
                                style="margin-top:20px;"
                                :disabled="(args.selected_data_window_column_index > -1)?false:true"
                                v-on:click="args.dataWindowColumns.splice(args.selected_data_window_column_index,1);setSql(); args.selected_data_window_column_index = -1;args.selected_data_window_column='';">

                              << Remove

                        </button>
                    </div>






                    <div style="height:30%;width:30%; overflow-y: none;display:inline-block;vertical-align:top; margin-left: 20px; border: 2px solid gray;">
                        <div style="height:100%;width:100%; overflow-y: scroll;vertical-align:top;">


                            <div    v-for='(dwcolumn,index) in args.dataWindowColumns'
                                    v-on:click="args.selected_data_window_column = dwcolumn;args.selected_data_window_column_index = index;"
                                    v-bind:style='"padding: 5px; " + ((args.selected_data_window_column.id == dwcolumn.id)?"background-color:gray;color:white;":"background-color:white;color:gray;") '>

                                  {{dwcolumn.value}}

                            </div>
                        </div>

                        <div    class="btn-group">

                            <button     class="btn btn-primary"
                                        :disabled="(args.selected_data_window_column_index > 0)?false:true"
                                        style="margin-top:20px; margin-left: 0px;"
                                        v-on:click="array_move(args.dataWindowColumns,args.selected_data_window_column_index,args.selected_data_window_column_index-1);args.selected_data_window_column_index --;">

                                  Move Up

                            </button>

                            <button class="btn btn-primary"
                                    :disabled="((args.selected_data_window_column_index > -1) && (args.selected_data_window_column_index < (args.dataWindowColumns.length - 1)))?false:true"
                                    style="margin-top:20px; margin-left: 20px;"
                                    v-on:click="array_move(args.dataWindowColumns,args.selected_data_window_column_index,args.selected_data_window_column_index + 1);args.selected_data_window_column_index ++;">

                                  Move Down

                            </button>
                        </div>



                        <div   style=" border: 1px solid lightgray;height:90%;width:100%; display:inline-block;margin-top:20px;overflow-y:scroll;">

                            <div    v-if="args.selected_data_window_column"
                                    style="height:100%;width:100%; overflow-y: none; padding: 10px;">

                                <div class="form-group">


                                  <label for="col_input_name">Title</label>
                                  <input  type=text
                                          class="form-control"
                                          style="margin-bottom: 30px;"
                                          id=col_input_name
                                          name="col_input_name"
                                          required
                                          v-bind:value='args.selected_data_window_column.name'
                                          v-on:change="var qwe = document.getElementById('col_input_name').value;args.dataWindowColumns[args.selected_data_window_column_index].name=qwe;args.selected_data_window_column.name = qwe;"
                                          >
                                  </input>




                                  <label for="col_input_value">DB Col ID</label>
                                  <input  type=text
                                          class="form-control"
                                          id=col_input_value
                                          style="margin-bottom: 30px;"
                                          name="col_input_value"
                                          required
                                          v-bind:value='args.selected_data_window_column.value'

                                          v-on:change="var qwe = document.getElementById('col_input_value').value;args.dataWindowColumns[args.selected_data_window_column_index].value=qwe;args.selected_data_window_column.value = qwe;"
                                          >
                                  </input>



                                  <div class="valid-feedback">Valid.</div>
                                  <div class="invalid-feedback">Please fill out this field.</div>


                                    <label for="col_input_width">Col Width px</label>
                                    <input  type=text
                                            style="margin-bottom: 30px;"
                                            class="form-control"
                                            id=col_input_width
                                            name="col_input_width"
                                            v-bind:value='args.selected_data_window_column.width?args.selected_data_window_column.width:""'

                                            v-on:change="var qwe = document.getElementById('col_input_width').value;args.selected_data_window_column.width = qwe;args.dataWindowColumns[args.selected_data_window_column_index].width=qwe;"
                                            >
                                    </input>
                              </div>




                            </div>


                            <div   v-if="!args.selected_data_window_column"  style="height:100%;width:100%; overflow-y: none;margin-top:0px;border: 1px solid lightgray;">

                            </div>
                        </div>


                    </div>






                </div>
            </div>





            <div v-if='designDetailTab == "where"'  >

                <label for="col_input_width">Where Clause</label>
                <input  type=text
                        style="margin-bottom: 30px;"
                        class="form-control"
                        id=where_clause
                        name="where_clause"
                        v-bind:value='(args.where_clause && (args.where_clause.length > 0))?args.where_clause:""'

                        v-on:change="args.where_clause = document.getElementById('where_clause').value;setSql()"
                        >
                </input>
            </div>


            <div v-if='designDetailTab == "options"'  >
                Options tab

                <form>
                  <div class="form-group">


                      <div class="form-check">
                        <input  type="checkbox" class="form-check-input" id="allow_col_resize"
                                :checked='args.allow_col_resize' v-model='args.allow_col_resize'>
                        <label class="form-check-label" for="allow_col_resize">Allow col resize</label>
                      </div>


                      <div class="form-check">
                        <input  type="checkbox" class="form-check-input" id="allow_col_move"
                                :checked='args.allow_col_move' v-model='args.allow_col_move'>
                        <label class="form-check-label" for="allow_col_move">Allow col move</label>
                      </div>


                      <div class="form-check">
                        <input  type="checkbox" class="form-check-input" id="allow_row_resize"
                                :checked='args.allow_row_resize' v-model='args.allow_row_resize'>
                        <label class="form-check-label" for="allow_row_resize">Allow row resize</label>
                      </div>



                </form>
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





</div>`,
        data:       function(  ) {
            return
            {
                    selected_index:        null,
                    columnDefinitions:     [ ],
                    tables:                [ ],
                    table:                 null,
                    designDetailTab:       "connection"
            }
        },
        watch:      {
        // This would be called anytime the value of the input changes
            refresh: function(newValue, oldValue) {
                //console.log("refresh: " + this.args.text)
                if (isValidObject(this.args)) {
                    this.getTables()
                    //alert(JSON.stringify(this.tables,null,2))
                }
            }
        },
        mounted:    async function(  ) {
            await registerComponent(this)

            if (isValidObject(this.args)) {
            }

            if (this.design_mode == false) {
                this.table = new Tabulator(this.$refs.exampletable,
                    {
                    width:                      this.args.width,
                    height:                     this.args.height,
                    tables:                     [],
                    data:                       this.args.data,
                	layout:                     "fitColumns",
                	responsiveLayout:           "hide",
                	tooltips:                   true,
                	addRowPos:                  "top",
                	history:                    true,
                	pagination:                 "local",
                	paginationSize:             7,
                	movableColumns:             true,
                    resizableColumns:           this.args.allow_col_resize,
                	resizableRows:              this.args.allow_row_resize,
                    movableColumns:             this.args.allow_col_move,
                    layout:                     this.args.layout,
                    tableNames:                 [],
                	initialSort:                [
                                            	],
                	columns:                    this.columnDefinitions
                });
            }
            if (this.design_mode) {
                await this.getTables()
            }

            if (!this.design_mode) {
                var results = await this.executeSql()
                //alert(JSON.stringify(results,null,2))
                await this.setData(results)
            }
        },
        methods:    {
            setSql:             function      (  ) {
                var colSql = "*"
                if (this.args.dataWindowColumns.length > 0) {
                    colSql = ""
                    for (var coli=0; coli < this.args.dataWindowColumns.length; coli ++) {
                        colSql += this.args.dataWindowColumns[coli].value
                        if (coli< (this.args.dataWindowColumns.length - 1)) {
                            colSql += ","
                        }
                    }
                }
                this.args.sql = "select " + colSql + " from " + this.args.design_mode_table

                if (this.args.where_clause && (this.args.where_clause.length > 0)) {
                    this.args.sql += " where " + this.args.where_clause
                }


            },
            changedFn:          function      (  ) {
                if (isValidObject(this.args)) {
                }
            },
            resetColumns:       async function(  data  ) {
                this.table.setColumns([])
            },
            addColumn:          async function(  colData  ) {
                this.table.addColumn(colData, true, "name");
            },
            runEventHandler:    function      (  ) {
                this.$emit('send', {
                                                type:               "subcomponent_event",
                                                control_name:        this.args.name,
                                                sub_type:           "changed",
                                                code:                this.args.changed_event
                                            })
            },
            setData:            async function(  data  ) {
                this.args.data = data
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
                        var colDefn = {title:this.args.dataWindowColumns[coli].name,
                                        field:this.args.dataWindowColumns[coli].value
                                    }
                        if (this.args.dataWindowColumns[coli].width) {
                            colDefn.width = parseInt(this.args.dataWindowColumns[coli].width)
                        }

                        this.addColumn(colDefn)
                    }
                }

            },
            array_move:         function      (  arr  ,  old_index  ,  new_index  ) {
                if (new_index >= arr.length) {
                    var k = new_index - arr.length + 1;
                    while (k--) {
                        arr.push(undefined);
                    }
                }
                arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
                return arr; // for testing
            },
            getTables:          async function(  ) {
                console.log("In getTables")

                if (this.design_mode) {

                    var result = await callComponent(
                                        {
                                            base_component_id: "postgres_server"
                                        }
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
                   if (result) {
                       this.tables = []
                       //alert(JSON.stringify(result,null,2))
                       for (var i=0;i<result.length;i++) {
                           this.tables.push(result[i].name)

                       }
                   }


                }
            },
            getColumns:         async function(  ) {
                console.log("In getColumns")

                if (this.design_mode) {
                    var result = await callComponent(
                                        {
                                            base_component_id: "postgres_server"
                                        }
                                        ,
                                        {
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
                   if (result) {
                       this.args.columns = []
                       //alert(JSON.stringify(result,null,2))
                       for (var i=0;i<result.length;i++) {
                           this.args.columns.push(result[i].name)

                       }
                   }


                }
            },
            executeSql:         async function(  ) {
                if (!this.design_mode) {
                    var result = await callComponent(
                                        {
                                            base_component_id: "postgres_server"
                                        }
                                            ,{
                                                sql:             this.args.sql,
                                                user:            this.args.user,
                                                password:        this.args.password,
                                                database:        this.args.database,
                                                host:            this.args.host,
                                                port:            this.args.port,
                                                limit:           this.args.limit
                                             })


                   //debugger
                   //alert("executeSql: " + JSON.stringify(result,null,2))
                   console.log(JSON.stringify(result,null,2))
                   if (result) {
                        this.args.result = result

                        return result
                   }


               }
                this.args.result = []
                //this.changedFn()
                return {}
            }
        }
    })
}
