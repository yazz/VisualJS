{
    name: 'webPreview'
    ,
    version: 1
    ,
    type: 'service'
    ,
    text: 'Web Preview driver'

    ,
    initText: 'Web Preview  is ALIVE!!!!'
    ,
    events: {
        "This will return code used to show a preview of a document": {
            on: "preview",
            do: function(args, returnfn) {
                var methodToSearchFor = "content_preview_for_" + args.extension
                findDriverWithMethod(   methodToSearchFor
                                        ,
                                        function(driverName) {

                                            if (driverName) {
                                                //console.log("5) Driver:" + driverName)
                                                callDriverMethod( driverName,
                                                                  methodToSearchFor,
                                                                  {}
                                                            ,
                                                            function(result) {
                                                            })
                                            } else {
                                                returnfn({
                                                    html: `
                                                        <div>Can not preview</div>
                                                    `
                                                })
                                            }
                                        })
            }, end: null
        }

    }

}
