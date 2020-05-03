async function kafka_service(args) {
/*
description("Kafka Service")
base_component_id("kafka_service")
load_once_from_file(true)
only_run_on_server(true)
*/
    var promise = new Promise(async function(returnfn) {
        var kafkaConnection = new Kafka({
            clientId: 'myapp',
            brokers: ['localhost:9092']
        })
        const consumer = kafkaConnection.consumer({ groupId: "uuidv1b" })
        await consumer.connect()
        await consumer.subscribe({ topic: 'test', fromBeginning: true })

        var dd=null
        try {
            await consumer.run({
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
        } catch (err)  {
            returnfn({error: err})
        }

    })
    var ret = await promise
    return ret
}
