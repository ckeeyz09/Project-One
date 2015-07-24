var titlescreen = function (game) {

}

titlescreen.prototype = {
  preload: function() {
    this.game.add.sprite(0, 0, 'background');
    var playBtn = this.game.add.button(window.innerWidth/2, window.innerHeight/2, 'play', this.playTheGame, this);
    playBtn.anchor.setTo(0.5,0.5);
  },
  playTheGame: function() {
    this.game.state.start('Game');
  }
}