var game = new Phaser.Game(800, 800, Phaser.AUTO, 'game-div', { preload: preload, create: create, update: update });

function preload() {

    game.load.spritesheet('dude', 'assets/dude.png', 32, 48);

    game.load.tilemap('level1', 'example-tilemap.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles', 'simples_pimples.png');

    game.load.spritesheet('baddie', 'assets/baddie.png', 32, 32);

}

// Any variables that we want to use in both create() and update()
// have to be declared outside of both functions.
var keys;
var player;
var map;
var backgroundLayer;
var blockingLayer;
var itemLayer;
var star;
var baddie;

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);

    map = game.add.tilemap('level1');
    map.addTilesetImage('simples_pimples', 'tiles');

    backgroundLayer = map.createLayer('Background');
    backgroundLayer.setScale(2);
    blockingLayer = map.createLayer('Blocking Layer');
    blockingLayer.setScale(2);
    itemLayer = map.createLayer('Item Layer');
    itemLayer.setScale(2);
    
    map.setCollisionBetween(700, 750, true, 'Blocking Layer');

    // The player and its settings
    player = game.add.sprite(32, game.world.height - 250, 'dude');
    player.scale.setTo(0.5, 0.5);

    //  We need to enable physics on the player so that it can move and collide with stuff
    game.physics.arcade.enable(player);
    
    //  Player physics properties.
    player.body.gravity.y = 1200;
    
    //  Our controls.
    keys = game.input.keyboard.createCursorKeys();
    
    // Add animations to the player
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);

    // Add the baddie
    baddie = game.add.sprite(32, game.world.height - 350, 'baddie');
    game.physics.arcade.enable(baddie);
    baddie.body.velocity.x = 50;
    baddie.body.gravity.y = 1200;
    baddie.animations.add('left', [0, 1], 5, true);
    baddie.animations.add('right', [2, 3], 5, true);
    baddie.animations.play('right');

    var baddieDirection = 'right';
    var changeBaddieDirection = function() {
        console.log("Changing direction");
        if (baddieDirection === 'right') {
            baddieDirection = 'left';
            baddie.body.velocity.x = -50;
        } else if (baddieDirection === 'left') {
            baddieDirection = 'right';
            baddie.body.velocity.x = 50;
        }
        baddie.animations.play(baddieDirection);
        console.log(baddie.body.velocity.x);
    };

    //  Create our Timer
    var timer = game.time.create();

    //  Set a TimerEvent to occur after 2 seconds
    timer.loop(2000, changeBaddieDirection, this);

    //  Start the timer running - this is important!
    //  It won't start automatically, allowing you to hook it to button events and the like.
    timer.start();
}

function update() {
    // Check for collisions between the player and the blocking layer
    game.physics.arcade.collide(player, blockingLayer);
    game.physics.arcade.collide(baddie, blockingLayer);

    if (keys.left.isDown) {
        //  Move to the left
        player.body.velocity.x = -250;
        player.animations.play('left');
    }
    else if (keys.right.isDown) {
        //  Move to the right
        player.body.velocity.x = 250;
        player.animations.play('right');
    }
    else {
        //  Stop
        player.body.velocity.x = 0;
        
        //  Stand still
        player.animations.stop();
        
        // Reset animation frame
        player.frame = 4;
    }
    
    if (keys.up.isDown) {
        player.body.velocity.y = -700;
    }
}
