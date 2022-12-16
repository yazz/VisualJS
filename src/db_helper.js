var async           = require('async');
var path                        = require('path');

let nodeModulesPath = process.cwd()
if (process.execPath) {
    let vjsPos = process.execPath.indexOf("vjs")
    if (vjsPos != -1) {
        let vjsLen = process.execPath.length - vjsPos
        nodeModulesPath = process.execPath.substring(0, process.execPath.length - vjsLen);
    }
}




let sqlNodePath = path.join(nodeModulesPath,'node_modules/sqlite3')
//console.log("sqlNodePath: " + sqlNodePath)
var sqlite3                  = require(sqlNodePath);



module.exports = {
    createTables: function(dbsearch, callbackFn) {
    //console.log("--------------- createTables: function(dbsearch, callbackFn) {");
    async.map([

            "CREATE TABLE IF NOT EXISTS system_process_info (yazz_instance_id	TEXT, process	TEXT, process_id	TEXT, callback_index INTEGER, running_since	TEXT, status TEXT , component_type TEXT, running_start_time_ms INTEGER, event_duration_ms INTEGER, job_priority INTEGER, system_code_id TEXT, PRIMARY KEY (yazz_instance_id, process));",

            "CREATE TABLE IF NOT EXISTS system_process_errors (yazz_instance_id	TEXT, id TEXT, timestamp INTEGER, process	TEXT, status TEXT , base_component_id TEXT, event TEXT, system_code_id TEXT, args TEXT, error_message TEXT);",

            "CREATE TABLE IF NOT EXISTS app_dependencies (id TEXT, code_id	TEXT, dependency_type TEXT , dependency_name TEXT, dependency_version TEXT);",
            "CREATE INDEX IF NOT EXISTS app_dependencies_code_id_id_idx ON app_dependencies (code_id);",

            "CREATE TABLE IF NOT EXISTS component_properties (component_name TEXT, property_name TEXT);",


            "CREATE TABLE IF NOT EXISTS component_property_types (component_name TEXT, property_name TEXT,  type_name TEXT, type_value TEXT);",
            "CREATE TABLE IF NOT EXISTS component_property_accept_types (component_name TEXT, property_name TEXT,  accept_type_name TEXT,  accept_type_value TEXT);",


            "CREATE TABLE IF NOT EXISTS component_usage (base_component_id TEXT, child_component_id, UNIQUE(base_component_id, child_component_id));",
            "CREATE INDEX IF NOT EXISTS component_usage_base_component_id_idx ON component_usage (base_component_id);",
            "CREATE INDEX IF NOT EXISTS component_usage_child_component_id_idx ON component_usage (child_component_id);",

            "CREATE TABLE IF NOT EXISTS app_allow_co_access (id TEXT, code_id TEXT, give_access_to_code_id TEXT , access_type TEXT);",

            "CREATE TABLE IF NOT EXISTS app_db_latest_ddl_revisions (base_component_id TEXT , latest_revision TEXT);",

            "CREATE TABLE IF NOT EXISTS system_code (id TEXT, base_component_id TEXT, display_name TEXT, component_type TEXT,  ipfs_hash_id TEXT, creation_timestamp INTEGER, parent_id TEXT, fk_user_id TEXT,code TEXT, max_processes INTEGER, code_tag TEXT,  component_options TEXT, logo_url TEXT, visibility TEXT, interfaces TEXT, use_db TEXT, editors TEXT, read_write_status TEXT, properties TEXT, edit_file_path TEXT,  subscribed TEXT, code_tag_v2 TEXT, num_changes INTEGER, code_changes TEXT, last_read_from_ipfs INTEGER, score INTEGER, score_reason TEXT, score_total INTEGER);",
            "CREATE INDEX IF NOT EXISTS system_code_base_component_id_idx ON system_code (base_component_id);",
            "CREATE INDEX IF NOT EXISTS system_code_id_idx                ON system_code (id);",
            "CREATE INDEX IF NOT EXISTS system_code_logo_url_idx          ON system_code (logo_url);",
            "CREATE INDEX IF NOT EXISTS system_code_code_tag_idx          ON system_code (code_tag);",
            "CREATE INDEX IF NOT EXISTS system_code_component_type_idx    ON system_code (component_type);",

            "CREATE TABLE IF NOT EXISTS ipfs_hashes (ipfs_hash TEXT, content_type TEXT, ping_count INTEGER, last_pinged INTEGER, UNIQUE(ipfs_hash));",
            "CREATE INDEX IF NOT EXISTS ipfs_hashes_idx                   ON ipfs_hashes (ipfs_hash);",


            "CREATE TABLE IF NOT EXISTS released_components (id TEXT, base_component_id TEXT, component_name TEXT, read_write_status TEXT, component_type TEXT, ipfs_hash TEXT,  version TEXT,  component_description TEXT, icon_image_id TEXT, avg_rating NUMBER, num_ratings NUMBER);",
            "CREATE INDEX IF NOT EXISTS released_components_idx                      ON released_components (id);",


            "CREATE TABLE IF NOT EXISTS comments_and_ratings (id TEXT, base_component_id TEXT, comment TEXT, rating TEXT, version TEXT, ipfs_hash TEXT, date_and_time INTEGER);",
            "CREATE INDEX IF NOT EXISTS comments_and_ratings_idx          ON comments_and_ratings (id);",


            "CREATE TABLE IF NOT EXISTS icon_images (id TEXT, app_icon_data TEXT, UNIQUE(id));",
            "CREATE INDEX IF NOT EXISTS app_icon_data_as_id_idx           ON icon_images (id);",

            "CREATE TABLE IF NOT EXISTS cookies (id TEXT, created_timestamp INTEGER, cookie_name TEXT, cookie_value TEXT, fk_session_id TEXT, host_cookie_sent_to TEXT, from_device_type TEXT);",
            "CREATE INDEX IF NOT EXISTS cookies_cookie_value_idx           ON cookies (cookie_value);",

            "CREATE TABLE IF NOT EXISTS sessions (id TEXT, created_timestamp INTEGER, last_accessed INTEGER, access_count INTEGER, fk_user_id TEXT);",
            "CREATE INDEX IF NOT EXISTS sessions_id_idx           ON sessions (id);",

            "CREATE TABLE IF NOT EXISTS users (id TEXT, user_type TEXT);",
            "CREATE INDEX IF NOT EXISTS users_id_idx           ON users (id);",

            "CREATE TABLE IF NOT EXISTS metamask_logins (id TEXT, account_id TEXT, random_seed TEXT, created_timestamp INTEGER, confirmed_login TEXT, fk_session_id TEXT);",
            "CREATE INDEX IF NOT EXISTS metamask_logins_id_idx ON metamask_logins (id);",

            "CREATE TABLE IF NOT EXISTS code_tags (id TEXT, base_component_id TEXT, code_tag TEXT, fk_system_code_id TEXT, fk_user_id TEXT, main_score INTEGER);",
            "CREATE INDEX IF NOT EXISTS code_tags_id_idx           ON code_tags (id);"

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
