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
	const Game = __webpack_require__(2);

	const e = addEventListener("DOMContentLoaded", () => {
	  const canvas = document.getElementsByTagName("canvas")[0];
	  canvas.width = Game.DIM_X;
	  canvas.height = Game.DIM_Y;
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
	  this.lastTime = 0;
	};

	GameView.MOVES = {
	  "w": [ 0, -1],
	  "a": [-1,  0],
	  "s": [ 0,  1],
	  "d": [ 1,  0],
	};

	GameView.prototype.animate = function(timestamp) {
	  let delta = timestamp - this.lastTime;
	  requestAnimationFrame(this.animate.bind(this));
	  this.game.step(delta);
	  this.game.draw(this.ctx);
	  this.lastTime = timestamp;
	};

	GameView.prototype.bindKeyHandlers = function() {
	  const ship = this.game.ship[0];

	  Object.keys(GameView.MOVES).forEach((k) => {
	    let move = GameView.MOVES[k];
	    key(k, () => { ship.power(move); });
	  });

	  key("space", () => { ship.fireBullet(); });
	};

	/*
	  window.requestAnimationFrame(callback);

	  Params:
	  -> callback
	    - A parameter specifying a function to call when it's time to
	    update your animation for the next repaint.
	    - The callback has one single argument, a
	    DOMHighResTimeStamp, which indicates the current time (the
	    time returned from Performance.now() ) for when
	    requestAnimationFrame starts to fire callbacks.

	  Return value:
	    - A long integer value, thr request id, that uniquely
	    identifies the entry in the callback list.
	    - This is a non-zero value, but you may not make any other
	    assumptions about its value.
	    - You can pass this value to `window.cancelAnimationFrame()`
	    to cancel the refresh callback request.
	*/

	GameView.prototype.start = function() {
	  this.bindKeyHandlers();
	  requestAnimationFrame(
	    this.animate.bind(this)
	  );
	  // setInterval(() => {
	  //   this.game.step();
	  //   this.game.draw(this.ctx);
	  // }, 20);
	};

	module.exports = GameView;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	const Util = __webpack_require__(3);
	const Asteroid = __webpack_require__(4);
	const Ship = __webpack_require__(6);
	const Bullet = __webpack_require__(7);

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

	Game.prototype.step = function(delta) {
	  this.moveObjects(delta);
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

	Game.prototype.moveObjects = function(delta) {
	  let allObjects = this.allObjects();
	  for (let i = 0; i < allObjects.length; i++) {
	    allObjects[i].move(delta);
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

	  distance: function (pos1, pos2) {
	    return Math.sqrt((Math.pow(pos2[0] - pos1[0], 2)) +
	                     (Math.pow(pos2[1] - pos1[1], 2)));
	  },

	  norm: function (vec) {
	    return Util.distance([0, 0], vec);
	  },
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
	  RADIUS: 20,
	  SPEED: 1.5
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


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	const Util = __webpack_require__(3);
	const MovingObject = __webpack_require__(5);
	const Bullet = __webpack_require__(7);

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

	Ship.prototype.power = function(impulse) {
	  this.vel[0] += impulse[0];
	  this.vel[1] += impulse[1];
	};

	Ship.prototype.fireBullet = function() {
	  let relVel = Util.scale(this.vel, Bullet.SPEED);
	  let newVel = [this.vel[0] + relVel[0], this.vel[1] + relVel[1]];

	  let bullet = new Bullet({
	    pos: this.pos,
	    vel: newVel,
	    game: this.game
	  });

	  this.game.add(bullet);
	};

	Ship.defaults = {
	  RADIUS: 10,
	  COLOR: "#0000FF"
	};

	module.exports = Ship;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	const Util = __webpack_require__(3);
	const MovingObject = __webpack_require__(5);

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


/***/ }
/******/ ]);