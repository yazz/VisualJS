var localgun;

(function(exports){

    exports.init = function(lg) {
        localgun = lg;
    }

  exports.helpme = function() {
      console.log('HELP ME!' + localgun);
  };

}(typeof exports === 'undefined' ? this.share = {} : exports));
