function(args) {
/*
is_app(true)
component_type("VB")
hash_algorithm("SHA256")
display_name("Docker control")
description("This will return the docker control")
base_component_id("docker_control")
load_once_from_file(true)
visibility("PRIVATE")
read_only(true)
properties(
    [
        {
            id:         "text",
            name:       "Dev text",
            default:    "Docker connecter",
            type:       "String"
        }
        ,
        {
            id:         "width",
            name:       "Width",
            default:    350,
            type:       "Number"
        }
        ,
        {
            id:         "height",
            name:       "Height",
            default:    300,
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
            default: "host.docker.internal",
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
            id:     "container_list",
            name:   "Container list",
            type:   "List"
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
            id:         "getFilteredContainerList",
            pre_snippet:    `await `,
            snippet:    `getFilteredContainerList()`,
            name:       "Get Container List",
            type:       "Action"
        }
        ,
        {
            id:     "test_method",
            name:   "test_method",
            snippet:    `test_method()`,
            type:   "Action",
            help:       `<div>Help text for
                            <b>test_method</b> action
                         </div>`,

                         fn:
`
alert("test_method called")
`
        }        
    ]
)//properties
children([
    {
        base_component_id: "table_control"
        ,
        properties: {
                        width: 350,
                        height: 180,
                        load:
`var dockerData = await parent.getFilteredContainerList()
me.setData(dockerData)
`
                    }
    }
])//children
logo_url("/driver_icons/ducker.png")
*/

    Yazz.component({

        props: ["meta", "args","design_mode","refresh"]

        ,



        template:

`<div v-bind:style='"height:100%;width:100%; border: 0px;" +
    "background-color: "+    args["background_color"]  +  ";"'>

    <div v-if="design_mode && (meta.children.length == 0)">
        {{args.text}}
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
            await registerComponent(this)

            if (!this.design_mode) {
                var x = await this.readFromDocker()
                this.args.container_list = x
            }
        }
        ,


        methods: {
            readFromDocker: async function() {
                var result = await callComponent(
                {
                    base_component_id: "serverDockerStuff"
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


            getFilteredContainerList: async function() {
                var qwe = await this.readFromDocker()
                var newList = []

                for (var aa = 0; aa < qwe.length; aa ++) {

                    var newObject = {
                                        image:          qwe[aa].Image,
                                        privatePort:    qwe[aa].Ports[0].PrivatePort,
                                        publicPort:     qwe[aa].Ports[0].PublicPort,
                                        state:          qwe[aa].State,
                                        status:         qwe[aa].Status
                                    }
                    newList.push(newObject)
                }
                return newList
            }

        }




    })
}
