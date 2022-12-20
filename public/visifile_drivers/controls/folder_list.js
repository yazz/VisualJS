function(args) {
/*
is_app(true)
component_type("VB")
display_name("Folder list control")
description("The folder list control")
base_component_id("folder_list_control")
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
            type:   "String",
            help:   `The <b>path</b> is the path on the filesystem that you wish to
                      list. On Windows this should be set to something like
                      c:\\ and on Mac or Linux
                      systems this should be like /users/xyz/...`
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
        ,
        {
            id:         "width",
            name:       "Width",
            default:    150,
            type:       "Number"
        }
        ,
        {
            id:         "height",
            name:       "Height",
            default:    150,
            type:       "Number"
        }
     ]
)//properties
logo_url("/driver_icons/folder_list.png")
*/

    Vue.component("folder_list_control",{
      props: ["args","design_mode"]
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
              globalControl[this.args.name] =  this
          }

          this.load()

          var result = await callComponent(
                              {
                                  driver_name: "serverGetHomeDir"
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

               runEventHandler: function() {
                   this.$emit('send', {
                                                   type:               "subcomponent_event",
                                                   control_name:        this.args.name,
                                                   sub_type:           "changed",
                                                   code:                this.args.changed_event
                                               })
               }
               ,
                 load: async function() {
                 var mm = this
                 if (!this.design_mode) {
                     var result = await callComponent(
                                         {
                                             driver_name: "serverFolderHierarchyList"
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
