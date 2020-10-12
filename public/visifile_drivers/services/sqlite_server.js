async function sqlite_sql(args) {
/*
description("`sqlite db driver")
base_component_id("sqlite_server")
load_once_from_file(true)
only_run_on_server(true)
*/
    let dbsearch = new sqlite3.Database(args.path);
    dbsearch.run("PRAGMA journal_mode=WAL;")
    console.log("sqlite table name: " + args.table)
    var promise = new Promise(async function(returnFn) {

        //
        // get tables
        //
        if (args.get_tables) {
            dbsearch.serialize(
                function() {
                    var stmt = dbsearch.all(
                        "SELECT " +
                        "     name " +
                        "FROM " +
                        "    sqlite_master " +
                        "WHERE " +
                        "    type ='table' AND " +
                        "    name NOT LIKE 'sqlite_%';"
                        ,
                        []
                        ,
                        function(err, results2)
                        {
                            returnFn(results2)
                        }
                    )}, sqlite3.OPEN_READONLY)



        //
        // get columns
        //
        } else if (args.get_columns) {
            dbsearch.serialize(
                function() {
                    var stmt = dbsearch.all(
                        "PRAGMA table_info(" +
                            args.table +
                        ")"
                        ,
                        []
                        ,
                        function(err, results2)
                        {
                            returnFn(results2)
                        }
                    )}, sqlite3.OPEN_READONLY)






        //
        // execute SQL
        //
        } else {
            dbsearch.serialize(
                function() {
                    var stmt = dbsearch.all(
                        args.sql
                        ,
                        []
                        ,
                        function(err, results2)
                        {
                            returnFn(results2)
                        }
                    )}, sqlite3.OPEN_READONLY)

        }







    })

    var ret = await promise
    let tables =  ret
    return  tables
}
