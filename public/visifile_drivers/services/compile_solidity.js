async function compile_solidity(args) {
/*
description("compile_solidity")
base_component_id("compile_solidity")
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
      let result =  JSON.parse(solc.compile(JSON.stringify(input)))
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
      let yazzSolContractKeys = Object.keys(contracts["yazz.sol"].Counter)
      console.log("yazzSolContractKeys: " + JSON.stringify(yazzSolContractKeys,null,2))

      //console.log(JSON.stringify(result.contracts,null,2))
      let { bytecode, abi } = contracts["yazz.sol"].Counter;
      //let bytecode="1"
      //let abi="2"


      //console.log(bytecode);
      //console.log(abi);

                                                    returnFn({
                                                                abi: abi
                                                                ,
                                                                bytecode:  bytecode
                                                                ,
                                                                errors: errors
                                                              })


    })

    var ret = await promise


    return ret
}
