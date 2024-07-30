async function rest_call_service(args) {
/*
description("REST API Call server side function")
base_component_id("rest_call_service")
hash_algorithm("SHA256")
load_once_from_file(true)
only_run_on_server(true)
*/

    console.log("REST Call args: " + JSON.stringify(args,null,2));
    //return {value: {a: 1}}

    var promise = new Promise(async function(returnFn) {

        //const url = "https://jsonplaceholder.typicode.com/posts/1";
        const url = args.URL;

        request(
            url
            ,
            {
                rejectUnauthorized : false

                //auth: {
                //    user: 'adminuser',
                //    pass: 'admin1!'
                //}

            }
            ,

            function(error, res, body) {
                //console.log("Error: " + JSON.stringify(error,null,2));
                //console.log("Response: " + JSON.stringify(res,null,2));
                //console.log("Body: " + JSON.stringify(body,null,2));
                try {
                    returnFn(JSON.parse(body))
                } catch(err2) {
                    //console.log("Started timer")
                    var startTime = new Date().getMilliseconds()
                    xml2js.parseString(
                                body,
                                {
                                    trim:           true,
                                    explicitArray:  false
                                },
                                function (err, result) {
                                    var endTime = new Date().getMilliseconds()
                                    var totalTime = endTime - startTime
                                    //console.log("Took: " + totalTime + " ms")
                                    returnFn(result)
                                });

                }
            }
        );

    })
    //console.log("5" );
    var ret = await promise


    return ret
}
