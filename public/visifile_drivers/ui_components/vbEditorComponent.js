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
      template: `<div v-bind:id='uid2'>
                    <div>
                        <h4 style='display: inline-block; margin-right: 10px; ' v-if='design_mode' >VB app designer</h4>
                        <slot style='display: inline-block;' v-if='text' :text2="text"></slot>
                    </div>


                    <div    id='vb_editor'
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


                        <div            id='vb_grid'
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
                                        v-for='(item,index) in getActiveFormComponents'
                                        ondrop="return false;"
                                        v-on:click='$event.stopPropagation();select_component(index)'
                                        v-bind:style='(design_mode?"border: " +
                                                        ((index == model.active_component_index)?"1px solid black;":"1px solid black;"):"") +
                                                        "position: absolute;top: " + item.topY + ";left:" + item.leftX + ";height:" + item.height + "px;width:" + item.width + "px;background: white;;overflow:none;"'>

                                    <div ondrop="return false;" v-bind:style='"position: absolute; top: 0px; left: 0px;height:" + item.height + "px;width:" + item.width + "px;overflow:auto;"'>
                                        <component  v-bind:refresh='refresh' v-bind:is='item.base_component_id' v-bind:properties='model.forms[model.active_form].components[index]'></component>
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
                                                      v-for='(av,index) in getActiveFormComponents'
                                                      v-on:click='$event.stopPropagation();select_component(index)'
                                                      v-bind:style='(((index == model.active_component_index) && design_mode)?"border: 3px solid red;background-color: lightgray;":"") + "margin-left:60px; padding:2px;"'
                                                      >
                                                      <div style='width:100%;display:inline-block;overflow: hidden;'>{{av.base_component_id}}</div>
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
                                                <input v-bind:refresh='refresh' v-if='model.active_component_index != null' class='col-md-7 small'  @change='generateCodeFromModel(  model  )' v-model='model.forms[model.active_form].components[model.active_component_index][property.id]'></input>
                                                <input v-bind:refresh='refresh' v-if='(model.active_component_index == null) && (model.active_form != null) && (!model.app_selected)'  @change='generateCodeFromModel(  model  )' v-model='model.forms[model.active_form][property.id]'></input>
                                                <input v-bind:refresh='refresh' v-if='model.app_selected'  @change='generateCodeFromModel(  model  )' v-model='model[property.id]'></input>
                                            </div>
                                            <div v-if="(property.type  == 'Event')  ">
                                                <textarea   class="form-control" v-bind:refresh='refresh'
                                                            v-if='(model.active_component_index == null) && (model.active_form != null)'
                                                            @change='generateCodeFromModel(  model  )'
                                                            rows=10
                                                            v-model='model.forms[model.active_form][property.id]'></textarea>
                                            </div>
                                        </div>
                                    </div>
                                    <div v-if='property.readonly'>
                                        <div v-bind:refresh='refresh' v-if='model.active_component_index != null' class='col-md-7 small'  @change='generateCodeFromModel(  model  )' v-model='model.forms[model.active_form].components[model.active_component_index][property.id]'></div>
                                        <div v-bind:refresh='refresh' v-if='(model.active_component_index == null) && (model.active_form != null) && (model.app_selected == false)' class='col-md-7 small'  @change='generateCodeFromModel(  model  )' v-model='model.forms[model.active_form][property.id]'></div>
                                        <div v-bind:refresh='refresh' v-if='model.app_selected' class='col-md-7 small'  >
                                            {{property.get_fn?property.get_fn():model[property.id]}}
                                            </div>
                                    </div>
                                </div>
                      </div>


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

           mm.model.active_form = mm.model.default_form

           for (var rtw = 0; rtw < mm.model.forms[mm.model.active_form].components.length ; rtw++ )
           {
                var newItem = mm.model.forms[mm.model.active_form].components[rtw]
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
           for (var iur = 0; iur < mm.available_components.length; iur++) {
                var comp = mm.available_components[iur]
                //alert(comp.base_component_id)
                mm.component_lookup[comp.base_component_id] = comp
           }
           this.selectForm(mm.model.default_form)

           mm.$forceUpdate();
     },

     computed: {
        getActiveFormComponents: function() {
            return this.model.forms[this.model.active_form].components
        }

     },


     methods: {
         //-------------------------------------------------------------------
         getForms: function() {
         //-------------------------------------------------------------------
             var forms = []
             var llf = Object.keys(this.model.forms)
             for (var ii = 0; ii < llf.length ; ii ++) {
                 forms.push(this.model.forms[llf[ii]])
             }
             return forms
         },




         //-------------------------------------------------------------------
         addProperty: function() {
         //-------------------------------------------------------------------
            mm.add_property = true
            mm.new_property_id = ""
            mm.new_property_name = ""
         }
         ,

         //-------------------------------------------------------------------
         addPropertySave: function() {
         //-------------------------------------------------------------------
            mm.add_property = false

            mm.model.app_properties.push({
                                            id:     mm.new_property_id,
                                            name:   mm.new_property_name,
                                            type:   "String"
                                            })

            mm.generateCodeFromModel(  mm.model  )
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
             mm.add_property = false
          }
          ,



         //-------------------------------------------------------------------
         selectForm: function(formId) {
         //-------------------------------------------------------------------
             mm.model.active_component_index = null
             mm.model.app_selected = false
             this.properties = []
             this.properties.push({   id:     "name",   name:   "Name",   type:   "String"    })
             this.properties.push({   id:     "width",   name:   "Width",   type:   "Number"    })
             this.properties.push({   id:     "height",   name:   "Height",   type:   "Number"    })
             this.properties.push({   id:     "form_activate",   name:   "Activate Event",   type:   "Event"    })
             mm.model.active_form = formId
             mm.refresh ++
             this.generateCodeFromModel(  mm.model  )

             if (mm.model.forms[formId].form_activate) {
                var app = this.model
                var crt = mm.model.forms[formId].form_activate
                //alert(crt)
                var ffff = eval("(" + crt + ")")
                ffff()
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

              var data2 = ev.dataTransfer.getData("message");
              var data = eval("(" + data2 + ")")

              var doc = document.documentElement;
              var left = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0) ;
              var top = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);
              console.log(" ")
              console.log(" window left,window top: ------------ " +  left + "," +  top)

              if (data.type == "resize_form_bottom_right") {

                //alert(data.form_name)

                var rrr = document.getElementById("vb_editor").getBoundingClientRect()
                console.log(" editor left,editor top: ------------ " +  rrr.left + "," +  rrr.top)

                var newWidth = (ev.clientX + 20)  - rrr.left - data.offsetX - this.leftHandWidth;
                var newHeight = (ev.clientY + 20) - rrr.top - data.offsetY;
                console.log(" ev.clientX,ev.clientY: ------------ " +  ev.clientX + "," +  ev.clientY)
                console.log(" newWidth,newHeight: ------------ " +  newWidth + "," +  newHeight)


                this.model.forms[this.model.active_form].width = newWidth
                this.model.forms[this.model.active_form].height = newHeight

                this.model.active_component_index = null
                this.generateCodeFromModel(  mm.model  )
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
            this.model.forms[this.model.active_form].components.splice(index, 1);
            this.selectForm(this.model.active_form)
         },




         //-------------------------------------------------------------------
         drop: async function (ev) {
         //-------------------------------------------------------------------

             var data2 = ev.dataTransfer.getData("message");
             var data = eval("(" + data2 + ")")

             var doc = document.documentElement;
             var left = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
             var top = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);

             if (data.type == "add_component") {
                 var newItem = new Object()
                 var rrr = document.getElementById("vb_grid").getBoundingClientRect()


                 newItem.leftX = (ev.clientX  - rrr.left)  - data.offsetX;
                 newItem.topY = (ev.clientY  - rrr.top)   - data.offsetY;

                 newItem.base_component_id = data.text
                 newItem.width = 100
                 newItem.height = 100
                 this.refresh++
                 await load(newItem.base_component_id)
                 this.model.forms[this.model.active_form].components.push(newItem)
                 ev.preventDefault();
                 this.generateCodeFromModel(  mm.model  )
                 this.model.active_component_index = this.model.forms[this.model.active_form].components.length - 1
                 //alert(this.active_component_index)


             } else if (data.type == "move_component") {
                var rrr = document.getElementById("vb_grid").getBoundingClientRect()
                //alert(this.model.forms[this.model.active_form].components[data.index].base_component_id)
                this.model.forms[this.model.active_form].components[data.index].leftX = (ev.clientX  - rrr.left) - data.offsetX;
                this.model.forms[this.model.active_form].components[data.index].topY = (ev.clientY  - rrr.top) - data.offsetY;
                ev.preventDefault();
                this.model.active_component_index = data.index
                this.generateCodeFromModel(  mm.model  )


             } else if (data.type == "resize_top_left") {
                 var rrr = document.getElementById("vb_grid").getBoundingClientRect()
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
                 this.generateCodeFromModel(  mm.model  )



             } else if (data.type == "resize_top_right") {
                 var rrr = document.getElementById("vb_grid").getBoundingClientRect()
                 var newX = (ev.clientX + 20) - rrr.left - data.offsetX;
                 var newY = ev.clientY - rrr.top - data.offsetY;

                 console.log(" X,Y: ------------ " +  newX + "," +  newY)

                 this.model.forms[this.model.active_form].components[data.index].width = newX - this.model.forms[this.model.active_form].components[data.index].leftX

                 var newHeight = (this.model.forms[this.model.active_form].components[data.index].topY + this.model.forms[this.model.active_form].components[data.index].height) - newY
                 this.model.forms[this.model.active_form].components[data.index].topY = newY
                 this.model.forms[this.model.active_form].components[data.index].height = newHeight


                 ev.preventDefault();
                 this.model.active_component_index = data.index
                 this.generateCodeFromModel(  mm.model  )

             } else if (data.type == "resize_bottom_left") {
                 var rrr = document.getElementById("vb_grid").getBoundingClientRect()
                 var newX = ev.clientX  - rrr.left - data.offsetX;
                 var newY = (ev.clientY + 20)  - rrr.top - data.offsetY;

                 console.log(" X,Y: ------------ " +  newX + "," +  newY)

                 var newWidth = (this.model.forms[this.model.active_form].components[data.index].leftX + this.model.forms[this.model.active_form].components[data.index].width) - newX
                 this.model.forms[this.model.active_form].components[data.index].leftX = newX
                 this.model.forms[this.model.active_form].components[data.index].width = newWidth

                 this.model.forms[this.model.active_form].components[data.index].height = newY - this.model.forms[this.model.active_form].components[data.index].topY
                 ev.preventDefault();
                 this.model.active_component_index = data.index
                 this.generateCodeFromModel(  mm.model  )



             } else if (data.type == "resize_bottom_right") {

                 var rrr = document.getElementById("vb_grid").getBoundingClientRect()
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
                 this.generateCodeFromModel(  mm.model  )
             }


             this.select_component(this.model.active_component_index)
             this.refresh ++



         },


         //-------------------------------------------------------------------
         select_app: function() {
         //-------------------------------------------------------------------

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
         select_component: function(index) {
         //-------------------------------------------------------------------

            if (index == null) {
                return
            }
            this.model.app_selected = false
            this.model.active_component_index = index
            this.properties = []
            this.properties.push({   id:     "name",   name:   "Name",   type:   "String"    })
            this.properties.push({   id:     "leftX",   name:   "X",   type:   "Number"    })
            this.properties.push({   id:     "topY",   name:   "Y",   type:   "Number"    })
            this.properties.push({   id:     "width",   name:   "Width",   type:   "Number"    })
            this.properties.push({   id:     "height",   name:   "Height",   type:   "Number"    })

            var comp = this.component_lookup[this.model.forms[this.model.active_form].components[index].base_component_id]
            if (comp.properties) {
               var compEvaled = eval("(" + comp.properties + ")")
               this.properties = this.properties.concat(compEvaled)
            }
            this.refresh ++
         },




         //-------------------------------------------------------------------
         addForm: function() {
         //-------------------------------------------------------------------
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
            this.generateCodeFromModel(  mm.model  )
         }
         ,


        //-------------------------------------------------------------------
        addField: function() {
        //-------------------------------------------------------------------
            mm.model.forms[mm.model.active_form].fields.push({   id: mm.model.next_id,   type: "text",   text: "Enter text here",
                                      style: {}})
            mm.model.next_id ++
            this.generateCodeFromModel(  mm.model  )
            //alert("Added: " + JSON.stringify(mm.model,null,2))
        },

        //-------------------------------------------------------------------
        getFieldCssStyle: function(   fieldId   , styleName) {
        //-------------------------------------------------------------------
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


        //-------------------------------------------------------------------
        fieldSize: function(fieldId) {
        //-------------------------------------------------------------------
            var mm = this
            if (mm.getFieldCssStyle(fieldId,"size") == null) {
                return 16
            }
            return this.getFieldCssStyle(fieldId,"size")
        },


        //-------------------------------------------------------------------
        updateFieldCssStyle: function(   fieldId   , styleName, styleValue) {
        //-------------------------------------------------------------------
            var itemD = null
            var mm = this
            for (var tt=0; tt < mm.fields.length ; tt++) {
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


        //-------------------------------------------------------------------
        getStyle: function(fieldId) {
        //-------------------------------------------------------------------
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


        //-------------------------------------------------------------------
        moveUp: function(   fieldId   ) {
        //-------------------------------------------------------------------
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

            this.generateCodeFromModel(  mm.model  )
        },

        //-------------------------------------------------------------------
        moveDown: function(   fieldId   ) {
        //-------------------------------------------------------------------
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

            this.generateCodeFromModel(  mm.model  )
        },

        //-------------------------------------------------------------------
        deleteField: function(   fieldId   ) {
        //-------------------------------------------------------------------
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

            this.generateCodeFromModel(  mm.model  )
            //alert("Added: " + JSON.stringify(mm.model,null,2))
        },
        //-------------------------------------------------------------------
        getText: function() {
        //-------------------------------------------------------------------
            return this.text
        },
        //-------------------------------------------------------------------
        setText: function(textValue) {
        //-------------------------------------------------------------------
            this.text =  textValue
            var json2 = this.getJsonModelFromCode(  textValue  )
            mm.model = json2
            this.generateCodeFromModel(  json2  )
        }
        ,
        //-------------------------------------------------------------------
        getJsonModelFromCode: function(  codeV  ) {
        //-------------------------------------------------------------------
            var json2 = saveHelper.getValueOfCodeString(codeV,"formEditor",")//formEditor")
            return json2
        }

        ,
        //-------------------------------------------------------------------
        generateCodeFromModel: async function(  jsonModel  ) {
        //-------------------------------------------------------------------
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
                      component_lookup:            new Object(),
                      text: texti,
                      uid2: uid2,
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
     //*** COPY_END ***//
     ,
     data: function () {
       return {
           design_mode:                 designMode,
           runtime_mode:                runtimeMode,
           edited_app_component_id:     null,
           text:                        texti,
           leftHandWidth:               200,
           add_property:                false,
           new_property_name: "",
           new_property_id: "",
           uid2:                        uid2,
           refresh:                     0,
           properties:                  [],
           read_only:                   false,
           available_components:        [],
           component_lookup:            new Object(),

           model:                      {
                                            next_id: 1,
                                            max_form: 1,
                                            active_form: "Form 1",
                                            active_component_index: null,
                                            app_selected: false,
                                            default_form: "Form 1",
                                            app_properties: [],

                                            fields: [

                                                    ],

                                            forms: {
                                                "Form 1": {
                                                    name: "Form 1",
                                                    components: [

                                                                ]

                                                }
                                            }
                                        }
       }
     }


    }
    )

}
