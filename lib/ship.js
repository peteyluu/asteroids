const Util = require('./util.js');
const MovingObject = require('./moving_object.js');

const Ship = function(options) {
  options.vel = [0, 0];
  options.radius = Ship.defaults.RADIUS;
  options.color = Ship.defaults.COLOR;

  MovingObject.call(this, options);
};

Util.inherits(Ship, MovingObject);

Ship.prototype.relocate = function() {
  this.pos = this.game.randomPosition();
  this.vel = [0, 0];
};

// The impulse should be added to the current velocity of the ship.
Ship.prototype.power = function(impulse) {
  this.vel[0] += impulse[0];
  this.vel[1] += impulse[1];
};

Ship.defaults = {
  RADIUS: 10,
  COLOR: "#0000FF"
};


module.exports = Ship;
