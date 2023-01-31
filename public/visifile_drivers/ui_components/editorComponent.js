function component( args ) {
/*
base_component_id("editor_component")
component_type("SYSTEM")
load_once_from_file(true)
*/

    let editorDomId     = uuidv4()
    let editor          = null


    Vue.component("editor_component", {
      data: function () {
        return {
            text:           null,
            previousText:   "",
            read_only:      false,
            editorDomId:    editorDomId,
            errors:         null
        }
      },
      template: `<div style='background-color:white; ' >
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
                    <hr></hr>
                 </div>`
     ,

     mounted: function() {
         let thisVueInstance = this
         disableAutoSave = true
         ace.config.set('basePath', '/');
         editor = ace.edit(           editorDomId, {
                                                 selectionStyle: "text",
                                                 mode:           "ace/mode/javascript"
                                             })

         //Bug fix: Need a delay when setting theme or view is corrupted
         setTimeout(function(){
            editor.setTheme("ace/theme/sqlserver");

            let langTools = ace.require("ace/ext/language_tools");
            editor.setOptions({
               enableBasicAutocompletion: true,
               enableSnippets: true,
               enableLiveAutocompletion: false
            });

         },100)



         document.getElementById(editorDomId).style["font-size"] = "16px"
         document.getElementById(editorDomId).style.width="100%"
         document.getElementById(editorDomId).style["border"] = "0px"

         document.getElementById(editorDomId).style.height="65vh"
         if (thisVueInstance.text) {
             editor.getSession().setValue(thisVueInstance.text);
             this.read_only = yz.getValueOfCodeString(thisVueInstance.text, "read_only")
         }

         editor.getSession().setUseWorker(false);
         if (this.read_only) {
            editor.setReadOnly(true)
         }

         setTimeout(function() {
             editor.getSession().on('change', function() {
                thisVueInstance.text = editor.getSession().getValue();

                if (thisVueInstance.text == "") {
                    return
                }

                let filteredOldText = yz.deleteCodeString(thisVueInstance.text, "parent_hash")
                let filteredNewText = yz.deleteCodeString(thisVueInstance.previousText, "parent_hash")
                if (filteredOldText != filteredNewText){
                    thisVueInstance.previousText = thisVueInstance.text
                    thisVueInstance.errors = null
                    if (!isValidObject(thisVueInstance.text)) {
                        return
                    }
                    if (thisVueInstance.text.length == 0) {
                        return
                    }
                    try {
                       let newNode = esprima.parse("(" + thisVueInstance.text + ")", { tolerant: true })
                       //alert(JSON.stringify(newNode.errors, null, 2))
                       thisVueInstance.errors = newNode.errors
                       if (thisVueInstance.errors) {
                            if (thisVueInstance.errors.length == 0) {
                                thisVueInstance.errors = null
                            } else {
                                thisVueInstance.errors = thisVueInstance.errors[0]
                            }
                       }
                       thisVueInstance.changed()

                    } catch(e) {
                       //alert(JSON.stringify(e, null, 2))
                       thisVueInstance.errors = e
                    }
                }

             });
         },1000)


        editor.resize(true);
        editor.focus();
     },
     methods: {
         changed: function() {
             this.$root.$emit('message', {
                 type:   "pending"
             })
         }
         ,
        gotoLine: function(line) {
            editor.gotoLine(line , 10, true);
        }
        ,
        getText: async function() {
            return this.text
        },
        setText: function(textValue) {
            let thisVueInstance = this
            this.text =  textValue
            this.read_only = yz.getValueOfCodeString(thisVueInstance.text, "read_only")
            if (this.read_only) {
               editor.setReadOnly(true)
            }
            editor.getSession().setValue(textValue);
        }

     }


    })

}
