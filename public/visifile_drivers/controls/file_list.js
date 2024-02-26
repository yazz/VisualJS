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
      props: ["args","design_mode",  "runEvent"]
      ,
      template: `<div v-bind:style='"height:100%;width:100%; border: 0px;" +
                                    "background-color: "+    args["background_color"]  +  ";"'>

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
          if (isValidObject(this.args.name)) {
              yz.componentsAPI.vue.mapDesignTimeControlNameToVueInstance({controlName: this.args.name, vueInstance: this})
          }

          this.load()

          var result = await callComponent(
                              {
                                  base_component_id: "serverGetHomeDir"
                              }
                                  ,{ })
         if (result) {
             if (!this.args.path) {
                 this.args.path = result.value
             }
         }
       }
        ,
        watch: {
          // This would be called anytime the value of the input changes
          refresh: function(newValue, oldValue) {
              //console.log("refresh: " + this.args.text)
              if (isValidObject(this.args)) {
                  this.value = this.args.value
              }
          }
        }
         ,
         methods: {




               changedFn: function() {
                   if (isValidObject(this.args)) {
                       this.args.value = this.value
                   }
               }
               ,

               runEventHandler: async function() {
                   await this.runEvent({ display: "changed",   code: this.args.changed_event })

               }
               ,
                 load: async function() {
                 var mm = this
                 if (!this.design_mode) {
                     var result = await callComponent(
                                         {
                                             base_component_id: "serverFileList"
                                         }
                                             ,{ path: mm.args.path })
                     //alert(JSON.stringify(result,null,2))

                    if (result) {
                         this.drives = result

                    }
                    if (isValidObject(this.args)) {
                        this.items = this.args.items
                        if (isValidObject(this.args.value)) {
                           this.value = this.args.value
                        }
                    }

                    }
                 }


            }


})
}
