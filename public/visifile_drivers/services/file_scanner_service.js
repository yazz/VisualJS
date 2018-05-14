{
    doc_type: 'visifile'
    ,
    name: 'fileScannerService'
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
            on: "scan_files",
            do: function(args, returnfn) {


            }, end: null
        }

    }

}
