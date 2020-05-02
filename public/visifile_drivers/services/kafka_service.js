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
        brokers: ['localhost:2181']
    })

    return {value: "Kafka"}
}
