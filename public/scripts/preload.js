var preload = function(game) {
}

preload.prototype = {
  preload: function() {
    this.game.load.image('background', './assets/background.png');
    this.game.load.image('platform', './assets/groundtile.png');
    this.game.load.image('rock', './assets/star.png');
    this.game.load.image('replay', './assets/Replay.png');
    this.game.load.image('play', './assets/Play-Button.png');



    this.game.load.spritesheet('player', './assets/dude.png', 36, 36);
    this.game.load.spritesheet('banana', './assets/diamond.png', 36, 36);    
  },
  create: function() {
    this.game.state.start("Titlescreen");
  }
};