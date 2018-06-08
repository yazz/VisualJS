{
    doc_type: 'visifile'
    ,
    name: 'editorComponent'
    ,
    version: 1
    ,
    type: 'component'
    ,
    text: 'Component'


    ,
    events: {
        "This will return the test app": {
            on: "component",
            do: function(args, returnfn) {
                var uid = uuidv4()
                var uid2 = uuidv4()
                var mm = Vue.component(uid, {
                  data: function () {
                    return {
                        text: args.text,
                        uid2: uid2
                    }
                  },
                  template: `<div >
                                <div v-bind:id='uid2' ></div>
                                 <slot  :text2="text"></slot>
                             </div>`
                 ,

                 mounted: function() {
                     var mm = this
                     var editor = ace.edit(           uid2, {
                                                             mode:           "ace/mode/javascript",
                                                             selectionStyle: "text"
                                                         })
                     document.getElementById(uid2).style.width="100%"

                     document.getElementById(uid2).style.height="50%"
                     editor.getSession().setValue(mm.text);

                     editor.getSession().on('change', function() {
                        mm.text = editor.getSession().getValue();
                        //alert("changed text to : " + mm.text)
                        });
                 }


                })
                //alert(JSON.stringify(args,null,2)),

                returnfn({
                    name: uid
                }
                )


            }, end: null
        }

    }

}
