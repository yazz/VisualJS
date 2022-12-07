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

            commitCode: null
            ,
            parentCommitCode: null
            ,
            diffText: ""
            ,

            showCode: "details"
            ,


            firstCommitTimestamps: {}
            ,


            previewedCommitId: null
            ,

            lockedSelectedCommit: null
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
            ,



            groupColors: {
                1: {normal: "background-color: lightblue", highlighted: "background-color: blue;color:white;"},
                2: {normal: "background-color: pink", highlighted: "background-color: red;color:white;"},
                3: {normal: "background-color: lightgray", highlighted: "background-color: gray;color:white;"},
                4: {normal: "background-color: yellow", highlighted: "background-color: orange;color:white;"},
                5: {normal: "background-color: lightbrown", highlighted: "background-color: brown;color:white;"}
            }
            ,



            highlightedItems: {}
            ,
            inUnHighlightAll: false
            ,



            processingMouse: false




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


                        <div style="margin: 10px;"
                             v-on:mouseenter="onlyHighlightLockedItem()">

                          <button  type=button class='btn btn-dark'
                                   style="box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 8px 0px, rgba(0, 0, 0, 0.19) 0px 6px 20px 0px;margin-bottom: 2px;margin-right: 20px;"
                                   v-on:click="gotoHome()" >Home</button>
                                   
                                   
                          <button  type=button class='btn  btn-primary'
                                   style="box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 8px 0px, rgba(0, 0, 0, 0.19) 0px 6px 20px 0px;margin-bottom: 2px;margin-right: 20px;"
                                   v-on:click="gotoParent()" >&lt;</button>

                          <button  type=button class='btn  btn-primary'
                                   style="box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 8px 0px, rgba(0, 0, 0, 0.19) 0px 6px 20px 0px;margin-bottom: 2px;margin-right: 20px;"
                                   v-on:click="gotoChild()" >&gt;</button>

                          <button  type=button class='btn  btn-primary'
                                   style="box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 8px 0px, rgba(0, 0, 0, 0.19) 0px 6px 20px 0px;margin-bottom: 2px;margin-right: 20px;"
                                   v-on:click="showDetails()" >Details</button>


                            <button  type=button class='btn  btn-primary'
                                     style="box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 8px 0px, rgba(0, 0, 0, 0.19) 0px 6px 20px 0px;margin-bottom: 2px;margin-right: 20px;"
                                     v-on:click="showCommit()" >Code</button>
    
                            <button  type=button class='btn  btn-info'
                                     style="box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 8px 0px, rgba(0, 0, 0, 0.19) 0px 6px 20px 0px;margin-bottom: 2px;"
                                     v-on:click="diffCode()" >Diff</button>
    
                            <button  type=button class='btn  btn-info'
                                     style="box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 8px 0px, rgba(0, 0, 0, 0.19) 0px 6px 20px 0px;margin-bottom: 2px;"
                                     v-on:click="checkoutCode()" >Checkout</button>
    

                        </div>

                          <div id="visualization_history_timeline">
                          </div>
                    

                          <div  id="visualization_commit_details"
                                style="padding: 10px;">
                                
                            <div v-if="(previewedCommitId != null) && (commitsV3[previewedCommitId])">
                              
                              <div v-if="showCode=='details'">

                                    <div><b>Tags:</b> {{commitsV3[previewedCommitId].code_tags.length}}</div>
                                      <div style="margin-left: 80px;"
                                           v-for="(item,i) in commitsV3[previewedCommitId].code_tags">
                                        {{ item.code_tag }}
                                      </div>

                                  <div><b>Commit ID:</b> {{commitsV3[previewedCommitId].id}}</div>
                                  <div><b>Time:</b> {{msToTime(commitsV3[previewedCommitId].timestamp,{timeOnly: true})}} </div>
                                  <div><b>User ID:</b> {{commitsV3[previewedCommitId].user_id}}</div>
                                  <div><b>Parent:</b> {{commitsV3[previewedCommitId].parent_id}}</div>
                                  <div><b>Type:</b> {{commitsV3[previewedCommitId].base_component_id}}</div>
                                  <div><b>Descendants:</b>
                                      <span v-if="commitsV3[previewedCommitId].descendants.length==1">
                                        ({{commitsV3[previewedCommitId].descendants.length}})
                                      </span>
                                    <span v-if="commitsV3[previewedCommitId].descendants.length>1" style="color:red;">
                                        ({{commitsV3[previewedCommitId].descendants.length}})
                                      </span>
                                       
                                    <span v-for='(descendant,index) in commitsV3[previewedCommitId].descendants'>
                                      <span v-on:click="findFutureCommits(descendant.id)" 
                                            style="color:blue"
                                            >
                                            {{descendant.id.substr(0,5)}}...
                                      </span>  
                                    </span>
    
                                  </div>

                                <div><b>Number of Changes:</b> {{commitsV3[previewedCommitId].num_changes}}</div>
                                  <div v-if="commitsV3[previewedCommitId].changes">
                                    <div style="margin-left: 80px;"
                                        v-for="(item,i) in commitsV3[previewedCommitId].changes.slice().reverse()">
                                      <span v-if="i==(commitsV3[previewedCommitId].changes.length - 1)"><b>First commit</b> - </span>
                                      <span v-if="i!=(commitsV3[previewedCommitId].changes.length - 1)"><b>{{ capitalizeFirstLetter(timeDiffLater(firstCommitTimestamps[previewedCommitId], item.timestamp)) }}</b> - </span>
    
                                      {{ item.code_change_text }}
                                    </div>
                                  </div>
                              </div>




                              <div style="margin-top: 30px;">
                                    <pre v-if="commitCode && showCode=='commit'">{{commitCode}}</pre>
    
                                    <pre  v-if="showCode=='diff'"
                                          v-html="diffText"></pre>
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
         //disableAutoSave     = true

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
             let mm =  this
             this.text = textValue
             if (!isValidObject(this.text)) {
                 return
             }



             this.baseComponentId = yz.getValueOfCodeString(this.text, "base_component_id")

             //debugger
             this.currentCommithashId = await this.getCurrentCommitId()
             await this.setupTimeline()
             setTimeout(async function(){
                 await mm.getHistory_v3()
             })






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
         //                            setupTimeline
         //
         // ----------------------------------------------------------------------
         setupTimeline: async function () {
             let mm = this
             //
             // get the earliest commit
             //
             if (mm.timeline != null ) {

                 mm.timeline.destroy()
                 mm.timeline = null
             }
             mm.timelineData = new vis.DataSet([])
             mm.currentGroupId= 1


             setTimeout(async function() {
                 let container = document.getElementById('visualization_history_timeline');


                 // Configuration for the Timeline
                 let timeNow = new Date().getTime()
                 let time2MinsAgo = new Date().getTime() - (2 * 60 * 1000)
                 let options = {
                     zoomable: true
                     ,
                     start: time2MinsAgo
                     ,
                     end: timeNow
                 };
                 let groups = new vis.DataSet()
                 for (let rew = 1; rew < 6; rew++) {
                     groups.add({
                         id: rew,
                         content: "" + rew,
                         order: rew
                     });
                 }


                 // Create a Timeline
                 mm.timeline = new vis.Timeline(container, mm.timelineData, options);
                 mm.timeline.setGroups(groups)
                 mm.timeline.on("mouseOver", async function (properties) {
                    if (mm.processingMouse) {return}
                     mm.processingMouse = true
                     await mm.previewItemDetails(properties.item)
                     mm.processingMouse = false
                 });
                 mm.timeline.on("mouseMove", async function (properties) {
                     if (mm.processingMouse) {return}
                     mm.processingMouse = true
                     await mm.previewItemDetails(properties.item)
                     if (properties.item == null) {

                         await mm.unHighlightAllExceptLockedItem()
                         if (mm.lockedSelectedCommit) {
                             mm.onlyHighlightLockedItem()
                         } else {
                             mm.previewedCommitId = null
                             await mm.clearDetailsPane()
                         }
                     }
                     mm.processingMouse = false
                 });
                 mm.timeline.on("click", async function (properties) {
                     if (mm.processingMouse) {return}
                     mm.processingMouse = true
                     if (properties.item) {
                         await mm.selectItemDetails(properties.item)
                     } else {
                         await mm.unHighlightAllExceptLockedItem()
                         mm.previewedCommitId = null
                         mm.lockedSelectedCommit = null
                     }
                     mm.processingMouse = false
                 });



                 mm.timeline.moveTo(mm.commitsV3[mm.currentCommithashId].timestamp)
                 await mm.selectItemDetails(mm.currentCommithashId)
                 mm.highlightItem(mm.currentCommithashId)



             },100)

         }
         ,

         previewItemDetails: async function(commitId) {
            try {
                let mm = this
                if (commitId) {
                    await mm.unHighlightAllExceptLockedItem(true)
                    await mm.clearDetailsPane()

                    mm.showCode="details"
                    mm.previewedCommitId = commitId
                    mm.highlightItem(commitId)
                    //await mm.showCommit()


                    let thisHistoryItem = mm.commitsV3[commitId]
                    //if (thisHistoryItem.parent_id) {
                    //    mm.highlightItem(thisHistoryItem.parent_id)
                    //}
                    if (thisHistoryItem.descendants) {
                        for (let descendant of thisHistoryItem.descendants) {
                            mm.highlightItem(descendant.id, {style: "border: solid black 2px;"})
                        }
                    }

                }

            } catch (err) {
                debugger
            }


         }
         ,


         selectItemDetails: async function(commitId) {
        // debugger
             let mm = this
             mm.lockedSelectedCommit = commitId
             mm.previewedCommitId = commitId
             mm.showCode='details'
             //await mm.showCommit()

             if (mm.commitsV3[commitId].descendants) {
                 for(let descendant of mm.commitsV3[commitId].descendants) {
                     if (!mm.commitsV3[descendant.id]) {
                         await mm.findFutureCommits(descendant.id)
                     }
                 }
             }
         }
         ,

         onlyHighlightLockedItem: async function() {
             //debugger
             let mm = this
             mm.highlightItem(mm.lockedSelectedCommit)
             mm.unHighlightAllExceptLockedItem()
         }
         ,

         unHighlightAllExceptLockedItem: async function(unhighlightLockedItem) {
             //debugger
             let mm = this
            if (mm.inUnHighlightAll) {
                return
            }

            mm.inUnHighlightAll = true
             for (let highlightedItem of Object.keys(mm.highlightedItems)) {

                 if (mm.highlightedItems[highlightedItem]) {
                    if ((unhighlightLockedItem == true) || highlightedItem != mm.lockedSelectedCommit) {
                        let itemStyle = ""
                        let selectedCommitDataItem = mm.commitsV3[highlightedItem]
                        if (selectedCommitDataItem.descendants && (selectedCommitDataItem.descendants.length > 1)) {
                            itemStyle += "font-weight: bold;"
                        }
                        let selectedCommitUiItem = mm.timelineData.get(highlightedItem);
                        let itemGroup = selectedCommitUiItem.group
                        itemStyle += mm.groupColors[itemGroup].normal
                        itemStyle += "border: solid white 2px;"
                        mm.timelineData.update({
                            id: highlightedItem,
                            style: itemStyle
                        });
                        mm.highlightedItems[highlightedItem] = false
                    }
                 }
             }
             mm.inUnHighlightAll = false
         }
         ,

         highlightItem: async function(commitId, options) {
             let mm = this
             try {
                 let itemStyle = ""
                 let selectedCommitDataItem = mm.commitsV3[commitId]
                 if (!selectedCommitDataItem) {
                    return
                 }
                 if (selectedCommitDataItem.descendants && (selectedCommitDataItem.descendants.length > 1)) {
                    itemStyle += "font-weight: bold;"
                 }

                 let selectedCommitUiItem = mm.timelineData.get(commitId);
                 if (options && options.style) {
                     itemStyle += options.style
                 } else {
                     let itemGroup = selectedCommitUiItem.group
                     itemStyle += mm.groupColors[itemGroup].highlighted
                 }
                 mm.timelineData.update({id: commitId, style: itemStyle});
                 mm.highlightedItems[commitId] = true
             } catch (err) {
                 debugger
             } finally {
             }
         }
         ,


         // ----------------------------------------------------------------------
         //
         //                            render commits to timeline
         //
         // ----------------------------------------------------------------------
         renderCommitsToTimeline: async function () {
             let mm = this


            let listOfCommits = Object.keys(mm.commitsV3)
            let earliestTimestamp = null
            let earliestCommit = null
            for (const commitKey of listOfCommits) {
                let thisCommit = mm.commitsV3[commitKey]
                if (earliestTimestamp == null) {
                    earliestTimestamp = thisCommit.timestamp
                    earliestCommit = commitKey
                } else if ( thisCommit.timestamp < earliestTimestamp) {
                    earliestTimestamp = thisCommit.timestamp
                    earliestCommit = commitKey
                }
            }


            //
            // render the timeline items
            //
            await mm.renderCommit(earliestCommit)

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
                 itemStyle += "font-weight: bold;"
             }
             itemStyle += mm.groupColors[mm.currentGroupId].normal


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
                         await mm.saveResponseToCommitData(responseJson)
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
                     if (responseJson.length > 0) {
                         let earliestCommit = responseJson[0].id
                         await mm.saveResponseToCommitData(responseJson)
                         setTimeout(async function(){
                             mm.currentGroupId ++
                             await mm.renderCommit(earliestCommit)
                         })
                     }


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


         clearDetailsPane: async function() {
             let mm = this

             mm.commitCode = null
             mm.parentCommitCode = null
             mm.diffText = ""
         }
         ,



         saveResponseToCommitData: async function(responseJson) {
            let mm = this
            debugger
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
                         descendants: responseJson[rt].descendants,
                         parent_id: responseJson[rt].parent_commit_id,
                         code_tags: responseJson[rt].code_tags
                     }
                 if (responseJson[rt].changes && responseJson[rt].changes.length > 0) {
                     mm.firstCommitTimestamps[responseJson[rt].id] = responseJson[rt].changes[0].timestamp
                 }
             }
        }
        ,



        showCommit: async function() {
            let mm = this
            mm.showCode='commit'

            let responseJson = await getFromYazzReturnJson("/get_code_commit", {commit_id: mm.previewedCommitId})
            mm.commitCode = responseJson.code
        }
        ,




         showDetails: async function() {
             let mm = this
             mm.showCode='details'
         }
         ,



         checkoutCode: async function() {
             //debugger
             let mm = this
             //alert("Checking out commit: " + mm.lockedSelectedCommit)
             let responseJson = await getFromYazzReturnJson("/get_code_commit", {commit_id: mm.lockedSelectedCommit})
             mm.text = responseJson.code

//zzz
             mm.$root.$emit(
                 'message', {
                     type:   "force_raw_load",
                     commitId: mm.lockedSelectedCommit
                 })

         }
         ,

        diffCode: async function() {
        //debugger
            let mm = this
            mm.showCode = "diff"

            let commitId = mm.previewedCommitId
            if (!commitId) {
                return
            }
            let commitItem = mm.commitsV3[commitId]
            if (!commitItem) {
                return
            }
            let parentid = commitItem.parent_id
            if (!parentid) {
                return
            }
            let responseJson = await getFromYazzReturnJson("/get_code_commit", {commit_id: commitId})
            mm.commitCode = responseJson.code
            let responseJson2 = await getFromYazzReturnJson("/get_code_commit", {commit_id: parentid})
            mm.parentCommitCode = responseJson2.code


            const one = mm.commitCode
                other = mm.parentCommitCode,
                color = '';

            let spanHtml = ""
            const diff = Diff.diffLines(other, one)
            mm.diffText = ""
            diff.forEach((part) => {
                // green for additions, red for deletions
                // grey for common parts
                const color = part.added ? 'green' :
                    part.removed ? 'red' : 'grey';
                spanHtml += "<span style='color: " + color + ";'>"
                spanHtml += part.value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
                spanHtml += "</span>"
                mm.diffText += spanHtml
                spanHtml = ""
            });


        }






        ,
         // -----------------------------------------------------
         //                      gotoParent
         //
         // Go to the parent of the current history item
         //
         //
         //
         // -----------------------------------------------------
         gotoParent: async function () {

             let mm = this
             if (!mm.lockedSelectedCommit) {
                return
             }

             let parentId = mm.commitsV3[mm.lockedSelectedCommit].parent_id
             //alert("goto parent : " + parentId)
             mm.timeline.moveTo(mm.commitsV3[parentId].timestamp)
             await mm.selectItemDetails(parentId)
             mm.highlightItem(parentId)
             await mm.unHighlightAllExceptLockedItem()
         }
         ,




         // -----------------------------------------------------
         //                      gotoChild
         //
         // Go to the child of the current history item
         //
         //
         //
         // -----------------------------------------------------
         gotoChild: async function () {
             let mm = this
             if (!mm.lockedSelectedCommit) {
                 return
             }

             let descendants = mm.commitsV3[mm.lockedSelectedCommit].descendants
             if (!descendants) {
                return
             }
             if (descendants.length == 0) {
                 return
             }
             //alert("goto child : " + descendants[0].id)
             let childId = descendants[0].id
             mm.timeline.moveTo(mm.commitsV3[childId].timestamp)
             await mm.selectItemDetails(childId)
             mm.highlightItem(childId)
             await mm.unHighlightAllExceptLockedItem()
         }
         ,






         // -----------------------------------------------------
         //                      gotoHome
         //
         // Go to the current commid ID item
         //
         //
         //
         // -----------------------------------------------------
         gotoHome: async function () {

             let mm = this

             mm.timeline.moveTo(mm.commitsV3[mm.currentCommithashId].timestamp)
             await mm.selectItemDetails(mm.currentCommithashId)
             mm.highlightItem(mm.currentCommithashId)
             await mm.unHighlightAllExceptLockedItem()
         }



     // ----------------------------------------------------------------------
     //
     //                           .... end of methods:
     //
     // ----------------------------------------------------------------------
     }
    })


}
