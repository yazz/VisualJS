const compiler = require("simple-solc");
let path = require("path")
let Web3 = require("web3")
let fs = require("fs")
let helloPath = path.resolve(__dirname, "", "Counter.sol")
let source = fs.readFileSync(helloPath,"UTF-8")
console.log(source)

const { bytecode, abi } = compiler("Counter", helloPath);

console.log(bytecode);
console.log(abi);

let web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/v3/1b2e4b6374dc4a898c6ec1d6ead55886"));



let CounterContract = new web3.eth.Contract(abi);

(async function() {
  console.log("CounterContract:  " + CounterContract)
  let val = CounterContract.count
  console.log("val: " + val)

})()
