var AI = require("../AI");
var Menu = function () {
    this.text = null;
};

module.exports = Menu;

Menu.prototype = {

    create: function () {
        var x = this.game.width / 2;
        var y = this.game.height / 2;

        var style = {font: "65px Arial", fill: "#dddddd", align: "center"};

        this.text = this.add.text(x - 300, y - 200, "Press to Start", style);

        this.input.onDown.add(this.onDown, this);
    },

    update: function () {
    },

    onDown: function () {
        window.globalUser.AI = new AI("master");
        this.game.state.start(playerState.currentLevel);
    }
};
