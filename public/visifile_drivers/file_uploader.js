{
    name: 'fileuploader'
    ,
    version: 1
    ,
    type: 'basic'
    ,
    text: 'File Uploader'

    ,
    initText: 'file uploader is ALIVE!!!!'
    ,
    events: {


        "This function is when a file is uploaded to the system":
        {
            on: {
                where: "tags like '%||  UPLOAD  ||%'"
            },
            do: function(records, returnfn) {
                //console.log("1) In File Uploader, calling  a query")
                //console.log("2) " + JSON.stringify(records,null,2))
                var record =   getFirstRecord(records)
                var property = getProperty(record,"path")
                //console.log("3) " + JSON.stringify(property,null,2))
                //console.log("4) getFileExtension=" + getFileExtension(property))
                findDriverWithMethod(   "can_handle_" + getFileExtension(property)
                                        ,
                                        function(driverName) {

                                            if (driverName) {
                                                //console.log("5) Driver:" + driverName)
                                                callDriverMethod( driverName,
                                                                  "can_handle_" + getFileExtension(property),
                                                                  {fileName: property}
                                                            ,
                                                            function(result) {
                                                                //console.log("3) returned result: " + JSON.stringify(result,null,2))
                                                                 var sha1ofFileContents = createHashedDocumentContent(property, getFileExtension(property))
                                                                saveDocumentContent(sha1ofFileContents,result)
                                                                setStatus(record, "SAVED")
                                                                returnfn()
                                                            })

                                            } else {
                                                console.log("5) No driver can handle: " + getFileExtension(property))
                                                setStatus(record, "ERROR")
                                                returnfn()
                                            }

                })


                        },
            end: null
        },

    }

}
