const OnlyIpfsHash                              = require("ipfs-only-hash");
const path                                      = require("path");
let sqlite3
if (process.versions.bun) {
    sqlite3 =  require("bun:sqlite");
} else {
    sqlite3 =  require("sqlite3");
}
let uuidv1                                      = require('uuid/v1');
let http                                        = require('http')
let https                                       = require('https');
let stmtDeleteTypesForComponentProperty
let stmtDeleteAcceptTypesForComponentProperty
let stmtInsertComment
let fs                                          = require('fs');
let stmtInsertAppDDLRevision;
let stmtUpdateLatestAppDDLRevision;
let copyMigration;
let stmtInsertIpfsHash;
const ipfsAPI = require('ipfs-api');
let fileURLToPath =require( 'node:url').fileURLToPath;

//const ipfs = ipfsAPI('ipfs.infura.io', '5001', {protocol: 'https'})
const ipfs = ipfsAPI('127.0.0.1', '5001', {protocol: 'http'})




module.exports = {
    helpers: {
        insertCodeString:               function        (  code  ,  st  ,  vall  ,  optionalEnd  ) {
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
        deleteCodeString:               function        (  code  ,  st  ,  optionalEnd  ) {
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
        getValueOfCodeString:           function        (  code  ,  st  ,  optionalEnd  ) {
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
        replaceBetween:                 function        (  target  ,  start  ,  end  ,  replaceWith  ) {
            let startIndex  = target.indexOf(start)
            if (startIndex == -1) {
                return target
            }
            startIndex      += start.length
            let endIndex    = target.indexOf(end)
            if (endIndex == -1) {
                return target
            }
            let newString   = target.substring(0,startIndex) + replaceWith + target.substring(endIndex);
            return newString
        },
        addAfter:                       function        (  target  ,  start  ,  replaceWith  ) {
            let startIndex  = target.indexOf(start) + start.length
            let endIndex    = startIndex
            let newString   = target.substring(0,startIndex) + replaceWith + target.substring(endIndex);
            return newString
        },
        addBefore:                      function        (  target  ,  end  ,  replaceWith  ) {
            let startIndex  = target.indexOf(end)
            let endIndex    = startIndex + replaceWith.length - 1
            let newString   = target.substring(0,startIndex) + replaceWith + target.substring(endIndex);
            return newString
        }
    },
    //setup this module
    setup:                          async function  (  thisDb  ) {

        stmtInsertComment = thisDb.prepare(" insert or replace into comments_and_ratings " +
            "    (id, base_component_id, version , comment, rating, date_and_time) " +
            " values " +
            "    (?,?,?,?,?,?);");


        stmtDeleteTypesForComponentProperty = thisDb.prepare(
            " delete from  component_property_types   where   base_component_id = ?");
        stmtDeleteAcceptTypesForComponentProperty = thisDb.prepare(
            " delete from  component_property_accept_types   where   base_component_id = ?");
        stmtInsertAppDDLRevision = thisDb.prepare(
            " insert into app_db_latest_ddl_revisions " +
            "      ( base_component_id,  latest_revision  ) " +
            " values " +
            "      ( ?,  ? );");
        stmtUpdateLatestAppDDLRevision = thisDb.prepare(
            " update  app_db_latest_ddl_revisions  " +
            "     set  latest_revision = ? " +
            " where " +
            "     base_component_id =  ? ;");
        copyMigration = thisDb.prepare(
            `insert into  app_db_latest_ddl_revisions
               (base_component_id,latest_revision)
            select ?,  latest_revision from app_db_latest_ddl_revisions
             where base_component_id=?`
        );
        stmtInsertIpfsHash = thisDb.prepare(" insert or replace into ipfs_hashes " +
            "    (ipfs_hash, content_type, scope , last_ipfs_ping_millis , temp_debug_content ,  stored_in_local_file,  read_from_local_file  ,  stored_in_ipfs  ,  sent_to_peer  ,  read_from_local_ipfs  ,  read_from_peer_ipfs  ,  read_from_peer_file  ,  last_ipfs_ping_millis ) " +
            " values " +
            "    ( ?, ?, ?, ?, ? , ? , ? , ? , ? , ? , ? , ? , ? );");
    },

    //text retrieval and replacement
    getBetween:                     function        (  target  ,  start  ,  end  ) {
        let startIndex = target.indexOf(start) + start.length
        let endIndex = target.indexOf(end)
        let newString = target.substring(startIndex,endIndex)
        return newString
    },
    replacePropertyValue:           function        (  code  ,  propertyId  ,  propertyValue  ) {
        let yz = this
      let properties = this.helpers.getValueOfCodeString(code,"properties",")//prope" + "rties")
      if (properties) {
          let index =0;
          for (let i=0; i < properties.length; i++) {
            let property = properties[i]
            if (property.id == propertyId) {
                property.default = propertyValue
                break;
            }
          }

          code = yz.helpers.deleteCodeString(  code, "properties", ")//prope" + "rties")

          code = yz.helpers.insertCodeString(    code,
                                                     "properties",
                                                      properties,
                                                     ")//prope" + "rties")
      }
      return code
    },

    //manipulate components
    addProperty:                    function        (  code  ,  newProperty  ) {
        let yz = this
        let properties = this.helpers.getValueOfCodeString(code,"properties",")//prope" + "rties")
        if (properties) {
            properties.push(newProperty)

            code = yz.helpers.deleteCodeString(  code, "properties", ")//prope" + "rties")

            code = yz.helpers.insertCodeString(    code,
                "properties",
                properties,
                ")//prope" + "rties")
        }
        return code
    },
    addMethod:                      function        (  code  ,  newMethod  ) {
        let yz = this
         let existingCode = this.getBetween(
             code,
             "/*NEW_METHODS_START*/",
             "/*NEW_METHODS_END*/")

        code = yz.helpers.replaceBetween(
                        code,
                        "/*NEW_METHODS_START*/",
                        "/*NEW_METHODS_END*/",
            existingCode + newMethod)

        return code
    },
    getChildDetails:                async function  (  subComponent  ) {
        let newSubComponent = {
            baseComponentId: subComponent,
            codeId:          subComponent
        }
        return newSubComponent
    },
    getSubComponents:               async function  (  srcCode  ) {
        let yz = this

        let subC = yz.helpers.getValueOfCodeString(srcCode,"sub_components_v2")
        if (!subC) {
            return []
        }
        let retRes = []
        for (let subComponent  of  subC) {
            if (typeof subComponent === 'string' || subComponent instanceof String) {
                retRes.push({child_base_component_id: subComponent})
            } else if (subComponent.code_id != null && (subComponent.code_id != "")) {
                retRes.push({child_base_component_id: subComponent.base_component_id, child_code_id: subComponent.code_id})
            } else {
                retRes.push({child_base_component_id: subComponent.base_component_id})
            }
        }
        return retRes
    },

    //general JS helpers
    isValidObject:                  function        (  variable  ){
        if ((typeof variable !== 'undefined') && (variable != null)) {
            return true
        }
        return false
    },

    //Internal SQLite DB helpers
    getQuickSqlOneRow:              async function  (  thisDb  ,  sql  ,  params  ) {
        let rows = await this.getQuickSql(thisDb,sql,params)
        if (rows.length == 0) {
            return null
        }
        return rows[0]
    },
    getQuickSql:                    async function  (  thisDb  ,  sql  ,  params  ) {
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
    executeQuickSql:                async function  (  thisDb  ,  sql  ,  params  ) {
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
    tagVersion:                     async function  (  thisDb  ,  ipfs_hash  ,  srcCode  ) {
        let yz = this
        let baseComponentId = yz.helpers.getValueOfCodeString(srcCode,"base_component_id")
        let dateTime = new Date().getTime()
        await this.executeQuickSql(thisDb,
            `insert into 
                code_tags_table 
            (id , base_component_id , code_tag , code_tag_value, fk_system_code_id)
                values
            (?,?,?,?,?) 
            `
            ,
            [ uuidv1()  ,  baseComponentId  , "PROD" , dateTime,  ipfs_hash])
    },
    getCodeForCommit:               async function  (  thisDb  ,  commitId  ) {
        let thisCommit = await this.getQuickSqlOneRow(thisDb,  "select  *  from   system_code  where   id = ? ", [  commitId  ])
        if (thisCommit) {
            return thisCommit.code
        }

        return null
    },
    updateRevisions:                function        (  thisDb  ,  sqlite  ,  baseComponentId  ) {
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
    fastForwardToLatestRevision:    function        (  thisDb  ,  sqlite  ,  baseComponentId  ) {
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
    clearLinkedTypesInDB:           async function  (  thisDb  ,  baseComponentId  ,  properties  ) {
        let mm = this
        await mm.executeQuickSql(thisDb," delete from  component_property_types   where   base_component_id = ?",[baseComponentId]);
        await mm.executeQuickSql(thisDb," delete from  component_property_accept_types   where   base_component_id = ?", [baseComponentId]);

        if (properties) {
            for (let rttte = 0; rttte < properties.length ; rttte++ ) {
                let prop = properties[rttte]

                if (prop.types) {
                    let labelKeys = Object.keys(prop.types)
                    for (let rttte2 = 0; rttte2 < labelKeys.length ; rttte2++ ) {
                        await mm.executeQuickSql(thisDb,`insert or ignore
                                                    into
                                               component_property_types
                                                    (base_component_id, property_name , outputs_type )
                                               values ( ?,?,? )`,
                            [   baseComponentId, prop.id, labelKeys[rttte2]   ])

                    }
                }
                if (prop.accept_types) {
                    let labelKeys = Object.keys(prop.accept_types)
                    for (let rttte2 = 0; rttte2 < labelKeys.length ; rttte2++ ) {
                        await mm.executeQuickSql(thisDb,`insert or ignore
                                                    into
                                               component_property_accept_types
                                                    (  base_component_id, property_name , accept_type  )
                                               values ( ?,?,? )`,
                            [   baseComponentId,
                                prop.id,
                                labelKeys[rttte2]   ])

                    }
                }
            }
        }

    },
    insertNewCode:                  async function  (  thisDb  ,  params  ) {
        let mm = this
        mm.executeQuickSql(
            thisDb
            ,
            `insert into
                 system_code  
                     (id, parent_id, code, base_component_id, 
                      display_name, creation_timestamp, 
                      logo_url, visibility,use_db, editors, read_write_status,properties, 
                      component_type, edit_file_path, 
                      code_changes, num_changes, fk_user_id, score, score_reason) 
              values 
                (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
            ,
            params
        )
    },
    getSrcCodePropertiesAsJson:     async function  (  {  code  }  ) {
        //---------------------------------------------------------------------------
        //
        //                          getSrcCodePropertiesAsJson( ... )
        //                         -----------------
        //
        // This is called on a peer (from a client) and given some Yazz source code
        // it parses the code a returns a simple JSON structure with the main details
        // of the code in it
        //
        // Notes:
        // - what happens if we register a false or bad IPFS address? All code sent
        //   here should be validated
        //---------------------------------------------------------------------------
        let yz=this
        let baseComponentIdOfItem   = yz.helpers.getValueOfCodeString(code,"base_component_id")
        let itemName                = yz.helpers.getValueOfCodeString(code,"display_name")
        let iconUrl                 = yz.helpers.getValueOfCodeString(code,"logo_url")
        let ipfsHashId              = await OnlyIpfsHash.of(code)
        let readWriteStatus         = ""
        let readOnly                = yz.helpers.getValueOfCodeString(code,"read_only")

        if (readOnly) {
            if (readOnly == true) {
                readWriteStatus = "read"
            }
        }

        let componentType = ""
        if (yz.helpers.getValueOfCodeString(code,"component_type") == "SYSTEM") {
            componentType = "system"
        } else if (yz.helpers.getValueOfCodeString(code,"component_type") == "APP") {
            componentType = "app"
        } else if (yz.helpers.getValueOfCodeString(code,"component_type") == "VB") {
            componentType = "component"
        }
        return {
            ipfsHashId:         ipfsHashId,
            name:               itemName,
            type:               componentType,
            logo:               iconUrl,
            baseComponentId:    baseComponentIdOfItem,
            readWriteStatus:    readWriteStatus
        }
    },

    //code save helpers
    copyFile:                       function        (  source  ,  target  ,  cb  ) {
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
    getIpfsHash:                    async function  (  sometext  ) {
        let ipfsHash = await OnlyIpfsHash.of(sometext)
        return ipfsHash
    },
    saveCodeV3:                     async function  (  thisDb  ,  code  ,  options  ) {
        /*
        ________________________________________
        |                                      |
        |             saveCodeV3               |
        |                                      |
        |______________________________________|
        Function description
        __________
        | PARAMS |______________________________________________________________
        |
        |     thisDb
        |     ------
        |
        |     options
        |     -------
        |
        |     options
        |     -------    {
        |                     baseComponentId
        |                     userId
        |                     sha1sum
        |                }
        |________________________________________________________________________ */

        // ********** setup **********
        let mm = this
        let yz                = this

        await mm.setup(thisDb)
        if (code) {
            code = code.toString()
        }



        // ********** get info from the code **********
        let properties          = yz.helpers.getValueOfCodeString(code,"properties",")//properties")
        let baseComponentId     = yz.helpers.getValueOfCodeString(code,"base_component_id")
        let parentHash          = yz.helpers.getValueOfCodeString(code,"parent_hash")
        let visibility          = yz.helpers.getValueOfCodeString(code,"visibility")
        let logoUrl             = yz.helpers.getValueOfCodeString(code,"logo_url")
        let updatedTimestamp    = yz.helpers.getValueOfCodeString(code, "updated_timestamp")
        let readOnly            = yz.helpers.getValueOfCodeString(code,"read_only")
        let displayName         = yz.helpers.getValueOfCodeString(code,"display_name")
        let useDb               = yz.helpers.getValueOfCodeString(code,"use_db")
        let editors2            = yz.helpers.getValueOfCodeString(code,"editors")
        let controlType         = yz.helpers.getValueOfCodeString(code,"component_type")
        let codeChanges         = yz.helpers.getValueOfCodeString(code,"code_changes",")//code_" + "changes")


        // set up local vars
        let editors                                 = null
        let readWriteStatus                         = null
        let codeChangesStr                          = null
        let numCodeChanges                          = null
        let sha1sum                                 = await OnlyIpfsHash.of(code)
        //console.log("            In save, actual code ID: " + sha1sum + " for " + baseComponentId)
        let userId                                  = null
        let propertiesAsJsonString                  = null
        let existingCodeAlreadyInSystemCodeTable
        let save_code_to_file                       = null

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



            // ********** if the code is not already stored then store it  **********
            existingCodeAlreadyInSystemCodeTable = await mm.getQuickSqlOneRow(
                thisDb,

            `select  
                     id 
                 from 
                     system_code 
                 where
                     id = ?;`
                ,
        [sha1sum])

            if ((existingCodeAlreadyInSystemCodeTable == null) || readOnly || (options && options.allowAppToWorkOffline)){
                try {


                    // ********** if this is a UI control then store the linked properties in the DB  **********
                    if (controlType == "VB") {
                        await mm.clearLinkedTypesInDB(thisDb, baseComponentId, properties)
                    }


                    // ********** if the code has been changed then DO NOT SAVE IT! This is a basic tamper proof mechanism  **********
                    let sha1sum2  = await OnlyIpfsHash.of(code)
                    if (sha1sum2 != sha1sum) {
                        console.log("Code SHA do not match - code has been changed while saving")
                        throw "Code SHA do not match - code has been changed while saving"
                    }

                    await mm.insertNewCode(
                        thisDb
                        ,
                        [
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
                        ])

                    await mm.pointEditMarkerAtCommit(
                        thisDb
                        ,
                        {
                            baseComponentId:    baseComponentId,
                            codeId:             sha1sum,
                            userId:             userId
                        })
                    await mm.setTipsForCommit(thisDb, code, sha1sum)



                        let sqliteCode = ""
                        thisDb.run("commit", async function() {

                        });
                        let checkIpfsHash = (await mm.setDistributedContent(thisDb, code, options)).value
                        if (checkIpfsHash != sha1sum) {
                            console.log("In savev2: checkIpfsHash != sha1sum")
                        }



                        if (mm.isValidObject(options) && options.save_code_to_file) {
                            //showTimer("Saving to file: " + options.save_code_to_file)
                            fs.writeFileSync( options.save_code_to_file,  code.toString() )
                        }




                        if (mm.isValidObject(options) && options.save_html) {
                            //
                            // create the static HTML file to link to on the web/intranet
                            //
                            let origFilePath            = path.join(__dirname, '../public/go.html')
                            let newStaticFilePath       = path.join( mm.userData, 'apps/' + baseComponentId + '.html' )
                            let newLocalStaticFilePath  = path.join( mm.userData, 'apps/yazz_' + baseComponentId + '.html' )
                            let newLocalJSPath          = path.join( mm.userData, 'apps/yazz_' + baseComponentId + '.yazz' )
                            let newLocalYazzPath        = path.join( mm.userData, 'apps/yazz_' + baseComponentId + '.yazz' )
                            let newStaticFileContent    = fs.readFileSync( origFilePath )

                            newStaticFileContent = newStaticFileContent.toString().replace("isStaticHtmlPageApp: false", "isStaticHtmlPageApp: true")

                            let escapedCode = escape( code.toString() )

                            newStaticFileContent = newStaticFileContent.toString().replace("***STATIC_NAME***",displayName)
                            newStaticFileContent = newStaticFileContent.toString().replace("***STATIC_NAME***",displayName)
                            newStaticFileContent = newStaticFileContent.toString().replace("***STATIC_BASE_COMPONENT_ID***",baseComponentId)
                            newStaticFileContent = newStaticFileContent.toString().replace("***STATIC_BASE_COMPONENT_ID***",baseComponentId)
                            newStaticFileContent = newStaticFileContent.toString().replace("***STATIC_CODE_ID***",sha1sum)
                            newStaticFileContent = newStaticFileContent.toString().replace("***STATIC_CODE_ID***",sha1sum)

                            let pipelineCode            = await mm.getPipelineCode({pipelineFileName: "runtimePipelineYazzApp.js"})
                            let escapedPipelineCode     = escape( pipelineCode.toString() )
                            let pipelineCode2           = await mm.getPipelineCode({pipelineFileName: "runtimePipelineYazzUiMethods.js"})
                            let escapedPipelineCode2    = escape( pipelineCode2.toString() )
                            let pipelineCode3           = await mm.getPipelineCode({pipelineFileName: "runtimePipelineYazzUiTemplate.js"})
                            let escapedPipelineCode3    = escape( pipelineCode3.toString() )

                            let newCode =
                                `
                                //
                                // Add the pipelines to the HTML output
                                //
                                GLOBALS.runtimePipelines["APP"] = {}
                                GLOBALS.runtimePipelines["APP"].code = unescape(\`${escapedPipelineCode}\`)
                                
                                GLOBALS.runtimePipelines["APP_UI_METHODS"] = {}
                                GLOBALS.runtimePipelines["APP_UI_METHODS"].code = unescape(\`${escapedPipelineCode2}\`)
                                
                                GLOBALS.runtimePipelines["APP_UI_TEMPLATE"] = {}
                                GLOBALS.runtimePipelines["APP_UI_TEMPLATE"].code = unescape(\`${escapedPipelineCode3}\`)
                                
                                
                                
                                GLOBALS.cacheThisComponentCode(
                                {   
                                    codeId:             "${sha1sum}",
                                    code:               /*APP_START*/unescape(\`${escapedCode}\`)/*APP_END*/
                                })
                                yz.componentsAPI.vue.setComponentLoadedMethod({codeId: "${sha1sum}", loadMethod: "STATIC"})

                                
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

                            newCode += "/*COMPONENTS_START*/"


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

                                    results[i].sha1             = sqlR.id
                                    results[i].child_code_id    = results[i].sha1


                                } else {
                                    results[i].sha1 = results[i].child_code_id
                                }

                                let sqlr2 = await mm.getQuickSqlOneRow(
                                    thisDb
                                    ,
                                    "select  code  from   system_code where id = ? "
                                    ,
                                    [  results[i].child_code_id  ])

                                if (sqlr2 != null) {
                                    results[i].code = sqlr2.code

                                    let newcodeEs   = escape(results[i].code.toString())
                                    let newCode2    =
                                        `
                                        await universalSaveStaticUIControl
                                        (   
                                            { 
                                                sha1sum:            "${results[i].sha1}", 
                                                unescapedCode:      unescape(\`${newcodeEs}\`), 
                                                baseComponentId:    "${results[i].child_base_component_id}", 
                                                loadMethod:         "STATIC"
                                            }
                                        )
                                        `
                                    newCode += newCode2
                                }
                            }
                            newCode += "/*COMPONENTS_END*/"

                            newStaticFileContent = newStaticFileContent.toString().replace("//***ADD_STATIC_CODE", newCode)
                            newStaticFileContent = yz.helpers.replaceBetween(newStaticFileContent, "/*static_hostname_start*/","/*static_hostname_end*/","'"+mm.userData+"'")
                            newStaticFileContent = yz.helpers.replaceBetween(newStaticFileContent, "/*static_port_start*/","/*static_port_end*/",mm.port)

                            //
                            // we use "slice" here as string replace doesn't work with large strings (over 1MB) and most of the aframe and js
                            // code we insert is LARGE!!
                            //
                            let pos = newStaticFileContent.indexOf("//***ADD_SCRIPT")
                            newStaticFileContent = newStaticFileContent.slice(0, pos) + newStaticFileContent.slice( pos)


                            //fs.writeFileSync( path.join(__dirname, '../public/sql2.js'),  sqliteCode )
                            fs.writeFileSync( newStaticFilePath,  newStaticFileContent )



                            //
                            // save the standalone app
                            //
                            if (options && options.allowAppToWorkOffline) {
                                sqliteCode = fs.readFileSync(path.join(__dirname, '../public/sql.js'))
                                let indexOfSqlite = newStaticFileContent.indexOf("//SQLITE")
                                newStaticFileContent = newStaticFileContent.substring(0, indexOfSqlite) +
                                    sqliteCode +
                                    newStaticFileContent.substring(indexOfSqlite)
                                newStaticFileContent = yz.helpers.replaceBetween(newStaticFileContent, "/*use_local_sqlite_start*/", "/*use_local_sqlite_end*/", "let localAppshareApp = true")
                            }



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

                            fs.writeFileSync( newLocalStaticFilePath,  newStaticFileContent )
                            fs.writeFileSync( newLocalJSPath,  code )
                            fs.writeFileSync( newLocalYazzPath,  code )
                        }



                        //
                        // save the app db
                        //
                        let sqlite = yz.helpers.getValueOfCodeString(code, "sqlite",")//sqlite")
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

                        let oldHostname = yz.helpers.getValueOfCodeString(oldStaticFileContent, "/*static_hostname_start*/","/*static_hostname_end*/")
                        let oldPort = yz.helpers.getValueOfCodeString(oldStaticFileContent, "/*static_port_start*/","/*static_port_end*/")

                        if ((oldHostname != mm.hostaddress) || (oldPort != mm.port)) {
                            let newStaticFileContent = oldStaticFileContent.toString()
                            newStaticFileContent = yz.helpers.replaceBetween(newStaticFileContent, "/*static_hostname_start*/","/*static_hostname_end*/","'"+mm.userData+"'")
                            newStaticFileContent = yz.helpers.replaceBetween(newStaticFileContent, "/*static_port_start*/","/*static_port_end*/",mm.port)
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
    addOrUpdateDriver:              async function  (  thisDb  ,  codeString  ,  options ) {
        //------------------------------------------------------------------------------
        //
        //
        //
        //
        //
        //------------------------------------------------------------------------------
        let mm = this

        try {
            let saveRet = await mm.saveCodeV3(thisDb,    codeString  ,options);
            let codeId = null
            if (saveRet) {
                codeId = saveRet.code_id
            }
            return {codeId: codeId}



        } catch(err) {
            console.log(err);
            let stack = new Error().stack
            console.log( stack )
            return {error: err}
        }
    },

    // code execution helpers
    getPipelineCode:                async function  (  args  ) {
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
    },

    // CODE_TAGS
    setTipsForCommit:               async function  (  thisDb  ,  savedCode  ,  codeId  ,  userId  ) {
        /*
        ________________________________________
        |                                      |
        |               setTipsForCommit       |
        |                                      |
        |______________________________________|
        Create a new commit tip for the current code, if needed. The code can have
        multiple tips, one for each branch
        __________
        | PARAMS |______________________________________________________________
        |
        |     args
        |     ----
        |________________________________________________________________________ */
        let parentCodeTag
        let baseComponentId
        let parentHash
        let mm                = this
        let yz                = this

        //
        // first check to see if this commit has a parent. If so then delete the TIP
        // from the parent commit
        //
        baseComponentId = yz.helpers.getValueOfCodeString(savedCode,"base_component_id")
        parentHash      = yz.helpers.getValueOfCodeString(savedCode,"parent_hash")

        parentCodeTag = await mm.getQuickSqlOneRow(
            thisDb
            ,
            `select 
                id 
            from  
                code_tags_table  
            where 
                fk_system_code_id = ? 
                    and 
                code_tag = 'TIP'`
            ,
            [parentHash])

        if (parentCodeTag) {
            await mm.executeQuickSql(
                thisDb
                ,
                `delete from 
                    code_tags_table  
                where 
                    fk_system_code_id = ? 
                        and 
                    code_tag = 'TIP'  `
                ,
                [parentHash])
        }

        //
        // Then check if the current commit descendants. If so then delete the TIP from this commit
        //
        let descendants = await mm.getQuickSqlOneRow(
            thisDb
            ,
            `select 
                count(*) as descendant_count
            from  
                system_code  
            where 
                parent_id = ? `
            ,
            [codeId])

        if (descendants.descendant_count > 0) {
            await mm.executeQuickSql(
                thisDb
                ,
                `delete from 
                    code_tags_table  
                where 
                    fk_system_code_id = ? 
                        and 
                    code_tag = 'TIP'  `
                ,
                [codeId])
        } else {

            await mm.executeQuickSql(
                thisDb
                ,
                `insert into 
                    code_tags_table 
                    (   id   ,    base_component_id   ,   code_tag   ,   code_tag_value   ,   fk_system_code_id   ,   fk_user_id   ) 
                 values  
                     (?,?,?,?,?,?)
                     `,
                [uuidv1(), baseComponentId, "TIP", null, codeId, userId])
        }
    },
    pointEditMarkerAtCommit:        async function  (  thisDb  ,  args  ) {
        /*
        ________________________________________
        |                                      |
        |      pointEditMarkerAtCommit         |
        |                                      |
        |______________________________________|
        This makes sure that the current EDIT marker for some code is set. There can be
        many different users editing the same component, so we need to make sure they
        each have a unique edit marker
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
        let mm              = this
        let baseComponentId = args.baseComponentId
        let userId          = args.userId
        let sha1sum         = args.codeId

        let existingCodeTags = await mm.getQuickSqlOneRow(
            thisDb,

            `select
                * 
            from 
                code_tags_table 
            where 
                base_component_id = ? 
                    and 
                fk_user_id = ? 
                    and 
                code_tag='EDIT'  `,

            [baseComponentId, userId])

        if (existingCodeTags) {
            await mm.executeQuickSql(
                thisDb,
                `
                update
                   code_tags_table
                set  
                    fk_system_code_id = ?
                where
                    base_component_id = ? 
                        and 
                    code_tag = "EDIT" 
                        and 
                    fk_user_id = ?
               `,
                [    sha1sum   ,   baseComponentId  ,   userId   ])
        } else {
            await mm.executeQuickSql(
                thisDb
                ,
                `
                insert or ignore
                    into
                code_tags_table
                    (   id   ,   base_component_id   ,   code_tag   ,   code_tag_value   ,   fk_system_code_id   ,   fk_user_id   ) 
                values ( ?, ?, ?, ?, ? , ?)`
                ,
                [  uuidv1()   ,      baseComponentId   ,     "EDIT"      ,     userId   ,   sha1sum     ,      userId    ]
            )
        }
    },

    // app store
    insertCommentIntoDb:            async function  (  thisDb, args  ) {
        let promise2 = new Promise(async function(returnfn2) {
            try {
                thisDb.serialize(function() {
                    thisDb.run("begin exclusive transaction");
                    stmtInsertComment.run(
                        uuidv1() ,
                        args.baseComponentId ,
                        args.baseComponentIdVersion,
                        args.newComment,
                        args.newRating,
                        args.dateAndTime
                    )
                    thisDb.run("commit")
                    returnfn2()
                })
            } catch(er) {
                console.log(er)
                returnfn2()
            }
        })
        await promise2
    },

    // distributed content public API
    getDistributedKey:              async function  (  content  ) {
        //---------------------------------------------------------------------------
        //
        //                           getDistributedKey( )
        //                           --------------------
        //
        // Given a piece of content, get the distributed key. This key will be
        // IPFS Multiformats compliant, so it should start with QM.... or Baf... or
        // something like that. This is actually needed because in the front end of
        // Yazz we often need the IPFS hash of some content (via the getIpfsHash( ) fn)
        // just in case the front end IPFS server is not available
        //---------------------------------------------------------------------------
        let ipfsHash = await OnlyIpfsHash.of(  content  )
        return ipfsHash
    },
    getDistributedContent:          async function  (  {  thisDb  ,  ipfsHash  }  ) {
        //---------------------------------------------------------------------------
        //
        //                           getDistributedContent( )
        //                           ------------------------
        //
        // This gets content from the network. The content could be metadata which
        // is in JSON format, or Yazz source code which is in plain text. The content
        // is retrieved in the following order:
        //
        // 1) content exists locally by checking the database. If it does then get
        // the content locally
        //
        // 2) If we have access to an IPFS server then try to get the content from
        // there. This step may be skipped for some enterprise environments which
        // do not allow content to be stored on the public IPFS network
        //
        // 3) Get the content from a Yazz peer, which is usually the central server.
        //
        //---------------------------------------------------------------------------
        let mm                          = this
        let yz                          = this
        let fullIpfsFilePath            = null
        let fullIpfsMetaDataFilePath    = null
        let contentExistsOnLocalDisk    = null
        let metadataExistsOnLocalDisk   = null
        let metadataJson                = null
        let updatedMetadataJson         = null
        let contentStoredInSqlite       = null
        let metadataContent             = null
        let metadataAsJson              = null
        let returnValue                 = null
        let contentOnDisk               = null
        let baseComponentId             = null

        try {
            fullIpfsFilePath            = path.join(mm.fullIpfsFolderPath, ipfsHash)
            fullIpfsMetaDataFilePath    = fullIpfsFilePath + "_metadata"
            contentStoredInSqlite       = await mm.getQuickSqlOneRow(thisDb, "select  *  from  ipfs_hashes  where  ipfs_hash = ?", [  ipfsHash  ])
            contentExistsOnLocalDisk    = fs.existsSync(fullIpfsFilePath);
            metadataExistsOnLocalDisk   = fs.existsSync(fullIpfsMetaDataFilePath);

            // if the content is stored in Sqlite and on disk then get the content from the
            // filesystem
            if (contentStoredInSqlite && contentExistsOnLocalDisk && metadataExistsOnLocalDisk) {
                contentOnDisk = fs.readFileSync(fullIpfsFilePath)
                returnValue = contentOnDisk



            // otherwise if the content is only stored in sqlite do nothing
            // as the content is already loaded, but mark the file on disk as
            // needing updating
            } else if (contentStoredInSqlite) {
                await mm.executeQuickSql(thisDb, "update  ipfs_hashes  set  stored_in_local_file = 0  where  ipfs_hash = ?", [ ipfsHash ])


            // otherwise if the content exists on disk but not in Sqlite then
            // take the content and metadata from the file and store it in SQlite
            } else if (contentExistsOnLocalDisk && metadataExistsOnLocalDisk) {
                contentOnDisk           = fs.readFileSync(fullIpfsFilePath).toString("utf8")
                metadataContent         = fs.readFileSync(fullIpfsMetaDataFilePath)
                metadataJson            = JSON.parse(metadataContent)
                updatedMetadataJson     =   {
                                                thisDb:                 thisDb,
                                                ipfs_hash:              ipfsHash,
                                                content_type:           metadataJson.content_type,
                                                temp_debug_content:     contentOnDisk,
                                                scope:                  metadataJson.scope,
                                                stored_in_local_file:   metadataJson.stored_in_local_file,
                                                read_from_local_file:   parseInt(metadataJson.read_from_local_file) + 1,
                                                stored_in_ipfs:         metadataJson.stored_in_ipfs,
                                                sent_to_peer:           metadataJson.sent_to_peer,
                                                read_from_local_ipfs:   metadataJson.read_from_local_ipfs,
                                                read_from_peer_ipfs:    metadataJson.read_from_peer_ipfs,
                                                read_from_peer_file:    metadataJson.read_from_peer_file,
                                                last_ipfs_ping:         metadataJson.last_ipfs_ping_millis
                                            }
                await mm.insertContentStorageRecord(updatedMetadataJson)
                delete updatedMetadataJson["temp_debug_content"];
                delete updatedMetadataJson["thisDb"];
if (updatedMetadataJson.content_type==null)
{
    debugger
}
                fs.writeFileSync(fullIpfsMetaDataFilePath, JSON.stringify(updatedMetadataJson,null,2));
                returnValue = contentOnDisk



            // otherwise get the content from IPFS or a peer
            } else {

            }




            //
            //
            //
            if (returnValue) {
                returnValue = returnValue.toString('utf8')
                let baseComponentId = yz.helpers.getValueOfCodeString(returnValue, "base_component_id")

                await mm.addOrUpdateDriver(
                    thisDb
                    ,
                    returnValue
                    ,
                    {
                        username:       "default",
                        reponame:       baseComponentId,
                        version:        "latest",
                        ipfsHashId:     ipfsHash,
                        allowChanges:   false
                    })
            }




        } catch( err) {
            debugger
        }

    },
    setDistributedContent:          async function  (  thisDb  ,  content  , options  ) {
        //---------------------------------------------------------------------------
        //                           setDistributedContent
        //
        // Whenever we want to set content so that it is stored in the locally or
        // on the network we call this. When this is called we don't really know
        // where the content will be stored, as the internet may be down, or
        // the peer server may be down, but we can give some hints such as:
        //
        // options: {
        //               distributeToPeer: true
        //          }
        //
        //---------------------------------------------------------------------------

        // figure out the content options and scope
        let mm                          = this
        let contentValueToStore         = content
        let contentType                 = "STRING"
        let scope                       = "GLOBAL";
        let justHash                    = null
        let fullIpfsFilePath            = null
        let fullIpfsMetaDataFilePath    = null
        let contentExistsOnLocalDisk    = null
        let metadataExistsOnLocalDisk   = null
        let metadataJson                = null
        let contentStoredInSqlite       = null
        let metadataContent             = null
        let metadataAsJson              = null

        if (typeof content !== 'string') {
            contentValueToStore = JSON.stringify(content,null,2)
            contentType         = "JSON"
        }

        if (options != null) {
            if (typeof options.distributeToPeer !== 'undefined') {
                if (options.distributeToPeer) {
                    scope = "GLOBAL";
                } else {
                    scope = "LOCAL";
                }
            }
        }

        justHash = await OnlyIpfsHash.of(contentValueToStore)

        fullIpfsFilePath            = path.join(mm.fullIpfsFolderPath, justHash)
        fullIpfsMetaDataFilePath    = fullIpfsFilePath + "_metadata"

        //
        try {
            contentStoredInSqlite       = await mm.getQuickSqlOneRow(thisDb, "select  *  from  ipfs_hashes  where  ipfs_hash = ?", [  justHash  ])
            contentExistsOnLocalDisk    = fs.existsSync(fullIpfsFilePath);
            metadataExistsOnLocalDisk   = fs.existsSync(fullIpfsMetaDataFilePath);

            // if the content is stored in Sqlite and on disk then do nothing
            if (contentStoredInSqlite && contentExistsOnLocalDisk && metadataExistsOnLocalDisk) {
                // do nothing!!!



            // otherwise if the content is only stored in sqlite then
            // store the content from sqlite to disk as well
            } else if (contentStoredInSqlite) {
                metadataAsJson = {
                                    ipfs_hash:              contentStoredInSqlite.ipfs_hash,
                                    content_type:           contentStoredInSqlite.content_type,
                                    scope:                  contentStoredInSqlite.scope,
                                    stored_in_local_file:   contentStoredInSqlite.stored_in_local_file,
                                    read_from_local_file:   contentStoredInSqlite.read_from_local_file,
                                    stored_in_ipfs:         contentStoredInSqlite.stored_in_ipfs,
                                    sent_to_peer:           contentStoredInSqlite.sent_to_peer,
                                    read_from_local_ipfs:   contentStoredInSqlite.read_from_local_ipfs,
                                    read_from_peer_ipfs:    contentStoredInSqlite.read_from_peer_ipfs,
                                    read_from_peer_file:    contentStoredInSqlite.read_from_peer_file,
                                    last_ipfs_ping:         contentStoredInSqlite.last_ipfs_ping_millis
                }
                fs.writeFileSync(fullIpfsFilePath, contentValueToStore);
if (metadataAsJson.content_type==null)
{
debugger
}
                fs.writeFileSync(fullIpfsMetaDataFilePath, JSON.stringify(metadataAsJson,null,2));

                return(  {  value: justHash  ,  error: null  }  )



            // otherwise if the content exists on disk but not in Sqlite then
            // take the metadata from the file and store it in SQlite
            } else if (contentExistsOnLocalDisk && metadataExistsOnLocalDisk) {
                metadataContent = fs.readFileSync(fullIpfsMetaDataFilePath)
                metadataJson    = JSON.parse(metadataContent)

                await mm.insertContentStorageRecord(
                    {
                        thisDb:                 thisDb,
                        ipfs_hash:              justHash,
                        content_type:           contentType,
                        temp_debug_content:     contentValueToStore,
                        scope:                  scope,
                        stored_in_local_file:   metadataJson.stored_in_local_file,
                        read_from_local_file:   metadataJson.read_from_local_file,
                        stored_in_ipfs:         metadataJson.stored_in_ipfs,
                        sent_to_peer:           metadataJson.sent_to_peer,
                        read_from_local_ipfs:   metadataJson.read_from_local_ipfs,
                        read_from_peer_ipfs:    metadataJson.read_from_peer_ipfs,
                        read_from_peer_file:    metadataJson.read_from_peer_file,
                        last_ipfs_ping:         metadataJson.last_ipfs_ping_millis
                    })



            // otherwise generate the content on disk and in sqlite
            } else {
                await mm.insertContentStorageRecord(  {  thisDb: thisDb  ,  ipfsHash: justHash  ,  contentType: contentType  ,  temp_debug_content: content , scope: scope }  )
                metadata = {
                    ipfs_hash:              justHash,
                    content_type:           contentType,
                    scope:                  scope,
                    stored_in_local_file:   1,
                    read_from_local_file:   0,
                    stored_in_ipfs:         0,
                    sent_to_peer:           0,
                    read_from_local_ipfs:   0,
                    read_from_peer_ipfs:    0,
                    read_from_peer_file:    0,
                    last_ipfs_ping_millis:  -1
                }
                fs.writeFileSync(fullIpfsFilePath, contentValueToStore);
if (metadata.content_type==null)
{
    debugger
}
                fs.writeFileSync(fullIpfsMetaDataFilePath, JSON.stringify(metadata,null,2));

            }



            return {value: justHash, error: null}



        // flag if there was an error
        } catch (error) {
            //outputDebug(error)
            return {value: justHash, error: error}
        }



        // return the IPFS hash of the content
        return {value: justHash, error: null}
},

    // distributed content helpers for stuff stored in IPFS
    findLocallyCachedIpfsContent:   async function  (  thisDb  ) {
        //---------------------------------------------------------------------------
        //
        //                           findLocallyCachedIpfsContent(  )
        //                           --------------------------------
        //
        // This is called when we start up the system, and it checks the IPFS cache
        // directory which has been populated previously by Yazz. This directory uses
        // the IPFS key as the filename and the files contents is the IPFS content
        // that has been hashed
        //
        //---------------------------------------------------------------------------
        let mm = this
        let yz = this
        fs.readdir(
            mm.fullIpfsFolderPath
            ,
            async function (err, files) {
                if (err) {
                    return console.error(err);
                }

                for (let fileindex=0;fileindex<files.length;fileindex++) {
                    let ipfsHashFileName = files[fileindex]
                    if (ipfsHashFileName.length > 10) {
                        try
                        {
                            //console.log("ipfsHashFileName: " + ipfsHashFileName);

                            let fullFileName = path.join(mm.fullIpfsFolderPath, ipfsHashFileName)
                            let ipfsContent = fs.readFileSync(fullFileName, 'utf8')

                            let itemType = yz.helpers.getValueOfCodeString(ipfsContent,"component_type")
                            if (itemType == "COMPONENT_COMMENT") {
                                let formatType = yz.helpers.getValueOfCodeString(ipfsContent,"format")
                                if (formatType == "JSON") {
                                    let jsonComment = JSON.parse(ipfsContent)
                                    await mm.insertCommentIntoDb(
                                        thisDb
                                        ,
                                        {
                                            baseComponentId:        jsonComment.base_component_id,
                                            baseComponentIdVersion: jsonComment.base_component_id_version,
                                            newComment:             jsonComment.comment,
                                            newRating:              jsonComment.rating,
                                            dateAndTime:            jsonComment.date_and_time
                                        }
                                    )
                                }
                            } else if (itemType == "APP") {
                                await mm.getDistributedContent({ thisDb: thisDb, ipfsHash: ipfsHashFileName })
                            }
                            //console.log("ipfsHashFileName : " + ipfsHashFileName + " read");
                        }
                        catch(exp)
                        {
                            console.log("ipfsHashFileName : " + ipfsHashFileName + " ERROR!" + exp);
                        }

                    }
                }
            })

    },
    distributeContentToPeer:        async function  (  ipfs_hash  ,  ipfsContent  ) {
        //---------------------------------------------------------------------------
        //
        //                           distributeContentToPeer(  )
        //                           ---------------------------
        //
        // What this function does is that it sends a piece of content to a "peer",
        // which is by default the central Yazz server
        //
        //---------------------------------------------------------------------------
        let mm = this
        if ((!mm.centralhost) || (!mm.centralhostport)) {
            return
        }

        let promise     = new Promise(async function(returnfn) {
            try {
                const dataString = JSON.stringify(
                    {
                        ipfs_hash:      ipfs_hash,
                        ipfs_content:   ipfsContent
                    })

                let options = {
                    host:       mm.centralhost,
                    port:       mm.centralhostport,
                    path:       '/http_post_copy_distributed_content_sent_from_client',
                    method:     'POST',
                    headers:    {
                                    'Content-Type': 'application/json',
                                    'Content-Length': dataString.length
                                }
                };

                let theHttpsConn = http
                if (mm.centralhosthttps) {
                    theHttpsConn = https
                }
                let req = theHttpsConn.request(options, function(res) {
                    console.log('STATUS: ' + res.statusCode);
                    console.log('HEADERS: ' + JSON.stringify(res.headers));
                    res.setEncoding('utf8');
                    res.on('data', function (chunk) {
                        console.log('BODY: ' + chunk);
                    });
                    res.on('end', function () {
                        console.log('end: ' );
                    });
                });
                req.write(dataString)
                req.end()
                returnfn()
            } catch(er) {
                console.log(er)
                returnfn()
            }
        })
        await promise
    },
    insertContentStorageRecord:     async function  (  {  thisDb  ,  ipfs_hash  ,  content_type  ,  scope , last_ipfs_ping_millis  ,  temp_debug_content  ,  stored_in_local_file:   stored_in_local_file,  read_from_local_file  ,  stored_in_ipfs  ,  sent_to_peer  ,  read_from_local_ipfs  ,  read_from_peer_ipfs  ,  read_from_peer_file  ,  last_ipfs_ping     }  ) {
        //---------------------------------------------------------------------------
        //
        //                           insertContentStorageRecord( )
        //                           -----------------------
        //
        // This inserts ONLY the IPFS content KEY in the internal database. This
        // database lets us keep track of which IPFS hashes have been cached on
        // the local machine on the filesystem
        //
        //---------------------------------------------------------------------------

        let promise = new Promise(async function(returnfn) {
            try {
                thisDb.serialize(function() {
                    thisDb.run("begin exclusive transaction");
                    stmtInsertIpfsHash.run(  ipfs_hash,  content_type,  scope,  last_ipfs_ping_millis , temp_debug_content , stored_in_local_file,  read_from_local_file  ,  stored_in_ipfs  ,  sent_to_peer  ,  read_from_local_ipfs  ,  read_from_peer_ipfs  ,  read_from_peer_file  ,  last_ipfs_ping_millis )
                    thisDb.run("commit")
                    returnfn()
                })
            } catch(er) {
                console.log(er)
                returnfn()
            }
        })
        let ret = await promise
        return ret
    },
    saveItemToIpfs:                 async function  (  srcCode  ) {
        //---------------------------------------------------------------------------
        //
        //                           saveItemToIpfs( .. )
        //                           --------------------
        //
        // This is only called from the fn "setDistributedContent( )" if we choose
        // to store data in IPFS
        //
        //---------------------------------------------------------------------------
        let promise = new Promise(async function(returnfn) {
            let justHash = null
            try {
                justHash                = await OnlyIpfsHash.of(  srcCode  )
                let fullIpfsFilePath    = path.join(  fullIpfsFolderPath  ,  justHash  )

                fs.writeFileSync(  fullIpfsFilePath  ,  srcCode  );
                await yz.insertContentStorageRecord(  { thisDb: dbsearch  ,  ipfs_hash: justHash  ,  temp_debug_content: srcCode  , scope: "LOCAL"}  )
                await yz.distributeContentToPeer(  justHash  ,  srcCode  )

                if (  isIPFSConnected  ) {
                    let testBuffer = new Buffer(  srcCode  );
                    ipfs.files.add(  testBuffer  ,  function (  err  ,  file  ) {
                        if (err) {
                            console.log("....................................Err: " + err);
                        }
                        console.log("....................................file: " + JSON.stringify(file, null, 2))
                        let thehash = file[0].hash
                        //const validCID = "QmdQASbsK8bF5DWUxUJ5tBpJbnUVtKWTsYiK4vzXg5AXPf"
                        const validCID = thehash

                        ipfs.files.get(validCID, function (err, files) {
                            files.forEach((file) => {
                                //console.log("....................................file.path: " + file.path)
                                //console.log(file.content.toString('utf8'))
                                //console.log("....................................file.path: " + file.path)
                                returnfn(thehash)
                            })
                        })
                    })
                } else {
                    returnfn(justHash)
                }

            } catch (error) {
                outputDebug(error)
                returnfn(justHash)
            }
        })
        let ipfsHash = await promise
        return ipfsHash
    },
    checkIfPeerAvailable:           async function  (  ) {
        //---------------------------------------------------------------------------
        //
        //                           checkIfPeerAvailable( .. )
        //                           --------------------------
        //
        //
        //---------------------------------------------------------------------------
        let mm = this

        mm.peerAvailable = false
        if ((!mm.centralhost) || (!mm.centralhostport)) {
            return
        }
        console.log("peer NOT available")

        let promise     = new Promise(async function(returnfn) {
            try {
                let aliveCheckUrl = "http" + (mm.centralhosthttps ? "s" : "") + "://" + mm.centralhost  + ":" + mm.centralhostport + "/http_get_peer_alive_check"

                let theHttpsConn = http
                if (mm.centralhosthttps) {
                    theHttpsConn = https
                }
                console.log("Send alive check to " + mm.centralhost + ":" + mm.centralhostport)
                let req = theHttpsConn.get(
                    aliveCheckUrl
                    ,
                    async function(res) {
                        //console.log('STATUS: ' + res.statusCode);
                        //console.log('HEADERS: ' + JSON.stringify(res.headers));
                        if (res.statusCode == 200 ) {
                            console.log("peer available")
                            peerAvailable = true
                        } else {
                            console.log("peer NOT available. HTTP return code: " +  res.statusCode )
                            peerAvailable = false
                        }
                });
                returnfn()
            } catch(er) {
                console.log(er)
                returnfn()
            }
        })
        await promise
    },
    synchonizeContentAmongPeers:    async function  (  thisDb  ) {
        //---------------------------------------------------------------------------
        //
        //                           synchonizeContentAmongPeers( .. )
        //                           ---------------------------------
        //
        // In this method we try to make sure that all the content is synchronized
        // locally, to peer Yazz servers, and to IPFS
        //
        //---------------------------------------------------------------------------
        console.log("Sync called")
        if (mm.peerAvailable) {

        }

    },
    oldsynchonizeContentAmongPeers:    async function  (  thisDb  ) {
        console.log("Sync")
        let contentNotSentToPeer = await this.getQuickSql(thisDb, "select  ipfs_hash  from  ipfs_hashes  where  sent_to_peer = 0 limit 1", params)
        if (rows.length == 0) {
            return null
        }
        await mm.distributeContentToPeer(justHash, content)

        if (mm.isIPFSConnected) {
            let testBuffer = new Buffer(content);
            ipfs.files.add(testBuffer, function (err, file) {
                if (err) {
                    console.log("....................................Err: " + err);
                }
                //console.log("....................................file: " + JSON.stringify(file, null, 2))
                let thehash = file[0].hash
                //const validCID = "QmdQASbsK8bF5DWUxUJ5tBpJbnUVtKWTsYiK4vzXg5AXPf"
                const validCID = thehash

                ipfs.files.get(validCID, function (err, files) {
                    files.forEach((file) => {
                        //console.log("....................................file.path: " + file.path)
                        //console.log(file.content.toString('utf8'))
                        //console.log("....................................file.path: " + file.path)
                        returnfn({value: thehash, error: null})
                    })
                })
            })
        }







        let promise = new Promise(async function (returnfn) {
            try {
                let fullIpfsFilePath    = path.join(mm.fullIpfsFolderPath, ipfsHash)
                let srcCode             = fs.readFileSync(fullIpfsFilePath);
                let baseComponentId     = yz.helpers.getValueOfCodeString(srcCode, "base_component_id")



                await mm.addOrUpdateDriver(
                    thisDb
                    ,
                    srcCode
                    ,
                    {
                        username:           "default",
                        reponame:           baseComponentId,
                        version:            "latest",
                        ipfsHashId:         ipfsHash,
                        allowChanges:       false,
                        distributeToPeer:   false
                    })

                //console.log("....................................Loading component from local IPFS cache: " + fullIpfsFilePath)
                returnfn("Done")

            } catch (error) {
                try {

                    ipfs.files.get(ipfsHash, function (err, files) {
                        files.forEach(async function (file) {
                            console.log("....................................Loading component from IPFS: " + file.path)
                            //console.log(file.content.toString('utf8'))
                            srcCode = file.content.toString('utf8')


                            let baseComponentId = yz.helpers.getValueOfCodeString(srcCode, "base_component_id")


                            let properties = yz.helpers.getValueOfCodeString(srcCode, "properties", ")//prope" + "rties")
                            srcCode = yz.helpers.deleteCodeString(srcCode, "properties", ")//prope" + "rties")
                            for (let irte = 0; irte < properties.length; irte++) {
                                let brje = properties[irte]
                                if (brje.id == "ipfs_hash_id") {
                                    brje.default = ipfsHash
                                }
                            }

                            srcCode = yz.helpers.insertCodeString(srcCode,
                                "properties",
                                properties,
                                ")//prope" + "rties")


                            let fullIpfsFilePath = path.join(fullIpfsFolderPath, ipfsHash)
                            fs.writeFileSync(fullIpfsFilePath, srcCode);

                            await addOrUpdateDriver(srcCode, {
                                username: "default",
                                reponame: baseComponentId,
                                version: "latest",
                                ipfsHashId: ipfsHash,
                                allowChanges: false
                            })

                            console.log("....................................Loading component fro IPFS: " + file.path)
                        })
                        returnfn("Done")
                    })
                } catch (error) {
                    outputDebug(error)
                }
            }


        })
        let ret = await promise
        return ret

    }

}
