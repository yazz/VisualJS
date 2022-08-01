async function downloadApp(args) {
/*
description("downloadApp function")
base_component_id("downloadApp")
load_once_from_file(true)
only_run_on_server(true)
*/
console.log("centralHost: " + centralHost)
        let promise = new Promise(async function(returnfn) {
            try {
                const dataString = JSON.stringify(
                    {
                        ipfs_hash: ipfs_hash,
                        ipfs_content: ipfsContent
                    })

                let options = {
                    host: centralHost,
                    port: centralPort,
                    path: '/download_app',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Content-Length': dataString.length
                    }
                };
//https
                let theHttpsConn = http
                if (useHttps) {
                    theHttpsConn = https
                }
                let req = theHttpsConn.request(options, function(res) {
                    console.log('STATUS: ' + res.statusCode);
                    console.log('HEADERS: ' + JSON.stringify(res.headers));
                    res.setEncoding('utf8');
                    res.on('data', function (chunk) {
                        console.log('BODY: ' + chunk);
                    });
                    res.on('end', function () {
                        console.log('end: ' );
                    });
                });
                req.write(dataString)
                req.end()
                returnfn({
                    new_display_name:   "downloaded",
                    base_component_id:  "downloaded",
                    return: res
                })
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
