var localgun;
var simpleSqlParser;



(function(exports){

    exports.init = function(lg) {
        localgun = lg;
    }
    exports.setParser = function(lg) {
        simpleSqlParser = lg;
    }

  exports.helpme = function() {
      console.log('HELP ME!' + localgun);
  };




    exports.realtime_sql = function(sql, callbackFn, schema) {
        console.log('SQL: ' + sql);
        console.log('callbackFn: ' + callbackFn);
        console.log('schema: ' + schema);

        var ast = simpleSqlParser.sql2ast(sql);
        console.log('ast: ' + JSON.stringify(ast , null, 2));
    };



    exports.sql = function(sql, callbackFn, schema) {
        console.log('SQL: ' + sql);
        console.log('callbackFn: ' + callbackFn);
        if (!schema) {
            schema = 'default'
        }
        console.log('schema: ' + schema);

        var ast = simpleSqlParser.sql2ast(sql);
        if (ast.status) {
            console.log('ast: ' + JSON.stringify(ast , null, 2));
            console.log('type: ' + ast.value.type)
            if (ast.value.type == 'insert') {
                console.log('table name: ' + ast.value.into.table)
                var newRecord = new Object()
                for (column of ast.value.values) {
                    newRecord[column.target.column] = column.value
                    console.log('Col ' + column.target.column + ' = ' + column.value)
                    gun.get(schema).path(ast.value.into.table).set(newRecord);
                }
            }
            else if (ast.value.type == 'select') {
                console.log('table name: ' + ast.value.from[0].table)
                gun.get(schema).path(ast.value.from[0].table).on().map(function(a,b){
                  delete a["_"];
                 // callbackFn(a)
                 console.log(a)
                },true);
            }
        }
        return ast.status
    };




  exports.ifNull = function(entry, callbackFn) {
      ifNull('default',entry, callbackFn);
  }
  exports.ifNull = function(schema,entry, callbackFn) {
      gun.get(schema).path(entry).not(function(pp) {
          callbackFn();
      });
  }





  exports.onChangeRecords = function(schema, table, callbackFn) {
    gun.get(schema).path(table).on().map(function(a,b){
      delete a["_"];
      callbackFn(a);
    },true);
  };
  exports.onChangeRecords = function(table, callbackFn) {
      onChangeRecords('default', table, callbackFn)
    };

}(typeof exports === 'undefined' ? this.share = {} : exports));
