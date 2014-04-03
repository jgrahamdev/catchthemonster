// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

// Background Image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
  bgReady = true;
};
bgImage.src = "assets/background.png";


// Hero Image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
  heroReady = true;
}
heroImage.src = "assets/hero.png";

// Monster Image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
  monsterReady = true;
}
monsterImage.src = "assets/monster.png";

// Define directions for the monster.
var directions = ['right', 'left', 'up', 'down'];
var direction = '';

// Game objects
var hero = {
  speed: 512, // movement in pixels per second
  x: 0,
  y: 0
};
var monster = {
  speed: 512,
  x: 0,
  y: 0
}
var monstersCaught = 0;

// Handle keyboard controls.
var keysDown = {};

addEventListener("keydown", function (e) {
  keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
  delete keysDown[e.keyCode];
}, false);

var getRandDirection = function () {
  direction = directions[Math.floor(Math.random()*directions.length)];
}

// Reset the game when the player catches a monster.
var reset = function () {
  getRandDirection();
  hero.x = canvas.width / 2;
  hero.y = canvas.height / 2;

  // Throw the monster somewhere on the screen randomly.
  monster.x = 32 + (Math.random() * (canvas.width - 96));
  monster.y = 32 + (Math.random() * (canvas.height - 96));
}

// Update game objects.
var update = function (modifier) {
  if (direction == 'right') {
    if (monster.x < canvas.width - 64) {
      monster.x += monster.speed * modifier;
    }
    if (monster.x > canvas.width - 65) {
        getRandDirection();
    }
  }
  if (direction == 'left') {
    if (monster.x > 32) {
      monster.x -= monster.speed * modifier;
    }
    if (monster.x < 33) {
        getRandDirection();
    }
  }
  if (direction == 'up') {
    if (monster.y > 32) {
      monster.y -= monster.speed * modifier;
    }
    else if (monster.y < 33) {
        getRandDirection();
    }
  }
  if (direction == 'down') {
    if (monster.y < canvas.height - 64) {
      monster.y += monster.speed * modifier;
    }
    else if (monster.y > canvas.height - 65) {
        getRandDirection();
    }
  }


  if ((38 in keysDown) && (hero.y > 32)) { //Player holding up.
    hero.y -= hero.speed * modifier;
  }
  if ((40 in keysDown) && (hero.y < canvas.height - 64))  { //Player holding down.
    hero.y += hero.speed * modifier;
  }
  if ((37 in keysDown) && (hero.x > 32)) { //Player holding left.
    hero.x -= hero.speed * modifier;
  }
  if ((39 in keysDown) && (hero.x < canvas.width - 64)) { //Player holding right.
    hero.x += hero.speed * modifier;
  }

  // Are they touching?
  if (
    hero.x <= (monster.x + 32)
    && monster.x <= (hero.x +32)
    && hero.y <= (monster.y + 32)
    && monster.y <= (hero.y + 32)
  ) {
    ++monstersCaught;
    reset();
  }
};

// Draw everything.
var render = function () {
  if (bgReady) {
    ctx.drawImage(bgImage, 0, 0);
  }

  if (heroReady) {
    ctx.drawImage(heroImage, hero.x, hero.y);
  }

  if (monsterReady) {
    ctx.drawImage(monsterImage, monster.x, monster.y);
  }

  // Score
  ctx.fillStyle = "rgb(250, 250, 250)";
  ctx.font = "24px Ubuntu";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText("Goblins caught: " + monstersCaught, 32, 32);
}

var gameOn = true;

// Draw everything.
var main = function () {
  if (gameOn) {
    var now = Date.now();
    var delta = now - then;

    update(delta / 1000);
    render();


    then = now;
  }
};

var gameOver = function () {
  gameOn = false;
  ctx.fillText("Game Over", (canvas.width - 80) / 2, (canvas.height - 12) / 2);
}

reset();
var then = Date.now();
setInterval(main, 1);
setInterval(getRandDirection, 1000);

setTimeout(gameOver, 60000);
