// KIROVERSE: The Last Shuttle — Destination Scanner
// ---------------------------------------------------
// STARTER FILE. The visual shell and wiring work, but the mission
// logic is intentionally incomplete. Your job (with Kiro) is to
// implement the scanner as described in the destination-scanner spec.
//
// Do NOT redesign the page. Reuse the existing cards, controls, and
// success panel. See .kiro/steering/workshop.md for project rules.

// Available fuel for this launch window. Keep in sync with the fuel gauge.
const AVAILABLE_FUEL = 40;

// Fixed destination database. Do not add randomness or external data.
const DESTINATIONS = {
  ember: { fuelRequired: 60, atmosphereSafe: true },
  hollow: { fuelRequired: 25, atmosphereSafe: false },
  haven: { fuelRequired: 40, atmosphereSafe: true },
};

/**
 * Apply a status to a destination card.
 * Helper is complete — call it from scanDestination with the right values.
 *
 * @param {HTMLElement} card    the .destination-card element
 * @param {string} text         status label text (e.g. "In range")
 * @param {"ok"|"warn"|"danger"} variant  visual + icon treatment
 * @param {boolean} launchEnabled  whether the launch button is enabled
 */
function setCardStatus(card, text, variant, launchEnabled) {
  const statusEl = card.querySelector('[data-field="status"]');
  const launchBtn = card.querySelector('[data-field="launch"]');

  statusEl.textContent = text;
  statusEl.classList.remove("status-ok", "status-warn", "status-danger");
  statusEl.classList.add(`status-${variant}`);

  launchBtn.disabled = !launchEnabled;
}

/**
 * Scan a single destination card and set its status.
 *
 * TODO (Mission 02 — fuel range):
 *   Compare destination.fuelRequired with AVAILABLE_FUEL.
 *   - required <= available  -> "In range"      (variant "ok")
 *   - required >  available  -> "Out of range"  (variant "danger")
 *   Keep every launch button DISABLED for now (pass false to setCardStatus).
 *
 * Later missions will add the atmosphere-safety rule and enable launch.
 * Do not implement later missions until instructed.
 *
 * @param {HTMLElement} card
 * @param {{fuelRequired:number, atmosphereSafe:boolean}} destination
 */
function scanDestination(card, destination) {
  // TODO: implement the fuel-range check here.
}

/** Scan all destinations when the scan button is pressed. */
function scanAllDestinations() {
  const cards = document.querySelectorAll(".destination-card");
  cards.forEach((card) => {
    const key = card.dataset.destination;
    const destination = DESTINATIONS[key];
    if (destination) {
      scanDestination(card, destination);
    }
  });
}

/** Show the prepared success panel after a valid launch. */
function showSuccessPanel() {
  const panel = document.getElementById("success-panel");
  panel.hidden = false;
  panel.scrollIntoView({ behavior: "smooth", block: "center" });
}

// --- Wiring (complete) -------------------------------------------------

document.getElementById("scan-button").addEventListener("click", () => {
  scanAllDestinations();
});

// Launch buttons are wired, but stay disabled until the mission logic
// enables an eligible destination. Clicking an enabled button shows success.
document.querySelectorAll('[data-field="launch"]').forEach((btn) => {
  btn.addEventListener("click", () => {
    if (!btn.disabled) {
      showSuccessPanel();
    }
  });
});
