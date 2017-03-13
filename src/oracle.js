{
    type: 'db_driver'
    ,
    loadOnCondition: function() {
        var useOracle    = false;
        if (fs.existsSync(path.join(__dirname, '../oracle_driver.zip'))) {
            useOracle = true;
        }
        return useOracle;
    },


    'loadDriver': function() {
        if (!fs.existsSync(process.cwd() + '\\oracle_driver\\instantclient32')) {
          fs.createReadStream(path.join(__dirname, '../oracle_driver.zip')).pipe(unzip.Extract({ path: process.cwd() + '\\.' }));
          timeout = 3000;
          console.log('Creating oracle_driver');
        } else {
          console.log('oracle_driver already exists');
        };
        process.env['PATH'] = process.cwd() + '\\oracle_driver\\instantclient32' + ';' + process.env['PATH'];
    },




    'setup': function(connection, callbackfn) {
        var oracledb;
        var oraloc = process.cwd() + '\\oracle_driver\\node_modules\\oracledb';
        console.log('Start oracle from NodeJS module ' + oraloc);
        oracledb = require(oraloc);

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
            })
        },





    'getResult': function(connection, sql, callfn) {
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
          })}
          },





    get: function(connection, sql, callfn) {
        if (
            (connection.status == 'disconnected')
            ||
            (connection.status == null)
        )
        {
        drivers['oracle']['setup'](connection,
                                   function() {
                                           drivers['oracle']['getResult'](connection, sql, callfn)});
      }
      else {

        drivers['oracle']['getResult'](connection, sql, callfn);
      }
    },



    // Note: connections should always be released when not needed
    'doRelease': function(connection) {
      connection.close(
        function(err) {
          if (err) {
            console.error(err.message);
          }
        });
    }
};
