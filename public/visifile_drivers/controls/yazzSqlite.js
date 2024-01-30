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
            id:     "sqlite_file_path",
            name:   "Sqlite file path",
            //type:   "File",
            type:   "String"
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
            default:    []
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
            pre_snippet: `await `,
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


    ]
)//properties
logo_url("/driver_icons/sqlite.jpg")
*/

    Yazz.component({
        props: [  "sql_query"  ,  "meta",  "args",  "properties",  "name",  "refresh",  "design_mode"  ]
        ,
        template: `<div v-bind:style='"white-space:normal;height:100%;width:100%; border: 0px;" +
                                    "background-color: "+    args["background_color"]  +  ";"'>
                                    <div v-if="design_mode">
                                    sqlite:
                                                {{design_time_text}}
                                                <br/>
                                    SQL: 
                                    meta.sql: 
                                    {{meta.sql}}

                                    </div>
                                    <div v-else>
                                    sqlite:
                                                SQLITE LIVE
                                                
                                                <br/>
                                    SQL: 
                                    {{sql}}

                                    </div>
                 </div>`
        ,
        data: function() {
            return {
                design_time_text: "",
                tables:             [ ]
            }
        }
        ,
        watch: {
          // This would be called anytime the value of the input changes
          refresh(newValue, oldValue) {
              if (isValidObject(this.args)) {
                  this.design_time_text = this.args.design_time_text
              }
          }
        },
        mounted: async function() {
            let mm = this
            await registerComponent(this)
            debugger
            await mm.sql_query()

            if (this.design_mode) {
                if (!this.properties.sqlite_file_path) {
                    //debugger
                    this.properties.sqlite_file_path = $HOME + "/Yazz/node.visi"
                    await this.connect()
                }
            } else {

            }
        }
        ,
        methods: {



            getTables: async function() {
              console.log("In getTables")

              if (this.design_mode) {

                  var result = await callComponent(
                                      {
                                          base_component_id: "sqlite_server"
                                      }
                                          ,{
                                              get_tables:      true,
                                              path:            this.properties.sqlite_file_path
                                           })


                 //alert("runQuery: " + JSON.stringify(result,null,2))
                 console.log(JSON.stringify(result,null,2))
                 if (result) {
                     this.tables = []
                     //alert(JSON.stringify(result,null,2))
                     for (var i=0;i<result.length;i++) {
                         this.tables.push(result[i].name)

                     }
                 }
                 return result


              }


                //debugger
            }
            ,
            connect: async function() {
                //debugger
                try {
                    var result = await callComponent(
                                        {
                                            base_component_id: "sqlite_server"
                                        }
                                            ,{
                                                connect:         true,
                                                path:            this.properties.sqlite_file_path
                                             })


                   //alert("runQuery: " + JSON.stringify(result,null,2))
                   console.log(JSON.stringify(result,null,2))
                   if (result.error) {
                       return false
                   } else {
                       return true
                   }
                } catch (catchErr) {

                }
                return false
            }
            ,






            getColumns: async function() {
                console.log("In getColumns")
                //debugger

                if (this.design_mode) {
                    var result = await callComponent(
                                        {
                                            base_component_id: "sqlite_server"
                                        }
                                            ,{
                                                path:            this.properties.sqlite_file_path,
                                                get_columns:      true,
                                                table:           this.args.design_mode_table
                                             })



                   //alert("runQuery: " + JSON.stringify(result,null,2))
                   console.log(JSON.stringify(result,null,2))
                   if (result) {
                       this.args.columns = []
                       //alert(JSON.stringify(result,null,2))
                       for (var i=0;i<result.length;i++) {
                           this.args.columns.push(result[i].name)

                       }
                   }

                   return this.args.columns
                }
            }
            ,










            getSchema: async function() {
                return null
            }
            ,






            
            runQuery: async function() {
                if (!this.design_mode) {
                    var result = await callComponent(
                                        {
                                            base_component_id: "sqlite_server"
                                        }
                                            ,{
                                                sql:             this.args.sql,
                                                path:            this.properties.sqlite_file_path
                                             })


                   //alert("runQuery: " + JSON.stringify(result,null,2))
                   console.log(JSON.stringify(result,null,2))
                   if (result) {
                        this.args.result = result.result

                        return result
                   }


               }
                this.args.result = []
                this.changedFn()
                return {}
            }
            ,
            changedFn: function() {
                if (isValidObject(this.args)) {
                    //this.args.text = this.text
                }
            }

        }
    })
}
