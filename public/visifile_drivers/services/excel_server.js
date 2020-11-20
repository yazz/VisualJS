async function excel_sql(args) {
/*
description("`excel db driver")
base_component_id("excel_server")
load_once_from_file(true)
only_run_on_server(true)
*/
    let noexcel = require("XLSX");

    var promise = new Promise(async function(returnFn) {

        try {
            //console.log("Loading Excel :" + args.path)

            let workbook = noexcel.readFile(args.path)



            //
            // get tables
            //
            if (args.get_sheets) {

                let ret = workbook.SheetNames
                returnFn(ret)

            //
            // get workbook
            //
            } else if (args.get_workbook) {

                //console.log("SHEET: " + JSON.stringify(workbook,null,2))
                console.log("workbook.SheetNames.length: " + JSON.stringify(workbook.SheetNames.length,null,2))
                let ret = {}
                for (let sheetIndex = 0; sheetIndex < workbook.SheetNames.length; sheetIndex ++ ) {
                    let sheetName = workbook.SheetNames[sheetIndex]
                    ret[sheetName] = noexcel.utils.sheet_to_json( workbook.Sheets[sheetName])
                }
                returnFn({value: ret})



            //
            // get columns
            //
            } else if (args.get_data) {

                console.log("SHEET: " + args.table)
                let ret = workbook.Sheets[args.table]
                returnFn(ret)



            //
            // get columns
            //
            } else if (args.get_columns) {

                let ret = noexcel.getColumns(args.table)
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
            console.log(JSON.stringify(catchErr,null,2))
            returnFn({err: catchErr})

        }









    })

    var ret = await promise
    let tables =  ret
    return  tables
}
