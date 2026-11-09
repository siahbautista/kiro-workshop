// KIROVERSE flight plan: fuel bars pump up and their numbers count along.
// This is decoration only. The scanner logic lives in app.js.

// Every bar fills at this same speed, so Hollow stops first, Haven stops
// exactly on the fuel line, and Ember keeps climbing past it.
const MS_PER_FUEL_UNIT = 28;

const flightPlan = document.querySelector(".flight-plan");
let fuelFillId = null;

// One entry per planet. The real number stays in the page for screen readers;
// the moving number is a separate copy that is drawn over it.
const fuelBars = Array.from(document.querySelectorAll(".destination-card")).map((card) => {
  const realNumber = card.querySelector('[data-field="fuel-required"]');
  const movingNumber = document.createElement("span");
  movingNumber.className = "fuel-count";
  movingNumber.setAttribute("aria-hidden", "true");

  return { card, realNumber, movingNumber, fuelRequired: Number(realNumber.textContent) };
});

function showFuel(bar, amount) {
  // Never exactly zero: the bar's overshoot section divides by this number.
  bar.card.style.setProperty("--fuel-shown", Math.max(amount, 0.001));
  bar.movingNumber.textContent = Math.round(amount);
}

function fillFuelBars() {
  cancelAnimationFrame(fuelFillId);
  fuelBars.forEach((bar) => bar.card.classList.remove("fuel-settled"));
  const startTime = performance.now();

  function pumpFuel(now) {
    const fuelSoFar = (now - startTime) / MS_PER_FUEL_UNIT;
    let stillFilling = false;

    fuelBars.forEach((bar) => {
      showFuel(bar, Math.min(fuelSoFar, bar.fuelRequired));
      if (fuelSoFar < bar.fuelRequired) {
        stillFilling = true;
      } else {
        bar.card.classList.add("fuel-settled");
      }
    });

    if (stillFilling) {
      fuelFillId = requestAnimationFrame(pumpFuel);
    }
  }

  fuelFillId = requestAnimationFrame(pumpFuel);
}

// People who ask for less motion keep the finished chart, with no animation.
if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  fuelBars.forEach((bar) => {
    bar.card.querySelector(".destination-fuel").append(bar.movingNumber);
    bar.realNumber.classList.add("is-replaced");
    showFuel(bar, 0);
  });

  // Pump the fuel the first time the chart scrolls into view.
  const chartWatcher = new IntersectionObserver(
    (entries, watcher) => {
      if (entries[0].isIntersecting) {
        watcher.disconnect();
        flightPlan.classList.add("is-powered"); // the screen flickers on in styles.css
        fillFuelBars();
      }
    },
    { threshold: 0.35 }
  );
  chartWatcher.observe(flightPlan);

  // Pump again after a scan, but only once a scan has produced results.
  document.getElementById("scan-button").addEventListener("click", () => {
    if (document.querySelector(".status-ok, .status-warn, .status-danger")) {
      fillFuelBars();
    }
  });
}
