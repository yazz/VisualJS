function echo_microservice(args) {
/*
base_component_id("echo_microservice")
display_name("Echo microservice")
only_run_on_server(true)
visibility("PUBLIC")
rest_api("echo")
logo_url("/driver_icons/rest.png")
*/
    console.log("This is console.log output for a Echo Microservice")
    //return args
    trace("echo", "params",args.params)
    if (args) {
        return args.params
    } else {
        return {}
    }

}
