function saveCode( args ) {

    description("Save the editor code")

    var rowhash = crypto.createHash('sha1');
    var row = args.code;
    rowhash.setEncoding('hex');
    rowhash.write(row);
    rowhash.end();
    var sha1sum = rowhash.read();

    dbsearch.serialize(
        function() {
            dbsearch.all(
                " select  " +
                "     id " +
                " from " +
                "     system_code " +
                " where " +
                "     id = ?;"
                ,
                sha1sum
                ,
                function(err, rows) {
                    if (!err) {
                        if (rows.length == 0) {

                            console.log("Saving in Sqlite: " + args.code_id)
                            console.log("Saving in Sqlite: " + args.code)
                            var stmtInsertNewCode = dbsearch.prepare(
                                " insert into   system_code  (id, parent_id, code_tag, code) values (?,?,?,?)");
                            var stmtDeprecateOldCode = dbsearch.prepare(
                                " update system_code  set code_tag = NULL where id = ?");

                            dbsearch.serialize(function() {
                                dbsearch.run("begin exclusive transaction");
                                stmtInsertNewCode.run(
                                      sha1sum,
                                      args.code_id,
                                      "LATEST",
                                      args.code
                                      )
                                stmtDeprecateOldCode.run(
                                    args.code_id
                                    )

                                dbsearch.run("commit");
                                stmtInsertNewCode.finalize();
                                stmtDeprecateOldCode.finalize();

                            })
                        }
                    }


                })
    }, sqlite3.OPEN_READONLY)
    return {}
}
