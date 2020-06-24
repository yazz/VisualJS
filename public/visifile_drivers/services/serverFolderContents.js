async function serverFolderContents(args) {
/*
description("Get the folder contents")
base_component_id("server_folder_contents")
load_once_from_file(true)
only_run_on_server(true)
*/
console.log(JSON.stringify(args,null,2))

    var promise = new Promise(async function(returnfn) {

        var filterFileFn = function (file) {
          return fs.statSync(args.path+'/'+file).isFile();
        }

        var nert =  fs.readdirSync(args.path).filter(filterFileFn);
        returnfn(nert)

    })
    var ret = await promise
console.log(JSON.stringify(ret,null,2))

    return ret
}
