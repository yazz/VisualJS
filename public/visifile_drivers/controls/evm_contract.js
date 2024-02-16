function(args) {
/*
is_app(true)
component_type("VB")
hash_algorithm("SHA256")
display_name("EVM Contract control")
description("This will return the EVM Contract control")
base_component_id("evm_contract_control")
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
            id:     "previous_version_content_hash",
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
logo_url("data:image/png;base64,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")
*/

    Yazz.component({
        props: ["meta","name","args","properties","refresh","design_mode"]
        ,
        template: `<div style='white-space:normal;height:100%;width:100%; color: black;
                                      border: 0px;background-color: white;overflow: auto;'>


          <div    v-bind:style='"width:100%;height:50vh;overflow-y:auto;"'
                  v-bind:refresh='refresh'
                  v-if='design_mode == "detail_editor"'>


                  <button  v-if="compileStatus=='NONE'"  class="btn btn-danger"
                             v-on:click="compileCode()">
                        Compile solidity:
                  </button>

                <button   v-if="compileStatus=='COMPILED'"  class="btn btn-dark"
                           v-on:click="deployCode()">
    
                  Deploy Contract
                </button>


                  <select v-model="properties.blockchainId" @change="changeBlockchainNetwork();" id=changeBlockchain>
                    <option disabled value="">Please select one</option>
                    <option  v-for="blockchainId in Object.keys(window.blockchainIds)"
                            v-if="window.blockchainIds[blockchainId].chainName"
                             v-bind:selected="properties.blockchainId === blockchainId"
                             v-bind:value="blockchainId"
                              >{{window.blockchainIds[blockchainId].chainName}}</option>
                  </select>

                  <a v-if="faucet" v-bind:href="faucet" target="_blank">
                    Faucet
                  </a>



                  <span v-if="deployingStatus=='WAITING'" class="badge badge-pill badge-warning"><blink>Deploying ...</blink></span>

                  <span v-if="deployingStatus=='DEPLOYED'" class="badge badge-pill badge-success">{{deployingStatus}}</span>

                  <span v-if="deployingStatus=='FAILED'" class="badge badge-pill badge-danger">{{deployingStatus}}</span>



            <div v-bind:style='"color: " + properties.infoColor + ";"'
                 v-html="properties.infoMessage">
            </div>
            
                              <div style="font-family: courier">




                  <textarea rows=10 cols=50
                            style="margin: 5px;"
                  v-model='properties.code'></textarea>

                  <div style="width: 400px;">
                    <div v-if='deployError' style='color:red;'><b>Deploy Error</b> {{deployError}}</div>
                    <b>ABI</b> {{properties.abi}}
                    <br>
                    <b>Bytecode</b> {{bytecode}}
                    <br>
                    <b>Errors</b> {{compileErrors}}

                    </div>
                  </div>
           </div>
           
           
           
           
           <div  v-if='design_mode && design_mode != "detail_editor"'>
             {{properties.name}}
           </div>


                 </div>`
        ,
        data: function() {
            return {
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
            await registerComponent(this)
            await useWeb3()
            this.lastSelectedBlockchain = this.properties.blockchainId
            this.faucet = window.blockchainIds[this.properties.blockchainId].faucet

            if (isValidObject(this.args.text)) {
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

              var result = await callComponent(
              {
                  base_component_id: "compile_solidity"
              }
              ,
              {
                  sol: this.properties.code
              })
                this.compileResult          = "compiled "
                this.properties.abi         = JSON.stringify(result.abi,null,2)
                this.bytecode               = result.bytecode
                this.compileErrors          = result.errors
                this.compiledContractName   = result.contractName
                if (result.bytecode) {
                    this.compileStatus          = "COMPILED"
                    this.properties.infoMessage = "<b color=green>Contract compiled </b>"
                    this.properties.infoColor = "green"
                } else {
                    this.properties.infoMessage = "Contract compile failed "
                    this.properties.infoColor = "red"
                }
                this.refresh++
            }
            ,
            deployCode: async function() {
                yz.mainVars.disableAutoSave = true;
              let mm = this
              mm.deployError = null
              let Hello = new web3.eth.Contract(JSON.parse(this.properties.abi), null, {
                  data: '0x' + this.bytecode
              });

              let gas
              let gasPrice = '20000000000'
              Hello.deploy().estimateGas().
              then((estimatedGas) => {
              console.log("Estimated gas: " + estimatedGas);
              gas = estimatedGas;
              }).
              catch(console.error);

              mm.deployingStatus = "WAITING"
              Hello.deploy().send({
                  from: this.properties.defaultAccount,
                  gasPrice: gasPrice,
                  gas: gas
              }).then((instance) => {
//debugger
                  console.log("Contract mined at " + instance.options.address);
                  mm.properties.infoMessage = "<a href='" + window.blockchainIds[mm.properties.blockchainId].preMinedUrl + instance.options.address + window.blockchainIds[mm.properties.blockchainId].postMinedUrl + "' target=mined>Contract mined at " + instance.options.address + "</a>";
                  mm.properties.infoColor = "black"

                      mm.contractInstance = instance;
                  mm.properties.contractAddress = "" + instance.options.address
                  //mm.refresh++
                  mm.deployingStatus = "DEPLOYED"
                  mm.compileStatus   = "NONE"


                  //debugger
                  let parsedABI = JSON.parse(mm.properties.abi)
                  let smartContractMethods = []
                  let smartContractMethodsCode = []
                  for (let abiIndex = 0 ; abiIndex < parsedABI.length ; abiIndex ++ ) {
                      let abiEntry = parsedABI[abiIndex]
                      if (abiEntry.stateMutability == "view") {
                          smartContractMethods.push({
                                                id:         abiEntry.name,
                                                pre_snippet: `await `,
                                                snippet:    `${abiEntry.name}()`,
                                                name:       abiEntry.name,
                                                type:       "Action",
                                                help:       `<div>Help text for
                                                                <b>${abiEntry.name}</b> function
                                                            </div>`})
                          smartContractMethodsCode.push(
                              {
                                code: `${abiEntry.name}: async function() {
    let sdf = await this.getPropertyAsync("${abiEntry.name}")
return sdf
}
`
                              })

                      } else  if (abiEntry.stateMutability == "nonpayable") {
                          smartContractMethods.push(
                              {
                                  id:         abiEntry.name,
                                  pre_snippet: `await `,
                                  snippet:    `${abiEntry.name}()`,
                                  name:       abiEntry.name,
                                  type:       "Action",
                                  help:       `<div>Help text for
                                                <b>${abiEntry.name}</b> function
                                             </div>`
                              })

                          smartContractMethodsCode.push(
                            {
                                code:
                                    `${abiEntry.name}: async function() {
    await this.callMethodAsync("${abiEntry.name}", [])
}
`
                            })
                      }
                  }


                  mm.properties.previous_version_content_hash =  mm.properties.ipfs_hash_id
                  //let  newComponentType = mm.compiledContractName + "_component"
                  //let  newComponentType = "sc_" + instance.options.address
                  let  newComponentType = "sc_" + ("" + uuidv4()).replaceAll("-","_")
                  debugger
                  //debugger
                  callAjaxPost("/http_post_generate_component",
                  {
                       relative_filename_to_copy:    "controls/evm_contract.js"
                       ,
                       base_component_id:      newComponentType
                       ,
                       default_property_values: {
                           abi:   mm.properties.abi
                           ,
                           code: mm.properties.code
                           ,
                           previous_version_content_hash: mm.properties.ipfs_hash_id
                           ,
                           contractAddress: mm.properties.contractAddress
                           ,
                           blockchainId: mm.properties.blockchainId
                           ,
                           logo_url: "/driver_icons/blue_eth.png"
                       }
                       ,
                       new_properties: smartContractMethods
                      ,
                      new_methods: smartContractMethodsCode
                  }
                  ,
                  async function(response){
                    let responseJson = JSON.parse(response)
                     window.globalEventBus.emit('message', {
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
                              propertyValue:          responseJson.contentHash
                          })

                  })

              }).catch((error ) => {
                //debugger
                mm.deployError = error
                mm.deployingStatus = "FAILED"
              });
                yz.mainVars.disableAutoSave = false;




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
