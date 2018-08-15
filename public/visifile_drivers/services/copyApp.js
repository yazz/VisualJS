async function copyAppshareApp(args) {
/*
description("copyAppshareApp function")
base_component_id("copyApp")
load_once_from_file(true)
*/

    var promise = new Promise(returnfn => {

        var argsBaseComponentId = args.base_component_id
        dbsearch.serialize(
            function() {
                dbsearch.all(
                    "SELECT    id, code, display_name    FROM    system_code    where    " +
                        " base_component_id = ? and code_tag = 'LATEST';  "
                    ,
                    argsBaseComponentId
                    ,

                    function(err, results)
                    {
                        if (results.length > 0) {
                            var code = results[0].code
                            if (code) {
                                code = code.toString()
                            }
                            var oldDisplayName = results[0].display_name
                            var parentHashId = results[0].id
                            var newDisplayName = "Copy of " + oldDisplayName
                            code = saveHelper.deleteCodeString(code, "load_once_from_file")
                            code = saveHelper.deleteCodeString(code, "read_only")
                            code = saveHelper.deleteCodeString(code, "display_name")
                            code = saveHelper.insertCodeString(code, "display_name", newDisplayName)

                            var newBaseid = argsBaseComponentId + "_" + uuidv1().replace(/\-/g, '');

                            //hack city - Vue and component strings are separated as otherwise they mark the
                            // code as UI code
                            var vueIndex = code.indexOf("Vue" + ".component")
                            if (vueIndex != -1) {
                                var vueIndexEnd = code.substring(vueIndex).indexOf(",")
                                if (vueIndexEnd) {
                                    code = code.substring(0,vueIndex + 14) + "'" + newBaseid + "'" + code.substring(vueIndex + vueIndexEnd )
                                }
                            }

                            console.log("new code: " + code)
                            saveCodeV2( newBaseid, parentHashId, code )

                            returnfn({
                                        new_display_name:   newDisplayName,
                                        base_component_id:  newBaseid
                                        })
                        }


                    })
        }, sqlite3.OPEN_READONLY)

    })
    var ret = await promise


    return ret
}
