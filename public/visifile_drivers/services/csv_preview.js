{
    doc_type: 'visifile'
    ,
    name: 'csvPreview'
    ,
    version: 1
    ,
    type: 'service'
    ,
    text: 'CSV Preview base_component_id'

    ,
    events: {
        "This will return ca preview of CSV data": {
            on: "view_content_as_csv",
            do: async function(args) {
              var promise = new Promise(returnfn => {
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
                                var returnHtml = "<div>CSV Preview"
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

              })
              var ret = await promise
              return ret



            }, end: null
        }

    }

}
