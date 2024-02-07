async function (  args  ) {
/*
description("`sqlite db driver")
base_component_id("sqlite_server")
hash_algorithm("SHA256")
load_once_from_file(true)
only_run_on_server(true)
*/
    console.log("args.path: " + args.path)
    let dbsearch = new sqlite3.Database(args.path.trim());
    console.log("dbsearch: " + JSON.stringify(dbsearch, null,2))
    dbsearch.run("PRAGMA journal_mode=WAL;")
    console.log("sqlite table name: " + args.table)
    let promise = new Promise(async function(returnFn) {

        //
        // get tables
        //
        if (  args.get_tables  ) {
            dbsearch.serialize(
                async function(  ) {
                    dbsearch.all(
                        `SELECT
                             name 
                        FROM 
                            sqlite_master 
                        WHERE 
                            type ='table' 
                                AND 
                            name NOT LIKE 'sqlite_%';`,
                        [],
                        async function(err, results2)
                        {
                            console.log("err: " + err)
                            returnFn(  results2  )
                        }
                    )}, sqlite3.OPEN_READONLY)



        //
        // get columns
        //
        } else if (args.get_columns) {
            dbsearch.serialize(
                async function() {
                    dbsearch.all(
                        `PRAGMA table_info(  ${args.table}  )`,
                        [],
                        async function(err, results2) {
                            returnFn(  {  value:  results2  }  )
                        }
                    )}, sqlite3.OPEN_READONLY)





        //
        // connect
        //
        } else if (args.connect) {
            try {
                dbsearch.serialize(
                    function() {
                        dbsearch.all(
                            `pragma schema_version;`,
                            [],
                            function(err, results2)
                            {
                                console.log("err: " + err)
                                console.log("results2: " + JSON.stringify(results2,null,2))
                                console.log("results2[0].schema_version: " + JSON.stringify(results2[0].schema_version,null,2))

                                if (results2[0].schema_version > 0) {
                                    returnFn({connected: true})
                                } else {
                                    returnFn({error: "Not a db"})
                                }
                            }
                        )}, sqlite3.OPEN_READONLY)

             } catch(catchErr) {
                 returnFn({error: catchErr})

            }





        //
        // execute SQL
        //
        } else {
            dbsearch.serialize(
                async function() {
                    let stmt = dbsearch.all(
                        args.sql,
                        [],
                        async function(err, results2)
                        {
                            returnFn({value: results2})
                        }
                    )}, sqlite3.OPEN_READONLY)
        }
    })

    try {
        let ret = await promise
        return  ret
    } catch( err) {
        returnFn({error: err})
    }
}
