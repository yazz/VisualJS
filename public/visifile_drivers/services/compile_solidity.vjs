async function compile_solidity(args) {
/*
description("compile_solidity")
base_component_id("compile_solidity")
hash_algorithm("SHA256")
load_once_from_file(true)
only_run_on_server(true)
*/

    let solc = require("solc");
    var promise = new Promise(async function(returnFn) {

      console.log("1");
      //console.log(args.sol)
      console.log("2");

      var input = {
          language: 'Solidity',
          sources: {
              'yazz.sol' : {
                  content: args.sol
              }
          },
          settings: {
              outputSelection: {
                  '*': {
                      '*': [ '*' ]
                  }
              }
          }
      };
      try {
        let compileResult = solc.compile(JSON.stringify(input))
        let result =  JSON.parse(compileResult)
        //console.log(result);
        //let result =  solc.compile(args.sol,1)
        let mainKeys = Object.keys(result)
        console.log("mainKeys: " + JSON.stringify(mainKeys,null,2))
        let contracts = result.contracts
        let contractKeys = Object.keys(contracts)
        let errors = result.errors
        console.log("contractKeys: " + JSON.stringify(contractKeys,null,2))
        let yazzSolKeys = Object.keys(contracts["yazz.sol"])
        console.log("yazzSolKeys: " + JSON.stringify(yazzSolKeys,null,2))
          let contractName = yazzSolKeys[0]
        let yazzSolContractKeys = Object.keys(contracts["yazz.sol"][contractName])
        console.log("yazzSolContractKeys: " + JSON.stringify(yazzSolContractKeys,null,2))

        //console.log(JSON.stringify(result.contracts,null,2))
        let { evm, abi } = contracts["yazz.sol"][contractName];
        //let bytecode="1"
        //let abi="2"


        //console.log(bytecode);
        //console.log(abi);

                                                      returnFn({
                                                                  abi: abi
                                                                  ,
                                                                  bytecode:  evm.bytecode.object
                                                                  ,
                                                                  errors: errors
                                                                  ,
                                                                  contractName: contractName
                                                                })
      } catch (compileError) {
        returnFn({
                    errors: "Compile error"
                  })
      }



    })

    var ret = await promise


    return ret
}
