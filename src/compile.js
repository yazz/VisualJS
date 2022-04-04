let path = require("path")
let fs = require("fs")
let solc = require("solc")

let helloPath = path.resolve(__dirname, "", "hello.sol")
let source = fs.readFileSync(helloPath,"UTF-8")
console.log(source)

let HelloContract = solc.compile(source,1).contracts[":Hello"]
