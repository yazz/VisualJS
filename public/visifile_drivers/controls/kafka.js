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
            id:         "checkKafkaAvailable",
            name:       "Check Kafka Available()",
            type:       "Action",
            pre_snippet:    `await `,
            snippet:    `checkKafkaAvailable()`
        }
        ,
        {
            id:         "isKafkaAvailable",
            name:       "Is Kafka Available?",
            type:       "Select",
            default:    "False",
            values:     [
                            {display: "True",   value: "True"},
                            {display: "False",  value: "False"}
                        ]
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
            id:         "brokers",
            name:       "Brokers",
            default:    ['localhost:9092'],
            type:       "Array"
        }
        ,
        {
            id:         "client_id",
            name:       "Client ID",
            default:    'myapp',
            type:       "String"
        }
        ,
        {
            id:         "offset",
            name:       "Offset",
            default:    0,
            type:       "Number"
        }
        ,
        {
            id:         "topic",
            name:       "Topic",
            default:    "test",
            type:       "String"
        }
        ,
        {
            id:         "partition",
            name:       "Partition",
            default:    0,
            type:       "Number"
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
        <div v-bind:style='"background-color: " + (args.isKafkaAvailable=="True"?"green":"red" ) +";color: white;padding:10px;"'
        >
            {{(args.isKafkaAvailable=="True"?"Available":"Not available" )}}
        </div>


    </div>


</div>`

        ,

        data: function() {
            return {
            }
        }

        ,

        mounted: async function() {
            registerComponent(this)

            var x = await this.checkKafkaAvailable()

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
                        offset: this.args.offset
                        ,
                        //brokers: this.args.brokers
                        brokers: ['localhost:9092']
                        ,
                        client_id: this.args.client_id
                        ,
                        topic: this.args.topic
                        ,
                        partition: this.args.partition
                    })

                console.log(JSON.stringify(result,null,2))
                return result
            }
            ,
            checkKafkaAvailable: async function()  {
                this.args.isKafkaAvailable = "False"

            }

        }




    })
}
