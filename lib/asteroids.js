const GameView = require('./game_view.js');
const Game = require('./game.js');

const e = addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementsByTagName("canvas")[0];
  canvas.width = Game.DIM_X;
  canvas.height = Game.DIM_Y;
  const ctx = canvas.getContext("2d");
  new GameView(ctx).start();
});
