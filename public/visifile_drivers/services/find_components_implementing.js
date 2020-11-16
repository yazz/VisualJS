async function find_components_implementing(args) {
/*
description("find_components_implementing Service")
base_component_id("find_components_implementing")
load_once_from_file(true)
only_run_on_server(true)
*/
    var getAppsList = new Promise(function(resolve, reject) {
            dbsearch.serialize(
                function() {
                    dbsearch.all(
                        "SELECT  base_component_id, display_name  FROM system_code where code_tag = 'LATEST' and base_component_id in (select cn from (select distinct(component_name) cn ,count(component_name) ccn from component_properties  where property_name in (?" + (",?".repeat(args.properties.length-1)) + ")  group by component_name ) where ccn = ?);"
                        ,
                        args.properties.concat(args.properties.length)
                        ,

                        function(err, results)
                        {
                            //console.log("*) results: " + JSON.stringify(results,null,2));
                            var list = [
                            ]
                            for (var tt = 0; tt < results.length ; tt ++) {
                                list.push(results[tt])
                            }
                            //console.log("*) list: " + JSON.stringify(list,null,2));
                            resolve(list)
                        })
            }, sqlite3.OPEN_READONLY)
      })

      try {
             //console.log("*) var list2 = await getAppsList() ");
             var list2 = await getAppsList
             //console.log("*) returning list: " + JSON.stringify(list2,null,2));
             return {count: list2.length, values: list2}
      } catch(err) {
          console.log("*) Error: " + JSON.stringify(err,null,2));
      }
}
