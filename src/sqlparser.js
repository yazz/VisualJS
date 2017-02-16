var sql2 = 'select * from tablea where field1 = 0';
var parse = require('node-sqlparser').parse;
var stringify = require('node-sqlparser').stringify;
var astObj = parse(sql2);

var sqlstr = stringify(astObj);
console.log(JSON.stringify(astObj , null, 2))
