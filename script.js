// app.js
// Chunked computation to keep the main thread unblocked during heavy recursion.
// Phase space plotting uses Canvas API for high-performance rendering.

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("phaseCanvas");
  const ctx = canvas.getContext("2d");
  const computeBtn = document.getElementById("computeBtn");
  const nInput = document.getElementById("nInput");
  const speedSlider = document.getElementById("speedSlider");
  const coordReadout = document.getElementById("coordReadout");

  const qnValue = document.getElementById("qnValue");
  const iterValue = document.getElementById("iterValue");
  const deltaValue = document.getElementById("deltaValue");

  let animationFrameId = null;
  let isComputing = false;

  function resizeCanvas() {
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
  }

  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor(((e.clientX - rect.left) / rect.width) * 1000);
    const y = Math.floor((1 - (e.clientY - rect.top) / rect.height) * 1000);
    coordReadout.textContent = `x: ${x} | y: ${y}`;
  });

  function clearCanvas() {
    ctx.fillStyle = "rgba(7, 7, 10, 1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  function drawPoint(x, y, maxX, maxY) {
    const w = canvas.width / window.devicePixelRatio;
    const h = canvas.height / window.devicePixelRatio;

    const px = (x / maxX) * w;
    const py = h - (y / maxY) * h;

    ctx.fillStyle = `rgba(212, 175, 55, ${0.15 + Math.random() * 0.2})`;
    ctx.fillRect(px, py, 1.5, 1.5);
  }

  computeBtn.addEventListener("click", () => {
    if (isComputing) return;

    const n = parseInt(nInput.value, 10);
    if (isNaN(n) || n < 3) return;

    isComputing = true;
    computeBtn.classList.add("loading");
    clearCanvas();

    const startTime = performance.now();

    // Pre-allocate array for speed. Float64Array is overkill, standard Array is fine.
    const Q = new Array(n + 1);
    Q[1] = 1;
    Q[2] = 1;

    let currentIdx = 3;
    let maxX = 1;
    let maxY = 1;

    // Determine chunk size based on speed slider
    const chunkSize = Math.floor(50 + speedSlider.value * 2);

    function computeChunk() {
      const endIdx = Math.min(currentIdx + chunkSize, n + 1);

      for (let i = currentIdx; i < endIdx; i++) {
        Q[i] = Q[i - Q[i - 1]] + Q[i - Q[i - 2]];

        if (Q[i] > maxY) maxY = Q[i];
        if (Q[i - 1] > maxX) maxX = Q[i - 1];

        drawPoint(Q[i - 1], Q[i], maxX * 1.1, maxY * 1.1);
      }

      currentIdx = endIdx;
      iterValue.textContent = currentIdx - 1;
      qnValue.textContent = Q[currentIdx - 1] || "--";

      const elapsed = performance.now() - startTime;
      deltaValue.textContent = elapsed.toFixed(1);

      if (currentIdx <= n) {
        animationFrameId = requestAnimationFrame(computeChunk);
      } else {
        finishComputation(n, Q, elapsed);
      }
    }

    animationFrameId = requestAnimationFrame(computeChunk);
  });

  function finishComputation(n, Q, elapsed) {
    isComputing = false;
    computeBtn.classList.remove("loading");
    qnValue.textContent = Q[n];
    deltaValue.textContent = elapsed.toFixed(1);

    // Add a subtle glow to the final plotted area
    ctx.shadowBlur = 15;
    ctx.shadowColor = "rgba(0, 240, 255, 0.5)";
    ctx.fillStyle = "rgba(0, 240, 255, 0.8)";
    const w = canvas.width / window.devicePixelRatio;
    const h = canvas.height / window.devicePixelRatio;
    const px = (Q[n - 1] / (Math.max(...Q.slice(0, n)) * 1.1)) * w;
    const py = h - (Q[n] / (Math.max(...Q.slice(1, n + 1)) * 1.1)) * h;
    ctx.beginPath();
    ctx.arc(px, py, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }
});
