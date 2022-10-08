function component( args ) {
/*
base_component_id("embed_app_component")
component_type("SYSTEM")
load_once_from_file(true)
*/

    Vue.component("embed_app_component", {
      data: function () {
        return {
            text:                args.text,
            baseComponentId:     null,
        }
      },
      template:
`<div style='background-color:white; ' >
    <div style='box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);background-color: lightgray; padding: 5px;padding-left: 15px;border: 4px solid lightgray;' >

        <slot style='box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);display: inline-block;' v-if='text' :text2="text">
        </slot>
    </div>

    <div style='border-radius: 5px;margin-left:15px;margin-top:15px;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);border: 4px solid lightgray; '>
        <div    style='font-size:14px;font-weight:bold;border-radius: 0px;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);background-image: linear-gradient(to right,  #000099, lightblue); color: white; border: 0px solid lightgray; padding:4px; margin:0;padding-left:14px;'>

            App Embed

        </div>

        <div style="padding:10px; overflow:scroll;height:65vh;">

            <div style="height:100%;">

              <appEmbed v-bind:base_component_id_arg='baseComponentId'></appEmbed>
 
            </div>

        </div>

  
</div>`
     ,

     mounted: function() {
         var thisVueInstance  = this
         args.text            = null
         this.baseComponentId = saveHelper.getValueOfCodeString(thisVueInstance.text, "base_component_id")

         if (isValidObject(thisVueInstance.text)) {
             this.read_only = saveHelper.getValueOfCodeString(thisVueInstance.text, "read_only")
         }
     }
     ,
     methods: {

         getText: async function () {
             if (!isValidObject(this.text)) {
                 return null
             }

             return this.text
         }
         ,

         setText: function (textValue) {
             var thisVueInstance = this
             this.text = textValue

             if (!isValidObject(this.text)) {
                 return
             }


         }

     }
    })

}
