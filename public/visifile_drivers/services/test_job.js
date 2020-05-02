function* test_job(args) {
/*
description("Call test_job")
base_component_id("test_job")
load_once_from_file(true)
only_run_on_server(true)
*/

    console.log("test_job: " + JSON.stringify(args,null,2));
    yield(1)
    return {value: "Test job complete"}
}
