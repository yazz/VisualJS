async function compile_solidity(args) {
/*
description("compile_solidity")
base_component_id("compile_solidity")
load_once_from_file(true)
only_run_on_server(true)
*/

let compiler = require("simple-solc");
let path = require("path")
let Web3 = require("web3")
let fs = require("fs")
let helloPath = path.resolve(__dirname, "", "Counter.sol")
let source = fs.readFileSync(helloPath,"UTF-8")
console.log("0");
console.log(source)
console.log("1");
    var promise = new Promise(async function(returnFn) {

      console.log("2");

      let { bytecode, abi } = compiler("Counter", helloPath);

      console.log(bytecode);
      console.log(abi);

                                                    returnFn({
                                                                abi: abi
                                                                ,
                                                                bytecode:  bytecode
                                                              })


    })

    var ret = await promise


    return ret
}
