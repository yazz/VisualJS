async function serverDriveList(args) {
/*
description("Get the list of available drives")
base_component_id("serverDriveList")
load_once_from_file(true)
only_run_on_server(true)
*/


    var nodeDiskInfo = require('node-disk-info');
    var disks = []
    var returnVal = []
    try {
        disks = nodeDiskInfo.getDiskInfoSync();
        //console.log(JSON.stringify(disks,null,2));
        for (var qq=0; qq<disks.length;qq++) {
            var disk = disks[qq]
            if (disk) {
                console.log(disk._blocks);
                if (disk._blocks > 0) {
                    console.log("Added "+ disk._mounted);
                    returnVal.push({drive: disk._mounted})
                    //console.log("returnVal "+ returnVal);
                }
            }
        }
    } catch (e) {
        console.error(e);
        return {error: e}
    }
    console.log("returnVal "+ returnVal);
    return returnVal
}
