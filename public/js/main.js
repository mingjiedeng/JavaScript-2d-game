import { LevelPanel } from "./levelPanel.js";
import { User } from "./user.js";

//const $canvas = $('#canvas');
const canvas = document.getElementById("canvas");

main();

function main() {
  let user, levelPanel, game;
  user = new User("guest");

  levelPanel = new LevelPanel(canvas, user);
  levelPanel.run();
}
