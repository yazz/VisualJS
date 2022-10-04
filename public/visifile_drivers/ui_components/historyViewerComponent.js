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
            text:           args.text
            ,
            commitsV1: [
                {codeSha: "fdsfsddfsfsdfds", timestamp: new Date().getTime()},
                {codeSha: "fdsfsddfsfsdfds", timestamp: new Date().getTime() - 1000},
                {codeSha: "fdsfsddfsfsdfds", timestamp: new Date().getTime() - 10000}
            ]
        }
      },
      template: `<div style='background-color:white; ' >

                      <div style='box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);background-color: lightgray; padding: 5px;padding-left: 15px;border: 4px solid lightgray;' >
                        <slot style='box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);display: inline-block;' v-if='text' :text2="text">
                        </slot>
                      </div>
                      
                      Component History
                      
                      <div style="overflow: scroll;height:40vh">
                        <b>Previous commits:</b>
                        <li v-for='commit in commitsV1'
                            style='color:white;background-color:navy;'>
                          {{commit.codeSha}} , {{commit.timestamp}} , {{msToTime(commit.timestamp)}}

                        </li>
                      </div>
                      
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
