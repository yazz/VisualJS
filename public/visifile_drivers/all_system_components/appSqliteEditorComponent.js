function component( args ) {
/*
base_component_id("sqlite_app_editor_component_v2")
component_type("SYSTEM")
load_once_from_file(true)
*/

    let newEditorDomId     = uuidv4()


    Yazz.component( {
        data: function () {
        return {
            text:           args.text,
            read_only:      false,
            editorDomId:    newEditorDomId,
            errors:         null,
            sqlText:        "{}",
            editor:         null,
            selectedTab:    "home"
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












      <!--  TEXT PANE ---------------------------------------------------------
      |    --------------
      |
      |  
      |
      -------------------------------------------------------------------------- -->


    <div  v-if='selectedTab=="text"' style="padding:15px;">
        Text pane




<pre v-if='$DEBUGUI == "true"'  style="margin-top: 500px;border: solid 1px blue;padding: 5px;">
 -------------------------------------------------------------------- 
|                                                                    |
|                               DEBUG INFO                           |
|                                                                    |
 -------------------------------------------------------------------- 
</pre>
    </div>











                        <div    v-bind:id='editorDomId' >
                        </div>

                        <pre    v-on:click="gotoLine(errors.lineNumber)"
                                style="background:pink;color:blue;"
                                v-if="errors != null">Line {{errors.lineNumber}}: {{errors.description}}</pre>

















                    </div>
                    <hr></hr>
                 </div>`
        ,

        mounted: function() {
         let thisVueInstance = this
         let mm = this
         args.text           = null
         yz.mainVars.disableAutoSave     = true

         ace.config.set('basePath', '/');
         mm.editor = ace.edit(           mm.editorDomId, {
                                                 selectionStyle: "text",
                                                 mode:           "ace/mode/javascript"
                                             })

         //Bug fix: Need a delay when setting theme or view is corrupted
         setTimeout(function(){
             mm.editor.setTheme("ace/theme/sqlserver");

            let langTools = ace.require("ace/ext/language_tools");
             mm.editor.setOptions({
               enableBasicAutocompletion: true,
               enableSnippets: true,
               enableLiveAutocompletion: false
            });

         },100)



         document.getElementById(mm.editorDomId).style["font-size"] = "16px"
         document.getElementById(mm.editorDomId).style.width="100%"
         document.getElementById(mm.editorDomId).style["border"] = "0px"

         document.getElementById(mm.editorDomId).style.height="65vh"
         if (isValidObject(thisVueInstance.text)) {
             mm.editor.getSession().setValue(thisVueInstance.sqlText);
             this.read_only = yz.helpers.getValueOfCodeString(thisVueInstance.text, "read_only")
         }

         mm.editor.getSession().setUseWorker(false);
         if (this.read_only) {
             mm.editor.setReadOnly(true)
         }


         mm.editor.getSession().on('change', function() {
            let haveIChangedtext = false
            if (thisVueInstance.sqlText != mm.editor.getSession().getValue()) {
              haveIChangedtext = true
            }
            thisVueInstance.sqlText = mm.editor.getSession().getValue();
            thisVueInstance.errors = null
            if (!isValidObject(thisVueInstance.sqlText)) {
                return
            }
            if (thisVueInstance.sqlText.length == 0) {
                return
            }
            try {
               let newNode = esprima.parse("(" + thisVueInstance.sqlText + ")", { tolerant: true })
               //alert(JSON.stringify(newNode.errors, null, 2))
               thisVueInstance.errors = newNode.errors
               if (thisVueInstance.errors) {
                    if (thisVueInstance.errors.length == 0) {
                        thisVueInstance.errors = null
                        if (haveIChangedtext) {
                          thisVueInstance.$root.$emit(
                            'message', {
                                            type:   "pending"
                                       })
                        }
                    } else {
                        thisVueInstance.errors = thisVueInstance.errors[0]
                    }
               }
            } catch(e) {
               //alert(JSON.stringify(e, null, 2))
               thisVueInstance.errors = e
            }
         });

         mm.editor.resize(true);
         mm.editor.focus();
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
                    mm.$nextTick(() => {
                        alert(1);
                    });
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

                this.text = yz.helpers.deleteCodeString(this.text, "sqlite", ")//sqlite")
                this.text = yz.helpers.insertCodeString(this.text, "sqlite", JSON.parse(this.sqlText) ,")//sqlite")

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
                let thisVueInstance = this
                this.text           =  textValue

                if (!isValidObject(this.text)) {
                    return
                }

                //
                // set the editor to read only if in read only mode
                //


                this.read_only = yz.helpers.getValueOfCodeString(thisVueInstance.text, "read_only")
                if (this.read_only) {
                   this.editor.setReadOnly(true)
                }





                //
                // If a database definition has been given then read it
                //

                let llsqlText = yz.helpers.getValueOfCodeString(textValue, "sqlite", ")//sqlite")
                if (isValidObject(llsqlText)) {
                    this.editor.getSession().setValue(  JSON.stringify(  llsqlText , null , 2  ));
                } else {
                    this.editor.getSession().setValue(  JSON.stringify(  [] , null , 2  ));
                }
            }
        }
    })
}
