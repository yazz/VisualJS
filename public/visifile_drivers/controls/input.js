function(args) {
/*
is_app(true)
is_control(true)
display_name("Input control")
description("This will return the input control")
base_component_id("input_control")
load_once_from_file(true)
properties(
    [
        {
            id:     "label",
            name:   "Label",
            type:   "String"
        }
        ,
        {
            id:     "placeholder",
            name:   "Placeholder",
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
            id:     "text",
            name:   "Text",
            type:   "String"
        }
    ]
)//properties
logo_url("data:image/png;base64,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")
*/

    Vue.component("input_control",{
      props: ["args"]
      ,
      template: `<div>
                    <label>{{args.label}}</label>

                    <input  class="form-control2"

                            v-bind:style=   '"width:100%; " +
                                             "background-color: "+    args["background_color"]  +  ";"'

                            v-model='text'>  </input>



                            <button  class='btn btn-info'
                                     v-on:click='alert(text)'>  click  </button>
                 </div>`
      ,
      mounted: function() {
            //this.text = this.args.text
      }
      ,
      data: function() {
            return {
                text: "aaa"
            }
      }
    })
}
