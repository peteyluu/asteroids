const Game = require('./game.js');

const GameView = function(ctx) {
  this.ctx = ctx;
  this.game = new Game();
};

GameView.MOVES = {
  "w": [0, -1],
  "a": [-1, 0],
  "s": [0, 1],
  "d": [1, 0],
  "c": undefined
};

GameView.prototype.bindKeyHandlers = function() {
  const ship = this.game.ship[0];

  Object.keys(GameView.MOVES).forEach((k) => {
    if (GameView.MOVES[k] === undefined) {
      key(k, () => { ship.fireBullet(); });
    } else {
      let move = GameView.MOVES[k];
      key(k, () => { ship.power(move); });
    }
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
