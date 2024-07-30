async function serverFolderContents(args) {
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
                if ((nert[ty].indexOf(".js") != -1 ) || (nert[ty].indexOf(".pilot") != -1 ) || (nert[ty].indexOf(".jsa") != -1 ) || (nert[ty].indexOf(".vjs") != -1 ) || (nert[ty].indexOf(".yazz") != -1 )) {
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
