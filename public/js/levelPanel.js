import { config, LevelTile, loadImages, drawText } from "./gameLib.js";
import { Game } from "./game.js";

const tileWidth = 100;
const tileHeight = 80;
const tileColumn = 5;
const imgSources = config.imgSources;

/**
 * The entry of the game, show the level tiles that player can click to start the game
 */
class LevelPanel {
  constructor(canvas, user) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d");
    this.user = user;
    this.levelStars = user.levelRecords;
    this.levelTiles = [];
  }

  run() {
    const canvas = this.canvas;
    const ctx = this.ctx;
    const user = this.user;
    let levelStars = this.levelStars;
    let levelTiles = this.levelTiles;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //Draw the instruction
    drawInstruction.call(this);

    //Calculate the first tile's position and the gap of the tiles
    let paddingGapNum = 4;
    let colGap =
      (canvas.width - tileWidth * tileColumn) /
      (tileColumn - 1 + paddingGapNum * 2);
    colGap = colGap > tileWidth ? tileWidth : Math.ceil(colGap);
    let xFirst = colGap * paddingGapNum;
    let yFirst = canvas.height / 2 + colGap;

    let x, y;
    const tileColor = "blue";
    //Load the images before draw the level tiles
    loadImages(imgSources, function(images) {
      //Draw the background
      let img = new Image();
      img.src = config.imgSources.tilePanelBg;
      ctx.globalCompositeOperation = "destination-over";
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = "source-over";

      //Draw level tiles
      for (let i = 1; i < levelStars.length; i++) {
        let tileStatus = levelStars[i - 1] < 2 ? "locked" : "open";

        x = xFirst + (tileWidth + colGap) * ((i - 1) % tileColumn);
        y = yFirst + (tileHeight + colGap) * Math.floor((i - 1) / tileColumn);
        levelTiles[i] = new LevelTile(ctx, tileStatus, x, y, i, levelStars[i]);
        levelTiles[i].draw();
      }

      //When player click a tile, run the game in the level player chose
      canvas.addEventListener("click", function clickTile(e) {
        //Figure out whick tile player chose
        let tileChosen = 0;
        for (let i = 1; i < levelStars.length; i++) {
          if (levelStars[i - 1] < 2) {
            break;
          }
          if (levelTiles[i].isInTile(e.clientX, e.clientY)) {
            tileChosen = levelTiles[i].level;
            break;
          }
        }

        if (tileChosen > 0) {
          canvas.removeEventListener("click", clickTile);
          let game = new Game(canvas, user, tileChosen);
          game.run();
        }
      }); //addEventListener
    }); //loadImages
  } //run
} //class

/**
 * Draw the instruction on canvas
 */
function drawInstruction() {
  const ctx = this.ctx;
  drawText(ctx, "", 0, 0, "fill", "45px Arial", "center", "yellow");
  // drawText(ctx, "Instruction", 400, 100);
  // drawText(ctx, "", 0, 0, "fill", "25px Arial", "left");
  // drawText(ctx, "1. Choose a level tile below to star the game.", 100, 150);
  // drawText(ctx, "2. Move cursor to lead all the emoji back home.", 100, 200);
  // drawText(ctx, "3. Got two stars to unlock next level.", 100, 250);

  drawText(ctx, "Lead Me Home", 400, 100);
  drawText(ctx, "", 0, 0, "fill", "25px Arial", "left");
  drawText(ctx, "Instruction", 100, 150);
  drawText(ctx, "1. Choose a level tile below to star the game.", 100, 190);
  drawText(ctx, "2. Move cursor to lead all the emoji back home.", 100, 230);
  drawText(ctx, "3. Got two stars to unlock next level.", 100, 270);
}

export { LevelPanel };
