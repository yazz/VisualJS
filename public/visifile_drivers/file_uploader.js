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
            do: function(args, returnfn) {
                console.log("1) In File Uploader, calling  a query")
                console.log("2) " + JSON.stringify(args,null,2))
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
