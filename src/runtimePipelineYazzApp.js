{
    
    pipelineCode: async function() {
        //*** gen_start ***//
        {
            let texti       = null
            let designMode  = false
            let runtimeMode = true

            Vue.component('_REPLACE_THIS_WITH_BASE_COMPONENT_ID_', {
                props:      [ "args"],
                template:   /* ** *** insert_ui_template_start *** ** */
                /* ** *** insert_ui_template_end *** ** */,
                mounted:    //*** paste_mounted_start ***//
                            //*** paste_mounted_end ***//
                ,
                watch:      {
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
                    model:
                        {
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
                methods:    {
                    /* ** *** insert_ui_methods_start *** ** */
                    /* ** *** insert_ui_methods_end *** ** */
                },
                data:       function () {
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
                        model:
                        /* ** insert_app_model_start ** */
                        {
                        }
                        /* ** insert_app_model_end ** */
                    }
                }
            })
        }
//*** gen_end ***//
    }
}
