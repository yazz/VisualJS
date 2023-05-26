function(args) {
/*
component_type("VB")
display_name("Meta control")
description("This will return the metamask control")
base_component_id("metamask_control")
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
            id:         "defaultAccount",
            name:       "Default Account",
            types: {text: true},
            default:    "",
            type:       "String"
        }
        ,

        {
            id:         "networkId",
            name:       "Network ID",
            default:    -1,
            type:       "Number"
        }


    ]
)//properties
logo_url("data:image/jpeg;base64,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")
*/

    Yazz.component({
        props: ["meta","name","args","properties","refresh","design_mode"]
        ,
        template: `<div style='white-space:normal;height:100%;width:100%; color: black;
                                      border: 0px;background-color: white;overflow: auto;'>

{{(design_mode?properties.name:"")}}
                 </div>`
        ,
        data: function() {
            return {
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
            let mm = this


            if (isValidObject(this.args.text)) {
            }


            if (!this.design_mode) {
              await this.updateAccounts()
              if (window.ethereum) {
                window.ethereum.on('accountsChanged', async function (accounts) {
                   //alert('accountsChanges',accounts);
                   await mm.updateAccounts()
                 });

                 window.ethereum.on('networkChanged', async function(networkId){
                  await mm.updateAccounts()
                });

              }



            }

        }
        ,
        methods: {
            updateAccounts: async function() {
              if (web3 && web3.eth) {
                let result = await web3.eth.getAccounts()
                if (result.length == 0) {
                  this.properties.connected = "False"

                } else {
                  debugger
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
                await this.getNetwork()
              }
            }
            ,
            getNetwork: async function() {
              this.properties.networkId = await web3.eth.net.getId()
            }
            ,
            changedFn: function() {
                if (isValidObject(this.args)) {
                }
            }
        }
    })
}
