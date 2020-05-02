async function kafka_service(args) {
/*
description("Kafka Service")
base_component_id("kafka_service")
load_once_from_file(true)
only_run_on_server(true)
*/
    var promise = new Promise(async function(returnfn) {
        var kafkaConnection = new Kafka({
            clientId: 'myapp23',
            brokers: ['localhost:9092','localhost:9092']
        })
        console.log(1)
        const producer = kafkaConnection.producer()
        console.log(2)
        const consumer = kafkaConnection.consumer({ groupId: 'test-group22' })
        console.log(3)
        await consumer.connect()
        console.log(4)
        await consumer.subscribe({ topic: 'test', fromBeginning: true })
        console.log(5)

        var dd=[]
        console.log(6)
        await consumer.run({
          eachMessage: async ({ topic, partition, message }) => {
              consumer.pause([{ topic }])
            console.log({
              partition,
              offset: message.offset,
              value: message.value.toString(),
          })
            dd.push(message.value.toString())
            console.log(8)
            returnfn(dd)
          }
        })

    })
    var ret = await promise
    return ret
}
