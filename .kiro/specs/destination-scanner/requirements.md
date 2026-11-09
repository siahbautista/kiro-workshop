# Requirements — Destination Scanner (fuel range)

## Introduction

The shuttle dashboard lists three destinations but does not yet evaluate
them against available fuel. This feature restores the fuel-range scanner so
the engineer can see which destinations are reachable. Launch stays locked
until later launch-safety requirements are implemented.

## Fixed data

| Destination | Fuel required | Atmosphere | Available fuel |
|-------------|--------------:|------------|---------------:|
| Ember       | 60            | Safe       | 40             |
| Hollow      | 25            | Unsafe     | 40             |
| Haven       | 40            | Safe       | 40             |

## Acceptance criteria (EARS)

- WHEN the engineer scans destinations, THE SYSTEM SHALL compare each
  destination's fuel requirement with the available fuel.
- WHEN required fuel is less than or equal to available fuel, THE SYSTEM
  SHALL display "In range."
- WHEN required fuel exceeds available fuel, THE SYSTEM SHALL display
  "Out of range."
- THE SYSTEM SHALL keep launch controls disabled until the final
  launch-safety requirements are implemented.

## Boundary note

A destination requiring exactly 40 fuel with 40 available IS in range
(the comparison is "less than or equal to"). Haven sits on this boundary.
