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
var autoSerialId = null;



(function(exports){

    function objectToArray(data) {
        var list2 = [];
        for (var itemkey in Object.keys(data)) {
            var obj = data[itemkey];
            //console.log(itemkey);
          if(data[itemkey] != undefined) {
            list2.push(obj);
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
        if (!where) {
            return true;
        }
        switch(where.operator) {
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
            fields[paramsDefined[i].pos] = {value: params[i]};
        };
        //console.log('fields: ' + JSON.stringify(fields , null, 2))

        fieldsDefinedIndex = 0;
        for(i = 0; i < columns.length; i ++) {
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
        localgun.sql('select * from ' + newAst.table)

        gun.get(schema).get(newAst.table).set(newRecord);
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

        function each(a){
            var b = localgunclass.obj.copy(a);
            if(in_where( b, newAst.where )) {
                count ++;
                delete b['_'];
         	    //console.log('select from each',a);
                staticSqlResultSets[sql].push(b)
            };
        }

        function end(coll){
            //console.log('coll: '  + JSON.stringify(coll , null, 2))
            //staticSqlResultSets[sql] = objectToArray(temp);
            //console.log('**Get: '  + JSON.stringify(staticSqlResultSets[sql] , null, 2))
            //console.log('**cb: '  + cb)
            if (cb) {
                cb( staticSqlResultSets[sql] );
            } else {
                //console.log( JSON.stringify(staticSqlResultSets[sql] , null, 2) );
            };
            //console.log('**Finished Get: '  + count)

        }

        gun.get(schema).get(newAst.from[0].table).valMapEnd(each,end);
        gun.get(schema).get(newAst.from[0].table).not(end);

      return true;//staticSqlResultSets[sql];
   };









    // ---------------------------------------------
    //                  g_update
    //
    // This uses SQL to update records
    // ---------------------------------------------
    function g_update( newAst, params, gun, schema ){
        //console.log('Update table name: ' + newAst.table);
        //console.log('Update schema name: ' + schema);

        var i = 0;

        function each(a, newId){
            //console.log("ID: " + newId);
            if (in_where( a, newAst.where )) {
                i ++;

                for (column of newAst.set) {
                    a[ column.column ] = column.value.value;
                    //console.log( column.column + ' = ' + column.value.value);
                }
                //console.log("ID: " + newId);
                gun.get(schema).get(newAst.table).get(newId).put(
                    a,
                    function(ack) {
                        //console.log('Updated')
                    });
            }
        }

        function end(coll){
            //console.log('Finished Get')
        }

        gun.get(schema).get(newAst.table).valMapEnd(each,end);
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
    exports.setGunDBClass  = function(lg) {
        localgunclass = lg;
        localgunclass.chain.sql = function( sql, params, cb, schema ){
            var newAst = sqlParseFn(sql);
            //console.log('newAst: ' + JSON.stringify(newAst , null, 2))
            if (!schema) {
                schema = 'default'
            }

            var chain  = this.chain();
            switch(newAst.type ) {
                case 'insert' : g_insert(newAst, params,         this,     schema);break;
                case 'select' : g_select(sql,    params, newAst, this, cb, schema);break;
                case 'update' : g_update(newAst, params,         this,     schema);break;
            }
            //return this
        }




        localgunclass.chain.valMapEnd = function (cb, end) {
            var n   = function () {},
            count   = 0,
            souls   = [],
            gun     = this;
            cb      = cb || n;
            end     = end || n;

            gun.val( function (list) {
                var args = Array.prototype.slice.call(arguments);
                localgunclass.node.is(list, function (n, soul) {
                    count += 1;
                    souls.push(soul);
                });

                souls.forEach(function (soul) {
                    gun.back(-1).get(soul).val(function (val, key) {
                        count -= 1;
                        cb.apply(this, arguments);
                        if (!count) {
                            end.apply(this, args);
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
            params = null
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
            params = null
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
                    var tableName = newAst.from[0].table;
                    localgun.get( schema ).get( newAst.from[0].table ).on(
                      function(a) {
                          //console.log('Change to table name: ' + tableName )
                          realtimeTablesToWatch[tableName]["changed"] = true
                        },false);
                }
                if (!realtimeTablesToWatch[newAst.from[0].table][sql3]) {
                    realtimeTablesToWatch[newAst.from[0].table]['sql'][sql3] = new Object();
                    realtimeTablesToWatch[newAst.from[0].table]['sql'][sql3]["callback"] = callbackFn;
                    realtimeTablesToWatch[newAst.from[0].table]['sql'][sql3]["schema"] = schema;
                }


                 //localgun.sql(sql3);
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





      var inRealtimeUpdate=false;
      setInterval( function () {
          if (!inRealtimeUpdate) {
              inRealtimeUpdate = true;
              //console.log('Changed: ' + changed);
              var allRealtimetables = Object.keys(realtimeTablesToWatch);
              //console.log('tables: ' + JSON.stringify(allRealtimetables , null, 2))
              for ( tableName of allRealtimetables) {
                  //console.log("tableName: " + tableName );
                  if (realtimeTablesToWatch[ tableName ] ) {
                      if (realtimeTablesToWatch[ tableName ][ "changed" ]) {
                          console.log("table changed: " + tableName );
                          //localgun.sql("SELECT * FROM Customers ");
                          var sqlToUpdate = Object.keys(realtimeTablesToWatch[ tableName ]['sql']).toString()
                          //console.log('    sql: ' + JSON.stringify(sqlToUpdate , null, 2))
                          var cbb = realtimeTablesToWatch[tableName]['sql'][sqlToUpdate]["callback"];
                          if (cbb) {
                              //console.log('**HAS A CALLBACK on SQL: ' + sqlToUpdate);
                              //console.log('localgun: ' + localgun.sql(sqlToUpdate));
                              localgun.sql(sqlToUpdate, null, cbb);
                          };


                          realtimeTablesToWatch[ tableName ][ "changed" ] = false
                      }
                  }
              }
              inRealtimeUpdate = false;
          }
      }, 1000)






}(typeof exports === 'undefined' ? this.share = {} : exports));
