function(args) {
/*
is_app(true)
component_type("VB")
display_name("Red Hat Decision Manager control")
description("This will return the Decision Manager control")
base_component_id("rhdm_control")
load_once_from_file(true)
visibility("PRIVATE")
read_only(true)
properties(
    [
        {
            id:         "width",
            name:       "Width",
            default:    200,
            type:       "Number"
        }
        ,
        {
            id:         "height",
            name:       "Height",
            default:    200,
            type:       "Number"
        }
        ,
        {
            id:         "port",
            name:       "DM Port",
            default:    8080,
            type:       "Number"
        }
        ,
        {
            id:      "host",
            name:    "DM Host",
            default: "http://localhost",
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
            id:      "username",
            name:    "Username",
            type:    "String",
            default: "pamAdmin"
        }
        ,
        {
            id:     "password",
            name:   "Password",
            password: true,
            type:   "String",
            default: ""
        }

        ,
        {
            id:         "testDecisionManager",
            name:       "testDecisionManager()",
            type:       "Action",
            pre_snippet:    `await `,
            snippet:    `testDecisionManager()`
        }


    ]
)//properties

logo_url("/driver_icons/rhdm.png")
*/

    Vue.component("rhdm_control",{

        props: ["meta", "args","properties","design_mode","refresh", "children"]

        ,



        template:

`<div v-bind:style='"height:100%;width:100%; border: 0px;" +
    "background-color: "+    args["background_color"]  +  ";"'>

    <div v-if="design_mode && (children.length == 0)" style="margin: 10px;">
        <img src="/driver_icons/rhdm.png" width=100px></src>
        <h3 class="text-center" >Red Hat Decision Manager</h3>
        The Red Hat Decision Manager can be used to call Decision Manager  Business rules
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

            testDecisionManager: async function() {
                var mm = this
                var result = await callFunction(
                {
                    driver_name: "rest_call_service_v2",
                    method_name: "rest_call_service_v2"
                }
                ,
                {
                    URL:       mm.properties.host + ":" +  mm.properties.port + "/decision-central/rest/controller/management/servers",
                    filter:    {"server-template-list":true,"server-template-list.server-template":true,"server-template-list.server-template.server-id":true,"server-template-list.server-template.server-name":true,"server-template-list.server-template.container-specs":true,"server-template-list.server-template.container-specs.[]":true,"server-template-list.server-template.container-specs.[].container-id":true,"server-template-list.server-template.container-specs.[].container-name":true,"server-template-list.server-template.container-specs.[].server-template-key":true,"server-template-list.server-template.container-specs.[].server-template-key.server-id":true,"server-template-list.server-template.container-specs.[].server-template-key.server-name":true,"server-template-list.server-template.container-specs.[].release-id":true,"server-template-list.server-template.container-specs.[].release-id.artifact-id":true,"server-template-list.server-template.container-specs.[].release-id.group-id":true,"server-template-list.server-template.container-specs.[].release-id.version":true,"server-template-list.server-template.container-specs.[].configs":true,"server-template-list.server-template.container-specs.[].configs.entry":true,"server-template-list.server-template.container-specs.[].configs.entry.key":true,"server-template-list.server-template.container-specs.[].configs.entry.value":true,"server-template-list.server-template.container-specs.[].configs.entry.value.$":true,"server-template-list.server-template.container-specs.[].configs.entry.value.$.xsi:type":true,"server-template-list.server-template.container-specs.[].configs.entry.value.$.xmlns:xsi":true,"server-template-list.server-template.container-specs.[].configs.entry.value.scannerStatus":true,"server-template-list.server-template.container-specs.[].status":true,"server-template-list.server-template.configs":true,"server-template-list.server-template.server-instances":true,"server-template-list.server-template.server-instances.server-instance-id":true,"server-template-list.server-template.server-instances.server-name":true,"server-template-list.server-template.server-instances.server-template-id":true,"server-template-list.server-template.server-instances.server-url":true,"server-template-list.server-template.capabilities":true,"server-template-list.server-template.capabilities.[]":true,"server-template-list.server-template.mode":true},
                    root:      ""
                    ,username: mm.properties.username
                    ,password: mm.properties.password
                })

                console.log(JSON.stringify(result,null,2))
                return result
            }


        }




    })
}
