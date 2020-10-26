async function access_sql(args) {
/*
description("`access db driver")
base_component_id("access_server")
load_once_from_file(true)
only_run_on_server(true)
*/
    var noaccess = require("@zubairq/noaccess");

    var promise = new Promise(async function(returnFn) {

        try {
            noaccess.load({fileName:   args.path})


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
            // are we connected?
            //
            } else if (args.connect) {

                returnFn({connected: true})


            //
            // execute SQL
            //
            } else {


            }


        } catch(catchErr) {
            returnFn({err: catchErr})

        }









    })

    var ret = await promise
    let tables =  ret
    return  tables
}
