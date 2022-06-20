function(args) {
/*
is_app(true)
component_type("VB")
display_name("EVM Contract control")
description("This will return the EVM Contract control")
base_component_id("component_builder_control")
load_once_from_file(true)
visibility("PRIVATE")
read_only(true)
properties(
    [

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
            default:    100,
            type:       "Number"
        }
        ,
        {
            id:         "accounts",
            name:       "Accounts",
            type:       "Array",
            default:    [],
            types: {valueTextList: true},
            editor:     "detail_editor"
        }
        ,
        {
            id:     "abi",
            name:   "ABI",
            type:   "String",
            types: {text: true},
            default: null
            ,
            accept_types: {canConvertToString: true, text: true},
            textarea: true,
            help:       `<div>Help text for
                            <b>ABI</b> property
                         </div>`
        }
        ,
        {
            id:     "ipfs_hash_id",
            name:   "IPFS Hash ID",
            type:   "String",
            readonly: true
        }
        ,
        {
            id:     "previous_ipfs_version",
            name:   "Previous IPFS Version",
            type:   "String",
            readonly: true
        }
        ,
        {
            id:     "code",
            name:   "Solidity",
            type:   "String",
            types: {text: true},
            default:
`pragma solidity ^0.8.7;

contract Counter {
    uint256 public count = 1;

    function increment() public {
        count += 1;
    }
}

`
            ,
            accept_types: {canConvertToString: true, text: true},
            textarea: true,
            help:       `<div>Help text for
                            <b>code</b> property
                         </div>`
        }
        ,
        {
            id:         "connected",
            name:       "Connected?",
            type:       "Select",
            default:    "False",
            values:     [
                            {display: "True",   value: "True"},
                            {display: "False",  value: "False"}
                        ]
        }
        ,
        {
            id:         "blockchainId",
            name:       "Blockchain ID",
            type:       "Select",
            default:    "4",
            values:     [
                            {display: 'Ethereum - Rinkby test net',   value: "4"},
                            {display: 'RSK - Main net',   value: "30"},
                            {display: 'RSK - Test net',   value: "31"},
                            {display: 'Fantom Opera Mainnet',  value: "250"},
                            {display: 'Arbitrum - testnet',  value: "421611"}
                        ]
        }
        ,
        {
            id:         "has_details_ui",
            name:       "Has details UI?",
            type:       "Boolean",
            default:    true,
            hidden:     true
        }
        ,
        {
            id:         "defaultAccount",
            name:       "Default Account",
            types: {text: true},
            default:    "",
            type:       "String"
        }
        ,
        {
            id:         "contractAddress",
            name:       "Contract Address",
            types: {text: true},
            default:    "",
            type:       "String"
        }
        ,
        {
            id:         "callMethodAsync",
            snippet:    `callMethodAsync("getCount", [])`,
            name:       "callMethodAsync",
            type:       "Action",
            help:       `<div>Help text for
                            <b>callMethodAsync</b> function
                         </div>`
        }
        ,
        {
            id:         "getPropertyAsync",
            snippet:    `getPropertyAsync("counter")`,
            name:       "getPropertyAsync",
            type:       "Action",
            help:       `<div>Help text for
                            <b>getPropertyAsync</b> function
                         </div>`
        }
        ,
        {
            id:         "infoMessage",
            name:       "infoMessage",
            type:       "String",
            hidden:     true,
            default:    ""
        }
        ,

        {
            id:         "infoColor",
            name:       "infoColor",
            type:       "String",
            hidden:     true,
            default:    "black"
        }



    ]
)//properties
logo_url("/driver_icons/builder.png")
*/

    Vue.component("component_builder_control",{
        props: ["meta","name","args","properties","refresh","design_mode"]
        ,
        template: `
          <div style='white-space:normal;height:100%;width:100%; color: black;
                                      border: 0px;background-color: white;overflow: auto;'>

          <div v-bind:style='"width:100%;height:50vh;overflow-y:auto;"'
               v-bind:refresh='refresh'
               v-if='(!design_mode) || (design_mode == "") '>

            {{CUSTOM_UI_GOES_HERE}}
               
          </div>

          <div v-bind:style='"width:100%;height:50vh;overflow-y:auto;"'
               v-bind:refresh='refresh'
               v-if='design_mode == "detail_editor"'>


            <button v-if="compileStatus=='NONE'" class="btn btn-danger"
                    v-on:click="compileCode()">
              Compile solidity:
            </button>

            <button v-if="compileStatus=='COMPILED'" class="btn btn-dark"
                    v-on:click="deployCode()">

              Deploy Contract
            </button>


            <select v-model="properties.blockchainId" @change="changeBlockchainNetwork();" id=changeBlockchain>
              <option disabled value="">Please select one</option>
              <option v-for="blockchainId in Object.keys(window.blockchainIds)"
                      v-if="window.blockchainIds[blockchainId].chainName"
                      v-bind:selected="properties.blockchainId === blockchainId"
                      v-bind:value="blockchainId"
              >{{ window.blockchainIds[blockchainId].chainName }}
              </option>
            </select>

            <a v-if="faucet" v-bind:href="faucet" target="_blank">
              Faucet
            </a>


            <span v-if="deployingStatus=='WAITING'" class="badge badge-pill badge-warning"><blink>Deploying ...</blink></span>

            <span v-if="deployingStatus=='DEPLOYED'" class="badge badge-pill badge-success">{{ deployingStatus }}</span>

            <span v-if="deployingStatus=='FAILED'" class="badge badge-pill badge-danger">{{ deployingStatus }}</span>


            <div v-bind:style='"color: " + properties.infoColor + ";"'>
              {{ properties.infoMessage }}
            </div>

            <div style="font-family: courier">




                  <textarea rows=10 cols=50
                            style="margin: 5px;"
                            v-model='properties.code'></textarea>

              <div style="width: 400px;">
                <div v-if='deployError' style='color:#000000;'><b>Deploy Error</b> {{ deployError }}</div>
                <b>ABI</b> {{ properties.abi }}
                <br>
                <b>Bytecode</b> {{ bytecode }}
                <br>
                <b>Errors</b> {{ compileErrors }}

              </div>
            </div>
          </div>


          <div v-if='design_mode && design_mode != "detail_editor"'>
            {{ properties.name }}
          </div>


          </div>`
        ,
        data: function() {
            return {
            CUSTOM_UI_GOES_HERE: "zoo"
            ,

              compileResult: ""
              ,
              bytecode: null
              ,
              compileErrors: null
              ,
              deployingStatus: ""
              ,
              contractInstance: null
                ,
                compiledContractName: null
              ,
              lastSelectedBlockchain: null
              ,
              faucet: null
              ,
              deployError: null
                ,
                compileStatus: "NONE"
            }
        }
        ,
        watch: {
          // This would be called anytime the value of the input changes
          refresh(newValue, oldValue) {
              //console.log("refresh: " + this.args.text)
              if (isValidObject(this.args)) {
              }          // you can do anything here with the new value or old/previous value
          }
        },
        mounted: async function() {
            registerComponent(this)
            this.lastSelectedBlockchain = this.properties.blockchainId
            this.faucet = window.blockchainIds[this.properties.blockchainId].faucet

            if (isValidObject(this.args.text)) {
            }

            if (isValidObject(this.args.name)) {
                globalControl[this.args.name] =  this
            }

            if (web3 && web3.eth) {
              let result = await web3.eth.getAccounts()
              if (result.length == 0) {
                this.properties.connected = "False"

              } else {
                //debugger
                this.properties.connected = "True"
                let accounts = (await web3.eth.getAccounts())
                this.properties.defaultAccount = accounts[0]

                this.properties.accounts = []
                for ( let i=0 ; i < accounts.length ; i++ ) {
                  this.properties.accounts.push({ value: accounts[i],
                                                  text:  accounts[i]
                                                })

                }
              }
            }
        }
        ,
        methods: {
            /*NEW_METHODS_START*/
            /*NEW_METHODS_END*/


            callMethodAsync: async function(method, methodArgs) {
              //debugger
                this.refreshContractInstance()
                await this.contractInstance.methods[method]().send(
                  {
                      from: this.properties.defaultAccount
                    })
.then(function(receipt){
  //debugger
    // receipt can also be a new contract instance, when coming from a "contract.deploy({...}).send()"
});
                //let rettt = (await this.contractInstance.methods.count.call().call())
                //return rettt;
            }
            ,
            getPropertyAsync: async function(propertyName) {
              //debugger
                this.refreshContractInstance()
                let rettt = (await this.contractInstance.methods[propertyName].call().call())
                return rettt;
            }
            ,
            compileCode: async function() {
              //debugger
              this.infoMessage = ""


 //               sol = this.properties.code
                this.compileResult          = "compiled "
                    this.compileStatus          = "COMPILED"
                    this.properties.infoMessage = "Contract compiled "
                    this.properties.infoColor = "green"
//                } else {
  //                  this.properties.infoMessage = "Contract compile failed "
    //                this.properties.infoColor = "red"
      //          }
                this.refresh++
                //{{CUSTOM_UI_GOES_HERE}}
            }
            ,
            deployCode: async function() {
                debugger
                let mm = this
                  mm.properties.infoMessage = "Contract mined at "
                  mm.properties.infoColor = "black"

                  //mm.refresh++
                  mm.deployingStatus = "DEPLOYED"
                  mm.compileStatus   = "NONE"

//zzz
                  //debugger





                  mm.properties.previous_ipfs_version =  mm.properties.ipfs_hash_id
                  //let  newComponentType = mm.compiledContractName + "_component"
                  //let  newComponentType = "sc_" + instance.options.address
                  let  newComponentType = "sc_" + ("" + uuidv4()).replaceAll("-","_")
                  debugger
                  //debugger
                  callAjaxPost("/copy_component",
                  {
                      relative_filename_to_copy:    "controls/component_builder.js"
                      ,
                      base_component_id:      newComponentType
                       ,
                       default_property_values: {
                           previous_ipfs_version: mm.properties.ipfs_hash_id
                           ,
                       }
                       ,
                       new_properties: []
                      ,
                      new_methods: []
                  }
                  ,
                  async function(response){
                    showTimer("in 'save_component' response")
                    //alert(response)
                    //debugger

                    let responseJson = JSON.parse(response)
                    mm.$root.$emit('message', {
                                                    type:             "load_controls",
                                                })
                      mm.meta.getEditor().changeComponentBaseId(
                          {
                              componentName:        mm.properties.name,
                              newComponentBaseId:     newComponentType
                          })

                      mm.meta.getEditor().changePropertyValue(
                          {
                              componentName:          mm.properties.name,
                              propertyName:          "ipfs_hash_id",
                              propertyValue:          responseJson.ipfsHash
                          })

                  })


            }
            ,
            refreshContractInstance: function() {

                if (!this.contractInstance) {
                  this.contractInstance = new web3.eth.Contract(
                        JSON.parse(this.properties.abi), this.properties.contractAddress);

                }
            }
            ,
            changeBlockchainNetwork: function() {
              //debugger
              console.log(this.properties.blockchainId)
              let mm = this
              setTimeout(
                async function() {
                  let switchChain = await switchBlockchainNetwork(mm.properties.blockchainId)   //eth rinkby
                    if (switchChain) {
                        mm.lastSelectedBlockchain = mm.properties.blockchainId
                        mm.faucet = window.blockchainIds[mm.properties.blockchainId].faucet
                    } else {
                        mm.properties.blockchainId = mm.lastSelectedBlockchain
                    }
                },100)
            }
            ,


            changedFn: function() {
                if (isValidObject(this.args)) {
                }
            }
        }
    })
}
