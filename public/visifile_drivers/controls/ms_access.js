function(args) {
/*
/Users/fquraish/yazz/a.accdb
is_app(true)
component_type("VB")
hash_algorithm("SHA256")
display_name("msaccess client control")
description("This will return the msaccess control")
base_component_id("ms_access_control")
load_once_from_file(true)
visibility("PRIVATE")
read_only(true)
properties(
    [
        {
            id:     "access_file_path",
            name:   "msaccess file path",
            design_time_only_events: true,
            file_exts: ["accdb"],
            type:   "FilePath"
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
        ,
        {
            id:     "on_property_changed",
            name:   "on_property_changed",
            type:   "Event",
            help:       `<div>Help text for
                            <b>click_event</b> event
                         </div>`,
            default: `
me.addParent();
`
        }
        ,
        {
            id:         "addParent",
            name:       "addParent()",
            type:       "Action",
            pre_snippet:    `await `,
            snippet:    `addParent()`
        }
        ,
        {
            id:         "isAccessAvailable",
            name:       "Is Access Available?",
            type:       "Select",
            default:    "False",
            values:     [
                            {display: "True",   value: "True"},
                            {display: "False",  value: "False"}
                        ],
            design_time_only_events: true
        }

    ]
)//properties
logo_url("/driver_icons/import_access.png")
*/

    Yazz.component({
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
            await registerComponent(this)

            if (this.design_mode) {
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
                                          base_component_id: "access_server"
                                          }
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
                    var result = await callComponent(
                                        {
                                            base_component_id: "access_server"
                                        }
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
                let mm = this
                try {
                    var result = await callComponent(
                                        {
                                            base_component_id: "access_server"
                                        }
                                            ,{
                                                connect:         true,
                                                path:            this.properties.access_file_path
                                             })
                    if (result.err) {
                        mm.properties.isAccessAvailable = "False"
                        return false
                    } else {
                        mm.properties.isAccessAvailable = "True"
                        return true
                    }
                } catch (catchErr) {
                    mm.properties.isAccessAvailable = "False"
                    return false
                }
            }
            ,






            runQuery: async function() {
                if (!this.design_mode) {
                    var result = await callComponent(
                                        {
                                            base_component_id: "access_server"
                                        }
                                            ,{
                                                get_data:        true,
                                                table:           this.properties.select_table,
                                                path:            this.properties.access_file_path
                                             })


                   //alert("runQuery: " + JSON.stringify(result,null,2))
                   console.log(JSON.stringify(result,null,2))
                   if (result) {

                        //select_columns
                        this.args.result  = []
                        for (let rownum=0; rownum<result.length; rownum++) {
                            let origrow = result[rownum]
                            let outputRow = {}
                            //debugger
                            if (this.properties.select_columns && (this.properties.select_columns.length  >  0)) {
                                for (let i = 0; i < this.properties.select_columns.length; i++) {
                                    let thisColName = this.properties.select_columns[i].name
                                    outputRow[  thisColName  ] = origrow[  thisColName  ]
                                  }
                            } else {
                                outputRow = origrow
                            }
                                this.args.result.push(  outputRow  )
                        }

                        return this.args.result
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
            ,

            addParent: async function() {
                //debugger
                let mm = this
                //alert("called addParent")
                //debugger
                let newcontrol =  mm.meta.lookupComponentOnForm({
                    base_component_id:      "database_control"   ,
                    first_only: true
                })
                if (newcontrol == null) {
                    let parentName = mm.args.name + "_parent"
                    let parentComponent = await this.meta.getEditor().addControl(
                        {
                                  "leftX":              10,
                                  "topY":               10,
                                  "name":               parentName,
                                  "base_component_id":  "database_control"
                        })
                        //debugger
                    parentComponent.sourceComponentType = mm.properties.base_component_id
                    parentComponent.sourceControlName = mm.properties.name
                    mm.properties.parent_name = parentName
                    mm.properties.parent = parentName
                    mm.properties.parent_base_component_id = "database_control"
                    parentComponent.leftX = mm.properties.leftX
                    parentComponent.topY = mm.properties.topY
                    parentComponent.width = mm.properties.width
                    parentComponent.height = mm.properties.height
                    mm.properties.leftX  = 0
                    mm.properties.topY   = 0
                    mm.meta.getEditor().selectComponentByName(parentName)
                    mm.meta.getEditor().showComponentDetailedDesignUiByName(parentName)
                    setTimeout(function(){
                        parentComponent.connect()
                    },100)
                }
                //alert(JSON.stringify(newcontrol,null,2))
            }








        }
    })
}
