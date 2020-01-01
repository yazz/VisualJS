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
        ,
        {
            id:         "filteredProductionResponse",
            name:       "Filtered Production Response",
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

              Test staging API

        </button>


        <button    class="btn btn-primary"
                   v-on:click="promoteStagingToLive()">

              Promote Staging To Live

        </button>

        <div/>




        <div style="height:100%;width:600px; border: 0px;color:black;padding: 10px;overflow:scroll;">
            <input v-model="args.stagingURL" size=60></input>
            <div/>



            <div style="font-weight: bold;">Root</div>
            <select v-model="args.stagingRoot" @change="filterStagingRestApi()">
              <option disabled value="">Please select one</option>
              <option  v-for="jsonRoot in args.jsonRoots"
                    v-bind:selected="jsonRoot == args.stagingRoot"
                        >{{jsonRoot}}</option>
            </select>


            <div style="padding-top:20px;font-weight: bold;">List of Paths</div>
            <button    class="btn-sm btn-secondary"  v-on:click="selectAll()">Select All</button>
            <button    class="btn-sm btn-secondary"  v-on:click="selectNone()">Select None</button>
            <div  style="height:200px;width:100%; border: 0px;color:black;padding: 10px;overflow:scroll;">
                <div v-for="jsonPath in args.jsonPaths" >

                   <input   v-if="jsonPath.startsWith(args.stagingRoot)"
                            type="checkbox"
                            id="{{jsonPath}}"
                            value="{{jsonPath}}"
                            v-model="args.stagingFilter[jsonPath]"
                            @change="if (args.stagingFilter[jsonPath]) {checkParents(jsonPath)} else {uncheckChildren(jsonPath)};filterStagingRestApi()">

                   <label v-if="jsonPath.startsWith(args.stagingRoot)"  for="{{jsonPath}}">{{jsonPath}}</label>
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
        // ----------------------------------------------------------------
        //
        //                              data
        //
        //
        //
        //
        // ----------------------------------------------------------------

        data: function() {
            return {
            }
        }

        ,





        // ----------------------------------------------------------------
        //
        //                              mounted
        //
        //
        //
        //
        // ----------------------------------------------------------------

        mounted: async function() {
            registerComponent(this)

        }
        ,


        methods: {
            // ----------------------------------------------------------------
            //
            //                        callRestApiInternal
            //
            //
            //
            //
            // ----------------------------------------------------------------

            callRestApiInternal: async function(url, filter) {
                var mm = this

                var result = await callFunction(
                {
                    driver_name: "rest_call_service",
                    method_name: "rest_call_service"
                }
                ,
                {
                    URL:    url
                })


                if (result) {
                    this.args.productionResponse = result
                    var result2 = await callFunction(
                    {
                        driver_name: "json_filter_service",
                        method_name: "json_filter_service"
                    }
                    ,
                    {
                        input: result,
                        filter: this.args.productionFilter,
                        root:  this.args.productionRoot

                    })


                    if (result2) {
                        return result2
                    }
                    return null
                }
                return null
            }
            ,





            // ----------------------------------------------------------------
            //
            //                        getListOfResponsePathsForJson
            //
            //
            //
            //
            // ----------------------------------------------------------------

            getListOfResponsePathsForJson: async function(input) {
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






            // ----------------------------------------------------------------
            //
            //                        getJsonFiltered
            //
            //
            //
            //
            // ----------------------------------------------------------------

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








            // ----------------------------------------------------------------
            //
            //                        callDefaultRestApi
            //
            //
            //
            //
            // ----------------------------------------------------------------

            callDefaultRestApi: async function() {

                var qwe = await this.callRestApiInternal(this.args.URL)
                return qwe
            }
            ,









            // ----------------------------------------------------------------
            //
            //                        callRestApi
            //
            //
            //
            //
            // ----------------------------------------------------------------

            callRestApi: async function(urlToCall) {

                var mm = this
                if (!urlToCall) {
                    urlToCall = mm.args.URL
                }

                var qwe = await this.callRestApiInternal(urlToCall)
                return qwe
            }
            ,








            // ----------------------------------------------------------------
            //
            //                        selectAll
            //
            //
            //
            //
            // ----------------------------------------------------------------

            selectAll: async function( ) {
                for ( var ert = 0  ;  ert < this.args.jsonPaths.length  ;  ert++  ) {
                    if (this.args.stagingFilter[this.args.jsonPaths[ert]] == false) {
                        this.args.stagingFilter[this.args.jsonPaths[ert]] = true
                    }
                }
                this.filterStagingRestApi()
            }
            ,









            // ----------------------------------------------------------------
            //
            //                        checkParents
            //
            //
            //
            //
            // ----------------------------------------------------------------

            checkParents: async function( jsonPath ) {
                var lastDotPos = jsonPath.lastIndexOf(".")
                if (lastDotPos != -1) {
                    jsonPath = jsonPath.substring(jsonPath,lastDotPos)
                    //alert(jsonPath)
                    this.args.stagingFilter[jsonPath] = true
                    this.checkParents(jsonPath)
                }
            }
            ,





            // ----------------------------------------------------------------
            //
            //                        uncheckChildren
            //
            //
            //
            //
            // ----------------------------------------------------------------

            uncheckChildren: async function( jsonPath ) {
                for ( var ert = 0  ;  ert < this.args.jsonPaths.length  ;  ert++  ) {
                    if (this.args.jsonPaths[ert].startsWith(jsonPath)) {
                        this.args.stagingFilter[this.args.jsonPaths[ert]] = false
                    }
                }
            }
            ,









            // ----------------------------------------------------------------
            //
            //                             selectNone
            //
            //
            //
            //
            // ----------------------------------------------------------------

            selectNone: async function( ) {
                for ( var ert = 0  ;  ert < this.args.jsonPaths.length  ;  ert++  ) {
                    if (this.args.stagingFilter[this.args.jsonPaths[ert]] == true) {
                        this.args.stagingFilter[this.args.jsonPaths[ert]] = false
                    }
                }
                this.filterStagingRestApi()
            }
            ,








            // ----------------------------------------------------------------
            //
            //                     callStagingRestApi
            //
            //
            //
            //
            // ----------------------------------------------------------------

            callStagingRestApi: async function( urlToCall ) {


                //
                // get the JSON response
                //
                this.args.filteredStagingResponse = new Object()
                var jsonResponse  = await this.callRestApi(this.args.stagingURL)
                this.args.stagingResponse   = jsonResponse
                this.args.filteredStagingResponse = JSON.parse(JSON.stringify(this.args.stagingResponse))


                //
                // get the JSON paths and roots in the  response
                //
                var aa = await this.getListOfResponsePathsForJson(jsonResponse)
                this.args.jsonPaths = Object.keys(aa.paths)
                this.args.jsonRoots = Object.keys(aa.roots)


                //
                // show all the fields in the JSON response
                //
                for (var ert=0;ert<this.args.jsonPaths.length;ert++) {
                    this.args.stagingFilter[this.args.jsonPaths[ert]] = true
                }


            }
            ,







            // ----------------------------------------------------------------
            //
            //                     promoteStagingToLive
            //
            //
            //
            //
            // ----------------------------------------------------------------

            promoteStagingToLive: async function(urlToCall) {


                this.args.productionFilter  = JSON.parse(JSON.stringify(this.args.stagingFilter))
                this.args.URL               = this.args.stagingURL
                this.args.productionRoot    = this.args.stagingRoot
                this.changed()
            }
            ,




            // ----------------------------------------------------------------
            //
            //                     changed
            //
            //
            //
            //
            // ----------------------------------------------------------------
            changed: function() {
                this.$root.$emit('message', {
                    type:   "pending"
                })
            }
            ,





            // ----------------------------------------------------------------
            //
            //                          filterStagingRestApi
            //
            //
            //
            //
            // ----------------------------------------------------------------

            filterStagingRestApi: async function() {
                var aa = await this.getJsonFiltered(this.args.stagingResponse)
                this.args.filteredStagingResponse  = aa

            }
            ,


            // ----------------------------------------------------------------
            //
            //                          filterLiveRestApi
            //
            //
            //
            //
            // ----------------------------------------------------------------

            filterProductionRestApi: async function() {
                var aa = await this.getJsonFiltered(this.args.productionResponse)
                this.args.filteredProductionResponse  = aa

            }









        }




    })
}
