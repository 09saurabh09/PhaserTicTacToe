var Player = require('../entities/player');
var config = require('../config');
var utils = require('../utils/utils');

// Not state of phaser but game
function State(oldState) {
    var i,j;
    this.turn = Math.random > 0.5;
    this.boardState = [];
    this.oMovesCount = 0;
    this.lastMove = {};
    this.status = "beginning";
    this.result = "running";

    if(typeof oldState !== "undefined") {
        // if the state is constructed using a copy of another state
        this.boardState = JSON.parse(JSON.stringify(oldState.boardState));

        this.oMovesCount = oldState.oMovesCount;
        this.turn = oldState.turn;
    } else {
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
    }
}

State.prototype = {
    isStateTerminal: function() {
        var x, y;
        var diagonals = [[], []];
        // Check rows
        for (x = 0; x < this.boardState.length; x++) {
            var row = this.boardState[x];
            if (row[0] != 0 && row.isSingleValued()) {
                this.result = this.turn ? "O" : "X";
                return true;
            }
        }

        // Check columns
        for (x = 0; x < globalUser.settings.grids; x++) {
            var col = this.boardState.map(function (value) {
                return value[x];
            });
            if (col[0] != 0 && col.isSingleValued()) {
                this.result = this.turn ? "O" : "X";
                return true;
            }
        }

        // Check diagonals
        for (x = 0; x < globalUser.settings.grids; x++) {
            for (y = 0; y < globalUser.settings.grids; y++) {
                if (x == y) {
                    diagonals[0].push(this.boardState[x][y]);
                    diagonals[1].push(this.boardState[globalUser.settings.grids - 1 - x][y]);
                }

            }
        }

        for (x = 0; x < diagonals.length; x++) {
            var diagonal = diagonals[x];
            if (diagonal[0] != 0 && diagonal.isSingleValued()) {
                this.result = this.turn ? "O" : "X";
                return true;
            }
        }

        // Check Draw
        if(this.emptyCells().length == 0) {
            this.result = "Match Drawn";
            return true;
        }
    },

    emptyCells: function() {
        var x,y;
        var emptyCells = [];
        for(x = 0;x < globalUser.settings.grids;x++) {
            for(y = 0;y < globalUser.settings.grids;y++) {
                if(this.boardState[x][y] == 0) {
                    emptyCells.push([x,y]);
                }
            }
        }
        return emptyCells;
    }
};

var Game = {

    preload: function() {
        this.opponent = "AI";
        this.graphics = null;
        this.sectionSize = null;
        this.result = "running";
        this.difficultyLevel = null;
        this.currentState = new State();
        this.messageOne = "";
        this.messageTwo = "";
        globalUser.AI.plays(this);
    },

    create: function () {
        var i, j;
        var graphics = this.game.add.graphics(config.graphicPadding, config.graphicPadding);
        this.graphics = graphics;
        this.setTurnMessages();
        var style = {font: "20px Arial", fill: "#66CDAA", align: "center"};

        this.textMessage = this.add.text(200, 0, this.messageOne, style);

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
        if (!this.currentState.turn && globalUser.AI) {
            this.game.time.events.add(Phaser.Timer.SECOND * 1, function(){
                globalUser.AI.makeMove();
                this.currentState.oMovesCount += 1;
            }, this);
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
                    this.currentState.lastMove.x = x;
                    this.currentState.lastMove.y = y;

                    if(this.currentState.boardState[y][x] == 0) {
                        this.renderPiece(x,y, true);
                        this.currentState.turn = !this.currentState.turn;
                        this.currentState.boardState[y][x] = "X";
                        this.advanceToState(this.currentState);
                    }

                }
            }
        }
    },

    renderPiece: function(x, y, turn) {
        var xCordinate = x * this.sectionSize;
        var yCordinate = y * this.sectionSize;
        if(turn) {
            this.drawX(xCordinate, yCordinate);
        } else {
            this.drawO(xCordinate, yCordinate);
        }
        this.textMessage.text = this.textMessage.text == this.messageOne ? this.messageTwo :this.messageOne;
    },

    advanceToState: function(state) {
        this.currentState = state;
        if(this.currentState.isStateTerminal()) {
            state.status = "finished";
            this.textMessage.text= "";
            globalUser.result = state.result == "X" ? "You won" : (state.result == "O" ? "You Lose" : "Match Draw");
            this.game.state.start("GameOver",  false, true);
            return;
        }
        if (!state.turn) {
            if(globalUser.AI) {
                this.game.time.events.add(Phaser.Timer.SECOND * 1, function(){
                    globalUser.AI.makeMove();
                }, this);
            }
            state.oMovesCount += 1;
        }
        //state.turn = !state.turn;
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

    score: function(_state) {
        if(_state.result === "X"){
            // the x player won
            return 10 - _state.oMovesCount;
        }
        else if(_state.result === "O") {
            //the x player lost
            return - 10 + _state.oMovesCount;
        }
        else {
            //it's a draw
            return 0;
        }
    },

    setTurnMessages: function() {
        if(globalUser.AI) {
            if(this.currentState.turn) {
                this.messageOne = "Your turn, make your move";
                this.messageTwo = "Please wait, AI is thinking";
            } else {
                this.messageTwo = "Your turn, make your move";
                this.messageOne = "Please wait, AI is thinking";
            }
        } else if(globalUser.playingOverNetwork) {

        } else {
            this.messageOne = "Player one's turn";
            this.messageTwo = "Player two's turn";
        }
    }
};

// Export Game and make State global
window.State = State;
module.exports = Game;
