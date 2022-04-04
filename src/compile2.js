const compiler = require("simple-solc");
let path = require("path")
let fs = require("fs")
let helloPath = path.resolve(__dirname, "", "Counter.sol")
let source = fs.readFileSync(helloPath,"UTF-8")
console.log(source)

const { bytecode, abi } = compiler("Counter", helloPath);

console.log(bytecode);
console.log(abi);
