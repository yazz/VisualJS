async function serverDriveList(args) {
/*
description("Get the list of available drives")
base_component_id("server_drive_list")
load_once_from_file(true)
only_run_on_server(true)
*/


    var njds = require('nodejs-disks');
    var promise = new Promise(async function(returnfn) {

        njds.drives(
            function (err, drives) {
                njds.drivesDetail(
                    drives,
                    function (err, data) {
                        returnfn(data)




                    }
                );
            }
        )
    })
    var ret = await promise


    return ret
}
