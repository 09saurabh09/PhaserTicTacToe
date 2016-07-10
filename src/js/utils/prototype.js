/**
 * Created by saurabhk on 10/07/16.
 */
(function(){
    Array.prototype.isSingleValued = function() {

        for(var i = 1; i < this.length; i++)
        {
            if(this[i] !== this[0])
                return false;
        }

        return true;
    }
})();