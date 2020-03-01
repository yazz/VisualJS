function(args) {
/*
is_app(true)
control_type("VB")
display_name("3Scale control")
description("This will return the 3Scale control")
base_component_id("rh3scale_control")
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
            id:      "host",
            name:    "Host",
            default: "3scale.API",
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
            id:         "is_container",
            name:       "Is Container?",
            type:       "Boolean",
            default:    true,
            hidden:     true
        }
        ,
        {
            id:         "is3ScaleAvailable",
            name:       "Is 3 Scale Available?",
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
            id:      "serviceToken",
            name:    "Service Token",
            default: "78643278346874236846873248",
            type:    "String"
        }
        ,
        {
            id:         "check3ScaleAvailable",
            pre_snippet:    `await `,
            snippet:    `check3ScaleAvailable()`,
            name:       "Check 3Scale Available",
            type:       "Action"
        }
        ,


    ]
)//properties

logo_url("/driver_icons/rh3scale.png")
*/

    Vue.component("rh3scale_control",{

        props: ["meta", "args","design_mode","refresh", "children"]

        ,



        template:

`<div v-bind:style='"height:100%;width:100%; border: 0px;" +
    "background-color: "+    args["background_color"]  +  ";"'>

    <div v-if="design_mode && (design_mode != 'detail_editor')" style="margin: 10px;">
        <img src="/driver_icons/rh3scale.png" width=100px></src>
        <h3 class="text-center" >Red Hat 3Scale connector</h3>
        The Red Hat 3Scale Connector can be used to query 3Scale, or send
        API requests through the 3Scale gateway
    </div>



    <div v-if="design_mode && (design_mode == 'detail_editor')" style="margin: 10px;">
        Host <input v-model="args.host" size=60 @change="changeHost()"></input>
        API Key <input v-model="args.serviceToken" size=60 @change="changeAPIToken()"></input>

        <div v-bind:style='"background-color: " + (args.is3ScaleAvailable=="True"?"green":"red" ) +";color: white;padding:10px;"'
        >
            {{(args.is3ScaleAvailable=="True"?"Available":"Not available" )}}
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
                var x = await this.check3ScaleAvailable()
                this.args.is3ScaleAvailable = x?"True":"False"
            }
        }
        ,


        methods: {
            readFromDocker: async function() {
                var result = await callFunction(
                {
                    driver_name: "serverDockerStuff",
                    method_name: "serverDockerStuff"
                }
                ,
                {
                    host: this.args.host ,
                    port: this.args.port
                })

                //alert(JSON.stringify(result,null,2))
                if (result) {
                    return result
                }
                return null
            }
            ,
            changeAPIToken: async function() {
                var x = await this.check3ScaleAvailable()
                this.args.is3ScaleAvailable = x?"True":"False"
            }

            ,
            changeHost: async function() {
                var x = await this.check3ScaleAvailable()
                this.args.is3ScaleAvailable = x?"True":"False"
            }
            ,
            check3ScaleAvailable: async function() {
                try {
                    var result = await callFunction(
                    {
                        driver_name: "rest_call_service_v2",
                        method_name: "rest_call_service_v2"
                    }
                    ,
                    {
                        URL:     this.args.host +
                                "/admin/api/application_plans.xml?access_token=" +
                                 this.args.serviceToken,
                        filter: null,
                        root:   ""
                    })
                    debugger
                    if (result && result.plans) {
                        return true
                    }

                } catch (e) {
                    return false
                } finally {

                }
                return false




            }

        }




    })
}
