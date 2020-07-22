
var fs = require("fs");

let dbFileName = process.argv[2]

console.log("importing MDB: " + dbFileName )



var stats = fs.statSync(dbFileName)
var fileSizeInBytes = stats["size"]


console.log("fileSizeInBytes: " + fileSizeInBytes )

var binary = fs.readFileSync(dbFileName);

//show("Buffer loaded?: " , Buffer.isBuffer( binary))

function longToByteArray(/*long*/long) {
    // we want to represent the input as a 8-bytes array
    var byteArray = [0, 0, 0, 0, 0, 0, 0, 0];

    for ( var index = 0; index < byteArray.length; index ++ ) {
        var byte = long & 0xff;
        byteArray [ index ] = byte;
        long = (long - byte) / 256 ;
    }

    return byteArray;
};

function getInt64Bytes(x) {
  let y= Math.floor(x/2**32);
  return [y,(y<<8),(y<<16),(y<<24), x,(x<<8),(x<<16),(x<<24)].map(z=> z>>>24)
}

function intFromBytes(byteArr) {
    return byteArr.reduce((a,c,i)=> a+c*2**(56-i*8),0)
}

function byteArrayToLong(/*byte[]*/byteArray) {
    var value = 0;
    for ( var i = byteArray.length - 1; i >= 0; i--) {
        value = (value * 256) + byteArray[i];
    }

    return value;
};

function show(title, value, typeshow ) {
    if (typeshow == "number") {
        console.log(title + ": " + byteArrayToLong(value))

    } else if (typeshow == "integer") {
        console.log(title + ": " + intFromBytes(value))

    } else {
        console.log(title + ": " + value)

    }
}

function find(offset, length ) {
    let value = binary.slice(offset, offset + length)
    return value
}








console.log("----------------------------------------------------------------------------------------------------------------")
console.log("----------------------------------------------------------------------------------------------------------------")
console.log("----------------------------------------------------------------------------------------------------------------")


let headerMagicNumber = find(0, 4)
show("magic number", headerMagicNumber, "number")




let fileFormatID = find(4, 16)
show("file format ID", fileFormatID)


let jetVersion = find(0x14, 4)
show("jetVersion", jetVersion, "number")
