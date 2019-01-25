function(args) {
/*
is_app(true)
control_type("VB")
display_name("Dropdown control")
description("This will return the dropdown control")
base_component_id("dropdown_control")
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
            default:    [{value: 1, text:"aa"}, {value: 2,text:"bb"}],
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
    ]
)//properties
logo_url("/driver_icons/dropdown.png")
*/

    Vue.component("dropdown_control",{
      props: ["args","refresh","design_mode"]
      ,
      template:
`<div   v-bind:style='"width:100%;overflow-y:auto;height:100%"
        v-bind:refresh='refresh'>

    <div v-bind:style='"height:100%;width:100%; border: 0px;color:black;"'
         v-if='design_mode == "detail_editor"'>
         
     </div>

    <div v-bind:style='"height:100%;width:100%; border: 0px;" +
                       "background-color: "+    args["background_color"]  +  ";"'
         v-else>

        <select
            v-on:change='changedFn'
            v-model='value'>

            <option v-for='opt in args.items'
                    v-bind:value='opt.value'>
                {{opt.text}}
            </option>
        </select>
    </div>




</div>`
      ,
      data: function() {
       return {
         value: null
       }
     }
     ,
     watch: {
       // This would be called anytime the value of the input changes
       refresh(newValue, oldValue) {
           //console.log("refresh: " + this.args.text)
           if (isValidObject(this.args)) {
               this.value = this.args.value
           }
       }
     }
     ,
     mounted: function() {


      },
      methods: {
            changedFn: function() {
                if (isValidObject(this.args)) {
                    this.args.value = this.value
                }
            }
      }

    })
}
