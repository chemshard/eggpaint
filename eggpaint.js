/*
  eggpaint_blogger_compatible.js

  Blogger-compatible p5 instance-mode wrapper for the user's paint.js sketch.
  Required Blogger HTML:
    <div id="paintjs-app"><div id="p5-status">loading paint.js...</div></div>

  Required theme script before </body>:
    <script src='https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.4/p5.min.js'></script>
    <script src='https://YOURUSERNAME.github.io/YOURREPO/eggpaint_blogger_compatible.js'></script>
*/

(function () {
  var CONTAINER_ID = "paintjs-app";
  var started = false;
  var tries = 0;

  function statusText(text) {
    var s = document.getElementById("p5-status");
    if (s) s.textContent = text;
  }

  function startPaintJS() {
    var holder = document.getElementById(CONTAINER_ID);

    if (!holder) {
      // This script may be loaded site-wide in the Blogger theme.
      // Silently stop if the current page does not contain the paint app.
      return;
    }

    if (started || holder.__eggpaintStarted) return;
    started = true;
    holder.__eggpaintStarted = true;

    statusText("p5 loaded. starting paint.js...");

    new p5(function (p) {
      // Keep the original sketch code readable while running it as a p5 instance.
      // This prevents global setup()/draw() collisions inside Blogger.
      with (p) {
/*
paint.js responsive internal-layout version - fixed controls

This version does NOT use p5 scale() to fake responsiveness.
Instead, it recalculates the actual app layout from the current canvas size.

Original idea:
- Drawing area
- Top bar
- Sidebar / bottom controls
- Brush types
- Colour palette
- Sliders/selects/buttons

Embed option:
<div id="paintjs-app" style="width:100%; max-width:950px; margin:0 auto;"></div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.4/p5.min.js"></script>
<script src="paintjs_responsive_internal.js"></script>
*/

let brushColour = "black";

let zoomSlider;
let cursorSelect;
let brushSelect;
let thicknessSlider;
let opacitySlider;
let qualitySelect;
let eraseButton;
let newButton;

let appCanvas;
let appHolder;
let artLayer;
let layout = null;
let lastCanvasW = 0;
let lastCanvasH = 0;
let lastArtW = 0;
let lastArtH = 0;

const COLOURS = [
  { name: "red", value: "red" },
  { name: "orange", value: "orange" },
  { name: "yellow", value: "yellow" },
  { name: "green", value: "green" },
  { name: "lightgreen", value: "lightgreen" },
  { name: "blue", value: "blue" },
  { name: "lightblue", value: "lightblue" },
  { name: "purple", value: "purple" },
  { name: "pink", value: "pink" },
  { name: "black", value: "black" },
  { name: "brown", value: "brown" },
  { name: "random", value: "random" }
];

function clamp(v, lo, hi) {
  return Math.max(lo, Math.min(hi, v));
}

function holderWidth() {
  if (appHolder && appHolder.clientWidth > 0) return appHolder.clientWidth;
  const holder = document.getElementById("paintjs-app");
  if (holder && holder.clientWidth > 0) return holder.clientWidth;
  if (document.body && document.body.clientWidth > 0) return document.body.clientWidth;
  return windowWidth || 900;
}

function desiredCanvasSize() {
  const parentW = holderWidth();

  // Real responsive canvas dimensions, not visual scaling.
  const w = Math.floor(clamp(parentW, 320, 980));

  // Desktop keeps the old-ish 900x700 feel.
  // Mobile becomes taller so the controls can stack underneath.
  let h;
  if (w < 720) {
    h = Math.floor(clamp(w * 2.2, 760, 980));
  } else {
    h = Math.floor(clamp(w * 700 / 900, 560, 760));
  }

  return { w, h };
}

function computeLayout() {
  const mobile = width < 720;

  if (mobile) {
    const topH = 86;
    const paintX = 16;
    const paintY = topH + 18;
    const paintW = width - 32;
    const paintH = Math.floor(clamp(paintW * 0.72, 220, 360));

    const panelY = paintY + paintH + 26;
    const controlX = 20;
    const controlW = width - 40;
    const cell = Math.floor(clamp((controlW - 18) / 4, 28, 38));

    return {
      mobile,
      topH,
      mainW: width,
      sidebarX: 0,
      sidebarW: width,
      paintX,
      paintY,
      paintW,
      paintH,
      panelY,
      controlX,
      controlW,
      zoom: { x: Math.floor(width * 0.38), y: 15, w: Math.floor(width * 0.24), h: 20 },
      cursor: { x: Math.floor(width * 0.66), y: 12, w: Math.floor(width * 0.30), h: 28 },
      brush: { x: controlX, y: panelY + 42, w: controlW, h: 42 },
      thickness: { x: controlX, y: panelY + 116, w: controlW, h: 22 },
      opacity: { x: controlX, y: panelY + 178, w: controlW, h: 22 },
      buttons: {
        erase: { x: controlX, y: panelY + 240, w: Math.floor((controlW - 10) / 2), h: 34 },
        fresh: { x: controlX + Math.floor((controlW + 10) / 2), y: panelY + 240, w: Math.floor((controlW - 10) / 2), h: 34 }
      },
      quality: { x: controlX, y: panelY + 296, w: controlW, h: 36 },
      palette: { x: controlX, y: panelY + 386, cell, gap: 4 }
    };
  }

  const topH = 50;
  const sidebarW = Math.floor(clamp(width * 0.23, 190, 235));
  const mainW = width - sidebarW;
  const sidebarX = mainW;

  const paintX = Math.floor(clamp(mainW * 0.14, 58, 115));
  const paintY = Math.floor(clamp(height * 0.21, topH + 70, 160));
  const paintW = Math.floor(Math.max(260, mainW - paintX * 2));
  const paintH = Math.floor(Math.max(260, height - paintY - clamp(height * 0.14, 55, 105)));

  const controlX = sidebarX + 20;
  const controlW = sidebarW - 40;
  const cell = Math.floor(clamp((controlW - 12) / 4, 30, 36));

  return {
    mobile,
    topH,
    mainW,
    sidebarX,
    sidebarW,
    paintX,
    paintY,
    paintW,
    paintH,
    panelY: 0,
    controlX,
    controlW,
    zoom: { x: Math.floor(mainW * 0.43), y: 13, w: Math.floor(clamp(mainW * 0.15, 90, 120)), h: 20 },
    cursor: { x: Math.floor(mainW * 0.75), y: 14, w: Math.floor(clamp(mainW * 0.21, 120, 160)), h: 28 },
    brush: { x: controlX, y: 50, w: controlW, h: 80 },
    thickness: { x: controlX, y: 170, w: controlW, h: 22 },
    opacity: { x: controlX, y: 240, w: controlW, h: 22 },
    buttons: {
      erase: { x: controlX - 2, y: 424, w: Math.floor((controlW - 6) / 2), h: 30 },
      fresh: { x: controlX + Math.floor((controlW + 8) / 2), y: 424, w: Math.floor((controlW - 6) / 2), h: 30 }
    },
    quality: { x: controlX - 10, y: 460, w: controlW + 20, h: 50 },
    palette: { x: controlX + 10, y: 560, cell, gap: 0 }
  };
}

function makeArtLayer(newW, newH) {
  const old = artLayer;

  artLayer = createGraphics(Math.max(1, Math.floor(newW)), Math.max(1, Math.floor(newH)));
  artLayer.background("white");

  // This only preserves the drawing if the drawing area changes.
  // The app itself is not using scale().
  if (old) {
    artLayer.image(old, 0, 0, artLayer.width, artLayer.height);
  }

  lastArtW = artLayer.width;
  lastArtH = artLayer.height;
}

function ensureArtLayer() {
  const artW = Math.max(1, Math.floor(layout.paintW));
  const artH = Math.max(1, Math.floor(layout.paintH));

  if (!artLayer || artW !== lastArtW || artH !== lastArtH) {
    makeArtLayer(artW, artH);
  }
}

function canvasPageRect() {
  if (!appCanvas || !appCanvas.elt) {
    return { left: 0, top: 0 };
  }
  const r = appCanvas.elt.getBoundingClientRect();
  return {
    left: r.left + window.scrollX,
    top: r.top + window.scrollY
  };
}

function allControls() {
  return [
    zoomSlider,
    cursorSelect,
    brushSelect,
    thicknessSlider,
    opacitySlider,
    qualitySelect,
    eraseButton,
    newButton
  ].filter(Boolean);
}

function parentAndStyleControls() {
  const controls = allControls();

  for (let i = 0; i < controls.length; i++) {
    const c = controls[i];

    if (appHolder) {
      c.parent(appHolder);
    }

    c.style("position", "absolute");
    c.style("z-index", "20");
    c.style("pointer-events", "auto");
    c.style("box-sizing", "border-box");
  }

  if (appCanvas && appCanvas.elt) {
    appCanvas.elt.style.position = "relative";
    appCanvas.elt.style.zIndex = "1";
  }
}

function updateHolderHeight() {
  if (!appHolder) return;
  appHolder.style.minHeight = height + "px";
}

function placeControl(control, box) {
  if (!control || !box) return;

  if (appHolder) {
    // Position relative to the wrapper so the controls stay aligned with the canvas.
    control.position(Math.round(box.x), Math.round(box.y));
  } else {
    // Fallback for the p5 web editor / no wrapper case.
    const r = canvasPageRect();
    control.position(Math.round(r.left + box.x), Math.round(r.top + box.y));
  }

  if (box.w !== undefined && box.h !== undefined) {
    control.size(Math.max(1, Math.floor(box.w)), Math.max(1, Math.floor(box.h)));
  } else if (box.w !== undefined) {
    control.style("width", Math.max(1, Math.floor(box.w)) + "px");
  }
}

function updateDomControls() {
  if (!layout) return;
  updateHolderHeight();

  placeControl(zoomSlider, layout.zoom);
  placeControl(cursorSelect, layout.cursor);
  placeControl(brushSelect, layout.brush);
  placeControl(thicknessSlider, layout.thickness);
  placeControl(opacitySlider, layout.opacity);
  placeControl(qualitySelect, layout.quality);
  placeControl(eraseButton, layout.buttons.erase);
  placeControl(newButton, layout.buttons.fresh);
}

function isDomControlEvent(event) {
  const target = event && event.target;
  if (!target || !target.tagName) return false;

  const tag = target.tagName.toLowerCase();
  return tag === "input" || tag === "select" || tag === "option" || tag === "button";
}

function setup() {
  pixelDensity(Math.min(2, window.devicePixelRatio || 1));

  appHolder = document.getElementById("paintjs-app");
  if (appHolder) {
    appHolder.style.position = "relative";
    appHolder.style.width = "100%";
    appHolder.style.maxWidth = "980px";
    appHolder.style.margin = "0 auto";
    appHolder.style.overflow = "visible";
  }

  const size = desiredCanvasSize();
  appCanvas = createCanvas(size.w, size.h);

  if (appHolder) appCanvas.parent(appHolder);

  appCanvas.elt.style.display = "block";
  appCanvas.elt.style.margin = "0 auto";
  appCanvas.elt.style.maxWidth = "100%";
  appCanvas.elt.style.touchAction = "none";

  background(220);

  zoomSlider = createSlider(0, 200, 100);
  zoomSlider.style("width", "100px");

  cursorSelect = createSelect();
  cursorSelect.option("Cursor Style");
  cursorSelect.option("Default");
  cursorSelect.option("Crosshair");
  cursorSelect.option("Hand");
  cursorSelect.selected("Cursor Style");

  brushSelect = createSelect();
  brushSelect.option("Default");
  brushSelect.option("Square");
  brushSelect.option("Triangle");
  brushSelect.option("Random Thickness");
  brushSelect.option("Magic Colour");
  brushSelect.option("Rainbow Colour");
  brushSelect.option("Eraser");
  brushSelect.selected("Default");

  thicknessSlider = createSlider(0, 100, 20);
  opacitySlider = createSlider(0, 100, 100);

  qualitySelect = createSelect();
  qualitySelect.option("Matte");
  qualitySelect.option("Gloss");
  qualitySelect.option("Dull Metal");
  qualitySelect.option("Polished Metal");
  qualitySelect.selected("Matte");

  eraseButton = createButton("Erase Canvas");
  eraseButton.mousePressed(eraseCanvas);

  newButton = createButton("New Canvas");
  newButton.mousePressed(newCanvas);

  parentAndStyleControls();

  layout = computeLayout();
  ensureArtLayer();
  updateDomControls();

  lastCanvasW = width;
  lastCanvasH = height;
}

function windowResized() {
  const size = desiredCanvasSize();

  if (size.w !== width || size.h !== height) {
    resizeCanvas(size.w, size.h);
  }

  layout = computeLayout();
  ensureArtLayer();
  updateDomControls();

  lastCanvasW = width;
  lastCanvasH = height;
}

function eraseCanvas() {
  if (!artLayer) return;
  artLayer.background("white");
}

function newCanvas() {
  eraseCanvas();
  brushColour = "black";
  if (brushSelect) brushSelect.selected("Default");
  if (thicknessSlider) thicknessSlider.value(20);
  if (opacitySlider) opacitySlider.value(100);
}

function pointerIsDown() {
  return mouseIsPressed || (typeof touches !== "undefined" && touches.length > 0);
}

function insidePaintArea(x, y) {
  return (
    x >= layout.paintX &&
    x <= layout.paintX + layout.paintW &&
    y >= layout.paintY &&
    y <= layout.paintY + layout.paintH
  );
}

function localPaintPoint(x, y) {
  return {
    x: clamp(x - layout.paintX, 0, layout.paintW),
    y: clamp(y - layout.paintY, 0, layout.paintH)
  };
}

function currentBrushColour(mode, opacityValue) {
  // Convert the 0-100 opacity slider into p5 alpha 0-255.
  const alpha = map(opacityValue, 0, 100, 0, 255);

  let c;

  if (mode === "Magic Colour") {
    c = color(random(0, 255), random(0, 255), random(0, 255));
  } else if (mode === "Rainbow Colour") {
    c = color(random(["red", "orange", "yellow", "green", "blue", "purple"]));
  } else if (mode === "Eraser") {
    // Keep eraser fully opaque so it actually erases instead of making ghost-smudges.
    c = color("white");
    c.setAlpha(255);
    return c;
  } else {
    c = color(brushColour);
  }

  c.setAlpha(alpha);
  return c;
}

function paintIfNeeded() {
  const brushType = brushSelect.value();
  const thicknessValue = thicknessSlider.value();
  const opacityValue = opacitySlider.value();

  if (!pointerIsDown()) return;
  if (!insidePaintArea(mouseX, mouseY)) return;

  const now = localPaintPoint(mouseX, mouseY);
  const prev = insidePaintArea(pmouseX, pmouseY) ? localPaintPoint(pmouseX, pmouseY) : now;

  artLayer.push();
  artLayer.stroke(currentBrushColour(brushType, opacityValue));
  artLayer.strokeWeight(Math.max(1, thicknessValue));
  artLayer.noFill();

  if (brushType === "Default" || brushType === "Eraser" || brushType === "Magic Colour" || brushType === "Rainbow Colour") {
    artLayer.line(prev.x, prev.y, now.x, now.y);
  }

  if (brushType === "Square") {
    artLayer.rectMode(CENTER);
    artLayer.rect(now.x, now.y, Math.max(1, thicknessValue), Math.max(1, thicknessValue));
  }

  if (brushType === "Triangle") {
    const s = Math.max(6, thicknessValue * 0.8);
    artLayer.triangle(now.x, now.y - s / 2, now.x - s / 2, now.y + s / 2, now.x + s / 2, now.y + s / 2);
  }

  if (brushType === "Random Thickness") {
    artLayer.strokeWeight(Math.max(1, random(thicknessValue - 50, thicknessValue + 50)));
    artLayer.line(prev.x, prev.y, now.x, now.y);
  }

  artLayer.pop();
}

function draw() {
  const size = desiredCanvasSize();
  let resized = false;

  if (size.w !== width || size.h !== height) {
    resizeCanvas(size.w, size.h);
    resized = true;
  }

  layout = computeLayout();
  ensureArtLayer();

  // Do NOT reposition DOM controls every frame.
  // Sliders/dropdowns become impossible to use if their CSS is rewritten while dragging/clicking.
  if (resized || width !== lastCanvasW || height !== lastCanvasH) {
    updateDomControls();
    lastCanvasW = width;
    lastCanvasH = height;
  }

  paintIfNeeded();

  background(220);
  drawPanels();
  drawPaintingSurface();
  drawInterface();
  applyCursor();
}

function drawPanels() {
  noStroke();

  if (layout.mobile) {
    fill("lightgray");
    rect(0, 0, width, layout.topH);
    rect(0, layout.panelY - 10, width, height - layout.panelY + 10);

    stroke("black");
    strokeWeight(1);
    line(0, layout.topH, width, layout.topH);
    line(0, layout.panelY - 10, width, layout.panelY - 10);
    noStroke();
  } else {
    fill("lightgray");
    rect(0, 0, layout.mainW, layout.topH);
    rect(layout.sidebarX, 0, layout.sidebarW, height);

    stroke("black");
    strokeWeight(1);
    line(layout.sidebarX, 0, layout.sidebarX, height);
    line(0, layout.topH, layout.mainW, layout.topH);
    line(layout.sidebarX, 450, width, 450);
    noStroke();
  }
}

function drawPaintingSurface() {
  stroke("black");
  strokeWeight(1);
  fill("white");
  rect(layout.paintX, layout.paintY, layout.paintW, layout.paintH);

  image(artLayer, layout.paintX, layout.paintY, layout.paintW, layout.paintH);

  noFill();
  stroke("black");
  strokeWeight(2);
  rect(layout.paintX, layout.paintY, layout.paintW, layout.paintH);
  noStroke();
}

function drawInterface() {
  const thicknessValue = thicknessSlider.value();
  const opacityValue = opacitySlider.value();
  const zoomValue = zoomSlider.value();

  drawTitle();
  drawTopControls(zoomValue);
  drawBrushControls(thicknessValue, opacityValue);
  drawPalette();
}

function drawTitle() {
  fill("black");
  textStyle(BOLD);

  if (layout.mobile) {
    textSize(clamp(width * 0.08, 24, 34));
    text("paint.js", 10, 36);
    textStyle(ITALIC);
    textSize(12);
    text("The best paint app ever!", 12, 57);
    text("~Mom", 12, 74);
    textStyle(NORMAL);
  } else {
    textSize(40);
    text("paint.js", 10, 35);
    textSize(15);
    textStyle(ITALIC);
    text("The best paint", 160, 20);
    text("app ever!", 160, 35);
    text("~Mom", 215, 45);
    textStyle(NORMAL);
  }
}

function drawTopControls(zoomValue) {
  fill("black");
  textStyle(NORMAL);
  textSize(15);

  if (!layout.mobile) {
    rect(layout.zoom.x + layout.zoom.w + 28, 0, 1, layout.topH);
    rect(layout.cursor.x - 15, 0, 1, layout.topH);
    text(zoomValue + "%", layout.zoom.x + layout.zoom.w + 38, 30);

    textSize(30);
    fill("black");
    text("+", layout.zoom.x + layout.zoom.w + 5, 33);
    text("-", layout.zoom.x - 25, 31);
  } else {
    textSize(12);
    text(zoomValue + "%", layout.zoom.x + layout.zoom.w + 6, 30);
  }
}

function drawBrushControls(thicknessValue, opacityValue) {
  fill("black");
  textStyle(NORMAL);

  if (layout.mobile) {
    const x = layout.controlX;
    const y = layout.panelY;

    textSize(24);
    text("Brush Settings", x, y + 24);

    textSize(15);
    text("Brush Type", x, layout.brush.y - 8);

    text("Thickness", x, layout.thickness.y - 8);
    fill("white");
    rect(x + layout.controlW - 46, layout.thickness.y - 24, 46, 20);
    fill("black");
    text(thicknessValue, x + layout.controlW - 38, layout.thickness.y - 9);

    text("Opacity", x, layout.opacity.y - 8);
    fill("white");
    rect(x + layout.controlW - 54, layout.opacity.y - 24, 54, 20);
    fill("black");
    text(opacityValue + "%", x + layout.controlW - 48, layout.opacity.y - 9);

    text("Pen Quality", x, layout.quality.y - 8);
    textSize(24);
    text("Color Settings", x, layout.palette.y - 24);
    return;
  }

  const x = layout.controlX;

  fill("black");
  textSize(25);
  text("Brush Settings", x, 38);

  textSize(15);
  text("Thickness", x, 165);
  fill("white");
  rect(x + layout.controlW - 31, 150, 31, 20);
  fill("black");
  text(thicknessValue, x + layout.controlW - 25, 165);

  fill("white");
  rect(x + layout.controlW - 41, 220, 41, 20);
  fill("black");
  text("Opacity", x, 235);
  text(opacityValue + "%", x + layout.controlW - 39, 235);

  fill("black");
  textSize(25);
  text("Color Settings", x, 540);
}

function drawPalette() {
  const p = layout.palette;
  const cell = p.cell;
  const gap = p.gap;

  noStroke();
  textStyle(NORMAL);

  for (let i = 0; i < COLOURS.length; i++) {
    const col = i % 4;
    const row = Math.floor(i / 4);
    const x = p.x + col * (cell + gap);
    const y = p.y + row * (cell + gap);

    if (COLOURS[i].value === "random") {
      fill("white");
      rect(x, y, cell, cell);
      fill("black");
      textSize(cell * 1.3);
      text("+", x + cell * 0.12, y + cell * 0.94);
    } else {
      fill(COLOURS[i].value);
      rect(x, y, cell, cell);
    }

    stroke("black");
    strokeWeight(1);
    noFill();
    rect(x, y, cell, cell);
    noStroke();
  }
}

function paletteHit(mx, my) {
  const p = layout.palette;
  const cell = p.cell;
  const gap = p.gap;

  for (let i = 0; i < COLOURS.length; i++) {
    const col = i % 4;
    const row = Math.floor(i / 4);
    const x = p.x + col * (cell + gap);
    const y = p.y + row * (cell + gap);

    if (mx >= x && mx <= x + cell && my >= y && my <= y + cell) {
      return COLOURS[i];
    }
  }

  return null;
}

function handlePaletteClick() {
  const picked = paletteHit(mouseX, mouseY);

  if (!picked) return false;

  if (picked.value === "random") {
    brushColour = color(random(0, 255), random(0, 255), random(0, 255));
  } else {
    brushColour = picked.value;
  }

  return true;
}

function applyCursor() {
  const cursorStyle = cursorSelect.value();

  if (cursorStyle === "Default" || cursorStyle === "Cursor Style") cursor(ARROW);
  if (cursorStyle === "Crosshair") cursor(CROSS);
  if (cursorStyle === "Hand") cursor(HAND);
}

function mousePressed(event) {
  // Let sliders, dropdowns, and buttons receive their own clicks.
  if (isDomControlEvent(event)) return true;

  if (handlePaletteClick()) return false;
  if (insidePaintArea(mouseX, mouseY)) return false;
  return true;
}

function touchStarted(event) {
  // Let sliders, dropdowns, and buttons receive their own touches.
  if (isDomControlEvent(event)) return true;

  if (handlePaletteClick()) return false;
  if (insidePaintArea(mouseX, mouseY)) return false;
  return true;
}

function touchMoved(event) {
  if (isDomControlEvent(event)) return true;
  if (insidePaintArea(mouseX, mouseY)) return false;
  return true;
}

function keyPressed() {
  const k = String(key || "").toLowerCase();

  if (k === "r") brushColour = "red";
  if (k === "o") brushColour = "orange";
  if (k === "y") brushColour = "yellow";
  if (k === "g") brushColour = "green";
  if (k === "z") brushColour = "lightgreen";
  if (k === "b") brushColour = "blue";
  if (k === "i") brushColour = "lightblue";
  if (k === "p") brushColour = "purple";
  if (k === "k") brushColour = "pink";
  if (k === "l") brushColour = "black";
  if (k === "w") brushColour = "brown";

  return false;
}


    // Expose the p5 callbacks to this instance.
    p.setup = setup;
    p.draw = draw;
    p.windowResized = windowResized;
    p.mousePressed = mousePressed;
    p.touchStarted = touchStarted;
    p.touchMoved = touchMoved;
    p.keyPressed = keyPressed;

      }
    });
  }

  function waitForReady() {
    tries++;

    var holder = document.getElementById(CONTAINER_ID);

    if (!holder) {
      if (tries < 50) {
        setTimeout(waitForReady, 100);
      }
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

    startPaintJS();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", waitForReady);
  } else {
    waitForReady();
  }
})();
