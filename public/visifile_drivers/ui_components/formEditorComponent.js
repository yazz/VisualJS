function component( args ) {
/*
base_component_id("form_editor_component")
load_once_from_file(true)
*/

    //alert(JSON.stringify(args,null,2))
    var uid2 = uuidv4()
    var mm = null
    var texti = args.text
    Vue.component("form_editor_component", {
      data: function () {
        return {
            text: texti,
            uid2: uid2,
            model: {}
        }
      },
      template: `<div>Form editor
                    <div v-bind:id='uid2' >
                        {{JSON.stringify(model,null,2)}}
                    </div>
                    <hr />


                     <slot  :text2="text"></slot>
                 </div>`
     ,

     mounted: function() {
         mm = this
         document.getElementById(uid2).style.width="100%"

         document.getElementById(uid2).style.height="45vh"

         var json2 = this.getJsonModelFromCode(  texti  )
         mm.model = json2
         this.generateCodeFromModel(  json2  )
         //alert(this.text)



         editor.getSession().on('change', function() {
            //mm.text = editor.getSession().getValue();
            //alert("changed text to : " + mm.text)
            });
     },
     methods: {
        getText: function() {
            return this.text
        },
        setText: function(textValue) {
            this.text =  textValue
            var json2 = this.getJsonModelFromCode(  textValue  )
            mm.model = json2
            this.generateCodeFromModel(  json2  )
        }
        ,
        getJsonModelFromCode: function(  codeV  ) {
            var json2 = saveHelper.getValueOfCodeString(codeV,"formEditor",")//formEditor")
            return json2
        }

        ,
        generateCodeFromModel: function(  jsonModel  ) {
            var startIndex = this.text.indexOf("//** gen_start **//")
            var endIndex = this.text.indexOf("//** gen_end **//")
            this.text = this.text.substring(0,startIndex) +
                "//** gen_start **//\n" +
                `Vue.component('form_subscribe_to_appshare', {
                  template: \`<div>new form</div>\`
                  })` +
                this.text.substring(endIndex)
        }

     }


    })

}
