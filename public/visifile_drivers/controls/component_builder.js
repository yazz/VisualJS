function(args) {
/*
is_app(true)
component_type("VB")
display_name("EVM Contract control")
description("This will return the EVM Contract control")
base_component_id("component_builder_control")
load_once_from_file(true)
visibility("PRIVATE")
read_only(true)
properties(
    [

        {
            id:         "width",
            name:       "Width",
            default:    150,
            type:       "Number"
        }
        ,
                {
            id:     "design_time_html",
            name:   "Design Time HTML",
            type:   "String",
            types: {text: true},
            textarea: true,
            default:
`<div>{{ properties.name }} </div>

`
}
            ,
                {
            id:     "run_time_html",
            name:   "Run Time HTML",
            type:   "String",
            types: {text: true},
            textarea: true,
            default:
`<div>{{ properties.name }} </div>

`
}
            ,
        {
            id:         "height",
            name:       "Height",
            default:    100,
            type:       "Number"
        }
        ,
        {
            id:         "properties",
            name:       "Properties",
            type:       "Array",
            default:    []
        }
        ,
        {
            id:     "ipfs_hash_id",
            name:   "IPFS Hash ID",
            type:   "String",
            readonly: true
        }
        ,
        {
            id:     "previous_ipfs_version",
            name:   "Previous IPFS Version",
            type:   "String",
            readonly: true
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
            id:         "defaultAccount",
            name:       "Default Account",
            types: {text: true},
            default:    "",
            type:       "String"
        }
        ,
        {
            id:         "infoMessage",
            name:       "infoMessage",
            type:       "String",
            hidden:     true,
            default:    ""
        }
        ,

        {
            id:         "infoColor",
            name:       "infoColor",
            type:       "String",
            hidden:     true,
            default:    "black"
        }
        ,
        {
            id:         "design_time_view",
            name:       "Design Time View",
            //hidden:     true
            type:       "Select",
            default:    "HOME",
            values:     [
                            {display: 'Home',   value: "HOME"},
                            {display: 'Icon editor',   value: "ICON"},
                            {display: 'Design time HTML',   value: "DESIGN"},
                            {display: 'Run time HTML',  value: "RUNTIME"},
                            {display: 'Properties',  value: "PROPERTIES"},
                            {display: 'Mounted code',  value: "MOUNTED"},
                            {display: 'Methods',  value: "METHODS"},
                            {display: 'Member vars',  value: "MEMBER_VARS"},
                            {display: 'Create',  value: "`CREATE`"}
                        ]
        }
        ,








        {
            id:     "icon_image_data",
            name:   "Icon",
            type:   "Image"
        }
        ,

        {
            id:     "background_color",
            name:   "Background color",
            type:   "String"
        }
        ,
        {
            id:     "draw_color",
            name:   "Draw color",
            default:    "black",
            type:   "String"
        }
        ,
        {
            id:     "brush_width",
            name:   "Brush Width",
            default:    6,
            type:   "Number"
        }





    ]
)//properties
logo_url("/driver_icons/builder.png")
*/

    Vue.component("component_builder_control",{
        props: ["meta","name","args","properties","refresh","design_mode"]
        ,
        template: `
          <div style='white-space:normal;height:100%;width:100%; color: black;
                                      border: 0px;background-color: white;overflow: auto;'>

          <div v-bind:style='"width:100%;height:50vh;overflow-y:auto;"'
               v-bind:refresh='refresh'
               v-if='(!design_mode) || (design_mode == "") '>

            <!-- run_time_html_start -->
            {{ properties.name }}
            <!-- run_time_html_end -->
               
          </div>
          <div v-if='design_mode && design_mode != "detail_editor"'>
            <!-- design_time_html_start -->
            {{ properties.name }}
            <!-- design_time_html_end -->
          </div>

          <div v-bind:style='"width:100%;height:50vh;overflow-y:auto;"'
               v-bind:refresh='refresh'
               v-if='design_mode == "detail_editor"'>


            <div v-bind:style='"height:100%;width:100%; overflow: none;"'>

              <ul class="nav nav-pills" v-bind:style='"height:20%;width:100%; overflow: none;"'>
                <li class="nav-item" style="width:10%;padding:2px;">
                  <a  v-bind:class='"nav-link " + ((properties.design_time_view == "HOME")?"active":"")'
                      v-on:click="properties.design_time_view = 'HOME';"
                      style="padding:2px;"
                      href="#">
                    Home
                  </a>
                </li>
                <li class="nav-item" style="width:8%;padding:2px;">
                  <a  v-bind:class='"nav-link " + ((properties.design_time_view == "ICON")?"active":"")'
                      v-on:click="properties.design_time_view = 'ICON';"
                      style="padding:2px;"
                      href="#">
                    Icon
                  </a>
                </li>
                <li class="nav-item" style="width:12%;padding:2px;">
                  <a  v-bind:class='"nav-link " + ((properties.design_time_view == "DESIGN")?"active":"")'
                      v-on:click="properties.design_time_view = 'DESIGN';"
                      style="padding:2px;"
                      href="#">
                    Design
                  </a>
                </li>
                <li class="nav-item" style="width:14%;padding:2px;">
                  <a  v-bind:class='"nav-link " + ((properties.design_time_view == "RUNTIME")?"active":"")'
                      v-on:click="properties.design_time_view = 'RUNTIME';"
                      style="padding:2px;"
                      href="#">
                    Runtime
                  </a>
                </li>
                <li class="nav-item" style="width:10%;padding:2px;">
                  <a  v-bind:class='"nav-link " + ((properties.design_time_view == "PROPERTIES")?"active":"")'
                      v-on:click="properties.design_time_view = 'PROPERTIES';"
                      style="padding:2px;"
                      href="#">
                    Props
                  </a>
                </li>
                <li class="nav-item" style="width:14%;padding:2px;">
                  <a  v-bind:class='"nav-link " + ((properties.design_time_view == "MOUNTED")?"active":"")'
                      v-on:click="properties.design_time_view = 'MOUNTED';"
                      style="padding:2px;"
                      href="#">
                    Mounted
                  </a>
                </li>
                <li class="nav-item" style="width:13%;padding:2px;">
                  <a  v-bind:class='"nav-link " + ((properties.design_time_view == "METHODS")?"active":"")'
                      v-on:click="properties.design_time_view = 'METHODS';"
                      style="padding:2px;"
                      href="#">
                    Methods
                  </a>
                </li>
                <li class="nav-item" style="width:8%;padding:2px;">
                  <a  v-bind:class='"nav-link " + ((properties.design_time_view == "MEMBER_VARS")?"active":"")'
                      v-on:click="properties.design_time_view = 'MEMBER_VARS';"
                      style="padding:2px;"
                      href="#">
                    Vars
                  </a>
                </li>
                <li class="nav-item" style="width:10%;padding:2px;">
                  <a  v-bind:class='"nav-link " + ((properties.design_time_view == "SAVE")?"active":"")'
                      v-on:click="properties.design_time_view = 'CREATE'; createNewComponent()"
                      style="padding:2px;"
                      href="#">
                    Create
                  </a>
                </li>
              </ul>

              <div v-bind:style='((properties.design_time_view == "HOME")?"visibility:visible;":"visibility:hidden;display: none;")'
                   v-bind:refresh='refresh'>

                Home content
                <div>
                Property Count: {{properties.properties.length}}
                </div>
              </div>



              <div v-bind:style='((properties.design_time_view == "ICON")?"visibility:visible;":"visibility:hidden;display: none;")'
                   v-bind:refresh='refresh'>



                <canvas v-if='design_mode == "detail_editor"'
                        v-bind:id='args.name + "_canvas_" + (design_mode?"_design_mode":"")'
                        v-bind:refresh='refresh'
                        style="border: solid black 1px;margin-bottom: 10px;"
                        v-on:mousemove='if (mousedown) {drawNow($event)}'
                        v-on:mousedown='mousedown=true;drawNow($event)'
                        v-on:mouseup='mousedown=false'
                        v-bind:height='iconHeightPixels + "px"'
                        v-bind:width='iconWidthPixels + "px"'
                >
                </canvas>

                <div>
                  <div    v-for="color in colors"
                          v-if='design_mode == "detail_editor"'
                          v-on:click='args.draw_color = color;'
                          v-bind:style="'display: inline-block;width:15px;height:15px;background-color: ' + color">
                  </div>
                  
           

             

                  <div    v-for="brush_size in [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28]"
                          v-if='design_mode == "detail_editor"'
                          v-on:click='args.brush_width = brush_size;'
                          v-bind:style="'display: inline-block;width:' + brush_size + 'px;height:' + brush_size +
                                                              'px;background-color: ' + args.draw_color + ';border: black solid 1px ;margin-right: 2px;'">
                  </div>
              </div>

                
              </div>











              <div v-bind:style='((properties.design_time_view == "DESIGN")?"visibility:visible;":"visibility:hidden;display: none;")'
                   v-bind:refresh='refresh'>

                Design time HTML

                <textarea rows=10 cols=50
                          style="margin: 5px;"
                          v-model='properties.design_time_html'></textarea>
              </div>







              <div v-bind:style='((properties.design_time_view == "RUNTIME")?"visibility:visible;":"visibility:hidden;display: none;")'
                   v-bind:refresh='refresh'>

                Runtime time HTML
                <textarea rows=10 cols=50
                          style="margin: 5px;"
                          v-model='properties.run_time_html'></textarea>
              </div>









              <div v-bind:style='((properties.design_time_view == "PROPERTIES")?"visibility:visible;":"visibility:hidden;display: none;")'
                   v-bind:refresh='refresh'>

               Component properties


                <div    v-for='oneProp in properties.properties'>
                  <div>
                    {{oneProp}}
                  </div>                   
                </div>

                
                <button    class="btn btn-dark"
                           v-on:click="addProperty">

                  Add
                </button>
              </div>










              <div v-bind:style='((properties.design_time_view == "MOUNTED")?"visibility:visible;":"visibility:hidden;display: none;")'
                   v-bind:refresh='refresh'>

                Mounted JS code

              </div>



              <div v-bind:style='((properties.design_time_view == "METHODS")?"visibility:visible;":"visibility:hidden;display: none;")'
                   v-bind:refresh='refresh'>

                JS Methods 

              </div>



              <div v-bind:style='((properties.design_time_view == "MEMBER_VARS")?"visibility:visible;":"visibility:hidden;display: none;")'
                   v-bind:refresh='refresh'>

                Member vars

              </div>


              <div v-bind:style='((properties.design_time_view == "CREATE")?"visibility:visible;":"visibility:hidden;display: none;")'
                   v-bind:refresh='refresh'>

        
                <button    class="btn btn-dark"
                          v-on:click="properties.design_time_view = 'HOME';">

                  Go back
                </button>
                <div>
                  {{deployingStatus}}
                </div>
              </div>




            </div>`
        ,
        data: function() {
            return {
            CUSTOM_UI_GOES_HERE: "zoo"
            ,

              compileResult: ""
              ,
              bytecode: null
              ,
              compileErrors: null
              ,
              deployingStatus: ""
              ,
                compileStatus: "NONE"
                ,
                mousedown: false
                ,
                colors: [ "blue","green","yellow","orange","black","white","purple","red","violet","blue","gray","pink","orange","lightgray","darkgray",
                    "cyan","lightblue"
                ]
                ,
                iconHeightPixels: 200
                ,
                iconWidthPixels: 200

            }
        }
        ,
        watch: {
          // This would be called anytime the value of the input changes
          refresh(newValue, oldValue) {
              //console.log("refresh: " + this.args.text)
              if (isValidObject(this.args)) {
              }          // you can do anything here with the new value or old/previous value
          }
        },
        mounted: async function() {
            registerComponent(this)


            if (isValidObject(this.args.text)) {
            }

            if (isValidObject(this.args.name)) {
                globalControl[this.args.name] =  this
            }

            this.loadImageToCanvas()


        }
        ,
        methods: {
            /*NEW_METHODS_START*/
            /*NEW_METHODS_END*/

            addProperty: function() {
                let mm = this
                mm.properties.properties.push(
                    {
                        id: "New"
                    });
            }
            ,
            drawNow: function(event) {
                var mm= this
                var el = document.getElementById(mm.args.name + "_canvas_" + (mm.design_mode?"_design_mode":""))
                if (isValidObject(el)) {
                    var rect = el.getBoundingClientRect()
                    var left = (event.clientX - rect.left ) - mm.args.brush_width
                    var right = (event.clientY - rect.top) - mm.args.brush_width

                    var ctx = el.getContext("2d");
                    ctx.strokeStyle = mm.args.draw_color;
                    ctx.fillStyle = mm.args.draw_color;
                    ctx.fillRect(left,right,  mm.args.brush_width,  mm.args.brush_width)

                    this.args.image_data = el.toDataURL()
                }
            }
            ,
            compileCode: async function() {
              //debugger
              this.infoMessage = ""


 //               sol = this.properties.code
                this.compileResult          = "compiled "
                    this.compileStatus          = "COMPILED"
                    this.properties.infoMessage = "Contract compiled "
                    this.properties.infoColor = "green"
//                } else {
  //                  this.properties.infoMessage = "Contract compile failed "
    //                this.properties.infoColor = "red"
      //          }
                this.refresh++
                //{{CUSTOM_UI_GOES_HERE}}
            }
            ,
            createNewComponent: async function() {
                debugger
                let mm = this
                  mm.properties.infoMessage = "Contract mined at "
                  mm.properties.infoColor = "black"

                  //mm.refresh++
                  mm.deployingStatus = "Created new component successfully"
                  mm.compileStatus   = "NONE"

//zzz
                  //debugger





                  mm.properties.previous_ipfs_version =  mm.properties.ipfs_hash_id
                  //let  newComponentType = mm.compiledContractName + "_component"
                  //let  newComponentType = "sc_" + instance.options.address
                  let  newComponentType = "sc_" + ("" + uuidv4()).replaceAll("-","_")
                  debugger
                  //debugger
                  callAjaxPost("/copy_component",
                  {
                      relative_filename_to_copy:    "controls/component_builder.js"
                      ,
                      base_component_id:      newComponentType
                       ,
                      image_data:            mm.properties.image_data
                      ,
                      design_time_html:     mm.properties.design_time_html
                      ,
                      run_time_html:     mm.properties.run_time_html
                      ,
                      default_property_values: {
                           previous_ipfs_version:   mm.properties.ipfs_hash_id
                           ,
                           image_data:              mm.properties.image_data
                       }
                       ,
                       new_properties: []
                      ,
                      new_methods: []
                  }
                  ,
                  async function(response){
                    showTimer("in 'save_component' response")
                    //alert(response)
                    //debugger

                    let responseJson = JSON.parse(response)
                    mm.$root.$emit('message', {
                                                    type:             "load_controls",
                                                })
                      mm.meta.getEditor().changeComponentBaseId(
                          {
                              componentName:        mm.properties.name,
                              newComponentBaseId:     newComponentType
                          })

                      mm.meta.getEditor().changePropertyValue(
                          {
                              componentName:          mm.properties.name,
                              propertyName:          "ipfs_hash_id",
                              propertyValue:          responseJson.ipfsHash
                          })

                  })


            }
            ,



            changedFn: function() {
                if (isValidObject(this.args)) {
                }
            }
            ,





            loadImageToCanvas: function() {
                var mm = this
                var base_image = new Image();
                //alert(this.args.image_data)
                base_image.src = this.args.image_data;
                base_image.onload = function() {
                    var el = document.getElementById(mm.args.name + "_canvas_" + (mm.design_mode?"_design_mode":""))
                    if (isValidObject(el)) {
                        //alert(el)
                        var ctx = el.getContext("2d");
                        ctx.clearRect(0, 0, el.width, el.height);
                        var hRatio = el.width / base_image.width    ;
                        var vRatio = el.height / base_image.height  ;
                        var ratio  = Math.min ( hRatio, vRatio );
                        ctx.drawImage(base_image,   0, 0, base_image.width,             base_image.height,
                            0, 0, base_image.width*ratio,       base_image.height*ratio);
                        //alert(base_image)
                    }
                }
            }

        }
    })
}
