# Visual Examples Guide

This project is a visual tool. Codex will produce better results if target examples are available.

## 1. Example folder structure

```text
examples/
  target-diagrams/
  screenshots-market-tools/
  report-use-cases/
```

## 2. Target diagrams to prepare

Prepare images or sketches of these situations when available:

1. Straight 2+2 divided road.
2. Straight 3+2 asymmetric road.
3. Road segment with lane drop.
4. Median opening only.
5. U-turn pocket with taper and storage.
6. T-intersection with right-turn pocket.
7. Four-leg signalized intersection with stop lines and crosswalks.
8. Free-left slip lane with channelizing island.
9. Project driveway: left-in/left-out.
10. Single-lane roundabout.

## 3. How to describe a target diagram

For each image, add a small `.md` file with the same base name:

```text
example-id: uturn-pocket-01
use-case: TIA report concept
road-context: divided urban arterial
must-have-elements:
  - 2 through lanes per direction
  - raised median
  - median opening
  - U-turn pocket
  - taper
  - U-turn arrow
notes:
  - Concept drawing only, not construction layout.
```

## 4. What to avoid

Do not ask Codex to reproduce copyrighted software UI or proprietary drawings exactly.
Use screenshots only as functional references: workflow, component ideas, layout clarity, and visual hierarchy.

## 5. Visual acceptance criteria

A diagram is acceptable when:

- Lane directions are clear.
- Lane counts are easy to read.
- Median/shoulder/island components are visually distinct.
- Markings are not visually cluttered.
- Arrows communicate intended movements.
- Exported SVG/PNG is usable in a report or presentation without extra cleanup.
