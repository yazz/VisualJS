function echo_post_microservice(args) {
/*
base_component_id("echo_post_microservice")
display_name("Echo Post microservice")
only_run_on_server(true)
visibility("PUBLIC")
rest_api("echopost")
rest_method("POST")
logo_url("/driver_icons/rest.png")
*/
    console.log("This is console.log output for a Echo Post Microservice")
    //return args
    if (args) {
        return args
    } else {
        return {}
    }

}
