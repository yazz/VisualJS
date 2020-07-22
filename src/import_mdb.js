
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

    } else if (typeshow == "hex") {
        console.log(title + ": 0x" + value.toString(16))

    } else {
        console.log(title + ": " + value)

    }
}

function find(offset, length , typeob) {
    let value = binary.slice(offset, offset + length)
    if (typeob=="number") {
        return byteArrayToLong(value)
    }
    return value
}






let offset = 0
console.log("")
console.log("")
console.log("")
console.log("")
console.log("")
console.log("")
console.log("")
console.log("")
console.log("")
console.log("")
console.log("")
console.log("")
console.log("----------------------------------------------------------------------------------------------------------------")
console.log("---------------                              " + dbFileName)
console.log("----------------------------------------------------------------------------------------------------------------")


console.log("")
console.log("")
console.log("")
console.log("----------------------------------------------------------------------------------------------------------------")
console.log("------                                            HEADER                                              ----------")
console.log("------                                            offset: " + offset + "                               ")
console.log("----------------------------------------------------------------------------------------------------------------")

let headerMagicNumber = find(offset + 0, 4, "number")
show("magic number", headerMagicNumber, "hex")




let headerFileFormatID = find(offset + 4, 16)
show("file format ID", headerFileFormatID)


let headerJetFileVersion = find(offset + 0x14, 4, "number")
show("headerJetFileVersion", headerJetFileVersion)

let headerJetVersion = 4





let tempoffset = offset + 0x14 + 4
console.log("")
console.log("")
console.log("")
console.log("----------------------------------------------------------------------------------------------------------------")
console.log("------                                       HEADER  EXTRA                                            ----------")
console.log("----------------------------------------------------------------------------------------------------------------")

if (headerJetVersion == 3) {

    let SystemCollation = find(tempoffset + 0x22, 2)
    show("System Collation", SystemCollation, "number")

}






if (headerJetVersion == 3) {
    offset = offset + 2048
} else if (headerJetVersion == 4) {
    offset = offset + 4096
} else {
    //offset = offset + 2048
}
let PageSignature = find(offset + 0, 2, "number")
while (PageSignature != 0x102) {
    if (headerJetVersion == 3) {
        offset = offset + 2048
    } else if (headerJetVersion == 4) {
        offset = offset + 4096
    } else {
        //offset = offset + 2048
    }
    PageSignature = find(offset + 0, 2, "number")
}
console.log("")
console.log("")
console.log("")
console.log("----------------------------------------------------------------------------------------------------------------")
console.log("------                                    TABLE DEFNS PAGE HEADER                                     ----------")
console.log("------                                    offset: " + offset + "                               ")
console.log("----------------------------------------------------------------------------------------------------------------")
show("Page Signature", PageSignature, "hex")





tempoffset = offset + 8
console.log("")
console.log("")
console.log("")
console.log("----------------------------------------------------------------------------------------------------------------")
console.log("------                                    TABLE DEFNS DATA                                            ----------")
console.log("----------------------------------------------------------------------------------------------------------------")
let TableDefinitionLength = find(tempoffset, 4, "number")
show("Table Definition Length", TableDefinitionLength)
