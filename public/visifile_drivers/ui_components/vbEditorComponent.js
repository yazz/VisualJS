async function component( args ) {
/*
base_component_id("vb_editor_component")
control_type("SYSTEM")
load_once_from_file(true)
*/

    //alert(JSON.stringify(args,null,2))
    var mm = null
    var texti = null
    if (args) {
        texti = args.text
    }
    var designMode = true
    var runtimeMode = false
    var selectProp = null

    Vue.component("vb_editor_component",
    {


    //*** COPY_START ***//
      props: [ "args"],
      template:
`<div   v-bind:id='uid2'
        v-if='uid2 != null'
        v-bind:style='"width: 100%; height: 100%; " + (design_mode?"background: white;":"")'>


    <div style='box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);background-color: lightgray; padding: 5px; padding-left: 15px;' v-if='design_mode' >

        <slot style='display: inline-block;float: left;' v-if='text'>
        </slot>


     </div>


    <div    v-bind:id='vb_editor_element_id' v-if='vb_editor_element_id != null'
            style='position:relative'
            v-on:drop="dropEditor($event)"
            v-on:ondragover="allowDropEditor($event)">

        <div    v-if='design_mode'
                v-on:mouseover='selected_pane = "blocks";'
                v-bind:style='(design_mode?"border: 4px solid lightgray;":"") + " width: " + leftHandWidth + "px;height: 75vmin; display: inline-block;overflow-x: none;overflow-y: auto;vertical-align: top; background-color: lightgray;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);"'>

            <div    v-bind:style='"font-size:14px;font-weight:bold;border-radius: 3px;padding: 4px; margin-bottom: 10px;box-shadow: 2px 2px 10px lightgray;"'
                    v-bind:class='(selected_pane == "blocks"?"selected_pane_title":"unselected_pane_title") '>
                Blocks
            </div>
            <div class='container' style=''>
                <div class='row'>
                    <div    class='col-md-6'
                            v-on:click='highlighted_control = null;'
                            v-bind:style='"border-radius: 3px;width:50px;height:50px; margin: 0px;border: 0px;padding:10px;overflow-x:hidden;overflow-y:hidden;background-color: " + ((!highlighted_control)?"#E8E8E8;border-left: 2px solid gray;border-top: 2px solid gray;":"lightgray;")'>
                        <img    src='https://cdn0.iconfinder.com/data/icons/seo-web-15/153/seo-social-web-network-internet_61-512.png'
                                style='width: 100%;'
                                class='img-fluid'>
                        </img>
                    </div>

                    <div    v-for='av in available_components'
                            draggable="true"
                            class='col-md-6'
                            v-on:dragstart='highlighted_control = av.base_component_id;drag($event,{
                                                   type:   "add_component",
                                                   text:    av.base_component_id
                                                })'
                            v-on:click='highlighted_control = av.base_component_id;'
                            v-bind:style='"margin: 2px;border-radius: 3px;width:50px;;height: 50px; margin: 0px;border: 0px;padding:10px;overflow-x:auto;overflow-y:hidden;background-color: " + ((highlighted_control == av.base_component_id)?"#E8E8E8;border-left: 2px solid gray;border-top: 2px solid gray;":"lightgray;")'>

                        <img    v-if='isValidObject(av)'
                                v-bind:src='av.logo_url'
                                style='width: 100%;'
                                class='img-fluid'>
                        </img>


                    </div>
                </div>
            </div>
        </div>

        <div            v-bind:style='"margin: 2px; display: inline-block; vertical-align: top; position: relative; width: " + model.forms[model.active_form].width +  ";height: " + model.forms[model.active_form].height +  " ;" + (design_mode?"border: 0px solid lightgray; padding:0px;margin: 15px;":"margin: 0px;" ) '>

            <div    v-if='design_mode'
                    style='font-size:14px;font-weight:bold;border-radius: 10px;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);background-image: linear-gradient(to right,  #000099, lightblue); color: white; border: 4px solid lightgray; padding:4px; margin:0;'>

                <img
                    src='/driver_icons/form.png'
                    style='width: 20px; margin-right: 10px;'
                    class='img-fluid'>
                 </img>
                 {{model.active_form}} (Form)
            </div>

            <div            v-bind:id='vb_grid_element_id'  v-if='vb_grid_element_id != null'
                            v-on:drop="drop($event)"
                            v-on:ondragover="allowDrop($event)"
                            v-bind:class='(design_mode?"dotted":"" )'
                            v-on:click='if (design_mode) {$event.stopPropagation();selectForm(model.active_form)}'
                            v-bind:style='"display: inline-block; vertical-align: top; position: relative; width: " + model.forms[model.active_form].width +  ";height: " + model.forms[model.active_form].height +  " ;" + (design_mode?"border: 4px solid lightgray;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);":"border: 0px;" ) '>



                <div    v-if='design_mode'
                        v-bind:refresh='refresh'
                        style='opacity:0.5;position: absolute; bottom: 0px; right: 0px;z-index: 30000000;width: 20px;height: 20px;background-color: gray;'
                        v-bind:draggable='true'
                        v-on:dragstart='drag($event,{
                           type:        "resize_form_bottom_right",
                           form_name:    model.active_form
                        })'>
                    <div    style='position: absolute; bottom: 0px; right: 0px;z-index: 30000000;width: 40px;height: 1px;background-color: black;'>
                    </div>

                    <div    style='position: absolute; bottom: 0px; right: 0px;z-index: 30000000;width: 1px;height: 40px;background-color: black;'>
                    </div>
                </div>

                <div    v-bind:refresh='refresh'
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
                            })'>

                        <div    v-if='design_mode'
                                ondrop="return false;"
                                v-bind:refresh='refresh'
                                v-bind:style='"position: absolute; top: 0px; left: 0px;z-index: 10000000;width: 100%;height: 100%; background-color: lightgray;" +
                                                ((index == model.active_component_index)?"opacity: 0;":"opacity: .6;") '>

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
                            })'>
                        <div    style='position: absolute; top: 0px; left: 0px;z-index: 30000000;width: 40px;height: 1px;background-color: black;'>
                        </div>

                        <div    style='position: absolute; top: 0px; left: 0px;z-index: 30000000;width: 1px;height: 40px;background-color: black;'>
                        </div>

                    </div>


                    <div    v-if='design_mode'
                            v-bind:refresh='refresh'
                            style='opacity:0.5;position: absolute; top: 0px; right: 0px;z-index: 30000000;width: 20px;height: 20px;background-color: gray;'
                            v-bind:draggable='true'
                            v-on:dragstart='drag($event,{
                               type:   "resize_top_right",
                               text:    item.base_component_id,
                               index:   index  })'>

                        <div    style='position: absolute; top: 0px; right: 0px;z-index: 30000000;width: 40px;height: 1px;background-color: black;'>
                        </div>

                        <div    style='position: absolute; top: 0px; right: 0px;z-index: 30000000;width: 1px;height: 40px;background-color: black;'>
                        </div>
                    </div>



                    <div    v-if='design_mode'
                            v-bind:refresh='refresh'
                            style='opacity:0.5;position: absolute; bottom: 0px; left: 0px;z-index: 30000000;width: 20px;height: 20px;background-color: gray;'
                            v-bind:draggable='true'
                            v-on:dragstart='drag($event,{
                                                        type:   "resize_bottom_left",
                                                        text:    item.base_component_id,
                                                        index:   index
                                                     })'>
                        <div    style='position: absolute; bottom: 0px; left: 0px;z-index: 30000000;width: 40px;height: 1px;background-color: black;'>
                        </div>

                        <div    style='position: absolute; bottom: 0px; left: 0px;z-index: 30000000;width: 1px;height: 40px;background-color: black;'>
                        </div>
                    </div>



                    <div  v-if='design_mode'
                          v-bind:refresh='refresh'
                          style='opacity:0.5;position: absolute; bottom: 0px; right: 0px;z-index: 30000000;width: 20px;height: 20px;background-color: gray;'
                          v-bind:draggable='true'
                          v-on:dragstart='drag($event,{
                                                         type:   "resize_bottom_right",
                                                         text:    item.base_component_id,
                                                         index:   index
                                                              })'>
                        <div    style='position: absolute; bottom: 0px; right: 0px;z-index: 30000000;width: 40px;height: 1px;background-color: black;'>
                        </div>

                        <div    style='position: absolute; bottom: 0px; right: 0px;z-index: 30000000;width: 1px;height: 40px;background-color: black;'>
                        </div>
                    </div>


                    <div     v-if='design_mode'
                             v-bind:refresh='refresh'
                             style='opacity:0.5;position: absolute; bottom: 0px; right: 20px;z-index: 30000000;width: 20px;height: 20px;background-color: red;'
                             v-on:click='$event.stopPropagation();deleteComponent(index)'>

                        <div style='text-align: center;vertical-align: middle;'>
                            X
                        </div>

                    </div>

                </div>

            </div>

        </div>





        <div    v-if='design_mode'
              v-bind:style='(design_mode?"border: 4px solid lightgray;box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 8px 0px, rgba(0, 0, 0, 0.19) 0px 6px 20px 0px;":"") + " position:absolute;top:0px;right:0px;width: 250px;height: 75vmin; display: inline-block;overflow-x: none;overflow: hidden;vertical-align: top;padding:0px;height:100%;background-color: lightgray; "'
              v-bind:refresh='refresh'>






              <div    id='right_project_pane'
                      v-bind:class='(right_mode == "project"?"right_project_pane_expanded":"right_project_pane_collapsed")''
                      v-bind:refresh='refresh'
                      v-bind:style='"padding:0px; border: 4px solid lightgray;white-space:nowrap"'>

                  <div v-bind:style='"border-radius: 3px;  padding: 4px;overflow-x:none;height: 40px;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);font-size:14px;font-weight:bold;" '
                       v-bind:class='(selected_pane == "project"?"selected_pane_title":"unselected_pane_title") '
                       v-on:mouseover='$event.stopPropagation();var s = (right_mode == "properties"?"project":"project");selected_pane = "project";chooseRight(s);'>
                      Project explorer

                      <button type=button class='btn btn-sm btn-warning'
                              v-bind:style='"float: right;" + (right_mode == "project"?"":"display:;font-size:14px;")'
                              v-on:click='$event.stopPropagation();selected_pane = "project"; chooseRight("project");addForm()'  >
                                  Add form
                      </button>
                  </div>


                  <div  v-bind:style='"font-size:14px;border-radius: 3px; padding:4px; border-right:2px solid gray;border-bottom:2px solid gray; margin-top:2px;;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);height:80%;background-color:lightgray;"  + (right_mode == "project"?"":"display:none;")'>
                      <div    style="align-items: stretch;border-radius: 3px;overflow-y:scroll; padding:0px; border: 0px solid lightgray;border-left: 2px solid gray;border-top: 2px solid gray; background-color:white;height:100%;">

                          <div    v-bind:style='"border-radius: 0px;padding:4px;margin:0px;margin-top: 5px;" + (model.app_selected?"background-color:gray;color:white;":"background-color:white;color:black;")'
                                  v-on:click='$event.stopPropagation();selected_pane = "project";select_app()'>

                                        <b>{{edited_app_component_id}}</b>
                          </div>

                          <div v-for='form in getForms()' v-bind:refresh='refresh'>
                              <div>
                                  <div  v-bind:style='(((form.name == model.active_form) && (model.active_component_index == null) && (!model.app_selected)) ?"border: 0px solid red;background-color:gray;color:white;":"color:black;") + "padding:4px;margin:0px;margin-left:30px;border-radius: 3px;"'
                                        v-on:click='$event.stopPropagation();selected_pane = "project";selectForm(form.name)'>

                                        <img
                                            src='/driver_icons/form.png'
                                            style='width: 20px; margin-right: 10px;'
                                            class='img-fluid'>
                                        </img>

                                              {{form.name}} ({{form.components.length}})
                                  </div>

                                  <div    v-if='form.name == model.active_form'
                                          v-for='(av,index) in getActiveFormComponents()'
                                          v-on:click='$event.stopPropagation();selected_pane = "project";select_component(index)'
                                          v-bind:style='(((index == model.active_component_index) && design_mode)?"border: 0px solid red;background-color: gray;color: white;":"") + "margin-left:80px; padding:2px;border-radius: 3px;"'>

                                      <div style='width:100%;display:inline-block;overflow: hidden;'>{{av.name}}</div>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>











            <div    id='right_properties_pane'
                    v-bind:class='(right_mode == "properties"?"right_properties_pane_collapsed":"right_properties_pane_collapsed")'
                    v-bind:style='"padding:0px; border: 4px solid lightgray;padding:0px;background-color: lightgray;"'>

                <div    v-bind:style='"border-radius: 3px;padding: 4px;height: 40px;overflow-x:none;white-space:nowrap;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);overflow:hidden ;text-overflow: ellipsis;font-size:14px;font-weight:bold;"'
                        v-bind:class='(selected_pane == "properties"?"selected_pane_title_slower":"unselected_pane_title_slower") '
                        v-on:mouseover='var s = (right_mode == "properties"?"properties":"properties");selected_pane = "properties";chooseRight(s);'>
                    Properties - {{model.active_component_index?model.forms[model.active_form].components[model.active_component_index].name + " (Component)" : model.active_form + " (Form)"}}
                </div>


                <div id='property_selector_parent' style='margin: 5px;'>

                </div>

                <div  style="border-radius: 3px; padding:4px; border-right:2px solid gray;border-bottom:2px solid gray; margin-top:2px;;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);height:65%;">
                    <div    style="border-radius: 3px;overflow-y:scroll; padding:0px; border: 0px solid lightgray;border-left: 2px solid gray;border-top: 2px solid gray; background-color:white;height:100%;">


                        <div    v-for='property in properties'
                                style='font-size:14px;border-bottom: 1px solid lightgray;padding:0px;margin:0px;'>

                            <div style='width:100%;padding:0px;margin:0px;display:flex;'>
                                <div
                                        v-bind:style='"text-overflow: ellipsis;white-space: pre-line;vertical-align: top;display:flex;width:40%;margin: 0px;font-size:14px;padding-left: 1px;padding-top:0px;padding-bottom:0px;" + (active_property_index == property.name?"background-color:#000099;color:white;":"")'
                                        v-on:click='selected_pane = "properties";active_property_index = property.name;'>{{property.name}}
                                </div>

                                <div style='display:flex;width:57%;padding:0px;padding-left:3px; border-left: 1px solid lightgray;'
                                     v-on:click='selected_pane = "properties";'>
                                    <div v-if='!property.readonly'>
                                        <div    v-if="(property.type  == 'String')  || (property.type  == 'Number')">
                                            <input
                                                    @change='setVBEditorProperty($event, property)'
                                                    v-bind:value='getVBEditorProperty(property)'
                                                    style='width: 100%;border: 0px;font-size:14px;padding:0px;'>
                                            </input>
                                        </div>

                                        <div v-if="(property.type  == 'Event')  ">
                                            <div>

                                                <div        style='margin-top:2px;margin-bottom:2px;border-right: 2px solid gray;border-bottom: 2px solid gray;background-color: darkgray;float: right; padding:0px; padding-right:5px;padding-left:20px;height: 20px;color: white;border-radius: 3px;font-size:14px;font-style:bold;'
                                                            v-on:click='$event.stopPropagation();editAsCode({
                                                                active_form:            model.active_form,
                                                                active_component_index: model.active_component_index,
                                                                property_id:            property.id
                                                            })'  >
                                                    ...
                                                </div>
                                            </div>
                                            <textarea   class="form-control"
                                                        v-if='(model.active_component_index == null) && (model.active_form != null)'
                                                        @change='generateCodeFromModel(   )'
                                                        style='border:0px;font-size:14px;padding:0px;'
                                                        rows=10
                                                        v-model='model.forms[model.active_form][property.id]'>
                                            </textarea>

                                            <textarea   class="form-control"
                                                        v-if='(model.active_component_index != null) && (model.active_form != null)'
                                                        @change='generateCodeFromModel(   )'
                                                        rows=10
                                                        style='border:0px;font-size:14px;padding:0px;'
                                                        v-model='model.forms[model.active_form].components[model.active_component_index][property.id]'>
                                            </textarea>
                                        </div>
                                    </div>

                                    <div v-if='property.readonly'>
                                        <div    v-if='model.active_component_index != null'
                                                style='padding:0px;font-size:14px;'
                                                class='col-md-12 small'>

                                            {{model.forms[model.active_form].components[model.active_component_index][property.id]}}

                                        </div>

                                        <div v-if='(model.active_component_index == null) && (model.active_form != null) && (model.app_selected == false)' class='col-md-12 small'   v-model='model.forms[model.active_form][property.id]'>
                                        </div>

                                        <div    v-if='model.app_selected'
                                                style='padding:0px;font-size:14px;'
                                                class='col-md-12 small'  >

                                            {{property.get_fn?property.get_fn():model[property.id]}}

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div  v-if='model.app_selected && (!add_property)' class='row'>
                            <div  class='col-md-12 small'>
                                <button     type=button class='btn btn-sm btn-info'
                                            style='font-size: 14px;'
                                            v-on:click='$event.stopPropagation();addProperty()'  >
                                    Add property
                                </button>
                            </div>
                        </div>

                        <div v-if='(model.app_selected) && (add_property)' class='row'>
                            <div    style='font-size: 14px;'
                                    class='col-md-12 small'>
                                Add a property
                            </div>
                        </div>

                        <div v-if='(model.app_selected) && (add_property)' class='row'>
                            <div    style='font-size: 14px;'
                                    class='col-md-4'>
                               ID
                            </div>

                            <input  style='font-size: 14px;'
                                    class='col-md-7 small'
                                    placeholder='background_color'
                                    v-model='new_property_id'>
                            </input>
                        </div>

                        <div v-if='(model.app_selected) && (add_property)' class='row'>
                            <div    style='font-size: 14px;'
                                    class='col-md-4'>
                                Name
                            </div>

                            <input  class='col-md-7 small'
                                    placeholder='Background Color'
                                    style='border:0px;font-size: 14px;'
                                    v-model='new_property_name'>
                            </input>
                        </div>

                        <div v-if='(model.app_selected) && (add_property)' class='row'>
                            <div class='col-md-12'>
                                <button style='font-size: 14px;'
                                        type=button class='btn btn-sm btn-info'
                                        v-on:click='$event.stopPropagation();addPropertyCancel()'  >
                                    Cancel
                                </button>

                                <button style='font-size: 14px;'
                                        type=button class='btn btn-sm btn-info'
                                        v-on:click='$event.stopPropagation();addPropertySave()'  >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>



        </div>











    </div>
</div>`
        ,





        mounted: async function() {
            var mm = this
            var startTime = new Date().getTime()
            var ttq=0

            mm.uid2 =                       uuidv4()
            mm.vb_grid_element_id =          "vb_grid_"+ uuidv4()
            mm.vb_editor_element_id =         "vb_editor_"+ uuidv4()
            mm.local_app = localAppshareApp


            //console.log("Time " + (ttq++) + ": " + (new Date().getTime()- startTime))

            //
            // get the base component ID of the code to edit/run
            //
            if (texti) {
                var json2 = this.getJsonModelFromCode(  texti  )
                //console.log("mounted: mm.model = json2")
                mm.model = json2
                mm.edited_app_component_id = saveHelper.getValueOfCodeString(texti, "base_component_id")

                //this.generateCodeFromModel(   )

                this.read_only = saveHelper.getValueOfCodeString(texti, "read_only")
             //alert(this.text)
           }

           mm.model.active_form = mm.model.default_form



           //console.log("Time " + (ttq++) + ": " + (new Date().getTime()- startTime))


          //
          // get the component usage
          //
          if (mm.edited_app_component_id) {
              var sql =    "select  child_component_id  from  component_usage  where " +
                           "        base_component_id = '" + mm.edited_app_component_id + "'"

              var results = await callApp({ driver_name:    "systemFunctions2",method_name:    "sql"},
                  {   sql: sql  })
              //alert(JSON.stringify(results,null,2))


              for (var i = 0; i < results.length; i++) {
                   mm.component_usage[results[i].child_component_id] = true
              }
          }

          //console.log("Time " + (ttq++) + ": " + (new Date().getTime()- startTime))



           //
           // load the forms and their controls
           //
           var forms = this.getForms()
           //console.log("Time " + (ttq++) + ": " + (new Date().getTime()- startTime))

           for (var formIndex = 0; formIndex < forms.length; formIndex ++) {
                var formName = forms[formIndex].name

                var compsToLoad = []
                for (var rtw = 0; rtw < mm.model.forms[formName].components.length ; rtw++ )
                {
                    var newItem = mm.model.forms[formName].components[rtw]
                    if (!component_loaded[newItem.base_component_id]) {
                        compsToLoad.push(newItem.base_component_id)
                    }
                }
                await loadV2(compsToLoad)

                for (var rtw = 0; rtw < mm.model.forms[formName].components.length ; rtw++ )
                {
                     var newItem = mm.model.forms[formName].components[rtw]
                     //alert(newItem.base_component_id)
                        //console.log(`Loading ${newItem.base_component_id}`)

                        if (mm.edited_app_component_id) {
                            mm.component_usage[newItem.base_component_id] = true
                        }



                     var compEvaled1 = component_cache[this.model.forms[formName].components[rtw].base_component_id]
                     if (isValidObject(compEvaled1)) {
                            var compEvaled = compEvaled1.properties
                            if (isValidObject(compEvaled)) {
                                for (var cpp = 0 ; cpp< compEvaled.length; cpp ++){
                                    var prop = compEvaled[cpp].id
                                    if (!isValidObject(this.model.forms[formName].components[rtw][prop])){
                                        this.model.forms[formName].components[rtw][prop] = ""
                                    }
                                }
                            }
                     }


                }
           }

           //console.log("Time " + (ttq++) + ": " + (new Date().getTime()- startTime))



           //
           // get the availabe components
           //
           if (online) {
               var sql =    "select  base_component_id,logo_url  from  system_code  where " +
                            "        code_tag = 'LATEST' and logo_url is not null and control_type = 'VB'"

               var results = await callApp({ driver_name:    "systemFunctions2",method_name:    "sql"},
                   {   sql: sql  })
               mm.available_components = results
               //console.log("Time " + (ttq++) + ": " + (new Date().getTime()- startTime))
           }







           mm.updateAllFormCaches()
           //console.log("Time " + (ttq++) + ": " + (new Date().getTime()- startTime))


           mm.selectForm(mm.model.default_form)
           //console.log("Time " + (ttq++) + ": " + (new Date().getTime()- startTime))


           mm.$forceUpdate();
           //console.log("Time " + (ttq++) + ": " + (new Date().getTime()- startTime))

           mm.updatePropertySelector()

           texti = null
     },





     methods: {
         editAsCode: async function(aa) {
             alert(JSON.stringify(aa))
         }
         ,
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


        chooseRight: function(ff) {
            this.right_mode = ff
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
                //this.generateCodeFromModel(   )
                this.refresh ++


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
                }

            } else if (type == 'app') {
                this.model[property.id] = val
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
            if ((mm.new_property_name.length == 0) || (mm.new_property_id.length == 0)) {
                alert("You must enter a property name and ID")
                return;
            }
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
          getComponentProperties: function(componentName) {
          //-------------------------------------------------------------------
                var compEvaled1 = component_cache[componentName]
                if (isValidObject(compEvaled1)) {
                     var compEvaled = compEvaled1.properties
                     if (isValidObject(compEvaled)) {
                         return compEvaled
                     }
                }

                return []
           }
          ,




         //-------------------------------------------------------------------
         selectForm: function(formId) {
         //-------------------------------------------------------------------
             var mm = this
             mm.model.active_component_index = null
             mm.model.app_selected = false
             mm.properties = []
             mm.properties.push({   id:     "name",   name:   "Name",   type:   "String"    })
             mm.properties.push({   id:     "width",   name:   "Width",   type:   "Number"    })
             mm.properties.push({   id:     "height",   name:   "Height",   type:   "Number"    })
             mm.properties.push({   id:     "form_activate",   name:   "Activate Event",   type:   "Event"    })
             mm.model.active_form = formId
             mm.refresh ++

             if (mm.model.forms[formId].form_activate && (!mm.design_mode)) {
                 //alert(JSON.stringify(mm.args,null,2))
                 if (!isValidObject(this.args)) {
                      mm.args = mm.model
                 }

                 var args = mm.args
                 var app = mm.model
                 var crt = mm.model.forms[formId].form_activate
                 //alert(crt)
                 //var ffff = eval("(" + crt + ")")
                 //ffff()



                 var formEvent = {
                     type:               "form_event",
                     form_name:           formId,
                     code:                crt
                 }
                 mm.processControlEvent(formEvent)
             }
             mm.updatePropertySelector()
             mm.refresh ++
         },





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
                            var fcc =
`(async function(){
${eventMessage.code}
})`

                           this.model.active_form
                           var thisControl = this.form_runtime_info[this.model.active_form].component_lookup_by_name[eventMessage.control_name]
                           if (isValidObject(thisControl)) {
                                var compEvaled = this.getComponentProperties(thisControl.base_component_id)
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

                                var debugFcc = getDebugCode(this.model.active_form +"_"+eventMessage.control_name+"_"+eventMessage.sub_type,fcc,{skipFirstAndLastLine: true})
                                var efcc = eval(debugFcc)
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

              if (data.type == "resize_form_bottom_right") {

                //alert(data.form_name)

                var rrr = document.getElementById(this.vb_editor_element_id).getBoundingClientRect()

                var newWidth = (ev.clientX + 20)  - rrr.left - data.offsetX - this.leftHandWidth;
                var newHeight = (ev.clientY + 20) - rrr.top - data.offsetY;


                this.model.forms[this.model.active_form].width = newWidth
                this.model.forms[this.model.active_form].height = newHeight

                this.model.active_component_index = null
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
             ev.preventDefault();
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
                 if (newItem.leftX < 0) {
                    newItem.leftX = 0
                 }
                 if (newItem.topY < 0) {
                    newItem.topY = 0
                 }


                 newItem.name = data.text + "_" + this.model.next_component_id++
                 newItem.base_component_id = data.text
                 newItem.width = 100
                 newItem.height = 100

                 if ((newItem.leftX + newItem.width)
                         > this.model.forms[this.model.active_form].width) {
                     newItem.leftX = this.model.forms[this.model.active_form].width - newItem.width
                 }
                 if ((newItem.topY + newItem.height)
                         > this.model.forms[this.model.active_form].height) {
                     newItem.topY = this.model.forms[this.model.active_form].height - newItem.height
                 }


                 this.refresh++
                 if (!component_loaded[newItem.base_component_id]) {
                    await loadV2([newItem.base_component_id])
                    this.component_usage[newItem.base_component_id] = true
                 }

                 var compEvaled1 = component_cache[newItem.base_component_id]
                 if (isValidObject(compEvaled1)) {
                        var compEvaled = compEvaled1.properties
                        if (isValidObject(compEvaled)) {
                            for (var cpp = 0 ; cpp< compEvaled.length; cpp ++){
                                var prop = compEvaled[cpp].id
                                if (!isValidObject(newItem[prop])){
                                    newItem[prop] = ""
                                }
                            }
                        }
                 }





                 this.model.forms[this.model.active_form].components.push(newItem)
                 this.model.active_component_index = this.model.forms[this.model.active_form].components.length - 1


             } else if (data.type == "move_component") {
                var rrr = document.getElementById(this.vb_grid_element_id).getBoundingClientRect()

                var newLeftX = (ev.clientX  - rrr.left) - data.offsetX;
                var newTopY = (ev.clientY  - rrr.top) - data.offsetY;
                if (newLeftX < 0) {
                    newLeftX = 0
                }
                if (newTopY < 0) {
                    newTopY = 0
                }
                if ((newLeftX + this.model.forms[this.model.active_form].components[data.index].width)
                        > this.model.forms[this.model.active_form].width) {
                    newLeftX = this.model.forms[this.model.active_form].width - this.model.forms[this.model.active_form].components[data.index].width
                }
                if ((newTopY + this.model.forms[this.model.active_form].components[data.index].height)
                        > this.model.forms[this.model.active_form].height) {
                    newTopY = this.model.forms[this.model.active_form].height - this.model.forms[this.model.active_form].components[data.index].height
                }

                this.model.forms[this.model.active_form].components[data.index].leftX = newLeftX
                this.model.forms[this.model.active_form].components[data.index].topY = newTopY
                this.model.active_component_index = data.index


             } else if (data.type == "resize_top_left") {
                 var rrr = document.getElementById(this.vb_grid_element_id).getBoundingClientRect()
                 var oldX = this.model.forms[this.model.active_form].components[data.index].leftX
                 var oldY = this.model.forms[this.model.active_form].components[data.index].topY

                 var newLeftX = ev.clientX  - rrr.left - data.offsetX;
                 var newTopY = ev.clientY  - rrr.top - data.offsetY;


                 if (newLeftX < 0) {
                     newLeftX = 0
                 }
                 if (newTopY < 0) {
                     newTopY = 0
                 }

                 this.model.forms[this.model.active_form].components[data.index].leftX = newLeftX
                 this.model.forms[this.model.active_form].components[data.index].topY = newTopY
                 var diffX = this.model.forms[this.model.active_form].components[data.index].leftX - oldX
                 var diffY = this.model.forms[this.model.active_form].components[data.index].topY - oldY
                 this.model.forms[this.model.active_form].components[data.index].width -= diffX
                 this.model.forms[this.model.active_form].components[data.index].height -= diffY

                 this.model.active_component_index = data.index




             } else if (data.type == "resize_top_right") {
                 var rrr = document.getElementById(this.vb_grid_element_id).getBoundingClientRect()
                 var newX = (ev.clientX + 20) - rrr.left - data.offsetX;
                 var newY = ev.clientY - rrr.top - data.offsetY;


                 this.model.forms[this.model.active_form].components[data.index].width = newX - this.model.forms[this.model.active_form].components[data.index].leftX

                 var newHeight = (this.model.forms[this.model.active_form].components[data.index].topY + this.model.forms[this.model.active_form].components[data.index].height) - newY
                 this.model.forms[this.model.active_form].components[data.index].topY = newY
                 this.model.forms[this.model.active_form].components[data.index].height = newHeight


                 this.model.active_component_index = data.index

             } else if (data.type == "resize_bottom_left") {
                 var rrr = document.getElementById(this.vb_grid_element_id).getBoundingClientRect()
                 var newX = ev.clientX  - rrr.left - data.offsetX;
                 var newY = (ev.clientY + 20)  - rrr.top - data.offsetY;


                 var newWidth = (this.model.forms[this.model.active_form].components[data.index].leftX + this.model.forms[this.model.active_form].components[data.index].width) - newX
                 this.model.forms[this.model.active_form].components[data.index].leftX = newX
                 this.model.forms[this.model.active_form].components[data.index].width = newWidth

                 this.model.forms[this.model.active_form].components[data.index].height = newY - this.model.forms[this.model.active_form].components[data.index].topY
                 this.model.active_component_index = data.index



             } else if (data.type == "resize_bottom_right") {

                 var rrr = document.getElementById(this.vb_grid_element_id).getBoundingClientRect()
                 var newX = (ev.clientX + 20)  - rrr.left - data.offsetX;
                 var newY = (ev.clientY + 20) - rrr.top - data.offsetY;

                 var newWidth = newX - this.model.forms[this.model.active_form].components[data.index].leftX
                 this.model.forms[this.model.active_form].components[data.index].width = newWidth

                 var newHeight = newY - this.model.forms[this.model.active_form].components[data.index].topY
                 this.model.forms[this.model.active_form].components[data.index].height = newHeight

                 this.model.active_component_index = data.index
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
            this.active_property_index = null

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
            this.updatePropertySelector()

            this.refresh ++
         },

         myDataRenderFunction: function(data) {
             var center = ""
             if (data.app) {
                center = "<b style='font-size:14px;'>" + (data.app?data.app:data.form) + "</b> "

             } else if (data.component) {
                 center = "<b style='font-size:14px;'>" + data.form + "</b> " + data.component
             } else if (data.form) {
                 center = "<b style='font-size:14px;'>" + data.form + "</b> "
             }

             var template =
               "<div  style='overflow:hidden ;text-overflow: ellipsis;border-radius: 1px;margin: 0px;padding:0px;border:0px;font-size: 14px;'>" +
                    center +
               "</div>";
             return template;
         },



         updatePropertySelector: function() {
            if (!designMode){
                return
            }
            var mm = this
            document.getElementById("property_selector_parent").innerHTML=' <select id=property_selector ></select>'

            var sdata = []
            var indexProp = 0
            var selectedItem = null

            if (mm.model.app_selected || (!mm.model.active_component_index)) {

                if (mm.edited_app_component_id) {
                    sdata.push(
                        {
                            value: "" + indexProp,
                            app: mm.edited_app_component_id,
                            form: null,
                            component: null
                        })
                }

                if (mm.model.app_selected) {
                    selectedItem = indexProp
                }
                indexProp++

                var forms = mm.getForms()
                for (  var ere = 0; ere < forms.length; ere++  ) {
                    var form = forms[ ere ]
                    sdata.push(
                        {
                            value:      "" + indexProp,
                            app:        null,
                            form:       form.name,
                            component:  null
                        }
                    )
                    if ((!mm.model.app_selected) && (form.name == mm.model.active_form)) {
                        selectedItem = indexProp
                    }
                    indexProp++
                }

            } else if (mm.model.active_component_index) {

                sdata.push(
                    {
                        value:      "" + indexProp,
                        app:        null,
                        form:       mm.model.active_form,
                        component:  null
                    }
                )
                indexProp++

                var components = mm.getActiveFormComponents()
                for (  var ere = 0; ere < components.length; ere++  ) {
                    var component = components[ ere ]
                    sdata.push(
                        {
                            value:              "" + indexProp,
                            app:                null,
                            form:               mm.model.active_form,
                            component:          component.name,
                            component_index:    ere
                        }
                    )
                    if (mm.model.active_component_index == ere) {
                        selectedItem = indexProp
                    }
                    indexProp++
                }
            }



            selectProp = new Selectr(
                document.getElementById('property_selector'),
                {
                	renderOption: mm.myDataRenderFunction,
                    renderSelection: mm.myDataRenderFunction,
            		selectedValue: selectedItem,
                    data: sdata,
                    customClass: 'my-custom-selectr',
                    searchable: false
                });

            document.getElementsByClassName("selectr-selected")[0].style.padding = "1px"
            document.getElementsByClassName("selectr-selected")[0].style["border-top"] = "2px solid gray"
            document.getElementsByClassName("selectr-selected")[0].style["border-left"] = "2px solid gray"

            selectProp.on('selectr.select', function(option) {
                var dd = sdata[option.idx]
                if (dd.component) {
                    mm.select_component(dd.component_index)
                } else if (dd.form) {
                    mm.selectForm(dd.form)
                } else if (dd.app) {
                    mm.select_app()
                }
            });


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
            this.active_property_index = null
            this.model.app_selected = false
            this.model.active_component_index = index
            this.properties = []
            this.properties.push({   id:     "name",   name:   "Name",   type:   "String"    })
            this.properties.push({   id:     "base_component_id",   name:   "Type",   type:   "String" , readonly: true   })
            this.properties.push({   id:     "leftX",   name:   "X",   type:   "Number"    })
            this.properties.push({   id:     "topY",   name:   "Y",   type:   "Number"    })
            this.properties.push({   id:     "width",   name:   "Width",   type:   "Number"    })
            this.properties.push({   id:     "height",   name:   "Height",   type:   "Number"    })


            var compEvaled = this.getComponentProperties(this.model.forms[this.model.active_form].components[index].base_component_id)
            this.properties = this.properties.concat(compEvaled)
            this.updatePropertySelector()
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
        },





        //-------------------------------------------------------------------
        getText: async function() {
        //-------------------------------------------------------------------
            //console.log("2) VB: getText")
            await this.generateCodeFromModel()
            return this.text
        },




        //-------------------------------------------------------------------
        setText: function(textValue) {
        //-------------------------------------------------------------------
            //console.log("start setText")
            var mm = this
            this.text =  textValue
            var json2 = this.getJsonModelFromCode(  textValue  )
            //console.log("setText: mm.model = json2")
            mm.edited_app_component_id = saveHelper.getValueOfCodeString(textValue, "base_component_id")

            mm.model = json2
            mm.updatePropertySelector()
            mm.refresh ++
            //console.log("end setText")
        }
        ,
        //-------------------------------------------------------------------
        getJsonModelFromCode: function(  codeV  ) {
        //-------------------------------------------------------------------
            var mm = this
            mm.edited_app_component_id = saveHelper.getValueOfCodeString(codeV, "base_component_id")
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
            if (online && this.design_mode) {

            //console.log("start generateCodeFromModel")

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
                      local_app:                    false,
                      refresh: 0,
                      runtime_mode: runtimeMode,
                      component_usage:             new Object(),
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

              this.text = saveHelper.deleteCodeString(  this.text, "control_type")

              this.text = saveHelper.insertCodeString(  this.text,
                                                          "control_type",
                                                          "SYSTEM")

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

            //console.log("end generateCodeFromModel.Done")
            return
            }
        }

     }
     //*** COPY_END ***//
     ,
     data: function () {
       return {
           uid2:                        null,
           vb_grid_element_id:          null,
           vb_editor_element_id:        null,
           design_mode:                 designMode,
           runtime_mode:                runtimeMode,
           highlighted_control: null,
           edited_app_component_id:     null,
           event_code:                  null,
           text:                        texti,
           leftHandWidth:               100,
           right_mode:                  "project",
           add_property:                false,
           new_property_name: "",
           new_property_id: "",
           local_app:                    false,
           refresh:                     0,
           properties:                  [],
           read_only:                   false,
           selected_pane:               null,
           active_property_index:       null,
           available_components:        [],
           component_usage:             new Object(),
           form_runtime_info:           {},
           model:                      {
                                            next_id: 1,
                                            next_component_id: 1,
                                            max_form: 1,
                                            active_form: "Form_1",
                                            active_component_index: null,
                                            app_selected: false,
                                            default_form: "Form_1",
                                            app_properties: [],

                                            fields: [

                                                    ],

                                            forms: {
                                                "Form_1": {
                                                    name: "Form_1",
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
