function component( args ) {
/*
base_component_id("sqlite_app_editor_component_v2")
component_type("SYSTEM")
load_once_from_file(true)
*/

    Yazz.component( {
        data: function () {
        return {
            text:           args.text,
            read_only:      false,
            errors:         null,
            sqlText:        "{}",
            editor:         null,
            selectedTab:    "home",

            // text pane


        }
      },
        template: `<div style='background-color:white; ' >
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

                            <li class="nav-item"   style="width: 16%;" v-on:click='switchTab({tabName: "tables"})'>
                              <a v-bind:class='"nav-link" + (selectedTab=="tables"?" active":"")' href="#">Tables</a>
                            </li>

                            <li class="nav-item"   style="width: 16%;" v-on:click='switchTab({tabName: "fields"})'>
                              <a v-bind:class='"nav-link" + (selectedTab=="fields"?" active":"")' href="#">Fields</a>
                            </li>

                            <li class="nav-item"   style="width: 16%;" v-on:click='switchTab({tabName: "data"})'>
                              <a v-bind:class='"nav-link" + (selectedTab=="data"?" active":"")' href="#">Data</a>
                            </li>

                            <li class="nav-item"   style="width: 16%;" v-on:click='switchTab({tabName: "sql"})'>
                              <a v-bind:class='"nav-link" + (selectedTab=="sql"?" active":"")' href="#">Sql</a>
                            </li>

                            <li class="nav-item"   style="width: 16%;" v-on:click='switchTab({tabName: "text"})'>
                              <a v-bind:class='"nav-link" + (selectedTab=="text"?" active":"")' href="#">Text</a>
                            </li>
                          </ul>
                        </div>









                        <!--  HOME PANE ---------------------------------------------------------
                        |    --------------
                        |
                        |  
                        |
                        -------------------------------------------------------------------------- -->


                        <div  v-if='selectedTab=="home"'  style="padding:15px;">
        

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
                        


                        
                        
                        
                        
                        
                        
                        
                        
                        
                        
                        
                        
                        
                        
                        





      <!--  TEXT PANE ---------------------------------------------------------
      |    --------------
      |
      |  
      |
      -------------------------------------------------------------------------- -->


    <div  v-if='selectedTab=="text"'  style="padding:15px;">
        
        <pre>
{{sqlText}}
        </pre>
        
        <pre    v-on:click="gotoLine(errors.lineNumber)"
                style="background:pink;color:blue;"
                v-if="errors != null">Line {{errors.lineNumber}}: {{errors.description}}</pre>





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
                 </div>`
        ,

        mounted: function() {
     },
        methods: {
            switchTab:                  async function  (  {  tabName  }  ) {
                //----------------------------------------------------------------------------------/
                //
                //                    /-------------------------------------/
                //                   /               switchTab             /
                //                  /-------------------------------------/
                //
                //----------------------------------------------------------------------------/
                // This switches to a new tab
                //------------------------------------------------------------------------/
                let mm = this
                mm.selectedTab = tabName

                // ------------------------------------------------
                //    init history pane
                // ------------------------------------------------
                if (tabName == "text") {
                    debugger
                    args.text           = null
                    yz.mainVars.disableAutoSave     = true

                    let llsqlText = yz.helpers.getValueOfCodeString(mm.text, "database", ")//database")
                    if (isValidObject(llsqlText)) {
                        mm.sqlText =  llsqlText
                    } else {
                        mm.sqlText =  JSON.stringify(  [] , null , 2  )
                    }


                    if (isValidObject(mm.text)) {
                        mm.read_only = yz.helpers.getValueOfCodeString(mm.text, "read_only")
                    }
                }
            },
            gotoLine:                   function        (  line  ) {
            this.editor.gotoLine(line , 10, true);
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
                if (!isValidObject(this.text)) {
                    return null
                }

                this.text = yz.helpers.deleteCodeString(this.text, "database", ")//database")
                this.text = yz.helpers.insertCodeString(this.text, "database", JSON.parse(this.sqlText) ,")//database")

                return this.text
            },
            setText:                    function        (  textValue  ) {
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
                debugger
                this.text           =  textValue

                if (!isValidObject(this.text)) {
                    return
                }

            }
        }
    })
}
