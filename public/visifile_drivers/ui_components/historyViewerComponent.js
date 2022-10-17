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
// list of commits. Eg:
//        [  {codeSha: "fdsfsddfsfsdfds", timestamp: new Date().getTime()},    ]
            commitsV1: [
            ]
        }
      },
      template: `<div style='background-color:white; ' >

                      <div style='box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);background-color: lightgray; padding: 5px;padding-left: 15px;border: 4px solid lightgray;' >
                        <slot style='box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);display: inline-block;' v-if='text' :text2="text">
                        </slot>
                      </div>

                      <div style='border-radius: 5px;margin-left:15px;margin-top:15px;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);border: 4px solid lightgray; '>
                        <div    style='font-size:14px;font-weight:bold;border-radius: 0px;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);background-image: linear-gradient(to right,  #000099, lightblue); color: white; border: 0px solid lightgray; padding:4px; margin:0;padding-left:14px;'>

                          Component History
                        </div>
                        <b>Previous commits:</b>
                      
                      
                      <div style="overflow: scroll;height:40vh">
                        <li v-for='commit in commitsV1'
                            style='color:black;'>
                          {{commit.codeSha}} ,  {{msToTime(commit.timestamp)}}, {{commit.numChanges}}

                        </li>
                      </div>
                  </div>
                  
             </div>`
     ,

     mounted: async function() {
         let thisVueInstance = this
         debugger
         let baseComponentIdOfItem = saveHelper.getValueOfCodeString(this.text,"base_component_id")
         await this.getHistory(baseComponentIdOfItem)

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

        getHistory: async function(baseComponentIdOfItem) {
            let mm = this
            let openfileurl = "http" + (($HOSTPORT == 443)?"s":"") + "://" + $HOST + "/get_version_history?" +
                new URLSearchParams({
                        id: baseComponentIdOfItem
                })
            fetch(openfileurl, {
                method: 'get',
                credentials: "include"
            })
                .then((response) => response.json())
                .then(function(responseJson)
                {
                    //debugger
                    for (let rt=0;rt<responseJson.length; rt++) {

                        mm.commitsV1.push(
                            {
                                codeSha: responseJson[rt].id,
                                timestamp: responseJson[rt].creation_timestamp,
                                numChanges: responseJson[rt].num_changes
                            }

                            )

                    }

                })
                .catch(err => {
                    //error block
                })
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
