async function kafka_service(args) {
/*
description("Kafka Service")
base_component_id("kafka_service")
load_once_from_file(true)
only_run_on_server(true)
*/

    console.log("test_job: " + JSON.stringify(args,null,2));
    console.log("Kafka: " + JSON.stringify(Kafka,null,2));
    var kafkaConnection = new Kafka({
        clientId: 'my-app',
        brokers: ['localhost:9092']
    })
    const producer = kafkaConnection.producer()
    const consumer = kafkaConnection.consumer({ groupId: 'test-group' })
    await consumer.connect()
    await consumer.subscribe({ topic: 'test2', fromBeginning: true })

    var dd=[]
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log({
          partition,
          offset: message.offset,
          value: message.value.toString(),
        })
        dd.push(message.value.toString())
      },
    })
    return {value: "Kafka"}
}
