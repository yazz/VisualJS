function component( args ) {
/*
base_component_id("editor_component")
component_type("SYSTEM")
load_once_from_file(true)
*/

    Vue.component("editor_component", {
      data: function () {
        return {
            text:           null,
            read_only:      false,
            editorDomId:    uuidv4(),
            errors:         null,
            editor:         null
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
         let mm             = this
         disableAutoSave    = true

         ace.config.set('basePath', '/');
         mm.editor = ace.edit(
            mm.editorDomId, {
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
         document.getElementById(mm.editorDomId).style.width        = "100%"
         document.getElementById(mm.editorDomId).style["border"]    = "0px"
         document.getElementById(mm.editorDomId).style.height       = "65vh"

         if (mm.text) {
             mm.editor.getSession().setValue(  mm.text  );
             mm.read_only = yz.getValueOfCodeString( mm.text, "read_only" )
         }

         mm.editor.getSession().setUseWorker(false);
         if (mm.read_only) {
            mm.editor.setReadOnly(true)
         }

         setTimeout(function() {
             mm.editor.getSession().on('change', function() {
                 if (mm.editor.curOp && mm.editor.curOp.command.name) {
                     mm.text = mm.editor.getSession().getValue();

                     if (mm.text == "") {
                         return
                     }
//zzz
                     mm.errors = null
                     if (!isValidObject(mm.text)) {
                         return
                     }
                     if (mm.text.length == 0) {
                         return
                     }
                     try {
                         let newNode = esprima.parse("(" + mm.text + ")", { tolerant: true })
                         //alert(JSON.stringify(newNode.errors, null, 2))
                         mm.errors = newNode.errors
                         if (mm.errors) {
                             if (mm.errors.length == 0) {
                                 mm.errors = null
                             } else {
                                 mm.errors = mm.errors[0]
                             }
                         }
                         mm.changed()

                     } catch(e) {
                         //alert(JSON.stringify(e, null, 2))
                         mm.errors = e
                     }
                 }
             });
         },1000)


        mm.editor.resize(true);
        mm.editor.focus();
     }
     ,



     methods: {
        changed: function() {
            let mm = this
            mm.$root.$emit('message', {
                type:   "pending"
            })
        }
         ,
        gotoLine: function(line) {
            let mm = this
            mm.editor.gotoLine(line , 10, true);
        }
        ,
        getText: async function() {
            let mm = this
            return mm.text
        },
        setText: function(textValue) {
            let mm = this
            mm.text =  textValue
            mm.read_only = yz.getValueOfCodeString(mm.text, "read_only")
            if (mm.read_only) {
               mm.editor.setReadOnly(true)
            }
            mm.editor.getSession().setValue(textValue);
        }

     }


    })

}
