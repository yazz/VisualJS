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
                        ipfs_hash: args.ipfs_hash
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
                        //console.log('BODY: ' + chunk);
                    });
                    res.on('end', function () {
                        let responseJson = JSON.parse(response)
                        //console.log('response: ' + response);
                        console.log('data.id: ' + responseJson.data.id);
                        console.log('data.name: ' + responseJson.data.name);
                        console.log('data.ipfs_hash: ' + responseJson.data.ipfs_hash);
                        console.log('data.logo: ' + responseJson.data.logo);
                        console.log('data.base_component_id: ' + responseJson.data.base_component_id);

                        returnfn({
                            display_name:   responseJson.data.name,
                            ipfs_hash:   responseJson.data.ipfs_hash,
                            logo_data:   responseJson.data.logo,
                            base_component_id:  responseJson.data.base_component_id,
                            code: responseJson.data.code
                            //response:            responseJson
                        })
                    });
                });
                req.write(dataString)
                req.end()
                console.log('end: ' );

            } catch(er) {
                console.log(er)
                returnfn({
                   error: er
                })
            }





            })


    var ret = await promise


    return ret
}
