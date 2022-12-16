const crypto = require("crypto");
const OnlyIpfsHash = require("ipfs-only-hash");
const path = require("path");
let sqlite3                     = require('sqlite3');
let stmtInsertNewCode
let stmtDeprecateOldCode
let stmtInsertIntoCodeTags
let uuidv1          = require('uuid/v1');
let stmtDeleteDependencies
let stmtInsertComponentProperty
let stmtDeleteTypesForComponentProperty
let stmtDeleteAcceptTypesForComponentProperty

let stmtInsertTypesForComponentProperty;
let stmtUpdateCommitForCodeTag;
let stmtInsertAcceptTypesForComponentProperty;
let stmtInsertDependency
let fs = require('fs');
let stmtInsertSubComponent

let stmtInsertAppDDLRevision;
let stmtUpdateLatestAppDDLRevision;
let copyMigration;




module.exports = {
    setup: async function(thisDb) {
        stmtInsertNewCode = thisDb.prepare(
            `insert into
                 system_code  
                     (id, parent_id, code_tag, code, base_component_id, 
                      max_processes,display_name, creation_timestamp,component_options, 
                      logo_url, visibility, interfaces,use_db, editors, read_write_status,properties, 
                      component_type, edit_file_path, ipfs_hash_id, 
                      code_tag_v2, code_changes, num_changes, fk_user_id, score, score_reason) 
              values 
                (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`);

        stmtDeprecateOldCode = thisDb.prepare(
            " update system_code  set code_tag = NULL, code_tag_v2 = NULL where base_component_id = ? and id != ?");

        stmtInsertIntoCodeTags = thisDb.prepare(`insert or ignore
                                                    into
                                               code_tags
                                                    (id,   base_component_id,   code_tag,   fk_system_code_id,   fk_user_id) 
                                               values ( ?, ?, ?, ?, ?)`)

        stmtDeleteDependencies = thisDb.prepare(" delete from  app_dependencies   where   code_id = ?");

        stmtInsertComponentProperty = thisDb.prepare(`insert or ignore
                                                    into
                                               component_properties
                                                    (component_name, property_name )
                                               values ( ?,?)`)

        stmtDeleteTypesForComponentProperty = thisDb.prepare(" delete from  component_property_types   where   component_name = ?");

        stmtDeleteAcceptTypesForComponentProperty = thisDb.prepare(" delete from  component_property_accept_types   where   component_name = ?");


        //select name from (select distinct(name) ,count(name) cn from test  where value in (1,2,3)  group by name) where cn = 3
        stmtInsertTypesForComponentProperty = thisDb.prepare(`insert or ignore
                                                    into
                                               component_property_types
                                                    (component_name, property_name , type_name, type_value )
                                               values ( ?,?,?,?)`)

        stmtUpdateCommitForCodeTag = thisDb.prepare(`update
                                                       code_tags
                                                            set  fk_system_code_id = ?
                                                       where
                                                            base_component_id = ? and code_tag = ? and fk_user_id = ?
                                               `)

        stmtInsertAcceptTypesForComponentProperty = thisDb.prepare(`insert or ignore
                                                    into
                                               component_property_accept_types
                                                    (component_name, property_name , accept_type_name , accept_type_value )
                                               values ( ?,?,?,?)`)


        stmtInsertDependency = thisDb.prepare(" insert or replace into app_dependencies " +
            "    (id,  code_id, dependency_type, dependency_name, dependency_version ) " +
            " values " +
            "    (?, ?, ?, ?, ? );");

        stmtInsertSubComponent = thisDb.prepare(`insert or ignore
                                                    into
                                               component_usage
                                                    (base_component_id, child_component_id)
                                               values (?,?)`)


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
    }
    ,

     insertCodeString: function(code,st, vall ,optionalEnd) {
         var endIndicator = ")"
         if (optionalEnd) {
             endIndicator = optionalEnd
         }
        var findd = st + "("
        var startIndexOfComment = code.toString().indexOf("/*")
        var startIndexOfFn = code.toString().indexOf("{")

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






     deleteCodeString: function(code,st ,optionalEnd) {
         var endIndicator = ")"
         if (optionalEnd) {
             endIndicator = optionalEnd
         }
        var findd = st + "("
        var codeStart = code.toString().indexOf(findd)
        if (codeStart != -1) {
            var codeEnd = codeStart + code.toString().substring(codeStart).indexOf(endIndicator)

            code = code.toString().substring(0,codeStart) +
                            code.toString().substring(codeEnd + 1 + endIndicator.length)

            return code
        }
        return code
    },



     getValueOfCodeString: function(code, st,optionalEnd) {
        var endIndicator = ")"
        if (optionalEnd) {
            endIndicator = optionalEnd
        }
        var toFind = st + "("
        if (code.toString().indexOf(toFind) != -1) {
            var codeStart = code.toString().indexOf(toFind) + toFind.length
            var codeEnd = codeStart + code.toString().substring(codeStart).indexOf(endIndicator)

            code = code.toString().substring(codeStart, codeEnd)
            var val = eval( "(" + code.toString() + ")")
            return val

            }
            return null
    },

    replaceBetween: function(target, start, end, replaceWith) {
                                        var startIndex = target.indexOf(start) + start.length
                                        var endIndex = target.indexOf(end)
                                        var newString = target.substring(0,startIndex) + replaceWith + target.substring(endIndex);
                                        return newString
    }
    ,
    getBetween: function(target, start, end) {
        var startIndex = target.indexOf(start) + start.length
        var endIndex = target.indexOf(end)
        var newString = target.substring(startIndex,endIndex)
        return newString
    }
    ,

    replacePropertyValue: function(code, propertyId, propertyValue) {
      var properties = this.getValueOfCodeString(code,"properties",")//prope" + "rties")
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
    }
    ,

    addProperty: function(code, newProperty) {
        var properties = this.getValueOfCodeString(code,"properties",")//prope" + "rties")
        if (properties) {
            properties.push(newProperty)

            code = this.deleteCodeString(  code, "properties", ")//prope" + "rties")

            code = this.insertCodeString(    code,
                "properties",
                properties,
                ")//prope" + "rties")
        }
        return code
    }
    ,

    addMethod: function(code, newMethod) {
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
    }

    ,

    isValidObject: function (variable){
        if ((typeof variable !== 'undefined') && (variable != null)) {
            return true
        }
        return false
    }
    ,

    getQuickSqlOneRow: async function (thisDb, sql ,params) {
        let rows = await this.getQuickSql(thisDb,sql,params)
        if (rows.length == 0) {
            return null
        }
        return rows[0]
    }
    ,

    getQuickSql: async function (thisDb, sql, params) {
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
    }
    ,









    executeQuickSql: async function (thisDb, sql, params) {
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
    }

    ,





    tagVersion: async function (thisDb, ipfs_hash, srcCode ) {
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
    }




    ,

    getCodeForCommit: async function (thisDb, commitId) {
        let thisCommit = await this.getQuickSqlOneRow(thisDb,  "select  *  from   system_code  where   id = ? ", [  commitId  ])
        if (thisCommit) {
            return thisCommit.code
        }

        return null
    }


    ,

    getRecordForCommit: async function (thisDb, commitId) {
        let thisCommit = await this.getQuickSqlOneRow(thisDb,  "select  *  from   system_code  where   id = ? ", [  commitId  ])
        if (thisCommit) {
            return thisCommit
        }

        return null
    }



    ,

    saveCodeV2: async function ( thisDb, baseComponentId, parentHash, code , options) {
        let mm = this
        await mm.setup(thisDb)
        if (code) {
            code = code.toString()
        }

        let promise = new Promise(async function(returnFn) {
            let restRoutes = {}
            let aoo = null
            if (options) {

                if (options.restRoutes) {
                    restRoutes = options.restRoutes
                }
                if (options.app) {
                    app = options.app
                }
            }

            if (!baseComponentId) {
                baseComponentId = uuidv1()
            }
            if (!code.toString().substring(0,20).includes("function")) {
                code =
                    `function() {${code}
}`
            }

            //showTimer("    baseComponentId := " + baseComponentId)


            // if we don't want to reload this file then don't update the timestamp
            let updatedTimestamp = mm.getValueOfCodeString(code, "updated_timestamp")
            if (!updatedTimestamp) {
                updatedTimestamp = mm.getValueOfCodeString(code, "created_timestamp")
            }

            //showTimer(`3`)


            let componentOptions = null
            let maxProcesses = 1
            let rowhash = crypto.createHash('sha256');




            let visibility = null
            visibility = mm.getValueOfCodeString(code,"visibility")

            //showTimer(`4`)


            let logoUrl = mm.getValueOfCodeString(code,"logo_url")




            let interfaces = ""
            let interfaces2 = mm.getValueOfCodeString(code,"interfaces")
            if (interfaces2 && (interfaces2.length > 0)) {
                for (let rr=0; rr < interfaces2.length; rr ++) {
                    interfaces += "|  " + interfaces2[ rr ]
                }
            }

            //showTimer(`5`)

            let row = code.toString();

            rowhash.setEncoding('hex');
            rowhash.write(row);
            rowhash.end();
            //let sha1sum = rowhash.read();
            let readOnly = mm.getValueOfCodeString(code,"read_only")
            if (mm.getValueOfCodeString(code,"hide_header")) {
                componentOptions = "HIDE_HEADER"
            }

            //showTimer(`6`)


            let displayName = mm.getValueOfCodeString(code,"display_name")

            let useDb = mm.getValueOfCodeString(code,"use_db")
            let editors2 = mm.getValueOfCodeString(code,"editors")
            let controlType = mm.getValueOfCodeString(code,"component_type")

            let editors = null
            if (editors2) {
                editors = JSON.stringify(editors2,null,2)

            }
            let readWriteStatus = null
            if (readOnly) {
                readWriteStatus = "READ"
            }


            let codeChanges = mm.getValueOfCodeString(code,"code_changes",")//code_" + "changes")
            let codeChangesStr = null
            let numCodeChanges = null
            if (codeChanges) {
                codeChangesStr = JSON.stringify(codeChanges,null,2)
                numCodeChanges = codeChanges.length
            }

            let properties = mm.getValueOfCodeString(code,"properties",")//properties")
            if (properties) {
                properties = JSON.stringify(properties,null,2)
            }
            let properties2 = mm.getValueOfCodeString(code,"properties",")//properties")
            if (controlType == "VB") {
                //showTimer(`7`)

                ////showTimer("VB: " + baseComponentId)
                if (properties2) {
                    //showTimer(`8`)

                    ////showTimer("     properties: " + properties2.length)
                    for (let rttte = 0; rttte < properties2.length ; rttte++ ) {
                        let prop = properties2[rttte]
                        stmtInsertComponentProperty.run(baseComponentId, prop.id)




                    }
                }

            }




            let sha1sum  = await OnlyIpfsHash.of(code)
            ////showTimer("Save sha1 for :" + baseComponentId + ": " + sha1sum)

            let userId = null
            if (options) {
                save_code_to_file = options.save_code_to_file
                userId = options.userId
            }

            let existingCodeTags = await mm.getQuickSqlOneRow(thisDb,"select * from code_tags where base_component_id = ? and fk_user_id = ? and code_tag='EDIT'  ",[baseComponentId, userId])
            thisDb.serialize(
                function() {
                    thisDb.all(
                        " select  " +
                        "     id " +
                        " from " +
                        "     system_code " +
                        " where " +
                        "     id = ?;"
                        ,
                        sha1sum
                        ,
                        async function(err, rows) {
                            if (!err) {
                                ////showTimer("rows.length:   " + rows.length)
                                if ((rows.length == 0) || readOnly){
                                    try {

                                        if (controlType == "VB") {
                                            //showTimer(`7`)

                                            ////showTimer("VB: " + baseComponentId)
                                            stmtDeleteTypesForComponentProperty.run(baseComponentId)
                                            stmtDeleteAcceptTypesForComponentProperty.run(baseComponentId)
                                            if (properties2) {
                                                //showTimer(`8`)

                                                ////showTimer("     properties: " + properties2.length)
                                                for (let rttte = 0; rttte < properties2.length ; rttte++ ) {
                                                    let prop = properties2[rttte]
                                                    stmtInsertComponentProperty.run(baseComponentId, prop.id)


                                                    if (prop.types) {
                                                        let labelKeys = Object.keys(prop.types)
                                                        for (let rttte2 = 0; rttte2 < labelKeys.length ; rttte2++ ) {
                                                            let prop2 = prop.types[labelKeys[rttte2]]
                                                            ////showTimer("    " + prop.id + " = " +  JSON.stringify(prop.labels))
                                                            stmtInsertTypesForComponentProperty.run(baseComponentId, prop.id, labelKeys[rttte2],prop2)

                                                        }
                                                    }
                                                    //showTimer(`9`)
                                                    if (prop.accept_types) {
                                                        let labelKeys = Object.keys(prop.accept_types)
                                                        for (let rttte2 = 0; rttte2 < labelKeys.length ; rttte2++ ) {
                                                            let prop2 = prop.accept_types[labelKeys[rttte2]]
                                                            ////showTimer("    " + prop.id + " = " +  JSON.stringify(prop.labels))
                                                            stmtInsertAcceptTypesForComponentProperty.run(
                                                                baseComponentId,
                                                                prop.id,
                                                                labelKeys[rttte2],
                                                                prop2)

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
                                                "LATEST",
                                                code,
                                                baseComponentId,
                                                maxProcesses,
                                                displayName,
                                                updatedTimestamp,
                                                componentOptions,
                                                logoUrl,
                                                visibility,
                                                interfaces,
                                                useDb,
                                                editors,
                                                readWriteStatus,
                                                properties,
                                                controlType,
                                                save_code_to_file,
                                                sha1sum,
                                                "TIP",
                                                codeChangesStr,
                                                numCodeChanges,
                                                userId,
                                                1,
                                                "1 point for being committed"
                                            )
                                            stmtDeprecateOldCode.run(
                                                baseComponentId,
                                                sha1sum
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
                                            let jsLibs = mm.getValueOfCodeString(code, "uses_javascript_librararies")
                                            if (jsLibs) {
                                                ////showTimer(JSON.stringify(jsLibs,null,2))
                                                for (let tt = 0; tt < jsLibs.length ; tt++) {
                                                    scriptCode += `libLoaded[ "${jsLibs[tt]}" ] = true;
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
                                            let subComponents = mm.getValueOfCodeString(code, "sub_components")
                                            if (subComponents) {
                                                for (let tt = 0; tt < subComponents.length ; tt++) {
                                                    stmtInsertSubComponent.run(
                                                        baseComponentId,
                                                        subComponents[tt])
                                                }
                                            }
                                            let sqliteCode = ""
                                            if (mm.isValidObject(options)) {

                                                ////showTimer(JSON.stringify(options,null,2))
                                                if (options.sub_components) {
                                                    ////showTimer("Save options: " + options.sub_components.length)
                                                    ////showTimer(JSON.stringify(options,null,2))
                                                    for (let tew = 0; tew < options.sub_components.length ; tew ++) {
                                                        ////showTimer("Saving " + options.sub_components[tew])
                                                        if (mm.isValidObject(baseComponentId)) {
                                                            stmtInsertSubComponent.run(
                                                                baseComponentId,
                                                                options.sub_components[tew])
                                                        }
                                                    }
                                                }
                                            }
                                            //showTimer(`12`)

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

                                                newStaticFileContent = newStaticFileContent.toString().replace("let isStaticHtmlPageApp = false", "let isStaticHtmlPageApp = true")

                                                let newcode = escape( code.toString() )


                                                newStaticFileContent = newStaticFileContent.toString().replace("***STATIC_NAME***",displayName)
                                                newStaticFileContent = newStaticFileContent.toString().replace("***STATIC_NAME***",displayName)
                                                newStaticFileContent = newStaticFileContent.toString().replace("***STATIC_BASE_COMPONENT_ID***",baseComponentId)
                                                newStaticFileContent = newStaticFileContent.toString().replace("***STATIC_BASE_COMPONENT_ID***",baseComponentId)
                                                newStaticFileContent = newStaticFileContent.toString().replace("***STATIC_CODE_ID***",sha1sum)
                                                newStaticFileContent = newStaticFileContent.toString().replace("***STATIC_CODE_ID***",sha1sum)




                                                let newCode =  `cachedCode["${sha1sum}"] = {
                                          "type": "ws_to_browser_callDriverMethod_results",
                                          "value": {
                                            "code": /*APP_START*/unescape(\`${newcode}\`)/*APP_END*/,
                                            "is_code_result": true,
                                            "use_db": ${useDb?"\"" + useDb + "\"":null},
                                            "component_type": \"SYSTEM\",
                                            "libs": [],
                                            "code_id": "${sha1sum}",
                                            "base_component_id": "${baseComponentId}"
                                          },
                                          "seq_num": 0
                                        }

                                        finderToCachedCodeMapping["${baseComponentId}"] = "${sha1sum}"`


                                                //showTimer(`14`)

                                                newCode += `
                                            //newcodehere
                                        `
                                                thisDb.serialize(
                                                    async function() {
                                                        //showTimer(`15.....1`)

                                                        let stmt = thisDb.all(
                                                            `select
                                                        system_code.id as sha1,
                                                        child_component_id,
                                                        code
                                                    from
                                                        component_usage,
                                                        system_code
                                                    where
                                                        component_usage.base_component_id = ?
                                                    and
                                                        system_code.base_component_id = component_usage.child_component_id
                                                    and
                                                        code_tag = 'LATEST'
                                                        `,

                                                            [  baseComponentId  ],

                                                            async function(err, results)
                                                            {
                                                                //showTimer(`15`)
                                                                for (let i = 0  ;   i < results.length;    i ++ ) {
                                                                    let newcodeEs = escape("(" + results[i].code.toString() + ")")
                                                                    let newCode2 =  `cachedCode["${results[i].sha1}"] = {
                                                              "type": "ws_to_browser_callDriverMethod_results",
                                                              "value": {
                                                                "code": unescape(\`${newcodeEs}\`),
                                                                "is_code_result": true,
                                                                "use_db": ${useDb?"\"" + useDb + "\"":null},
                                                                "libs": [],
                                                                "component_type": \"SYSTEM\",
                                                                "code_id": "${results[i].sha1}",
                                                                "base_component_id": "${results[i].child_component_id}"
                                                              },
                                                              "seq_num": 0
                                                            }

                                                            finderToCachedCodeMapping["${results[i].child_component_id}"] = "${results[i].sha1}"
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

                                                                let sqliteAppDbPath = path.join( mm.userData, 'app_dbs/' + baseComponentId + '.visi' )


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

                                                            })
                                                        //showTimer(`15.....2`)

                                                    }
                                                    , sqlite3.OPEN_READONLY)
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
                            }


                        })
                }, sqlite3.OPEN_READONLY)
        })
        //showTimer(`ret prom`)

        let ret = await promise;
        return ret
    }


    ,

    saveItemToIpfsCache: async function (srcCode) {
        //outputDebug("*** saveItemToIpfs: *** : " )
        let promise = new Promise(async function(returnfn) {
            let justHash = null
            try {
                console.log("Starting...")

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
    }


    ,

    //------------------------------------------------------------------------------
    //
    //
    //
    //
    //
    //------------------------------------------------------------------------------
    updateRevisions: function (thisDb,sqlite, baseComponentId) {
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
    }





    ,

    //------------------------------------------------------------------------------
    //
    //
    //
    //
    //
    //------------------------------------------------------------------------------
    fastForwardToLatestRevision: function (thisDb,sqlite, baseComponentId) {
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
    }


    ,




    //------------------------------------------------------------------------------
    //
    //
    //
    //
    //
    //------------------------------------------------------------------------------
    copyFile: function (source, target, cb) {
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
    }


    ,







    //------------------------------------------------------------------------------
    //
    //
    //
    //
    //
    //------------------------------------------------------------------------------
    enhanceCode: function (code, options) {
        let yz = this
        let parentHash = null
        let baseComponentId = null
        if (options) {
            parentHash = options.parentHash
            baseComponentId = options.baseComponentId
        }

        //
        // parent HASH
        //
        let lastParentHash = yz.getValueOfCodeString(code,"parent_hash")
        if (lastParentHash) {
            code = yz.deleteCodeString(code, "parent_hash")
        }
        if (parentHash) {
            code = yz.insertCodeString(code, "parent_hash", parentHash)
        }

        //
        // type
        //
        let oldBaseComp = yz.getValueOfCodeString(code,"base_component_id")
        if (oldBaseComp != baseComponentId ) {
            code = yz.deleteCodeString(code, "base_component_id")
            code = yz.insertCodeString(code, "base_component_id", baseComponentId)
        }

        //
        // timestamps
        //
        let timeNow = new Date().getTime()
        // if we don't want to reload this file then don't update the timestamp
        let createdTimestamp = yz.getValueOfCodeString(code, "created_timestamp")
        if ((createdTimestamp == null) || (createdTimestamp == "-1")) {
            if (yz.getValueOfCodeString(code,"load_once_from_file")) {
                timeNow = -1
            }
        }
        if (!createdTimestamp) {
            code = yz.deleteCodeString(code, "created_timestamp")
            code = yz.insertCodeString(code, "created_timestamp", timeNow)
        }

        code = yz.deleteCodeString(code, "updated_timestamp")
        code = yz.insertCodeString(code, "updated_timestamp", timeNow)


        //
        // Add a logo if none supplied
        //
        let logoUrl = yz.getValueOfCodeString(code,"logo_url")
        if (!yz.isValidObject(logoUrl)) {
            logoUrl = "/driver_icons/js.png"
            code = yz.insertCodeString(code, "logo_url", logoUrl)
        }


        //
        // visibility
        //
        let visibility = null
        let newvisibility = null
        visibility = yz.getValueOfCodeString(code,"visibility")
        newvisibility = visibility
        if (!yz.isValidObject(visibility)) {
            if (yz.isValidObject(options) && options.make_public) {
                newvisibility = "PUBLIC"
            } else {
                newvisibility = "PRIVATE"
            }
        }
        if (newvisibility != visibility) {
            code = yz.deleteCodeString(code, "visibility")
            code = yz.insertCodeString(code, "visibility", newvisibility)
        }



        //
        // return the amended code
        //
        return code
    }
    ,









    getIpfsHash: async function(sometext) {
        let ipfsHash = await OnlyIpfsHash.of(sometext)
        return ipfsHash
    }
    ,





    saveCodeV3: async function ( thisDb, code , options) {
        let mm = this
        await mm.setup(thisDb)
        if (code) {
            code = code.toString()
        }
        let baseComponentId = mm.getValueOfCodeString(code,"base_component_id")
        let parentHash = mm.getValueOfCodeString(code,"parent_hash")

        let promise = new Promise(async function(returnFn) {
            let restRoutes = {}
            let aoo = null
            if (options) {

                if (options.restRoutes) {
                    restRoutes = options.restRoutes
                }
                if (options.app) {
                    app = options.app
                }
            }

            if (!baseComponentId) {
                baseComponentId = uuidv1()
            }
            if (!code.toString().substring(0,20).includes("function")) {
                code =
                    `function() {${code}
    }`
            }

            //showTimer("    baseComponentId := " + baseComponentId)


            // if we don't want to reload this file then don't update the timestamp
            let updatedTimestamp = mm.getValueOfCodeString(code, "updated_timestamp")
            if (!updatedTimestamp) {
                updatedTimestamp = mm.getValueOfCodeString(code, "created_timestamp")
            }

            //showTimer(`3`)


            let componentOptions = null
            let maxProcesses = 1
            let rowhash = crypto.createHash('sha256');




            let visibility = null
            visibility = mm.getValueOfCodeString(code,"visibility")

            //showTimer(`4`)


            let logoUrl = mm.getValueOfCodeString(code,"logo_url")




            let interfaces = ""
            let interfaces2 = mm.getValueOfCodeString(code,"interfaces")
            if (interfaces2 && (interfaces2.length > 0)) {
                for (let rr=0; rr < interfaces2.length; rr ++) {
                    interfaces += "|  " + interfaces2[ rr ]
                }
            }

            //showTimer(`5`)

            let row = code.toString();

            rowhash.setEncoding('hex');
            rowhash.write(row);
            rowhash.end();
            //let sha1sum = rowhash.read();
            let readOnly = mm.getValueOfCodeString(code,"read_only")
            if (mm.getValueOfCodeString(code,"hide_header")) {
                componentOptions = "HIDE_HEADER"
            }

            //showTimer(`6`)


            let displayName = mm.getValueOfCodeString(code,"display_name")

            let useDb = mm.getValueOfCodeString(code,"use_db")
            let editors2 = mm.getValueOfCodeString(code,"editors")
            let controlType = mm.getValueOfCodeString(code,"component_type")

            let editors = null
            if (editors2) {
                editors = JSON.stringify(editors2,null,2)

            }
            let readWriteStatus = null
            if (readOnly) {
                readWriteStatus = "READ"
            }


            let codeChanges = mm.getValueOfCodeString(code,"code_changes",")//code_" + "changes")
            let codeChangesStr = null
            let numCodeChanges = null
            if (codeChanges) {
                codeChangesStr = JSON.stringify(codeChanges,null,2)
                numCodeChanges = codeChanges.length
            }

            let properties = mm.getValueOfCodeString(code,"properties",")//properties")
            if (properties) {
                properties = JSON.stringify(properties,null,2)
            }
            let properties2 = mm.getValueOfCodeString(code,"properties",")//properties")
            if (controlType == "VB") {
                //showTimer(`7`)

                ////showTimer("VB: " + baseComponentId)
                if (properties2) {
                    //showTimer(`8`)

                    ////showTimer("     properties: " + properties2.length)
                    for (let rttte = 0; rttte < properties2.length ; rttte++ ) {
                        let prop = properties2[rttte]
                        stmtInsertComponentProperty.run(baseComponentId, prop.id)




                    }
                }

            }




            let sha1sum  = await OnlyIpfsHash.of(code)
            ////showTimer("Save sha1 for :" + baseComponentId + ": " + sha1sum)

            let userId = null
            if (options) {
                save_code_to_file = options.save_code_to_file
                userId = options.userId
            }

            let existingCodeTags = await mm.getQuickSqlOneRow(thisDb,"select * from code_tags where base_component_id = ? and fk_user_id = ? and code_tag='EDIT'  ",[baseComponentId, userId])
            thisDb.serialize(
                function() {
                    thisDb.all(
                        " select  " +
                        "     id " +
                        " from " +
                        "     system_code " +
                        " where " +
                        "     id = ?;"
                        ,
                        sha1sum
                        ,
                        async function(err, rows) {
                            if (!err) {
                                ////showTimer("rows.length:   " + rows.length)
                                if ((rows.length == 0) || readOnly){
                                    try {

                                        if (controlType == "VB") {
                                            //showTimer(`7`)

                                            ////showTimer("VB: " + baseComponentId)
                                            stmtDeleteTypesForComponentProperty.run(baseComponentId)
                                            stmtDeleteAcceptTypesForComponentProperty.run(baseComponentId)
                                            if (properties2) {
                                                //showTimer(`8`)

                                                ////showTimer("     properties: " + properties2.length)
                                                for (let rttte = 0; rttte < properties2.length ; rttte++ ) {
                                                    let prop = properties2[rttte]
                                                    stmtInsertComponentProperty.run(baseComponentId, prop.id)


                                                    if (prop.types) {
                                                        let labelKeys = Object.keys(prop.types)
                                                        for (let rttte2 = 0; rttte2 < labelKeys.length ; rttte2++ ) {
                                                            let prop2 = prop.types[labelKeys[rttte2]]
                                                            ////showTimer("    " + prop.id + " = " +  JSON.stringify(prop.labels))
                                                            stmtInsertTypesForComponentProperty.run(baseComponentId, prop.id, labelKeys[rttte2],prop2)

                                                        }
                                                    }
                                                    //showTimer(`9`)
                                                    if (prop.accept_types) {
                                                        let labelKeys = Object.keys(prop.accept_types)
                                                        for (let rttte2 = 0; rttte2 < labelKeys.length ; rttte2++ ) {
                                                            let prop2 = prop.accept_types[labelKeys[rttte2]]
                                                            ////showTimer("    " + prop.id + " = " +  JSON.stringify(prop.labels))
                                                            stmtInsertAcceptTypesForComponentProperty.run(
                                                                baseComponentId,
                                                                prop.id,
                                                                labelKeys[rttte2],
                                                                prop2)

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
                                                "LATEST",
                                                code,
                                                baseComponentId,
                                                maxProcesses,
                                                displayName,
                                                updatedTimestamp,
                                                componentOptions,
                                                logoUrl,
                                                visibility,
                                                interfaces,
                                                useDb,
                                                editors,
                                                readWriteStatus,
                                                properties,
                                                controlType,
                                                save_code_to_file,
                                                sha1sum,
                                                "TIP",
                                                codeChangesStr,
                                                numCodeChanges,
                                                userId,
                                                1,
                                                "1 point for being committed"
                                            )
                                            stmtDeprecateOldCode.run(
                                                baseComponentId,
                                                sha1sum
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
                                            let jsLibs = mm.getValueOfCodeString(code, "uses_javascript_librararies")
                                            if (jsLibs) {
                                                ////showTimer(JSON.stringify(jsLibs,null,2))
                                                for (let tt = 0; tt < jsLibs.length ; tt++) {
                                                    scriptCode += `libLoaded[ "${jsLibs[tt]}" ] = true;
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
                                            let subComponents = mm.getValueOfCodeString(code, "sub_components")
                                            if (subComponents) {
                                                for (let tt = 0; tt < subComponents.length ; tt++) {
                                                    stmtInsertSubComponent.run(
                                                        baseComponentId,
                                                        subComponents[tt])
                                                }
                                            }
                                            let sqliteCode = ""
                                            if (mm.isValidObject(options)) {

                                                ////showTimer(JSON.stringify(options,null,2))
                                                if (options.sub_components) {
                                                    ////showTimer("Save options: " + options.sub_components.length)
                                                    ////showTimer(JSON.stringify(options,null,2))
                                                    for (let tew = 0; tew < options.sub_components.length ; tew ++) {
                                                        ////showTimer("Saving " + options.sub_components[tew])
                                                        if (mm.isValidObject(baseComponentId)) {
                                                            stmtInsertSubComponent.run(
                                                                baseComponentId,
                                                                options.sub_components[tew])
                                                        }
                                                    }
                                                }
                                            }
                                            //showTimer(`12`)

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

                                                newStaticFileContent = newStaticFileContent.toString().replace("let isStaticHtmlPageApp = false", "let isStaticHtmlPageApp = true")

                                                let newcode = escape( code.toString() )


                                                newStaticFileContent = newStaticFileContent.toString().replace("***STATIC_NAME***",displayName)
                                                newStaticFileContent = newStaticFileContent.toString().replace("***STATIC_NAME***",displayName)
                                                newStaticFileContent = newStaticFileContent.toString().replace("***STATIC_BASE_COMPONENT_ID***",baseComponentId)
                                                newStaticFileContent = newStaticFileContent.toString().replace("***STATIC_BASE_COMPONENT_ID***",baseComponentId)
                                                newStaticFileContent = newStaticFileContent.toString().replace("***STATIC_CODE_ID***",sha1sum)
                                                newStaticFileContent = newStaticFileContent.toString().replace("***STATIC_CODE_ID***",sha1sum)




                                                let newCode =  `cachedCode["${sha1sum}"] = {
                                              "type": "ws_to_browser_callDriverMethod_results",
                                              "value": {
                                                "code": /*APP_START*/unescape(\`${newcode}\`)/*APP_END*/,
                                                "is_code_result": true,
                                                "use_db": ${useDb?"\"" + useDb + "\"":null},
                                                "component_type": \"SYSTEM\",
                                                "libs": [],
                                                "code_id": "${sha1sum}",
                                                "base_component_id": "${baseComponentId}"
                                              },
                                              "seq_num": 0
                                            }
    
                                            finderToCachedCodeMapping["${baseComponentId}"] = "${sha1sum}"`


                                                //showTimer(`14`)

                                                newCode += `
                                                //newcodehere
                                            `
                                                thisDb.serialize(
                                                    async function() {
                                                        //showTimer(`15.....1`)

                                                        let stmt = thisDb.all(
                                                            `select
                                                            system_code.id as sha1,
                                                            child_component_id,
                                                            code
                                                        from
                                                            component_usage,
                                                            system_code
                                                        where
                                                            component_usage.base_component_id = ?
                                                        and
                                                            system_code.base_component_id = component_usage.child_component_id
                                                        and
                                                            code_tag = 'LATEST'
                                                            `,

                                                            [  baseComponentId  ],

                                                            async function(err, results)
                                                            {
                                                                //showTimer(`15`)
                                                                for (let i = 0  ;   i < results.length;    i ++ ) {
                                                                    let newcodeEs = escape("(" + results[i].code.toString() + ")")
                                                                    let newCode2 =  `cachedCode["${results[i].sha1}"] = {
                                                                  "type": "ws_to_browser_callDriverMethod_results",
                                                                  "value": {
                                                                    "code": unescape(\`${newcodeEs}\`),
                                                                    "is_code_result": true,
                                                                    "use_db": ${useDb?"\"" + useDb + "\"":null},
                                                                    "libs": [],
                                                                    "component_type": \"SYSTEM\",
                                                                    "code_id": "${results[i].sha1}",
                                                                    "base_component_id": "${results[i].child_component_id}"
                                                                  },
                                                                  "seq_num": 0
                                                                }
    
                                                                finderToCachedCodeMapping["${results[i].child_component_id}"] = "${results[i].sha1}"
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

                                                                let sqliteAppDbPath = path.join( mm.userData, 'app_dbs/' + baseComponentId + '.visi' )


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

                                                            })
                                                        //showTimer(`15.....2`)

                                                    }
                                                    , sqlite3.OPEN_READONLY)
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
                            }


                        })
                }, sqlite3.OPEN_READONLY)
        })
        //showTimer(`ret prom`)

        let ret = await promise;
        return ret
    }




}
