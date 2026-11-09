// KIROVERSE footer: rocket fire blasting out of the three engine nozzles.
// This is decoration only. The scanner logic lives in app.js.
//
// The fire is many small glowing dots. Each one starts white-hot at a nozzle,
// flies downward, cools through the palette below, shrinks and disappears.

const engineBay = document.querySelector(".engine-bay");
const engineCanvas = document.querySelector(".engine-fire");
const fireContext = engineCanvas.getContext("2d");
const nozzleElements = Array.from(document.querySelectorAll(".nozzle"));

const FLAME_DOTS_PER_FRAME = 4; // for the main engine; the side engines use fewer
const FLAME_LENGTH = 1.05; // how far the fire reaches, as a share of the footer
const FLAME_LIFE_FRAMES = 54;
const FLAME_BRIGHTNESS = 0.36;

// Colors from styles.css, hottest first.
const rootStyles = getComputedStyle(document.documentElement);
const FLAME_COLORS = ["--star-core", "--warn", "--danger", "--accent"].map((name) =>
  rootStyles.getPropertyValue(name).trim()
);
// A dot switches to the next color once its heat loss passes each of these.
const FLAME_COOLING_POINTS = [0.26, 0.5, 0.76];

// Drawing one soft dot ahead of time per color is much faster than
// building a new gradient for every dot on every frame.
const flameDotImages = FLAME_COLORS.map((color) => {
  const image = document.createElement("canvas");
  image.width = 64;
  image.height = 64;
  const context = image.getContext("2d");
  const glow = context.createRadialGradient(32, 32, 0, 32, 32, 32);
  glow.addColorStop(0, color);
  glow.addColorStop(1, "transparent");
  context.fillStyle = glow;
  context.fillRect(0, 0, 64, 64);
  return image;
});

let flameDots = [];
let nozzles = [];
let fireWidth = 0;
let fireHeight = 0;
let fireIsRunning = false;
let lastFireTime = 0;

// Measure the footer and find where each nozzle ends, relative to the canvas.
function measureEngines() {
  const box = engineCanvas.getBoundingClientRect();
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

  fireWidth = box.width;
  fireHeight = box.height;
  engineCanvas.width = Math.round(fireWidth * pixelRatio);
  engineCanvas.height = Math.round(fireHeight * pixelRatio);
  fireContext.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

  const widest = Math.max(...nozzleElements.map((nozzle) => nozzle.offsetWidth));
  nozzles = nozzleElements.map((nozzle) => {
    const nozzleBox = nozzle.getBoundingClientRect();
    return {
      x: nozzleBox.left - box.left + nozzleBox.width / 2,
      y: nozzleBox.bottom - box.top - 8, // starts just inside the nozzle
      width: nozzleBox.width,
      power: nozzleBox.width / widest,
    };
  });
}

function addFlameDot(nozzle, time) {
  // Each engine surges a little, so the flame length is never perfectly steady.
  const surge = 0.9 + Math.sin(time / 70 + nozzle.x) * 0.1 + Math.random() * 0.1;
  const flameLength = (fireHeight - nozzle.y) * FLAME_LENGTH * nozzle.power;

  // -1 is the left edge of the nozzle, 0 the middle, 1 the right edge.
  const sideways = (Math.random() - 0.5) * 2;

  flameDots.push({
    x: nozzle.x + sideways * nozzle.width * 0.4,
    y: nozzle.y,
    speed: (flameLength / FLAME_LIFE_FRAMES) * surge,
    age: 0,
    life: FLAME_LIFE_FRAMES * (0.6 + Math.random() * 0.4),
    size: nozzle.width * (0.42 + Math.random() * 0.3),
    // Dots near the edge burn cooler, wrapping the white core in pink and purple.
    edgeCooling: Math.abs(sideways) * Math.abs(sideways) * 0.55,
    nozzle: nozzle,
  });
}

// `steps` is how many 60-per-second frames have passed, so the fire moves at
// the same speed on every screen.
function updateFlames(steps, time) {
  nozzles.forEach((nozzle) => {
    const count = FLAME_DOTS_PER_FRAME * nozzle.power * steps;
    for (let i = 0; i < count; i++) {
      addFlameDot(nozzle, time);
    }
  });

  flameDots.forEach((dot) => {
    dot.age += steps;
    dot.y += dot.speed * steps;
    // Pull toward the center of the nozzle so the flame tapers to a point.
    dot.x += (dot.nozzle.x - dot.x) * 0.032 * steps + (Math.random() - 0.5) * 0.7 * steps;
  });

  flameDots = flameDots.filter((dot) => dot.age < dot.life);
}

function drawFlames() {
  fireContext.clearRect(0, 0, fireWidth, fireHeight);
  // "lighter" adds overlapping colors together, which is what makes it glow.
  fireContext.globalCompositeOperation = "lighter";

  flameDots.forEach((dot) => {
    const progress = dot.age / dot.life;
    const heatLoss = progress + dot.edgeCooling;
    const passedPoints = FLAME_COOLING_POINTS.filter((point) => heatLoss > point).length;
    const colorIndex = passedPoints;
    const size = dot.size * (1 - progress * 0.6);

    // Squaring keeps the flame strong for longer, then fades it quickly at the tip.
    // Wider flames overlap more, so each of their dots is drawn a little fainter.
    const widthDimming = Math.min(1, 62 / dot.nozzle.width);
    fireContext.globalAlpha = (1 - progress * progress) * FLAME_BRIGHTNESS * widthDimming;
    fireContext.drawImage(flameDotImages[colorIndex], dot.x - size / 2, dot.y - size / 2, size, size);
  });

  fireContext.globalAlpha = 1;
}

function burnEngines(time) {
  if (!fireIsRunning) {
    return;
  }

  const steps = Math.min((time - lastFireTime) / (1000 / 60), 3);
  lastFireTime = time;

  updateFlames(steps, time);
  drawFlames();
  requestAnimationFrame(burnEngines);
}

function startEngines() {
  if (!fireIsRunning) {
    fireIsRunning = true;
    lastFireTime = performance.now();
    requestAnimationFrame(burnEngines);
  }
}

// --- Start everything --------------------------------------------------

measureEngines();
new ResizeObserver(measureEngines).observe(engineCanvas);

if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  // Less motion: run the fire once out of sight, then show it frozen.
  for (let frame = 0; frame < FLAME_LIFE_FRAMES * 2; frame++) {
    updateFlames(1, frame * 16);
  }
  drawFlames();
} else {
  // Only burn while the footer is on screen, to save the computer's effort.
  new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      startEngines();
    } else {
      fireIsRunning = false;
    }
  }).observe(engineBay);
}
