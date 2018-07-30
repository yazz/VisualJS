function component( args ) {
/*
base_component_id("form_editor_component")
load_once_from_file(true)
*/

    //alert(JSON.stringify(args,null,2))
    var uid2 = uuidv4()
    var mm = null
    var editor = null
    Vue.component("form_editor_component", {
      data: function () {
        return {
            text: args.text,
            uid2: uid2
        }
      },
      template: `<div>Form editor
                    <div v-bind:id='uid2' ></div>
                    <hr />
                     <slot  :text2="text"></slot>
                 </div>`
     ,

     mounted: function() {
         mm = this
         editor = ace.edit(           uid2, {
                                                 mode:           "ace/mode/javascript",
                                                 selectionStyle: "text"
                                             })
         document.getElementById(uid2).style.width="100%"

         document.getElementById(uid2).style.height="45vh"
         editor.getSession().setValue(mm.text);
         editor.getSession().setUseWorker(false);


         editor.getSession().on('change', function() {
            mm.text = editor.getSession().getValue();
            //alert("changed text to : " + mm.text)
            });
     },
     methods: {
        getText: function() {
            return this.text
        },
        setText: function(textValue) {
            this.text =  textValue
            editor.getSession().setValue(textValue);
        }

     }


    })

}
