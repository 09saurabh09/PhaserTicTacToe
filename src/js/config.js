/**
 * Created by saurabhk on 10/07/16.
 */
var configInstance = {};
var configSingleton = (function () {
    var instance;

    function ConfigObject(data) {
        this.graphicPadding = data.graphicPadding || window.screen.availWidth * 0.2;
        this.gameBoundaryWidth = data.gameBoundaryWidth || 10;
    }

    function createInstance(data) {
        return new ConfigObject(data);
    }

    return {
        getInstance: function (data) {
            if (!instance) {
                instance = createInstance(data);
            }
            return instance;
        }
    };
})();

function setConfigObject(configObject) {
    configInstance = configSingleton.getInstance(configObject);
}

module.exports = {
    setConfigObject: setConfigObject,
    getInstance: configSingleton.getInstance
};