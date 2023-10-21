{
    
    templateDefinition:
        //*** gen_start ***//
        `<div   v-bind:id='unique_app_dom_element_id'
        v-if='unique_app_dom_element_id != null'
        v-bind:style='"width: 100%; height: 100%; " + (design_mode?"background: white;":"")'>


    <div style='box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);background-color: lightgray; padding: 5px; padding-left: 15px;padding-bottom: 10px;' v-if='design_mode' >

        <slot style='display: inline-block;float: left;' v-if='text'>
        </slot>
        
        <div  v-if="debug_component_bci"
              style="position:fixed; left:2vw;top:2vh;width:96vw;height:95%;background-color: white;z-index:100000000; border: black solid 2px;"
        >
          <div  v-if="debug_component_bci"
                style="background-color: blue;padding: 12px;color:white;"
                v-on:click="debug_component_bci = null;debug_component_code_id = null;"
          >
            <b>Component type: </b>{{ debug_component_bci }}
            <button  type=button class=' btn btn-danger btn-sm'
                     style="float: right;box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 8px 0px, rgba(0, 0, 0, 0.19) 0px 6px 20px 0px;margin-bottom: 2px;"
                     v-on:click='debug_component_bci = null;debug_component_code_id=null' >x</button>
          </div> 
          <br>
          <div>

            IPFS: {{debug_component_code_id?debug_component_code_id:"Error: No Commit ID"}}
          </div>
          <pre style="height:80%;width:100%;overflow:scroll;padding: 5px;background-color:lightgray;">
            {{debug_component_code_id?GLOBALS.getCodeForComponent({codeId: debug_component_code_id}):""}}
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
                            v-on:click='highlighted_control = null;highlighted_control_code_id = null;'
                            v-bind:style='"display:flex;cursor: grab;border-radius: 3px;width:50px;height:50px; margin: 0px;border: 0px;padding:4px;overflow-x:hidden;overflow-y:hidden;background-color: " + ((!highlighted_control)?"#E8E8E8;border-left: 2px solid gray;border-top: 2px solid gray;":"lightgray;")'>
                        <img    src='/driver_icons/cursor.png'
                                style='width: 100%;'
                                class='img-fluid'>
                        </img>
                    </div>

                  <div    v-for='av in available_components'>
                    <div    draggable="true"
                            class=''
                            v-on:dragend='$event.stopPropagation();deleteCursor();'
                            v-on:dragstart='//alert(JSON.stringify(av,null,2));
                                            $event.stopPropagation();
                                            if (design_mode_pane.type == "drag_drop") 
                                            {
                                                switchCursor($event,"grab","grabbing");
                                                highlighted_control         = av.base_component_id;
                                                highlighted_control_code_id = av.ipfs_hash;
                                                drag(   $event,
                                                        {
                                                            type:               "add_component",
                                                            base_component_id:  av.base_component_id,
                                                            code_id:            av.ipfs_hash
                                                        })
                                            } else {
                                                event.preventDefault()
                                                gotoDragDropEditor();
                                            }'
                            v-on:click='highlighted_control = av.base_component_id;highlighted_control_code_id = av.ipfs_hash;gotoDragDropEditor();'
                            v-bind:style='"display-old:flex;cursor: grab;margin: 2px;border-radius: 3px;width:50px;;height: 50px; margin: 0px;border: 0px;padding:10px;overflow-x:auto;overflow-y:hidden;background-color: " + ((highlighted_control == av.base_component_id)?"#E8E8E8;border-left: 2px solid gray;border-top: 2px solid gray;":"lightgray;")'>

                        <img    v-if='isValidObject(av)'
                                v-bind:src='av.logo_url'
                                style='width: 100%;'
                                class='img-fluid'>
                        </img>


                  </div>
                    <div  style="width:100%; height:3px;background-color: lightgray"
                          v-on:click="debug_component_bci=av.base_component_id;debug_component_code_id=av.ipfs_hash;"></div>

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
                                v-bind:is='model.forms[active_form].components[active_component_detail_index].code_id?model.forms[active_form].components[active_component_detail_index].code_id:GLOBALS.baseComponentIdReturnsCommitId[model.forms[active_form].components[active_component_detail_index].base_component_id]'
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
                                                v-bind:is='child_item.code_id?child_item.code_id:GLOBALS.baseComponentIdReturnsCommitId[child_item.base_component_id]'
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
                                     v-html='(runtimeComponentsInfo.componentIncomingCountByUUID[model.forms[active_form].components[active_component_index].uuid])?(runtimeComponentsInfo.componentIncomingCountByUUID[model.forms[active_form].components[active_component_index].uuid]):0'>
                             </span>

                             <span    style='font-size: 20px;'>-&gt;</span>

                             <span   class="badge badge-primary"
                                     style='font-size: 20px; margin-right: 10px;'
                                     v-html='(runtimeComponentsInfo.componentOutgoingCountByUUID[model.forms[active_form].components[active_component_index].uuid])?(runtimeComponentsInfo.componentOutgoingCountByUUID[model.forms[active_form].components[active_component_index].uuid]):0'>
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
        v-on:click='design_mode_pane.links_type = "form";clearAllControlPropertyLinkFields();refresh++;'
        data-toggle="tab" role="tab" aria-controls="home" aria-selected="true">Form</a>
  </li>


  <li class="nav-item"  style="width:30%">
    <a  v-bind:class='"nav-link " + (  design_mode_pane.links_type == "create_new_component"?"active":""  )'
        id="links-create-new-component-tab"
        v-on:click='design_mode_pane.links_type = "create_new_component";clearAllControlPropertyLinkFields();refresh++;'
        data-toggle="tab" role="tab" aria-controls="profile" aria-selected="false">Create New</a>
  </li>


  <li class="nav-item"  style="width:30%">
    <a  v-bind:class='"nav-link " + (  design_mode_pane.links_type == "manual"?"active":""  )'
        id="manual-links-tab"
        v-on:click='design_mode_pane.links_type = "manual";clearAllControlPropertyLinkFields();refresh++;'
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
                                {{runtimeComponentsInfo.UiControlsByUuidPointingToAppModel[selectedWatchComponentUuid].name}}
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
                          v-on:click='$event.stopPropagation(); clearAllControlPropertyLinkFields();'  >
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
                          v-on:click='$event.stopPropagation(); clearAllControlPropertyLinkFields();'  >
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
                                 {{runtimeComponentsInfo.UiControlsByUuidPointingToAppModel[selectedWatchComponentUuid].name}}
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
                           v-on:click='$event.stopPropagation(); clearAllControlPropertyLinkFields();'  >
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
                           v-on:click='$event.stopPropagation(); clearAllControlPropertyLinkFields();'  >
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
                  <select  @change='setWatchComponent({controlUuid: $event.target.value})'  style='margin:7px;'>
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
                    v-bind:style='(design_mode?"box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 8px 0px, rgba(0, 0, 0, 0.19) 0px 6px 20px 0px;":"") + "margin: 2px; display: inline-block; vertical-align: top;  width: 95%;height: 65vh ;" + (design_mode?"border: 0px solid lightgray; padding:0px;margin: 0px;margin-left:15px;margin-top:15px;":"margin: 0px;" ) + "overflow:auto;"'>

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
                                    v-on:dragstart='$event.stopPropagation();switchCursor($event,"ns-resize","row-resize");
                                                    //debugger
                                                    drag($event,{
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
                                        v-on:dragstart='$event.stopPropagation();switchCursor($event,"nesw-resize","crosshair");
                                                        //debugger
                                                        drag($event,{
                                                           type:                   "resize_top_right",
                                                           base_component_id:       model.forms[active_form].components[active_component_index].base_component_id,
                                                           index:                   active_component_index
                                                           })'>
                            </div>

                            <!-- middle left -->
                            <div    v-if='design_mode && isValidObject(active_component_index) && isVisible(active_form,active_component_index)'
                                    v-bind:style='"cursor: ew-resize;z-index:1000;display:inline-block;background-color: gray; border: 3px solid gray; margin:0;width:12px;height:12px;position:absolute;left:" +
                                        ((getLeft(active_form,active_component_index)) - 15) +  "px;top:" +
                                        ((getTop(active_form,active_component_index)) + ((model.forms[active_form].components[active_component_index].height / 2)) - 7) +  "px;"'
                                    v-on:dragend='$event.stopPropagation();deleteCursor();'
                                    v-bind:draggable='true'
                                    v-on:dragstart='$event.stopPropagation();switchCursor($event,"ew-resize","col-resize");
                                                    drag($event,{
                                                                type:              "resize_left",
                                                                base_component_id:  model.forms[active_form].components[active_component_index].base_component_id,
                                                                index:              active_component_index
                                                             })'>
                            </div>
                            <!-- middle right -->
                            <div    v-if='design_mode && isValidObject(active_component_index) && isVisible(active_form,active_component_index)'
                                    v-bind:style='"cursor: ew-resize;z-index:1000;display:inline-block;background-color: gray; border: 3px solid gray; margin:0;width:12px;height:12px;position:absolute;left:" +
                                        ((getLeft(active_form,active_component_index)) + (model.forms[active_form].components[active_component_index].width)) +  "px;top:" +
                                        ((getTop(active_form,active_component_index)) + ((model.forms[active_form].components[active_component_index].height / 2)) - 7) +  "px;"'
                                v-on:dragend='$event.stopPropagation();deleteCursor();'
                                    v-bind:draggable='true'
                                    v-on:dragstart='$event.stopPropagation();switchCursor($event,"ew-resize","col-resize");
                                                                //debugger
                                                                drag(   $event
                                                                        ,
                                                                        {
                                                                            type:              "resize_right",
                                                                            base_component_id:  model.forms[active_form].components[active_component_index].base_component_id,
                                                                            index:              active_component_index
                                                                        })'>
                            </div>
                            <!-- bottom left -->
                            <div    v-if='design_mode && isValidObject(active_component_index) && isVisible(active_form,active_component_index)'
                                    v-bind:style='"cursor: nesw-resize;z-index:1000;display:inline-block;background-color: gray; border: 3px solid gray; margin:0;width:12px;height:12px;position:absolute;left:" +
                                        ((getLeft(active_form,active_component_index)) - 15) +  "px;top:" +
                                        ((getTop(active_form,active_component_index)) + ((model.forms[active_form].components[active_component_index].height)) + 2) +  "px;"'
                                    v-on:dragend='$event.stopPropagation();deleteCursor();'
                                        v-bind:draggable='true'
                                        v-on:dragstart='$event.stopPropagation();switchCursor($event,"nesw-resize","crosshair");
                                                        drag($event,{
                                                                    type:              "resize_bottom_left",
                                                                    base_component_id:  model.forms[active_form].components[active_component_index].base_component_id,
                                                                    index:              active_component_index
                                                                 })'>
                            </div>
                            <!-- bottom middle -->
                            <div    v-if='design_mode && isValidObject(active_component_index) && isVisible(active_form,active_component_index)'
                                    v-bind:style='"cursor: ns-resize;z-index:1000;display:inline-block;background-color: gray; border: 3px solid gray; margin:0;width:12px;height:12px;position:absolute;left:" +
                                        ((getLeft(active_form,active_component_index)) + (model.forms[active_form].components[active_component_index].width/2) - 7) +  "px;top:" +
                                        ((getTop(active_form,active_component_index)) + ((model.forms[active_form].components[active_component_index].height)) + 2) +  "px;"'
                                    v-on:dragend='$event.stopPropagation();deleteCursor();'
                                    v-bind:draggable='true'
                                    v-on:dragstart='$event.stopPropagation();switchCursor($event,"ns-resize","row-resize");
                                                    //debugger
                                                    drag($event,{
                                                                type:              "resize_bottom",
                                                                base_component_id:  model.forms[active_form].components[active_component_index].base_component_id,
                                                                index:              active_component_index
                                                             })'>
                            </div>

                            <!-- bottom right -->
                            <div    v-if='design_mode && isValidObject(active_component_index) && isVisible(active_form,active_component_index)'
                                    v-bind:style='"cursor: nwse-resize;z-index:1000;display:inline-block;background-color: gray; border: 3px solid gray; margin:0;width:12px;height:12px;position:absolute;left:" +
                                        ((getLeft(active_form,active_component_index)) + (model.forms[active_form].components[active_component_index].width) ) +  "px;top:" +
                                        ((getTop(active_form,active_component_index)) + ((model.forms[active_form].components[active_component_index].height)) + 2) +  "px;"'
                                    v-on:dragend='$event.stopPropagation();deleteCursor();'
                                    v-bind:draggable='true'
                                    v-on:dragstart='$event.stopPropagation();switchCursor($event,"nwse-resize","crosshair");
                                                    //debugger
                                                    drag($event,{
                                                                   type:               "resize_bottom_right",
                                                                   base_component_id:   model.forms[active_form].components[active_component_index].base_component_id,
                                                                   index:               active_component_index
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
                                            v-html='(runtimeComponentsInfo.componentIncomingCountByUUID[model.forms[active_form].components[active_component_index].uuid])?(runtimeComponentsInfo.componentIncomingCountByUUID[model.forms[active_form].components[active_component_index].uuid]):0'>
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
                                            v-html='(runtimeComponentsInfo.componentOutgoingCountByUUID[model.forms[active_form].components[active_component_index].uuid])?(runtimeComponentsInfo.componentOutgoingCountByUUID[model.forms[active_form].components[active_component_index].uuid]):0'>
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
                                     v-on:click='yz.editor.subEditorAction = "EDIT_CONTROL"; yz.editor.lastEditingAppBaseComponentId = yz.editor.editingAppBaseComponentId; yz.editor.lastEditingAppCodeId = yz.editor.editingAppCodeId;$event.stopPropagation();$root.$emit("message", { type:  "edit_component", base_component_id:   model.forms[active_form].components[active_component_index].base_component_id, code_id:   model.forms[active_form].components[active_component_index].code_id, form_id: active_form, control_name: model.forms[active_form].components[active_component_index].name})'
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
                                   v-on:click='yz.editor.subEditorAction = "FORK_CONTROL"; yz.editor.lastEditingAppBaseComponentId = yz.editor.editingAppBaseComponentId; yz.editor.lastEditingAppCodeId = yz.editor.editingAppCodeId;$event.stopPropagation();$root.$emit("message", { type:  "fork_component", base_component_id:   model.forms[active_form].components[active_component_index].base_component_id, code_id:   model.forms[active_form].components[active_component_index].code_id, form_id: active_form, control_name: model.forms[active_form].components[active_component_index].name})'
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
                                    v-for='( formName,formindex ) in getFormNames( )'
                                    v-bind:style=''>
                                <div    v-bind:refresh='refresh'
                                        v-for='(item,index) in getFormComponents({formName: formName})'
                                        ondrop="return false;"
                                        v-on:click='if ( isVisible(formName,index)){ $event.stopPropagation();selectComponent(index,true); }'
                                        v-bind:style='(formName==active_form)?(((design_mode && isVisible(formName,index))?"border: 1px solid black;background: white;":"") +
                                                        "position: absolute;top: " + getTop(formName,index) + ";left:" + getLeft(formName,index) + ";height:" + item.height + "px;width:" + item.width + "px;;overflow:none;"):"display:none;"'>
    
                                    <div ondrop="return false;"
                                         v-bind:style='(formName==active_form)?"position: absolute; top: 0px; left: 0px;height:" + item.height + "px;width:" + item.width + "px;overflow:hidden;":"display:none;"'>
                                        <component  v-bind:id='formName + "_" + model.forms[formName].components[index].name + (design_mode?"_design":"")'
                                                    v-bind:refresh='refresh'
                                                    v-bind:meta='{form: formName,name: item.name + (design_mode?"_design":""),getEditor: getEditor, lookupComponent: lookupComponent,lookupComponentOnForm: lookupComponentOnForm}'
                                                    v-bind:form="formName"
                                                    v-bind:design_mode='design_mode'
                                                    v-bind:children='getChildren(item.name)'
                                                    v-on:send="processControlEvent"
                                                    v-bind:is='item.code_id?item.code_id:GLOBALS.baseComponentIdReturnsCommitId[item.base_component_id]'
                                                    v-if='!item.parent && model.forms[formName].components[index]'
                                                    v-bind:name='item.name + "_design_mode_" + design_mode'
                                                    v-bind:properties='model.forms[formName].components[index]'
                                                    v-bind:props='model.forms[formName].components[index]'
                                                    v-bind:style='(formName==active_form)?"":"display:none;"'
                                                    v-bind:args='model.forms[formName].components[index]'>
    
                                            <template       slot-scope="child_components"
                                                            v-bind:refresh='refresh'
                                                            v-bind:style='(formName==active_form)?"position:relative;":"display:none;"'>
    
                                                <component  v-for='child_item  in  getChildren(item.name)'
                                                            v-bind:design_mode='design_mode'
                                                            v-bind:refresh='refresh'
                                                            v-bind:meta='{form: formName,name: child_item.name + (design_mode?"_design":""),getEditor: getEditor, lookupComponent: lookupComponent,lookupComponentOnForm: lookupComponentOnForm}'
                                                            v-bind:form="formName"
                                                            v-bind:style='(formName==active_form)?"z-index:100000;position: absolute; top: " + child_item.topY + "px; left: " + child_item.leftX + "px;height:" + child_item.height + "px;width:" + child_item.width + "px;overflow:auto;":"display:none;"'
                                                            v-bind:id='formName + "_" + model.forms[formName].components[child_item.index_in_parent_array].name + (design_mode?"_design":"")'
                                                            v-on:send="processControlEvent"
                                                            v-bind:is='child_item.code_id?child_item.code_id:GLOBALS.baseComponentIdReturnsCommitId[child_item.base_component_id]'
                                                            v-bind:name='child_item.name + "_design_mode_" + design_mode'
                                                            v-bind:properties='model.forms[formName].components[child_item.index_in_parent_array]'
                                                            v-if='model.forms[formName].components[child_item.index_in_parent_array]'
                                                            v-bind:props='model.forms[formName].components[child_item.index_in_parent_array]'
                                                            v-bind:args='model.forms[formName].components[child_item.index_in_parent_array]'>
                                                </component>
    
                                            </template>
    
                                        </component>
                                    </div>
    
                                    <div    v-bind:style='(formName==active_form)?"cursor: move;position: absolute; top: 0px; left: 0px;z-index: " + (item.is_container?"1":"10000000") + ";width: 100%;height: 100%;border: 1px solid black;":"display:none;"'
                                            v-bind:draggable='design_mode'
                                            v-if='design_mode && isVisible(formName,index)'
                                            ondrop="return false;"
                                            v-on:dragstart='$event.stopPropagation();
                                                            //debugger
                                                            drag($event,{
                                                               type:               "move_component",
                                                               base_component_id:   item.base_component_id,
                                                               index:               index
                                                            })'>
    
                                        <div    v-if='design_mode && isVisible(formName,index)'
                                                ondrop="return false;"
                                                v-bind:refresh='refresh'
                                                v-bind:style='(formName==active_form)?"position: absolute; top: 0px; left: 0px;z-index: 10000000;width: 100%;height: 100%; background-color: lightgray;" +
                                                                ((index == active_component_index)?"opacity: 0;":"opacity: .6;"):"display:none;" '>
    
                                        </div>
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
                                          v-on:click='debug_component_bci = model.forms[active_form].components[active_component_index].base_component_id;
                                                      // if we have the commit ID
                                                      if (debug_component_code_id && (debug_component_code_id != "")) {
                                                            debug_component_code_id=model.forms[active_form].components[active_component_index].code_id;
                                                            
                                                      // if only a BCI
                                                      } else {
                                                            debug_component_code_id=GLOBALS.getCommitIdForBaseComponentId( model.forms[active_form].components[active_component_index].base_component_id);
                                                      }'
                                                      > ..
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
                                                    @change='setVBEditorProperty( {  property: property  ,  value: $event.target.value  } )'
                                                    v-bind:value='getVBEditorProperty(property)'
                                                    v-bind:type='property.password?"password":""'
                                                    style='width: 100%;border: 0px;font-family:verdana,helvetica;font-size: 13px;padding:0px;'>
                                            </input>
                                            <textarea
                                                    v-if="(property.textarea != null) && (property.textarea != '')"
                                                    rows=10
                                                    @change='setVBEditorProperty(  {  property: property  ,  value: $event.target.value  }  )'
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
                                            <select  @change='setVBEditorProperty(  {  property: property  ,  value: $event.target.value  }  )'>
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




                                        <div    v-if="(property.type  == 'Event') || ((property.type  == 'Action_old') && isValidObject(property.fn))  ||  (model.app_selected && (property.type  == 'Action'))"
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
                                        <div    v-if='property.id == "display_name"'
                                                style='padding:0px;font-family:verdana,helvetica;font-size: 13px;'
                                                class='col-md-12 small'>

                                            {{GLOBALS.getTypeDisplayName(
                                                {
                                                    baseComponentId:    model.forms[active_form].components[active_component_index].base_component_id, 
                                                    codeId:             model.forms[active_form].components[active_component_index].code_id
                                                })
                                            }}

                                        </div>
                                                                         <div    v-if='property.id == "display_icon"'
                                                style='padding:0px;font-family:verdana,helvetica;font-size: 13px;'
                                                class='col-md-12 small'>

                                            <img    v-bind:src='GLOBALS.getTypeDisplayIcon(
                                                                    {
                                                                        baseComponentId:    model.forms[active_form].components[active_component_index].base_component_id, 
                                                                        codeId:             model.forms[active_form].components[active_component_index].code_id
                                                                    })
                                                                '
                                                    style='height: 20px;'
                                                    class='img-fluid'>
                                            </img>
                                            

                                        </div>       
                                        
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
                                            v-on:click='$event.stopPropagation();addPropertyToApp()'  >
                                    +
                                </button>
                            </div>
                        </div>

                        <div v-if='(model.app_selected) && (add_property)' class='row'>
                            <div    style='font-family:verdana,helvetica;font-size: 13px;font-weight:bold;padding-left:20px;color:white;background-color:blue;'
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
                                    v-bind:placeholder='(new_property_type=="Action")?"doAction":"background_color"'
                                    v-model='new_property_id'>
                            </input>
                        </div>

                        <div v-if='(model.app_selected) && (add_property)' class='row'>
                            <div    style='font-family:verdana,helvetica;font-size: 13px;'
                                    class='col-md-4'>
                                Name
                            </div>

                            <input  class='col-md-7 small'
                                    v-bind:placeholder='(new_property_type=="Action")?"Do Action":"Background Color"'
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
                                    <option  v-bind:selected='new_property_type=="Action"' value="Action">Action</option>
                            </select>
                        </div>


                        
                        
                        
                        
                        
                        
                        
                        <div v-if='(model.app_selected) && (add_property) && (new_property_type=="Action")' class='row'>
                            <div    style='font-family:verdana,helvetica;font-size: 13px;'
                                    class='col-md-4'>
                                Async
                            </div>

                            <select  class='col-md-7 small'
                                     style='border:0px;font-family:verdana,helvetica;font-size: 13px;'
                                     v-model='new_async'>

                                    <option  v-bind:selected='new_async=="true"' value="True">True</option>
                                    <option  v-bind:selected='new_async=="false"' value="False">False</option>
                            </select>
                        </div>
                        
                        <div v-if='(model.app_selected) && (add_property) && (new_property_type=="Action")' class='row'>
                            <div    style='font-family:verdana,helvetica;font-size: 13px;'
                                    class='col-md-4'>
                                Pre snippet
                            </div>
                            <input  style='font-family:verdana,helvetica;font-size: 13px;'
                                    class='col-md-7 small'
                                    v-bind:placeholder='((new_async=="true")?"await ":"")'
                                    v-model='new_pre_snippet'>
                            </input>
                        </div>
                        <div v-if='(model.app_selected) && (add_property) && (new_property_type=="Action")' class='row'>
                            <div    style='font-family:verdana,helvetica;font-size: 13px;'
                                    class='col-md-4'>
                                Snippet
                            </div>
                            <input  style='font-family:verdana,helvetica;font-size: 13px;'
                                    class='col-md-7 small'
                                    placeholder='doAction(...)'
                                    v-model='new_snippet'>
                            </input>
                        </div>
                        <div v-if='(model.app_selected) && (add_property) && (new_property_type=="Action")' class='row'>
                            <div    style='font-family:verdana,helvetica;font-size: 13px;'
                                    class='col-md-4'>
                                Help
                            </div>
                            
                            <textarea  style='font-family:verdana,helvetica;font-size: 13px;'
                                    class='col-md-5 small'
                                    rows=10
                                    placeholder='doAction(...) does something'
                                    v-model='new_help'>
                            </textarea>
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
</div>`
        //*** gen_end ***//
}
