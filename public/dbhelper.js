var localgun;
var localgunclass;
var sqlParseFn;



(function(exports){

    exports.setGunDB  = function(lg) {
        localgun = lg;
    }
    exports.setGunDBClass  = function(lg) {
        localgunclass = lg;
    }
    exports.setSqlParseFn = function(lg) {
        sqlParseFn = lg;
    }


   function in_where(o, where) {
       if (!where) {
           return true;
       }
       //console.log('Where: ' + JSON.stringify(where , null, 2));
       if (where.operator == '=') {
           if (o[where.left.column] == where.right.value) {
               return true;
           }
       } else if (where.operator == 'AND') {
           if (in_where(o, where.left) && in_where(o, where.right)) {
               return true;
           }
           return false;
       }
       return false;
   }


    exports.sql = function(sql, callbackFn, schema) {
        var newAst;
        try {
        newAst = sqlParseFn(sql);
        //console.log('New SQL AST: ' + JSON.stringify(newAst , null, 2));
        //console.log('SQL: ' + sql);
        //console.log('callbackFn: ' + callbackFn);
        if (!schema) {
            schema = 'default'
        }
        //console.log('schema: ' + schema);

        //console.log('ast: ' + JSON.stringify(newAst , null, 2));
        //console.log('type: ' + ast.value.type)
        if (newAst.type == 'insert') {
            console.log('insert table name: ' + newAst.table)
            var newRecord = new Object()
            //console.log('fields: ' + JSON.stringify(ast.value.values))
            var newId = Gun.text.random();
            console.log('col count: ' +  JSON.stringify(newAst.columns , null, 2));
            for (i = 0; i < newAst.values[0].value.length; i ++) {
                var columnValue = newAst.values[0].value[i].value;
                //console.log('saving record field ' + column.target.column)
                newRecord[newAst.columns[i]] = columnValue;
                localgun.get(schema).path(
                    newAst.table + '.' + newId).put(
                        newRecord,function(ack) {console.log('saved')});
            }
            console.log('INSERTED ' + newId + ': ' + JSON.stringify(newRecord) )
        }




        else if (newAst.type == 'select') {
            //console.log('select table name: ' + newAst.from[0].table)
            var i = 0
            localgun.get(schema).path(newAst.from[0].table).map().val(
                function(a){
                  var b = localgunclass.obj.copy(a);
                  if (in_where(b, newAst.where)) {
                      if (callbackFn) {
                        delete b["_"];
                        callbackFn(b)
                    } else {
                         i++
                         delete b["_"];
                         console.log(i + ':');
                         console.log(b);
                    }
                }
            },false);
        }



        else if (newAst.type == 'update') {
            //console.log('select table name: ' + newAst.from[0].table)
            var i = 0
            localgun.get(schema).path(newAst.table).map().val(
                function(a,newId){
                  var b = localgunclass.obj.copy(a);
                  if (in_where(b, newAst.where)) {
                      i ++;
                      delete b["_"];
                      console.log(i + ': OLD VALUE');
                      console.log(b);

                      for (column of newAst.set) {
                          a[column.column] = column.value.value;
                          console.log( column.column + ' = ' + column.value.value);
                      }
                      //console.log("ID: " + newId);
                      localgun.get(schema).path(
                          newAst.table + '.' + newId).put(
                              a,function(ack) {console.log('saved')});
                      console.log(i + ': NEW VALUE');
                      console.log(b);
                  }
              }
            ,false);
        }




    }
    catch(err) {
        console.log(err);
        return false;
    }
    return true;
};



}(typeof exports === 'undefined' ? this.share = {} : exports));
