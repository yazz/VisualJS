async function access_sql(args) {
/*
description("`access db driver")
base_component_id("access_server")
load_once_from_file(true)
only_run_on_server(true)
*/
    var noaccess = require("@zubairq/noaccess");

    var promise = new Promise(async function(returnFn) {


        noaccess.load({fileName:  "/Users/fquraish/testaccess/a.accdb"})
        //noaccess.load({fileName:   args.path)


        //
        // get tables
        //
        if (args.get_tables) {

            let ret = noaccess.getTables()
            returnFn(ret)
        //
        // get columns
        //
        } else if (args.get_columns) {

            let ret = noaccess.getColumns(args.table)
            returnFn(ret)


        //
        // execute SQL
        //
        } else {


        }







    })

    var ret = await promise
    let tables =  ret
    return  tables
}
