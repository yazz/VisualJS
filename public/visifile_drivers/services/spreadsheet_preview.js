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
    events: {
        "This will return ca preview of spreadsheet data": {
            on: "view_content_as_spreadsheet",
            do: function(args, returnfn) {
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
                                var returnHtml = "<div>"
                                returnHtml += "<table>"
                                for (var i = 0; i < results.length; i++) {
                                    returnHtml += "<tr>"
                                    //returnHtml += JSON.stringify( results[i] ,null, 2)
                                    var row = eval( "(" + results[i].data + ")")
                                    for (var i2 = 0; i2 < row.length; i2 ++) {
                                        returnHtml += "<td>"
                                        returnHtml += row[i2]
                                        returnHtml += "</td>"
                                    }
                                    returnHtml += "</tr>"
                                }
                                returnHtml += "</table>"
                                returnHtml += "</div>"
                                //console.log(returnHtml)
                                returnfn({
                                    html: returnHtml
                                })

                            })
                }, sqlite3.OPEN_READONLY)



            }, end: null
        }

    }

}
