
var fs = require("fs");

let dbFileName = process.argv[2]

console.log("importing MDB: " + dbFileName )



var stats = fs.statSync(dbFileName)
var fileSizeInBytes = stats["size"]


console.log("fileSizeInBytes: " + fileSizeInBytes )

var binary = fs.readFileSync(dbFileName);

show("Buffer loaded?: " , Buffer.isBuffer( binary))

function show(title, value ) {
    //console.log(title + ": " + JSON.stringify(value))
    console.log(title + ": " + value)
}

function find(offset, length ) {
    let value = binary.slice(offset, offset + length)
    return value
}


let headerMagicNumber = find(0, 4)
show("magic number", headerMagicNumber)




let fileFormatID = find(4, 16)
show("file format ID", fileFormatID)
