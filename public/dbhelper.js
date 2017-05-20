// ***********************************************************
// ***********************************************************
// This is the code to add SQL Support to GunDB
// ***********************************************************
// ***********************************************************
var localgun;
var localgunclass;
var sqlParseFn;
var staticSqlResultSets    = new Object();
var realtimeSqlResultSets  = new Object();
var realtimeSqlQueries     = new Object();
var tablesMetaData         = new Object();
var sqlQueue               = [];
var autoSerialId           = null;
var inRealtimeUpdate       = false;
var inSql                  = false;
var queueCount             = 0;
var queryId                = 1;
var queryDone              = new Object();
var sqlQueueItem = null;

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
		var tableName        = newAst.table;


        //console.log('paramsDefined: ' + JSON.stringify(paramsDefined , null, 2))
        for(i = 0; i < paramsDefined.length; i ++) {
            fields[ paramsDefined[ i ].pos ] = { value: params[i] };
        };
        //console.log('fields: ' + JSON.stringify(fields , null, 2))

        fieldsDefinedIndex = 0;
        for( i = 0; i < columns.length; i ++ ) {
            if (!fields[i]) {
                fields[i] = fieldsDefined[fieldsDefinedIndex];
                fieldsDefinedIndex ++;
            };
        };

        for(i = 0; i < columns.length; i ++) {
            newRecord[columns[i]] = fields[i].value;
        };

        // this line is only here as often an insert without
        // a select first is very buggy and doesn't see the whole
        // existing result set
        //localgun.sql('select * from ' + tableName)

        //console.log('adding: ' + JSON.stringify(newRecord , null, 2) + '...');
        localgun.get(schema).get(tableName).set(newRecord, function(ack){
            tablesMetaData[tableName]["refreshTableVersion"] = true;
            tablesMetaData[tableName]["incrementTableVersion"] = true;
            inSql = false;
            //console.log('... added to ' + tableName + '.');
			return;
        });
    }








    // ---------------------------------------------
    //                  g_select
    //
    // This uses SQL to get records
    // ---------------------------------------------
    function g_select( sql, params, newAst, gun, cb, schema ) {
		//console.log('**************SQL****: '  + JSON.stringify(sql , null, 2))
        var i = 0;
        var count = 0;
        var thisQueryId = queryId ++;
        queryDone[ thisQueryId ] = false;
        //console.log('*cb: '  + cb);
        staticSqlResultSets[thisQueryId] = [];

        var each = function (a){
            var b = localgunclass.obj.copy(a);
            if(in_where( b, newAst.where )) {
                count ++;
                delete b['_'];
         	    //console.log('select from each',a);
                staticSqlResultSets[thisQueryId].push(b);
            };
        }

        var end = function (coll){
            if (!queryDone[ thisQueryId ]) {
					queryDone[ thisQueryId ] = true;
                //console.log('coll: '  + JSON.stringify(coll , null, 2))
                //staticSqlResultSets[thisQueryId] = objectToArray(temp);
                //console.log('**Get: '  + JSON.stringify(staticSqlResultSets[thisQueryId] , null, 2))
                //console.log('**cb: '  + cb)
                if (cb) {
					//console.log('                count results: '  + JSON.stringify(staticSqlResultSets[thisQueryId] , null, 2))
                    cb( staticSqlResultSets[thisQueryId] );
                } else {
                    //console.log( JSON.stringify(staticSqlResultSets[thisQueryId] , null, 2) );
                };
                //console.log('**Finished Get: '  + count)
    			inSql = false;
            }
        }

        gun.get(schema).get(newAst.from[0].table).valMapEnd( each , end , newAst);
        gun.get(schema).get(newAst.from[0].table).not( end );

      return true;//staticSqlResultSets[thisQueryId];
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
        //console.log('******* newAst.where: ' + JSON.stringify(newAst.where.right.value , null, 2));


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
						tablesMetaData[newAst.table]["refreshTableVersion"] = true;
						tablesMetaData[newAst.table]["incrementTableVersion"] = true;
                        //console.log('Updated: ' + newAst.where.right.value)
						inSql = false;
                    });
            } else {
                //console.log("    no match")
            }
        }

        var end = function(coll){
            //console.log('Finished Update: ' + newAst.where.right.value)
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
			  var newAst = JSON.parse(JSON.stringify( sqlParseFn(sql) ));
			  if (newAst.type == 'insert') {
				  //sqlQueue.push({sql: "select * from " + newAst.table, params: [], cb: null, schema: schema});
			  }

			  sqlQueue.push({sql: sql, params: params, cb: cb, schema: schema});
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
                            args2.push( ast );
                            cb.apply( this , args2 );
                            if ( !count ) {
                                end.apply( this , args2 );
                            };
                        });
                });
            });
            return gun;
        };
    };




    exports.sql = function( sql, p2, p3, p4 ){
        var hasParams = Array.isArray(p2);
        var params;
        var cb;
        var schema;

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
                    //console.log(valsReturned[0])
                }
            }
          }
          ,
           schema);
    }


    exports.start = function() {
        this.sql1("select * from systemsettings where name='autoindex'",
                    function(valret) {
                        //console.log('valret: ' + valret)
                       if (valret) {
                           autoSerialId = valret.value;
                       } else {
                           localgun.sql('insert into systemsettings (name, value ) values (?,?)',['autoindex', 1])
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
        localgun.sql("update systemsettings set value = " +
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






    exports.realtimeSql = function(realtimeSqlString, callbackFn, schema) {
        try {
            if (!schema) {
                schema = 'default'
            }
            newAst = sqlParseFn(realtimeSqlString);
            //console.log('RTable: ' + newAst.from[0].table);

            if (newAst.type == 'select') {
                //console.log("select RR********* SQL: " + realtimeSqlString + ", table: " + newAst.from[0].table)
				var tableName = newAst.from[0].table;
				ensureTableMetaDataExists( tableName );
                if (!realtimeSqlQueries[tableName]['sql'][realtimeSqlString]) {
                    realtimeSqlQueries[tableName]['sql'][realtimeSqlString] = new Object();
                    realtimeSqlQueries[tableName]['sql'][realtimeSqlString]["callback"] = callbackFn;
                    realtimeSqlQueries[tableName]['sql'][realtimeSqlString]["schema"] = schema;
                    realtimeSqlQueries[tableName]['sql'][realtimeSqlString]["lastReadVersion" ]     = -1
                }


                //localgun.sql( realtimeSqlString );
              //console.log('(REAL:sql): ' + realtimeSqlString)
              //console.log('(REAL:realtimeSqlQueries): ' + JSON.stringify(realtimeSqlQueries , null, 2))
            }
        }
        catch(err) {
            //console.log(err);
            return false;
        }
        return true;
      };



    function ensureTableMetaDataExists( tableName ) {
        if (!tablesMetaData[ tableName ] ) {
            tablesMetaData[ tableName ] = new Object()
            tablesMetaData[ tableName ]["version"]                  = -1
            tablesMetaData[ tableName ]["refreshTableVersion"]      = false
            tablesMetaData[ tableName ]["incrementTableVersion"]    = false
            tablesMetaData[ tableName ]["createNewTableVersion"]    = false
        }

        if (!realtimeSqlQueries[ tableName ] ) {
            realtimeSqlQueries[ tableName ] = new Object()
            realtimeSqlQueries[ tableName ][ "sql" ]                 = new Object()

			localgun.get('change_log').get( "default" ).get( tableName ).get('version').on(
			  function(a) {
				  console.log('*****Change to table name: ' + tableName + ' : New version: ' + a )
				  console.log('              : current version: ' + tablesMetaData[tableName]['version'] )
				  //a.value(function(q){console.log('a: ' + JSON.stringify(q , null, 2) )})
				  if (a > tablesMetaData[tableName]['version']) {
					  //console.log('Change to table name: ' + tableName + ' : ' + a.version)
					  //console.log('     a: ' + JSON.stringify(a , null, 2) )
					  tablesMetaData[ tableName ]['version'] = a;
				  }
				},false);


		}

	}






      setInterval( function () {


          //console.log('inRealtimeUpdate: ' + JSON.stringify(inRealtimeUpdate , null, 2)      )
          //console.log('inSql: ' + JSON.stringify(inSql , null, 2)   + ', queue: ' + JSON.stringify(sqlQueue.length , null, 2)   )
          //console.log('inSql: ' + JSON.stringify(inSql , null, 2)   + ', queue: ' + JSON.stringify(sqlQueue.length , null, 2)   )
		  if (sqlQueueItem) {
			//console.log('     sql: ' + JSON.stringify(sqlQueueItem.sql , null, 2))
		  }
		  //console.log(' ')
          if (!inSql) {
              var allTables = Object.keys(tablesMetaData);
			  var tableName;
              //console.log('tables: ' + JSON.stringify(allRealtimetables , null, 2))
              for ( tableName of allTables) {
                  ensureTableMetaDataExists(tableName)
				  
					//console.log(tableName + ', refreshTableVersion: ' + JSON.stringify(tablesMetaData[tableName]['refreshTableVersion'] , null, 2)    )
					//console.log('           , incrementTableVersion: ' + JSON.stringify(tablesMetaData[tableName]['incrementTableVersion'] , null, 2)    )
					//console.log('           , createNewTableVersion: ' + JSON.stringify(tablesMetaData[tableName]['createNewTableVersion'] , null, 2)    )
					//console.log('           , version: ' + JSON.stringify(tablesMetaData[tableName]['version'] , null, 2)    )
					
  	   			    var sqlToUpdateList2 = Object.keys(realtimeSqlQueries[ tableName ]['sql'])
					var sqlToUpdate2;
				    for ( sqlToUpdate2 of sqlToUpdateList2 ) {
					  //console.log('        ' + sqlToUpdate2 + '   , realtime  lastReadVersion: ' + JSON.stringify(realtimeSqlQueries[ tableName ]['sql'][sqlToUpdate2][ "lastReadVersion" ] , null, 2) + ' : ' + tablesMetaData[tableName]['version']   )
					}

                  //-------------------------------------------------------------------------------------------
                  // If a table changes then we need to inform everyone else that the table has changed
                  //
                  //
                  //-------------------------------------------------------------------------------------------
                  if (tablesMetaData[tableName]['refreshTableVersion'] == true) {
                      inSql = true
                      //console.log('updateTableVersions table: ' + JSON.stringify(tableName , null, 2))
                      if (!schema) {
                          schema = 'default'
                      }
                      //console.log('    schema: ' + JSON.stringify(schema , null, 2))
                      var thisQueryId = queryId ++;
                      queryDone[ thisQueryId ] = false

                      // create the version number if it does not exist
                      //console.log("tablesMetaData[ tableName ][ 'version' ] = 0..................")
                      localgun.get('change_log').get( schema ).get( tableName ).not(

                        function(a) {
                            if (!queryDone[ thisQueryId ]) {
                                queryDone[ thisQueryId ] = true
                                //console.log("..................tablesMetaData[ tableName ][ 'version' ] = 0")

                                tablesMetaData[ tableName ]["refreshTableVersion"] = false
                                tablesMetaData[ tableName ]["incrementTableVersion"] = false
                                tablesMetaData[ tableName ]["createNewTableVersion"] = true
                                inSql = false
                            }
                          })



					  // increment the version number
                      //console.log("tablesMetaData[ " + tableName + " ][ 'version' ] = a.version..................")
                      localgun.get('change_log').get( schema ).get( tableName ).val(

                        function(a) {
                            if (!queryDone[ thisQueryId ]) {
                                queryDone[ thisQueryId ] = true
                                tablesMetaData[ tableName ][ 'version' ] = a.version

                                tablesMetaData[ tableName ]["refreshTableVersion"] = false
                                inSql = false
                            }
                          })

                      //inSql = false
                      //tablesMetaData[ tableName ]["refreshTableVersion"] = false
                      return

                  }



                  //-------------------------------------------------------------------------------------------
                  // If a table changes then we need to inform everyone else that the table has changed
                  //
                  //
                  //-------------------------------------------------------------------------------------------
                  if ( tablesMetaData[ tableName ] [ "incrementTableVersion"] && !tablesMetaData[ tableName ]["refreshTableVersion"]) {
                      inSql = true
                      //console.log('updateTableVersions table: ' + JSON.stringify(tableName , null, 2))
                      if (!schema) {
                          schema = 'default'
                      }
                      var oldVersion = tablesMetaData[ tableName ][ 'version' ]
                      //console.log('////    updating version for: ' + tableName + ', ' + JSON.stringify(oldVersion , null, 2))
                      var newVersion = oldVersion + 1

                      //console.log('    Updating version from : ' + JSON.stringify(oldVersion , null, 2) + ' to ' + JSON.stringify(newVersion , null, 2))
                      localgun.get('change_log').get( schema ).get( tableName ).put(
                            {version: newVersion})

                      inSql = false
                      tablesMetaData[ tableName ] [ "incrementTableVersion" ]      = false
                      return;
                  }



                  //-------------------------------------------------------------------------------------------
                  // If a table is created then add a version number to it
                  //
                  //
                  //-------------------------------------------------------------------------------------------
                  if (tablesMetaData[ tableName ] ['createNewTableVersion']) {
                      inSql = true
                      //console.log('createNewTableVersion table: ' + JSON.stringify(tableName , null, 2))
                      if (!schema) {
                          schema = 'default'
                      }
                      //console.log('////    creating new version for: ' + JSON.stringify(tableName , null, 2))
                      localgun.get('change_log').get( schema ).get( tableName ).put(
                          {version: 0})

                      inSql = false
                      tablesMetaData[ tableName ] ['createNewTableVersion'] = false
                      return;
                  }



              }



              sqlQueueItem = sqlQueue.shift();
              if (sqlQueueItem) {
                  inSql = true;
                  //console.log('sql: ' + JSON.stringify(sqlQueueItem.sql , null, 2))
                  queueCount ++;
                  var sql    = sqlQueueItem.sql;
                  var params = sqlQueueItem.params;
                  var schema = sqlQueueItem.schema;
                  var cb     = sqlQueueItem.cb;


                  var newAst = JSON.parse(JSON.stringify( sqlParseFn(sql) ));
                  //console.log(queueCount + ' : ' + sql)
                  //console.log('newAst: ' + JSON.stringify(newAst , null, 2))
                  if (!schema) {
                      schema = 'default';
                  }

                  var chain  = localgun.chain();
                  if (newAst.type == 'select') {
                      ensureTableMetaDataExists(newAst.from[0].table)
                  } else if (newAst.type == 'update') {
                      ensureTableMetaDataExists(newAst.table);
                  } else if (newAst.type == 'insert') {
                      ensureTableMetaDataExists(newAst.table);
                  }
                  switch( newAst.type ) {
                      case 'insert' : g_insert(newAst, params,         localgun,     schema);break;
                      case 'select' : g_select(sql,    params, newAst, localgun, cb, schema);break;
                      case 'update' : g_update(newAst, params,         localgun,     schema);break;
                  }
				  return
                  //return this
              }


              //console.log('sqlQueue.length: ' + JSON.stringify(sqlQueue.length , null, 2))
              //console.log('inRealtimeUpdate: ' + JSON.stringify(inRealtimeUpdate , null, 2))
              if (sqlQueue.length == 0) {
                  if (!inRealtimeUpdate) {
                      inRealtimeUpdate = true;
                      //console.log('Changed: ' + changed);
                      var allRealtimetables = Object.keys(realtimeSqlQueries);
                      //console.log('tables: ' + JSON.stringify(allRealtimetables , null, 2))
                      for ( tableName of allRealtimetables ) {
                          //console.log("tableName: " + tableName );
                          if (realtimeSqlQueries[ tableName ] ) {
							  var sqlToUpdateList = Object.keys(realtimeSqlQueries[ tableName ]['sql'])
							  var sqlToUpdate;
							  for ( sqlToUpdate of sqlToUpdateList ) {
								  //console.log("realtimeSqlQueries[" + sqlToUpdate + "] = " + JSON.stringify(realtimeSqlQueries[ tableName ]["sql"][ sqlToUpdate ] , null, 2) + ", "+ tablesMetaData[ tableName ] ['version'] + "");
								  if (realtimeSqlQueries[ tableName ]["sql"][ sqlToUpdate ][ "lastReadVersion" ] < tablesMetaData[ tableName ] ['version']) {
									  //console.log("table changed: " + tableName );
									  //localgun.sql("SELECT * FROM Customers ");
									  //console.log('    sql: ' + JSON.stringify(sqlToUpdate , null, 2))
                                      var cbb = realtimeSqlQueries[tableName]['sql'][sqlToUpdate]["callback"];
                                      if (cbb) {
                                          //console.log('**HAS A CALLBACK on SQL: ' + sqlToUpdate);
                                          //console.log('**Updating realtime SQL :  ' + sqlToUpdate);
										  
										  // double call makes sure we read the data or it doesnt work???/
                                          localgun.sql(sqlToUpdate, null, null);
                                          localgun.sql(sqlToUpdate, null, cbb);
                                          realtimeSqlQueries[ tableName ]['sql'][sqlToUpdate]['lastReadVersion'] = tablesMetaData[ tableName ] ['version']
                                      };
                                  }


                              }
                          }
                      }
                      inRealtimeUpdate = false;
                  }
              }




          }

      }, 90)






}(typeof exports === 'undefined' ? this.share = {} : exports));
