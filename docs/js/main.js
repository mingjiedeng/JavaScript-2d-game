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

    //Show the level panel
    levelPanel = new LevelPanel(canvas, user, images);
    levelPanel.run();
  });

  //Show 'loading' on the canvas before the images are ready
  let prompt = "loading...";
  drawText(ctx, prompt, 400, 300, "fill", "25px Arial", "center", "yellow");
}
