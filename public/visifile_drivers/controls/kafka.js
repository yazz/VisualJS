function(args) {
/*
is_app(true)
component_type("VB")
display_name("Kafka control")
description("This will return the Kafka control")
base_component_id("kafka_control")
load_once_from_file(true)
visibility("PRIVATE")
read_only(true)
properties(
    [
        {
            id:         "width",
            name:       "Width",
            default:    80,
            type:       "Number"
        }
        ,
        {
            id:         "height",
            name:       "Height",
            default:    80,
            type:       "Number"
        }
        ,
        {
            id:         "port",
            name:       "Port",
            default:    1234,
            type:       "Number"
        }
        ,

        {
            id:     "background_color",
            name:   "Background color",
            type:   "String"
        }
        ,
        {
            id:         "is_container",
            name:       "Is Container?",
            type:       "Boolean",
            default:    false,
            hidden:     true
        }
        ,
        {
            id:         "readTopic",
            name:       "Read a Kafka topic()",
            type:       "Action",
            pre_snippet:    `await `,
            snippet:    `readTopic()`
        }
        ,

        {
            id:         "has_details_ui",
            name:       "Has details UI?",
            type:       "Boolean",
            default:    true,
            hidden:     true
        }
        ,


        {
            id:         "checkKafkaAvailable",
            pre_snippet:    `await `,
            snippet:    `checkKafkaAvailable()`,
            name:       "Check Kafka Available",
            type:       "Action"
        }

    ]
)//properties

logo_url("/driver_icons/kafka.png")
*/

    Vue.component("kafka_control",{

        props: ["meta", "args","design_mode","refresh", "children"]

        ,



        template:

`<div v-bind:style='"height:100%;width:100%; border: 0px;" +
    "background-color: "+    args["background_color"]  +  ";"'>

    <div v-if="design_mode && (design_mode != 'detail_editor')" style="margin: 10px;">
        <img src="/driver_icons/kafka.png" width=100px></src>
        <h3 class="text-center" ></h3>
        The Kafka Connector can be used to query a Kafka cluster
    </div>



    <div v-if="design_mode && (design_mode == 'detail_editor')" style="margin: 10px;">
        <div style="padding:10px;">
            Kafka
        </div>



    </div>


</div>`

        ,

        data: function() {
            return {
                apiListItemHover: null,
                apiListItemSelected: null,
                apiServiceIdSelected: null,
                apiEnv: "production"
            }
        }

        ,

        mounted: async function() {
            registerComponent(this)

            var x = await this.checkKubernetesAvailable()

            if (this.design_mode) {

            }
        }
        ,



        methods: {
            readTopic: async function() {
                var result = await callFunction(
                    {
                        driver_name: "kafka_service",
                        method_name: "kafka_service"
                    }
                    ,
                    {
                        offset: 0
                        ,
                        brokers: ['localhost:9092']
                        ,
                        client_id: 'myapp'
                        ,
                        topic: "test"
                        ,
                        parition: 0
                    })

                console.log(JSON.stringify(result,null,2))
                return result
            }

        }




    })
}
