(function () {
  var CONTAINER_ID = "bad-time-game";
  var STATUS_ID = "bad-time-status";
  var started = false;
  var tries = 0;

  function statusText(text) {
    var s = document.getElementById(STATUS_ID);
    if (s) s.textContent = text;
  }

  function startBadTimeGame() {
    var holder = document.getElementById(CONTAINER_ID);

    // This file can be loaded site-wide in Blogger.
    // If this page has no Bad Time container, silently stop.
    if (!holder) {
      return;
    }

    if (started || holder.__badTimeStarted) return;
    started = true;
    holder.__badTimeStarted = true;

    statusText("p5 loaded. starting Bad Time...");

    new p5(function (p) {
      // Run the original global-mode sketch inside this p5 instance.
      // This avoids setup()/draw() collisions with Blogger or other games.
      with (p) {

var gameCount = 0;
var gameState = 0;
var titleCount = 0;
var keys = [];
var hx = -65;
var hy = -65;
var boneX = 85;
var bone1X = 85;
var bone1Y = 200;
var bone2X = 85;
var bone2Y = 200;
var bone3X = 0;
var bone3Y = 260;
var bone4X = 0;
var bone4Y = 260;
var bone5Y = 85;
var bone6X = 315;
var bone7X = 85;
var bone8X = 85;
var bone9X = 85;
var bone10X = 85;
var bone11X = 85;
var bone12X = 85;
var bone13X = 85;
var bone14X = 85;
var bone15X = 85;
var bone16X = 85;
var bone17X = 85;
var bone18X = 85;
var bone19X = 85;
var warningX = 200;
var flashX = 175;
var warning1Y = 200;
var flash1Y = 175;
var warning2Y = 270;
var flash2Y = 245;
var warning3Y = 130;
var flash3Y = 105;
var warning4Y = 130;
var flash4Y = 105;
var warning5Y = 200;
var flash5Y = 175;
var warning6Y = 270;
var flash6Y = 245;
var warning7Y = 270;
var flash7Y = 245;
var isMoving = 0;
var isDead = 0;
var isDeadTimer = 0;
var warningXTimer = 0;
var flashXTimer = 0;
var warning1XTimer = 0;
var flash1XTimer = 0;
var warning2XTimer = 0;
var flash2XTimer = 0;
var warning3XTimer = 0;
var flash3XTimer = 0;
var warning4XTimer = 0;
var flash4XTimer = 0;
var warning5XTimer = 0;
var flash5XTimer = 0;
var warning6XTimer = 0;
var flash6XTimer = 0;
var warning7XTimer = 0;
var flash7XTimer = 0;
var warning8XTimer = 0;
var flash8XTimer = 0;
var warning9XTimer = 0;
var flash9XTimer = 0;
var warning10XTimer = 0;
var flash10XTimer = 0;
var warning11XTimer = 0;
var flash11XTimer = 0;
var health = 85;
var openInstructions = 0;
var openInfo = 0;
var openAc = 0;
var outTimer = 0;
var removeTimer = 0;
var level = 0;
var enemyX = 0;
var enemyY = 0;
var enemyX2 = 0;
var enemyY2 = 0;
var gameBeaten = 0;
var heartState = 0;

// ---- Website/embed fixes ----------------------------------------------------
// This game is designed internally at 400x400, but the canvas is styled to
// scale with its parent container. Put <div id="bad-time-game"></div> wherever
// you want it to appear, then load p5.js and this file.
var BAD_TIME_CANVAS;
var BAD_TIME_HEART_RADIUS = 8;

function resetRun() {
  gameCount = 0;
  hx = -65;
  hy = -65;
  boneX = 85;
  bone1X = 85;
  bone1Y = 200;
  bone2X = 85;
  bone2Y = 200;
  bone3X = 0;
  bone3Y = 260;
  bone4X = 0;
  bone4Y = 260;
  bone5Y = 85;
  bone6X = 315;
  bone7X = 85;
  bone8X = 85;
  bone9X = 85;
  bone10X = 85;
  bone11X = 85;
  bone12X = 85;
  bone13X = 85;
  bone14X = 85;
  bone15X = 85;
  bone16X = 85;
  bone17X = 85;
  bone18X = 85;
  bone19X = 85;
  warningXTimer = 0;
  flashXTimer = 0;
  warning1XTimer = 0;
  flash1XTimer = 0;
  warning2XTimer = 0;
  flash2XTimer = 0;
  warning3XTimer = 0;
  flash3XTimer = 0;
  warning4XTimer = 0;
  flash4XTimer = 0;
  warning5XTimer = 0;
  flash5XTimer = 0;
  warning6XTimer = 0;
  flash6XTimer = 0;
  warning7XTimer = 0;
  flash7XTimer = 0;
  warning8XTimer = 0;
  flash8XTimer = 0;
  warning9XTimer = 0;
  flash9XTimer = 0;
  warning10XTimer = 0;
  flash10XTimer = 0;
  warning11XTimer = 0;
  flash11XTimer = 0;
  health = 85;
  isMoving = 0;
  isDead = 0;
  isDeadTimer = 0;
  level = 0;
  enemyX = 0;
  enemyY = 0;
  enemyX2 = 0;
  enemyY2 = 0;
  heartState = 0;
  openInstructions = 0;
  openInfo = 0;
  openAc = 0;
}

function startGame() {
  resetRun();
  gameState = 1;
}

function goMenu() {
  resetRun();
  gameState = 0;
  titleCount = 80;
}

function keepHeartInBounds() {
  // Before the final escape prompt appears, keep the heart inside the battle box.
  // After that, allow a small escape zone so the hidden win condition still works.
  if (gameCount <= 1820) {
    hx = constrain(hx, -135, 3);
    hy = constrain(hy, -135, 3);
  } else {
    hx = constrain(hx, -165, 105);
    hy = constrain(hy, -190, 35);
  }
}

function heartCenter() {
  return { x: hx + 265, y: hy + 265 };
}

function circleRectHit(rx, ry, rw, rh, radius) {
  var heart = heartCenter();
  var nearestX = constrain(heart.x, rx, rx + rw);
  var nearestY = constrain(heart.y, ry, ry + rh);
  var dx = heart.x - nearestX;
  var dy = heart.y - nearestY;
  return dx * dx + dy * dy <= radius * radius;
}

function damageIfHit(rx, ry, rw, rh, amount, onlyWhileMoving) {
  if (isDead !== 0) return;
  if (onlyWhileMoving && isMoving !== 1) return;
  if (circleRectHit(rx, ry, rw, rh, BAD_TIME_HEART_RADIUS)) {
    health -= amount;
  }
}

function hoveringBox(x, y, w, h) {
  return mouseX > x && mouseY > y && mouseX < x + w && mouseY < y + h;
}


function upHeld() { return keyIsDown(UP_ARROW) || keyIsDown(87); }
function downHeld() { return keyIsDown(DOWN_ARROW) || keyIsDown(83); }
function leftHeld() { return keyIsDown(LEFT_ARROW) || keyIsDown(65); }
function rightHeld() { return keyIsDown(RIGHT_ARROW) || keyIsDown(68); }


p.setup = function setup() {
  holder.innerHTML = "";
  BAD_TIME_CANVAS = createCanvas(400, 400);
  BAD_TIME_CANVAS.parent(holder);
  BAD_TIME_CANVAS.elt.style.display = "block";
  BAD_TIME_CANVAS.elt.style.width = "100%";
  BAD_TIME_CANVAS.elt.style.maxWidth = "640px";
  BAD_TIME_CANVAS.elt.style.height = "auto";
  BAD_TIME_CANVAS.elt.style.margin = "0 auto";
  BAD_TIME_CANVAS.elt.style.touchAction = "none";
}

p.draw = function draw() {
  background(0);
  textFont("monospace");

  var trueX = hx + 265;
  var trueY = hy + 265;
  var trueEX = enemyX + 200;
  var trueEY = enemyY + 200;
  var trueEX2 = enemyX2 + 200;
  var trueEY2 = enemyY2 + 200;

  if (gameState === 1) {
    gameCount += 1;
    if (
      upHeld() &&
      hy > -135 &&
      isDead === 0 &&
      level === 0 &&
      gameCount > 180
    ) {
      hy -= 2;
      isMoving = 1;
    }
    if (
      downHeld() &&
      hy < 3 &&
      isDead === 0 &&
      level === 0 &&
      gameCount > 180
    ) {
      hy += 2;
      isMoving = 1;
    }
    if (
      leftHeld() &&
      hx > -135 &&
      isDead === 0 &&
      level === 0 &&
      gameCount > 180
    ) {
      hx -= 2;
      isMoving = 1;
    }
    if (
      rightHeld() &&
      hx < 3 &&
      isDead === 0 &&
      level === 0 &&
      gameCount > 180
    ) {
      hx += 2;
      isMoving = 1;
    }

    if (
      upHeld() &&
      isDead === 0 &&
      level === 1 &&
      gameCount > 180 &&
      gameBeaten === 0 &&
      hy > -135
    ) {
      hy -= 2;
      isMoving = 1;
    }
    if (
      downHeld() &&
      isDead === 0 &&
      level === 1 &&
      gameCount > 180 &&
      gameBeaten === 0 &&
      hy < 3
    ) {
      hy += 2;
      isMoving = 1;
    }
    if (
      leftHeld() &&
      isDead === 0 &&
      level === 1 &&
      gameCount > 180 &&
      gameBeaten === 0 &&
      hx > -135
    ) {
      hx -= 2;
      isMoving = 1;
    }
    if (
      rightHeld() &&
      isDead === 0 &&
      level === 1 &&
      gameCount > 180 &&
      gameBeaten === 0
    ) {
      hx += 2;
      isMoving = 1;
    }

    if (
      upHeld() &&
      isDead === 0 &&
      level === 2 &&
      gameCount > 180 &&
      gameBeaten === 0
    ) {
      hy += 2;
      isMoving = 1;
    }
    if (
      downHeld() &&
      isDead === 0 &&
      level === 2 &&
      gameCount > 180 &&
      gameBeaten === 0
    ) {
      hy -= 2;
      isMoving = 1;
    }
    if (
      leftHeld() &&
      isDead === 0 &&
      level === 2 &&
      gameCount > 180 &&
      gameBeaten === 0
    ) {
      hx += 2;
      isMoving = 1;
    }
    if (
      rightHeld() &&
      isDead === 0 &&
      level === 2 &&
      gameCount > 180 &&
      gameBeaten === 0
    ) {
      hx -= 2;
      isMoving = 1;
    }

    if (keyIsPressed === false) {
      isMoving = 0;
    }

    keepHeartInBounds();

    noStroke();
    fill(255);
    rect(75, 75, 250, 250);
    fill(0);
    rect(85, 85, 230, 230);

    push();
    scale(1.5);
    translate(hx, hy);
    if (heartState === 0) {
      fill(255, 0, 0);
    }
    if (heartState === 1) {
      fill(0);
    }
    if (heartState === 2) {
      fill(0, 0, 230);
    }
    beginShape();
    vertex(194, 196);
    bezierVertex(194, 196, 197, 190, 200, 196);
    bezierVertex(200, 196, 203, 190, 206, 196);
    vertex(200, 202);
    vertex(194, 196);
    endShape();
    pop();

    textSize(190);
    if (gameCount < 60) {
      fill(100);
      rect(85, 85, 230, 230);
      textAlign(CENTER, CENTER);
      fill(255);
      text("3", 200, 200);
    } else {
      if (gameCount < 120) {
        fill(100);
        rect(85, 85, 230, 230);
        textAlign(CENTER, CENTER);
        fill(255);
        text("2", 200, 200);
      } else {
        if (gameCount < 180) {
          fill(100);
          rect(85, 85, 230, 230);
          textAlign(CENTER, CENTER);
          fill(255);
          text("1", 200, 200);
        }
      }
    }

    if (gameCount > 200 && boneX < 315) {
      fill(0, 0, 230);
      rect(boneX, 85, 10, 230);
      boneX += 1;

      damageIfHit(boneX, 85, 10, 230, 1, true);
    }

    if (gameCount > 300 && bone1X < 315) {
      fill(255);
      rect(bone1X, 85, 10, 115);
      bone1X += 1;

      damageIfHit(bone1X, 85, 10, 115, 1, false);
    }

    if (gameCount > 370 && bone2X < 315) {
      fill(255);
      rect(bone2X, 200, 10, 115);
      bone2X += 1;

      damageIfHit(bone2X, 200, 10, 115, 1, false);
    }

    if (gameCount > 400 && bone2X < 315) {
      fill(255);
      rect(bone2X, 200, 10, 115);
      bone2X += 1;

      damageIfHit(bone2X, 200, 10, 115, 1, false);
    }

    if (gameCount > 500 && bone3X < 315) {
      fill(255);
      rect(bone3X, 85, 130, 175);
      bone3X += 2;

      damageIfHit(bone3X, 85, 130, 175, 1, false);
    }

    if (gameCount > 530 && bone4X < 315) {
      fill(0, 0, 230);
      rect(bone4X, 260, 10, 55);
      bone4X += 3;

      damageIfHit(bone4X, 260, 10, 55, 1, true);
    }

    if (gameCount > 630 && warningXTimer < 30) {
      stroke(255, 0, 0);
      line(200, 85, 200, 315);
      warningXTimer += 1;
      noStroke();
    }

    if (gameCount > 660 && flashXTimer < 20) {
      fill(255);
      rect(flashX, 85, 50, 230);
      flashXTimer += 1;

      damageIfHit(flashX, 85, 50, 230, 1, false);
    }

    if (gameCount > 655 && warning1XTimer < 30) {
      stroke(255, 0, 0);
      line(85, 200, 315, 200);
      warning1XTimer += 1;
      noStroke();
    }

    if (gameCount > 685 && flash1XTimer < 20) {
      fill(255);
      rect(85, flash1Y, 230, 50);
      flash1XTimer += 1;

      damageIfHit(85, flash1Y, 230, 50, 1, false);
    }

    if (gameCount > 675 && warning2XTimer < 30) {
      stroke(255, 0, 0);
      line(85, 270, 315, 270);
      warning2XTimer += 1;
      noStroke();
    }

    if (gameCount > 710 && flash2XTimer < 20) {
      fill(255);
      rect(85, flash2Y, 230, 50);
      flash2XTimer += 1;

      damageIfHit(85, flash2Y, 230, 50, 1, false);
    }

    if (gameCount > 700 && warning3XTimer < 30) {
      stroke(255, 0, 0);
      line(85, 130, 315, 130);
      warning3XTimer += 1;
      noStroke();
    }

    if (gameCount > 710 && flash3XTimer < 20) {
      fill(255);
      rect(85, flash3Y, 230, 50);
      flash3XTimer += 1;

      damageIfHit(85, flash3Y, 230, 50, 1, false);
    }

    if (gameCount > 750 && warning4XTimer < 30) {
      stroke(255, 0, 0);
      line(85, 130, 315, 130);
      warning4XTimer += 1;
      noStroke();
    }

    if (gameCount > 780 && flash4XTimer < 20) {
      fill(255);
      rect(85, 105, 230, 50);
      flash4XTimer += 1;

      damageIfHit(85, 105, 230, 50, 1, false);
    }

    if (gameCount > 760 && warning5XTimer < 30) {
      stroke(255, 0, 0);
      line(85, 200, 315, 200);
      warning5XTimer += 1;
      noStroke();
    }

    if (gameCount > 790 && flash5XTimer < 20) {
      fill(255);
      rect(85, 175, 230, 50);
      flash5XTimer += 1;

      damageIfHit(85, 175, 230, 50, 1, false);
    }

    if (gameCount > 790 && warning6XTimer < 30) {
      stroke(255, 0, 0);
      line(85, 270, 315, 270);
      warning6XTimer += 1;
      noStroke();
    }

    if (gameCount > 820 && flash6XTimer < 20) {
      fill(255);
      rect(85, 245, 230, 50);
      flash6XTimer += 1;

      damageIfHit(85, 245, 230, 50, 1, false);
    }

    if (gameCount > 850 && bone5Y < 315) {
      fill(0, 0, 230);
      rect(bone5Y, 85, 10, 230);
      bone5Y += 3;

      damageIfHit(bone5Y, 85, 10, 230, 1, true);
    }

    if (gameCount > 850 && bone6X > 85) {
      fill(255);
      rect(bone6X, 115, 10, 200);
      bone6X -= 2;

      damageIfHit(bone6X, 115, 10, 200, 1, false);
    }

    if (gameCount > 880 && bone7X < 315) {
      fill(255);
      rect(bone7X, 85, 10, 150);
      bone7X += 2;

      damageIfHit(bone7X, 85, 10, 150, 1, false);
    }

    if (gameCount > 910 && bone8X < 315) {
      fill(255, 0, 0);
      rect(bone8X, 85, 10, 200);
      bone8X += 2;

      damageIfHit(bone8X, 85, 10, 200, 85, false);
    }

    if (gameCount > 930 && warning7XTimer < 40) {
      stroke(255, 0, 0);
      line(85, 200, 315, 200);
      warning7XTimer += 1;
      noStroke();
    }

    if (gameCount > 960 && flash7XTimer < 20) {
      fill(255);
      rect(85, 150, 230, 100);
      flash7XTimer += 1;

      damageIfHit(85, 150, 230, 100, 1, false);
    }

    if (gameCount > 1220 && bone9X < 315) {
      fill(255);
      rect(bone9X, 85, 10, 200);
      bone9X += 2;

      damageIfHit(bone9X, 85, 10, 200, 1, false);
    }

    if (gameCount > 1220 && warning8XTimer < 30) {
      stroke(255, 0, 0);
      line(85, 270, 315, 270);
      warning8XTimer += 1;
      noStroke();
    }

    if (gameCount > 1250 && flash8XTimer < 20) {
      fill(255);
      rect(85, flash7Y, 230, 50);
      flash8XTimer += 1;

      damageIfHit(85, flash2Y, 230, 50, 1, false);
    }

    if (gameCount > 1220 && bone10X < 315) {
      fill(255);
      rect(bone10X, 150, 10, 165);
      bone10X += 2;

      damageIfHit(bone10X, 150, 10, 165, 1, false);
    }

    if (gameCount > 1230 && warning9XTimer < 30) {
      stroke(255, 0, 0);
      line(85, 200, 315, 200);
      warning9XTimer += 1;
      noStroke();
    }

    if (gameCount > 1260 && flash9XTimer < 20) {
      fill(255);
      rect(85, 150, 230, 100);
      flash9XTimer += 1;

      damageIfHit(85, 150, 230, 100, 1, false);
    }

    if (gameCount > 1260 && bone11X < 315) {
      fill(0, 0, 230);
      rect(bone11X, 85, 10, 230);
      bone11X += 3;

      damageIfHit(bone11X, 85, 10, 230, 1, true);
    }

    if (gameCount > 1230 && warning10XTimer < 30) {
      stroke(255, 0, 0);
      line(85, 130, 315, 130);
      warning10XTimer += 1;
      noStroke();
    }

    if (gameCount > 1260 && flash10XTimer < 20) {
      fill(255);
      rect(85, 105, 230, 50);
      flash10XTimer += 1;

      damageIfHit(85, 105, 230, 50, 1, false);
    }

    if (gameCount > 1270 && bone12X < 315) {
      fill(255);
      rect(bone12X, 85, 10, 200);
      bone12X += 2;

      damageIfHit(bone12X, 85, 10, 200, 1, false);
    }

    if (gameCount > 1280 && bone13X < 315) {
      fill(255, 0, 0);
      rect(bone13X, 85, 10, 200);
      bone13X += 2;

      damageIfHit(bone13X, 85, 10, 200, 85, false);
    }

    if (gameCount > 1230 && warning11XTimer < 30) {
      stroke(255, 0, 0);
      line(85, 200, 315, 200);
      warning11XTimer += 1;
      noStroke();
    }

    if (gameCount > 1260 && flash11XTimer < 20) {
      fill(255);
      rect(85, 175, 230, 50);
      flash11XTimer += 1;

      damageIfHit(85, 175, 230, 50, 1, false);
    }

    if (gameCount > 1330 && bone14X < 315) {
      fill(0, 0, 230);
      rect(bone14X, 85, 10, 200);
      bone14X += 3;

      damageIfHit(bone14X, 85, 10, 200, 85, false);
    }

    if (gameCount > 1350 && bone15X < 315) {
      fill(0, 0, 230);
      rect(bone15X, 150, 10, 165);
      bone15X += 10;

      damageIfHit(bone15X, 150, 10, 165, 1, false);
    }

    if (gameCount > 1730 && bone16X < 315) {
      fill(255, 0, 0);
      rect(bone16X, 85, 10, 100);
      bone16X += 3;

      damageIfHit(bone16X, 85, 10, 100, 85, false);
    }

    if (gameCount > 1730 && bone17X < 315) {
      fill(255, 0, 0);
      rect(bone17X, 210, 10, 105);
      bone17X += 3;

      damageIfHit(bone17X, 210, 10, 105, 85, false);
    }

    if (gameCount > 1850 && bone18X < 315) {
      fill(255, 0, 0);
      rect(bone18X, 85, 10, 150);
      bone18X += 3;

      damageIfHit(bone18X, 85, 10, 150, 85, false);
    }

    if (gameCount > 1850 && bone19X < 315) {
      fill(255, 0, 0);
      rect(bone19X, 260, 10, 55);
      bone19X += 3;

      damageIfHit(bone19X, 260, 10, 55, 85, false);
    }

    fill(0);
    rect(325, 0, 325, 400);
    rect(0, 0, 75, 400);

    if (gameCount < 300) {
      fill(255);
      textSize(20);
      textAlign(CENTER, CENTER);
      text("You can't win.", 200, 40);
    }

    if (gameCount > 300 && gameCount < 600) {
      fill(255);
      textSize(20);
      textAlign(CENTER, CENTER);
      text("If you don't stop...", 200, 40);
    }

    if (gameCount > 600 && gameCount < 800) {
      fill(255);
      textSize(20);
      textAlign(CENTER, CENTER);
      text("Then you'll have a BAD TIME.", 200, 40);
    }

    if (gameCount > 800 && gameCount < 900) {
      fill(255);
      textSize(20);
      textAlign(CENTER, CENTER);
      text("Back to the bones!", 200, 40);
    }

    if (gameCount > 900 && gameCount < 1000) {
      fill(255);
      textSize(20);
      textAlign(CENTER, CENTER);
      text("Beware of the red bone...", 200, 40);
    }

    if (gameCount > 1000 && gameCount < 1060) {
      fill(255);
      textSize(20);
      textAlign(CENTER, CENTER);
      text("Y... you survived?!", 200, 40);
    }

    if (gameCount > 1060 && gameCount < 1120) {
      fill(255);
      textSize(20);
      textAlign(CENTER, CENTER);
      text("B...but how?!", 200, 40);
    }

    if (gameCount > 1120 && gameCount < 1200) {
      fill(255);
      textSize(20);
      textAlign(CENTER, CENTER);
      text("It seems I have to unleash...", 200, 40);
    }

    if (gameCount > 1200 && gameCount < 1400) {
      fill(255);
      textSize(20);
      textAlign(CENTER, CENTER);
      text("my SECRET WEAPON!", 200, 40);
    }

    if (gameCount > 1400 && gameCount < 1500) {
      fill(255);
      textSize(20);
      textAlign(CENTER, CENTER);
      text("Hmph... How did you not", 200, 40);
    }

    if (gameCount > 1500 && gameCount < 1600) {
      fill(255);
      textSize(20);
      textAlign(CENTER, CENTER);
      text("fall for that?", 200, 40);
    }

    if (gameCount > 1600 && gameCount < 1700) {
      fill(255);
      textSize(20);
      textAlign(CENTER, CENTER);
      text("I'll obscure the heart.", 200, 40);
      heartState = 1;
    }

    if (gameCount > 1780 && gameCount < 1820) {
      fill(255);
      textSize(20);
      textAlign(CENTER, CENTER);
      text("GAHHHHHH!", 200, 40);
      heartState = 2;
      level = 2;
    }

    if (gameCount > 1820) {
      fill(255);
      textSize(20);
      textAlign(CENTER, CENTER);
      text("You will still never win.", 200, 40);
      textSize(25);
      text("X", 380, 20);
    }

    fill(255);
    rect(115, 340, 265, 40);
    fill(0);
    rect(120, 345, 255, 30);
    fill(255, 0, 0);
    rect(120, 345, health * 3, 30);
    textSize(20);
    fill(255);
    text(health + " / 85", 60, 360);

    if (health <= 0) {
      isDead = 1;
      health = 0;
    }

    if (isDead === 1) {
      hx = -67;
      hy = -65;
      fill(0);
      rect(198, 193, 4, 13);
      isDeadTimer += 1;
      health = 0;
    }
    if (isDead === 1 && isDeadTimer > 50) {
      rect(0, 0, 400, 400);
      fill(255);
      textSize(40);
      textAlign(CENTER, CENTER);
      text("YOU DIED", 200, 35);
      stroke("white");
      fill(255);
      line(0, 70, 400, 70);
      noStroke();
      textAlign(LEFT);
      textSize(20);
      text("Designed by: Reformatsky", 10, 90);
      text('Press the "menu" button to go back ', 10, 120);
      text("to the menu.", 10, 150);

      fill(255);
      rect(150, 260, 100, 50);
      fill(0);
      rect(155, 265, 90, 40);
      fill(255);
      textSize(20);
      textAlign(CENTER, CENTER);
      text("M E N U", 200, 285);

      if (mouseX > 150 && mouseY > 260 && mouseX < 250 && mouseY < 310) {
        fill(255);
        rect(150, 260, 100, 50);
        rect(155, 265, 90, 40);
        fill(0);
        textSize(20);
        textAlign(CENTER, CENTER);
        text("M E N U", 200, 285);
      }

      if (
        mouseX > 150 &&
        mouseY > 260 &&
        mouseX < 250 &&
        mouseY < 310 &&
        mouseIsPressed
      ) {
        goMenu();
      }
    }

    if (trueX > 360 && trueY < 40) {
      fill(0);
      rect(0, 0, 400, 400);
      fill(255);
      textSize(40);
      textAlign(CENTER, CENTER);
      text("YOU WON", 200, 35);
      stroke("white");
      fill(255);
      line(0, 70, 400, 70);
      noStroke();
      textAlign(LEFT);
      textSize(20);
      text("How did you win? It's almost 99.9% ", 10, 90);
      text("impossible! Check out my other 'aw-", 10, 120);
      text("esome' games!", 10, 150);
      text("Designed by: Reformatsky", 10, 210);
      gameBeaten = 1;

      fill(255);
      rect(150, 260, 100, 50);
      fill(0);
      rect(155, 265, 90, 40);
      fill(255);
      textSize(20);
      textAlign(CENTER, CENTER);
      text("M E N U", 200, 285);

      if (mouseX > 150 && mouseY > 260 && mouseX < 250 && mouseY < 310) {
        fill(255);
        rect(150, 260, 100, 50);
        rect(155, 265, 90, 40);
        fill(0);
        textSize(20);
        textAlign(CENTER, CENTER);
        text("M E N U", 200, 285);
      }

      if (
        mouseX > 150 &&
        mouseY > 260 &&
        mouseX < 250 &&
        mouseY < 310 &&
        mouseIsPressed
      ) {
        goMenu();
      }
    }
  }

  if (gameState === 0) {
    fill(0);
    rect(0, 0, 400, 400);
    titleCount += 1;

    if (titleCount > 10) {
      fill(255);
      textSize(50);
      textAlign(CENTER, CENTER);
      text("B A D", 200, 50);
    }

    if (titleCount > 30) {
      fill(255);
      textSize(50);
      textAlign(CENTER, CENTER);
      text("T I M E", 200, 100);
    }

    if (titleCount > 40) {
      fill(255);
      textSize(50);
      textAlign(CENTER, CENTER);
      text(".", 185, 150);
    }

    if (titleCount > 50) {
      fill(255);
      textSize(50);
      textAlign(CENTER, CENTER);
      text(".", 200, 150);
    }

    if (titleCount > 60) {
      fill(255);
      textSize(50);
      textAlign(CENTER, CENTER);
      text(".", 215, 150);
    }

    if (titleCount > 80) {
      rect(150, 260, 100, 50);
      fill(0);
      rect(155, 265, 90, 40);
      fill(255);
      textSize(20);
      text("NOT AS EASY AS IT LOOKS", 200, 380);
      fill(255, 0, 0);
      text("IMPOSSIBLE MODE", 200, 140);
    }

    if (titleCount > 70) {
      fill(255);
      rect(150, 260, 100, 50);
      fill(0);
      rect(155, 265, 90, 40);
      fill(255);
      textSize(20);
      text("P L A Y", 200, 285);

      fill(255);
      textSize(25);
      textAlign(CENTER, CENTER);
      text("?", 380, 380);
      text("★", 20, 380);
      text("♚", 20, 20);

      if (
        mouseIsPressed &&
        mouseX > 360 &&
        mouseY > 360 &&
        openInstructions === 0
      ) {
        openInstructions = 1;
      }

      if (mouseIsPressed && mouseX < 40 && mouseY > 360 && openInfo === 0) {
        openInfo = 1;
      }

      if (mouseIsPressed && mouseX < 40 && mouseY < 40 && openAc === 0) {
        openAc = 1;
      }
    }

    if (
      mouseX > 150 &&
      mouseY > 260 &&
      mouseX < 250 &&
      mouseY < 310 &&
      titleCount > 70
    ) {
      fill(255);
      rect(150, 260, 100, 50);
      rect(155, 265, 90, 40);
      fill(0);
      textSize(20);
      text("P L A Y", 200, 285);
    }

    if (openInstructions === 1) {
      fill(0);
      rect(0, 0, 400, 400);
      fill(255);
      textSize(40);
      textAlign(CENTER, CENTER);
      text("INSTRUCTIONS", 200, 35);
      textSize(25);
      text("X", 380, 20);
      stroke("white");
      line(0, 70, 400, 70);
      noStroke();
      textAlign(LEFT);
      textSize(20);
      text("Don't move when blue bones pass th-", 10, 90);
      text("rough you. Move away from the whit-", 10, 120);
      text("e bones. Move away from the white f", 10, 150);
      text("-lashes.", 10, 180);
      text("Use arrow keys or WASD to move.", 10, 240);
      text("Click buttons with mouse/touch.", 10, 270);
      text("Made by: Reformatsky", 10, 330);

      if (
        mouseIsPressed &&
        mouseX > 360 &&
        mouseY < 40 &&
        openInstructions === 1
      ) {
        openInstructions = 0;
      }
    }

    if (openInfo === 1) {
      fill(0);
      rect(0, 0, 400, 400);
      fill(255);
      textSize(40);
      textAlign(CENTER, CENTER);
      text("INFORMATION", 200, 35);
      textSize(25);
      text("X", 380, 20);
      stroke("white");
      line(0, 70, 400, 70);
      noStroke();
      textAlign(LEFT);
      textSize(20);
      text("Difficulty: Impossible", 10, 90);
      text("There are glitched damage sprites a", 10, 120);
      text("-nd near impossible dodging to do. ", 10, 150);
      text("Lucky you still have a health bar. ", 10, 180);
      text("By the way, this game is officially", 10, 240);
      text("finished!", 10, 270);

      if (mouseIsPressed && mouseX > 360 && mouseY < 40 && openInfo === 1) {
        openInfo = 0;
      }
    }

    if (openAc === 1) {
      fill(0);
      rect(0, 0, 400, 400);
      fill(255);
      textSize(40);
      textAlign(CENTER, CENTER);
      text("ACHIEVEMENTS", 200, 35);
      textSize(25);
      text("X", 380, 20);
      stroke("white");
      line(0, 70, 400, 70);
      noStroke();
      textAlign(LEFT);
      textSize(20);
      text("Beat the game!", 10, 90);

      if (gameBeaten === 1) {
        text("STATUS: UNLOCKED", 10, 120);
      } else {
        text("STATUS: LOCKED", 10, 120);
      }

      text("Have above 50% health.", 10, 180);

      if (health > 42 && gameBeaten === 1) {
        text("STATUS: UNLOCKED", 10, 210);
      } else {
        text("STATUS: LOCKED", 10, 210);
      }

      text("That's all for now!", 10, 270);

      if (mouseIsPressed && mouseX > 360 && mouseY < 40 && openAc === 1) {
        openAc = 0;
      }
    }
  }

  if (health > 85) {
    health = 85;
  }
}

p.keyPressed = function() {
  keys[key.toString().toLowerCase()] = true;
  keys[keyCode] = true;

  if (keyCode === ENTER) {
    heartState = 0;
  }

  if ([UP_ARROW, DOWN_ARROW, LEFT_ARROW, RIGHT_ARROW, 32, ENTER].indexOf(keyCode) !== -1) {
    return false;
  }
};
p.keyReleased = function() {
  delete keys[keyCode];
  delete keys[key.toString().toLowerCase()];

  if ([UP_ARROW, DOWN_ARROW, LEFT_ARROW, RIGHT_ARROW, 32, ENTER].indexOf(keyCode) !== -1) {
    return false;
  }
};
p.mousePressed = function() {
  if (
    mouseX > 150 &&
    mouseY > 260 &&
    mouseX < 250 &&
    mouseY < 310 &&
    titleCount > 70 &&
    gameState === 0
  ) {
    startGame();
  }
};


      }
    }, holder);
  }

  function waitForP5() {
    if (window.p5) {
      startBadTimeGame();
      return;
    }

    tries += 1;

    if (tries < 200) {
      setTimeout(waitForP5, 50);
    } else {
      statusText("p5 did not load. Check that the p5.js script is included before this game file.");
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", waitForP5);
  } else {
    waitForP5();
  }
})();
