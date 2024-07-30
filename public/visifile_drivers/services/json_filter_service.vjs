async function json_filter_service(args) {
/*
description("Server side function to filter JSON")
base_component_id("json_filter_service")
hash_algorithm("SHA256")
load_once_from_file(true)
only_run_on_server(true)
*/

    // -------------------------------------------------------------------
    //
    //                          pathToString
    //
    //
    //
    //
    // -------------------------------------------------------------------
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





    //console.log("** json_filter_service **")
    //console.log(JSON.stringify(args,null,2))

    //var tt = traverse(args.input).paths()
    var paths           = new Object()
    var selectedPath    = null

    var scrubbed = traverse(args.input).map(function (x) {
        if (this.circular) {
            this.remove()
        }

        var rt = pathToString(this.path)
        //console.log("Path: " + rt)

        paths[rt]=true
        //console.log("paths[rt]=true " )

        if (args.filter[rt] == false) {
            //console.log("this.remove()" )
            if(rt != "") {
                this.remove()
            }
            //console.log("this.removed()" )
        } else if (args.root == rt) {
            selectedPath = this.node
        }
    });
    //console.log("Successfully scrubbed")


    if (selectedPath) {
        scrubbed = selectedPath
    }

    //console.log("** json_filter_service **")
    return scrubbed
}
