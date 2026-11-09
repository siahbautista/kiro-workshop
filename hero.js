// KIROVERSE hero: the ghost in the Kiro logo watches the mouse, and a small
// Kiro ghost follows the mouse around the hero.
// This is decoration only. The scanner logic lives in app.js.

const heroSection = document.querySelector(".hero");
const heroGhost = document.querySelector(".hero-ghost");

// How much of the remaining distance the ghost covers each frame (0 to 1).
const GHOST_SPEED = 0.18;
// While facing right the ghost floats just left of the cursor, looking at it.
const GHOST_OFFSET_X = -26;
const GHOST_MAX_TILT = 18;
// How quickly a ghost turns around (0 to 1).
const GHOST_TURN_SPEED = 0.25;

// Positions are measured from the top-left corner of the hero.
let ghostX = 0;
let ghostY = 0;
let targetX = 0;
let targetY = 0;
let ghostIsMoving = false;
// Facing: 1 is right, -1 is left. In between is the ghost mid-turn.
let ghostFacing = 1;
let ghostWantedFacing = 1;

function drawGhost(tilt) {
  heroGhost.style.transform = `translate(${ghostX}px, ${ghostY}px) rotate(${tilt}deg) scaleX(${ghostFacing})`;
}

function moveGhost() {
  const distanceX = targetX - ghostX;
  const distanceY = targetY - ghostY;

  ghostX += distanceX * GHOST_SPEED;
  ghostY += distanceY * GHOST_SPEED;
  const turnRemaining = ghostWantedFacing - ghostFacing;
  ghostFacing += turnRemaining * GHOST_TURN_SPEED;

  // Lean into the direction of travel.
  const tilt = Math.max(-GHOST_MAX_TILT, Math.min(GHOST_MAX_TILT, distanceX * 0.2));
  drawGhost(tilt);

  // Stop animating once the ghost has arrived.
  if (Math.abs(distanceX) < 0.1 && Math.abs(distanceY) < 0.1 && Math.abs(turnRemaining) < 0.01) {
    ghostIsMoving = false;
    return;
  }
  requestAnimationFrame(moveGhost);
}

function followCursor(event) {
  // Ignore touch, so swiping to scroll doesn't summon the ghost.
  if (event.pointerType === "touch") {
    return;
  }

  const heroBox = heroSection.getBoundingClientRect();
  const cursorX = event.clientX - heroBox.left;
  const cursorY = event.clientY - heroBox.top;
  const justEntered = !heroGhost.classList.contains("is-visible");

  // Turn to face the cursor once it crosses to the ghost's other side.
  if (justEntered) {
    ghostWantedFacing = 1;
  } else if (cursorX < ghostX) {
    ghostWantedFacing = -1;
  } else if (cursorX > ghostX) {
    ghostWantedFacing = 1;
  }

  // Multiplying by facing puts the ghost on whichever side keeps it looking at the cursor.
  targetX = cursorX + GHOST_OFFSET_X * ghostWantedFacing;
  targetY = cursorY;

  // When the mouse first enters, start right beside it instead of flying in.
  if (justEntered) {
    ghostX = targetX;
    ghostY = targetY;
    ghostFacing = 1;
    drawGhost(0);
    heroGhost.classList.add("is-visible");
  }

  if (!ghostIsMoving) {
    ghostIsMoving = true;
    requestAnimationFrame(moveGhost);
  }
}

function hideGhost() {
  heroGhost.classList.remove("is-visible");
}

// --- The ghost inside the logo -----------------------------------------

const heroLogo = document.querySelector(".hero-logo");
const logoGhost = document.querySelector(".logo-ghost");
const logoEyes = document.querySelector(".logo-eyes");

// These are in the logo's own drawing units (the logo is 1200 wide).
const LOGO_MAX_LEAN = 70;
const LOGO_MAX_LOOK = 45;
const LOGO_CENTER = 600;
// Degrees the ghost tilts when leaning all the way to one side.
const LOGO_MAX_TILT = 10;
// Pixels from the logo at which the ghost is looking as far as it can.
const LOGO_LOOK_RANGE = 350;
const LOGO_SMOOTHING = 0.15;
// The cursor must be this many pixels to one side before the ghost turns,
// so it doesn't flicker when the mouse is straight above or below it.
const LOGO_TURN_MARGIN = 12;

// Where the mouse is on screen. null means there is no mouse to look at.
let mouseX = null;
let mouseY = null;
// Which way the ghost is looking: -1 to 1 across, -1 to 1 down.
let lookX = 0;
let lookY = 0;
// Facing: 1 is right, -1 is left. In between is the ghost mid-turn.
let logoFacing = 1;
let logoWantedFacing = 1;

function rememberMouse(event) {
  if (event.pointerType === "touch") {
    return;
  }
  mouseX = event.clientX;
  mouseY = event.clientY;
}

function forgetMouse() {
  mouseX = null;
  mouseY = null;
  logoWantedFacing = 1;
}

// Which way an element should look to see the mouse. x and y go from -1 to 1
// and reach full strength at `range` pixels. offsetX is the mouse's sideways
// distance from the element in pixels.
function directionToMouse(element, range) {
  if (mouseX === null) {
    return { x: 0, y: 0, offsetX: 0 };
  }

  const box = element.getBoundingClientRect();
  const offsetX = mouseX - (box.left + box.width / 2);
  const offsetY = mouseY - (box.top + box.height / 2);
  const distance = Math.hypot(offsetX, offsetY);
  if (distance === 0) {
    return { x: 0, y: 0, offsetX: 0 };
  }

  const strength = Math.min(distance / range, 1);
  return {
    x: (offsetX / distance) * strength,
    y: (offsetY / distance) * strength,
    offsetX: offsetX,
  };
}

function animateLogoGhost(time) {
  const wanted = directionToMouse(heroLogo, LOGO_LOOK_RANGE);

  if (wanted.offsetX < -LOGO_TURN_MARGIN) {
    logoWantedFacing = -1;
  } else if (wanted.offsetX > LOGO_TURN_MARGIN) {
    logoWantedFacing = 1;
  }

  // Ease toward the wanted direction so the ghost never snaps.
  lookX += (wanted.x - lookX) * LOGO_SMOOTHING;
  lookY += (wanted.y - lookY) * LOGO_SMOOTHING;
  logoFacing += (logoWantedFacing - logoFacing) * GHOST_TURN_SPEED;

  // The ghost never rests: it bobs up and down and sways a little.
  const bob = Math.sin(time / 450) * 16;
  const sway = Math.sin(time / 900) * 2;

  const moveX = lookX * LOGO_MAX_LEAN;
  const moveY = lookY * LOGO_MAX_LEAN + bob;
  const tilt = lookX * LOGO_MAX_TILT + sway;
  logoGhost.setAttribute(
    "transform",
    `translate(${moveX} ${moveY}) rotate(${tilt} ${LOGO_CENTER} ${LOGO_CENTER}) ` +
      `translate(${LOGO_CENTER} 0) scale(${logoFacing} 1) translate(${-LOGO_CENTER} 0)`
  );

  // The eyes sit inside the flipped ghost, so their sideways move is flipped too.
  logoEyes.setAttribute(
    "transform",
    `translate(${lookX * LOGO_MAX_LOOK * logoFacing} ${lookY * LOGO_MAX_LOOK})`
  );

  requestAnimationFrame(animateLogoGhost);
}

// --- The giant ghost eclipsing the star --------------------------------

const eclipseGhost = document.querySelector(".eclipse-ghost");
const eclipseEyes = document.querySelector(".eclipse-eyes");

// Percent of the ghost's own size, so it scales with the star on any screen.
const ECLIPSE_MAX_LOOK = 3.75;
// It's huge, so it moves less and more slowly than the logo ghost.
const ECLIPSE_MAX_TILT = 3;
const ECLIPSE_LOOK_RANGE = 700;
const ECLIPSE_TURN_SPEED = 0.14;
// A wide margin, so it doesn't flip when the mouse passes over its middle.
const ECLIPSE_TURN_MARGIN = 60;

let eclipseLookX = 0;
let eclipseLookY = 0;
// It starts facing left, toward the title.
let eclipseFacing = -1;
let eclipseWantedFacing = -1;

function animateEclipse(time) {
  const wanted = directionToMouse(eclipseGhost, ECLIPSE_LOOK_RANGE);

  if (mouseX === null) {
    eclipseWantedFacing = -1;
  } else if (wanted.offsetX < -ECLIPSE_TURN_MARGIN) {
    eclipseWantedFacing = -1;
  } else if (wanted.offsetX > ECLIPSE_TURN_MARGIN) {
    eclipseWantedFacing = 1;
  }

  eclipseLookX += (wanted.x - eclipseLookX) * LOGO_SMOOTHING;
  eclipseLookY += (wanted.y - eclipseLookY) * LOGO_SMOOTHING;
  eclipseFacing += (eclipseWantedFacing - eclipseFacing) * ECLIPSE_TURN_SPEED;

  // A slow drift, heavier than the logo ghost's bob.
  const drift = Math.sin(time / 1400) * 6;
  const tilt = eclipseLookX * ECLIPSE_MAX_TILT;
  eclipseGhost.style.transform = `translateY(${drift}px) rotate(${tilt}deg) scaleX(${eclipseFacing})`;

  // The eyes sit inside the flipped ghost, so their sideways move is flipped too.
  const eyesX = eclipseLookX * ECLIPSE_MAX_LOOK * eclipseFacing;
  const eyesY = eclipseLookY * ECLIPSE_MAX_LOOK;
  eclipseEyes.style.transform = `translate(${eyesX}%, ${eyesY}%)`;

  requestAnimationFrame(animateEclipse);
}

// --- Start everything --------------------------------------------------

// People who ask for less motion keep a still logo and no moving ghost.
if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  heroSection.addEventListener("pointermove", followCursor);
  heroSection.addEventListener("pointerleave", hideGhost);

  window.addEventListener("pointermove", rememberMouse);
  document.documentElement.addEventListener("pointerleave", forgetMouse);
  requestAnimationFrame(animateLogoGhost);
  requestAnimationFrame(animateEclipse);
}
