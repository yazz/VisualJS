{
    doc_type: 'visifile'
    ,
    name: 'spreadsheetPreview'
    ,
    version: 1
    ,
    type: 'service'
    ,
    text: 'Spreadsheet Preview driver'

    ,
    initText: 'Spreadsheet Preview is ALIVE!!!!'
    ,
    events: {
        "This will return ca preview of spreadsheet data": {
            on: "view_content_as_spreadsheet",
            do: function(args, returnfn) {
                returnfn({
                    html: "<div>This is a spreadsheet preview with nothing in it</div>"
                })
            }, end: null
        }

    }

}
