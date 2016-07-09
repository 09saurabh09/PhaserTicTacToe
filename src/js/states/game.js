var Player = require('../entities/player');
var config = require('../config');
var utils = require('../utils');

var Game = function () {
    this.testentity = null;
    this.graphics = null;
    this.sectionSize = null;
    this.turn = true;
};

module.exports = Game;

Game.prototype = {

    create: function () {
        var graphics = this.game.add.graphics(config.graphicPadding, config.graphicPadding);
        this.graphics = graphics;

        // set a fill and line style
        graphics.lineStyle(config.gameBoundaryWidth, 0xdddddd);
        var gridDetails = utils.gridSize(this.game);
        for (var i = 1; i <= globalUser.settings.grids - 1 ; i++) {
            graphics.moveTo(i * gridDetails[0] + (i-1) * config.gameBoundaryWidth,0);
            graphics.lineTo(i * gridDetails[0] + (i-1) * config.gameBoundaryWidth, gridDetails[1]);
        }

        for (var j = 1; j <= globalUser.settings.grids - 1 ; j++) {
            graphics.moveTo(0, j * gridDetails[0] + (j-1) * config.gameBoundaryWidth);
            graphics.lineTo(gridDetails[1], j * gridDetails[0] + (j-1) * config.gameBoundaryWidth);
        }
        this.sectionSize = gridDetails[1]/globalUser.settings.grids;
        this.input.onDown.add(this.addPlayingPiece, this);
    },

    update: function () {
    },

    onInputDown: function () {
        this.game.state.start('Menu');
    },

    addPlayingPiece: function() {
        var xCordinate;
        var yCordinate;
        var sectionSize = this.sectionSize;
        var mouse = this.input.position;
        mouse.x = mouse.x - config.graphicPadding;
        mouse.y = mouse.y - config.graphicPadding;

        for (var x = 0;x < globalUser.settings.grids;x++) {
            for (var y = 0;y < globalUser.settings.grids;y++) {
                xCordinate = x * sectionSize;
                yCordinate = y * sectionSize;

                if (
                    mouse.x >= xCordinate && mouse.x <= xCordinate + sectionSize &&
                    mouse.y >= yCordinate && mouse.y <= yCordinate + sectionSize
                    ) {

                    //clearPlayingArea(xCordinate, yCordinate);
                    globalUser.turn = [x,y];
                    if (this.turn) {
                        this.drawX(xCordinate, yCordinate);
                    } else {
                        this.drawO(xCordinate, yCordinate);
                    }
                    this.turn = !this.turn;
                }
            }
        }
    },

    drawO: function(x, y) {
        var sectionSize = this.sectionSize;
        var graphics = this.graphics;
        var halfSectionSize = (0.5 * sectionSize);
        var centerX = x + halfSectionSize;
        var centerY = y + halfSectionSize;
        var diameter = sectionSize * 0.4;
            graphics.lineStyle(10, 0x01bBC2);
            graphics.drawCircle(centerX, centerY, diameter);

    },

    drawX: function(x,y) {
        var graphics = this.graphics;
        var sectionSize = this.sectionSize;
        graphics.lineStyle(10, 0xf1be32);
        var offset = sectionSize * 0.3;
        graphics.moveTo(x + offset, y + offset);
        graphics.lineTo(x + sectionSize - offset, y + sectionSize - offset);

        graphics.moveTo(x + offset, y + sectionSize - offset);
        graphics.lineTo(x + sectionSize - offset, y + offset);
    }
};
