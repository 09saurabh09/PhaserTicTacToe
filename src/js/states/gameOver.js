/**
 * Created by saurabhk on 11/07/16.
 */
var GameOver = function () {
    this.text = null;
};

module.exports = GameOver;

GameOver.prototype = {

    create: function () {
        var x = this.game.width / 2;
        var y = this.game.height / 2;

        var style = {font: "25px Arial", fill: "#dddddd", align: "center"};

        this.text = this.add.text(x - 300, 0, "GameOver, "+globalUser.result+" click to play again", style);

        this.input.onDown.add(this.onDown, this);
    },

    update: function () {
    },

    onDown: function () {
        this.game.state.start(playerState.currentLevel);
    }
};
