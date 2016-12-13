'use strict';

/* global describe: false */
/* global it: false */

/* jshint -W106 */
var COV = process.env.npm_lifecycle_event === 'coverage';
/* jshint +W106 */

var assert = require('assert')
  , path = require('path')
  , pgPass = require( path.join('..', COV ? 'lib-cov' : 'lib' , 'index') )
  , spawn = require('child_process').spawn
  , os = require('os')
;

var conn = {
    'host'     : 'host4' ,
    'port'     : 100 ,
    'database' : 'database4' ,
    'user'     : 'user4'
};

var lsofBin;
try {
    lsofBin = require('which').sync('lsof');
} catch (e) {
    if (process.env.SKIP_LSOF) {
	console.warn('WARNING: lsof not found, skipping test', __filename);
    } else {
	console.error('ERROR: lsof not found');
	process.exit(1);
    }
}

if (lsofBin) {
    describe('#6', function(){
	it('should close stream', function(done){
	    var passFile = path.join(__dirname, '_pgpass');
	    process.env.PGPASSFILE = passFile;

	    pgPass(conn, function(pass){
		var out = '';
		var err = '';
		var lsofArgs = [
		    '-w', '-Fn', '-p', process.pid
		];
		var lsof  = spawn(lsofBin, lsofArgs);

		lsof.stdout.on('data', function(d){
		    out = out.concat( d.toString() );
		});
		lsof.stderr.on('data', function(d){
		    err = err.concat( d.toString() );
		});
		lsof.on('exit', function(code){
		    var res = out.split(os.EOL).filter(function(el){
			return (el == 'n'.concat(passFile));
		    });
		    assert.equal(res.length, 0,  'open files found');
		    assert.equal(err,        '', 'printed errors');
		    assert.equal(code,       0,  'exited with errors');
		    done();
		});
	    });
	});
    });
} // if lsofBin
