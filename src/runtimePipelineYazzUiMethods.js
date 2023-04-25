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
            addPush:                                function        () {
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
                let mm = this

                if ( mm.selectedPushComponentUuid == null) {
                    return
                }
                mm.old_model = JSON.parse(JSON.stringify( mm.model ));
                if (! mm.model.forms[mm.active_form].components[mm.active_component_index].push) {
                    mm.model.forms[mm.active_form].components[mm.active_component_index].push = []
                }
                mm.model.forms[mm.active_form].components[mm.active_component_index].push.push(
                    {
                        "uuid": mm.selectedPushComponentUuid,
                        "property": mm.selectedPushFromProperty,
                        "send_to": mm.selectedPushToProperty,
                        "transform_fn": mm.selectedPushTransformFn
                    }
                )
                mm.selectedPushComponentUuid     = null
                mm.selectedPushFromProperty      = null
                mm.selectedPushToProperty        = null
                mm.selectedPushTransformFn        = null

                mm.refresh ++
                mm.updateAllFormCaches()
                mm.showSaveButton()



            },
            clearLinks:                             async function  () {
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
                mm.selectedWatchComponentUuid = null
                mm.selectedWatchFromProperty = null
                mm.selectedWatchToProperty = null
                mm.selectedWatchFromProperties = []
                mm.linkSideSelected = "none"
                mm.selectedPushComponentUuid     = null
                mm.selectedPushFromProperty      = null
                mm.selectedPushToProperty        = null
                mm.selectedPushTransformFn        = null
                mm.selectedPushComponentType = null
                await mm.recalcComponentLinks()
            },
            addWatch:                               function        () {
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
                let mm = this

                if ( mm.selectedWatchComponentUuid == null) {
                    return
                }
                mm.old_model = JSON.parse(JSON.stringify( mm.model ));
                if (! mm.model.forms[mm.active_form].components[mm.active_component_index].watch) {
                    mm.model.forms[mm.active_form].components[mm.active_component_index].watch = []
                }
                mm.model.forms[mm.active_form].components[mm.active_component_index].watch.push(
                    {
                        "uuid": mm.selectedWatchComponentUuid,
                        "property": mm.selectedWatchFromProperty,
                        "send_to": mm.selectedWatchToProperty,
                        "transform_fn": mm.selectedWatchTransformFn
                    }
                )
                mm.selectedWatchComponentUuid     = null
                mm.selectedWatchFromProperty      = null
                mm.selectedWatchToProperty        = null
                mm.selectedWatchTransformFn        = null

                mm.refresh ++
                mm.updateAllFormCaches()
                mm.showSaveButton()

                mm.clearLinks()

            },
            getNextComponentid:                     function        () {
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
                return this.model.next_component_id++
            },
            addNewComponentPush:                    async function  () {
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
                //debugger
                let mm = this
                let activeComponent = mm.model.forms[mm.active_form].components[mm.active_component_index]
                let old_active_component_index = mm.active_component_index


                let componentToCreateType = mm.selectedPushComponentType


                let newName = componentToCreateType + "_" + this.model.next_component_id++
                //
                // create the component
                //
                await mm.addControl(
                    {
                        "leftX": 310,
                        "topY": 10,
                        "name": newName,
                        "base_component_id": componentToCreateType
                    })
                //mm.gotoDragDropEditor()
                //mm.selectComponentByName(newName)

                mm.linkComponents({
                    link_type:          "outgoing",

                    from_component:      activeComponent.name,
                    from_property:       mm.selectedPushFromProperty,

                    to_component:        newName,
                    to_property:         mm.selectedPushToProperty

                })
                mm.selectComponent(old_active_component_index, true)

            },
            addNewComponentWatch:                   async function  () {
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
                let mm = this
                let activeComponent = mm.model.forms[mm.active_form].components[mm.active_component_index]
                let old_active_component_index = mm.active_component_index
                let componentToCreateType = mm.selectedWatchComponentType


                let newName = componentToCreateType + "_" + this.model.next_component_id++
                //
                // create the component
                //
                await mm.addControl(
                    {
                        "leftX": 310,
                        "topY": 10,
                        "name": newName,
                        "base_component_id": componentToCreateType
                    }

                )
                //mm.gotoDragDropEditor()
                //mm.selectComponentByName(newName)

                mm.linkComponents({
                    link_type:          "incoming",

                    from_component:      newName,
                    from_property:       mm.selectedWatchFromProperty,

                    to_component:        activeComponent.name,
                    to_property:         mm.selectedWatchToProperty

                })
                mm.selectComponent(old_active_component_index, true)

            },
            showSaveButton:                         function        (event) {
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
                    type:   "pending"
                })
            },
            setWatchComponent:                      function        (event) {
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
                let type    = null

//debugger
                this.selectedWatchComponentUuid = event.target.value
                this.selectedWatchFromProperties = []
                let ccomp =  this.form_runtime_info[mm.active_form].component_lookup_by_uuid[this.selectedWatchComponentUuid]
                let ccomkeys = Object.keys(ccomp)
                for (let aaa =0; aaa<ccomkeys.length;aaa++) {
                    this.selectedWatchFromProperties.push(ccomkeys[aaa])
                }
            },
            setIncomingFormWatchComponent:          function        (event) {
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
                let type    = null


                //
                // if nothing is selected then set it all up
                //
                if (mm.linkSideSelected == "none") {
                    mm.linkSideSelected = "from";

                } else {

                }
                this.selectedWatchComponentUuid = event.target.value
                this.selectedWatchFromProperties = []
                let ccomp =  this.form_runtime_info[mm.active_form].component_lookup_by_uuid[this.selectedWatchComponentUuid]
                let Acttyoe = mm.model.forms[mm.active_form].components[mm.active_component_index].base_component_id
                let ccomkeys = Object.keys(GLOBALS.linkedProperties[Acttyoe].incoming.them[ccomp.base_component_id])
                for (let aaa =0; aaa<ccomkeys.length;aaa++) {
                    this.selectedWatchFromProperties.push(ccomkeys[aaa])
                }

//debugger



            },
            setWatchToProperty:                     function        (event) {
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
                this.selectedWatchToProperty = event.target.value
                this.toLinkPropertySelected = true

                if (mm.linkSideSelected == "none") {
                    mm.linkSideSelected = "to";

                } else {

                }

                //debugger
                if (mm.design_mode_pane.links_type == "form") {
                    if (mm.linkSideSelected == "to") {

                        mm.incoming_link_objects = []

                        let ccc = mm.model.forms[mm.active_form].components
                        for (   let ytr = ccc.length - 1;    ytr >= 0;    ytr--   ) {
                            let component = ccc[ytr]
                            let foundComponentType = component.base_component_id
                            if (GLOBALS.linkedProperties[mm.selected_link_component_type]) {
                                if (GLOBALS.linkedProperties[mm.selected_link_component_type].incoming.me) {
                                    if (GLOBALS.linkedProperties[mm.selected_link_component_type].incoming.me[this.selectedWatchToProperty]) {
                                        let foundComponentIncomingTree = GLOBALS.linkedProperties[mm.selected_link_component_type].incoming.me[this.selectedWatchToProperty][foundComponentType]

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
                } else if (mm.design_mode_pane.links_type == "create_new_component") {
//debugger

                    if (mm.linkSideSelected == "to") {
                        mm.incoming_link_component_types = []
                        let selectedObject = mm.model.forms[mm.active_form].components[mm.active_component_index]
                        let inTypes = GLOBALS.linkedProperties[selectedObject.base_component_id].incoming.them
                        //debugger
                        if (inTypes) {
                            let ooo = Object.keys(inTypes)
                            for (let ooobb of ooo) {

                                mm.incoming_link_component_types.push(ooobb)
                            }

                        }




                    }
                }
            },
            setWatchTransformFn:                    function        (event) {
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
                this.selectedWatchTransformFn = event.target.value
            },
            setPushTransformFn:                     function        (event) {
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
                this.selectedPushTransformFn = event.target.value
            },
            setWatchFromProperty:                   function        (event) {
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
                this.selectedWatchFromProperty = event.target.value


                if (mm.design_mode_pane.links_type == "form") {
                    this.fromLinkPropertySelected = true

                    if (mm.linkSideSelected == "from") {
                        this.selectedWatchToProperties = []
                        let ccomp2 =  mm.model.forms[mm.active_form].components[mm.active_component_index]
                        let activeComponenttype = ccomp2.base_component_id
                        if (  GLOBALS.linkedProperties[  activeComponenttype  ]  ) {
                            if (  GLOBALS.linkedProperties[  activeComponenttype  ].incoming  ) {
                                if (  GLOBALS.linkedProperties[  activeComponenttype  ].incoming.them  ) {
                                    let them =  this.form_runtime_info[mm.active_form].component_lookup_by_uuid[this.selectedWatchComponentUuid]
                                    if (  GLOBALS.linkedProperties[  activeComponenttype  ].incoming.them[  them.base_component_id  ]  ) {
                                        let ccomkeys2 = Object.keys(GLOBALS.linkedProperties[  activeComponenttype  ].incoming.them[  them.base_component_id  ][mm.selectedWatchFromProperty] )

                                        for (let aaa =0; aaa<ccomkeys2.length;aaa++) {
                                            this.selectedWatchToProperties.push(ccomkeys2[aaa])
                                        }
                                    }
                                }
                            }
                        }

                    }


                }
            },
            setPushComponentType:                   function        (event) {
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

                let ComponentType = event.target.value
                mm.selectedPushToProperties = []
                mm.selectedPushComponentType = ComponentType
                //
                let activecomp = mm.model.forms[mm.active_form].components[mm.active_component_index]


                if (mm.linkSideSelected == "from") {
                    if (GLOBALS.linkedProperties){
                        if (GLOBALS.linkedProperties[activecomp.base_component_id]){
                            if (GLOBALS.linkedProperties[activecomp.base_component_id].outgoing){
                                if (GLOBALS.linkedProperties[activecomp.base_component_id].outgoing.me){
                                    if (GLOBALS.linkedProperties[activecomp.base_component_id].outgoing.me[mm.selectedPushFromProperty] ) {
                                        if (GLOBALS.linkedProperties[activecomp.base_component_id].outgoing.me[mm.selectedPushFromProperty][ComponentType]) {
                                            let ccomkeys = Object.keys(GLOBALS.linkedProperties[activecomp.base_component_id].outgoing.me[mm.selectedPushFromProperty][ComponentType])
                                            for (let aaa =0; aaa<ccomkeys.length;aaa++) {
                                                this.selectedPushToProperties.push(ccomkeys[aaa])
                                            }
                                        }
                                    }
                                }

                            }
                        }
                    }
                }

            },
            //*** gen_end ***//

        }
    }
}
