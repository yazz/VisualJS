var oracledb;
var oraloc = process.cwd() + '\\oracle_driver\\node_modules\\oracledb';
console.log('Start oracle from NodeJS module ' + oraloc);
oracledb = require(oraloc);

drivers['oracle'] = new Object();




drivers['oracle']['setup'] = function(connection, callbackfn) {
  console.error('drivers[oracle][setup]');
  console.error('******************Loading Oracle Database');
  oracledb.getConnection(
    {
      user          : connection.user,
      password      : connection.password,
      connectString : connection.connectString
    },
    function(err, newconnection)
    {
      if (err) {
          console.error('******************Loading Oracle Database ERROR');
          console.error(err.message);
          return;
      };
      connection.connection = newconnection;
      connection.status = 'connected';
      console.error('******************Loading Oracle Database CONNECTED');
      callbackfn();
    })};





function getResult(connection, sql, callfn) {
  console.error('drivers[oracle][get]');

    if (connection.connection) {
      connection.connection.execute(
        // The statement to execute
        sql,

        // The "bind value" 180 for the "bind variable" :id
        [],

        // Optional execute options argument, such as the query result format
        // or whether to get extra metadata
        // { outFormat: oracledb.OBJECT, extendedMetaData: true },

        // The callback function handles the SQL execution results
        function(err, result)
        {
          if (err) {
            console.error(err.message);
            //doRelease(connection.connection);
            return;
          }
          //console.log(result.metaData); // [ { name: 'DEPARTMENT_ID' }, { name: 'DEPARTMENT_NAME' } ]
          console.log(result.rows);     // [ [ 180, 'Construction' ] ]
          callfn(result.rows);
          //doRelease(connection.connection);
        })}};





drivers['oracle']['get'] = function(connection, sql, callfn) {
    if (
        (connection.status == 'disconnected')
        ||
        (connection.status == null)
    )
    {
    drivers['oracle']['setup'](connection,
                               function() {
                                       getResult(connection, sql, callfn)});
  }
  else {

    getResult(connection, sql, callfn);
  }
};



// Note: connections should always be released when not needed
function doRelease(connection)
{
  connection.close(
    function(err) {
      if (err) {
        console.error(err.message);
      }
    });
}
