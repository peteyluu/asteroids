const GameView = require('./game_view.js');

const e = addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementsByTagName("canvas")[0];
  canvas.width = 980;
  canvas.height = 552;
  const ctx = canvas.getContext("2d");
  new GameView(ctx).start();
});
