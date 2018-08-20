/**
 * The library for the game running
 *
 * @author Mingjie Deng <mingjie.dmj@gmail.com>
 * @version 1.0 (8/19/2018)
 */

/**
 * Game properties config
 */
const config = {
  imgSources: {
    tilePanelBg: "images/bg1.jpg",
    gameBg: "images/bg2.jpg",
    starDark: "images/starDark.png",
    starLight: "images/starLight.png",
    levelLock: "images/lock.png",
    blackHole: "images/blackHole2.png",
    wormHole: "images/blackHole1.png",
    home: "images/home2.png"
  },
  ballStatus: {
    ACTIVE: "active",
    DESTROY: "distroy",
    CAPTURED: "captured"
  }
};

/**
 * Invoke the callback function after loading all the images in the sources object
 *
 * @param {Object} sources the image source with the name and url in this object
 * @param {Function} callback callback function
 */
function loadImages(sources, callback) {
  let imgNum = 0;
  let count = 0;
  let images = {};

  for (let img in sources) {
    imgNum++;
  }

  for (let imgName in sources) {
    images[imgName] = new Image();
    images[imgName].onload = function() {
      if (++count >= imgNum) {
        callback(images);
      }
    };
    images[imgName].src = sources[imgName];
  }
}

/**
 * Draw the text specified on the canvas
 *
 * @param {Object} ctx the drawing context on the canvas
 * @param {String} text the text
 * @param {Number} x Value of the x axis on canvas
 * @param {Number} y Value of the y axis on canvas
 * @param {String} type the type of 'fill' or 'stroke'
 * @param {String} font the font style likes '45px Arial'
 * @param {String} textAlign the text align likes 'center'
 * @param {String} color the font color likes 'yellow'
 */
function drawText(
  ctx,
  text,
  x,
  y,
  type = "fill",
  font = "",
  textAlign = "",
  color = ""
) {
  if (font !== "") ctx.font = font;
  if (textAlign !== "") ctx.textAlign = textAlign;
  if (type == "stroke") {
    if (color !== "") ctx.strokeStyle = color;
    ctx.strokeText(text, x, y);
  } else {
    if (color !== "") ctx.fillStyle = color;
    ctx.fillText(text, x, y);
  }
}

function drawCircle(ctx, x, y, radius, type = "stroke", color = "black") {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2, true);
  ctx.closePath();
  if (type == "fill") {
    ctx.fillStyle = color;
    ctx.fill();
  } else {
    ctx.strokeStyle = color;
    ctx.stroke();
  }
}

class RectZone {
  constructor(ctx, x, y, width, height, color = "green", text = "") {
    this.ctx = ctx;
    this.shape = "rect";
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.text = text;
  }

  draw() {
    const ctx = this.ctx;
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    // ctx.font = "30px Arial";
    // ctx.textAlign = "center";
    if (this.text) {
      drawText(
        ctx,
        this.text,
        this.x + this.width / 2,
        this.y + this.height / 2,
        "stroke"
      );
    }
  }
}

class CircleZone {
  constructor(ctx, x, y, radius, color = "yellow", text = "") {
    this.ctx = ctx;
    this.shape = "rect";
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.text = text;
  }

  draw() {
    const ctx = this.ctx;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fillStyle = this.color;
    ctx.fill();

    if (this.text) {
      drawText(
        ctx,
        this.text,
        this.x + this.width / 2,
        this.y + this.height / 2
      );
    }
  }
}

/**
 * Define the home zone in the game
 */
class HomeZone extends RectZone {
  draw() {
    let img = new Image();
    img.src = config.imgSources.home;
    this.ctx.drawImage(img, this.x, this.y, this.width, this.height);
  }
}

/**
 * Define the ball(emoji) bouncing in the game
 */
class Ball extends CircleZone {
  constructor(ctx, x, y, vx, vy, radius, src, color = "yellow") {
    super(ctx, x, y, radius, color);
    this.vx = vx;
    this.vy = vy;
    this.src = src;
    this.status = config.ballStatus.ACTIVE;
  }

  draw() {
    let r = this.radius;
    let img = new Image();
    img.src = this.src;
    this.ctx.drawImage(img, this.x - r, this.y - r, r * 2, r * 2);
  }
}

/**
 * Define the black hole and the worm hole in the game
 * Black hole will destroys the ball
 * Worm hole will transfers the ball
 */
class BlackHole extends CircleZone {
  constructor(
    ctx,
    x,
    y,
    radius,
    type = "blackhole",
    targetX = 50,
    targetY = 50
  ) {
    super(ctx, x, y, radius);
    this.type = type;
    this.targetX = targetX;
    this.targetY = targetY;
  }

  draw() {
    const ctx = this.ctx;
    let img = new Image();

    if (this.type == "blackhole") {
      img.src = config.imgSources.blackHole;
    } else if (this.type == "wormhole") {
      img.src = config.imgSources.wormHole;
      //Draw the teleportation target of the wormhole
      drawCircle(ctx, this.targetX, this.targetY, 15, "stroke", "yellow");
      drawCircle(ctx, this.targetX, this.targetY, 5, "fill", "yellow");
    }

    //Draw the self-rotating animation
    ctx.save();
    let time = new Date();
    let radius = this.radius;
    ctx.translate(this.x, this.y);
    ctx.rotate(
      ((2 * Math.PI) / 3) * time.getSeconds() +
        ((2 * Math.PI) / 3000) * time.getMilliseconds()
    );
    ctx.drawImage(img, -radius, -radius, radius * 2, radius * 2);
    ctx.restore();
  }
}

/**
 * Define the barrier(inner wall) in the game
 * The wall with the type of these three: 'normal', 'decelerate', 'accelerate'.
 */
class BarrierBlock {
  constructor(ctx, beginX, beginY, endX, endY, type = "normal") {
    this.ctx = ctx;
    this.type = type;
    this.beginX = beginX;
    this.beginY = beginY;
    this.endX = endX;
    this.endY = endY;
    this.lineWidth = 4;
  }

  draw() {
    const ctx = this.ctx;
    ctx.save();

    let color = "#000000"; //black
    if (this.type == "decelerate") {
      color = "#9bff21"; //green
    } else if (this.type == "accelerate") {
      color = "#ba1212"; //red
    }
    ctx.strokeStyle = color;
    ctx.lineWidth = this.lineWidth;

    ctx.beginPath();
    ctx.moveTo(this.beginX, this.beginY);
    ctx.lineTo(this.endX, this.endY);
    ctx.stroke();

    ctx.restore();
  }
}

/**
 * Define the level tile with the level number on top
 * Player can click the tile to enter the game in specified level.
 */
class LevelTile extends RectZone {
  constructor(ctx, tileStatus, x, y, level, star, width = 100, height = 80) {
    super(
      ctx,
      x,
      y,
      width,
      height,
      tileStatus == "locked" ? "gray" : "blue",
      level
    );
    this.status = tileStatus;
    this.level = level;
    this.star = star;
  }

  draw(imgs) {
    const ctx = this.ctx;

    //Draw the tile
    ctx.save();
    ctx.font = "35px Arial";
    ctx.textAlign = "center";
    super.draw();

    //Draw three stars
    ctx.translate(this.x, this.y);
    let starWidth = Math.min(
      Math.floor(this.width / 30) * 10,
      Math.floor(this.height / 20) * 10
    );
    let xFirst = Math.floor((this.width - starWidth * 3) / 2);
    let yFirst = Math.ceil((this.height / 2 - starWidth) / 2 + this.height / 2);
    let img = new Image();
    let x, y;
    for (let i = 1; i <= 3; i++) {
      img.src = i <= this.star ? imgs.starLight : imgs.starDark;
      x = xFirst + starWidth * (i - 1);
      y = yFirst;
      ctx.drawImage(img, x, y, starWidth, starWidth);
    }
    if (this.status == "locked") {
      img.src = imgs.levelLock;
      ctx.drawImage(
        img,
        this.width * 0.3,
        this.height * 0.2,
        this.width * 0.4,
        this.width * 0.5
      );
    }
    ctx.restore();
  }

  /**
   * Check if the point hits this tile
   * @param {Number} x The X coordinate of the point to check
   * @param {Number} y The Y coordinate of the point to check
   * @return {Boolean} return true if the specified point is inside this tile, otherwise false
   */
  isInTile(x, y) {
    const ctx = this.ctx;
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.width, this.height);
    let clicked = ctx.isPointInPath(x, y);
    return clicked;
  }
}

export {
  config,
  loadImages,
  drawText,
  Ball,
  HomeZone,
  BlackHole,
  BarrierBlock,
  LevelTile
};
