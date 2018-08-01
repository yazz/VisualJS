async function component( args ) {
/*
base_component_id("form_editor_component")
load_once_from_file(true)
*/

    //alert(JSON.stringify(args,null,2))
    var uid2 = uuidv4()
    var mm = null
    var texti = null
    if (args) {
        texti = args.text
    }
    var designMode = true
    Vue.component("form_editor_component",
    //*** COPY_START ***//
    {
      data: function () {
        return {
            design_mode: designMode,
            text: texti,
            uid2: uid2,
            model: {
                fields: [
                        {type: "text",   text: "Subscribe to the Appshare newsletter" },

                        {type: "input",  label: "name" },
                        {type: "input",  label: "address" }
                    ]
            }
        }
      },
      template: `<div><div v-if='design_mode'  class='display-4'>Form editor</div>
                    <div v-bind:id='uid2' >
                        <div v-for='field in model.fields'>
                            <div v-if='field.type=="text"'>{{field.text}}</div>
                            <div v-if='field.type=="input"'>{{field.label}}<input></input></div>
                        </div>
                        <button  v-if='design_mode' type=button class='btn btn-primary'      v-on:click='chooseApp()'  >+ field</button>
                    </div>
                    <hr />


                     <slot v-if='text' :text2="text"></slot>
                 </div>`
     ,

     mounted: function() {
         mm = this
         document.getElementById(uid2).style.width="100%"

         document.getElementById(uid2).style.height="45vh"

         if (texti) {
             var json2 = this.getJsonModelFromCode(  texti  )
             mm.model = json2
             this.generateCodeFromModel(  json2  )
             //alert(this.text)
         }



         //editor.getSession().on('change', function() {
            //mm.text = editor.getSession().getValue();
            //alert("changed text to : " + mm.text)
         //   });
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
        generateCodeFromModel: async function(  jsonModel  ) {
            var startIndex = this.text.indexOf("//** gen_start **//")
            var endIndex = this.text.indexOf("//** gen_end **//")

            //zzz
            var sql =    "select  cast(code as text)  as  code  from  system_code  where " +
                         "        base_component_id = 'form_editor_component'   and   code_tag = 'LATEST' "

            var results = await callApp({ driver_name:    "systemFunctions2",method_name:    "sql"},
                {   sql: sql  })

            var editorCode = results[0].code
            var stt = "//*** COPY_" + "START ***//"
            var editorCodeToCopyStart = editorCode.indexOf(stt) + stt.length
            var editorCodeToCopyEnd = editorCode.indexOf("//*** COPY_" + "END ***//")
            var editorCodeToCopy = editorCode.substring(editorCodeToCopyStart, editorCodeToCopyEnd)
            //console.log(editorCodeToCopy)

            this.text = this.text.substring(0,startIndex) +
                "//** gen_start **//\n" +
                "var uid2 = uuidv4()\n" +
                "var mm = null\n" +
                "var texti = null\n" +
                "var designMode = false\n" +
                "Vue.component('form_subscribe_to_appshare', " +

                editorCodeToCopy +
              ")\n" +
              this.text.substring(endIndex)
              console.log(this.text)
        }

     }


    }
    //*** COPY_END ***//
    )

}
