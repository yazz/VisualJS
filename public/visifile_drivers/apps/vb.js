async function(args) {
/*
created_timestamp(1547200046854)
base_component_id("vb")
editors([
  "vb_editor_component"
])
read_only(true)
properties([
  {
    "id": "test",
    "name": "test",
    "type": "String"
  }
])//properties
formEditor({
  "next_id": 7,
  "max_form": 4,
  "active_form": "Form_1",
  "default_form": "Form_1",
  "app_selected": false,
  "id": "vb",
  "next_component_id": 116,
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
          "click_event": "var ins = todoInputBox.text\n\ntodoInputBox.text = \"\"\nsql(\"insert into items (id,name) values (?,?)\",\n          [new Date().getTime(),\n           ins])\ndisplay_out.text = sqlFirstCol(\"select name from items\")\n",
          "background_color": ""
        },
        {
          "name": "button_control_2",
          "base_component_id": "button_control",
          "leftX": 4,
          "topY": 299,
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
          "leftX": 33.5625,
          "topY": 9,
          "name": "title_label",
          "base_component_id": "label_control",
          "width": 112,
          "height": 34,
          "text": "Todo App",
          "background_color": ""
        },
        {
          "leftX": 190.4375,
          "topY": 300,
          "name": "button_control_104",
          "base_component_id": "button_control",
          "width": 146,
          "height": 55,
          "text": "Go to 3D",
          "background_color": "",
          "click_event": "mm.selectForm(\"form_3d\")"
        }
      ],
      "form_activate": "display_out.text = sqlFirstCol(\"select name from items\")"
    },
    "Form_2": {
      "name": "Form_2",
      "width": 400,
      "height": 400,
      "components": [
        {
          "name": "button_control_2",
          "base_component_id": "button_control",
          "leftX": 200,
          "topY": 300,
          "width": 200,
          "background_color": "blue",
          "height": 50,
          "text": "Go to Form 1",
          "click_event": "mm.selectForm(\"Form_1\")"
        }
      ]
    },
    "form_3d": {
      "name": "form_3d",
      "components": [
        {
          "leftX": 10.4375,
          "topY": 343.28125,
          "name": "button_control_107",
          "base_component_id": "button_control",
          "width": 182,
          "height": 58,
          "text": "Go to form 1",
          "background_color": "",
          "click_event": "mm.selectForm(\"Form_1\")"
        },
        {
          "leftX": 0,
          "topY": 0,
          "name": "threedee_control_108",
          "base_component_id": "threedee_control",
          "width": 274.9791564941406,
          "height": 206.8645782470703,
          "text": "",
          "background_color": "",
          "is_container": true,
          "hide_children": true,
          "has_details_ui": true
        },
        {
          "leftX": 48.48957824707031,
          "topY": 49.00349426269531,
          "parent": "threedee_control_108",
          "name": "threedee_item_control_109",
          "base_component_id": "threedee_item_control",
          "width": 100,
          "height": 100,
          "text": "",
          "position": "-2.1 4 -10",
          "index_in_parent_array": 2
        },
        {
          "leftX": 52.486106872558594,
          "topY": 110.00001525878906,
          "parent": "threedee_control_108",
          "name": "threedee_item_control_110",
          "base_component_id": "threedee_item_control",
          "width": 100,
          "height": 100,
          "text": "",
          "position": "-2.1 4 -10",
          "index_in_parent_array": 3
        },
        {
          "leftX": 65.48957443237305,
          "topY": 50.00349426269531,
          "parent": "threedee_control_108",
          "name": "threedee_item_control_111",
          "base_component_id": "threedee_item_control",
          "width": 100,
          "height": 100,
          "text": "",
          "position": "-2.1 4 -10",
          "index_in_parent_array": 4
        },
        {
          "leftX": 32.486106872558594,
          "topY": 95.00001525878906,
          "parent": "threedee_control_108",
          "name": "threedee_item_control_112",
          "base_component_id": "threedee_item_control",
          "width": 100,
          "height": 100,
          "text": "",
          "position": "-2.1 4 -10",
          "index_in_parent_array": 5
        },
        {
          "leftX": 86.4861068725586,
          "topY": 71.00001525878906,
          "parent": "threedee_control_108",
          "name": "threedee_item_control_113",
          "base_component_id": "threedee_item_control",
          "width": 100,
          "height": 100,
          "text": "",
          "position": "-2.1 4 -10",
          "index_in_parent_array": 6
        },
        {
          "leftX": 67.4861068725586,
          "topY": 89.00001525878906,
          "parent": "threedee_control_108",
          "name": "threedee_item_control_114",
          "base_component_id": "threedee_item_control",
          "width": 100,
          "height": 100,
          "text": "",
          "position": "-2.1 4 -10",
          "index_in_parent_array": 7
        },
        {
          "leftX": 70.4861068725586,
          "topY": 86.00001525878906,
          "parent": "threedee_control_108",
          "name": "threedee_item_control_115",
          "base_component_id": "threedee_item_control",
          "width": 100,
          "height": 100,
          "text": "",
          "position": "-2.1 4 -10",
          "index_in_parent_array": 8
        }
      ],
      "width": 298.125,
      "height": 401.28125
    }
  },
  "active_component_index": null
})//formEditor
control_type("SYSTEM")
visibility("PUBLIC")
display_name("VB")
uses_javascript_librararies(["advanced_bundle"])
sub_components(["app_editor_3","appEmbed","vb_editor_component","input_control","button_control","label_control","threedee_item_control","threedee_control"])
is_app(true)
description('VB App')
logo_url("data:image/jpeg;base64,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")
*/

    //** gen_start **//
                var mm = null
                var texti = null
                var designMode = false
                var runtimeMode = true
                Vue.component('vb', {
      props: [ "args"],
      template:
`<div   v-bind:id='uid2'
        v-if='uid2 != null'
        v-bind:style='"width: 100%; height: 100%; " + (design_mode?"background: white;":"")'>


    <div style='box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);background-color: lightgray; padding: 5px; padding-left: 15px;padding-bottom: 10px;' v-if='design_mode' >

        <slot style='display: inline-block;float: left;' v-if='text'>
        </slot>


     </div>


    <div    v-bind:id='vb_editor_element_id' v-if='vb_editor_element_id != null'
            style='position:relative;display: flex;'
            v-on:drop="dropEditor($event)"
            v-on:ondragover="allowDropEditor($event)">






            <!--
                    -----------------------------------------

                        The left section of the UI editor

                    -----------------------------------------
            -->
            <div    v-if='design_mode'
                v-on:click='selected_pane = "blocks";'
                v-bind:style='(design_mode?"border: 4px solid lightgray;":"") + " width: " + leftHandWidth + "px;height: 75vmin; display: inline-block;overflow-x: none;overflow-y: auto;vertical-align: top; background-color: lightgray;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);float:left;"'>

            <div    v-bind:style='"font-family:verdana;font-size: 13px;border-radius: 3px;padding: 4px; margin-bottom: 10px;box-shadow: 2px 2px 10px lightgray;"'
                    v-bind:class='(selected_pane == "blocks"?"selected_pane_title":"unselected_pane_title") '>
                Blocks
            </div>
            <div class='container' style=''>
                <div class='row'>
                    <div    class='col-md-6'
                            v-on:click='highlighted_control = null;'
                            v-bind:style='"border-radius: 3px;width:50px;height:50px; margin: 0px;border: 0px;padding:4px;overflow-x:hidden;overflow-y:hidden;background-color: " + ((!highlighted_control)?"#E8E8E8;border-left: 2px solid gray;border-top: 2px solid gray;":"lightgray;")'>
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





        <!--

                The main center section of the UI editor

        -->
        <div v-bind:style='"display: flex;width:100%;" + (design_mode?"background-color: darkgray;":"background-color: white;")'>



            <!--

                    The code editor for events

            -->


            <div    v-if='(!design_mode && design_mode_pane) || (design_mode && (design_mode_pane.type=="event_editor"))'
                    v-bind:style='"margin: 2px; display: inline-block; vertical-align: top; width: 100%;height: 65vh ;" + (design_mode?"border: 0px solid lightgray; padding:0px;margin: 15px;":"margin: 0px;" ) '>

                <div    v-if='design_mode'
                        style='font-family:verdana;font-size: 13px;font-weight:bold;border-radius: 0px;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);background-image: linear-gradient(to right,  #000099, lightblue); color: white; border: 4px solid lightgray; padding:4px; margin:0;border-bottom: 0px;'>

                    <div    style='height: 30px;' >
                        Code
                        <button  type=button class=' btn btn-danger btn-sm'
                                 style="float: right;box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 8px 0px, rgba(0, 0, 0, 0.19) 0px 6px 20px 0px;margin-bottom: 4px;"
                                 v-on:click='gotoDragDropEditor()' >x</button>
                    </div>

                    <div    id='ui_code_editor'>
                    </div>

                </div>
            </div>




            <!--

                    The control details editor

            -->


            <div    v-if='(!design_mode && design_mode_pane) || (design_mode && (design_mode_pane.type=="control_details_editor"))'
                    v-bind:style='"box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);margin: 2px; display: inline-block; vertical-align: top; width: 100%;height: 65vh ;" + (design_mode?"border: 0px solid lightgray; padding:0px;margin: 15px;":"margin: 0px;" ) '>

                <div    v-if='design_mode'
                        style='font-family:verdana;font-size: 13px;font-weight:bold;border-radius: 0px;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);background-image: linear-gradient(to right,  #000099, lightblue); color: white; border: 4px solid lightgray; padding:4px; margin:0;border-bottom: 0px;'>

                    <div    style='height: 30px;' >
                        Control details
                        <button  type=button class=' btn btn-danger btn-sm'
                                 style="float: right;box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 8px 0px, rgba(0, 0, 0, 0.19) 0px 6px 20px 0px;margin-bottom: 4px;"
                                 v-on:click='gotoDragDropEditor()' >x</button>
                    </div>


                </div>

                <div  v-bind:style='"border: 5px solid lightgray;background: white;;overflow:none;height:100%; overflow: auto;"'>

                    <component  v-bind:id='model.active_form + "_" + model.forms[model.active_form].components[model.active_component_detail_index].name + (design_mode?"_design":"")'
                                v-bind:refresh='refresh'
                                design_mode='detail_editor'
                                v-bind:delete_component='childDeleteComponent'
                                v-bind:select_component='childSelectComponent'
                                v-bind:children='getChildren( model.forms[model.active_form].components[model.active_component_detail_index].name)'
                                v-on:send="processControlEvent"
                                v-bind:is='model.forms[model.active_form].components[model.active_component_detail_index].base_component_id'
                                v-bind:name='model.forms[model.active_form].components[model.active_component_detail_index].name + (design_mode?"_design":"")'
                                v-bind:args='model.forms[model.active_form].components[model.active_component_detail_index]'>

                                <template       slot-scope="child_components"
                                                v-bind:refresh='refresh'
                                                style='position:relative;'>

                                    <component  v-for='child_item  in  getChildren(model.forms[model.active_form].components[model.active_component_detail_index].name)'
                                                v-bind:design_mode='design_mode'
                                                v-bind:refresh='refresh'
                                                v-bind:style='"z-index:100000;position: absolute; top: " + child_item.topY + "px; left: " + child_item.leftX + "px;height:" + child_item.height + "px;width:" + child_item.width + "px;overflow:auto;"'
                                                v-bind:id='model.active_form + "_" + model.forms[model.active_form].components[child_item.index_in_parent_array].name + (design_mode?"_design":"")'
                                                v-on:send="processControlEvent"
                                                v-bind:is='child_item.base_component_id'
                                                v-bind:name='child_item.name + (design_mode?"_design":"")'
                                                v-bind:args='model.forms[model.active_form].components[child_item.index_in_parent_array]'>
                                    </component>

                                </template>
                     </component>
                 </div>
             </div>








            <!--

                    The drag drop UI editor.

                    but...

                    Also the main vire of the App

            -->

            <div    v-if='(!design_mode) || (design_mode && (design_mode_pane.type=="drag_drop"))'
                    v-bind:style='(design_mode?"box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 8px 0px, rgba(0, 0, 0, 0.19) 0px 6px 20px 0px;":"") + "margin: 2px; display: inline-block; vertical-align: top;  width: 95%;height: 65vh ;" + (design_mode?"border: 0px solid lightgray; padding:0px;margin: 0px;margin-left:15px;margin-top:15px;":"margin: 0px;" ) '>

                <div    v-if='design_mode'
                        style='display:inline-block;font-family:verdana;font-size: 13px;font-weight:bold;border-radius: 0px;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);background-image: linear-gradient(to right,  #000099, lightblue); color: white; border: 4px solid lightgray; padding:4px; margin:0;border-bottom: 0px;width:100%;'>

                    <img
                        src='/driver_icons/form.png'
                        style='width: 20px; margin-right: 10px;'
                        class='img-fluid'>
                     </img>
                     {{model.active_form}} (Form)
                </div>
                <div style=''></div>



                <div style='width:100%;background-color:white;height: 100%;position:relative;'>

                    <!-- INACTIVE FORM RESIZERS -->
                    <div    v-if='design_mode && (!isValidObject(model.active_component_index))'
                            v-bind:style='"display:inline-block;background-color: white; border: 3px solid gray; margin:0;width:12px;height:12px;position:absolute;left:2px;top:2px;"'>
                    </div>
                    <div    v-if='design_mode && (!isValidObject(model.active_component_index))'
                            v-bind:style='"display:inline-block;background-color: white; border: 3px solid gray; margin:0;width:12px;height:12px;position:absolute;left:" + (7 + (model.forms[model.active_form].width/2)) +  "px;top:2px;"'>
                    </div>
                    <div    v-if='design_mode && (!isValidObject(model.active_component_index))'
                            v-bind:style='"display:inline-block;background-color: white; border: 3px solid gray; margin:0;width:12px;height:12px;position:absolute;left:" + (15 +model.forms[model.active_form].width) +  "px;top:2px;"'>
                    </div>
                    <div    v-if='design_mode && (!isValidObject(model.active_component_index))'
                            v-bind:style='"display:inline-block;background-color: white; border: 3px solid gray; margin:0;width:12px;height:12px;position:absolute;left:2px;top:" + (7 + (model.forms[model.active_form].height/2)) +  "px;"'>
                    </div>
                    <div    v-if='design_mode && (!isValidObject(model.active_component_index))'
                            v-bind:style='"display:inline-block;background-color: white; border: 3px solid gray; margin:0;width:12px;height:12px;position:absolute;left:2px;top:" + (15 + model.forms[model.active_form].height) +  "px;"'>
                    </div>

                    <!-- ACTIVE FORM RESIZERS -->
                    <!-- bottom right -->
                    <div    v-if='design_mode && (!isValidObject(model.active_component_index))'
                            v-bind:style='"display:inline-block;background-color: gray; border: 3px solid gray; margin:0;width:12px;height:12px;position:absolute;left:" + (15 +model.forms[model.active_form].width) +  "px;top:" + (15 + (model.forms[model.active_form].height)) +  "px;"'
                            v-bind:draggable='true'
                            v-on:dragstart='drag($event,{
                               type:        "resize_form_bottom_right",
                               form_name:    model.active_form
                            })'
                            >
                    </div>
                    <!-- right -->
                    <div    v-if='design_mode && (!isValidObject(model.active_component_index))'
                            v-bind:style='"display:inline-block;background-color: gray; border: 3px solid gray; margin:0;width:12px;height:12px;position:absolute;left:" + (15 +model.forms[model.active_form].width) +  "px;top:" + (7 + (model.forms[model.active_form].height/2)) +  "px;"'
                            v-bind:draggable='true'
                            v-on:dragstart='drag($event,{
                               type:        "resize_form_right",
                               form_name:    model.active_form
                            })'
                            >
                    </div>
                    <!-- bottom -->
                    <div    v-if='design_mode && (!isValidObject(model.active_component_index))'
                            v-bind:style='"display:inline-block;background-color: gray; border: 3px solid gray; margin:0;width:12px;height:12px;position:absolute;left:" + (7 +model.forms[model.active_form].width/2) +  "px;top:" + (15 + (model.forms[model.active_form].height)) +  "px;"'
                            v-bind:draggable='true'
                            v-on:dragstart='drag($event,{
                               type:        "resize_form_bottom",
                               form_name:    model.active_form
                            })'
                            >
                    </div>




                    <div            v-bind:id='vb_grid_element_id'  v-if='vb_grid_element_id != null'
                                    v-on:drop="drop($event)"
                                    v-bind:refresh='refresh'
                                    v-on:ondragover="allowDrop($event)"
                                    v-bind:class='(design_mode?"dotted":"" )'
                                    v-on:click='if (design_mode) {$event.stopPropagation();selectForm(model.active_form, true)}'
                                    v-bind:style='"position:absolute;display: inline-block; vertical-align: top; width: " + model.forms[model.active_form].width +  ";height: " + model.forms[model.active_form].height +  " ;" + (design_mode?"left:15px;top:15px;border: 4px solid lightgray;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);":"border: 0px;" ) '>


                        <div    v-bind:refresh='refresh'
                                style='position:absolute;left:0px;top:0px;z-index:1000000;opacity:1;'>

                            <!-- ACTIVE CONTROL RESIZERS -->
                            <!-- top left -->
                            <div    v-if='design_mode && isValidObject(model.active_component_index) && isVisible(model.active_form,model.active_component_index)'
                                    v-bind:style='"z-index:10000000;display:inline-block;background-color: gray; border: 3px solid gray; margin:0;width:12px;height:12px;position:absolute;left:" +
                                        (getLeft(model.active_form,model.active_component_index) - 15) +  "px;top:" +
                                        ((getTop(model.active_form,model.active_component_index)) - 15) +  "px;"'
                                    v-bind:draggable='true'
                                    v-on:dragstart='drag($event,{
                                       type:   "resize_top_left",
                                       text:    model.forms[model.active_form].components[model.active_component_index].base_component_id,
                                       index:   model.active_component_index
                                    })'>
                            </div>

                            <!-- top middle -->
                            <div    v-if='design_mode && isValidObject(model.active_component_index) && isVisible(model.active_form,model.active_component_index)'
                                    v-bind:style='"z-index:1000;display:inline-block;background-color: gray; border: 3px solid gray; margin:0;width:12px;height:12px;position:absolute;left:" +
                                        ((getLeft(model.active_form,model.active_component_index)) + (model.forms[model.active_form].components[model.active_component_index].width/2) - 7) +  "px;top:" +
                                        ((getTop(model.active_form,model.active_component_index)) - 15) +  "px;"'
                                    v-bind:draggable='true'
                                    v-on:dragstart='drag($event,{
                                                                type:   "resize_top",
                                                                text:    model.forms[model.active_form].components[model.active_component_index].base_component_id,
                                                                index:   model.active_component_index
                                                             })'>
                            </div>
                            <!-- top right -->
                            <div    v-if='design_mode && isValidObject(model.active_component_index) && isVisible(model.active_form,model.active_component_index)'
                                    v-bind:style='"z-index:1000;display:inline-block;background-color: gray; border: 3px solid gray; margin:0;width:12px;height:12px;position:absolute;left:" +
                                        ((getLeft(model.active_form,model.active_component_index)) + (model.forms[model.active_form].components[model.active_component_index].width) ) +  "px;top:" +
                                        ((getTop(model.active_form,model.active_component_index)) - 15) +  "px;"'
                                        v-bind:draggable='true'
                                        v-on:dragstart='drag($event,{
                                           type:   "resize_top_right",
                                           text:    model.forms[model.active_form].components[model.active_component_index].base_component_id,
                                           index:   model.active_component_index
                                           })'>
                            </div>

                            <!-- middle left -->
                            <div    v-if='design_mode && isValidObject(model.active_component_index) && isVisible(model.active_form,model.active_component_index)'
                                    v-bind:style='"z-index:1000;display:inline-block;background-color: gray; border: 3px solid gray; margin:0;width:12px;height:12px;position:absolute;left:" +
                                        ((getLeft(model.active_form,model.active_component_index)) - 15) +  "px;top:" +
                                        ((getTop(model.active_form,model.active_component_index)) + ((model.forms[model.active_form].components[model.active_component_index].height / 2)) - 7) +  "px;"'
                                    v-bind:draggable='true'
                                    v-on:dragstart='drag($event,{
                                                                type:   "resize_left",
                                                                text:    model.forms[model.active_form].components[model.active_component_index].base_component_id,
                                                                index:   model.active_component_index
                                                             })'>
                            </div>
                            <!-- middle right -->
                            <div    v-if='design_mode && isValidObject(model.active_component_index) && isVisible(model.active_form,model.active_component_index)'
                                    v-bind:style='"z-index:1000;display:inline-block;background-color: gray; border: 3px solid gray; margin:0;width:12px;height:12px;position:absolute;left:" +
                                        ((getLeft(model.active_form,model.active_component_index)) + (model.forms[model.active_form].components[model.active_component_index].width)) +  "px;top:" +
                                        ((getTop(model.active_form,model.active_component_index)) + ((model.forms[model.active_form].components[model.active_component_index].height / 2)) - 7) +  "px;"'
                                    v-bind:draggable='true'
                                    v-on:dragstart='drag($event,{
                                                                type:   "resize_right",
                                                                text:    model.forms[model.active_form].components[model.active_component_index].base_component_id,
                                                                index:   model.active_component_index
                                                             })'>
                            </div>
                            <!-- bottom left -->
                            <div    v-if='design_mode && isValidObject(model.active_component_index) && isVisible(model.active_form,model.active_component_index)'
                                    v-bind:style='"z-index:1000;display:inline-block;background-color: gray; border: 3px solid gray; margin:0;width:12px;height:12px;position:absolute;left:" +
                                        ((getLeft(model.active_form,model.active_component_index)) - 15) +  "px;top:" +
                                        ((getTop(model.active_form,model.active_component_index)) + ((model.forms[model.active_form].components[model.active_component_index].height)) + 2) +  "px;"'
                                        v-bind:draggable='true'
                                        v-on:dragstart='drag($event,{
                                                                    type:   "resize_bottom_left",
                                                                    text:    model.forms[model.active_form].components[model.active_component_index].base_component_id,
                                                                    index:   model.active_component_index
                                                                 })'>
                            </div>
                            <!-- bottom middle -->
                            <div    v-if='design_mode && isValidObject(model.active_component_index) && isVisible(model.active_form,model.active_component_index)'
                                    v-bind:style='"z-index:1000;display:inline-block;background-color: gray; border: 3px solid gray; margin:0;width:12px;height:12px;position:absolute;left:" +
                                        ((getLeft(model.active_form,model.active_component_index)) + (model.forms[model.active_form].components[model.active_component_index].width/2) - 7) +  "px;top:" +
                                        ((getTop(model.active_form,model.active_component_index)) + ((model.forms[model.active_form].components[model.active_component_index].height)) + 2) +  "px;"'
                                    v-bind:draggable='true'
                                    v-on:dragstart='drag($event,{
                                                                type:   "resize_bottom",
                                                                text:    model.forms[model.active_form].components[model.active_component_index].base_component_id,
                                                                index:   model.active_component_index
                                                             })'>
                            </div>

                            <!-- bottom right -->
                            <div    v-if='design_mode && isValidObject(model.active_component_index) && isVisible(model.active_form,model.active_component_index)'
                                    v-bind:style='"z-index:1000;display:inline-block;background-color: gray; border: 3px solid gray; margin:0;width:12px;height:12px;position:absolute;left:" +
                                        ((getLeft(model.active_form,model.active_component_index)) + (model.forms[model.active_form].components[model.active_component_index].width) ) +  "px;top:" +
                                        ((getTop(model.active_form,model.active_component_index)) + ((model.forms[model.active_form].components[model.active_component_index].height)) + 2) +  "px;"'
                                    v-bind:draggable='true'
                                    v-on:dragstart='drag($event,{
                                                                   type:   "resize_bottom_right",
                                                                   text:    model.forms[model.active_form].components[model.active_component_index].base_component_id,
                                                                   index:   model.active_component_index
                                                                        })'>
                            </div>





                            <!-- DELETE -->
                            <div     v-if='design_mode && isValidObject(model.active_component_index) && isVisible(model.active_form,model.active_component_index)'
                                     v-bind:refresh='refresh'
                                     class='btn btn-danger'
                                     v-bind:style='"box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 8px 0px, rgba(0, 0, 0, 0.19) 0px 6px 20px 0px;padding:0px; z-index: 2147483647;opacity:1;position: absolute; "  +
                                        "left: " + ((getLeft(model.active_form,model.active_component_index)) + (model.forms[model.active_form].components[model.active_component_index].width) + 15) + "px;" +
                                        "top:  " + ((getTop(model.active_form,model.active_component_index)) - 35) +  "px;" +
                                        "width: 20px; height: 20px; line-height:20px;text-align: center;vertical-align: middle;"'
                                     v-on:click='$event.stopPropagation();deleteComponent(model.active_component_index)'>

                                    X

                            </div>


                            <!-- More details ... button -->
                            <div     v-if='design_mode && isValidObject(model.active_component_index) && isVisible(model.active_form,model.active_component_index) && hasMoreDetailsUi(model.active_form,model.active_component_index)'
                                     v-bind:refresh='refresh'
                                     class='btn btn-info'
                                     v-bind:style='"box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 8px 0px, rgba(0, 0, 0, 0.19) 0px 6px 20px 0px;padding:0px; z-index: 2147483647;opacity:1;position: absolute; "  +
                                        "left: " + ((getLeft(model.active_form,model.active_component_index)) + (model.forms[model.active_form].components[model.active_component_index].width) + 15) + "px;" +
                                        "top:  " + ((getTop(model.active_form,model.active_component_index)) + (model.forms[model.active_form].components[model.active_component_index].height) + 15) +  "px;" +
                                        "width: 20px; height: 20px; line-height:20px;text-align: center;vertical-align: middle;"'
                                     v-on:click='$event.stopPropagation();showComponentDetailedDesignUi(model.active_component_index)'>

                                    ...

                            </div>





                            <div    v-bind:refresh='refresh'
                                    v-for='(item,index) in getActiveFormComponents()'
                                    ondrop="return false;"
                                    v-on:click='if ( isVisible(model.active_form,index)){ $event.stopPropagation();selectComponent(index,true); }'
                                    v-bind:style='((design_mode && isVisible(model.active_form,index))?"border: 1px solid black;background: white;":"") +
                                                    "position: absolute;top: " + getTop(model.active_form,index) + ";left:" + getLeft(model.active_form,index) + ";height:" + item.height + "px;width:" + item.width + "px;;overflow:none;"'>

                                <div ondrop="return false;"
                                     v-bind:style='"position: absolute; top: 0px; left: 0px;height:" + item.height + "px;width:" + item.width + "px;overflow:auto;"'>
                                    <component  v-bind:id='model.active_form + "_" + model.forms[model.active_form].components[index].name + (design_mode?"_design":"")'
                                                v-bind:refresh='refresh'
                                                v-bind:design_mode='design_mode'
                                                v-bind:children='getChildren(item.name)'
                                                v-on:send="processControlEvent"
                                                v-bind:is='item.base_component_id'
                                                v-if='!item.parent'
                                                v-bind:name='item.name + (design_mode?"_design":"")'
                                                v-bind:args='model.forms[model.active_form].components[index]'>

                                        <template       slot-scope="child_components"
                                                        v-bind:refresh='refresh'
                                                        style='position:relative;'>

                                            <component  v-for='child_item  in  getChildren(item.name)'
                                                        v-bind:design_mode='design_mode'
                                                        v-bind:refresh='refresh'
                                                        v-bind:style='"z-index:100000;position: absolute; top: " + child_item.topY + "px; left: " + child_item.leftX + "px;height:" + child_item.height + "px;width:" + child_item.width + "px;overflow:auto;"'
                                                        v-bind:id='model.active_form + "_" + model.forms[model.active_form].components[child_item.index_in_parent_array].name + (design_mode?"_design":"")'
                                                        v-on:send="processControlEvent"
                                                        v-bind:is='child_item.base_component_id'
                                                        v-bind:name='child_item.name + (design_mode?"_design":"")'
                                                        v-bind:args='model.forms[model.active_form].components[child_item.index_in_parent_array]'>
                                            </component>

                                        </template>

                                    </component>
                                </div>

                                <div    v-bind:style='"position: absolute; top: 0px; left: 0px;z-index: " + (item.is_container?"1":"10000000") + ";width: 100%;height: 100%;border: 1px solid black;"'
                                        v-bind:draggable='design_mode'
                                        v-if='design_mode && isVisible(model.active_form,index)'
                                        ondrop="return false;"
                                        v-on:dragstart='drag($event,{
                                           type:   "move_component",
                                           text:    item.base_component_id,
                                           index:   index
                                        })'>

                                    <div    v-if='design_mode && isVisible(model.active_form,index)'
                                            ondrop="return false;"
                                            v-bind:refresh='refresh'
                                            v-bind:style='"position: absolute; top: 0px; left: 0px;z-index: 10000000;width: 100%;height: 100%; background-color: lightgray;" +
                                                            ((index == model.active_component_index)?"opacity: 0;":"opacity: .6;") '>

                                    </div>
                                </div>





                            </div>
                        </div>

                    </div>
                </div>
            </div>




        </div>








        <!--
            ****************************************************************
            *                                                              *
            *             The right section of the UI editor               *
            *                                                              *
            ****************************************************************
        -->

        <div    v-if='design_mode'
                v-bind:style='(design_mode?"border: 4px solid lightgray;box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 8px 0px, rgba(0, 0, 0, 0.19) 0px 6px 20px 0px;":"") + " float:right;top:0px;right:0px;width: 400px;height: 75vmin; display: inline-block;overflow-x: none;overflow: hidden;vertical-align: top;padding:0px;height:75vmin;background-color: lightgray; "'
                v-bind:refresh='refresh'>






            <div    id='right_project_pane'
                    v-bind:class='(right_mode == "project"?"right_project_pane_expanded":"right_project_pane_collapsed")''
                    v-bind:refresh='refresh'
                    v-bind:style='"padding:0px; border: 4px solid lightgray;white-space:nowrap"'>

                <div v-bind:style='"border-radius: 3px;  padding: 4px;overflow-x:none;height: 40px;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);font-family:verdana;font-size: 13px;" '
                     v-bind:class='(selected_pane == "project"?"selected_pane_title":"unselected_pane_title") '
                     v-on:click='$event.stopPropagation();var s = (right_mode == "properties"?"project":"project");selected_pane = "project";chooseRight(s);'
                     >

                     Project explorer

                    <button type=button class='btn btn-sm btn-warning'
                            v-bind:style='"float: right;" + (right_mode == "project"?"":"display:;font-family:verdana;font-size: 13px;")'
                            v-on:click='$event.stopPropagation();selected_pane = "project"; chooseRight("project");addForm()'  >

                         Add form

                    </button>
                </div>


                <div  v-bind:style='"font-family:verdana;font-size: 13px;border-radius: 3px; padding:4px; border-right:2px solid gray;border-bottom:2px solid gray; margin-top:2px;;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);height:80%;background-color:lightgray;"  + (right_mode == "project"?"":"display:none;")'>
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
                                        v-on:click='$event.stopPropagation();selected_pane = "project";selectComponent(index)'
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

                <div    v-bind:style='"border-radius: 3px;padding: 4px;height: 40px;overflow-x:none;white-space:nowrap;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);overflow:hidden ;text-overflow: ellipsis;font-family:verdana;font-size: 13px;"'
                        v-bind:class='(selected_pane == "properties"?"selected_pane_title_slower":"unselected_pane_title_slower") '
                        v-on:click='selected_pane = "properties";chooseRight("properties");'>
                    Properties - {{isValidObject(model.active_component_index)?model.forms[model.active_form].components[model.active_component_index].name + " (Component)" : model.active_form + " (Form)"}}
                </div>


                <div id='property_selector_parent' style='margin: 5px;'>

                </div>

                <div  style="border-radius: 3px; padding:4px; border-right:2px solid gray;border-bottom:2px solid gray; margin-top:2px;;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);height:65%;">
                    <div    style="border-radius: 3px;overflow-y:scroll; padding:0px; border: 0px solid lightgray;border-left: 2px solid gray;border-top: 2px solid gray; background-color:white;height:100%;">


                        <div    v-for='property in properties'
                                style='font-family:verdana;font-size: 13px;border-bottom: 1px solid lightgray;padding:0px;margin:0px;'
                                >

                            <div style='width:100%;padding:0px;margin:0px;display:flex;'
                                 v-if='!property.hidden'>
                                <div
                                        v-bind:style='"text-overflow: ellipsis;white-space: pre-line;vertical-align: top;display:flex;width:40%;margin: 0px;font-family:verdana;font-size: 13px;padding-left: 1px;padding-top:0px;padding-bottom:0px;" + (active_property_index == property.name?"background-color:#000099;color:white;":"")'
                                        v-on:click='selected_pane = "properties";active_property_index = property.name;'>{{property.name}}
                                </div>

                                <div style='display:flex;width:57%;padding:0px;padding-left:3px; border-left: 1px solid lightgray;'
                                     v-on:click='selected_pane = "properties";'>
                                    <div v-if='!property.readonly' style="width:100%">
                                        <div    v-if="(property.type  == 'String')  || (property.type  == 'Number')">
                                            <input
                                                    @change='setVBEditorProperty($event, property)'
                                                    v-bind:value='getVBEditorProperty(property)'
                                                    style='width: 100%;border: 0px;font-family:verdana;font-size: 13px;padding:0px;'>
                                            </input>
                                        </div>

                                        <div    v-if="(property.type  == 'Image') ">
                                            <input type="file"
                                                   id="image_file"
                                                   @change="previewUpload(property)">
                                            </input>
                                        </div>

                                        <div v-if="(property.type  == 'Event')  " style="width:100%">
                                            <div        style='margin-top:2px;margin-bottom:2px;border-right: 2px solid gray;border-bottom: 2px solid gray;background-color: darkgray;float: right; padding:0px; padding-right:5px;padding-left:20px;height: 20px;color: white;border-radius: 3px;font-family:verdana;font-size: 13px;font-style:bold;'
                                                        v-on:click='$event.stopPropagation();editAsCode({
                                                            active_form:            model.active_form,
                                                            active_component_index: model.active_component_index,
                                                            property_id:            property.id
                                                        })'  >
                                                ...
                                            </div>
                                        </div>
                                    </div>

                                    <div v-if='property.readonly'>
                                        <div    v-if='model.active_component_index != null'
                                                style='padding:0px;font-family:verdana;font-size: 13px;'
                                                class='col-md-12 small'>

                                            {{model.forms[model.active_form].components[model.active_component_index][property.id]}}

                                        </div>

                                        <div v-if='(model.active_component_index == null) && (model.active_form != null) && (model.app_selected == false)' class='col-md-12 small'   v-model='model.forms[model.active_form][property.id]'>
                                        </div>

                                        <div    v-if='model.app_selected'
                                                style='padding:0px;font-family:verdana;font-size: 13px;'
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
                                            style='font-family:verdana;font-size: 13px;'
                                            v-on:click='$event.stopPropagation();addProperty()'  >
                                    Add property
                                </button>
                            </div>
                        </div>

                        <div v-if='(model.app_selected) && (add_property)' class='row'>
                            <div    style='font-family:verdana;font-size: 13px;'
                                    class='col-md-12 small'>
                                Add a property
                            </div>
                        </div>

                        <div v-if='(model.app_selected) && (add_property)' class='row'>
                            <div    style='font-family:verdana;font-size: 13px;'
                                    class='col-md-4'>
                               ID
                            </div>

                            <input  style='font-family:verdana;font-size: 13px;'
                                    class='col-md-7 small'
                                    placeholder='background_color'
                                    v-model='new_property_id'>
                            </input>
                        </div>

                        <div v-if='(model.app_selected) && (add_property)' class='row'>
                            <div    style='font-family:verdana;font-size: 13px;'
                                    class='col-md-4'>
                                Name
                            </div>

                            <input  class='col-md-7 small'
                                    placeholder='Background Color'
                                    style='border:0px;font-family:verdana;font-size: 13px;'
                                    v-model='new_property_name'>
                            </input>
                        </div>

                        <div v-if='(model.app_selected) && (add_property)' class='row'>
                            <div class='col-md-12'>
                                <button style='font-family:verdana;font-size: 13px;'
                                        type=button class='btn btn-sm btn-info'
                                        v-on:click='$event.stopPropagation();addPropertyCancel()'  >
                                    Cancel
                                </button>

                                <button style='font-family:verdana;font-size: 13px;'
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



           //console.log("Time " + (ttq++) + ": " + (new Date().getTime()- startTime))


           mm.$forceUpdate();
           //console.log("Time " + (ttq++) + ": " + (new Date().getTime()- startTime))

           mm.updatePropertySelector()

           texti = null

           setTimeout(function(){
                mm.selectForm(mm.model.default_form)
           },500)


           mm.$root.$on('message', async function(text) {
               if (text.type == "delete_component") {
                   //alert("Found: " + text.component_index)
                   //alert(JSON.stringify(mm.model.forms[mm.model.active_form].components[text.component_index],null,2))
                   mm.model.forms[mm.model.active_form].components.splice(text.component_index, 1);
                   //zzz
                   //mm.design_mode_pane.type = "drag_drop";



               } else if (text.type == "select_component") {
                  mm.selectComponent(text.component_index, true);
              }

           })

     },






     methods: {

         refreshControlIndexes: function() {
            if (this.model.active_component_detail_name) {

                var ccc = mm.model.forms[this.model.active_form].components
                for (var ytr = 0;ytr < ccc.length;ytr++) {
                   if (this.model.active_component_detail_name == ccc[ytr].name) {
                       this.model.active_component_detail_name = ytr
                       break
                   }
                }

            } else {
                this.model.active_component_detail_name = null

            }

         }
         ,

         hasMoreDetailsUi: function(formName, componentIndex) {
             var mm = this
             var component = mm.model.forms[formName].components[componentIndex]
             if (isValidObject(component.parent)) {
                 var ccc = mm.model.forms[formName].components
                 for (var ytr = 0;ytr < ccc.length;ytr++) {
                    if (component.parent == ccc[ytr].name) {
                        if (ccc[ytr].hide_children) {
                            return false
                        }
                        break
                    }
                 }
             }

             if (component.has_details_ui) {
                 return true
             }


             return false
         }
         ,
        isVisible: function(formName, componentIndex) {
            var mm = this
            var component = mm.model.forms[formName].components[componentIndex]
            if (!component) {
                return false
            }
            if (component.hidden) {
                return false
            }

            if (isValidObject(component.parent)) {
                var ccc = mm.model.forms[formName].components
                for (var ytr = 0;ytr < ccc.length;ytr++) {
                    if (ccc[ytr]) {
                        if (component.parent == ccc[ytr].name) {
                            if (ccc[ytr].hide_children) {
                                return false
                            }
                            break
                        }
                    }
                }
            }

            return true
        }
        ,
        getLeft: function(formName, componentIndex) {
            var mm = this
            var component = mm.model.forms[formName].components[componentIndex]
            if (!component) {
                return 0
            }
            var left = component.leftX

            if (isValidObject(component.parent)) {
                var ccc = mm.model.forms[formName].components
                for (var ytr = 0;ytr < ccc.length;ytr++){
                   if (component.parent == ccc[ytr].name) {
                       left = left + ccc[ytr].leftX
                       break
                   }
                }
            }


            return left
        }
        ,
        getTop: function(formName, componentIndex) {
            var mm = this
            var component = mm.model.forms[formName].components[componentIndex]
            if (!component) {
                return 0
            }
            var top = component.topY
            if (isValidObject(component.parent)) {
                var ccc = mm.model.forms[formName].components
                for (var ytr = 0;ytr < ccc.length;ytr++){
                   if (component.parent == ccc[ytr].name) {
                       top = top + ccc[ytr].topY
                       break
                   }
                }
            }
            return top
        }
        ,

        getChildren: function( itemName ) {

            var mm = this
            var ccc = mm.model.forms[mm.model.active_form].components
            var chh = []
            for (var ytr = 0;ytr < ccc.length;ytr++){
                if (ccc[ytr].parent == itemName) {
                    ccc[ytr].index_in_parent_array = ytr
                    chh.push(ccc[ytr])
                }
            }
            return chh
        }
        ,
        previewUpload: function(property) {
            var mm = this;
            var file    = document.getElementById('image_file').files[0];
            var reader  = new FileReader();

            reader.addEventListener("load", function () {
                mm.model.forms[mm.model.active_form].components[mm.model.active_component_index][property.id] = reader.result
                mm.refresh ++
            }, false);

            if (file) {
                reader.readAsDataURL(file);
            }
        }
        ,
         editAsCode: async function(aa) {
            var mm = this
            if (this.ui_code_editor) {
                mm.ui_code_editor.destroy()
                mm.ui_code_editor = null
            }
            setTimeout(function(){
                mm.design_mode_pane =
                {
                    type: "event_editor",
                    active_form:            aa.active_form,
                    active_component_index: aa.active_component_index,
                    property_id:            aa.property_id
                }

                setTimeout(function(){
                    if (document.getElementById('ui_code_editor') && (mm.ui_code_editor == null)) {
                    //
                    //set up the ace editor for the timeline view
                    //
                    ace.config.set('basePath', '/');
                    mm.ui_code_editor = ace.edit( "ui_code_editor",
                                                        {
                                                               selectionStyle:  "text",
                                                               mode:            "ace/mode/javascript"
                                                        })

                    //Bug fix: Need a delay when setting theme or view is corrupted
                    setTimeout(function(){
                           mm.ui_code_editor.setTheme("ace/theme/sql_server");
                        },100)


                        document.getElementById("ui_code_editor").style["font-size"] = "16px"
                        document.getElementById("ui_code_editor").style.width = "100%"
                        document.getElementById("ui_code_editor").style.border = "0px solid #2C2828"

                        document.getElementById("ui_code_editor").style.height = "55vh"
                        var ccode = ""
                        if ((mm.model.active_component_index == null) && (mm.model.active_form != null)) {
                            ccode = mm.model.forms[mm.model.active_form][aa.property_id]

                        } else if ((mm.model.active_component_index != null) && (mm.model.active_form != null)) {
                            ccode = mm.model.forms[mm.model.active_form].components[mm.model.active_component_index][aa.property_id]
                        }


                        mm.ui_code_editor.getSession().setValue(ccode);
                        mm.ui_code_editor.getSession().setUseWorker(false);

                        mm.ui_code_editor.on("change", function(e) {
                            var newC = mm.ui_code_editor.getValue()
                            if ((mm.model.active_component_index == null) && (mm.model.active_form != null)) {
                                mm.model.forms[mm.model.active_form][aa.property_id] = newC

                            } else if ((mm.model.active_component_index != null) && (mm.model.active_form != null)) {
                                mm.model.forms[mm.model.active_form].components[mm.model.active_component_index][aa.property_id] = newC
                            }
                        })
                    }
                },100)
            },100)

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

        gotoDragDropEditor: function() {
            this.design_mode_pane.type = "drag_drop";
            if (this.ui_code_editor) {
                this.ui_code_editor.destroy()
                this.ui_code_editor = null
            }
            this.model.active_component_detail_name = null
            this.model.active_component_detail_index = null

        }
        ,

        updateFormCache: function(formName) {
            var form = this.model.forms[formName]
            var components = form.components
            if (!isValidObject(this.form_runtime_info[formName])) {
                this.form_runtime_info[formName] = new Object()
            }
            this.form_runtime_info[formName].component_lookup_by_name = {}

            for (var gjh = 0; gjh < components.length; gjh ++) {
                var cc = components[gjh]
                if (isValidObject(cc)) {
                    this.form_runtime_info[formName].component_lookup_by_name[cc.name] = cc
                }
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
         selectForm: function(formId, showProps) {
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
             if (isValidObject(showProps) && showProps) {
                 this.selected_pane = "properties";
                 this.chooseRight("properties");
             }

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
                        var fcc =
`(async function(){
${eventMessage.code}
})`
                        var debugFcc = getDebugCode(this.model.active_form ,fcc,{skipFirstAndLastLine: true})
                        var efcc = eval(debugFcc)
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
                var rrr = document.getElementById(this.vb_grid_element_id).getBoundingClientRect()

                var newWidth = (ev.clientX - 8)  - rrr.left ;
                var newHeight = (ev.clientY - 8) - rrr.top ;

                this.model.forms[this.model.active_form].width = newWidth
                this.model.forms[this.model.active_form].height = newHeight

                this.model.active_component_index = null
                mm.refresh ++

              } else if (data.type == "resize_form_right") {
                var rrr = document.getElementById(this.vb_grid_element_id).getBoundingClientRect()

                var newWidth = (ev.clientX - 8)  - rrr.left ;

                this.model.forms[this.model.active_form].width = newWidth

                this.model.active_component_index = null
                mm.refresh ++

            } else if (data.type == "resize_form_bottom") {
                  var rrr = document.getElementById(this.vb_grid_element_id).getBoundingClientRect()

                  var newHeight = (ev.clientY - 8) - rrr.top ;

                  this.model.forms[this.model.active_form].height = newHeight

                  this.model.active_component_index = null
                  mm.refresh ++
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



        showComponentDetailedDesignUi: async function(index) {
           var mm = this
           mm.design_mode_pane =
           {
               type:                           "control_details_editor"
           }
           this.model.active_component_detail_index = index;
           this.model.active_component_detail_name = this.model.forms[this.model.active_form].components[index].name;

           setTimeout(function() {
               mm.refresh ++
               mm.$forceUpdate();
           },400)
        },

         deleteComponent: async function(index) {
            var mm = this
            this.model.forms[this.model.active_form].components.splice(index, 1);
            this.refreshControlIndexes()
            this.selectForm(this.model.active_form)
            setTimeout(function() {
                mm.refresh ++
                mm.$forceUpdate();
            },400)
         },


         childDeleteComponent: function(index) {
             this.$root.$emit('message', {
                                             type:             "delete_component",
                                             component_index:   index
                                         })

             }
             ,
         childSelectComponent: function(index) {
             this.$root.$emit('message', {
                                             type:             "select_component",
                                             component_index:   index
                                         })

             }
             ,

         //-------------------------------------------------------------------
         drop: async function (ev) {
         //
         // This is called when something happens on the main drag and drop
         // grid
         //
         //-------------------------------------------------------------------
             ev.preventDefault();
             var mm = this

             var data2 = ev.dataTransfer.getData("message");
             var data = eval("(" + data2 + ")")

             var newItem2 = new Object()
             var rrr2 = document.getElementById(this.vb_grid_element_id).getBoundingClientRect()
             newItem2.leftX = (ev.clientX  - rrr2.left)  - data.offsetX;
             newItem2.topY = (ev.clientY  - rrr2.top)   - data.offsetY;

             var parentId = null
             var parentName = null
             var parentOffsetX = 0
             var parentOffsetY = 0
             var parentOffsetWidth = 0
             var parentOffsetHeight = 0

             var ccc = mm.model.forms[mm.model.active_form].components
             for (var ytr = 0;ytr < ccc.length;ytr++){
                var baseId =    ccc[ytr].base_component_id
                var controlNmae =    ccc[ytr].name
                var x1 =        ccc[ytr].leftX
                var x2 =        ccc[ytr].leftX + ccc[ytr].width
                var y1 =        ccc[ytr].topY
                var y2 =        ccc[ytr].topY + ccc[ytr].height
                var isContainer = ccc[ytr].is_container
                if (isContainer && (x1 <= newItem2.leftX) && (newItem2.leftX <= x2) && (y1 <= newItem2.topY) && (newItem2.topY <= y2)) {
                    //alert(`${baseId}:(${x1},${y1}) - (${x2},${y2})`)
                    parentOffsetX = x1
                    parentOffsetY = y1
                    parentId      = ccc[ytr].base_component_id
                    parentName    = ccc[ytr].name
                }
             }


             if (data.type == "add_component") {
                 var newItem = new Object()
                 var rrr = document.getElementById(this.vb_grid_element_id).getBoundingClientRect()

//alert(parentId +": = (" + parentOffsetX + "," + parentOffsetY + ")")
                 newItem.leftX = ((ev.clientX  - rrr.left)  - data.offsetX) - parentOffsetX  - 10;
                 newItem.topY = ((ev.clientY  - rrr.top)   - data.offsetY) - parentOffsetY - 10;
                 if (newItem.leftX < 0) {
                    newItem.leftX = 0
                 }
                 if (newItem.topY < 0) {
                    newItem.topY = 0
                 }
                 //alert(`(${newItem.leftX},${newItem.topY})`)

                 if (parentId) {
                    //alert(`${baseId}:(${x1},${y1}) - (${x2},${y2})`)
                    newItem.parent = parentName
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
                            for (var cpp = 0 ; cpp < compEvaled.length; cpp ++){
                                var prop = compEvaled[cpp].id

                                if (!isValidObject(newItem[prop])){
                                    if (compEvaled[cpp].default) {
                                        newItem[prop] = compEvaled[cpp].default
                                    } else {
                                        newItem[prop] = ""
                                    }
                                }
                            }
                        }
                 }





                 this.model.forms[this.model.active_form].components.push(newItem)
                 this.model.active_component_index = this.model.forms[this.model.active_form].components.length - 1

                 setTimeout(function() {
                     mm.selectComponent(mm.model.active_component_index, true)
                     mm.refresh ++
                 },100)


             } else if (data.type == "move_component") {
                var rrr = document.getElementById(this.vb_grid_element_id).getBoundingClientRect()

                var newLeftX = (ev.clientX  - rrr.left) - data.offsetX;
                var newTopY = (ev.clientY  - rrr.top) - data.offsetY;

                if (!this.model.forms[this.model.active_form].components[data.index].is_container) {
                    if (parentId) {
                       this.model.forms[this.model.active_form].components[data.index].parent = parentName
                       newLeftX = newLeftX - parentOffsetX
                       newTopY = newTopY - parentOffsetY
                    } else {
                       this.model.forms[this.model.active_form].components[data.index].parent = null
                    }
                }

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

                 var newLeftX = ev.clientX  + 2 - rrr.left ;
                 var newTopY = ev.clientY  + 2 - rrr.top ;


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

             } else if (data.type == "resize_left") {
                 var rrr = document.getElementById(this.vb_grid_element_id).getBoundingClientRect()
                 var oldX = this.model.forms[this.model.active_form].components[data.index].leftX

                 var newLeftX = ev.clientX  + 2 - rrr.left ;


                 if (newLeftX < 0) {
                     newLeftX = 0
                 }

                 this.model.forms[this.model.active_form].components[data.index].leftX = newLeftX
                 var diffX = this.model.forms[this.model.active_form].components[data.index].leftX - oldX
                 this.model.forms[this.model.active_form].components[data.index].width -= diffX

                 this.model.active_component_index = data.index




             } else if (data.type == "resize_top") {
                 var rrr = document.getElementById(this.vb_grid_element_id).getBoundingClientRect()
                 var oldY = this.model.forms[this.model.active_form].components[data.index].topY

                 var newTopY = ev.clientY  + 2 - rrr.top ;


                 if (newTopY < 0) {
                     newTopY = 0
                 }

                 this.model.forms[this.model.active_form].components[data.index].topY = newTopY
                 var diffY = this.model.forms[this.model.active_form].components[data.index].topY - oldY
                 this.model.forms[this.model.active_form].components[data.index].height -= diffY

                 this.model.active_component_index = data.index



             } else if (data.type == "resize_top_right") {
                 var rrr = document.getElementById(this.vb_grid_element_id).getBoundingClientRect()
                 var newX = ev.clientX  - 10 - rrr.left ;
                 var newY = ev.clientY + 2 - rrr.top;


                 this.model.forms[this.model.active_form].components[data.index].width = newX - this.model.forms[this.model.active_form].components[data.index].leftX

                 var newHeight = (this.model.forms[this.model.active_form].components[data.index].topY + this.model.forms[this.model.active_form].components[data.index].height) - newY
                 this.model.forms[this.model.active_form].components[data.index].topY = newY
                 this.model.forms[this.model.active_form].components[data.index].height = newHeight


                 this.model.active_component_index = data.index

             } else if (data.type == "resize_bottom_left") {
                 var rrr = document.getElementById(this.vb_grid_element_id).getBoundingClientRect()
                 var newX = ev.clientX + 8 - rrr.left ;
                 var newY = ev.clientY - 12 - rrr.top ;


                 var newWidth = (this.model.forms[this.model.active_form].components[data.index].leftX + this.model.forms[this.model.active_form].components[data.index].width) - newX
                 this.model.forms[this.model.active_form].components[data.index].leftX = newX
                 this.model.forms[this.model.active_form].components[data.index].width = newWidth

                 this.model.forms[this.model.active_form].components[data.index].height = newY - this.model.forms[this.model.active_form].components[data.index].topY
                 this.model.active_component_index = data.index

             } else if (data.type == "resize_right") {

                 var rrr = document.getElementById(this.vb_grid_element_id).getBoundingClientRect()
                 var newX = ev.clientX  - rrr.left - 10;

                 var newWidth = newX - this.model.forms[this.model.active_form].components[data.index].leftX
                 this.model.forms[this.model.active_form].components[data.index].width = newWidth

                 this.model.active_component_index = data.index



             } else if (data.type == "resize_bottom_right") {

                 var rrr = document.getElementById(this.vb_grid_element_id).getBoundingClientRect()
                 var newX = ev.clientX  - rrr.left - 10;
                 var newY = ev.clientY - rrr.top - 12;

                 var newWidth = newX - this.model.forms[this.model.active_form].components[data.index].leftX
                 this.model.forms[this.model.active_form].components[data.index].width = newWidth

                 var newHeight = newY - this.model.forms[this.model.active_form].components[data.index].topY
                 this.model.forms[this.model.active_form].components[data.index].height = newHeight

                 this.model.active_component_index = data.index

             } else if (data.type == "resize_bottom") {

                 var rrr = document.getElementById(this.vb_grid_element_id).getBoundingClientRect()
                 var newY = ev.clientY - rrr.top - 12;

                 var newHeight = newY - this.model.forms[this.model.active_form].components[data.index].topY
                 this.model.forms[this.model.active_form].components[data.index].height = newHeight

                 this.model.active_component_index = data.index
             }


             this.selectComponent(this.model.active_component_index)
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
                center = "<b style='font-family:verdana;font-size: 13px;'>" + (data.app?data.app:data.form) + "</b> "

             } else if (data.component) {
                 center = "<b style='font-family:verdana;font-size: 13px;'>" + data.component + "</b> " + data.component_type
             } else if (data.form) {
                 center = "<b style='font-family:verdana;font-size: 13px;'>" + data.form + "</b> "
             }

             var template =
               "<div  style='overflow:hidden ;text-overflow: ellipsis;border-radius: 1px;margin: 0px;padding:0px;border:0px;font-family:verdana;font-size: 13px;'>" +
                    center +
               "</div>";
             return template;
         },



         updatePropertySelector: function() {
            if (!designMode){
                return
            }
            var mm = this
            if (!document.getElementById("property_selector_parent")) {
                return
            }
            document.getElementById("property_selector_parent").innerHTML=' <select id=property_selector ></select>'

            var sdata = []
            var indexProp = 0
            var selectedItem = null

            if (mm.model.app_selected || (!isValidObject(mm.model.active_component_index))) {

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

            } else if (isValidObject(mm.model.active_component_index)) {

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
                            component_type:     component.base_component_id,

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
                    mm.selectComponent(dd.component_index)
                } else if (dd.form) {
                    mm.selectForm(dd.form)
                } else if (dd.app) {
                    mm.select_app()
                }
            });


         },


         //-------------------------------------------------------------------
         selectComponent: async function(index, showProps) {
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
            if (isValidObject(showProps) && showProps) {
                this.selected_pane = "properties";
                this.chooseRight("properties");
            }
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
                width: 300,
                height: 300
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
                      design_mode_pane:            null,
                      local_app:                    false,
                      refresh: 0,
                      runtime_mode: runtimeMode,
                      component_usage:             new Object(),
                      ui_code_editor: null,
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
     ,
                data: function () {
                  return {
                      uid2:                        null,
                      vb_grid_element_id:          null,
                      vb_editor_element_id:        null,
                      design_mode: designMode,
                      design_mode_pane:            null,
                      local_app:                    false,
                      refresh: 0,
                      runtime_mode: runtimeMode,
                      component_usage:             new Object(),
                      ui_code_editor: null,
                      form_runtime_info: {},
                      text: texti,
                      model: {
  "next_id": 7,
  "max_form": 4,
  "active_form": "Form_1",
  "default_form": "Form_1",
  "app_selected": false,
  "id": "vb",
  "next_component_id": 116,
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
          "click_event": "var ins = todoInputBox.text\n\ntodoInputBox.text = \"\"\nsql(\"insert into items (id,name) values (?,?)\",\n          [new Date().getTime(),\n           ins])\ndisplay_out.text = sqlFirstCol(\"select name from items\")\n",
          "background_color": ""
        },
        {
          "name": "button_control_2",
          "base_component_id": "button_control",
          "leftX": 4,
          "topY": 299,
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
          "leftX": 33.5625,
          "topY": 9,
          "name": "title_label",
          "base_component_id": "label_control",
          "width": 112,
          "height": 34,
          "text": "Todo App",
          "background_color": ""
        },
        {
          "leftX": 190.4375,
          "topY": 300,
          "name": "button_control_104",
          "base_component_id": "button_control",
          "width": 146,
          "height": 55,
          "text": "Go to 3D",
          "background_color": "",
          "click_event": "mm.selectForm(\"form_3d\")"
        }
      ],
      "form_activate": "display_out.text = sqlFirstCol(\"select name from items\")"
    },
    "Form_2": {
      "name": "Form_2",
      "width": 400,
      "height": 400,
      "components": [
        {
          "name": "button_control_2",
          "base_component_id": "button_control",
          "leftX": 200,
          "topY": 300,
          "width": 200,
          "background_color": "blue",
          "height": 50,
          "text": "Go to Form 1",
          "click_event": "mm.selectForm(\"Form_1\")"
        }
      ]
    },
    "form_3d": {
      "name": "form_3d",
      "components": [
        {
          "leftX": 10.4375,
          "topY": 343.28125,
          "name": "button_control_107",
          "base_component_id": "button_control",
          "width": 182,
          "height": 58,
          "text": "Go to form 1",
          "background_color": "",
          "click_event": "mm.selectForm(\"Form_1\")"
        },
        {
          "leftX": 0,
          "topY": 0,
          "name": "threedee_control_108",
          "base_component_id": "threedee_control",
          "width": 274.9791564941406,
          "height": 206.8645782470703,
          "text": "",
          "background_color": "",
          "is_container": true,
          "hide_children": true,
          "has_details_ui": true
        },
        {
          "leftX": 48.48957824707031,
          "topY": 49.00349426269531,
          "parent": "threedee_control_108",
          "name": "threedee_item_control_109",
          "base_component_id": "threedee_item_control",
          "width": 100,
          "height": 100,
          "text": "",
          "position": "-2.1 4 -10",
          "index_in_parent_array": 2
        },
        {
          "leftX": 52.486106872558594,
          "topY": 110.00001525878906,
          "parent": "threedee_control_108",
          "name": "threedee_item_control_110",
          "base_component_id": "threedee_item_control",
          "width": 100,
          "height": 100,
          "text": "",
          "position": "-2.1 4 -10",
          "index_in_parent_array": 3
        },
        {
          "leftX": 65.48957443237305,
          "topY": 50.00349426269531,
          "parent": "threedee_control_108",
          "name": "threedee_item_control_111",
          "base_component_id": "threedee_item_control",
          "width": 100,
          "height": 100,
          "text": "",
          "position": "-2.1 4 -10",
          "index_in_parent_array": 4
        },
        {
          "leftX": 32.486106872558594,
          "topY": 95.00001525878906,
          "parent": "threedee_control_108",
          "name": "threedee_item_control_112",
          "base_component_id": "threedee_item_control",
          "width": 100,
          "height": 100,
          "text": "",
          "position": "-2.1 4 -10",
          "index_in_parent_array": 5
        },
        {
          "leftX": 86.4861068725586,
          "topY": 71.00001525878906,
          "parent": "threedee_control_108",
          "name": "threedee_item_control_113",
          "base_component_id": "threedee_item_control",
          "width": 100,
          "height": 100,
          "text": "",
          "position": "-2.1 4 -10",
          "index_in_parent_array": 6
        },
        {
          "leftX": 67.4861068725586,
          "topY": 89.00001525878906,
          "parent": "threedee_control_108",
          "name": "threedee_item_control_114",
          "base_component_id": "threedee_item_control",
          "width": 100,
          "height": 100,
          "text": "",
          "position": "-2.1 4 -10",
          "index_in_parent_array": 7
        },
        {
          "leftX": 70.4861068725586,
          "topY": 86.00001525878906,
          "parent": "threedee_control_108",
          "name": "threedee_item_control_115",
          "base_component_id": "threedee_item_control",
          "width": 100,
          "height": 100,
          "text": "",
          "position": "-2.1 4 -10",
          "index_in_parent_array": 8
        }
      ],
      "width": 298.125,
      "height": 401.28125
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
