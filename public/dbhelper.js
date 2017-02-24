// ***********************************************************
// ***********************************************************
// This is the code to add SQL Support to GunDB
// ***********************************************************
// ***********************************************************
var localgun;
var localgunclass;
var sqlParseFn;
var changed               =     false;
var staticSqlResultSets   = new Object();
var realtimeSqlResultSets = new Object();



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
            case '='  : // fall through
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
    function g_insert( newAst, gun, schema){
        var newRecord = {};
        var fields    = newAst.values[0].value;

        for(i = 0; i < fields.length; i ++) {
            newRecord[newAst.columns[i]] = fields[i].value;
        };
        gun.get(schema).get(newAst.table).set(newRecord);
    }








    // ---------------------------------------------
    //                  g_select
    //
    // This uses SQL to get records
    // ---------------------------------------------
    function g_select( sql, newAst, gun, cb, schema ) {
        staticSqlResultSets[sql] = [];
        var i = 0
        var count = 0;

        function each(a){
            count++;
            var b = localgunclass.obj.copy(a);
            if(in_where(b, newAst.where)) {
                if (cb) {
                    cb(b)
                } else {
             	    //console.log('select from each',a);
                  staticSqlResultSets[sql].push(b)
                }
            };
        }

        function end(coll){
            //console.log('coll: '  + JSON.stringify(coll , null, 2))
            //staticSqlResultSets[sql] = objectToArray(temp);
            console.log('**Get: '  + JSON.stringify(staticSqlResultSets[sql] , null, 2))
            console.log('**Finished Get: '  + count)

        }

        gun.get(schema).get(newAst.from[0].table).valMapEnd(each,end);

      return staticSqlResultSets[sql];
   };









    // ---------------------------------------------
    //                  g_update
    //
    // This uses SQL to update records
    // ---------------------------------------------
    function g_update( newAst, gun, schema ){
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
        localgunclass.chain.sql = function( sql, cb, schema ){
            var newAst = sqlParseFn(sql);
            if (!schema) {
                schema = 'default'
            }

            var chain  = this.chain();

            switch(newAst.type ) {
                case 'insert' : g_insert(newAst, this,     schema);break;
                case 'select' : g_select(sql, newAst, this, cb, schema);break;
                case 'update' : g_update(newAst, this,     schema);break;
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




    exports.sql = function( sql, cb, schema ){
        localgun.sql( sql, cb, schema );
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
                localgun.get( schema ).get( newAst.from[0].table ).on(
                  function(a) {
                       //localgun.sql(sql3);
                    changed = true;
                    //console.log('(REAL:): ' + sql3)
                    },false);
            }
        }
        catch(err) {
            console.log(err);
            return false;
        }
        return true;
      };






      setInterval(function(){
        //console.log('Changed: ' + changed);
        if (changed) {
          localgun.sql("SELECT * FROM Customers ");
          }
        changed = false;

                            }, 1000)






}(typeof exports === 'undefined' ? this.share = {} : exports));
