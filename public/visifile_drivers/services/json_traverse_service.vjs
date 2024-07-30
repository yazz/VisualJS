async function json_traverse_service(args) {
/*
description("REST API Call server side function")
base_component_id("json_traverse_service")
hash_algorithm("SHA256")
load_once_from_file(true)
only_run_on_server(true)
*/

 function pathToString(pp) {
    var s = ""
    for (  var aa = 0  ;  aa < pp.length  ;  aa ++  ) {
        if (isNaN(parseInt(pp[aa]))) {
            s += pp[aa]
        } else {
            s += "[]"
        }
        if (aa < pp.length -1) {
            s += "."
        }
    }
    return s
}

    //console.log("** json_traverse_service **")
    //console.log(JSON.stringify(args,null,2))
    //var tt = traverse(args.input).paths()
    var paths=new Object()
    var roots=new Object()
    var scrubbed = traverse(args.input).map(function (x) {
        if (this.circular) {
            this.remove()
        } else  {
            var rt = pathToString(this.path)

            //console.log("'" + rt + "'")
            if (rt != "") {
                paths[rt] = true
            }

            if (this.notLeaf) {
                roots[rt] = true
            }
        }
    });

    //console.log("** json_traverse_service **")
    return {paths: paths, roots: roots}
}
