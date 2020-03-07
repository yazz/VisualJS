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
            default: "http://3scale.API",
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
            id:      "apiKey",
            name:    "API key",
            default: "",
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
        {
            id:         "getApplicationPlans",
            pre_snippet:    `await `,
            snippet:    `getApplicationPlans()`,
            name:       "Get app plans",
            type:       "Action"
        }
        ,
        {
            id:         "getProxyConfigList",
            pre_snippet:    `await `,
            snippet:    `getProxyConfigList()`,
            name:       "Get proxy configs",
            type:       "Action"
        }
        ,
        {
            id:         "applicationPlans",
            name:       "App plans",
            default:    [],
            hidden:     true,
            type:       "Array"
        }
        ,
        {
            id:         "proxyConfigList",
            name:       "proxy config list",
            default:    [],
            hidden:     true,
            type:       "Array"
        }
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
        <div style="padding:10px;">
            3Scale Admin Host
            <input v-model="args.host" size=60 @change="changeHost()"></input>
        </div>
        <div style="padding:10px;">
            Admin Service Token
            <input v-model="args.serviceToken" size=60 @change="changeServiceToken()"></input>
        </div>
        <div style="padding:10px;">
            API Key
            <input v-model="args.apiKey" size=60 @change="changeAPIKey()"></input>
        </div>

        <div v-bind:style='"background-color: " + (args.is3ScaleAvailable=="True"?"green":"red" ) +";color: white;padding:10px;"'
        >
            {{(args.is3ScaleAvailable=="True"?"Available":"Not available" )}}
        </div>

        <div    v-if='(args.is3ScaleAvailable=="True") && args.proxyConfigList && (args.proxyConfigList.length > 0)'
                v-bind:style='"padding:10px;"'>

            <b>Available APIs</b>
            <div v-bind:refresh='refresh'
                 v-bind:style='"padding:10px;"'
                 v-for="appPlan in args.applicationPlans" >

                {{appPlan.name}}
            </div>
        </div>

        <div    v-if='(args.is3ScaleAvailable=="True") && ((!args.applicationPlans) || (args.applicationPlans.length == 0))'
                v-bind:style='"padding:10px;"'>

            <div v-bind:refresh='refresh'>
                <b>No APIs available</b>
            </div>
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

            var x = await this.check3ScaleAvailable()
            this.args.is3ScaleAvailable = x?"True":"False"
            if (this.design_mode) {
                this.updatePlans()
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


            updatePlans: async function() {
                if (this.args.is3ScaleAvailable) {
                    this.getApplicationPlans()
                    this.getProxyConfigList()
                }
                this.refresh++

            }
            ,

            changeServiceToken: async function() {
                var x = await this.check3ScaleAvailable()
                this.args.is3ScaleAvailable = x?"True":"False"
                this.getProxyConfigList()
                this.updatePlans()
            }
            ,
            changeApiKey: async function() {
            }



            ,
            changeHost: async function() {
                var x = await this.check3ScaleAvailable()
                this.args.is3ScaleAvailable = x?"True":"False"
                this.getProxyConfigList()
                this.updatePlans()
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

                    if (result && result.plans) {
                        return true
                    }

                } catch (e) {
                    return false
                } finally {

                }
                return false




            }
            ,
            getUrlFor: function(extraURL) {
                return this.args.host +
                        extraURL + "?" +
                        "&access_token=" + this.args.serviceToken
            }
            ,

            getApplicationPlans: async function() {
                var useURL = this.getUrlFor("/admin/api/application_plans.xml")

                 var result = await callFunction(
                 {
                     driver_name: "rest_call_service_v2",
                     method_name: "rest_call_service_v2"
                 }
                 ,
                 {
                     URL:    useURL,
                     filter: {"plans":true,"plans.plan":true,"plans.plan.[]":true,"plans.plan.[].$":false,"plans.plan.[].$.custom":false,"plans.plan.[].$.default":false,"plans.plan.[].id":true,"plans.plan.[].name":true,"plans.plan.[].type":true,"plans.plan.[].state":true,"plans.plan.[].approval_required":true,"plans.plan.[].setup_fee":true,"plans.plan.[].cost_per_month":true,"plans.plan.[].trial_period_days":true,"plans.plan.[].cancellation_period":true,"plans.plan.[].service_id":true,"plans.plan.[].end_user_required":true},
                     root:   "plans.plan"
                     //,returnDetails: true
                 })

                 this.args.applicationPlans = JSON.parse(JSON.stringify(result))

                return result
            }

            ,
            getProxyConfigList: async function() {
                var useURL = this.getUrlFor("/admin/api/services/2555417843495/proxy/configs/sandbox.json")

                 var result = await callFunction(
                 {
                     driver_name: "rest_call_service_v2",
                     method_name: "rest_call_service_v2"
                 }
                 ,
                 {
                     URL:    useURL,
                     filter: null,
                     root:   null
                     //,returnDetails: true
                 })

                 var pl = result.proxy_configs
                 var pl2=[]
                 for (var i=0;i<pl.length;i++) {
                     var rtt= pl[i].proxy_config
                     var rtt2={
                         environment: rtt.environment,
                         id: rtt.content.id,
                         account_id: rtt.content.account_id,
                         name: rtt.content.name,
                         description: rtt.content.description,
                         service_id: rtt.content.proxy.service_id,
                         auth_user_key: rtt.content.proxy.auth_user_key,
                         api_test_path: rtt.content.proxy.api_test_path,
                         sandbox_endpoint: rtt.content.proxy.sandbox_endpoint,
                         endpoint: rtt.content.proxy.endpoint
                     }
                     pl2.push(rtt2)
                 }
                 this.args.proxyConfigList = JSON.parse(JSON.stringify(pl2))

                return result
            }



        }




    })
}
