async function sql( args ) {
/*
description("This will execute sql on the internal SQLite database")
base_component_id("systemFunctionAppSql")
load_once_from_file(true)
*/


    var getSqlResults = new Promise(returnResult => {
        var dbPath = path.join(userData, 'app_dbs/' + args.base_component_id + '.visi')
        console.log("dbPath: " + JSON.stringify(dbPath,null,2))
        var appDb = new sqlite3.Database(dbPath);
        appDb.run("PRAGMA journal_mode=WAL;")

        appDb.serialize(
            function() {
                appDb.run("begin exclusive transaction");
                appDb.all(
                    args.sql
                    ,
                    args.params
                    ,

                    function(err, results)
                    {
                    //console.log("Results: " + JSON.stringify(results,null,2))
                        appDb.run("commit");
                        appDb.run("PRAGMA wal_checkpoint;")
                        returnResult(results)
                    })
         })
    })


    var res = await getSqlResults
    return res


}
