async function kafka_service(args) {
/*
description("Kafka Service")
base_component_id("kafka_service")
load_once_from_file(true)
only_run_on_server(true)
*/
    var promise = new Promise(async function(returnfn) {

        var kafkaConnection = new Kafka({
            clientId: args.client_id,
            brokers: args.brokers,
            connectionTimeout: 1000,
            requestTimeout: 1000,
            initialRetryTime: 100,
            retries: 0
        })


        //
        //    read_single_message
        //
        if (args.action  == "read_single_message") {
            try {
                const consumer = kafkaConnection.consumer({ groupId: uuidv1() })
                await consumer.connect()
                await consumer.subscribe({ topic: args.topic, fromBeginning: true })

                var dd=null
                 consumer.run({
                  eachMessage: async function(ee) {
                      consumer.pause([{ topic: ee.topic }])
                      dd={
                          partition: ee.partition,
                          offset: ee.message.offset,
                          value: ee.message.value.toString()
                      }
                      console.log(dd)
                      consumer.disconnect()
                      returnfn(dd)
                  }
                })
                if (args.offset) {
                    consumer.seek({ topic: args.topic, partition: args.partition, offset: args.offset })
                }
            } catch (err)  {
                console.log(5)

                returnfn({error: err})
            }




        //
        //    test_connection
        //
        } else if (args.action  == "test_connection") {
            try {
                const consumer = kafkaConnection.consumer({ groupId: uuidv1() })
                await consumer.connect()
                returnfn({success: true})

            } catch (err)  {

                returnfn({error: err})
            }
        }


    })
    var ret = await promise
    return ret
}
