function(args) {
/*
is_app(true)
component_type("VB")
display_name("EVM Demo Count Contract control")
description("This will return the Demo EVM Count Contract control")
base_component_id("evm_demo_count_contract_control")
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
            default: `[
  {
    "inputs": [],
    "name": "count",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "increment",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]`
            ,
            accept_types: {canConvertToString: true, text: true},
            textarea: true,
            help:       `<div>Help text for
                            <b>ABI</b> property
                         </div>`
        }
        ,
        {
            id:     "code",
            name:   "Solidity",
            type:   "String",
            types: {text: true},
            default:
`
pragma solidity ^0.8.7;

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
            default:    "0x5e73B6e12BB7FDF21537e76CF5d8dEe9Cb0bEAF9",
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
            id:         "increment",
            snippet:    `increment()`,
            name:       "increment",
            type:       "Action",
            help:       `<div>Help text for
                            <b>increment</b> function
                         </div>`
        }
        ,
        {
            id:         "count",
            snippet:    `count()`,
            name:       "count",
            type:       "Action",
            help:       `<div>Help text for
                            <b>count</b> function
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

    ]
)//properties
logo_url("/driver_icons/counter.jpg")
*/

    Yazz.component({
        props: ["meta","name","args","properties","refresh","design_mode"]
        ,
        template: `<div style='white-space:normal;height:100%;width:100%; color: black;
                                      border: 0px;background-color: white;overflow: auto;'>

{{(design_mode?properties.name:"")}}



          <div    v-bind:style='"width:100%;height:50vh;overflow-y:auto;"'
                  v-bind:refresh='refresh'
                  v-if='design_mode == "detail_editor"'>

                  Detail editor
                  <button    class="btn btn-danger"
                             v-on:click="compileCode()">

                        Compile solidity:



                  </button>

                  <button    class="btn"
                             v-on:click="deployCode()">

                        Deploy
                  </button>
                  <span v-if="deployingStatus=='WAITING'" class="badge badge-pill badge-warning"><blink>Deploying ...</blink></span>

                  <span v-if="deployingStatus=='DEPLOYED'" class="badge badge-pill badge-success">{{deployingStatus}}</span>


                  <br>
                  <div style="font-family: courier">

                  <textarea rows=10 cols=50
                  v-model='properties.code'></textarea>

                  <div style="width: 400px;">
                    <b>ABI</b> {{properties.abi}}
                    <br>
                    <b>Bytecode</b> {{bytecode}}
                    <br>
                    <b>Errors</b> {{compileErrors}}

                    </div>
                  </div>
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


          increment: async function() {
            await this.callMethodAsync("increment", [])
          }
          ,
          count: async function() {
            let sdf = await this.getPropertyAsync("count")
            return sdf
          }
          ,

            callMethodAsync: async function(method, methodArgs) {
              debugger
                this.refreshContractInstance()
                await this.contractInstance.methods[method]().send(
                  {
                      from: '0x665F6aB2530eE5d2b469849aD4E16ccfF2EE769C'
                    })
.then(function(receipt){
  debugger
    // receipt can also be a new contract instance, when coming from a "contract.deploy({...}).send()"
});
                //let rettt = (await this.contractInstance.methods.count.call().call())
                //return rettt;
            }
            ,
            getPropertyAsync: async function(propertyName) {
              debugger
                this.refreshContractInstance()
                let rettt = (await this.contractInstance.methods[propertyName].call().call())
                return rettt;
            }
            ,
            compileCode: async function() {

              var result = await callComponent(
              {
                  base_component_id: "compile_solidity"
              }
              ,
              {
                  sol: this.properties.code
              })
              this.compileResult  = "compiled "
              this.properties.abi = JSON.stringify(result.abi,null,2)
              this.bytecode       = result.bytecode
              this.compileErrors  = result.errors

            }
            ,
            deployCode: async function() {
              debugger
              let mm = this
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
                  from: '0x665F6aB2530eE5d2b469849aD4E16ccfF2EE769C',
                  gasPrice: gasPrice,
                  gas: gas
              }).then((instance) => {
                  console.log("Contract mined at " + instance.options.address);
                  mm.contractInstance = instance;
                  mm.properties.contractAddress = "" + instance.options.address
                  //mm.refresh++
                  mm.deployingStatus = "DEPLOYED"

              });





            }
            ,
            refreshContractInstance: function() {

                if (!this.contractInstance) {
                  this.contractInstance = new web3.eth.Contract(
                        JSON.parse(this.properties.abi), this.properties.contractAddress);

                }
            }
            ,


            changedFn: function() {
                if (isValidObject(this.args)) {
                }
            }
        }
    })
}
