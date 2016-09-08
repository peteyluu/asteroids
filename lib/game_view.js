const Game = require('./game.js');

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
