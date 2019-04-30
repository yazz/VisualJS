function(args) {
/*
is_app(true)
control_type("VB")
display_name("Terminal control")
description("This will return the terminal control")
base_component_id("terminal_control")
load_once_from_file(true)
visibility("PRIVATE")
read_only(true)
properties(
    [
        {
            id:         "text",
            name:       "Dev text",
            default:    "Terminal connecter",
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
            default: "host.terminal.internal",
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
            id:         "execCmd",
            pre_snippet:    `await `,
            snippet:    `execCmd('ls')`,
            name:       "Execute Command",
            type:       "Action"
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
`var terminalData = await parent.getFilteredContainerList()
me.setData(terminalData)
`
                    }
    }
])//children
logo_url("/driver_icons/terminal.png")
*/

    Vue.component("terminal_control",{

        props: ["meta", "args","design_mode","refresh", "children"]

        ,



        template:

`<div v-bind:style='"height:100%;width:100%; border: 0px;" +
    "background-color: "+    args["background_color"]  +  ";"'>

    <div v-if="design_mode && (children.length == 0)">
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
            registerComponent(this)

            if (!this.design_mode) {
                var x = await this.readFromTerminal()
                this.args.container_list = x
            }
        }
        ,


        methods: {
            readFromTerminal: async function() {
                var result = await callFunction(
                {
                    driver_name: "serverTerminalStuff",
                    method_name: "serverTerminalStuff"
                }
                ,
                {
                })

                if (result.value) {
                    return result.value
                }
                return null
            }
            ,


            execCmd: async function() {
                var qwe = await this.readFromTerminal()
                return qwe
            }

        }




    })
}
