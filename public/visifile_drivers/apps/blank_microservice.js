function new_microservice() {
/*
base_component_id("new_microservice")
display_name("New microservice")
only_run_on_server(true)
visibility("PRIVATE")
rest_api("test2")
logo_url("/driver_icons/microservice.png")
*/
    console.log("Hello World")
    return {
        ok: "we return this",
        value: {ok2: "we return this"}
    }
}
