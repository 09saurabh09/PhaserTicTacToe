'use strict';

var game = new Phaser.Game(800, 600, Phaser.AUTO, 'tictactoe-game');

window.Utils = require('./utils/utils');
require('./utils/prototype');
window.playerState = {
    currentLevel: 'Game'
};
window.globalUser = {};
globalUser.settings = {
    grids:3
};
window.times = 0;

game.state.add('Boot', require('./states/boot'));
game.state.add('Splash', require('./states/splash'));
game.state.add('Preloader', require('./states/preloader'));
game.state.add('Menu', require('./states/menu'));
game.state.add('Game', require('./states/game'));
game.state.add('GameOver', require('./states/gameOver'));

game.state.start('Boot');
