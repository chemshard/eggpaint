(() => {
  "use strict";

  const WORLD_W = 800;
  const WORLD_H = 600;
  const UI_X = 600;
  const PLAY_W = UI_X;
  const PATH_RADIUS = 26;
  const TOWER_RADIUS = 18;
  const MAX_TOWERS = 12;
  const TOTAL_WAVES = 12;

  let canvas;
  let worldScale = 1;

  let pathPoints = [];
  let enemies = [];
  let towers = [];
  let effects = [];
  let buttons = [];

  let selectedBuild = null;
  let selectedTower = null;
  let hoverWorld = null;

  let money = 275;
  let baseHealth = 15;
  let waveNumber = 0;
  let spawnQueue = [];
  let spawnTimer = 0;
  let waveActive = false;
  let gameState = "playing"; // playing | won | lost
  let message = "Pick a tower, then place it away from the path.";

  let lastInputFrame = -999;

  const towerTypes = [
    {
      id: "basic",
      name: "Basic",
      cost: 85,
      range: 105,
      reload: 32,
      damage: 1,
      color: [65, 105, 225],
      desc: "balanced"
    },
    {
      id: "fast",
      name: "Fast",
      cost: 125,
      range: 80,
      reload: 16,
      damage: 0.65,
      color: [45, 180, 90],
      desc: "quick shots"
    },
    {
      id: "sniper",
      name: "Sniper",
      cost: 175,
      range: 165,
      reload: 58,
      damage: 3,
      color: [225, 80, 75],
      desc: "big range"
    }
  ];

  const enemyTypes = [
    {
      id: "grunt",
      name: "Grunt",
      speed: 1.15,
      health: 4,
      reward: 9,
      radius: 10,
      color: [220, 60, 60]
    },
    {
      id: "runner",
      name: "Runner",
      speed: 1.85,
      health: 3,
      reward: 12,
      radius: 8,
      color: [65, 185, 80]
    },
    {
      id: "tank",
      name: "Tank",
      speed: 0.75,
      health: 13,
      reward: 25,
      radius: 13,
      color: [70, 110, 225]
    },
    {
      id: "boss",
      name: "Boss",
      speed: 0.62,
      health: 45,
      reward: 75,
      radius: 18,
      color: [125, 70, 170]
    }
  ];

  class Enemy {
    constructor(type, wave) {
      this.type = type;
      this.pos = pathPoints[0].copy();
      this.targetIndex = 1;

      const waveBoost = wave - 1;
      this.speed = type.speed + waveBoost * 0.035;
      this.maxHealth = Math.ceil(type.health + waveBoost * 2.2);
      this.health = this.maxHealth;
      this.reward = Math.ceil(type.reward + waveBoost * 1.5);
      this.radius = type.radius;
      this.color = type.color;

      this.reachedEnd = false;
      this.distanceTravelled = 0;
    }

    update() {
      if (this.reachedEnd || this.targetIndex >= pathPoints.length) return;

      const target = pathPoints[this.targetIndex];
      const toTarget = p5.Vector.sub(target, this.pos);
      const distance = toTarget.mag();

      if (distance <= this.speed) {
        this.pos = target.copy();
        this.distanceTravelled += distance;
        this.targetIndex++;

        if (this.targetIndex >= pathPoints.length) {
          this.reachedEnd = true;
        }
      } else {
        toTarget.setMag(this.speed);
        this.pos.add(toTarget);
        this.distanceTravelled += this.speed;
      }
    }

    display() {
      noStroke();
      fill(...this.color);
      ellipse(this.pos.x, this.pos.y, this.radius * 2);

      const barW = this.radius * 2.4;
      const barH = 4;
      const x = this.pos.x - barW / 2;
      const y = this.pos.y - this.radius - 10;

      fill(40);
      rect(x, y, barW, barH, 2);
      fill(80, 220, 110);
      rect(x, y, barW * max(0, this.health / this.maxHealth), barH, 2);
    }
  }

  class Tower {
    constructor(x, y, type) {
      this.pos = createVector(x, y);
      this.type = type;
      this.range = type.range;
      this.reload = type.reload;
      this.damage = type.damage;
      this.color = type.color;

      this.cooldown = 0;
      this.level = 1;
      this.beamTimer = 0;
      this.beamTarget = null;
    }

    get upgradeCost() {
      return 55 + this.level * 45;
    }

    get sellValue() {
      return Math.floor(this.type.cost * 0.55 + (this.level - 1) * 35);
    }

    update() {
      if (this.cooldown > 0) this.cooldown--;
      if (this.beamTimer > 0) this.beamTimer--;

      if (this.cooldown <= 0) {
        const target = this.findTarget();
        if (target) {
          target.health -= this.damage;
          this.cooldown = this.reload;
          this.beamTimer = 5;
          this.beamTarget = target.pos.copy();

          effects.push(new FloatingText(
            "-" + cleanNumber(this.damage),
            target.pos.x,
            target.pos.y - 18,
            [180, 35, 35]
          ));
        }
      }
    }

    findTarget() {
      let best = null;
      let bestProgress = -Infinity;

      for (const enemy of enemies) {
        const d = dist(this.pos.x, this.pos.y, enemy.pos.x, enemy.pos.y);
        if (d <= this.range && enemy.distanceTravelled > bestProgress) {
          best = enemy;
          bestProgress = enemy.distanceTravelled;
        }
      }

      return best;
    }

    display() {
      if (selectedTower === this) {
        noFill();
        stroke(25, 25, 25, 70);
        strokeWeight(2);
        ellipse(this.pos.x, this.pos.y, this.range * 2);
      }

      if (this.beamTimer > 0 && this.beamTarget) {
        stroke(255, 70, 70, 190);
        strokeWeight(3);
        line(this.pos.x, this.pos.y, this.beamTarget.x, this.beamTarget.y);
      }

      noStroke();
      fill(...this.color);
      ellipse(this.pos.x, this.pos.y, TOWER_RADIUS * 2);

      fill(255);
      textAlign(CENTER, CENTER);
      textSize(12);
      text(this.level, this.pos.x, this.pos.y);

      if (selectedTower === this) {
        noFill();
        stroke(255, 230, 80);
        strokeWeight(3);
        ellipse(this.pos.x, this.pos.y, TOWER_RADIUS * 2 + 8);
      }
    }

    upgrade() {
      if (this.level >= 4) {
        message = "That tower is max level already.";
        return;
      }

      const cost = this.upgradeCost;
      if (money < cost) {
        message = "Not enough money to upgrade.";
        return;
      }

      money -= cost;
      this.level++;
      this.damage = Number((this.damage + this.type.damage * 0.7).toFixed(2));
      this.range += 13;
      this.reload = max(6, Math.floor(this.reload * 0.86));
      message = `${this.type.name} upgraded to level ${this.level}.`;
    }
  }

  class FloatingText {
    constructor(textValue, x, y, colorValue) {
      this.textValue = textValue;
      this.pos = createVector(x, y);
      this.life = 42;
      this.colorValue = colorValue;
    }

    update() {
      this.pos.y -= 0.45;
      this.life--;
    }

    display() {
      const alpha = map(this.life, 0, 42, 0, 220);
      noStroke();
      fill(this.colorValue[0], this.colorValue[1], this.colorValue[2], alpha);
      textAlign(CENTER, CENTER);
      textSize(13);
      text(this.textValue, this.pos.x, this.pos.y);
    }
  }

  class Button {
    constructor(x, y, w, h, label, action, isActive = () => false, isDisabled = () => false) {
      this.x = x;
      this.y = y;
      this.w = w;
      this.h = h;
      this.label = label;
      this.action = action;
      this.isActive = isActive;
      this.isDisabled = isDisabled;
    }

    contains(x, y) {
      return x >= this.x && x <= this.x + this.w && y >= this.y && y <= this.y + this.h;
    }

    click() {
      if (!this.isDisabled()) this.action();
    }

    display() {
      const active = this.isActive();
      const disabled = this.isDisabled();
      const hover = hoverWorld && this.contains(hoverWorld.x, hoverWorld.y);

      stroke(35);
      strokeWeight(active ? 3 : 1);

      if (disabled) {
        fill(205);
      } else if (active) {
        fill(255, 235, 130);
      } else if (hover) {
        fill(245);
      } else {
        fill(232);
      }

      rect(this.x, this.y, this.w, this.h, 8);

      noStroke();
      fill(disabled ? 120 : 20);
      textAlign(CENTER, CENTER);
      textSize(14);
      text(this.label(), this.x + this.w / 2, this.y + this.h / 2);
    }
  }

  window.setup = function setup() {
    pixelDensity(1);
    fitCanvas();
    initialiseGame();
  };

  window.draw = function draw() {
    background(245);
    hoverWorld = screenToWorld(mouseX, mouseY);

    push();
    scale(worldScale);
    drawWorld();
    pop();
  };

  window.mousePressed = function mousePressed() {
    return handlePointerPress();
  };

  window.touchStarted = function touchStarted() {
    return handlePointerPress();
  };

  window.windowResized = function windowResized() {
    fitCanvas();
  };

  window.keyPressed = function keyPressed() {
    if (key === "1") selectedBuild = towerTypes[0];
    if (key === "2") selectedBuild = towerTypes[1];
    if (key === "3") selectedBuild = towerTypes[2];
    if (key === " " && !waveActive) startWave();
    if ((key === "r" || key === "R") && gameState !== "playing") initialiseGame();
  };

  function initialiseGame() {
    pathPoints = [
      createVector(70, -20),
      createVector(70, 130),
      createVector(250, 130),
      createVector(250, 285),
      createVector(455, 285),
      createVector(455, 455),
      createVector(570, 455),
      createVector(570, WORLD_H + 20)
    ];

    enemies = [];
    towers = [];
    effects = [];
    selectedBuild = null;
    selectedTower = null;

    money = 275;
    baseHealth = 15;
    waveNumber = 0;
    spawnQueue = [];
    spawnTimer = 0;
    waveActive = false;
    gameState = "playing";
    message = "Pick a tower, then place it away from the path.";

    createButtons();
  }

  function createButtons() {
    buttons = [];

    let y = 84;
    for (const type of towerTypes) {
      buttons.push(new Button(
        UI_X + 18,
        y,
        164,
        42,
        () => `${type.name}  $${type.cost}`,
        () => {
          selectedBuild = type;
          selectedTower = null;
          message = `${type.name}: ${type.desc}. Click the map to place.`;
        },
        () => selectedBuild === type,
        () => money < type.cost || towers.length >= MAX_TOWERS || gameState !== "playing"
      ));
      y += 52;
    }

    buttons.push(new Button(
      UI_X + 18,
      270,
      164,
      42,
      () => waveActive ? "Wave Running" : "Start Wave",
      () => startWave(),
      () => false,
      () => waveActive || gameState !== "playing"
    ));

    buttons.push(new Button(
      UI_X + 18,
      382,
      164,
      42,
      () => selectedTower ? `Upgrade  $${selectedTower.upgradeCost}` : "Upgrade",
      () => {
        if (selectedTower) selectedTower.upgrade();
      },
      () => false,
      () => !selectedTower || selectedTower.level >= 4 || money < selectedTower.upgradeCost || gameState !== "playing"
    ));

    buttons.push(new Button(
      UI_X + 18,
      434,
      164,
      42,
      () => selectedTower ? `Sell  +$${selectedTower.sellValue}` : "Sell",
      () => sellSelectedTower(),
      () => false,
      () => !selectedTower || gameState !== "playing"
    ));

    buttons.push(new Button(
      UI_X + 18,
      486,
      164,
      42,
      () => gameState === "playing" ? "Restart" : "Play Again",
      () => initialiseGame(),
      () => false,
      () => false
    ));
  }

  function fitCanvas() {
    const parent = document.getElementById("tower-defense-container");
    const availableWidth = parent ? parent.clientWidth : window.innerWidth;
    const maxWidth = Math.min(900, Math.max(320, availableWidth || 800));

    let fittedW = maxWidth;
    let fittedH = fittedW * (WORLD_H / WORLD_W);

    const maxHeight = Math.max(360, window.innerHeight * 0.92);
    if (fittedH > maxHeight) {
      fittedH = maxHeight;
      fittedW = fittedH * (WORLD_W / WORLD_H);
    }

    worldScale = fittedW / WORLD_W;

    if (!canvas) {
      canvas = createCanvas(fittedW, fittedH);
      if (parent) canvas.parent(parent);
      canvas.style("display", "block");
      canvas.style("margin", "0 auto");
      canvas.style("max-width", "100%");
      canvas.style("height", "auto");
      canvas.elt.style.touchAction = "none";
    } else {
      resizeCanvas(fittedW, fittedH);
    }
  }

  function drawWorld() {
    drawPlayArea();
    drawPath();

    if (gameState === "playing") {
      updateWaveSpawner();

      for (const tower of towers) tower.update();
      for (const enemy of enemies) enemy.update();
      for (const effect of effects) effect.update();

      handleEnemyCleanup();
      effects = effects.filter(effect => effect.life > 0);
    }

    for (const tower of towers) tower.display();
    for (const enemy of enemies) enemy.display();
    for (const effect of effects) effect.display();

    drawBuildPreview();
    drawUi();

    if (gameState === "lost") drawOverlay("Game Over", "Press R or click Play Again.");
    if (gameState === "won") drawOverlay("You Win!", "Press R or click Play Again.");
  }

  function drawPlayArea() {
    noStroke();
    fill(250);
    rect(0, 0, PLAY_W, WORLD_H);

    stroke(215);
    strokeWeight(1);
    for (let x = 0; x < PLAY_W; x += 40) line(x, 0, x, WORLD_H);
    for (let y = 0; y < WORLD_H; y += 40) line(0, y, PLAY_W, y);
  }

  function drawPath() {
    stroke(190, 170, 130);
    strokeWeight(PATH_RADIUS * 2);
    strokeCap(ROUND);
    strokeJoin(ROUND);
    noFill();
    beginShape();
    for (const point of pathPoints) {
      vertex(point.x, point.y);
    }
    endShape();

    stroke(90, 75, 50);
    strokeWeight(3);
    beginShape();
    for (const point of pathPoints) {
      vertex(point.x, point.y);
    }
    endShape();

    noStroke();
    fill(70);
    textAlign(CENTER, CENTER);
    textSize(12);
    text("ENEMIES", 70, 26);
    text("BASE", 548, 565);
  }

  function drawUi() {
    noStroke();
    fill(36);
    rect(UI_X, 0, WORLD_W - UI_X, WORLD_H);

    fill(255);
    textAlign(LEFT, TOP);
    textSize(22);
    text("Tower Defense", UI_X + 18, 16);

    textSize(14);
    text(`Money: $${money}`, UI_X + 18, 50);
    text(`Base HP: ${baseHealth}`, UI_X + 108, 50);

    for (const button of buttons) button.display();

    fill(255);
    textAlign(LEFT, TOP);
    textSize(14);
    text(`Wave: ${min(waveNumber + 1, TOTAL_WAVES)}/${TOTAL_WAVES}`, UI_X + 18, 326);
    text(`Towers: ${towers.length}/${MAX_TOWERS}`, UI_X + 18, 348);

    if (selectedTower) {
      textSize(13);
      text(
        `${selectedTower.type.name} Lv.${selectedTower.level}\n` +
        `Damage: ${cleanNumber(selectedTower.damage)}\n` +
        `Range: ${Math.round(selectedTower.range)}\n` +
        `Reload: ${selectedTower.reload}f`,
        UI_X + 18,
        486
      );
    }

    fill(235);
    textAlign(LEFT, BOTTOM);
    textSize(12);
    text(wrapText(message, 25), UI_X + 18, WORLD_H - 16);
  }

  function drawBuildPreview() {
    if (!selectedBuild || !hoverWorld || gameState !== "playing") return;
    if (!insidePlayArea(hoverWorld.x, hoverWorld.y)) return;

    const valid = canPlaceTower(hoverWorld.x, hoverWorld.y).ok;

    noFill();
    stroke(valid ? color(30, 180, 80, 150) : color(220, 40, 40, 150));
    strokeWeight(2);
    ellipse(hoverWorld.x, hoverWorld.y, selectedBuild.range * 2);

    noStroke();
    fill(valid ? color(30, 180, 80, 150) : color(220, 40, 40, 150));
    ellipse(hoverWorld.x, hoverWorld.y, TOWER_RADIUS * 2);
  }

  function drawOverlay(title, subtitle) {
    noStroke();
    fill(0, 0, 0, 145);
    rect(0, 0, PLAY_W, WORLD_H);

    fill(255);
    textAlign(CENTER, CENTER);
    textSize(54);
    text(title, PLAY_W / 2, WORLD_H / 2 - 30);

    textSize(18);
    text(subtitle, PLAY_W / 2, WORLD_H / 2 + 24);
  }

  function updateWaveSpawner() {
    if (!waveActive) return;

    spawnTimer--;
    if (spawnTimer <= 0 && spawnQueue.length > 0) {
      const nextType = spawnQueue.shift();
      enemies.push(new Enemy(nextType, waveNumber + 1));
      spawnTimer = max(14, 50 - waveNumber * 3);
    }

    if (waveActive && spawnQueue.length === 0 && enemies.length === 0) {
      waveActive = false;

      if (waveNumber >= TOTAL_WAVES) {
        gameState = "won";
        message = "Wow. You really made it. Mission complete!";
      } else {
        const bonus = 35 + waveNumber * 8;
        money += bonus;
        message = `Wave cleared. Bonus: $${bonus}.`;
      }
    }
  }

  function handleEnemyCleanup() {
    for (let i = enemies.length - 1; i >= 0; i--) {
      const enemy = enemies[i];

      if (enemy.health <= 0) {
        money += enemy.reward;
        effects.push(new FloatingText(`+$${enemy.reward}`, enemy.pos.x, enemy.pos.y - 10, [30, 140, 60]));
        enemies.splice(i, 1);
      } else if (enemy.reachedEnd) {
        baseHealth--;
        effects.push(new FloatingText("-1 HP", enemy.pos.x, WORLD_H - 42, [220, 40, 40]));
        enemies.splice(i, 1);

        if (baseHealth <= 0) {
          baseHealth = 0;
          gameState = "lost";
          message = "RIP bruh you were just not good enough.";
        }
      }
    }
  }

  function startWave() {
    if (waveActive || gameState !== "playing") return;

    if (waveNumber >= TOTAL_WAVES) {
      gameState = "won";
      return;
    }

    waveNumber++;
    spawnQueue = generateWave(waveNumber);
    spawnTimer = 1;
    waveActive = true;
    selectedBuild = null;
    selectedTower = null;
    message = `Wave ${waveNumber} started. Good luck, boi.`;
  }

  function generateWave(wave) {
    const queue = [];
    const gruntCount = 7 + wave * 2;
    const runnerCount = Math.floor(wave * 1.4);
    const tankCount = Math.max(0, Math.floor((wave - 2) * 0.9));

    for (let i = 0; i < gruntCount; i++) queue.push(enemyTypes[0]);
    for (let i = 0; i < runnerCount; i++) queue.push(enemyTypes[1]);
    for (let i = 0; i < tankCount; i++) queue.push(enemyTypes[2]);

    if (wave % 4 === 0 || wave === TOTAL_WAVES) queue.push(enemyTypes[3]);
    return shuffleArray(queue);
  }

  function handlePointerPress() {
    // Prevent touch + synthetic mouse double-placement on mobile.
    if (frameCount === lastInputFrame) return false;
    lastInputFrame = frameCount;

    const p = screenToWorld(mouseX, mouseY);
    if (!p) return true;

    for (const button of buttons) {
      if (button.contains(p.x, p.y)) {
        button.click();
        return false;
      }
    }

    if (gameState !== "playing") return false;

    if (insidePlayArea(p.x, p.y)) {
      const clickedTower = getTowerAt(p.x, p.y);

      if (clickedTower) {
        selectedTower = clickedTower;
        selectedBuild = null;
        message = `${clickedTower.type.name} selected.`;
        return false;
      }

      if (selectedBuild) {
        const placement = canPlaceTower(p.x, p.y);

        if (placement.ok) {
          towers.push(new Tower(p.x, p.y, selectedBuild));
          money -= selectedBuild.cost;
          message = `${selectedBuild.name} placed.`;
          selectedBuild = null;
          selectedTower = null;
        } else {
          message = placement.reason;
        }
      } else {
        selectedTower = null;
      }
    }

    return false;
  }

  function sellSelectedTower() {
    if (!selectedTower) return;

    money += selectedTower.sellValue;
    towers = towers.filter(tower => tower !== selectedTower);
    selectedTower = null;
    message = "Tower sold.";
  }

  function getTowerAt(x, y) {
    for (let i = towers.length - 1; i >= 0; i--) {
      const tower = towers[i];
      if (dist(tower.pos.x, tower.pos.y, x, y) <= TOWER_RADIUS + 4) {
        return tower;
      }
    }
    return null;
  }

  function canPlaceTower(x, y) {
    if (!selectedBuild) return { ok: false, reason: "Pick a tower first." };
    if (money < selectedBuild.cost) return { ok: false, reason: "Not enough money." };
    if (towers.length >= MAX_TOWERS) return { ok: false, reason: "Tower limit reached." };
    if (!insidePlayArea(x, y)) return { ok: false, reason: "Place towers inside the map." };

    if (x < TOWER_RADIUS || y < TOWER_RADIUS || x > PLAY_W - TOWER_RADIUS || y > WORLD_H - TOWER_RADIUS) {
      return { ok: false, reason: "Too close to the edge." };
    }

    if (distanceToPath(x, y) < PATH_RADIUS + TOWER_RADIUS + 5) {
      return { ok: false, reason: "Too close to the path." };
    }

    for (const tower of towers) {
      if (dist(x, y, tower.pos.x, tower.pos.y) < TOWER_RADIUS * 2 + 8) {
        return { ok: false, reason: "Too close to another tower." };
      }
    }

    return { ok: true, reason: "" };
  }

  function insidePlayArea(x, y) {
    return x >= 0 && x < PLAY_W && y >= 0 && y < WORLD_H;
  }

  function distanceToPath(x, y) {
    let best = Infinity;
    for (let i = 0; i < pathPoints.length - 1; i++) {
      best = min(best, distanceToSegment(x, y, pathPoints[i], pathPoints[i + 1]));
    }
    return best;
  }

  function distanceToSegment(px, py, a, b) {
    const vx = b.x - a.x;
    const vy = b.y - a.y;
    const wx = px - a.x;
    const wy = py - a.y;

    const lenSq = vx * vx + vy * vy;
    if (lenSq === 0) return dist(px, py, a.x, a.y);

    let t = (wx * vx + wy * vy) / lenSq;
    t = constrain(t, 0, 1);

    const closestX = a.x + t * vx;
    const closestY = a.y + t * vy;
    return dist(px, py, closestX, closestY);
  }

  function screenToWorld(x, y) {
    if (x < 0 || y < 0 || x > width || y > height) return null;
    return createVector(x / worldScale, y / worldScale);
  }

  function shuffleArray(array) {
    const copy = array.slice();
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(random(i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function cleanNumber(value) {
    if (Math.abs(value - Math.round(value)) < 0.001) return String(Math.round(value));
    return value.toFixed(1);
  }

  function wrapText(textValue, maxChars) {
    const words = textValue.split(" ");
    let lines = [];
    let line = "";

    for (const word of words) {
      if ((line + " " + word).trim().length > maxChars) {
        lines.push(line.trim());
        line = word;
      } else {
        line += " " + word;
      }
    }

    if (line.trim()) lines.push(line.trim());
    return lines.slice(0, 3).join("\n");
  }
})();
