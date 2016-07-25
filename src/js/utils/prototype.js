/**
 * Created by saurabhk on 10/07/16.
 */
(function() {
  Array.prototype.isSingleValued = function() {
    return !!this.reduce(function(a, b) {
      return (a === b) ? a : NaN;
    });
  }
})();
