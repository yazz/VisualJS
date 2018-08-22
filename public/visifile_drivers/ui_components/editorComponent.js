function component( args ) {
/*
base_component_id("editor_component")
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
                    <div v-bind:id='editorDomId' ></div>
                    <hr />
                     <slot  :text2="text"></slot>
                 </div>`
     ,

     mounted: function() {
         var thisVueInstance = this
         editor = ace.edit(           editorDomId, {
                                                 selectionStyle: "text"
                                             })
         editor.session.setMode("ace/mode/javascript");
         document.getElementById(editorDomId).style.width="100%"

         document.getElementById(editorDomId).style.height="45vh"
         editor.getSession().setValue(thisVueInstance.text);
         editor.getSession().setUseWorker(false);
         this.read_only = saveHelper.getValueOfCodeString(thisVueInstance.text, "read_only")
         if (this.read_only) {
            editor.setReadOnly(true)
         }


         editor.getSession().on('change', function() {
            thisVueInstance.text = editor.getSession().getValue();
            //alert("changed text to : " + thisVueInstance.text)
            });
     },
     methods: {
        getText: function() {
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
