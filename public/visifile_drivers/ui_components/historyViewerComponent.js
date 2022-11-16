function component( args ) {
/*
base_component_id("history_viewer_component")
component_type("SYSTEM")
load_once_from_file(true)
*/

    let editorDomId     = uuidv4()
    let editor          = null


    Vue.component("history_viewer_component", {

      // ----------------------------------------------------------------------
      //
      //                                     DATA
      //
      // ----------------------------------------------------------------------

      data: function () {
        return {
            text:           args.text
            ,


            firstCommitTimestamps: {}
            ,


            selectedCommit: null
            ,

            currentCommithashId: null
            ,


            baseComponentId: null
            ,


            data: {}
            ,


            timeline: null
            ,



            timelineData: new vis.DataSet([])
            ,



            commitsV3: {}
            ,


            currentGroupId: 1




        }
      },



        // ----------------------------------------------------------------------
        //
        //                                    HTML
        //
        // ----------------------------------------------------------------------

        template: `<div style='background-color:white; ' >

                      <div style='box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);background-color: lightgray; padding: 5px;padding-left: 15px;border: 4px solid lightgray;' >
                        <slot style='box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);display: inline-block;' v-if='text' :text2="text">
                        </slot>
                      </div>


                      <!-- ---------------------------------------------------------------------------------------------
                      Show the new style view 
                      --------------------------------------------------------------------------------------------- -->
                      <div  style='overflow: scroll;height:75%;border-radius: 5px;margin-left:15px;margin-top:15px;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);border: 4px solid lightgray;padding:5px; '>
                                 
                        <div    style='font-size:14px;font-weight:bold;border-radius: 0px;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);background-image: linear-gradient(to right,  #000099, lightblue); color: white; border: 0px solid lightgray; padding:4px; margin:0;padding-left:14px;'>

                          Component History
                        </div>



                          <div id="visualization_history_timeline">
                          </div>



                          <div  id="visualization_commit_details"
                                style="padding: 10px;">
                                
                            <div v-if="(selectedCommit != null) && (commitsV3[selectedCommit])">
                              
                              <div><b>Commit ID:</b> {{commitsV3[selectedCommit].id}}</div>
                              <div><b>Time:</b> {{msToTime(commitsV3[selectedCommit].timestamp,{timeOnly: true})}} </div>
                              <div><b>User ID:</b> {{commitsV3[selectedCommit].user_id}}</div>
                              <div><b>Number of Changes:</b> {{commitsV3[selectedCommit].num_changes}}</div>
                              <div><b>Type:</b> {{commitsV3[selectedCommit].base_component_id}}</div>
                              <div><b>Descendants:</b>
                                  <span v-if="commitsV3[selectedCommit].descendants.length==1">
                                    ({{commitsV3[selectedCommit].descendants.length}})
                                  </span>
                                <span v-if="commitsV3[selectedCommit].descendants.length>1" style="color:red;">
                                    ({{commitsV3[selectedCommit].descendants.length}})
                                  </span>
                                   
                                <span v-for='(descendant,index) in commitsV3[selectedCommit].descendants'>
                                  <span v-on:click="findFutureCommits(descendant.id)" 
                                        style="color:blue"
                                        v-if="!commitsV3[descendant.id]"
                                        >
                                        {{descendant.id.substr(0,5)}}...
                                  </span>  
                                </span>

                              </div>

                              <div v-if="commitsV3[selectedCommit].changes">
                                <div style="margin-left: 80px;"
                                    v-for="(item,i) in commitsV3[selectedCommit].changes.slice().reverse()">
                                  <span v-if="i==(commitsV3[selectedCommit].changes.length - 1)"><b>First commit</b> - </span>
                                  <span v-if="i!=(commitsV3[selectedCommit].changes.length - 1)"><b>{{ capitalizeFirstLetter(timeDiffLater(firstCommitTimestamps[selectedCommit], item.timestamp)) }}</b> - </span>

                                  {{ item.code_change_text }}
                                </div>
                              </div>




                            </div>

                          </div>
                      </div>




                  </div>`
     ,



    // ----------------------------------------------------------------------
    //
    //                                 mounted
    //
    // ----------------------------------------------------------------------
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
             await this.setupTimeline()

             if (!isValidObject(this.text)) {
                 return
             }

         }
         ,



         // ----------------------------------------------------------------------
         //
         //                            setupTimeline
         //
         // ----------------------------------------------------------------------
         setupTimeline: async function () {
             let mm = this
             if (mm.timeline != null ) {

                 mm.timeline.destroy()
                 mm.timeline = null
             }
             mm.timelineData = new vis.DataSet([])
             mm.currentGroupId= 1

             setTimeout(async function () {
                 //debugger
                 await mm.getHistory_v3()



                 let container = document.getElementById('visualization_history_timeline');


                 // Configuration for the Timeline
                 let options = {
                     zoomable:true
                 };
                 let groups = new vis.DataSet()
                 for (let rew=1;rew<6;rew++) {
                     groups.add({
                         id: rew,
                         content: "" + rew,
                         order: rew
                     });
                 }

                 // Create a Timeline
                 mm.timeline = new vis.Timeline(container, mm.timelineData, options);
                 mm.timeline.setGroups(groups)
                 mm.timeline.on("mouseOver", function (properties) {
                     if(properties.item){
                         //debugger
                         mm.selectedCommit = properties.item;
                     }
                 });


             }, 200)
         }
         ,






         // ----------------------------------------------------------------------
         //
         //                            getCurrentCommitId
         //
         // ----------------------------------------------------------------------
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











         // ----------------------------------------------------------------------
         //
         //                            render commits to timeline
         //
         // ----------------------------------------------------------------------
         renderCommitsToTimeline: async function () {
             //
             // get the earliest commit
             //
             let mm = this
             let listOfCommits = Object.keys(mm.commitsV3)
             let earliestTimestamp = null
             let earlierCommit = null
             for (const commitKey of listOfCommits) {
                 let thisCommit = mm.commitsV3[commitKey]
                 if (earliestTimestamp == null) {
                     earliestTimestamp = thisCommit.timestamp
                     earlierCommit = commitKey
                 } else if ( thisCommit.timestamp < earliestTimestamp) {
                     earliestTimestamp = thisCommit.timestamp
                     earlierCommit = commitKey
                 }
             }
             //alert("earliestTimestamp:" + earliestTimestamp)
             //alert("earlierCommit:" + earlierCommit)



             //
             // clear the vis.js timeline
             //
             if (mm.timeline != null ) {

                 mm.timeline.destroy()
                 mm.timeline = null
             }
             mm.timelineData = new vis.DataSet([])
             mm.currentGroupId= 1



             debugger
             //
             // render the timeline items
             //
             await mm.renderCommit(earlierCommit)
         }
         ,





         // ----------------------------------------------------------------------
         //
         //                 renderCommit
         //
         // ----------------------------------------------------------------------
         renderCommit: async function (commitId) {
             let mm         = this
             let commitItem = mm.commitsV3[commitId]
             let itemStyle  = ""

             if (!commitItem) {
                return
             }

             if (commitItem.parent_id) {
                let parentCommitItem = mm.commitsV3[commitItem.parent_id]
                if (parentCommitItem) {
                    if (parentCommitItem.base_component_id != commitItem.base_component_id) {
                        mm.currentGroupId ++
                    }
                }
             }

             if (commitItem.descendants && (commitItem.descendants.length > 1)) {
                 itemStyle += "background-color:pink;"
             }


             mm.timelineData.add(
                 {
                     id:        commitItem.id,
                     content:   commitItem.id.substr(0,5) + (commitItem.num_changes?(" (" + commitItem.num_changes +")"):""),
                     start:     commitItem.timestamp,
                     group:     mm.currentGroupId,
                     style:     itemStyle
                 });

             if (commitItem.descendants) {
                 for (const descendant of commitItem.descendants) {
                     if (mm.commitsV3[descendant.id]) {
                        mm.renderCommit(descendant.id)
                     }
                 }
             }
         }
         ,




         // ----------------------------------------------------------------------
         //
         //                 get the history of this commit going backwards
         //
         // ----------------------------------------------------------------------
         getHistory_v3: async function () {
             //debugger
             let mm = this
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
                     .then(async function (responseJson) {
                         //debugger
                         for (let rt = 0; rt < responseJson.length; rt++) {
                            // Create a DataSet (allows two way data-binding)
                            //debugger


                             if ( rt == (responseJson.length-1)) {
                                 mm.currentGroupId++
                             }


                             let itemStyle = ""
                             if (responseJson[rt].descendants && (responseJson[rt].descendants.length > 1)) {
                                itemStyle += "background-color:pink;"
                             }

                             mm.commitsV3[responseJson[rt].id] =
                                 {
                                    id: responseJson[rt].id,
                                     timestamp: responseJson[rt].creation_timestamp,
                                     num_changes: responseJson[rt].num_changes,
                                     changes: responseJson[rt].changes,
                                     user_id: responseJson[rt].user_id,
                                     base_component_id: responseJson[rt].base_component_id,
                                     descendants: responseJson[rt].descendants,
                                     parent_id: responseJson[rt].parent_commit_id
                                 }
                             if (responseJson[rt].changes && responseJson[rt].changes.length > 0) {
                                 mm.firstCommitTimestamps[responseJson[rt].id] = responseJson[rt].changes[0].timestamp
                             }

                             mm.timelineData.add(
                                 {
                                     id: responseJson[rt].id,

                                     content:  responseJson[rt].id.substr(0,5) +
                                         (responseJson[rt].num_changes?(" (" + responseJson[rt].num_changes +")"):""),

                                     start: responseJson[rt].creation_timestamp,

                                     group: mm.currentGroupId,

                                     style: itemStyle
                                 });
                         }
                         await mm.renderCommitsToTimeline()
                         returnfn()


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









         // ----------------------------------------------------------------------
         //
         //                            findFutureCommits
         //
         // ----------------------------------------------------------------------
         findFutureCommits: async function (commitId) {
             //debugger
             //zzz
             let mm = this

             let openfileurl = "http" + (($HOSTPORT == 443) ? "s" : "") + "://" + $HOST + "/get_version_future?" +
                 new URLSearchParams({
                     commit_id: commitId
                 })

             let promise = new Promise(async function (returnfn) {
                 fetch(openfileurl, {
                     method: 'get',
                     credentials: "include"
                 })
                 .then((response) => response.json())
                 .then(async function (responseJson) {
                     //debugger
                     mm.currentGroupId++
                     for (let rt = 0; rt < responseJson.length; rt++) {

                         let itemStyle = ""
                         if (responseJson[rt].descendants && (responseJson[rt].descendants.length > 1)) {
                             itemStyle += "background-color:pink;"
                         }

                         mm.commitsV3[responseJson[rt].id] =
                             {
                                 id: responseJson[rt].id,
                                 timestamp: responseJson[rt].creation_timestamp,
                                 num_changes: responseJson[rt].num_changes,
                                 changes: responseJson[rt].changes,
                                 user_id: responseJson[rt].user_id,
                                 base_component_id: responseJson[rt].base_component_id,
                                 descendants: responseJson[rt].descendants
                             }
                         if (responseJson[rt].changes && responseJson[rt].changes.length > 0) {
                             mm.firstCommitTimestamps[responseJson[rt].id] = responseJson[rt].changes[0].timestamp
                         }

                         mm.timelineData.add(
                             {
                                 id: responseJson[rt].id,

                                 content:  responseJson[rt].id.substr(0,5) +
                                     (responseJson[rt].num_changes?(" (" + responseJson[rt].num_changes +")"):""),

                                 start: responseJson[rt].creation_timestamp,

                                 group: mm.currentGroupId,

                                 style: itemStyle
                             });


                         await mm.renderCommitsToTimeline()
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


     // ----------------------------------------------------------------------
     //
     //                           .... end of methods:
     //
     // ----------------------------------------------------------------------
     }
    })


}
