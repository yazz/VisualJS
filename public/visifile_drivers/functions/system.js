async function get_apps_list(args) {

    description("This will return the apps available")
    base_component_id("systemFunctions")

    var getAppsList = new Promise(function(resolve, reject) {
            dbsearch.serialize(
                function() {
                    dbsearch.all(
                        "SELECT display_name FROM system_code where component_type = 'app' and code_tag = 'LATEST' ; "
                        ,

                        function(err, results)
                        {
                            //console.log("*) results: " + JSON.stringify(results,null,2));
                            var list = [
                            ]
                            for (var tt = 0; tt < results.length ; tt ++) {
                                list.push(results[tt].display_name)
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


}
