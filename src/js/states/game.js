var Player = require('../entities/player');
var config = require('../config');
var utils = require('../utils/utils');

var Game = function () {
    this.testentity = null;
    this.graphics = null;
    this.sectionSize = null;
    this.turn = true;
    this.boardState = [];
};

module.exports = Game;

Game.prototype = {

    create: function () {
        var i,j;
        var graphics = this.game.add.graphics(config.graphicPadding, config.graphicPadding);
        this.graphics = graphics;

        // set a fill and line style
        graphics.lineStyle(config.gameBoundaryWidth, 0xdddddd);
        var gridDetails = utils.gridSize(this.game);

        // Vertical lines
        for (i = 1; i < globalUser.settings.grids; i++) {
            graphics.moveTo(i * gridDetails[0] + (i-1) * config.gameBoundaryWidth,0);
            graphics.lineTo(i * gridDetails[0] + (i-1) * config.gameBoundaryWidth, gridDetails[1]);
        }

        // Horizontal lines
        for (j = 1; j < globalUser.settings.grids; j++) {
            graphics.moveTo(0, j * gridDetails[0] + (j-1) * config.gameBoundaryWidth);
            graphics.lineTo(gridDetails[1], j * gridDetails[0] + (j-1) * config.gameBoundaryWidth);
        }
        this.sectionSize = gridDetails[1]/globalUser.settings.grids;
        this.input.onDown.add(this.addPlayingPiece, this);

        // Initialize board state with all 0 by default
        for(i = 0; i < globalUser.settings.grids; i++) {
            for(j = 0; j < globalUser.settings.grids; j++) {
                if (this.boardState[i]) {
                    this.boardState[i][j] = 0
                } else {
                    this.boardState[i] = [];
                    this.boardState[i][j] = 0
                }
            }
        }
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
                    globalUser.turn = [y,x];
                    if(this.boardState[y][x] == 0) {
                        if (this.turn) {
                            this.drawX(xCordinate, yCordinate);
                            this.boardState[y][x] = "X";
                        } else {
                            this.drawO(xCordinate, yCordinate);
                            this.boardState[y][x] = "O";
                        }
                        this.turn = !this.turn;
                        if(this.isStateTerminal()) {
                            this.game.state.start("GameOver");
                        }
                    }

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
    },

    isStateTerminal: function() {
        var x, y;
        var diagonals = [[],[]];
        // Check rows
        for(x = 0; x <this.boardState.length; x++) {
            var row = this.boardState[x];
            if (row[0] != 0 && row.isSingleValued()) {
                return true;
            }
        }

        // Check columns
        for(x = 0;x < globalUser.settings.grids;x++) {
            var col = this.boardState.map(function(value) { return value[x]; });
            if (col[0] != 0 && col.isSingleValued()) {
                return true;
            }
        }

        // Check diagonals
        for(x = 0;x < globalUser.settings.grids;x++) {
            for(y = 0;y < globalUser.settings.grids;y++) {
                if(x == y) {
                    diagonals[0].push(this.boardState[x][y]);
                    diagonals[1].push(this.boardState[globalUser.settings.grids - 1 - x][y]);
                }

            }
        }

        for(x = 0; x <diagonals.length; x++){
            var diagonal = diagonals[x];
            if (diagonal[0] != 0 && diagonal.isSingleValued()) {
                return true;
            }
        }
        return false;
    }
};
