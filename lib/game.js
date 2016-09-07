const Util = require('./util.js');
const Asteroid = require('./asteroid.js');
const Ship = require('./ship.js');
const Bullet = require('./bullet.js');

const Game = function() {
  this.asteroids = [];
  this.ship = [];
  this.bullets = [];
  this.addAsteroids();
  this.addShip();
};

Game.DIM_X = 980;
Game.DIM_Y = 552;
Game.NUM_ASTEROIDS = 10;

Game.prototype.isOutOfBounds = function(pos) {
  if (pos[0] < 0 ||
      pos[1] < 0 ||
      pos[0] > Game.DIM_X ||
      pos[1] > Game.DIM_Y) {
    return true;
  }
  return false;
};

Game.prototype.add = function(obj) {
  if (obj instanceof Asteroid) {
    this.asteroids.push(obj);
  } else if (obj instanceof Bullet) {
    this.bullets.push(obj);
  }
};

Game.prototype.addShip = function() {
  this.ship.push(new Ship({
    pos: this.randomPosition(),
    game: this
  }));
};

Game.prototype.allObjects = function() {
  return [].concat(this.asteroids, this.ship, this.bullets);
};

Game.prototype.remove = function(obj) {
  if (obj instanceof Asteroid) {
    let idx = this.asteroids.indexOf(obj);
    this.asteroids.splice(idx, 1);
  } else if (obj instanceof Bullet) {
    let idx = this.bullets.indexOf(obj);
    this.bullets.splice(idx, 1);
  }
};

Game.prototype.step = function() {
  this.moveObjects();
  this.checkCollisions();
};

Game.prototype.checkCollisions = function() {
  let allObjects = this.allObjects();
  for (let i = 0; i < allObjects.length; i++) {
    for (let j = 0; j < allObjects.length; j++) {
      if (i === j) {
        continue;
      }
      let obj1 = allObjects[i];
      let obj2 = allObjects[j];

      if (obj1.isCollidedWith(obj2)) {
        const collision = obj1.collideWith(obj2);
        if (collision) return;
      }
    }
  }
};

Game.prototype.wrap = function(pos) {
  return [Util.wrap(pos[0], Game.DIM_X),
          Util.wrap(pos[1], Game.DIM_Y)];
};

Game.prototype.addAsteroids = function() {
  for (let i = 0; i < Game.NUM_ASTEROIDS; i++) {
    this.add(new Asteroid(
      { pos: this.randomPosition(),
        game: this
    }));
  }
};

Game.prototype.randomPosition = function() {
  let x = Math.floor(Math.random() * Game.DIM_X);
  let y = Math.floor(Math.random() * Game.DIM_Y);
  return [x, y];
};

Game.prototype.draw = function(ctx) {
  const img = new Image();
  img.onload = () => {
    ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
    ctx.drawImage(img, 0, 0);
    let allObjects = this.allObjects();
    for (let i = 0; i < allObjects.length; i++) {
      allObjects[i].draw(ctx);
    }
  };
  img.src ='./assets/background.jpg';
};

Game.prototype.moveObjects = function() {
  let allObjects = this.allObjects();
  for (let i = 0; i < allObjects.length; i++) {
    allObjects[i].move();
  }
};

module.exports = Game;
