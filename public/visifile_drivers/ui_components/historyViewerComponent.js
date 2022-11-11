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


            firstCommitTimestamps: {}
            ,


            selectedCommit: null
            ,

            // list of commits. Eg:
            //        [  {codeSha: "fdsfsddfsfsdfds", timestamp: new Date().getTime()},    ]
            commitsV1: [
            ]
            ,


            currentCommithashId: null
            ,


            baseComponentId: null
            ,

            newMode: false
            ,


            data: {}
            ,


            d3Tree: null
        }
      },
      template: `<div style='background-color:white; ' >

                      <div style='box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);background-color: lightgray; padding: 5px;padding-left: 15px;border: 4px solid lightgray;' >
                        <slot style='box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);display: inline-block;' v-if='text' :text2="text">
                        </slot>
                      </div>


                      <!-- ---------------------------------------------------------------------------------------------
                      Show the new style view 
                      --------------------------------------------------------------------------------------------- -->
                      <div  style='border-radius: 5px;margin-left:15px;margin-top:15px;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);border: 4px solid lightgray;padding:5px; ' 
                            v-if="newMode">
                            
                        <button  type=button class=' btn btn-danger btn-sm'
                                 style="float: right;box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 8px 0px, rgba(0, 0, 0, 0.19) 0px 6px 20px 0px;margin-bottom: 2px;"
                                 v-on:click='newMode = false' >Old mode</button>
                                 
                        <div    style='font-size:14px;font-weight:bold;border-radius: 0px;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);background-image: linear-gradient(to right,  #000099, lightblue); color: white; border: 0px solid lightgray; padding:4px; margin:0;padding-left:14px;'>

                          Component History
                        </div>



                        <section id="visualisation">
                        

                        
                      </div>











                      <!-- ---------------------------------------------------------------------------------------------
                      Show the old style view 
                      --------------------------------------------------------------------------------------------- -->
                      <div  style='border-radius: 5px;margin-left:15px;margin-top:15px;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);border: 4px solid lightgray;padding:5px; ' 
                            v-if="!newMode">
                            
                        <button  type=button class=' btn btn-danger btn-sm'
                                 style="float: right;box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 8px 0px, rgba(0, 0, 0, 0.19) 0px 6px 20px 0px;margin-bottom: 2px;"
                                 v-on:click='setUpD3()' >New mode</button>
                                 
                        <div    style='font-size:14px;font-weight:bold;border-radius: 0px;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);background-image: linear-gradient(to right,  #000099, lightblue); color: white; border: 0px solid lightgray; padding:4px; margin:0;padding-left:14px;'>

                          Component History
                        </div>
                        
                        
                        <div><b>Current commit ID:</b> {{currentCommithashId}}</div>
                        
                        
                        <div>
                          <b>Previous commits:</b>  
                        </div>
                        
                      
                      
                      <div style="overflow: scroll;height:40vh">
                        <li v-for='(commit, commitIndex) in commitsV1'
                            style='color:black;'>
                          {{msToTime(commit.timestamp,{shortOnly: true})}} - {{commit.numChanges}}
                          <span v-if="(commit.numChanges > -1) && (selectedCommit != commit.codeSha)">
                            <a href='#' v-on:click='selectedCommit = commit.codeSha'>More</a> 
                            (Future commits:
                            <span v-for='(descendant,index) in commit.descendants'>
                              <span v-if="(commitIndex == 0 ) || (commitsV1[commitIndex-1].codeSha != descendant.id)"
                                    v-on:click="showCommitsUp(descendant.id)" style="color:blue">{{descendant.id}}</span>  
                            </span> 
                            
                            )
                          </span>
                          <span v-if="(commit.numChanges > -1) && (selectedCommit == commit.codeSha)">
                            <a href='#' v-on:click='selectedCommit = null'>Less</a>
                          </span>
                          <div v-if="selectedCommit == commit.codeSha" style="background-color: lightgray;padding: 10px;">
                                <br/>
                                <div><b>Time:</b> {{msToTime(commit.timestamp,{timeOnly: true})}} </div>
                                <div><b>Commit ID:</b> {{commit.codeSha}} </div>
                                <div><b>Type:</b> {{commit.baseComponentId}} </div>
                                <div><b>User:</b> {{commit.userId}} </div>
                                <br/>
                                <div v-if="commit.changes">
                                    <div
                                        v-for="(item,i) in commit.changes.slice().reverse()">
                                        <span v-if="i==(commit.changes.length - 1)"><b>First commit</b> - </span>
                                        <span v-if="i!=(commit.changes.length - 1)"><b>{{ capitalizeFirstLetter(timeDiffLater(firstCommitTimestamps[commit.codeSha], item.timestamp)) }}</b> - </span>
                                       
                                      {{ item.code_change_text }}
                                    </div>
                              </div>
                          </div>


                        </li>
                      </div>
                  </div>
                  
             </div>`
     ,

     mounted: async function() {


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
         getText: async function () {
             if (!isValidObject(this.text)) {
                 return null
             }

             return this.text
         }
         ,


         getCurrentCommitId: async function () {
             //debugger
             let mm = this
             let retVal = null
             let openfileurl = "http" + (($HOSTPORT == 443) ? "s" : "") + "://" + $HOST + "/get_commit_hash_id"
             let promise = new Promise(async function (returnfn) {
                 fetch(openfileurl, {
                     method: 'post',
                     credentials: "include",
                     headers: {
                         'Content-Type': 'application/json'
                         // 'Content-Type': 'application/x-www-form-urlencoded'
                     },
                     body: JSON.stringify({text: mm.text})
                 })
                     .then((response) => response.json())
                     .then(function (responseJson) {
                         returnfn(responseJson.ipfsHash)
                     })
                     .catch(err => {
                         //error block
                         returnfn(null)
                     })
             })
             retval = await promise
             return retval
         }
         ,


         showCommitsUp: async function (commitId) {
             //debugger
             let mm = this
             mm.commitsV1 = []
             //zzz
             let openfileurl = "http" + (($HOSTPORT == 443) ? "s" : "") + "://" + $HOST + "/get_version_future?" +
                 new URLSearchParams({
                     id: mm.baseComponentId,
                     commit_id: mm.currentCommithashId
                 })

             let promise = new Promise(async function (returnfn) {
                 fetch(openfileurl, {
                     method: 'get',
                     credentials: "include"
                 })
                     .then((response) => response.json())
                     .then(function (responseJson) {
                         //debugger
                         for (let rt = 0; rt < responseJson.length; rt++) {

                             mm.commitsV1.push(
                                 {
                                     codeSha: responseJson[rt].id,
                                     timestamp: responseJson[rt].creation_timestamp,
                                     numChanges: responseJson[rt].num_changes,
                                     changes: responseJson[rt].changes,
                                     userId: responseJson[rt].user_id,
                                     baseComponentId: responseJson[rt].base_component_id,
                                     descendants: responseJson[rt].descendants
                                 })


                             if (responseJson[rt].changes && responseJson[rt].changes.length > 0) {
                                 mm.firstCommitTimestamps[responseJson[rt].id] = responseJson[rt].changes[0].timestamp
                             }
                             returnfn()

                         }


                     })
                     .catch(err => {
                         //error block
                         returnfn()
                     })
             })
             let retval = await promise
             return retval

         }
         ,


         getHistory: async function () {
             //debugger
             let mm = this
             mm.commitsV1 = []
             let openfileurl = "http" + (($HOSTPORT == 443) ? "s" : "") + "://" + $HOST + "/get_version_history_v2?" +
                 new URLSearchParams({
                     id: mm.baseComponentId,
                     commit_id: mm.currentCommithashId
                 })

             let promise = new Promise(async function (returnfn) {
                 fetch(openfileurl, {
                     method: 'get',
                     credentials: "include"
                 })
                     .then((response) => response.json())
                     .then(function (responseJson) {
                         //debugger
                         for (let rt = 0; rt < responseJson.length; rt++) {

                             mm.commitsV1.push(
                                 {
                                     codeSha: responseJson[rt].id,
                                     timestamp: responseJson[rt].creation_timestamp,
                                     numChanges: responseJson[rt].num_changes,
                                     changes: responseJson[rt].changes,
                                     userId: responseJson[rt].user_id,
                                     baseComponentId: responseJson[rt].base_component_id,
                                     descendants: responseJson[rt].descendants
                                 })


                             if (responseJson[rt].changes && responseJson[rt].changes.length > 0) {
                                 mm.firstCommitTimestamps[responseJson[rt].id] = responseJson[rt].changes[0].timestamp
                             }
                             returnfn()

                         }


                     })
                     .catch(err => {
                         //error block
                         returnfn()
                     })
             })
             let retval = await promise
             return retval

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
         setText: async function (textValue) {
             this.text = textValue
             this.baseComponentId = saveHelper.getValueOfCodeString(this.text, "base_component_id")

             //debugger
             this.currentCommithashId = await this.getCurrentCommitId()
             await this.getHistory()

             if (!isValidObject(this.text)) {
                 return
             }

         }


         ,
         setUpD3: async function () {
             let mm = this
             this.newMode = true
             setTimeout(async function () {
                await mm.getHistory_v3()
debugger
                 var options = {
                     data: mm.data,
                     element: document.getElementById("visualisation"),
                     getId: function (data) {
                         return data.id;
                     },
                     getChildren: function (data) {
                         return data.children;
                     },
                     getBodyDisplayText: function (data) {
                         return data.description;
                     },
                     getTitleDisplayText: function (data) {
                         return data.name;
                     }
                     ,
                     setOrientation: "leftToRight"
                 };
                 mm.d3Tree = new d3.mitchTree.circleTree(options)
                     .on("nodeClick", function(event) {
                         if (event.type == 'collapse') {
                             event.continue = false;
                        }
                     debugger
                         // Expand all nodes
                         mm.d3Tree.expandRecursively(mm.d3Tree.getRoot());
                         mm.d3Tree.update();
                        })
                     .setDisplayTextAccessor(function(data) {
                         return data.name;
                     })
                     .initialize();


             }, 200)
         }
         ,




         getHistory_v3: async function () {
             //debugger
             let mm = this
             mm.commitsV1 = []
             let openfileurl = "http" + (($HOSTPORT == 443) ? "s" : "") + "://" + $HOST + "/get_version_history_v2?" +
                 new URLSearchParams({
                     id: mm.baseComponentId,
                     commit_id: mm.currentCommithashId
                 })

             let promise = new Promise(async function (returnfn) {
                 fetch(openfileurl, {
                     method: 'get',
                     credentials: "include"
                 })
                     .then((response) => response.json())
                     .then(function (responseJson) {
                         //debugger
                         for (let rt = 0; rt < responseJson.length; rt++) {
                            if (rt == 0) {
                                let commitItem =
                                    {
                                        "id": 1,
                                        "name": "All",
                                        "type": "Root",
                                        "description": "dsj " + responseJson[rt].id,
                                        "children": [
                                            {
                                                "id": 2,
                                                "name": "Carnivores",
                                                "type": "Type",
                                                "description": "Diet consists solely of animal materials<b>dfw</b>",
                                                children: [
                                                    {
                                                        "id": 3,
                                                        "name": "Javanese Cat",
                                                        "type": "Organism",
                                                        "description": "Domestic breed of cats, of oriental origin",
                                                        "children": []
                                                    }
                                                    ,
                                                    {
                                                        "id": 4,
                                                        "name": "Javanese Cat",
                                                        "type": "Organism",
                                                        "description": "Domestic breed of cats, of oriental origin",
                                                        children: [
                                                            {
                                                                "id": 5,
                                                                "name": "Javanese Cat",
                                                                "type": "Organism",
                                                                "description": "Domestic breed of cats, of oriental origin",
                                                                "children": []
                                                            }
                                                            ,
                                                            {
                                                                "id": 6,
                                                                "name": "Javanese Cat",
                                                                "type": "Organism",
                                                                "description": "Domestic breed of cats, of oriental origin",
                                                                "children": []
                                                            }

                                                        ]                                                    }

                                                ]
                                            }
                                        ]
                                    }
                                mm.data = commitItem
                            }
                            returnfn()
                         }


                     })
                     .catch(err => {
                         //error block
                         returnfn()
                     })
             })
             let retval = await promise
             return retval

         }










     }
    })


}
