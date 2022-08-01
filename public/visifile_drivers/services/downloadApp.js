async function downloadApp(args) {
/*
description("downloadApp function")
base_component_id("downloadApp")
load_once_from_file(true)
only_run_on_server(true)
*/

        console.log("downloadApp")
        console.log("downloadApp")
        console.log("downloadApp")
        console.log("downloadApp")
        console.log("downloadApp")
        console.log("downloadApp")
        console.log("downloadApp")
        let promise = new Promise(async function(returnfn) {

                returnfn({
                            new_display_name:   args.base_component_id,
                            base_component_id:    args.base_component_id
                            })


            })


    var ret = await promise


    return ret
}
