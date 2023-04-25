{
    pipelineCode: async function() {
        methods:
        {
            //*** gen_start ***//
            loadControls:                           async function  () {
                /*
                ________________________________________
                |                                      |
                |             loadControls             |
                |                                      |
                |______________________________________|

                This loads the controls for the control palette, which allows the user
                to add buttons, labels, and other controls to their app

                __________
                | Params |
                |        |______________________________________________________________
                |
                |     NONE
                |________________________________________________________________________ */
                let mm  = this
                let sql =    "select  base_component_id,  app_icon_data as logo_url  from  yz_cache_released_components  " +
                    " inner JOIN " +
                    "     icon_images ON yz_cache_released_components.icon_image_id = icon_images.id " +
                    "where " +
                    "    icon_image_id is not null and component_type = 'component'"

                let results = await callComponent({ base_component_id:    "readFromInternalSqliteDatabase"},
                    {   sql: sql  })

                mm.available_components = results
                let itemsToLoad = []
                for (let thiscc of results) {
                    let cbase = thiscc.base_component_id
                    //console.log("Component: " + JSON.stringify(cbase))
                    itemsToLoad.push(cbase)
                }
                await loadUiComponentsV4(itemsToLoad)
                //console.log("Time " + (ttq++) + ": " + (new Date().getTime()- startTime))
            },
            addCodeChange:                          function        (changeText) {
                /*
                ________________________________________
                |                                      |
                |             addCodeChange            |
                |                                      |
                |______________________________________|

                This is called to try to keep a log of changes that has occurred on a commit

                __________
                | Params |
                |        |______________________________________________________________
                |
                |     NONE
                |________________________________________________________________________ */
                let mm = this
                if (!mm.code_changes) {
                    mm.code_changes = []
                }

                mm.code_changes.push(
                    {
                        code_change_text: changeText
                        ,
                        timestamp: new Date().getTime()
                    })
            },
            updateComponentMethods:                 function        () {
                /*
               ________________________________________
               |                                      |
               |         updateComponentMethods       |
               |                                      |
               |______________________________________|

               I'm not entirely sure what this method does

               __________
               | Params |
               |        |______________________________________________________________
               |
               |     NONE
               |________________________________________________________________________ */
                let mm = this

                // ---------------------------------------------------------
                // ... Set up all the form methods
                // ---------------------------------------------------------
                let forms = mm.getForms()
                for (let formIndex = 0; formIndex < forms.length; formIndex ++) {
                    let formName = forms[formIndex].name

                    // ---------------------------------------------------------
                    // For each component in the form ...
                    // ---------------------------------------------------------
                    for (let compenentInFormIndex = 0; compenentInFormIndex < mm.model.forms[formName].components.length ; compenentInFormIndex++ )
                    {
                        // ---------------------------------------------------------
                        // ... Make sure that the component is added as a
                        //     dependency of this app (Useful for
                        //     when we compile the app as standalone HTML)
                        // ---------------------------------------------------------

                        let componentConfig = mm.model.forms[formName].components[compenentInFormIndex]
                        if (mm.edited_app_component_id) {
                            mm.components_used_in_this_app[  componentConfig.base_component_id  ] = true
                        }



                        // ---------------------------------------------------------
                        // ...
                        //
                        //
                        // ---------------------------------------------------------

                        let componentId = mm.model.forms[formName].components[compenentInFormIndex].base_component_id

                        if (GLOBALS.isComponentTypeCached(componentId)) {
                            let cachedComponentPropertiesDefinition = mm.getControlProperties(mm.model.forms[formName].components[compenentInFormIndex].base_component_id)
                            if (isValidObject(cachedComponentPropertiesDefinition)) {
                                for (let cpp = 0 ; cpp< cachedComponentPropertiesDefinition.length; cpp ++) {
                                    let prop = cachedComponentPropertiesDefinition[cpp].id
                                    let compId = mm.model.forms[formName].components[compenentInFormIndex].base_component_id

                                    if (cachedComponentPropertiesDefinition[cpp].type == "Action") {
                                        mm.model.forms[formName].components[compenentInFormIndex][prop] =
                                            mm.getControlMethod(cachedComponentPropertiesDefinition[cpp],
                                                mm.model.forms[formName].components[compenentInFormIndex])

                                    } else if (!isValidObject(mm.model.forms[formName].components[compenentInFormIndex][prop])){
                                        mm.model.forms[formName].components[compenentInFormIndex][prop] = ""
                                    }
                                }
                            }
                        }
                    }
                }
            },
            getIncomingToPropertyName:              function        (currentWatch) {
                /*
                ________________________________________
                |                                      |
                |   getIncomingToPropertyName          |
                |                                      |
                |______________________________________|

                I'm not entirely sure what this method does

                __________
                | Params |
                |        |______________________________________________________________
                |
                |     NONE
                |________________________________________________________________________ */
                let ret
                if (this.model.forms[this.active_form].components[this.active_component_links_index]) {
                    ret = this.model.forms[this.active_form].components[this.active_component_links_index].name
                        +
                        "."
                        +
                        currentWatch.to_component_property_name
                } else {
                    ret = "<Invalid>"
                }

                return ret
            },
            getEditor:                              function        () {
                /*
                ________________________________________
                |                                      |
                |   getEditor                          |
                |                                      |
                |______________________________________|

                TO BE FILLED IN

                __________
                | Params |
                |        |______________________________________________________________
                |
                |     NONE
                |________________________________________________________________________ */
                return this
            },
            changeComponentBaseId                                   (args) {
                /*
                ________________________________________
                |                                      |
                |   changeComponentBaseId              |
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
                //alert("Hi from the editor" + JSON.stringify(args,null,2))
                //evm_contract_control_114

                //debugger
                let ccc = mm.model.forms[mm.active_form].components
                for (   let ytr = ccc.length - 1;    ytr >= 0;    ytr--   ) {
                    let component = ccc[ytr]
                    let fg=component.name
                    if (fg == args.componentName) {
                        ccc[ytr].base_component_id = args.newComponentBaseId
                    }

                }
                let currentTime = new Date().getTime();
                if (mm.model_changed_time != -1) {
                    mm.model_changed_time = currentTime
                }
                // replace("evm_contract_control_114", "")

                setTimeout(async function() {
                    mm.updateAllFormCaches()
                    //mm.updatePropertySelector()
                    mm.selectComponentByName(args.componentName)
                    mm.refresh ++


                },100)
            },
            changePropertyValue                                     (args) {
            /*
            ________________________________________
            |                                      |
            |   changePropertyValue                |
            |                                      |
            |______________________________________|

            TO BE FILLED IN

            __________
            | Params |
            |        |______________________________________________________________
            |
            |        {
            |                componentName - The name, such as "aaa" of the control
            |                -------------
            |
            |                propertyName - Which property to change
            |                ------------
            |
            |                propertyValue - The property value
            |                -------------
            |        }
            |________________________________________________________________________ */
            let mm = this
            //alert("Hi from the editor" + JSON.stringify(args,null,2))
            //evm_contract_control_114

            //debugger
            let ccc = mm.model.forms[mm.active_form].components
            for (   let ytr = ccc.length - 1;    ytr >= 0;    ytr--   ) {
                let component = ccc[ytr]
                let fg=component.name
                if (fg == args.componentName) {
                    ccc[ytr][args.propertyName] = args.propertyValue
                }

            }
            let currentTime = new Date().getTime();
            if (mm.model_changed_time != -1) {
                mm.model_changed_time = currentTime
            }
            // replace("evm_contract_control_114", "")

            setTimeout(async function() {
                mm.updateAllFormCaches()
                //mm.updatePropertySelector()
                mm.selectComponentByName(args.componentName)
                mm.refresh ++


            },100)
        },
            lookupComponent:                        function        (componentName) {
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
                let component  = null
                let mm         = this

                if (mm.form_runtime_info) {
                    if (mm.form_runtime_info[mm.active_form]) {
                        if (mm.form_runtime_info[mm.active_form].component_lookup_by_name) {
                            if (mm.form_runtime_info[mm.active_form].component_lookup_by_name[componentName]) {
                                component = mm.form_runtime_info[mm.active_form].component_lookup_by_name[componentName]
                            }
                        }
                    }
                }

                return component
            },
            lookupComponentOnForm:                  function        (lookupArgs) {
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
                let component  = null
                let mm         = this

                if (lookupArgs.componentName) {
                    let componentName = lookupArgs.componentName
                    if (mm.form_runtime_info) {
                        if (mm.form_runtime_info[mm.active_form]) {
                            if (mm.form_runtime_info[mm.active_form].component_lookup_by_name) {
                                if (mm.form_runtime_info[mm.active_form].component_lookup_by_name[componentName]) {
                                    component = mm.form_runtime_info[mm.active_form].component_lookup_by_name[componentName]
                                }
                            }
                        }
                    }

                    return component


                } else if (lookupArgs.base_component_id && lookupArgs.first_only) {

                    let base_component_id = lookupArgs.base_component_id
                    if (mm.model.forms[mm.active_form].components) {
                        let ccc = mm.model.forms[mm.active_form].components
                        for (let ytr = 0;ytr < ccc.length;ytr++) {
                            if (ccc[ytr].base_component_id == base_component_id) {
                                return ccc[ytr]
                            }
                        }
                    }

                    return component

                }
                return null

            },
            getIncomingFromPropertyName:            function        (currentWatch) {
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
                let ret
                if (this.form_runtime_info[this.active_form].component_lookup_by_uuid[currentWatch.from_component_uuid]) {
                    ret = this.form_runtime_info[this.active_form].component_lookup_by_uuid[currentWatch.from_component_uuid].name
                        +
                        "."
                        +
                        currentWatch.from_component_property_name
                } else {
                    ret = "<Invalid>"
                }

                return ret
            },
            getIncomingTransformFn:                 function        (currentWatch) {
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
                let ret
                //debugger
                if (currentWatch.transform_fn && (currentWatch.transform_fn.length > 0)) {
                    ret = currentWatch.transform_fn
                } else {
                    ret = "None"
                }

                return ret
            },
            getOutgoingTransformFn:                 function        (currentPush) {
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
                let ret
                //debugger
                if (currentPush.transform_fn && (currentPush.transform_fn.length > 0)) {
                    ret = currentPush.transform_fn
                } else {
                    ret = "None"
                }

                return ret
            },
            getOutgoingFromPropertyName:            function        (currentPush) {
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
                let ret
                if (this.form_runtime_info[this.active_form].component_lookup_by_uuid[currentPush.from_component_uuid]) {
                    ret = this.form_runtime_info[this.active_form].component_lookup_by_uuid[currentPush.from_component_uuid].name
                        +
                        "."
                        +
                        currentPush.from_component_property_name
                } else {
                    ret = "<Invalid>"
                }

                return ret
            },
            getOutgoingToPropertyName:              function        (currentPush) {
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
                let ret
                if (this.form_runtime_info[this.active_form].component_lookup_by_uuid[currentPush.to_component_uuid]) {
                    ret = this.form_runtime_info[this.active_form].component_lookup_by_uuid[currentPush.to_component_uuid].name
                        +
                        "."
                        +
                        currentPush.to_component_property_name
                } else {
                    ret = "<Invalid>"
                }

                return ret
            },
            //*** gen_end ***//

        }
    }
}
