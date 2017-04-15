// ***********************************************************
// ***********************************************************
// This is the code to add SQL Support to GunDB
// ***********************************************************
// ***********************************************************
var localgun;
var localgunclass;
var sqlParseFn;
var staticSqlResultSets   = new Object();
var realtimeSqlResultSets = new Object();
var realtimeTablesToWatch = new Object();
var tablesToWatch         = new Object();
var sqlQueue              = [];
var autoSerialId          = null;
var inRealtimeUpdate      = false;
var inSql                 = false;
var queueCount            = 0;



(function(exports){

    function objectToArray( data ) {
        var list2 = [];
        for (var itemkey in Object.keys( data )) {
            var obj = data[ itemkey ];
            //console.log(itemkey);
          if(data[itemkey] != undefined) {
            list2.push( obj );
            }
        };
        return list2;
    }




    // ---------------------------------------------
    //                  in_where
    //
    // This defines the where claus for the SQL
    // ---------------------------------------------
    function in_where( o, where ) {
        if ( !where ) {
            return true;
        }
        switch( where.operator ) {
            case '='  : return o[where.left.column] == where.right.value; break;
            case '!=' : return o[where.left.column] != where.right.value; break;
            case 'IS' : return o[where.left.column] == where.right.value; break;
            case '>'  : return o[where.left.column] > where.right.value; break;
            case '<'  : return o[where.left.column] < where.right.value;break;
            case '&'  : // fall through
            case 'AND': return in_where(o, where.left) && in_where(o, where.right); break;
            case '||' : // fall through
            case 'OR' : return in_where(o, where.left) || in_where(o, where.right);break;
            default: return false;
        }
    };





    // ---------------------------------------------
    //                  g_insert
    //
    // This creates a new record
    // ---------------------------------------------
    function g_insert( newAst, params, gun, schema ){
        var newRecord = {};
        var columns    = newAst.columns;
        //console.log('columns: ' + JSON.stringify(fields , null, 2))
        var fieldsDefined    = newAst.values[0].value;
        var fields           = new Object();
        var paramsDefined    = newAst.params;


        //console.log('paramsDefined: ' + JSON.stringify(paramsDefined , null, 2))
        for(i = 0; i < paramsDefined.length; i ++) {
            fields[ paramsDefined[ i ].pos ] = { value: params[i] };
        };
        //console.log('fields: ' + JSON.stringify(fields , null, 2))

        fieldsDefinedIndex = 0;
        for( i = 0; i < columns.length; i ++ ) {
            if (!fields[i]) {
                fields[i] = fieldsDefined[fieldsDefinedIndex]
                fieldsDefinedIndex ++
            }
        };

        for(i = 0; i < columns.length; i ++) {
            newRecord[columns[i]] = fields[i].value;
        };

        // this line is only here as often an insert without
        // a select first is very buggy and doesn't see the whole
        // existing result set
        //localgun.sql('select * from ' + newAst.table)

        localgun.get(schema).get(newAst.table).set(newRecord, function(ack){
            inSql = false
            tablesToWatch[newAst.table]["dirty"] = true


        });
    }








    // ---------------------------------------------
    //                  g_select
    //
    // This uses SQL to get records
    // ---------------------------------------------
    function g_select( sql, params, newAst, gun, cb, schema ) {
        staticSqlResultSets[sql] = [];
        var i = 0
        var count = 0;
        //console.log('*cb: '  + cb)

        var each = function (a){
            var b = localgunclass.obj.copy(a);
            if(in_where( b, newAst.where )) {
                count ++;
                delete b['_'];
         	    //console.log('select from each',a);
                staticSqlResultSets[sql].push(b)
            };
        }

        var end = function (coll){
            //console.log('coll: '  + JSON.stringify(coll , null, 2))
            //staticSqlResultSets[sql] = objectToArray(temp);
            //console.log('**Get: '  + JSON.stringify(staticSqlResultSets[sql] , null, 2))
            //console.log('**cb: '  + cb)
            if (cb) {
                cb( staticSqlResultSets[sql] );
            } else {
                console.log( JSON.stringify(staticSqlResultSets[sql] , null, 2) );
            };
            //console.log('**Finished Get: '  + count)
            inSql = false

        }

        gun.get(schema).get(newAst.from[0].table).valMapEnd( each , end , newAst);
        gun.get(schema).get(newAst.from[0].table).not( end );

      return true;//staticSqlResultSets[sql];
   };









    // ---------------------------------------------
    //                  g_update
    //
    // This uses SQL to update records
    // ---------------------------------------------
    function g_update( newAst2, params, gun, schema ){
        //console.log('Update table name: ' + newAst.table);
        //console.log('Update schema name: ' + schema);
        var newAst = JSON.parse(JSON.stringify( newAst2 ));
        console.log('******* newAst.where: ' + JSON.stringify(newAst.where.right.value , null, 2));


         var processRecord  = function ( record2 , newId ) {
             var record = localgunclass.obj.copy(record2);

            //console.log("      processRecord: " + JSON.stringify(newAst.where.right.value , null, 2));

            //if (record.name == "TestDriver") {
                //console.log("update record: " + JSON.stringify(record.name , null, 2));
                //console.log('newAst.where: ' + JSON.stringify(newAst.where , null, 2));
            //}

            if ( in_where( record , newAst.where ) ) {
                //console.log("    match")

                var paramIndex = 0;
                for ( var column of newAst.set ) {
                    if ( column.value.type == 'param' ) {
                        record[ column.column ] = params[ paramIndex ];
                        paramIndex ++;
                    } else {
                        record[ column.column ] = column.value.value;
                        //console.log( '----------------' + column.column + ' = ' + column.value.value);
                    }
                }
                //console.log("ID: " + newId);
                gun.get(schema).get(newAst.table).get(newId).put(
                    record,
                    function(ack) {
                        //console.log('Updated: ' + newAst.where.right.value)
                    });
            } else {
                //console.log("    no match")
            }
        }

        var end = function(coll){
            //console.log('Finished Update: ' + newAst.where.right.value)
            inSql = false
            tablesToWatch[newAst.table]["dirty"] = true
        }

        gun.get(schema).get(newAst.table).valMapEnd( processRecord , end , newAst);
    };




    // ---------------------------------------------
    //                  setGunDB
    //
    // This sets the instance of GunDB
    // ---------------------------------------------
    exports.setGunDB  = function(lg) {
        localgun = lg;
    };




    // ---------------------------------------------
    //                  setGunDBClass
    //
    // This sets the Class GunDB
    // ---------------------------------------------
    exports.setGunDBClass  = function( lg ) {
        localgunclass = lg;


        localgunclass.chain.sql = function( sql, params, cb, schema ){
            sqlQueue.push({sql: sql, params: params, cb: cb, schema: schema})

        }




        localgunclass.chain.valMapEnd = function ( incb , inend , ast2 ) {
            var n       = function () {};
            var count   = 0;
            var souls   = [];
            var gun     = this;
            var cb      = incb || n;
            var end     = inend || n;
            var ast     = JSON.parse(JSON.stringify(ast2));

            gun.val( function ( list ) {
                var args = Array.prototype.slice.call( arguments );
                localgunclass.node.is( list , function ( n , soul ) {
                    count += 1;
                    souls.push( soul );
                });

                souls.forEach(
                    function ( soul ) {
                        gun.back( -1 ).get( soul ).val( function ( val , key ) {
                            count -= 1;
                            var args2 = Array.prototype.slice.call( arguments );
                            args2.push( ast )
                            cb.apply( this , args2 );
                            if ( !count ) {
                                end.apply( this , args2 );
                            }
                        });
                });
            });
            return gun;
        };
    };




    exports.sql = function( sql, p2, p3, p4 ){
        var hasParams = Array.isArray(p2);
        var params
        var cb
        var schema

        if (hasParams) {
            params = p2
            cb     = p3
            schema = p4
        } else {
            params = []
            cb     = p2
            schema = p3
        }
        localgun.sql( sql, params, cb, schema );
    }

    exports.sql1 = function(sql, p2, p3, p4 ){
        var hasParams = Array.isArray(p2);
        var params
        var cb
        var schema

        if (hasParams) {
            params = p2
            cb     = p3
            schema = p4
        } else {
            params = []
            cb     = p2
            schema = p3
        }

        //console.log('called sql1')
        //console.log('    sql: ' + sql)
        //console.log('    sql: ' + params)
        //console.log('    sql: ' + cb)

        return localgun.sql(
          sql
          ,
          params
          ,
          function(valsReturned) {
            if (!valsReturned) {
                if (cb) {
                    cb(null)
                  }
            } else if (valsReturned.length == 0) {
                if (cb) {
                    cb(null)
                  }
            } else {
              if (cb) {
                cb(valsReturned[0])
                }
                else {
                    console.log(valsReturned[0])
                }
            }
          }
          ,
           schema);
    }


    exports.start = function() {
        sql1("select * from systemsettings where name='autoindex'",
                    function(valret) {
                        console.log('valret: ' + valret)
                       if (valret) {
                           autoSerialId = valret.value;
                       } else {
                           sql('insert into systemsettings (name, value ) values (?,?)',['autoindex', 1])
                       }
                    })
    //autoSerialId
    }



    exports.autoIndexSerialId = function() {
        if (!autoSerialId) {
            autoSerialId = 1;
        } else {
            autoSerialId ++;
        }
        sql("update systemsettings set value = " +
        autoSerialId
        + " where name = 'autoindex'")
        return autoSerialId;
    }


    // ---------------------------------------------
    //                  setSqlParseFn
    //
    // This sets the parse function to use
    // ---------------------------------------------
    exports.setSqlParseFn = function(lg) {
        sqlParseFn = lg;
    };






    exports.realtimeSql = function(sql3, callbackFn, schema) {
        try {
            if (!schema) {
                schema = 'default'
            }
            newAst = sqlParseFn(sql3);
            //console.log('RTable: ' + newAst.from[0].table);

            if (newAst.type == 'select') {
                console.log("select RR********* SQL: " + sql3 + ", table: " + newAst.from[0].table)
                if (!realtimeTablesToWatch[newAst.from[0].table]) {
                    realtimeTablesToWatch[newAst.from[0].table] = new Object();
                    realtimeTablesToWatch[newAst.from[0].table]['sql'] = new Object();
                    realtimeTablesToWatch[newAst.from[0].table]['version'] = -1;
                    var tableName = newAst.from[0].table;

                    realtimeTablesToWatch[tableName]["changed"] = true
                    localgun.get('change_log').get( schema ).get( tableName ).on(
                      function(a) {
                          console.log('*****Change to table name: ' + tableName + ' : ' + a.version + ' : '  + realtimeTablesToWatch[tableName]['version'])
                          //a.value(function(q){console.log('a: ' + JSON.stringify(q , null, 2) )})
                          if (a.version > realtimeTablesToWatch[tableName]['version']) {
                              console.log('Change to table name: ' + tableName + ' : ' + a.version)
                              //console.log('     a: ' + JSON.stringify(a , null, 2) )
                              realtimeTablesToWatch[tableName]["changed"] = true
                              if (!tablesToWatch[tableName]) {
                                  tablesToWatch[tableName] = new Object();
                              }
                              tablesToWatch[tableName]["dirty"] = true
                              realtimeTablesToWatch[tableName]['version'] = a.version
                          }
                        },false);


                }
                if (!realtimeTablesToWatch[newAst.from[0].table][sql3]) {
                    realtimeTablesToWatch[newAst.from[0].table]['sql'][sql3] = new Object();
                    realtimeTablesToWatch[newAst.from[0].table]['sql'][sql3]["callback"] = callbackFn;
                    realtimeTablesToWatch[newAst.from[0].table]['sql'][sql3]["schema"] = schema;
                }


                   localgun.sql(sql3);
              //console.log('(REAL:sql): ' + sql3)
              //console.log('(REAL:realtimeTablesToWatch): ' + JSON.stringify(realtimeTablesToWatch , null, 2))
            }
        }
        catch(err) {
            console.log(err);
            return false;
        }
        return true;
      };











      setInterval( function () {


          //console.log('inSql: ' + JSON.stringify(inSql , null, 2))
          if (!inSql) {
              var allTables = Object.keys(tablesToWatch);
              //console.log('tables: ' + JSON.stringify(allRealtimetables , null, 2))
              for ( tableName of allTables) {

                  if (tablesToWatch[tableName]['dirty'] == true) {
                      inSql = true
                      console.log('Dirty table: ' + JSON.stringify(tableName , null, 2))
                      if (!schema) {
                          schema = 'default'
                      }
                      console.log('    schema: ' + JSON.stringify(schema , null, 2))

					  // increment the version number
                      localgun.get('change_log').get( schema ).get( tableName ).val(

                        function(a) {
                            var oldVersion = 0;
                            var newVersion = 0;
                              if (a.version) {
                                  oldVersion = a.version
								  newVersion = oldVersion + 1
                              }
                            console.log('    Updating version from : ' + JSON.stringify(oldVersion , null, 2) + ' to ' + JSON.stringify(newVersion , null, 2))
                              localgun.get('change_log').get( schema ).get( tableName ).put(
                                  {version: newVersion})
                              inSql = false
                              tablesToWatch[tableName]["dirty"] = false
                          })


					  // create the version number if it does not exist
                      localgun.get('change_log').get( schema ).get( tableName ).not(

                        function(a) {
                            console.log('    creating new version for: ' + JSON.stringify(a , null, 2))
                              var newVersion = 0;
                              localgun.get('change_log').get( schema ).get( tableName ).put(
                                  {version: newVersion})
                              inSql = false
                              tablesToWatch[tableName]["dirty"] = false
                          })

                      inSql = false
                      tablesToWatch[tableName]["dirty"] = false
                      return

                  }
              }



              var sqlQueueItem = sqlQueue.shift()
              if (sqlQueueItem) {
                  inSql = true
                  console.log('sql: ' + JSON.stringify(sqlQueueItem.sql , null, 2))
                  queueCount ++;
                  var sql    = sqlQueueItem.sql
                  var params = sqlQueueItem.params
                  var schema = sqlQueueItem.schema
                  var cb     = sqlQueueItem.cb


                  var newAst = JSON.parse(JSON.stringify( sqlParseFn(sql) ));
                  console.log(queueCount + ' : ' + sql)
                  //console.log('newAst: ' + JSON.stringify(newAst , null, 2))
                  if (!schema) {
                      schema = 'default'
                  }

                  var chain  = localgun.chain();
                  if (newAst.type == 'select') {
                      if (!tablesToWatch[newAst.from[0].table]) {
                          tablesToWatch[newAst.from[0].table] = new Object();
                          tablesToWatch[newAst.from[0].table]["dirty"] = false
                      }
                  } else if (newAst.type == 'update') {
                      if (!tablesToWatch[newAst.table]) {
                          tablesToWatch[newAst.table] = new Object();
                          tablesToWatch[newAst.table]["dirty"] = true
                      }
                  } else if (newAst.type == 'insert') {
                      if (!tablesToWatch[newAst.table]) {
                          tablesToWatch[newAst.table] = new Object();
                          tablesToWatch[newAst.table]["dirty"] = true
                      }
                  }
                  switch( newAst.type ) {
                      case 'insert' : g_insert(newAst, params,         localgun,     schema);break;
                      case 'select' : g_select(sql,    params, newAst, localgun, cb, schema);break;
                      case 'update' : g_update(newAst, params,         localgun,     schema);break;
                  }
                  //return this
              }



              if (sqlQueue.length == 0) {
                  if (!inRealtimeUpdate) {
                      inRealtimeUpdate = true;
                      //console.log('Changed: ' + changed);
                      var allRealtimetables = Object.keys(realtimeTablesToWatch);
                      //console.log('tables: ' + JSON.stringify(allRealtimetables , null, 2))
                      for ( tableName of allRealtimetables) {
                          //console.log("tableName: " + tableName );
                          if (realtimeTablesToWatch[ tableName ] ) {
                              if (realtimeTablesToWatch[ tableName ][ "changed" ]) {
                                  //console.log("table changed: " + tableName );
                                  //localgun.sql("SELECT * FROM Customers ");
                                  var sqlToUpdate = Object.keys(realtimeTablesToWatch[ tableName ]['sql']).toString()
                                  //console.log('    sql: ' + JSON.stringify(sqlToUpdate , null, 2))
                                  var cbb = realtimeTablesToWatch[tableName]['sql'][sqlToUpdate]["callback"];
                                  if (cbb) {
                                      console.log('**HAS A CALLBACK on SQL: ' + sqlToUpdate);
                                      //console.log('localgun: ' + localgun.sql(sqlToUpdate));
                                      localgun.sql(sqlToUpdate, null, cbb);
                                  };


                                  realtimeTablesToWatch[ tableName ][ "changed" ] = false
                              }
                          }
                      }
                      inRealtimeUpdate = false;
                  }
              }




          }

      }, 200)






}(typeof exports === 'undefined' ? this.share = {} : exports));
