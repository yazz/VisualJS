async function rest_call_service(args) {
/*
description("REST API Ccall function")
base_component_id("rest_call_service")
load_once_from_file(true)
only_run_on_server(true)
*/

    console.log("REST Call args: " + JSON.stringify(args,null,2));

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
                console.log("Error: " + JSON.stringify(error,null,2));
                console.log("Response: " + JSON.stringify(res,null,2));
                console.log("Body: " + JSON.stringify(body,null,2));

                var body = "";

                res.on(
                    "data",
                    function(data) {
                        body += data;
                    }
                );

                res.on(
                    "end",
                    function() {
                        //body = JSON.parse(body);
                        console.log(body);
                        //returnFn({value: ""})
                        returnFn({value: JSON.parse(body)})
                    }
                );
            }
        );

    })
    var ret = await promise


    return ret
}
