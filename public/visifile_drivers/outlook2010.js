{
    name: 'outlook2010'
    ,

    type: 'document_driver'
    ,
    
    functions: [
        {
            on: "startup",
            do: `
            function() {
                console.log("outlook2010 driver")
            }
            `
        }
    ]

}
