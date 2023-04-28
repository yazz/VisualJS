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
        template:   /* ** *** insert_ui_template_start *** ** */
        /* ** *** insert_ui_template_end *** ** */,
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
