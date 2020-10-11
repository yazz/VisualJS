async function sqlite_sql(args) {
/*
description("`sqlite db driver")
base_component_id("sqlite_server")
load_once_from_file(true)
only_run_on_server(true)
*/
  let dbsearch = new sqlite3.Database(args.path);
  dbsearch.run("PRAGMA journal_mode=WAL;")
console.log(1)
  var promise = new Promise(async function(returnFn) {
    dbsearch.serialize(
        function() {
            var stmt = dbsearch.all(
            "SELECT " +
            "     name " +
            "FROM " +
            "    sqlite_master " +
            "WHERE " +
            "    type ='table' AND " +
            "    name NOT LIKE 'sqlite_%';",
                []
                ,


                function(err, results2)
                {
                    returnFn(results2)
                }

                )
    }, sqlite3.OPEN_READONLY)
  })
  console.log(4)
  var ret = await promise
  //console.log("ret: "  +  JSON.stringify(ret,null,2))
   let tables =  ret
  return  tables
}
