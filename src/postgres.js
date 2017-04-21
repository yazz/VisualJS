{
    name: 'postgres'
    ,
    vue: {
            template: '<div>postgres driver</div>'
            }
    ,
    type: 'db_driver'
    ,
    setup: function(connection) {
          var config = {
            id:                connection.id,
            user:              connection.user,
            database:          connection.database,
            password:          connection.password,
            host:              connection.host,
            port:              connection.port,
            max:               connection.max,
            idleTimeoutMillis: connection.idleTimeoutMillis
          };

          connection.connection = new postgresdb.Client(config);
          connection.connection.connect(function (err) {
            if (err) throw err;
          });
          connection.status = 'connected';
      },



    get: function( connection , sql , callfn )
        {
            console.log('********************************');
            if (
                (connection.status == 'disconnected')
                ||
                (connection.status == null)
              )
             {
                drivers['postgres']['setup'](connection);
            }

          console.error('drivers[postgres][get]');
          // execute a query on our database
          connection.connection.query(sql, [], function (err, result) {
            if (err) throw err;

            // just print the result to the console
            console.log(result.rows); // outputs: { name: 'brianc' }
            callfn(result.rows);

            // disconnect the client
            //connection.connection.end(function (err) {
              if (err) throw err;
            });
          }
}
