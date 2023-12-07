function component( args ) {
/*
This is a system editor component that is used to manage the release of the component being edited

base_component_id("environment_editor_component")
component_type("SYSTEM")
load_once_from_file(true)

when was the change in a commit first made (each commit can have many changes)
    eg:
        Number of Changes in commit: 5
            After a few seconds     - Add component: button_control_115(button_control)
            After a few seconds     - Moved component: button_control_114
            After a few seconds     - Moved component: button_control_114
            After under a second    - Moved component: button_control_114
            First commit            - Add component: button_control_114(button_control)
*/

    Yazz.component( {

        data:       function () {
            // ******** DATA ********
            return {
                // common code
                selectedTab:                            "changes",
                refresh:                                0,
                text:                                   args.text,
                baseComponentId:                        null,
                codeId:                                 null,

                // changes pane
                changes_pane_header:                    "",
                changes_pane_description:               "",
                commitMessage:                          "",
                commitErrorMessage:                     "",
                releaseMessage:                         "",
                releaseErrorMessage:                    "",
                commitCode:                             null,
                parentCommitCode:                       null,
                diffText:                               "",
                showCode:                               "details",
                selectedCommitId:                       null,

                // history pane
                timeline:                               null,
                timelineData:                           new vis.DataSet([]),
                currentGroupId:                         1,
                groupColors:                            {
                                                            1: {normal: "background-color: lightblue",  highlighted: "background-color: blue;color:white;"},
                                                            2: {normal: "background-color: pink",       highlighted: "background-color: red;color:white;"},
                                                            3: {normal: "background-color: lightgray",  highlighted: "background-color: gray;color:white;"},
                                                            4: {normal: "background-color: yellow",     highlighted: "background-color: orange;color:white;"},
                                                            5: {normal: "background-color: lightbrown", highlighted: "background-color: brown;color:white;"}
                                                        },
                highlightedItems:                       {},
                inUnHighlightAll:                       false,
                timelineStart:                          null,
                timelineEnd:                            null,
                firstCommitTimestamps:                  {},
                listOfAllCommits:                       {},

                // release pane
                pane_release_in_dev_mode:               true,
                pane_release_env_id:                    null,
                pane_release_env_name:                  "",
                pane_release_env_desc:                  "",
                pane_release_env_list:                  [],
                pane_release_selected_app_position:     null,
                pane_release_selected_env_pos:          null,
                pane_release_info_message:              "",
                pane_release_error_message:             "",
                pane_release_last_env_is_live:          false,
                pane_release_commit_code_id:            null,
                pane_release_environment_id:            null,
                pane_release_next_env_id:               null,
                pane_release_development_code_id:       null,
                pane_release_header:                    "",
                pane_release_description:               "",

                // environments pane
                pane_environments_in_dev_mode:          true,
                pane_environments_editingEnvironment:   false,
                pane_environments_env_id:               null,
                pane_environments_env_name:             "",
                pane_environments_env_desc:             "",
                pane_environments_env_list:             [],
                pane_environments_selected_env_id:      null,
                pane_environments_selected_env_pos:     null,
                pane_environments_info_message:         "",
                pane_environments_error_message:        "",
                pane_environments_last_env_is_live:     false
            }
        },
        template:   `
<div style='background-color:white; ' > 
    <div style='box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);background-color: lightgray; padding: 5px;padding-left: 15px;border: 4px solid lightgray;' >
        <slot style='box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);display: inline-block;' v-if='text' :text2="text">
        </slot>
    </div>
        
        
    <!-- ---------------------------------------------------------------------------------------------
    Show the new style view 
    --------------------------------------------------------------------------------------------- -->
    <div  style='overflow: scroll;height:75%;border-radius: 5px;margin-left:15px;margin-top:15px;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);border: 4px solid lightgray;padding:5px; '>                     
        <div    style='font-size:14px;font-weight:bold;border-radius: 0px;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);background-image: linear-gradient(to right,  #000099, lightblue); color: white; border: 0px solid lightgray; padding:4px; margin:0;padding-left:14px;'>
            Deliver
        </div>




        <!--  MAIN TAB MENU ---------------------------------------------------------
        |    ---------------
        |
        |  Details of the main tab menu
        |
        --------------------------------------------------------------------- -->                    
        <div class="container" style="margin-top: 40px;">
            <ul class="nav nav-pills">

                <li class="nav-item"   style="width: 19%;" v-on:click='switchTab({tabName: "changes"})'>
                  <a v-bind:class='"nav-link" + (selectedTab=="changes"?" active":"")' href="#">Changes</a>
                </li>

                <li class="nav-item"   style="width: 19%;" v-on:click='switchTab({tabName: "history"})'>
                    <a v-bind:class='"nav-link" + (selectedTab=="history"?" active":"")' href="#">History</a>
                </li>
              
                <li class="nav-item"   style="width: 19%;" v-on:click='switchTab({tabName: "release"})'>
                    <a v-bind:class='"nav-link" + (selectedTab=="release"?" active":"")' href="#">Release</a>
                </li>
              
                <li class="nav-item"   style="width: 19%;" v-on:click='switchTab({tabName: "databases"})'>
                    <a v-bind:class='"nav-link" + (selectedTab=="databases"?" active":"")' href="#">Databases</a>
                </li>
              
                <li class="nav-item"   style="width: 19%;" v-on:click='switchTab({tabName: "environments"})'>
                    <a v-bind:class='"nav-link" + (selectedTab=="environments"?" active":"")' href="#">Envs</a>
                </li>
            </ul>
        </div>









      <!--  CHANGES PANE ---------------------------------------------------------
      |    --------------
      |
      |  
      |
      -------------------------------------------------------------------------- -->

      <div  v-if='selectedTab=="changes"' style="padding:15px;">

          <span style="width:30%;display: inline-block;">
                <!-- ----------------------------------------------
                header
                ---------------------------------------------- -->
                <div style="margin-top:5px;">
                  <input
                      style='flex:1;font-family:verdana,helvetica;font-size: 13px;margin-left:10px; width: 100%;'
                      v-on:click=''
                      v-on:keydown="pane_changes_clearMessages()"
                      placeholder="Summary (Required)"
                      v-model='changes_pane_header'
                      value=''>
                  </input>
                </div>
        
                <!-- ----------------------------------------------
                description
                ---------------------------------------------- -->
                <div style="margin-top: 0px;">
                  <textarea rows=7
                            style="margin: 10px; font-family:verdana,helvetica;font-size: 13px;width:100%"
                            placeholder="Description"
                            v-on:keydown="pane_changes_clearMessages()"
                            v-model='changes_pane_description'>
                  </textarea>
                </div>
        
                <!-- ----------------------------------------------
                Commit button
                ---------------------------------------------- -->
                <div style='margin: 10px; margin-top: 0px;'>
                  <button  type=button
                           class=' btn btn-info btn-lg'
                           v-on:click='pane_changes_commitPressed()' >Commit</button>
                </div>
        
                <div style="margin-top: 20px;">{{commitMessage}}</div>
                <div style="color:red">{{commitErrorMessage}}</div>
          </span>
        
        
          <span style="width:65%;display: inline-block;">
          </span>



<pre v-if='$DEBUGUI == "true"'  style="margin-top: 500px;border: solid 1px blue;padding: 5px;">
 -------------------------------------------------------------------- 
|                                                                    |
|                               DEBUG INFO                           |
|                                                                    |
 -------------------------------------------------------------------- 
changes_pane_header:                    {{changes_pane_header}}
changes_pane_description:               {{changes_pane_description}}
commitMessage:                          {{commitMessage}}
commitErrorMessage:                     {{commitErrorMessage}}
releaseMessage:                         {{releaseMessage}}
releaseErrorMessage:                    {{releaseErrorMessage}}
commitCode:                             {{commitCode}}
parentCommitCode:                       {{parentCommitCode}}
diffText:                               {{diffText}}
showCode:                               {{showCode}}
selectedCommitId:                       {{selectedCommitId}}
</pre>        
      </div>
















      <!--  HISTORY PANE ---------------------------------------------------------
      |    -------------
      |
      |  
      |
      -------------------------------------------------------------------------- -->
        
        <div  v-if='selectedTab=="history"'>

            <div style="margin: 10px;"
                 v-on:mouseenter="pane_history_onlyHighlightLockedItem()">
        
            <button  type=button class='btn btn-dark'
                     style="box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 8px 0px, rgba(0, 0, 0, 0.19) 0px 6px 20px 0px;margin-bottom: 2px;margin-right: 20px;"
                     v-on:click="pane_history_gotoHome()" >Home</button>
              
            <button  type=button class='btn  btn-primary'
                     style="box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 8px 0px, rgba(0, 0, 0, 0.19) 0px 6px 20px 0px;margin-bottom: 2px;margin-right: 20px;"
                     v-on:click="pane_history_gotoParent()" >&lt;</button>
        
            <button  type=button class='btn  btn-primary'
                     style="box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 8px 0px, rgba(0, 0, 0, 0.19) 0px 6px 20px 0px;margin-bottom: 2px;margin-right: 20px;"
                     v-on:click="pane_history_gotoChild()" >&gt;</button>
        
            <button  type=button class='btn  btn-primary'
                     style="box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 8px 0px, rgba(0, 0, 0, 0.19) 0px 6px 20px 0px;margin-bottom: 2px;margin-right: 20px;"
                     v-on:click="pane_history_showDetails()" >Details</button>
        
            <button  type=button class='btn  btn-primary'
                     style="box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 8px 0px, rgba(0, 0, 0, 0.19) 0px 6px 20px 0px;margin-bottom: 2px;margin-right: 20px;"
                     v-on:click="pane_history_showCommit()" >Code</button>
        
            <button  type=button class='btn  btn-info'
                     style="box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 8px 0px, rgba(0, 0, 0, 0.19) 0px 6px 20px 0px;margin-bottom: 2px;"
                     v-on:click="pane_history_diffCode()" >Diff</button>
        
            <button  type=button class='btn  btn-info'
                     style="box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 8px 0px, rgba(0, 0, 0, 0.19) 0px 6px 20px 0px;margin-bottom: 2px;"
                     v-on:click="pane_history_checkoutCode()" >Checkout</button>


            <button  type=button class='btn  btn-info' 
                     style="box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 8px 0px, rgba(0, 0, 0, 0.19) 0px 6px 20px 0px;margin-bottom: 2px;"
                     v-if="false"
                     v-on:click="pane_history_calculateBranchStrength()" >Expermintal - caclulate branch strength</button>
        
        
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
                        v-on:click="pane_history_jumpToCommitId(descendant.id)" 
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





<pre v-if='$DEBUGUI == "true"'  style="margin-top: 500px;border: solid 1px blue;padding: 5px;">
-------------------------------------------------------------------- 
|                                                                    |
|                               DEBUG INFO                           |
|                                                                    |
-------------------------------------------------------------------- 
timeline:                               CANNOT SHOW (CIRCULAR REFS)
timelineData:                           {{timelineData}}
currentGroupId:                         {{currentGroupId}}
groupColors:                            {{groupColors}}
highlightedItems:                       {{highlightedItems}}
inUnHighlightAll:                       {{inUnHighlightAll}}
timelineStart:                          {{timelineStart}}
timelineEnd:                            {{timelineEnd}}
firstCommitTimestamps:                  {{firstCommitTimestamps}}
listOfAllCommits:                       {{listOfAllCommits}}
</pre>



        </div>










      <!--  RELEASE PANE ---------------------------------------------------------
      |    --------------
      |
      |  
      |
      -------------------------------------------------------------------------- -->


    <div  v-if='selectedTab=="release"' style="padding:15px;">

        <div>
            {{pane_release_in_dev_mode?"Read only mode: Releases can not be made in dev mode. Commit or release code first":""}}
        </div>
      
      
        <!-- ----------------------------------------------
        Current state of code
        ---------------------------------------------- -->
        <span style="width:20%;display: inline-block;vertical-align: top;padding: 5px;background-color: #ffff00;height:170px;"  v-bind:refresh='refresh' >
            <div style="margin-bottom: 15px;font-size:18px"><b>Current position</b></div>
            <div style="">
                <div  v-bind:style='"width: 100%;height:26px;padding:3px;" + (pane_release_development_code_id?"background-color: lightgray;":"background-color: white;")'>
                  &lt;&lt; Development &gt;&gt; 
                </div>
                
                <div  v-bind:style='"width: 100%;height:26px;padding:3px;" + (pane_release_commit_code_id?"background-color: lightgray;":"background-color: white;")'
                      v-on:click="pane_release_envSelected()">
                  &lt;&lt; Commit &gt;&gt; 
                </div>
                
                <div v-for="this_env2 in pane_release_env_list">
                    <div  v-bind:style='"scroll;width: 100%;height:26px;padding:3px;" + (pane_release_environment_id == this_env2.id?"background-color: lightgray;":"background-color: white;")'>
                      {{this_env2.name}}
                    </div>
                </div>
            </div>
        </span>
           
        <div style='margin: 10px; margin-top: 30px;'  
             v-if="(!pane_release_in_dev_mode) && pane_release_next_env_id">
            <!-- ----------------------------------------------
            header
            ---------------------------------------------- -->
            <div style="margin-top:5px;">
                <input
                    style='flex:1;font-family:verdana,helvetica;font-size: 13px;margin-left:10px; width: 40%;'
                    v-on:click=''
                    v-on:keydown="pane_release_clearMessages()"
                    placeholder="Summary (Required)"
                    v-model='pane_release_header'
                    value=''>
                </input>
            </div>

            <!-- ----------------------------------------------
            description
            ---------------------------------------------- -->
            <div style="margin-top: 0px;">
                <textarea rows=7
                          style="margin: 10px; font-family:verdana,helvetica;font-size: 13px;width:40%"
                          placeholder="Description"
                          v-on:keydown="pane_release_clearMessages()"
                          v-model='pane_release_description'>
                </textarea>
            </div>
          
            <!-- ----------------------------------------------
            Promote button
            ---------------------------------------------- -->
            <div style='margin: 10px; margin-top: 0px;'>
                <button     type=button
                            class=' btn btn-info btn-lg'
                            v-on:click='pane_release_promotePressed()' >Promote to "{{pane_release_next_env_id}}"</button>
            </div>
            
                
                
            <!-- ----------------------------------------------
            Old release button
            ---------------------------------------------- -->
            <div style='margin-top: 20px;padding-bottom: 40vh;'>
              <button  type=button
                       class=' btn btn-info btn-lg'
                       v-on:click='pane_release_oldVersionReleaseCodePressed()' >Old release</button>
            </div>
            <div style="color:black">{{pane_release_info_message}}</div>
            <div style="color:red">{{pane_release_error_message}}</div>
        </div>




<pre v-if='$DEBUGUI == "true"'  style="margin-top: 500px;border: solid 1px blue;padding: 5px;">
 -------------------------------------------------------------------- 
|                                                                    |
|                               DEBUG INFO                           |
|                                                                    |
 -------------------------------------------------------------------- 
pane_release_in_dev_mode:               {{pane_release_in_dev_mode}}
pane_release_env_id:                    {{pane_release_env_id}}
pane_release_env_name:                  {{pane_release_env_name}}
pane_release_env_desc:                  {{pane_release_env_desc}}
pane_release_env_list:                  {{pane_release_env_list}}
pane_release_selected_app_position:     {{pane_release_selected_app_position}}
pane_release_selected_env_pos:          {{pane_release_selected_env_pos}}
pane_release_info_message:              {{pane_release_info_message}}
pane_release_error_message:             {{pane_release_error_message}}
pane_release_last_env_is_live:          {{pane_release_last_env_is_live}}
pane_release_commit_code_id:            {{pane_release_commit_code_id}}
pane_release_environment_id:            {{pane_release_environment_id}}
pane_release_next_env_id:               {{pane_release_next_env_id}}
pane_release_development_code_id:       {{pane_release_development_code_id}}
pane_release_header:                    {{pane_release_header}}
pane_release_description:               {{pane_release_description}}
</pre>
    </div>

      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      

      <!--  DATABASES PANE ---------------------------------------------------------
      |    ----------------
      |
      |  
      |
      -------------------------------------------------------------------------- -->

      <div  v-if='selectedTab=="databases"' style="padding:15px;font-family:verdana,helvetica;font-size: 13px;">
        DATABASES








        <pre v-if='$DEBUGUI == "true"'  style="margin-top: 500px;border: solid 1px blue;padding: 5px;">
 -------------------------------------------------------------------- 
|                                                                    |
|                               DEBUG INFO                           |
|                                                                    |
 -------------------------------------------------------------------- 
</pre>

      </div>

      
      
      
      
      
      
      
      
      
      
      
      
      
      
    <!--  ENVIRONMENTS PANE ---------------------------------------------------------
    |    --------------------
    |
    |  
    |
    -------------------------------------------------------------------------- -->
      
    <div  v-if='selectedTab=="environments"' style="padding:15px;font-family:verdana,helvetica;font-size: 13px;">

      
      
        <div   style="padding:15px;"  v-bind:refresh='refresh'>

            <div>  
                {{!pane_environments_in_dev_mode?"Read only mode: Environments can not be edited in releases":""}}
            </div>
          
          
          <!-- ----------------------------------------------
                List of Environments
                ---------------------------------------------- -->
            <span style="width:20%;display: inline-block;vertical-align: top;padding: 5px;background-color: #ffff00;height:170px;"  v-bind:refresh='refresh' >
                <div style="margin-bottom: 15px;font-size:18px"><b>Environments</b></div>
                <div style=";display: block;">
                    <div v-for="this_env2 in pane_environments_env_list">
                        <div  v-bind:style='"width: 250px;height:26px;padding:3px;" + (pane_environments_selected_env_id == this_env2.id?"background-color: lightgray;":"background-color: white;")'
                              v-on:click="pane_environments_selected_env_id = this_env2.id; pane_environment_envSelected()">
                          {{this_env2.name}}
                        </div>
                    </div>
                </div>
            </span>


          <!-- ----------------------------------------------
          Environment Buttons
          ---------------------------------------------- -->
          <span   style="width:15%;display: inline-block;vertical-align: top;padding: 5px;background-color: #ffff00;height:170px;"  
                  v-bind:refresh='refresh'>

            <div><button   type=button
                           class=' btn-sm btn-info'
                           style="width:110px;"
                           v-bind:disabled="pane_environments_editingEnvironment || (!pane_environments_in_dev_mode)"
                           v-on:click='pane_environment_addPressed()' >Add</button></div>
            <div><button   type=button
                           class=' btn-sm btn-info'
                           style="width:110px;"
                           v-bind:disabled="(pane_environments_selected_env_id==null) || pane_environments_editingEnvironment || (!pane_environments_in_dev_mode)"
                           v-on:click='pane_environment_editPressed()' >Edit</button></div>

            <div><button   type=button
                           class=' btn-sm btn-info'
                           style="width:110px;"
                           v-bind:disabled="(pane_environments_selected_env_id==null) || (pane_environments_selected_env_pos == 0) || (!pane_environments_in_dev_mode)"
                           v-on:click='pane_environment_moveUpPressed()' >&uarr;</button></div>

            <div><button   type=button
                           class=' btn-sm btn-info'
                           style="width:110px;"
                           v-bind:disabled="(pane_environments_selected_env_id==null) || (pane_environments_selected_env_pos == (pane_environments_env_list.length - 1)) || (!pane_environments_in_dev_mode)"
                           v-on:click='pane_environment_moveDownPressed()' >&darr;</button></div>

            <div><button   type=button
                           class=' btn-sm btn-info'
                           style="width:110px;"
                           v-bind:disabled="pane_environments_selected_env_id==null || (!pane_environments_in_dev_mode)"
                           v-on:click='pane_environment_deletePressed()' >Delete</button></div>
          </span>

          
          
          
          <!-- ----------------------------------------------
                Details Pane
                ---------------------------------------------- -->
            <span style="width:59%;display: inline-block;vertical-align: top;background-color: lightblue;padding: 5px;height:170px">
                <div style="margin-bottom: 15px;font-size:18px;"><b>Environment Details</b></div> 
                <div v-if="pane_environments_selected_env_id">
                    <div><b>Env ID:</b>        {{pane_environments_selected_env_id}}</div>
                    <div><b>Name:</b>          {{pane_environments_env_list[pane_environments_selected_env_pos].name}}</div>
                    <div><b>Description:</b>   {{pane_environments_env_list[pane_environments_selected_env_pos].description}}</div>
                    <div><b>Live?</b>          {{(pane_environments_selected_env_pos == (pane_environments_env_list.length - 1)) && pane_environments_last_env_is_live?"TRUE (LIVE)":"FALSE"}}</div>
                </div>

            </span>
        </div>








          <!--  ENVIRONMENTS PANE ---------------------------------------------------------
          |    -------  EDIT ENVIRONMENT 
          |            ------------------
          |
          |  Editor for adding or editing an environment
          |
          --------------------------------------------------------------------- -->
        <div style="height: 300px;">
            <div v-if="pane_environments_editingEnvironment && pane_environments_in_dev_mode">

                <!-- ----------------------------------------------
                Environment ID
                ---------------------------------------------- -->
                <div style="margin-top:0px;font-family:verdana,helvetica;font-size: 13px;">
                    <span style="width:20%;display: inline-block;">
                        Environment ID
                    </span>
                    <input  style='flex:1;font-family:verdana,helvetica;font-size: 13px;margin-left:10px; width:20%;display: inline-block;'
                            v-on:click=''
                            v-on:keydown="pane_changes_clearMessages()"
                            placeholder="environment_id_with_underscores (Required)"
                            v-model='pane_environments_env_id'
                            value=''>
                    </input>
                </div>
              
              
                <!-- ----------------------------------------------
                Environment name
                ---------------------------------------------- -->
                <div style="margin-top:10px;">
                    <span style="width:20%;display: inline-block;">
                        Environment name
                    </span>
                    <input style='flex:1;font-family:verdana,helvetica;font-size: 13px;margin-left:10px; width:20%;display: inline-block;'
                           v-on:click=''
                           v-on:keydown="pane_changes_clearMessages()"
                           placeholder="Environment name (Required)"
                           v-model='pane_environments_env_name'
                           value=''>
                    </input>
                </div>
        
                <!-- ----------------------------------------------
                description
                ---------------------------------------------- -->
                <div style="margin-top: 5px;">
                    <span style="width:20%;display: inline-block;">
                        Environment description
                    </span>
                    <textarea rows=6
                            style="margin: 10px; font-family:verdana,helvetica;font-size: 13px;width:20%;display: inline-block;vertical-align:top"
                            placeholder="Description"
                            v-on:keydown="pane_changes_clearMessages()"
                            v-model='pane_environments_env_desc'>
                    </textarea>
                </div>

                <div v-if="pane_environments_selected_env_pos == (pane_environments_env_list.length - 1)">
                    <span style="width:20%;display: inline-block;">
                        Live environment?
                    </span>
                    <input   style="margin-left: 10px;"
                             type="checkbox"
                             id="id_use_last_env_as_live"
                             v-model="pane_environments_last_env_is_live"ß>
                </div>


              <!-- ----------------------------------------------
              Save changes and cancel buttons
              ---------------------------------------------- -->
                <div style="width:45%;height: 40px;margin-top: 10px;">
                    <button  type=button
                             class='btn-sm btn-info'
                             style="float:right; "
                             v-on:click='pane_environment_savePressed()' >Save changes</button>
                  
                  <button  type=button
                           class='btn-sm btn-info'
                           style="float:right; margin-right: 20px;"
                           v-on:click='pane_environment_cancelPressed()' >Cancel changes</button>

                </div>
            </div>
        </div>

        <!-- --------------------------- INFO AND ERRORS ------------------------------
        |                            ---------------------
        |
        |  Information and error messages for an environment
        |
        --------------------------------------------------------------------- -->
        <div style="border: 1px solid black; width: 100%; height: 50px; ">
            <div style="color: black">{{pane_environments_info_message}}</div>
            <div style="color: red">{{pane_environments_error_message}}</div>
        </div>




      <!--  ENVIRONMENTS PANE ---------------------------------------------------------
      |    -------  DEBUG VIEW 
      |            ------------------
      |
      --------------------------------------------------------------------- -->

      <pre v-if='$DEBUGUI == "true"'  style="margin-top: 500px;border: solid 1px blue;padding: 5px;">
 -------------------------------------------------------------------- 
|                                                                    |
|                               DEBUG INFO                           |
|                                                                    |
 -------------------------------------------------------------------- 
pane_environments_in_dev_mode:          {{pane_environments_in_dev_mode}}
pane_environments_editingEnvironment:   {{pane_environments_editingEnvironment}}
pane_environments_env_id:               {{pane_environments_env_id}}
pane_environments_env_name:             {{pane_environments_env_name}}
pane_environments_env_desc:             {{pane_environments_env_list}}
pane_environments_env_list:             {{pane_environments_env_list}}
pane_environments_selected_env_id:      {{pane_environments_selected_env_id}}
pane_environments_selected_env_pos:     {{pane_environments_selected_env_pos}}
pane_environments_info_message:         {{pane_environments_info_message}}
pane_environments_error_message:        {{pane_environments_error_message}}
pane_environments_last_env_is_live:     {{pane_environments_last_env_is_live}}
      </pre>


    </div>












<!-- --------------------------- END OF PANES ------------------------------
|                               ---------------
|
|  
|
-------------------------------------------------------------------------- -->
    </div>
</div>`,
        mounted:    async function() {
        },
        methods:    {
            // editor interface
            switchTab:                                      async function (  {  tabName  }  ) {
                let mm = this
                mm.selectedTab = tabName

                // ------------------------------------------------
                //    init history pane
                // ------------------------------------------------
                if (tabName == "history") {
                    await mm.pane_history_setupTimeline()
                    setTimeout(async function(){
                        await mm.pane_history_calculateBranchStrength()
                        await mm.pane_history_getCommitHistoryForThisComponent()
                    })
                }



                // ------------------------------------------------
                //    init release pane
                // ------------------------------------------------
                if (tabName == "release") {
                    let release =  yz.helpers.getValueOfCodeString(this.text, "release")
                    let commit  =  yz.helpers.getValueOfCodeString(this.text, "commit")
                    let envs    =  yz.helpers.getValueOfCodeString(this.text, "environments")

                    if (commit) {
                        mm.pane_release_in_dev_mode         = false
                        mm.pane_release_development_code_id = null
                        mm.pane_release_environment_id      = null
                        mm.pane_release_commit_code_id      = mm.codeId
                        mm.pane_release_next_env_id         = envs.list_of_environments[0].name
                    } else  if (release) {
                        mm.pane_release_in_dev_mode         = false
                        mm.pane_release_environment_id      = release.env_id
                        mm.pane_release_development_code_id = null
                        mm.pane_release_commit_code_id      = null
                        let currentEnvPos = -1
                        mm.pane_release_next_env_id         = null
                        for (let pp = 0 ; pp <  envs.list_of_environments.length; pp ++) {
                            if (release.env_id == envs.list_of_environments[pp].id) {
                                currentEnvPos = pp
                            }
                        }
                        if (currentEnvPos != -1) {
                            if ((currentEnvPos + 1) < envs.list_of_environments.length) {
                                mm.pane_release_next_env_id         = envs.list_of_environments[currentEnvPos + 1].id
                            }
                        }
                    } else {
                        mm.pane_release_in_dev_mode         = true
                        mm.pane_release_development_code_id = mm.codeId
                        mm.pane_release_environment_id      = null
                        mm.pane_release_commit_code_id      = null
                        mm.pane_release_next_env_id         = null
                    }

                    let environments =  yz.helpers.getValueOfCodeString(this.text, "environments")
                    if (environments) {
                        mm.pane_release_env_list = environments.list_of_environments
                        if (environments.last_env_is_live) {
                            mm.pane_release_last_env_is_live = environments.last_env_is_live
                        }
                    }

                }


                // ------------------------------------------------
                //    init environments pane
                // ------------------------------------------------
                if (tabName == "environments") {
                    let release =  yz.helpers.getValueOfCodeString(this.text, "release")
                    if (release) {
                        mm.pane_environments_in_dev_mode = false
                    } else {
                        mm.pane_environments_in_dev_mode = true
                    }

                    let environments =  yz.helpers.getValueOfCodeString(this.text, "environments")
                    if (environments) {
                        mm.pane_environments_env_list = environments.list_of_environments
                        if (environments.last_env_is_live) {
                            mm.pane_environments_last_env_is_live = environments.last_env_is_live
                        }
                    }

                }
            },
            getText:                                        async function (  ) {
                 // -----------------------------------------------------
                 //                      getText
                 //
                 // -----------------------------------------------------
                 if (!isValidObject(this.text)) {
                     return null
                 }

                 return this.text
             },
            setText:                                        async function (  textValue  ) {

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
                this.baseComponentId    = yz.helpers.getValueOfCodeString(this.text, "base_component_id")
                this.codeId             = await this.getCurrentCommitId()

                await mm.switchTab( {tabName: mm.selectedTab} )
            },


            // helper functions
            getCurrentCommitId:                             async function (  ) {
                // ----------------------------------------------------------------------
                //
                //                            getCurrentCommitId
                //
                // ----------------------------------------------------------------------
                let mm     = this
                let retVal = null
                retval     = await getIpfsHash( mm.text )
                return retval
            },


            // changes pane
            pane_changes_commitPressed:                     async function (  ) {
                let mm = this

                if ((mm.changes_pane_header == null) || (mm.changes_pane_header.length <= 5)) {
                    mm.commitErrorMessage = "Commit header must be more than 5 chars"
                    return
                }
                if (mm.changes_pane_description == null) {
                    mm.changes_pane_description = ""
                }

                showProgressBar()

                let postAppUrl = "http" + (($HOSTPORT == 443)?"s":"") + "://" + $HOST + "/http_post_commit_code"
                callAjaxPost(postAppUrl,
                    {
                        code_id:                mm.codeId,
                        user_id:                "xyz",
                        header:                 mm.changes_pane_header,
                        description:            mm.changes_pane_description
                    }
                    ,
                    async function(response){
                        let responseJson = JSON.parse(response)

                        hideProgressBar()
                        if (responseJson && responseJson.newCommitId) {
                            mm.$root.$emit(
                                'message'
                                ,
                                {
                                    type:            "force_raw_load",
                                    commitId:         responseJson.newCommitId
                                }
                            )
                        }
                        await mm.pane_changes_clearAll()
                        mm.commitMessage = "Commit successful"
                    })
            },
            pane_changes_clearAll:                          async function (  ) {
                let mm = this

                mm.commitMessage                = ""
                mm.commitErrorMessage           = ""
                mm.changes_pane_header          = ""
                mm.changes_pane_description     = ""
            },
            pane_changes_clearMessages:                     async function (  ) {
                let mm = this

                mm.commitMessage            = ""
                mm.commitErrorMessage       = ""
            },



            // history pane
            pane_history_setupTimeline:                     async function (  ) {
                // ----------------------------------------------------------------------
                //
                //                            pane_history_setupTimeline
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
                            await mm.pane_history_selectItemDetails(properties.item)
                        } else {
                            mm.selectedCommitId = null
                            await mm.pane_history_unHighlightAllExceptLockedItem()
                        }
                    });

                    if (isValidObject(window.keepTimeline) && window.keepTimeline) {
                    } else if (mm.listOfAllCommits[mm.codeId].timestamp) {
                        mm.timeline.moveTo(mm.listOfAllCommits[mm.codeId].timestamp)
                    } else {

                    }
                    window.keepTimeline = false

                    await mm.pane_history_selectItemDetails(mm.codeId)
                    await mm.pane_history_highlightItem(mm.codeId)

                    mm.timeline.on('rangechanged', function (properties) {
                        mm.timelineStart    = properties.start.getTime()
                        mm.timelineEnd      = properties.end.getTime()
                    });
                },100)
            },
            pane_history_selectItemDetails:                 async function (  commitId  ) {
                let mm              = this
                mm.selectedCommitId = commitId
                mm.showCode='details'

                if (mm.listOfAllCommits[commitId].descendants) {
                    for(let descendant of mm.listOfAllCommits[commitId].descendants) {
                        if (!mm.listOfAllCommits[descendant.id]) {
                            await mm.pane_history_findFutureCommits(descendant.id)
                        }
                    }
                }
                await mm.pane_history_highlightItem(commitId)
                await mm.pane_history_unHighlightAllExceptLockedItem()
            },
            pane_history_onlyHighlightLockedItem:           async function (  ) {
                let mm = this
                await mm.pane_history_highlightItem(mm.selectedCommitId)
                await mm.pane_history_unHighlightAllExceptLockedItem()
            },
            pane_history_unHighlightAllExceptLockedItem:    async function (  unhighlightLockedItem  ) {
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
            pane_history_highlightItem:                     async function (  commitId  ,  options  ) {
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
                } finally {
                }
            },
            pane_history_renderCommitsToTimeline:           async function (  ) {
                // ----------------------------------------------------------------------
                //
                //                            render commits to timeline
                //
                // ----------------------------------------------------------------------
                let mm = this

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
                await mm.pane_history_renderCommit(earliestCommit)
            },
            pane_history_renderCommit:                      async function (  commitId  ) {
                // ----------------------------------------------------------------------
                //
                //                 pane_history_renderCommit
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
                            await mm.pane_history_renderCommit(descendant.id)
                        }
                    }
                }
            },
            pane_history_clearDetailsPane:                  async function (  ) {
                let mm = this

                mm.commitCode = null
                mm.parentCommitCode = null
                mm.diffText = ""
            },
            pane_history_showCommit:                        async function (  ) {
                let mm = this
                mm.showCode='commit'

                let responseJson = await getFromYazzReturnJson("/http_get_load_code_commit", {commit_id: mm.selectedCommitId})
                mm.commitCode = responseJson.code
            },
            pane_history_showDetails:                       async function (  ) {
                let mm = this
                mm.showCode='details'
            },
            pane_history_diffCode:                          async function (  ) {
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
            pane_history_gotoParent:                        async function (  ) {
                // -----------------------------------------------------
                //                      pane_history_gotoParent
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
                await mm.pane_history_selectItemDetails(parentId)
                await mm.pane_history_highlightItem(parentId)
                await mm.pane_history_unHighlightAllExceptLockedItem()
            },
            pane_history_gotoChild:                         async function (  ) {
                // -----------------------------------------------------
                //                      pane_history_gotoChild
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
                await mm.pane_history_selectItemDetails(childId)
                await mm.pane_history_highlightItem(childId)
                await mm.pane_history_unHighlightAllExceptLockedItem()
            },
            pane_history_jumpToCommitId:                    async function (  commitId  ) {
                // -----------------------------------------------------
                //                      pane_history_jumpToCommitId
                //
                //
                // -----------------------------------------------------
                let mm = this
                mm.timeline.moveTo(mm.listOfAllCommits[commitId].timestamp)
                await mm.pane_history_selectItemDetails(commitId)
                await mm.pane_history_highlightItem(commitId)
                await mm.pane_history_unHighlightAllExceptLockedItem()
            },
            pane_history_gotoHome:                          async function (  ) {
                // -----------------------------------------------------
                //                      pane_history_gotoHome
                //
                // Go to the current commit ID ID item
                //
                //
                //
                // -----------------------------------------------------

                let mm = this
                if (mm.listOfAllCommits[mm.codeId].timestamp) {
                    mm.timeline.moveTo(mm.listOfAllCommits[mm.codeId].timestamp)
                    await mm.pane_history_selectItemDetails(mm.codeId)
                    await mm.pane_history_highlightItem(mm.codeId)
                    await mm.pane_history_unHighlightAllExceptLockedItem()
                }
            },
            pane_history_getCommitHistoryForThisComponent:  async function (  ) {
                //                 get the history of this commit going backwards
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
                            await mm.pane_history_saveResponseToCommitData(responseJson)
                            await mm.pane_history_renderCommitsToTimeline()
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
            pane_history_findFutureCommits:                 async function (  commitId  ) {
                // ----------------------------------------------------------------------
                //
                //                            pane_history_findFutureCommits
                //
                // ----------------------------------------------------------------------
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
                            if (responseJson.length > 0) {
                                let earliestCommit = responseJson[0].id
                                await mm.pane_history_saveResponseToCommitData(responseJson)
                                setTimeout(async function(){
                                    mm.currentGroupId ++
                                    await mm.pane_history_renderCommit(earliestCommit)
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
            pane_history_saveResponseToCommitData:          async function (  responseJson  ) {
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
            pane_history_calculateBranchStrength:           async function (  ) {
                let mm = this
                let responseJson = await getFromYazzReturnJson(
                    "/http_get_bulk_calculate_branch_strength_for_component",
                    {
                        commit_id:          mm.selectedCommitId,
                        baseComponentId:    mm.baseComponentId
                    })
            },
            pane_history_checkoutCode:                      async function (  ) {
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
            },


            // release pane
            pane_release_promotePressed:                     async function (  ) {
                //----------------------------------------------------------------------------------/
                //
                //                    /-------------------------------------/
                //                   /     pane_release_promotePressed     /
                //                  /-------------------------------------/
                //
                //----------------------------------------------------------------------------/
                // This is used to promote an app/component to an environment
                //--------------------------------------------------------------------------/
                let mm = this

                showProgressBar()

                let postAppUrl = "http" + (($HOSTPORT == 443)?"s":"") + "://" + $HOST + "/http_post_promote_to_environment"
                callAjaxPost(postAppUrl,
                    {
                        code_id:                mm.codeId,
                        user_id:                "xyz",
                        header:                 mm.pane_release_header,
                        description:            mm.pane_release_description
                    }
                    ,
                    async function(response){
                        let responseJson = JSON.parse(response)

                        hideProgressBar()
                        if (responseJson && responseJson.newCommitId) {
                            mm.$root.$emit(
                                'message'
                                ,
                                {
                                    type:            "force_raw_load",
                                    commitId:         responseJson.newCommitId
                                }
                            )
                        }
                        await mm.pane_release_clearAll()
                        mm.pane_release_info_message = "Release successful"
                    })
            },
            pane_release_clearAll:                                    async function (  ) {

            },
            pane_release_clearMessages:                               async function (  ) {

            },
            pane_release_oldVersionReleaseCodePressed:                async function (  ) {
                //----------------------------------------------------------------------------------
                //
                //                    /-----------------------------------------------/
                //                   /  pane_release_oldVersionReleaseCodePressed    /
                //                  /-----------------------------------------------/
                //
                //----------------------------------------------------------------------------
                // This tries to release the current commit as the release version
                // of the app
                //--------------------------------------------------------------------
                try {
                    let mm = this
                    showProgressBar()

                    let postAppUrl = "http" + (($HOSTPORT == 443)?"s":"") + "://" + $HOST + "/http_post_release_commit"
                    callAjaxPost(postAppUrl,
                        {
                            code_id:                  mm.codeId
                            ,
                            user_id:                 "xyz"
                        }
                        ,
                        async function(response){
                            let responseJson = JSON.parse(response)

                            mm.releaseMessage = "Release successful"
                            hideProgressBar()
                        })

                } catch (e) {
                    hideProgressBar()
                    mm.releaseErrorMessage = "Error in release: " + JSON.stringify(e,null,2)
                    //this.checkSavedFile()
                }
            },


            // environments pane
            pane_environment_addPressed:                    async function (  ) {
                //----------------------------------------------------------------------------------
                //
                //                    /-------------------------------------/
                //                   /      pane_environment_addPressed    /
                //                  /-------------------------------------/
                //
                //----------------------------------------------------------------------------
                // This adds a new environment
                //--------------------------------------------------------------------
                try {
                    let mm = this

                    mm.pane_environments_env_list.unshift(
                        {
                            id:		        "NEW_ENV",
                            name:		    "",
                            description:    "",
                            url_path:       "",
                            backup_db:      true,
                            backup_db_path: "",
                            url_path:       ""
                        }
                    )

                    mm.pane_environments_selected_env_id    = "NEW_ENV"
                    mm.pane_environments_selected_env_pos   = 0
                    mm.pane_environments_env_id             = "NEW_ENV"
                    mm.pane_environments_env_name           = ""
                    mm.pane_environments_env_desc           = ""
                    mm.pane_environments_editingEnvironment                   = true
                    await pane_environment_envSelected()

                    mm.refresh ++
                } catch (e) {
                    
                }
            },
            pane_environment_editPressed:                   async function (  ) {
                //----------------------------------------------------------------------------------
                //
                //                    /-------------------------------------/
                //                   /      pane_environment_editPressed   /
                //                  /-------------------------------------/
                //
                //----------------------------------------------------------------------------
                // This allows an environment item to be changed
                //--------------------------------------------------------------------
                try {
                    let mm = this
                    mm.pane_environments_info_message = ""
                    mm.pane_environments_error_message = ""

                    if ( mm.pane_environments_env_id == null ) {
                        mm.pane_environments_error_message = "You must select an environment first"
                    } else {
                        mm.pane_environments_editingEnvironment = true
                    }

                    mm.refresh++

                } catch (e) {

                }
            },
            pane_environment_savePressed:                   async function (  ) {
                //----------------------------------------------------------------------------------
                //
                //                    /-------------------------------------/
                //                   /      pane_environment_savePressed   /
                //                  /-------------------------------------/
                //
                //----------------------------------------------------------------------------
                // This saves changes to an environment
                //--------------------------------------------------------------------
                try {
                    let mm = this
                    mm.pane_environments_info_message   = ""
                    mm.pane_environments_error_message  = ""

                    if ((mm.pane_environments_env_id != null) && (mm.pane_environments_env_id == "NEW_ENV")) {
                        mm.pane_environments_error_message = "Environment must be changed to a unique name"
                    } else if ((mm.pane_environments_env_name == null) || (mm.pane_environments_env_name.length < 3))
                    {
                        mm.pane_environments_error_message = "Environment name must be at least 3 characters"
                    } else {
                        mm.pane_environments_env_list[mm.pane_environments_selected_env_pos].id            = mm.pane_environments_env_id
                        mm.pane_environments_env_list[mm.pane_environments_selected_env_pos].name          = mm.pane_environments_env_name
                        mm.pane_environments_env_list[mm.pane_environments_selected_env_pos].description   = mm.pane_environments_env_desc

                        mm.pane_environments_info_message = "Changes saved"
                        mm.pane_environments_editingEnvironment             = false

                        mm.pane_environments_selected_env_id = mm.pane_environments_env_id
                        await mm.pane_environment_envSelected()
                        mm.refresh ++
                        await mm.pane_environment_saveCode()
                    }

                } catch (e) {

                }
            },
            pane_environment_cancelPressed:                 async function (  ) {
                //----------------------------------------------------------------------------------
                //
                //                    /-------------------------------------/
                //                   /    pane_environment_cancelPressed   /
                //                  /-------------------------------------/
                //
                //----------------------------------------------------------------------------
                // This cancels any further changes to an environment
                //--------------------------------------------------------------------
                try {
                    let mm = this
                    mm.pane_environments_info_message   = ""
                    mm.pane_environments_error_message  = ""

                    mm.pane_environments_editingEnvironment             = false
                    mm.refresh ++

                } catch (e) {

                }
            },
            pane_environment_envSelected:                   async function ( ) {
                //----------------------------------------------------------------------------------
                //
                //                    /-------------------------------------/
                //                   /      pane_environment_envSelected   /
                //                  /-------------------------------------/
                //
                //----------------------------------------------------------------------------
                // This changes environment being viewed
                //--------------------------------------------------------------------
                try {
                    let mm = this


                    for (let envIndex = 0 ; envIndex < mm.pane_environments_env_list.length; envIndex ++ ) {
                        if (mm.pane_environments_env_list[envIndex].id == mm.pane_environments_selected_env_id) {
                            mm.pane_environments_selected_env_pos = envIndex
                        }
                    }

                    mm.pane_environments_env_id     = mm.pane_environments_env_list[mm.pane_environments_selected_env_pos].id
                    mm.pane_environments_env_name   = mm.pane_environments_env_list[mm.pane_environments_selected_env_pos].name
                    mm.pane_environments_env_desc   = mm.pane_environments_env_list[mm.pane_environments_selected_env_pos].description

                } catch (e) {
                    console.log(e)
                }
            },
            pane_environment_moveUpPressed:                 async function ( ) {
                //----------------------------------------------------------------------------------
                //
                //                    /-------------------------------------/
                //                   /    pane_environment_moveUpPressed   /
                //                  /-------------------------------------/
                //
                //----------------------------------------------------------------------------
                // This moves the selected environment up one in the list
                //--------------------------------------------------------------------
                try {
                    let mm = this


                    for (let envIndex = 0 ; envIndex < mm.pane_environments_env_list.length; envIndex ++ ) {
                        if (mm.pane_environments_env_list[envIndex].id == mm.pane_environments_selected_env_id) {
                            mm.pane_environments_selected_env_pos = envIndex
                        }
                    }

                    if (mm.pane_environments_selected_env_pos == 0) {
                        return
                    }

                    // if this is the live env then switch off the live env
                    if (mm.pane_environments_selected_env_pos == (mm.pane_environments_env_list.length - 1)) {
                        mm.pane_environments_last_env_is_live = false
                    }

                    let envToMove = mm.pane_environments_env_list[  mm.pane_environments_selected_env_pos  ]
                    mm.pane_environments_env_list.splice(mm.pane_environments_selected_env_pos, 1)
                    mm.pane_environments_env_list.splice(mm.pane_environments_selected_env_pos - 1, 0, envToMove)

                    mm.pane_environments_selected_env_pos --
                    await mm.pane_environment_envSelected()
                    await mm.pane_environment_saveCode()

                } catch (e) {
                    console.log(e)
                }
            },
            pane_environment_moveDownPressed:               async function ( ) {
                //----------------------------------------------------------------------------------
                //
                //                    /-------------------------------------/
                //                   /  pane_environment_moveDownPressed   /
                //                  /-------------------------------------/
                //
                //----------------------------------------------------------------------------
                // This moves the selected environment down one in the list
                //--------------------------------------------------------------------
                try {
                    let mm = this


                    for (let envIndex = 0 ; envIndex < mm.pane_environments_env_list.length; envIndex ++ ) {
                        if (mm.pane_environments_env_list[envIndex].id == mm.pane_environments_selected_env_id) {
                            mm.pane_environments_selected_env_pos = envIndex
                        }
                    }

                    if (mm.pane_environments_selected_env_pos == (mm.pane_environments_env_list.length - 1)) {
                        return
                    }

                    let envToMove = mm.pane_environments_env_list[  mm.pane_environments_selected_env_pos  ]
                    mm.pane_environments_env_list.splice(mm.pane_environments_selected_env_pos, 1)
                    mm.pane_environments_env_list.splice(mm.pane_environments_selected_env_pos + 1, 0, envToMove)

                    mm.pane_environments_selected_env_pos ++

                    // if this is the live env then switch off the live env
                    if (mm.pane_environments_selected_env_pos == (mm.pane_environments_env_list.length - 1)) {
                        mm.pane_environments_last_env_is_live = false
                    }

                    await pane_environment_envSelected()
                    await mm.pane_environment_saveCode()
                } catch (e) {

                }
            },
            pane_environment_deletePressed:                 async function ( ) {
                //----------------------------------------------------------------------------------
                //
                //                    /-------------------------------------/
                //                   /    pane_environment_deletePressed   /
                //                  /-------------------------------------/
                //
                //----------------------------------------------------------------------------
                // This deletes the selected environment
                //--------------------------------------------------------------------
                try {
                    let mm = this


                    for (let envIndex = 0 ; envIndex < mm.pane_environments_env_list.length; envIndex ++ ) {
                        if (mm.pane_environments_env_list[envIndex].id == mm.pane_environments_selected_env_id) {
                            mm.pane_environments_selected_env_pos = envIndex
                        }
                    }

                    if (mm.pane_environments_selected_env_pos >= (mm.pane_environments_env_list.length )) {
                        return
                    }

                    // if this is the live env then switch off the live env
                    if (mm.pane_environments_selected_env_pos == (mm.pane_environments_env_list.length - 1)) {
                        mm.pane_environments_last_env_is_live = false
                    }


                    let envToMove = mm.pane_environments_env_list[  mm.pane_environments_selected_env_pos  ]
                    mm.pane_environments_env_list.splice(mm.pane_environments_selected_env_pos, 1)

                    mm.pane_environments_selected_env_pos   = null
                    mm.pane_environments_selected_env_id    = null
                    mm.pane_environments_editingEnvironment = false


                    await pane_environment_envSelected()
                    await mm.pane_environment_saveCode()

                } catch (e) {

                }
            },
            pane_environment_saveCode:                      async function ( ) {
                //----------------------------------------------------------------------------------
                //
                //                    /-------------------------------------/
                //                   /        pane_environment_saveCode    /
                //                  /-------------------------------------/
                //
                //----------------------------------------------------------------------------
                // This saves the environment code
                //--------------------------------------------------------------------
                try {
                    let mm = this
                    this.text = yz.helpers.deleteCodeString(this.text, "environments")
                    this.text = yz.helpers.insertCodeString(this.text, "environments",
                        {
                            list_of_environments:   mm.pane_environments_env_list,
                            last_env_is_live:       mm.pane_environments_last_env_is_live
                        }

                    )
                    mm.$root.$emit('message', {
                        type: "pending"
                    })
                } catch (e) {
                    
                }
            }
        }
    })
}
