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
            id:         "stagingRoot",
            name:       "Staging response path",
            default:    "",
            type:       "String"
        }
        ,
        {
            id:         "productionRoot",
            name:       "Production response path",
            default:    "",
            type:       "String"
        }
        ,
        {
            id:         "stagingFilter",
            name:       "Staging filter",
            default:    new Object(),
            hidden:     true,
            type:       "Object"
        }
        ,
        {
            id:         "productionFilter",
            name:       "Production filter",
            default:    new Object(),
            hidden:     true,
            type:       "Object"
        }
        ,
        {
            id:         "stagingURL",
            name:       "Staging URL",
            default:    "https://raw.githubusercontent.com/typicode/demo/master/db.json",
            type:       "String"
        }
        ,
        {
            id:         "URL",
            name:       "URL",
            default:    "https://raw.githubusercontent.com/typicode/demo/master/db.json",
            type:       "String"
        }
        ,
        {
            id:         "jsonPaths",
            name:       "JSON Paths",
            default:    [],
            hidden:     true,
            type:       "Array"
        }
        ,
        {
            id:         "jsonRoots",
            name:       "JSON Roots",
            default:    [],
            hidden:     true,
            type:       "Array"
        }
        ,        {
            id:         "stagingResponse",
            name:       "Staging Response",
            default:    null,
            hidden:     true,
            type:       "Object"
        }
        ,
        {
            id:         "filteredStagingResponse",
            name:       "Filtered Staging Response",
            default:    null,
            hidden:     true,
            type:       "Object"
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






<!-- ------------------------------------------------------------------------------------------

                                      Details screen



-------------------------------------------------------------------------------------------->
    <div v-bind:style='"height:100%;width:100%; border: 0px;color:black;padding: 10px;"'
         v-if='design_mode == "detail_editor"'>
        {{args.text}}
        <div/>
        <button    class="btn btn-primary"
                   v-on:click="callStagingRestApi()">

              Call API

        </button>


        <button    class="btn btn-primary"
                   v-on:click="promoteStagingToLive()">

              Promote Staging To Live

        </button>

        <div/>




        <div style="height:100%;width:500px; border: 0px;color:black;padding: 10px;overflow:scroll;">
            <pre>{{args.stagingURL}}</pre>
            <div/>



            <div style="font-weight: bold;">Root</div>
            <select v-model="args.stagingRoot" @change="filterRestApi()">
              <option disabled value="">Please select one</option>
              <option  v-for="jsonRoot in args.jsonRoots"
                    v-bind:selected="jsonRoot == args.stagingRoot"
                        >{{jsonRoot}}</option>
            </select>


            <div style="padding-top:20px;font-weight: bold;">List of Paths</div>
            <div  style="height:200px;width:100%; border: 0px;color:black;padding: 10px;overflow:scroll;">
                <div v-for="jsonPath in args.jsonPaths" >
                   <input type="checkbox" id="{{jsonPath}}" value="{{jsonPath}}" v-model="args.stagingFilter[jsonPath]">
                   <label for="{{jsonPath}}">{{jsonPath}}</label>
                </div>
            </div>
            <div style="height: 25px;"></div>


            <div style="font-weight: bold;">Result</div>
            <pre>{{args.filteredStagingResponse}}</pre>

        </div>
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

            callJsonTraverse: async function(input) {
                var mm = this

                var result = await callFunction(
                {
                    driver_name: "json_traverse_service",
                    method_name: "json_traverse_service"
                }
                ,
                {
                    input: input
                })


                if (result) {
                    return result
                }
                return null
            }
            ,

            getJsonFiltered: async function(input) {
                var mm = this

                var result = await callFunction(
                {
                    driver_name: "json_filter_service",
                    method_name: "json_filter_service"
                }
                ,
                {
                    input: input,
                    filter: this.args.stagingFilter,
                    root:  this.args.stagingRoot

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






            callStagingRestApi: async function( urlToCall ) {

                this.args.filteredStagingResponse = new Object()
                var jsonResponse  = await this.callRestApi(this.args.stagingURL)
                this.args.stagingResponse   = jsonResponse



                var aa = await this.callJsonTraverse(jsonResponse)
                this.args.jsonPaths = Object.keys(aa.paths)

                this.args.jsonRoots = Object.keys(aa.roots)

                for (var ert=0;ert<this.args.jsonPaths.length;ert++) {
                    this.args.stagingFilter[this.args.jsonPaths[ert]] = true
                }
                this.args.filteredStagingResponse = JSON.parse(JSON.stringify(this.args.stagingResponse))
            }
            ,

            promoteStagingToLive: async function(urlToCall) {

                this.args.filteredStagingResponse = new Object()
                var jsonResponse  = await this.callRestApi(this.args.stagingURL)
                this.args.stagingResponse   = jsonResponse

                //alert(JSON.stringify(Object.keys(this.allPaths),null,2))

                //this.args.filteredStagingResponse.value = new Object()

                var aa = await this.callJsonTraverse(jsonResponse)
                this.args.jsonPaths = Object.keys(aa)

                for (var ert=0;ert<this.args.jsonPaths.length;ert++) {
                    this.args.stagingFilter[this.args.jsonPaths[ert]] = true
                }
                //alert(JSON.stringify(aa,null,2))
                //this.args.filteredStagingResponse = aa

            }
            ,


            filterRestApi: async function(urlToCall) {

                //alert(JSON.stringify(this.filter,null,2))
                var aa = await this.getJsonFiltered(this.args.stagingResponse)
                this.args.filteredStagingResponse  = aa

            }
            ,

















            pathToString: function (pp) {
                var s = ""
                for (  var aa = 0  ;  aa < pp.length  ;  aa ++  ) {
                    s += pp[aa]
                    if (aa < pp.length -1) {
                        s += "."
                    }
                }
                return s
            }






        }




    })
}
