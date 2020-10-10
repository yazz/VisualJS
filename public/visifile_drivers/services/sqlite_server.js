async function sqlite_sql(args) {
/*
description("`sqlite db driver")
base_component_id("sqlite_server")
load_once_from_file(true)
only_run_on_server(true)
*/
  let dbsearch = new sqlite3.Database("/Users/faroukzquraishi/Yazz/node.visi");
  dbsearch.run("PRAGMA journal_mode=WAL;")
console.log(1)
  var promise = new Promise(async function(returnFn) {
    dbsearch.serialize(
        function() {
            var stmt = dbsearch.all(
                "SELECT  *  FROM   system_code",
                []
                ,

                function(err, results)
                {
                  console.log(2)
                    if (results) {
                        if (results.length > 0) {
                            var codeId = results[0].id
                                dbsearch.all(
                                    "SELECT dependency_name FROM app_dependencies where code_id = ?; ",
                                    codeId,

                                    function(err, results2)
                                    {
                                        results[0].libs = results2
                                        console.log(3)
                                        returnFn(results2)
                                    })
                        }

                    }

                })
    }, sqlite3.OPEN_READONLY)
  })
  console.log(4)
  var ret = await promise
  //console.log("ret: "  +  JSON.stringify(ret,null,2))
   let tables =  [{name: "server_fdfd"},{name: "fdfdsffdsd"},
                  {name: "fdssdfdffd"},{name: "fff"},{name: "fgg"}]
    console.log(5)
  return  tables
}
