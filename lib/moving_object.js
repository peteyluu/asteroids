const Util = require('./util.js');

const MovingObject = function(options) {
  this.pos = options.pos;
  this.vel = options.vel;
  this.radius = options.radius;
  this.color = options.color;
  this.game = options.game;
};

MovingObject.prototype.isWrappable = true;

MovingObject.prototype.collideWith = function(otherObject) {
  // this.game.remove(otherObject);
  // this.game.remove(this);
};

MovingObject.prototype.isCollidedWith = function(otherObject) {
  let dist = Util.distance(this.pos, otherObject.pos);
  return dist < (this.radius + otherObject.radius);
};

MovingObject.prototype.draw = function(ctx) {
  ctx.fillStyle = this.color;
  ctx.beginPath();

  // ctx.arc(x, y, radius, startAngle, eAngle, counterClockWise)
  ctx.arc(
    this.pos[0],
    this.pos[1],
    this.radius,
    0,
    2 * Math.PI,
    false
  );

  ctx.fill();
};

// The delta will be created in the GameView's `#animate` method
// based on the time variable provided by `window.requestAnimationFrame`.
MovingObject.prototype.move = function(delta = 1) {
  const velX = this.vel[0] * delta / 20;
  const velY = this.vel[1] * delta / 20;
  this.pos = [this.pos[0] + velX, this.pos[1] + velY];

  if (this.game.isOutOfBounds(this.pos)) {
    if (this.isWrappable) {
      this.pos = this.game.wrap(this.pos);
    } else {
      this.game.remove(this);
    }
  }
};

module.exports = MovingObject;
