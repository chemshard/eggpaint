/*
  landform_blogger_compatible.js

  Blogger-compatible p5 instance-mode wrapper for Landform.

  Required Blogger post/page HTML:
    <div id="landform-game"><div id="landform-status">loading Landform...</div></div>

  Required Blogger theme scripts right before </body>:
    <script type='text/javascript' src='https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.4/p5.min.js'></script>
    <script type='text/javascript' src='https://YOURUSERNAME.github.io/YOURREPO/landform.js?v=1'></script>

  Do not paste this file directly into a Blogger post. Host it externally, then link it.
*/

(function () {
  var CONTAINER_ID = "landform-game";
  var STATUS_IDS = ["landform-status", "p5-status"];
  var started = false;
  var tries = 0;

  function getStatusEl() {
    for (var i = 0; i < STATUS_IDS.length; i++) {
      var el = document.getElementById(STATUS_IDS[i]);
      if (el) return el;
    }
    return null;
  }

  function statusText(text) {
    var s = getStatusEl();
    if (s) s.textContent = text;
  }

  function removeStatus() {
    var s = getStatusEl();
    if (s && s.parentNode) s.parentNode.removeChild(s);
  }

  function startLandform() {
    var holder = document.getElementById(CONTAINER_ID);

    if (!holder) {
      return;
    }

    if (started || holder.__landformStarted) return;
    started = true;
    holder.__landformStarted = true;

    holder.style.position = "relative";
    holder.style.width = "100%";
    holder.style.maxWidth = "760px";
    holder.style.margin = "30px auto";
    holder.style.overflow = "visible";

    statusText("p5 loaded. starting Landform...");

    new p5(function (p) {
      // Instance-mode wrapper.
      // The original sketch is preserved below, but p5 calls resolve through `p`.
      with (p) {
        function preventGameScroll(e) {
          const gameKeys = [
            "ArrowUp",
            "ArrowDown",
            "ArrowLeft",
            "ArrowRight",
            " ",
            "Spacebar"
          ];
        
          if (gameKeys.includes(e.key)) {
            e.preventDefault();
          }
        }
        
        window.addEventListener("keydown", preventGameScroll, { passive: false });
        
        /*
        LANDFORM V1.4
        
        - Control character either with joystick or arrow keys (but not both). Close joystick in settings
        - Move close to resources to mine them.
        - Click on monsters when they are close enough to hit them.
        - Click on your square to open inventory / crafting.
        - Crafting recipes are found in stats / info.
        - For the boss on sun dimension, you are unable to change to another dimension until the boss is dead. The boss will automatically drop in health but you can hit it when it passes over you.
        - You will lose health if the boss touches you.
        
        CHANGELOG:
        v1.4
        - Corrected typos in glossary entries.
        - Created drop rates for most items.
        - Bug fixes for the moon dimension.
        - Added new hurt animation for all mobs.
        - Changed format of title screen.
        - Fixed bug where inventory could not be opened.
        - Added new colors to the glossary entries.
        - Fixed a bug where you could escape from the sun.
        - Fixed a bug where chickens remained pink.
        
        v1.3 
        - Added trees on moon.
        
        v1.2 "OFFICIAL"
        - Added settings.
        - Added mods.
        - Fixed hitbox bugs.
        - Added glossary entries for boots, axes and pickaxes.
        - Added all glossary entries.
        - Fixed glossary bug.
        - Added coordinate options.
        - Fixed rectangle align bug.
        
        v1.1 "BETA"
        - Added main menu.
        - Added death return.
        - Added win screen.
        - Added boss and boss mechanics.
        
        v1.0 "ALPHA"
        - Added mystical boots.
        - Added mystical axes.
        - Added mystical pickaxes.
        - Added mystical armour.
        - Added blood gear.
        - Added sun dimension.
        - Optimized health gain.
        - Added special effects.
        - Refined experience.
        - Added boots glossary.
        - Fixed rounding bug.
        - Added mutants.
        
        v0.9 "DIMENSION UPDATE"
        - Added dimensions in crafting.
        - Added moon dimension.
        - Added mystical ores.
        - Added glossary tab.
        
        v0.8 "GEAR UPDATE"
        - Added bone boots.
        - Added bone axes.
        - Added bone pickaxes.
        - Added armour.
        - Bugs fixed.
        
        v0.7 "HOSTILE MODE"
        - Added zombies.
        - Added bones.
        - Added code for dimensions.
        - Optimized health gain.
        - Health bar bug fixed.
        
        v0.6 "STONE AGE"
        - Fixed crafting bug.
        - Wooden pickaxes added.
        - Stone added.
        - Stone tools added.
        - Energy and health optimized.
        - More bugs fixed.
        
        v0.5
        - Leather boots added.
        - Inventory screen optimized.
        - Health bars added.
        - Wooden axes added.
        - Death screen optimized.
        - Day/night cycle optimized.
        - Bugs fixed.
        
        v0.4
        - Cows and leather added.
        - Death screen added.
        - Optimizations made.
        - Bugs fixed.
        
        v0.3:
        - Chickens added.
        - Bugs fixed.
        
        v0.2:
        - Crafting added.
        - Interactivity added.
        - Boots added.
        - Day and night cycle added.
        
        v0.1:
        - Basic functionality added.
        - GUI added.
        - Trees added.
        */
        
        // UNDEFINED VARIABLES
        var trees1X;
        var trees1Y;
        var trees2X;
        var trees2Y;
        var trees3X;
        var trees3Y;
        var oak1X;
        var oak1Y;
        var oak2X;
        var oak2Y;
        var oak3X;
        var oak3Y;
        var stone1X;
        var stone1Y;
        var stone2X;
        var stone2Y;
        var stone3X;
        var stone3Y;
        var ore1X;
        var ore2X;
        var ore1Y;
        var ore2Y;
        var ore3X;
        var ore3Y;
        var chick1X;
        var chick1Y;
        var chick2X;
        var chick2Y;
        var chick1XV;
        var chick1YV;
        var chick2XV;
        var chick2YV;
        var cowX;
        var cowY;
        var cowXV;
        var cowYV;
        var zomb1X;
        var zomb1Y;
        var zomb1XV;
        var zomb1YV;
        var zomb2X;
        var zomb2Y;
        var zomb2XV;
        var zomb2YV;
        var mut1X;
        var mut1Y;
        var mut1XV;
        var mut1YV;
        var mut2X;
        var mut2Y;
        var mut2XV;
        var mut2YV;
        var mut3X;
        var mut3Y;
        var mut3XV;
        var mut3YV;
        var mut4X;
        var mut4Y;
        var mut4XV;
        var mut4YV;
        var isMoving;
        var featherChance;
        var leatherChance;
        var boneChance;
        var fleshChance;
        
        // DEFINED VARIABLES
        var glossaryTimer = 0;
        var onCar = 1;
        var onHeart = 0;
        var onMoon = 0;
        var onGui = 1;
        var onJoy = 1;
        var onBat = 0;
        var youWin = 0;
        var sundied = 0;
        var sunX = 200;
        var sunY = 330;
        var sunXV = 50;
        var sunYV = 50;
        var resetV = 0;
        var titlec = 255;
        var openSettings = 0;
        var openMods = 0;
        var bg = 255;
        var dimension = 0;
        var worldTimer = 0;
        var worldTimer2 = 0;
        var worldTimer3 = 0;
        var youDied = 0;
        var dayTime = 1;
        var waitDay = 0;
        var waitNight = 0;
        var energy = 20;
        var energyMax = 20;
        var health = 20;
        var healthMax = 20;
        var attack = 1;
        var joyX = 80;
        var joyY = 320;
        var rectX = 200;
        var rectY = 200;
        var speeds = 1;
        var setRandomTrees = 0;
        var setRandomChicks = 0;
        var setRandomCow = 0;
        var setRandomStone = 0;
        var setRandomZombs = 0;
        var setRandomOres = 0;
        var setRandomMuts = 0;
        var timer1chop = 0;
        var timer2chop = 0;
        var timer3chop = 0;
        var tree1chopped = 0;
        var tree2chopped = 0;
        var tree3chopped = 0;
        var timer1dig = 0;
        var timer2dig = 0;
        var timer3dig = 0;
        var timer4dig = 0;
        var timer5dig = 0;
        var timer6dig = 0;
        var stone1dug = 0;
        var stone2dug = 0;
        var stone3dug = 0;
        var ore1dug = 0;
        var ore2dug = 0;
        var ore3dug = 0;
        var oak1chopped = 0;
        var oak2chopped = 0;
        var oak3chopped = 0;
        var timer1oak = 0;
        var timer2oak = 0;
        var timer3oak = 0;
        var setRandomOak = 0;
        var chick1killed = 0;
        var chick2killed = 0;
        var chick1died = 0;
        var chick2died = 0;
        var cowdied = 0;
        var zomb1died = 0;
        var zomb2died = 0;
        var mut1died = 0;
        var mut2died = 0;
        var mut3died = 0;
        var mut4died = 0;
        var chopTime = 300;
        var wood = 0;
        var stone = 0;
        var feathers = 0;
        var leather = 0;
        var bone = 0;
        var mysticalore = 0;
        var flesh = 0;
        var openBag = 0;
        var openBoots = 0;
        var openAxes = 0;
        var openPickaxes = 0;
        var openArmour = 0;
        var openDimensions = 0;
        var openGlossary = 0;
        var equippedBoots = 0;
        var equippedAxes = 0;
        var equippedPickaxes = 0;
        var equippedArmour = 0;
        var wbootsBought = 0;
        var lbootsBought = 0;
        var sbootsBought = 0;
        var bbootsBought = 0;
        var mbootsBought = 0;
        var wpickaxesBought = 0;
        var spickaxesBought = 0;
        var bpickaxesBought = 0;
        var mpickaxesBought = 0;
        var blpickaxesBought = 0;
        var waxesBought = 0;
        var saxesBought = 0;
        var baxesBought = 0;
        var maxesBought = 0;
        var blaxesBought = 0;
        var larmourBought = 0;
        var sarmourBought = 0;
        var barmourBought = 0;
        var marmourBought = 0;
        var blarmourBought = 0;
        var bootsDelay = 0;
        var chick1health = 1;
        var chick2health = 1;
        var cowHealth = 3;
        var zomb1health = 5;
        var zomb2health = 5;
        var mut1health = 10;
        var mut2health = 10;
        var mut3health = 10;
        var mut4health = 10;
        var sunhealth = 200;
        var trect1X = -200;
        var trect2X = 400;
        var axesDelay = 0;
        var pickaxesDelay = 0;
        var armourDelay = 0;
        var dimensionDelay = 0;
        var glossaryDelay = 0;
        var shopDelay = 0;
        var mineStone = 0;
        var mineTime = 360;
        var mineOre = 0;
        var mineTime2 = 460;
        var moonBought = 0;
        var earthBought = 1;
        var sunBought = 0;
        var currentDimension = 0;
        var bAbility = 0;
        var babilityTimer = 0;
        var aAbility = 0;
        var testCrit = 0;
        var openBootsG = 0;
        var openAxesG = 0;
        var openPickaxesG = 0;
        var openArmourG = 0;
        var openDimensionsG = 0;
        var openMobsG = 0;
        var crit = 0;
        var c1hurt = 0;
        var c1timer = 0;
        var c2hurt = 0;
        var c2timer = 0;
        var cowhurt = 0;
        var cowtimer = 0;
        var zomb1hurt = 0;
        var zomb1timer = 0;
        var zomb2timer = 0;
        var zomb2hurt = 0;
        var mut1hurt = 0;
        var mut1timer = 0;
        var mut2hurt = 0;
        var mut2timer = 0;
        var mut3hurt = 0;
        var mut3timer = 0;
        var mut4hurt = 0;
        var mut4timer = 0;
        var sunhurt = 0;
        var suntimer = 0;
        
        // Responsive canvas settings.
        // The actual game still thinks in a 400x400 "virtual" world.
        // The canvas is resized to fit the screen/container, then everything is scaled.
        const GAME_W = 400;
        const GAME_H = 400;
        let gameCanvas;
        let gameScale = 1;
        
        function getGameParentWidth() {
          if (gameCanvas && gameCanvas.elt && gameCanvas.elt.parentElement) {
            return gameCanvas.elt.parentElement.clientWidth || windowWidth;
          }
          return windowWidth;
        }
        
        function fitGameCanvas() {
          var availableWidth = getGameParentWidth();
          var availableHeight = windowHeight * 0.92;
          var side = Math.floor(Math.max(1, Math.min(availableWidth, availableHeight)));
        
          gameScale = side / GAME_W;
        
          if (gameCanvas) {
            resizeCanvas(side, side);
            gameCanvas.elt.style.display = "block";
            gameCanvas.elt.style.margin = "0 auto";
            gameCanvas.elt.style.maxWidth = "100%";
            gameCanvas.elt.style.height = "auto";
            gameCanvas.elt.style.touchAction = "none";
          }
        }
        
        function gameMouseX() {
          return mouseX / gameScale;
        }
        
        function gameMouseY() {
          return mouseY / gameScale;
        }
        
        function gamePMouseX() {
          return pmouseX / gameScale;
        }
        
        function gamePMouseY() {
          return pmouseY / gameScale;
        }
        
        function pointerIsDown() {
          return mouseIsPressed || (typeof touches !== "undefined" && touches.length > 0);
        }
        
        function setup() {
          pixelDensity(Math.min(2, window.devicePixelRatio || 1));
          gameCanvas = createCanvas(1, 1);
        
          // Optional: if your webpage has <div id="landform-game"></div>,
          // the canvas will be placed inside it. Otherwise p5.js uses the page body.
          var holder = document.getElementById("landform-game");
          if (holder) {
            gameCanvas.parent(holder);
          }
        
          fitGameCanvas();
        }
        
        function windowResized() {
          fitGameCanvas();
        }
        
        
        function draw() {
          push();
          scale(gameScale);
          if (onHeart === 1 && health > 3) {
            health = 3;
          }
          if (rectX < 0) {
            health -= 1 / 12;
          }
          if (rectX > 400) {
            health -= 1 / 12;
          }
          if (rectY < 0) {
            health -= 1 / 12;
          }
          if (rectY > 400) {
            health -= 1 / 12;
          }
          if (onBat === 1) {
            wood = 1000;
            stone = 1000;
            feathers = 1000;
            leather = 1000;
            bone = 1000;
            mysticalore = 1000;
            flesh = 1000;
            healthMax = 1000;
            health = 1000;
            energyMax = 1000;
            energy = 1000;
            speeds = 5;
          }
          if (babilityTimer > 0) {
            babilityTimer -= 1;
          }
          if (bAbility === 1) {
            babilityTimer += 60;
            bAbility = 0;
          }
          if (babilityTimer > 0) {
            speeds *= 2;
          }
          if (testCrit === 1) {
            crit = round(random(1, 2));
            testCrit = 0;
          }
          if (crit === 2) {
            attack *= 1.5;
          }
          if (youDied === 0 && dimension > 0 && dimension < 3) {
            health += 1 / 100;
            energy -= 1 / 1800;
          }
          if (dimension === 2) {
            health -= 1 / 200;
          }
          if (dimension === 1) {
            if (dayTime === 1 && waitNight > 3600) {
              dayTime = 0;
            }
            if (dayTime === 0 && waitDay > 3600) {
              dayTime = 1;
            }
            if (dayTime === 0) {
              bg += 35 / 3600;
              background(bg);
              waitDay += 1;
              waitNight = 0;
            }
            if (dayTime === 1) {
              bg -= 35 / 3600;
              background(bg);
              waitNight += 1;
              waitDay = 0;
            }
          }
          if (dimension === 2) {
            background(220);
          }
          if (dimension === 3) {
            background(200);
          }
          if (health > healthMax) {
            health = healthMax;
          }
          if (energy > energyMax) {
            energy = energyMax;
          }
          if (health < 0) {
            health = 0;
          }
          if (energy < 0) {
            energy = 0;
          }
          if (energy === 0) {
            health -= 1 / 100;
          }
          if (joyX < 30) {
            joyX = 30;
          }
          if (joyX > 130) {
            joyX = 130;
          }
          if (joyY < 270) {
            joyY = 270;
          }
          if (joyY > 370) {
            joyY = 370;
          }
          rectX += (joyX / 80 - 1) * speeds;
          rectY += (joyY / 320 - 1) * speeds;
          if (dimension === 3) {
            worldTimer3 += 1;
          }
          if (dimension === 2) {
            worldTimer2 += 1;
            // WORLD GENERATION
            if ((worldTimer2 % 4800 === 1) | (worldTimer2 % 4800 === 0)) {
              setRandomOres = 1;
              setRandomMuts = 1;
              setRandomOak = 1;
              ore1dug = 0;
              ore2dug = 0;
              ore3dug = 0;
              oak1chopped = 0;
              oak2chopped = 0;
              oak3chopped = 0;
              mut1died = 0;
              mut2died = 0;
              mut3died = 0;
              mut4died = 0;
              mut1health = 10;
              mut2health = 10;
              mut3health = 10;
              mut4health = 10;
            }
            if (setRandomOres === 1) {
              ore1X = random(20, 380);
              ore1Y = random(200, 380);
              ore2X = random(20, 380);
              ore2Y = random(200, 380);
              ore3X = random(20, 380);
              ore3Y = random(200, 380);
              setRandomOres = 0;
            }
            if (setRandomOak === 1) {
              oak1X = random(20, 380);
              oak1Y = random(200, 380);
              oak2X = random(20, 380);
              oak2Y = random(200, 380);
              oak3X = random(20, 380);
              oak3Y = random(200, 380);
              setRandomOak = 0;
            }
            if (setRandomMuts === 1) {
              mut1X = random(200, 380);
              mut1Y = random(200, 380);
              mut2X = random(200, 380);
              mut2Y = random(200, 380);
              mut3X = random(200, 380);
              mut3Y = random(200, 380);
              mut4X = random(200, 380);
              mut4Y = random(200, 380);
              setRandomMuts = 0;
            }
            fill("brown");
            if (oak1chopped === 0) {
              ellipse(oak1X, oak1Y, 30);
            }
            if (oak2chopped === 0) {
              ellipse(oak2X, oak2Y, 30);
            }
            if (oak3chopped === 0) {
              ellipse(oak3X, oak3Y, 30);
            }
            fill("orange");
            if (ore1dug === 0) {
              ellipse(ore1X, ore1Y, 30);
            }
            if (ore2dug === 0) {
              ellipse(ore2X, ore2Y, 30);
            }
            if (ore3dug === 0) {
              ellipse(ore3X, ore3Y, 30);
            }
            if (mut1X < rectX) {
              mut1X += 0.5;
            }
            if (mut2X < rectX) {
              mut2X += 0.5;
            }
            if (mut1X > rectX) {
              mut1X -= 0.5;
            }
            if (mut2X > rectX) {
              mut2X -= 0.5;
            }
            if (mut1Y < rectY) {
              mut1Y += 0.5;
            }
            if (mut2Y < rectY) {
              mut2Y += 0.5;
            }
            if (mut1Y > rectY) {
              mut1Y -= 0.5;
            }
            if (mut2Y > rectY) {
              mut2Y -= 0.5;
            }
            if (mut3X < rectX) {
              mut3X += 0.5;
            }
            if (mut4X < rectX) {
              mut4X += 0.5;
            }
            if (mut3X > rectX) {
              mut3X -= 0.5;
            }
            if (mut4X > rectX) {
              mut4X -= 0.5;
            }
            if (mut3Y < rectY) {
              mut3Y += 0.5;
            }
            if (mut4Y < rectY) {
              mut4Y += 0.5;
            }
            if (mut3Y > rectY) {
              mut3Y -= 0.5;
            }
            if (mut4Y > rectY) {
              mut4Y -= 0.5;
            }
            fill("yellow");
            if (mut1hurt === 1) {
              mut1timer += 1;
            }
            if (mut1timer <= 5 && mut1timer > 0) {
              fill("pink");
            }
            if (mut1timer > 5) {
              mut1hurt = 0;
              mut1timer = 0;
            }
            if (mut1died === 0) {
              ellipse(mut1X, mut1Y, 20);
            }
            if (mut1health <= 0 && mut1died === 0) {
              mut1health = 0;
              flesh += round(random(0, 3));
              mut1died = 1;
              mut1health = 0.0000000000001;
            }
            fill("yellow");
            if (mut2hurt === 1) {
              mut2timer += 1;
            }
            if (mut2timer <= 5 && mut2timer > 0) {
              fill("pink");
            }
            if (mut2timer > 5) {
              mut2hurt = 0;
              mut2timer = 0;
            }
            if (mut2died === 0) {
              ellipse(mut2X, mut2Y, 20);
            }
            if (mut2health <= 0 && mut2died === 0) {
              mut2health = 0;
              flesh += round(random(0, 3));
              mut2died = 1;
              mut2health = 0.0000000000001;
            }
            fill("yellow");
            if (mut3hurt === 1) {
              mut3timer += 1;
            }
            if (mut3timer <= 5 && mut3timer > 0) {
              fill("pink");
            }
            if (mut3timer > 5) {
              mut3hurt = 0;
              mut3timer = 0;
            }
            if (mut3died === 0) {
              ellipse(mut3X, mut3Y, 20);
            }
            if (mut3health <= 0 && mut3died === 0) {
              mut3health = 0;
              flesh += round(random(0, 3));
              mut3died = 1;
              mut3health = 0.0000000000001;
            }
            fill("yellow");
            if (mut4hurt === 1) {
              mut4timer += 1;
            }
            if (mut4timer <= 5 && mut4timer > 0) {
              fill("pink");
            }
            if (mut4timer > 5) {
              mut4hurt = 0;
              mut4timer = 0;
            }
            if (mut4died === 0) {
              ellipse(mut4X, mut4Y, 20);
            }
            if (mut4health <= 0 && mut4died === 0) {
              mut4health = 0;
              flesh += round(random(0, 3));
              mut4died = 1;
              mut4health = 0.0000000000001;
            }
            if (
              isMoving === false &&
              rectX > ore1X - 20 &&
              rectX < ore1X + 20 &&
              rectY > ore1Y - 20 &&
              rectY < ore1Y + 20 &&
              energy >= 2 &&
              ore1dug === 0 &&
              mineOre === 1
            ) {
              timer4dig += 1;
              rectMode(CENTER);
              fill("black");
              rect(ore1X, ore1Y - 30, 30, 10);
              rectMode(CORNER);
              fill("white");
              rect(ore1X - 12.5, ore1Y - 32.5, timer4dig / (mineTime2 / 25), 5);
            }
            if (timer4dig > mineTime2) {
              energy -= 5;
              mysticalore += round(random(1, 3));
              ore1dug = 1;
              timer4dig = 0;
            }
            if (
              isMoving === false &&
              rectX > ore2X - 20 &&
              rectX < ore2X + 20 &&
              rectY > ore2Y - 20 &&
              rectY < ore2Y + 20 &&
              energy >= 2 &&
              ore2dug === 0 &&
              mineOre === 1
            ) {
              timer5dig += 1;
              rectMode(CENTER);
              fill("black");
              rect(ore2X, ore2Y - 30, 30, 10);
              rectMode(CORNER);
              fill("white");
              rect(ore2X - 12.5, ore2Y - 32.5, timer5dig / (mineTime2 / 25), 5);
            }
            if (timer5dig > mineTime2) {
              energy -= 5;
              mysticalore += round(random(1, 3));
              ore2dug = 1;
              timer5dig = 0;
            }
            if (
              isMoving === false &&
              rectX > ore3X - 20 &&
              rectX < ore3X + 20 &&
              rectY > ore3Y - 20 &&
              rectY < ore3Y + 20 &&
              energy >= 2 &&
              ore3dug === 0 &&
              mineOre === 1
            ) {
              timer6dig += 1;
              rectMode(CENTER);
              fill("black");
              rect(ore3X, ore3Y - 30, 30, 10);
              rectMode(CORNER);
              fill("white");
              rect(ore3X - 12.5, ore3Y - 32.5, timer6dig / (mineTime2 / 25), 5);
            }
            if (timer6dig > mineTime2) {
              energy -= 5;
              mysticalore += round(random(1, 3));
              ore3dug = 1;
              timer6dig = 0;
            }
            if (
              mut1X > rectX - 25 &&
              mut1X < rectX + 25 &&
              mut1Y > rectY - 25 &&
              mut1Y < rectY + 25 &&
              mut1died === 0
            ) {
              rectMode(CENTER);
              fill("black");
              rect(mut1X, mut1Y - 30, 30, 10);
              rectMode(CORNER);
              fill("white");
              rect(mut1X - 12.5, mut1Y - 32.5, mut1health * 2.5, 5);
              health -= 1 / 20;
            }
            if (
              mut2X > rectX - 25 &&
              mut2X < rectX + 25 &&
              mut2Y > rectY - 25 &&
              mut2Y < rectY + 25 &&
              mut2died === 0
            ) {
              rectMode(CENTER);
              fill("black");
              rect(mut2X, mut2Y - 30, 30, 10);
              rectMode(CORNER);
              fill("white");
              rect(mut2X - 12.5, mut2Y - 32.5, mut2health * 2.5, 5);
              health -= 1 / 20;
            }
            if (
              mut3X > rectX - 25 &&
              mut3X < rectX + 25 &&
              mut3Y > rectY - 25 &&
              mut3Y < rectY + 25 &&
              mut3died === 0
            ) {
              rectMode(CENTER);
              fill("black");
              rect(mut3X, mut3Y - 30, 30, 10);
              rectMode(CORNER);
              fill("white");
              rect(mut3X - 12.5, mut3Y - 32.5, mut3health * 2.5, 5);
              health -= 1 / 20;
            }
            if (
              mut4X > rectX - 25 &&
              mut4X < rectX + 25 &&
              mut4Y > rectY - 25 &&
              mut4Y < rectY + 25 &&
              mut4died === 0
            ) {
              rectMode(CENTER);
              fill("black");
              rect(mut4X, mut4Y - 30, 30, 10);
              rectMode(CORNER);
              fill("white");
              rect(mut4X - 12.5, mut4Y - 32.5, mut4health * 2.5, 5);
              health -= 1 / 20;
            }
            if (
              isMoving === false &&
              rectX > oak1X - 20 &&
              rectX < oak1X + 20 &&
              rectY > oak1Y - 20 &&
              rectY < oak1Y + 20 &&
              energy >= 2 &&
              oak1chopped === 0
            ) {
              timer1oak += 1;
              rectMode(CENTER);
              fill("black");
              rect(oak1X, oak1Y - 30, 30, 10);
              rectMode(CORNER);
              fill("white");
              rect(oak1X - 12.5, oak1Y - 32.5, timer1oak / (chopTime / 25), 5);
            }
            if (timer1oak > chopTime) {
              energy -= 2;
              wood += round(random(1, 2));
              oak1chopped = 1;
              timer1oak = 0;
            }
            if (
              isMoving === false &&
              rectX > oak2X - 20 &&
              rectX < oak2X + 20 &&
              rectY > oak2Y - 20 &&
              rectY < oak2Y + 20 &&
              energy >= 2 &&
              oak2chopped === 0
            ) {
              timer2oak += 1;
              rectMode(CENTER);
              fill("black");
              rect(oak2X, oak2Y - 30, 30, 10);
              rectMode(CORNER);
              fill("white");
              rect(oak2X - 12.5, oak2Y - 32.5, timer2oak / (chopTime / 25), 5);
            }
            if (timer2oak > chopTime) {
              energy -= 2;
              wood += round(random(1, 2));
              oak2chopped = 1;
              timer2oak = 0;
            }
            if (
              isMoving === false &&
              rectX > oak3X - 20 &&
              rectX < oak3X + 20 &&
              rectY > oak3Y - 20 &&
              rectY < oak3Y + 20 &&
              energy >= 2 &&
              oak3chopped === 0
            ) {
              timer3oak += 1;
              rectMode(CENTER);
              fill("black");
              rect(oak3X, oak3Y - 30, 30, 10);
              rectMode(CORNER);
              fill("white");
              rect(oak3X - 12.5, oak3Y - 32.5, timer3oak / (chopTime / 25), 5);
            }
            if (timer3oak > chopTime) {
              energy -= 2;
              wood += round(random(1, 2));
              oak3chopped = 1;
              timer3oak = 0;
            }
          }
        
          if (dimension === 1) {
            worldTimer += 1;
        
            // WORLD GENERATION
            if ((worldTimer % 7200 === 1) | (worldTimer % 7200 === 0)) {
              setRandomTrees = 1;
              setRandomStone = 1;
              tree1chopped = 0;
              tree2chopped = 0;
              tree3chopped = 0;
              stone1dug = 0;
              stone2dug = 0;
              stone3dug = 0;
            }
            if (
              (worldTimer % 3600 === 1) | (worldTimer % 3600 === 2) &&
              worldTimer % 7200 != 1
            ) {
              setRandomZombs = 1;
              zomb1health = 5;
              zomb2health = 5;
              zomb1died = 0;
              zomb2died = 0;
            }
            if (setRandomTrees === 1) {
              trees1X = random(20, 380);
              trees1Y = random(200, 380);
              trees2X = random(20, 380);
              trees2Y = random(200, 380);
              trees3X = random(20, 380);
              trees3Y = random(200, 380);
              setRandomTrees = 0;
            }
            if (setRandomStone === 1) {
              stone1X = random(20, 380);
              stone1Y = random(200, 380);
              stone2X = random(20, 380);
              stone2Y = random(200, 380);
              stone3X = random(20, 380);
              stone3Y = random(200, 380);
              setRandomStone = 0;
            }
            if (setRandomZombs === 1) {
              zomb1X = random(20, 380);
              zomb1Y = random(20, 380);
              zomb2X = random(20, 380);
              zomb2Y = random(20, 380);
              setRandomZombs = 0;
            }
            if (zomb1X < rectX) {
              zomb1X += 0.1;
            }
            if (zomb2X < rectX) {
              zomb2X += 0.1;
            }
            if (zomb1X > rectX) {
              zomb1X -= 0.1;
            }
            if (zomb2X > rectX) {
              zomb2X -= 0.1;
            }
            if (zomb1Y < rectY) {
              zomb1Y += 0.1;
            }
            if (zomb2Y < rectY) {
              zomb2Y += 0.1;
            }
            if (zomb1Y > rectY) {
              zomb1Y -= 0.1;
            }
            if (zomb2Y > rectY) {
              zomb2Y -= 0.1;
            }
            fill("green");
            if (zomb1hurt === 1) {
              zomb1timer += 1;
            }
            if (zomb1timer > 0 && zomb1timer <= 5) {
              fill("pink");
            }
            if (zomb1timer > 5) {
              zomb1hurt = 0;
              zomb1timer = 0;
            }
            if (dayTime === 0 && zomb1died === 0) {
              ellipse(zomb1X, zomb1Y, 20);
            }
            if (zomb1health <= 0 && zomb1died === 0) {
              zomb1health = 0;
              bone += round(random(0, 3));
              zomb1died = 1;
              zomb1health = 0.0000000000001;
            }
            fill("green");
            if (zomb2hurt === 1) {
              zomb2timer += 1;
            }
            if (zomb2timer > 0 && zomb2timer <= 5) {
              fill("pink");
            }
            if (zomb2timer > 5) {
              zomb2hurt = 0;
              zomb2timer = 0;
            }
            if (dayTime === 0 && zomb2died === 0) {
              ellipse(zomb2X, zomb2Y, 20);
            }
            if (zomb2health <= 0 && zomb2died === 0) {
              zomb2health = 0;
              bone += round(random(0, 3));
              zomb2died = 1;
              zomb2health = 0.0000000000001;
            }
            if ((worldTimer % 3600 === 1) | (worldTimer % 3600 === 0)) {
              cowHealth = 3;
              chick1health = 1;
              chick2health = 1;
              setRandomChicks = 1;
              setRandomCow = 1;
              chick1died = 0;
              chick2died = 0;
              cowdied = 0;
            }
            fill("brown");
            if (tree1chopped === 0) {
              ellipse(trees1X, trees1Y, 30);
            }
            if (tree2chopped === 0) {
              ellipse(trees2X, trees2Y, 30);
            }
            if (tree3chopped === 0) {
              ellipse(trees3X, trees3Y, 30);
            }
            fill("gray");
            if (stone1dug === 0) {
              ellipse(stone1X, stone1Y, 30);
            }
            if (stone2dug === 0) {
              ellipse(stone2X, stone2Y, 30);
            }
            if (stone3dug === 0) {
              ellipse(stone3X, stone3Y, 30);
            }
            if (setRandomChicks === 1) {
              chick1X = random(0, 400);
              chick1XV = random(0, 100);
              chick1Y = random(0, 400);
              chick1YV = random(0, 100);
              chick2X = random(0, 400);
              chick2XV = random(0, 400);
              chick2Y = random(0, 400);
              chick2YV = random(0, 400);
              setRandomChicks = 0;
            }
            if (chick1X < 0) {
              chick1XV = random(0, 100);
            }
            if (chick1X > 400) {
              chick1XV = -random(0, 100);
            }
            if (chick2X < 0) {
              chick2XV = random(0, 100);
            }
            if (chick2X > 400) {
              chick2XV = -random(0, 100);
            }
            if (chick1Y < 0) {
              chick1YV = random(0, 100);
            }
            if (chick1Y > 400) {
              chick1YV = -random(0, 100);
            }
            if (chick2Y < 0) {
              chick2YV = random(0, 100);
            }
            if (chick2Y > 400) {
              chick2YV = -random(0, 100);
            }
            chick1X += chick1XV / 200;
            chick2X += chick2XV / 200;
            chick1Y += chick1YV / 200;
            chick2Y += chick2YV / 200;
            fill("purple");
            if (c1hurt === 1) {
              c1timer += 1;
            }
            if (c1timer > 0 && c1timer <= 5) {
              fill("pink");
            }
            if (c1timer < 5) {
              c1hurt = 0;
              c1timer = 0;
            }
            if (chick1died === 0) {
              ellipse(chick1X, chick1Y, 15);
            }
            fill("purple");
            if (c2hurt === 1) {
              c2timer += 1;
            }
            if (c2timer > 0 && c2timer <= 5) {
              fill("pink");
            }
            if (c2timer < 5) {
              c2hurt = 0;
              c2timer = 0;
            }
            if (chick2died === 0) {
              ellipse(chick2X, chick2Y, 15);
            }
            if (setRandomCow === 1) {
              cowX = random(0, 400);
              cowXV = random(0, 200);
              cowY = random(0, 400);
              cowYV = random(0, 200);
              setRandomCow = 0;
            }
            if (cowX < 0) {
              cowXV = random(0, 100);
            }
            if (cowX > 400) {
              cowXV = -random(0, 100);
            }
            if (cowY < 0) {
              cowYV = random(0, 100);
            }
            if (cowY > 400) {
              cowYV = -random(0, 100);
            }
            cowX += cowXV / 150;
            cowY += cowYV / 150;
            fill("blue");
            if (cowhurt === 1) {
              cowtimer += 1;
            }
            if (cowtimer > 0 && cowtimer <= 5) {
              fill("pink");
            }
            if (cowtimer > 5) {
              cowhurt = 0;
              cowtimer = 0;
            }
            if (cowdied === 0) {
              ellipse(cowX, cowY, 25);
            }
        
            // INTERACTIONS
            if (
              isMoving === false &&
              rectX > trees1X - 20 &&
              rectX < trees1X + 20 &&
              rectY > trees1Y - 20 &&
              rectY < trees1Y + 20 &&
              energy >= 2 &&
              tree1chopped === 0
            ) {
              timer1chop += 1;
              rectMode(CENTER);
              fill("black");
              rect(trees1X, trees1Y - 30, 30, 10);
              rectMode(CORNER);
              fill("white");
              rect(trees1X - 12.5, trees1Y - 32.5, timer1chop / (chopTime / 25), 5);
            }
            if (timer1chop > chopTime) {
              energy -= 2;
              wood += round(random(1, 2));
              tree1chopped = 1;
              timer1chop = 0;
            }
            if (
              isMoving === false &&
              rectX > trees2X - 20 &&
              rectX < trees2X + 20 &&
              rectY > trees2Y - 20 &&
              rectY < trees2Y + 20 &&
              energy >= 2 &&
              tree2chopped === 0
            ) {
              timer2chop += 1;
              rectMode(CENTER);
              fill("black");
              rect(trees2X, trees2Y - 30, 30, 10);
              rectMode(CORNER);
              fill("white");
              rect(trees2X - 12.5, trees2Y - 32.5, timer2chop / (chopTime / 25), 5);
            }
            if (timer2chop > chopTime) {
              energy -= 2;
              wood += round(random(1, 2));
              tree2chopped = 1;
              timer2chop = 0;
            }
            if (
              isMoving === false &&
              rectX > trees3X - 20 &&
              rectX < trees3X + 20 &&
              rectY > trees3Y - 20 &&
              rectY < trees3Y + 20 &&
              energy >= 2 &&
              tree3chopped === 0
            ) {
              timer3chop += 1;
              rectMode(CENTER);
              fill("black");
              rect(trees3X, trees3Y - 30, 30, 10);
              rectMode(CORNER);
              fill("white");
              rect(trees3X - 12.5, trees3Y - 32.5, timer3chop / (chopTime / 25), 5);
            }
            if (timer3chop > chopTime) {
              energy -= 2;
              wood += round(random(1, 2));
              tree3chopped = 1;
              timer3chop = 0;
            }
            if (
              isMoving === false &&
              rectX > stone1X - 20 &&
              rectX < stone1X + 20 &&
              rectY > stone1Y - 20 &&
              rectY < stone1Y + 20 &&
              energy >= 2 &&
              stone1dug === 0 &&
              mineStone === 1
            ) {
              timer1dig += 1;
              rectMode(CENTER);
              fill("black");
              rect(stone1X, stone1Y - 30, 30, 10);
              rectMode(CORNER);
              fill("white");
              rect(stone1X - 12.5, stone1Y - 32.5, timer1dig / (mineTime / 25), 5);
            }
            if (timer1dig > mineTime) {
              energy -= 3;
              stone += round(random(1, 2));
              stone1dug = 1;
              bAbility = 1;
              timer1dig = 0;
            }
            if (
              isMoving === false &&
              rectX > stone2X - 20 &&
              rectX < stone2X + 20 &&
              rectY > stone2Y - 20 &&
              rectY < stone2Y + 20 &&
              energy >= 2 &&
              stone2dug === 0 &&
              mineStone === 1
            ) {
              timer2dig += 1;
              rectMode(CENTER);
              fill("black");
              rect(stone2X, stone2Y - 30, 30, 10);
              rectMode(CORNER);
              fill("white");
              rect(stone2X - 12.5, stone2Y - 32.5, timer2dig / (mineTime / 25), 5);
            }
            if (timer2dig > mineTime) {
              energy -= 3;
              stone += round(random(1, 2));
              stone2dug = 1;
              bAbility = 1;
              timer2dig = 0;
            }
            if (
              isMoving === false &&
              rectX > stone3X - 20 &&
              rectX < stone3X + 20 &&
              rectY > stone3Y - 20 &&
              rectY < stone3Y + 20 &&
              energy >= 2 &&
              stone3dug === 0 &&
              mineStone === 1
            ) {
              timer3dig += 1;
              rectMode(CENTER);
              fill("black");
              rect(stone3X, stone3Y - 30, 30, 10);
              rectMode(CORNER);
              fill("white");
              rect(stone3X - 12.5, stone3Y - 32.5, timer3dig / (mineTime / 25), 5);
            }
            if (timer3dig > mineTime) {
              energy -= 3;
              stone += round(random(1, 2));
              stone3dug = 1;
              bAbility = 1;
              timer3dig = 0;
            }
            if (
              chick1X > rectX - 25 &&
              chick1X < rectX + 25 &&
              chick1Y > rectY - 25 &&
              chick1Y < rectY + 25 &&
              chick1died === 0
            ) {
              rectMode(CENTER);
              fill("black");
              rect(chick1X, chick1Y - 30, 30, 10);
              rectMode(CORNER);
              fill("white");
              rect(chick1X - 12.5, chick1Y - 32.5, chick1health * 25, 5);
            }
            if (
              chick2X > rectX - 25 &&
              chick2X < rectX + 25 &&
              chick2Y > rectY - 25 &&
              chick2Y < rectY + 25 &&
              chick2died === 0
            ) {
              rectMode(CENTER);
              fill("black");
              rect(chick2X, chick2Y - 30, 30, 10);
              rectMode(CORNER);
              fill("white");
              rect(chick2X - 12.5, chick2Y - 32.5, chick2health * 25, 5);
            }
            if (
              cowX > rectX - 25 &&
              cowX < rectX + 25 &&
              cowY > rectY - 25 &&
              cowY < rectY + 25 &&
              cowdied === 0
            ) {
              rectMode(CENTER);
              fill("black");
              rect(cowX, cowY - 30, 30, 10);
              rectMode(CORNER);
              fill("white");
              rect(cowX - 12.5, cowY - 32.5, cowHealth * (25 / 3), 5);
            }
            if (
              zomb1X > rectX - 25 &&
              zomb1X < rectX + 25 &&
              zomb1Y > rectY - 25 &&
              zomb1Y < rectY + 25 &&
              zomb1died === 0 &&
              dayTime === 0
            ) {
              rectMode(CENTER);
              fill("black");
              rect(zomb1X, zomb1Y - 30, 30, 10);
              rectMode(CORNER);
              fill("white");
              rect(zomb1X - 12.5, zomb1Y - 32.5, zomb1health * 5, 5);
              health -= 1 / 30;
            }
            if (
              zomb2X > rectX - 25 &&
              zomb2X < rectX + 25 &&
              zomb2Y > rectY - 25 &&
              zomb2Y < rectY + 25 &&
              zomb2died === 0 &&
              dayTime === 0
            ) {
              rectMode(CENTER);
              fill("black");
              rect(zomb2X, zomb2Y - 30, 30, 10);
              rectMode(CORNER);
              fill("white");
              rect(zomb2X - 12.5, zomb2Y - 32.5, zomb2health * 5, 5);
              health -= 1 / 30;
            }
          }
          if (dimension > 0) {
            // CHARACTER
            fill(0);
            if (onCar === 0) {
              if (dimension === 1) {
                fill(bg);
              }
              if (dimension === 2) {
                fill(220);
              }
              if (dimension === 3) {
                fill(200);
              }
            }
            rectMode(CENTER);
            rect(rectX, rectY, 20);
            if (energy < 1) {
              speeds = 1;
            }
            if (equippedBoots === 0 && onBat === 0) {
              speeds = 1;
              energyMax = 20;
            }
            if (equippedBoots === 1 && onBat === 0) {
              speeds = 1.2;
              energyMax = 20;
            }
            if (equippedBoots === 2 && onBat === 0) {
              speeds = 1.5;
              energyMax = 20;
            }
            if (equippedBoots === 3 && onBat === 0) {
              speeds = 0.8;
              energyMax = 25;
            }
            if (equippedBoots === 4 && onBat === 0) {
              speeds = 1.7;
              energyMax = 30;
            }
            if (equippedBoots === 5 && onBat === 0) {
              speeds = 2;
              energyMax = 40;
            }
            if (equippedAxes === 0) {
              attack = 1;
              chopTime = 300;
            }
            if (equippedAxes === 1) {
              attack = 2;
              chopTime = 240;
            }
            if (equippedAxes === 2) {
              attack = 3;
              chopTime = 180;
            }
            if (equippedAxes === 3) {
              attack = 5;
              chopTime = 100;
            }
            if (equippedAxes === 4) {
              attack = 8;
              chopTime = 60;
            }
            if (equippedAxes === 5) {
              attack = 12;
              chopTime = 30;
            }
            if (equippedPickaxes === 0) {
              mineStone = 0;
              mineOre = 0;
              mineTime = 360;
              mineTime2 = 460;
            }
            if (equippedPickaxes === 1) {
              mineStone = 1;
              mineOre = 0;
              mineTime = 360;
              mineTime2 = 460;
            }
            if (equippedPickaxes === 2) {
              mineStone = 1;
              mineOre = 0;
              mineTime = 300;
              mineTime2 = 460;
            }
            if (equippedPickaxes === 3) {
              mineStone = 1;
              mineOre = 1;
              mineTime = 240;
              mineTime2 = 460;
            }
            if (equippedPickaxes === 4) {
              mineStone = 1;
              mineOre = 1;
              mineTime = 150;
              mineTime2 = 300;
            }
            if (equippedPickaxes === 5) {
              mineStone = 1;
              mineOre = 1;
              mineTime = 60;
              mineTime2 = 150;
            }
            if (equippedArmour === 0 && onBat === 0) {
              healthMax = 20;
            }
            if (equippedArmour === 1 && onBat === 0) {
              healthMax = 25;
            }
            if (equippedArmour === 2 && onBat === 0) {
              healthMax = 30;
            }
            if (equippedArmour === 3 && onBat === 0) {
              healthMax = 40;
            }
            if (equippedArmour === 4 && onBat === 0) {
              healthMax = 50;
            }
            if (equippedArmour === 5 && onBat === 0) {
              healthMax = 75;
            }
        
            // JOYSTICK
            if (onJoy === 1) {
              strokeWeight(5);
              stroke(0);
              fill(255);
              ellipse(80, 320, 100);
              noStroke();
              fill(0);
              ellipse(joyX, joyY, 50);
              if (pointerIsDown() === false) {
                joyX = 80;
                joyY = 320;
                isMoving = false;
              }
            }
          }
          // GUI
          if (onGui === 1) {
            rectMode(CORNER);
            rect(60, 20, 320, 40);
            rect(60, 70, 320, 40);
            textAlign(LEFT);
            textSize(25);
            textFont("monospace");
            text("HP", 15, 50);
            text("EN", 15, 100);
            fill("white");
            rect(65, 25, health * (310 / healthMax), 30);
            rect(65, 75, energy * (310 / energyMax), 30);
          }
          rectMode(CORNER);
          textAlign(LEFT);
          textSize(25);
          textFont("monospace");
          fill("white");
          if (dimension === 3) {
            if (worldTimer3 > 200) {
              rectMode(CORNER);
              fill(200);
              rect(trect1X, 0, 200, 120);
              rect(trect2X, 0, 200, 120);
              if (trect1X < 0) {
                trect1X += 1;
              }
              if (trect2X > 200) {
                trect2X -= 1;
              }
            }
          }
          if (dimension === 3 && worldTimer3 > 260) {
            openDimensions = 0;
            if (sundied === 0 && youDied === 0) {
              if (sunX < 0) {
                sunYV = random(0, 10);
                sunXV = random(0, 10);
              }
              if (sunX > 400) {
                sunXV = -random(0, 10);
                sunYV = -random(0, 10);
              }
              if (sunY < 0) {
                sunYV = random(0, 10);
                sunXV = random(0, 10);
              }
              if (sunY > 400) {
                sunYV = -random(0, 10);
                sunXV = -random(0, 10);
              }
              sunX += sunXV;
              sunY += sunYV;
              fill("black");
              if (sunhurt === 1) {
                suntimer += 1;
              }
              if (suntimer <= 10 && suntimer > 0) {
                fill("pink");
              }
              if (suntimer > 10) {
                sunhurt = 0;
                suntimer = 0;
              }
              ellipse(sunX, sunY, 40);
        
              if (
                sunX > rectX - 50 &&
                sunX < rectX + 50 &&
                sunY > rectY - 50 &&
                sunY < rectY + 50 &&
                sundied === 0
              ) {
                health -= 1 / 5;
              }
              rectMode(CENTER);
              fill("black");
              rect(sunX, sunY - 38, 30, 10);
              rectMode(CORNER);
              fill("white");
              rect(sunX - 12.5, sunY - 40.5, sunhealth * 0.125, 5);
            }
            if (sundied === 0) {
              sunhealth -= 1 / 36;
            }
            if (sunhealth <= 0) {
              sunhealth = 0;
              openBag = 0;
              sundied = 1;
              youWin = 1;
            }
          }
          if (openBag === 1) {
            fill("white");
            rect(0, 0, 400, 400);
            textAlign(CENTER);
            fill("black");
            textSize(25);
            text("INVENTORY / CRAFTING", 200, 50);
            text("CLOSE", 200, 370);
            textSize(15);
            textAlign(LEFT);
            text("WOOD: " + wood, 20, 110);
            text("STONE: " + stone, 20, 130);
            text("FEATHERS: " + feathers, 20, 150);
            text("LEATHER: " + leather, 20, 170);
            text("BONE: " + bone, 220, 110);
            text("MYSTICAL ORE: " + mysticalore, 220, 130);
            text("FLESH: " + flesh, 220, 150);
            textAlign(CENTER);
            text("BOOTS", 200 / 3, 235);
            text("AXES", 200, 235);
            text("PICKAXES", 1000 / 3, 235);
            text("ARMOUR", 200 / 3, 295);
            text("DIMENSIONS", 200, 295);
            text("INFO / STATS", 1000 / 3, 295);
            stroke("black");
            strokeWeight(1);
            line(0, 80, 400, 80);
            line(0, 320, 400, 320);
            line(0, 200, 400, 200);
            line(0, 260, 400, 260);
            line(400 / 3, 200, 400 / 3, 320);
            line(800 / 3, 200, 800 / 3, 320);
            noStroke();
          }
          if (openBoots === 1) {
            bootsDelay += 1;
            fill("white");
            rect(0, 0, 400, 400);
            if (wbootsBought === 1) {
              fill(220);
              rect(0, 200, 400 / 3, 60);
            }
            if (lbootsBought === 1) {
              fill(220);
              rect(400 / 3, 200, 400 / 3, 60);
            }
            if (sbootsBought === 1) {
              fill(220);
              rect(800 / 3, 200, 400 / 3, 60);
            }
            if (bbootsBought === 1) {
              fill(220);
              rect(0, 260, 400 / 3, 60);
            }
            if (mbootsBought === 1) {
              fill(220);
              rect(400 / 3, 260, 400 / 3, 60);
            }
            fill(220);
            rect(800 / 3, 260, 400 / 3, 60);
            textAlign(CENTER);
            fill("black");
            textSize(25);
            text("BOOTS CRAFTING", 200, 50);
            text("CLOSE", 200, 370);
            textSize(15);
            textAlign(LEFT);
            text("EQUIPPED BOOTS:", 20, 110);
            if (equippedBoots === 0) {
              text("NONE", 20, 130);
            }
            if (equippedBoots === 1) {
              text("WOODEN BOOTS", 20, 130);
            }
            if (equippedBoots === 2) {
              text("LEATHER BOOTS", 20, 130);
            }
            if (equippedBoots === 3) {
              text("STONE BOOTS", 20, 130);
            }
            if (equippedBoots === 4) {
              text("BONE BOOTS", 20, 130);
            }
            if (equippedBoots === 5) {
              text("MYSTICAL BOOTS", 20, 130);
            }
            textAlign(CENTER);
            text("WOODEN BOOTS", 200 / 3, 235);
            text("LEATHER BOOTS", 200, 235);
            text("STONE BOOTS", 1000 / 3, 235);
            text("BONE BOOTS", 200 / 3, 295);
            text("MYSTICAL", 200, 285);
            text("BOOTS", 200, 305);
            stroke("black");
            strokeWeight(1);
            line(0, 80, 400, 80);
            line(0, 320, 400, 320);
            line(0, 200, 400, 200);
            line(0, 260, 400, 260);
            line(400 / 3, 200, 400 / 3, 320);
            line(800 / 3, 200, 800 / 3, 320);
            noStroke();
          }
          if (openAxes === 1) {
            axesDelay += 1;
            fill("white");
            rect(0, 0, 400, 400);
            if (waxesBought === 1) {
              fill(220);
              rect(0, 200, 400 / 3, 60);
            }
            if (saxesBought === 1) {
              fill(220);
              rect(400 / 3, 200, 400 / 3, 60);
            }
            if (baxesBought === 1) {
              fill(220);
              rect(800 / 3, 200, 400 / 3, 60);
            }
            if (maxesBought === 1) {
              fill(220);
              rect(0, 260, 400 / 3, 60);
            }
            if (blaxesBought === 1) {
              fill(220);
              rect(400 / 3, 260, 400 / 3, 60);
            }
            fill(220);
            rect(800 / 3, 260, 400 / 3, 60);
            textAlign(CENTER);
            fill("black");
            textSize(25);
            text("AXES CRAFTING", 200, 50);
            text("CLOSE", 200, 370);
            textSize(15);
            textAlign(LEFT);
            text("EQUIPPED AXE:", 20, 110);
            if (equippedAxes === 0) {
              text("NONE", 20, 130);
            }
            if (equippedAxes === 1) {
              text("WOODEN AXE", 20, 130);
            }
            if (equippedAxes === 2) {
              text("STONE AXE", 20, 130);
            }
            if (equippedAxes === 3) {
              text("BONE AXE", 20, 130);
            }
            if (equippedAxes === 4) {
              text("MYSTICAL AXE", 20, 130);
            }
            if (equippedAxes === 5) {
              text("BLOOD AXE", 20, 130);
            }
            textAlign(CENTER);
            textAlign(CENTER);
            text("WOODEN AXE", 200 / 3, 235);
            text("STONE AXE", 200, 235);
            text("BONE AXE", 1000 / 3, 235);
            text("MYSTICAL AXE", 200 / 3, 295);
            text("BLOOD AXE", 200, 295);
            stroke("black");
            strokeWeight(1);
            line(0, 80, 400, 80);
            line(0, 320, 400, 320);
            line(0, 200, 400, 200);
            line(0, 260, 400, 260);
            line(400 / 3, 200, 400 / 3, 320);
            line(800 / 3, 200, 800 / 3, 320);
            noStroke();
          }
          if (openPickaxes === 1) {
            pickaxesDelay += 1;
            fill("white");
            rect(0, 0, 400, 400);
            if (wpickaxesBought === 1) {
              fill(220);
              rect(0, 200, 400 / 3, 60);
            }
            if (spickaxesBought === 1) {
              fill(220);
              rect(400 / 3, 200, 400 / 3, 60);
            }
            if (bpickaxesBought === 1) {
              fill(220);
              rect(800 / 3, 200, 400 / 3, 60);
            }
            if (mpickaxesBought === 1) {
              fill(220);
              rect(0, 260, 400 / 3, 60);
            }
            if (blpickaxesBought === 1) {
              fill(220);
              rect(400 / 3, 260, 400 / 3, 60);
            }
            fill(220);
            rect(800 / 3, 260, 400 / 3, 60);
            textAlign(CENTER);
            fill("black");
            textSize(25);
            text("PICKAXES CRAFTING", 200, 50);
            text("CLOSE", 200, 370);
            textSize(15);
            textAlign(LEFT);
            text("EQUIPPED PICKAXE:", 20, 110);
            if (equippedPickaxes === 0) {
              text("NONE", 20, 130);
            }
            if (equippedPickaxes === 1) {
              text("WOODEN PICKAXE", 20, 130);
            }
            if (equippedPickaxes === 2) {
              text("STONE PICKAXE", 20, 130);
            }
            if (equippedPickaxes === 3) {
              text("BONE PICKAXE", 20, 130);
            }
            if (equippedPickaxes === 4) {
              text("MYSTICAL PICKAXE", 20, 130);
            }
            if (equippedPickaxes === 5) {
              text("BLOOD PICKAXE", 20, 130);
            }
            textAlign(CENTER);
            textAlign(CENTER);
            text("WOODEN PICKAXE", 200 / 3, 235);
            text("STONE PICKAXE", 200, 235);
            text("BONE PICKAXE", 1000 / 3, 235);
            text("MYSTICAL", 200 / 3, 285);
            text("PICKAXE", 200 / 3, 305);
            text("BLOOD PICKAXE", 200, 295);
            stroke("black");
            strokeWeight(1);
            line(0, 80, 400, 80);
            line(0, 320, 400, 320);
            line(0, 200, 400, 200);
            line(0, 260, 400, 260);
            line(400 / 3, 200, 400 / 3, 320);
            line(800 / 3, 200, 800 / 3, 320);
            noStroke();
          }
          if (openArmour === 1) {
            armourDelay += 1;
            fill("white");
            rect(0, 0, 400, 400);
            if (larmourBought === 1) {
              fill(220);
              rect(0, 200, 400 / 3, 60);
            }
            if (sarmourBought === 1) {
              fill(220);
              rect(400 / 3, 200, 400 / 3, 60);
            }
            if (barmourBought === 1) {
              fill(220);
              rect(800 / 3, 200, 400 / 3, 60);
            }
            if (marmourBought === 1) {
              fill(220);
              rect(0, 260, 400 / 3, 60);
            }
            if (blarmourBought === 1) {
              fill(220);
              rect(400 / 3, 260, 400 / 3, 60);
            }
            fill(220);
            rect(800 / 3, 260, 400 / 3, 60);
            textAlign(CENTER);
            fill("black");
            textSize(25);
            text("ARMOUR CRAFTING", 200, 50);
            text("CLOSE", 200, 370);
            textSize(15);
            textAlign(LEFT);
            text("EQUIPPED ARMOUR:", 20, 110);
            if (equippedArmour === 0) {
              text("NONE", 20, 130);
            }
            if (equippedArmour === 1) {
              text("LEATHER ARMOUR", 20, 130);
            }
            if (equippedArmour === 2) {
              text("STONE ARMOUR", 20, 130);
            }
            if (equippedArmour === 3) {
              text("BONE ARMOUR", 20, 130);
            }
            if (equippedArmour === 4) {
              text("MYSTICAL ARMOUR", 20, 130);
            }
            if (equippedArmour === 5) {
              text("BLOOD ARMOUR", 20, 130);
            }
            textAlign(CENTER);
            textAlign(CENTER);
            text("LEATHER ARMOUR", 200 / 3, 235);
            text("STONE ARMOUR", 200, 235);
            text("BONE ARMOUR", 1000 / 3, 235);
            text("MYSTICAL", 200 / 3, 285);
            text("ARMOUR", 200 / 3, 305);
            text("BLOOD ARMOUR", 200, 295);
            stroke("black");
            strokeWeight(1);
            line(0, 80, 400, 80);
            line(0, 320, 400, 320);
            line(0, 200, 400, 200);
            line(0, 260, 400, 260);
            line(400 / 3, 200, 400 / 3, 320);
            line(800 / 3, 200, 800 / 3, 320);
            noStroke();
          }
          if (openDimensions === 1) {
            dimensionDelay += 1;
            fill("white");
            rect(0, 0, 400, 400);
            fill(220);
            if (earthBought === 1) {
              rect(0, 260, 400 / 3, 60);
            }
            if (moonBought === 1) {
              fill(220);
              rect(400 / 3, 260, 400 / 3, 60);
            }
            if (sunBought === 1) {
              fill(220);
              rect(800 / 3, 260, 400 / 3, 60);
            }
            textAlign(CENTER);
            fill("black");
            textSize(25);
            text("DIMENSIONS", 200, 50);
            text("CLOSE", 200, 370);
            textSize(15);
            textAlign(LEFT);
            text("CURRENT DIMENSION:", 20, 110);
            if (dimension === 1) {
              text("EARTH", 20, 130);
            }
            if (dimension === 2) {
              text("MOON", 20, 130);
            }
            if (dimension === 3) {
              text("SUN", 20, 130);
            }
            textAlign(CENTER);
            textAlign(CENTER);
            text("TO EARTH", 200 / 3, 295);
            text("TO MOON", 200, 295);
            text("TO SUN", 1000 / 3, 295);
            stroke("black");
            strokeWeight(1);
            line(0, 80, 400, 80);
            line(0, 320, 400, 320);
            line(0, 260, 400, 260);
            line(400 / 3, 260, 400 / 3, 320);
            line(800 / 3, 260, 800 / 3, 320);
            noStroke();
          }
          if (openGlossary === 1) {
            glossaryDelay += 1;
            fill("white");
            rect(0, 0, 400, 400);
            textAlign(CENTER);
            fill("black");
            textSize(25);
            text("INFO / STATS", 200, 50);
            text("CLOSE", 200, 370);
            textSize(15);
            textAlign(LEFT);
            text("HEALTH: " + round(health, 1) + "/" + healthMax, 20, 110);
            text("ENERGY: " + round(energy, 1) + "/" + energyMax, 20, 130);
            text(
              "PLAYTIME: " + round((worldTimer + worldTimer2 + worldTimer3) / 45, 1),
              20,
              150
            );
            text("COORDINATES: " + round(rectX) + ", " + round(rectY), 20, 170);
            textAlign(CENTER);
            textAlign(CENTER);
            text("BOOTS", 200 / 3, 235);
            text("AXES", 200, 235);
            text("PICKAXES", 1000 / 3, 235);
            text("ARMOUR", 200 / 3, 295);
            text("DIMENSIONS", 200, 295);
        
            fill("black");
            text("MOBS", 1000 / 3, 295);
            stroke("black");
            strokeWeight(1);
            line(0, 80, 400, 80);
            line(0, 320, 400, 320);
            line(0, 200, 400, 200);
            line(0, 260, 400, 260);
            line(400 / 3, 200, 400 / 3, 320);
            line(800 / 3, 200, 800 / 3, 320);
            noStroke();
          }
          if (openBootsG === 1) {
            fill("white");
            rect(0, 0, 400, 400);
            textAlign(CENTER);
            fill("black");
            textSize(25);
            text("BOOTS INFO", 200, 50);
            text("CLOSE", 200, 370);
            textSize(15);
            textAlign(LEFT);
            text("WOODEN BOOTS", 20, 110);
            text("3 WOOD", 20, 130);
            text("Small speed.", 20, 150);
            text("LEATHER BOOTS", 20, 180);
            text("3 LEATHER", 20, 200);
            text("Decent speed.", 20, 220);
            text("STONE BOOTS", 20, 250);
            text("3 STONE", 20, 270);
            text("Small health boost.", 20, 290);
            text("BONE BOOTS", 220, 110);
            text("3 BONE", 220, 130);
            text("Moderate speed.", 220, 150);
            text("MYSTICAL BOOTS", 220, 180);
            text("3 MYSTICAL ORE", 220, 200);
            text("Faster speed after", 220, 220);
            text("mining stone.", 220, 240);
            stroke("black");
            strokeWeight(1);
            line(0, 80, 400, 80);
            line(0, 320, 400, 320);
            noStroke();
          }
          if (openAxesG === 1) {
            fill("white");
            rect(0, 0, 400, 400);
            textAlign(CENTER);
            fill("black");
            textSize(25);
            text("AXES INFO", 200, 50);
            text("CLOSE", 200, 370);
            textSize(15);
            textAlign(LEFT);
            text("WOODEN AXE", 20, 110);
            text("3 WOOD, 1 LEATHER", 20, 130);
            text("Low attack.", 20, 150);
            text("STONE AXE", 20, 180);
            text("2 STONE, 2 LEATHER,", 20, 200);
            text("1 WOOD (Good attack.)", 20, 220);
            text("BONE AXE", 20, 250);
            text("2 STONE, 2 BONE, 1 FEATHER, 1 WOOD", 20, 270);
            text("High attack.", 20, 290);
            text("MYSTICAL AXE", 220, 110);
            text("3 ORE, 2 BONE", 220, 130);
            text("Legendary attack.", 220, 150);
            text("BLOOD AXE", 220, 180);
            text("1 ORE, 1 BONE,", 220, 200);
            text("1 FLESH", 220, 220);
            text("Insane attack.", 220, 240);
            stroke("black");
            strokeWeight(1);
            line(0, 80, 400, 80);
            line(0, 320, 400, 320);
            noStroke();
          }
          if (openPickaxesG === 1) {
            fill("white");
            rect(0, 0, 400, 400);
            textAlign(CENTER);
            fill("black");
            textSize(25);
            text("PICKAXES INFO", 200, 50);
            text("CLOSE", 200, 370);
            textSize(15);
            textAlign(LEFT);
            text("WOODEN PICKAXE", 20, 110);
            text("5 WOOD", 20, 130);
            text("Slow mining.", 20, 150);
            text("STONE PICKAXE", 20, 180);
            text("3 STONE, 1 WOOD,", 20, 200);
            text("1 LEATHER", 20, 220);
            text("BONE PICKAXE", 20, 250);
            text("3 BONE, 1 WOOD, STONE, FEATHER, LEATHER", 20, 270);
            text("Can mine ore.", 20, 290);
            text("MYSTICAL PICKAXE", 220, 110);
            text("4 ORE, 1 BONE,", 220, 130);
            text("1 LEATHER", 220, 150);
            text("BLOOD PICKAXE", 220, 180);
            text("4 FLESH, 3 ORE", 220, 200);
            text("Fastest pickaxe.", 220, 220);
            stroke("black");
            strokeWeight(1);
            line(0, 80, 400, 80);
            line(0, 320, 400, 320);
            noStroke();
          }
          if (openArmourG === 1) {
            fill("white");
            rect(0, 0, 400, 400);
            textAlign(CENTER);
            fill("black");
            textSize(25);
            text("ARMOUR INFO", 200, 50);
            text("CLOSE", 200, 370);
            textSize(15);
            textAlign(LEFT);
            text("LEATHER ARMOUR", 20, 110);
            text("5 LEATHER", 20, 130);
            text("Little defence.", 20, 150);
            text("STONE ARMOUR", 20, 180);
            text("5 STONE", 20, 200);
            text("Some defence.", 20, 220);
            text("BONE ARMOUR", 20, 250);
            text("5 BONE", 20, 270);
            text("Decent defence.", 20, 290);
            text("MYSTICAL ARMOUR", 220, 110);
            text("5 ORE", 220, 130);
            text("High defence.", 220, 150);
            text("BLOOD ARMOUR", 220, 180);
            text("5 FLESH", 220, 200);
            text("Legendary defence.", 220, 220);
            stroke("black");
            strokeWeight(1);
            line(0, 80, 400, 80);
            line(0, 320, 400, 320);
            noStroke();
          }
          if (openDimensionsG === 1) {
            fill("white");
            rect(0, 0, 400, 400);
            textAlign(CENTER);
            fill("black");
            textSize(25);
            text("DIMENSIONS INFO", 200, 50);
            text("CLOSE", 200, 370);
            textSize(15);
            textAlign(LEFT);
            text("EARTH", 20, 110);
            text("UNLOCKED!", 20, 130);
            text("Home planet.", 20, 150);
            text("MOON", 20, 180);
            text("2 of everything", 20, 200);
            text("except ore and flesh.", 20, 220);
            text("SUN", 20, 250);
            text("3 of every material in the game.", 20, 270);
            text("Has a boss.", 20, 290);
            stroke("black");
            strokeWeight(1);
            line(0, 80, 400, 80);
            line(0, 320, 400, 320);
            noStroke();
          }
          if (openMobsG === 1) {
            fill("white");
            rect(0, 0, 400, 400);
            textAlign(CENTER);
            fill("black");
            textSize(25);
            text("MOBS INFO", 200, 50);
            text("CLOSE", 200, 370);
            textSize(15);
            textAlign(LEFT);
            fill("purple");
            text("CHICKEN", 20, 110);
            fill("black");
            text("1 HEALTH", 20, 130);
            text('"Energy bar".', 20, 150);
            fill("blue");
            text("COW", 20, 180);
            fill("black");
            text("3 HEALTH", 20, 200);
            text("Moo. Moo.", 20, 220);
            fill("green");
            text("BANDIT", 20, 250);
            fill("black");
            text("5 HEALTH", 20, 270);
            text("Real danger.", 20, 290);
            fill(139, 128, 0);
            text("ALIEN", 220, 110);
            fill("black");
            text("10 HEALTH", 220, 130);
            text("Area 51 imports.", 220, 150);
            text("SUN GOD", 220, 180);
            text("???", 220, 200);
            text("???", 220, 220);
            stroke("black");
            strokeWeight(1);
            line(0, 80, 400, 80);
            line(0, 320, 400, 320);
            noStroke();
          }
          if (health <= 0) {
            youDied = 1;
            fill("white");
            rect(0, 0, 400, 400);
            textAlign(CENTER);
            textSize(50);
            fill("black");
            text("YOU DIED", 200, 150);
            textSize(20);
            rectMode(CENTER);
            fill("white");
            stroke("black");
            strokeWeight(5);
            rect(200, 250, 210, 60);
            noStroke();
            fill("black");
            text("TO MAIN MENU", 200, 256);
          }
          if (openBag === 1) {
            shopDelay += 1;
          } else {
            shopDelay = 0;
          }
        
          if (dimension === 1) {
            if (chick1health <= 0) {
              chick1health = 0;
              chick1died = 1;
              energy += 2;
              feathers += round(random(0, 2));
              chick1health = 0.000000000000001;
            }
            if (chick2health <= 0) {
              chick2health = 0;
              chick2died = 1;
              energy += 2;
              feathers += round(random(0, 2));
              chick2health = 0.000000000000001;
            }
            if (cowHealth <= 0) {
              cowHealth = 0;
              cowdied = 1;
              energy += 5;
              leather += round(random(0, 4));
              cowHealth = 0.000000000000000001;
            }
          }
          if (dimension === 0) {
            background(255);
            titlec -= 4;
            fill(titlec);
            textAlign(CENTER);
            textSize(60);
            text("LANDF0RM", 200, 100);
            if (titlec < 0) {
              fill("white");
              stroke("black");
              strokeWeight(5);
              rectMode(CORNER);
              rect(60, 140, 280, 60);
              rect(60, 210, 280, 60);
              rect(60, 280, 280, 60);
              noStroke();
              textSize(30);
              fill("black");
              text("PLAY", 200, 180);
              text("SETTINGS", 200, 250);
              text("MODS", 200, 320);
            }
          }
          if (youWin === 1) {
            fill("white");
            rect(0, 0, 400, 400);
            textAlign(CENTER);
            textSize(50);
            fill("black");
            text("YOU WIN", 200, 150);
            textSize(20);
            rectMode(CENTER);
            fill("white");
            stroke("black");
            strokeWeight(5);
            rect(200, 250, 210, 60);
            noStroke();
            fill("black");
            text("PLAY AGAIN", 200, 256);
          }
          if (dimension === 0 && openSettings === 1) {
            fill("white");
            rect(0, 0, 400, 400);
            if (onGui === 1) {
              fill(220);
              rect(240, 80, 80, 80);
            }
            if (onGui === 0) {
              fill(220);
              rect(320, 80, 80, 80);
            }
            if (onJoy === 1) {
              fill(220);
              rect(240, 160, 80, 80);
            }
            if (onJoy === 0) {
              fill(220);
              rect(320, 160, 80, 80);
            }
            if (onBat === 1) {
              fill(220);
              rect(240, 240, 80, 80);
            }
            if (onBat === 0) {
              fill(220);
              rect(320, 240, 80, 80);
            }
            textAlign(CENTER);
            fill("black");
            textSize(25);
            text("SETTINGS", 200, 50);
            text("CLOSE", 200, 370);
            textAlign(LEFT);
            text("GUI", 20, 130);
            text("JOYSTICK", 20, 210);
            text("CREATIVE", 20, 290);
            textAlign(CENTER);
            text("ON", 280, 130);
            text("ON", 280, 210);
            text("ON", 280, 290);
            text("OFF", 360, 130);
            text("OFF", 360, 210);
            text("OFF", 360, 290);
            stroke("black");
            strokeWeight(1);
            line(0, 80, 400, 80);
            line(0, 320, 400, 320);
            line(0, 160, 400, 160);
            line(0, 240, 400, 240);
            line(240, 80, 240, 320);
            line(320, 80, 320, 320);
            noStroke();
          }
          if (dimension === 0 && openMods === 1) {
            fill("white");
            rect(0, 0, 400, 400);
            if (onHeart === 1) {
              fill(220);
              rect(240, 80, 80, 80);
            }
            if (onHeart === 0) {
              fill(220);
              rect(320, 80, 80, 80);
            }
            if (onCar === 0) {
              fill(220);
              rect(240, 160, 80, 80);
            }
            if (onCar === 1) {
              fill(220);
              rect(320, 160, 80, 80);
            }
            if (onMoon === 1) {
              fill(220);
              rect(240, 240, 80, 80);
            }
            if (onMoon === 0) {
              fill(220);
              rect(320, 240, 80, 80);
            }
            textAlign(CENTER);
            fill("black");
            textSize(25);
            text("MODS", 200, 50);
            text("CLOSE", 200, 370);
            text("ON", 280, 130);
            text("ON", 280, 210);
            text("ON", 280, 290);
            text("OFF", 360, 130);
            text("OFF", 360, 210);
            text("OFF", 360, 290);
            textAlign(LEFT);
            text("3 HEARTS", 20, 130);
            text("INVISIBILITY", 20, 210);
            text("START ON MOON", 20, 290);
            stroke("black");
            strokeWeight(1);
            line(0, 80, 400, 80);
            line(0, 320, 400, 320);
            line(0, 160, 400, 160);
            line(0, 240, 400, 240);
            line(240, 80, 240, 320);
            line(320, 80, 320, 320);
            noStroke();
          }
          if (openGlossary === 1) {
            glossaryTimer += 1;
          }
          if (openGlossary === 0) {
            glossaryTimer = 0;
          }
          if (keyIsPressed) {
            if (keyCode === UP_ARROW) {
            rectY -= 1.5
          }
            if (keyCode === DOWN_ARROW) {
            rectY += 1.5
          }
            if (keyCode === RIGHT_ARROW) {
            rectX += 1.5
          }
            if (keyCode === LEFT_ARROW) {
            rectX -= 1.5
          }
          }
          pop();
        }
        
        function mouseDragged() {
          if (onJoy === 1) {
            if (dimension > 0) {
              if (joyX < 30) {
                joyX = 30;
              }
              if (joyX > 130) {
                joyX = 130;
              }
              if (joyY < 270) {
                joyY = 270;
              }
              if (joyY > 370) {
                joyY = 370;
              }
            }
            if (
              pointerIsDown() &&
              gameMouseX() > 0 &&
              gameMouseX() < 200 &&
              gameMouseY() > 200 &&
              gameMouseY() < 400 &&
              youDied === 0
            ) {
              joyX = gamePMouseX();
              joyY = gamePMouseY();
              isMoving = true;
            } else {
              isMoving = false;
            }
          }
        }
        
        
        function touchStarted() {
          mousePressed();
          return false;
        }
        
        function touchMoved() {
          mouseDragged();
          return false;
        }
        
        function mousePressed() {
          if (dimension === 0) {
            if (
              openSettings === 1 &&
              openBag === 0 &&
              pointerIsDown() &&
              gameMouseX() > 0 &&
              gameMouseX() < 400 &&
              gameMouseY() > 320 &&
              gameMouseY() < 400
            ) {
              openSettings = 0;
            }
            if (
              openMods === 1 &&
              openBag === 0 &&
              pointerIsDown() &&
              gameMouseX() > 0 &&
              gameMouseX() < 400 &&
              gameMouseY() > 320 &&
              gameMouseY() < 400
            ) {
              openMods = 0;
            }
            if (openMods === 1) {
              if (
                gameMouseX() > 240 &&
                gameMouseX() < 320 &&
                gameMouseY() > 80 &&
                gameMouseY() < 160 &&
                pointerIsDown()
              ) {
                onHeart = 1;
              }
              if (
                gameMouseX() > 240 &&
                gameMouseX() < 320 &&
                gameMouseY() > 160 &&
                gameMouseY() < 240 &&
                pointerIsDown()
              ) {
                onCar = 0;
              }
              if (
                gameMouseX() > 240 &&
                gameMouseX() < 320 &&
                gameMouseY() > 240 &&
                gameMouseY() < 320 &&
                pointerIsDown()
              ) {
                onMoon = 1;
              }
              if (
                gameMouseX() > 320 &&
                gameMouseX() < 400 &&
                gameMouseY() > 240 &&
                gameMouseY() < 320 &&
                pointerIsDown()
              ) {
                onMoon = 0;
              }
              if (
                gameMouseX() > 320 &&
                gameMouseX() < 400 &&
                gameMouseY() > 80 &&
                gameMouseY() < 160 &&
                pointerIsDown()
              ) {
                onHeart = 0;
              }
              if (
                gameMouseX() > 320 &&
                gameMouseX() < 400 &&
                gameMouseY() > 160 &&
                gameMouseY() < 240 &&
                pointerIsDown()
              ) {
                onCar = 1;
              }
            }
            if (openSettings === 1) {
              if (
                gameMouseX() > 240 &&
                gameMouseX() < 320 &&
                gameMouseY() > 80 &&
                gameMouseY() < 160 &&
                pointerIsDown()
              ) {
                onGui = 1;
              }
              if (
                gameMouseX() > 240 &&
                gameMouseX() < 320 &&
                gameMouseY() > 160 &&
                gameMouseY() < 240 &&
                pointerIsDown()
              ) {
                onJoy = 1;
              }
              if (
                gameMouseX() > 240 &&
                gameMouseX() < 320 &&
                gameMouseY() > 240 &&
                gameMouseY() < 320 &&
                pointerIsDown()
              ) {
                onBat = 1;
              }
              if (
                gameMouseX() > 320 &&
                gameMouseX() < 400 &&
                gameMouseY() > 80 &&
                gameMouseY() < 160 &&
                pointerIsDown()
              ) {
                onGui = 0;
              }
              if (
                gameMouseX() > 320 &&
                gameMouseX() < 400 &&
                gameMouseY() > 160 &&
                gameMouseY() < 240 &&
                pointerIsDown()
              ) {
                onJoy = 0;
              }
              if (
                gameMouseX() > 320 &&
                gameMouseX() < 400 &&
                gameMouseY() > 240 &&
                gameMouseY() < 320 &&
                pointerIsDown()
              ) {
                onBat = 0;
              }
            }
          }
          if (youDied === 1) {
            if (
              gameMouseX() > 95 &&
              gameMouseX() < 305 &&
              gameMouseY() > 220 &&
              gameMouseY() < 280 &&
              pointerIsDown()
            ) {
              glossaryTimer = 0;
              onCar = 1;
              onHeart = 0;
              onMoon = 0;
              onGui = 1;
              onJoy = 1;
              onBat = 0;
              youWin = 0;
              sundied = 0;
              sunX = 200;
              sunY = 330;
              sunXV = 50;
              sunYV = 50;
              resetV = 0;
              titlec = 255;
              openSettings = 0;
              openMods = 0;
              bg = 255;
              dimension = 0;
              worldTimer = 0;
              worldTimer2 = 0;
              worldTimer3 = 0;
              youDied = 0;
              dayTime = 1;
              waitDay = 0;
              waitNight = 0;
              energy = 20;
              energyMax = 20;
              health = 20;
              healthMax = 20;
              attack = 1;
              joyX = 80;
              joyY = 320;
              rectX = 200;
              rectY = 200;
              speeds = 1;
              setRandomTrees = 0;
              setRandomChicks = 0;
              setRandomCow = 0;
              setRandomStone = 0;
              setRandomZombs = 0;
              setRandomOres = 0;
              oak1chopped = 0;
              oak2chopped = 0;
              oak3chopped = 0;
              timer1oak = 0;
              timer2oak = 0;
              timer3oak = 0;
              setRandomOak = 0;
              setRandomMuts = 0;
              timer1chop = 0;
              timer2chop = 0;
              timer3chop = 0;
              tree1chopped = 0;
              tree2chopped = 0;
              tree3chopped = 0;
              timer1dig = 0;
              timer2dig = 0;
              timer3dig = 0;
              timer4dig = 0;
              timer5dig = 0;
              timer6dig = 0;
              stone1dug = 0;
              stone2dug = 0;
              stone3dug = 0;
              ore1dug = 0;
              ore2dug = 0;
              ore3dug = 0;
              chick1killed = 0;
              chick2killed = 0;
              chick1died = 0;
              chick2died = 0;
              cowdied = 0;
              zomb1died = 0;
              zomb2died = 0;
              mut1died = 0;
              mut2died = 0;
              mut3died = 0;
              mut4died = 0;
              chopTime = 300;
              wood = 0;
              stone = 0;
              feathers = 0;
              leather = 0;
              bone = 0;
              mysticalore = 0;
              flesh = 0;
              openBag = 0;
              openBoots = 0;
              openAxes = 0;
              openPickaxes = 0;
              openArmour = 0;
              openDimensions = 0;
              openGlossary = 0;
              equippedBoots = 0;
              equippedAxes = 0;
              equippedPickaxes = 0;
              equippedArmour = 0;
              wbootsBought = 0;
              lbootsBought = 0;
              sbootsBought = 0;
              bbootsBought = 0;
              mbootsBought = 0;
              wpickaxesBought = 0;
              spickaxesBought = 0;
              bpickaxesBought = 0;
              mpickaxesBought = 0;
              blpickaxesBought = 0;
              waxesBought = 0;
              saxesBought = 0;
              baxesBought = 0;
              maxesBought = 0;
              blaxesBought = 0;
              larmourBought = 0;
              sarmourBought = 0;
              barmourBought = 0;
              marmourBought = 0;
              blarmourBought = 0;
              bootsDelay = 0;
              chick1health = 1;
              chick2health = 1;
              cowHealth = 3;
              zomb1health = 5;
              zomb2health = 5;
              mut1health = 10;
              mut2health = 10;
              mut3health = 10;
              mut4health = 10;
              sunhealth = 200;
              trect1X = -200;
              trect2X = 400;
              axesDelay = 0;
              pickaxesDelay = 0;
              armourDelay = 0;
              dimensionDelay = 0;
              glossaryDelay = 0;
              shopDelay = 0;
              mineStone = 0;
              mineTime = 360;
              mineOre = 0;
              mineTime2 = 460;
              moonBought = 0;
              earthBought = 1;
              sunBought = 0;
              currentDimension = 0;
              bAbility = 0;
              babilityTimer = 0;
              aAbility = 0;
              testCrit = 0;
              openBootsG = 0;
              openAxesG = 0;
              openPickaxesG = 0;
              openArmourG = 0;
              openDimensionsG = 0;
              openMobsG = 0;
              crit = 0;
              hitCh1 = 0;
              hitCh2 = 0;
              hitCo1 = 0;
              hitZ1 = 0;
              hitZ2 = 0;
              hitS1 = 0;
              hitS2 = 0;
              hitS3 = 0;
              hitS4 = 0;
              hitSun = 0;
            }
          }
          if (youWin === 1) {
            if (
              gameMouseX() > 95 &&
              gameMouseX() < 305 &&
              gameMouseY() > 220 &&
              gameMouseY() < 280 &&
              pointerIsDown()
            ) {
              glossaryTimer = 0;
              onCar = 1;
              onHeart = 0;
              onMoon = 0;
              onGui = 1;
              onJoy = 1;
              onBat = 0;
              youWin = 0;
              sundied = 0;
              sunX = 200;
              sunY = 330;
              sunXV = 50;
              oak1chopped = 0;
              oak2chopped = 0;
              oak3chopped = 0;
              timer1oak = 0;
              timer2oak = 0;
              timer3oak = 0;
              setRandomOak = 0;
              sunYV = 50;
              resetV = 0;
              titlec = 255;
              openSettings = 0;
              openMods = 0;
              bg = 255;
              dimension = 0;
              worldTimer = 0;
              worldTimer2 = 0;
              worldTimer3 = 0;
              youDied = 0;
              dayTime = 1;
              waitDay = 0;
              waitNight = 0;
              energy = 20;
              energyMax = 20;
              health = 20;
              healthMax = 20;
              attack = 1;
              joyX = 80;
              joyY = 320;
              rectX = 200;
              rectY = 200;
              speeds = 1;
              earthBought = 1;
              setRandomTrees = 0;
              setRandomChicks = 0;
              setRandomCow = 0;
              setRandomStone = 0;
              setRandomZombs = 0;
              setRandomOres = 0;
              setRandomMuts = 0;
              timer1chop = 0;
              timer2chop = 0;
              timer3chop = 0;
              tree1chopped = 0;
              tree2chopped = 0;
              tree3chopped = 0;
              timer1dig = 0;
              timer2dig = 0;
              timer3dig = 0;
              timer4dig = 0;
              timer5dig = 0;
              timer6dig = 0;
              stone1dug = 0;
              stone2dug = 0;
              stone3dug = 0;
              ore1dug = 0;
              ore2dug = 0;
              ore3dug = 0;
              chick1killed = 0;
              chick2killed = 0;
              chick1died = 0;
              chick2died = 0;
              cowdied = 0;
              zomb1died = 0;
              zomb2died = 0;
              mut1died = 0;
              mut2died = 0;
              mut3died = 0;
              mut4died = 0;
              chopTime = 300;
              wood = 0;
              stone = 0;
              feathers = 0;
              leather = 0;
              bone = 0;
              mysticalore = 0;
              flesh = 0;
              openBag = 0;
              openBoots = 0;
              openAxes = 0;
              openPickaxes = 0;
              openArmour = 0;
              openDimensions = 0;
              openGlossary = 0;
              equippedBoots = 0;
              equippedAxes = 0;
              equippedPickaxes = 0;
              equippedArmour = 0;
              wbootsBought = 0;
              lbootsBought = 0;
              sbootsBought = 0;
              bbootsBought = 0;
              mbootsBought = 0;
              wpickaxesBought = 0;
              spickaxesBought = 0;
              bpickaxesBought = 0;
              mpickaxesBought = 0;
              blpickaxesBought = 0;
              waxesBought = 0;
              saxesBought = 0;
              baxesBought = 0;
              maxesBought = 0;
              blaxesBought = 0;
              larmourBought = 0;
              sarmourBought = 0;
              barmourBought = 0;
              marmourBought = 0;
              blarmourBought = 0;
              bootsDelay = 0;
              chick1health = 1;
              chick2health = 1;
              cowHealth = 3;
              zomb1health = 5;
              zomb2health = 5;
              mut1health = 10;
              mut2health = 10;
              mut3health = 10;
              mut4health = 10;
              sunhealth = 200;
              trect1X = -200;
              trect2X = 400;
              axesDelay = 0;
              pickaxesDelay = 0;
              armourDelay = 0;
              dimensionDelay = 0;
              glossaryDelay = 0;
              shopDelay = 0;
              mineStone = 0;
              mineTime = 360;
              mineOre = 0;
              mineTime2 = 460;
              moonBought = 0;
              sunBought = 0;
              currentDimension = 0;
              bAbility = 0;
              babilityTimer = 0;
              aAbility = 0;
              testCrit = 0;
              openBootsG = 0;
              openAxesG = 0;
              openPickaxesG = 0;
              openArmourG = 0;
              openDimensionsG = 0;
              openMobsG = 0;
              crit = 0;
            }
          }
          if (dimension === 0 && titlec < 0) {
            if (
              gameMouseX() > 60 &&
              gameMouseX() < 340 &&
              gameMouseY() > 140 &&
              gameMouseY() < 200 &&
              pointerIsDown() &&
              openMods === 0 &&
              openSettings === 0 &&
              onMoon === 0 &&
              dimension < 3
            ) {
              dimension = 1;
            }
            if (
              gameMouseX() > 60 &&
              gameMouseX() < 340 &&
              gameMouseY() > 140 &&
              gameMouseY() < 200 &&
              pointerIsDown() &&
              openMods === 0 &&
              openSettings === 0 &&
              onMoon === 1
            ) {
              moonBought = 1;
              earthBought = 0;
              dimension = 2;
            }
            if (
              gameMouseX() > 60 &&
              gameMouseX() < 340 &&
              gameMouseY() > 210 &&
              gameMouseY() < 270 &&
              pointerIsDown() &&
              openMods === 0 &&
              openSettings === 0
            ) {
              openSettings = 1;
            }
            if (
              gameMouseX() > 60 &&
              gameMouseX() < 340 &&
              gameMouseY() > 280 &&
              gameMouseY() < 340 &&
              pointerIsDown() &&
              openSettings === 0 &&
              openMods === 0
            ) {
              openMods = 1;
            }
          }
          if (dimension > 0) {
            if (
              sunX > rectX - 40 &&
              sunX < rectX + 40 &&
              sunY > rectY - 40 &&
              sunY < rectY + 40 &&
              pointerIsDown() &&
              gameMouseX() > sunX - 20 &&
              gameMouseX() < sunX + 20 &&
              gameMouseY() > sunY - 20 &&
              gameMouseY() < sunY + 20 &&
              sundied === 0 &&
              youDied === 0
            ) {
              testCrit = 1;
              sunhealth -= attack;
              sunhurt = 1;
            }
            if (dimension === 2) {
              if (
                mut1X > rectX - 25 &&
                mut1X < rectX + 25 &&
                mut1Y > rectY - 25 &&
                mut1Y < rectY + 25 &&
                pointerIsDown() &&
                gameMouseX() > mut1X - 20 &&
                gameMouseX() < mut1X + 20 &&
                gameMouseY() > mut1Y - 20 &&
                gameMouseY() < mut1Y + 20 &&
                mut1died === 0 &&
                youDied === 0
              ) {
                testCrit = 1;
                mut1health -= attack;
                mut1hurt = 1;
              }
              if (
                mut2X > rectX - 25 &&
                mut2X < rectX + 25 &&
                mut2Y > rectY - 25 &&
                mut2Y < rectY + 25 &&
                pointerIsDown() &&
                gameMouseX() > mut2X - 20 &&
                gameMouseX() < mut2X + 20 &&
                gameMouseY() > mut2Y - 20 &&
                gameMouseY() < mut2Y + 20 &&
                mut2died === 0 &&
                youDied === 0
              ) {
                testCrit = 1;
                mut2health -= attack;
                mut2hurt = 2;
              }
              if (
                mut3X > rectX - 25 &&
                mut3X < rectX + 25 &&
                mut3Y > rectY - 25 &&
                mut3Y < rectY + 25 &&
                pointerIsDown() &&
                gameMouseX() > mut3X - 20 &&
                gameMouseX() < mut3X + 20 &&
                gameMouseY() > mut3Y - 20 &&
                gameMouseY() < mut3Y + 20 &&
                mut3died === 0 &&
                youDied === 0
              ) {
                testCrit = 1;
                mut3health -= attack;
                mut3hurt = 1;
              }
              if (
                mut4X > rectX - 25 &&
                mut4X < rectX + 25 &&
                mut4Y > rectY - 25 &&
                mut4Y < rectY + 25 &&
                pointerIsDown() &&
                gameMouseX() > mut4X - 20 &&
                gameMouseX() < mut4X + 20 &&
                gameMouseY() > mut4Y - 20 &&
                gameMouseY() < mut4Y + 20 &&
                mut4died === 0 &&
                youDied === 0
              ) {
                testCrit = 1;
                mut4health -= attack;
                mut4hurt = 1;
              }
            }
            if (
              pointerIsDown() &&
              gameMouseX() > rectX - 10 &&
              gameMouseX() < rectX + 10 &&
              gameMouseY() > rectY - 10 &&
              gameMouseY() < rectY + 10 &&
              openBag === 0 &&
              youDied === 0
            ) {
              openBag = 1;
            }
            if (
              openBag === 1 &&
              pointerIsDown() &&
              gameMouseX() > 0 &&
              gameMouseX() < 400 &&
              gameMouseY() > 320 &&
              gameMouseY() < 400 &&
              openBoots === 0 &&
              openAxes === 0 &&
              openPickaxes === 0 &&
              openArmour === 0 &&
              openDimensions === 0 &&
              openGlossary === 0 &&
              youDied === 0
            ) {
              axesDelay = 0;
              openBag = 0;
            }
            if (
              openBag === 1 &&
              pointerIsDown() &&
              gameMouseX() > 0 &&
              gameMouseX() < 400 / 3 &&
              gameMouseY() > 200 &&
              gameMouseY() < 260 &&
              youDied === 0 &&
              openBoots === 0 &&
              openAxes === 0 &&
              openPickaxes === 0 &&
              openArmour === 0 &&
              openDimensions === 0 &&
              openGlossary === 0 &&
              shopDelay > 30
            ) {
              shopDelay = 0;
              openBoots = 1;
            }
            if (
              pointerIsDown() &&
              gameMouseX() > 0 &&
              gameMouseX() < 400 &&
              gameMouseY() > 320 &&
              gameMouseY() < 400 &&
              openBoots === 1 &&
              youDied === 0
            ) {
              bootsDelay = 0;
              shopDelay = 0;
              openBoots = 0;
            }
            if (
              openBoots === 1 &&
              pointerIsDown() &&
              gameMouseX() > 0 &&
              gameMouseX() < 400 / 3 &&
              gameMouseY() > 200 &&
              gameMouseY() < 260 &&
              wood >= 3 &&
              bootsDelay > 30 &&
              wbootsBought === 0 &&
              youDied === 0
            ) {
              wood -= 3;
              equippedBoots = 1;
              wbootsBought = 1;
            }
            if (
              openBoots === 1 &&
              pointerIsDown() &&
              gameMouseX() > 0 &&
              gameMouseX() < 400 / 3 &&
              gameMouseY() > 200 &&
              gameMouseY() < 260 &&
              bootsDelay > 30 &&
              wbootsBought === 1 &&
              youDied === 0
            ) {
              equippedBoots = 1;
            }
            if (
              openBoots === 1 &&
              pointerIsDown() &&
              gameMouseX() > 400 / 3 &&
              gameMouseX() < 800 / 3 &&
              gameMouseY() > 200 &&
              gameMouseY() < 260 &&
              leather >= 3 &&
              lbootsBought === 0 &&
              youDied === 0
            ) {
              leather -= 3;
              equippedBoots = 2;
              lbootsBought = 1;
            }
            if (
              openBoots === 1 &&
              pointerIsDown() &&
              gameMouseX() > 400 / 3 &&
              gameMouseX() < 800 / 3 &&
              gameMouseY() > 200 &&
              gameMouseY() < 260 &&
              lbootsBought === 1 &&
              youDied === 0
            ) {
              equippedBoots = 2;
            }
            if (dimension === 1) {
              if (
                chick1X > rectX - 25 &&
                chick1X < rectX + 25 &&
                chick1Y > rectY - 25 &&
                chick1Y < rectY + 25 &&
                pointerIsDown() &&
                gameMouseX() > chick1X - 20 &&
                gameMouseX() < chick1X + 20 &&
                gameMouseY() > chick1Y - 20 &&
                gameMouseY() < chick1Y + 20 &&
                chick1died === 0 &&
                youDied === 0
              ) {
                testCrit = 1;
                chick1health -= attack;
                c1hurt = 1;
              }
              if (
                chick2X > rectX - 25 &&
                chick2X < rectX + 25 &&
                chick2Y > rectY - 25 &&
                chick2Y < rectY + 25 &&
                pointerIsDown() &&
                gameMouseX() > chick2X - 20 &&
                gameMouseX() < chick2X + 20 &&
                gameMouseY() > chick2Y - 20 &&
                gameMouseY() < chick2Y + 20 &&
                chick2died === 0 &&
                youDied === 0
              ) {
                testCrit = 1;
                chick2health -= attack;
                c2hurt = 1;
              }
              if (
                cowX > rectX - 25 &&
                cowX < rectX + 25 &&
                cowY > rectY - 25 &&
                cowY < rectY + 25 &&
                pointerIsDown() &&
                gameMouseX() > cowX - 20 &&
                gameMouseX() < cowX + 20 &&
                gameMouseY() > cowY - 20 &&
                gameMouseY() < cowY + 20 &&
                cowdied === 0 &&
                youDied === 0
              ) {
                testCrit = 1;
                cowHealth -= attack;
                health -= 2;
                cowhurt = 1;
              }
            }
            if (
              openBag === 1 &&
              pointerIsDown() &&
              gameMouseX() > 400 / 3 &&
              gameMouseX() < 800 / 3 &&
              gameMouseY() > 200 &&
              gameMouseY() < 260 &&
              youDied === 0 &&
              shopDelay > 30 &&
              openBoots === 0 &&
              openAxes === 0 &&
              openPickaxes === 0 &&
              openArmour === 0 &&
              openDimensions === 0 &&
              openGlossary === 0 &&
              youDied === 0 &&
              shopDelay > 30
            ) {
              shopDelay = 0;
              openAxes = 1;
            }
            if (
              pointerIsDown() &&
              gameMouseX() > 0 &&
              gameMouseX() < 400 &&
              gameMouseY() > 320 &&
              gameMouseY() < 400 &&
              openAxes === 1 &&
              youDied === 0
            ) {
              axesDelay = 0;
              shopDelay = 0;
              openAxes = 0;
            }
            if (
              openAxes === 1 &&
              pointerIsDown() &&
              gameMouseX() > 0 &&
              gameMouseX() < 400 / 3 &&
              gameMouseY() > 200 &&
              gameMouseY() < 260 &&
              wood >= 3 &&
              leather >= 1 &&
              waxesBought === 0 &&
              youDied === 0
            ) {
              wood -= 3;
              leather -= 1;
              equippedAxes = 1;
              waxesBought = 1;
            }
            if (
              openAxes === 1 &&
              pointerIsDown() &&
              gameMouseX() > 0 &&
              gameMouseX() < 400 / 3 &&
              gameMouseY() > 200 &&
              gameMouseY() < 260 &&
              waxesBought === 1 &&
              youDied === 0
            ) {
              equippedAxes = 1;
            }
            if (
              openAxes === 1 &&
              pointerIsDown() &&
              gameMouseX() > 0 &&
              gameMouseX() < 400 / 3 &&
              gameMouseY() > 260 &&
              gameMouseY() < 320 &&
              mysticalore >= 3 &&
              bone >= 2 &&
              maxesBought === 0 &&
              youDied === 0
            ) {
              mysticalore -= 3;
              bone -= 2;
              equippedAxes = 4;
              maxesBought = 1;
            }
            if (
              openAxes === 1 &&
              pointerIsDown() &&
              gameMouseX() > 0 &&
              gameMouseX() < 400 / 3 &&
              gameMouseY() > 260 &&
              gameMouseY() < 320 &&
              maxesBought === 1 &&
              youDied === 0
            ) {
              equippedAxes = 4;
            }
            if (
              openAxes === 1 &&
              pointerIsDown() &&
              gameMouseX() > 400 / 3 &&
              gameMouseX() < 800 / 3 &&
              gameMouseY() > 260 &&
              gameMouseY() < 320 &&
              flesh >= 3 &&
              bone >= 1 &&
              mysticalore >= 1 &&
              blaxesBought === 0 &&
              youDied === 0
            ) {
              mysticalore -= 1;
              bone -= 1;
              flesh -= 3;
              equippedAxes = 5;
              blaxesBought = 1;
            }
            if (
              openAxes === 1 &&
              pointerIsDown() &&
              gameMouseX() > 400 / 3 &&
              gameMouseX() < 800 / 3 &&
              gameMouseY() > 260 &&
              gameMouseY() < 320 &&
              blaxesBought === 1 &&
              youDied === 0
            ) {
              equippedAxes = 5;
            }
            if (
              openPickaxes === 1 &&
              pointerIsDown() &&
              gameMouseX() > 0 &&
              gameMouseX() < 400 / 3 &&
              gameMouseY() > 260 &&
              gameMouseY() < 320 &&
              mysticalore >= 4 &&
              bone >= 1 &&
              leather >= 1 &&
              mpickaxesBought === 0 &&
              youDied === 0
            ) {
              mysticalore -= 4;
              bone -= 1;
              leather -= 1;
              equippedPickaxes = 4;
              mpickaxesBought = 1;
            }
            if (
              openPickaxes === 1 &&
              pointerIsDown() &&
              gameMouseX() > 0 &&
              gameMouseX() < 400 / 3 &&
              gameMouseY() > 260 &&
              gameMouseY() < 320 &&
              mpickaxesBought === 1 &&
              youDied === 0
            ) {
              equippedPickaxes = 4;
            }
            if (
              openPickaxes === 1 &&
              pointerIsDown() &&
              gameMouseX() > 400 / 3 &&
              gameMouseX() < 800 / 3 &&
              gameMouseY() > 260 &&
              gameMouseY() < 320 &&
              flesh >= 4 &&
              mysticalore >= 3 &&
              blpickaxesBought === 0 &&
              youDied === 0
            ) {
              flesh -= 4;
              mysticalore -= 1;
              feathers -= 3;
              equippedPickaxes = 5;
              blpickaxesBought = 1;
            }
            if (
              openPickaxes === 1 &&
              pointerIsDown() &&
              gameMouseX() > 400 / 3 &&
              gameMouseX() < 800 / 3 &&
              gameMouseY() > 260 &&
              gameMouseY() < 320 &&
              blpickaxesBought === 1 &&
              youDied === 0
            ) {
              equippedPickaxes = 5;
            }
            if (
              openArmour === 1 &&
              pointerIsDown() &&
              gameMouseX() > 0 &&
              gameMouseX() < 400 / 3 &&
              gameMouseY() > 260 &&
              gameMouseY() < 320 &&
              mysticalore >= 5 &&
              marmourBought === 0 &&
              youDied === 0
            ) {
              mysticalore -= 5;
              equippedArmour = 4;
              marmourBought = 1;
            }
            if (
              openArmour === 1 &&
              pointerIsDown() &&
              gameMouseX() > 0 &&
              gameMouseX() < 400 / 3 &&
              gameMouseY() > 260 &&
              gameMouseY() < 320 &&
              marmourBought === 1 &&
              youDied === 0
            ) {
              equippedArmour = 4;
            }
            if (
              openArmour === 1 &&
              pointerIsDown() &&
              gameMouseX() > 400 / 3 &&
              gameMouseX() < 800 / 3 &&
              gameMouseY() > 260 &&
              gameMouseY() < 320 &&
              flesh >= 5 &&
              blarmourBought === 0 &&
              youDied === 0
            ) {
              flesh -= 5;
              equippedArmour = 5;
              blarmourBought = 1;
            }
            if (
              openArmour === 1 &&
              pointerIsDown() &&
              gameMouseX() > 400 / 3 &&
              gameMouseX() < 800 / 3 &&
              gameMouseY() > 260 &&
              gameMouseY() < 320 &&
              blarmourBought === 1 &&
              youDied === 0
            ) {
              equippedArmour = 5;
            }
            if (
              openBag === 1 &&
              pointerIsDown() &&
              gameMouseX() > 800 / 3 &&
              gameMouseX() < 400 &&
              gameMouseY() > 200 &&
              gameMouseY() < 260 &&
              youDied === 0 &&
              shopDelay > 30 &&
              openBoots === 0 &&
              openAxes === 0 &&
              openPickaxes === 0 &&
              openArmour === 0 &&
              openDimensions === 0 &&
              openGlossary === 0 &&
              youDied === 0
            ) {
              shopDelay = 0;
              openPickaxes = 1;
            }
            if (
              pointerIsDown() &&
              gameMouseX() > 0 &&
              gameMouseX() < 400 &&
              gameMouseY() > 320 &&
              gameMouseY() < 400 &&
              openPickaxes === 1 &&
              youDied === 0
            ) {
              shopDelay = 0;
              pickaxesDelay = 0;
              openPickaxes = 0;
            }
            if (
              openPickaxes === 1 &&
              pointerIsDown() &&
              gameMouseX() > 0 &&
              gameMouseX() < 400 / 3 &&
              gameMouseY() > 200 &&
              gameMouseY() < 260 &&
              wood >= 5 &&
              wpickaxesBought === 0 &&
              youDied === 0
            ) {
              wood -= 5;
              equippedPickaxes = 1;
              wpickaxesBought = 1;
            }
            if (
              openPickaxes === 1 &&
              pointerIsDown() &&
              gameMouseX() > 0 &&
              gameMouseX() < 400 / 3 &&
              gameMouseY() > 200 &&
              gameMouseY() < 260 &&
              wpickaxesBought === 1 &&
              youDied === 0
            ) {
              equippedPickaxes = 1;
            }
            if (
              openBoots === 1 &&
              pointerIsDown() &&
              gameMouseX() > 800 / 3 &&
              gameMouseX() < 400 &&
              gameMouseY() > 200 &&
              gameMouseY() < 260 &&
              stone >= 3 &&
              sbootsBought === 0 &&
              youDied === 0
            ) {
              stone -= 3;
              equippedBoots = 3;
              sbootsBought = 1;
            }
            if (
              openBoots === 1 &&
              pointerIsDown() &&
              gameMouseX() > 800 / 3 &&
              gameMouseX() < 400 &&
              gameMouseY() > 200 &&
              gameMouseY() < 260 &&
              sbootsBought === 1 &&
              youDied === 0
            ) {
              equippedBoots = 3;
            }
            if (
              openAxes === 1 &&
              pointerIsDown() &&
              gameMouseX() > 400 / 3 &&
              gameMouseX() < 800 / 3 &&
              gameMouseY() > 200 &&
              gameMouseY() < 260 &&
              stone >= 2 &&
              leather >= 2 &&
              wood >= 1 &&
              saxesBought === 0 &&
              youDied === 0 &&
              axesDelay > 30
            ) {
              stone -= 2;
              leather -= 2;
              wood -= 1;
              equippedAxes = 2;
              saxesBought = 1;
            }
            if (
              openAxes === 1 &&
              pointerIsDown() &&
              gameMouseX() > 400 / 3 &&
              gameMouseX() < 800 / 3 &&
              gameMouseY() > 200 &&
              gameMouseY() < 260 &&
              saxesBought === 1 &&
              youDied === 0 &&
              axesDelay > 30
            ) {
              equippedAxes = 2;
            }
            if (
              openPickaxes === 1 &&
              pointerIsDown() &&
              gameMouseX() > 400 / 3 &&
              gameMouseX() < 800 / 3 &&
              gameMouseY() > 200 &&
              gameMouseY() < 260 &&
              stone >= 3 &&
              leather >= 1 &&
              wood >= 1 &&
              spickaxesBought === 0 &&
              youDied === 0
            ) {
              stone -= 3;
              leather -= 1;
              wood -= 1;
              equippedPickaxes = 2;
              spickaxesBought = 1;
            }
            if (
              openPickaxes === 1 &&
              pointerIsDown() &&
              gameMouseX() > 400 / 3 &&
              gameMouseX() < 800 / 3 &&
              gameMouseY() > 200 &&
              gameMouseY() < 260 &&
              spickaxesBought === 1 &&
              youDied === 0
            ) {
              equippedPickaxes = 2;
            }
            if (dimension === 1) {
              if (
                zomb1X > rectX - 25 &&
                zomb1X < rectX + 25 &&
                zomb1Y > rectY - 25 &&
                zomb1Y < rectY + 25 &&
                pointerIsDown() &&
                gameMouseX() > zomb1X - 20 &&
                gameMouseX() < zomb1X + 20 &&
                gameMouseY() > zomb1Y - 20 &&
                gameMouseY() < zomb1Y + 20 &&
                zomb1died === 0 &&
                youDied === 0
              ) {
                testCrit = 1;
                zomb1health -= attack;
                zomb1hurt = 1;
              }
              if (
                zomb2X > rectX - 25 &&
                zomb2X < rectX + 25 &&
                zomb2Y > rectY - 25 &&
                zomb2Y < rectY + 25 &&
                pointerIsDown() &&
                gameMouseX() > zomb2X - 20 &&
                gameMouseX() < zomb2X + 20 &&
                gameMouseY() > zomb2Y - 20 &&
                gameMouseY() < zomb2Y + 20 &&
                zomb2died === 0 &&
                youDied === 0
              ) {
                testCrit = 1;
                zomb2health -= attack;
                zomb2hurt = 1;
              }
            }
            if (
              openBoots === 1 &&
              pointerIsDown() &&
              gameMouseX() > 0 &&
              gameMouseX() < 400 / 3 &&
              gameMouseY() > 260 &&
              gameMouseY() < 320 &&
              bone >= 3 &&
              bootsDelay > 30 &&
              bbootsBought === 0 &&
              youDied === 0
            ) {
              bone -= 3;
              equippedBoots = 4;
              bbootsBought = 1;
            }
            if (
              openBoots === 1 &&
              pointerIsDown() &&
              gameMouseX() > 0 &&
              gameMouseX() < 400 / 3 &&
              gameMouseY() > 260 &&
              gameMouseY() < 320 &&
              bbootsBought === 1 &&
              youDied === 0
            ) {
              equippedBoots = 4;
            }
            if (
              openBoots === 1 &&
              pointerIsDown() &&
              gameMouseX() > 400 / 3 &&
              gameMouseX() < 800 / 3 &&
              gameMouseY() > 260 &&
              gameMouseY() < 320 &&
              mysticalore >= 3 &&
              mbootsBought === 0 &&
              youDied === 0
            ) {
              mysticalore -= 3;
              equippedBoots = 5;
              mbootsBought = 1;
            }
            if (
              openBoots === 1 &&
              pointerIsDown() &&
              gameMouseX() > 400 / 3 &&
              gameMouseX() < 800 / 3 &&
              gameMouseY() > 260 &&
              gameMouseY() < 320 &&
              mbootsBought === 1 &&
              youDied === 0
            ) {
              equippedBoots = 5;
            }
            if (
              openAxes === 1 &&
              pointerIsDown() &&
              gameMouseX() > 800 / 3 &&
              gameMouseX() < 400 &&
              gameMouseY() > 200 &&
              gameMouseY() < 260 &&
              stone >= 2 &&
              wood >= 1 &&
              feathers >= 1 &&
              bone >= 2 &&
              baxesBought === 0 &&
              youDied === 0
            ) {
              stone -= 2;
              wood -= 1;
              feathers -= 1;
              bone -= 2;
              equippedAxes = 3;
              baxesBought = 1;
            }
            if (
              openAxes === 1 &&
              pointerIsDown() &&
              gameMouseX() > 800 / 3 &&
              gameMouseX() < 400 &&
              gameMouseY() > 200 &&
              gameMouseY() < 260 &&
              baxesBought === 1 &&
              youDied === 0
            ) {
              equippedAxes = 3;
            }
            if (
              openPickaxes === 1 &&
              pointerIsDown() &&
              gameMouseX() > 800 / 3 &&
              gameMouseX() < 400 &&
              gameMouseY() > 200 &&
              gameMouseY() < 260 &&
              stone >= 1 &&
              wood >= 1 &&
              feathers >= 1 &&
              leather >= 1 &&
              bone >= 3 &&
              bpickaxesBought === 0 &&
              youDied === 0 &&
              pickaxesDelay > 30
            ) {
              stone -= 1;
              wood -= 1;
              feathers -= 1;
              leather -= 1;
              bone -= 3;
              equippedPickaxes = 3;
              bpickaxesBought = 1;
            }
            if (
              openPickaxes === 1 &&
              pointerIsDown() &&
              gameMouseX() > 800 / 3 &&
              gameMouseX() < 400 &&
              gameMouseY() > 200 &&
              gameMouseY() < 260 &&
              bpickaxesBought === 1 &&
              youDied === 0 &&
              pickaxesDelay > 30
            ) {
              equippedPickaxes = 3;
            }
            if (
              openBag === 1 &&
              pointerIsDown() &&
              gameMouseX() > 0 &&
              gameMouseX() < 400 / 3 &&
              gameMouseY() > 260 &&
              gameMouseY() < 320 &&
              youDied === 0 &&
              openBoots === 0 &&
              openAxes === 0 &&
              openPickaxes === 0 &&
              openArmour === 0 &&
              openDimensions === 0 &&
              openGlossary === 0 &&
              shopDelay > 30
            ) {
              shopDelay = 0;
              openArmour = 1;
            }
            if (
              pointerIsDown() &&
              gameMouseX() > 0 &&
              gameMouseX() < 400 &&
              gameMouseY() > 320 &&
              gameMouseY() < 400 &&
              openArmour === 1 &&
              youDied === 0
            ) {
              armourDelay = 0;
              shopDelay = 0;
              openArmour = 0;
            }
            if (
              openArmour === 1 &&
              pointerIsDown() &&
              gameMouseX() > 0 &&
              gameMouseX() < 400 / 3 &&
              gameMouseY() > 200 &&
              gameMouseY() < 260 &&
              leather >= 5 &&
              larmourBought === 0 &&
              youDied === 0
            ) {
              leather -= 5;
              equippedArmour = 1;
              larmourBought = 1;
            }
            if (
              openArmour === 1 &&
              pointerIsDown() &&
              gameMouseX() > 0 &&
              gameMouseX() < 400 / 3 &&
              gameMouseY() > 200 &&
              gameMouseY() < 260 &&
              larmourBought === 1 &&
              youDied === 0
            ) {
              equippedArmour = 1;
            }
            if (
              openArmour === 1 &&
              pointerIsDown() &&
              gameMouseX() > 400 / 3 &&
              gameMouseX() < 800 / 3 &&
              gameMouseY() > 200 &&
              gameMouseY() < 260 &&
              stone >= 5 &&
              sarmourBought === 0 &&
              youDied === 0
            ) {
              stone -= 5;
              equippedArmour = 2;
              sarmourBought = 1;
            }
            if (
              openArmour === 1 &&
              pointerIsDown() &&
              gameMouseX() > 400 / 3 &&
              gameMouseX() < 800 / 3 &&
              gameMouseY() > 200 &&
              gameMouseY() < 260 &&
              sarmourBought === 1 &&
              youDied === 0
            ) {
              equippedArmour = 2;
            }
            if (
              openArmour === 1 &&
              pointerIsDown() &&
              gameMouseX() > 800 / 3 &&
              gameMouseX() < 400 &&
              gameMouseY() > 200 &&
              gameMouseY() < 260 &&
              bone >= 5 &&
              barmourBought === 0 &&
              youDied === 0
            ) {
              bone -= 5;
              equippedArmour = 3;
              barmourBought = 1;
            }
            if (
              openArmour === 1 &&
              pointerIsDown() &&
              gameMouseX() > 800 / 3 &&
              gameMouseX() < 400 &&
              gameMouseY() > 200 &&
              gameMouseY() < 260 &&
              barmourBought === 1 &&
              youDied === 0
            ) {
              equippedArmour = 3;
            }
            if (
              openBag === 1 &&
              pointerIsDown() &&
              gameMouseX() > 400 / 3 &&
              gameMouseX() < 800 / 3 &&
              gameMouseY() > 260 &&
              gameMouseY() < 320 &&
              youDied === 0 &&
              openBoots === 0 &&
              openAxes === 0 &&
              openPickaxes === 0 &&
              openArmour === 0 &&
              openDimensions === 0 &&
              openGlossary === 0 &&
              shopDelay > 30 &&
              dimension < 3
            ) {
              shopDelay = 0;
              openDimensions = 1;
            }
            if (
              pointerIsDown() &&
              gameMouseX() > 0 &&
              gameMouseX() < 400 &&
              gameMouseY() > 320 &&
              gameMouseY() < 400 &&
              openDimensions === 1 &&
              youDied === 0
            ) {
              dimensionDelay = 0;
              shopDelay = 0;
              openDimensions = 0;
            }
            if (
              openDimensions === 1 &&
              pointerIsDown() &&
              gameMouseX() > 0 &&
              gameMouseX() < 400 / 3 &&
              gameMouseY() > 260 &&
              gameMouseY() < 320 &&
              wood >= 2 &&
              mysticalore >= 2 &&
              dimensionDelay > 30 &&
              earthBought === 0 &&
              youDied === 0 &&
              dimension < 3
            ) {
              wood -= 2;
              mysticalore -= 2;
              dimension = 1;
              earthBought = 1;
            }
            if (
              openDimensions === 1 &&
              pointerIsDown() &&
              gameMouseX() > 0 &&
              gameMouseX() < 400 / 3 &&
              gameMouseY() > 260 &&
              gameMouseY() < 320 &&
              dimensionDelay > 30 &&
              earthBought === 1 &&
              youDied === 0 &&
              dimension < 3
            ) {
              dimension = 1;
            }
            if (
              openDimensions === 1 &&
              pointerIsDown() &&
              gameMouseX() > 400 / 3 &&
              gameMouseX() < 800 / 3 &&
              gameMouseY() > 260 &&
              gameMouseY() < 320 &&
              wood >= 2 &&
              stone >= 2 &&
              leather >= 2 &&
              bone >= 2 &&
              feathers >= 2 &&
              dimensionDelay > 30 &&
              moonBought === 0 &&
              youDied === 0 &&
              dimension < 3
            ) {
              wood -= 2;
              stone -= 2;
              leather -= 2;
              bone -= 2;
              feathers -= 2;
              dimension = 2;
              moonBought = 1;
            }
            if (
              openDimensions === 1 &&
              pointerIsDown() &&
              gameMouseX() > 400 / 3 &&
              gameMouseX() < 800 / 3 &&
              gameMouseY() > 260 &&
              gameMouseY() < 320 &&
              dimensionDelay > 30 &&
              moonBought === 1 &&
              youDied === 0 &&
              dimension < 3
            ) {
              dimension = 2;
            }
            if (
              openDimensions === 1 &&
              pointerIsDown() &&
              gameMouseX() > 800 / 3 &&
              gameMouseX() < 400 &&
              gameMouseY() > 260 &&
              gameMouseY() < 320 &&
              wood >= 3 &&
              stone >= 3 &&
              leather >= 3 &&
              bone >= 3 &&
              feathers >= 3 &&
              mysticalore >= 3 &&
              flesh >= 3 &&
              sunBought === 0 &&
              youDied === 0
            ) {
              wood -= 3;
              stone -= 3;
              leather -= 3;
              bone -= 3;
              feathers -= 3;
              mysticalore -= 3;
              flesh -= 3;
              dimension = 3;
              sunBought = 1;
            }
            if (
              openDimensions === 1 &&
              pointerIsDown() &&
              gameMouseX() > 800 / 3 &&
              gameMouseX() < 400 &&
              gameMouseY() > 260 &&
              gameMouseY() < 320 &&
              sunBought === 1 &&
              youDied === 0
            ) {
              dimension = 3;
            }
            if (
              openDimensions === 1 &&
              pointerIsDown() &&
              gameMouseX() > 0 &&
              gameMouseX() < 400 / 3 &&
              gameMouseY() > 260 &&
              gameMouseY() < 320 &&
              youDied === 0 &&
              earthBought === 1 &&
              dimension < 3
            ) {
              dimension = 1;
            }
            if (
              openBag === 1 &&
              pointerIsDown() &&
              gameMouseX() > 800 / 3 &&
              gameMouseX() < 400 &&
              gameMouseY() > 260 &&
              gameMouseY() < 320 &&
              youDied === 0 &&
              openBoots === 0 &&
              openAxes === 0 &&
              openPickaxes === 0 &&
              openArmour === 0 &&
              openDimensions === 0 &&
              openGlossary === 0 &&
              shopDelay > 30
            ) {
              shopDelay = 0;
              openGlossary = 1;
            }
            if (
              pointerIsDown() &&
              gameMouseX() > 0 &&
              gameMouseX() < 400 &&
              gameMouseY() > 320 &&
              gameMouseY() < 400 &&
              openGlossary === 1 &&
              youDied === 0
            ) {
              glossaryDelay = 0;
              shopDelay = 0;
              openGlossary = 0;
            }
            if (
              openGlossary === 1 &&
              pointerIsDown() &&
              gameMouseX() > 0 &&
              gameMouseX() < 400 / 3 &&
              gameMouseY() > 200 &&
              gameMouseY() < 260 &&
              youDied === 0 &&
              openBootsG === 0 &&
              openAxesG === 0 &&
              openPickaxesG === 0 &&
              openArmourG === 0 &&
              openDimensionsG === 0 &&
              openMobsG === 0
            ) {
              openBootsG = 1;
            }
            if (
              pointerIsDown() &&
              gameMouseX() > 0 &&
              gameMouseX() < 400 &&
              gameMouseY() > 320 &&
              gameMouseY() < 400 &&
              openBootsG === 1 &&
              youDied === 0
            ) {
              openGlossary = 1;
              openBootsG = 0;
            }
            if (
              openGlossary === 1 &&
              pointerIsDown() &&
              gameMouseX() > 400 / 3 &&
              gameMouseX() < 800 / 3 &&
              gameMouseY() > 200 &&
              gameMouseY() < 260 &&
              youDied === 0 &&
              openBootsG === 0 &&
              openAxesG === 0 &&
              openPickaxesG === 0 &&
              openArmourG === 0 &&
              openDimensionsG === 0 &&
              openMobsG === 0
            ) {
              openAxesG = 1;
            }
            if (
              pointerIsDown() &&
              gameMouseX() > 0 &&
              gameMouseX() < 400 &&
              gameMouseY() > 320 &&
              gameMouseY() < 400 &&
              openAxesG === 1 &&
              youDied === 0
            ) {
              openGlossary = 1;
              openAxesG = 0;
            }
            if (
              openGlossary === 1 &&
              pointerIsDown() &&
              gameMouseX() > 800 / 3 &&
              gameMouseX() < 400 &&
              gameMouseY() > 200 &&
              gameMouseY() < 260 &&
              youDied === 0 &&
              openBootsG === 0 &&
              openAxesG === 0 &&
              openPickaxesG === 0 &&
              openArmourG === 0 &&
              openDimensionsG === 0 &&
              openMobsG === 0
            ) {
              openPickaxesG = 1;
            }
            if (
              pointerIsDown() &&
              gameMouseX() > 0 &&
              gameMouseX() < 400 &&
              gameMouseY() > 320 &&
              gameMouseY() < 400 &&
              openPickaxesG === 1 &&
              youDied === 0
            ) {
              openGlossary = 1;
              openPickaxesG = 0;
            }
            if (
              openGlossary === 1 &&
              pointerIsDown() &&
              gameMouseX() > 0 &&
              gameMouseX() < 400 / 3 &&
              gameMouseY() > 260 &&
              gameMouseY() < 320 &&
              youDied === 0 &&
              openBootsG === 0 &&
              openAxesG === 0 &&
              openPickaxesG === 0 &&
              openArmourG === 0 &&
              openDimensionsG === 0 &&
              openMobsG === 0
            ) {
              openArmourG = 1;
            }
            if (
              pointerIsDown() &&
              gameMouseX() > 0 &&
              gameMouseX() < 400 &&
              gameMouseY() > 320 &&
              gameMouseY() < 400 &&
              openArmourG === 1 &&
              youDied === 0
            ) {
              openGlossary = 1;
              openArmourG = 0;
            }
            if (
              openGlossary === 1 &&
              pointerIsDown() &&
              gameMouseX() > 400 / 3 &&
              gameMouseX() < 800 / 3 &&
              gameMouseY() > 260 &&
              gameMouseY() < 320 &&
              youDied === 0 &&
              openBootsG === 0 &&
              openAxesG === 0 &&
              openPickaxesG === 0 &&
              openArmourG === 0 &&
              openDimensionsG === 0 &&
              openMobsG === 0
            ) {
              openDimensionsG = 1;
            }
            if (
              pointerIsDown() &&
              gameMouseX() > 0 &&
              gameMouseX() < 400 &&
              gameMouseY() > 320 &&
              gameMouseY() < 400 &&
              openDimensionsG === 1 &&
              youDied === 0
            ) {
              openGlossary = 1;
              openDimensionsG = 0;
            }
            if (
              openGlossary === 1 &&
              pointerIsDown() &&
              gameMouseX() > 800 / 3 &&
              gameMouseX() < 400 &&
              gameMouseY() > 260 &&
              gameMouseY() < 320 &&
              youDied === 0 &&
              openBootsG === 0 &&
              openAxesG === 0 &&
              openPickaxesG === 0 &&
              openArmourG === 0 &&
              openDimensionsG === 0 &&
              openMobsG === 0 &&
              glossaryTimer > 30
            ) {
              glossaryTimer = 0;
              openMobsG = 1;
            }
            if (
              pointerIsDown() &&
              gameMouseX() > 0 &&
              gameMouseX() < 400 &&
              gameMouseY() > 320 &&
              gameMouseY() < 400 &&
              openMobsG === 1 &&
              youDied === 0
            ) {
              openGlossary = 1;
              openMobsG = 0;
            }
          }
        }

        // Expose p5 callbacks to this instance.
        // setup is wrapped so the loading text does not push the canvas downward.
        p.setup = function () {
          removeStatus();
          return setup();
        };

        p.draw = draw;
        p.windowResized = windowResized;
        p.mouseDragged = mouseDragged;
        p.touchStarted = touchStarted;
        p.touchMoved = touchMoved;
        p.mousePressed = mousePressed;
      }
    }, holder);
  }

  function waitForReady() {
    tries++;

    var holder = document.getElementById(CONTAINER_ID);

    if (!holder) {
      if (tries < 80) {
        setTimeout(waitForReady, 100);
      }
      return;
    }

    if (typeof window.p5 === "undefined") {
      statusText("waiting for p5...");
      if (tries > 120) {
        statusText("p5 failed to load. Check the p5 CDN script in your Blogger theme.");
        console.error("p5 is not defined after waiting.");
        return;
      }
      setTimeout(waitForReady, 100);
      return;
    }

    startLandform();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", waitForReady);
  } else {
    waitForReady();
  }
})();
