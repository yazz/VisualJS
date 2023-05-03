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
                watch:      //*** paste_watch_start ***//
                            //*** paste_watch_end ***//
                            ,
                methods:    {
                    /* ** *** insert_ui_methods_start *** ** */
                    /* ** *** insert_ui_methods_end *** ** */
                },
                data:       function () {
                    return {
                        code_changes:                   [],
                        unique_app_dom_element_id:      null,
                        editor_locked:                  false,
                        vb_grid_element_id:             null,
                        vb_editor_element_id:           null,
                        debug_component:                null,
                        design_mode:                    designMode,
                        design_mode_pane:               {type: "drag_drop"},
                        show_advanced_transform:        false,
                        local_app:                      false,
                        refresh:                        0,
                        runtime_mode:                   runtimeMode,
                        components_used_in_this_app:    new Object(),
                        ui_code_editor:                 null,
                        form_runtime_info:              {},
                        text:                           texti,
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
