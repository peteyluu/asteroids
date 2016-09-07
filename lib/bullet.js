const Util = require("./util.js");
const MovingObject = require("./moving_object.js");

const Bullet = function(options) {
  options.color = Bullet.COLOR;
  options.radius = Bullet.RADIUS;

  MovingObject.call(this, options);
};

Util.inherits(Bullet, MovingObject);

Bullet.COLOR = "#FF0000";
Bullet.RADIUS = 5;
Bullet.SPEED = 5;

Bullet.prototype.collideWith = function(asteroid) {
  if (this.isCollidedWith(asteroid)) {
    this.game.remove(asteroid);
    this.game.remove(this);
  }
};

Bullet.prototype.isWrappable = false;

module.exports = Bullet;
