const Util = require("./util.js");
const MovingObject = require("./moving_object.js");

const Bullet = function(options) {
  options.color = Bullet.defaults.COLOR;
  options.radius = Bullet.defaults.RADIUS;
  options.vel = Util.scale([0, -1], Bullet.defaults.SPEED);

  MovingObject.call(this, options);
};

Util.inherits(Bullet, MovingObject);

Bullet.defaults = {
  COLOR: "#000000",
  RADIUS: 5,
  SPEED: 5
};

Bullet.prototype.collideWith = function(asteroid) {
  if (this.isCollidedWith(asteroid)) {
    this.game.remove(asteroid);
    this.game.remove(this);
  }
};

module.exports = Bullet;
