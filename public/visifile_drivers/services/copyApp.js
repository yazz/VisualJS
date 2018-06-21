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
                            code = deleteCodeString(code, "display_name")
                            code = insertCodeString(code, "display_name", newDisplayName)

                            var newBaseid = uuidv1()

                            console.log("new code: " + code)
                            saveCodeV2( newBaseid, null, code )

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
