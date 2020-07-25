let headerJetVersion = 4
var fs = require("fs");

let dbFileName = process.argv[2]

console.log("importing MDB: " + dbFileName )

var offset = 0
var tempoffset


var stats = fs.statSync(dbFileName)
var fileSizeInBytes = stats["size"]
let numPages = (fileSizeInBytes / 4096) + 1

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

function find(aoffset, length , typeob) {
    let value = binary.slice(aoffset, aoffset + length)
    if (typeob=="number") {
        return byteArrayToLong(value)
    } else if (typeob == "littleendian")  {
        value = [value[2],value[1],value[0]]
        return byteArrayToLong(value)
    }
    return value
}



function getVar(params) {
    if (params.useJetVersion) {
        if (headerJetVersion != params.useJetVersion) {
            console.log("Skipping " + params.name)
            return null
        }
    }
    let retvalue = find(tempoffset , params.length, params.type)
    if (params.show) {
        show(params.name, retvalue, params.showas)

    }
    tempoffset = tempoffset + params.length
    if (params.type == "string") {
        retvalue = retvalue
    }
    return retvalue
}


function getColumnType(colType) {
    switch(colType) {
        case 1:
            return "Boolean"
        case 2:
            return "Integer, 8 bit"
        case 3:
            return "Integer, 16 bit"
        case 4:
            return "Integer, 32 bit"
        case 5:
            return "Fixed Point Number, 64 bit (Money / Currency)"
        case 6:
            return "Floating Point Number, 32 bit (single)"
        case 7:
            return "Floating Point Number, 64 bit (double)"
        case 8:
            return "Date/Time, 64 bit, (stored as double)"
        case 9:
            return "Binary (up to 255 bytes)"
        case 10:
            return "Text (up to 255 characters)"
        case 11:
            return "OLE (long binary)"
        case 12:
            return "Memo (long Text)"
        case 15:
            return "GUID (global unique identifier)"
        case 16:
            return "Fixed Point, 96 bit, stored in 17 bytes"
        case 18:
            return "Complex field (32 bit integer key)"
            break;
      default:
        return "Unknown"
        // code block
    }
}


function doStuff(){
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
console.log("------                                          MAIN HEADER                                           ----------")
console.log("------                                            offset: " + offset + "                               ")
console.log("----------------------------------------------------------------------------------------------------------------")

let headerMagicNumber = find(offset + 0, 4, "number")
show("magic number", headerMagicNumber, "hex")




let headerFileFormatID = find(offset + 4, 16)
show("file format ID", headerFileFormatID)


let headerJetFileVersion = find(offset + 0x14, 4, "number")
show("headerJetFileVersion", headerJetFileVersion)







tempoffset = offset + 0x14 + 4
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



for (var tt=0;tt<1;tt++){
    let columns = {}
    let columnNames = {}
let PageSignature = find(offset + 0, 2, "number")
let VC = find(offset + 2, 2, "number")
let NextPage = find(offset + 4, 4, "number")
while (PageSignature != 0x102) {
    if (headerJetVersion == 3) {
        offset = offset + 2048
    } else if (headerJetVersion == 4) {
        offset = offset + 4096
        if (offset > fileSizeInBytes) {
            process.exit()
        }
    } else {
        //offset = offset + 2048
    }
    PageSignature = find(offset + 0, 2, "number")
    VC = find(offset + 2, 2, "number")
    NextPage = find(offset + 4, 4, "number")

}
console.log("")
console.log("")
console.log("")
console.log("----------------------------------------------------------------------------------------------------------------")
console.log("------                                    TABLE DEFNS PAGE HEADER                                     ----------")
console.log("------                                    offset: " + offset + "                               ")
console.log("----------------------------------------------------------------------------------------------------------------")
show("Page Signature", PageSignature, "hex")
show("VC", VC)
show("NextPage", NextPage)



tempoffset = offset + 8

//zzz
let TableDefinitionLength = find(tempoffset, 4, "number")
show("Table Definition Length", TableDefinitionLength)

let Numberofrows = find(tempoffset + 8, 4, "number")
show("Number of rows", Numberofrows)

tempoffset = tempoffset + 12
let Autonumber = find(tempoffset, 4, "number")
show("Autonumber", Autonumber)



tempoffset = tempoffset + 4

let AutonumberIncrement = getVar({
    useJetVersion: 4,
    length: 4,
    name: "Autonumber Increment",
    type: "number"
})


getVar({
    useJetVersion: 4,
    length: 4,
    name: "Complex Autonumber",
    showas: "number"
})

getVar({
    useJetVersion: 4,
    length: 4,
    name: "Unknown"
})

getVar({
    useJetVersion: 4,
    length: 4,
    name: "Unknown"
})

getVar({
    length: 1,
    name: "Table Type / Flags?",
    type: "number",
    showas: "hex",
    show: true
})


getVar({
    length: 2,
    name: "Next Column Id",
    type: "number"
})


getVar({
    length: 2,
    name: "Variable columns",
    type: "number",
    show: true
})


let colCount = getVar({
    length: 2,
    name: "Column Count",
    type: "number",
    show: true
})


let indexCount = getVar({
    length: 4,
    name: "Index Count",
    type: "number"
})
let RealIndexCount = getVar({
    length: 4,
    name: "Real Index Count",
    type: "number"
})

getVar({
    length: 1,
    name: "Row Page Map record",
    type: "number",
    show: true
})
var RowPageMapPage = getVar({
    length: 3,
    name: "Row Page Map Page",
    type: "number",
    show: true
})

getVar({
    length: 1,
    name: "Free Space Page Map Record",
    type: "number",
    show: true
})
getVar({
    length: 3,
    name: "Free Space Page Map Page",
    type: "number",
    show: true
})

//skip indexes
tempoffset = tempoffset + (12 * RealIndexCount)


for (var x=0; x< colCount; x++) {
    let newColumn = new Object()
    let colType = getVar({
        length: 1,
        name: "col Type",
        type: "number"
        ,
        show: false
    })
    newColumn.colType = getColumnType(colType)
    //console.log("Col type: " + getColumnType(colType))
    columns[x] = newColumn
    getVar({
        useJetVersion: 4,
        length: 4,
        name: "Unknown"
        ,
        show: false
    })
    let ColID = getVar({
        length: 2,
        name: "Col ID",
        type: "number"
        ,
        show: false
    })
    let VariableColumnNumber = getVar({
        length: 2,
        name: "Variable Column Number",
        type: "number"
        ,
        show: false
    })
let ColumnIndex =     getVar({
         length: 2,
        name: "Column Index",
        type: "number"
        ,
        show: false
    })
    getVar({
        useJetVersion: 4,
        length: 4,
        name: "Various"
        ,
        show: false
        //showas: "hex"
    })
    let ColFlags = getVar({
        useJetVersion: 4,
        length: 2,
        name: "Col Flags"
        ,
        show: false
        //showas: "hex"
    })
    let fixedLength = false
    if (ColFlags & 0x0001) {
        fixedLength = true
    }

    let canBeNull = false
    if (ColFlags & 0x0002) {
        canBeNull = true
    }

    let autonumber = false
    if (ColFlags & 0x0004 ) {
        autonumber = true
    }

    getVar({
        useJetVersion: 4,
        length: 4,
        name: "Unknown"
        ,
        show: false
    })
    let FixedOffset = getVar({
        length: 2,
        name: "Fixed offset",
        type: "number"
        ,
        show: false
    })
    let colDataLen = getVar({
        length: 2,
        name: "Length",
        type: "number"
        ,
        show: false
    })
    newColumn.length = colDataLen
    newColumn.FixedOffset = FixedOffset
    newColumn.ColumnIndex = ColumnIndex
    newColumn.VariableColumnNumber = VariableColumnNumber
    newColumn.ColID = ColID
    newColumn.fixedLength = fixedLength
    newColumn.canBeNull = canBeNull
    newColumn.autonumber = autonumber
}
console.log(" ")
console.log(" ")
console.log(" ")
for (var x=0; x< colCount; x++) {
    let colLen = getVar({
        length: 2,
        name: "col length",
        type: "number"
        ,
        show: false
    })
    let colname = getVar({
        length: colLen,
        name: "col name"
        ,type: "string",
        show: false
    })


    //console.log("colname: " + colname)
    //console.log("columns[" + x + "]: " + columns[x])
    columnNames[colname] = columns[x]

}





for (var x=0; x< RealIndexCount; x++) {
    getVar({
        length: 4,
        name: "unknown",
        type: "number"
        ,
        show: false
    })
    getVar({
        length: 48,
        name: "unknown"
        ,
        show: false
    })
}
for (var x=0; x< indexCount; x++) {

    getVar({
        length: 28,
        name: "unknown"
        ,
        show: false
    })
}

for (var x=0; x< indexCount; x++) {
    let colLen = getVar({
        length: 2,
        name: "index length",
        type: "number"
        ,
        show: false
    })
    getVar({
        length: colLen,
        name: "index name"
        ,
        show: false
    })
}






let col_num = getVar({
    length: 2,
    name: "col_num",
    type: "number"
    , show: false
})
let used_pages = getVar({
    length: 4,
    name: "used_pages",
    type: "number"
    , show: false
})
let free_pages = getVar({
    length: 4,
    name: "free_pages",
    type: "number"
    , show: false
})
 while (col_num != 0xffff  ) {
      col_num = getVar({
         length: 2,
         name: "col_num",
         type: "number"
         , show: false
     })
      used_pages = getVar({
         length: 4,
         name: "used_pages",
         type: "number"
         , show: false
     })
      free_pages = getVar({
         length: 4,
         name: "free_pages",
         type: "number"
         , show: false
     })
 }
 offset = offset +  4096

 let listOfColNames = Object.keys(columnNames)
 //console.log("listOfColNames: " + listOfColNames)
 for (var x=0; x < listOfColNames.length; x++) {
     let colName = listOfColNames[x]
     console.log(colName + ": " + JSON.stringify(columnNames[colName],null,2))
 }




console.log("")
console.log("")
console.log("")
console.log("")

console.log("total num Pages: " + numPages)

 for (var RowPageMapPage=0; RowPageMapPage < numPages; RowPageMapPage++){

      tempoffset = RowPageMapPage * 4096
     //let DataPageSignature = find(offset + 0, 2, "number")
     let DataPageSignature = getVar({
        length: 1,
        name: "DataPageSignature",
        type: "number",
        showas: "hex"
        , show: false
    })
    if (DataPageSignature != 0x01) {
        continue;
    }
    getVar({
       length: 1,
       name: "Unknown",
       type: "number"
    })

     getVar({
        length: 2,
        name: "Free Space",
        type: "number"
        , show: false
    })
    let tdef_pg = getVar({
       length: 3,
       name: "tdef_pg",
       type: "number"
       , show: false
    })
    let pgr = getVar({
       length: 1,
       name: "tdef_pg record",
       type: "number"
       , show: false
    })
    //console.log( "tdef_pg: " + tdef_pg)
    let skip = false
    if (tdef_pg != 120) {
        if (!skip){
        continue;
    }
    }
    console.log("")
    console.log("")
    console.log("")
    console.log("----------------------------------------------------------------------------------------------------------------")
    console.log("------                                    TABLE DATA  for page              " + RowPageMapPage)
    console.log("----------------------------------------------------------------------------------------------------------------")
    console.log( "dataOffset: " + tempoffset)
    console.log( "tdef_pg: " + tdef_pg)
    console.log( "tdef_pg record: " + pgr)
//continue;
if (skip){
    continue

}



    getVar({
       length: 4,
       name: "Unknown",
       type: "number"
       , show: true
    })
    let RecordCount = getVar({
       length: 2,
       name: "Record Count",
       type: "number"
       , show: true
    })

    let dataRecordOffsets = []
    for (var x=0; x< RecordCount; x++) {
        let RecordOffset = getVar({
           length: 2,
           name: "Record Offset",
           type: "number"
        })
        if (RecordOffset & 0x4000) {
            console.log("lookupflag record:")
        } else if (RecordOffset & 0x8000) {
            console.log("Deleted record:")
        } else {
            dataRecordOffsets.push(RecordOffset)
        }
    }
    console.log("")

    let dataOffset = RowPageMapPage * 4096//(RowPageMapPage * 4096) //+ (2 * RecordCount)
    for (var x=0; x< dataRecordOffsets.length; x++) {
        tempoffset = dataOffset + dataRecordOffsets[x]

        let rty=tempoffset
        //console.log(tempoffset)
        let numCols = getVar({
           length: 2,
           name: "Num cols",
           type: "number"
        })
        console.log(dataOffset + " + " + dataRecordOffsets[x] + " = " +  rty + ", "+ numCols + " cols")
    }
}



}




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
}
//doStuff()

function getListOfTableDefPages() {
    let listOfTableDefPages = {}
    for (let currentPage = 0 ; currentPage < numPages; currentPage++){
        tempoffset = 4096 * currentPage
        let PageSignature = getVar({
              length: 1,
              name: "Page Type",
              type: "number"
           })
        if (PageSignature == 0x01) {
           getVar({
              length: 1,
              name: "Unknown",
              type: "number"
           })

            getVar({
               length: 2,
               name: "Free Space",
               type: "number"
           })
           let tdef_pg = getVar({
              length: 3,
              name: "tdef_pg",
              type: "number"
           })

           if (tdef_pg < 2) {

           } else if (tdef_pg > 10000) {

           } else if (!listOfTableDefPages[tdef_pg]) {
               listOfTableDefPages[tdef_pg] = {
                   pages: [currentPage]
               }

           } else {
               listOfTableDefPages[tdef_pg].pages.push(currentPage)
           }
        }
    }
    return listOfTableDefPages
}





function showTableDefinitionForPage(pageNum) {
    tempoffset = 4096 * pageNum
    console.log("")
    console.log("")
    console.log("")
    console.log("----------------------------------------------------------------------------------------------------------------")
    console.log("------                                    TABLE DEFNS PAGE HEADER                                     ----------")
    console.log("------                                    offset: " + tempoffset + "                               ")
    console.log("----------------------------------------------------------------------------------------------------------------")

    PageSignature = find(tempoffset, 2, "number")
    VC = find(tempoffset + 2, 2, "number")
    NextPage = find(tempoffset + 4, 4, "number")


    show("Page Signature", PageSignature, "hex")
    show("VC", VC)
    show("NextPage", NextPage)

    tempoffset = offset + 8

}





let ty = getListOfTableDefPages()
let listDefns = Object.keys(ty)
for (let currentTableDefn = 0 ; currentTableDefn < listDefns.length ; currentTableDefn++){
    let defnPage = listDefns[currentTableDefn]
    console.log("Data defn: " + defnPage + " = " + JSON.stringify(ty[defnPage]))
}

showTableDefinitionForPage(2)
