async function serverGetHomeDir(args) {
/*
description("Get the list of available drives")
base_component_id("server_get_home_dir")
load_once_from_file(true)
only_run_on_server(true)
*/


    var homeDir = require('os').homedir();


    return {value: homeDir}
}
