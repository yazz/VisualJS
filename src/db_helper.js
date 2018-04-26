'use strict';
var async           = require('async');
var sqlite3                     = require('sqlite3');

module.exports = {
    createTables: function(dbsearch, callbackFn) {
    console.log("--------------- createTables: function(dbsearch, callbackFn) {");
    async.map([
            "CREATE TABLE IF NOT EXISTS search_rows_hierarchy (document_binary_hash TEXT, parent_hash TEXT, child_hash TEXT);",


            "CREATE INDEX IF NOT EXISTS search_rows_hierarchy_document_binary_hash_idx ON search_rows_hierarchy (document_binary_hash);",


            "CREATE INDEX IF NOT EXISTS search_rows_hierarchy_parent_hash_idx ON search_rows_hierarchy (parent_hash);",


            "CREATE INDEX IF NOT EXISTS search_rows_hierarchy_child_hash_idx ON search_rows_hierarchy (child_hash);",


            "CREATE TABLE IF NOT EXISTS drivers (id TEXT, name TEXT, type TEXT, code TEXT, version_number INTEGER);",


            "CREATE TABLE IF NOT EXISTS files (id TEXT, contents_hash TEXT, size INTEGER, path TEXT, orig_name TEXT, fk_connection_id TEXT, status TEXT);",

            "CREATE TABLE IF NOT EXISTS messages (id TEXT, source_id TEXT, contents_hash TEXT, size INTEGER, path TEXT, source TEXT, " +
            "subject TEXT, received_by_name TEXT, received_time INTEGER, recipients TEXT, sender_name TEXT, sent TEXT, sent_on TEXT, sent_on_behalf_of_name TEXT," +
            "to_email TEXT, body_format TEXT, send_using_account TEXT, task_subject TEXT, sender TEXT, cc TEXT, bcc TEXT, unread TEXT, sensitivity TEXT," +
            "outlook_version TEXT, outlook_internal_version TEXT," +
            "fk_connection_id TEXT, status TEXT);",


            "CREATE TABLE IF NOT EXISTS contents (id TEXT, content BLOB, content_type TEXT, UNIQUE (id) ON CONFLICT IGNORE);",


            "CREATE TABLE IF NOT EXISTS folders (id TEXT, name TEXT, path TEXT, parent_id TEXT, status TEXT, changed_count INTEGER, UNIQUE (path) ON CONFLICT IGNORE);",


            "CREATE TABLE IF NOT EXISTS connections (id TEXT, name TEXT, driver TEXT, database TEXT, host TEXT, port TEXT ,connectString TEXT, user TEXT, password TEXT, fileName TEXT, type TEXT, preview TEXT, status TEXT);",


            "CREATE TABLE IF NOT EXISTS relationships (id TEXT, source_query_hash TEXT, target_query_hash TEXT, " +
                "similar_row_count INTEGER, new_source INTEGER, new_target INTEGER, edited_source INTEGER, edited_target INTEGER, deleted_source INTEGER, deleted_target INTEGER, array_source INTEGER, array_target INTEGER);",


            "CREATE TABLE IF NOT EXISTS data_states (id TEXT, name TEXT, connection TEXT, driver TEXT, size INTEGER, hash TEXT, type TEXT, fileName TEXT, definition TEXT, preview TEXT, status TEXT, index_status TEXT, similar_count INTEGER, related_status TEXT, when_timestamp INTEGER);",


            "CREATE TABLE IF NOT EXISTS intranet_client_connects (id TEXT, internal_host TEXT, internal_port INTEGER, public_ip TEXT, via TEXT, public_host TEXT, user_name TEXT, client_user_name TEXT, when_connected INTEGER);",

            "CREATE TABLE IF NOT EXISTS data_atlas ( id	TEXT, type	TEXT,name	TEXT, parent	TEXT,parent_root	TEXT,properties	TEXT);",

            "CREATE TABLE IF NOT EXISTS system_process_info (process	TEXT PRIMARY KEY, process_id	TEXT, running_since	TEXT, job_count	INTEGER);",

            "CREATE TABLE IF NOT EXISTS system_process_jobs (id	TEXT,	driver	TEXT,	method	TEXT,	status	TEXT,	args	TEXT,	return_value	TEXT,	creation_time	INTEGER,	execution_duration	INTEGER,process	TEXT);",

            "CREATE TABLE IF NOT EXISTS system_code (id TEXT,	driver TEXT,method TEXT, code TEXT);"
                ],

        function(a,b){
            try {
                dbsearch.serialize(function()
                {
                    //console.log(a);
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
                dbsearch.serialize(function() {
                    var stmt = dbsearch.all(
                    "SELECT name FROM sqlite_master WHERE type='table' AND name='zfts_search_rows_hashed';",
                    function(err, results)
                    {
                        if (!err)
                        {
                            console.log("Count zfts_search_rows_hashed: " + results);
                            if( results.length == 0)
                            {
                                console.log("   ... creating");
                                dbsearch.serialize(function()
                                {
                                    console.log("    Create   zfts_search_rows_hashed");
                                    dbsearch.run("CREATE VIRTUAL TABLE zfts_search_rows_hashed USING fts5(row_hash, data);")

                                    console.log("       ...done");
                                });
                            }
                            callbackFn.call(this);

                        }
                    })
                }, sqlite3.OPEN_READONLY);
            } catch(err) {
                console.log(err);
            } finally {
            }});
        }
    }
