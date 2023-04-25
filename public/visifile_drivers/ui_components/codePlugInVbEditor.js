async function component( args ) {
/*
base_component_id("vb_editor_component")
component_type("SYSTEM")
load_once_from_file(true)
runtime_pipeline(["EDITOR_PLUG_IN"])
uses_javascript_libraries(["advanced_bundle"])
*/

    let designMode          = true
    let runtimeMode         = false
    let selectProp          = null
    let selectCodeObject    = null
    let selectCodeAction    = null
    let texti               = null
    if (args) {
        texti = args.text
    }

    Vue.component("vb_editor_component",
    {
        //*** COPY_START ***//
        props:          [ "args"],
        template:       `<div   v-bind:id='unique_app_dom_element_id'
        v-if='unique_app_dom_element_id != null'
        v-bind:style='"width: 100%; height: 100%; " + (design_mode?"background: white;":"")'>


    <div style='box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);background-color: lightgray; padding: 5px; padding-left: 15px;padding-bottom: 10px;' v-if='design_mode' >

        <slot style='display: inline-block;float: left;' v-if='text'>
        </slot>
        
        <div  v-if="debug_component"
              style="position:fixed; left:2vw;top:2vh;width:96vw;height:95%;background-color: white;z-index:100000000; border: black solid 2px;"
        >
          <div  v-if="debug_component"
                style="background-color: blue;padding: 12px;color:white;"
                v-on:click="debug_component = null"
          >
            <b>Component type: </b>{{ debug_component }}
            <button  type=button class=' btn btn-danger btn-sm'
                     style="float: right;box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 8px 0px, rgba(0, 0, 0, 0.19) 0px 6px 20px 0px;margin-bottom: 2px;"
                     v-on:click='debug_component = null' >x</button>
          </div> 
          <br>
          <div>

            IPFS: {{GLOBALS.isComponentTypeCached(debug_component)?GLOBALS.getCommitIdForBaseComponentId( debug_component ):""}}
          </div>
          <pre style="height:80%;width:100%;overflow:scroll;padding: 5px;background-color:lightgray;">
            {{GLOBALS.isComponentTypeCached(debug_component)?GLOBALS.getCodeForComponent({baseComponentid: debug_component}):""}}
          </pre>
          
        </div>


     </div>


    <div    v-bind:id='vb_editor_element_id'
            v-if='vb_editor_element_id != null'
            v-bind:style='"position:relative;display: flex;" + (editor_locked?"pointer-events: none;opacity: 0.4;":"")'
            v-on:drop="$event.stopPropagation(); dropEditor($event)"
            v-on:ondragover="$event.stopPropagation(); allowDropEditor($event)">






        <!--
                -----------------------------------------

                    The left section of the UI editor

                -----------------------------------------
        -->
        <div    v-if='design_mode'
            v-on:click='selected_pane = "blocks";'
            v-bind:style='(design_mode?"border: 4px solid lightgray;":"") + " max-width: " + leftHandWidth + "px;height: 75vmin; display: inline-block;overflow-x: hidden;overflow-y: hidden;vertical-align: top; background-color: lightgray;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);float:left;;flex-grow: 0;flex-shrink: 0;"'>

            <div    v-bind:style='"font-family:verdana,helvetica;font-size: 13px;border-radius: 3px;padding: 4px; margin-bottom: 10px;box-shadow: 2px 2px 10px lightgray;"'
                    v-bind:class='(selected_pane == "blocks"?"selected_pane_title":"unselected_pane_title") '>
                Blocks
            </div>

            <div class='' >
                <div class='' style='display:flex;overflow-y:scroll;flex-flow: row wrap;height:65vh;'>
                    <div    class='flex'
                            v-on:click='highlighted_control = null;'
                            v-bind:style='"display:flex;cursor: grab;border-radius: 3px;width:50px;height:50px; margin: 0px;border: 0px;padding:4px;overflow-x:hidden;overflow-y:hidden;background-color: " + ((!highlighted_control)?"#E8E8E8;border-left: 2px solid gray;border-top: 2px solid gray;":"lightgray;")'>
                        <img    src='/driver_icons/cursor.png'
                                style='width: 100%;'
                                class='img-fluid'>
                        </img>
                    </div>

                  <div    v-for='av in available_components'>
                    <div         draggable="true"
                            class=''
                            v-on:dragend='$event.stopPropagation();deleteCursor();'
                            v-on:dragstart='$event.stopPropagation();if (design_mode_pane.type == "drag_drop") {switchCursor($event,"grab","grabbing");highlighted_control = av.base_component_id;drag($event,{
                                                   type:   "add_component",
                                                   base_component_id:    av.base_component_id
                                                })} else {
                                                    event.preventDefault()
                                                    gotoDragDropEditor();
                                                }'
                            v-on:click='highlighted_control = av.base_component_id;gotoDragDropEditor();'
                            v-bind:style='"display-old:flex;cursor: grab;margin: 2px;border-radius: 3px;width:50px;;height: 50px; margin: 0px;border: 0px;padding:10px;overflow-x:auto;overflow-y:hidden;background-color: " + ((highlighted_control == av.base_component_id)?"#E8E8E8;border-left: 2px solid gray;border-top: 2px solid gray;":"lightgray;")'>

                        <img    v-if='isValidObject(av)'
                                v-bind:src='av.logo_url'
                                style='width: 100%;'
                                class='img-fluid'>
                        </img>


                  </div>
                    <div  style="width:100%; height:3px;background-color: lightgray"
                          v-on:click="debug_component=av.base_component_id;"></div>

                  </div>
                </div>
            </div>
        </div>





        <!--

                The main center section of the UI editor

        -->
        <div v-bind:style='"display: flex;width:100%;" + (design_mode?"background-color: darkgray;":"background-color: white;")'>



            <!--

                    File path selector 

            -->


            <div    v-if='(design_mode && (design_mode_pane.type=="file_path_selector"))'
            v-bind:refresh='refresh'
            v-bind:style='"margin: 2px; display: inline-block; vertical-align: top; width: 100%;height: 65vh ;" + (design_mode?"border: 0px solid lightgray; padding:0px;margin: 15px;":"margin: 0px;" ) '>

                <div    style='font-family:verdana,helvetica;font-size: 13px;font-weight:bold;border-radius: 0px;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);background-image: linear-gradient(to right,  #000099, lightblue); color: white; border: 4px solid lightgray; padding:4px; margin:0;border-bottom: 0px;'>

                    <div    style='height: 35px;' >
                        <span        style='margin-left:4px;margin-top:2px;margin-bottom:2px;border-right: 2px solid gray;border-bottom: 2px solid gray;background-color: pink; padding:0px; padding-right:5px;padding-left:5px;height: 20px;border-radius: 3px;font-family:verdana,helvetica;font-size: 20px;font-style:bold;color:black;width:20px;'
                        >?</span>

                        Choose a file
                        <button  type=button class=' btn btn-danger btn-sm'
                                 style="float: right;box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 8px 0px, rgba(0, 0, 0, 0.19) 0px 6px 20px 0px;margin-bottom: 4px;"
                                 v-on:click='gotoDragDropEditor()' >x</button>
                    </div>


                    <div    id='show_help' style="background-color:white;color:black;font-family:helvetica,verdana;font-size: 16px;">
                        <div    style="font-weight:normal;padding:7px;height:100%;">

                        <div    style='font-family:verdana,helvetica;font-size: 13px;font-weight:bold;border-radius: 0px;background-color:lightgray; color: white; border: 4px solid lightgray; padding:4px; margin:0;border-bottom: 0px;'>


                                <div style="width:100%;height:5vh; background-color: black;color:white;font-size: 16px;" class="text-left">
                                    <button     class="btn btn-sm"
                                                style='margin:2px;margin-right:50px;background-color: darkgray;'
                                                v-on:click="chosenFolderUp();"
                                           >

                                        Up
                                    </button>

                                    {{open_file_path}}
                                </div>

                                <div    style="width:100%;height:50vh; background-color: white; overflow:scroll;"
                                        class="text-left">

                                    <div    v-for="(file_or_folder_item, index) in open_file_list"
                                            v-bind:refresh='refresh'
                                            v-bind:style='"background-color: " + (file_or_folder_item.type == "folder"?"darkgray":"lightgray") + "; margin:0px;height:auto;"'
                                            v-on:click='selectOpenFileOrFolder(file_or_folder_item, file_exts)'
                                            class="text-left"
                                            >
                                                {{file_or_folder_item.name}}
                                    </div>
                                </div>



                                <div>

                                    <button

                                            class="btn btn-danger btn-lg"
                                           style='opacity:0.7;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);border-radius: 40px;margin-bottom:10px;margin-left:40px;padding:5px;font-size:16px;font-weight: bold; background-color:lightgray;color:black;display:inline;'
                                           v-on:click="gotoDragDropEditor();"
                                           >

                                            <img    src='/driver_icons/cancel.svg'
                                                    style='position:relative;max-width: 40px; bottom:0px; left: 0px;max-height: 16px;margin-left: auto;margin-right: auto;display: inline-block;'
                                                    >
                                            </img>

                                        Cancel
                                    </button>
                                </div>
                            </div>





                        </div>
                    </div>
                </div>
            </div>














            <!--

                    The code editor for events

            -->


            <div    v-if='(design_mode && (design_mode_pane.type=="event_editor"))'
                    v-bind:refresh='refresh'
                    v-bind:style='"margin: 2px; display: inline-block; vertical-align: top; width: 100%;height: 65vh ;" + (design_mode?"border: 0px solid lightgray; padding:0px;margin: 15px;":"margin: 0px;" ) '>

                <div    style='font-family:verdana,helvetica;font-size: 13px;font-weight:bold;border-radius: 0px;background-color:lightgray; color: white; border: 4px solid lightgray; padding:4px; margin:0;border-bottom: 0px;'>

                    <div    style='height: 50px;' >
                        <div id='select_code_object_parent' style='display: inline-block;margin: 5px;width: 200px;'></div>
                        <div id='select_code_action_parent' style='display: inline-block;margin: 5px;width: 200px;'></div>


                        <button  type=button class=' btn btn-danger btn-sm'
                                 style="float: right;box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 8px 0px, rgba(0, 0, 0, 0.19) 0px 6px 20px 0px;margin-bottom: 4px;"
                                 v-on:click='gotoDragDropEditor()' >x</button>
                    </div>

                    <div    id='ui_code_editor'>
                    </div>

                    <pre    v-on:click="gotoLine(errors.lineNumber)"
                            style="background:pink;color:blue;"
                            v-if="errors != null">Line {{errors.lineNumber}}: {{errors.description}}</pre>
                </div>
            </div>


            <div    v-if='(design_mode && (design_mode_pane.type=="help"))'
                    v-bind:refresh='refresh'
                    v-bind:style='"margin: 2px; display: inline-block; vertical-align: top; width: 100%;height: 65vh ;" + (design_mode?"border: 0px solid lightgray; padding:0px;margin: 15px;":"margin: 0px;" ) '>

                <div    style='font-family:verdana,helvetica;font-size: 13px;font-weight:bold;border-radius: 0px;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);background-image: linear-gradient(to right,  #000099, lightblue); color: white; border: 4px solid lightgray; padding:4px; margin:0;border-bottom: 0px;'>

                    <div    style='height: 35px;' >
                        <span        style='margin-left:4px;margin-top:2px;margin-bottom:2px;border-right: 2px solid gray;border-bottom: 2px solid gray;background-color: pink; padding:0px; padding-right:5px;padding-left:5px;height: 20px;border-radius: 3px;font-family:verdana,helvetica;font-size: 20px;font-style:bold;color:black;width:20px;'
                        >?</span>

                        Help
                        <button  type=button class=' btn btn-danger btn-sm'
                                 style="float: right;box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 8px 0px, rgba(0, 0, 0, 0.19) 0px 6px 20px 0px;margin-bottom: 4px;"
                                 v-on:click='gotoDragDropEditor()' >x</button>
                    </div>


                    <div    id='show_help' style="background-color:white;color:black;font-family:helvetica,verdana;font-size: 16px;">
                        <div    style="font-weight:normal;padding:7px;height:100%;"
                                v-html="design_mode_pane.help"></div>
                    </div>
                </div>
            </div>











            <!--

                    The control details editor

            -->


            <div    v-if='(design_mode && (design_mode_pane.type=="control_details_editor"))'
                    v-bind:style='"box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);margin: 2px; display: inline-block; vertical-align: top; width: 100%;height: 65vh ;" + (design_mode?"border: 0px solid lightgray; padding:0px;margin: 15px;":"margin: 0px;" ) '>

                <div    v-if='design_mode'
                        style='font-family:verdana,helvetica;font-size: 13px;font-weight:bold;border-radius: 0px;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);background-image: linear-gradient(to right,  #000099, lightblue); color: white; border: 4px solid lightgray; padding:4px; margin:0;border-bottom: 0px;'>

                    <div    style='height: 30px;' >

                        <div     class='btn btn-info'
                                 v-bind:style='"box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 8px 0px, rgba(0, 0, 0, 0.19) 0px 6px 20px 0px;padding:0px; z-index: 21474836;opacity:1;width: 30px; height: 30px; line-height:30px;text-align: center;vertical-align: middle;"'
                                 >

                                ...

                        </div>

                        Control - {{model.forms[active_form].components[active_component_detail_index].name}}
                        <button  type=button class=' btn btn-danger btn-sm'
                                 style="float: right;box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 8px 0px, rgba(0, 0, 0, 0.19) 0px 6px 20px 0px;margin-bottom: 4px;"
                                 v-on:click='gotoDragDropEditor()' >x</button>
                    </div>


                </div>

                <div  v-bind:style='"padding:7px;border: 5px solid lightgray;background: white;;overflow:none;height:100%; overflow: auto; width:100%; "'>

                    <component  v-bind:id='active_form + "_" + model.forms[active_form].components[active_component_detail_index].name + (design_mode?"_design":"")'
                                v-bind:refresh='refresh'
                                design_mode='detail_editor'

                                v-bind:meta='{form: active_form,name: model.forms[active_form].components[active_component_detail_index].name + (design_mode?"_design":"") ,getEditor: getEditor , lookupComponent: lookupComponent,lookupComponentOnForm: lookupComponentOnForm}'

                                v-bind:form="active_form"
                                v-bind:delete_design_time_component='childDeleteComponent'
                                v-bind:select_design_time_component='childSelectComponent'
                                v-bind:children='getChildren( model.forms[active_form].components[active_component_detail_index].name)'
                                v-on:send="processControlEvent"
                                v-bind:is='model.forms[active_form].components[active_component_detail_index].base_component_id'
                                v-bind:name='model.forms[active_form].components[active_component_detail_index].name + "_design_mode_" + design_mode'
                                v-bind:props='model.forms[active_form].components[active_component_detail_index]'
                                v-if='model.forms[active_form].components[active_component_detail_index]'
                                v-bind:properties='model.forms[active_form].components[active_component_detail_index]'
                                v-bind:args='model.forms[active_form].components[active_component_detail_index]'>

                                <template       slot-scope="child_components"
                                                v-bind:refresh='refresh'
                                                style='position:relative;'>

                                    <component  v-for='child_item  in  getChildren(model.forms[active_form].components[active_component_detail_index].name)'
                                                v-bind:design_mode='design_mode'
                                                v-bind:meta='{form: active_form,name: child_item.name + (design_mode?"_design":""),getEditor: getEditor, lookupComponent: lookupComponent,lookupComponentOnForm: lookupComponentOnForm}'
                                                v-bind:form="active_form"
                                                v-bind:refresh='refresh'
                                                v-bind:style='"z-index:100000;position: relative; top: " + child_item.topY + "px; left: " + child_item.leftX + "px;height:" + child_item.height + "px;width:" + child_item.width + "px;overflow:auto;"'
                                                v-bind:id='active_form + "_" + model.forms[active_form].components[child_item.index_in_parent_array].name + (design_mode?"_design":"")'
                                                v-on:send="processControlEvent"
                                                v-bind:is='child_item.base_component_id'
                                                v-bind:name='child_item.name + "_design_mode_" + design_mode'
                                                v-bind:properties='model.forms[active_form].components[child_item.index_in_parent_array]'
                                                v-if='model.forms[active_form].components[child_item.index_in_parent_array]'
                                                v-bind:props='model.forms[active_form].components[child_item.index_in_parent_array]'
                                                v-bind:args='model.forms[active_form].components[child_item.index_in_parent_array]'>
                                    </component>

                                </template>
                     </component>
                 </div>
             </div>















             <!--

                     The control links editor

             -->


             <div    v-if='(design_mode && (design_mode_pane.type=="control_links_editor"))'
                     v-bind:style='"box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);margin: 2px; display: inline-block; vertical-align: top; width: 100%;height: 65vh ;" + (design_mode?"border: 0px solid lightgray; padding:0px;margin: 15px;":"margin: 0px;" ) '>

                 <div    v-if='design_mode'
                         style='font-family:verdana,helvetica;font-size: 13px;font-weight:bold;border-radius: 0px;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);background-image: linear-gradient(to right,  #000099, lightblue); color: white; border: 4px solid lightgray; padding:4px; margin:0;border-bottom: 0px;'>

                     <div    style='height: 30px;' >

                             <span   class="badge badge-primary"
                                     style='font-size: 20px;'
                                     v-html='(form_runtime_info[active_form].component_incoming_count_by_uuid[model.forms[active_form].components[active_component_index].uuid])?(form_runtime_info[active_form].component_incoming_count_by_uuid[model.forms[active_form].components[active_component_index].uuid]):0'>
                             </span>

                             <span    style='font-size: 20px;'>-&gt;</span>

                             <span   class="badge badge-primary"
                                     style='font-size: 20px; margin-right: 10px;'
                                     v-html='(form_runtime_info[active_form].component_outgoing_count_by_uuid[model.forms[active_form].components[active_component_index].uuid])?(form_runtime_info[active_form].component_outgoing_count_by_uuid[model.forms[active_form].components[active_component_index].uuid]):0'>
                             </span>

                         Property linked changes
                         <button  type=button class=' btn btn-danger btn-sm'
                                  style="float: right;box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 8px 0px, rgba(0, 0, 0, 0.19) 0px 6px 20px 0px;margin-bottom: 4px;"
                                  v-on:click='gotoDragDropEditor()' >x</button>
                     </div>


                 </div>

                 <div  v-bind:style='"border: 5px solid lightgray;background: white;;overflow:none;height:100%; overflow: auto; width:100%; padding:10px;"'>

                  <div  style="width:40%;font-weight:bold;"
                        v-bind:class='((design_mode_pane.direction=="incoming")?"badge badge-primary":"badge")'
                        v-on:click='design_mode_pane.direction="incoming";refresh++;'
                        >Incoming Links:</div>

                   <div style="width:40%;font-weight:bold;"
                        v-bind:class='((design_mode_pane.direction=="outgoing")?"badge badge-primary":"badge")'
                        v-on:click='design_mode_pane.direction="outgoing";refresh++;'
                        >Outgoing Links:</div>


<br/><br/>
<table style="width:100%;" class="table">
<tr style="width:100%;">

    <td    style="width:40%;font-weight:bold;padding:10px;">From</td>
    <td    style="width:40%;font-weight:bold;padding:10px;">Transform</td>
    <td    style="width:40%;font-weight:bold;padding:10px;">To</td>
    <td    style="width:20%;font-weight:bold;"></td>
</tr>

<tr v-for='currentWatch in watchList'
v-if="model.forms[active_form].components[active_component_links_index] && (currentWatch.to_component_uuid == model.forms[active_form].components[active_component_links_index].uuid) &&
      (design_mode_pane.direction == 'incoming')">

    <td style='padding:10px;'>
        {{getIncomingFromPropertyName(currentWatch)}}
    </td>

    <td style='padding:10px;'>
        {{getIncomingTransformFn(currentWatch)}}
    </td>

    <td style='padding:10px;' >
        {{getIncomingToPropertyName(currentWatch)}}
    </td>

    <td style='padding:10px;' >
        <div     class='btn btn-danger'
                 v-bind:style='"box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 8px 0px, rgba(0, 0, 0, 0.19) 0px 6px 20px 0px;padding:0px; z-index: 21474836;opacity:1;"  +
                               "width: 30px; height: 30px; line-height:30px;text-align: center;vertical-align: middle;"'
                 v-on:click='$event.stopPropagation();deleteLinkedProperty(currentWatch )'>

                X

        </div>
    </td>
</tr>


<tr v-for='currentPush in watchList'
v-if="model.forms[active_form].components[active_component_links_index] && (currentPush.from_component_uuid == model.forms[active_form].components[active_component_links_index].uuid) &&
      (design_mode_pane.direction == 'outgoing')">


    <td style='padding:10px;' >
        {{getOutgoingFromPropertyName(currentPush)}}
    </td>


    <td style='padding:10px;'>
        {{getOutgoingTransformFn(currentPush)}}
    </td>



    <td style='padding:10px;' >
        {{getOutgoingToPropertyName(currentPush)}}
    </td>


    <td style='padding:10px;' >
        <div     class='btn btn-danger'
                 v-bind:style='"box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 8px 0px, rgba(0, 0, 0, 0.19) 0px 6px 20px 0px;padding:0px; z-index: 21474836;opacity:1;"  +
                               "width: 30px; height: 30px; line-height:30px;text-align: center;vertical-align: middle;"'
                 v-on:click='$event.stopPropagation();deleteLinkedProperty(currentPush)'>

                X

        </div>
    </td>


</tr>






</table>





<br/><br/>
<b>Add new link</b>


<ul class="nav nav-pills" id="myTab" role="tablist"
    v-bind:refresh='refresh'>


  <li class="nav-item" style="width:30%">
    <a  v-bind:class='"nav-link " + (  design_mode_pane.links_type == "form"?"active":""  )'
        id="links-form-tab"
        v-on:click='design_mode_pane.links_type = "form";clearLinks();refresh++;'
        data-toggle="tab" role="tab" aria-controls="home" aria-selected="true">Form</a>
  </li>


  <li class="nav-item"  style="width:30%">
    <a  v-bind:class='"nav-link " + (  design_mode_pane.links_type == "create_new_component"?"active":""  )'
        id="links-create-new-component-tab"
        v-on:click='design_mode_pane.links_type = "create_new_component";clearLinks();refresh++;'
        data-toggle="tab" role="tab" aria-controls="profile" aria-selected="false">Create New</a>
  </li>


  <li class="nav-item"  style="width:30%">
    <a  v-bind:class='"nav-link " + (  design_mode_pane.links_type == "manual"?"active":""  )'
        id="manual-links-tab"
        v-on:click='design_mode_pane.links_type = "manual";clearLinks();refresh++;'
        data-toggle="tab" role="tab" aria-controls="manual" aria-selected="false">Manual</a>
  </li>


</ul>
<div class="tab-content" id="myTabContent">













   <!--
   --------------------------------------------

           FORM LINKS START

    --------------------------------------------
     -->
     <div  class="tab-pane fade show active"
           id="home" role="tabpanel" aria-labelledby="links-form-tab"
           v-if='design_mode_pane.links_type == "form"'>

         <table style="width:100%;border: 2px solid lightgray;" class="table">

             <tr style=''
                 v-if="(design_mode_pane.direction == 'incoming')">

                 <td    style='vertical-align: top; width: 50%;'>

 <!--
 ------------------------------------------------------------------------------------------------
       INCOMING
 ------------------------------------------------------------------------------------------------
 -->
                     <!--
                     --------------------------------------------
                     FORM LINKS
                             Incoming form link "to" selected component
                             (part 1 - where is the link coming from?)

                     --------------------------------------------
                      -->

                      <!--
                      ----------------
                               COMPONENT NAMES ON THIS FORM
                      ----------------
                      -->

                     <div  style="margin:5px;height:150px;">

                         <div    style="width:40%;font-weight:bold;margin:7px;">From</div>

                             <select    @change='setIncomingFormWatchComponent($event); '
                                         v-if='!selectedWatchComponentUuid'
                                         style='margin:7px;'>

                                 <option     value=""
                                             selected="true">
                                 </option>

                                 <option     v-for="watchComp   in   incoming_link_objects"
                                             v-bind:value="watchComp.uuid"
                                             v-bind:selected="selectedWatchComponentUuid == watchComp.uuid">

                                         {{watchComp.name}}
                                 </option>
                             </select>



                             <div
                                v-if='selectedWatchComponentUuid'
                             >
                                {{form_runtime_info[active_form].component_lookup_by_uuid[selectedWatchComponentUuid].name}}
                             </div>



                     <!--
                     ----------------
                              PROPERTIES FOR SELECTED COMPONENT ON THIS FORM
                     ----------------
                     -->

                     <select    @change='setWatchFromProperty($event);'
                                 v-if="!selectedWatchFromProperty"
                                 style='margin:7px;'>
                         <option value=""
                                 selected="true">
                         </option>
                         <option     v-for="watchFromProp in selectedWatchFromProperties"

                                     v-bind:value="watchFromProp"
                                     v-bind:selected="selectedWatchFromProperty == watchFromProp">
                                         {{watchFromProp}}
                         </option>
                     </select>


                     <div    v-if="selectedWatchFromProperty"
                             style='margin:7px;'>
                             {{selectedWatchFromProperty}}
                     </div>





                 </div>
             </td>


             <!--
             --------------------------------------------
             FORM LINKS
                     Incoming form link "to" selected component
                     (part 2 - which property on the selected component to send the link to)
             --------------------------------------------
              -->


             <td style='vertical-align: top;border: 1px solid lightgray;margin:5px;'>
                 <div    style="width:50%;">

                     <!--
                     ----------------
                              SELECTED COMPONENT NAME ON THIS FORM
                     ----------------
                     -->


                     <div    style="margin:7px;font-weight:bold;">To</div>


                     <div style='margin:7px;'>
                         {{model.forms[active_form].components[active_component_links_index].name}}
                     </div>



                     <!--
                     ----------------
                              CHOOSE A PROPERTY ON THE SELECTED COMPONENT
                     ----------------
                     -->


                     <select   @change='setWatchToProperty($event);'
                                v-if='(linkSideSelected == "none") || fromLinkPropertySelected'
                                style='margin:7px;'>

                         <option value=""
                                 selected="true">
                         </option>

                         <option     v-for="watchToProp in selectedWatchToProperties"
                                     v-bind:value="watchToProp"
                                     v-bind:selected="selectedWatchToProperty == watchToProp">
                                            {{watchToProp}}
                         </option>
                     </select>
                     <div   style='margin:7px;'
                            v-if='linkSideSelected == "to"'>
                         {{selectedWatchToProperty}}
                     </div>


                 </div>
             </td>
         </tr>
         <tr style=''
             v-if="(design_mode_pane.direction == 'incoming')">

             <td  style='margin: 7px;vertical-align: bottom;' colspan="2">


                 <div v-if="(show_advanced_transform == true)">
                     <div><a href="#" v-on:click="show_advanced_transform=false;">Hide advanced</a></div>
                     <b>Transform function</b>
                     <textarea    rows=7
                                 @change='setWatchTransformFn($event)'
                                 v-bind:value='selectedWatchTransformFn'
                                 style='width: 100%;border: 1px solid black;font-family:verdana,helvetica;font-size: 13px;margin:7px;'>
                     </textarea>
                 </div>
                 <div v-if="(show_advanced_transform != true)">
                     <a href="#"  v-on:click="show_advanced_transform=true;">Show advanced</a>
                 </div>


                 <!--
                 ----------------
                          Add a watch link
                 ----------------
                 -->

                 <button type=button class='btn btn-sm btn-info'
                         v-bind:style='""'
                         v-on:click='$event.stopPropagation(); addWatch();'  >
                      Add
                 </button>


                 <!--
                 ----------------
                          Clear the link fields
                 ----------------
                 -->

                  <button type=button class='btn btn-sm btn-warning'
                          v-bind:style='""'
                          v-on:click='$event.stopPropagation(); clearLinks();'  >
                       Clear
                  </button>

             </td>
         </tr>



<!--
------------------------------------------------------------------------------------------------
      OUTGOING
------------------------------------------------------------------------------------------------
-->


         <!--
         --------------------------------------------
         FORM LINKS
                 Outgoing form link "from" selected component

         --------------------------------------------
          -->


         <tr style=''
             v-if="(design_mode_pane.direction == 'outgoing')">
             <td style='vertical-align: top; width: 50%;'>
                 <div    style="border: 1px solid lightgray;margin:5px;height:150px;">


                     <div    style="width:40%;font-weight:bold;margin:7px;">From</div>

                     <!--
                     --------------------------------------------
                     FORM LINKS
                             Outgoing form link "from" selected component
                             (part 1 - Show the selected component)
                     --------------------------------------------
                      -->

                     <div    style="width:40%;margin:7px;">
                         {{model.forms[active_form].components[active_component_links_index].name}}
                     </div>



                     <select @change='setPushFromProperty($event)'
                              style='margin:7px;'>
                         <option value=""
                                 selected="true">
                         </option>
                         <option     v-for="pushFromProp in selectedPushFromProperties"
                                     v-bind:value="pushFromProp"
                                     v-bind:selected="selectedPushFromProperty == pushFromProp">
                                         {{pushFromProp}}
                         </option>
                     </select>


                 </div>
             </td>
             <td style='vertical-align: top; width: 50%;'>

             <!--
             --------------------------------------------
             FORM LINKS
                     Outgoing form link "to" another component (part 2)
             --------------------------------------------
              -->


                 <div    style="border: 1px solid lightgray;margin:5px;height:150px;">
                     <div    style="margin:7px;width:40%;font-weight:bold;">To</div>

                     <select  @change='setPushComponent($event)'    style='margin:7px;'>
                         <option     value=""
                                     selected="true">
                         </option>
                         <option     v-for="pushComp  in  outgoing_link_objects"
                                     v-bind:value="pushComp.uuid"
                                     v-bind:selected="selectedPushComponentUuid == pushComp.uuid">
                                         {{pushComp.name}}
                         </option>
                     </select>



                 <select @change='setPushToProperty($event)'     style='margin:7px;'>
                     <option value=""
                             selected="true">
                     </option>
                     <option     v-for="pushToProp in selectedPushToProperties"
                                 v-bind:value="pushToProp"
                                 v-bind:selected="selectedPushToProperty == pushToProp">
                                     {{pushToProp}}
                     </option>
                 </select>


                 </div>
             </td>
         </tr>





<!--
------------------------------------------------------------------------------------------------
     FORM OUTGOING LINKS TRANSFORM
------------------------------------------------------------------------------------------------
-->
         <tr style=''
             v-if="(design_mode_pane.direction == 'outgoing')">

             <td  style='margin: 7px;vertical-align: bottom;' colspan="2">

                 <div v-if="(show_advanced_transform == true)">
                     <div><a href="#" v-on:click="show_advanced_transform=false;">Hide advanced</a></div>
                     <b>Transform function</b>
                     <textarea    rows=7
                                 @change='setPushTransformFn($event)'
                                 v-bind:value='selectedPushTransformFn'
                                 style='width: 100%;border: 1px solid black;font-family:verdana,helvetica;font-size: 13px;margin:7px;'>
                     </textarea>
                 </div>
                 <div v-if="(show_advanced_transform != true)">
                     <a href="#"  v-on:click="show_advanced_transform=true;">Show advanced</a>
                 </div>


                 <!--
                 ----------------
                          Add a watch link
                 ----------------
                 -->

                 <button type=button class='btn btn-sm btn-info'
                         v-bind:style='""'
                         v-on:click='$event.stopPropagation(); addPush();'  >

                      Add

                 </button>

                 <!--
                 ----------------
                          Clear the link fields
                 ----------------
                 -->

                  <button type=button class='btn btn-sm btn-warning'
                          v-bind:style='""'
                          v-on:click='$event.stopPropagation(); clearLinks();'  >
                       Clear
                  </button>


             </td>
         </tr>




         </table>

     </div>




 <!--
 ------------------------------------------------------------------------------------------------
         FORM LINKS END HERE
 ------------------------------------------------------------------------------------------------
 -->




















    <!--
    --------------------------------------------

            CREATE NEW COMPONENT LINKS START

     --------------------------------------------
      -->
      <div  class="tab-pane fade show active"
            id="home" role="tabpanel" aria-labelledby="links-form-tab"
            v-if='design_mode_pane.links_type == "create_new_component"'>

          <table style="width:100%;border: 3px solid black;" class="table">

              <tr style=''
                  v-if="(design_mode_pane.direction == 'incoming')">

                  <td    style='vertical-align: top; width: 50%;'>

  <!--
  ------------------------------------------------------------------------------------------------
        INCOMING
  ------------------------------------------------------------------------------------------------
  -->

                      <!--
                      --------------------------------------------
                      CREATE NEW COMPONENT LINKS
                              Incoming form link "to" selected component
                              (part 1 - where is the link coming from?)

                      --------------------------------------------
                       -->

                       <!--
                       ----------------
                                COMPONENT TYPES FOR AVAILABLE COMPONENTS TO CREATE


                       ----------------
                       -->

                      <div  style="margin:5px;height:150px;">

                          <div    style="width:40%;font-weight:bold;margin:7px;">From (New Component)</div>

                              <select    @change='setWatchComponentType($event); '
                                          v-if='!selectedWatchComponentUuid'
                                          v-bind:refresh='refresh'
                                          style='margin:7px;'>

                                  <option     value=""
                                              selected="true">
                                  </option>

                                  <option     v-for="watchComp   in   incoming_link_component_types"
                                              v-bind:value="watchComp"
                                              v-bind:selected="selectedWatchComponentType == watchComp">

                                          {{watchComp}}
                                  </option>
                              </select>



                              <div
                                 v-if='selectedWatchComponentUuid'
                              >
                                 {{form_runtime_info[active_form].component_lookup_by_uuid[selectedWatchComponentUuid].name}}
                              </div>



                      <!--
                      ----------------
                               PROPERTIES FOR SELECTED COMPONENT TO CREATE
                      ----------------
                      -->

                      <select    @change='setWatchFromProperty($event);addNewComponentWatch();'
                                  v-if="!selectedWatchFromProperty"
                                  style='margin:7px;'>
                          <option value=""
                                  selected="true">
                          </option>
                          <option     v-for="watchFromProp in selectedWatchFromProperties"

                                      v-bind:value="watchFromProp"
                                      v-bind:selected="selectedWatchFromProperty == watchFromProp">
                                          {{watchFromProp}}
                          </option>
                      </select>


                      <div    v-if="selectedWatchFromProperty"
                              style='margin:7px;'>
                              {{selectedWatchFromProperty}}
                      </div>





                  </div>
              </td>


              <!--
              --------------------------------------------
              CREATE NEW COMPONENT  LINKS
                      Incoming form link "to" selected component
                      (part 2 - which property on the selected component to send the link to)
              --------------------------------------------
               -->


              <td style='vertical-align: top;border: 1px solid lightgray;margin:5px;'>
                  <div    style="width:50%;">

                      <!-- --------------------------------------------
                      Show the selected component name
                      --------------------------------------------  -->

                      <div    style="margin:7px;font-weight:bold;">To</div>

                      <div style='margin:7px;'>
                          {{model.forms[active_form].components[active_component_links_index].name}}
                      </div>



                      <!-- --------------------------------------------
                      Allow the user to choose the selected component property

                      --------------------------------------------  -->

                      <select   @change='setWatchToProperty($event);'
                                 v-if='(linkSideSelected == "none") || fromLinkPropertySelected'
                                 style='margin:7px;'>

                          <option value=""
                                  selected="true">
                          </option>

                          <option     v-for="watchToProp in selectedWatchToProperties"
                                      v-bind:value="watchToProp"
                                      v-bind:selected="selectedWatchToProperty == watchToProp">
                                             {{watchToProp}}
                          </option>
                      </select>
                      <div   style='margin:7px;'
                             v-if='linkSideSelected == "to"'>
                          {{selectedWatchToProperty}}
                      </div>



                  </div>
              </td>
          </tr>
          <tr style=''
              v-if="(design_mode_pane.direction == 'incoming')">

              <td  style='margin: 7px;vertical-align: bottom;' colspan="2">


                  <div v-if="(show_advanced_transform == true)">
                      <div><a href="#" v-on:click="show_advanced_transform=false;">Hide advanced</a></div>
                      <b>Transform function</b>
                      <textarea    rows=7
                                  @change='setWatchTransformFn($event)'
                                  v-bind:value='selectedWatchTransformFn'
                                  style='width: 100%;border: 1px solid black;font-family:verdana,helvetica;font-size: 13px;margin:7px;'>
                      </textarea>
                  </div>
                  <div v-if="(show_advanced_transform != true)">
                      <a href="#"  v-on:click="show_advanced_transform=true;">Show advanced</a>
                  </div>


                  <!--
                  ----------------
                           Add a watch link
                  ----------------
                  -->

                  <button type=button class='btn btn-sm btn-info'
                          v-bind:style='""'
                          v-on:click='$event.stopPropagation(); addNewComponentWatch();'  >
                       Add
                  </button>


                  <!--
                  ----------------
                           Clear the link fields
                  ----------------
                  -->

                   <button type=button class='btn btn-sm btn-warning'
                           v-bind:style='""'
                           v-on:click='$event.stopPropagation(); clearLinks();'  >
                        Clear
                   </button>

              </td>
          </tr>



 <!--
 ------------------------------------------------------------------------------------------------
       OUTGOING
 ------------------------------------------------------------------------------------------------
 -->


          <!--
          --------------------------------------------
          CREATE NEW COMPONENT  LINKS


                  Outgoing CREATE NEW COMPONENT  link "from" selected component

          --------------------------------------------
           -->


          <tr style=''
              v-if="(design_mode_pane.direction == 'outgoing')">
              <td style='vertical-align: top; width: 50%;'>
                  <div    style="border: 1px solid lightgray;margin:5px;height:150px;">


                      <div    style="width:40%;font-weight:bold;margin:7px;">From</div>

                      <!-- --------------------------------------------
                      Show the selected component name
                      --------------------------------------------  -->

                      <div    style="width:40%;margin:7px;">
                          {{model.forms[active_form].components[active_component_links_index].name}}
                      </div>



                      <!-- --------------------------------------------
                      Allow the user to choose the selected component property
                      --------------------------------------------  -->
                      <select @change='setPushFromProperty($event)'
                               style='margin:7px;'>
                          <option value=""
                                  selected="true">
                          </option>
                          <option     v-for="pushFromProp in selectedPushFromProperties"
                                      v-bind:value="pushFromProp"
                                      v-bind:selected="selectedPushFromProperty == pushFromProp">
                                          {{pushFromProp}}
                          </option>
                      </select>


                  </div>
              </td>
              <td style='vertical-align: top; width: 50%;'>

              <!--
              --------------------------------------------
              Outgoing CREATE NEW COMPONENT  link "to" another component (part 2)
              --------------------------------------------
               -->


                  <div    style="border: 1px solid lightgray;margin:5px;height:150px;">
                      <div    style="margin:7px;width:40%;font-weight:bold;">To (New Component)</div>

                      <select  @change='setPushComponentType($event)'    style='margin:7px;'>
                          <option     value=""
                                      selected="true">
                          </option>
                          <option     v-for="pushComp  in  outgoing_link_component_types"
                                      v-bind:value="pushComp"
                                      v-bind:selected="selectedPushComponentType == pushComp">
                                          {{pushComp}}
                          </option>
                      </select>



                  <select   @change='setPushToProperty($event);addNewComponentPush();'
                             style='margin:7px;'>

                      <option value=""
                              selected="true">
                      </option>

                      <option     v-for="pushToProp in selectedPushToProperties"
                                  v-bind:value="pushToProp"
                                  v-bind:selected="selectedPushToProperty == pushToProp">
                                      {{pushToProp}}
                      </option>

                  </select>


                  </div>
              </td>
          </tr>





 <!--
 ------------------------------------------------------------------------------------------------
      setPushToProperty OUTGOING LINKS TRANSFORM
 ------------------------------------------------------------------------------------------------
 -->
          <tr style=''
              v-if="(design_mode_pane.direction == 'outgoing')">

              <td  style='margin: 7px;vertical-align: bottom;' colspan="2">

                  <div v-if="(show_advanced_transform == true)">
                      <div><a href="#" v-on:click="show_advanced_transform=false;">Hide advanced</a></div>
                      <b>Transform function</b>
                      <textarea    rows=7
                                  @change='setPushTransformFn($event)'
                                  v-bind:value='selectedPushTransformFn'
                                  style='width: 100%;border: 1px solid black;font-family:verdana,helvetica;font-size: 13px;margin:7px;'>
                      </textarea>
                  </div>
                  <div v-if="(show_advanced_transform != true)">
                      <a href="#"  v-on:click="show_advanced_transform=true;">Show advanced</a>
                  </div>


                  <!--
                  ----------------
                           Add a watch link
                  ----------------
                  -->

                  <button type=button class='btn btn-sm btn-info'
                          v-bind:style='""'
                          v-on:click='$event.stopPropagation(); addNewComponentPush();'  >

                       Add

                  </button>

                  <!--
                  ----------------
                           Clear the link fields
                  ----------------
                  -->

                   <button type=button class='btn btn-sm btn-warning'
                           v-bind:style='""'
                           v-on:click='$event.stopPropagation(); clearLinks();'  >
                        Clear
                   </button>


              </td>
          </tr>




          </table>

      </div>




  <!--
  ------------------------------------------------------------------------------------------------
          CREATE NEW COMPONENT LINKS END HERE
  ------------------------------------------------------------------------------------------------
  -->



















<!--

        MANUAL LINKS START HERE

 -->
  <div  class="tab-pane fade show active"
        id="home" role="tabpanel" aria-labelledby="links-form-tab"
        v-if='design_mode_pane.links_type == "manual"'>
      <table style="width:100%;border: 3px solid black;" class="table">
      <tr style=''
          v-if="(design_mode_pane.direction == 'incoming')">



          <td style='vertical-align: top; width: 50%;'>
              <div    style="margin:5px;height:150px;">
                  <div    style="width:40%;font-weight:bold;margin:7px;">From</div>
                  <select  @change='setWatchComponent($event)'  style='margin:7px;'>
                      <option     value=""
                                  selected="true">
                      </option>
                      <option     v-for="watchComp in model.forms[active_form].components"
                                  v-bind:value="watchComp.uuid"
                                  v-bind:selected="selectedWatchComponentUuid == watchComp.uuid">
                                      {{watchComp.name}}
                      </option>
                  </select>



                  <select @change='setWatchFromProperty($event)'  style='margin:7px;'>
                      <option value=""
                              selected="true">
                      </option>
                      <option     v-for="watchFromProp in selectedWatchFromProperties"
                                  v-bind:value="watchFromProp"
                                  v-bind:selected="selectedWatchFromProperty == watchFromProp">
                                      {{watchFromProp}}
                      </option>
                  </select>


              </div>
          </td>


          <td style='vertical-align: top;border: 1px solid lightgray;margin:5px;'>
              <div    style="width:50%;">
                  <div    style="margin:7px;font-weight:bold;">To</div>
                  <div style='margin:7px;'>
                      {{model.forms[active_form].components[active_component_links_index].name}}
                  </div>





                  <select @change='setWatchToProperty($event)'  style='margin:7px;'>
                      <option value=""
                              selected="true">
                      </option>
                      <option     v-for="watchToProp in selectedWatchToProperties"
                                  v-bind:value="watchToProp"
                                  v-bind:selected="selectedWatchToProperty == watchToProp">
                                      {{watchToProp}}
                      </option>
                  </select>
              </div>
          </td>
      </tr>
      <tr style=''
          v-if="(design_mode_pane.direction == 'incoming')">

          <td  style='margin: 7px;vertical-align: bottom;' colspan="2">


              <div v-if="(show_advanced_transform == true)">
                  <div><a href="#" v-on:click="show_advanced_transform=false;">Hide advanced</a></div>
                  <b>Transform function</b>
                  <textarea    rows=7
                              @change='setWatchTransformFn($event)'
                              v-bind:value='selectedWatchTransformFn'
                              style='width: 100%;border: 1px solid black;font-family:verdana,helvetica;font-size: 13px;margin:7px;'>
                  </textarea>
              </div>
              <div v-if="(show_advanced_transform != true)">
                  <a href="#"  v-on:click="show_advanced_transform=true;">Show advanced</a>
              </div>

              <button type=button class='btn btn-sm btn-info'
                      v-bind:style='""'
                      v-on:click='$event.stopPropagation(); addWatch();'  >
                   Add
              </button>


          </td>
      </tr>








      <tr style=''
          v-if="(design_mode_pane.direction == 'outgoing')">
          <td style='vertical-align: top; width: 50%;'>
              <div    style="border: 1px solid lightgray;margin:5px;height:150px;">


                  <div    style="width:40%;font-weight:bold;margin:7px;">From</div>


                  <div    style="width:40%;margin:7px;">
                      {{model.forms[active_form].components[active_component_links_index].name}}
                  </div>



                  <select @change='setPushFromProperty($event)' style='margin:7px;'>
                      <option value=""
                              selected="true">
                      </option>
                      <option     v-for="pushFromProp in selectedPushFromProperties"
                                  v-bind:value="pushFromProp"
                                  v-bind:selected="selectedPushFromProperty == pushFromProp">
                                      {{pushFromProp}}
                      </option>
                  </select>


              </div>
          </td>
          <td style='vertical-align: top; width: 50%;'>
              <div    style="border: 1px solid lightgray;margin:5px;height:150px;">
                  <div    style="margin:7px;width:40%;font-weight:bold;">To</div>

                  <select  @change='setPushComponent($event)'    style='margin:7px;'>
                      <option     value=""
                                  selected="true">
                      </option>
                      <option     v-for="pushComp in model.forms[active_form].components"
                                  v-bind:value="pushComp.uuid"
                                  v-bind:selected="selectedPushComponentUuid == pushComp.uuid">
                                      {{pushComp.name}}
                      </option>
                  </select>



              <select @change='setPushToProperty($event)'     style='margin:7px;'>
                  <option value=""
                          selected="true">
                  </option>
                  <option     v-for="pushToProp in selectedPushToProperties"
                              v-bind:value="pushToProp"
                              v-bind:selected="selectedPushToProperty == pushToProp">
                                  {{pushToProp}}
                  </option>
              </select>


              </div>
          </td>
      </tr>


      <tr style=''
          v-if="(design_mode_pane.direction == 'outgoing')">

          <td  style='margin: 7px;vertical-align: bottom;' colspan="2">

              <div v-if="(show_advanced_transform == true)">
                  <div><a href="#" v-on:click="show_advanced_transform=false;">Hide advanced</a></div>
                  <b>Transform function</b>
                  <textarea    rows=7
                              @change='setPushTransformFn($event)'
                              v-bind:value='selectedPushTransformFn'
                              style='width: 100%;border: 1px solid black;font-family:verdana,helvetica;font-size: 13px;margin:7px;'>
                  </textarea>
              </div>
              <div v-if="(show_advanced_transform != true)">
                  <a href="#"  v-on:click="show_advanced_transform=true;">Show advanced</a>
              </div>


              <button type=button class='btn btn-sm btn-info'
                      v-bind:style='""'
                      v-on:click='$event.stopPropagation(); addPush();'  >

                   Add

              </button>

          </td>
      </tr>




      </table>

  </div>
  <!--

          MANUAL LINKS END HERE

   -->











  <div class="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="create-new-component-tab">...</div>
  <div class="tab-pane fade" id="manual" role="tabpanel" aria-labelledby="manual-links-tab">...</div>
</div>




<br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
Watchlist
<div v-for='currentWatch in watchList'>
<pre    v-if="(currentWatch.to_component_uuid == model.forms[active_form].components[active_component_links_index].uuid)">
{{JSON.stringify(  currentWatch  ,  null  ,  2  )}}

</pre>
</div>


<br/><br/><br/><br/><br/>
Pushlist
<div v-for='currentPush in watchList'>
<pre v-if="(currentPush.from_component_uuid == model.forms[active_form].components[active_component_links_index].uuid)">
{{JSON.stringify(  currentPush  ,  null  ,  2  )}}

</pre>
</div>




                  </div>
              </div>








            <!--

                    The drag drop UI editor.

                    but...

                    Also the main view of the App

            -->

            <div    v-if='(!design_mode) || (design_mode && (design_mode_pane.type=="drag_drop"))'
                    v-bind:style='(design_mode?"box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 8px 0px, rgba(0, 0, 0, 0.19) 0px 6px 20px 0px;":"") + "margin: 2px; display: inline-block; vertical-align: top;  width: 95%;height: 65vh ;" + (design_mode?"border: 0px solid lightgray; padding:0px;margin: 0px;margin-left:15px;margin-top:15px;":"margin: 0px;" ) '>

                <div    v-if='design_mode'
                        style='display:inline-block;font-family:verdana,helvetica;font-size: 13px;font-weight:bold;border-radius: 0px;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);background-image: linear-gradient(to right,  #000099, lightblue); color: white; border: 4px solid lightgray; padding:4px; margin:0;border-bottom: 0px;width:100%;'>

                    <img
                        src='/driver_icons/form.png'
                        style='width: 20px; margin-right: 10px;'
                        class='img-fluid'>
                     </img>
                     {{active_form}} (Form)
                </div>
                <div style=''></div>



                <div  id="grid_container"
                      drop-target=false
                      style='width:100%;background-color:white;height: 100%;position:relative;'>

                    <!-- INACTIVE FORM RESIZERS -->
                    <div    v-if='design_mode && (!isValidObject(active_component_index))'
                            v-bind:style='"display:inline-block;background-color: white; border: 3px solid gray; margin:0;width:12px;height:12px;position:absolute;left:2px;top:2px;"'>
                    </div>
                    <div    v-if='design_mode && (!isValidObject(active_component_index))'
                            v-bind:style='"display:inline-block;background-color: white; border: 3px solid gray; margin:0;width:12px;height:12px;position:absolute;left:" + (7 + (model.forms[active_form].width/2)) +  "px;top:2px;"'>
                    </div>
                    <div    v-if='design_mode && (!isValidObject(active_component_index))'
                            v-bind:style='"display:inline-block;background-color: white; border: 3px solid gray; margin:0;width:12px;height:12px;position:absolute;left:" + (15 +model.forms[active_form].width) +  "px;top:2px;"'>
                    </div>
                    <div    v-if='design_mode && (!isValidObject(active_component_index))'
                            v-bind:style='"display:inline-block;background-color: white; border: 3px solid gray; margin:0;width:12px;height:12px;position:absolute;left:2px;top:" + (7 + (model.forms[active_form].height/2)) +  "px;"'>
                    </div>
                    <div    v-if='design_mode && (!isValidObject(active_component_index))'
                            v-bind:style='"display:inline-block;background-color: white; border: 3px solid gray; margin:0;width:12px;height:12px;position:absolute;left:2px;top:" + (15 + model.forms[active_form].height) +  "px;"'>
                    </div>

                    <!-- ACTIVE FORM RESIZERS -->
                    <!-- bottom right -->
                    <div    v-if='design_mode && (!isValidObject(active_component_index))'
                            v-on:dragend='$event.stopPropagation();deleteCursor();'
                            v-bind:style='"cursor: nwse-resize;display:inline-block;background-color: gray; border: 3px solid gray; margin:0;width:12px;height:12px;position:absolute;left:" + (15 +model.forms[active_form].width) +  "px;top:" + (15 + (model.forms[active_form].height)) +  "px;"'
                            v-bind:draggable='true'
                            v-on:dragstart='$event.stopPropagation();switchCursor($event,"nwse-resize","crosshair");drag($event,{
                               type:        "resize_form_bottom_right",
                               form_name:    active_form
                            })'
                            >
                    </div>
                    <!-- right -->
                    <div    v-if='design_mode && (!isValidObject(active_component_index))'
                            v-bind:style='"cursor: ew-resize;display:inline-block;background-color: gray; border: 3px solid gray; margin:0;width:12px;height:12px;position:absolute;left:" + (15 +model.forms[active_form].width) +  "px;top:" + (7 + (model.forms[active_form].height/2)) +  "px;"'
                            v-bind:draggable='true'
                            v-on:dragend='$event.stopPropagation();deleteCursor();'
                            v-on:dragstart='$event.stopPropagation();switchCursor($event,"ew-resize","col-resize");drag($event,{
                               type:        "resize_form_right",
                               form_name:    active_form
                            })'
                            >
                    </div>
                    <!-- bottom -->
                    <div    v-if='design_mode && (!isValidObject(active_component_index))'
                            v-bind:style='"cursor: ns-resize;display:inline-block;background-color: gray; border: 3px solid gray; margin:0;width:12px;height:12px;position:absolute;left:" + (7 +model.forms[active_form].width/2) +  "px;top:" + (15 + (model.forms[active_form].height)) +  "px;"'
                            v-bind:draggable='true'
                            v-on:dragend='$event.stopPropagation();deleteCursor()'
                            v-on:dragstart='$event.stopPropagation();switchCursor($event,"ns-resize","row-resize");drag($event,{
                               type:        "resize_form_bottom",
                               form_name:    active_form
                            })'
                            >
                    </div>




                    <div            v-bind:id='vb_grid_element_id'  v-if='vb_grid_element_id != null'
                                    v-on:drop="drop($event)"
                                    v-bind:refresh='refresh'
                                    v-on:ondragover="$event.stopPropagation();allowDrop($event)"
                                    v-bind:class='(design_mode?"dotted":"" )'
                                    v-on:click='clickOnMainGrid($event)'
                                    v-bind:style='"position:absolute;display: inline-block; vertical-align: top; width: " + model.forms[active_form].width +  ";height: " + model.forms[active_form].height +  " ;" + (design_mode?"left:15px;top:15px;border: 4px solid lightgray;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);":"border: 0px;" ) '>


                        <div    v-bind:refresh='refresh'
                                style='position:absolute;left:0px;top:0px;z-index:1000000;opacity:1;'>

                            <!-- ACTIVE CONTROL RESIZERS -->
                            <!-- top left -->
                            <div    v-if='design_mode && isValidObject(active_component_index) && isVisible(active_form,active_component_index)'
                                    v-bind:style='"cursor: nwse-resize;z-index:10000000;display:inline-block;background-color: gray; border: 3px solid gray; margin:0;width:12px;height:12px;position:absolute;left:" +
                                        (getLeft(active_form,active_component_index) - 15) +  "px;top:" +
                                        ((getTop(active_form,active_component_index)) - 15) +  "px;"'
                                    v-on:dragend='$event.stopPropagation();deleteCursor();'
                                    v-bind:draggable='true'

                                    v-on:dragstart='$event.stopPropagation();switchCursor($event,"nwse-resize","crosshair");drag($event,{
                                       type:   "resize_top_left",
                                       base_component_id:    model.forms[active_form].components[active_component_index].base_component_id,
                                       index:   active_component_index
                                    })'>
                            </div>

                            <!-- top middle -->
                            <div    v-if='design_mode && isValidObject(active_component_index) && isVisible(active_form,active_component_index)'
                                    v-bind:style='"cursor: ns-resize;z-index:1000;display:inline-block;background-color: gray; border: 3px solid gray; margin:0;width:12px;height:12px;position:absolute;left:" +
                                        ((getLeft(active_form,active_component_index)) + (model.forms[active_form].components[active_component_index].width/2) - 7) +  "px;top:" +
                                        ((getTop(active_form,active_component_index)) - 15) +  "px;"'
                                    v-on:dragend='$event.stopPropagation();deleteCursor();'
                                    v-bind:draggable='true'
                                    v-on:dragstart='$event.stopPropagation();switchCursor($event,"ns-resize","row-resize");drag($event,{
                                                                type:   "resize_top",
                                                                base_component_id:    model.forms[active_form].components[active_component_index].base_component_id,
                                                                index:   active_component_index
                                                             })'>
                            </div>
                            <!-- top right -->
                            <div    v-if='design_mode && isValidObject(active_component_index) && isVisible(active_form,active_component_index)'
                                    v-bind:style='"cursor: nesw-resize;z-index:1000;display:inline-block;background-color: gray; border: 3px solid gray; margin:0;width:12px;height:12px;position:absolute;left:" +
                                        ((getLeft(active_form,active_component_index)) + (model.forms[active_form].components[active_component_index].width) ) +  "px;top:" +
                                        ((getTop(active_form,active_component_index)) - 15) +  "px;"'
                                    v-on:dragend='$event.stopPropagation();deleteCursor();'
                                        v-bind:draggable='true'
                                        v-on:dragstart='$event.stopPropagation();switchCursor($event,"nesw-resize","crosshair");drag($event,{
                                           type:   "resize_top_right",
                                           base_component_id:    model.forms[active_form].components[active_component_index].base_component_id,
                                           index:   active_component_index
                                           })'>
                            </div>

                            <!-- middle left -->
                            <div    v-if='design_mode && isValidObject(active_component_index) && isVisible(active_form,active_component_index)'
                                    v-bind:style='"cursor: ew-resize;z-index:1000;display:inline-block;background-color: gray; border: 3px solid gray; margin:0;width:12px;height:12px;position:absolute;left:" +
                                        ((getLeft(active_form,active_component_index)) - 15) +  "px;top:" +
                                        ((getTop(active_form,active_component_index)) + ((model.forms[active_form].components[active_component_index].height / 2)) - 7) +  "px;"'
                                    v-on:dragend='$event.stopPropagation();deleteCursor();'
                                    v-bind:draggable='true'
                                    v-on:dragstart='$event.stopPropagation();switchCursor($event,"ew-resize","col-resize");drag($event,{
                                                                type:   "resize_left",
                                                                base_component_id:    model.forms[active_form].components[active_component_index].base_component_id,
                                                                index:   active_component_index
                                                             })'>
                            </div>
                            <!-- middle right -->
                            <div    v-if='design_mode && isValidObject(active_component_index) && isVisible(active_form,active_component_index)'
                                    v-bind:style='"cursor: ew-resize;z-index:1000;display:inline-block;background-color: gray; border: 3px solid gray; margin:0;width:12px;height:12px;position:absolute;left:" +
                                        ((getLeft(active_form,active_component_index)) + (model.forms[active_form].components[active_component_index].width)) +  "px;top:" +
                                        ((getTop(active_form,active_component_index)) + ((model.forms[active_form].components[active_component_index].height / 2)) - 7) +  "px;"'
                                v-on:dragend='$event.stopPropagation();deleteCursor();'
                                    v-bind:draggable='true'
                                    v-on:dragstart='$event.stopPropagation();switchCursor($event,"ew-resize","col-resize");drag($event,{
                                                                type:   "resize_right",
                                                                base_component_id:    model.forms[active_form].components[active_component_index].base_component_id,
                                                                index:   active_component_index
                                                             })'>
                            </div>
                            <!-- bottom left -->
                            <div    v-if='design_mode && isValidObject(active_component_index) && isVisible(active_form,active_component_index)'
                                    v-bind:style='"cursor: nesw-resize;z-index:1000;display:inline-block;background-color: gray; border: 3px solid gray; margin:0;width:12px;height:12px;position:absolute;left:" +
                                        ((getLeft(active_form,active_component_index)) - 15) +  "px;top:" +
                                        ((getTop(active_form,active_component_index)) + ((model.forms[active_form].components[active_component_index].height)) + 2) +  "px;"'
                                    v-on:dragend='$event.stopPropagation();deleteCursor();'
                                        v-bind:draggable='true'
                                        v-on:dragstart='$event.stopPropagation();switchCursor($event,"nesw-resize","crosshair");drag($event,{
                                                                    type:   "resize_bottom_left",
                                                                    base_component_id:    model.forms[active_form].components[active_component_index].base_component_id,
                                                                    index:   active_component_index
                                                                 })'>
                            </div>
                            <!-- bottom middle -->
                            <div    v-if='design_mode && isValidObject(active_component_index) && isVisible(active_form,active_component_index)'
                                    v-bind:style='"cursor: ns-resize;z-index:1000;display:inline-block;background-color: gray; border: 3px solid gray; margin:0;width:12px;height:12px;position:absolute;left:" +
                                        ((getLeft(active_form,active_component_index)) + (model.forms[active_form].components[active_component_index].width/2) - 7) +  "px;top:" +
                                        ((getTop(active_form,active_component_index)) + ((model.forms[active_form].components[active_component_index].height)) + 2) +  "px;"'
                                    v-on:dragend='$event.stopPropagation();deleteCursor();'
                                    v-bind:draggable='true'
                                    v-on:dragstart='$event.stopPropagation();switchCursor($event,"ns-resize","row-resize");drag($event,{
                                                                type:   "resize_bottom",
                                                                base_component_id:    model.forms[active_form].components[active_component_index].base_component_id,
                                                                index:   active_component_index
                                                             })'>
                            </div>

                            <!-- bottom right -->
                            <div    v-if='design_mode && isValidObject(active_component_index) && isVisible(active_form,active_component_index)'
                                    v-bind:style='"cursor: nwse-resize;z-index:1000;display:inline-block;background-color: gray; border: 3px solid gray; margin:0;width:12px;height:12px;position:absolute;left:" +
                                        ((getLeft(active_form,active_component_index)) + (model.forms[active_form].components[active_component_index].width) ) +  "px;top:" +
                                        ((getTop(active_form,active_component_index)) + ((model.forms[active_form].components[active_component_index].height)) + 2) +  "px;"'
                                    v-on:dragend='$event.stopPropagation();deleteCursor();'
                                    v-bind:draggable='true'
                                    v-on:dragstart='$event.stopPropagation();switchCursor($event,"nwse-resize","crosshair");drag($event,{
                                                                   type:   "resize_bottom_right",
                                                                   base_component_id:    model.forms[active_form].components[active_component_index].base_component_id,
                                                                   index:   active_component_index
                                                                        })'>
                            </div>





                            <!-- DELETE -->
                            <div     v-if='design_mode && isValidObject(active_component_index) && isVisible(active_form,active_component_index)'
                                     v-bind:refresh='refresh'
                                     class='btn btn-danger'
                                     v-bind:style='"box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 8px 0px, rgba(0, 0, 0, 0.19) 0px 6px 20px 0px;padding:0px; z-index: 21474836;opacity:1;position: absolute; "  +
                                        "left: " + ((getLeft(active_form,active_component_index)) - 70) + "px;" +
                                        "top:  " + ((getTop(active_form,active_component_index)) - 45) +  "px;" +
                                        "width: 30px; height: 30px; line-height:30px;text-align: center;vertical-align: middle;"'
                                     v-on:click='$event.stopPropagation();deleteComponent(active_component_index)'>

                                    X

                            </div>





                            <!-- LINKS IN -->
                            <div     v-if='design_mode && isValidObject(active_component_index) && isVisible(active_form,active_component_index)'
                                     v-bind:refresh='refresh'
                                     class='btn btn-light'
                                     v-bind:style='"box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 8px 0px, rgba(0, 0, 0, 0.19) 0px 6px 20px 0px;padding:0px; z-index: 21474836;opacity:1;position: absolute; "  +
                                        "left: " + ((getLeft(active_form,active_component_index)) - 70) + "px;" +
                                        "top:  " + ((getTop(active_form,active_component_index)) +
                                        (model.forms[active_form].components[active_component_index].height / 2) - 18) +  "px;" +
                                        "width: 50px; height: 30px; line-height:30px;text-align: center;vertical-align: middle;"'
                                     v-on:click='$event.stopPropagation();showComponentLinks(active_component_index,"incoming")'>

                                    -&gt;

                                    <span   class="badge badge-primary"
                                            v-html='(form_runtime_info[active_form].component_incoming_count_by_uuid[model.forms[active_form].components[active_component_index].uuid])?(form_runtime_info[active_form].component_incoming_count_by_uuid[model.forms[active_form].components[active_component_index].uuid]):0'>
                                    </span>
                            </div>


                            <!-- LINKS OUT -->
                            <div     v-if='design_mode && isValidObject(active_component_index) && isVisible(active_form,active_component_index)'
                                     v-bind:refresh='refresh'
                                     class='btn btn-light'
                                     v-bind:style='"box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 8px 0px, rgba(0, 0, 0, 0.19) 0px 6px 20px 0px;padding:0px; z-index: 21474836;opacity:1;position: absolute; "  +
                                        "left: " + ((getLeft(active_form,active_component_index)) + (model.forms[active_form].components[active_component_index].width) + 15) + "px;" +
                                        "top:  " + ((getTop(active_form,active_component_index)) +
                                        (model.forms[active_form].components[active_component_index].height / 2) - 18) +  "px;" +
                                        "width: 50px; height: 30px; line-height:30px;text-align: center;vertical-align: middle;"'
                                     v-on:click='$event.stopPropagation();showComponentLinks(active_component_index,"outgoing")'>

                                    -&gt;

                                    <span   class="badge badge-primary"
                                            v-html='(form_runtime_info[active_form].component_outgoing_count_by_uuid[model.forms[active_form].components[active_component_index].uuid])?(form_runtime_info[active_form].component_outgoing_count_by_uuid[model.forms[active_form].components[active_component_index].uuid]):0'>
                                    </span>
                            </div>




                            <!-- Builder ... button -->
                            <div     v-if='design_mode && isValidObject(active_component_index) && isVisible(active_form,active_component_index)'
                                     v-bind:refresh='refresh'
                                     class='btn btn-info'
                                     v-bind:style='"background: white;padding:0px; z-index: 21474836;opacity:1;position: absolute; "  +
                                        "left: " + ((getLeft(active_form,active_component_index)) + (model.forms[active_form].components[active_component_index].width / 2) - 15) + "px;" +
                                        "top:  " + ((getTop(active_form,active_component_index)) - 45) +  "px;" +
                                        "width: 30px; height: 30px; line-height:30px;text-align: center;vertical-align: middle;"'
                                     v-on:click='GLOBALS.lastEditingAppBaseComponentId = GLOBALS.editingAppBaseComponentId; GLOBALS.lastEditingAppCodeId = GLOBALS.editingAppCodeId;$event.stopPropagation();$root.$emit("message", { type:  "edit_component", base_component_id:   model.forms[active_form].components[active_component_index].base_component_id, form_id: active_form, control_name: model.forms[active_form].components[active_component_index].name})'
                          >


                                  <img
                                      src='/driver_icons/builder.png'
                                      style='margin: auto;'
                                      zzz=""
                                      class='img-fluid'>
                                  </img>
                            </div>






                          <!-- Fork component ... button -->
                          <div     v-if='design_mode && isValidObject(active_component_index) && isVisible(active_form,active_component_index)'
                                   v-bind:refresh='refresh'
                                   class='btn btn-info'
                                   v-bind:style='"background: white;padding:0px; z-index: 21474836;opacity:1;position: absolute; "  +
                                        "left: " + ((getLeft(active_form,active_component_index)) + (model.forms[active_form].components[active_component_index].width) + 15) + "px;" +
                                        "top:  " + ((getTop(active_form,active_component_index)) - 45) +  "px;" +
                                        "width: 30px; height: 30px; line-height:30px;text-align: center;vertical-align: middle;"'
                                   zzz=""
                                   v-on:click='GLOBALS.lastEditingAppBaseComponentId = GLOBALS.editingAppBaseComponentId; GLOBALS.lastEditingAppCodeId = GLOBALS.editingAppCodeId;$event.stopPropagation();$root.$emit("message", { type:  "fork_component", base_component_id:   model.forms[active_form].components[active_component_index].base_component_id, form_id: active_form, control_name: model.forms[active_form].components[active_component_index].name})'
                          >


                            <img
                                src='/driver_icons/plus.png'
                                style='margin: auto;'
                                class='img-fluid'>
                            </img>
                          </div>



                          


                          <!-- Advanced details ... button -->
                          <div     v-if='design_mode && isValidObject(active_component_index) && isVisible(active_form,active_component_index) && hasMoreDetailsUi(active_form,active_component_index)'
                                   v-bind:refresh='refresh'
                                   class='btn btn-info'
                                   v-bind:style='"box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 8px 0px, rgba(0, 0, 0, 0.19) 0px 6px 20px 0px;padding:0px; z-index: 21474836;opacity:1;position: absolute; "  +
                                        "left: " + ((getLeft(active_form,active_component_index)) + (model.forms[active_form].components[active_component_index].width) + 15) + "px;" +
                                        "top:  " + ((getTop(active_form,active_component_index)) + (model.forms[active_form].components[active_component_index].height) + 15) +  "px;" +
                                        "width: 30px; height: 30px; line-height:30px;text-align: center;vertical-align: middle;"'
                                   v-on:click='$event.stopPropagation();showComponentDetailedDesignUi(active_component_index)'>

                            ...

                          </div>





                            <div    v-bind:refresh='refresh'
                                    v-for='(item,index) in getActiveFormComponents()'
                                    ondrop="return false;"
                                    v-on:click='if ( isVisible(active_form,index)){ $event.stopPropagation();selectComponent(index,true); }'
                                    v-bind:style='((design_mode && isVisible(active_form,index))?"border: 1px solid black;background: white;":"") +
                                                    "position: absolute;top: " + getTop(active_form,index) + ";left:" + getLeft(active_form,index) + ";height:" + item.height + "px;width:" + item.width + "px;;overflow:none;"'>

                                <div ondrop="return false;"
                                     v-bind:style='"position: absolute; top: 0px; left: 0px;height:" + item.height + "px;width:" + item.width + "px;overflow:hidden;"'>
                                    <component  v-bind:id='active_form + "_" + model.forms[active_form].components[index].name + (design_mode?"_design":"")'
                                                v-bind:refresh='refresh'
                                                v-bind:meta='{form: active_form,name: item.name + (design_mode?"_design":""),getEditor: getEditor, lookupComponent: lookupComponent,lookupComponentOnForm: lookupComponentOnForm}'
                                                v-bind:form="active_form"
                                                v-bind:design_mode='design_mode'
                                                v-bind:children='getChildren(item.name)'
                                                v-on:send="processControlEvent"
                                                v-bind:is='item.base_component_id'
                                                v-if='!item.parent && model.forms[active_form].components[index]'
                                                v-bind:name='item.name + "_design_mode_" + design_mode'
                                                v-bind:properties='model.forms[active_form].components[index]'
                                                v-bind:props='model.forms[active_form].components[index]'
                                                v-bind:args='model.forms[active_form].components[index]'>

                                        <template       slot-scope="child_components"
                                                        v-bind:refresh='refresh'
                                                        style='position:relative;'>

                                            <component  v-for='child_item  in  getChildren(item.name)'
                                                        v-bind:design_mode='design_mode'
                                                        v-bind:refresh='refresh'
                                                        v-bind:meta='{form: active_form,name: child_item.name + (design_mode?"_design":""),getEditor: getEditor, lookupComponent: lookupComponent,lookupComponentOnForm: lookupComponentOnForm}'
                                                        v-bind:form="active_form"
                                                        v-bind:style='"z-index:100000;position: absolute; top: " + child_item.topY + "px; left: " + child_item.leftX + "px;height:" + child_item.height + "px;width:" + child_item.width + "px;overflow:auto;"'
                                                        v-bind:id='active_form + "_" + model.forms[active_form].components[child_item.index_in_parent_array].name + (design_mode?"_design":"")'
                                                        v-on:send="processControlEvent"
                                                        v-bind:is='child_item.base_component_id'
                                                        v-bind:name='child_item.name + "_design_mode_" + design_mode'
                                                        v-bind:properties='model.forms[active_form].components[child_item.index_in_parent_array]'
                                                        v-if='model.forms[active_form].components[child_item.index_in_parent_array]'
                                                        v-bind:props='model.forms[active_form].components[child_item.index_in_parent_array]'
                                                        v-bind:args='model.forms[active_form].components[child_item.index_in_parent_array]'>
                                            </component>

                                        </template>

                                    </component>
                                </div>

                                <div    v-bind:style='"cursor: move;position: absolute; top: 0px; left: 0px;z-index: " + (item.is_container?"1":"10000000") + ";width: 100%;height: 100%;border: 1px solid black;"'
                                        v-bind:draggable='design_mode'
                                        v-if='design_mode && isVisible(active_form,index)'
                                        ondrop="return false;"
                                        v-on:dragstart='$event.stopPropagation();drag($event,{
                                                                                       type:   "move_component",
                                                                                       base_component_id:    item.base_component_id,
                                                                                       index:   index
                                                                                    })'>

                                    <div    v-if='design_mode && isVisible(active_form,index)'
                                            ondrop="return false;"
                                            v-bind:refresh='refresh'
                                            v-bind:style='"position: absolute; top: 0px; left: 0px;z-index: 10000000;width: 100%;height: 100%; background-color: lightgray;" +
                                                            ((index == active_component_index)?"opacity: 0;":"opacity: .6;") '>

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
                    v-bind:class='(right_mode == "project"?"right_project_pane_expanded":"right_project_pane_collapsed")'
                    v-bind:refresh='refresh'
                    v-bind:style='"padding:0px; border: 4px solid lightgray;white-space:nowrap"'>

                <div v-bind:style='"border-radius: 3px;  padding: 4px;overflow-x:none;height: 40px;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);font-family:verdana,helvetica;font-size: 13px;" '
                     v-bind:class='(selected_pane == "project"?"selected_pane_title":"unselected_pane_title") '
                     v-on:click='$event.stopPropagation();let s = (right_mode == "properties"?"project":"project");selected_pane = "project";chooseRight(s);'
                     >

                     Project explorer

                    <button type=button class='btn btn-sm btn-warning'
                            v-bind:style='"position: absolute; right: 13px;" + (right_mode == "project"?"":"display:;font-family:verdana,helvetica;font-size: 13px;")'
                            v-on:click='$event.stopPropagation();selected_pane = "project"; chooseRight("project");addForm()'  >

                         Add form

                    </button>
                </div>


                <div  v-bind:style='"font-family:verdana,helvetica;font-size: 13px;border-radius: 3px; padding:4px; border-right:2px solid gray;border-bottom:2px solid gray; margin-top:2px;;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);height:80%;background-color:lightgray;"  + (right_mode == "project"?"":"display:none;")'>
                    <div    style="align-items: stretch;border-radius: 3px;overflow-y:scroll; padding:0px; border: 0px solid lightgray;border-left: 2px solid gray;border-top: 2px solid gray; background-color:white;height:100%;">

                        <div    v-bind:style='"border-radius: 0px;padding:4px;margin:0px;margin-top: 5px;" + (model.app_selected?"background-color:gray;color:white;":"background-color:white;color:black;")'
                                v-on:click='$event.stopPropagation();selected_pane = "project";select_app()'>

                                    <b>{{edited_app_component_id}}</b>
                        </div>

                        <div v-for='form in getForms()' v-bind:refresh='refresh'>
                            <div>
                                <div  v-bind:style='(((form.name == active_form) && (active_component_index == null) && (!model.app_selected)) ?"border: 0px solid red;background-color:gray;color:white;":"color:black;") + "padding:4px;margin:0px;margin-left:30px;border-radius: 3px;"'
                                      v-on:click='$event.stopPropagation();selected_pane = "project";selectForm(form.name)'>

                                     <img
                                            src='/driver_icons/form.png'
                                            style='width: 20px; margin-right: 10px;'
                                            class='img-fluid'>
                                     </img>

                                              {{form.name}} ({{form.components.length}})
                                </div>

                                <div    v-if='form.name == active_form'
                                        v-for='(av,index) in getActiveFormComponents()'
                                        v-on:click='$event.stopPropagation();selected_pane = "project";selectComponent(index)'
                                        >

                                    <div  v-bind:style='(((index == active_component_index) && design_mode)?"border: 0px solid red;background-color: gray;color: white;":"") + "margin-left:80px; padding:2px;border-radius: 3px;width:90%;"'
                                          v-if='(av.parent == null)'>
                                      <div  style='width:100%;display:inline-block;overflow: hidden;'
                                            >

                                              {{av.name}}
                                              <div    v-if='form.name == active_form'
                                                      v-for='(av2,index2) in getActiveFormComponents()'
                                                      v-on:click='$event.stopPropagation();selected_pane = "project";selectComponent(index2)'
                                                      >

                                                  <div  v-bind:style='(((index2 == active_component_index) && design_mode)?"border: 0px solid red;background-color: gray;color: white;":"") + "margin-left:20px; padding:2px;border-radius: 3px;width:90%;"'
                                                        v-if='(av2.parent == av.name)'>
                                                    <div  style='width:100%;display:inline-block;overflow: hidden;'
                                                          >

                                                            {{av2.name}}
                                                    </div>
                                                  </div>
                                              </div>
                                      </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>










            <div    id='right_properties_pane'
                    v-bind:class='(right_mode == "properties"?"right_properties_pane_collapsed":"right_properties_pane_collapsed")'
                    v-bind:style='"padding:0px; border: 4px solid lightgray;padding:0px;background-color: lightgray;"'>

                <div    v-bind:style='"border-radius: 3px;padding: 4px;height: 40px;overflow-x:none;white-space:nowrap;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);overflow:hidden ;text-overflow: ellipsis;font-family:verdana,helvetica;font-size: 13px;"'
                        v-bind:class='(selected_pane == "properties"?"selected_pane_title_slower":"unselected_pane_title_slower") '
                        v-on:click='selected_pane = "properties";chooseRight("properties");'>
                    Properties - {{isValidObject(active_component_index)?model.forms[active_form].components[active_component_index].name + " (Component)" : active_form + " (Form)"}}
                </div>


                <div id='property_selector_parent' style='margin: 5px;'>

                </div>

                <div  style="border-radius: 3px; padding:4px; border-right:2px solid gray;border-bottom:2px solid gray; margin-top:2px;;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);height:65%;">
                    <div    id="property_scroll_region"
                            style="border-radius: 3px;overflow-y:scroll; padding:0px; border: 0px solid lightgray;border-left: 2px solid gray;border-top: 2px solid gray; background-color:white;height:100%;">


                        <div    v-for='property in properties'
                                style='font-family:verdana,helvetica;font-size: 13px;border-bottom: 1px solid lightgray;padding:0px;margin:0px;'
                                >

                            <div style='width:100%;padding:0px;margin:0px;display:flex;'
                                 v-if='!property.hidden'>
                                <div
                                        v-bind:style='"text-overflow: ellipsis;white-space: pre-line;vertical-align: top;display:flex;width:40%;margin: 0px;font-family:verdana,helvetica;font-size: 13px;padding-left: 1px;padding-top:0px;padding-bottom:0px;" + (active_property_index == property.name?"background-color:#000099;color:white;":"")'
                                        v-on:click='selected_pane = "properties";active_property_index = property.name;'>{{property.name}}
                                  <div    v-if="property.id == 'base_component_id'"    
                                          style='margin-left:5px;margin-top:2px;margin-bottom:2px;border-right: 2px solid gray;border-bottom: 2px solid gray;background-color: darkgray;float: right; padding:0px; padding-right:5px;padding-left:20px;height: 20px;color: white;border-radius: 3px;font-family:verdana,helvetica;font-size: 13px;font-style:bold;'
                                          v-on:click='debug_component=model.forms[active_form].components[active_component_index].base_component_id;'  > ..
                                  </div>
                                </div>

                                <div style='display:flex;width:57%;padding:0px;padding-left:3px; border-left: 1px solid lightgray;'
                                     v-on:click='selected_pane = "properties";'>

                                     <div v-if="isValidObject(property.help)"
                                          style="width:auto;display:inline-block;">
                                          <div        style='margin-right:4px;margin-left:2px;margin-top:2px;margin-bottom:2px;border-right: 2px solid gray;border-bottom: 2px solid gray;background-color: pink; padding:0px; padding-right:5px;padding-left:5px;height: 20px;border-radius: 3px;font-family:verdana,helvetica;font-size: 13px;font-style:bold;color:black;width:20px;'
                                                      v-on:click='$event.stopPropagation();showHelp({
                                                          help:                   property.help
                                                      })'  >?</div>

                                     </div>

                                    <div v-if='!property.readonly' style="width:100%">


                                    <div v-if="(property.editor  == 'detail_editor')  " style="width:100%">
                                        <div        style='margin-top:2px;margin-bottom:2px;border-right: 2px solid gray;border-bottom: 2px solid gray;background-color: darkgray;float: right; padding:0px; padding-right:5px;padding-left:20px;height: 20px;color: white;border-radius: 3px;font-family:verdana,helvetica;font-size: 13px;font-style:bold;'
                                                    v-on:click='$event.stopPropagation();showComponentDetailedDesignUi(active_component_index)'
                                                    >
                                            ...
                                        </div>
                                    </div>


                                        <div    v-if="(property.type  == 'String')  || (property.type  == 'Number')">
                                            <input
                                                    v-if="(property.textarea == null) || (property.textarea == '')"
                                                    @change='setVBEditorProperty($event, property)'
                                                    v-bind:value='getVBEditorProperty(property)'
                                                    v-bind:type='property.password?"password":""'
                                                    style='width: 100%;border: 0px;font-family:verdana,helvetica;font-size: 13px;padding:0px;'>
                                            </input>
                                            <textarea
                                                    v-if="(property.textarea != null) && (property.textarea != '')"
                                                    rows=10
                                                    @change='setVBEditorProperty($event, property)'
                                                    v-bind:value='getVBEditorProperty(property)'
                                                    v-bind:type='property.password?"password":""'
                                                    style='width: 100%;border: 0px;font-family:verdana,helvetica;font-size: 13px;padding:0px;'>
                                            </textarea>
                                        </div>





                                        <div    v-if="(property.type  == 'FilePath') ">
                                            <img    src='/driver_icons/fileopen.png'
                                                    style='height: 16px;'
                                                    class='img-fluid'>
                                            </img>

                                            <div        style='margin-top:2px;margin-bottom:2px;border-right: 2px solid gray;border-bottom: 2px solid gray;background-color: darkgray;float: right; padding:0px; padding-right:5px;padding-left:20px;height: 20px;color: white;border-radius: 3px;font-family:verdana,helvetica;font-size: 13px;font-style:bold;'
                                                        v-on:click='$event.stopPropagation();selectFilePath({
                                                            app_selected:           model.app_selected,
                                                            active_form:            active_form,
                                                            active_component_index: active_component_index,
                                                            property_id:            property.id,
                                                            file_exts:              property.file_exts
                                                        })'  >
                                                Open file
                                            </div>
                                            {{model.forms[active_form].components[active_component_index][property.id]}}
                                        </div>








                                        <div    v-if="(property.type  == 'Select')  ">
                                            <select  @change='setVBEditorProperty($event, property)'>
                                                  <option   v-for="propVal in property.values"
                                                            v-bind:value="propVal.value"
                                                            v-bind:selected="propVal.value == model.forms[active_form].components[active_component_index][property.id]">

                                                        {{propVal.display}}

                                                  </option>
                                            </select>
                                        </div>
                                        <div    v-if="(property.type  == 'Image') ">
                                            <input type="file"
                                                   id="image_file"
                                                   @change="previewUpload(property)">
                                            </input>
                                        </div>
                                        <div    v-if="(property.type  == 'File') ">
                                            <input type="file"
                                                   id="upload_file"
                                                   @change="previewFileUpload(property)">
                                            </input>
                                        </div>




                                        <div    v-if="(property.type  == 'Event') || ((property.type  == 'Action_old') && isValidObject(property.fn)) "
                                                style="width:100%">

                                            <div        style='margin-top:2px;margin-bottom:2px;border-right: 2px solid gray;border-bottom: 2px solid gray;background-color: darkgray;float: right; padding:0px; padding-right:5px;padding-left:20px;height: 20px;color: white;border-radius: 3px;font-family:verdana,helvetica;font-size: 13px;font-style:bold;'
                                                        v-on:click='$event.stopPropagation();editAsCode({
                                                            app_selected:           model.app_selected,
                                                            active_form:            active_form,
                                                            active_component_index: active_component_index,
                                                            property_id:            property.id
                                                        })'  >
                                                JS
                                            </div>
                                          
                                        </div>

                                    </div>

                                    <div v-if='property.readonly'>
                                        <div    v-if='active_component_index != null'
                                                style='padding:0px;font-family:verdana,helvetica;font-size: 13px;'
                                                class='col-md-12 small'>

                                            {{model.forms[active_form].components[active_component_index][property.id]}}

                                        </div>

                                        <div v-if='(active_component_index == null) && (active_form != null) && (model.app_selected == false)' class='col-md-12 small'   v-model='model.forms[active_form][property.id]'>
                                        </div>

                                        <div    v-if='model.app_selected'
                                                style='padding:0px;font-family:verdana,helvetica;font-size: 13px;'
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
                                            style='font-family:verdana,helvetica;font-size: 13px;'
                                            v-on:click='$event.stopPropagation();addProperty()'  >
                                    Add property
                                </button>
                            </div>
                        </div>

                        <div v-if='(model.app_selected) && (add_property)' class='row'>
                            <div    style='font-family:verdana,helvetica;font-size: 13px;font-weight:bold;padding-left:20px;'
                                    class='col-md-12 small'>
                                Add a property
                            </div>
                        </div>

                        <div v-if='(model.app_selected) && (add_property)' class='row'>
                            <div    style='font-family:verdana,helvetica;font-size: 13px;'
                                    class='col-md-4'>
                               ID
                            </div>

                            <input  style='font-family:verdana,helvetica;font-size: 13px;'
                                    class='col-md-7 small'
                                    placeholder='background_color'
                                    v-model='new_property_id'>
                            </input>
                        </div>

                        <div v-if='(model.app_selected) && (add_property)' class='row'>
                            <div    style='font-family:verdana,helvetica;font-size: 13px;'
                                    class='col-md-4'>
                                Name
                            </div>

                            <input  class='col-md-7 small'
                                    placeholder='Background Color'
                                    style='border:0px;font-family:verdana,helvetica;font-size: 13px;'
                                    v-model='new_property_name'>
                            </input>
                        </div>

                        <div v-if='(model.app_selected) && (add_property)' class='row'>
                            <div    style='font-family:verdana,helvetica;font-size: 13px;'
                                    class='col-md-4'>
                                Type
                            </div>

                            <select  class='col-md-7 small'
                                     style='border:0px;font-family:verdana,helvetica;font-size: 13px;'
                                     v-model='new_property_type'>

                                    <option  v-bind:selected='new_property_type=="String"' value="String">String</option>
                                    <option  v-bind:selected='new_property_type=="Number"' value="Number">Number</option>
                                    <option  v-bind:selected='new_property_type=="Array"' value="Array">Array</option>
                                    <option  v-bind:selected='new_property_type=="Object"' value="Object">Object</option>
                            </select>
                        </div>




                        <div    v-if='(model.app_selected) && (add_property)'
                                style='padding-bottom:60px;'
                                class='row'>
                            <div class='col-md-12'>
                                <button style='font-family:verdana,helvetica;font-size: 13px;'
                                        type=button class='btn btn-sm btn-info'
                                        v-on:click='$event.stopPropagation();addPropertyCancel()'  >
                                    Cancel
                                </button>

                                <button style='font-family:verdana,helvetica;font-size: 13px;'
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
</div>`,
        mounted:        async function() {
            /*
            ________________________________________
            |                                      |
            |             MOUNTED                  |
            |                                      |
            |______________________________________|

            This is called whenever an app is loaded, either at design
            time or at runtime

            __________
            | Params |
            |        |______________________________________________________________
            |
            |     NONE
            |________________________________________________________________________ */
            let mm                          = this
            let json2
            let subComponentsUsedInThisApp

            mm.unique_app_dom_element_id    = uuidv4()
            mm.vb_grid_element_id           = "vb_grid_"+ uuidv4()
            mm.vb_editor_element_id         = "vb_editor_"+ uuidv4()
            mm.local_app                    = localAppshareApp
            mm.in_change_model              = true

            if (mm.properties) {
                mm.args = mm.properties
            } else {
                mm.properties = mm.args
            }

            if (mm.design_mode) {
                disableAutoSave = false
            }


            /*
            ________________________________________
            |    mounted                           |
            |_________________                     |_______________________________
                             | Get the base component ID of the code to edit/run
                             |
                             | Save it in "this.edited_app_component_id"
                             |_____________________________________________________
            */
            if (texti) {
                json2                       = mm.getJsonModelFromCode(  texti  )
                mm.old_model                = JSON.parse(JSON.stringify(json2));
                mm.model                    = json2
                mm.edited_app_component_id  = yz.getValueOfCodeString(texti, "base_component_id")

                mm.read_only = yz.getValueOfCodeString(texti, "read_only")
            }
            mm.active_form = mm.model.default_form






            /*
            ________________________________________
            |    mounted                           |
            |_________________                     |_______________________________
                             | find out which sub components are used by this app
                             | and save the result in "this.components_used_in_this_app"
                             | which just sets the value to "true" for the base_component_id
                             | of that component
                             |_____________________________________________________
            */
            if (mm.edited_app_component_id) {
                subComponentsUsedInThisApp = await getSubComponents(mm.text)

                for (let i = 0; i < subComponentsUsedInThisApp.length; i++) {
                    mm.components_used_in_this_app[subComponentsUsedInThisApp[i].child_base_component_id] = true
                }
            }





            /*
            ________________________________________
            |    mounted                           |
            |_________________                     |_______________________________
                             | Set up all the form methods
                             |_____________________________________________________
            */
            let forms = mm.getForms()
             for (let formIndex = 0; formIndex < forms.length; formIndex ++) {
                 let formName = forms[formIndex].name

                 let formProps = mm.getFormProperties()
                 for (let cpp = 0 ; cpp < formProps.length; cpp ++) {
                     let formprop = formProps[cpp]
                     let formDef = mm.model.forms[formName]
                     if (formprop.type == "Action") {
                         formDef[formprop.id] =
                             mm.getFormMethod(   formName,
                                                 formprop)

                     } else if (!isValidObject(formprop)){
                         formDef[formprop.id] = ""
                     }
                 }




                /*
                ________________________________________
                |    mounted                           |
                |_________________                     |_______________________________
                                 | Load the component definitions for all components on
                                 | this form
                                 |_____________________________________________________
                */
                 let compsToLoad = []
                 for (let compenentInFormIndex = 0; compenentInFormIndex < mm.model.forms[formName].components.length ; compenentInFormIndex++ )
                 {
                     let newItem = mm.model.forms[formName].components[compenentInFormIndex]
                     if (!GLOBALS.isComponentTypeCached(newItem.base_component_id)) {
                         compsToLoad.push(
                             {
                                 baseComponentId:   newItem.base_component_id,
                                 codeId:            newItem.code_id
                             }
                         )
                     }
                 }
                 await loadUiComponentsV4(compsToLoad)



                 // ---------------------------------------------------------
                 // For each app property
                 // ---------------------------------------------------------
                 let appProps = mm.getAllAppPropeties()
                 for (let appPropIndex = 0 ; appPropIndex < appProps.length ; appPropIndex ++ ) {
                     let propDetails = appProps[appPropIndex]
                     if (propDetails.type == "Action") {
                         mm.model[propDetails.id] = mm.getAppMethod(propDetails.id)
                     } else if (!isValidObject(mm.model[propDetails.id])){
                         if (isValidObject(propDetails.default)){
                             mm.model[propDetails.id] = propDetails.default
                         } else if (isValidObject(propDetails.default_expression)){
                             mm.model[propDetails.id] = eval("(" + propDetails.default_expression + ")")
                         }
                     }
                 }

            }
            // ---------------------------------------------------------
            // For each form ...
            // ---------------------------------------------------------


           //console.log("Time " + (ttq++) + ": " + (new Date().getTime()- startTime))



           //
           // get the availabe components
           //
           if (GLOBALS.online) {
            //debugger
             await mm.loadControls()
           }







           mm.updateAllFormCaches()
           //console.log("Time " + (ttq++) + ": " + (new Date().getTime()- startTime))



           //console.log("Time " + (ttq++) + ": " + (new Date().getTime()- startTime))


           mm.$forceUpdate();
           //console.log("Time " + (ttq++) + ": " + (new Date().getTime()- startTime))

           mm.updatePropertySelector()

           texti = null

           setTimeout(async function(){
                mm.selectForm(mm.model.default_form)

           },500)


           mm.$root.$on('message', async function(text) {
               if (text.type == "delete_design_time_component") {
                    if (mm.design_mode != false) {
                        mm.model.forms[mm.active_form].components.splice(text.component_index, 1);
                    }
               } else if (text.type == "select_design_time_component") {
                   if (mm.design_mode != false) {
                        mm.selectComponent(text.component_index, true);
                   }
               } else if (text.type == "load_controls") {
                   if (mm.design_mode != false) {
                        mm.loadControls();
                   }
               }
           })

           hideProgressBar()
           mm.in_change_model = false

           mm.old_model = JSON.parse(JSON.stringify(mm.model));




           //
           // start of update all watched vars when a form is activated
           //
           if (!this.design_mode) {
               for (let componentIndex = 0; componentIndex < mm.model.forms[this.active_form].components.length; componentIndex++){
                   let thisComponent = mm.model.forms[this.active_form].components[componentIndex]
                   let uuid = thisComponent.uuid
                   //console.log("UUID: " + JSON.stringify(uuid,null,2))
                   //console.log(this.watchList[uuid])
                   let ww2 = this.watchList
                   for (let aaq=0;aaq<ww2.length;aaq++) {
                       let ww = ww2[aaq]
                   if (ww) {
                       if (ww.from_component_uuid == uuid) {
                               //debugger
                               //console.log(ww)

                               let fromc = mm.form_runtime_info[ww.form_name].component_lookup_by_uuid[uuid]
                               //console.log("fromc: " + JSON.stringify(fromc,null,2))


                               let touuid = ww.to_component_uuid
                               let toc = mm.form_runtime_info[ww.form_name].component_lookup_by_uuid[touuid]
                               //console.log("toc: " + JSON.stringify(toc,null,2))



                               //mm.model.forms[this.active_form].components[0].text = "" + mm.model.forms[this.active_form].components[1].value
                               let vvvvvv = fromc[ww.from_component_property_name]
                               let toValue = JSON.parse(JSON.stringify(vvvvvv))

                               if (ww.transform_fn) {
                                   try {
                                       let toValueFn = eval("("+ ww.transform_fn + ")")
                                       toValue = toValueFn(toValue)
                                   } catch (err) {
                                       console.log(err)
                                   }
                               }
                               let oldValue = toc[ww.to_component_property_name]
                               toc[ww.to_component_property_name] = toValue
                               //debugger
                               mm.processControlEvent(
                               {
                                           type:               "subcomponent_event",
                                           form_name:           mm.active_form,
                                           control_name:        toc.name,
                                           sub_type:           "on_property_in",
                                           code:                toc.on_property_in,
                                           args:               {
                                               from_form:           mm.active_form,
                                               from_component:      fromc.name,
                                               from_property:       ww.from_component_property_name,
                                               from_value:          toValue,
                                               to_form:             mm.active_form,
                                               to_component:        toc.name,
                                               to_property:         ww.to_component_property_name,
                                               to_value:            toValue,
                                               to_old_value:        oldValue,
                                               to_new_value:        toValue
                                           }
                                })
                       }
                   }
               }
               }
            }
           //
           // end of update all watched vars when a form is activated
           //




            /*
             _______________________________________
             |    mounted                           |
             |_________________                     |____________
                              | Change a UI control in the app
                              | after the Ui control class definition
                              | has been edited in another editor
                              |__________________________________
             */            if (mm.design_mode) {
                if (GLOBALS.originalNameOfEditedUiControl) {
                    if (GLOBALS.finalBaseComponentIdOfEditedUiControl &&
                        (GLOBALS.originalBaseComponentIdOfEditedUiControl !=
                            GLOBALS.finalBaseComponentIdOfEditedUiControl)) {
                        setTimeout(function(){
                            mm.changePropertyValue(
                                {
                                    componentName:   GLOBALS.originalNameOfEditedUiControl,
                                    propertyName:   "base_component_id",
                                    propertyValue:   GLOBALS.finalBaseComponentIdOfEditedUiControl
                                }
                            )
                            mm.changePropertyValue(
                                {
                                    componentName:   GLOBALS.originalNameOfEditedUiControl,
                                    propertyName:   "code_id",
                                    propertyValue:   GLOBALS.finalCodeIdOfEditedUiControl
                                }
                            )
                            GLOBALS.originalNameOfEditedUiControl = null

                        },1000)
                    }

                }
            }

            /*
            ________________________________________
            |    mounted                           |
            |_________________                     |_______________________________
                             |  This is only used when previewing a component. Since we use the "Blank Yazz App"
                             |  for previews we need to see if the argument 'control_type' is passed in, and if
                             |  it is then we remove then standard text box (with a name of 'aaa') and we add
                             |  the component being previewed instead
                             |
                             |  note this code should be copied to the template too
                             |_____________________________________________________
            */
            if (mm.args && mm.args.control_type) {

                //debugger
                await mm.deleteComponentByName("aaa")
                let compArgs =  {
                    base_component_id:   mm.args.control_type,
                    type:               "add_component",
                    text:               "this.highlighted_control",
                    offsetX:             100,
                    offsetY:             100
                }

                if (mm.args.control_code_id) {
                    compArgs.code_id = mm.args.control_code_id
                }

                await mm.addComponentV2(
                    200,
                    200,
                    compArgs,
                    null,
                    null,
                    [])
            }
// END
// note this code should be copied to the template too
//

setTimeout(async function(){
            if (GLOBALS.isStaticHtmlPageApp) {
                mm.editor_locked = false
            }
            await mm.loadControls()
            mm.editor_locked = false
},2000)


     },
        watch:          {
                            /*
________________________________________
|                                      |
|             WATCH                    |
|                                      |
|______________________________________|

This watches for changes in the design of the application

__________
| Params |
|        |______________________________________________________________
|
|     NONE
|________________________________________________________________________ */
                            model: {
                             handler:
                                 function() {
                                     let mm  =  this

                                     if (!mm) {
                                         return
                                     }

                                     if (this.design_mode) {

                                         let currentTime = new Date().getTime();
                                         if (mm.model_changed_time != -1) {
                                             mm.model_changed_time = currentTime
                                         }

                                         let timeDiff = currentTime - mm.model_changed_time
                                         if (timeDiff > 1000) {
                                             if (!mm.in_change_model) {
                                                 mm.in_change_model = true
                                                 setTimeout(function() {
                                                     //console.log("Changed ********")
                                                     let ttt=null
                                                     if (mm.old_model) {

                                                         ttt = jsondiffpatch2.diff(mm.old_model,mm.model)
                                                         //console.log("Changes: "+ JSON.stringify(ttt,null,2))
                                                     }
                                                     if (ttt) {
                                                         mm.old_model = JSON.parse(JSON.stringify(mm.model));
                                                         mm.$root.$emit('message', {
                                                             type:   "pending"
                                                         })
                                                     }
                                                     mm.in_change_model = false

                                                 },500)
                                             }
                                         }

                                     } else {
                                         //console.log("Changed ********")
                                         let ttt=null
                                         if (mm.old_model) {
                                             ttt = jsondiffpatch2.diff(mm.old_model,mm.model)
                                             //console.log("Changes: "+ JSON.stringify(ttt,null,2))
                                         }

                                         let changedUuids = {}

                                         if (ttt) {
                                             mm.old_model = JSON.parse(JSON.stringify(mm.model));

                                             //debugger
                                             //
                                             // find  out what components have changed in the current form
                                             //
                                             if (ttt.forms[this.active_form]) {
                                                 let allComps = Object.keys(ttt.forms[this.active_form].components)
                                                 let numComp = allComps.length
                                                 for (let componentIndex = 0; componentIndex < numComp; componentIndex++){
                                                     let componentNN = allComps[componentIndex]
                                                     let thisComponent = ttt.forms[this.active_form].components[componentNN]
                                                     let nn = parseInt(componentNN)
                                                     if (nn != NaN) {
                                                         let compname = mm.model.forms[this.active_form].components[nn]
                                                         if (compname) {
                                                             //console.log(this.active_form + ": " + compname.name + " = " + JSON.stringify(thisComponent))
                                                             changedUuids[compname.uuid] = true
                                                         }
                                                     }
                                                 }
                                             }



                                             //
                                             // show a list of properties to watch
                                             //
                                             //console.log("Watch list: " + JSON.stringify(this.watchList,null,2))
                                             //console.log(JSON.stringify(this.watchList,null,2))


                                             //
                                             //
                                             //
                                             //debugger
                                             for (      let componentIndex = 0;
                                                        componentIndex < mm.model.forms[this.active_form].components.length;
                                                        componentIndex++)  {

                                                 let thisComponent  = mm.model.forms[this.active_form].components[componentIndex]
                                                 let uuid           = thisComponent.uuid
                                                 let ww2            = this.watchList

                                                 //console.log("UUID: " + JSON.stringify(uuid,null,2))
                                                 //console.log(this.watchList[uuid])
                                                 for (  let aaq = 0  ;  aaq < ww2.length  ;  aaq++  ) {
                                                     let ww = ww2[ aaq ]

                                                 if (ww) {
                                                     if (ww.from_component_uuid == uuid) {
                                                         if (changedUuids[uuid]) {
                                                             //debugger
                                                             //console.log(ww)

                                                             let fromc = mm.form_runtime_info[ww.form_name].component_lookup_by_uuid[uuid]
                                                             //console.log("fromc: " + JSON.stringify(fromc,null,2))


                                                             let touuid = ww.to_component_uuid
                                                             let toc = mm.form_runtime_info[ww.form_name].component_lookup_by_uuid[touuid]
                                                             //console.log("toc: " + JSON.stringify(toc,null,2))



                                                             //mm.model.forms[this.active_form].components[0].text = "" + mm.model.forms[this.active_form].components[1].value
                                                             let vvvvvv = fromc[ww.from_component_property_name]
                                                             let toValue = JSON.parse(JSON.stringify(vvvvvv))

                                                             if (ww.transform_fn) {
                                                                 try {
                                                                     let toValueFn = eval("("+ ww.transform_fn + ")")
                                                                     toValue = toValueFn(toValue)
                                                                 } catch (err) {
                                                                     console.log(err)
                                                                 }
                                                             }
                                                             let oldValue = toc[ww.to_component_property_name]
                                                             toc[ww.to_component_property_name] = toValue
                                                             //console.log(toValue)

                                                             //debugger
                                                              mm.processControlEvent(
                                                              {
                                                                          type:               "subcomponent_event",
                                                                          form_name:           mm.active_form,
                                                                          control_name:        toc.name,
                                                                          sub_type:           "on_property_in",
                                                                          code:                toc.on_property_in,
                                                                          args:               {
                                                                              from_form:            mm.active_form,
                                                                              from_component:       fromc.name,
                                                                              from_property:        ww.from_component_property_name,
                                                                              from_value:           toValue,
                                                                              to_form:              mm.active_form,
                                                                              to_component:         toc.name,
                                                                              to_property:          ww.to_component_property_name,
                                                                              to_value:             toValue,
                                                                              to_old_value:         oldValue,
                                                                              to_new_value:         toValue
                                                                          }
                                                               })
                                                         }

                                                     }
                                                 }
                                             }
                                             }

                                             mm.refresh++
                                         }
                                     }



                                 }
                             ,
                             deep: true
                         }
                        },
        methods: {
            /* ** *** insert_ui_methods_start *** ** */
            /* ** *** insert_ui_methods_end *** ** */
            setVBEditorPropertyValue:               function        (property, val ) {
             /*
             ________________________________________
             |                                      |
             |                   |
             |                                      |
             |______________________________________|

             TO BE FILLED IN

             __________
             | Params |
             |        |______________________________________________________________
             |
             |     NONE
             |________________________________________________________________________ */
            let mm      = this
            let type    = null

            mm.showSaveButton()


            //
            // determine if this is a control, form or app
            //
            if (this.active_component_index != null) {
                type = "component"
            } else if ((this.active_component_index == null) && (this.active_form != null) && (!this.model.app_selected)) {
                type = "form"
            } else if (this.model.app_selected) {
                type = "app"
            }


            if (type == 'component') {
                let componentTochange = mm.model.forms[this.active_form].components[this.active_component_index]
                let oldContainerName = componentTochange.name

                //hack city!!!!
                // why do we need a timeout just so that the FilePath property gets
                // handled properly??
                setTimeout(function() {
                    componentTochange[property.id]  = val

                    if ((property.id == "name") && (componentTochange.is_container == true)) {
                        //alert("renaming container")

                        let allC = mm.model.forms[mm.active_form].components
                        for (let xi =0; xi< allC.length ; xi ++) {
                             let comp = allC[xi]
                             if (comp.parent == oldContainerName) {
                                comp.parent = componentTochange.name
                             }
                        }
                    }
                    //this.generateCodeFromModel(   )
                    mm.refresh ++

                },100)

            } else if (type == 'form') {
                if (property.id == "name" ) {
                    this.properties = []

                    let oldval = this.active_form
                    //alert("Rename form "  + oldval + " to " + val)

                    this.model.forms[val] = this.model.forms[oldval]
                    this.model.forms[val]["name"] = val

                    this.form_runtime_info[val] = this.form_runtime_info[oldval]


                    if (this.model.default_form == oldval) {
                        this.model.default_form = val
                    }
                    //this.active_form = val


                    mm.form_runtime_info[oldval] = null
                    mm.model.forms[oldval] = null
                    //alert(this.active_form)

                    //mm.refresh ++
                    //mm.updateAllFormCaches()
                    mm.selectForm(val)

                } else {
                    this.model.forms[this.active_form][property.id] = val
                }

            } else if (type == 'app') {
                this.model[property.id] = val
            }

         },
            setVBEditorProperty:                    function        (event, property) {
             /*
             ________________________________________
             |                                      |
             |                   |
             |                                      |
             |______________________________________|

             TO BE FILLED IN

             __________
             | Params |
             |        |______________________________________________________________
             |
             |     NONE
             |________________________________________________________________________ */
            let mm      = this
            let val     = null

            if (property.type == "Number") {
                val     = JSON.parse(event.target.value)
            } else {
                val     = event.target.value
            }
            mm.setVBEditorPropertyValue(property, val)
         },
            getVBEditorProperty:                    function        (property) {
             /*
             ________________________________________
             |                                      |
             |                   |
             |                                      |
             |______________________________________|

             TO BE FILLED IN

             __________
             | Params |
             |        |______________________________________________________________
             |
             |     NONE
             |________________________________________________________________________ */
             let val = ""
             let type
             if (this.active_component_index != null) {
                type = "component"
             } else if ((this.active_component_index == null) && (this.active_form != null) && (!this.model.app_selected)) {
                type = "form"
             } else if (this.model.app_selected) {
                type = "app"
             }

            if (type == 'component') {
                val = this.model.forms[this.active_form].components[this.active_component_index][property.id]


            } else if (type == 'form') {
                val = this.model.forms[this.active_form][property.id]



            } else if (type == 'app') {
                val = this.model[property.id]
            }

            return val
         },
            addProperty:                            function        () {
             /*
             ________________________________________
             |                                      |
             |                   |
             |                                      |
             |______________________________________|

             TO BE FILLED IN

             __________
             | Params |
             |        |______________________________________________________________
             |
             |     NONE
             |________________________________________________________________________ */
            let mm = this
            mm.add_property = true
            mm.new_property_id = ""
            mm.new_property_name = ""
            mm.new_property_type = "String"


            setTimeout(function(){
                let objDiv = document.getElementById("property_scroll_region");
                objDiv.scrollTop = objDiv.scrollHeight;
            },200)
         },
            addPropertySave:                        function        () {
             /*
             ________________________________________
             |                                      |
             |                   |
             |                                      |
             |______________________________________|

             TO BE FILLED IN

             __________
             | Params |
             |        |______________________________________________________________
             |
             |     NONE
             |________________________________________________________________________ */
            let mm = this
            if ((mm.new_property_name.length == 0) || (mm.new_property_id.length == 0)) {
                alert("You must enter a property name and ID")
                return;
            }
            mm.add_property = false

            let fnText = null
            if (mm.new_property_type == "Action") {
                fnText = ""
            }

            let defaultVal = null
            if (mm.new_property_type == "Object") {
                defaultVal = new Object()
            }

            if (mm.new_property_type == "Array") {
                defaultVal = []
            }

            mm.model.app_properties.push({
                                            id:         mm.new_property_id,
                                            name:       mm.new_property_name,
                                            type:       mm.new_property_type,
                                            fn:         fnText,
                                            default:    defaultVal
                                            })

            mm.generateCodeFromModel( )

            setTimeout(function() {
                mm.refresh ++
                mm.select_app()
            }
            ,100)

         },
            addPropertyCancel:                      function        () {
              /*
              ________________________________________
              |                                      |
              |                   |
              |                                      |
              |______________________________________|

              TO BE FILLED IN

              __________
              | Params |
              |        |______________________________________________________________
              |
              |     NONE
              |________________________________________________________________________ */
             let mm = this
             mm.add_property = false
          },
            getComponentProperties:                 function        (componentName) {
              /*
              ________________________________________
              |                                      |
              |                   |
              |                                      |
              |______________________________________|

              TO BE FILLED IN

              __________
              | Params |
              |        |______________________________________________________________
              |
              |     NONE
              |________________________________________________________________________ */
                 let compEvaled = GLOBALS.getControlPropertyDefns({baseComponentId: componentName})
                 if (isValidObject(compEvaled)) {
                     return compEvaled
                 }

                return []
           },
            selectForm:                             function        (formId, showProps) {
             /*
             ________________________________________
             |                                      |
             |                   |
             |                                      |
             |______________________________________|

             TO BE FILLED IN

             __________
             | Params |
             |        |______________________________________________________________
             |
             |     NONE
             |________________________________________________________________________ */
             let mm = this


             mm.active_component_index = null
             mm.model.app_selected = false
             mm.properties = mm.getFormProperties(formId)

             mm.active_form = formId
             mm.refresh ++

             if (  mm.model.forms[  formId  ].form_activate && (!mm.design_mode)) {




                 if (!isValidObject(this.args)) {
                      mm.args = mm.model
                 }

                 let args = mm.args
                 let app = mm.model
                 let crt = mm.model.forms[formId].form_activate

                 let formEvent = {
                     type:               "form_event",
                     form_name:           formId,
                     code:                crt,
                     sub_type:           "activate"
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
            processControlEvent:                    async function  (  eventMessage  ) {
            //-------------------------------------------------------------------
            //                        processControlEvent
            //
            // This is used to run user written event code
            //-------------------------------------------------------------------
            /*
            ________________________________________
            |                                      |
            |                   |
            |                                      |
            |______________________________________|

            TO BE FILLED IN

            __________
            | Params |
            |        |______________________________________________________________
            |
            |     NONE
            |________________________________________________________________________ */
            let mm = this

            let shallIProcessThisEvent = false
            if ((!mm.design_mode) && (mm.model)) {
                shallIProcessThisEvent = true
            }
            if (eventMessage.design_time_only_events && (mm.design_mode) && (mm.model)) {
                shallIProcessThisEvent = true
            }
            if (eventMessage.design_time_only_events && (!mm.design_mode)) {
                shallIProcessThisEvent = false
            }

            if (shallIProcessThisEvent) {
                this.updateAllFormCaches()

                //
                // set up property access for all forms
                //

                let formHandler = {
                     get: function(target,name){
                         let formName = target.name
                         if (mm.model.forms[formName][name]) {
                             return mm.model.forms[formName][name]
                         }

                         if (mm.form_runtime_info[formName].component_lookup_by_name[name]) {
                             return mm.form_runtime_info[formName].component_lookup_by_name[name]
                         }

                         return "Not found"
                     }
                }
                let formEval = ""
                let allForms = this.getForms();
                for (let fi =0; fi < allForms.length ; fi ++) {
                     let aForm = allForms[fi]
                     formEval += ("var " + aForm.name +
                         " = new Proxy({name: '" + aForm.name + "'}, formHandler);")

                }
                eval(formEval)




                //
                // set up property access for all controls on this form
                //
                let allC = this.model.forms[this.active_form].components
                let cacc =""
                for (let xi =0; xi< allC.length ; xi ++) {
                     let comp = allC[xi]
                     // LEAVE this as a "var", otherwise components don't work inscripts
                     cacc += ( "var " + comp.name + " = mm.form_runtime_info['" + this.active_form + "'].component_lookup_by_name['" + comp.name + "'];")
                }
                //eval(cacc)




                if (eventMessage.type == "subcomponent_event") {
                    //debugger
                    if ((eventMessage.code == null) || (eventMessage.code == "")) {
                        return
                    }
                    let fcc =
`(async function(args){
${eventMessage.code}
})`


                    let thisControl = this.form_runtime_info[   this.active_form   ].component_lookup_by_name[   eventMessage.control_name   ]
                    if (isValidObject(thisControl)) {

                        if (isValidObject(thisControl.parent)) {
                            let cacc =""
                            cacc += ( "var parent = mm.form_runtime_info['" + this.active_form + "'].component_lookup_by_name['" + thisControl.parent + "'];")
                            eval(cacc)
                        }

                        let meCode =""
                        meCode += ( "var me = mm.form_runtime_info['" + this.active_form + "'].component_lookup_by_name['" + thisControl.name + "'];")
                        eval(meCode)

                        let appCode =""
                        appCode += ( "var app = mm.model;")
                        eval(appCode)

                        meCode =""
                        meCode += ( "var myForm = mm.model.forms['" + this.active_form + "'];")
                        eval(meCode)


                        let argsCode =""
                        let listOfArgs = []
                        if (isValidObject(eventMessage.args)) {
                            listOfArgs = Object.keys(eventMessage.args)
                            for (let rtt=0;rtt<listOfArgs.length;rtt++) {
                                argsCode += "var " + listOfArgs[rtt] + " = " + JSON.stringify(eventMessage.args[listOfArgs[rtt]]) +";"
                            }
                        }
                        eval(argsCode)


//debugger
                        let debugFcc = getDebugCode(mm.active_form +"_"+eventMessage.control_name+"_"+eventMessage.sub_type,fcc,{skipFirstAndLastLine: true})
                        let efcc = eval(cacc + "" + debugFcc)


                        try {
                            await efcc()
                        } catch(  err  ) {

                            let errValue = ""
                            if (err.message) {
                                errValue = err.message
                            } else {
                                errValue = err
                            }
                            alert(  "Error in " + eventMessage.form_name + ":" + eventMessage.control_name + ":" + eventMessage.sub_type + ":" + "\n" +
                                    "    " + JSON.stringify(errValue,null,2))
                        }

                    }

                    //
                    // form events
                    //
                    } else if (eventMessage.type == "form_event") {
                        let fcc =
`(async function(){
${eventMessage.code}
})`
                        let meCode =""
                        meCode += ( "var me = mm.model.forms['" + this.active_form + "'];")
                        eval(meCode)

                        let appCode =""
                        appCode += ( "var app = mm.model;")
                        eval(appCode)

                        let debugFcc = getDebugCode(this.active_form ,fcc,{skipFirstAndLastLine: true})
                        let efcc = eval(debugFcc)

                        try {
                            await efcc()
                        } catch(  err  ) {

                            let errValue = ""
                            if (err.message) {
                                errValue = err.message
                            } else {
                                errValue = err
                            }
                            alert(  "Error in " +eventMessage.form_name + ":" + eventMessage.sub_type + "\n" +
                                    "    Error: " + JSON.stringify(errValue,null,2))
                        }
                    }





                     mm.refresh ++
                     mm.$forceUpdate();
                }

              },
            allowDropEditor:                        function        (ev) {
             /*
             ________________________________________
             |                                      |
             |                   |
             |                                      |
             |______________________________________|

             TO BE FILLED IN

             __________
             | Params |
             |        |______________________________________________________________
             |
             |     NONE
             |________________________________________________________________________ */
             ev.preventDefault();
         },
            dropEditor:                             async function  (ev) {
              /*
              ________________________________________
              |                                      |
              |                   |
              |                                      |
              |______________________________________|

              TO BE FILLED IN

              __________
              | Params |
              |        |______________________________________________________________
              |
              |     NONE
              |________________________________________________________________________ */
              ev.preventDefault();
              let mm = this

              let data2 = ev.dataTransfer.getData("message");
              let data = eval("(" + data2 + ")")

              let doc = document.documentElement;
              let left = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0) ;
              let top = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);

              if (data.type == "resize_form_bottom_right") {
                let rrr = document.getElementById(this.vb_grid_element_id).getBoundingClientRect()

                let newWidth = (ev.clientX - 8)  - rrr.left ;
                let newHeight = (ev.clientY - 8) - rrr.top ;

                this.model.forms[this.active_form].width = Math.floor(newWidth)
                this.model.forms[this.active_form].height = Math.floor(newHeight)

                this.active_component_index = null
                mm.refresh ++

              } else if (data.type == "resize_form_right") {
                let rrr = document.getElementById(this.vb_grid_element_id).getBoundingClientRect()

                let newWidth = (ev.clientX - 8)  - rrr.left ;

                this.model.forms[this.active_form].width = Math.floor(newWidth)

                this.active_component_index = null
                mm.refresh ++

            } else if (data.type == "resize_form_bottom") {
                  let rrr = document.getElementById(this.vb_grid_element_id).getBoundingClientRect()

                  let newHeight = (ev.clientY - 8) - rrr.top ;

                  this.model.forms[this.active_form].height = Math.floor(newHeight)

                  this.active_component_index = null
                  mm.refresh ++
                }
          },
            setInfo:                                function        (text) {
              /*
              ________________________________________
              |                                      |
              |                   |
              |                                      |
              |______________________________________|

              TO BE FILLED IN

              __________
              | Params |
              |        |______________________________________________________________
              |
              |     NONE
              |________________________________________________________________________ */
              this.$root.$emit('message', {
                  type:   "set_info_text",
                  text:    text
              })
          },
            allowDrop:                              function        (ev) {
             /*
             ________________________________________
             |                                      |
             |                   |
             |                                      |
             |______________________________________|

             TO BE FILLED IN

             __________
             | Params |
             |        |______________________________________________________________
             |
             |     NONE
             |________________________________________________________________________ */
             //ev.preventDefault();
         },
            drag:                                   function        (ev,message) {
             /*
             ________________________________________
             |                                      |
             |                   |
             |                                      |
             |______________________________________|

             TO BE FILLED IN

             __________
             | Params |
             |        |______________________________________________________________
             |
             |     NONE
             |________________________________________________________________________ */
             let mm = this
             let doc = document.documentElement;
             let left = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
             let top = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);
             let rrr = ev.target.getBoundingClientRect()
             message.offsetX = (ev.clientX - rrr.left )
             message.offsetY = (ev.clientY - rrr.top )

             if (!isValidObject(ev.dataTransfer)) {
                return
             }
             ev.dataTransfer.setData("message",
                                     JSON.stringify(message,null,2));

         },
            switchEditor:                           async function  (editorComponentName) {
             /*
             ________________________________________
             |                                      |
             |                   |
             |                                      |
             |______________________________________|

             TO BE FILLED IN

             __________
             | Params |
             |        |______________________________________________________________
             |
             |     NONE
             |________________________________________________________________________ */
             let mm = this
             //form_runtime_info[active_form].component_incoming_count_by_uuid[model.forms[active_form].components[active_component_index].base_component_id
             //debugger
             mm.$root.$emit(
                 'message', {
                     type:          "switch_editor",
                     editorName:     editorComponentName,
                     previewType:   "control"
                 })
         },
            showComponentDetailedDesignUi:          async function  (index) {
            /*
            ________________________________________
            |                                      |
            |                   |
            |                                      |
            |______________________________________|

            TO BE FILLED IN

            __________
            | Params |
            |        |______________________________________________________________
            |
            |     NONE
            |________________________________________________________________________ */
           let mm = this
           mm.design_mode_pane.type = "control_details_editor"

           this.active_component_detail_index = index;
           this.active_component_detail_name = this.model.forms[this.active_form].components[index].name;

           setTimeout(function() {
               //mm.refresh ++
               mm.$forceUpdate();
           },400)
        },
            showComponentDetailedDesignUiByName:    async function  (compName) {
            /*
            ________________________________________
            |                                      |
            |                   |
            |                                      |
            |______________________________________|

            TO BE FILLED IN

            __________
            | Params |
            |        |______________________________________________________________
            |
            |     NONE
            |________________________________________________________________________ */
            let mm = this
            let parentItemIndex = -1;
            let ccc = mm.model.forms[mm.active_form].components
            for (let ytr = 0;ytr < ccc.length;ytr++) {
               if (compName == ccc[ytr].name) {
                   parentItemIndex = ytr
                   break
               }
            }
            if (parentItemIndex != -1) {
                mm.showComponentDetailedDesignUi(parentItemIndex, true)
            }
            return null
        },
            clearLinkToProperties:                  async function  () {
            /*
            ________________________________________
            |                                      |
            |                   |
            |                                      |
            |______________________________________|

            TO BE FILLED IN

            __________
            | Params |
            |        |______________________________________________________________
            |
            |     NONE
            |________________________________________________________________________ */
            let mm = this
            this.selectedWatchToProperties = []
            this.fromLinkPropertySelected = false
            this.toLinkPropertySelected = false



            if (mm.design_mode_pane.links_type == "form") {

                let ccomp2 =  mm.model.forms[mm.active_form].components[mm.active_component_index]
                let activeComponenttype = ccomp2.base_component_id
                if (  GLOBALS.linkedProperties[  activeComponenttype  ]  ) {
                    if (  GLOBALS.linkedProperties[  activeComponenttype  ].incoming  ) {
                        if (  GLOBALS.linkedProperties[  activeComponenttype  ].incoming.me  ) {
                            let ccomkeys2 = Object.keys(GLOBALS.linkedProperties[  activeComponenttype  ].incoming.me )

                            for (let aaa =0; aaa<ccomkeys2.length;aaa++) {
                                this.selectedWatchToProperties.push(ccomkeys2[aaa])
                            }
                        }
                    }
                }

            } else {
                let ccomp2 =  mm.model.forms[mm.active_form].components[mm.active_component_index]
                let ccomkeys2 = Object.keys(ccomp2)
                for (let aaa =0; aaa<ccomkeys2.length;aaa++) {
                    this.selectedWatchToProperties.push(ccomkeys2[aaa])
                }


            }

        },
            showComponentLinks:                     async function  (index,diretionOfLinks) {
            /*
            ________________________________________
            |                                      |
            |                   |
            |                                      |
            |______________________________________|

            TO BE FILLED IN

            __________
            | Params |
            |        |______________________________________________________________
            |
            |     NONE
            |________________________________________________________________________ */
           let mm = this
           mm.design_mode_pane.type = "control_links_editor"
           mm.design_mode_pane.direction = diretionOfLinks
           mm.design_mode_pane.links_type = "form"
           mm.clearLinks();

           this.active_component_links_index = index;
           this.active_component_links_name = this.model.forms[this.active_form].components[index].name;

           mm.clearLinkToProperties()


            mm.selected_link_component_type = mm.model.forms[mm.active_form].components[mm.active_component_index].base_component_id
            await mm.recalcComponentLinks()
           //alert()

           setTimeout(function() {
               mm.refresh ++
               mm.$forceUpdate();
           },400)
        },
            recalcComponentLinks:                   async function  () {
            /*
            ________________________________________
            |                                      |
            |                   |
            |                                      |
            |______________________________________|

            TO BE FILLED IN

            __________
            | Params |
            |        |______________________________________________________________
            |
            |     NONE
            |________________________________________________________________________ */
            let mm = this
//debugger
            mm.incoming_link_objects = []

            let ccc = mm.model.forms[mm.active_form].components
            for (   let ytr = ccc.length - 1;    ytr >= 0;    ytr--   ) {
                let component = ccc[ytr]
                if (component) {
                    let foundComponentType = component.base_component_id
                    if (foundComponentType) {

                        if (GLOBALS.linkedProperties[mm.selected_link_component_type]) {
                            if (GLOBALS.linkedProperties[mm.selected_link_component_type].incoming) {
                                if (GLOBALS.linkedProperties[mm.selected_link_component_type].incoming.them) {
                                    let foundComponentIncomingTree = GLOBALS.linkedProperties[mm.selected_link_component_type].incoming.them[foundComponentType]
                                    if (foundComponentIncomingTree) {
                                        let incomingCount = Object.keys(foundComponentIncomingTree).length
                                        if (incomingCount > 0) {
                                            mm.incoming_link_objects.push(
                                                {name: component.name, type: foundComponentType, uuid: component.uuid}
                                            )
                                        }
                                    }
                                }
                            }
                        }
                    }

                }


            }


//debugger
            mm.outgoing_link_objects = []

            for (   let ytr = ccc.length - 1;    ytr >= 0;    ytr--   ) {
                let component = ccc[ytr]
                if (component) {
                    let foundComponentType = component.base_component_id
                    if (GLOBALS.linkedProperties[mm.selected_link_component_type]) {
                        if (GLOBALS.linkedProperties[mm.selected_link_component_type].outgoing) {
                            if (GLOBALS.linkedProperties[mm.selected_link_component_type].outgoing.them) {
                                let foundComponentIncomingTree = GLOBALS.linkedProperties[mm.selected_link_component_type].outgoing.them[foundComponentType]
                                if (foundComponentIncomingTree) {
                                    let outgoingCount = Object.keys(foundComponentIncomingTree).length
                                    if (outgoingCount > 0) {
                                        mm.outgoing_link_objects.push(
                                            {name: component.name, type: foundComponentType, uuid: component.uuid}
                                        )
                                    }
                                }
                            }
                        }
                    }
                }

            }





            mm.selectedPushFromProperties = []
            if (mm.design_mode_pane.links_type == "form") {
                if (mm.model.forms[mm.active_form].components[mm.active_component_links_index]) {
                    let typeSelected = mm.model.forms[mm.active_form].components[mm.active_component_links_index].base_component_id
                    if (GLOBALS.linkedProperties[typeSelected]) {
                        if (GLOBALS.linkedProperties[typeSelected].outgoing) {
                            if (GLOBALS.linkedProperties[typeSelected].outgoing.me) {
                                if (GLOBALS.linkedProperties[typeSelected].outgoing.me) {
                                    //debugger
                                    let ccomp2 =  GLOBALS.linkedProperties[typeSelected].outgoing.me
                                    let ccomkeys2 = Object.keys(ccomp2)
                                    for (let aaa =0; aaa<ccomkeys2.length;aaa++) {
                                        let typeExists = false

                                        let ccc = mm.model.forms[mm.active_form].components
                                        for (   let ytr =  0;    ytr < ccc.length;    ytr++   ) {
                                            let component = ccc[ytr]
                                            if (component) {
                                                if (GLOBALS.linkedProperties[typeSelected].outgoing.them[component.base_component_id]) {
                                                    typeExists = true
                                                    break;
                                                }
                                            }
                                        }

                                        if (typeExists) {
                                            mm.selectedPushFromProperties.push(ccomkeys2[aaa])
                                        }
                                    }

                                }
                            }

                        }

                    }
                }

            } else if (mm.design_mode_pane.links_type == "create_new_component") {
                if (mm.design_mode_pane.direction=="outgoing") {
                    if (this.model.forms[this.active_form].components[this.active_component_links_index]) {
                        let typeSelected = this.model.forms[this.active_form].components[this.active_component_links_index].base_component_id
                        if (GLOBALS.linkedProperties[typeSelected]) {
                            if (GLOBALS.linkedProperties[typeSelected].outgoing) {
                                if (GLOBALS.linkedProperties[typeSelected].outgoing.me) {
                                    if (GLOBALS.linkedProperties[typeSelected].outgoing.me) {
                                        let ccomp2 =  GLOBALS.linkedProperties[typeSelected].outgoing.me
                                        let ccomkeys2 = Object.keys(ccomp2)
                                        for (let aaa =0; aaa<ccomkeys2.length;aaa++) {
                                            mm.selectedPushFromProperties.push(ccomkeys2[aaa])
                                        }

                                    }
                                }

                            }

                        }
                    }

                } else if (mm.design_mode_pane.direction=="incoming") {
                    mm.selectedWatchToProperties = []
                    let typeSelected = this.model.forms[this.active_form].components[this.active_component_links_index].base_component_id
                    if (GLOBALS.linkedProperties[typeSelected]) {
                        if (GLOBALS.linkedProperties[typeSelected].incoming) {
                            if (GLOBALS.linkedProperties[typeSelected].incoming.me) {
                                let ccomp2 =  GLOBALS.linkedProperties[typeSelected].incoming.me
                                let ccomkeys2 = Object.keys(ccomp2)
                                for (let aaa =0; aaa<ccomkeys2.length;aaa++) {
                                    mm.selectedWatchToProperties.push(ccomkeys2[aaa])
                                }

                            }
                        }

                    }

                }



                //selectedWatchToProperties
            } else if (mm.design_mode_pane.links_type == "manual") {

                let ccomp2 =  mm.model.forms[mm.active_form].components[mm.active_component_index]
                let ccomkeys2 = Object.keys(ccomp2)
                for (let aaa =0; aaa<ccomkeys2.length;aaa++) {
                    mm.selectedPushFromProperties.push(ccomkeys2[aaa])
                }
            }



            mm.refresh++
        },
            deleteComponent:                        async function  (index) {
             /*
             ________________________________________
             |                                      |
             |                   |
             |                                      |
             |______________________________________|

             TO BE FILLED IN

             __________
             | Params |
             |        |______________________________________________________________
             |
             |     NONE
             |________________________________________________________________________ */
            let mm = this
            let thisComponentName = this.model.forms[this.active_form].components[index].name
            this.model.forms[this.active_form].components.splice(index, 1);
            let ccc = mm.model.forms[mm.active_form].components
            for (   let ytr = ccc.length - 1;    ytr >= 0;    ytr--   ) {
                let component = ccc[ytr]
                if (component.parent == thisComponentName) {
                    this.model.forms[this.active_form].components.splice(ytr, 1);
                }
            }

            this.refreshControlIndexes()
            this.selectForm(this.active_form)
            setTimeout(function() {
                mm.refresh ++
                mm.$forceUpdate();
            },400)
         },
            deleteComponentByName:                  async function  (thisComponentName) {
             /*
             ________________________________________
             |                                      |
             |         deleteComponentByName        |
             |                                      |
             |______________________________________|

             TO BE FILLED IN

             __________
             | Params |
             |        |______________________________________________________________
             |
             |     NONE
             |________________________________________________________________________ */
            let mm = this
            //debugger

            let promise = new Promise(async function(returnfn) {

                let ccc2 = mm.model.forms[mm.active_form].components
                for (   let ytr = ccc2.length - 1;    ytr >= 0;    ytr--   ) {
                    let component = ccc2[ytr]
                    if (component.name == thisComponentName) {
                        mm.model.forms[mm.active_form].components.splice(ytr, 1);
                        break;
                    }
                }
                let ccc = mm.model.forms[mm.active_form].components
                for (   let ytr = ccc.length - 1;    ytr >= 0;    ytr--   ) {
                    let component = ccc[ytr]
                    if (component.parent == thisComponentName) {
                        mm.model.forms[mm.active_form].components.splice(ytr, 1);
                    }
                }

                mm.refreshControlIndexes()
                mm.selectForm(mm.active_form)
                setTimeout(function() {
                    mm.refresh ++
                    mm.$forceUpdate();
                    returnfn({})
                },400)
            })
            let ret = await promise
            return ret
         },
            childDeleteComponent:                   function        (index) {
             /*
             ________________________________________
             |                                      |
             |                   |
             |                                      |
             |______________________________________|

             TO BE FILLED IN

             __________
             | Params |
             |        |______________________________________________________________
             |
             |     NONE
             |________________________________________________________________________ */
             this.$root.$emit('message', {
                                             type:             "delete_design_time_component",
                                             component_index:   index
                                         })

             },
            childSelectComponent:                   function        (index) {
             /*
             ________________________________________
             |                                      |
             |                   |
             |                                      |
             |______________________________________|

             TO BE FILLED IN

             __________
             | Params |
             |        |______________________________________________________________
             |
             |     NONE
             |________________________________________________________________________ */
             this.$root.$emit('message', {
                                             type:             "select_design_time_component",
                                             component_index:   index
                                         })


             },
            drop:                                   async function  (ev) {
             /*
             ________________________________________
             |                                      |
             |                   |
             |                                      |
             |______________________________________|

             TO BE FILLED IN

             __________
             | Params |
             |        |______________________________________________________________
             |
             |     NONE
             |________________________________________________________________________ */
         //
         // This is called when something happens on the main drag and drop
         // grid
         //
         //-------------------------------------------------------------------
             ev.preventDefault();
             let mm = this

             if (this.oldCursor) {
                    this.cursorSource.style.cursor = this.oldCursor
                    this.oldCursor = null
                    this.cursorSource = null
             }

             let data2 = ev.dataTransfer.getData("message");
             let data = eval("(" + data2 + ")")

             let newItem2 = new Object()
             let rrr2 = document.getElementById(this.vb_grid_element_id).getBoundingClientRect()
             newItem2.leftX = (ev.clientX  - rrr2.left)  - data.offsetX;
             newItem2.topY = (ev.clientY  - rrr2.top)   - data.offsetY;

             let parentType = null
             let parentName = null
             let parentOffsetX = 0
             let parentOffsetY = 0
             let parentOffsetWidth = 0
             let parentOffsetHeight = 0
             let parentContainer = this.getContainerForPoint(  newItem2.leftX,  newItem2.topY  )
             if (parentContainer) {
                 parentOffsetX = parentContainer.x
                 parentOffsetY = parentContainer.y
                 parentType      = parentContainer.base_component_id
                 parentName    = parentContainer.name
             }


             if (data.type == "add_component") {
                 let rrr = document.getElementById(this.vb_grid_element_id).getBoundingClientRect()
                 let xx = ((ev.clientX  - rrr.left)  - data.offsetX) - parentOffsetX  - 10;
                 let yy = ((ev.clientY  - rrr.top)   - data.offsetY) - parentOffsetY - 10;
                 //debugger
                 await mm.addComponentV2(xx,yy,data, parentType, parentName, [])
                 this.highlighted_control = null

             } else if (data.type == "move_component") {
                let rrr = document.getElementById(this.vb_grid_element_id).getBoundingClientRect()

                let newLeftX = (ev.clientX  - rrr.left) - data.offsetX;
                let newTopY = (ev.clientY  - rrr.top) - data.offsetY;

                if (!this.model.forms[this.active_form].components[data.index].is_container) {
                    if (parentType) {
                       this.model.forms[this.active_form].components[data.index].parent = parentName
                       newLeftX = newLeftX - parentOffsetX
                       newTopY = newTopY - parentOffsetY
                    } else {
                       this.model.forms[this.active_form].components[data.index].parent = null
                    }
                }

                if (newLeftX < 0) {
                    newLeftX = 0
                }
                if (newTopY < 0) {
                    newTopY = 0
                }
                if ((newLeftX + this.model.forms[this.active_form].components[data.index].width)
                        > this.model.forms[this.active_form].width) {
                    newLeftX = this.model.forms[this.active_form].width - this.model.forms[this.active_form].components[data.index].width
                }
                if ((newTopY + this.model.forms[this.active_form].components[data.index].height)
                        > this.model.forms[this.active_form].height) {
                    newTopY = this.model.forms[this.active_form].height - this.model.forms[this.active_form].components[data.index].height
                }

                this.model.forms[this.active_form].components[data.index].leftX = Math.floor(newLeftX)
                this.model.forms[this.active_form].components[data.index].topY = Math.floor(newTopY)
                this.active_component_index = data.index
                this.addCodeChange("Moved component: " + this.model.forms[this.active_form].components[data.index].name)


             } else if (data.type == "resize_top_left") {
                 let rrr = document.getElementById(this.vb_grid_element_id).getBoundingClientRect()
                 let oldX = this.model.forms[this.active_form].components[data.index].leftX
                 let oldY = this.model.forms[this.active_form].components[data.index].topY

                 let newLeftX = ev.clientX  + 2 - rrr.left ;
                 let newTopY = ev.clientY  + 2 - rrr.top ;

                 if (!this.model.forms[this.active_form].components[data.index].is_container) {
                     if (parentType) {
                        this.model.forms[this.active_form].components[data.index].parent = parentName
                        newLeftX = newLeftX - parentOffsetX
                        newTopY = newTopY - parentOffsetY
                     } else {
                        this.model.forms[this.active_form].components[data.index].parent = null
                     }
                 }

                 if (newLeftX < 0) {
                     newLeftX = 0
                 }
                 if (newTopY < 0) {
                     newTopY = 0
                 }

                 this.model.forms[this.active_form].components[data.index].leftX = Math.floor(newLeftX)
                 this.model.forms[this.active_form].components[data.index].topY = Math.floor(newTopY)
                 let diffX = this.model.forms[this.active_form].components[data.index].leftX - oldX
                 let diffY = this.model.forms[this.active_form].components[data.index].topY - oldY
                 this.model.forms[this.active_form].components[data.index].width -= Math.floor(diffX)
                 this.model.forms[this.active_form].components[data.index].height -= Math.floor(diffY)

                 this.active_component_index = data.index
                 this.addCodeChange("Resized component top left: " + this.model.forms[this.active_form].components[data.index].name)

             } else if (data.type == "resize_left") {
                 let rrr = document.getElementById(this.vb_grid_element_id).getBoundingClientRect()
                 let oldX = this.model.forms[this.active_form].components[data.index].leftX

                 let newLeftX = ev.clientX  + 2 - rrr.left ;


                 if (!this.model.forms[this.active_form].components[data.index].is_container) {
                     if (parentType) {
                        this.model.forms[this.active_form].components[data.index].parent = parentName
                        newLeftX = newLeftX - parentOffsetX
                        newTopY = newTopY - parentOffsetY
                     } else {
                        this.model.forms[this.active_form].components[data.index].parent = null
                     }
                 }

                 if (newLeftX < 0) {
                     newLeftX = 0
                 }

                 this.model.forms[this.active_form].components[data.index].leftX = Math.floor(newLeftX)
                 let diffX = this.model.forms[this.active_form].components[data.index].leftX - oldX
                 this.model.forms[this.active_form].components[data.index].width -= Math.floor(diffX)

                 this.active_component_index = data.index




             } else if (data.type == "resize_top") {
                 let rrr = document.getElementById(this.vb_grid_element_id).getBoundingClientRect()
                 let oldY = this.model.forms[this.active_form].components[data.index].topY

                 let newTopY = ev.clientY  + 2 - rrr.top ;

                 if (!this.model.forms[this.active_form].components[data.index].is_container) {
                     if (parentType) {
                        this.model.forms[this.active_form].components[data.index].parent = parentName
                        newLeftX = newLeftX - parentOffsetX
                        newTopY = newTopY - parentOffsetY
                     } else {
                        this.model.forms[this.active_form].components[data.index].parent = null
                     }
                 }

                 if (newTopY < 0) {
                     newTopY = 0
                 }

                 this.model.forms[this.active_form].components[data.index].topY = Math.floor(newTopY)
                 let diffY = this.model.forms[this.active_form].components[data.index].topY - oldY
                 this.model.forms[this.active_form].components[data.index].height -= Math.floor(diffY)

                 this.active_component_index = data.index



             } else if (data.type == "resize_top_right") {
                 let rrr = document.getElementById(this.vb_grid_element_id).getBoundingClientRect()
                 let newX = ev.clientX  - 10 - rrr.left ;
                 let newY = ev.clientY + 2 - rrr.top;

                 if (!this.model.forms[this.active_form].components[data.index].is_container) {
                     if (parentType) {
                        this.model.forms[this.active_form].components[data.index].parent = parentName
                        newX = newX - parentOffsetX
                        newY = newY - parentOffsetY
                     } else {
                        this.model.forms[this.active_form].components[data.index].parent = null
                     }
                 }

                 this.model.forms[this.active_form].components[data.index].width =
                    Math.floor(newX - this.model.forms[this.active_form].components[data.index].leftX)

                 let newHeight = (this.model.forms[this.active_form].components[data.index].topY +
                                    this.model.forms[this.active_form].components[data.index].height) - newY
                 this.model.forms[this.active_form].components[data.index].topY = Math.floor(newY)
                 this.model.forms[this.active_form].components[data.index].height = Math.floor(newHeight)


                 this.active_component_index = data.index

             } else if (data.type == "resize_bottom_left") {
                 let rrr = document.getElementById(this.vb_grid_element_id).getBoundingClientRect()
                 let newX = ev.clientX + 8 - rrr.left ;
                 let newY = ev.clientY - 12 - rrr.top ;

                 if (!this.model.forms[this.active_form].components[data.index].is_container) {
                     if (parentType) {
                        this.model.forms[this.active_form].components[data.index].parent = parentName
                        newX = newX - parentOffsetX
                        newY = newY - parentOffsetY
                     } else {
                        this.model.forms[this.active_form].components[data.index].parent = null
                     }
                 }
                 let newWidth = (this.model.forms[this.active_form].components[data.index].leftX + this.model.forms[this.active_form].components[data.index].width) - newX
                 let newHeight = newY - this.model.forms[this.active_form].components[data.index].topY

                 this.model.forms[this.active_form].components[data.index].leftX = Math.floor(newX)
                 this.model.forms[this.active_form].components[data.index].width = Math.floor(newWidth)
                 this.model.forms[this.active_form].components[data.index].height = Math.floor(newHeight)

                 this.active_component_index = data.index

             } else if (data.type == "resize_right") {

                 let rrr = document.getElementById(this.vb_grid_element_id).getBoundingClientRect()
                 let newX = ev.clientX  - rrr.left - 10;

                 if (!this.model.forms[this.active_form].components[data.index].is_container) {
                     if (parentType) {
                        this.model.forms[this.active_form].components[data.index].parent = parentName
                        newX = newX - parentOffsetX
                     } else {
                        this.model.forms[this.active_form].components[data.index].parent = null
                     }
                 }

                 let newWidth = newX - this.model.forms[this.active_form].components[data.index].leftX
                 this.model.forms[this.active_form].components[data.index].width = Math.floor(newWidth)

                 this.active_component_index = data.index



             } else if (data.type == "resize_bottom_right") {

                 let rrr = document.getElementById(this.vb_grid_element_id).getBoundingClientRect()
                 let newX = ev.clientX  - rrr.left - 10;
                 let newY = ev.clientY - rrr.top - 12;

                 if (!this.model.forms[this.active_form].components[data.index].is_container) {
                     if (parentType) {
                        this.model.forms[this.active_form].components[data.index].parent = parentName
                        newX = newX - parentOffsetX
                        newY = newY - parentOffsetY
                     } else {
                        this.model.forms[this.active_form].components[data.index].parent = null
                     }
                 }

                 let newWidth = newX - this.model.forms[this.active_form].components[data.index].leftX
                 this.model.forms[this.active_form].components[data.index].width = Math.floor(newWidth)

                 let newHeight = newY - this.model.forms[this.active_form].components[data.index].topY
                 this.model.forms[this.active_form].components[data.index].height = Math.floor(newHeight)

                 this.active_component_index = data.index

             } else if (data.type == "resize_bottom") {

                 let rrr = document.getElementById(this.vb_grid_element_id).getBoundingClientRect()
                 let newY = ev.clientY - rrr.top - 12;

                 if (!this.model.forms[this.active_form].components[data.index].is_container) {
                     if (parentType) {
                        this.model.forms[this.active_form].components[data.index].parent = parentName
                        newY = newY - parentOffsetY
                     } else {
                        this.model.forms[this.active_form].components[data.index].parent = null
                     }
                 }

                 let newHeight = newY - this.model.forms[this.active_form].components[data.index].topY
                 this.model.forms[this.active_form].components[data.index].height = Math.floor(newHeight)

                 this.active_component_index = data.index
             }


             this.selectComponent(this.active_component_index)
             this.updateAllFormCaches()
             this.refresh ++


         },
            get_default_app_propeties:              function        () {
             /*
             ________________________________________
             |                                      |
             |                   |
             |                                      |
             |______________________________________|

             TO BE FILLED IN

             __________
             | Params |
             |        |______________________________________________________________
             |
             |     NONE
             |________________________________________________________________________ */
            let mm = this
            return [
                {   id:     "id",   name:   "ID",   type:   "String" , readonly: true,
                     get_fn: function() {
                        return mm.edited_app_component_id }
                 }
                 ,

                 {   id:     "default_form",       name:   "Load form on startup",   type:   "String"}
                 ,

                 {   id:     "app_started_event",  name:   "Called when the app is started",   type:   "Event"}

            ]
         },
            getAllAppPropeties:                     function        () {
             /*
             ________________________________________
             |                                      |
             |                   |
             |                                      |
             |______________________________________|

             TO BE FILLED IN

             __________
             | Params |
             |        |______________________________________________________________
             |
             |     NONE
             |________________________________________________________________________ */
            let mm = this
            let properties                     = mm.get_default_app_propeties()

            if (this.model.app_properties) {
                properties = properties.concat(this.model.app_properties)
            }
            return properties
         },
            select_app:                             function        () {
             //-------------------------------------------------------------------
             //                             select_app
             //
             //
             //-------------------------------------------------------------------
             /*
             ________________________________________
             |                                      |
             |                   |
             |                                      |
             |______________________________________|

             TO BE FILLED IN

             __________
             | Params |
             |        |______________________________________________________________
             |
             |     NONE
             |________________________________________________________________________ */
            let mm = this

            this.active_component_index         = null
            this.model.app_selected             = true
            this.active_property_index          = null

            this.properties                     = mm.getAllAppPropeties()

            this.updatePropertySelector()

            this.refresh ++
         },
            myDataRenderFunction:                   function        (data) {
             //-------------------------------------------------------------------
             //                        myDataRenderFunction
             //
             //
             //-------------------------------------------------------------------
             /*
             ________________________________________
             |                                      |
             |                   |
             |                                      |
             |______________________________________|

             TO BE FILLED IN

             __________
             | Params |
             |        |______________________________________________________________
             |
             |     NONE
             |________________________________________________________________________ */
             if (!isValidObject(data)) {
                 return "<div></div>"
             }

             let center = ""
             if (data.app) {
                center = "<b style='font-family:verdana,helvetica;font-size: 13px;'>" + (data.app?data.app:data.form) + "</b> "

             } else if (data.component) {
                 center = "<b style='font-family:verdana,helvetica;font-size: 13px;'>" + data.component + "</b> " + data.component_scope
             } else if (data.form) {
                 center = "<b style='font-family:verdana,helvetica;font-size: 13px;'>" + data.form + "</b> "
             }

             let template =
               "<div  style='font-weight:normal;color:black;overflow:hidden ;text-overflow: ellipsis;border-radius: 1px;margin: 0px;padding:0px;border:0px;font-family:verdana,helvetica;font-size: 13px;'>" +
                    center +
               "</div>";
             return template;
         },
            actionRenderFunction:                   function        (data) {
             /*
             ________________________________________
             |                                      |
             |                   |
             |                                      |
             |______________________________________|

             TO BE FILLED IN

             __________
             | Params |
             |        |______________________________________________________________
             |
             |     NONE
             |________________________________________________________________________ */
            if (!isValidObject(data)) {
                return "<div></div>"
            }

             let center = ""

             center = "<b style='font-family:verdana,helvetica;font-size: 13px;'>" + data.action_id + "</b> " + data.action_name

             let template =
               "<div  style='font-weight:normal;color:black;overflow:hidden ;text-overflow: ellipsis;border-radius: 1px;margin: 0px;padding:0px;border:0px;font-family:verdana,helvetica;font-size: 13px;'>" +
                    center +
               "</div>";
             return template;
         },
            updatePropertySelector:                 function        () {
            // -------------------------------------------------------------------
            //                          updatePropertySelector
            //
            // This updates the property selector on the right of the editor,
            // and it uses the currently selected object to figure out what
            // to display
            // -------------------------------------------------------------------
            /*
            ________________________________________
            |                                      |
            |                   |
            |                                      |
            |______________________________________|

            TO BE FILLED IN

            __________
            | Params |
            |        |______________________________________________________________
            |
            |     NONE
            |________________________________________________________________________ */

            let mm = this

            //
            // if we are not in edit mode then do nothing
            //

            if (!designMode){
                return
            }


            //
            // If the property selector is not available then do nothing
            //

            if (!document.getElementById("property_selector_parent")) {
                return
            }




            //
            // Set up the property selector
            //

            document.getElementById("property_selector_parent").innerHTML=' <select id=property_selector ></select>'

            let sdata           = []
            let indexProp       = 0
            let selectedItem    = null

            if (mm.model.app_selected || (!isValidObject(mm.active_component_index))) {

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

                let forms = mm.getForms()
                for (  let ere6 = 0; ere6 < forms.length; ere6++  ) {
                    let form = forms[ ere6 ]
                    sdata.push(
                        {
                            value:      "" + indexProp,
                            app:        null,
                            form:       form.name,
                            component:  null
                        }
                    )
                    if ((!mm.model.app_selected) && (form.name == mm.active_form)) {
                        selectedItem = indexProp
                    }
                    indexProp++
                }

            } else if (isValidObject(mm.active_component_index)) {

                sdata.push(
                    {
                        value:      "" + indexProp,
                        app:        null,
                        form:       mm.active_form,
                        component:  null
                    }
                )
                indexProp++

                let components = mm.getActiveFormComponents()
                for (  let ere5 = 0; ere5 < components.length; ere5++  ) {
                    let component = components[ ere5 ]
                    sdata.push(
                        {
                            value:              "" + indexProp,
                            app:                null,
                            form:               mm.active_form,
                            component:          component.name,
                            component_scope:     component.base_component_id,

                            component_index:    ere5
                        }
                    )
                    if (mm.active_component_index == ere5) {
                        selectedItem = indexProp
                    }
                    indexProp++
                }
            }

            //
            //   selector for property inspector
            //
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
                let dd = sdata[option.idx]
                if (dd.component) {
                    mm.selectComponent(dd.component_index)
                } else if (dd.form) {
                    mm.selectForm(dd.form)
                } else if (dd.app) {
                    mm.select_app()
                }
            });


         },
            existsProp:                             function        (compEvaled,propName) {
             /*
             ________________________________________
             |                                      |
             |                   |
             |                                      |
             |______________________________________|

             TO BE FILLED IN

             __________
             | Params |
             |        |______________________________________________________________
             |
             |     NONE
             |________________________________________________________________________ */
            for (let eee = 0 ;eee < compEvaled.length; eee++) {
                if (compEvaled[eee].id == propName) {
                    return true
                }
            }
            return false
         },
            getControlProperties:                   function        (base_component_id) {
             /*
             ________________________________________
             |                                      |
             |                   |
             |                                      |
             |______________________________________|

             TO BE FILLED IN

             __________
             | Params |
             |        |______________________________________________________________
             |
             |     NONE
             |________________________________________________________________________ */
             let properties = []
             let compEvaled = this.getComponentProperties(base_component_id)

             properties.push({   id:     "name",   name:   "Name",   type:   "String"    })
             properties.push({   id:     "base_component_id",   name:   "Type",   type:   "String" , readonly: true   })
             properties.push({   id:     "code_id",             name:   "Type IPFS",   type:   "String" , readonly: true   })

             properties.push({   id:     "leftX",   name:   "X",   type:   "Number"    })
             properties.push({   id:     "topY",   name:   "Y",   type:   "Number"    })
             if (!this.existsProp(compEvaled,"width")) {
                 properties.push({   id:     "width",   name:   "Width",   type:   "Number"    })
             }
             if (!this.existsProp(compEvaled,"height")) {
                 properties.push({   id:     "height",   name:   "Height",   type:   "Number"    })
             }
             if (!this.existsProp(compEvaled,"load")) {
                 properties.push({   id:     "load",   name:   "Load Event",   type:   "Event"    })
             }




             properties = properties.concat(compEvaled)


             if (!this.existsProp(compEvaled,"on_property_in")) {
                 properties.push({   id:     "on_property_in",
                                     name:   "On Property In",
                                     type:   "Event",
                                     help:
`
<pre>
Vars to use:
    from_form
    from_name
    from_property
    to_form
    to_name
    to_property
    before_value
    after_value
</pre>
`
                                 })
             }





             if (!this.existsProp(compEvaled,"on_property_out")) {
                 properties.push({   id:     "on_property_out",
                                     name:   "On Property Out",
                                     type:   "Event",
                                     help:
`
<pre>
Vars to use:
    from_form
    from_name
    from_property
    to_form
    to_name
    to_property
    before_value
    after_value
</pre>
`
                                 })
             }











              if (!this.existsProp(compEvaled,"on_property_changed")) {
                  properties.push({   id:     "on_property_changed",
                                      name:   "On Property Changed",
                                      type:   "Event",
                                      help:
             `
<pre>
Vars to use:
   form
   name
   property
   value
   before_value
   after_value
</pre>
             `
                                              })
                          }








            properties.push({   id:     "clone",   name:   "Clone",   type:   "Action"  ,
                                pre_snippet: `await `,
                                hidden:       true,
                                snippet:     `clone("new_name")`,
                                fn:
`
let newObject = JSON.parse(JSON.stringify(me))
newObject.name = arg1
return newObject
`
            })

            if (this.existsProp(compEvaled,"is_container")) {
                properties.push({   id:     "addChild",   name:   "Add Child",   type:   "Action"  ,
                                    pre_snippet: `await `,
                                    hidden:       true,
                                    snippet:     `addChild({})`,
                                    fn:
`mm.addControl(  arg1  )
return {}
`
                })
            }




            properties.push({   id:     "delete",   name:   "Delete",   type:   "Action"  ,
                                pre_snippet: `await `,
                                hidden:       true,
                                snippet:     `delete()`,
                                fn:
`mm.deleteComponentByName(  me.name  )
return {}
`
            })


             return properties
         },
            selectComponent:                        async function  (index, showProps) {
             /*
             ________________________________________
             |                                      |
             |                   |
             |                                      |
             |______________________________________|

             TO BE FILLED IN

             __________
             | Params |
             |        |______________________________________________________________
             |
             |     NONE
             |________________________________________________________________________ */
            if (!this.design_mode) {
                return
            }
            let mm = this

            if (index == null) {
                return
            }
            this.active_property_index = null
            this.model.app_selected = false
            this.active_component_index = index
            this.properties = this.getControlProperties(this.model.forms[this.active_form].components[index].base_component_id)

            this.updatePropertySelector()
            if (isValidObject(showProps) && showProps) {
                this.selected_pane = "properties";
                this.chooseRight("properties");
            }
            this.refresh ++
         },
            addForm:                                function        () {
             /*
             ________________________________________
             |                                      |
             |                   |
             |                                      |
             |______________________________________|

             TO BE FILLED IN

             __________
             | Params |
             |        |______________________________________________________________
             |
             |     NONE
             |________________________________________________________________________ */
            let mm = this
            mm.active_component_index = null
            mm.properties = mm.getFormProperties()

            mm.model.max_form ++
            let newFormName = "form_" + mm.model.max_form
            mm.model.forms[newFormName] = {
                name: newFormName,
                components: [],
                width: 300,
                height: 300,
                add_control: "alert('Add control called')"
            }

            mm.active_form = newFormName
            mm.refresh ++
         },
            moveUp:                                 function        (   fieldId   ) {
            /*
            ________________________________________
            |                                      |
            |                   |
            |                                      |
            |______________________________________|

            TO BE FILLED IN

            __________
            | Params |
            |        |______________________________________________________________
            |
            |     NONE
            |________________________________________________________________________ */
            let mm = this
            let itemD = null
            for (let tt=0; tt < mm.model.forms[mm.active_form].fields.length ; tt++) {
                let ciurr = mm.model.forms[mm.active_form].fields[tt]
                if (ciurr.id == fieldId) {
                    itemD = ciurr
                }
            }
            if (itemD) {
                let index = mm.model.forms[mm.active_form].fields.indexOf(  itemD  );
                if (index > -1) {
                  mm.model.fields.splice(index, 1);
                  mm.model.fields.splice(index - 1, 0, itemD);
                }

            }
        },
            moveDown:                               function        (   fieldId   ) {
            /*
            ________________________________________
            |                                      |
            |                   |
            |                                      |
            |______________________________________|

            TO BE FILLED IN

            __________
            | Params |
            |        |______________________________________________________________
            |
            |     NONE
            |________________________________________________________________________ */
            let mm = this
            let itemD = null
            for (let tt=0; tt < mm.model.forms[mm.active_form].fields.length ; tt++) {
                let ciurr = mm.model.forms[mm.active_form].fields[tt]
                if (ciurr.id == fieldId) {
                    itemD = ciurr
                }
            }
            if (itemD) {
                let index = mm.model.forms[mm.active_form].fields.indexOf(  itemD  );
                if (index > -1) {
                  mm.model.fields.splice(index, 1);
                  mm.model.fields.splice(index + 1, 0, itemD);
                }

            }
        },
            deleteField:                            function        (   fieldId   ) {
            /*
            ________________________________________
            |                                      |
            |                   |
            |                                      |
            |______________________________________|

            TO BE FILLED IN

            __________
            | Params |
            |        |______________________________________________________________
            |
            |     NONE
            |________________________________________________________________________ */
            let mm = this
            let itemD = null
            for (let tt=0; tt < mm.model.forms[mm.active_form].fields.length ; tt++) {
                let ciurr = mm.model.forms[mm.active_form].fields[tt]
                if (ciurr.id == fieldId) {
                    itemD = ciurr
                }
            }
            if (itemD) {
                let index = mm.model.forms[mm.active_form].fields.indexOf(  itemD  );
                if (index > -1) {
                  mm.model.fields.splice(index, 1);
                }
            }
        },
            savedStatus:                            async function  (args) {
             /*
             ________________________________________
             |                                      |
             |                   |
             |                                      |
             |______________________________________|

             TO BE FILLED IN

             __________
             | Params |
             |        |______________________________________________________________
             |
             |     NONE
             |________________________________________________________________________ */
         //debugger
             //-------------------------------------------------------------------
             //-------------------------------------------------------------------
             if (args && (args.status == "ok")) {
                 this.code_changes = []
             }
         },
            getText:                                async function  () {
            /*
            ________________________________________
            |                                      |
            |                   |
            |                                      |
            |______________________________________|

            TO BE FILLED IN

            __________
            | Params |
            |        |______________________________________________________________
            |
            |     NONE
            |________________________________________________________________________ */

            //console.log("2) VB: getText")
            await this.generateCodeFromModel()
            //debugger
            return this.text
        },
            lockEditor:                             function        () {
            /*
            ________________________________________
            |                                      |
            |                   |
            |                                      |
            |______________________________________|

            TO BE FILLED IN

            __________
            | Params |
            |        |______________________________________________________________
            |
            |     NONE
            |________________________________________________________________________ */
             let mm = this
             mm.editor_locked = true
             mm.refresh ++
        },
            unlockEditor:                           function        () {
             /*
             ________________________________________
             |                                      |
             |                   |
             |                                      |
             |______________________________________|

             TO BE FILLED IN

             __________
             | Params |
             |        |______________________________________________________________
             |
             |     NONE
             |________________________________________________________________________ */
             let mm = this
             mm.editor_locked = false
             mm.refresh ++
         },
            setText:                                function        (textValue) {
            /*
            ________________________________________
            |                                      |
            |                   |
            |                                      |
            |______________________________________|

            TO BE FILLED IN

            __________
            | Params |
            |        |______________________________________________________________
            |
            |     NONE
            |________________________________________________________________________ */
        //debugger
            //console.log("start setText")
            let mm = this
            this.text =  textValue
            let json2 = this.getJsonModelFromCode(  textValue  )
            //console.log("setText: mm.model = json2")
            mm.edited_app_component_id = yz.getValueOfCodeString(textValue, "base_component_id")

            mm.old_model = JSON.parse(JSON.stringify(json2));
            mm.model = json2
            mm.updatePropertySelector()
            mm.updateAllFormCaches()
            mm.refresh ++
            //console.log("end setText")
        },
            getJsonModelFromCode:                   function        (  codeV  ) {
            /*
            ________________________________________
            |                                      |
            |                   |
            |                                      |
            |______________________________________|

            TO BE FILLED IN

            __________
            | Params |
            |        |______________________________________________________________
            |
            |     NONE
            |________________________________________________________________________ */
            let mm = this
            mm.edited_app_component_id = yz.getValueOfCodeString(codeV, "base_component_id")
            let json2 = yz.getValueOfCodeString(codeV,"formEditor",")//formEditor")
            return json2
        },
            generateCodeFromModel:                  async function  (  ) {
            /*      ________________________________________
                    |                                      |
                    |       generateCodeFromModel          |
                    |                                      |
                    |______________________________________|

                    Generates new code based on the "model"

                    __________
                    | Params |
                    |        |_________________________________________
                    |
                    |   NONE
                    |
                    |__________________________________________________ */
            let mm = this
            if (this.in_generate_code_from_model) {
                return
            }
            if (!this.design_mode) {
                return
            }
            this.in_generate_code_from_model = true
            if (GLOBALS.online && this.design_mode) {

            //console.log("start generateCodeFromModel")

            let startIndex = this.text.indexOf("//** gen_" + "start **//")
            let endIndex = this.text.indexOf("//** gen_" + "end **//")


            let sql =    "select  cast(code as text)  as  code  from  yz_cache_released_components  where " +
                         "        base_component_id = 'vb_editor_component'"

            let results = await callComponent({ base_component_id:    "readFromInternalSqliteDatabase"},
                {   sql: sql  })

            let editorCode = results[0].code
            let stt = "//*** COPY_" + "START ***//"
            let editorCodeToCopyStart = editorCode.indexOf(stt) + stt.length
            let editorCodeToCopyEnd = editorCode.indexOf("//*** COPY_" + "END ***//")
            let editorCodeToCopy = editorCode.substring(editorCodeToCopyStart, editorCodeToCopyEnd)




            //this.text = this.text.substring(0,startIndex) +
              let   thistext = this.text.substring(0,startIndex) +

                `//** gen_start **//
                let texti = null
                let designMode = false
                let runtimeMode = true
                Vue.component('${this.edited_app_component_id}', {`

                + editorCodeToCopy +

                `,
                data: function () {
                  return {
                      code_changes:                [],
                      unique_app_dom_element_id:                        null,
                      editor_locked:               true,
                      vb_grid_element_id:          null,
                      vb_editor_element_id:        null,
                      debug_component:             null,
                      design_mode: designMode,
                      design_mode_pane:            {},
                      show_advanced_transform:      false,
                      local_app:                    false,
                      refresh: 0,
                      runtime_mode: runtimeMode,
                      components_used_in_this_app:             new Object(),
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





              let subComponents = yz.getValueOfCodeString(this.text, "sub_components")
              let subComponentsMap = {}


              if (subComponents) {
                  this.text = yz.deleteCodeString(this.text, "sub_components")
              } else {
                  subComponents = []
              }

              for (let tt = 0; tt < subComponents.length ; tt++) {
                  let subComponentName = subComponents[tt]
                  subComponentsMap[subComponentName] = {}
              }
              let forms = mm.getForms()


              for (  let formIndex = 0;  formIndex < forms.length;  formIndex ++  ) {
                   let formName = forms[formIndex].name

                   for (  let compenentInFormIndex = 0;  compenentInFormIndex < mm.model.forms[formName].components.length;  compenentInFormIndex ++  ) {
                       let newItem = mm.model.forms[formName].components[compenentInFormIndex]
                       if (newItem && newItem.base_component_id) {
                           if (!subComponentsMap[newItem.base_component_id]) {
                              subComponentsMap[newItem.base_component_id] = {}
                           }
                       }
                   }
              }
              let newListOfSubcomponents = Object.keys(  subComponentsMap  )
              this.text = yz.insertCodeString(this.text, "sub_components", newListOfSubcomponents)


              this.text = yz.deleteCodeString(  this.text, "component_type")

              this.text = yz.insertCodeString(  this.text,
                                                          "component_type",
                                                          "APP")

              this.text = yz.deleteCodeString(  this.text, "formEditor", ")//form" + "Editor")

              this.text = yz.insertCodeString(  this.text,
                                                        "formEditor",
                                                        mm.model,
                                                        ")//form" + "Editor")


               this.text = yz.deleteCodeString(  this.text, "properties", ")//prope" + "rties")

               this.text = yz.insertCodeString(  this.text,
                                                          "properties",
                                                          mm.model.app_properties,
                                                          ")//prope" + "rties")


                let codeChanges = yz.getValueOfCodeString(this.text,"code_changes",")//code_" + "changes")
                if (codeChanges) {
                    this.text = yz.deleteCodeString(  this.text, "code_changes", ")//code_" + "changes")
                }
                if (!this.code_changes) {
                    this.code_changes = []
                }
                this.text = yz.insertCodeString(  this.text,
                    "code_changes",
                    this.code_changes,
                    ")//code_" + "changes")



            //console.log("end generateCodeFromModel.Done")
            this.in_generate_code_from_model = false
            return
            }
        },
            openFile:                               async function  () {
            /*      ________________________________________
                    |                                      |
                    |               openFile               |
                    |                                      |
                    |______________________________________|

                    Opens a file from the file system

                    __________
                    | Params |
                    |        |_________________________________________
                    |
                    |     NONE
                    |
                    |__________________________________________________ */
            //alert(1)
           //document.getElementById("openfilefromhomepage").click();
           this.showFilePicker = true
           let result = await callComponent(
                               {
                                   base_component_id: "serverGetHomeDir"}
                                   ,{ })
          if (result) {
              this.open_file_path = result.value
          }
          let result2 = await callComponent(
                              {
                                  base_component_id: "serverFolderContents"}
                                  ,{
                                          path: this.open_file_path
                                  })
         if (result2) {
             this.open_file_list = result2
         }

          //
       },
            selectOpenFileOrFolder:                 async function  (fileorFolder, fileExts) {
           /*
           ________________________________________
           |                                      |
           |                   |
           |                                      |
           |______________________________________|

           TO BE FILLED IN

           __________
           | Params |
           |        |______________________________________________________________
           |
           |     NONE
           |________________________________________________________________________ */
          //
          // if this is a folder
          //
          if (fileorFolder.type == "folder") {
              if (isWin) {
                  this.open_file_path += "\\" + fileorFolder.name
              } else {
                  this.open_file_path += "/" + fileorFolder.name
              }
              //alert(JSON.stringify(fileExts,null,2))
             let result2 = await callComponent(
                                 {
                                     base_component_id: "serverFolderContentsV2"}
                                     ,{
                                             path:                      this.open_file_path,
                                             filter_file_exts_list:     fileExts
                                     })
            if (result2) {
                this.open_file_list = result2
            }


        //
        // otherwise if this is a file
        //
        } else {
            let mm=this
            this.showFilePicker=false
            this.open_file_name = this.open_file_path + "/" + fileorFolder.name

            let propertyType = null
            for (  let ere = 0;  ere < mm.properties.length;  ere++  ) {
                let property = mm.properties[ ere ]
                if (property.id == mm.design_mode_pane.property_id) {
                    propertyType = property
                }
            }

            let fileNameToLoad = this.open_file_name
            mm.setVBEditorPropertyValue(propertyType,fileNameToLoad)
            mm.gotoDragDropEditor()
        }

         //
      },
            chosenFolderUp:                         async function  () {
          /*
          ________________________________________
          |                                      |
          |                   |
          |                                      |
          |______________________________________|

          TO BE FILLED IN

          __________
          | Params |
          |        |______________________________________________________________
          |
          |     NONE
          |________________________________________________________________________ */
          //alert(1)
         //document.getElementById("openfilefromhomepage").click();
         let lastFolderIndex = null
         //debugger

         if (isWin) {
             lastFolderIndex = this.open_file_path.lastIndexOf("\\")
             if (lastFolderIndex == (this.open_file_path.length - 1)) {
                 this.open_file_path = this.open_file_path.substring(0,this.open_file_path.length - 1)
                 lastFolderIndex = this.open_file_path.lastIndexOf("\\")
             }

             //
             // if we have gone all the way up to c: then we may not find a
             // final backslash (\) symbol
             //
             if (lastFolderIndex == -1) {
                 this.open_file_path = this.open_file_path.substring(0,2) + "\\"


             } else {
                 this.open_file_path = this.open_file_path.substring(0,lastFolderIndex) + "\\"
             }
         } else {
             lastFolderIndex = this.open_file_path.lastIndexOf("/")
             this.open_file_path = this.open_file_path.substring(0,lastFolderIndex)
         }


            let result2 = await callComponent(
                                {
                                    base_component_id: "serverFolderContents"}
                                    ,{
                                            path: this.open_file_path
                                    })
           if (result2) {
               this.open_file_list = result2
           }


     }
     }
        //*** COPY_END ***//
        ,
        /*
        ________________________________________
        |                                      |
        |                   |
        |                                      |
        |______________________________________|

        TO BE FILLED IN

        __________
        | Params |
        |        |______________________________________________________________
        |
        |     NONE
        |________________________________________________________________________ */
        data: function () {
       return {
           code_changes:  [],
           showFilePicker: false,
           editor_locked:               false,
           open_file_path: "/",
           open_file_list: [],
           open_file_name: "",
           file_exts: [],


           errors: null,
           inUpdateAllFormCaches:       false,
           newCursor:                   null,
           watchList:                   [],


           selectedWatchComponentUuid:      null,
           selectedWatchFromProperty:      null,
           selectedWatchTransformFn: null,
           selectedWatchToProperty:      null,
           selectedWatchFromProperties:      [],
           selectedWatchToProperties:      [],
           linkSideSelected:      "none",
           fromLinkPropertySelected:    false,
           toLinkPropertySelected: false,

           selected_link_component_type: null,
           incoming_link_objects: [],
           outgoing_link_objects: [],

           incoming_link_component_types: [],
           outgoing_link_component_types: [],
           selectedWatchComponentType:      null,

           selectedPushComponentType:      null,
           selectedPushComponentUuid:      null,
           selectedPushFromProperty:      null,
           selectedPushTransformFn: null,
           selectedPushToProperty:      null,
           selectedPushFromProperties:      [],
           selectedPushToProperties:      [],

           oldCursor:                   null,
           cursorSource:                null,
           unique_app_dom_element_id:                        null,
           vb_grid_element_id:          null,
           vb_editor_element_id:        null,
           debug_component:             null,
           in_generate_code_from_model: false,
           design_mode:                 designMode,
           runtime_mode:                runtimeMode,
           highlighted_control: null,
           edited_app_component_id:     null,
           event_code:                  null,
           text:                        texti,
           leftHandWidth:               130,
           right_mode:                  "project",
           add_property:                false,
           new_property_name:           "",
           new_property_id:             "",
           new_property_type:           "",
           local_app:                    false,
           refresh:                     0,
           properties:                  [],
           read_only:                   false,
           selected_pane:               null,
           active_property_index:       null,
           design_mode_pane:            {type: "drag_drop"},
           show_advanced_transform:     false,
           available_components:        [],
           components_used_in_this_app:             new Object(),
           form_runtime_info:           {},
           active_form:                 "Form_1",
           old_model:                   {},
           model_changed_time:          -1,
           in_change_model:             false,
           active_component_index:      null,
           active_component_detail_index: null,
           active_component_detail_name: null,
           active_component_links_index: null,
           active_component_links_name: null,
           model:                      {
                                            next_id: 1,
                                            next_component_id: 1,
                                            max_form: 1,
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
    })
}
