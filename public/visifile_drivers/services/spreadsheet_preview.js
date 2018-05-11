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
                var hash = args.hash
                var returnHtml = "<div>"
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
                                for (var i = 0; i < results.length; i++) {
                                    returnHtml += JSON.stringify(results[i],null,2)
                                }
                                returnHtml += "</div>"

                                returnfn({
                                    html: returnHtml
                                })

                            })
                }, sqlite3.OPEN_READONLY)



            }, end: null
        }

    }

}
