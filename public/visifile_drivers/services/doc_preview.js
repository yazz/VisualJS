{
    doc_type:       'visifile',
    name:           'docPreview', version: 1,
    description:    'service for previewing document',



    events: {
        "This will return a preview of Document data": {
            on: "view_content_as_document",
            do: async function(args) {
                var promise = new Promise( success => {

                    var hash = args.hash
                    dbsearch.serialize(
                        function() {

                            dbsearch.all(
                                `                select
                                                    data
                                                from
                                                    search_rows_hierarchy_2,
                                                	zfts_search_rows_hashed_2
                                                where
                                                        document_binary_hash = ?
                                                	and
                                                	    row_hash = child_hash
                                `
                                ,
                                hash
                                ,

                                function(err, results)
                                {
                                    var returnHtml = "<div>Doc Preview"
                                    returnHtml += "<table>"
                                    for (var i = 0; i < results.length; i++) {
                                        returnHtml += "<tr>"
                                        //returnHtml += JSON.stringify( results[i] ,null, 2)
                                        var row = eval("(" + results[i].data + ")")
                                        returnHtml += "<td>"
                                        returnHtml += row.value
                                        returnHtml += "</td>"
                                        returnHtml += "</tr>"
                                    }
                                    returnHtml += "</table>"
                                    returnHtml += "</div>"
                                    //console.log(returnHtml)
                                    success({
                                        html: returnHtml
                                    })

                                })
                    }, sqlite3.OPEN_READONLY)
                })

                var ret = await promise
                return ret



            }, end: null
        }

    }

}
