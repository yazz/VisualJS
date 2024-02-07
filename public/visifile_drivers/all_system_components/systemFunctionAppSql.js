async function sql( args ) {
/*
description("This will execute sql on the internal SQLite database")
base_component_id("systemFunctionAppSql")
hash_algorithm("SHA256")
load_once_from_file(true)
only_run_on_server(true)
*/


    var getSqlResults = new Promise(returnResult => {
        var dbPath = path.join(userData, 'app_dbs/' + args.base_component_id + '.visi')
        var appDb = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
            if (err) {
                console.error(err.message);
            } else {
                console.log('ss1) Connected to the myDatabase.db database.');

                // Set PRAGMA journal_mode to WAL
                appDb.run("PRAGMA journal_mode=WAL;", function(err) {
                    if (err) {
                        console.error(err.message);
                    } else {
                        console.log("ss2) Journal mode set to WAL.");
                        appDb.serialize(
                            async function() {
                                console.log("ss3) Journal mode set to WAL.");
                                appDb.run("begin exclusive transaction");
                                appDb.all(
                                    args.sql,
                                    args.params,
                                    async function(err, results)
                                    {
                                        appDb.run("commit");
                                        returnResult(results)
                                    })
                            })
                    }
                });
            }
        }););


    })


    var res = await getSqlResults
    return res


}
