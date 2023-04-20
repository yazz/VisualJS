//2,4, 5, 18, 42
let defnPage =2

let headerJetVersion = 4
var fs = require("fs");
let showDebug = false
let dbFileName = process.argv[2]

console.log("importing MDB: " + dbFileName )

var offset = 0
var tempoffset


var stats = fs.statSync(dbFileName)
var fileSizeInBytes = stats["size"]
let numPages = (fileSizeInBytes / 4096) + 1

console.log("fileSizeInBytes: " + fileSizeInBytes )
console.log("")
console.log("")

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
        if (showDebug){
            show(params.name, retvalue, params.showas)
        }
    }
    tempoffset = tempoffset + params.length
    if (params.type == "string") {
        retvalue = retvalue.toString()
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





function getTableDefinitionForPage(listOfTableDefPages, pageNum) {
    tempoffset = 4096 * pageNum
    if (showDebug){
        console.log("")
        console.log("")
        console.log("")
        console.log("----------------------------------------------------------------------------------------------------------------")
        console.log("------                                    TABLE DEFNS PAGE HEADER                                     ----------")
        console.log("------                                    offset: " + tempoffset + "                               ")
        console.log("----------------------------------------------------------------------------------------------------------------")
    }


    PageSignature = find(tempoffset, 2, "number")
    listOfTableDefPages[pageNum].PageSignature = PageSignature
    VC = find(tempoffset + 2, 2, "number")
    listOfTableDefPages[pageNum].VC = VC
    NextPage = find(tempoffset + 4, 4, "number")
    listOfTableDefPages[pageNum].NextPage = NextPage


    if (showDebug){
        show("Page Signature", PageSignature, "hex")
        show("VC", VC)
        show("NextPage", NextPage)
    }

    tempoffset = tempoffset + 8


    let TableDefinitionLength = find(tempoffset, 4, "number")
    listOfTableDefPages[pageNum].TableDefinitionLength = TableDefinitionLength
    if (showDebug){
        show("Table Definition Length", TableDefinitionLength)
    }

    let Numberofrows = find(tempoffset + 8, 4, "number")
    listOfTableDefPages[pageNum].Numberofrows = Numberofrows
    if (showDebug){
        show("Number of rows", Numberofrows)
    }

    tempoffset = tempoffset + 12
    let Autonumber = find(tempoffset, 4, "number")
    listOfTableDefPages[pageNum].Autonumber = Autonumber
    if (showDebug){
        show("Autonumber", Autonumber)
    }



    tempoffset = tempoffset + 4

    let AutonumberIncrement = getVar({
        useJetVersion: 4,
        length: 4,
        name: "Autonumber Increment",
        type: "number"
    })
    listOfTableDefPages[pageNum].Autonumber = Autonumber


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

    let Flags = getVar({
        length: 1,
        name: "Table Type / Flags?",
        type: "number",
        showas: "hex"
    })
    listOfTableDefPages[pageNum].Flags = Flags


    let NextColumnId = getVar({
        length: 2,
        name: "Next Column Id",
        type: "number"
    })
    listOfTableDefPages[pageNum].NextColumnId = NextColumnId


    let VariableColumns = getVar({
        length: 2,
        name: "Variable columns",
        type: "number"
    })
    listOfTableDefPages[pageNum].__VariableColumns = VariableColumns


    let colCount = getVar({
        length: 2,
        name: "Column Count",
        type: "number",
        show: true
    })
    listOfTableDefPages[pageNum].__colCount = colCount


    let indexCount = getVar({
        length: 4,
        name: "Index Count",
        type: "number"
    })
    listOfTableDefPages[pageNum].indexCount = indexCount

    let RealIndexCount = getVar({
        length: 4,
        name: "Real Index Count",
        type: "number"
    })
    listOfTableDefPages[pageNum].RealIndexCount = RealIndexCount

    let RowPageMapRecord = getVar({
        length: 1,
        name: "Row Page Map record",
        type: "number",
        show: true
    })
    listOfTableDefPages[pageNum].RowPageMapRecord = RowPageMapRecord

    var RowPageMapPage = getVar({
        length: 3,
        name: "Row Page Map Page",
        type: "number",
        show: true
    })
    listOfTableDefPages[pageNum].RowPageMapPage = RowPageMapPage

    let FreeSpacePageMapRecord = getVar({
        length: 1,
        name: "Free Space Page Map Record",
        type: "number",
        show: true
    })
    listOfTableDefPages[pageNum].FreeSpacePageMapRecord = FreeSpacePageMapRecord

    let FreeSpacePageMapPage = getVar({
        length: 3,
        name: "Free Space Page Map Page",
        type: "number",
        show: true
    })
    listOfTableDefPages[pageNum].FreeSpacePageMapPage = FreeSpacePageMapPage

    //
    // skip indexes
    // for every real index :
    //
    // Unknown A1	4 bytes	???
    // Index Row Count	4 bytes	UINT 32 LE	Unknown
    // Unknown A2	4 bytes	???	Jet 4 only, always 0
    //
    tempoffset = tempoffset + (12 * RealIndexCount)



    let columns = {}
    let columnNames = {}

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
        if (ColFlags[0] & 0x01) {
            fixedLength = true
        }

        let canBeNull = false
        if (ColFlags[0] & 0x02) {
            canBeNull = true
        }

        let autonumber = false
        if (ColFlags[0] & 0x04 ) {
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
        newColumn.ColID = ColID
        newColumn.length = colDataLen
        newColumn.FixedOffset = FixedOffset
        newColumn.ColumnIndex = ColumnIndex
        newColumn.VariableColumnNumber = VariableColumnNumber
        newColumn.fixedLength = fixedLength
        newColumn.canBeNull = canBeNull
        newColumn.autonumber = autonumber
        newColumn.ColFlags = "0x" + ColFlags[1].toString(16) + ":0x" + ColFlags[0].toString(16)
    }
    console.log(" ")
    console.log(" ")
    console.log(" ")

    listOfTableDefPages[pageNum].colsInOrder = {}
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
        })

        let tttt=toUTF8Array(colname)


        //console.log("colname: " + colname)
        //console.log("columns[" + x + "]: " + columns[x])

        columns[x].name =  tttt
        columnNames[tttt] = columns[x]
        listOfTableDefPages[pageNum].colsInOrder[x] = columns[x]
    }
    listOfTableDefPages[pageNum].columnNames = columnNames



    //
    //
    //

    console.log("...............")
    console.log("")
    tempoffset = (RowPageMapPage * 4096) + (64 * RowPageMapRecord)//(RowPageMapPage * 4096) //+ (2 * RecordCount)
    console.log("RowPageMapPage: " + RowPageMapPage)
    console.log("RowPageMapRecord: " + RowPageMapRecord)
    console.log("offset: " + tempoffset)

    let mapType = getVar({
        length: 1,
        name: "mapType",
        type: "number"
    })

    console.log("mapType: " + mapType)

    for (let rt=0;rt<17;rt++) {

        var PageUsageMapRecord = getVar({
            length: 0,
            name: "Page Usage Map Record",
            type: "number",
            show: true
        })

        var PageUsageMapPage = getVar({
            length: 4,
            name: "Page Usage Map Page",
            type: "number",
            show: true
        })
        console.log("PageUsageMapPage: " + PageUsageMapPage + ":" + PageUsageMapRecord)


    }

    console.log("")
    console.log("...............")

}





function toUTF8Array(input) {
    let s=""
    for (let x=0;x<input.length;x=x+2){
        s=s + String.fromCharCode(input[x])
    }
    return s
}



function getDataForTableOnPage(pageNum, pageDefns) {
    showDebug=true
    if (showDebug){
        console.log("")
        console.log("")
        console.log("")
        console.log("----------------------------------------------------------------------------------------------------------------")
        console.log("------                                    DATA FOR TABLE                                    ")
        console.log("------                                    page: " + pageNum + "                               ")
        console.log("----------------------------------------------------------------------------------------------------------------")
    }

    let listOfPages = pageDefns[pageNum]



    console.log("Table defn: " + pageNum + " has data pages " + JSON.stringify(listOfPages.pages,null,2))

    for (let dataOffset = 0;dataOffset< listOfPages.pages.length;dataOffset++) {
        console.log("")
        console.log("")
        //console.log("dataOffset: " + dataOffset )
        let dataPageNum = listOfPages.pages[dataOffset]
        console.log( "                           /------------------------------\\")
        console.log( "                           | data page: " + dataPageNum )
        console.log( "                           \\------------------------------/")
        console.log( "")
        tempoffset = 4096 * dataPageNum



        let DataPageSignature = getVar({
           length: 1,
           name: "DataPageSignature",
           type: "number",
           showas: "hex"
           , show: false})

        getVar({
           length: 1,
           name: "Unknown",
           type: "number"
           , show: false
        })

        let FreeSpace = getVar({
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
        let Owner = getVar({
           length: 4,
           name: "Unknown",
           type: "number"
           , show: false
        })
        let RecordCount = getVar({
           length: 2,
           name: "RecordCount",
           type: "number"
        })
        let NullFieldBitmapLength = Math.floor((pageDefns[pageNum].__colCount + 7) / 8)


        let offsetList = []
        let lastEnd = (4096 * dataPageNum) + 4096 - 1
        for (let recIndex = 0 ; recIndex < RecordCount; recIndex++) {
            let RawRecordOffset = getVar({
               length: 2,
               name: "RecordOffset",
               type: "number"
            })
            let newRecordMetaData = {
                RawRecordOffset:    RawRecordOffset
                ,
                valid:              true
            }
            if (RawRecordOffset == 0) {
                newRecordMetaData.valid = false

            } else if (RawRecordOffset & 0x4000) {
                newRecordMetaData.valid = false
                newRecordMetaData.overflow = true
                newRecordMetaData.RealOffset = RawRecordOffset - 0x4000

            } else if (RawRecordOffset & 0x8000) {
                newRecordMetaData.deleted = true
                newRecordMetaData.valid = false
                newRecordMetaData.RealOffset = RawRecordOffset - 0x8000
            } else {
                newRecordMetaData.RealOffset = RawRecordOffset

            }
            newRecordMetaData.start = (4096 * dataPageNum) + newRecordMetaData.RealOffset
            newRecordMetaData.end = lastEnd
            newRecordMetaData.length = (newRecordMetaData.end - newRecordMetaData.start) + 1
            lastEnd = newRecordMetaData.start - 1


            offsetList.push( newRecordMetaData )

            //console.log("Record: " + recIndex + ": " + JSON.stringify(newRecordMetaData,null,2))

        }



        let NumCols = Object.keys(pageDefns[pageNum].colsInOrder).length
        //console.log(pageDefns[pageNum].colsInOrder)
        let numFixed = pageDefns[pageNum].__colCount - pageDefns[pageNum].__VariableColumns
        console.log("                           " +
            numFixed + " Fixed + " + pageDefns[pageNum].__VariableColumns + " Variable  = " + pageDefns[pageNum].__colCount + " cols")
        let fixedCount = 0
        console.log("                           RecordCount: " + RecordCount)
        console.log("                           FreeSpace: " + FreeSpace)
        console.log("                           Table defn page: " + tdef_pg)
        console.log("                           Owner: " + Owner)
        console.log("")
        console.log("")
        console.log("")
        console.log("")
        console.log("")
        console.log("")

        for (let rc = 0;rc < RecordCount; rc ++) {
            console.log("RecordID: " + rc)
            if (offsetList[rc].valid) {
                console.log( offsetList[rc].RealOffset + " - " + (offsetList[rc].RealOffset + offsetList[rc].length - 1))
                tempoffset = offsetList[rc].start
                let NumCols = getVar({
                    length: 2,
                    name: "NumCols",
                    type: "number"
                })
                console.log("NumCols: " + NumCols)

                console.log("Fixed col data:")
                console.log("------")
                //for (let rowIndex=0;rowIndex < RowCount; rowIndex++){
                    for (let yy=0;yy < pageDefns[pageNum].__colCount; yy++){
                        if (pageDefns[pageNum].colsInOrder[yy].fixedLength) {
                            //console.log("Fixed col: " + pageDefns[pageNum].colsInOrder[yy].name + " = " + pageDefns[pageNum].colsInOrder[yy].length + " bytes")
                            let colVal = getVar({
                               length: pageDefns[pageNum].colsInOrder[yy].length,
                               name: pageDefns[pageNum].colsInOrder[yy].name,
                               type: "number"
                               , show: true
                            })
                        }
                    }

                    console.log("")

                    console.log("NullFieldBitmapLength: " + NullFieldBitmapLength)
                    tempoffset = offsetList[rc].end - NullFieldBitmapLength - 1
                    let lastOffset = tempoffset
                    let VariableLengthFieldCount = getVar({
                       length: 2,
                       name: "VariableLengthFieldCount",
                       type: "number"
                    })
                    console.log("VariableLengthFieldCount:" + VariableLengthFieldCount)

                    console.log("")
                    console.log("")
                    console.log("")


                    let listOfOffsets = []
                    let listOfOffsetsRaw = []
                    let endRec = lastOffset
                    for (let varIndex=0; varIndex < VariableLengthFieldCount;varIndex++){

                        tempoffset = lastOffset - 2
                        lastOffset = tempoffset
                        let VariableLengthFieldOffset = getVar({
                           length: 2,
                           name: "VariableLengthFieldOffset",
                           type: "number"
                        })
                        listOfOffsetsRaw.push(VariableLengthFieldOffset)
                        if ((varIndex == 0 ) || (listOfOffsetsRaw[varIndex] != listOfOffsetsRaw[varIndex - 1])) {
                            listOfOffsets.push({relative_offset: VariableLengthFieldOffset,
                                                start: offsetList[rc].start + VariableLengthFieldOffset})
                            console.log("VariableLengthFieldOffset:" + VariableLengthFieldOffset)
                        }
                    }
                    for (let varIndex=0; varIndex < listOfOffsets.length;varIndex++) {

                        if (varIndex == (listOfOffsets.length - 1) ) {
                            let varColData = listOfOffsets[ varIndex ]
                            varColData.length = 2
                            varColData.end = varColData.start + 2
                        } else {
                            let varColData = listOfOffsets[ varIndex ]
                            let nextColData = listOfOffsets[ varIndex + 1 ]
                            varColData.length = nextColData.relative_offset - varColData.relative_offset
                            varColData.end = nextColData.start - 1
                        }

                    }
                    console.log("Variable fields:" + JSON.stringify(listOfOffsets,null,2))

                    for (let i=0;i<20;i++){
                        tempoffset = lastOffset - 2
                        lastOffset = tempoffset
                        let Eod = getVar({
                           length: 2,
                           name: "Eod",
                           type: "number"
                        })
                        console.log("Eod:" + Eod)
                    }
                    console.log("")
            //}

                for (let varIndex=0; varIndex < listOfOffsets.length;varIndex++){

                    tempoffset = listOfOffsets[varIndex].start
                    if (listOfOffsets[varIndex].length  == 2) {
                        let VariableLengthFieldOffset = getVar({
                           length: listOfOffsets[varIndex].length ,
                           name: "VariableLengthFieldOffset",
                           type: "number"
                        })
                        //console.log("Val:" + toUTF8Array(VariableLengthFieldOffset))
                        console.log("Val:" + VariableLengthFieldOffset)

                    } else {
                        let VariableLengthFieldOffset = getVar({
                           length: listOfOffsets[varIndex].length ,
                           name: "VariableLengthFieldOffset"
                        })
                        //console.log("Val:" + toUTF8Array(VariableLengthFieldOffset))
                        console.log("Val:" + VariableLengthFieldOffset)
                    }
                }

            }

            console.log("")
            console.log("")
            console.log("")
            console.log("")
            console.log("")
            console.log("")
        }
        console.log("")
        console.log("")


    }
}














//
//
//
// do stuff with the functions
//
//
//
//
let ty = getListOfTableDefPages()

let listDefns = Object.keys(ty)
//for (let currentTableDefn = 0 ; currentTableDefn < listDefns.length ; currentTableDefn++){
    //let defnPage = listDefns[currentTableDefn]
    console.log("------------------------------------------------------------------------------------------")
    getTableDefinitionForPage(ty,defnPage)
    console.log("Table defn: " + defnPage + " = " + JSON.stringify(ty[defnPage],null,2))
    console.log("")
    console.log("")
    console.log("")
//}









console.log("")
console.log("")
console.log("")
console.log("")




let data = getDataForTableOnPage(defnPage,ty)
//let data = getDataForTableOnPage(42,ty)




console.log("")
console.log("")
console.log("")
console.log("")

console.log("")
console.log("")
console.log("")
console.log("")



function findTypeOfPage(pageType) {
    for (let currentPage = 0 ; currentPage < numPages; currentPage++){
        tempoffset = 4096 * currentPage
        let PageSignature = getVar({
              length: 1,
              name: "Page Type",
              type: "number"
           })
        if (PageSignature == pageType) {
           console.log(currentPage)
       }
    }
}


//findTypeOfPage(1)




var noaccess = require("@yazz/noaccess");

let rtv =noaccess.printMsg()
console.log("rtv: " + JSON.stringify(rtv,null,2))
