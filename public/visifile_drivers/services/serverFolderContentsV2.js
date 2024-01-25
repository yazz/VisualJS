async function serverFolderContentsV2(args) {
/*
description("Get the folder contents")
base_component_id("server_folder_contents")
hash_algorithm("SHA256")
load_once_from_file(true)
only_run_on_server(true)
*/
console.log(JSON.stringify(args,null,2))

    var promise = new Promise(async function(returnfn) {

        var filterFileFn = function (file) {
            try {
                return fs.statSync(args.path+'/'+file).isFile();
            } catch (statErr) {
                return true
            }
        }

        var nert =  fs.readdirSync(args.path);
        let rettt=[]
        for (var ty=0;ty<nert.length;ty++) {
            if (filterFileFn(nert[ty])) {
                if (args.filter_file_exts_list) {
                    for (let fileExtIndex = 0 ; fileExtIndex < args.filter_file_exts_list.length ; fileExtIndex ++ ) {
                        let thisFileExt = args.filter_file_exts_list[fileExtIndex]
                        if (nert[ty].indexOf("." + thisFileExt) != -1 )  {
                            rettt.push({name: nert[ty], type: "file"})
                            break;
                        }
                    }
                } else {
                    rettt.push({name: nert[ty], type: "file"})
                }

            } else {
                rettt.push({name: nert[ty], type: "folder"})
            }
        }
        returnfn(rettt)

    })
    var ret = await promise
console.log(JSON.stringify(ret,null,2))

    return ret
}
