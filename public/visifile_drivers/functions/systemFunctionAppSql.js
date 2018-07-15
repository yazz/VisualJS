async function sql( args ) {
/*
description("This will execute sql on the internal SQLite database")
base_component_id("systemFunctionAppSql")
load_once_from_file(true)
*/

    var getSqlResults = new Promise(returnResult => {
        dbsearch.serialize(
            function() {
                dbsearch.all(
                    args.sql
                    ,

                    function(err, results)
                    {
                        returnResult(results)
                    })
        }, sqlite3.OPEN_READONLY)
    })


    var res = await getSqlResults
    return res


}
