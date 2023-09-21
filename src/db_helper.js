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
let sqlite3
if (process.versions.bun) {
    sqlite3 =  require("bun:sqlite");
} else {
    sqlite3 =  require("sqlite3");
}


module.exports = {
    createTables: function(dbsearch, callbackFn) {
    //console.log("--------------- createTables: function(dbsearch, callbackFn) {");
    async.map([
                    "CREATE TABLE IF NOT EXISTS system_process_info             (yazz_instance_id	TEXT, process	TEXT, process_id	TEXT, callback_index INTEGER, running_since	TEXT, status TEXT , component_type TEXT, running_start_time_ms INTEGER, event_duration_ms INTEGER, job_priority INTEGER, system_code_id TEXT, PRIMARY KEY (yazz_instance_id, process));",
                    "CREATE TABLE IF NOT EXISTS system_process_errors           (yazz_instance_id	TEXT, id TEXT, timestamp INTEGER, process	TEXT, status TEXT , base_component_id TEXT, event TEXT, system_code_id TEXT, args TEXT, error_message TEXT);",
                    "CREATE TABLE IF NOT EXISTS component_property_types        (base_component_id TEXT, property_name TEXT,  outputs_type TEXT );",
                    "CREATE TABLE IF NOT EXISTS component_property_accept_types (base_component_id TEXT, property_name TEXT,  accept_type TEXT );",
                    "CREATE TABLE IF NOT EXISTS app_allow_co_access             (id TEXT, code_id TEXT, give_access_to_code_id TEXT , access_type TEXT);",
                    "CREATE TABLE IF NOT EXISTS app_db_latest_ddl_revisions     (base_component_id TEXT , latest_revision TEXT);",
                    "CREATE TABLE IF NOT EXISTS system_code                     (id TEXT, base_component_id TEXT, display_name TEXT, component_type TEXT, creation_timestamp INTEGER, parent_id TEXT, fk_user_id TEXT,code TEXT,  logo_url TEXT, visibility TEXT, use_db TEXT, editors TEXT, read_write_status TEXT, properties TEXT, edit_file_path TEXT,  num_changes INTEGER, code_changes TEXT, last_read_from_ipfs INTEGER, score INTEGER, score_reason TEXT, score_total INTEGER);",
                    "CREATE TABLE IF NOT EXISTS yz_cache_released_components    (id TEXT, base_component_id TEXT, component_name TEXT, read_write_status TEXT, component_type TEXT, ipfs_hash TEXT,  version TEXT,  component_description TEXT, logo_url TEXT, avg_rating NUMBER, num_ratings NUMBER, code TEXT);",
                    "CREATE TABLE IF NOT EXISTS comments_and_ratings            (id TEXT, base_component_id TEXT, comment TEXT, rating TEXT, version TEXT, ipfs_hash TEXT, date_and_time INTEGER);",
                    "CREATE TABLE IF NOT EXISTS cookies                         (id TEXT, created_timestamp INTEGER, cookie_name TEXT, cookie_value TEXT, fk_session_id TEXT, host_cookie_sent_to TEXT, from_device_type TEXT);",
                    "CREATE TABLE IF NOT EXISTS sessions                        (id TEXT, created_timestamp INTEGER, last_accessed INTEGER, access_count INTEGER, fk_user_id TEXT);",
                    "CREATE TABLE IF NOT EXISTS users                           (id TEXT, user_type TEXT);",
                    "CREATE TABLE IF NOT EXISTS metamask_logins                 (id TEXT, account_id TEXT, random_seed TEXT, created_timestamp INTEGER, confirmed_login TEXT, fk_session_id TEXT);",
                    "CREATE TABLE IF NOT EXISTS code_tags_table                 (id TEXT, base_component_id TEXT, code_tag TEXT, code_tag_value TEXT, fk_system_code_id TEXT, fk_user_id TEXT, main_score INTEGER);",
                    "CREATE TABLE IF NOT EXISTS ipfs_hashes_queue_to_download   (ipfs_hash TEXT, master_time_millis INTEGER, lcreated_time_millis INTEGER, status TEXT, server TEXT, read_from TEXT, time_read_millis INTEGER  ,  debug_master_time_millis TEXT,  UNIQUE(ipfs_hash));",
                    "CREATE TABLE IF NOT EXISTS ipfs_hashes                     (ipfs_hash TEXT, created_time_millis INTEGER, master_time_millis INTEGER, local_time_millis INTEGER, content_type TEXT, scope TEXT, stored_in_local_file INTEGER, read_from_local_file INTEGER, stored_in_ipfs INTEGER, sent_to_peer INTEGER, received_from_peer INTEGER, pulled_from_peer INTEGER, read_from_local_ipfs INTEGER, read_from_peer_ipfs INTEGER, read_from_peer_file INTEGER , error TEXT , last_ipfs_ping_millis INTEGER, temp_debug_created TEXT, temp_debug_content TEXT,  UNIQUE(ipfs_hash));",


                    "CREATE INDEX IF NOT EXISTS system_code_base_component_id_idx   ON system_code (base_component_id);",
                    "CREATE INDEX IF NOT EXISTS system_code_id_idx                  ON system_code (id);",
                    "CREATE INDEX IF NOT EXISTS system_code_logo_url_idx            ON system_code (logo_url);",
                    "CREATE INDEX IF NOT EXISTS system_code_component_type_idx      ON system_code (component_type);",
                    "CREATE INDEX IF NOT EXISTS ipfs_hashes_idx                     ON ipfs_hashes (ipfs_hash);",
                    "CREATE INDEX IF NOT EXISTS released_components_idx             ON yz_cache_released_components (id);",
                    "CREATE INDEX IF NOT EXISTS comments_and_ratings_idx            ON comments_and_ratings (id);",
                    "CREATE INDEX IF NOT EXISTS cookies_cookie_value_idx            ON cookies (cookie_value);",
                    "CREATE INDEX IF NOT EXISTS sessions_id_idx                     ON sessions (id);",
                    "CREATE INDEX IF NOT EXISTS users_id_idx                        ON users (id);",
                    "CREATE INDEX IF NOT EXISTS metamask_logins_id_idx              ON metamask_logins (id);",
                    "CREATE INDEX IF NOT EXISTS code_tags_id_idx                    ON code_tags_table (id);"
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
