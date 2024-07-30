async function serverFolderHierarchyList(args) {
/*
description("Get the list of available drives")
base_component_id("server_folder_hierarchy_list")
hash_algorithm("SHA256")
load_once_from_file(true)
only_run_on_server(true)
*/


    var promise = new Promise(async function(returnfn) {

        var filterFileFn = function (file) {
          return fs.statSync(args.path+'/'+file).isDirectory();
        }

        var nert =  fs.readdirSync(args.path).filter(filterFileFn);
        returnfn(nert)

    })
    var ret = await promise


    return ret
}
