(function () {
  function startGame() {
    const status = document.getElementById("p5-status");
    const container = document.getElementById("landform-game");

    if (!container) {
      console.error("landform-game container not found");
      return;
    }

    if (typeof p5 === "undefined") {
      if (status) status.textContent = "p5 failed to load.";
      console.error("p5 is not defined");
      return;
    }

    const sketch = function (p) {
      p.setup = function () {
        if (status) status.remove();

        const canvas = p.createCanvas(container.clientWidth, 500);
        canvas.parent("landform-game");
      };

      p.draw = function () {
        p.background(245);

        p.fill(255, 0, 100);
        p.noStroke();
        p.circle(p.mouseX, p.mouseY, 60);

        p.fill(0);
        p.textSize(24);
        p.text("p5 is working", 30, 50);
      };

      p.windowResized = function () {
        p.resizeCanvas(container.clientWidth, 500);
      };
    };

    new p5(sketch);
  }

  let tries = 0;

  function waitForP5() {
    tries++;

    if (typeof p5 === "undefined") {
      if (tries > 50) {
        const status = document.getElementById("p5-status");
        if (status) status.textContent = "p5 failed to load after waiting.";
        return;
      }

      setTimeout(waitForP5, 100);
      return;
    }

    startGame();
  }

  waitForP5();
})();
