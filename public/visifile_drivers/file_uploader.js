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
                console.log("1) In File Uploader, calling  a query")
                console.log("2) " + JSON.stringify(records,null,2))
                var record = records[0]
                var property = getProperty(record,"path")
                console.log("3) " + JSON.stringify(property,null,2))
                console.log("4) getFileExtension=" + getFileExtension(property))

                /*callDriverMethod( "commandLine",
                                  "ls"
                                  ,{text: "From file uploader"}
                            ,
                            function(result) {
                                console.log("3) returned result: " + JSON.stringify(result,null,2))
                                returnfn()
                            })*/
                            returnfn()
                        },
            end: null
        },

    }

}
