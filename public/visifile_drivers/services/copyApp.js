async function copyAppshareApp(args) {
/*
base_component_id("copyApp")
description("copyAppshareApp function")
load_once_from_file(true)
only_run_on_server(true)
*/
    console.log("Called async function copyAppshareApp(args) {")
    let userId = args.user_id

    async function saveCopyOfAppWithDependencies(argsBaseComponentId, newBaseid, parentHashId, code, returnfn, newDisplayName) {

                let listOfSubComponentsRes = await yz.getSubComponents(code)
                var listOfSubComponents = []
                for (var yuy = 0; yuy < listOfSubComponentsRes.length ; yuy++ ) {

                    listOfSubComponents.push( listOfSubComponentsRes[yuy].child_base_component_id )

                }
                console.log("    async function saveCopyOfAppWithDependencies( " + argsBaseComponentId)
                console.log("              newBaseid:           " + newBaseid)
                console.log("              parentHashId:        " + parentHashId)
                console.log("              argsBaseComponentId: " + argsBaseComponentId)
                console.log("              userId:              " + userId)
                console.log("              code:                " + code)

                let saveret = await yz.saveCodeV3(
                            dbsearch,
                            code,
                            {
                                sub_components:         listOfSubComponents,
                                copy_db_from:           argsBaseComponentId,
                                save_html:              true,
                                //let userid = await getUserId(req)
                                //let optionsForSave = req.body.value.options
                                userId: userId
                            })
                let codeIdRet = null
                if (saveret) {
                    codeIdRet =  saveret.code_id
                }
                console.log("                    after save()")
                console.log("                                    saveret.code_id:      " + saveret.code_id)
                console.log("                                    newDisplayName:       " + newDisplayName)
                console.log("                                    newBaseid:            " + newBaseid)
                console.log("                                    codeIdRet:            " + codeIdRet)

                returnfn({
                            new_display_name:   newDisplayName,
                            base_component_id:  newBaseid,
                            code_id:            codeIdRet
                            })

    }





    var promise = new Promise(async function(returnfn) {

        var argsBaseComponentId = args.base_component_id
        var argsNewAppId        = args.new_base_component_id
        var argsCodeId          = args.code_id

        console.log("    argsBaseComponentId: " + argsBaseComponentId)
        console.log("    argsCodeId: "          + argsCodeId)
        console.log("    argsNewAppId:        " + argsNewAppId)
        console.log("    userId:              " + userId)

        let results = await yz.getQuickSql(
            dbsearch,
            "SELECT    ipfs_hash as id, code, component_name as display_name    FROM    yz_cache_released_components   where    " +
            " base_component_id = ? ;  "
            ,
            [argsBaseComponentId])


        if (results.length > 0) {
            var code = results[0].code
            if (code) {
                code = code.toString()
            }
            var newBaseid =  ""
            if (argsNewAppId) {
                newBaseid = argsNewAppId
            } else {
                newBaseid = "COMP_" + uuidv1().replace(/\-/g, '');
            }
            console.log("    newBaseid:           " + newBaseid)

            var oldDisplayName = results[0].display_name
            var parentHashId = results[0].id
            var newDisplayName = "Copy of " + oldDisplayName
            console.log("    parentHashId:        " + parentHashId)
            code = yz.deleteCodeString(code, "load_once_from_file")
            code = yz.deleteCodeString(code, "read_only")
            code = yz.deleteCodeString(code, "visibility")

            var componentType = yz.getValueOfCodeString(code, "component_type")
            if (componentType) {
            }
            if (componentType == "SYSTEM") {
                code = yz.deleteCodeString(code, "component_type")
                code = yz.insertCodeString(code, "component_type", "APP")
            }


            var formEditor = yz.getValueOfCodeString(code, "formEditor", ")//formEditor")
            if (formEditor) {
                formEditor.id = newBaseid
                code = yz.deleteCodeString(code, "formEditor", ")//formEditor")
                code = yz.insertCodeString(code, "formEditor", formEditor, ")//formEditor")

                code = yz.deleteCodeString(code, "display_name")
                code = yz.insertCodeString(code, "display_name", newDisplayName)
            }
            code = yz.insertCodeString(code, "visibility", "PRIVATE")


            code = yz.deleteCodeString(code, "base_component_id")
            code = yz.insertCodeString(code, "base_component_id", newBaseid)


            //hack city - Vue and component strings are separated as otherwise they mark the
            // code as UI code
            var vueIndex = code.indexOf("Vue" + ".component")
            if (vueIndex != -1) {
                var vueIndexEnd = code.substring(vueIndex).indexOf(",")
                if (vueIndexEnd) {
                    code = code.substring(0, vueIndex + 14) + "'" + newBaseid + "'" + code.substring(vueIndex + vueIndexEnd)
                }
            }

            console.log("    newDisplayName:      " + newDisplayName)

            //zzz
            await saveCopyOfAppWithDependencies(argsBaseComponentId, newBaseid, parentHashId, code, returnfn, newDisplayName)
        }

    })
    var ret = await promise


    return ret
}
