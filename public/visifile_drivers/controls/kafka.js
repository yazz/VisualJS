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
            default:    [],
            hidden:     true,
            type:       "Array"
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
                var useURL = this.getUrlFor("pods")

                var result = await callFunction(
                {
                    driver_name: "rest_call_service_v2",
                    method_name: "rest_call_service_v2"
                }
                ,
                {
                    URL:    useURL,
                    headers: {Authorization: this.args.k8sAuthenticationToken},
                    filter: {"kind":false,"apiVersion":false,"metadata":false,"metadata.selfLink":false,"metadata.resourceVersion":false,"items":true,"items.[]":true,"items.[].metadata":true,"items.[].metadata.name":true,"items.[].metadata.generateName":false,"items.[].metadata.namespace":false,"items.[].metadata.selfLink":false,"items.[].metadata.uid":false,"items.[].metadata.resourceVersion":false,"items.[].metadata.creationTimestamp":false,"items.[].metadata.labels":false,"items.[].metadata.labels.app":false,"items.[].metadata.labels.deployment":false,"items.[].metadata.labels.deploymentConfig":false,"items.[].metadata.labels.deploymentconfig":false,"items.[].metadata.labels.threescale_component":false,"items.[].metadata.labels.threescale_component_element":false,"items.[].metadata.labels.threescale_component_name":false,"items.[].metadata.annotations":false,"items.[].metadata.annotations.openshift.io/deployment-config.latest-version":false,"items.[].metadata.annotations.openshift.io/deployment-config.name":false,"items.[].metadata.annotations.openshift.io/deployment.name":false,"items.[].metadata.annotations.openshift.io/generated-by":false,"items.[].metadata.annotations.openshift.io/scc":false,"items.[].metadata.annotations.prometheus.io/port":false,"items.[].metadata.annotations.prometheus.io/scrape":false,"items.[].metadata.ownerReferences":false,"items.[].metadata.ownerReferences.[]":false,"items.[].metadata.ownerReferences.[].apiVersion":false,"items.[].metadata.ownerReferences.[].kind":false,"items.[].metadata.ownerReferences.[].name":false,"items.[].metadata.ownerReferences.[].uid":false,"items.[].metadata.ownerReferences.[].controller":false,"items.[].metadata.ownerReferences.[].blockOwnerDeletion":false,"items.[].spec":true,"items.[].spec.volumes":false,"items.[].spec.volumes.[]":false,"items.[].spec.volumes.[].name":false,"items.[].spec.volumes.[].secret":false,"items.[].spec.volumes.[].secret.secretName":false,"items.[].spec.volumes.[].secret.defaultMode":false,"items.[].spec.initContainers":false,"items.[].spec.initContainers.[]":false,"items.[].spec.initContainers.[].name":false,"items.[].spec.initContainers.[].image":false,"items.[].spec.initContainers.[].command":false,"items.[].spec.initContainers.[].command.[]":false,"items.[].spec.initContainers.[].env":false,"items.[].spec.initContainers.[].env.[]":false,"items.[].spec.initContainers.[].env.[].name":false,"items.[].spec.initContainers.[].env.[].value":false,"items.[].spec.initContainers.[].resources":false,"items.[].spec.initContainers.[].volumeMounts":false,"items.[].spec.initContainers.[].volumeMounts.[]":false,"items.[].spec.initContainers.[].volumeMounts.[].name":false,"items.[].spec.initContainers.[].volumeMounts.[].readOnly":false,"items.[].spec.initContainers.[].volumeMounts.[].mountPath":false,"items.[].spec.initContainers.[].terminationMessagePath":false,"items.[].spec.initContainers.[].terminationMessagePolicy":false,"items.[].spec.initContainers.[].imagePullPolicy":false,"items.[].spec.initContainers.[].securityContext":false,"items.[].spec.initContainers.[].securityContext.capabilities":false,"items.[].spec.initContainers.[].securityContext.capabilities.drop":false,"items.[].spec.initContainers.[].securityContext.capabilities.drop.[]":false,"items.[].spec.initContainers.[].securityContext.runAsUser":false,"items.[].spec.containers":false,"items.[].spec.containers.[]":false,"items.[].spec.containers.[].name":false,"items.[].spec.containers.[].image":false,"items.[].spec.containers.[].ports":false,"items.[].spec.containers.[].ports.[]":false,"items.[].spec.containers.[].ports.[].containerPort":false,"items.[].spec.containers.[].ports.[].protocol":false,"items.[].spec.containers.[].ports.[].name":false,"items.[].spec.containers.[].env":false,"items.[].spec.containers.[].env.[]":false,"items.[].spec.containers.[].env.[].name":false,"items.[].spec.containers.[].env.[].valueFrom":false,"items.[].spec.containers.[].env.[].valueFrom.secretKeyRef":false,"items.[].spec.containers.[].env.[].valueFrom.secretKeyRef.name":false,"items.[].spec.containers.[].env.[].valueFrom.secretKeyRef.key":false,"items.[].spec.containers.[].env.[].valueFrom.configMapKeyRef":false,"items.[].spec.containers.[].env.[].valueFrom.configMapKeyRef.name":false,"items.[].spec.containers.[].env.[].valueFrom.configMapKeyRef.key":false,"items.[].spec.containers.[].env.[].value":false,"items.[].spec.containers.[].resources":false,"items.[].spec.containers.[].resources.limits":false,"items.[].spec.containers.[].resources.limits.cpu":false,"items.[].spec.containers.[].resources.limits.memory":false,"items.[].spec.containers.[].resources.requests":false,"items.[].spec.containers.[].resources.requests.cpu":false,"items.[].spec.containers.[].resources.requests.memory":false,"items.[].spec.containers.[].volumeMounts":false,"items.[].spec.containers.[].volumeMounts.[]":false,"items.[].spec.containers.[].volumeMounts.[].name":false,"items.[].spec.containers.[].volumeMounts.[].readOnly":false,"items.[].spec.containers.[].volumeMounts.[].mountPath":false,"items.[].spec.containers.[].livenessProbe":false,"items.[].spec.containers.[].livenessProbe.httpGet":false,"items.[].spec.containers.[].livenessProbe.httpGet.path":false,"items.[].spec.containers.[].livenessProbe.httpGet.port":false,"items.[].spec.containers.[].livenessProbe.httpGet.scheme":false,"items.[].spec.containers.[].livenessProbe.initialDelaySeconds":false,"items.[].spec.containers.[].livenessProbe.timeoutSeconds":false,"items.[].spec.containers.[].livenessProbe.periodSeconds":false,"items.[].spec.containers.[].livenessProbe.successThreshold":false,"items.[].spec.containers.[].livenessProbe.failureThreshold":false,"items.[].spec.containers.[].readinessProbe":false,"items.[].spec.containers.[].readinessProbe.httpGet":false,"items.[].spec.containers.[].readinessProbe.httpGet.path":false,"items.[].spec.containers.[].readinessProbe.httpGet.port":false,"items.[].spec.containers.[].readinessProbe.httpGet.scheme":false,"items.[].spec.containers.[].readinessProbe.initialDelaySeconds":false,"items.[].spec.containers.[].readinessProbe.timeoutSeconds":false,"items.[].spec.containers.[].readinessProbe.periodSeconds":false,"items.[].spec.containers.[].readinessProbe.successThreshold":false,"items.[].spec.containers.[].readinessProbe.failureThreshold":false,"items.[].spec.containers.[].terminationMessagePath":false,"items.[].spec.containers.[].terminationMessagePolicy":false,"items.[].spec.containers.[].imagePullPolicy":false,"items.[].spec.containers.[].securityContext":false,"items.[].spec.containers.[].securityContext.capabilities":false,"items.[].spec.containers.[].securityContext.capabilities.drop":false,"items.[].spec.containers.[].securityContext.capabilities.drop.[]":false,"items.[].spec.containers.[].securityContext.runAsUser":false,"items.[].spec.restartPolicy":false,"items.[].spec.terminationGracePeriodSeconds":false,"items.[].spec.dnsPolicy":false,"items.[].spec.nodeSelector":false,"items.[].spec.nodeSelector.customer":false,"items.[].spec.serviceAccountName":false,"items.[].spec.serviceAccount":false,"items.[].spec.nodeName":true,"items.[].spec.securityContext":false,"items.[].spec.securityContext.seLinuxOptions":false,"items.[].spec.securityContext.seLinuxOptions.level":false,"items.[].spec.securityContext.fsGroup":false,"items.[].spec.imagePullSecrets":false,"items.[].spec.imagePullSecrets.[]":false,"items.[].spec.imagePullSecrets.[].name":false,"items.[].spec.affinity":false,"items.[].spec.affinity.podAntiAffinity":false,"items.[].spec.affinity.podAntiAffinity.preferredDuringSchedulingIgnoredDuringExecution":false,"items.[].spec.affinity.podAntiAffinity.preferredDuringSchedulingIgnoredDuringExecution.[]":false,"items.[].spec.affinity.podAntiAffinity.preferredDuringSchedulingIgnoredDuringExecution.[].weight":false,"items.[].spec.affinity.podAntiAffinity.preferredDuringSchedulingIgnoredDuringExecution.[].podAffinityTerm":false,"items.[].spec.affinity.podAntiAffinity.preferredDuringSchedulingIgnoredDuringExecution.[].podAffinityTerm.labelSelector":false,"items.[].spec.affinity.podAntiAffinity.preferredDuringSchedulingIgnoredDuringExecution.[].podAffinityTerm.labelSelector.matchExpressions":false,"items.[].spec.affinity.podAntiAffinity.preferredDuringSchedulingIgnoredDuringExecution.[].podAffinityTerm.labelSelector.matchExpressions.[]":false,"items.[].spec.affinity.podAntiAffinity.preferredDuringSchedulingIgnoredDuringExecution.[].podAffinityTerm.labelSelector.matchExpressions.[].key":false,"items.[].spec.affinity.podAntiAffinity.preferredDuringSchedulingIgnoredDuringExecution.[].podAffinityTerm.labelSelector.matchExpressions.[].operator":false,"items.[].spec.affinity.podAntiAffinity.preferredDuringSchedulingIgnoredDuringExecution.[].podAffinityTerm.labelSelector.matchExpressions.[].values":false,"items.[].spec.affinity.podAntiAffinity.preferredDuringSchedulingIgnoredDuringExecution.[].podAffinityTerm.labelSelector.matchExpressions.[].values.[]":false,"items.[].spec.affinity.podAntiAffinity.preferredDuringSchedulingIgnoredDuringExecution.[].podAffinityTerm.topologyKey":false,"items.[].spec.schedulerName":false,"items.[].spec.tolerations":false,"items.[].spec.tolerations.[]":false,"items.[].spec.tolerations.[].key":false,"items.[].spec.tolerations.[].operator":false,"items.[].spec.tolerations.[].effect":false,"items.[].spec.priority":false,"items.[].status":true,"items.[].status.phase":false,"items.[].status.conditions":false,"items.[].status.conditions.[]":false,"items.[].status.conditions.[].type":false,"items.[].status.conditions.[].status":false,"items.[].status.conditions.[].lastProbeTime":false,"items.[].status.conditions.[].lastTransitionTime":false,"items.[].status.hostIP":false,"items.[].status.podIP":false,"items.[].status.startTime":false,"items.[].status.initContainerStatuses":true,"items.[].status.initContainerStatuses.[]":true,"items.[].status.initContainerStatuses.[].name":false,"items.[].status.initContainerStatuses.[].state":false,"items.[].status.initContainerStatuses.[].state.terminated":false,"items.[].status.initContainerStatuses.[].state.terminated.exitCode":false,"items.[].status.initContainerStatuses.[].state.terminated.reason":false,"items.[].status.initContainerStatuses.[].state.terminated.startedAt":false,"items.[].status.initContainerStatuses.[].state.terminated.finishedAt":false,"items.[].status.initContainerStatuses.[].state.terminated.containerID":false,"items.[].status.initContainerStatuses.[].lastState":false,"items.[].status.initContainerStatuses.[].ready":true,"items.[].status.initContainerStatuses.[].restartCount":false,"items.[].status.initContainerStatuses.[].image":false,"items.[].status.initContainerStatuses.[].imageID":false,"items.[].status.initContainerStatuses.[].containerID":false,"items.[].status.containerStatuses":true,"items.[].status.containerStatuses.[]":true,"items.[].status.containerStatuses.[].name":false,"items.[].status.containerStatuses.[].state":false,"items.[].status.containerStatuses.[].state.running":false,"items.[].status.containerStatuses.[].state.running.startedAt":false,"items.[].status.containerStatuses.[].lastState":false,"items.[].status.containerStatuses.[].ready":true,"items.[].status.containerStatuses.[].restartCount":false,"items.[].status.containerStatuses.[].image":false,"items.[].status.containerStatuses.[].imageID":false,"items.[].status.containerStatuses.[].containerID":false,"items.[].status.qosClass":false,"items.[].spec.initContainers.[].env.[].valueFrom":false,"items.[].spec.initContainers.[].env.[].valueFrom.secretKeyRef":false,"items.[].spec.initContainers.[].env.[].valueFrom.secretKeyRef.name":false,"items.[].spec.initContainers.[].env.[].valueFrom.secretKeyRef.key":false,"items.[].spec.initContainers.[].env.[].valueFrom.configMapKeyRef":false,"items.[].spec.initContainers.[].env.[].valueFrom.configMapKeyRef.name":false,"items.[].spec.initContainers.[].env.[].valueFrom.configMapKeyRef.key":false,"items.[].spec.containers.[].args":false,"items.[].spec.containers.[].args.[]":false,"items.[].spec.containers.[].livenessProbe.tcpSocket":false,"items.[].spec.containers.[].livenessProbe.tcpSocket.port":false,"items.[].spec.volumes.[].persistentVolumeClaim":false,"items.[].spec.volumes.[].persistentVolumeClaim.claimName":false,"items.[].spec.volumes.[].configMap":false,"items.[].spec.volumes.[].configMap.name":false,"items.[].spec.volumes.[].configMap.items":false,"items.[].spec.volumes.[].configMap.items.[]":false,"items.[].spec.volumes.[].configMap.items.[].key":false,"items.[].spec.volumes.[].configMap.items.[].path":false,"items.[].spec.volumes.[].configMap.defaultMode":false,"items.[].spec.containers.[].command":false,"items.[].spec.containers.[].command.[]":false,"items.[].spec.containers.[].readinessProbe.exec":false,"items.[].spec.containers.[].readinessProbe.exec.command":false,"items.[].spec.containers.[].readinessProbe.exec.command.[]":false,"items.[].metadata.labels.name":false,"items.[].spec.containers.[].readinessProbe.httpGet.httpHeaders":false,"items.[].spec.containers.[].readinessProbe.httpGet.httpHeaders.[]":false,"items.[].spec.containers.[].readinessProbe.httpGet.httpHeaders.[].name":false,"items.[].spec.containers.[].readinessProbe.httpGet.httpHeaders.[].value":false,"items.[].status.containerStatuses.[].lastState.terminated":false,"items.[].status.containerStatuses.[].lastState.terminated.exitCode":false,"items.[].status.containerStatuses.[].lastState.terminated.reason":false,"items.[].status.containerStatuses.[].lastState.terminated.startedAt":false,"items.[].status.containerStatuses.[].lastState.terminated.finishedAt":false,"items.[].status.containerStatuses.[].lastState.terminated.containerID":false,"items.[].spec.volumes.[].emptyDir":false,"items.[].spec.volumes.[].emptyDir.medium":false,"items.[].spec.containers.[].env.[].valueFrom.fieldRef":false,"items.[].spec.containers.[].env.[].valueFrom.fieldRef.apiVersion":false,"items.[].spec.containers.[].env.[].valueFrom.fieldRef.fieldPath":false}
                    ,
                    root:   "items"
                })
                this.args.pods = []
                for (var x = 0 ; x < result.length ; x++ ){
                    var newPod ={}
                    newPod.name = result[x].metadata.name
                    if (result[x].status.containerStatuses) {
                        if (result[x].status.containerStatuses) {
                            if (result[x].status.containerStatuses.length > 0) {
                                newPod.ready = "" + result[x].status.containerStatuses[0].ready
                            } else {
                                newPod.ready = false
                            }
                        } else {
                            newPod.ready = false
                        }
                    } else {
                        newPod.ready = false
                    }
                    newPod.node = result[x].spec.nodeName
                    this.args.pods.push(newPod)
                }

                return this.args.pods
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
