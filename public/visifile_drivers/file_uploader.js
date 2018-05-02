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
            do: function(record) {
                console.log("1) In File Uploader, calling  a query")
                callDriverMethod( "commandLine",
                                  "ls"
                                  ,{text: "From file uploader"}
                            ,
                            function(result) {
                                console.log("3) returned result: " + JSON.stringify(result,null,2))
                            })
                        },
            end: null
        },

    }

}
