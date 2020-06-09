async function activemq_service(args) {
/*
description("ActiveMQ Service")
base_component_id("activemq_service")
load_once_from_file(true)
only_run_on_server(true)
*/
    var promise = new Promise(async function(returnfn) {

        //
        //    test_connection
        //
        try {
            const stompit = require('stompit');
console.log(1)
            const connectOptions = {
              'host': args.host,
              'port': args.port,
              'connectHeaders':{
                'host': '/',
                'login': args.username,
                'passcode': args.password
              }
            };

            stompit.connect(connectOptions, function(error, client) {
                console.log(2)

              if (error) {
                console.log('connect error ' + error.message);
                return;
              }

              const sendHeaders = {
                'destination':args.destination,
                'content-type': 'text/plain'
              };
              console.log(3)

              const frame = client.send(sendHeaders);
              frame.write(args.message);
              frame.end();
              console.log(4)
              client.disconnect();
              returnfn({success: args})

            });



        } catch (err)  {
            console.log(6)

            returnfn({error: err})
        }



    })
    var ret = await promise
    return ret
}
