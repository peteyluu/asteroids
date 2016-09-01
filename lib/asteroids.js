const GameView = require('./game_view.js');

const e = addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementsByTagName("canvas")[0];
  const ctx = canvas.getContext("2d");
  new GameView(ctx).start();
});
