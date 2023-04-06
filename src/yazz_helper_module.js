const OnlyIpfsHash = require("ipfs-only-hash");
const path = require("path");
let sqlite3                     = require('sqlite3');
let stmtInsertNewCode
let stmtInsertIntoCodeTags
let uuidv1          = require('uuid/v1');
let stmtDeleteDependencies
let stmtDeleteTypesForComponentProperty
let stmtDeleteAcceptTypesForComponentProperty

let stmtInsertTypesForComponentProperty;
let stmtUpdateCommitForCodeTag;
let stmtInsertAcceptTypesForComponentProperty;
let stmtInsertDependency
let fs = require('fs');

let stmtInsertAppDDLRevision;
let stmtUpdateLatestAppDDLRevision;
let copyMigration;




module.exports = {
    //setup this module
    setup:                          async function(thisDb) {
        stmtInsertNewCode = thisDb.prepare(
            `insert into
                 system_code  
                     (id, parent_id, code, base_component_id, 
                      display_name, creation_timestamp, 
                      logo_url, visibility,use_db, editors, read_write_status,properties, 
                      component_type, edit_file_path, 
                      code_changes, num_changes, fk_user_id, score, score_reason) 
              values 
                (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`);


        stmtInsertIntoCodeTags = thisDb.prepare(`insert or ignore
                                                    into
                                               code_tags
                                                    (id,   base_component_id,   code_tag,   fk_system_code_id,   fk_user_id) 
                                               values ( ?, ?, ?, ?, ?)`)

        stmtDeleteDependencies = thisDb.prepare(" delete from  app_dependencies   where   code_id = ?");

        stmtDeleteTypesForComponentProperty = thisDb.prepare(" delete from  component_property_types   where   base_component_id = ?");

        stmtDeleteAcceptTypesForComponentProperty = thisDb.prepare(" delete from  component_property_accept_types   where   base_component_id = ?");


        //select name from (select distinct(name) ,count(name) cn from test  where value in (1,2,3)  group by name) where cn = 3
        stmtInsertTypesForComponentProperty = thisDb.prepare(`insert or ignore
                                                    into
                                               component_property_types
                                                    (base_component_id, property_name , outputs_type )
                                               values ( ?,?,? )`)

        stmtUpdateCommitForCodeTag = thisDb.prepare(`update
                                                       code_tags
                                                            set  fk_system_code_id = ?
                                                       where
                                                            base_component_id = ? and code_tag = ? and fk_user_id = ?
                                               `)

        stmtInsertAcceptTypesForComponentProperty = thisDb.prepare(`insert or ignore
                                                    into
                                               component_property_accept_types
                                                    (  base_component_id, property_name , accept_type  )
                                               values ( ?,?,? )`)


        stmtInsertDependency = thisDb.prepare(" insert or replace into app_dependencies " +
            "    (id,  code_id, dependency_type, dependency_name, dependency_version ) " +
            " values " +
            "    (?, ?, ?, ?, ? );");




        stmtInsertAppDDLRevision = thisDb.prepare(  " insert into app_db_latest_ddl_revisions " +
            "      ( base_component_id,  latest_revision  ) " +
            " values " +
            "      ( ?,  ? );");

        stmtUpdateLatestAppDDLRevision = thisDb.prepare(  " update  app_db_latest_ddl_revisions  " +
            "     set  latest_revision = ? " +
            " where " +
            "     base_component_id =  ? ;");

        copyMigration = thisDb.prepare(
            `                insert into  app_db_latest_ddl_revisions
                       (base_component_id,latest_revision)
                    select ?,  latest_revision from app_db_latest_ddl_revisions
                     where base_component_id=?

    `
        );
},

    //manipulate code meta data
    insertCodeString:               function(code,st, vall ,optionalEnd) {
    let endIndicator = ")"
    if (optionalEnd) {
    endIndicator = optionalEnd
    }
    let findd = st + "("
    let startIndexOfComment = code.toString().indexOf("/*")
    let startIndexOfFn = code.toString().indexOf("{")

    if (startIndexOfFn != -1) {
    if (startIndexOfComment == -1) {
    code = code.toString().substring(0,startIndexOfFn + 1) + "\n/*\n*/\n" +
        code.toString().substring(startIndexOfFn + 1)
    startIndexOfComment = code.toString().indexOf("/*")
    }
    code = code.toString().substring(0,startIndexOfComment + 3) +
                "" + st + "(" + JSON.stringify(vall,null,2).replace(new RegExp("\\*\\/", 'g'), "*\\/") + endIndicator + "\n" +
                code.toString().substring(startIndexOfComment + 3)

    }

    return code

    },
    deleteCodeString:               function(code,st ,optionalEnd) {
let endIndicator = ")"
if (optionalEnd) {
endIndicator = optionalEnd
}
let findd = st + "("
let codeStart = code.toString().indexOf(findd)
if (codeStart != -1) {
let codeEnd = codeStart + code.toString().substring(codeStart).indexOf(endIndicator)

code = code.toString().substring(0,codeStart) +
            code.toString().substring(codeEnd + 1 + endIndicator.length)

return code
}
return code
},
    getValueOfCodeString:           function(code, st,optionalEnd) {
        let endIndicator = ")"
        if (optionalEnd) {
            endIndicator = optionalEnd
        }
        let toFind = st + "("
        if (code.toString().indexOf(toFind) != -1) {
            let codeStart = code.toString().indexOf(toFind) + toFind.length
            let codeEnd = codeStart + code.toString().substring(codeStart).indexOf(endIndicator)

            code = code.toString().substring(codeStart, codeEnd)
            let val = eval( "(" + code.toString() + ")")
            return val

            }
            return null
    },

    //text retreival and replacement
    replaceBetween:                 function(target, start, end, replaceWith) {
                                        let startIndex = target.indexOf(start) + start.length
                                        let endIndex = target.indexOf(end)
                                        let newString = target.substring(0,startIndex) + replaceWith + target.substring(endIndex);
                                        return newString
    },
    getBetween:                     function(target, start, end) {
        let startIndex = target.indexOf(start) + start.length
        let endIndex = target.indexOf(end)
        let newString = target.substring(startIndex,endIndex)
        return newString
    },
    replacePropertyValue:           function(code, propertyId, propertyValue) {
      let properties = this.getValueOfCodeString(code,"properties",")//prope" + "rties")
      if (properties) {
          let index =0;
          for (let i=0; i < properties.length; i++) {
            let property = properties[i]
            if (property.id == propertyId) {
                property.default = propertyValue
                break;
            }
          }

          code = this.deleteCodeString(  code, "properties", ")//prope" + "rties")

          code = this.insertCodeString(    code,
                                                     "properties",
                                                      properties,
                                                     ")//prope" + "rties")
      }
      return code
    },

    //manipulate components
    addProperty:                    function(code, newProperty) {
        let properties = this.getValueOfCodeString(code,"properties",")//prope" + "rties")
        if (properties) {
            properties.push(newProperty)

            code = this.deleteCodeString(  code, "properties", ")//prope" + "rties")

            code = this.insertCodeString(    code,
                "properties",
                properties,
                ")//prope" + "rties")
        }
        return code
    },
    addMethod:                      function(code, newMethod) {
         let existingCode = this.getBetween(
             code,
             "/*NEW_METHODS_START*/",
             "/*NEW_METHODS_END*/")

        code = this.replaceBetween(
                        code,
                        "/*NEW_METHODS_START*/",
                        "/*NEW_METHODS_END*/",
            existingCode + newMethod)

        return code
    },
    getChildDetails:                async function(subComponent) {
        let newSubComponent = {
            baseComponentId: subComponent,
            codeId:          subComponent
        }
        return newSubComponent
    },
    getSubComponents:               async function (srcCode) {
        let yz = this

        let subC = yz.getValueOfCodeString(srcCode,"sub_components")
        if (!subC) {
            return []
        }
        let retRes = []
        for (let subComponent  of  subC) {
            if (typeof subComponent === 'string' || subComponent instanceof String) {
                retRes.push({child_base_component_id: subComponent})
            } else {
                retRes.push(subComponent)
            }
        }
        return retRes
    },

    //general JS helpers
    isValidObject:                  function (variable){
        if ((typeof variable !== 'undefined') && (variable != null)) {
            return true
        }
        return false
    },

    //Internal SQLite DB helpers
    getQuickSqlOneRow:              async function (thisDb, sql ,params) {
        let rows = await this.getQuickSql(thisDb,sql,params)
        if (rows.length == 0) {
            return null
        }
        return rows[0]
    },
    getQuickSql:                    async function (thisDb, sql, params) {
        let promise = new Promise(async function(returnfn) {
            thisDb.serialize(
                function() {
                    thisDb.all(
                        sql
                        ,
                        params
                        ,
                        async function(err, rows) {
                            if (!err) {
                                returnfn( rows )
                            } else {
                                throw( {error: err} )
                            }
                        }
                    );
                }, sqlite3.OPEN_READONLY)
        })
        let ret = await promise
        return ret
    },
    executeQuickSql:                async function (thisDb, sql, params) {
        let promise = new Promise(async function(returnfn) {
            try {
                let exeSqlPreparedStmt = thisDb.prepare(sql)
                thisDb.serialize(function () {
                    thisDb.run("begin exclusive transaction");
                    thisDb.run("commit", function () {
                        thisDb.serialize(function () {
                            thisDb.run("begin exclusive transaction");
                            exeSqlPreparedStmt.run(params)
                            thisDb.run("commit")
                            returnfn(11)
                        })
                    })
                })
            } catch (err) {
            }
        })
        let ret = await promise
        return ret
    },

    //code commit helpers
    tagVersion:                     async function (thisDb, ipfs_hash, srcCode ) {
        let baseComponentId = this.getValueOfCodeString(srcCode,"base_component_id")
        let dateTime = new Date().toString()
        await this.executeQuickSql(thisDb,
            `insert into 
            code_tags 
         (id , base_component_id , code_tag , fk_system_code_id)
            values
         (?,?,?,?) 
         `
            ,
            [ uuidv1()  ,  baseComponentId  ,  dateTime,  ipfs_hash])
    },
    getCodeForCommit:               async function (thisDb, commitId) {
        let thisCommit = await this.getQuickSqlOneRow(thisDb,  "select  *  from   system_code  where   id = ? ", [  commitId  ])
        if (thisCommit) {
            return thisCommit.code
        }

        return null
    },
    saveItemToIpfsCache:            async function (srcCode) {
        //outputDebug("*** saveItemToIpfs: *** : " )
        let promise = new Promise(async function(returnfn) {
            let justHash = null
            try {
                //console.log("Starting...")

                justHash = await OnlyIpfsHash.of(srcCode)
                let fullIpfsFilePath = path.join(fullIpfsFolderPath,  justHash)
                fs.writeFileSync(fullIpfsFilePath, srcCode);
                await insertIpfsHashRecord(justHash,null,null,null)
                await sendIpfsHashToCentralServer(justHash, srcCode)


                if (isIPFSConnected) {
                    let testBuffer = new Buffer(srcCode);
                    ipfs.files.add(testBuffer, function (err, file) {
                        if (err) {
                            console.log("....................................Err: " + err);
                        }
                        console.log("....................................file: " + JSON.stringify(file, null, 2))
                        let thehash = file[0].hash
                        //const validCID = "QmdQASbsK8bF5DWUxUJ5tBpJbnUVtKWTsYiK4vzXg5AXPf"
                        const validCID = thehash

                        ipfs.files.get(validCID, function (err, files) {
                            files.forEach((file) => {
                                console.log("....................................file.path: " + file.path)
                                console.log(file.content.toString('utf8'))
                                console.log("....................................file.path: " + file.path)
                                returnfn(thehash)
                            })
                        })
                    })
                } else {
                    returnfn(justHash)
                }

            } catch (error) {
                //outputDebug(error)
                returnfn(justHash)
            }
        })
        let ipfsHash = await promise
        return ipfsHash
    },
    updateRevisions:                function (thisDb,sqlite, baseComponentId) {
        //------------------------------------------------------------------------------
        //
        //
        //
        //
        //
        //------------------------------------------------------------------------------
        //console.log("updateRevisions    ")
        let mm = this
        try {

            thisDb.serialize(
                function() {
                    thisDb.all(
                        "SELECT  *  from  app_db_latest_ddl_revisions  where  base_component_id = ? ; "
                        ,
                        baseComponentId
                        ,

                        function(err, results)
                        {
                            let latestRevision = null
                            if (results.length > 0) {
                                latestRevision = results[0].latest_revision
                            }
                            let dbPath = path.join(mm.userData, 'app_dbs/' + baseComponentId + '.visi')
                            let appDb = new sqlite3.Database(dbPath);
                            //appDb.run("PRAGMA journal_mode=WAL;")

                            appDb.serialize(
                                function() {
                                    try {
                                        appDb.run("begin exclusive transaction");
                                        let newLatestRev = null
                                        let readIn = false
                                        if (sqlite.migrations) {
                                            for (let i=0; i < sqlite.migrations.length; i++) {
                                                let sqlStKey = sqlite.migrations[i].name

                                                for (let j = 0  ;  j < sqlite.migrations[i].up.length  ;  j++ ) {
                                                    if ((latestRevision == null) || readIn) {
                                                        let sqlSt = sqlite.migrations[i].up[j]
                                                        //console.log("sqlSt: = " + sqlSt)
                                                        appDb.run(sqlSt);
                                                        newLatestRev = sqlStKey
                                                    }
                                                    if (latestRevision == sqlStKey) {
                                                        readIn = true
                                                    }
                                                }
                                            }

                                        }

                                        appDb.run("commit");
                                        //appDb.run("PRAGMA wal_checkpoint;")

                                        try {
                                            thisDb.serialize(function() {
                                                thisDb.run("begin exclusive transaction");
                                                if (results.length == 0) {
                                                    stmtInsertAppDDLRevision.run(baseComponentId, newLatestRev)
                                                } else {
                                                    if (newLatestRev) {
                                                        stmtUpdateLatestAppDDLRevision.run(newLatestRev,baseComponentId)
                                                    }
                                                }
                                                thisDb.run("commit")
                                            })
                                        } catch(er) {
                                            console.log(er)
                                        }

                                    } catch(ewq) {
                                        console.log(ewq)
                                    }

                                })
                        })
                }
                ,
                sqlite3.OPEN_READONLY)
        } catch (ewr) {
            console.log(ewr)
        }
    },
    fastForwardToLatestRevision:    function (thisDb,sqlite, baseComponentId) {
        //------------------------------------------------------------------------------
        //
        //
        //
        //
        //
        //------------------------------------------------------------------------------
        //console.log("fastForwardToLatestRevision    ")
        try {

            thisDb.serialize(
                function() {
                    thisDb.all(
                        "SELECT  *  from  app_db_latest_ddl_revisions  where  base_component_id = ? ; "
                        ,
                        baseComponentId
                        ,

                        function(err, results)
                        {
                            let latestRevision = null
                            if (results.length > 0) {
                                latestRevision = results[0].latest_revision
                            }
                            let newLatestRev = null
                            let readIn = false
                            for (let i=0; i < sqlite.migrations.length; i+=2) {
                                let sqlStKey = sqlite.migrations[i].name

                                for (let j = 0  ;  j < sqlite.migrations[i].up.length  ;  j++ ) {
                                    if ((latestRevision == null) || readIn) {
                                        let sqlSt = sqlite.migrations[i].name
                                        newLatestRev = sqlStKey
                                    }
                                    if (latestRevision == sqlStKey) {
                                        readIn = true
                                    }
                                }
                            }

                            thisDb.serialize(function() {
                                thisDb.run("begin exclusive transaction");
                                if (results.length == 0) {
                                    stmtInsertAppDDLRevision.run(baseComponentId, newLatestRev)
                                } else {
                                    if (newLatestRev) {
                                        stmtUpdateLatestAppDDLRevision.run(newLatestRev,baseComponentId)
                                    }
                                }
                                thisDb.run("commit")
                            })


                        })
                }
                ,
                sqlite3.OPEN_READONLY)
        } catch (ewr) {
            console.log(ewr)
        }
    },

    //code save helpers
    copyFile:                       function (source, target, cb) {
        //------------------------------------------------------------------------------
        //
        //
        //
        //
        //
        //------------------------------------------------------------------------------
        let cbCalled = false;

        let rd = fs.createReadStream(source);
        rd.on("error", function(err) {
            done(err);
        });
        let wr = fs.createWriteStream(target);
        wr.on("error", function(err) {
            done(err);
        });
        wr.on("close", function(ex) {
            done();
        });
        rd.pipe(wr);

        function done(err) {
            if (!cbCalled) {
                cb(err);
                cbCalled = true;
            }
        }
    },
    getIpfsHash:                    async function(sometext) {
        let ipfsHash = await OnlyIpfsHash.of(sometext)
        return ipfsHash
    },
    saveCodeV3:                     async function ( thisDb, code , options) {
        // ********** setup **********
        let mm = this
        await mm.setup(thisDb)
        if (code) {
            code = code.toString()
        }



        // ********** get info from the code **********
        let properties          = mm.getValueOfCodeString(code,"properties",")//properties")
        let baseComponentId     = mm.getValueOfCodeString(code,"base_component_id")
        let parentHash          = mm.getValueOfCodeString(code,"parent_hash")
        let visibility          = mm.getValueOfCodeString(code,"visibility")
        let logoUrl             = mm.getValueOfCodeString(code,"logo_url")
        let updatedTimestamp    = mm.getValueOfCodeString(code, "updated_timestamp")
        let readOnly            = mm.getValueOfCodeString(code,"read_only")
        let displayName         = mm.getValueOfCodeString(code,"display_name")
        let useDb               = mm.getValueOfCodeString(code,"use_db")
        let editors2            = mm.getValueOfCodeString(code,"editors")
        let controlType         = mm.getValueOfCodeString(code,"component_type")
        let codeChanges         = mm.getValueOfCodeString(code,"code_changes",")//code_" + "changes")


        // set up local vars
        let editors                                 = null
        let readWriteStatus                         = null
        let codeChangesStr                          = null
        let numCodeChanges                          = null
        let sha1sum                                 = await OnlyIpfsHash.of(code)
        let userId                                  = null
        let propertiesAsJsonString                  = null
        let existingCodeTags                        = null
        let existingCodeAlreadyInSystemCodeTable

        let promise = new Promise(async function(returnFn) {


            // ********** check that the code is valid **********
            if (!baseComponentId) {
                returnFn( {
                    error:  "No base component ID specific"
                })
            }
            if (!code.toString().substring(0,20).includes("function")) {
                code =
                    `function() {${code}
                    }`
            }



            // ********** data to store in the internal sqlite database **********
            if (editors2) {
                editors = JSON.stringify(editors2,null,2)
            }
            if (readOnly) {
                readWriteStatus = "READ"
            }
            if (codeChanges) {
                codeChangesStr = JSON.stringify(codeChanges,null,2)
                numCodeChanges = codeChanges.length
            }
            if (properties) {
                propertiesAsJsonString = JSON.stringify(properties,null,2)
            }
            if (options) {
                save_code_to_file   = options.save_code_to_file
                userId              = options.userId
            }



            // ********** data to store in the internal sqlite database **********
            existingCodeTags = await mm.getQuickSqlOneRow(thisDb,"select * from code_tags where base_component_id = ? and fk_user_id = ? and code_tag='EDIT'  ",[baseComponentId, userId])
            existingCodeAlreadyInSystemCodeTable = await mm.getQuickSqlOneRow(
                thisDb,
                " select  " +
                "     id " +
                " from " +
                "     system_code " +
                " where " +
                "     id = ?;",
                [sha1sum])

            if ((existingCodeAlreadyInSystemCodeTable == null) || readOnly || (options && options.allowAppToWorkOffline)){
                try {

                    if (controlType == "VB") {
                        //showTimer(`7`)

                        ////showTimer("VB: " + baseComponentId)
                        stmtDeleteTypesForComponentProperty.run(baseComponentId)
                        stmtDeleteAcceptTypesForComponentProperty.run(baseComponentId)
                        if (properties) {
                            for (let rttte = 0; rttte < properties.length ; rttte++ ) {
                                let prop = properties[rttte]


                                if (prop.types) {
                                    let labelKeys = Object.keys(prop.types)
                                    for (let rttte2 = 0; rttte2 < labelKeys.length ; rttte2++ ) {
                                        stmtInsertTypesForComponentProperty.run(baseComponentId, prop.id, labelKeys[rttte2])

                                    }
                                }
                                //showTimer(`9`)
                                if (prop.accept_types) {
                                    let labelKeys = Object.keys(prop.accept_types)
                                    for (let rttte2 = 0; rttte2 < labelKeys.length ; rttte2++ ) {
                                        stmtInsertAcceptTypesForComponentProperty.run(
                                            baseComponentId,
                                            prop.id,
                                            labelKeys[rttte2])

                                    }
                                }
                            }
                        }

                    }






                    ////showTimer("Saving in Sqlite: " + parentHash)
                    ////showTimer("Saving in Sqlite: " + code)
                    let save_code_to_file = null
                    //showTimer(`10`)
                    let sha1sum2  = await OnlyIpfsHash.of(code)
                    if (sha1sum2 != sha1sum) {
                        console.log("SHA do not match")
                    }

                    thisDb.serialize(async function() {
                        thisDb.run("begin exclusive transaction");
                        stmtInsertNewCode.run(
                            sha1sum,
                            parentHash,
                            code,
                            baseComponentId,
                            displayName,
                            updatedTimestamp,
                            logoUrl,
                            visibility,
                            useDb,
                            editors,
                            readWriteStatus,
                            propertiesAsJsonString,
                            controlType,
                            save_code_to_file,
                            codeChangesStr,
                            numCodeChanges,
                            userId,
                            1,
                            "1 point for being committed"
                        )


                        if (existingCodeTags) {
                            stmtUpdateCommitForCodeTag.run(
                                sha1sum
                                ,
                                baseComponentId
                                ,
                                "EDIT"
                                ,
                                userId
                            )
                        } else {
                            stmtInsertIntoCodeTags.run(
                                uuidv1()
                                ,
                                baseComponentId
                                ,
                                "EDIT"
                                ,
                                sha1sum
                                ,
                                userId
                            )
                        }




                        stmtDeleteDependencies.run(sha1sum)

                        let scriptCode = ""
                        //showTimer(`11`)
                        let jsLibs = mm.getValueOfCodeString(code, "uses_javascript_libraries")
                        if (jsLibs) {
                            ////showTimer(JSON.stringify(jsLibs,null,2))
                            for (let tt = 0; tt < jsLibs.length ; tt++) {
                                scriptCode += `GLOBALS.libLoaded[ "${jsLibs[tt]}" ] = true;
                              `
                                stmtInsertDependency.run(
                                    uuidv1(),
                                    sha1sum,
                                    "js_browser_lib",
                                    jsLibs[tt],
                                    "latest")

                                if ( jsLibs[tt] == "advanced_bundle" ) {
                                    //scriptCode += fs.readFileSync( path.join(__dirname, '../public/js_libs/advanced_js_bundle.js') )
                                    scriptCode += `
                                `
                                }


                            }
                        }

                        let sqliteCode = ""
                        thisDb.run("commit", async function() {

                        });
                        let checkIpfsHash = await mm.saveItemToIpfsCache(code)
                        if (checkIpfsHash != sha1sum) {
                            console.log("In savev2: checkIpfsHash != sha1sum")
                        }



                        if (mm.isValidObject(options) && options.save_code_to_file) {
                            //showTimer("Saving to file: " + options.save_code_to_file)
                            fs.writeFileSync( options.save_code_to_file,  code.toString() )
                        }




                        if (mm.isValidObject(options) && options.save_html) {
                            //showTimer(`13`)
                            //
                            // create the static HTML file to link to on the web/intranet
                            //
                            let origFilePath = path.join(__dirname, '../public/go.html')
                            let newStaticFilePath = path.join( mm.userData, 'apps/' + baseComponentId + '.html' )
                            let newLocalStaticFilePath = path.join( mm.userData, 'apps/yazz_' + baseComponentId + '.html' )
                            let newLocalJSPath = path.join( mm.userData, 'apps/yazz_' + baseComponentId + '.yazz' )
                            let newLocalYazzPath = path.join( mm.userData, 'apps/yazz_' + baseComponentId + '.yazz' )

                            let newStaticFileContent = fs.readFileSync( origFilePath )

                            newStaticFileContent = newStaticFileContent.toString().replace("isStaticHtmlPageApp: false", "isStaticHtmlPageApp: true")

                            let escapedCode = escape( code.toString() )


                            newStaticFileContent = newStaticFileContent.toString().replace("***STATIC_NAME***",displayName)
                            newStaticFileContent = newStaticFileContent.toString().replace("***STATIC_NAME***",displayName)
                            newStaticFileContent = newStaticFileContent.toString().replace("***STATIC_BASE_COMPONENT_ID***",baseComponentId)
                            newStaticFileContent = newStaticFileContent.toString().replace("***STATIC_BASE_COMPONENT_ID***",baseComponentId)
                            newStaticFileContent = newStaticFileContent.toString().replace("***STATIC_CODE_ID***",sha1sum)
                            newStaticFileContent = newStaticFileContent.toString().replace("***STATIC_CODE_ID***",sha1sum)

let pipelineCode = await mm.getPipelineCode({pipelineFileName: "runtimePipelineYazzApp.js"})
let escapedPipelineCode = escape( pipelineCode.toString() )



let newCode =  `
//
// Add the pipelines to the HTML output
//
GLOBALS.runtimePipelines["APP"] = {}
GLOBALS.runtimePipelines["APP"].code = unescape(\`${escapedPipelineCode}\`)
GLOBALS.runtimePipelines["APP"].json = eval("(" + GLOBALS.runtimePipelines["APP"].code + ")")







GLOBALS.cacheThisComponentCode(
{   
codeId:             "${sha1sum}",
code:               /*APP_START_V2*/unescape(\`${escapedCode}\`)/*APP_END_V2*/
})

GLOBALS.pointBaseComponentIdAtCode(
{   
baseComponentId:    "${baseComponentId}",
codeId:             "${sha1sum}"
})

`



//
// Add the subcomponents code
//
if (baseComponentId == "homepage") {
//debugger
}
let results = await mm.getSubComponents(code)
for (let i = 0  ;   i < results.length;    i ++ ) {
if (!results[i].child_code_id) {

let sqlR = await mm.getQuickSqlOneRow(
thisDb
,
"select   ipfs_hash as id,  code  from  yz_cache_released_components  where  base_component_id = ? "
,
[  results[i].child_base_component_id  ])


if (!sqlR) {
sqlR = await mm.getQuickSqlOneRow(
thisDb
,
"select    id,  code  from  system_code  where  base_component_id = ?   order by   creation_timestamp desc   limit 1  "
,
[  results[i].child_base_component_id  ])
}

results[i].sha1 = sqlR.id
results[i].child_code_id = results[i].sha1
} else {
results[i].sha1 = results[i].child_code_id
}

let sqlr2 = await mm.getQuickSqlOneRow(
thisDb,
"select  code  from   system_code where id = ? ",
[  results[i].child_code_id  ])

results[i].code = sqlr2.code

let newcodeEs = escape("(" + results[i].code.toString() + ")")
let newCode2 =  `


GLOBALS.cacheThisComponentCode(
{   
codeId:             "${results[i].sha1}",
code:                unescape(\`${newcodeEs}\`)
})

GLOBALS.pointBaseComponentIdAtCode(
{   
baseComponentId:    "${results[i].child_base_component_id}",
codeId:             "${results[i].sha1}"
})


`
newCode += newCode2
}





                                            //showTimer(`15.1`)
                                            newStaticFileContent = newStaticFileContent.toString().replace("//***ADD_STATIC_CODE", newCode)



                                            newStaticFileContent = mm.replaceBetween(newStaticFileContent, "/*static_hostname_start*/","/*static_hostname_end*/","'"+mm.userData+"'")
                                            newStaticFileContent = mm.replaceBetween(newStaticFileContent, "/*static_port_start*/","/*static_port_end*/",mm.port)

                                            //
                                            // we use "slice" here as string replace doesn't work with large strings (over 1MB) and most of the aframe and js
                                            // code we insert is LARGE!!
                                            //
                                            let pos = newStaticFileContent.indexOf("//***ADD_SCRIPT")
                                            newStaticFileContent = newStaticFileContent.slice(0, pos)  + scriptCode + newStaticFileContent.slice( pos)
                                            //showTimer(`15.2`)


                                            //fs.writeFileSync( path.join(__dirname, '../public/sql2.js'),  sqliteCode )
                                            fs.writeFileSync( newStaticFilePath,  newStaticFileContent )


                                            //showTimer(`15.3`)

                                            //
                                            // save the standalone app
                                            //
                                            if (options && options.allowAppToWorkOffline) {
                                                sqliteCode = fs.readFileSync(path.join(__dirname, '../public/sql.js'))
                                                let indexOfSqlite = newStaticFileContent.indexOf("//SQLITE")
                                                newStaticFileContent = newStaticFileContent.substring(0, indexOfSqlite) +
                                                    sqliteCode +
                                                    newStaticFileContent.substring(indexOfSqlite)
                                                newStaticFileContent = mm.replaceBetween(newStaticFileContent, "/*use_local_sqlite_start*/", "/*use_local_sqlite_end*/", "let localAppshareApp = true")
                                            }


                                            //showTimer(`15.4`)

                                            let dbToUse = baseComponentId
                                            if (useDb) {
                                                dbToUse = useDb
                                            }
                                            let sqliteAppDbPath = path.join( mm.userData, 'app_dbs/' + dbToUse + '.visi' )


                                            if (options && options.allowAppToWorkOffline) {
                                                if (fs.existsSync(sqliteAppDbPath)) {
                                                    //showTimer(`15.5`)
                                                    let sqliteAppDbContent = fs.readFileSync( sqliteAppDbPath , 'base64')
                                                    let indexOfSqliteData = newStaticFileContent.indexOf("let sqlitedata = ''")


                                                    newStaticFileContent = newStaticFileContent.substring(0,indexOfSqliteData + 17) +
                                                        "'" + sqliteAppDbContent + "'//sqlitedata" +
                                                        newStaticFileContent.substring(indexOfSqliteData + 19)

                                                }
                                            }
                                            //showTimer(`15.6`)

                                            fs.writeFileSync( newLocalStaticFilePath,  newStaticFileContent )
                                            fs.writeFileSync( newLocalJSPath,  code )
                                            fs.writeFileSync( newLocalYazzPath,  code )
                                            //showTimer(`15.7`)


                            //showTimer(`15.8`)
                        }
                        //showTimer(`15.9`)






                        //showTimer(`16`)



                        //
                        // save the app db
                        //
                        let sqlite = mm.getValueOfCodeString(code, "sqlite",")//sqlite")
                        if (sqlite) {
                            if (mm.isValidObject(options) && options.copy_db_from) {

                                let newBaseid = baseComponentId
                                //
                                // copy the database
                                //
                                let sqliteAppDbPathOld = path.join( mm.userData, 'app_dbs/' + options.copy_db_from + '.visi' )
                                let sqliteAppDbPathNew = path.join( mm.userData, 'app_dbs/' + newBaseid + '.visi' )
                                ////showTimer("sqliteAppDbPathOld: " + sqliteAppDbPathOld)
                                ////showTimer("sqliteAppDbPathNew: " + sqliteAppDbPathNew)
                                mm.copyFile(sqliteAppDbPathOld,sqliteAppDbPathNew, async function(){

                                });
                                thisDb.serialize(function() {
                                    thisDb.run("begin exclusive transaction");
                                    copyMigration.run(  newBaseid,  options.copy_db_from)
                                    thisDb.run("commit");
                                })

                            } else if (mm.isValidObject(options) && options.fast_forward_database_to_latest_revision) {
                                mm.fastForwardToLatestRevision(thisDb, sqlite, baseComponentId)

                            } else {
                                ////showTimer('updateRevisions(sqlite, baseComponentId)')
                                ////showTimer('    ' + JSON.stringify(options,null,2))
                                mm.updateRevisions(thisDb, sqlite, baseComponentId)
                            }

                        }
                        //
                        // END OF save app db
                        //


                        //showTimer(`ret 8`)

                        returnFn( {
                            code_id:            sha1sum,
                            base_component_id:  baseComponentId
                        })

                    })
                } catch(err) {
                    console.log(err)
                }

                //
                // otherwise we only update the static file if our IP address has changed
                //
            } else {
                if (options && options.save_html) {
                    let oldStaticFilePath = path.join( mm.userData, 'apps/' + baseComponentId + '.html' )
                    if (fs.existsSync(oldStaticFilePath)) {
                        let oldStaticFileContent = fs.readFileSync( oldStaticFilePath )

                        let oldHostname = mm.getValueOfCodeString(oldStaticFileContent, "/*static_hostname_start*/","/*static_hostname_end*/")
                        let oldPort = mm.getValueOfCodeString(oldStaticFileContent, "/*static_port_start*/","/*static_port_end*/")

                        if ((oldHostname != mm.hostaddress) || (oldPort != mm.port)) {
                            let newStaticFileContent = oldStaticFileContent.toString()
                            newStaticFileContent = mm.replaceBetween(newStaticFileContent, "/*static_hostname_start*/","/*static_hostname_end*/","'"+mm.userData+"'")
                            newStaticFileContent = mm.replaceBetween(newStaticFileContent, "/*static_port_start*/","/*static_port_end*/",mm.port)
                            fs.writeFileSync( oldStaticFilePath,  newStaticFileContent )
                        }
                    }
                }

                //showTimer(`ret 9`)
                returnFn( {
                    code_id:            sha1sum,
                    base_component_id:  baseComponentId
                })
            }
        })
        //showTimer(`ret prom`)

        let ret = await promise;
        return ret
    },
    updateCodeTags:                 async function(thisDb, args) {

        /*
        ________________________________________
        |                                      |
        |           updateCodeTags             |
        |                                      |
        |______________________________________|
        Function description
        __________
        | PARAMS |______________________________________________________________
        |
        |     thisDb
        |     ------
        |
        |     args
        |     ----    {
        |                   baseComponentId
        |                   userId
        |                   sha1sum
        |             }
        |________________________________________________________________________ */
        let mm                  = this
        let baseComponentId     = args.baseComponentId
        let userId              = args.userId
        let sha1sum             = args.sha1sum
        let existingCodeTags    = await mm.getQuickSqlOneRow(
                                    thisDb,
                                    "select * from code_tags where base_component_id = ? and fk_user_id = ? and code_tag='EDIT'  ",
                                    [baseComponentId, userId])
        let promise = new Promise( async function(returnfn) {
            thisDb.serialize(
                function() {
                    if (existingCodeTags) {
                        stmtUpdateCommitForCodeTag.run(
                            sha1sum
                            ,
                            baseComponentId
                            ,
                            "EDIT"
                            ,
                            userId
                        )
                    } else {
                        stmtInsertIntoCodeTags.run(
                            uuidv1()
                            ,
                            baseComponentId
                            ,
                            "EDIT"
                            ,
                            sha1sum
                            ,
                            userId
                        )
                    }
                    thisDb.run("commit", async function() {
                        returnfn()
                    });
            })
        })
        let ret = await promise
        return ret
    },

    //code execution helpers
    getPipelineCode:                async function(args) {
        /*
        ________________________________________
        |                                      |
        |       getPipelineCode                |
        |                                      |
        |______________________________________|
        Function description
        __________
        | PARAMS |______________________________________________________________
        |
        |     NONE
        |     ----
        |
        |     OR
        |
        |     args    {
        |     ----          pipelineFileName
        |             }
        |________________________________________________________________________ */
        let pipelineFileName = args.pipelineFileName
        let fileOut = fs.readFileSync("src/" + pipelineFileName, 'utf8').toString()
        return fileOut
    }
}
