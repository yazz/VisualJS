function component( args ) {
/*
base_component_id("history_viewer_component")
component_type("SYSTEM")
load_once_from_file(true)
*/

    let editorDomId     = uuidv4()
    let editor          = null


    Vue.component("history_viewer_component", {
      data: function () {
        return {
            text:           args.text,
            read_only:      false,
            editorDomId:    editorDomId,
            errors:         null,
            sqlText:        "{}",
        }
      },
      template: `<div style='background-color:white; ' >
                      Component History
                 </div>`
     ,

     mounted: function() {
         let thisVueInstance = this


     },
     methods: {


        // -----------------------------------------------------
        //                      getText
        //
        // This is called to get the SQL definitions
        //
        //
        //
        // -----------------------------------------------------
        getText: async function() {
            if (!isValidObject(this.text)) {
                return null
            }

            return this.text
        }
        ,



        // -----------------------------------------------------
        //                      setText
        //
        // This is called to set the SQL
        //
        //
        //
        // -----------------------------------------------------
        setText: function(textValue) {
            let thisVueInstance = this
            this.text           =  textValue

            if (!isValidObject(this.text)) {
                return
            }

        }

     }


    })

}
