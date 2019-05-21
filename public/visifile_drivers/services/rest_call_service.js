async function rest_call_service(args) {
/*
description("Postgres function")
base_component_id("postgres_server")
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

    console.log("postgres_server: " + JSON.stringify(args,null,2));

    var promise = new Promise(async function(returnFn) {

        //const url = "https://jsonplaceholder.typicode.com/posts/1";
        const url = "http://127.0.0.1:3000/test/a";

        http.get(url, res => {
          res.setEncoding("utf8");
          let body = "";
          res.on("data", data => {
            body += data;
          });
          res.on("end", () => {
            //body = JSON.parse(body);
            console.log(body);
            returnFn({value: body})
          });
        });

    })
    var ret = await promise


    return ret
}
