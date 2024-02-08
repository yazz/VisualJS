function(  args  ) {
/*
is_app(true)
component_type("VB")
hash_algorithm("SHA256")
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
            id:     "setText",
            name:   "setText",
            type:   "Action"
        }
        ,
        {
            id:     "addColumn",
            name:   "addColumn",
            type:   "Action"
        }
        ,

        {
            id:         "data",
            name:       "Data",
            type:       "Array",
            default:    [],
            editor:     "detail_editor",
            accept_types: {table_data: true}
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
            id:         "height",
            name:       "Height",
            default:    160,
            type:       "Number"
        }
    ]
)//properties
logo_url("/driver_icons/table.png")
*/

    Yazz.component({
        props:      [  "meta"  ,  "form"  ,  "name"  ,  "args"  ,  "refresh"  ,  "design_mode"  ,  "properties"  ],
        template:   `
<div    v-bind:style='"width:100%;overflow-y:auto;height:100%"
        v-bind:refresh='refresh'>


    <div    v-bind:style='"height:100%;width:100%; border: 0px;color:black;"'
            v-if='design_mode == "detail_editor"'>

        Details for table grid
    </div>


     <div    v-else
             ref="exampletable"></div>

</div>`,
        data:       function() {
                        return {
                            value:              null,
                            selected_index:     null,
                            new_value:          "",
                            new_text:           "",
                            columnDefinitions:  [  ],
                            data:               [  ],
                            table:              null
                        }
        },
        watch:      {
            refresh: function(newValue, oldValue) {
                // This would be called anytime the value of the input changes

                //console.log("refresh: " + this.args.text)
                if (isValidObject(this.args)) {
                    this.value = this.args.value

                    let ttt = jsondiffpatch2.diff(this.data,this.args.data)
                    if (ttt) {
                        this.data = this.args.data
                        this.setData(this.data)
                    }
                }
            }
        },
        mounted:    async function() {
            await registerComponent(this)
            await useTabulatorJs()

             if (isValidObject(this.args)) {
                 this.data = this.args.data
                 if (isValidObject(this.args.value)) {
                    this.value = this.args.value
                 }
             }

         if (this.args.design_mode != "detail_editor") {
             this.table = new Tabulator(this.$refs.exampletable, {
                    width:                      this.args.width,
                    height:                     this.args.height,
                	data:                       this.data,
                	layout:                     "fitColumns",
                	responsiveLayout:           "hide",
                	tooltips:                   true,
                	addRowPos:                  "top",
                	history:                    true,
                	pagination:                 "local",
                	paginationSize:             7,
                	movableColumns:             true,
                	resizableRows:              true,
                	initialSort:                [  ],
                	columns:                    this.columnDefinitions
                });
            }
        },
        methods:    {
            changedFn:          function        (  ) {
                if (isValidObject(this.args)) {
                    this.args.value = this.value
                    this.args.data = this.data
                }
            },
            runEventHandler:    function        (  ) {
                this.$emit('send', {
                                                type:               "subcomponent_event",
                                                control_name:        this.args.name,
                                                sub_type:           "changed",
                                                code:                this.args.changed_event
                                            })
            },
            setText:            async function  (  newtext  ) {

            },
            resetColumns:       async function  (  data  ) {
                this.table.setColumns([])
            },
            setData:            async function  (  data  ) {
                let mm = this
                if (mm.args) {
                    mm.args.data = data
                    mm.table.setData(data)

                    let keysOfData = new Object()
                    if ((mm.columnDefinitions == null)  || (mm.columnDefinitions.length == 0)) {
                        for (let rr = 0 ; rr < data.length; rr ++) {
                            let dfg = Object.keys(data[rr])
                            for (let qq = 0 ; qq < dfg.length; qq ++) {
                                keysOfData[dfg[qq]] = true
                            }
                        }
                    }

                    let dfg2 = Object.keys(keysOfData)
                    for (let qq2 = 0 ; qq2 < dfg2.length; qq2 ++) {
                        mm.addColumn({title:dfg2[qq2], field:dfg2[qq2]})
                    }
                }
            },
            addColumn:          async function  (  colData  ) {
                let col = this.table.getColumn(colData.title)
                if (!col) {
                    this.table.addColumn(colData, true, "name");
                }
            }
      }
    })
}
