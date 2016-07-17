"use strict";
var configObejct = require('./../config');
var Utils = {
    containsObject: function (obj, list) {
        var i;
        for (i = 0; i < list.length; i++) {
            if (list[i] === obj) {
                return true;
            }
        }

        return false;
    },

    gridSize: function(game) {
        var config = configObejct.getInstance();
        var gameWidth =  game.width - 2 * config.graphicPadding;
        var gridTotalWidth = gameWidth - (globalUser.settings.grids - 1) * config.gameBoundaryWidth;
        return [gridTotalWidth / globalUser.settings.grids, gameWidth];
    }
};

module.exports = Utils;