# Design — Destination Scanner (fuel range)

## Overview

A small, self-contained change to `app.js`. No new files, dependencies, or
layout changes. The existing cards, scan button, and success panel are reused.

## Existing structure

- `index.html` renders three `.destination-card` elements, each with a
  `data-destination` key, a `[data-field="status"]` label, and a disabled
  `[data-field="launch"]` button.
- `app.js` holds the fixed `DESTINATIONS` data, `AVAILABLE_FUEL`, a complete
  `setCardStatus(card, text, variant, launchEnabled)` helper, and the
  scan-button wiring.

## Change

Implement `scanDestination(card, destination)`:

1. Compare `destination.fuelRequired` with `AVAILABLE_FUEL`.
2. If `fuelRequired <= AVAILABLE_FUEL`, call
   `setCardStatus(card, "In range", "ok", false)`.
3. Otherwise call `setCardStatus(card, "Out of range", "danger", false)`.

Launch stays disabled for every card in this mission (always pass `false`).

## Non-goals

- No atmosphere check yet.
- No enabling of launch buttons.
- No redesign, refactor, or extra features.

## Manual verification

Open `index.html`, click "Scan destinations", and confirm:

- Ember → Out of range
- Hollow → In range
- Haven → In range
- All launch buttons remain disabled.
