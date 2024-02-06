const OnlyIpfsHash                              = require("ipfs-only-hash");
const path                                      = require("path");
const crypto                                    = require('crypto');

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
//backtick = `





const ipfsAPI = require('ipfs-api');
const async = require("async");
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

        stmtInsertComment = thisDb.prepare(" insert or replace into level_2_comments_and_ratings " +
            "    (id, base_component_id, version , comment, rating, date_and_time, content_hash) " +
            " values " +
            "    (?,?,?,?,?,?,?);");


        stmtDeleteTypesForComponentProperty = thisDb.prepare(
            " delete from  level_3_component_property_types   where   base_component_id = ?");
        stmtDeleteAcceptTypesForComponentProperty = thisDb.prepare(
            " delete from  level_3_property_accept_types   where   base_component_id = ?");
        stmtInsertAppDDLRevision = thisDb.prepare(
            " insert into level_4_app_db_latest_ddl_revisions " +
            "      ( base_component_id,  latest_revision  ) " +
            " values " +
            "      ( ?,  ? );");
        stmtUpdateLatestAppDDLRevision = thisDb.prepare(
            " update  level_4_app_db_latest_ddl_revisions  " +
            "     set  latest_revision = ? " +
            " where " +
            "     base_component_id =  ? ;");
        copyMigration = thisDb.prepare(
            `insert into  level_4_app_db_latest_ddl_revisions
               (base_component_id,latest_revision)
            select ?,  latest_revision from level_4_app_db_latest_ddl_revisions
             where base_component_id=?`
        );

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
    msToTime:                       function        (   duration   ,   options  ) {
        if (!duration) {
            return ""
        }
        let ret = new Date(duration).toUTCString()

        let ret2 = ""

        let currentTime = new Date().getTime()

        let timeDiffSecs = (currentTime - duration) / 1000
        let timeDiffMins = timeDiffSecs / 60
        let timeDiffHours = timeDiffMins / 60
        let timeDiffDays = timeDiffHours / 24
        if (timeDiffSecs < 60) {
            ret2 = ret2 + "a few seconds ago"
        } else if (timeDiffMins < 10) {
            ret2 = ret2 + "a few minutes ago"
        } else if (timeDiffMins < 30) {
            ret2 = ret2 + "less than half an hour ago"
        } else if (timeDiffMins < 60) {
            ret2 = ret2 + "under an hour ago"
        } else if (timeDiffHours < 10) {
            ret2 = ret2 + "a few hours ago"
        } else if (timeDiffDays < 2) {
            ret2 = ret2 + "yesterday"
        } else if (timeDiffDays < 10) {
            ret2 = ret2 + "a few days ago"
        }

        if (options && options.timeOnly) {
        } else if (options && options.shortOnly) {
            ret = ret2
        } else {
            ret =  ret2 +  " (" + ret + ")"
        }

        return ret
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
                async function() {
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
    tagVersion:                     async function  (  thisDb  ,  content_hash  ,  srcCode  ) {
        let yz = this
        let baseComponentId = yz.helpers.getValueOfCodeString(srcCode,"base_component_id")
        let dateTime = new Date().getTime()
        await this.executeQuickSql(thisDb,
            `insert into 
                level_4_code_tags_table 
            (id , base_component_id , code_tag , code_tag_value, fk_system_code_id)
                values
            (?,?,?,?,?) 
            `
            ,
            [ uuidv1()  ,  baseComponentId  , "PROD" , dateTime,  content_hash])
    },
    getCodeForCommit:               async function  (  thisDb  ,  commitId  ) {
        let thisCommit = await this.getQuickSqlOneRow(thisDb,  "select  *  from   level_2_system_code  where   id = ? ", [  commitId  ])
        if (thisCommit) {
            return thisCommit.code
        }

        return null
    },
    updateDbSchemaFromSave:                function        (  thisDb  ,  sqlite  ,  baseComponentId  ) {
        //----------------------------------------------------------------------------------/
        //
        //                    /-------------------------------------/
        //                   /         updateDbSchemaFromSave      /
        //                  /-------------------------------------/
        //
        //----------------------------------------------------------------------------/
        // This updates the schema for an app (mostly from when saving code)
        //
        //________
        // PARAMS \______________________________________________________________/
        //
        //    thisDb                The handle to the main yazz DB
        //    ------
        //
        //    sqlite                The list of SQL migrations, taken from the source
        //    ------                code:
        //
        //                              sqlite(
        //                              {
        //                                  migrations:
        //                                  [
        //                                  ...
        //
        //    baseComponentId       The BCI of the app to fast forward
        //    ---------------
        //
        //-------------------------------------------------------/
        let mm = this
        try {

            thisDb.serialize(
                function() {
                    thisDb.all(
                        "SELECT  *  from  level_4_app_db_latest_ddl_revisions  where  base_component_id = ? ; "
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
    updateDbSchemaFromFileUpload:    function        (  thisDb  ,  sqlite  ,  baseComponentId  ) {
        //----------------------------------------------------------------------------------/
        //
        //                    /-------------------------------------/
        //                   /      updateDbSchemaFromFileUpload   /
        //                  /-------------------------------------/
        //
        //----------------------------------------------------------------------------/
        // This updates the schema for an app when uploading code
        //
        //________
        // PARAMS \______________________________________________________________/
        //
        //    thisDb                The handle to the main yazz DB
        //    ------
        //
        //    sqlite                The list of SQL migrations, taken from the source
        //    ------                code:
        //
        //                              sqlite(
        //                              {
        //                                  migrations:
        //                                  [
        //                                  ...
        //
        //    baseComponentId       The BCI of the app to fast forward
        //    ---------------
        //
        //-------------------------------------------------------/
        try {

            thisDb.serialize(
                function() {
                    thisDb.all(
                        "SELECT  *  from  level_4_app_db_latest_ddl_revisions  where  base_component_id = ? ; "
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
                            if (sqlite.migrations) {
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
        await mm.executeQuickSql(thisDb," delete from  level_3_component_property_types   where   base_component_id = ?",[baseComponentId]);
        await mm.executeQuickSql(thisDb," delete from  level_3_property_accept_types   where   base_component_id = ?", [baseComponentId]);

        if (properties) {
            for (let rttte = 0; rttte < properties.length ; rttte++ ) {
                let prop = properties[rttte]

                if (prop.types) {
                    let labelKeys = Object.keys(prop.types)
                    for (let rttte2 = 0; rttte2 < labelKeys.length ; rttte2++ ) {
                        await mm.executeQuickSql(thisDb,`insert or ignore
                                                    into
                                               level_3_component_property_types
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
                                               level_3_property_accept_types
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
    isNumeric:                      function        (  str  ) {
        if (typeof str != "string") return false // we only process strings!
        return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
            !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
    },
    setGlobalVar:                   async function  (  thisDb  ,  key  ,  type,  value  ) {
        let mm              = this
        let valueToStore    = null
        let typeToStore     = null
        let keyToStore      = "" + key

        if (type=="INTEGER") {
            valueToStore = "" + value
            typeToStore = "INTEGER"
        } else if (type=="STRING") {
            valueToStore = value
            typeToStore = "STRING"
        } else {
            console.log("Error in setGlobalVar")
        }
        await mm.executeQuickSql(thisDb,
            `INSERT OR REPLACE INTO  
                level_4_global_vars_table           
                (
                    global_key, 
                    global_value_type,
                    global_value
                )
            VALUES
                (?,?,?)
                `,
            [keyToStore, typeToStore, valueToStore])
    } ,
    getGlobalVar:                   async function  (  thisDb  ,  key  ) {
        let mm              = this
        let keyToRead       = "" + key
        let valueToReturn   = null

        let globalRecord = await mm.getQuickSqlOneRow(thisDb,
            `SELECT 
                global_value_type,
                global_value
            FROM
                level_4_global_vars_table
            WHERE
                global_key = ?         
                `,
            [keyToRead])

        if (!globalRecord) {
            return {value:null, error: "Doesn't exist"}
        }
        if (globalRecord.global_value_type == "STRING") {
            valueToReturn = globalRecord.global_value
        } else if (globalRecord.global_value_type == "INTEGER") {
            valueToReturn = parseInt(globalRecord.global_value)
        } else {
            return {value:null, error: "Unknown type returned: " + globalRecord.global_value_type}
        }
        return {value: valueToReturn}
    },
    insertNewCode:                  async function  (  thisDb,  {  sha1sum  ,  parentHash  ,  code  ,  baseComponentId  ,  displayName  ,  updatedTimestamp  ,  logoUrl  ,  visibility  ,  useDb  ,  editors  ,  readWriteStatus  ,  propertiesAsJsonString  ,  controlType  ,  save_code_to_file  ,  codeChangesStr  ,  numCodeChanges  ,  userId  ,  stampedAs  }  ) {
        let mm = this
        mm.executeQuickSql(
            thisDb,
            `insert into
                 level_2_system_code  
                     (id, parent_id, code, base_component_id, 
                      display_name, creation_timestamp, 
                      logo_url, visibility,use_db, editors, read_write_status,properties, 
                      component_type, edit_file_path, 
                      code_changes, num_changes, fk_user_id, score, score_reason,
                      stamped_as) 
              values 
                (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
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
                "1 point for being committed",
                stampedAs
            ]
        )

        
        mm.executeQuickSql(
            thisDb,
            `insert into
                 level_2_content_hash_to_db_key_mapping  
                     (content_hash,db_table_type,table_key) 
              values 
                (?,?,?)`
            ,
            [sha1sum,"CODE",sha1sum]
        )
    },
    createTables:                   async function  (  dbsearch  ,  callbackFn  ) {
        //console.log("--------------- createTables: function(dbsearch, callbackFn) {");
        let mm = this

        let tablesAlreadyExist = await mm.getQuickSqlOneRow(
            dbsearch,
            "SELECT name FROM sqlite_master WHERE type='table' AND name=?;",
            ["table_versions"])

        let sqlTorun = []
        if (tablesAlreadyExist) {
        } else {
            sqlTorun = sqlTorun.concat([
                    "CREATE TABLE IF NOT EXISTS table_versions                      (table_name TEXT, version_number INTEGER , PRIMARY KEY (table_name));",

                    //   LEVEL 0
                    //  This content may be moved into another Sqlite database eventually
                    //
                    "CREATE TABLE IF NOT EXISTS level_0_cached_content              (content_hash TEXT, yazz_content TEXT,  UNIQUE(content_hash));",
                    "INSERT OR REPLACE INTO     table_versions                      (table_name  ,  version_number) VALUES ('level_0_cached_content',1);",
                    "CREATE INDEX IF NOT EXISTS level_0_cached_content_idx          ON level_0_cached_content (content_hash);",


                    //   LEVEL 1
                    //  This could be store in another Sqlite database, but it could also be derived from that data
                    //
                    "CREATE TABLE IF NOT EXISTS level_1_content_metadata            (content_hash TEXT  ,  status TEXT  ,  process_attempts INTEGER, content_type TEXT  ,  scope TEXT  ,  stored_in_ipfs INTEGER  ,  sent_to_master TEXT  ,  read_from_local_ipfs INTEGER,  error TEXT , last_ipfs_ping_millis INTEGER,  temp_debug_content TEXT,  UNIQUE(content_hash));",
                    "INSERT OR REPLACE INTO     table_versions                      (table_name  ,  version_number) VALUES ('level_1_content_metadata',1);",
                    "CREATE INDEX IF NOT EXISTS level_1_content_metadata_idx        ON level_1_content_metadata (content_hash);",


                    //   LEVEL 2
                    //  This can all be derived from the IPFS content data. It is useful to keep around, but can be deleted
                    //
                    "CREATE TABLE IF NOT EXISTS level_2_content_hash_to_db_key_mapping          (content_hash TEXT, db_table_type TEXT, table_key TEXT, UNIQUE(content_hash,db_table_type,table_key));",
                    "INSERT OR REPLACE INTO     table_versions                      (table_name  ,  version_number) VALUES ('level_2_content_hash_to_db_key_mapping',1);",

                    "CREATE TABLE IF NOT EXISTS level_2_system_code                 (id TEXT, base_component_id TEXT, display_name TEXT, component_type TEXT, creation_timestamp INTEGER, parent_id TEXT, stamped_as TEXT, fk_user_id TEXT,code TEXT,  logo_url TEXT, visibility TEXT, use_db TEXT, editors TEXT, read_write_status TEXT, properties TEXT, edit_file_path TEXT,  num_changes INTEGER, code_changes TEXT, last_read_from_ipfs INTEGER, score INTEGER, score_reason TEXT, score_total INTEGER);",
                    "CREATE INDEX IF NOT EXISTS system_code_base_component_id_idx   ON level_2_system_code (base_component_id);",
                    "CREATE INDEX IF NOT EXISTS system_code_id_idx                  ON level_2_system_code (id);",
                    "CREATE INDEX IF NOT EXISTS system_code_logo_url_idx            ON level_2_system_code (logo_url);",
                    "CREATE INDEX IF NOT EXISTS system_code_component_type_idx      ON level_2_system_code (component_type);",
                    "INSERT OR REPLACE INTO     table_versions                      (table_name  ,  version_number) VALUES ('level_2_system_code',1);",

                    "CREATE TABLE IF NOT EXISTS level_2_released_components         (id TEXT, base_component_id TEXT, component_name TEXT, component_scope TEXT, read_write_status TEXT, component_type TEXT, content_hash TEXT,  version TEXT,  component_description TEXT, logo_url TEXT, avg_rating NUMBER, num_ratings NUMBER, json_ipfs_hash TEXT, code TEXT, local_time_ms INTEGTER);",
                    "CREATE INDEX IF NOT EXISTS released_components_idx             ON level_2_released_components (id);",
                    "INSERT OR REPLACE INTO     table_versions                      (table_name  ,  version_number) VALUES ('level_2_released_components',1);",

                    "CREATE TABLE IF NOT EXISTS level_2_comments_and_ratings        (id TEXT, base_component_id TEXT, comment TEXT, rating TEXT, version TEXT, content_hash TEXT, date_and_time INTEGER);",
                    "CREATE INDEX IF NOT EXISTS comments_and_ratings_idx            ON level_2_comments_and_ratings (id);",
                    "INSERT OR REPLACE INTO     table_versions                      (table_name  ,  version_number) VALUES ('level_2_comments_and_ratings',1);",




                    //   LEVEL 3
                    //  This can all helper data about apps and components and is derived from the components
                    //
                    "CREATE TABLE IF NOT EXISTS level_3_component_property_types    (base_component_id TEXT, property_name TEXT,  outputs_type TEXT );",
                    "INSERT OR REPLACE INTO     table_versions                      (table_name  ,  version_number) VALUES ('level_3_component_property_types',1);",

                    "CREATE TABLE IF NOT EXISTS level_3_property_accept_types       (base_component_id TEXT, property_name TEXT,  accept_type TEXT );",
                    "INSERT OR REPLACE INTO     table_versions                      (table_name  ,  version_number) VALUES ('level_3_property_accept_types',1);",




                    //   LEVEL 4
                    //  This is information that is used at runtime, but needs to survive a server restart if possible
                    //
                    "CREATE TABLE IF NOT EXISTS level_4_app_allow_co_access         (id TEXT, code_id TEXT, give_access_to_code_id TEXT , access_type TEXT);",
                    "INSERT OR REPLACE INTO     table_versions                      (table_name  ,  version_number) VALUES ('level_4_app_allow_co_access',1);",

                    "CREATE TABLE IF NOT EXISTS level_4_app_db_latest_ddl_revisions (base_component_id TEXT , latest_revision TEXT);",
                    "INSERT OR REPLACE INTO     table_versions                      (table_name  ,  version_number) VALUES ('level_4_app_db_latest_ddl_revisions',1);",

                    "CREATE TABLE IF NOT EXISTS level_4_cookies                     (id TEXT, created_timestamp INTEGER, cookie_name TEXT, cookie_value TEXT, fk_session_id TEXT, host_cookie_sent_to TEXT, from_device_type TEXT);",
                    "CREATE INDEX IF NOT EXISTS cookies_cookie_value_idx            ON level_4_cookies (cookie_value);",
                    "INSERT OR REPLACE INTO     table_versions                      (table_name  ,  version_number) VALUES ('level_4_cookies',1);",

                    "CREATE TABLE IF NOT EXISTS level_4_sessions                    (id TEXT, created_timestamp INTEGER, last_accessed INTEGER, access_count INTEGER, fk_user_id TEXT);",
                    "CREATE INDEX IF NOT EXISTS sessions_id_idx                     ON level_4_sessions (id);",
                    "INSERT OR REPLACE INTO     table_versions                      (table_name  ,  version_number) VALUES ('level_4_sessions',1);",

                    "CREATE TABLE IF NOT EXISTS level_4_metamask_logins             (id TEXT, account_id TEXT, random_seed TEXT, created_timestamp INTEGER, confirmed_login TEXT, fk_session_id TEXT);",
                    "CREATE INDEX IF NOT EXISTS metamask_logins_id_idx              ON level_4_metamask_logins (id);",
                    "INSERT OR REPLACE INTO     table_versions                      (table_name  ,  version_number) VALUES ('level_4_metamask_logins',1);",

                    "CREATE TABLE IF NOT EXISTS level_4_users                       (id TEXT, user_type TEXT);",
                    "CREATE INDEX IF NOT EXISTS users_id_idx                        ON level_4_users (id);",
                    "INSERT OR REPLACE INTO     table_versions                      (table_name  ,  version_number) VALUES ('level_4_users',1);",

                    "CREATE TABLE IF NOT EXISTS level_4_code_tags_table             (id TEXT, base_component_id TEXT, code_tag TEXT, code_tag_value TEXT, fk_system_code_id TEXT, fk_user_id TEXT, main_score INTEGER);",
                    "CREATE INDEX IF NOT EXISTS code_tags_id_idx                    ON level_4_code_tags_table (id);",
                    "INSERT OR REPLACE INTO     table_versions                      (table_name  ,  version_number) VALUES ('level_4_code_tags_table',1);",

                    "CREATE TABLE IF NOT EXISTS level_4_global_vars_table           (global_key TEXT, global_value_type TEXT, global_value TEXT  ,  UNIQUE(global_key));",
                    "CREATE INDEX IF NOT EXISTS code_tags_id_idx                    ON level_4_global_vars_table (global_key);",
                    "INSERT OR REPLACE INTO     table_versions                      (table_name  ,  version_number) VALUES ('level_4_global_vars_table',1);"
            ])
        }

        //
        // add the temp table for each server run
        //
        sqlTorun = sqlTorun.concat([
            "DROP TABLE  IF EXISTS      level_8_system_process_info;",
            "CREATE TABLE IF NOT EXISTS level_8_system_process_info     (yazz_instance_id	TEXT, process	TEXT, process_id	TEXT, callback_index INTEGER, running_since	TEXT, status TEXT , component_type TEXT, running_start_time_ms INTEGER, event_duration_ms INTEGER, job_priority INTEGER, system_code_id TEXT, PRIMARY KEY (yazz_instance_id, process));",
            "INSERT OR REPLACE INTO     table_versions                  (table_name  ,  version_number) VALUES ('level_8_system_process_info',1);",

            "DROP TABLE IF EXISTS       level_8_system_process_errors;",
            "CREATE TABLE IF NOT EXISTS level_8_system_process_errors   (yazz_instance_id	TEXT, id TEXT, timestamp INTEGER, process	TEXT, status TEXT , base_component_id TEXT, event TEXT, system_code_id TEXT, args TEXT, error_message TEXT);",
            "INSERT OR REPLACE INTO     table_versions                  (table_name  ,  version_number) VALUES ('level_8_system_process_errors',1);",

            "DROP TABLE IF EXISTS       level_8_download_content_queue;",
            "CREATE TABLE IF NOT EXISTS level_8_download_content_queue  (content_hash TEXT, master_time_millis INTEGER, lcreated_time_millis INTEGER, status TEXT, server TEXT, read_from TEXT, time_read_millis INTEGER  ,  debug_master_time_millis TEXT,  debug_content TEXT, UNIQUE(content_hash));",
            "INSERT OR REPLACE INTO     table_versions                  (table_name  ,  version_number) VALUES ('level_8_download_content_queue',1);",

            "DROP TABLE IF EXISTS       level_8_upload_content_queue;",
            "CREATE TABLE IF NOT EXISTS level_8_upload_content_queue    (content_hash TEXT, send_status TEXT, server TEXT, attempts INTEGER, created_timestamp TEXT, last_attempted_send TEXT, debug_content TEXT, UNIQUE(content_hash));",
            "INSERT OR REPLACE INTO     table_versions                  (table_name  ,  version_number) VALUES ('level_8_upload_content_queue',1);"
        ])
        await async.map(
            sqlTorun
            ,
            function(a,b){
                try {
                    dbsearch.serialize(function()
                    {
                        //console.log(a);
                        dbsearch.run(a);
                    });
                    return b(null,a);
                } catch(err) {
                    console.log(err);
                    return b(null,a);
                }
            },

            function(err, results){
                callbackFn.call(this);
            });

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
        let ipfsHashId              = await yz.getDistributedKey(code)
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
    getYazzContentHash:                    async function  (  sometext  ) {
        let yz = this
        let contentHash = await yz.getDistributedKey(sometext)
        return contentHash
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
        let sha1sum                                 = await yz.getDistributedKey(code)
        let userId                                  = null
        let propertiesAsJsonString                  = null
        let existingCodeAlreadyInSystemCodeTable
        let save_code_to_file                       = null
        let stampedAs                               = "SAVE"
        let commit                                  = yz.helpers.getValueOfCodeString(code,"commit")
        if (commit) {
            stampedAs = "COMMIT"
        }
        let release                                  = yz.helpers.getValueOfCodeString(code,"release")
        if (release) {
            stampedAs = "RELEASE"
        }

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
                     level_2_system_code 
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
                    let sha1sum2  = await yz.getDistributedKey(code)
                    if (sha1sum2 != sha1sum) {
                        console.log("Code SHA do not match - code has been changed while saving")
                        throw "Code SHA do not match - code has been changed while saving"
                    }

                    await mm.insertNewCode(
                        thisDb,
                        {
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
                            stampedAs
                        })

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

                    options.processingStatus = "PROCESSED"
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

                            if (sha1sum == "QmNPuLm2Bk4fAbYUieRJyMvWzcNNGgQrSqx24EYNJLvj9T") {
                                //debugger
                            }

                            let results = await mm.getSubComponents(code)
                            for (let i = 0  ;   i < results.length;    i ++ ) {
                                if (!results[i].child_code_id) {

                                    let sqlR = await mm.getQuickSqlOneRow(
                                        thisDb
                                        ,
                                        "select   content_hash as id,  code  from  level_2_released_components  where  base_component_id = ? "
                                        ,
                                        [  results[i].child_base_component_id  ])


                                    if (!sqlR) {
                                        sqlR = await mm.getQuickSqlOneRow(
                                            thisDb
                                            ,
                                            "select    id,  code  from  level_2_system_code  where  base_component_id = ?   order by   creation_timestamp desc   limit 1  "
                                            ,
                                            [  results[i].child_base_component_id  ])
                                    }
                                    if (sqlR) {
                                        results[i].sha1             = sqlR.id
                                        results[i].child_code_id    = results[i].sha1
                                    }


                                } else {
                                    results[i].sha1 = results[i].child_code_id
                                }

                                let sqlr2 = await mm.getQuickSqlOneRow(
                                    thisDb
                                    ,
                                    "select  code  from   level_2_system_code where id = ? "
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
                                mm.updateDbSchemaFromFileUpload(thisDb, sqlite, baseComponentId)

                            } else {
                                ////showTimer('updateDbSchemaFromSave(sqlite, baseComponentId)')
                                ////showTimer('    ' + JSON.stringify(options,null,2))
                                mm.updateDbSchemaFromSave(thisDb, sqlite, baseComponentId)
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
                    returnFn( {
                        code_id:            sha1sum,
                        base_component_id:  baseComponentId
                    })
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
    getDebugTimestampText:          function        (  ) {
        let dt = new Date().getTime()
        let rt = this.msToTime(dt)
        return rt
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

    // request helpers
    sendQuickJsonGetRequest:        async function  (  url  ,  urlParams  ) {
        let mm = this
        let urlParamsWithoutNulls = {}
        for (let paramItemKey of Object.keys(urlParams)) {
            if (mm.isValidObject(urlParams[paramItemKey])) {
                urlParamsWithoutNulls[  paramItemKey  ] = urlParams[paramItemKey]
            }
        }
        let centralServerUrl = "http" + (mm.centralhosthttps ? "s" : "") + "://" + mm.centralhost + ":" + mm.centralhostport +
            "/" + url  + "?" +
            new URLSearchParams(urlParamsWithoutNulls)

        let promise = new Promise(async function (returnfn) {
            fetch(centralServerUrl, {
                method: 'get',
                credentials: "include"
            })
                .then((response) => response.json())
                .then(async function (responseJson) {
                    returnfn(responseJson)
                })
                .catch(err => {
                    //error block
                    returnfn()
                })
        })

        let ret = await promise
        return ret

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
                level_4_code_tags_table  
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
                    level_4_code_tags_table  
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
                level_2_system_code  
            where 
                parent_id = ? `
            ,
            [codeId])

        if (descendants.descendant_count > 0) {
            await mm.executeQuickSql(
                thisDb
                ,
                `delete from 
                    level_4_code_tags_table  
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
                    level_4_code_tags_table 
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
                level_4_code_tags_table 
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
                   level_4_code_tags_table
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
                level_4_code_tags_table
                    (   id   ,   base_component_id   ,   code_tag   ,   code_tag_value   ,   fk_system_code_id   ,   fk_user_id   ) 
                values ( ?, ?, ?, ?, ? , ?)`
                ,
                [  uuidv1()   ,      baseComponentId   ,     "EDIT"      ,     userId   ,   sha1sum     ,      userId    ]
            )
        }
    },
    createLogoUrlData:              async function  (  logo  ) {
        /*
        ________________________________________
        |                                      |
        |           createLogoUrlData          |
        |                                      |
        |______________________________________|
        Used to add an image to the image registry
        __________
        | PARAMS |______________________________________________________________
        |
        |     imageUrl
        |     --------      Data URI or file path
        |________________________________________________________________________ */

        let dataString          = null
        let fullPath
        let imageExtension
        let logoFileIn

        if (logo) {
            if (logo.startsWith("data:")) {
                dataString = logo
            } else if (logo.startsWith("http")) {
            } else {
                fullPath        = path.join(__dirname, "../public" + logo)
                logoFileIn      = fs.readFileSync(fullPath);
                dataString      = new Buffer(logoFileIn).toString('base64');
                imageExtension  = logo.substring(logo.lastIndexOf(".") + 1)
                dataString      = "data:image/" + imageExtension + ";base64," + dataString
            }
        }
        return dataString
    },
    releaseCode:                    async function  (  thisDb  ,  commitId  ,  options  ) {
        /*
        ________________________________________
        |                                      |
        |            releaseCode               |
        |                                      |
        |______________________________________|
        Used to release code. This will try to make the current commit ID the live version of
        the code.
        __________
        | PARAMS |______________________________________________________________
        |
        |     commitId
        |     --------
        |________________________________________________________________________ */
        let mm                  = this
        let codeRecord          = await mm.getQuickSqlOneRow(  thisDb,  "select  code  from   level_2_system_code  where   id = ? ", [  commitId  ]  )
        if (codeRecord) {
            let codeString          = codeRecord.code
            let parsedCode          = await mm.getSrcCodePropertiesAsJson(  {  code: codeString  }  )
            let dataString          = null
            let id                  = uuidv1()
            let base_component_id   = parsedCode.baseComponentId
            let app_name            = parsedCode.name
            let app_description     = parsedCode.description
            let logo                = parsedCode.logo
            let content_hash           = parsedCode.ipfsHashId
            let readWriteStatus     = parsedCode.readWriteStatus
            let component_type      = parsedCode.type
            let createdTime         = new Date().getTime()
            let masterTime          = null
            let logoUrl             = await mm.createLogoUrlData(logo)
            let componentScope =    "GLOBAL"

            if (options && options.masterTime) {
                masterTime = options.masterTime
            }

            if (options && options.localOnly) {
                componentScope = "LOCAL"
            }


            let componentListRecord = await mm.getQuickSqlOneRow(
                thisDb,
                "select * from level_2_released_components where base_component_id = ?",
                [base_component_id])

            if (componentListRecord) {
                await mm.executeQuickSql(
                    thisDb,
                    `delete from
                    level_2_released_components 
                where
                   base_component_id  = ?`,
                    [base_component_id])
            }

            await mm.executeQuickSql(thisDb,
                `insert or ignore
                    into
               level_2_released_components
                    (   id  ,  base_component_id  ,  component_name  ,  component_type, 
                        component_scope,
                        component_description  ,  
                        content_hash , version,read_write_status, code, logo_url , local_time_ms)
               values (?,?,?,?,?,?,?,?,?,?,?,?)`,
                [
                    id,
                    base_component_id,
                    app_name,
                    component_type,
                    componentScope,
                    app_description,
                    content_hash,
                    '',
                    readWriteStatus,
                    codeString,
                    logoUrl,
                    createdTime
                ]
            )
            let previousMasterTime = await mm.getGlobalVar(thisDb,"RELEASED_MAX_MASTER_TIME_MS").value
            if (previousMasterTime && (previousMasterTime > masterTime)) {
            } else {
                await mm.setGlobalVar(thisDb,"RELEASED_MAX_MASTER_TIME_MS","INTEGER",masterTime)
            }


            return {error: null, value: {id: id}}




        //
        // otherwise return that the release didn't work, usually because the release need the corresponding
        // code record to exist as well
        //
        } else {
            return {error: "Code record does not exist yet", value: null}
        }
    },
    createLevel2RecordFromContent:  async function  (  {  thisDb  ,  contentHash  }  ) {
        let mm = this
        //
        //
        //
        try {
            let contentRecord = await mm.getQuickSqlOneRow(thisDb,"select  yazz_content  from  level_0_cached_content  where  content_hash = ?",[contentHash])
            if (contentRecord) {
                let returnValue = contentRecord.yazz_content
                if (returnValue) {
                    returnValue = returnValue.toString('utf8')
                    let baseComponentId = mm.helpers.getValueOfCodeString(returnValue, "base_component_id")
                    let componentType = mm.helpers.getValueOfCodeString(returnValue, "component_type")

                    let makePublic = false
                    let saveHtml = false
                    if (componentType == "APP") {
                        makePublic = true
                        saveHtml = true
                    }

                    //
                    // COMMENT
                    //
                    if (componentType == "COMPONENT_COMMENT") {
                        let formatType = mm.helpers.getValueOfCodeString(returnValue, "format")
                        if (formatType == "JSON") {
                            let jsonComment = JSON.parse(returnValue)
                            await mm.insertCommentIntoDb(
                                thisDb
                                ,
                                {
                                    codeId:                 jsonComment.component_hash_id,
                                    baseComponentId:        jsonComment.base_component_id,
                                    baseComponentIdVersion: jsonComment.base_component_id_version,
                                    newComment:             jsonComment.comment,
                                    newRating:              jsonComment.rating,
                                    dateAndTime:            jsonComment.date_and_time
                                }
                            )

                            await mm.executeQuickSql(thisDb,
                                `update 
                                    level_1_content_metadata
                                set 
                                    status = ?,
                                    process_attempts = process_attempts + 1 
                                where
                                    content_hash = ?
                                        `
                                ,
                                [  "PROCESSED"  ,  jsonComment.component_hash_id  ]
                            )
                        }


                    //
                    // RELEASE
                    //
                    } else if (componentType == "COMPONENT_RELEASE") {
                        let formatType = mm.helpers.getValueOfCodeString(returnValue, "format")
                        if (formatType == "JSON") {
                            let jsonRelease = JSON.parse(returnValue)
                            if (jsonRelease.component_hash_id) {
                                let releaseId = await mm.releaseCode(thisDb, jsonRelease.component_hash_id)

                                if (releaseId.value != null) {
                                    await mm.executeQuickSql(
                                        thisDb,
                                        `insert into 
                                            level_2_content_hash_to_db_key_mapping 
                                            (  
                                                content_hash  ,  db_table_type  ,  table_key  
                                            ) 
                                        values  
                                            ( ? , ? , ? ) `
                                        ,
                                        [  contentHash  ,  "RELEASE"  ,  releaseId.value.id  ]
                                    )
                                    await mm.executeQuickSql(
                                        thisDb,
                                        `update 
                                            level_2_released_components 
                                        set 
                                            json_ipfs_hash = ? 
                                        where
                                            id = ? 
                                        `
                                        ,
                                        [  contentHash  ,  releaseId.value.id  ]
                                    )

                                    await mm.executeQuickSql(thisDb,
                                        `update 
                                            level_1_content_metadata
                                        set 
                                            status = ?,
                                            process_attempts = process_attempts + 1 
                                        where
                                            content_hash = ?
                                        `
                                        ,
                                        [  "PROCESSED"  ,  contentHash  ]
                                    )
                                } else {
                                    console.log("No corresponding code record available yet")
                                    await mm.executeQuickSql(thisDb,
                                        `update 
                                            level_1_content_metadata
                                        set 
                                            process_attempts = process_attempts + 1 
                                        where
                                            content_hash = ?
                                        `
                                        ,
                                        [  contentHash  ]
                                    )
                                }
                            }
                        }






                    //
                    // CODE
                    //
                    } else {
                        await mm.addOrUpdateDriver(
                            thisDb
                            ,
                            returnValue
                            ,
                            {
                                username:       "default",
                                reponame:       baseComponentId,
                                version:        "latest",
                                ipfsHashId:     contentHash,
                                allowChanges:   false,
                                make_public:    makePublic,
                                save_html:      saveHtml
                            })

                        await mm.executeQuickSql(thisDb,
                            `update 
                                level_1_content_metadata
                            set 
                                status = ?,
                                process_attempts = process_attempts + 1 
                            where
                                content_hash = ?
                            `
                            ,
                            [  "PROCESSED"  ,  contentHash  ]
                        )
                    }

                }
            }
        } catch (err) {
            console.log(err)
        }

    },
    createContentFromLevel2Record:  async function  (  {  db  ,  type ,  id  ,  releaseId  ,  scope  }  ) {
        let mm = this
        if (type == "RELEASE") {
            let newDateAndTime = new Date().getTime()
            let optionsDist = {distributeToPeer: true}
            if (scope == "LOCAL") {
                optionsDist.distributeToPeer = false
            }
            optionsDist.processingStatus = "PROCESSED"
            let releaseRecord = await mm.getQuickSqlOneRow(db,"select * from level_2_released_components where id = ?",
                [id])
            let retDist = await mm.setDistributedContent(
                db
                ,
                {
                    component_hash_id:        releaseRecord.content_hash,
                    type:                       "COMPONENT_RELEASE",
                    format:                     "JSON'",
                    type_:                      "component_type('COMPONENT_RELEASE')",
                    format_:                    "format('JSON')",
                    date_and_time:              newDateAndTime,
                    base_component_id:          releaseRecord.base_component_id
                },
                optionsDist
            )
            let retHash = retDist.value
            await mm.executeQuickSql(
                db,
                `insert into 
                level_2_content_hash_to_db_key_mapping 
                (  
                    content_hash  ,  db_table_type  ,  table_key  
                ) 
            values  
                ( ? , ? , ? ) `
                ,
                [  retHash  ,  "RELEASE"  ,  id  ]
            )
            await mm.executeQuickSql(
                db,
                `update 
                level_2_released_components 
            set 
                json_ipfs_hash = ? 
            where
                id = ? 
            `
                ,
                [  retHash  ,  id  ]
            )
        }
    },


    // app store
    insertCommentIntoDb:            async function  (  thisDb, args  ) {
        let mm = this
        let promise2 = new Promise(async function(returnfn2) {
            try {
                thisDb.serialize(function() {
                    thisDb.run("begin exclusive transaction");
                    let ukey = uuidv1()
                    stmtInsertComment.run(
                        ukey,
                        args.baseComponentId ,
                        args.baseComponentIdVersion,
                        args.newComment,
                        args.newRating,
                        args.dateAndTime,
                        args.codeId
                    )
                    thisDb.run("commit",async function() {
                            let ret = await mm.setDistributedContent(
                                thisDb
                                ,
                                {
                                    component_hash_id:        args.codeId,
                                    type:                       "COMPONENT_COMMENT",
                                    format:                     "JSON'",
                                    type_:                      "component_type('COMPONENT_COMMENT')",
                                    format_:                    "format('JSON')",
                                    date_and_time:              args.dateAndTime,
                                    base_component_id:          args.baseComponentId,
                                    base_component_id_version:  args.baseComponentIdVersion,
                                    comment:                    args.newComment,
                                    rating:                     args.newRating
                                }
                            )
                            let retHash = ret.value
                            await mm.executeQuickSql(
                                thisDb,
                                "insert into " +
                                "    level_2_content_hash_to_db_key_mapping " +
                                "    (  content_hash  ,  db_table_type  ,  table_key  ) " +
                                "values  " +
                                "    ( ? , ? , ? ) "
                                ,
                                [  retHash  ,  "COMMENT"  ,  ukey  ]
                            )
                    })
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
        // Yazz we often need the IPFS hash of some content (via the getYazzContentHash( ) fn)
        // just in case the front end IPFS server is not available
        //---------------------------------------------------------------------------
        let yz                          = this
        let hashingAlgorithm            = "IPFS"
        let overrideHashingAlgorithm = yz.helpers.getValueOfCodeString(content, "hash_algorithm")
        if (overrideHashingAlgorithm) {
            hashingAlgorithm = overrideHashingAlgorithm
        }

        if (hashingAlgorithm == "IPFS") {
            let contentHash = await OnlyIpfsHash.of(content)
            return "IPFS_" + contentHash
        } else if (hashingAlgorithm == "SHA256") {
            let sha256Hash = await yz.calculateSHA256(content)
            return "SHA256_" + sha256Hash
        }
    },
    calculateSHA256:                async function (text) {
        const hash = crypto.createHash('sha256');
        hash.update(text);
        return hash.digest('hex'); // Returns the hash in hexadecimal format
    },
    getDistributedContent:          async function  (  {  thisDb  ,  contentHash  }  ) {
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
        let contentStoredInSqlite       = null
        let metadataStoredInSqlite      = null
        let returnValue                 = null
        let contentOnDisk               = null


        try {
            contentStoredInSqlite       = await mm.getQuickSqlOneRow(thisDb, "select  *  from  level_0_cached_content  where  content_hash = ?", [  contentHash  ])
            metadataStoredInSqlite       = await mm.getQuickSqlOneRow(thisDb, "select  *  from  level_1_content_metadata  where  content_hash = ?", [  contentHash  ])

            // if the content is stored in Sqlite then get the content from sqlite
            if (metadataStoredInSqlite && contentStoredInSqlite) {
                contentOnDisk           = contentStoredInSqlite.yazz_content.toString("utf8")
                returnValue = contentOnDisk



            // otherwise get the content from IPFS or a peer
            } else {

            }

        } catch( err) {
            debugger
        }
        return {  value: returnValue  ,  error: null  }

    },
    getContentFromMaster:           async function  (  thisDb  ,  contentHash  ,  options  ) {
        let mm = this
        let ret = await mm.sendQuickJsonGetRequest(  "http_get_ipfs_content"  ,  {  content_hash:  contentHash  }  )
        return { value: ret , error: null }
    },
    setDistributedContent:          async function  (  thisDb  ,  content  , options  ) {
        //---------------------------------------------------------------------------
        //                           setDistributedContent
        //
        // Whenever we want to set content so that it is stored in the locally
        // in Sqlite or on the network we call this. When this is called we
        // don't really know where the content will be stored, as the internet
        // may be down, or the peer server may be down, but we can give some
        // hints such as:
        //
        // options: {
        //               distributeToPeer: true
        //          }
        //
        //---------------------------------------------------------------------------

        // figure out the content options and scope
        let mm                          = this
        let yz                          = this
        let contentValueToStore         = content
        let contentType                 = "STRING"
        let scope                       = "GLOBAL";
        let justHash                    = null
        let contentStoredInSqlite       = null
        let metadataStoredInSqlite      = null
        let processingStatus            = null

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

            if (options.processingStatus) {
                processingStatus = options.processingStatus
            }
        }

        justHash = await yz.getDistributedKey(contentValueToStore)

        //
        try {
            contentStoredInSqlite       = await mm.getQuickSqlOneRow(thisDb, "select  *  from  level_0_cached_content  where  content_hash = ?", [  justHash  ])
            metadataStoredInSqlite      = await mm.getQuickSqlOneRow(thisDb, "select  *  from  level_1_content_metadata  where  content_hash = ?", [  justHash  ])

            // if the content is stored in Sqlite then do nothing
            if (metadataStoredInSqlite && contentStoredInSqlite) {
                // do nothing!!!


            // otherwise generate the content on disk and in sqlite
            } else {
                await mm.executeQuickSql(
                    thisDb,
                    "insert  into  level_0_cached_content  (content_hash,yazz_content) values (?,?)",
                    [justHash,contentValueToStore])

                await mm.executeQuickSql(
                    thisDb,
                    `insert or replace into 
                        level_1_content_metadata 
                        (
                            content_hash, 
                            content_type, 
                            scope, 
                            last_ipfs_ping_millis, 
                            temp_debug_content,   
                            stored_in_ipfs, 
                            sent_to_master,  
                            read_from_local_ipfs,  
                            last_ipfs_ping_millis, 
                            status,                            
                            process_attempts
                        ) 
                        values
                    (?,?,?,?,?,?,?,?,?,?,?)`
                    ,
                [
                    justHash,
                    contentType,
                    scope,
                    null,
                    contentValueToStore,
                    0,
                    null,
                    0,
                    -1,
                    processingStatus,
                    processingStatus=="PROCESSED"?1:0
                ])
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
    distributeContentToPeer:        async function  (  thisDb, content_hash  ,  ipfsContent  ) {

        //---------------------------------------------------------------------------
        //
        //                           distribute Content To Peer (  )
        //                           -------------------------------
        //
        // What this function does is that it sends a piece of content to a "peer",
        // which is by default the central Yazz server
        //
        //---------------------------------------------------------------------------
        let mm = this
        if ((!mm.centralhost) || (!mm.centralhostport)) {
            return
        }

        if (mm.inDistributeContentToPeer) {
            return
        }
        mm.inDistributeContentToPeer = true

        let contentDesc = mm.getContentDescription(ipfsContent)
        //console.log("Sending content to peer: " + contentDesc + ", IPFS: " + content_hash)
        let promise     = new Promise(async function(returnfn) {
            try {
                const dataString = JSON.stringify(
                    {
                        content_hash:          content_hash,
                        yazz_content:       ipfsContent,
                        yazz_instance_id:   mm.yazzInstanceId
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
                    //console.log('STATUS: ' + res.statusCode);
                    //console.log('HEADERS: ' + JSON.stringify(res.headers));
                    res.setEncoding('utf8');
                    res.on('data', function (chunk) {
                        //console.log('BODY: ' + chunk);
                    });
                    res.on('end', async function () {
                        //console.log('end: ' );
                        await mm.executeQuickSql(thisDb,
                            "update  level_1_content_metadata  set sent_to_master = 'TRUE'  where content_hash = ?",
                            [content_hash] )
                        await mm.executeQuickSql(thisDb,
                            `update  
                                    level_8_upload_content_queue 
                                set  
                                    server              = ?,
                                    last_attempted_send = ?,
                                    attempts            = attempts + 1
                                 where
                                    content_hash = ?`,
                            [ mm.centralhost, new Date().getTime() , content_hash  ])
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
        mm.inDistributeContentToPeer = false
    },
    saveItemToIpfs:                 async function  (  srcCode  ) {
        let yz = this
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
                justHash                = await yz.getDistributedKey(  srcCode  )
                let fullIpfsFilePath    = path.join(  fullIpfsFolderPath  ,  justHash  )

                fs.writeFileSync(  fullIpfsFilePath  ,  srcCode  );
                //await yz.distributeC ontentToPeer(  thisDb, justHash  ,  srcCode  )

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
        let contentHash = await promise
        return contentHash
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

        if ((!mm.centralhost) || (!mm.centralhostport)) {
            return
        }
        let promise     = new Promise(async function(returnfn) {
            try {
                let aliveCheckUrl = "http" + (mm.centralhosthttps ? "s" : "") + "://" + mm.centralhost  + ":" + mm.centralhostport + "/http_get_peer_alive_check"

                let theHttpsConn = http
                if (mm.centralhosthttps) {
                    theHttpsConn = https
                }
                //console.log("Send alive check to " + mm.centralhost + ":" + mm.centralhostport)
                let req = theHttpsConn.get(
                    aliveCheckUrl
                    ,
                    async function(res) {
                        //console.log('STATUS: ' + res.statusCode);
                        //console.log('HEADERS: ' + JSON.stringify(res.headers));
                        if (res.statusCode == 200 ) {
                            //console.log("peer available")
                            mm.peerAvailable = true
                        } else {
                            console.log("peer NOT available. HTTP return code: " +  res.statusCode )
                            mm.peerAvailable = false
                        }
                });
                returnfn()
            } catch(er) {
                console.log(er)
                console.log("peer NOT available. ")
                mm.peerAvailable = false
                returnfn()
            }
        })
        await promise
    },
    processContentItems:            async function  (  thisDb  ) {
        //---------------------------------------------------------------------------
        //
        //                           synchonizeContentAmongPeers( .. )
        //                           ---------------------------------
        //
        // In this method we try to make sure that all the content is synchronized
        // locally, to peer Yazz servers, and to IPFS
        //
        //---------------------------------------------------------------------------
        let mm = this
        if (mm.processContentItemsLock) {
            return
        }
        mm.processContentItemsLock = true

        try {
            let nextUnprocessedCodeItem = await this.getQuickSqlOneRow(thisDb,
                `select  
                        content_hash  
                    from  
                        level_1_content_metadata  
                    where  
                        scope='GLOBAL' 
                            and 
                        status is null
                            and
                        content_type='STRING'
                    LIMIT 1`)
            if (nextUnprocessedCodeItem) {

                //debugger
                mm.createLevel2RecordFromContent({thisDb:thisDb,contentHash: nextUnprocessedCodeItem.content_hash})
            }
        } catch (snedE) {
            console.log("Error in processContentItems: " + snedE)
        }

        mm.processContentItemsLock = false
    },
    synchonizeContentAmongPeers:    async function  (  thisDb  ) {
        //---------------------------------------------------------------------------
        //
        //                           synchonizeContentAmongPeers( .. )
        //                           ---------------------------------
        //
        // In this method we try to make sure that all the content is synchronized
        // locally, to peer Yazz servers, and to IPFS. This has the following steps:
        //
        // - Queue content to be sent to the master server
        // - Send queued content to the master server
        // - See if there is any newly released content on the master server to be downloaded
        // - Download the next item in the download queue
        // - Process the downloaded items
        //
        //---------------------------------------------------------------------------
        let mm = this
        let yz = this
        if (mm.synchonizeContentAmongPeersLock) {
            return
        }
        mm.synchonizeContentAmongPeersLock = true
        let ipfsDownloadQueueSize = null


        // --------------------------------------------------------------------
        // Queue content to be sent to the master server
        // --------------------------------------------------------------------
        if (mm.syncToMaster) {
            try {
                let nextUnsentRecord = await this.getQuickSqlOneRow(thisDb,
                    `select  
                        content_hash  
                    from  
                        level_1_content_metadata  
                    where  
                        scope='GLOBAL' and sent_to_master is null   
                    LIMIT 1`)

                if (nextUnsentRecord) {

                    await mm.executeQuickSql(thisDb,
                        `update  
                            level_1_content_metadata  
                        set 
                            sent_to_master = ? 
                        where
                            content_hash = ?`,
                        ["QUEUED", nextUnsentRecord.content_hash])

                    let alreadyInSendQueue = await mm.getQuickSqlOneRow(
                        thisDb,
                        "select  content_hash  from  level_8_upload_content_queue  where  content_hash = ?",
                        [nextUnsentRecord.content_hash])

                    if (!alreadyInSendQueue) {
                        let dtime = mm.getDebugTimestampText()
                        await mm.executeQuickSql(thisDb,
                            `insert into  
                                level_8_upload_content_queue  
                            (  content_hash  ,  send_status  ,  attempts  ,  created_timestamp  ) 
                                values 
                            ( ? , ? , ? , ? )`,
                            [nextUnsentRecord.content_hash, "QUEUED", 0, dtime]
                        )
                    } else {
                        console.log("Error: IPFS Hash already in queue: " + alreadyInSendQueue)
                    }


                    let alreadyDownloadedFromHost = await mm.getQuickSqlOneRow(
                        thisDb,
                        "select  content_hash  from  level_8_download_content_queue  where  content_hash = ?",
                        [nextUnsentRecord.content_hash])

                    if (alreadyDownloadedFromHost) {
                        await mm.executeQuickSql(thisDb,
                            `update   
                                level_8_upload_content_queue  
                            set  
                                send_status  = ? 
                            where
                                content_hash = ? 
                            `,
                            ["EXISTS" , nextUnsentRecord.content_hash]
                        )
                    }



                }
            } catch (snedE) {
                console.log("Error in synchonizeContentAmongPeers: " + snedE)
            }
        }








        // --------------------------------------------------------------------
        // Send any queued content items (code, comments, releases) to
        // the master server
        // --------------------------------------------------------------------
        if (mm.syncToMaster) {
            try {
                if (mm.peerAvailable) {
                    let nextItemToSendInQueue = await this.getQuickSqlOneRow(thisDb,
                        `select  
                            content_hash  
                        from  
                            level_8_upload_content_queue 
                        where  
                            send_status='QUEUED'
                         LIMIT 1`)
                    if (nextItemToSendInQueue) {
                        if (nextItemToSendInQueue.content_hash != null) {
                            let nextContent = await mm.getDistributedContent({
                                thisDb: thisDb,
                                contentHash: nextItemToSendInQueue.content_hash
                            })
                            if (await mm.getYazzContentHash(nextContent.value) == nextItemToSendInQueue.content_hash) {
                                await this.executeQuickSql(thisDb,
                                    `update  
                                        level_8_upload_content_queue 
                                    set  
                                        send_status='SENDING',
                                        debug_content=?
                                     where
                                        content_hash =?`,
                                    [nextContent.value, nextItemToSendInQueue.content_hash])
                                await mm.distributeContentToPeer(thisDb, nextItemToSendInQueue.content_hash, nextContent.value)

                                await this.executeQuickSql(thisDb,
                                    `update  
                                        level_8_upload_content_queue 
                                    set  
                                        send_status='SENT'
                                     where
                                        content_hash = ?`,
                                    [nextItemToSendInQueue.content_hash])
                            }

                        }
                    }
                }
            } catch (snedE) {
                console.log("Error in synchonizeContentAmongPeers (part 2): " + snedE)
            }
        }



        // --------------------------------------------------------------------
        // See if there are any newly released components to be downloaded,
        // and if so add them to the download queue
        // --------------------------------------------------------------------
        if (mm.syncToMaster) {
            try {
                if (mm.peerAvailable) {
                    ipfsDownloadQueueSize = await mm.getQuickSqlOneRow(thisDb, "select count(content_hash) as queue_count from level_8_download_content_queue where STATUS = 'QUEUED'")
                    if (ipfsDownloadQueueSize.queue_count == 0) {
                        let maxMasterTimeMillis = await mm.getGlobalVar(thisDb, "RELEASED_MAX_MASTER_TIME_MS").value
                        let outstandingRequests = await mm.sendQuickJsonGetRequest(
                            "http_get_hashes_for_released_components"
                            ,
                            {
                                max_master_millis: maxMasterTimeMillis
                            })
                        if (outstandingRequests) {
                            for (hashRecord of outstandingRequests.value.release_info) {
                                //console.log("hash record to add to queue: " + JSON.stringify(hashRecord, null, 2))
                                let releaseRecordAlreadyInQueue = await mm.getQuickSqlOneRow(
                                    thisDb,
                                    "select  content_hash  from  level_8_download_content_queue  where  content_hash = ?",
                                    [hashRecord.json_ipfs_hash])
                                if (releaseRecordAlreadyInQueue == null) {
                                    await mm.executeQuickSql(
                                        thisDb,
                                        "insert into level_8_download_content_queue  (  content_hash   ,   master_time_millis  , status  ,  debug_master_time_millis ) values ( ? , ? , ? , ?)",
                                        [hashRecord.json_ipfs_hash, hashRecord.local_time_ms, "QUEUED", mm.msToTime(hashRecord.local_time_ms)]
                                    )
                                } else {
                                    //debugger
                                }
                                let recordAlreadyInQueue = await mm.getQuickSqlOneRow(
                                    thisDb,
                                    "select  content_hash  from  level_8_download_content_queue  where  content_hash = ?",
                                    [hashRecord.content_hash])
                                if (recordAlreadyInQueue == null) {
                                    await mm.executeQuickSql(
                                        thisDb,
                                        "insert into level_8_download_content_queue  (  content_hash   ,   master_time_millis  , status  ,  debug_master_time_millis ) values ( ? , ? , ? , ?)",
                                        [hashRecord.content_hash, hashRecord.local_time_ms, "QUEUED", mm.msToTime(hashRecord.local_time_ms)]
                                    )
                                } else {
                                    //debugger
                                }
                            }
                        }
                    }
                }
            } catch (err) {
                console.log(err)
            }
        }


        // --------------------------------------------------------------------
        // Download the next item in the download queue
        // --------------------------------------------------------------------
        if (mm.syncToMaster) {
            try {
                if (mm.peerAvailable && ipfsDownloadQueueSize && (ipfsDownloadQueueSize.queue_count != 0)) {
                    let nextIpfsQueueRecord = await mm.getQuickSqlOneRow(thisDb,
                        `select  
                            content_hash  ,  master_time_millis  
                        from  
                            level_8_download_content_queue  
                        where  
                            status = ?  
                        order by  
                            master_time_millis  asc 
                        limit 1`
                        ,
                        ["QUEUED"])
                    if (nextIpfsQueueRecord) {
                        let contentAlreadyExists = await mm.getQuickSqlOneRow(thisDb,
                            `select  
                                yazz_content  
                            from  
                                level_0_cached_content  
                            where  
                                content_hash = ?`,
                            [nextIpfsQueueRecord.content_hash])
                        let debugContent = null

                        let previousMasterTime = await mm.getGlobalVar(thisDb,"RELEASED_MAX_MASTER_TIME_MS").value
                        if (previousMasterTime && (previousMasterTime > nextIpfsQueueRecord.master_time_millis)) {
                        } else {
                            await mm.setGlobalVar(thisDb,"RELEASED_MAX_MASTER_TIME_MS","INTEGER",nextIpfsQueueRecord.master_time_millis)
                        }
                        if (contentAlreadyExists) {
                            debugContent = contentAlreadyExists.yazz_content
                            await mm.executeQuickSql(
                                thisDb,
                                "update  level_8_download_content_queue  set status = ? , debug_content = ? where content_hash = ?",
                                ["EXISTS", debugContent , nextIpfsQueueRecord.content_hash]
                            )
                        } else {
                            let ipfsContent = await mm.getContentFromMaster(thisDb, nextIpfsQueueRecord.content_hash)

                            if (ipfsContent && ipfsContent.value && ipfsContent.value.content) {
                                await mm.setDistributedContent(thisDb, ipfsContent.value.content)

                                debugContent = ipfsContent.value.content

                                await mm.executeQuickSql(
                                    thisDb,
                                    `update  
                                        level_8_download_content_queue  
                                    set 
                                        status = ? , 
                                        debug_content = ? 
                                    where 
                                        content_hash = ?`
                                    ,
                                    ["DONE", debugContent , nextIpfsQueueRecord.content_hash]
                                )
                            }
                        }
                    }
                }
            } catch (error) {
                console.log(error)
                await mm.executeQuickSql(
                    thisDb,
                    "update  level_8_download_content_queue  set status = ? where content_hash = ?",
                    ["ERROR", nextIpfsQueueRecord.content_hash]
                )
            }
        }


        // --------------------------------------------------------------------
        // Process the downloaded items
        // --------------------------------------------------------------------
        try {
            let nextIpfsRecordToProcess = await mm.getQuickSqlOneRow(
                thisDb,
                `select 
                    content_hash
                 from 
                    level_1_content_metadata 
                where 
                    status is null
                order by
                    process_attempts  asc
                limit 1`
                )

            if (nextIpfsRecordToProcess) {
                await mm.createLevel2RecordFromContent({
                    thisDb:     thisDb,
                    contentHash:   nextIpfsRecordToProcess.content_hash
                })
            }
        } catch (error) {
            console.log(error)
        }






        mm.synchonizeContentAmongPeersLock = false
    },
    getReleasedHashesAfterTimestamp:async function  (  thisDb  ,  timestampMillis  ) {
        // this is always called from a a slave server
        let mm = this
        let listOfHashes = null

        // get the initial list of hashes
        if (  (typeof timestampMillis == 'undefined')  ||  (timestampMillis == null)  ) {
            listOfHashes = await mm.getQuickSql(thisDb, "select   json_ipfs_hash, content_hash, local_time_ms   from  level_2_released_components   where component_scope = ?  order by local_time_ms asc  limit 10" , [  "GLOBAL"   ])
        } else {
            listOfHashes = await mm.getQuickSql(thisDb, "select   json_ipfs_hash, content_hash, local_time_ms   from  level_2_released_components  where  component_scope = ?  and local_time_ms > ?  order by local_time_ms asc limit 10" , [  "GLOBAL"  ,  timestampMillis  ])
        }


        // if there are no hashes then return
        if (listOfHashes.length == 0) {
            return { count_hashes: 0 , release_info: listOfHashes}
        }


        // if the hash with the highest timestamp has more hashes at the same timestamp then add those too
        let lastHashTimestampRecord = listOfHashes[ listOfHashes.length - 1 ]
        let lastHashTimestamp = lastHashTimestampRecord.local_time_ms

        let countReturnedHashesWithTimestamp = 0
        for ( recordHash of listOfHashes ) {
            if (recordHash.local_time_ms == lastHashTimestamp) {
                countReturnedHashesWithTimestamp ++
            }
        }

        let countOfTotalHashesWithSameTimestampRec = await mm.getQuickSqlOneRow(
            thisDb,
            "select  count(content_hash) as tot_c  from  level_2_released_components   where  component_scope = ? and local_time_ms = ?",
            [  "GLOBAL"  ,  lastHashTimestamp  ])
        let countOfTotalHashesWithSameTimestamp = countOfTotalHashesWithSameTimestampRec.tot_c

        if (countOfTotalHashesWithSameTimestamp > countReturnedHashesWithTimestamp) {
            let extraRecs = await mm.getQuickSql(thisDb,
                "select   json_ipfs_hash, content_hash, local_time_ms   from  level_2_released_components  where component_scope = ? and  local_time_ms = ?  " ,
                [  "GLOBAL"  ,  lastHashTimestamp  ])
            listOfHashes = listOfHashes.concat(extraRecs)
        }
        return { count_hashes: listOfHashes.length , release_info: listOfHashes}
    },
    getContentDescription:          function        (  ipfsContent  ) {
        let mm = this
        if (ipfsContent == null) {
            return ""
        } else {
            let bci = mm.helpers.getValueOfCodeString(ipfsContent, "base_component_id")
            let ct  = mm.helpers.getValueOfCodeString(ipfsContent, "component_type")
            return "BCI: " + bci + ", component_type: " + ct
        }
    },
    oldsynchonizeContentAmongPeers: async function  (  thisDb  ) {
        //console.log("Sync")
        let contentNotSentToPeer = await this.getQuickSql(thisDb, "select  content_hash  from  level_1_content_metadata  where  sent_to_master != 'TRUE' limit 1", params)
        if (rows.length == 0) {
            return null
        }
        //await mm.distribu teContentToPeer(thisDb, justHash, content)

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
                let fullIpfsFilePath    = path.join(mm.fullIpfsFolderPath, contentHash)
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
                        ipfsHashId:         contentHash,
                        allowChanges:       false,
                        distributeToPeer:   false
                    })

                //console.log("....................................Loading component from local IPFS cache: " + fullIpfsFilePath)
                returnfn("Done")

            } catch (error) {
                try {

                    ipfs.files.get(contentHash, function (err, files) {
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
                                    brje.default = contentHash
                                }
                            }

                            srcCode = yz.helpers.insertCodeString(srcCode,
                                "properties",
                                properties,
                                ")//prope" + "rties")


                            let fullIpfsFilePath = path.join(fullIpfsFolderPath, contentHash)
                            fs.writeFileSync(fullIpfsFilePath, srcCode);

                            await addOrUpdateDriver(srcCode, {
                                username: "default",
                                reponame: baseComponentId,
                                version: "latest",
                                ipfsHashId: contentHash,
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
