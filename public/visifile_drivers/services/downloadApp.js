async function downloadApp(args) {
/*
description("downloadApp function")
base_component_id("downloadApp")
load_once_from_file(true)
only_run_on_server(true)
*/
console.log("envVars: " + JSON.stringify(envVars,null,2))
        let promise = new Promise(async function(returnfn) {
            try {
                const dataString = JSON.stringify(
                    {
                        ipfs_hash: 1,
                        ipfs_content: 2
                    })

                let options = {
                    host: envVars.CENTRALHOST,
                    port: envVars.CENTRALHOSTPORT,
                    path: '/download_app',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Content-Length': dataString.length
                    }
                };
//https
                let theHttpsConn = http
                if (envVars.USEHTTPS) {
                    theHttpsConn = https
                }
                var response = "";
                let req = theHttpsConn.request(options, function(res) {
                    console.log('STATUS: ' + res.statusCode);
                    console.log('HEADERS: ' + JSON.stringify(res.headers));
                    res.setEncoding('utf8');
                    res.on('data', function (chunk) {
                        response += chunk;
                        console.log('BODY: ' + chunk);
                    });
                    res.on('end', function () {

                        console.log('returnfn: ' + response);
                        let responseJson = JSON.parse(response)
                        returnfn({
                            new_display_name:   "downloaded",
                            base_component_id:  "downloaded",
                            response:            responseJson
                        })
                    });
                });
                req.write(dataString)
                req.end()
                console.log('end: ' );

            } catch(er) {
                console.log(er)
                returnfn({
                    new_display_name:   args.base_component_id,
                    base_component_id:    args.base_component_id
                })
            }





            })


    var ret = await promise


    return ret
}
