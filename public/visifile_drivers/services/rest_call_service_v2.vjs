async function rest_call_service_v2(args) {
/*
description("REST API Call server side function")
base_component_id("rest_call_service_v2")
hash_algorithm("SHA256")
load_once_from_file(true)
only_run_on_server(true)
*/

    // -------------------------------------------------------------------
    //
    //                          pathToString
    //
    //
    //
    //
    // -------------------------------------------------------------------
    function pathToString(pp) {
        var s = ""
        for (  var aa = 0  ;  aa < pp.length  ;  aa ++  ) {
            if (isNaN(parseInt(pp[aa]))) {
                s += pp[aa]
            } else {
                s += "[]"
            }
            if (aa < pp.length -1) {
                s += "."
            }
        }
        return s
    }




    //console.log("REST Call args: " + JSON.stringify(args,null,2));
    //return {value: {a: 1}}

    var promise = new Promise(async function(returnFn) {

        //const url = "https://jsonplaceholder.typicode.com/posts/1";
        const url = args.URL;

        var headers = {}
        if (args.headers) {
            headers = args.headers
        }

        var method = "GET"
        if (args.method) {
            method = args.method
        }


        var body = ""
        if (args.body) {
            body = args.body
        }

        var auth = null
        if (args.username) {
            auth = {
                      user:             args.username,
                      pass:             args.password,
                      sendImmediately:  args.sendImmediately
            }
        }

        //console.log(url)
        request(
            url
            ,
            {
                rejectUnauthorized : false,


                headers: headers,

                method: method,

                body: body,

                auth: auth

            }
            ,

            function(error, res, body) {
                //console.log("Error: "    + JSON.stringify(error,null,2));
                //console.log("Response: " + JSON.stringify(res,null,2));
                //console.log("Body: "     + JSON.stringify(body,null,2));
                if (res && (res.statusCode) && (res.statusCode >= 400)) {
                    throw ("HTTP error: " + res.statusCode + ": "+ res.body)
                } else if (error && error.errno) {
                        throw ("Error: " + res.statusCode + ": "+ errno)
                } else {

                    try {
                        var returnJson = JSON.parse(body)
                        var scrubbed = null
                        //console.log("returnJson: "     + JSON.stringify(returnJson,null,2));
                        if (args.filter) {

                            var paths           = new Object()
                            var selectedPath    = null

                            var scrubbed = traverse(returnJson).map(function (x) {
                                if (this.circular) {
                                    this.remove()
                                }

                                var rt = pathToString(this.path)
                                //console.log("Path: " + rt)

                                paths[rt]=true
                                //console.log("paths[rt]=true " )

                                if (args.filter[rt] == false) {
                                    //console.log("this.remove()" )
                                    if(rt != "") {
                                        this.remove()
                                    }
                                    //console.log("this.removed()" )
                                } else if (args.root == rt) {
                                    selectedPath = this.node
                                }
                            });
                            if (selectedPath) {
                                scrubbed = selectedPath
                            }
                        }
                        //console.log("returnJson: "     + JSON.stringify(returnJson,null,2));
                        //console.log("scrubbed  : "     + JSON.stringify(scrubbed,null,2));

                        if (args.returnDetails) {
                            returnFn({raw: returnJson, filtered: scrubbed?scrubbed:returnJson})
                        } else {
                            if (scrubbed) {
                                returnFn(scrubbed)
                            } else {
                                returnFn(returnJson)
                            }
                        }

                    } catch(err2) {
                        //console.log("Trying to read service call as XML")
                        //console.log("****Body: " + JSON.stringify(body,null,2))
                        var startTime = new Date().getMilliseconds()
                        xml2js.parseString(
                                    body,
                                    {
                                        trim:           true,
                                        explicitArray:  false
                                    },
                                    function (err, returnJson) {
                                        //console.log("****returnJson: " + JSON.stringify(result,null,2))
                                        var endTime = new Date().getMilliseconds()
                                        var totalTime = endTime - startTime
                                        //console.log("Took: " + totalTime + " ms")


                                            //var returnJson = JSON.parse(result)
                                            //console.log("****returnJson: " + JSON.stringify(returnJson,null,2))
                                            var scrubbed = null
                                            //console.log("returnJson: "     + JSON.stringify(returnJson,null,2));
                                            if (args.filter) {

                                                var paths           = new Object()
                                                var selectedPath    = null

                                                var scrubbed = traverse(returnJson).map(function (x) {
                                                    if (this.circular) {
                                                        this.remove()
                                                    }

                                                    var rt = pathToString(this.path)
                                                    //console.log("Path: " + rt)

                                                    paths[rt]=true
                                                    //console.log("paths[rt]=true " )

                                                    if (args.filter[rt] == false) {
                                                        //console.log("this.remove()" )
                                                        if(rt != "") {
                                                            this.remove()
                                                        }
                                                        //console.log("this.removed()" )
                                                    } else if (args.root == rt) {
                                                        selectedPath = this.node
                                                    }
                                                });
                                                if (selectedPath) {
                                                    scrubbed = selectedPath
                                                }
                                            }
                                            //console.log("result: "     + JSON.stringify(result,null,2));
                                            //console.log("scrubbed  : "     + JSON.stringify(scrubbed,null,2));

                                            if (args.returnDetails) {
                                                returnFn({raw: returnJson, filtered: scrubbed?scrubbed:returnJson})
                                            } else {
                                                if (scrubbed) {
                                                    returnFn(scrubbed)
                                                } else {
                                                    returnFn(returnJson)
                                                }

                                            }

                                    });

                    }

                }

            }
        );

    })

    var ret = await promise


    return ret
}
