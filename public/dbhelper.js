var PouchDB;
var pouchdb_system_settings;
var pouchdb_connections;
var pouchdb_drivers;
var pouchdb_queries;

(function(exports){
    exports.setPouchDB = function(val) {
        PouchDB = val;
    };
    exports.get_pouchdb_system_settings = function(val) {
        return pouchdb_system_settings;
    };
    exports.get_pouchdb_connections = function(val) {
        return pouchdb_connections;
    };
    exports.get_pouchdb_drivers = function(val) {
        return pouchdb_drivers;
    };
    exports.get_pouchdb_queries = function(val) {
        return pouchdb_queries;
    };
    
    exports.initPouchdb = function() {        
        pouchdb_system_settings = new PouchDB('pouchdb_system_settings');
        pouchdb_system_settings.createIndex({index: {fields: ['_id']}});
        console.log('...POUCH');



        pouchdb_drivers = new PouchDB('pouchdb_drivers');
        pouchdb_drivers.createIndex({index: {fields: ['_id']}});
        pouchdb_drivers.createIndex({index: {fields: ['name']}});



        pouchdb_connections = new PouchDB('pouchdb_connections');
        pouchdb_connections.createIndex({index: {fields: ['_id']}});
        pouchdb_connections.createIndex({index: {fields: ['name']}});
        console.log("pouchdb_connections=" + pouchdb_connections);


        pouchdb_queries = new PouchDB('pouchdb_queries');
        pouchdb_queries.createIndex({index: {fields: ['_id']}});
        pouchdb_queries.createIndex({index: {fields: ['name']}});
        console.log("pouchdb_queries=" + pouchdb_queries);
    }


    exports.pouchdbTableOnServer = function(stringName, objectPouchdb, when_fn) {
        objectPouchdb.changes({
              since: 0,
              live: true
            }).on('change', function (changes) {
                console.log('*** ' + stringName + '.changes({ called');
                if (when_fn) {
                    when_fn();
                }
            });
    }





    
    exports.pouchdbTable = function (stringName, objectPouchdb, when_fn) {
        objectPouchdb.changes({
              since: 0,
              live: true
            }).on('change', function (changes) {
                console.log('*** ' + stringName + '.changes({ called');
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
