{
    doc_type: 'visifile'
    ,
    name: 'fileScannerService'
    ,
    max_processes: 1
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
            on: {
                    where: "tags like '%||  FOLDER  ||%' and STATUS is NULL"
                },
            do: function(folderRecords, returnfn) {
                var folderRecord = folderRecords[0]
                //console.log("**** SCANNING FILE v2 **** " + JSON.stringify( folderRecord ,null,2))


                try {

                    fs.readdir(folderRecord.name, function(err, list) {
                        if (err) {
                            console.log(err)
                        } else {
                            list.forEach(function(file) {
                                var fullFilePath = path.join(folderRecord.name , file)

                                findDriverWithMethod(   "can_handle_" + getFileExtension(fullFilePath)
                                                        ,
                                                        function(driverName) {

                                                            if (driverName) {

                                                                console.log("Full path: " + fullFilePath)
                                                                console.log("Extension: " + getFileExtension(fullFilePath))
                                                                var stmtAddFileForUpload = dbsearch.prepare( " insert  into  all_data " +
                                                                                                        "     ( id,  tags, properties ) " +
                                                                                                        " values " +
                                                                                                        "     ( ?, '||  UPLOAD  ||' , ? );");
                                                                dbsearch.serialize(
                                                                    function() {
                                                                        dbsearch.run("begin exclusive transaction");
                                                                        var newFileId   = uuidv1();
                                                                        stmtAddFileForUpload.run(
                                                                            newFileId,
                                                                            '||  path='+fullFilePath+'  ||')
                                                                        dbsearch.run("commit");
                                                                 })
                                                            }
                                                        })
                                                    })
                            dbsearch.serialize(
                                function() {
                                    dbsearch.run("begin exclusive transaction");
                                    stmtSetDataStatus.run(
                                        "INDEXED",
                                        folderRecord.id)
                                    dbsearch.run("commit",function(){
                                        returnfn()
                                    });
                             })
                         }
                  })


                } catch (err) {
                    console.log(err);
                    var stack = new Error().stack
                    console.log( stack )
                }
            }, end: null
        }

    }

}
