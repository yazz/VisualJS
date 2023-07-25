{
    pipelineCode: async function() {
        methods:
        {
            //*** gen_start ***//

            // Load the list of controls available
            loadControlPalette:                     async function  (  ) {
                // This loads the controls for the control palette, which allows the user
                // to add buttons, labels, and other controls to their app
                let mm  = this
                let sql =
                    `select  
                        base_component_id,  
                        ipfs_hash,
                        logo_url
                    from  
                        yz_cache_released_components 
                    where 
                        component_type = 'component'`

                mm.available_components  = await callComponent(
                    { base_component_id:    "readFromInternalSqliteDatabase"}
                    ,
                    {   sql: sql  })

                let itemsToLoad = []
                for (let thiscc of mm.available_components) {
                    let cbase = thiscc.base_component_id
                    let codeId = thiscc.ipfs_hash
                    //console.log("Component: " + JSON.stringify(cbase))
                    itemsToLoad.push({baseComponentId: cbase, codeId: codeId })
                }
                await GLOBALS.makeSureUiComponentLoadedV6(itemsToLoad)
                //console.log("Time " + (ttq++) + ": " + (new Date().getTime()- startTime))
            },

            // related to updating component caches
            updateComponentMethods:                 function        (  ) {

                let mm = this

                // Set up all the form methods. For each form ...

                let forms = mm.getForms()
                for (let formIndex = 0; formIndex < forms.length; formIndex ++) {
                    let formName = forms[formIndex].name

                    // For each component in the form ...

                    for (let compenentInFormIndex = 0; compenentInFormIndex < mm.model.forms[formName].components.length ; compenentInFormIndex++ )
                    {

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
            refreshControlIndexes:                  function        (  ) {

                let mm = this
                if (mm.active_component_detail_name) {

                    let ccc = mm.model.forms[this.active_form].components
                    for (let ytr = 0;ytr < ccc.length;ytr++) {
                        if (this.active_component_detail_name == ccc[ytr].name) {
                            this.active_component_detail_name = ytr
                            break
                        }
                    }

                } else {
                    this.active_component_detail_name = null
                }

            },
            updateAllFormCaches:                    function        (  ) {

                if (typeof (this.inUpdateAllFormCaches) == 'undefined') {
                    this.inUpdateAllFormCaches = false
                }
                if (this.inUpdateAllFormCaches) {
                    return
                }
                this.inUpdateAllFormCaches = true

                this.watchList = []

                let llf = Object.keys(this.model.forms)
                for (let ii = 0; ii < llf.length ; ii ++) {
                    let formqq = this.model.forms[llf[ii]]
                    if (formqq != null) {
                        this.updateFormCache(formqq.name)
                    }
                }

                this.inUpdateAllFormCaches = false
            },
            updateFormCache:                        function        (  formName  ) {
                let mm          = this
                let form        = mm.model.forms[formName]
                let components  = form.components

                if (!isValidObject(mm.form_runtime_info[formName])) {
                    mm.form_runtime_info[formName] = new Object()
                }
                mm.form_runtime_info[formName].component_lookup_by_name         = {}
                mm.form_runtime_info[formName].component_lookup_by_uuid         = {}
                mm.form_runtime_info[formName].component_incoming_count_by_uuid = {}
                mm.form_runtime_info[formName].component_outgoing_count_by_uuid = {}

                for (let  cc  of  components) {
                    if (isValidObject(cc)) {
                        mm.form_runtime_info[formName].component_lookup_by_name[cc.name] = cc
                    }
                    if (!cc.uuid) {
                        cc.uuid = uuidv4()
                        mm.refresh ++
                    }
                    mm.form_runtime_info[formName].component_lookup_by_uuid[cc.uuid] = cc


                    if (!mm.watchList) {
                        mm.watchList = []
                    }
                    if (mm.watchList) {
                        if (cc.watch) {
                            for (let ff=0;ff<cc.watch.length;ff++){
                                mm.watchList.push(
                                    {
                                        form_name:                      formName,
                                        to_component_name:              cc.name,
                                        to_component_uuid:              cc.uuid,
                                        to_component_property_name:     cc.watch[ff].send_to,
                                        from_component_uuid:            cc.watch[ff].uuid,
                                        from_component_property_name:   cc.watch[ff].property,
                                        type:                           "watch",
                                        transform_fn:                   cc.watch[ff].transform_fn
                                    })


                                if (mm.form_runtime_info[formName].component_incoming_count_by_uuid[cc.uuid]) {
                                    mm.form_runtime_info[formName].component_incoming_count_by_uuid[cc.uuid] ++
                                } else {
                                    mm.form_runtime_info[formName].component_incoming_count_by_uuid[cc.uuid] = 1
                                }

                                if (mm.form_runtime_info[formName].component_outgoing_count_by_uuid[cc.watch[ff].uuid]) {
                                    mm.form_runtime_info[formName].component_outgoing_count_by_uuid[cc.watch[ff].uuid] ++
                                } else {
                                    mm.form_runtime_info[formName].component_outgoing_count_by_uuid[cc.watch[ff].uuid] = 1
                                }

                            }
                        }

                        if (cc.push) {
                            for (let ff=0;ff<cc.push.length;ff++){
                                mm.watchList.push(
                                    {
                                        form_name:                      formName,
                                        from_component_name:            cc.name,
                                        from_component_uuid:            cc.uuid,
                                        from_component_property_name:   cc.push[ff].property,
                                        to_component_uuid:              cc.push[ff].uuid,
                                        to_component_property_name:     cc.push[ff].send_to,
                                        type:                           "push",
                                        transform_fn:                   cc.push[ff].transform_fn
                                    })
                                if (mm.form_runtime_info[formName].component_incoming_count_by_uuid[cc.push[ff].uuid]) {
                                    mm.form_runtime_info[formName].component_incoming_count_by_uuid[cc.push[ff].uuid] ++
                                } else {
                                    mm.form_runtime_info[formName].component_incoming_count_by_uuid[cc.push[ff].uuid] = 1
                                }

                                if (mm.form_runtime_info[formName].component_outgoing_count_by_uuid[cc.uuid]) {
                                    mm.form_runtime_info[formName].component_outgoing_count_by_uuid[cc.uuid] ++
                                } else {
                                    mm.form_runtime_info[formName].component_outgoing_count_by_uuid[cc.uuid] = 1
                                }

                            }
                        }

                    }
                }
                mm.updateComponentMethods()
            },

            // Related to changes in the code
            addCodeChange:                          function        (  changeText  ) {

                //                /--------------------------------/
                //               /          addCodeChange         /
                //              /--------------------------------/
                //
                // This is called to try to keep a log of changes that has occurred on a commit

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
            changeComponentBaseId                                   (  args  ) {

            let mm = this

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
            changePropertyValue                                     (  args  ) {
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
            addComponent:                           async function  (  leftX  ,  topY  ,  data  ,  parentType  ,  parentName  ,  parentOffsetX  ,  parentOffsetY  ,  defProps  ) {
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
                await this.addComponentV2(leftX,topY,data, parentType, parentName, defProps)
            },
            addComponentV2:                         async function  (  leftX  ,  topY  ,  data  ,  parentType  ,  parentName  ,  defProps  ) {
                /*
                Adds a component to the form
                __________
                | PARAMS |______________________________________________________________
                |
                |     leftX   where to place this control
                |     -----
                |
                |     topY   where to place this control
                |     ----
                |
                |     data    {
                |     ----       base_component_id:  ...
                |     ----       code_id:            ...
                |                control:            controlDetails
                |             }
                |
                |
                |     parentType   Only used when adding a component to a container
                |     ----------
                |
                |     parentName   Only used when adding a component to a container
                |     ----------
                |
                |     defProps   Only used when adding a component to a container
                |     --------
                |
                |________________________________________________________________________ */
                let mm = this

                let promise = new Promise(async function(returnfn) {
                    let newItem = new Object()

                    /*
                    _______________________________________
                    |    addComponentV2                    |
                    |_________________                     |____________
                                     | Calculate the x,y coordinates of
                                     | the new component to be added.
                                     |__________________________________
                    */
                    newItem.leftX = Math.floor(leftX)
                    newItem.topY = Math.floor(topY)
                    if (newItem.leftX < 0) {
                        newItem.leftX = 0
                    }
                    if (newItem.topY < 0) {
                        newItem.topY = 0
                    }


                    /*
                    _______________________________________
                    |________________                      |____________
                                     | Calculate the name of
                                     | the new component
                                     |__________________________________
                    */
                    if (parentType) {
                        newItem.parent = parentName
                    }

                    if (data.control) {
                        newItem.name = data.control.name

                    } else {
                        newItem.name = data.base_component_id + "_" + mm.model.next_component_id++
                    }
                    newItem.base_component_id = data.base_component_id
                    newItem.code_id = data.code_id





                    /*
                    _______________________________________
                    |________________                      |____________
                                     | If the component isn't loaded
                                     | then load it
                                     |__________________________________
                    */
                    mm.refresh++
                    if (newItem.code_id) {
                        await GLOBALS.makeSureUiComponentLoadedV6([{codeId: newItem.code_id}])
                    } else {
                        await GLOBALS.makeSureUiComponentLoadedV6([newItem.base_component_id])
                        newItem.code_id = GLOBALS.getCommitIdForBaseComponentId( newItem.base_component_id )
                    }

                    //qqqDONE
                    //if (GLOBALS.isComponentTypeCached(newItem.base_component_id)) {
                    //    newItem.code_id = GLOBALS.getCommitIdForBaseComponentId( newItem.base_component_id )

                    //    let compEvaled = GLOBALS.getControlPropertyDefns({baseComponentId: newItem.base_component_id})
                    //if (isValidObject(compEvaled1)) {
                    //newItem.code_id = compEvaled1.code_id
                    //let compEvaled = compEvaled1.properties
                    let compEvaled = GLOBALS.getControlPropertyDefns({baseComponentId: newItem.base_component_id})
                    if (isValidObject(compEvaled)) {
                        for (let cpp = 0 ; cpp < compEvaled.length; cpp ++){
                            let prop = compEvaled[cpp].id

                            if (!isValidObject(newItem[prop])){
                                if (isValidObject(compEvaled[cpp].default)) {
                                    newItem[prop] = JSON.parse(JSON.stringify(compEvaled[cpp].default))
                                } else if (isValidObject(compEvaled[cpp].default_expression)){
                                    newItem[prop]  = eval("(" + compEvaled[cpp].default_expression + ")")
                                } else {
                                    newItem[prop] = ""
                                }
                            }
                        }
                    }


                    if (data.control) {
                        let allKeys = Object.keys(data.control)
                        for (let tt=0;tt<allKeys.length;tt++) {
                            let propName  = allKeys[tt]
                            let propValue = data.control[propName]
                            newItem[propName] = propValue
                        }
                    }



                    if (!isValidObject(newItem.width)) {
                        newItem.width = 100
                    }
                    if (!isValidObject(newItem.height)) {
                        newItem.height = 100
                    }

                    if ((newItem.leftX + newItem.width)
                        > mm.model.forms[mm.active_form].width) {
                        newItem.leftX = Math.floor(mm.model.forms[mm.active_form].width - newItem.width)
                    }
                    if ((newItem.topY + newItem.height)
                        > mm.model.forms[mm.active_form].height) {
                        newItem.topY = Math.floor(mm.model.forms[mm.active_form].height - newItem.height)
                    }


                    if (isValidObject(   defProps   )) {
                        let oo = Object.keys(defProps)
                        for (  let ee = 0  ;  ee < oo.length ;  ee++  ) {
                            let propName = oo[ee]
                            let propValue = defProps[propName]
                            newItem[propName] = propValue
                        }
                    }

                    mm.model.forms[mm.active_form].components.push(newItem)
                    mm.active_component_index = mm.model.forms[mm.active_form].components.length - 1

//debugger
                    //qqqDONE
                    let compCode = GLOBALS.getCodeForComponent({baseComponentId: newItem.base_component_id})
                    let childrenCode  = yz.helpers.getValueOfCodeString(compCode, "children",")//children")
                    if (isValidObject(childrenCode)) {
                        for (  let ee = 0  ;  ee < childrenCode.length ;  ee++  ) {
                            let childBaseId = childrenCode[ee].base_component_id
                            let childDefProps = childrenCode[ee].properties
                            debugger
                            await mm.addComponentV2(    0 ,
                                0 ,
                                {base_component_id: childBaseId} ,
                                newItem.base_component_id ,
                                newItem.name ,
                                childDefProps )
                        }
                    }




                        mm.updateAllFormCaches()
                        let selectParent = false
                        let parentItemIndex = null
                        if (isValidObject(newItem.parent)) {
                            let parentItem = mm.form_runtime_info[mm.active_form].component_lookup_by_name[newItem.parent]

                            if (isValidObject(parentItem.select_parent_when_child_added) &&
                                (parentItem.select_parent_when_child_added == true)) {

                                selectParent = true
                                let ccc = mm.model.forms[mm.active_form].components
                                for (let ytr = 0;ytr < ccc.length;ytr++) {
                                    if (parentItem.name == ccc[ytr].name) {
                                        parentItemIndex = ytr
                                        break
                                    }
                                }
                            }
                        }



                        if (selectParent) {
                            mm.selectComponent(parentItemIndex, true)
                        } else {
                            mm.selectComponent(mm.active_component_index, true)
                        }
                        mm.refresh ++


                        let newComponent = mm.lookupComponentOnForm({componentName: newItem.name})
                        mm.addCodeChange("Add component: " + newItem.name + "(" + newItem.base_component_id + ")")
                        returnfn(newComponent)
                        //returnfn(null)


                })
                let ret = await promise
                return ret
            },
            selectComponentByName:                  function        (  compName  ) {
                /*
                ________________________________________
                |                                      |
                |           selectComponentByName      |
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
                    mm.selectComponent(parentItemIndex, true)
                }
                return null
            },
            addControl:                             async function  (  controlDetails  ) {
                /*
                ________________________________________
                |              addControl              |
                |______________________________________|
                Adds a control to the page. eg:

                await mm.addControl(
                {
                    "leftX": 310,
                    "topY": 10,
                    "name": "mycontrol",
                    "base_component_id": "button_control"
                })

                This function really seems to be a helper function for the more complex
                "addComponentV2" function

                __________
                | Params |
                |        |______________________________________________________________
                |
                |     controlDetails:
                |________________________________________________________________________ */
                let mm = this
                let newControl = await mm.addComponentV2( 10,
                    10,
                    {
                        base_component_id: controlDetails.base_component_id
                        ,
                        control: controlDetails
                    },
                    controlDetails.parent_base_component_id,
                    controlDetails.parent_name,
                    [])
                mm.highlighted_control          = null
                mm.highlighted_control_code_id  = null
                mm.updateAllFormCaches()
                mm.refresh ++

                return newControl
            },
            editAsCode:                             async function  (  { app_selected , active_form , active_component_index , property_id }  ) {

                // This is called when the "..." button is pressed for
                // a property in the property inspector
                //
                // This opens a mini text editor and can show code for app events,
                // forms, and for controls


                // if the code editor is already open then close it

                let mm = this
                if (mm.ui_code_editor) {
                    if (mm.ui_code_editor.completer) {
                        mm.ui_code_editor.completer.detach()
                    }
                    mm.ui_code_editor.destroy()
                    mm.ui_code_editor = null
                }




                // Set up the new code editor

                setTimeout(function(){
                    mm.design_mode_pane.type                    = "event_editor"
                    mm.design_mode_pane.app_selected            = app_selected
                    mm.design_mode_pane.active_form             = active_form
                    mm.design_mode_pane.active_component_index  = active_component_index
                    mm.design_mode_pane.property_id             = property_id
                    yz.mainVars.disableAutoSave                 = true

                    setTimeout(function(){
                        if (document.getElementById('ui_code_editor') && (mm.ui_code_editor == null)) {

                            //set up the ace editor for the timeline view

                            ace.config.set('basePath', '/');
                            mm.ui_code_editor = ace.edit(
                                "ui_code_editor"
                                ,
                                {
                                    selectionStyle:  "text",
                                    mode:            "ace/mode/javascript"
                                })





                            //Hack city! Need a delay when setting theme or view is corrupted

                            setTimeout(function(){
                                mm.ui_code_editor.setTheme("ace/theme/sqlserver");
                            },100)




                            // Stylize the code editor

                            document.getElementById("ui_code_editor").style["font-size"]    = "16px"
                            document.getElementById("ui_code_editor").style.width           = "100%"
                            document.getElementById("ui_code_editor").style.border          = "0px solid #2C2828"
                            document.getElementById("ui_code_editor").style.height          = "55vh"



                            // Get the code and store it in "ccode"
                            //
                            // The code is obtained from the VueJS model, depending on whether
                            // it is a control, a form, or application code

                            let ccode = ""

                            // application code (THIS MUST BE FIST IN THE IF STATEMENT)
                            if (property_id && mm.model[property_id] && isValidObject(mm.model[property_id].fn)) {
                                ccode = mm.model[property_id].fn
                            } else if (mm.model.app_selected) {
                                ccode = mm.model[property_id]


                            // form code
                            } else if ((mm.active_component_index == null) && (mm.active_form != null)) {
                                ccode = mm.model.forms[mm.active_form][property_id]

                            // component code
                            } else if ((mm.active_component_index != null) && (mm.active_form != null)) {
                                ccode = mm.model.forms[mm.active_form].components[mm.active_component_index][property_id]
                            }



                            if (!isValidObject(ccode)) {
                                ccode = ""
                            }


                            mm.ui_code_editor.getSession().setValue(ccode);
                            mm.ui_code_editor.getSession().setUseWorker(false);

                            mm.ui_code_editor.on("change", function(e) {
                                let newC = mm.ui_code_editor.getValue()
                                try {
                                    //
                                    // hack city: we add the new line as otherwise an error on the last
                                    // line generates an error  during code entry time, which we can detect
                                    // below by only flagging an error if the line exists within the typed
                                    // code
                                    //
                                    let newNode = esprima.parse("(async function(){" + newC + "\n})", { tolerant: true })
                                    //alert(JSON.stringify(newNode.errors, null, 2))
                                    mm.errors = newNode.errors
                                    if (mm.errors) {
                                        if (mm.errors.length == 0) {
                                            mm.errors = null
                                        } else {
                                            mm.errors = mm.errors[0]
                                        }
                                    }

                                } catch (e) {
                                    if (e.lineNumber) {
                                        let newC = mm.ui_code_editor.getValue()
                                        let lineCount =  newC.split(/\r\n|\r|\n/).length
                                        if (e.lineNumber > lineCount) {
                                            mm.errors = null
                                        } else {
                                            mm.errors = e
                                        }
                                    } else {
                                        mm.errors = null
                                    }

                                } finally {

                                }



                                if (property_id && mm.model[property_id] && isValidObject(mm.model[property_id].fn)) {
                                    mm.model[property_id].fn = newC
                                } else if (app_selected) {
                                    mm.model[property_id] = newC
                                } else if ((mm.active_component_index == null) && (mm.active_form != null)) {
                                    mm.model.forms[mm.active_form][property_id] = newC

                                } else if ((mm.active_component_index != null) && (mm.active_form != null)) {
                                    mm.model.forms[mm.active_form].components[mm.active_component_index][property_id] = newC
                                }
                                mm.$root.$emit('message', {
                                    type:   "pending"
                                })
                            })

                            mm.updateAllFormCaches()
                            mm.setupCodeAutocompletions()

                            mm.ui_code_editor.focus();
                        }
                    },100)
                },100)


                mm.setupCodeEditorSelectors(property_id)

            },
            setVBEditorPropertyValue:               function        (  property  ,  val  ) {
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
            setVBEditorProperty:                    function        (  event  ,  property  ) {
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
            getVBEditorProperty:                    function        (  property  ) {
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
            addProperty:                            function        (  ) {

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
            addPropertySave:                        function        (  ) {

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
            addPropertyCancel:                      function        (  ) {

                let mm = this
                mm.add_property = false
            },
            recalcControlPropertyLinksAvailableInUI:                   async function  (  ) {

                let mm                      = this
                mm.incoming_link_objects    = []

                let ccc = mm.model.forms[mm.active_form].components
                for (   let ytr = ccc.length - 1;    ytr >= 0;    ytr--   ) {
                    let component = ccc[ytr]
                    if (component) {
                        let foundComponentType = component.base_component_id
                        if (foundComponentType) {

                            if (yz.componentsImplementation.treeOfPossibleControlPropertyLinks[mm.selected_link_component_type]) {
                                if (yz.componentsImplementation.treeOfPossibleControlPropertyLinks[mm.selected_link_component_type].incoming) {
                                    if (yz.componentsImplementation.treeOfPossibleControlPropertyLinks[mm.selected_link_component_type].incoming.them) {
                                        let foundComponentIncomingTree = yz.componentsImplementation.treeOfPossibleControlPropertyLinks[mm.selected_link_component_type].incoming.them[foundComponentType]
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


                mm.outgoing_link_objects = []

                for (   let ytr = ccc.length - 1;    ytr >= 0;    ytr--   ) {
                    let component = ccc[ytr]
                    if (component) {
                        let foundComponentType = component.base_component_id
                        if (yz.componentsImplementation.treeOfPossibleControlPropertyLinks[mm.selected_link_component_type]) {
                            if (yz.componentsImplementation.treeOfPossibleControlPropertyLinks[mm.selected_link_component_type].outgoing) {
                                if (yz.componentsImplementation.treeOfPossibleControlPropertyLinks[mm.selected_link_component_type].outgoing.them) {
                                    let foundComponentIncomingTree = yz.componentsImplementation.treeOfPossibleControlPropertyLinks[mm.selected_link_component_type].outgoing.them[foundComponentType]
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
                        if (yz.componentsImplementation.treeOfPossibleControlPropertyLinks[typeSelected]) {
                            if (yz.componentsImplementation.treeOfPossibleControlPropertyLinks[typeSelected].outgoing) {
                                if (yz.componentsImplementation.treeOfPossibleControlPropertyLinks[typeSelected].outgoing.me) {
                                    if (yz.componentsImplementation.treeOfPossibleControlPropertyLinks[typeSelected].outgoing.me) {
                                        //debugger
                                        let ccomp2 =  yz.componentsImplementation.treeOfPossibleControlPropertyLinks[typeSelected].outgoing.me
                                        let ccomkeys2 = Object.keys(ccomp2)
                                        for (let aaa =0; aaa<ccomkeys2.length;aaa++) {
                                            let typeExists = false

                                            let ccc = mm.model.forms[mm.active_form].components
                                            for (   let ytr =  0;    ytr < ccc.length;    ytr++   ) {
                                                let component = ccc[ytr]
                                                if (component) {
                                                    if (yz.componentsImplementation.treeOfPossibleControlPropertyLinks[typeSelected].outgoing.them[component.base_component_id]) {
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
                            if (yz.componentsImplementation.treeOfPossibleControlPropertyLinks[typeSelected]) {
                                if (yz.componentsImplementation.treeOfPossibleControlPropertyLinks[typeSelected].outgoing) {
                                    if (yz.componentsImplementation.treeOfPossibleControlPropertyLinks[typeSelected].outgoing.me) {
                                        if (yz.componentsImplementation.treeOfPossibleControlPropertyLinks[typeSelected].outgoing.me) {
                                            let ccomp2 =  yz.componentsImplementation.treeOfPossibleControlPropertyLinks[typeSelected].outgoing.me
                                            let ccomkeys2 = Object.keys(ccomp2)
                                            for (let aaa =0; aaa<ccomkeys2.length;aaa++) {
                                                mm.selectedPushFromProperties.push(ccomkeys2[aaa])
                                            }

                                        }
                                    }

                                }

                            }
                        }

                    } else if (mm.design_mode_pane.direction == "incoming") {
                        mm.selectedWatchToProperties = []
                        let typeSelected = this.model.forms[this.active_form].components[this.active_component_links_index].base_component_id
                        if (yz.componentsImplementation.treeOfPossibleControlPropertyLinks[typeSelected]) {
                            if (yz.componentsImplementation.treeOfPossibleControlPropertyLinks[typeSelected].incoming) {
                                if (yz.componentsImplementation.treeOfPossibleControlPropertyLinks[typeSelected].incoming.me) {
                                    let ccomp2 =  yz.componentsImplementation.treeOfPossibleControlPropertyLinks[typeSelected].incoming.me
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
            deleteComponent:                        async function  (  index  ) {
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
            deleteComponentByName:                  async function  (  thisComponentName  ) {
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
            childDeleteComponent:                   function        (  index  ) {
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
            childSelectComponent:                   function        (  index  ) {
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
            addForm:                                function        (  ) {
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
            deleteField:                            function        (  fieldId  ) {
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


            // helper fns
            getEditor:                              function        (  ) {
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
            lookupComponent:                        function        (  componentName  ) {
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
            lookupComponentOnForm:                  function        (  lookupArgs  ) {
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
            getNextComponentid:                     function        (  ) {
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
            showSaveButton:                         function        (  event  ) {
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
            getControlNonAsyncMethod:               function        (  componentDetails  ,  isComponentInDesignMode  ,  methodId  ) {
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
                return function(arg1,arg2,arg3,arg4,arg5,arg6,arg7,arg8,arg9,arg10) {
                    let me = componentDetails
                    let parent = null
                    if (me.parent) {
                        parent = mm.form_runtime_info[mm.active_form].component_lookup_by_name[me.parent]
                    }

                    let retv =  null
                    let fnDetails       = null
                    let controlDetails = null
                    if (isComponentInDesignMode) {
                        controlDetails = yz.componentsAPI.vue.getDesignModeUiControlNameReturnsVueInstance({controlName: componentDetails.name})
                    } else {
                        controlDetails = yz.componentsAPI.vue.getRuntimeUiControlNameReturnsVueInstance({controlName: componentDetails.name})
                    }
                    fnDetails = controlDetails[methodId]
                    retv =  fnDetails(arg1,arg2,arg3,arg4,arg5,arg6,arg7,arg8,arg9,arg10)


                    return retv
                }
            },
            getControlAsyncMethod:                  function        (  componentDetails  ) {
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
                return async function (arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10) {
                    let me = componentDetails
                    let parent = null
                    if (me.parent) {
                        parent = mm.form_runtime_info[mm.active_form].component_lookup_by_name[me.parent]
                    }

                    let fnDetails = null
                    if (isValidObject(methodFn)) {
                        let thecode =
                            `(async function(arg1,arg2,arg3,arg4,arg5,arg6,arg7,arg8,arg9,arg10) {
                    ${methodFn}
                    })`

                        fnDetails = eval(thecode)

                    } else {
                        let controlDetails = null
                        if (isComponentInDesignMode) {
                            controlDetails = yz.componentsAPI.vue.getDesignModeUiControlNameReturnsVueInstance({controlName: componentDetails.name})
                        } else {
                            controlDetails = yz.componentsAPI.vue.getRuntimeUiControlNameReturnsVueInstance({controlName: componentDetails.name})
                        }
                        fnDetails = controlDetails[methodId]
                    }
                    let retv = await fnDetails(arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10)


                    return retv
                }
            },
            getControlMethod:                       function        (  componentDefn  ,  componentDetails  ) {
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
                let mm                      = this
                let methodId                = componentDefn.id
                let methodFn                = componentDefn.fn
                let isAsync                 = true
                let isComponentInDesignMode = mm.design_mode



                if (!isValidObject(methodFn)) {
                    let allProps = GLOBALS.getControlPropertyDefns({baseComponentId: componentDetails.base_component_id})
                    if (allProps) {
                        for (let i=0;i<allProps.length;i++) {
                            let thisProp = allProps[i]
                            if (thisProp.id == methodId) {
                                if (thisProp.async) {
                                    isAsync = true
                                } else {
                                    isAsync = false
                                }
                            }
                        }
                    }
                }

                //   async
                if (isAsync || isValidObject(methodFn)){

                    return mm.getControlAsyncMethod(componentDetails, isComponentInDesignMode, methodId)

                    //   NOT async
                } else {

                    return mm.getControlNonAsyncMethod(componentDetails, isComponentInDesignMode, methodId)

                }

            },
            getFormMethod:                          function        (  formName  ,  formprop  ) {
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
                return async function(arg1,arg2,arg3,arg4,arg5,arg6,arg7,arg8,arg9,arg10) {
                    let formDetails = mm.model.forms[formName]
                    let thecode =
                        `(async function(arg1,arg2,arg3,arg4,arg5,arg6,arg7,arg8,arg9,arg10) {
${formprop.fn}
})`

                    fnDetails = eval(thecode)
                    let retv = await fnDetails(arg1,arg2,arg3,arg4,arg5,arg6,arg7,arg8,arg9,arg10)

                    return retv
                }

            },
            getAppMethod:                           function        (  propDetailsId  ) {
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
                return async function(arg1,arg2,arg3,arg4,arg5,arg6,arg7,arg8,arg9,arg10) {

                    let origCode = mm.model[propDetailsId]
                    let thecode =
                        `(async function(arg1,arg2,arg3,arg4,arg5,arg6,arg7,arg8,arg9,arg10) {
${origCode}
})`

                    fnDetails = eval(thecode)
                    let retv = await fnDetails(arg1,arg2,arg3,arg4,arg5,arg6,arg7,arg8,arg9,arg10)


                    return retv
                }

            },
            deleteCursor:                           function        (  ) {
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
                document.getElementById(this.vb_grid_element_id).style.cursor = "crosshair"
                document.getElementById("grid_container").style.cursor = "default"
                if (this.oldCursor) {
                    this.cursorSource.style.cursor = this.oldCursor
                    this.oldCursor = null
                    this.cursorSource = null
                    this.newCursor = null
                }
            },
            switchCursor:                           function        (  event  ,  oldCursor  ,  newCursor  ) {
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

                mm.cursorSource              = event.target
                mm.cursorSource.style.cursor = newCursor
                mm.newCursor                 = newCursor
                mm.oldCursor                 = oldCursor

                document.getElementById(mm.vb_grid_element_id).style.cursor = newCursor
                document.getElementById("grid_container").style.cursor = newCursor


            },
            clickOnMainGrid:                        async function  (  event  ) {
                if (this.design_mode)
                {
                    event.stopPropagation();
                    if (this.highlighted_control)
                    {
                        let doc             = document.documentElement;
                        let left            = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
                        let top             = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);
                        let rrr             = event.target.getBoundingClientRect()
                        let offsetX         = (event.clientX - rrr.left )
                        let offsetY         = (event.clientY - rrr.top )
                        let parentType      = null
                        let parentName      = null
                        let parentOffsetX   = 0
                        let parentOffsetY   = 0
                        let newItem2        = new Object()
                        let data            = {
                                                type:              "add_component",
                                                base_component_id:  this.highlighted_control,
                                                code_id:            this.highlighted_control_code_id,
                                                offsetX:            offsetX,
                                                offsetY:            offsetY
                                            }

                        let parentContainer = this.getContainerForPoint(  offsetX,  offsetY  )
                        if (parentContainer) {
                            parentOffsetX = parentContainer.x
                            parentOffsetY = parentContainer.y
                            parentType      = parentContainer.base_component_id
                            parentName    = parentContainer.name
                        }

                        await this.addComponentV2(  offsetX,
                            offsetY,
                            data,
                            parentType,
                            parentName,
                            [])

                        this.highlighted_control            = null
                        this.highlighted_control_code_id    = null

                    } else {
                        this.selectForm(this.active_form, true);
                    }
                }

            },
            getContainerForPoint:                   function        (  leftX  ,  topY  ) {
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

                let ccc = this.model.forms[this.active_form].components
                for (let ytr = 0;ytr < ccc.length;ytr++){
                    let baseId =    ccc[ytr].base_component_id
                    let controlNmae =    ccc[ytr].name
                    let x1 =        ccc[ytr].leftX
                    let x2 =        ccc[ytr].leftX + ccc[ytr].width
                    let y1 =        ccc[ytr].topY
                    let y2 =        ccc[ytr].topY + ccc[ytr].height
                    let isContainer = ccc[ytr].is_container
                    if (isContainer && (x1 <= leftX) && (leftX <= x2) && (y1 <= topY) && (topY <= y2)) {
                        return {
                            x:                  x1,
                            y:                  y1,
                            base_component_id:  ccc[ytr].base_component_id,
                            name:               ccc[ytr].name
                        }
                    }
                }
                return null
            },
            getControlByName:                       function        (  controlName) {
                /*
                ________________________________________
                |                                      |
                |          getControlByName            |
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
                let control = mm.model.forms.Form_1.components[controlName]
                for (let tt=0;tt<mm.model.forms.Form_1.components.length;tt++) {
                    if (mm.model.forms.Form_1.components[tt].name == controlName) {
                        return mm.model.forms.Form_1.components[tt]
                    }
                }
                return null
            },
            hasMoreDetailsUi:                       function        (  formName  ,  componentIndex  ) {
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
                let component = mm.model.forms[formName].components[componentIndex]
                if (isValidObject(component.parent)) {
                    let ccc = mm.model.forms[formName].components
                    for (let ytr = 0;ytr < ccc.length;ytr++) {
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
            },
            isVisible:                              function        (  formName  ,  componentIndex  ) {
                let mm = this
                let component = mm.model.forms[formName].components[componentIndex]
                if (!component) {
                    return false
                }
                if (component.hidden) {
                    return false
                }

                if (isValidObject(component.parent)) {
                    let ccc = mm.model.forms[formName].components
                    for (let ytr = 0;ytr < ccc.length;ytr++) {
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
            },
            getLeft:                                function        (  formName  ,  componentIndex  ) {
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
                let component = mm.model.forms[formName].components[componentIndex]
                if (!component) {
                    return 0
                }
                let left = component.leftX

                if (isValidObject(component.parent)) {
                    let ccc = mm.model.forms[formName].components
                    for (let ytr = 0;ytr < ccc.length;ytr++){
                        if (component.parent == ccc[ytr].name) {
                            left = left + ccc[ytr].leftX
                            break
                        }
                    }
                }


                return left
            },
            getTop:                                 function        (  formName  ,  componentIndex  ) {
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
                let component = mm.model.forms[formName].components[componentIndex]
                if (!component) {
                    return 0
                }
                let top = component.topY
                if (isValidObject(component.parent)) {
                    let ccc = mm.model.forms[formName].components
                    for (let ytr = 0;ytr < ccc.length;ytr++){
                        if (component.parent == ccc[ytr].name) {
                            top = top + ccc[ytr].topY
                            break
                        }
                    }
                }
                return top
            },
            getChildren:                            function        (  itemName  ) {
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
                let ccc = mm.model.forms[mm.active_form].components
                let chh = []
                for (let ytr = 0;ytr < ccc.length;ytr++){
                    if (ccc[ytr].parent == itemName) {
                        ccc[ytr].index_in_parent_array = ytr
                        chh.push(ccc[ytr])
                    }
                }
                return chh
            },
            previewUpload:                          function        (  property  ) {
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
                let mm = this;
                let file    = document.getElementById('image_file').files[0];
                let reader  = new FileReader();

                reader.addEventListener("load", function () {
                    mm.model.forms[mm.active_form].components[mm.active_component_index][property.id] = reader.result
                    mm.refresh ++
                }, false);

                if (file) {
                    reader.readAsDataURL(file);
                }
            },
            previewFileUpload:                      function        (  property  ) {
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
                let mm = this;
                let file    = document.getElementById('upload_file').files[0];
                let reader  = new FileReader();

                reader.addEventListener("load", function () {
                    mm.model.forms[mm.active_form].components[mm.active_component_index][property.id] = reader.result
                    mm.refresh ++
                }, false);

                if (file) {
                    reader.readAsDataURL(file);
                }
            },
            showHelp:                               async function  (  aa  ) {
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


                if (this.ui_code_editor) {
                    if (mm.ui_code_editor.completer) {
                        mm.ui_code_editor.completer.detach()
                    }
                    mm.ui_code_editor.destroy()
                    mm.ui_code_editor = null

                    // ------------------ HACK CITY! -------------------------
                    // we need this line as otherwise the ace editor isnt always destroyed
                    // properly (related to deletion of the Ace editor parent nodes in Vue)
                    mm.design_mode_pane.type = null
                    // -------------------------------------------------------
                }

                setTimeout(function(){
                    mm.active_component_detail_name = null
                    mm.active_component_detail_index = null
                    mm.active_component_links_name = null
                    mm.active_component_links_index = null
                    mm.design_mode_pane.type = "help"
                    mm.design_mode_pane.help = aa.help
                    mm.refresh++
                },200)
            },
            selectFilePath:                         async function  (  aa  ) {
                // -----------------------------------------------------
                //                     selectFilePath
                //
                // This is called when the "..." button is pressed for
                // a File Path property in the property inspector
                //
                // -----------------------------------------------------
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
                // if the code editor is already open then close it
                //

                let mm = this
                mm.gotoDragDropEditor()

                if (mm.ui_code_editor) {
                    if (mm.ui_code_editor.completer) {
                        mm.ui_code_editor.completer.detach()
                    }
                    mm.ui_code_editor.destroy()
                    mm.ui_code_editor = null
                }




                //
                // Set up the new code editor
                //

                setTimeout(function(){
                    mm.design_mode_pane.type                   = "file_path_selector"
                    mm.design_mode_pane.app_selected           = aa.app_selected
                    mm.design_mode_pane.active_form            = aa.active_form
                    mm.design_mode_pane.active_component_index = aa.active_component_index
                    mm.design_mode_pane.property_id            = aa.property_id
                    mm.file_exts                               = aa.file_exts

                    setTimeout(function(){
                        mm.openFile()
                    },100)
                },100)


            },
            gotoLine:                               function        (  line  ) {
                this.ui_code_editor.gotoLine(line , 10, true);
            },
            setupCodeAutocompletions:               function        (  ) {

                // This is called when editing event code to autocomplete
                // form names, control names, and methods

                let mm          = this
                let langTools   = ace.require("ace/ext/language_tools");



                // Clear any default auto-completers that have been set

                langTools.setCompleters([]);


                // Create the autocompleter

                let autocompleterFunction = {
                    identifierRegexps: [/[a-zA-Z_0-9.]/]
                    ,

                    // The "getCompletions" callback is called every time the user
                    // presses a key in the editor. So for example they may type
                    // "Form_1" follow by the "." key, which caused this to be called

                    getCompletions: function(editor, session, pos, prefix, callback) {

                        // If no text entered then do nothing

                        if (prefix.length === 0) {
                            callback(null, []);
                            return
                        }



                        // Get the first part of the text that the user entered, before the
                        // ".", for example, "Form_1." would return "Form_1"

                        let textBeforeFirstDot = null
                        let textBeforeSecondDot = null
                        if (prefix.indexOf(".") != -1) {
                            textBeforeFirstDot = prefix.substring(0,prefix.indexOf("."))
                            //console.log("textBeforeFirstDot: " + textBeforeFirstDot)
                            let textAfterFirstDot = prefix.substring(prefix.indexOf(".") + 1)
                            if (textAfterFirstDot.indexOf(".") != -1) {
                                textBeforeSecondDot = textAfterFirstDot.substring(0,textAfterFirstDot.indexOf("."))
                            }
                        }


                        let wordList = []

                        // Create the list of initial objects to complete:
                        // app, forms, controls

                        if (textBeforeFirstDot == null) {

                            wordList.push(  {
                                                "word":         "app",
                                                "freq":         24,
                                                "score":        300,
                                                "flags":        "bc",
                                                "syllables":    "1",
                                                meta:           "Main application"
                                            })

                            wordList.push(  {
                                                "word":         "forms",
                                                "freq":         24,
                                                "score":        300,
                                                "flags":        "bc",
                                                "syllables":    "1",
                                                meta:           "List of forms"
                                            })

                            if (mm.design_mode_pane.app_selected) {
                                wordList.push(  {
                                                    "word":         "me",
                                                    "freq":         24,
                                                    "score":        300,
                                                    "flags":        "bc",
                                                    "syllables":    "1",
                                                    meta:           "The current app"
                                                })

                            } else if (mm.design_mode_pane.active_component_index == null) {
                                wordList.push(  {
                                                    "word":         "me",
                                                    "freq":         24,
                                                    "score":        300,
                                                    "flags":        "bc",
                                                    "syllables":    "1",
                                                    meta:           "The current form"
                                                })

                            } else {
                                wordList.push(  {
                                                    "word":         "me",
                                                    "freq":         24,
                                                    "score":        300,
                                                    "flags":        "bc",
                                                    "syllables":    "1",
                                                    meta:           "The current control"
                                                })
                                wordList.push(  {
                                                    "word":         "myForm",
                                                    "freq":         24,
                                                    "score":        300,
                                                    "flags":        "bc",
                                                    "syllables":    "1",
                                                    meta:           "The current form"
                                                })
                            }

                            wordList.push(  {
                                                "word":        "parent",
                                                "freq":         24,
                                                "score":        300,
                                                "flags":        "bc",
                                                "syllables":    "1",
                                                meta:           "The parent/container control of this"
                                            })

                            let ccc = mm.model.forms[mm.active_form].components
                            for (   let ytr = ccc.length - 1;    ytr >= 0;    ytr--   ) {
                                let component = ccc[ytr]
                                wordList.push(  {
                                                    "word":         component.name,
                                                    "freq":         24,
                                                    "score":        300,
                                                    "flags":        "bc",
                                                    "syllables":    "1",
                                                    meta:           "Control"
                                                })
                            }

                            ccc = Object.keys(mm.model.forms)
                            for (   let ytr = ccc.length - 1;    ytr >= 0;    ytr--   ) {
                                wordList.push(  {
                                                    "word":         ccc[ytr],
                                                    "freq":         24,
                                                    "score":        300,
                                                    "flags":        "bc",
                                                    "syllables":    "1",
                                                    meta:           "Form"
                                                })
                            }



                            // If we have entered an object and pressed "." (period)
                            // then we need to add the method that comes after the
                            // period, eg:
                            //
                            // my_label.set|
                            //         .setText()
                            //         .setWidth()    <- choose one
                            //         .setHeight()

                        } else {

                            //
                            // Find out what the left hand side of the "." represents. Is
                            // it a component, a form, or the app?
                            //

                            let componentId = null
                            let formName    = null
                            let isApp       = false



                            if (textBeforeFirstDot == "me") {

                                if (mm.design_mode_pane.app_selected) {

                                } else if (isValidObject(mm.design_mode_pane.active_component_index)) {
                                    componentId = mm.model.forms[mm.active_form].components[ mm.design_mode_pane.active_component_index ].base_component_id

                                } else if (isValidObject(mm.design_mode_pane.active_form)) {
                                    formName = mm.active_form
                                }

                            } else if (textBeforeFirstDot == "myForm") {

                                formName = mm.active_form

                            } else if (textBeforeFirstDot == "parent") {

                                if (mm.design_mode_pane.app_selected) {

                                } else if (isValidObject(mm.design_mode_pane.active_component_index)) {
                                    let parentId = mm.model.forms[mm.active_form].components[ mm.design_mode_pane.active_component_index ].parent
                                    if (isValidObject(parentId)) {
                                        componentId = mm.form_runtime_info[mm.active_form].component_lookup_by_name[parentId].base_component_id
                                    }

                                } else if (isValidObject(mm.design_mode_pane.active_form)) {
                                }

                            } else if (textBeforeFirstDot == "app") {

                                isApp = true

                            } else {

                                // see if the word is a component

                                let comps       = mm.model.forms[mm.active_form].components

                                for (let rt=0; rt < comps.length; rt++) {
                                    if (comps[rt].name == textBeforeFirstDot) {
                                        componentId = comps[rt].base_component_id
                                    }
                                }


                                // see if the word is a form

                                let formNames       = Object.keys(mm.model.forms)

                                for (let rt=0; rt < formNames.length; rt++) {
                                    let formName1 = formNames[rt]
                                    if (formName1 == textBeforeFirstDot) {
                                        formName = formName1
                                    }
                                }


                            }



                            // if the left hand side of what the user entered was a
                            // control name

                            if (componentId) {
                                let controlProperties = mm.getControlProperties(componentId)
                                for (let fg=0;fg < controlProperties.length;fg++){
                                    let comm = controlProperties[fg]
                                    let propName = textBeforeFirstDot + "." + comm.id
                                    let meta = "Property"
                                    if (isValidObject(comm.snippet)) {
                                        propName = textBeforeFirstDot + "." + comm.snippet
                                    }
                                    if (isValidObject(comm.pre_snippet)) {
                                        propName = comm.pre_snippet + propName
                                    }
                                    if (comm.type == "Action") {
                                        meta = "Method"
                                    }

                                    let addProp = true
                                    if (comm.type == "Event") {
                                        addProp = false
                                    }

                                    if (addProp) {
                                        wordList.push(  {
                                                            "word":         propName ,
                                                            "freq":         24,
                                                            "score":        300,
                                                            "flags":        "bc",
                                                            "syllables":    "1",
                                                            "meta":         meta
                                                        })
                                    }
                                }




                            // if a form was entered

                            } else if (formName) {
                                if (!textBeforeSecondDot) {
                                    // Add form.PROPERTY_NAME

                                    let formProps = mm.getFormProperties(formName)
                                    for (let formPropIndex = 0 ; formPropIndex < formProps.length ; formPropIndex++ ) {

                                        let propDetails = formProps[formPropIndex]
                                        let propName    = textBeforeFirstDot + "." + propDetails.id
                                        let meta        = "Property"

                                        if (isValidObject(propDetails.snippet)) {
                                            propName = textBeforeFirstDot + "." + propDetails.snippet
                                        }
                                        if (isValidObject(propDetails.pre_snippet)) {
                                            propName = propDetails.pre_snippet + propName
                                        }
                                        if (propDetails.type == "Action") {
                                            meta = "Method"
                                        }
                                        if (propDetails.type == "Event") {
                                            meta = "Event"
                                        }

                                        wordList.push(  {
                                            "word":         propName ,
                                            "freq":         24,
                                            "score":        300,
                                            "flags":        "bc",
                                            "syllables":    "1",
                                            "meta":         meta
                                        })
                                    }

                                    // Add form.CONTROL_NAME

                                    for ( let  aComp  of  mm.model.forms[formName].components  ) {
                                        wordList.push(  {
                                            "word":         textBeforeFirstDot + "." + aComp.name,
                                            "freq":         24,
                                            "score":        300,
                                            "flags":        "bc",
                                            "syllables":    "1",
                                            "meta":         "Control"
                                        })
                                    }
                                } else if (textBeforeSecondDot) {
                                    let comps       = mm.model.forms[formName].components

                                    for (let rt=0; rt < comps.length; rt++) {
                                        if (comps[rt].name == textBeforeSecondDot) {
                                            componentId = comps[rt].base_component_id
                                            let controlProperties = mm.getControlProperties(componentId)
                                            for (let fg=0;fg < controlProperties.length;fg++){
                                                let comm = controlProperties[fg]
                                                let propName = textBeforeSecondDot + "." + comm.id
                                                let meta = "Property"
                                                if (isValidObject(comm.snippet)) {
                                                    propName = textBeforeSecondDot + "." + comm.snippet
                                                }
                                                if (isValidObject(comm.pre_snippet)) {
                                                    propName = comm.pre_snippet + propName
                                                }
                                                if (comm.type == "Action") {
                                                    meta = "Method"
                                                }

                                                let addProp = true
                                                if (comm.type == "Event") {
                                                    addProp = false
                                                }

                                                if (addProp) {
                                                    wordList.push(  {
                                                        "word":         formName + "." +  propName ,
                                                        "freq":         24,
                                                        "score":        300,
                                                        "flags":        "bc",
                                                        "syllables":    "1",
                                                        "meta":         meta
                                                    })
                                                }
                                            }
                                        }
                                    }

                                }





                                //
                                // if the main object is the VB app
                                //

                            } else if (isApp) {
                                debugger

                                let appProps = mm.getAllAppPropeties()
                                for (let formPropIndex = 0 ; formPropIndex < appProps.length ; formPropIndex++ ) {

                                    let propDetails = appProps[formPropIndex]
                                    let propName    = textBeforeFirstDot + "." + propDetails.id
                                    let meta        = "Property"

                                    if (isValidObject(propDetails.snippet)) {
                                        propName = textBeforeFirstDot + "." + propDetails.snippet
                                    }
                                    if (isValidObject(propDetails.snippet)) {
                                        propName = propDetails.snippet + propName
                                    }
                                    if (propDetails.type == "Action") {
                                        meta = "Method"
                                    }
                                    if (propDetails.type == "Event") {
                                        meta = "Event"
                                    }

                                    wordList.push(  {
                                                        "word":         propName,
                                                        "freq":         24,
                                                        "score":        300,
                                                        "flags":        "bc",
                                                        "syllables":    "1",
                                                        "meta":         meta
                                                    })
                                }

                            } else {
                                //debugger
                            }
                        }

                        callback(null, wordList.map(function(ea) {
                            return {name: ea.word, value: ea.word, score: ea.score, meta: ea.meta}
                        }));


                    }
                }
                langTools.addCompleter(autocompleterFunction);



                mm.ui_code_editor.commands.addCommand({
                    name: "showOtherCompletions",
                    bindKey: ".",
                    exec: function(editor) {
                        mm.ui_code_editor.session.insert(mm.ui_code_editor.getCursorPosition(), ".")
                        mm.ui_code_editor.completer.updateCompletions()
                    }
                })

                mm.ui_code_editor.setOptions({
                    enableBasicAutocompletion: false,
                    enableSnippets: false,
                    enableLiveAutocompletion: true
                });
            },
            setupCodeEditorSelectors:               function        (  property_id  ) {
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

                setTimeout( function() {

                    //
                    // Add the selectors using the SelectR library
                    //

                    if (!document.getElementById("select_code_object_parent")) {
                        return; }
                    document.getElementById("select_code_object_parent").innerHTML=' <select id=select_code_object ></select>'
                    if (!document.getElementById("select_code_action_parent")) {
                        return; }
                    document.getElementById("select_code_action_parent").innerHTML=' <select id=select_code_action ></select>'



                    //
                    //   initialise vars
                    //

                    let objectListForSelector  = []
                    let methodListForSelector  = []
                    let indexObjectSelector    = 0
                    let indexActionSelector    = 0
                    let selectedCodeObject     = null
                    let selectedCodeAction     = null



                    //
                    // if we selected the app or a form
                    //

                    if (mm.model.app_selected || (!isValidObject(mm.active_component_index))) {

                        if (mm.edited_app_component_id) {
                            objectListForSelector.push(
                                {
                                    value:      "" + indexObjectSelector,
                                    app:        mm.edited_app_component_id,
                                    form:       null,
                                    component:  null
                                })
                        }

                        if (mm.model.app_selected) {
                            selectedCodeObject = indexObjectSelector
                        }
                        indexObjectSelector++

                        let forms = mm.getForms()
                        for (  let ere7 = 0; ere7 < forms.length; ere7++  ) {
                            let form = forms[ ere7 ]
                            objectListForSelector.push(
                                {
                                    value:      "" + indexObjectSelector,
                                    app:        null,
                                    form:       form.name,
                                    component:  null
                                }
                            )
                            if ((!mm.model.app_selected) && (form.name == mm.active_form)) {
                                selectedCodeObject = indexObjectSelector
                            }
                            indexObjectSelector++


                            //
                            // show the sub controls of this form if it is the current form
                            //

                            if ((!mm.model.app_selected) && (form.name == mm.active_form)) {
                                let components = mm.getActiveFormComponents()
                                for (  let ere1 = 0; ere1 < components.length; ere1++  ) {
                                    let component = components[ ere1 ]
                                    objectListForSelector.push(
                                        {
                                            value:              "" + indexObjectSelector,
                                            app:                null,
                                            form:               mm.active_form,
                                            component:          "  -  " + component.name,
                                            component_scope:     component.base_component_id,
                                            component_index:    ere1
                                        }
                                    )
                                    if (mm.active_component_index == ere1) {
                                        selectedCodeObject = indexObjectSelector
                                    }
                                    indexObjectSelector++
                                }
                            }
                        }

                        //
                        // if we selected a component
                        //
                    } else if (isValidObject(mm.active_component_index)) {

                        objectListForSelector.push(
                            {
                                value:      "" + indexObjectSelector,
                                app:        null,
                                form:       mm.active_form,
                                component:  null
                            }
                        )
                        indexObjectSelector++

                        let components = mm.getActiveFormComponents()
                        for (  let ere8 = 0; ere8 < components.length; ere8++  ) {
                            let component = components[ ere8 ]
                            objectListForSelector.push(
                                {
                                    value:              "" + indexObjectSelector,
                                    app:                null,
                                    form:               mm.active_form,
                                    component:          "  -  " + component.name,
                                    component_scope:     component.base_component_id,
                                    component_index:    ere8
                                }
                            )
                            if (mm.active_component_index == ere8) {
                                selectedCodeObject = indexObjectSelector
                            }
                            indexObjectSelector++
                        }
                    }



                    // get the app methods
                    if (mm.model.app_selected) {
                        let allProperties = mm.getAllAppPropeties()
                        for (let ui=0;ui < allProperties.length; ui ++) {
                            let prop = allProperties[ui]
                            if ((prop.type == "Event") || (prop.type == "Action")) {
                                methodListForSelector.push(
                                    {
                                        value:              "" + indexActionSelector,
                                        app:                mm.edited_app_component_id,
                                        form:               mm.active_form,
                                        component:          null,
                                        action_id:          prop.id,
                                        action_name:        prop.name,
                                        action_type:        prop.type
                                    }
                                )
                                if (prop.id == property_id) {
                                    selectedCodeAction = indexActionSelector
                                }
                                indexActionSelector++
                            }
                        }


                    } else if (  isValidObject(mm.active_component_index)  ) {
                        let ccc        = mm.model.forms[mm.active_form].components[mm.active_component_index]
                        let properties = mm.getComponentProperties(  ccc.base_component_id  )

                        for (  let ere9 = 0;  ere9 < properties.length;  ere9++  ) {
                            let property = properties[ ere9 ]
                            if (property.type == "Event") {
                                methodListForSelector.push(
                                    {
                                        value:              "" + indexActionSelector,
                                        app:                null,
                                        form:               mm.active_form,
                                        component:          ccc.name,
                                        action_id:          property.id,
                                        action_name:        property.name,
                                        action_type:        property.type,
                                        action_index:       ere9
                                    }
                                )
                                if (property.id == property_id) {
                                    selectedCodeAction = indexActionSelector
                                }
                                indexActionSelector++
                            }
                        }

                        methodListForSelector.push(
                            {
                                value:              "" + indexActionSelector,
                                app:                null,
                                form:               mm.active_form,
                                component:          ccc.name,
                                action_id:          "load",
                                action_name:        "Load event",
                                action_type:        "Event",
                                action_index:       null
                            })
                        if ( property_id == "load" ) {
                            selectedCodeAction = indexActionSelector
                        }
                        indexActionSelector++


                        methodListForSelector.push(
                            {
                                value:              "" + indexActionSelector,
                                app:                null,
                                form:               mm.active_form,
                                component:          ccc.name,
                                action_id:          "on_property_in",
                                action_name:        "On Property In",
                                action_type:        "Event",
                                action_index:       null
                            })
                        if ( property_id == "on_property_in" ) {
                            selectedCodeAction = indexActionSelector
                        }
                        indexActionSelector++





                        methodListForSelector.push(
                            {
                                value:              "" + indexActionSelector,
                                app:                null,
                                form:               mm.active_form,
                                component:          ccc.name,
                                action_id:          "on_property_changed",
                                action_name:        "On Property Changed",
                                action_type:        "Event",
                                action_index:       null
                            })
                        if ( property_id == "on_property_changed" ) {
                            selectedCodeAction = indexActionSelector
                        }
                        indexActionSelector++




                        methodListForSelector.push(
                            {
                                value:              "" + indexActionSelector,
                                app:                null,
                                form:               mm.active_form,
                                component:          ccc.name,
                                action_id:          "on_property_out",
                                action_name:        "On Property Out",
                                action_type:        "Event",
                                action_index:       null
                            })
                        if ( property_id == "on_property_out" ) {
                            selectedCodeAction = indexActionSelector
                        }
                        indexActionSelector++




                        // get the actions for the forms
                    } else if (  isValidObject(mm.active_form)  ) {
                        let ccc        = mm.model.forms[mm.active_form]

                        methodListForSelector.push(
                            {
                                value:              "" + indexActionSelector,
                                app:                null,
                                form:               mm.active_form,
                                component:          ccc.name,
                                action_id:          "form_activate",
                                action_name:        "Activate Event",
                                action_type:        "Event",
                                action_index:       null
                            })
                        if ( property_id == "form_activate" ) {
                            selectedCodeAction = indexActionSelector
                        }
                        indexActionSelector++





                        methodListForSelector.push(
                            {
                                value:              "" + indexActionSelector,
                                app:                null,
                                form:               mm.active_form,
                                component:          ccc.name,
                                action_id:          "form_load",
                                action_name:        "Form Load Event",
                                action_type:        "Event",
                                action_index:       null
                            })
                        if ( property_id == "form_load" ) {
                            selectedCodeAction = indexActionSelector
                        }
                        indexActionSelector++
                    }





                    selectCodeObject = new Selectr(
                        document.getElementById('select_code_object'),
                        {
                            renderOption:       mm.myDataRenderFunction,
                            renderSelection:    mm.myDataRenderFunction,
                            selectedValue:      selectedCodeObject,
                            data:               objectListForSelector,
                            customClass:       'my-custom-selectr',
                            searchable:         false
                        });

                    selectCodeAction = new Selectr(
                        document.getElementById('select_code_action'),
                        {
                            renderOption:       mm.actionRenderFunction,
                            renderSelection:    mm.actionRenderFunction,
                            selectedValue:      selectedCodeAction,
                            data:               methodListForSelector,
                            customClass:       'my-custom-selectr',
                            searchable:         false
                        });

                    document.getElementsByClassName("selectr-selected")[0].style.padding = "1px"
                    document.getElementsByClassName("selectr-selected")[0].style["border-top"] = "2px solid gray"
                    document.getElementsByClassName("selectr-selected")[0].style["border-left"] = "2px solid gray"

                    document.getElementsByClassName("selectr-selected")[1].style.padding = "1px"
                    document.getElementsByClassName("selectr-selected")[1].style["border-top"] = "2px solid gray"
                    document.getElementsByClassName("selectr-selected")[1].style["border-left"] = "2px solid gray"

                    document.getElementsByClassName("selectr-selected")[2].style.padding = "1px"
                    document.getElementsByClassName("selectr-selected")[2].style["border-top"] = "2px solid gray"
                    document.getElementsByClassName("selectr-selected")[2].style["border-left"] = "2px solid gray"

                    selectCodeObject.on('selectr.select', function(option) {
                        let dd = objectListForSelector[option.idx]
                        if (dd.component) {
                            mm.selectComponent(dd.component_index)
                            mm.editAsCode({
                                app_selected:           false,
                                active_form:            mm.active_form,
                                active_component_index: mm.active_component_index,
                                property_id:            "load"
                            })
                        } else if (dd.form) {
                            mm.selectForm(dd.form)
                            mm.editAsCode({
                                app_selected:           false,
                                active_form:            dd.form,
                                active_component_index: null,
                                property_id:            "form_activate"
                            })
                        } else if (dd.app) {
                            mm.select_app()
                            mm.editAsCode({
                                app_selected:           true,
                                active_form:            mm.active_form,
                                active_component_index: null,
                                property_id:            "app_started_event"

                            })
                        }
                    });

                    selectCodeAction.on('selectr.select', function(option) {
                        let dd = methodListForSelector[option.idx]
                        mm.editAsCode({
                            app_selected:           mm.app_selected,
                            active_form:            mm.active_form,
                            active_component_index: mm.active_component_index,
                            property_id:            dd.action_id
                        })
                    });


                },100)
            },
            getActiveFormComponents:                function        (  ) {
                return this.model.forms[this.active_form].components
            },
            getFormComponents:                      function        (  {  formName  }  ) {
                //console.log("FormName: " + formName)
                return this.model.forms[ formName ].components
            },
            getFormNames:                           function        (  ) {
                return Object.keys(this.model.forms)
            },
            processControlEvent:                    async function  (  { design_time_only_events , type , code , control_name , args , sub_type , form_name }  ) {

                //                    /-------------------------------------/
                //                   /         processControlEvent         /
                //                  /-------------------------------------/
                //
                // This is used to run user written event code in app, form, or control
                // event handlers

                let mm                      = this
                let callableUiForms         = {}
                let shallIProcessThisEvent  = false
                let argsToUserCodeString    = "{"
                let argsToUserCode          = {}



                // disallow processing this event if we are in design mode
                // in most cases
//debugger
                if ( (!mm.design_mode) && (mm.model) )                              { shallIProcessThisEvent = true }
                if ( (!mm.design_mode) && (mm.model) )                              { shallIProcessThisEvent = true }
                if ( design_time_only_events && (mm.design_mode) && (mm.model) )    { shallIProcessThisEvent = true }
                if ( design_time_only_events && (!mm.design_mode) )                 { shallIProcessThisEvent = false }
                if ( ( code == null) || ( code == "" ) )                            { shallIProcessThisEvent = false }



                // if we are allowed to process this

                if (shallIProcessThisEvent) {

                    mm.updateAllFormCaches()


                    //             /--------------------/
                    //            /  UI control event  /
                    //           /--------------------/
                    //
                    //       eg: "code to run when button clicked"
                    //       -------------------------------------
                    //
                    // if this is processing an event generated from a control
                    // on a form

                    if (type == "subcomponent_event") {


                        // set up form access vars to enable:
                        //
                        // Form_1.show()
                        // Form_1.button_1.setText("Hello Ducks")

                        for (  let  aForm  of  this.getForms() ) {
                            callableUiForms[ aForm.name  ] = {
                                init: function({formName}) {
                                    this.name = formName;
                                },
                                show: function() {
                                    mm.model.forms[this.name].show()
                                }
                            }
                            for (let formControl  of  mm.model.forms[  aForm.name ].components) {
                                if (formControl.name) {
                                    callableUiForms[ aForm.name  ][formControl.name] = mm.form_runtime_info[ aForm.name ].component_lookup_by_name[formControl.name]
                                }
                            }
                            callableUiForms[ aForm.name  ].init({formName: aForm.name})

                            argsToUserCodeString += aForm.name + ","
                            argsToUserCode[aForm.name] = callableUiForms[ aForm.name ]
                        }




                        // set up property access for all controls on this form
                        // like:
                        //
                        // button_1.setText("Hello Ducks")
                        // button_1.text = "Hello Ducks"

                        let allC = this.model.forms[this.active_form].components
                        for ( let comp  of  allC ) {
                            argsToUserCodeString += comp.name + ","
                            argsToUserCode[comp.name] = mm.form_runtime_info[this.active_form].component_lookup_by_name[comp.name];
                        }


                        let thisControl = this.form_runtime_info[   this.active_form   ].component_lookup_by_name[   control_name   ]
                        if (isValidObject(thisControl)) {

                            if (isValidObject(thisControl.parent)) {
                                argsToUserCodeString += parent + ","
                                argsToUserCode["parent"] = mm.form_runtime_info[  this.active_form  ].component_lookup_by_name[  thisControl.parent  ];
                            }


`
                            argsToUserCodeString += "app ,"
                            argsToUserCode["app"] = mm.model;

                            argsToUserCodeString += "myForm ,"
                            argsToUserCode["myForm"] = mm.model.forms[this.active_form];


                            let listOfArgs = []
                            if (isValidObject(args)) {
                                listOfArgs = Object.keys(args)
                                for (let rtt=0;rtt<listOfArgs.length;rtt++) {
                                    argsToUserCodeString += listOfArgs[rtt] + " ,"
                                    argsToUserCode[listOfArgs[rtt]] = JSON.stringify(args[listOfArgs[rtt]])
                                }
                            }

`
                            argsToUserCodeString += "me }"
                            argsToUserCode["me"] = mm.form_runtime_info[mm.active_form].component_lookup_by_name[thisControl.name];



                            let fcc =
`(async function(${argsToUserCodeString}){
${code}
})`
                            let debugFcc = getDebugCode(
                                                mm.active_form + "_" + control_name + "_" + sub_type,fcc,
                                                {
                                                    skipFirstAndLastLine: true
                                                })



                            // try to execute the code. Ideally, we should have all the
                            // code sitting in "debugFcc" ready to be executed. This
                            // should make things easier to debug

                            let efcc = eval(debugFcc)


                            try {
                                await efcc(argsToUserCode)
                            } catch(  err  ) {

                                let errValue = ""
                                if (err.message) {
                                    errValue = err.message
                                } else {
                                    errValue = err
                                }
                                alert(  "Error in " + form_name + ":" + control_name + ":" + sub_type + ":" + "\n" +
                                    "    " + JSON.stringify(errValue,null,2))
                            }
                        }



                    //             /--------------/
                    //            /  Form event  /
                    //           /--------------/
                    //
                    //   eg: "code to run when form activated
                    //   ------------------------------------
                    //
                    // This is only executed for events which are generated from a form, such as form
                    // load or activate

                    } else if (type == "form_event") {
                        //debugger
                        let fcc =
                            `(async function(){
                                ${code}
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
                            alert(  "Error in " + form_name + ":" + sub_type + "\n" +
                                "    Error: " + JSON.stringify(errValue,null,2))
                        }
                    }



                    // force update on the UI

                    mm.refresh ++
                    mm.$forceUpdate();
                }
            },
            gotoDragDropEditor:                     function        (  ) {

                this.design_mode_pane.type          = "drag_drop";
                yz.mainVars.disableAutoSave         = false
                this.active_component_detail_name   = null
                this.active_component_detail_index  = null
                this.active_component_links_name    = null
                this.active_component_links_index   = null
                if (this.ui_code_editor) {
                    if (this.ui_code_editor.completer) {
                        this.ui_code_editor.completer.detach()
                    }
                    this.ui_code_editor.destroy()
                    this.ui_code_editor = null
                }
            },
            chooseRight:                            function        (  ff  ) {

                this.right_mode = ff
            },
            getForms:                               function        (  ) {
                let forms = []
                let llf = Object.keys(this.model.forms)
                for (let ii = 0; ii < llf.length ; ii ++) {
                    let form = this.model.forms[llf[ii]]
                    if (form != null) {
                        forms.push(form)
                    }
                }
                return forms
            },
            isThisComponentAnApp:                   function        (  ) {
                /*
                ________________________________________
                |                                      |
                |          isThisComponentAnApp        |
                |                                      |
                |______________________________________|

                TO BE FILLED IN

                __________
                | Params |
                |        |______________________________________________________________
                |
                |     NONE
                |________________________________________________________________________ */
                if (this.model && this.model.forms) {
                    return true
                }
                debugger

                return false
            },
            getFormProperties:                      function        (    formName    ) {

                let props = []
                props.push({   id: "name",          name: "Name",           type:   "String"    })
                props.push({   id: "width",         name: "Width",          type:   "Number"    })
                props.push({   id: "height",        name: "Height",         type:   "Number"    })
                props.push({   id: "form_activate", name: "Activate Event", type:   "Event"    })
                props.push({   id: "form_load",     name: "Load Event",     type:   "Event"    })

                props.push({    id:         "add_control",
                                name:       "Add Control()",
                                type:       "Action"  ,
                                snippet:    `add_control({name: "name_of_new_control"})`,

                                help:       `<div>Help text for <b>addControl</b> method
                                                 <br/><br/>
                                                 Call <b>form.addControl({ })</b> to add a new control to this form
                                             </div>`,

                                fn:         `mm.addControl(  arg1  )
                                             return {}
                                            `})



                props.push({    id:         "show",
                                name:       "Show form()",
                                type:       "Action",
                                snippet:    `show()`,

                                help:       `<div>Help text for <b>show</b> method
                                                 <br/><br/>
                                                 Call <b>form.show()</b> to show this form
                                             </div>`,

                                fn:         `mm.selectForm(formName)
                                             return {}
                                            `})

                return props
            },
            getComponentProperties:                 function        (  componentType  ) {
                /*
    ________________________________________
    |                                      |
    |        getComponentProperties        |
    |                                      |
    |______________________________________|

    TO BE FILLED IN
    __________
    | Params |
    |        |______________________________________________________________
    |
    |     componentName     The component type
    |     -------------
    |________________________________________________________________________ */
//qqq
                let compEvaled = GLOBALS.getControlPropertyDefns({baseComponentId: componentType})
                if (isValidObject(compEvaled)) {
                    return compEvaled
                }
                return []
            },
            selectForm:                             function        (  formId  ,  showProps  ) {
                let mm = this

                mm.active_component_index   = null
                mm.model.app_selected       = false
                mm.properties               = mm.getFormProperties( formId )
                mm.active_form              = formId
                mm.refresh ++

                if (  mm.model.forms[  formId  ].form_activate && (!mm.design_mode)) {

                    if (!isValidObject(this.args)) {
                        //TODO
                        // WHY does this ever get called? remove it when you can!!!!
                        mm.args = mm.model
                    }

                    let formActivateCode = mm.model.forms[formId].form_activate

                    let formEvent = {
                        type:               "form_event",
                        form_name:           formId,
                        code:                formActivateCode,
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
            allowDropEditor:                        function        (  ev  ) {
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
            dropEditor:                             async function  (  ev  ) {
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
            setInfo:                                function        (  text  ) {
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
            allowDrop:                              function        (  ev  ) {
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
            drag:                                   function        (  ev  ,  message  ) {
                /*
                ________________________________________
                |                                      |
                |             drag                     |
                |                                      |
                |______________________________________|

                TO BE FILLED IN

                __________
                | Params |
                |        |______________________________________________________________
                |
                |     NONE
                |________________________________________________________________________ */
                let mm          = this
                let doc         = document.documentElement;
                let left        = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
                let top         = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);
                let rrr         = ev.target.getBoundingClientRect()
                message.offsetX = (ev.clientX - rrr.left )
                message.offsetY = (ev.clientY - rrr.top )

                if (!isValidObject(ev.dataTransfer)) {
                    return
                }
                ev.dataTransfer.setData("message",
                    JSON.stringify(message,null,2));
            },
            switchEditor:                           async function  (  editorComponentName  ) {
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
            showComponentDetailedDesignUi:          async function  (  index  ) {
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
            showComponentDetailedDesignUiByName:    async function  (  compName  ) {
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
            drop:                                   async function  (  ev  ) {
                /*
                ________________________________________
                |                                      |
                |               drop                   |
                |                                      |
                |______________________________________|

                This is called when something happens on the main drag and drop
                grid

                __________
                | Params |
                |        |______________________________________________________________
                |
                |     NONE
                |________________________________________________________________________ */
                ev.preventDefault();
                let mm = this

                if (this.oldCursor) {
                    this.cursorSource.style.cursor = this.oldCursor
                    this.oldCursor = null
                    this.cursorSource = null
                }

                let data2               = ev.dataTransfer.getData("message");
                let data                = eval("(" + data2 + ")")
                let newItem2            = new Object()
                let rrr2                = document.getElementById(this.vb_grid_element_id).getBoundingClientRect()
                newItem2.leftX          = (ev.clientX  - rrr2.left)  - data.offsetX;
                newItem2.topY           = (ev.clientY  - rrr2.top)   - data.offsetY;
                let parentType          = null
                let parentName          = null
                let parentOffsetX       = 0
                let parentOffsetY       = 0
                let parentOffsetWidth   = 0
                let parentOffsetHeight  = 0
                let parentContainer     = this.getContainerForPoint(  newItem2.leftX,  newItem2.topY  )

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
                    await mm.addComponentV2(xx,yy,data, parentType, parentName, [])
                    this.highlighted_control            = null
                    this.highlighted_control_code_id    = null

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
            get_default_app_propeties:              function        (  ) {
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
            getAllAppPropeties:                     function        (  ) {
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
            select_app:                             function        (  ) {
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
            myDataRenderFunction:                   function        (  data  ) {
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
            actionRenderFunction:                   function        (  data  ) {
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
            updatePropertySelector:                 function        (  ) {
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
            existsProp:                             function        (  compEvaled  ,  propName  ) {
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
            getControlProperties:                   function        (  base_component_id  ) {
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

                properties.push({   id:     "name",                 name:   "Name",         type:   "String"    })
                properties.push({   id:     "display_name",         name:   "Type Name",    type:   "String" , readonly: true   })
                properties.push({   id:     "display_icon",         name:   "Icon",         type:   "String" , readonly: true   })
                properties.push({   id:     "base_component_id",    name:   "Type",         type:   "String" , readonly: true   })
                properties.push({   id:     "code_id",              name:   "Type IPFS",    type:   "String" , readonly: true   })
                properties.push({   id:     "leftX",                name:   "X",            type:   "Number"    })
                properties.push({   id:     "topY",                 name:   "Y",            type:   "Number"    })

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
            selectComponent:                        async function  (  index  ,  showProps  ) {
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
            moveUp:                                 function        (  fieldId  ) {
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
            moveDown:                               function        (  fieldId  ) {
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
            savedStatus:                            async function  (  args  ) {
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
            getText:                                async function  (  ) {
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
            lockEditor:                             function        (  ) {
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
            unlockEditor:                           function        (  ) {
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
            setText:                                function        (  textValue  ) {
                /*
                ________________________________________
                |                                      |
                |                setText               |
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
                this.text   = textValue
                let json2   = this.getJsonModelFromCode(  textValue  )

                mm.edited_app_component_id = yz.helpers.getValueOfCodeString(textValue, "base_component_id")

                mm.old_model    = JSON.parse(JSON.stringify(json2));
                mm.model        = json2

                mm.updatePropertySelector()
                mm.updateAllFormCaches()
                mm.refresh ++
            },
            getJsonModelFromCode:                   function        (  codeV  ) {
                /*
                ________________________________________
                |                                      |
                |         getJsonModelFromCode         |
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
                mm.edited_app_component_id  = yz.helpers.getValueOfCodeString(codeV, "base_component_id")
                mm.componentType            = yz.helpers.getValueOfCodeString(codeV, "component_type")
                let json2 = yz.helpers.getValueOfCodeString(codeV,"formEditor",")//formEditor")
                return json2
            },
            generateCodeFromModel:                  async function  (  ) {
                /*
                ________________________________________
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
                if (yz.mainVars.online && this.design_mode) {

                    //
                    // store the subcomponent types that this app depends on (BY CODE ID or BCI) = v2
                    //
                    let subComponentsv2 = yz.helpers.getValueOfCodeString(this.text, "sub_components_v2")
                    if (subComponentsv2) {
                        this.text = yz.helpers.deleteCodeString(this.text, "sub_components_v2")
                    } else {
                        subComponentsv2 = []
                    }

                    let mapSubComponentsByBCI = {}
                    let mapSubComponentsByCodeId = {}
                    for (let tt = 0; tt < subComponentsv2.length ; tt++) {
                        let subComponentInfo = subComponentsv2[tt]
                        if (subComponentInfo.code_id) {
                            mapSubComponentsByCodeId[ subComponentInfo.code_id ] = { base_component_id: subComponentInfo.base_component_id }
                        } else {
                            mapSubComponentsByBCI[ subComponentInfo.base_component_id ] = {}
                        }
                    }

                    let forms = mm.getForms()
                    for (  let formIndex = 0;  formIndex < forms.length;  formIndex ++  ) {
                        let formName = forms[formIndex].name

                        for (  let compenentInFormIndex = 0;  compenentInFormIndex < mm.model.forms[formName].components.length;  compenentInFormIndex ++  ) {
                            let newItem = mm.model.forms[formName].components[compenentInFormIndex]
                            if (newItem && newItem.code_id && (newItem.code_id != "")) {
                                if (!mapSubComponentsByCodeId[newItem.code_id]) {
                                    mapSubComponentsByCodeId[newItem.code_id] = {base_component_id: newItem.base_component_id}
                                }
                            } else if (newItem && newItem.base_component_id) {
                                mapSubComponentsByBCI[newItem.base_component_id] = {}
                            }
                        }
                    }
                    let newListOfSubcomponentsV2  = []
                    for (let bcikey of Object.keys(mapSubComponentsByBCI)) {
                        newListOfSubcomponentsV2.push({base_component_id: bcikey})
                    }
                    for (let codeIdkey of Object.keys(mapSubComponentsByCodeId)) {
                        newListOfSubcomponentsV2.push({base_component_id: mapSubComponentsByCodeId[codeIdkey].base_component_id, code_id: codeIdkey})
                    }

                    this.text = yz.helpers.insertCodeString(  this.text, "sub_components_v2", newListOfSubcomponentsV2)










                    //
                    // other stuff
                    //
                    this.text   = yz.helpers.deleteCodeString(  this.text, "component_type")
                    this.text   = yz.helpers.insertCodeString(  this.text, "component_type", "APP")
                    this.text   = yz.helpers.deleteCodeString(  this.text, "formEditor", ")//form" + "Editor")
                    this.text   = yz.helpers.insertCodeString(  this.text, "formEditor", mm.model, ")//form" + "Editor")
                    this.text   = yz.helpers.deleteCodeString(  this.text, "properties", ")//prope" + "rties")
                    this.text   = yz.helpers.insertCodeString(  this.text, "properties", mm.model.app_properties, ")//prope" + "rties")

                    let codeChanges = yz.helpers.getValueOfCodeString(this.text,"code_changes",")//code_" + "changes")
                    if (codeChanges) {
                        this.text = yz.helpers.deleteCodeString(  this.text, "code_changes", ")//code_" + "changes")
                    }
                    if (!this.code_changes) {
                        this.code_changes = []
                    }
                    this.text = yz.helpers.insertCodeString(
                        this.text,
                        "code_changes",
                        this.code_changes,
                        ")//code_" + "changes")

                    this.in_generate_code_from_model = false
                    return
                }
            },
            openFile:                               async function  (  ) {
                /*
                ________________________________________
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
            selectOpenFileOrFolder:                 async function  (  fileorFolder  ,  fileExts  ) {
                /*
                ________________________________________
                |                                      |
                |          selectOpenFileOrFolder      |
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
            chosenFolderUp:                         async function  (  ) {
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


            },


            // related to watches
            getIncomingToPropertyName:              function        (  currentWatch) {
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
            getIncomingFromPropertyName:            function        (  currentWatch) {
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
            getIncomingTransformFn:                 function        (  currentWatch) {
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
            getOutgoingTransformFn:                 function        (  currentPush) {
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
            getOutgoingFromPropertyName:            function        (  currentPush) {
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
            getOutgoingToPropertyName:              function        (  currentPush) {
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
            addPush:                                function        (  ) {
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
            clearAllControlPropertyLinkFields:      async function  (  ) {
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
                await mm.recalcControlPropertyLinksAvailableInUI()
            },
            addWatch:                               function        (  ) {
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

                mm.clearAllControlPropertyLinkFields()

            },
            addNewComponentPush:                    async function  (  ) {
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
            addNewComponentWatch:                   async function  (  ) {
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
            setWatchComponent:                      function        (  {  controlUuid  }  ) {
                let mm      = this

                mm.selectedWatchFromProperties  = []
                let ccomp                       =  mm.form_runtime_info[mm.active_form].component_lookup_by_uuid[controlUuid]
                let ccomkeys                    = Object.keys(ccomp)
                for (  let compKey   of   ccomkeys  ) {
                    mm.selectedWatchFromProperties.push(compKey)
                }
            },
            setIncomingFormWatchComponent:          function        (  event  ) {
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
                let ccomkeys = Object.keys(yz.componentsImplementation.treeOfPossibleControlPropertyLinks[Acttyoe].incoming.them[ccomp.base_component_id])
                for (let aaa =0; aaa<ccomkeys.length;aaa++) {
                    this.selectedWatchFromProperties.push(ccomkeys[aaa])
                }

            },
            setWatchToProperty:                     function        (  event  ) {
                let mm = this
                this.selectedWatchToProperty = event.target.value
                this.toLinkPropertySelected = true

                if (mm.linkSideSelected == "none") {
                    mm.linkSideSelected = "to";

                } else {

                }

                if (mm.design_mode_pane.links_type == "form") {
                    if (mm.linkSideSelected == "to") {

                        mm.incoming_link_objects = []

                        let ccc = mm.model.forms[mm.active_form].components
                        for (   let ytr = ccc.length - 1;    ytr >= 0;    ytr--   ) {
                            let component = ccc[ytr]
                            let foundComponentType = component.base_component_id
                            if (yz.componentsImplementation.treeOfPossibleControlPropertyLinks[mm.selected_link_component_type]) {
                                if (yz.componentsImplementation.treeOfPossibleControlPropertyLinks[mm.selected_link_component_type].incoming.me) {
                                    if (yz.componentsImplementation.treeOfPossibleControlPropertyLinks[mm.selected_link_component_type].incoming.me[this.selectedWatchToProperty]) {
                                        let foundComponentIncomingTree = yz.componentsImplementation.treeOfPossibleControlPropertyLinks[mm.selected_link_component_type].incoming.me[this.selectedWatchToProperty][foundComponentType]

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
                        let inTypes = yz.componentsImplementation.treeOfPossibleControlPropertyLinks[selectedObject.base_component_id].incoming.them
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
            setWatchTransformFn:                    function        (  event  ) {
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
            setPushTransformFn:                     function        (  event  ) {
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
            setWatchFromProperty:                   function        (  event  ) {
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
                        if (  yz.componentsImplementation.treeOfPossibleControlPropertyLinks[  activeComponenttype  ]  ) {
                            if (  yz.componentsImplementation.treeOfPossibleControlPropertyLinks[  activeComponenttype  ].incoming  ) {
                                if (  yz.componentsImplementation.treeOfPossibleControlPropertyLinks[  activeComponenttype  ].incoming.them  ) {
                                    let them =  this.form_runtime_info[mm.active_form].component_lookup_by_uuid[this.selectedWatchComponentUuid]
                                    if (  yz.componentsImplementation.treeOfPossibleControlPropertyLinks[  activeComponenttype  ].incoming.them[  them.base_component_id  ]  ) {
                                        let ccomkeys2 = Object.keys(yz.componentsImplementation.treeOfPossibleControlPropertyLinks[  activeComponenttype  ].incoming.them[  them.base_component_id  ][mm.selectedWatchFromProperty] )

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
            setPushComponentType:                   function        (  event  ) {
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
                    if (yz.componentsImplementation.treeOfPossibleControlPropertyLinks){
                        if (yz.componentsImplementation.treeOfPossibleControlPropertyLinks[activecomp.base_component_id]){
                            if (yz.componentsImplementation.treeOfPossibleControlPropertyLinks[activecomp.base_component_id].outgoing){
                                if (yz.componentsImplementation.treeOfPossibleControlPropertyLinks[activecomp.base_component_id].outgoing.me){
                                    if (yz.componentsImplementation.treeOfPossibleControlPropertyLinks[activecomp.base_component_id].outgoing.me[mm.selectedPushFromProperty] ) {
                                        if (yz.componentsImplementation.treeOfPossibleControlPropertyLinks[activecomp.base_component_id].outgoing.me[mm.selectedPushFromProperty][ComponentType]) {
                                            let ccomkeys = Object.keys(yz.componentsImplementation.treeOfPossibleControlPropertyLinks[activecomp.base_component_id].outgoing.me[mm.selectedPushFromProperty][ComponentType])
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
            setWatchComponentType:                  function        (  event  ) {
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
                mm.selectedWatchFromProperties = []
                mm.selectedWatchComponentType = ComponentType
                //
                let activecomp = mm.model.forms[mm.active_form].components[mm.active_component_index]


                if (mm.linkSideSelected == "to") {
                    if (yz.componentsImplementation.treeOfPossibleControlPropertyLinks){
                        if (yz.componentsImplementation.treeOfPossibleControlPropertyLinks[activecomp.base_component_id]){
                            if (yz.componentsImplementation.treeOfPossibleControlPropertyLinks[activecomp.base_component_id].incoming){
                                if (yz.componentsImplementation.treeOfPossibleControlPropertyLinks[activecomp.base_component_id].incoming.me){
                                    if (yz.componentsImplementation.treeOfPossibleControlPropertyLinks[activecomp.base_component_id].incoming.me[mm.selectedWatchToProperty] ) {
                                        if (yz.componentsImplementation.treeOfPossibleControlPropertyLinks[activecomp.base_component_id].incoming.me[mm.selectedWatchToProperty][ComponentType]) {
                                            let ccomkeys = Object.keys(yz.componentsImplementation.treeOfPossibleControlPropertyLinks[activecomp.base_component_id].incoming.me[mm.selectedWatchToProperty][ComponentType])
                                            for (let aaa =0; aaa<ccomkeys.length;aaa++) {
                                                this.selectedWatchFromProperties.push(ccomkeys[aaa])
                                            }
                                        }
                                    }
                                }

                            }
                        }
                    }
                }

            },
            setPushComponent:                       function        (  event  ) {
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


                this.selectedPushComponentUuid = event.target.value
                let ccomp =  this.form_runtime_info[mm.active_form].component_lookup_by_uuid[this.selectedPushComponentUuid]
                let activecomp = mm.model.forms[mm.active_form].components[mm.active_component_index]
                this.selectedPushToProperties = []
                mm.linkSideSelected = "to"

                //
                if (mm.design_mode_pane.links_type == "form") {

                    if (mm.linkSideSelected == "from") {
                        if (yz.componentsImplementation.treeOfPossibleControlPropertyLinks){
                            if (yz.componentsImplementation.treeOfPossibleControlPropertyLinks[activecomp.base_component_id]){
                                if (yz.componentsImplementation.treeOfPossibleControlPropertyLinks[activecomp.base_component_id].outgoing){
                                    if (yz.componentsImplementation.treeOfPossibleControlPropertyLinks[activecomp.base_component_id].outgoing.me){
                                        if (yz.componentsImplementation.treeOfPossibleControlPropertyLinks[activecomp.base_component_id].outgoing.me[mm.selectedPushFromProperty] ) {
                                            if (yz.componentsImplementation.treeOfPossibleControlPropertyLinks[activecomp.base_component_id].outgoing.me[mm.selectedPushFromProperty][ccomp.base_component_id]) {
                                                let ccomkeys = Object.keys(yz.componentsImplementation.treeOfPossibleControlPropertyLinks[activecomp.base_component_id].outgoing.me[mm.selectedPushFromProperty][ccomp.base_component_id])
                                                for (let aaa =0; aaa<ccomkeys.length;aaa++) {
                                                    this.selectedPushToProperties.push(ccomkeys[aaa])
                                                }
                                            }
                                        }
                                    }

                                }
                            }
                        }
                    } else if (mm.linkSideSelected == "to") {
                        if (yz.componentsImplementation.treeOfPossibleControlPropertyLinks){
                            if (yz.componentsImplementation.treeOfPossibleControlPropertyLinks[activecomp.base_component_id]){
                                if (yz.componentsImplementation.treeOfPossibleControlPropertyLinks[activecomp.base_component_id].outgoing){
                                    if (yz.componentsImplementation.treeOfPossibleControlPropertyLinks[activecomp.base_component_id].outgoing.them){
                                        if (yz.componentsImplementation.treeOfPossibleControlPropertyLinks[activecomp.base_component_id].outgoing.them[ccomp.base_component_id]){
                                            let ccomkeys = Object.keys(yz.componentsImplementation.treeOfPossibleControlPropertyLinks[activecomp.base_component_id].outgoing.them[ccomp.base_component_id])
                                            for (let aaa =0; aaa<ccomkeys.length;aaa++) {
                                                this.selectedPushToProperties.push(ccomkeys[aaa])
                                            }
                                        }
                                    }

                                }
                            }
                        }
                    }


                    // else just get all the components on the form
                } else {

                    let ccomkeys = Object.keys(ccomp)
                    for (let aaa =0; aaa<ccomkeys.length;aaa++) {
                        this.selectedPushToProperties.push(ccomkeys[aaa])
                    }

                }
//debugger
            },
            linkComponents:                         function        (  options  ) {
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
                //alert(JSON.stringify(options,null,2))

                //debugger

                if (options.link_type == "outgoing") {
                    let fromComponent =   mm.form_runtime_info[mm.active_form].component_lookup_by_name[options.from_component]
                    let toComponent =     mm.form_runtime_info[mm.active_form].component_lookup_by_name[options.to_component]

                    mm.old_model = JSON.parse(JSON.stringify( mm.model ));
                    if (! fromComponent.push) {
                        fromComponent.push = []
                    }
                    fromComponent.push.push(
                        {
                            "uuid": toComponent.uuid,
                            "property": options.from_property,
                            "send_to": options.to_property,
                            "transform_fn": null
                        }
                    )
                    mm.selectedPushComponentUuid     = null
                    mm.selectedPushFromProperty      = null
                    mm.selectedPushToProperty        = null
                    mm.selectedPushTransformFn        = null

                    mm.refresh ++
                    mm.updateAllFormCaches()
                    mm.showSaveButton()

                } else if (options.link_type == "incoming") {
                    //debugger
                    let fromComponent =   mm.form_runtime_info[mm.active_form].component_lookup_by_name[options.from_component]
                    let toComponent =     mm.form_runtime_info[mm.active_form].component_lookup_by_name[options.to_component]

                    mm.old_model = JSON.parse(JSON.stringify( mm.model ));
                    if (! toComponent.watch) {
                        toComponent.watch = []
                    }
                    toComponent.watch.push(
                        {
                            "uuid": fromComponent.uuid,
                            "property": options.from_property,
                            "send_to": options.to_property,
                            "transform_fn": null
                        }
                    )
                    mm.selectedPushComponentUuid     = null
                    mm.selectedPushFromProperty      = null
                    mm.selectedPushToProperty        = null
                    mm.selectedPushTransformFn        = null
                    mm.incoming_link_component_types = []
                    mm.selectedWatchComponentUuid = null
                    mm.selectedWatchFromProperty = null
                    mm.selectedWatchFromProperties = []
                    mm.selectedWatchToProperty = null
                    mm.linkSideSelected = "none"
                    mm.selectedWatchComponentType = null



                    mm.refresh ++
                    mm.updateAllFormCaches()
                    mm.showSaveButton()

                }



            },
            setPushToProperty:                      function        (  event  ) {
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
                this.selectedPushToProperty = event.target.value
            },
            setPushFromProperty:                    function        (  event  ) {
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
                this.selectedPushFromProperty = event.target.value
                this.linkSideSelected = "from"

//
                if (this.design_mode_pane.links_type == "create_new_component") {
                    this.outgoing_link_component_types = []
                    let selectedObject = mm.model.forms[mm.active_form].components[mm.active_component_index]
                    if (yz.componentsImplementation.treeOfPossibleControlPropertyLinks) {
                        if (yz.componentsImplementation.treeOfPossibleControlPropertyLinks[selectedObject.base_component_id]) {
                            let outTypes = yz.componentsImplementation.treeOfPossibleControlPropertyLinks[selectedObject.base_component_id].outgoing.them
                            //debugger
                            if (outTypes) {
                                let ooo = Object.keys(outTypes)
                                for (let ooobb of ooo) {
                                    mm.outgoing_link_component_types.push(ooobb)
                                }

                            }
                        }
                    }
                }
            },
            deleteLinkedProperty:                   function        (  watchListItem  ) {
                let mm                     = this
                let currentComponentCurrentWatch
                let componentIndex
                let currentComponent       = null
                let allComponentsonForm    = mm.model.forms[mm.active_form].components

                for (  componentIndex = 0 ;  componentIndex < allComponentsonForm.length  ;  componentIndex++  ) {

                    currentComponent = allComponentsonForm[  componentIndex  ]
                    if (currentComponent.uuid == watchListItem.to_component_uuid) {
                        if (currentComponent.watch){
                            for (let currentWatchIndex = 0;currentWatchIndex < currentComponent.watch.length;currentWatchIndex++) {
                                currentComponentCurrentWatch = currentComponent.watch[currentWatchIndex]
                                if (currentComponentCurrentWatch.uuid == watchListItem.from_component_uuid) {
                                    if (currentComponentCurrentWatch.send_to == watchListItem.to_component_property_name) {
                                        if (currentComponentCurrentWatch.property == watchListItem.from_component_property_name) {
                                            mm.old_model = JSON.parse(JSON.stringify( mm.model ));
                                            mm.model.forms[mm.active_form].components[  componentIndex  ].watch.splice(currentWatchIndex, 1);
                                            mm.refresh ++
                                            mm.updateAllFormCaches()
                                            break
                                        }
                                    }

                                }
                            }
                        }
                    }
                }

                let pushListItem = watchListItem
                //debugger
                let currentPushIndex
                //let mm                     = this
                let currentComponentCurrentPush
                currentComponent       = null
                allComponentsonForm    = mm.model.forms[mm.active_form].components

                for (  componentIndex = 0 ;  componentIndex < allComponentsonForm.length  ;  componentIndex++  ) {

                    currentComponent = allComponentsonForm[  componentIndex  ]
                    if (currentComponent.uuid == pushListItem.from_component_uuid) {
                        if (currentComponent.push){
                            for (let currentPushIndex = 0;currentPushIndex < currentComponent.push.length;currentPushIndex++) {
                                currentComponentCurrentPush = currentComponent.push[currentPushIndex]
                                if (currentComponentCurrentPush.uuid == pushListItem.to_component_uuid) {
                                    if (currentComponentCurrentPush.send_to == pushListItem.to_component_property_name) {
                                        if (currentComponentCurrentPush.property == pushListItem.from_component_property_name) {
                                            mm.old_model = JSON.parse(JSON.stringify( mm.model ));
                                            mm.model.forms[mm.active_form].components[  componentIndex  ].push.splice(currentPushIndex, 1);
                                            mm.refresh ++
                                            mm.updateAllFormCaches()
                                            break
                                        }
                                    }

                                }
                            }
                        }
                    }
                }
                mm.showSaveButton()

            },
            clearLinkToProperties:                  async function  (  ) {
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
                    if (  yz.componentsImplementation.treeOfPossibleControlPropertyLinks[  activeComponenttype  ]  ) {
                        if (  yz.componentsImplementation.treeOfPossibleControlPropertyLinks[  activeComponenttype  ].incoming  ) {
                            if (  yz.componentsImplementation.treeOfPossibleControlPropertyLinks[  activeComponenttype  ].incoming.me  ) {
                                let ccomkeys2 = Object.keys(yz.componentsImplementation.treeOfPossibleControlPropertyLinks[  activeComponenttype  ].incoming.me )

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
            showComponentLinks:                     async function  (  index  ,  diretionOfLinks  ) {
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
                mm.clearAllControlPropertyLinkFields();

                this.active_component_links_index = index;
                this.active_component_links_name = this.model.forms[this.active_form].components[index].name;

                mm.clearLinkToProperties()


                mm.selected_link_component_type = mm.model.forms[mm.active_form].components[mm.active_component_index].base_component_id
                await mm.recalcControlPropertyLinksAvailableInUI()
                //alert()

                setTimeout(function() {
                    mm.refresh ++
                    mm.$forceUpdate();
                },400)
            }

            //*** gen_end ***//
        },
        mounted:
            //*** copy_mounted_start ***//
            async function() {
                // This is called whenever an app is loaded, either at design
                // time or at runtime

                let mm = this
                let json2
                try {
                    mm.unique_app_dom_element_id    = uuidv4()
                    mm.vb_grid_element_id           = "vb_grid_" + uuidv4()
                    mm.vb_editor_element_id         = "vb_editor_" + uuidv4()
                    mm.local_app                    = localAppshareApp
                    mm.in_change_model              = true

                    if (mm.properties && mm.args) {
                        mm.args = {...mm.args, ...mm.properties}
                        mm.properties = mm.args
                    } else if (mm.properties) {
                        mm.args = mm.properties
                    } else {
                        mm.properties = mm.args
                    }

                    if (mm.design_mode) {
                        yz.mainVars.disableAutoSave = false
                    }



                    // Get the base component ID of the code to edit/run
                    // Save it in "this.edited_app_component_id"

                    if (texti) {
                        json2                       = mm.getJsonModelFromCode(texti)
                        mm.old_model                = JSON.parse(JSON.stringify(json2));
                        mm.model                    = json2
                        mm.edited_app_component_id  = yz.helpers.getValueOfCodeString(texti, "base_component_id")
                        mm.read_only                = yz.helpers.getValueOfCodeString(texti, "read_only")
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
                        let appProps = mm.getAllAppPropeties()
                        for (let propDetails of appProps) {
                            if (propDetails.type == "Action") {
                                mm.model[propDetails.id] = mm.getAppMethod(propDetails.id)
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

                    texti = null

                    setTimeout(async function () {
                        for (let formName of mm.getFormNames()) {
                            let thisForm = mm.model.forms[formName]
                            if (  thisForm.form_load && (!mm.design_mode)) {
                                let formLoadCode = thisForm.form_load

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


                    mm.$root.$on('message', async function (text) {
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
                                mm.loadControlPalette();
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
                            if (mm.args && mm.args.control_type) {

                                //debugger
                                setTimeout(async function () {
                                    let compArgs = {
                                        base_component_id: mm.args.control_type,
                                        type: "add_component",
                                        text: "this.highlighted_control",
                                        offsetX: 100,
                                        offsetY: 100
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
                                }, 200)
                            }
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
                                            mm.$root.$emit('message', {
                                                type:   "pending"
                                            })
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



                    }
            ,
                deep: true
            }
        }
            //*** copy_watch_end ***//,
        data:       function () {
            return {
                //*** copy_data_start ***//
                code_changes:                        [],
                showFilePicker:                      false,
                editor_locked:                       false,
                open_file_path:                      "/",
                open_file_list:                      [],
                open_file_name:                      "",
                file_exts:                           [],
                errors:                              null,
                inUpdateAllFormCaches:               false,
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
                componentType:                       null,
                event_code:                          null,
                text:                                texti,
                leftHandWidth:                       130,
                right_mode:                          "project",
                add_property:                        false,
                new_property_name:                   "",
                new_property_id:                     "",
                new_property_type:                   "",
                local_app:                           false,
                refresh:                             0,
                properties:                          [],
                read_only:                           false,
                selected_pane:                       null,
                active_property_index:               null,
                design_mode_pane:                    {type: "drag_drop"},
                show_advanced_transform:             false,
                available_components:                [],
                ui_code_editor:                      null,
                form_runtime_info:                   {},
                app_runtime_info:                    {},
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
