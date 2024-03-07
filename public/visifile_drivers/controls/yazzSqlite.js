function(args) {
/*
is_app(true)
component_type("VB")
hash_algorithm("SHA256")
display_name("yazz db")
description("This will return the yazz sqlite control")
base_component_id("yazz_sqlite_client_component")
load_once_from_file(true)
visibility("PRIVATE")
read_only(true)
properties(
    [
        {
            id:         "sqlite_file_path",
            name:       "Sqlite file path",
            //type:     "File",
            type:       "String",
            default:    null
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
            id:     "error",
            name:   "Error",
            type:   "String",
            default: ""
        }
        ,
        {
            id:     "info",
            name:   "Info",
            type:   "String",
            default: ""
        }
        ,
        {
            id:     "design_time_text",
            name:   "Design Time Text",
            type:   "String",
            help:       `<div>Help text for
                            <b>text</b> property
                         </div>`
        }

        ,
        {
            id:     "result",
            name:   "result",
            type:   "Array",
            default:    [],
            types: {table_data: true}
        }
        ,
        {
            id:     "background_color",
            name:   "Background color",
            type:   "String"
        }
        ,
        {
            id:         "runQuery",
            snippet:    `runQuery()`,
            name:       "runQuery",
            type:       "Action",
            help:       `<div>Help text for
                            <b>runQuery</b> function
                            <div>The SQL is store in the "sql" property</div>
                         </div>`
        }
        ,

        {
            id:         "getSchema",
            pre_snippet: `await `,
            snippet:    `getSchema()`,
            name:       "getSchema",
            type:       "Action",
            help:       `<div>Help text for
                            <b>getSchema</b> function
                         </div>`
        }
        ,

        {
            id:     "getTables",
            name:   "getTables",
            type:   "Action"
        }
        ,

        {
            id:     "getColumns",
            name:   "getColumns",
            type:   "Action"
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
            id:         "connect",
            pre_snippet: `await `,
            snippet:    `connect()`,
            name:       "connect",
            type:       "Action",
            help:       `<div>Help text for
                            <b>connect</b> function
                         </div>`
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
            id:         "show_driver_ui",
            name:       "Show Driver UI?",
            type:       "Boolean",
            default:    true,
            hidden:     true
        }
        ,
        {
            id:         "show_connected_ui",
            name:       "Show Connected UI?",
            type:       "Boolean",
            default:    true,
            hidden:     true
        }
        ,
        {
            id:         "standalone_ui",
            name:       "Standalone UI?",
            type:       "Boolean",
            default:    true,
            hidden:     true
        }


    ]
)//properties
logo_url("/driver_icons/sqlite.jpg")
*/

    Yazz.component({
        props:      [  "sql"  ,  "meta",  "args",  "name",  "refresh",  "design_mode"  ,  "properties_and_actions"  ],
        template:   ` 
<div    v-bind:style='"white-space:normal;height:100%;width:100%; border: 0px;" +
        "background-color: "+    properties_and_actions["background_color"]  +  ";"'>
        
    <div  >
        <div v-if="design_mode">
            <div  v-if='properties_and_actions.show_driver_ui && design_mode'>    
                <span v-if="!properties_and_actions.sqlite_file_path">Internal Yazz DB</div>
                <span v-if="properties_and_actions.sqlite_file_path">From file: {{properties_and_actions.sqlite_file_path}}</div>           
            </div>
            
            </br/>
            <div  v-if='properties_and_actions.show_connected_ui && design_mode'>
                {{tables.length}} tables
            </div>
            <div  v-if='properties_and_actions.standalone_ui && design_mode'>
                    <button     class="btn btn-primary"
                                style="margin-top: 5px;"
                                v-on:click="connect()">
                          Connect
                    </button>
                    <div style="color:red;">{{properties_and_actions.error}}</div>
                    <div style="color:green;">{{properties_and_actions.info}}</div>

            </div>
        </div>
        <div v-else>
            Sqlite:
            SQLITE LIVE
            <br/>
            Tables: 
            {{tables}}
        </div>
    </div>    
</div>`,
        data:       function(  ) {
            return {
                design_time_text: "",
                tables:             [ ],
                rowReturned:        [ ]
            }
        },
        watch:      {
          // This would be called anytime the value of the input changes
          refresh(newValue, oldValue) {
              if (isValidObject(this.args)) {
                  this.design_time_text = this.args.design_time_text
              }
          }
        },
        mounted:    async function(  ) {
            let mm = this
            await registerComponent(this)
            await mm.getTables()
        },
        methods:    {
            getTables:  async function  (  ) {
                let mm = this
                mm.rowReturned = await mm.internalRunQuery("SELECT name FROM sqlite_master WHERE type='table';")
                mm.result = mm.rowReturned
                mm.tables = []
                for (let row of mm.rowReturned) {
                    mm.tables.push(row.name)
                }
                let tables = [ ]
                for (let tableName of mm.tables) {
                    tables.push({name: tableName})
                }
                return tables
            },
            connect:    async function  (  ) {
                let mm = this
                mm.properties_and_actions.error = ""
                mm.properties_and_actions.info = ""

                // if a Sqlite file is specified then ...
                if (mm.properties_and_actions.sqlite_file_path) {
                    let result = await querySqlite(
                        {
                            path:            mm.properties_and_actions.sqlite_file_path,
                            connect:         true
                        })
                    if (result.error && (result.error.length > 0)) {
                        mm.properties_and_actions.error = result.error
                        return false
                    }
                    mm.properties_and_actions.info = "Connected"
                    await mm.getTables()
                    return true


                // otherwise use the internal Sqlite database
                } else {
                    mm.properties_and_actions.info = "Connected"
                    await mm.getTables()
                    return true
                }
            },
            getColumns: async function  (  ) {
                let mm = this

                if (this.design_mode) {
                    let result = null
                    if (mm.properties_and_actions.sqlite_file_path) {
                        let retValCols = await querySqlite(
                            {
                                path:            mm.properties_and_actions.sqlite_file_path,
                                get_columns:     true,
                                table:           mm.args.design_mode_table
                            })
                        if (retValCols) {
                            result = retValCols.value
                        }
                    } else {
                        debugger
                        result = await mm.sql( `PRAGMA table_info(  ${mm.args.design_mode_table}  )` )
                    }


                   if (result) {
                       this.args.columns = []
                       for (let i=0;i<result.length;i++) {
                           this.args.columns.push(result[i].name)
                       }
                   }

                   return mm.args.columns
                }
            },
            getSchema:  async function  (  ) {
                let mm = this
                return null
            },
            runQuery:   async function  (  ) {
                let mm = this
                mm.rowReturned = await mm.internalRunQuery(mm.properties_and_actions.sql)
                mm.args.result = mm.rowReturned
                mm.changedFn()
                return mm.args.result
            },
            internalRunQuery:   async function  (  sql  ,  sqlArgs  ) {
                let mm = this
                if (mm.properties_and_actions.sqlite_file_path) {
                    let result = await querySqlite(
                        {
                            sql:             sql,
                            path:            this.properties_and_actions.sqlite_file_path
                        })


                    //alert("runQuery: " + JSON.stringify(result,null,2))
                    console.log(JSON.stringify(result,null,2))
                    if (result) {
                        this.args.result = result.value

                        return this.args.result
                    }


                } else {
                    this.args.result = await mm.sql(  sql  )
                    return this.args.result
                }
            },
            changedFn:  function        (  ) {
                let mm = this
                if (isValidObject(this.args)) {
                    //this.args.text = this.text
                }
            }
        }
    })
}
