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

        var useHttpOrHttps = https
        if (url.startsWith("http:")) {
            useHttpOrHttps = http
        }

        useHttpOrHttps.get(url,
            {
                rejectUnauthorized: false,
                requestCert: true,
                agent: false
            },
            res => {
          res.setEncoding("utf8");
          let body = "";
          res.on("data", data => {
            body += data;
          });
          res.on("end", () => {
            //body = JSON.parse(body);
            console.log(body);
            returnFn({value: JSON.parse(body)})
          });
        });

    })
    var ret = await promise


    return ret
}
