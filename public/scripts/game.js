var main = function (game) {

}

main.prototype = {
  create: function() {
    var BUTTON_PADDING = 10;

    this.goLeft = false;
    this.goRight = false;

    this.velocityX = 700;
    this.gravity = 500;

    var gameHeight = window.innerHeight;
    this.gameWidth = window.innerWidth;

    this.level = 1;
    this.score = 0;
    this.miss = 0;

    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    this.game.add.sprite(0, 0, 'background');
    //platform creation
    this.platforms = this.game.add.physicsGroup();

    for (i = 0; i < 15; i++) {
      this.platforms.create(i * 36, 285, 'platform');
    }
    this.platforms.setAll('body.immovable', true);
    this.platforms.setAll('body.allowGravity', false);
    //adds physics to items
    this.items = this.game.add.physicsGroup();
    //spawns banana
    this.items.create(this.game.rnd.integerInRange(0, this.gameWidth), -70, 'banana');
    //adds physics to rocks
    this.rocks = this.game.add.physicsGroup();
    //
    this.player = this.game.add.sprite(this.gameWidth/2, 200, 'player');

    //  Player physics properties. Give the little guy a slight bounce.
    this.player.body.bounce.y = 0.2;
    this.player.body.gravity.y = 300;
    this.player.body.collideWorldBounds = true;

    this.player.animations.add('left', [0,1,2,3], 10, true);

    this.player.animations.add('right', [5,6,7,8], 10, true);

    this.player.anchor.setTo(0.5, 0.5);

    this.game.physics.arcade.enable(this.player);

    this.player.body.collideWorldBounds = true;

    //buttons on the page for left and right
    this.left = this.game.add.sprite(10, gameHeight - BUTTON_PADDING - 78, 'left');
    this.left.inputEnabled = true;
    this.left.fixedToCamera = true;
    this.left.events.onInputDown.add(this.onLeft, this);
    this.left.events.onInputUp.add(this.onLeftUp, this);

    this.right = this.game.add.sprite(this.gameWidth - BUTTON_PADDING - 78, gameHeight - BUTTON_PADDING - 78, 'right');
    this.right.inputEnabled = true;
    this.right.fixedToCamera = true;
    this.right.events.onInputDown.add(this.onRight, this);
    this.right.events.onInputUp.add(this.onRightUp, this);

    //Add HUD with score
    hud = this.game.add.sprite(this.gameWidth - 100, 20, 'hud');
    hud.fixedToCamera = true;

    var txt = "         \n" + this.score.toString();

    this.pointsTxt = this.game.add.text(this.gamewidth - 80, 8, txt, {
      font : "16px Arial",
      fill : "#FFFFFF",
      align : "center"
    });
  },



  update: function() {
    this.game.physics.arcade.gravity.y = this.gravity;

    this.game.physics.arcade.collide(this.player, this.platforms);

    this.game.physics.arcade.collide(this.player, this.items, this.hitCollider, null, this);

    this.game.physics.arcade.collide(this.platforms, this.items, this.itemFalls, null, this);

    this.game.physics.arcade.collide(this.platforms, this.rocks, this.enemyFalls, null, this);

    this.game.physics.arcade.collide(this.player, this.rocks, this.gameOver, null, this);

    this.player.body.velocity.x = 0;

    if (this.goLeft) {
      this.player.body.velocity.x = -this.velocityX;
    }
    else if (this.goRight) {
      this.player.body.velocity.x = this.velocityX;
    }

    
    // cursors = game.input.keyboard.createCursorKeys();
    // this.game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]);

    // //  Reset the players velocity (movement)
    //    player.body.velocity.x = 0;

    //    if (cursors.left.isDown)
    //    {
    //        //  Move to the left
    //        this.player.body.velocity.x = -150;

    //        this.player.animations.play('left');
    //    }
    //    else if (cursors.right.isDown)
    //    {
    //        //  Move to the right
    //        this.player.body.velocity.x = 150;

    //        this.player.animations.play('right');
    //    }
    //    else
    //    {
    //        //  Stand still
    //        this.player.animations.stop();

    //        this.player.frame = 4;
    //    }

    //    //  Allow the player to jump if they are touching the ground.
    //    if (cursors.up.isDown && player.body.touching.down)
    //    {
    //        this.player.body.velocity.y = -150;
    //    }
  },

  hitCollider: function() {
    this.score++;
    var txt = "       \n" + this.score.toString();
    this.pointsTxt.setText("       \n" + this.score.toString());
    this.items.removeAll();
    if (this.score % 5 == 0 && this.score / 5 > this.level) {
      this.level++;
      this.gravity += 20;
    }
    this.spawn();
  },

  itemFalls: function() {
    this.miss++;
    this.items.removeAll();
    if (this.miss < 10) {
      this.spawn();
    }
    else {
      this.game.state.start("Gameover");
    }
  },

  gameOver: function() {
    this.rocks.removeAll();
    this.game.state.start("Gameover");
  },

  enemyFalls: function() {
    this.rocks.removeAll();
    this.spawn();
  },

  spawn: function() {
    if (this.game.rnd.integerInRange(0, 2) % 2 == 0) {
      this.items.create(this.game.rnd,integerInRange(0, this.gameWidth), -10, 'banana');
    }
    else {
      this.rocks.create(this.game.rnd,integerInRange(0, this.gameWidth), -10, 'rock');
    }
  },

  onLeft: function() {
    this.goLeft = true;
    this.player.animations.play('left');
  },
  onLeftUp: function() {
    this.goLeft = false;
    this.player.animations.stop();
    this.player.frame = 4;
  },
  onRight: function() {
    this.goRight = true;
    this.player.animations.play('right');
  },
  onRightUp: function() {
    this.goRight = false;
    this.player.animations.stop();
    this.player.frame = 4;
  }
}