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
            //*** gen_end ***//
        }
        }
    }
}
