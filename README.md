# KIROVERSE: The Last Shuttle 🚀

You are the engineer aboard the last shuttle leaving a collapsing star
system. The dashboard is online, but the **destination scanner is
incomplete**. Three planets are in the navigation database. Some require too
much fuel. Others may not support a safe landing.

Your mission: repair the scanner, check the evidence, and authorize one safe
launch. **Kiro is your engineering assistant. You remain responsible for the
launch decision.**

## Run it

No install, no build step. Just open the app in your browser:

- Double-click `index.html`, **or**
- Right-click `index.html` in Kiro and choose "Open with Live Preview" (or
  your editor's built-in preview).

You should see the fuel gauge (40 units), three destination cards, and a
"Scan destinations" button. Clicking Scan does nothing useful yet — that's
your job.

## Project map

```text
index.html     visual shell (complete)
styles.css     styling + status indicators (complete)
app.js         scanner logic — INTENTIONALLY INCOMPLETE (your work)
hero.js        cursor-following ghost in the hero (decoration, complete)
.kiro/
  steering/workshop.md               project rules Kiro should follow
  specs/destination-scanner/         the prepared feature spec
    requirements.md   what the feature must do (EARS criteria)
    design.md         how the small change fits the app
    tasks.md          the implementation task
```

## Your missions

### Mission 01 — Decode the flight plan
Read the prepared spec in `.kiro/specs/destination-scanner/` and the
`app.js` TODO. Can a destination requiring exactly 40 fuel be reached with
40 fuel available? (Yes — the check is "less than or equal to".)

### Mission 02 — Restore the scanner
Implement the fuel-range check. Suggested scoped prompt for Kiro:

```text
Implement only the fuel-range task in the prepared destination-scanner spec.
Follow the workspace Steering instructions.
Display In range when required fuel is less than or equal to available fuel;
otherwise display Out of range.
Keep all launch buttons disabled for now.
Do not redesign the page or implement additional features.
Summarize the changes and provide three short manual checks.
```

Expected after scanning:

| Destination | Status        | Launch   |
|-------------|---------------|----------|
| Ember       | Out of range  | disabled |
| Hollow      | In range      | disabled |
| Haven       | In range      | disabled |

### Mission 03 — The landing warning
Incoming telemetry: **Hollow has a toxic atmosphere.** Reachable does not
mean survivable. New rule: launch is allowed only when there is **enough
fuel AND a safe atmosphere.** Scoped prompt for Kiro:

```text
Apply this requirement update to the destination scanner:
launch is allowed only when required fuel <= available fuel AND
atmosphereSafe is true.

Status priority:
1. Not enough fuel: Out of range; launch disabled.
2. Enough fuel but unsafe atmosphere: Unsafe atmosphere; launch disabled.
3. Enough fuel and safe atmosphere: Safe to launch; launch enabled.

Preserve the existing layout and reuse the prepared success panel.
Keep the spec artifacts consistent with this small update; keep edits concise.
Do not add features, dependencies, or unrelated refactors.
Explain the change and give a brief verification checklist.
```

## Final verification

| Scenario                                         | Expected result                 |
|--------------------------------------------------|---------------------------------|
| Ember: 60 required, 40 available, safe           | Out of range; launch disabled   |
| Hollow: 25 required, 40 available, unsafe        | Unsafe atmosphere; launch disabled |
| Haven: 40 required, 40 available, safe           | Safe to launch; launch enabled  |
| Launch Haven                                     | Success panel appears           |
| Repeat scan                                      | Same state; no duplicates       |

When Haven launches, you'll see: **LAUNCH SUCCESSFUL. CREW SAFE. MISSION
COMPLETE.**

## Attribution

We used Kiro to help build this workshop's starter app and development
artifacts, then reviewed and tested the result. Today you'll use Kiro to
complete its mission logic.
