var localgun;
var localgunclass;
var simpleSqlParser;




(function(exports){

    exports.setGunDB  = function(lg) {
        localgun = lg;
    }
    exports.setGunDBClass  = function(lg) {
        localgunclass = lg;
    }
    exports.setParser = function(lg) {
        simpleSqlParser = lg;
    }



    exports.sql = function(sql, callbackFn, schema) {
        //console.log('gun: ' + localgun);
        console.log('SQL: ' + sql);
        //console.log('callbackFn: ' + callbackFn);
        if (!schema) {
            schema = 'default'
        }
        console.log('schema: ' + schema);

        var ast = simpleSqlParser.sql2ast(sql);
        //console.log('ast: ' + JSON.stringify(ast , null, 2));
        if (ast.status) {
            //console.log('type: ' + ast.value.type)
            if (ast.value.type == 'insert') {
                console.log('insert table name: ' + ast.value.into.table)
                var newRecord = new Object()
                //console.log('fields: ' + JSON.stringify(ast.value.values))
                var newId = Gun.text.random()
                for (column of ast.value.values) {
                    //console.log('saving record field ' + column.target.column)
                    newRecord[column.target.column] = column.value
                    localgun.get(schema).path(
                        ast.value.into.table + '.' + newId).put(newRecord,function(ack) {console.log('saved')});
                }
              console.log('INSERTED ' + newId + ': ' + JSON.stringify(newRecord) )
            }
            else if (ast.value.type == 'select') {
                console.log('select table name: ' + ast.value.from[0].table)
                var i = 0
                localgun.get(schema).path(ast.value.from[0].table).map().val(function(a){
                  var b = localgunclass.obj.copy(a);
                  if (callbackFn) {
                    delete b["_"];
                    callbackFn(b)
                } else {
                     i++
                     delete b["_"];
                     console.log(i + ':');
                     console.log(b);
                }
            },false);
            }
            else if (ast.value.type == 'delete') {
                console.log('table name: ' + ast.value.from[0].table)
                localgun.get(schema).path(ast.value.from[0].table).on().map(function(a,b){

                });
            }
        }
        return ast.status
    };



}(typeof exports === 'undefined' ? this.share = {} : exports));
