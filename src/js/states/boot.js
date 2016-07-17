var config = require('../config');

var Boot = function () {
};

module.exports = Boot;

Boot.prototype = {

    preload: function () {
        this.load.image('preloader', 'assets/preloader.gif');
        this.game.load.spritesheet('playButton', 'assets/play-button-sprite.png', 186,186);
    },

    create: function () {
        var graphicPadding;
        this.game.input.maxPointers = 1;
        this.game.stage.backgroundColor = "#ffffff";
        if (this.game.device.desktop) {
            this.game.stage.scale.pageAlignHorizontally = true;
            graphicPadding = window.screen.availWidth * 0.3;

        } else {
            this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            //this.game.scale.minWidth = 480;
            //this.game.scale.minHeight = 260;
            //this.game.scale.maxWidth = 640;
            //this.game.scale.maxHeight = 480;
            //this.game.scale.forceLandscape = true;
            this.game.scale.pageAlignHorizontally = true;
            this.game.scale.updateLayout(true);
            graphicPadding = window.screen.availWidth * 0.1;
        }
        config.setConfigObject({graphicPadding: graphicPadding, gameBoundaryWidth:10});
        this.game.state.start('Preloader');
    }
};
