async function postgres_sql(args) {
/*
description("Postgres function")
base_component_id("sqlite_server")
load_once_from_file(true)
only_run_on_server(true)
*/
    var config = {
      user:              args.user,
      database:          args.database,
      password:          args.password,
      host:              args.host,
      port:              args.port
    };

    console.log("sqlite_server: " + JSON.stringify(args,null,2));



    let ret = [{name: "dfsfd"}]


    return ret
}
