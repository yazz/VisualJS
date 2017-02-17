// This SQL Parser is used to parse SQL statements on both
// the clientand the server
//
// Since the SqlParser 'node-sqlparser' is only available
// on NodeJS we use Browserify to convert it for use in the
// web browser as well like this:
//
// Browserify src/sqlparser.js -o pubic/sql.js
//
// and then we need to include the sql.js file in our web
// page like this:
//
// <script type="text/javascript" src="sql.js"></script>
//

var sql2 = 'select * from tablea where field1 = 0';
var parse = require('node-sqlparser').parse;
var stringify = require('node-sqlparser').stringify;
var astObj = parse(sql2);

var sqlstr = stringify(astObj);
//console.log(JSON.stringify(astObj , null, 2))
