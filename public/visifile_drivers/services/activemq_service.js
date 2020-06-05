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
            var Stomp = require('stomp-client');
            var destination = args.destination
            var client = new Stomp(args.host, args.port, 'admin', 'admin');
            var a = 1

            client.connect(function(sessionId) {
                client.subscribe(destination, function(body, headers) {
                  console.log('This is the body of a message on the subscribed queue:', body);
                });

                client.publish(destination, 'Oh herrow ' + a++);
                client.publish(destination, 'Oh herrow ' + a++);
                returnfn({success: args})
            });


        } catch (err)  {

            returnfn({error: err})
        }



    })
    var ret = await promise
    return ret
}
