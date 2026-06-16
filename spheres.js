/*
  spheres_blogger_compatible.js

  Blogger-compatible p5 instance-mode wrapper for the user's SPHERES sketch.

  Required Blogger HTML:
    <div id="spheres-game"><div id="spheres-status">loading Spheres...</div></div>

  Required theme scripts before </body>:
    <script type='text/javascript' src='https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.4/p5.min.js'></script>
    <script type='text/javascript' src='https://YOURUSERNAME.github.io/YOURREPO/spheres.js?v=1'></script>
*/

(function () {
  var CONTAINER_ID = "spheres-game";
  var STATUS_ID = "spheres-status";
  var started = false;
  var tries = 0;

  function statusText(text) {
    var s = document.getElementById(STATUS_ID);
    if (s) s.textContent = text;
  }

  function startSpheresGame() {
    var holder = document.getElementById(CONTAINER_ID);

    if (!holder) {
      // This file can be loaded site-wide in Blogger.
      // If this page has no Spheres container, silently stop.
      return;
    }

    if (started || holder.__spheresStarted) return;
    started = true;
    holder.__spheresStarted = true;

    statusText("p5 loaded. starting Spheres...");

    new p5(function (p) {
      // Run the original global-mode sketch inside this p5 instance.
      // This avoids setup()/draw() collisions with Blogger or other games.
      with (p) {
/*
SPHERES - responsive refined version with grades + difficulty screen + countdown

Features:
- No scale() wrapper. The app uses real responsive coordinates.
- Website/container responsive.
- Mouse + touchscreen compatible.
- Title screen shows ONLY the play button.
- Press play -> difficulty select screen.
- Press a mode -> 3, 2, 1 countdown -> game starts.
- Pressing a mode again during countdown/play restarts the countdown with that mode.
- Hits are graded: PERFECT, GOOD, BAD, MISS.
- The inner circle reaches max exactly when the bar reaches the sphere centre.

Embed:
<div id="spheres-game" style="width:100%; max-width:760px; margin:0 auto;"></div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.4/p5.min.js"></script>
<script src="spheres_responsive_grades_countdown.js"></script>
*/

let gameCanvas;
let layout;

let screenState = "title"; // "title", "select", "countdown", "play", "win", "lose"
let fadeTitle = 0;
let fadeSubtitle = 0;

let difficultyName = "easy";
let difficulty = null;

let barY = 0;
let barDirection = 1; // 1 = down, -1 = up

let activeSphere = null;
let spawnCooldown = 0;
let spawnLock = false;

let hits = 0;
let attempts = 0;
let runFrames = 0;

let messageTimer = 0;
let lastMessage = "";

let countdownFrames = 0;
const COUNTDOWN_SECONDS = 3;

const DIFFICULTIES = {
  easy: {
    label: "EASY",
    speedScale: 2,
    offsetScale: 12.5,
    winTimeSeconds: 25,
    winAccuracy: 90,
    loseAccuracy: 30,
    minAttemptsForLose: 6
  },
  normal: {
    label: "NORMAL",
    speedScale: 3,
    offsetScale: 10,
    winTimeSeconds: 22,
    winAccuracy: 90,
    loseAccuracy: 30,
    minAttemptsForLose: 6
  },
  hard: {
    label: "HARD",
    speedScale: 4,
    offsetScale: 7.5,
    winTimeSeconds: 20,
    winAccuracy: 90,
    loseAccuracy: 30,
    minAttemptsForLose: 7
  }
};

function clamp(v, lo, hi) {
  return Math.max(lo, Math.min(hi, v));
}

function holderWidth() {
  const holder = document.getElementById("spheres-game");
  if (holder && holder.clientWidth > 0) return holder.clientWidth;
  if (document.body && document.body.clientWidth > 0) return document.body.clientWidth;
  return windowWidth || 400;
}

function desiredCanvasSize() {
  const parentW = holderWidth();
  const w = Math.floor(clamp(parentW, 300, 760));
  const h = Math.floor(clamp(w * 1.25, 500, 820));
  return { w, h };
}

function computeLayout() {
  const margin = Math.max(14, Math.floor(width * 0.04));
  const titleSize = Math.floor(clamp(width * 0.15, 42, 78));
  const subtitleSize = Math.floor(clamp(width * 0.085, 24, 42));

  const bottomMenuH = Math.floor(clamp(height * 0.19, 92, 130));
  const topLine = Math.floor(clamp(height * 0.045, 18, 30));
  const fieldTop = topLine;
  const fieldBottom = height - bottomMenuH - Math.floor(clamp(height * 0.04, 16, 28));
  const menuTop = fieldBottom + Math.floor(clamp(height * 0.035, 14, 24));

  const fieldH = fieldBottom - fieldTop;

  const sphereSize = Math.floor(clamp(Math.min(width, fieldH) * 0.12, 32, 58));
  const clickRadius = sphereSize * 0.58;

  return {
    margin,
    titleSize,
    subtitleSize,
    fieldTop,
    fieldBottom,
    fieldH,
    menuTop,
    sphereSize,
    clickRadius,
    playButtonR: Math.floor(clamp(width * 0.18, 62, 92)),
    playX: width / 2,
    playY: height * 0.68,
    scoreY: fieldTop + fieldH * 0.44,
    messageY: fieldTop + fieldH * 0.62
  };
}

function setup() {
  const __spheresStatus = document.getElementById('spheres-status');
  if (__spheresStatus) __spheresStatus.remove();
  pixelDensity(Math.min(2, window.devicePixelRatio || 1));

  const canvasDims = desiredCanvasSize();
  gameCanvas = createCanvas(canvasDims.w, canvasDims.h);

  const holder = document.getElementById("spheres-game");
  if (holder) gameCanvas.parent(holder);

  gameCanvas.elt.style.display = "block";
  gameCanvas.elt.style.margin = "0 auto";
  gameCanvas.elt.style.maxWidth = "100%";
  gameCanvas.elt.style.touchAction = "none";

  textFont("monospace");
  layout = computeLayout();

  setDifficulty("easy");
  resetRun();
  screenState = "title";
}

function windowResized() {
  const canvasDims = desiredCanvasSize();
  resizeCanvas(canvasDims.w, canvasDims.h);

  layout = computeLayout();

  barY = clamp(barY, layout.fieldTop, layout.fieldBottom);

  if (activeSphere) {
    activeSphere.x = clamp(activeSphere.x, layout.margin + layout.sphereSize / 2, width - layout.margin - layout.sphereSize / 2);
    activeSphere.y = clamp(activeSphere.y, layout.fieldTop + layout.sphereSize / 2, layout.fieldBottom - layout.sphereSize / 2);
  }
}

function setDifficulty(name) {
  difficultyName = name;
  difficulty = DIFFICULTIES[name];
}

function resetRun() {
  hits = 0;
  attempts = 0;
  runFrames = 0;
  messageTimer = 0;
  lastMessage = "";

  barY = layout ? layout.fieldTop : 20;
  barDirection = 1;

  activeSphere = null;
  spawnCooldown = 45;
  spawnLock = false;
}

function goToDifficultySelect() {
  resetRun();
  screenState = "select";
}

function startCountdown(name) {
  if (name) setDifficulty(name);

  resetRun();
  countdownFrames = COUNTDOWN_SECONDS * 60;
  screenState = "countdown";
}

function beginPlayFromCountdown() {
  resetRun();
  screenState = "play";
}

function draw() {
  const canvasDims = desiredCanvasSize();
  if (canvasDims.w !== width || canvasDims.h !== height) {
    resizeCanvas(canvasDims.w, canvasDims.h);
    layout = computeLayout();
  }

  cursor(CROSS);
  background(0);
  textFont("monospace");
  textAlign(CENTER, CENTER);

  if (screenState === "title") drawTitleScreen();
  if (screenState === "select") drawDifficultySelectScreen();
  if (screenState === "countdown") drawCountdownScreen();
  if (screenState === "play") drawGameScreen();
  if (screenState === "win") drawEndScreen(true);
  if (screenState === "lose") drawEndScreen(false);
}

function drawTitleScreen() {
  noStroke();

  fadeTitle = min(255, fadeTitle + 5);
  fill(255, fadeTitle);
  textStyle(BOLD);
  textSize(layout.titleSize);
  text("SPHERES", width / 2, height * 0.20);

  if (fadeTitle > 200) {
    fadeSubtitle = min(255, fadeSubtitle + 5);
    fill(255, fadeSubtitle);
    textSize(layout.subtitleSize);
    text("THE GAME", width / 2, height * 0.30);
  }

  if (fadeSubtitle > 200) {
    drawPlayButton();

    fill(200);
    noStroke();
    textStyle(NORMAL);
    textSize(clamp(width * 0.035, 11, 16));
    text("tap play to choose difficulty", width / 2, height * 0.83);
  }
}

function drawDifficultySelectScreen() {
  noStroke();
  fill(255);
  textStyle(BOLD);
  textSize(clamp(width * 0.105, 34, 58));
  text("Choose Mode", width / 2, height * 0.26);

  textStyle(NORMAL);
  textSize(clamp(width * 0.038, 13, 19));
  fill(200);
  text("press a difficulty to begin", width / 2, height * 0.36);

  drawDifficultyButtons(false);

  fill(170);
  textSize(clamp(width * 0.030, 11, 15));
  text("PERFECT / GOOD count as hits. BAD and MISS count as misses.", width / 2, height * 0.58);
}

function drawCountdownScreen() {
  // Keep the playfield visible during countdown so it feels like the game is about to begin.
  drawPlayfield();
  drawDifficultyButtons(true);

  const secondsLeft = ceil(countdownFrames / 60);

  fill(255);
  noStroke();
  textStyle(BOLD);
  textSize(clamp(width * 0.23, 82, 150));
  text(secondsLeft, width / 2, layout.fieldTop + layout.fieldH * 0.46);

  textStyle(NORMAL);
  textSize(clamp(width * 0.045, 16, 26));
  text(DIFFICULTIES[difficultyName].label + " MODE", width / 2, layout.fieldTop + layout.fieldH * 0.68);

  countdownFrames--;

  if (countdownFrames <= 0) {
    beginPlayFromCountdown();
  }
}

function drawPlayButton() {
  const hovering = dist(mouseX, mouseY, layout.playX, layout.playY) <= layout.playButtonR;

  stroke(255);
  strokeWeight(max(3, width * 0.008));
  fill(hovering ? 255 : 0);
  ellipse(layout.playX, layout.playY, layout.playButtonR * 2);

  noStroke();
  fill(hovering ? 0 : 255);

  const s = layout.playButtonR;
  triangle(
    layout.playX - s * 0.35, layout.playY - s * 0.55,
    layout.playX - s * 0.35, layout.playY + s * 0.55,
    layout.playX + s * 0.52, layout.playY
  );
}

function drawGameScreen() {
  runFrames++;

  updateBar();
  updateSphere();

  drawPlayfield();
  drawScore();
  drawSphere();
  drawBar();
  drawDifficultyButtons(true);
  drawMessage();

  checkWinLose();
}

function drawPlayfield() {
  noFill();
  stroke(255);
  strokeWeight(2);

  line(0, layout.fieldTop, width, layout.fieldTop);
  line(0, layout.fieldBottom, width, layout.fieldBottom);
  line(0, layout.menuTop, width, layout.menuTop);

  line(width / 3, layout.menuTop, width / 3, height);
  line(2 * width / 3, layout.menuTop, 2 * width / 3, height);
}

function drawScore() {
  const acc = getAccuracy();

  noStroke();
  fill(255);
  textStyle(BOLD);
  textSize(clamp(width * 0.13, 42, 60));

  const displayed = attempts === 0 ? "100%" : round(acc) + "%";
  text(displayed, width / 2, layout.scoreY);

  textStyle(NORMAL);
  textSize(clamp(width * 0.035, 12, 17));
  text("hits: " + hits + " / attempts: " + attempts, width / 2, layout.scoreY + clamp(height * 0.07, 35, 55));
}

function drawBar() {
  stroke(255);
  strokeWeight(max(3, width * 0.006));
  line(0, barY, width, barY);
}

function drawSphere() {
  if (!activeSphere) return;

  // Inner circle reaches max exactly when the bar reaches the sphere centre.
  const travelDistance = max(1, activeSphere.travelDistance || abs(activeSphere.y - activeSphere.startBarY));
  const distanceFromCenter = abs(barY - activeSphere.y);
  const progress = constrain(1 - distanceFromCenter / travelDistance, 0, 1);
  const innerSize = layout.sphereSize * progress;

  stroke(255);
  strokeWeight(max(2, width * 0.006));
  fill(0);
  ellipse(activeSphere.x, activeSphere.y, layout.sphereSize);

  noStroke();
  fill(255);
  ellipse(activeSphere.x, activeSphere.y, innerSize);
}

function drawDifficultyButtons(isGame) {
  noStroke();
  textStyle(BOLD);
  textSize(clamp(width * 0.06, 20, 31));

  const labels = [
    { name: "easy", x: width / 6 },
    { name: "normal", x: width / 2 },
    { name: "hard", x: 5 * width / 6 }
  ];

  for (const item of labels) {
    const selected = difficultyName === item.name;
    const hovering = mouseX > buttonLeft(item.name) && mouseX < buttonRight(item.name) && mouseY > layout.menuTop && mouseY < height;

    if (selected) {
      fill(255);
      rect(buttonLeft(item.name), layout.menuTop, width / 3, height - layout.menuTop);
      fill(0);
    } else {
      fill(hovering ? 190 : 255);
    }

    text(DIFFICULTIES[item.name].label, item.x, layout.menuTop + (height - layout.menuTop) * 0.48);
  }

  textStyle(NORMAL);
  textSize(clamp(width * 0.025, 9, 13));

  fill(difficultyName === "easy" ? 0 : 180);
  text("slow", width / 6, layout.menuTop + (height - layout.menuTop) * 0.73);

  fill(difficultyName === "normal" ? 0 : 180);
  text("medium", width / 2, layout.menuTop + (height - layout.menuTop) * 0.73);

  fill(difficultyName === "hard" ? 0 : 180);
  text("strict", 5 * width / 6, layout.menuTop + (height - layout.menuTop) * 0.73);
}

function drawMessage() {
  if (messageTimer <= 0) return;

  messageTimer--;

  noStroke();
  textStyle(BOLD);
  textSize(clamp(width * 0.075, 24, 42));

  let alpha = map(messageTimer, 0, 45, 0, 255);
  if (lastMessage === "PERFECT") fill(255, 255, 255, alpha);
  else if (lastMessage === "GOOD") fill(210, 210, 210, alpha);
  else if (lastMessage === "BAD") fill(150, 150, 150, alpha);
  else fill(255, alpha);

  text(lastMessage, width / 2, layout.messageY);
}

function drawEndScreen(won) {
  noStroke();
  fill(255);
  textStyle(BOLD);
  textSize(clamp(width * 0.11, 36, 62));

  if (won) {
    text("You Win!", width / 2, height * 0.34);
    textStyle(NORMAL);
    textSize(clamp(width * 0.055, 19, 32));

    if (difficultyName === "easy") text("(On Easy Mode)", width / 2, height * 0.47);
    if (difficultyName === "normal") text("On Normal Mode", width / 2, height * 0.47);
    if (difficultyName === "hard") text("On Hard Mode (Wow!)", width / 2, height * 0.47);
  } else {
    text("You Lost...", width / 2, height * 0.37);
    textStyle(NORMAL);
    textSize(clamp(width * 0.045, 16, 25));
    text("tap play to try again", width / 2, height * 0.49);
  }

  drawPlayButton();
}

function updateBar() {
  const speed = currentSpeed();

  barY += speed * barDirection;

  if (barY >= layout.fieldBottom) {
    barY = layout.fieldBottom;
    barDirection = -1;
    spawnLock = false;
  }

  if (barY <= layout.fieldTop) {
    barY = layout.fieldTop;
    barDirection = 1;
    spawnLock = false;
  }
}

function updateSphere() {
  if (spawnCooldown > 0) {
    spawnCooldown--;
  }

  if (!activeSphere && spawnCooldown <= 0 && !spawnLock) {
    maybeSpawnSphere();
  }

  if (!activeSphere) return;

  const off = currentOffset();

  if (barDirection === 1 && barY > activeSphere.y + off) {
    registerMiss("MISS");
  }

  if (barDirection === -1 && barY < activeSphere.y - off) {
    registerMiss("MISS");
  }
}

function maybeSpawnSphere() {
  const safeGap = layout.sphereSize * 2.2;
  const margin = layout.margin + layout.sphereSize / 2;

  let minY;
  let maxY;

  if (barDirection === 1) {
    minY = barY + safeGap;
    maxY = layout.fieldBottom - layout.sphereSize / 2;
  } else {
    minY = layout.fieldTop + layout.sphereSize / 2;
    maxY = barY - safeGap;
  }

  if (maxY <= minY) return;

  const sphereY = random(minY, maxY);

  activeSphere = {
    x: random(margin, width - margin),
    y: sphereY,
    spawnFrame: frameCount,
    startBarY: barY,
    travelDistance: abs(sphereY - barY)
  };

  spawnLock = true;
}

function handlePress() {
  if (screenState === "title") {
    if (fadeSubtitle > 200 && playButtonHit(mouseX, mouseY)) {
      goToDifficultySelect();
      return false;
    }
  }

  if (screenState === "select") {
    const diff = difficultyHit(mouseX, mouseY);
    if (diff) {
      startCountdown(diff);
      return false;
    }
  }

  if (screenState === "countdown") {
    const diff = difficultyHit(mouseX, mouseY);
    if (diff) {
      startCountdown(diff);
      return false;
    }
  }

  if (screenState === "win" || screenState === "lose") {
    if (playButtonHit(mouseX, mouseY)) {
      goToDifficultySelect();
      return false;
    }
  }

  if (screenState === "play") {
    const diff = difficultyHit(mouseX, mouseY);
    if (diff) {
      startCountdown(diff);
      return false;
    }

    if (activeSphere && dist(mouseX, mouseY, activeSphere.x, activeSphere.y) <= layout.clickRadius) {
      gradeSphereTap();
      return false;
    }

    if (activeSphere && mouseY >= layout.fieldTop && mouseY <= layout.fieldBottom) {
      registerMiss("MISS");
      return false;
    }
  }

  return false;
}

function gradeSphereTap() {
  if (!activeSphere) return;

  const timingError = abs(barY - activeSphere.y);
  const off = currentOffset();

  // Timing windows:
  // PERFECT = extremely close to centre.
  // GOOD = still clearly on time.
  // BAD = tapped the sphere, but noticeably early/late.
  // MISS = bar already outside the accepted hit window.
  if (timingError <= off * 0.25) {
    registerHit("PERFECT");
  } else if (timingError <= off * 0.60) {
    registerHit("GOOD");
  } else if (timingError <= off) {
    registerBad();
  } else {
    registerMiss("MISS");
  }
}

function mousePressed() {
  return handlePress();
}

function touchStarted() {
  handlePress();
  return false;
}

function touchMoved() {
  return false;
}

function playButtonHit(x, y) {
  return dist(x, y, layout.playX, layout.playY) <= layout.playButtonR;
}

function difficultyHit(x, y) {
  if (y < layout.menuTop || y > height) return null;

  if (x >= 0 && x < width / 3) return "easy";
  if (x >= width / 3 && x < 2 * width / 3) return "normal";
  if (x >= 2 * width / 3 && x <= width) return "hard";

  return null;
}

function buttonLeft(name) {
  if (name === "easy") return 0;
  if (name === "normal") return width / 3;
  return 2 * width / 3;
}

function buttonRight(name) {
  return buttonLeft(name) + width / 3;
}

function currentSpeed() {
  return max(1, (layout.fieldH / 360) * difficulty.speedScale);
}

function currentOffset() {
  return max(4, (layout.fieldH / 360) * difficulty.offsetScale);
}

function getAccuracy() {
  if (attempts === 0) return 100;
  return (hits / attempts) * 100;
}

function registerHit(label) {
  hits++;
  attempts++;
  clearSphereAfterAttempt();
  lastMessage = label || "GOOD";
  messageTimer = 45;
}

function registerBad() {
  attempts++;
  clearSphereAfterAttempt();
  lastMessage = "BAD";
  messageTimer = 45;
}

function registerMiss(label) {
  attempts++;
  clearSphereAfterAttempt();
  lastMessage = label || "MISS";
  messageTimer = 45;
}

function clearSphereAfterAttempt() {
  activeSphere = null;
  spawnCooldown = round(random(30, 65));
  spawnLock = false;
}

function checkWinLose() {
  const acc = getAccuracy();
  const seconds = runFrames / 60;

  if (
    attempts >= difficulty.minAttemptsForLose &&
    acc < difficulty.loseAccuracy
  ) {
    screenState = "lose";
    activeSphere = null;
    return;
  }

  if (
    seconds >= difficulty.winTimeSeconds &&
    attempts >= 10 &&
    acc > difficulty.winAccuracy
  ) {
    screenState = "win";
    activeSphere = null;
  }
}


        // Expose the p5 callbacks to this instance.
        p.setup = setup;
        p.draw = draw;
        p.windowResized = windowResized;
        p.mousePressed = mousePressed;
        p.touchStarted = touchStarted;
        p.touchMoved = touchMoved;
      }
    }, holder);
  }

  function waitForReady() {
    tries++;

    var holder = document.getElementById(CONTAINER_ID);

    if (!holder) {
      if (tries < 50) setTimeout(waitForReady, 100);
      return;
    }

    if (typeof window.p5 === "undefined") {
      statusText("waiting for p5...");
      if (tries > 100) {
        statusText("p5 failed to load. Check the p5 CDN script in your Blogger theme.");
        console.error("p5 is not defined after waiting.");
        return;
      }
      setTimeout(waitForReady, 100);
      return;
    }

    startSpheresGame();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", waitForReady);
  } else {
    waitForReady();
  }
})();
