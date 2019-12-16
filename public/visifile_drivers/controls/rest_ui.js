function(args) {
/*
is_app(true)
control_type("VB")
display_name("REST API call control")
description("This will return the REST APIn call control")
base_component_id("rest_control")
load_once_from_file(true)
visibility("PRIVATE")
read_only(true)
properties(
    [
        {
            id:         "text",
            name:       "Dev text",
            default:    "REST API Call",
            type:       "String"
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
            id:         "width",
            name:       "Width",
            default:    180,
            type:       "Number"
        }
        ,
        {
            id:         "height",
            name:       "Height",
            default:    70,
            type:       "Number"
        }
        ,
        {
            id:             "callDefaultRestApi",
            pre_snippet:    `await `,
            snippet:        `callDefaultRestApi()`,
            name:           "Execute Command",
            type:           "Action"
        }
        ,
        {
            id:         "callRestApi",
            pre_snippet:    `await `,
            snippet:    `callRestApi("http://INSERT_URL_HERE")`,
            name:       "Execute Command",
            type:       "Action"
        }
        ,
        {
            id:         "URL",
            name:       "URL",
            default:    "https://raw.githubusercontent.com/typicode/demo/master/db.json",
            type:       "String"
        }


    ]
)//properties
logo_url("/driver_icons/rest.png")
*/

    Vue.component("rest_control",{

        props: ["meta", "args","design_mode","refresh"]

        ,



        template:

`<div v-bind:style='"height:100%;width:100%; border: 0px;" +
    "background-color: "+    args["background_color"]  +  ";"'>

    <div v-bind:style='"height:100%;width:100%; border: 0px;color:black;padding: 10px;"'
         v-if='design_mode == "detail_editor"'>
        {{args.text}}
        <div/>
        <button    class="btn btn-primary"
                   v-on:click="testDefaultRestApi()">

              Call API

        </button>

        <div/>
        {{args.URL}}
        {{tempResult}}
    </div>

    <div    v-else
            v-bind:style='"position:relative;width:100%;height:100%;border: 0px solid gray;background-color: "+    args["background_color"]  +  ";"'>

    <div    v-if='design_mode'>
           {{args.text}}
           <div/>
           <pre>{{args.URL}}</pre>
    </div>

        <div style="position:absolute;top:0px">
            <slot v-bind:refresh='refresh'>
            </slot>
        </div>
    </div>
</div>`

        ,

        data: function() {
            return {
                    tempResult: "temp"
            }
        }

        ,

        mounted: async function() {
            registerComponent(this)

        }
        ,


        methods: {
            callRestApiInternal: async function() {
                var mm = this

                var result = await callFunction(
                {
                    driver_name: "rest_call_service",
                    method_name: "rest_call_service"
                }
                ,
                {
                    URL:    mm.args.URL
                })


                if (result) {
                    return result
                }
                return null
            }
            ,


            callDefaultRestApi: async function() {

                var qwe = await this.callRestApiInternal()
                return qwe
            }
            ,


            callRestApi: async function(urlToCall) {

                var mm = this
                if (urlToCall) {
                    mm.args.URL = urlToCall
                }
                var qwe = await this.callRestApiInternal()
                return qwe
            }
            ,
            testDefaultRestApi: async function(urlToCall) {
                alert(88)
            }

        }




    })
}
