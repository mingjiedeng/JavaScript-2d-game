/**
 * Game, the class defines the main body of the game.
 *
 * @author Mingjie Deng <mingjie.dmj@gmail.com>
 * @version 1.0 (8/19/2018)
 */

import {
  config,
  drawText,
  Ball,
  HomeZone,
  BlackHole,
  BarrierBlock
} from "./gameLib.js";
import { LevelPanel } from "./levelPanel.js";
import gameData from "./levelData.js";
import { Vector } from "./vector.js";

const ballStatus = config.ballStatus;
const levelDatas = gameData.levels;
const captureDistance = 80;
const controlDistance = 60;
const ballRadius = 8;
const ballVelocity = 4;

let stopMainLoop = null;
let cursor = { x: -captureDistance * 10, y: -captureDistance * 10 };
let accomplished = true;

class Game {
  constructor(canvas, user, level, images) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d");
    this.user = user;
    this.images = images;
    this.level = level;
    this.levelData = levelDatas[level - 1];
    let levelData = this.levelData;

    //Load the home zone
    let home = levelData.homeZone;
    this.homeZone = new HomeZone(
      this.ctx,
      home.x,
      home.y,
      home.width,
      home.height
    );

    //Load the blackholes and wormholes
    this.blackHoles = [];
    let bh, blackHole;
    let bhNum = levelData.blackHoles ? levelData.blackHoles.length : 0;
    for (let i = 0; i < bhNum; i++) {
      bh = levelData.blackHoles[i];
      if (bh.type == "wormhole") {
        blackHole = new BlackHole(
          this.ctx,
          bh.x,
          bh.y,
          bh.radius,
          bh.type,
          bh.targetX,
          bh.targetY
        );
      } else {
        blackHole = new BlackHole(this.ctx, bh.x, bh.y, bh.radius, bh.type);
      }
      this.blackHoles.push(blackHole);
    }

    //Load the barrier blocks(inner walls)
    this.barrierBlocks = [];
    let bb;
    let barNum = levelData.barrierBlocks ? levelData.barrierBlocks.length : 0;
    for (let i = 0; i < barNum; i++) {
      bb = levelData.barrierBlocks[i];
      this.barrierBlocks.push(
        new BarrierBlock(this.ctx, bb.p1x, bb.p1y, bb.p2x, bb.p2y, bb.type)
      );
    }

    //Load the emojis(balls)
    this.ballNum = levelData.balls.length;
    this.balls = [];
    this.ballLost = 0;
    let rx, ry, rVx, rVy, emojiSrc;
    let balls = levelData.balls;
    for (let i = 0; i < this.ballNum; i++) {
      rx = randomNum(balls[i].rx[0], balls[i].rx[1]);
      ry = randomNum(balls[i].ry[0], balls[i].ry[1]);
      rVx = randomV(balls[i].rVx[0], balls[i].rVx[1]);
      rVy = randomV(balls[i].rVy[0], balls[i].rVy[1]);
      emojiSrc = "images/emoji" + ((i % 5) + 1) + ".png";
      this.balls.push(
        new Ball(this.ctx, rx, ry, rVx, rVy, ballRadius, emojiSrc)
      );
    }

    //Bind the event handler
    this.mouseMoveHandler = mouseMove.bind(this);
    this.mouseOutHandler = mouseOut.bind(this);
    this.touchOrMove = touchOn.bind(this);
    this.touchEnd = touchOut.bind(this);
    this.backToTile = clickBackToTile.bind(this);

    canvas.addEventListener("mousemove", this.mouseMoveHandler);
    canvas.addEventListener("mouseout", this.mouseOutHandler);
    canvas.addEventListener("touchstart", this.touchOrMove);
    canvas.addEventListener("touchmove", this.touchOrMove);
    canvas.addEventListener("touchend", this.touchEnd);
  }

  /**
   * This is the main game loop
   */
  run() {
    const canvas = this.canvas;
    const ctx = canvas.getContext("2d");

    stopMainLoop = window.requestAnimationFrame(() => this.run());
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    accomplished = true;

    drawScene.call(this);

    ctx.save();
    for (let ball of this.balls) {
      //Ignore the ball has been destroyed
      if (ball.status == ballStatus.DESTROY) continue;

      //Check if the ball is captured by player
      checkCapture.call(this, ball);

      //Run the ball and check all the collisions and reflection
      moveTheBall.call(this, ball);

      ball.draw();

      //Check if the ball has been destroyed by black holes
      if (ball.status == ballStatus.ACTIVE) checkBlackHole.call(this, ball);

      //Update the game accomplished status.
      //If there is one ball not located in the home zone, we don't need to check the other balls
      if (accomplished && ball.status != ballStatus.DESTROY)
        accomplished = isInsideRect(ball, this.homeZone);
    }
    ctx.restore();

    //Mission accomplished if emojis are all back home
    if (accomplished) {
      levelAccomplished.call(this);
    }
  }
}

/**
 * Draw all the game elements except balls
 */
function drawScene() {
  this.ctx.save();

  //Draw the background
  let img = new Image();
  img.src = config.imgSources.gameBg;
  this.ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  //Draw the target zone
  this.homeZone.draw();

  //Draw the black holes
  for (let blackHole of this.blackHoles) {
    blackHole.draw();
  }

  //Draw the bounding bars
  for (let barrierBlock of this.barrierBlocks) {
    barrierBlock.draw();
  }

  this.ctx.restore();
}

/**
 * If the ball has been captured,
 * links it and pulls it closer
 *
 * @param {Ball} ball a ball instance in the game
 */
function checkCapture(ball) {
  const ctx = this.ctx;
  let dist = distance(ball, cursor);

  //If ball in capture scope,
  if (dist < captureDistance) {
    ball.status = ballStatus.CAPTURED;

    //Pull the ball back from capture distance to control distance.
    if (dist > controlDistance) {
      let vecCursor = new Vector(cursor.x, cursor.y);
      let vecBall = new Vector(ball.x, ball.y);
      let vecPull = vecCursor.subtract(vecBall);
      vecPull = vecPull.scaleToLength(dist - controlDistance);

      let flickPoint = null;
      for (let bar of this.barrierBlocks) {
        if ((flickPoint = isHitTheBar(ball, bar, vecPull.x, vecPull.y))) break;
      }
      if (flickPoint) {
        ball.x = flickPoint.x;
        ball.y = flickPoint.y;
      } else {
        let vecPullTo = vecBall.add(vecPull);
        ball.x = vecPullTo.x;
        ball.y = vecPullTo.y;
      }
    }

    //Draw a line to link the ball to cursor
    ctx.beginPath();
    ctx.moveTo(cursor.x, cursor.y);
    ctx.lineTo(ball.x, ball.y);
    ctx.strokeStyle = "#e6d0f2";
    ctx.stroke();
  } else {
    ball.status = ballStatus.ACTIVE;
  }
}

/**
 * Run the ball inside the canvas
 */
function moveTheBall(ball) {
  //bounce the ball when it hit the barrier blocks(inner walls)
  for (let bar of this.barrierBlocks) {
    if (isHitTheBar(ball, bar)) {
      //change the vx,vy to flip the ball
      ballRebound(ball, bar);
      break;
    }
  }

  //bounce the ball when it hit the boundary wall
  if (ball.y > canvas.height - ball.radius || ball.y < 0 + ball.radius) {
    ball.vy = -ball.vy;
  }
  if (ball.x > canvas.width - ball.radius || ball.x < 0 + ball.radius) {
    ball.vx = -ball.vx;
  }

  ball.x += ball.vx;
  ball.y += ball.vy;
}

/**
 * Check if the ball hit the barrier(inner wall)
 *
 * @param {Ball} ball the ball to check
 * @param {BarrierBlock} bar the barrier to check
 * @param {Number} vx the x value of the vector that indicate the ball moving
 * @param {Number} vy the y value of the vector that indicate the ball moving
 * @return {Object} the position of ball flicking if hit, otherwise null
 */
function isHitTheBar(ball, bar, vx = ball.vx, vy = ball.vy) {
  let ballFlickPoint = null;
  let vecBall = new Vector(ball.x, ball.y);
  let vecBar1 = new Vector(bar.beginX, bar.beginY);
  let vecBar2 = new Vector(bar.endX, bar.endY);
  let vecBallToBar1 = vecBar1.subtract(vecBall);
  let vecBallToBar2 = vecBar2.subtract(vecBall);
  let vectorBar = vecBar2.subtract(vecBar1);
  let vecBallVerticalBar = vectorBar.verticalV();
  let sign = vecBallToBar1.cross(vecBallToBar2) > 0 ? -1 : 1;
  vecBallVerticalBar.multiply(sign);
  vecBallVerticalBar.scaleToLength(ball.radius);
  let hitPointOnBall = vecBall.add(vecBallVerticalBar);

  let vectorBall = new Vector(vx, vy);

  // The ball move away from the bar, so does not hit the bar
  if (vectorBar.cross(vectorBall) * sign < 0) return ballFlickPoint;

  // Calculate s and t by the following equations
  // hitPointOnBall + s * vectorBall == vecBar1 + t * vectorBar
  // s * vectorBall.x - t * vectorBar.x == vecBar1.x - hitPointOnBall.x
  // s * vectorBall.y - t * vectorBar.y = vecBar1.y - hitPointOnBall.y
  let n1 = vecBar1.x - hitPointOnBall.x;
  let n2 = vecBar1.y - hitPointOnBall.y;
  let d = vectorBall.x * -vectorBar.y - -vectorBar.x * vectorBall.y;
  if (Math.abs(d) < 0.001) {
    d = d > 0 ? 0.001 : -0.001;
  }
  let s = (n1 * -vectorBar.y - -vectorBar.x * n2) / d;
  let t = (vectorBall.x * n2 - n1 * vectorBall.y) / d;

  //the ball hit the bar if the vector_ball cross the barrier block
  if (s >= 0 && s <= 1 && t >= 0 && t <= 1) {
    let vecTBar = new Vector(vectorBar.x * t, vectorBar.y * t);
    let hitPointOnBar = vecBar1.add(vecTBar);
    ballFlickPoint = hitPointOnBar.subtract(vecBallVerticalBar);
  }

  return ballFlickPoint;
}

/**
 * Change the direction(vx, vy) of ball moving after hitting the barrier
 *
 * @param {Ball} ball
 * @param {BarrierBlock} bar
 */
function ballRebound(ball, bar) {
  //Formulation: new_vector_ball = (vector_ball.vector_bar_normalized)*vector_bar_normalized*2 - vector_ball
  let vecBar = new Vector(bar.endX - bar.beginX, bar.endY - bar.beginY);
  let vecBarNor = vecBar.normalize();
  let vecBall = new Vector(ball.vx, ball.vy);
  let ballCastToBar = vecBall.dot(vecBarNor);
  let vecBallNewV = vecBarNor.multiply(ballCastToBar * 2);
  vecBallNewV = vecBallNewV.subtract(vecBall);

  let bigV = Math.max(Math.abs(ball.vx), Math.abs(ball.vy));
  let rate = 1;
  const vInc = 1;
  if (bar.type == "accelerate") {
    const adjustMaxV = ballVelocity + 2;
    let adjustV = bigV + vInc > adjustMaxV ? adjustMaxV - bigV : vInc;
    rate = adjustV / bigV;
    vecBallNewV.multiply(1 + rate);
  } else if (bar.type == "decelerate") {
    const adjustMinV = 0.4;
    let adjustV = bigV - vInc < adjustMinV ? bigV - adjustMinV : vInc;
    rate = adjustV / bigV;
    vecBallNewV.multiply(1 - rate);
  }

  ball.vx = vecBallNewV.x;
  ball.vy = vecBallNewV.y;
}

/**
 * Handle the ball if it runs into the black hole or worm hole
 *
 * @param {Ball} ball
 */
function checkBlackHole(ball) {
  for (let bh of this.blackHoles) {
    if (isInsideCircle(ball, bh)) {
      if (bh.type == "blackhole") {
        ball.status = ballStatus.DESTROY;
        this.ballLost++;
      } else if (bh.type == "wormhole") {
        ball.x = bh.targetX;
        ball.y = bh.targetY;
      }
      break;
    }
  }
}

/**
 * Finish the game and show the result on canvas
 */
function levelAccomplished() {
  //Stop the main loop of the game
  window.cancelAnimationFrame(stopMainLoop);

  let canvas = this.canvas;
  let ctx = this.ctx;
  let stars = this.user.levelRecords;
  let level = this.level;
  let resultTxt;
  if (this.ballLost <= 0) {
    stars[level] = 3;
    resultTxt = "Awesome, You Saved All of Us";
  } else if (this.ballLost <= 2) {
    stars[level] = Math.max(2, stars[level]);
    resultTxt = "Good, You Unlock Next Level";
  } else if (this.ballLost < this.ballNum) {
    stars[level] = Math.max(1, stars[level]);
    resultTxt = "Gosh, We are saved";
  } else {
    stars[level] = Math.max(0, stars[level]);
    resultTxt = "Sorry You Lost All of Us";
  }

  //Print the result
  let lost = this.ballLost;
  let saveAndLost = "Saved: " + (this.ballNum - lost) + ",  Lost: " + lost;
  let prompt = "Click to continue...";
  drawText(ctx, "", 0, 0, "fill", "45px Arial", "center", "yellow");
  drawText(ctx, resultTxt, 400, 140);
  drawText(ctx, saveAndLost, 400, 200, "fill", "25px Arial");
  drawText(ctx, prompt, 400, 250, "fill", "20px Arial");

  //Clear the game event listeners, and add an event listener to back to tiles panel
  canvas.removeEventListener("mousemove", this.mouseMoveHandler);
  canvas.removeEventListener("mouseout", this.mouseOutHandler);
  canvas.removeEventListener("touchstart", this.touchOrMove);
  canvas.removeEventListener("touchmove", this.touchOrMove);
  canvas.removeEventListener("touchend", this.touchEnd);

  canvas.addEventListener("click", this.backToTile);
  canvas.addEventListener("touchstart", this.backToTile);
}

function mouseMove(e) {
  cursor.x = e.clientX - 8;
  cursor.y = e.clientY - 8;
}

function mouseOut() {
  cursor.x = -captureDistance * 10;
  cursor.y = -captureDistance * 10;
  //window.cancelAnimationFrame(stopMainLoop);
}

function touchOn(e) {
  e.preventDefault();
  cursor.x = e.touches[0].clientX;
  cursor.y = e.touches[0].clientY;
}

function touchOut(e) {
  e.preventDefault();
  cursor.x = -captureDistance * 10;
  cursor.y = -captureDistance * 10;
}

function clickBackToTile() {
  canvas.removeEventListener("click", this.backToTile);
  canvas.removeEventListener("touchstart", this.backToTile);

  let levelPanel = new LevelPanel(canvas, this.user, this.images);
  levelPanel.run();
}

function distance(point1, point2) {
  return Math.sqrt(
    Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2)
  );
}

function isInsideCircle(ball, circle) {
  return distance(ball, circle) < circle.radius - ball.radius;
}

function isInsideRect(ball, rectangle) {
  return (
    ball.x > rectangle.x + ball.radius &&
    ball.x < rectangle.x + rectangle.width - ball.radius &&
    ball.y > rectangle.y + ball.radius &&
    ball.y < rectangle.y + rectangle.height - ball.radius
  );
}

function randomNum(lower, upper) {
  let random = 0;
  while (random == 0) {
    random = Math.random() * (upper - lower) + lower;
  }
  return random;
}

/**
 * Return a random number in [lower, upper] or [-upper, -lower]
 */
function randomV(lower, upper) {
  let sign = Math.random() > 0.5 ? 1 : -1;
  return sign * randomNum(lower, upper);
}

export { Game };
