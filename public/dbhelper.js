var localgun;

(function(exports){

    exports.init = function(lg) {
        localgun = lg;
    }

  exports.helpme = function() {
      console.log('HELP ME!' + localgun);
  };



  exports.sql = function(sql, callbackFn) {
      sql('default', sql, callbackFn);
  };
  exports.sql = function(schema, sql, callbackFn) {
      console.log('SQL: ' + sql);
  };




  exports.ifNull = function(entry, callbackFn) {
      ifNull('default',entry, callbackFn); 
  }
  exports.ifNull = function(schema,entry, callbackFn) {
      gun.get(schema).path(entry).not(function(pp) {
          callbackFn();
      });
  }





  exports.onChangeRecords = function(schema, table, callbackFn) {
    gun.get(schema).path(table).on().map(function(a,b){
      delete a["_"];
      callbackFn(a);
    },true);
  };
  exports.onChangeRecords = function(table, callbackFn) {
      onChangeRecords('default', table, callbackFn)
    };

}(typeof exports === 'undefined' ? this.share = {} : exports));
