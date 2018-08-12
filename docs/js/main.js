import { config, loadImages, drawText } from "./gameLib.js";
import { LevelPanel } from "./levelPanel.js";
import { User } from "./user.js";

//const $canvas = $('#canvas');
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
main();

function main() {
  //Load the images before getting started
  loadImages(config.imgSources, function(images) {
    let user, levelPanel, game;
    user = new User("guest");

    levelPanel = new LevelPanel(canvas, user, images);
    levelPanel.run();
  });

  //Show loading before the images finish loading
  let prompt = "loading...";
  drawText(ctx, prompt, 400, 300, "fill", "25px Arial", "center", "yellow");
}
