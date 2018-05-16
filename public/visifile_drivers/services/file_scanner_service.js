{
    doc_type: 'visifile'
    ,
    name: 'fileScannerService'
    ,
    max_processes: 1
    ,
    version: 1
    ,
    type: 'service'
    ,
    text: 'File Scanner Service'

    ,
    initText: 'File Scanner Service is ALIVE!!!!'
    ,
    events: {
        "This will scan the local drive": {
            on: {
                    where: "tags like '%||  FOLDER  ||%' and STATUS is NULL"
                },
            do: function(args, returnfn) {
                console.log("**** SCANNING FILE v2 **** " + JSON.stringify(args,null,2))
            }, end: null
        }

    }

}
