{
    
    templateDefinition:
        //*** pipeline_app_vue_html_template_start ***//
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
    
    
                    <div            v-bind:id='vb_grid_element_id'  v-if='vb_grid_element_id != null'
                                    v-on:drop="drop($event)"
                                    v-bind:refresh='refresh'
                                    v-on:ondragover="$event.stopPropagation();allowDrop($event)"
                                    v-bind:class='(design_mode?"dotted":"" )'
                                    v-on:click='clickOnMainGrid($event)'
                                    v-bind:style='"position:absolute;display: inline-block; vertical-align: top; width: " + model.forms[active_form].width +  ";height: " + model.forms[active_form].height +  " ;" + (design_mode?"left:15px;top:15px;border: 4px solid lightgray;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);":"border: 0px;" ) '>
    
    
                        <div    v-bind:refresh='refresh'
                                style='position:absolute;left:0px;top:0px;z-index:1000000;opacity:1;'>
        
    
    
    
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
        //*** pipeline_app_vue_html_template_end ***//
}
