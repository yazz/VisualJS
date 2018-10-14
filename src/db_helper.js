'use strict';
var async           = require('async');
var sqlite3         = require('sqlite3');

module.exports = {
    createTables: function(dbsearch, callbackFn) {
    console.log("--------------- createTables: function(dbsearch, callbackFn) {");
    async.map([

            "CREATE TABLE IF NOT EXISTS intranet_client_connects (id TEXT, internal_host TEXT, internal_port INTEGER, public_ip TEXT, via TEXT, public_host TEXT, user_name TEXT, client_user_name TEXT, when_connected INTEGER);",

            "CREATE TABLE IF NOT EXISTS system_process_info (process	TEXT PRIMARY KEY, process_id	TEXT, running_since	TEXT, status TEXT , last_driver TEXT, last_event TEXT, job_priority INTEGER, system_code_id TEXT);",

            "CREATE TABLE IF NOT EXISTS system_process_errors (id TEXT, timestamp INTEGER, process	TEXT, status TEXT , base_component_id TEXT, event TEXT, system_code_id TEXT, args TEXT, error_message TEXT);",

            "CREATE TABLE IF NOT EXISTS app_dependencies (id TEXT, code_id	TEXT, dependency_type TEXT , dependency_name TEXT, dependency_version TEXT);",
            "CREATE INDEX IF NOT EXISTS app_dependencies_code_id_id_idx ON app_dependencies (code_id);",

            "CREATE TABLE IF NOT EXISTS component_usage (base_component_id TEXT, child_component_id, UNIQUE(base_component_id, child_component_id));",
            "CREATE INDEX IF NOT EXISTS component_usage_base_component_id_idx ON component_usage (base_component_id);",
            "CREATE INDEX IF NOT EXISTS component_usage_child_component_id_idx ON component_usage (child_component_id);",

            "CREATE TABLE IF NOT EXISTS app_allow_co_access (id TEXT, code_id TEXT, give_access_to_code_id TEXT , access_type TEXT);",

            "CREATE TABLE IF NOT EXISTS app_db_latest_ddl_revisions (base_component_id TEXT , latest_revision TEXT);",

            "CREATE TABLE IF NOT EXISTS system_code (id TEXT, on_condition TEXT, component_type TEXT, base_component_id TEXT,method TEXT, code TEXT, max_processes INTEGER, code_tag TEXT, parent_id TEXT, creation_timestamp INTEGER, display_name TEXT, component_options TEXT, logo_url TEXT, visibility TEXT, interfaces TEXT, use_db TEXT, editors TEXT, read_write_status TEXT, properties TEXT);",
            "CREATE INDEX IF NOT EXISTS system_code_base_component_id_idx ON system_code (base_component_id);",
            "CREATE INDEX IF NOT EXISTS system_code_on_condition_idx      ON system_code (on_condition);",
            "CREATE INDEX IF NOT EXISTS system_code_id_idx                ON system_code (id);",
            "CREATE INDEX IF NOT EXISTS system_code_logo_url_idx          ON system_code (logo_url);",
            "CREATE INDEX IF NOT EXISTS system_code_code_tag_idx          ON system_code (code_tag);"

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
            callbackFn.call(this);
        });
        }
    }
