function component( args ) {
/*
base_component_id("sqlite_editor_component")
component_type("SYSTEM")
hash_algorithm("SHA256")
load_once_from_file(true)
*/

    let newEditorDomId     = uuidv4()

    Yazz.component( {
        data:       function () {
        return {
            text:           args.text,
            read_only:      false,
            editorDomId:    newEditorDomId,
            errors:         null,
            sqlText:        "{}",
            editor:         null
        }
      },
        template:   `<div style='background-color:white; ' >
                      <div style='box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);background-color: lightgray; padding: 5px;padding-left: 15px;border: 4px solid lightgray;' >
                          <slot style='box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);display: inline-block;' v-if='text' :text2="text">
                          </slot>
                      </div>

                      <div style='border-radius: 5px;margin-left:15px;margin-top:15px;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);border: 4px solid lightgray; '>
                          <div    style='font-size:14px;font-weight:bold;border-radius: 0px;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);background-image: linear-gradient(to right,  #000099, lightblue); color: white; border: 0px solid lightgray; padding:4px; margin:0;padding-left:14px;'>

                               Editor
                          </div>

                        <div    v-bind:id='editorDomId' >
                        </div>

                        <pre    v-on:click="gotoLine(errors.lineNumber)"
                                style="background:pink;color:blue;"
                                v-if="errors != null">Line {{errors.lineNumber}}: {{errors.description}}</pre>

                    </div>
                    <hr/>
                 </div>`,
        props:      [  "editor_fns"  ],
        mounted:    function() {
            let mm                      = this
            args.text                   = null
            //yz.mainVars.disableAutoSave = true

            ace.config.set('basePath', '/');
            mm.editor = ace.edit(            mm.editorDomId, {
                                             selectionStyle: "text",
                                             mode:           "ace/mode/javascript"
                                         })

            //Bug fix: Need a delay when setting theme or view is corrupted
            setTimeout( function() {
                mm.editor.setTheme("ace/theme/sqlserver");

                let langTools = ace.require("ace/ext/language_tools");
                mm.editor.setOptions({
                    enableBasicAutocompletion: true,
                    enableSnippets: true,
                    enableLiveAutocompletion: false
                });
            },100)

            document.getElementById(mm.editorDomId).style["font-size"]  = "16px"
            document.getElementById(mm.editorDomId).style.width         ="100%"
            document.getElementById(mm.editorDomId).style["border"]     = "0px"
            document.getElementById(mm.editorDomId).style.height        = "65vh"

            if (isValidObject(mm.text)) {
                mm.editor.getSession().setValue(mm.sqlText);
                this.read_only = yz.helpers.getValueOfCodeString(mm.text, "read_only")
            }

            mm.editor.getSession().setUseWorker(false);
            if (this.read_only) {
                mm.editor.setReadOnly(true)
            }


            mm.editor.getSession().on('change', function() {
                let haveIChangedtext = false
                if (mm.sqlText != mm.editor.getSession().getValue())
                {
                    haveIChangedtext = true
                }
                mm.sqlText = mm.editor.getSession().getValue();
                mm.errors  = null

                if (!isValidObject(mm.sqlText))
                {
                    return
                }
                if (mm.sqlText.length == 0)
                {
                    return
                }
                try {
                    let newNode = esprima.parse("(" + mm.sqlText + ")", { tolerant: true })
                    //alert(JSON.stringify(newNode.errors, null, 2))
                    mm.errors = newNode.errors
                    if (mm.errors)
                    {
                        if (mm.errors.length == 0)
                        {
                            mm.errors = null
                            if (haveIChangedtext)
                            {
                                //mm.editor_fns.pending()
                            }
                        } else {
                            mm.errors = mm.errors[0]
                        }
                    }
                } catch(e) {
                    //alert(JSON.stringify(e, null, 2))
                    mm.errors = e
                }
            });

            mm.editor.resize(true);
            mm.editor.focus();
        },
        methods:    {
            gotoLine:   function        (  line  ) {
                this.editor.gotoLine(line , 10, true);
            },
            getText:    async function  (  ) {
                if (!isValidObject(this.text)) {
                    return null
                }

                this.text = yz.helpers.deleteCodeString(this.text, "sqlite", ")//sqlite")
                this.text = yz.helpers.insertCodeString(this.text, "sqlite", JSON.parse(this.sqlText) ,")//sqlite")

                return this.text
            },
            setText:    function        (  textValue  ) {
                let mm = this
                this.text           =  textValue

                if (!isValidObject(this.text)) {
                    return
                }

                //
                // set the editor to read only if in read only mode
                //


                this.read_only = yz.helpers.getValueOfCodeString(mm.text, "read_only")
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
