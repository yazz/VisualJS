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
            var client = new Stomp(args.host, args.port, args.username, args.password);
            var a = 1

            client.connect(function(sessionId) {
                client.subscribe(destination, function(body, headers) {
                });

                client.publish(destination, 'Oh herrow ' + a++);
                console.log('sending message');
                returnfn({success: args})
            });


        } catch (err)  {

            returnfn({error: err})
        }



    })
    var ret = await promise
    return ret
}
