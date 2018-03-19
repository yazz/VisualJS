{
    name: 'outlook2010'
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
