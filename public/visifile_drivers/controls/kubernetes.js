function(args) {
/*
is_app(true)
component_type("VB")
display_name("Kubernetes control")
description("This will return the Kubernetes control")
base_component_id("kubernetes_control")
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
            name:    "Kubernetes Admin Host",
            default: "http://kubernetes.com",
            type:    "String"
            ,
            help:       `<div><b>Kubernetes Master Host</b>
                              <br/>
                            This is the URL for the Kubernetes master server.
                         </div>`
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
            id:         "isKubernetesAvailable",
            name:       "Is Kubernetes Available?",
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
            id:      "k8sAuthenticationToken",
            name:    "K8s Authentication Token",
            default: "78643278346874236846873248",
            type:    "String"
            ,
            help:       `<div><b>Kubernetes Bearer token</b>
                              <br/>
                            From your command line, when logged in to your OpenShift account:<br />
                            APISERVER=$(kubectl config view --minify -o jsonpath='{.clusters[0].cluster.server}')
                            <br />
                            TOKEN=$(kubectl get secret $(kubectl get serviceaccount deployer -o jsonpath='{.secrets[0].name}') -o jsonpath='{.data.token}' | base64 --decode )
                         </div>`

        }
        ,
        {
            id:      "k8sProjectName",
            name:    "K8s Project",
            default: "",
            type:    "String"
        }
        ,
        {
            id:         "checkKubernetesAvailable",
            pre_snippet:    `await `,
            snippet:    `checkKubernetesAvailable()`,
            name:       "Check Kubernetes Available",
            type:       "Action"
        }
        ,
        {
            id:         "getPods",
            pre_snippet:    `await `,
            snippet:    `getPods()`,
            name:       "Get the pods in the current project",
            type:       "Action"
        }
        ,
        {
            id:         "getProxyConfig",
            pre_snippet:    `await `,
            snippet:    `getProxyConfig("service ID", "production")`,
            name:       "Get proxy config",
            type:       "Action"
        }
        ,

        {
            id:         "pods",
            name:       "Pods",
            default:    "",
            hidden:     true,
            type:       "String"
        }
        ,
        {
            id:         "proxyConfig",
            name:       "proxy config",
            default:    {},
            hidden:     true,
            type:       "Object"
        }
    ]
)//properties

logo_url("/driver_icons/kubernetes.png")
*/

    Vue.component("kubernetes_control",{

        props: ["meta", "args","design_mode","refresh", "children"]

        ,



        template:

`<div v-bind:style='"height:100%;width:100%; border: 0px;" +
    "background-color: "+    args["background_color"]  +  ";"'>

    <div v-if="design_mode && (design_mode != 'detail_editor')" style="margin: 10px;">
        <img src="/driver_icons/kubernetes.png" width=100px></src>
        <h3 class="text-center" >Kubernetes connector</h3>
        The Kubernetes Connector can be used to query a Kubernetes cluster
    </div>



    <div v-if="design_mode && (design_mode == 'detail_editor')" style="margin: 10px;">
        <div style="padding:10px;">
            3Scale Admin Host
            <input v-model="args.host" size=60 @change="changeHost()"></input>
        </div>
        <div style="padding:10px;">
            k8s Authentication Token
            <input v-model="args.k8sAuthenticationToken" size=60 @change="changeK8sAuthenticationToken()"></input>
        </div>
        <div style="padding:10px;">
            API Key
            <input v-model="args.k8sProjectName" size=60 @change="changeAPIKey()"></input>
        </div>

        <div v-bind:style='"background-color: " + (args.isKubernetesAvailable=="True"?"green":"red" ) +";color: white;padding:10px;"'
        >
            {{(args.isKubernetesAvailable=="True"?"Available":"Not available" )}}
        </div>

        <div    v-if='(args.isKubernetesAvailable=="True") && args.pods && (args.pods.length > 0)'
                v-bind:style='"padding:10px;"'>


                <div style="display: inline-block;width:45%;height:100%;vertical-align:top;">
                    <b>Available APIs</b>
                    <div v-bind:refresh='refresh'
                         v-on:mouseover='apiListItemHover = thisApi.id'
                         v-on:click='apiServiceIdSelected = thisApi.service_id;apiListItemSelected = thisApi.id; getProxyConfig(thisApi.service_id,apiEnv); '
                         v-bind:style='"padding:10px;" + "background-color: " +
                            ((apiListItemSelected == thisApi.id)?"gray":((apiListItemHover == thisApi.id)?"lightgray":"")) + ";"'

                         v-for="thisApi in args.pods" >

                        {{thisApi.name}}
                    </div>
                </div>

                <pre    v-bind:refresh='refresh'
                        style="display: inline-block;border: 1px solid gray;width:45%;height:100%;vertical-align:top;padding:10px;">

<a href="#"
    v-on:click='apiEnv="staging"; getProxyConfig(apiServiceIdSelected,apiEnv)'
    v-bind:class='"badge " + (apiEnv=="staging"?"badge-dark":"badge-light")'>Staging</a>
<a href="#"
    v-on:click='apiEnv="production"; getProxyConfig(apiServiceIdSelected,apiEnv)'
    v-bind:class='"badge " + (apiEnv=="production"?"badge-dark":"badge-light")'>Production</a>

    <button  type=button class=' btn btn-danger btn-sm'
             style="float: right;box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 8px 0px, rgba(0, 0, 0, 0.19) 0px 6px 20px 0px;margin-bottom: 4px;"
             v-on:click='createApiCall()' >Create API call</button>

{{((Object.keys(args.proxyConfig).length > 0)?JSON.stringify(args.proxyConfig,null,2):"No API selected")}}
                </pre>

        </div>

        <div    v-if='(args.isKubernetesAvailable=="True") && ((!args.pods) || (args.pods.length == 0))'
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
            this.args.isKubernetesAvailable = x?"True":"False"
            if (this.design_mode) {
                this.args.proxyConfig = {}
                this.updatePlans()
            }
        }
        ,



        methods: {
            createApiCall: async function() {
                var mm = this
                await mm.designModeCreateComponent()
            }
            ,
            designModeCreateComponent: async function() {
                if (!this.design_mode) {
                    return
                }
                await loadV2(["rest_control"])
                //zzz
                var newName = "rh3scale_api_call_" + Math.floor(Math.random() * 1000)
                await this.meta.getEditor().addControl(
                    {
                              "leftX": 10,
                              "topY": 10,
                              "name": newName,
                              "base_component_id": "rest_control",
                              "text": "REST API Call",
                              "URL": this.args.proxyConfig.sandbox_endpoint + "/?user_key=" + this.args.k8sProjectName,

                              "callApiOnStartup": "False"
                            }

                            )
                  this.meta.getEditor().selectComponentByName(newName)
                  this.meta.getEditor().showComponentDetailedDesignUiByName(newName)

                  return this.meta.getEditor().getControlByName(newName)
            }
            ,



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
                    this.getPods()
                }
                this.refresh++

            }
            ,

            changeK8sAuthenticationToken: async function() {
                var x = await this.checkKubernetesAvailable()
                this.args.isKubernetesAvailable = x?"True":"False"
                this.updatePlans()
            }
            ,
            changeApiKey: async function() {
            }



            ,
            changeHost: async function() {
                var x = await this.checkKubernetesAvailable()
                this.args.isKubernetesAvailable = x?"True":"False"
                this.updatePlans()
            }
            ,
            checkKubernetesAvailable: async function() {
                   debugger
                try {
                    var apiURL = this.args.host + "/api"
                    var result = await callFunction(
                    {
                        driver_name: "rest_call_service_v2",
                        method_name: "rest_call_service_v2"
                    }
                    ,
                    {
                        URL:     apiURL,
                        filter: null,
                        root:   ""
                    })

                    if (result && result.kind) {
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
                return this.args.host + "/api/v1/namespaces/" +  this.args.k8sProjectName + "/" +
                        extraURL
                        //"&token=" + this.args.k8sAuthenticationToken
            }
            ,

            getPods: async function() {
                var useURL = this.getUrlFor("/admin/api/application_plans.xml")

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

                 this.args.pods = JSON.parse(JSON.stringify(result))

                return result
            }



            ,
            getProxyConfig: async function(id, env) {

                var useURL = this.getUrlFor("/admin/api/services/" + id + "/proxy/configs/" + env + ".json")

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
                 if(!result) {return null}

                 var pl = result.proxy_configs
                 if(!pl) {return null}
                 if(!pl[0]) {return null}

                 var rtt= pl[0].proxy_config
                 if(rtt2) {return null}
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
                 result = JSON.parse(JSON.stringify(rtt2))

                 this.args.proxyConfig = result
                 this.refresh++

                 return result
            }



        }




    })
}
