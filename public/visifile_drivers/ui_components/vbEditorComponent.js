async function component( args ) {
/*
base_component_id("vb_editor_component")
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
    var runtimeMode = false
    Vue.component("vb_editor_component",
    {
    //*** COPY_START ***//
      template: `<div >
                    <div>
                        <h4 style='display: inline-block; margin-right: 10px; ' v-if='design_mode' >VB app designer</h4>
                        <slot style='display: inline-block;' v-if='text' :text2="text"></slot>
                    </div>

                    <div>
                        <div v-if='design_mode' v-on:drop="drop($event)" v-on:dragover="allowDrop($event)" v-bind:style='(design_mode?"border: 1px solid black;":"") + " width: 200px;height: 55vmin; display: inline-block;overflow-x: none;overflow-y: scroll;vertical-align: top; "'>
                            <div v-for='av in available_components' draggable="true" v-on:dragstart='drag($event,av.base_component_id)'  style='height: 50px; border: 5px;'>
                                <img v-bind:src='av.logo_url' style='width: 50px; height: auto; max-height: 50px;'></img>
                                {{av.base_component_id}}
                            </div>
                        </div>

                        <div   v-on:drop="drop($event)"
                                        v-on:ondragover="allowDrop($event)"
                                        v-bind:style='"display: inline-block; vertical-align: top; position: relative; width: 55vmin;height: 55vmin; ;" + (design_mode?"background: hsla(209, 100%, 47%, 0.1);background-image: radial-gradient(hsla(209, 100%, 47%, 1.00) 5%, transparent 0);background-size: 15px 15px;border: 1px solid black;":"" ) '>

                             <div v-bind:refresh='refresh' v-for='item in model.components'
                                  v-bind:style='(design_mode?"border: 1px solid black;":"") + "position: absolute;top: " + item.topY + ";left:" + item.leftX + ";height:100px;width:100px;background: white;;overflow:auto;"'>
                                    <component  v-bind:refresh='refresh' v-bind:is='item.base_component_id'></component>
                                  </div>
                        </div>
                    </div>





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
                                    <textarea v-on:keyup='generateCodeFromModel(model  )' class='col-md-6' v-if='field.type=="text" && (current_edited_item == field.id)'
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


                 </div>`
        ,





        mounted: async function() {
            mm = this

            document.getElementById(uid2).style.width="100%"

            document.getElementById(uid2).style.height="45vh"

            if (texti) {
                var json2 = this.getJsonModelFromCode(  texti  )
                mm.model = json2
                mm.edited_app_component_id = saveHelper.getValueOfCodeString(texti, "base_component_id")

                //this.generateCodeFromModel(  json2  )

                this.read_only = saveHelper.getValueOfCodeString(texti, "read_only")
             //alert(this.text)
           }

           for (var rtw = 0; rtw < mm.model.components.length ; rtw++ )
           {
                var newItem = mm.model.components[rtw]
                //alert(newItem.base_component_id)
                await load(newItem.base_component_id)
           }



           //editor.getSession().on('change', function() {
           //mm.text = editor.getSession().getValue();
           //alert("changed text to : " + mm.text)
           //   });

           var sql =    "select  *  from  system_code  where " +
                        "        code_tag = 'LATEST' and logo_url is not null"

           var results = await callApp({ driver_name:    "systemFunctions2",method_name:    "sql"},
               {   sql: sql  })

           mm.available_components = results


           mm.$forceUpdate();
     },




     methods: {
     allowDrop: function(ev) {
         ev.preventDefault();
     },

     drag: function(ev,name) {
         //alert(JSON.stringify(ev,null,2))
         ev.dataTransfer.setData("text", name);
     },

     drop: async function (ev) {
     //alert(21)
         var data = ev.dataTransfer.getData("text");
         var newItem = new Object()

         var doc = document.documentElement;
         var left = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
         var top = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);
         var rrr = ev.target.getBoundingClientRect()
         //alert(JSON.stringify(rrr,null,2))

         newItem.leftX = event.clientX  - rrr.left ;
         newItem.topY = event.clientY  - rrr.top;
         newItem.base_component_id = data
         this.refresh++
         await load(newItem.base_component_id)
         this.model.components.push(newItem)
         //+ ") =" + JSON.stringify(data,null,2));
         ev.preventDefault();
         this.generateCodeFromModel(  mm.model  )

     },


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
                         "        base_component_id = 'vb_editor_component'   and   code_tag = 'LATEST' "

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
     //*** COPY_END ***//
     ,
     data: function () {
       return {
           design_mode:                 designMode,
           runtime_mode:                runtimeMode,
           edited_app_component_id:     null,
           current_edited_item:         null,
           text:                        texti,
           uid2:                        uid2,
           refresh:                     0,
           read_only:                   false,
           available_components:        [],

           model:                      {
                                            next_id: 1,

                                            fields: [

                                                    ],

                                            components: [

                                                        ]
                                        }
       }
     }


    }
    )

}
