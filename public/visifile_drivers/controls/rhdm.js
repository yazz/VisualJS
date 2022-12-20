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
            id:     "tree_data",
            name:   "Tree Data",
            type:   "Object",
            default: "",
            types: {tree_data: true, canConvertToString: true}
        }

        ,
        {
            id:     "error",
            name:   "Error",
            type:   "String",
            default: ""
        }

        ,
        {
            id:         "getServices",
            name:       "getServices()",
            type:       "Action",
            pre_snippet:    `await `,
            snippet:    `getServices()`
        }
        ,
        {
            id:         "addParent",
            name:       "addParent()",
            type:       "Action",
            pre_snippet:    `await `,
            snippet:    `addParent()`
        }
        ,
        {
            id:         "testDecisionManager",
            name:       "testDecisionManager()",
            type:       "Action",
            pre_snippet:    `await `,
            snippet:    `testDecisionManager()`
        }
        ,
        {
            id:         "connect",
            pre_snippet: `await `,
            snippet:    `connect()`,
            name:       "connect",
            type:       "Action",
            help:       `<div>Help text for
                            <b>connect</b> function
                         </div>`
        }
        ,
        {
            id:         "runQuery",
            pre_snippet: `await `,
            async:        true,
            snippet:    `runQuery()`,
            name:       "runQuery",
            type:       "Action",
            help:       `<div>Help text for
                            <b>runQuery</b> function
                            <div>The SQL is store in the "sql" property</div>
                         </div>`
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
            id:         "isDecisionManagerAvailable",
            name:       "Is Decision Manager Available?",
            type:       "Select",
            default:    "False",
            values:     [
                            {display: "True",   value: "True"},
                            {display: "False",  value: "False"}
                        ],
            design_time_only_events: true
        }
        ,
        {
            id:     "on_property_changed",
            name:   "on_property_changed",
            type:   "Event",
            help:       `<div>Help text for
                            <b>click_event</b> event
                         </div>`,
            default: `
me.addParent();
`
        }
        ,
        {
            id:     "getTables",
            name:   "getTables",
            type:   "Action"
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

    <div v-if="design_mode" style="margin: 10px;">
        <img src="/driver_icons/rhdm.png" width=100px></src>
        <h3 class="text-center" >Red Hat Decision Manager</h3>
        The Red Hat Decision Manager can be used to call Decision Manager  Business rules
    </div>





    <div v-if="design_mode && (design_mode == 'detail_editor')" style="margin: 10px;">
        <div style="padding:10px;">
            Decision Manager Admin Host
            <input v-model="args.host" size=60 @change="changeConnection()"></input>
        </div>

        <div style="padding:10px;">
            Username
            <input v-model="args.username"  size=60 @change="changeConnection()"></input>
        </div>

        <div style="padding:10px;">
            Password
            <input  v-model="args.password"
                    size=60
                    type="password"
                    @change="changeConnection()">
            </input>
        </div>


        <div    v-bind:style='"background-color: " + (args.isDecisionManagerAvailable == "True"?"green":"red" ) +";color: white;padding:10px;"'
                v-bind:refresh='refresh'
        >
            {{(args.isDecisionManagerAvailable == "True"?"Available":"Not available" )}}
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
                var result = await callComponent(
                {
                    driver_name: "rest_call_service_v2"
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

            ,

            connect: async function() {
                try {

                    var mm = this
                    mm.properties.error = ""
                    var result = await callComponent(
                    {
                        driver_name: "rest_call_service_v2"
                    }
                    ,
                    {
                        URL:       mm.properties.host + ":" +  mm.properties.port + "/decision-central/rest/controller/management/servers",
                        filter:    {},
                        root:      ""
                        ,username: mm.properties.username
                        ,password: mm.properties.password
                    })

                    mm.properties.isDecisionManagerAvailable = "True"
                    mm.refresh++
                    return true

                } catch( catchError ){
                    mm.properties.isDecisionManagerAvailable = "False"
                    mm.properties.error = catchError
                    return false

                }
            }
            ,

            runQuery: async function() {
                return [{a: 1, b: 2}]
            }


            ,
            changeConnection: async function() {
                this.connect()
            }
            ,
            getServices: async function() {
                var mm = this
                var result = await callComponent(
                {
                    driver_name: "rest_call_service_v2"
                }
                ,
                {
                    URL:       mm.properties.host + ":" +  mm.properties.port + "/decision-central/rest/spacesScreen/spaces",
                    filter:    {},
                    root:      ""
                    ,username: mm.properties.username
                    ,password: mm.properties.password
                })

                console.log(JSON.stringify(result,null,2))
                mm.properties.tree_data = result
                return result
            }
            ,

            getTables: async function()
            {
                return [{name: "dmn"},{name: "drl"}];
            }
            ,




            addParent: async function() {
                let mm = this
                //alert("called addParent")
                //debugger
                let newcontrol =  mm.meta.lookupComponentOnForm({
                    base_component_id:      "database_control"   ,
                    first_only: true
                })
                if (newcontrol == null) {
                    let parentName = mm.args.name + "_parent"
                    let parentComponent = await this.meta.getEditor().addControl(
                        {
                                  "leftX":              10,
                                  "topY":               10,
                                  "name":               parentName,
                                  "base_component_id":  "database_control"
                        })
                        //debugger
                    parentComponent.sourceComponentType = mm.properties.base_component_id
                    parentComponent.sourceControlName = mm.properties.name
                    mm.properties.parent_name = parentName
                    mm.properties.parent = parentName
                    mm.properties.parent_base_component_id = "database_control"
                    parentComponent.leftX = mm.properties.leftX
                    parentComponent.topY = mm.properties.topY
                    parentComponent.width = mm.properties.width
                    parentComponent.height = mm.properties.height
                    mm.properties.leftX  = 0
                    mm.properties.topY   = 0
                    mm.meta.getEditor().selectComponentByName(parentName)
                    mm.meta.getEditor().showComponentDetailedDesignUiByName(parentName)
                    setTimeout(function(){
                        parentComponent.connect()
                    },100)
                }
                //alert(JSON.stringify(newcontrol,null,2))
            }


        }




    })
}
