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
                var mm = Vue.component(uid, {
                  data: function () {
                    return {
                        text: args.text
                    }
                  },
                  template: `<div >
                                <div id=mytextarea ></div>
                                 <slot  :text2="text"></slot>
                             </div>`
                 ,
                 mounted: function() {
                     var mm = this
                     var editor = ace.edit(           "mytextarea", {
                                                             mode:           "ace/mode/javascript",
                                                             selectionStyle: "text"
                                                         })
                     document.getElementById("mytextarea").style.width="100%"

                     document.getElementById("mytextarea").style.height="50%"
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
