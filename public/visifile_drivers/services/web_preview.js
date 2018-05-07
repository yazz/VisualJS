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
                returnfn({
                    html: `
                        <div>Some text</div>
                    `
                })
            }, end: null
        }

    }

}
