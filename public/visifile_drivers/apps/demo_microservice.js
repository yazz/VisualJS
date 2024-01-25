function demo_microservice(args) {
/*
base_component_id("demo_microservice")
hash_algorithm("SHA256")
display_name("Demo microservice")
only_run_on_server(true)
visibility("PRIVATE")
rest_api("test2")
logo_url("/driver_icons/rest.png")
*/
    console.log("This is console.log output for a demo Microservice")
    //return args
    return {a: 1, b: 2, c: "Hello Pilot!"}

}
