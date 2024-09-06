{
    pipelineCode: async function() {
        methods:
        {
            //*** pipeline_ui_methods_start ***//

            dummyCommonMethod:                          async function  (  ) {
            }

            //*** pipeline_ui_methods_end ***//
        },
        mounted:
            //*** copy_mounted_start ***//
            async function() {
                // This is called whenever an app is loaded, either at design
                // time or at runtime


                let mm = this
                if (Vue.version.startsWith("2")) {
                    mm.GLOBALS          = GLOBALS
                    mm.isValidObject    = isValidObject
                    mm.yz               = yz
                    mm.showProgressBar  = showProgressBar
                    mm.hideProgressBar  = hideProgressBar
                } else if (Vue.version.startsWith("3")) {
                    mm.GLOBALS          = Vue.inject('GLOBALS')
                    mm.isValidObject    = Vue.inject('isValidObject')
                    mm.yz               = Vue.inject('yz')
                    mm.showProgressBar  = Vue.inject('showProgressBar')
                    mm.hideProgressBar  = Vue.inject('hideProgressBar')
                }
                if (!mm.design_mode) {
                    //debugger
                }



                if (args) {
                    //debugger
                    if (args.text) {
                        mm.text = args.text
                    }
                    if (args.codeId) {
                        mm.codeId = args.codeId
                    }
                }

                let json2
                try {
                    mm.form_helper_fns =
                        {
                            delete_design_time_component:     mm.delete_design_time_component,
                            select_design_time_component:     mm.select_design_time_component
                        }
                    mm.unique_app_dom_element_id    = uuidv4()
                    mm.vb_grid_element_id           = "vb_grid_" + uuidv4()
                    mm.vb_editor_element_id         = "vb_editor_" + uuidv4()
                    mm.in_change_model              = true


                    if (mm.design_mode) {
                        yz.mainVars.disableAutoSave = false
                    }



                    // Get the base component ID of the code to edit/run
                    // Save it in "this.edited_app_component_id"

                    if (mm.text) {
                        json2                       = mm.getJsonModelFromCode(mm.text)
                        if (json2) {
                            mm.old_model                = JSON.parse(JSON.stringify(json2));
                            mm.model                    = json2
                        }
                        mm.edited_app_component_id  = yz.helpers.getValueOfCodeString(mm.text, "base_component_id")
                        mm.edited_app_display_name  = yz.helpers.getValueOfCodeString(mm.text, "display_name")
                        mm.read_only                = yz.helpers.getValueOfCodeString(mm.text, "read_only")
                    }
                    mm.active_form = mm.model.default_form



                    //
                    // Set up all the form methods
                    //
                    let forms = mm.getForms()
                    for (let formIndex = 0; formIndex < forms.length; formIndex++) {
                        let formName = forms[formIndex].name

                        let formProps = mm.getFormProperties()
                        for (let formprop of formProps) {
                            let formDef = mm.model.forms[formName]
                            if (formprop.type == "Action") {
                                formDef[formprop.id] =
                                    mm.getFormMethod(formName, formprop)

                            } else if (!isValidObject(formprop)) {
                                formDef[formprop.id] = ""
                            }
                        }


                        // Load the component definitions for all components on
                        // this form
                        for (let newItem of mm.model.forms[formName].components) {

                            await GLOBALS.makeSureUiComponentLoadedV6(
                                {
                                    baseComponentId:    newItem.base_component_id,
                                    codeId:             newItem.code_id
                                }
                            )
                        }


                        // ---------------------------------------------------------
                        // For each app property
                        // ---------------------------------------------------------
                        let appProps = mm.getAllAppProperties()
                        for (let propDetails of appProps) {
                            if (propDetails.type == "Action") {
                                //debugger
                                if (!mm.design_mode) {
                                    mm.model[propDetails.id] = mm.getAppMethod(propDetails.id)
                                }
                            } else if (!isValidObject(mm.model[propDetails.id])) {
                                if (isValidObject(propDetails.default)) {
                                    mm.model[propDetails.id] = propDetails.default
                                } else if (isValidObject(propDetails.default_expression)) {
                                    mm.model[propDetails.id] = eval("(" + propDetails.default_expression + ")")
                                }
                            }
                        }
                    }
                    // ---------------------------------------------------------
                    // For each form ...
                    // ---------------------------------------------------------

                    //
                    // get the available components
                    //
                    if (yz.mainVars.online) {
                        await mm.loadControlPalette()
                    }

                    mm.updateAllFormCaches()
                    mm.$forceUpdate();
                    mm.updatePropertySelector()

                    setTimeout(async function () {
                        for (let formName of mm.getFormNames()) {
                            let thisForm = mm.model.forms[formName]
                            if (  thisForm.on_form_load && (!mm.design_mode)) {
                                let formLoadCode = thisForm.on_form_load

                                let formEvent = {
                                    type:               "form_event",
                                    form_name:           formName,
                                    code:                formLoadCode,
                                    sub_type:           "load"
                                }
                                mm.processControlEvent(formEvent)
                            }
                        }

                        mm.selectForm(mm.model.default_form)
                    }, 500)

                    hideProgressBar()
                    mm.in_change_model = false
                    mm.old_model = JSON.parse(JSON.stringify(mm.model));


                    //
                    // start of update all watched vars when a form is activated
                    //
                    if (!this.design_mode) {
                        for (let thisComponent of mm.model.forms[this.active_form].components) {
                            let uuid = thisComponent.uuid
                            //console.log("UUID: " + JSON.stringify(uuid,null,2))
                            //console.log(this.watchList[uuid])
                            let ww2 = this.watchList
                            for (let aaq = 0; aaq < ww2.length; aaq++) {
                                let ww = ww2[aaq]
                                if (ww) {
                                    if (ww.from_component_uuid == uuid) {
                                        //debugger
                                        //console.log(ww)

                                        let fromc = mm.runtimeComponentsInfo.UiControlsByUuidPointingToAppModel[uuid]
                                        //console.log("fromc: " + JSON.stringify(fromc,null,2))


                                        let touuid = ww.to_component_uuid
                                        let toc = mm.runtimeComponentsInfo.UiControlsByUuidPointingToAppModel[touuid]
                                        //console.log("toc: " + JSON.stringify(toc,null,2))


                                        //mm.model.forms[this.active_form].components[0].text = "" + mm.model.forms[this.active_form].components[1].value
                                        let vvvvvv = fromc[ww.from_component_property_name]
                                        let toValue = JSON.parse(JSON.stringify(vvvvvv))

                                        if (ww.transform_fn) {
                                            try {
                                                let toValueFn = eval("(" + ww.transform_fn + ")")
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
                                                type: "subcomponent_event",
                                                form_name: mm.active_form,
                                                control_name: toc.name,
                                                sub_type: "on_property_in",
                                                code: toc.on_property_in,
                                                args: {
                                                    from_form: mm.active_form,
                                                    from_component: fromc.name,
                                                    from_property: ww.from_component_property_name,
                                                    from_value: toValue,
                                                    to_form: mm.active_form,
                                                    to_component: toc.name,
                                                    to_property: ww.to_component_property_name,
                                                    to_value: toValue,
                                                    to_old_value: oldValue,
                                                    to_new_value: toValue
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




                    //
                    // Change a UI control in the app
                    // after the Ui control class definition
                    // has been edited in another editor
                    //
                    if (mm.design_mode) {

                        if (yz.editor.subEditorAction == "FORK_CONTROL") {
                            setTimeout(function () {
                                if (yz.editor.saveControlChanges) {
                                    mm.changePropertyValue(
                                        {
                                            componentName: yz.editor.originalNameOfEditedUiControl,
                                            propertyName: "base_component_id",
                                            propertyValue: yz.editor.finalBaseComponentIdOfEditedUiControl
                                        }
                                    )
                                    mm.changePropertyValue(
                                        {
                                            componentName: yz.editor.originalNameOfEditedUiControl,
                                            propertyName: "code_id",
                                            propertyValue: yz.editor.finalCodeIdOfEditedUiControl
                                        }
                                    )
                                }
                                yz.editor.originalNameOfEditedUiControl = null
                                yz.editor.subEditorAction = null
                                yz.editor.saveControlChanges = false

                            }, 1000)
                        } else if (yz.editor.subEditorAction == "EDIT_CONTROL") {
                            setTimeout(function () {
                                if (yz.editor.saveControlChanges) {
                                    mm.changePropertyValue(
                                        {
                                            componentName: yz.editor.originalNameOfEditedUiControl,
                                            propertyName: "base_component_id",
                                            propertyValue: yz.editor.finalBaseComponentIdOfEditedUiControl
                                        }
                                    )
                                    mm.changePropertyValue(
                                        {
                                            componentName: yz.editor.originalNameOfEditedUiControl,
                                            propertyName: "code_id",
                                            propertyValue: yz.editor.finalCodeIdOfEditedUiControl
                                        }
                                    )
                                }
                                yz.editor.originalNameOfEditedUiControl = null
                                yz.editor.subEditorAction = null
                                yz.editor.saveControlChanges = false
                            }, 1000)

                        }
                    }


                    //
                    // This is only used when previewing a component. Since we use the "Totally Blank App"
                    // for previews we need to see if the argument 'control_type' is passed in, and if
                    // it is then we add the component being previewed instead
                    //
                    // START

                    if (mm.isThisComponentAnApp()) {
                        setTimeout(async function () {

                        }, 800)
                    }
                    // END
                    //

                    setTimeout(async function () {
                        if (GLOBALS.isStaticHtmlPageApp) {
                            mm.editor_locked = false
                        }
                        await mm.loadControlPalette()
                        mm.editor_locked = false
                    }, 2000)
                } catch ( mountedErr ) {
                    debugger
                    console.log("Mounted error: " + mountedErr)
                }

            }
            //*** copy_mounted_end ***//,
        watch:
            //*** copy_watch_start ***//
            {
            // This watches for changes in the application
            model: {
                handler:
                    function() {
                        let mm  =  this

                        if (!mm) {
                            return
                        }

                        // if we are in design mode then any changes in the
                        // application model means that the app has changed,
                        // so we set the application to be "save pending"
                        // which means that the application code will be saved
                        // at the next autosave

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
                                            mm.editor_fns.pending()
                                        }
                                        mm.in_change_model = false

                                    },500)
                                }
                            }

                        // if we are in runtime mode then ...

                        } else {
                            //console.log("Changed ********")
                            let ttt=null
                            if (mm.old_model) {
                                ttt = jsondiffpatch2.diff(mm.old_model,mm.model)
                                //console.log("Changes: "+ JSON.stringify(ttt,null,2))

                                let changedUuids = {}

                                if (ttt) {
                                    mm.old_model = JSON.parse(JSON.stringify(mm.model));

                                    //debugger
                                    //
                                    // find  out what components have changed in the current form
                                    //
                                    if (isValidObject(ttt.forms)) {
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

                                                        let fromc = mm.runtimeComponentsInfo.UiControlsByUuidPointingToAppModel[uuid]
                                                        //console.log("fromc: " + JSON.stringify(fromc,null,2))


                                                        let touuid = ww.to_component_uuid
                                                        let toc = mm.runtimeComponentsInfo.UiControlsByUuidPointingToAppModel[touuid]
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



                    }
            ,
                deep: true
            }
        }
            //*** copy_watch_end ***//,
        data:       function () {
            return {
                //*** copy_data_start ***//
                form_helper_fns:                     {},
                code_changes:                        [],
                app_selected:                        false,
                showFilePicker:                      false,
                editor_locked:                       false,
                open_file_path:                      "/",
                open_file_list:                      [],
                open_file_name:                      "",
                file_exts:                           [],
                errors:                              null,
                inUpdateAllFormCaches:               false,
                runtimeComponentsInfo:               {},
                runtimeFormsInfo:                    {},
                newCursor:                           null,
                watchList:                           [],
                selectedWatchComponentUuid:          null,
                selectedWatchFromProperty:           null,
                selectedWatchTransformFn:            null,
                selectedWatchToProperty:             null,
                selectedWatchFromProperties:         [],
                selectedWatchToProperties:           [],
                linkSideSelected:                    "none",
                fromLinkPropertySelected:            false,
                toLinkPropertySelected:              false,
                selected_link_component_type:        null,
                incoming_link_objects:               [],
                outgoing_link_objects:               [],
                incoming_link_component_types:       [],
                outgoing_link_component_types:       [],
                selectedWatchComponentType:          null,
                selectedPushComponentType:           null,
                selectedPushComponentUuid:           null,
                selectedPushFromProperty:            null,
                selectedPushTransformFn:             null,
                selectedPushToProperty:              null,
                selectedPushFromProperties:          [],
                selectedPushToProperties:            [],
                oldCursor:                           null,
                cursorSource:                        null,
                unique_app_dom_element_id:           null,
                vb_grid_element_id:                  null,
                vb_editor_element_id:                null,
                debug_component_bci:                 null,
                debug_component_code_id:             null,
                in_generate_code_from_model:         false,
                design_mode:                         designMode,
                runtime_mode:                        runtimeMode,
                highlighted_control:                 null,
                highlighted_control_code_id:         null,
                edited_app_component_id:             null,
                edited_app_display_name:             null,
                componentType:                       null,
                event_code:                          null,
                text:                                null,
                codeId:                              null,
                leftHandWidth:                       130,
                right_mode:                          "project",
                add_property:                        false,
                edit_property:                       false,
                edit_property_id:                    null,
                edit_property_name:                  "",
                edit_property_type:                  "",
                edit_property_snippet:               "",
                edit_property_help:                  "",
                new_property_name:                   "",
                new_property_id:                     "",
                new_property_type:                   "",
                new_snippet:                         "",
                new_help:                            "",
                refresh:                             0,
                properties:                          [],
                read_only:                           false,
                selected_pane:                       null,
                active_property_index:               null,
                design_mode_pane:                    {type: "drag_drop"},
                show_advanced_transform:             false,
                available_components:                [],
                ui_code_editor:                      null,
                active_form:                         "Form_1",
                old_model:                           {},
                model_changed_time:                  -1,
                in_change_model:                     false,
                active_component_index:              null,
                active_component_detail_index:       null,
                active_component_detail_name:        null,
                active_component_links_index:        null,
                active_component_links_name:         null,
                //*** copy_data_end ***//
                model:
                    {
                    }
            }
        }
    }
}
