function saveCode( args ) {

    description("Save the editor code")
    
    console.log("Saving in Sqlite: " + args.code_id)
    console.log("Saving in Sqlite: " + args.code)
    var stmtUpdateCode = dbsearch.prepare(" update   system_code   set code = ? where id = ?");
        dbsearch.serialize(function() {
        dbsearch.run("begin exclusive transaction");
        stmtUpdateCode.run(
              args.code,
              args.code_id)

        dbsearch.run("commit");
        stmtUpdateCode.finalize();

    })
    return {}
}
