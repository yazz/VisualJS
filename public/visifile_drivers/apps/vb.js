async function(args) {
/*
created_timestamp(1537522006661)
base_component_id("vb")
visibility("PUBLIC")

editors([
  "vb_editor_component"
])
properties([
  {
    "id": "test",
    "name": "test",
    "type": "String"
  }
])//properties
formEditor({
  "next_id": 7,
  "max_form": 3,
  "active_form": "Form_1",
  "default_form": "Form_1",
  "app_selected": false,
  "id": "vb",
  "next_component_id": 102,
  "app_properties": [
    {
      "id": "test",
      "name": "test",
      "type": "String"
    }
  ],
  "forms": {
    "Form_1": {
      "name": "Form_1",
      "width": 372.875,
      "height": 355,
      "components": [
        {
          "name": "todoInputBox",
          "base_component_id": "input_control",
          "leftX": 8,
          "topY": 49,
          "width": 238,
          "height": 40,
          "text": "",
          "label": "",
          "placeholder": "",
          "background_color": ""
        },
        {
          "name": "add_todo_button",
          "base_component_id": "button_control",
          "leftX": 280,
          "topY": 49,
          "width": 85,
          "height": 41,
          "text": "Add",
          "click_event": "var ins =\ntodoInputBox.text\ntodoInputBox.text = \"\"\nawait sql(\"insert into items (id,name) values (?,?)\",\n[\nnew Date().getTime(),\nins])\ndisplay_out.text = await sqlFirstCol(\"select name from items\")",
          "background_color": ""
        },
        {
          "name": "button_control_2",
          "base_component_id": "button_control",
          "leftX": 225,
          "topY": 295,
          "width": 143,
          "height": 54,
          "text": "Go to  form 2",
          "click_event": "mm.selectForm(\"Form_2\")",
          "background_color": "blue"
        },
        {
          "leftX": -0.4375,
          "topY": 105,
          "name": "display_out",
          "base_component_id": "label_control",
          "width": 365,
          "height": 178,
          "text": "",
          "background_color": ""
        },
        {
          "leftX": 134.5625,
          "topY": 4,
          "name": "title_label",
          "base_component_id": "label_control",
          "width": 112,
          "height": 34,
          "text": "Todo App",
          "background_color": ""
        }
      ],
      "form_activate_old": "function() {\n                if (app && app.forms && app.forms[\"Form_1\"] && app.forms[\"Form_1\"].components[0]) {\n                    app.forms[\"Form_1\"].components[0].text = args.test\n                }\n             }",
      "form_activate": "display_out.text = await sqlFirstCol(\"select name from items\")"
    },
    "Form_2": {
      "name": "Form_2",
      "width": "300px",
      "height": "300px",
      "components": [
        {
          "name": "label_control_1",
          "base_component_id": "label_control",
          "leftX": 200,
          "topY": 100,
          "width": 100,
          "height": 100,
          "text": "Hello world"
        },
        {
          "name": "button_control_2",
          "base_component_id": "button_control",
          "leftX": 10,
          "topY": 10,
          "width": 200,
          "background_color": "blue",
          "height": 100,
          "text": "Go to Form 1",
          "click_event": "mm.selectForm(\"Form_1\")"
        }
      ]
    }
  },
  "active_component_index": null
})//formEditor
read_only(true)






display_name("Homepage 5")
is_app(true)
description('Homepage 5')
logo_url("data:image/jpeg;base64,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")
*/

    //** gen_start **//
                var mm = null
                var texti = null
                var designMode = false
                var runtimeMode = true
                Vue.component('vb', {
      props: [ "args"],
      template: `<div   v-bind:id='uid2'
                        v-if='uid2 != null'
                        style='width: 100%; height: 45vh;'
                        >
                    <div>
                        <h4 style='display: inline-block; margin-right: 10px; ' v-if='design_mode' >VB app designer</h4>
                        <slot style='display: inline-block;' v-if='text' :text2="text"></slot>
                    </div>


                    <div    v-bind:id='vb_editor_element_id' v-if='vb_editor_element_id != null'
                            style='position:relative'
                            v-on:drop="dropEditor($event)"
                            v-on:ondragover="allowDropEditor($event)"
                    >

                        <div    v-if='design_mode'
                                v-bind:style='(design_mode?"border: 1px solid black;":"") + " width: " + leftHandWidth + "px;height: 55vmin; display: inline-block;overflow-x: none;overflow-y: scroll;vertical-align: top; "'>

                            <div    v-for='av in available_components'
                                    draggable="true"
                                    v-on:dragstart='drag($event,{
                                                           type:   "add_component",
                                                           text:    av.base_component_id
                                                        })'
                                    style='width:100%;height: 55px; margin: 4px;border: 1px solid gray;overflow-x:auto;overflow-y:hidden'>

                                <img v-bind:src='av.logo_url' style='display:inline-block;max-width: 50px; width: auto;height: auto; max-height: 50px;'></img>
                                <div style='width:100%;display:inline-block;overflow: hidden;'>{{av.base_component_id}}</div>
                            </div>
                        </div>


                        <div            v-bind:id='vb_grid_element_id'  v-if='vb_grid_element_id != null'
                                        v-on:drop="drop($event)"
                                        v-on:ondragover="allowDrop($event)"
                                        v-bind:class='(design_mode?"dotted":"" )'
                                        v-on:click='if (design_mode) {$event.stopPropagation();selectForm(model.active_form)}'
                                        v-bind:style='"display: inline-block; vertical-align: top; position: relative; width: " + model.forms[model.active_form].width +  ";height: " + model.forms[model.active_form].height +  " ;" + (design_mode?"border: 1px solid black;":"" ) '>



                                        <div    v-if='design_mode'
                                                v-bind:refresh='refresh'
                                                style='opacity:0.5;position: absolute; bottom: 0px; right: 0px;z-index: 30000000;width: 20px;height: 20px;background-color: gray;'
                                                v-bind:draggable='true'
                                                v-on:dragstart='drag($event,{
                                                   type:        "resize_form_bottom_right",
                                                   form_name:    model.active_form
                                                })'>
                                             <div    style='position: absolute; bottom: 0px; right: 0px;z-index: 30000000;width: 40px;height: 1px;background-color: black;'></div>
                                             <div    style='position: absolute; bottom: 0px; right: 0px;z-index: 30000000;width: 1px;height: 40px;background-color: black;'></div></div>

                             <div       v-bind:refresh='refresh'
                                        v-for='(item,index) in getActiveFormComponents()'
                                        ondrop="return false;"
                                        v-on:click='$event.stopPropagation();select_component(index)'
                                        v-bind:style='(design_mode?"border: " +
                                                        ((index == model.active_component_index)?"1px solid black;":"1px solid black;"):"") +
                                                        "position: absolute;top: " + item.topY + ";left:" + item.leftX + ";height:" + item.height + "px;width:" + item.width + "px;background: white;;overflow:none;"'>

                                    <div ondrop="return false;" v-bind:style='"position: absolute; top: 0px; left: 0px;height:" + item.height + "px;width:" + item.width + "px;overflow:auto;"'>
                                        <component  v-bind:id='model.active_form + "_" + model.forms[model.active_form].components[index].name + (design_mode?"_deisgn":"")'
                                                    v-bind:refresh='refresh'
                                                    v-on:send="processControlEvent"
                                                    v-bind:is='item.base_component_id'
                                                    v-bind:name='item.name + (design_mode?"_deisgn":"")'
                                                    v-bind:args='model.forms[model.active_form].components[index]'>
                                                    </component>
                                    </div>
                                    <div    style='position: absolute; top: 0px; left: 0px;z-index: 10000000;width: 100%;height: 100%;border: 1px solid black;'
                                            v-bind:draggable='design_mode'
                                            v-if='design_mode'
                                            ondrop="return false;"
                                            v-on:dragstart='drag($event,{
                                               type:   "move_component",
                                               text:    item.base_component_id,
                                               index:   index
                                            })'
                                    >

                                            <div    v-if='design_mode'
                                                    ondrop="return false;"
                                                    v-bind:refresh='refresh'
                                                    v-bind:style='"position: absolute; top: 0px; left: 0px;z-index: 10000000;width: 100%;height: 100%; background-color: lightgray;" +
                                                                    ((index == model.active_component_index)?"opacity: 0;":"opacity: .6;") '
                                                    >

                                            </div>
                                    </div>
                                    <div    v-if='design_mode'
                                            v-bind:refresh='refresh'
                                            style='opacity:0.5;position: absolute; top: 0px; left: 0px;z-index: 30000000;width: 20px;height: 20px;background-color: gray;'
                                            v-bind:draggable='true'
                                            ondrop="return false;"
                                            v-on:dragstart='drag($event,{
                                               type:   "resize_top_left",
                                               text:    item.base_component_id,
                                               index:   index
                                            })'
                                     >
                                         <div    style='position: absolute; top: 0px; left: 0px;z-index: 30000000;width: 40px;height: 1px;background-color: black;'></div>
                                         <div    style='position: absolute; top: 0px; left: 0px;z-index: 30000000;width: 1px;height: 40px;background-color: black;'></div>
                                    </div>


                                    <div    v-if='design_mode'
                                            v-bind:refresh='refresh'
                                            style='opacity:0.5;position: absolute; top: 0px; right: 0px;z-index: 30000000;width: 20px;height: 20px;background-color: gray;'
                                            v-bind:draggable='true'
                                            v-on:dragstart='drag($event,{
                                               type:   "resize_top_right",
                                               text:    item.base_component_id,
                                               index:   index
                                            })'>
                                         <div    style='position: absolute; top: 0px; right: 0px;z-index: 30000000;width: 40px;height: 1px;background-color: black;'></div>
                                         <div    style='position: absolute; top: 0px; right: 0px;z-index: 30000000;width: 1px;height: 40px;background-color: black;'></div></div>



                                     <div    v-if='design_mode'
                                             v-bind:refresh='refresh'
                                             style='opacity:0.5;position: absolute; bottom: 0px; left: 0px;z-index: 30000000;width: 20px;height: 20px;background-color: gray;'
                                             v-bind:draggable='true'
                                             v-on:dragstart='drag($event,{
                                                type:   "resize_bottom_left",
                                                text:    item.base_component_id,
                                                index:   index
                                             })'>
                                          <div    style='position: absolute; bottom: 0px; left: 0px;z-index: 30000000;width: 40px;height: 1px;background-color: black;'></div>
                                          <div    style='position: absolute; bottom: 0px; left: 0px;z-index: 30000000;width: 1px;height: 40px;background-color: black;'></div></div>



                                          <div    v-if='design_mode'
                                                  v-bind:refresh='refresh'
                                                  style='opacity:0.5;position: absolute; bottom: 0px; right: 0px;z-index: 30000000;width: 20px;height: 20px;background-color: gray;'
                                                  v-bind:draggable='true'
                                                  v-on:dragstart='drag($event,{
                                                     type:   "resize_bottom_right",
                                                     text:    item.base_component_id,
                                                     index:   index
                                                  })'>
                                               <div    style='position: absolute; bottom: 0px; right: 0px;z-index: 30000000;width: 40px;height: 1px;background-color: black;'></div>
                                               <div    style='position: absolute; bottom: 0px; right: 0px;z-index: 30000000;width: 1px;height: 40px;background-color: black;'></div></div>


                                         <div    v-if='design_mode'
                                                 v-bind:refresh='refresh'
                                                 style='opacity:0.5;position: absolute; bottom: 0px; right: 20px;z-index: 30000000;width: 20px;height: 20px;background-color: red;'
                                                 v-on:click='$event.stopPropagation();deleteComponent(index)'>
                                                        <div style='text-align: center;vertical-align: middle;'>X</div>
                                                 </div>




                              </div>




                      </div>





                      <div    v-if='design_mode'
                              v-bind:style='(design_mode?"border: 1px solid black;":"") + " position:absolute;top:0px;right:0px;width: 250px;height: 55vmin; display: inline-block;overflow-x: none;overflow-y: scroll;vertical-align: top; "'
                              v-bind:refresh='refresh'>

                          <div    v-bind:refresh='refresh'
                                  style='height: 50%;  padding:5px; border: 1px solid black;'>





                                  <div style='height:30%;'>

                                        Project explorer

                                        <button type=button class='btn btn-sm btn-info'
                                                v-on:click='$event.stopPropagation();addForm()'  >

                                                    Add form
                                        </button>
                                  </div>





                                  <div    v-bind:refresh='refresh'
                                          style='height:70%;overflow-y:scroll; padding:5px; '>

                                      <div    v-bind:style='"background-color:black;color:white;padding:4px;margin:0px;margin-top: 5px;" + (model.app_selected?"border: 3px solid red":"")'
                                              v-on:click='$event.stopPropagation();select_app()'>
                                                      {{edited_app_component_id}}
                                      </div>

                                      <div v-for='form in getForms()' v-bind:refresh='refresh'>
                                          <div>
                                              <div  v-bind:style='(((form.name == model.active_form) && (model.active_component_index == null) && (!model.app_selected)) ?"border: 3px solid red;background-color:gray;color:white;":"color:black;") + "padding:4px;margin:0px;margin-left:30px;"'
                                                    v-on:click='$event.stopPropagation();selectForm(form.name)'>
                                                            {{form.name}}
                                              </div>

                                              <div    v-if='form.name == model.active_form'
                                                      v-for='(av,index) in getActiveFormComponents()'
                                                      v-on:click='$event.stopPropagation();select_component(index)'
                                                      v-bind:style='(((index == model.active_component_index) && design_mode)?"border: 3px solid red;background-color: lightgray;":"") + "margin-left:60px; padding:2px;"'
                                                      >
                                                      <div style='width:100%;display:inline-block;overflow: hidden;'>{{av.name}}</div>
                                              </div>
                                         </div>
                                     </div>
                          </div>


                      </div>

                      <div  class='container'
                                v-bind:refresh='refresh'
                              style='position:absolute;height: 50%; overflow-y:scroll;padding:5px; border: 1px solid black;bottom:0px;'>
                              Properties
                              <button  v-if='model.app_selected'  type=button class='btn btn-sm btn-info'  v-on:click='$event.stopPropagation();addProperty()'  > Add property </button>
                              <div v-if='(model.app_selected) && (add_property)'>
                                Add a property
                                <div class='row'>
                                    <div class='col-md-4'>ID</div>
                                    <input class='col-md-7 small'  v-model='new_property_id'> </input>
                                </div>
                                <div class='row'>
                                    <div class='col-md-4'>Name</div>
                                    <input class='col-md-7 small'  v-model='new_property_name'></input>
                                </div>
                                <button  type=button class='btn btn-sm btn-info'  v-on:click='$event.stopPropagation();addPropertyCancel()'  > Cancel </button>
                                <button  type=button class='btn btn-sm btn-info'  v-on:click='$event.stopPropagation();addPropertySave()'  > Save </button>
                              </div>

                              <div v-bind:refresh='refresh' v-for='property in properties' >
                                <br>
                                <div class='row'>
                                    <div  class='col-md-4 small'   >{{property.name}}</div>
                                    <div class='col-md-7 small' >
                                        <div v-if='!property.readonly'>
                                            <div v-if="(property.type  == 'String')  || (property.type  == 'Number')">
                                                <input v-bind:refresh='refresh' class='col-md-12 small'  @change='setVBEditorProperty($event, property)' v-bind:value='getVBEditorProperty(property)'></input>
                                            </div>
                                            <div v-if="(property.type  == 'Event')  ">
                                                <textarea   class="form-control" v-bind:refresh='refresh'
                                                            v-if='(model.active_component_index == null) && (model.active_form != null)'
                                                            @change='generateCodeFromModel(   )'
                                                            rows=10
                                                            v-model='model.forms[model.active_form][property.id]'></textarea>
                                                <textarea   class="form-control" v-bind:refresh='refresh'
                                                            v-if='(model.active_component_index != null) && (model.active_form != null)'
                                                            @change='generateCodeFromModel(   )'
                                                            rows=10
                                                            v-model='model.forms[model.active_form].components[model.active_component_index][property.id]'></textarea>
                                            </div>
                                        </div>
                                        <div v-if='property.readonly'>
                                            <div v-bind:refresh='refresh' v-if='model.active_component_index != null' class='col-md-12 small'  >{{model.forms[model.active_form].components[model.active_component_index][property.id]}}</div>
                                            <div v-bind:refresh='refresh' v-if='(model.active_component_index == null) && (model.active_form != null) && (model.app_selected == false)' class='col-md-12 small'   v-model='model.forms[model.active_form][property.id]'></div>
                                            <div v-bind:refresh='refresh' v-if='model.app_selected' class='col-md-12 small'  >
                                                {{property.get_fn?property.get_fn():model[property.id]}}
                                                </div>
                                        </div>
                                    </div>
                                </div>
                      </div>


                    </div>`
        ,





        mounted: async function() {
            var mm = this

            mm.uid2 =                       uuidv4()
            mm.vb_grid_element_id =          "vb_grid_"+ uuidv4()
            mm.vb_editor_element_id =         "vb_editor_"+ uuidv4()



            //
            // get the base component ID of the code to edit/run
            //
            if (texti) {
                var json2 = this.getJsonModelFromCode(  texti  )
                mm.model = json2
                mm.edited_app_component_id = saveHelper.getValueOfCodeString(texti, "base_component_id")

                //this.generateCodeFromModel(   )

                this.read_only = saveHelper.getValueOfCodeString(texti, "read_only")
             //alert(this.text)
           }

           mm.model.active_form = mm.model.default_form

           //
           // load the default form
           //
           for (var rtw = 0; rtw < mm.model.forms[mm.model.active_form].components.length ; rtw++ )
           {
                var newItem = mm.model.forms[mm.model.active_form].components[rtw]
                //alert(newItem.base_component_id)
                await load(newItem.base_component_id)
                var compEvaled = await this.getComponentProperties(this.model.forms[this.model.active_form].components[rtw].base_component_id)
                for (var cpp = 0 ; cpp< compEvaled.length; cpp ++){
                    var prop = compEvaled[cpp].id
                    if (!isValidObject(this.model.forms[mm.model.active_form].components[rtw][prop])){
                        this.model.forms[mm.model.active_form].components[rtw][prop] = ""
                    }
                }

           }



           //
           // get the availabe compoents
           //
           var sql =    "select  *  from  system_code  where " +
                        "        code_tag = 'LATEST' and logo_url is not null"

           var results = await callApp({ driver_name:    "systemFunctions2",method_name:    "sql"},
               {   sql: sql  })

           mm.available_components = results
           this.updateAllFormCaches()




           this.selectForm(mm.model.default_form)


           mm.$forceUpdate();




     },





     methods: {
         getActiveFormComponents: function() {
             return this.model.forms[this.model.active_form].components
         },
        updateAllFormCaches: function() {
            var llf = Object.keys(this.model.forms)
            for (var ii = 0; ii < llf.length ; ii ++) {
                var formqq = this.model.forms[llf[ii]]
                if (formqq != null) {
                    this.updateFormCache(formqq.name)
                }
            }
        },

        updateFormCache: function(formName) {
            var form = this.model.forms[formName]
            var components = form.components
            if (!isValidObject(this.form_runtime_info[formName])) {
                this.form_runtime_info[formName] = new Object()
            }
            this.form_runtime_info[formName].component_lookup_by_name = {}

            for (var gjh = 0; gjh < components.length; gjh ++) {
                var cc = components[gjh]
                this.form_runtime_info[formName].component_lookup_by_name[cc.name] = cc
            }
        },

         //-------------------------------------------------------------------
         getForms: function() {
         //-------------------------------------------------------------------
             var forms = []
             var llf = Object.keys(this.model.forms)
             for (var ii = 0; ii < llf.length ; ii ++) {
                var form = this.model.forms[llf[ii]]
                if (form != null) {
                    forms.push(form)
                }
             }
             return forms
         },




         //-------------------------------------------------------------------
         setVBEditorProperty: function(event, property) {
         //-------------------------------------------------------------------
            var mm = this
         var val = event.target.value
         var type = null
         if (this.model.active_component_index != null) {
            type = "component"
         } else if ((this.model.active_component_index == null) && (this.model.active_form != null) && (!this.model.app_selected)) {
            type = "form"
         } else if (this.model.app_selected) {
            type = "app"
         }


            if (type == 'component') {
                this.model.forms[this.model.active_form].components[this.model.active_component_index][property.id] = val
                this.generateCodeFromModel(   )


            } else if (type == 'form') {
                if (property.id == "name" ) {
                    this.properties = []

                    var oldval = this.model.active_form
                    //alert("Rename form "  + oldval + " to " + val)

                    this.model.forms[val] = this.model.forms[oldval]
                    this.model.forms[val]["name"] = val

                    this.form_runtime_info[val] = this.form_runtime_info[oldval]


                    if (this.model.default_form == oldval) {
                        this.model.default_form = val
                    }
                    //this.model.active_form = val


                    mm.form_runtime_info[oldval] = null
                    mm.model.forms[oldval] = null
                    //alert(this.model.active_form)

                    //alj(this.form_runtime_info[val])
                    //mm.refresh ++
                    //mm.updateAllFormCaches()
                    mm.selectForm(val)

                } else {
                    this.model.forms[this.model.active_form][property.id] = val
                    this.generateCodeFromModel(   )
                }

            } else if (type == 'app') {
                this.model[property.id] = val
                this.generateCodeFromModel(   )
            }

         },

         //-------------------------------------------------------------------
         getVBEditorProperty: function(property) {
         //-------------------------------------------------------------------
             var val = ""
             var type
             if (this.model.active_component_index != null) {
                type = "component"
             } else if ((this.model.active_component_index == null) && (this.model.active_form != null) && (!this.model.app_selected)) {
                type = "form"
             } else if (this.model.app_selected) {
                type = "app"
             }

            if (type == 'component') {
                val = this.model.forms[this.model.active_form].components[this.model.active_component_index][property.id]


            } else if (type == 'form') {
                val = this.model.forms[this.model.active_form][property.id]



            } else if (type == 'app') {
                val = this.model[property.id]
            }

            return val
         },

         //-------------------------------------------------------------------
         addProperty: function() {
         //-------------------------------------------------------------------
            var mm = this
            mm.add_property = true
            mm.new_property_id = ""
            mm.new_property_name = ""
         }
         ,

         //-------------------------------------------------------------------
         addPropertySave: function() {
         //-------------------------------------------------------------------
            var mm = this
            mm.add_property = false

            mm.model.app_properties.push({
                                            id:     mm.new_property_id,
                                            name:   mm.new_property_name,
                                            type:   "String"
                                            })

            mm.generateCodeFromModel( )
            setTimeout(function() {
                mm.refresh ++
                mm.select_app()
            }
            ,100)

         }
         ,


          //-------------------------------------------------------------------
          addPropertyCancel: function() {
          //-------------------------------------------------------------------
             var mm = this
             mm.add_property = false
          }
          ,



          //-------------------------------------------------------------------
          getComponentProperties: async function(componentName) {
          //-------------------------------------------------------------------
              var sql =    "select  properties  from  system_code  where " +
                           "        base_component_id = '" + componentName + "'   and   code_tag = 'LATEST' "

              var results = await callApp({ driver_name:    "systemFunctions2",method_name:    "sql"},
                  {   sql: sql  })

              if (results.length == 0) {
                return {}
              }
              var propEm = results[0].properties
              if (propEm == '') {
                return {}
              }
              var props = eval("(" + results[0].properties + ")")
              return props
           }
          ,




         //-------------------------------------------------------------------
         selectForm: function(formId) {
         //-------------------------------------------------------------------
             var mm = this
             mm.model.active_component_index = null
             mm.model.app_selected = false
             this.properties = []
             this.properties.push({   id:     "name",   name:   "Name",   type:   "String"    })
             this.properties.push({   id:     "width",   name:   "Width",   type:   "Number"    })
             this.properties.push({   id:     "height",   name:   "Height",   type:   "Number"    })
             this.properties.push({   id:     "form_activate",   name:   "Activate Event",   type:   "Event"    })
             mm.model.active_form = formId
             mm.refresh ++
             this.generateCodeFromModel( )

             if (mm.model.forms[formId].form_activate && (!mm.design_mode)) {
                 //alert(JSON.stringify(this.args,null,2))
                 if (!isValidObject(this.args)) {
                      this.args = this.model
                 }

                 var args = this.args
                 var app = this.model
                 var crt = mm.model.forms[formId].form_activate
                 //alert(crt)
                 //var ffff = eval("(" + crt + ")")
                 //ffff()


                 //zzz
                 var formEvent = {
                     type:               "form_event",
                     form_name:           formId,
                     code:                crt
                 }
                 this.processControlEvent(formEvent)
             }
         },




//zzz
              processControlEvent: async function(  eventMessage  ) {
                var mm = this
                if ((!mm.design_mode) && (mm.model)) {
                    this.updateAllFormCaches()

                    //
                    // set up property access for all forms
                    //
                    var formHandler = {
                         get: function(target,name){
                             var formName = target.name
                             if (mm.model.forms[formName][name]) {
                                 return mm.model.forms[formName][name]
                             }

                             if (mm.form_runtime_info[formName].component_lookup_by_name[name]) {
                                 return mm.form_runtime_info[formName].component_lookup_by_name[name]
                             }

                             return "Not found"
                         }
                    }
                    var formEval = ""
                    var allForms = this.getForms();
                    for (var fi =0; fi < allForms.length ; fi ++) {
                         var aForm = allForms[fi]
                         formEval += ("var " + aForm.name +
                             " = new Proxy({name: '" + aForm.name + "'}, formHandler);")

                    }
                    eval(formEval)





                    //
                    // set up property access for all controls on this form
                    //
                    var allC = this.model.forms[this.model.active_form].components
                    var cacc =""
                    for (var xi =0; xi< allC.length ; xi ++) {
                         var comp = allC[xi]
                         cacc += ( "var " + comp.name + " = mm.form_runtime_info['" + this.model.active_form + "'].component_lookup_by_name['" + comp.name + "'];")
                    }
                    eval(cacc)



                    if (eventMessage.type == "subcomponent_event") {
                            var fcc = "(async function(){" + eventMessage.code +"})"

                           this.model.active_form
                           var thisControl = this.form_runtime_info[this.model.active_form].component_lookup_by_name[eventMessage.control_name]
                           if (isValidObject(thisControl)) {
                                var compEvaled = await this.getComponentProperties(thisControl.base_component_id)
                                var errr=""

                                //
                                // set up property access for this control
                                //
                                for (var rtt=0; rtt < compEvaled.length; rtt++) {
                                    if (thisControl[compEvaled[rtt].id]) {
                                        errr += ( compEvaled[rtt].id + " = `" + thisControl[compEvaled[rtt].id] + "`;")
                                    }
                                }

                                eval( errr  )

                                var efcc = eval(fcc)
                                efcc()

                                //
                                // save any changed properties for this control
                                //
                                for (var rtt=0; rtt < compEvaled.length; rtt++) {
                                    //alert(JSON.stringify(compEvaled[rtt],null,2))
                                    if (thisControl[compEvaled[rtt].id]) {
                                        if (eval(compEvaled[rtt].id ) != thisControl[compEvaled[rtt].id]) {
                                            thisControl[compEvaled[rtt].id] = eval(compEvaled[rtt].id )
                                        }
                                    }
                                }
                           }

                     //
                     // form events
                     //
                     } else if (eventMessage.type == "form_event") {
                        var fcc = "(async function(){" + eventMessage.code +"})"
                        var efcc = eval(fcc)
                        efcc()
                     }





                     mm.refresh ++
                     mm.$forceUpdate();
                }

              },




         //-------------------------------------------------------------------
         allowDropEditor: function(ev) {
         //-------------------------------------------------------------------
             ev.preventDefault();
         },


          //-------------------------------------------------------------------
          dropEditor: async function (ev) {
          //-------------------------------------------------------------------
              ev.preventDefault();
              var mm = this

              var data2 = ev.dataTransfer.getData("message");
              var data = eval("(" + data2 + ")")

              var doc = document.documentElement;
              var left = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0) ;
              var top = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);
              console.log(" ")
              console.log(" window left,window top: ------------ " +  left + "," +  top)

              if (data.type == "resize_form_bottom_right") {

                //alert(data.form_name)

                var rrr = document.getElementById(this.vb_editor_element_id).getBoundingClientRect()
                console.log(" editor left,editor top: ------------ " +  rrr.left + "," +  rrr.top)

                var newWidth = (ev.clientX + 20)  - rrr.left - data.offsetX - this.leftHandWidth;
                var newHeight = (ev.clientY + 20) - rrr.top - data.offsetY;
                console.log(" ev.clientX,ev.clientY: ------------ " +  ev.clientX + "," +  ev.clientY)
                console.log(" newWidth,newHeight: ------------ " +  newWidth + "," +  newHeight)


                this.model.forms[this.model.active_form].width = newWidth
                this.model.forms[this.model.active_form].height = newHeight

                this.model.active_component_index = null
                this.generateCodeFromModel( )
              }
          },

         //-------------------------------------------------------------------
         allowDrop: function(ev) {
         //-------------------------------------------------------------------
             //ev.preventDefault();
         },

         //-------------------------------------------------------------------
         drag: function(ev,message) {
         //-------------------------------------------------------------------
             var mm = this
             var doc = document.documentElement;
             var left = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
             var top = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);
             var rrr = ev.target.getBoundingClientRect()
             message.offsetX = (ev.clientX - rrr.left )
             message.offsetY = (ev.clientY - rrr.top )
             ev.dataTransfer.setData("message",
                                     JSON.stringify(message,null,2));
         },



         deleteComponent: async function(index) {
            var mm = this
            this.model.forms[this.model.active_form].components.splice(index, 1);
            this.selectForm(this.model.active_form)
         },




         //-------------------------------------------------------------------
         drop: async function (ev) {
         //-------------------------------------------------------------------
             var mm = this

             var data2 = ev.dataTransfer.getData("message");
             var data = eval("(" + data2 + ")")

             var doc = document.documentElement;
             var left = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
             var top = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);

             if (data.type == "add_component") {
                 var newItem = new Object()
                 var rrr = document.getElementById(this.vb_grid_element_id).getBoundingClientRect()


                 newItem.leftX = (ev.clientX  - rrr.left)  - data.offsetX;
                 newItem.topY = (ev.clientY  - rrr.top)   - data.offsetY;

                 newItem.name = data.text + "_" + this.model.next_component_id++
                 newItem.base_component_id = data.text
                 newItem.width = 100
                 newItem.height = 100
                 this.refresh++
                 await load(newItem.base_component_id)
                 this.model.forms[this.model.active_form].components.push(newItem)
                 ev.preventDefault();
                 this.generateCodeFromModel(  )
                 this.model.active_component_index = this.model.forms[this.model.active_form].components.length - 1
                 //alert(this.active_component_index)


             } else if (data.type == "move_component") {
                var rrr = document.getElementById(this.vb_grid_element_id).getBoundingClientRect()
                //alert(this.model.forms[this.model.active_form].components[data.index].base_component_id)
                this.model.forms[this.model.active_form].components[data.index].leftX = (ev.clientX  - rrr.left) - data.offsetX;
                this.model.forms[this.model.active_form].components[data.index].topY = (ev.clientY  - rrr.top) - data.offsetY;
                ev.preventDefault();
                this.model.active_component_index = data.index
                this.generateCodeFromModel(   )


             } else if (data.type == "resize_top_left") {
                 var rrr = document.getElementById(this.vb_grid_element_id).getBoundingClientRect()
                 var oldX = this.model.forms[this.model.active_form].components[data.index].leftX
                 var oldY = this.model.forms[this.model.active_form].components[data.index].topY

                 this.model.forms[this.model.active_form].components[data.index].leftX = ev.clientX  - rrr.left - data.offsetX;
                 this.model.forms[this.model.active_form].components[data.index].topY = ev.clientY  - rrr.top - data.offsetY;
                 var diffX = this.model.forms[this.model.active_form].components[data.index].leftX - oldX
                 var diffY = this.model.forms[this.model.active_form].components[data.index].topY - oldY
                 this.model.forms[this.model.active_form].components[data.index].width -= diffX
                 this.model.forms[this.model.active_form].components[data.index].height -= diffY


                 ev.preventDefault();
                 this.model.active_component_index = data.index
                 this.generateCodeFromModel(  )



             } else if (data.type == "resize_top_right") {
                 var rrr = document.getElementById(this.vb_grid_element_id).getBoundingClientRect()
                 var newX = (ev.clientX + 20) - rrr.left - data.offsetX;
                 var newY = ev.clientY - rrr.top - data.offsetY;

                 console.log(" X,Y: ------------ " +  newX + "," +  newY)

                 this.model.forms[this.model.active_form].components[data.index].width = newX - this.model.forms[this.model.active_form].components[data.index].leftX

                 var newHeight = (this.model.forms[this.model.active_form].components[data.index].topY + this.model.forms[this.model.active_form].components[data.index].height) - newY
                 this.model.forms[this.model.active_form].components[data.index].topY = newY
                 this.model.forms[this.model.active_form].components[data.index].height = newHeight


                 ev.preventDefault();
                 this.model.active_component_index = data.index
                 this.generateCodeFromModel(  )

             } else if (data.type == "resize_bottom_left") {
                 var rrr = document.getElementById(this.vb_grid_element_id).getBoundingClientRect()
                 var newX = ev.clientX  - rrr.left - data.offsetX;
                 var newY = (ev.clientY + 20)  - rrr.top - data.offsetY;

                 console.log(" X,Y: ------------ " +  newX + "," +  newY)

                 var newWidth = (this.model.forms[this.model.active_form].components[data.index].leftX + this.model.forms[this.model.active_form].components[data.index].width) - newX
                 this.model.forms[this.model.active_form].components[data.index].leftX = newX
                 this.model.forms[this.model.active_form].components[data.index].width = newWidth

                 this.model.forms[this.model.active_form].components[data.index].height = newY - this.model.forms[this.model.active_form].components[data.index].topY
                 ev.preventDefault();
                 this.model.active_component_index = data.index
                 this.generateCodeFromModel(  )



             } else if (data.type == "resize_bottom_right") {

                 var rrr = document.getElementById(this.vb_grid_element_id).getBoundingClientRect()
                 var newX = (ev.clientX + 20)  - rrr.left - data.offsetX;
                 var newY = (ev.clientY + 20) - rrr.top - data.offsetY;
                 console.log(" editor left,editor top: ------------ " +  rrr.left + "," +  rrr.top)

                 console.log(" newX,newY: ------------ " +  newX + "," +  newY)

                 var newWidth = newX - this.model.forms[this.model.active_form].components[data.index].leftX
                 this.model.forms[this.model.active_form].components[data.index].width = newWidth

                 var newHeight = newY - this.model.forms[this.model.active_form].components[data.index].topY
                 this.model.forms[this.model.active_form].components[data.index].height = newHeight

                 ev.preventDefault();
                 this.model.active_component_index = data.index
                 this.generateCodeFromModel(    )
             }


             this.select_component(this.model.active_component_index)
             this.refresh ++



         },


         //-------------------------------------------------------------------
         select_app: function() {
         //-------------------------------------------------------------------
            var mm = this

            this.model.active_component_index = null
            this.model.app_selected = true
            this.properties = []
            this.properties.push({   id:     "id",   name:   "ID",   type:   "String" , readonly: true,
                                     get_fn: function() {
                                        return mm.edited_app_component_id
                                     }
                                     })

            this.properties.push({   id:     "default_form",   name:   "Load form on startup",   type:   "String"})

            if (this.model.app_properties) {
                //alert(JSON.stringify(this.model.app_properties,null,2))
                this.properties = this.properties.concat(this.model.app_properties)
            }
            this.refresh ++
         },

         //-------------------------------------------------------------------
         select_component: async function(index) {
         //-------------------------------------------------------------------
            if (!this.design_mode) {
                return
            }
            var mm = this

            if (index == null) {
                return
            }
            this.model.app_selected = false
            this.model.active_component_index = index
            this.properties = []
            this.properties.push({   id:     "name",   name:   "Name",   type:   "String"    })
            this.properties.push({   id:     "base_component_id",   name:   "Type",   type:   "String" , readonly: true   })
            this.properties.push({   id:     "leftX",   name:   "X",   type:   "Number"    })
            this.properties.push({   id:     "topY",   name:   "Y",   type:   "Number"    })
            this.properties.push({   id:     "width",   name:   "Width",   type:   "Number"    })
            this.properties.push({   id:     "height",   name:   "Height",   type:   "Number"    })


               var compEvaled = await this.getComponentProperties(this.model.forms[this.model.active_form].components[index].base_component_id)
               this.properties = this.properties.concat(compEvaled)
            this.refresh ++
         },




         //-------------------------------------------------------------------
         addForm: function() {
         //-------------------------------------------------------------------
            var mm = this
            mm.model.active_component_index = null
            mm.properties = []
            this.properties.push({   id:     "name",   name:   "Name",   type:   "String"    })
            this.properties.push({   id:     "width",   name:   "Width",   type:   "Number"    })
            this.properties.push({   id:     "height",   name:   "Height",   type:   "Number"    })

            mm.model.max_form ++
            var newFormName = "form_" + mm.model.max_form
            mm.model.forms[newFormName] = {
                name: newFormName,
                components: [],
                width: "300px",
                height: "300px"
            }
            mm.model.active_form = newFormName
            mm.refresh ++
            //alert(JSON.stringify(mm.model,null,2))
            this.generateCodeFromModel( )
         }
         ,




        //-------------------------------------------------------------------
        moveUp: function(   fieldId   ) {
        //-------------------------------------------------------------------
            var mm = this
            var itemD = null
            for (var tt=0; tt < mm.model.forms[mm.model.active_form].fields.length ; tt++) {
                var ciurr = mm.model.forms[mm.model.active_form].fields[tt]
                if (ciurr.id == fieldId) {
                    itemD = ciurr
                }
            }
            if (itemD) {
                var index = mm.model.forms[mm.model.active_form].fields.indexOf(  itemD  );
                if (index > -1) {
                  mm.model.fields.splice(index, 1);
                  mm.model.fields.splice(index - 1, 0, itemD);
                }

            }

            this.generateCodeFromModel(  )
        },

        //-------------------------------------------------------------------
        moveDown: function(   fieldId   ) {
        //-------------------------------------------------------------------
            var mm = this
            var itemD = null
            for (var tt=0; tt < mm.model.forms[mm.model.active_form].fields.length ; tt++) {
                var ciurr = mm.model.forms[mm.model.active_form].fields[tt]
                if (ciurr.id == fieldId) {
                    itemD = ciurr
                }
            }
            if (itemD) {
                var index = mm.model.forms[mm.model.active_form].fields.indexOf(  itemD  );
                if (index > -1) {
                  mm.model.fields.splice(index, 1);
                  mm.model.fields.splice(index + 1, 0, itemD);
                }

            }

            this.generateCodeFromModel(   )
        },

        //-------------------------------------------------------------------
        deleteField: function(   fieldId   ) {
        //-------------------------------------------------------------------
            var mm = this
            var itemD = null
            for (var tt=0; tt < mm.model.forms[mm.model.active_form].fields.length ; tt++) {
                var ciurr = mm.model.forms[mm.model.active_form].fields[tt]
                if (ciurr.id == fieldId) {
                    itemD = ciurr
                }
            }
            if (itemD) {
                var index = mm.model.forms[mm.model.active_form].fields.indexOf(  itemD  );
                if (index > -1) {
                  mm.model.fields.splice(index, 1);
                }
            }

            this.generateCodeFromModel(  )
            //alert("Added: " + JSON.stringify(mm.model,null,2))
        },
        //-------------------------------------------------------------------
        getText: function() {
        //-------------------------------------------------------------------
            this.generateCodeFromModel()
            return this.text
        },
        //-------------------------------------------------------------------
        setText: function(textValue) {
        //-------------------------------------------------------------------
            var mm = this
            this.text =  textValue
            var json2 = this.getJsonModelFromCode(  textValue  )
            mm.model = json2
            this.generateCodeFromModel(  )
        }
        ,
        //-------------------------------------------------------------------
        getJsonModelFromCode: function(  codeV  ) {
        //-------------------------------------------------------------------
            var mm = this
            var json2 = saveHelper.getValueOfCodeString(codeV,"formEditor",")//formEditor")
            return json2
        }

        ,
        //-------------------------------------------------------------------
        generateCodeFromModel: async function(  ) {
        //-------------------------------------------------------------------
            var mm = this
            if (!this.design_mode) {
                return
            }

            var startIndex = this.text.indexOf("//** gen_" + "start **//")
            var endIndex = this.text.indexOf("//** gen_" + "end **//")


            var sql =    "select  cast(code as text)  as  code  from  system_code  where " +
                         "        base_component_id = 'vb_editor_component'   and   code_tag = 'LATEST' "

            var results = await callApp({ driver_name:    "systemFunctions2",method_name:    "sql"},
                {   sql: sql  })

            var editorCode = results[0].code
            var stt = "//*** COPY_" + "START ***//"
            var editorCodeToCopyStart = editorCode.indexOf(stt) + stt.length
            var editorCodeToCopyEnd = editorCode.indexOf("//*** COPY_" + "END ***//")
            var editorCodeToCopy = editorCode.substring(editorCodeToCopyStart, editorCodeToCopyEnd)
            //console.log(editorCodeToCopy)
            //alert(JSON.stringify(mm.model,null,2))

            this.text = this.text.substring(0,startIndex) +

                `//** gen_start **//
                var mm = null
                var texti = null
                var designMode = false
                var runtimeMode = true
                Vue.component('${this.edited_app_component_id}', {`

                + editorCodeToCopy +

                `,
                data: function () {
                  return {
                      uid2:                        null,
                      vb_grid_element_id:          null,
                      vb_editor_element_id:        null,
                      design_mode: designMode,
                      refresh: 0,
                      runtime_mode: runtimeMode,
                      form_runtime_info: {},
                      text: texti,
                      model: `
                      + JSON.stringify( mm.model,

                                        function(key, value) {
                                              if (typeof value === 'string') {
                                                return  value.toString()
                                              }
                                              return value;
                                        },

                                        2) +

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


               this.text = saveHelper.deleteCodeString(  this.text, "properties", ")//prope" + "rties")

               this.text = saveHelper.insertCodeString(  this.text,
                                                          "properties",
                                                          mm.model.app_properties,
                                                          ")//prope" + "rties")


        }

     }
     ,
                data: function () {
                  return {
                      uid2:                        null,
                      vb_grid_element_id:          null,
                      vb_editor_element_id:        null,
                      design_mode: designMode,
                      refresh: 0,
                      runtime_mode: runtimeMode,
                      form_runtime_info: {},
                      text: texti,
                      model: {
  "next_id": 7,
  "max_form": 3,
  "active_form": "Form_1",
  "default_form": "Form_1",
  "app_selected": false,
  "id": "vb",
  "next_component_id": 102,
  "app_properties": [
    {
      "id": "test",
      "name": "test",
      "type": "String"
    }
  ],
  "forms": {
    "Form_1": {
      "name": "Form_1",
      "width": 372.875,
      "height": 355,
      "components": [
        {
          "name": "todoInputBox",
          "base_component_id": "input_control",
          "leftX": 8,
          "topY": 49,
          "width": 238,
          "height": 40,
          "text": "",
          "label": "",
          "placeholder": "",
          "background_color": ""
        },
        {
          "name": "add_todo_button",
          "base_component_id": "button_control",
          "leftX": 280,
          "topY": 49,
          "width": 85,
          "height": 41,
          "text": "Add",
          "click_event": "var ins =\ntodoInputBox.text\ntodoInputBox.text = \"\"\nawait sql(\"insert into items (id,name) values (?,?)\",\n[\nnew Date().getTime(),\nins])\ndisplay_out.text = await sqlFirstCol(\"select name from items\")",
          "background_color": ""
        },
        {
          "name": "button_control_2",
          "base_component_id": "button_control",
          "leftX": 225,
          "topY": 295,
          "width": 143,
          "height": 54,
          "text": "Go to  form 2",
          "click_event": "mm.selectForm(\"Form_2\")",
          "background_color": "blue"
        },
        {
          "leftX": -0.4375,
          "topY": 105,
          "name": "display_out",
          "base_component_id": "label_control",
          "width": 365,
          "height": 178,
          "text": "",
          "background_color": ""
        },
        {
          "leftX": 134.5625,
          "topY": 4,
          "name": "title_label",
          "base_component_id": "label_control",
          "width": 112,
          "height": 34,
          "text": "Todo App",
          "background_color": ""
        }
      ],
      "form_activate_old": "function() {\n                if (app && app.forms && app.forms[\"Form_1\"] && app.forms[\"Form_1\"].components[0]) {\n                    app.forms[\"Form_1\"].components[0].text = args.test\n                }\n             }",
      "form_activate": "display_out.text = await sqlFirstCol(\"select name from items\")"
    },
    "Form_2": {
      "name": "Form_2",
      "width": "300px",
      "height": "300px",
      "components": [
        {
          "name": "label_control_1",
          "base_component_id": "label_control",
          "leftX": 200,
          "topY": 100,
          "width": 100,
          "height": 100,
          "text": "Hello world"
        },
        {
          "name": "button_control_2",
          "base_component_id": "button_control",
          "leftX": 10,
          "topY": 10,
          "width": 200,
          "background_color": "blue",
          "height": 100,
          "text": "Go to Form 1",
          "click_event": "mm.selectForm(\"Form_1\")"
        }
      ]
    }
  },
  "active_component_index": null
}}
                }
              })//** gen_end **//
/*
allowAccessToAppBaseComponentIds([""])
allowAccessToAppTypes(["database_reader"])
sqlite(
[
  "Create the initial item table",
  ["CREATE TABLE items (id	TEXT, name	TEXT);",
   "alter TABLE items add column time INTEGER;"]
   ,
   "Add a column for the user name",
  ["alter TABLE items add column user TEXT;"]

])//sqlite
grant_full_db_access_to(["todo_app_reader"])
*/
}
