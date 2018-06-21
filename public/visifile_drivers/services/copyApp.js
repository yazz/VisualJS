async function copyAppshareApp(args) {
    description("copyAppshareApp function")
    base_component_id("copyApp")

    var promise = new Promise(returnfn => {

        var code_id = args.code_id
        //var parentHash = args.source_app_hash
        dbsearch.serialize(
            function() {
                dbsearch.all(
                    "SELECT code, display_name, base_component_id FROM system_code where id = ? ;  "
                    ,
                    code_id
                    ,

                    function(err, results)
                    {
                        if (results.length > 0) {
                            var code = results[0].code
                            if (code) {
                                code = code.toString()
                            }
                            var oldDisplayName = results[0].display_name
                            var newDisplayName = "Copy of " + oldDisplayName
                            code = code.deleteCodeString(code, "display_name")
                            code = code.insertCodeString(code, "display_name", newDisplayName)

                            console.log("new code: " + code)
                            var new_hash = saveCodeV2( null, null, code )

                            returnfn({
                                        new_code_id:        code_id,
                                        new_display_name:   newDisplayName,
                                        base_component_id:  results[0].base_component_id
                                        })
                        }


                    })
        }, sqlite3.OPEN_READONLY)

    })
    var ret = await promise


    return ret
}
