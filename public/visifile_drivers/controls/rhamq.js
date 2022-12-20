function(args) {
/*
is_app(true)
component_type("VB")
display_name("Red Hat AMQ control")
description("This will return the AMQ control")
base_component_id("rhamq_control")
load_once_from_file(true)
visibility("PRIVATE")
read_only(true)
properties(
    [
        {
            id:         "width",
            name:       "Width",
            default:    50,
            type:       "Number"
        }
        ,
        {
            id:         "height",
            name:       "Height",
            default:    50,
            type:       "Number"
        }
        ,
        {
            id:         "port",
            name:       "Port",
            default:    61613,
            type:       "Number"
        }
        ,
        {
            id:      "host",
            name:    "Host",
            default: "localhost",
            type:    "String"
        }
        ,
        {
            id:     "background_color",
            name:   "Background color",
            type:   "String"
        }
        ,



        {
            id:      "destination",
            name:    "Destination",
            type:    "String",
            default: "/queue/test"
        }
        ,


        {
            id:      "username",
            name:    "Username",
            type:    "String",
            default: "admin"
        }
        ,
        {
            id:     "password",
            name:   "Password",
            password: true,
            type:   "String",
            default: "admin"
        }

        ,
        {
            id:         "testAMQ",
            name:       "test AMQ()",
            type:       "Action",
            pre_snippet:    `await `,
            snippet:    `testAMQ()`
        }


    ]
)//properties

logo_url("/driver_icons/rhamq.png")
*/

    Vue.component("rhamq_control",{

        props: ["meta", "args","design_mode","refresh", "children"]

        ,



        template:

`<div v-bind:style='"height:100%;width:100%; border: 0px;" +
    "background-color: "+    args["background_color"]  +  ";"'>

    <div v-if="design_mode && (children.length == 0)" style="margin: 10px;">
        <img src="/driver_icons/rhamq.png" width=100px></src>
        <h3 class="text-center" >Red Hat AMQ connector</h3>
        The Red Hat AMQ Connector can be used to send or recieve messages from
        an AMQ queue
    </div>

    <div v-bind:style='"position:relative;width:100%;height:100%;border: 0px solid gray;background-color: "+    args["background_color"]  +  ";"'>
        <div style="position:absolute;top:0px">
            <slot v-bind:refresh='refresh'>
            </slot>
        </div>
    </div>
</div>`

        ,

        data: function() {
            return {
                msg: "..."
            }
        }

        ,

        mounted: async function() {
            registerComponent(this)

            if (!this.design_mode) {

            }
        }
        ,


        methods: {

            testAMQ: async function() {
                var mm = this
                var result = await callComponent(
                    {
                        base_component_id: "activemq_service"
                    }
                    ,
                    {
                        host: mm.args.host
                        ,
                        //brokers: mm.args.brokers
                        port: mm.args.port
                        ,
                        destination: mm.args.destination
                        ,
                        username: mm.args.username
                        ,
                        password: mm.args.password
                        ,
                        action: "read_single_message"
                    })

                console.log(JSON.stringify(result,null,2))
                return result
            }
            ,

        }




    })
}
