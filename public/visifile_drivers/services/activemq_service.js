async function activemq_service(args) {
/*
description("ActiveMQ Service")
base_component_id("activemq_service")
load_once_from_file(true)
only_run_on_server(true)
*/
    var promise = new Promise(async function(returnfn) {

        //
        //    test_connection
        //
        try {

            returnfn({success: args})

        } catch (err)  {

            returnfn({error: err})
        }



    })
    var ret = await promise
    return ret
}
