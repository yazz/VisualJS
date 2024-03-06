function(args) {
/*
is_app(true)
component_type("VB")
hash_algorithm("SHA256")
display_name("Dropdown control")
description("This will return the dropdown control")
base_component_id("chart_control")
load_once_from_file(true)
visibility("PRIVATE")
read_only(true)
properties(
    [
        {
            id:     "text",
            name:   "Text",
            type:   "String"
        }
        ,
        {
            id:     "background_color",
            name:   "Background color",
            type:   "String"
        }
        ,
        {
            id:         "items",
            name:       "Items",
            type:       "Array",
            default:    [],
            editor:     "detail_editor"
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
            id:     "changed_event",
            name:   "Changed event",
            type:   "Event"
        }
        ,
        {
            id:     "default_selection",
            name:   "Default Selection",
            type:   "String",
            default: ""
        }
        ,
        {
            id:     "jsonConfig",
            name:   "JSON Config",
            type:   "String",
            textarea: true,
            default: ""
        }
        ,
        {
            id:        "getData",
            name:      "Get Data",
            type:      "Action"
        }
        ,
        {
            id:     "update",
            name:   "Update",
            type:   "Action"
        }

    ]
)//properties
logo_url("/driver_icons/chart.png")
*/



    Yazz.component({
      props: ["meta","name","properties_and_actions","refresh","design_mode","runEvent"]
      ,
      template:
`<div   v-bind:style='"width:100%;overflow-y:auto;height:100%"
        v-bind:refresh='refresh'>

    <div v-bind:style='"height:100%;width:100%; border: 0px;color:black;"'
         v-if='design_mode == "detail_editor"'>


         <label for="usr">Data:</label>
         <textarea style="font-family:monospace; height:80%"
                   v-model="properties_and_actions.jsonConfig"
                   type="" class="form-control" id="usr"
                   cols="50"

                   >
         </textarea>


     </div>

    <div v-bind:style='"height:100%;width:100%; border: 0px;" +
                       "background-color: "+    properties_and_actions["background_color"]  +  ";"'
         v-else>

         <canvas    v-bind:id='canvasId'
                    width="400" height="400"
                    v-if='!design_mode'>
         </canvas>

         <div       width="400"
                    height="400"
                    v-if='design_mode'>

                    Chart - {{properties_and_actions.name}}
         </div>
    </div>




</div>`
      ,
      data: function() {
       return {
         value:             null,
         selected_index:    null,
         items:             [],
         new_value:         "",
         new_text:          "",
         canvasId:           uuidv4(),
         myChart:           null,
       }
     }
     ,
     watch: {
       // This would be called anytime the value of the input changes
       refresh: function(newValue, oldValue) {
           //console.log("refresh: " + this.properties_and_actions.text)
           if (isValidObject(this.properties_and_actions)) {
               this.value = this.properties_and_actions.value
               this.items = this.properties_and_actions.items
           }
       }
     }
     ,
     mounted: async function() {
         await registerComponent(this)
         await useChartsJs()

         if (isValidObject(this.properties_and_actions)) {
             this.items = this.properties_and_actions.items
             if (isValidObject(this.properties_and_actions.value)) {
                this.value = this.properties_and_actions.value
             }
         }
         if (document.getElementById(this.canvasId)) {
             var ctx = document.getElementById(this.canvasId).getContext('2d');

             if (this.properties_and_actions.jsonConfig.length > 0 ) {
                 this.myChart = new Chart(ctx,   eval("(" + this.properties_and_actions.jsonConfig + ")"));
             }
         }
      }
      ,
      methods: {
            getData: function() {
                if (this.myChart) {
                    return this.myChart.data
                } else {
                    return null
                }
            }
            ,
            update: async function() {
                if (this.myChart) {
                    this.myChart.update()
                }
            }
            ,
            changedFn: function() {
                if (isValidObject(this.properties_and_actions)) {
                    this.properties_and_actions.value = this.value
                    this.properties_and_actions.items = this.items
                }
            }
            ,

            runEventHandler: async function() {
                await this.runEvent({ display: "changed",   code: this.properties_and_actions.changed_event })
            }
      }

    })
}
