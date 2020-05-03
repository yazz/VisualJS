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
            brokers: ['localhost:9092','localhost:9092']
        })
        const producer = kafkaConnection.producer()
        const consumer = kafkaConnection.consumer({ groupId: uuidv1() })
        await consumer.connect()
        await consumer.subscribe({ topic: 'test', fromBeginning: true })

        var dd=[]
        await consumer.run({
          eachMessage: async ({ topic, partition, message }) => {
              consumer.pause([{ topic }])
            console.log({
              partition,
              offset: message.offset,
              value: message.value.toString(),
          })
            dd.push(message.value.toString())
            returnfn(dd)
          }
        })

    })
    var ret = await promise
    return ret
}
