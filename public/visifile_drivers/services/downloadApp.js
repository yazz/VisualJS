async function downloadApp(args) {
/*
description("downloadApp function")
base_component_id("downloadApp")
load_once_from_file(true)
only_run_on_server(true)
*/
    console.log("envVars: " + JSON.stringify(envVars,null,2))
    let theHttpsConn = http
    if (envVars.CENTRALHOSTHTTPS) {
        theHttpsConn = https
        console.log("using HTTPS: ")
    } else {
        console.log("using HTTP: ")
    }

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
                    connection: 'Close',
                    headers: {
                        'Content-Type': 'application/json',
                        'Content-Length': Buffer.byteLength(dataString)
                    }
                };
//https
                var response = "";
                console.log("options: " + JSON.stringify(options,null,2))

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
                        //console.log('data.logo: ' + responseJson.data.logo);
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
    let ret = await promise


    let addCodePromise = new Promise(async function(returnfn2) {
        try {
            const dataString2 = JSON.stringify(
                {
                    ipfs_hash:          ret.ipfs_hash,
                    base_component_id:  ret.base_component_id,
                    src_code:           ret.code
                })

            let options2 = {
                path: '/add_or_update_app',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': dataString2.length
                }
            };
            var response2 = "";
            let req2 = theHttpsConn.request(options2, function(res2) {
                res2.setEncoding('utf8');
                res2.on('data', function (chunk2) {
                    response2 += chunk2;
                });
                res2.on('end', function () {
                    console.log('response2: ' + response2);
                    returnfn2()
                });
            });
            req2.write(dataString2)
            req2.end()
            console.log('end: ' );

        } catch(er2) {
            console.log(er2)
            returnfn2({
                error: er2
            })
        }

    })
    let ret2 = await addCodePromise
    console.log("ret2: " + JSON.stringify(ret2,null,2))




    return ret
}
