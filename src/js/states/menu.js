var AI = require("../AI");
var Menu = function () {
    this.text = null;
};

module.exports = Menu;

Menu.prototype = {

    create: function () {
        var x = this.game.width / 2;
        var y = this.game.height / 2;

        var button = this.game.add.button(0, y, 'playButton', undefined, this);
        button.x =  (this.game.width - button.width)/2;
        button.height = button.width = 100;
        this.input.onDown.add(this.onDown, this);
    },

    update: function () {
    },

    onDown: function () {
        window.globalUser.AI = new AI("blind");
        this.game.state.start(playerState.currentLevel);
    }
};
