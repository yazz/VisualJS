async function copyAppshareApp(args) {
    description("copyAppshareApp function")
    is_driver("copyApp")

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
                            var oldDisplayName = results[0].display_name
                            var newId = uuidv1()
                            var displayName = null
                            if (code.indexOf("display_name(") != -1) {
                                var displayNameCode = code.toString().substring(code.indexOf("display_name(") + 14)
                                displayName = displayNameCode.substring(0,displayNameCode.indexOf(")") - 1)
                            }
                            var newDisplayName = null
                            if (displayName) {
                                newDisplayName = oldDisplayName + " " + newId
                                var displayNameCodeStart = code.toString().indexOf("display_name(")
                                var displayNameCodeEnd = displayNameCodeStart +
                                                  code.toString().substring(displayNameCodeStart).indexOf(")")

                                code = code.toString().substring(0,displayNameCodeStart + 14) + newDisplayName +
                                                code.toString().substring(displayNameCodeEnd - 1)

                            }


                            console.log("new code: " + code)
                            var new_hash = saveCodeV2( null, code )

                            returnfn({
                                        new_code_id:        code_id,
                                        new_display_name:   newDisplayName,
                                        base_component_id:             results[0].base_component_id
                                        })
                        }


                    })
        }, sqlite3.OPEN_READONLY)

    })
    var ret = await promise


    return ret
}
