{
    name: 'outlook2010'
    ,
    version: 1
    ,

    type: 'document_driver'
    ,

    functions: [
        {
            on: "startup",
            do: `
            function() {
                console.log("outlook2010 base_component_id")
            }
            `
        }
    ]

}
