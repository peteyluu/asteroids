const MovingObject = require('./moving_object');
const Ship = require('./ship.js');
const Util = require('./util.js');

const Asteroid = function(options) {
  options.pos = options.pos;
  options.color = Asteroid.defaults.COLOR;
  options.radius = Asteroid.defaults.RADIUS;
  options.vel = Util.randomVec(Asteroid.defaults.SPEED);

  MovingObject.call(this, options);
};

Util.inherits(Asteroid, MovingObject);

Asteroid.prototype.collideWith = function(otherObject) {
  if (otherObject instanceof Ship) {
    otherObject.relocate();
  }
};

Asteroid.defaults = {
  COLOR: "#00FF00",
  RADIUS: 10,
  SPEED: 5
};


module.exports = Asteroid;
