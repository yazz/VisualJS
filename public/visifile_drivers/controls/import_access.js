function(args) {
/*
is_app(true)
component_type("VB")
display_name("msaccess client control")
description("This will return the msaccess control")
base_component_id("import_access_control")
load_once_from_file(true)
visibility("PRIVATE")
read_only(true)
properties(
    [
        {
            id:     "access_file_path",
            name:   "msaccess file path",
            //type:   "File",
            type:   "String"
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
            id:     "getTables",
            name:   "getTables",
            type:   "Action"
        }
        ,
        {
            id:     "connect",
            name:   "connect",
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

    ]
)//properties
logo_url("/driver_icons/import_access.png")
*/

    Vue.component("import_access_control",{
        props: [  "meta",  "args",  "properties",  "name",  "refresh",  "design_mode"  ]
        ,
        template: `<div v-bind:style='"white-space:normal;height:100%;width:100%; border: 0px;" '>
                                    <div v-if="design_mode">
                                    msaccess:
                                                {{design_time_text}}
                                    </div>
                                    <div v-else>
                                    msaccess:
                                                msaccess LIVE
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
            registerComponent(this)

            if (this.design_mode) {
            } else {

            }
        }
        ,
        methods: {



            getTables: async function() {
              console.log("In getTables")

              if (this.design_mode) {

                  var result = await callFunction(
                                      {
                                          driver_name: "access_server",
                                          method_name: "access_sql"  }
                                          ,{
                                              get_tables:      true,
                                              path:            this.properties.access_file_path
                                           })
                 //debugger

                 //alert("runQuery: " + JSON.stringify(result,null,2))
                 console.log(JSON.stringify(result,null,2))
                 let retTables = []
                 if (result) {
                     this.tables = []
                     //alert(JSON.stringify(result,null,2))
                     for (var i=0;i<result.length;i++) {
                         this.tables.push(result[i])
                         retTables.push({name: result[i]})
                     }
                 }
                 return retTables


              }


                //debugger
            }
            ,






            getColumns: async function() {
                console.log("In getColumns")

                if (this.design_mode) {
                    var result = await callFunction(
                                        {
                                            driver_name: "access_server",
                                            method_name: "access_sql"  }
                                            ,{
                                                path:            this.properties.access_file_path,
                                                get_columns:     true,
                                                table:           this.args.design_mode_table
                                             })



                   //alert("runQuery: " + JSON.stringify(result,null,2))
                   console.log(JSON.stringify(result,null,2))
                   let retTables = []
                   if (result) {
                       this.args.columns = []
                       //alert(JSON.stringify(result,null,2))
                       for (var i=0;i<result.length;i++) {
                           this.args.columns.push(result[i])
                           retTables.push(result[i])

                       }
                   }

                   return retTables
                }
            }
            ,



            connect: async function() {
                try {
                    var result = await callFunction(
                                        {
                                            driver_name: "access_server",
                                            method_name: "access_sql"  }
                                            ,{
                                                connect:         true,
                                                path:            this.properties.access_file_path
                                             })
                    if (result.err) {
                        return false
                    } else {
                        return true
                    }
                } catch (catchErr) {
                    return false
                }
            }
            ,






            runQuery: async function() {
                debugger
                if (!this.design_mode) {
                    var result = await callFunction(
                                        {
                                            driver_name: "access_server",
                                            method_name: "access_sql"  }
                                            ,{
                                                get_data:        true,
                                                table:           this.properties.select_table,
                                                path:            this.properties.access_file_path
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
