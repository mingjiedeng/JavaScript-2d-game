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

const ballStatus = config.ballStatus;
const levelDatas = gameData.levels;
const captureDistance = 80;
const controlDistance = 60;
const ballRadius = 8;
const ballVelocity = 3;

let stopMainLoop = null;
let cursor = { x: -captureDistance * 10, y: -captureDistance * 10 };
let accomplished = true;

class Game {
  constructor(canvas, user, level) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d");
    this.user = user;
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

    //Load the emojis
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
      emojiSrc = "images/emoji" + ((i % 6) + 1) + ".png";
      this.balls.push(
        new Ball(this.ctx, rx, ry, rVx, rVy, ballRadius, emojiSrc)
      );
    }

    //Bind the event handler
    this.mouseMoveHandler = mouseMove.bind(this);
    this.mouseOutHandler = mouseOut.bind(this);
    this.backToTile = clickBackToTile.bind(this);

    canvas.addEventListener("mousemove", e => this.mouseMoveHandler(e));
    canvas.addEventListener("mouseout", e => this.mouseOutHandler(e));
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
      //Ignore the ball has been destroy
      if (ball.status == ballStatus.DESTROY) continue;

      //Check if the ball is captured by player
      checkCapture.call(this, ball);

      //Run the ball and bounce back when ball hit the walls
      moveTheBall.call(this, ball);

      ball.draw();

      //Check if the ball has been destroyed by black holes
      if (ball.status == ballStatus.ACTIVE) checkBlackHole.call(this, ball);

      //If any ball is not located in home zone, we don't need to check the other balls
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
 * Handle the ball with new position and
 * line connection if it has been captured
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
      let controlX = (controlDistance / dist) * (cursor.x - ball.x);
      let controlY = (controlDistance / dist) * (cursor.y - ball.y);
      let vx = cursor.x - ball.x - controlX;
      let vy = cursor.y - ball.y - controlY;
      let hitPoint = null;
      for (let bar of this.barrierBlocks) {
        if ((hitPoint = isHitTheBar(ball, bar, vx, vy))) break;
      }
      if (hitPoint) {
        ball.x = hitPoint.x;
        ball.y = hitPoint.y;
      } else {
        ball.x = cursor.x - controlX;
        ball.y = cursor.y - controlY;
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

function moveTheBall(ball) {
  //bounce the ball when it hit the boundary wall
  if (ball.y > canvas.height - ball.radius || ball.y < 0 + ball.radius) {
    ball.vy = -ball.vy;
  }
  if (ball.x > canvas.width - ball.radius || ball.x < 0 + ball.radius) {
    ball.vx = -ball.vx;
  }

  ball.x += ball.vx;
  ball.y += ball.vy;

  //bounce the ball when it hit the barrier blocks(inner walls)
  for (let bar of this.barrierBlocks) {
    if (isHitTheBar(ball, bar)) {
      //change the vx,vy to flip the ball
      ballRebound(ball, bar);
      break;
    }
  }
}

function isHitTheBar(ball, bar, vx = ball.vx, vy = ball.vy) {
  let hitPoint = null;
  let dist = distance(ball, cursor);
  const padding = captureDistance - controlDistance + ball.radius;
  let barScope = {
    x: Math.min(bar.beginX, bar.endX) - padding,
    y: Math.min(bar.beginY, bar.endY) - padding,
    width: Math.abs(bar.beginX - bar.endX) + padding * 2,
    height: Math.abs(bar.beginY - bar.endY) + padding * 2
  };
  if (isInsideRect(ball, barScope)) {
    let x_vector_bar = bar.endX - bar.beginX;
    let y_vector_bar = bar.endY - bar.beginY;

    let barLength = Math.sqrt(
      Math.pow(x_vector_bar, 2) + Math.pow(y_vector_bar, 2)
    );
    let x_bar_normalized = x_vector_bar / barLength;
    let y_bar_normalized = y_vector_bar / barLength;

    //expand the vector_ball by the ballRadius:
    //vector_ball_expand = ori_vector_ball * ballRadius / vCast_ori_vector_ball
    //length_of_vCast = ax * (-by) + ay * bx
    let length_of_vCast = Math.abs(
      vx * -y_bar_normalized + vy * x_bar_normalized
    );
    let expandRate = ball.radius / length_of_vCast;
    let x_vector_ball = vx * (1 + expandRate);
    let y_vector_ball = vy * (1 + expandRate);
    let n1 = bar.beginX - ball.x;
    let n2 = bar.beginY - ball.y;

    // Calculate s and t by this two equations
    // s * x_vector_ball - t * x_vector_bar = n1
    // s * y_vector_ball - t * y_vector_bar = n2
    let d = x_vector_ball * -y_vector_bar - -x_vector_bar * y_vector_ball;
    if (Math.abs(d) < 0.001) {
      d = d > 0 ? 0.001 : -0.001;
    }
    let s = (n1 * -y_vector_bar - -x_vector_bar * n2) / d;
    let t = (x_vector_ball * n2 - n1 * y_vector_ball) / d;

    //the ball hit the bar if the vector_ball cross the bounding bar means
    if (s >= 0 && s <= 1 && t >= 0 && t <= 1) {
      //calculate the hit point with the ball radius considered
      let x_hitPoint = ball.x + s * x_vector_ball - vx * expandRate;
      let y_hitPoint = ball.y + s * y_vector_ball - vy * expandRate;
      let newDist = distance({ x: x_hitPoint, y: y_hitPoint }, cursor);
      if (newDist > dist) {
        x_hitPoint = ball.x;
        y_hitPoint = ball.y;
      }
      hitPoint = { x: x_hitPoint, y: y_hitPoint };
    }
  }
  return hitPoint;
}

function ballRebound(ball, bar) {
  let x_vector_bar = bar.endX - bar.beginX;
  let y_vector_bar = bar.endY - bar.beginY;

  //Formulation: new_vector_ball = (vector_ball.vector_bar_normalized)*vector_bar_normalized*2 - vector_ball
  let barLength = Math.sqrt(
    Math.pow(x_vector_bar, 2) + Math.pow(y_vector_bar, 2)
  );
  let x_bar_normalized = x_vector_bar / barLength;
  let y_bar_normalized = y_vector_bar / barLength;
  let ballCastToBar = ball.vx * x_bar_normalized + ball.vy * y_bar_normalized;
  ball.vx = ballCastToBar * x_bar_normalized * 2 - ball.vx;
  ball.vy = ballCastToBar * y_bar_normalized * 2 - ball.vy;
  let vx = ball.vx;
  let vy = ball.vy;

  let bigV = Math.max(Math.abs(vx), Math.abs(vy));
  if (bar.type == "accelerate") {
    const adjustMaxV = ballVelocity * 1.5;
    let adjustV = adjustMaxV - bigV < 1 ? adjustMaxV - bigV : 1;
    let rate = adjustV / bigV;

    ball.vx = vx * (1 + rate);
    ball.vy = vy * (1 + rate);
  } else if (bar.type == "decelerate") {
    const adjustMinV = 0.4;
    let adjustV = bigV - adjustMinV < 1 ? bigV - adjustMinV : 1;
    let rate = adjustV / bigV;

    ball.vx = vx * (1 - rate);
    ball.vy = vy * (1 - rate);
  }
}

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
  canvas.addEventListener("click", this.backToTile);
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

function clickBackToTile() {
  canvas.removeEventListener("click", this.backToTile);

  let levelPanel = new LevelPanel(canvas, this.user);
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
