async function sql( args ) {
/*
description("This will execute sql on the internal SQLite database")
base_component_id("systemFunctions2")
load_once_from_file(true)
only_run_on_server(true)
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
