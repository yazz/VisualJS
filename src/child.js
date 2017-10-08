var isWin = /^win/.test(process.platform);

function require2(moduleName) {
	var pat;
	if (isWin) {
		pat = "require(process.cwd() + " + "'\\\\node_modules\\\\" + moduleName + "');";
	} else {
		pat = "require(path.join(__dirname, '../node_modules/" + moduleName + "'));";
	}
    var reac = eval(pat);	
	return reac;
};

var sqlite3   = require2('sqlite3');
var dbsearch = new sqlite3.Database('gosharedatasearch.sqlite3');


process.on('message', (msg) => {
  console.log('Message from parent:', msg);
});

let counter = 0;

setInterval(() => {
    var countSqlite = 99;
    //dbsearch.run("PRAGMA journal_mode=WAL;")
    dbsearch.run("PRAGMA synchronous=OFF;")
    dbsearch.run("PRAGMA count_changes=OFF;")
    dbsearch.run("PRAGMA journal_mode=MEMORY;")
    dbsearch.run("PRAGMA temp_store=MEMORY;")

            try
            {
                var stmt = dbsearch.all(
                    "SELECT count(*) FROM queries;",
                    function(err, results) 
                    {
                        if (!err) 
                        {
                            if( results.length > 0)  {

                                process.send({ counter: counter++, sqlite: JSON.stringify(results[0],null,2)  });
                            }
                        }
                    })
            } catch(err) {
                                process.send({ counter: counter++, sqlite: "Err: " + err  });
                
            }
}, 1000);