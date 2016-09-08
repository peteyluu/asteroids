const Util = {
  inherits: function (child, parent) {
    const Surrogate = function() {};
    Surrogate.prototype = parent.prototype;
    child.prototype = new Surrogate();
    child.prototype.constructor = child;
  },

  randomVec: function (length) {
    let deg = 2 * Math.PI * Math.random();
    return Util.scale([Math.cos(deg), Math.sin(deg)], length);
  },

  scale: function (vec, m) {
    return [Math.floor(vec[0] * m), Math.floor(vec[1] * m)];
  },

  wrap: function (coord, max) {
    if (coord < 0) {
      return max;
    } else if (coord > max) {
      return 0;
    } else {
      return coord;
    }
  },

  distance: function (pos1, pos2) {
    return Math.sqrt((Math.pow(pos2[0] - pos1[0], 2)) +
                     (Math.pow(pos2[1] - pos1[1], 2)));
  },

  norm: function (vec) {
    return Util.distance([0, 0], vec);
  },
};

module.exports = Util;
