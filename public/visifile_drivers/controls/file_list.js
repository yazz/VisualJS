function(args) {
/*
is_app(true)
component_type("VB")
hash_algorithm("SHA256")
display_name("File list control")
description("This will return the file list control")
base_component_id("file_list_control")
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
            id:     "path",
            name:   "Path",
            type:   "String"
        }
        ,
        {
            id:     "changed_event",
            name:   "Changed event",
            type:   "Event"
        }
        ,
        {
            id:     "load",
            name:   "load",
            type:   "Action"
        }
     ]
)//properties
logo_url("/driver_icons/file_list.png")
*/

    Yazz.component({
      props: ["control_properties_and_events","design_mode",  "runEvent"]
      ,
      template: `<div v-bind:style='"height:100%;width:100%; border: 0px;" +
                                    "background-color: "+    control_properties_and_events["background_color"]  +  ";"'>

                                    <select
                                        v-on:change='changedFn();runEventHandler()'
                                        size="15"
                                        v-model='value'>

                                        <option v-for='opt in drives'
                                                v-bind:value='opt'>
                                            {{opt}}
                                        </option>

                                    </select>

                 </div>`
      ,
      data: function() {
         return {
            value: null,
             drives: []
         }
      }
      ,
      mounted: async function() {
          if (isValidObject(this.control_properties_and_events.name)) {
              yz.componentsAPI.vue.mapDesignTimeControlNameToVueInstance({controlName: this.control_properties_and_events.name, vueInstance: this})
          }

          this.load()

          var result = await callComponent(
                              {
                                  base_component_id: "serverGetHomeDir"
                              }
                                  ,{ })
         if (result) {
             if (!this.control_properties_and_events.path) {
                 this.control_properties_and_events.path = result.value
             }
         }
       }
        ,
        watch: {
          // This would be called anytime the value of the input changes
          refresh: function(newValue, oldValue) {
              //console.log("refresh: " + this.control_properties_and_events.text)
              if (isValidObject(this.control_properties_and_events)) {
                  this.value = this.control_properties_and_events.value
              }
          }
        }
         ,
         methods: {




               changedFn: function() {
                   if (isValidObject(this.control_properties_and_events)) {
                       this.control_properties_and_events.value = this.value
                   }
               }
               ,

               runEventHandler: async function() {
                   await this.runEvent({ display: "changed",   code: this.control_properties_and_events.changed_event })

               }
               ,
                 load: async function() {
                 var mm = this
                 if (!this.design_mode) {
                     var result = await callComponent(
                                         {
                                             base_component_id: "serverFileList"
                                         }
                                             ,{ path: mm.control_properties_and_events.path })
                     //alert(JSON.stringify(result,null,2))

                    if (result) {
                         this.drives = result

                    }
                    if (isValidObject(this.control_properties_and_events)) {
                        this.items = this.control_properties_and_events.items
                        if (isValidObject(this.control_properties_and_events.value)) {
                           this.value = this.control_properties_and_events.value
                        }
                    }

                    }
                 }


            }


})
}
