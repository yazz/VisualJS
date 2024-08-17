{
    
    templateDefinition:
        //*** pipeline_vue_html_template_start ***//
        `
<div    v-bind:id='unique_app_dom_element_id'
        v-if='unique_app_dom_element_id != null'
        v-bind:style='"width: 100%; height: 100%; " + (design_mode?"background: white;":"")'>

    




    <div    v-bind:id='vb_editor_element_id'
            v-if='vb_editor_element_id != null'
            v-bind:style='"position:relative;display: flex;" + (editor_locked?"pointer-events: none;opacity: 0.4;":"")'
            v-on:drop="$event.stopPropagation(); dropEditor($event)"
            v-on:ondragover="$event.stopPropagation(); allowDropEditor($event)">







        <!--
                The main center section of the UI editor
        -->
        <div v-bind:style='"display: flex;width:100%;" + (design_mode?"background-color: darkgray;":"background-color: white;")'>


            <!--
                    File path selector 
            -->


            
                    
    
    
    
    
    
    
    
            <!--
    
            The drag drop UI editor.
            
            but...
            
            Also the main view of the App
            
            -->
    
            <div    v-if='(!design_mode) || (design_mode && (design_mode_pane.type=="drag_drop"))'
                    v-bind:style='(design_mode?"box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 8px 0px, rgba(0, 0, 0, 0.19) 0px 6px 20px 0px;":"") + "margin: 2px; display: inline-block; vertical-align: top;  width: 95%;height: 65vh ;" + (design_mode?"border: 0px solid lightgray; padding:0px;margin: 0px;margin-left:15px;margin-top:15px;":"margin: 0px;" ) + "overflow:auto;"'>
    
                
                
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
                                     v-on:click='editComponent($event)'
                            >
                                <img    src='/driver_icons/builder.png'
                                        style='margin: auto;'
                                        class='img-fluid' />
                            </div>
    
    
    
    
    
    
                            <!-- Fork component ... button -->
                            <div       v-if='design_mode && isValidObject(active_component_index) && isVisible(active_form,active_component_index)'
                                       v-bind:refresh='refresh'
                                       class='btn btn-info'
                                       v-bind:style='"background: white;padding:0px; z-index: 21474836;opacity:1;position: absolute; "  +
                                            "left: " + ((getLeft(active_form,active_component_index)) + (model.forms[active_form].components[active_component_index].width) + 15) + "px;" +
                                            "top:  " + ((getTop(active_form,active_component_index)) - 45) +  "px;" +
                                            "width: 30px; height: 30px; line-height:30px;text-align: center;vertical-align: middle;"'
                                       v-on:click='forkComponent($event)'
                            >
    
    
                                <img    src='/driver_icons/plus.png'
                                        style='margin: auto;'
                                        class='img-fluid' />
                            </div>
    
    
    
    
                            <!-- Advanced details ... button -->
                            <div       v-if='design_mode && isValidObject(active_component_index) && isVisible(active_form,active_component_index) && hasMoreDetailsUi(active_form,active_component_index)'
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
                                    v-for='( formName,formindex ) in getFormNames( )'>
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
                                                    v-bind:meta='{form: formName,name: item.name + (design_mode?"_design":""),getEditor: getEditor, lookupComponent: lookupComponent,lookupComponentOnForm: lookupComponentOnForm, children: getChildren(item.name)}'
                                                    v-bind:sql='sqlQuery'
                                                    v-bind:app_helper_fns='{}'
                                                    v-bind:form_helper_fns='form_helper_fns'
                                                    v-bind:runEvent='(async function(a){await runEvent({type: "subcomponent_event",form_name: formName,control_name: item.name,sub_type: a.display,code: a.code, args: a.args})})'
                                                    v-bind:form="formName"
                                                    v-bind:design_mode='design_mode'
                                                    
                                                    v-bind:is='item.code_id?item.code_id:GLOBALS.baseComponentIdReturnsCommitId[item.base_component_id]'
                                                    v-if='!item.parent && model.forms[formName].components[index]'
                                                    v-bind:name='item.name + "_design_mode_" + design_mode'
                                                    v-bind:control_properties_and_events='model.forms[formName].components[index]'
                                                    v-bind:style='(formName==active_form)?"":"display:none;"'
                                                    >
        
                                            <template           slot-scope="child_components"
                                                                v-bind:refresh='refresh'
                                                                v-for='child_item  in  getChildren(item.name)'
                                                                v-bind:style='(formName==active_form)?"position:relative;":"display:none;"'>
        
                                                <component      v-bind:design_mode='design_mode'
                                                                v-bind:refresh='refresh'
                                                                v-bind:meta='{form: formName,name: child_item.name + (design_mode?"_design":""),getEditor: getEditor, lookupComponent: lookupComponent,lookupComponentOnForm: lookupComponentOnForm}'
                                                                v-bind:sql='sqlQuery'
                                                                v-bind:app_helper_fns='{}'
                                                                v-bind:form_helper_fns='form_helper_fns'
                                                                v-bind:runEvent='(async function(a){await runEvent({type: "subcomponent_event",form_name: formName,control_name: child_item.name,sub_type: a.display,code: a.code, args: a.args})})'
                                                                v-bind:form="formName"
                                                                v-bind:style='(formName==active_form)?"z-index:100000;position: absolute; top: " + child_item.topY + "px; left: " + child_item.leftX + "px;height:" + child_item.height + "px;width:" + child_item.width + "px;overflow:auto;":"display:none;"'
                                                                v-bind:id='formName + "_" + model.forms[formName].components[child_item.index_in_parent_array].name + (design_mode?"_design":"")'
                                                                
                                                                v-bind:is='child_item.code_id?child_item.code_id:GLOBALS.baseComponentIdReturnsCommitId[child_item.base_component_id]'
                                                                v-bind:name='child_item.name + "_design_mode_" + design_mode'
                                                                v-if='model.forms[formName].components[child_item.index_in_parent_array]'
                                                                v-bind:control_properties_and_events='model.forms[formName].components[child_item.index_in_parent_array]'>
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
    
    
    
    
    
    
 
        
    </div>
</div>
`
        //*** pipeline_vue_html_template_end ***//
}
