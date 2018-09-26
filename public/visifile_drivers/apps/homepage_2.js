async function(args) {
/*
created_timestamp(1534877333570)
base_component_id("homepage_2")
read_only(true)
editors([
  "simple_display_editor_component"
])
formEditor({
  "next_id": 7,
  "fields": [
    {
      "id": 5,
      "type": "text",
      "text": "Apps can be built by beginners or IT experts:",
      "style": {
        "bold": true,
        "size": 19
      }
    },
    {
      "id": 1,
      "type": "text",
      "text": "For simple text apps like this, there is a point and click builder",
      "style": {
        "bullet": true,
        "size": 18
      }
    },
    {
      "id": 6,
      "type": "text",
      "text": "And for more advanced apps you can use Javascript to build them",
      "style": {
        "bullet": true,
        "size": 18
      }
    }
  ]
})//formEditor
display_name("Homepage 2")
is_app(true)
description('Homepage 2')
logo_url("data:image/jpeg;base64,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")
*/

    //** gen_start **//
                var uid2 = uuidv4()
                var mm = null
                var texti = null
                var designMode = false
                var runtimeMode = true
                Vue.component('homepage_2', {
      template: `<div >
                    <h4 v-if='design_mode'>Simple text app designer</h4>

                    <div v-bind:id='uid2' v-on:click='$event.stopPropagation();current_edited_item = null'
                         style='width:95%; height: 45vh;overflow-y:scroll;'>
                        <div v-for='(field,index) in model.fields' style='padding: 5px;'>
                            <div class='container'>
                                <div class='row' v-on:click='if (design_mode) {$event.stopPropagation();current_edited_item = field.id}'>

                                    <div class='col-md-12' v-if='field.type=="text" && (current_edited_item != field.id)' v-bind:style='"border-radius: 5px; padding:2px; background: " + (current_edited_item == field.id?"whitesmoke":"")'>
                                        <div v-bind:style='getStyle(field.id)'>
                                            <span v-if='getFieldCssStyle(field.id,"bullet")'>&#9679; </span>{{field.text}}
                                        </div>
                                    </div>
                                    <textarea @change='generateCodeFromModel(model  )' class='col-md-6' v-if='field.type=="text" && (current_edited_item == field.id)'
                                            v-bind:style='"border-radius: 25px; padding:20px; background: " + (current_edited_item == field.id?"whitesmoke":"") + ";" + getStyle(field.id)' v-model='field.text'>
                                            </textarea>
                                    <div class='col-md-2'></div>
                                    </div>
                                    <div class='col-md-6' v-if='(current_edited_item == field.id) && design_mode' style='border-radius: 5px; padding:2px; background:beige'  >
                                        <button v-bind:class='fieldSize(field.id)>5?"active":""'  type=button class='btn btn-sm btn-info'      v-on:click='$event.stopPropagation();updateFieldCssStyle(field.id, "size",fieldSize(field.id)-1) '  > - </button>
                                        <button v-bind:class='fieldSize(field.id)<50?"active":""'  type=button class='btn btn-sm btn-info'      v-on:click='$event.stopPropagation();updateFieldCssStyle(field.id, "size",fieldSize(field.id)+1)'  > + </button>
                                        <button v-bind:class='getFieldCssStyle(field.id,"bold")?"active":""'  type=button class='btn btn-sm btn-info'      v-on:click='$event.stopPropagation();updateFieldCssStyle(field.id, "bold",getFieldCssStyle(field.id,"bold")?false:true)'  > B </button>
                                        <button v-bind:class='getFieldCssStyle(field.id,"bold")?"active":""'  type=button class='btn btn-sm btn-info'      v-on:click='$event.stopPropagation();updateFieldCssStyle(field.id, "bullet",getFieldCssStyle(field.id,"bullet")?false:true)'  > &#9679;  </button>
                                        <button class='xs-4'  type=button class='btn btn-sm btn-info'  v-bind:disabled='index==0'    v-on:click='$event.stopPropagation();moveUp(field.id)'  > &uarr; </button>
                                        <button class='xs-4'  type=button class='btn btn-sm btn-info'  v-bind:disabled='index==(model.fields.length - 1)'    v-on:click='$event.stopPropagation();moveDown(field.id)'  > &darr; </button>
                                        <button class='xs-4'  type=button class='btn btn-sm btn-info'  v-on:click='$event.stopPropagation();deleteField(field.id)'  > Delete </button>
                                    </div>
                                </div>
                            </div>
                        <button  v-if='design_mode' type=button class='btn btn-info'      v-on:click='addField()'  >Add field</button>
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
                mm.edited_app_component_id = saveHelper.getValueOfCodeString(texti, "base_component_id")

                this.generateCodeFromModel(  json2  )

                this.read_only = saveHelper.getValueOfCodeString(texti, "read_only")
             //alert(this.text)
           }



           //editor.getSession().on('change', function() {
           //mm.text = editor.getSession().getValue();
           //alert("changed text to : " + mm.text)
           //   });
     },




     methods: {


        addField: function() {
            mm.model.fields.push({   id: mm.model.next_id,   type: "text",   text: "Enter text here",
                                      style: {}})
            mm.model.next_id ++
            this.generateCodeFromModel(  mm.model  )
            //alert("Added: " + JSON.stringify(mm.model,null,2))
        },

        getFieldCssStyle: function(   fieldId   , styleName) {
            var mm = this
            var itemD = null
            for (var tt=0; tt < mm.model.fields.length ; tt++) {
                var ciurr = mm.model.fields[tt]
                if (ciurr.id == fieldId) {
                    if (!ciurr.style) {
                        ciurr.style = {}
                        return null
                    }
                    if (ciurr.style[styleName]) {
                        return ciurr.style[styleName]
                    }
                    return null
                }
            }
            return null
        },


        fieldSize: function(fieldId) {
            var mm = this
            if (mm.getFieldCssStyle(fieldId,"size") == null) {
                return 16
            }
            return this.getFieldCssStyle(fieldId,"size")
        },


        updateFieldCssStyle: function(   fieldId   , styleName, styleValue) {
            var itemD = null
            var mm = this
            for (var tt=0; tt < mm.model.fields.length ; tt++) {
                var ciurr = mm.model.fields[tt]
                if (ciurr.id == fieldId) {
                    if (!ciurr.style) {
                        ciurr.style = {}
                    }
                    ciurr.style[styleName] = styleValue
                }
            }
            this.generateCodeFromModel(  mm.model  )
        },


        getStyle: function(fieldId) {
            var mm = this
            var styleT = ""
            for (var tt = 0; tt < mm.model.fields.length ; tt++) {
                var ciurr = mm.model.fields[tt]
                if (ciurr ) {
                    if (ciurr.id == fieldId) {
                        if (!ciurr.style) {
                            return ""
                        }
                        var fg = ciurr.style
                        if (fg.bold){
                            styleT += "font-weight: bold;"
                        }
                        styleT += "font-size: " + mm.fieldSize(fieldId) + "px;"
                        return styleT
                    }
                }
            }
            return ""
        },


        moveUp: function(   fieldId   ) {
            var itemD = null
            for (var tt=0; tt < mm.model.fields.length ; tt++) {
                var ciurr = mm.model.fields[tt]
                if (ciurr.id == fieldId) {
                    itemD = ciurr
                }
            }
            if (itemD) {
                var index = mm.model.fields.indexOf(  itemD  );
                if (index > -1) {
                  mm.model.fields.splice(index, 1);
                  mm.model.fields.splice(index - 1, 0, itemD);
                }

            }

            this.generateCodeFromModel(  mm.model  )
        },

        moveDown: function(   fieldId   ) {
            var itemD = null
            for (var tt=0; tt < mm.model.fields.length ; tt++) {
                var ciurr = mm.model.fields[tt]
                if (ciurr.id == fieldId) {
                    itemD = ciurr
                }
            }
            if (itemD) {
                var index = mm.model.fields.indexOf(  itemD  );
                if (index > -1) {
                  mm.model.fields.splice(index, 1);
                  mm.model.fields.splice(index + 1, 0, itemD);
                }

            }

            this.generateCodeFromModel(  mm.model  )
        },

        deleteField: function(   fieldId   ) {
            var itemD = null
            for (var tt=0; tt < mm.model.fields.length ; tt++) {
                var ciurr = mm.model.fields[tt]
                if (ciurr.id == fieldId) {
                    itemD = ciurr
                }
            }
            if (itemD) {
                var index = mm.model.fields.indexOf(  itemD  );
                if (index > -1) {
                  mm.model.fields.splice(index, 1);
                }
            }

            this.generateCodeFromModel(  mm.model  )
            //alert("Added: " + JSON.stringify(mm.model,null,2))
        },
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
            var startIndex = this.text.indexOf("//** gen_" + "start **//")
            var endIndex = this.text.indexOf("//** gen_" + "end **//")

            //zzz
            var sql =    "select  cast(code as text)  as  code  from  system_code  where " +
                         "        base_component_id = 'simple_display_editor_component'   and   code_tag = 'LATEST' "

            var results = await callApp({ driver_name:    "systemFunctions2",method_name:    "sql"},
                {   sql: sql  })

            var editorCode = results[0].code
            var stt = "//*** COPY_" + "START ***//"
            var editorCodeToCopyStart = editorCode.indexOf(stt) + stt.length
            var editorCodeToCopyEnd = editorCode.indexOf("//*** COPY_" + "END ***//")
            var editorCodeToCopy = editorCode.substring(editorCodeToCopyStart, editorCodeToCopyEnd)
            console.log(editorCodeToCopy)
            //alert(JSON.stringify(mm.model,null,2))

            this.text = this.text.substring(0,startIndex) +

                `//** gen_start **//
                var uid2 = uuidv4()
                var mm = null
                var texti = null
                var designMode = false
                var runtimeMode = true
                Vue.component('${this.edited_app_component_id}', {`

                + editorCodeToCopy +

                `,
                data: function () {
                  return {
                      design_mode: designMode,
                      runtime_mode: runtimeMode,
                      current_edited_item: null,
                      text: texti,
                      uid2: uid2,
                      model: `

                      + JSON.stringify(mm.model,null,2) +

                  `}
                }
              })`

              +
              this.text.substring(endIndex)
              //console.log(this.text)

              this.text = saveHelper.deleteCodeString(  this.text, "formEditor", ")//form" + "Editor")

              this.text = saveHelper.insertCodeString(  this.text,
                                                        "formEditor",
                                                        mm.model,
                                                        ")//form" + "Editor")
        }

     }
     ,
                data: function () {
                  return {
                      design_mode: designMode,
                      runtime_mode: runtimeMode,
                      current_edited_item: null,
                      text: texti,
                      uid2: uid2,
                      model: {
  "next_id": 7,
  "fields": [
    {
      "id": 5,
      "type": "text",
      "text": "Apps can be built by beginners or IT experts:",
      "style": {
        "bold": true,
        "size": 19
      }
    },
    {
      "id": 1,
      "type": "text",
      "text": "For simple text apps like this, there is a point and click builder",
      "style": {
        "bullet": true,
        "size": 18
      }
    },
    {
      "id": 6,
      "type": "text",
      "text": "And for more advanced apps you can use Javascript to build them",
      "style": {
        "bullet": true,
        "size": 18
      }
    }
  ]
}}
                }
              })//** gen_end **//
}
