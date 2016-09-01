/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	const GameView = __webpack_require__(1);

	const e = addEventListener("DOMContentLoaded", () => {
	  const canvas = document.getElementsByTagName("canvas")[0];
	  const ctx = canvas.getContext("2d");
	  new GameView(ctx).start();
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	const Game = __webpack_require__(2);

	const GameView = function(ctx) {
	  this.ctx = ctx;
	  this.game = new Game();
	};

	GameView.MOVES = {
	  "w": [0, -1],
	  "a": [-1, 0],
	  "s": [0, 1],
	  "d": [1, 0]
	};

	GameView.prototype.bindKeyHandlers = function() {
	  const ship = this.game.ship[0];

	  Object.keys(GameView.MOVES).forEach((k) => {
	    let move = GameView.MOVES[k];
	    key(k, () => { ship.power(move); });
	  });
	};

	GameView.prototype.start = function() {
	  this.bindKeyHandlers();
	  setInterval(() => {
	    this.game.step();
	    this.game.draw(this.ctx);
	  }, 20);
	};

	module.exports = GameView;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	const Util = __webpack_require__(3);
	const Asteroid = __webpack_require__(4);
	const Ship = __webpack_require__(6);

	const Game = function() {
	  this.asteroids = [];
	  this.ship = [];
	  this.addAsteroids();
	  this.addShip();
	};

	Game.DIM_X = 1000;
	Game.DIM_Y = 600;
	Game.NUM_ASTEROIDS = 10;

	Game.prototype.addShip = function() {
	  this.ship.push(new Ship({
	    pos: this.randomPosition(),
	    game: this
	  }));
	};

	Game.prototype.allObjects = function() {
	  return [].concat(this.asteroids, this.ship);
	};

	Game.prototype.remove = function(asteroid) {
	  let idx = this.asteroids.indexOf(asteroid);
	  this.asteroids.splice(idx, 1);
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
	    this.asteroids.push(new Asteroid(
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
	  let allObjects = this.allObjects();
	  ctx.clearRect(0, 0, 1000, 600);
	  for (let i = 0; i < allObjects.length; i++) {
	    allObjects[i].draw(ctx);
	  }
	};

	Game.prototype.moveObjects = function() {
	  let allObjects = this.allObjects();
	  for (let i = 0; i < allObjects.length; i++) {
	    allObjects[i].move();
	  }
	};

	module.exports = Game;


/***/ },
/* 3 */
/***/ function(module, exports) {

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

	  distance: function(pos1, pos2) {
	    return Math.sqrt((Math.pow(pos2[0] - pos1[0], 2)) +
	                     (Math.pow(pos2[1] - pos1[1], 2)));
	  }
	};

	module.exports = Util;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	const MovingObject = __webpack_require__(5);
	const Ship = __webpack_require__(6);
	const Util = __webpack_require__(3);

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


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	const Util = __webpack_require__(3);

	const MovingObject = function(options) {
	  this.pos = options.pos;
	  this.vel = options.vel;
	  this.radius = options.radius;
	  this.color = options.color;
	  this.game = options.game;
	};

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

	MovingObject.prototype.move = function() {
	  this.pos[0] += this.vel[0];
	  this.pos[1] += this.vel[1];
	  this.pos = this.game.wrap(this.pos);
	};

	module.exports = MovingObject;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	const Util = __webpack_require__(3);
	const MovingObject = __webpack_require__(5);

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


/***/ }
/******/ ]);