'use strict';
var async           = require('async');


module.exports = {
    createTables: function(dbsearch, callbackFn) {
    async.map([
            "CREATE TABLE IF NOT EXISTS search_rows_hierarchy (document_binary_hash TEXT, parent_hash TEXT, child_hash TEXT);",


            "CREATE INDEX IF NOT EXISTS search_rows_hierarchy_document_binary_hash_idx ON search_rows_hierarchy (document_binary_hash);",


            "CREATE INDEX IF NOT EXISTS search_rows_hierarchy_parent_hash_idx ON search_rows_hierarchy (parent_hash);",


            "CREATE INDEX IF NOT EXISTS search_rows_hierarchy_child_hash_idx ON search_rows_hierarchy (child_hash);",


            "CREATE TABLE IF NOT EXISTS drivers (id TEXT, name TEXT, type TEXT, code TEXT);",


            "CREATE TABLE IF NOT EXISTS files (id TEXT, name TEXT, contents_hash TEXT, size INTEGER, path TEXT, orig_name TEXT, extension TEXT, status TEXT);",


            "CREATE TABLE IF NOT EXISTS contents (id TEXT, content BLOB, UNIQUE (id) ON CONFLICT IGNORE);",


            "CREATE TABLE IF NOT EXISTS folders (id TEXT, name TEXT, path TEXT, parent_id TEXT, status TEXT, changed_count INTEGER, UNIQUE (path) ON CONFLICT IGNORE);",


            "CREATE TABLE IF NOT EXISTS connections (id TEXT, name TEXT, driver TEXT, database TEXT, host TEXT, port TEXT ,connectString TEXT, user TEXT, password TEXT, fileName TEXT, type TEXT, preview TEXT, status TEXT);",


            "CREATE TABLE IF NOT EXISTS relationships (id TEXT, source_query_hash TEXT, target_query_hash TEXT, " +
                "similar_row_count INTEGER, new_source INTEGER, new_target INTEGER, edited_source INTEGER, edited_target INTEGER, deleted_source INTEGER, deleted_target INTEGER, array_source INTEGER, array_target INTEGER);",


            "CREATE TABLE IF NOT EXISTS queries (id TEXT, name TEXT, connection INTEGER, driver TEXT, size INTEGER, hash TEXT, type TEXT, fileName TEXT, definition TEXT, preview TEXT, status TEXT, index_status TEXT, similar_count INTEGER, related_status TEXT, when_timestamp INTEGER);",


            "CREATE TABLE IF NOT EXISTS intranet_client_connects (id TEXT, internal_host TEXT, internal_port INTEGER, public_ip TEXT, via TEXT, public_host TEXT, user_name TEXT, client_user_name TEXT, when_connected INTEGER);"

                ],

        function(a,b){
            try {
                dbsearch.serialize(function()
                {
                    dbsearch.run(a);
                });
                return b(null,a);
            } catch(err) {
                console.log(err);
                return b(null,a);
            }
        },

        function(err, results){
            //console.log("async test ");
            //console.log("    err= " + JSON.stringify(err,null,2));
            //console.log("    res= " + JSON.stringify(results,null,2));

            try
            {
                var stmt = dbsearch.all(
                    "SELECT name FROM sqlite_master WHERE type='table' AND name='zfts_search_rows_hashed';",
                    function(err, results)
                    {
                        if (!err)
                        {
                            if( results.length == 0)
                            {
                                dbsearch.serialize(function()
                                {
                                    dbsearch.run("CREATE VIRTUAL TABLE zfts_search_rows_hashed USING fts5(row_hash, data);");
                                });
                            }
                            callbackFn.call(this);

                        }
                    });
            } catch(err) {
                console.log(err);
            } finally {
            }});
        }
    }
