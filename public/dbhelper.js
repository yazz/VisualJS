var PouchDB;
var pouchdb_intranet_client_connects;

(function(exports){
    exports.setPouchDB = function(val) {
        PouchDB = val;
    };


    
    
    exports.get_pouchdb_intranet_client_connects = function(useMemory) {
        if (useMemory) {
            pouchdb_intranet_client_connects = new PouchDB('pouchdb_intranet_client_connects', {adapter: 'memory'});
        } else {
            pouchdb_intranet_client_connects = new PouchDB('pouchdb_intranet_client_connects');
        }
        pouchdb_intranet_client_connects.createIndex({index: {fields: ['_id']}});
        pouchdb_intranet_client_connects.createIndex({index: {fields: ['when_connected']}});
    
        console.log('...POUCH');
        return pouchdb_intranet_client_connects;
    };
    
    
    
    exports.initPouchdb = function() {        
    }

    var changesCount = new Object();
    exports.pouchdbTableOnServer = function(stringName, objectPouchdb, when_fn) {
        changesCount[stringName] = 0;
        objectPouchdb.changes({
              since: 'now',
              includeDocs: false,
              live: true
            }).on('change', function (changes) {
                changesCount[stringName] ++;
                console.log('*** ' + stringName + '.changes({ called : ' + changesCount[stringName]);
                if (when_fn) {
                    when_fn();
                }
            });
    }





    
    exports.pouchdbTable = function (stringName, objectPouchdb, when_fn) {
        changesCount[stringName] = 0 ;
        objectPouchdb.changes({
              since: 'now',
              includeDocs: false,
              live: true
            }).on('change', function (changes) {
                changesCount[stringName] ++;
                //console.log('*** ' + stringName + '.changes({ called : ' + changesCount[stringName]);
                if (when_fn) {
                    when_fn();
                };
            });

            
            
        var remote_pouchdb_table;
        if ((location.port == '8080')  && (location.host == '127.0.0.1')) {
            remote_pouchdb_table = new PouchDB('http://127.0.0.1:8080/db/' + stringName)
        } else { // we are on port 80
            remote_pouchdb_table = new PouchDB('http://' + location.host + '/db/' + stringName)
        };

        PouchDB.sync(objectPouchdb, remote_pouchdb_table, {live: true,retry: true}
        ).on('change', function (change) {
            console.log('*** ' + stringName + '.sync(HOST/db/system_settings, { called');
            if (when_fn) {
                when_fn();
            }
        });
    }

}(typeof exports === 'undefined' ? this.share = {} : exports));
