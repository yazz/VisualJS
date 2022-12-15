function(args) {
/*
/Users/fquraish/yazz/a.accdb
is_app(true)
component_type("VB")
display_name("ms_excel client control")
description("This will return the ms_excel control")
base_component_id("ms_excel_control")
load_once_from_file(true)
visibility("PRIVATE")
read_only(true)
properties(
    [
        {
            id:         "headersAsColNames",
            name:       "Headers as Col Names",
            type:       "Select",
            default:    "True",
            values:     [
                            {display: "True",   value: "True"},
                            {display: "False",  value: "False"}
                        ]
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
            id:     "excel_file_path",
            name:   "ms_excel file path",
            design_time_only_events: true,
            file_exts: ["xls","xlsx"],
            type:   "FilePath"
        }
        ,
        {
            id:     "design_time_text",
            name:   "Design Time Text",
            type:   "String",
            default: "Microsoft Excel control",
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
            id:     "getSheets",
            pre_snippet: `await `,
            name:   "getSheets()",
            snippet:    `getSheets()`,
            type:   "Action"
        }
        ,
        {
            id:     "getSheetDetails",
            name:   "getSheetDetails('SHEET_NAME')",
            type:   "Action"
        }
        ,
        {
            id:     "connect",
            pre_snippet: `await `,
            name:   "connect",
            type:   "Action"
        }
        ,
        {
            id:     "getWorkbook",
            pre_snippet: `await `,
            name:   "getWorkbook()",
            snippet:    `getWorkbook()`,
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
                if (property == "excel_file_path") {
                  await me.connect();
              }
`
        }
        ,
        {
            id:         "isExcelAvailable",
            name:       "Is Excel Available?",
            type:       "Select",
            default:    "False",
            values:     [
                            {display: "True",   value: "True"},
                            {display: "False",  value: "False"}
                        ]
                        ,
            design_time_only_events: true
        }
        ,

        {
            id:     "getSheet",
            name:   "getSheet",
            type:   "Action"
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
            id:     "sheet",
            name:   "Sheet",
            type:   "String"
        }
        ,

        {
            id:     "rowCount",
            name:   "Row Count",
            type:   "Number"
        }
        ,

        {
            id:     "colCount",
            name:   "Column Count",
            type:   "Number"
        }
    ]
)//properties
logo_url("/driver_icons/excel.png")
*/
    Vue.component("ms_excel_control",{
        props: [  "meta",  "args",  "properties",  "name",  "refresh",  "design_mode"  ]
        ,
        template: `<div v-bind:style='"white-space:normal;height:100%;width:100%; border: 0px;" '>
                                    <div v-if="design_mode  && (!(design_mode == 'detail_editor')) ">
                                                {{properties.design_time_text}}
                                    </div>

                                    <div v-bind:style='"height:100%;width:100%; border: 0px;color:black;padding: 10px;"'
                                         v-if='design_mode == "detail_editor"'
                                          >

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
                                                    <a    v-bind:class='"nav-link " + ((designDetailTab == "sheets")?"active":"")'
                                                          v-on:click="designDetailTab = 'sheets';"
                                                          href="#">Sheets</a>
                                                </li>

                                                <li class="nav-item" style="width:20%;">
                                                    <a    v-bind:class='"nav-link " + ((designDetailTab == "tabular_data")?"active":"")'
                                                          v-on:click="designDetailTab = 'tabular_data';"
                                                          href="#">Find table data</a>
                                                </li>

                                            </ul>

                                            <div v-bind:style='((designDetailTab == "connection")?"visibility:visible;":"visibility:hidden;display: none;")'
                                                 v-bind:refresh='refresh'>

                                                Connection

                                                <div   v-if='properties.isExcelAvailable == "True"'
                                                       style="background-color: green; color: white;padding:10px;">
                                                    Connected
                                                </div>

                                                <div   v-if='!(properties.isExcelAvailable == "True")'
                                                       style="background-color: red; color: white;padding:10px;">
                                                    Not Connected
                                                </div>
                                            </div>






                                            <div v-bind:style='((designDetailTab == "sheets")?"visibility:visible;":"visibility:hidden;display: none;")'
                                                 v-bind:refresh='refresh'>

                                                <div   v-for='thisSheetName in sheetNames'
                                                       v-on:click="sheetName = thisSheetName;selectSheet(sheetName)"
                                                       v-bind:style='"padding: 5px; " + ((sheetName == thisSheetName)?"background-color:gray;color:white;":"background-color:white;color:gray;") '>

                                                      {{thisSheetName}}

                                                </div>

                                            </div>






                                            <div v-bind:style='((designDetailTab == "tabular_data")?"visibility:visible;":"visibility:hidden;display: none;")'
                                                 v-bind:refresh='refresh'>

                                                <div>Sheet "{{sheetName}}" ({{properties.colCount}} cols, {{properties.rowCount}} rows)
                                                Total</div>


                                                <span v-if='rangeSelected'>{{getColRowId(startCellColIndex,startCellRowIndex)}} -&gt; </span>
                                                <span v-if='rangeSelected'>{{getColRowId(endCellColIndex,endCellRowIndex)}} - </span>


                                                <span v-if='rangeSelected'>({{ 1 + endCellColIndex - startCellColIndex  }} X </span>
                                                <span v-if='rangeSelected'>{{  1 + endCellRowIndex - startCellRowIndex }})</span>

                                                <span v-if='rangeSelected' style='margin-left: 100px;'>
                                                    Use headers as col names
                                                    <input  type="checkbox"
                                                            v-on:change='headersAsColNamesChanged(event)'
                                                            v-bind:checked='(args.headersAsColNames=="True")?"True":""'>
                                                    </input>
                                                </span>

                                                <table>
                                                    <thead>
                                                      <tr>
                                                        <th v-for='colHeaderIndex in Array.from(Array(properties.colCount).keys())'>
                                                            {{getColHeaderOneBased(colHeaderIndex)}}
                                                        </th>
                                                      </tr>
                                                    </thead>

                                                    <tbody>
                                                      <tr   v-for='rowIndex in Array.from(Array(30).keys())'
                                                            >
                                                          <th>{{rowIndex + 1}}</th>

                                                          <td   v-for='colIndex in Array.from(Array(properties.colCount).keys())'
                                                                  v-bind:style='"padding:5px;" + (cellInSelectedRange(colIndex,rowIndex)?"background-color: lightgray;":"background-color: white;")'
                                                                  v-on:click='clickCell(colIndex,rowIndex)'
                                                                >

                                                              {{getCellValue(colIndex,rowIndex)}}

                                                          </td>


                                                      </tr>
                                                    </tbody>
                                                </table>

                                            </div>


                                        </div>
                                    </div>



                 </div>`
        ,
        data: function() {
            return {
                sheetData:                 { },
                sheetDetails:              { },
                sheetNames:                [ ],
                sheetName:                  null,
                workbook:                   null,
                designDetailTab:           "connection",
                startCellColIndex:              null,
                startCellRowIndex:              null,
                endCellColIndex:                null,
                endCellRowIndex:                null,
                firstCellAlreadyClicked:          false,
                rangeSelected:          false
            }
        }
        ,
        watch: {
          // This would be called anytime the value of the input changes
          refresh(newValue, oldValue) {
              if (isValidObject(this.args)) {
                  //this.design_time_text = this.args.design_time_text
              }
          }
        },
        mounted: async function() {
            registerComponent(this)

              await this.connect()
              await this.getWorkbook()
              await this.getSheets()
        }
        ,
        methods: {



            getSheets: async function() {
              let mm = this
              console.log("In getSheets")

              let result=null

              result = mm.workbook.SheetNames
             //debugger

             //alert("runQuery: " + JSON.stringify(result,null,2))
             //console.log(JSON.stringify(result,null,2))
             let retTables = []
             if (result) {
                 this.sheetNames   = []
                 this.sheetDetails = {}
                 //alert(JSON.stringify(result,null,2))
                 for (var i=0;i<result.length;i++) {
                     this.sheetNames.push(result[i])
                     this.sheetDetails[result[i]] = {name: result[i]}
                 }
             }
             //debugger
             return this.sheetNames
            }
            ,




            getSheetDetails: function(sheetName)
            {
                return this.sheetDetails[sheetName]
            }
            ,






            getColumns: async function() {
                console.log("In getColumns")

                if (this.design_mode) {
                    var result = await callComponent(
                                        {
                                            driver_name: "excel_server",
                                            method_name: "excel_sql"  }
                                            ,{
                                                path:            this.properties.excel_file_path,
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
                                            driver_name: "excel_server",
                                            method_name: "excel_sql"  }
                                            ,{
                                                connect:         true,
                                                path:            this.properties.excel_file_path
                                             })
                    if (result.err) {
                        mm.properties.isExcelAvailable = "False"
                        return false
                    } else {
                        mm.properties.isExcelAvailable = "True"
                        return true
                    }
                } catch (catchErr) {
                    mm.properties.isExcelAvailable = "False"
                    return false
                }
            }
            ,






            getWorkbook: async function() {
                let mm = this

                if (mm.properties.isExcelAvailable == "True") {
                  try {
                      var result = await callComponent(
                                          {
                                              driver_name: "excel_server",
                                              method_name: "excel_sql"  }
                                              ,{
                                                  get_workbook:     true,
                                                  path:             this.properties.excel_file_path
                                               })
                      if (result.err) {
                          mm.properties.isExcelAvailable = "False"
                          return {error: true}
                      } else {
                          mm.properties.isExcelAvailable = "True"
                          mm.workbook = XLSX.utils.book_new();
                          let sheetNames = Object.keys(result.value)
                          for (let sheetIndex=0 ; sheetIndex < sheetNames.length; sheetIndex++) {
                              let sheetName = sheetNames[sheetIndex]
                              const ws = XLSX.utils.json_to_sheet(result.value[sheetName]);
                              XLSX.utils.book_append_sheet(mm.workbook, ws, sheetName);
                          }

                          return result.value
                      }
                  } catch (catchErr) {
                      mm.properties.isExcelAvailable = "False"
                      return {error: true}
                  }

                }
            }
            ,







            runQuery: async function() {
                if (!this.design_mode) {
                    var result = await callComponent(
                                        {
                                            driver_name: "excel_server",
                                            method_name: "excel_sql"  }
                                            ,{
                                                get_data:        true,
                                                table:           this.properties.select_table,
                                                path:            this.properties.excel_file_path
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

            getSheet: async function() {
                var result = await callComponent(
                                    {
                                        driver_name: "excel_server",
                                        method_name: "excel_sql"  }
                                        ,{
                                            get_data:        true,
                                            table:           this.properties.select_table,
                                            path:            this.properties.excel_file_path
                                         })


               //alert("runQuery: " + JSON.stringify(result,null,2))
               console.log(JSON.stringify(result,null,2))
               if (result) {

                    //select_columns
                    this.args.result  = result
                    return this.args.result
               }


                this.args.result = []
                this.changedFn()
                return {}
            }
            ,








            selectSheet(aSheet) {
              let mm = this
              mm.sheetData = mm.workbook.Sheets[aSheet]
              let range = XLSX.utils.decode_range(mm.sheetData['!ref']);
              mm.properties.rowCount = range.e.r
              mm.properties.colCount = range.e.c
            }
            ,
            getColRowId(col, row) {
                let startColNumber = "A".charCodeAt(0);
                let colCharNumber = startColNumber + col
                let colChar = String.fromCharCode(colCharNumber)
                let result = "" + colChar + (row  + 1)
                return result

            }
            ,
            getColId(col) {
                let startColNumber = "A".charCodeAt(0);
                let colCharNumber = startColNumber + col
                let colChar = String.fromCharCode(colCharNumber)
                let result = "" + colChar
                return result

            }
            ,
            getColHeaderOneBased(index) {
              if (index == 0) {
                return ""
              }
              let startColNumber = "A".charCodeAt(0);
              let colCharNumber = startColNumber + index - 1
              let colChar = String.fromCharCode(colCharNumber)
              let result = "" + colChar
              return result

            }
            ,





            getCellValue(colIndex,rowIndex) {
                let mm = this
                let returnCellValue = ""
                let colRowId = mm.getColRowId(colIndex,rowIndex)
                let cellObject = mm.sheetData[ colRowId ]
                if (cellObject) {
                  returnCellValue = cellObject.v
                  if (("" + returnCellValue).startsWith("__EMPTY")) {
                    returnCellValue = ""
                  }

                }
                return returnCellValue
            }
            ,





            clickCell(colIndex,rowIndex) {
                let mm = this
                if (mm.firstCellAlreadyClicked == false) {
                    mm.firstCellAlreadyClicked = true
                    mm.startCellColIndex = colIndex
                    mm.startCellRowIndex = rowIndex
                    mm.endCellColIndex = colIndex
                    mm.endCellRowIndex = rowIndex
                    mm.rangeSelected = true
                } else {
                  if ( colIndex < mm.startCellColIndex ) {
                    mm.endCellColIndex = mm.startCellColIndex
                    mm.startCellColIndex = colIndex
                  } else {
                    mm.endCellColIndex = colIndex
                  }
                  if ( rowIndex < mm.startCellRowIndex ) {
                    mm.endCellRowIndex = mm.startCellRowIndex
                    mm.startCellRowIndex = rowIndex
                  } else {
                    mm.endCellRowIndex = rowIndex
                  }
                  mm.rangeSelected = true
                  mm.firstCellAlreadyClicked = false

debugger
                  let colCount = 1 + mm.endCellColIndex - mm.startCellColIndex
                  let colHeaders = {}
                  if (mm.properties.headersAsColNames == "True") {
                      for (let colIndex = 0; colIndex < colCount; colIndex ++ ) {
                          colHeaders[colIndex] = mm.getCellValue( mm.startCellColIndex + colIndex, mm.startCellRowIndex)
                      }
                  } else {
                      for (let colIndex = 0; colIndex < colCount; colIndex ++ ) {
                          colHeaders[colIndex] = mm.getColId(mm.startCellColIndex + colIndex)
                      }

                  }

                  let outputData = []
                  let rowIndexStart = 0
                  if (mm.properties.headersAsColNames == "True") {
                      rowIndexStart = 1
                  }

                  let rowCount = 1 + mm.endCellRowIndex - mm.startCellRowIndex
                  for (let rowIndex = rowIndexStart; rowIndex < rowCount; rowIndex ++ ) {
                      let row = {}
                      for (let colIndex = 0; colIndex < colCount; colIndex ++ ) {
                          row[colHeaders[colIndex]] = mm.getCellValue( mm.startCellColIndex + colIndex, mm.startCellRowIndex + rowIndex)
                      }
                      outputData.push(row)
                  }

                  mm.properties.data = outputData

                }
            }
            ,
            cellInSelectedRange(colIndex,rowIndex) {
                let mm = this
                let selected = false
                if (mm.rangeSelected) {
                    if ((mm.startCellColIndex <= colIndex) && (colIndex <= mm.endCellColIndex)) {
                        if ((mm.startCellRowIndex <= rowIndex) && (rowIndex <= mm.endCellRowIndex)) {
                            selected = true

                        }

                    }
                }
                return selected
            }
            ,

            headersAsColNamesChanged: function(e) {
                if(e.target.checked) {
                    this.args.headersAsColNames="True"
                } else {
                    this.args.headersAsColNames="False"
                }
            }




        }
    })
}
