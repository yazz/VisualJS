{
    doc_type: 'visifile',
    name: 'systemFunctions',  version: 1,
    description: 'system functions',




    events: {
        "This will return the apps available": {
            on: "get_apps_list",
            do: async function(args) {

                var getAppsList = new Promise(function(resolve, reject) {
                        dbsearch.serialize(
                            function() {
                                dbsearch.all(
                                    "SELECT driver FROM system_code where on_condition = '\"app\"' ; "
                                    ,

                                    function(err, results)
                                    {
                                        //console.log("*) results: " + JSON.stringify(results,null,2));
                                        var list = [
                                        ]
                                        for (var tt = 0; tt < results.length ; tt ++) {
                                            list.push(results[tt].driver)
                                        }
                                        //console.log("*) list: " + JSON.stringify(list,null,2));
                                        resolve(list)
                                    })
                        }, sqlite3.OPEN_READONLY)
                  })

                  try {
                         //console.log("*) var list2 = await getAppsList() ");
                         var list2 = await getAppsList
                         console.log("*) returning list: " + JSON.stringify(list2,null,2));
                         return list2
                  } catch(err) {
                      console.log("*) Error: " + JSON.stringify(err,null,2));
                  }


            }, end: null
        }


        ,



        "This will execute sql on the internal SQLite database": {
            on: "sql",
            do: function(args, returnfn) {
                dbsearch.serialize(
                    function() {
                        dbsearch.all(
                            args.sql
                            ,

                            function(err, results)
                            {
                                returnfn(results)
                            })
                }, sqlite3.OPEN_READONLY)


            }, end: null
        }


    }

}
