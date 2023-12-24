function component( args ) {
/*
base_component_id("sqlite_app_editor_component_v2")
component_type("SYSTEM")
load_once_from_file(true)
*/

    Yazz.component( {
        data:       function () {
            return {
                text:                       args.text,
                read_only:                  false,
                errors:                     null,
                sqlText:                    "{}",
                editor:                     null,
                selectedTab:                "home",
                listOfTables:               null,
                nextTableId:                null,

                // home pane
                pane_home_selectedTable:    null,
                pane_home_tabulator:        null,
                pane_home_selectedField:    null,
            }
        },
        template:   `<div style='background-color:white; ' >
                      <div style='box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);background-color: lightgray; padding: 5px;padding-left: 15px;border: 4px solid lightgray;' >
                          <slot style='box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);display: inline-block;' v-if='text' :text2="text">
                          </slot>
                      </div>

                      <div style='border-radius: 5px;margin-left:15px;margin-top:15px;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);border: 4px solid lightgray; '>
                          <div    style='font-size:14px;font-weight:bold;border-radius: 0px;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);background-image: linear-gradient(to right,  #000099, lightblue); color: white; border: 0px solid lightgray; padding:4px; margin:0;padding-left:14px;'>

                               App Sqlite Database Editor
                          </div>

                        
                        
                        
                        
                        
                        
                        

                        <!--  MAIN TAB MENU ---------------------------------------------------------
                        |    ---------------
                        |
                        |  Details of the main tab menu
                        |
                        --------------------------------------------------------------------- -->
                        <div class="container" style="margin-top: 40px;">
                          <ul class="nav nav-pills">

                            <li class="nav-item"   style="width: 16%;" v-on:click='switchTab({tabName: "home"})'>
                              <a v-bind:class='"nav-link" + (selectedTab=="home"?" active":"")' href="#">Home</a>
                            </li>

                            <li class="nav-item"   style="width: 16%;" v-on:click='switchTab({tabName: "sql"})'>
                              <a v-bind:class='"nav-link" + (selectedTab=="sql"?" active":"")' href="#">Sql</a>
                            </li>

                            <li class="nav-item"   style="width: 16%;" v-on:click='switchTab({tabName: "text"})'>
                              <a v-bind:class='"nav-link" + (selectedTab=="text"?" active":"")' href="#">Text</a>
                            </li>

                            <li class="nav-item"   style="width: 16%;" v-on:click='switchTab({tabName: "old"})'>
                              <a v-bind:class='"nav-link" + (selectedTab=="old"?" active":"")' href="#">Old</a>
                            </li>
                          </ul>
                        </div>









                        <!--  HOME PANE ---------------------------------------------------------
                        |    -----------
                        |
                        |  
                        |
                        -------------------------------------------------------------------------- -->
                        <div  v-if='selectedTab=="home"'  style="padding:15px;">
                            <div style="width: 100%;border: 1px solid blue; height:60%;">
                                <div style="width: 20%;border: 1px solid blue;display: inline-block;height:100%;">
                                    List of tables
                                    <div v-for="(tableItem,i) in listOfTables">
                                        <div
                                            v-bind:style='pane_home_selectedTable==tableItem.name?"background-color:lightgray;":""'
                                            v-on:click="pane_home_selectTable(  {  tableName:  tableItem.name  }  )"
                                        >{{tableItem.name}}</div>
                                    </div>

                                  <div style="margin-left: 30px;">
                                        <button  type=button class='btn btn-sm btn-primary'
                                                 style="box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 8px 0px, rgba(0, 0, 0, 0.19) 0px 6px 20px 0px;margin-bottom: 2px;margin-right: 10px;width:30px;"
                                                 v-on:click="pane_home_addTable()" >+</button>
    
                                        <button  type=button class='btn btn-sm btn-primary'
                                                 style="box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 8px 0px, rgba(0, 0, 0, 0.19) 0px 6px 20px 0px;margin-bottom: 2px;margin-right: 10px;width:30px;"
                                                 v-on:click="pane_home_deleteTable()" >-</button>
                                  </div>
                                </div>
                              
                                <div style="width: 78% ;border: 1px solid blue;display: inline-block;height:100%;vertical-align: top;">
                                  <div    id="db_editor_grid_view_parent" style="height: 500px;display: inline-block; width:85%;">
                                  </div>
                                  <div    id="" style="height: 500px;display: inline-block;vertical-align:top">
                                      <button   type=button class='btn btn-sm btn-primary'
                                                style="box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 8px 0px, rgba(0, 0, 0, 0.19) 0px 6px 20px 0px;margin-bottom: 2px;margin-right: 10px;width:30px;"
                                                v-on:click="pane_home_addColumn()" >+</button>
                                  </div>
                                </div>
                            </div>
<pre v-if='$DEBUGUI == "true"'  style="margin-top: 500px;border: solid 1px blue;padding: 5px;">
 -------------------------------------------------------------------- 
|                                                                    |
|                               DEBUG INFO                           |
|                                                                    |
 -------------------------------------------------------------------- 
</pre>
</div>
                        


                        
                        
                        
                        
                        
                        
                        
                        
                        
                        
                        
                        
                        
                        
                        

                        
                        
                        
                        
                        
                        
                        




      <!--  TEXT PANE ---------------------------------------------------------
      |    --------------
      |
      |  
      |
      -------------------------------------------------------------------------- -->
    <div  v-if='selectedTab=="text"'  style="padding:15px;">
        <pre style="height:60%;">{{sqlText}}
        </pre>
<pre v-if='$DEBUGUI == "true"'  style="margin-top: 500px;border: solid 1px blue;padding: 5px;">
 -------------------------------------------------------------------- 
|                                                                    |
|                               DEBUG INFO                           |
|                                                                    |
 -------------------------------------------------------------------- 
</pre>
</div>




















                        <!--  OLD PANE ---------------------------------------------------------
                        |    ----------
                        |
                        |  
                        |
                        -------------------------------------------------------------------------- -->
                        <div  v-if='selectedTab=="old"'  style="padding:15px;">
                          <div>
                            <a   v-bind:style="'margin-left:0px;margin-right: 0px;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);;' "
                                 href="#"
                                 v-on:click='setTimeout(async function(){$root.$emit("message", {type:          "switch_editor",editorName: "sqlite_editor_component"})},100)'
                                 type="button" class="btn btn-light ">
                              <img
                                  src='/driver_icons/database.png'
                                  style='height:35px; margin-right: 0px;'
                                  class='img-fluid'>
                              </img>
                              Old DB Editor
                            </a>
                          </div>
<pre v-if='$DEBUGUI == "true"'  style="margin-top: 500px;border: solid 1px blue;padding: 5px;">
 -------------------------------------------------------------------- 
|                                                                    |
|                               DEBUG INFO                           |
|                                                                    |
 -------------------------------------------------------------------- 
</pre>
</div>























                      </div>
                    <hr></hr>
                 </div>`,
        mounted:    async function() {
            let mm = this
            await useTabulatorJs()
            yz.mainVars.disableAutoSave     = false
            mm.pane_home_selectedTable      = null
            await mm.switchTab({tabName: "home"})
        },
        methods:    {
            switchTab:                  async function  (  {  tabName  }  ) {
                //----------------------------------------------------------------------------------/
                //
                //                    /-------------------------------------/
                //                   /               switchTab             /
                //                  /-------------------------------------/
                //
                //--------------------------------------------------------------------------/
                // This switches to a new tab
                //------------------------------------------------------------------------/
                let mm = this
                mm.selectedTab = tabName


                // ------------------------------------------------
                //    init home pane
                // ------------------------------------------------
                if (tabName == "home") {
                    if (mm.pane_home_tabulator == null ) {
                        Vue.nextTick(function () {
                            var elTab =  document.createElement("div");
                            elTab.setAttribute("id", "db_editor_grid_view")
                            elTab.setAttribute("style", "height:100%;")
                            let parentEl = document.getElementById("db_editor_grid_view_parent")
                            parentEl.appendChild(elTab);
                            var rowMenu = [
                                {
                                    label:"<i class='fas fa-user'></i> Change Name",
                                    action:function(e, row){
                                        row.update({name:"Steve Bobberson"});
                                    }
                                },
                                {
                                    label:"<i class='fas fa-check-square'></i> Select Row",
                                    action:function(e, row){
                                        row.select();
                                    }
                                },
                                {
                                    separator:true,
                                },
                                {
                                    label:"Admin Functions",
                                    menu:[
                                        {
                                            label:"<i class='fas fa-trash'></i> Delete Row",
                                            action:function(e, row){
                                                row.delete();
                                            }
                                        },
                                        {
                                            label:"<i class='fas fa-ban'></i> Disabled Option",
                                            disabled:true,
                                        },
                                    ]
                                }]
                            var headerMenu = function(){
                                var menu = [];
                                var columns = this.getColumns();

                                for(let column of columns){

                                    //create checkbox element using font awesome icons
                                    let icon = document.createElement("i");
                                    icon.classList.add("fas");
                                    icon.classList.add(column.isVisible() ? "fa-check-square" : "fa-square");

                                    //build label
                                    let label = document.createElement("span");
                                    let title = document.createElement("span");

                                    title.textContent = " " + column.getDefinition().title;

                                    label.appendChild(icon);
                                    label.appendChild(title);

                                    //create menu item
                                    menu.push({
                                        label:label,
                                        action:function(e){
                                            //prevent menu closing
                                            e.stopPropagation();

                                            //toggle current column visibility
                                            column.toggle();

                                            //change menu item icon
                                            if(column.isVisible()){
                                                icon.classList.remove("fa-square");
                                                icon.classList.add("fa-check-square");
                                            }else{
                                                icon.classList.remove("fa-check-square");
                                                icon.classList.add("fa-square");
                                            }
                                        }
                                    });
                                }

                                return menu;
                            };

                            Vue.nextTick(async function () {
                                mm.pane_home_tabulator = new Tabulator("#db_editor_grid_view",
                                    {
                                        reactiveData:       true,
                                        width:              "100px",
                                        //height:           "70px",
                                        rowHeight:          30,
                                        tables:             [],
                                        data:               [
                                            {id:1, name:"Oli Bob", age:"12", col:"red", dob:""},
                                            {id:2, name:"Mary May", age:"1", col:"blue", dob:"14/05/1982"},
                                            {id:3, name:"Christine Lobowski", age:"42", col:"green", dob:"22/05/1982"},
                                            {id:4, name:"Brendon Philips", age:"125", col:"orange", dob:"01/08/1980"},
                                            {id:5, name:"Margret Marmajuke", age:"16", col:"yellow", dob:"31/01/1999"},
                                        ],
                                        layout:             "fitColumns",
                                        responsiveLayout:   "hide",
                                        tooltips:           true,
                                        addRowPos:          "top",
                                        history:            true,
                                        pagination:         "local",
                                        paginationSize:     7,
                                        movableColumns:     true,
                                        resizableColumns:   true,
                                        resizableRows:      true,
                                        movableColumns:     true,
                                        layout:             [
                                            {display: "Fit Columns",    value: "fitColumns"},
                                            {display: "Fit Data",       value: "fitData"},
                                            {display: "Fit Data Fill",  value: "fitDataFill"}
                                        ],
                                        tableNames:         [],
                                        initialSort:        [],
                                        rowContextMenu: rowMenu,
                                        columns:            [
                                            //{title:"Name",              field:"name",   width:150                               , headerMenu: headerMenu, headerFilter:"input"}
                                        ]
                                    });

                            })
                        })
                    }
                } else {
                    //document.getElementById("db_editor_grid_view").remove()
                    mm.pane_home_tabulator = null
                }



                // ------------------------------------------------
                //    init text pane
                // ------------------------------------------------
                if (tabName == "text") {
                }
            },
            createModelFromSrcCode:     async function  (  ) {
                //----------------------------------------------------------------------------------/
                //
                //                    /-------------------------------------/
                //                   /      createModelFromSrcCode         /
                //                  /-------------------------------------/
                //
                //----------------------------------------------------------------------------/
                // This creates a model of the database based on the database( ... ) tag
                // in the source code
                //------------------------------------------------------------------------/
                let mm = this
                let changed = false
                if (mm.text == null) {
                    return
                }
                let parsedDatabaseEntry = yz.helpers.getValueOfCodeString(mm.text, "database", ")//database")
                if (!isValidObject(parsedDatabaseEntry)) {
                    parsedDatabaseEntry =
                        {
                            db_type:
                                {
                                    name: "sqlite"
                                },
                            schema:
                                {
                                    tables:
                                        [
                                            {
                                                name:    "TABLE_1",
                                                cols:
                                                    [
                                                        {
                                                            id:   "id",
                                                            type: "TEXT"
                                                        }
                                                    ],
                                                next_field_id: 2
                                            }
                                        ]

                                },
                            next_table_id: 2
                        }
                    changed = true
                }
                mm.sqlText =  JSON.stringify(  parsedDatabaseEntry  ,  null  ,  2  )

                mm.listOfTables = []
                if (parsedDatabaseEntry && parsedDatabaseEntry.schema && parsedDatabaseEntry.schema.tables) {
                    mm.listOfTables = parsedDatabaseEntry.schema.tables
                }

                if (isValidObject(mm.text)) {
                    mm.read_only = yz.helpers.getValueOfCodeString(mm.text, "read_only")
                }

                if (parsedDatabaseEntry && parsedDatabaseEntry.next_table_id) {
                    mm.nextTableId = parsedDatabaseEntry.next_table_id
                } else {
                    mm.nextTableId = 2
                    changed = true
                }
                if (  mm.listOfTables && (mm.listOfTables.length > 0)  )
                {
                    if (mm.pane_home_selectedTable == null) {
                        await mm.pane_home_selectTable(  {  tableName:  mm.listOfTables[0].name  }  )
                    }
                }






                if (changed) {
                    await mm.schemaChanged()
                }
            },
            schemaChanged:              async function  (  ) {
                let mm = this
                mm.$root.$emit(
                    'message', {
                        type: "pending"
                    })
            },
            convertJsonModelToSrcCode:  async function  (  ) {
                //----------------------------------------------------------------------------------/
                //
                //                    /-------------------------------------/
                //                   /   convertJsonModelToSrcCode         /
                //                  /-------------------------------------/
                //
                //----------------------------------------------------------------------------/
                // This takes the model of the database and amends the database( ... ) tag
                // in the source code
                //------------------------------------------------------------------------/
                let mm = this
                let srcDatabaseEntry = yz.helpers.getValueOfCodeString(mm.text, "database", ")//database")
                if (isValidObject(srcDatabaseEntry)) {
                    mm.text = yz.helpers.deleteCodeString(mm.text, "database", ")//database")
                }

                let newDatabaseEntry =
                    {
                        db_type:
                            {
                                name: "sqlite"
                            },
                        schema:
                            {
                                tables: mm.listOfTables
                            },
                        next_table_id: mm.nextTableId
                    }

                mm.sqlText =  JSON.stringify(  newDatabaseEntry  ,  null  ,  2  )
                mm.text = yz.helpers.insertCodeString(mm.text, "database", newDatabaseEntry , ")//database")





                //
                // old DB defn
                //
                debugger
                let srcOldDatabaseEntry = yz.helpers.getValueOfCodeString(mm.text, "sqlite", ")//sqlite")
                if ((srcOldDatabaseEntry == null) || (srcOldDatabaseEntry.migrations == null)) {
                    srcOldDatabaseEntry = {
                        migrations: []
                    }
                }
                if (isValidObject(srcOldDatabaseEntry)) {
                    mm.text = yz.helpers.deleteCodeString(mm.text, "sqlite", ")//sqlite")
                }

                srcOldDatabaseEntry.migrations.push(
                    {
                        name: "Add a zubair table"
                        ,
                        up: ["alter TABLE items add column zubair INTEGER;"]
                    }
                )

                let oldSqlText =  JSON.stringify(  srcOldDatabaseEntry  ,  null  ,  2  )
                mm.text = yz.helpers.insertCodeString(mm.text, "sqlite", oldSqlText , ")//sqlite")
            },
            getText:                    async function  (  ) {
                //----------------------------------------------------------------------------------/
                //
                //                    /-------------------------------------/
                //                   /                 getText             /
                //                  /-------------------------------------/
                //
                //----------------------------------------------------------------------------/
                // gets the source code text, in this case changes to the
                // SQL definitions
                //------------------------------------------------------------------------/
                let mm = this
                if (!isValidObject(this.text)) {
                    return null
                }
                await mm.convertJsonModelToSrcCode()
                return this.text
            },
            setText:                    async function  (  textValue  ) {
                //----------------------------------------------------------------------------------/
                //
                //                    /-------------------------------------/
                //                   /                 setText             /
                //                  /-------------------------------------/
                //
                //----------------------------------------------------------------------------/
                // Sets the source code text, in this case the SQL definitions are what
                // is read by the database editor
                //------------------------------------------------------------------------/
                let mm = this
                this.text           =  textValue

                if (!isValidObject(this.text)) {
                    return
                }
                args.text                       = null

                await mm.createModelFromSrcCode()
            },
            pane_home_addTable:         async function  (  ) {
                //----------------------------------------------------------------------------------/
                //
                //                    /-------------------------------------/
                //                   /          pane_home_addTable         /
                //                  /-------------------------------------/
                //
                //----------------------------------------------------------------------------/
                // Add a table
                //------------------------------------------------------------------------/
                let mm = this
                if (!mm.nextTableId) {
                    mm.nextTableId = 1
                }
                let newTableName = "TABLE_" + mm.nextTableId
                mm.listOfTables.push(
                    {
                        name:    newTableName,
                        cols:
                            [
                                {
                                    id: "id",
                                    type: "TEXT"
                                }
                            ],
                        next_field_id: 2
                    })
                mm.nextTableId ++
                await mm.pane_home_selectTable(  { tableName: newTableName})
                await mm.schemaChanged()
            },
            pane_home_addColumn:         async function  (  ) {
                //----------------------------------------------------------------------------------/
                //
                //                    /-------------------------------------/
                //                   /         pane_home_addColumn         /
                //                  /-------------------------------------/
                //
                //--------------------------------------------------------------------------/
                // Add a column
                //------------------------------------------------------------------------/
                let mm = this

                if (mm.pane_home_selectedTable == null) {
                    return
                }
                let table = await mm.getTable( { tableName: mm.pane_home_selectedTable } )

                if (!table.next_field_id) {
                    table.next_field_id = 1
                }
                let newColumnName = "COL_" + table.next_field_id
                table.cols.push(
                    {
                        id:     newColumnName,
                        type:   "TEXT"
                    }
                )

                table.next_field_id ++
                await mm.pane_home_selectTable(  { tableName: mm.pane_home_selectedTable})

                await mm.schemaChanged()
            },
            pane_home_deleteTable:      async function  (  ) {
                //----------------------------------------------------------------------------------/
                //
                //                    /-------------------------------------/
                //                   /       pane_home_deleteTable         /
                //                  /-------------------------------------/
                //
                //----------------------------------------------------------------------------/
                // Delete a table
                //------------------------------------------------------------------------/
                let mm = this
                if (mm.pane_home_selectedTable == null) {
                    return
                }
                for (let tableIndex = mm.listOfTables.length - 1; tableIndex >= 0; tableIndex--) {
                    if (mm.listOfTables[tableIndex]) {
                        if (mm.listOfTables[tableIndex].name == mm.pane_home_selectedTable) {
                            mm.listOfTables.splice(tableIndex, 1);
                        }
                    }
                }
                await mm.pane_home_selectTable(  { tableName: null})
                await mm.schemaChanged()
            },
            getTable:                   async function  (  { tableName  }  ) {
                let mm = this
                for (let tableIndex = mm.listOfTables.length - 1; tableIndex >= 0; tableIndex--) {
                    if (mm.listOfTables[tableIndex]) {
                        if (mm.listOfTables[tableIndex].name == mm.pane_home_selectedTable) {
                            return mm.listOfTables[tableIndex]
                        }
                    }
                }
            },
            pane_home_selectTable:      async function  (  {  tableName  }  ) {

                let mm = this
                mm.pane_home_selectedTable = tableName
                let tabulatorFields = []
                let table = await mm.getTable( { tableName: tableName } )
                for (let field of table.cols) {
                    tabulatorFields.push({title: field.id, field: field.id,   width:150   ,  headerFilter:"input"})
                }
                setTimeout(async function () {
                    if (tabulatorFields) {
                        mm.pane_home_tabulator.setColumns(tabulatorFields)
                    }
                },100)
            }
        }
    })
}
