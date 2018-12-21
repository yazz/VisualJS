function component( args ) {
/*
base_component_id("editor_component")
control_type("SYSTEM")
load_once_from_file(true)
*/

    var editorDomId     = uuidv4()
    var editor          = null


    Vue.component("editor_component", {
      data: function () {
        return {
            text: args.text,
            read_only: false,
            editorDomId: editorDomId
        }
      },
      template: `<div>
                      <div style='box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);background-color: lightgray; padding: 5px;padding-left: 15px;border: 4px solid lightgray;' >
                          <slot style='box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);display: inline-block;' v-if='text' :text2="text">
                          </slot>
                      </div>

                      <div    style='font-size:14px;font-weight:bold;border-radius: 10px;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);background-image: linear-gradient(to right,  #000099, lightblue); color: white; border: 0px solid lightgray; padding:4px; margin:0;'>

                           (Form)
                      </div>

                    <div    v-bind:id='editorDomId' >
                    </div>
                    <hr></hr>
                 </div>`
     ,

     mounted: function() {
         var thisVueInstance = this
         args.text = null
         ace.config.set('basePath', '/');
         editor = ace.edit(           editorDomId, {
                                                 selectionStyle: "text",
                                                 mode:           "ace/mode/javascript"
                                             })

         //Bug fix: Need a delay when setting theme or view is corrupted
         setTimeout(function(){
            editor.setTheme("ace/theme/sql_server");
         },100)


         document.getElementById(editorDomId).style["font-size"] = "16px"
         document.getElementById(editorDomId).style.width="100%"
         document.getElementById(editorDomId).style.border="4px solid lightgray"
         document.getElementById(editorDomId).style["box-shadow"] = "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"

         document.getElementById(editorDomId).style.height="75vh"
         if (thisVueInstance.text) {
             editor.getSession().setValue(thisVueInstance.text);
             this.read_only = saveHelper.getValueOfCodeString(thisVueInstance.text, "read_only")
         }

         editor.getSession().setUseWorker(false);
         if (this.read_only) {
            editor.setReadOnly(true)
         }


         editor.getSession().on('change', function() {
            thisVueInstance.text = editor.getSession().getValue();
            //alert("changed text to : " + thisVueInstance.text)
            });

        editorresize(true);
     },
     methods: {
        getText: async function() {
            return this.text
        },
        setText: function(textValue) {
            var thisVueInstance = this
            this.text =  textValue
            this.read_only = saveHelper.getValueOfCodeString(thisVueInstance.text, "read_only")
            if (this.read_only) {
               editor.setReadOnly(true)
            }
            editor.getSession().setValue(textValue);
        }

     }


    })

}
