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
            //*** gen_end ***//

        }
    }
}
