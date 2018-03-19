{
    name: 'outlook2010'
    ,
    type: 'document_driver'
    ,
    setup: function(connection, callfn) {
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
            if (err) {
                callfn({error: '' + err});
                throw err;
            }
          });
          connection.status = 'connected';
      },


    get_v2: function( connection , parameters , callfn )
        {
			var sql = parameters.sql;
            //console.log('******************************** in postgres get');
            if (
                (connection.status == 'disconnected')
                ||
                (connection.status == null)
              )
             {
                 try {
                    drivers['postgres']['setup'](connection, callfn);
                 } catch (error) {
                     console.log('postgres connection error: ' + error.toString());
                     return;
                 };
            }

          //console.error('drivers[postgres][get]');
          // execute a query on our database
          connection.connection.query(sql, [], function (err, result) {
            if (err) {
				callfn({error: '' + err});
			} else {
				// just print the result to the console
				//console.log(result.rows); // outputs: { name: 'brianc' }
				callfn(result.rows);
			};


            // disconnect the client
            //connection.connection.end(function (err) {
            });
          }
}
