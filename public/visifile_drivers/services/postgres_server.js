async function postgres_sql(args) {
/*
description("Postgres function")
base_component_id("postgres_server")
load_once_from_file(true)
only_run_on_server(true)
*/
    var config = {
      user:              "postgres",
      database:          "postgres",
      password:          "mysecretpassword",  // this password is only used for testing so no security problem here
      host:              "localhost",
      port:               5432
    };

    console.log("postgres_server: " + JSON.stringify(args,null,2));

    var promise = new Promise(async function(returnFn) {

        var dbconnection = new postgresdb.Client(config);
        dbconnection.connect(function (err) {
          if (err) {
              console.log({error: '' + err});
              returnFn({err: err})
          } else {
              dbconnection.query(args.sql, [], function (err, result) {
                if (err) {
                    console.log({error: '' + err});
                } else {
                    console.log("row count: " + result.rows.length); // outputs: { name: 'brianc' }
                    returnFn({result: result.rows})
                };
              })

          }
        });

    })
    var ret = await promise


    return ret
}
