var PouchDB;
var pouchdb_queries;
var pouchdb_intranet_client_connects;
var pouchdb_users;
var pouchdb_user_zones;
var pouchdb_user_identifiers;
var pouchdb_user_requests;

(function(exports){
    exports.setPouchDB = function(val) {
        PouchDB = val;
    };

    exports.get_pouchdb_users = function(useMemory) {
        if (useMemory) {
            pouchdb_users = new PouchDB('pouchdb_users', {adapter: 'memory'});
        } else {
            pouchdb_users = new PouchDB('pouchdb_users');
        }
        pouchdb_users.createIndex({index: {fields: ['_id']}});
        console.log('...POUCH');
        return pouchdb_users;
    };

    exports.get_pouchdb_user_zones = function(useMemory) {
        if (useMemory) {
            pouchdb_user_zones = new PouchDB('pouchdb_user_zones', {adapter: 'memory'});
        } else {
            pouchdb_user_zones = new PouchDB('pouchdb_user_zones');
        }
        pouchdb_user_zones.createIndex({index: {fields: ['_id']}});
        console.log('...POUCH');
        return pouchdb_user_zones;
    };

    exports.get_pouchdb_user_identifiers = function(useMemory) {
        if (useMemory) {
            pouchdb_user_identifiers = new PouchDB('pouchdb_user_identifiers', {adapter: 'memory'});
        } else {
            pouchdb_user_identifiers = new PouchDB('pouchdb_user_identifiers');
        }
        pouchdb_user_identifiers.createIndex({index: {fields: ['_id']}});
        console.log('...POUCH');
        return pouchdb_user_identifiers;
    };

    exports.get_pouchdb_user_requests = function(useMemory) {
        if (useMemory) {
            pouchdb_user_requests = new PouchDB('pouchdb_user_requests', {adapter: 'memory'});
        } else {
            pouchdb_user_requests = new PouchDB('pouchdb_user_requests');
        }
        pouchdb_user_requests.createIndex({index: {fields: ['_id']}});
        console.log('...POUCH');
        return pouchdb_user_requests;
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
    exports.get_pouchdb_queries = function(useMemory) {
        if (useMemory) {
            pouchdb_queries = new PouchDB('pouchdb_queries', {adapter: 'memory'});
        } else {
            pouchdb_queries = new PouchDB('pouchdb_queries');
        }
        pouchdb_queries.createIndex({index: {fields: ['_id']}});
        pouchdb_queries.createIndex({index: {fields: ['name']}});
        console.log("pouchdb_queries=" + pouchdb_queries);
        return pouchdb_queries;
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
