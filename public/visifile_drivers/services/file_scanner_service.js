{
    doc_type: 'visifile'
    ,
    name: 'fileScannerService'
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
            on: "scan_files",
            do: function(args, returnfn) {
                console.log("**** SCANNING FILE SYSTEM v2 ****")
                var useDrive = "C:\\";
                if (!isWin) {
                    useDrive = '/';
                }
                var stmtResetFolders = dbsearch.prepare( " update   folders   set status = NULL ");

                var stmtResetFiles   = dbsearch.prepare( " update   files   set status = 'INDEXED' where status = 'REINDEXED' ");
                var fileFilter = /\xlsx$|csv$|docx$|pdf$|glb$/
                var     stmtInsertIntoFolders = dbsearch.prepare(   " insert into folders " +
                                                                "    ( id, name, path, changed_count ) " +
                                                                " values " +
                                                                "    (?, ?, ?, 0);");


                var addFolderForIndexingIfNotExist = function (folderName) {
                    //console.log("    10: " + folderName)
                    dbsearch.serialize(
                        function() {

                    var stmt = dbsearch.all(
                        "select id from folders where path = ?",
                        [folderName],
                        function(err, results)
                        {
                            if (!err)
                            {
                                if (results.length == 0) {
                                    var newId = uuidv1();

                                    dbsearch.serialize(
                                        function() {
                                            dbsearch.run("begin exclusive transaction");
                                            stmtInsertIntoFolders.run(
                                                newId,
                                                folderName,
                                                folderName)
                                            dbsearch.run("commit")
                                        })
                                    }
                            } else {
                                console.log(err)
                            }
                        });
                    }, sqlite3.OPEN_READONLY)
                }
                var fromDir = function (startPath,filter,callback){

                    //console.log('Starting from dir '+startPath+'/');

                    if (!fs.existsSync(startPath)){
                        console.log("no dir ",startPath);
                        return;
                    }

                    var files=fs.readdirSync(startPath);
                    for(var i=0;i<files.length;i++){
                        var filename=path.join(startPath,files[i]);
                        //console.log("    7: " + filename)
                        try {
                            var stat = fs.lstatSync(filename);
                            if (stat.isDirectory()){
                                if (
                                (filename.toUpperCase().indexOf("WINDOWS") != -1 )
                                ||
                                (filename.toUpperCase().indexOf("PROGRAM") != -1 )
                                ||
                                (filename.toUpperCase().indexOf("RECYCLE") != -1 )
                                ||
                                (filename.toUpperCase().indexOf("LIBRARY") != -1 )
                                ||
                                (filename.toUpperCase().indexOf("APPLICATIONS") != -1 )
                                ) {
                                    // do nothing
                                    //console.log("    9 ignore: " + dirname)
                                } else {
                                    fromDir(filename,filter,callback); //recurse
                                }
                            }
                            else if (filter.test(filename)) callback(filename);
                        } catch(err) {
                            //console.log(filename + " COULD NOT BE READ: " + err + " ");
                            //var stack = new Error().stack
                            //console.log( stack )
                        }
                    };
                };
                var directSearchFolders = function (drive) {
                    console.log("    4")
                    fromDir(drive,fileFilter,function(filename){
                        //console.log("    8")
                        var dirname = path.dirname(filename)


                        if (
                        (dirname.toUpperCase().indexOf("WINDOWS") != -1 )
                        ||
                        (dirname.toUpperCase().indexOf("PROGRAM") != -1 )
                        ||
                        (dirname.toUpperCase().indexOf("RECYCLE") != -1 )
                        ||
                        (dirname.toUpperCase().indexOf("LIBRARY") != -1 )
                        ||
                        (dirname.toUpperCase().indexOf("APPLICATIONS") != -1 )
                        ) {
                            // do nothing
                            //console.log("    9 ignore: " + dirname)
                        } else {
                            //console.log('DIRNAME: ',dirname.toUpperCase());
                            //console.log('-- found in folder: ',dirname);
                            addFolderForIndexingIfNotExist(dirname)
                        }
                    });
                }
                console.log("    2")

                dbsearch.serialize(
                    function() {
                        dbsearch.run("begin exclusive transaction");
                        stmtResetFolders.run()
                        stmtResetFiles.run()
                        dbsearch.run("commit",
                            function(err) {
                                console.log("    3")
                                directSearchFolders(useDrive);
                                console.log('******************* Finished finding folders');
                                returnfn({done: true})
                                });
                            })
            }, end: null
        }

    }

}
