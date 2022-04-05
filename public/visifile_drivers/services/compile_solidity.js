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

      let result =  solc.compile(args.sol,1)
      let mainKeys = Object.keys(result)
      console.log("mainKeys: " + JSON.stringify(mainKeys,null,2))
      let contracts = result
      console.log("contracts: " + JSON.stringify(contracts,null,2))

      //console.log(JSON.stringify(result.contracts,null,2))
      //let { bytecode, abi } = result.contracts[":Counter"];
      let bytecode="1"
      let abi="2"


      //console.log(bytecode);
      //console.log(abi);

                                                    returnFn({
                                                                abi: abi
                                                                ,
                                                                bytecode:  bytecode
                                                              })


    })

    var ret = await promise


    return ret
}
