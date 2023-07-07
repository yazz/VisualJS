function component( args ) {
/*
This is an editor component that is used to view the history of a component

base_component_id("history_viewer_component")
component_type("SYSTEM")
load_once_from_file(true)
*/

    Yazz.component( {

        data:       function () {
            // ******** DATA ********
            return {
                // the component code
                text:                   args.text,

                // this is used to show source code and code diffs
                commitCode:             null,
                parentCommitCode:       null,
                diffText:               "",
                showCode:               "details",

                // used to preview and select commits
                selectedCommitId:      null,

                // the type of the commit
                baseComponentId:        null,
                codeId:                 null,

                // info for the UI timeline
                timeline:               null,
                timelineData:           new vis.DataSet([]),
                currentGroupId:         1,
                groupColors:            {
                    1: {normal: "background-color: lightblue",  highlighted: "background-color: blue;color:white;"},
                    2: {normal: "background-color: pink",       highlighted: "background-color: red;color:white;"},
                    3: {normal: "background-color: lightgray",  highlighted: "background-color: gray;color:white;"},
                    4: {normal: "background-color: yellow",     highlighted: "background-color: orange;color:white;"},
                    5: {normal: "background-color: lightbrown", highlighted: "background-color: brown;color:white;"}
                },
                highlightedItems:       {},
                inUnHighlightAll:       false,
                timelineStart:          null,
                timelineEnd:            null,


                /* when was the change in a commit first made (each commit can have many changes)
                eg:
                    Number of Changes in commit: 5
                        After a few seconds     - Add component: button_control_115(button_control)
                        After a few seconds     - Moved component: button_control_114
                        After a few seconds     - Moved component: button_control_114
                        After under a second    - Moved component: button_control_114
                        First commit            - Add component: button_control_114(button_control)

                 */
                firstCommitTimestamps:  {},

                // list of commits
                listOfAllCommits:       {}
            }
        },
        template:   `<div style='background-color:white; ' >
        
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
        
        
                        <button  type=button class='btn  btn-info' 
                                 style="box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 8px 0px, rgba(0, 0, 0, 0.19) 0px 6px 20px 0px;margin-bottom: 2px;"
                                 v-if="false"
                                   v-on:click="calculateBranchStrength()" >Expermintal - caclulate branch strength</button>
        
        
                    </div>
        
                      <div id="visualization_history_timeline">
                      </div>
                
        
                      <div  id="visualization_commit_details"
                            style="padding: 10px;">
                            
                        <div v-if="(selectedCommitId != null) && (listOfAllCommits[selectedCommitId])">
                          
                          <div v-if="showCode=='details'">
        
                            <div><b>Number of Changes:</b> {{listOfAllCommits[selectedCommitId].num_changes}}</div>
                            <div v-if="listOfAllCommits[selectedCommitId].changes">
                              <div style="margin-left: 80px;"
                                   v-for="(item,i) in listOfAllCommits[selectedCommitId].changes.slice().reverse()">
                                <span v-if="i==(listOfAllCommits[selectedCommitId].changes.length - 1)"><b>First commit</b> - </span>
                                <span v-if="i!=(listOfAllCommits[selectedCommitId].changes.length - 1)"><b>{{ capitalizeFirstLetter(timeDiffLater(firstCommitTimestamps[selectedCommitId], item.timestamp)) }}</b> - </span>
        
                                {{ item.code_change_text }}
                              </div>
                            </div>
                            <br/>
        
                                <div><b>Tags:</b> {{listOfAllCommits[selectedCommitId].code_tag_list.length}}</div>
                                  <div style="margin-left: 80px;"
                                       v-for="(item,i) in listOfAllCommits[selectedCommitId].code_tag_list">
                                    {{ item.code_tag }}
                                    <span v-if="item.main_score">, Score: {{ item.main_score }}</span>
                                  </div>
        
                              <div v-bind:style="listOfAllCommits[selectedCommitId].id==codeId?'color:red;fpnt-style:bold;':''">
                                  <b>Commit ID:</b> {{listOfAllCommits[selectedCommitId].id}}
                                  <b v-if="listOfAllCommits[selectedCommitId].id==codeId"> (Current commit)</b>
                                  </div>
                              <div><b>Time:</b> {{msToTime(listOfAllCommits[selectedCommitId].timestamp,{timeOnly: true})}} </div>
                              <div><b>User ID:</b> {{listOfAllCommits[selectedCommitId].user_id}}</div>
                              <div><b>Parent:</b> {{listOfAllCommits[selectedCommitId].parent_id}}</div>
                              <div><b>Type:</b> {{listOfAllCommits[selectedCommitId].base_component_id}}</div>
                              <div><b>Descendants:</b>
                                  <span v-if="listOfAllCommits[selectedCommitId].descendants.length==1">
                                    ({{listOfAllCommits[selectedCommitId].descendants.length}})
                                  </span>
                                <span v-if="listOfAllCommits[selectedCommitId].descendants.length>1" style="color:red;">
                                    ({{listOfAllCommits[selectedCommitId].descendants.length}})
                                  </span>
                                   
                                <span v-for='(descendant,index) in listOfAllCommits[selectedCommitId].descendants'>
                                  <a href="#"
                                    v-on:click="jumpToCommitId(descendant.id)" 
                                        >
                                        {{descendant.id.substr(0,5)}}...
                                  </a>  
                                </span>
        
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
        
        
        
        
              </div>`,
        mounted:    async function() {
        },
        methods:    {

            // editor interface
            getText:                            async function () {
                 // -----------------------------------------------------
                 //                      getText
                 //
                 // -----------------------------------------------------
                 if (!isValidObject(this.text)) {
                     return null
                 }

                 return this.text
             },
            setText:                            async function (  textValue  ) {

                /*
                ________________________________________
                |                                      |
                |             setText                  |
                |                                      |
                |______________________________________|
                This is called to set the component state
                __________
                | PARAMS |______________________________________________________________
                |
                |     textValue     Use the component code to find out what changes
                |     ---------     have been made to this code
                |________________________________________________________________________ */
                if (!isValidObject(textValue)) {
                    return
                }

                let mm                  =  this
                this.text               = textValue
                this.baseComponentId    = yz.getValueOfCodeString(this.text, "base_component_id")
                this.codeId   = await this.getCurrentCommitId()

                await this.setupTimeline()
                setTimeout(async function(){
                    await mm.calculateBranchStrength()
                    await mm.getCommitHistoryForThisComponent()
                })
            },

            // setup functions
            setupTimeline:                      async function () {
                // ----------------------------------------------------------------------
                //
                //                            setupTimeline
                //
                // ----------------------------------------------------------------------
                let mm              = this
                let timeNow
                let time2MinsAgo
                let options
                let groups
                let container

                //
                // get the earliest commit
                //
                if (mm.timeline != null ) {
                    mm.timeline.destroy()
                    mm.timeline = null
                }
                mm.timelineData     = new vis.DataSet([])
                mm.currentGroupId   = 1


                setTimeout(async function() {
                    // Configure the Timeline
                    container       = document.getElementById('visualization_history_timeline');
                    timeNow         = new Date().getTime()
                    time2MinsAgo    = new Date().getTime() - (2 * 60 * 1000)
                    groups          = new vis.DataSet()

                    if (isValidObject(window.keepTimeline) && window.keepTimeline) {
                        mm.timelineStart    = window.timelineStart
                        mm.timelineEnd      = window.timelineEnd
                    } else {
                        mm.timelineStart    = time2MinsAgo
                        mm.timelineEnd      = timeNow
                    }
                    window.keepTimeline = false

                    options         = {
                                        zoomable:  true,
                                        start:     mm.timelineStart,
                                        end:       mm.timelineEnd
                                      };

                    for (let rew = 1; rew < 6; rew++) {
                        groups.add({
                            id:         rew,
                            content:    "" + rew,
                            order:      rew
                        });
                    }


                    // Create a Timeline
                    mm.timeline = new vis.Timeline(container, mm.timelineData, options);
                    mm.timeline.setGroups(groups)

                    mm.timeline.on("click", async function (properties) {
                        if (properties.item) {
                            await mm.selectItemDetails(properties.item)
                        } else {
                            mm.selectedCommitId = null
                            await mm.unHighlightAllExceptLockedItem()
                        }
                    });

                    mm.timeline.moveTo(mm.listOfAllCommits[mm.codeId].timestamp)
                    await mm.selectItemDetails(mm.codeId)
                    await mm.highlightItem(mm.codeId)

                    mm.timeline.on('rangechange', function (properties) {
                        mm.timelineStart    = properties.start
                        mm.timelineEnd      = properties.end
                    });
                },100)
            },

            // helper functions
            getCurrentCommitId:                 async function () {
                 // ----------------------------------------------------------------------
                 //
                 //                            getCurrentCommitId
                 //
                 // ----------------------------------------------------------------------
                 //debugger
                 let mm     = this
                 let retVal = null
                 retval     = await getIpfsHash( mm.text )
                 return retval
            },

            // interaction with the timeline UI
            selectItemDetails:                  async function (  commitId  ) {
                let mm              = this
                mm.selectedCommitId = commitId
                mm.showCode='details'

                if (mm.listOfAllCommits[commitId].descendants) {
                    for(let descendant of mm.listOfAllCommits[commitId].descendants) {
                        if (!mm.listOfAllCommits[descendant.id]) {
                             await mm.findFutureCommits(descendant.id)
                         }
                    }
                }
                await mm.highlightItem(commitId)
                await mm.unHighlightAllExceptLockedItem()
            },
            onlyHighlightLockedItem:            async function () {
             //debugger
             let mm = this
             await mm.highlightItem(mm.selectedCommitId)
             await mm.unHighlightAllExceptLockedItem()
         },
            unHighlightAllExceptLockedItem:     async function (  unhighlightLockedItem  ) {
                let mm = this
                if (mm.inUnHighlightAll) {
                    return
                }

                mm.inUnHighlightAll = true
                for (let highlightedItem of Object.keys(mm.highlightedItems)) {
                     if (mm.highlightedItems[highlightedItem]) {
                        if ((unhighlightLockedItem == true) || highlightedItem != mm.selectedCommitId) {
                            let itemStyle = ""
                            let selectedCommitDataItem = mm.listOfAllCommits[highlightedItem]
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
             },
            highlightItem:                      async function (  commitId  ,  options  ) {
             let mm = this
             try {
                 let itemStyle = ""
                 let selectedCommitDataItem = mm.listOfAllCommits[commitId]
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
                 //debugger
             } finally {
             }
         },
            renderCommitsToTimeline:            async function () {
                 // ----------------------------------------------------------------------
                 //
                 //                            render commits to timeline
                 //
                 // ----------------------------------------------------------------------
                 let mm = this
                //debugger

                let listOfCommits = Object.keys(mm.listOfAllCommits)
                let earliestTimestamp = null
                let earliestCommit = null
                for (const commitKey of listOfCommits) {
                    let thisCommit = mm.listOfAllCommits[commitKey]
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
            },
            renderCommit:                       async function (  commitId  ) {
                // ----------------------------------------------------------------------
                //
                //                 renderCommit
                //
                // ----------------------------------------------------------------------
                let mm          = this
                let mainContent
                let extraContent
                let commitItem  = mm.listOfAllCommits[commitId]
                let itemStyle   = ""

                if (!commitItem) {
                    return
                }

                if (commitItem.parent_id) {
                    let parentCommitItem = mm.listOfAllCommits[commitItem.parent_id]
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


                mainContent = commitItem.id.substr(0,5) + (commitItem.num_changes?(" (" + commitItem.num_changes +")"):"")
                extraContent = ""
                if (commitItem.code_tag_list) {
                 for (codeTagItem of commitItem.code_tag_list) {
                     if (codeTagItem.code_tag =="TIP") {
                         extraContent = ", TIP"
                         if (codeTagItem.main_score) {
                             extraContent += "=" + codeTagItem.main_score
                         }
                     }
                 }
                }
                if (commitItem && commitItem.timestamp) {
                    mm.timelineData.add(
                        {
                            id:        commitItem.id,
                            content:   mainContent + extraContent,
                            start:     commitItem.timestamp,
                            group:     mm.currentGroupId,
                            style:     itemStyle
                        });
                }

                if (commitItem.descendants) {
                 for (const descendant of commitItem.descendants) {
                     if (mm.listOfAllCommits[descendant.id]) {
                        await mm.renderCommit(descendant.id)
                     }
                 }
                }
            },
            clearDetailsPane:                   async function () {
                let mm = this

                mm.commitCode = null
                mm.parentCommitCode = null
                mm.diffText = ""
            },
            showCommit:                         async function () {
                let mm = this
                mm.showCode='commit'

                let responseJson = await getFromYazzReturnJson("/http_get_load_code_commit", {commit_id: mm.selectedCommitId})
                mm.commitCode = responseJson.code
            },
            showDetails:                        async function () {
                let mm = this
                mm.showCode='details'
            },
            diffCode:                           async function () {
                //debugger
                let mm = this
                mm.showCode = "diff"

                let commitId = mm.selectedCommitId
                if (!commitId) {
                    return
                }
                let commitItem = mm.listOfAllCommits[commitId]
                if (!commitItem) {
                    return
                }
                let parentid = commitItem.parent_id
                if (!parentid) {
                    return
                }
                let responseJson = await getFromYazzReturnJson("/http_get_load_code_commit", {commit_id: commitId})
                mm.commitCode = responseJson.code
                let responseJson2 = await getFromYazzReturnJson("/http_get_load_code_commit", {commit_id: parentid})
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


            },
            gotoParent:                         async function () {
                // -----------------------------------------------------
                //                      gotoParent
                //
                // Go to the parent of the current history item
                //
                //
                //
                // -----------------------------------------------------

                let mm = this
                if (!mm.selectedCommitId) {
                    return
                }

                let parentId = mm.listOfAllCommits[mm.selectedCommitId].parent_id
                //alert("goto parent : " + parentId)
                mm.timeline.moveTo(mm.listOfAllCommits[parentId].timestamp)
                await mm.selectItemDetails(parentId)
                await mm.highlightItem(parentId)
                await mm.unHighlightAllExceptLockedItem()
            },
            gotoChild:                          async function () {
                // -----------------------------------------------------
                //                      gotoChild
                //
                // Go to the child of the current history item
                //
                //
                //
                // -----------------------------------------------------
                let mm = this
                if (!mm.selectedCommitId) {
                    return
                }

                let descendants = mm.listOfAllCommits[mm.selectedCommitId].descendants
                if (!descendants) {
                    return
                }
                if (descendants.length == 0) {
                    return
                }
                //alert("goto child : " + descendants[0].id)
                let childId = descendants[0].id
                mm.timeline.moveTo(mm.listOfAllCommits[childId].timestamp)
                await mm.selectItemDetails(childId)
                await mm.highlightItem(childId)
                await mm.unHighlightAllExceptLockedItem()
            },
            jumpToCommitId:                     async function (  commitId  ) {
                // -----------------------------------------------------
                //                      jumpToCommitId
                //
                //
                // -----------------------------------------------------
                let mm = this
                mm.timeline.moveTo(mm.listOfAllCommits[commitId].timestamp)
                await mm.selectItemDetails(commitId)
                await mm.highlightItem(commitId)
                await mm.unHighlightAllExceptLockedItem()
            },
            gotoHome:                           async function () {
                // -----------------------------------------------------
                //                      gotoHome
                //
                // Go to the current commid ID item
                //
                //
                //
                // -----------------------------------------------------

                let mm = this

                mm.timeline.moveTo(mm.listOfAllCommits[mm.codeId].timestamp)
                await mm.selectItemDetails(mm.codeId)
                await mm.highlightItem(mm.codeId)
                await mm.unHighlightAllExceptLockedItem()
            },

            // interaction with the Yazz system
            getCommitHistoryForThisComponent:   async function () {
                //                 get the history of this commit going backwards
                //debugger
                let mm          = this
                let openfileurl =
                        "http" +
                        (($HOSTPORT == 443) ? "s" : "") +
                        "://" + $HOST +
                        "/http_get_load_version_history_v2?" +
                         new URLSearchParams({
                             id:        mm.baseComponentId,
                             commit_id: mm.codeId
                         })

                let promise = new Promise(async function (returnfn) {
                    fetch(openfileurl, {
                        method:         'get',
                        credentials:    "include"
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

            },
            findFutureCommits:                  async function (  commitId  ) {
                // ----------------------------------------------------------------------
                //
                //                            findFutureCommits
                //
                // ----------------------------------------------------------------------
                //debugger
                let mm = this

                let openfileurl = "http" + (($HOSTPORT == 443) ? "s" : "") + "://" + $HOST + "/http_get_load_version_future?" +
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

            },
            saveResponseToCommitData:           async function (  responseJson  ) {
                let mm = this
                for (let rt = 0; rt < responseJson.length; rt++) {
                    let itemStyle = ""
                    if (responseJson[rt].descendants && (responseJson[rt].descendants.length > 1)) {
                        itemStyle += "background-color:pink;"
                    }

                    mm.listOfAllCommits[responseJson[rt].id] =
                    {
                        id:                 responseJson[rt].id,
                        timestamp:          responseJson[rt].creation_timestamp,
                        num_changes:        responseJson[rt].num_changes,
                        changes:            responseJson[rt].changes,
                        user_id:            responseJson[rt].user_id,
                        base_component_id:  responseJson[rt].base_component_id,
                        descendants:        responseJson[rt].descendants,
                        parent_id:          responseJson[rt].parent_commit_id,
                        code_tag_list:      responseJson[rt].code_tag_list
                    }
                    if (responseJson[rt].changes && responseJson[rt].changes.length > 0) {
                        if (responseJson[rt].changes[0].timestamp) {
                            mm.firstCommitTimestamps[responseJson[rt].id] = responseJson[rt].changes[0].timestamp
                        }
                    }
                }
            },
            calculateBranchStrength:            async function () {
            //debugger
            let mm = this
            let responseJson = await getFromYazzReturnJson(
                                "/http_get_bulk_calculate_branch_strength_for_component",
                                {
                                    commit_id:          mm.selectedCommitId,
                                    baseComponentId:    mm.baseComponentId
                                    })
            //let result = responseJson
            //alert(JSON.stringify(result))
            },
            checkoutCode:                       async function () {
                let mm              = this
                let responseJson    = await getFromYazzReturnJson(
                    "/http_get_load_code_commit",
                    {
                        commit_id: mm.selectedCommitId
                    }
                )
                mm.text = responseJson.code

                window.timelineStart    = mm.timelineStart
                window.timelineEnd      = mm.timelineEnd
                window.keepTimeline     = true

                mm.$root.$emit(
                    'message'
                    ,
                    {
                        type:            "force_raw_load",
                        commitId:        mm.selectedCommitId
                    }
                )

                let responseJson2 = await getFromYazzReturnJson(
                    "/http_get_point_edit_marker_at_commit"
                    ,
                    {
                        sha1sum:            mm.selectedCommitId,
                        baseComponentId:    mm.baseComponentId
                    }
                )
            }
        }
    })
}
